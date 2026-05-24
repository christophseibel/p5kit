<script lang="ts">
	import { P5, P5Kit, ResolutionSelect } from '$lib/index.js';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/index.js';
	import textFile from '$lib/test.txt';

	const sketch: Sketch = (p5: p5) => {
		p5.setup = async () => {
			p5.createCanvas(500, 500);
			p5.rectMode(p5.CENTER);
		};

		p5.draw = () => {
			p5.background(255);
			p5.fill(0);
			p5.ellipse(p5.width / 2, p5.height / 2, p5.mouseX);
		};
	};
</script>

<P5Kit>
	<P5 userSketch={sketch} parentDivStyle={'background: purple'} />
	<ResolutionSelect />
</P5Kit>

<style>
	:global(body) {
		margin: unset;
		height: 100vh;
		width: 100vw;
	}
</style>
