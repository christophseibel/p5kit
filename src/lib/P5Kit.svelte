<script lang="ts">
	import { setContext } from 'svelte';
	import { createEngine, type Engine } from './engine.svelte.ts';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();

	const engine = createEngine();

	setContext('p5kit-engine', engine);

	$effect(() => {
		if (engine?.canvas) {
			console.log('canvas ready');
			engine.containCanvas();
		}
	});
</script>

<div id="p5-kit">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	#p5-kit {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
