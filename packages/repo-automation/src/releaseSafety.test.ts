import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, expect, test } from 'bun:test';
import { publishRelease } from './release';

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
	git(root, 'config', 'user.name', 'Tooling test');
	git(root, 'config', 'user.email', 'test@example.test');
	git(root, 'branch', 'release');
	return root;
}

function git(root: string, ...args: string[]): string {
	const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
	expect(result.status, result.stderr).toBe(0);
	return result.stdout.trim();
}

function invoke(root: string, code: string): ReturnType<typeof spawnSync> {
	const modulePath = path.join(import.meta.dir, 'release.ts');
	return spawnSync(process.execPath, ['--eval', `import { runRelease, runPreconditions } from ${JSON.stringify(modulePath)}; ${code}`], {
		cwd: root,
		encoding: 'utf8',
	});
}

test('release rejects untracked work without staging it', () => {
	const root = fixture();
	writeFileSync(path.join(root, 'user-work.txt'), 'unfinished');
	const result = invoke(root, 'await runRelease();');
	expect(result.status).toBe(1);
	expect(String(result.stderr)).toContain('Working tree must be clean');
	expect(spawnSync('git', ['diff', '--cached', '--name-only'], { cwd: root, encoding: 'utf8' }).stdout).toBe('');
	expect(spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout).toContain('?? user-work.txt');
});

test('successful preconditions can generate changes for the release commit', () => {
	const root = fixture();
	const before = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout;
	const command = `bun --eval 'Bun.write("tracked.txt", "changed")'`;
	const result = invoke(root, `await runPreconditions(${JSON.stringify([command])});`);
	expect(result.status).toBe(0);
	expect(readFileSync(path.join(root, 'tracked.txt'), 'utf8')).toBe('changed');
	expect(spawnSync('git', ['diff', '--cached', '--name-only'], { cwd: root, encoding: 'utf8' }).stdout).toBe('');
	expect(spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout).toBe(before);
});

for (const version of ['0.7.8', '0.7.7-canary.20261027T120000']) {
	test(`publishes ${version} through both branches and an annotated tag`, async () => {
		const root = fixture();
		const remote = mkdtempSync(path.join(tmpdir(), 'release-remote-'));
		roots.push(remote);
		git(remote, 'init', '--bare');
		git(root, 'remote', 'add', 'origin', remote);
		writeFileSync(path.join(root, 'CHANGELOG.md'), `# ${version}\n\nRelease notes.\n`);
		await publishRelease(root, { devBranch: 'main', releaseBranch: 'release', github: '' }, version);
		const head = git(root, 'rev-parse', 'HEAD');
		expect(git(root, 'branch', '--show-current')).toBe('main');
		expect(git(root, 'status', '--porcelain')).toBe('');
		expect(git(root, 'cat-file', '-t', version)).toBe('tag');
		for (const ref of ['refs/heads/main', 'refs/heads/release', `refs/tags/${version}^{}`]) {
			expect(git(remote, 'rev-parse', ref)).toBe(head);
		}
	});
}

test('canary with unchanged notes still tags and pushes without an empty commit', async () => {
	const root = fixture();
	const remote = mkdtempSync(path.join(tmpdir(), 'release-remote-'));
	roots.push(remote);
	git(remote, 'init', '--bare');
	git(root, 'remote', 'add', 'origin', remote);
	const before = git(root, 'rev-parse', 'HEAD');
	const version = '0.7.7-canary.20261027T120000';
	await publishRelease(root, { devBranch: 'main', releaseBranch: 'release', github: '' }, version);
	expect(git(root, 'rev-parse', 'HEAD')).toBe(before);
	expect(git(remote, 'rev-parse', `refs/tags/${version}^{}`)).toBe(before);
});

test('an existing tag stops publication before committing prepared changes', async () => {
	const root = fixture();
	git(root, 'tag', '0.7.8');
	const before = git(root, 'rev-parse', 'HEAD');
	writeFileSync(path.join(root, 'CHANGELOG.md'), '# 0.7.8\n');
	await expect(publishRelease(root, { devBranch: 'main', releaseBranch: 'release', github: '' }, '0.7.8')).rejects.toThrow('already exists');
	expect(git(root, 'rev-parse', 'HEAD')).toBe(before);
	expect(git(root, 'diff', '--cached', '--name-only')).toBe('');
});

test('a rejected branch push does not publish either branch or the tag', async () => {
	const root = fixture();
	const remote = mkdtempSync(path.join(tmpdir(), 'release-remote-'));
	roots.push(remote);
	git(remote, 'init', '--bare');
	git(root, 'remote', 'add', 'origin', remote);
	git(root, 'push', 'origin', 'main', 'release');
	const before = git(remote, 'rev-parse', 'refs/heads/main');
	git(remote, 'config', 'receive.denyNonFastForwards', 'true');
	const other = mkdtempSync(path.join(tmpdir(), 'release-other-'));
	roots.push(other);
	git(other, 'clone', '--branch', 'main', remote, '.');
	git(other, 'config', 'user.name', 'Other');
	git(other, 'config', 'user.email', 'other@example.test');
	writeFileSync(path.join(other, 'other.txt'), 'remote work');
	git(other, 'add', '.');
	git(other, 'commit', '-m', 'remote work');
	git(other, 'push', 'origin', 'main');
	const remoteHead = git(remote, 'rev-parse', 'refs/heads/main');
	writeFileSync(path.join(root, 'CHANGELOG.md'), '# 0.7.8\n');
	await expect(publishRelease(root, { devBranch: 'main', releaseBranch: 'release', github: '' }, '0.7.8')).rejects.toThrow('failed');
	expect(git(remote, 'rev-parse', 'refs/heads/main')).toBe(remoteHead);
	expect(git(remote, 'rev-parse', 'refs/heads/release')).toBe(before);
	expect(git(remote, 'tag', '--list')).toBe('');
});

for (const canary of [false, true]) {
	test(`release command runs the complete ${canary ? 'canary' : 'stable'} workflow`, async () => {
		const root = fixture();
		const remote = mkdtempSync(path.join(tmpdir(), 'release-cli-remote-'));
		roots.push(remote);
		git(remote, 'init', '--bare');
		git(root, 'remote', 'add', 'origin', remote);
		writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({ version: '0.7.7', minAppVersion: '1.13.0' }));
		writeFileSync(path.join(root, 'versions.json'), JSON.stringify({ '0.7.7': '1.13.0' }));
		writeFileSync(
			path.join(root, 'package.json'),
			JSON.stringify({
				version: '0.7.7',
				scripts: { format: `bun --eval 'await Bun.write("formatted.txt", "formatted")'` },
			}),
		);
		writeFileSync(path.join(root, 'CHANGELOG.md'), '# Unreleased\n\nTest release notes.\n');
		git(root, 'add', '.');
		git(root, 'commit', '-m', 'plugin fixture');
		// Start on another branch: release switches to the configured development branch.
		git(root, 'checkout', 'release');
		const modulePath = path.join(import.meta.dir, 'release.ts');
		const proc = Bun.spawn([process.execPath, '--eval', `import { runRelease } from ${JSON.stringify(modulePath)}; await runRelease();`], {
			cwd: root,
			stdin: 'pipe',
			stdout: 'pipe',
			stderr: 'pipe',
		});
		let output = '';
		let pending = '';
		const replies = [canary ? '3' : '2', 'y', 'y'];
		const readOutput = async (): Promise<void> => {
			const decoder = new TextDecoder();
			for await (const chunk of proc.stdout) {
				const text = decoder.decode(chunk, { stream: true });
				output += text;
				pending += text;
				const match = /Select \[[^\]]+\]:|\[Y\/N\]\?/.exec(pending);
				if (match) {
					pending = pending.slice(match.index + match[0].length);
					const reply = replies.shift();
					if (reply === undefined) {
						throw new Error(`Unexpected prompt: ${output}`);
					}
					proc.stdin.write(`${reply}\n`);
					proc.stdin.flush();
				}
			}
		};
		const timeout = setTimeout(() => {
			proc.kill();
		}, 10000);
		try {
			const [, stderr, exit] = await Promise.all([readOutput(), new Response(proc.stderr).text(), proc.exited]);
			expect(exit, `${output}\n${stderr}`).toBe(0);
		} finally {
			clearTimeout(timeout);
			proc.stdin.end();
		}
		const version = git(root, 'tag', '--list');
		expect(version).toMatch(canary ? /^0\.7\.7-canary\./ : /^0\.7\.8$/);
		expect(git(root, 'branch', '--show-current')).toBe('main');
		expect(git(root, 'status', '--porcelain')).toBe('');
		expect(git(remote, 'rev-parse', `refs/tags/${version}^{}`)).toBe(git(root, 'rev-parse', 'HEAD'));
		expect(git(root, 'show', `${version}:formatted.txt`)).toBe('formatted');
		expect(git(root, 'show', `${version}:CHANGELOG.md`)).toContain(`# ${version}`);
		const manifest = JSON.parse(git(root, 'show', `${version}:manifest.json`));
		expect(manifest.version).toBe(canary ? '0.7.7' : '0.7.8');
	}, 15000);
}
