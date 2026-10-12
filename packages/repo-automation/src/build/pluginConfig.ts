import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import { getBuildBanner } from './buildBanner';

export interface ObsidianManifest {
	id: string;
	name: string;
	version: string;
	minAppVersion: string;
	author: string;
	authorUrl?: string;
	isDesktopOnly?: boolean;
}

export interface ObsidianPluginConfigOptions {
	root: string;
	entry: string;
	manifest?: string;
	mode: ConfigEnv['mode'];
	plugins?: PluginOption[];
	resolve?: UserConfig['resolve'];
	define?: UserConfig['define'];
	worker?: UserConfig['worker'];
	target?: string;
	polyfilledBuiltins?: string[];
	developmentVault?: string;
}

export function validateManifest(manifest: ObsidianManifest): void {
	if (typeof manifest.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(manifest.id)) {
		throw new Error('Manifest id must be a safe plugin directory name');
	}
	for (const key of ['version', 'minAppVersion'] as const) {
		if (typeof manifest[key] !== 'string' || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(manifest[key])) {
			throw new Error(`Invalid manifest ${key}`);
		}
	}
}

export function isHostExternal(id: string, polyfilledBuiltins: string[] = []): boolean {
	const bare = id.replace(/^node:/, '');
	if (polyfilledBuiltins.includes(bare)) {
		return false;
	}
	return (
		id === 'obsidian' ||
		id === 'electron' ||
		id.startsWith('@codemirror/') ||
		id.startsWith('@lezer/') ||
		builtinModules.includes(bare) ||
		builtinModules.includes(id)
	);
}

/** Build paths belong to one plugin; development never cleans the vault. */
export function createObsidianPluginConfig(options: ObsidianPluginConfigOptions): UserConfig {
	const root = path.resolve(options.root);
	const manifestPath = path.resolve(root, options.manifest ?? 'manifest.json');
	const manifestText = readFileSync(manifestPath, 'utf8');
	const manifest = JSON.parse(manifestText) as ObsidianManifest;
	validateManifest(manifest);
	const production = options.mode === 'production';
	const outDir = production ? path.join(root, 'dist') : path.join(root, options.developmentVault ?? 'exampleVault', '.obsidian', 'plugins', manifest.id);
	const entry = path.resolve(root, options.entry);
	return {
		root,
		plugins: [
			...(options.plugins ?? []),
			{
				name: 'obsidian-manifest',
				generateBundle(): void {
					this.emitFile({ type: 'asset', fileName: 'manifest.json', source: manifestText });
				},
			},
		],
		resolve: options.resolve,
		define: options.define,
		worker: options.worker,
		build: {
			outDir,
			emptyOutDir: production,
			lib: { entry, name: 'main', formats: ['cjs'], fileName: () => 'main.js', cssFileName: 'styles' },
			target: options.target ?? 'es2022',
			minify: production,
			sourcemap: production ? false : 'inline',
			cssCodeSplit: false,
			rolldownOptions: {
				external: (id: string) => isHostExternal(id, options.polyfilledBuiltins),
				output: {
					entryFileNames: 'main.js',
					assetFileNames: asset => (asset.names?.some(name => name.endsWith('.css')) ? 'styles.css' : 'assets/[name]-[hash][extname]'),
					codeSplitting: false,
					banner: getBuildBanner(production ? 'Release Build' : 'Dev Build', version => version, {
						manifest: { ...manifest, authorUrl: manifest.authorUrl ?? '' },
					}),
				},
			},
		},
	};
}
