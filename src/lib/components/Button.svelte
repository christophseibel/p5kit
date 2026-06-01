<script lang="ts">
	import { Button, type WithoutChildren } from 'bits-ui';

	let { children, ...props } = $props();
</script>

<Button.Root {...props}>
	{@render children()}
</Button.Root>

<style>
	:global([data-button-root]) {
		background-color: light-dark(var(--gray-400), var(--gray-600));
		border: unset;
		font-size: var(--ui-text);
		padding: var(--ui-padding);
		border-radius: var(--ui-border);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--ui-padding);

		width: 100%;

		& > svg {
			color: var(--gray-300);
		}
	}

	:global([data-button-root]):active {
		background-color: light-dark(var(--gray-300), var(--gray-500));
	}
</style>
