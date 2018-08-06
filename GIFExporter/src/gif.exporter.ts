export default class GIFExporter {
	private _canvas: HTMLCanvasElement;
	private _delay: number;
	private _duration: number;
	private _width: number;
	private _height: number;
	private _worker: Worker;
	private _holdingCanvas: HTMLCanvasElement;
	private _holdingCanvas2D: CanvasRenderingContext2D;
	private _resizeCanvas: HTMLCanvasElement;
	private _resizeCanvas2D: CanvasRenderingContext2D;

	constructor(engine: BABYLON.Engine, options?: { delay?: number; duration?: number }) {
		this._canvas = engine.getRenderingCanvas();
		this._delay = options.delay;
		this._duration = options.duration;
	}

	public start(): Promise<number[]> {
		return new Promise(async (resolve, reject) => {
			this.init();
			console.log('record canvas');
			let intervalRef = setInterval(async () => {
				const frame = await this.getFrame();
				const newFrame = await this.flipAndRotate(new Uint8Array(frame));
				console.log('newFrame', newFrame);

				const message = {
					job: 'collectFrames',
					params: {
						frame: newFrame,
					},
				};
				this._worker.postMessage(message, [message.params.frame]);
			}, this._delay);
			setTimeout(() => {
				clearInterval(intervalRef);
				const message = {
					job: 'createGIF',
					params: { width: this._resizeCanvas.width, height: this._resizeCanvas.height },
				};
				this._worker.postMessage(message);
				this._worker.onmessage = ({ data }) => {
					console.log('complete', data);
					resolve(data);
				};
			}, this._duration);
		});
	}

	public stop(): void {}

	public cancel(): void {}

	public download(filename = 'canvasGIF.gif'): Promise<{}> {
		return new Promise(async (resolve, reject) => {
			const gif = await this.start();
			const url = URL.createObjectURL(
				new Blob([new Uint8Array(gif)], {
					type: 'image/gif',
				})
			);
			const download: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
			document.body.appendChild(download);
			download.target = '_blank';
			download.style.display = 'none';
			download.href = url;
			download.download = filename;
			download.click();
			download.remove();
			this._worker.terminate();

			resolve();
		});
	}

	private getFrame(): Promise<ArrayBuffer> {
		return new Promise(async (resolve, reject) => {
			const gl = this._canvas.getContext('webgl2') || this._canvas.getContext('webgl');
			let pixels = new Uint8Array(this._width * this._height * 4);
			gl.readPixels(0, 0, this._width, this._height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

			resolve(pixels.buffer);
		});
	}

	private init() {
		this._width = this._canvas.width;
		this._height = this._canvas.height;
		this._worker = new Worker('gif.creator.service.js');
		this.canvasSetup();
	}

	private canvasSetup() {
		this._holdingCanvas = document.createElement('canvas');
		this._holdingCanvas2D = this._holdingCanvas.getContext('2d');
		this._holdingCanvas.width = this._width;
		this._holdingCanvas.height = this._height;
		this._resizeCanvas = document.createElement('canvas');
		this._resizeCanvas2D = this._resizeCanvas.getContext('2d');
	}

	private flipAndRotate(frame: Uint8Array): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const imageData = this._holdingCanvas2D.createImageData(this._width, this._height);
			imageData.data.set(frame);
			this._holdingCanvas2D.putImageData(imageData, 0, 0);
			this.resize(this._resizeCanvas);
			this.flip(this._resizeCanvas2D, this._holdingCanvas, this._resizeCanvas);
			const data = this._resizeCanvas2D.getImageData(0, 0, this._resizeCanvas.width, this._resizeCanvas.height).data;

			resolve(data.buffer);
		});
	}

	private resize(canvas: HTMLCanvasElement) {
		return new Promise((resolve, rejct) => {
			const baseSize = 256;
			const imageAspectRatio = this._width / this._height;
			if (imageAspectRatio < 1) {
				canvas.width = baseSize * imageAspectRatio;
				canvas.height = baseSize;
			} else if (imageAspectRatio > 1) {
				canvas.width = baseSize;
				canvas.height = baseSize / imageAspectRatio;
			} else {
				canvas.width = baseSize;
				canvas.height = baseSize;
			}

			canvas.width = Math.max(canvas.width, 1);
			canvas.height = Math.max(canvas.height, 1);

			resolve();
		});
	}

	private flip(resizeContext: CanvasRenderingContext2D, holdingCanvas: HTMLCanvasElement, resizeCanvas: HTMLCanvasElement) {
		return new Promise((resolve, reject) => {
			// Scale and draw to flip Y to reorient readPixels.
			resizeContext.globalCompositeOperation = 'copy';
			resizeContext.scale(1, -1); // Y flip
			resizeContext.translate(0, -resizeCanvas.height); // so we can draw at 0,0
			resizeContext.drawImage(holdingCanvas, 0, 0, this._width, this._height, 0, 0, resizeCanvas.width, resizeCanvas.height);
			resizeContext.setTransform(1, 0, 0, 1, 0, 0);
			resizeContext.globalCompositeOperation = 'source-over';
		});
	}
}
