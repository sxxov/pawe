import { describe, expect } from 'vitest';
import { nameof } from '../../utils/type/nameof.js';
import { createPool } from './createPool.js';

describe(nameof({ createPool }), (it) => {
	it('should start at an empty array', () => {
		const loadSignals = createPool();

		expect(loadSignals.get().length).toEqual(0);
	});
});
