<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { CaretDownIcon } from 'phosphor-svelte';
	import '$lib/style.css';

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
		padding: 0 var(--ui-padding) 0 var(--ui-padding);
		box-sizing: border-box;
		background-color: var(--ui-bg);
	}

	:global([data-accordion-item]) {
		border-bottom: var(--ui-border) solid 1px;
	}

	:global([data-accordion-trigger]) {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		background: none;
		border: unset;
		cursor: pointer;
		padding: var(--ui-padding);
		font-size: var(--ui-text);
		color: var(--text-base);

		& > span > svg {
			transition: transform 0.2s ease;
		}
	}

	:global([data-accordion-trigger][data-state='open']) {
		& > span > svg {
			transform: rotate(180deg);
		}
	}

	#content {
		padding: 10px;
	}

	:global([data-accordion-content]) {
		overflow: hidden;
	}

	:global([data-accordion-content][data-state='open']) {
		animation: accordion-down 0.1s ease-out;
	}

	/* Trigger 'up' animation when state is closed */
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

	@keyframes caret-open {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(90deg);
		}
	}
</style>
