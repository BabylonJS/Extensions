import { GIFGenerator } from '../src/GIFGenerator';
import { expect } from 'chai';
import 'mocha';

describe('GIFGenerator()', () => {
	const colorObj = ['ffffff00', '00000000', '0f0f0f00', 'f0f0f000'];
	// console.log(GCT);
	const width = 25;
	const height = 25;
	const gifGenerator = new GIFGenerator(width, height, colorObj);

	describe('constructor', () => {
		it('should set width, height and GCT', () => {
			// const results = () => {
			// 	gifGenerator.init();
			// 	gifGenerator.getAnimatedGIFBlob();
			// };
			gifGenerator.init();
			// expect(gifGenerator.getAnimatedGIFBlob()).to.contain(25);
			// expect(gifGenerator.init());
		});
	});
});
