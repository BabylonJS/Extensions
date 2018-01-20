module BABYLON {
    export abstract class SceneComponent {
        public register: () => void = null;
        public dispose: () => void = null;

        protected tick: boolean = false;
        protected start(): void { }
        protected update(): void { }
        protected after(): void { }
        protected destroy(): void { }
        
        private _engine: BABYLON.Engine = null;
        private _scene: BABYLON.Scene = null;
        private _before: () => void = null;
        private _after: () => void = null;
        private _started: boolean = false;
        private _initialized: boolean = false;
        private _properties: any = null;
        private _manager: BABYLON.SceneManager = null;
        protected owned: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light = null;
        public constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
            if (owner == null) throw new Error("Null owner scene obejct specified.");
            if (scene == null) throw new Error("Null host scene obejct specified.");
            this.tick = tick;
            this.owned = owner;
            this._started = false;
            this._manager = null;
            this._initialized = false;
            this._properties = propertyBag;
            this._engine = scene.getEngine();
            this._scene = scene;

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

        /* Scene Component Helper Member Functions */
        public get manager(): BABYLON.SceneManager {
            if (this._manager == null) {
                this._manager = BABYLON.SceneManager.GetInstance();
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
        public getClassname():string {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((<any> this).constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        }        
        public getMetadata(): BABYLON.ObjectMetadata {
            return this.manager.findSceneMetadata(this.owned);
        }
        public getComponent<T extends BABYLON.SceneComponent>(klass: string): T {
            var result:any = this.manager.findSceneComponent<T>(klass, this.owned);
            return (result != null) ? result as T : null;
        }
        public getComponents<T extends BABYLON.SceneComponent>(klass: string): T[] {
            var result:any = this.manager.findSceneComponents<T>(klass, this.owned);
            return (result != null) ? result as T[] : null;
        }
        public getLensFlareSystem(flareName:string): BABYLON.LensFlareSystem {
            return this.manager.findSceneLensFlareSystem(flareName, this.owned);
        }
        public getLensFlareSystems(): BABYLON.LensFlareSystem[] {
            return this.manager.findSceneLensFlareSystems(this.owned);
        }

        /* Scene Component Initialize Helper Function */
        private init(): void {
            if (this.owned.metadata != null) {
                // Handle pre-start initilization
            }
        }

        /* Private Scene Component Instance Worker Functions */
        private registerInstance(instance: any): void {
            if (instance.ready) {
                instance.manager.onready(()=>{
                    instance.ready();
                });
            }
            instance.scene.registerBeforeRender(instance._before);
            instance.scene.registerAfterRender(instance._after);
        }
        private updateInstance(instance: any): void {
            if (!instance._started) {
                instance.init();
                instance.start();
                instance._started = true;
            } else if (instance._started && instance.tick) {
                instance.update();
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
            instance.scene.unregisterBeforeRender(instance._before);
            instance.scene.unregisterAfterRender(instance._after);
            if (instance.disposeSceneComponent) {
                instance.disposeSceneComponent();
            }
            if (instance._prefab != null) {
                instance._prefab.dispose();
                instance._prefab = null;
            }
            instance.destroy();
            instance.tick = false;
            instance.owned = null;
            instance._started = false;
            instance._before = null;
            instance._after = null;
            instance._properties = null;
            instance._engine = null;
            instance._scene = null;
            instance._manager = null;
            instance.register = null;
            instance.dispose = null;
        }
    }

    export abstract class CameraComponent extends BABYLON.SceneComponent {
        private _camera: BABYLON.Camera = null;
        private _orthoSize:number = 0;
        private _orthoUpdate:boolean = false;
        public constructor(owner: BABYLON.Camera, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
            super(owner, scene, tick, propertyBag);
            this._camera = owner;
        }
        public get camera():BABYLON.Camera {
            return this._camera;
        }
        private setupOrthographicCamera(size:number, updateOnResize:boolean):void {
            var result:boolean = false;
            if (this.camera != null && this._camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
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
            if (this.camera != null && this._orthoSize !== 0) {
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
                //var pipeline:BABYLON.HDRRenderingPipeline = this._camera.metadata.properties.hdrPipeline as BABYLON.HDRRenderingPipeline;
                //pipeline.dispose();
                //pipeline = null;
                this._camera.metadata.properties.hdrPipeline = null;
            }
            this._camera = null;
        }        
    }

    export abstract class LightComponent extends BABYLON.SceneComponent {
        private _light: BABYLON.Light = null;
        public constructor(owner: BABYLON.Light, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
            super(owner, scene, tick, propertyBag);
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
        public intersectionPrecision:BABYLON.IntersectionPrecision = BABYLON.IntersectionPrecision.AABB;
        private _intersections:BABYLON.IIntersectionState[] = [];
        private _intersecting:boolean = false;
        private _intersector:BABYLON.AbstractMesh = null;
        private _mesh:BABYLON.AbstractMesh = null;
        public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
            super(owner, scene, tick, propertyBag);
            this._mesh = owner;
            this._intersecting = false;
        }
        public get mesh():BABYLON.AbstractMesh {
            return this._mesh;
        }
        public getChildMesh(name:string, searchType:BABYLON.SearchType = BABYLON.SearchType.ExactMatch, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            return this.manager.findSceneChildMesh(name, this._mesh, searchType, directDecendantsOnly, predicate);            
        }
        public getCollisionMesh(directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.AbstractMesh {
            return this.manager.findSceneCollisionMesh(this._mesh, directDecendantsOnly, predicate);            
        }
        public getSocketMesh(name:string, directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.Mesh {
            return this.manager.findSceneSocketMesh(name, this._mesh, directDecendantsOnly, predicate);
        }
        public getSocketMeshes(directDecendantsOnly:boolean = true, predicate:(node:BABYLON.Node)=>boolean = null):BABYLON.Mesh[] {
            return this.manager.findSceneSocketMeshes(this._mesh, directDecendantsOnly, predicate);
        }
        public getParticleSystem(particleName:string): BABYLON.IParticleSystem {
            return this.manager.findSceneParticleSystem(particleName, this._mesh);
        }
        public getParticleSystems(): BABYLON.IParticleSystem[] {
            return this.manager.findSceneParticleSystems(this._mesh);
        }

        /***********************************/
        /*  Physics Collision Event System */
        /***********************************/

        public onCollisionEvent(handler:(collider:BABYLON.AbstractMesh, tag:string) => void):void {
            if (this._mesh.metadata != null && this._mesh.metadata.api) {
                this._mesh.metadata.collisionEvent = handler;
            }
            if (this._mesh.physicsImpostor != null) {
                var anyImpostor:any = (<any>this._mesh.physicsImpostor);
                if (anyImpostor.onCollideEvent == null) {
                    anyImpostor.onCollideEvent = this.updatePhysicsCollisionEvent;
                }
            } else {
                BABYLON.Tools.Warn("Physics imposter not defined for mesh: " + this.mesh.name);
            }
        }
        public getCollisionEventHandler():(collider:BABYLON.AbstractMesh, tag:string) => void {
            var result:(collider:BABYLON.AbstractMesh, tag:string) => void = null;
            if (this._mesh.metadata != null && this._mesh.metadata.api && this._mesh.metadata.collisionEvent != null) {
                result = this._mesh.metadata.collisionEvent;
            }
            return result;
        }
        private updatePhysicsCollisionEvent(collider: BABYLON.PhysicsImpostor, collidedAgainst:BABYLON.PhysicsImpostor) : void {
            if (collider.object != null && collidedAgainst.object != null) {
                var colliderAny:any = collider.object;
                if (colliderAny != null && colliderAny.metadata != null && colliderAny.metadata.collisionEvent != null) {
                    var collidedAgainstAny:any = collidedAgainst.object;
                    if (collidedAgainstAny != null) {
                        var collidedAgainstTag:string = "Untagged";
                        if (collidedAgainstAny.metadata != null && collidedAgainstAny.metadata.tagName != null && collidedAgainstAny.metadata.tagName !== "") {
                            collidedAgainstTag = collidedAgainstAny.metadata.tagName;
                        }
                        colliderAny.metadata.collisionEvent(collidedAgainstAny, collidedAgainstTag);
                    }
                }
            }
        }

        /***********************************/
        /*  Mesh Intersection Event System */
        /***********************************/

        public addIntersectionMesh(mesh:BABYLON.AbstractMesh):void {
            if (mesh != null) {
                var collisionMesh:BABYLON.AbstractMesh = this.manager.findSceneCollisionMesh(mesh);
                if (collisionMesh != null) {
                    this._intersections.push({ mesh: collisionMesh, intersecting: false });
                }
            }
        }
        public addIntersectionMeshes(meshes:BABYLON.AbstractMesh[]):void {
            if (meshes != null) {
                meshes.forEach((mesh) => {
                    if (mesh != null) {
                        var collisionMesh:BABYLON.AbstractMesh = this.manager.findSceneCollisionMesh(mesh);
                        if (collisionMesh != null) {
                            this._intersections.push({ mesh: collisionMesh, intersecting: false });
                        }
                    }
                });
            }
        }
        public removeIntersectionMesh(mesh:BABYLON.AbstractMesh):void {
            if (mesh != null && this._intersections != null && this._intersections.length > 0) {
                var count:number = this._intersections.length;
                var marker:number = -1;
                var index:number = 0;
                for(index=0; index<count; index++) {
                    var istate:BABYLON.IIntersectionState = this._intersections[index];
                    if (istate.mesh != null && istate.mesh === mesh) {
                        marker = index;
                        break;
                    }
                }
                if (marker >= 0) {
                    this._intersections.splice(marker, 1);
                }                
            }
        }
        public getIntersectionList():BABYLON.IIntersectionState[] {
            return this._intersections;
        }
        public resetIntersectionList():void {
            this._intersections = [];
        }
        private updateIntersectionList():void {
            if (this._intersector == null) {
                this._intersector = this.getCollisionMesh();
            }
            if (this._intersector != null && this._intersections != null && this._intersections.length > 0) {
                this._intersections.forEach((intersectionState) => {
                    if (intersectionState.mesh != null) {
                        this._intersecting = this._intersector.intersectsMesh(intersectionState.mesh, (this.intersectionPrecision === BABYLON.IntersectionPrecision.OBB));
                        if (this._intersecting) {
                            if (!intersectionState.intersecting) {
                                if (this.onIntersectionEnter != null) {
                                    this.onIntersectionEnter(intersectionState.mesh);
                                }
                            } else {
                                if (this.onIntersectionStay != null) {
                                    this.onIntersectionStay(intersectionState.mesh);
                                }
                            }
                        } else {
                            if (intersectionState.intersecting) {
                                if (this.onIntersectionExit != null) {
                                    this.onIntersectionExit(intersectionState.mesh);
                                }
                            }
                        }
                        intersectionState.intersecting = this._intersecting;
                    }
                });
            }
        }

        /*************************************/
        /*  Scene Component Disposal System  */
        /*************************************/
        
        private disposeSceneComponent():void {
            this.resetIntersectionList();
            if (this.mesh != null) {
                if (this._mesh.skeleton != null && this.mesh.skeleton.bones != null && this._mesh.skeleton.bones.length > 0) {
                    this.mesh.skeleton.bones.forEach((bone) => {
                        if (bone != null && bone.metadata != null) {
                            bone.metadata = null;
                        }
                    });
                }
                if (this._mesh.physicsImpostor != null) {
                    var anyImpostor:any = (<any>this._mesh.physicsImpostor);
                    if (anyImpostor.onCollideEvent != null) {
                        anyImpostor.onCollideEvent = null;
                    }
                }
                if (this._mesh.metadata != null && this._mesh.metadata.api) {
                    this._mesh.metadata.collisionEvent = null;
                }
            }
            this._intersector = null;
            this._mesh = null;
        }
    }

    export class OrthoController extends BABYLON.CameraComponent {
        protected start() :void {
            var me:any = this;
            if (me.setupOrthographicCamera) {
                var size:number = this.getProperty("orthoSize", 5);
                var update:boolean = this.getProperty("resizeCameras", true);
                me.setupOrthographicCamera(size, update);
            }
        }
    }

    export class SmoothTool {
        public constructor() {}
        public currentVelocity:number = 0.0;
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
        public SmoothDamp(current:number, target:number, smoothTime:number, deltaTime:number, maxSpeed:number = Number.MAX_VALUE):number {
            smoothTime = Math.max(0.0001, smoothTime);
            var num:number = 2.0 / smoothTime;
            var num2:number = num * deltaTime;
            var num3:number = 1.0 / (1.0 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
            var num4:number = current - target;
            var num5:number = target;
            var num6:number = maxSpeed * smoothTime;
            num4 = BABYLON.Scalar.Clamp(num4, -num6, num6);
            target = current - num4;
            var num7:number = (this.currentVelocity + num * num4) * deltaTime;
            this.currentVelocity = (this.currentVelocity - num * num7) * num3;
            var num8 = target + (num4 + num7) * num3;
            if (num5 - current > 0.0 == num8 > num5) {
                num8 = num5;
                this.currentVelocity = (num8 - num5) / deltaTime;
            }
            return num8;
        }
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
        public SmoothDampAngle(current:number, target:number, smoothTime:number, deltaTime:number, maxSpeed:number = Number.MAX_VALUE):number {
            target = current + BABYLON.Scalar.DeltaAngle(current, target);
            return this.SmoothDamp(current, target, smoothTime, maxSpeed, deltaTime);
        }    
    }

    export class MeshRotator {
        private _owned:BABYLON.AbstractMesh = null;
        public slerpIdentity:BABYLON.Quaternion = null;
        public constructor(owner: BABYLON.AbstractMesh) {
            this._owned = owner;
            this.slerpIdentity = BABYLON.Quaternion.Identity();
        }
        /** Rotates the mesh using rotation quaternions */
        public rotate(x: number, y: number, z: number, order:BABYLON.RotateOrder = BABYLON.RotateOrder.ZXY):BABYLON.AbstractMesh {
            var result:BABYLON.AbstractMesh = null;
            if (this._owned != null) {
                // Note: Z-X-Y is default Unity Rotation Order
                if (this._owned.rotationQuaternion == null) this._owned.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(this._owned.rotation.y, this._owned.rotation.x, this._owned.rotation.z);
                if (order === BABYLON.RotateOrder.XYZ) {
                    result = this._owned.addRotation(x, 0, 0).addRotation(0, y, 0).addRotation(0, 0, z);
                } else if (order === BABYLON.RotateOrder.XZY) {
                    result = this._owned.addRotation(x, 0, 0).addRotation(0, 0, z).addRotation(0, y, 0);
                } else if (order === BABYLON.RotateOrder.ZXY) {
                    result = this._owned.addRotation(0, 0, z).addRotation(x, 0, 0).addRotation(0, y, 0);
                } else if (order === BABYLON.RotateOrder.ZYX) {
                    result = this._owned.addRotation(0, 0, z).addRotation(0, y, 0).addRotation(x, 0, 0);
                } else if (order === BABYLON.RotateOrder.YZX) {
                    result = this._owned.addRotation(0, y, 0).addRotation(0, 0, z).addRotation(x, 0, 0);
                } else {
                    result = this._owned.addRotation(x, y, z); // Note: Default Babylon Y-X-Z Rotate Order
                }
            }
            return result;
        }
        /** Rotates the mesh so the forward vector points at a target position using rotation quaternions. (Options: Y-Yall, X-Pitch, Z-Roll) */
        public lookAtPosition(position:BABYLON.Vector3, slerp:number = 0.0, yawCor?: number, pitchCor?: number, rollCor?: number, space?: BABYLON.Space):BABYLON.AbstractMesh {
            var result:BABYLON.AbstractMesh = null;
            if (this._owned != null) {
                if (this._owned.rotationQuaternion == null) this._owned.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(this._owned.rotation.y, this._owned.rotation.x, this._owned.rotation.z);
                if (this.slerpIdentity != null && slerp > 0.0) this.slerpIdentity.copyFrom(this._owned.rotationQuaternion);
                result = this._owned.lookAt(position, yawCor, pitchCor, rollCor, space);
                if (this.slerpIdentity != null && slerp > 0.0) BABYLON.Quaternion.SlerpToRef(this.slerpIdentity, this._owned.rotationQuaternion, slerp, this._owned.rotationQuaternion)
            }
            return result;
        }
        public dispose():void {
            this._owned = null;
            this.slerpIdentity = null;
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
        public get state(): any {
            return this._metadata.state;
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
        public get socketList(): BABYLON.ISocketData[] {
            return this._metadata.socketList;
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

    export class MachineState
    {
        public tag:string;
        public time:number;
        public name:string;
        public type:BABYLON.MotionType;
        public motion:string;
        public branch:string;
        public rate:number;
        public length:number;
        public layer:string;
        public index:number;
        public machine:string;
        public interupted:boolean;
        public apparentSpeed:number;
        public averageAngularSpeed:number;
        public averageDuration:number;
        public averageSpeed:number[];
        public cycleOffset:number;
        public cycleOffsetParameter:string;
        public cycleOffsetParameterActive:boolean;
        public iKOnFeet:boolean;
        public mirror:boolean;
        public mirrorParameter:string;
        public irrorParameterActive:boolean;
        public speed:number;
        public speedParameter:string;
        public speedParameterActive:boolean;
        public blendtree:BABYLON.IBlendTree;
        public animations:BABYLON.Animatable[];
        public transitions:BABYLON.ITransition[];
        public customCurves:any[];
        public constructor() {}
    }

    export class TransitionCheck {
        public result:string;
        public offest:number;
        public blending:number;
        public triggered:string[];
    }
    
    export enum RotateOrder
    {
        YXZ = 0,
        YZX = 1,
        XYZ = 2,
        XZY = 3,
        ZXY = 4,
        ZYX = 5
    }

    export enum MotionType
    {
        Clip = 0,
        Tree = 1
    }
    
    export enum AnimatorParameterType
    {
        Float = 1,
        Int = 3,
        Bool = 4,
        Trigger = 9
    }
    
    export enum Constants
    {
        Deg2Rad = 0.0174532924,
        Rad2Deg = 57.29578,
        DiagonalSpeed = 0.7071,
        MinimumTimeout = 0.25,
    }
    
    export enum SearchType {
        ExactMatch = 0,
        StartsWith = 1,
        EndsWith = 2,
        IndexOf = 3
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
        MouseY = 5,
        Wheel = 6
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

    export enum MovementType
    {
        DirectVelocity = 0,
        AppliedForces = 1
    }
    
    export enum CollisionContact
    {
        Top = 0,
        Left = 1,
        Right = 2,
        Bottom = 3
    }

    export enum IntersectionPrecision
    {
        AABB = 0,
        OBB = 1
    }
    
    export enum ConditionMode
    {
        If = 1,
        IfNot = 2,
        Greater = 3,
        Less = 4,
        Equals = 6,
        NotEqual = 7
    }
    
    export enum InterruptionSource
    {
        None = 0,
        Source = 1,
        Destination = 2,
        SourceThenDestination = 3,
        DestinationThenSource = 4
    }
    
    export enum BlendTreeType
    {
        //
        // Summary:
        //     ///
        //     Basic blending using a single parameter.
        //     ///
        Simple1D = 0,
        //
        // Summary:
        //     ///
        //     Best used when your motions represent different directions, such as "walk forward",
        //     "walk backward", "walk left", and "walk right", or "aim up", "aim down", "aim
        //     left", and "aim right".
        //     ///
        SimpleDirectional2D = 1,
        //
        // Summary:
        //     ///
        //     This blend type is used when your motions represent different directions, however
        //     you can have multiple motions in the same direction, for example "walk forward"
        //     and "run forward".
        //     ///
        FreeformDirectional2D = 2,
        //
        // Summary:
        //     ///
        //     Best used when your motions do not represent different directions.
        //     ///
        FreeformCartesian2D = 3,
        //
        // Summary:
        //     ///
        //     Direct control of blending weight for each node.
        //     ///
        Direct = 4
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
        state:any;
        objectName: string;
        objectId: string;
        tagName: string;
        layerIndex: number;
        layerName: string;
        areaIndex: number;
        navAgent: BABYLON.INavigationAgent;
        meshLink: BABYLON.INavigationLink;
        meshObstacle: BABYLON.INavigationObstacle;
        socketList:BABYLON.ISocketData[];
        animationClips: BABYLON.IAnimationClip[];
        animationEvents:BABYLON.IAnimationEvent[];
        collisionEvent:any;
        components: BABYLON.IScriptComponent[];
        properties: any;
    }

    export interface IScriptComponent {
        order: number;
        name: string;
        klass: string;
        update: boolean;
        properties: any;
        instance: BABYLON.SceneComponent;
        tag: any;
    }
    
    export interface ITransition {
        anyState:boolean;
        indexLayer:number;
        machineLayer:string;        
        machineName:string;        
        canTransitionToSelf:boolean;
        destination:string;
        duration:number;
        exitTime:number;
        hasExitTime:boolean;
        fixedDuration:number;
        intSource:BABYLON.InterruptionSource;
        isExit:boolean
        mute:boolean;
        name:string;
        offset:number;
        orderedInt:boolean;
        solo:boolean;
        conditions:BABYLON.ICondition[];
    }

    export interface ICondition {
        mode:BABYLON.ConditionMode;
        parameter:string;
        threshold:number;
    }

    export interface IBlendTree {
        name:string;
        state:string;
        children:BABYLON.IBlendTreeChild[];
        apparentSpeed:number;
        averageAngularSpeed:number;
        averageDuration:number;
        averageSpeed:number[];
        blendParameterX:string;
        blendParameterY:string
        blendType:BABYLON.BlendTreeType;
        isAnimatorMotion:boolean;
        isHumanMotion:boolean;
        isLooping:boolean;
        minThreshold:number;
        maxThreshold:number;
        useAutomaticThresholds:boolean;
    }

    export interface IBlendTreeChild {
        cycleOffset:number;
        directBlendParameter:string;
        mirror:boolean
        type:BABYLON.MotionType;
        motion:string;
        position:number[];
        threshold:number;
        timescale:number;
        subtree: BABYLON.IBlendTree;
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

    export interface IIntersectionState {
        mesh: BABYLON.AbstractMesh;
        intersecting: boolean;
    }

    export interface ISocketData {
        boneIndex: number;
        boneName: string;
        socketMesh:BABYLON.Mesh;
        positionX:number;
        positionY:number;
        positionZ:number;
        rotationX:number;
        rotationY:number;
        rotationZ:number;
        prefabName:string;
        prefabPositionX:number;
        prefabPositionY:number;
        prefabPositionZ:number;
        prefabRotationX:number;
        prefabRotationY:number;
        prefabRotationZ:number;
    }

    export interface IAnimationClip {
        type: string;
        name: string;
        start: number;
        stop: number;
        rate:boolean;
        behavior:number;
        playback: number;
    }

    export interface IAnimationEvent {
        clip:string;
        frame: number;
        functionName: string;
        intParameter: number;
        floatParameter: number;
        stringParameter: string;
        objectIdParameter: string;
    }    

    export interface IAnimationCurve {
        length:number;
        preWrapMode:string;
        postWrapMode:string;
        keyframes:BABYLON.IAnimationKeyframe[];
    }

    export interface IAnimationKeyframe {
        time:number;
        value:number;
        inTangent:number;
        outTangent:number;
        tangentMode:number;
    }

    export class UserInputOptions {
        public static JoystickRightHandleColor:string = "yellow";
        public static JoystickLeftSensibility:number = 1.0;
        public static JoystickRightSensibility:number = 1.0;
        public static JoystickDeadStickValue:number = 0.1;
        public static GamepadDeadStickValue:number = 0.25;
        public static GamepadLStickXInverted:boolean = false;
        public static GamepadLStickYInverted:boolean = false;
        public static GamepadRStickXInverted:boolean = false;
        public static GamepadRStickYInverted:boolean = false;
        public static GamepadLStickSensibility:number = 1.0;
        public static GamepadRStickSensibility:number = 1.0;
        public static PointerAngularSensibility:number = 1.0;
        public static PointerWheelDeadZone:number = 0.1;
    }
}
