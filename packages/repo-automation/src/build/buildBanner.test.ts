import { describe, expect, it } from 'bun:test';
import { MemoryFileSystem } from '../utils/fileSystem';
import type { BuildBannerManifest } from './buildBanner';
import { getBuildBanner, loadManifestForBanner } from './buildBanner';

describe('buildBanner', () => {
	it('loads manifest from explicit path', () => {
		const manifestPath = '/repo/manifest.json';
		const manifest: BuildBannerManifest = {
			name: 'Example Plugin',
			author: 'Test Author',
			authorUrl: 'https://example.com',
			version: '1.0.0',
		};
		const fileSystem = new MemoryFileSystem({
			[manifestPath]: `${JSON.stringify(manifest, null, 2)}\n`,
		});

		const loaded = loadManifestForBanner({ manifestPath, fileSystem });
		expect(loaded).toEqual(manifest);
	});

	it('throws when manifest is missing required fields', () => {
		const manifestPath = '/repo/manifest.json';
		const fileSystem = new MemoryFileSystem({
			[manifestPath]: JSON.stringify({ name: 'Incomplete' }),
		});

		expect(() => loadManifestForBanner({ manifestPath, fileSystem })).toThrow('missing required keys');
	});

	it('loads manifest from cwd when no path is provided', () => {
		const manifestPath = '/plugin/manifest.json';
		const fileSystem = new MemoryFileSystem(
			{
				[manifestPath]: JSON.stringify({
					name: 'Cwd Plugin',
					author: 'Author',
					authorUrl: 'https://author.test',
					version: '3.0.0',
				}),
			},
			'/plugin',
		);

		const loaded = loadManifestForBanner({ fileSystem });
		expect(loaded.name).toBe('Cwd Plugin');
	});

	it('creates banner with provided manifest object', () => {
		const banner = getBuildBanner('Release Build', version => `v${version}`, {
			manifest: {
				name: 'Plugin X',
				author: 'Dev Y',
				authorUrl: 'https://example.dev',
				version: '2.1.3',
			},
		});

		expect(banner).toContain('Plugin X - Release Build');
		expect(banner).toContain('By: Dev Y (https://example.dev)');
		expect(banner).toContain('Version: v2.1.3');
	});
});
