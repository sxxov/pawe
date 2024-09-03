import { afterAll, beforeAll, describe, expect } from 'vitest';
import { loadProgress } from '../../core/load/progress/loadProgress';
import { nameof } from '../../utils/type/nameof';
import { monitorXMLHttpRequest } from './monitorXMLHttpRequest';

describe(nameof({ monitorXMLHttpRequest }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = monitorXMLHttpRequest();
	});
	afterAll(() => {
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
