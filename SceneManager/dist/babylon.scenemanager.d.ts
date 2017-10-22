declare module BABYLON {
    abstract class SceneComponent {
        register: () => void;
        dispose: () => void;
        protected tick: boolean;
        protected start(): void;
        protected update(): void;
        protected after(): void;
        protected destroy(): void;
        private _engine;
        private _scene;
        private _before;
        private _after;
        private _started;
        private _initialized;
        private _properties;
        private _manager;
        protected owned: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light;
        constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
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
        private init();
        private registerInstance(instance);
        private updateInstance(instance);
        private afterInstance(instance);
        private disposeInstance(instance);
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
        onIntersectionEnter: (mesh: BABYLON.AbstractMesh) => void;
        onIntersectionStay: (mesh: BABYLON.AbstractMesh) => void;
        onIntersectionExit: (mesh: BABYLON.AbstractMesh) => void;
        intersectionPrecision: BABYLON.IntersectionPrecision;
        private _intersections;
        private _intersecting;
        private _intersector;
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
        onCollisionEvent(handler: (collider: BABYLON.AbstractMesh, tag: string) => void): void;
        getCollisionEventHandler(): (collider: BABYLON.AbstractMesh, tag: string) => void;
        private updatePhysicsCollisionEvent(collider, collidedAgainst);
        /***********************************/
        /***********************************/
        addIntersectionMesh(mesh: BABYLON.AbstractMesh): void;
        addIntersectionMeshes(meshes: BABYLON.AbstractMesh[]): void;
        removeIntersectionMesh(mesh: BABYLON.AbstractMesh): void;
        getIntersectionList(): BABYLON.IIntersectionState[];
        resetIntersectionList(): void;
        private updateIntersectionList();
        /*************************************/
        /*************************************/
        private disposeSceneComponent();
    }
    class OrthoController extends BABYLON.CameraComponent {
        protected start(): void;
    }
    class SmoothTool {
        constructor();
        currentVelocity: number;
        /** Gradually changes a value towards a desired goal over time.
         * The value is smoothed by some spring-damper like function, which will never overshoot.
         * The function can be used to smooth any kind of value, positions, colors, scalars.
         * SmoothTool.currentVelocity  - The current velocity, this value is modified by the function every time you call it.
         *
         * current	        - The current position.
         * target	        - The position we are trying to reach.
         * smoothTime       - Approximately the time it will take to reach the target. A smaller value will reach the target faster.
         * deltaTime    	- The time since the last call to this function.
         * maxSpeed	        - Optionally allows you to clamp the maximum speed.
         */
        SmoothDamp(current: number, target: number, smoothTime: number, deltaTime: number, maxSpeed?: number): number;
        /**
         * Gradually changes an angle given in degrees towards a desired goal angle over time.
         * The value is smoothed by some spring-damper like function.
         * The function can be used to smooth any kind of value, positions, colors, scalars.
         * The most common use is for smoothing a follow camera.
         * SmoothTool.currentVelocity  - The current velocity, this value is modified by the function every time you call it.
         *
         * current	        - The current position.
         * target	        - The position we are trying to reach.
         * smoothTime       - Approximately the time it will take to reach the target. A smaller value will reach the target faster.
         * deltaTime    	- The time since the last call to this function.
         * maxSpeed	        - Optionally allows you to clamp the maximum speed.
         */
        SmoothDampAngle(current: number, target: number, smoothTime: number, deltaTime: number, maxSpeed?: number): number;
    }
    class MeshRotator {
        private _owned;
        slerpIdentity: BABYLON.Quaternion;
        constructor(owner: BABYLON.AbstractMesh);
        /** Rotates the mesh using rotation quaternions */
        rotate(x: number, y: number, z: number, order?: BABYLON.RotateOrder): BABYLON.AbstractMesh;
        /** Rotates the mesh so the forward vector points at a target position using rotation quaternions. (Options: Y-Yall, X-Pitch, Z-Roll) */
        lookAtPosition(position: BABYLON.Vector3, slerp?: number, yawCor?: number, pitchCor?: number, rollCor?: number, space?: BABYLON.Space): BABYLON.AbstractMesh;
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
        readonly socketList: BABYLON.ISocketData[];
        setProperty(name: string, propertyValue: any): void;
        getProperty<T>(name: string, defaultValue?: T): T;
    }
    class MachineState {
        tag: string;
        time: number;
        name: string;
        type: BABYLON.MotionType;
        motion: string;
        branch: string;
        rate: number;
        length: number;
        layer: string;
        index: number;
        machine: string;
        interupted: boolean;
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
        animations: BABYLON.Animatable[];
        transitions: BABYLON.ITransition[];
        customCurves: any[];
        constructor();
    }
    class TransitionCheck {
        result: string;
        offest: number;
        blending: number;
        triggered: string[];
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
    enum Constants {
        Deg2Rad = 0.0174532924,
        Rad2Deg = 57.29578,
        DiagonalSpeed = 0.7071,
        MinimumTimeout = 0.25,
    }
    enum SearchType {
        ExactMatch = 0,
        StartsWith = 1,
        EndsWith = 2,
        IndexOf = 3,
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
    interface ITransition {
        anyState: boolean;
        indexLayer: number;
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
        mode: BABYLON.ConditionMode;
        parameter: string;
        threshold: number;
    }
    interface IBlendTree {
        name: string;
        state: string;
        children: BABYLON.IBlendTreeChild[];
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
    }
    interface IBlendTreeChild {
        cycleOffset: number;
        directBlendParameter: string;
        mirror: boolean;
        type: BABYLON.MotionType;
        motion: string;
        position: number[];
        threshold: number;
        timescale: number;
        subtree: BABYLON.IBlendTree;
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
        prefabName: string;
        prefabPositionX: number;
        prefabPositionY: number;
        prefabPositionZ: number;
        prefabRotationX: number;
        prefabRotationY: number;
        prefabRotationZ: number;
    }
    interface IAnimationClip {
        type: string;
        name: string;
        start: number;
        stop: number;
        rate: boolean;
        behavior: number;
        playback: number;
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
    class SceneManager {
        /** Get main singleton instance of the scene manager. */
        static GetInstance(): BABYLON.SceneManager;
        /** Creates a new scene and pre parses metadata. */
        static CreateScene(engine: BABYLON.Engine): BABYLON.Scene;
        /** Registers the scene loader function handler. */
        static RegisterLoader(handler: (root: string, name: string) => void): void;
        /** Registers a function handler to be executed when scene is ready. */
        static ExecuteWhenReady(func: (scene: BABYLON.Scene, manager: BABYLON.SceneManager) => void): void;
        /** Creates and registers a new scene manager session instance */
        static CreateManagerSession(rootUrl: any, scene: BABYLON.Scene): BABYLON.SceneManager;
        static readonly StaticIndex: number;
        static readonly PrefabIndex: number;
        onrender: () => void;
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
        private _mainCamera;
        private _loadQueueIndex;
        private _loadQueueCount;
        private _loadQueueScenes;
        private _localReadyState;
        private _localSceneReady;
        protected updateCamera: BABYLON.FreeCamera;
        protected updateCameraInput: boolean;
        protected cameraInputMoveSpeed: number;
        protected cameraInputRotateSpeed: number;
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
        private static g_mousex;
        private static g_mousey;
        private static g_vertical;
        private static g_horizontal;
        private static engine;
        private static orphans;
        private static gamepad;
        private static gamepadType;
        private static gamepadManager;
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
        private static showDebugSockets;
        private static colliderVisibility;
        private static socketColliderSize;
        private static staticVertexLimit;
        private static previousPosition;
        private static preventDefault;
        private static rightHanded;
        private static loader;
        readonly ie: boolean;
        readonly url: string;
        readonly time: number;
        readonly deltaTime: number;
        getScene(): BABYLON.Scene;
        private static readies;
        constructor(rootUrl: string, scene: BABYLON.Scene);
        dispose(): void;
        /** Execute a function once during render loop. */
        once(func: () => void): void;
        /** Delays a function call using window.setTimeeout. */
        delay(func: () => void, timeout: number): number;
        /** Repeats a function call using window.setInterval. */
        repeat(func: () => void, interval: number): number;
        /** Clears window.setInterval handle. */
        clear(handle: number): void;
        /** Enables time managment in scene. */
        enableTime(): void;
        /** Disables time managment in scene. */
        disableTime(): void;
        /** Load a new level into scene. */
        loadLevel(name: string, path?: string): void;
        /** Import meshes info current scene. */
        importMeshes(filename: string, onsuccess?: () => void, onprogress?: () => void, onerror?: (scene: BABYLON.Scene, message: string, exception: any) => void): void;
        /** Safely destroys a scene object. */
        safeDestroy(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, delay?: number, disable?: boolean): void;
        /** Get the scene formatted name. */
        getSceneName(): string;
        /** Gets the formatted scene path. */
        getScenePath(): string;
        /** Gets the scene main camera by tag */
        getMainCamera(): BABYLON.Camera;
        /** Enters browser full screen mode. */
        showFullscreen(element?: HTMLElement): void;
        /** Exits browser full screen mode. */
        exitFullscreen(): void;
        /** Shows the index page loading screen. */
        showLoadingScreen(title?: string, status?: string, manual?: boolean): void;
        /** Freezes the index page loading screen. */
        freezeLoadingScreen(title?: string, status?: string, manual?: boolean): void;
        /** Hides the index page loading screen. */
        hideLoadingScreen(manual?: boolean): void;
        /** Update the index page loading status text. */
        updateLoadingStatus(status: string): void;
        /** Is scene running flag. */
        isRunning(): boolean;
        /** Is mobile platform flag. */
        isMobile(): boolean;
        /** Internal on ready function list. */
        private _onready;
        private onready(func);
        private _executeWhenReady();
        private _executeLocalReady();
        private _loadQueueImports();
        /** Starts the scene render loop. */
        start(): void;
        /** Stops the scene render loop. */
        stop(): void;
        /** Toggle the scene render loop on and off. */
        toggle(): void;
        /** Steps the scene render loop frame at a time. */
        stepFrame(): void;
        /** Pauses the scene audio tracks. */
        pauseAudio(): void;
        /** Resumes the scene audio tracks. */
        resumeAudio(): void;
        /** Toggle debug layer on and off. */
        toggleDebug(popups?: boolean, tab?: number, parent?: HTMLElement): void;
        /** Gets the scene built-in gui mode. */
        getGuiMode(): string;
        /** Gets the index page main gui element. */
        getGuiElement(): Element;
        /** Get the scene html markup text. */
        getSceneMarkup(): string;
        /** Draws the scene html markup text. */
        drawSceneMarkup(markup: string): void;
        /** Clears the scene markup text. */
        clearSceneMarkup(): void;
        rayCast(ray: BABYLON.Ray, predicate?: (mesh: Mesh) => boolean, fastCheck?: boolean): BABYLON.PickingInfo;
        multiRayCast(ray: BABYLON.Ray, predicate?: (mesh: Mesh) => boolean): BABYLON.PickingInfo[];
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
        /** Plays the specified animation clip on the owner object, Optional include all decendents. */
        playAnimationClip(clip: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, blending?: number, speed?: number, decendants?: boolean, onAnimationEnd?: () => void): BABYLON.Animatable[];
        private setupAnimationProperties(owner, behavior, blending);
        /** Applies force to owner using physics imposter. */
        applyForce(owner: BABYLON.AbstractMesh, force: BABYLON.Vector3, contact: BABYLON.Vector3): void;
        /** Applies impulse to owner using physics imposter. */
        applyImpulse(owner: BABYLON.AbstractMesh, impusle: BABYLON.Vector3, contact: BABYLON.Vector3): void;
        /** Applies friction to owner using physics imposter. */
        applyFriction(owner: BABYLON.AbstractMesh, friction: number): void;
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
        /** Checks collision contact of the owner using physics imposter. */
        checkCollisionContact(owner: BABYLON.AbstractMesh, collider: BABYLON.AbstractMesh, contact: BABYLON.CollisionContact, threashold?: number): boolean;
        /** Moves owner using collisions. */
        moveWithCollisions(owner: BABYLON.AbstractMesh, velocity: BABYLON.Vector3, rotation?: number): void;
        /** Moves owner using positions. */
        moveWithTranslation(owner: BABYLON.AbstractMesh, velocity: BABYLON.Vector3, rotation?: number): void;
        /** Adds a managed scene component to the scene. */
        addSceneComponent(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, enableUpdate?: boolean, propertyBag?: any): BABYLON.SceneComponent;
        /** Finds a scene component in the scene with the specfied klass name. */
        findSceneComponent<T extends BABYLON.SceneComponent>(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): T;
        /** Finds all scene components in the scene with the specfied klass name. */
        findSceneComponents<T extends BABYLON.SceneComponent>(klass: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): T[];
        /** Finds the owner object metedata in the scene. */
        findSceneMetadata(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.ObjectMetadata;
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
        findSceneAnimationClip(clip: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.IAnimationClip;
        /** Finds all animations clips of owner in the scene. */
        findSceneAnimationClips(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.IAnimationClip[];
        /** Finds the specfied particle system of owner in the scene. */
        findSceneParticleSystem(name: string, owner: BABYLON.AbstractMesh | BABYLON.Vector3): BABYLON.IParticleSystem;
        /** Finds all the particle systems of owner in the scene. */
        findSceneParticleSystems(owner: BABYLON.AbstractMesh | BABYLON.Vector3): BABYLON.IParticleSystem[];
        /** Finds the specfied lens flare system of owner in the scene. */
        findSceneLensFlareSystem(name: string, owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.LensFlareSystem;
        /** Finds all the lens flare systems of owner in the scene. */
        findSceneLensFlareSystems(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light): BABYLON.LensFlareSystem[];
        /** Reset all user input state in the scene. */
        resetUserInput(): void;
        /** Enables user input state in the scene. */
        enableUserInput(options?: {
            preventDefault?: boolean;
            useCapture?: boolean;
            enableVirtualJoystick?: boolean;
            disableRightStick?: boolean;
            gamepadConnected?: (pad: BABYLON.Gamepad, kind: BABYLON.GamepadType) => void;
        }): void;
        /** Disables user input state in the scene. */
        disableUserInput(useCapture?: boolean): void;
        /** Get current user input state from the scene. */
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
        getLeftJoystick(): BABYLON.VirtualJoystick;
        getRightJoystick(): BABYLON.VirtualJoystick;
        getJoystickPress(button: number): boolean;
        disposeVirtualJoysticks(): void;
        updateCameraPosition(camera: BABYLON.FreeCamera, horizontal: number, vertical: number, speed: number): void;
        updateCameraRotation(camera: BABYLON.FreeCamera, mousex: number, mousey: number, speed: number): void;
        updateCameraUserInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number): void;
        enableAutoCameraUserInput(camera: BABYLON.FreeCamera, movementSpeed: number, rotationSpeed: number): void;
        clearAutoCameraUserInput(): void;
        private autoUpdateCameraUserInput();
        getNavigationTool(): Navigation;
        getNavigationZone(): string;
        findNavigationPath(origin: BABYLON.Vector3, destination: BABYLON.Vector3): BABYLON.Vector3[];
        hasNavigationMesh(): boolean;
        getNavigationMesh(): BABYLON.AbstractMesh;
        buildNavigationMesh(mesh: BABYLON.AbstractMesh): any;
        getNavigationPoint(position: BABYLON.Vector3, raise?: number, length?: number): BABYLON.Vector3;
        moveNavigationAgent(agent: BABYLON.AbstractMesh, path: BABYLON.Vector3[], speed?: number, loop?: boolean, callback?: () => void): void;
        getNavigationAgents(): BABYLON.Mesh[];
        getNavigationAgentInfo(agent: BABYLON.AbstractMesh): BABYLON.NavigationAgent;
        getNavigationAreaTable(): BABYLON.INavigationArea[];
        getNavigationAreaIndexes(): number[];
        getNavigationAreaName(index: number): string;
        getNavigationAreaCost(index: number): number;
        private static inputKeyDownHandler(e);
        private static inputKeyUpHandler(e);
        private static inputPointerWheelHandler(e);
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
        private static inputGamepadConnected(pad, state);
        private static inputVirtualJoysticks();
        private static updateUserInput();
        private static parseSceneMetadata(rootUrl, scene);
        private static parseMeshMetadata(meshes, scene);
        private static parseSceneCameras(cameras, scene, ticklist);
        private static parseSceneLights(lights, scene, ticklist);
        private static parseSceneMeshes(meshes, scene, ticklist);
        private static postParseSceneMeshes(meshes, scene);
        private static setupLodGroups(mesh, scene, prefab);
        private static setupTerrainMeshes(mesh, scene);
        private static setupSocketMeshes(mesh, scene);
        private static setupSharedSkeleton(mesh, scene);
        private static setupPhysicsImpostor(physicsMesh, plugin, friction, collisions, rotation);
        private static setupCameraRigOptions(camera, scene, ticklist);
        private static setupAnimationState(owner, scene);
        private static locateOwnerSocketMesh(name, owner, searchType?);
        private static locateOwnerSocketMeshes(owner);
        private static locateOwnerAnimationTrack(index, owner, directDecendantsOnly?, predicate?);
        static DestroyComponents(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, destroyMetadata?: boolean): void;
        static SetAnimationBlending(owner: BABYLON.IAnimatable, blendingSpeed: number): void;
        static SetSkeletonBlending(skeleton: BABYLON.Skeleton, blendingSpeed: number): void;
        static SetAnimationLooping(owner: BABYLON.IAnimatable, loopBehavior: number): void;
        static SetSkeletonLooping(skeleton: BABYLON.Skeleton, loopBehavior: number): void;
        static SetAnimationProperties(owner: BABYLON.IAnimatable, loopBehavior: number, blendingSpeed: number): void;
        static SetSkeletonProperties(skeleton: BABYLON.Skeleton, loopBehavior: number, blendingSpeed: number): void;
        static FindMesh(name: string, meshes: BABYLON.AbstractMesh[], searchType?: BABYLON.SearchType): BABYLON.AbstractMesh;
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
    class UniversalParticleSystem extends BABYLON.MeshComponent {
        private _time;
        private _auto;
        private _shader;
        private _effect;
        private _shuriken;
        updateTime: boolean;
        maximumTime: number;
        readonly shuriken: BABYLON.ShurikenParticleSystem;
        constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
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
        setTexture(name: string, texture: BABYLON.Texture): BABYLON.UniversalParticleSystem;
        setTextureArray(name: string, textures: BABYLON.Texture[]): BABYLON.UniversalParticleSystem;
        setFloat(name: string, value: number): BABYLON.UniversalParticleSystem;
        setFloats(name: string, value: number[]): BABYLON.UniversalParticleSystem;
        setColor3(name: string, value: BABYLON.Color3): BABYLON.UniversalParticleSystem;
        setColor4(name: string, value: BABYLON.Color4): BABYLON.UniversalParticleSystem;
        setVector2(name: string, value: BABYLON.Vector2): BABYLON.UniversalParticleSystem;
        setVector3(name: string, value: BABYLON.Vector3): BABYLON.UniversalParticleSystem;
        setVector4(name: string, value: BABYLON.Vector4): BABYLON.UniversalParticleSystem;
        setMatrix(name: string, value: BABYLON.Matrix): BABYLON.UniversalParticleSystem;
        setMatrix3x3(name: string, value: Float32Array): BABYLON.UniversalParticleSystem;
        setMatrix2x2(name: string, value: Float32Array): BABYLON.UniversalParticleSystem;
        setArray3(name: string, value: number[]): BABYLON.UniversalParticleSystem;
        private getEffectTime();
        private setEffectTime(time);
        private bindParticleSystemEffect(me, effect);
        private initializeParticleSystem();
    }
}

declare module BABYLON {
    class CharacterController extends BABYLON.MeshComponent {
        movementType: number;
        avatarHeight: number;
        avatarRadius: number;
        fallingVelocity: number;
        slidingVelocity: number;
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
        rotate(speed: number): void;
    }
}

declare module BABYLON {
    class ToolkitPlugin {
        static Loader: BABYLON.ISceneLoaderPlugin;
        static Warning(message: string): void;
    }
    class JsonSceneLoader implements ISceneLoaderPlugin {
        constructor();
        name: string;
        extensions: BABYLON.ISceneLoaderPluginExtensions;
        load(scene: BABYLON.Scene, data: any, rootUrl: string): boolean;
        importMesh(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]): boolean;
    }
    class BinarySceneLoader implements ISceneLoaderPlugin {
        constructor();
        name: string;
        extensions: BABYLON.ISceneLoaderPluginExtensions;
        load(scene: BABYLON.Scene, data: any, rootUrl: string): boolean;
        importMesh(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.ParticleSystem[], skeletons: BABYLON.Skeleton[]): boolean;
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
        constructor(name: string, scene: BABYLON.Scene, tick?: boolean);
        clone(name: string): BABYLON.UniversalTerrainMaterial;
        serialize(): any;
        static Parse(source: any, scene: BABYLON.Scene, rootUrl: string): BABYLON.UniversalTerrainMaterial;
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
    class ShurikenParticleSystem extends BABYLON.ParticleSystem {
        static readonly EMISSION_RATE: number;
        static readonly EMISSION_BURST: number;
        emitType: number;
        loopPlay: boolean;
        delayTime: number;
        private _duration;
        private _startSpeed;
        private _enableTime;
        private _cycleHandler;
        private _emissionBurst;
        private _updateModules;
        readonly modules: BABYLON.ShurikenUpdateModules;
        constructor(name: string, capacity: number, scene: BABYLON.Scene, duration?: number, emission?: number, startSpeed?: number, emissionBurst?: BABYLON.IShurikenBusrt[], updateModules?: BABYLON.ShurikenUpdateModules, customEffect?: BABYLON.Effect);
        /** Babylon Particle System Overrides */
        start(): void;
        stop(): void;
        dispose(): void;
        private readonly internalScene;
        private internalPlay(delay?, min?, max?);
        private internalCycle();
        private internalStart(min, max);
        private internalStop(force?);
        getParticles(): Array<Particle>;
        readonly stockParticles: Array<Particle>;
        readonly scaledUpdateSpeed: number;
        readonly scaledDirection: Vector3;
        readonly scaledColorStep: Color4;
        readonly scaledGravity: Vector3;
        recycleParticle(particle: Particle): void;
        defaultStartDirectionFunctionHandler(emitPower: number, worldMatrix: BABYLON.Matrix, directionToUpdate: BABYLON.Vector3, particle: BABYLON.Particle): void;
        defaultStartPositionFunctionHandler(worldMatrix: BABYLON.Matrix, positionToUpdate: BABYLON.Vector3, particle: BABYLON.Particle): void;
        defaultUpdateOverTimeFunctionHandler(particles: BABYLON.Particle[]): void;
    }
    class ShurikenUpdateModules {
        updateOverTime: boolean;
        framesPerSecond: number;
        speedModule: any;
        emissionModule: any;
        velocityModule: any;
        colorModule: any;
        sizingModule: any;
        rotationModule: any;
        updateEffectTime: boolean;
        maximumEffectTime: number;
    }
}

declare module BABYLON {
    class AnimationState extends BABYLON.SceneComponent {
        private static EXIT;
        private _state;
        private _speed;
        private _entry;
        private _machine;
        private _enabled;
        private _handlers;
        private _blending;
        private _autoplay;
        private _executed;
        private _checkers;
        private _rootSpeed;
        private _rootRotation;
        private _rootVelocity;
        autoTicking: boolean;
        readonly executing: boolean;
        onStateChanged: () => void;
        constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, scene: BABYLON.Scene, tick?: boolean, propertyBag?: any);
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        tickStateMachine(): void;
        getNumber(name: string): number;
        setNumber(name: string, value: number): void;
        getBoolean(name: string): boolean;
        setBoolean(name: string, value: boolean): void;
        getTrigger(name: string): boolean;
        setTrigger(name: string): void;
        resetTrigger(name: string): void;
        getCurrentState(): BABYLON.MachineState;
        setCurrentState(name: string, blending?: number): void;
        onAnimationEvent(name: string, handler: (evt: BABYLON.IAnimationEvent) => void): void;
        getAnimationEventHandler(name: string): (evt: BABYLON.IAnimationEvent) => void;
        getRootMotionSpeed(): number;
        getRootMotionRotation(): number;
        getRootMotionVelocity(): BABYLON.Vector3;
        private startStateMachine();
        private updateStateMachine();
        private checkStateTransitions(transitions, time, length, rate, index);
        private getMachineStateInfo(name);
        private setCurrentMachineState(name, blending);
        private resetMachineState(state);
        private destroyStateMachine();
        private updateBlendingTree();
        private getBlendTreeBranch(tree);
        private validateRootMotion();
    }
}

declare module BABYLON {
    class Utilities {
        /** TODO: angle */
        static Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number;
        /** Returns a new Quaternion set from the passed Euler float angles (x, y, z). */
        static Euler(eulerX: number, eulerY: number, eulerZ: number): BABYLON.Quaternion;
        /** Returns a new Quaternion set from the passed Euler float angles (x, y, z). */
        static EulerToRef(eulerX: number, eulerY: number, eulerZ: number, result: BABYLON.Quaternion): void;
        /** Returns a new Matrix as a rotation matrix from the Euler angles (x, y, z). */
        static Matrix(eulerX: number, eulerY: number, eulerZ: number): BABYLON.Matrix;
        /** Returns a new Matrix as a rotation matrix from the Euler angles (x, y, z). */
        static MatrixToRef(eulerX: number, eulerY: number, eulerZ: number, result: BABYLON.Matrix): void;
        /** TODO: clamp angle */
        static ClampAngle(angle: number, min: number, max: number): number;
        /** Multplies a quaternion by a vector (rotates vector) */
        static RotateVector(vec: BABYLON.Vector3, quat: BABYLON.Quaternion): BABYLON.Vector3;
        /** Multplies a quaternion by a vector (rotates vector) */
        static RotateVectorToRef(vec: BABYLON.Vector3, quat: BABYLON.Quaternion, result: BABYLON.Vector3): void;
        /** TODO: move towards vector */
        static MoveTowardsVector(current: BABYLON.Vector3, target: BABYLON.Vector3, maxDistanceDelta: number): BABYLON.Vector3;
        /** TODO: move torward angle */
        static MoveTowardsAngle(current: number, target: number, maxDelta: number): number;
        /** Transforms position from local space to world space. */
        static TransformPosition(owner: BABYLON.AbstractMesh | BABYLON.Camera, position: BABYLON.Vector3): BABYLON.Vector3;
        /** Transforms position from local space to world space. */
        static TransformPositionToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, position: BABYLON.Vector3, result: BABYLON.Vector3): void;
        /** Transforms direction from local space to world space. */
        static TransformDirection(owner: BABYLON.AbstractMesh | BABYLON.Camera, direction: BABYLON.Vector3): BABYLON.Vector3;
        /** Transforms direction from local space to world space. */
        static TransformDirectionToRef(owner: BABYLON.AbstractMesh | BABYLON.Camera, direction: BABYLON.Vector3, result: BABYLON.Vector3): void;
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
        /** Computes the Quaternion forward vector */
        static GetQuaternionForwardVector(quat: Quaternion): BABYLON.Vector3;
        /** Computes the Quaternion forward vector */
        static GetQuaternionForwardVectorToRef(quat: Quaternion, result: BABYLON.Vector3): void;
        /** Computes the Quaternion right vector */
        static GetQuaternionRightVector(quat: Quaternion): BABYLON.Vector3;
        /** Computes the Quaternion right vector */
        static GetQuaternionRightVectorToRef(quat: Quaternion, result: BABYLON.Vector3): void;
        /** Computes the Quaternion up vector */
        static GetQuaternionUpVector(quat: Quaternion): BABYLON.Vector3;
        /** Computes the Quaternion up vector */
        static GetQuaternionUpVectorToRef(quat: Quaternion, result: BABYLON.Vector3): void;
        static ComputeBlendingSpeed(rate: number, duration: number): number;
        static ParseColor3(source: any, defaultValue?: BABYLON.Color3): BABYLON.Color3;
        static ParseColor4(source: any, defaultValue?: BABYLON.Color4): BABYLON.Color4;
        static ParseVector2(source: any, defaultValue?: BABYLON.Vector2): BABYLON.Vector2;
        static ParseVector3(source: any, defaultValue?: BABYLON.Vector3): BABYLON.Vector3;
        static ParseVector4(source: any, defaultValue?: BABYLON.Vector4): BABYLON.Vector4;
        static StartsWith(source: string, word: string): boolean;
        static EndsWith(source: string, word: string): boolean;
        static ReplaceAll(source: string, word: string, replace: string): string;
        static EncodeBinay(obj: any): Uint8Array;
        static DecodeBinary<T>(data: Uint8Array): T;
        static CompressToString(data: Uint8Array): string;
        static CompressToArray(data: Uint8Array): Uint8Array;
        static DecompressToString(data: Uint8Array): string;
        static DecompressToArray(data: Uint8Array): Uint8Array;
    }
}
