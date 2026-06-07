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

	import { animate, engine, createTimeline, type Timeline } from 'animejs';

	import Logo from '$lib/assets/p5.kit-logo.svg';

	let resetFrame = $state(() => {});
	let hex = $state('#000000');
	let circleSize: [number, number] = $state([20, 100]);
	let position = { x: 0, y: 0 };

	engine.useDefaultMainLoop = false;
	engine.defaults.frameRate = 60;

	let timeline: Timeline;

	let isRecording: boolean = $state(false);

	const sketch: Sketch = (p5: p5) => {
		p5.setup = async () => {
			p5.createCanvas(500, 500);
			p5.frameRate(60);
			p5.rectMode(p5.CENTER);
			p5.angleMode(p5.DEGREES);
			p5.noStroke();
		};

		p5.draw = () => {
			p5.background(255);
			p5.fill(hex);
			p5.ellipse(position.x, position.y, circleSize[1]);
			p5.fill(255);
			p5.ellipse(position.x, position.y, circleSize[0]);
			engine.update();
		};
	};
</script>

<P5Kit>
	<div id="container">
		<div id="controls">
			<ResolutionSelect
				onResize={(p5) => {
					position = { x: p5.width / 2, y: p5.height / 2 };
					timeline = createTimeline({ loop: true, alternate: true }).add(position, {
						keyframes: [
							{ x: p5.random(p5.width), y: p5.random(p5.height), duration: 1000 },
							{ x: p5.random(p5.width), y: p5.random(p5.height), duration: 1000 }
						]
					});
				}}
			/>
			<Export
				onExport={() => {
					timeline.restart();
				}}
			/>
			<Accordion title="Properties">
				<ColorPicker bind:hex />
				<Slider type="range" bind:value={circleSize} min={0} max={200} />
			</Accordion>
		</div>
		<div id="sketch"><P5 userSketch={sketch} /></div>
	</div>
</P5Kit>

<img id="logo" src={Logo} alt="" />

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
		grid-template-columns: 300px 1fr;
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

	#logo {
		position: absolute;
		top: 0;
		right: 0;
		padding: 10px;
		box-sizing: border-box;
		width: 100px;
		cursor: default;
		touch-action: none;
		user-select: none;
	}

	#sketch {
		width: 100%;
		grid-column-start: 2;
		grid-column-end: 3;
		min-width: 0;
		min-height: 0;
	}
</style>
