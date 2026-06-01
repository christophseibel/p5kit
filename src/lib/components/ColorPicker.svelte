<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import ColorPickerInput from './ColorPickerInput.svelte';

	let rawHex = $state('ff0000');
	let pickerHex = $state('#ff0000');

	$effect(() => {
		pickerHex = `#${rawHex}`;
	});

	$effect(() => {
		rawHex = pickerHex.replace('#', '');
	});
</script>

<div id="p5kit-colorpicker">
	<ColorPicker
		bind:hex={pickerHex}
		components={{ input: ColorPickerInput }}
		label=""
		isTextInput={false}
		sliderDirection="vertical"
		--input-size="12px"
		--cp-bg-color="light-dark(var(--gray-50),var(--gray-700))"
		--cp-border-color="transparent"
	/>
	<div id="input">
		<span>#</span>
		<input type="text" bind:value={rawHex} />
	</div>
</div>

<style>
	#p5kit-colorpicker {
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

	#input {
		display: flex;
		align-items: center;
		gap: 1px;
	}

	input {
		width: 100%;
		background-color: unset;
		border: unset;
	}
</style>
