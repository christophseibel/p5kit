<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './engine.svelte.ts';

	let engine: Engine | undefined = $state();

	onMount(() => {
		engine = getContext<Engine>('p5kit-engine');
	});
</script>

<button onclick={engine?.exportImage}>Export Image!</button>

<style></style>
