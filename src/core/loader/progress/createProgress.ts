import { average } from '@/utils/math/average.js';
import { pool } from '../../pool/pool.js';
import { LoadSignal } from '../../load/LoadSignal.js';

export function createProgress(context = pool) {
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

	return loadProgress.supply;
}
