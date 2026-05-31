<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from '../engine.svelte.ts';
	import Accordion from './Accordion.svelte';

	let engine: Engine | undefined = $state();

	onMount(() => {
		engine = getContext<Engine>('p5kit-engine');
	});
</script>

<Accordion title="Image Export"
	><button onclick={engine?.exportImage}>Export Image!</button></Accordion
>

<style></style>
