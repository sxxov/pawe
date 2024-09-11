import { type ReadableSignal } from '../../../utils/signal/ReadableSignal.js';
import { type LoadProgressScalar } from './LoadProgressScalar.js';

export type ReadableLoadSignal = {} & ReadableSignal<LoadProgressScalar> &
	PromiseLike<void>;
