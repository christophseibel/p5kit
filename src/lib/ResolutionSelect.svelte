<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './engine.svelte.ts';

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
	let width = $state(resolutionOptions[0].x);
	let height = $state(resolutionOptions[0].y);

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
</script>

<!-- Input Fields: Bind directly to width and height -->
<div class="controls">
	<input type="number" bind:value={width} />
	<input type="number" bind:value={height} />
	<select
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
	</select>
</div>
