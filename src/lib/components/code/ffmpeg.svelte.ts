import { FFmpeg, type FSNode } from '@ffmpeg/ffmpeg';
import type p5 from 'p5';

let ffmpeg: FFmpeg;
let frameID = 0;
let frameWriteQueue: Promise<void> = Promise.resolve();
const FRAMES_DIR = '/frames';

export async function loadFFmpeg() {
	ffmpeg = new FFmpeg();
	await ffmpeg.load();
	ffmpeg.on('log', onFFmpegLog);
	ffmpeg.on('progress', onFFmpegProgress);
	console.log(ffmpeg);

	await ffmpeg.createDir(FRAMES_DIR);
}

export function saveToFFmpeg(canvas: HTMLCanvasElement) {
	let dataURL = canvas.toDataURL('image/png');
	let pngData = convertDataURLToBinary(dataURL);

	const currentFrameId = frameID;
	frameID++;

	frameWriteQueue = frameWriteQueue
		.then(() => ffmpegSaveFrame(currentFrameId, pngData))
		.catch((error) => {
			console.error(`Failed to save frame ${currentFrameId}.`, error);
		});
}

async function ffmpegSaveFrame(frameId: number, pngData: Uint8Array) {
	let fileName = frameId.toString().padStart(6, '0') + '.png';
	let filePath = `${FRAMES_DIR}/${fileName}`;
	await ffmpeg.writeFile(filePath, pngData);
}

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
