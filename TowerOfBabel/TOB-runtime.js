var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    var MeshFactory = (function () {
        function MeshFactory() {
        }
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        MeshFactory.instance = function (moduleName, meshName, cloneSkeleton) {
            var ret;
            for (var i = MeshFactory.MODULES.length - 1; i >= 0; i--) {
                if (moduleName === MeshFactory.MODULES[i].getModuleName()) {
                    ret = MeshFactory.MODULES[i].instance(meshName, cloneSkeleton);
                    break;
                }
            }
            if (!ret)
                BABYLON.Tools.Error('MeshFactory.instance:  module (' + moduleName + ') not loaded');
            return ret;
        };
        MeshFactory.MODULES = new Array();
        return MeshFactory;
    })();
    TOWER_OF_BABEL.MeshFactory = MeshFactory;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));
