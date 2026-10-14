import { expect, test } from 'bun:test';
import { ESLint } from 'eslint';
import { createCIConfig, createReviewConfig } from './index.mjs';

function linter(config) {
	return new ESLint({ overrideConfigFile: true, overrideConfig: config });
}
test('review keeps six security rules at error and makes advisory rules warnings', async () => {
	const eslint = linter(createReviewConfig());
	const config = await eslint.calculateConfigForFile('src/main.ts');
	expect(config.rules['no-eval'][0]).toBe(2);
	expect(config.rules['obsidianmd/no-forbidden-elements'][0]).toBe(2);
	expect(config.rules['@typescript-eslint/no-unused-vars'][0]).toBe(1);
	expect(config.rules['obsidianmd/commands/no-plugin-id-in-command-id'][0]).toBe(0);
	expect(await eslint.isPathIgnored('tests/main.test.ts')).toBe(true);
	expect(await eslint.isPathIgnored('vite.config.mts')).toBe(true);
	expect(await eslint.isPathIgnored('packages/api/dist/index.js')).toBe(true);
	expect(await eslint.isPathIgnored('exampleVault/user-script.js')).toBe(true);
});
test('CI excludes tests while keeping source and tools covered', async () => {
	const eslint = linter(createCIConfig({ host: ['src/**'], workers: ['src/worker.ts'] }));
	for (const file of [
		'src/main.test.ts',
		'src/main.tests.ts',
		'src/main.spec.ts',
		'src/main.specs.ts',
		'test/fixtures/api-consumer/index.ts',
		'packages/core/tests/setup.ts',
		'packages/core/__tests__/setup.ts',
		'packages/core/mocks/Plugin.ts',
		'packages/core/__mocks__/Plugin.ts',
		'packages/core/testUtils.ts',
		'packages/core/e2e-tests/setup.ts',
	]) {
		expect(await eslint.isPathIgnored(file)).toBe(true);
	}
	for (const file of ['src/main.ts', 'src/contest.ts', 'src/testing.ts', 'automation/utils/shellUtils.ts']) {
		expect(await eslint.isPathIgnored(file)).toBe(false);
	}
	const core = await eslint.calculateConfigForFile('packages/core/main.ts');
	expect(core.rules['obsidianmd/no-nodejs-modules'][0]).toBe(0);
	expect(core.rules['@typescript-eslint/no-floating-promises'][0]).toBe(2);
	const host = await eslint.calculateConfigForFile('src/main.ts');
	expect(host.rules['obsidianmd/no-plugin-as-component'][0]).toBe(2);
	const worker = await eslint.calculateConfigForFile('src/worker.ts');
	expect(worker.rules['obsidianmd/prefer-window-timers'][0]).toBe(0);
	expect(worker.languageOptions.globals.WorkerGlobalScope).toBeDefined();
});
test('Svelte config uses the Svelte parser and TypeScript delegate', async () => {
	const eslint = linter(createCIConfig({ svelteConfig: {} }));
	const config = await eslint.calculateConfigForFile('src/Component.svelte');
	expect(config.languageOptions.parser.meta.name).toBe('svelte-eslint-parser');
	expect(config.languageOptions.parserOptions.parser.meta.name).toContain('typescript');
	expect(config.rules['svelte/no-at-html-tags'][0]).toBe(2);
	expect(config.rules['@typescript-eslint/no-floating-promises'][0]).toBe(2);
});

test('Svelte rules do not leak into package metadata', async () => {
	const eslint = linter(createCIConfig({ svelteConfig: {} }));
	const [result] = await eslint.lintText('{"name":"test","version":"1.0.0"}', { filePath: 'package.json' });
	expect(result.fatalErrorCount).toBe(0);
});

test('typed Svelte linting parses rune props and keeps host rules out of core', async () => {
	const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
	const { tmpdir } = await import('node:os');
	const { join } = await import('node:path');
	const root = mkdtempSync(join(tmpdir(), 'svelte-lint-test-'));
	try {
		writeFileSync(
			join(root, 'tsconfig.eslint.json'),
			JSON.stringify({ compilerOptions: { strict: true, module: 'ESNext', moduleResolution: 'Bundler', target: 'ES2022' }, include: ['*.svelte'] }),
		);
		const filename = join(root, 'Component.svelte');
		writeFileSync(
			filename,
			'<script lang="ts">const props: { onValueChange(value: string): void } = $props(); let value = $state("");</script><input bind:value oninput={() => props.onValueChange(value)} />',
		);
		const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: createCIConfig({ root, host: ['host/**'], svelteConfig: {} }) });
		const [result] = await eslint.lintFiles([filename]);
		expect(result.fatalErrorCount).toBe(0);
		const config = await eslint.calculateConfigForFile(filename);
		expect(config.rules['obsidianmd/no-plugin-as-component'][0]).toBe(0);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('manifest and license validation are active in CI', async () => {
	const eslint = linter(createCIConfig());
	const [manifest] = await eslint.lintText('{"id":"example"}', { filePath: 'manifest.json' });
	expect(manifest.fatalErrorCount).toBe(0);
	expect(manifest.messages.some(message => message.ruleId === 'obsidianmd/validate-manifest')).toBe(true);
	const year = new Date().getFullYear();
	const [license] = await eslint.lintText(`Copyright (C) ${year} by Dynalist Inc.\n`, { filePath: 'LICENSE' });
	expect(license.fatalErrorCount).toBe(0);
	expect(license.messages.some(message => message.ruleId === 'obsidianmd/validate-license')).toBe(true);
});
