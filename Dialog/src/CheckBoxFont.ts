// File generated with Tower of Babel version: 2.0.0 on 03/24/15

module CheckBoxFont{

    var meshLib = new Array<Array<BABYLON.Mesh>>(4);
    var cloneCount = 1;

    var originalVerts = 0;
    var clonedVerts = 0;
    export class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        constructor(private _scene : BABYLON.Scene, materialsRootDir: string = "./") {
            CheckBoxFont.defineMaterials(_scene, materialsRootDir); //embedded version check
        }

        public getModuleName() : string { return "CheckBoxFont";}

        public instance(meshName : string, cloneSkeleton? : boolean) : BABYLON.Mesh {
            var ret:BABYLON.Mesh = null;
            var src:BABYLON.Mesh;
            switch (meshName){
                case "unchecked2D":
                    src = getViable(0);
                    if (src === null){
                        ret = new unchecked2D("unchecked2D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[0].push(ret);
                    }else{
                        ret = new unchecked2D("unchecked2D" + "_" + cloneCount++, this._scene, null, <unchecked2D> src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "checked2D":
                    src = getViable(1);
                    if (src === null){
                        ret = new checked2D("checked2D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[1].push(ret);
                    }else{
                        ret = new checked2D("checked2D" + "_" + cloneCount++, this._scene, null, <checked2D> src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "checked3D":
                    src = getViable(2);
                    if (src === null){
                        ret = new checked3D("checked3D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[2].push(ret);
                    }else{
                        ret = new checked3D("checked3D" + "_" + cloneCount++, this._scene, null, <checked3D> src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "unchecked3D":
                    src = getViable(3);
                    if (src === null){
                        ret = new unchecked3D("unchecked3D", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[3].push(ret);
                    }else{
                        ret = new unchecked3D("unchecked3D" + "_" + cloneCount++, this._scene, null, <unchecked3D> src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
            }
            if (ret !== null){
                if (cloneSkeleton && src && src.skeleton){
                    var skelName = src.skeleton.name + cloneCount;
                    ret.skeleton = src.skeleton.clone(skelName, skelName);
                }
            }
            else BABYLON.Tools.Error("Mesh not found: " + meshName);
            return ret;
        }
    }
    function getViable(libIdx : number, isNode? : boolean) : BABYLON.Mesh {
        var meshes = meshLib[libIdx];
        if (!meshes || meshes === null){
            if (!meshes) meshLib[libIdx] = new Array<BABYLON.Mesh>();
            return null;
        }

        for (var i = meshes.length - 1; i >= 0; i--){
            if (meshes[i].geometry || isNode) return meshes[i];
        }
        return null;
    }

    function clean(libIdx : number) : void {
        var meshes = meshLib[libIdx];
        if (!meshes  || meshes === null) return;

        var stillViable = false;
        for (var i = meshes.length - 1; i >= 0; i--){
            if (!meshes[i].geometry) meshes[i] = null;
            else stillViable = true;
        }
        if (!stillViable) meshLib[libIdx] = null;
    }

    export function getStats() : [number] { return [cloneCount, originalVerts, clonedVerts]; }


    var matLoaded = false;
    export function defineMaterials(scene : BABYLON.Scene, materialsRootDir : string = "./") : void {
        if (matLoaded) return;
        if (materialsRootDir.lastIndexOf("/") + 1  !== materialsRootDir.length) { materialsRootDir  += "/"; }
        var material : BABYLON.StandardMaterial;
        var texture : BABYLON.Texture;
        matLoaded = true;
    }

    export class unchecked2D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : unchecked2D) {
            super(name, scene, null, source, true);

            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;

            this.id = this.name;
            this.billboardMode  = 0;
            this.position.x  = 0;
            this.position.y  = 0;
            this.position.z  = 0;
            this.rotation.x  = 0;
            this.rotation.y  = 0;
            this.rotation.z  = 0;
            this.scaling.x   = 1;
            this.scaling.y   = 1;
            this.scaling.z   = 1;
            this.isVisible       = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
            if (!cloning){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.6,0,0,-0.05,0,0,-0.05,0.05,0,-0.6,0,0,-0.6,0.65,0,-0.65,0.65,0,-0.6,0.6,0,-0.05,0.6,0,-0.05,0.65,0,0,0,0,0,0.65,0,-0.05,0.65,0,-0.6,0.05,0,-0.65,0,0,-0.6,0.65,0,-0.05,0,0
                ],
                false);

                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
                ],
                false);

                this.setIndices([
                    0,1,2,3,4,5,6,7,8,9,10,11,12,0,2,13,3,5,14,6,8,15,9,11
                ]);

                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 16, 0, 24, this);
                this.computeWorldMatrix(true);
            }
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(0);
        }
    }

    export class checked2D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : checked2D) {
            super(name, scene, null, source, true);

            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;

            this.id = this.name;
            this.billboardMode  = 0;
            this.position.x  = 0;
            this.position.y  = 0;
            this.position.z  = 0;
            this.rotation.x  = 0;
            this.rotation.y  = 0;
            this.rotation.z  = 0;
            this.scaling.x   = 1;
            this.scaling.y   = 1;
            this.scaling.z   = 1;
            this.isVisible       = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
            if (!cloning){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.1305,0.1659,0,-0.4841,0.5195,0,-0.5195,0.4841,0,-0.4841,0.1305,0,-0.1305,0.4841,0,-0.1659,0.5195,0,-0.6,0,0,-0.05,0,0,-0.05,0.05,0,-0.6,0,0,-0.6,0.65,0,-0.65,0.65,0,-0.6,0.6,0,-0.05,0.6,0,-0.05,0.65,0,0,0,0,0,0.65,0,-0.05,0.65,0,-0.1659,0.1305,0,-0.5195,0.1659,0,-0.6,0.05,0,-0.65,0,0,-0.6,0.65,0,-0.05,0,0
                ],
                false);

                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
                ],
                false);

                this.setIndices([
                    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,0,2,19,3,5,20,6,8,21,9,11,22,12,14,23,15,17
                ]);

                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 24, 0, 36, this);
                this.computeWorldMatrix(true);
            }
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(1);
        }
    }

    export class checked3D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : checked3D) {
            super(name, scene, null, source, true);

            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;

            this.id = this.name;
            this.billboardMode  = 0;
            this.position.x  = 0;
            this.position.y  = 0;
            this.position.z  = 0;
            this.rotation.x  = 0;
            this.rotation.y  = 0;
            this.rotation.z  = 0;
            this.scaling.x   = 1;
            this.scaling.y   = 1;
            this.scaling.z   = 1;
            this.isVisible       = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
            if (!cloning){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.1305,0.1659,0,-0.4841,0.5195,0,-0.5195,0.4841,0,-0.1659,0.1305,0,-0.1659,0.1305,1,-0.4841,0.5195,1,-0.5195,0.4841,1,-0.4841,0.1305,0,-0.1305,0.4841,0,-0.1659,0.5195,0,-0.5195,0.1659,0,-0.5195,0.1659,1,-0.4841,0.1305,1,-0.1305,0.4841,1,-0.1659,0.5195,1,-0.6,0,0,-0.05,0,0,-0.05,0.05,0,-0.6,0.05,0,-0.6,0.05,1,-0.6,0,1,-0.05,0,1,-0.05,0.05,1,-0.6,0,0,-0.6,0.65,0,-0.65,0.65,0,-0.6,0,1,-0.65,0,0,-0.6,0.65,1,-0.65,0.65,1,-0.6,0.6,0,-0.05,0.6,0,-0.05,0.65,0,-0.6,0.6,1,-0.6,0.65,0,-0.05,0.65,1,0,0,0,0,0.65,0,-0.05,0.65,0,0,0,1,-0.05,0,0,0,0.65,1,-0.05,0.65,1,-0.1305,0.1659,1,-0.65,0,1,-0.6,0.65,1,-0.05,0.6,1,-0.05,0,1
                ],
                false);

                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0.8165,0,-0.5773,0,0.8165,-0.5773,-0.8165,0,-0.5773,0,-0.8165,-0.5773,0,-1,0,0,1,0,-1,0,0,0,-0.8165,-0.5773,0.8165,0,-0.5773,0,0.8165,-0.5773,-0.8165,0,-0.5773,-1,0,0,0,-1,0,1,0,0,0,1,0,-0.5773,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.5773,0.5773,-0.5773,-0.7071,0.7071,0,-0.7071,-0.7071,0,0.7071,-0.7071,0,0.7071,0.7071,0,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.7071,-0.7071,0,-0.5773,-0.5773,-0.5773,0.7071,0.7071,0,-0.7071,0.7071,0,-0.5773,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.7071,-0.7071,0,-0.5773,0.5773,-0.5773,0.7071,0.7071,0,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.7071,-0.7071,0,-0.5773,-0.5773,-0.5773,0.7071,0.7071,0,-0.7071,0.7071,0,1,0,0,-0.7071,-0.7071,0,-0.7071,0.7071,0,0.7071,-0.7071,0,-0.7071,-0.7071,0
                ],
                false);

                this.setIndices([
                    0,1,2,0,3,4,5,1,0,2,1,5,3,2,6,7,8,9,7,10,11,8,7,12,9,8,13,10,9,14,15,16,17,15,18,19,16,15,20,17,16,21,18,17,22,23,24,25,26,23,27,28,24,23,29,25,24,27,25,29,30,31,32,33,30,34,31,30,33,35,32,31,34,32,35,36,37,38,39,36,40,41,37,36,42,38,37,40,38,42,3,0,2,43,0,4,43,5,0,6,2,5,4,3,6,10,7,9,12,7,11,13,8,12,14,9,13,11,10,14,18,15,17,20,15,19,21,16,20,22,17,21,19,18,22,27,23,25,44,26,27,26,28,23,28,29,24,44,27,29,34,30,32,45,33,34,46,31,33,46,35,31,45,34,35,40,36,38,47,39,40,39,41,36,41,42,37,47,40,42
                ]);

                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 48, 0, 180, this);
                this.computeWorldMatrix(true);
            }
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(2);
        }
    }

    export class unchecked3D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : unchecked3D) {
            super(name, scene, null, source, true);

            CheckBoxFont.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;

            this.id = this.name;
            this.billboardMode  = 0;
            this.position.x  = 0;
            this.position.y  = 0;
            this.position.z  = 0;
            this.rotation.x  = 0;
            this.rotation.y  = 0;
            this.rotation.z  = 0;
            this.scaling.x   = 1;
            this.scaling.y   = 1;
            this.scaling.z   = 1;
            this.isVisible       = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
            if (!cloning){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    -0.6,0,0,-0.05,0,0,-0.05,0.05,0,-0.6,0.05,0,-0.6,0.05,1,-0.6,0,1,-0.05,0,1,-0.05,0.05,1,-0.6,0,0,-0.6,0.65,0,-0.65,0.65,0,-0.6,0,1,-0.65,0,0,-0.6,0.65,1,-0.65,0.65,1,-0.6,0.6,0,-0.05,0.6,0,-0.05,0.65,0,-0.6,0.6,1,-0.6,0.65,0,-0.05,0.65,1,0,0,0,0,0.65,0,-0.05,0.65,0,0,0,1,-0.05,0,0,0,0.65,1,-0.05,0.65,1,-0.65,0,1,-0.6,0.65,1,-0.05,0.6,1,-0.05,0,1
                ],
                false);

                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    -0.5773,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.5773,0.5773,-0.5773,-0.7071,0.7071,0,-0.7071,-0.7071,0,0.7071,-0.7071,0,0.7071,0.7071,0,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.7071,-0.7071,0,-0.5773,-0.5773,-0.5773,0.7071,0.7071,0,-0.7071,0.7071,0,-0.5773,-0.5773,-0.5773,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.7071,-0.7071,0,-0.5773,0.5773,-0.5773,0.7071,0.7071,0,0.5773,-0.5773,-0.5773,0.5773,0.5773,-0.5773,-0.5773,0.5773,-0.5773,0.7071,-0.7071,0,-0.5773,-0.5773,-0.5773,0.7071,0.7071,0,-0.7071,0.7071,0,-0.7071,-0.7071,0,-0.7071,0.7071,0,0.7071,-0.7071,0,-0.7071,-0.7071,0
                ],
                false);

                this.setIndices([
                    0,1,2,0,3,4,1,0,5,2,1,6,3,2,7,8,9,10,11,8,12,13,9,8,14,10,9,12,10,14,15,16,17,18,15,19,16,15,18,20,17,16,19,17,20,21,22,23,24,21,25,26,22,21,27,23,22,25,23,27,3,0,2,5,0,4,6,1,5,7,2,6,4,3,7,12,8,10,28,11,12,11,13,8,13,14,9,28,12,14,19,15,17,29,18,19,30,16,18,30,20,16,29,19,20,25,21,23,31,24,25,24,26,21,26,27,22,31,25,27
                ]);

                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 32, 0, 120, this);
                this.computeWorldMatrix(true);
            }
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(3);
        }
    }

}