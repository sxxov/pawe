import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es'],
			name: 'pase',
		},
		rollupOptions: {
			input: {
				index: 'src/index.ts',
				api: 'src/api.ts',
			},
			output: {
				entryFileNames: ({ name }) => `${name}.js`,
				format: 'es',
				inlineDynamicImports: false,
			},
		},
	},
	plugins: [
		tsconfigPaths(),
		dts({
			entryRoot: 'src',
		}),
	],
});
