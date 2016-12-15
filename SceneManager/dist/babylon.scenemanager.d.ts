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
        private _manager;
        private _owned;
        constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, host: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        scene: BABYLON.Scene;
        engine: BABYLON.Engine;
        start(): void;
        update(): void;
        after(): void;
        destroy(): void;
        manager: BABYLON.SceneManager;
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
        getMetadata(): BABYLON.ObjectMetadata;
        findComponent(klass: string): BABYLON.SceneComponent;
        findComponents(klass: string): BABYLON.SceneComponent[];
        private registerInstance(instance);
        private updateInstance(instance);
        private afterInstance(instance);
        private disposeInstance(instance);
    }
    abstract class CameraComponent extends BABYLON.SceneComponent {
        private _camera;
        constructor(owner: BABYLON.UniversalCamera, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        camera: BABYLON.UniversalCamera;
    }
    abstract class LightComponent extends BABYLON.SceneComponent {
        private _light;
        constructor(owner: BABYLON.Light, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
        light: BABYLON.Light;
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
        mesh: BABYLON.AbstractMesh;
        hasCollisionMesh(): boolean;
        getCollisionMesh(): BABYLON.AbstractMesh;
        setIntersectionMeshes(meshes: BABYLON.AbstractMesh[]): void;
        clearIntersectionList(): void;
        private updateIntersectionList();
    }
    abstract class SceneController extends BABYLON.MeshComponent {
        abstract ready(): void;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, enableUpdate?: boolean, propertyBag?: any);
    }
    class ObjectMetadata {
        type: string;
        objectId: string;
        objectName: string;
        tagName: string;
        layerIndex: number;
        layerName: string;
        areaIndex: number;
        navAgent: BABYLON.INavigationAgent;
        meshLink: BABYLON.INavigationLink;
        meshObstacle: BABYLON.INavigationObstacle;
        private _metadata;
        constructor(data: IObjectMetadata);
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
    }
    enum GamepadType {
        None = -1,
        Generic = 0,
        Xbox360 = 1,
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
        Backspace = 8,
        Tab = 9,
        Enter = 13,
        Shift = 16,
        Ctrl = 17,
        Alt = 18,
        Pause = 19,
        Break = 19,
        CapsLock = 20,
        Escape = 27,
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
    interface IObjectMetadata {
        api: boolean;
        type: string;
        objectName: string;
        objectId: string;
        tagName: string;
        layerIndex: number;
        layerName: string;
        areaIndex: number;
        navAgent: BABYLON.INavigationAgent;
        meshLink: BABYLON.INavigationLink;
        meshObstacle: BABYLON.INavigationObstacle;
        components: BABYLON.IScriptComponent[];
        properties: any;
    }
    class UserInputOptions {
        static JoystickRightHandleColor: string;
        static JoystickLeftSensibility: number;
        static JoystickRightSensibility: number;
        static JoystickDeadStickValue: number;
        static JoystickLStickXInverted: boolean;
        static JoystickLStickYInverted: boolean;
        static JoystickRStickXInverted: boolean;
        static JoystickRStickYInverted: boolean;
        static JoystickAngularSensibility: number;
        static JoystickMovementSensibility: number;
        static GamepadDeadStickValue: number;
        static GamepadLStickXInverted: boolean;
        static GamepadLStickYInverted: boolean;
        static GamepadRStickXInverted: boolean;
        static GamepadRStickYInverted: boolean;
        static GamepadAngularSensibility: number;
        static GamepadMovementSensibility: number;
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
        onrender: () => void;
        controller: BABYLON.SceneController;
        private _ie;
        private _url;
        private _filename;
        private _render;
        private _running;
        private _markup;
        private _gui;
        private _input;
        private _scene;
        private _navmesh;
        private _navigation;
        private static keymap;
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
        private static previousPosition;
        private static preventDefault;
        private static rightHanded;
        private static loader;
        constructor(rootUrl: string, file: string, scene: BABYLON.Scene);
        ie: boolean;
        url: string;
        dispose(): void;
        isRunning(): boolean;
        loadLevel(name: string, path?: string): void;
        toggleDebug(): void;
        getSceneName(): string;
        getScenePath(): string;
        getSceneMetadata(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ObjectMetadata;
        showFullscreen(): void;
        start(): void;
        stop(): void;
        toggle(): void;
        stepFrame(): void;
        pauseAudio(): void;
        resumeAudio(): void;
        getGuiMode(): string;
        getSceneMarkup(): string;
        drawSceneMarkup(markup: string): void;
        clearSceneMarkup(): void;
        hasCollisionMesh(owner: BABYLON.AbstractMesh): boolean;
        getCollisionMesh(owner: BABYLON.AbstractMesh): BABYLON.AbstractMesh;
        addSceneComponent(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, klass: string, enableUpdate?: boolean, propertyBag?: any): BABYLON.SceneComponent;
        findSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.SceneComponent;
        findSceneComponents(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.SceneComponent[];
        findSceneController(): BABYLON.SceneController;
        createSceneController(klass: string): BABYLON.SceneController;
        resetUserInput(): void;
        enableUserInput(options?: {
            preventDefault?: boolean;
            useCapture?: boolean;
            virtualJoystick?: boolean;
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
        getLeftVirtualJoystick(): BABYLON.VirtualJoystick;
        getRightVirtualJoystick(): BABYLON.VirtualJoystick;
        disposeVirtualJoysticks(): void;
        updateCameraPosition(camera: BABYLON.FreeCamera, horizontal: number, vertical: number, speed: number): void;
        updateCameraRotation(camera: BABYLON.FreeCamera, mousex: number, mousey: number, speed: number): void;
        updateCameraUserInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number): void;
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
        private static destroySceneComponents(owner, destroyMetadata?);
        private static createGroundTerrain(name, url, options, scene);
        private static parseTerrainHeightmap(options);
        private static createComponentClass(klass);
        private static createObjectFromString(str, type);
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
        mesh: BABYLON.AbstractMesh;
        info: BABYLON.INavigationAgent;
        hasAgentInfo: boolean;
        setDestination(destination: BABYLON.Vector3): void;
    }
}
