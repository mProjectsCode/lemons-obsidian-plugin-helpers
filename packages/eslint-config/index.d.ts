import type { Linter } from 'eslint';
export interface CIOptions {
	root?: string;
	host?: string[];
	workers?: string[];
	svelteConfig?: object;
	project?: string | string[];
	ignores?: string[];
	overrides?: Linter.Config[];
}
export declare function createCIConfig(options?: CIOptions): Linter.Config[];
export declare function createReviewConfig(options?: { root?: string; generated?: string[] }): Linter.Config[];
export declare const scannerSecurityRules: string[];
