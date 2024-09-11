import { afterAll, beforeAll, describe, expect } from 'vitest';
import { loadProgress } from '../../core/load/progress/loadProgress.js';
import { nameof } from '../../utils/type/nameof.js';
import { monitorXMLHttpRequest } from './monitorXMLHttpRequest.js';
import { loadSignals } from '../../core/load/signal/loadSignals.js';

describe(nameof({ monitorXMLHttpRequest }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = monitorXMLHttpRequest();
	});
	afterAll(() => {
		loadSignals.set([]);
		unsubscribe?.();
	});

	it.sequential('should monitor XMLHttpRequest', async () => {
		expect(loadProgress.get()).toEqual(1);
		const xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://fakeresponder.com/?sleep=0', true);
		xhr.send();
		await new Promise((resolve) => {
			xhr.addEventListener('loadend', resolve, { once: true });
			setTimeout(() => {
				expect(loadProgress.get())
					.greaterThanOrEqual(0)
					.and.lessThan(1);
			}, 0);
		});
		expect(loadProgress.get()).toEqual(1);
	});
});
