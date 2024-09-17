import {
	monitorDOM,
	monitorFetch,
	monitorXMLHttpRequest,
	writeDOM,
} from './api.js';

let unsubscribes: (() => void)[] | undefined;

export function startAuto() {
	if (unsubscribes) {
		return stopAuto;
	}

	unsubscribes = [
		monitorDOM(),
		monitorFetch(),
		monitorXMLHttpRequest(),
		writeDOM(),
	];
	return stopAuto;
}

export function stopAuto() {
	if (!unsubscribes) {
		return;
	}

	for (const unsubscribe of unsubscribes) {
		unsubscribe();
	}
	unsubscribes = undefined;
}

startAuto();

export * from './api.js';
