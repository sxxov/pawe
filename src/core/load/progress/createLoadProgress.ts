import { average } from '@/utils/math/average';
import { loadSignals } from '../signal/loadSignals';
import { LoadSignal } from '../signal/LoadSignal';

/** @private */
export function createLoadProgress(context = loadSignals) {
	const loadProgress = new LoadSignal();
	context.subscribe((v) => {
		if (v.length === 0) {
			loadProgress.set(1);
			return;
		}

		const progressValues = v.map((source) => source.get());
		loadProgress.set(average(...progressValues));
	});
	loadProgress.subscribe((value) => {
		if (value >= 1) {
			context.set([]);
		}
	});

	return loadProgress;
}
