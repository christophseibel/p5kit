import { FFmpeg, type FSNode } from '@ffmpeg/ffmpeg';
import type p5 from 'p5';

function convertDataURLToBinary(dataURL: string) {
	const base64Index = dataURL.indexOf(';base64,') + ';base64,'.length;
	const base64 = dataURL.substring(base64Index);
	const raw = window.atob(base64);
	const rawLength = raw.length;
	let array = new Uint8Array(new ArrayBuffer(rawLength));
	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array;
}

const onFFmpegLog = ({ message }: { message: string }) => {
	console.log(message);
};

const onFFmpegProgress = ({ progress, time }: { progress: number; time: number }) => {
	console.log(progress, time);
};

export class VideoExporter {
	ffmpeg = new FFmpeg();
	frameWriteQueue: Promise<void> = Promise.resolve();
	FRAMES_DIR = '/frames';
	frameID = 0;

	async loadFFmpeg() {
		await this.ffmpeg.load();
		this.ffmpeg.on('log', onFFmpegLog);
		this.ffmpeg.on('progress', onFFmpegProgress);
		console.log(this.ffmpeg);

		await this.ffmpeg.createDir(this.FRAMES_DIR);
	}

	saveToFFmpeg(canvas: HTMLCanvasElement) {
		let dataURL = canvas.toDataURL('image/png');
		let pngData = convertDataURLToBinary(dataURL);

		const currentFrameId = this.frameID;
		this.frameID++;

		this.frameWriteQueue = this.frameWriteQueue
			.then(() => {
				console.log('saving frame!');
				this.ffmpegSaveFrame(currentFrameId, pngData);
			})
			.catch((error) => {
				console.error(`Failed to save frame ${currentFrameId}.`, error);
			});
	}

	async ffmpegSaveFrame(frameId: number, pngData: Uint8Array) {
		let fileName = frameId.toString().padStart(6, '0') + '.png';
		let filePath = `${this.FRAMES_DIR}/${fileName}`;
		await this.ffmpeg.writeFile(filePath, pngData);
	}
}
