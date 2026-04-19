//#region packages/repo-automation/src/utils/fileSystem.d.ts
interface FileSystem {
  cwd(): string;
  join(...parts: string[]): string;
  resolve(...parts: string[]): string;
  exists(filePath: string): Promise<boolean>;
  readText(filePath: string): Promise<string>;
  readTextSync(filePath: string): string;
  writeText(filePath: string, content: string): Promise<void>;
}
//#endregion
//#region packages/repo-automation/src/release.d.ts
interface RepoAutomationConfig {
  devBranch: string;
  releaseBranch: string;
  github: string;
  preconditions?: string[];
}
interface PluginManifest {
  version: string;
  minAppVersion: string;
}
interface PluginPackageJson {
  version: string;
}
declare function getRepoRoot(): string;
declare function getRepoPath(repoRoot: string, fileName: string): string;
declare function readJsonFile<T>(filePath: string, description: string, fileSystem?: FileSystem): Promise<T>;
declare function writeJsonFile(filePath: string, value: unknown, fileSystem?: FileSystem): Promise<void>;
declare function loadConfig(repoRoot: string, fileSystem?: FileSystem): Promise<RepoAutomationConfig>;
declare function runPreconditions(preconditions: string[] | undefined): Promise<void>;
declare function runRelease(): Promise<void>;
//#endregion
export { getRepoRoot as a, runPreconditions as c, FileSystem as d, getRepoPath as i, runRelease as l, PluginPackageJson as n, loadConfig as o, RepoAutomationConfig as r, readJsonFile as s, PluginManifest as t, writeJsonFile as u };