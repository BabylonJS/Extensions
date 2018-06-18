class GIFGenerator{
    private _width:number;
    private _height:number;
    private _colorTable: string[];

    constructor(width: number, height: number, globalColorTable: string[]){
        this._width = width;
        this._height = height;
        this._colorTable = globalColorTable;
    }

    init(){};

    generateFrame(indexedPicels: number[]){};

    download(filename: string){};

}