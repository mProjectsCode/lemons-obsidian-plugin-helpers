import { t as defaultFileSystem } from "../../../fileSystem-BGatODhf.mjs";
import { spawn } from "node:child_process";
import { promises } from "node:fs";
import path from "node:path";
//#region packages/repo-automation/src/build/dtsBundlePlugin.ts
const DECLARABLE_SYMBOL = "(?:abstract\\s+)?(?:class|function|const|let|var|enum|namespace|interface|type)";
function normalizePathLike(value) {
	return value.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}
function assertNonEmptyOption(name, value) {
	if (value.trim().length === 0) throw new Error(`[dts-bundle-plugin] Invalid option \"${name}\": value cannot be empty.`);
}
function resolveOptions(rootDir, options) {
	assertNonEmptyOption("sourceDir", options.sourceDir);
	assertNonEmptyOption("tempDir", options.tempDir);
	assertNonEmptyOption("outputFile", options.outputFile);
	assertNonEmptyOption("modulePrefix", options.modulePrefix);
	const sourceDir = normalizePathLike(options.sourceDir);
	const tempDir = normalizePathLike(options.tempDir);
	const outputFile = normalizePathLike(options.outputFile);
	const modulePrefix = normalizePathLike(options.modulePrefix);
	if (outputFile.endsWith("/")) throw new Error("[dts-bundle-plugin] Invalid option \"outputFile\": expected a file path, got a directory.");
	if (!outputFile.endsWith(".d.ts")) throw new Error("[dts-bundle-plugin] Invalid option \"outputFile\": expected a .d.ts file path.");
	if (tempDir === sourceDir || tempDir.startsWith(`${sourceDir}/`)) throw new Error("[dts-bundle-plugin] Invalid option \"tempDir\": must be outside sourceDir.");
	return {
		rootDir,
		sourceDir,
		tempDir,
		outputFile,
		modulePrefix
	};
}
function normalizeSpecifier(specifier) {
	return specifier.replace(/\\/g, "/").replace(/\.d\.ts$/i, "").replace(/\.(ts|tsx|mts|cts)$/i, "");
}
function resolveModuleSpecifier(currentModuleId, specifier, context) {
	if (specifier.startsWith(".")) {
		const currentDir = path.posix.dirname(currentModuleId);
		return normalizeSpecifier(path.posix.normalize(path.posix.join(currentDir, specifier)));
	}
	if (specifier.startsWith(`${context.sourceDirPrefix}/`)) return normalizeSpecifier(specifier.replace(new RegExp(`^${context.sourceDirPrefix}/`), `${context.modulePrefix}/`));
	if (specifier.startsWith("src/")) return normalizeSpecifier(`${context.modulePrefix}/${specifier.slice(4)}`);
	return specifier;
}
function rewriteSpecifiers(content, currentModuleId, context) {
	let rewritten = content.replace(/(from\s+['"])([^'"]+)(['"])/g, (_match, p1, specifier, p3) => {
		return `${p1}${resolveModuleSpecifier(currentModuleId, specifier, context)}${p3}`;
	}).replace(/(import\(['"])([^'"]+)(['"]\))/g, (_match, p1, specifier, p3) => {
		return `${p1}${resolveModuleSpecifier(currentModuleId, specifier, context)}${p3}`;
	}).replace(/(export\s+\*\s+from\s+['"])([^'"]+)(['"])/g, (_match, p1, specifier, p3) => {
		return `${p1}${resolveModuleSpecifier(currentModuleId, specifier, context)}${p3}`;
	}).replace(/(import\s+['"])([^'"]+)(['"]\s*;?)/g, (_match, p1, specifier, p3) => {
		return `${p1}${resolveModuleSpecifier(currentModuleId, specifier, context)}${p3}`;
	});
	rewritten = rewritten.replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*$/gm, "");
	rewritten = rewritten.replace(/^\s*export\s*\{\s*\};?\s*$/gm, "");
	rewritten = rewritten.replace(new RegExp(`^(\\s*export\\s+)declare(\\s+${DECLARABLE_SYMBOL}\\b)`, "gm"), "$1$2").replace(new RegExp(`^(\\s*)declare(\\s+${DECLARABLE_SYMBOL}\\b)`, "gm"), "$1$2");
	return rewritten.trimEnd();
}
async function collectDtsFiles(dir) {
	const entries = await promises.readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const absPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...await collectDtsFiles(absPath));
			continue;
		}
		if (entry.isFile() && entry.name.endsWith(".d.ts")) files.push(absPath);
	}
	return files;
}
async function runTsc(projectPath, cwd) {
	const tscJsPath = path.resolve(cwd, "node_modules/typescript/lib/tsc.js");
	await promises.access(tscJsPath);
	await new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [
			tscJsPath,
			"--project",
			projectPath
		], {
			cwd,
			stdio: "inherit"
		});
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(/* @__PURE__ */ new Error(`tsc exited with code ${code}`));
		});
	});
}
async function bundleTypes(options) {
	const tempTsConfigPath = path.join(options.rootDir, `.tsconfig.types.generated.${process.pid}.json`);
	const sourceTsGlob = `${options.sourceDir.replace(/\\/g, "/")}/**/*.ts`;
	const sourceDtsGlob = `${options.sourceDir.replace(/\\/g, "/")}/**/*.d.ts`;
	const tempOutDir = path.join(options.rootDir, options.tempDir);
	const outputFilePath = path.join(options.rootDir, options.outputFile);
	const sourceDirPath = path.join(options.rootDir, options.sourceDir);
	const rewriteContext = {
		modulePrefix: options.modulePrefix,
		sourceDirPrefix: options.sourceDir
	};
	await promises.access(sourceDirPath);
	const tempTsConfig = {
		extends: "./tsconfig.json",
		compilerOptions: {
			declaration: true,
			emitDeclarationOnly: true,
			declarationMap: false,
			stripInternal: true,
			rootDir: options.sourceDir,
			outDir: options.tempDir
		},
		include: [sourceTsGlob, sourceDtsGlob],
		exclude: ["**/*.test.ts", "**/*.spec.ts"]
	};
	await promises.rm(tempOutDir, {
		recursive: true,
		force: true
	});
	await promises.writeFile(tempTsConfigPath, `${JSON.stringify(tempTsConfig, null, 2)}\n`, "utf8");
	try {
		await runTsc(tempTsConfigPath, options.rootDir);
		const files = (await collectDtsFiles(tempOutDir)).filter((file) => !file.endsWith(".d.ts.map")).sort((a, b) => a.localeCompare(b));
		const moduleBlocks = [];
		for (const file of files) {
			const relativeFromSource = normalizeSpecifier(path.posix.normalize(path.relative(tempOutDir, file).replace(/\\/g, "/")));
			if (!relativeFromSource || relativeFromSource.startsWith("..")) continue;
			const moduleId = `${options.modulePrefix}/${relativeFromSource}`;
			const rewritten = rewriteSpecifiers(await promises.readFile(file, "utf8"), moduleId, rewriteContext);
			if (!rewritten.trim()) continue;
			const indentedBody = rewritten.split("\n").map((line) => line.length > 0 ? `  ${line}` : line).join("\n");
			moduleBlocks.push(`declare module \"${moduleId}\" {\n${indentedBody}\n}`);
		}
		if (moduleBlocks.length === 0) throw new Error("No declaration files were generated for bundling.");
		moduleBlocks.push(`declare module \"${options.modulePrefix}\" {\n  export * from \"${options.modulePrefix}/index\";\n}`);
		let bundledContent = `${moduleBlocks.join("\n\n")}\n`;
		bundledContent = bundledContent.replace(new RegExp(`(["'])${options.sourceDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`, "g"), `$1${options.modulePrefix}/`).replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*$/gm, "");
		await promises.mkdir(path.dirname(outputFilePath), { recursive: true });
		await promises.writeFile(outputFilePath, bundledContent, "utf8");
	} finally {
		await promises.rm(tempTsConfigPath, { force: true });
		await promises.rm(tempOutDir, {
			recursive: true,
			force: true
		});
	}
}
function dtsBundlePlugin(options) {
	let rootDir = "";
	return {
		name: "dts-bundle-plugin",
		apply: "build",
		configResolved(config) {
			rootDir = config.root;
		},
		async closeBundle() {
			await bundleTypes(resolveOptions(rootDir, options));
		}
	};
}
//#endregion
//#region packages/repo-automation/src/build/buildBanner.ts
function loadManifestForBanner(options) {
	const fileSystem = options?.fileSystem ?? defaultFileSystem;
	if (options?.manifest !== void 0) return options.manifest;
	const manifestPath = options?.manifestPath ?? fileSystem.resolve(fileSystem.cwd(), "manifest.json");
	try {
		const content = fileSystem.readTextSync(manifestPath);
		const parsed = JSON.parse(content);
		if (parsed.name === void 0 || parsed.author === void 0 || parsed.authorUrl === void 0 || parsed.version === void 0) throw new Error("manifest is missing required keys: name, author, authorUrl, version");
		return {
			name: parsed.name,
			author: parsed.author,
			authorUrl: parsed.authorUrl,
			version: parsed.version
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`[repo-automation] failed to load manifest for build banner from "${manifestPath}": ${message}`);
	}
}
function getBuildBanner(buildType, getVersion, options) {
	const manifest = loadManifestForBanner(options);
	return `/*
-------------------------------------------
${manifest.name} - ${buildType}
-------------------------------------------
By: ${manifest.author} (${manifest.authorUrl})
Time: ${(/* @__PURE__ */ new Date()).toUTCString()}
Version: ${getVersion(manifest.version)}
-------------------------------------------
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
-------------------------------------------
Copyright (C) ${(/* @__PURE__ */ new Date()).getFullYear()} ${manifest.author}
-------------------------------------------
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
`;
}
//#endregion
export { dtsBundlePlugin, getBuildBanner };
