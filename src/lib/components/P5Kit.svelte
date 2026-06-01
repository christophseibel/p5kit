<script lang="ts">
	import { setContext } from 'svelte';
	import { createEngine, type Engine } from './engine.svelte.ts';
	import type { Snippet } from 'svelte';
	import '$lib/style.css';

	let { children }: { children?: Snippet } = $props();

	const engine = createEngine();

	setContext('p5kit-engine', engine);

	$effect(() => {
		if (engine?.canvas) {
			engine.containCanvas();
		}
	});
</script>

<div id="p5kit">
	{#if children}
		{@render children()}
	{/if}
</div>
