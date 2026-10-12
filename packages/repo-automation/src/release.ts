import path from 'node:path';
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

export async function runPreconditions(preconditions: string[] | undefined): Promise<void> {
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
		undefined,
		Verboseness.VERBOSE,
	);

	const status = await $('git status --porcelain', undefined, Verboseness.QUITET);
	if (status.exit !== 0 || status.stdout.trim()) {
		throw new UserError('Release preconditions changed the working tree; inspect changes before continuing');
	}
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

export async function runRelease(): Promise<void> {
	const repoRoot = await getRepoRoot();
	const config = await loadConfig(repoRoot, defaultFileSystem);

	const manifestPath = defaultFileSystem.join(repoRoot, 'manifest.json');

	console.log('looking for untracked changes ...');

	const status = await $('git status --porcelain', undefined, Verboseness.QUITET);
	if (status.exit !== 0 || status.stdout.trim()) {
		throw new UserError('Working tree must be clean before release preparation');
	}
	const branch = await $('git branch --show-current', undefined, Verboseness.QUITET);
	if (branch.exit !== 0 || branch.stdout.trim() !== config.devBranch) {
		throw new UserError(`Switch to ${config.devBranch} before release preparation`);
	}

	console.log('\nrunning preconditions ...\n');

	await runPreconditions(config.preconditions);

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

	await prepareVersionMetadata(repoRoot, newVersion);

	console.log(`${CMD_FMT.BgGreen}Prepared ${newVersionString}${CMD_FMT.Reset}`);
	console.log(
		newVersion instanceof CanaryVersion
			? 'Stable metadata is unchanged. Tag this commit with the prepared canary version explicitly.'
			: 'Review the manifest/package/version changes, then commit and publish explicitly.',
	);
	console.log(config.github);
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
	}
}
