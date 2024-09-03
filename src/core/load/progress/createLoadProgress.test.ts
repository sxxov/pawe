import { describe, expect } from 'vitest';
import { nameof } from '../../../utils/type/nameof';
import { createLoad as createGlobalLoad } from '../create/createLoad';
import { createLoadProgress } from './createLoadProgress';
import { createLoadSignals } from '../signal/createLoadSignals';

describe(nameof({ createLoadProgress }), (it) => {
	it('should be at 1 with no load', () => {
		const loadSignals = createLoadSignals();
		const loadProgress = createLoadProgress(loadSignals);

		expect(loadProgress.get()).toEqual(1);
	});

	it('should stay at 1 after a load is finished', () => {
		const loadSignals = createLoadSignals();
		const createLoad = () => createGlobalLoad(loadSignals);
		const loadProgress = createLoadProgress(loadSignals);
		const load = createLoad();

		expect(loadProgress.get()).toEqual(0);

		load.finish();

		expect(loadProgress.get()).toEqual(1);
	});

	it('should reset to 0 after a load is finished and a new load is added', () => {
		const loadSignals = createLoadSignals();
		const createLoad = () => createGlobalLoad(loadSignals);
		const loadProgress = createLoadProgress(loadSignals);
		const load = createLoad();

		expect(loadProgress.get()).toEqual(0);

		load.finish();

		expect(loadProgress.get()).toEqual(1);

		void createLoad();

		expect(loadProgress.get()).toEqual(0);
	});
});
