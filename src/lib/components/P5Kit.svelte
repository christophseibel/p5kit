<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { createEngine, type Engine } from './code/engine.svelte.ts';
	import type { Snippet } from 'svelte';
	import '../style.css';

	const engine = createEngine();

	setContext('p5kit-engine', engine);

	$effect(() => {
		if (engine?.canvas) {
			engine.containCanvas();
		}
	});

	let { children }: { children?: Snippet } = $props();
</script>

<div id="p5kit">
	{#if children}
		{@render children()}
	{/if}
</div>
