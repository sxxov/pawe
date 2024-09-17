import { Signal } from '@/utils/signal/Signal.js';
import { use } from '@/utils/signal/use.js';
import { getBarNext } from './getBarNext.js';
import { type progress as globalProgress } from '../progress/progress.js';

export function createBar(progress: typeof globalProgress) {
	const loadBar = new Signal(0);
	const loading = progress.derive((progress) => progress < 1);
	let rafHandle: ReturnType<typeof requestAnimationFrame> | undefined;

	use({ loading }, ({ $loading }) => {
		if (!$loading) {
			loadBar.set(1);
			return;
		}

		loadBar.set(0);

		let prevT: number | undefined;
		rafHandle = requestAnimationFrame(function raf(t) {
			rafHandle = requestAnimationFrame(raf);

			if (prevT === undefined) {
				prevT = t;
				return;
			}

			const deltaT = t - prevT;
			prevT = t;

			const next = getBarNext(progress.get(), loadBar.get(), deltaT);
			loadBar.set(next);
		});

		return () => {
			if (rafHandle) {
				cancelAnimationFrame(rafHandle);
				rafHandle = undefined;
			}
		};
	});

	return loadBar.supply;
}
