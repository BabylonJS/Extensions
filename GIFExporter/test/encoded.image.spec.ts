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

        it('should push only one number onto data', () => {
            const length = data.length;
            results.write(24);
            expect(data.length).to.be.equal(length + 1);
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
        it('should convert rgb color string value into hex number i.e.(f444ff should add 244, 68, 255 to data)', 
        () => {
            results.writeColor('f444ff');
            expect(data.pop()).to.equal(255);
            expect(data.pop()).to.equal(68);
            expect(data.pop()).to.equal(244);
        });
        it('should only take strings of length 6', () => {
            const errFunc = () => { results.writeColor('00dd') };
            expect(errFunc).to.throw();
        });
        it('string argument should only consist of 0-9a-f', () => {
            const errFunc = () => { results.writeColor('0f0kmk')}
            expect(errFunc).to.throw();
        })
    });

    describe('writeLittleEndian()', () => {

        it('should convert number in little endian formate', () => {
            results.writeLittleEndian(756);
            expect(data.pop()).to.equal(2)
            expect(data.pop()).to.equal(244);
        })
        it('should add two number to data', () => {
            const length = data.length;
            results.writeLittleEndian(24);
            expect(data.length).to.be.equal(length + 2);   
        });
        it('if given is not above 256 trailing number should be 0', () => {
            results.writeLittleEndian(155);
            expect(data.pop()).to.equal(0)
            expect(data.pop()).to.equal(155);
        });
        
    });
});