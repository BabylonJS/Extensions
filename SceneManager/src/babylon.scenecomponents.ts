module BABYLON {

    export abstract class SceneComponent {
        public register: () => void = null;
        public dispose: () => void = null;
        public tick: boolean = false;

        private _engine: BABYLON.Engine = null;
        private _scene: BABYLON.Scene = null;
        private _before: () => void = null;
        private _after: () => void = null;
        private _started: boolean = false;
        private _initialized: boolean = false;
        private _properties: any = null;
        private _handlers:any = null;
        private _manager: BABYLON.SceneManager = null;
        private _owned: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light = null;

        public constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, host: BABYLON.Scene, enableUpdate: boolean = true, propertyBag: any = {}) {
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (host == null) throw new Error("Null host scene obejct specified.");
            this.tick = enableUpdate;
            this._owned = owner;
            this._started = false;
            this._manager = null;
            this._handlers = {};
            this._initialized = false;
            this._properties = propertyBag;
            this._engine = host.getEngine();
            this._scene = host;

            /* Scene Component Instance Handlers */
            var instance: BABYLON.SceneComponent = this;
            instance.register = function () { instance.registerInstance(instance); };
            instance._before = function () { instance.updateInstance(instance); };
            instance._after = function () { instance.afterInstance(instance); };
            instance.dispose = function () { instance.disposeInstance(instance); };
        }
        public get scene(): BABYLON.Scene { 
            return this._scene;
        }
        public get engine(): BABYLON.Engine { 
            return this._engine;
        }

        /* Scene Component Life Cycle Functions */
        public start(): void { }
        public update(): void { }
        public after(): void { }
        public destroy(): void { }

        /* Scene Component Helper Member Functions */
        public get manager(): BABYLON.SceneManager {
            if (this._manager == null) {
                this._manager = BABYLON.SceneManager.GetInstance(this.scene);
            }
            return this._manager;
        }
        public setProperty(name: string, propertyValue: any): void {
            if (this._properties != null) {
                this._properties[name] = propertyValue;
            }
        }
        public getProperty<T>(name: string, defaultValue: T = null): T {
            var result: any = null
            if (this._properties != null) {
                result = this._properties[name];
            }
            if (result == null) result = defaultValue;
            return (result != null) ? result as T : null;
        }
        public getMetadata(): BABYLON.ObjectMetadata {
            return this.manager.getOwnerMetadata(this._owned);
        }

        /* Scene Component Helper Animation Functions */
        public onAnimationEvent(name:string, handler:(evt:BABYLON.IAnimationStateEvent)=>void):void {
            if (name != null && name !== "") {
                this._handlers[name.toLowerCase()] = handler;
            }
        }

        /* Scene Component Helper Search Functions */
        public findComponent(klass: string): BABYLON.SceneComponent {
            return this.manager.findSceneComponent(klass, this._owned);
        }
        public findComponents(klass: string): BABYLON.SceneComponent[] {
            return this.manager.findSceneComponents(klass, this._owned);
        }
        public findParticleSystem(particleName:string): BABYLON.ParticleSystem {
            return this.manager.findSceneParticleSystem(particleName, this._owned);
        }
        public findParticleSystems(): BABYLON.ParticleSystem[] {
            return this.manager.findSceneParticleSystems(this._owned);
        }
        public findLensFlareSystem(flareName:string): BABYLON.LensFlareSystem {
            return this.manager.findSceneLensFlareSystem(flareName, this._owned);
        }
        public findLensFlareSystems(): BABYLON.LensFlareSystem[] {
            return this.manager.findSceneLensFlareSystems(this._owned);
        }

        /* Private Scene Component Instance Worker Functions */
        private registerInstance(instance: any): void {
            instance._scene.registerBeforeRender(instance._before);
            instance._scene.registerAfterRender(instance._after);
        }
        private updateInstance(instance: any): void {
            if (!instance._started) {
                /* First frame starts component */
                instance.start();
                instance._started = true;
            } else if (instance._started && instance.tick) {
                /* All other frames tick component */
                instance.update();
                /* Update instance intersection list */
                if (instance.updateIntersectionList) {
                    instance.updateIntersectionList();
                }
            }
        }
        private afterInstance(instance: any): void {
            if (instance._started && instance.tick) {
                instance.after();
            }
        }
        private disposeInstance(instance: any) {
            instance._scene.unregisterBeforeRender(instance._before);
            instance._scene.unregisterAfterRender(instance._after);
            if (instance.disposeSceneComponent) {
                instance.disposeSceneComponent();
            }
            instance.destroy();
            instance.tick = false;
            instance._started = false;
            instance._before = null;
            instance._after = null;
            instance._properties = null;
            instance._handlers = null
            instance._engine = null;
            instance._scene = null;
            instance._owned = null;
            instance._manager = null;
            instance.register = null;
            instance.dispose = null;
        }
    }

    export abstract class CameraComponent extends BABYLON.SceneComponent {
        private _camera: BABYLON.Camera = null;
        private _orthoSize:number = 0;
        private _orthoUpdate:boolean = false;
        public constructor(owner: BABYLON.Camera, scene: BABYLON.Scene, enableUpdate: boolean = true, propertyBag: any = {}) {
            super(owner, scene, enableUpdate, propertyBag);
            this._camera = owner;
        }
        public get camera():BABYLON.Camera {
            return this._camera;
        }
        public isHighDynamicRange(): boolean {
            return this.manager.isHighDynamicRangeCamera(this._camera);
        }
        public getRenderingPipeline(): BABYLON.HDRRenderingPipeline {
            return this.manager.getHighDynamicRangePipeline(this._camera);
        }
        private setupOrthographicCamera(size:number, updateOnResize:boolean):void {
            var result:boolean = false;
            if (this._camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
                this._orthoSize = size;
                this.updateOrthographicSize();
                if (this._orthoUpdate === false) {
                    this._orthoUpdate = updateOnResize;
                    if (this._orthoUpdate === true) {
                        window.addEventListener("resize", this.updateOrthographicSize);
                    }
                }
            }
        }
        private updateOrthographicSize():void {
            if (this._orthoSize !== 0) {
                var client:ClientRect = this.scene.getEngine().getRenderingCanvasClientRect();
                var aspect:number = client.width / client.height;
                var vertical:number = this._orthoSize;
                var horizontal:number = vertical * aspect;
                this._camera.orthoTop = vertical;
                this._camera.orthoBottom = -vertical;
                this._camera.orthoLeft = -horizontal;
                this._camera.orthoRight = horizontal;
            }
        }
        private disposeSceneComponent():void {
            if (this._orthoUpdate === true) {
                window.removeEventListener("resize", this.updateOrthographicSize);
                this._orthoUpdate = false;
                this._orthoSize = 0;
            }
            if (this._camera.metadata != null && this._camera.metadata.properties != null && this._camera.metadata.properties.hdrPipeline != null) {
                var pipeline:BABYLON.HDRRenderingPipeline = this._camera.metadata.properties.hdrPipeline as BABYLON.HDRRenderingPipeline;
                pipeline.dispose();
                pipeline = null;
                this._camera.metadata.properties.hdrPipeline = null;
            }
            this._camera = null;
        }        
    }

    export abstract class LightComponent extends BABYLON.SceneComponent {
        private _light: BABYLON.Light  = null;
        public constructor(owner: BABYLON.Light, scene: BABYLON.Scene, enableUpdate: boolean = true, propertyBag: any = {}) {
            super(owner, scene, enableUpdate, propertyBag);
            this._light = owner;
        }
        public get light():BABYLON.Light {
            return this._light;
        }
        private disposeSceneComponent():void {
            this._light = null;
        }        
    }

    export abstract class MeshComponent extends BABYLON.SceneComponent {
        public onIntersectionEnter: (mesh:BABYLON.AbstractMesh) => void = null;
        public onIntersectionStay: (mesh:BABYLON.AbstractMesh) => void = null;
        public onIntersectionExit: (mesh:BABYLON.AbstractMesh) => void = null;

        private _list:ICollisionState[] = [];
        private _mesh:BABYLON.AbstractMesh = null;
        private _collider:BABYLON.AbstractMesh = null;
        private _intersecting:boolean = false;

        public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, enableUpdate: boolean = true, propertyBag: any = {}) {
            super(owner, scene, enableUpdate, propertyBag);
            this._mesh = owner;
            this._intersecting = false;
        }
        public get mesh():BABYLON.AbstractMesh {
            return this._mesh;
        }
        public getChildMesh(name:string, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            return this.manager.getOwnerChildMesh(name, this._mesh, directDecendantsOnly, predicate);            
        }
        public getDetailMesh(directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            return this.manager.getOwnerDetailMesh(this._mesh, directDecendantsOnly, predicate);            
        }
        public getCollisionMesh(directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            return this.manager.getOwnerCollisionMesh(this._mesh, directDecendantsOnly, predicate);            
        }
        public setPhysicsCollisions(collisionTags:string[], collisionHandler:(collider:BABYLON.IPhysicsEnabledObject) => void):void {
            if (this._mesh.physicsImpostor != null) {
                (<any>this._mesh.physicsImpostor).onCollideEvent = this.processPhysicsCollisions;
            }
            if (this._mesh.metadata != null && this._mesh.metadata.api) {
                this._mesh.metadata.collisionTags = (collisionTags != null) ? collisionTags : [];
                this._mesh.metadata.collisionEvent = collisionHandler;
            }
        }
        public clearPhysicsCollisions():void {
            if (this._mesh.physicsImpostor != null) {
                (<any>this._mesh.physicsImpostor).onCollideEvent = null;
            }
            if (this._mesh.metadata != null && this._mesh.metadata.api) {
                this._mesh.metadata.collisionTags = [];
                this._mesh.metadata.collisionEvent = null;
            }
        }
        public setIntersectionMeshes(meshes:BABYLON.AbstractMesh[]):void {
            if (meshes != null) {
                meshes.forEach((mesh) => {
                    if (mesh != null) {
                        var collisionMesh:BABYLON.AbstractMesh = this.manager.getOwnerCollisionMesh(mesh);
                        if (collisionMesh != null) {
                            this._list.push({ mesh: collisionMesh, intersecting: false });
                        }
                    }
                });
            }
        }
        public clearIntersectionList():void {
            this._list = [];
        }
        private updateIntersectionList():void {
            if (this._collider == null) {
                this._collider = this.getCollisionMesh();
            }
            if (this._collider != null && this._list != null && this._list.length > 0) {
                this._list.forEach((collisionState) => {
                    if (collisionState.mesh != null) {
                        this._intersecting = this._collider.intersectsMesh(collisionState.mesh);
                        if (this._intersecting) {
                            if (!collisionState.intersecting) {
                                if (this.onIntersectionEnter != null) {
                                    this.onIntersectionEnter(collisionState.mesh);
                                }
                            } else {
                                if (this.onIntersectionStay != null) {
                                    this.onIntersectionStay(collisionState.mesh);
                                }
                            }
                        } else {
                            if (collisionState.intersecting) {
                                if (this.onIntersectionExit != null) {
                                    this.onIntersectionExit(collisionState.mesh);
                                }
                            }
                        }
                        collisionState.intersecting = this._intersecting;
                    }
                });
            }
        }
        private processPhysicsCollisions(collider: PhysicsImpostor, collidedAgainst:PhysicsImpostor) : void {
            if (collider.object != null && collidedAgainst.object != null) {
                var colliderAny:any = collider.object;
                if (colliderAny != null && colliderAny.metadata != null && colliderAny.metadata.collisionTags != null && colliderAny.metadata.collisionEvent != null) {
                    var collidedAgainstAny:any = collidedAgainst.object;
                    if ( collidedAgainstAny != null && collidedAgainstAny.metadata != null && collidedAgainstAny.metadata.tagName != null) {
                        if (colliderAny.metadata.collisionTags.length === 0 || colliderAny.metadata.collisionTags.indexOf(collidedAgainstAny.metadata.tagName) !== -1) {
                            colliderAny.metadata.collisionEvent(collidedAgainstAny);
                        }
                    }
                }
            }
        }
        private disposeSceneComponent():void {
            this.clearIntersectionList();
            this.clearPhysicsCollisions();
            this._collider = null;
            this._mesh = null;
        }
    }

    export abstract class SceneController extends BABYLON.MeshComponent {
        public ready(): void { }
        public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, enableUpdate: boolean = true, propertyBag: any = {}) {
            super(owner, scene, enableUpdate, propertyBag);
        }
        private onready():void {
            if (this.scene.metadata != null && this.scene.metadata.properties != null) {
                if (this.scene.metadata.properties.timeManagement === true) {
                    this.manager.enableTime();
                }
                if (this.scene.metadata.properties.enableUserInput === true) {
                    var joystick:number = this.scene.metadata.properties.virtualJoystickMode;
                    if (joystick !== 0 && this.scene.metadata.properties.virtualJoystickAttached === true) {
                        joystick = 0;
                        BABYLON.Tools.Warn("Virtual joystick camera attached, disabled manual joystick input.");
                    }
                    this.manager.enableUserInput( { 
                        preventDefault: this.scene.metadata.properties.preventDefault,
                        useCapture: this.scene.metadata.properties.useCapture,
                        enableVirtualJoystick: (joystick === 1 || (joystick === 2 && this.manager.isMobile())),
                        disableRightStick: this.scene.metadata.properties.disableRightJoystick
                    });
                }
            }
        }
    }

    export class OrthoController extends BABYLON.CameraComponent {
        public start() :void {
            var me:any = this;
            if (me.setupOrthographicCamera) {
                var size:number = this.getProperty("orthoSize", 5);
                var update:boolean = this.getProperty("resizeCameras", true);
                me.setupOrthographicCamera(size, update);
            }
        }
    }

    export class ObjectMetadata {
        private _metadata: IObjectMetadata = null;
        public constructor(data: IObjectMetadata) {
            this._metadata = data;
        }
        public get type(): string {
            return this._metadata.type;
        }
        public get prefab(): boolean {
            return this._metadata.prefab;
        }
        public get objectId(): string {
            return this._metadata.objectId;
        }
        public get objectName(): string {
            return this._metadata.objectName;
        }
        public get tagName(): string {
            return this._metadata.tagName;
        }
        public get layerIndex(): number {
            return this._metadata.layerIndex;
        }
        public get layerName(): string {
            return this._metadata.layerName;
        }
        public get areaIndex(): number {
            return this._metadata.areaIndex;
        }
        public get navAgent(): BABYLON.INavigationAgent {
            return this._metadata.navAgent;
        }
        public get meshLink(): BABYLON.INavigationLink {
            return this._metadata.meshLink;
        }
        public get meshObstacle(): BABYLON.INavigationObstacle {
            return this._metadata.meshObstacle;
        }
        public setProperty(name: string, propertyValue: any): void {
            if (this._metadata.properties != null) {
                this._metadata.properties[name] = propertyValue;
            }
        }
        public getProperty<T>(name: string, defaultValue: T = null): T {
            var result: any = null
            if (this._metadata.properties != null) {
                result = this._metadata.properties[name];
            }
            if (result == null) result = defaultValue;
            return (result != null) ? result as T : null;
        }
    }

    export enum GamepadType {
        None = -1,
        Generic = 0,
        Xbox360 = 1
    }

    export enum JoystickButton {
        Left = 0,
        Right = 1
    }

    export enum Xbox360Trigger {
        Left = 0,
        Right = 1
    }

    export enum UserInputPointer {
        Left = 0,
        Middle = 1,
        Right = 2
    }

    export enum UserInputAxis {
        Horizontal = 0,
        Vertical = 1,
        ClientX = 2,
        ClientY = 3,
        MouseX = 4,
        MouseY = 5
    }

    export enum UserInputKey {
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
        SingleQuote = 222
    }

    export type UserInputAction = (index: number) => void;

    export interface UserInputPress {
        index: number;
        action: () => void;
    }

    export interface IObjectMetadata {
        api: boolean;
        type: string;
        prefab:boolean;
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
        animationEvents:BABYLON.IAnimationStateEvent[];
        collisionEvent:any;
        collisionTags:string[];
        components: BABYLON.IScriptComponent[];
        properties: any;
    }

    export interface IScriptComponent {
        order: number;
        name: string;
        klass: string;
        update: boolean;
        controller: boolean;
        properties: any;
        instance: BABYLON.SceneComponent;
        tag: any;
    }

    export interface INavigationArea {
        index: number;
        area: string;
        cost: number;
    }

    export interface INavigationAgent {
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

    export interface INavigationLink {
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

    export interface INavigationObstacle {
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

    export interface IObjectTransform {
        position: BABYLON.Vector3;
        rotation: BABYLON.Vector3;
        scale: BABYLON.Vector3;
    }

    export interface ICollisionState {
        mesh: BABYLON.AbstractMesh;
        intersecting: boolean;
    }

    export interface IAnimationState {
        type: string;
        name: string;
        start: number;
        stop: number;
        rate:boolean;
        speed: number;
        source:string;
    }

    export interface IAnimationStateEvent {
        state:string;
        frame: number;
        legacy: boolean;
        functionName: string;
        intParameter: number;
        floatParameter: number;
        stringParameter: string;
        objectIdParameter: string;
    }    

    export class UserInputOptions {
        public static JoystickRightHandleColor: string = "yellow";
        public static JoystickLeftSensibility: number = 1.0;
        public static JoystickRightSensibility: number = 1.0;
        public static JoystickDeadStickValue: number = 0.01;
        public static GamepadDeadStickValue: number = 0.25;
        public static GamepadLStickXInverted: boolean = false;
        public static GamepadLStickYInverted: boolean = false;
        public static GamepadRStickXInverted: boolean = false;
        public static GamepadRStickYInverted: boolean = false;
        public static GamepadLStickSensibility = 1.0;
        public static GamepadRStickSensibility = 1.0;
        public static PointerAngularSensibility: number = 1.0;
    }
}
