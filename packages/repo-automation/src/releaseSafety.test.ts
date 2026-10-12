import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, expect, test } from 'bun:test';

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) {
		rmSync(root, { recursive: true, force: true });
	}
});

function fixture(): string {
	const root = mkdtempSync(path.join(tmpdir(), 'release-safety-'));
	roots.push(root);
	const init = spawnSync('git', ['init', '--initial-branch=main'], { cwd: root });
	expect(init.status).toBe(0);
	writeFileSync(path.join(root, 'tracked.txt'), 'original');
	writeFileSync(
		path.join(root, 'repo-automation.config.json'),
		JSON.stringify({ devBranch: 'main', releaseBranch: 'release', github: 'https://example.test' }),
	);
	spawnSync('git', ['add', '.'], { cwd: root });
	const commit = spawnSync('git', ['-c', 'user.name=Tooling test', '-c', 'user.email=test@example.test', 'commit', '-m', 'fixture'], { cwd: root });
	expect(commit.status).toBe(0);
	return root;
}

function invoke(root: string, code: string): ReturnType<typeof spawnSync> {
	const modulePath = path.join(import.meta.dir, 'release.ts');
	return spawnSync(process.execPath, ['--eval', `import { runRelease, runPreconditions } from ${JSON.stringify(modulePath)}; ${code}`], {
		cwd: root,
		encoding: 'utf8',
	});
}

test('release preparation rejects untracked work without staging it', () => {
	const root = fixture();
	writeFileSync(path.join(root, 'user-work.txt'), 'unfinished');
	const result = invoke(root, 'await runRelease();');
	expect(result.status).toBe(1);
	expect(String(result.stderr)).toContain('Working tree must be clean');
	expect(spawnSync('git', ['diff', '--cached', '--name-only'], { cwd: root, encoding: 'utf8' }).stdout).toBe('');
	expect(spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout).toContain('?? user-work.txt');
});

test('mutating preconditions fail without staging or committing changes', () => {
	const root = fixture();
	const before = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout;
	const command = `bun --eval 'Bun.write("tracked.txt", "changed")'`;
	const result = invoke(root, `await runPreconditions(${JSON.stringify([command])});`);
	expect(result.status).toBe(1);
	expect(String(result.stderr)).toContain('preconditions changed the working tree');
	expect(spawnSync('git', ['diff', '--cached', '--name-only'], { cwd: root, encoding: 'utf8' }).stdout).toBe('');
	expect(spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout).toBe(before);
});
