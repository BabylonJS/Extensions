declare module BABYLON {
    class DynamicTerrain {
        name: string;
        private _terrainSub;
        private _mapData;
        private _terrainIdx;
        private _mapSubX;
        private _mapSubZ;
        private _mapUVs;
        private _mapColors;
        private _mapNormals;
        private _scene;
        private _subToleranceX;
        private _subToleranceZ;
        private _mapSubHookX;
        private _mapSubHookZ;
        private _LODLimits;
        private _initialLOD;
        private _LODValue;
        private _cameraLODCorrection;
        private _oldCorrection;
        private _terrainCamera;
        private _indices;
        private _positions;
        private _normals;
        private _colors;
        private _uvs;
        private _deltaX;
        private _deltaZ;
        private _signX;
        private _signZ;
        private _deltaSubX;
        private _deltaSubZ;
        private _mapShiftX;
        private _mapShiftZ;
        private _mapFlgtNb;
        private _needsUpdate;
        private _updateLOD;
        private _updateForced;
        private _refreshEveryFrame;
        private _useCustomVertexFunction;
        private _computeNormals;
        private _datamap;
        private _uvmap;
        private _colormap;
        private _vertex;
        private _averageSubSizeX;
        private _averageSubSizeZ;
        private _terrainSizeX;
        private _terrainSizeZ;
        private _terrainHalfSizeX;
        private _terrainHalfSizeZ;
        private _centerWorld;
        private _centerLocal;
        private _mapSizeX;
        private _mapSizeZ;
        private _terrain;
        private _v1;
        private _v2;
        private _v3;
        private _v4;
        private _vAvB;
        private _vAvC;
        private _norm;
        private _bbMin;
        private _bbMax;
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
         * @param {*} mapColors the array of the map Color data (optional) : x, y, z successive float values.
         * @param {*} mapNormals the array of the map normal data (optional) : r,g,b successive values, each between 0 and 1.
         * @param {*} invertSide boolean, to invert the terrain mesh upside down. Default false.
         * @param {*} camera the camera to link the terrain to. Optional, by default the scene active camera
         */
        constructor(name: string, options: {
            terrainSub?: number;
            mapData?: number[] | Float32Array;
            mapSubX?: number;
            mapSubZ?: number;
            mapUVs?: number[] | Float32Array;
            mapColors?: number[] | Float32Array;
            mapNormals?: number[] | Float32Array;
            invertSide?: boolean;
            camera?: Camera;
        }, scene: Scene);
        /**
         * Updates the terrain position and shape according to the camera position.
         * `force` : boolean, forces the terrain update even if no camera position change.
         * Returns nothing.
         */
        update(force: boolean): void;
        private _updateTerrain();
        private _mod(a, b);
        /**
         * Updates the mesh terrain size according to the LOD limits and the camera position.
         * Returns nothing.
         */
        updateTerrainSize(): void;
        /**
         * Returns the altitude (float) at the coordinates (x, z) of the map.
         * @param x
         * @param z
         */
        getHeightFromMap(x: number, z: number, options?: {
            normal: Vector3;
        }): number;
        /**
         * Returns true if the World coordinates (x, z) are in the current terrain.
         * @param x
         * @param z
         */
        contains(x: number, z: number): boolean;
        /**
         * boolean : if the terrain must be recomputed every frame.
         */
        refreshEveryFrame: boolean;
        /**
         * Mesh : the logical terrain underlying mesh
         */
        readonly mesh: Mesh;
        /**
         * Number of cells flought over by the cam on the X axis before the terrain is updated.
         * Integer greater or equal to 1.
         */
        subToleranceX: number;
        /**
         * Number of cells flought over by the cam on the Z axis before the terrain is updated.
         * Integer greater or equal to 1. Default 1.
         */
        subToleranceZ: number;
        /**
         * Index in the map subdivisions on the X axis to hook the terrain to.
         * Positive integer (default 0)
         */
        mapSubHookX: number;
        /**
         * Index in the map subdivisions on the Z axis to hook the terrain to.
         * Positive integer (default 0)
         */
        mapSubHookZ: number;
        /**
         * Initial LOD factor value.
         * Integer greater or equal to 1. Default 1.
         */
        initialLOD: number;
        /**
        * Current LOD factor value : the lower factor in the terrain.
        * The LOD value is the sum of the initialLOD and the current cameraLODCorrection.
        * Integer greater or equal to 1. Default 1.
        */
        readonly LODValue: number;
        /**
         * Camera LOD correction : the factor to add to the initial LOD according to the camera position, movement, etc.
         * Positive integer (default 0)
         */
        cameraLODCorrection: number;
        /**
         * Average map and terrain subdivision size on X axis.
         * Returns a float.
         */
        readonly averageSubSizeX: number;
        /**
         * Average map and terrain subdivision size on Z axis.
         * Returns a float.
         */
        readonly averageSubSizeZ: number;
        /**
         * Current terrain size on the X axis.
         * Returns a float.
         */
        readonly terrainSizeX: number;
        /**
         * Current terrain half size on the X axis.
         * Returns a float.
         */
        readonly terrainHalfSizeX: number;
        /**
         * Current terrain size on the Z axis.
         * Returns a float.
         */
        readonly terrainSizeZ: number;
        /**
         * Current terrain half size on the Z axis.
         * Returns a float.
         */
        readonly terrainHalfSizeZ: number;
        /**
         * Current position of terrain center in its local space.
         * Returns a Vector3.
         */
        readonly centerLocal: Vector3;
        /**
         * Current position of terrain center in the World space.
         * Returns a Vector3.
         */
        readonly centerWorld: Vector3;
        /**
         * The array of the limit values to change the LOD factor.
         * Returns an array of integers or an empty array.
         * This array is always sorted in the descending order once set.
         */
        LODLimits: number[];
        /**
         * The passed map number of subdivisions on the X axis.
         * Positive Integer.
         */
        readonly mapSubX: number;
        /**
         * The passed map number of subdivisions on the Z axis.
         * Positive Integer.
         */
        readonly mapSubZ: number;
        /**
         * Boolean : must the normals be recomputed on each terrain update (default : true)
         */
        computeNormals: boolean;
        /**
         * Boolean : will the custom function updateVertex() be called on each terrain update ?
         * Default false
         */
        useCustomVertexFunction: boolean;
        /**
         * Custom function called for each terrain vertex and passed the :
         * - current vertex {position: Vector3, uvs: Vector2, color: Color4, lodX: integer, lodZ: integer, worldPosition: Vector3, mapIndex: integer}
         * - i : the vertex index on the terrain x axis
         * - j : the vertex index on the terrain x axis
         * This function is called only if the property useCustomVertexFunction is set to true.
         */
        updateVertex(vertex: any, i: any, j: any): void;
        /**
         * Custom function called each frame and passed the terrain camera reference.
         * This should return a positive integer or zero.
         */
        updateCameraLOD(terrainCamera: Camera): number;
        /**
         * Custom function called before each terrain update.
         * The value of reference is passed.
         */
        beforeUpdate(refreshEveryFrame: boolean): void;
        /**
         * Custom function called after each terrain update.
         * The value of refreshEveryFrame is passed.
         */
        afterUpdate(refreshEveryFrame: boolean): void;
    }
}
