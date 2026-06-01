<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './engine.svelte.ts';
	import Accordion from './Accordion.svelte';
	import Button from './Button.svelte';
	import { DownloadIcon } from 'phosphor-svelte';

	let engine: Engine | undefined = $state();

	onMount(() => {
		engine = getContext<Engine>('p5kit-engine');
	});

	interface SketchProps {
		onExport?: () => void;
	}

	let { onExport = () => {} }: SketchProps = $props();
</script>

<Accordion title="Export">
	<Button
		onclick={() => {
			onExport();
			requestAnimationFrame(() => {
				engine?.exportImage();
			});
		}}
	>
		<DownloadIcon size={14} />
		<span>Export Image</span>
	</Button>
</Accordion>

<style></style>
