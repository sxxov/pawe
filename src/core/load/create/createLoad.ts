import { LoadSignal } from '../signal/LoadSignal';
import { loadSignals } from '../signal/loadSignals';

export function createLoad(context = loadSignals) {
	const signal = new LoadSignal();

	context.update((signals) => [...signals, signal]);

	return signal;
}
