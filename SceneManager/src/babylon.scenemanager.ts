module BABYLON {
    export class SceneManager {
        /** Get main singleton instance of the scene manager. */
        public static GetInstance(): BABYLON.SceneManager {
            return BABYLON.SceneManager.me;
        }
        /** Creates a new scene and pre parses metadata. */
        public static CreateScene(engine: BABYLON.Engine): BABYLON.Scene {
            var scene: BABYLON.Scene = new BABYLON.Scene(engine);
            BABYLON.SceneManager.parseSceneMetadata("/", scene);
            return scene;
        }
        /** Registers the scene loader function handler. */
        public static RegisterLoader(handler: (root: string, name: string) => void): void {
            BABYLON.SceneManager.loader = handler;
        }
        /** Registers a function handler to be executed when scene is ready. */
        public static ExecuteWhenReady(func: (scene: BABYLON.Scene, manager: BABYLON.SceneManager) => void): void {
            if (func != null) BABYLON.SceneManager.readies.push(func);
        }
        /** Creates and registers a new scene manager session instance */
        public static CreateManagerSession(rootUrl: any, scene: BABYLON.Scene) : BABYLON.SceneManager {
            var scenex: any = <any>scene;
            if (scenex.manager != null) {
                scenex.manager.dispose();
                scenex.manager = null;
            }                
            scenex.manager = new BABYLON.SceneManager(rootUrl, scene);
            if (scenex.manager != null) scenex.manager._executeWhenReady();
            return scenex.manager;
        }
        
        // *********************************** //
        // * Babylon Scene Manager Component * //
        // *********************************** //
        public static get StaticIndex():number { return 30; };
        public static get PrefabIndex():number { return 31; };

        public onrender: () => void = null;
        private _ie: boolean = false;
        private _url: string = "";
        private _time:number = 0;
        private _timing:boolean = false;
        private _filename: string = null;
        private _render: () => void = null;
        private _running: boolean = false;
        private _markup: string = "";
        private _gui: string = "None";
        private _input: boolean = false;
        private _scene: BABYLON.Scene = null;
        private _navmesh: BABYLON.AbstractMesh = null;
        private _navigation: Navigation = null;
        private _mainCamera:BABYLON.Camera = null;
        private _loadQueueIndex:number = 0;
        private _loadQueueCount:number = 0;
        private _loadQueueScenes:string[] = null;
        private _localReadyState:any = null;
        private _localSceneReady:boolean = false;
        
        protected updateCamera:BABYLON.FreeCamera = null;
        protected updateCameraInput:boolean = false;
        protected cameraInputMoveSpeed:number = 1.0;
        protected cameraInputRotateSpeed:number = 0.005;

        private static me: BABYLON.SceneManager = null;
        private static min: number = Number.MIN_VALUE;
        private static max: number = (Number.MAX_VALUE - 100);
        private static keymap: any = {};
        private static prefabs: any = null;
        private static wheel: number = 0;
        private static clientx: number = 0;
        private static clienty: number = 0;
        private static mousex: number = 0;
        private static mousey: number = 0;
        private static vertical: number = 0;
        private static horizontal: number = 0;
        private static x_wheel: number = 0;
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
        private static orphans: BABYLON.AbstractMesh = null;
        private static gamepad: BABYLON.Gamepad = null;
        private static gamepadType: BABYLON.GamepadType = BABYLON.GamepadType.None;
        private static gamepadManager: BABYLON.GamepadManager = null;
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
        private static showDebugSockets:boolean = false;
        private static colliderVisibility:number = 0.25;
        private static socketColliderSize:number = 0.125;
        private static staticVertexLimit:boolean = false;
        private static previousPosition: { x: number, y: number } = null;
        private static preventDefault: boolean = false;
        private static rightHanded: boolean = true;
        private static loader: (root: string, name: string) => void = null;
        public get ie():boolean { return this._ie; }
        public get url():string { return this._url; }
        public get time():number { return this._time; }
        public get deltaTime():number { return BABYLON.SceneManager.engine.getDeltaTime() / 1000.0; }
        public getScene():BABYLON.Scene { return this._scene; }
        private static readies: Function[] = []; // Note: Only ExecuteWhenReady Resets Ready Handlers
        public constructor(rootUrl: string, scene: BABYLON.Scene) {
            if (scene == null) throw new Error("Null host scene obejct specified.");
            this._ie = document.all ? true : false
            this._url = rootUrl;
            this._time = 0;
            this._timing = false;
            this._filename = null;
            this._scene = scene;
            this._input = false;
            this._onready = [];
            this._navmesh = null;
            this._navigation = null;
            this._mainCamera = null;
            this._loadQueueIndex = 0;
            this._loadQueueCount = 0;
            this._loadQueueScenes = null;
            this._localSceneReady = false;

            // Reset local ready state
            this._localReadyState = { state: "localReadyState" };
            this._scene._addPendingData(this._localReadyState);

            // Reset scene manager engine instance
            BABYLON.SceneManager.me = this;
            BABYLON.SceneManager.engine = this._scene.getEngine();
            BABYLON.SceneManager.prefabs = {};
            BABYLON.SceneManager.orphans = null;
            BABYLON.SceneManager.rightHanded = this._scene.useRightHandedSystem;
            BABYLON.SceneManager.staticVertexLimit = false;
            BABYLON.SceneManager.showDebugSockets = false;
            BABYLON.SceneManager.colliderVisibility = 0.25;
            BABYLON.SceneManager.socketColliderSize = 0.125;
            
            // Reset auto camer user input
            this.updateCamera = null;
            this.updateCameraInput = false;
            this.cameraInputMoveSpeed = 1.0;
            this.cameraInputRotateSpeed = 0.005;
            
            // Setup and show debug socket meshes
            if (this._scene.metadata != null && this._scene.metadata.properties != null) {
                if (this._scene.metadata.properties.colliderVisibility && this._scene.metadata.properties.colliderVisibility != null) {
                    BABYLON.SceneManager.colliderVisibility = this._scene.metadata.properties.colliderVisibility;
                }
                if (this._scene.metadata.properties.socketColliderSize && this._scene.metadata.properties.socketColliderSize != null) {
                    BABYLON.SceneManager.socketColliderSize = this._scene.metadata.properties.socketColliderSize;
                }
                if (this._scene.metadata.properties.hasOwnProperty("showDebugSockets")) {
                    BABYLON.SceneManager.showDebugSockets = this._scene.metadata.properties.showDebugSockets;
                }
                if (this._scene.metadata.properties.hasOwnProperty("staticVertexLimit")) {
                    BABYLON.SceneManager.staticVertexLimit = this._scene.metadata.properties.staticVertexLimit;
                }
            }

            // Parse, create and store component instances
            var ticklist: BABYLON.IScriptComponent[] = [];
            BABYLON.SceneManager.parseSceneCameras(this._scene.cameras, this._scene, ticklist);
            BABYLON.SceneManager.parseSceneLights(this._scene.lights, this._scene, ticklist);
            BABYLON.SceneManager.parseSceneMeshes(this._scene.meshes, this._scene, ticklist);

            // Parse and intialize scene raw metadata properties
            if (this._scene.metadata != null && this._scene.metadata.properties != null) {
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
                        instance._time += instance.deltaTime;
                        if (instance._time >= BABYLON.SceneManager.max) instance._time = 0;
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
        /* Dispose scene manager and all resources. */
        public dispose(): void {
            BABYLON.SceneManager.me = null;
            BABYLON.SceneManager.engine = null;
            BABYLON.SceneManager.prefabs = null;
            BABYLON.SceneManager.orphans = null;
            BABYLON.SceneManager.rightHanded = true;
            if (BABYLON.SceneManager.orphans != null) {
                BABYLON.SceneManager.orphans.dispose();
                BABYLON.SceneManager.orphans = null;
            }
            this.disableUserInput();
            this._gui = null;
            this._time = 0;
            this._render = null;
            this._markup = null;
            this._navmesh = null;
            this._timing = false;
            this._navigation = null;
            this._onready = null;
            this.onrender = null;
            this.updateCamera = null;
            this.updateCameraInput = false;
            this.cameraInputMoveSpeed = 1.0;
            this.cameraInputRotateSpeed = 0.005;
            var scenex: any = (<any>this._scene);
            if (scenex.manager) scenex.manager = null;
            scenex = null;
            this._scene = null;
        }
        /** Execute a function once during render loop. */
        public once(func:()=>void):void {
            if (func != null) {
                var ran:boolean = false;
                var one:()=>void = null;
                one = ()=> {
                    this._scene.unregisterBeforeRender(one);
                    one = null;
                    if (ran === false) {
                        ran = true;
                        func();
                    }
                };
                this._scene.registerBeforeRender(one);
            }
        }
        /** Delays a function call using window.setTimeeout. */
        public delay(func:()=>void, timeout:number):number {
            return window.setTimeout(func, timeout);
        }
        /** Repeats a function call using window.setInterval. */
        public repeat(func:()=>void, interval:number):number {
            return window.setInterval(func, interval);
        }
        /** Clears window.setInterval handle. */
        public clear(handle:number):void {
            window.clearInterval(handle);
        }
        /** Enables time managment in scene. */
        public enableTime():void {
            this._time = 0;
            this._timing = true;
        }
        /** Disables time managment in scene. */
        public disableTime():void {
            this._time = 0;
            this._timing = false;
        }
        /** Load a new level into scene. */
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
        /** Import meshes info current scene. */
        public importMeshes(filename:string, onsuccess:()=>void = null, onprogress:()=>void = null, onerror:(scene:BABYLON.Scene, message:string, exception:any)=>void = null):void {
            BABYLON.SceneLoader.ImportMesh("", this.getScenePath(), filename, this._scene, (meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[])=>{ if (onsuccess != null) onsuccess(); }, onprogress, onerror);
        }
        /** Safely destroys a scene object. */
        public safeDestroy(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, delay:number = 5, disable:boolean = false):void {
            if (disable) owner.setEnabled(false);
            this.delay(()=>{ owner.dispose(); }, delay);
        }
        /** Get the scene formatted name. */
        public getSceneName(): string {
            if  (this._filename == null || this._filename === "") {
                if (this._scene.database != null && this._scene.database.currentSceneUrl != null) {
                    var filename: string = this._scene.database.currentSceneUrl;
                    var length:number = filename.length;
                    var index:number = filename.lastIndexOf("/");
                    if (index < 0) index = 0; else index++;
                    this._filename = filename.substr(index, length);
                }
            }
            return (this._filename != null && this._filename !== "") ? this._filename : "Unknown.babylon";
        }
        /** Gets the formatted scene path. */
        public getScenePath(): string {
            if  (this._url == null || this._url === "") {
                // Note: Lookup only if no rootUrl from constructor
                if (this._scene.database != null && this._scene.database.currentSceneUrl != null) {
                    var url: string = this._scene.database.currentSceneUrl;
                    this._url = url.substr(0, url.lastIndexOf("/")) + "/";
                }
            }
            return (this._url != null && this._url !== "") ? this._url : "/";
        }
        /** Gets the scene main camera by tag */
        public getMainCamera():BABYLON.Camera {
            // Built-In Main Camera Support
            if (this._mainCamera == null) {
                var cameras = this._scene.getCamerasByTags("MainCamera");
                if (cameras != null && cameras.length > 0) {
                    this._mainCamera = cameras[0];
                }
            }
            return this._mainCamera;
        }
        /** Enters browser full screen mode. */
        public showFullscreen(element:HTMLElement = null): void {
            var fullScreenElement:HTMLElement = (element != null) ? element : document.documentElement;
            BABYLON.Tools.RequestFullscreen(fullScreenElement);
            fullScreenElement.focus();
        }
        /** Exits browser full screen mode. */
        public exitFullscreen(): void {
            BABYLON.Tools.ExitFullscreen();
        }

        // ********************************** //
        // *  Scene Loading Screen Support  * //
        // ********************************** //
        
        /** Shows the index page loading screen. */
        public showLoadingScreen(title:string = "Babylon Toolkit", status:string = null, manual:boolean = true):void {
            var wnd:any = (<any>window);
            if (wnd.showSceneLoader) {
                wnd.showSceneLoader(title);
            } else {
                BABYLON.SceneManager.engine.loadingUIText = title;
                BABYLON.SceneManager.engine.displayLoadingUI();
                if (manual === true) BABYLON.SceneLoader.ShowLoadingScreen = false;
            }
            if (status != null) this.updateLoadingStatus(status);
        }
        /** Freezes the index page loading screen. */
        public freezeLoadingScreen(title:string = "Babylon Toolkit", status:string = null, manual:boolean = true):void {
            (<any>window).show = false;
            this.showLoadingScreen(title, status, manual);
        }
        /** Hides the index page loading screen. */
        public hideLoadingScreen(manual:boolean = true):void {
            var wnd:any = (<any>window);
            if (wnd.removeSceneLoader) {
                wnd.removeSceneLoader();
            } else {
                BABYLON.SceneManager.engine.hideLoadingUI();
                if (manual === true) BABYLON.SceneLoader.ShowLoadingScreen = true;
            }
        }
        /** Update the index page loading status text. */
        public updateLoadingStatus(status:string):void {
            var wnd:any = (<any>window);
            if (wnd.updateStatus) {
                wnd.updateStatus(status);
            }
        }

        // ******************************** //
        // *  Scene Flag Checker Support  * //
        // ******************************** //

        /** Is scene running flag. */
        public isRunning(): boolean {
            return this._running
        }
        /** Is mobile platform flag. */
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

        // ************************************* //
        // * Scene Execute Local Ready Support * //
        // ************************************* //

        /** Internal on ready function list. */
        private _onready:Function[] = [];
        private onready(func:()=>void):void {
            if (func != null) {
                if (this._localSceneReady === true) {
                    func();
                } else {
                    this._onready.push(func);
                }
            }
        }

        // ************************************ //
        // * Scene Execute When Ready Support * //
        // ************************************ //
        
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
            if (BABYLON.SceneManager.readies != null && BABYLON.SceneManager.readies.length > 0) {
                BABYLON.SceneManager.readies.forEach((handler) => { handler(this._scene, this); });
            }
            BABYLON.SceneManager.readies = [];
            if (this._onready != null && this._onready.length > 0) {
                this._onready.forEach((ready) => { ready(); });
                this._onready = null;
            }
            this._localSceneReady = true;
            if (this._scene.metadata != null && this._scene.metadata.properties != null) {
                if (this._scene.metadata.properties.timeManagement === true) {
                    this.enableTime();
                }
                if (this._scene.metadata.properties.enableUserInput === true) {
                    var userInput:any = this._scene.metadata.properties.userInput;
                    var joystick:number = userInput.joystickInputValue;
                    if (joystick !== 0 && this._scene.metadata.properties.virtualJoystickAttached === true) {
                        joystick = 0;
                        BABYLON.Tools.Warn("Virtual joystick camera attached, disabled manual joystick input.");
                    }
                    this.enableUserInput( { 
                        preventDefault: this._scene.metadata.properties.preventDefault,
                        useCapture: this._scene.metadata.properties.useCapture,
                        enableVirtualJoystick: (joystick === 1 || (joystick === 2 && this.isMobile())),
                        disableRightStick: userInput.disableRightStick
                    });
                    var colorText:string = userInput.joystickRightColorText;
                    if (colorText != null && colorText !== "") BABYLON.UserInputOptions.JoystickRightHandleColor = colorText;
                    BABYLON.UserInputOptions.JoystickLeftSensibility = userInput.joystickLeftLevel;
                    BABYLON.UserInputOptions.JoystickRightSensibility = userInput.joystickRightLevel;
                    BABYLON.UserInputOptions.JoystickDeadStickValue = userInput.joystickDeadStick;
                    BABYLON.UserInputOptions.GamepadDeadStickValue = userInput.padDeadStick;
                    BABYLON.UserInputOptions.GamepadLStickXInverted = userInput.padLStickXInvert;
                    BABYLON.UserInputOptions.GamepadLStickYInverted = userInput.padLStickYInvert;
                    BABYLON.UserInputOptions.GamepadRStickXInverted = userInput.padRStickXInvert;
                    BABYLON.UserInputOptions.GamepadRStickYInverted = userInput.padRStickYInvert;
                    BABYLON.UserInputOptions.GamepadLStickSensibility = userInput.padLStickLevel;
                    BABYLON.UserInputOptions.GamepadRStickSensibility = userInput.padRStickLevel;
                    BABYLON.UserInputOptions.PointerAngularSensibility = userInput.mouseAngularLevel;
                    BABYLON.UserInputOptions.PointerWheelDeadZone = userInput.wheelDeadZone;
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

        /** Starts the scene render loop. */
        public start(): void {
            this._running = true;
            this._scene.getEngine().runRenderLoop(this._render);
        }
        /** Stops the scene render loop. */
        public stop(): void {
            this._running = false;
            this._scene.getEngine().stopRenderLoop(this._render);
        }
        /** Toggle the scene render loop on and off. */
        public toggle(): void {
            if (!this._running) {
                this.resumeAudio();
                this.start();
            } else {
                this.pauseAudio();
                this.stop();
            }
        }
        /** Steps the scene render loop frame at a time. */
        public stepFrame(): void {
            if (!this._running) {
                this._render();
            } else {
                this.toggle();
            }
        }
        /** Pauses the scene audio tracks. */
        public pauseAudio(): void {
            if (this._scene.audioEnabled === true) {
                this._scene.audioEnabled = false;
            }
        }
        /** Resumes the scene audio tracks. */
        public resumeAudio(): void {
            if (this._scene.audioEnabled === false) {
                this._scene.audioEnabled = true;
            }
        }

        // ******************************** //
        // *  Scene Debug Helper Support  * //
        // ******************************** //

        /** Toggle debug layer on and off. */
        public toggleDebug(popups:boolean = false, tab:number = 0, parent:HTMLElement = null): void {
            if (this._scene.debugLayer.isVisible()) {
                this._scene.debugLayer.hide();
            } else {
                this._scene.debugLayer.show({ popup: popups, initialTab: tab, parentElement: parent });
            }
        }

        // ********************************* //
        // *  Scene Markup Helper Support  * //
        // ********************************* //

        /** Gets the scene built-in gui mode. */
        public getGuiMode(): string {
            return this._gui;
        }
        /** Gets the index page main gui element. */
        public getGuiElement(): Element {
            return document.getElementById("gui");
        }
        /** Get the scene html markup text. */
        public getSceneMarkup(): string {
            return this._markup;
        }
        /** Draws the scene html markup text. */
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
                BABYLON.Tools.Warn("Scene gui markup disabled.");
            }
        }
        /** Clears the scene markup text. */
        public clearSceneMarkup(): void {
            if (this._gui === "Html") {
                var element: Element = document.getElementById("gui");
                if (element != null) {
                    element.innerHTML = "";
                }
            } else {
                BABYLON.Tools.Warn("Scene gui markup disabled.");
            }
        }

        // *********************************** //
        // *  Scene Ray Cast Helper Support  * //
        // *********************************** //

        public rayCast(ray:BABYLON.Ray, predicate?: (mesh: Mesh) => boolean, fastCheck?: boolean):BABYLON.PickingInfo {
            return this._scene.pickWithRay(ray, predicate, fastCheck);
        }
        public multiRayCast(ray:BABYLON.Ray, predicate?: (mesh: Mesh) => boolean):BABYLON.PickingInfo[] {
            return this._scene.multiPickWithRay(ray, predicate);
        }

        // *********************************** //
        // *  Scene Material Helper Support  * //
        // *********************************** //

        /** Gets the instanced material from scene. If does not exists, execute a optional defaultinstance handler. */
        public getMaterialInstance<T>(name:string, defaultInstance:(newName:String)=>BABYLON.Material = null): T {
            var result:any = this._scene.getMaterialByName(name);
            if (result == null && defaultInstance != null) {
                result = defaultInstance(name);
            }
            return (result != null) ? result as T : null;
        }

        // ********************************** //
        // *   Scene Prefab Clone Support   * //
        // ********************************** //

        /** Checks the scene has the specified prefab mesh. */
        public hasPrefabMesh(prefabName:string): boolean {
            var realPrefab:string = "Prefab." + prefabName;
            return (BABYLON.SceneManager.prefabs[realPrefab] != null);
        }
        /** Gets ths the specified prefab mesh from scene. */
        public getPrefabMesh(prefabName:string): BABYLON.Mesh {
            var result:BABYLON.Mesh = null;
            var realPrefab:string = "Prefab." + prefabName;
            if (this.hasPrefabMesh(prefabName)) {
                result = BABYLON.SceneManager.prefabs[realPrefab] as BABYLON.Mesh;
            }
            return result;
        }
        /** Instantiates the specfied prefab object into scene. */
        public instantiatePrefab(prefabName:string, cloneName: string, newPosition:BABYLON.Vector3 = null, newRotation:BABYLON.Vector3 = null, newScaling:BABYLON.Vector3 = null, newParent: Node = null): BABYLON.Mesh {
            var result:BABYLON.Mesh = null;
            var realPrefab:string = "Prefab." + prefabName;
            if (this.hasPrefabMesh(prefabName)) {
                var prefab:BABYLON.Mesh = this.getPrefabMesh(prefabName);
                if (prefab != null) {
                    result = prefab.clone(cloneName, newParent, false, false);
                    if (result != null) {
                        result.name = BABYLON.Utilities.ReplaceAll(result.name, "Prefab.", "");
                        if (result.parent !== newParent) result.parent = newParent;
                        if (newPosition != null) result.position = newPosition;
                        if (newRotation != null) result.rotation = newRotation;
                        if (newScaling != null) result.scaling = newScaling;
                        // Recurse all prefab clones
                        var clones:BABYLON.Mesh[] = [result];
                        var children:BABYLON.AbstractMesh[] = result.getChildMeshes(false);
                        if (children != null && children.length > 0) {
                            children.forEach((child) => {
                                child.name = BABYLON.Utilities.ReplaceAll(child.name, "Prefab.", "");
                                clones.push(child as BABYLON.Mesh);
                            });
                        }
                        // Parse cloned mesh sources
                        clones.forEach((clone) => {
                            if (clone.source != null) {
                                // Clone source skeleton
                                var aclone:any = clone;
                                if (clone.skeleton == null && clone.source.skeleton != null) {
                                    var skeletonName:string = clone.source.skeleton.name + ".Skeleton";
                                    var skeletonIdentity:string = skeletonName + "." + clone.source.skeleton.id;
                                    clone.skeleton = clone.source.skeleton.clone(skeletonName, skeletonIdentity);
                                }
                                // Clone source lod levels
                                if ((aclone._LODLevels == null || aclone._LODLevels.length <= 0) && aclone.source != null && aclone.source._LODLevels != null && aclone.source._LODLevels.length > 0) {
                                    var levels:any[] = aclone.source._LODLevels;
                                    var count:number = levels.length;
                                    var index:number = 0;
                                    var copies:any[] = [];
                                    for(index=0; index<count; index++) {
                                        var level:any = levels[index]
                                        var lod:BABYLON.Mesh = level.mesh;
                                        var copy:BABYLON.Mesh = (lod != null) ? lod.clone(lod.name.replace("Prefab.", ""), clone, false, false) : null;
                                        copies.push({ "distance": level.distance, "mesh": copy });
                                    }
                                    if (copies != null && copies.length > 0) {
                                        copies.forEach((level) => {
                                            clone.addLODLevel(level.distance, level.mesh);
                                        });
                                    }
                                }
                            }
                        });
                        // Check all child mesh sources
                        var checked:BABYLON.AbstractMesh[] = [];
                        clones.forEach((check) => {
                            if (check.metadata != null && check.metadata.tagName && check.metadata.tagName != null && check.metadata.tagName === "[INSTANCE]") {
                                // Instanced Mesh
                                if (check.metadata.properties && check.metadata.properties != null && check.metadata.properties.prefabSource && check.metadata.properties.prefabSource != null && check.metadata.properties.prefabSource !== "") {
                                    var prefabSource:string = check.metadata.properties.prefabSource;
                                    var prefabOffset:boolean = check.metadata.properties.prefabOffset;
                                    var prefabPosition:number[] = check.metadata.properties.prefabPosition;
                                    var prefabSourceMesh:BABYLON.AbstractMesh = this._scene.getMeshByID(prefabSource);
                                    if (prefabSourceMesh != null) {
                                        var prefabInstanceName:string = check.name;
                                        var prefabInstanceMesh:InstancedMesh = (<BABYLON.Mesh>prefabSourceMesh).createInstance(prefabInstanceName);
                                        if (prefabInstanceMesh != null) {
                                            prefabInstanceMesh.parent = check.parent;
                                            if (prefabSourceMesh.metadata != null) {
                                                prefabInstanceMesh.metadata = BABYLON.SceneManager.CloneMetadata(prefabSourceMesh.metadata);
                                            }
                                            if (prefabOffset === true && prefabPosition != null && prefabPosition.length >= 3) {
                                                prefabInstanceMesh.position = new BABYLON.Vector3(prefabPosition[0], prefabPosition[1], prefabPosition[2]);
                                            }
                                            checked.push(prefabInstanceMesh);
                                            this.safeDestroy(check);
                                        } else {
                                            BABYLON.Tools.Warn("===> Failed to create instance: " + prefabInstanceName);
                                        }
                                    } else {
                                        BABYLON.Tools.Warn("===> Failed to locate prefab source: " + prefabSource);
                                    }
                                } else {
                                    BABYLON.Tools.Warn("===> Failed to parse prefab metadata: " + check.name);
                                }
                            } else {
                                // Non Instanced mesh
                                checked.push(check);
                            }
                        });
                        if (checked != null && checked.length > 0) {
                            BABYLON.SceneManager.parseMeshMetadata(checked, this._scene);
                        }
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
        // *  Scene Tween Animation Support  * //
        // *********************************** //

        /** Tweens (animates) the target property using BABYLON.Animations. */
        public tween(node: BABYLON.Node, targetProperty: string, from: any, to: any, frames:number, fps: number = 30, easing: BABYLON.EasingFunction = null, speedRatio:number = 1.0, callback:()=>void = null, loopMode: number = BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE, enableBlending:boolean = false): BABYLON.Animatable {
            var label:string = "Tween_" + this.time.toString();
            return BABYLON.Animation.CreateAndStartAnimation(label, node, targetProperty, fps, frames, from, to, loopMode, easing, callback);
        }
        /** Tweens (animates) the target property with keys using BABYLON.Animations. */
        public tweenKeys(target:any, targetProperty:string, keys: Array<{frame: number; value: any; }>, frames:number, fps: number = 30, easing:BABYLON.EasingFunction = null, speedRatio:number = 1.0, callback:() => void = null, dataType:number = BABYLON.Animation.ANIMATIONTYPE_VECTOR3, loopMode: number = BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE, enableBlending:boolean = false): BABYLON.Animatable {
            var rate:number = (fps != null && fps > 0) ? fps : 30;
            var label:string = "Tween_" + this.time.toString();
            var animation = new BABYLON.Animation(label, targetProperty, rate, dataType, loopMode, enableBlending); 
            if (easing != null) animation.setEasingFunction(easing);
            animation.setKeys(keys); 
            return this._scene.beginDirectAnimation(target, [animation], 0, frames, (loopMode == BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE), speedRatio, callback);
        }
        /** Tweens (animates) the target property with a float value using BABYLON.Animations. */
        public tweenFloat(target:any, targetProperty:string, start:number, end:number, frames:number, fps: number = 30, easing:BABYLON.EasingFunction = null, speedRatio:number = 1.0, callback:() => void = null, loopMode: number = BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE, enableBlending:boolean = false): BABYLON.Animatable {
            var rate:number = (fps != null && fps > 0) ? fps : 30;
            var keys = [{ frame: 0, value: start }, { frame: frames, value: end }]; 
            var label:string = "Tween_" + this.time.toString();
            var dataType = Animation.ANIMATIONTYPE_FLOAT; 
            var animation = new BABYLON.Animation(label, targetProperty, rate, dataType, loopMode, enableBlending); 
            if (easing != null) animation.setEasingFunction(easing);
            animation.setKeys(keys); 
            return this._scene.beginDirectAnimation(target, [animation], 0, frames, (loopMode == BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE), speedRatio, callback);
        }
        
        // *********************************** //
        // *  Scene Animation State Support  * //
        // *********************************** //

        /** Plays the specified animation clip on the owner object, Optional include all decendents. */
        public playAnimationClip(clip:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, blending:number = 0.0, speed:number = 0.0, decendants:boolean = true, onAnimationEnd:()=>void = null): BABYLON.Animatable[] {
            var result:BABYLON.Animatable[] = null;
            var playback:number = (speed > 0.0) ? speed : 1.0;
            var starting:number = -1;
            var stopping:number = -1;
            var behavior:number = 0;
            var looping:boolean = false;
            var attached:boolean = false;
            var phandler:()=>void = null;
            var animation:BABYLON.IAnimationClip = this.findSceneAnimationClip(clip, owner);
            if (animation != null) {
                attached = true;
                phandler = onAnimationEnd;
                if (starting === -1) {
                    starting = animation.start;
                    stopping = animation.stop;
                    behavior = animation.behavior;
                    looping = animation.behavior < 2;
                    playback = (speed > 0.0) ? speed : animation.playback;
                }
            }
            if (decendants) {
                var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(false);
                if (children != null && children.length > 0) {
                    for (var i:number = 0; i < children.length; i++) {
                        var child:BABYLON.AbstractMesh = children[i];
                        var chandler:()=>void = null;
                        var canimation:BABYLON.IAnimationClip = this.findSceneAnimationClip(clip, child);
                        if (canimation != null) {
                            if (attached === false) {
                                attached = true;
                                chandler = onAnimationEnd;
                            }
                            if (starting === -1) {
                                starting = canimation.start;
                                stopping = canimation.stop;
                                behavior = canimation.behavior;
                                looping = canimation.behavior < 2;
                                playback = (speed > 0.0) ? speed : canimation.playback;
                            }
                            if (starting >= 0 && stopping >= 0) {
                                this.setupAnimationProperties(child, behavior, blending);
                                var canim:BABYLON.Animatable = this._scene.beginAnimation(child, starting, stopping, looping, playback, chandler);
                                if (canim != null) {
                                    if (result == null) result = [];
                                    result.push(canim);
                                }
                            }
                        }
                    }
                }
            }
            // Note: Always Play Owner Animations At Found Ranges
            if (starting >= 0 && stopping >= 0) {
                this.setupAnimationProperties(owner, behavior, blending);
                var panim:BABYLON.Animatable = this._scene.beginAnimation(owner, starting, stopping, looping, playback, phandler);
                if (panim != null) {
                    if (result == null) result = [];
                    result.push(panim);
                }
            }
            return result;
        }
        private setupAnimationProperties(owner:BABYLON.IAnimatable, behavior:number, blending:number):void {
            if (owner != null) {
                if (owner.animations != null && owner.animations.length > 0) {
                    BABYLON.SceneManager.SetAnimationLooping(owner, behavior);
                }
                if (owner instanceof BABYLON.AbstractMesh) {
                    var mesh:BABYLON.AbstractMesh = owner;
                    if (mesh.skeleton != null && mesh.skeleton.bones != null && mesh.skeleton.bones.length > 0) {
                        BABYLON.SceneManager.SetSkeletonProperties(mesh.skeleton, behavior, blending);
                    }
                }
            }
        }

        // ********************************** //
        // *  Scene Physics Helper Support  * //
        // ********************************** //

        /** Applies force to owner using physics imposter. */
        public applyForce(owner:BABYLON.AbstractMesh, force:BABYLON.Vector3, contact:BABYLON.Vector3) : void {
            if (owner != null) {
                if (owner.physicsImpostor != null) {
                    if (force != null) owner.physicsImpostor.applyForce(force, contact);
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
        }
        /** Applies impulse to owner using physics imposter. */
        public applyImpulse(owner:BABYLON.AbstractMesh, impusle:BABYLON.Vector3, contact:BABYLON.Vector3) : void {
            if (owner != null) {
                if (owner.physicsImpostor != null) {
                    if (impusle != null) owner.physicsImpostor.applyImpulse(impusle, contact);
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
        }
        /** Applies friction to owner using physics imposter. */
        public applyFriction(owner:BABYLON.AbstractMesh, friction:number):void {
            if (owner != null) {
                if (owner.physicsImpostor != null && owner.physicsImpostor.physicsBody != null && owner.physicsImpostor.physicsBody.material != null) {
                    owner.physicsImpostor.physicsBody.material.friction = friction;
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
        }
        /** Gets owner friction level using physics imposter. */
        public getFrictionLevel(owner:BABYLON.AbstractMesh):number {
            var result:number = 0;
            if (owner != null) {
                if (owner.physicsImpostor != null && owner.physicsImpostor.physicsBody != null && owner.physicsImpostor.physicsBody.material != null) {
                    result = owner.physicsImpostor.physicsBody.material.friction;
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
            return result;
        }
        /** Gets owner linear velocity using physics imposter. */
        public getLinearVelocity(owner:BABYLON.AbstractMesh):BABYLON.Vector3 {
            var result:BABYLON.Vector3 = null;
            if (owner != null) {
                if (owner.physicsImpostor != null) {
                    result = owner.physicsImpostor.getLinearVelocity();
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
            return result;
        }
        /** Sets owner linear velocity using physics imposter. */
        public setLinearVelocity(owner:BABYLON.AbstractMesh, velocity:BABYLON.Vector3):void {
            if (owner != null) {
                if (owner.physicsImpostor != null) {
                    if (velocity != null) owner.physicsImpostor.setLinearVelocity(velocity);
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
        }
        /** Gets owner angular velocity using physics imposter. */
        public getAngularVelocity(owner:BABYLON.AbstractMesh):BABYLON.Vector3 {
            var result:BABYLON.Vector3 = null;
            if (owner != null) {
                if (owner.physicsImpostor != null) {
                    result = owner.physicsImpostor.getAngularVelocity();
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
            return result;
        }
        /** Sets owner angular velocity using physics imposter. */
        public setAngularVelocity(owner:BABYLON.AbstractMesh, velocity:BABYLON.Vector3):void {
            if (owner != null) {
                if (owner.physicsImpostor != null) {
                    if (velocity != null) owner.physicsImpostor.setAngularVelocity(velocity);
                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
        }
        /** Checks collision contact of the owner using physics imposter. */
        public checkCollisionContact(owner:BABYLON.AbstractMesh, collider:BABYLON.AbstractMesh, contact:BABYLON.CollisionContact, threashold:number = 0.5):boolean {
            var result:boolean = false;
            if (owner != null) {
                if (owner.physicsImpostor != null) {

                    // TODO: Valid Grounding Contact
                    result = true;

                } else {
                    BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + owner.name);
                }
            }
            return result;
        }
        
        // *********************************** //
        // *  Scene Movement Helper Support  * //
        // *********************************** //
        
        /** Moves owner using collisions. */
        public moveWithCollisions(owner:BABYLON.AbstractMesh, velocity:BABYLON.Vector3, rotation:number = 0.0) : void {
            if (owner != null) {
                if (rotation != 0.0) owner.rotate(BABYLON.Axis.Y, rotation);
                if (velocity != null) owner.moveWithCollisions(velocity);
            }
        }

        /** Moves owner using positions. */
        public moveWithTranslation(owner:BABYLON.AbstractMesh, velocity:BABYLON.Vector3, rotation:number = 0.0) : void {
            if (owner != null) {
                if (rotation != 0.0) owner.rotate(BABYLON.Axis.Y, rotation);
                if (velocity != null) owner.position.addInPlace(velocity);
            }
        }

        // ************************************ //
        // *  Scene Component Helper Support  * //
        // ************************************ //

        /** Adds a managed scene component to the scene. */
        public addSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, enableUpdate: boolean = true, propertyBag: any = {}): BABYLON.SceneComponent {
            var result: BABYLON.SceneComponent = null;
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (klass == null || klass === "") throw new Error("Null scene obejct klass specified.");
            if (owner.metadata == null || !owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = {
                    api: true,
                    type: "Babylon",
                    prefab: false,
                    state: {},
                    objectName: "Scene Component",
                    objectId: "0",
                    tagName: "Untagged",
                    layerIndex: 0,
                    layerName: "Default",
                    areaIndex: -1,
                    navAgent: null,
                    meshLink: null,
                    meshObstacle: null,
                    socketList: [],
                    animationClips: [],
                    animationEvents: [],
                    collisionEvent: null,
                    components: [],
                    properties: {}
                };
                owner.metadata = metadata;
            }
            if (owner.metadata != null && owner.metadata.api) {
                if (owner.metadata.disposal == null || owner.metadata.disposal === false) {
                    owner.onDispose = () => { BABYLON.SceneManager.DestroyComponents(owner); };
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
                                name: "EditorScriptComponent",
                                klass: klass,
                                update: enableUpdate,
                                properties: propertyBag,
                                instance: result,
                                tag: {}
                            };
                            metadata.components.push(compscript);
                            result.register();
                        } else {
                            BABYLON.Tools.Error("Failed to create component instance");
                        }
                    } else {
                        BABYLON.Tools.Error("Failed to create component class");
                    }
                } else {
                    BABYLON.Tools.Error("Failed to parse metadata components");
                }
            } else {
                BABYLON.Tools.Error("Null owner object metadata");
            }
            return result;
        }
        
        // ************************************ //
        // *   Scene Component Find Helpers   * //
        // ************************************ //
        
        /** Finds a scene component in the scene with the specfied klass name. */
        public findSceneComponent<T extends BABYLON.SceneComponent>(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): T {
            var result: any = null;
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
            return (result != null) ? result as T : null;
        }
        /** Finds all scene components in the scene with the specfied klass name. */
        public findSceneComponents<T extends BABYLON.SceneComponent>(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): T[] {
            var result: any[] = null;
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
            return (result != null) ? result as T[] : null;
        }
        /** Finds the owner object metedata in the scene. */
        public findSceneMetadata(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ObjectMetadata {
            var result: BABYLON.ObjectMetadata = null;
            if (owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                result = new BABYLON.ObjectMetadata(metadata);
            }
            return result;
        }
        /** Finds the specfied child mesh of owner in the scene. */
        public findSceneChildMesh(name:string, owner:BABYLON.AbstractMesh, searchType:BABYLON.SearchType = BABYLON.SearchType.StartsWith, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            var result:BABYLON.AbstractMesh = null;
            var search:BABYLON.SearchType = (searchType != null) ? searchType : BABYLON.SearchType.StartsWith;
            var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(directDecendantsOnly, predicate);
            return BABYLON.SceneManager.FindMesh(name, children, searchType);            
        }
        /** Finds the specfied collision mesh of owner in the scene. */
        public findSceneCollisionMesh(owner:BABYLON.AbstractMesh, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
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
        /** Finds specfied skeleton in the scene. */
        public findSceneSkeleton(skeletonId:string):BABYLON.Skeleton {
            var skeleton:BABYLON.Skeleton = null;
            var count:number = (this._scene.skeletons != null) ? this._scene.skeletons.length : 0;
            if (count > 0) {
                var index:number = 0;
                for (index=0; index< count; index++) {
                    var check:any = this._scene.skeletons[index];
                    var ident:string = ("" + check.id);
                    if (ident === skeletonId) {
                        skeleton = check;
                        break;
                    }
                }
            }
            return skeleton;
        }
        /** Finds the specfied socket mesh of owner in the scene. */
        public findSceneSocketMesh(name:string, owner:BABYLON.AbstractMesh, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.Mesh {
            var result:BABYLON.Mesh = BABYLON.SceneManager.locateOwnerSocketMesh(name, owner);
            if (result == null) {
                var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(directDecendantsOnly, predicate);
                if (children != null && children.length > 0) {
                    for (var i:number = 0; i < children.length; i++) {
                        var child:BABYLON.AbstractMesh = children[i];
                        result = BABYLON.SceneManager.locateOwnerSocketMesh(name, child);
                        if (result != null) break;
                    }
                }
            }
            return result;            
        }
        /** Finds all the socket meshes of owner in the scene. */
        public findSceneSocketMeshes(owner:BABYLON.AbstractMesh, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.Mesh[] {
            var result:BABYLON.Mesh[] = BABYLON.SceneManager.locateOwnerSocketMeshes(owner);
            if (result == null) {
                var children:BABYLON.AbstractMesh[] = owner.getChildMeshes(directDecendantsOnly, predicate);
                if (children != null && children.length > 0) {
                    for (var i:number = 0; i < children.length; i++) {
                        var child:BABYLON.AbstractMesh = children[i];
                        result = BABYLON.SceneManager.locateOwnerSocketMeshes(child);
                        if (result != null) break;
                    }
                }
            }
            return result;            
        }
        /** Finds the specfied animation clip of owner in the scene. */
        public findSceneAnimationClip(clip:string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.IAnimationClip {
            var result:BABYLON.IAnimationClip = null;
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.animationClips != null && metadata.animationClips.length > 0) {
                    if (clip != null && clip !== "") {
                        var ii:number = 0;
                        for(ii = 0; ii < metadata.animationClips.length; ii++) {
                            if (metadata.animationClips[ii].name === clip) {
                                result = metadata.animationClips[ii];
                                break;
                            }
                        }
                    } else {
                        result = metadata.animationClips[0];
                    }
                }
            }
            return result;
        }
        /** Finds all animations clips of owner in the scene. */
        public findSceneAnimationClips(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.IAnimationClip[] {
            var result:BABYLON.IAnimationClip[] = null;
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.animationClips != null && metadata.animationClips.length > 0) {
                    result = metadata.animationClips as BABYLON.IAnimationClip[];
                }
            }
            return result;
        }
        /** Finds the specfied particle system of owner in the scene. */
        public findSceneParticleSystem(name:string, owner: BABYLON.AbstractMesh | BABYLON.Vector3): BABYLON.IParticleSystem {
            var result:BABYLON.IParticleSystem = null;
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (this._scene.particleSystems != null && this._scene.particleSystems.length > 0) {
                var psystems:number = this._scene.particleSystems.length;
                for (var ii:number = 0; ii < psystems; ii++) {
                    var psystem:BABYLON.IParticleSystem = this._scene.particleSystems[ii];
                    if (psystem.emitter === owner && psystem.name === name) {
                        result = psystem;
                        break;
                    }
                }
            }
            return result;
        }
        /** Finds all the particle systems of owner in the scene. */
        public findSceneParticleSystems(owner: BABYLON.AbstractMesh | BABYLON.Vector3): BABYLON.IParticleSystem[] {
            var result:BABYLON.IParticleSystem[] = [];
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
        /** Finds the specfied lens flare system of owner in the scene. */
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
        /** Finds all the lens flare systems of owner in the scene. */
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

        /** Reset all user input state in the scene. */
        public resetUserInput(): void {
            BABYLON.SceneManager.keymap = {};
            BABYLON.SceneManager.wheel = 0;
            BABYLON.SceneManager.clientx = 0;
            BABYLON.SceneManager.clienty = 0;
            BABYLON.SceneManager.mousex = 0;
            BABYLON.SceneManager.mousey = 0;
            BABYLON.SceneManager.vertical = 0;
            BABYLON.SceneManager.horizontal = 0;
            BABYLON.SceneManager.x_wheel = 0;
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
        /** Enables user input state in the scene. */
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
                document.documentElement.addEventListener("onwheel" in document ? "wheel" : "mousewheel", BABYLON.SceneManager.inputPointerWheelHandler, useCapture);
                BABYLON.SceneManager.preventDefault = preventDefault;
                // Note: Only Enable Gamepad Manager Once
                if (BABYLON.SceneManager.gamepadManager == null) {
                    BABYLON.SceneManager.gamepadConnected = gamepadConnected;
                    BABYLON.SceneManager.gamepadManager = new BABYLON.GamepadManager(); // Note: Do Not Use Scene.GameManager Instance
                    BABYLON.SceneManager.gamepadManager.onGamepadConnectedObservable.add(BABYLON.SceneManager.inputGamepadConnected)
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
        /** Disables user input state in the scene. */
        public disableUserInput(useCapture: boolean = false): void {
            if (this._input) {
                document.documentElement.removeEventListener("keyup", BABYLON.SceneManager.inputKeyUpHandler, useCapture);
                document.documentElement.removeEventListener("keydown", BABYLON.SceneManager.inputKeyDownHandler, useCapture);
                document.documentElement.removeEventListener("pointerup", BABYLON.SceneManager.inputPointerUpHandler, useCapture);
                document.documentElement.removeEventListener("pointerdown", BABYLON.SceneManager.inputPointerDownHandler, useCapture);
                document.documentElement.removeEventListener("pointermove", BABYLON.SceneManager.inputPointerMoveHandler, useCapture);
                document.documentElement.removeEventListener("onwheel" in document ? "wheel" : "mousewheel", BABYLON.SceneManager.inputPointerWheelHandler, useCapture);
                BABYLON.SceneManager.preventDefault = false;
                this.resetUserInput();
                this._input = false;
            }
        }
        /** Get current user input state from the scene. */
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
                    case BABYLON.UserInputAxis.Wheel:
                        result = BABYLON.SceneManager.wheel;
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
        //public disposeConnectedGamepad(): void {
        //    if (this._input) {
        //        BABYLON.SceneManager.gamepad = null;
        //        BABYLON.SceneManager.gamepadType = BABYLON.GamepadType.None;
        //        BABYLON.SceneManager.gamepadManager = null;
        //        BABYLON.SceneManager.gamepadConnected = null;
        //    }
        //}

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

        public updateCameraPosition(camera: BABYLON.FreeCamera, horizontal: number, vertical: number, speed: number): void {
            if (camera != null) {
                var local = camera._computeLocalCameraSpeed() * speed;
                var cameraTransform:BABYLON.Matrix = BABYLON.Matrix.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, 0);
                var deltaTransform:BABYLON.Vector3 = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(horizontal * local, 0, vertical * local), cameraTransform);
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
                this.updateCameraPosition(camera, horizontal, vertical, movementSpeed);
                this.updateCameraRotation(camera, mousex, mousey, rotationSpeed);
            }
        }
        public enableAutoCameraUserInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number):void {
            if (camera != null) {
                this.updateCamera = camera;
                this.cameraInputMoveSpeed = movementSpeed;
                this.cameraInputRotateSpeed = rotationSpeed;
                this.updateCameraInput = true;
            }
        }
        public clearAutoCameraUserInput():void {
            this.updateCamera = null;
            this.cameraInputMoveSpeed = 1.0;
            this.cameraInputRotateSpeed = 0.005;
            this.updateCameraInput = false;
        }
        private autoUpdateCameraUserInput(): void {
            this.updateCameraUserInput(this.updateCamera, this.cameraInputMoveSpeed, this.cameraInputRotateSpeed);
        }
        
        // *********************************** //
        // *  Scene Navigation Tool Support  * //
        // *********************************** //

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
        public findNavigationPath(origin: BABYLON.Vector3, destination: BABYLON.Vector3): BABYLON.Vector3[] {
            if (this._navigation == null || this._navmesh == null || origin == null || destination == null) return null;
            var zone: string = this.getNavigationZone();
            var group: number = this._navigation.getGroup(zone, origin);
            return this._navigation.findPath(origin, destination, zone, group);
        }

        // *********************************** //
        // *  Scene Navigation Mesh Support  * //
        // *********************************** //

        public hasNavigationMesh(): boolean {
            return (this._navmesh != null);
        }
        public getNavigationMesh(): BABYLON.AbstractMesh {
            return this._navmesh;
        }
        public buildNavigationMesh(mesh:BABYLON.AbstractMesh):any {
            if (mesh != null) {
                this._navmesh = mesh;
                var navigation: Navigation = this.getNavigationTool();
                var zoneNodes: any = navigation.buildNodes(this._navmesh);
                if (zoneNodes != null) {
                    navigation.setZoneData(this.getNavigationZone(), zoneNodes);
                } else {
                    BABYLON.Tools.Warn("Failed to set scene navigation zone");
                }
            }
        }
        public getNavigationPoint(position:BABYLON.Vector3, raise:number = 2.0, length:number = Number.MAX_VALUE): BABYLON.Vector3 {
            if (this._navmesh == null || position == null) return null;
            var pos = new BABYLON.Vector3(position.x, (position.y + raise), position.z);
            var ray = new BABYLON.Ray(position, new BABYLON.Vector3(0.0, -1.0, 0.0), length);
            var info = this._scene.pickWithRay(ray, (mesh) => { return (mesh === this._navmesh); });
            return (info.hit && info.pickedPoint) ? info.pickedPoint : null;
        }
        public moveNavigationAgent(agent: BABYLON.AbstractMesh, path: BABYLON.Vector3[], speed?: number, loop?: boolean, callback?: () => void): void {
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
                var move: BABYLON.Animation = new BABYLON.Animation("Move", "position", 3, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
                move.setKeys(direction);
                agent.animations.push(move);
                this._scene.beginAnimation(agent, 0, length, loop, speed, callback);
            }
        }
        public getNavigationAgents(): BABYLON.Mesh[] {
            return this._scene.getMeshesByTags("[NAVAGENT]");
        }
        public getNavigationAgentInfo(agent: BABYLON.AbstractMesh): BABYLON.NavigationAgent {
            return new BABYLON.NavigationAgent(agent);
        }
        public getNavigationAreaTable(): BABYLON.INavigationArea[] {
            return (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.table != null) ? this._navmesh.metadata.properties.table : [];
        }
        public getNavigationAreaIndexes(): number[] {
            return (this._navmesh.metadata != null && this._navmesh.metadata.properties != null && this._navmesh.metadata.properties.areas != null) ? this._navmesh.metadata.properties.areas : [];
        }
        public getNavigationAreaName(index: number): string {
            var result:string = "";
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
            var result:number = -1;
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
            var key:string = "k" + e.keyCode.toString();
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
            var key:string = "k" + e.keyCode.toString();
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

        private static inputPointerWheelHandler(e:any): any {
            //var e = window.event || e; // old IE support
            //var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            var delta = e.deltaY ? -e.deltaY : e.wheelDelta / 40;
            BABYLON.SceneManager.x_wheel = Math.abs(delta) > BABYLON.UserInputOptions.PointerWheelDeadZone ? 0 + delta : 0;            
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
            var key:string = "p" + e.button.toString();
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
            var key:string = "p" + e.button.toString();
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
                    var mousex:number = offsetX * (BABYLON.UserInputOptions.PointerAngularSensibility / 10);
                    var mousey:number = offsetY * (BABYLON.UserInputOptions.PointerAngularSensibility / 10);
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
                var key:string = "b" + button.toString();
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
                var key:string = "b" + button.toString();
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
                var key:string = "d" + dPadPressed.toString();
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
                var key:string = "d" + dPadReleased.toString();
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
                var normalizedLX:number = LSValues.x * BABYLON.UserInputOptions.GamepadLStickSensibility;
                var normalizedLY:number = LSValues.y * BABYLON.UserInputOptions.GamepadLStickSensibility;
                LSValues.x = Math.abs(normalizedLX) > BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedLX : 0;
                LSValues.y = Math.abs(normalizedLY) > BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedLY : 0;
                BABYLON.SceneManager.g_horizontal = (BABYLON.UserInputOptions.GamepadLStickXInverted) ? -LSValues.x : LSValues.x;
                BABYLON.SceneManager.g_vertical = (BABYLON.UserInputOptions.GamepadLStickYInverted) ? LSValues.y : -LSValues.y;
            }
        }
        private static inputRightStickHandler(values: BABYLON.StickValues): void {
            if (BABYLON.SceneManager.gamepad != null) {
                var RSValues:BABYLON.StickValues = values;
                var normalizedRX:number = RSValues.x * BABYLON.UserInputOptions.GamepadRStickSensibility;
                var normalizedRY:number = RSValues.y * BABYLON.UserInputOptions.GamepadRStickSensibility;
                RSValues.x = Math.abs(normalizedRX) > BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedRX : 0;
                RSValues.y = Math.abs(normalizedRY) > BABYLON.UserInputOptions.GamepadDeadStickValue ? 0 + normalizedRY : 0;
                BABYLON.SceneManager.g_mousex = (BABYLON.UserInputOptions.GamepadRStickXInverted) ? -RSValues.x : RSValues.x;
                BABYLON.SceneManager.g_mousey = (BABYLON.UserInputOptions.GamepadRStickYInverted) ? -RSValues.y : RSValues.y;
            }
        }
        private static inputGamepadConnected(pad: BABYLON.Gamepad, state:BABYLON.EventState) {
            if (pad != null && pad.index === 0 && BABYLON.SceneManager.gamepad == null) {
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
                var normalizedLX:number = LSDelta.x;
                var normalizedLY:number = LSDelta.y;
                LSDelta.x = Math.abs(normalizedLX) > BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedLX : 0;
                LSDelta.y = Math.abs(normalizedLY) > BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedLY : 0;
                BABYLON.SceneManager.j_horizontal = LSDelta.x;
                BABYLON.SceneManager.j_vertical = LSDelta.y;
            }
            if (BABYLON.SceneManager.rightJoystick != null) {
                // Update right virtual joystick values
                var RSDelta:BABYLON.Vector3 = BABYLON.SceneManager.rightJoystick.deltaPosition;
                if (!BABYLON.SceneManager.rightJoystick.pressed) {
                    RSDelta = RSDelta.scale(0.9);
                }
                var normalizedRX:number = RSDelta.x;
                var normalizedRY:number = RSDelta.y;
                RSDelta.x = Math.abs(normalizedRX) > BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedRX : 0;
                RSDelta.y = Math.abs(normalizedRY) > BABYLON.UserInputOptions.JoystickDeadStickValue ? 0 + normalizedRY : 0;
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
            BABYLON.SceneManager.wheel = BABYLON.SceneManager.x_wheel;
            // Reset Mouse Wheel Buffer
            BABYLON.SceneManager.x_mousey = 0;
            // Auto update camera user input buffer
            if (BABYLON.SceneManager.me.updateCameraInput === true && BABYLON.SceneManager.me.updateCamera != null) {
                BABYLON.SceneManager.me.autoUpdateCameraUserInput();
            }
        }

        // *********************************** //
        // *  Private Scene Parsing Support  * //
        // *********************************** //

        private static parseSceneMetadata(rootUrl: string, scene: BABYLON.Scene): void {
            (<any>window).parsing = true;
            var scenex: any = <any>scene;
            if (scenex.manager == null) {
                BABYLON.SceneManager.CreateManagerSession(rootUrl, scene);
                if (scenex.manager == null) BABYLON.Tools.Warn("Failed to create a new manager session for current scene.");                    
            } else {
                BABYLON.Tools.Warn("Current scene has already been parsed.");
            }
            (<any>window).parsing = false;
        }
        private static parseMeshMetadata(meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene): void {
            (<any>window).parsing = true;
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
                BABYLON.Tools.Warn("No scene manager detected for current scene.");
            }
            (<any>window).parsing = false;
        }
        private static parseSceneCameras(cameras: BABYLON.Camera[], scene: BABYLON.Scene, ticklist: BABYLON.IScriptComponent[]): void {
            if (cameras != null && cameras.length > 0) {
                cameras.forEach((camera) => {
                    if (camera.metadata != null && camera.metadata.api) {
                        // Setup metadata cloning
                        camera.metadata.clone = () => { return BABYLON.SceneManager.CloneMetadata(camera.metadata); };
                        // Camera component cleanup
                        if (camera.metadata.disposal == null || camera.metadata.disposal === false) {
                            camera.onDispose = () => { BABYLON.SceneManager.DestroyComponents(camera); };
                            camera.metadata.disposal = true;
                        }
                        // Camera component scripts
                        var metadata: BABYLON.IObjectMetadata = camera.metadata as BABYLON.IObjectMetadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach((camerascript) => {
                                if (camerascript.klass != null && camerascript.klass !== "" && camerascript.klass !== "BABYLON.SceneComponent" && camerascript.klass !== "BABYLON.OrthoController") {
                                    var CameraComponentClass = BABYLON.Tools.Instantiate(camerascript.klass);
                                    if (CameraComponentClass != null) {
                                        camerascript.instance = new CameraComponentClass(camera, scene, camerascript.update, camerascript.properties);
                                        if (camerascript.instance != null) {
                                            if (ticklist != null) ticklist.push(camerascript);
                                        }
                                    }
                                }
                            });
                        }
                        // Camera rigging options
                        BABYLON.SceneManager.setupCameraRigOptions(camera, scene, ticklist);
                        // Camera animation state
                        BABYLON.SceneManager.setupAnimationState(camera, scene);
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
                            light.onDispose = () => { BABYLON.SceneManager.DestroyComponents(light); };
                            light.metadata.disposal = true;
                        }
                        // Light component scripts
                        var metadata: BABYLON.IObjectMetadata = light.metadata as BABYLON.IObjectMetadata;
                        if (metadata.components != null && metadata.components.length > 0) {
                            metadata.components.forEach((lightscript) => {
                                if (lightscript.klass != null && lightscript.klass !== "" && lightscript.klass !== "BABYLON.SceneComponent" && lightscript.klass !== "BABYLON.OrthoController") {
                                    var LightComponentClass = BABYLON.Tools.Instantiate(lightscript.klass);
                                    if (LightComponentClass != null) {
                                        lightscript.instance = new LightComponentClass(light, scene, lightscript.update, lightscript.properties);
                                        if (lightscript.instance != null) {
                                            if (ticklist != null) ticklist.push(lightscript);
                                        }
                                    }
                                }
                            });
                        }
                        // Light animation state
                        BABYLON.SceneManager.setupAnimationState(light, scene);
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
                        // Setup shared skeleton
                        BABYLON.SceneManager.setupSharedSkeleton(mesh, scene);
                        // Setup prefab masters
                        if (mesh.metadata.prefab === true) {
                            mesh.setEnabled(false);
                            BABYLON.SceneManager.prefabs[mesh.name] = mesh;
                            BABYLON.SceneManager.setupLodGroups(mesh, scene, true);
                        } else {
                            BABYLON.SceneManager.setupLodGroups(mesh, scene, false);
                            // Mesh component cleanup
                            if (mesh.metadata.disposal == null || mesh.metadata.disposal === false) {
                                mesh.onDispose = () => { BABYLON.SceneManager.DestroyComponents(mesh); };
                                mesh.metadata.disposal = true;
                            }
                            // Mesh navigation setup
                            if (mesh.name === "sceneNavigationMesh" && scene.metadata.properties.hasNavigationMesh != null && scene.metadata.properties.hasNavigationMesh === true) {
                                if (BABYLON.SceneManager.me.hasNavigationMesh() === false) {
                                    BABYLON.SceneManager.me.buildNavigationMesh(mesh);
                                } else {
                                    BABYLON.Tools.Warn("Scene navigation mesh already exists. Ignoring navigation zone building for mesh: " + mesh.name);
                                }
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
                                    if (meshscript.klass != null && meshscript.klass !== "" && meshscript.klass !== "BABYLON.SceneComponent" && meshscript.klass !== "BABYLON.OrthoController") {
                                        var MeshComponentClass = BABYLON.Tools.Instantiate(meshscript.klass);
                                        if (MeshComponentClass != null) {
                                            meshscript.instance = new MeshComponentClass(mesh, scene, meshscript.update, meshscript.properties);
                                            if (meshscript.instance != null) {
                                                if (ticklist != null) ticklist.push(meshscript);
                                            }
                                        }
                                    }
                                });
                            }
                            // Setup animation state
                            BABYLON.SceneManager.setupAnimationState(mesh, scene);
                            // Setup terrain meshes
                            BABYLON.SceneManager.setupTerrainMeshes(mesh, scene);
                            // Setup socket meshes
                            BABYLON.SceneManager.setupSocketMeshes(mesh, scene);
                            // Setup detail meshes
                            if (mesh.metadata != null && mesh.metadata.properties && mesh.metadata.properties != null) {
                                if (mesh.metadata.properties.defaultEllipsoid && mesh.metadata.properties.defaultEllipsoid != null && mesh.metadata.properties.defaultEllipsoid.length >= 3) {
                                    var defaultEllipsoid:number[] = mesh.metadata.properties.defaultEllipsoid;
                                    mesh.ellipsoid = new BABYLON.Vector3(defaultEllipsoid[0], defaultEllipsoid[1], defaultEllipsoid[2]);
                                }
                                if (mesh.metadata.properties.ellipsoidOffset && mesh.metadata.properties.ellipsoidOffset != null && mesh.metadata.properties.ellipsoidOffset.length >= 3) {
                                    var ellipsoidOffset:number[] = mesh.metadata.properties.ellipsoidOffset;
                                    mesh.ellipsoidOffset = new BABYLON.Vector3(ellipsoidOffset[0], ellipsoidOffset[1], ellipsoidOffset[2]);
                                }
                                if (mesh.metadata.properties.hasOwnProperty("freezeWorldMatrix") && mesh.metadata.properties.freezeWorldMatrix === true) {
                                    mesh.freezeWorldMatrix();
                                }
                                if (mesh.metadata.properties.hasOwnProperty("convertToUnIndexed") && mesh.metadata.properties.convertToUnIndexed === true) {
                                    (<BABYLON.Mesh>mesh).convertToUnIndexedMesh();
                                }
                                if (mesh.metadata.properties.hasOwnProperty("convertToFlatShaded") && mesh.metadata.properties.convertToFlatShaded === true) {
                                    (<BABYLON.Mesh>mesh).convertToFlatShadedMesh();
                                }
                            }
                        }
                    }
                });
                BABYLON.SceneManager.postParseSceneMeshes(meshes, scene);
            }
        }
        private static postParseSceneMeshes(meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene):void {
            if (meshes != null && meshes.length > 0) {
                var statics:any = {};
                meshes.forEach((mesh) => {
                    if (mesh.metadata != null && mesh.metadata.api) {
                        if (BABYLON.SceneManager.staticVertexLimit === false) {
                            // Parse Static Vertex Limit Meshes
                            if (mesh.metadata.layerIndex === BABYLON.SceneManager.StaticIndex) {
                                if (mesh.name.indexOf("_StaticMesh_") >= 0) {
                                    mesh.metadata.layerIndex = -99;
                                    var key:string = mesh.material.id;
                                    var list:BABYLON.Mesh[] = null;
                                    if (statics.hasOwnProperty(key)) {
                                        list = statics[key];
                                    } else {
                                        list = [];
                                        statics[key] = list;
                                    }
                                    list.push(mesh as BABYLON.Mesh);
                                }
                            }
                        }
                    }
                });
                // Merge Static Vertex Limit Meshes
                if (BABYLON.SceneManager.staticVertexLimit === false) {
                    for (var key in statics) {
                        if (statics.hasOwnProperty(key)) {
                            var list:BABYLON.Mesh[] = statics[key];
                            if (list != null && list.length > 1) {
                                var staticParent:BABYLON.Node = list[0].parent;
                                var staticMesh:BABYLON.Mesh = BABYLON.Mesh.MergeMeshes(list, true, true);
                                if (staticMesh != null) staticMesh.parent = staticParent;
                            }
                        }
                    }
                }
            }
        }
        private static setupLodGroups(mesh:BABYLON.AbstractMesh, scene: BABYLON.Scene, prefab:boolean):void {
            if (mesh != null && mesh.metadata != null && mesh.metadata.properties && mesh.metadata.properties != null && mesh.metadata.properties.lodGroupInfo && mesh.metadata.properties.lodGroupInfo != null) {
                var lodGroup:any = mesh.metadata.properties.lodGroupInfo;
                var lodCount:number = lodGroup.lodCount;
                var lodDetails:any[] = lodGroup.lodDetails;
                var fadeMode:string = lodGroup.fadeMode;
                var crossFading:boolean = lodGroup.crossFading;
                var startCulling:number = lodGroup.startCulling;
                var nearClipingPlane:number = lodGroup.nearClipingPlane;
                var farClipingPlane:number = lodGroup.farClipingPlane;
                var cameraDistanceFactor:number = lodGroup.cameraDistanceFactor;
                var childMeshes:BABYLON.AbstractMesh[] = mesh.getChildMeshes(false);
                if (lodDetails != null && lodDetails.length > 0 && childMeshes != null && childMeshes.length > 0) {
                    var masterLevel:BABYLON.Mesh = null;
                    lodDetails.forEach((detail) => {
                        var startingPercent:number = detail.startingPercent;
                        var endingPercent:number = detail.endingPercent;
                        var rendererCount:number = detail.rendererCount;
                        var lodRenderers:any[] = detail.lodRenderers;
                        var lodDistance:number = detail.lodDistance;
                        var startRange:number = detail.startRange;
                        if (lodRenderers != null && lodRenderers.length > 0) {
                            var renderer:any = lodRenderers[0];
                            var name:string = renderer.name;
                            var check:AbstractMesh = BABYLON.SceneManager.FindMesh(name, childMeshes, BABYLON.SearchType.IndexOf);
                            var instance:AbstractMesh = null;
                            if (check != null) {
                                // Check instance mesh place holder
                                if (check.metadata != null && check.metadata.tagName && check.metadata.tagName != null && check.metadata.tagName === "[INSTANCE]") {
                                    if (check.metadata.properties && check.metadata.properties != null && check.metadata.properties.prefabSource && check.metadata.properties.prefabSource != null && check.metadata.properties.prefabSource !== "") {
                                        instance = check;
                                        check = scene.getMeshByID(check.metadata.properties.prefabSource);
                                    }
                                }
                                // Parse all lod detail group levels
                                if (check != null) {
                                    if (masterLevel == null) {
                                        //LOD0 - Master Level
                                        masterLevel = check as BABYLON.Mesh;
                                        masterLevel.setEnabled(false);
                                    }
                                    if (check != masterLevel) {
                                        // LOD++ Additional Levels
                                        if (prefab === true) {
                                            if (BABYLON.SceneManager.orphans == null) {
                                                BABYLON.SceneManager.orphans = new BABYLON.Mesh("Prefab.Orphans", scene);
                                                BABYLON.SceneManager.orphans.setEnabled(true);
                                                BABYLON.SceneManager.orphans.isVisible = true;
                                            }
                                            check.parent = BABYLON.SceneManager.orphans;
                                        } else {
                                            check.parent = masterLevel;
                                        }
                                        masterLevel.addLODLevel(startRange, check as BABYLON.Mesh);
                                        if (instance != null) {
                                            // Remove source instance place holder
                                            instance.parent = null;
                                            instance.metadata.tagName = null;
                                            instance.metadata.prefabSource = null;
                                            BABYLON.SceneManager.me.safeDestroy(instance);
                                        }
                                    }
                                }
                            }
                        }
                    });
                    // Master lod detail complete
                    if (masterLevel != null) {
                        if (startCulling > 0.0) masterLevel.addLODLevel(startCulling, null);
                        masterLevel.setEnabled(true);
                    }
                }
                // Clear lod group info
                mesh.metadata.properties.lodGroupInfo = null;                
            }
        }        
        private static setupTerrainMeshes(mesh:BABYLON.AbstractMesh, scene: BABYLON.Scene):void {
            if (mesh != null && mesh.metadata != null && mesh.metadata.properties && mesh.metadata.properties != null) {
                // Proccess tree meshes
                var index:number = 0;
                if (mesh.metadata.properties.treeInstances && mesh.metadata.properties.treeInstances != null && mesh.metadata.properties.treeInstances.length > 0) {
                    var trees:any[] = mesh.metadata.properties.treeInstances;
                    trees.forEach((tree) => {
                        index++;
                        var tree_prefab:string = tree.prefab;
                        var tree_color:number[] = tree.color;
                        var tree_heightScale:number = tree.heightScale;
                        var tree_lightmapColor:number[] = tree.lightmapColor;
                        var tree_position:number[] = tree.position;
                        var tree_rotation:number = tree.rotation;
                        var tree_widthScale:number = tree.widthScale;
                        var tree_label:string = (tree_prefab + "_" + index.toString());
                        // Instantiate tree prefab
                        var prefab_parent:BABYLON.Node = mesh;
                        var prefab_position:Vector3 = new BABYLON.Vector3(tree_position[0], tree_position[1], tree_position[2]);
                        var prefab_rotation:Vector3 = new BABYLON.Vector3(0.0, tree_rotation, 0.0);
                        var prefab_scaling:BABYLON.Vector3 = new BABYLON.Vector3(tree_widthScale, tree_heightScale, tree_widthScale);
                        BABYLON.SceneManager.me.onready(()=>{
                            BABYLON.SceneManager.me.instantiatePrefab(tree_prefab, tree_label, prefab_position, prefab_rotation, prefab_scaling, prefab_parent);
                        });
                    });
                }
                // Proccess detail meshes
                index = 0;
                if (mesh.metadata.properties.detailPrototypes && mesh.metadata.properties.detailPrototypes != null && mesh.metadata.properties.detailPrototypes.length > 0) {
                    var details:any[] = mesh.metadata.properties.detailPrototypes;
                    details.forEach((detail) => {
                        // TODO: Place terrain grass and detail prototypes
                    });
                }
            }
        }        
        private static setupSocketMeshes(mesh:BABYLON.AbstractMesh, scene: BABYLON.Scene):void {
            if (mesh != null && mesh.metadata.socketList != null && mesh.metadata.socketList.length > 0) {
                if (mesh.skeleton != null && mesh.skeleton.bones != null && mesh.skeleton.bones.length > 0) {
                    var sockets:BABYLON.ISocketData[] = mesh.metadata.socketList;
                    sockets.forEach((socket) => {
                        if (mesh.skeleton.bones.length >= (socket.boneIndex + 1)) {
                            var bone:BABYLON.Bone = mesh.skeleton.bones[socket.boneIndex];
                            var bname:string = socket.boneName + ".Socket.";
                            if (mesh.parent != null) bname += (mesh.parent.name + ".");
                            bname += (mesh.name + "." + BABYLON.Tools.RandomId());
                            if (BABYLON.SceneManager.showDebugSockets === true) {
                                socket.socketMesh = BABYLON.Mesh.CreateBox(bname, BABYLON.SceneManager.socketColliderSize, scene);
                                socket.socketMesh.visibility = BABYLON.SceneManager.colliderVisibility;
                            } else {
                                socket.socketMesh = new BABYLON.Mesh(bname, scene);
                            }
                            socket.socketMesh.position = new BABYLON.Vector3(socket.positionX, socket.positionY, socket.positionZ);
                            socket.socketMesh.rotation = new BABYLON.Vector3(socket.rotationX, socket.rotationY, socket.rotationZ);
                            socket.socketMesh.checkCollisions = false;
                            socket.socketMesh.attachToBone(bone, mesh);
                            if (socket.prefabName != null && socket.prefabName !== "") {
                                var prefabPosition:BABYLON.Vector3 = new BABYLON.Vector3(socket.prefabPositionX, socket.prefabPositionY, socket.prefabPositionZ);
                                var prefabRotation:BABYLON.Vector3 = new BABYLON.Vector3(socket.prefabRotationX, socket.prefabRotationY, socket.prefabRotationZ);
                                BABYLON.SceneManager.me.onready(()=>{
                                    BABYLON.SceneManager.me.instantiatePrefab(socket.prefabName, socket.prefabName, prefabPosition, prefabRotation, null, socket.socketMesh);
                                });
                            }
                        }
                    });
                }
            }
        }
        private static setupSharedSkeleton(mesh:BABYLON.AbstractMesh, scene: BABYLON.Scene):void {
            if (mesh != null && mesh.metadata != null && mesh.metadata.properties && mesh.metadata.properties != null && mesh.metadata.properties.sharedSkeletonId && mesh.metadata.properties.sharedSkeletonId !== "") {
                var sharedSkeletonId:string = mesh.metadata.properties.sharedSkeletonId;
                var source:BABYLON.AbstractMesh = scene.getMeshByID(sharedSkeletonId);
                if (source != null && source.skeleton != null) {
                    var new_animationClips:any[] = [];
                    if (source.metadata.animationClips != null && source.metadata.animationClips.length > 0) {
                        source.metadata.animationClips.forEach((state) => {
                            var new_state_properties:any = {};
                            BABYLON.SceneManager.DeepCopyProperties(state, new_state_properties);
                            new_animationClips.push(new_state_properties);
                        });
                    }
                    mesh.metadata.animationClips = new_animationClips;
                    mesh.skeleton = source.skeleton.clone(mesh.name, mesh.name + ".Clone." + BABYLON.Tools.RandomId());
                } else {
                    BABYLON.Tools.Warn("Failed to locate source skeleton: " + sharedSkeletonId);
                }
            }
        }
        private static setupPhysicsImpostor(physicsMesh:BABYLON.AbstractMesh, plugin:number, friction:number, collisions:boolean, rotation:number):void {
            if (physicsMesh != null && physicsMesh.physicsImpostor != null) {
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
            if (camera != null && camera.metadata != null && camera.metadata.properties != null) {
                // Check Orthographic Camera Mode
                if (camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
                    var size:number = camera.metadata.properties.orthographicSize || 5;
                    var klass:string = "BABYLON.OrthoController";
                    var resize:boolean = (scene.metadata != null && scene.metadata.properties != null && scene.metadata.properties.hasOwnProperty("resizeCameras")) ? scene.metadata.properties.resizeCameras : true;
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
                                name: "EditorScriptComponent",
                                klass: klass,
                                update: false,
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
                /*
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
                */
                
                // Check Attached Rendering Canvas Control
                if (camera.metadata.properties.cameraInput && camera.metadata.properties.cameraInput > 0) {
                    var cameraInput:number = camera.metadata.properties.cameraInput;
                    if (cameraInput === 1) {
                        var preventDefault:boolean = (camera.metadata.properties.hasOwnProperty("preventDefaultEvents")) ? camera.metadata.properties.preventDefaultEvents : false;
                        camera.attachControl(scene.getEngine().getRenderingCanvas(), !preventDefault);
                    } else if (cameraInput === 2) {
                        var freeCameraBased:boolean = true; //(cameraType === "FreeCamera" || cameraType === "UniversialCamera");
                        if (freeCameraBased) {
                            var cameraMoveSpeed:number = 1.0;
                            var cameraRotateSpeed:number = 0.005;
                            if (camera.metadata.properties.cameraMoveSpeed) cameraMoveSpeed = camera.metadata.properties.cameraMoveSpeed;
                            if (camera.metadata.properties.cameraRotateSpeed) cameraRotateSpeed = camera.metadata.properties.cameraRotateSpeed;
                            BABYLON.SceneManager.me.enableAutoCameraUserInput(camera as BABYLON.FreeCamera, cameraMoveSpeed, cameraRotateSpeed);
                        }
                    }
                }
            }
        }
        private static setupAnimationState(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, scene: BABYLON.Scene) : void {
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                var machine:BABYLON.AnimationState = BABYLON.SceneManager.me.findSceneComponent("BABYLON.AnimationState", owner);
                if (machine != null) {
                    // Setup Animation Events
                    if (metadata.animationEvents != null && metadata.animationEvents.length > 0 && metadata.components != null && metadata.components.length > 0) {
                        var track:BABYLON.Animation = BABYLON.SceneManager.locateOwnerAnimationTrack(0, owner, false);
                        if (track != null) {
                            metadata.animationEvents.forEach((evt) => {
                                if (evt.functionName != null && evt.functionName !== "") {
                                    var functionName:string = evt.functionName.toLowerCase();
                                    track.addEvent(new BABYLON.AnimationEvent(evt.frame, ()=>{
                                        var ownerinstance:any = (<any>machine);
                                        if (ownerinstance._handlers != null && ownerinstance._handlers[functionName]) {
                                            var handler:(evt:BABYLON.IAnimationEvent)=>void = ownerinstance._handlers[functionName];
                                            if (handler) handler(evt);
                                        }
                                    }));
                                }
                            });
                        }
                    }
                }
            }            
        }
        private static locateOwnerSocketMesh(name:string, owner: BABYLON.AbstractMesh, searchType:BABYLON.SearchType = BABYLON.SearchType.StartsWith):BABYLON.Mesh {
            var result:BABYLON.Mesh = null;
            if (owner != null && owner.metadata && owner.metadata != null && owner.metadata.socketList && owner.metadata.socketList != null && owner.metadata.socketList.length > 0) {
                var sockets:BABYLON.ISocketData[] = owner.metadata.socketList;
                var search:BABYLON.SearchType = (searchType != null) ? searchType : BABYLON.SearchType.StartsWith;
                var index:number = 0;
                for(index = 0; index < sockets.length; index++) {
                    var socket:BABYLON.ISocketData = sockets[index];
                    if (search === BABYLON.SearchType.StartsWith) {
                        if (BABYLON.Utilities.StartsWith(socket.boneName, name)) {
                            result = socket.socketMesh;
                            break;
                        }
                    } else if (search === BABYLON.SearchType.EndsWith) {
                        if (BABYLON.Utilities.EndsWith(socket.boneName, name)) {
                            result = socket.socketMesh;
                            break;
                        }
                    } else if (search === BABYLON.SearchType.IndexOf) {
                        if (socket.boneName.indexOf(name) >= 0) {
                            result = socket.socketMesh;
                            break;
                        }
                    } else {
                        if (socket.boneName === name) {
                            result = socket.socketMesh;
                            break;
                        }
                    }
                }
            }
            return result;
        }
        private static locateOwnerSocketMeshes(owner: BABYLON.AbstractMesh):BABYLON.Mesh[] {
            var result:BABYLON.Mesh[] = null;
            if (owner != null && owner.metadata && owner.metadata != null && owner.metadata.socketList && owner.metadata.socketList != null && owner.metadata.socketList.length > 0) {
                result = [];
                var sockets:BABYLON.ISocketData[] = owner.metadata.socketList;
                sockets.forEach((socket) => {
                    result.push(socket.socketMesh);                    
                });
            }
            return result;
        }
        private static locateOwnerAnimationTrack(index:number, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.Animation {
            var result:BABYLON.Animation = null;
            if (owner != null && owner instanceof BABYLON.AbstractMesh) {
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
        
        // *********************************** //
        // *   Public Scene Tools Support    * //
        // *********************************** //

        public static DestroyComponents(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, destroyMetadata: boolean = true): void {
            if (owner != null && owner.metadata != null && owner.metadata.api) {
                var metadata: BABYLON.IObjectMetadata = owner.metadata as BABYLON.IObjectMetadata;
                if (metadata.components != null && metadata.components.length > 0) {
                    metadata.components.forEach((ownerscript) => {
                        if (ownerscript.instance != null) {
                            ownerscript.instance.dispose();
                            ownerscript.instance = null;
                        }
                    });
                }
                if (metadata.socketList != null && metadata.socketList.length > 0) {
                    metadata.socketList.forEach((socketdata) => {
                        if (socketdata.socketMesh != null) {
                            socketdata.socketMesh.dispose();
                            socketdata.socketMesh = null;
                        }
                    });
                }
                if (destroyMetadata) {
                    if (owner.metadata.components != null) {
                        owner.metadata.components = null;
                    }
                    if (owner.metadata.properties != null) {
                        owner.metadata.properties = null;
                    }
                    if (owner.metadata.socketList != null) {
                        owner.metadata.socketList = null;
                    }
                    if (owner.metadata.animationClips != null) {
                        owner.metadata.animationClips = null;
                    }
                    if (owner.metadata.animationEvents != null) {
                        owner.metadata.animationEvents = null;
                    }
                    if (owner.metadata.collisionEvent != null) {
                        owner.metadata.collisionEvent = null;
                    }
                    owner.metadata = null;
                }
            }
        }
        
        // *********************************** //
        // *   Public Blend Tools Support    * //
        // *********************************** //
        
        public static SetAnimationBlending(owner:BABYLON.IAnimatable, blendingSpeed:number): void {
            if (owner != null) {
                var animations = owner.animations;
                for (var index = 0; index < animations.length; index++) {
                    animations[index].enableBlending = (blendingSpeed > 0.0);
                    animations[index].blendingSpeed = blendingSpeed;
                }
            }
        }

        public static SetSkeletonBlending(skeleton:BABYLON.Skeleton, blendingSpeed:number) {
            if (skeleton != null) {
                skeleton.bones.forEach((bone) => {
                    bone.animations.forEach((animation: Animation) => {
                        animation.enableBlending = (blendingSpeed > 0.0);
                        animation.blendingSpeed = blendingSpeed;
                    });
                });
            }
        }

        public static SetAnimationLooping(owner:BABYLON.IAnimatable, loopBehavior:number): void {
            if (owner != null) {
                var animations = owner.animations;
                for (var index = 0; index < animations.length; index++) {
                    animations[index].loopMode = loopBehavior;
                }
            }
        }
        
        public static SetSkeletonLooping(skeleton:BABYLON.Skeleton, loopBehavior:number) {
            if (skeleton != null) {
                skeleton.bones.forEach((bone) => {
                    bone.animations.forEach((animation: Animation) => {
                        animation.loopMode = loopBehavior;
                    });
                });
            }
        }
        
        public static SetAnimationProperties(owner:BABYLON.IAnimatable, loopBehavior:number, blendingSpeed:number): void {
            if (owner != null) {
                var animations = owner.animations;
                for (var index = 0; index < animations.length; index++) {
                    animations[index].enableBlending = (blendingSpeed > 0.0);
                    animations[index].blendingSpeed = blendingSpeed;
                    animations[index].loopMode = loopBehavior;
                }
            }
        }
        
        public static SetSkeletonProperties(skeleton:BABYLON.Skeleton, loopBehavior:number, blendingSpeed:number) {
            if (skeleton != null) {
                skeleton.bones.forEach((bone) => {
                    bone.animations.forEach((animation: Animation) => {
                        animation.enableBlending = (blendingSpeed > 0.0);
                        animation.blendingSpeed = blendingSpeed;
                        animation.loopMode = loopBehavior;
                    });
                });
            }
        }
        
        // *********************************** //
        // *   Public Helper Tools Support   * //
        // *********************************** //

        public static FindMesh(name:string, meshes:BABYLON.AbstractMesh[], searchType:BABYLON.SearchType = BABYLON.SearchType.StartsWith):BABYLON.AbstractMesh {
            var result:BABYLON.AbstractMesh = null;
            var search:BABYLON.SearchType = (searchType != null) ? searchType : BABYLON.SearchType.StartsWith;
            if (meshes != null && meshes.length > 0) {
                for (var i:number = 0; i < meshes.length; i++) {
                    var mesh:BABYLON.AbstractMesh = meshes[i];
                    if (search === BABYLON.SearchType.StartsWith) {
                        if (BABYLON.Utilities.StartsWith(mesh.name, name)) {
                            result = mesh;
                            break;
                        }
                    } else if (search === BABYLON.SearchType.EndsWith) {
                        if (BABYLON.Utilities.EndsWith(mesh.name, name)) {
                            result = mesh;
                            break;
                        }
                    } else if (search === BABYLON.SearchType.IndexOf) {
                        if (mesh.name.indexOf(name) >= 0) {
                            result = mesh;
                            break;
                        }
                    } else {
                        if (mesh.name === name) {
                            result = mesh;
                            break;
                        }
                    }
                }
            }
            return result;            
        }

        public static CloneValue(source:any, destinationObject:any): any {
            if (!source)
                return null;

            if (source instanceof BABYLON.Mesh) {
                return null;
            }

            if (source instanceof BABYLON.SubMesh) {
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
                
                var new_socketlist:any[] = [];
                if (source.socketList != null && source.socketList.length > 0) {
                    source.socketList.forEach((socket) => {
                        var new_socket_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(socket, new_socket_properties);
                        new_socketlist.push(new_socket_properties);
                    });
                }
               
                var new_animationClips:any[] = [];
                if (source.animationClips != null && source.animationClips.length > 0) {
                    source.animationClips.forEach((clip) => {
                        var new_clip_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(clip, new_clip_properties);
                        new_animationClips.push(new_clip_properties);
                    });
                }

                var new_animationevents:any[] = [];
                if (source.animationEvents != null && source.animationEvents.length > 0) {
                    source.animationEvents.forEach((evt) => {
                        var new_event_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(evt, new_event_properties);
                        new_animationevents.push(new_event_properties);
                    });
                }

                var new_components:BABYLON.IScriptComponent[] = [];
                if (source.components != null && source.components.length > 0) {
                    source.components.forEach((comp) => {
                        var new_comp_properties:any = {};
                        BABYLON.SceneManager.DeepCopyProperties(comp.properties, new_comp_properties);
                        new_components.push({ name: comp.name, klass: comp.klass, order:comp.order, tag: comp.tag, update: comp.update, properties: new_comp_properties, instance: null });
                    });
                }

                result = {
                    api: true,
                    type: source.type,
                    prefab: false,
                    state: {},
                    objectName: source.objectName,
                    objectId: source.objectId,
                    tagName: source.tagName,
                    layerIndex: source.layerIndex,
                    layerName: source.layerName,
                    areaIndex: source.areaIndex,
                    navAgent: new_navagent,
                    meshLink: new_meshlink,
                    meshObstacle: new_meshobstacle,
                    socketList: new_socketlist,
                    animationClips: new_animationClips,
                    animationEvents: new_animationClips,
                    collisionEvent: null,
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