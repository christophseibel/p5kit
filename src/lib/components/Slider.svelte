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

<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
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
		background-color: var(--gray-700);
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
		background-color: var(--gray-400);
	}

	:global([data-slider-thumb]) {
		position: absolute;
		background-color: var(--gray-900);
		border: var(--gray-400) solid 2px;
		width: 8px;
		height: 8px;
		border-radius: 100%;
	}
</style>
