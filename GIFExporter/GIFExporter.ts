class GIFExporter{
    
    private _engine:BABYLON.Engine;
    private _delay:number;
    private _duration:number;

    constructor(engine: BABYLON.Engine, options ? : {
        delay:number,
        duration: number
    }){
        this._engine = engine;
        this._delay = options.delay;
        this._duration = options.duration;
    };

    stop(){};
    
    start(){};

    download(){};
}