import { afterAll, beforeAll, describe, expect } from 'vitest';
import { progress } from '../../core/loader/progress/progress.js';
import { nameof } from '../../utils/type/nameof.js';
import { monitorFetch } from './monitorFetch.js';
import { pool } from '../../core/pool/pool.js';

describe(nameof({ monitorFetch }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = monitorFetch();
	});
	afterAll(() => {
		pool.set([]);
		unsubscribe?.();
	});

	it.sequential('should monitor fetch', async () => {
		expect(progress.get()).toEqual(1);
		const promise = fetch('https://fakeresponder.com/?sleep=0');
		setTimeout(() => {
			expect(progress.get()).greaterThanOrEqual(0).and.lessThan(1);
		}, 0);
		const resp = await promise;
		await resp.blob();
		expect(progress.get()).toEqual(1);
	});
});
