// File generated with Tower of Babel version: 2.2.0 on 05/15/15

module DigitParts{

    var meshLib = new Array<Array<BABYLON.Mesh>>(3);
    var cloneCount = 1;

    var originalVerts = 0;
    var clonedVerts = 0;
    export class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        constructor(private _scene : BABYLON.Scene, materialsRootDir: string = "./") {
            DigitParts.defineMaterials(_scene, materialsRootDir);
        }

        public getModuleName() : string { return "DigitParts";}

        public instance(meshName : string, cloneSkeleton? : boolean) : BABYLON.Mesh {
            var ret:BABYLON.Mesh = null;
            var src:BABYLON.Mesh;
            switch (meshName){
                case "Geometry":
                    src = getViable(0, true);
                    if (src === null){
                        ret = new Geometry("Geometry", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[0].push(ret);
                    }else{
                        ret = new Geometry("Geometry" + "_" + cloneCount++, this._scene, null, <Geometry> src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "Down":
                    src = getViable(1);
                    if (src === null){
                        ret = new Down("Down", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[1].push(ret);
                    }else{
                        ret = new Down("Down" + "_" + cloneCount++, this._scene, null, <Down> src);
                        clonedVerts += ret.getTotalVertices();
                    }
                    break;
                case "Up":
                    src = getViable(2);
                    if (src === null){
                        ret = new Up("Up", this._scene);
                        originalVerts += ret.getTotalVertices();
                        meshLib[2].push(ret);
                    }else{
                        ret = new Up("Up" + "_" + cloneCount++, this._scene, null, <Up> src);
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
    // to keep from checkReadyOnlyOnce = true, defineMaterials() must be explicitly called with neverCheckReadyOnlyOnce = true,
    // before any other functions in this module
    export function defineMaterials(scene : BABYLON.Scene, materialsRootDir : string = "./", neverCheckReadyOnlyOnce : boolean = false) : void {
        if (matLoaded) return;
        if (materialsRootDir.lastIndexOf("/") + 1  !== materialsRootDir.length) { materialsRootDir  += "/"; }
        var material : BABYLON.StandardMaterial;
        var texture : BABYLON.Texture;
        material = new BABYLON.StandardMaterial("DigitParts.border", scene);
        material.ambientColor  = new BABYLON.Color3(0.0574,0.8,0.0876);
        material.diffuseColor  = new BABYLON.Color3(0.0459,0.64,0.0701);
        material.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
        material.emissiveColor = new BABYLON.Color3(0,0,0);
        material.specularPower = 50;
        material.alpha =  1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        material = new BABYLON.StandardMaterial("DigitParts.border.001", scene);
        material.ambientColor  = new BABYLON.Color3(0.0574,0.8,0.0876);
        material.diffuseColor  = new BABYLON.Color3(0.0459,0.64,0.0701);
        material.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
        material.emissiveColor = new BABYLON.Color3(0,0,0);
        material.specularPower = 50;
        material.alpha =  1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        material = new BABYLON.StandardMaterial("DigitParts.face", scene);
        material.ambientColor  = new BABYLON.Color3(0.8,0.1603,0.7314);
        material.diffuseColor  = new BABYLON.Color3(0.64,0.1283,0.5851);
        material.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
        material.emissiveColor = new BABYLON.Color3(0,0,0);
        material.specularPower = 50;
        material.alpha =  1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        material = new BABYLON.StandardMaterial("DigitParts.face.001", scene);
        material.ambientColor  = new BABYLON.Color3(0.8,0.1603,0.7314);
        material.diffuseColor  = new BABYLON.Color3(0.64,0.1283,0.5851);
        material.specularColor = new BABYLON.Color3(0.5,0.5,0.5);
        material.emissiveColor = new BABYLON.Color3(0,0,0);
        material.specularPower = 50;
        material.alpha =  1;
        material.backFaceCulling = true;
        material.checkReadyOnlyOnce = !neverCheckReadyOnlyOnce;
        defineMultiMaterials(scene);
        matLoaded = true;
    }

    export function defineMultiMaterials(scene : BABYLON.Scene) : void {
        var multiMaterial : BABYLON.MultiMaterial;
        multiMaterial = new BABYLON.MultiMaterial("DigitParts.Multimaterial#0", scene);
        multiMaterial.id = "DigitParts.Multimaterial#0";
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.border"));
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.face"));
        multiMaterial = new BABYLON.MultiMaterial("DigitParts.Multimaterial#1", scene);
        multiMaterial.id = "DigitParts.Multimaterial#1";
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.border.001"));
        multiMaterial.subMaterials.push(scene.getMaterialByID("DigitParts.face.001"));
    }

    export class Geometry extends BABYLON.Mesh {
        public botLeft : BABYLON.Mesh;
        public topLeft : BABYLON.Mesh;
        public top : BABYLON.Mesh;
        public topRite : BABYLON.Mesh;
        public botRite : BABYLON.Mesh;
        public bottom : BABYLON.Mesh;
        public dot : BABYLON.Mesh;
        public center : BABYLON.Mesh;
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : Geometry) {
            super(name, scene, null, source, true);

            DigitParts.defineMaterials(scene, materialsRootDir); //embedded version check
            var cloning = source && source !== null;
            this.botLeft = cloning ? child_botLeft(scene, this, source.botLeft) : child_botLeft(scene, this);
            this.topLeft = cloning ? child_topLeft(scene, this, source.topLeft) : child_topLeft(scene, this);
            this.top = cloning ? child_top(scene, this, source.top) : child_top(scene, this);
            this.topRite = cloning ? child_topRite(scene, this, source.topRite) : child_topRite(scene, this);
            this.botRite = cloning ? child_botRite(scene, this, source.botRite) : child_botRite(scene, this);
            this.bottom = cloning ? child_bottom(scene, this, source.bottom) : child_bottom(scene, this);
            this.dot = cloning ? child_dot(scene, this, source.dot) : child_dot(scene, this);
            this.center = cloning ? child_center(scene, this, source.center) : child_center(scene, this);

            this.id = this.name;
            this.billboardMode  = 0;
            this.position.x  = 0;
            this.position.y  = 0;
            this.position.z  = 0;
            this.rotation.x  = 0;
            this.rotation.y  = 0;
            this.rotation.z  = 0;
            this.scaling.x   = 1;
            this.scaling.y   = 0.9523;
            this.scaling.z   = 1;
            this.isVisible       = false;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(0);
        }
    }

    function child_botLeft(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".botLeft", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0;
        ret.position.y  = 0;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.12,0.12,0,0.12,0.46,0,0,0.46,0,0,0.12,0,0,0,0,0.12,0.12,0,0,0.5196,0,0,0.46,0,0.1198,0.46,0,0,0.12,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,7,8,9,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_topLeft(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".topLeft", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0;
        ret.position.y  = 0.5396;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0,0.0596,0,0.12,0.0596,0,0.12,0.3996,0,0,0.3996,0,0.12,0.3996,0,0,0.5196,0,0,0,0,0.1198,0.0596,0,0,0.0596,0,0,0.3996,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,7,8,9,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_top(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".top", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0.03;
        ret.position.y  = 1.0579;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.42,0,0,0.12,0,0,0.12,-0.12,0,0.42,0,0,0.42,-0.12,0,0.54,0,0,0.12,0,0,0,0,0,0.12,-0.12,0,0.42,-0.12,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,7,8,9,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_topRite(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".topRite", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0.6;
        ret.position.y  = 0.5396;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                -0.12,0.3996,0,-0.12,0.0596,0,0,0.0596,0,0,0.3996,0,0,0.5196,0,-0.12,0.3996,0,0,0,0,0,0.0596,0,-0.1198,0.0596,0,0,0.3996,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,7,8,9,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_botRite(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".botRite", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0.6;
        ret.position.y  = 0.5196;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0,-0.0596,0,-0.12,-0.0596,0,-0.12,-0.3996,0,0,-0.3996,0,-0.12,-0.3996,0,0,-0.5196,0,0,0,0,-0.1198,-0.0596,0,0,-0.0596,0,0,-0.3996,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,7,8,9,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_bottom(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".bottom", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0.03;
        ret.position.y  = 0;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.12,0.12,0,0.12,0,0,0.42,0,0,0.12,0,0,0.12,0.12,0,0,0,0,0.42,0,0,0.54,0,0,0.42,0.12,0,0.42,0.12,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,7,8,9,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 10, 0, 12, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_dot(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".dot", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0.64;
        ret.position.y  = -0.0004;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                0.12,0,0,0.12,0.12,0,0,0.12,0,0,0,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,0,2
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 4, 0, 6, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    function child_center(scene : BABYLON.Scene, parent : any, source? : any) : BABYLON.Mesh {
        var ret = new BABYLON.Mesh(parent.name + ".center", scene, parent, source);
        var cloning = source && source !== null;

        ret.id = ret.name;
        ret.billboardMode  = 0;
        ret.position.x  = 0.3;
        ret.position.y  = 0.5296;
        ret.position.z  = 0;
        ret.rotation.x  = 0;
        ret.rotation.y  = 0;
        ret.rotation.z  = 0;
        ret.scaling.x   = 1;
        ret.scaling.y   = 1;
        ret.scaling.z   = 1;
        ret.isVisible       = true;
        ret.setEnabled(true);
        ret.checkCollisions = false;
        ret.receiveShadows  = false;
        ret["castShadows"]  = false; // typescript safe
        if (!cloning){
            ret.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                -0.1451,-0.06,0,-0.1451,0.06,0,-0.27,-0.0004,0,-0.0289,-0.06,0,0.1449,-0.06,0,-0.0289,0.06,0,0.1449,0.06,0,0.27,0,0
            ],
            false);

            ret.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
            ],
            false);

            ret.setIndices([
                0,1,2,3,4,5,6,4,7,1,0,3,4,6,5,5,1,3
            ]);

            ret.subMeshes = [];
            new BABYLON.SubMesh(0, 0, 8, 0, 18, ret);
            ret.computeWorldMatrix(true);
        }
        return ret;
    }

    export class Down extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : Down) {
            super(name, scene, null, source, true);

            DigitParts.defineMaterials(scene, materialsRootDir); //embedded version check
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
            this.scaling.y   = 0.9523;
            this.scaling.z   = 1;
            this.isVisible       = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
            if (!cloning){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    0,-0.0034,0,0.0024,-0.0017,0,0,0,0,0.8105,-0.6441,0.02,0.8105,0.6359,0.02,-0.0866,-0.0021,0.02,-0.0895,-0.0041,0.02,-0.0895,0,0.02,0.75,-0.5368,0,0.75,0.5299,0,0.0024,-0.0017,0
                ],
                false);

                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
                ],
                false);

                this.setIndices([
                    0,1,2,3,4,5,6,5,7,8,9,10
                ]);

                this.setMaterialByID("DigitParts.Multimaterial#0");
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 8, 0, 9, this);
                new BABYLON.SubMesh(1, 8, 3, 9, 3, this);
                this.computeWorldMatrix(true);
            }
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(1);
        }
    }

    export class Up extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir: string = "./", source? : Up) {
            super(name, scene, null, source, true);

            DigitParts.defineMaterials(scene, materialsRootDir); //embedded version check
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
            this.scaling.y   = 0.9523;
            this.scaling.z   = 1;
            this.isVisible       = true;
            this.setEnabled(true);
            this.checkCollisions = false;
            this.receiveShadows  = false;
            this["castShadows"]  = false; // typescript safe
            if (!cloning){
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, [
                    0,0.0034,0,-0.0024,0.0017,0,0,0,0,-0.8105,0.6441,0.02,-0.8105,-0.6359,0.02,0.0866,0.0021,0.02,0.0895,0.0041,0.02,0.0895,0,0.02,-0.75,0.5368,0,-0.75,-0.5299,0,-0.0024,0.0017,0
                ],
                false);

                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, [
                    0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1
                ],
                false);

                this.setIndices([
                    0,1,2,3,4,5,6,5,7,8,9,10
                ]);

                this.setMaterialByID("DigitParts.Multimaterial#1");
                this.subMeshes = [];
                new BABYLON.SubMesh(0, 0, 8, 0, 9, this);
                new BABYLON.SubMesh(1, 8, 3, 9, 3, this);
                this.computeWorldMatrix(true);
            }
        }

        public dispose(doNotRecurse?: boolean): void {
            super.dispose(doNotRecurse);
            clean(2);
        }
    }

}