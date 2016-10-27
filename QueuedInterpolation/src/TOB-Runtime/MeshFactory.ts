module TOWER_OF_BABEL{
    export interface FactoryModule {
        instance(meshName : string, cloneSkeleton? : boolean) : BABYLON.Mesh;
        getModuleName() : string;
    }
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    export class MeshFactory{
        public static MODULES = new Array<FactoryModule>();
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        public static instance(moduleName : string, meshName : string, cloneSkeleton? : boolean) : BABYLON.Mesh {
            var ret : BABYLON.Mesh;
            for (var i = 0, len = MeshFactory.MODULES.length; i < len; i++){
                if (moduleName === MeshFactory.MODULES[i].getModuleName()){
                    ret = MeshFactory.MODULES[i].instance(meshName, cloneSkeleton);
                    break;
                }
            }
            if (!ret) BABYLON.Tools.Error('MeshFactory.instance:  module (' + moduleName + ') not loaded');
            return ret;
        }
    }
}