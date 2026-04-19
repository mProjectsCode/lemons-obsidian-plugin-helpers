import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		'packages/helpers/src/index': 'packages/helpers/src/index.ts',
		'packages/repo-automation/src/index': 'packages/repo-automation/src/index.ts',
		'packages/repo-automation/src/release': 'packages/repo-automation/src/release.ts',
	},
	format: ['esm'],
	dts: true,
	target: 'esnext',
	platform: 'node',
	sourcemap: false,
	treeshake: true,
	outDir: 'dist',
	clean: false,
});
