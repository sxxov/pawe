import { type ReadableSignal } from './ReadableSignal.js';

export type WritableSignal<T> = ReadableSignal<T> & {
	set(value: T): void;
	update(callback: (value: T) => T): void;
	derive<U>(callback: (value: T) => U): WritableSignal<U>;
};
