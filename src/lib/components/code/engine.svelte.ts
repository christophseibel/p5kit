import type p5 from 'p5';
import {
	Output,
	CanvasSource,
	QUALITY_MEDIUM,
	Mp4OutputFormat,
	WebMOutputFormat,
	BufferTarget
} from 'mediabunny';
import type { OutputFormat, VideoCodec } from 'mediabunny';

type videoFormat = { name: string; format: OutputFormat; codec: VideoCodec };

const videoFormats: videoFormat[] = [
	{ name: 'MP4', format: new Mp4OutputFormat(), codec: 'avc' },
	{ name: 'WEBM', format: new WebMOutputFormat(), codec: 'vp9' }
];

class Engine {
	instance = $state<p5 | undefined>(undefined);
	container = $state<HTMLDivElement | undefined>(undefined);
	canvas = $state<HTMLCanvasElement | undefined>(undefined);

	isExporting = $state(false);
	animationFrameCount = -1;
	exportProgress = $state(0);

	output = new Output({
		format: new Mp4OutputFormat(),
		target: new BufferTarget()
	});

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
				userSetup?.();
			};

			instance.draw = () => {
				userDraw?.();
			};

			instance.windowResized = (event: UIEvent) => {
				userWindowResized?.(event);
				this.containCanvas();
			};
		};
	};

	containCanvas() {
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
	}

	resizeCanvas(width: number, height: number) {
		if (width < 1 || height < 1) return;

		this.instance?.pixelDensity(1);
		this.instance?.resizeCanvas(width, height);

		this.containCanvas();
		this.containCanvas();
	}

	exportImage(title: string, format: string) {
		this.instance?.saveCanvas(title, format);
	}

	async exportVideo(title: string, duration: number, formatName: string) {
		if (!this.instance || !this.canvas) return;

		try {
			this.instance.noLoop();
			const frameRate = this.instance.getTargetFrameRate();
			const totalFrames = duration * frameRate;

			const outputFormat = videoFormats.find((format) => format.name == formatName);
			console.log(outputFormat?.format.mimeType);
			if (outputFormat) {
				this.output = new Output({
					format: outputFormat.format,
					target: new BufferTarget()
				});
			} else {
				console.warn(`No matching format found for "${formatName}", falling back to MP4`);
				this.output = new Output({
					format: new Mp4OutputFormat(),
					target: new BufferTarget()
				});
			}

			const canvasSource = new CanvasSource(this.canvas, {
				codec: outputFormat?.codec || 'av1',
				bitrate: QUALITY_MEDIUM
			});

			this.output.addVideoTrack(canvasSource);
			await this.output.start();
			this.isExporting = true;

			console.log(`Starting encoding: ${totalFrames} frames at ${frameRate} fps`);

			for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
				const timestamp = frameIndex / frameRate;
				await new Promise((resolve) => requestAnimationFrame(resolve));
				await canvasSource.add(timestamp, 1 / frameRate);
				this.exportProgress = this.mapRange(frameIndex, 0, totalFrames, 0, 100);
				this.instance.redraw();
				console.log(`Encoded frame ${frameIndex}/${totalFrames}`);
			}

			console.log('All frames encoded, closing video source...');
			canvasSource.close();

			console.log('Finalizing output...');
			await this.output.finalize();
			this.isExporting = false;
			this.instance.loop();

			console.log('Video finalized, downloading...');
			console.log(this.output.format.mimeType.split('/'));
			const blob = new Blob([this.output.target.buffer!], { type: this.output.format.mimeType });
			const fileName = title + '.' + this.output.format.mimeType.split('/')[1];
			this.downloadBlob(blob, fileName);
		} catch (error) {
			console.error('Error during video export:', error);
			this.isExporting = false;
			this.exportProgress = 0;
		}
	}

	async cancelVideoExport() {
		await this.output.cancel().then(() => {
			this.isExporting = false;
			this.exportProgress = 0;

			this.output = new Output({
				format: new Mp4OutputFormat(),
				target: new BufferTarget()
			});

			this.instance?.loop();
		});
	}

	async registerInstance(instance: p5, container: HTMLDivElement) {
		this.instance = instance;
		this.container = container;
		this.canvas = this.container.getElementsByTagName('canvas')[0];
		this.container.style.height = '100%';
		this.container.style.width = '100%';
	}

	private mapRange(
		x: number,
		inMin: number,
		inMax: number,
		outMin: number,
		outMax: number,
		clamp = true
	) {
		if (inMax === inMin) return outMin; // avoid divide-by-zero

		let t = (x - inMin) / (inMax - inMin); // normalize to 0..1 (maybe outside)

		if (clamp) t = Math.min(1, Math.max(0, t));

		return outMin + t * (outMax - outMin);
	}

	private downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		window.setTimeout(() => {
			link.remove();
			URL.revokeObjectURL(url);
		}, 1000);
	}
}

export type { Engine };

export function createEngine() {
	return new Engine();
}
