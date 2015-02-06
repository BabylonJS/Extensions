module POV {
    /** 
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */    
    export class Pace {
        // Constants
        public static LINEAR = new Pace([1.0], [1.0]);

        // Members
        public steps : number; 
        public incremetalCompletionBetweenSteps : Array<number>;
        public incremetalDurationBetweenSteps   : Array<number>;

        /**
         * @immutable, reusable
         * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
         * @param {Array} durationRatios   - values from (> 0 to 1.0), MUST increase from left to right
         */
        constructor(public completionRatios : Array<number>, public durationRatios : Array<number>) {
            // argument validations for JavaScript
            if (!(this.completionRatios instanceof Array) || !(this.durationRatios instanceof Array)) BABYLON.Tools.Error("Pace: ratios not arrays");
            if (this.completionRatios.length !== this.durationRatios.length) BABYLON.Tools.Error("Pace: ratio arrays not of equal length");
        
            this.steps = this.completionRatios.length;        
            if (this.steps === 0) BABYLON.Tools.Error("Pace: ratio arrays cannot be empty");
        
            var cRatio : number, dRatio : number, prevD : number = -1;
            for (var i = 0; i < this.steps; i++){
                cRatio = this.completionRatios[i];
                dRatio = this.durationRatios  [i];
                if (cRatio <= 0 || dRatio <= 0) BABYLON.Tools.Error("Pace: ratios must be > 0");
                if (cRatio >  1 || dRatio >  1) BABYLON.Tools.Error("Pace: ratios must be <= 1");
                if (prevD >= dRatio) BABYLON.Tools.Error("Pace: durationRatios must be in increasing order");
                prevD = dRatio;
            }
            if (cRatio !== 1 || dRatio !== 1) BABYLON.Tools.Error("Pace: final ratios must be 1");
        
            this.incremetalCompletionBetweenSteps = [this.completionRatios[0]]; // elements can be negative for 'hicups'
            this.incremetalDurationBetweenSteps   = [this.durationRatios  [0]];
            for (var i = 1; i < this.steps; i++){
                this.incremetalCompletionBetweenSteps.push(this.completionRatios[i] - this.completionRatios[i - 1]);
                this.incremetalDurationBetweenSteps  .push(this.durationRatios  [i] - this.durationRatios  [i - 1]);
            }       
            Object.freeze(this);  // make immutable
        }
    
        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        public getCompletionMilestone(currentDurationRatio : number) : number{
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0) return 0;
            else if (currentDurationRatio >= 1) return 1;
        
            var upperIdx = 0;  // ends up being an index into durationRatios, 1 greater than highest obtained
            for (; upperIdx < this.steps; upperIdx++){
                if (currentDurationRatio < this.durationRatios[upperIdx]) 
                    break;
            }

            var baseCompletion = (upperIdx > 0) ? this.completionRatios[upperIdx - 1] : 0;        
            var baseDuration   = (upperIdx > 0) ? this.durationRatios  [upperIdx - 1] : 0; 
            var interStepRatio = (currentDurationRatio - baseDuration) / this.incremetalDurationBetweenSteps[upperIdx];
        
            return baseCompletion + (interStepRatio * this.incremetalCompletionBetweenSteps[upperIdx]);
        }  
    }    
}