import type { Plugin } from 'vite';
export interface DtsBundlePluginOptions {
    sourceDir: string;
    tempDir: string;
    outputFile: string;
    modulePrefix: string;
}
export declare function dtsBundlePlugin(options: DtsBundlePluginOptions): Plugin;
