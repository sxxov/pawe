import { afterAll, beforeAll, describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { loadProgress } from '../../core/load/progress/loadProgress';
import { loadSignals } from '../../core/load/signal/loadSignals';
import { monitorDOM } from './monitorDOM';
import { nameof } from '../../utils/type/nameof';
import { type ReactElement } from 'react';

describe(nameof({ monitorDOM }), (it) => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = monitorDOM();
	});
	afterAll(() => {
		loadSignals.set([]);
		unsubscribe?.();
	});

	it.sequential(
		'should monitor eagre <img>',
		{
			retry: 3,
		},
		async () => {
			loadSignals.set([]);
			expect(loadProgress.get()).toEqual(1);
			loadProgress.set(0);
			await new Promise<void>((resolve) => {
				render(
					<img
						src='https://picsum.photos/200/100'
						onLoad={() => {
							setTimeout(resolve, 0);
						}}
					/>,
				);
			});
			expect(loadProgress.get()).toEqual(1);
		},
	);

	it.sequential(
		'should monitor multiple eagre <img>s',
		{
			retry: 3,
		},
		async () => {
			loadSignals.set([]);
			expect(loadProgress.get()).toEqual(1);
			loadProgress.set(0);
			const Component = ({ onComplete }: { onComplete: () => void }) => {
				const promises: Promise<void>[] = [];
				const images: ReactElement[] = [];
				for (let i = 0; i < 10; i++) {
					promises.push(
						new Promise<void>((resolve) => {
							images.push(
								<img
									key={i}
									src={`https://picsum.photos/200/10${i}`}
									onLoad={() => {
										setTimeout(resolve, 0);
									}}
								/>,
							);
						}),
					);
				}

				void Promise.all(promises).then(onComplete);

				return <>{images}</>;
			};
			await new Promise<void>((resolve) => {
				render(<Component onComplete={resolve} />);
			});
			expect(loadProgress.get()).toEqual(1);
		},
	);

	// FIXME: disabled because chromium that's bundled with
	// playwright doesn't include codecs for mp4. if possible,
	// find a placeholder video that uses open codecs.
	// it.sequential('should monitor autoplaying <video>', async () => {
	// 	expect(loadProgress.get()).toEqual(1);
	// 	await new Promise<void>((resolve) => {
	// 		render(
	// 			<video
	// 				src='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
	// 				autoPlay
	// 				muted
	// 				playsInline
	// 				onLoadedData={() => {
	// 					setTimeout(resolve, 0);
	// 				}}
	// 			/>,
	// 		);
	// 		setTimeout(() => {
	// 			expect(loadProgress.get()).toEqual(0);
	// 		}, 0);
	// 	});
	// 	expect(loadProgress.get()).toEqual(1);
	// });

	// TODO: implement tests for the rest of the DOM sources
});
