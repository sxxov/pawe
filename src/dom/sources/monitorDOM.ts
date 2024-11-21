import { pool } from '@/core/pool/pool.js';
import { createProgress } from '@/core/loader/progress/createProgress.js';
import { createLoad as createGlobalLoad } from '@/core/load/createLoad.js';

/** Monitor DOM nodes starting from a custom root element, into your own context */
export function monitorDOM(root: ParentNode, context: typeof pool): () => void;
/**
 * Monitor DOM nodes starting from a custom root element, into the global
 * context
 */
export function monitorDOM(root: ParentNode): () => void;
/** Monitor all DOM nodes within `<html>`, into the global context */
export function monitorDOM(): () => void;
export function monitorDOM(
	root: ParentNode = document.documentElement,
	context = pool,
) {
	const createLoad = () => createGlobalLoad(context);

	// on load
	let unsubscribeReadyState: (() => void) | undefined;
	if (root === document.documentElement) {
		monitorReadyState();
	}

	const nodeToUnsubscribe = new Map<Node, () => void>();
	const tagToMonitor = {
		img: monitorImg,
		video: monitorVideoOrAudio,
		audio: monitorVideoOrAudio,
		object: monitorObject,
		embed: monitorEmbed,
		iframe: monitorIframe,
	} as const;
	const invokeMonitor = (
		node: Node,
		monitor: (node: any) => (() => void) | undefined,
	) => {
		const unsubscribe = monitor(node);
		if (unsubscribe) {
			nodeToUnsubscribe.set(node, unsubscribe);
		}
	};

	// sync added dom nodes
	for (const [tag, monitor] of Object.entries(tagToMonitor)) {
		for (const node of root.querySelectorAll(tag)) {
			invokeMonitor(node, monitor);
		}
	}

	// async added dom nodes
	const mo = new MutationObserver((mutations: MutationRecord[]) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				const tag =
					node.nodeName.toLowerCase() as keyof typeof tagToMonitor;
				const monitor = tagToMonitor[tag];
				if (monitor) {
					invokeMonitor(node, monitor);
				}
			}

			for (const node of mutation.removedNodes) {
				const unsubscribe = nodeToUnsubscribe.get(node);
				if (unsubscribe) {
					unsubscribe();
					nodeToUnsubscribe.delete(node);
				}
			}
		}
	});
	const startMutationObserver = () => {
		mo.observe(root, { childList: true, subtree: true });
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', startMutationObserver);
	} else {
		startMutationObserver();
	}

	return () => {
		unsubscribeReadyState?.();
		document.removeEventListener('DOMContentLoaded', startMutationObserver);
		mo.disconnect();
		for (const [, unsubscribe] of nodeToUnsubscribe) {
			unsubscribe();
		}
		nodeToUnsubscribe.clear();
	};

	function monitorReadyState() {
		if (document.readyState === 'complete') {
			return;
		}

		// we recreate `loadProgress` from `loadSignals` to not need to
		// accept multiple contexts.
		// this is fine as long as each `loadProgress` created for the same
		// `loadSignals` context:
		// * derives out the exact same value
		//     * (it does, as it runs the same computation)
		// * affects the backing context in a way where it propagates to all
		//   other `loadProgress`es
		//     * (it does, as its subscription updates the backing context)
		const loadProgress = createProgress(context);

		const p = createLoad();
		const unsubscribe = loadProgress.subscribe((progress) => {
			p.set(Math.min(progress, 0.99));
		});

		const resolve = () => {
			unsubscribe();
			p.finish();
		};
		const resolveIfComplete = () => {
			if (document.readyState === 'complete') {
				resolve();
			}
		};
		document.addEventListener('readystatechange', resolveIfComplete);
		resolveIfComplete();

		return () => {
			resolve();
			document.removeEventListener('readystatechange', resolveIfComplete);
		};
	}

	function monitorImg(img: HTMLImageElement) {
		if (img.complete) {
			return;
		}

		if (img.loading === 'lazy') {
			let p: ReturnType<typeof createLoad> | undefined;
			const resolve = () => {
				p?.finish();
				io.disconnect();
			};
			const io = new IntersectionObserver(([entry]) => {
				if (!entry) {
					return;
				}

				if (entry.isIntersecting) {
					if (img.complete) {
						io.disconnect();
					} else if (!p) {
						p = createLoad();

						img.addEventListener('load', resolve);
						img.addEventListener('error', resolve);
					}
				}
			});
			io.observe(img);

			return () => {
				resolve();
				io.disconnect();
			};
		}

		const p = createLoad();
		const resolve = () => {
			p.set(1);
		};
		img.addEventListener('load', resolve, { once: true });
		img.addEventListener('error', resolve, { once: true });
		if (img.complete) {
			resolve();
		}

		return () => {
			resolve();
			img.removeEventListener('load', resolve);
			img.removeEventListener('error', resolve);
		};
	}

	function monitorVideoOrAudio(
		videoOrAudio: HTMLVideoElement | HTMLAudioElement,
	) {
		if (
			!videoOrAudio.src ||
			videoOrAudio.readyState >= videoOrAudio.HAVE_CURRENT_DATA
		) {
			return;
		}

		if (videoOrAudio.networkState === videoOrAudio.NETWORK_IDLE) {
			const p = createLoad();

			const resolve = () => {
				p.set(1);
			};
			videoOrAudio.addEventListener('loadeddata', resolve, {
				once: true,
			});
			if (videoOrAudio.readyState >= videoOrAudio.HAVE_CURRENT_DATA) {
				resolve();
			}

			return () => {
				resolve();
				videoOrAudio.removeEventListener('loadeddata', resolve);
			};
		}

		let resolve: (() => void) | undefined;
		const start = () => {
			const p = createLoad();

			resolve = () => {
				p.set(1);
			};
			videoOrAudio.addEventListener('loadeddata', resolve, {
				once: true,
			});
			if (videoOrAudio.readyState >= videoOrAudio.HAVE_CURRENT_DATA) {
				resolve();
			}
		};
		videoOrAudio.addEventListener('loadstart', start, { once: true });

		return () => {
			videoOrAudio.removeEventListener('loadstart', start);
			if (resolve) {
				resolve();
				videoOrAudio.removeEventListener('loadeddata', resolve);
			}
		};
	}

	function monitorObject(object: HTMLObjectElement) {
		if (
			!(
				object.data &&
				object.contentWindow?.location.href === 'about:blank'
			) ||
			object.contentDocument?.readyState === 'complete'
		) {
			return;
		}

		const p = createLoad();
		const resolve = () => {
			p.set(1);
		};
		object.addEventListener('load', resolve, { once: true });
		object.addEventListener('error', resolve, { once: true });
		if ((object.contentDocument?.readyState as string) === 'complete') {
			resolve();
		}

		return () => {
			resolve();
			object.removeEventListener('load', resolve);
			object.removeEventListener('error', resolve);
		};
	}

	function monitorEmbed(embed: HTMLEmbedElement) {
		if (!embed.src || embed.getSVGDocument()) {
			return;
		}

		const p = createLoad();
		const resolve = () => {
			p.finish();
		};
		embed.addEventListener('load', resolve, { once: true });

		return () => {
			resolve();
			embed.removeEventListener('load', resolve);
		};
	}

	function monitorIframe(obj: HTMLIFrameElement) {
		if (
			obj.contentWindow?.location.href === 'about:blank' ||
			obj.srcdoc ||
			!obj.src ||
			obj.contentDocument?.readyState === 'complete'
		) {
			return;
		}

		const p = createLoad();
		const resolve = () => {
			p.set(1);
		};
		obj.addEventListener('load', resolve, { once: true });
		obj.addEventListener('error', resolve, { once: true });
		if ((obj.contentDocument?.readyState as string) === 'complete') {
			resolve();
		}

		return () => {
			resolve();
			obj.removeEventListener('load', resolve);
			obj.removeEventListener('error', resolve);
		};
	}
}
