import { type ReadableSignal } from '../../utils/signal/ReadableSignal.js';
import { type LoadScalar } from './LoadScalar.js';

export type ReadableLoadSignal = {
	finish(): void;
} & ReadableSignal<LoadScalar> &
	PromiseLike<void>;
