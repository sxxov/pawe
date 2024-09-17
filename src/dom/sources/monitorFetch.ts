import { loadSignals } from '../../core/load/signal/loadSignals.js';
import { createLoad as createGlobalLoad } from '../../core/load/create/createLoad.js';

export function monitorFetch(context = loadSignals) {
	const createLoad = () => createGlobalLoad(context);
	const { fetch } = globalThis;

	globalThis.fetch = async (...args) => {
		const p = createLoad();

		let response: Response;
		try {
			response = await fetch(...args);
		} catch (err) {
			p.finish();
			throw err;
		}

		const { ok, body } = response;

		if (!ok || !body) {
			p.finish();
			return response;
		}

		const contentLengthRaw = response.headers.get('content-length');

		let cum = 0;

		return new Response(
			new ReadableStream({
				async start(controller) {
					const reader = body.getReader();

					for (;;) {
						const { done, value } = await reader.read();

						if (done) {
							controller.close();
							p.finish();

							break;
						}

						controller.enqueue(value);
						cum += value.byteLength;
						if (contentLengthRaw != null) {
							const contentLength = Number(contentLengthRaw);
							p.set(cum / contentLength);
						}
					}
				},
				async cancel() {
					await body.cancel();
					p.finish();
				},
			}),
		);
	};

	return () => {
		globalThis.fetch = fetch;
	};
}
