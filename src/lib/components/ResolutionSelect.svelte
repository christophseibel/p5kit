<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from '../engine.svelte.ts';
	import Select from './Select.svelte';
	import Accordion from './Accordion.svelte';
	import '$lib/style.css';

	interface resolutionOptions {
		name: string;
		x: number;
		y: number;
	}

	let defaultResolutions: resolutionOptions[] = [
		{ name: 'Square', x: 1080, y: 1080 },
		{ name: 'Full HD', x: 1080, y: 1920 },
		{ name: '4:5', x: 1080, y: 1350 }
	];

	let { resolutionOptions = defaultResolutions }: { resolutionOptions?: resolutionOptions[] } =
		$props();

	// 1. Width and Height are now the "Source of Truth" ($state)
	let width = $state(defaultResolutions[0].x);
	let height = $state(defaultResolutions[0].y);

	// 2. A helper to find which preset matches current width/height
	// This keeps the dropdown in sync when you type manually
	let selectedPreset = $derived(
		resolutionOptions.find((opt) => opt.x === width && opt.y === height) ?? null
	);

	// 3. Sync the engine whenever width or height changes
	onMount(() => {
		const engine = getContext<Engine>('p5kit-engine');
		$effect(() => {
			engine.resizeCanvas(width, height);
		});
	});

	const items = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' }
	];
</script>

<Accordion title="Resolution">
	<div class="controls">
		<!-- <select
		value={selectedPreset?.name ?? ''}
		onchange={(e) => {
			const opt = resolutionOptions.find((o) => o.name === e.currentTarget.value);
			if (opt) {
				width = opt.x;
				height = opt.y;
			}
		}}
	>
		{#each resolutionOptions as option}
			<option value={option.name}>{option.name} ({option.x}x{option.y})</option>
		{/each}
	</select> -->
		<p>test</p>
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
		color: var(--text-base);
	}

	select {
		grid-column-start: 1;
		grid-column-end: span 2;
	}
</style>
