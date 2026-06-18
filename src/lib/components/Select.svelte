<script lang="ts">
	import { Select, type WithoutChildren } from 'bits-ui';
	import { CaretDownIcon, VectorTwoIcon } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		icon?: Snippet;
	};

	let { value = $bindable(), items, contentProps, placeholder, icon }: Props = $props();
</script>

<Select.Root bind:value={value as never} type="single" {items} {...contentProps}>
	<Select.Trigger aria-label={placeholder}>
		<Select.Value>
			{#snippet children({ selection, placeholder, disabled })}
				{#if selection.type === 'single'}
					{#if icon}
						<div id="icon">{@render icon()}</div>
					{/if}
					<span>{selection.selected?.label}</span>
					<CaretDownIcon name="caret-down" />
				{/if}
			{/snippet}
		</Select.Value>
	</Select.Trigger>
	<Select.Portal>
		<Select.Content sideOffset={10}>
			<Select.ScrollUpButton></Select.ScrollUpButton>
			<Select.Viewport>
				{#each items as item}
					<Select.Item value={item.value} label={item.label} disabled={item.disabled}>
						{#snippet children({ selected })}
							{item.label}
							{#if selected}
								<div></div>
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton></Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>

<style>
	:global([data-select-trigger]) {
		background-color: light-dark(var(--gray-300), var(--gray-700));
		border: unset;
		border-radius: var(--ui-border);
		color: light-dark(var(--gray-950), var(--gray-50));
		padding: unset;
		font-size: var(--ui-text);
		width: 100%;
	}

	:global([data-select-value]) {
		display: flex;
		gap: var(--ui-padding);
		cursor: pointer;
		padding: var(--ui-padding);
		align-items: center;

		& > #icon > svg {
			color: light-dark(var(--gray-950), var(--gray-50));
		}
	}

	:global([name='caret-down']) {
		margin-left: auto;
	}

	:global([data-select-content]) {
		width: var(--bits-select-anchor-width);
		cursor: pointer;
		margin: unset;
	}

	:global([data-select-viewport]) {
		background-color: light-dark(var(--gray-300), var(--gray-700));
		border-radius: var(--ui-border);
		border: unset;
		color: light-dark(var(--gray-950), var(--gray-50));
		display: flex;
		flex-direction: column;
		font-size: var(--ui-text);
		gap: var(--ui-padding);
		padding: var(--ui-padding);
	}

	:global([data-select-item]) {
		padding: var(--ui-padding);
	}

	:global([data-select-item][data-highlighted]) {
		background-color: light-dark(var(--gray-400), var(--gray-700));
		border-radius: var(--ui-border);
	}
</style>
