module BABYLON {
    export class DynamicTerrain {

        public name: string;

        private _terrainSub: number;                    // terrain number of subdivisions per axis
        private _mapData: number[] | Float32Array;      // data of the map
        private _terrainIdx: number;                    // actual terrain vertex number per axis
        private _mapSubX: number;                       // map number of subdivisions on X axis
        private _mapSubZ: number;                       // map number of subdivisions on Z axis
        private _mapUVs: number[] | Float32Array;       // UV data of the map
        private _mapColors: number[] | Float32Array;    // Color data of the map
        private _scene: Scene;                          // current scene
        private _subToleranceX: number = 1;             // how many cells flought over thy the camera on the terrain x axis before update
        private _subToleranceZ: number = 1;             // how many cells flought over thy the camera on the terrain z axis before update
        private _mapSubHookX: number = 0;               // x index on the map where the terrain is hooked to
        private _mapSubHookZ: number = 0;               // z index on the map where the terrain is hooked to
        private _LODLimits: number[] = [];              // array of LOD limits
        private _initialLOD: number = 1;                // initial LOD value (integer > 0)
        private _LODValue: number = 1;                  // current LOD value : initial + camera correction
        private _cameraLODCorrection: number = 0;       // LOD correction (integer) according to the camera altitude
        private _oldCorrection: number = 0;             // former correction
        private _terrainCamera: Camera;                 // camera linked to the terrain
        private _terrainData: Vector3[][] = [];         // terrain ribbon path array : array of arrays of Vector3
        private _terrainUV: Vector2[] = [];             // terrain ribbon UV array : array of Vector2
        private _terrainColor: Color4[] = [];           // terrain ribbon color array : array of Color4
        private _deltaX: number = 0.0;                  // camera / terrain x position delta
        private _deltaZ: number = 0.0;                  // camera-/ terrain z position delta
        private _signX: number = 0;                     // x delta sign
        private _signZ: number = 0;                     // z delta sign
        private _deltaSubX: number = 0;                 // map x subdivision delta 
        private _deltaSubZ: number = 0;                 // map z subdivision delta 
        private _mapShiftX: number = 0.0;               // x shift in world space
        private _mapShiftZ: number = 0.0;               // z shift in world space
        private _mapFlgtNb: number = 0;                 // tmp number of map cells flought over by the camera in the delta shift
        private _needsUpdate: boolean = false;          // boolean : the ribbon needs to be recomputed
        private _updateLOD: boolean = false;            // boolean : ribbon recomputation + LOD change
        private _updateForced: boolean = false;         // boolean : forced ribbon recomputation
        private _refreshEveryFrame: boolean = false;      // boolean : to force the terrain computation every frame
        private _datamap: boolean = false;              // boolean : true if an data map is passed as parameter
        private _uvmap: boolean = false;                // boolean : true if an UV map is passed as parameter
        private _colormap: boolean = false;             // boolean : true if an color map is passed as parameter
        private _ribbonOptions: any = {};               // ribbon "options" parameter object
        private _vertex: any = {                        // current vertex object passed to the user custom function
            position: null,                                 // vertex position in the terrain space (Vector3)
            uvs: null,                                      // vertex uv
            color: null,                                    // vertex color (Color4)
            lodX: 1,                                        // vertex LOD value on X axis
            lodZ: 1,                                        // vertex LOD value on Z axis
            worldPosition: Vector3.Zero(),                  // vertex World position
            mapIndex: 0                                     // current map index
        };
        private _averageSubSizeX: number = 0.0;                            // map cell average x size
        private _averageSubSizeZ: number = 0.0;                            // map cell average z size
        private _terrainSizeX: number = 0.0;                               // terrain x size
        private _terrainSizeZ: number = 0.0;                               // terrain y size
        private _terrainHalfSizeX: number = 0.0;
        private _terrainHalfSizeZ: number = 0.0;
        private _centerWorld: Vector3 = BABYLON.Vector3.Zero();             // terrain world center position
        private _centerLocal: Vector3 = BABYLON.Vector3.Zero();             // terrain local center position
        private _terrain: Mesh;                                             // reference to the ribbon

        /**
         * constructor
         * @param name 
         * @param options 
         * @param scene 
         */
        constructor(name: string, options: {
            terrainSub?: number, 
            mapData?: number[]| Float32Array,
            mapSubX?: number, mapSubZ?: number,
            mapUVs?: number[] | Float32Array,
            mapColors?: number[] | Float32Array ,
            camera?: Camera   
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
            
            // initialize the map arrays if not passed as parameters
            this._datamap = (this._mapData) ? true : false;
            this._uvmap = (this._mapUVs) ? true : false;
            this._colormap = (this._mapColors) ? true : false;
            this._mapData = (this._datamap) ? this._mapData : new Float32Array(this._terrainIdx * this._terrainIdx * 3);
            this._mapUVs = (this._uvmap) ? this._mapUVs : new Float32Array(this._terrainIdx * this._terrainIdx * 2);

            // Ribbon creation
            var index = 0;                                          // current vertex index in the map array
            var posIndex = 0;                                       // current position (coords) index in the map array
            var colIndex = 0;                                       // current color index in the color array
            var uvIndex = 0;                                        // current uv index in the uv array
            var color;                                              // current color
            var uv;                                                 // current uv
            var terIndex = 0;                                       // current index in the terrain array
            var y = 0.0;                                            // current y coordinate
            var terrainPath;                                        // current path
            var u = 0.0;                                            // current u of UV
            var v = 0.0;                                            // current v of UV
            var lg = this._terrainIdx + 1;                          // augmented length for the UV to finish before
            for (var j = 0; j <= this._terrainSub; j++) {
                terrainPath = [];
                for (var i = 0; i <= this._terrainSub; i++) {
                    index = ((j * 3 + this._mapSubHookZ) % this._mapSubZ) * this._mapSubX + (i * 3 + this._mapSubHookX) % this._mapSubX;
                    posIndex = index * 3;
                    colIndex = index * 3;
                    uvIndex = index * 2;
                    terIndex = j * this._terrainIdx + i;
                    // geometry
                    if (this._datamap) {
                        y = this._mapData[posIndex + 1];
                    } 
                    else {
                        y = 0.0;
                        this._mapData[3 * terIndex] = i;
                        this._mapData[3 * terIndex + 1] = y;
                        this._mapData[3 * terIndex + 2] = j;
                    }
                    terrainPath.push(new Vector3(i, y, j));
                    // color
                    if (this._colormap) {
                        color = new Color4(this._mapColors[colIndex], this._mapColors[colIndex + 1], this._mapColors[colIndex + 2], 1.0);
                    }
                    else {
                        color = new Color4(1.0, 1.0, 1.0, 1.0);
                    }
                    this._terrainColor.push(color); 
                    // uvs
                    if (this._uvmap) {
                        uv = new Vector2(this._mapUVs[uvIndex], this._mapUVs[uvIndex + 1]);
                    }          
                    else {
                        u = 1.0 - Math.abs(1.0 - 2.0 * i / lg);
                        v = 1.0 - Math.abs(1.0 - 2.0 * j / lg);
                        this._mapUVs[2 * terIndex] = u;
                        this._mapUVs[2 * terIndex + 1] = v;
                        uv = new Vector2(u, v);
                    }
                    this._terrainUV.push(uv);
                }
                this._terrainData.push(terrainPath);
            }
            this._averageSubSizeX = this._mapData[3] - this._mapData[0];                            
            this._averageSubSizeZ = this._mapData[this._mapSubX * 3 + 2] - this._mapData[2];       
            this._ribbonOptions.pathArray = this._terrainData;
            this._ribbonOptions.sideOrientation = BABYLON.Mesh.BACKSIDE;
            this._ribbonOptions.colors = this._terrainColor;
            this._ribbonOptions.uvs = this._terrainUV;
            this._ribbonOptions.updatable = true;
            this._ribbonOptions.instance = null;
            var terrain = MeshBuilder.CreateRibbon("terrain", this._ribbonOptions, this._scene);
            this._terrain = terrain;
            
            // update it immediatly and register the update callback function in the render loop
            this.update(true);
            this._terrain.position.x = this._terrainCamera.globalPosition.x - this._terrainHalfSizeX;
            this._terrain.position.z = this._terrainCamera.globalPosition.z - this._terrainHalfSizeZ;
            this._scene.registerBeforeRender(() => {
                this.beforeUpdate(this._refreshEveryFrame);
                this.update(this._refreshEveryFrame);
                this.afterUpdate(this._refreshEveryFrame);
            });         
        }

        /**
         * Updates the terrain position and shape according to the camera position.
         * `force` : boolean, forces the terrain update even if no camera position change.
         * Returns nothing.
         */
        public update(force: boolean): void {
        
            this._needsUpdate = false;
            this._updateLOD = false;
            this._updateForced = (force) ? true : false;
            this._deltaX = this._terrainHalfSizeX + this._terrain.position.x - this._terrainCamera.globalPosition.x;
            this._deltaZ = this._terrainHalfSizeZ + this._terrain.position.z - this._terrainCamera.globalPosition.z;
            this._oldCorrection = this._cameraLODCorrection;
            this._cameraLODCorrection = (this.updateCameraLOD(this._terrainCamera))|0;
            this._updateLOD = (this._oldCorrection != this._cameraLODCorrection);

            this._LODValue = this._initialLOD + this._cameraLODCorrection;
            this._LODValue = (this._LODValue > 0) ? this._LODValue : 1;
            this._mapShiftX = this._averageSubSizeX * this._subToleranceX * this._LODValue;
            this._mapShiftZ = this._averageSubSizeZ * this._subToleranceZ * this._LODValue;
            
            if (Math.abs(this._deltaX) > this._mapShiftX) {
                this._signX = (this._deltaX > 0.0) ? -1 : 1;
                this._mapFlgtNb = Math.abs(this._deltaX / this._mapShiftX)|0;
                this._terrain.position.x += this._mapShiftX * this._signX * this._mapFlgtNb;
                this._deltaSubX += (this._subToleranceX * this._signX * this._LODValue * this._mapFlgtNb);
                this._needsUpdate = true;
            }
            if (Math.abs(this._deltaZ) > this._mapShiftZ) {
                this._signZ = (this._deltaZ > 0.0) ? -1 : 1;
                this._mapFlgtNb = Math.abs(this._deltaZ / this._mapShiftZ)|0;
                this._terrain.position.z += this._mapShiftZ * this._signZ * this._mapFlgtNb;
                this._deltaSubZ += (this._subToleranceZ * this._signZ * this._LODValue * this._mapFlgtNb);
                this._needsUpdate = true;
            }
            if (this._needsUpdate || this._updateLOD || this._updateForced) {
                this._deltaSubX = (this._deltaSubX + this._mapSubX) % this._mapSubX;
                this._deltaSubZ = (this._deltaSubZ + this._mapSubZ) % this._mapSubZ; 
                this._updateTerrain();
            }
            this._updateForced = false;
            this._updateLOD = false;
            this._centerLocal.x = this._terrainHalfSizeX;
            this._centerLocal.y = this._terrain.position.y;
            this._centerLocal.z = this._terrainHalfSizeZ;
            this._centerWorld.x = this._terrain.position.x + this._terrainHalfSizeX;
            this._centerWorld.y = this._terrain.position.y;
            this._centerWorld.z = this._terrain.position.z + this._terrainHalfSizeZ; 
        }


        // private : updates the underlying ribbon
        private _updateTerrain(): void {
            var stepJ = 0;
            var stepI = 0;
            var LODLimitDown = 0;
            var LODLimitUp = 0;
            var LODValue = this._LODValue;
            var lodI = LODValue;
            var lodJ = LODValue;
            var l = 0;
            var index = 0;          // current vertex index in the map data array
            var posIndex = 0;       // current position index in the map data array
            var colIndex = 0;       // current index in the map color array
            var uvIndex = 0;        // current index in the map uv array
            
            if (this._updateLOD || this._updateForced) {
                this.updateTerrainSize();
            }
            for (var j = 0; j <= this._terrainSub; j++) {
                // LOD Z
                LODValue = this._LODValue;
                for (l = 0; l < this._LODLimits.length; l++) {
                    LODLimitDown = this._LODLimits[l];
                    LODLimitUp = this._terrainSub - LODLimitDown - 1; 
                    if (j < LODLimitDown || j > LODLimitUp) {
                        LODValue = l + 1 + this._LODValue;
                    }
                    lodJ = LODValue; 
                }

                var data = this._terrainData[j];
                var color;
                for (var i = 0; i <= this._terrainSub; i++) {
                    // LOD X
                    LODValue = this._LODValue;
                    for (l = 0; l < this._LODLimits.length; l++) {
                        LODLimitDown = this._LODLimits[l];
                        LODLimitUp = this._terrainSub - LODLimitDown - 1; 
                        if (i < LODLimitDown || i > LODLimitUp) {
                            LODValue = l + 1 + this._LODValue;
                        } 
                        lodI = LODValue;
                    }

                    // map current index
                    index = ((this._deltaSubZ + stepJ + this._mapSubX + this._mapSubHookZ) % this._mapSubZ) * this._mapSubX + (this._deltaSubX + stepI + this._mapSubHookX + this._mapSubX) % this._mapSubX;
            
                    // related index in the array of positions (data map)
                    if (this._datamap) {
                        posIndex = 3 * index;
                    }
                    else {
                        posIndex = 3 * ( ((this._deltaSubZ + stepJ + this._terrainIdx) % this._terrainIdx) * this._terrainIdx + (this._deltaSubX + stepI + this._terrainIdx) % this._terrainIdx );
                    }
                    // related index in the UV map
                    if (this._uvmap) {
                        uvIndex = 2 * index;
                    }
                    else {
                        uvIndex = 2 * ( ((this._deltaSubZ + stepJ + this._terrainIdx) % this._terrainIdx) * this._terrainIdx + (this._deltaSubX + stepI + this._terrainIdx) % this._terrainIdx );
                    }
                    // related index in the color map
                    if (this._colormap) {
                        colIndex = 3 * index;
                    }
                    else {
                        colIndex = 3 * ( ((this._deltaSubZ + stepJ + this._terrainIdx) % this._terrainIdx) * this._terrainIdx + (this._deltaSubX + stepI + this._terrainIdx) % this._terrainIdx );
                    }

                    // geometry
                    data[i].y = this._mapData[posIndex + 1];
                    data[i].x = this._averageSubSizeX * stepI;
                    data[i].z = this._averageSubSizeZ * stepJ;      

                    // color
                    var terrainIndex = j * this._terrainIdx + i;
                    if (this._colormap) {
                        this._terrainColor[terrainIndex].r = this._mapColors[colIndex];
                        this._terrainColor[terrainIndex].g = this._mapColors[colIndex + 1];
                        this._terrainColor[terrainIndex].b = this._mapColors[colIndex + 2];
                    }
                    // uv : the array _mapUVs is always populated
                    this._terrainUV[terrainIndex].x = this._mapUVs[uvIndex];
                    this._terrainUV[terrainIndex].y = this._mapUVs[uvIndex + 1];
                    
                    // call to user custom function with the current updated vertex object
                    this._vertex.position = data[i];
                    this._vertex.worldPosition.x = this._mapData[posIndex];
                    this._vertex.worldPosition.y = this._vertex.position.y;
                    this._vertex.worldPosition.z = this._mapData[posIndex + 2];
                    this._vertex.lodX = lodI;
                    this._vertex.lodZ = lodJ;
                    this._vertex.color = this._terrainColor[terrainIndex];
                    this._vertex.uvs = this._terrainUV[terrainIndex];
                    this._vertex.mapIndex = index;
                    this.updateVertex(this._vertex, i, j);

                    stepI += lodI;
                }
                stepI = 0;
                stepJ += lodJ;
            }

            // ribbon update    
            this._ribbonOptions.instance = this._terrain;                    
            MeshBuilder.CreateRibbon(null, this._ribbonOptions);
        };

        /**
         * Updates the mesh terrain size according to the LOD limits and the camera position.
         * Returns nothing.
         */
        public updateTerrainSize(): void { 
            var remainder = this._terrainSub;                   // the remaining cells at the general current LOD value
            var nb = 0;                                         // nb of cells in the current LOD limit interval
            var next = 0;                                       // next cell index, if it exists
            var lod = this._LODValue + 1;                       // lod value in the current LOD limit interval
            var tsx = 0.0;                                      // current sum of cell sizes on x
            var tsz = 0.0;                                      // current sum of cell sizes on z
            for (var l = 0; l < this._LODLimits.length; l++) {
                lod = this._LODValue + l + 1; 
                next = (l >= this._LODLimits.length - 1) ? 0 : this._LODLimits[l + 1];
                nb = 2 * (this._LODLimits[l] - next);
                tsx += this._averageSubSizeX * lod * nb;
                tsz += this._averageSubSizeZ * lod * nb;
                remainder -= nb;
            }
            tsx += remainder * this._averageSubSizeX * this._LODValue;
            tsz += remainder * this._averageSubSizeZ * this._LODValue;
            this._terrainSizeX = tsx;
            this._terrainSizeZ = tsz;
            this._terrainHalfSizeX = tsx * 0.5;
            this._terrainHalfSizeZ = tsz * 0.5;
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
         * Index in the map subdivisions on the X axis to hook the terrain to.
         * Positive integer (default 0)
         */
        public get mapSubHookX(): number {
            return this._mapSubHookX;
        }
        public set mapSubHookX(val: number) {
            this._mapSubHookX = (val >= 0) ? val : 0;
        }
        /**
         * Index in the map subdivisions on the Z axis to hook the terrain to.
         * Positive integer (default 0)
         */
        public get mapSubHookZ(): number {
            return this._mapSubHookZ;
        }
        public set mapSubHookZ(val: number) {
            this._mapSubHookZ = (val >= 0) ? val : 0;
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
        // ===============================================================
        // User custom functions.
        // These following can be overwritten bu the user to fit his needs.


        /**
         * Custom function called for each terrain vertex and passed the :
         * - current vertex {position: Vector3, uvs: Vector2, color: Color4, lodX: integer, lodZ: integer, worldPosition: Vector3, mapIndex: integer}
         * - i : the vertex index on the terrain x axis
         * - j : the vertex index on the terrain x axis
         */
        public updateVertex(vertex, i, j): void {
            return;
        }

        /**
         * Custom function called each frame and passed the terrain camera reference.
         * This should return a positive integer or zero.
         */
         public updateCameraLOD(terrainCamera: Camera): number {
            // LOD value increases with camera altitude
            var camLOD = Math.abs((terrainCamera.globalPosition.y / 16.0)|0);
            return camLOD;
        }
        /**
         * Custom function called before each terrain update.
         * The value of reference is passed.
         */
        public beforeUpdate(refreshEveryFrame: boolean): void {
            return;
        }
        /**
         * Custom function called after each terrain update.
         * The value of refreshEveryFrame is passed.
         */
        public afterUpdate(refreshEveryFrame: boolean): void {
            return;
        }

    }
}