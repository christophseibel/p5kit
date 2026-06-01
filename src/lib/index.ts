// Reexport your entry components here

import type p5 from 'p5';
import P5 from './components/P5.svelte';
import P5Kit from './components/P5Kit.svelte';
import ResolutionSelect from './components/ResolutionSelect.svelte';
import Export from './components/Export.svelte';
import Accordion from './components/Accordion.svelte';

declare global {
	interface Window {
		_p5Instance: p5 | undefined;
	}
}

type Sketch = (sketch: p5) => void;

export type { Sketch };
export { P5, P5Kit, ResolutionSelect, Export, Accordion };
