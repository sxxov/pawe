import { pool } from '../../core/pool/pool.js';
import { createLoad as createGlobalLoad } from '../../core/load/createLoad.js';

export function monitorXMLHttpRequest(context = pool) {
	const createLoad = () => createGlobalLoad(context);
	const { XMLHttpRequest } = globalThis;

	globalThis.XMLHttpRequest = class extends XMLHttpRequest {
		public override send(...args: Parameters<XMLHttpRequest['send']>) {
			const p = createLoad();

			this.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					p.set(event.loaded / event.total);
				}
			});

			this.addEventListener('loadend', () => {
				p.set(1);
			});

			super.send(...args);
		}
	};

	return () => {
		globalThis.XMLHttpRequest = XMLHttpRequest;
	};
}
