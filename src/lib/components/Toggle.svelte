<script lang="ts">
	import { Switch, Label, useId, type WithoutChildrenOrChild } from 'bits-ui';

	let {
		id = useId(),
		checked = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<Switch.RootProps> = $props();
</script>

<div id="toggle">
	<Switch.Root bind:checked {id} {...restProps}>
		<Switch.Thumb />
	</Switch.Root>
</div>

<style>
	#toggle {
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: center;
		gap: var(--ui-padding);
	}

	:global([data-switch-root]) {
		border-radius: 1rem;
		height: 16px;
		width: 36px;
		border: unset;
		box-sizing: content-box;
		padding: 4px;
		cursor: pointer;
		background-color: light-dark(var(--gray-300), var(--gray-700));
	}

	:global([data-switch-thumb]) {
		background-color: var(--gray-50);
		border-radius: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
		display: block;
		transition: transform 120ms ease-in-out;
		transform: translateX(0);
	}

	:global([data-switch-thumb][data-state='checked']) {
		transform: translate(20px);
	}

	:global([data-switch-root][data-state='checked']) {
		background-color: color-mix(
			in srgb,
			light-dark(var(--gray-400), var(--gray-600)),
			rgb(0, 45, 243)
		);
	}
</style>
