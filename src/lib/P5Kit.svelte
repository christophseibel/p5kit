<script lang="ts">
	import { setContext } from 'svelte';
	import { createEngine, type Engine } from './engine.svelte.ts';

	let { children } = $props();

	const engine = createEngine();

	setContext('p5kit-engine', engine);
</script>

<div class="p5-kit">
	{@render children()}
</div>
