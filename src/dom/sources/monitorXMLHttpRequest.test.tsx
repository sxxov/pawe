import { afterAll, beforeAll, describe, expect } from 'vitest';
import { progress } from '../../core/loader/progress/progress.js';
import { nameof } from '../../utils/type/nameof.js';
import { monitorXMLHttpRequest } from './monitorXMLHttpRequest.js';
import { pool } from '../../core/pool/pool.js';

describe(nameof({ monitorXMLHttpRequest }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = monitorXMLHttpRequest();
	});
	afterAll(() => {
		pool.set([]);
		unsubscribe?.();
	});

	it.sequential('should monitor XMLHttpRequest', async () => {
		expect(progress.get()).toEqual(1);
		const xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://fakeresponder.com/?sleep=0', true);
		xhr.send();
		await new Promise((resolve) => {
			xhr.addEventListener('loadend', resolve, { once: true });
			setTimeout(() => {
				expect(progress.get()).greaterThanOrEqual(0).and.lessThan(1);
			}, 0);
		});
		expect(progress.get()).toEqual(1);
	});

	it.sequential('should not monitor bypassed XMLHttpRequest', async () => {
		expect(progress.get()).toEqual(1);
		const xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://fakeresponder.com/?sleep=0', true);
		xhr.pawe = 'bypass';
		xhr.send();
		await new Promise((resolve) => {
			xhr.addEventListener('loadend', resolve, { once: true });
			setTimeout(() => {
				expect(progress.get()).toEqual(1);
			}, 0);
		});
		expect(progress.get()).toEqual(1);
	});
});
