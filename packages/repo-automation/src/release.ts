import path from 'node:path';
import { readChangelogEntry } from './changelog';
export { writeReleaseNotes } from './changelog';
import type { FileSystem } from './utils/fileSystem';
import { defaultFileSystem } from './utils/fileSystem';
import { $, $choice, $confirm, $seq, CMD_FMT, Verboseness } from './utils/shellUtils';
import { UserError } from './utils/utils';
import type { Version } from './utils/versionUtils';
import { CanaryVersion, getIncrementOptions, parseVersion, stringifyVersion } from './utils/versionUtils';

export interface RepoAutomationConfig {
	devBranch: string;
	releaseBranch: string;
	github: string;
	preconditions?: string[];
}

export interface PluginManifest {
	version: string;
	minAppVersion: string;
}

export interface PluginPackageJson {
	version: string;
}

type VersionsJson = Record<string, string>;

export async function getRepoRoot(): Promise<string> {
	const result = await $('git rev-parse --show-toplevel', undefined, Verboseness.QUITET);

	if (result.exit !== 0) {
		throw new UserError('failed to determine git repository root');
	}

	const root = result.stdout.trim();
	if (root.length === 0) {
		throw new UserError('git repository root is empty');
	}

	return root;
}

export function getRepoPath(repoRoot: string, fileName: string): string {
	return path.join(repoRoot, fileName);
}

function parseJsonText<T>(text: string, filePath: string, description: string): T {
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new UserError(`${description} is not valid JSON: "${filePath}"`);
	}
}

export async function readJsonFile<T>(filePath: string, description: string, fileSystem: FileSystem = defaultFileSystem): Promise<T> {
	if (!(await fileSystem.exists(filePath))) {
		throw new UserError(`${description} not found at "${filePath}"`);
	}

	const text = await fileSystem.readText(filePath);
	return parseJsonText<T>(text, filePath, description);
}

export async function writeJsonFile(filePath: string, value: unknown, fileSystem: FileSystem = defaultFileSystem): Promise<void> {
	await fileSystem.writeText(filePath, JSON.stringify(value, null, '\t') + '\n');
}

export async function loadConfig(repoRoot: string, fileSystem: FileSystem = defaultFileSystem): Promise<RepoAutomationConfig> {
	const localConfigPath = fileSystem.join(repoRoot, 'repo-automation.config.json');

	if (await fileSystem.exists(localConfigPath)) {
		const localConfig = await readJsonFile<RepoAutomationConfig>(localConfigPath, 'repo automation config', fileSystem);
		return {
			devBranch: localConfig.devBranch,
			releaseBranch: localConfig.releaseBranch,
			github: localConfig.github,
			preconditions: localConfig.preconditions,
		};
	}

	throw new UserError(`repo automation config not found at "${localConfigPath}"`);
}

export async function runPreconditions(preconditions: string[] | undefined, repoRoot?: string): Promise<void> {
	if (!preconditions || preconditions.length === 0) {
		return;
	}

	// run preconditions
	await $seq(
		preconditions,
		(cmd: string) => {
			throw new UserError(`precondition "${cmd}" failed`);
		},
		() => {},
		repoRoot,
		Verboseness.VERBOSE,
	);
}

/** Select the manifest shipped by a tagged release in its disposable build checkout. */
export async function prepareReleaseManifest(repoRoot: string, tag: string, fileSystem: FileSystem = defaultFileSystem): Promise<void> {
	const version = parseVersion(tag);
	const manifestPath = fileSystem.join(repoRoot, 'manifest.json');
	const manifest = await readJsonFile<PluginManifest>(manifestPath, 'plugin manifest', fileSystem);
	if (version instanceof CanaryVersion) {
		const base = `${version.major}.${version.minor}.${version.patch}`;
		if (base !== manifest.version) {
			throw new UserError(`Canary base ${base} does not match stable manifest version ${manifest.version}`);
		}
		manifest.version = tag;
		await writeJsonFile(manifestPath, manifest, fileSystem);
	} else if (manifest.version !== tag) {
		throw new UserError(`Stable tag ${tag} does not match manifest version ${manifest.version}`);
	}
}

export async function prepareVersionMetadata(repoRoot: string, version: Version, fileSystem: FileSystem = defaultFileSystem): Promise<void> {
	// Canary versions live in tags and release assets; stable metadata stays byte-for-byte unchanged.
	if (version instanceof CanaryVersion) {
		return;
	}
	const manifestPath = fileSystem.join(repoRoot, 'manifest.json');
	const versionsPath = fileSystem.join(repoRoot, 'versions.json');
	const packagePath = fileSystem.join(repoRoot, 'package.json');
	const manifest = await readJsonFile<PluginManifest>(manifestPath, 'plugin manifest', fileSystem);
	const versions = await readJsonFile<VersionsJson>(versionsPath, 'plugin versions map', fileSystem);
	const metadata = await readJsonFile<PluginPackageJson>(packagePath, 'plugin package.json', fileSystem);
	const versionString = stringifyVersion(version);
	manifest.version = versionString;
	versions[versionString] = manifest.minAppVersion;
	metadata.version = versionString;
	await writeJsonFile(manifestPath, manifest, fileSystem);
	await writeJsonFile(versionsPath, versions, fileSystem);
	await writeJsonFile(packagePath, metadata, fileSystem);
}

/** Validate and confirm notes before touching any version metadata or the changelog. */
export async function prepareReleaseVersion(
	repoRoot: string,
	version: Version,
	confirmNotes: (notes: string) => Promise<void>,
	fileSystem: FileSystem = defaultFileSystem,
): Promise<void> {
	const entry = await readChangelogEntry(repoRoot, stringifyVersion(version), true, fileSystem, true);
	await confirmNotes(entry.notes);
	await prepareVersionMetadata(repoRoot, version, fileSystem);
	const changelogPath = fileSystem.join(repoRoot, 'CHANGELOG.md');
	if (!(await fileSystem.exists(changelogPath)) || entry.content !== (await fileSystem.readText(changelogPath))) {
		await fileSystem.writeText(changelogPath, entry.content);
	}
}

async function runGit(repoRoot: string, ...args: string[]): Promise<string> {
	console.log(`git ${args.join(' ')}`);
	const proc = Bun.spawn(['git', ...args], { cwd: repoRoot, stdout: 'pipe', stderr: 'pipe' });
	const [stdout, stderr, exit] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
	if (exit !== 0) {
		throw new UserError(`git ${args.join(' ')} failed: ${stderr.trim() || stdout.trim()}`);
	}
	return stdout.trim();
}

/** Commit prepared changes and publish both branches and the annotated release tag. */
export async function publishRelease(repoRoot: string, config: RepoAutomationConfig, version: string): Promise<void> {
	// Reject an existing tag before creating any commits or changing branches.
	const tags = await runGit(repoRoot, 'tag', '--list', version);
	if (tags) {
		throw new UserError(`Release tag ${version} already exists`);
	}
	await runGit(repoRoot, 'add', '--all');
	if (await runGit(repoRoot, 'diff', '--cached', '--name-only')) {
		await runGit(repoRoot, 'commit', '-m', `[auto] bump version to ${version}`);
	}
	if (config.releaseBranch !== config.devBranch) {
		await runGit(repoRoot, 'checkout', config.releaseBranch);
		await runGit(repoRoot, 'merge', config.devBranch, '--no-edit');
	}
	await runGit(repoRoot, 'tag', '-a', version, '-m', `release version ${version}`);
	if (config.releaseBranch !== config.devBranch) {
		await runGit(repoRoot, 'checkout', config.devBranch);
		await runGit(repoRoot, 'merge', config.releaseBranch, '--no-edit');
	}
	// Publish together so a rejected branch update cannot publish a tag on its own.
	const refs = [...new Set([config.devBranch, config.releaseBranch])].map(branch => `refs/heads/${branch}`);
	await runGit(repoRoot, 'push', '--atomic', 'origin', ...refs, `refs/tags/${version}`);
}

export async function runRelease(): Promise<void> {
	const repoRoot = await getRepoRoot();
	const config = await loadConfig(repoRoot, defaultFileSystem);

	const manifestPath = defaultFileSystem.join(repoRoot, 'manifest.json');

	console.log('looking for untracked changes ...');

	const status = await $('git status --porcelain', undefined, Verboseness.QUITET);
	if (status.exit !== 0 || status.stdout.trim()) {
		throw new UserError('Working tree must be clean before release');
	}
	await runGit(repoRoot, 'checkout', config.devBranch);
	await runGit(repoRoot, 'rev-parse', '--verify', `refs/heads/${config.releaseBranch}`);

	console.log('\nrunning preconditions ...\n');

	await runPreconditions(config.preconditions, repoRoot);

	console.log('\nbumping versions ...\n');

	const manifest = await readJsonFile<PluginManifest>(manifestPath, 'plugin manifest', defaultFileSystem);

	const versionString: string = manifest.version;
	const currentVersion: Version = parseVersion(versionString);
	const currentVersionString = stringifyVersion(currentVersion);

	const versionIncrementOptions = getIncrementOptions(currentVersion);

	const selectedIndex = await $choice(
		`Current version "${currentVersionString}". Select new version`,
		versionIncrementOptions.map(x => stringifyVersion(x)),
	);
	const newVersion = versionIncrementOptions[selectedIndex];
	const newVersionString = stringifyVersion(newVersion);

	console.log('');

	await $confirm(`Version will be updated "${currentVersionString}" -> "${newVersionString}". Are you sure`, () => {
		throw new UserError('user canceled script');
	});

	await prepareReleaseVersion(repoRoot, newVersion, async notes => {
		if (!notes) {
			const choice = await $choice('No release notes found for this version.', ['Continue without release notes', 'Cancel release']);
			if (choice !== 0) {
				throw new UserError('user canceled script');
			}
			return;
		}
		console.log(`\nRelease notes for ${newVersionString}:\n\n${notes}\n`);
		await $confirm('Use this changelog entry', () => {
			throw new UserError('user canceled script');
		});
	});

	await $seq(
		['bun run format'],
		() => {
			throw new UserError('Release formatting failed');
		},
		() => {},
		repoRoot,
		Verboseness.VERBOSE,
	);
	await publishRelease(repoRoot, config, newVersionString);
	console.log(`${CMD_FMT.BgGreen}Released ${newVersionString}${CMD_FMT.Reset}`);
	console.log(`${config.github}/releases/tag/${newVersionString}`);
}

if (import.meta.main) {
	try {
		await runRelease();
	} catch (e) {
		if (e instanceof UserError) {
			console.error(e.message);
		} else {
			console.error(e);
		}
		process.exitCode = 1;
	}
}
