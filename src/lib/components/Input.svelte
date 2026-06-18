<script lang="ts" generics="T extends 'text' | 'number'">
	type ValueType = T extends 'text' ? string : number;

	let {
		type = 'number' as T,
		value = $bindable(),
		onChange = () => {}
	}: {
		type?: T;
		value?: ValueType;
		onChange?: (val: ValueType) => void;
	} = $props();
</script>

<input
	{type}
	bind:value
	onchange={() => {
		onChange?.(value as ValueType);
	}}
/>

<style>
	input {
		background-color: light-dark(var(--gray-300), var(--gray-700));
		border-radius: var(--ui-border);
		border: unset;
		color: light-dark(var(--gray-950), var(--gray-50));
		font-size: var(--ui-text);
		padding: var(--ui-padding);
		width: 100%;
		box-sizing: border-box;
	}
</style>
