<script lang="ts">
	import {
		P5,
		P5Kit,
		ResolutionSelect,
		Export,
		ColorPicker,
		Accordion,
		Slider
	} from '$lib/index.js';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/index.js';

	let resetFrame = $state(() => {});
	let hex = $state('#000000');
	let circleSize: [number, number] = $state([20, 100]);

	const sketch: Sketch = (p5: p5) => {
		p5.setup = async () => {
			p5.createCanvas(500, 500);
			p5.rectMode(p5.CENTER);
			p5.angleMode(p5.DEGREES);
			p5.noStroke();
		};

		p5.draw = () => {
			p5.background(255);
			p5.fill(hex);
			p5.ellipse(p5.width / 2, p5.height / 2 + p5.sin(p5.frameCount * 5) * 150, circleSize[1]);
			p5.fill(255);
			p5.ellipse(p5.width / 2, p5.height / 2 + p5.sin(p5.frameCount * 5) * 150, circleSize[0]);
		};

		resetFrame = () => {
			(p5 as any).frameCount = 0;
		};
	};
</script>

<!-- <P5Kit>
	<P5 userSketch={sketch} />
</P5Kit> -->

<P5Kit>
	<div id="container">
		<div id="controls">
			<ResolutionSelect></ResolutionSelect>
			<Export onExport={resetFrame} />
			<Accordion title="Color"
				><ColorPicker bind:hex></ColorPicker>
				<Slider type="range" bind:value={circleSize} min={10} max={200} />
			</Accordion>
		</div>
		<div id="sketch"><P5 userSketch={sketch} /></div>
	</div>
</P5Kit>

<style>
	:global(body) {
		margin: unset;
		height: 100vh;
		width: 100vw;
	}

	:global(#p5kit) {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: light-dark(var(--gray-50), var(--gray-950));
	}

	:global(#p5kit-container) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#container {
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 400px 1fr;
	}

	#controls {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: var(--gray-900);
		grid-column-start: 1;
		grid-column-end: 2;
	}

	#sketch {
		width: 100%;
		grid-column-start: 2;
		grid-column-end: 3;
		min-width: 0;
		min-height: 0;
	}
</style>
