// packages/repo-automation/src/build/dtsBundlePlugin.ts
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
var DECLARABLE_SYMBOL = "(?:abstract\\s+)?(?:class|function|const|let|var|enum|namespace|interface|type)";
function normalizePathLike(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}
function assertNonEmptyOption(name, value) {
  if (value.trim().length === 0) {
    throw new Error(`[dts-bundle-plugin] Invalid option "${name}": value cannot be empty.`);
  }
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
  if (outputFile.endsWith("/")) {
    throw new Error('[dts-bundle-plugin] Invalid option "outputFile": expected a file path, got a directory.');
  }
  if (!outputFile.endsWith(".d.ts")) {
    throw new Error('[dts-bundle-plugin] Invalid option "outputFile": expected a .d.ts file path.');
  }
  if (tempDir === sourceDir || tempDir.startsWith(`${sourceDir}/`)) {
    throw new Error('[dts-bundle-plugin] Invalid option "tempDir": must be outside sourceDir.');
  }
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
  if (specifier.startsWith(`${context.sourceDirPrefix}/`)) {
    return normalizeSpecifier(specifier.replace(new RegExp(`^${context.sourceDirPrefix}/`), `${context.modulePrefix}/`));
  }
  if (specifier.startsWith("src/")) {
    return normalizeSpecifier(`${context.modulePrefix}/${specifier.slice(4)}`);
  }
  return specifier;
}
function rewriteSpecifiers(content, currentModuleId, context) {
  const fromRegex = /(from\s+['"])([^'"]+)(['"])/g;
  const importTypeRegex = /(import\(['"])([^'"]+)(['"]\))/g;
  const exportFromRegex = /(export\s+\*\s+from\s+['"])([^'"]+)(['"])/g;
  const sideEffectImportRegex = /(import\s+['"])([^'"]+)(['"]\s*;?)/g;
  let rewritten = content.replace(fromRegex, (_match, p1, specifier, p3) => {
    const nextSpecifier = resolveModuleSpecifier(currentModuleId, specifier, context);
    return `${p1}${nextSpecifier}${p3}`;
  }).replace(importTypeRegex, (_match, p1, specifier, p3) => {
    const nextSpecifier = resolveModuleSpecifier(currentModuleId, specifier, context);
    return `${p1}${nextSpecifier}${p3}`;
  }).replace(exportFromRegex, (_match, p1, specifier, p3) => {
    const nextSpecifier = resolveModuleSpecifier(currentModuleId, specifier, context);
    return `${p1}${nextSpecifier}${p3}`;
  }).replace(sideEffectImportRegex, (_match, p1, specifier, p3) => {
    const nextSpecifier = resolveModuleSpecifier(currentModuleId, specifier, context);
    return `${p1}${nextSpecifier}${p3}`;
  });
  rewritten = rewritten.replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*$/gm, "");
  rewritten = rewritten.replace(/^\s*export\s*\{\s*\};?\s*$/gm, "");
  rewritten = rewritten.replace(new RegExp(`^(\\s*export\\s+)declare(\\s+${DECLARABLE_SYMBOL}\\b)`, "gm"), "$1$2").replace(new RegExp(`^(\\s*)declare(\\s+${DECLARABLE_SYMBOL}\\b)`, "gm"), "$1$2");
  return rewritten.trimEnd();
}
async function collectDtsFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectDtsFiles(absPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".d.ts")) {
      files.push(absPath);
    }
  }
  return files;
}
async function runTsc(projectPath, cwd) {
  const tscJsPath = path.resolve(cwd, "node_modules/typescript/lib/tsc.js");
  await fs.access(tscJsPath);
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tscJsPath, "--project", projectPath], {
      cwd,
      stdio: "inherit"
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`tsc exited with code ${code}`));
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
  await fs.access(sourceDirPath);
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
  await fs.rm(tempOutDir, { recursive: true, force: true });
  await fs.writeFile(tempTsConfigPath, `${JSON.stringify(tempTsConfig, null, 2)}
`, "utf8");
  try {
    await runTsc(tempTsConfigPath, options.rootDir);
    const files = (await collectDtsFiles(tempOutDir)).filter((file) => !file.endsWith(".d.ts.map")).sort((a, b) => a.localeCompare(b));
    const moduleBlocks = [];
    for (const file of files) {
      const relativeFromSource = normalizeSpecifier(path.posix.normalize(path.relative(tempOutDir, file).replace(/\\/g, "/")));
      if (!relativeFromSource || relativeFromSource.startsWith("..")) {
        continue;
      }
      const moduleId = `${options.modulePrefix}/${relativeFromSource}`;
      const content = await fs.readFile(file, "utf8");
      const rewritten = rewriteSpecifiers(content, moduleId, rewriteContext);
      if (!rewritten.trim()) {
        continue;
      }
      const indentedBody = rewritten.split(`
`).map((line) => line.length > 0 ? `  ${line}` : line).join(`
`);
      moduleBlocks.push(`declare module "${moduleId}" {
${indentedBody}
}`);
    }
    if (moduleBlocks.length === 0) {
      throw new Error("No declaration files were generated for bundling.");
    }
    moduleBlocks.push(`declare module "${options.modulePrefix}" {
  export * from "${options.modulePrefix}/index";
}`);
    let bundledContent = `${moduleBlocks.join(`

`)}
`;
    bundledContent = bundledContent.replace(new RegExp(`(["'])${options.sourceDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`, "g"), `$1${options.modulePrefix}/`).replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*$/gm, "");
    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, bundledContent, "utf8");
  } finally {
    await fs.rm(tempTsConfigPath, { force: true });
    await fs.rm(tempOutDir, { recursive: true, force: true });
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
      const resolvedOptions = resolveOptions(rootDir, options);
      await bundleTypes(resolvedOptions);
    }
  };
}
// packages/repo-automation/src/utils/fileSystem.ts
import { readFileSync } from "node:fs";
import path2 from "node:path";
var defaultFileSystem = {
  cwd: () => process.cwd(),
  join: (...parts) => path2.join(...parts),
  resolve: (...parts) => path2.resolve(...parts),
  exists: async (filePath) => Bun.file(filePath).exists(),
  readText: async (filePath) => Bun.file(filePath).text(),
  readTextSync: (filePath) => readFileSync(filePath, "utf8"),
  writeText: async (filePath, content) => {
    await Bun.write(filePath, content);
  }
};

class MemoryFileSystem {
  files = new Map;
  currentWorkingDirectory;
  constructor(initialFiles, cwd = "/") {
    this.currentWorkingDirectory = this.normalize(cwd);
    if (initialFiles !== undefined) {
      for (const [filePath, content] of Object.entries(initialFiles)) {
        this.files.set(this.normalize(filePath), content);
      }
    }
  }
  cwd() {
    return this.currentWorkingDirectory;
  }
  join(...parts) {
    return this.normalize(path2.posix.join(...parts));
  }
  resolve(...parts) {
    return this.normalize(path2.posix.resolve(this.currentWorkingDirectory, ...parts));
  }
  async exists(filePath) {
    return this.files.has(this.normalize(filePath));
  }
  async readText(filePath) {
    const normalizedPath = this.normalize(filePath);
    const content = this.files.get(normalizedPath);
    if (content === undefined) {
      throw new Error(`file not found: ${normalizedPath}`);
    }
    return content;
  }
  readTextSync(filePath) {
    const normalizedPath = this.normalize(filePath);
    const content = this.files.get(normalizedPath);
    if (content === undefined) {
      throw new Error(`file not found: ${normalizedPath}`);
    }
    return content;
  }
  async writeText(filePath, content) {
    this.files.set(this.normalize(filePath), content);
  }
  setFile(filePath, content) {
    this.files.set(this.normalize(filePath), content);
  }
  getFile(filePath) {
    return this.files.get(this.normalize(filePath));
  }
  normalize(filePath) {
    const normalized = filePath.replace(/\\/g, "/");
    return path2.posix.normalize(normalized.startsWith("/") ? normalized : `/${normalized}`);
  }
}

// packages/repo-automation/src/build/buildBanner.ts
function loadManifestForBanner(options) {
  const fileSystem = options?.fileSystem ?? defaultFileSystem;
  if (options?.manifest !== undefined) {
    return options.manifest;
  }
  const manifestPath = options?.manifestPath ?? fileSystem.resolve(fileSystem.cwd(), "manifest.json");
  try {
    const content = fileSystem.readTextSync(manifestPath);
    const parsed = JSON.parse(content);
    if (parsed.name === undefined || parsed.author === undefined || parsed.authorUrl === undefined || parsed.version === undefined) {
      throw new Error("manifest is missing required keys: name, author, authorUrl, version");
    }
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
Time: ${new Date().toUTCString()}
Version: ${getVersion(manifest.version)}
-------------------------------------------
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
-------------------------------------------
Copyright (C) ${new Date().getFullYear()} ${manifest.author}
-------------------------------------------
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
`;
}
export {
  getBuildBanner,
  dtsBundlePlugin
};
