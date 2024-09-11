import { describe, expect } from 'vitest';
import { nameof } from '../../../utils/type/nameof.js';
import { createLoadSignals } from './createLoadSignals.js';

describe(nameof({ createLoadSignals }), (it) => {
	it('should start at an empty array', () => {
		const loadSignals = createLoadSignals();

		expect(loadSignals.get().length).toEqual(0);
	});
});
