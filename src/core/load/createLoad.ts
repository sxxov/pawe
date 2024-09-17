import { LoadSignal } from './LoadSignal.js';
import { pool as globalPool } from '../pool/pool.js';

/** Creates a load onto the provided context */
export function createLoad(pool: typeof globalPool): LoadSignal;
/** Creates a load onto the global context */
export function createLoad(): LoadSignal;
export function createLoad(pool = globalPool) {
	const signal = new LoadSignal();

	pool.update((signals) => [...signals, signal]);

	return signal;
}
