import { EncodedImage } from './EncodedImage';
export class GIFGenerator {
	private _stream: EncodedImage = new EncodedImage();
	private _width: number;
	private _height: number;
	private encodedImage: EncodedImage = new EncodedImage();
	private _frameIndexedPixels: number[];
	private _frameCount: number = 0;
	private _GCT: string[];

	constructor(width: number, height: number, GCT: string[]) {
		this._width = width;
		this._height = height;
		this._GCT = GCT;
		console.log(`Generator now running...`);
	}

	init() {
		this.headerGenerator();
		this.LSDGenerator();
		this.GCTWriter();
		this.AppExtGenerator();
	}

	generateFrame(indexedPixels: number[]) {
		return new Promise((resolve, reject) => {
			this._frameIndexedPixels = indexedPixels;
			this._frameCount += 1;
			console.log(`generating frame ${this._frameCount}`);
			this.GCEGenerator();
			this.imgDescGenerator();
			this.imgDataGenerator().then(_ => resolve());
		});
	}

	download(filename: string) {
		this.TrailerGenerator();

		console.log('downloading');
		console.log(this._stream);

		const download = document.createElement('a');
		download.download = filename;
		download.href = URL.createObjectURL(
			new Blob([new Uint8Array(this._stream.get())], {
				type: 'image/gif'
			})
		);
		download.click();
	}

	getAnimatedGIFBlob() {
		this.TrailerGenerator();
		return new Blob([new Uint8Array(this._stream.get())], {
			type: 'image/gif'
		});
	}

	private headerGenerator() {
		this._stream.writeUTF('GIF89a'); /* GIF Header */
	}

	private LSDGenerator() {
		this._stream.writeLittleEndian(this._width); /* Canvas Width */
		this._stream.writeLittleEndian(this._height); /* Canvas Height */
		this._stream.write(0xf7); /* Packed Field */
		this._stream.write(0); /* Background Color Index */
		this._stream.write(0); /* Pixel Aspect Ration */
	}

	private GCTWriter() {
		let count = 0;

		this._GCT.forEach(color => {
			count += 3;
			this._stream.writeColor(color);
		});

		for (let i = count; i < 3 * 256; i++) {
			this._stream.write(0);
		}
	}

	private AppExtGenerator() {
		this._stream.write(0x21); /* extension introducer */
		this._stream.write(0xff); /* app extension label */
		this._stream.write(11); /* block size */
		this._stream.writeUTF('NETSCAPE2.0'); /* app id + auth code */
		this._stream.write(3); /* sub-block size */
		this._stream.write(1); /* loop sub-block id */
		this._stream.writeLittleEndian(
			0
		); /* loop count (extra iterations, 0=repeat forever) */
		this._stream.write(0); /* Block Terminator */
	}

	private GCEGenerator() {
		this._stream.write(0x21); /* Extension Introducer */
		this._stream.write(0xf9); /* Graphic Control Label */
		this._stream.write(0x4); /* Byte Size */
		this._stream.write(0x4); /* Packed Field */
		this._stream.writeLittleEndian(0x32); /* Delay Time */
		this._stream.write(0x0); /* Transparent Color Index */
		this._stream.write(0x0); /* Block Terminator */
	}

	private imgDescGenerator() {
		this._stream.write(0x2c); /* Image Seperator Always 2C */
		this._stream.writeLittleEndian(0x0); /* Image Left */
		this._stream.writeLittleEndian(0x0); /* Image Top */
		this._stream.writeLittleEndian(this._width); /* Image Width */
		this._stream.writeLittleEndian(this._height); /* Image Height */
		this._stream.write(0x0); /* Block Terminator */
	}

	private TrailerGenerator() {
		this._stream.write(0x3b); /* Trailer Marker */
		console.log(`Generator now finished.`);
	}

	private imgDataGenerator() {
		return new Promise((resolve, reject) => {});
	}

	private LCTGenerator() {}

	private PlainTextExtGenerator() {}

	private CommentExtGenerator() {}
}
