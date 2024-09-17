import { loadProgress } from '@/api.ts';
import { createLoad } from '../../core/load/create/createLoad.js';

export function monitorDOM() {
	// on load
	monitorReadyState();

	// sync added dom nodes
	document.querySelectorAll('img').forEach(monitorImg);
	document.querySelectorAll('video').forEach(monitorVideoOrAudio);
	document.querySelectorAll('audio').forEach(monitorVideoOrAudio);
	document.querySelectorAll('object').forEach(monitorObject);
	document.querySelectorAll('embed').forEach(monitorEmbed);
	document.querySelectorAll('iframe').forEach(monitorIframe);

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
		mo.observe(document.body, { childList: true, subtree: true });
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', startMutationObserver);
	} else {
		startMutationObserver();
	}

	return () => {
		mo.disconnect();
	};
}

function monitorReadyState() {
	if (document.readyState === 'complete') {
		return;
	}

	const p = createLoad();
	const unsubscribe = loadProgress.subscribe((progress) => {
		p.set(Math.min(progress, 0.99));
	});

	window.addEventListener('readystatechange', () => {
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
				} else if (!p) {
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
		!(object.data && object.contentWindow?.location.href === 'about:blank')
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
