import { mergeConfig } from 'vite';
import config from './vite.config';
import react from '@vitejs/plugin-react';

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
