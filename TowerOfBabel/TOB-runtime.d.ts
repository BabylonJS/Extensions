declare module TOWER_OF_BABEL {
    interface FactoryModule {
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
        getModuleName(): string;
    }
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    class MeshFactory {
        static MODULES: FactoryModule[];
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        static instance(moduleName: string, meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
