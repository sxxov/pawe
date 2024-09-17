import { clamp01 } from '../../../utils/math/clamp01.js';
import { Signal } from '../../../utils/signal/Signal.js';
import { type LoadProgressScalar } from './LoadProgressScalar.js';
import { LoadSupply } from './LoadSupply.ts';
import { type ReadableLoadSignal } from './ReadableLoadSignal.js';

export class LoadSignal
	extends Signal<LoadProgressScalar>
	implements ReadableLoadSignal
{
	#supply: LoadSupply | undefined;
	public override get supply(): LoadSupply {
		// eslint-disable-next-line no-return-assign
		return (this.#supply ??= new LoadSupply(this));
	}

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
