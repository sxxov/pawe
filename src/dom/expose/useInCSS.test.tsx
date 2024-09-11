import { afterAll, beforeAll, describe, expect } from 'vitest';
import { nameof } from '../../utils/type/nameof.js';
import { useInCSS } from './useInCSS.js';
import { loadBar } from '../../core/load/bar/loadBar.js';
import { loadProgress } from '../../core/load/progress/loadProgress.js';
import { loadSignals } from '../../core/load/signal/loadSignals.js';
import { createLoad } from '../../core/load/create/createLoad.js';

describe(nameof({ useInCSS }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = useInCSS();
	});
	afterAll(() => {
		loadSignals.set([]);
		unsubscribe?.();
	});

	it.sequential('should expose data to css', () => {
		expect(`${loadProgress.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-progress'),
		);
		expect(`${loadBar.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-bar'),
		);

		createLoad().set(0.5);

		expect(`${loadProgress.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-progress'),
		);
		expect(`${loadBar.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pawe-bar'),
		);
	});
});
