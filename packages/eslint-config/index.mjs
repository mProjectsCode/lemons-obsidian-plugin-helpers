import { defineConfig } from 'eslint/config';
import obsidianmd from 'eslint-plugin-obsidianmd';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { PlainTextParser } from 'eslint-plugin-obsidianmd/dist/lib/plainTextParser.js';

const code = ['**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'];
const developmentCode = [...code, '**/*.svelte'];
const typed = ['**/*.{ts,tsx,mts,cts}'];
const testIgnores = [
	'**/*.test.*',
	'**/*.tests.*',
	'**/*.spec.*',
	'**/*.specs.*',
	'**/test/**',
	'**/tests/**',
	'**/__tests__/**',
	'**/mocks/**',
	'**/__mocks__/**',
	'**/testUtils**',
	'**/e2e-tests/**',
];
const generated = [
	'**/node_modules/**',
	'**/dist/**',
	'**/lib/**',
	'**/pkg/**',
	'**/target/**',
	'**/.obsidian/**',
	'exampleVault/**',
	'main.js',
	'Publish.js',
	'meta.txt',
	'vendor/**',
];
export const scannerSecurityRules = [
	'no-eval',
	'no-implied-eval',
	'no-unsanitized/method',
	'no-unsanitized/property',
	'obsidianmd/regex-lookbehind',
	'obsidianmd/no-forbidden-elements',
];
const scannerIgnores = [
	'node_modules',
	'dist',
	'build',
	'pkg',
	'test-vault',
	'.obsidian',
	'**/.obsidian/**',
	'esbuild.config.mjs',
	'version-bump.mjs',
	'**/*.test.*',
	'**/*.tests.*',
	'**/*.spec.*',
	'**/*.specs.*',
	'**/test/**',
	'**/tests/**',
	'**/__tests__/**',
	'**/mocks/**',
	'**/__mocks__/**',
	'**/*.cjs',
	'**/*.mjs',
	'**/*.cts',
	'**/*.mts',
	'**/vite*',
	'**/scripts/**',
	'**/docs/**',
	'**/i18n/**',
	'**/i18next/**',
	'**/locale/**',
	'**/locales/**',
	'**/translations/**',
	'**/l10n/**',
	'.pnpm-store',
	'**/testUtils**',
	'automation/**',
	'e2e-tests/**',
];
const scannerOff = [
	'no-undef',
	'@typescript-eslint/no-unsafe-member-access',
	'@typescript-eslint/no-unsafe-assignment',
	'@typescript-eslint/no-unsafe-argument',
	'@typescript-eslint/no-unsafe-call',
	'@typescript-eslint/no-unsafe-return',
	'@typescript-eslint/restrict-template-expressions',
	'@typescript-eslint/no-base-to-string',
	'import/no-unresolved',
	'obsidianmd/validate-manifest',
	'obsidianmd/validate-license',
	'obsidianmd/commands/no-command-in-command-id',
	'obsidianmd/commands/no-plugin-id-in-command-id',
];
const hostOff = Object.fromEntries(Object.keys(obsidianmd.rules).map(rule => [`obsidianmd/${rule}`, 'off']));

/** Reproduce documented scanner scope and severities; accepts no CI exceptions. */
export function createReviewConfig({ root = process.cwd(), generated: generatedSource = [] } = {}) {
	const recommended = obsidianmd.configs.recommended.map(config => ({
		...config,
		...(config.rules
			? {
					rules: Object.fromEntries(
						Object.entries(config.rules).map(([rule, value]) => {
							const options = Array.isArray(value) ? value.slice(1) : [];
							const level = Array.isArray(value) ? value[0] : value;
							return [rule, [level === 0 || level === 'off' ? 'off' : scannerSecurityRules.includes(rule) ? 'error' : 'warn', ...options]];
						}),
					),
				}
			: {}),
	}));
	return defineConfig([
		{ ignores: [...generated, ...scannerIgnores, 'exampleVault/**', ...generatedSource] },
		...recommended,
		{
			files: code,
			languageOptions: {
				parserOptions: {
					projectService: { allowDefaultProject: ['eslint.config.js', 'manifest.json'] },
					tsconfigRootDir: root,
					extraFileExtensions: ['.json'],
				},
			},
			rules: Object.fromEntries(scannerOff.map(rule => [rule, 'off'])),
		},
	]);
}

/** Development profile: source/tools are covered; tests are excluded; host rules apply only to host source. */
export function createCIConfig({
	root = process.cwd(),
	host = ['src/**', 'packages/obsidian/**', 'packages/jsEngine/**'],
	workers = [],
	svelteConfig,
	project = './tsconfig.eslint.json',
	ignores = [],
	overrides = [],
} = {}) {
	const configs = [
		{ ignores: [...generated, ...testIgnores, ...ignores] },
		...obsidianmd.configs.recommended,
		{
			files: developmentCode,
			rules: { ...hostOff, 'no-restricted-globals': 'off', '@typescript-eslint/no-restricted-imports': 'off' },
			languageOptions: { globals: { ...globals.node, Bun: 'readonly' } },
		},
		{
			files: host,
			rules: {
				...obsidianmd.ruleConfigs.recommended,
				...obsidianmd.ruleConfigs.recommendedTypeChecked,
				...Object.assign(
					{},
					...obsidianmd.configs.recommended.map(c =>
						Object.fromEntries(
							Object.entries(c.rules ?? {}).filter(
								([rule]) => rule.startsWith('obsidianmd/') || rule === 'no-restricted-globals' || rule === '@typescript-eslint/no-restricted-imports',
							),
						),
					),
				),
			},
		},
		{ files: typed, languageOptions: { parserOptions: { project, tsconfigRootDir: root, extraFileExtensions: ['.svelte'] } } },
		{
			files: developmentCode,
			rules: {
				curly: ['error', 'all'],
				eqeqeq: ['error', 'always', { null: 'ignore' }],
				'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
				'@typescript-eslint/no-unused-vars': [
					'error',
					{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
				],
				'@typescript-eslint/ban-ts-comment': [
					'error',
					{ 'ts-ignore': true, 'ts-nocheck': true, 'ts-expect-error': 'allow-with-description', minimumDescriptionLength: 10 },
				],
				'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
				'import/order': ['error', { 'newlines-between': 'never', alphabetize: { order: 'asc', orderImportKind: 'asc', caseInsensitive: true } }],
			},
		},
		{ files: typed, rules: { '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }] } },
	];
	configs.push({
		files: ['manifest.json'],
		languageOptions: { parser: tseslint.parser, parserOptions: { project: false, projectService: false } },
		rules: { 'obsidianmd/validate-manifest': 'warn' },
	});
	configs.push({
		files: ['LICENSE', 'LICENSE.md', 'LICENSE.txt'],
		languageOptions: { parser: PlainTextParser },
		rules: { 'obsidianmd/validate-license': 'warn' },
	});

	if (workers.length) {
		configs.push({
			files: workers,
			languageOptions: { globals: globals.worker },
			rules: { 'obsidianmd/prefer-window-timers': 'off', 'obsidianmd/no-global-this': 'off' },
		});
	}
	if (svelteConfig) {
		// Reuse the registered recommended plugins/rules for typed Svelte scripts.
		const tsBlocks = obsidianmd.configs.recommended.filter(c => c.files?.some(f => typeof f === 'string' && f.includes('ts,')));
		configs.push(...tsBlocks.map(c => ({ ...c, files: ['**/*.svelte'] })));
		configs.push({ files: ['**/*.svelte'], rules: hostOff });
		configs.push({
			files: host.map(pattern => ['**/*.svelte', pattern]),
			rules: Object.assign({}, ...tsBlocks.map(c => Object.fromEntries(Object.entries(c.rules ?? {}).filter(([rule]) => rule.startsWith('obsidianmd/'))))),
		});
		configs.push(
			...[...svelte.configs['flat/recommended'], ...svelte.configs['flat/prettier']].map(c => (c.rules && !c.files ? { ...c, files: ['**/*.svelte'] } : c)),
		);
		configs.push({
			files: ['**/*.svelte'],
			languageOptions: { parserOptions: { parser: tseslint.parser, project, tsconfigRootDir: root, extraFileExtensions: ['.svelte'], svelteConfig } },
			rules: { '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }] },
		});
	}
	// Keep Obsidian's advisory findings as warnings; enabled development checks block CI.
	const strictConfigs = configs.map(config => ({
		...config,
		...(config.rules
			? {
					rules: Object.fromEntries(
						Object.entries(config.rules).map(([rule, value]) => {
							const level = Array.isArray(value) ? value[0] : value;
							if (!rule.startsWith('obsidianmd/') && (level === 'warn' || level === 1)) {
								return [rule, ['error', ...(Array.isArray(value) ? value.slice(1) : [])]];
							}
							return [rule, value];
						}),
					),
				}
			: {}),
	}));
	return defineConfig([...strictConfigs, ...overrides]);
}
