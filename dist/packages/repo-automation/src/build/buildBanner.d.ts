import type { FileSystem } from '../utils/fileSystem';
export interface BuildBannerManifest {
    name: string;
    author: string;
    authorUrl: string;
    version: string;
}
export interface BuildBannerOptions {
    manifestPath?: string;
    manifest?: BuildBannerManifest;
    fileSystem?: Pick<FileSystem, 'cwd' | 'resolve' | 'readTextSync'>;
}
export declare function loadManifestForBanner(options?: BuildBannerOptions): BuildBannerManifest;
export declare function getBuildBanner(buildType: string, getVersion: (version: string) => string, options?: BuildBannerOptions): string;
