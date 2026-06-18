// Reexport your entry components here

import type p5 from 'p5';
import P5 from './components/P5.svelte';
import P5Kit from './components/P5Kit.svelte';
import ResolutionSelect from './components/ResolutionSelect.svelte';
import Export from './components/Export.svelte';
import Accordion from './components/Accordion.svelte';
import ColorPicker from './components/ColorPicker.svelte';
import Slider from './components/Slider.svelte';
import Toggle from './components/Toggle.svelte';

declare global {
	interface Window {
		_p5Instance: p5 | undefined;
	}
}

type Sketch = (sketch: p5) => void;

interface VideoFormatSettings {
	guiName: string;
	ext: string;
	mimeType: string;
	crf?: number;
	command: string;
}

export type { Sketch, VideoFormatSettings };
export { P5, P5Kit, ResolutionSelect, Export, Accordion, ColorPicker, Slider, Toggle };
