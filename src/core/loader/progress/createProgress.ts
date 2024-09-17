import { average } from '@/utils/math/average.js';
import { type pool as globalPool } from '../../pool/pool.js';
import { LoadSignal } from '../../load/LoadSignal.js';

export function createProgress(pool: typeof globalPool) {
	const loadProgress = new LoadSignal();
	pool.subscribe((v) => {
		if (v.length === 0) {
			loadProgress.set(1);
			return;
		}

		const progressValues = v.map((source) => source.get());
		loadProgress.set(average(...progressValues));
	});
	loadProgress.subscribe((value) => {
		if (value >= 1) {
			pool.set([]);
		}
	});

	return loadProgress.supply;
}
