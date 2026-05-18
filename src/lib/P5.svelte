<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import type p5 from 'p5';
	import type { Engine } from './engine.svelte.ts';

	interface SketchProps {
		userSketch: (p: p5) => void;
		target?: HTMLElement;
		disableFriendlyErrors?: boolean;
		parentDivStyle?: string;
		debug?: boolean;
		onRef?: (el: HTMLElement) => void;
		onInstance?: (p5Instance: p5) => void;
	}

	let {
		userSketch,
		target,
		disableFriendlyErrors = true,
		parentDivStyle = 'display: block;',
		debug = false,
		onRef = () => {},
		onInstance = () => {}
	}: SketchProps = $props();

	let kitSketch: p5 | undefined = undefined;
	const engine = getContext<Engine>('p5kit-engine');

	function ref(node: HTMLElement) {
		target = node;
		onRef(node);
		return {
			destroy() {
				target = undefined;
			}
		};
	}

	// function augmentClasses<NativeClasses extends [string, Record<string, any>][]>(
	// 	instance: p5,
	// 	classes: NativeClasses
	// ) {
	// 	classes.forEach(([key, value]) => {
	// 		(instance as Record<string, any>)[key] = value;
	// 	});
	// 	return instance;
	// }

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

		kitSketch = new p5((instance: p5) => {
			userSketch(instance);

			const userDraw = instance.draw;
			instance.draw = () => {
				instance.push();
				instance.background(255);
				instance.rectMode(instance.CENTER);
				instance.fill(255, 0, 0);
				instance.rect(instance.width / 2, instance.height / 2, 200, 200);
				instance.pop();
				userDraw();
			};
			// instance = augmentClasses(instance, nativeClasses);
			if (debug) console.log('p5 instance', instance);
			window._p5Instance = instance;
		}, target);

		engine.registerInstance(kitSketch);
		onInstance(kitSketch);
	});

	onDestroy(() => {
		kitSketch?.remove();
		kitSketch = undefined;
	});
</script>

<div use:ref style={parentDivStyle}></div>
