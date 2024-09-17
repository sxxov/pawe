/* eslint-disable @typescript-eslint/unified-signatures */
import { bar as globalBar } from '@/core/loader/bar/bar.js';
import { progress as globalProgress } from '@/core/loader/progress/progress.js';

/**
 * Write attributes & CSS Properties to the DOM onto {@linkcode root}, based on
 * the provided contexts
 */
export function writeDOM(
	root: HTMLElement | SVGElement,
	progress: typeof globalProgress,
	bar: typeof globalBar,
): () => void;
/**
 * Write attributes & CSS Properties to the DOM onto {@linkcode root}, based on
 * the global context
 */
export function writeDOM(root: HTMLElement | SVGElement): () => void;
/**
 * Write attributes & CSS Properties to the DOM onto `<html>`, based on the
 * global context
 */
export function writeDOM(): () => void;
export function writeDOM(
	root: HTMLElement | SVGElement = document.documentElement,
	progress = globalProgress,
	bar = globalBar,
) {
	const unsubscribeProgress = progress.subscribe(($progress) => {
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
	});
	const unsubscribeBar = bar.subscribe(($bar) => {
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
		unsubscribeProgress();
		unsubscribeBar();
	};
}
