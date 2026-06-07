<script lang="ts">
	import { Progress, useId } from 'bits-ui';
	import type { ComponentProps } from 'svelte';

	let {
		max = 100,
		value = 0,
		min = 0,
		label
	}: ComponentProps<typeof Progress.Root> & {
		label: string;
	} = $props();

	const labelId = useId();
</script>

<div id="progress">
	<span id={labelId}> {label} </span>
	<Progress.Root
		aria-labelledby={labelId}
		aria-valuetext={'value?.toString()' + '%'}
		{value}
		{min}
		{max}
	>
		<div
			id="indicator"
			style={`transform: translateX(-${100 - (100 * (value ?? 0)) / 100}%)`}
		></div>
	</Progress.Root>
</div>

<style>
	#progress {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--ui-padding);
		font-size: var(--ui-text);

		& > span {
			width: 50%;
		}
	}

	:global([data-progress-root]) {
		height: 4px;
		width: 100%;
		background-color: light-dark(var(--gray-300), var(--gray-600));
		border-radius: 1rem;
		overflow: hidden;
	}

	#indicator {
		height: 100%;
		width: 100%;
		background-color: color-mix(
			in srgb,
			light-dark(var(--gray-400), var(--gray-600)),
			rgb(0, 245, 0)
		);
	}
</style>
