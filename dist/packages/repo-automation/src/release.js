import path from 'node:path';
import { defaultFileSystem } from './utils/fileSystem';
import { $choice, $confirm, $seq, CMD_FMT, Verboseness } from './utils/shellUtils';
import { UserError } from './utils/utils';
import { CanaryVersion, getIncrementOptions, parseVersion, stringifyVersion } from './utils/versionUtils';
export function getRepoRoot() {
    const result = Bun.spawnSync(['git', 'rev-parse', '--show-toplevel'], {
        cwd: process.cwd(),
        stdout: 'pipe',
        stderr: 'pipe',
    });
    if (result.exitCode !== 0) {
        throw new UserError('failed to determine git repository root');
    }
    const root = Buffer.from(result.stdout).toString().trim();
    if (root.length === 0) {
        throw new UserError('git repository root is empty');
    }
    return root;
}
export function getRepoPath(repoRoot, fileName) {
    return path.join(repoRoot, fileName);
}
function parseJsonText(text, filePath, description) {
    try {
        return JSON.parse(text);
    }
    catch {
        throw new UserError(`${description} is not valid JSON: "${filePath}"`);
    }
}
export async function readJsonFile(filePath, description, fileSystem = defaultFileSystem) {
    if (!(await fileSystem.exists(filePath))) {
        throw new UserError(`${description} not found at "${filePath}"`);
    }
    const text = await fileSystem.readText(filePath);
    return parseJsonText(text, filePath, description);
}
export async function writeJsonFile(filePath, value, fileSystem = defaultFileSystem) {
    await fileSystem.writeText(filePath, JSON.stringify(value, null, '\t'));
}
export async function loadConfig(repoRoot, fileSystem = defaultFileSystem) {
    const localConfigPath = fileSystem.join(repoRoot, 'repo-automation.config.json');
    if (await fileSystem.exists(localConfigPath)) {
        const localConfig = await readJsonFile(localConfigPath, 'repo automation config', fileSystem);
        return {
            devBranch: localConfig.devBranch,
            releaseBranch: localConfig.releaseBranch,
            github: localConfig.github,
            preconditions: localConfig.preconditions,
        };
    }
    throw new UserError(`repo automation config not found at "${localConfigPath}"`);
}
export async function runPreconditions(preconditions) {
    if (!preconditions || preconditions.length === 0) {
        return;
    }
    // run preconditions
    await $seq(preconditions, (cmd) => {
        throw new UserError(`precondition "${cmd}" failed`);
    }, () => { }, undefined, Verboseness.VERBOSE);
    // add changed files
    await $seq([`git add .`], () => {
        throw new UserError('failed to add preconditions changes to git');
    }, () => { }, undefined, Verboseness.NORMAL);
    // check if there were any changes
    let changesToCommit = false;
    await $seq([`git diff --quiet`, `git diff --cached --quiet`], () => {
        changesToCommit = true;
    }, () => { }, undefined, Verboseness.QUITET);
    // if there were any changes, commit them
    if (changesToCommit) {
        await $seq([`git commit -m "[auto] run release preconditions"`], () => {
            throw new UserError('failed to add preconditions changes to git');
        }, () => { }, undefined, Verboseness.NORMAL);
    }
}
export async function runRelease() {
    const repoRoot = getRepoRoot();
    const config = await loadConfig(repoRoot, defaultFileSystem);
    const manifestPath = defaultFileSystem.join(repoRoot, 'manifest.json');
    const betaManifestPath = defaultFileSystem.join(repoRoot, 'manifest-beta.json');
    const versionsPath = defaultFileSystem.join(repoRoot, 'versions.json');
    const packagePath = defaultFileSystem.join(repoRoot, 'package.json');
    console.log('looking for untracked changes ...');
    // check for any uncommited files and exit if there are any
    await $seq([`git add .`, `git diff --quiet`, `git diff --cached --quiet`, `git checkout ${config.devBranch}`], () => {
        throw new UserError('there are still untracked changes');
    }, () => { }, undefined, Verboseness.QUITET);
    console.log('\nrunning preconditions ...\n');
    await runPreconditions(config.preconditions);
    console.log('\nbumping versions ...\n');
    const manifest = await readJsonFile(manifestPath, 'plugin manifest', defaultFileSystem);
    const versionString = manifest.version;
    const currentVersion = parseVersion(versionString);
    const currentVersionString = stringifyVersion(currentVersion);
    const versionIncrementOptions = getIncrementOptions(currentVersion);
    const selectedIndex = await $choice(`Current version "${currentVersionString}". Select new version`, versionIncrementOptions.map(x => stringifyVersion(x)));
    const newVersion = versionIncrementOptions[selectedIndex];
    const newVersionString = stringifyVersion(newVersion);
    console.log('');
    await $confirm(`Version will be updated "${currentVersionString}" -> "${newVersionString}". Are you sure`, () => {
        throw new UserError('user canceled script');
    });
    if (!(newVersion instanceof CanaryVersion)) {
        manifest.version = newVersionString;
    }
    await writeJsonFile(manifestPath, manifest, defaultFileSystem);
    const betaManifest = structuredClone(manifest);
    betaManifest.version = newVersionString;
    await writeJsonFile(betaManifestPath, betaManifest, defaultFileSystem);
    if (!(newVersion instanceof CanaryVersion)) {
        const versionsJson = await readJsonFile(versionsPath, 'plugin versions map', defaultFileSystem);
        versionsJson[newVersionString] = manifest.minAppVersion;
        await writeJsonFile(versionsPath, versionsJson, defaultFileSystem);
        const packageJson = await readJsonFile(packagePath, 'plugin package.json', defaultFileSystem);
        packageJson.version = newVersionString;
        await writeJsonFile(packagePath, packageJson, defaultFileSystem);
    }
    await $seq([`bun run format`, `git add .`, `git commit -m "[auto] bump version to \`${newVersionString}\`"`], () => {
        throw new UserError('failed to add preconditions changes to git');
    }, () => { }, undefined, Verboseness.NORMAL);
    console.log('\ncreating release tag ...\n');
    await $seq([
        `git checkout ${config.releaseBranch}`,
        `git merge ${config.devBranch} --commit -m "[auto] merge \`${newVersionString}\` release commit"`,
        `git push origin ${config.releaseBranch}`,
        `git tag -a ${newVersionString} -m "release version ${newVersionString}"`,
        `git push origin ${newVersionString}`,
        `git checkout ${config.devBranch}`,
        `git merge ${config.releaseBranch}`,
        `git push origin ${config.devBranch}`,
    ], () => {
        throw new UserError('failed to merge or create tag');
    }, () => { }, undefined, Verboseness.NORMAL);
    console.log('');
    console.log(`${CMD_FMT.BgGreen}done${CMD_FMT.Reset}`);
    console.log(`${config.github}`);
    console.log(`${config.github}/releases/tag/${newVersionString}`);
}
if (import.meta.main) {
    try {
        await runRelease();
    }
    catch (e) {
        if (e instanceof UserError) {
            console.error(e.message);
        }
        else {
            console.error(e);
        }
    }
}
