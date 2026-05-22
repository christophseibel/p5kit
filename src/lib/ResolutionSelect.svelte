<script lang="ts">
	import { getContext } from 'svelte';
	import type { Engine } from './engine.svelte.ts';

	const engine = getContext<Engine>('p5kit-engine');
	console.log(engine);
</script>

<button
	onclick={() => {
		engine.resizeCanvas(200, 200);
	}}>test</button
>
