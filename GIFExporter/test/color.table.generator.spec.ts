// import { ColorTableGenerator } from '../ColorGenerator';
import { expect } from 'chai';
import 'mocha';

describe('ColorTableGenerator', () => {
	describe('generate()', () => {
		const results = new ColorTableGenerator().generate();

		it('should create and return a string[]', () => {
			expect(results).to.be('string[]');
		});

		it('colors should be always have a length of 256', () => {
			expect(results).to.have.lengthOf(256);
		});
	});
});
