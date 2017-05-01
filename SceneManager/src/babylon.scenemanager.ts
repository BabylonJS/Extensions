module BABYLON {

    export class SceneManager {

        // ********************************** //
        // *  Babylon Static Scene Manager  * //
        // ********************************** //
        
        public static GetInstance(scene: BABYLON.Scene): BABYLON.SceneManager {
            return ((<any>scene).manager) ? (<any>scene).manager as BABYLON.SceneManager : null;
        }
        public static CreateScene(name: string, engine: BABYLON.Engine): BABYLON.Scene {
            var scene: BABYLON.Scene = new BABYLON.Scene(engine);
            BABYLON.SceneManager.parseSceneMetadata("/", name, scene);
            return scene;
        }
        public static LoadScene(rootUrl: string, sceneFilename: string, engine: BABYLON.Engine, onsuccess?: (scene: BABYLON.Scene) => void, progressCallBack?: any, onerror?: (scene: BABYLON.Scene) => void): void {
            var onparse = (scene: BABYLON.Scene) => {
                BABYLON.SceneManager.parseSceneMetadata(rootUrl, sceneFilename, scene);
                if (onsuccess) onsuccess(scene);
            };
            BABYLON.SceneLoader.Append(rootUrl, sceneFilename, new BABYLON.Scene(engine), onparse, progressCallBack, onerror);
        }
        public static ImportMesh(meshesNames: any, rootUrl: string, sceneFilename: string, scene: BABYLON.Scene, onsuccess?: (meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]) => void, progressCallBack?: () => void, onerror?: (scene: BABYLON.Scene, message: string, exception?: any) => void): void {
            var onparse = (meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]) => {
                BABYLON.SceneManager.parseMeshMetadata(meshes, scene);
                if (onsuccess) onsuccess(meshes, particleSystems, skeletons);
            };
            BABYLON.SceneLoader.ImportMesh(meshesNames, rootUrl, sceneFilename, scene, onparse, progressCallBack, onerror);
        }
        public static RegisterLoader(handler: (root: string, name: string) => void): void {
            BABYLON.SceneManager.loader = handler;
        }
        public static ExecuteWhenReady(handler: (scene: BABYLON.Scene, manager: BABYLON.SceneManager) => void): void {
            BABYLON.SceneManager.ready = handler;
        }

        // *********************************** //
        // * Babylon Scene Manager Component * //
        // *********************************** //

        public onrender: () => void = null;
        public controller: BABYLON.SceneController = null;

        private _ie: boolean = false;
        private _url: string = "";
        private _time:number = 0;
        private _timing:boolean = false;
        private _filename: string = "";
        private _render: () => void = null;
        private _running: boolean = false;
        private _markup: string = "";
        private _gui: string = "None";
        private _input: boolean = false;
        private _scene: BABYLON.Scene = null;
        private _navmesh: BABYLON.AbstractMesh = null;
        private _navigation: Navigation = null;
        private _loadQueueIndex:number = 0;
        private _loadQueueCount:number = 0;
        private _loadQueueScenes:string[] = null;
        private _localReadyState:any = null;

        private static keymap: any = {};
        private static prefabs: any = null;
        private static clientx: number = 0;
        private static clienty: number = 0;
        private static mousex: number = 0;
        private static mousey: number = 0;
        private static vertical: number = 0;
        private static horizontal: number = 0;
        private static x_mousex: number = 0;
        private static x_mousey: number = 0;
        private static x_vertical: number = 0;
        private static x_horizontal: number = 0;
        private static k_mousex: number = 0;
        private static k_mousey: number = 0;
        private static k_vertical: number = 0;
        private static k_horizontal: number = 0;
        private static j_mousex: number = 0;
        private static j_mousey: number = 0;
        private static j_vertical: number = 0;
        private static j_horizontal: number = 0;
        private static g_mousex: number = 0;
        private static g_mousey: number = 0;
        private static g_vertical: number = 0;
        private static g_horizontal: number = 0;
        private static engine: BABYLON.Engine = null;
        private static gamepad: BABYLON.Gamepad = null;
        private static gamepads: BABYLON.Gamepads<BABYLON.Gamepad> = null;
        private static gamepadType: BABYLON.GamepadType = BABYLON.GamepadType.None;
        private static gamepadConnected: (pad: BABYLON.Gamepad, kind: BABYLON.GamepadType) => void = null;
        private static gamepadButtonPress: BABYLON.UserInputPress[] = [];
        private static gamepadButtonDown: BABYLON.UserInputAction[] = [];
        private static gamepadButtonUp: BABYLON.UserInputAction[] = [];
        private static gamepadDpadPress: BABYLON.UserInputPress[] = [];
        private static gamepadDpadDown: BABYLON.UserInputAction[] = [];
        private static gamepadDpadUp: BABYLON.UserInputAction[] = [];
        private static gamepadLeftTrigger: BABYLON.UserInputAction[] = [];
        private static gamepadRightTrigger: BABYLON.UserInputAction[] = [];
        private static mouseButtonPress: BABYLON.UserInputPress[] = [];
        private static mouseButtonDown: BABYLON.UserInputAction[] = [];
        private static mouseButtonUp: BABYLON.UserInputAction[] = [];
        private static keyButtonPress: BABYLON.UserInputPress[] = [];
        private static keyButtonDown: BABYLON.UserInputAction[] = [];
        private static keyButtonUp: BABYLON.UserInputAction[] = [];
        private static leftJoystick: BABYLON.VirtualJoystick = null;
        private static rightJoystick: BABYLON.VirtualJoystick = null;
        private static virtualJoystick:boolean = false;
        private static previousPosition: { x: number, y: number } = null;
        private static preventDefault: boolean = false;
        private static rightHanded: boolean = true;
        private static loader: (root: string, name: string) => void = null;
        private static ready: (scene: BABYLON.Scene, manager: BABYLON.SceneManager) => void = null;

        public constructor(rootUrl: string, file: string, scene: BABYLON.Scene) {
            if (scene == null) throw new Error("Null host scene obejct specified.");
            this._ie = document.all ? true : false
            this._url = rootUrl;
            this._time = 0;
            this._timing = false;
            this._filename = file;
            this._scene = scene;
            this._input = false;
            this._navmesh = null;
            this._navigation = null;
            this._loadQueueIndex = 0;
            this._loadQueueCount = 0;
            this._loadQueueScenes = null;

            // Reset local ready state
            this._localReadyState = { state: "localReadyState" };
            this._scene._addPendingData(this._localReadyState);
            BABYLON.Tools.Log("Loading scene assets: " + this._filename);

            // Reset scene manager engine instance
            BABYLON.SceneManager.engine = this._scene.getEngine();
            BABYLON.SceneManager.prefabs = {};
            BABYLON.SceneManager.rightHanded = this._scene.useRightHandedSystem;

            // Parse, create and store component instances
            var ticklist: BABYLON.IScriptComponent[] = [];
            BABYLON.SceneManager.parseSceneCameras(this._scene.cameras, this._scene, ticklist);
            BABYLON.SceneManager.parseSceneLights(this._scene.lights, this._scene, ticklist);
            BABYLON.SceneManager.parseSceneMeshes(this._scene.meshes, this._scene, ticklist);

            // Parse and intialize scene raw metadata properties
            if (this._scene.metadata != null && this._scene.metadata.properties != null) {
                if (this._scene.metadata.properties.controllerPresent) {
                    var sceneController: BABYLON.SceneComponent = this.findSceneController();
                    if (sceneController != null && sceneController instanceof BABYLON.SceneController) {
                        this.controller = (sceneController as BABYLON.SceneController);
                    } else {
                        BABYLON.Tools.Warn("Failed to locate valid BABYLON.SceneController metadata instance");
                    }
                }

                // Parse default html markup
                if (this._scene.metadata.properties.interfaceMode != null) {
                    this._gui = this._scene.metadata.properties.interfaceMode;
                    if (this._scene.metadata.properties.userInterface != null) {
                        var ui: any = this._scene.metadata.properties.userInterface;
                        if (window && ui.embedded && ui.base64 != null) {
                            this._markup = window.atob(ui.base64);
                            if (this._scene.metadata.properties.autoDraw === true && this._gui != null && this._gui !== "" && this._gui !== "None" && this._markup != null && this._markup !== "") {
                                this.drawSceneMarkup(this._markup);
                            }
                        }
                    }
                }
                
                // Parse default navigation mesh
                if (this._scene.metadata.properties.hasNavigationMesh != null && this._scene.metadata.properties.hasNavigationMesh === true) {
                    this._navmesh = this._scene.getMeshByName("sceneNavigationMesh");
                    if (this._navmesh != null) {
                        var navigation: Navigation = this.getNavigationTool();
                        var zoneNodes: any = navigation.buildNodes(this._navmesh);
                        if (zoneNodes != null) {
                            navigation.setZoneData(this.getNavigationZone(), zoneNodes);
                        } else {
                            BABYLON.Tools.Warn("Failed to set scene navigation zone");
                        }
                    } else {
                        BABYLON.Tools.Warn("Failed to load scene navigation mesh(s)");
                    }
                }
            }

            // Register scene component ticklist
            if (ticklist.length > 0) {
                ticklist.sort((left, right): number => {
                    if (left.order < right.order) return -1;
                    if (left.order > right.order) return 1;
                    return 0;
                });
                ticklist.forEach((scriptComponent) => {
                    scriptComponent.instance.register();
                });
            }

            // Scene component start, update and destroy proxies 
            var instance: BABYLON.SceneManager = this;
            this._render = function () {
                if (instance != null) {
                    if (instance._timing && BABYLON.SceneManager.engine != null) {
                        instance._time += (1 / BABYLON.SceneManager.engine.getFps());
                        if (instance._time >= Number.MAX_VALUE) instance._time = 0;
                    }
                    if (instance._input) {
                        BABYLON.SceneManager.updateUserInput();
                    }
                    if (instance._scene != null) {
                        instance._scene.render();
                    }
                    if (instance.onrender != null) {
                        instance.onrender();
                    }
                }
            };
            this._scene.onDispose = function () {
                if (instance != null) {
                    instance.dispose();
                }
            };
        }
        public get ie():boolean {
            return this._ie;
        }
        public get url():string {
            return this._url;
        }
        public dispose(): void {
            BABYLON.SceneManager.engine = null;
            BABYLON.SceneManager.prefabs = {};
            BABYLON.SceneManager.rightHanded = true;
            this.disableUserInput();
            this._gui = null;
            this._render = null;
            this._markup = null;
            this._navmesh = null;
            this._time = 0;
            this._timing = false;
            this._navigation = null;
            this.onrender = null;
            this.controller = null;
            var scenex: any = (<any>this._scene);
            if (scenex.manager) scenex.manager = null;
            scenex = null;
            this._scene = null;
        }
        public isRunning(): boolean {
            return this._running
        }
        public isMobile():boolean {
            var result:boolean = false;
            if (navigator != null && navigator.userAgent != null) {
                var n = navigator.userAgent;
                if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) {
                    result = true;
                }
            } else {
                BABYLON.Tools.Warn("Host navigator user agent is unavailable.");
            }
            return result;
        }
        public getTime():number {
            return this._time;
        }
        public enableTime():void {
            this._time = 0;
            this._timing = true;
        }
        public disableTime():void {
            this._time = 0;
            this._timing = false;
        }
        public loadLevel(name: string, path: string = null): void {
            if (BABYLON.SceneManager.loader != null) {
                var folder: string = (path != null && path !== "") ? path : this.getScenePath();
                this.stop();
                this.clearSceneMarkup();
                this._scene.dispose();
                BABYLON.SceneManager.loader(folder, name);
            } else {
                throw new Error("No scene loader function registered.");
            }
        }
        public randomNumber(min:number, max:number):number {
            if (min === max) return min;
            var random:number = Math.random();
            return ((random * (max - min)) + min);
        }
        public importMeshes(filename:string, onsuccess:()=>void = null, onprogress:()=>void = null, onerror:(scene:BABYLON.Scene, message:string, exception:any)=>void = null):void {
            BABYLON.SceneManager.ImportMesh("", this.getScenePath(), filename, this._scene, (meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[])=>{ if (onsuccess != null) onsuccess(); }, onprogress, onerror);
        }
        public safeDestroy(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, delay:number = 5, disable:boolean = false):void {
            if (disable) owner.setEnabled(false);
            window.setTimeout(()=>{ owner.dispose(); }, delay);
        }
        public getSceneName(): string {
            return this._filename;
        }
        public getScenePath(): string {
            var result: string = "/";
            if (this.url != null && this.url !== "") {
                result = this.url;
            } else {
                if (this._scene.database != null && this._scene.database.currentSceneUrl != null) {
                    var xurl: string = this._scene.database.currentSceneUrl;
                    result = xurl.substr(0, xurl.lastIndexOf("/")) + "/";
                }
            }
            return result;
        }
        public showFullscreen(element:HTMLElement = null): void {
            var fullScreenElement:HTMLElement = (element != null) ? element : document.documentElement;
            BABYLON.Tools.RequestFullscreen(fullScreenElement);
            fullScreenElement.focus();
        }
        public exitFullscreen(): void {
            BABYLON.Tools.ExitFullscreen();
        }

        // ************************************ //
        // * Scene Execute When Ready Support * //
        // ************************************ //
        
        public getLoadingStatus():string {
            var waiting:number = this._scene.getWaitingItemsCount();
            return (waiting > 0) ? "Streaming items..." + waiting + " remaining" : "Loading scene...";
        }        
        private _executeWhenReady():void {
            if (this._scene.metadata != null && this._scene.metadata.imports != null) {
                this._loadQueueIndex = 0;
                this._loadQueueScenes = this._scene.metadata.imports;
                if (this._loadQueueScenes.length > 0) {
                    this._loadQueueCount = this._loadQueueScenes.length
                    this._loadQueueImports();
                } else {
                    this._executeLocalReady();
                }
            } else {
                this._executeLocalReady();
            }
        }
        private _executeLocalReady():void {
            if (BABYLON.SceneManager.ready != null) {
                BABYLON.SceneManager.ready(this._scene, this);
            }
            if (this.controller != null) {
                this.controller.ready();
            }
            if (this._scene.metadata != null && this._scene.metadata.properties != null) {
                if (this._scene.metadata.properties.timeManagement === true) {
                    this.enableTime();
                }
                if (this._scene.metadata.properties.enableUserInput === true) {
                    var joystick:number = this._scene.metadata.properties.virtualJoystickMode;
                    if (joystick !== 0 && this._scene.metadata.properties.virtualJoystickAttached === true) {
                        joystick = 0;
                        BABYLON.Tools.Warn("Virtual joystick camera attached, disabled manual joystick input.");
                    }
                    this.enableUserInput( { 
                        preventDefault: this._scene.metadata.properties.preventDefault,
                        useCapture: this._scene.metadata.properties.useCapture,
                        enableVirtualJoystick: (joystick === 1 || (joystick === 2 && this.isMobile())),
                        disableRightStick: this._scene.metadata.properties.disableRightJoystick
                    });
                }
            }
            if (this._localReadyState != null) {
                this._scene._removePendingData(this._localReadyState);
                this._localReadyState = null;
            }
        }
        private _loadQueueImports() {
            var ctr:number = this._loadQueueIndex + 1;
            if (ctr > this._loadQueueCount) {
                this._loadQueueIndex = 0;
                this._loadQueueCount = 0;
                this._loadQueueScenes = null;
                this._executeLocalReady();
            } else {
                var sceneName:string = this._loadQueueScenes[this._loadQueueIndex];
                BABYLON.Tools.Log("Importing scene meshes: " + sceneName);
                this._loadQueueIndex++;
                this.importMeshes(sceneName, ()=>{
                    this._loadQueueImports();
                }, null, (scene:BABYLON.Scene, message:string, exception:any)=>{
                    BABYLON.Tools.Warn(message);
                    this._loadQueueImports();
                });
            }
        }

        // ********************************** //
        // * Scene Start Stop Pause Support * //
        // ********************************** //

        public start(): void {
            this._running = true;
            this._scene.getEngine().runRenderLoop(this._render);
        }
        public stop(): void {
            this._running = false;
            this._scene.getEngine().stopRenderLoop(this._render);
        }
        public toggle(): void {
            if (!this._running) {
                this.resumeAudio();
                this.start();
            } else {
                this.pauseAudio();
                this.stop();
            }
        }
        public stepFrame(): void {
            if (!this._running) {
                this._render();
            } else {
                this.toggle();
            }
        }
        public pauseAudio(): void {
            if (this._scene.audioEnabled === true) {
                this._scene.audioEnabled = false;
            }
        }
        public resumeAudio(): void {
            if (this._scene.audioEnabled === false) {
                this._scene.audioEnabled = true;
            }
        }

        // ******************************** //
        // *  Scene Debug Helper Support  * //
        // ******************************** //

        public toggleDebug(popups:boolean = false, tab:number = 0, parent:HTMLElement = null): void {
            if (this._scene.debugLayer.isVisible()) {
                this._scene.debugLayer.hide();
            } else {
                this._scene.debugLayer.show({ popup: popups, initialTab: tab, parentElement: parent });
            }
        }
        public traceLights():void {
            if (this._scene.lights != null && this._scene.lights.length > 0) {
                this._scene.lights.forEach((light) => {
                    BABYLON.Tools.Log("Trace Light: " + light.name);
                });
            }
        }
        public traceCameras():void {
            if (this._scene.cameras != null && this._scene.cameras.length > 0) {
                this._scene.cameras.forEach((camera) => {
                    BABYLON.Tools.Log("Trace Camera: " + camera.name);
                });
            }
        }
        public traceMeshes():void {
            if (this._scene.meshes != null && this._scene.meshes.length > 0) {
                this._scene.meshes.forEach((mesh) => {
                    BABYLON.Tools.Log("Trace Mesh: " + mesh.name);
                });
            }
        }
        public dumpPrefabs(): void {
            BABYLON.Tools.Log(BABYLON.SceneManager.prefabs);
        }

        // ********************************* //
        // *  Scene Markup Helper Support  * //
        // ********************************* //

        public getGuiMode(): string {
            return this._gui;
        }
        public getGuiElement(): Element {
            return document.getElementById("gui");
        }
        public getSceneMarkup(): string {
            return this._markup;
        }
        public drawSceneMarkup(markup: string): void {
            if (this._gui === "Html") {
                var element: Element = document.getElementById("gui");
                if (element == null) {
                    var gui: HTMLDivElement = document.createElement("div");
                    gui.id = "gui";
                    gui.style.width = "100%";
                    gui.style.height = "100%";
                    gui.style.opacity = "1";
                    gui.style.zIndex = "10";
                    gui.style.outline = "none";
                    gui.style.backgroundColor = "transparent";
                    document.body.appendChild(gui);
                    gui.innerHTML = markup;
                } else {
                    element.innerHTML = markup;
                }
            } else {
                BABYLON.Tools.Warn("Scene controller gui disabled.");
            }
        }
        public clearSceneMarkup(): void {
            if (this._gui === "Html") {
                var element: Element = document.getElementById("gui");
                if (element != null) {
                    element.innerHTML = "";
                }
            } else {
                BABYLON.Tools.Warn("Scene controller gui disabled.");
            }
        }

        // ********************************** //
        // *   Scene Prefab Clone Support   * //
        // ********************************** //

        public hasPrefabMesh(prefabName:string): boolean {
            var realPrefab:string = "Prefab." + prefabName;
            return (BABYLON.SceneManager.prefabs[realPrefab] != null);
        }
        public getPrefabMesh(prefabName:string): BABYLON.Mesh {
            var result:BABYLON.Mesh = null;
            var realPrefab:string = "Prefab." + prefabName;
            if (this.hasPrefabMesh(prefabName)) {
                result = BABYLON.SceneManager.prefabs[realPrefab] as BABYLON.Mesh;
            }
            return result;
        }
        public instantiatePrefab(prefabName:string, cloneName: string, newPosition:BABYLON.Vector3 = null, newRotation:BABYLON.Vector3 = null, newScaling:BABYLON.Vector3 = null, newParent: Node = null): BABYLON.Mesh {
            var result:BABYLON.Mesh = null;
            var realPrefab:string = "Prefab." + prefabName;
            if (this.hasPrefabMesh(prefabName)) {
                var prefab:BABYLON.Mesh = this.getPrefabMesh(prefabName);
                if (prefab != null) {
                    result = prefab.clone(cloneName, newParent, false, false);
                    if (result != null) {
                        result.name = BABYLON.SceneManager.ReplaceAll(result.name, "Prefab.", "");
                        if (result.parent !== newParent) result.parent = newParent;
                        if (newPosition != null) result.position = newPosition;
                        if (newRotation != null) result.rotation = newRotation;
                        if (newScaling != null) result.scaling = newScaling;
                        // Recurse all prefab clones
                        var clones:BABYLON.Mesh[] = [result];
                        var children:BABYLON.AbstractMesh[] = result.getChildMeshes(false);
                        if (children != null && children.length > 0) {
                            children.forEach((child) => {
                                child.name = BABYLON.SceneManager.ReplaceAll(child.name, "Prefab.", "");
                                clones.push(child as BABYLON.Mesh);
                            });
                        }
                        // Parse cloned mesh source
                        clones.forEach((clone) => {
                            if (clone.source != null) {
                                // Check source skeleton
                                if (clone.source.skeleton != null) {
                                    var skeletonName:string = clone.source.skeleton.name + ".Skeleton";
                                    var skeletonIdentity:string = skeletonName + "." + clone.source.skeleton.id;
                                    clone.skeleton = clone.source.skeleton.clone(skeletonName, skeletonIdentity);
                                }
                            }
                        });
                        // Parse cloned mesh metadata
                        BABYLON.SceneManager.parseMeshMetadata(clones, this._scene);
                    } else {
                        BABYLON.Tools.Warn("Failed to create prefab of: " + realPrefab);
                    }
                } else {
                    BABYLON.Tools.Warn("Failed to lookup prefab map: " + realPrefab);
                }
            } else {
                BABYLON.Tools.Warn("Unable to locate prefab master: " + realPrefab);
            }
            return result;
        }

        // *********************************** //
        // *  Scene Animation State Support  * //
        // *********************************** //

        public playAnimation(name:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, loop:boolean = false, decendants:boolean = true, onAnimationEnd:()=>void = null): BABYLON.Animatable[] {
            var result:BABYLON.Animatable[] = null;
            var attached:boolean = false;
            // Play Primary Owner
            var animation:BABYLON.IAnimationState = this.findSceneAnimationState(name, owner);
            if (animation != null) {
                attached = true;
                var anim:BABYLON.Animatable = this._scene.beginAnimation(owner, animation.start, animation.stop, loop, animation.speed, onAnimationEnd);
                if (anim != null) {
                    if (result == null) result = [];
                    result.push(anim);
                }
            }
            // Play Deep Desecndents
            if (decendants) {
                var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(false);
                if (children != null && children.length > 0) {
                    for (var i:number = 0; i < children.length; i++) {
                        var child:BABYLON.AbstractMesh = children[i];
                        var canimation:BABYLON.IAnimationState = this.findSceneAnimationState(name, child);
                        if (canimation != null) {
                            var chandler:()=>void = null;
                            if (attached === false) {
                                attached = true;
                                chandler = onAnimationEnd;
                            }
                            var canim:BABYLON.Animatable = this._scene.beginAnimation(child, canimation.start, canimation.stop, loop, canimation.speed, chandler);
                            if (canim != null) {
                                if (result == null) result = [];
                                result.push(canim);
                            }
                        }
                    }
                }
            }
            return result;
        }
        public getAnimationState(name:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, decendants:boolean = true): BABYLON.IAnimationState {
            var result:BABYLON.IAnimationState = null;
            // Check Primary Owner
            var animation:BABYLON.IAnimationState = this.findSceneAnimationState(name, owner);
            if (animation != null) {
                result = animation;
            }
            // Check Deep Desecndents
            if (result == null && decendants) {
                var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(false);
                if (children != null && children.length > 0) {
                    for (var i:number = 0; i < children.length; i++) {
                        var child:BABYLON.AbstractMesh = children[i];
                        var canimation:BABYLON.IAnimationState = this.findSceneAnimationState(name, child);
                        if (canimation != null) {
                            result = canimation;
                            break;
                        }
                    }
                }
            }
            return result;
        }

        // *********************************** //
        // *  Scene Owner Component Support  * //
        // *********************************** //

        public getOwnerMetadata(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ObjectMetadata {
            var result: BABYLON.ObjectMetadata = null;
            if (owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                result = new BABYLON.ObjectMetadata(metadata);
            }
            return result;
        }
        public getOwnerChildMesh(name:string, owner:BABYLON.AbstractMesh, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            var result:BABYLON.AbstractMesh = null;
            var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(directDecendantsOnly, predicate);
            if (children != null && children.length > 0) {
                for (var i:number = 0; i < children.length; i++) {
                    var child:BABYLON.AbstractMesh = children[i];
                    if (child.name === name) {
                        result = child;
                        break;
                    }
                }
            }
            if (result == null) result = owner;
            return result;            
        }
        public getOwnerCollisionMesh(owner:BABYLON.AbstractMesh, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            var result:BABYLON.AbstractMesh = null;
            var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(directDecendantsOnly, predicate);
            if (children != null && children.length > 0) {
                for (var i:number = 0; i < children.length; i++) {
                    var child:BABYLON.AbstractMesh = children[i];
                    if (child.name === "Collider" || child.name.indexOf("_Collider") >= 0 || child.name.indexOf(":Collider") >= 0) {
                        result = child;
                        break;
                    }
                }
            }
            if (result == null) result = owner;
            return result;            
        }

        // ************************************ //
        // *  Scene Component Helper Support  * //
        // ************************************ //

        public addSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, enableUpdate: boolean = true, propertyBag: any = {}): BABYLON.SceneComponent {
            var result: BABYLON.SceneComponent = null;
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (klass == null || klass === "") throw new Error("Null scene obejct klass specified.");
            if (owner.metadata == null || !owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = {
                    api: true,
                    type: "Babylon",
                    prefab: false,
                    objectName: "Scene Component",
                    objectId: "0",
                    tagName: "Untagged",
                    layerIndex: 0,
                    layerName: "Default",
                    areaIndex: -1,
                    navAgent: null,
                    meshLink: null,
                    meshObstacle: null,
                    animationStates: [],
                    animationEvents: [],
                    collisionEvent: null,
                    collisionTags: [],
                    components: [],
                    properties: {}
                };
                owner.metadata = metadata;
            }
            if (owner.metadata != null && owner.metadata.api) {
                if (owner.metadata.disposal == null || owner.metadata.disposal === false) {
                    owner.onDispose = () => { BABYLON.SceneManager.destroySceneComponents(owner); };
                    owner.metadata.disposal = true;
                }
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.components == null) {
                    metadata.components = [];
                }
                if (metadata.components != null) {
                    var SceneComponentClass = BABYLON.Tools.Instantiate(klass);
                    if (SceneComponentClass != null) {
                        result = new SceneComponentClass(owner, this._scene, enableUpdate, propertyBag);
                        if (result != null) {
                            var compscript: BABYLON.IScriptComponent = {
                                order: 1000,
                                name: "BabylonScriptComponent",
                                klass: klass,
                                update: enableUpdate,
                                controller: false,
                                properties: propertyBag,
                                instance: result,
                                tag: {}
                            };
                            metadata.components.push(compscript);
                            result.register();
                        } else {
                            if (console) console.error("Failed to create component instance");
                        }
                    } else {
                        if (console) console.error("Failed to create component class");
                    }
                } else {
                    if (console) console.error("Failed to parse metadata components");
                }
            } else {
                if (console) console.error("Null owner object metadata");
            }
            return result;
        }
        public createSceneController(klass: string): BABYLON.SceneController {
            if (this.controller == null) {
                this.controller = this.addSceneComponent(klass, new BABYLON.Mesh("SceneController", this._scene)) as BABYLON.SceneController;
                if (this.controller != null) {
                    this.controller.ready();
                }
            } else {
                throw new Error("Scene controller already exists.");
            }
            return this.controller;
        }

        // ************************************ //
        // *  Scene Component Search Support  * //
        // ************************************ //
        
        public findSceneController(): BABYLON.SceneController {
            var meshes: BABYLON.AbstractMesh[] = this._scene.meshes;
            var result: BABYLON.SceneController = null;
            if (meshes != null && meshes.length > 0) {
                for (var ii: number = 0; ii < meshes.length; ii++) {
                    var mesh: BABYLON.AbstractMesh = meshes[ii];
                    if (mesh.metadata != null && mesh.metadata.api) {
                        var metadata: BABYLON.IObjectMetadata = mesh.metadata as BABYLON.IObjectMetadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            for (var iii: number = 0; iii < metadata.components.length; iii++) {
                                var meshscript: BABYLON.IScriptComponent = metadata.components[iii];
                                if (meshscript.instance != null && meshscript.controller === true) {
                                    result = meshscript.instance as BABYLON.SceneController;
                                    break;
                                }
                            }
                        }
                    }
                    if (result != null) break;
                }
            }
            return result;
        }
        public findSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.SceneComponent {
            var result: BABYLON.SceneComponent = null;
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    for (var ii: number = 0; ii < metadata.components.length; ii++) {
                        var ownerscript: BABYLON.IScriptComponent = metadata.components[ii];
                        if (ownerscript.instance != null && ownerscript.klass === klass) {
                            result = ownerscript.instance;
                            break;
                        }
                    }
                }
            }
            return result;
        }
        public findSceneComponents(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.SceneComponent[] {
            var result: BABYLON.SceneComponent[] = [];
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    for (var ii: number = 0; ii < metadata.components.length; ii++) {
                        var ownerscript: BABYLON.IScriptComponent = metadata.components[ii];
                        if (ownerscript.instance != null && ownerscript.klass === klass) {
                            result.push(ownerscript.instance);
                        }
                    }
                }
            }
            return result;
        }
        public findSceneAnimationState(name:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.IAnimationState {
            var result:BABYLON.IAnimationState = null;
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.animationStates != null && metadata.animationStates.length > 0) {
                    var ii:number = 0;
                    for(ii = 0; ii < metadata.animationStates.length; ii++) {
                        if (metadata.animationStates[ii].name === name) {
                            result = metadata.animationStates[ii];
                            break;
                        }
                    }
                }
            }
            return result;
        }
        public findSceneParticleSystem(name:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ParticleSystem {
            var result:BABYLON.ParticleSystem = null;
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (this._scene.particleSystems != null && this._scene.particleSystems.length > 0) {
                var psystems:number = this._scene.particleSystems.length;
                for (var ii:number = 0; ii < psystems; ii++) {
                    var psystem:BABYLON.ParticleSystem = this._scene.particleSystems[ii];
                    if (psystem.emitter === owner && psystem.name === name) {
                        result = psystem;
                        break;
                    }
                }
            }
            return result;
        }
        public findSceneParticleSystems(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ParticleSystem[] {
            var result:BABYLON.ParticleSystem[] = [];
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (this._scene.particleSystems != null && this._scene.particleSystems.length > 0) {
                this._scene.particleSystems.forEach((psystem) => {
                    if (psystem.emitter === owner) {
                        result.push(psystem);
                    }
                });
            }
            return result;
        }
        public findSceneLensFlareSystem(name:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.LensFlareSystem {
            var result:BABYLON.LensFlareSystem = null;
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (this._scene.lensFlareSystems != null && this._scene.lensFlareSystems.length > 0) {
                var fsystems:number = this._scene.lensFlareSystems.length;
                for (var ii:number = 0; ii < fsystems; ii++) {
                    var fsystem:BABYLON.LensFlareSystem = this._scene.lensFlareSystems[ii];
                    if (fsystem.getEmitter() === owner && fsystem.name === name) {
                        result = fsystem;
                        break;
                    }
                }
            }
            return result;
        }
        public findSceneLensFlareSystems(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.LensFlareSystem[] {
            var result:BABYLON.LensFlareSystem[] = [];
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (this._scene.lensFlareSystems != null && this._scene.lensFlareSystems.length > 0) {
                this._scene.lensFlareSystems.forEach((fsystem) => {
                    if (fsystem.getEmitter() === owner) {
                        result.push(fsystem);
                    }
                });
            }
            return result;
        }

        // ********************************* //
        // *   Scene Input State Support   * //
        // ********************************* //

        public resetUserInput(): void {
            BABYLON.SceneManager.keymap = {};
            BABYLON.SceneManager.clientx = 0;
            BABYLON.SceneManager.clienty = 0;
            BABYLON.SceneManager.mousex = 0;
            BABYLON.SceneManager.mousey = 0;
            BABYLON.SceneManager.vertical = 0;
            BABYLON.SceneManager.horizontal = 0;
            BABYLON.SceneManager.x_mousex = 0;
            BABYLON.SceneManager.x_mousey = 0;
            BABYLON.SceneManager.x_vertical = 0;
            BABYLON.SceneManager.x_horizontal = 0;
            BABYLON.SceneManager.k_mousex = 0;
            BABYLON.SceneManager.k_mousey = 0;
            BABYLON.SceneManager.k_vertical = 0;
            BABYLON.SceneManager.k_horizontal = 0;
            BABYLON.SceneManager.j_mousex = 0;
            BABYLON.SceneManager.j_mousey = 0;
            BABYLON.SceneManager.j_vertical = 0;
            BABYLON.SceneManager.j_horizontal = 0;
            BABYLON.SceneManager.g_mousex = 0;
            BABYLON.SceneManager.g_mousey = 0;
            BABYLON.SceneManager.g_vertical = 0;
            BABYLON.SceneManager.g_horizontal = 0;
            BABYLON.SceneManager.preventDefault = false;
            BABYLON.SceneManager.gamepadButtonUp = [];
            BABYLON.SceneManager.gamepadButtonDown = [];
            BABYLON.SceneManager.gamepadButtonPress = [];
            BABYLON.SceneManager.gamepadDpadUp = [];
            BABYLON.SceneManager.gamepadDpadDown = [];
            BABYLON.SceneManager.gamepadDpadPress = [];
            BABYLON.SceneManager.gamepadLeftTrigger = [];
            BABYLON.SceneManager.gamepadRightTrigger = [];
            BABYLON.SceneManager.mouseButtonUp = [];
            BABYLON.SceneManager.mouseButtonDown = [];
            BABYLON.SceneManager.mouseButtonPress = [];
            BABYLON.SceneManager.keyButtonUp = [];
            BABYLON.SceneManager.keyButtonDown = [];
            BABYLON.SceneManager.keyButtonPress = [];
        }
        public enableUserInput(options: { preventDefault?: boolean, useCapture?: boolean, enableVirtualJoystick?: boolean, disableRightStick?:boolean, gamepadConnected?: (pad: BABYLON.Gamepad, kind: BABYLON.GamepadType) => void } = null): void {
            var preventDefault: boolean = (options != null && options.preventDefault) ? options.preventDefault : false;
            var useCapture: boolean = (options != null && options.useCapture) ? options.useCapture : false;
            var enableVirtualJoystick: boolean = (options != null && options.enableVirtualJoystick) ? options.enableVirtualJoystick : false;
            var disableRightJoystick: boolean = (options != null && options.disableRightStick) ? options.disableRightStick : false;
            var gamepadConnected: (pad: BABYLON.Gamepad, kind: BABYLON.GamepadType) => void = (options != null && options.gamepadConnected) ? options.gamepadConnected : null;
            if (!this._input) {
                this.resetUserInput();
                // Document element event listeners
                document.documentElement.tabIndex = 1;
                document.documentElement.addEventListener("keyup", BABYLON.SceneManager.inputKeyUpHandler, useCapture);
                document.documentElement.addEventListener("keydown", BABYLON.SceneManager.inputKeyDownHandler, useCapture);
                document.documentElement.addEventListener("pointerup", BABYLON.SceneManager.inputPointerUpHandler, useCapture);
                document.documentElement.addEventListener("pointerdown", BABYLON.SceneManager.inputPointerDownHandler, useCapture);
                document.documentElement.addEventListener("pointermove", BABYLON.SceneManager.inputPointerMoveHandler, useCapture);
                BABYLON.SceneManager.preventDefault = preventDefault;
                // Note: Only Enable Gamepad Controllers Once
                if (BABYLON.SceneManager.gamepads == null) {
                    BABYLON.SceneManager.gamepadConnected = gamepadConnected;
                    BABYLON.SceneManager.gamepads = new BABYLON.Gamepads<BABYLON.Gamepad>((pad: BABYLON.Gamepad) => { BABYLON.SceneManager.inputGamepadConnected(pad); });
                }
                // Note: Only Enable Virtual Joysticks Once
                if (BABYLON.SceneManager.virtualJoystick === false) {
                    BABYLON.SceneManager.virtualJoystick = enableVirtualJoystick;
                    if (BABYLON.SceneManager.virtualJoystick === true) {
                        if (BABYLON.SceneManager.leftJoystick == null) {
                            BABYLON.SceneManager.leftJoystick = new BABYLON.VirtualJoystick(true);
                            BABYLON.SceneManager.leftJoystick.setJoystickSensibility(BABYLON.UserInputOptions.JoystickLeftSensibility * 5);
                        }
                        if (disableRightJoystick === false && BABYLON.SceneManager.rightJoystick == null) {
                            BABYLON.SceneManager.rightJoystick = new BABYLON.VirtualJoystick(false);
                            BABYLON.SceneManager.rightJoystick.reverseUpDown = true;
                            BABYLON.SceneManager.rightJoystick.setJoystickSensibility(BABYLON.UserInputOptions.JoystickRightSensibility * 5);
                            BABYLON.SceneManager.rightJoystick.setJoystickColor(BABYLON.UserInputOptions.JoystickRightHandleColor);
                        }
                    }
                }

                this._input = true;
                document.documentElement.focus();
            }
        }
        public disableUserInput(useCapture: boolean = false): void {
            if (this._input) {
                document.documentElement.removeEventListener("keyup", BABYLON.SceneManager.inputKeyUpHandler, useCapture);
                document.documentElement.removeEventListener("keydown", BABYLON.SceneManager.inputKeyDownHandler, useCapture);
                document.documentElement.removeEventListener("pointerup", BABYLON.SceneManager.inputPointerUpHandler, useCapture);
                document.documentElement.removeEventListener("pointerdown", BABYLON.SceneManager.inputPointerDownHandler, useCapture);
                document.documentElement.removeEventListener("pointermove", BABYLON.SceneManager.inputPointerMoveHandler, useCapture);
                BABYLON.SceneManager.preventDefault = false;
                this.resetUserInput();
                this._input = false;
            }
        }
        public getUserInput(input: BABYLON.UserInputAxis): number {
            var result: number = 0;
            if (this._input) {
                switch (input) {
                    case BABYLON.UserInputAxis.Vertical:
                    case BABYLON.UserInputAxis.Horizontal:
                        result = (input === BABYLON.UserInputAxis.Horizontal) ? BABYLON.SceneManager.horizontal : BABYLON.SceneManager.vertical;
                        break;
                    case BABYLON.UserInputAxis.MouseX:
                    case BABYLON.UserInputAxis.MouseY:
                        result = (input === BABYLON.UserInputAxis.MouseX) ? BABYLON.SceneManager.mousex : BABYLON.SceneManager.mousey;
                        break;
                    case BABYLON.UserInputAxis.ClientX:
                    case BABYLON.UserInputAxis.ClientY:
                        result = (input === BABYLON.UserInputAxis.ClientX) ? BABYLON.SceneManager.clientx : BABYLON.SceneManager.clienty;
                        break;
                }
            }
            return result;
        }

        // ********************************* //
        // *  Scene Keycode State Support  * //
        // ********************************* //

        public onKeyUp(callback: (keycode: number) => void): void {
            if (this._input) BABYLON.SceneManager.keyButtonUp.push(callback);
        }
        public onKeyDown(callback: (keycode: number) => void): void {
            if (this._input) BABYLON.SceneManager.keyButtonDown.push(callback);
        }
        public onKeyPress(keycode: number, callback: () => void): void {
            if (this._input) BABYLON.SceneManager.keyButtonPress.push({ index: keycode, action: callback });
        }
        public getKeyInput(keycode: number): boolean {
            var result: boolean = false;
            if (this._input) {
                var key: string = "k" + keycode.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        }

        // ********************************* //
        // *   Scene Mouse State Support   * //
        // ********************************* //

        public onPointerUp(callback: (button: number) => void): void {
            if (this._input) BABYLON.SceneManager.mouseButtonUp.push(callback);
        }
        public onPointerDown(callback: (button: number) => void): void {
            if (this._input) BABYLON.SceneManager.mouseButtonDown.push(callback);
        }
        public onPointerPress(button: number, callback: () => void): void {
            if (this._input) BABYLON.SceneManager.mouseButtonPress.push({ index: button, action: callback });
        }
        public getPointerInput(button: number): boolean {
            var result: boolean = false;
            if (this._input) {
                var key: string = "p" + button.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        }

        // ********************************* //
        // *  Scene Gamepad State Support  * //
        // ********************************* //

        public onButtonUp(callback: (button: number) => void): void {
            if (this._input) BABYLON.SceneManager.gamepadButtonUp.push(callback);
        }
        public onButtonDown(callback: (button: number) => void): void {
            if (this._input) BABYLON.SceneManager.gamepadButtonDown.push(callback);
        }
        public onButtonPress(button: number, callback: () => void): void {
            if (this._input) BABYLON.SceneManager.gamepadButtonPress.push({ index: button, action: callback });
        }
        public getButtonInput(button: number): boolean {
            var result: boolean = false;
            if (this._input) {
                var key: string = "b" + button.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        }
        public onDpadUp(callback: (direction: number) => void): void {
            if (this._input) BABYLON.SceneManager.gamepadDpadUp.push(callback);
        }
        public onDpadDown(callback: (direction: number) => void): void {
            if (this._input) BABYLON.SceneManager.gamepadDpadDown.push(callback);
        }
        public onDpadPress(direction: number, callback: () => void): void {
            if (this._input) BABYLON.SceneManager.gamepadDpadPress.push({ index: direction, action: callback });
        }
        public getDpadInput(direction: number): boolean {
            var result: boolean = false;
            if (this._input) {
                var key: string = "d" + direction.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        }
        public onTriggerLeft(callback: (value: number) => void): void {
            if (this._input) BABYLON.SceneManager.gamepadLeftTrigger.push(callback);
        }
        public onTriggerRight(callback: (value: number) => void): void {
            if (this._input) BABYLON.SceneManager.gamepadRightTrigger.push(callback);
        }
        public getTriggerInput(trigger: number): number {
            var result: number = 0;
            if (this._input) {
                var key: string = "t" + trigger.toString();
                if (BABYLON.SceneManager.keymap[key] != null) {
                    result = BABYLON.SceneManager.keymap[key];
                }
            }
            return result;
        }
        public getConnectedGamepad(): BABYLON.Gamepad {
            return (this._input) ? BABYLON.SceneManager.gamepad : null;
        }
        public getConnectedGamepadType(): BABYLON.GamepadType {
            return (this._input) ? BABYLON.SceneManager.gamepadType : BABYLON.GamepadType.None;
        }
        public disposeConnectedGamepad(): void {
            if (this._input) {
                if (BABYLON.SceneManager.gamepads != null) {
                    BABYLON.SceneManager.gamepads.dispose();
                    BABYLON.SceneManager.gamepads = null;
                }
                BABYLON.SceneManager.gamepad = null;
                BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.None;
                BABYLON.SceneManager.gamepadConnected = null;
            }
        }

        // ********************************** //
        // *  Scene Joystick State Support  * //
        // ********************************** //

        public getLeftJoystick(): BABYLON.VirtualJoystick {
            return (this._input) ? BABYLON.SceneManager.leftJoystick : null;
        }
        public getRightJoystick(): BABYLON.VirtualJoystick {
            return (this._input) ? BABYLON.SceneManager.rightJoystick : null;
        }
        public getJoystickPress(button:number): boolean {
            var result: boolean = false;
            if (this._input) {
                if (button === BABYLON.JoystickButton.Left && BABYLON.SceneManager.leftJoystick != null && BABYLON.SceneManager.leftJoystick.pressed === true) {
                    result = true;
                } else if (button === BABYLON.JoystickButton.Right && BABYLON.SceneManager.rightJoystick != null && BABYLON.SceneManager.rightJoystick.pressed === true) {
                    result = true;
                }
            }
            return result;
        }
        public disposeVirtualJoysticks(): void {
            if (this._input) {
                if (BABYLON.SceneManager.leftJoystick != null) {
                    BABYLON.SceneManager.leftJoystick.releaseCanvas();
                    BABYLON.SceneManager.leftJoystick = null;
                }
                if (BABYLON.SceneManager.rightJoystick != null) {
                    BABYLON.SceneManager.rightJoystick.releaseCanvas();
                    BABYLON.SceneManager.rightJoystick = null;
                }
                BABYLON.SceneManager.virtualJoystick = false;
            }
        }

        // ************************************ //
        // *   Update Camera Helper Support   * //
        // ************************************ //

        public switchActiveCamera(camera:BABYLON.Camera, updatePosition:boolean = false, attachedCanvas:HTMLCanvasElement = null, disposeActiveCamera:boolean = false):void {
            // TODO: Dunno About updatePostion and attachedCamera options - ???
            if (camera !== this._scene.activeCamera) {
                var oldCamera:any = this._scene.activeCamera;
                var newCamera:any = camera;
                if (updatePosition && oldCamera.position) {
                    newCamera.position = oldCamera.position.clone();
                }
                if (oldCamera.rotation) {
                    newCamera.rotation = oldCamera.rotation.clone();
                }
                if (oldCamera.ellipsoid) {
                    newCamera.ellipsoid = oldCamera.ellipsoid.clone();
                }
                newCamera.fov = oldCamera.fov;
                newCamera.minZ = oldCamera.minZ;
                newCamera.maxZ = oldCamera.maxZ;
                newCamera.checkCollisions = oldCamera.checkCollisions;
                newCamera.applyGravity = oldCamera.applyGravity;
                newCamera.speed = oldCamera.speed;
                newCamera.postProcesses = oldCamera.postProcesses;
                oldCamera.postProcesses = [];
                if (attachedCanvas != null) {
                    oldCamera.detachControl(attachedCanvas);
                }
                if (disposeActiveCamera === true) {
                    if (oldCamera.dispose) oldCamera.dispose();
                } else {
                    if (oldCamera.setEnabled) oldCamera.setEnabled(false);
                }
                if (newCamera.setEnabled) newCamera.setEnabled(true);
                this._scene.activeCamera = newCamera;
                if (attachedCanvas != null) {
                    this._scene.activeCamera.attachControl(attachedCanvas);
                }
            }
        }
        public updateCameraPosition(camera: BABYLON.FreeCamera, horizontal: number, vertical: number, speed: number): void {
            if (camera != null) {
                var local = camera._computeLocalCameraSpeed() * speed;
                var cameraTransform = BABYLON.Matrix.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, 0);
                var deltaTransform = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(horizontal * local, 0, -vertical * local), cameraTransform);
                camera.cameraDirection = camera.cameraDirection.add(deltaTransform);
            }
        }
        public updateCameraRotation(camera: BABYLON.FreeCamera, mousex: number, mousey: number, speed: number): void {
            if (camera != null) {
                camera.cameraRotation = camera.cameraRotation.add(new BABYLON.Vector2(mousey * speed, mousex * speed));
            }
        }
        public updateCameraUserInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number): void {
            if (camera != null) {
                var horizontal: number = this.getUserInput(BABYLON.UserInputAxis.Horizontal);
                var vertical: number = this.getUserInput(BABYLON.UserInputAxis.Vertical);
                var mousex: number = this.getUserInput(BABYLON.UserInputAxis.MouseX);
                var mousey: number = this.getUserInput(BABYLON.UserInputAxis.MouseY);
                this.updateCameraPosition(camera, horizontal, -vertical, movementSpeed);
                this.updateCameraRotation(camera, mousex, mousey, rotationSpeed);
            }
        }
        public isHighDynamicRangeCamera(camera: BABYLON.Camera): boolean {
            var result: boolean = false;
            if (camera.metadata != null && camera.metadata.api) {
                result = (camera.metadata.properties != null && camera.metadata.properties.hdr === true);
            }
            return result;
        }
        public getHighDynamicRangePipeline(camera: BABYLON.Camera): BABYLON.HDRRenderingPipeline {
            var result: BABYLON.HDRRenderingPipeline = null;
            if (camera.metadata != null && camera.metadata.api) {
                if (camera.metadata.properties != null && camera.metadata.properties.hdrPipeline != null) {
                    result = camera.metadata.properties.hdrPipeline;
                }
            }
            return result;
        }

        // *********************************** //
        // *  Scene Navigation Mesh Support  * //
        // *********************************** //

        public hasNavigationMesh(): boolean {
            return (this._navmesh != null);
        }
        public setNavigationMesh(mesh: BABYLON.AbstractMesh): void {
            this._navmesh = mesh;
        }
        public getNavigationMesh(): BABYLON.AbstractMesh {
            return this._navmesh;
        }
        public getNavigationTool(): Navigation {
            // Babylon Navigation Mesh Tool
            // https://github.com/wanadev/babylon-navigation-mesh
            if (this._navigation == null) {
                this._navigation = new Navigation();
            }
            return this._navigation;
        }
        public getNavigationZone(): string {
            return "scene";
        }
        public getNavigationPoint(position:BABYLON.Vector3, raise:number = 2.0, length:number = Number.MAX_VALUE): BABYLON.Vector3 {
            if (this._navmesh == null || position == null) return null;
            var pos = new BABYLON.Vector3(position.x, (position.y + raise), position.z);
            var ray = new BABYLON.Ray(position, new BABYLON.Vector3(0.0, -1.0, 0.0), length);
            var info = this._scene.pickWithRay(ray, (mesh) => { return (mesh === this._navmesh); });
            return (info.hit && info.pickedPoint) ? info.pickedPoint : null;
        }
        public getNavigationPath(agent: BABYLON.AbstractMesh, destination: BABYLON.Vector3): BABYLON.Vector3[] {
            if (this._navigation == null || this._navmesh == null) return null;
            var zone: string = this.getNavigationZone();
            var group: number = this._navigation.getGroup(zone, agent.position);
            return this._navigation.findPath(agent.position, destination, zone, group);
        }
        public setNavigationPath(agent: BABYLON.AbstractMesh, path: BABYLON.Vector3[], speed?: number, loop?: boolean, callback?: () => void): void {
            if (path && path.length > 0) {
                var length = 0;
                var direction = [{
                    frame: 0,
                    value: agent.position
                }];
                for (var i = 0; i < path.length; i++) {
                    length += BABYLON.Vector3.Distance(direction[i].value, path[i]);
                    direction.push({
                        frame: length,
                        value: path[i]
                    });
                }
                var move: BABYLON.Animation = new BABYLON.Animation("Move", "position", 3, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                move.setKeys(direction);
                agent.animations.push(move);
                this._scene.beginAnimation(agent, 0, length, loop, speed, callback);
            }
        }
        public getNavigationAgent(agent: BABYLON.AbstractMesh): BABYLON.NavigationAgent {
            return new BABYLON.NavigationAgent(agent);
        }
        public getNavigationAgents(): BABYLON.Mesh[] {
            return this._scene.getMeshesByTags("[NAVAGENT]");
        }
        public getNavigationAreaTable(): BABYLON.INavigationArea[] {
            return (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.table != null) ? this._navmesh.metadata.properties.table : [];
        }
        public getNavigationAreaIndexes(): number[] {
            return (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.areas != null) ? this._navmesh.metadata.properties.areas : [];
        }
        public getNavigationAreaName(index: number): string {
            var result: string = "";
            if (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.table != null) {
                var areaTable: BABYLON.INavigationArea[] = this._navmesh.metadata.properties.table;
                if (areaTable != null) {
                    for (var ii: number = 0; ii < areaTable.length; ii++) {
                        if (areaTable[ii].index === index) {
                            result = areaTable[ii].area;
                            break;
                        }
                    }
                }
            }
            return result;
        }
        public getNavigationAreaCost(index: number): number {
            var result: number = -1;
            if (this._navmesh.metadata != null && this._navmesh.metadata.properties != null) {
                var areaTable: INavigationArea[] = this._navmesh.metadata.properties.table;
                if (areaTable != null) {
                    for (var ii: number = 0; ii < areaTable.length; ii++) {
                        if (areaTable[ii].index === index) {
                            result = areaTable[ii].cost;
                            break;
                        }
                    }
                }
            }
            return result;
        }

        // ********************************** //
        // *  Private Input Helper Support  * //
        // ********************************** //

        private static inputKeyDownHandler(e: KeyboardEvent): any {
            var key: string = "k" + e.keyCode.toString();
            var pressed: boolean = false;
            if (BABYLON.SceneManager.keymap[key] != null) {
                pressed = BABYLON.SceneManager.keymap[key];
            }
            BABYLON.SceneManager.keymap[key] = true;
            switch (e.keyCode) {
                case 39: // Right
                case 68: // D-Key
                    BABYLON.SceneManager.k_horizontal = 1;
                    break;
                case 37: // Left
                case 65: // A-Key
                    BABYLON.SceneManager.k_horizontal = -1;
                    break;
                case 38: // Forward
                case 87: // W-Key
                    BABYLON.SceneManager.k_vertical = 1;
                    break;
                case 40: // Back
                case 83: // S-Key
                    BABYLON.SceneManager.k_vertical = -1;
                    break;
            }
            if (BABYLON.SceneManager.keyButtonDown != null && BABYLON.SceneManager.keyButtonDown.length > 0) {
                BABYLON.SceneManager.keyButtonDown.forEach((callback) => {
                    callback(e.keyCode);
                });
            }
            if (!pressed) {
                if (BABYLON.SceneManager.keyButtonPress != null && BABYLON.SceneManager.keyButtonPress.length > 0) {
                    BABYLON.SceneManager.keyButtonPress.forEach((press) => {
                        if (press.index === e.keyCode) {
                            press.action();
                        }
                    });
                }
            }
            if (BABYLON.SceneManager.preventDefault) e.preventDefault();
            return true;
        }
        private static inputKeyUpHandler(e: KeyboardEvent): any {
            var key: string = "k" + e.keyCode.toString();
            BABYLON.SceneManager.keymap[key] = false;
            switch (e.keyCode) {
                case 39: // Right
                case 37: // Left
                case 68: // D-Key
                case 65: // A-Key
                    BABYLON.SceneManager.k_horizontal = 0;
                    break;
                case 38: // Forward
                case 40: // Back
                case 87: // W-Key
                case 83: // S-Key
                    BABYLON.SceneManager.k_vertical = 0;
                    break;
            }
            if (BABYLON.SceneManager.keyButtonUp != null && BABYLON.SceneManager.keyButtonUp.length > 0) {
                BABYLON.SceneManager.keyButtonUp.forEach((callback) => {
                    callback(e.keyCode);
                });
            }
            if (BABYLON.SceneManager.preventDefault) e.preventDefault();
            return true;
        }

        private static inputPointerDownHandler(e: PointerEvent): any {
            if (e.button === 0) {
                BABYLON.SceneManager.previousPosition = {
                    x: e.clientX,
                    y: e.clientY
                };
            }
            var key: string = "p" + e.button.toString();
            var pressed: boolean = false;
            if (BABYLON.SceneManager.keymap[key] != null) {
                pressed = BABYLON.SceneManager.keymap[key];
            }
            BABYLON.SceneManager.keymap[key] = true;
            if (BABYLON.SceneManager.mouseButtonDown != null && BABYLON.SceneManager.mouseButtonDown.length > 0) {
                BABYLON.SceneManager.mouseButtonDown.forEach((callback) => {
                    callback(e.button);
                });
            }
            if (!pressed) {
                if (BABYLON.SceneManager.mouseButtonPress != null && BABYLON.SceneManager.mouseButtonPress.length > 0) {
                    BABYLON.SceneManager.mouseButtonPress.forEach((press) => {
                        if (press.index === e.button) {
                            press.action();
                        }
                    });
                }
            }
            if (BABYLON.SceneManager.preventDefault) e.preventDefault();
            return true;
        }
        private static inputPointerUpHandler(e: PointerEvent): any {
            if (e.button === 0 && BABYLON.SceneManager.previousPosition != null) {
                BABYLON.SceneManager.previousPosition = null;
                BABYLON.SceneManager.k_mousex = 0;
                BABYLON.SceneManager.k_mousey = 0;
            }
            var key: string = "p" + e.button.toString();
            BABYLON.SceneManager.keymap[key] = false;
            if (BABYLON.SceneManager.mouseButtonUp != null && BABYLON.SceneManager.mouseButtonUp.length > 0) {
                BABYLON.SceneManager.mouseButtonUp.forEach((callback) => {
                    callback(e.button);
                });
            }
            if (BABYLON.SceneManager.preventDefault) e.preventDefault();
            return true;
        }
        private static inputPointerMoveHandler(e: PointerEvent): any {
            // Mouse Pointer Rotation When No Virtual Joystick Enabled
            if (BABYLON.SceneManager.virtualJoystick === false) {
                if (BABYLON.SceneManager.previousPosition != null) {
                    BABYLON.SceneManager.clientx = e.clientX;
                    BABYLON.SceneManager.clienty = e.clientY;
                    var offsetX = e.clientX - BABYLON.SceneManager.previousPosition.x;
                    var offsetY = e.clientY - BABYLON.SceneManager.previousPosition.y;
                    BABYLON.SceneManager.previousPosition = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    var mousex: number = offsetX * (BABYLON.UserInputOptions.PointerAngularSensibility / 10);
                    var mousey: number = offsetY * (BABYLON.UserInputOptions.PointerAngularSensibility / 10);
                    if (mousex != 0) {
                        BABYLON.SceneManager.k_mousex = mousex;
                    }
                    if (mousey != 0) {
                        if (BABYLON.SceneManager.rightHanded) {
                            BABYLON.SceneManager.k_mousey = -mousey;
                        } else {
                            BABYLON.SceneManager.k_mousey = mousey;
                        }
                    }
                }
            }
            if (BABYLON.SceneManager.preventDefault) e.preventDefault();
            return true;
        }

        private static inputButtonDownHandler(button: number): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var key: string = "b" + button.toString();
                var pressed: boolean = false;
                if (BABYLON.SceneManager.keymap[key] != null) {
                    pressed = BABYLON.SceneManager.keymap[key];
                }
                BABYLON.SceneManager.keymap[key] = true;
                if (BABYLON.SceneManager.gamepadButtonDown != null && BABYLON.SceneManager.gamepadButtonDown.length > 0) {
                    BABYLON.SceneManager.gamepadButtonDown.forEach((callback) => {
                        callback(button);
                    });
                }
                if (!pressed) {
                    if (BABYLON.SceneManager.gamepadButtonPress != null && BABYLON.SceneManager.gamepadButtonPress.length > 0) {
                        BABYLON.SceneManager.gamepadButtonPress.forEach((press) => {
                            if (press.index === button) {
                                press.action();
                            }
                        });
                    }
                }
            }
        }
        private static inputButtonUpHandler(button: number): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var key: string = "b" + button.toString();
                BABYLON.SceneManager.keymap[key] = false;
                if (BABYLON.SceneManager.gamepadButtonUp != null && BABYLON.SceneManager.gamepadButtonUp.length > 0) {
                    BABYLON.SceneManager.gamepadButtonUp.forEach((callback) => {
                        callback(button);
                    });
                }
            }
        }
        private static inputXboxDPadDownHandler(dPadPressed: BABYLON.Xbox360Dpad): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var key: string = "d" + dPadPressed.toString();
                var pressed: boolean = false;
                if (BABYLON.SceneManager.keymap[key] != null) {
                    pressed = BABYLON.SceneManager.keymap[key];
                }
                BABYLON.SceneManager.keymap[key] = true;
                if (BABYLON.SceneManager.gamepadDpadDown != null && BABYLON.SceneManager.gamepadDpadDown.length > 0) {
                    BABYLON.SceneManager.gamepadDpadDown.forEach((callback) => {
                        callback(dPadPressed);
                    });
                }
                if (!pressed) {
                    if (BABYLON.SceneManager.gamepadDpadPress != null && BABYLON.SceneManager.gamepadDpadPress.length > 0) {
                        BABYLON.SceneManager.gamepadDpadPress.forEach((press) => {
                            if (press.index === dPadPressed) {
                                press.action();
                            }
                        });
                    }
                }
            }
        }
        private static inputXboxDPadUpHandler(dPadReleased: BABYLON.Xbox360Dpad): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var key: string = "d" + dPadReleased.toString();
                BABYLON.SceneManager.keymap[key] = false;
                if (BABYLON.SceneManager.gamepadDpadUp != null && BABYLON.SceneManager.gamepadDpadUp.length > 0) {
                    BABYLON.SceneManager.gamepadDpadUp.forEach((callback) => {
                        callback(dPadReleased);
                    });
                }
            }
        }
        private static inputXboxLeftTriggerHandler(value: number): void {
            if (BABYLON.SceneManager.gamepad != null) {
                BABYLON.SceneManager.keymap["t0"] = value;
                if (BABYLON.SceneManager.gamepadLeftTrigger != null && BABYLON.SceneManager.gamepadLeftTrigger.length > 0) {
                    BABYLON.SceneManager.gamepadLeftTrigger.forEach((callback) => {
                        callback(value);
                    });
                }
            }
        }
        private static inputXboxRightTriggerHandler(value: number): void {
            if (BABYLON.SceneManager.gamepad != null) {
                BABYLON.SceneManager.keymap["t1"] = value;
                if (BABYLON.SceneManager.gamepadRightTrigger != null && BABYLON.SceneManager.gamepadRightTrigger.length > 0) {
                    BABYLON.SceneManager.gamepadRightTrigger.forEach((callback) => {
                        callback(value);
                    });
                }
            }
        }
        private static inputLeftStickHandler(values: BABYLON.StickValues): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var LSValues:BABYLON.StickValues = values;
                var normalizedLX = LSValues.x * BABYLON.UserInputOptions.GamepadLStickSensibility;
                var normalizedLY = LSValues.y * BABYLON.UserInputOptions.GamepadLStickSensibility;
                LSValues.x = Math.abs(normalizedLX) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedLX : 0;
                LSValues.y = Math.abs(normalizedLY) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedLY : 0;
                BABYLON.SceneManager.g_horizontal = (BABYLON.UserInputOptions.GamepadLStickXInverted) ? -LSValues.x : LSValues.x;
                BABYLON.SceneManager.g_vertical = (BABYLON.UserInputOptions.GamepadLStickYInverted) ? LSValues.y : -LSValues.y;
            }
        }
        private static inputRightStickHandler(values: BABYLON.StickValues): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var RSValues:BABYLON.StickValues = values;
                var normalizedRX = RSValues.x * BABYLON.UserInputOptions.GamepadRStickSensibility;
                var normalizedRY = RSValues.y * BABYLON.UserInputOptions.GamepadRStickSensibility;
                RSValues.x = Math.abs(normalizedRX) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedRX : 0;
                RSValues.y = Math.abs(normalizedRY) >= BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedRY : 0;
                BABYLON.SceneManager.g_mousex = (BABYLON.UserInputOptions.GamepadRStickXInverted) ? -RSValues.x : RSValues.x;
                BABYLON.SceneManager.g_mousey = (BABYLON.UserInputOptions.GamepadRStickYInverted) ? -RSValues.y : RSValues.y;
            }
        }
        private static inputGamepadConnected(pad: BABYLON.Gamepad) {
            if (pad.index === 0) {
                BABYLON.SceneManager.gamepad = pad;
                BABYLON.Tools.Log("Gamepad Connected: " + BABYLON.SceneManager.gamepad.id);
                if ((<string>BABYLON.SceneManager.gamepad.id).search("Xbox 360") !== -1 || (<string>BABYLON.SceneManager.gamepad.id).search("Xbox One") !== -1 || (<string>BABYLON.SceneManager.gamepad.id).search("xinput") !== -1) {
                    BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.Xbox360;
                    var xbox360Pad: BABYLON.Xbox360Pad = BABYLON.SceneManager.gamepad as BABYLON.Xbox360Pad;
                    xbox360Pad.onbuttonup(BABYLON.SceneManager.inputButtonUpHandler);
                    xbox360Pad.onbuttondown(BABYLON.SceneManager.inputButtonDownHandler);
                    xbox360Pad.onleftstickchanged(BABYLON.SceneManager.inputLeftStickHandler);
                    xbox360Pad.onrightstickchanged(BABYLON.SceneManager.inputRightStickHandler);
                    xbox360Pad.ondpadup(BABYLON.SceneManager.inputXboxDPadUpHandler);
                    xbox360Pad.ondpaddown(BABYLON.SceneManager.inputXboxDPadDownHandler);
                    xbox360Pad.onlefttriggerchanged(BABYLON.SceneManager.inputXboxLeftTriggerHandler);
                    xbox360Pad.onrighttriggerchanged(BABYLON.SceneManager.inputXboxRightTriggerHandler);
                } else {
                    BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.Generic;
                    var genericPad: BABYLON.GenericPad = BABYLON.SceneManager.gamepad as BABYLON.GenericPad;
                    genericPad.onbuttonup(BABYLON.SceneManager.inputButtonUpHandler);
                    genericPad.onbuttondown(BABYLON.SceneManager.inputButtonDownHandler);
                    genericPad.onleftstickchanged(BABYLON.SceneManager.inputLeftStickHandler);
                    genericPad.onrightstickchanged(BABYLON.SceneManager.inputRightStickHandler);
                }
                if (BABYLON.SceneManager.gamepadConnected != null) {
                    BABYLON.SceneManager.gamepadConnected(BABYLON.SceneManager.gamepad, BABYLON.SceneManager.gamepadType);
                }
            }
        }
        private static inputVirtualJoysticks(): void {
            if (BABYLON.SceneManager.leftJoystick != null) {
                // Update left virtual joystick values
                var LSDelta:BABYLON.Vector3 = BABYLON.SceneManager.leftJoystick.deltaPosition;
                if (!BABYLON.SceneManager.leftJoystick.pressed) {
                    LSDelta = LSDelta.scale(0.9);
                }
                var normalizedLX = LSDelta.x;
                var normalizedLY = LSDelta.y;
                LSDelta.x = Math.abs(normalizedLX) >= BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedLX : 0;
                LSDelta.y = Math.abs(normalizedLY) >= BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedLY : 0;
                BABYLON.SceneManager.j_horizontal = LSDelta.x;
                BABYLON.SceneManager.j_vertical = LSDelta.y;
            }
            if (BABYLON.SceneManager.rightJoystick != null) {
                // Update right virtual joystick values
                var RSDelta:BABYLON.Vector3 = BABYLON.SceneManager.rightJoystick.deltaPosition;
                if (!BABYLON.SceneManager.rightJoystick.pressed) {
                    RSDelta = RSDelta.scale(0.9);
                }
                var normalizedRX = RSDelta.x;
                var normalizedRY = RSDelta.y;
                RSDelta.x = Math.abs(normalizedRX) >= BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedRX : 0;
                RSDelta.y = Math.abs(normalizedRY) >= BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedRY : 0;
                BABYLON.SceneManager.j_mousex = RSDelta.x;
                BABYLON.SceneManager.j_mousey = RSDelta.y;
            }
        }

        // ************************************** //
        // *  Private User Input State Support  * //
        // ************************************** //

        private static updateUserInput(): void {
            BABYLON.SceneManager.inputVirtualJoysticks();
            // Reset global user input state  buffers
            BABYLON.SceneManager.x_horizontal = 0;
            BABYLON.SceneManager.x_vertical = 0;
            BABYLON.SceneManager.x_mousex = 0;
            BABYLON.SceneManager.x_mousey = 0;
            // Update user input state by order of precedence
            if (BABYLON.SceneManager.j_horizontal !== 0) {
                BABYLON.SceneManager.x_horizontal = BABYLON.SceneManager.j_horizontal;
            } else if (BABYLON.SceneManager.k_horizontal !== 0) {
                BABYLON.SceneManager.x_horizontal = BABYLON.SceneManager.k_horizontal;
            } else if (BABYLON.SceneManager.g_horizontal !== 0) {
                BABYLON.SceneManager.x_horizontal = BABYLON.SceneManager.g_horizontal;
            }
            if (BABYLON.SceneManager.j_vertical !== 0) {
                BABYLON.SceneManager.x_vertical = BABYLON.SceneManager.j_vertical;
            } else if (BABYLON.SceneManager.k_vertical !== 0) {
                BABYLON.SceneManager.x_vertical = BABYLON.SceneManager.k_vertical;
            } else if (BABYLON.SceneManager.g_vertical !== 0) {
                BABYLON.SceneManager.x_vertical = BABYLON.SceneManager.g_vertical;
            }
            if (BABYLON.SceneManager.j_mousex !== 0) {
                BABYLON.SceneManager.x_mousex = BABYLON.SceneManager.j_mousex;
            } else if (BABYLON.SceneManager.k_mousex !== 0) {
                BABYLON.SceneManager.x_mousex = BABYLON.SceneManager.k_mousex;
            } else if (BABYLON.SceneManager.g_mousex !== 0) {
                BABYLON.SceneManager.x_mousex = BABYLON.SceneManager.g_mousex;
            }
            if (BABYLON.SceneManager.j_mousey !== 0) {
                BABYLON.SceneManager.x_mousey = BABYLON.SceneManager.j_mousey;
            } else if (BABYLON.SceneManager.k_mousey !== 0) {
                BABYLON.SceneManager.x_mousey = BABYLON.SceneManager.k_mousey;
            } else if (BABYLON.SceneManager.g_mousey !== 0) {
                BABYLON.SceneManager.x_mousey = BABYLON.SceneManager.g_mousey;
            }
            // Update global user input state buffers
            BABYLON.SceneManager.horizontal = BABYLON.SceneManager.x_horizontal;
            BABYLON.SceneManager.vertical = BABYLON.SceneManager.x_vertical;
            BABYLON.SceneManager.mousex = BABYLON.SceneManager.x_mousex;
            BABYLON.SceneManager.mousey = BABYLON.SceneManager.x_mousey;
        }

        // *********************************** //
        // *  Private Scene Parsing Support  * //
        // *********************************** //

        private static parseSceneMetadata(rootUrl: string, sceneFilename: any, scene: BABYLON.Scene): void {
            var scenex: any = <any>scene;
            if (scenex.manager == null) {
                var manager: BABYLON.SceneManager = new BABYLON.SceneManager(rootUrl, sceneFilename, scene);
                scenex.manager = manager;
                scenex.manager._executeWhenReady();
            } else {
                BABYLON.Tools.Warn("Scene already has already been parsed.");
            }
        }
        private static parseMeshMetadata(meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene): void {
            var scenex: any = <any>scene;
            if (scenex.manager != null) {
                var manager: BABYLON.SceneManager = scenex.manager as BABYLON.SceneManager;
                var ticklist: BABYLON.IScriptComponent[] = [];
                BABYLON.SceneManager.parseSceneMeshes(meshes, scene, ticklist);
                if (ticklist.length > 0) {
                    ticklist.sort((left, right): number => {
                        if (left.order < right.order) return -1;
                        if (left.order > right.order) return 1;
                        return 0;
                    });
                    ticklist.forEach((scriptComponent) => {
                        scriptComponent.instance.register();
                    });
                }
            } else {
                BABYLON.Tools.Warn("No scene manager detected for current scene");
            }
        }
        private static parseSceneCameras(cameras: BABYLON.Camera[], scene: BABYLON.Scene, ticklist: BABYLON.IScriptComponent[]): void {
            if (cameras != null && cameras.length > 0) {
                cameras.forEach((camera) => {
                    if (camera.metadata != null && camera.metadata.api) {
                        // Setup metadata cloning
                        camera.metadata.clone = () => { return BABYLON.SceneManager.CloneMetadata(camera.metadata); };
                        // Camera component cleanup
                        if (camera.metadata.disposal == null || camera.metadata.disposal === false) {
                            camera.onDispose = () => { BABYLON.SceneManager.destroySceneComponents(camera); };
                            camera.metadata.disposal = true;
                        }
                        // Camera component scripts
                        var metadata: BABYLON.IObjectMetadata = camera.metadata as BABYLON.IObjectMetadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach((camerascript) => {
                                if (camerascript.klass != null && camerascript.klass !== "" && camerascript.klass !== "BABYLON.ScriptComponent" && camerascript.klass !== "BABYLON.SceneController" && camerascript.klass !== "BABYLON.OrthoController" && camerascript.klass !== "BABYLON.ShaderController" && camerascript.klass !== "BABYLON.UniversalShaderMaterial") {
                                    var CameraComponentClass = BABYLON.Tools.Instantiate(camerascript.klass);
                                    if (CameraComponentClass != null) {
                                        camerascript.instance = new CameraComponentClass(camera, scene, camerascript.update, camerascript.properties);
                                        if (camerascript.instance != null) {
                                            ticklist.push(camerascript);
                                        }
                                    }
                                }
                            });
                        }
                        // Camera rigging options
                        BABYLON.SceneManager.setupCameraRigOptions(camera, scene, ticklist);
                        // Camera animation events
                        BABYLON.SceneManager.setupAnimationEvents(camera, scene);
                    }
                });
            }
        }
        private static parseSceneLights(lights: BABYLON.Light[], scene: BABYLON.Scene, ticklist: BABYLON.IScriptComponent[]): void {
            if (lights != null && lights.length > 0) {
                lights.forEach((light) => {
                    if (light.metadata != null && light.metadata.api) {
                        // Setup metadata cloning
                        light.metadata.clone = () => { return BABYLON.SceneManager.CloneMetadata(light.metadata); };
                        // Light component cleanup
                        if (light.metadata.disposal == null || light.metadata.disposal === false) {
                            light.onDispose = () => { BABYLON.SceneManager.destroySceneComponents(light); };
                            light.metadata.disposal = true;
                        }
                        // Light component scripts
                        var metadata: BABYLON.IObjectMetadata = light.metadata as BABYLON.IObjectMetadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach((lightscript) => {
                                if (lightscript.klass != null && lightscript.klass !== "" && lightscript.klass !== "BABYLON.ScriptComponent" && lightscript.klass !== "BABYLON.SceneController" && lightscript.klass !== "BABYLON.OrthoController" && lightscript.klass !== "BABYLON.ShaderController" && lightscript.klass !== "BABYLON.UniversalShaderMaterial") {
                                    var LightComponentClass = BABYLON.Tools.Instantiate(lightscript.klass);
                                    if (LightComponentClass != null) {
                                        lightscript.instance = new LightComponentClass(light, scene, lightscript.update, lightscript.properties);
                                        if (lightscript.instance != null) {
                                            ticklist.push(lightscript);
                                        }
                                    }
                                }
                            });
                        }
                        // Light animation events
                        BABYLON.SceneManager.setupAnimationEvents(light, scene);
                    }
                });
            }
        }
        private static parseSceneMeshes(meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene, ticklist: BABYLON.IScriptComponent[]): void {
            if (meshes != null && meshes.length > 0) {
                meshes.forEach((mesh) => {
                    if (mesh.metadata != null && mesh.metadata.api) {
                        // Setup metadata cloning
                        mesh.metadata.clone = () => { return BABYLON.SceneManager.CloneMetadata(mesh.metadata); };
                        // Setup prefab masters
                        if (mesh.metadata.prefab === true) {
                            mesh.setEnabled(false);
                            BABYLON.SceneManager.prefabs[mesh.name] = mesh;
                        } else {
                            // Mesh component cleanup
                            if (mesh.metadata.disposal == null || mesh.metadata.disposal === false) {
                                mesh.onDispose = () => { BABYLON.SceneManager.destroySceneComponents(mesh); };
                                mesh.metadata.disposal = true;
                            }
                            // Mesh component physics
                            if (mesh.metadata.properties != null && mesh.metadata.properties.physicsTag != null) {
                                var physicsTag: string = mesh.metadata.properties.physicsTag;
                                var physicsMass: number = mesh.metadata.properties.physicsMass;
                                var physicsFriction: number = mesh.metadata.properties.physicsFriction;
                                var physicsRestitution: number = mesh.metadata.properties.physicsRestitution;
                                var physicsImpostor: number = mesh.metadata.properties.physicsImpostor;
                                var physicsRotation: number = mesh.metadata.properties.physicsRotation;
                                var physicsCollisions: boolean = mesh.metadata.properties.physicsCollisions;
                                var physicsEnginePlugin: number = mesh.metadata.properties.physicsEnginePlugin;
                                mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, physicsImpostor, {mass:physicsMass, friction:physicsFriction, restitution:physicsRestitution}, scene);
                                BABYLON.SceneManager.setupPhysicsImpostor(mesh, physicsEnginePlugin, physicsFriction, physicsCollisions, physicsRotation);
                            }
                            // Mesh component scripts
                            var metadata: BABYLON.IObjectMetadata = mesh.metadata as BABYLON.IObjectMetadata;
                            if (metadata.components != null && metadata.components.length > 0) {
                                metadata.components.forEach((meshscript) => {
                                    if (meshscript.klass != null && meshscript.klass !== "" && meshscript.klass !== "BABYLON.ScriptComponent" && meshscript.klass !== "BABYLON.SceneController" && meshscript.klass !== "BABYLON.OrthoController" && meshscript.klass !== "BABYLON.ShaderController" && meshscript.klass !== "BABYLON.UniversalShaderMaterial") {
                                        var MeshComponentClass = BABYLON.Tools.Instantiate(meshscript.klass);
                                        if (MeshComponentClass != null) {
                                            meshscript.instance = new MeshComponentClass(mesh, scene, meshscript.update, meshscript.properties);
                                            if (meshscript.instance != null) {
                                                ticklist.push(meshscript);
                                            }
                                        }
                                    }
                                });
                            }
                            // Mesh animation events
                            BABYLON.SceneManager.setupAnimationEvents(mesh, scene);
                        }
                    }
                });
            }
        }
        private static setupPhysicsImpostor(physicsMesh:BABYLON.AbstractMesh, plugin:number, friction:number, collisions:boolean, rotation:number):void {
            if (physicsMesh.physicsImpostor != null) {
                physicsMesh.physicsImpostor.executeNativeFunction((word:any, body:any) =>{
                    if (body) {
                        if (plugin === 0) {
                            // Cannon Physics Engine Plugin
                            body.linearDamping = friction;
                            body.angularDamping = friction;
                            body.collisionResponse = collisions;
                            body.angularVelocity.x = 0;
                            body.angularVelocity.y = 0;
                            body.angularVelocity.z = 0;
                            body.velocity.x = 0;
                            body.velocity.y = 0;
                            body.velocity.z = 0;
                            if (rotation === 1) {
                                body.fixedRotation = true;
                                body.updateMassProperties();
                            }
                        } else if (plugin === 1) {
                            // TODO: Oimo Physics Engine Plugin
                            //body.linearDamping = friction;
                            //body.angularDamping = friction;
                            //body.collisionResponse = collisions;
                            //body.angularVelocity.x = 0;
                            //body.angularVelocity.y = 0;
                            //body.angularVelocity.z = 0;
                            //body.velocity.x = 0;
                            //body.velocity.y = 0;
                            //body.velocity.z = 0;
                            if (rotation === 1) {
                                //body.fixedRotation = true;
                                //body.updateMassProperties();
                            }
                        }
                    } else {
                        BABYLON.Tools.Warn("[Physics Native Function]: Null imposter body encountered for physcis mesh " + physicsMesh.name + ". Check physics mesh has no parent transform.");
                    }
                });
            }
        }
        private static setupCameraRigOptions(camera:BABYLON.Camera, scene:BABYLON.Scene, ticklist: BABYLON.IScriptComponent[]):void {
            if (camera.metadata != null && camera.metadata.properties != null) {
                // Check Orthographic Camera Mode
                if (camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
                    var size:number = camera.metadata.properties.orthographicSize || 5;
                    var klass:string = "BABYLON.OrthoController";
                    var resize:boolean = (scene.metadata != null && scene.metadata.properties != null && scene.metadata.properties.resizeCameras) ? scene.metadata.properties.resizeCameras : true;
                    var metadata: BABYLON.IObjectMetadata = camera.metadata as BABYLON.IObjectMetadata;
                    if (metadata.components == null) {
                        metadata.components = [];
                    }
                    var OrthoComponentClass = BABYLON.Tools.Instantiate(klass);
                    if (OrthoComponentClass != null) {
                        var bag:any = { orthoSize: size, resizeCameras: resize };
                        var ortho:BABYLON.SceneComponent = new OrthoComponentClass(camera, scene, false, bag);
                        if (ortho != null) {
                            var compscript: BABYLON.IScriptComponent = {
                                order: 1000,
                                name: "BabylonScriptComponent",
                                klass: klass,
                                update: false,
                                controller: false,
                                properties: bag,
                                instance: ortho,
                                tag: {}
                            };
                            metadata.components.push(compscript);
                            ortho.register();
                        }
                    }
                }
                // Check VR Device Orientation Camera
                if (camera.metadata.properties.cameraType) {
                    var cameraType:string = camera.metadata.properties.cameraType;
                    if (cameraType === "WebVRFreeCamera" || cameraType === "WebVRGamepadCamera") {
                        var wvrDeviceCamera:BABYLON.WebVRFreeCamera = camera as BABYLON.WebVRFreeCamera;
                        var cameraTrackPosition:number = camera.metadata.properties.wvrTrackPosition;
                        var cameraPositionScale:number = camera.metadata.properties.wvrPositionScale;
                        var cameraDisplayName:number = camera.metadata.properties.wvrDisplayName;
                        // WebVR Camera Rig Options
                    } else if (cameraType === "VRDeviceOrientationFreeCamera" || cameraType === "VRDeviceOrientationGamepadCamera") {
                        var cameraBridge:number = camera.metadata.properties.vrCameraBridge;
                        var cameraEyeToScreen:number = camera.metadata.properties.vrEyeToScreen;
                        var cameraInterpupillary:number = camera.metadata.properties.vrInterpupillary;
                        var cameraScreenCenter:number = camera.metadata.properties.vrScreenCenter;
                        var cameraVerticalRes:number = camera.metadata.properties.vrVerticalRes;
                        var cameraHorizontalRes:number = camera.metadata.properties.vrHorizontalRes;
                        var cameraVerticalScreen:number = camera.metadata.properties.vrVerticalScreen;
                        var cameraHorizontalScreen:number = camera.metadata.properties.vrHorizontalScreen;
                        var cameraLensCenterOffset:number = camera.metadata.properties.vrLensCenterOffset;
                        var cameraLensSeperation:number = camera.metadata.properties.vrLensSeparation;
                        var cameraPostProcessScale:number = camera.metadata.properties.vrPostProcessScale;
                        var cameraCompensateDistortion:boolean = camera.metadata.properties.vrCompensateDistortion;
                        // VR Device Camera Options
                        var vrDeviceCamera:BABYLON.VRDeviceOrientationFreeCamera = camera as BABYLON.VRDeviceOrientationFreeCamera;
                        var viewWidth:number = 0.5 - cameraBridge;
                        var viewOffset:number = 0.5 + cameraBridge;
                        var viewMetrics:VRCameraMetrics = BABYLON.VRCameraMetrics.GetDefault();
                        viewMetrics.eyeToScreenDistance = cameraEyeToScreen;
                        viewMetrics.interpupillaryDistance = cameraInterpupillary;
                        viewMetrics.lensSeparationDistance = cameraLensSeperation;
                        viewMetrics.lensCenterOffset = cameraLensCenterOffset;
                        viewMetrics.hResolution = cameraHorizontalRes;
                        viewMetrics.vResolution = cameraVerticalRes;
                        viewMetrics.vScreenCenter = cameraScreenCenter;
                        viewMetrics.vScreenSize = cameraVerticalScreen;
                        viewMetrics.hScreenSize = cameraHorizontalScreen;
                        viewMetrics.postProcessScaleFactor = cameraPostProcessScale;
                        viewMetrics.compensateDistortion = cameraCompensateDistortion;
                        // Set Camera Rig Properties
                        vrDeviceCamera.setCameraRigMode(BABYLON.Camera.RIG_MODE_VR, { vrCameraMetrics: viewMetrics, interaxialDistance: camera.interaxialDistance });
                        vrDeviceCamera._rigCameras[0].viewport = new BABYLON.Viewport(0, 0, viewWidth, 1);
                        vrDeviceCamera._rigCameras[1].viewport = new BABYLON.Viewport(viewOffset, 0, viewWidth, 1);
                        scene.clearColor = new BABYLON.Color4(0,0,0,1);
                    }
                }
                // Check High Dynamic Rendering Pipeline
                if (camera.metadata.properties.hdr === true) {
                    var hdrRatio:number = camera.metadata.properties.hdrRatio;
                    var hdrExposure:number = camera.metadata.properties.hdrExposure;
                    var hdrGaussCoeff:number = camera.metadata.properties.hdrGaussCoeff;
                    var hdrGaussMean:number = camera.metadata.properties.hdrGaussMean;
                    var hdrGaussStandDev:number = camera.metadata.properties.hdrGaussStandDev;
                    var hdrGaussMultiplier:number = camera.metadata.properties.hdrGaussMultiplier;
                    var hdrBrightThreshold:number = camera.metadata.properties.hdrBrightThreshold;
                    var hdrMinimumLuminance:number = camera.metadata.properties.hdrMinimumLuminance;
                    var hdrMaximumLuminance:number = camera.metadata.properties.hdrMaximumLuminance;
                    var hdrLuminanceIncrease:number = camera.metadata.properties.hdrLuminanceIncrease;
                    var hdrLuminanceDecrease:number = camera.metadata.properties.hdrLuminanceDecrease;
                    var pipeline:BABYLON.HDRRenderingPipeline = new BABYLON.HDRRenderingPipeline((camera.name + "_Pipeline"), scene, hdrRatio, null, [camera]);
                    pipeline.exposure = hdrExposure;
                    pipeline.gaussCoeff = hdrGaussCoeff;
                    pipeline.gaussMean = hdrGaussMean;
                    pipeline.gaussStandDev = hdrGaussStandDev;
                    pipeline.gaussMultiplier = hdrGaussMultiplier;
                    pipeline.brightThreshold = hdrBrightThreshold;
                    pipeline.minimumLuminance = hdrMinimumLuminance;
                    pipeline.maximumLuminance = hdrMaximumLuminance;
                    pipeline.luminanceIncreaserate = hdrLuminanceIncrease;
                    pipeline.luminanceDecreaseRate = hdrLuminanceDecrease;
                    camera.metadata.properties.hdrPipeline = pipeline;
                }
                // Check Attached Rendering Canvas Control
                if (camera.metadata.properties.attachCanvasControl === true) {
                    var preventDefault:boolean = camera.metadata.properties.preventDefaultEvents || false;
                    camera.attachControl(scene.getEngine().getRenderingCanvas(), !preventDefault);
                }
            }
        }
        private static setupAnimationEvents(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, scene: BABYLON.Scene) : void {
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.animationEvents != null && metadata.animationEvents.length > 0 && metadata.components != null && metadata.components.length > 0) {
                    var track:BABYLON.Animation = BABYLON.SceneManager.locateOwnerAnimationTrack(0, owner, false);
                    if (track != null) {
                        metadata.animationEvents.forEach((evt) => {
                            if (evt.functionName != null && evt.functionName !== "") {
                                var functionName:string = evt.functionName.toLowerCase();
                                track.addEvent(new BABYLON.AnimationEvent(evt.frame, ()=>{
                                    metadata.components.forEach((ownerscript) => {
                                        if (ownerscript.instance != null) {
                                            var ownerinstance:any = (<any>ownerscript.instance);
                                            if (ownerinstance._handlers != null && ownerinstance._handlers[functionName]) {
                                                var handler:(evt:BABYLON.IAnimationStateEvent)=>void = ownerinstance._handlers[functionName];
                                                if (handler) handler(evt);
                                            }
                                        }
                                    });
                                }));
                            }
                        });
                    }
                }
            }            
        }
        public static locateOwnerAnimationTrack(index:number, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.Animation {
            var result:BABYLON.Animation = null;
            if (owner instanceof BABYLON.AbstractMesh) {
                var mesh:BABYLON.AbstractMesh = owner as BABYLON.AbstractMesh;
                if (mesh.skeleton != null && mesh.skeleton.bones != null && mesh.skeleton.bones.length > 0 && mesh.skeleton.bones[0]) {
                    var bone:BABYLON.Bone = mesh.skeleton.bones[0];
                    if (bone.animations != null && bone.animations.length > index && bone.animations[index] != null) {
                        result = bone.animations[index];
                    }
                }
            }
            if (result == null && owner.animations != null && owner.animations.length > index && owner.animations[index] != null) {
                result = owner.animations[index];
            }
            if (result == null && owner instanceof BABYLON.AbstractMesh) {
                var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(directDecendantsOnly, predicate);
                if (children != null && children.length > 0) {
                    for (var i:number = 0; i < children.length; i++) {
                        var child:BABYLON.AbstractMesh = children[i];
                        if (child.skeleton != null && child.skeleton.bones != null && child.skeleton.bones.length > 0 && child.skeleton.bones[0]) {
                            var cbone:BABYLON.Bone = child.skeleton.bones[0];
                            if (cbone.animations != null && cbone.animations.length > index && cbone.animations[index] != null) {
                                result = cbone.animations[index];
                                break;
                            }
                        }
                        if (result == null && child.animations != null && child.animations.length > 0 && child.animations.length > index && child.animations[index] != null) {
                            result = child.animations[index];
                            break;
                        }
                    }
                }
            }
            return result;            
        }
        public static destroySceneComponents(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, destroyMetadata: boolean = true): void {
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    metadata.components.forEach((ownerscript) => {
                        if (ownerscript.instance != null) {
                            ownerscript.instance.dispose();
                            ownerscript.instance = null;
                        }
                    });
                    if (destroyMetadata) {
                        owner.metadata.components = null;
                    }
                }
                if (destroyMetadata) {
                    if (owner.metadata.properties != null) {
                        owner.metadata.properties = null;
                    }
                    if (owner.metadata.animationStates != null) {
                        owner.metadata.animationStates = null;
                    }
                    if (owner.metadata.animationEvents != null) {
                        owner.metadata.animationEvents = null;
                    }
                    if (owner.metadata.collisionEvent != null) {
                        owner.metadata.collisionEvent = null;
                    }
                    if (owner.metadata.collisionTags != null) {
                        owner.metadata.collisionTags = null;
                    }
                    owner.metadata = null;
                }
            }
        }

        // *********************************** //
        // *   Public Helper Tools Support   * //
        // *********************************** //

        public static ReplaceAll(source:string, find:string, replace:string):string {
            return source.replace(new RegExp(find, 'g'), replace);            
        }

        public static CloneValue(source:any, destinationObject:any): any {
            if (!source)
                return null;

            if (source instanceof Mesh) {
                return null;
            }

            if (source instanceof SubMesh) {
                return source.clone(destinationObject);
            } else if (source.clone) {
                return source.clone();
            }
            return source;
        }

        public static CloneMetadata(source:BABYLON.IObjectMetadata): BABYLON.IObjectMetadata {
            var result:BABYLON.IObjectMetadata = null;
            if (source != null) {
                
                var new_properties:any = {};
                BABYLON.SceneManager.DeepCopyProperties(source.properties, new_properties);
                
                var new_navagent:any = {};
                BABYLON.SceneManager.DeepCopyProperties(source.navAgent, new_navagent);

                var new_meshlink:any = {};
                BABYLON.SceneManager.DeepCopyProperties(source.meshLink, new_meshlink);

                var new_meshobstacle:any = {};
                BABYLON.SceneManager.DeepCopyProperties(source.meshObstacle, new_meshobstacle);

                var new_animationstates:any[] = [];
                if (source.animationStates != null && source.animationStates.length > 0) {
                    source.animationStates.forEach((state) => {
                        var new_state_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(state, new_state_properties);
                        new_animationstates.push(new_state_properties);
                    });
                }

                var new_animationevents:any[] = [];
                if (source.animationEvents != null && source.animationEvents.length > 0) {
                    source.animationEvents.forEach((evt) => {
                        var new_event_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(evt, new_event_properties);
                        new_animationstates.push(new_event_properties);
                    });
                }

                var new_components:BABYLON.IScriptComponent[] = [];
                if (source.components != null && source.components.length > 0) {
                    source.components.forEach((comp) => {
                        var new_comp_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(comp.properties, new_comp_properties);
                        new_components.push({ name: comp.name, klass: comp.klass, order:comp.order, tag: comp.tag, update: comp.update, controller: comp.controller, properties: new_comp_properties, instance: null });
                    });
                }

                result = {
                    api: true,
                    type: source.type,
                    prefab: false,
                    objectName: source.objectName,
                    objectId: source.objectId,
                    tagName: source.tagName,
                    layerIndex: source.layerIndex,
                    layerName: source.layerName,
                    areaIndex: source.areaIndex,
                    navAgent: new_navagent,
                    meshLink: new_meshlink,
                    meshObstacle: new_meshobstacle,
                    animationStates: new_animationstates,
                    animationEvents: new_animationstates,
                    collisionEvent: null,
                    collisionTags: [],
                    components: new_components,
                    properties: new_properties
                };
            }
            return result;
        }

        public static DeepCopyProperties(source:any, destination:any, doNotCopyList?: string[], mustCopyList?: string[]): void {
            for (var prop in source) {

                if (prop[0] === "_" && (!mustCopyList || mustCopyList.indexOf(prop) === -1)) {
                    continue;
                }

                if (doNotCopyList && doNotCopyList.indexOf(prop) !== -1) {
                    continue;
                }
                var sourceValue = source[prop];
                var typeOfSourceValue = typeof sourceValue;

                if (typeOfSourceValue === "function") {
                    continue;
                }

                if (typeOfSourceValue === "object") {
                    if (sourceValue instanceof Array) {
                        destination[prop] = [];

                        if (sourceValue.length > 0) {
                            if (typeof sourceValue[0] == "object") {
                                for (var index = 0; index < sourceValue.length; index++) {
                                    var clonedValue = BABYLON.SceneManager.CloneValue(sourceValue[index], destination);
                                    if (destination[prop].indexOf(clonedValue) === -1) { // Test if auto inject was not done
                                        destination[prop].push(clonedValue);
                                    }
                                }
                            } else {
                                destination[prop] = sourceValue.slice(0);
                            }
                        }
                    } else {
                        destination[prop] = BABYLON.SceneManager.CloneValue(sourceValue, destination);
                    }
                } else {
                    destination[prop] = sourceValue;
                }
            }
        }
    }
}