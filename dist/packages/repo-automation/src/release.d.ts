import type { FileSystem } from './utils/fileSystem';
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
export declare function getRepoRoot(): string;
export declare function getRepoPath(repoRoot: string, fileName: string): string;
export declare function readJsonFile<T>(filePath: string, description: string, fileSystem?: FileSystem): Promise<T>;
export declare function writeJsonFile(filePath: string, value: unknown, fileSystem?: FileSystem): Promise<void>;
export declare function loadConfig(repoRoot: string, fileSystem?: FileSystem): Promise<RepoAutomationConfig>;
export declare function runPreconditions(preconditions: string[] | undefined): Promise<void>;
export declare function runRelease(): Promise<void>;
