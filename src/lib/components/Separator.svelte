<script lang="ts">
	import { Separator, type SeparatorRootProps } from 'bits-ui';

	let { orientation = 'horizontal' }: { orientation: 'horizontal' | 'vertical' } = $props();
</script>

<Separator.Root {orientation} decorative={true} />

<style>
	:global([data-separator-root]) {
		border: solid 0.5px light-dark(var(--gray-300), var(--gray-700));
	}
</style>
