import { clamp01 } from '../../../utils/math/clamp01';
import { Signal } from '../../../utils/signal/Signal';
import { type LoadProgressScalar } from './LoadProgressScalar';
import { type ReadableLoadSignal } from './ReadableLoadSignal';

export class LoadSignal
	extends Signal<LoadProgressScalar>
	implements ReadableLoadSignal
{
	constructor(initialValue: LoadProgressScalar = 0) {
		super(initialValue);
	}

	public override set(value: LoadProgressScalar) {
		super.set(clamp01(value));
	}

	public finish() {
		this.set(1);
	}

	public then<FulfilledResult = void, RejectedResult = never>(
		onFulfilled?:
			| ((value: void) => FulfilledResult | PromiseLike<FulfilledResult>)
			| undefined
			// eslint-disable-next-line @typescript-eslint/no-restricted-types
			| null,
		onRejected?:
			| ((
					reason: unknown,
			  ) => RejectedResult | PromiseLike<RejectedResult>)
			| undefined
			// eslint-disable-next-line @typescript-eslint/no-restricted-types
			| null,
	): PromiseLike<FulfilledResult | RejectedResult> {
		return new Promise<void>((resolve) => {
			this.subscribe((value) => {
				if (value >= 1) {
					resolve();
				}
			});
		}).then(onFulfilled, onRejected);
	}
}
