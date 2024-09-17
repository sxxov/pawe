import { bar } from '@/core/loader/bar/bar.js';
import { progress } from '@/core/loader/progress/progress.js';
import { use } from '@/utils/signal/use.js';

export function writeDOM(root = document.documentElement) {
	const unsubscribe = use({ progress, bar }, ({ $progress, $bar }) => {
		if ($progress < 1) {
			root.setAttribute(`data-pawe`, 'loading');
		} else {
			root.setAttribute(`data-pawe`, 'idle');
		}

		root.style.setProperty(`--pawe-progress`, `${$progress}`);
		root.style.setProperty(
			`--pawe-progress-percent`,
			`${$progress * 100}%`,
		);
		root.style.setProperty(
			`--pawe-progress-percent-int`,
			`${Math.round($progress * 100)}`,
		);
		root.style.setProperty(
			`--pawe-progress-percent-string`,
			`'${Math.round($progress * 100)}'`,
		);

		root.style.setProperty(`--pawe-bar`, `${$bar}`);
		root.style.setProperty(`--pawe-bar-percent`, `${$bar * 100}%`);
		root.style.setProperty(
			`--pawe-bar-percent-int`,
			`${Math.round($bar * 100)}`,
		);
		root.style.setProperty(
			`--pawe-bar-percent-string`,
			`'${Math.round($bar * 100)}'`,
		);
	});

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
