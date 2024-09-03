# `pawe`

An automatic web progress bar. Inspired by [`pace`](https://github.com/CodeByZach/pace).

## Installation

### Via NPM

> <sup>If you're using a framework like React, that comes with a build system.</sup>

Run this command in your terminal:

```bash
npm i pawe
```

Then, add this everywhere you want to use `pawe` in your project:

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

```html
<style>
	#progress {
		width: var(--pawe-progress-percent, 0%);
		background: hsl(0 0% 100%);
	}

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

| Property                      | Range          | Description                                                                                                                                                                                                                                                |
| ----------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--pawe-bar`                  | `0` to `1`     | The augmented progress of the page load that approximates the loading in between down time of collected data points.<br><br>Users generally prefer this as it provides feedback even if their connections are spotty, causing data to come down in bursts. |
| `--pawe-bar-percent`          | `0%` to `100%` | ''                                                                                                                                                                                                                                                         |
| `--pawe-bar-percent-int`      | `0` to `100`   | ''                                                                                                                                                                                                                                                         |
| `--pawe-progress`             | `0` to `1`     | The objective progress of the page load solely based on the collected data points.                                                                                                                                                                         |
| `--pawe-progress-percent`     | `0%` to `100%` | ''                                                                                                                                                                                                                                                         |
| `--pawe-progress-percent-int` | `0` to `100`   | ''                                                                                                                                                                                                                                                         |

#### JavaScript API

You can also use the JavaScript API to get the progress values programmatically.

For the full list of available methods, see the [`index.ts`](https://github.com/sxxov/pawe/blob/main/src/index.ts) file.

> <sup>Better docs are coming soon™!</sup>

##### Example

```js
import { loadProgress } from 'pawe';

const unsubscribe = loadProgress.subscribe((progress) => {
	// this is equivalent to `--pawe-progress`
	console.log(progress);
});
```

### Manual Mode (Advanced)

You can also use `pawe` in manual mode by importing from `pawe/api`. This means you are in charge of starting the monitoring & scaffolding any other load signals you want to track.

#### Example

```js
// note the different import!
// * `pawe` 	- automatic mode
//				  monitoring is started automatically
// * `pawe/api`	- manual mode
//				  only the api is exposed & no side effects are ran
import { monitorDOM, createLoad, loadProgress } from 'pawe/api';

// only monitor the DOM
// skipping fetch, xhr, & injection of css vars
monitorDOM();

// add your own load signal to the calculated progress
const load = createLoad();
load.set(0.5);
void (async () => {
	// wait for something to load
	await load;
})();
load.finish(); // equivalent to `load.set(1)`

// or use the progress values directly
const unsubscribe = loadProgress.subscribe((progress) => {
	console.log(progress);
});
```

## License

MIT
