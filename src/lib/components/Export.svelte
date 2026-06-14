<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { type Engine } from './code/engine.svelte.ts';
	import Accordion from './Accordion.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import {
		DownloadIcon,
		VideoCameraIcon,
		VideoCameraSlashIcon,
		FileImageIcon,
		FileVideoIcon
	} from 'phosphor-svelte';
	import Separator from './Separator.svelte';
	import Select from './Select.svelte';
	import Progress from './Progress.svelte';

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
		{ label: 'WEBP', value: 'webp' },
		{ label: 'EXR', value: 'exr' }
	];

	let defaultVideoFormats = [
		{ label: 'MP4', value: 'MP4' },
		{ label: 'WEBM', value: 'WEBM' }
	];

	let imageFormat = $state(defaultImageFormats[0].value);
	let videoFormat = $state(defaultVideoFormats[0].value);

	let videoDuration = $state(10);
</script>

<Accordion title="Export">
	<div class="label">
		<span>Format</span>
		<Select items={defaultImageFormats} type="single" bind:value={imageFormat}>
			{#snippet icon()}
				<FileImageIcon size={14} />
			{/snippet}
		</Select>
	</div>
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
			<span>Download</span>
		</Button>
	</div>

	<Separator orientation="horizontal" />

	<div class="label">
		<span>Format</span>
		<Select items={defaultVideoFormats} type="single" bind:value={videoFormat}>
			{#snippet icon()}
				<FileVideoIcon size={14} />
			{/snippet}
		</Select>
	</div>
	<div class="label">
		<span>Duration (s)</span>
		<Input type="number" bind:value={videoDuration} />
	</div>
	<div class="label">
		<span>Video</span>
		{#if engine?.isExporting}
			<Button
				abort
				onclick={() => {
					engine?.cancelVideoExport();
				}}
			>
				<VideoCameraSlashIcon size={14} />
				<span>Stop</span>
			</Button>
		{:else}
			<Button
				onclick={() => {
					engine?.exportVideo(videoDuration, videoFormat);
					onExport();
				}}
			>
				<VideoCameraIcon size={14} />
				<span>Record</span>
			</Button>
		{/if}
	</div>
	{#if engine?.isExporting}
		<Progress label="Exporting" value={engine?.exportProgress} />
	{/if}
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
