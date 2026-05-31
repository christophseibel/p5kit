<script lang="ts">
	import { P5, P5Kit, ResolutionSelect, ImageExport, Accordion } from '$lib/index.js';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/index.js';
	import Select from '$lib/components/Select.svelte';

	const sketch: Sketch = (p5: p5) => {
		p5.setup = async () => {
			p5.createCanvas(500, 500);
			p5.rectMode(p5.CENTER);
			p5.angleMode(p5.DEGREES);
		};

		p5.draw = () => {
			p5.background(255);
			p5.fill(0);
			p5.ellipse(p5.width / 2, p5.height / 2 + p5.sin(p5.frameCount) * 100, 100);
		};

		p5.keyPressed = () => {
			(p5 as any).frameCount = 0;
		};
	};

	const themes = [
		{ value: 'light-monochrome', label: 'Light Monochrome' },
		{ value: 'dark-green', label: 'Dark Green' },
		{ value: 'svelte-orange', label: 'Svelte Orange' },
		{ value: 'punk-pink', label: 'Punk Pink' },
		{ value: 'ocean-blue', label: 'Ocean Blue', disabled: true },
		{ value: 'sunset-orange', label: 'Sunset Orange' },
		{ value: 'sunset-red', label: 'Sunset Red' },
		{ value: 'forest-green', label: 'Forest Green' },
		{ value: 'lavender-purple', label: 'Lavender Purple', disabled: true },
		{ value: 'mustard-yellow', label: 'Mustard Yellow' },
		{ value: 'slate-gray', label: 'Slate Gray' },
		{ value: 'neon-green', label: 'Neon Green' },
		{ value: 'coral-reef', label: 'Coral Reef' },
		{ value: 'midnight-blue', label: 'Midnight Blue' },
		{ value: 'crimson-red', label: 'Crimson Red' },
		{ value: 'mint-green', label: 'Mint Green' },
		{ value: 'pastel-pink', label: 'Pastel Pink' },
		{ value: 'golden-yellow', label: 'Golden Yellow' },
		{ value: 'deep-purple', label: 'Deep Purple' },
		{ value: 'turquoise-blue', label: 'Turquoise Blue' },
		{ value: 'burnt-orange', label: 'Burnt Orange' }
	];
</script>

<P5Kit>
	<div id="container">
		<div id="controls"><ResolutionSelect /><ImageExport /></div>
		<div id="sketch"><P5 userSketch={sketch} /></div>
	</div>
</P5Kit>

<style>
	:global(body) {
		margin: unset;
		height: 100vh;
		width: 100vw;
	}

	#container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 20px;
	}

	#controls {
		height: 100%;
		width: 500px;
		display: flex;
		flex-direction: column;
	}

	#sketch {
		width: 800px;
	}
</style>
