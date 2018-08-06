/* ----------------------------------------------NeuQuant START---------------------------------------------------------- */
/* NeuQuant Neural-Net Quantization Algorithm
 * ------------------------------------------
 *
 * Copyright (c) 1994 Anthony Dekker
 *
 * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994.
 * See "Kohonen neural networks for optimal colour quantization"
 * in "Network: Computation in Neural Systems" Vol. 5 (1994) pp 351-367.
 * for a discussion of the algorithm.
 * See also  http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
 *
 * Any party obtaining a copy of these files from the author, directly or
 * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
 * world-wide, paid up, royalty-free, nonexclusive right and license to deal
 * in this software and documentation files (the "Software"), including without
 * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons who receive
 * copies from any such party to do so, with the only requirement being
 * that this copyright notice remain intact.
 *
 * (JavaScript port 2012 by Johan Nordberg)
 */

function toInt(v) {
	return ~~v;
}

var ncycles = 100; // number of learning cycles
var netsize = 256; // number of colors used
var maxnetpos = netsize - 1;

// defs for freq and bias
var netbiasshift = 4; // bias for colour values
var intbiasshift = 16; // bias for fractions
var intbias = 1 << intbiasshift;
var gammashift = 10;
var gamma = 1 << gammashift;
var betashift = 10;
var beta = intbias >> betashift; /* beta = 1/1024 */
var betagamma = intbias << (gammashift - betashift);

// defs for decreasing radius factor
var initrad = netsize >> 3; // for 256 cols, radius starts
var radiusbiasshift = 6; // at 32.0 biased by 6 bits
var radiusbias = 1 << radiusbiasshift;
var initradius = initrad * radiusbias; //and decreases by a
var radiusdec = 30; // factor of 1/30 each cycle

// defs for decreasing alpha factor
var alphabiasshift = 10; // alpha starts at 1.0
var initalpha = 1 << alphabiasshift;
var alphadec; // biased by 10 bits

/* radbias and alpharadbias used for radpower calculation */
var radbiasshift = 8;
var radbias = 1 << radbiasshift;
var alpharadbshift = alphabiasshift + radbiasshift;
var alpharadbias = 1 << alpharadbshift;

// four primes near 500 - assume no image has a length so large that it is
// divisible by all four primes
var prime1 = 499;
var prime2 = 491;
var prime3 = 487;
var prime4 = 503;
var minpicturebytes = 3 * prime4;

/*
    Constructor: NeuQuant
  
    Arguments:
  
    pixels - array of pixels in RGB format
    samplefac - sampling factor 1 to 30 where lower is better quality
  
    >
    > pixels = [r, g, b, r, g, b, r, g, b, ..]
    >
  */
export default function NeuQuant(pixels, samplefac) {
	var network; // int[netsize][4]
	var netindex; // for network lookup - really 256

	// bias and freq arrays for learning
	var bias;
	var freq;
	var radpower;

	/*
      Private Method: init
  
      sets up arrays
    */
	function init() {
		network = [];
		netindex = [];
		bias = [];
		freq = [];
		radpower = [];

		var i, v;
		for (i = 0; i < netsize; i++) {
			v = (i << (netbiasshift + 8)) / netsize;
			network[i] = [v, v, v];
			freq[i] = intbias / netsize;
			bias[i] = 0;
		}
	}

	/*
      Private Method: unbiasnet
  
      unbiases network to give byte values 0..255 and record position i to prepare for sort
    */
	function unbiasnet() {
		for (var i = 0; i < netsize; i++) {
			network[i][0] >>= netbiasshift;
			network[i][1] >>= netbiasshift;
			network[i][2] >>= netbiasshift;
			network[i][3] = i; // record color number
		}
	}

	/*
      Private Method: altersingle
  
      moves neuron *i* towards biased (b,g,r) by factor *alpha*
    */
	function altersingle(alpha, i, b, g, r) {
		network[i][0] -= (alpha * (network[i][0] - b)) / initalpha;
		network[i][1] -= (alpha * (network[i][1] - g)) / initalpha;
		network[i][2] -= (alpha * (network[i][2] - r)) / initalpha;
	}

	/*
      Private Method: alterneigh
  
      moves neurons in *radius* around index *i* towards biased (b,g,r) by factor *alpha*
    */
	function alterneigh(radius, i, b, g, r) {
		var lo = Math.abs(i - radius);
		var hi = Math.min(i + radius, netsize);

		var j = i + 1;
		var k = i - 1;
		var m = 1;

		var p, a;
		while (j < hi || k > lo) {
			a = radpower[m++];

			if (j < hi) {
				p = network[j++];
				p[0] -= (a * (p[0] - b)) / alpharadbias;
				p[1] -= (a * (p[1] - g)) / alpharadbias;
				p[2] -= (a * (p[2] - r)) / alpharadbias;
			}

			if (k > lo) {
				p = network[k--];
				p[0] -= (a * (p[0] - b)) / alpharadbias;
				p[1] -= (a * (p[1] - g)) / alpharadbias;
				p[2] -= (a * (p[2] - r)) / alpharadbias;
			}
		}
	}

	/*
      Private Method: contest
  
      searches for biased BGR values
    */
	function contest(b, g, r) {
		/*
        finds closest neuron (min dist) and updates freq
        finds best neuron (min dist-bias) and returns position
        for frequently chosen neurons, freq[i] is high and bias[i] is negative
        bias[i] = gamma * ((1 / netsize) - freq[i])
      */

		var bestd = ~(1 << 31);
		var bestbiasd = bestd;
		var bestpos = -1;
		var bestbiaspos = bestpos;

		var i, n, dist, biasdist, betafreq;
		for (i = 0; i < netsize; i++) {
			n = network[i];

			dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
			if (dist < bestd) {
				bestd = dist;
				bestpos = i;
			}

			biasdist = dist - (bias[i] >> (intbiasshift - netbiasshift));
			if (biasdist < bestbiasd) {
				bestbiasd = biasdist;
				bestbiaspos = i;
			}

			betafreq = freq[i] >> betashift;
			freq[i] -= betafreq;
			bias[i] += betafreq << gammashift;
		}

		freq[bestpos] += beta;
		bias[bestpos] -= betagamma;

		return bestbiaspos;
	}

	/*
      Private Method: inxbuild
  
      sorts network and builds netindex[0..255]
    */
	function inxbuild() {
		var i,
			j,
			p,
			q,
			smallpos,
			smallval,
			previouscol = 0,
			startpos = 0;
		for (i = 0; i < netsize; i++) {
			p = network[i];
			smallpos = i;
			smallval = p[1]; // index on g
			// find smallest in i..netsize-1
			for (j = i + 1; j < netsize; j++) {
				q = network[j];
				if (q[1] < smallval) {
					// index on g
					smallpos = j;
					smallval = q[1]; // index on g
				}
			}
			q = network[smallpos];
			// swap p (i) and q (smallpos) entries
			if (i != smallpos) {
				j = q[0];
				q[0] = p[0];
				p[0] = j;
				j = q[1];
				q[1] = p[1];
				p[1] = j;
				j = q[2];
				q[2] = p[2];
				p[2] = j;
				j = q[3];
				q[3] = p[3];
				p[3] = j;
			}
			// smallval entry is now in position i

			if (smallval != previouscol) {
				netindex[previouscol] = (startpos + i) >> 1;
				for (j = previouscol + 1; j < smallval; j++) netindex[j] = i;
				previouscol = smallval;
				startpos = i;
			}
		}
		netindex[previouscol] = (startpos + maxnetpos) >> 1;
		for (j = previouscol + 1; j < 256; j++) netindex[j] = maxnetpos; // really 256
	}

	/*
      Private Method: inxsearch
  
      searches for BGR values 0..255 and returns a color index
    */
	function inxsearch(b, g, r) {
		var a, p, dist;

		var bestd = 1000; // biggest possible dist is 256*3
		var best = -1;

		var i = netindex[g]; // index on g
		var j = i - 1; // start at netindex[g] and work outwards

		while (i < netsize || j >= 0) {
			if (i < netsize) {
				p = network[i];
				dist = p[1] - g; // inx key
				if (dist >= bestd) i = netsize;
				// stop iter
				else {
					i++;
					if (dist < 0) dist = -dist;
					a = p[0] - b;
					if (a < 0) a = -a;
					dist += a;
					if (dist < bestd) {
						a = p[2] - r;
						if (a < 0) a = -a;
						dist += a;
						if (dist < bestd) {
							bestd = dist;
							best = p[3];
						}
					}
				}
			}
			if (j >= 0) {
				p = network[j];
				dist = g - p[1]; // inx key - reverse dif
				if (dist >= bestd) j = -1;
				// stop iter
				else {
					j--;
					if (dist < 0) dist = -dist;
					a = p[0] - b;
					if (a < 0) a = -a;
					dist += a;
					if (dist < bestd) {
						a = p[2] - r;
						if (a < 0) a = -a;
						dist += a;
						if (dist < bestd) {
							bestd = dist;
							best = p[3];
						}
					}
				}
			}
		}

		return best;
	}

	/*
      Private Method: learn
  
      "Main Learning Loop"
    */
	function learn() {
		var i;

		var lengthcount = pixels.length;
		var alphadec = toInt(30 + (samplefac - 1) / 3);
		var samplepixels = toInt(lengthcount / (3 * samplefac));
		var delta = toInt(samplepixels / ncycles);
		var alpha = initalpha;
		var radius = initradius;

		var rad = radius >> radiusbiasshift;

		if (rad <= 1) rad = 0;
		for (i = 0; i < rad; i++) radpower[i] = toInt(alpha * (((rad * rad - i * i) * radbias) / (rad * rad)));

		var step;
		if (lengthcount < minpicturebytes) {
			samplefac = 1;
			step = 3;
		} else if (lengthcount % prime1 !== 0) {
			step = 3 * prime1;
		} else if (lengthcount % prime2 !== 0) {
			step = 3 * prime2;
		} else if (lengthcount % prime3 !== 0) {
			step = 3 * prime3;
		} else {
			step = 3 * prime4;
		}

		var b, g, r, j;
		var pix = 0; // current pixel

		i = 0;
		while (i < samplepixels) {
			b = (pixels[pix] & 0xff) << netbiasshift;
			g = (pixels[pix + 1] & 0xff) << netbiasshift;
			r = (pixels[pix + 2] & 0xff) << netbiasshift;

			j = contest(b, g, r);

			altersingle(alpha, j, b, g, r);
			if (rad !== 0) alterneigh(rad, j, b, g, r); // alter neighbours

			pix += step;
			if (pix >= lengthcount) pix -= lengthcount;

			i++;

			if (delta === 0) delta = 1;
			if (i % delta === 0) {
				alpha -= alpha / alphadec;
				radius -= radius / radiusdec;
				rad = radius >> radiusbiasshift;

				if (rad <= 1) rad = 0;
				for (j = 0; j < rad; j++) radpower[j] = toInt(alpha * (((rad * rad - j * j) * radbias) / (rad * rad)));
			}
		}
	}

	/*
      Method: buildColormap
  
      1. initializes network
      2. trains it
      3. removes misconceptions
      4. builds colorindex
    */
	function buildColormap() {
		init();
		learn();
		unbiasnet();
		inxbuild();
	}
	this.buildColormap = buildColormap;

	/*
      Method: getColormap
  
      builds colormap from the index
  
      returns array in the format:
  
      >
      > [r, g, b, r, g, b, r, g, b, ..]
      >
    */
	function getColormap() {
		var map = [];
		var index = [];

		for (var i = 0; i < netsize; i++) index[network[i][3]] = i;

		var k = 0;
		for (var l = 0; l < netsize; l++) {
			var j = index[l];
			map[k++] = network[j][0];
			map[k++] = network[j][1];
			map[k++] = network[j][2];
		}
		return map;
	}
	this.getColormap = getColormap;

	/*
      Method: lookupRGB
  
      looks for the closest *r*, *g*, *b* color in the map and
      returns its index
    */
	this.lookupRGB = inxsearch;
}

/* ----------------------------------------------NeuQuant END---------------------------------------------------------- */

/* ----------------------------------------------ColorTableGen START---------------------------------------------------------- */

export class ColorTableGenerator {
	private _colorTable: number[] = [];
	private _GCT: string[] = [];
	private _neuQuant /* : NeuQuant */;
	private _distribution = 51;
	private _colorLookup: {
		[index: string]: number;
	} = {};

	constructor(frame: Uint8Array) {
		this._neuQuant = new NeuQuant(frame, 20);
		this._neuQuant.buildColormap();
		this._colorTable = this._neuQuant.getColormap();
	}

	public generate(): [{ [index: string]: number }, string[]] {
		let pixel: string = '';
		let count = 0;
		this._colorTable.forEach((value, index, array) => {
			pixel += this.pad(value);
			if ((index + 1) % 3 === 0) {
				this._GCT.push(pixel);
				this._colorLookup[pixel] = count;
				count++;
				pixel = '';
			}
			if (index === this._colorTable.length - 1) return [this._colorLookup, this._GCT];
		});
		return [this._colorLookup, this._GCT];
	}

	public lookupRGB(pixel: string): number {
		const R = parseInt(pixel.substr(0, 2), 16);
		const G = parseInt(pixel.substr(2, 2), 16);
		const B = parseInt(pixel.substr(4, 2), 16);
		const pixelIndex = this._neuQuant.lookupRGB(R, G, B);

		return pixelIndex as number;
	}

	private pad(color: number): string {
		if (color < 16) {
			return `0${color.toString(16)}`;
		} else {
			return color.toString(16);
		}
	}
}

/* ----------------------------------------------ColorTableGen END---------------------------------------------------------- */

/* ----------------------------------------------EncodedImage START---------------------------------------------------------- */

export class EncodedImage {
	data: number[] = [];

	constructor() {}

	public get(): number[] {
		return this.data;
	}

	public write(byte: number): void {
		this.data.push(byte);
	}

	public writeArray(array: number[], arraySize: number): void {
		for (let i = 0; i < arraySize; i++) {
			this.write(array[i]);
		}
	}

	public writeUTF(UTF: string): void {
		for (let i = 0; i < UTF.length; i++) {
			this.write(UTF.charCodeAt(i));
		}
	}

	public writeColor(color: string): void {
		for (let i = 0; i < color.length; i += 2) {
			const intValue: number = parseInt(color[i] + color[i + 1], 16);
			this.write(intValue);
		}
	}

	public writeLittleEndian(num: number): void {
		this.write(num & 0xff);
		this.write((num >> 8) & 0xff);
	}

	public reset() {
		this.data = [];
	}
}

/* ----------------------------------------------EncodedImage END---------------------------------------------------------- */

/* ----------------------------------------------TypedLZW START---------------------------------------------------------- */

/**
 * This class handles LZW encoding
 * Adapted from Jef Poskanzer's Java port by way of J. M. G. Elliott.
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @author Kevin Kwok (JavaScript version - https://github.com/antimatter15/jsgif)
 * @author Anthony Powell (TypeScript version 2018)
 * @version 0.1 AS3 implementation
 */

export class LZWEncoder {
	private readonly EOF = 1;

	// GIFCOMPR.C - GIF Image compression routines
	// Lempel-Ziv compression based on 'compress'. GIF modifications by
	// David Rowley (mgardi@watdcsu.waterloo.edu)
	// General DEFINEs

	private readonly BITS = 12;
	private readonly HSIZE = 5003;

	private _imgW: number;
	private _imgH: number;
	private _pixels: number[];
	private _initCodeSize: number;
	private _remaining: number;
	private _curPixel: number;

	// GIF Image compression - modified 'compress'
	// Based on: compress.c - File compression ala IEEE Computer, June 1984.
	// By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
	// Jim McKie (decvax!mcvax!jim)
	// Steve Davies (decvax!vax135!petsd!peora!srd)
	// Ken Turkowski (decvax!decwrl!turtlevax!ken)
	// James A. Woods (decvax!ihnp4!ames!jaw)
	// Joe Orost (decvax!vax135!petsd!joe)

	private _n_bits: number; // number of bits/code
	private _maxbits = this.BITS; // user settable max # bits/code
	private _maxcode: number; // maximum code, given n_bits
	private _maxmaxcode = 1 << this.BITS; // should NEVER generate this code
	private _htab: number[] = [];
	private _codetab: number[] = [];
	private _hsize = this.HSIZE; // for dynamic table sizing
	private _free_ent = 0; // first unused entry

	// block compression parameters -- after all codes are used up,
	// and compression rate changes, start over.

	private _clear_flg = false;

	// Algorithm: use open addressing double hashing (no chaining) on the
	// prefix code / next character combination. We do a variant of Knuth's
	// algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
	// secondary probe. Here, the modular division first probe is gives way
	// to a faster exclusive-or manipulation. Also do block compression with
	// an adaptive reset, whereby the code table is cleared when the compression
	// ratio decreases, but after the table fills. The variable-length output
	// codes are re-sized at this point, and a special CLEAR code is generated
	// for the decompressor. Late addition: construct the table according to
	// file size for noticeable speed improvement on small files. Please direct
	// questions about this implementation to ames!jaw.

	private _g_init_bits: number;
	private _ClearCode: number;
	private _EOFCode: number;

	// output
	// Output the given code.
	// Inputs:
	// code: A n_bits-bit integer. If == -1, then EOF. This assumes
	// that n_bits =< wordsize - 1.
	// Outputs:
	// Outputs code to the file.
	// Assumptions:
	// Chars are 8 bits long.
	// Algorithm:
	// Maintain a BITS character long buffer (so that 8 codes will
	// fit in it exactly). Use the VAX insv instruction to insert each
	// code in turn. When the buffer fills up empty it and start over.

	private _cur_accum = 0;
	private _cur_bits = 0;
	private _masks = [
		0x0000,
		0x0001,
		0x0003,
		0x0007,
		0x000f,
		0x001f,
		0x003f,
		0x007f,
		0x00ff,
		0x01ff,
		0x03ff,
		0x07ff,
		0x0fff,
		0x1fff,
		0x3fff,
		0x7fff,
		0xffff,
	];

	// Number of characters so far in this 'packet'
	private _a_count: number;

	// Define the storage for the packet accumulator
	private _accum: number[] = [];

	constructor(width: number, height: number, pixels: number[], colorDepth: number) {
		this._imgW = width;
		this._imgH = height;
		this._pixels = pixels;
		this._initCodeSize = Math.max(2, colorDepth);
	}

	// Add a character to the end of the current packet, and if it is 254
	// characters, flush the packet to disk.
	private writeCharToPacket(c: number, outs: EncodedImage): void {
		this._accum[this._a_count++] = c;
		if (this._a_count >= 254) this.flush_char(outs);
	}

	// Clear out the hash table
	// table clear for block compress

	private cl_block(outs: EncodedImage): void {
		this.cl_hash(this._hsize);
		this._free_ent = this._ClearCode + 2;
		this._clear_flg = true;
		this.output(this._ClearCode, outs);
	}

	// reset code table
	private cl_hash(hsize: number): void {
		for (let i = 0; i < hsize; ++i) this._htab[i] = -1;
	}

	private compress(init_bits: number, outs: EncodedImage) {
		let fcode;
		let i; /* = 0 */
		let c;
		let ent;
		let disp;
		let hsize_reg;
		let hshift;

		// Set up the globals: g_init_bits - initial number of bits
		this._g_init_bits = init_bits;

		// Set up the necessary values
		this._clear_flg = false;
		this._n_bits = this._g_init_bits;
		this._maxcode = this.MAXCODE(this._n_bits);

		this._ClearCode = 1 << (init_bits - 1);
		this._EOFCode = this._ClearCode + 1;
		this._free_ent = this._ClearCode + 2;

		this._a_count = 0; // clear packet

		ent = this.nextPixel();

		hshift = 0;
		for (fcode = this._hsize; fcode < 65536; fcode *= 2) ++hshift;
		hshift = 8 - hshift; // set hash code range bound

		hsize_reg = this._hsize;
		this.cl_hash(hsize_reg); // clear hash table

		this.output(this._ClearCode, outs);

		outer_loop: while ((c = this.nextPixel()) != this.EOF) {
			fcode = (c << this._maxbits) + ent;
			i = (c << hshift) ^ ent; // xor hashing

			if (this._htab[i] == fcode) {
				ent = this._codetab[i];
				continue;
			} else if (this._htab[i] >= 0) {
				// non-empty slot

				disp = hsize_reg - i; // secondary hash (after G. Knott)
				if (i === 0) disp = 1;

				do {
					if ((i -= disp) < 0) i += hsize_reg;

					if (this._htab[i] == fcode) {
						ent = this._codetab[i];
						continue outer_loop;
					}
				} while (this._htab[i] >= 0);
			}

			this.output(ent, outs);
			ent = c;
			if (this._free_ent < this._maxmaxcode) {
				this._codetab[i] = this._free_ent++; // code -> hashtable
				this._htab[i] = fcode;
			} else this.cl_block(outs);
		}

		// Put out the final code.
		this.output(ent, outs);
		this.output(this._EOFCode, outs);
	}

	// ----------------------------------------------------------------------------
	public encode(os: EncodedImage) {
		os.write(this._initCodeSize); // write "initial code size" byte
		this._remaining = this._imgW * this._imgH; // reset navigation variables
		this._curPixel = 0;
		this.compress(this._initCodeSize + 1, os); // compress and write the pixel data
		os.write(0); // write block terminator
	}

	// Flush the packet to disk, and reset the accumulator
	private flush_char(outs: EncodedImage) {
		if (this._a_count > 0) {
			outs.write(this._a_count);
			outs.writeArray(this._accum, this._a_count);
			this._a_count = 0;
		}
	}

	private MAXCODE(n_bits: number) {
		return (1 << n_bits) - 1;
	}

	// ----------------------------------------------------------------------------
	// Return the next pixel from the image
	// ----------------------------------------------------------------------------

	private nextPixel() {
		if (this._remaining === 0) return this.EOF;
		--this._remaining;
		let pix = this._pixels[this._curPixel++];
		return pix & 0xff;
	}

	private output(code: number, outs: EncodedImage) {
		this._cur_accum &= this._masks[this._cur_bits];

		if (this._cur_bits > 0) this._cur_accum |= code << this._cur_bits;
		else this._cur_accum = code;

		this._cur_bits += this._n_bits;

		while (this._cur_bits >= 8) {
			this.writeCharToPacket(this._cur_accum & 0xff, outs);
			this._cur_accum >>= 8;
			this._cur_bits -= 8;
		}

		// If the next entry is going to be too big for the code size,
		// then increase it, if possible.

		if (this._free_ent > this._maxcode || this._clear_flg) {
			if (this._clear_flg) {
				this._maxcode = this.MAXCODE((this._n_bits = this._g_init_bits));
				this._clear_flg = false;
			} else {
				++this._n_bits;
				if (this._n_bits == this._maxbits) this._maxcode = this._maxmaxcode;
				else this._maxcode = this.MAXCODE(this._n_bits);
			}
		}

		if (code == this._EOFCode) {
			// At EOF, write the rest of the buffer.
			while (this._cur_bits > 0) {
				this.writeCharToPacket(this._cur_accum & 0xff, outs);
				this._cur_accum >>= 8;
				this._cur_bits -= 8;
			}

			this.flush_char(outs);
		}
	}
}

/* ----------------------------------------------TypedLZW END---------------------------------------------------------- */

/* ----------------------------------------------GIFGen START---------------------------------------------------------- */

export class GIFGenerator {
	private stream: EncodedImage = new EncodedImage();
	private width: number;
	private height: number;
	private frameIndexedPixels: number[];
	private frameCount: number = 0;
	private GCT: string[];

	constructor() {
		console.log(`Generator now running...`);
	}

	public init(width: number, height: number, GCT: string[]): void {
		this.reset();
		this.width = width;
		this.height = height;
		this.GCT = GCT;
		this.writeHeader();
		this.writeLogicalScreenDescriptor();
		this.writeGlobalColorTable();
		this.writeApplicationExtension();
	}

	public generateFrame(indexedPixels: number[]): void {
		this.frameIndexedPixels = indexedPixels;
		this.frameCount += 1;
		console.log(`generating frame ${this.frameCount}`);
		this.writeGraphicControlExtension();
		this.writeImageDescriptor();
		this.writeImageData();
	}

	public getStream(): number[] {
		this.writeTrailer();
		return this.stream.get();
	}

	private writeHeader(): void {
		this.stream.writeUTF('GIF89a'); /* GIF Header */
	}

	private writeLogicalScreenDescriptor(): void {
		this.stream.writeLittleEndian(this.width); /* Canvas Width */
		this.stream.writeLittleEndian(this.height); /* Canvas Height */
		this.stream.write(0xf7); /* Packed Field */
		this.stream.write(0); /* Background Color Index */
		this.stream.write(0); /* Pixel Aspect Ration */
	}

	private writeGlobalColorTable(): void {
		let count = 0;

		this.GCT.forEach(color => {
			count += 3;
			this.stream.writeColor(color);
		});

		for (let i = count; i < 3 * 256; i++) {
			this.stream.write(0);
		}
	}

	private writeApplicationExtension(): void {
		this.stream.write(0x21); /* extension introducer */
		this.stream.write(0xff); /* app extension label */
		this.stream.write(11); /* block size */
		this.stream.writeUTF('NETSCAPE' + '2.0'); /* app id + auth code */
		this.stream.write(3); /* sub-block size */
		this.stream.write(1); /* loop sub-block id */
		this.stream.writeLittleEndian(0); /* loop count (extra iterations, 0=repeat forever) */
		this.stream.write(0); /* Block Terminator */
	}

	private writeGraphicControlExtension(): void {
		this.stream.write(0x21); /* Extension Introducer */
		this.stream.write(0xf9); /* Graphic Control Label */
		this.stream.write(0x4); /* Byte Size */
		this.stream.write(0x4); /* Packed Field */
		this.stream.writeLittleEndian(0x9); /* Delay Time */
		this.stream.write(0x0); /* Transparent Color Index */
		this.stream.write(0x0); /* Block Terminator */
	}

	private writeImageDescriptor(): void {
		this.stream.write(0x2c); /* Image Seperator Always 2C */
		this.stream.writeLittleEndian(0x0); /* Image Left */
		this.stream.writeLittleEndian(0x0); /* Image Top */
		this.stream.writeLittleEndian(this.width); /* Image Width */
		this.stream.writeLittleEndian(this.height); /* Image Height */
		this.stream.write(0x0); /* Block Terminator */
	}

	private async writeImageData(): Promise<void> {
		const encoder = new LZWEncoder(this.width, this.height, this.frameIndexedPixels, 8);
		encoder.encode(this.stream);
		console.log(`completed frame ${this.frameCount}`);
	}

	private writeTrailer(): void {
		this.stream.write(0x3b); /* Trailer Marker */
		console.log(`Generator now finished.`);
		this.frameCount = 0; /* Reset frame count for next GIF */
	}

	private writeLocalColorTable(): void {}

	private writePlainTextExtension(): void {}

	private writeCommentExtension(): void {}

	private reset() {
		this.stream.reset();
		this.frameCount = 0;
	}
}

/* ----------------------------------------------GIFGen END---------------------------------------------------------- */

/* ----------------------------------------------Worker Processing Duties START---------------------------------------------------------- */

const ctx: Worker = self as any;
let _colorTableGen: ColorTableGenerator;

const gifGenerator: GIFGenerator = new GIFGenerator();
const _frameCollection: Uint8Array[] = [];

function createColorTable(frame: Uint8Array, width: number, height: number): { [index: string]: number } {
	_colorTableGen = new ColorTableGenerator(frame);
	let colorLookup: { [index: string]: number }, colorTable: string[];
	[colorLookup, colorTable] = _colorTableGen.generate();
	writeColorTable(colorTable, width, height);
	return colorLookup;

	function writeColorTable(globalColorTable: string[], width: number, height: number): Promise<void> {
		gifGenerator.init(width, height, globalColorTable);
		return;
	}
}

function processFrames(
	frames: Uint8Array[],
	width: number,
	height: number
): {
	numericalRGBFrames: Uint8Array[];
	stringRGBFrames: string[][];
} {
	function process(): {
		numericalRGBFrames: Uint8Array[];
		stringRGBFrames: string[][];
	} {
		const numericalRGBFrames: Uint8Array[] = [];
		const stringRGBFrames: string[][] = [];
		frames.forEach(frame => {
			const { numericalRGBData, stringRGBData } = toRGB(frame);
			numericalRGBFrames.push(numericalRGBData);
			stringRGBFrames.push(stringRGBData);
		});
		return { numericalRGBFrames, stringRGBFrames };
	}
	function toRGB(frame: Uint8Array): { numericalRGBData: Uint8Array; stringRGBData: string[] } {
		const numericalRGBData = frame.filter((pixel: number, index: number) => (index + 1) % 4 !== 0);

		const stringRGBData: string[] = [];
		let pixel = '';
		numericalRGBData.forEach((color, index) => {
			pixel += pad(color);
			if ((index + 1) % 3 === 0) {
				stringRGBData.push(pixel);
				pixel = '';
			}
		});
		return { numericalRGBData, stringRGBData };
	}

	function pad(color: number): string {
		if (color < 16) {
			return `0${color.toString(16)}`;
		} else {
			return color.toString(16);
		}
	}
	return process();
}

function generateGIF(frames: string[][], colorLookup: { [index: string]: number }) {
	function mapPixelsToIndex(frames: string[][], colorLookup: { [index: string]: number }): number[][] {
		const indexedFrames: number[][] = [];
		frames.forEach((frame, index) => {
			const indexedPixels: number[] = [];
			frame.forEach(pixel => {
				indexedPixels.push(lookup(pixel));
			});
			indexedFrames.push(indexedPixels);
		});
		return indexedFrames;
	}

	function lookup(pixel: string) {
		return /* colorLookup[pixel] ? colorLookup[pixel] : */ _colorTableGen.lookupRGB(pixel);
	}
	const indexedFrames = mapPixelsToIndex(frames, colorLookup);

	indexedFrames.forEach(frame => {
		gifGenerator.generateFrame(frame);
	});
	return gifGenerator.getStream();
}

function collectFrames(frame: ArrayBuffer) {
	_frameCollection.push(new Uint8Array(frame));
}

function getColorSamplingFrames(frames: Uint8Array[]) {
	/* every 5 frames placed in sampling frames array */
	const samplingFrames = frames.filter((frame, index) => (index + 1) % 5 === 0);
	/* Combine arrays in samplingFrames into one Uint8Array */
	return samplingFrames.reduce((accFrame: Uint8Array, frame) => {
		const sampling = new Uint8Array(accFrame.length + frame.length);
		sampling.set(accFrame);
		sampling.set(frame, accFrame.length);

		return sampling;
	}, new Uint8Array([]));
}

/* ----------------------------------------------Worker Processing Duties END---------------------------------------------------------- */

/* ----------------------------------------------Worker Router START---------------------------------------------------------- */

onmessage = ({ data: { job, params } }) => {
	switch (job) {
		case 'createGIF':
			const { width, height } = params;
			const { numericalRGBFrames, stringRGBFrames } = processFrames(_frameCollection, width, height);
			const samplingFrame = getColorSamplingFrames(numericalRGBFrames);
			const colorLookup: { [index: string]: number } = createColorTable(samplingFrame, width, height);
			const gifData = generateGIF(stringRGBFrames, colorLookup);
			ctx.postMessage(gifData);
			break;
		case 'collectFrames':
			const { frame }: { frame: ArrayBuffer } = params;
			collectFrames(frame);
			break;
	}
};

/* ----------------------------------------------Worker Router END---------------------------------------------------------- */
