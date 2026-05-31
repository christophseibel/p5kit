<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import type p5 from 'p5';
	import type { Engine } from './engine.svelte.ts';

	interface SketchProps {
		userSketch: (p: p5) => void;
		disableFriendlyErrors?: boolean;
		parentDivStyle?: string;
		debug?: boolean;
		onRef?: (el: HTMLElement) => void;
		onInstance?: (p5Instance: p5) => void;
	}

	let {
		userSketch,
		disableFriendlyErrors = true,
		parentDivStyle = 'display: block;',
		debug = false,
		onRef = () => {},
		onInstance = () => {}
	}: SketchProps = $props();

	let kitSketch: p5 | undefined = undefined;
	let container: HTMLDivElement | undefined;
	const engine = getContext<Engine | null>('p5kit-engine');

	function ref(node: HTMLDivElement) {
		container = node;
		onRef(node);
		return {
			destroy() {
				container = undefined;
			}
		};
	}

	/*function augmentClasses<NativeClasses extends [string, Record<string, any>][]>(
		instance: p5,
		classes: NativeClasses
	) {
		classes.forEach(([key, value]) => {
			(instance as Record<string, any>)[key] = value;
		});
		return instance;
	}*/

	onMount(async () => {
		const library = await import('p5');
		const { default: p5 } = library;
		p5.disableFriendlyErrors = disableFriendlyErrors;

		// const entries = Object.entries(p5).filter(([key]) => key[0] !== '_');
		// const nativeClasses = entries.filter(
		// 	([key, value]) => typeof value === 'function' && key !== 'default'
		// );

		// if (debug) {
		// 	console.log('available p5 native classes', nativeClasses);
		// }

		userSketch = engine ? engine.wrap(userSketch) : userSketch;

		kitSketch = new p5((instance: p5) => {
			userSketch(instance);
			const userSetup = instance.setup;
			instance.setup = async () => {
				userSetup?.();
				engine?.registerInstance(instance, container!);
			};
			// instance = augmentClasses(instance, nativeClasses);
			if (debug) console.log('p5 instance', instance);
			window._p5Instance = instance;
		}, container);

		onInstance(kitSketch);
	});

	onDestroy(() => {
		kitSketch?.remove();
		kitSketch = undefined;
	});
</script>

<div use:ref style={parentDivStyle} id="canvasContainer"></div>

<style>
	:global(canvas) {
		display: block;
	}
</style>
