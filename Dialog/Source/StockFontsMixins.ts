// file needed so that FontFactory.ts compiles
declare module Font2D {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
declare module Font2D_EXT {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
declare module Font3D {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
declare module Font3D_EXT {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}