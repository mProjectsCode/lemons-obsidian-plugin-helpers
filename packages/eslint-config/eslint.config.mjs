import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
export default [
	{
		ignores: [
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
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{ files: ['**/*.{mjs,ts}'], languageOptions: { globals: globals.node }, rules: { curly: ['error', 'all'] } },
];
