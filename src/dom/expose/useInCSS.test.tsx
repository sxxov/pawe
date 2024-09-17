import { afterAll, beforeAll, describe, expect } from 'vitest';
import { nameof } from '../../utils/type/nameof.js';
import { useInCSS } from './useInCSS.js';
import { bar } from '../../core/loader/bar/bar.js';
import { progress } from '../../core/loader/progress/progress.js';
import { pool } from '../../core/pool/pool.js';
import { createLoad } from '../../core/load/createLoad.js';

describe(nameof({ useInCSS }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = useInCSS();
	});
	afterAll(() => {
		pool.set([]);
		unsubscribe?.();
	});

	it.sequential('should expose data to css', () => {
		expect(`${progress.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-progress'),
		);
		expect(`${bar.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-bar'),
		);

		createLoad().set(0.5);

		expect(`${progress.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-progress'),
		);
		expect(`${bar.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-bar'),
		);
	});
});
