<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { CaretDownIcon } from 'phosphor-svelte';

	let { title, children, ...restProps } = $props();
</script>

<Accordion.Root type="single" {...restProps}>
	<Accordion.Item value={title}>
		<Accordion.Header>
			<Accordion.Trigger
				><span>{title}</span><span><CaretDownIcon className="icon" /></span></Accordion.Trigger
			>
		</Accordion.Header>
		<Accordion.Content>
			<div id="content">
				{@render children()}
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

<style>
	:global([data-accordion-root]) {
		width: 100%;
		height: fit-content;
		box-sizing: border-box;
		background-color: light-dark(var(--gray-200), var(--gray-800));
	}

	:global([data-accordion-item]) {
		border-bottom: var(--gray-700) solid 1px;
	}

	:global([data-accordion-trigger]) {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		background: none;
		border: unset;
		cursor: pointer;
		padding: var(--ui-spacing) calc(1.5 * var(--ui-spacing)) var(--ui-spacing) var(--ui-spacing);
		font-size: var(--ui-text);
		color: light-dark(var(--gray-950), var(--gray-50));
	}

	:global([data-accordion-content]) {
		overflow: hidden;
	}

	:global([data-accordion-content][data-state='open']) #content {
		animation: panel-in 160ms ease-out forwards;
	}

	:global([data-accordion-content][data-state='closed']) #content {
		animation: panel-out 120ms ease-in forwards;
	}

	:global([data-accordion-content][data-state='open']) {
		animation: accordion-down 0.1s ease-out;
	}

	:global([data-accordion-content][data-state='closed']) {
		animation: accordion-up 0.1s ease-in;
	}

	@keyframes accordion-down {
		from {
			height: 0;
		}
		to {
			height: var(--bits-accordion-content-height);
		}
	}

	@keyframes accordion-up {
		from {
			height: var(--bits-accordion-content-height);
		}
		to {
			height: 0;
		}
	}

	@keyframes panel-in {
		from {
			transform: translateY(-4px) scaleY(0.98);
			opacity: 0;
		}
		to {
			transform: translateY(0) scaleY(1);
			opacity: 1;
		}
	}

	@keyframes panel-out {
		from {
			transform: translateY(0) scaleY(1);
			opacity: 1;
		}
		to {
			transform: translateY(-4px) scaleY(0.98);
			opacity: 0;
		}
	}

	#content {
		padding: 0 var(--ui-spacing) var(--ui-spacing);
		display: flex;
		flex-direction: column;
		gap: var(--ui-spacing);
	}
</style>
