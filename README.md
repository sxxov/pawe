# `pawe`

An automatic web progress bar. Inspired by [`pace`](https://github.com/CodeByZach/pace).

## Installation

### Via NPM

> <sup>If you're using a framework like React, that comes with a build system.</sup>

Run this command in your terminal:

```bash
npm i pawe
```

Then, add this in your layout (e.g. `layout.tsx`, `+layout.svelte`, etc.)

```js
import 'pawe';
```

### Via CDN

> <sup>If you want to use <code>pawe</code> directly in the browser.</sup>

Include this in the `<head>` of your HTML:

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/pawe"
></script>
```

## Usage

### Automatic Mode

This is the **default mode**. This means `pawe` will automatically start monitoring the page load progress & expose the values as HTML attributes & CSS custom properties.

#### Example

A basic progress bar.

```html
<style>
	/* 1. using CSS custom properties for values */
	#progress {
		/* progress bar */
		width: var(--pawe-bar-percent, 0%);
		background: hsl(0 0% 0%);

		position: fixed;
		height: 2px;
		top: 0;
		left: 0;
		transition:
			width 1s ease-out,
			opacity 1s;

		/* progress text (i.e. '100%') */
		&::after {
			content: var(--pawe-bar-percent-string) '%';
		}
	}

	/* 2. using HTML attributes for state changes */
	:root[data-pawe='idle'] #progress {
		opacity: 0;
	}
</style>

<div id="progress"></div>
```

#### HTML API

Here are all the exposed values in HTML/CSS that you can use:

##### HTML Attributes

| Attribute   | Element            | Type                | Description                  |
| ----------- | ------------------ | ------------------- | ---------------------------- |
| `data-pawe` | `:root` (`<html>`) | `idle` \| `loading` | The current state of `pawe`. |

##### CSS Custom Properties

| Property                         | Range            | Description                                                                                                                                                                                                                                                |
| -------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--pawe-bar`                     | `0` to `1`       | The augmented progress of the page load that approximates the loading in between down time of collected data points.<br><br>Users generally prefer this as it provides feedback even if their connections are spotty, causing data to come down in bursts. |
| `--pawe-bar-percent`             | `0%` to `100%`   | '', in percent.                                                                                                                                                                                                                                            |
| `--pawe-bar-percent-int`         | `0` to `100`     | '', floored, without unit.                                                                                                                                                                                                                                 |
| `--pawe-bar-percent-string`      | `'0'` to `'100'` | '', in string type, for use with the `content` property.                                                                                                                                                                                                   |
| `--pawe-progress`                | `0` to `1`       | The objective progress of the page load solely based on the collected data points.                                                                                                                                                                         |
| `--pawe-progress-percent`        | `0%` to `100%`   | '', in percent.                                                                                                                                                                                                                                            |
| `--pawe-progress-percent-int`    | `0` to `100`     | '', floored, without unit.                                                                                                                                                                                                                                 |
| `--pawe-progress-percent-string` | `'0'` to `'100'` | '', in string type, for use with the `content` property.                                                                                                                                                                                                   |

#### JavaScript API

You can also use the JavaScript API to get the progress values programmatically.

For the full list of available exports, see the [`index.ts`](https://github.com/sxxov/pawe/blob/main/src/index.ts) file.

> <sup>Better docs are coming soon™!</sup>

##### Example

```js
import { bar } from 'pawe';

const unsubscribe = bar.subscribe(($bar) => {
	// this is equivalent to `--pawe-bar`
	console.log(`bar: ${$bar}`);
});
```

### Manual Mode (Advanced)

You can also use `pawe` in manual mode by importing from `pawe/api`. This means you are in charge of starting the monitoring & scaffolding any other load signals you want to track.

#### Example: Adding Loads & Reading Progress from the Global Store

```js
// note the different import!
// * `pawe` 	- automatic mode
//				  monitoring is started automatically
// * `pawe/api`	- manual mode
//				  only the api is exposed & no side effects are ran
import { monitorDOM, createLoad, progress } from 'pawe/api';

// log the progress values as we add loads
const unsubscribe = progress.subscribe(($progress) => {
	console.log(`progress: ${$progress}`);
});

// add monitoring of the DOM (skipping the rest)
monitorDOM();

// add your own load signal to the calculated progress
const load = createLoad();
console.log('starting load...');
console.log('loaded: 0%');

// simulate loading
load.set(0.5);
console.log('loaded: 50%');

// mark as finished after 1 second
setTimeout(() => {
	load.finish();
	// or
	// `load.set(1)`
}, 1000);

// the load acts as a promise that will resolve when it hits `1`
await load;
console.log('loaded: 100%');
```

#### Example: Creating a Local Progress Bar

```js
// note the different import!
// * `pawe` 	- automatic mode
//				  monitoring is started automatically
// * `pawe/api`	- manual mode
//				  only the api is exposed & no side effects are ran
import { createPool, createLoad, createProgress, createBar } from 'pawe/api';

// where all the loads are stored
const pool = createPool();

// create a load signal
const load = createLoad(pool);
//                      ^^^^
//                      note that `pool` is passed as the first argument!
//                      this is so that the load signal is added to our pool
//                      instead of the global one

// create a progress signal
const progress = createProgress(pool);
// create a progress bar (for UI)
const bar = createBar(progress);

// use the progress values
const unsubscribeProgress = progress.subscribe(($progress) => {
	console.log(`progress: ${$progress}`);
});
const unsubscribeBar = bar.subscribe(($bar) => {
	console.log(`bar: ${$bar}`);
});
```

## Bypassing AJAX Requests

If you want to bypass AJAX requests from being tracked by `pawe`, you can pass in the non-standard `pawe` property. It will be removed from the final config/instance before being sent.

### `fetch`

```js
const resp = await fetch('https://example.com', {
	pawe: 'bypass', // add this to bypass tracking
});
```

### `XMLHttpRequest`

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com');
xhr.pawe = 'bypass'; // add this to bypass tracking
xhr.send();
```

### TypeScript Support

Include the following in your `tsconfig.json` to get type hints for the above mentioned `pawe` property.

```json
{
	"compilerOptions": {
		"types": ["pawe/client"]
	}
}
```

## Data Sources

-   `DOM` - Track load events from DOM elements that are statically & dynamically added to the page
    -   `document.readyState` until `complete`
    -   `<img>` load (both eager & lazy)
    -   `<video>` load (when it starts loading until it's ready to play)
    -   `<audio>` load (when it starts loading until it's ready to play)
    -   `<iframe>` load
    -   `<object>` load
    -   `<embed>` load
-   `fetch` - Track data stream from `fetch` requests
-   `XMLHttpRequest` - Track `progress` events from `XMLHttpRequest`s

## License

MIT
