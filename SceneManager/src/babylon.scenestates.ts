module BABYLON {
    export class AnimationState extends BABYLON.SceneComponent {
        private static EXIT:string = "[EXIT]";
        private _state:BABYLON.MachineState = null;
        private _speed:number = 1.0;
        private _entry:string = null;
        private _machine:any = null;
        private _enabled:boolean = false;
        private _handlers:any = null;
        private _blending:number = 0.0;
        private _autoplay:boolean = false;
        private _executed:boolean = false;
        private _checkers:BABYLON.TransitionCheck = new BABYLON.TransitionCheck();
        private _rootSpeed:number = 0.0;
        private _rootRotation:number = 0.0;
        private _rootVelocity:BABYLON.Vector3 = BABYLON.Vector3.Zero();
        public autoTicking:boolean = true;
        public get executing():boolean { return this._executed; }
        public onStateChanged:()=>void = null;
        public constructor(owner: BABYLON.AbstractMesh | BABYLON.Camera | BABYLON.Light, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
            super(owner, scene, tick, propertyBag);
            this._state = null;
            this._entry = null;
            this._handlers = {};
            this._machine = null;
            this._executed = false;
            this._enabled = this.getProperty("enableStateMachine", false);
            this._blending = this.getProperty("defaultBlending", 0.0);
            this._autoplay = this.getProperty("automaticPlay", false);
            if (this.owned.metadata != null) {
                this.owned.metadata.state = {};
                this.owned.metadata.state.floats = {};
                this.owned.metadata.state.booleans = {};
                this.owned.metadata.state.triggers = {};
                this.owned.metadata.state.parameters = {};
                if (this.owned.metadata.properties != null && this.owned.metadata.properties.stateMachineInfo != null) {
                    this._machine = this.owned.metadata.properties.stateMachineInfo;
                    if (this._machine != null) {
                        //console.log("===> DUMP STATE MACHINE: " + this.owned.name);
                        //console.log(this._machine);
                        if (this._machine.speed != null) {
                            this._speed = this._machine.speed;
                        }
                        if (this._machine.entry != null && this._machine.entry !== "") {
                            this._entry = this._machine.entry;
                        }
                        if (this._machine.parameters != null && this._machine.parameters.length > 0) {
                            var plist:any[] = this._machine.parameters;
                            plist.forEach((parameter) => {
                                var name:string = parameter.name;
                                var type:BABYLON.AnimatorParameterType = parameter.type;
                                var curve:boolean = parameter.curve;
                                var defaultFloat:number = parameter.defaultFloat;
                                var defaultBool:boolean = parameter.defaultBool;
                                var defaultInt:number = parameter.defaultInt;
                                this.owned.metadata.state.parameters[name] = type;
                                if (type === BABYLON.AnimatorParameterType.Float) {
                                    this.setNumber(name, defaultFloat);
                                } else if (type === BABYLON.AnimatorParameterType.Int) {
                                    this.setNumber(name, defaultInt);
                                } else if (type === BABYLON.AnimatorParameterType.Bool) {
                                    this.setBoolean(name, defaultBool);
                                } else if (type === BABYLON.AnimatorParameterType.Trigger) {
                                    this.resetTrigger(name);
                                }
                            });
                        }
                    }
                }
            }
        }

        /* Animation Controller Life Cycle Functions */
        
        protected start() :void { this.startStateMachine(); }
        protected update() :void { if (this.autoTicking === true) this.updateStateMachine(); }
        protected destroy() :void { this.destroyStateMachine(); }
        
        /* Animation Controller Auto Ticking Functions */

        public tickStateMachine() :void {
            if (this.autoTicking === false) {
                this.updateStateMachine();
            } else {
                BABYLON.Tools.Warn("Manual tick request ignored. Auto ticking is enabled for animator: " + this.owned.name);
            }
        }
        
        /* Animation Controller State Access Functions */

        public getNumber(name:string):number {
            var result:number = 0.0;
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.floats != null && this.owned.metadata.state.floats[name] != null) {
                result = this.owned.metadata.state.floats[name];
            }
            return result;
        }
        public setNumber(name:string, value:number):void {
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.floats != null) {
                this.owned.metadata.state.floats[name] = value;
            }
        }
        public getBoolean(name:string):boolean {
            var result:boolean = false;
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.booleans != null && this.owned.metadata.state.booleans[name] != null) {
                result = this.owned.metadata.state.booleans[name];
            }
            return result;
        }
        public setBoolean(name:string, value:boolean):void {
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.booleans != null) {
                this.owned.metadata.state.booleans[name] = value;
            }
        }
        public getTrigger(name:string):boolean {
            var result:boolean = false;
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.triggers != null && this.owned.metadata.state.triggers[name] != null) {
                result = this.owned.metadata.state.triggers[name];
            }
            return result;
        }
        public setTrigger(name:string):void {
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.triggers != null) {
                this.owned.metadata.state.triggers[name] = true;
            }
        }
        public resetTrigger(name:string):void {
            if (this.owned.metadata != null && this.owned.metadata.state != null && this.owned.metadata.state.triggers != null) {
                this.owned.metadata.state.triggers[name] = false;
            }
        }

        /* Animation Controller Current State Functions */
        
        public getCurrentState():BABYLON.MachineState {
            return this._state;
        }
        public setCurrentState(name:string, blending:number = 0.0):void {
            this.setCurrentMachineState(name, blending);
        }
        
        /* Animation Controller Event Helper Functions */

        public onAnimationEvent(name:string, handler:(evt:BABYLON.IAnimationEvent)=>void):void {
            if (name != null && name !== "") {
                this._handlers[name.toLowerCase()] = handler;
            }
        }
        public getAnimationEventHandler(name:string):(evt:BABYLON.IAnimationEvent) => void {
            var result:(evt:BABYLON.IAnimationEvent) => void = null;
            if (name != null && name !== "") {
                var handler:(evt:BABYLON.IAnimationEvent) => void = this._handlers[name.toLowerCase()];
                if (handler != null) {
                    result = handler;
                }
            }
            return result;
        }

        /* Animation Controller Root Motion Functions */
        
        public getRootMotionSpeed():number {
            return this._rootSpeed;
        }
        public getRootMotionRotation():number {
            return this._rootRotation;
        }
        public getRootMotionVelocity():BABYLON.Vector3 {
            return this._rootVelocity;
        }
        
        /* Animation Controller State Machine Functions */

        private startStateMachine():void {
            if (this._executed === false) {
                this._executed = true;
                if (this._enabled === true) {
                    // Enable State Machine Mode
                    if (this._autoplay === true && this._entry != null && this._entry !== "") {
                        this.setCurrentMachineState(this._entry, 0.0);
                    }
                } else {
                    // Enable Standard Animation Mode
                    if (this._autoplay === true) {
                        this.manager.playAnimationClip(null, this.owned);
                    }
                }
            }
        }
        private updateStateMachine():void {
            this._checkers.result = null;
            this._checkers.offest = 0.0;
            this._checkers.blending = 0.0;
            this._checkers.triggered = [];
            if (this._state != null) {
                // Check Local Transition Conditions
                this.checkStateTransitions(this._state.transitions, this._state.time, this._state.length, this._state.rate, this._state.index);
                // Check Any State Transition Conditions
                if (this._checkers.result == null && this._machine.transitions != null) {
                    this.checkStateTransitions(this._machine.transitions, this._state.time, this._state.length, this._state.rate, this._state.index);
                }
                // Update Current Blend Tree State
                if (this._checkers.result == null && this._state.type === BABYLON.MotionType.Tree) {
                    this.updateBlendingTree();
                }
            }
            // Validate Current Root Motion State
            this.validateRootMotion();
            // Reset Transition Condition Triggers
            if (this._checkers.triggered != null && this._checkers.triggered.length > 0) {
                this._checkers.triggered.forEach((trigger) => { this.resetTrigger(trigger); });
                this._checkers.triggered = null;
            }
            // Set Current Machine State Result
            if (this._checkers.result != null) {
                if (this._checkers.offest > 0.0) {
                    this.manager.delay(()=>{ this.setCurrentMachineState(this._checkers.result, this._checkers.blending); }, this._checkers.offest * 1000);
                } else {
                    this.setCurrentMachineState(this._checkers.result, this._checkers.blending);
                }
            }
        }
        private checkStateTransitions(transitions:BABYLON.ITransition[], time:number, length:number, rate:number, index:number):any {
            if (transitions != null && transitions.length > 0) {
                var i:number = 0; var ii:number = 0;
                // TODO: CHECK TRANSITION SOLO STATUS
                for(i = 0; i < transitions.length; i++ ) {
                    var transition:BABYLON.ITransition = transitions[i];
                    if (transition.indexLayer !== index) continue;
                    if (transition.mute === true) continue;
                    var transitionOk:boolean = false;
                    // Check Has Transition Exit Time
                    var exitTimeSecs:number = BABYLON.Scalar.Denormalize(transition.exitTime, 0, length);
                    var exitTimeExpired:boolean = ((this.manager.time - time) >= exitTimeSecs);
                    if (transition.hasExitTime === true && transition.intSource == BABYLON.InterruptionSource.None && exitTimeExpired === false) continue;
                    // Check All Transition Conditions
                    if (transition.conditions != null && transition.conditions.length > 0) {
                        var passed:number = 0; var checks:number = transition.conditions.length;
                        transition.conditions.forEach((condition) => {
                            if (this.owned.metadata.state.parameters[condition.parameter] != null) {
                                var ptype:BABYLON.AnimatorParameterType = this.owned.metadata.state.parameters[condition.parameter];
                                if (ptype == BABYLON.AnimatorParameterType.Float || ptype == BABYLON.AnimatorParameterType.Int) {
                                    var numValue:number = this.getNumber(condition.parameter);
                                    if (condition.mode === BABYLON.ConditionMode.Greater && numValue > condition.threshold) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.Less && numValue < condition.threshold) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.Equals && numValue === condition.threshold) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.NotEqual && numValue !== condition.threshold) {
                                        passed++;
                                    }
                                } else if (ptype == BABYLON.AnimatorParameterType.Bool) {
                                    var boolValue:boolean = this.getBoolean(condition.parameter);
                                    if (condition.mode === BABYLON.ConditionMode.If && boolValue === true) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.IfNot && boolValue === false) {
                                        passed++;
                                    }
                                } else if (ptype == BABYLON.AnimatorParameterType.Trigger) {
                                    var triggerValue:boolean = this.getTrigger(condition.parameter);
                                    if (triggerValue === true) {
                                        passed++;
                                        if (this._checkers.triggered.indexOf(condition.parameter) < 0) {
                                            this._checkers.triggered.push(condition.parameter);
                                        }
                                    }
                                }
                            }
                        });
                        if (transition.hasExitTime === true) {
                            // TODO: CHECK TRANSITION INTERUPTION STATUS
                            // Validate Transition Has Exit Time And All Conditions Passed
                            transitionOk = (exitTimeExpired === true && passed === checks);
                        } else {
                            // Validate All Transition Conditions Passed
                            transitionOk = (passed === checks);
                        }
                    } else {
                        // Validate Transition Has Expired Exit Time Only
                        transitionOk = (transition.hasExitTime === true && exitTimeExpired === true);
                    }
                    // Validate Current Transition Destination Change
                    if (transitionOk === true) {
                        var destState:string = (transition.isExit === false) ? transition.destination : BABYLON.AnimationState.EXIT;
                        var offsetSecs:number = BABYLON.Scalar.Denormalize(transition.offset, 0, length);
                        var durationSecs:number = BABYLON.Scalar.Denormalize(transition.duration, 0, length);
                        var blendingSpeed:number = BABYLON.Utilities.ComputeBlendingSpeed(rate, durationSecs); 
                        this._checkers.result = destState;
                        this._checkers.offest = offsetSecs;
                        this._checkers.blending = blendingSpeed;
                        break;
                    }
                }
            }
        }
        private getMachineStateInfo(name:string):BABYLON.MachineState {
            var index = 0;
            var result:BABYLON.MachineState = null;
            if (this._machine != null && this._machine.states != null && this._machine.states.length > 0) {
                var slist:any[] = this._machine.states;
                var scount:number = this._machine.states.length;
                for (index=0; index<scount; index++) {
                    var state:BABYLON.MachineState = slist[index];
                    if (state != null && state.name === name) {
                        result = state;
                        break;
                    }
                }
            }
            return result;
        }
        private setCurrentMachineState(name:string, blending:number):void {
            if (name == null || name === "" || name === BABYLON.AnimationState.EXIT) return;
            if (this._state != null && this._state.name === name) return;
            this.resetMachineState(this._state);
            this._state = this.getMachineStateInfo(name);
            if (this._state != null) {
                this._state.time = this.manager.time;
                if (this._state.type === BABYLON.MotionType.Clip && this._state.motion != null && this._state.motion !== "") {
                    this._state.animations = this.manager.playAnimationClip(this._state.motion, this.owned, blending, (this._state.speed * this._speed), true);
                }
                if (this.onStateChanged != null) {
                    this.onStateChanged();
                }
            }
        }
        private resetMachineState(state:BABYLON.MachineState):void {
            if (state != null) {
                state.time = 0.0;
                state.branch = null;
                state.animations = null;
                state.interupted = false;
            }
        }
        private destroyStateMachine():void {
            this.resetMachineState(this._state);
            this.onStateChanged = null;
            if (this.owned.metadata != null && this.owned.metadata.state != null) {
                this.owned.metadata.state = null;
            }
            this._state = null;
        }

        /* Animation Controller Blend Tree Functions */

        private updateBlendingTree():void {
            if (this._state != null && this._state.blendtree != null) {
                var branch:BABYLON.IBlendTreeChild = this.getBlendTreeBranch(this._state.blendtree);
                if (branch != null && branch.motion != null && branch.motion !== "" && this._state.branch !== branch.motion) {
                    this._state.branch = branch.motion;
                    this._state.animations = this.manager.playAnimationClip(branch.motion, this.owned, this._blending, (branch.timescale * this._state.speed * this._speed), true);
                }
            }
        }
        private getBlendTreeBranch(tree:BABYLON.IBlendTree):BABYLON.IBlendTreeChild {
            // Note: Use Simple Blend Trees To Interpolate Between Animations
            var result:BABYLON.IBlendTreeChild = null;
            if (tree.children != null && tree.children.length > 0) {
                var index:number = 0;
                var valueX = this.getNumber(tree.blendParameterX);
                var valueY = this.getNumber(tree.blendParameterY);
                for (index = 0; index < tree.children.length; index++) {
                    var check:boolean = false;
                    var child:BABYLON.IBlendTreeChild = tree.children[index];
                    if (this._state.blendtree.blendType === BABYLON.BlendTreeType.Simple1D) {
                        check = (valueX === child.threshold);
                    } else  {
                        if (child.position != null && child.position.length >= 2) {
                            check = (valueX === child.position[0] && valueY === child.position[1])
                        }
                    }
                    if (check === true) {
                        if (child.type === BABYLON.MotionType.Tree) {
                            result = this.getBlendTreeBranch(child.subtree);
                        } else {
                            result = child;
                        }
                    }
                    if (result != null) break;
                }
            }
            return result;
        }

        /* Animation Controller Root Motion Functions */

        private validateRootMotion():void {
            // TODO: Include Current Blend Tree Root Motions
            if (this._state != null && this._state.averageSpeed != null && this._state.averageSpeed.length >= 3) {
                this._rootSpeed = this._state.averageSpeed[2];
                this._rootRotation = this._state.averageAngularSpeed;
                this._rootVelocity.copyFromFloats(this._state.averageSpeed[0], this._state.averageSpeed[1], this._state.averageSpeed[2]);
            } else {
                this._rootSpeed = 0.0;
                this._rootRotation = 0.0;
                this._rootVelocity.copyFromFloats(0.0, 0.0, 0.0);
            }
        }
    }
}