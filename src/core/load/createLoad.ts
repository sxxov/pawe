import { LoadSignal } from './LoadSignal.js';
import { pool } from '../pool/pool.js';

export function createLoad(context = pool) {
	const signal = new LoadSignal();

	context.update((signals) => [...signals, signal]);

	return signal;
}
