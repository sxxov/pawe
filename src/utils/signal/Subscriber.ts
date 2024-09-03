import { type Invalidator } from './Invalidator';

export type Subscriber<T> = (value: T) => void | Promise<void> | Invalidator;
