import { Camera, Color3, Color4, IndicesArray, Mesh, MeshBuilder, Quaternion, Scene, SolidParticleSystem, Tools, Vector2, Vector3, VertexBuffer, VertexData } from "@babylonjs/core";

module BABYLON {
    export class DynamicTerrain {

        public name: string;

        private _terrainSub: number;                    // terrain number of subdivisions per axis
        private _mapData: number[] | Float32Array;      // data of the map
        private _terrainIdx: number;                    // actual terrain vertex number per axis
        private _mapSubX: number;                       // map number of subdivisions on X axis
        private _mapSubZ: number;                       // map number of subdivisions on Z axis
        private _mapUVs: number[] | Float32Array;       // UV data of SPmapDatahe map
        private _mapColors: number[] | Float32Array;    // Color data of the map
        private _mapNormals: number[] | Float32Array;   // Normal data of the map
        private _SPmapData: number[][] | Float32Array[];      // Solid particle data (position, rotation, scaling) of the object map : array of arrays, one per particle type
        private _SPcolorData: number[][] | Float32Array[];    // Solid particle color data : array of arrays, one per particle type
        private _SPuvData: number[][] | Float32Array[];       // Solid particle uv data : array of arrays, one per particle type
        private _sps: SolidParticleSystem;              // SPS used to manage the particles
        private _spsTypeStartIndexes: number[];         // type start indexes in the SPS
        private _nbAvailableParticlesPerType: number[]; // per type of used particle counter
        private _spsNbPerType: number[];                // number of particles available per type in the SPS
        private _particleDataStride: number = 9;        // data stride : position, rotation, scaling : 9 floats
        private _particleColorStride: number = 4;       // color stride : color4 : r, g, b, a : 4 floats
        private _particleUVStride: number = 4;          // uv stride : vector4 : x, y, z, w : 4 floats
        private _instanceMapData: number[][] | Float32Array[];   // Instance data (position, rotation, scaling) of the object map : array of arrays, one per instance type
        private _instanceColorData: number[][] | Float32Array[]; // Instance color data : array of arrays, one per instance type
        private _nbAvailableInstancesPerType: number[]; // per type of used instance counter
        private _sourceMeshes: Mesh[];                  // Source meshes used to hold the instances
        private _typeSPS: number = 0;                   // Constant to define the SPS in the mapQuads
        private _typeInstance: number = 1;              // Constant to define the SPS in the mapQuads
        private _scene: Scene;                          // current scene
        private _subToleranceX: number = 1 | 0;           // how many cells flought over thy the camera on the terrain x axis before update
        private _subToleranceZ: number = 1 | 0;           // how many cells flought over thy the camera on the terrain z axis before update
        private _LODLimits: number[] = [];              // array of LOD limits
        private _initialLOD: number = 1 | 0;              // initial LOD value (integer > 0)
        private _LODValue: number = 1 | 0;                // current LOD value : initial + camera correction
        private _cameraLODCorrection: number = 0 | 0;     // LOD correction (integer) according to the camera altitude
        private _LODPositiveX: boolean = true;          // Does LOD apply to the terrain right edge ?
        private _LODNegativeX: boolean = true;          // Does LOD apply to the terrain left edge ?
        private _LODPositiveZ: boolean = true;          // Does LOD apply to the terrain upper edge ?
        private _LODNegativeZ: boolean = true;          // Does LOD apply to the terrain lower edge ?
        private _terrainCamera: Camera;                 // camera linked to the terrain
        private _inverted: boolean = false;             // is the terrain mesh inverted upside down ?
        public shiftFromCamera: { x: number; z: number } = {  // terrain center shift from camera position
            x: 0.0,
            z: 0.0
        };
        private _indices: IndicesArray | null;
        private _positions: Float32Array | number[] | null;
        private _normals: Float32Array | number[] | null;
        private _colors: Float32Array | number[] | null;
        private _uvs: Float32Array | number[] | null;
        private _deltaSubX: number = 0 | 0;                   // map x subdivision delta : variation in number of map subdivisions
        private _deltaSubZ: number = 0 | 0;                   // map z subdivision delta 
        private _refreshEveryFrame: boolean = false;        // boolean : to force the terrain computation every frame
        private _useCustomVertexFunction: boolean = false;  // boolean : to allow the call to updateVertex()
        private _computeNormals: boolean = false;           // boolean : to skip or not the normal computation
        private _datamap: boolean = false;                  // boolean : true if an data map is passed as parameter
        private _uvmap: boolean = false;                    // boolean : true if an UV map is passed as parameter
        private _colormap: boolean = false;                 // boolean : true if an color map is passed as parameter
        private _mapSPData: boolean = false;                // boolean : true if a SPmapData array is passed as parameter
        private _colorSPData: boolean = false;              // boolean : true if a SPcolorData array is passed as parameter
        private _uvSPData: boolean = false;                 // boolean : true if a SPuvData array is passed as parameter
        private _mapInstanceData: boolean = false;          // boolean : true if a instanceMapData array is passed as parameter
        private _colorInstanceData: boolean = false;        // boolean : true if a instanceColorData array is passed as parameter
        private _colorBuffers: VertexBuffer[];              // Reference to the created Color Buffers for the instances
        private _mapQuads: number[][][][];                  // map quads of types of particle/instance index in the SPmapData/instanceMapData array mapQuads[mapIndex]["sps" | "instances"][partType] = [pIndex1, pIndex2, ...] (particle/instance indexes in SPmapData/instanceMapData)
        private _instanceWM: Float32Array[];                // precomputed world matrices of instances per type
        private _precomputeInstances: boolean = true;       // if the instance WM must be precomputed once before
        private static _vertex: any = {                     // current vertex object passed to the user custom function
            position: Vector3.Zero(),                           // vertex position in the terrain space (Vector3)
            uvs: Vector2.Zero(),                                // vertex uv
            color: new Color4(1.0, 1.0, 1.0, 1.0),              // vertex color (Color4)
            lodX: 1 | 0,                                          // vertex LOD value on X axis
            lodZ: 1 | 0,                                          // vertex LOD value on Z axis
            worldPosition: Vector3.Zero(),                      // vertex World position
            mapIndex: 0 | 0                                       // current map index
        };
        private _averageSubSizeX: number = 0.0;                             // map cell average x size
        private _averageSubSizeZ: number = 0.0;                             // map cell average z size
        private _terrainSizeX: number = 0.0;                                // terrain x size
        private _terrainSizeZ: number = 0.0;                                // terrain y size
        private _terrainHalfSizeX: number = 0.0;
        private _terrainHalfSizeZ: number = 0.0;
        private _centerWorld = Vector3.Zero();             // terrain world center position
        private _centerLocal = Vector3.Zero();             // terrain local center position
        private _mapSizeX: number = 0.0;                                    // map x size
        private _mapSizeZ: number = 0.0;                                    // map z size
        private _terrain: Mesh;                                             // reference to the ribbon
        private _isAlwaysVisible: boolean = false;                          // is the terrain mesh always selected for rendering
        private _precomputeNormalsFromMap: boolean = false;                 // if the normals must be precomputed from the map data when assigning a new map to the existing terrain
        // tmp vectors
        private static _v1: Vector3 = Vector3.Zero();
        private static _v2: Vector3 = Vector3.Zero();
        private static _v3: Vector3 = Vector3.Zero();
        private static _v4: Vector3 = Vector3.Zero();
        private static _vAvB: Vector3 = Vector3.Zero();
        private static _vAvC: Vector3 = Vector3.Zero();
        private static _norm: Vector3 = Vector3.Zero();
        private static _bbMin: Vector3 = Vector3.Zero();
        private static _bbMax: Vector3 = Vector3.Zero();
        private static _pos: Vector3 = Vector3.Zero();
        private static _scl: Vector3 = Vector3.Zero();
        // tmp quaternion and matrix or arrays
        private static _quat: Quaternion = Quaternion.Identity();
        private static _mat: Float32Array = new Float32Array(16);
        private static _matZero: Float32Array = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        private static _col: Float32Array = new Float32Array(4);


        /**
         * constructor
         * @param name 
         * @param options 
         * @param scene 
         * @param {*} mapData the array of the map 3D data : x, y, z successive float values
         * @param {*} mapSubX the data map number of x subdivisions : integer
         * @param {*} mapSubZ the data map number of z subdivisions : integer
         * @param {*} terrainSub the wanted terrain number of subdivisions : integer, multiple of 2.
         * @param {*} mapUVs the array of the map UV data (optional) : u,v successive values, each between 0 and 1.
         * @param {*} mapColors the array of the map Color data (optional) : r,g,b successive values, each between 0 and 1.
         * @param {*} mapNormals the array of the map normal data (optional) : x, y, z successive float values.
         * @param {*} invertSide boolean, to invert the terrain mesh upside down. Default false.
         * @param {*} camera the camera to link the terrain to. Optional, by default the scene active camera
         * @param {*} SPmapData an array of arrays or Float32Arrays (one per particle type) of object data (position, rotation, scaling) on the map. Optional.
         * @param {*} sps the Solid Particle System used to manage the particles. Required when used with SPmapData.  
         * @param {*} SPcolorData an optional array of arrays or Float32Arrays (one per particle type) of object colors on the map. One series of r, g, b, a floats per object. Optional, requires a SPmapData and a sps to be passed.    
         * @param {*} SPuvData an optional array of arrays or Float32Arrays (one per particle type) of object uvs on the map. One series of x, y, z, w floats per object. Optional, requires a SPmapData and a sps to be passed.      
         * @param {*} instanceMapData an array of arrays or Float32Arrays (one per instance type) of object data (position, rotation, scaling) on the map. Optional.
         * @param {*} sourceMeshes an array of source meshes. Required when used with InstanceMapdata.
         * @param {*} instanceColorData an optional array of arrays or Float32Arrays (one per instance type) of object colors on the map. One series of r, g, b, a floats per object. Optional, requires a InstanceMapData and an sourceMeshes array to be passed.    
         * @param {*} precomputeInstances an optional boolean (default true) to precompute all the instance world matrices (faster, but more memory used)
         */
        constructor(name: string, options: {
            terrainSub?: number,
            mapData: number[] | Float32Array,
            mapSubX?: number, mapSubZ?: number,
            mapUVs: number[] | Float32Array,
            mapColors: number[] | Float32Array,
            mapNormals?: number[] | Float32Array,
            invertSide: boolean,
            camera: Camera,
            SPmapData: number[][] | Float32Array[];
            sps: SolidParticleSystem,
            SPcolorData: number[][] | Float32Array[];
            SPuvData: number[][] | Float32Array[];
            instanceMapData: number[][] | Float32Array[];
            sourceMeshes: Mesh[];
            instanceColorData: number[][] | Float32Array[];
            precomputeInstances: boolean;
        }, scene: Scene) {

            this.name = name;
            this._terrainSub = options.terrainSub || 60;
            this._mapData = options.mapData;
            this._terrainIdx = this._terrainSub + 1;
            this._mapSubX = options.mapSubX || this._terrainIdx;
            this._mapSubZ = options.mapSubZ || this._terrainIdx;
            this._mapUVs = options.mapUVs;            // if not defined, it will be still populated by default values
            this._mapColors = options.mapColors;
            this._scene = scene;
            this._terrainCamera = options.camera || scene.activeCamera;
            this._inverted = options.invertSide;
            this._SPmapData = options.SPmapData;
            this._SPcolorData = options.SPcolorData;
            this._SPuvData = options.SPuvData;
            this._sps = options.sps;
            this._instanceMapData = options.instanceMapData;
            this._instanceColorData = options.instanceColorData;
            this._sourceMeshes = options.sourceMeshes;
            this._precomputeInstances = (typeof options.precomputeInstances === undefined) ? true : options.precomputeInstances;

            // initialize the map arrays if not passed as parameters
            this._datamap = (this._mapData) ? true : false;
            this._uvmap = (this._mapUVs) ? true : false;
            this._colormap = (this._mapColors) ? true : false;
            this._mapSPData = (this._SPmapData) ? true : false;
            this._colorSPData = (this._mapSPData && this._SPcolorData) ? true : false;
            this._uvSPData = (this._mapSPData && this._SPuvData) ? true : false;
            this._mapInstanceData = (this._instanceMapData) ? true : false;
            this._colorInstanceData = (this._mapInstanceData && this._instanceColorData) ? true : false;
            this._mapData = (this._datamap) ? this._mapData : new Float32Array(this._terrainIdx * this._terrainIdx * 3);
            this._mapUVs = (this._uvmap) ? this._mapUVs : new Float32Array(this._terrainIdx * this._terrainIdx * 2);
            if (this._datamap) {
                this._mapNormals = options.mapNormals || new Float32Array(this._mapSubX * this._mapSubZ * 3);
            }
            else {
                this._mapNormals = new Float32Array(this._terrainIdx * this._terrainIdx * 3);
            }
            this._mapQuads = [];

            // Ribbon creation
            let index = 0;                                          // current vertex index in the map array
            let posIndex = 0;                                       // current position (coords) index in the map array
            let colIndex = 0;                                       // current color index in the color array
            let uvIndex = 0;                                        // current uv index in the uv array
            let color: Color4;                                              // current color
            let uv: Vector2;                                                 // current uv
            let terIndex = 0;                                       // current index in the terrain array
            let y = 0.0;                                            // current y coordinate
            let terrainPath: Vector3[];                                        // current path
            let u = 0.0;                                            // current u of UV
            let v = 0.0;                                            // current v of UV
            let lg = this._terrainIdx + 1;                          // augmented length for the UV to finish before
            const terrainData: Vector3[][] = [];
            const terrainColor: Color4[] = [];
            const terrainUV: Vector2[] = [];
            const mapData = this._mapData;
            const mapColors = this._mapColors;
            const mapUVs = this._mapUVs;
            const nbAvailableParticlesPerType: number[] = [];
            this._nbAvailableParticlesPerType = nbAvailableParticlesPerType;

            for (let j = 0; j <= this._terrainSub; j++) {
                terrainPath = [];
                for (let i = 0; i <= this._terrainSub; i++) {
                    index = this._mod(j * 3, this._mapSubZ) * this._mapSubX + this._mod(i * 3, this._mapSubX);
                    posIndex = index * 3;
                    colIndex = index * 3;
                    uvIndex = index * 2;
                    terIndex = j * this._terrainIdx + i;
                    // geometry
                    if (this._datamap) {
                        y = mapData[posIndex + 1];
                    }
                    else {
                        y = 0.0;
                        mapData[3 * terIndex] = i;
                        mapData[3 * terIndex + 1] = y;
                        mapData[3 * terIndex + 2] = j;
                    }
                    terrainPath.push(new Vector3(i, y, j));
                    // color
                    if (this._colormap) {
                        color = new Color4(mapColors[colIndex], mapColors[colIndex + 1], mapColors[colIndex + 2], 1.0);
                    }
                    else {
                        color = new Color4(1.0, 1.0, 1.0, 1.0);
                    }
                    terrainColor.push(color);
                    // uvs
                    if (this._uvmap) {
                        uv = new Vector2(mapUVs[uvIndex], mapUVs[uvIndex + 1]);
                    }
                    else {
                        u = 1.0 - Math.abs(1.0 - 2.0 * i / lg);
                        v = 1.0 - Math.abs(1.0 - 2.0 * j / lg);
                        mapUVs[2 * terIndex] = u;
                        mapUVs[2 * terIndex + 1] = v;
                        uv = new Vector2(u, v);
                    }
                    terrainUV.push(uv);
                }
                terrainData.push(terrainPath);
            }

            this._mapSizeX = Math.abs(mapData[(this._mapSubX - 1) * 3] - mapData[0]);
            this._mapSizeZ = Math.abs(mapData[(this._mapSubZ - 1) * this._mapSubX * 3 + 2] - mapData[2]);
            this._averageSubSizeX = this._mapSizeX / this._mapSubX;
            this._averageSubSizeZ = this._mapSizeZ / this._mapSubZ;
            const ribbonOptions = {
                pathArray: terrainData,
                sideOrientation: (options.invertSide) ? Mesh.FRONTSIDE : Mesh.BACKSIDE,
                colors: terrainColor,
                uvs: terrainUV,
                updatable: true
            };
            this._terrain = MeshBuilder.CreateRibbon("terrain", ribbonOptions, this._scene);
            this._indices = this._terrain.getIndices();
            this._positions = this._terrain.getVerticesData(VertexBuffer.PositionKind);
            this._normals = this._terrain.getVerticesData(VertexBuffer.NormalKind);
            this._uvs = this._terrain.getVerticesData(VertexBuffer.UVKind);
            this._colors = this._terrain.getVerticesData(VertexBuffer.ColorKind);
            this.computeNormalsFromMap();

            // update it immediatly and register the update callback function in the render loop
            this.update(true);
            this._terrain.position.x = this._terrainCamera.globalPosition.x - this._terrainHalfSizeX + this.shiftFromCamera.x;
            this._terrain.position.z = this._terrainCamera.globalPosition.z - this._terrainHalfSizeZ + this.shiftFromCamera.z;
            // initialize deltaSub to make on the map
            let deltaNbSubX = (this._terrain.position.x - mapData[0]) / this._averageSubSizeX;
            let deltaNbSubZ = (this._terrain.position.z - mapData[2]) / this._averageSubSizeZ
            this._deltaSubX = (deltaNbSubX > 0) ? Math.floor(deltaNbSubX) : Math.ceil(deltaNbSubX);
            this._deltaSubZ = (deltaNbSubZ > 0) ? Math.floor(deltaNbSubZ) : Math.ceil(deltaNbSubZ);
            this._scene.onBeforeRenderObservable.add(() => {
                const refreshEveryFrame = this._refreshEveryFrame;
                this.beforeUpdate(refreshEveryFrame);
                this.update(refreshEveryFrame);
                this.afterUpdate(refreshEveryFrame);
            });


            // Solid Particles or Instances in the map
            const SPmapData = this._SPmapData;
            const instanceMapData = this._instanceMapData;
            const dataStride = this._particleDataStride;
            const typeSPS = this._typeSPS;
            const typeInstance = this._typeInstance;
            const mapSizeX = this._mapSizeX;
            const mapSizeZ = this._mapSizeZ;
            const mapSubX = this._mapSubX;
            const mapSubZ = this._mapSubZ;
            const quads = this._mapQuads;
            // if SP data, populate the map quads
            // mapQuads[mapIndex][typeSPS][partType] = [partIdx1 , partIdx2 ...] partIdx are particle indexes in SPmapData
            if (this._mapSPData) {
                let x0 = mapData[0];
                let z0 = mapData[2];

                for (let t = 0; t < SPmapData.length; t++) {

                    const data = SPmapData[t];
                    let nb = (data.length / dataStride) | 0;
                    for (let pIdx = 0; pIdx < nb; pIdx++) {
                        // particle position x, z in the map
                        let dIdx = pIdx * dataStride;
                        let x = data[dIdx];
                        let z = data[dIdx + 2];
                        x = x - Math.floor((x - x0) / mapSizeX) * mapSizeX;
                        z = z - Math.floor((z - z0) / mapSizeZ) * mapSizeZ;
                        let col = Math.floor((x - x0) * mapSubX / mapSizeX);
                        let row = Math.floor((z - z0) * mapSubZ / mapSizeZ);
                        let quadIdx = row * mapSubX + col;
                        if (quads[quadIdx] === undefined) {
                            quads[quadIdx] = [];
                            quads[quadIdx][typeSPS] = [];
                        }
                        if (quads[quadIdx][typeSPS][t] === undefined) {
                            quads[quadIdx][typeSPS][t] = [];
                        }
                        let quad = quads[quadIdx][typeSPS][t];
                        // push the particle index from the SPmapData array into the quads array
                        quad.push(pIdx);
                    }
                }

                // update the sps
                const sps = this._sps;
                sps.computeBoundingBox = true;
                sps.isAlwaysVisible = true;
                if (this._colorSPData) {
                    sps.computeParticleColor = true;
                }
                if (this._uvSPData) {
                    sps.computeParticleTexture = true;
                }
                // store particle types
                const spsTypeStartIndexes: number[] = [];
                this._spsTypeStartIndexes = spsTypeStartIndexes;
                const spsNbPerType: number[] = [];
                this._spsNbPerType = spsNbPerType;
                const nbParticles = sps.nbParticles;
                const particles = sps.particles;
                let type = 0;
                spsTypeStartIndexes.push(type);
                nbAvailableParticlesPerType.push(0);
                let count = 1;
                for (var p = 1; p < nbParticles; p++) {
                    particles[p].isVisible = false;
                    if (type != particles[p].shapeId) {
                        type++;
                        spsTypeStartIndexes.push(p);
                        spsNbPerType.push(count);
                        nbAvailableParticlesPerType.push(count);
                        count = 0;
                    }
                    count++;
                }
                spsNbPerType.push(count);
            }

            // if instance data, populate the map quads
            // mapQuads[mapIndex][typeInstances][instanceType] = [instanceIdx1 , instanceIdx2 ...] instanceIdx are instance indexes in instanceMapData
            if (this._mapInstanceData) {
                let x0 = mapData[0];
                let z0 = mapData[2];
                this._colorBuffers = [];
                this._instanceWM = [];
                var posVct = DynamicTerrain._pos;
                var sclVct = DynamicTerrain._scl;
                var mat = DynamicTerrain._mat;
                var quat = DynamicTerrain._quat;
                var composeToRef = DynamicTerrain._ComposeToRef;

                for (let t = 0; t < instanceMapData.length; t++) {

                    const data = instanceMapData[t];
                    let nb = (data.length / dataStride) | 0;
                    if (this._precomputeInstances) {
                        this._instanceWM[t] = new Float32Array(nb * 16);   // 16 floats per instance WM
                        var instanceWM = this._instanceWM[t];
                    }
                    for (let pIdx = 0; pIdx < nb; pIdx++) {
                        // instance position x, z in the map
                        let dIdx = pIdx * dataStride;
                        let x = data[dIdx];
                        let y = data[dIdx + 1];
                        let z = data[dIdx + 2];

                        // precompute all the instance WM and store them
                        if (this._precomputeInstances) {
                            posVct.copyFromFloats(x, y, z);
                            let rx = data[dIdx + 3];
                            let ry = data[dIdx + 4];
                            let rz = data[dIdx + 5];
                            Quaternion.RotationYawPitchRollToRef(ry, rx, rz, quat);
                            sclVct.copyFromFloats(data[dIdx + 6], data[dIdx + 7], data[dIdx + 8]);
                            composeToRef(sclVct, quat, posVct, mat);
                            let wmIndex = 16 * pIdx;
                            instanceWM.set(mat, wmIndex);
                        }

                        x = x - Math.floor((x - x0) / mapSizeX) * mapSizeX;
                        z = z - Math.floor((z - z0) / mapSizeZ) * mapSizeZ;
                        let col = Math.floor((x - x0) * mapSubX / mapSizeX);
                        let row = Math.floor((z - z0) * mapSubZ / mapSizeZ);
                        let quadIdx = row * mapSubX + col;
                        if (quads[quadIdx] === undefined) {
                            quads[quadIdx] = [];
                            quads[quadIdx][typeInstance] = [];
                        }
                        if (quads[quadIdx][typeInstance] === undefined) {
                            quads[quadIdx][typeInstance] = [];
                        }
                        if (quads[quadIdx][typeInstance][t] === undefined) {
                            quads[quadIdx][typeInstance][t] = [];
                        }
                        let quad = quads[quadIdx][typeInstance][t];
                        // push the instance index from the instanceMapData array into the quads array
                        quad.push(pIdx);
                    }
                }
                // store instance types and init instance buffers
                const nbAvailableInstancesPerType = [];
                this._nbAvailableInstancesPerType = nbAvailableInstancesPerType;
                const typeNb = this._sourceMeshes.length;
                let engine = this._scene.getEngine();
                for (let t = 0; t < typeNb; t++) {
                    let mesh = this._sourceMeshes[t];
                    mesh.alwaysSelectAsActiveMesh = true;
                    let nb = mesh.instances.length;
                    nbAvailableInstancesPerType[t] = nb;
                    mesh.manualUpdateOfWorldMatrixInstancedBuffer = true;
                    for (let i = 0; i < mesh.instances.length; i++) {
                        let instance = mesh.instances[i];
                        instance.freezeWorldMatrix();
                        instance.alwaysSelectAsActiveMesh = true;
                        instance.doNotSyncBoundingInfo = true;
                    }
                    if (this._colorInstanceData) {
                        let colorArray = new Float32Array(4 * (mesh.instances.length + 1));
                        for (let c = 0; c < colorArray.length; c++) {
                            colorArray[c] = 1;
                        }
                        let colorBuffer = new VertexBuffer(engine, colorArray, VertexBuffer.ColorKind, true, false, 4, true);
                        mesh.setVerticesBuffer(colorBuffer);
                        this._colorBuffers.push(colorBuffer);
                    }
                }
            }

            this.update(true); // recompute everything once the initial deltas are calculated 
        }


        /**
         * Updates the terrain position and shape according to the camera position.
         * `force` : boolean, forces the terrain update even if no camera position change.
         * Returns the terrain.
         */
        public update(force: boolean): DynamicTerrain {

            let needsUpdate = false;
            let updateLOD = false;
            const updateForced = (force) ? true : false;
            const terrainPosition = this._terrain.position;
            const cameraPosition = this._terrainCamera.globalPosition;
            const shiftFromCamera = this.shiftFromCamera;
            let terrainHalfSizeX = this._terrainHalfSizeX;
            let terrainHalfSizeZ = this._terrainHalfSizeZ;
            const deltaX = terrainHalfSizeX + terrainPosition.x - cameraPosition.x - shiftFromCamera.x;
            const deltaZ = terrainHalfSizeZ + terrainPosition.z - cameraPosition.z - shiftFromCamera.z;
            const subToleranceX = this._subToleranceX;
            const subToleranceZ = this._subToleranceZ;
            const mod = this._mod;

            // current LOD
            let oldCorrection = this._cameraLODCorrection;
            this._cameraLODCorrection = (this.updateCameraLOD(this._terrainCamera)) | 0;
            updateLOD = (oldCorrection == this._cameraLODCorrection) ? false : true;
            let LODValue = this._initialLOD + this._cameraLODCorrection;
            LODValue = (LODValue > 0) ? LODValue : 1;
            this._LODValue = LODValue;

            // threshold sizes on each axis to trigger the terrain update
            let mapShiftX = this._averageSubSizeX * subToleranceX * LODValue;
            let mapShiftZ = this._averageSubSizeZ * subToleranceZ * LODValue;

            let mapFlgtNb = 0 | 0;                       // number of map cells flought over by the camera in the delta shift
            let deltaSubX = this._deltaSubX;
            let deltaSubZ = this._deltaSubZ;
            if (Math.abs(deltaX) > mapShiftX) {
                const signX = (deltaX > 0.0) ? -1 : 1;
                mapFlgtNb = Math.abs(deltaX / mapShiftX) | 0;
                terrainPosition.x += mapShiftX * signX * mapFlgtNb;
                deltaSubX += (subToleranceX * signX * LODValue * mapFlgtNb);
                needsUpdate = true;
            }
            if (Math.abs(deltaZ) > mapShiftZ) {
                const signZ = (deltaZ > 0.0) ? -1 : 1;
                mapFlgtNb = Math.abs(deltaZ / mapShiftZ) | 0;
                terrainPosition.z += mapShiftZ * signZ * mapFlgtNb;
                deltaSubZ += (subToleranceZ * signZ * LODValue * mapFlgtNb);
                needsUpdate = true;
            }
            const updateSize = updateLOD || updateForced;       // must the terrain size be updated ?
            if (needsUpdate || updateSize) {
                this._deltaSubX = mod(deltaSubX, this._mapSubX);
                this._deltaSubZ = mod(deltaSubZ, this._mapSubZ);
                this._updateTerrain(updateSize);
            }

            terrainHalfSizeX = this._terrainHalfSizeX;
            terrainHalfSizeZ = this._terrainHalfSizeZ;
            this.centerLocal.copyFromFloats(terrainHalfSizeX, 0.0, terrainHalfSizeZ);
            this._centerWorld.copyFromFloats(terrainPosition.x + terrainHalfSizeX, terrainPosition.y, terrainPosition.z + terrainHalfSizeZ);

            return this;
        }


        // private : updates the underlying ribbon
        private _updateTerrain(updateSize: boolean): void {
            let stepJ = 0 | 0;
            let stepI = 0 | 0;
            let LODLimitDown = 0 | 0;
            let LODLimitUp = 0 | 0;
            let LODValue = this._LODValue;          // terrain LOD value
            let axisLODValue = LODValue;            // current axis computed LOD value
            let lodI = LODValue;                    // LOD X
            let lodJ = LODValue;                    // LOD Z
            const bbMin = DynamicTerrain._bbMin;
            const bbMax = DynamicTerrain._bbMax;
            const terrain = this._terrain;
            const positions = this._positions;
            const normals = this._normals;
            const colors = this._colors;
            const uvs = this._uvs;
            const mapColors = this._mapColors;
            const mapNormals = this._mapNormals;
            const mapData = this._mapData;
            const mapUVs = this._mapUVs;
            const mapSPData = this._mapSPData;
            const quads = this._mapQuads;
            const nbPerType = this._spsNbPerType;
            const SPmapData = this._SPmapData;
            const SPcolorData = this._SPcolorData;
            const SPuvData = this._SPuvData;
            const mapInstanceData = this._mapInstanceData;
            const instanceMapData = this._instanceMapData;
            const instanceColorData = this._instanceColorData;
            const dataStride = this._particleDataStride;
            const colorStride = this._particleColorStride;
            const uvStride = this._particleUVStride;
            const LODLimits = this._LODLimits;
            const terrainSub = this._terrainSub;
            const mod = this._mod;
            const terrainIdx = this._terrainIdx;
            const mapSubX = this._mapSubX;
            const mapSubZ = this._mapSubZ;
            const deltaSubX = this._deltaSubX;
            const deltaSubZ = this._deltaSubZ;
            const datamap = this._datamap;
            const uvmap = this._uvmap;
            const colormap = this._colormap;
            const useCustomVertexFunction = this._useCustomVertexFunction;
            const updateVertex = this.updateVertex;
            const dontComputeNormals = !this._computeNormals;
            const LODpstvX = this._LODPositiveX;
            const LODngtvX = this._LODNegativeX;
            const LODpstvZ = this._LODPositiveZ;
            const LODngtvZ = this._LODNegativeZ;
            const mapSizeX = this._mapSizeX;
            const mapSizeZ = this._mapSizeZ;
            const averageSubSizeX = this._averageSubSizeX;
            const averageSubSizeZ = this._averageSubSizeZ;
            const particleMap = (mapSPData && quads);
            const particleColorMap = (particleMap && this._colorSPData);
            const particleUVMap = (particleMap && this._uvSPData);
            const typeSPS = this._typeSPS;
            const typeInstance = this._typeInstance;
            const instanceMap = (mapInstanceData && quads);
            const instanceColorMap = (instanceMap && this._colorInstanceData);
            const precomputeInstances = this._precomputeInstances;
            var sourceMeshes = this._sourceMeshes;
            var nbAvailableInstancesPerType = this._nbAvailableInstancesPerType;
            var composeToRef = DynamicTerrain._ComposeToRef;
            var copyArrayValuesFromToRef = DynamicTerrain._CopyArrayValuesFromToRef;
            var instanceWM = this._instanceWM;
            var sclVct = DynamicTerrain._scl;
            var posVct = DynamicTerrain._pos;
            var quat = DynamicTerrain._quat;
            var matZero = DynamicTerrain._matZero;

            let l = 0 | 0;
            let index = 0 | 0;          // current vertex index in the map data array
            let posIndex1 = 0 | 0;      // current position index in the map data array
            let posIndex2 = 0 | 0;
            let posIndex3 = 0 | 0;
            let colIndex = 0 | 0;       // current index in the map color array
            let uvIndex = 0 | 0;        // current index in the map uv array
            let terIndex = 0 | 0;       // current vertex index in the terrain map array when used as a data map
            let ribbonInd = 0 | 0;      // current ribbon vertex index
            let ribbonPosInd = 0 | 0;   // current ribbon position index (same than normal index)
            let ribbonUVInd = 0 | 0;    // current ribbon UV index
            let ribbonColInd = 0 | 0;   // current ribbon color index
            let ribbonColInd1 = 0 | 0;
            let ribbonColInd2 = 0 | 0;
            let ribbonColInd3 = 0 | 0;
            let ribbonColInd4 = 0 | 0;
            let ribbonPosInd1 = 0 | 0;
            let ribbonPosInd2 = 0 | 0;
            let ribbonPosInd3 = 0 | 0;
            // note : all the indexes are explicitly set as integers for the js optimizer (store them all in the stack)

            if (updateSize) {
                this.updateTerrainSize();
            }
            Vector3.FromFloatsToRef(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, bbMin);
            Vector3.FromFloatsToRef(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, bbMax);

            // Object (solid particles or instances) map management
            var x0 = mapData[0];
            var z0 = mapData[2];
            var terrainPos = terrain.position;
            // if solid particle data
            if (particleMap) {
                var sps = this._sps;
                var particles = sps.particles;
                var spsTypeStartIndexes = this._spsTypeStartIndexes;
                var nbAvailableParticlesPerType = this._nbAvailableParticlesPerType;
                // reset all the particles to invisible
                const nbParticles = sps.nbParticles;
                for (let p = 0; p < nbParticles; p++) {
                    particles[p].isVisible = false;
                }
            }

            // if instance data
            if (instanceMap) {
                var mat = DynamicTerrain._mat;
                for (let t = 0; t < sourceMeshes.length; t++) {
                    let sourceMesh = sourceMeshes[t];
                    let instancedBuffer = sourceMesh.worldMatrixInstancedBuffer;
                    if (instancedBuffer) {
                        let instances = sourceMesh.instances;
                        let offset = 0;
                        for (let i = 0; i < instances.length; i++) {
                            instancedBuffer.set(matZero, offset);
                            offset += 16;
                        }
                    }
                }
            }


            // Test map seam within the terrain
            let seamX = false;
            let seamZ = false;
            let seamXIndex = 0 | 0;
            let seamZIndex = 0 | 0;
            let prevXIndex = mod(deltaSubX, mapSubX);
            let prevZIndex = mod(deltaSubZ, mapSubZ);
            let axisZLODValue = 0 | 0;
            let axisXLODValue = 0 | 0;
            let curXIndex = 0 | 0;
            let curZIndex = 0 | 0;
            let positionsLength = positions?.length || 0;
            let uvsLength = uvs?.length || 0;
            let colorsLength = colors?.length || 0;

            for (let j = 1 | 0; j <= terrainSub; j++) {
                axisZLODValue = LODValue;
                axisXLODValue = LODValue;
                for (l = 0; l < LODLimits.length; l++) {
                    LODLimitDown = LODLimits[l];
                    LODLimitUp = terrainSub - LODLimitDown - 1;
                    if ((LODngtvZ && j < LODLimitDown) || (LODpstvZ && j > LODLimitUp)) {
                        axisZLODValue = l + 1 + LODValue;
                    }
                    if ((LODngtvX && j < LODLimitDown) || (LODpstvX && j > LODLimitUp)) {
                        axisXLODValue = l + 1 + LODValue;
                    }
                    lodJ = axisZLODValue;
                    lodI = axisXLODValue;
                }

                stepJ += lodJ;
                stepI += lodI;

                // seam test
                if (!seamX) {
                    curXIndex = mod(deltaSubX + stepI, mapSubX);
                    if (Math.abs(curXIndex - prevXIndex) > lodI) {
                        seamX = true;
                        seamXIndex = stepI;
                    }
                    else {
                        prevXIndex = curXIndex;
                    }
                }
                if (!seamZ) {
                    curZIndex = mod(deltaSubZ + stepJ, mapSubZ);
                    if (Math.abs(curZIndex - prevZIndex) > lodJ) {
                        seamZ = true;
                        seamZIndex = stepJ;
                    }
                    else {
                        prevZIndex = curZIndex;
                    }
                }
                if (seamZ && seamX) {
                    break;
                }
            }

            stepI = 0 | 0;
            stepJ = 0 | 0;
            lodI = LODValue;
            lodJ = LODValue;
            let zIndex = 0 | 0;
            let xIndex = 0 | 0;
            for (let j = 0 | 0; j <= terrainSub; j++) {
                // LOD Z
                axisLODValue = LODValue;
                for (l = 0; l < LODLimits.length; l++) {
                    LODLimitDown = LODLimits[l];
                    LODLimitUp = terrainSub - LODLimitDown - 1;
                    if ((LODngtvZ && j < LODLimitDown) || (LODpstvZ && j > LODLimitUp)) {
                        axisLODValue = l + 1 + LODValue;
                    }
                    lodJ = axisLODValue;
                }

                zIndex = mod(deltaSubZ + stepJ, mapSubZ);
                for (let i = 0 | 0; i <= terrainSub; i++) {
                    // LOD X
                    axisLODValue = LODValue;
                    for (l = 0; l < LODLimits.length; l++) {
                        LODLimitDown = LODLimits[l];
                        LODLimitUp = terrainSub - LODLimitDown - 1;
                        if ((LODngtvX && i < LODLimitDown) || (LODpstvX && i > LODLimitUp)) {
                            axisLODValue = l + 1 + LODValue;
                        }
                        lodI = axisLODValue;
                    }

                    // map current index
                    xIndex = mod(deltaSubX + stepI, mapSubX);
                    index = zIndex * mapSubX + xIndex;
                    terIndex = mod(deltaSubZ + stepJ, terrainIdx) * terrainIdx + mod(deltaSubX + stepI, terrainIdx);

                    // related index in the array of positions (data map)
                    if (datamap) {
                        posIndex1 = 3 * index;
                    }
                    else {
                        posIndex1 = 3 * terIndex;
                    }
                    // related index in the UV map
                    if (uvmap) {
                        uvIndex = 2 * index;
                    }
                    else {
                        uvIndex = 2 * terIndex;
                    }
                    // related index in the color map
                    if (colormap) {
                        colIndex = 3 * index;
                    }
                    else {
                        colIndex = 3 * terIndex;
                    }

                    //map indexes
                    posIndex2 = posIndex1 + 1;
                    posIndex3 = posIndex1 + 2;

                    // ribbon indexes
                    ribbonPosInd = 3 * ribbonInd;
                    ribbonColInd = 4 * ribbonInd;
                    ribbonUVInd = 2 * ribbonInd;
                    ribbonPosInd1 = ribbonPosInd;
                    ribbonPosInd2 = ribbonPosInd + 1;
                    ribbonPosInd3 = ribbonPosInd + 2;
                    ribbonColInd1 = ribbonColInd;
                    ribbonColInd2 = ribbonColInd + 1;
                    ribbonColInd3 = ribbonColInd + 2;
                    ribbonColInd4 = ribbonColInd + 3;
                    ribbonInd += 1;

                    // geometry                  
                    if (!positions) { return; }
                    positions[ribbonPosInd1] = averageSubSizeX * stepI;
                    positions[ribbonPosInd2] = mapData[posIndex2];
                    positions[ribbonPosInd3] = averageSubSizeZ * stepJ;

                    if (dontComputeNormals) {
                        if (!normals) { return; }
                        normals[ribbonPosInd1] = mapNormals[posIndex1];
                        normals[ribbonPosInd2] = mapNormals[posIndex2];
                        normals[ribbonPosInd3] = mapNormals[posIndex3];
                    }
                    // uv : the array _mapUVs is always populated
                    if (!uvs) { return; }
                    uvs[ribbonUVInd] = mapUVs[uvIndex];
                    uvs[ribbonUVInd + 1] = mapUVs[uvIndex + 1];

                    // color
                    if (colormap) {
                        if (!colors) { return; }
                        colors[ribbonColInd1] = mapColors[colIndex];
                        colors[ribbonColInd2] = mapColors[colIndex + 1];
                        colors[ribbonColInd3] = mapColors[colIndex + 2];
                    }

                    // seam test on Z
                    if (seamZ && (seamZIndex == stepJ || stepJ == seamZIndex + 1)) {
                        let back3 = 3 * terrainSub + 3;
                        let ind1 = mod(ribbonPosInd1 - back3, positionsLength);
                        let ind2 = ind1 + 1;
                        let ind3 = ind1 + 2;
                        positions[ribbonPosInd1] = positions[ind1];
                        positions[ribbonPosInd2] = positions[ind2];
                        positions[ribbonPosInd3] = positions[ind3];
                        if (dontComputeNormals) {
                            if (!normals) { return; }
                            normals[ribbonPosInd1] = normals[ind1];
                            normals[ribbonPosInd2] = normals[ind2];
                            normals[ribbonPosInd3] = normals[ind3];
                        }
                        let back2 = 2 * terrainSub + 2;
                        let back4 = 2 * back2;
                        if (stepJ == seamZIndex + 1) {
                            let induv = mod(ribbonUVInd - back2, uvsLength);
                            uvs[ribbonUVInd] = uvs[induv];
                            uvs[ribbonUVInd + 1] = uvs[induv + 1];
                            if (colormap) {
                                let indcol = mod(ribbonColInd - back4, colorsLength);
                                if (!colors) { return; }
                                colors[ribbonColInd1] = colors[indcol];
                                colors[ribbonColInd2] = colors[indcol + 1];
                                colors[ribbonColInd3] = colors[indcol + 2];
                            }
                        }
                    }

                    // seam test on X
                    if (seamX && (seamXIndex == stepI || stepI == seamXIndex + 1)) {
                        let back3 = 3;
                        let ind1 = mod(ribbonPosInd1 - back3, positionsLength);
                        let ind2 = ind1 + 1;
                        let ind3 = ind1 + 2;
                        positions[ribbonPosInd1] = positions[ind1];
                        positions[ribbonPosInd2] = positions[ind2];
                        positions[ribbonPosInd3] = positions[ind3];
                        if (dontComputeNormals) {
                            if (!normals) { return; }
                            normals[ribbonPosInd1] = normals[ind1];
                            normals[ribbonPosInd2] = normals[ind2];
                            normals[ribbonPosInd3] = normals[ind3];
                        }
                        let back2 = 2;
                        let back4 = 4;
                        if (stepI == seamXIndex + 1) {
                            let induv = mod(ribbonUVInd - back2, uvsLength);
                            uvs[ribbonUVInd] = uvs[induv];
                            uvs[ribbonUVInd + 1] = uvs[induv + 1];
                            if (colormap) {
                                let indcol = mod(ribbonColInd - back4, colorsLength);
                                if (!colors) { return; }
                                colors[ribbonColInd1] = colors[indcol];
                                colors[ribbonColInd2] = colors[indcol + 1];
                                colors[ribbonColInd3] = colors[indcol + 2];
                            }
                        }
                    }

                    // bbox internal update
                    if (positions[ribbonPosInd1] < bbMin.x) {
                        bbMin.x = positions[ribbonPosInd1];
                    }
                    if (positions[ribbonPosInd1] > bbMax.x) {
                        bbMax.x = positions[ribbonPosInd1];
                    }
                    if (positions[ribbonPosInd2] < bbMin.y) {
                        bbMin.y = positions[ribbonPosInd2];
                    }
                    if (positions[ribbonPosInd2] > bbMax.y) {
                        bbMax.y = positions[ribbonPosInd2];
                    }
                    if (positions[ribbonPosInd3] < bbMin.z) {
                        bbMin.z = positions[ribbonPosInd3];
                    }
                    if (positions[ribbonPosInd3] > bbMax.z) {
                        bbMax.z = positions[ribbonPosInd3];
                    }


                    // call to user custom function with the current updated vertex object
                    if (useCustomVertexFunction) {
                        const vertex = DynamicTerrain._vertex;
                        const vertexPosition = vertex.position;
                        const vertexWorldPosition = vertex.worldPosition;
                        const vertexColor = vertex.color;
                        const vertexUvs = vertex.uvs;
                        vertexPosition.copyFromFloats(positions[ribbonPosInd1], positions[ribbonPosInd2], positions[ribbonPosInd3]);
                        vertexWorldPosition.copyFromFloats(mapData[posIndex1], vertexPosition.y, mapData[posIndex3]);
                        vertex.lodX = lodI;
                        vertex.lodZ = lodJ;
                        if (!colors) { return; }
                        vertexColor.copyFromFloats(colors[ribbonColInd1], colors[ribbonColInd2], colors[ribbonColInd3], colors[ribbonColInd4]);
                        vertexUvs.copyFromFloats(uvs[ribbonUVInd], uvs[ribbonUVInd + 1]);
                        vertex.mapIndex = index;
                        updateVertex(vertex, i, j); // the user can modify the array values here
                        if (!colors) { return; }
                        colors[ribbonColInd1] = vertexColor.r;
                        colors[ribbonColInd2] = vertexColor.g;
                        colors[ribbonColInd3] = vertexColor.b;
                        colors[ribbonColInd4] = vertexColor.a;
                        uvs[ribbonUVInd] = vertexUvs.x;
                        uvs[ribbonUVInd + 1] = vertexUvs.y;
                        positions[ribbonPosInd1] = vertexPosition.x;
                        positions[ribbonPosInd2] = vertexPosition.y;
                        positions[ribbonPosInd3] = vertexPosition.z;
                    }

                    // SPS management
                    if (particleMap) {
                        // if a quad contains some objects in the map
                        if (quads[index]) {
                            let quad = quads[index][typeSPS];
                            for (let t = 0; t < quad.length; t++) {
                                let data = SPmapData[t];
                                let partIndexes = quad[t];
                                if (particleColorMap) {
                                    var sp_colorData = SPcolorData[t];
                                }
                                if (particleUVMap) {
                                    var sp_uvData = SPuvData[t];
                                }
                                if (partIndexes) {
                                    let typeStartIndex = spsTypeStartIndexes[t];  // particle start index for a given type in the SPS
                                    const nbQuadParticles = partIndexes.length;
                                    let nbInSPS = nbPerType[t];
                                    let available = nbAvailableParticlesPerType[t];
                                    const rem = nbInSPS - available;
                                    var used = (rem > 0) ? rem : 0;
                                    let min = (available < nbQuadParticles) ? available : nbQuadParticles;  // don't iterate beyond possible
                                    for (let pIdx = 0; pIdx < min; pIdx++) {
                                        let px = partIndexes[pIdx]
                                        let idm = px * dataStride;
                                        // set successive available particles of this type       
                                        let particle = particles[typeStartIndex + pIdx + used];
                                        let pos = particle.position;
                                        let rot = particle.rotation;
                                        let scl = particle.scaling;
                                        let x = data[idm];
                                        pos.x = x + Math.floor((terrainPos.x - x - x0) / mapSizeX) * mapSizeX;
                                        pos.y = data[idm + 1];
                                        let z = data[idm + 2];
                                        pos.z = z + Math.floor((terrainPos.z - z - z0) / mapSizeZ) * mapSizeZ;
                                        rot.x = data[idm + 3];
                                        rot.y = data[idm + 4];
                                        rot.z = data[idm + 5];
                                        scl.x = data[idm + 6];
                                        scl.y = data[idm + 7];
                                        scl.z = data[idm + 8];
                                        if (particleColorMap) {
                                            let idc = px * colorStride;
                                            let col = particle.color;
                                            if (!col) { return; }
                                            col.r = sp_colorData[idc];
                                            col.g = sp_colorData[idc + 1];
                                            col.b = sp_colorData[idc + 2];
                                            col.a = sp_colorData[idc + 3];
                                        }
                                        if (particleUVMap) {
                                            let iduv = px * uvStride;
                                            let uvs = particle.uvs;
                                            uvs.x = sp_uvData[iduv];
                                            uvs.y = sp_uvData[iduv + 1];
                                            uvs.z = sp_uvData[iduv + 2];
                                            uvs.w = sp_uvData[iduv + 3];
                                        }
                                        particle.isVisible = true;
                                        available = available - 1;
                                        used = used + 1;
                                        min = (available < nbQuadParticles) ? available : nbQuadParticles;
                                    }
                                    available = (available > 0) ? available : 0;
                                    nbAvailableParticlesPerType[t] = available;
                                }
                            }

                        }
                    }

                    // Instance management
                    if (instanceMap) {
                        // are there objects in this quad ?
                        if (quads[index]) {
                            let quad = quads[index][typeInstance];
                            let colorBuffers = this._colorBuffers;
                            let tmpCol = DynamicTerrain._col;
                            for (let t = 0; t < quad.length; t++) {
                                let sourceMesh = this._sourceMeshes[t];
                                let instances = sourceMesh.instances;
                                let instancedBuffer = sourceMesh.worldMatrixInstancedBuffer;
                                let data = instanceMapData[t];
                                let instanceIndexes = quad[t];
                                let instWM = instanceWM[t];
                                if (instanceColorMap) {
                                    var instance_colorData = instanceColorData[t];
                                    var colorBuffer = colorBuffers[t];
                                }
                                if (instanceIndexes && instancedBuffer) {
                                    const nbQuadInstances = instanceIndexes.length;
                                    let nbInstances = instances.length;
                                    let available = nbAvailableInstancesPerType[t];
                                    let rem = nbInstances - available;
                                    var used = (rem > 0) ? rem : 0;
                                    let min = (available < nbQuadInstances) ? available : nbQuadInstances; // don't iterate beyond possible
                                    for (let iIdx = 0; iIdx < min; iIdx++) {
                                        let ix = instanceIndexes[iIdx];
                                        let idm = ix * dataStride;
                                        // set successive instance of this type
                                        let nextFree = iIdx + used;
                                        let bufferIndex = nextFree * 16; // the world matrix instanced buffer offset is 16

                                        if (precomputeInstances) {
                                            copyArrayValuesFromToRef(instWM, ix * 16, 16, mat);
                                        }
                                        else {
                                            let x = data[idm];
                                            let y = data[idm + 1];
                                            let z = data[idm + 2];
                                            x = x + Math.floor((terrainPos.x - x - x0) / mapSizeX) * mapSizeX;
                                            z = z + Math.floor((terrainPos.z - z - z0) / mapSizeZ) * mapSizeZ;
                                            posVct.copyFromFloats(x, y, z);
                                            x = data[idm + 3];
                                            y = data[idm + 4];
                                            z = data[idm + 5];
                                            Quaternion.RotationYawPitchRollToRef(y, x, z, quat);
                                            sclVct.copyFromFloats(data[idm + 6], data[idm + 7], data[idm + 8]);
                                            composeToRef(sclVct, quat, posVct, mat);
                                        }
                                        instancedBuffer.set(mat, bufferIndex);
                                        if (instanceColorData) {
                                            let idc = ix * colorStride;
                                            let colorBufferIndex = nextFree * 4;  // the color instanced buffet offset is 4
                                            tmpCol[0] = instance_colorData[idc]
                                            tmpCol[1] = instance_colorData[idc + 1];
                                            tmpCol[2] = instance_colorData[idc + 2];
                                            tmpCol[3] = instance_colorData[idc + 3];
                                            colorBuffer.updateDirectly(tmpCol, colorBufferIndex);
                                        }

                                        available = available - 1;
                                        used = used + 1;
                                        min = (available < nbQuadInstances) ? available : nbQuadInstances;
                                    }
                                    available = (available > 0) ? available : 0;
                                    this._nbAvailableInstancesPerType[t] = available;
                                }
                            }
                        };

                    }

                    stepI += lodI;
                }
                if (seamX && seamXIndex + 1 == stepI) {
                    seamX = false;
                }
                if (seamZ && seamZIndex + 1 == stepJ) {
                    seamZ = false;
                }
                stepJ += lodJ;
                stepI = 0;
            }

            if (particleMap) {
                sps.setParticles();
                for (let c = 0; c < nbAvailableParticlesPerType.length; c++) {
                    nbAvailableParticlesPerType[c] = nbPerType[c];
                }
            }

            if (instanceMap && nbAvailableInstancesPerType) {
                for (let c = 0; c < nbAvailableInstancesPerType.length; c++) {
                    nbAvailableInstancesPerType[c] = this._sourceMeshes[c].instances.length;
                }
            }

            // ribbon update    
            terrain.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);
            if (this._computeNormals) {
                VertexData.ComputeNormals(positions, this._indices, normals);
            }
            terrain.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
            terrain.updateVerticesData(VertexBuffer.UVKind, uvs, false, false);
            terrain.updateVerticesData(VertexBuffer.ColorKind, colors, false, false);
            terrain._boundingInfo.reConstruct(bbMin, bbMax, terrain._worldMatrix);
        };

        // private modulo, for dealing with negative indexes
        private _mod(a: number, b: number): number {
            return ((a % b) + b) % b;
        }

        /**
         * Updates the mesh terrain size according to the LOD limits and the camera position.
         * Returns the terrain.
         */
        public updateTerrainSize(): DynamicTerrain {
            let remainder = this._terrainSub;                   // the remaining cells at the general current LOD value
            let nb = 0 | 0;                                       // nb of cells in the current LOD limit interval
            let next = 0 | 0;                                     // next cell index, if it exists
            let LODValue = this._LODValue;
            let lod = LODValue + 1;                             // lod value in the current LOD limit interval
            let tsx = 0.0;                                      // current sum of cell sizes on x
            let tsz = 0.0;                                      // current sum of cell sizes on z
            const LODLimits = this._LODLimits;
            const averageSubSizeX = this._averageSubSizeX;
            const averageSubSizeZ = this._averageSubSizeZ;
            for (let l = 0 | 0; l < LODLimits.length; l++) {
                lod = LODValue + l + 1;
                next = (l >= LODLimits.length - 1) ? 0 : LODLimits[l + 1];
                nb = 2 * (LODLimits[l] - next);
                tsx += averageSubSizeX * lod * nb;
                tsz += averageSubSizeZ * lod * nb;
                remainder -= nb;
            }
            tsx += remainder * averageSubSizeX * LODValue;
            tsz += remainder * averageSubSizeZ * LODValue;
            this._terrainSizeX = tsx;
            this._terrainSizeZ = tsz;
            this._terrainHalfSizeX = tsx * 0.5;
            this._terrainHalfSizeZ = tsz * 0.5;
            return this;
        }

        /**
         * Returns the altitude (float) at the coordinates (x, z) of the map.  
         * @param x 
         * @param z 
         * @param {normal: Vector3} (optional)
         * If the optional object {normal: Vector3} is passed, then its property "normal" is updated with the normal vector value at the coordinates (x, z).  
         */
        public getHeightFromMap(x: number, z: number, options?: { normal: Vector3 }): number {
            return DynamicTerrain._GetHeightFromMap(x, z, this._mapData, this._mapSubX, this._mapSubZ, this._mapSizeX, this._mapSizeZ, options, this._inverted);
        }

        /**
         * Static : Returns the altitude (float) at the coordinates (x, z) of the passed map.
         * @param x 
         * @param z 
         * @param mapSubX the number of points along the map width
         * @param mapSubX the number of points along the map height
         * @param {normal: Vector3} (optional)
         * @param inverted (optional boolean) is the terrain inverted
         * If the optional object {normal: Vector3} is passed, then its property "normal" is updated with the normal vector value at the coordinates (x, z).  
         */
        public static GetHeightFromMap(x: number, z: number, mapData: number[] | Float32Array, mapSubX: number, mapSubZ: number, options?: { normal: Vector3 }, inverted?: boolean): number {
            let mapSizeX = Math.abs(mapData[(mapSubX - 1) * 3] - mapData[0]);
            let mapSizeZ = Math.abs(mapData[(mapSubZ - 1) * mapSubX * 3 + 2] - mapData[2]);
            return DynamicTerrain._GetHeightFromMap(x, z, mapData, mapSubX, mapSubZ, mapSizeX, mapSizeZ, options, inverted);
        }

        // Computes the height and optionnally the normal at the coordinates (x ,z) from the passed map
        private static _GetHeightFromMap(x: number, z: number, mapData: number[] | Float32Array, mapSubX: number, mapSubZ: number, mapSizeX: number, mapSizeZ: number, options?: { normal: Vector3 }, inverted?: boolean): number {

            let x0 = mapData[0];
            let z0 = mapData[2];

            // reset x and z in the map space so they are between 0 and the map size
            x = x - Math.floor((x - x0) / mapSizeX) * mapSizeX;
            z = z - Math.floor((z - z0) / mapSizeZ) * mapSizeZ;

            let col1 = Math.floor((x - x0) * mapSubX / mapSizeX);
            let row1 = Math.floor((z - z0) * mapSubZ / mapSizeZ);
            let col2 = (col1 + 1) % mapSubX;
            let row2 = (row1 + 1) % mapSubZ;
            // starting indexes of the positions of 4 vertices defining a quad on the map
            let idx1 = 3 * (row1 * mapSubX + col1);
            let idx2 = 3 * (row1 * mapSubX + col2);
            let idx3 = 3 * ((row2) * mapSubX + col1);
            let idx4 = 3 * ((row2) * mapSubX + col2);

            const v1 = DynamicTerrain._v1;
            const v2 = DynamicTerrain._v2;
            const v3 = DynamicTerrain._v3;
            const v4 = DynamicTerrain._v4;
            v1.copyFromFloats(mapData[idx1], mapData[idx1 + 1], mapData[idx1 + 2]);
            v2.copyFromFloats(mapData[idx2], mapData[idx2 + 1], mapData[idx2 + 2]);
            v3.copyFromFloats(mapData[idx3], mapData[idx3 + 1], mapData[idx3 + 2]);
            v4.copyFromFloats(mapData[idx4], mapData[idx4 + 1], mapData[idx4 + 2]);

            const vAvB = DynamicTerrain._vAvB;
            const vAvC = DynamicTerrain._vAvC;
            const norm = DynamicTerrain._norm;
            const vA = v1;
            let vB;
            let vC;
            let v;

            let xv4v1 = v4.x - v1.x;
            let zv4v1 = v4.z - v1.z;
            if (xv4v1 == 0 || zv4v1 == 0) {
                return v1.y;
            }
            let cd = zv4v1 / xv4v1;
            let h = v1.z - cd * v1.x;
            if (z < cd * x + h) {
                vB = v4;
                vC = v2;
                v = vA;
            }
            else {
                vB = v3;
                vC = v4;
                v = vB;
            }
            vB.subtractToRef(vA, vAvB);
            vC.subtractToRef(vA, vAvC);
            Vector3.CrossToRef(vAvB, vAvC, norm);
            norm.normalize();
            if (inverted) {
                norm.scaleInPlace(-1.0);
            }
            if (options && options.normal) {
                options.normal.copyFrom(norm);
            }
            let d = -(norm.x * v.x + norm.y * v.y + norm.z * v.z);
            let y = v.y;
            if (norm.y != 0.0) {
                y = -(norm.x * x + norm.z * z + d) / norm.y;
            }

            return y;
        }

        /**
         * Static : Computes all the normals from the terrain data map  and stores them in the passed Float32Array reference.  
         * This passed array must have the same size than the mapData array.
         */
        public static ComputeNormalsFromMapToRef(mapData: number[] | Float32Array, mapSubX: number, mapSubZ, normals: number[] | Float32Array, inverted: boolean): void {
            const mapIndices: number[] = [];
            const tmp1 = { normal: Vector3.Zero() };
            const tmp2 = { normal: Vector3.Zero() };
            const normal1 = tmp1.normal;
            const normal2 = tmp2.normal;
            let l = mapSubX * (mapSubZ - 1);
            let i = 0;
            for (i = 0; i < l; i++) {
                mapIndices.push(i + 1, i + mapSubX, i);
                mapIndices.push(i + mapSubX, i + 1, i + mapSubX + 1);
            }
            VertexData.ComputeNormals(mapData, mapIndices, normals);

            // seam process
            let lastIdx = (mapSubX - 1) * 3;
            let colStart = 0;
            let colEnd = 0;
            const getHeightFromMap = DynamicTerrain.GetHeightFromMap;
            for (i = 0; i < mapSubZ; i++) {
                colStart = i * mapSubX * 3;
                colEnd = colStart + lastIdx;
                getHeightFromMap(mapData[colStart], mapData[colStart + 2], mapData, mapSubX, mapSubZ, tmp1);
                getHeightFromMap(mapData[colEnd], mapData[colEnd + 2], mapData, mapSubX, mapSubZ, tmp2);
                normal1.addInPlace(normal2).scaleInPlace(0.5);
                normals[colStart] = normal1.x;
                normals[colStart + 1] = normal1.y;
                normals[colStart + 2] = normal1.z;
                normals[colEnd] = normal1.x;
                normals[colEnd + 1] = normal1.y;
                normals[colEnd + 2] = normal1.z;
            }
            // inverted terrain
            if (inverted) {
                for (i = 0; i < normals.length; i++) {
                    normals[i] = -normals[i];
                }
            }
        }

        /**
         * Computes all the map normals from the current terrain data map and sets them to the terrain.  
         * Returns the terrain.  
         */
        public computeNormalsFromMap(): DynamicTerrain {
            DynamicTerrain.ComputeNormalsFromMapToRef(this._mapData, this._mapSubX, this._mapSubZ, this._mapNormals, this._inverted);
            return this;
        }

        /**
         * Returns true if the World coordinates (x, z) are in the current terrain.
         * @param x 
         * @param z 
         */
        public contains(x: number, z: number): boolean {
            const positions = this._positions;
            const meshPosition = this.mesh.position;
            const terrainIdx = this._terrainIdx;
            if (!positions) { return false; }
            if (x < positions[0] + meshPosition.x || x > positions[3 * terrainIdx] + meshPosition.x) {
                return false;
            }
            if (z < positions[2] + meshPosition.z || z > positions[3 * terrainIdx * terrainIdx + 2] + meshPosition.z) {
                return false;
            }
            return true;
        }

        /**
         * Static : Returns a new data map from the passed heightmap image file.  
         The parameters `width` and `height` (positive floats, default 300) set the map width and height sizes.     
         * `subX` is the wanted number of points along the map width (default 100).  
         * `subZ` is the wanted number of points along the map height (default 100).  
         * The parameter `minHeight` (float, default 0) is the minimum altitude of the map.     
         * The parameter `maxHeight` (float, default 1) is the maximum altitude of the map.   
         * The parameter `colorFilter` (optional Color3, default (0.3, 0.59, 0.11) ) is the filter to apply to the image pixel colors to compute the height.
         * `onReady` is an optional callback function, called once the map is computed. It's passed the computed map.  
         * `scene` is the Scene object whose database will store the downloaded image.  
         */
        public static CreateMapFromHeightMap(heightmapURL: string, options: { width: number, height: number, subX: number, subZ: number, minHeight: number, maxHeight: number, offsetX: number, offsetZ: number, onReady?: (map: number[] | Float32Array, subX: number, subZ: number) => void, colorFilter?: Color3 }, scene: Scene): Float32Array {
            const subX = options.subX || 100;
            const subZ = options.subZ || 100;
            const data = new Float32Array(subX * subZ * 3);
            DynamicTerrain.CreateMapFromHeightMapToRef(heightmapURL, options, data, scene);
            return data;
        }

        /**
         * Static : Updates the passed array or Float32Array with a data map computed from the passed heightmap image file.  
         *  The parameters `width` and `height` (positive floats, default 300) set the map width and height sizes.     
         * `subX` is the wanted number of points along the map width (default 100).  
         * `subZ` is the wanted number of points along the map height (default 100). 
         * The parameter `minHeight` (float, default 0) is the minimum altitude of the map.     
         * The parameter `maxHeight` (float, default 1) is the maximum altitude of the map.   
         * The parameter `colorFilter` (optional Color3, default (0.3, 0.59, 0.11) ) is the filter to apply to the image pixel colors to compute the height.
         * `onReady` is an optional callback function, called once the map is computed. It's passed the computed map.         
         * `scene` is the Scene object whose database will store the downloaded image.  
         * The passed Float32Array must be the right size : 3 x subX x subZ.  
         */
        public static CreateMapFromHeightMapToRef(heightmapURL: string, options: { width: number, height: number, subX: number, subZ: number, minHeight: number, maxHeight: number, offsetX: number, offsetZ: number, onReady?: (map: number[] | Float32Array, subX: number, subZ: number) => void, colorFilter?: Color3 }, data: number[] | Float32Array, scene: Scene): void {
            const width = options.width || 300;
            const height = options.height || 300;
            const subX = options.subX || 100;
            const subZ = options.subZ || 100;
            const minHeight = options.minHeight || 0.0;
            const maxHeight = options.maxHeight || 10.0;
            const offsetX = options.offsetX || 0.0;
            const offsetZ = options.offsetZ || 0.0;
            const filter = options.colorFilter || new Color3(0.3, 0.59, 0.11);
            const onReady = options.onReady;

            const onload = img => {
                // Getting height map data
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                const bufferWidth = img.width;
                const bufferHeight = img.height;
                canvas.width = bufferWidth;
                canvas.height = bufferHeight;
                context?.drawImage(img, 0, 0);
                // Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
                const buffer = <Uint8Array>(<any>context?.getImageData(0, 0, bufferWidth, bufferHeight).data);
                let x = 0.0;
                let y = 0.0;
                let z = 0.0;
                for (let row = 0; row < subZ; row++) {
                    for (let col = 0; col < subX; col++) {
                        x = col * width / subX - width * 0.5;
                        z = row * height / subZ - height * 0.5;
                        let heightmapX = ((x + width * 0.5) / width * (bufferWidth - 1)) | 0;
                        let heightmapY = (bufferHeight - 1) - ((z + height * 0.5) / height * (bufferHeight - 1)) | 0;
                        let pos = (heightmapX + heightmapY * bufferWidth) * 4;
                        let gradient = (buffer[pos] * filter.r + buffer[pos + 1] * filter.g + buffer[pos + 2] * filter.b) / 255.0;
                        y = minHeight + (maxHeight - minHeight) * gradient;
                        let idx = (row * subX + col) * 3;
                        data[idx] = x + offsetX;
                        data[idx + 1] = y;
                        data[idx + 2] = z + offsetZ;
                    }
                }

                // callback function if any
                if (onReady) {
                    onReady(data, subX, subZ);
                }
            }

            Tools.LoadImage(heightmapURL, onload, () => { }, scene.offlineProvider)
        }

        /**
         * Static : Updates the passed arrays with UVs values to fit the whole map with subX points along its width and subZ points along its height.  
         * The passed array must be the right size : subX x subZ x 2.  
         */
        public static CreateUVMapToRef(subX: number, subZ: number, mapUVs: number[] | Float32Array): void {
            for (let h = 0; h < subZ; h++) {
                for (let w = 0; w < subX; w++) {
                    mapUVs[(h * subX + w) * 2] = w / (subX - 1);
                    mapUVs[(h * subX + w) * 2 + 1] = h / (subZ - 1);
                }
            }
        }
        /**
         * Static : Returns a new UV array with values to fit the whole map with subX points along its width and subZ points along its height.  
         */
        public static CreateUVMap(subX: number, subZ: number): Float32Array {
            const mapUVs = new Float32Array(subX * subZ * 2);
            DynamicTerrain.CreateUVMapToRef(subX, subZ, mapUVs);
            return mapUVs;
        }

        /**
         * Computes and sets the terrain UV map with values to fit the whole map.  
         * Returns the terrain.  
         */
        public createUVMap(): DynamicTerrain {
            this.mapUVs = DynamicTerrain.CreateUVMap(this._mapSubX, this._mapSubZ);
            return this;
        }

        /**
         * Internal reimplementation of Matrix.ComposeToRef() in order to skip the former call to result._markAsUpdated(), so faster.
         */
        private static _ComposeToRef(scale: Vector3, rotation: Quaternion, translation: Vector3, m: Float32Array): void {
            var x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = w * x2, wy = w * y2, wz = w * z2;

            var sx = scale.x, sy = scale.y, sz = scale.z;

            m[0] = (1 - (yy + zz)) * sx;
            m[1] = (xy + wz) * sx;
            m[2] = (xz - wy) * sx;
            m[3] = 0;

            m[4] = (xy - wz) * sy;
            m[5] = (1 - (xx + zz)) * sy;
            m[6] = (yz + wx) * sy;
            m[7] = 0;

            m[8] = (xz + wy) * sz;
            m[9] = (yz - wx) * sz;
            m[10] = (1 - (xx + yy)) * sz;
            m[11] = 0;

            m[12] = translation.x;
            m[13] = translation.y;
            m[14] = translation.z;
            m[15] = 1;
        }

        /**
         * 
         * @param source Internal : copies a subpart of the source array to the target array
         * @param start 
         * @param nb 
         * @param target 
         */
        private static _CopyArrayValuesFromToRef(source: Float32Array | Array<number>, start: number, nb: number, target: Float32Array | Array<number>) {
            for (let i = 0; i < nb; i++) {
                target[i] = source[start + i];
            }
        }

        // Getters / Setters
        /**
         * boolean : if the terrain must be recomputed every frame.
         */
        public get refreshEveryFrame(): boolean {
            return this._refreshEveryFrame;
        }
        public set refreshEveryFrame(val: boolean) {
            this._refreshEveryFrame = val;
        }
        /**
         * Mesh : the logical terrain underlying mesh
         */
        public get mesh(): Mesh {
            return this._terrain;
        }
        /**
         * The camera the terrain is linked to
         */
        public get camera(): Camera {
            return this._terrainCamera;
        }
        public set camera(val: Camera) {
            this._terrainCamera = val;
        }
        /**
         * Number of cells flought over by the cam on the X axis before the terrain is updated.
         * Integer greater or equal to 1.
         */
        public get subToleranceX(): number {
            return this._subToleranceX;
        }
        public set subToleranceX(val: number) {
            this._subToleranceX = (val > 0) ? val : 1;
        }
        /**
         * Number of cells flought over by the cam on the Z axis before the terrain is updated.
         * Integer greater or equal to 1. Default 1.
         */
        public get subToleranceZ(): number {
            return this._subToleranceZ;
        }
        public set subToleranceZ(val: number) {
            this._subToleranceZ = (val > 0) ? val : 1;
        }
        /**
         * Initial LOD factor value.
         * Integer greater or equal to 1. Default 1.
         */
        public get initialLOD(): number {
            return this._initialLOD;
        }
        public set initialLOD(val: number) {
            this._initialLOD = (val > 0) ? val : 1;
        }
        /**
        * Current LOD factor value : the lower factor in the terrain.  
        * The LOD value is the sum of the initialLOD and the current cameraLODCorrection.  
        * Integer greater or equal to 1. Default 1.  
        */
        public get LODValue(): number {
            return this._LODValue;
        }
        /**
         * Camera LOD correction : the factor to add to the initial LOD according to the camera position, movement, etc.
         * Positive integer (default 0)  
         */
        public get cameraLODCorrection(): number {
            return this._cameraLODCorrection;
        }
        public set cameraLODCorrection(val: number) {
            this._cameraLODCorrection = (val >= 0) ? val : 0;
        }
        /**
         * Boolean : Does the LOD apply only to the terrain right edge ?
         * Default : true
         */
        public get LODPositiveX(): boolean {
            return this._LODPositiveX;
        }
        public set LODPositiveX(val: boolean) {
            this._LODPositiveX = val;
        }
        /**
         * Boolean : Does the LOD apply only to the terrain left edge ?
         * Default : true
         */
        public get LODNegativeX(): boolean {
            return this._LODNegativeX;
        }
        public set LODNegativeX(val: boolean) {
            this._LODNegativeX = val;
        }
        /**
         * Boolean : Does the LOD apply only to the terrain upper edge ?
         * Default : true
         */
        public get LODPositiveZ(): boolean {
            return this._LODPositiveZ;
        }
        public set LODPositiveZ(val: boolean) {
            this._LODPositiveZ = val;
        }
        /**
         * Boolean : Does the LOD apply only to the terrain lower edge ?
         * Default : true
         */
        public get LODNegativeZ(): boolean {
            return this._LODNegativeZ;
        }
        public set LODNegativeZ(val: boolean) {
            this._LODNegativeZ = val;
        }
        /**
         * Average map and terrain subdivision size on X axis.  
         * Returns a float.
         */
        public get averageSubSizeX(): number {
            return this._averageSubSizeX;
        }
        /**
         * Average map and terrain subdivision size on Z axis.  
         * Returns a float.
         */
        public get averageSubSizeZ(): number {
            return this._averageSubSizeZ;
        }
        /**
         * Current terrain size on the X axis.  
         * Returns a float.
         */
        public get terrainSizeX(): number {
            return this._terrainSizeX;
        }
        /**
         * Current terrain half size on the X axis.  
         * Returns a float.
         */
        public get terrainHalfSizeX(): number {
            return this._terrainHalfSizeX;
        }
        /**
         * Current terrain size on the Z axis.  
         * Returns a float.
         */
        public get terrainSizeZ(): number {
            return this._terrainSizeZ;
        }
        /**
         * Current terrain half size on the Z axis.  
         * Returns a float.
         */
        public get terrainHalfSizeZ(): number {
            return this._terrainHalfSizeZ;
        }
        /**
         * Current position of terrain center in its local space.  
         * Returns a Vector3. 
         */
        public get centerLocal(): Vector3 {
            return this._centerLocal;
        }
        /**
         * Current position of terrain center in the World space.  
         * Returns a Vector3. 
         */
        public get centerWorld(): Vector3 {
            return this._centerWorld;
        }
        /**
         * The array of the limit values to change the LOD factor.  
         * Returns an array of integers or an empty array. 
         * This array is always sorted in the descending order once set.   
         */
        public get LODLimits(): number[] {
            return this._LODLimits;
        }
        public set LODLimits(ar: number[]) {
            ar.sort((a, b) => {
                return b - a;
            });
            this._LODLimits = ar;
        }
        /**
         * The data of the map.
         * A flat array (Float32Array recommeded) of successive 3D float coordinates (x, y, z).  
         * This property can be set only if a mapData array was passed at construction time.  
         */
        public get mapData(): Float32Array | number[] {
            return this._mapData;
        }
        public set mapData(val: Float32Array | number[]) {
            this._mapData = val;
            this._datamap = true;
            const mapSubX = this._mapSubX;
            const mapSubZ = this._mapSubZ;
            this._mapSizeX = Math.abs(val[(mapSubX - 1) * 3] - val[0]);
            this._mapSizeZ = Math.abs(val[(mapSubZ - 1) * mapSubX * 3 + 2] - val[2]);
            this._averageSubSizeX = this._mapSizeX / mapSubX;
            this._averageSubSizeZ = this._mapSizeZ / mapSubZ;
            if (this._precomputeNormalsFromMap) {
                this.computeNormalsFromMap();
            }
            this.update(true);
        }
        /**
         * The number of points on the map width. 
         * Positive Integer.  
         */
        public get mapSubX(): number {
            return this._mapSubX;
        }
        public set mapSubX(val: number) {
            this._mapSubX = val;
        }
        /**
         * The number of points on the map height . 
         * Positive Integer.  
         */
        public get mapSubZ(): number {
            return this._mapSubZ;
        }
        public set mapSubZ(val: number) {
            this._mapSubZ = val;
        }
        /**
         * The map of colors.
         * A flat array of successive floats between 0 and 1 as r,g,b values.  
         * This property can be set only if a mapColors array was passed at construction time.  
         */
        public get mapColors(): Float32Array | number[] {
            return this._mapColors;
        }
        public set mapColors(val: Float32Array | number[]) {
            this._colormap = true;
            this._mapColors = val;
        }
        /**
         * The map of UVs.
         * A flat array of successive floats between 0 and 1 as (u, v) values. 
         * This property can be set only if a mapUVs array was passed at construction time.   
         */
        public get mapUVs(): Float32Array | number[] {
            return this._mapUVs;
        }
        public set mapUVs(val: Float32Array | number[]) {
            this._uvmap = true;
            this._mapUVs = val;
        }
        /**
         * The map of normals.
         * A flat array of successive floats as normal vector coordinates (x, y, z) on each map point.  
         */
        public get mapNormals(): Float32Array | number[] {
            return this._mapNormals;
        }
        public set mapNormals(val: Float32Array | number[]) {
            this._mapNormals = val;
        }
        /**
         * Boolean : must the normals be recomputed on each terrain update (default : false).  
         * By default, all the map normals are pre-computed on terrain creation.
         */
        public get computeNormals(): boolean {
            return this._computeNormals;
        }
        public set computeNormals(val: boolean) {
            this._computeNormals = val;
        }
        /**
         * Boolean : will the custom function updateVertex() be called on each terrain update ?
         * Default false
         */
        public get useCustomVertexFunction(): boolean {
            return this._useCustomVertexFunction;
        }
        public set useCustomVertexFunction(val: boolean) {
            this._useCustomVertexFunction = val;
        }
        /**
         * Boolean : is the terrain always directly selected for rendering ?
         */
        public get isAlwaysVisible(): boolean {
            return this._isAlwaysVisible;
        }
        public set isAlwaysVisible(val) {
            this.mesh.alwaysSelectAsActiveMesh = val;
            this._isAlwaysVisible = val;
        }
        /**
         * Boolean : when assigning a new data map to the existing, shall the normals be automatically precomputed once ?  
         * Default false.  
         */
        public get precomputeNormalsFromMap(): boolean {
            return this._precomputeNormalsFromMap;
        }
        public set precomputeNormalsFromMap(val) {
            this._precomputeNormalsFromMap = val;
        }
        // ===============================================================
        // User custom functions.
        // These following can be overwritten bu the user to fit his needs.


        /**
         * Custom function called for each terrain vertex and passed the :
         * - current vertex {position: Vector3, uvs: Vector2, color: Color4, lodX: integer, lodZ: integer, worldPosition: Vector3, mapIndex: integer}
         * - i : the vertex index on the terrain x axis
         * - j : the vertex index on the terrain x axis
         * This function is called only if the property useCustomVertexFunction is set to true.  
         */
        public updateVertex(vertex, i, j): void {
            return;
        }

        /**
         * Custom function called each frame and passed the terrain camera reference.
         * This should return a positive integer or zero.  
         * Returns zero by default.  
         */
        public updateCameraLOD(terrainCamera: Camera): number {
            // LOD value increases with camera altitude
            var camLOD = 0;
            return camLOD;
        }
        /**
         * Custom function called before each terrain update.
         * The value of reference is passed.  
         * Does nothing by default.  
         */
        public beforeUpdate(refreshEveryFrame: boolean): void {
            return;
        }
        /**
         * Custom function called after each terrain update.
         * The value of refreshEveryFrame is passed.  
         * Does nothing by default.  
         */
        public afterUpdate(refreshEveryFrame: boolean): void {
            return;
        }

    }
}
