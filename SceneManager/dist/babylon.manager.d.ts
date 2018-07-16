declare module BABYLON {
    class Utilities {
        private static UpVector;
        private static ZeroVector;
        private static TempMatrix;
        private static TempVector2;
        private static TempVector3;
        private static PrintElement;
        /** TODO: angle */
        static Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number;
        /** TODO: clamp angle */
        static ClampAngle(angle: number, min: number, max: number): number;
        /** Returns a new radion converted from degree */
        static Deg2Rad(degree: number): number;
        /** Returns a new degree converted from radion */
        static Rad2Deg(radion: number): number;
        /** Returns a new Quaternion set from the passed Euler float angles (x, y, z). */
        static Euler(eulerX: number, eulerY: number, eulerZ: number): BABYLON.Quaternion;
        /** Returns a new Quaternion set from the passed Euler float angles (x, y, z). */
        static EulerToRef(eulerX: number, eulerY: number, eulerZ: number, result: BABYLON.Quaternion): void;
        /** Returns a new Matrix as a rotation matrix from the Euler angles (x, y, z). */
        static Matrix(eulerX: number, eulerY: number, eulerZ: number): BABYLON.Matrix;
        /** Returns a new Matrix as a rotation matrix from the Euler angles (x, y, z). */
        static MatrixToRef(eulerX: number, eulerY: number, eulerZ: number, result: BABYLON.Matrix): void;
        /** Multplies a quaternion by a vector (rotates vector) */
        static RotateVector(vec: BABYLON.Vector3, quat: BABYLON.Quaternion): BABYLON.Vector3;
        /** Multplies a quaternion by a vector (rotates vector) */
        static RotateVectorToRef(vec: BABYLON.Vector3, quat: BABYLON.Quaternion, result: BABYLON.Vector3): void;
        /** Returns a new Quaternion set from the passed vector position. */
        static LookRotation(position: BABYLON.Vector3): BABYLON.Quaternion;
        /** Returns a new Quaternion set from the passed vector position. */
        static LookRotationToRef(position: BABYLON.Vector3, result: BABYLON.Quaternion): void;
        /** Resets the physics parent and positioning */
        static ResetPhysicsPosition(position: BABYLON.Vector3, parent: BABYLON.Node): void;
        static PrintToScreen(text: string, color?: string): void;
        /** Transforms position from local space to world space. */
        static TransformPosition(owner: BABYLON.AbstractMesh | BABYLON.Camera, position: BABYLON.Vector3): BABYLON.Vector3;
        /** Transforms position from local space to world space. */
        static TransformPositionToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, position: BABYLON.Vector3, result: BABYLON.Vector3): void;
        /** Transforms direction from local space to world space. */
        static TransformDirection(owner: BABYLON.AbstractMesh | BABYLON.Camera, direction: BABYLON.Vector3): BABYLON.Vector3;
        /** Transforms direction from local space to world space. */
        static TransformDirectionToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, direction: BABYLON.Vector3, result: BABYLON.Vector3): void;
        /** Recomputes the meshes bounding center pivot point */
        static RecomputePivotPoint(owner: BABYLON.AbstractMesh): void;
        /** Gets any direction vector of the owner in world space. */
        static GetDirectionVector(owner: BABYLON.AbstractMesh | BABYLON.Camera, vector: BABYLON.Vector3): BABYLON.Vector3;
        /** Gets any direction vector of the owner in world space. */
        static GetDirectionVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, vector: BABYLON.Vector3, result: BABYLON.Vector3): void;
        /** Gets the blue axis of the owner in world space. */
        static GetForwardVector(owner: BABYLON.AbstractMesh | BABYLON.Camera): BABYLON.Vector3;
        /** Gets the blue axis of the owner in world space. */
        static GetForwardVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, result: BABYLON.Vector3): void;
        /** Gets the red axis of the owner in world space. */
        static GetRightVector(owner: BABYLON.AbstractMesh | BABYLON.Camera): BABYLON.Vector3;
        /** Gets the red axis of the owner in world space. */
        static GetRightVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, result: BABYLON.Vector3): void;
        /** Gets the green axis of the owner in world space. */
        static GetUpVector(owner: BABYLON.AbstractMesh | BABYLON.Camera): BABYLON.Vector3;
        /** Gets the green axis of the owner in world space. */
        static GetUpVectorToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, result: BABYLON.Vector3): void;
        static ParseColor3(source: any, defaultValue?: BABYLON.Color3): BABYLON.Color3;
        static ParseColor4(source: any, defaultValue?: BABYLON.Color4): BABYLON.Color4;
        static ParseVector2(source: any, defaultValue?: BABYLON.Vector2): BABYLON.Vector2;
        static ParseVector3(source: any, defaultValue?: BABYLON.Vector3): BABYLON.Vector3;
        static ParseVector4(source: any, defaultValue?: BABYLON.Vector4): BABYLON.Vector4;
        static ParseTransform(source: any, defaultValue?: any): any;
        static StartsWith(source: string, word: string): boolean;
        static EndsWith(source: string, word: string): boolean;
        static ReplaceAll(source: string, word: string, replace: string): string;
        /** Set the passed matrix "result" as the sampled key frame value for the specfied animation track. */
        static SampleAnimationMatrix(animation: BABYLON.Animation, frame: number, loopMode: number, result: BABYLON.Matrix): void;
        /** Gets the float "result" as the sampled key frame value for the specfied animation track. */
        static SampleAnimationFloat(animation: BABYLON.Animation, frame: number, repeatCount: number, loopMode: number, offsetValue?: any, highLimitValue?: any): number;
        /** Set the passed matrix "result" as the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue". */
        static FastMatrixLerp(startValue: BABYLON.Matrix, endValue: BABYLON.Matrix, gradient: number, result: BABYLON.Matrix): void;
        /** Set the passed matrix "result" as the spherical interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue". */
        static FastMatrixSlerp(startValue: BABYLON.Matrix, endValue: BABYLON.Matrix, gradient: number, result: BABYLON.Matrix): void;
        /** Set the passed matrix "result" as the interpolated values for animation key frame sampling. */
        static FastMatrixInterpolate(animation: BABYLON.Animation, currentFrame: number, loopMode: number, result: BABYLON.Matrix): void;
        /** Returns float result as the interpolated values for animation key frame sampling. */
        static FastFloatInterpolate(animation: BABYLON.Animation, currentFrame: number, repeatCount: number, loopMode: number, offsetValue?: any, highLimitValue?: any): number;
        /** Computes the transition duration blending speed */
        static ComputeBlendingSpeed(rate: number, duration: number): number;
        /** Registers A scene component on the scene */
        static RegisterSceneComponent(comp: BABYLON.SceneComponent, klass: string, enableUpdate?: boolean, propertyBag?: any): void;
        /** Registers new manager instance on the scene object */
        static RegisterSceneManager(scene: BABYLON.Scene): BABYLON.SceneManager;
        /** Parses the registered scene manager object metadata */
        static ParseSceneMetadata(scene: BABYLON.Scene): void;
        /** Parses the registered scene manager import metadata */
        static ParseImportMetadata(meshes: BABYLON.AbstractMesh[], scene: BABYLON.Scene): void;
        /** Fire the manager instance internal scene ready function */
        static ExecuteSceneReady(scene: BABYLON.Scene): void;
    }
}

declare class Navigation {
    buildNodes(mesh: BABYLON.AbstractMesh): any;
    setZoneData(zone: string, data: any): void;
    getGroup(zone: string, position: BABYLON.Vector3): number;
    getRandomNode(zone: string, group: number, nearPosition: BABYLON.Vector3, nearRange: number): BABYLON.Vector3;
    projectOnNavmesh(position: BABYLON.Vector3, zone: string, group: number): BABYLON.Vector3;
    findPath(startPosition: BABYLON.Vector3, targetPosition: BABYLON.Vector3, zone: string, group: number): BABYLON.Vector3[];
    getVectorFrom(vertices: number[], index: number, _vector: BABYLON.Vector3): BABYLON.Vector3;
}
declare module BABYLON {
    class NavigationAgent {
        private _mesh;
        private _info;
        constructor(owner: BABYLON.AbstractMesh);
        readonly mesh: BABYLON.AbstractMesh;
        readonly info: BABYLON.INavigationAgent;
        readonly hasAgentInfo: boolean;
        setDestination(destination: BABYLON.Vector3): void;
    }
}

declare module BABYLON {
    class ToolkitProgress implements BABYLON.ILoadingScreen {
        loadingUIText: string;
        borderPrefix: string;
        panelElement: HTMLElement;
        loaderElement: HTMLElement;
        statusElement: HTMLElement;
        projectElement: HTMLElement;
        loadingUIBackgroundColor: string;
        constructor(loadingUIText: string);
        private _statusColor;
        statusColor: string;
        displayLoadingUI(): void;
        updateLoadingUI(): void;
        hideLoadingUI(): void;
    }
}
declare class Stats {
    REVISION: number;
    dom: HTMLElement;
    showPanel(value: number): void;
    begin(): void;
    end(): number;
    update(): void;
    addPanel(pane: any): any;
    static Panel: any;
}
declare var TimerPlugin: any;

declare module BABYLON {
    class AnimationState extends BABYLON.SceneComponent {
        private static EXIT;
        private static TIMER;
        private _fps;
        private _legacy;
        private _targets;
        private _machine;
        private _skeletal;
        private _executed;
        private _autoplay;
        private _checkers;
        private _boneAnim;
        private _boneWeight;
        private _boneMatrix;
        private _sampleMatrix;
        private _inputPosition;
        private _childPosition;
        private _onAnimationFrameHandler;
        private _onAnimationEventHandlers;
        private _onAnimationBehaveHandlers;
        enabled: boolean;
        speedRatio: number;
        autoTicking: boolean;
        enableTransitions: boolean;
        directBlendSpeed: number;
        readonly fps: number;
        readonly legacy: boolean;
        readonly skeletal: boolean;
        readonly executing: boolean;
        constructor(owner: BABYLON.Entity, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        play(state: string, transitionDuration?: number, animationLayer?: number): void;
        getBool(name: string): boolean;
        setBool(name: string, value: boolean): void;
        getFloat(name: string): number;
        setFloat(name: string, value: number): void;
        getInteger(name: string): number;
        setInteger(name: string, value: number): void;
        getTrigger(name: string): boolean;
        setTrigger(name: string): void;
        resetTrigger(name: string): void;
        tickStateMachine(): void;
        getCurrentState(layer: number): BABYLON.MachineState;
        getTargetSkeletons(): BABYLON.Skeleton[];
        onAnimationBehaviour(name: string, handler: (state: string, event: string) => void): void;
        onAnimationTrackEvent(name: string, handler: (evt: BABYLON.IAnimationEvent) => void): void;
        onAnimationFrameUpdate(handler: () => void): void;
        private getMachineState(name);
        private setMachineState(name, value);
        private getAnimationClip(name);
        private setAnimationClip(name, value);
        private getDenormalizedFrame(clip, frame);
        private getAnimationFrames(clip);
        private setTreeBranches(tree);
        private blendBoneMatrix(matrix, weight?);
        private updateBoneMatrix(bone, enableBlending?, blendingSpeed?);
        private startStateMachine();
        private updateStateMachine();
        private updateAnimationCurves();
        private updateAnimationTargets();
        private processStateMachine(layer, step);
        private parseAnimationStateMachineEvents(layer);
        private setCurrentAnimationState(layer, name, blending);
        private setupBaseAnimationState(layer, blending?, playback?);
        private checkStateTransitions(layer, transitions, time, length, rate);
        private computeSpeedRatio(layer, start, end?, delta?, playback?);
        private blendAnimationMatrix(layer, matrix, weight?);
        private checkBoneTransformPath(layer, transformPath);
        private filterBoneTransformIndex(layer, bone);
        private sortBlendingBuffer(layer);
        private resetTreeBranches(layer, tree);
        private resetInputDistanceWeight(parent, child);
        private resetInputDistanceThreasholds(parent);
        private parseTreeBranches(layer, tree, frame);
        private parseClipTreeItem(layer, parent, child, frame);
        private parseDirectTreeItem(layer, parent, child, frame);
        private parseSimpleTreeItem(layer, parent, child, frame);
        private parseSimpleDirectionalTreeItem(layer, parent, child, frame);
        private parseFreeformDirectionalTreeItem(layer, parent, child, frame);
        private parseFreeformCartesianTreeItem(layer, parent, child, frame);
        private parseSkeletalAnimationTrackLayer(layer);
        private computeSimpleDirectionalWeight(parentTree, inputPosition, childPosition);
        private computeFreeformDirectionalWeight(parentTree, inputPosition, childPosition);
        private computeFreeformCartesianWeight(parentTree, inputPosition, childPosition);
    }
}

declare module BABYLON {
    class SceneManager {
        /** Get the current scene manager version information. */
        static GetVersion(): string;
        /** Get the current instance of the registered scene manager. */
        static GetInstance(): BABYLON.SceneManager;
        /** Get instance of the stats control. */
        static GetStatistics(): Stats;
        /** Create a new scene and registers a manager instance */
        static CreateScene(engine: BABYLON.Engine): BABYLON.Scene;
        /** Load and parse a new scene and registers a manager instance */
        static LoadScene(rootUrl: string, sceneFilename: any, engine: Engine, onSuccess?: Nullable<(scene: Scene) => void>, onProgress?: Nullable<(event: SceneLoaderProgressEvent) => void>, onError?: Nullable<(scene: Scene, message: string, exception?: any) => void>, pluginExtension?: Nullable<string>): Nullable<ISceneLoaderPlugin | ISceneLoaderPluginAsync>;
        /** Append and parse scene objects from a filename url */
        static AppendScene(rootUrl: string, sceneFilename?: any, scene?: Nullable<Scene>, onSuccess?: Nullable<(scene: Scene) => void>, onProgress?: Nullable<(event: SceneLoaderProgressEvent) => void>, onError?: Nullable<(scene: Scene, message: string, exception?: any) => void>, pluginExtension?: Nullable<string>): Nullable<ISceneLoaderPlugin | ISceneLoaderPluginAsync>;
        /** Import and parse meshes from a filename url */
        static ImportMeshes(meshNames: any, rootUrl: string, sceneFilename?: any, scene?: Nullable<Scene>, onSuccess?: Nullable<(meshes: AbstractMesh[], particleSystems: ParticleSystem[], skeletons: Skeleton[], animationGroups: AnimationGroup[]) => void>, onProgress?: Nullable<(event: SceneLoaderProgressEvent) => void>, onError?: Nullable<(scene: Scene, message: string, exception?: any) => void>, pluginExtension?: Nullable<string>): Nullable<ISceneLoaderPlugin | ISceneLoaderPluginAsync>;
        /** Attaches a managed entity component to the scene. */
        static AttachComponent(comp: BABYLON.SceneComponent, klass: string, tick?: boolean, propertyBag?: any): void;
        /** Registers a function handler to be executed when window is loaded. */
        static OnWindowLoad(func: () => any): void;
        /** Registers a function handler to be executed when device is ready. */
        static OnDeviceReady(func: () => any): void;
        /** Registers a function handler to be executed when scene is ready. */
        static ExecuteWhenReady(func: (scene: BABYLON.Scene, manager: BABYLON.SceneManager) => void): void;
        /** Is oculus browser platform agent. */
        static IsOculusBrowser(): boolean;
        /** Is samsung browser platform agent. */
        static IsSamsungBrowser(): boolean;
        /** Is windows phone platform agent. */
        static IsWindowsPhone(): boolean;
        /** Is blackberry web platform agent. */
        static IsBlackBerry(): boolean;
        /** Is opera web platform agent. */
        static IsOperaMini(): boolean;
        /** Is android web platform agent. */
        static IsAndroid(): boolean;
        /** Is web os platform agent. */
        static IsWebOS(): boolean;
        /** Is ios web platform agent. */
        static IsIOS(): boolean;
        /** Is iphone web platform agent. */
        static IsIPHONE(): boolean;
        /** Is ipad web platform agent. */
        static IsIPAD(): boolean;
        /** Is ipod web platform agent. */
        static IsIPOD(): boolean;
        /** Is internet explorer 11 platform agent. */
        static IsIE11(): boolean;
        /** Is mobile web platform agent. */
        static IsMobile(): boolean;
        /** Are cordova platform services available. */
        static IsCordova(): boolean;
        /** Are unversial windows platform services available. */
        static IsWindows(): boolean;
        /** Are playstation platform services available. */
        static IsPlaystation(): boolean;
        /** Are xbox one platform services available. */
        static IsXboxOne(): boolean;
        /** Are xbox live platform services available. */
        static IsXboxLive(): boolean;
        /** Are web assembly platform services available. */
        static IsWebAssembly(): boolean;
        /** Are stereo side side camera services available. */
        static IsStereoCameras(): boolean;
        /** Are local multi player view services available. */
        static IsMultiPlayerView(): boolean;
        /** Get the current local multi player count */
        static GetMultiPlayerCount(): number;
        /** Are firelight audio platform services available */
        static IsFirelightEnabled(): boolean;
        /** Get firelight studio platform api library mode. */
        static GetFirelightAudioMode(): number;
        /** Creates a generic native javascript promise. */
        static CreateGenericPromise(handler: (resolve, reject) => void): any;
        /** Resolve a generic native javascript promise object. */
        static ResolveGenericPromise(resolveObject: any): any;
        /**  Gets the names query string from page url. */
        static GetQueryStringParam(name: string, url: string): string;
        /** Platform alert message dialog. */
        static AlertMessage(text: string, title?: string): any;
        /** Gets the current engine WebGL version string info. */
        static GetWebGLVersionString(): string;
        /** Gets the current engine WebGL version number info. */
        static GetWebGLVersionNumber(): number;
        /** Get the WebVR experience helper left controller */
        static GetWebVRLeftController(): BABYLON.WebVRController;
        /** Get the WebVR experience helper right controller */
        static GetWebVRRightController(): BABYLON.WebVRController;
        /** Get the WebVR experience helper left controller prefab mesh */
        static GetWebVRLeftControllerPrefab(): BABYLON.AbstractMesh;
        /** Get the WebVR experience helper right controller prefab mesh */
        static GetWebVRRightControllerPrefab(): BABYLON.AbstractMesh;
        /** Shows the WebVR experience helper default controllers */
        static ShowWebVRDefaultControllers(displayGaze?: Nullable<boolean>, displayLaser?: Nullable<boolean>): void;
        /** Shows the WebVR experience helper custom controllers */
        static ShowWebVRCustomControllers(displayGaze?: Nullable<boolean>, displayLaser?: Nullable<boolean>): void;
        static readonly StaticIndex: number;
        static readonly PrefabIndex: number;
        static GamepadManager: BABYLON.GamepadManager;
        static GamepadConnected: (pad: BABYLON.Gamepad, state: BABYLON.EventState) => void;
        static GamepadDisconnected: (pad: BABYLON.Gamepad, state: BABYLON.EventState) => void;
        private static TempMatrix;
        private static TempVector2;
        private static TempVector3;
        private static AuxMatrix;
        private static AuxVector2;
        private static AuxVector3;
        private _url;
        private _time;
        private _timing;
        private _filename;
        private _input;
        private _scene;
        private _vrhelper;
        private _navmesh;
        private _navigation;
        private _loadQueueIndex;
        private _loadQueueCount;
        private _loadQueueScenes;
        private _localReadyState;
        private _localSceneReady;
        private _sunlightDirection;
        private _sunlightIdentifier;
        private _environmentTextureName;
        private _playerOneCamera;
        private _playerTwoCamera;
        private _playerThreeCamera;
        private _playerFourCamera;
        private _defaultControllers;
        private _leftControllerStick;
        private _rightControllerStick;
        private _leftControllerPrefab;
        private _rightControllerPrefab;
        private static me;
        private static min;
        private static max;
        private static keymap;
        private static prefabs;
        private static wheel;
        private static clientx;
        private static clienty;
        private static mousex;
        private static mousey;
        private static vertical;
        private static horizontal;
        private static mousex2;
        private static mousey2;
        private static vertical2;
        private static horizontal2;
        private static mousex3;
        private static mousey3;
        private static vertical3;
        private static horizontal3;
        private static mousex4;
        private static mousey4;
        private static vertical4;
        private static horizontal4;
        private static x_wheel;
        private static x_mousex;
        private static x_mousey;
        private static x_vertical;
        private static x_horizontal;
        private static k_mousex;
        private static k_mousey;
        private static k_vertical;
        private static k_horizontal;
        private static j_mousex;
        private static j_mousey;
        private static j_vertical;
        private static j_horizontal;
        private static g_mousex1;
        private static g_mousey1;
        private static g_vertical1;
        private static g_horizontal1;
        private static g_mousex2;
        private static g_mousey2;
        private static g_vertical2;
        private static g_horizontal2;
        private static g_mousex3;
        private static g_mousey3;
        private static g_vertical3;
        private static g_horizontal3;
        private static g_mousex4;
        private static g_mousey4;
        private static g_vertical4;
        private static g_horizontal4;
        private static engine;
        private static orphans;
        private static multiPlayerView;
        private static multiPlayerCount;
        private static mouseButtonPress;
        private static mouseButtonDown;
        private static mouseButtonUp;
        private static keyButtonPress;
        private static keyButtonDown;
        private static keyButtonUp;
        private static leftJoystick;
        private static rightJoystick;
        private static virtualJoystick;
        private static showRenderStats;
        private static sceneRenderStats;
        private static renderStatsInstance;
        private static showPhysicsImposter;
        private static showDebugSockets;
        private static colliderVisibility;
        private static socketColliderSize;
        private static staticVertexLimit;
        private static debugLayerVisible;
        private static previousPosition;
        private static preventDefault;
        private static stereoCameras;
        private static rightHanded;
        private static pointerLocked;
        private static enableLocking;
        private static physicsViewer;
        private static gamepad1;
        private static gamepad1Type;
        private static gamepad1ButtonPress;
        private static gamepad1ButtonDown;
        private static gamepad1ButtonUp;
        private static gamepad1DpadPress;
        private static gamepad1DpadDown;
        private static gamepad1DpadUp;
        private static gamepad1LeftTrigger;
        private static gamepad1RightTrigger;
        private static gamepad2;
        private static gamepad2Type;
        private static gamepad2ButtonPress;
        private static gamepad2ButtonDown;
        private static gamepad2ButtonUp;
        private static gamepad2DpadPress;
        private static gamepad2DpadDown;
        private static gamepad2DpadUp;
        private static gamepad2LeftTrigger;
        private static gamepad2RightTrigger;
        private static gamepad3;
        private static gamepad3Type;
        private static gamepad3ButtonPress;
        private static gamepad3ButtonDown;
        private static gamepad3ButtonUp;
        private static gamepad3DpadPress;
        private static gamepad3DpadDown;
        private static gamepad3DpadUp;
        private static gamepad3LeftTrigger;
        private static gamepad3RightTrigger;
        private static gamepad4;
        private static gamepad4Type;
        private static gamepad4ButtonPress;
        private static gamepad4ButtonDown;
        private static gamepad4ButtonUp;
        private static gamepad4DpadPress;
        private static gamepad4DpadDown;
        private static gamepad4DpadUp;
        private static gamepad4LeftTrigger;
        private static gamepad4RightTrigger;
        private static loader;
        webvr: BABYLON.VRExperienceHelper;
        readonly time: number;
        readonly deltaTime: number;
        getScene(): BABYLON.Scene;
        private static readies;
        constructor(scene: BABYLON.Scene);
        private _beforeRender();
        private _afterRender();
        private _parseSceneMetadata();
        dispose(): void;
        /** Opens a platform alert message dialog */
        alert(text: string, title?: string): any;
        /** Execute a function once during render loop. */
        once(func: () => void): void;
        /** Delays a function call using window.requestTimeeout. Returns a handle object */
        delay(func: () => void, timeout: number): any;
        /** Calls window.clearRequestTimeout with handle to cancel pending timeout call */
        cancelDelay(handle: any): void;
        /** Repeats a function call using window.requestInterval. Retuns a handle object */
        repeat(func: () => void, interval: number): any;
        /** Calls window.clearRequestInterval with handle to clear pending interval calls. */
        cancelRepeat(handle: any): void;
        /** Enables time managment in scene. */
        enableTime(): void;
        /** Disables time managment in scene. */
        disableTime(): void;
        /** Safely destroys a scene object. */
        safeDestroy(owner: BABYLON.Entity, delay?: number, disable?: boolean): void;
        /** Gets the main camera for a player */
        getMainCamera(player?: BABYLON.PlayerNumber): BABYLON.Camera;
        /** Get the scene formatted name. */
        getSceneName(): string;
        /** Gets the formatted scene path. */
        getScenePath(): string;
        /** Gets the scene sunlight */
        getSunlight(): BABYLON.Light;
        /** Gets the scene sunlight direction */
        getSunlightDirection(): BABYLON.Vector3;
        /** Gets the scene environment texture name. */
        getEnvironmentTextureName(): string;
        /** Adds a pending scene loading state. */
        addLoadingState(state: any): void;
        /** Removes a pending scene loading state. */
        removeLoadingState(state: any): void;
        private _onready;
        private onready(func);
        private _executeWhenReady();
        private _executeLocalReady();
        private _loadQueueImports();
        /** Popup debug layer in window. */
        popupDebug(tab?: number): void;
        /** Toggle debug layer on and off. */
        toggleDebug(popups?: boolean, tab?: number, parent?: HTMLElement): void;
        /** Sets the multi player camera view layout */
        setMultiPlayerViewLayout(totalNumPlayers: number): boolean;
        rayCast(ray: BABYLON.Ray, predicate?: (mesh: BABYLON.Mesh) => boolean, fastCheck?: boolean): BABYLON.PickingInfo;
        multiRayCast(ray: BABYLON.Ray, predicate?: (mesh: BABYLON.Mesh) => boolean): BABYLON.PickingInfo[];
        /** Gets the instanced material from scene. If does not exists, execute a optional defaultinstance handler. */
        getMaterialInstance<T>(name: string, defaultInstance?: (newName: String) => BABYLON.Material): T;
        /** Checks the scene has the specified prefab mesh. */
        hasPrefabMesh(prefabName: string): boolean;
        /** Gets ths the specified prefab mesh from scene. */
        getPrefabMesh(prefabName: string): BABYLON.Mesh;
        /** Instantiates the specfied prefab object into scene. */
        instantiatePrefab(prefabName: string, cloneName: string, newPosition?: BABYLON.Vector3, newRotation?: BABYLON.Vector3, newScaling?: BABYLON.Vector3, newParent?: Node): BABYLON.Mesh;
        /** Tweens (animates) the target property using BABYLON.Animations. */
        tween(node: BABYLON.Node, targetProperty: string, from: any, to: any, frames: number, fps?: number, easing?: BABYLON.EasingFunction, speedRatio?: number, callback?: () => void, loopMode?: number, enableBlending?: boolean): BABYLON.Animatable;
        /** Tweens (animates) the target property with keys using BABYLON.Animations. */
        tweenKeys(target: any, targetProperty: string, keys: Array<{
            frame: number;
            value: any;
        }>, frames: number, fps?: number, easing?: BABYLON.EasingFunction, speedRatio?: number, callback?: () => void, dataType?: number, loopMode?: number, enableBlending?: boolean): BABYLON.Animatable;
        /** Tweens (animates) the target property with a float value using BABYLON.Animations. */
        tweenFloat(target: any, targetProperty: string, start: number, end: number, frames: number, fps?: number, easing?: BABYLON.EasingFunction, speedRatio?: number, callback?: () => void, loopMode?: number, enableBlending?: boolean): BABYLON.Animatable;
        /** Plays the specified animation clip by name on the owner target objects. */
        playAnimationClip(motion: string, owner: BABYLON.Entity, blending?: number, playback?: number, decendants?: boolean, animations?: Animation[], onAnimationEnd?: () => void): BABYLON.Animatable[];
        /** Gets all the animation clips for the owner target object. */
        getAnimationClips(owner: BABYLON.Entity, decendants?: boolean, directDecendantsOnly?: boolean): BABYLON.IAnimationClip[];
        /** Gets all the animation targets with clips for the specified owner. */
        getAnimationTargets(owner: BABYLON.Entity, decendants?: boolean, directDecendantsOnly?: boolean): any[];
        /** Sets the specified animation transition properties */
        setAnimationProperties(owner: BABYLON.IAnimatable, behavior: number, blending: number): void;
        /** Applies force to owner using physics imposter. */
        applyForce(owner: BABYLON.AbstractMesh, force: BABYLON.Vector3, contact: BABYLON.Vector3): void;
        /** Applies impulse to owner using physics imposter. */
        applyImpulse(owner: BABYLON.AbstractMesh, impusle: BABYLON.Vector3, contact: BABYLON.Vector3): void;
        /** Applies friction to owner using physics imposter. */
        applyFriction(owner: BABYLON.AbstractMesh, friction: number): void;
        /** Gets mass of owner using physics imposter. */
        getMass(owner: BABYLON.AbstractMesh): number;
        /** Sets mass to owner using physics imposter. */
        setMass(owner: BABYLON.AbstractMesh, mass: number): void;
        /** Gets restitution of owner using physics imposter. */
        getRestitution(owner: BABYLON.AbstractMesh): number;
        /** Sets restitution to owner using physics imposter. */
        setRestitution(owner: BABYLON.AbstractMesh, restitution: number): void;
        /** Gets owner friction level using physics imposter. */
        getFrictionLevel(owner: BABYLON.AbstractMesh): number;
        /** Gets owner linear velocity using physics imposter. */
        getLinearVelocity(owner: BABYLON.AbstractMesh): BABYLON.Vector3;
        /** Sets owner linear velocity using physics imposter. */
        setLinearVelocity(owner: BABYLON.AbstractMesh, velocity: BABYLON.Vector3): void;
        /** Gets owner angular velocity using physics imposter. */
        getAngularVelocity(owner: BABYLON.AbstractMesh): BABYLON.Vector3;
        /** Sets owner angular velocity using physics imposter. */
        setAngularVelocity(owner: BABYLON.AbstractMesh, velocity: BABYLON.Vector3): void;
        /** Shows the owner physics imposter for debugging. */
        showDebugImposter(owner: BABYLON.AbstractMesh): void;
        /** Hides the owner physics imposter for debugging. */
        hideDebugImposter(owner: BABYLON.AbstractMesh): void;
        /** Checks collision contact of the owner using physics imposter. */
        checkCollisionContact(owner: BABYLON.AbstractMesh, collider: BABYLON.AbstractMesh, contact: BABYLON.CollisionContact, threashold?: number): boolean;
        /** Moves owner using collisions. */
        moveWithCollisions(owner: BABYLON.AbstractMesh, velocity: BABYLON.Vector3): void;
        /** Moves owner using positions. */
        moveWithTranslation(owner: BABYLON.AbstractMesh, velocity: BABYLON.Vector3): void;
        /** Turns owner using rotations. */
        turnWithRotation(owner: BABYLON.AbstractMesh, rotation?: number): void;
        /** Finds a scene component in the scene with the specfied klass name. */
        findSceneComponent<T extends BABYLON.SceneComponent>(klass: string, owner: BABYLON.Entity): T;
        /** Finds all scene components in the scene with the specfied klass name. */
        findSceneComponents<T extends BABYLON.SceneComponent>(klass: string, owner: BABYLON.Entity): T[];
        /** Finds the owner object metedata in the scene. */
        findSceneMetadata(owner: BABYLON.Entity): BABYLON.ObjectMetadata;
        /** Finds the specfied child mesh of owner in the scene. */
        findSceneChildMesh(name: string, owner: BABYLON.AbstractMesh, searchType?: BABYLON.SearchType, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        /** Finds the specfied collision mesh of owner in the scene. */
        findSceneCollisionMesh(owner: BABYLON.AbstractMesh, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        /** Finds specfied skeleton in the scene. */
        findSceneSkeleton(skeletonId: string): BABYLON.Skeleton;
        /** Finds the specfied socket mesh of owner in the scene. */
        findSceneSocketMesh(name: string, owner: BABYLON.AbstractMesh, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.Mesh;
        /** Finds all the socket meshes of owner in the scene. */
        findSceneSocketMeshes(owner: BABYLON.AbstractMesh, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.Mesh[];
        /** Finds the specfied animation clip of owner in the scene. */
        findSceneAnimationClip(clip: string, owner: BABYLON.Entity): BABYLON.IAnimationClip;
        /** Finds any animation clips of owner in the scene. */
        findSceneAnimationClips(owner: BABYLON.Entity): BABYLON.IAnimationClip[];
        /** Finds the specfied particle system of owner in the scene. */
        findSceneParticleSystem(name: string, owner: BABYLON.AbstractMesh | BABYLON.Vector3): BABYLON.IParticleSystem;
        /** Finds all the particle systems of owner in the scene. */
        findSceneParticleSystems(owner: BABYLON.AbstractMesh | BABYLON.Vector3): BABYLON.IParticleSystem[];
        /** Finds the specfied lens flare system of owner in the scene. */
        findSceneLensFlareSystem(name: string, owner: BABYLON.Entity): BABYLON.LensFlareSystem;
        /** Finds all the lens flare systems of owner in the scene. */
        findSceneLensFlareSystems(owner: BABYLON.Entity): BABYLON.LensFlareSystem[];
        enablePointerLock(): void;
        disablePointerLock(): void;
        private pointerLockHandler();
        private attachPointerLock();
        /** Reset all user input state in the scene. */
        resetUserInput(): void;
        /** Enables user input state in the scene. */
        enableUserInput(options?: {
            preventDefault?: boolean;
            useCapture?: boolean;
            enableVirtualJoystick?: boolean;
            disableRightStick?: boolean;
        }): void;
        /** Disables user input state in the scene. */
        disableUserInput(useCapture?: boolean): void;
        /** Get user input state from the scene. */
        getUserInput(input: BABYLON.UserInputAxis, player?: BABYLON.PlayerNumber): number;
        onKeyboardUp(callback: (keycode: number) => void): void;
        onKeyboardDown(callback: (keycode: number) => void): void;
        onKeyboardPress(keycode: number, callback: () => void): void;
        getKeyboardInput(keycode: number): boolean;
        onPointerUp(callback: (button: number) => void): void;
        onPointerDown(callback: (button: number) => void): void;
        onPointerPress(button: number, callback: () => void): void;
        getPointerInput(button: number): boolean;
        getLeftJoystick(): BABYLON.VirtualJoystick;
        getRightJoystick(): BABYLON.VirtualJoystick;
        getJoystickPress(button: number): boolean;
        disposeVirtualJoysticks(): void;
        onGamepadButtonUp(callback: (button: number) => void, player?: BABYLON.PlayerNumber): void;
        onGamepadButtonDown(callback: (button: number) => void, player?: BABYLON.PlayerNumber): void;
        onGamepadButtonPress(button: number, callback: () => void, player?: BABYLON.PlayerNumber): void;
        getGamepadButtonInput(button: number, player?: BABYLON.PlayerNumber): boolean;
        onGamepadDirectionUp(callback: (direction: number) => void, player?: BABYLON.PlayerNumber): void;
        onGamepadDirectionDown(callback: (direction: number) => void, player?: BABYLON.PlayerNumber): void;
        onGamepadDirectionPress(direction: number, callback: () => void, player?: BABYLON.PlayerNumber): void;
        getGamepadDirectionInput(direction: number, player?: BABYLON.PlayerNumber): boolean;
        onGamepadTriggerLeft(callback: (value: number) => void, player?: BABYLON.PlayerNumber): void;
        onGamepadTriggerRight(callback: (value: number) => void, player?: BABYLON.PlayerNumber): void;
        getGamepadTriggerInput(trigger: number, player?: BABYLON.PlayerNumber): number;
        getGamepad(player?: BABYLON.PlayerNumber): BABYLON.Gamepad;
        getGamepadType(player?: BABYLON.PlayerNumber): BABYLON.GamepadType;
        updateCameraInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number, player?: BABYLON.PlayerNumber): void;
        updateCameraPosition(camera: BABYLON.FreeCamera, horizontal: number, vertical: number, speed: number): void;
        updateCameraRotation(camera: BABYLON.FreeCamera, mousex: number, mousey: number, speed: number): void;
        /** Gets the native babylon mesh navigation tool */
        getNavigationTool(): Navigation;
        /** Gets the current navigation zone */
        getNavigationZone(): string;
        /** Finds a navigation path and returns a array of navigation positions */
        findNavigationPath(origin: BABYLON.Vector3, destination: BABYLON.Vector3): BABYLON.Vector3[];
        /** Gets true if the scene has a navigation mesh */
        hasNavigationMesh(): boolean;
        /** Returns the current scene's navigation mesh */
        getNavigationMesh(): BABYLON.AbstractMesh;
        /** Builds the current scene's navigation nodes */
        buildNavigationMesh(mesh: BABYLON.AbstractMesh): any;
        /** Returns a picked navigation point */
        getNavigationPoint(position: BABYLON.Vector3, raise?: number, length?: number): BABYLON.Vector3;
        /** Moves the specified navigation again along a path of positions */
        moveNavigationAgent(agent: BABYLON.AbstractMesh, path: BABYLON.Vector3[], speed?: number, loop?: boolean, callback?: () => void): void;
        /** Returns an array of navigation agents */
        getNavigationAgents(): BABYLON.Mesh[];
        /** Returns the specfied navigation agent info */
        getNavigationAgentInfo(agent: BABYLON.AbstractMesh): BABYLON.NavigationAgent;
        /** Returns the current scene's navigation area table */
        getNavigationAreaTable(): BABYLON.INavigationArea[];
        /** Returns the current scene's navigation area indexes */
        getNavigationAreaIndexes(): number[];
        /** Returns the current scene's navigation area names */
        getNavigationAreaName(index: number): string;
        /** Returns the current scene's navigation area cost */
        getNavigationAreaCost(index: number): number;
        private static inputKeyDownHandler(e);
        private static inputKeyUpHandler(e);
        private static inputPointerWheelHandler(e);
        private static inputPointerDownHandler(e);
        private static inputPointerUpHandler(e);
        private static inputPointerMoveHandler(e);
        private static inputVirtualJoysticks();
        private static inputOneButtonDownHandler(button);
        private static inputOneButtonUpHandler(button);
        private static inputOneXboxDPadDownHandler(dPadPressed);
        private static inputOneXboxDPadUpHandler(dPadReleased);
        private static inputOneXboxLeftTriggerHandler(value);
        private static inputOneXboxRightTriggerHandler(value);
        private static inputOneLeftStickHandler(values);
        private static inputOneRightStickHandler(values);
        private static inputTwoButtonDownHandler(button);
        private static inputTwoButtonUpHandler(button);
        private static inputTwoXboxDPadDownHandler(dPadPressed);
        private static inputTwoXboxDPadUpHandler(dPadReleased);
        private static inputTwoXboxLeftTriggerHandler(value);
        private static inputTwoXboxRightTriggerHandler(value);
        private static inputTwoLeftStickHandler(values);
        private static inputTwoRightStickHandler(values);
        private static inputThreeButtonDownHandler(button);
        private static inputThreeButtonUpHandler(button);
        private static inputThreeXboxDPadDownHandler(dPadPressed);
        private static inputThreeXboxDPadUpHandler(dPadReleased);
        private static inputThreeXboxLeftTriggerHandler(value);
        private static inputThreeXboxRightTriggerHandler(value);
        private static inputThreeLeftStickHandler(values);
        private static inputThreeRightStickHandler(values);
        private static inputFourButtonDownHandler(button);
        private static inputFourButtonUpHandler(button);
        private static inputFourXboxDPadDownHandler(dPadPressed);
        private static inputFourXboxDPadUpHandler(dPadReleased);
        private static inputFourXboxLeftTriggerHandler(value);
        private static inputFourXboxRightTriggerHandler(value);
        private static inputFourLeftStickHandler(values);
        private static inputFourRightStickHandler(values);
        private static inputManagerGamepadConnected(pad, state);
        private static inputManagerGamepadDisconnected(pad, state);
        private static inputManagerLeftControllerMainButton(controller, state);
        private static inputManagerLeftControllerPadState(controller, state);
        private static inputManagerLeftControllerPadValues(controller, state);
        private static inputManagerLeftControllerAuxButton(controller, state);
        private static inputManagerLeftControllerTriggered(controller, state);
        private static inputManagerRightControllerMainButton(controller, state);
        private static inputManagerRightControllerPadState(controller, state);
        private static inputManagerRightControllerPadValues(controller, state);
        private static inputManagerRightControllerAuxButton(controller, state);
        private static inputManagerRightControllerTriggered(controller, state);
        private static inputManagerControllerConnected(controller, state);
        private static updateUserInput();
        private static parseSceneCameras(cameras, scene, ticklist);
        private static parseSceneLights(lights, scene, ticklist);
        private static parseSceneMeshes(meshes, scene, ticklist);
        private static postParseSceneMeshes(meshes, scene);
        private static setupLodGroups(mesh, scene, prefab);
        private static setupTerrainMeshes(mesh, scene);
        private static setupSocketMeshes(mesh, scene);
        private static setupSharedSkeleton(mesh, scene);
        private static setupPhysicsImpostor(physicsMesh, plugin, friction, collisions, rotation, collisionFilterGroup?, collisionFilterMask?);
        private static setupCameraRigOptions(camera, scene);
        static LocateOwnerSocketMesh(name: string, owner: BABYLON.AbstractMesh, searchType?: BABYLON.SearchType): BABYLON.Mesh;
        static LocateOwnerSocketMeshes(owner: BABYLON.AbstractMesh): BABYLON.Mesh[];
        static LocateOwnerAnimationTrack(index: number, owner: BABYLON.Entity, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.Animation;
        static DestroyComponents(owner: BABYLON.Entity, destroyMetadata?: boolean): void;
        static DisposeOwner(owner: BABYLON.Entity): void;
        static SetAnimationLooping(owner: BABYLON.IAnimatable, loopBehavior: number): void;
        static SetSkeletonLooping(skeleton: BABYLON.Skeleton, loopBehavior: number): void;
        static SetSkeletonBlending(skeleton: BABYLON.Skeleton, blendingSpeed: number): void;
        static SetSkeletonProperties(skeleton: BABYLON.Skeleton, loopBehavior: number, blendingSpeed: number): void;
        static FindMesh(name: string, meshes: BABYLON.AbstractMesh[], searchType?: BABYLON.SearchType): BABYLON.AbstractMesh;
        static CloneValue(source: any, destinationObject: any): any;
        static CloneMetadata(source: BABYLON.IObjectMetadata): BABYLON.IObjectMetadata;
        static DeepCopyProperties(source: any, destination: any, doNotCopyList?: string[], mustCopyList?: string[]): void;
        /** Set the Windows Runtime preferred launch windowing mode. */
        static SetWindowsLaunchMode(mode: Windows.UI.ViewManagement.ApplicationViewWindowingMode): void;
        /** Quit the Windows Runtime host application. */
        static QuitWindowsApplication(): void;
        /** Are web assembly platform services available and user enabled. */
        static IsWebAssemblyPluginEnabled(): boolean;
        /** Loads and instantiates a web assembly module */
        static LoadWebAssemblyModule(url: string, importObject: any): Promise<any>;
        /** Are xbox live platform services available and user enabled. */
        static IsXboxLivePluginEnabled(): boolean;
        /** Is xbox live user signed in if platform services enabled. */
        static IsXboxLiveUserSignedIn(systemUser?: Windows.System.User, player?: BABYLON.PlayerNumber): boolean;
        /** Validated sign in xbox live user if platform services available. */
        static XboxLiveUserSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): void;
        /** Silent sign in xbox live user if platform services available. */
        static XboxLiveUserSilentSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
        /** Dialog sign in xbox live user if platform services available. */
        static XboxLiveUserDialogSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
        /** Loads a xbox live user profile if platform services available. */
        static LoadXboxLiveUserProfile(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.Social.XboxUserProfile) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
        /** Get xbox live user if platform services available. */
        static GetXboxLiveUser(player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.System.XboxLiveUser;
        /** Get xbox live user if platform services available. */
        static GetXboxLiveSystemUser(systemUser: Windows.System.User, player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.System.XboxLiveUser;
        /** Get xbox live user context if platform services available. */
        static GetXboxLiveUserContext(player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.XboxLiveContext;
        /** Resets xbox live user context if platform services available. */
        static ResetXboxLiveUserContext(player?: BABYLON.PlayerNumber): void;
        /** Get xbox live context property if platform services available. */
        static GetXboxLiveContextProperty(name: any): any;
        /** Get xbox live context property if platform services available. */
        static SetXboxLiveContextProperty(name: any, property: any): void;
        /** Resets xbox live property context bag if platform services available. */
        static ResetXboxLivePropertyContexts(): void;
        /** Sets the Xbox User Sign Out Complete Handler */
        static SetXboxLiveSignOutHandler(handler?: (result: Microsoft.Xbox.Services.System.SignOutCompletedEventArgs) => void): void;
    }
}

declare module BABYLON {
    type Entity = BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light;
    abstract class SceneComponent {
        register: () => void;
        protected tick: boolean;
        protected start(): void;
        protected update(): void;
        protected after(): void;
        protected destroy(): void;
        /** TODO: Optimize render loop with instances */
        private _before;
        private _after;
        private _engine;
        private _scene;
        private _properties;
        private _manager;
        private _entity;
        readonly entity: BABYLON.Entity;
        constructor(owner: BABYLON.Entity, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        readonly scene: BABYLON.Scene;
        readonly engine: BABYLON.Engine;
        readonly manager: BABYLON.SceneManager;
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
        getClassname(): string;
        getMetadata(): BABYLON.ObjectMetadata;
        getComponent<T extends BABYLON.SceneComponent>(klass: string): T;
        getComponents<T extends BABYLON.SceneComponent>(klass: string): T[];
        getLensFlareSystem(flareName: string): BABYLON.LensFlareSystem;
        getLensFlareSystems(): BABYLON.LensFlareSystem[];
        /** TODO: Optimize render loop with instances */
        private registerInstance(me);
        private updateInstance(me);
        private afterInstance(me);
        static DestroyInstance(me: any): void;
    }
    abstract class CameraComponent extends BABYLON.SceneComponent {
        private _camera;
        private _orthoSize;
        private _orthoUpdate;
        constructor(owner: BABYLON.Camera, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        readonly camera: BABYLON.Camera;
        private setupOrthographicCamera(size, updateOnResize);
        private updateOrthographicSize();
        private disposeSceneComponent();
    }
    abstract class LightComponent extends BABYLON.SceneComponent {
        private _light;
        constructor(owner: BABYLON.Light, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        readonly light: BABYLON.Light;
        private disposeSceneComponent();
    }
    abstract class MeshComponent extends BABYLON.SceneComponent {
        private _mesh;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        readonly mesh: BABYLON.AbstractMesh;
        getChildMesh(name: string, searchType?: BABYLON.SearchType, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        getCollisionMesh(directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        getSocketMesh(name: string, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.Mesh;
        getSocketMeshes(directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.Mesh[];
        getParticleSystem(particleName: string): BABYLON.IParticleSystem;
        getParticleSystems(): BABYLON.IParticleSystem[];
        /***********************************/
        /***********************************/
        onCollisionEvent: (collider: BABYLON.AbstractMesh, tag: string) => void;
        private updatePhysicsCollisionEvent(collider, collidedAgainst);
        /*************************************/
        /*************************************/
        private disposeSceneComponent();
    }
    class OrthoController extends BABYLON.CameraComponent {
        protected start(): void;
    }
    class MeshRotator {
        private _entity;
        slerpIdentity: BABYLON.Quaternion;
        constructor(owner: BABYLON.AbstractMesh);
        /** Rotates the mesh using rotation quaternions */
        rotate(x: number, y: number, z: number, order?: BABYLON.RotateOrder): BABYLON.TransformNode;
        /** Rotates the mesh so the forward vector points at a target position using rotation quaternions. (Options: Y-Yall, X-Pitch, Z-Roll) */
        lookAtPosition(position: BABYLON.Vector3, slerp?: number, yawCor?: number, pitchCor?: number, rollCor?: number, space?: BABYLON.Space): BABYLON.TransformNode;
        dispose(): void;
    }
    class ObjectMetadata {
        private _metadata;
        constructor(data: IObjectMetadata);
        readonly type: string;
        readonly prefab: boolean;
        readonly state: any;
        readonly objectId: string;
        readonly objectName: string;
        readonly tagName: string;
        readonly layerIndex: number;
        readonly layerName: string;
        readonly areaIndex: number;
        readonly navAgent: BABYLON.INavigationAgent;
        readonly meshLink: BABYLON.INavigationLink;
        readonly meshObstacle: BABYLON.INavigationObstacle;
        readonly shadowCastingMode: number;
        readonly socketList: BABYLON.ISocketData[];
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
    }
    class MachineState {
        hash: number;
        name: string;
        tag: string;
        time: number;
        type: BABYLON.MotionType;
        rate: number;
        length: number;
        layer: string;
        layerIndex: number;
        played: number;
        machine: string;
        interrupted: boolean;
        apparentSpeed: number;
        averageAngularSpeed: number;
        averageDuration: number;
        averageSpeed: number[];
        cycleOffset: number;
        cycleOffsetParameter: string;
        cycleOffsetParameterActive: boolean;
        iKOnFeet: boolean;
        mirror: boolean;
        mirrorParameter: string;
        irrorParameterActive: boolean;
        speed: number;
        speedParameter: string;
        speedParameterActive: boolean;
        blendtree: BABYLON.IBlendTree;
        transitions: BABYLON.ITransition[];
        behaviours: BABYLON.IBehaviour[];
        animations: BABYLON.Animatable[];
        constructor();
    }
    class TransitionCheck {
        result: string;
        offest: number;
        blending: number;
        triggered: string[];
    }
    enum Constants {
        NoScale = 1,
        Deg2Rad = 0.0174532924,
        Rad2Deg = 57.29578,
        DiagonalSpeed = 0.7071,
        MinimumTimeout = 0.25,
        SpeedCompensator = 1.05,
    }
    enum RotateOrder {
        YXZ = 0,
        YZX = 1,
        XYZ = 2,
        XZY = 3,
        ZXY = 4,
        ZYX = 5,
    }
    enum MotionType {
        Clip = 0,
        Tree = 1,
    }
    enum AnimatorParameterType {
        Float = 1,
        Int = 3,
        Bool = 4,
        Trigger = 9,
    }
    enum SearchType {
        ExactMatch = 0,
        StartsWith = 1,
        EndsWith = 2,
        IndexOf = 3,
    }
    enum PlayerNumber {
        One = 1,
        Two = 2,
        Three = 3,
        Four = 4,
    }
    enum GamepadType {
        None = -1,
        Generic = 0,
        Xbox360 = 1,
    }
    enum JoystickButton {
        Left = 0,
        Right = 1,
    }
    enum Xbox360Trigger {
        Left = 0,
        Right = 1,
    }
    enum UserInputPointer {
        Left = 0,
        Middle = 1,
        Right = 2,
    }
    enum UserInputAxis {
        Horizontal = 0,
        Vertical = 1,
        ClientX = 2,
        ClientY = 3,
        MouseX = 4,
        MouseY = 5,
        Wheel = 6,
    }
    enum UserInputKey {
        BackSpace = 8,
        Tab = 9,
        Enter = 13,
        Shift = 16,
        Ctrl = 17,
        Alt = 18,
        Pause = 19,
        Break = 19,
        CapsLock = 20,
        Escape = 27,
        SpaceBar = 32,
        PageUp = 33,
        PageDown = 34,
        End = 35,
        Home = 36,
        LeftArrow = 37,
        UpArrow = 38,
        RightArrow = 39,
        DownArrow = 40,
        Insert = 45,
        Delete = 46,
        Num0 = 48,
        Num1 = 49,
        Num2 = 50,
        Num3 = 51,
        Num4 = 52,
        Num5 = 53,
        Num6 = 54,
        Num7 = 55,
        Num8 = 56,
        Num9 = 57,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        LeftWindowKey = 91,
        RightWindowKey = 92,
        SelectKey = 93,
        Numpad0 = 96,
        Numpad1 = 97,
        Numpad2 = 98,
        Numpad3 = 99,
        Numpad4 = 100,
        Numpad5 = 101,
        Numpad6 = 102,
        Numpad7 = 103,
        Numpad8 = 104,
        Numpad9 = 105,
        Multiply = 106,
        Add = 107,
        Subtract = 109,
        DecimalPoint = 110,
        Divide = 111,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        NumLock = 144,
        ScrollLock = 145,
        SemiColon = 186,
        EqualSign = 187,
        Comma = 188,
        Dash = 189,
        Period = 190,
        ForwardSlash = 191,
        GraveAccent = 192,
        OpenBracket = 219,
        BackSlash = 220,
        CloseBraket = 221,
        SingleQuote = 222,
    }
    enum MovementType {
        DirectVelocity = 0,
        AppliedForces = 1,
        CheckCollision = 2,
    }
    enum CollisionContact {
        Top = 0,
        Left = 1,
        Right = 2,
        Bottom = 3,
    }
    enum IntersectionPrecision {
        AABB = 0,
        OBB = 1,
    }
    enum ConditionMode {
        If = 1,
        IfNot = 2,
        Greater = 3,
        Less = 4,
        Equals = 6,
        NotEqual = 7,
    }
    enum InterruptionSource {
        None = 0,
        Source = 1,
        Destination = 2,
        SourceThenDestination = 3,
        DestinationThenSource = 4,
    }
    enum BlendTreeType {
        Simple1D = 0,
        SimpleDirectional2D = 1,
        FreeformDirectional2D = 2,
        FreeformCartesian2D = 3,
        Direct = 4,
        Clip = 5,
    }
    enum BlendTreePosition {
        Lower = 0,
        Upper = 1,
    }
    type UserInputAction = (index: number) => void;
    interface UserInputPress {
        index: number;
        action: () => void;
    }
    interface IObjectMetadata {
        api: boolean;
        type: string;
        parsed: boolean;
        prefab: boolean;
        state: any;
        objectName: string;
        objectId: string;
        tagName: string;
        layerIndex: number;
        layerName: string;
        areaIndex: number;
        navAgent: BABYLON.INavigationAgent;
        meshLink: BABYLON.INavigationLink;
        meshObstacle: BABYLON.INavigationObstacle;
        shadowCastingMode: number;
        socketList: BABYLON.ISocketData[];
        animationClips: BABYLON.IAnimationClip[];
        animationEvents: BABYLON.IAnimationEvent[];
        collisionEvent: any;
        components: BABYLON.IScriptComponent[];
        properties: any;
    }
    interface IScriptComponent {
        order: number;
        name: string;
        klass: string;
        update: boolean;
        properties: any;
        instance: BABYLON.SceneComponent;
        tag: any;
    }
    interface IBehaviour {
        hash: number;
        name: string;
        layerIndex: number;
        properties: any;
    }
    interface ITransition {
        hash: number;
        anyState: boolean;
        layerIndex: number;
        machineLayer: string;
        machineName: string;
        canTransitionToSelf: boolean;
        destination: string;
        duration: number;
        exitTime: number;
        hasExitTime: boolean;
        fixedDuration: number;
        intSource: BABYLON.InterruptionSource;
        isExit: boolean;
        mute: boolean;
        name: string;
        offset: number;
        orderedInt: boolean;
        solo: boolean;
        conditions: BABYLON.ICondition[];
    }
    interface ICondition {
        hash: number;
        mode: BABYLON.ConditionMode;
        parameter: string;
        threshold: number;
    }
    interface IBlendTree {
        hash: number;
        name: string;
        state: string;
        children: BABYLON.IBlendTreeChild[];
        layerIndex: number;
        apparentSpeed: number;
        averageAngularSpeed: number;
        averageDuration: number;
        averageSpeed: number[];
        blendParameterX: string;
        blendParameterY: string;
        blendType: BABYLON.BlendTreeType;
        isAnimatorMotion: boolean;
        isHumanMotion: boolean;
        isLooping: boolean;
        minThreshold: number;
        maxThreshold: number;
        useAutomaticThresholds: boolean;
        directBlendMaster: BABYLON.IBlendTreeChild;
        simpleThresholdEqual: BABYLON.IBlendTreeChild;
        simpleThresholdLower: BABYLON.IBlendTreeChild;
        simpleThresholdUpper: BABYLON.IBlendTreeChild;
        simpleThresholdDelta: number;
        valueParameterX: number;
        valueParameterY: number;
    }
    interface IBlendTreeChild {
        hash: number;
        layerIndex: number;
        cycleOffset: number;
        directBlendParameter: string;
        apparentSpeed: number;
        averageAngularSpeed: number;
        averageDuration: number;
        averageSpeed: number[];
        mirror: boolean;
        type: BABYLON.MotionType;
        motion: string;
        positionX: number;
        positionY: number;
        threshold: number;
        timescale: number;
        subtree: BABYLON.IBlendTree;
        indexs: number[];
        weight: number;
        frame: number;
        input: number;
        track: BABYLON.IAnimationClip;
    }
    interface INavigationArea {
        index: number;
        area: string;
        cost: number;
    }
    interface INavigationAgent {
        name: string;
        radius: number;
        height: number;
        speed: number;
        acceleration: number;
        angularSpeed: number;
        areaMask: number;
        autoBraking: boolean;
        autoTraverseOffMeshLink: boolean;
        avoidancePriority: number;
        baseOffset: number;
        obstacleAvoidanceType: string;
        stoppingDistance: number;
    }
    interface INavigationLink {
        name: string;
        activated: boolean;
        area: number;
        autoUpdatePositions: boolean;
        biDirectional: boolean;
        costOverride: number;
        occupied: boolean;
        start: any;
        end: any;
    }
    interface INavigationObstacle {
        name: string;
        carving: boolean;
        carveOnlyStationary: boolean;
        carvingMoveThreshold: number;
        carvingTimeToStationary: number;
        shap: string;
        radius: number;
        center: number[];
        size: number[];
    }
    interface IObjectTransform {
        position: BABYLON.Vector3;
        rotation: BABYLON.Vector3;
        scale: BABYLON.Vector3;
    }
    interface IIntersectionState {
        mesh: BABYLON.AbstractMesh;
        intersecting: boolean;
    }
    interface ISocketData {
        boneIndex: number;
        boneName: string;
        socketMesh: BABYLON.Mesh;
        positionX: number;
        positionY: number;
        positionZ: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
    }
    interface IAvatarMask {
        hash: number;
        maskName: string;
        transformCount: number;
        transformPaths: string[];
        transformIndexs: number[];
    }
    interface IAnimationClip {
        type: string;
        wrap: number;
        name: string;
        start: number;
        stop: number;
        rate: number;
        frames: number;
        weight: number;
        behavior: number;
        apparentSpeed: number;
        averageSpeed: number[];
        averageDuration: number;
        averageAngularSpeed: number;
        customCurveKeyNames: string[];
    }
    interface IAnimationEvent {
        clip: string;
        frame: number;
        functionName: string;
        intParameter: number;
        floatParameter: number;
        stringParameter: string;
        objectIdParameter: string;
    }
    interface IAnimationLayer {
        hash: number;
        name: string;
        index: number;
        entry: string;
        machine: string;
        iKPass: boolean;
        avatarMask: BABYLON.IAvatarMask;
        blendingMode: number;
        defaultWeight: number;
        syncedLayerIndex: number;
        syncedLayerAffectsTiming: boolean;
        animationTime: number;
        animationFrame: number;
        animationRatio: number;
        animationNormalize: number;
        animationReference: number;
        animationAnimatables: BABYLON.Animatable[];
        animationBlendLoop: number;
        animationBlendFrame: number;
        animationBlendFirst: boolean;
        animationBlendSpeed: number;
        animationBlendWeight: number;
        animationBlendMatrix: BABYLON.Matrix;
        animationBlendBuffer: BABYLON.IBlendTreeChild[];
        animationStateMachine: BABYLON.MachineState;
    }
    interface IAnimationCurve {
        length: number;
        preWrapMode: string;
        postWrapMode: string;
        keyframes: BABYLON.IAnimationKeyframe[];
    }
    interface IAnimationKeyframe {
        time: number;
        value: number;
        inTangent: number;
        outTangent: number;
        tangentMode: number;
    }
    class UserInputOptions {
        static JoystickRightHandleColor: string;
        static JoystickLeftSensibility: number;
        static JoystickRightSensibility: number;
        static JoystickDeadStickValue: number;
        static GamepadDeadStickValue: number;
        static GamepadLStickXInverted: boolean;
        static GamepadLStickYInverted: boolean;
        static GamepadRStickXInverted: boolean;
        static GamepadRStickYInverted: boolean;
        static GamepadLStickSensibility: number;
        static GamepadRStickSensibility: number;
        static PointerAngularSensibility: number;
        static PointerWheelDeadZone: number;
    }
}

declare module BABYLON {
    interface IShurikenBusrt {
        time: number;
        minCount: number;
        maxCount: number;
    }
    interface IShurikenCurve {
        length: number;
        preWrapMode: string;
        postWrapMode: string;
        keyframes: BABYLON.IShurikenKeyframe[];
    }
    interface IShurikenKeyframe {
        time: number;
        value: number;
        inTangent: number;
        outTangent: number;
        tangentMode: number;
    }
    type IShurikenParticleSystem = BABYLON.ShurikenParticleSystem | BABYLON.GPUShurikenParticleSystem;
    class ShurikenParticleSystem extends BABYLON.ParticleSystem {
        static readonly EMISSION_RATE: number;
        static readonly EMISSION_BURST: number;
        emitType: number;
        loopPlay: boolean;
        delayTime: number;
        private _self;
        private _duration;
        private _startSpeed;
        private _emissionBurst;
        getDuration(): number;
        constructor(name: string, capacity: number, scene: BABYLON.Scene, duration?: number, emission?: number, startSpeed?: number, emissionBurst?: BABYLON.IShurikenBusrt[]);
        /** Babylon Particle System Overrides */
        start(): void;
        stop(): void;
        dispose(): void;
        private readonly internalScene;
        private internalPlay(delay?, min?, max?);
        private internalCycle();
        private internalStart(min, max);
        private internalStop(force?);
        getParticles(): Array<BABYLON.Particle>;
        defaultUpdateFunctionHandler(particles: BABYLON.Particle[]): void;
    }
    class GPUShurikenParticleSystem extends BABYLON.GPUParticleSystem {
        loopPlay: boolean;
        delayTime: number;
        private _self;
        private _duration;
        private _startSpeed;
        getDuration(): number;
        constructor(name: string, capacity: number, scene: BABYLON.Scene, size?: number, duration?: number, startSpeed?: number);
        /** Babylon Particle System Overrides */
        start(): void;
        stop(): void;
        dispose(): void;
        private internalPlay(delay?, min?, max?);
        private internalCycle();
        private internalStart(min, max);
        private internalStop(force?);
    }
}

declare module BABYLON {
    class UniversalParticleSystem extends BABYLON.MeshComponent {
        private _time;
        private _auto;
        private _mode;
        private _size;
        private _shape;
        private _shuriken;
        readonly mode: number;
        readonly shape: number;
        readonly shuriken: BABYLON.IShurikenParticleSystem;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected start(): void;
        protected destroy(): void;
        private initializeParticleSystem();
    }
}

declare module BABYLON {
    class CharacterController extends BABYLON.MeshComponent {
        movementType: number;
        avatarControl: number;
        avatarHeight: number;
        avatarRadius: number;
        fallingVelocity: number;
        slidingVelocity: number;
        synchronizeVelocity: boolean;
        isJumping(): boolean;
        isFalling(): boolean;
        isSliding(): boolean;
        isGrounded(): boolean;
        getVelocity(): BABYLON.Vector3;
        getFriction(): number;
        setFriction(friction: number): void;
        onPhysicsContact: (collider: BABYLON.AbstractMesh, tag: string) => void;
        private _jumping;
        private _falling;
        private _sliding;
        private _grounded;
        private _threashold;
        private _velocity;
        private _angularVelocity;
        private _jumpingVelocity;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected start(): void;
        protected update(): void;
        protected after(): void;
        protected updateGroundingState(): void;
        move(velocity: BABYLON.Vector3, friction?: number, jump?: number): void;
        turn(speed: number, friction?: number): void;
    }
}

declare module BABYLON {
    class UniversalShaderDefines {
        private _defines;
        constructor();
        getDefines(): any;
        resetDefines(): any;
        defineBoolean(name: string): void;
        defineNumeric(name: string, value: number): void;
    }
    class UniversalPushMaterial extends BABYLON.PushMaterial {
        protected start(): void;
        protected update(): void;
        protected after(): void;
        protected destroy(): void;
        protected ticking: boolean;
        constructor(name: string, scene: BABYLON.Scene, tick?: boolean);
        private _manager;
        getManager(): BABYLON.SceneManager;
        private _started;
        private _register;
        private _before;
        private _after;
        private _destroy;
        private initializeInstance();
        private registerInstance(me);
        private updateInstance(me);
        private afterInstance(me);
        private destoryInstance(me);
        dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void;
    }
    class UniversalShaderMaterial extends BABYLON.StandardMaterial {
        protected tick: boolean;
        protected start(): void;
        protected update(): void;
        protected define(locals: BABYLON.UniversalShaderDefines): void;
        protected after(): void;
        protected destroy(): void;
        protected ticking: boolean;
        protected program: string;
        private _locals;
        constructor(name: string, scene: BABYLON.Scene, tick?: boolean);
        private _uniforms;
        private _samplers;
        private _textures;
        private _textureArrays;
        private _floats;
        private _floatsArrays;
        private _colors3;
        private _colors4;
        private _vectors2;
        private _vectors3;
        private _vectors4;
        private _matrices;
        private _matrices3x3;
        private _matrices2x2;
        private _vectors3Arrays;
        readonly textures: {
            [name: string]: BABYLON.Texture;
        };
        readonly textureArray: {
            [name: string]: BABYLON.Texture[];
        };
        readonly floats: {
            [name: string]: number;
        };
        readonly floatsArrays: {
            [name: string]: number[];
        };
        readonly colors3: {
            [name: string]: BABYLON.Color3;
        };
        readonly colors4: {
            [name: string]: BABYLON.Color4;
        };
        readonly vectors2: {
            [name: string]: BABYLON.Vector2;
        };
        readonly vectors3: {
            [name: string]: BABYLON.Vector3;
        };
        readonly vectors4: {
            [name: string]: BABYLON.Vector4;
        };
        readonly matrices: {
            [name: string]: BABYLON.Matrix;
        };
        readonly matrices3x3: {
            [name: string]: Float32Array;
        };
        readonly matrices2x2: {
            [name: string]: Float32Array;
        };
        readonly vectors3Arrays: {
            [name: string]: number[];
        };
        setTexture(name: string, texture: BABYLON.Texture): BABYLON.UniversalShaderMaterial;
        setTextureArray(name: string, textures: BABYLON.Texture[]): BABYLON.UniversalShaderMaterial;
        setFloat(name: string, value: number): BABYLON.UniversalShaderMaterial;
        setFloats(name: string, value: number[]): BABYLON.UniversalShaderMaterial;
        setColor3(name: string, value: BABYLON.Color3): BABYLON.UniversalShaderMaterial;
        setColor4(name: string, value: BABYLON.Color4): BABYLON.UniversalShaderMaterial;
        setVector2(name: string, value: BABYLON.Vector2): BABYLON.UniversalShaderMaterial;
        setVector3(name: string, value: BABYLON.Vector3): BABYLON.UniversalShaderMaterial;
        setVector4(name: string, value: BABYLON.Vector4): BABYLON.UniversalShaderMaterial;
        setMatrix(name: string, value: BABYLON.Matrix): BABYLON.UniversalShaderMaterial;
        setMatrix3x3(name: string, value: Float32Array): BABYLON.UniversalShaderMaterial;
        setMatrix2x2(name: string, value: Float32Array): BABYLON.UniversalShaderMaterial;
        setArray3(name: string, value: number[]): BABYLON.UniversalShaderMaterial;
        isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
        getAnimatables(): IAnimatable[];
        getActiveTextures(): BaseTexture[];
        hasTexture(texture: BaseTexture): boolean;
        clone(name: string): BABYLON.UniversalShaderMaterial;
        serialize(): any;
        static Parse(source: any, scene: BABYLON.Scene, rootUrl: string): BABYLON.UniversalShaderMaterial;
        static CloneCustomProperties(material: UniversalShaderMaterial, destination: UniversalShaderMaterial): void;
        static SerializeCustomProperties(material: UniversalShaderMaterial, serializationObject: any): void;
        static ParseCustomProperties(material: UniversalShaderMaterial, source: any, scene: BABYLON.Scene, rootUrl: string): void;
        private _manager;
        getManager(): BABYLON.SceneManager;
        private _checkUniform(uniformName);
        private _checkSampler(samplerName);
        private _buildCustomShader(shaderName, uniforms, uniformBuffers, samplers, defines);
        _attachAfterBind(mesh: BABYLON.Mesh, effect: BABYLON.Effect): void;
        private _started;
        private _register;
        private _before;
        private _after;
        private _destroy;
        private initializeInstance();
        private registerInstance(me);
        private updateInstance(me);
        private afterInstance(me);
        private destoryInstance(me);
        dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void;
    }
    class UniversalTerrainMaterial extends BABYLON.UniversalShaderMaterial {
        private _totalTexturesLoaded;
        private _maxTexturesImageUnits;
        readonly totalTexturesLoaded: number;
        readonly maxTexturesImageUnits: number;
        constructor(name: string, scene: BABYLON.Scene, tick?: boolean);
        protected start(): void;
        protected define(locals: BABYLON.UniversalShaderDefines): void;
        clone(name: string): BABYLON.UniversalTerrainMaterial;
        serialize(): any;
        static Parse(source: any, scene: BABYLON.Scene, rootUrl: string): BABYLON.UniversalTerrainMaterial;
    }
}

declare module BABYLON {
    class UniversalCameraRig extends BABYLON.CameraComponent {
        private static AUTO_INPUT;
        private static RENDER_CANVAS;
        autoInput: boolean;
        cameraInput: number;
        cameraSpeed: number;
        cameraMoveSpeed: number;
        cameraRotateSpeed: number;
        private movementKeys;
        private multiPlayerView;
        private multiPlayerStart;
        preventDefaultEvents: boolean;
        private playerOneCamera;
        private playerTwoCamera;
        private playerThreeCamera;
        private playerFourCamera;
        constructor(owner: BABYLON.Camera, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected ready(): void;
        protected update(): void;
        protected destroy(): void;
    }
}

declare module BABYLON {
    class ActionManagerComponent extends BABYLON.MeshComponent {
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected ready(): void;
        protected start(): void;
        protected update(): void;
        protected after(): void;
        protected destroy(): void;
    }
}
