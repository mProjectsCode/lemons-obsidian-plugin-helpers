import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		'src/index': 'src/index.ts',
		'src/release': 'src/release.ts',
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
