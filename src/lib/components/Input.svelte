<script lang="ts">
	type textProps = { type?: 'text'; value?: string };
	type numberProps = { type?: 'number'; value?: number };
	let { type = 'number', value = $bindable() }: textProps | numberProps = $props();
</script>

<input {type} bind:value />

<style>
	input {
		background-color: var(--gray-700);
		border-radius: var(--ui-border);
		border: unset;
		color: white;
		font-size: var(--ui-text);
		padding: var(--ui-padding);
		width: 100%;
		box-sizing: border-box;
	}
</style>
