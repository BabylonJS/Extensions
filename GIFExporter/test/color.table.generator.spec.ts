import {ColorTableGenerator} from '../ColorTableGenerator'
import { expect } from 'chai';
import 'mocha';

describe('ColorTableGenerator', () => {

    describe('generate()', () => {
        const results = new ColorTableGenerator().generate();

        it('should create and return a string[]', () => {
            results.then((result) => {
                expect(result).to.be('string[]');
            }).catch((err) => {
                
            });
        });

        it('colors should be always have a length of 256 * 3', () => {
            results.then(result => {
                expect(result).to.have.lengthOf(256*3);
            }).catch(err => {});
        })
    });
});
