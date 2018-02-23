module BABYLON {

    export class AbstractGradingAsset extends AbstractAssetTask{
        public name : string;
        public LOD : Array<>;
        public instances : Array<copyGradingAsset>;
        public clones : Array<copyGradingAsset>;
        public viewDistance : number;
        public loadDistance : number;
        public boundingBox : BoundingBox;

        constructor(name:string) {
            super(name)
        }


    }

    export class GradingGridZone {
        public grid: [number, number, number]; // columns, rows, depths
        public type : 'SQUARE' | 'CUBE';
        constructor() {

        }
    }

    export class GradingAssetsZone {
        public name: string;
        public position: Vector3;
        public radius: number;
        constructor() {

        }
    }

    export class meshGradingAsset extends AbstractGradingAsset {
        constructor(name:string) {
            super(name);
        }
    }

    export class soundGradingAsset extends AbstractGradingAsset {
        constructor(name:string) {
            super(name);
        }
    }

    export class animationGradingAsset extends AbstractGradingAsset {
        constructor(name:string) {
            super(name);
        }
    }

    export class textureGradingAsset extends AbstractGradingAsset {
        constructor(name:string) {
            super(name);
        }
    }

    export class scriptGradingAsset extends AbstractGradingAsset {
        constructor(name:string) {
            super(name);
        }
    }

}
