import type p5 from 'p5';

class Engine {
	instance = $state<p5 | null>(null);

	registerInstance(instance: p5) {
		this.instance = instance;
	}
}

export type { Engine };

export function createEngine() {
	return new Engine();
}
