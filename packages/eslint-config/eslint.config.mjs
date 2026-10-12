import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{ files: ['**/*.{mjs,ts}'], languageOptions: { globals: globals.node }, rules: { curly: ['error', 'all'] } },
];
