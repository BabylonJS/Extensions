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
        private _terrainData;
        private _terrainUV;
        private _terrainColor;
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
        private _datamap;
        private _uvmap;
        private _colormap;
        private _ribbonOptions;
        private _vertex;
        private _averageSubSizeX;
        private _averageSubSizeZ;
        private _terrainSizeX;
        private _terrainSizeZ;
        private _terrainHalfSizeX;
        private _terrainHalfSizeZ;
        private _centerWorld;
        private _centerLocal;
        private _terrain;
        /**
         * constructor
         * @param name
         * @param options
         * @param scene
         */
        constructor(name: string, options: {
            terrainSub?: number;
            mapData?: number[] | Float32Array;
            mapSubX?: number;
            mapSubZ?: number;
            mapUVs?: number[] | Float32Array;
            mapColors?: number[] | Float32Array;
            camera?: Camera;
        }, scene: Scene);
        /**
         * Updates the terrain position and shape according to the camera position.
         * `force` : boolean, forces the terrain update even if no camera position change.
         * Returns nothing.
         */
        update(force: boolean): void;
        private _updateTerrain();
        /**
         * Updates the mesh terrain size according to the LOD limits and the camera position.
         * Returns nothing.
         */
        updateTerrainSize(): void;
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
         * Custom function called for each terrain vertex and passed the :
         * - current vertex {position: Vector3, uvs: Vector2, color: Color4, lodX: integer, lodZ: integer, worldPosition: Vector3, mapIndex: integer}
         * - i : the vertex index on the terrain x axis
         * - j : the vertex index on the terrain x axis
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
