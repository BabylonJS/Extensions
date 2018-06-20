import { EncodedImage } from '../EncodedImage'
import { expect } from 'chai';
import 'mocha';

describe('EncodedImage', () => {
    const results = new EncodedImage();
    const data = results.data;
    describe('get()', () => {

        it('should return data property', () => {
            expect(results.get()).to.equal(data);
        });
        it('data should be of an array', () => {
            expect(data).to.be.a('array');
        });
        it('data should only contain numbers', () => {
            data.forEach(result => {
                expect(result).to.be.a('number');
            });
        });

    });

    describe('write()', () => {
        /* 
        * ? typescript catches this error should test still be written
        */
        /* it('should only accept a number as an arg', () => {
            expect(results.write('string')).to.throw();
        }); */

        // it('should only add one number to the data property', () => {
        //     expect(results.write(2)).to.increase(data, "length");
        // })

        it('should ', () => {
            
        });

    });

    describe('writeArray()', () => {
        it('should take 2 and only 2 arguments', () => {
            // expect(results.writeArray([1], 1)).to
        });
    });

    describe('writeUTF()', () => {
        it('should only take a string as an argument', () => {
            
        });
    });

    describe('writeColor()', () => {
        it('should only take a string  as a argument', () => {
            
        });
    });

    describe('writeLittleEndian()', () => {
        /* it('should only take a number as a argument', () => {
            expect(results.writeLittleEndian('string')).to.throw();
        }); */
        it('should convert number in little endian formate', () => {
            results.writeLittleEndian(245);
            expect(data.pop()).to.equal(0)
            expect(data.pop()).to.equal(245);
        })
        it('should add two number to data', () => {
            const oldData = data;
            results.writeLittleEndian(456);
            expect(results.writeLittleEndian(456)).to.increase(data, 'length').by(2);   
        });
        it('should write least sig byte first', () => {
            
        });
        it('if given is not above 256 trailing number should be 00', () => {

        });
        
    });
});