module QI {
    export function decodeChannel(base64 : string) : Float32Array {
        var bStr = window.atob(base64);

        var len = bStr.length;
        var ret = new Float32Array(len / 2);
        var b1, b2, asShort, isNeg;
        for(var i = 0, j = 0; i < len; i += 2, j++) {
            b1 = bStr.charCodeAt(i);
            b2 = bStr.charCodeAt(i + 1);
            isNeg = b1 >> 7 === 1;
            b1 = b1 & 0x7F;
            asShort = 256 * b1 + b2;
            if (isNeg) asShort -= 0x8000;
            ret[j] = asShort / 0x7FFF;
        }
        return ret;
    }
}