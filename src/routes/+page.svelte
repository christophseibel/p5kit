<script lang="ts">
	import { P5, P5Kit } from '$lib/index.js';
	import type p5 from 'p5';
	import type { Sketch } from '$lib/index.js';

	const userSketch: Sketch = (p5: p5) => {
		p5.setup = () => {
			p5.createCanvas(700, 700);
		};

		p5.draw = () => {
			p5.background(255);
			p5.fill(0);
			p5.ellipse(p5.width / 2, p5.height / 2, p5.mouseX);
		};
	};
</script>

<P5Kit>
	<P5 {userSketch} />
</P5Kit>
