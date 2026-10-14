<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import type p5 from 'p5';
	import type { Engine } from './code/engine.svelte.ts';

	interface SketchProps {
		sketch: (p: p5) => void;
		disableFriendlyErrors?: boolean;
		debug?: boolean;
		fillContainer?: boolean;
		onRef?: (el: HTMLElement) => void;
		onInstance?: (p5Instance: p5) => void;
	}

	let {
		sketch,
		disableFriendlyErrors = true,
		debug = false,
		fillContainer = false,
		onRef = () => {},
		onInstance = () => {}
	}: SketchProps = $props();

	let kitSketch: p5 | undefined = undefined;
	let container: HTMLDivElement | undefined;
	let clientWidth = $state(0);
	let clientHeight = $state(0);
	const engine = getContext<Engine | null>('p5kit-engine');

	onMount(async () => {
		const library = await import('p5');
		const { default: p5 } = library;

		sketch = engine ? engine.wrap(sketch) : sketch;

		kitSketch = new p5((instance: p5) => {
			instance.disableFriendlyErrors = disableFriendlyErrors;
			sketch(instance);
			const userSetup = instance.setup;
			instance.setup = async () => {
				userSetup();
				await engine?.registerInstance(instance, container!);
			};
			if (debug) console.log('p5 instance', instance);
		}, container);

		onInstance(kitSketch);
	});

	$effect(() => {
		if (fillContainer) {
			console.log('resizing', clientWidth, clientHeight);
			engine?.resizeCanvas(clientWidth, clientHeight);
		}
	});

	onDestroy(() => {
		kitSketch?.remove();
		kitSketch = undefined;
	});
</script>

<div bind:this={container} bind:clientWidth bind:clientHeight class="p5kit-container"></div>

<style>
	:global(canvas) {
		display: block;
	}
</style>
