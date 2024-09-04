import { loadBar } from '@/core/load/bar/loadBar';
import { loadProgress } from '@/core/load/progress/loadProgress';
import { use } from '@/utils/signal/use';

export function useInCSS() {
	const root = document.documentElement;
	const unsubscribe = use(
		{ loadProgress, loadBar },
		({ $loadProgress, $loadBar }) => {
			if ($loadProgress < 1) {
				root.setAttribute(`data-pawe`, 'loading');
			} else {
				root.setAttribute(`data-pawe`, 'idle');
			}

			root.style.setProperty(`--pawe-progress`, `${$loadProgress}`);
			root.style.setProperty(
				`--pawe-progress-percent`,
				`${$loadProgress * 100}%`,
			);
			root.style.setProperty(
				`--pawe-progress-percent-int`,
				`${Math.round($loadProgress * 100)}`,
			);
			root.style.setProperty(
				`--pawe-progress-percent-string`,
				`'${Math.round($loadProgress * 100)}'`,
			);

			root.style.setProperty(`--pawe-bar`, `${$loadBar}`);
			root.style.setProperty(`--pawe-bar-percent`, `${$loadBar * 100}%`);
			root.style.setProperty(
				`--pawe-bar-percent-int`,
				`${Math.round($loadBar * 100)}`,
			);
			root.style.setProperty(
				`--pawe-bar-percent-string`,
				`'${Math.round($loadBar * 100)}'`,
			);
		},
	);

	return () => {
		root.removeAttribute(`data-pawe`);
		root.style.removeProperty(`--pawe-progress`);
		root.style.removeProperty(`--pawe-progress-percent`);
		root.style.removeProperty(`--pawe-progress-percent-int`);
		root.style.removeProperty(`--pawe-progress-percent-string`);
		root.style.removeProperty(`--pawe-bar`);
		root.style.removeProperty(`--pawe-bar-percent`);
		root.style.removeProperty(`--pawe-bar-percent-int`);
		root.style.removeProperty(`--pawe-bar-percent-string`);
		unsubscribe();
	};
}
