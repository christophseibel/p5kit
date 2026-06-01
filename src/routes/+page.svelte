<script lang="ts">
	import { P5, P5Kit, ResolutionSelect, Export, Accordion, ColorPicker } from '$lib/index.js';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/index.js';
	// import '$lib/style.css';

	let resetFrame = $state(() => {});
	let color: p5.Color;

	const sketch: Sketch = (p5: p5) => {
		p5.setup = async () => {
			p5.createCanvas(500, 500);
			p5.rectMode(p5.CENTER);
			p5.angleMode(p5.DEGREES);
		};

		p5.draw = () => {
			p5.background(255);
			p5.fill(0);
			p5.ellipse(p5.width / 2, p5.height / 2 + p5.sin(p5.frameCount * 5) * 300, 100);
		};

		resetFrame = () => {
			(p5 as any).frameCount = 0;
		};
	};
</script>

<P5Kit>
	<div id="container">
		<div id="controls">
			<ResolutionSelect /><Export onExport={resetFrame} />
			<Accordion title="Color"><ColorPicker></ColorPicker></Accordion>
		</div>
		<div id="sketch">
			<P5 userSketch={sketch} />
		</div>
	</div>
</P5Kit>

<style>
	:global(body) {
		margin: unset;
		height: 100vh;
		width: 100vw;
	}

	:global(#p5kit-container) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(#p5kit) {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: light-dark(var(--gray-50), var(--gray-950));
	}

	#container {
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 400px 1fr;
		/* gap: 20px; */
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
