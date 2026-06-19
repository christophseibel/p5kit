<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Slider, type WithoutChildren } from 'bits-ui';

	type Props = WithoutChildren<ComponentProps<typeof Slider.Root>>;

	type baseProps = {
		min?: number;
		max?: number;
		step?: number;
		onValueChange?: () => void;
		onValueCommit?: () => void;
	};

	type wholeProps =
		| ({ type: 'single'; value: number } & baseProps)
		| ({ type: 'range'; value: [number, number] } & baseProps);

	let { value = $bindable(), type, ...restProps }: wholeProps = $props();
</script>

<Slider.Root bind:value type={type == 'single' ? 'single' : 'multiple'} {...restProps as any}>
	{#snippet children({ thumbItems, tickItems })}
		<Slider.Range />
		{#each thumbItems as thumbItem, index}
			<Slider.Thumb {index} />
		{/each}

		{#each tickItems as tickItem, index}
			<Slider.Tick {index} />
		{/each}
	{/snippet}
</Slider.Root>

<style>
	:global([data-slider-root]) {
		background-color: light-dark(var(--gray-300), var(--gray-700));
		height: 3px;
		position: relative;
		display: flex;
		width: 100%;
		touch-action: none;
		user-select: none;
		align-items: center;
		justify-content: center;
		border-radius: 1rem;
		margin-top: var(--ui-padding);
		margin-bottom: var(--ui-padding);
		cursor: pointer;
	}

	:global([data-slider-range]) {
		position: absolute;
		height: 100%;
		background-color: light-dark(var(--gray-400), var(--gray-500));
	}

	:global([data-slider-thumb]) {
		position: absolute;
		background-color: light-dark(var(--gray-50), var(--gray-950));
		border: light-dark(var(--gray-400), var(--gray-500)) solid 2px;
		width: 10px;
		height: 10px;
		border-radius: 100%;
	}
</style>
