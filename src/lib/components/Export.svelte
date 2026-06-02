<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './code/engine.svelte.ts';
	import Accordion from './Accordion.svelte';
	import Button from './Button.svelte';
	import { DownloadIcon } from 'phosphor-svelte';
	import { loadFFmpeg } from './code/ffmpeg.svelte.ts';

	let engine: Engine | undefined = $state();

	onMount(async () => {
		engine = getContext<Engine>('p5kit-engine');
		loadFFmpeg();
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
	<Button
		onclick={() => {
			engine?.startExport();
		}}>Start Export</Button
	>
	<Button
		onclick={() => {
			engine?.stopExport();
		}}>Stop Export</Button
	>
</Accordion>

<style></style>
