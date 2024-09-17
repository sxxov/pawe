import { describe, expect } from 'vitest';
import { nameof } from '../../utils/type/nameof.js';
import { createLoad } from './createLoad.js';
import { createProgress } from '../loader/progress/createProgress.js';
import { createPool } from '../pool/createPool.js';

const createGlobalLoad = createLoad;

describe(nameof({ createLoad }), (it) => {
	it('should add the signal to loadSignals', () => {
		const loadSignals = createPool();
		const createLoad = () => createGlobalLoad(loadSignals);

		const load = createLoad();
		expect(loadSignals.get()).toContain(load);
	});

	it('should influence loadProgress', () => {
		const loadSignals = createPool();
		const createLoad = () => createGlobalLoad(loadSignals);
		const loadProgress = createProgress(loadSignals);

		const initialLoadProgress = loadProgress.get();
		const load = createLoad();

		load.set(0.5);
		const postSetLoadProgress = loadProgress.get();
		expect(postSetLoadProgress).not.toEqual(initialLoadProgress);

		load.finish();
		const postFinishLoadProgress = loadProgress.get();
		expect(postFinishLoadProgress).not.toEqual(postSetLoadProgress);
	});
});
