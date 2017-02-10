module QI {
    export function decode16Bit(base64 : string) : Float32Array {
        var bStr = window.atob(base64);

        var len = bStr.length;
        var ret = new Float32Array(len / 2);
        for(var i = 0, j = 0; i < len; i += 2, j++) {
            ret[j] = decode16(bStr, i);
        }
        return ret;
    }
    // ======================================= str to num ========================================
    function decode16(bStr : string, offset : number) : number {
        var b1 = bStr.charCodeAt(offset);
        var b2 = bStr.charCodeAt(offset + 1);
        var isNeg = b1 >> 7 === 1;
        b1 = b1 & 0x7F;
        var asShort = 256 * b1 + b2;
        if (isNeg) asShort -= 0x8000;
        return asShort / 0x7FFF;
    }
/*    
    function decode8(bStr : string, offset : number) : number {
        var b = bStr.charCodeAt(offset);
        var isNeg = b >> 7 === 1;
        var asByte = b & 0x7F;
        if (isNeg) asByte *= -1;
        return asByte / 0x7F;
    }
*/
}