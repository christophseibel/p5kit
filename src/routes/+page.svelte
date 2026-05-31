<script lang="ts">
	import { P5, P5Kit, ResolutionSelect, ImageExport, Accordion } from '$lib/index.js';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/index.js';

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
</script>

<P5Kit>
	<div id="container">
		<div id="controls"><ResolutionSelect /> <ImageExport /></div>
		<div id="sketch"><P5 userSketch={sketch} parentDivStyle={'background: purple;'} /></div>
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
