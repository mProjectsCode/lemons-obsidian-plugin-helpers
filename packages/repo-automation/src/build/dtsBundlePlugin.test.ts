import { describe, expect, it } from 'bun:test';
import { MemoryFileSystem } from '../utils/fileSystem';
import { _dtsBundlePluginInternals } from './dtsBundlePlugin';

describe('dtsBundlePlugin internals', () => {
	it('renders bundle modules with rewritten specifiers and stripped ambient noise', () => {
		const fileSystem = new MemoryFileSystem({
			'/tmp/index.d.ts': [
				'import type { Thing } from "./types";',
				'import "./styles.css";',
				'export { Thing } from "src/shared.ts";',
				'export declare interface PublicThing { value: string }',
				'declare type LocalAlias = string;',
				'export {};',
			].join('\n'),
			'/tmp/types.d.ts': 'export interface Thing { ok: boolean }\n',
		});

		const bundle = _dtsBundlePluginInternals.renderDeclarationBundle(
			[
				{ moduleId: 'plugin/helpers/index', content: fileSystem.readTextSync('/tmp/index.d.ts') },
				{ moduleId: 'plugin/helpers/types', content: fileSystem.readTextSync('/tmp/types.d.ts') },
			],
			{ modulePrefix: 'plugin/helpers', sourceDir: 'src' },
		);

		expect(bundle).toContain('declare module "plugin/helpers/index"');
		expect(bundle).toContain('from "plugin/helpers/types"');
		expect(bundle).toContain('from "plugin/helpers/shared"');
		expect(bundle).toContain('interface PublicThing');
		expect(bundle).toContain('type LocalAlias = string;');
		expect(bundle).not.toContain('declare interface PublicThing');
		expect(bundle).not.toContain('import "./styles.css";');
		expect(bundle).not.toContain('export {};');
		expect(bundle).toContain('declare module "plugin/helpers"');
		expect(bundle).toContain('export * from "plugin/helpers/index";');
	});

	it('omits root re-export module when index declaration is missing', () => {
		const bundle = _dtsBundlePluginInternals.renderDeclarationBundle([{ moduleId: 'plugin/helpers/internal', content: 'export interface InternalOnly {}' }], {
			modulePrefix: 'plugin/helpers',
			sourceDir: 'src',
		});

		expect(bundle).toContain('declare module "plugin/helpers/internal"');
		expect(bundle).not.toContain('declare module "plugin/helpers" {');
	});

	it('rewrites source dir prefixes that include regex characters', () => {
		const bundle = _dtsBundlePluginInternals.renderDeclarationBundle(
			[
				{
					moduleId: 'plugin/helpers/index',
					content: 'export * from "src.test/core/types";\n',
				},
			],
			{ modulePrefix: 'plugin/helpers', sourceDir: 'src.test' },
		);

		expect(bundle).toContain('from "plugin/helpers/core/types"');
		expect(bundle).not.toContain('from "src.test/core/types"');
	});

	it('rewrites dynamic import specifiers through module pipeline', () => {
		const transformed = _dtsBundlePluginInternals.runModuleContentPipeline('export type Lazy = Awaited<import("./lazy.ts")>;', 'plugin/helpers/index', {
			rewriteContext: { modulePrefix: 'plugin/helpers', sourceDirPrefix: 'src' },
		});

		expect(transformed).toContain('import("plugin/helpers/lazy")');
	});

	it('normalizes escaped source prefixes through bundle pipeline', () => {
		const transformed = _dtsBundlePluginInternals.runBundleContentPipeline('export * from "src/components/panel.ts";\n', {
			rewriteContext: { modulePrefix: 'plugin/helpers', sourceDirPrefix: 'src' },
		});

		expect(transformed).toContain('from "plugin/helpers/components/panel"');
	});

	it('rejects absolute and traversing option paths', () => {
		expect(() =>
			_dtsBundlePluginInternals.resolveOptions('/repo', {
				sourceDir: '/src',
				tempDir: 'tmp/types',
				outputFile: 'dist/index.d.ts',
				modulePrefix: 'plugin/helpers',
			}),
		).toThrow('expected a relative path');

		expect(() =>
			_dtsBundlePluginInternals.resolveOptions('/repo', {
				sourceDir: 'src',
				tempDir: '../tmp/types',
				outputFile: 'dist/index.d.ts',
				modulePrefix: 'plugin/helpers',
			}),
		).toThrow('path traversal is not allowed');
	});

	it('throws when all module declarations are stripped', () => {
		expect(() =>
			_dtsBundlePluginInternals.renderDeclarationBundle(
				[
					{
						moduleId: 'plugin/helpers/index',
						content: 'import "./styles.css";\nexport {};\n',
					},
				],
				{ modulePrefix: 'plugin/helpers', sourceDir: 'src' },
			),
		).toThrow('No declaration files were generated for bundling.');
	});

	it('generates explicit source include globs for temporary tsconfig', () => {
		expect(_dtsBundlePluginInternals.getSourceIncludeGlobs('packages/jsEngine/src')).toEqual([
			'packages/jsEngine/src/**/*.ts',
			'packages/jsEngine/src/**/*.tsx',
			'packages/jsEngine/src/**/*.mts',
			'packages/jsEngine/src/**/*.cts',
			'packages/jsEngine/src/**/*.d.ts',
			'packages/jsEngine/src/**/*.d.mts',
			'packages/jsEngine/src/**/*.d.cts',
		]);
	});
});
