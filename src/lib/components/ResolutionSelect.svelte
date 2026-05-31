<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './engine.svelte.ts';
	import Select from './Select.svelte';
	import Accordion from './Accordion.svelte';
	import '$lib/style.css';
	import { Label } from 'bits-ui';
	import { CropIcon } from 'phosphor-svelte';

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

	let { resolutionOptions = defaultResolutions }: { resolutionOptions?: resolutionOptions[] } =
		$props();

	// FIX 2: Initialize with a valid string from your array
	let currentSelection = $state(defaultResolutions[0].value);

	$effect(() => {
		console.log(currentSelection);
	});

	// Derive width/height from the current selection string
	let width = $derived(parseResolution(currentSelection).x);
	let height = $derived(parseResolution(currentSelection).y);

	// 3. Sync the engine whenever width or height changes
	onMount(() => {
		const engine = getContext<Engine>('p5kit-engine');
		$effect(() => {
			engine.resizeCanvas(width, height);
		});
	});

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
			<Select
				name="resolutionSelect"
				items={resolutionOptions}
				type="single"
				bind:value={currentSelection}
			>
				{#snippet icon()}
					<CropIcon size={14} />
				{/snippet}</Select
			>
		</div>

		<input type="number" bind:value={width} />
		<input type="number" bind:value={height} />
	</div>
</Accordion>

<!-- Input Fields: Bind directly to width and height -->

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
		width: 100%;
	}

	input[type='number'] {
		background-color: var(--gray-700);
		border-radius: var(--ui-border);
		border: unset;
		color: white;
		padding: var(--ui-padding);
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
