import { describe, expect } from 'vitest';
import { nameof } from '@/utils/type/nameof.js';
import { createLoad as createGlobalLoad } from '../../load/createLoad.js';
import { createProgress } from './createProgress.js';
import { createPool } from '../../pool/createPool.js';

describe(nameof({ createProgress }), (it) => {
	it('should be at 1 with no load', () => {
		const loadSignals = createPool();
		const loadProgress = createProgress(loadSignals);

		expect(loadProgress.get()).toEqual(1);
	});

	it('should stay at 1 after a load is finished', () => {
		const loadSignals = createPool();
		const createLoad = () => createGlobalLoad(loadSignals);
		const loadProgress = createProgress(loadSignals);
		const load = createLoad();

		expect(loadProgress.get()).toEqual(0);

		load.finish();

		expect(loadProgress.get()).toEqual(1);
	});

	it('should reset to 0 after a load is finished and a new load is added', () => {
		const loadSignals = createPool();
		const createLoad = () => createGlobalLoad(loadSignals);
		const loadProgress = createProgress(loadSignals);
		const load = createLoad();

		expect(loadProgress.get()).toEqual(0);

		load.finish();

		expect(loadProgress.get()).toEqual(1);

		void createLoad();

		expect(loadProgress.get()).toEqual(0);
	});
});
