
/// <reference path="babylon.d.ts" />
/// <reference path="babylon.scenemanager.ts" />

module BABYLON {
    export class ToolkitPlugin { 
        public static Loader:BABYLON.ISceneLoaderPlugin = null;
        public static Warning(message:string):void { BABYLON.Tools.Warn(message); }
    }
    export class JsonSceneLoader implements BABYLON.ISceneLoaderPlugin {
        public constructor() {}
        public name = "toolkit.json";
        public extensions: BABYLON.ISceneLoaderPluginExtensions = { ".babylon": {isBinary: false}, };
        public canDirectLoad?: (data: string) => boolean;
        public rewriteRootURL?: (rootUrl: string, responseURL?: string) => string;
        public load(scene: BABYLON.Scene, data: any, rootUrl: string): boolean {
            var result:boolean = false;
            if (BABYLON.ToolkitPlugin.Loader != null) {
                result = BABYLON.ToolkitPlugin.Loader.load(scene, data, rootUrl, BABYLON.ToolkitPlugin.Warning);
                if (result === true) {
                    (<any>BABYLON.SceneManager).parseSceneMetadata(rootUrl, scene);
                } else {
                    BABYLON.Tools.Warn("Babylon.js failed to load json scene data");
                }
            } else {
                BABYLON.Tools.Warn("Babylon.js null registered babylon file loader plugin");
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
                    BABYLON.Tools.Warn("Babylon.js failed to load json scene data");
                }
            } else {
                BABYLON.Tools.Warn("Babylon.js null registered babylon file loader plugin");
            }
            return result;
        }
        public loadAssetContainer(scene: BABYLON.Scene, data: string, rootUrl: string, onError?: (message: string, exception?: any) => void): BABYLON.AssetContainer {
            return BABYLON.ToolkitPlugin.Loader.loadAssetContainer(scene, data, rootUrl, onError);
        }
    }
}
// Type definitions for WebAssembly v1 (MVP)
// Project: https://github.com/winksaville/test-webassembly-js-ts
// Definitions by: 01alchemist <https://twitter.com/01alchemist>
//                 Wink Saville <wink@saville.com>
//                 Periklis Tsirakidis <https://github.com/periklis>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
/**
 * The WebAssembly namespace, see [WebAssembly](https://github.com/webassembly)
 * and [WebAssembly JS API](http://webassembly.org/getting-started/js-api/)
 * for more information.
 */
declare namespace WebAssembly {
    type Imports =  Array<{
        name: string;
        kind: string;
    }>;

    type Exports = Array<{
        module: string;
        name: string;
        kind: string;
    }>;

    /**
     * WebAssembly.Module
     */
    class Module {
        constructor(bufferSource: ArrayBuffer | Uint8Array);
        static customSections(module: Module, sectionName: string): ArrayBuffer[];
        static exports(module: Module): Imports;
        static imports(module: Module): Exports;
    }

    /**
     * WebAssembly.Instance
     */
    class Instance {
        readonly exports: any;
        constructor(module: Module, importObject?: any);
    }

    /**
     * WebAssembly.Memory
     * Note: A WebAssembly page has a constant size of 65,536 bytes, i.e., 64KiB.
     */
    interface MemoryDescriptor {
        initial: number;
        maximum?: number;
    }

    class Memory {
        readonly buffer: ArrayBuffer;
        constructor(memoryDescriptor: MemoryDescriptor);
        grow(numPages: number): number;
    }

    /**
     * WebAssembly.Table
     */
    interface TableDescriptor {
        element: "anyfunc";
        initial: number;
        maximum?: number;
    }

    class Table {
        readonly length: number;
        constructor(tableDescriptor: TableDescriptor);
        get(index: number): (args: any[]) => any;
        grow(numElements: number): number;
        set(index: number, value: (args: any[]) => any): void;
    }

    /**
     * Errors
     */
    class CompileError extends Error {
        readonly fileName: string;
        readonly lineNumber: string;
        readonly columnNumber: string;
        constructor(message?: string, fileName?: string, lineNumber?: number);
        toString(): string;
    }

    class LinkError extends Error {
        readonly fileName: string;
        readonly lineNumber: string;
        readonly columnNumber: string;
        constructor(message?: string, fileName?: string, lineNumber?: number);
        toString(): string;
    }

    class RuntimeError extends Error {
        readonly fileName: string;
        readonly lineNumber: string;
        readonly columnNumber: string;
        constructor(message?: string, fileName?: string, lineNumber?: number);
        toString(): string;
    }

    function compile(bufferSource: ArrayBuffer | Uint8Array): Promise<Module>;

    interface ResultObject {
        module: Module;
        instance: Instance;
    }

    function instantiate(bufferSource: ArrayBuffer | Uint8Array, importObject?: any): Promise<ResultObject>;
    function instantiate(module: Module, importObject?: any): Promise<Instance>;

    function validate(bufferSource: ArrayBuffer | Uint8Array): boolean;
}
// ..
// STATS Plugin Support
// ..
declare class Stats {
    public dom:Element;
    public addPanel(panel:any):any;
    public showPanel(type:number):any
    public update(): any;
    public begin(): any;
    public end(): any;
}
// ..
// TVJS Plugin Support
// ..
declare module TVJS {
    interface KeyCodeMap {
        left: number[];
        right: number[];
        up: number[];
        down: number[];
        accept: number[];
    }
    class DirectionalNavigation {
        public static enabled:boolean;        
        public static focusRoot:Element;
        public static keyCodeMap: TVJS.KeyCodeMap;
        public static focusableSelectors: string[];
        public static moveFocus(direction:string|number|Element, options:any): Element;
        public static findNextFocusElement(direction:string|number|Element, options:any): Element;
        public static addEventListener(type, listener, useCapture?:boolean):any;
        public static removeEventListener(type, listener, useCapture?:boolean):any;
    }
}
// ..
// requestAnimationFrame() Original Shim By: Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// ..
var TimerPlugin:any = window;
TimerPlugin.requestAnimFrame = (function() {
	return  TimerPlugin.requestAnimationFrame || 
			TimerPlugin.webkitRequestAnimationFrame || 
			TimerPlugin.mozRequestAnimationFrame || 
			TimerPlugin.oRequestAnimationFrame || 
			TimerPlugin.msRequestAnimationFrame || function(callback, element){ TimerPlugin.setTimeout(callback, 1000 / 60); };
})();
/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
TimerPlugin.requestInterval = function(fn, delay) {
	if( !TimerPlugin.requestAnimationFrame && 
		!TimerPlugin.webkitRequestAnimationFrame && 
		!(TimerPlugin.mozRequestAnimationFrame && TimerPlugin.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
        !TimerPlugin.oRequestAnimationFrame &&
        !TimerPlugin.msRequestAnimationFrame)
			return TimerPlugin.setInterval(fn, delay);
			
    var start = TimerPlugin.getTimeMilliseconds();
	var	handle:any = new Object();
	function loop() {
		var current = TimerPlugin.getTimeMilliseconds(), delta = current - start;
		if(delta >= delay) {
			fn.call();
			start = TimerPlugin.getTimeMilliseconds();
		}
		handle.value = TimerPlugin.requestAnimFrame(loop);
    };
    // ..
	handle.value = TimerPlugin.requestAnimFrame(loop);
	return handle;
}
/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
    TimerPlugin.clearRequestInterval = function(handle) {
    TimerPlugin.cancelAnimationFrame ? TimerPlugin.cancelAnimationFrame(handle.value) :
    TimerPlugin.webkitCancelAnimationFrame ? TimerPlugin.webkitCancelAnimationFrame(handle.value) :
    TimerPlugin.webkitCancelRequestAnimationFrame ? TimerPlugin.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    TimerPlugin.mozCancelRequestAnimationFrame ? TimerPlugin.mozCancelRequestAnimationFrame(handle.value) :
    TimerPlugin.oCancelRequestAnimationFrame	? TimerPlugin.oCancelRequestAnimationFrame(handle.value) :
    TimerPlugin.msCancelRequestAnimationFrame ? TimerPlugin.msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
    handle = null;
};
/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
TimerPlugin.requestTimeout = function(fn, delay) {
	if( !TimerPlugin.requestAnimationFrame      	&& 
		!TimerPlugin.webkitRequestAnimationFrame && 
		!(TimerPlugin.mozRequestAnimationFrame && TimerPlugin.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!TimerPlugin.oRequestAnimationFrame      && 
		!TimerPlugin.msRequestAnimationFrame)
			return TimerPlugin.setTimeout(fn, delay);
			
	var start = TimerPlugin.getTimeMilliseconds();
    var	handle:any = new Object();
	function loop(){
		var current = TimerPlugin.getTimeMilliseconds(), delta = current - start;
		delta >= delay ? fn.call() : handle.value = TimerPlugin.requestAnimFrame(loop);
    };
    // ..
	handle.value = TimerPlugin.requestAnimFrame(loop);
	return handle;
};
/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
TimerPlugin.clearRequestTimeout = function(handle) {
    TimerPlugin.cancelAnimationFrame ? TimerPlugin.cancelAnimationFrame(handle.value) :
    TimerPlugin.webkitCancelAnimationFrame ? TimerPlugin.webkitCancelAnimationFrame(handle.value) :
    TimerPlugin.webkitCancelRequestAnimationFrame ? TimerPlugin.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    TimerPlugin.mozCancelRequestAnimationFrame ? TimerPlugin.mozCancelRequestAnimationFrame(handle.value) :
    TimerPlugin.oCancelRequestAnimationFrame	? TimerPlugin.oCancelRequestAnimationFrame(handle.value) :
    TimerPlugin.msCancelRequestAnimationFrame ? TimerPlugin.msCancelRequestAnimationFrame(handle.value) :
    clearTimeout(handle);
    handle = null;
};
/**
 * Behaves the same as new Date().getTime() except uses the scene manager game time for better performance
 */
TimerPlugin.getTimeMilliseconds = function () {
    var manager:BABYLON.SceneManager = BABYLON.SceneManager.GetInstance();
    return (manager != null) ? (manager.time * 1000) : 0;
}
// ..
// Unversial Windows Platform Support
// ..
if (BABYLON.SceneManager.IsWindows()) {
    if (typeof Windows.UI.ViewManagement !== "undefined" && typeof Windows.UI.ViewManagement.ApplicationViewBoundsMode !== "undefined" && typeof Windows.UI.ViewManagement.ApplicationViewBoundsMode.useCoreWindow !== "undefined") {
        Windows.UI.ViewManagement.ApplicationView.getForCurrentView().setDesiredBoundsMode(Windows.UI.ViewManagement.ApplicationViewBoundsMode.useCoreWindow);
    }
}
// ..
// Register Babylon.js Toolkit Plugins
// ..
if (typeof TVJS !== "undefined" && typeof TVJS.DirectionalNavigation !== "undefined") TVJS.DirectionalNavigation.enabled = false; // Note: Disable Direction Navigation By Default
BABYLON.ToolkitPlugin.Loader = BABYLON.SceneLoader.GetPluginForExtension(".babylon") as BABYLON.ISceneLoaderPlugin;
BABYLON.SceneLoader.RegisterPlugin(new BABYLON.JsonSceneLoader());
BABYLON.Tools.Log("Babylon.js toolkit plugins registered");
