import { FFmpeg, type FSNode } from '@ffmpeg/ffmpeg';
import JSZip from 'jszip';

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

interface VideoFormatSettings {
	guiName: string;
	ext: string;
	mimeType: string;
	crf?: number; // inverse quality (constant rate factor)
	command: string;
}

const MP4: VideoFormatSettings = {
	guiName: 'MP4',
	ext: 'mp4',
	mimeType: 'video/mp4',
	crf: 21,
	command:
		'-y -nostdin -framerate FFMPEG_FPS -i /frames/%06d.png -c:v libx264 -threads 0 -pix_fmt yuv420p -crf FFMPEG_CRF -vf scale=FFMPEG_WIDTH:FFMPEG_HEIGHT:flags=lanczos -movflags +faststart FFMPEG_OUTPUTFILE'
};

const WEBM_TRANSPARENT: VideoFormatSettings = {
	guiName: 'WEBM',
	ext: 'webm',
	mimeType: 'video/webm',
	crf: 36,
	command:
		'-y -nostdin -framerate FFMPEG_FPS -i /frames/%06d.png -c:v libvpx-vp9 -threads 0 -pix_fmt yuva420p -lossless 1 -vf scale=FFMPEG_WIDTH:FFMPEG_HEIGHT:flags=lanczos FFMPEG_OUTPUTFILE'
};

const FRAME_SEQUENCE: VideoFormatSettings = {
	guiName: 'Frame sequence (PNG)',
	ext: 'zip',
	mimeType: 'application/zip',
	command: ''
};

const videoExportSettings = [MP4, WEBM_TRANSPARENT, FRAME_SEQUENCE];

export class VideoExporter {
	ffmpeg = new FFmpeg();
	frameWriteQueue: Promise<void> = Promise.resolve();
	static FRAMES_DIR = '/frames';
	frameID = 0;
	videoExportSettings = videoExportSettings[0];

	private exportDoneResolve: (() => void) | null = null;
	exportDone: Promise<void> = Promise.resolve();

	set videoFormat(name: string) {
		console.log(name);
		const match = videoExportSettings.find((s) => s.guiName === name);
		if (!match) throw new Error(`Unknown format: ${name}`);
		this.videoExportSettings = match;
	}

	abortController = new AbortController();
	exportProgress = $state(0);

	async loadFFmpeg() {
		await this.ffmpeg.load();
		this.ffmpeg.on('log', onFFmpegLog);
		this.ffmpeg.on('progress', ({ progress }) => {
			if (this.abortController.signal.aborted) return;

			this.exportProgress = mapRange(progress, 0, 1, 0, 100);
		});
		await this.ffmpeg.createDir(VideoExporter.FRAMES_DIR);
	}

	async prepareExport() {
		await this.exportDone;
	}

	saveToFFmpeg(canvas: HTMLCanvasElement) {
		let dataURL = canvas.toDataURL('image/png');
		let pngData = convertDataURLToBinary(dataURL);

		const currentFrameId = this.frameID;
		this.frameID++;

		this.frameWriteQueue = this.frameWriteQueue
			.then(() => {
				return this.ffmpegSaveFrame(currentFrameId, pngData);
			})
			.catch((error) => {
				console.error(`Failed to save frame ${currentFrameId}.`, error);
				throw error;
			});
	}

	async ffmpegSaveFrame(frameId: number, pngData: Uint8Array) {
		let fileName = frameId.toString().padStart(6, '0') + '.png';
		let filePath = `${VideoExporter.FRAMES_DIR}/${fileName}`;
		await this.ffmpeg.writeFile(filePath, pngData);
	}

	async clearFramesDirectory() {
		const instance = this.ffmpeg;

		const files: FSNode[] = await instance.listDir(VideoExporter.FRAMES_DIR);

		for (const item of files) {
			if (item.name === '.' || item.name === '..') continue;
			const filePath = `${VideoExporter.FRAMES_DIR}/${item.name}`;
			try {
				if (item.isDir) {
					await instance.deleteDir(filePath);
				} else {
					await instance.deleteFile(filePath);
				}
			} catch (cleanupError) {
				console.warn(`Failed to remove ${filePath}.`, cleanupError);
			}
		}
	}

	async ffmpegCreateVideo(width: number, height: number, fps: number, finalCallback?: () => void) {
		this.abortController = new AbortController();
		this.exportDone = new Promise((resolve) => {
			console.log('promise created!');
			this.exportDoneResolve = resolve;
		});
		this.exportProgress = 0;
		this.frameID = 0;
		await this.frameWriteQueue;
		console.log('Exporting video...');

		let fileName = 'video';
		const outputFile = fileName + '.' + this.videoExportSettings.ext;
		const outputPath = '/' + outputFile;

		try {
			if (this.videoExportSettings === FRAME_SEQUENCE) {
				const frames: FSNode[] = await this.ffmpeg.listDir(VideoExporter.FRAMES_DIR);
				const zip = new JSZip();

				for (const item of frames) {
					if (this.abortController.signal.aborted) return;
					if (!item.isDir && item.name.endsWith('.png')) {
						const filePath = `${VideoExporter.FRAMES_DIR}/${item.name}`;
						const data = await this.ffmpeg.readFile(filePath);
						zip.file(item.name, data as Uint8Array);
					}
				}
				if (this.abortController.signal.aborted) return;

				const content = await zip.generateAsync({ type: 'blob' });
				if (this.abortController.signal.aborted) return;
				this.downloadBlob(content, outputFile); // triggers browser download
				return;
			}

			// Replace placeholders in command string with actual values
			let cmd = this.videoExportSettings.command;
			cmd = cmd.replaceAll('FFMPEG_FPS', '' + fps);
			cmd = cmd.replaceAll('FFMPEG_CRF', '' + (this.videoExportSettings.crf || 21));
			cmd = cmd.replaceAll('FFMPEG_OUTPUTFILE', outputPath);
			cmd = cmd.replaceAll('FFMPEG_WIDTH', '' + width);
			cmd = cmd.replaceAll('FFMPEG_HEIGHT', '' + height);

			let args = cmd.split(' ');
			console.log('FFmpeg command:', args.join(' '));

			let execResult = await this.ffmpeg.exec(args, undefined, {
				signal: this.abortController.signal
			});
			// let execResult = await this.ffmpeg.exec(args, undefined);
			console.log('FFmpeg finished:', execResult);
			if (execResult !== 0) {
				throw new Error(`FFmpeg exited with code ${execResult}.`);
			}
			if (this.abortController.signal.aborted) return;

			const data = await this.ffmpeg.readFile(outputPath);
			const blob = new Blob([data as BlobPart], {
				type: this.videoExportSettings.mimeType
			});
			if (this.abortController.signal.aborted) return;
			this.downloadBlob(blob, outputFile);
		} catch (error) {
			console.error('Video export failed.', error);
			throw error;
		} finally {
			console.log(this.frameID, this.exportProgress);
			try {
				await this.clearFramesDirectory();
			} catch (cleanupError) {
				console.warn('Failed to clear /frames after export.', cleanupError);
			}

			this.exportDoneResolve?.();
			this.exportDoneResolve = null;
			finalCallback?.();
		}
	}

	abortExport() {
		this.abortController.abort();
		this.exportProgress = 0;
		this.frameID = 0;
	}

	downloadBlob(blob: Blob, filename: string) {
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

function mapRange(
	val: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
): number {
	return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
