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
        public static STOCK          = 0;
        public static CUSTOM         = 1;
        public static VISEME         = 2;
        public static SPEECH_CAPABLE = 3;

        // stock expressions
        public static NONE       = new Expression("NONE"      , true , true , false, [], [], null, 0);
        public static ANGRY      = new Expression("ANGRY"     , false, true , true , ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "SYMMETRY_LEFT_UP"], [1.85, 0.3, 1.85, -0.3, 1.4, 1, -0.2, 1, 0.1], "---Y--Y--", Expression.STOCK);
        public static CRYING     = new Expression("CRYING"    , false, false, false, ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP"], [-1, 1.4, -0.2, -0.2, 1.2, 1.2, 1.25, -0.65], "Y-YY---Y", Expression.STOCK);
        public static DISGUSTED  = new Expression("DISGUSTED" , false, true , true , ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "WINK_LEFT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP"], [0.95, 0.05, 0.55, 1, 0.45, -0.1, 1.35, 1.3, -0.1, 0.2, -1], "-----Y--Y-Y", Expression.STOCK);
        public static HAPPY      = new Expression("HAPPY"     , true , true , true , ["CHEEKS_HIGH", "CHEEKS_PUMP", "EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE", "SYMMETRY_CHIN_LEFT", "SYMMETRY_LEFT_UP", "SYMMETRY_RIGHT_UP"], [0.8, 0.25, -0.8, -0.1, 0.15, 0.25, -0.45, 0.5, 0.7, -0.5, -0.25, 0.4, -0.1, 0.1, 0.2], "--YY--Y--YY-X--", Expression.STOCK);
        public static LAUGH      = new Expression("LAUGH"     , true , true , true , ["CHEEKS_HIGH", "EYEBROWS_ANGRY", "EYELIDS_SQUINT", "NOSE_FLARE", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.8, -1, -0.15, 0.55, 0.45, -0.25, 0.5, 0.85, -1], "-YY--Z--X", Expression.STOCK);
        public static PPHPHT     = new Expression("PPHPHT"    , false, true , false, ["CHEEKS_HIGH", "CHEEKS_SUCK", "EYELIDS_SQUINT", "NOSE_FLARE", "TONGUE_STUCK_OUT", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.5, 1, 0.5, 1, 1.05, 0.5, 1], null, Expression.STOCK);
        public static SAD        = new Expression("SAD"       , false, true , true , ["CHEEKS_HIGH", "CHEEKS_PUMP", "CHEEKS_SUCK", "EYEBROWS_ANGRY", "MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_UP", "MOUTH_PUCKER", "MOUTH_WIDE", "SYMMETRY_CHIN_LEFT", "SYMMETRY_RIGHT_UP"], [-1.45, -0.35, 0.05, -1, -0.35, -0.4, 0.65, -0.3, 0.25, 0.2, -0.1], "YX-YYY-X--Y", Expression.STOCK);
        public static SCARED     = new Expression("SCARED"    , false, false, true , ["CHEEKS_HIGH", "EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "WINK_LEFT", "WINK_RIGHT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_UP", "SYMMETRY_CHIN_LEFT", "SYMMETRY_RIGHT_UP"], [-0.05, 1.25, 1.75, -0.65, -0.6, -0.25, 0.35, -0.6, -0.65, 0.05], "Y--YYY-YX-", Expression.STOCK);
        public static SKEPTICAL  = new Expression("SKEPTICAL" , false, false, true , ["EYEBROWS_RAISED_LEFT", "EYEBROWS_RAISED_RIGHT", "WINK_RIGHT", "NOSE_FLARE", "SYMMETRY_CHIN_LEFT", "SYMMETRY_RIGHT_UP"], [-0.65, 0.95, -0.35, -0.25, -0.2, 0.15], "Y-YYX-", Expression.STOCK);
        public static STRUGGLING = new Expression("STRUGGLING", false, false, false, ["EYEBROWS_ANGRY", "EYEBROWS_RAISED_LEFT", "EYELIDS_SQUINT", "WINK_LEFT", "WINK_RIGHT", "NOSE_FLARE", "MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE", "SYMMETRY_LEFT_UP", "SYMMETRY_RIGHT_UP"], [1, 0.6, 1, 0.25, 0.35, 1, 0.5, 0.35, -0.7, 0.6, 0.05, -0.4, 0.55], "--------Y--Y-", Expression.STOCK);

        //TODO sort both VISMES & if expressions need to change
        public static ANGRY_NM      = Expression.ANGRY.stripMouthTargets();
        public static CRYING_NM     = Expression.CRYING.stripMouthTargets();
        public static DISGUSTED_NM  = Expression.DISGUSTED.stripMouthTargets();
        public static HAPPY_NM      = Expression.HAPPY.stripMouthTargets();
        public static LAUGH_NM      = Expression.LAUGH.stripMouthTargets();
        public static PPHPHT_NM     = Expression.PPHPHT.stripMouthTargets();
        public static SAD_NM        = Expression.SAD.stripMouthTargets();
        public static SCARED_NM     = Expression.SCARED.stripMouthTargets();
        public static SKEPTICAL_NM  = Expression.SKEPTICAL.stripMouthTargets();
        public static STRUGGLING_NM = Expression.STRUGGLING.stripMouthTargets();

        // those ARPABET values with no viseme: D, G, K, N, NG, T, Y, & Z
        public static VISEME_DICT = {
            "."          : new Expression("."          , true , true , false, ["MOUTH_LIPS_LOWER_OUT"],  [0.25], null, Expression.VISEME),
            "AA"         : new Expression("AA"         , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE"], [0.3, .65, .55, 0.10], null, Expression.VISEME),
            "AO"         : new Expression("AO"         , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_OPEN", "MOUTH_WIDE"], [0.5  , 0.35, -0.35 ], "--X", Expression.VISEME),
            "AW-OW"      : new Expression("AW-OW"      , true , true , false, ["MOUTH_CORNERS_DOWN", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE"], [-0.05, 0.5, 0.35, 0.3, 1.15, -0.3], "Y----X", Expression.VISEME),
            "AE-EH"      : new Expression("AE-EH"      , true , true , false, ["MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_WIDE"], [-0.25, 0.3, 0.8, -0.5, 0.45, 0.3], "Y--Y--", Expression.VISEME),
            "AH"         : new Expression("AH"         , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_OPEN"], [0.3, 0.4], null, Expression.VISEME),
            "AY-IH"      : new Expression("AY-IH"      , true , true , false, ["MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_WIDE"], [-0.25, 0.3, 0.8, -0.5, 0.35, 0.3], "Y--Y--", Expression.VISEME),
            "B-M-P"      : new Expression("B-M-P"      , true , true , false, ["MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP"], [0.55, -0.45], "-Y", Expression.VISEME),
            "CH-JH-SH-ZH": new Expression("CH-JH-SH-ZH", true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_PUCKER", "MOUTH_WIDE"], [0.9, -0.45, -0.45, 1.1, 0.8], "-YY--", Expression.VISEME),
            "DH-TH"      : new Expression("DH-TH"      , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE", "TONGUE_RAISED", "TONGUE_STUCK_OUT"], [0.4, -1, 0.1, 0.05, 0.8, 0.15, 0.35], "-Y-----",  Expression.VISEME),
            "ER-R-W"     : new Expression("ER-R-W"     , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [-0.3, 2, 0.25, 1], "Z---", Expression.VISEME),
            "EY"         : new Expression("EY"         , true , true , false, ["MOUTH_CORNERS_DOWN", "MOUTH_CORNERS_UP", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE"], [0.05, 0.45, 0.2, 0.05, 0.15, 0.3, -0.4, 0.3], "------X-", Expression.VISEME),
            "F-V"        : new Expression("F-V"        , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE"], [.6, 0.2, -0.5, 1], "--Y-", Expression.VISEME),
            "IY"         : new Expression("IY"         , true , true , false, ["NOSE_FLARE", "MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN"], [0.4, 0.05, 0.1, 0.4, 0.1], null, Expression.VISEME),
            "L"          : new Expression("L"          , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_OPEN", "MOUTH_PUCKER", "MOUTH_WIDE", "TONGUE_RAISED", "TONGUE_STUCK_OUT"], [0.35, -0.7, -0.2, 0.2, -0.05, 1, 0.2, 0.2], "-YY-X---", Expression.VISEME),
            "OY-UH-UW"   : new Expression("OY-UH-UW"   , true , true , false, ["MOUTH_LIPS_LOWER_UP", "MOUTH_OPEN", "MOUTH_PUCKER"], [0.65, 0.25, 1.55], null, Expression.VISEME),
            "S"          : new Expression("S"          , true , true , false, ["MOUTH_LIPS_LOWER_OUT", "MOUTH_LIPS_LOWER_UP", "MOUTH_LIPS_UPPER_UP", "MOUTH_WIDE"], [0.4, -0.4, -0.15, 0.35], "-YY-", Expression.VISEME),
        };

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
         * @param {number} type - easy ways to group
         */
        constructor(public name : string, public winkable : boolean, public blinkable : boolean, public randomizable : boolean, public endStateNames : string[], public endStateRatios : number[], public mirrorAxes? : string, public type = Expression.CUSTOM) {
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

        public get isViseme       () : boolean { return this.type === Expression.VISEME; }
        public get isRegular      () : boolean { return this.type === Expression.STOCK || this.type === Expression.CUSTOM; }
        public get isSpeechCapable() : boolean { return this.type === Expression.SPEECH_CAPABLE; }
        public get regularNameFor () : string {
            return (!this.isViseme) ? this.name.replace("_NM", "") : null;
        }
        public get speechCapableNameFor () : string {
            if (this.isSpeechCapable || this.name === "NONE") return this.name;
            return (!this.isViseme) ? this.name + "_NM" : null;
        }

        public static convertForSpeech(name : string) : string {
            if (name.indexOf("_NM") !== -1 || name === "NONE") return name;
            return name + "_NM";
        }

        public stripMouthTargets() : Expression {
            var name = this.name + "_NM";
            var endStateNames  : string[] = [];
            var endStateRatios : number[] = [];
            var mirrorAxes : string = null;
            var mirrorReqd = false;

            for (var i = 0, nStates = this.endStateNames.length; i < nStates; i++){
                 if (this.endStateNames[i].indexOf("MOUTH_") === -1) {
                     endStateNames .push(this.endStateNames [i]);
                     endStateRatios.push(this.endStateRatios[i]);
                     mirrorReqd = mirrorReqd || this.endStateRatios[i] < 0;
                 }
            }
            // if mirror required now, must have been required before
            if (mirrorReqd) {
                mirrorAxes = "";
                for (var i = 0, nStates = this.endStateNames.length; i < nStates; i++){
                     if (this.endStateNames[i].indexOf("MOUTH_") === -1) {
                         mirrorAxes += this.mirrorAxes.substr(i, 1);
                     }
                }
            }
            return new Expression(name, this.winkable, this.blinkable, this.randomizable, endStateNames, endStateRatios, mirrorAxes, Expression.SPEECH_CAPABLE);
        }

        /**
         * This is so expression developer can log changes to be communicated back for source code implementation.
         */
        public toScript() : string {
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
            ret += this.mirrorReqd ? "\"" + this.mirrorAxes + "\"" : "null";

            switch (this.type) {
                case Expression.STOCK         : ret += ", Expression.STOCK"         ; break;
                case Expression.CUSTOM        : ret += ", Expression.CUSTOM"        ; break;
                case Expression.VISEME        : ret += ", Expression.VISEME"        ; break;
                case Expression.SPEECH_CAPABLE: ret += ", Expression.SPEECH_CAPABLE"; break;
            }
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
         * @param {Expression} exp - The expression to be made available.
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
         * @param {string} whichOnes - names of the ones to load, e.g. 'ANGRY LAUGH'.  When "", then all.
         * @param {boolean} visemesToo - When true, also add speech friendly versions of the expressions.
         */
        public addStockExpressions(whichOnes : string = "", visemesToo = false) : void {
            var all : boolean = whichOnes.length === 0;
            if (all || whichOnes.indexOf("ANGRY"     ) !== -1) { this.addExpression(Expression.ANGRY     ); if (visemesToo) this.addExpression(Expression.ANGRY_NM     ); }
            if (all || whichOnes.indexOf("CRYING"    ) !== -1) { this.addExpression(Expression.CRYING    ); if (visemesToo) this.addExpression(Expression.CRYING_NM    ); }
            if (all || whichOnes.indexOf("DISGUSTED" ) !== -1) { this.addExpression(Expression.DISGUSTED ); if (visemesToo) this.addExpression(Expression.DISGUSTED_NM ); }
            if (all || whichOnes.indexOf("HAPPY"     ) !== -1) { this.addExpression(Expression.HAPPY     ); if (visemesToo) this.addExpression(Expression.HAPPY_NM     ); }
            if (all || whichOnes.indexOf("LAUGH"     ) !== -1) { this.addExpression(Expression.LAUGH     ); if (visemesToo) this.addExpression(Expression.LAUGH_NM     ); }
            if (all || whichOnes.indexOf("PPHPHT"    ) !== -1) { this.addExpression(Expression.PPHPHT    ); if (visemesToo) this.addExpression(Expression.PPHPHT_NM    ); }
            if (all || whichOnes.indexOf("SAD"       ) !== -1) { this.addExpression(Expression.SAD       ); if (visemesToo) this.addExpression(Expression.SAD_NM       ); }
            if (all || whichOnes.indexOf("SCARED"    ) !== -1) { this.addExpression(Expression.SCARED    ); if (visemesToo) this.addExpression(Expression.SCARED_NM    ); }
            if (all || whichOnes.indexOf("SKEPTICAL" ) !== -1) { this.addExpression(Expression.SKEPTICAL ); if (visemesToo) this.addExpression(Expression.SKEPTICAL_NM ); }
            if (all || whichOnes.indexOf("STRUGGLING") !== -1) { this.addExpression(Expression.STRUGGLING); if (visemesToo) this.addExpression(Expression.STRUGGLING_NM); }

            if (visemesToo) {
                for (var name in Expression.VISEME_DICT) {
                    this.addExpression(Expression.VISEME_DICT[name]);
                }
            }
        }

        /**
         * Release the shape key components after all the base expressions have been created.  Those for winking are always kept.
         */
        public removeExpressionComponents() : void {
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

            // those for SYMMETRY
            this._face.deleteShapeKey("SYMMETRY_CHIN_LEFT");
            this._face.deleteShapeKey("SYMMETRY_LEFT_UP");
            this._face.deleteShapeKey("SYMMETRY_RIGHT_UP");

            // those for NOSE
            this._face.deleteShapeKey("NOSE_FLARE");

            // those for TONGUE
            this._face.deleteShapeKey("TONGUE_RAISED");
            this._face.deleteShapeKey("TONGUE_STUCK_OUT");

            // those for MOUTH
            this._face.deleteShapeKey("MOUTH_CORNERS_DOWN");
            this._face.deleteShapeKey("MOUTH_CORNERS_UP");
            this._face.deleteShapeKey("MOUTH_LIPS_LOWER_OUT");
            this._face.deleteShapeKey("MOUTH_LIPS_LOWER_UP");
            this._face.deleteShapeKey("MOUTH_LIPS_UPPER_UP");
            this._face.deleteShapeKey("MOUTH_OPEN");
            this._face.deleteShapeKey("MOUTH_PUCKER");
            this._face.deleteShapeKey("MOUTH_WIDE");
        }

        public getExpressionNames() : Array<string> {
            var len = this.expressions.length;
            var ret = new Array<string>();
            for (var i = 0; i < len; i++) {
                if (!this.expressions[i].isViseme) {
                    ret.push(this.expressions[i].name);
                }
            }
            return ret;
        }

        public getVisemeNames() : Array<string> {
            var len = this.expressions.length;
            var ret = new Array<string>();
            for (var i = 0; i < len; i++) {
                if (this.expressions[i].isViseme) {
                    ret.push(this.expressions[i].name);
                }
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