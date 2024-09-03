import { afterAll, beforeAll, describe, expect } from 'vitest';
import { nameof } from '../../utils/type/nameof';
import { useInCSS } from './useInCSS';
import { loadBar } from '../../core/load/bar/loadBar';
import { loadProgress } from '../../core/load/progress/loadProgress';
import { loadSignals } from '../../core/load/signal/loadSignals';
import { createLoad } from '../../core/load/create/createLoad';

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
			document.documentElement.style.getPropertyValue('--pase-progress'),
		);
		expect(`${loadBar.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pase-bar'),
		);

		createLoad().set(0.5);

		expect(`${loadProgress.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pase-progress'),
		);
		expect(`${loadBar.get()}`).toEqual(
			document.documentElement.style.getPropertyValue('--pase-bar'),
		);
	});
});
