import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const targets = [
	['helpers-v', 'packages/helpers'],
	['automation-v', 'packages/repo-automation'],
	['eslint-config-v', 'packages/eslint-config'],
] as const;
const tag = process.env.RELEASE_TAG ?? '';
const target = targets.find(([prefix]) => tag.startsWith(prefix));
if (!target) {
	throw new Error('Unsupported package tag');
}
const [prefix, folder] = target;
const metadata = JSON.parse(readFileSync(path.join(folder, 'package.json'), 'utf8')) as { version: string };
if (tag !== prefix + metadata.version) {
	throw new Error('Tag and package version differ');
}
mkdirSync('artifacts', { recursive: true });
const tarball = path.resolve('artifacts', tag + '.tgz');
const result = spawnSync('bun', ['pm', 'pack', '--filename', tarball], { cwd: folder, stdio: 'inherit' });
if (result.status !== 0) {
	throw new Error('Package packing failed');
}
if (process.env.GITHUB_OUTPUT) {
	appendFileSync(process.env.GITHUB_OUTPUT, `tarball=${tarball}\n`);
}
