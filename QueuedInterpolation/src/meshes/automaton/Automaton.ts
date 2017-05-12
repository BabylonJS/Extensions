/// <reference path="../Mesh.ts"/>
/// <reference path="../../deformation/shapeKeyBased/ShapeKeyGroup.ts"/>
/// <reference path="../../deformation/shapeKeyBased/VertexDeformation.ts"/>
module QI{
    /**
     * @immutable, reusable
     * data class to hold values to create VertexDeformations.  These are like recipes or the directions.  They need to be
     * applied to the each Automaton.
     */
    export class Expression {
        public static NONE       = new Expression("NONE"      , true , true , false, [], []);
        public static ANGRY      = new Expression("ANGRY"     , false, true , true , ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "SYMMETRY_LEFT_UP"], [0.85, 0.3, 1, -0.3, 1, 1, -0.2, 1, 0.1], "---Y--Y--");
        public static CRYING     = new Expression("CRYING"    , false, false, false, ["EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP"], [-0.2, -0.2, 1, 0.6, 0.85, -0.55], "YY---Y");
        public static DISGUSTED  = new Expression("DISGUSTED" , false, true , true , ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "WINK_LEFT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP"], [0.65, 0.05, 0.55, 1, 0.25, -0.1, 0.6, 1, -0.1, 0.2, -1], "-----Y--Y-Y");
        public static HAPPY      = new Expression("HAPPY"     , true , true , true , ["EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_UPPER_UP", "SYMMETRY_LEFT_UP"], [-0.1, 0.15, 0.25, -0.2, 0.5, 0.65, -0.25, 0.45], "Y--Y--Y-");
        public static LAUGH      = new Expression("LAUGH"     , true , true , true , ["CHEEKS_HIGH", "EYEBROWS_ANGRY", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.8, -1, -0.15, 0.55, 0.45, -0.25, 0.5, 0.75, -1], "-YY--Z--X");
        public static PPHPHT     = new Expression("PPHPHT"    , false, true , false, ["CHEEKS_SUCK", "MOUTH_PUCKER", "TONGUE_STUCK_OUT", "NOSE_FLARE", "CHEEKS_HIGH", "MOUTH_OPEN", "EYELIDS_SQUINT"], [1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5]);
        public static SAD        = new Expression("SAD"       , false, true , true , ["EYEBROWS_ANGRY", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_UP", "MOUTH_PUCKER", "MOUTH_WIDE", "SYMMETRY_CHIN_LEFT"], [-1, -0.4, 0.65, -0.3, 0.25, 0.45], "YY-X--");
        public static SCARED     = new Expression("SCARED"    , false, false, true , ["EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "WINK_LEFT", "WINK_RIGHT", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP", "SYMMETRY_CHIN_LEFT"], [0.45, 0.8, -0.65, -0.6, 0.35, -0.6, -0.65], "--YY-YX");
        public static SKEPTICAL  = new Expression("SKEPTICAL" , false, false, true , ["EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "WINK_RIGHT"], [-0.5, 0.65, -0.3], "Y-Y");
        public static STRUGGLING = new Expression("STRUGGLING", false, false, false, ["EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "WINK_LEFT", "WINK_RIGHT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE", "SYMMETRY_LEFT_UP", "SYMMETRY_RIGHT_UP"], [1, 0.6, 1, 0.25, 0.35, 1, 0.5, 0.35, -0.7, 0.6, 0.05, -0.4, 0.55], "--------Y--Y-");
        public mirrorReqd = false;

        /**
         * @param {string} name - Used to populate dropdowns, upper case recommended since this will end up being an endStateName in group FACE.
         * @param {boolean} winkable - Indicate that it makes sense for a wink to be done.  Should not have any EyeLid or EyeBrow states.
         * @param {boolean} blinkable - Indicate that blinking could be allow for this expression.
         * @param {boolean} randomizable - Indicate that this expression is usable for random mood.  Strong expressions (like Crying) are not good candidates.
         * @param {string[]} endStateNames - names of state to combine.
         * @param {number[]} endStateRatios - ratios of states to combine.
         * @param {string} mirrorAxes - When one of the endStateRatios is negative, this must be specified to indicate the axis to mirror on:
         *                 Use anything for endstates >= 0, but '-' is a good convention.
         */
        constructor(public name : string, public winkable : boolean, public blinkable : boolean, public randomizable : boolean, public endStateNames : string[], public endStateRatios : number[], public mirrorAxes? : string) {
            if (this.endStateNames.length !== this.endStateRatios.length) {
                BABYLON.Tools.Error("Expression: " + this.name + " invalid when endStateNames not same length as endStateRatios");
                return;
            }
            if (this.mirrorAxes && this.mirrorAxes.length !== this.endStateRatios.length) {
                BABYLON.Tools.Error("Expression: " + this.name + " invalid when mirrorAxes not same length as endStateRatios");
                return;
            }
            
            for (var i = 0, len = this.endStateRatios.length; i <len; i++) {
                if (this.endStateRatios[i] < 0) {
                    this.mirrorReqd = true;
                    break;
                }
            }
            if (!this.mirrorAxes && this.mirrorReqd) {
                 BABYLON.Tools.Error("Expression: " + this.name + " invalid when mirrorAxes missing when an endStateRatios is negative");
            }
            Object.freeze(this);  // make immutable
        }
        
        /**
         * This is so expression developer can log changes to be communicated back for source code implementation.
         */
        public toString() : string {
            var ret = "var exp = new QI.Expression(\"" + this.name + "\", " + this.winkable + ", " + this.blinkable + ", " + this.randomizable + ", ";
            var n = "[", s = "[";
            var nStates = this.endStateNames.length;
            
            for (var i = 0; i < nStates; i++){
                n += "\"" + this.endStateNames[i] + "\"";
                s += this.endStateRatios[i];
                
                if (i + 1 < nStates){
                    n += ", ";
                    s += ", ";
                }else{
                    n += "]";
                    s += "]";
                }
            }
            ret += n + ", " + s + ", ";
            ret += this.mirrorAxes ? "\"" + this.mirrorAxes + "\"" : "null";
            ret += ");\n";
            return ret + "model.addExpression(exp);";
        }
    }

    export class Automaton extends Mesh {
        // eye lids
        private static _WINK = "WINK";  // shape key group name
        private _winker : ShapeKeyGroup;
        private doInvoluntaryBlinking = false;
       
        // the list of possible blink events & morph targets
        private static _BLINK       =  0; private static _BOTH_CLOSED  = "BOTH_CLOSED";
        private static _WINK_LEFT   =  1; private static _LEFT         = "LEFT";
        private static _WINK_RIGHT  =  2; private static _RIGHT        = "RIGHT";

        // expressions
        public static _FACE = "FACE"; // shape key group name
        private _face : ShapeKeyGroup;
        private static _MAX_CHANGES_FOR_MOOD = 10;

        public  expressions = new Array<Expression>();
        private _randomExpressions = new Array<number>();
        private _currentExpression = Expression.NONE;
        private _currentExpDegree = 0;

        private _idleMode = false;
        private _randomMode = false;
        private _numChangesOfCurrentMood : number;
        private _totChangesOfCurrentMood : number;

        // eyes
        public static _EYES = "EYES"; // shape key group name       
        private _eyes : ShapeKeyGroup;
        public  doRandomEyes = false;

        // no need for a constructor, just use super's & subclasses made by TOB

        // ====================================== initializing =======================================
        /** 
         * The shapekeys will not be defined until the subclass constructor has run, so this put here.
         */
        protected postConstruction() : void {
            // add the both closed to WINK before consolidation, so available for expressions
            this._winker = this.getShapeKeyGroup(Automaton._WINK);
            this._winker.addComboDerivedKey(ShapeKeyGroup.BASIS, [Automaton._LEFT, Automaton._RIGHT], [1, 1], null, Automaton._BOTH_CLOSED);
            
            this._eyes = this.getShapeKeyGroup(Automaton._EYES);
            
            // composite the FACE group & nuke components; test allows things other than MakeHuman to send the FACE itself
            if (!this._face) {
                this._face = this.consolidateShapeKeyGroups(Automaton._FACE, ["CHEEKS", "EYEBROWS", "EYELIDS", "MOUTH", "NOSE", "SYMMETRY", "TONGUE", "WINK"], true); // keep groups, cause want WINK
                this.removeShapeKeyGroup("CHEEKS");
                this.removeShapeKeyGroup("EYEBROWS");
                this.removeShapeKeyGroup("EYELIDS");
                this.removeShapeKeyGroup("MOUTH");
                this.removeShapeKeyGroup("NOSE");
                this.removeShapeKeyGroup("SYMMETRY");
                this.removeShapeKeyGroup("TONGUE");
            }

            // expressions
            this.expressions.push(Expression.NONE);     
                   
            // make sure eyelids are always drawn last, must be after FACE built
            this.setShapeKeyGroupLast(Automaton._WINK);
            
        }
        
        /**
         * @param {String} name - The name of the new expression.
         * @param {boolean} winkable - Not all expressions is it appropriate to wink, indicate this one is with true.
         * @param {boolean} blinkable - It is not appropriate when an expression closes eyelids to allow blinking. Indicate no closing with true.
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Not validated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.
         */
        public addExpression(exp : Expression) : void {
            this.expressions.push(exp);
            this._face.addComboDerivedKey(ShapeKeyGroup.BASIS, exp.endStateNames, exp.endStateRatios, exp.mirrorAxes, exp.name);
            if (exp.randomizable) {
                this._randomExpressions.push(this.expressions.length - 1); // append index into expressions
            }
        }
        
        /**
         * Adds the expressions contained in this file.  These do take both time to construct and memory, so doing all might be wasteful.
         * @param {string} whichOnes - names of the ones to load, e.g. 'ANGRY LAUGH'.  When missing, then all.
         */
        public addStockExpressions(whichOnes? : string) : void {
            var all = !whichOnes;
            if (all || whichOnes.indexOf("ANGRY"     ) !== -1) this.addExpression(Expression.ANGRY);
            if (all || whichOnes.indexOf("CRYING"    ) !== -1) this.addExpression(Expression.CRYING);
            if (all || whichOnes.indexOf("DISGUSTED" ) !== -1) this.addExpression(Expression.DISGUSTED);
            if (all || whichOnes.indexOf("HAPPY"     ) !== -1) this.addExpression(Expression.HAPPY);
            if (all || whichOnes.indexOf("LAUGH"     ) !== -1) this.addExpression(Expression.LAUGH);
            if (all || whichOnes.indexOf("PPHPHT"    ) !== -1) this.addExpression(Expression.PPHPHT);
            if (all || whichOnes.indexOf("SAD"       ) !== -1) this.addExpression(Expression.SAD);
            if (all || whichOnes.indexOf("SCARED"    ) !== -1) this.addExpression(Expression.SCARED);
            if (all || whichOnes.indexOf("SKEPTICAL" ) !== -1) this.addExpression(Expression.SKEPTICAL);
            if (all || whichOnes.indexOf("STRUGGLING") !== -1) this.addExpression(Expression.STRUGGLING);
        }
        
        /**
         * Release the shape key components after all the base expressions have been created.  Those for winking are always kept.
         * @param {boolean} keepThoseForSpeech - when true, keys for mouth & some for tongue are still kept
         */
        public removeExpressionComponents(keepThoseForSpeech : boolean) : void {
            // those for CHEEKS
            this._face.deleteShapeKey("CHEEKS_HIGH");
            this._face.deleteShapeKey("CHEEKS_PUMP");
            this._face.deleteShapeKey("CHEEKS_SUCK");

            // those for EYEBROWS
            this._face.deleteShapeKey("EYEBROWS_ANGRY");
            this._face.deleteShapeKey("EYEBROWS_RAISED_LEFT");
            this._face.deleteShapeKey("EYEBROWS_RAISED_RIGHT");

            // those for EYELIDS (WINKS kept on the original group WINK)
            this._face.deleteShapeKey("EYELIDS_SQUINT");
            this._face.deleteShapeKey("WINK_BOTH_CLOSED");
            this._face.deleteShapeKey("WINK_LEFT");
            this._face.deleteShapeKey("WINK_RIGHT");
            
            // those for NOSE
            this._face.deleteShapeKey("NOSE_FLARE");

            // those for TONGUE
            this._face.deleteShapeKey("TONGUE_STUCK_OUT");
       
            // those for SYMMETRY
            this._face.deleteShapeKey("SYMMETRY_CHIN_LEFT");
            this._face.deleteShapeKey("SYMMETRY_LEFT_UP");
            this._face.deleteShapeKey("SYMMETRY_RIGHT_UP");

            if (keepThoseForSpeech) return;
            
            // those for MOUTH
            this._face.deleteShapeKey("MOUTH_CORNERS_DOWN");
            this._face.deleteShapeKey("MOUTH_CORNERS_UP");
            this._face.deleteShapeKey("MOUTH_LIPS_LOWER_OUT");
            this._face.deleteShapeKey("MOUTH_LIPS_LOWER_UP");
            this._face.deleteShapeKey("MOUTH_LIPS_UPPER_UP");
            this._face.deleteShapeKey("MOUTH_OPEN");
            this._face.deleteShapeKey("MOUTH_PUCKER");
            this._face.deleteShapeKey("MOUTH_WIDE");

            // those for TONGUE
            this._face.deleteShapeKey("TONGUE_RAISED");
        }
        
        public getExpressionNames() : Array<string> {
            var len = this.expressions.length;
            var ret = new Array<string>(len);
            for (var i = 0; i < len; i++) {
                ret[i] = this.expressions[i].name;
            }
            return ret;
        }
        // ============================ beforeRender callback & tracking =============================
        /** @override */
        public beforeRender() : void {
            super.beforeRender();
            
            // do not auto submit anything until visible
            if (!this.isVisible) return;
            
            // can always do eye movement, since no conflicts with other shape keys or speech
            if (this.doRandomEyes && !this._eyes.isActive() ) this._eyeProcessing();

            // avoid queuing issues of eye lids, if a deformation in progress ( possibly a wink / blink too )
            if (this._shapeKeyChangesMade) return;

            // blink / wink queuing
            if (this.doInvoluntaryBlinking  && !this._winker.isActive() && this._currentExpression.blinkable) this._winkProcessing();

            // idle mood processing, only when nothing running or in queue
            if (this._idleMode && !this._face.isActive() ) this._moodPostProcessing();
        }
        // ====================================== eye movement =======================================
        /**
         * This queues the next random move.
         */
        private _eyeProcessing() : void {
            var duration = Math.random() * (500 - 200) + 200;  // between 200 & 500 millis
            var delay = Math.random() * (10000 - 5000) + 5000; // between 5 & 10 secs
            var up   = Math.random() * 2 - 1;                  // between -1 & 1
            var left = Math.random() * 2 - 1;                  // between -1 & 1
 
            this.queueEyeRotation(up, left, duration, delay, false);
        }
        /**
         * @param {number} up   - 1 is highest, 0 straightforward, -1 is lowest
         * @param {number} left - 1 is leftmost from the meshes point of view, 0 straightforward, -1 is rightmost
         * @param {number} duration - The time the rotation is to take, in millis (Default 300).
         * @param {number) delay - The time to wait once event is begun execution (Default 0).
         */
        public queueEyeRotation(up : number, left : number, duration = 300, delay = 0, clearQueue = true) : void {
            var stateNames = [];
            var ratios     = [];
            if (up < 0) {
                stateNames.push("DOWN");
                ratios    .push(Math.abs(up));
            } else {
                stateNames.push("UP");
                ratios    .push(up);
            }
                        
            if (left < 0) {
                stateNames.push("RIGHT");
                ratios    .push(Math.abs(left));
            } else {
                stateNames.push("LEFT");
                ratios    .push(left);
            }
                        
            var deformation = new VertexDeformation(Automaton._EYES, ShapeKeyGroup.BASIS, stateNames, ratios, duration, null, null, { millisBefore : delay });
            var series = new EventSeries([deformation]);
            if (clearQueue) this._eyes.clearQueue(true);
            this._eyes.queueEventSeries(series);
        }
        // =================================== winking & blinking ====================================
        /**
         * Called by beforeRender(), unless no wink shape key group, or nothing to do.
         * Also not called in the case when a shape key deformation occurred this frame, to avoid conflicts.
         */
        private static _MAX_INTERVAL = 8000; // millis, 6000 is average according to wikipedia
        private _winkProcessing() : void {
            var delay = Math.random() * (Automaton._MAX_INTERVAL - 2000) + 2000; // between 2000 & 8000 millis 
            this._queueLids(Automaton._BLINK, 10, delay, false);
        }

        /**
         * Indicate the a left side wink should occur at the next available opportunity.
         * @param {number} timeClosed - Millis to stay closed, not including the close itself (Default 10).
         */
        public winkLeft(timeClosed = 50) : void {
            this._queueLids(Automaton._WINK_LEFT, timeClosed);
        }

        /**
         * Indicate the a right side wink should occur at the next available opportunity.
         * @param {number} timeClosed - Millis to stay closed, not including the close itself (Default 10).
         */
        public winkRight(timeClosed = 50) : void {
            this._queueLids(Automaton._WINK_RIGHT, timeClosed);
        }

        /**
         * Indicate that a single blink should occur at the next available opportunity.
         */
        public blink() : void {
            this._queueLids(Automaton._BLINK, 20);
        }

        private static _DEFORM_SPEED =   50; // millis, 100 round trip
        /**
         * @param {number} event   - either blink, wink left, or wink right
         * @param {number} timeClosed - Millis to stay closed, not including the close itself.
         * @param {number) delay - The time to wait once event is begun execution (Default 0).
         */
        private _queueLids(event : number, timeClosed : number, delay = 0, clearQueue = true) : void {
            var deformations : Array<any>;
            switch (event){
                case Automaton._BLINK:
                    if (!this._currentExpression.blinkable) return;
         
                    deformations = [new Deformation(Automaton._WINK, Automaton._BOTH_CLOSED, 1, Automaton._DEFORM_SPEED, null, null, {millisBefore: delay } ),
                                     new BasisReturn(Automaton._WINK, Automaton._DEFORM_SPEED, null, null, {millisBefore: timeClosed} ),
                                   ];
                    break;

                case Automaton._WINK_LEFT:
                    if (!this._currentExpression.winkable) return;
                     
                    deformations = [ new Deformation(Automaton._WINK, Automaton._LEFT, 1, Automaton._DEFORM_SPEED, null, null, { millisBefore : delay } ),
                                     new BasisReturn(Automaton._WINK, Automaton._DEFORM_SPEED, null, null, {millisBefore: timeClosed} ),
                                   ];
                    break;

                case Automaton._WINK_RIGHT:
                    if (!this._currentExpression.winkable) return;
                     
                    deformations = [ new Deformation(Automaton._WINK, Automaton._RIGHT, 1, Automaton._DEFORM_SPEED, null, null, { millisBefore : delay } ),
                                     new BasisReturn(Automaton._WINK, Automaton._DEFORM_SPEED, null, null, {millisBefore: timeClosed} ),
                                   ];
                    break;
            }
                        
            var series = new EventSeries(deformations, 1, 1, Automaton._WINK);
            if (clearQueue) this._winker.clearQueue(true);
            this._winker.queueEventSeries(series);
        }    
        // ====================================== Expressions ========================================
        /**
         * This queues the next change.  When called from beforeRender in idle mode,
         * this only runs when nothing running or queued.
         * @param {boolean} skipChanging - In idle mode, there are a number of degree
         * changes using the same expression.  This can also be called by setCurrentMood().  In that
         * case, these minor changes should not be done.
         */
        private _moodPostProcessing(skipChanging? : boolean) : void {
            var duration = skipChanging ? 250 : 750;
            var delay    = skipChanging ? 0   : Math.random() * 200;

            // section only run by idle mood changing
            if (!skipChanging){
                var amtChange = Math.random() * .3 - .15;  // between -.15 & .15
                if      (this._currentExpDegree >= 0.7) amtChange -= .02;
                else if (this._currentExpDegree <= 0.2) amtChange += .02;
                this._currentExpDegree += amtChange;

                // this is always after exp degree set, cause if mood changed degree always set too
                if (this._randomMode) this._pickAMood();
            }
            var deformation : VertexDeformation;
            if (this._currentExpression.endStateNames.length > 0)
                deformation = new Deformation(Automaton._FACE, this._currentExpression.name, this._currentExpDegree, duration, null, null, { millisBefore : delay });
            else
                deformation = new BasisReturn(Automaton._FACE, duration);

            var series = new EventSeries([deformation]);
             // do not want to clear the potential stall from a grand entrance, which happens when textures already here, e.g. 2nd load
            var clear = this.isVisible && skipChanging;
            this._face.queueEventSeries(series, clear, clear);
        }

        private _pickAMood() : void {
            if (this._numChangesOfCurrentMood++ < this._totChangesOfCurrentMood) return;

            var idx = Math.floor(Math.random() * this._randomExpressions.length);
            this._currentExpression = this.expressions[idx];
            this._numChangesOfCurrentMood = 0;
            this._totChangesOfCurrentMood = Math.floor(Math.random() * (Automaton._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
            this._currentExpDegree = .3; // always have low degree when first changing expression
        }
        // ============================== Public Expressions Methods =================================
        /**
         * To enable / disable idle mood changing mode.  Here the current oscillates by degree.
         * This will turn off random mode, if on, when switched off.
         * @param {boolean} on - The switch.
         */
        public setIdleMode(on : boolean) : void {
            this._idleMode = on;
            if (!on &&  this._randomMode) this.setRandomExpressionSwitching(false);
            
            // force picking of a new current mood, or not when not random
            this._numChangesOfCurrentMood =  Automaton._MAX_CHANGES_FOR_MOOD;
        }
        
        /**
         * Allow automatic switching between expressions loaded which are indicated as 'randomizable'.
         * This will turn on idle mode, if off, when switched on.  Will not switch off idle mode, when switched
         * off, though.
         */
        public setRandomExpressionSwitching(on : boolean) : void {
            this._randomMode = on;
            if (on && !this._idleMode) this.setIdleMode(true);
        }

        /**
         * external call to manually change mood, or at least let the system know what you just queued
         * yourself (useful for speech, so idle mode might resume gracefully).
         * @param {string | Expression} expOrName - Name of the shape key representing the expression to change to or an expression.
         * When it is an Expression & not currently loaded, random & idle ARE turned off.  This is only for Expression development.
         * 
         * Could also be the last one in the series you just queued yourself, if just documenting.
         * @param {number} degree - This is a value 0 - 1, indicating the degree to which max deformation
         * to expression should occur.
         * @param {boolean} justDocumenting - When true you have already submitted your own event series
         * that set the expression, but you want the system to know.
         */
        public setCurrentMood(expOrName : string | Expression, degree : number, justDocumenting? : boolean) : Expression {
            var name = (expOrName instanceof Expression) ?  (<Expression> expOrName).name : <string> expOrName;
            
            // check if the expression has been loaded
            var idx = -1;
            for (var i = 0, len = this.expressions.length; i < len; i++) {
                if (this.expressions[i].name === name) {
                    idx = i;
                    break;
                }
            }
            
            // expression loaded
            if (idx !== -1) {
                this._currentExpDegree = degree;
                this._currentExpression = this.expressions[idx];
                
                if (!justDocumenting) {
                    this._numChangesOfCurrentMood = 0;
                    this._totChangesOfCurrentMood =  Math.floor(Math.random() * (Automaton._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
                    this._moodPostProcessing(true);
                }
                return this._currentExpression;
            }
            // expression passed is not loaded.  Must be in development mode
            else if (expOrName instanceof Expression) {
                this.setIdleMode(false);
                this.setRandomExpressionSwitching(false);
                
                var exp = <Expression> expOrName;
                var options = exp.mirrorReqd ? {mirrorAxes: exp.mirrorAxes} : {};
                var deformation = new VertexDeformation(Automaton._FACE, ShapeKeyGroup.BASIS, exp.endStateNames, exp.endStateRatios, 250, null, null, options);
    
                var series = new EventSeries([deformation]);
                // do not want to clear the potential stall from a grand entrance, which happens when textures already here, e.g. 2nd load
                this._face.queueEventSeries(series, this.isVisible, this.isVisible);
                return <Expression> expOrName;
            
            }
            else {
                BABYLON.Tools.Error("QI.Automaton- " + this.name + " does not have expression: " + name);
                return null;
            
            }

         }
    }
}