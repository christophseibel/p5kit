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
import FileUpload from './components/FileUpload.svelte';
import Input from './components/Input.svelte';
import Button from './components/Button.svelte';
import Progress from './components/Progress.svelte';
import Select from './components/Select.svelte';

declare global {
	interface Window {
		_p5Instance: p5 | undefined;
	}
}

type FileType = 'image' | 'json' | 'font' | 'model' | 'strings';
type Sketch = (sketch: p5) => void;

export type { Sketch, FileType };
export {
	P5,
	P5Kit,
	ResolutionSelect,
	Export,
	Accordion,
	ColorPicker,
	Slider,
	Toggle,
	FileUpload,
	Input,
	Button,
	Progress,
	Select
};
