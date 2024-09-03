import { loadBar } from '@/core/load/bar/loadBar';
import { loadProgress } from '@/core/load/progress/loadProgress';
import { use } from '@/utils/signal/use';

export function useInCSS() {
	const root = document.documentElement;
	const unsubscribe = use(
		{ loadProgress, loadBar },
		({ $loadProgress, $loadBar }) => {
			if ($loadProgress < 1) {
				root.setAttribute(`data-pase`, 'loading');
			} else {
				root.setAttribute(`data-pase`, 'idle');
			}

			root.style.setProperty(`--pase-progress`, `${$loadProgress}`);
			root.style.setProperty(
				`--pase-progress-percent`,
				`${$loadProgress * 100}%`,
			);
			root.style.setProperty(
				`--pase-progress-percent-int`,
				`${Math.round($loadProgress * 100)}`,
			);

			root.style.setProperty(`--pase-bar`, `${$loadBar}`);
			root.style.setProperty(`--pase-bar-percent`, `${$loadBar * 100}%`);
			root.style.setProperty(
				`--pase-bar-percent-int`,
				`${Math.round($loadBar * 100)}`,
			);
		},
	);

	return () => {
		root.removeAttribute(`data-pase`);
		root.style.removeProperty(`--pase-progress`);
		root.style.removeProperty(`--pase-progress-percent`);
		root.style.removeProperty(`--pase-progress-percent-int`);
		root.style.removeProperty(`--pase-bar`);
		root.style.removeProperty(`--pase-bar-percent`);
		root.style.removeProperty(`--pase-bar-percent-int`);
		unsubscribe();
	};
}
