import { useInCSS } from './dom/expose/useInCSS';
import { monitorDOM } from './dom/sources/monitorDOM';
import { monitorFetch } from './dom/sources/monitorFetch';
import { monitorXMLHttpRequest } from './dom/sources/monitorXMLHttpRequest';

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

export * from './api';
