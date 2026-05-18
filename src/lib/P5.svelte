<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type p5 from 'p5';

	// Component props
	let {
		target = undefined,
		sketch = undefined,
		disableFriendlyErrors = true,
		parentDivStyle = 'display: block;',
		debug = false,
		onRef = (el: HTMLElement) => {},
		onInstance = (p5Instance: p5) => {}
	} = $props();

	let project: p5 | undefined = undefined;
	let container: HTMLDivElement | undefined = $state(); // Use $state for the ref

	function ref(node: HTMLElement) {
		target = node;
		onRef(node);
		return {
			destroy() {
				target = undefined;
			}
		};
	}

	function augmentClasses<NativeClasses extends [string, Record<string, any>][]>(
		instance: p5,
		classes: NativeClasses
	) {
		classes.forEach(([key, value]) => {
			(instance as Record<string, any>)[key] = value;
		});
		return instance;
	}

	onMount(async () => {
		const library = await import('p5');
		const { default: p5 } = library;
		p5.disableFriendlyErrors = disableFriendlyErrors;

		const entries = Object.entries(p5).filter(([key]) => key[0] !== '_');
		const nativeClasses = entries.filter(
			([key, value]) => typeof value === 'function' && key !== 'default'
		);

		if (debug) {
			console.log('available p5 native classes', nativeClasses);
		}

		project = new p5((instance: p5) => {
			instance = augmentClasses(instance, nativeClasses);
			if (debug) console.log('p5 instance', instance);
			window._p5Instance = instance;
			return sketch(instance);
		}, target);

		onInstance(project);
	});

	onDestroy(() => {
		project?.remove();
		project = undefined;
	});
</script>

<div use:ref style={parentDivStyle}></div>
