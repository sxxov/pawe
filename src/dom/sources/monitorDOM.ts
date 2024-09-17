/* eslint-disable @typescript-eslint/unified-signatures */
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
	if (root === document.documentElement) {
		monitorReadyState();
	}

	// sync added dom nodes
	root.querySelectorAll('img').forEach(monitorImg);
	root.querySelectorAll('video').forEach(monitorVideoOrAudio);
	root.querySelectorAll('audio').forEach(monitorVideoOrAudio);
	root.querySelectorAll('object').forEach(monitorObject);
	root.querySelectorAll('embed').forEach(monitorEmbed);
	root.querySelectorAll('iframe').forEach(monitorIframe);

	// async added dom nodes
	const mo = new MutationObserver((mutations: MutationRecord[]) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				switch (node.nodeName) {
					case 'IMG':
						monitorImg(node as HTMLImageElement);
						break;
					case 'VIDEO':
					case 'AUDIO':
						monitorVideoOrAudio(
							node as HTMLVideoElement | HTMLAudioElement,
						);
						break;
					case 'OBJECT':
						monitorObject(node as HTMLObjectElement);
						break;
					case 'EMBED':
						monitorEmbed(node as HTMLEmbedElement);
						break;
					case 'IFRAME':
						monitorIframe(node as HTMLIFrameElement);
						break;
					default:
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
		mo.disconnect();
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

		document.addEventListener('readystatechange', () => {
			if (document.readyState === 'complete') {
				p.set(1);
				unsubscribe();
			}
		});
	}

	function monitorImg(img: HTMLImageElement) {
		if (img.complete) {
			return;
		}

		if (img.loading === 'lazy') {
			let p: ReturnType<typeof createLoad>;
			const io = new IntersectionObserver(([entry]) => {
				if (!entry) {
					return;
				}

				if (entry.isIntersecting) {
					if (img.complete) {
						io.disconnect();
					} else if (
						// `LoadSignal` is awaitable, so ESLint gets confused
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						!p
					) {
						p = createLoad();

						const resolve = () => {
							p.set(1);
							io.disconnect();
						};
						img.addEventListener('load', resolve);
						img.addEventListener('error', resolve);
					}
				}
			});
			io.observe(img);
		} else {
			const p = createLoad();

			const resolve = () => {
				p.set(1);
			};
			img.addEventListener('load', resolve, { once: true });
			img.addEventListener('error', resolve, { once: true });
		}
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

			videoOrAudio.addEventListener(
				'loadeddata',
				() => {
					p.set(1);
				},
				{ once: true },
			);
		} else {
			videoOrAudio.addEventListener(
				'loadstart',
				() => {
					const p = createLoad();

					videoOrAudio.addEventListener(
						'loadeddata',
						() => {
							p.set(1);
						},
						{ once: true },
					);
				},
				{ once: true },
			);
		}
	}

	function monitorObject(object: HTMLObjectElement) {
		if (
			!(
				object.data &&
				object.contentWindow?.location.href === 'about:blank'
			)
		) {
			return;
		}

		const p = createLoad();

		object.addEventListener('load', () => {
			p.set(1);
		});
	}

	function monitorEmbed(embed: HTMLEmbedElement) {
		if (!embed.src || embed.getSVGDocument()) {
			return;
		}

		const p = createLoad();

		embed.addEventListener('load', () => {
			p.set(1);
		});
	}

	function monitorIframe(obj: HTMLIFrameElement) {
		const p = createLoad();

		obj.addEventListener('load', () => {
			p.set(1);
		});
	}
}
