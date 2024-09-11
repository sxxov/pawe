import { Supply } from './Supply.js';
import { type Invalidator } from './Invalidator.js';
import { type Subscriber } from './Subscriber.js';
import { type WritableSignal } from './WritableSignal.js';

export class Signal<T> implements WritableSignal<T> {
	private static equals(a: any, b: any) {
		return a === b || (Number.isNaN(a) && Number.isNaN(b));
	}

	private value: T;
	private readonly subscribers = new Set<Subscriber<T>>();
	private readonly invalidators = new Map<Subscriber<T>, Invalidator>();

	#supply: Supply<T> | undefined;
	public get supply() {
		// eslint-disable-next-line no-return-assign
		return (this.#supply ??= new Supply(this));
	}

	constructor(initialValue: T) {
		this.value = initialValue;
	}

	public get(): T {
		return this.value;
	}

	public set(value: T) {
		if (Signal.equals(this.value, value)) {
			return;
		}

		this.value = value;
		this.notify();
	}

	public update(updater: (value: T) => T) {
		this.set(updater(this.value));
	}

	public subscribe(subscriber: Subscriber<T>) {
		this.invoke(subscriber);

		return this.subscribeDeferred(subscriber);
	}

	public subscribeDeferred(subscriber: Subscriber<T>) {
		this.subscribers.add(subscriber);

		return () => {
			this.subscribers.delete(subscriber);
			this.invalidators.delete(subscriber);
		};
	}

	public notify() {
		for (const invalidator of this.invalidators.values()) {
			void invalidator();
		}
		this.invalidators.clear();

		for (const subscriber of this.subscribers) {
			this.invoke(subscriber);
		}
	}

	public derive<U>(callback: (value: T) => U) {
		const derived = new Signal(callback(this.value));

		this.subscribeDeferred((value) => {
			derived.set(callback(value));
		});

		return derived;
	}

	private invoke(subscriber: Subscriber<T>) {
		const result = subscriber(this.value);
		const invalidator = typeof result === 'function' ? result : undefined;
		if (invalidator) {
			this.invalidators.set(subscriber, invalidator);
		}
	}
}
