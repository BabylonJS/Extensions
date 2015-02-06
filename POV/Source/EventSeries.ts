/// <reference path="./MotionEvent.ts"/>
module POV {
    /** an interface used by SeriesAction.  Implemented by POV.PovRenderer & MORPH.Mesh
     */
    export interface SeriesTargetable{
        queueEventSeries(eSeries : EventSeries) :void;       
    }
    
    /** Provide an action for an EventSeries, for integration into action manager */
    export class SeriesAction extends BABYLON.Action{
        constructor(triggerOptions: any, private _target: SeriesTargetable, private _eSeries : EventSeries, condition?: BABYLON.Condition) {
            super(triggerOptions, condition);
        }
        public execute(evt: BABYLON.ActionEvent): void {
            this._target.queueEventSeries(this._eSeries);
        }
    }

    /** Main class of file 
     *  Many members are public for subclassing, but not intended for external modification (leading _)
     */
    export class EventSeries {
        public  _nEvents : number; // events always loop in ascending order; reduces .length calls   
        private _indexInRun : number;    
        public  _repeatCounter : number;
        private _prorating : boolean;
        public  _proRatingThisRepeat;
        
        /**
         * Validate each of the events passed.
         * @param {Array} _eventSeries - Elements must either be a MotionEvent, Action, or function.
         * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
         * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
         *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
         *                 acceleration when > 1, & deceleration when < 1. (Default 1)
         */
        constructor(public _eventSeries : Array<any>, public _nRepeats = 1, public _initialWallclockProrating = 1.0) {
            this._nEvents = this._eventSeries.length;

            // validate each event
            for (var i = 0; i < this._nEvents; i++){
                if (this._eventSeries[i] instanceof MotionEvent   ) continue;
                if (this._eventSeries[i] instanceof BABYLON.Action) continue;
                if (typeof this._eventSeries[i] === "function"    ) continue;
                BABYLON.Tools.Error("EventSeries:  eventSeries elements must either be a MotionEvent, Action, or function");
            }
            this._prorating = this._initialWallclockProrating !== 1;
            if (this._nRepeats === 1 && this._prorating)
                BABYLON.Tools.Warn("EventSeries: clock prorating ignored when # of repeats is 1");
        }
        
        /**
         * No meaning, except for MORPH subclass
         */
        public hasMultipleParticipants() : boolean{
            return false;
        }
        
        /**
         * Signals ready to start processing. Re-initializes incase of reuse.
         * @param {string} groupName - Unused, for subclassing by MORPH
         */
        public activate(groupName : string) : void{
            this._indexInRun  = -1;
            this._repeatCounter = 0;
            this._proRatingThisRepeat = (this._nRepeats > 1) ? this._initialWallclockProrating : 1.0;
            this.appyProrating();
        }
        
        /**
         * Called to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        public hasMoreEvents(){
            return this._repeatCounter < this._nRepeats;
        }
        
        /**
         * Called to get its next event of the series.  Returns null. if series complete.
         * @param {string} groupName - Unused, for subclassing by MORPH
         * 
         */
        public nextEvent(groupName : string) : any {
            if (++this._indexInRun === this._nEvents){            
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats){
                    this._indexInRun = 0;
                    if (this._prorating){
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats) );
                    }
                    this.appyProrating();

                }else{
                    return null;
                }
            }
            return this._eventSeries[this._indexInRun];
        }
        /**
         * This methods is called on repeats, even if not prorating, so event knows it is a repeat
         */
        private appyProrating() : void{
            // appy to each event each event
            for (var i = 0; i < this._nEvents; i++){
                if (this._eventSeries[i] instanceof MotionEvent){
                    (<MotionEvent>this._eventSeries[i]).setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                }
            }
        }
    }
}