<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import ColorPickerInput from './ColorPickerInput.svelte';

	let { hex = $bindable('#ff0000') } = $props();

	let rawHex = $state(hex.replace('#', ''));

	$effect(() => {
		hex = `#${rawHex}`;
	});

	$effect(() => {
		rawHex = hex.replace('#', '');
	});
</script>

<div class="p5kit-colorpicker">
	<ColorPicker
		bind:hex
		components={{ input: ColorPickerInput }}
		label=""
		isTextInput={false}
		sliderDirection="vertical"
		--input-size="12px"
		--cp-bg-color="light-dark(var(--gray-50),var(--gray-700))"
		--cp-border-color="transparent"
	/>
	<div class="p5kit-colorpicker-text">
		<span>#</span>
		<input type="text" bind:value={rawHex} />
	</div>
</div>

<style>
	.p5kit-colorpicker {
		width: 100%;
		background-color: light-dark(var(--gray-300), var(--gray-700));
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-items: center;
		gap: var(--ui-padding);
		padding: var(--ui-padding);
		box-sizing: border-box;
		border-radius: var(--ui-border);
		font-size: var(--ui-text);
		color: light-dark(var(--gray-400), var(--gray-500));
	}

	.p5kit-colorpicker-text {
		display: flex;
		align-items: center;
		gap: 1px;
		width: 100%;
	}

	input {
		background-color: light-dark(var(--gray-300), var(--gray-700));
		box-sizing: content-box;
		border-radius: var(--ui-border);
		border: unset;
		color: light-dark(var(--gray-950), var(--gray-50));
		font-size: var(--ui-text);
		width: 100%;
	}
</style>
