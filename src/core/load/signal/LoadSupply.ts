import { Supply } from '@/utils/signal/Supply.ts';
import { type LoadProgressScalar } from './LoadProgressScalar.ts';
import { type ReadableLoadSignal } from './ReadableLoadSignal.ts';

export class LoadSupply
	extends Supply<LoadProgressScalar>
	implements ReadableLoadSignal
{
	public finish() {
		this.signal.set(1);
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
