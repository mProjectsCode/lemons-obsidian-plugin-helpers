import path from 'node:path';
import { describe, expect, it } from 'bun:test';
import { getRepoPath, loadConfig, prepareReleaseManifest, prepareVersionMetadata, readJsonFile, writeJsonFile } from './release';
import { MemoryFileSystem } from './utils/fileSystem';
import { UserError } from './utils/utils';
import { parseVersion } from './utils/versionUtils';

describe('release helpers', () => {
	it('builds repository paths', () => {
		const result = getRepoPath('/tmp/project', 'manifest.json');
		expect(result).toBe(path.join('/tmp/project', 'manifest.json'));
	});

	it('reads valid json file', async () => {
		const filePath = '/repo/data.json';
		const fileSystem = new MemoryFileSystem({
			[filePath]: JSON.stringify({ value: 42 }),
		});

		const data = await readJsonFile<{ value: number }>(filePath, 'test data', fileSystem);
		expect(data.value).toBe(42);
	});

	it('throws on missing json file', async () => {
		const fileSystem = new MemoryFileSystem();
		const filePath = '/repo/missing.json';

		expect(readJsonFile(filePath, 'missing file', fileSystem)).rejects.toBeInstanceOf(UserError);
	});

	it('loads repo automation config from repository root', async () => {
		const dir = '/repo';
		const configPath = '/repo/repo-automation.config.json';
		const fileSystem = new MemoryFileSystem({
			[configPath]: JSON.stringify({
				devBranch: 'main',
				releaseBranch: 'release',
				github: 'https://github.com/org/repo',
				preconditions: ['bun run typecheck', 'bun run test'],
			}),
		});

		const config = await loadConfig(dir, fileSystem);
		expect(config.devBranch).toBe('main');
		expect(config.releaseBranch).toBe('release');
		expect(config.github).toBe('https://github.com/org/repo');
		expect(config.preconditions).toEqual(['bun run typecheck', 'bun run test']);
	});

	it('throws when repo automation config is missing', async () => {
		const dir = '/repo';
		const fileSystem = new MemoryFileSystem();
		expect(loadConfig(dir, fileSystem)).rejects.toBeInstanceOf(UserError);
	});

	it('writes json file through abstraction', async () => {
		const filePath = '/repo/out.json';
		const fileSystem = new MemoryFileSystem();

		await writeJsonFile(filePath, { value: 7 }, fileSystem);

		expect(fileSystem.getFile(filePath)).toContain('"value": 7');
	});
});

describe('release version metadata', () => {
	const files = {
		'/repo/manifest.json': '{"version":"0.7.7","minAppVersion":"1.10.0","id":"shiki-highlighter"}',
		'/repo/package.json': '{"version":"0.7.7","name":"plugin"}',
		'/repo/versions.json': '{"0.7.7":"1.10.0"}',
	};
	it('canaries keep every stable metadata file byte-for-byte unchanged and create no beta manifest', async () => {
		const fileSystem = new MemoryFileSystem(files);
		await prepareVersionMetadata('/repo', parseVersion('0.7.7-canary.20261012T120000'), fileSystem);
		for (const [filename, content] of Object.entries(files)) {
			expect(fileSystem.getFile(filename)).toBe(content);
		}
		expect(await fileSystem.exists('/repo/manifest-beta.json')).toBe(false);
	});
	it('stable releases update the manifest, package and compatibility map without a beta manifest', async () => {
		const fileSystem = new MemoryFileSystem(files);
		await prepareVersionMetadata('/repo', parseVersion('0.7.8'), fileSystem);
		expect(JSON.parse(await fileSystem.readText('/repo/manifest.json'))).toEqual({ version: '0.7.8', minAppVersion: '1.10.0', id: 'shiki-highlighter' });
		expect(JSON.parse(await fileSystem.readText('/repo/package.json'))).toEqual({ version: '0.7.8', name: 'plugin' });
		expect(JSON.parse(await fileSystem.readText('/repo/versions.json'))).toEqual({ '0.7.7': '1.10.0', '0.7.8': '1.10.0' });
		expect(await fileSystem.exists('/repo/manifest-beta.json')).toBe(false);
	});
});

describe('tagged release manifests', () => {
	const original = '{"version":"0.7.7","minAppVersion":"1.10.0","id":"plugin"}';
	it('stable builds preserve the checked-in manifest exactly', async () => {
		const fs = new MemoryFileSystem({ '/repo/manifest.json': original });
		await prepareReleaseManifest('/repo', '0.7.7', fs);
		expect(fs.getFile('/repo/manifest.json')).toBe(original);
	});
	it('canary builds derive their manifest from the tag without a beta manifest', async () => {
		const fs = new MemoryFileSystem({ '/repo/manifest.json': original });
		await prepareReleaseManifest('/repo', '0.7.7-canary.20261012T120000', fs);
		expect(JSON.parse(await fs.readText('/repo/manifest.json'))).toEqual({ version: '0.7.7-canary.20261012T120000', minAppVersion: '1.10.0', id: 'plugin' });
		expect(await fs.exists('/repo/manifest-beta.json')).toBe(false);
	});
	it('rejects invalid or mismatched tags before changing the manifest', async () => {
		for (const tag of ['0.7.8', '0.7.8-canary.20261012T120000', '0.7.7-canary.bad']) {
			const fs = new MemoryFileSystem({ '/repo/manifest.json': original });
			await expect(prepareReleaseManifest('/repo', tag, fs)).rejects.toThrow();
			expect(fs.getFile('/repo/manifest.json')).toBe(original);
		}
	});
});
