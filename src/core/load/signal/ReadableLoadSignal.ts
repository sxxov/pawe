import { type ReadableSignal } from '../../../utils/signal/ReadableSignal';
import { type LoadProgressScalar } from './LoadProgressScalar';

export type ReadableLoadSignal = {} & ReadableSignal<LoadProgressScalar> &
	PromiseLike<void>;
