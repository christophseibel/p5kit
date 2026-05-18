// Reexport your entry components here

import type p5 from 'p5';
import P5 from './P5.svelte';

declare global {
	interface Window {
		_p5Instance: p5 | undefined;
	}
}

type Sketch = (sketch: p5) => void;

export type { Sketch };
export { P5 };
