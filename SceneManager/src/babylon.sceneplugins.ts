module BABYLON {
    export class ToolkitPlugin { 
        public static Loader:BABYLON.ISceneLoaderPlugin = null;
        public static Warning(message:string):void { BABYLON.Tools.Warn(message); }
    }
    export class JsonSceneLoader implements ISceneLoaderPlugin {
        public constructor() {}
        public name = "toolkit.json";
        public extensions: BABYLON.ISceneLoaderPluginExtensions = {
            ".babylon": {isBinary: false},
        };
        public load(scene: BABYLON.Scene, data: any, rootUrl: string): boolean {
            var result:boolean = false;
            if (BABYLON.ToolkitPlugin.Loader != null) {
                result = BABYLON.ToolkitPlugin.Loader.load(scene, data, rootUrl, BABYLON.ToolkitPlugin.Warning);
                if (result === true) {
                    (<any>BABYLON.SceneManager).parseSceneMetadata(rootUrl, scene);
                } else {
                    BABYLON.Tools.Warn("Toolkit: Failed to load json scene data");
                }
            } else {
                BABYLON.Tools.Warn("Toolkit: Null registered babylon file loader plugin");
            }
            return result;
        }
        public importMesh(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]): boolean {
            var result:boolean = false;
            if (BABYLON.ToolkitPlugin.Loader != null) {
                result = BABYLON.ToolkitPlugin.Loader.importMesh(meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons, BABYLON.ToolkitPlugin.Warning);
                if (result === true) {
                    (<any>BABYLON.SceneManager).parseMeshMetadata(meshes, scene);
                } else {
                    BABYLON.Tools.Warn("Toolkit: Failed to load json scene data");
                }
            } else {
                BABYLON.Tools.Warn("Toolkit: Null registered babylon file loader plugin");
            }
            return result;
        }
    }
    export class BinarySceneLoader implements ISceneLoaderPlugin {
        public constructor() {}
        public name = "toolkit.binary";
        public extensions: BABYLON.ISceneLoaderPluginExtensions = {
            ".bin": {isBinary: true},
        };
        public load(scene: BABYLON.Scene, data: any, rootUrl: string): boolean {
            (<any>window).decoding = true;
            var bytes:Uint8Array = new Uint8Array(data);
            var json:string = BABYLON.Utilities.DecompressToString(bytes);
            (<any>window).decoding = false;
            if (BABYLON.ToolkitPlugin.Loader != null) {
                var result:boolean = BABYLON.ToolkitPlugin.Loader.load(scene, json, rootUrl, BABYLON.ToolkitPlugin.Warning);
                if (result === true) {
                    (<any>BABYLON.SceneManager).parseSceneMetadata(rootUrl, scene);
                } else {
                    BABYLON.Tools.Warn("Toolkit: Failed to load binary scene data");
                }
            } else {
                BABYLON.Tools.Warn("Toolkit: Null registered babylon file loader plugin");
            }
            json = null;
            bytes = null;
            return result;
        }
        public importMesh(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]): boolean {
            (<any>window).decoding = true;
            var bytes:Uint8Array = new Uint8Array(data);
            var json:string = BABYLON.Utilities.DecompressToString(bytes);
            (<any>window).decoding = false;
            if (BABYLON.ToolkitPlugin.Loader != null) {
                var result:boolean =  BABYLON.ToolkitPlugin.Loader.importMesh(meshesNames, scene, json, rootUrl, meshes, particleSystems, skeletons, BABYLON.ToolkitPlugin.Warning);
                if (result === true) {
                    (<any>BABYLON.SceneManager).parseMeshMetadata(meshes, scene);
                } else {
                    BABYLON.Tools.Warn("Toolkit: Failed to load json scene data");
                }
            } else {
                BABYLON.Tools.Warn("Toolkit: Null registered babylon file loader plugin");
            }
            json = null;
            bytes = null;
            return result;
        }
    }
}
BABYLON.ToolkitPlugin.Loader = BABYLON.SceneLoader.GetPluginForExtension(".babylon") as BABYLON.ISceneLoaderPlugin;
BABYLON.SceneLoader.RegisterPlugin(new BABYLON.JsonSceneLoader());
BABYLON.SceneLoader.RegisterPlugin(new BABYLON.BinarySceneLoader());
BABYLON.Tools.Log("Toolkit: Scene manager loader plugins registered");
