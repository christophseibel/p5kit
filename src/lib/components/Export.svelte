<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { type Engine, ExportStatus } from './code/engine.svelte.ts';
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
		{ label: 'WEBM', value: 'WEBM' },
		{ label: 'Frame sequence (PNG)', value: 'Frame sequence (PNG)' }
	];

	let imageFormat = $state(defaultImageFormats[0].value);
	let videoFormat = $state(defaultVideoFormats[0].value);
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
		{#if engine?.exportStatus == ExportStatus.Finished}
			<Button
				onclick={() => {
					onExport();
					engine?.startExport(videoFormat);
				}}
			>
				<VideoCameraIcon size={14} />
				<span>Record</span>
			</Button>
		{:else}
			<Button
				abort
				disabled={engine?.exportStatus == ExportStatus.Loading}
				onclick={() => {
					engine?.abortExport();
				}}
			>
				<VideoCameraSlashIcon size={14} />
				<span>{engine?.exportStatus == ExportStatus.Loading ? 'Loading' : 'Stop'}</span>
			</Button>
		{/if}
	</div>
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
		<Input
			type="number"
			value={10}
			onChange={(value) => {
				engine?.updateFrameCount(value);
			}}
		/>
	</div>
	{#if engine?.exportStatus == ExportStatus.Recording}
		<Progress label="Recording" value={engine?.exportProgress} />
	{/if}
	{#if engine?.exportStatus == ExportStatus.Exporting}
		<Progress label="Exporting" value={engine?.videoExporter?.exportProgress} />
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
