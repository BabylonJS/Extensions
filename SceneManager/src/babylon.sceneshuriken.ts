module BABYLON {
    /* Shuriken Particle System Bursts */
    export interface IShurikenBusrt {
        time:number;
        minCount:number;
        maxCount:number;
    }
    /* Shuriken Particle System Curves */
    export interface IShurikenCurve {
        length:number;
        preWrapMode:string;
        postWrapMode:string;
        keyframes:BABYLON.IShurikenKeyframe[];
    }
    /* Shuriken Particle System Keyframe */
    export interface IShurikenKeyframe {
        time:number;
        value:number;
        inTangent:number;
        outTangent:number;
        tangentMode:number;
    }
    /* Shuriken Style Particle System Class */
    export class ShurikenParticleSystem extends BABYLON.ParticleSystem {
        public static get EMISSION_RATE():number { return 0; }
        public static get EMISSION_BURST():number { return 1; }
        
        public emitType:number = ShurikenParticleSystem.EMISSION_RATE;
        public loopPlay:boolean = false;
        public delayTime:number = 0.0;

        private _duration:number = 0.0;
        private _startSpeed:number = -1;
        private _enableTime:boolean = false;
        private _cycleHandler:BABYLON.Animatable = null;
        private _emissionBurst:BABYLON.IShurikenBusrt[] = null;
        private _updateModules:BABYLON.ShurikenUpdateModules = null;
        
        public get modules():BABYLON.ShurikenUpdateModules { return this._updateModules; }
        constructor(name: string, capacity: number, scene: BABYLON.Scene, duration:number = 0.0, emission:number = ShurikenParticleSystem.EMISSION_RATE, startSpeed:number= 0.01, emissionBurst:BABYLON.IShurikenBusrt[] = null, updateModules:BABYLON.ShurikenUpdateModules = null, customEffect: BABYLON.Effect = null) {
            super(name, capacity, scene, customEffect);
            this._duration = duration;
            this._startSpeed = startSpeed;
            this._emissionBurst = emissionBurst;
            this._updateModules = (updateModules != null) ? updateModules : new BABYLON.ShurikenUpdateModules();

            this.delayTime = 0.0;
            this.loopPlay = false;
            this.emitType = emission;
            this.updateSpeed = startSpeed;
            this.disposeOnStop = false;
            this.preventAutoStart = true;
            this.targetStopDuration = 0;
            this.updateFunction = this.defaultUpdateOverTimeFunctionHandler;
            this.startPositionFunction = this.defaultStartPositionFunctionHandler;
            this.startDirectionFunction = this.defaultStartDirectionFunctionHandler;
            this.manualEmitCount = (this.emitType === ShurikenParticleSystem.EMISSION_BURST) ? 0 : -1;
        }
        
        /** Babylon Particle System Overrides */

        public start() : void {
            this.internalStop(false);
            this.updateSpeed = this._startSpeed;
            this.disposeOnStop = false;
            this.preventAutoStart = true;
            this.targetStopDuration = 0;
            if (this.emitType === ShurikenParticleSystem.EMISSION_BURST) {
                // Shuriken time based burst emissions
                if (this._emissionBurst != null && this._emissionBurst.length > 0) {
                    this._emissionBurst.forEach((burst:BABYLON.IShurikenBusrt) => {
                        this.internalPlay(this.delayTime + burst.time, burst.minCount, burst.maxCount);
                    });
                }
            } else {
                // Standard stream based rate emissions
                this.internalPlay(this.delayTime);
            }
            // Shuriken time based updates and cycling
            if (this._duration > 0.0) {
                var cycleLength:number = (this.delayTime + this._duration);
                if (this._updateModules != null && this._updateModules.updateOverTime === true) {
                    if (this.animations != null && this.animations.length > 0) {
                        var totalFrames:number = cycleLength * this._updateModules.framesPerSecond;
                        this._cycleHandler = this.internalScene.beginAnimation(this, 0, totalFrames, false, 1.0);
                    }
                }
                window.setTimeout(()=>{ this.internalCycle(); }, cycleLength * 1000);
            }
        }

        public stop():void {
            this.internalStop(true);
        }
        
        public dispose() :void {
            this.internalStop(true);
            this._emissionBurst = null;
            this._updateModules = null;
            this.updateFunction = null;
            this.startPositionFunction = null;
            this.startDirectionFunction = null;
            super.dispose();
        }
        
        /* Shuriken Particle System Internal Worker Functions */
        
        private get internalScene(): BABYLON.Scene {
            return (<any>this)._scene;
        }
        
        private internalPlay(delay:number = 0.0, min:number = -1, max:number = -1, ):void {
            if (delay > 0.0) {
                window.setTimeout(()=>{ this.internalStart(min, max); }, delay * 1000);
            } else {
                this.internalStart(min, max);
            }
        }

        private internalCycle():void {
            this.stop();
            if (this.loopPlay === true) {
                 this.start(); 
            }
        }        
        
        private internalStart(min:number, max):void {
            var emitCount = (this.emitType === ShurikenParticleSystem.EMISSION_BURST) ? 0 : -1;
            if (this.emitType === ShurikenParticleSystem.EMISSION_BURST && min >= 1.0 && max >= 1.0) {
                emitCount = BABYLON.Scalar.RandomRange(min, max);
            }
            this.manualEmitCount = emitCount;
            super.start();
        }
        
        private internalStop(force:boolean = false):void {
            if (this._cycleHandler != null) {
                this._cycleHandler.stop();
                this._cycleHandler = null;
            }
            if (force === false) {
                var pSystem:any = (<any>this);
                if(pSystem != null && pSystem._started && !pSystem._stopped) {
                    super.stop();
                }
            } else {
                super.stop();
            }
        }
        
        /* Shuriken Particle System Update Module Functions */

        public getParticles(): Array<Particle> {
            return (<any>this).particles;
        }

        public get stockParticles(): Array<Particle> {
            return (<any>this)._stockParticles;
        }

        public get scaledUpdateSpeed(): number {
            return (<any>this)._scaledUpdateSpeed;
        }

        public get scaledDirection(): Vector3 {
            return (<any>this)._scaledDirection;
        }

        public get scaledColorStep(): Color4 {
            return (<any>this)._scaledColorStep;
        }

        public get scaledGravity(): Vector3 {
            return (<any>this)._scaledGravity;
        }

        public recycleParticle(particle: Particle): void {
            if (this._updateModules != null) {
                // TODO: With Shuriken Module Support
            }
            super.recycleParticle(particle);
        }
        
        /* Shuriken Particle System Default Update Over Time Functions */
        
        public defaultStartDirectionFunctionHandler(emitPower: number, worldMatrix: BABYLON.Matrix, directionToUpdate: BABYLON.Vector3, particle: BABYLON.Particle): void {
            if (this._updateModules != null) {
                // TODO: With Shuriken Module Support
            }
            var randX = BABYLON.Scalar.RandomRange(this.direction1.x, this.direction2.x);
            var randY = BABYLON.Scalar.RandomRange(this.direction1.y, this.direction2.y);
            var randZ = BABYLON.Scalar.RandomRange(this.direction1.z, this.direction2.z);
            Vector3.TransformNormalFromFloatsToRef(randX * emitPower, randY * emitPower, randZ * emitPower, worldMatrix, directionToUpdate);
        }

        public defaultStartPositionFunctionHandler(worldMatrix: BABYLON.Matrix, positionToUpdate: BABYLON.Vector3, particle: BABYLON.Particle): void {
            if (this._updateModules != null) {
                // TODO: With Shuriken Module Support
            }
            var randX = BABYLON.Scalar.RandomRange(this.minEmitBox.x, this.maxEmitBox.x);
            var randY = BABYLON.Scalar.RandomRange(this.minEmitBox.y, this.maxEmitBox.y);
            var randZ = BABYLON.Scalar.RandomRange(this.minEmitBox.z, this.maxEmitBox.z);
            Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
        }

        public defaultUpdateOverTimeFunctionHandler(particles: BABYLON.Particle[]): void {
            if (this._updateModules != null) {
                // TODO: With Shuriken Module Support
            }
            for (var index = 0; index < particles.length; index++) {
                var particle = particles[index];
                particle.age += this.scaledUpdateSpeed;

                if (particle.age >= particle.lifeTime) { // Recycle by swapping with last particle
                    this.recycleParticle(particle);
                    index--;
                    continue;
                }
                else {
                    particle.colorStep.scaleToRef(this.scaledUpdateSpeed, this.scaledColorStep);
                    particle.color.addInPlace(this.scaledColorStep);

                    if (particle.color.a < 0)
                        particle.color.a = 0;

                    particle.angle += particle.angularSpeed * this.scaledUpdateSpeed;

                    particle.direction.scaleToRef(this.scaledUpdateSpeed, this.scaledDirection);
                    particle.position.addInPlace(this.scaledDirection);

                    this.gravity.scaleToRef(this.scaledUpdateSpeed, this.scaledGravity);
                    particle.direction.addInPlace(this.scaledGravity);
                }
            }
        }
    }
    /* Shuriken Particle System Update Modules */
    export class ShurikenUpdateModules {
        public updateOverTime:boolean = false;
        public framesPerSecond:number = 30;
        public speedModule:any = null;
        public emissionModule:any = null;
        public velocityModule:any = null;
        public colorModule:any = null;
        public sizingModule:any = null;
        public rotationModule:any = null;
        public updateEffectTime:boolean = false;
        public maximumEffectTime:number = 0.0;
    }
}
