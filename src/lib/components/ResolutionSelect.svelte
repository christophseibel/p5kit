<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './code/engine.svelte.ts';
	import Select from './Select.svelte';
	import Accordion from './Accordion.svelte';
	import Input from './Input.svelte';
	import { CropIcon } from 'phosphor-svelte';
	import type p5 from 'p5';

	interface resolutionOptions {
		label: string;
		value: string;
	}

	interface Resolution {
		x: number;
		y: number;
	}

	let defaultResolutions: resolutionOptions[] = [
		{ label: 'Square | W: 1080 H: 1080', value: JSON.stringify({ x: 1080, y: 1080 }) },
		{ label: 'Full HD | W: 1920 H: 1080', value: JSON.stringify({ x: 1920, y: 1080 }) },
		{ label: '4/5 | W: 1080 H: 1350', value: JSON.stringify({ x: 1080, y: 1350 }) }
	];

	let currentSelection = $state(defaultResolutions[0].value);

	$effect(() => {
		console.log(currentSelection);
	});

	let width = $derived(parseResolution(currentSelection).x);
	let height = $derived(parseResolution(currentSelection).y);

	const engine = getContext<Engine>('p5kit-engine');

	$effect(() => {
		engine.resizeCanvas(width, height);
		if (engine.instance) onResize(engine.instance);
	});

	let {
		resolutionOptions = defaultResolutions,
		onResize = () => {}
	}: { resolutionOptions?: resolutionOptions[]; onResize?: (p5: p5) => void } = $props();

	function parseResolution(value: string): Resolution {
		let parsed: Resolution;

		try {
			const temp = JSON.parse(value);
			if (temp?.x && typeof temp.x === 'number') {
				parsed = temp as Resolution;
			} else {
				throw new Error('Invalid format');
			}
		} catch (e) {
			parsed = { x: 0, y: 0 }; // Fallback default
		}

		return parsed;
	}
</script>

<Accordion title="Resolution">
	<div class="controls">
		<div class="element">
			<Select items={resolutionOptions} type="single" bind:value={currentSelection}>
				{#snippet icon()}
					<CropIcon size={14} />
				{/snippet}</Select
			>
		</div>

		<Input type="number" bind:value={width} />
		<Input type="number" bind:value={height} />
	</div>
</Accordion>

<style>
	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		row-gap: 10px;
		column-gap: 10px;
		height: fit-content;
		font-size: var(--ui-text);
		color: var(--gray-50);
	}

	.element {
		display: flex;
		flex-direction: column;
		grid-column-start: 1;
		grid-column-end: 3;
	}
</style>
