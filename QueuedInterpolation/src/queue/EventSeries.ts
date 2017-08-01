/// <reference path="./MotionEvent.ts"/>
module QI {
    /** An interface used by SeriesAction.  Implemented by QI.POVProcessor & QI.Mesh
     */
    export interface SeriesTargetable {
        /** Method required by an object to be the target of a QI.SeriesAction (QI.POVProcessor & QI.Mesh)
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        queueEventSeries(eSeries : EventSeries, clearQueue? : boolean, stopCurrentSeries? : boolean) : void;
    }

    /** Provide an action for an EventSeries, for integration into action manager */
    export class SeriesAction extends BABYLON.Action {
        /**
         * @param {any} triggerOptions - passed to super, same as any other Action
         * @param {SeriesTargetable} _target - The object containing the event queue.  Using an interface for MORPH sub-classing.
         * @param {EventSeries} _eSeries - The event series that the action is to submit to the queue.
         * @param {boolean} _clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} _stopCurrentSeries - When true, stop the current MotionSeries too.
         * @param {boolean} condition - passed to super, same as any other Action
         */
        constructor(triggerOptions: any, private _target: SeriesTargetable, private _eSeries : EventSeries, private _clearQueue? : boolean, private _stopCurrentSeries? : boolean, condition?: BABYLON.Condition) {
            super(triggerOptions, condition);
        }
        public execute(evt: BABYLON.ActionEvent): void {
            this._target.queueEventSeries(this._eSeries, this._clearQueue, this._stopCurrentSeries);
        }
    }

    /** Internal helper class used by EventSeries to support a multi-group EventSeries */
    class ParticipatingGroup{
        _indexInRun  = -99; // ensure isReady() initially returns false
        _highestIndexInRun = -1;

        constructor (public groupName : string) {}
        public isReady    () : boolean { return this._indexInRun === -1; }
        public runComplete() : boolean { return this._indexInRun > this._highestIndexInRun; }
        public activate() : void{
            this._indexInRun = -1;
        }
    }

    /**
     *  The object processed by each of the Processors.
     */
    export class EventSeries {
        private _syncPartner : EventSeries; // not part of constructor, since cannot be in both partners constructors, use setSeriesSyncPartner()
        private _partnerReady = true;

        private _nEvents : number; // events always loop in ascending order; reduces .length calls
        private _indexInRun : number;
        private _repeatCounter : number;
        private _prorating : boolean;
        private _proRatingThisRepeat : number;

        // group elements
        private _groups = new Array<ParticipatingGroup>();
        private _nGroups = 0;
        private _everybodyReady : boolean;

        /**
         * Validate each of the events passed.
         * @param {Array} _events - Elements must either be a MotionEvent, Action, or function. (public for PoseProcessor)
         * @param {number} _nRepeats - Number of times to run through series elements.  There is sync across runs. (Default 1)
         * @param {number} _initialWallclockProrating - The factor to multiply the duration of a MotionEvent before returning.
         *                 Amount is decreased or increased across repeats, so that it is 1 for the final repeat.  Facilitates
         *                 acceleration when > 1, & deceleration when < 1. (Default 1)
         * @param {string} _groupForFuncActions - should there be any functions or actions use this group to process them.  The
         *                 default group is the built-in one of BeforeRenderer.  This might always work, if you
         *                 wish the function to run after a deformation.  This never needs to be specified unless it is a QI.Mesh.
         * @param {string} _debug - Write progress messages to console when true (Default false)
         */
        constructor(public _events : Array<any>, private _nRepeats = 1, private _initialWallclockProrating = 1.0, private _groupForFuncActions = PovProcessor.POV_GROUP_NAME, public _debug = false) {
            this._nEvents = this._events.length;

            this._prorating = this._initialWallclockProrating !== 1;
            if (this._nRepeats === 1 && this._prorating)
                BABYLON.Tools.Warn("EventSeries: clock prorating ignored when # of repeats is 1");

            // go through each event in series, building up the unique set shape key groups or skeleton participating, this._groups
            var passed : boolean;
            for (var i = 0; i < this._nEvents; i++){

                // validate the elements in series
                passed = false;
                if (this._events[i] instanceof MotionEvent        ) passed = true;
                else if (this._events[i] instanceof BABYLON.Action) passed = true;
                else if (typeof this._events[i] === "function"    ) passed = true;
                if (!passed) {
                    BABYLON.Tools.Error("EventSeries:  events must either be a MotionEvent, Action, or function.  Problem idx: " + i);
                    return;
                }

                var groupName = (this._events[i] instanceof MotionEvent) ? (<MotionEvent>this._events[i])._groupName : this._groupForFuncActions;
                this._addGroupAsRequired(groupName, i);
                if (this._events[i] instanceof BABYLON.Action) (<BABYLON.Action> this._events[i])._prepare();
            }
        }

        public toString() : string {
            var ret = "number of events: "  + this._nEvents + ", repeats: " + this._nRepeats + ", # groups: " + this._nGroups;
            for (var i = 0; i < this._nEvents; i++) {
                if (this._events[i] instanceof MotionEvent)
                    ret += "\n\t\t" + i + "- " + this._events[i].toString();
               else
                    ret += "\n\t\t" + i + "- group: "  + this._groupForFuncActions + ", " + this._events[i].toString();
            }
            return ret;
        }
        // =========================== constructor / queuing helper methods ===========================
        /**
         * Used by constructor for each event.  The first time a particular group (skeleton / shape key group)
         * is encountered, a ParticipatingGroup object is instanced, and added to groups property.
         */
        private _addGroupAsRequired(groupName : string, eventIdx : number) : void {
            var pGroup : ParticipatingGroup = null;

            for (var g = 0, len = this._groups.length; g < len; g++){
                if (this._groups[g].groupName === groupName){
                    pGroup = this._groups[g];
                    break;
                }
            }
            if (pGroup === null){
                pGroup = new ParticipatingGroup(groupName);
                this._groups.push(pGroup);
                this._nGroups++;
            }
            pGroup._highestIndexInRun = eventIdx;
        }

        /**
         * @returns {boolean} True, when more than one processor / queue is involved.
         */
        public hasMultipleParticipants() : boolean {
            return this._nGroups > 1;
        }

        /**
         * called by QI.Mesh, to figure out which group this should be queued on.
         * @param {string} groupName - This is the group name to see if it has things to do in event series.
         */
        public isGroupParticipating(groupName : string) : boolean {
            for (var g = 0; g < this._nGroups; g++) {
                if (this._groups[g].groupName === groupName) return true;
            }
            return false;
        }
        // =============================== activation / partner methods ===============================
        /**
         * @param {EventSeries} syncPartner - EventSeries which should start at the same time as this one.
         */
        public setSeriesSyncPartner(syncPartner : EventSeries) : void {
            this._syncPartner = syncPartner;
            this._partnerReady = false;

            syncPartner._syncPartner = this;
        }
        /**
         *  Called by the each of the syncPartners to detect that both are waiting for each other.
         */
        private _setPartnerReady() : void {
            this._syncPartner._partnerReady = true;
        }

        /**
         * Signals ready to start processing. Re-initializes incase of reuse. Also evaluates if everybodyReady, when using groups
         * @param {string} groupName - This is the group name saying it is ready.
         * @param {boolean} enableDebug -  This allows turning on debug by POVProcessor after constructor, if QI.Mesh Debug enabled
         */
        public activate(groupName : string, enableDebug? : boolean) : void {
            this._indexInRun  = -1;
            this._repeatCounter = 0;
            this._proRatingThisRepeat = (this._nRepeats > 1) ? this._initialWallclockProrating : 1.0;
            this._appyProrating();

            // evaluate if everybodyReady
            this._everybodyReady = true;
            for (var g = 0; g < this._nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    this._groups[g].activate();
                else this._everybodyReady = this._everybodyReady && this._groups[g].isReady();
            }

            // if everybody ready, tell that to partner
            if (this._everybodyReady && this._syncPartner) this._setPartnerReady();

            if (enableDebug) this._debug = true;
            if (this._debug) BABYLON.Tools.Log("EventSeries: series activated by " + groupName + ", _everybodyReady: " + this._everybodyReady + ", _partnerReady: " + this._partnerReady);
        }
        // ===================================== processor methods ====================================
        /**
         * Called to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        public hasMoreEvents() : boolean {
            return this._repeatCounter < this._nRepeats;
        }

        /**
         * Called to get its next event of the series.  Returns null. if series complete.
         * @param {string} groupName - Unused, for subclassing by MORPH
         *
         */
        public nextEvent(groupName : string) : any {
            // return nothing till all groups signal they are ready to start
            if (!this._everybodyReady || ! this._partnerReady) {
                if (this._debug) BABYLON.Tools.Log("EventSeries: nextEvent, not everybody or partner ready");
                return null;
            }

            if (this.hasMultipleParticipants()) {
                return this._nextGroupEvent(groupName);
            }
            // less complicated method when there are not coordinated events with multiple groups
            if (++this._indexInRun === this._nEvents){
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats){
                    this._indexInRun = 0;
                    if (this._prorating){
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats) );
                    }
                    this._appyProrating();

                }else{
                    return null;
                }
            }
            if (this._debug)
                BABYLON.Tools.Log("EventSeries: nextEvent " + this._indexInRun + " in series returned");

            return this._events[this._indexInRun];
        }

        /**
         * apply prorating to each event, even if not prorating, so event knows it is a repeat or not
         */
        private _appyProrating() : void {
            // appy to each event each event
            for (var i = 0; i < this._nEvents; i++){
                if (this._events[i] instanceof MotionEvent){
                    (<MotionEvent>this._events[i]).setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                }
            }
        }
        /**
         * more complicated method used when there are multiple groups.
         * @param {string} groupName - Name of the group calling for its next event
         *
         */
        private _nextGroupEvent(groupName : string) : any {
            var pGroup : ParticipatingGroup;
            var allGroupsRunComplete = true;

            // look up the appropriate ParticipatingGroup for below & set allGroupsRunComplete
            for (var g = 0; g < this._nGroups; g++) {
                allGroupsRunComplete = allGroupsRunComplete && this._groups[g].runComplete();

                // no break statement inside block, so allGroupsRunComplete is valid
                if (this._groups[g].groupName === groupName) {
                    pGroup = this._groups[g];
                }
            }

            if (allGroupsRunComplete){
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    for (var g = 0; g < this._nGroups; g++) {
                        this._groups[g].activate();
                    }
                    if (this._initialWallclockProrating !== 1) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats) );
                    }
                    if (this._debug) BABYLON.Tools.Log("EventSeries: set for repeat # " + this._repeatCounter);
                }else{
                 if (this._debug) console.log("EventSeries: Series complete");
                 this._everybodyReady = false; // ensure that nothing happens until all groups call activate() again
                 if (this._syncPartner) this._partnerReady = false;
                }
            }

            if (!pGroup.runComplete()) {
                // test if should declare complete
                if (pGroup._indexInRun === pGroup._highestIndexInRun) {
                    pGroup._indexInRun++;
                    if (this._debug)
                        BABYLON.Tools.Log("EventSeries: group "  + pGroup.groupName + " has completed series.");
                    return null;
                }
                for (var i = pGroup._indexInRun + 1; i < this._nEvents; i++){
                    var groupName = (this._events[i] instanceof MotionEvent) ? (<MotionEvent>this._events[i])._groupName : this._groupForFuncActions;
                    if (pGroup.groupName === groupName){
                        pGroup._indexInRun = i;
                        if (this._events[i] instanceof MotionEvent){
                            (<MotionEvent>this._events[i]).setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                        }
                        if (this._debug)
                            BABYLON.Tools.Log("EventSeries: " + i + " in series returned: " + name + ", allGroupsRunComplete " + allGroupsRunComplete + ", everybodyReady " + this._everybodyReady);

                        return this._events[i];
                    }
                }
            }else return null;
        }
    }
}