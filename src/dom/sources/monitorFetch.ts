import { pool } from '../../core/pool/pool.js';
import { createLoad as createGlobalLoad } from '../../core/load/createLoad.js';

export function monitorFetch(context = pool) {
	const createLoad = () => createGlobalLoad(context);
	const { fetch } = globalThis;

	globalThis.fetch = async (url, options, ...args) => {
		if (
			typeof options === 'object' &&
			options !== null &&
			options.pawe === 'bypass'
		) {
			delete options.pawe;
			return fetch(url, options, ...args);
		}

		const p = createLoad();

		let response: Response;
		try {
			response = await fetch(url, options, ...args);
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
