import { LoadSignal } from '../signal/LoadSignal.js';
import { loadSignals } from '../signal/loadSignals.js';

export function createLoad(context = loadSignals) {
	const signal = new LoadSignal();

	context.update((signals) => [...signals, signal]);

	return signal;
}
