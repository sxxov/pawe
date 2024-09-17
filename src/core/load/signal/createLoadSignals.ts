import { Signal } from '@/utils/signal/Signal.js';
import { type ReadableLoadSignal } from './ReadableLoadSignal.js';

export function createLoadSignals() {
	const loadSignals = new Signal<ReadableLoadSignal[]>([]);
	const loadSignalToUnsubscribe = new Map<ReadableLoadSignal, () => void>();
	loadSignals.subscribeDeferred((signals) => {
		let hasNewSignal = false;

		// new signals that need to be subscribed to
		for (const signal of signals) {
			if (loadSignalToUnsubscribe.has(signal)) {
				continue;
			}

			loadSignalToUnsubscribe.set(
				signal,
				signal.subscribeDeferred(() => {
					loadSignals.notify();
				}),
			);
			hasNewSignal = true;
		}

		if (!hasNewSignal && loadSignalToUnsubscribe.size === signals.length) {
			return;
		}

		// stale signals that we need to unsubscribe from
		for (const [signal, unsubscribe] of loadSignalToUnsubscribe) {
			if (!signals.includes(signal)) {
				unsubscribe();
				loadSignalToUnsubscribe.delete(signal);
			}
		}
	});

	return loadSignals;
}
