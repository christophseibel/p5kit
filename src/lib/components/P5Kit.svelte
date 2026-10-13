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

	$effect(() => {
		document.body.classList.toggle('baseStyles', baseStyles);
	});

	let { baseStyles = true, children }: { baseStyles: boolean; children?: Snippet } = $props();
</script>

{#if children}
	{@render children()}
{/if}
