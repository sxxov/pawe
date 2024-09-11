import { useInCSS } from './dom/expose/useInCSS.js';
import { monitorDOM } from './dom/sources/monitorDOM.js';
import { monitorFetch } from './dom/sources/monitorFetch.js';
import { monitorXMLHttpRequest } from './dom/sources/monitorXMLHttpRequest.js';

const unsubscribes = [
	monitorDOM(),
	monitorFetch(),
	monitorXMLHttpRequest(),
	useInCSS(),
];

export function stop() {
	for (const unsubscribe of unsubscribes) {
		unsubscribe();
	}
}

export * from './api.js';
