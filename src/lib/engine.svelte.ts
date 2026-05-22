import type p5 from 'p5';

class Engine {
	instance = $state<p5 | undefined>(undefined);
	container = $state<HTMLDivElement | undefined>(undefined);
	canvas = $state<HTMLCanvasElement | undefined>(undefined);

	wrap = (sketch: (p: p5) => void) => {
		return (instance: p5) => {
			sketch(instance);
			const {
				setup: userSetup,
				draw: userDraw,
				windowResized: userWindowResized,
				keyPressed: userKeyPressed,
				mouseWheel: userMouseWheel
			} = instance;

			instance.setup = async () => {
				if (userSetup) userSetup();
			};

			instance.draw = () => {
				if (userDraw) userDraw();
				instance.push();
				instance.fill(255, 0, 0);
				instance.rect(
					instance.width / 2,
					instance.height / 2,
					instance.width / 6,
					instance.height / 6
				);
				instance.pop();
			};

			instance.windowResized = (event: UIEvent) => {
				userWindowResized?.(event);
				this.containCanvas();
			};
		};
	};

	containCanvas = () => {
		if (this.instance && this.canvas && this.container) {
			const canvAsp = this.instance.width / this.instance.height;
			const wrapperW = this.container.clientWidth;
			const wrapperH = this.container.clientHeight;
			const wrapperAsp = wrapperW / wrapperH;

			this.canvas.style = '';
			this.canvas.style.display = 'block';

			this.canvas.style.maxWidth = `1px`;
			this.canvas.style.maxHeight = `1px`;

			this.canvas.style.aspectRatio = canvAsp.toString();
			if (canvAsp > wrapperAsp) {
				this.canvas.style.width = '100%';
				this.canvas.style.maxWidth = `${wrapperW}px`;
				this.canvas.style.height = '';
				this.canvas.style.maxHeight = '';
			} else {
				this.canvas.style.width = '';
				this.canvas.style.maxWidth = '';
				this.canvas.style.height = '100%';
				this.canvas.style.maxHeight = `${wrapperH}px`;
			}
		}
	};

	resizeCanvas = (width: number, height: number) => {
		if (width < 1 || height < 1) return;

		this.instance?.pixelDensity(1);
		this.instance?.resizeCanvas(width, height);

		this.containCanvas();
		this.containCanvas();
	};

	registerInstance(instance: p5, container: HTMLDivElement) {
		this.instance = instance;
		this.container = container;
		this.canvas = this.container.getElementsByTagName('canvas')[0];
		this.container.style.height = '100%';
		this.container.style.width = '100%';
	}
}

export type { Engine };

export function createEngine() {
	return new Engine();
}
