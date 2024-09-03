import { afterAll, beforeAll, describe, expect } from 'vitest';
import { loadProgress } from '../../core/load/progress/loadProgress';
import { nameof } from '../../utils/type/nameof';
import { monitorFetch } from './monitorFetch';
import { loadSignals } from '../../core/load/signal/loadSignals';

describe(nameof({ monitorFetch }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = monitorFetch();
	});
	afterAll(() => {
		loadSignals.set([]);
		unsubscribe?.();
	});

	it.sequential('should monitor fetch', async () => {
		expect(loadProgress.get()).toEqual(1);
		const promise = fetch('https://fakeresponder.com/?sleep=0');
		setTimeout(() => {
			expect(loadProgress.get()).greaterThanOrEqual(0).and.lessThan(1);
		}, 0);
		const resp = await promise;
		await resp.blob();
		expect(loadProgress.get()).toEqual(1);
	});
});
