import { describe, expect } from 'vitest';
import { nameof } from '../../../utils/type/nameof';
import { createLoadSignals } from './createLoadSignals';

describe(nameof({ createLoadSignals }), (it) => {
	it('should start at an empty array', () => {
		const loadSignals = createLoadSignals();

		expect(loadSignals.get().length).toEqual(0);
	});
});
