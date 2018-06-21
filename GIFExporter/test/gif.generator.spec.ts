import { GIFGenerator } from './../GIFGenerator';
import { expect } from 'chai';
import 'mocha';

describe('GIFGenerator()', () => {
	const GCT = Array.apply(null, Array(256 * 3)).map(
		Number.prototype.valueOf,
		0
	);
	const width = 25;
	const height = 25;
	const gifGenerator = new GIFGenerator(width, height, GCT);

	describe('constructor', () => {
		it('should set width, height and GCT', () => {
			// expect(gifGenerator.init()).to.contain(GCT);
		});
	});
});
