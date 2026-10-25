import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, expect, test } from 'bun:test';
import { $, Verboseness } from './shellUtils';

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) {
		rmSync(root, { recursive: true, force: true });
	}
});

function fixture(source: string): { root: string; command: string } {
	const root = mkdtempSync(path.join(tmpdir(), 'release-output-'));
	roots.push(root);
	writeFileSync(path.join(root, 'child.ts'), source);
	return { root, command: `${process.execPath} child.ts` };
}

test('quiet commands drain both pipes and retain output and nonzero exit status', async () => {
	const child = fixture(`
		await Bun.write(Bun.stderr, 'e'.repeat(1024 * 1024));
		await Bun.write(Bun.stdout, 'o'.repeat(1024 * 1024));
		process.exit(7);
	`);
	const result = await $(child.command, child.root, Verboseness.QUITET);
	expect(result.exit).toBe(7);
	expect(result.stdout).toBe('o'.repeat(1024 * 1024));
	expect(result.stderr).toBe('e'.repeat(1024 * 1024));
}, 10000);

test('verbose commands forward both streams before exit without adding color', async () => {
	const child = fixture(`
		await Bun.write(Bun.stdout, 'stdout ready\\n');
		await Bun.write(Bun.stderr, 'stderr ready\\n');
		const deadline = Date.now() + 3000;
		while (!(await Bun.file('continue').exists())) {
			if (Date.now() > deadline) process.exit(9);
			await Bun.sleep(10);
		}
		process.exit(7);
	`);
	const modulePath = path.join(import.meta.dir, 'shellUtils.ts');
	const runner = Bun.spawn(
		[
			process.execPath,
			'--eval',
			`
		import { $, Verboseness } from ${JSON.stringify(modulePath)};
		const result = await $(${JSON.stringify(child.command)}, undefined, Verboseness.VERBOSE);
		console.log('RESULT:' + JSON.stringify(result));
	`,
		],
		{ cwd: child.root, stdout: 'pipe', stderr: 'pipe' },
	);
	let stdout = '';
	let stderr = '';
	async function read(stream: ReadableStream<Uint8Array>, isStdout: boolean): Promise<void> {
		const reader = stream.getReader();
		const decoder = new TextDecoder();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					return;
				}
				const text = decoder.decode(value, { stream: true });
				if (isStdout) {
					stdout += text;
				} else {
					stderr += text;
				}
				if (stdout.includes('stdout ready\n') && stderr.includes('stderr ready\n')) {
					writeFileSync(path.join(child.root, 'continue'), '');
				}
			}
		} finally {
			reader.releaseLock();
		}
	}
	try {
		await Promise.all([read(runner.stdout, true), read(runner.stderr, false), runner.exited]);
		expect(stderr).toBe('stderr ready\n');
		expect(stdout).toContain('RESULT:' + JSON.stringify({ stdout: 'stdout ready\n', stderr: 'stderr ready\n', exit: 7 }));
	} finally {
		runner.kill();
	}
}, 10000);
