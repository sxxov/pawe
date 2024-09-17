import { type ReadableSignal } from '../../../utils/signal/ReadableSignal.js';
import { type LoadProgressScalar } from './LoadProgressScalar.js';

export type ReadableLoadSignal = {
	finish(): void;
} & ReadableSignal<LoadProgressScalar> &
	PromiseLike<void>;
