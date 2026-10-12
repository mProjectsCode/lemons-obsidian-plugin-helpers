import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'bun:test';
import { packageArtifacts, validateArtifacts } from './artifacts';
import { createObsidianPluginConfig, isHostExternal } from './pluginConfig';

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture(): string {
	const root = mkdtempSync(path.join(tmpdir(), 'obsidian-config-test-'));
	roots.push(root);
	const manifest = JSON.stringify({ id: 'actual-plugin', name: 'Plugin', version: '1.0.0', minAppVersion: '1.4.0', author: 'Test' });
	writeFileSync(path.join(root, 'manifest.json'), manifest);
	writeFileSync(path.join(root, 'LICENSE'), 'MIT');
	mkdirSync(path.join(root, 'dist'));
	writeFileSync(path.join(root, 'dist', 'manifest.json'), manifest);
	writeFileSync(path.join(root, 'dist', 'main.js'), 'module.exports = require("obsidian");');
	return root;
}

describe('plugin builds and install artifacts', () => {
	test('development cleans neither the plugin directory nor the vault', () => {
		const root = fixture();
		const dev = createObsidianPluginConfig({ root, entry: 'src/main.ts', mode: 'development' });
		expect(dev.build?.outDir).toBe(path.join(root, 'exampleVault/.obsidian/plugins/actual-plugin'));
		expect(dev.build?.emptyOutDir).toBe(false);
		expect(createObsidianPluginConfig({ root, entry: 'src/main.ts', mode: 'production' }).build?.emptyOutDir).toBe(true);
	});
	test('normalizes Node builtins and retains explicit polyfills', () => {
		expect(isHostExternal('node:fs/promises')).toBe(true);
		expect(isHostExternal('fs/promises')).toBe(true);
		expect(isHostExternal('node:path', ['path'])).toBe(false);
		expect(isHostExternal('@lezer/common')).toBe(true);
		expect(isHostExternal('yaml')).toBe(false);
	});
	test('rejects unsafe manifest directory names', () => {
		const root = fixture();
		writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({ id: '../vault', version: '1.0.0', minAppVersion: '1.4.0' }));
		expect(() => createObsidianPluginConfig({ root, entry: 'src/main.ts', mode: 'development' })).toThrow('safe plugin directory');
	});
	test('supports a CSS-free plugin and rejects stale chunks and missing CSS', () => {
		const root = fixture();
		expect(validateArtifacts({ root, css: 'absent' })).toEqual(['main.js', 'manifest.json']);
		expect(() => validateArtifacts({ root, css: 'required' })).toThrow('Missing styles.css');
		writeFileSync(path.join(root, 'dist', 'chunk.js'), 'extra');
		expect(() => validateArtifacts({ root })).toThrow('Unexpected install artifact');
	});
	test('rejects npm runtime imports and changed manifests', () => {
		const root = fixture();
		writeFileSync(path.join(root, 'dist', 'main.js'), 'module.exports = require("yaml");');
		expect(() => validateArtifacts({ root })).toThrow('Unbundled runtime dependency');
		writeFileSync(path.join(root, 'dist', 'manifest.json'), readFileSync(path.join(root, 'manifest.json'), 'utf8').replace('1.0.0', '1.0.1'));
		expect(() => validateArtifacts({ root })).toThrow('differs from source');
	});
	test('archive uses the manifest id and can be prepared repeatedly', () => {
		const root = fixture();
		expect(packageArtifacts({ root })).toBe(path.join(root, 'artifacts', 'actual-plugin-1.0.0.zip'));
		expect(() => packageArtifacts({ root })).not.toThrow();
		expect(validateArtifacts({ root })).toHaveLength(2);
	});
	test('repackaging drops CSS removed by a later build', () => {
		const root = fixture();
		const css = path.join(root, 'dist', 'styles.css');
		writeFileSync(css, 'body {}');
		packageArtifacts({ root });
		rmSync(css);
		const archive = packageArtifacts({ root });
		const listing = spawnSync('unzip', ['-Z1', archive], { encoding: 'utf8' });
		expect(listing.status).toBe(0);
		expect(listing.stdout).not.toContain('styles.css');
	});
	test('rejects artifacts when the license is missing', () => {
		const root = fixture();
		rmSync(path.join(root, 'LICENSE'));
		expect(() => validateArtifacts({ root })).toThrow('license file');
	});
	test('rejects a manifest with a missing id before writing production output', () => {
		const root = fixture();
		writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({ version: '1.0.0', minAppVersion: '1.4.0' }));
		expect(() => createObsidianPluginConfig({ root, entry: 'src/main.ts', mode: 'production' })).toThrow('safe plugin directory');
	});
});
