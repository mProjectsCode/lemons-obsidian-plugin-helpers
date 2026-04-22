import path from 'node:path';
import { $, $choice, $confirm, $input, $seq, CMD_FMT, Verboseness } from './packages/repo-automation/src/utils/shellUtils';
import { UserError } from './packages/repo-automation/src/utils/utils';
import type { Version } from './packages/repo-automation/src/utils/versionUtils';
import { getIncrementOptions, parseVersion, stringifyVersion } from './packages/repo-automation/src/utils/versionUtils';

interface PackageTarget {
	id: 'helpers' | 'automation';
	name: string;
	packageJsonPath: string;
	tagPrefix: string;
}

interface PackageJsonVersionOnly {
	version: string;
}

const PACKAGE_TARGETS: readonly PackageTarget[] = [
	{
		id: 'helpers',
		name: '@lemons_dev/lemons-obsidian-plugin-helpers',
		packageJsonPath: 'packages/helpers/package.json',
		tagPrefix: 'helpers-v',
	},
	{
		id: 'automation',
		name: '@lemons_dev/lemons-obsidian-plugin-automation',
		packageJsonPath: 'packages/repo-automation/package.json',
		tagPrefix: 'automation-v',
	},
];

async function getRepoRoot(): Promise<string> {
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

async function readPackageVersion(packageJsonPath: string): Promise<string> {
	const file = Bun.file(packageJsonPath);
	if (!(await file.exists())) {
		throw new UserError(`package file not found: ${packageJsonPath}`);
	}

	const parsed = (await file.json()) as Partial<PackageJsonVersionOnly>;
	if (parsed.version === undefined || parsed.version.trim().length === 0) {
		throw new UserError(`package file has no valid version: ${packageJsonPath}`);
	}

	return parsed.version;
}

async function writePackageVersion(packageJsonPath: string, version: string): Promise<void> {
	const parsed = (await Bun.file(packageJsonPath).json()) as Record<string, unknown>;
	parsed.version = version;
	await Bun.write(packageJsonPath, `${JSON.stringify(parsed, null, '\t')}\n`);
}

function pickStableIncrementOptions(currentVersion: Version): [Version, Version, Version] {
	const [major, minor, patch] = getIncrementOptions(currentVersion);
	return [major, minor, patch];
}

async function ensureCleanWorkingTree(repoRoot: string): Promise<void> {
	await $seq(
		['git diff --quiet', 'git diff --cached --quiet'],
		() => {
			throw new UserError('working tree is dirty. commit or stash changes before releasing');
		},
		() => {},
		repoRoot,
		Verboseness.QUITET,
	);
}

async function askForVersion(currentVersionString: string): Promise<string> {
	const currentVersion = parseVersion(currentVersionString);
	const [major, minor, patch] = pickStableIncrementOptions(currentVersion);
	const options = [stringifyVersion(major), stringifyVersion(minor), stringifyVersion(patch), 'custom'];
	const selected = await $choice(`Current version is ${currentVersionString}. Select new version`, options);

	if (options[selected] !== 'custom') {
		return options[selected];
	}

	while (true) {
		const customVersion = await $input('Enter custom semver (for example 1.2.3):');
		try {
			parseVersion(customVersion);
			return customVersion;
		} catch {
			console.log(`${CMD_FMT.FgRed}invalid version, expected format like 1.2.3${CMD_FMT.Reset}`);
		}
	}
}

export async function runMonorepoRelease(): Promise<void> {
	const repoRoot = await getRepoRoot();
	await ensureCleanWorkingTree(repoRoot);

	const packageLabels: string[] = [];
	for (const target of PACKAGE_TARGETS) {
		const packageVersion = await readPackageVersion(path.join(repoRoot, target.packageJsonPath));
		packageLabels.push(`${target.name} (${packageVersion})`);
	}

	const selectedIndex = await $choice('Select package to release', packageLabels);
	const target = PACKAGE_TARGETS[selectedIndex];
	const packageJsonPath = path.join(repoRoot, target.packageJsonPath);
	const currentVersion = await readPackageVersion(packageJsonPath);
	const nextVersion = await askForVersion(currentVersion);
	const tag = `${target.tagPrefix}${nextVersion}`;

	await $confirm(`Release ${target.name}: ${currentVersion} -> ${nextVersion} with tag ${tag}?`, () => {
		throw new UserError('user canceled release');
	});

	await writePackageVersion(packageJsonPath, nextVersion);

	await $seq(
		[`git add ${target.packageJsonPath}`, `git commit -m "[release] ${target.name} ${nextVersion}"`, `git push`],
		() => {
			throw new UserError('failed to create release commit/tag');
		},
		() => {},
		repoRoot,
		Verboseness.NORMAL,
	);

	console.log(`${CMD_FMT.FgGreen}prepared release for ${target.name}. remember to run \n> npm publish -w ${target.name} --access public${CMD_FMT.Reset}`);
}

if (import.meta.main) {
	try {
		await runMonorepoRelease();
	} catch (error) {
		if (error instanceof UserError) {
			console.error(error.message);
			process.exit(1);
		}

		console.error(error);
		process.exit(1);
	}
}
