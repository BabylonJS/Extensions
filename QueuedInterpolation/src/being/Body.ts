/// <reference path="./Eyes.ts"/>

/// <reference path="../Mesh.ts"/>
module BEING{
    
    export class Body extends QI.Mesh {
        // blink strings for group name & morph targets
        private static _WINK         = "WINK";  // shape key group name
        private static _BOTH_CLOSED  = "BOTH";
        private static _LEFT         = "LEFT";
        private static _RIGHT        = "RIGHT";
        
        // the list of possible blink statuses
        private static _BLINK_DISABLED        = -3;
        private static _WINK_BLINK_INPROGRESS = -2;
        private static _NOTHING_QUEUED        = -1;
        private static _BLINK_QUEUED          =  0;
        private static _WINK_LEFT_QUEUED      =  1;
        private static _WINK_RIGHT_QUEUED     =  2;
        
        // blink time / duration settings
        private static _DEFORM_SPEED =   50; // millis, 100 round trip
        private static _CLOSE_PAUSE  =   10; // millis
        private static _MAX_INTERVAL = 8000; // millis, 6000 is average according to wikipedia
        
        // expressions
        public static _FACE = "FACE"; // shape key group name
        private static _MAX_CHANGES_FOR_MOOD = 10;
        
        // instance properties
        public eyes : Eyes; // this is not actually used here, but available for external control
        
        private _winker : QI.ShapeKeyGroup;
        private _winkStatus : number;
        private _doInvoluntaryBlinking = false; // turned on when WINK shape key found
        private _blinkInterval : number;    
        private _lastBlink : number;
        private _winkCloseTime : number;
        private _stdBlinkSeries : QI.EventSeries; // prebuilt event series
        
        private _face : QI.ShapeKeyGroup;
        public   hasExpressions : boolean;
        public   expressionNames = new Array<string>();
        private _winkableExpressions = new Array<boolean>();
        private _currentExpressionIdx = 0;
        private _currentExpDegree = 0;
        
        private _continuousMoodChanging = false;
        private _numChangesOfCurrentMood : number;
        private _totChangesOfCurrentMood : number;
        
        // no need for a constructor, just use super's & subclasses made by TOB
        
        // ====================================== intializing ========================================
        /** neither the child eye meshes nor the shapekeys will be defined until the subclass constructor has run, so this put here */
        public postConstruction() {
            // assigned null when these are not broken out
            this.eyes = Eyes.getInstance(this);      
            this._winker = this.getShapeKeyGroup(Body._WINK);
            
            // pre-compute combo keys, and pre-assign series
            if (this._winker){
                this._winker.addComboDerivedKey(QI.ShapeKeyGroup.BASIS, [Body._LEFT, Body._RIGHT], [1, 1], null, Body._BOTH_CLOSED);
                
                var deformations : Array<any>;   
                var ref = this;
                
                deformations = [ new QI.Deformation      (Body._WINK, Body._BOTH_CLOSED, Body._DEFORM_SPEED),
                                 new QI.VertexDeformation(Body._WINK, Body._BOTH_CLOSED, [QI.ShapeKeyGroup.BASIS], Body._DEFORM_SPEED, Body._CLOSE_PAUSE, [1]),
                                 function(){ref._resetForNextBlink();}
                               ];
                this._stdBlinkSeries = new QI.EventSeries(deformations, 1, 1, Body._WINK);
            }
            this._doInvoluntaryBlinking = true;
            this._resetForNextBlink(); 
            
            // expressions
            this.hasExpressions = this._mapAvailableExpressions();
            this.setContinuousMoodChanging(this.hasExpressions);
        }   
          
        /**
         * Broken out from postConstruction for modularity.  Verifies mesh actually has expressions, and lists them.
         */
        private _mapAvailableExpressions() : boolean {
            this._face = this.getShapeKeyGroup(Body._FACE);
            if (!this._face) return false;
            
            var stateNames = this._face.getStates();
            
            // The first expression is None:
            this.expressionNames.push("NO_EXPRESSION");
            
             for (var i = 1, len = stateNames.length; i < len; ++i){
                 if (stateNames[i].indexOf("_EXP") > -1){
                     this.expressionNames.push(stateNames[i]);
                     this._winkableExpressions.push(stateNames[i].indexOf("_WINKABLE") > -1);
                 }
            }
            Object.freeze(this.expressionNames);  // make immutable, to allow direct access

            return this.expressionNames.length > 0;
        }
        // ============================ beforeRender callback & tracking =============================
        /** @override */
        public beforeRender() : void {
            super.beforeRender();
            
            // avoid queuing issues of eye lids, if a deformation in progress ( possibly a wink / blink too )
            if (this._shapeKeyChangesMade) return;
            
            // blink / wink queuing
            if (this._winker && this._winkStatus !== Body._BLINK_DISABLED) this._winkPostProcessing();
            
            // continuous mood processing, only when nothing running or in queue
            if (this._continuousMoodChanging && !this._face.isActive() ) this._moodPostProcessing();
        }
        // =================================== winking & blinking ====================================
        /** 
         * Called by beforeRender(), unless no wink shape key group, or nothing to do.
         * Also not called in the case when a shape key deformation occurred this frame, to avoid conflicts.
         */       
        private _winkPostProcessing() {
            var ref = this;
            var series : QI.EventSeries;
            var deformations : Array<any>;
            switch (this._winkStatus){
                case Body._NOTHING_QUEUED:
                    // negative test, since success is breaking
                    if (QI.TimelineControl.Now - this._lastBlink < this._blinkInterval){
//                        console.log("TimelineControl.Now " + QI.TimelineControl.Now + ", this._lastBlink " + this._lastBlink + ", this._blinkInterval" + this._blinkInterval);
                        break;
                    } 

                case Body._BLINK_QUEUED: 
                    if (this._winkCloseTime < 0) series = this._stdBlinkSeries; 
                    else{
                        deformations = [ new QI.Deformation      (Body._WINK, Body._BOTH_CLOSED, Body._DEFORM_SPEED),
                                         new QI.VertexDeformation(Body._WINK, Body._BOTH_CLOSED, [QI.ShapeKeyGroup.BASIS], Body._DEFORM_SPEED, this._winkCloseTime, [1]),
                                         function(){ref._resetForNextBlink();}
                                       ];
                        series = new QI.EventSeries(deformations, 1, 1, Body._WINK);
                    }
                    break;
                    
                case Body._WINK_LEFT_QUEUED:
                    deformations = [ new QI.Deformation      (Body._WINK, Body._LEFT, Body._DEFORM_SPEED),
                                     new QI.VertexDeformation(Body._WINK, Body._LEFT, [QI.ShapeKeyGroup.BASIS], Body._DEFORM_SPEED, this._winkCloseTime, [1]),
                                     function(){ref._resetForNextBlink();}
                                   ];
                    series = new QI.EventSeries(deformations, 1, 1, Body._WINK);
                    break;
                    
                case Body._WINK_RIGHT_QUEUED:
                    deformations = [ new QI.Deformation      (Body._WINK, Body._RIGHT, Body._DEFORM_SPEED),
                                     new QI.VertexDeformation(Body._WINK, Body._RIGHT, [QI.ShapeKeyGroup.BASIS], Body._DEFORM_SPEED, this._winkCloseTime, [1]),
                                     function(){ref._resetForNextBlink();}
                                   ];
                    series = new QI.EventSeries(deformations, 1, 1, Body._WINK);
                    break;
            }
                
            if (series){
//                series._debug = true;
                this.queueEventSeries(series);
                this._winkStatus = Body._WINK_BLINK_INPROGRESS;
            }            
        }
        
        /** function added to the end of a wink event series, to schedule the next involuntary blink */
        private _resetForNextBlink(){
            if (this._doInvoluntaryBlinking){
                var action = this._winkableExpressions[this._currentExpressionIdx] ? Math.random() : 1;
                
                // wink 10% of the time, when current expression is winkable (it would be dumb to wink when crying)
                if (action < 0.05)
                       this.winkLeft(700);
                else if (action < 0.1)
                         this.winkRight(700);
                    
                // otherwise set up for the next blink
                else{
                    this._winkStatus = Body._NOTHING_QUEUED; 
                    this._lastBlink = QI.TimelineControl.Now;
                    this._blinkInterval = Math.random() * (Body._MAX_INTERVAL - 1000) + 1000; // between 1000 & 8000 millis
                    this._winkCloseTime = -1;
                }
            } else this._winkStatus = Body._BLINK_DISABLED;     
        }
        
        /**
         * Indicate the a left side wink should occur at the next available opportunity.
         * When called externally, can be done without involuntary blinking enabled.
         * @param {number} closeTime - Millis to stay closed, not including the close itself.
         */
        public winkLeft(closeTime : number) {
            if (!this._winker) throw this.name + " has no shapekeygroup WINK";
            this._winkStatus = Body._WINK_LEFT_QUEUED;
            this._winkCloseTime = closeTime;
        }
        
        /**
         * Indicate the a right side wink should occur at the next available opportunity.
         * When called externally, can be done without involuntary blinking enabled.
         * @param {number} closeTime - Millis to stay closed, not including the close itself.
         */
        public winkRight(closeTime : number) {
            if (!this._winker) throw this.name + " has no shapekeygroup WINK";
            this._winkStatus = Body._WINK_RIGHT_QUEUED;
            this._winkCloseTime = closeTime;
        }
        
        /**
         * Indicate that a single blink should occur at the next available opportunity.
         */
        public blink(closeTime = -1) {
            if (!this._winker) throw this.name + " has no shapekeygroup WINK";
            this._winkStatus = Body._BLINK_QUEUED;
            this._winkCloseTime = closeTime;
        }
        
        /**
         * Indicate whether involuntary blinking should occur.
         * @param {boolean} enabled - when true 
         */
        public involuntaryBlinkingEnabled(enabled : boolean) {
            if (!this._winker && enabled) throw this.name + " has no shapekeygroup WINK";

            if (enabled) {
                if (!this._doInvoluntaryBlinking) {
                    this._doInvoluntaryBlinking = true;
                    this._winkStatus = Body._NOTHING_QUEUED; 
                    this._resetForNextBlink();
                }
            }else this._doInvoluntaryBlinking = false; 
        }
        // ====================================== Expressions ========================================
        /**
         * This queues the next change.  When called from beforeRender / continuous Mood changing,
         * this only runs when nothing running or queued.
         * @param {boolean} skipChanging - In continuous mood changing, there are a number of degree
         * changes using the same expression.  This can also be called by setCurrentMood().  In that
         * case, these minor changes should not be done.
         */ 
        private _moodPostProcessing(skipChanging? : boolean) : void {
            var duration = skipChanging ? 250 : 750;
            var delay    = skipChanging ? 0   : Math.random() * 200;
            
            // section only run by continuous mood changing
            if (!skipChanging){
                var amtChange = Math.random() * 3 - 1.5;  // between -1.5 & 1.5
                if      (this._currentExpDegree >= 7) amtChange -= 2;
                else if (this._currentExpDegree <= 2) amtChange += 2;
                this._currentExpDegree += amtChange;
                
                // this is always after exp degree set, cause if mood changed degree always set too
                this._pickAMood();
            }
            var deformation : QI.VertexDeformation;
            if (this._currentExpressionIdx !== 0)
                deformation = new QI.VertexDeformation(Body._FACE, QI.ShapeKeyGroup.BASIS, [this.expressionNames[this._currentExpressionIdx]], duration, delay, [this._currentExpDegree / 9]);
            else
                deformation = new QI.BasisReturn(Body._FACE, duration, 0);
            
            var series = new QI.EventSeries([deformation]);
            this._face.queueEventSeries(series, skipChanging, skipChanging);
        }
        
        private _pickAMood() : boolean {
            if (this._numChangesOfCurrentMood++ < this._totChangesOfCurrentMood) return false;
            
            this._currentExpressionIdx = Math.floor(Math.random() * this.expressionNames.length);
            this._numChangesOfCurrentMood = 0;
            this._totChangesOfCurrentMood = Math.floor(Math.random() * (Body._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
            this._currentExpDegree = 3; // always have low degree when first changing expression
            return true;
        }
        // ============================== Public Expressions Methods =================================
        /**
         * To enable / disable continuous mood changing mode.
         * @param {boolean} on - The switch.
         */
        public setContinuousMoodChanging(on : boolean) : void {
            if (!this.hasExpressions && on) throw this.name + " does not have expressions";
            this._continuousMoodChanging = on;
            this._numChangesOfCurrentMood = Body._MAX_CHANGES_FOR_MOOD;  // force picking of a new current mood
        }                
        
        /**
         * external call to manually change mood, or at least let the system know what you just queued
         * yourself (useful for speech, so continous mood might resume gracefully).
         * @param {string} expression - Name of the shape key representing the expression to change to, or the
         * last one in the series you just queued yourself.
         * @param {number} degree - This is a value 0 - 1, indicating the degree to which max deformation
         * to expression should occur.
         * @param {boolean} justDocumenting - When true you have already submitted your own event series
         * that set the expression, but you want the system to know.
         */
        public setCurrentMood(expression : string, degree : number, justDocumenting? : boolean) : void {
            var idx = -1;
            for (var i = 0, len = this.expressionNames.length; i < len; i++) {
                if (this.expressionNames[i] === expression) {
                    idx = i;
                    break;
                }
            }
            if (idx === -1) throw this.name + " does not have expression: " + expression;
            
            this._currentExpressionIdx = idx;
            this._currentExpDegree = degree;
            this._numChangesOfCurrentMood = 0;
            this._totChangesOfCurrentMood =  Math.floor(Math.random() * (Body._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
            if (!justDocumenting) this._moodPostProcessing(true);
        }
    }  
}