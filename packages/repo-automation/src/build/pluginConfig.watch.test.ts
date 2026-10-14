import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, test } from 'bun:test';
import { build } from 'vite';
import { createObsidianPluginConfig } from './pluginConfig';

const initialManifest = { id: 'watch-plugin', name: 'Watch plugin', version: '1.0.0', minAppVersion: '1.4.0', author: 'Test' };

interface WatchFixture {
	root: string;
	nextBuild(): Promise<Error | null>;
	close(): Promise<void>;
}

async function watchFixture(): Promise<WatchFixture> {
	const root = mkdtempSync(path.join(tmpdir(), 'obsidian-manifest-watch-'));
	mkdirSync(path.join(root, 'src'));
	writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(initialManifest));
	writeFileSync(path.join(root, 'src/main.ts'), 'export default class Plugin {}');
	const config = createObsidianPluginConfig({ root, entry: 'src/main.ts', mode: 'development' });
	const watcher = await build({ ...config, configFile: false, logLevel: 'silent', build: { ...config.build, watch: {} } });
	if (!('on' in watcher)) {
		rmSync(root, { recursive: true, force: true });
		throw new Error('Expected a watch build');
	}
	const outcomes: (Error | null)[] = [];
	let notify: (() => void) | undefined;
	let failed = false;
	watcher.on('event', event => {
		if (event.code === 'START') {
			failed = false;
		}
		if (event.code === 'ERROR') {
			failed = true;
		}
		if ((event.code === 'END' && !failed) || event.code === 'ERROR') {
			outcomes.push(event.code === 'ERROR' ? event.error : null);
			notify?.();
		}
	});
	return {
		root,
		async nextBuild(): Promise<Error | null> {
			if (!outcomes.length) {
				await new Promise<void>((resolve, reject) => {
					const timeout = setTimeout(() => reject(new Error('Timed out waiting for watch build')), 10000);
					notify = (): void => {
						clearTimeout(timeout);
						notify = undefined;
						resolve();
					};
				});
			}
			return outcomes.shift() ?? null;
		},
		async close(): Promise<void> {
			await watcher.close();
			rmSync(root, { recursive: true, force: true });
		},
	};
}

function output(root: string, filename: string): string {
	return readFileSync(path.join(root, 'exampleVault/.obsidian/plugins/watch-plugin', filename), 'utf8');
}

test('watch rebuilds manifest-only edits and refreshes the manifest and banner on later entry edits', async () => {
	const fixture = await watchFixture();
	try {
		expect(await fixture.nextBuild()).toBeNull();
		const updatedManifest = { ...initialManifest, version: '1.0.1', minAppVersion: '1.5.0', isDesktopOnly: true };
		const manifestText = JSON.stringify(updatedManifest);
		writeFileSync(path.join(fixture.root, 'manifest.json'), manifestText);
		expect(await fixture.nextBuild()).toBeNull();
		expect(output(fixture.root, 'manifest.json')).toBe(manifestText);
		expect(output(fixture.root, 'main.js')).toContain('Version: 1.0.1');
		writeFileSync(path.join(fixture.root, 'src/main.ts'), 'export default class Plugin { updated = true; }');
		expect(await fixture.nextBuild()).toBeNull();
		expect(output(fixture.root, 'manifest.json')).toBe(manifestText);
		expect(output(fixture.root, 'main.js')).toContain('Version: 1.0.1');
	} finally {
		await fixture.close();
	}
}, 30000);

test('watch rejects invalid metadata and ID changes without overwriting the installed manifest, then recovers', async () => {
	const fixture = await watchFixture();
	try {
		expect(await fixture.nextBuild()).toBeNull();
		const previousManifest = output(fixture.root, 'manifest.json');
		writeFileSync(path.join(fixture.root, 'manifest.json'), JSON.stringify({ ...initialManifest, minAppVersion: 'invalid' }));
		expect((await fixture.nextBuild())?.message).toContain('Invalid manifest minAppVersion');
		expect(output(fixture.root, 'manifest.json')).toBe(previousManifest);
		writeFileSync(path.join(fixture.root, 'manifest.json'), JSON.stringify({ ...initialManifest, id: 'another-plugin' }));
		expect((await fixture.nextBuild())?.message).toContain('restart the build');
		expect(output(fixture.root, 'manifest.json')).toBe(previousManifest);
		const recoveredText = JSON.stringify({ ...initialManifest, version: '1.0.2' });
		writeFileSync(path.join(fixture.root, 'manifest.json'), recoveredText);
		expect(await fixture.nextBuild()).toBeNull();
		expect(output(fixture.root, 'manifest.json')).toBe(recoveredText);
	} finally {
		await fixture.close();
	}
}, 30000);
