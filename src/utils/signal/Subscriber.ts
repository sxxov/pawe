import { type Invalidator } from './Invalidator.js';

export type Subscriber<T> = (value: T) => void | Promise<void> | Invalidator;
