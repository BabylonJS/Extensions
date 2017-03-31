declare module BABYLON {
    abstract class SceneComponent {
        register: () => void;
        dispose: () => void;
        tick: boolean;
        private _engine;
        private _scene;
        private _before;
        private _after;
        private _started;
        private _initialized;
        private _properties;
        private _handlers;
        private _manager;
        private _owned;
        constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, host: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        readonly scene: BABYLON.Scene;
        readonly engine: BABYLON.Engine;
        start(): void;
        update(): void;
        after(): void;
        destroy(): void;
        readonly manager: BABYLON.SceneManager;
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
        getMetadata(): BABYLON.ObjectMetadata;
        onAnimationEvent(name: string, handler: (evt: BABYLON.IAnimationStateEvent) => void): void;
        findComponent(klass: string): BABYLON.SceneComponent;
        findComponents(klass: string): BABYLON.SceneComponent[];
        findParticleSystem(particleName: string): BABYLON.ParticleSystem;
        findParticleSystems(): BABYLON.ParticleSystem[];
        findLensFlareSystem(flareName: string): BABYLON.LensFlareSystem;
        findLensFlareSystems(): BABYLON.LensFlareSystem[];
        private registerInstance(instance);
        private updateInstance(instance);
        private afterInstance(instance);
        private disposeInstance(instance);
    }
    abstract class CameraComponent extends BABYLON.SceneComponent {
        private _camera;
        private _orthoSize;
        private _orthoUpdate;
        constructor(owner: BABYLON.Camera, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        readonly camera: BABYLON.Camera;
        isHighDynamicRange(): boolean;
        getRenderingPipeline(): BABYLON.HDRRenderingPipeline;
        private setupOrthographicCamera(size, updateOnResize);
        private updateOrthographicSize();
        private disposeSceneComponent();
    }
    abstract class LightComponent extends BABYLON.SceneComponent {
        private _light;
        constructor(owner: BABYLON.Light, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        readonly light: BABYLON.Light;
        private disposeSceneComponent();
    }
    abstract class MeshComponent extends BABYLON.SceneComponent {
        onIntersectionEnter: (mesh: BABYLON.AbstractMesh) => void;
        onIntersectionStay: (mesh: BABYLON.AbstractMesh) => void;
        onIntersectionExit: (mesh: BABYLON.AbstractMesh) => void;
        private _list;
        private _mesh;
        private _collider;
        private _intersecting;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        readonly mesh: BABYLON.AbstractMesh;
        getChildMesh(name: string, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        getDetailMesh(directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        getCollisionMesh(directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        setPhysicsCollisions(collisionTags: string[], collisionHandler: (collider: BABYLON.IPhysicsEnabledObject) => void): void;
        clearPhysicsCollisions(): void;
        setIntersectionMeshes(meshes: BABYLON.AbstractMesh[]): void;
        clearIntersectionList(): void;
        private updateIntersectionList();
        private processPhysicsCollisions(collider, collidedAgainst);
        private disposeSceneComponent();
    }
    abstract class SceneController extends BABYLON.MeshComponent {
        ready(): void;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        private onready();
    }
    class OrthoController extends BABYLON.CameraComponent {
        start(): void;
    }
    class ObjectMetadata {
        private _metadata;
        constructor(data: IObjectMetadata);
        readonly type: string;
        readonly prefab: boolean;
        readonly objectId: string;
        readonly objectName: string;
        readonly tagName: string;
        readonly layerIndex: number;
        readonly layerName: string;
        readonly areaIndex: number;
        readonly navAgent: BABYLON.INavigationAgent;
        readonly meshLink: BABYLON.INavigationLink;
        readonly meshObstacle: BABYLON.INavigationObstacle;
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
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
    type UserInputAction = (index: number) => void;
    interface UserInputPress {
        index: number;
        action: () => void;
    }
    interface IObjectMetadata {
        api: boolean;
        type: string;
        prefab: boolean;
        objectName: string;
        objectId: string;
        tagName: string;
        layerIndex: number;
        layerName: string;
        areaIndex: number;
        navAgent: BABYLON.INavigationAgent;
        meshLink: BABYLON.INavigationLink;
        meshObstacle: BABYLON.INavigationObstacle;
        animationStates: BABYLON.IAnimationState[];
        animationEvents: BABYLON.IAnimationStateEvent[];
        collisionEvent: any;
        collisionTags: string[];
        components: BABYLON.IScriptComponent[];
        properties: any;
    }
    interface IScriptComponent {
        order: number;
        name: string;
        klass: string;
        update: boolean;
        controller: boolean;
        properties: any;
        instance: BABYLON.SceneComponent;
        tag: any;
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
    interface ICollisionState {
        mesh: BABYLON.AbstractMesh;
        intersecting: boolean;
    }
    interface IAnimationState {
        type: string;
        name: string;
        start: number;
        stop: number;
        rate: boolean;
        speed: number;
        source: string;
    }
    interface IAnimationStateEvent {
        state: string;
        frame: number;
        legacy: boolean;
        functionName: string;
        intParameter: number;
        floatParameter: number;
        stringParameter: string;
        objectIdParameter: string;
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
    }
}

declare module BABYLON {
    class SceneManager {
        static GetInstance(scene: BABYLON.Scene): BABYLON.SceneManager;
        static CreateScene(name: string, engine: BABYLON.Engine): BABYLON.Scene;
        static LoadScene(rootUrl: string, sceneFilename: string, engine: BABYLON.Engine, onsuccess?: (scene: BABYLON.Scene) => void, progressCallBack?: any, onerror?: (scene: BABYLON.Scene) => void): void;
        static ImportMesh(meshesNames: any, rootUrl: string, sceneFilename: string, scene: BABYLON.Scene, onsuccess?: (meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]) => void, progressCallBack?: () => void, onerror?: (scene: BABYLON.Scene, message: string, exception?: any) => void): void;
        static RegisterLoader(handler: (root: string, name: string) => void): void;
        static RegisterReady(handler: (scene: BABYLON.Scene, manager: BABYLON.SceneManager) => void): void;
        onrender: () => void;
        controller: BABYLON.SceneController;
        private _ie;
        private _url;
        private _time;
        private _timing;
        private _filename;
        private _render;
        private _running;
        private _markup;
        private _gui;
        private _input;
        private _scene;
        private _navmesh;
        private _navigation;
        private _loadQueueIndex;
        private _loadQueueCount;
        private _loadQueueScenes;
        private _localReadyState;
        private static keymap;
        private static prefabs;
        private static clientx;
        private static clienty;
        private static mousex;
        private static mousey;
        private static vertical;
        private static horizontal;
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
        private static g_mousex;
        private static g_mousey;
        private static g_vertical;
        private static g_horizontal;
        private static engine;
        private static gamepad;
        private static gamepads;
        private static gamepadType;
        private static gamepadConnected;
        private static gamepadButtonPress;
        private static gamepadButtonDown;
        private static gamepadButtonUp;
        private static gamepadDpadPress;
        private static gamepadDpadDown;
        private static gamepadDpadUp;
        private static gamepadLeftTrigger;
        private static gamepadRightTrigger;
        private static mouseButtonPress;
        private static mouseButtonDown;
        private static mouseButtonUp;
        private static keyButtonPress;
        private static keyButtonDown;
        private static keyButtonUp;
        private static leftJoystick;
        private static rightJoystick;
        private static virtualJoystick;
        private static previousPosition;
        private static preventDefault;
        private static rightHanded;
        private static loader;
        private static ready;
        constructor(rootUrl: string, file: string, scene: BABYLON.Scene);
        readonly ie: boolean;
        readonly url: string;
        dispose(): void;
        isRunning(): boolean;
        isMobile(): boolean;
        getTime(): number;
        enableTime(): void;
        disableTime(): void;
        loadLevel(name: string, path?: string): void;
        randomNumber(min: number, max: number): number;
        importMeshes(filename: string, onsuccess?: () => void, onprogress?: () => void, onerror?: (scene: BABYLON.Scene, message: string, exception: any) => void): void;
        safeDestroy(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, delay?: number, disable?: boolean): void;
        getSceneName(): string;
        getScenePath(): string;
        showFullscreen(element?: HTMLElement): void;
        exitFullscreen(): void;
        getLoadingStatus(): string;
        private _executeWhenReady();
        private _executeLocalReady();
        private _loadQueueImports();
        start(): void;
        stop(): void;
        toggle(): void;
        stepFrame(): void;
        pauseAudio(): void;
        resumeAudio(): void;
        toggleDebug(popups?: boolean, tab?: number, parent?: HTMLElement): void;
        traceLights(): void;
        traceCameras(): void;
        traceMeshes(): void;
        dumpPrefabs(): void;
        getGuiMode(): string;
        getGuiElement(): Element;
        getSceneMarkup(): string;
        drawSceneMarkup(markup: string): void;
        clearSceneMarkup(): void;
        hasPrefabMesh(prefabName: string): boolean;
        getPrefabMesh(prefabName: string): BABYLON.Mesh;
        instantiatePrefab(prefabName: string, cloneName: string, newPosition?: BABYLON.Vector3, newRotation?: BABYLON.Vector3, newScaling?: BABYLON.Vector3, newParent?: Node): BABYLON.Mesh;
        playAnimation(name: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, loop?: boolean, decendants?: boolean, onAnimationEnd?: () => void): BABYLON.Animatable[];
        getAnimationState(name: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, decendants?: boolean): BABYLON.IAnimationState;
        getOwnerMetadata(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ObjectMetadata;
        getOwnerChildMesh(name: string, owner: BABYLON.AbstractMesh, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        getOwnerDetailMesh(owner: BABYLON.AbstractMesh, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        getOwnerCollisionMesh(owner: BABYLON.AbstractMesh, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.AbstractMesh;
        addSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, enableUpdate?: boolean, propertyBag?: any): BABYLON.SceneComponent;
        createSceneController(klass: string): BABYLON.SceneController;
        findSceneController(): BABYLON.SceneController;
        findSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.SceneComponent;
        findSceneComponents(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.SceneComponent[];
        findSceneAnimationState(name: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.IAnimationState;
        findSceneParticleSystem(name: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ParticleSystem;
        findSceneParticleSystems(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ParticleSystem[];
        findSceneLensFlareSystem(name: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.LensFlareSystem;
        findSceneLensFlareSystems(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.LensFlareSystem[];
        resetUserInput(): void;
        enableUserInput(options?: {
            preventDefault?: boolean;
            useCapture?: boolean;
            enableVirtualJoystick?: boolean;
            disableRightStick?: boolean;
            gamepadConnected?: (pad: BABYLON.Gamepad, kind: BABYLON.GamepadType) => void;
        }): void;
        disableUserInput(useCapture?: boolean): void;
        getUserInput(input: BABYLON.UserInputAxis): number;
        onKeyUp(callback: (keycode: number) => void): void;
        onKeyDown(callback: (keycode: number) => void): void;
        onKeyPress(keycode: number, callback: () => void): void;
        getKeyInput(keycode: number): boolean;
        onPointerUp(callback: (button: number) => void): void;
        onPointerDown(callback: (button: number) => void): void;
        onPointerPress(button: number, callback: () => void): void;
        getPointerInput(button: number): boolean;
        onButtonUp(callback: (button: number) => void): void;
        onButtonDown(callback: (button: number) => void): void;
        onButtonPress(button: number, callback: () => void): void;
        getButtonInput(button: number): boolean;
        onDpadUp(callback: (direction: number) => void): void;
        onDpadDown(callback: (direction: number) => void): void;
        onDpadPress(direction: number, callback: () => void): void;
        getDpadInput(direction: number): boolean;
        onTriggerLeft(callback: (value: number) => void): void;
        onTriggerRight(callback: (value: number) => void): void;
        getTriggerInput(trigger: number): number;
        getConnectedGamepad(): BABYLON.Gamepad;
        getConnectedGamepadType(): BABYLON.GamepadType;
        disposeConnectedGamepad(): void;
        getLeftJoystick(): BABYLON.VirtualJoystick;
        getRightJoystick(): BABYLON.VirtualJoystick;
        getJoystickPress(button: number): boolean;
        disposeVirtualJoysticks(): void;
        switchActiveCamera(camera: BABYLON.Camera, updatePosition?: boolean, attachedCanvas?: HTMLCanvasElement, disposeActiveCamera?: boolean): void;
        updateCameraPosition(camera: BABYLON.FreeCamera, horizontal: number, vertical: number, speed: number): void;
        updateCameraRotation(camera: BABYLON.FreeCamera, mousex: number, mousey: number, speed: number): void;
        updateCameraUserInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number): void;
        isHighDynamicRangeCamera(camera: BABYLON.Camera): boolean;
        getHighDynamicRangePipeline(camera: BABYLON.Camera): BABYLON.HDRRenderingPipeline;
        hasNavigationMesh(): boolean;
        setNavigationMesh(mesh: BABYLON.AbstractMesh): void;
        getNavigationMesh(): BABYLON.AbstractMesh;
        getNavigationTool(): Navigation;
        getNavigationZone(): string;
        getNavigationPath(agent: BABYLON.AbstractMesh, destination: BABYLON.Vector3): BABYLON.Vector3[];
        setNavigationPath(agent: BABYLON.AbstractMesh, path: BABYLON.Vector3[], speed?: number, loop?: boolean, callback?: () => void): void;
        getNavigationAgent(agent: BABYLON.AbstractMesh): BABYLON.NavigationAgent;
        getNavigationAgents(): BABYLON.Mesh[];
        getNavigationAreaTable(): BABYLON.INavigationArea[];
        getNavigationAreaIndexes(): number[];
        getNavigationAreaName(index: number): string;
        getNavigationAreaCost(index: number): number;
        private static inputKeyDownHandler(e);
        private static inputKeyUpHandler(e);
        private static inputPointerDownHandler(e);
        private static inputPointerUpHandler(e);
        private static inputPointerMoveHandler(e);
        private static inputButtonDownHandler(button);
        private static inputButtonUpHandler(button);
        private static inputXboxDPadDownHandler(dPadPressed);
        private static inputXboxDPadUpHandler(dPadReleased);
        private static inputXboxLeftTriggerHandler(value);
        private static inputXboxRightTriggerHandler(value);
        private static inputLeftStickHandler(values);
        private static inputRightStickHandler(values);
        private static inputGamepadConnected(pad);
        private static inputVirtualJoysticks();
        private static updateUserInput();
        private static parseSceneMetadata(rootUrl, sceneFilename, scene);
        private static parseMeshMetadata(meshes, scene);
        private static parseSceneCameras(cameras, scene, ticklist);
        private static parseSceneLights(lights, scene, ticklist);
        private static parseSceneMeshes(meshes, scene, ticklist);
        private static setupPhysicsImpostor(physicsMesh, plugin, friction, collisions, rotation);
        private static setupCameraRigOptions(camera, scene, ticklist);
        private static setupAnimationEvents(owner, scene);
        static locateOwnerAnimationTrack(index: number, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, directDecendantsOnly?: boolean, predicate?: (node: BABYLON.Node) => boolean): BABYLON.Animation;
        static destroySceneComponents(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, destroyMetadata?: boolean): void;
        static ReplaceAll(source: string, find: string, replace: string): string;
        static CloneValue(source: any, destinationObject: any): any;
        static CloneMetadata(source: BABYLON.IObjectMetadata): BABYLON.IObjectMetadata;
        static DeepCopyProperties(source: any, destination: any, doNotCopyList?: string[], mustCopyList?: string[]): void;
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
    class ShaderController {
        private _shader;
        private _manager;
        constructor(owner: BABYLON.UniversalShaderMaterial, host: BABYLON.Scene);
        start(): void;
        update(): void;
        define(defines: string[], mesh?: BABYLON.AbstractMesh, useInstances?: boolean): void;
        after(): void;
        destroy(): void;
        dispose(): void;
        readonly shader: BABYLON.UniversalShaderMaterial;
        readonly scene: BABYLON.Scene;
        readonly engine: BABYLON.Engine;
        readonly manager: BABYLON.SceneManager;
    }
    /**
     * The Physically based material of BJS.
     *
     * This offers the main features of a standard PBR material.
     * For more information, please refer to the documentation :
     * http://doc.babylonjs.com/extensions/Physically_Based_Rendering
     */
    class UniversalShaderMaterial extends BABYLON.Material {
        /**
         * Intensity of the direct lights e.g. the four lights available in your scene.
         * This impacts both the direct diffuse and specular highlights.
         */
        directIntensity: number;
        /**
         * Intensity of the emissive part of the material.
         * This helps controlling the emissive effect without modifying the emissive color.
         */
        emissiveIntensity: number;
        /**
         * Intensity of the environment e.g. how much the environment will light the object
         * either through harmonics for rough material or through the refelction for shiny ones.
         */
        environmentIntensity: number;
        /**
         * This is a special control allowing the reduction of the specular highlights coming from the
         * four lights of the scene. Those highlights may not be needed in full environment lighting.
         */
        specularIntensity: number;
        private _lightingInfos;
        /**
         * Debug Control allowing disabling the bump map on this material.
         */
        disableBumpMap: boolean;
        /**
         * Debug Control helping enforcing or dropping the darkness of shadows.
         * 1.0 means the shadows have their normal darkness, 0.0 means the shadows are not visible.
         */
        overloadedShadowIntensity: number;
        /**
         * Debug Control helping dropping the shading effect coming from the diffuse lighting.
         * 1.0 means the shade have their normal impact, 0.0 means no shading at all.
         */
        overloadedShadeIntensity: number;
        private _overloadedShadowInfos;
        /**
         * The camera exposure used on this material.
         * This property is here and not in the camera to allow controlling exposure without full screen post process.
         * This corresponds to a photographic exposure.
         */
        cameraExposure: number;
        /**
         * The camera contrast used on this material.
         * This property is here and not in the camera to allow controlling contrast without full screen post process.
         */
        cameraContrast: number;
        /**
         * Color Grading 2D Lookup Texture.
         * This allows special effects like sepia, black and white to sixties rendering style.
         */
        cameraColorGradingTexture: BABYLON.BaseTexture;
        /**
         * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
         * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
         * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
         * corresponding to low luminance, medium luminance, and high luminance areas respectively.
         */
        cameraColorCurves: BABYLON.ColorCurves;
        private _cameraInfos;
        private _microsurfaceTextureLods;
        /**
         * Debug Control allowing to overload the ambient color.
         * This as to be use with the overloadedAmbientIntensity parameter.
         */
        overloadedAmbient: BABYLON.Color3;
        /**
         * Debug Control indicating how much the overloaded ambient color is used against the default one.
         */
        overloadedAmbientIntensity: number;
        /**
         * Debug Control allowing to overload the albedo color.
         * This as to be use with the overloadedAlbedoIntensity parameter.
         */
        overloadedAlbedo: BABYLON.Color3;
        /**
         * Debug Control indicating how much the overloaded albedo color is used against the default one.
         */
        overloadedAlbedoIntensity: number;
        /**
         * Debug Control allowing to overload the reflectivity color.
         * This as to be use with the overloadedReflectivityIntensity parameter.
         */
        overloadedReflectivity: BABYLON.Color3;
        /**
         * Debug Control indicating how much the overloaded reflectivity color is used against the default one.
         */
        overloadedReflectivityIntensity: number;
        /**
         * Debug Control allowing to overload the emissive color.
         * This as to be use with the overloadedEmissiveIntensity parameter.
         */
        overloadedEmissive: BABYLON.Color3;
        /**
         * Debug Control indicating how much the overloaded emissive color is used against the default one.
         */
        overloadedEmissiveIntensity: number;
        private _overloadedIntensity;
        /**
         * Debug Control allowing to overload the reflection color.
         * This as to be use with the overloadedReflectionIntensity parameter.
         */
        overloadedReflection: BABYLON.Color3;
        /**
         * Debug Control indicating how much the overloaded reflection color is used against the default one.
         */
        overloadedReflectionIntensity: number;
        /**
         * Debug Control allowing to overload the microsurface.
         * This as to be use with the overloadedMicroSurfaceIntensity parameter.
         */
        overloadedMicroSurface: number;
        /**
         * Debug Control indicating how much the overloaded microsurface is used against the default one.
         */
        overloadedMicroSurfaceIntensity: number;
        private _overloadedMicroSurface;
        /**
         * AKA Diffuse Texture in standard nomenclature.
         */
        albedoTexture: BABYLON.BaseTexture;
        /**
         * AKA Occlusion Texture in other nomenclature.
         */
        ambientTexture: BABYLON.BaseTexture;
        /**
         * AKA Occlusion Texture Intensity in other nomenclature.
         */
        ambientTextureStrength: number;
        opacityTexture: BABYLON.BaseTexture;
        reflectionTexture: BABYLON.BaseTexture;
        emissiveTexture: BABYLON.BaseTexture;
        /**
         * AKA Specular texture in other nomenclature.
         */
        reflectivityTexture: BABYLON.BaseTexture;
        /**
         * Used to switch from specular/glossiness to metallic/roughness workflow.
         */
        metallicTexture: BABYLON.BaseTexture;
        /**
         * Specifies the metallic scalar of the metallic/roughness workflow.
         * Can also be used to scale the metalness values of the metallic texture.
         */
        metallic: number;
        /**
         * Specifies the roughness scalar of the metallic/roughness workflow.
         * Can also be used to scale the roughness values of the metallic texture.
         */
        roughness: number;
        bumpTexture: BABYLON.BaseTexture;
        lightmapTexture: BABYLON.BaseTexture;
        refractionTexture: BABYLON.BaseTexture;
        ambientColor: Color3;
        /**
         * AKA Diffuse Color in other nomenclature.
         */
        albedoColor: Color3;
        /**
         * AKA Specular Color in other nomenclature.
         */
        reflectivityColor: Color3;
        reflectionColor: Color3;
        emissiveColor: Color3;
        /**
         * AKA Glossiness in other nomenclature.
         */
        microSurface: number;
        /**
         * source material index of refraction (IOR)' / 'destination material IOR.
         */
        indexOfRefraction: number;
        /**
         * Controls if refraction needs to be inverted on Y. This could be usefull for procedural texture.
         */
        invertRefractionY: boolean;
        opacityFresnelParameters: BABYLON.FresnelParameters;
        emissiveFresnelParameters: BABYLON.FresnelParameters;
        /**
         * This parameters will make the material used its opacity to control how much it is refracting aginst not.
         * Materials half opaque for instance using refraction could benefit from this control.
         */
        linkRefractionWithTransparency: boolean;
        /**
         * The emissive and albedo are linked to never be more than one (Energy conservation).
         */
        linkEmissiveWithAlbedo: boolean;
        useLightmapAsShadowmap: boolean;
        /**
         * In this mode, the emissive informtaion will always be added to the lighting once.
         * A light for instance can be thought as emissive.
         */
        useEmissiveAsIllumination: boolean;
        /**
         * Secifies that the alpha is coming form the albedo channel alpha channel.
         */
        useAlphaFromAlbedoTexture: boolean;
        /**
         * Specifies that the material will keeps the specular highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
         */
        useSpecularOverAlpha: boolean;
        /**
         * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
         */
        useMicroSurfaceFromReflectivityMapAlpha: boolean;
        /**
         * Specifies if the metallic texture contains the roughness information in its alpha channel.
         */
        useRoughnessFromMetallicTextureAlpha: boolean;
        /**
         * Specifies if the metallic texture contains the roughness information in its green channel.
         */
        useRoughnessFromMetallicTextureGreen: boolean;
        /**
         * In case the reflectivity map does not contain the microsurface information in its alpha channel,
         * The material will try to infer what glossiness each pixel should be.
         */
        useAutoMicroSurfaceFromReflectivityMap: boolean;
        /**
         * Allows to work with scalar in linear mode. This is definitely a matter of preferences and tools used during
         * the creation of the material.
         */
        useScalarInLinearSpace: boolean;
        /**
         * BJS is using an harcoded light falloff based on a manually sets up range.
         * In PBR, one way to represents the fallof is to use the inverse squared root algorythm.
         * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
         */
        usePhysicalLightFalloff: boolean;
        /**
         * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most limunous ones).
         * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
         */
        useRadianceOverAlpha: boolean;
        /**
         * Allows using the bump map in parallax mode.
         */
        useParallax: boolean;
        /**
         * Allows using the bump map in parallax occlusion mode.
         */
        useParallaxOcclusion: boolean;
        /**
         * Controls the scale bias of the parallax mode.
         */
        parallaxScaleBias: number;
        /**
         * If sets to true, disables all the lights affecting the material.
         */
        disableLighting: boolean;
        /**
         * Number of Simultaneous lights allowed on the material.
         */
        maxSimultaneousLights: number;
        /**
         * If sets to true, x component of normal map value will invert (x = 1.0 - x).
         */
        invertNormalMapX: boolean;
        /**
         * If sets to true, y component of normal map value will invert (y = 1.0 - y).
         */
        invertNormalMapY: boolean;
        private _renderTargets;
        private _worldViewProjectionMatrix;
        private _globalAmbientColor;
        private _tempColor;
        private _renderId;
        private _defines;
        private _cachedDefines;
        private _useLogarithmicDepth;
        private _shaderPath;
        private _options;
        private _textures;
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
        private _cachedWorldViewMatrix;
        private _controller;
        private _started;
        private _instance;
        private _register;
        private _before;
        private _after;
        private _dispose;
        readonly options: any;
        readonly controller: string;
        readonly textures: {
            [name: string]: BABYLON.Texture;
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
        readonly cachedWorldViewMatrix: BABYLON.Matrix;
        readonly shaderPath: any;
        readonly renderId: number;
        private _maxTexturesImageUnits;
        readonly maxTexturesImageUnits: number;
        private _maxVertexUniformVectors;
        readonly maxVertexUniformVectors: number;
        private _maxFragmentUniformVectors;
        readonly maxFragmentUniformVectors: number;
        /**
         * Instantiates a new UniversalShaderMaterial instance.
         *
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        constructor(name: string, scene: BABYLON.Scene, shaderPath: any, options: any, controller?: string);
        getClassName(): string;
        useLogarithmicDepth: boolean;
        needAlphaBlending(): boolean;
        needAlphaTesting(): boolean;
        private _shouldUseAlphaFromAlbedoTexture();
        getAlphaTestTexture(): BABYLON.BaseTexture;
        private _checkAttribute(attribName);
        private _checkUniform(uniformName);
        private _checkSampler(samplerName);
        setTexture(name: string, texture: BABYLON.Texture): BABYLON.UniversalShaderMaterial;
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
        private _checkCache(scene, mesh?, useInstances?);
        private convertColorToLinearSpaceToRef(color, ref);
        private static convertColorToLinearSpaceToRef(color, ref, useScalarInLinear);
        private static _scaledAlbedo;
        private static _scaledReflectivity;
        private static _scaledEmissive;
        private static _scaledReflection;
        static BindLights(scene: BABYLON.Scene, mesh: BABYLON.AbstractMesh, effect: BABYLON.Effect, defines: BABYLON.MaterialDefines, useScalarInLinearSpace: boolean, maxSimultaneousLights: number, usePhysicalLightFalloff: boolean): void;
        isReady(mesh?: BABYLON.AbstractMesh, useInstances?: boolean): boolean;
        unbind(): void;
        bindOnlyWorldMatrix(world: BABYLON.Matrix): void;
        private _myScene;
        private _myShadowGenerator;
        bind(world: BABYLON.Matrix, mesh?: BABYLON.Mesh): void;
        getAnimatables(): BABYLON.IAnimatable[];
        dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void;
        clone(name: string): BABYLON.UniversalShaderMaterial;
        serialize(): any;
        static Parse(source: any, scene: BABYLON.Scene, rootUrl: string): BABYLON.UniversalShaderMaterial;
        private registerInstance(me);
        private updateInstance(me);
        private afterInstance(me);
        private disposeInstance(me);
    }
}
