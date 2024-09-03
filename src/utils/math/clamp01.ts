import { clamp } from './clamp';

export function clamp01(value: number) {
	return clamp(value, 0, 1);
}
