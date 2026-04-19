import { t as defaultFileSystem } from "../../../fileSystem-BGatODhf.mjs";
import path from "node:path";
import stringArgv from "string-argv";
import { P_UTILS } from "@lemons_dev/parsinom/lib/ParserUtils.js";
import { P } from "@lemons_dev/parsinom/lib/ParsiNOM.js";
import Moment from "moment";
//#region packages/repo-automation/src/utils/shellUtils.ts
function exec(c, cwd) {
	return Bun.spawn(stringArgv(c), { cwd });
}
async function $(cmd, cwd, verboseness = 1) {
	if (verboseness === 1 || verboseness === 2) if (cwd !== void 0) console.log(`\n${CMD_FMT.Bright}running${CMD_FMT.Reset} in ${cwd} - ${cmd}\n`);
	else console.log(`\n${CMD_FMT.Bright}running${CMD_FMT.Reset} - ${cmd}\n`);
	const proc = exec(cmd, cwd);
	const stdout = await new Response(proc.stdout).text();
	const stderr = await new Response(proc.stderr).text();
	if (verboseness === 2) {
		if (stdout !== "") console.log(stdout.split("\n").map((x) => `${CMD_FMT.FgGray}>${CMD_FMT.Reset} ${x}\n`).join(""));
		if (stderr !== "") console.log(stderr.split("\n").map((x) => `${CMD_FMT.FgRed}>${CMD_FMT.Reset} ${x}\n`).join(""));
	}
	const exit = await proc.exited;
	if (verboseness === 1 || verboseness === 2) if (exit === 0) console.log(`${CMD_FMT.FgGreen}success${CMD_FMT.Reset} - ${cmd}\n`);
	else console.log(`${CMD_FMT.FgRed}fail${CMD_FMT.Reset} - ${cmd} - code ${exit}\n`);
	return {
		stdout,
		stderr,
		exit
	};
}
async function $seq(cmds, onError, onSuccess, cwd, verboseness = 1) {
	const results = [];
	for (let i = 0; i < cmds.length; i += 1) {
		const cmd = cmds[i];
		const result = await $(cmd, cwd, verboseness);
		if (result.exit !== 0) {
			onError(cmd, i);
			return;
		}
		results.push(result);
	}
	onSuccess();
}
async function $input(message) {
	console.write(`${message} `);
	const reader = Bun.stdin.stream().getReader();
	const chunk = await reader.read();
	reader.releaseLock();
	return Buffer.from(chunk.value ?? "").toString().trim();
}
async function $choice(message, options) {
	console.log(`${message} `);
	const optionNumbers = /* @__PURE__ */ new Map();
	for (let i = 0; i < options.length; i++) {
		const option = options[i];
		console.log(`[${i}] ${option}`);
		optionNumbers.set(i.toString(), i);
	}
	let ret = void 0;
	while (ret === void 0) {
		const selectedStr = await $input(`Select [${[...optionNumbers.keys()].join("/")}]:`);
		ret = optionNumbers.get(selectedStr);
		if (ret === void 0) console.log(`${CMD_FMT.FgRed}invalid selection, please select a valid option${CMD_FMT.Reset}`);
	}
	return ret;
}
async function $confirm(message, onReject) {
	while (true) {
		const answer = await $input(`${message} [Y/N]?`);
		if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") return;
		if (answer.toLowerCase() === "n" || answer.toLowerCase() === "no") {
			onReject();
			return;
		}
		console.log(`${CMD_FMT.FgRed}invalid selection, please select a valid option${CMD_FMT.Reset}`);
	}
}
const CMD_FMT = {
	Reset: "\x1B[0m",
	Bright: "\x1B[1m",
	Dim: "\x1B[2m",
	Underscore: "\x1B[4m",
	Blink: "\x1B[5m",
	Reverse: "\x1B[7m",
	Hidden: "\x1B[8m",
	FgBlack: "\x1B[30m",
	FgRed: "\x1B[31m",
	FgGreen: "\x1B[32m",
	FgYellow: "\x1B[33m",
	FgBlue: "\x1B[34m",
	FgMagenta: "\x1B[35m",
	FgCyan: "\x1B[36m",
	FgWhite: "\x1B[37m",
	FgGray: "\x1B[90m",
	BgBlack: "\x1B[40m",
	BgRed: "\x1B[41m",
	BgGreen: "\x1B[42m",
	BgYellow: "\x1B[43m",
	BgBlue: "\x1B[44m",
	BgMagenta: "\x1B[45m",
	BgCyan: "\x1B[46m",
	BgWhite: "\x1B[47m",
	BgGray: "\x1B[100m"
};
//#endregion
//#region packages/repo-automation/src/utils/utils.ts
var UserError = class extends Error {};
//#endregion
//#region packages/repo-automation/src/utils/versionUtils.ts
var Version = class {
	major;
	minor;
	patch;
	constructor(major, minor, patch) {
		this.major = major;
		this.minor = minor;
		this.patch = patch;
	}
	toString() {
		return `${this.major}.${this.minor}.${this.patch}`;
	}
};
var CanaryVersion = class extends Version {
	canary;
	constructor(major, minor, patch, canary) {
		super(major, minor, patch);
		this.canary = canary;
	}
	toString() {
		return `${super.toString()}-canary.${this.canary}`;
	}
};
const numberParser = P_UTILS.digits().map((x) => Number.parseInt(x)).chain((x) => {
	if (Number.isNaN(x)) return P.fail("a number");
	else return P.succeed(x);
});
const canaryParser = P.sequenceMap((_, c1, c2, c3) => {
	return c1 + c2 + c3;
}, P.string("-canary."), P_UTILS.digit().repeat(8, 8).map((x) => x.join("")), P.string("T"), P_UTILS.digit().repeat(6, 6).map((x) => x.join("")));
const versionParser = P.or(P.sequenceMap((major, _1, minor, _2, patch) => {
	return new Version(major, minor, patch);
}, numberParser, P.string("."), numberParser, P.string("."), numberParser, P_UTILS.eof()), P.sequenceMap((major, _1, minor, _2, patch, canary) => {
	return new CanaryVersion(major, minor, patch, canary);
}, numberParser, P.string("."), numberParser, P.string("."), numberParser, canaryParser, P_UTILS.eof()));
function parseVersion(str) {
	const parserRes = versionParser.tryParse(str);
	if (parserRes.success) return parserRes.value;
	else throw new UserError(`failed to parse manifest version "${str}"`);
}
function stringifyVersion(version) {
	return version.toString();
}
function getIncrementOptions(version) {
	const canary = Moment().utcOffset(0).format("YYYYMMDDTHHmmss");
	return [
		new Version(version.major + 1, 0, 0),
		new Version(version.major, version.minor + 1, 0),
		new Version(version.major, version.minor, version.patch + 1),
		new CanaryVersion(version.major, version.minor, version.patch, canary)
	];
}
//#endregion
//#region packages/repo-automation/src/release.ts
function getRepoRoot() {
	const result = Bun.spawnSync([
		"git",
		"rev-parse",
		"--show-toplevel"
	], {
		cwd: process.cwd(),
		stdout: "pipe",
		stderr: "pipe"
	});
	if (result.exitCode !== 0) throw new UserError("failed to determine git repository root");
	const root = Buffer.from(result.stdout).toString().trim();
	if (root.length === 0) throw new UserError("git repository root is empty");
	return root;
}
function getRepoPath(repoRoot, fileName) {
	return path.join(repoRoot, fileName);
}
function parseJsonText(text, filePath, description) {
	try {
		return JSON.parse(text);
	} catch {
		throw new UserError(`${description} is not valid JSON: "${filePath}"`);
	}
}
async function readJsonFile(filePath, description, fileSystem = defaultFileSystem) {
	if (!await fileSystem.exists(filePath)) throw new UserError(`${description} not found at "${filePath}"`);
	return parseJsonText(await fileSystem.readText(filePath), filePath, description);
}
async function writeJsonFile(filePath, value, fileSystem = defaultFileSystem) {
	await fileSystem.writeText(filePath, JSON.stringify(value, null, "	"));
}
async function loadConfig(repoRoot, fileSystem = defaultFileSystem) {
	const localConfigPath = fileSystem.join(repoRoot, "repo-automation.config.json");
	if (await fileSystem.exists(localConfigPath)) {
		const localConfig = await readJsonFile(localConfigPath, "repo automation config", fileSystem);
		return {
			devBranch: localConfig.devBranch,
			releaseBranch: localConfig.releaseBranch,
			github: localConfig.github,
			preconditions: localConfig.preconditions
		};
	}
	throw new UserError(`repo automation config not found at "${localConfigPath}"`);
}
async function runPreconditions(preconditions) {
	if (!preconditions || preconditions.length === 0) return;
	await $seq(preconditions, (cmd) => {
		throw new UserError(`precondition "${cmd}" failed`);
	}, () => {}, void 0, 2);
	await $seq([`git add .`], () => {
		throw new UserError("failed to add preconditions changes to git");
	}, () => {}, void 0, 1);
	let changesToCommit = false;
	await $seq([`git diff --quiet`, `git diff --cached --quiet`], () => {
		changesToCommit = true;
	}, () => {}, void 0, 0);
	if (changesToCommit) await $seq([`git commit -m "[auto] run release preconditions"`], () => {
		throw new UserError("failed to add preconditions changes to git");
	}, () => {}, void 0, 1);
}
async function runRelease() {
	const repoRoot = getRepoRoot();
	const config = await loadConfig(repoRoot, defaultFileSystem);
	const manifestPath = defaultFileSystem.join(repoRoot, "manifest.json");
	const betaManifestPath = defaultFileSystem.join(repoRoot, "manifest-beta.json");
	const versionsPath = defaultFileSystem.join(repoRoot, "versions.json");
	const packagePath = defaultFileSystem.join(repoRoot, "package.json");
	console.log("looking for untracked changes ...");
	await $seq([
		`git add .`,
		`git diff --quiet`,
		`git diff --cached --quiet`,
		`git checkout ${config.devBranch}`
	], () => {
		throw new UserError("there are still untracked changes");
	}, () => {}, void 0, 0);
	console.log("\nrunning preconditions ...\n");
	await runPreconditions(config.preconditions);
	console.log("\nbumping versions ...\n");
	const manifest = await readJsonFile(manifestPath, "plugin manifest", defaultFileSystem);
	const versionString = manifest.version;
	const currentVersion = parseVersion(versionString);
	const currentVersionString = stringifyVersion(currentVersion);
	const versionIncrementOptions = getIncrementOptions(currentVersion);
	const newVersion = versionIncrementOptions[await $choice(`Current version "${currentVersionString}". Select new version`, versionIncrementOptions.map((x) => stringifyVersion(x)))];
	const newVersionString = stringifyVersion(newVersion);
	console.log("");
	await $confirm(`Version will be updated "${currentVersionString}" -> "${newVersionString}". Are you sure`, () => {
		throw new UserError("user canceled script");
	});
	if (!(newVersion instanceof CanaryVersion)) manifest.version = newVersionString;
	await writeJsonFile(manifestPath, manifest, defaultFileSystem);
	const betaManifest = structuredClone(manifest);
	betaManifest.version = newVersionString;
	await writeJsonFile(betaManifestPath, betaManifest, defaultFileSystem);
	if (!(newVersion instanceof CanaryVersion)) {
		const versionsJson = await readJsonFile(versionsPath, "plugin versions map", defaultFileSystem);
		versionsJson[newVersionString] = manifest.minAppVersion;
		await writeJsonFile(versionsPath, versionsJson, defaultFileSystem);
		const packageJson = await readJsonFile(packagePath, "plugin package.json", defaultFileSystem);
		packageJson.version = newVersionString;
		await writeJsonFile(packagePath, packageJson, defaultFileSystem);
	}
	await $seq([
		`bun run format`,
		`git add .`,
		`git commit -m "[auto] bump version to \`${newVersionString}\`"`
	], () => {
		throw new UserError("failed to add preconditions changes to git");
	}, () => {}, void 0, 1);
	console.log("\ncreating release tag ...\n");
	await $seq([
		`git checkout ${config.releaseBranch}`,
		`git merge ${config.devBranch} --commit -m "[auto] merge \`${newVersionString}\` release commit"`,
		`git push origin ${config.releaseBranch}`,
		`git tag -a ${newVersionString} -m "release version ${newVersionString}"`,
		`git push origin ${newVersionString}`,
		`git checkout ${config.devBranch}`,
		`git merge ${config.releaseBranch}`,
		`git push origin ${config.devBranch}`
	], () => {
		throw new UserError("failed to merge or create tag");
	}, () => {}, void 0, 1);
	console.log("");
	console.log(`${CMD_FMT.BgGreen}done${CMD_FMT.Reset}`);
	console.log(`${config.github}`);
	console.log(`${config.github}/releases/tag/${newVersionString}`);
}
if (import.meta.main) try {
	await runRelease();
} catch (e) {
	if (e instanceof UserError) console.error(e.message);
	else console.error(e);
}
//#endregion
export { getRepoPath, getRepoRoot, loadConfig, readJsonFile, runPreconditions, runRelease, writeJsonFile };
