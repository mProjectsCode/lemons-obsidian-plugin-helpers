import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'packages/helpers/src/index.ts',
			name: 'LemonsObsidianPluginHelpers',
			fileName: () => 'helpers.js',
			formats: ['es'],
		},
		emptyOutDir: true,
		outDir: 'dist',
	},
});
