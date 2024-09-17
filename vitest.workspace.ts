import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
// change this back to .js when the issue is fixed
// https://github.com/vitest-dev/vitest/issues/6519
import config from './vite.config.ts';

// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	mergeConfig(config, {
		test: {
			include: ['**/*.{test,spec}.ts'],
			name: 'unit',
			environment: 'node',
		},
	}),
	mergeConfig(config, {
		test: {
			include: ['**/*.{test,spec}.tsx'],
			name: 'browser',
			browser: {
				name: 'chromium',
				provider: 'playwright',
				enabled: true,
				headless: true,
			},
		},
		plugins: [react()],
	}),
]);
