import { createLoad } from '../../core/load/create/createLoad';

export function monitorXMLHttpRequest() {
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
