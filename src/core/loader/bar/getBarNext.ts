import { clamp } from '@/utils/math/clamp.js';

/** @private */
export function getBarNext(baseProgress: number, curr: number, deltaT: number) {
	const upToAmplitude = 0.001;
	const awayAmplitude = 0.0002;

	const maxDistanceAwayFromBase = (1 - baseProgress) / 3;
	const distanceUpToBase = Math.max(baseProgress - curr, 0);
	const distanceAwayFromBase = clamp(
		curr - baseProgress,
		0,
		maxDistanceAwayFromBase,
	);
	const speed =
		distanceUpToBase * upToAmplitude +
		(maxDistanceAwayFromBase - distanceAwayFromBase) * awayAmplitude;

	const next = clamp(
		curr + speed * deltaT,
		0,
		baseProgress + maxDistanceAwayFromBase,
	);

	return next;
}
