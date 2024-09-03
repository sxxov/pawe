import { Signal } from '@/utils/signal/Signal';
import { use } from '@/utils/signal/use';
import { getLoadBarNext } from './getLoadBarNext';
import { loadProgress } from '../progress/loadProgress';

/** @private */
export function createLoadBar(context = loadProgress) {
	const loadBar = new Signal(0);
	const loading = context.derive((progress) => progress < 1);
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

			const next = getLoadBarNext(context.get(), loadBar.get(), deltaT);
			loadBar.set(next);
		});

		return () => {
			if (rafHandle) {
				cancelAnimationFrame(rafHandle);
				rafHandle = undefined;
			}
		};
	});

	return loadBar;
}
