module QI {
    /**
     * See , https://msdn.microsoft.com/en-us/library/ee308751.aspx, for types.
     * This is largely based on BJS Easing.  A few do not make sense, or are not possible.
     * The static MotionEvent.LINEAR is the default for all cases where a Pace is an argument.
     */
    export class Pace {
        // modes
        public static MODE_IN = 0;
        public static MODE_OUT = 1;
        public static MODE_INOUT = 2;

        constructor(public _mode = Pace.MODE_IN) {}

        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        public getCompletionMilestone(currentDurationRatio : number) : number {
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0) return 0;
            else if (currentDurationRatio >= 1) return 1;

            switch (this._mode) {
                case Pace.MODE_IN:
                    return this._compute(currentDurationRatio);
                case Pace.MODE_OUT:
                    return (1 - this._compute(1 - currentDurationRatio));
            }

            if (currentDurationRatio >= 0.5) {
                return (((1 - this._compute((1 - currentDurationRatio) * 2)) * 0.5) + 0.5);
            }

            return (this._compute(currentDurationRatio * 2) * 0.5);
        }

        public getClassName(): string { return "Pace"; } 
        
        public toScript() : string {
            var ret = "new QI." + this.getClassName + "(";
            if (this._mode === Pace.MODE_OUT) ret += "QI.Pace.MODE_OUT";
            else if (this._mode === Pace.MODE_INOUT) ret += "QI.Pace.MODE_INOUT";
            
            return ret + ")";
        }

        /**
         * Perform the method without regard for the mode.  MUST be overridden
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        protected _compute(currentDurationRatio : number) : number {
            return 0;
        }
    }
    //================================================================================================
    export class CirclePace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number) : number {
            currentDurationRatio = Math.max(0, Math.min(1, currentDurationRatio));
            return (1.0 - Math.sqrt(1.0 - (currentDurationRatio * currentDurationRatio)));
        }
        
        public getClassName(): string { return "CirclePace"; } 
    }
    //================================================================================================
    export class CubicPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio: number): number {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio);
        }
        
        public getClassName(): string { return "CubicPace"; } 
    }
    //================================================================================================
    export class ElasticPace extends Pace {
        constructor(public oscillations: number = 3, public springiness: number = 3, mode = Pace.MODE_IN) {
            super(mode);
        }

        /** @override */
        protected  _compute(currentDurationRatio : number): number {
            var num2;
            var num3 = Math.max(0.0, this.oscillations);
            var num = Math.max(0.0, this.springiness);

            if (num == 0) {
                num2 = currentDurationRatio;
            }else {
                num2 = (Math.exp(num * currentDurationRatio) - 1.0) / (Math.exp(num) - 1.0);
            }
            return (num2 * Math.sin(((6.2831853071795862 * num3) + 1.5707963267948966) * currentDurationRatio));
        }
        
        public getClassName(): string { return "ElasticPace"; } 
    }
    //================================================================================================
    export class ExponentialPace extends Pace {
        constructor(public exponent: number = 2, mode = Pace.MODE_IN) {
            super(mode);
        }

        /** @override */
        protected _compute(currentDurationRatio : number) : number {
            if (this.exponent <= 0) {
                return currentDurationRatio;
            }

            return ((Math.exp(this.exponent * currentDurationRatio) - 1.0) / (Math.exp(this.exponent) - 1.0));
        }
        
        public getClassName(): string { return "ExponentialPace"; } 
    }
    //================================================================================================
    export class PowerPace extends Pace {
        constructor(public power: number = 2, mode = Pace.MODE_IN) {
            super(mode);
        }

        /** @override */
        protected _compute(currentDurationRatio : number) : number {
            var y = Math.max(0.0, this.power);
            return Math.pow(currentDurationRatio, y);
        }
        
        public getClassName(): string { return "PowerPace"; } 
    }
    //================================================================================================
    export class QuadraticPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio) : number {
            return (currentDurationRatio * currentDurationRatio);
        }
        
        public getClassName(): string { return "QuadraticPace"; } 
    }
    //================================================================================================
    export class QuarticPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio : number) : number {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio);
        }
        
        public getClassName(): string { return "QuarticPace"; } 
    }
    //================================================================================================
    export class QuinticPace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio : number) : number {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio);
        }
        
        public getClassName(): string { return "QuinticPace"; } 
    }
    //================================================================================================
    export class SinePace extends Pace {
        /** @override */
        protected _compute(currentDurationRatio : number) : number {
            return (1.0 - Math.sin(1.5707963267948966 * (1.0 - currentDurationRatio)));
        }
        
        public getClassName(): string { return "SinePace"; } 
    }
    //================================================================================================
    export class BezierCurvePace extends Pace {
        constructor(public x1: number= 0, public y1: number= 0, public x2: number= 1, public y2: number= 1, mode = Pace.MODE_IN) {
            super(mode);
        }

        /** @override */
        protected _compute(currentDurationRatio : number): number {
            return BABYLON.BezierCurve.interpolate(currentDurationRatio, this.x1, this.y1, this.x2, this.y2);
        }
        
        public getClassName(): string { return "BezierCurvePace"; } 
    }
    //================================================================================================
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */
    export class SteppedPace extends Pace {

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
            super(Pace.MODE_IN);

            // argument validations for JavaScript
            if (!(this.completionRatios instanceof Array) || !(this.durationRatios instanceof Array)) BABYLON.Tools.Error("QI.SteppedPace: ratios not arrays");
            if (this.completionRatios.length !== this.durationRatios.length) BABYLON.Tools.Error("QI.SteppedPace: ratio arrays not of equal length");

            this.steps = this.completionRatios.length;
            if (this.steps === 0) BABYLON.Tools.Error("QI.SteppedPace: ratio arrays cannot be empty");

            var cRatio : number, dRatio : number, prevD : number = -1;
            for (var i = 0; i < this.steps; i++){
                cRatio = this.completionRatios[i];
                dRatio = this.durationRatios  [i];
                if (cRatio <= 0 || dRatio <= 0) BABYLON.Tools.Error("QI.SteppedPace: ratios must be > 0");
                if (cRatio >  1 || dRatio >  1) BABYLON.Tools.Error("QI.SteppedPace: ratios must be <= 1");
                if (prevD >= dRatio) BABYLON.Tools.Error("QI.SteppedPace: durationRatios must be in increasing order");
                prevD = dRatio;
            }
            if (cRatio !== 1 || dRatio !== 1) BABYLON.Tools.Error("QI.SteppedPace: final ratios must be 1");

            this.incremetalCompletionBetweenSteps = [this.completionRatios[0]]; // elements can be negative for 'hicups'
            this.incremetalDurationBetweenSteps   = [this.durationRatios  [0]];
            for (var i = 1; i < this.steps; i++){
                this.incremetalCompletionBetweenSteps.push(this.completionRatios[i] - this.completionRatios[i - 1]);
                this.incremetalDurationBetweenSteps  .push(this.durationRatios  [i] - this.durationRatios  [i - 1]);
            }
            Object.freeze(this);  // make immutable
        }

        /** @override
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        public getCompletionMilestone(currentDurationRatio : number) : number {
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
        
        public getClassName(): string { return "SteppedPace"; } 
        /** @override */
        public toScript() : string {
            var comps = "";
            var durs  = "";
            for(var i = 0, len = this.completionRatios.length; i < len; i++) {
                if (i > 0) { comps += ", "; durs += ", "; }
                comps += this.completionRatios[i];
                durs  += this.durationRatios[i];
            }
            
            return "new QI.SteppedPace([" + comps + "], [" + durs + "])";
        }
    }
}