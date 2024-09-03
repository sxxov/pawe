import { type ReadableSignal } from './ReadableSignal';
import { type Signal } from './Signal';
import { type Subscriber } from './Subscriber';

export class Supply<T> implements ReadableSignal<T> {
	constructor(private readonly signal: Signal<T>) {}

	public get(): T {
		return this.signal.get();
	}

	public subscribe(subscriber: Subscriber<T>) {
		return this.signal.subscribe(subscriber);
	}

	public subscribeDeferred(subscriber: Subscriber<T>) {
		return this.signal.subscribeDeferred(subscriber);
	}

	public notify() {
		this.signal.notify();
	}

	public derive<U>(callback: (value: T) => U) {
		return this.signal.derive(callback).supply;
	}
}
