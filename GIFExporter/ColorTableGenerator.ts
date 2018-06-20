export class ColorTableGenerator{

    private _colorTable: string[] = [];
    private _distribution = 51;
    private _colorLookup: {
        [index: string]: number
    } = {};

    generate(){
        return new Promise((resolve, reject) => {
            let count = 0;
            for (let red: number = 0; red < 256; red += this._distribution) {
                for (let green: number = 0; green < 256; green += this._distribution) {
                    for (let blue: number = 0; blue < 256; blue += this._distribution) {
        
                        const pixel = this.pad(red) + this.pad(green) + this.pad(blue);
        
                        this._colorTable.push(pixel);
        
                        this._colorLookup[pixel] = count;
        
                        count++;
                    }
                }
            }
            resolve({
                '_colorLookup': this._colorLookup, 
                '_colorTable': this._colorTable
            });
        })
        
    }

    private pad(color: number) {
        if (color < 16) {
            return `0${color.toString(16)}`;
        } else {
            return color.toString(16);
        }
    }
}