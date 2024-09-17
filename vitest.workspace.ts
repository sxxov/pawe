import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineWorkspace } from 'vitest/config';
// change this back to .js when the issue is fixed
// @ts-expect-error https://github.com/vitest-dev/vitest/issues/6519
import configTs from './vite.config.ts';
import type configJs from './vite.config.js';

const config: typeof configJs = configTs;

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
