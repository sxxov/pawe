import { describe, expect } from 'vitest';
import { nameof } from '../../../utils/type/nameof.js';
import { createLoad } from './createLoad.js';
import { createLoadProgress } from '../progress/createLoadProgress.js';
import { createLoadSignals } from '../signal/createLoadSignals.js';

const createGlobalLoad = createLoad;

describe(nameof({ createLoad }), (it) => {
	it('should add the signal to loadSignals', () => {
		const loadSignals = createLoadSignals();
		const createLoad = () => createGlobalLoad(loadSignals);

		const load = createLoad();
		expect(loadSignals.get()).toContain(load);
	});

	it('should influence loadProgress', () => {
		const loadSignals = createLoadSignals();
		const createLoad = () => createGlobalLoad(loadSignals);
		const loadProgress = createLoadProgress(loadSignals);

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
