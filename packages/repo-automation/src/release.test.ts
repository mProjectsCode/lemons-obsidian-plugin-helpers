import path from 'node:path';
import { describe, expect, it } from 'bun:test';
import { getRepoPath, loadConfig, readJsonFile, writeJsonFile } from './release';
import { MemoryFileSystem } from './utils/fileSystem';
import { UserError } from './utils/utils';

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
