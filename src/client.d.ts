/* eslint-disable @typescript-eslint/consistent-type-definitions */
type PaweArgument = 'bypass';

declare namespace globalThis {
	interface RequestInit {
		pawe?: PaweArgument;
	}

	interface XMLHttpRequest {
		pawe?: PaweArgument;
	}
}
