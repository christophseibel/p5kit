<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Engine } from './code/engine.svelte.ts';
	import Accordion from './Accordion.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import {
		DownloadIcon,
		VideoCameraIcon,
		VideoCameraSlashIcon,
		FileImageIcon
	} from 'phosphor-svelte';
	import Separator from './Separator.svelte';
	import Select from './Select.svelte';

	let engine: Engine | undefined = $state();

	onMount(async () => {
		engine = getContext<Engine>('p5kit-engine');
	});

	interface SketchProps {
		onExport?: () => void;
	}

	let { onExport = () => {} }: SketchProps = $props();

	let defaultImageFormats = [
		{ label: 'PNG', value: 'png' },
		{ label: 'JPG', value: 'jpg' },
		{ label: 'WEBP', value: 'webp' }
	];

	let imageFormat = $state(defaultImageFormats[0].value);
</script>

<Accordion title="Export">
	<div class="label">
		<span>Image</span>
		<Button
			onclick={() => {
				onExport();
				requestAnimationFrame(() => {
					engine?.exportImage(imageFormat);
				});
			}}
		>
			<DownloadIcon size={14} />
			<span>Export Image</span>
		</Button>
	</div>
	<div class="label">
		<span>Format</span>
		<Select items={defaultImageFormats} type="single" bind:value={imageFormat}>
			{#snippet icon()}
				<FileImageIcon size={14} />
			{/snippet}
		</Select>
	</div>
	<Separator orientation="horizontal" />
	<div class="label">
		<span>Video</span>
		{#if engine?.isRecording}
			<Button
				abort
				onclick={() => {
					engine?.stopExport();
				}}
			>
				<VideoCameraSlashIcon size={14} />
				<span>Stop</span>
			</Button>
		{:else}
			<Button
				onclick={() => {
					onExport();
					engine?.startExport();
				}}
			>
				<VideoCameraIcon size={14} />
				<span>Record</span>
			</Button>
		{/if}
	</div>

	<div class="label">
		<span>Duration (s)</span>
		<Input type="number" value={10} />
	</div>
</Accordion>

<style>
	.label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--ui-padding);
		font-size: var(--ui-text);

		& > span {
			width: 50%;
		}
	}
</style>
