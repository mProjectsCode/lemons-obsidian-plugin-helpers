import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { ObsidianManifest } from './pluginConfig';
import { isHostExternal, validateManifest } from './pluginConfig';

export interface ArtifactOptions {
	root: string;
	css?: 'optional' | 'required' | 'absent';
	extraFiles?: string[];
}

export function validateArtifacts(options: ArtifactOptions): string[] {
	const dist = path.resolve(options.root, 'dist');
	const license = ['LICENSE', 'LICENSE.md', 'LICENSE.txt']
		.map(file => path.resolve(options.root, file))
		.find(file => existsSync(file) && statSync(file).isFile() && statSync(file).size > 0);
	if (!license) {
		throw new Error('Missing nonempty license file');
	}

	const source = JSON.parse(readFileSync(path.resolve(options.root, 'manifest.json'), 'utf8')) as ObsidianManifest;
	const manifest = JSON.parse(readFileSync(path.join(dist, 'manifest.json'), 'utf8')) as ObsidianManifest;
	validateManifest(manifest);
	if (JSON.stringify(source) !== JSON.stringify(manifest)) {
		throw new Error('Built manifest differs from source manifest');
	}
	const files = readdirSync(dist).sort();
	const allowed = new Set(['main.js', 'manifest.json', 'styles.css', ...(options.extraFiles ?? [])]);
	for (const file of files) {
		if (!allowed.has(file) || !statSync(path.join(dist, file)).isFile()) {
			throw new Error(`Unexpected install artifact: ${file}`);
		}
		if (statSync(path.join(dist, file)).size === 0) {
			throw new Error(`Empty install artifact: ${file}`);
		}
	}
	if (!files.includes('main.js') || !files.includes('manifest.json')) {
		throw new Error('Missing required install files');
	}
	if (options.css === 'required' && !files.includes('styles.css')) {
		throw new Error('Missing styles.css');
	}
	if (options.css === 'absent' && files.includes('styles.css')) {
		throw new Error('Unexpected styles.css');
	}
	const bundle = readFileSync(path.join(dist, 'main.js'), 'utf8');
	// Every runtime require must resolve to a host module, not an npm dependency or chunk.
	for (const match of bundle.matchAll(/\brequire\s*\(\s*["']([^"']+)["']\s*\)/g)) {
		if (!isHostExternal(match[1])) {
			throw new Error(`Unbundled runtime dependency: ${match[1]}`);
		}
	}
	return files;
}

/** Archive only install files, under the actual manifest id. API tarballs remain separate. */
export function packageArtifacts(options: ArtifactOptions): string {
	const files = validateArtifacts(options).filter(file => !options.extraFiles?.includes(file));
	const manifest = JSON.parse(readFileSync(path.resolve(options.root, 'manifest.json'), 'utf8')) as ObsidianManifest;
	const archive = path.resolve(options.root, 'artifacts', `${manifest.id}-${manifest.version}.zip`);
	mkdirSync(path.dirname(archive), { recursive: true });
	// Stage only the validated install files.
	const staging = mkdtempSync(path.join(tmpdir(), 'obsidian-package-'));
	try {
		const folder = path.join(staging, manifest.id);
		mkdirSync(folder);
		for (const file of files) {
			copyFileSync(path.join(options.root, 'dist', file), path.join(folder, file));
		}
		const temporaryArchive = path.join(staging, 'install.zip');
		const result = spawnSync('zip', ['-q', temporaryArchive, ...files.map(file => `${manifest.id}/${file}`)], { cwd: staging, encoding: 'utf8' });
		if (result.status !== 0) {
			throw new Error(result.stderr || 'zip failed');
		}
		copyFileSync(temporaryArchive, archive);
		return archive;
	} finally {
		rmSync(staging, { recursive: true, force: true });
	}
}
