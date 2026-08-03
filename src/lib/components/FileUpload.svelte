<script lang="ts" generics="T extends FileType">
	import type { FileType } from '$lib/index.js';
	import { getContext } from 'svelte';
	import type { Engine } from './code/engine.svelte.ts';
	import type p5 from 'p5';
	import Button from './Button.svelte';
	import { UploadIcon } from 'phosphor-svelte';

	type P5Type = {
		image: p5.Image;
		json: Record<string, unknown>;
		font: p5.Font;
		model: p5.Geometry;
		strings: string[];
	};

	let {
		accepts,
		file = $bindable<P5Type[T] | undefined>(undefined)
	}: { accepts: T; file?: P5Type[T] | undefined } = $props();

	const acceptString = {
		image: 'image/*',
		json: '.json',
		font: 'font/*',
		model: '.obj,.stl',
		strings: '.txt'
	} satisfies Record<FileType, string>;

	const engine = getContext<Engine>('p5kit-engine');

	let inputElement: HTMLInputElement | undefined = $state();
	let inputFile: File | undefined = $state();

	async function loadFile(file: File): Promise<P5Type[T]> {
		const map = {
			image: async () => await engine.instance?.loadImage(URL.createObjectURL(file)),
			json: async () => await engine.instance?.loadJSON(URL.createObjectURL(file)),
			font: async () => await engine.instance?.loadFont(URL.createObjectURL(file)),
			model: async () => await engine.instance?.loadModel(URL.createObjectURL(file)),
			strings: async () => await engine.instance?.loadStrings(URL.createObjectURL(file))
		};

		let outputFile = (await map[accepts]()) as P5Type[T];
		return outputFile;
	}
</script>

<div id="file-upload">
	<Button
		onclick={() => {
			inputElement?.click();
		}}
	>
		<UploadIcon size={14} />
		<span>{inputFile ? inputFile.name : 'Upload File'}</span>
	</Button>

	<input
		bind:this={inputElement}
		onchange={async (e) => {
			inputFile = e.currentTarget.files?.[0];
			if (inputFile) file = await loadFile(inputFile);
		}}
		type="file"
		name=""
		id=""
		accept={acceptString[accepts]}
	/>
</div>

<style>
	#file-upload {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--ui-padding);
		font-size: var(--ui-text);

		input {
			display: none;
		}
	}

	span {
		max-width: 80%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
