var QI;
(function (QI) {
    /**
     * Represents Matrices in their component parts
     */
    var MatrixComp = (function () {
        /**
         * The separate components of BABYLON.Matrix
         * @param {BABYLON.Quaternion} rotation
         * @param {BABYLON.Vector3} translation
         * @param {BABYLON.Vector3} scale- optional, set to a static (1, 1, 1) when missing or equates to (1, 1, 1)
         */
        function MatrixComp(rotation, translation, scale) {
            this.rotation = rotation;
            this.translation = translation;
            // verify a scale is truly needed, when passed
            this.scale = (scale && MatrixComp.needScale(scale)) ? scale : MatrixComp.One;
        }
        /**
         * Difference of a QI.Pose to the Library's Basis (Rest) pose.  Called for each library Pose, EXCEPT Basis (would be zero anyway)
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        MatrixComp.prototype.setBasisDiffs = function (libraryBasis) {
            this.rotationBasisDiff = this.rotation.subtract(libraryBasis.rotation);
            this.translationBasisDiff = this.translation.subtract(libraryBasis.translation);
            this.scaleBasisDiff = this.scale.subtract(libraryBasis.scale);
        };
        /**
         * The relationship between this (the Basis (Rest) of a bone) to that of the pose library's version of that bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryBasis - The Rest value of this bone in the library.
         */
        MatrixComp.prototype.setBasisRatios = function (libraryBasis) {
            // there is no divide for Quaternion, but multiplying by Inverse is equivalent
            this.rotationBasisRatio = this.rotation.multiply(BABYLON.Quaternion.Inverse(libraryBasis.rotation));
            this.translationBasisRatio = BABYLON.Vector3.Zero();
            if (libraryBasis.translation.x !== 0)
                this.translationBasisRatio.x = this.translation.x / libraryBasis.translation.x;
            if (libraryBasis.translation.y !== 0)
                this.translationBasisRatio.y = this.translation.y / libraryBasis.translation.y;
            if (libraryBasis.translation.z !== 0)
                this.translationBasisRatio.z = this.translation.z / libraryBasis.translation.z;
            if (this.scale.equals(MatrixComp.One) && libraryBasis.scale.equals(MatrixComp.One)) {
                this.scaleBasisRatio = MatrixComp.One;
            }
            else {
                this.scaleBasisRatio = BABYLON.Vector3.Zero();
                if (libraryBasis.scale.x !== 0)
                    this.scaleBasisRatio.x = this.scale.x / libraryBasis.scale.x;
                if (libraryBasis.scale.y !== 0)
                    this.scaleBasisRatio.y = this.scale.y / libraryBasis.scale.y;
                if (libraryBasis.scale.z !== 0)
                    this.scaleBasisRatio.z = this.scale.z / libraryBasis.scale.z;
            }
        };
        /**
         * A relative target (rotation / translation / scale) is made by:
         * (Difference of each to their Basis (Rest)) * (Ratios of the Basic of the bone to library) + Basis of the bone.
         * This is called on the MatrixComp version of a Bone's Basis (Rest) pose.
         * @param {QI.MatrixComp} libraryTarget - The value of this bone for a pose in the library.
         */
        MatrixComp.prototype.getRelativePose = function (libraryPose) {
            // when there are diffs to Basis, build realative target
            if (libraryPose.rotationBasisDiff) {
                var relRot = libraryPose.rotationBasisDiff.multiply(this.rotationBasisRatio).add(this.rotation);
                var relTrans = libraryPose.translationBasisDiff.multiply(this.translationBasisRatio).addInPlace(this.translation);
                var retScale = libraryPose.scaleBasisDiff.multiply(this.scaleBasisRatio).addInPlace(this.scale);
                return new MatrixComp(relRot, relTrans, retScale);
            }
            else {
                return this;
            }
        };
        /**
         * Recompose the components back into a matrix
         */
        MatrixComp.prototype.toMatrix = function () {
            return BABYLON.Matrix.Compose(this.scale ? this.scale : MatrixComp.One, this.rotation, this.translation);
        };
        /**
         * Equals test.
         */
        MatrixComp.prototype.equals = function (rotation, translation, scale) {
            if (!this.rotation.equals(rotation))
                return false;
            if (!this.translation.equals(translation))
                return false;
            if (!this.scale.equals(scale))
                return false;
            return true;
        };
        /**
         *
         */
        MatrixComp.fromMatrix = function (matrix) {
            var scale = new BABYLON.Vector3(0, 0, 0);
            var rotation = new BABYLON.Quaternion();
            var translation = new BABYLON.Vector3(0, 0, 0);
            matrix.decompose(scale, rotation, translation);
            return new MatrixComp(rotation, translation, scale);
        };
        MatrixComp.needScale = function (scale) {
            return Math.abs(1 - scale.x) > 0.0001 ||
                Math.abs(1 - scale.y) > 0.0001 ||
                Math.abs(1 - scale.z) > 0.0001;
        };
        MatrixComp.One = new BABYLON.Vector3(1, 1, 1);
        return MatrixComp;
    }());
    QI.MatrixComp = MatrixComp;
})(QI || (QI = {}));
/// <reference path="./MatrixComp.ts"/>
/// <reference path="./Pose.ts"/>
var QI;
(function (QI) {
    /**
     * Instances of this class are computer generated code from Tower of Babel.  A library contains all the
     * poses designed for a skeleton.
     */
    var SkeletonPoseLibrary = (function () {
        /**
         * Non exported constructor, called by SkeletonPoseLibrary.createLibrary().
         */
        function SkeletonPoseLibrary(name, dimensionsAtRest, nameOfRoot, boneLengths) {
            this.name = name;
            this.dimensionsAtRest = dimensionsAtRest;
            this.nameOfRoot = nameOfRoot;
            this.boneLengths = boneLengths;
            this.poses = {};
            Object.freeze(this.boneLengths); // should never change
            this.nBones = Object.keys(this.boneLengths).length;
            Object.freeze(this.nBones); // should never change
            SkeletonPoseLibrary._libraries[this.name] = this;
        }
        SkeletonPoseLibrary.getLibraryByName = function (name) {
            return SkeletonPoseLibrary._libraries[name];
        };
        /**
         * Called in generated code.  If more than one library is exported with the same name, then
         * an attempt will be made to append the poses to the first reference encountered.
         */
        SkeletonPoseLibrary.createLibrary = function (name, dimensionsAtRest, nameOfRoot, boneLengths) {
            var alreadyCreated = SkeletonPoseLibrary._libraries[name];
            if (alreadyCreated) {
                // validate # of bones & lengths match
                if (Object.keys(boneLengths).length !== alreadyCreated.nBones) {
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  library(" + name + ") already created; # of has Bones mis-match; " + Object.keys(boneLengths).length + ", but " + alreadyCreated.nBones + " already");
                    return null;
                }
                // with # of bones the same, can just iterate thru lengths to check for match
                for (var boneName in boneLengths) {
                    if (!alreadyCreated.boneLengths[boneName]) {
                        BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  Bone(" + boneName + ") not found in library already created");
                        return null;
                    }
                    if (alreadyCreated.boneLengths[boneName] !== boneLengths[boneName]) {
                        BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  Bone(" + boneName + ") length mis-match in library already created");
                        return null;
                    }
                }
                return alreadyCreated;
            }
            else
                return new SkeletonPoseLibrary(name, dimensionsAtRest, nameOfRoot, boneLengths);
        };
        /**
         * Add the pose supplied by the argument.  Called by the Pose's constructor, which
         * is passed the library as a constructor arg in the generated code.
         */
        SkeletonPoseLibrary.prototype._addPose = function (pose) {
            // ensure not already added
            if (this.poses[pose.name]) {
                BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  pose(" + pose.name + "), has already been added in library(" + this.name + ")");
                return;
            }
            // verify bones match; pose does not have to have all bones though
            for (var boneName in pose.targets) {
                if (!this.boneLengths[boneName]) {
                    BABYLON.Tools.Error("QI.SkeletonPoseLibrary:  pose(" + pose.name + "), has Bone(" + boneName + ") not found in library(" + this.name + ")");
                    return;
                }
            }
            this.poses[pose.name] = pose;
            BABYLON.Tools.Log("QI.SkeletonPoseLibrary:  added pose (" + this.name + "." + pose.name + ")");
        };
        /**
         * @returns {string[]} the names of all poses, subposes with the '.sp' removed; primarily for UI
         */
        SkeletonPoseLibrary.prototype.getPoses = function (subPoses) {
            var ret = new Array();
            for (var poseName in this.poses) {
                if (this.poses[poseName].isSubPose && subPoses) {
                    ret.push(poseName.replace(".sp", ""));
                }
                else if (!this.poses[poseName].isSubPose && !subPoses) {
                    ret.push(poseName);
                }
            }
            return ret;
        };
        SkeletonPoseLibrary._libraries = {};
        return SkeletonPoseLibrary;
    }());
    QI.SkeletonPoseLibrary = SkeletonPoseLibrary;
})(QI || (QI = {}));
/// <reference path="./PovProcessor.ts"/>
var QI;
(function (QI) {
    /**
     * This class is used to provide a way to render at a precise frame rate, as opposed to realtime,
     * as well as system level play - pause.
     */
    var TimelineControl = (function () {
        function TimelineControl() {
        }
        /** called by PovProcessor constructor */
        TimelineControl.initialize = function (scene) {
            if (!TimelineControl._afterRenderAssigned) {
                scene.registerAfterRender(TimelineControl._manualAdvanceAfterRender);
                // built-in hooks for CocoonJS
                if (navigator.isCocoonJS) {
                    Cocoon.App.on("activated", TimelineControl.resumeSystem);
                    Cocoon.App.on("suspending", TimelineControl.pauseSystem);
                }
                TimelineControl._scene = scene;
                TimelineControl._afterRenderAssigned = true;
                BABYLON.Tools.Log("Queued Interpolation Timeline Control system initialized, version: " + QI.PovProcessor.Version);
            }
        };
        TimelineControl.change = function (isRealTime, rateIfManual) {
            if (rateIfManual === void 0) { rateIfManual = 24; }
            TimelineControl._isRealtime = isRealTime;
            TimelineControl._manualFrameRate = rateIfManual;
        };
        TimelineControl._manualAdvanceAfterRender = function () {
            if (!TimelineControl._systemPaused || TimelineControl._resumeQueued) {
                TimelineControl._frameID++;
                // realtime elapsed & set up for "next" elapsed
                var elapsed = BABYLON.Tools.Now - TimelineControl._lastFrame;
                TimelineControl._lastFrame = BABYLON.Tools.Now;
                // assign a new Now based on whether realtime or not
                if (TimelineControl._isRealtime) {
                    TimelineControl._now += elapsed * TimelineControl._speed;
                }
                else
                    TimelineControl._now += 1000 / TimelineControl._manualFrameRate; // add # of millis for exact advance
                // process a resume with a good 'Now'
                // The system might not officially have been paused, rather browser tab switched & now switched back
                if (TimelineControl._resumeQueued || BABYLON.Tools.Now - TimelineControl._lastRun > TimelineControl.CHANGED_TABS_THRESHOLD) {
                    TimelineControl._systemPaused = TimelineControl._resumeQueued = false;
                    TimelineControl._systemResumeTime = TimelineControl._now;
                }
                else if (!TimelineControl._isRealtime && TimelineControl.MP4Worker) {
                    var engine = TimelineControl._scene.getEngine();
                    var screen = engine.readPixels(0, 0, engine.getRenderWidth(), engine.getRenderHeight());
                }
            }
            // record last time after render processed regardless of paused or not; used to detect tab change
            TimelineControl._lastRun = BABYLON.Tools.Now;
        };
        TimelineControl.sizeFor720 = function () { TimelineControl._sizeForRecording(1280, 720); };
        TimelineControl.sizeFor1080 = function () { TimelineControl._sizeForRecording(1920, 1080); };
        TimelineControl._sizeForRecording = function (width, height) {
            TimelineControl._scene.getEngine().setSize(width, height);
        };
        Object.defineProperty(TimelineControl, "manualFrameRate", {
            // =========================================== Gets ==========================================
            get: function () { return TimelineControl._manualFrameRate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "isRealtime", {
            get: function () { return TimelineControl._isRealtime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "Now", {
            get: function () { return TimelineControl._now; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "FrameID", {
            get: function () { return TimelineControl._frameID; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "Speed", {
            get: function () { return TimelineControl._speed; },
            set: function (newSpeed) {
                if (!TimelineControl._isRealtime) {
                    BABYLON.Tools.Error("TimelineControl: changing speed only supported for realtime mode");
                    return;
                }
                TimelineControl._speed = newSpeed;
                // reset the speed of all sound tracks
                var tracks = TimelineControl._scene.mainSoundTrack.soundCollection;
                for (var i = 0, len = tracks.length; i < len; i++) {
                    tracks[i].setPlaybackRate(newSpeed);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimelineControl, "isSystemPaused", {
            /** system could be paused at a higher up without notification; just by stop calling beforeRender() */
            get: function () { return TimelineControl._systemPaused; },
            enumerable: true,
            configurable: true
        });
        TimelineControl.pauseSystem = function () {
            TimelineControl._systemPaused = true;
            // disable the audio system
            TimelineControl._scene.audioEnabled = false;
        };
        TimelineControl.resumeSystem = function () {
            // since Now is computed in an after renderer, resumes are queued. Processing a call to resumeSystem directly would have a stale 'Now'.
            TimelineControl._resumeQueued = true;
            // resume the audio system
            TimelineControl._scene.audioEnabled = true;
        };
        Object.defineProperty(TimelineControl, "SystemResumeTime", {
            get: function () { return TimelineControl._systemResumeTime; },
            enumerable: true,
            configurable: true
        });
        TimelineControl._isRealtime = true;
        TimelineControl._now = BABYLON.Tools.Now;
        TimelineControl._lastRun = BABYLON.Tools.Now;
        TimelineControl._lastFrame = BABYLON.Tools.Now;
        TimelineControl._frameID = 0; // useful for new in frame detection
        TimelineControl._resumeQueued = false;
        TimelineControl._speed = 1.0; // applies only to realtime
        TimelineControl.CHANGED_TABS_THRESHOLD = 500; // milli sec
        // =================================== SYSTEM play - pause ===================================
        // pause & resume statics
        TimelineControl._systemResumeTime = 0;
        TimelineControl._systemPaused = false;
        return TimelineControl;
    }());
    QI.TimelineControl = TimelineControl;
})(QI || (QI = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QI;
(function (QI) {
    /**
     * See , https://msdn.microsoft.com/en-us/library/ee308751.aspx, for types.
     * This is largely based on BJS Easing.  A few do not make sense, or are not possible.
     * The static MotionEvent.LINEAR is the default for all cases where a Pace is an argument.
     */
    var Pace = (function () {
        function Pace(_mode) {
            if (_mode === void 0) { _mode = Pace.MODE_IN; }
            this._mode = _mode;
        }
        /**
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        Pace.prototype.getCompletionMilestone = function (currentDurationRatio) {
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0)
                return 0;
            else if (currentDurationRatio >= 1)
                return 1;
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
        };
        /**
         * Perform the method without regard for the mode.  MUST be overridden
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        Pace.prototype._compute = function (currentDurationRatio) {
            return 0;
        };
        // modes
        Pace.MODE_IN = 0;
        Pace.MODE_OUT = 1;
        Pace.MODE_INOUT = 2;
        return Pace;
    }());
    QI.Pace = Pace;
    //================================================================================================
    var CirclePace = (function (_super) {
        __extends(CirclePace, _super);
        function CirclePace() {
            _super.apply(this, arguments);
        }
        /** @override */
        CirclePace.prototype._compute = function (currentDurationRatio) {
            currentDurationRatio = Math.max(0, Math.min(1, currentDurationRatio));
            return (1.0 - Math.sqrt(1.0 - (currentDurationRatio * currentDurationRatio)));
        };
        return CirclePace;
    }(Pace));
    QI.CirclePace = CirclePace;
    //================================================================================================
    var CubicPace = (function (_super) {
        __extends(CubicPace, _super);
        function CubicPace() {
            _super.apply(this, arguments);
        }
        /** @override */
        CubicPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio);
        };
        return CubicPace;
    }(Pace));
    QI.CubicPace = CubicPace;
    //================================================================================================
    var ElasticPace = (function (_super) {
        __extends(ElasticPace, _super);
        function ElasticPace(oscillations, springiness, mode) {
            if (oscillations === void 0) { oscillations = 3; }
            if (springiness === void 0) { springiness = 3; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            _super.call(this, mode);
            this.oscillations = oscillations;
            this.springiness = springiness;
        }
        /** @override */
        ElasticPace.prototype._compute = function (currentDurationRatio) {
            var num2;
            var num3 = Math.max(0.0, this.oscillations);
            var num = Math.max(0.0, this.springiness);
            if (num == 0) {
                num2 = currentDurationRatio;
            }
            else {
                num2 = (Math.exp(num * currentDurationRatio) - 1.0) / (Math.exp(num) - 1.0);
            }
            return (num2 * Math.sin(((6.2831853071795862 * num3) + 1.5707963267948966) * currentDurationRatio));
        };
        return ElasticPace;
    }(Pace));
    QI.ElasticPace = ElasticPace;
    //================================================================================================
    var ExponentialPace = (function (_super) {
        __extends(ExponentialPace, _super);
        function ExponentialPace(exponent, mode) {
            if (exponent === void 0) { exponent = 2; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            _super.call(this, mode);
            this.exponent = exponent;
        }
        /** @override */
        ExponentialPace.prototype._compute = function (currentDurationRatio) {
            if (this.exponent <= 0) {
                return currentDurationRatio;
            }
            return ((Math.exp(this.exponent * currentDurationRatio) - 1.0) / (Math.exp(this.exponent) - 1.0));
        };
        return ExponentialPace;
    }(Pace));
    QI.ExponentialPace = ExponentialPace;
    //================================================================================================
    var PowerPace = (function (_super) {
        __extends(PowerPace, _super);
        function PowerPace(power, mode) {
            if (power === void 0) { power = 2; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            _super.call(this, mode);
            this.power = power;
        }
        /** @override */
        PowerPace.prototype._compute = function (currentDurationRatio) {
            var y = Math.max(0.0, this.power);
            return Math.pow(currentDurationRatio, y);
        };
        return PowerPace;
    }(Pace));
    QI.PowerPace = PowerPace;
    //================================================================================================
    var QuadraticPace = (function (_super) {
        __extends(QuadraticPace, _super);
        function QuadraticPace() {
            _super.apply(this, arguments);
        }
        /** @override */
        QuadraticPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio);
        };
        return QuadraticPace;
    }(Pace));
    QI.QuadraticPace = QuadraticPace;
    //================================================================================================
    var QuarticPace = (function (_super) {
        __extends(QuarticPace, _super);
        function QuarticPace() {
            _super.apply(this, arguments);
        }
        /** @override */
        QuarticPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio);
        };
        return QuarticPace;
    }(Pace));
    QI.QuarticPace = QuarticPace;
    //================================================================================================
    var QuinticPace = (function (_super) {
        __extends(QuinticPace, _super);
        function QuinticPace() {
            _super.apply(this, arguments);
        }
        /** @override */
        QuinticPace.prototype._compute = function (currentDurationRatio) {
            return (currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio * currentDurationRatio);
        };
        return QuinticPace;
    }(Pace));
    QI.QuinticPace = QuinticPace;
    //================================================================================================
    var SinePace = (function (_super) {
        __extends(SinePace, _super);
        function SinePace() {
            _super.apply(this, arguments);
        }
        /** @override */
        SinePace.prototype._compute = function (currentDurationRatio) {
            return (1.0 - Math.sin(1.5707963267948966 * (1.0 - currentDurationRatio)));
        };
        return SinePace;
    }(Pace));
    QI.SinePace = SinePace;
    //================================================================================================
    var BezierCurvePace = (function (_super) {
        __extends(BezierCurvePace, _super);
        function BezierCurvePace(x1, y1, x2, y2, mode) {
            if (x1 === void 0) { x1 = 0; }
            if (y1 === void 0) { y1 = 0; }
            if (x2 === void 0) { x2 = 1; }
            if (y2 === void 0) { y2 = 1; }
            if (mode === void 0) { mode = Pace.MODE_IN; }
            _super.call(this, mode);
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
        /** @override */
        BezierCurvePace.prototype._compute = function (currentDurationRatio) {
            return BABYLON.BezierCurve.interpolate(currentDurationRatio, this.x1, this.y1, this.x2, this.y2);
        };
        return BezierCurvePace;
    }(Pace));
    QI.BezierCurvePace = BezierCurvePace;
    //================================================================================================
    /**
     *  Class used to coorelate duration ratio to completion ratio.  Enables MotionEvents to have
     *  characteristics like acceleration, deceleration, & linear.
     */
    var SteppedPace = (function (_super) {
        __extends(SteppedPace, _super);
        /**
         * @immutable, reusable
         * @param {Array} completionRatios - values from (> 0 to 1.0), not required to increase from left to right, for 'hicup' effects
         * @param {Array} durationRatios   - values from (> 0 to 1.0), MUST increase from left to right
         */
        function SteppedPace(completionRatios, durationRatios) {
            _super.call(this, Pace.MODE_IN);
            this.completionRatios = completionRatios;
            this.durationRatios = durationRatios;
            // argument validations for JavaScript
            if (!(this.completionRatios instanceof Array) || !(this.durationRatios instanceof Array))
                BABYLON.Tools.Error("QI.SteppedPace: ratios not arrays");
            if (this.completionRatios.length !== this.durationRatios.length)
                BABYLON.Tools.Error("QI.SteppedPace: ratio arrays not of equal length");
            this.steps = this.completionRatios.length;
            if (this.steps === 0)
                BABYLON.Tools.Error("QI.SteppedPace: ratio arrays cannot be empty");
            var cRatio, dRatio, prevD = -1;
            for (var i = 0; i < this.steps; i++) {
                cRatio = this.completionRatios[i];
                dRatio = this.durationRatios[i];
                if (cRatio <= 0 || dRatio <= 0)
                    BABYLON.Tools.Error("QI.SteppedPace: ratios must be > 0");
                if (cRatio > 1 || dRatio > 1)
                    BABYLON.Tools.Error("QI.SteppedPace: ratios must be <= 1");
                if (prevD >= dRatio)
                    BABYLON.Tools.Error("QI.SteppedPace: durationRatios must be in increasing order");
                prevD = dRatio;
            }
            if (cRatio !== 1 || dRatio !== 1)
                BABYLON.Tools.Error("QI.SteppedPace: final ratios must be 1");
            this.incremetalCompletionBetweenSteps = [this.completionRatios[0]]; // elements can be negative for 'hicups'
            this.incremetalDurationBetweenSteps = [this.durationRatios[0]];
            for (var i = 1; i < this.steps; i++) {
                this.incremetalCompletionBetweenSteps.push(this.completionRatios[i] - this.completionRatios[i - 1]);
                this.incremetalDurationBetweenSteps.push(this.durationRatios[i] - this.durationRatios[i - 1]);
            }
            Object.freeze(this); // make immutable
        }
        /** @override
         * Determine based on time since beginning,  return what should be ration of completion
         * @param{number} currentDurationRatio - How much time has elapse / how long it is supposed to take
         */
        SteppedPace.prototype.getCompletionMilestone = function (currentDurationRatio) {
            // breakout start & running late cases, no need to take into account later
            if (currentDurationRatio <= 0)
                return 0;
            else if (currentDurationRatio >= 1)
                return 1;
            var upperIdx = 0; // ends up being an index into durationRatios, 1 greater than highest obtained
            for (; upperIdx < this.steps; upperIdx++) {
                if (currentDurationRatio < this.durationRatios[upperIdx])
                    break;
            }
            var baseCompletion = (upperIdx > 0) ? this.completionRatios[upperIdx - 1] : 0;
            var baseDuration = (upperIdx > 0) ? this.durationRatios[upperIdx - 1] : 0;
            var interStepRatio = (currentDurationRatio - baseDuration) / this.incremetalDurationBetweenSteps[upperIdx];
            return baseCompletion + (interStepRatio * this.incremetalCompletionBetweenSteps[upperIdx]);
        };
        return SteppedPace;
    }(Pace));
    QI.SteppedPace = SteppedPace;
})(QI || (QI = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
var QI;
(function (QI) {
    /**
     * Class to store MotionEvent info & evaluate how complete it should be.
     */
    var MotionEvent = (function () {
        /**
         * Take in all the motion event info.  Movement & rotation are both optional, but both being null is usually for sub-classing.
         *
         * @param {number} _milliDuration - The number of milli seconds the event is to be completed in.
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed or null.
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed (optional).
         *                  flipBack-twirlClockwise-tiltRight

         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function MotionEvent(_milliDuration, movePOV, rotatePOV, options) {
            if (rotatePOV === void 0) { rotatePOV = null; }
            this._milliDuration = _milliDuration;
            this.movePOV = movePOV;
            this.rotatePOV = rotatePOV;
            // time and state management members
            this._startTime = -1;
            this._currentDurationRatio = MotionEvent._COMPLETE;
            // misc
            this._groupName = QI.PovProcessor.POV_GROUP_NAME; // For a multi group event series.  Overridden by PoseProcessor & ShapeKeyGroup.
            this.muteSound = false; // no actual sound when in the process of recording
            // argument validations
            if (this._milliDuration <= 0) {
                BABYLON.Tools.Error("MotionEvent: milliDuration must > 0");
                return;
            }
            // Adapt options
            this.options = options || {
                millisBefore: 0,
                absoluteMovement: false,
                absoluteRotation: false,
                pace: MotionEvent.LINEAR,
                noStepWiseMovement: false,
                mirrorAxes: null,
                subposes: null,
                revertSubposes: false
            };
            this.options.millisBefore = this.options.millisBefore || 0;
            this.options.absoluteMovement = this.options.absoluteMovement || false;
            this.options.absoluteRotation = this.options.absoluteRotation || false;
            this.options.pace = this.options.pace || MotionEvent.LINEAR;
            this.options.noStepWiseMovement = this.options.noStepWiseMovement || false;
            // subclass specific
            this.options.mirrorAxes = this.options.mirrorAxes || null;
            this.options.subposes = this.options.subposes || null;
            this.options.revertSubposes = this.options.revertSubposes || false;
            // ensure values actually used for timings are initialized
            this.setProratedWallClocks(1, false);
        }
        MotionEvent.prototype.toString = function () {
            return "group: " + this._groupName +
                ", duration: " + this._milliDuration +
                ", move: " + (this.movePOV ? this.movePOV.toString() : "None") +
                ", rotate: " + (this.rotatePOV ? this.rotatePOV.toString() : "None" +
                ", sound: " + (this.options.sound ? this.options.sound.name : "None") +
                ", wait: " + this.options.millisBefore +
                ", non-linear pace: " + (this.options.pace !== MotionEvent.LINEAR) +
                ", absoluteMovement: " + this.options.absoluteMovement +
                ", absoluteRotation: " + this.options.absoluteRotation +
                ", noStepWiseMovement: " + this.options.noStepWiseMovement);
        };
        // =================================== run time processing ===================================
        /**
         * Indicate readiness by caller to start processing event.
         * @param {number} lateStartMilli - indication of how far already behind
         */
        MotionEvent.prototype.activate = function (lateStartMilli) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            this._startTime = QI.TimelineControl.Now;
            if (lateStartMilli > 0) {
                // apply 20% of the late start or 10% of duration which ever is less
                lateStartMilli /= 5;
                this._startTime -= (lateStartMilli < this._milliDuration / 10) ? lateStartMilli : this._milliDuration / 10;
            }
            this._currentDurationRatio = (this._syncPartner || (this.options.sound && !this.muteSound)) ? MotionEvent._BLOCKED :
                ((this._proratedMillisBefore > 0) ? MotionEvent._WAITING : MotionEvent._READY);
        };
        /** called to determine how much of the Event should be performed right now */
        MotionEvent.prototype.getCompletionMilestone = function () {
            if (this._currentDurationRatio === MotionEvent._COMPLETE) {
                return MotionEvent._COMPLETE;
            }
            // BLOCK only occurs when there is a sync partner or sound
            if (this._currentDurationRatio === MotionEvent._BLOCKED) {
                if (this.options.sound && !this.muteSound) {
                    if (this.options.sound["_isReadyToPlay"]) {
                        this._startTime = QI.TimelineControl.Now; // reset the start clocks
                        this._currentDurationRatio = MotionEvent._WAITING;
                    }
                    else
                        return MotionEvent._BLOCKED;
                }
                // change both to WAITING & start clock, once both are BLOCKED
                if (this._syncPartner) {
                    if (this._syncPartner.isBlocked()) {
                        this._startTime = QI.TimelineControl.Now; // reset the start clocks
                        this._currentDurationRatio = MotionEvent._WAITING;
                        this._syncPartner._syncReady(this._startTime);
                    }
                    else
                        return MotionEvent._BLOCKED;
                }
            }
            this._millisSoFar = QI.TimelineControl.Now - this._startTime;
            if (this._currentDurationRatio === MotionEvent._WAITING) {
                var overandAbove = this._millisSoFar - this._proratedMillisBefore;
                if (overandAbove >= 0) {
                    this._startTime = QI.TimelineControl.Now - overandAbove; // prorate start for time served
                    this._millisSoFar = overandAbove;
                    if (this.options.sound && !this.muteSound) {
                        this.options.sound.setPlaybackRate(QI.TimelineControl.Speed);
                        this.options.sound.play();
                    }
                }
                else
                    return MotionEvent._WAITING;
            }
            this._currentDurationRatio = this._millisSoFar / this._proratedMilliDuration;
            if (this._currentDurationRatio > MotionEvent._COMPLETE)
                this._currentDurationRatio = MotionEvent._COMPLETE;
            return this.pace.getCompletionMilestone(this._currentDurationRatio);
        };
        // =================================== pause resume methods ===================================
        /** support game pausing / resuming.  There is no need to actively pause a MotionEvent. */
        MotionEvent.prototype.resumePlay = function () {
            if (this._currentDurationRatio === MotionEvent._COMPLETE ||
                this._currentDurationRatio === MotionEvent._BLOCKED)
                return;
            var before = this._startTime;
            // back into a start time which reflects the millisSoFar
            this._startTime = QI.TimelineControl.Now - this._millisSoFar;
            if (this.options.sound && !this.muteSound)
                this.options.sound.play();
        };
        MotionEvent.prototype.pause = function () {
            if (this.options.sound)
                this.options.sound.pause();
        };
        // =================================== sync partner methods ===================================
        /**
         * @param {MotionEvent} syncPartner - MotionEvent which should start at the same time as this one.
         * There is no need to call this on both partners, since this call sets both to each other.
         */
        MotionEvent.prototype.setSyncPartner = function (syncPartner) {
            this._syncPartner = syncPartner;
            syncPartner._syncPartner = this;
        };
        /**
         *  Called by the first of the syncPartners to detect that both are waiting for each other.
         *  @param {number} startTime - passed from partner, so both are in sync as close as possible.
         */
        MotionEvent.prototype._syncReady = function (startTime) {
            this._startTime = startTime;
            this._currentDurationRatio = MotionEvent._WAITING;
        };
        // ==================================== Getters & setters ====================================
        MotionEvent.prototype.isBlocked = function () { return this._currentDurationRatio === MotionEvent._BLOCKED; };
        MotionEvent.prototype.isWaiting = function () { return this._currentDurationRatio === MotionEvent._WAITING; };
        MotionEvent.prototype.isComplete = function () { return this._currentDurationRatio === MotionEvent._COMPLETE; };
        MotionEvent.prototype.isExecuting = function () { return this._currentDurationRatio > MotionEvent._READY && this._currentDurationRatio < MotionEvent._COMPLETE; };
        Object.defineProperty(MotionEvent.prototype, "milliDuration", {
            get: function () { return this._milliDuration; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "millisBefore", {
            get: function () { return this.options.millisBefore; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "pace", {
            get: function () { return this.options.pace; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent.prototype, "syncPartner", {
            get: function () { return this._syncPartner; },
            enumerable: true,
            configurable: true
        });
        /**
         * Called by EventSeries, before MotionEvent is return by series (even the first run).  This is to support
         * acceleration / deceleration across event series repeats.
         *
         * @param {number} factor - amount to multiply the constructor supplied duration & time before by.
         * @param {boolean} isRepeat - Indicates to event that this is not the first running of the event.
         */
        MotionEvent.prototype.setProratedWallClocks = function (factor, isRepeat) {
            this._proratedMilliDuration = this._milliDuration * factor;
            this._proratedMillisBefore = (this.millisBefore > 0 || !isRepeat) ? Math.abs(this.millisBefore) * factor : 0;
        };
        Object.defineProperty(MotionEvent, "BLOCKED", {
            get: function () { return MotionEvent._BLOCKED; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "WAITING", {
            get: function () { return MotionEvent._WAITING; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "READY", {
            get: function () { return MotionEvent._READY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotionEvent, "COMPLETE", {
            get: function () { return MotionEvent._COMPLETE; },
            enumerable: true,
            configurable: true
        });
        // Constants
        MotionEvent.LINEAR = new QI.SteppedPace([1.0], [1.0]);
        // ========================================== Enums  =========================================
        MotionEvent._BLOCKED = -20;
        MotionEvent._WAITING = -10;
        MotionEvent._READY = 0;
        MotionEvent._COMPLETE = 1;
        return MotionEvent;
    }());
    QI.MotionEvent = MotionEvent;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of MotionEvent, for the convenience of queuing delays, starting sounds capable
     */
    var Stall = (function (_super) {
        __extends(Stall, _super);
        /**
         * @param {number} milliDuration - The number of milli seconds the stall is to be completed in.
         * @param {string} groupName - The processor / queue to have the stall.  Useful for EventSeries involving multiple groups.
         * @param {BABYLON.Sound} sound - Sound to start with event.  WARNING: When event also has a sync partner, there
         * could be issues.
         */
        function Stall(milliDuration, groupName, sound) {
            if (groupName === void 0) { groupName = QI.PovProcessor.POV_GROUP_NAME; }
            _super.call(this, milliDuration, null, null, { sound: sound });
            this._groupName = groupName;
        }
        return Stall;
    }(MotionEvent));
    QI.Stall = Stall;
})(QI || (QI = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./Pace.ts"/>
/// <reference path="./TimelineControl.ts"/>
/// <reference path="./MotionEvent.ts"/>
var QI;
(function (QI) {
    /**
     * Abstract sub-class of MotionEvent, sub-classed by PropertyEvent & RecurringCallbackEvent
     */
    var NonMotionEvent = (function (_super) {
        __extends(NonMotionEvent, _super);
        function NonMotionEvent() {
            _super.apply(this, arguments);
            this._paused = false;
        }
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        NonMotionEvent.prototype.initialize = function (lateStartMilli, scene) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            this.activate(lateStartMilli);
            if (scene) {
                QI.TimelineControl.initialize(scene); // only does something the first call
                var ref = this;
                this._registeredFN = function () { ref._beforeRender(); };
                scene.registerBeforeRender(this._registeredFN);
                // store scene, so can unregister
                this._scene = scene;
            }
        };
        NonMotionEvent.prototype._beforeRender = function () {
            if (QI.TimelineControl.isSystemPaused) {
                if (!this._paused) {
                    this.pause();
                    this._paused = true;
                }
                return;
            }
            else if (this._paused) {
                this._paused = false;
                this.resumePlay();
            }
            var resume = !this._paused;
            var ratioComplete = this.getCompletionMilestone();
            if (ratioComplete < 0)
                return; // MotionEvent.BLOCKED or MotionEvent.WAITING
            this._incrementallyUpdate(ratioComplete);
            if (this.isComplete()) {
                this.clear();
            }
        };
        /**
         * Stop / cleanup resources. Only does anything when not being added to a queue.
         */
        NonMotionEvent.prototype.clear = function () {
            if (this._scene) {
                this._paused = false;
                this._scene.unregisterBeforeRender(this._registeredFN);
                this._scene = null;
            }
        };
        // method to be overridden
        NonMotionEvent.prototype._incrementallyUpdate = function (ratioComplete) { };
        return NonMotionEvent;
    }(QI.MotionEvent));
    QI.NonMotionEvent = NonMotionEvent;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of NonMotionEvent, for changing the property of an object
     */
    var PropertyEvent = (function (_super) {
        __extends(PropertyEvent, _super);
        /**
         * @param {Object} object - The object instance on which to make a property change
         * @param {string} _property - The name of the property to change
         * @param {any} - The final value that the property should take
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function PropertyEvent(_object, _property, _targetValue, milliDuration, options) {
            _super.call(this, milliDuration, null, null, options);
            this._object = _object;
            this._property = _property;
            this._targetValue = _targetValue;
            if (typeof this._targetValue === "number") {
                this._datatype = PropertyEvent._NUMBER_TYPE;
            }
            else if (this._targetValue instanceof BABYLON.Vector3) {
                this._datatype = PropertyEvent._VEC3_TYPE;
            }
            else
                throw "Datatype not supported";
        }
        /**
         * Not part of constructor in case being run from a queue.  start value might be changed by the
         * time actually run, especially if another PropertyEvent in front of this one.
         * @param {number} lateStartMilli - indication of how far already behind, passed to activate (in super)
         * @param {BABYLON.Scene} scene - When passed, establish a temporary beforeRender (in super). Otherwise,
         * must be being added to a queue.
         */
        PropertyEvent.prototype.initialize = function (lateStartMilli, scene) {
            if (lateStartMilli === void 0) { lateStartMilli = 0; }
            switch (this._datatype) {
                case PropertyEvent._NUMBER_TYPE:
                    this._initialValue = this._object[this._property];
                    break;
                case PropertyEvent._VEC3_TYPE:
                    this._initialValue = this._object[this._property].clone();
                    break;
            }
            this._initialValue = this._object[this._property];
            _super.prototype.initialize.call(this, lateStartMilli, scene);
        };
        PropertyEvent.prototype._incrementallyUpdate = function (ratioComplete) {
            switch (this._datatype) {
                case PropertyEvent._NUMBER_TYPE:
                    this._object[this._property] = this._initialValue + ((this._targetValue - this._initialValue) * ratioComplete);
                    break;
                case PropertyEvent._VEC3_TYPE:
                    this._object[this._property] = BABYLON.Vector3.Lerp(this._initialValue, this._targetValue, ratioComplete);
                    break;
            }
        };
        PropertyEvent._NUMBER_TYPE = 1;
        PropertyEvent._VEC3_TYPE = 2;
        return PropertyEvent;
    }(NonMotionEvent));
    QI.PropertyEvent = PropertyEvent;
    //================================================================================================
    //================================================================================================
    /**
     * Sub-class of NonMotionEvent, for calling a recurring callback
     */
    var RecurringCallbackEvent = (function (_super) {
        __extends(RecurringCallbackEvent, _super);
        /**
         * @param {(ratioComplete : number) => void} callback - The function to call
         * @param {number} milliDuration - The number of milli seconds the property change is to be completed in
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function RecurringCallbackEvent(_callback, milliDuration, options) {
            _super.call(this, milliDuration, null, null, options);
            this._callback = _callback;
        }
        RecurringCallbackEvent.prototype._incrementallyUpdate = function (ratioComplete) {
            this._callback(ratioComplete);
        };
        return RecurringCallbackEvent;
    }(NonMotionEvent));
    QI.RecurringCallbackEvent = RecurringCallbackEvent;
})(QI || (QI = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./MotionEvent.ts"/>
var QI;
(function (QI) {
    /** Provide an action for an EventSeries, for integration into action manager */
    var SeriesAction = (function (_super) {
        __extends(SeriesAction, _super);
        /**
         * @param {any} triggerOptions - passed to super, same as any other Action
         * @param {SeriesTargetable} _target - The object containing the event queue.  Using an interface for MORPH sub-classing.
         * @param {EventSeries} _eSeries - The event series that the action is to submit to the queue.
         * @param {boolean} _clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} _stopCurrentSeries - When true, stop the current MotionSeries too.
         * @param {boolean} condition - passed to super, same as any other Action
         */
        function SeriesAction(triggerOptions, _target, _eSeries, _clearQueue, _stopCurrentSeries, condition) {
            _super.call(this, triggerOptions, condition);
            this._target = _target;
            this._eSeries = _eSeries;
            this._clearQueue = _clearQueue;
            this._stopCurrentSeries = _stopCurrentSeries;
        }
        SeriesAction.prototype.execute = function (evt) {
            this._target.queueEventSeries(this._eSeries, this._clearQueue, this._stopCurrentSeries);
        };
        return SeriesAction;
    }(BABYLON.Action));
    QI.SeriesAction = SeriesAction;
    /** Internal helper class used by EventSeries to support a multi-group EventSeries */
    var ParticipatingGroup = (function () {
        function ParticipatingGroup(groupName) {
            this.groupName = groupName;
            this._indexInRun = -99; // ensure isReady() initially returns false
            this._highestIndexInRun = -1;
        }
        ParticipatingGroup.prototype.isReady = function () { return this._indexInRun === -1; };
        ParticipatingGroup.prototype.runComplete = function () { return this._indexInRun > this._highestIndexInRun; };
        ParticipatingGroup.prototype.activate = function () {
            this._indexInRun = -1;
        };
        return ParticipatingGroup;
    }());
    /**
     *  The object processed by each of the Processors.
     */
    var EventSeries = (function () {
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
        function EventSeries(_events, _nRepeats, _initialWallclockProrating, _groupForFuncActions, _debug) {
            if (_nRepeats === void 0) { _nRepeats = 1; }
            if (_initialWallclockProrating === void 0) { _initialWallclockProrating = 1.0; }
            if (_groupForFuncActions === void 0) { _groupForFuncActions = QI.PovProcessor.POV_GROUP_NAME; }
            if (_debug === void 0) { _debug = false; }
            this._events = _events;
            this._nRepeats = _nRepeats;
            this._initialWallclockProrating = _initialWallclockProrating;
            this._groupForFuncActions = _groupForFuncActions;
            this._debug = _debug;
            this._partnerReady = true;
            // group elements
            this._groups = new Array();
            this._nGroups = 0;
            this._nEvents = this._events.length;
            this._prorating = this._initialWallclockProrating !== 1;
            if (this._nRepeats === 1 && this._prorating)
                BABYLON.Tools.Warn("EventSeries: clock prorating ignored when # of repeats is 1");
            // go through each event in series, building up the unique set shape key groups or skeleton participating, this._groups
            var passed;
            for (var i = 0; i < this._nEvents; i++) {
                // validate the elements in series
                passed = false;
                if (this._events[i] instanceof QI.MotionEvent)
                    passed = true;
                else if (this._events[i] instanceof BABYLON.Action)
                    passed = true;
                else if (typeof this._events[i] === "function")
                    passed = true;
                if (!passed) {
                    BABYLON.Tools.Error("EventSeries:  events must either be a MotionEvent, Action, or function.  Problem idx: " + i);
                    return;
                }
                var groupName = (this._events[i] instanceof QI.MotionEvent) ? this._events[i]._groupName : this._groupForFuncActions;
                this._addGroupAsRequired(groupName, i);
                if (this._events[i] instanceof BABYLON.Action)
                    this._events[i]._prepare();
            }
        }
        EventSeries.prototype.toString = function () {
            var ret = "number of events: " + this._nEvents + ", repeats: " + this._nRepeats + ", # groups: " + this._nGroups;
            for (var i = 0; i < this._nEvents; i++) {
                ret += "\n" + i + "- " + this._events[i].toString();
            }
            return ret;
        };
        // =========================== constructor / queuing helper methods ===========================
        /**
         * Used by constructor for each event.  The first time a particular group (skeleton / shape key group)
         * is encountered, a ParticipatingGroup object is instanced, and added to groups property.
         */
        EventSeries.prototype._addGroupAsRequired = function (groupName, eventIdx) {
            var pGroup = null;
            for (var g = 0, len = this._groups.length; g < len; g++) {
                if (this._groups[g].groupName === groupName) {
                    pGroup = this._groups[g];
                    break;
                }
            }
            if (pGroup === null) {
                pGroup = new ParticipatingGroup(groupName);
                this._groups.push(pGroup);
                this._nGroups++;
            }
            pGroup._highestIndexInRun = eventIdx;
        };
        /**
         * @returns {boolean} True, when more than one processor / queue is involved.
         */
        EventSeries.prototype.hasMultipleParticipants = function () {
            return this._nGroups > 1;
        };
        /**
         * called by QI.Mesh, to figure out which group this should be queued on.
         * @param {string} groupName - This is the group name to see if it has things to do in event series.
         */
        EventSeries.prototype.isGroupParticipating = function (groupName) {
            for (var g = 0; g < this._nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    return true;
            }
            return false;
        };
        // =============================== activation / partner methods ===============================
        /**
         * @param {EventSeries} syncPartner - EventSeries which should start at the same time as this one.
         */
        EventSeries.prototype.setSeriesSyncPartner = function (syncPartner) {
            this._syncPartner = syncPartner;
            this._partnerReady = false;
            syncPartner._syncPartner = this;
        };
        /**
         *  Called by the each of the syncPartners to detect that both are waiting for each other.
         */
        EventSeries.prototype._setPartnerReady = function () {
            this._syncPartner._partnerReady = true;
        };
        /**
         * Signals ready to start processing. Re-initializes incase of reuse. Also evaluates if everybodyReady, when using groups
         * @param {string} groupName - This is the group name saying it is ready.
         */
        EventSeries.prototype.activate = function (groupName) {
            this._indexInRun = -1;
            this._repeatCounter = 0;
            this._proRatingThisRepeat = (this._nRepeats > 1) ? this._initialWallclockProrating : 1.0;
            this._appyProrating();
            // evaluate if everybodyReady
            this._everybodyReady = true;
            for (var g = 0; g < this._nGroups; g++) {
                if (this._groups[g].groupName === groupName)
                    this._groups[g].activate();
                else
                    this._everybodyReady = this._everybodyReady && this._groups[g].isReady();
            }
            // if everybody ready, tell that to partner
            if (this._everybodyReady && this._syncPartner)
                this._setPartnerReady();
            if (this._debug)
                BABYLON.Tools.Log("EventSeries: series activated by " + groupName + ", _everybodyReady: " + this._everybodyReady + ", _partnerReady: " + this._partnerReady);
        };
        // ===================================== processor methods ====================================
        /**
         * Called to know if series is complete.  nextEvent() may still
         * return null if other groups not yet completed their events in a run, or this group has
         * no more to do, but is being blocked from starting its next series till all are done here.
         */
        EventSeries.prototype.hasMoreEvents = function () {
            return this._repeatCounter < this._nRepeats;
        };
        /**
         * Called to get its next event of the series.  Returns null. if series complete.
         * @param {string} groupName - Unused, for subclassing by MORPH
         *
         */
        EventSeries.prototype.nextEvent = function (groupName) {
            // return nothing till all groups signal they are ready to start
            if (!this._everybodyReady || !this._partnerReady) {
                if (this._debug)
                    BABYLON.Tools.Log("EventSeries: nextEvent, not everybody or partner ready");
                return null;
            }
            if (this.hasMultipleParticipants()) {
                return this._nextGroupEvent(groupName);
            }
            // less complicated method when there are not coordinated events with multiple groups
            if (++this._indexInRun === this._nEvents) {
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    this._indexInRun = 0;
                    if (this._prorating) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats));
                    }
                    this._appyProrating();
                }
                else {
                    return null;
                }
            }
            if (this._debug)
                BABYLON.Tools.Log("EventSeries: nextEvent " + this._indexInRun + " in series returned");
            return this._events[this._indexInRun];
        };
        /**
         * apply prorating to each event, even if not prorating, so event knows it is a repeat or not
         */
        EventSeries.prototype._appyProrating = function () {
            // appy to each event each event
            for (var i = 0; i < this._nEvents; i++) {
                if (this._events[i] instanceof QI.MotionEvent) {
                    this._events[i].setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                }
            }
        };
        /**
         * more complicated method used when there are multiple groups.
         * @param {string} groupName - Name of the group calling for its next event
         *
         */
        EventSeries.prototype._nextGroupEvent = function (groupName) {
            var pGroup;
            var allGroupsRunComplete = true;
            // look up the appropriate ParticipatingGroup for below & set allGroupsRunComplete
            for (var g = 0; g < this._nGroups; g++) {
                allGroupsRunComplete = allGroupsRunComplete && this._groups[g].runComplete();
                // no break statement inside block, so allGroupsRunComplete is valid
                if (this._groups[g].groupName === groupName) {
                    pGroup = this._groups[g];
                }
            }
            if (allGroupsRunComplete) {
                // increment repeat counter, reset for next run unless no more repeats
                if (++this._repeatCounter < this._nRepeats) {
                    for (var g = 0; g < this._nGroups; g++) {
                        this._groups[g].activate();
                    }
                    if (this._initialWallclockProrating !== 1) {
                        this._proRatingThisRepeat = this._initialWallclockProrating + ((1 - this._initialWallclockProrating) * ((this._repeatCounter + 1) / this._nRepeats));
                    }
                    if (this._debug)
                        BABYLON.Tools.Log("EventSeries: set for repeat # " + this._repeatCounter);
                }
                else {
                    if (this._debug)
                        console.log("EventSeries: Series complete");
                    this._everybodyReady = false; // ensure that nothing happens until all groups call activate() again
                    if (this._syncPartner)
                        this._partnerReady = false;
                }
            }
            if (!pGroup.runComplete()) {
                // test if should declare complete
                if (pGroup._indexInRun === pGroup._highestIndexInRun) {
                    pGroup._indexInRun++;
                    if (this._debug)
                        BABYLON.Tools.Log("EventSeries: group " + pGroup.groupName + " has completed series.");
                    return null;
                }
                for (var i = pGroup._indexInRun + 1; i < this._nEvents; i++) {
                    var groupName = (this._events[i] instanceof QI.MotionEvent) ? this._events[i]._groupName : this._groupForFuncActions;
                    if (pGroup.groupName === groupName) {
                        pGroup._indexInRun = i;
                        if (this._events[i] instanceof QI.MotionEvent) {
                            this._events[i].setProratedWallClocks(this._proRatingThisRepeat, this._repeatCounter > 0);
                        }
                        if (this._debug)
                            BABYLON.Tools.Log("EventSeries: " + i + " in series returned: " + name + ", allGroupsRunComplete " + allGroupsRunComplete + ", everybodyReady " + this._everybodyReady);
                        return this._events[i];
                    }
                }
            }
            else
                return null;
        };
        return EventSeries;
    }());
    QI.EventSeries = EventSeries;
})(QI || (QI = {}));
/// <reference path="./TimelineControl.ts"/>
/// <reference path="./MotionEvent.ts"/>
/// <reference path="./NonMotionEvents.ts"/>
/// <reference path="./EventSeries.ts"/>
var QI;
(function (QI) {
    var PovProcessor = (function () {
        /**
         * @param {BABYLON.Node} _node - Node (mesh, camera, or spot / directional light) to attach before render to
         * @param {boolean} skipRegistration - When true, to not actually register before render function (MORPH sub-classing), ignore when not mesh
         */
        function PovProcessor(_node, skipRegistration) {
            if (skipRegistration === void 0) { skipRegistration = false; }
            this._node = _node;
            this.skipRegistration = skipRegistration;
            // event series queue & reference vars for current series & step within
            this._queue = new Array();
            this._currentSeries = null;
            this._currentStepInSeries = null;
            this._endOfLastFrameTs = -1;
            this._doingRotation = false;
            this._rotationMatrix = new BABYLON.Matrix();
            // position control members
            this._doingMovePOV = false;
            // do freezeWorldMatrix (only want to do this when actual rotation / motion, not just morphing / skelatal interpolation)
            // reason being that freezeWorldMatrix wrappers a call to computeWorldMatrix, so un-neccessary refreezing defeats purpose
            this._u = false;
            this._name = PovProcessor.POV_GROUP_NAME; // for multi group event series as in MORPH
            // ================================== INSTANCE play - pause ==================================
            this._lastResumeTime = 0; // for passive detection of game pause
            this._instancePaused = false;
            var scene = this._node.getScene();
            QI.TimelineControl.initialize(scene); // only does something the first call
            this._isproperty = this._node === null;
            this._isMesh = (!this._isproperty) && this._node instanceof BABYLON.Mesh;
            this._isLight = (!this._isproperty) && this._node instanceof BABYLON.Light;
            this._isCamera = (!this._isproperty) && this._node instanceof BABYLON.Camera;
            // validate this node is usable
            if (this._isCamera) {
                if (!(this._node instanceof BABYLON.TargetCamera))
                    throw new Error("PovProcessor: Only TargetCamera subclasses can use Queued Interpolation");
                if (this._node.lockedTarget)
                    throw new Error("PovProcessor: Camera with a lockedTarget cannot use Queued Interpolation");
                this._rotationProperty = "rotation";
            }
            else if (this._isLight) {
                if (!this._node["position"] || !this._node["direction"])
                    throw new Error("PovProcessor: Only SpotLight & DirectionalLight can use Queued Interpolation");
                this._rotationProperty = "direction";
            }
            else if (this._isMesh) {
                this._rotationProperty = "rotation";
            }
            // tricky registering a prototype as a callback in constructor; cannot say 'this._incrementallyMove()' & must be wrappered
            var ref = this;
            // using scene level before render, so always runs & only once per frame;  non-mesh nodes, have no choice anyway
            if (!skipRegistration) {
                this._registeredFN = function () { ref._incrementallyMove(); };
                scene.registerBeforeRender(this._registeredFN);
            }
        }
        /**
         * Not automatically called.  A QI.Mesh uses its own, so not problem there.
         */
        PovProcessor.prototype.dispose = function () {
            this._node.getScene().unregisterBeforeRender(this._registeredFN);
        };
        // =================================== inside before render ==================================
        /**
         * beforeRender() registered to scene for this._node.  Public for sub-classing in QI.ShapekeyGroup.
         */
        PovProcessor.prototype._incrementallyMove = function () {
            // test for active instance pausing, either instance of entire system
            if (this._instancePaused || QI.TimelineControl.isSystemPaused) {
                if (this._currentStepInSeries)
                    this._currentStepInSeries.pause();
                return;
            }
            // system resume test
            if (this._lastResumeTime < QI.TimelineControl.SystemResumeTime) {
                this._lastResumeTime = QI.TimelineControl.SystemResumeTime;
                this.resumeInstancePlay(); // does nothing when this._currentStepInSeries === null
            }
            // series level of processing; get another series from the queue when none or last is done
            if (this._currentSeries === null || !this._currentSeries.hasMoreEvents()) {
                if (!this._nextEventSeries())
                    return;
            }
            // ok, have an active event series, now get the next motion event in series if required
            while (this._currentStepInSeries === null || this._currentStepInSeries.isComplete()) {
                var next = this._currentSeries.nextEvent(this._name);
                // being blocked, not ready for us, only occurs in a multi-group series in MORPH
                if (next === null)
                    return;
                if (next instanceof BABYLON.Action && this._isMesh) {
                    next.execute(BABYLON.ActionEvent.CreateNew(this._node));
                }
                else if (typeof (next) === "function") {
                    next.call();
                }
                else {
                    this._nextEvent(next); // must be a new MotionEvent. _currentStepInSeries assigned if valid
                }
            }
            // ok, have a motion event to process
            try {
                this._ratioComplete = this._currentStepInSeries.getCompletionMilestone();
                if (this._ratioComplete < 0)
                    return; // MotionEvent.BLOCKED or MotionEvent.WAITING
                // processing of a NonMotionEvent
                if (this._currentStepInSeries instanceof QI.NonMotionEvent) {
                    this._currentStepInSeries._incrementallyUpdate(this._ratioComplete);
                    return;
                }
                if (this._doingRotation) {
                    PovProcessor.LerpToRef(this._rotationStart, this._rotationEnd, this._ratioComplete, this._node[this._rotationProperty]);
                }
                if (this._doingMovePOV) {
                    if (this._doingRotation && !this._currentStepInSeries.options.noStepWiseMovement && !this._currentStepInSeries.options.absoluteMovement) {
                        // some of these amounts, could be negative, if has a Pace with a hiccup
                        var amtRight = (this._fullAmtRight * this._ratioComplete) - this._amtRightSoFar;
                        var amtUp = (this._fullAmtUp * this._ratioComplete) - this._amtUpSoFar;
                        var amtForward = (this._fullAmtForward * this._ratioComplete) - this._amtForwardSoFar;
                        this.movePOV(amtRight, amtUp, amtForward);
                        this._amtRightSoFar += amtRight;
                        this._amtUpSoFar += amtUp;
                        this._amtForwardSoFar += amtForward;
                    }
                    else {
                        PovProcessor.LerpToRef(this._positionStartVec, this._positionEndVec, this._ratioComplete, this._node["position"]);
                    }
                    if (this._activeLockedCamera !== null)
                        this._activeLockedCamera._getViewMatrix();
                }
            }
            finally {
                this._endOfLastFrameTs = QI.TimelineControl.Now;
            }
        };
        // ============================ Event Series Queueing & retrieval ============================
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         */
        PovProcessor.prototype.queueEventSeries = function (eSeries, clearQueue, stopCurrentSeries) {
            if (clearQueue)
                this.clearQueue(stopCurrentSeries);
            this._queue.push(eSeries);
        };
        PovProcessor.prototype.insertSeriesInFront = function (eSeries) {
            this._queue.splice(0, 0, eSeries);
        };
        /**
         * @param {number} _nRepeats - Number of times to run through series elements.
         */
        PovProcessor.prototype.queueSingleEvent = function (event, nRepeats) {
            if (nRepeats === void 0) { nRepeats = 1; }
            this.queueEventSeries(new QI.EventSeries([event], nRepeats));
        };
        /**
         * Clear out any events
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        PovProcessor.prototype.clearQueue = function (stopCurrentSeries) {
            this._queue = new Array();
            if (stopCurrentSeries)
                this._currentSeries = null;
        };
        /**
         * Stop current activities.
         * @param {boolean} step - When true, stop the current MotionEvent.
         * @param {boolean} series - When true, stop the current MotionSeries.  Note this will also stop
         * the current step.
         */
        PovProcessor.prototype.stopCurrent = function (step, series) {
            if (step)
                this._currentStepInSeries = null;
            if (series)
                this._currentSeries = null;
        };
        PovProcessor.prototype._nextEventSeries = function () {
            // finish all events no matter what, but do not start a new one unless node is enabled, and rendered at least once
            var ret = this._queue.length > 0 && this._node.isEnabled() && this._node._currentRenderId !== -1;
            if (ret) {
                this._currentSeries = this._queue.shift();
                this._currentSeries.activate(this._name);
            }
            else
                this._currentSeries = null;
            // clean out current step in any case, aids un-neccessary resumePlay of a completed step
            this._currentStepInSeries = null;
            return ret;
        };
        /* returns true when either something is running (could be blocked or waiting) or something queueed */
        PovProcessor.prototype.isActive = function () {
            return this._currentSeries !== null || this._queue.length > 0;
        };
        // ======================================== event prep =======================================
        /**
         * Public for sub-classing in PoseProcessor & ShapeKeyGroup.
         * @param {MotionEvent} event - The event processed and assigned the current step
         * @param {BABYLON.Vector3} movementScaling - Passed by PoseProcessor sub-class, multiplier to account for
         * the skeleton being different from the one used to build the skeleton library; optional
         */
        PovProcessor.prototype._nextEvent = function (event, movementScaling) {
            if (movementScaling === void 0) { movementScaling = null; }
            // do this as soon as possible to get the clock started, retroactively, when sole group in the series, and within 50 millis of last deform
            var lateStart = QI.TimelineControl.isRealtime ? QI.TimelineControl.Now - this._endOfLastFrameTs : 0;
            event.activate((lateStart - this._endOfLastFrameTs < PovProcessor.MAX_MILLIS_FOR_EVENT_LATE_START && !this._currentSeries.hasMultipleParticipants()) ? lateStart : 0);
            this._currentStepInSeries = event;
            // initialize a NonMotionEvent event, so any queue can process them
            if (event instanceof QI.NonMotionEvent) {
                event.initialize(lateStart);
            }
            // prepare for rotation, if event calls for
            this._doingRotation = event.rotatePOV !== null;
            if (this._doingRotation) {
                this._rotationStart = this._node[this._rotationProperty].clone();
                this._rotationEnd = event.options.absoluteRotation ? event.rotatePOV : this._rotationStart.add(this.calcRotatePOV(event.rotatePOV.x, event.rotatePOV.y, event.rotatePOV.z));
            }
            // prepare for POV move, if event calls for
            this._doingMovePOV = event.movePOV !== null;
            if (this._doingMovePOV) {
                var movePOV = event.movePOV;
                if (movementScaling)
                    movePOV = movePOV.multiply(movementScaling);
                this._positionStartVec = this._node["position"].clone();
                this._fullAmtRight = movePOV.x;
                this._amtRightSoFar = 0;
                this._fullAmtUp = movePOV.y;
                this._amtUpSoFar = 0;
                this._fullAmtForward = movePOV.z;
                this._amtForwardSoFar = 0;
                // less resources to calcMovePOV() once then Lerp(), but calcMovePOV() uses rotation, so can only go fast when not rotating too
                if (!this._doingRotation || event.options.noStepWiseMovement || event.options.absoluteMovement) {
                    this._positionEndVec = event.options.absoluteMovement ? event.movePOV : this._positionStartVec.add(this.calcMovePOV(this._fullAmtRight, this._fullAmtUp, this._fullAmtForward));
                }
            }
            // determine if camera needs to be woke up for tracking
            this._activeLockedCamera = null; // assigned for failure
            if ((this._doingRotation || this._doingMovePOV) && this._isMesh) {
                var activeCamera = this._node.getScene().activeCamera;
                // TargetCamera uses lockedTarget & ArcRotateCamera uses target, so must test both
                var target = activeCamera.lockedTarget || activeCamera.target;
                if (target && target === this._node)
                    this._activeLockedCamera = activeCamera;
            }
        };
        // ================================== Point of View Movement =================================
        /**
         * Perform relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the node's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        PovProcessor.prototype.movePOV = function (amountRight, amountUp, amountForward) {
            this._node["position"].addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
        };
        /**
         * Calculate relative position change from the point of view of behind the front of the node.
         * This is performed taking into account the nodes's current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         */
        PovProcessor.prototype.calcMovePOV = function (amountRight, amountUp, amountForward) {
            var rot = this._node[this._rotationProperty];
            BABYLON.Matrix.RotationYawPitchRollToRef(rot.y, rot.x, rot.z, this._rotationMatrix);
            var translationDelta = BABYLON.Vector3.Zero();
            var defForwardMult = this._isMesh ? (this._node.definedFacingForward ? -1 : 1) : 1;
            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, this._rotationMatrix, translationDelta);
            return translationDelta;
        };
        // ================================== Point of View Rotation =================================
        /**
         * Perform relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        PovProcessor.prototype.rotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var amt = this.calcRotatePOV(flipBack, twirlClockwise, tiltRight);
            this._node[this._rotationProperty].addInPlace(amt);
        };
        /**
         * Calculate relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         */
        PovProcessor.prototype.calcRotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var defForwardMult = this._isMesh ? (this._node.definedFacingForward ? 1 : -1) : 1;
            return new BABYLON.Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
        };
        PovProcessor.prototype.isInstancePaused = function () { return this._instancePaused; };
        PovProcessor.prototype.pauseInstance = function () { this._instancePaused = true; };
        PovProcessor.prototype.resumeInstancePlay = function () {
            this._lastResumeTime = QI.TimelineControl.Now;
            this._instancePaused = false;
            // cause Event in progress to calibrate for smooth resume
            if (this._currentStepInSeries !== null)
                this._currentStepInSeries.resumePlay();
        };
        Object.defineProperty(PovProcessor, "Version", {
            // ========================================= Statics =========================================
            get: function () {
                return "1.0.0";
            },
            enumerable: true,
            configurable: true
        });
        PovProcessor.LerpToRef = function (start, end, amount, result) {
            result.x = start.x + ((end.x - start.x) * amount);
            result.y = start.y + ((end.y - start.y) * amount);
            result.z = start.z + ((end.z - start.z) * amount);
        };
        PovProcessor.SlerpToRef = function (left, right, amount, result) {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;
            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }
            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }
            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);
            return result;
        };
        PovProcessor.formatQuat = function (d) {
            return "{X: " + d.x.toFixed(4) + " Y:" + d.y.toFixed(4) + " Z:" + d.z.toFixed(4) + " W:" + d.w.toFixed(4) + "}";
        };
        PovProcessor.POV_GROUP_NAME = "POV_PROCESSOR";
        PovProcessor.MAX_MILLIS_FOR_EVENT_LATE_START = 50;
        return PovProcessor;
    }());
    QI.PovProcessor = PovProcessor;
})(QI || (QI = {}));
/// <reference path="./MatrixComp.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../queue/PovProcessor.ts"/>
var QI;
(function (QI) {
    var Bone = (function (_super) {
        __extends(Bone, _super);
        /**
         * Argument signature same as that of parent, BABYLON.Bone, except restPose IS NOT optional here.
         */
        function Bone(name, skeleton, parentBone, matrix, restPose) {
            _super.call(this, name, skeleton, parentBone, matrix, restPose);
            // permanent variable (temporary) values to reduce # of start & end computations, & eliminate garbage generation
            this._startScale = new BABYLON.Vector3(0, 0, 0);
            this._startRotation = new BABYLON.Quaternion();
            this._startTranslation = new BABYLON.Vector3(0, 0, 0);
            this._resultScale = new BABYLON.Vector3(0, 0, 0);
            this._resultRotation = new BABYLON.Quaternion();
            this._resultTranslation = new BABYLON.Vector3(0, 0, 0);
            this._rotationMatrix = new BABYLON.Matrix();
            this._restComp = QI.MatrixComp.fromMatrix(restPose);
        }
        /** called by Skeleton.assignPoseLibrary() to compare Basis (Rest) to that of the library, to keep it out of assignPose() */
        Bone.prototype.assignPoseLibrary = function (library) {
            this._restComp.setBasisRatios(library.poses["basis"].targets[this.name]);
        };
        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        /** called by Pose.assignPose(), when bone is potentially changed by the pose (could already be at this setting)
         */
        Bone.prototype._assignPose = function (targetValue, immediately) {
            this._rel_target = this._restComp.getRelativePose(targetValue);
            // decompose the current state (local)
            this.getLocalMatrix().decompose(this._startScale, this._startRotation, this._startTranslation);
            this._alreadyAtTarget = this._rel_target.equals(this._startRotation, this._startTranslation, this._startScale) && !this.getParent();
            if (!this._alreadyAtTarget) {
                if (immediately) {
                    this._incrementallyDeform(1.0);
                }
            }
        };
        /**
         * Called by Pose._assignPose(), when bone is not even changed by the pose
         */
        Bone.prototype._setAlreadyAtTarget = function () { this._alreadyAtTarget = true; };
        /**
         * Called by this._assignPose() when immediate & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        Bone.prototype._incrementallyDeform = function (ratioComplete) {
            if (this._alreadyAtTarget)
                return;
            QI.PovProcessor.LerpToRef(this._startScale, this._rel_target.scale, ratioComplete, this._resultScale);
            QI.PovProcessor.SlerpToRef(this._startRotation, this._rel_target.rotation, ratioComplete, this._resultRotation);
            QI.PovProcessor.LerpToRef(this._startTranslation, this._rel_target.translation, ratioComplete, this._resultTranslation);
            // compose result back into local
            var local = this.getLocalMatrix();
            local.m[0] = this._resultScale.x;
            local.m[1] = 0;
            local.m[2] = 0;
            local.m[3] = 0;
            local.m[4] = 0;
            local.m[5] = this._resultScale.y;
            local.m[6] = 0;
            local.m[7] = 0;
            local.m[8] = 0;
            local.m[9] = 0;
            local.m[10] = this._resultScale.z;
            local.m[11] = 0;
            local.m[12] = 0;
            local.m[13] = 0;
            local.m[14] = 0;
            local.m[15] = 1;
            BABYLON.Matrix.IdentityToRef(this._rotationMatrix);
            this._resultRotation.toRotationMatrix(this._rotationMatrix);
            local.multiplyToRef(this._rotationMatrix, local);
            local.setTranslation(this._resultTranslation);
            this.markAsDirty();
        };
        return Bone;
    }(BABYLON.Bone));
    QI.Bone = Bone;
})(QI || (QI = {}));
/// <reference path="./Bone.ts"/>
/// <reference path="./Pose.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QI;
(function (QI) {
    var Skeleton = (function (_super) {
        __extends(Skeleton, _super);
        function Skeleton() {
            _super.apply(this, arguments);
            this._subPoses = new Array();
        }
        // no constructor required, using super's
        /** called by the PoseProcessor constructor; all bones should have been added by now */
        Skeleton.prototype.validateSkeleton = function () {
            var nBones = this.bones.length;
            var nRootBones = 0;
            for (var i = 0; i < nBones; i++) {
                var bone = this.bones[i];
                if (!bone.getParent())
                    nRootBones++;
                // verify only one root & all bones instance of QI.Bone
                if (!(bone instanceof QI.Bone)) {
                    BABYLON.Tools.Error("QI.Skeleton:  " + this.name + ", Bone(" + bone.name + ") is not a QI.Bone");
                    return false;
                }
            }
            if (nRootBones !== 1) {
                BABYLON.Tools.Error("QI.Skeleton:  " + this.name + " has more than 1 bone without a parent");
                return false;
            }
            return true;
        };
        // =================================== Library assignment ====================================
        /** Only one library can be assigned to a library at a time.
         *  Validation of compatiblity, and pre-processing for scaling differences performed.
         *  No effect, if already assigned to that library.
         *  @param {string} libraryName - name of the library to assign; no effect if already assigned
         */
        Skeleton.prototype.assignPoseLibrary = function (libraryName) {
            if (this._poseLibrary && this._poseLibrary.name === libraryName)
                return;
            var library = QI.SkeletonPoseLibrary.getLibraryByName(libraryName);
            if (!library) {
                BABYLON.Tools.Error("QI.Skeleton:  library(" + libraryName + ") not found");
            }
            else if (this._validateLibraryForSkeleton(library)) {
                this._poseLibrary = library;
                this.clearAllSubPoses();
                // scaling pre-processing
                this._skelDimensionsRatio = this.dimensionsAtRest.divide(this._poseLibrary.dimensionsAtRest);
                // test if dimensions all the same, if so better performance setting to null
                if (this._skelDimensionsRatio.x === 1 && this._skelDimensionsRatio.y === 1 && this._skelDimensionsRatio.z === 1) {
                    this._skelDimensionsRatio = null;
                }
                for (var i = 0, len = this.bones.length; i < len; i++) {
                    this.bones[i].assignPoseLibrary(this._poseLibrary);
                }
            }
        };
        /** Method which does the validation that this library is compatible
         *  @param {SkeletonPoseLibrary} library - The candidate library
         *  @returns {boolean} - True when valid
         */
        Skeleton.prototype._validateLibraryForSkeleton = function (library) {
            var nBones = this.bones.length;
            if (Object.keys(library.boneLengths).length !== nBones) {
                BABYLON.Tools.Error("QI.Skeleton:  library(" + library.name + ") has incorrect # of bones; " + nBones + " in skeleton " + library.nBones + " in library");
                return false;
            }
            // verify bone matches one in library
            for (var i = 0; i < nBones; i++) {
                var bone = this.bones[i];
                if (!library.boneLengths[bone.name]) {
                    BABYLON.Tools.Error("QI.Skeleton:  " + this.name + ", has Bone(" + bone.name + ") not found in library");
                    return false;
                }
            }
            return true;
        };
        // ====================================== pose methods =====================================
        /**
         * Should not be call here, but through the mesh so that the processor can note the change.
         */
        Skeleton.prototype._assignPoseImmediately = function (poseName) {
            var pose = this._poseLibrary.poses[poseName];
            if (pose) {
                pose._assignPose(this, true);
            }
            else {
                BABYLON.Tools.Error("QI.Skeleton:  pose(" + poseName + ") not found");
            }
        };
        Skeleton.prototype.currentStateAsPose = function (name) {
            var basis = this._poseLibrary.poses["basis"];
            var targets = {};
            for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
                targets[this.bones[i].name] = this.bones[i].getLocalMatrix().clone();
            }
            return new QI.Pose(name, this._poseLibrary, targets);
        };
        // ==================================== sub-pose methods ===================================
        Skeleton.prototype.addSubPose = function (poseName) {
            // check subpose has not already been added
            for (var i = 0, len = this._subPoses.length; i < len; i++) {
                if (this._subPoses[i].name === poseName)
                    return;
            }
            var subPose = this._poseLibrary ? this._poseLibrary.poses[poseName] : null;
            if (!subPose)
                BABYLON.Tools.Error("QI.Skeleton:  sub-pose(" + poseName + ") not found");
            else if (!subPose.isSubPose)
                BABYLON.Tools.Error("QI.Skeleton:  pose(" + subPose.name + ") is not a subpose");
            this._subPoses.push(subPose);
        };
        Skeleton.prototype.removeSubPose = function (poseName) {
            for (var i = 0; i < this._subPoses.length; i++) {
                if (this._subPoses[i].name === poseName) {
                    this._subPoses.splice(i, 1);
                    return;
                }
            }
        };
        Skeleton.prototype.clearAllSubPoses = function () {
            this._subPoses = new Array();
        };
        return Skeleton;
    }(BABYLON.Skeleton));
    QI.Skeleton = Skeleton;
})(QI || (QI = {}));
/// <reference path="./MatrixComp.ts"/>
/// <reference path="./Bone.ts"/>
/// <reference path="./Skeleton.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>
var QI;
(function (QI) {
    var Pose = (function () {
        /**
         * @immutable, to be reused across skeletons
         * This is instanced by computer generated code.
         * @param {string} name- The name of the pose given in the Blender skeleton library.  A sub-pose is
         *                 detected by having a '.sp' as part of the name, typically a suffix.
         *
         * @param {SkeletonPoseLibrary} library- The instance of the QI.SkeletonPoseLibrary to add itself to
         * @param {[boneName: string] : BABYLON.Matrix} targets - A dictionary of matrices of the bones that
         *                                              particpate in this pose.
         */
        function Pose(name, library, targets) {
            this.name = name;
            this.library = library;
            this.targets = {};
            for (var boneName in targets) {
                this.targets[boneName] = QI.MatrixComp.fromMatrix(targets[boneName]);
            }
            this.library._addPose(this);
            this.isSubPose = name.indexOf(".sp") != -1;
            if (this.isSubPose && Object.keys(this.targets).length === library.nBones) {
                BABYLON.Tools.Error("QI.Pose:  sub-pose(" + this.name + "), must have fewer bones than found in library(" + library.name + ")");
                return;
            }
            if (name !== "basis") {
                var basis = this.library.poses["basis"].targets;
                for (var boneName in basis) {
                    // add back any targets from basis pose in library, which are missing; except root bone or sub-poses
                    if (boneName === this.library.nameOfRoot)
                        continue;
                    if (!this.targets[boneName]) {
                        if (!this.isSubPose) {
                            this.targets[boneName] = basis[boneName];
                        }
                    }
                    else {
                        // get the ratio of the Basis (Rest) pose
                        this.targets[boneName].setBasisDiffs(basis[boneName]);
                        if (name === "sitting2") {
                            console.log(boneName + ": " + this.targets[boneName].rotationBasisDiff.toString());
                        }
                    }
                }
            }
            // freeze everything to make immutable
            for (var boneName in this.targets) {
                var target = this.targets[boneName];
                // Object.freeze(target.m); you cannot freeze Typed Arrays
                Object.freeze(target);
            }
            Object.freeze(this);
        }
        /**
         * Called by Skeleton._assignPoseImmediately() & PoseProcessor._nextEvent().
         * Not meant to be called by user.
         */
        Pose.prototype._assignPose = function (skeleton, immediately) {
            // merge the bone targets of any skeleton sub-poses, if they exist
            var targets = (skeleton._subPoses.length > 0) ? this._mergeSubPoses(skeleton._subPoses) : this.targets;
            for (var i = 0, len = skeleton.bones.length; i < len; i++) {
                var bone = skeleton.bones[i];
                var target = targets[bone.name];
                if (target) {
                    bone._assignPose(target, immediately);
                }
                else
                    bone._setAlreadyAtTarget();
            }
        };
        Pose.prototype._mergeSubPoses = function (subPoses) {
            var targets = {};
            for (var boneName in this.targets) {
                targets[boneName] = this.targets[boneName];
            }
            // subPoses applied second, which will over write bone targets from this pose
            for (var i = 0, len = subPoses.length; i < len; i++) {
                for (var boneName in subPoses[i].targets) {
                    targets[boneName] = subPoses[i].targets[boneName];
                }
            }
            return targets;
        };
        return Pose;
    }());
    QI.Pose = Pose;
})(QI || (QI = {}));
/// <reference path="./Pose.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/Pace.ts"/>
var QI;
(function (QI) {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    var PoseEvent = (function (_super) {
        __extends(PoseEvent, _super);
        /**
         * @param {string} poseName - The name of the pose; must be in the library assigned to the skeleton when run
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed or null.
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {string[]} subposes - subposes which should be substituted during event (default null)
         * @param {boolean} revertSubposes - Any subposes should actually be subtracted during event(default false)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function PoseEvent(poseName, milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            _super.call(this, milliDuration, movePOV, rotatePOV, options);
            this.poseName = poseName;
            this._groupName = QI.PoseProcessor.INTERPOLATOR_GROUP_NAME;
        }
        // ==================================== Getters & setters ====================================
        PoseEvent.prototype.toString = function () {
            var ret = "Pose- " + this.poseName + ", ";
            if (this.options.subposes && this.options.subposes.length > 0) {
                ret += "Subposes- [";
                for (var i = 0, len = this.options.subposes.length; i < len; i++) {
                    ret += " " + this.options.subposes[i];
                }
                ret += "], revertSubposes- " + this.options.revertSubposes + ", ";
            }
            return ret + _super.prototype.toString.call(this);
        };
        return PoseEvent;
    }(QI.MotionEvent));
    QI.PoseEvent = PoseEvent;
})(QI || (QI = {}));
/// <reference path="./Pose.ts"/>
/// <reference path="./PoseEvent.ts"/>
/// <reference path="./Skeleton.ts"/>
/// <reference path="./Bone.ts"/>
/// <reference path="./SkeletonPoseLibrary.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../queue/PovProcessor.ts"/>
/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/EventSeries.ts"/>
var QI;
(function (QI) {
    var PoseProcessor = (function (_super) {
        __extends(PoseProcessor, _super);
        function PoseProcessor(_skeleton, parentMesh, skipRegistration) {
            _super.call(this, parentMesh, skipRegistration);
            this._skeleton = _skeleton;
            this._lastPoseRun = "basis"; // only public for Pose
            this._name = PoseProcessor.INTERPOLATOR_GROUP_NAME; // override dummy
            var nBones = this._skeleton.bones.length;
            this._skeleton.validateSkeleton();
        }
        // =================================== inside before render ==================================
        /**
         * Called by the beforeRender() registered by this._mesh
         * SkeletonInterpolator is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         */
        PoseProcessor.prototype.incrementallyDeform = function () {
            _super.prototype._incrementallyMove.call(this);
            // test of this._currentSeries is duplicated, since super.incrementallyMove() cannot return a value
            // is possible to have a MotionEvent(with no deformation), which is not a SkeletalDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof QI.PoseEvent))
                return false;
            this._lastPoseRun = this._currentStepInSeries.poseName;
            if (this._ratioComplete < 0)
                return false; // MotionEvent.BLOCKED or MotionEvent.WAITING
            for (var i = 0, nBones = this._skeleton.bones.length; i < nBones; i++) {
                this._skeleton.bones[i]._incrementallyDeform(this._ratioComplete);
            }
            return true;
        };
        /**
         * @returns {string}- This is the name of which is the last one
         * in the queue.  If there is none in the queue, then a check is done of the event currently
         * running, if any.
         *
         * If a pose has not been found yet, then get the last recorded pose.
         */
        PoseProcessor.prototype.getLastPoseNameQueuedOrRun = function () {
            // check the queue first for the last pose set to run
            var lastPose;
            for (var i = this._queue.length - 1; i >= 0; i--) {
                lastPose = this._getLastEventInSeries(this._queue[i]);
                if (lastPose)
                    return lastPose;
            }
            // queue could be empty, return last of current series if exists
            if (this._currentSeries) {
                lastPose = this._getLastEventInSeries(this._currentSeries);
                if (lastPose)
                    return lastPose;
            }
            // nothing running or queued; return last recorded
            return this._lastPoseRun;
        };
        PoseProcessor.prototype._getLastEventInSeries = function (series) {
            var events = series._events;
            for (var i = events.length - 1; i >= 0; i--) {
                if (events[i] instanceof QI.PoseEvent)
                    return events[i].poseName;
            }
            return null;
        };
        // ======================================== event prep =======================================
        /** called by super._incrementallyMove()
         */
        PoseProcessor.prototype._nextEvent = function (event) {
            var movementScaling;
            // is possible to have a MotionEvent(with no deformation), not SkeletalDeformation sub-class
            if (event instanceof QI.PoseEvent) {
                var poseEvent = event;
                var pose = this._skeleton._poseLibrary.poses[poseEvent.poseName];
                if (pose) {
                    // sub-pose addition / substraction
                    if (poseEvent.options.subposes) {
                        for (var i = 0, len = poseEvent.options.subposes.length; i < len; i++) {
                            if (poseEvent.options.revertSubposes)
                                this._skeleton.removeSubPose(poseEvent.options.subposes[i]);
                            else
                                this._skeleton.addSubPose(poseEvent.options.subposes[i]);
                        }
                    }
                    pose._assignPose(this._skeleton);
                }
                else if (poseEvent.poseName !== null) {
                    BABYLON.Tools.Error("PoseProcessor:  pose(" + poseEvent.poseName + ") not found");
                    return;
                }
            }
            _super.prototype._nextEvent.call(this, event, this._skeleton._skelDimensionsRatio);
        };
        PoseProcessor.INTERPOLATOR_GROUP_NAME = "SKELETON";
        return PoseProcessor;
    }(QI.PovProcessor));
    QI.PoseProcessor = PoseProcessor;
})(QI || (QI = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../queue/MotionEvent.ts"/>
/// <reference path="../../queue/Pace.ts"/>
var QI;
(function (QI) {
    /**
     * Class to store Deformation info & evaluate how complete it should be.
     */
    var VertexDeformation = (function (_super) {
        __extends(VertexDeformation, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} _referenceStateName - Names of state key to be used as a reference, so that a endStateRatio can be used
         * @param {Array} _endStateNames - Names of state keys to deform to
         * @param {Array} _endStateRatios - ratios of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1's)
         *
         * args from super:
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time (default null).
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function VertexDeformation(groupName, _referenceStateName, _endStateNames, _endStateRatios, 
            // args from super
            milliDuration, movePOV, rotatePOV, options) {
            if (_endStateRatios === void 0) { _endStateRatios = null; }
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            _super.call(this, milliDuration, movePOV, rotatePOV, options);
            this._referenceStateName = _referenceStateName;
            this._endStateNames = _endStateNames;
            this._endStateRatios = _endStateRatios;
            if (!(this._endStateNames instanceof Array) || (this._endStateRatios !== null && !(this._endStateRatios instanceof Array))) {
                BABYLON.Tools.Error("VertexDeformation: end states / ratios not an array");
                return;
            }
            var nEndStates = this._endStateNames.length;
            if (this._endStateRatios !== null) {
                if (this._endStateRatios.length !== nEndStates) {
                    BABYLON.Tools.Error("VertexDeformation: end states / ratios not same length");
                    return;
                }
            }
            // mixed case group & state names not supported
            this._groupName = groupName.toUpperCase();
            this._referenceStateName = this._referenceStateName.toUpperCase();
            // skip remaining test when is BasisReturn
            if (this instanceof BasisReturn)
                return;
            for (var i = 0; i < nEndStates; i++) {
                this._endStateNames[i] = this._endStateNames[i].toUpperCase();
                if (this._referenceStateName === this._endStateNames[i]) {
                    BABYLON.Tools.Error("VertexDeformation: reference state cannot be the same as the end state");
                    return;
                }
                if (this._endStateRatios !== null && (this._endStateRatios[i] < -1 || this._endStateRatios[i] > 1)) {
                    BABYLON.Tools.Error("VertexDeformation: endStateRatio range  > -1 and < 1");
                    return;
                }
            }
        }
        // ==================================== Post constructor edits ====================================
        // ==================================== Getters & setters ====================================
        VertexDeformation.prototype.getReferenceStateName = function () { return this._referenceStateName; };
        VertexDeformation.prototype.getEndStateName = function (idx) { return this._endStateNames[idx]; };
        VertexDeformation.prototype.getEndStateNames = function () { return this._endStateNames; };
        VertexDeformation.prototype.getEndStateRatio = function (idx) { return this._endStateRatios[idx]; };
        VertexDeformation.prototype.getEndStateRatios = function () { return this._endStateRatios; };
        return VertexDeformation;
    }(QI.MotionEvent));
    QI.VertexDeformation = VertexDeformation;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of VertexDeformation, where the referenceStateName is Fixed to "BASIS" & only one end state involved
     */
    var Deformation = (function (_super) {
        __extends(Deformation, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
         *
         * args from super
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null)
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null)
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function Deformation(groupName, endStateName, endStateRatio, 
            // args from super
            milliDuration, movePOV, rotatePOV, options) {
            if (endStateRatio === void 0) { endStateRatio = 1; }
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            _super.call(this, groupName, "BASIS", [endStateName], [endStateRatio], milliDuration, movePOV, rotatePOV, options);
        }
        return Deformation;
    }(VertexDeformation));
    QI.Deformation = Deformation;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of Deformation, to immediately attain a shape.  To be truely immediate you need to
     * queue on mesh & specify to clearQueue like:
     *
     * var event = new QI.MorphImmediate(...);
     * var series = new QI.EventSeries([event]);
     * mesh.queueEventSeries(series, true);
     *
     * If you specify a sound, then it will not perform event until sound is ready.
     */
    var MorphImmediate = (function (_super) {
        __extends(MorphImmediate, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         * @param {string} endStateName - Name of state key to deform to
         * @param {number} endStateRatio - ratio of the end state to be obtained from reference state: -1 (mirror) to 1 (default 1)
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function MorphImmediate(groupName, endStateName, endStateRatio, options) {
            if (endStateRatio === void 0) { endStateRatio = 1; }
            _super.call(this, groupName, endStateName, endStateRatio, 1, null, null, options);
        }
        return MorphImmediate;
    }(Deformation));
    QI.MorphImmediate = MorphImmediate;
    //================================================================================================
    //================================================================================================
    /**
     * sub-class of Deformation, to return to the basis state
     */
    var BasisReturn = (function (_super) {
        __extends(BasisReturn, _super);
        /**
         * @param {string} groupName -  Used by QI.Mesh to place in the correct ShapeKeyGroup queue(s).
         *
         * args from super:
         * @param {number} milliDuration - The number of milli seconds the deformation is to be completed in
         * @param {Vector3} movePOV - Mesh movement relative to its current position/rotation to be performed at the same time  (default null).
         *                  right-up-forward
         *
         * @param {Vector3} rotatePOV - Incremental Mesh rotation to be performed at the same time  (default null).
         *                  flipBack-twirlClockwise-tiltRight
         *
         * @param {IMotionEventOptions} options - Named options to keep args down to a manageable level.
         *
         *      millisBefore - Fixed wait period prior to start, once this event and also syncPartner (if any) is ready (default 0).
         *                     When negative, no delay if being repeated in an EventSeries.
         *
         *      absoluteMovement - Movement arg is an absolute value, not POV (default false).
         *      absoluteRotation - Rotation arg is an absolute value, not POV (default false).
         *      pace - Any Object with the function: getCompletionMilestone(currentDurationRatio) (default MotionEvent.LINEAR)
         *      sound - Sound to start with event.  WARNING: When event also has a sync partner, there could be issues.
         *
         *      noStepWiseMovement - Calc the full amount of movement from Node's original position / rotation,
         *                           rather than stepwise (default false).  No meaning when no rotation in event.
         *
         *      mirrorAxes - Shapekeys Only:
         *                   Axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if ratio is positive.
         *                   If null, shape key group setting used.
         *
         *      subposes - Skeletons Only:
         *                 Subposes which should be substituted during event (default null).
         *
         *      revertSubposes - Skeletons Only:
         *                       Should any subposes previously applied should be subtracted during event(default false)?
         */
        function BasisReturn(groupName, 
            // args from super
            milliDuration, movePOV, rotatePOV, options) {
            if (movePOV === void 0) { movePOV = null; }
            if (rotatePOV === void 0) { rotatePOV = null; }
            _super.call(this, groupName, "BASIS", 1, milliDuration, movePOV, rotatePOV, options);
        }
        return BasisReturn;
    }(Deformation));
    QI.BasisReturn = BasisReturn;
})(QI || (QI = {}));
/// <reference path="./VertexDeformation.ts"/>
/// <reference path="../../Mesh.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../queue/PovProcessor.ts"/>
/// <reference path="../../queue/MotionEvent.ts"/>
var QI;
(function (QI) {
    //    declare var SIMD;
    //    declare var Float32x4Array;
    var ShapeKeyGroup = (function (_super) {
        __extends(ShapeKeyGroup, _super);
        /**
         * @param {Mesh} _mesh - reference of QI.Mesh this ShapeKeyGroup is a part of
         * @param {String} _name - Name of the Key Group, upper case only
         * @param {Uint32Array} _affectedPositionElements - index of either an x, y, or z of positions.  Not all 3 of a vertex need be present.  Ascending order.
         */
        function ShapeKeyGroup(_mesh, _name, _affectedPositionElements) {
            _super.call(this, _mesh, true);
            this._affectedPositionElements = _affectedPositionElements;
            // arrays for the storage of each state
            this._states = new Array();
            this._normals = new Array();
            this._stateNames = new Array();
            // typed arrays are more expense to create, pre-allocate pairs for reuse
            this._reusablePositionFinals = new Array();
            this._reusableNormalFinals = new Array();
            this._lastReusablePosUsed = 0;
            this._lastReusableNormUsed = 0;
            // misc
            this._mirrorAxis = -1; // when in use x = 1, y = 2, z = 3
            this._name = _name; // override dummy
            if (!(this._affectedPositionElements instanceof Uint32Array))
                BABYLON.Tools.Error("ShapeKeyGroup: invalid affectedPositionElements arg");
            this._nPosElements = this._affectedPositionElements.length;
            // initialize 2 position reusables, the size needed
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));
            this._reusablePositionFinals.push(new Float32Array(this._nPosElements));
            // determine affectedVertices for updating cooresponding normals
            var affectedVert = new Array(); // final size unknown, so use a push-able array & convert to Uint16Array at end
            var vertIdx = -1;
            var nextVertIdx;
            // go through each position element
            for (var i = 0; i < this._nPosElements; i++) {
                // the vertex index is 1/3 the position element index
                nextVertIdx = Math.floor(this._affectedPositionElements[i] / 3);
                // since position element indexes in ascending order, check if vertex not already added by the x, or y elements
                if (vertIdx !== nextVertIdx) {
                    vertIdx = nextVertIdx;
                    affectedVert.push(vertIdx);
                }
            }
            this._affectedVertices = new Uint16Array(affectedVert);
            this._nVertices = this._affectedVertices.length;
            // initialize 2 normal reusables, the full size needed
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));
            this._reusableNormalFinals.push(new Float32Array(this._nVertices * 3));
            // fish out the basis state from the mesh vertex data
            var basisState = new Float32Array(this._nPosElements);
            var OriginalPositions = _mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (var i = 0; i < this._nPosElements; i++) {
                basisState[i] = OriginalPositions[this._affectedPositionElements[i]];
            }
            // push 'BASIS' to _states & _stateNames, then initialize _currFinalVals to 'BASIS' state
            this._addShapeKey(ShapeKeyGroup.BASIS, basisState);
            this._currFinalPositionVals = this._states[0];
            this._currFinalNormalVals = this._normals[0];
        }
        // =============================== Shape-Key adding & deriving ===============================
        ShapeKeyGroup.prototype._getDerivedName = function (referenceIdx, endStateIdxs, endStateRatios, mirrorAxes) {
            if (mirrorAxes === void 0) { mirrorAxes = null; }
            return referenceIdx + "-[" + endStateIdxs + "]@[" + endStateRatios + "]" + (mirrorAxes ? "-" + mirrorAxes : "");
        };
        /**
         * add a derived key from the data contained in a deformation; wrapper for addComboDerivedKey().
         * @param {ReferenceDeformation} deformation - mined for its reference & end state names, and end state ratio
         */
        ShapeKeyGroup.prototype.addDerivedKeyFromDeformation = function (deformation) {
            this.addComboDerivedKey(deformation.getReferenceStateName(), deformation.getEndStateNames(), deformation.getEndStateRatios());
        };
        /**
         * add a derived key using a single end state from the arguments;  wrapper for addComboDerivedKey().
         * @param {string} referenceStateName - Name of the reference state to be based on
         * @param {string} endStateName - Name of the end state to be based on
         * @param {number} endStateRatio - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxis - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         */
        ShapeKeyGroup.prototype.addDerivedKey = function (referenceStateName, endStateName, endStateRatio, mirrorAxis) {
            if (mirrorAxis === void 0) { mirrorAxis = null; }
            if (endStateRatio === 1) {
                BABYLON.Tools.Warn("ShapeKeyGroup: deriving a shape key where the endStateRatio is 1 is pointless, ignored");
                return;
            }
            this.addComboDerivedKey(referenceStateName, [endStateName], [endStateRatio], mirrorAxis);
        };
        /**
         * add a derived key from the arguments
         * @param {string} referenceStateName - Name of the reference state to be based on, probably 'Basis'
         * @param {Array} endStateNames - Names of the end states to be based on
         * @param {Array} endStateRatios - Unvalidated, but if -1 < or > 1, then can never be called, since Deformation validates
         * @param {string} mirrorAxes - axis [X,Y, or Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {String} newStateName - The name of the new state.  If not set, then it will be computed.
         */
        ShapeKeyGroup.prototype.addComboDerivedKey = function (referenceStateName, endStateNames, endStateRatios, mirrorAxes, newStateName) {
            if (mirrorAxes === void 0) { mirrorAxes = null; }
            // test if key already exists, then leave
            if (newStateName && this.hasKey(newStateName))
                return;
            var referenceIdx = this._getIdxForState(referenceStateName);
            if (referenceIdx === -1)
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
            var endStateIdxs = new Array();
            var endStateIdx;
            for (var i = 0; i < endStateNames.length; i++) {
                endStateIdx = this._getIdxForState(endStateNames[i]);
                if (endStateIdx === -1)
                    BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                endStateIdxs.push(endStateIdx);
            }
            var stateName = newStateName ? newStateName : this._getDerivedName(referenceIdx, endStateIdxs, endStateRatios, mirrorAxes);
            var stateKey = new Float32Array(this._nPosElements);
            this._buildPosEndPoint(stateKey, referenceIdx, endStateIdxs, endStateRatios, mirrorAxes, this._node.debug);
            this._addShapeKey(stateName, stateKey);
        };
        /** called in construction code from TOB.  Unlikely to be called by application code. */
        ShapeKeyGroup.prototype._addShapeKey = function (stateName, stateKey) {
            if (typeof stateName !== 'string' || stateName.length === 0)
                BABYLON.Tools.Error("ShapeKeyGroup: invalid stateName arg");
            if (this.hasKey(stateName)) {
                BABYLON.Tools.Warn("ShapeKeyGroup: stateName " + stateName + " is a duplicate, ignored");
                return;
            }
            this._states.push(stateKey);
            this._stateNames.push(stateName);
            var coorespondingNormals = new Float32Array(this._nVertices * 3);
            this._buildNormEndPoint(coorespondingNormals, stateKey);
            this._normals.push(coorespondingNormals);
            if (this._node.debug)
                BABYLON.Tools.Log("Shape key: " + stateName + " added to group: " + this._name + " on QI.Mesh: " + this._node.name);
        };
        /**
         * Remove the resources associated with a end state.
         * @param {string} endStateName - Name of the end state to be removed.
         */
        ShapeKeyGroup.prototype.deleteShapeKey = function (stateName) {
            var idx = this._getIdxForState(stateName);
            if (idx === -1)
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
            this._stateNames.splice(idx, 1);
            this._states.splice(idx, 1);
            this._normals.splice(idx, 1);
            if (this._node.debug)
                BABYLON.Tools.Log("Shape key: " + stateName + " deleted from group: " + this._name + " on QI.Mesh: " + this._node.name);
        };
        // =================================== inside before render ==================================
        /**
         * Called by the beforeRender() registered by this._mesh
         * ShapeKeyGroup is a subclass of POV.BeforeRenderer, so need to call its beforeRender method, _incrementallyMove()
         * @param {Float32Array} positions - Array of the positions for the entire mesh, portion updated based on _affectedPositionElements
         * @param {Float32Array} normals   - Array of the normals   for the entire mesh, portion updated based on _affectedVertices
         */
        ShapeKeyGroup.prototype._incrementallyDeform = function (positions, normals) {
            _super.prototype._incrementallyMove.call(this);
            // test of this._currentSeries is duplicated, since super.incrementallyMove() cannot return a value
            // is possible to have a MotionEvent(with no deformation), which is not a VertexDeformation sub-class
            if (this._currentSeries === null || !(this._currentStepInSeries instanceof QI.VertexDeformation))
                return false;
            if (this._ratioComplete < 0)
                return false; // MotionEvent.BLOCKED or MotionEvent.WAITING
            // update the positions
            this._updatePositions(positions);
            // update the normals
            this._updateNormals(normals);
            return true;
        };
        /** Only public, so can be swapped out with SIMD version */
        ShapeKeyGroup.prototype._updatePositions = function (positions) {
            for (var i = 0; i < this._nPosElements; i++) {
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
        };
        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMD(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4.splat(this._ratioComplete);
            for (var i = 0; i <= this._nPosElements-4; i += 4){
                var priorFinalPositionVals = SIMD.Float32x4.load(this._priorFinalPositionVals, i);
                var currFinalPositionVals  = SIMD.Float32x4.load(this._currFinalPositionVals, i);
                var positionx4             = SIMD.Float32x4.add(priorFinalPositionVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalPositionVals, priorFinalPositionVals), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i], positionx4);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMDToo(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i <= this._nPosElements-4; i += 4){
                var priorFinalPositionVals = SIMD.Float32x4(this._priorFinalPositionVals[i], this._priorFinalPositionVals[i + 1], this._priorFinalPositionVals[i + 2], this._priorFinalPositionVals[i + 3]);
                var currFinalPositionVals  = SIMD.Float32x4(this._currFinalPositionVals [i], this._currFinalPositionVals [i + 1], this._currFinalPositionVals [i + 2], this._currFinalPositionVals [i + 3]);
                var positionx4             = SIMD.Float32x4.add(priorFinalPositionVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalPositionVals, priorFinalPositionVals), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i], positionx4);
            }
        }

        /* Only public, so can be swapped out with SIMD version
        public _updatePositionsSIMD4(positions : Float32Array) : void {
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            var nX4Pos = Math.floor(this._nPosElements / 4);

            for (var i = 0; i < nX4Pos; i++){
                var positionx4 = SIMD.Float32x4.add(this._priorFinalPositionSIMD[i], SIMD.Float32x4.mul(SIMD.Float32x4.sub(this._currFinalPositionSIMD[i], this._priorFinalPositionSIMD[i]), ratioComplete));
                SIMD.Float32x4.store(positions, this._affectedPositionElements[i * 4], positionx4);
            }
            // do up to 3 leftovers
            var nLeftovers = this._nPosElements - nX4Pos * 4;
            for (var i = this._nPosElements - (nLeftovers + 1); i  < this._nPosElements; i++){
                positions[this._affectedPositionElements[i]] = this._priorFinalPositionVals[i] + ((this._currFinalPositionVals[i] - this._priorFinalPositionVals[i]) * this._ratioComplete);
            }
        }
*/
        /** Only public, so can be swapped out with SIMD version */
        ShapeKeyGroup.prototype._updateNormals = function (normals) {
            var mIdx, kIdx;
            for (var i = 0; i < this._nVertices; i++) {
                mIdx = 3 * this._affectedVertices[i]; // offset for this vertex in the entire mesh
                kIdx = 3 * i; // offset for this vertex in the shape key group
                normals[mIdx] = this._priorFinalNormalVals[kIdx] + ((this._currFinalNormalVals[kIdx] - this._priorFinalNormalVals[kIdx]) * this._ratioComplete);
                normals[mIdx + 1] = this._priorFinalNormalVals[kIdx + 1] + ((this._currFinalNormalVals[kIdx + 1] - this._priorFinalNormalVals[kIdx + 1]) * this._ratioComplete);
                normals[mIdx + 2] = this._priorFinalNormalVals[kIdx + 2] + ((this._currFinalNormalVals[kIdx + 2] - this._priorFinalNormalVals[kIdx + 2]) * this._ratioComplete);
            }
        };
        /* Only public, so can be swapped out with SIMD version
        public _updateNormalsSIMD(normals :Float32Array) : void {
            var mIdx : number, kIdx : number;
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                kIdx = 3 * i;                        // offset for this vertex in the shape key group
                var currFinalNormalVals  = SIMD.Float32x4.load3(this._currFinalNormalVals, kIdx);
                var priorFinalNormalVals = SIMD.Float32x4.load3(this._priorFinalNormalVals, kIdx);
                var normalx4             = SIMD.Float32x4.add(priorFinalNormalVals, SIMD.Float32x4.mul(SIMD.Float32x4.sub(currFinalNormalVals, priorFinalNormalVals), ratioComplete));
                SIMD.Float32x4.store3(normals, mIdx, normalx4);
            }
        }
        /* Only public, so can be swapped out with SIMD version
        public _updateNormalsSIMD4(normals :Float32Array) : void {
            var mIdx : number;
            var ratioComplete = SIMD.Float32x4(this._ratioComplete, this._ratioComplete, this._ratioComplete, this._ratioComplete);
            for (var i = 0; i < this._nVertices; i++){
                mIdx = 3 * this._affectedVertices[i] // offset for this vertex in the entire mesh
                var normalx4 = SIMD.Float32x4.add(this._priorFinalNormalSIMD[i], SIMD.Float32x4.mul(SIMD.Float32x4.sub(this._currFinalNormalSIMD[i], this._priorFinalNormalSIMD[i]), ratioComplete));
                SIMD.Float32x4.store3(normals, mIdx, normalx4);
            }
        }*/
        // ======================================== event prep =======================================
        /** @override */
        ShapeKeyGroup.prototype._nextEvent = function (event) {
            _super.prototype._nextEvent.call(this, event);
            // is possible to have a MotionEvent(with no deformation), not VertexDeformation sub-class
            if (!(event instanceof QI.VertexDeformation))
                return;
            this._priorFinalPositionVals = this._currFinalPositionVals;
            this._priorFinalNormalVals = this._currFinalNormalVals;
            var deformation = event;
            var referenceIdx = this._getIdxForState(deformation.getReferenceStateName());
            if (referenceIdx === -1)
                BABYLON.Tools.Error("ShapeKeyGroup: invalid reference state");
            var endStateNames = deformation.getEndStateNames();
            var endStateRatios = deformation.getEndStateRatios();
            this._stalling = endStateRatios === null;
            if (!this._stalling) {
                var endStateIdxs = new Array();
                var endStateIdx;
                var allZeros = true;
                for (var i = 0; i < endStateNames.length; i++) {
                    endStateIdx = this._getIdxForState(endStateNames[i]);
                    if (endStateIdx === -1)
                        BABYLON.Tools.Error("ShapeKeyGroup: invalid end state name: " + endStateNames[i].toUpperCase());
                    endStateIdxs.push(endStateIdx);
                    allZeros = allZeros && endStateRatios[i] === 0;
                }
                // when a single end state key, & endStateRatio is 1 or 0, just assign _currFinalVals directly from _states
                if (allZeros || (endStateRatios.length === 1 && (endStateRatios[0] === 1 || endStateRatios[0] === 0))) {
                    var idx = (allZeros || endStateRatios[0] === 0) ? referenceIdx : endStateIdxs[0]; // really just the reference when 0
                    this._currFinalPositionVals = this._states[idx];
                    this._currFinalNormalVals = this._normals[idx];
                }
                else {
                    // check there was not a pre-built derived key to assign
                    var derivedIdx = this._getIdxForState(this._getDerivedName(referenceIdx, endStateIdxs, endStateRatios, deformation.options.mirrorAxes));
                    if (derivedIdx !== -1) {
                        this._currFinalPositionVals = this._states[derivedIdx];
                        this._currFinalNormalVals = this._normals[derivedIdx];
                    }
                    else {
                        // need to build _currFinalVals, toggling the _lastReusablePosUsed
                        this._lastReusablePosUsed = (this._lastReusablePosUsed === 1) ? 0 : 1;
                        this._buildPosEndPoint(this._reusablePositionFinals[this._lastReusablePosUsed], referenceIdx, endStateIdxs, endStateRatios, deformation.options.mirrorAxes, this._node.debug);
                        this._currFinalPositionVals = this._reusablePositionFinals[this._lastReusablePosUsed];
                        // need to build _currFinalNormalVals, toggling the _lastReusableNormUsed
                        this._lastReusableNormUsed = (this._lastReusableNormUsed === 1) ? 0 : 1;
                        this._buildNormEndPoint(this._reusableNormalFinals[this._lastReusableNormUsed], this._currFinalPositionVals);
                        this._currFinalNormalVals = this._reusableNormalFinals[this._lastReusableNormUsed];
                    }
                }
            }
        };
        /*        private _prepForSIMD(){
                    var nX4Pos = Math.floor(this._nPosElements / 4);
                    var priorCopied = typeof (this._currFinalPositionSIMD) !== "undefined";
        
                    this._priorFinalPositionSIMD = priorCopied ? this._currFinalPositionSIMD : [];
                    this._currFinalPositionSIMD  = [];
        
                    for (var i = 0, x4 = 0; i < nX4Pos;  i++, x4 += 4){
                        if (!priorCopied){
                            this._priorFinalPositionSIMD[i] = SIMD.Float32x4(this._priorFinalPositionVals[x4], this._priorFinalPositionVals[x4 + 1], this._priorFinalPositionVals[x4 + 2], this._priorFinalPositionVals[x4 + 3]);
                        }
                            this._currFinalPositionSIMD [i] = SIMD.Float32x4(this._currFinalPositionVals [x4], this._currFinalPositionVals [x4 + 1], this._currFinalPositionVals [x4 + 2], this._currFinalPositionVals [x4 + 3]);
                    }
        
                    priorCopied = typeof (this._currFinalNormalSIMD) !== "undefined";
                    this._priorFinalNormalSIMD = priorCopied ? this._currFinalNormalSIMD : [];
                    this._currFinalNormalSIMD  = [];
        
                    var kIdx : number;
                    for (var i = 0; i < this._nVertices; i++){
                        kIdx = 3 * i;                        // offset for this vertex in the shape key group
        
                        if (!priorCopied){
                            this._priorFinalNormalSIMD[i] = SIMD.Float32x4.load3(this._priorFinalNormalVals, kIdx);
                        }
                            this._currFinalNormalSIMD [i] = SIMD.Float32x4.load3(this._currFinalNormalVals , kIdx);
                    }
                }*/
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the positions for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusablePositionFinals for _nextDeformation().  Bound for: _states[], if addShapeKeyInternal().
         * @param {number} referenceIdx - the index into _states[] to use as a reference
         * @param {Array<number>} endStateIdxs - the indexes into _states[] to use as a target
         * @param {Array<number>} endStateRatios - the ratios of the target state to achive, relative to the reference state
         * @param {string} mirrorAxes - axis [X,Y,Z] to mirror against for an end state ratio, which is negative.  No meaning if positive.  If null, shape key group setting used.
         * @param {boolean} log - write console message of action, when true (Default false)
         *
         */
        ShapeKeyGroup.prototype._buildPosEndPoint = function (targetArray, referenceIdx, endStateIdxs, endStateRatios, mirrorAxes, log) {
            if (mirrorAxes === void 0) { mirrorAxes = null; }
            if (log === void 0) { log = false; }
            var refEndState = this._states[referenceIdx];
            var nEndStates = endStateIdxs.length;
            // compute each of the new final values of positions
            var deltaToRefState;
            var stepDelta;
            var j;
            var mirroring;
            if (mirrorAxes || ShapeKeyGroup._isMirroring(endStateRatios)) {
                mirroring = new Array(endStateRatios.length);
                if (mirrorAxes)
                    mirrorAxes = mirrorAxes.toUpperCase();
                for (j = 0; j < endStateRatios.length; j++) {
                    if (mirrorAxes) {
                        switch (mirrorAxes.charAt(j)) {
                            case "X":
                                mirroring[j] = 1;
                                break;
                            case "Y":
                                mirroring[j] = 2;
                                break;
                            case "Z":
                                mirroring[j] = 3;
                                break;
                        }
                    }
                    else
                        mirroring[j] = this._mirrorAxis;
                }
            }
            for (var i = 0; i < this._nPosElements; i++) {
                deltaToRefState = 0;
                for (j = 0; j < nEndStates; j++) {
                    stepDelta = (this._states[endStateIdxs[j]][i] - refEndState[i]) * endStateRatios[j];
                    // reverse sign on appropriate elements of referenceDelta when ratio neg & mirroring
                    if (endStateRatios[j] < 0 && mirroring[j] !== (i + 1) % 3) {
                        stepDelta *= -1;
                    }
                    deltaToRefState += stepDelta;
                }
                targetArray[i] = refEndState[i] + deltaToRefState;
            }
            if (log)
                BABYLON.Tools.Log(this._name + " end Point built for referenceIdx: " + referenceIdx + ",  endStateIdxs: " + endStateIdxs + ", endStateRatios: " + endStateRatios);
        };
        /**
         * Called by addShapeKeyInternal() & _nextDeformation() to build the normals for an end point
         * @param {Float32Array} targetArray - location of output. One of the _reusableNormalFinals for _nextDeformation().  Bound for: _normals[], if addShapeKeyInternal().
         * @param {Float32Array} endStatePos - postion data to build the normals for.  Output from buildPosEndPoint, or data passed in from addShapeKey()
         */
        ShapeKeyGroup.prototype._buildNormEndPoint = function (targetArray, endStatePos) {
            var mesh = this._node;
            mesh._futurePositions.set(mesh._originalPositions);
            // populate the changes that this state has
            for (var i = 0; i < this._nPosElements; i++) {
                mesh._futurePositions[this._affectedPositionElements[i]] = endStatePos[i];
            }
            BABYLON.VertexData.ComputeNormals(mesh._futurePositions, mesh.getIndices(), mesh._futureNormals);
            var mIdx, kIdx;
            // populate the changes that this state has
            for (var i = 0; i < this._nVertices; i++) {
                mIdx = 3 * this._affectedVertices[i]; // offset for this vertex in the entire mesh
                kIdx = 3 * i; // offset for this vertex in the shape key group
                targetArray[kIdx] = mesh._futureNormals[mIdx];
                targetArray[kIdx + 1] = mesh._futureNormals[mIdx + 1];
                targetArray[kIdx + 2] = mesh._futureNormals[mIdx + 2];
            }
        };
        ShapeKeyGroup._isMirroring = function (endStateRatios) {
            for (var i = 0, len = endStateRatios.length; i < len; i++)
                if (endStateRatios[i] < 0)
                    return true;
            return false;
        };
        // ==================================== Getters & setters ====================================
        /**
         * Determine if a key already exists.
         * @param {string} stateName - name of key to check
         */
        ShapeKeyGroup.prototype.hasKey = function (stateName) {
            return this._getIdxForState(stateName) !== -1;
        };
        ShapeKeyGroup.prototype._getIdxForState = function (stateName) {
            stateName = stateName.toUpperCase();
            for (var i = 0, len = this._stateNames.length; i < len; i++) {
                if (this._stateNames[i] === stateName) {
                    return i;
                }
            }
            return -1;
        };
        ShapeKeyGroup.prototype.getName = function () { return this._name; };
        ShapeKeyGroup.prototype.getNPosElements = function () { return this._nPosElements; };
        ShapeKeyGroup.prototype.getNStates = function () { return this._stateNames.length; };
        ShapeKeyGroup.prototype.getStates = function () { return this._stateNames.slice(0); }; // do not allow actual access to names, copy
        ShapeKeyGroup.prototype.toString = function () { return 'ShapeKeyGroup: ' + this._name + ', n position elements: ' + this._nPosElements + ',\nStates: ' + this._stateNames; };
        ShapeKeyGroup.prototype.mirrorAxisOnX = function () { this._mirrorAxis = 1; };
        ShapeKeyGroup.prototype.mirrorAxisOnY = function () { this._mirrorAxis = 2; };
        ShapeKeyGroup.prototype.mirrorAxisOnZ = function () { this._mirrorAxis = 3; };
        ShapeKeyGroup.BASIS = "BASIS";
        return ShapeKeyGroup;
    }(QI.PovProcessor));
    QI.ShapeKeyGroup = ShapeKeyGroup;
})(QI || (QI = {}));
/// <reference path="./deformation/shapeKeyBased/VertexDeformation.ts"/>
/// <reference path="./deformation/shapeKeyBased/ShapeKeyGroup.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./deformation/skeletonBased/Pose.ts"/>
/// <reference path="./deformation/skeletonBased/PoseProcessor.ts"/>
/// <reference path="./deformation/skeletonBased/Skeleton.ts"/>
/// <reference path="./queue/MotionEvent.ts"/>
/// <reference path="./queue/EventSeries.ts"/>
/// <reference path="./queue/PovProcessor.ts"/>
/// <reference path="./queue/TimelineControl.ts"/>
var QI;
(function (QI) {
    /**
     * Mesh sub-class which has a before render which processes events for ShapeKeysGroups, Skeleton Poses, and POV.
     */
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        /**
         * @constructor - Args same As BABYLON.Mesh, except that using a source for cloning requires there be no shape keys
         * @param {string} name - The value used by scene.getMeshByName() to do a lookup.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The parent of this mesh, if it has one
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        function Mesh(name, scene, parent, source, doNotCloneChildren) {
            if (parent === void 0) { parent = null; }
            _super.call(this, name, scene, parent, source, doNotCloneChildren);
            this.debug = false;
            this._shapeKeyGroups = new Array();
            // tracking system members
            this._clockStart = -1;
            this._renderCPU = 0;
            this._totalDeformations = 0;
            this._totalFrames = 0;
            // for Firefox
            this._lastFrameID = -1;
            // ============================ Mesh-instance wide play - pause ==============================
            this._instancePaused = true; // do not allow anything to run till visible; managed by grand entrance
            if (source && source._shapeKeyGroups.length > 0)
                throw "QI.Mesh: meshes with shapekeys cannot be cloned";
            this._povProcessor = new QI.PovProcessor(this, false); // do not actually register as a beforeRender, use this classes & register below
            // tricky registering a prototype as a callback in constructor; cannot say 'this.beforeRender()' & must be wrappered
            var ref = this;
            this._registeredFN = function () { ref.beforeRender(); };
            // using scene level before render, so always runs & only once per frame, incase there are multiple cameras
            scene.registerBeforeRender(this._registeredFN);
        }
        // ============================ beforeRender callback & tracking =============================
        Mesh.prototype.beforeRender = function () {
            if (this._positions32F === null || this._normals32F === null || QI.TimelineControl.isSystemPaused || this._instancePaused)
                return;
            var startTime = BABYLON.Tools.Now;
            // Firefox can call for a render occasionally when user is on a different tab; ignore
            if (this._lastFrameID === QI.TimelineControl.FrameID)
                return;
            this._lastFrameID = QI.TimelineControl.FrameID;
            this._shapeKeyChangesMade = false;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                // do NOT combine these 2 lines or only 1 group will run!
                var changed = this._shapeKeyGroups[g]._incrementallyDeform(this._positions32F, this._normals32F);
                this._shapeKeyChangesMade = this._shapeKeyChangesMade || changed;
            }
            this._skeletonChangesMade = false;
            if (this._poseProcessor) {
                this._skeletonChangesMade = this._poseProcessor.incrementallyDeform();
            }
            // perform any POV events on the mesh not assigned a shapekey group or the pose processor
            this._povProcessor._incrementallyMove();
            if (this._shapeKeyChangesMade || this._skeletonChangesMade) {
                if (this._shapeKeyChangesMade) {
                    if (this.computeBonesUsingShaders || !this._skeletonChangesMade) {
                        // resend positions & normals
                        _super.prototype.updateVerticesData.call(this, BABYLON.VertexBuffer.PositionKind, this._positions32F);
                        _super.prototype.updateVerticesData.call(this, BABYLON.VertexBuffer.NormalKind, this._normals32F);
                    }
                }
                if (this._clockStart < 0)
                    this._resetTracking(startTime); // delay tracking until the first change is made
                this._renderCPU += BABYLON.Tools.Now - startTime;
                this._totalDeformations++;
            }
            this._totalFrames++;
        };
        Mesh.prototype.resetTracking = function () {
            this._resetTracking(BABYLON.Tools.Now);
        };
        Mesh.prototype._resetTracking = function (startTime) {
            this._clockStart = startTime;
            this._renderCPU = 0;
            this._totalDeformations = 0;
            this._totalFrames = 0;
        };
        Mesh.prototype.getTrackingReport = function (reset) {
            if (reset === void 0) { reset = false; }
            var totalWallClock = BABYLON.Tools.Now - this._clockStart;
            var report = "\nNum Deformations: " + this._totalDeformations +
                "\nRender CPU milli: " + this._renderCPU.toFixed(2) +
                "\nRender CPU milli / Deformations: " + (this._renderCPU / this._totalDeformations).toFixed(2) +
                "\nWallclock milli / Deformations: " + (totalWallClock / this._totalDeformations).toFixed(2) +
                "\nMemo, Deformations / Sec: " + (this._totalDeformations / (totalWallClock / 1000)).toFixed(2) +
                "\nMemo, Frames with no deformation: " + (this._totalFrames - this._totalDeformations) +
                "\nMemo, Total vertices: " + this.getTotalVertices() +
                "\nShape keys:";
            for (var i = 0; i < this._shapeKeyGroups.length; i++)
                report += "\n" + this._shapeKeyGroups[i].toString();
            if (reset)
                this.resetTracking();
            return report;
        };
        // ======================================== Overrides ========================================
        /** @override */
        Mesh.prototype.createInstance = function (name) {
            if (this._shapeKeyGroups.length > 0) {
                BABYLON.Tools.Error("QI.Mesh:  Shared vertex instances not possible with shape keys");
                return null;
            }
            else
                return _super.prototype.createInstance.call(this, name);
        };
        /** @override */
        Mesh.prototype.convertToFlatShadedMesh = function () {
            if (this._shapeKeyGroups.length > 0) {
                BABYLON.Tools.Error("QI.Mesh:  Flat shading must be done on export with shape keys");
                return null;
            }
            else
                _super.prototype.convertToFlatShadedMesh.call(this);
        };
        /** @override
         * wrappered is so positions & normals vertex buffer & initial data can be captured
         */
        Mesh.prototype.setVerticesData = function (kind, data, updatable) {
            _super.prototype.setVerticesData.call(this, kind, data, updatable || kind === BABYLON.VertexBuffer.PositionKind || kind === BABYLON.VertexBuffer.NormalKind);
            if (kind === BABYLON.VertexBuffer.PositionKind) {
                this._positions32F = this.setPositionsForCPUSkinning(); // get positions from here, so can morph & CPU skin at the same time
                // need to make a by value copy of the orignal position data, to build futurePos in call to normalsforVerticesInPlace()
                this._originalPositions = new Float32Array(data.length);
                for (var i = 0, len = data.length; i < len; i++) {
                    this._originalPositions[i] = data[i];
                }
                this._futurePositions = new Float32Array(data.length);
                this._futureNormals = new Float32Array(data.length);
            }
            else if (kind === BABYLON.VertexBuffer.NormalKind) {
                this._normals32F = this.setNormalsForCPUSkinning(); // get normals from here, so can morph & CPU skin at the same time
            }
            else if (kind === BABYLON.VertexBuffer.MatricesWeightsKind) {
                // exporter assigns skeleton before setting any vertex data, so should be ok
                if (!this._poseProcessor)
                    this._poseProcessor = new QI.PoseProcessor(this.skeleton, this, true);
            }
        };
        /** @override */
        Mesh.prototype.dispose = function (doNotRecurse) {
            _super.prototype.dispose.call(this, doNotRecurse);
            this.getScene().unregisterBeforeRender(this._registeredFN);
        };
        // =================================== EventSeries related ===================================
        /**
         * Primarily called by Blender generated code.
         * @param {QI.ShapeKeyGroup} shapeKeyGroup - prebuilt group to add
         */
        Mesh.prototype.addShapeKeyGroup = function (shapeKeyGroup) {
            this._shapeKeyGroups.push(shapeKeyGroup);
        };
        /**
         * Cause the group to go out of scope.  All resources on heap, so GC should remove.
         * @param {string} groupName - The name of the group to look up.
         */
        Mesh.prototype.removeShapeKeyGroup = function (groupName) {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    this._shapeKeyGroups = this._shapeKeyGroups.splice(g, 1);
                    return;
                }
            }
            BABYLON.Tools.Warn("QI.Mesh:  no shape key group with name: " + groupName);
        };
        /**
         * Clear out any events, on all the queues the Mesh has.
         * @param {boolean} stopCurrentSeries - When true, stop the current MotionSeries too.
         */
        Mesh.prototype.clearAllQueues = function (stopCurrentSeries) {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].clearQueue(stopCurrentSeries);
            }
            if (this._poseProcessor) {
                this._poseProcessor.clearQueue(stopCurrentSeries);
            }
            if (this._povProcessor) {
                this._povProcessor.clearQueue(stopCurrentSeries);
            }
        };
        /**
         * Go thru an array of Events prior to creating an event series.  Add a stall for any queue(s) that
         * does not have an event.  Useful for syncing the entire meshe's groups even though a queue may not
         * have an event.
         *
         * An example is when inserting a Grand Entrance.  The entrance may only use a shape key group.  The
         * coder may wish to add on / directly swing into action afterward using a pose.  If there was not a
         * stall added to the pose processor, pose event would begin before entrance was complete.
         *
         * @param {Array<any>} events - Events argument or EventSeries, prior to instancing.
         * @param {number} stallMillis - Amount of time to stall a queue.  Do not take into account any EventSeries
         * repeats, if any.
         * @param {string} groupForFuncActions - Should match the EventSeries constructor arg.  Defaults are the same.
         * @returns {Array<any>} - Same array as passed, with stalls added.
         */
        Mesh.prototype.appendStallForMissingQueues = function (events, stallMillis, groupForFuncActions) {
            if (groupForFuncActions === void 0) { groupForFuncActions = QI.PovProcessor.POV_GROUP_NAME; }
            // flags of things to check for
            var povFound = false;
            var skeletonFound = !this._poseProcessor; // say found when no pose processor
            var nSkGrps = this._shapeKeyGroups.length;
            var shapeGrpFound = new Array(nSkGrps);
            var funcActionsFound = false;
            // populate all the flags of things found
            for (var i = 0, len = events.length; i < len; i++) {
                if (events[i] instanceof QI.VertexDeformation) {
                    var grpName = events[i]._groupName;
                    for (var s = 0; s < nSkGrps; s++) {
                        if (this._shapeKeyGroups[s]._name === grpName) {
                            shapeGrpFound[s] = true;
                            break;
                        }
                    }
                }
                else if (events[i] instanceof QI.PoseEvent) {
                    skeletonFound = true;
                }
                else if (!(events[i] instanceof QI.MotionEvent)) {
                    // functions / actions / & nonMotionEvents
                    funcActionsFound = true;
                }
                else
                    povFound = true;
            }
            // flag queue for functions / actions / nonMotionEvents, when present
            if (funcActionsFound) {
                if (groupForFuncActions === QI.PovProcessor.POV_GROUP_NAME) {
                    povFound = true;
                }
                else if (groupForFuncActions === QI.PoseProcessor.INTERPOLATOR_GROUP_NAME) {
                    skeletonFound = true;
                }
                else {
                    for (var s = 0; s < nSkGrps; s++) {
                        if (groupForFuncActions === this._shapeKeyGroups[s]._name) {
                            shapeGrpFound[s] = true;
                            break;
                        }
                    }
                }
            }
            // add stalls for missing queues
            if (!povFound) {
                events.push(new QI.Stall(stallMillis, QI.PovProcessor.POV_GROUP_NAME));
            }
            if (!skeletonFound) {
                events.push(new QI.Stall(stallMillis, QI.PoseProcessor.INTERPOLATOR_GROUP_NAME));
            }
            for (var s = 0; s < nSkGrps; s++) {
                if (!shapeGrpFound[s]) {
                    events.push(new QI.Stall(stallMillis, this._shapeKeyGroups[s]._name));
                }
            }
            return events;
        };
        /**
         * wrapper a single MotionEvent into an EventSeries, defualting on all EventSeries optional args
         * @param {MotionEvent} event - Event to wrapper.
         */
        Mesh.prototype.queueSingleEvent = function (event) {
            this.queueEventSeries(new QI.EventSeries([event]));
        };
        /**
         * SeriesTargetable implementation method
         * @param {EventSeries} eSeries - The series to append to the end of series queue
         * @param {boolean} clearQueue - When true, stop anything queued from running.  Note this will also stop
         * any current MotionEvent.
         * @param {boolean} stopCurrentSeries - When true, stop any current MotionEvent too.
         * @param {boolean} insertSeriesInFront - Make sure series is next to run.  Primarily used by grand entrances.
         * clearQueue & stopCurrentSeries args are ignored when this is true.
         */
        Mesh.prototype.queueEventSeries = function (eSeries, clearQueue, stopCurrentSeries, insertSeriesInFront) {
            var groups;
            if (this.debug)
                groups = [];
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (eSeries.isGroupParticipating(this._shapeKeyGroups[g].getName())) {
                    if (insertSeriesInFront) {
                        this._shapeKeyGroups[g].insertSeriesInFront(eSeries);
                    }
                    else {
                        this._shapeKeyGroups[g].queueEventSeries(eSeries, clearQueue, stopCurrentSeries);
                    }
                    if (groups)
                        groups.push(this._shapeKeyGroups[g].getName());
                }
            }
            if (eSeries.isGroupParticipating(QI.PoseProcessor.INTERPOLATOR_GROUP_NAME)) {
                if (insertSeriesInFront) {
                    this._poseProcessor.insertSeriesInFront(eSeries);
                }
                else {
                    this._poseProcessor.queueEventSeries(eSeries);
                }
                if (groups)
                    groups.push(QI.PoseProcessor.INTERPOLATOR_GROUP_NAME);
            }
            if (eSeries.isGroupParticipating(QI.PovProcessor.POV_GROUP_NAME)) {
                if (insertSeriesInFront) {
                    this._povProcessor.insertSeriesInFront(eSeries);
                }
                else {
                    this._povProcessor.queueEventSeries(eSeries);
                }
                if (groups)
                    groups.push(QI.PovProcessor.POV_GROUP_NAME);
            }
            // diagnostic logging
            if (groups) {
                if (groups.length === 0)
                    BABYLON.Tools.Warn("QI.Mesh:  no shape keys groups or skeleton participating in event series");
                else {
                    var msg = "QI.Mesh:  series queued to " + groups.length + " group(s): [ ";
                    for (var i = 0; i < groups.length; i++) {
                        msg += groups[i] + " ";
                    }
                    BABYLON.Tools.Log(msg + "]");
                }
            }
        };
        // ==================================== Shapekey Wrappers ====================================
        Mesh.prototype.hasShapeKeyGroup = function (groupName) {
            return this.getShapeKeyGroup(groupName) !== null;
        };
        Mesh.prototype.getShapeKeyGroup = function (groupName) {
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                if (this._shapeKeyGroups[g].getName() === groupName) {
                    return this._shapeKeyGroups[g];
                }
            }
            return null;
        };
        Mesh.prototype.getLastPoseNameQueuedOrRun = function () {
            return this._poseProcessor ? this._poseProcessor.getLastPoseNameQueuedOrRun() : null;
        };
        // ==================================== Skeleton Wrappers ====================================
        Mesh.prototype.assignPoseLibrary = function (libraryName) {
            if (this.skeleton) {
                this.skeleton.assignPoseLibrary(libraryName);
            }
        };
        Mesh.prototype.assignPoseImmediately = function (poseName) {
            if (this.skeleton) {
                this.skeleton._assignPoseImmediately(poseName);
                this._poseProcessor._lastPoseRun = poseName;
            }
        };
        Mesh.prototype.addSubPose = function (poseName, immediately) {
            if (this.skeleton) {
                this.skeleton.addSubPose(poseName);
                if (immediately) {
                    this.queueSingleEvent(new QI.PoseEvent(poseName, 1)); // 1 milli is close enough to immediate
                }
            }
        };
        Mesh.prototype.removeSubPose = function (poseName) {
            if (this.skeleton) {
                this.skeleton.removeSubPose(poseName);
            }
        };
        Mesh.prototype.clearAllSubPoses = function () {
            if (this.skeleton) {
                this.skeleton.clearAllSubPoses();
            }
        };
        // =================================== BJS side ShapeGroup ===================================
        /** Entry point called by TOB generated code, when everything is ready.
         *  To load in advance without showing export disabled.  Call this when ready.
         *  Can also be called after the first time, if makeVisible(false) was called.
         */
        Mesh.prototype.grandEntrance = function () {
            if (this.isEnabled() && !this.isVisible) {
                if (this.entranceMethod)
                    this.entranceMethod.makeEntrance();
                else
                    this.makeVisible(true);
            }
        };
        /**
         * make computed shape key group when missing.  Used mostly by GrandEntrances.
         * @returns {ShapeKeyGroup} used for Javascript made end states.
         */
        Mesh.prototype.makeComputedGroup = function () {
            var computedGroup = this.getShapeKeyGroup(Mesh.COMPUTED_GROUP_NAME);
            if (!computedGroup) {
                var nElements = this._originalPositions.length;
                var affectedPositionElements = new Uint32Array(nElements);
                for (var i = 0; i < nElements; i++) {
                    affectedPositionElements[i] = i;
                }
                computedGroup = new QI.ShapeKeyGroup(this, Mesh.COMPUTED_GROUP_NAME, affectedPositionElements);
                this.addShapeKeyGroup(computedGroup);
            }
            return computedGroup;
        };
        /**
         * make the whole heirarchy visible or not.  The queues are either paused or resumed as well.
         * @param {boolean} visible - To be or not to be
         */
        Mesh.prototype.makeVisible = function (visible) {
            this.isVisible = visible;
            if (visible)
                this.resumeInstancePlay();
            else
                this.pausePlay();
            var children = this.getChildMeshes();
            for (var i = 0, len = children.length; i < len; i++) {
                if (children[i] instanceof Mesh) {
                    children[i].makeVisible(visible);
                }
                else {
                    children[i].isVisible = visible;
                }
            }
        };
        /**
         * returns {boolean} True, when this specific instance is paused
         */
        Mesh.prototype.isPaused = function () { return this._instancePaused; };
        /**
         * Called to pause this specific instance from performing additional animation.
         * This is independent of a system pause.
         */
        Mesh.prototype.pausePlay = function () {
            this._instancePaused = true;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].pauseInstance();
            }
            if (this._poseProcessor) {
                this._poseProcessor.pauseInstance();
            }
            if (this._povProcessor) {
                this._povProcessor.pauseInstance();
            }
        };
        /**
         * Called to resume animating this specific instance.
         * A system in pause will still prevent animation from resuming.
         */
        Mesh.prototype.resumeInstancePlay = function () {
            this._instancePaused = false;
            for (var g = 0, len = this._shapeKeyGroups.length; g < len; g++) {
                this._shapeKeyGroups[g].resumeInstancePlay();
            }
            if (this._poseProcessor) {
                this._poseProcessor.resumeInstancePlay();
            }
            if (this._povProcessor) {
                this._povProcessor.resumeInstancePlay();
            }
        };
        // for grand entrances
        Mesh.COMPUTED_GROUP_NAME = "COMPUTED-GROUP"; // having a '-' is strategic, since that is the separator for blender shapekeys (GROUP-KEYNAME)
        return Mesh;
    }(BABYLON.Mesh));
    QI.Mesh = Mesh;
})(QI || (QI = {}));
var QI;
(function (QI) {
    /** has its origins from:  http://bytearray.org/wp-content/projects/WebAudioRecorder/ */
    var AudioRecorder = (function () {
        function AudioRecorder() {
            this.initialized = false; // set in prepMic; will remain false if WebAudio or navigator.getUserMedia not supported
            this.playbackReady = false;
            this.recording = false;
            // arrays of FloatArrays made during recording
            this._leftchannel = new Array();
            this._rightchannel = new Array();
            this._recorder = null;
            this._recordingLength = 0;
            this._volume = null;
            this._audioInput = null;
        }
        /**
         * static function to return a AudioRecorder instance, if supported.  Single instance class.
         * @param {() => void} doneCallback - callback to return when sucessfully complete (optional)
         */
        AudioRecorder.getInstance = function (doneCallback) {
            if (AudioRecorder._instance)
                return AudioRecorder._instance;
            AudioRecorder._instance = new AudioRecorder();
            AudioRecorder._instance._completionCallback = doneCallback ? doneCallback : null;
            if (!BABYLON.Engine.audioEngine.canUseWebAudio) {
                window.alert('QI.AudioRecorder: WebAudio not supported');
                return AudioRecorder._instance;
            }
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) {
                var getUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ?
                    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
                    function (constraints) {
                        return new Promise(function (resolve, reject) {
                            navigator.getUserMedia(constraints, resolve, reject);
                        });
                    };
                getUserMedia({ audio: true })
                    .then(function (streamReceived) { AudioRecorder.prepMic(streamReceived); })
                    .catch(function (reportError) { window.alert('QI.AudioRecorder: Error initializing audio capture:\n\t' + reportError + '\nNote: Firefox errors when mic not plugged in.'); });
            }
            else {
                window.alert('QI.AudioRecorder: Navigator.getUserMedia not supported.');
            }
            return AudioRecorder._instance;
        };
        /**
         * static because it is in a callback for navigator.getUserMedia()
         */
        AudioRecorder.prepMic = function (stream) {
            var instance = AudioRecorder._instance;
            var context = BABYLON.Engine.audioEngine.audioContext;
            // assign a gain node
            instance._volume = context.createGain(); //instance.audioEngine.masterGain;
            // creates an audio node from the microphone incoming stream
            instance._audioInput = context.createMediaStreamSource(stream);
            // connect the stream to the gain node
            instance._audioInput.connect(instance._volume);
            /* From the spec: This value controls how frequently the audioprocess event is
            dispatched and how many sample-frames need to be processed each call.
            Lower values for buffer size will result in a lower (better) latency.
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 4096;
            instance._recorder = context.createScriptProcessor(bufferSize, 2, 2);
            // cannot reference using 'this' inside of callback
            instance._recorder.onaudioprocess = function (e) {
                if (!instance.recording)
                    return;
                var evt = e;
                var left = evt.inputBuffer.getChannelData(0);
                var right = evt.inputBuffer.getChannelData(1);
                // we clone the samples
                instance._leftchannel.push(new Float32Array(left));
                instance._rightchannel.push(new Float32Array(right));
                instance._recordingLength += bufferSize;
                // determine if the duration required has yet occurred
                if (instance._requestedDuration !== Number.MAX_VALUE && BABYLON.Tools.Now - instance._requestedDuration >= instance._startTime)
                    instance.recordStop();
            };
            // we connect the recorder
            instance._volume.connect(instance._recorder);
            instance._recorder.connect(context.destination);
            instance.initialized = true;
            // let webpage enable controls accordingly
            if (instance._completionCallback) {
                instance._completionCallback();
                instance._completionCallback = null;
            }
        };
        // ==================================== Recording Methods ====================================
        /**
         * Begin recording from the microphone
         * @param {number} durationMS- Length to record in millis (default Number.MAX_VALUE).
         * @param {() => void} doneCallback - Function to call when recording has completed (optional).
         */
        AudioRecorder.prototype.recordStart = function (durationMS, doneCallback) {
            if (durationMS === void 0) { durationMS = Number.MAX_VALUE; }
            if (this.recording) {
                BABYLON.Tools.Warn('QI.AudioRecorder: already recording');
                return;
            }
            this.recording = true;
            this._requestedDuration = durationMS;
            this._startTime = BABYLON.Tools.Now;
            this._completionCallback = doneCallback ? doneCallback : null;
            this.clean();
        };
        /**
         * Stop mic recording.  Called the onaudioprocess() when time expires.  Called actively when a
         * duration was not specified with recordStart().
         */
        AudioRecorder.prototype.recordStop = function () {
            if (!this.recording) {
                BABYLON.Tools.Warn('QI.AudioRecorder: recordStop when not recording');
                return;
            }
            this.recording = false;
            // we flatten the left and right channels down
            this._leftBuffer = this._mergeBuffers(this._leftchannel);
            this._rightBuffer = this._mergeBuffers(this._rightchannel);
            this.playbackReady = true;
            this.clean(false);
            if (this._completionCallback)
                this._completionCallback();
        };
        /**
         * recording uses multiple buffers, each pushed onto an array.  This is called for each channel,
         * at the end of the recording, to combine them all into 1.
         * @param {Float32Array[]} channelBuffers- The recording buffers of either left or right channel.
         * @returns {Float32Array} combined data.
         */
        AudioRecorder.prototype._mergeBuffers = function (channelBuffers) {
            var result = new Float32Array(this._recordingLength);
            var offset = 0;
            var lng = channelBuffers.length;
            for (var i = 0; i < lng; i++) {
                var buffer = channelBuffers[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        };
        /**
         * Delete buffers
         * @param {boolean} fullReset- Make no-longer playback ready (default true).
         */
        AudioRecorder.prototype.clean = function (fullReset) {
            if (fullReset === void 0) { fullReset = true; }
            // reset all the during recording buffers at the end of a recording.
            this._leftchannel.length = this._rightchannel.length = 0;
            this._recordingLength = 0;
            if (fullReset) {
                // delete previous merged buffers, if they exist
                this._leftBuffer = this._rightBuffer = null;
                this.playbackReady = false;
            }
        };
        // ==================================== Playback Methods =====================================
        /**
         * play recorded sound from internal buffers
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.prototype.playback = function (begin, end) {
            if (begin === void 0) { begin = 0; }
            var newBuffer = this.getAudioBuffer(begin, end);
            if (!newBuffer)
                return;
            var context = BABYLON.Engine.audioEngine.audioContext;
            var newSource = context.createBufferSource();
            newSource.buffer = newBuffer;
            newSource.connect(context.destination);
            newSource.start(0);
        };
        /**
         * play sound from an external buffer
         * @param {AudioBuffer} audio - The external bufer
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.playbackExternal = function (audio, begin, end) {
            if (begin === void 0) { begin = 0; }
            if (begin > 0 || end) {
                if (!end)
                    end = audio.getChannelData(0).length;
                var stereo = audio.numberOfChannels > 1;
                var leftBuffer = audio.getChannelData(0).slice(begin, end);
                var rightBuffer = stereo ? audio.getChannelData(1).slice(begin, end) : null;
                var context = BABYLON.Engine.audioEngine.audioContext;
                audio = context.createBuffer(stereo ? 2 : 1, leftBuffer.length, context.sampleRate);
                audio.getChannelData(0).set(leftBuffer);
                if (stereo)
                    audio.getChannelData(1).set(rightBuffer);
            }
            var context = BABYLON.Engine.audioEngine.audioContext;
            var newSource = context.createBufferSource();
            newSource.buffer = audio;
            newSource.connect(context.destination);
            newSource.start(0);
        };
        /**
         * let it be known how many samples are in a recording
         * @returns{number}
         */
        AudioRecorder.prototype.getNSamples = function () {
            return this._leftBuffer ? this._leftBuffer.length : 0;
        };
        /**
         * Get the mic recorded data in the form of an AudioBuffer.  This can then be put into a
         * BABYLON.Sound via setAudioBuffer().  Also used internally, so can have .WAV / .TS methods work
         * from either an external sound or mic.
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {AudioBuffer}
         */
        AudioRecorder.prototype.getAudioBuffer = function (begin, end) {
            if (begin === void 0) { begin = 0; }
            if (!this.playbackReady) {
                BABYLON.Tools.Warn('QI.AudioRecorder: playback when not playbackReady');
                return null;
            }
            var leftBuffer;
            var rightBuffer;
            if (begin === 0 && !end) {
                leftBuffer = this._leftBuffer;
                rightBuffer = this._rightBuffer;
            }
            else {
                // adjust args
                if (!end)
                    end = this._leftBuffer.length;
                leftBuffer = this._leftBuffer.slice(begin, end);
                rightBuffer = this._rightBuffer.slice(begin, end);
            }
            var context = BABYLON.Engine.audioEngine.audioContext;
            var ret = context.createBuffer(2, leftBuffer.length, context.sampleRate);
            ret.getChannelData(0).set(leftBuffer);
            ret.getChannelData(1).set(rightBuffer);
            return ret;
        };
        // ==================================== To Script Methods ====================================
        /** revoke the last temp url */
        AudioRecorder._cleanUrl = function () {
            if (AudioRecorder._objectUrl) {
                (window.webkitURL || window.URL).revokeObjectURL(AudioRecorder._objectUrl);
                AudioRecorder._objectUrl = null;
            }
        };
        /**
         * Save the last mircorphone recording as an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.prototype.micToScript = function (sndName, stereo, typeScript, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (typeScript === void 0) { typeScript = false; }
            if (begin === void 0) { begin = 0; }
            AudioRecorder.saveToScript(sndName, this.getAudioBuffer(), stereo, typeScript, begin, end);
        };
        /**
         * Save an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, also the name of the function, and the filename
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.saveToScript = function (sndName, audio, stereo, typeScript, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (typeScript === void 0) { typeScript = false; }
            if (begin === void 0) { begin = 0; }
            AudioRecorder._cleanUrl();
            if (sndName.length === 0) {
                window.alert('QI.AudioRecorder: No name specified');
                return;
            }
            else if (sndName.indexOf('.') !== -1) {
                window.alert('QI.AudioRecorder: Dot not allowed in a function name');
                return;
            }
            var filename = sndName + (typeScript ? '.ts' : '.js');
            var blob = new Blob([AudioRecorder._getScriptSource(sndName, audio, stereo, typeScript, begin, end)], { type: 'text/plain;charset=utf-8' });
            // turn blob into an object URL; saved as a member, so can be cleaned out later
            AudioRecorder._objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = AudioRecorder._objectUrl;
            link.download = filename;
            var click = document.createEvent('MouseEvents');
            click.initEvent('click', true, false);
            link.dispatchEvent(click);
        };
        /**
         * Encode an audio buffer into an inline Typescript or Javascript function string
         * @param {string} sndName - The name to give the sound, and also the name of the function
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {boolean} typeScript - Style of function to build, Typescript when True (default), else Javascript
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {string} - in-line source code
         */
        AudioRecorder._getScriptSource = function (sndName, audio, stereo, typeScript, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (typeScript === void 0) { typeScript = false; }
            if (begin === void 0) { begin = 0; }
            // adjust args
            if (!end)
                end = audio.getChannelData(0).length;
            stereo = stereo && audio.numberOfChannels > 1;
            var leftBuffer = audio.getChannelData(0).slice(begin, end);
            var rightBuffer = stereo ? audio.getChannelData(1).slice(begin, end) : null;
            var length = leftBuffer.length;
            var sampleRate = audio.sampleRate;
            var ret = typeScript ? 'public ' + sndName + '(scene: BABYLON.Scene) : BABYLON.Sound {\n' : 'function ' + sndName + '(scene) {\n';
            ret += '    var toBuf = function(base64){\n';
            ret += '        var bStr = window.atob(base64);\n\n';
            ret += '        var len = bStr.length;\n';
            ret += '        var ret = new Float32Array(len / 2);\n';
            ret += '        var b1, b2, asShort, isNeg;\n';
            ret += '        for(var i = 0, j = 0; i < len; i += 2, j++){\n';
            ret += '            b1 = bStr.charCodeAt(i);\n';
            ret += '            b2 = bStr.charCodeAt(i + 1);\n';
            ret += '            isNeg = b1 >> 7 === 1;\n';
            ret += '            b1 = b1 & 0x7F;\n';
            ret += '            asShort = 256 * b1 + b2;\n';
            ret += '            if (isNeg) asShort -= 0x8000;\n';
            ret += '            ret[j] = asShort / 0x7FFF;\n';
            ret += '        }\n';
            ret += '        return ret;\n';
            ret += '    }\n\n';
            ret += '    var context = BABYLON.Engine.audioEngine.audioContext;\n';
            ret += '    var audioBuffer = context.createBuffer(' + (stereo ? 2 : 1) + ', ' + length + ', ' + sampleRate + ');\n';
            ret += '    audioBuffer.getChannelData(0).set(toBuf(\"' + AudioRecorder._floatTo16BitIntBase64(leftBuffer) + '\") );\n';
            if (stereo) {
                ret += '    audioBuffer.getChannelData(1).set(toBuf(\"' + AudioRecorder._floatTo16BitIntBase64(rightBuffer) + '\") );\n';
            }
            ret += '    var snd = new BABYLON.Sound("' + sndName + '", null, scene);\n';
            ret += '    snd.setAudioBuffer(audioBuffer);\n';
            ret += '    return snd;\n';
            ret += '}\n';
            return ret;
        };
        /**
         * encode a float array with values (-1 to 1) as BASE 64 string, after converting to a short int (16 bit)
         */
        AudioRecorder._floatTo16BitIntBase64 = function (array) {
            var binary = '';
            for (var i = 0, len = array.length; i < len; i++) {
                var asShort = (array[i] * 0x7FFF) & 0xFFFF; // convert to: -32,768 - 32,767, then truncate
                binary += String.fromCharCode((asShort & 0xFF00) >> 8); // append high order byte
                binary += String.fromCharCode(asShort & 0x00FF); // append low  order byte
            }
            return window.btoa(binary);
        };
        // ====================================== To Wav Methods =====================================
        /**
         * Save the last mircorphone recording as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {boolean} stereo - 2 channels when true (default true)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.prototype.micToWAV = function (filename, stereo, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (begin === void 0) { begin = 0; }
            AudioRecorder.saveToWAV(filename, this.getAudioBuffer(), stereo, begin, end);
        };
        /**
         * Save an audio buffer as a WAV file
         * @param {string} filename - valid file name (no path), & optional extension (added if missing)
         * @param {AudioBuffer} audio - buffer to save
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         */
        AudioRecorder.saveToWAV = function (filename, audio, stereo, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (begin === void 0) { begin = 0; }
            if (filename.length === 0) {
                window.alert('QI.AudioRecorder: No name specified');
                return;
            }
            else if (filename.toLowerCase().lastIndexOf('.wav') !== filename.length - 4 || filename.length < 5) {
                filename += '.wav';
            }
            var blob = new Blob([AudioRecorder._encodeWAV(audio, stereo, begin, end)], { type: 'audio/wav' });
            // turn blob into an object URL; saved as a member, so can be cleaned out later
            AudioRecorder._objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
            var link = window.document.createElement('a');
            link.href = AudioRecorder._objectUrl;
            link.download = filename;
            var click = document.createEvent('MouseEvents');
            click.initEvent('click', true, false);
            link.dispatchEvent(click);
        };
        /**
         * Encode an audio buffer into a WAV formatted DataView
         * @param {AudioBuffer} audio - buffer to encode
         * @param {boolean} stereo - 2 channels when true & audio has more than 1 channel (default true)
         * @param {number} begin - sample in audio to start at (default 0)
         * @param {number} end - last sample + 1 in audio to use (audio length)
         * @returns {DataView} - WAV formatted
         */
        AudioRecorder._encodeWAV = function (audio, stereo, begin, end) {
            if (stereo === void 0) { stereo = true; }
            if (begin === void 0) { begin = 0; }
            // adjust args
            if (!end)
                end = audio.getChannelData(0).length;
            stereo = stereo && audio.numberOfChannels > 1;
            var leftBuffer = audio.getChannelData(0).slice(begin, end);
            var rightBuffer = stereo ? audio.getChannelData(1).slice(begin, end) : null;
            var sampleRate = audio.sampleRate;
            // interleave both channels together, if stereo
            var interleaved = stereo ? AudioRecorder._interleave(leftBuffer, rightBuffer) : leftBuffer;
            var dataSize = interleaved.length * 2; // 2 bytes per byte to also include volume with each
            var headerSize = 44;
            var nChannels = stereo ? 2 : 1;
            var blockAlign = nChannels * 2;
            var buffer = new ArrayBuffer(headerSize + dataSize);
            var view = new DataView(buffer);
            // - - - - - - RIFF chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, headerSize + dataSize, true);
            AudioRecorder._writeUTFBytes(view, 8, 'WAVE');
            // - - - - - - FMT inner-chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true); // size of FMT inner-chunk
            // format WAVEFORMATEX, http://msdn.microsoft.com/en-us/library/windows/desktop/dd390970%28v=vs.85%29.aspx
            view.setUint16(20, 1, true); // WAVEFORMATEX
            view.setUint16(22, nChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * blockAlign, true); // nAvgBytesPerSec
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, 16, true); // bits per sample (same for mono / stereo, since stereo is 2 samples)
            // - - - - - - data inner-chunk (chunkID, chunkSize, data)
            AudioRecorder._writeUTFBytes(view, 36, 'data');
            view.setUint32(40, dataSize, true);
            // write the PCM samples
            var lng = interleaved.length;
            var index = headerSize;
            var volume = 1;
            // write each byte of data + volume byte
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }
            return view;
        };
        /**
         * Combine left and right channels, alternating values, returned in a new Array
         */
        AudioRecorder._interleave = function (left, right) {
            var length = left.length + right.length;
            var result = new Float32Array(length);
            var inputIndex = 0;
            for (var index = 0; index < length;) {
                result[index++] = left[inputIndex];
                result[index++] = right[inputIndex];
                inputIndex++;
            }
            return result;
        };
        /**
         * encode a text string into a dataview as 8 bit characters
         * @param {DataView} view- DataView to update
         * @param {number} offset- location in view to edit
         * @param {string} str- Values to insert
         */
        AudioRecorder._writeUTFBytes = function (view, offset, str) {
            var lng = str.length;
            for (var i = 0; i < lng; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        return AudioRecorder;
    }());
    QI.AudioRecorder = AudioRecorder;
})(QI || (QI = {}));
var QI;
(function (QI) {
    function decodeChannel(base64) {
        var bStr = window.atob(base64);
        var len = bStr.length;
        var ret = new Float32Array(len / 2);
        var b1, b2, asShort, isNeg;
        for (var i = 0, j = 0; i < len; i += 2, j++) {
            b1 = bStr.charCodeAt(i);
            b2 = bStr.charCodeAt(i + 1);
            isNeg = b1 >> 7 === 1;
            b1 = b1 & 0x7F;
            asShort = 256 * b1 + b2;
            if (isNeg)
                asShort -= 0x8000;
            ret[j] = asShort / 0x7FFF;
        }
        return ret;
    }
    QI.decodeChannel = decodeChannel;
})(QI || (QI = {}));
/// <reference path="./AudioDecoder.ts"/>
var QI;
(function (QI) {
    function Whoosh(scene) {
        var context = BABYLON.Engine.audioEngine.audioContext;
        var audioBuffer = context.createBuffer(1, 13517, 44100);
        audioBuffer.getChannelData(0).set(QI.decodeChannel("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"));
        var snd = new BABYLON.Sound("whoosh", null, scene);
        snd.setAudioBuffer(audioBuffer);
        return snd;
    }
    QI.Whoosh = Whoosh;
})(QI || (QI = {}));
/// <reference path="../Mesh.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BEING;
(function (BEING) {
    /** class for a single eye.  2 Eye Classes are "controlled" in tandem by calling the public methods of this class.
     *
     * Movement up / down left right are controlled by POV rotation.
     *
     * Camera following implemented using billboard mode, doable since just a single eye per mesh.
     *
     * Pupil size / color to be implemented with a custom material.  You can use a 2 eye texture though. When Blender
     * splits the eyes, it handles paritioning of the UV's as well.  Of course, you lose pupil size then using a
     * texture.
     *
     * NOTE: For MakeHuman there is an operator which will automatically separate the eyes, change origin, & set base class.
     * It is in the MakeHuman Community Plugin for Blender.  See https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community
     */
    var EyeBall = (function (_super) {
        __extends(EyeBall, _super);
        /**
         * @constructor - Args same As BABYLON.Mesh
         * @param {string} name - The value used by scene.getMeshByName().  Must end in either '_L' or '_R'.
         * @param {Scene} scene - The scene to add this mesh to.
         * @param {Node} parent - The head / body, so eye stays in head as parent moves
         * @param {Mesh} source - An optional Mesh from which geometry is shared, cloned.
         * @param {boolean} doNotCloneChildren - When cloning, skip cloning child meshes of source, default False.
         *                  When false, achieved by calling a clone(), also passing False.
         *                  This will make creation of children, recursive.
         */
        function EyeBall(name, scene, parent, source, doNotCloneChildren) {
            if (parent === void 0) { parent = null; }
            _super.call(this, name, scene, parent, source, doNotCloneChildren);
            this._pupilSize = 0.5;
        }
        /**
         * @param {QI.MotionEvent} amt - Only the rotation component may be specified.  movePOV MUST be null.
         */
        EyeBall.prototype.queueRotation = function (amt, postEventFunc) {
            // do not call setFollowMode(), since it clears the queue
            this.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE;
            var deformations = [amt];
            if (postEventFunc)
                deformations.push(postEventFunc);
            var series = new QI.EventSeries(deformations);
            series._debug = true;
            this.queueEventSeries(series);
        };
        /**
         * called publicly by Eyes.moveRandom()
         */
        EyeBall.prototype.stop = function () {
            this._povProcessor.clearQueue(true);
        };
        /**
         * Toggle followMode (implemented using BILLBOARD_MODE).
         * @param {boolean} stop - Toggle
         */
        EyeBall.prototype.followMode = function (stop) {
            if (!stop)
                this._povProcessor.clearQueue(true);
            this._performSetBack(stop ? 0 : EyeBall._FOLLOW_MODE_SET_BACK);
            this.billboardMode = stop ? BABYLON.Mesh.BILLBOARDMODE_NONE : BABYLON.Mesh.BILLBOARDMODE_ALL;
        };
        /**
         * Toggle random (but tandem) eye movements without actively management
         * @param {boolean} stop - Toggle
         */
        EyeBall.prototype.moveRandom = function (stop) {
            this._performSetBack(stop ? 0 : EyeBall._RANDOM_MODE_SET_BACK);
        };
        /** shift eyes back slightly, so rotation does not cause eyes to violate skin
         * @param {number} amt - 0 to 1, used
         */
        EyeBall.prototype._performSetBack = function (amt) {
            if (!this._originalPositionZ)
                this._originalPositionZ = this.position.z;
            var boundingBox = this.getBoundingInfo().boundingBox;
            this.position.z = this._originalPositionZ + (boundingBox.maximum.z * amt);
        };
        /**
         * Getter to identify which EyeBall instance is left or right side.
         * @returns {boolean} - When true instance is left side, else is right side.
         */
        EyeBall.prototype.isLeft = function () {
            return this.name.substring(this.name.length - 3) === "_L";
        };
        /**
         * @param {number} size - A value from 0 to 1, where 1 is maximum dilation.
         */
        EyeBall.prototype.setPupilSize = function (size) {
            // to-do
        };
        EyeBall._FOLLOW_MODE_SET_BACK = 0.15;
        EyeBall._RANDOM_MODE_SET_BACK = 0.10;
        return EyeBall;
    }(QI.Mesh));
    BEING.EyeBall = EyeBall;
})(BEING || (BEING = {}));
/// <reference path="./EyeBall.ts"/>
var BEING;
(function (BEING) {
    /** Class to control a set of EyeBalls.
     *
     * Movement up / down left right are controlled by POV rotation.
     *
     * Camera following implemented using billboard mode, doable since just a single eye per mesh.
     *
     * Pupil size / color to be implemented with a custom material.  You can use a 2 eye texture though. When Blender
     * splits the eyes, it handles partitioning of the UV's as well.  Of course, you lose pupil size then using a
     * texture.
     *
     * NOTE: For MakeHuman there is an operator which will automatically separate the eyes, change origin, & set base class.
     * It is in the MakeHuman Community Plugin for Blender.  See https://github.com/makehumancommunity/community-plugins/tree/master/blender_source/MH_Community
     */
    var Eyes = (function () {
        /**
         * Non-exported constructor, called only by Eyes.getInstance().
         */
        function Eyes(eyes) {
            this._pupilSize = 0.5;
            this._followMode = false;
            var leftIdx = (eyes[0].isLeft()) ? 0 : 1;
            var rightIdx = (leftIdx === 1) ? 0 : 1;
            this._leftEye = eyes[leftIdx];
            this._rightEye = eyes[rightIdx];
        }
        /** Do not want for force the eye to only work with a make human.  Use this to analze parent mesh to pick out
         *  the eyeballs from the children meshes.
         *
         * @param {BABYLON.Mesh} parentMesh - The mesh search for children that are instances of BEING.EyeBall.
         * @returns {BEING.Eyes} - When 2 child BEING.EyeBalls are found, a constructor is run & returned.  Otherwise
         * null is returned.
         */
        Eyes.getInstance = function (parentMesh) {
            var children = parentMesh.getChildren();
            var eyes = new Array();
            for (var i = 0, nKids = children.length; i < nKids; i++) {
                if (children[i] instanceof BEING.EyeBall) {
                    eyes.push(children[i]);
                    if (eyes.length === 2)
                        break;
                }
            }
            var ret = (eyes.length === 2) ? new Eyes(eyes) : null;
            return ret;
        };
        /**
         * @param {number} up   - 1 is highest, 0 straightforward, -1 is lowest
         * @param {number} left - 1 is leftmost from the meshes point of view, 0 straightforward, -1 is rightmost
         * @param {number} duration - The time the rotation is to take, in millis (Default 600).
         * @param {number) wait - The time to wait once event is begun execution (Default 0).
         * @param {function} postEventFunc - call this upon completion, only done one eye; presume it is next random
         */
        Eyes.prototype.queueRotation = function (up, left, duration, wait, postEventFunc) {
            if (duration === void 0) { duration = 600; }
            if (wait === void 0) { wait = 0; }
            // ignore any queuing till eyes are ready & enabled; getInstance() run very early in Body postConstruction()
            if (!this._leftEye.isVisible || !this._rightEye.isVisible)
                return;
            // up processed the same way regardless of eye
            var absUp = Eyes.MAX_UP * up;
            // the sign of left determines which set of values of EYE_RANGE to use
            var idx = (left < 0) ? 0 : 1;
            // no longer need sign on left
            left = Math.abs(left);
            // assign left for Left eye, create motion event
            var absLeftL = Eyes.L_EYE_RANGE[idx] * left;
            var eventL = new QI.MotionEvent(duration, null, new BABYLON.Vector3(absUp, absLeftL, 0), { millisBefore: wait, absoluteRotation: true });
            // assign left for Right eye, create motion event
            var absLeftR = Eyes.R_EYE_RANGE[idx] * left;
            var eventR = new QI.MotionEvent(duration, null, new BABYLON.Vector3(absUp, absLeftR, 0), { millisBefore: wait, absoluteRotation: true });
            // sync pair them for least error; especially important for random
            eventL.setSyncPartner(eventR);
            eventR.setSyncPartner(eventL);
            // queue them
            this._leftEye.queueRotation(eventL, postEventFunc);
            this._rightEye.queueRotation(eventR);
        };
        /**
         * Toggle followMode (implemented using BILLBOARD_MODE).
         * @param {boolean} stop - Toggle
         */
        Eyes.prototype.followMode = function (stop) {
            this._leftEye.followMode(stop);
            this._rightEye.followMode(stop);
        };
        /**
         * Toggle random (but tandem) eye movements without actively management
         * @param {boolean} stop - Toggle
         */
        Eyes.prototype.moveRandom = function (stop) {
            // adjust the Z axis setback for each eye
            this._leftEye.moveRandom(stop);
            this._rightEye.moveRandom(stop);
            if (stop) {
                this._leftEye.stop();
                this._rightEye.stop();
                return;
            }
            this.followMode(true);
            var duration = Math.random() * (500 - 100) + 100; // between 100 & 500 millis
            var wait = Math.random() * (12000 - 5000) + 5000; // between 5 & 12 secs
            var up = Math.random() * 2 - 1; // between -1 & 1
            var left = Math.random() * 2 - 1; // between -1 & 1
            //    var idx = Math.floor(Math.random() * Eyes._RANDOM.length);
            //    var pos = Eyes._RANDOM[idx];
            var me = this;
            this.queueRotation(up, left, duration, wait, function () { me.moveRandom(); });
        };
        /**
         * @param {number} size - A value from 0 to 1, where 1 is maximum dilation.
         */
        Eyes.prototype.setPupilSize = function (size) {
            // to-do
            BABYLON.Tools.Error("setPupilSize() not yet implemented");
        };
        // these are in absolute radian amounts
        Eyes.MAX_UP = 0.12;
        //                            right - left
        Eyes.L_EYE_RANGE = [0.35, -0.50];
        Eyes.R_EYE_RANGE = [0.50, -0.35];
        return Eyes;
    }());
    BEING.Eyes = Eyes;
})(BEING || (BEING = {}));
/// <reference path="./Eyes.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../Mesh.ts"/>
var BEING;
(function (BEING) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            _super.apply(this, arguments);
            this._doInvoluntaryBlinking = false; // turned on when WINK shape key found
            this.expressionNames = new Array();
            this._winkableExpressions = new Array();
            this._currentExpressionIdx = 0;
            this._currentExpDegree = 0;
            this._continuousMoodChanging = false;
        }
        // no need for a constructor, just use super's & subclasses made by TOB
        // ====================================== intializing ========================================
        /** neither the child eye meshes nor the shapekeys will be defined until the subclass constructor has run, so this put here */
        Body.prototype.postConstruction = function () {
            // assigned null when these are not broken out
            this.eyes = BEING.Eyes.getInstance(this);
            this._winker = this.getShapeKeyGroup(Body._WINK);
            // pre-compute combo keys, and pre-assign series
            if (this._winker) {
                this._winker.addComboDerivedKey(QI.ShapeKeyGroup.BASIS, [Body._LEFT, Body._RIGHT], [1, 1], null, Body._BOTH_CLOSED);
                var deformations;
                var ref = this;
                deformations = [new QI.Deformation(Body._WINK, Body._BOTH_CLOSED, 1, Body._DEFORM_SPEED),
                    new QI.BasisReturn(Body._WINK, Body._DEFORM_SPEED, null, null, { millisBefore: Body._CLOSE_PAUSE }),
                    function () { ref._resetForNextBlink(); }
                ];
                this._stdBlinkSeries = new QI.EventSeries(deformations, 1, 1, Body._WINK);
            }
            this._doInvoluntaryBlinking = true;
            this._resetForNextBlink();
            // expressions
            this.hasExpressions = this._mapAvailableExpressions();
            this.setContinuousMoodChanging(this.hasExpressions);
        };
        /**
         * Broken out from postConstruction for modularity.  Verifies mesh actually has expressions, and lists them.
         */
        Body.prototype._mapAvailableExpressions = function () {
            this._face = this.getShapeKeyGroup(Body._FACE);
            if (!this._face)
                return false;
            var stateNames = this._face.getStates();
            // The first expression is None:
            this.expressionNames.push("NO_EXPRESSION");
            for (var i = 1, len = stateNames.length; i < len; ++i) {
                if (stateNames[i].indexOf("_EXP") > -1) {
                    this.expressionNames.push(stateNames[i]);
                    this._winkableExpressions.push(stateNames[i].indexOf("_WINKABLE") > -1);
                }
            }
            Object.freeze(this.expressionNames); // make immutable, to allow direct access
            return this.expressionNames.length > 0;
        };
        // ============================ beforeRender callback & tracking =============================
        /** @override */
        Body.prototype.beforeRender = function () {
            _super.prototype.beforeRender.call(this);
            // avoid queuing issues of eye lids, if a deformation in progress ( possibly a wink / blink too )
            if (this._shapeKeyChangesMade)
                return;
            // blink / wink queuing
            if (this._winker && this._winkStatus !== Body._BLINK_DISABLED)
                this._winkPostProcessing();
            // continuous mood processing, only when nothing running or in queue
            if (this._continuousMoodChanging && !this._face.isActive())
                this._moodPostProcessing();
        };
        // =================================== winking & blinking ====================================
        /**
         * Called by beforeRender(), unless no wink shape key group, or nothing to do.
         * Also not called in the case when a shape key deformation occurred this frame, to avoid conflicts.
         */
        Body.prototype._winkPostProcessing = function () {
            var ref = this;
            var series;
            var deformations;
            switch (this._winkStatus) {
                case Body._NOTHING_QUEUED:
                    // negative test, since success is breaking
                    if (QI.TimelineControl.Now - this._lastBlink < this._blinkInterval) {
                        //                        console.log("TimelineControl.Now " + QI.TimelineControl.Now + ", this._lastBlink " + this._lastBlink + ", this._blinkInterval" + this._blinkInterval);
                        break;
                    }
                case Body._BLINK_QUEUED:
                    if (this._winkCloseTime < 0)
                        series = this._stdBlinkSeries;
                    else {
                        deformations = [new QI.Deformation(Body._WINK, Body._BOTH_CLOSED, 1, this._winkCloseTime),
                            new QI.BasisReturn(Body._WINK, Body._DEFORM_SPEED, null, null, { millisBefore: this._winkCloseTime }),
                            function () { ref._resetForNextBlink(); }
                        ];
                        series = new QI.EventSeries(deformations, 1, 1, Body._WINK);
                    }
                    break;
                case Body._WINK_LEFT_QUEUED:
                    deformations = [new QI.Deformation(Body._WINK, Body._LEFT, 1, this._winkCloseTime),
                        new QI.BasisReturn(Body._WINK, Body._DEFORM_SPEED, null, null, { millisBefore: this._winkCloseTime }),
                        function () { ref._resetForNextBlink(); }
                    ];
                    series = new QI.EventSeries(deformations, 1, 1, Body._WINK);
                    break;
                case Body._WINK_RIGHT_QUEUED:
                    deformations = [new QI.Deformation(Body._WINK, Body._RIGHT, 1, this._winkCloseTime),
                        new QI.BasisReturn(Body._WINK, Body._DEFORM_SPEED, null, null, { millisBefore: this._winkCloseTime }),
                        function () { ref._resetForNextBlink(); }
                    ];
                    series = new QI.EventSeries(deformations, 1, 1, Body._WINK);
                    break;
            }
            if (series) {
                //                series._debug = true;
                this.queueEventSeries(series);
                this._winkStatus = Body._WINK_BLINK_INPROGRESS;
            }
        };
        /** function added to the end of a wink event series, to schedule the next involuntary blink */
        Body.prototype._resetForNextBlink = function () {
            if (this._doInvoluntaryBlinking) {
                var action = this._winkableExpressions[this._currentExpressionIdx] ? Math.random() : 1;
                // wink 10% of the time, when current expression is winkable (it would be dumb to wink when crying)
                if (action < 0.05)
                    this.winkLeft(700);
                else if (action < 0.1)
                    this.winkRight(700);
                else {
                    this._winkStatus = Body._NOTHING_QUEUED;
                    this._lastBlink = QI.TimelineControl.Now;
                    this._blinkInterval = Math.random() * (Body._MAX_INTERVAL - 1000) + 1000; // between 1000 & 8000 millis
                    this._winkCloseTime = -1;
                }
            }
            else
                this._winkStatus = Body._BLINK_DISABLED;
        };
        /**
         * Indicate the a left side wink should occur at the next available opportunity.
         * When called externally, can be done without involuntary blinking enabled.
         * @param {number} closeTime - Millis to stay closed, not including the close itself (Default 10).
         */
        Body.prototype.winkLeft = function (closeTime) {
            if (closeTime === void 0) { closeTime = -1; }
            if (!this._winker)
                throw this.name + " has no shapekeygroup WINK";
            this._winkStatus = Body._WINK_LEFT_QUEUED;
            this._winkCloseTime = closeTime;
        };
        /**
         * Indicate the a right side wink should occur at the next available opportunity.
         * When called externally, can be done without involuntary blinking enabled.
         * @param {number} closeTime - Millis to stay closed, not including the close itself (Default 10).
         */
        Body.prototype.winkRight = function (closeTime) {
            if (closeTime === void 0) { closeTime = -1; }
            if (!this._winker)
                throw this.name + " has no shapekeygroup WINK";
            this._winkStatus = Body._WINK_RIGHT_QUEUED;
            this._winkCloseTime = closeTime;
        };
        /**
         * Indicate that a single blink should occur at the next available opportunity.
         * @param {number} closeTime - Millis to stay closed, not including the close itself (Default 10).
         */
        Body.prototype.blink = function (closeTime) {
            if (closeTime === void 0) { closeTime = -1; }
            if (!this._winker)
                throw this.name + " has no shapekeygroup WINK";
            this._winkStatus = Body._BLINK_QUEUED;
            this._winkCloseTime = closeTime;
        };
        /**
         * Indicate whether involuntary blinking should occur.
         * @param {boolean} enabled - when true
         */
        Body.prototype.involuntaryBlinkingEnabled = function (enabled) {
            if (!this._winker && enabled)
                throw this.name + " has no shapekeygroup WINK";
            if (enabled) {
                if (!this._doInvoluntaryBlinking) {
                    this._doInvoluntaryBlinking = true;
                    this._winkStatus = Body._NOTHING_QUEUED;
                    this._resetForNextBlink();
                }
            }
            else
                this._doInvoluntaryBlinking = false;
        };
        // ====================================== Expressions ========================================
        /**
         * This queues the next change.  When called from beforeRender / continuous Mood changing,
         * this only runs when nothing running or queued.
         * @param {boolean} skipChanging - In continuous mood changing, there are a number of degree
         * changes using the same expression.  This can also be called by setCurrentMood().  In that
         * case, these minor changes should not be done.
         */
        Body.prototype._moodPostProcessing = function (skipChanging) {
            var duration = skipChanging ? 250 : 750;
            var delay = skipChanging ? 0 : Math.random() * 200;
            // section only run by continuous mood changing
            if (!skipChanging) {
                var amtChange = Math.random() * 3 - 1.5; // between -1.5 & 1.5
                if (this._currentExpDegree >= 7)
                    amtChange -= 2;
                else if (this._currentExpDegree <= 2)
                    amtChange += 2;
                this._currentExpDegree += amtChange;
                // this is always after exp degree set, cause if mood changed degree always set too
                this._pickAMood();
            }
            var deformation;
            if (this._currentExpressionIdx !== 0)
                deformation = new QI.VertexDeformation(Body._FACE, QI.ShapeKeyGroup.BASIS, [this.expressionNames[this._currentExpressionIdx]], [this._currentExpDegree / 9], duration, null, null, { millisBefore: delay });
            else
                deformation = new QI.BasisReturn(Body._FACE, duration);
            var series = new QI.EventSeries([deformation]);
            this._face.queueEventSeries(series, skipChanging, skipChanging);
        };
        Body.prototype._pickAMood = function () {
            if (this._numChangesOfCurrentMood++ < this._totChangesOfCurrentMood)
                return false;
            this._currentExpressionIdx = Math.floor(Math.random() * this.expressionNames.length);
            this._numChangesOfCurrentMood = 0;
            this._totChangesOfCurrentMood = Math.floor(Math.random() * (Body._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
            this._currentExpDegree = 3; // always have low degree when first changing expression
            return true;
        };
        // ============================== Public Expressions Methods =================================
        /**
         * To enable / disable continuous mood changing mode.
         * @param {boolean} on - The switch.
         */
        Body.prototype.setContinuousMoodChanging = function (on) {
            if (!this.hasExpressions && on)
                throw this.name + " does not have expressions";
            this._continuousMoodChanging = on;
            this._numChangesOfCurrentMood = Body._MAX_CHANGES_FOR_MOOD; // force picking of a new current mood
        };
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
        Body.prototype.setCurrentMood = function (expression, degree, justDocumenting) {
            var idx = -1;
            for (var i = 0, len = this.expressionNames.length; i < len; i++) {
                if (this.expressionNames[i] === expression) {
                    idx = i;
                    break;
                }
            }
            if (idx === -1)
                throw this.name + " does not have expression: " + expression;
            this._currentExpressionIdx = idx;
            this._currentExpDegree = degree;
            this._numChangesOfCurrentMood = 0;
            this._totChangesOfCurrentMood = Math.floor(Math.random() * (Body._MAX_CHANGES_FOR_MOOD - 5) + 5); // between 5 & 10
            if (!justDocumenting)
                this._moodPostProcessing(true);
        };
        // blink strings for group name & morph targets
        Body._WINK = "WINK"; // shape key group name
        Body._BOTH_CLOSED = "BOTH";
        Body._LEFT = "LEFT";
        Body._RIGHT = "RIGHT";
        // the list of possible blink statuses
        Body._BLINK_DISABLED = -3;
        Body._WINK_BLINK_INPROGRESS = -2;
        Body._NOTHING_QUEUED = -1;
        Body._BLINK_QUEUED = 0;
        Body._WINK_LEFT_QUEUED = 1;
        Body._WINK_RIGHT_QUEUED = 2;
        // blink time / duration settings
        Body._DEFORM_SPEED = 50; // millis, 100 round trip
        Body._CLOSE_PAUSE = 10; // millis
        Body._MAX_INTERVAL = 8000; // millis, 6000 is average according to wikipedia
        // expressions
        Body._FACE = "FACE"; // shape key group name
        Body._MAX_CHANGES_FOR_MOOD = 10;
        return Body;
    }(QI.Mesh));
    BEING.Body = Body;
})(BEING || (BEING = {}));
/// <reference path="../Mesh.ts"/>
var QI;
(function (QI) {
    var GatherEntrance = (function () {
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        function GatherEntrance(_mesh, durations, soundEffect) {
            this._mesh = _mesh;
            this.durations = durations;
            this.soundEffect = soundEffect;
        }
        /** GrandEntrance implementation */
        GatherEntrance.prototype.makeEntrance = function () {
            var startingState = GatherEntrance.buildScatter(this._mesh);
            // queue a return to basis
            var ref = this;
            var events;
            events = [
                // morphImmediate to starting state prior making root mesh visible.  Start sound, if passed.
                new QI.MorphImmediate(QI.Mesh.COMPUTED_GROUP_NAME, startingState, 1, { sound: ref.soundEffect }),
                // make root mesh visible
                function () { ref._mesh.isVisible = true; },
                // return to a basis state
                new QI.BasisReturn(QI.Mesh.COMPUTED_GROUP_NAME, ref.durations[0]),
                // make any children visible
                function () {
                    ref._mesh.makeVisible(true);
                    ref._mesh.getShapeKeyGroup(QI.Mesh.COMPUTED_GROUP_NAME).dispose();
                }
            ];
            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0], QI.Mesh.COMPUTED_GROUP_NAME);
            // run functions of series on the compute group so everything sequential
            var series = new QI.EventSeries(events, 1, 1.0, QI.Mesh.COMPUTED_GROUP_NAME);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        /**
         * Build a SCATTER end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        GatherEntrance.buildScatter = function (mesh) {
            var startingState = "SCATTER";
            var nElements = mesh._originalPositions.length;
            var computedGroup = mesh.makeComputedGroup();
            // determine the SCATTER key
            var scatter = new Float32Array(nElements);
            for (var i = 0; i < nElements; i += 3) {
                scatter[i] = mesh._originalPositions[i] + mesh._originalPositions[i] * Math.random();
                scatter[i + 1] = mesh._originalPositions[i + 1] + mesh._originalPositions[i + 1] * Math.random();
                scatter[i + 2] = mesh._originalPositions[i + 2] + mesh._originalPositions[i + 2] * Math.random();
            }
            computedGroup._addShapeKey(startingState, scatter);
            return startingState;
        };
        return GatherEntrance;
    }());
    QI.GatherEntrance = GatherEntrance;
})(QI || (QI = {}));
/// <reference path="../Mesh.ts"/>
var QI;
(function (QI) {
    /**
     * The Fire Entrance REQUIRES that BABYLON.FireMaterial.js be loaded
     */
    var FireEntrance = (function () {
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        function FireEntrance(_mesh, durations, soundEffect) {
            this._mesh = _mesh;
            this.durations = durations;
            this.soundEffect = soundEffect;
        }
        /** GrandEntrance implementation */
        FireEntrance.prototype.makeEntrance = function () {
            if (!BABYLON.FireMaterial) {
                throw "Fire Material library not found";
            }
            this._count = 3;
            var ref = this;
            var callback = function () { ref._loaded(); };
            // same as coming from https://github.com/BabylonJS/Samples/tree/master/Assets/fire
            this._diffuse = BABYLON.Texture.CreateFromBase64String("data:image/JPEG;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QAMTmVvR2VvAAAAWv/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOMeZ98h3tnJ70qXMkgxvbP1pJExKw7EmlWPYCetfy3pY/p5tGhY3DqOXb860RdNj77fnWHby468Va80gYWuWdO7OGpTuzRW8kXOXb86cbxx/G351nbyQM0hnDnaTWfs0ZezuTvey7uHbH1p8V3Mx/1jfnVXA71Narl6pxSWxTSSLXnz4/1j/wDfRqtNcTqP9c//AH0atMwUZqjPNuJxWcFd7EU7tkEt1MOk0n/fRqP7TcN0mk/76NNk4Uk02OQV1pK2x6CWmgyWe73ZE8vH+2ahe+usczyf99mrxHmDpxVWa0LN0IrSLj1RtGSe5QN3dOf+PiX/AL7NTJdXPe4l/wC+zU62gA5FRGIqelbc0X0NuZS2J0urk9biUf8AAzT/ALXcxnPny/8AfZpsYXHNOIDH2FYtLsYPcmW8uAP9fL/32alW8uOM3EuP981WiAY804/KxrNpdjGSLI1CfoZpMf7xqcXU5UfvpP8Avo1l7/nwelXrds4NRKCXQynG2pOtxcY/1r/99GplmmUZMr5/3jSxoGGTTJTt4HUVz6PSxy813YJLmTvI3/fVQG4kY8SN+dQTuxbb60sXpmtVFJXNlGyuSF5AOJG/OoS02c72/OrqxFh04pTBwc0uZIlVEitFdSxnJkb86n+3uw/1jfnVW5j2jIqlNMUHBrRQUzRQVTUt3N0xON7fnWc1w27/AFjfnUM9ySQKg3ZrrhTsjup0rI15EzI5PXNJ0FTTLtmcdsmkMBNYJ6HNzdyBRyTU8b7Rz0pRCfakZcgn0pNpibUhZJienSmDBOelN7UhUg96aQ0kTBznB6VMsgXvVF5cAUw3AI4NHJcPZ3NUXQkTFQOOeKzkmYGriS4qXDl2F7Pk2FkXK1HHbEnOKkB3tnHFW4gAopOTii+ZxQkEIQYNStEMcVJgYFNkfC8VhdtmavJlSRRzUDRBlJqR2wc9qa0gAx3rdXR1qDRTbCtSqwP06VFM+5jUe/A6810pXR0+zbReQhRxUUkpqp5xz1qYZdRRyW1Zi6fLqwJLHFaVkOADVaGE7ORVmAbTjtWU3dWOWq7qxop8vNJIueaaJMjFO3nHPNcWx51ne5Wli3c4pIYfm5qxjeelTJCMVTnZFudlYkiwops2CM0jHYKqyTEmskru5jGN3cr3UhwRWZNl+lacyFu1VxblQTXdCSSPRpyUUZLQH8ajEbbhWtsBJGOaPsYJBxXT7W251KtbcvzwkyOR/eNRg+UOeTVy4+WRz7mqFxKCpHeuGL5kefFuWg9ZFbkcVG78dOKpiYqSc01r0VuqbvodCpNvQtxsFPIpXYMc1SF2D707zNxyDVcjubKi73ZHcg9RVXJB61fkUlciqzoFGcVtF6HTCOg6NwFqRZT68VWDbuBUiZJxihoTh3NC2beMVeiXpVK3+Uf1qyjEN61xz30OOS1Lm3AxzUUqGnpOGPelk+bkVzq6Y4Jp6lCfC9KpNljmrsqbmqB125rqiz04LQqSJmqk+5cY6VfI61BMm4dK6os22KKyFjyK1LL5sZqokeDgirNu2xulOo7rQ5qzutDWVRgDFMZcGlikGMUkgyM1wdTx+o5JMcZqRZPm61UWTBqXO7gHrQ4kuJdjfLYq0CNvvVCFtoq0Gytc8kcs4g6bhmojEO9Sb8DmmlulCuCuiIqFHNRycip3APSmxw4OTV37miaWpVSDDZNT+WGA4qfaDkCmRqd/Pam5XBzvqS36ZkfHqaxLhGViK6C6GHfPHJrKugMZooysaYd9DGnBU4qsc9B2q/Ioc1AIMnjoa9OMlY96klYgUtjPerdspfrRFBjqM1ZWMAfLxUykjq5b7ClflqCRSxx0qYk9DzTFTcw5rNAqLWpX8oqc96lWMAdanZBimcA4p81zGUWSwn8qsAhT1qoikc1YQ5FYyRwziTK4HtT95x1qNSAwqUKG5FZMlWW5GR3NVpmGanmbbWfcMSGNawVztp6iGRSSKVSrVm+ad/XBqaJmxzXU4WNakLIs+WCTinpHzwKI2/M1ciCg9KylKx505NCxIcc8U5+BTm4HFRs4zzWG5x2b1G+V3Bp8Yx160wSAHHanFwADT1G4sspxz6VMCdtV7fLnnpWhEgZcVzzdjjnoV2Y46VFuYt7VcdAOKhwOhpJkqSGqD3qZmG3GagfOMiovMJp2uPl5tSfft5zR5nzcVVJLHrU0a5xT5bFOKRranDhnxzz1rmrzdvIrqNRON/1rnbohgfWow70NMHczQcN+NTKQOtVZchiRToWJYA16TWlz6inSurltFyc08qCc0gU/hU9vHubmsG7HpU6StcjWLd0FSi3C8gVowWox0pzW+PpXO6vQcktjImj21U2ZfJrbuYRt96zZowtbwnc5pRuhFHH0p6uMe9MH3aiZvmxVWueVOGpa35NO84IOtUzKQfeomd2PehQuYKF2Wp5N2eazpZgOtWRFI69aq3Gnu/TOa2gop2bOynB7FJgzPkc1diAwKdBpTgdCasJprKR8prSVSO1yql3oJEuGq9AM1ELNlPfNWYrdoxnFck5JnlVUxWBUH0qsyHnir+31pzwbh0rFTsZRdjLwRzSxglgDVySHYvrUSKAa15ro3eqLEHBx0FXoWCEVnpnNWI81zTVzy6sLlyXDLkVBjA5qQnCYBqGUMw4rKPY5YroQvIOlVWB3HjrVnycnuKlFsCK3UlE6k1EpxxNnNW40KkAjNWFtcAYqdLM8E1nKojGdVD9SG6V/TcawruLB9q6W9gzI/wDvGsa8gx0qKErWN8JNJoxJIQxOKdDAAckc1cMILZ71MluGIrudSyPqqNSyGpDuAxU0MG1xU6Q7egqykatXJKoejCpoOjAA4pZEyKlWMKOOaTgiua47pu5Slj9aozRqTmtOY5zWZcjk88V002S1zGfNIFbAHFMWMlsnpUzRjPap4bfd2rt5kkc1SkV1tiRkc1JFbDoetasVoMYxQ9hnkde1c7rLYVOmr6laK15HFWPsG7tz9KsQxlcZFXo0DsOK5p1Wjdx5SlHpzAZ208WLA9MVtpEDgY4qb7NxjFcbrs8+c+5zpss84qNrUrnjpW/NCIxjFUp4SVya0jVbOKp7xlbFxT1RR0NWGiQAmonKr0IrbmucvJfQp3CZBqqAAKtyvu6GoPLH610R21NeRpEbNtFTQsWIqMgf/XqWBRuFU9jknDTUuxxgjJqTyhn1p8MecVZEYxyK4nKx5svdKht14OKQRjoKmcY6UxOD0ouQ2WbeINjNaMFoHJx29azos8YrUt5tmPeuWpfoeZXb6EWpWrK78dzWBdQkHpxXcX8IZpM9ia5nUoMMQBxSw9W+hvgq92jAaLbSoCO1WWi3Uxl2HFenzXPrqNXoTw4I5qThTVZX2nipJHyvWs2tT1Kc9STzcH2prSDHXmqxl9KjMu76U1A746kssuRmqU53ZxUztx1qrM2RW8FY6oQuQg/NitGzK8etZycn2q5bfLJ1rSaujedFNG1CgFTiIDI/WqtuWd+BxV8qQB3ry56M4fYu5CIstVuCHGODQnJAxV6GJhwBxWE5lThoWbS2DY4qaWLC8DmpYfkA45p0hIBOK85ybZ49SD5jPuIlxkjOKzbtRtIFa02Op71mXA6966qbMvZsw7knkVnTSMMite5iOc+tZtxHk4HWvXptGnLYgjyeaWUkdqVBtpzYOa2vqYy3IFIzg1ZtwFPFVSuW4q5CvAApz2OWslY0rck4qY9Dmm2se5QCKti1IIzXmykkz5+s1FlBgR2p8MeetW3jx060CInHFHPockquhNbW67OacisXxjFWbaE45rSt7AP82Oa4p1VHc8mdZRbuLqoZZnGOM1g3MRbIrsdTttzyZ4OTXNXcW057Vhh6miM8JW0RiSwBAeMVmXLY4xWrdnec9KzblNwzjpXtU33PrsNU2bKXmlSae0uV+tRzL3qLzSAABn6V2WvqfQ06l7WFEhJIzS8DvUb57U1d3SrsexS1JHNRMpbvU8aFuPSpntSo3UuZI9Sm1EoqmCBVy0t2eTd/SoooyZgMVvWNqcdKirU5Ud0tIlm1tguDjtV37OSQMUW8ZAAIrTigyBmvEqVLO550nyu7KMcIUjjvWnbRDbzUT2+1+nFTr9yuacuYxqTvHQUYVs5onkyMCoyMkUMcHA596zscEktypcsc4FVHBwc1oOBjpzVOVxyK6YMjTYz54w2eKzbiAKcitWU4PtVC5B571302yeQypTtJx+dQbiWq1NH3/WoAnNehFqxlKnYfEme1aENvnHFV4I61bWPpXPUnY8usrFzT7fJFalxbHy8gDOKbZW4JGK1hENoBrxKtT3rny2Jl72hzXltuAIOPpVu1tvMIAGfatSe2XaRgAnvTrC2CzA4pSrXjc8qtU91sks9MCjkVp21lscHHFaMNorRgjg1ZjtVQeteNOu2fL1cS2zM1SLdK/pmuY1KMEsMe9dJqkx818c81kywecN3T2rpw75Umzrw0nCzZyM8BLHIwPes+7AUYFdTqVqANwH0rmb2MsD2NfQUJ859bha3PZmNOCSc1Ci4ycYq48WD8wqFyFGOma9SL0sfUUJ32GoA/UVOkC55NRRqAQQTUwbcvHBpSbPepN9CzBaqQPT0pJBs+UjIqWE7lGDyasRWYkO5ua5nKz1PTot3vIp29tucfLXSWVuAg46VVtbURkNitNWEa56VxVqnNoj0KkrqyJ44FBzV5IdwyOKoQT7mwTWpA4ZcZrzKl0eZVbQ0w5XkU14lxgCpmYKcdqid+4rJNnG5MrqoBxSMAuaWWUL2qpLcZ7VvFNiachs0mOKouDknPFWZWBXNVJT3zXVBWBEEuMYqlNViRz171WlORiu2CN4xuUJ6rqtW5VzTY4+c44rtTsjpcFyklrk1qWzbetUIE+YY4q9GhU5rlqO54mIo3Zt6fOMjnpWsJQU61y8cpUgg4NXorwgAGvLqUru6PmcThW3dG3uDsKvWcQPrWBb6gFZc9K27GbziMHAzXDVg4o+YxdCUUbloxAx2q0DVeHhR3qYV48tz5CpDVmdJagzOWOeahubddny8CpPtW6ZiTxk0lzJvHy/d711LmTRa5lIxLu0+0LgcVzGoaa0TkDkV2k8iqMDrWDqfzN2r1sPUknY+gwVSXNbocbexFBVDGeSM1u6hEO4rNaAc8cV9BTnofd4WatqUumRj8aktz8/NSPFx0yaIY8Oue1bN6H01CzRo2ke4g44rTiQZArPtyR04q9b3CnuM159S7PYowb1LZGxSc9Kqy3oc4HSluZ8xlQeazyDurOEL6s9KnC6uzYgm24Y1r2k/mEEcVhW4JUBuprXsYsEE1yVoqx52ISNMYYcjmoZVZRVuEAoT+lNdMnPavPUrM8VzszKlBPUVUljORWzPbZHAqrJBjA75rqhNGkZ3M6RMj0qu6kE1pPDyaryQZ7V0Rmh3RmSp6Cq0kNa/2bPaoja4xkV0KokaxmkYrw85xUYQ5wBWvcWwxwKqLBtfPauiNS6O2MlJXGwRbQDVwkbenFLHDhcmk2du1ZOXMzz6tmJHgHj9aGm2N1zSMdnFN27sGl5s8ycE2TW7mRwM10+lSeUoJNcxbpsbJrTivDGAM4rkrx59EeFjcPzrQ7WC7BUVdikEgrlbK88zGGrctLnP3q8GrS5T4DFYXkbMiJ2lkbHAJNWWbYME8VnW9xtlYjpk1ZuJw0Wc4rrlF3sc04PmsVNQuwmdtYV3dE5qxqFwMnFZE7lxgetepRppI9/B0UkV5pN7EGkitjKBU4g3HJFX7S1+UY4NdkpqK0Po4TUFoZEtkV6cmqkkbRHJHFdPLZ8EgdO1UprDd1FEK/c+lwNZPcw1uTggA/U1JazMr9DVqTTv3gCrU8WlnHvW7nCx91SlTjAlhiEihmFRtGd52jjNaRsmjgHHaqqIySAEcZrkU76owU07tE9nAz4IGK2bdGTg1WtkAxitCFCRx09a4Ks7nk153J4WwKkGXNEMHrVhIfwzXA2kzx5NETJlaryW5Oa0xH2NRvGBkntUqdiIysZMsYUc1W8vJq1cN8x9KYF3LkV1xdkb2drkQhHTFMlhAXpVyOMnjqaJYSafPqZXszCljOTiq/lYY1rzwbeKpTIADXZCdz0YTuiozbeKgaXBp0rZyBUPRq6YozkiYDdgnrT0iyeKiQ56nipEnAHFDv0ObkbJX+QEmqhuW3Cnzz7htqmxO8U4R7nNOldam5YXvl45rcj1EBd2c1y1vkYrSjPAxXHVpRbPlMZh4t3K6aiyTMB6mpJNTYrgt1rGklKSv/vGmmQtyTiur2MXqeO8PFu9i/NIsvQ55qu6FefeoUfoe+amklyo+tXy8uiOulHldkSW0gdua1YWANYUPD8HvWtb8qPWsaqO/k1NWCFXOW6UT2W7lVyaWxbecHj0rYht9y5ArzJzcGenhpOEkc0bE7+hzVqGzC4yuK2mssGo3hz2pe3cj6xYhuKRkSjcCoqFLIM/tWwLAE5xUgt1Q8Cn7VLY09ukrIqwWaKmAOT1q5DBjA7VLDAd1Xo7fIFcs6h5tWr3K6QYqdI89RVpLU9xU32XiuN1DgdRXKPlDPTmq90hAwB1rTeEjpUb2+9TkURnrctTW5zVzDz0pqxlFyBwa1Lm1O41Elrn73Su9VFY7PaJx1IYUA5p8kfWphbbelRzZA9anmu9DDd6GXcr1rMnQsK1p13E1TeLLYNd1OVjshKyMaWA5zzUE0WBkVuSW4YkYqBrQBTxXZGqRKqr6mKCw470gJHNaLWe5qa1kDgYrf2kTb2sbFUfcyeajCbiTV6S2ATiqzxlTxQpJ7HFOaaJIzhetWY5CpHORVUDOPanI5B54qGrnz+I1uZlxIGdznncapyXJzjNJPJmWT/eNQM25s16UIHnxgXIbnDAZ71dDF8VlxqWYEetbVrDv5NZVLR1BpRdwgj+bnjmtOL5B04qGOHcfTFWPLJ+lcE5XNYT5mXtOkzJz0rqrAfKO/tXL6fD+8HpXXadFgLXi4po9WNrk72wKniqb22DwK2MbuKgnhx0FebGo0dsKjTsZjRhR0qLy93OKutFmljtcjit+ex086SIIoSSK1bW2LMOKdaWRPJHNa9tabSOK46tY86vWXQiis8r0xQbT2rYigyvSnm1yOn6V5vttTyPbu+phfYxSSWWB92t0WOe1Ne1ODxTVctYnU5ebT+c45qtLaADOMGupltvUVQuLTOcV1QrtnXDEX3OZmjIGcYqq8PFb9xa7OMZFUJbXjgV3QqJnfGqmYckPPIxVaS3w2cVutart6c0x7QFa7FWsa+1Rji0zgkVHLaZXArVaDYOelQNFgHmtFUZz1Ju9zDkt9rU3yhzWhdR4I4qoy9a64yujOVbQz5UODxVYx/N0rUkjBB4qlOAgNdUJdDmlXurFaQhVqlJNsOc1LcSD61QlfJrspxuc177mbI26V/dqUQHHXimdJG5/iq3E28BRXoN8qOeTcdhbePkDrzW9ZjgflWdBABg1qWgwoz1rgrSucNSd9C4Itoz2NPRhnpxTGuF4HUUo5IweK4NepNGbT1NXTRh8tXV2AGBXK2ODgeldPppzgV4+KPfoy5tTSRfnp0ygA8VJGvFIRv4PWvIvqdF9SgE3N05rQtLLdg0sFtlxxW1ZWoCjjioq1bLQzrV+VaDbaxxjir0VoM9KtwwDGKuwWoNeROseFUxDKsNscDirC2XTitKCyLdBWjDp25elefOvY8qpieUwRYcdP0qGezwOldWumk+lVrrTTg/L+IrKOJV9zGOLTe5xs1qfSs+e2284rqLq0KnkYrLubb8q9OnVuexSrXOdmteuRmqjWGTz0roHtx3FQyQhFrvjWaPRjWa2OYubTYOlV2jwhrfuYg2RjNZs8GMjFd0Kl0d0KnNuY0kfBP6VQmzk+uK1pYxzWXdsEJPFelTdzoqP3TPuZQODVB5AWp97cbie3YVnGXaeTXq04aHmzdi1LJhay7uccirDyllODmsy5znkV2UoanKpFe5kA5zzVGabYM9aknOGqjc5P+FenTijeNiHOJX9cmrtkBnOaqFgZX+pqWF9uecV0T1RnUV0bsLgr1qb7SEjFY0d3tGM04yMy9a4nS11OONG8tTUS6G8ehrRtmBPJ4rmo5GLqPetuyVzjmsKsLIKlNROmsSCa6fTDsAJrldNHzDr711tnEdgxXzeK00PSwbWzNiOQOKmSAls1VtU2jJrVh6DivCm+XY6Kj5dh0Frzk1qW0OAKit0yea0bZORXnVZnk1qje5atoSRW3Y6eXA4qrZW249K6nTrYYGRXhYityo+bxVflWg2z00bORV5bNF6VOAAMCivFlUlJ3PAlUlJ3ZEIVX+GmPbI46YqxRip5mRzM5zVNN54H41zl1a7WIPavQZ4FkQ5rldXtQhbAr1cNXb91ntYTEN+6zlbiIKT6VmTv2rXvAQfSseZfmNfQ0nc+pou61KcqjNZ92vJrQnyAcetUboErXpU3qerT3Ma5+UE9a5rUJcEnOBXR37bUauJ1i4PzYPfpXvYSPMz0Zr3TNv73D9aqfavMOB9KqXchLmi0O0ZJr6WNNKJ5dRKxfgJByc/jUN6Q+SDzT3k3p8pqjOxGcmiEbu5wNXdyncZ3ZqlO449asXNyFrMkuAWBzmvSpxbOqmmx8jbZH+po+0hRnNUp7kGVxnuaru7YOK7FTvudapX3NZLgMcir0UgdQO/Wuegd+2a2bEklcg9KxqwsRKmkalvDkqwrcsVyKzLQKRV6JjF0bivIq+9oeTWbeiOqsJotoGRmum0yYHAJrzmC6KNnP610WkattcAtXg4nDtq6NsH7srNnoEOGSrsQwRWJYXQdQQ45962LaZMrlx19a+aqRcT0qqsbFuvQ1pWq/MKyYLhCQA6/nWraSJnG9fzryaqZ4da9jpdMQHbXUWyBIxXMaVJGGH7xQf94V08c0QQDzE/76FfM4m97HyGLb5rEtFR/aIv+eqf99Cj7RF/z1T/AL6FcNmefYkopn2iL/non/fQo+0Rf89E/wC+hRZhYfWLrFuMHPStf7RF/wA9E/76FZ+rvE8WRIhP+8K2o3U0b0G4zRw9/EBmsO6jznHpXRXxTcw3r+dYVwyBvvqfxr6ug3Y+0w0tDLkWqN2hVfatSWWME5YfnWVqNwmD8w/OvVp3bPbottpHNay5CHFcDqsjeYR1rstavkXI3DJ964LVLpWcnP5V9fgYO2x6NadlylR1DHB5Jpyx+UOeaqR3A381K8pfocivccXsePO97EnnZJC9KpX05B9qk3Y6dazbsyNnrW1OCuQo3Zm39wS3WqCXGXA96nnU5OazgrLJ+NexTirWPXpQVrH/2Q==", "fireDiffuseTex", this._mesh.getScene(), false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, callback);
            // same as coming from https://github.com/BabylonJS/Samples/tree/master/Assets/fire
            this._distortion = BABYLON.Texture.CreateFromBase64String("data:image/JPEG;base64,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", "fireDistortionTex", this._mesh.getScene(), false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, callback);
            // see directory for source
            this._opacity = BABYLON.Texture.CreateFromBase64String("data:image/JPEG;base64,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", "fireOpacityTex", this._mesh.getScene(), false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, callback);
        };
        /**
         * Even with inline textures, the shaders must still be compiled.  Cannot
         * allow mesh to be visible prior or permanent material will flash.
         */
        FireEntrance.prototype._loaded = function () {
            if (--this._count === 0)
                this._showTime();
        };
        /**
         * The fire is now ready. Go for it.
         */
        FireEntrance.prototype._showTime = function () {
            // record permanent material, so can be returned when done
            var materialHold = this._mesh.material;
            // make the Fire Material & assign
            var fire = new BABYLON.FireMaterial("Fire Entrance", this._mesh.getScene());
            fire.diffuseTexture = this._diffuse;
            fire.distortionTexture = this._distortion;
            fire.opacityTexture = this._opacity;
            fire.speed = 1.0;
            fire.alpha = 0.5;
            fire.checkReadyOnlyOnce = true;
            this._mesh.material = fire;
            // queue a return to actual material
            var ref = this;
            var events = [
                // make root mesh visible
                function () { ref._mesh.isVisible = true; },
                // let fire flame a little.  Start sound, if passed.
                new QI.Stall(ref.durations[0], QI.PovProcessor.POV_GROUP_NAME, ref.soundEffect),
                //  change back to original material; clean up fire resources
                function () {
                    ref._mesh.material = materialHold; // resume with original material
                    ref._mesh.makeVisible(true); // make any children visible
                    // eliminate resources
                    fire.dispose();
                    ref._diffuse.dispose();
                    ref._distortion.dispose();
                    ref._opacity.dispose();
                }
            ];
            // make sure there is a block event for all queues not part of this entrance.
            // user could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0]);
            // run functions of series on the POV processor, so not dependent on a shapekeygroup or skeleton processor existing
            var series = new QI.EventSeries(events);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        return FireEntrance;
    }());
    QI.FireEntrance = FireEntrance;
})(QI || (QI = {}));
/// <reference path="../Mesh.ts"/>
var QI;
(function (QI) {
    var ExpandEntrance = (function () {
        /**
         * @constructor - This is the required constructor for a GrandEntrance.  This is what Tower of Babel
         * generated code expects.
         * @param {QI.Mesh} _mesh - Root level mesh to display.
         * @param {Array<number>} durations - The millis of various sections of entrance.  For Fire only 1.
         * @param {BABYLON.Sound} soundEffect - An optional instance of the sound to play as a part of entrance.
         */
        function ExpandEntrance(_mesh, durations, soundEffect) {
            this._mesh = _mesh;
            this.durations = durations;
            this.soundEffect = soundEffect;
        }
        /** GrandEntrance implementation */
        ExpandEntrance.prototype.makeEntrance = function () {
            var startingState = ExpandEntrance.buildNucleus(this._mesh);
            // queue a return to basis
            var ref = this;
            var events;
            events = [
                // morphImmediate to starting state prior making root mesh visible.  Start sound, if passed.
                new QI.MorphImmediate(QI.Mesh.COMPUTED_GROUP_NAME, startingState, 1, { sound: ref.soundEffect }),
                // make root mesh visible
                function () { ref._mesh.isVisible = true; },
                // return to a basis state
                new QI.BasisReturn(QI.Mesh.COMPUTED_GROUP_NAME, ref.durations[0]),
                // make any children visible
                function () {
                    ref._mesh.makeVisible(true);
                    ref._mesh.getShapeKeyGroup(QI.Mesh.COMPUTED_GROUP_NAME).dispose();
                }
            ];
            var scene = this._mesh.getScene();
            // add a temporary glow for entrance when have HighlightLayer (BJS 2.5), and stencil enabled on engine
            if (BABYLON.HighlightLayer && scene.getEngine().isStencilEnable) {
                // splice as first event
                events.splice(0, 0, function () {
                    // limit effect, so does not othographic cameras, if any
                    var camera = (scene.activeCameras.length > 0) ? scene.activeCameras[0] : scene.activeCamera;
                    ref._HighLightLayer = new BABYLON.HighlightLayer("QI.ExpandEntrance internal", scene, { camera: camera });
                    ref._HighLightLayer.addMesh(ref._mesh, BABYLON.Color3.White());
                });
                // add wait & clean up on the end
                events.push(new QI.Stall(ref.durations[1], QI.Mesh.COMPUTED_GROUP_NAME));
                events.push(function () { ref._HighLightLayer.dispose(); });
            }
            // Make sure there is a block event for all queues not part of this entrance.
            // User could have added events, say skeleton based, for a morph based entrance, so block it.
            this._mesh.appendStallForMissingQueues(events, this.durations[0] + this.durations[1], QI.Mesh.COMPUTED_GROUP_NAME);
            // run functions of series on the compute group so everything sequential
            var series = new QI.EventSeries(events, 1, 1.0, QI.Mesh.COMPUTED_GROUP_NAME);
            // insert to the front of the mesh's queues to be sure the first to run
            this._mesh.queueEventSeries(series, false, false, true);
            // Mesh instanced in pause mode; now resume with everything now queued
            this._mesh.resumeInstancePlay();
        };
        /**
         * Build a NUCLEUS end state on the computed shapekeygroup.  Static so can be used for things other than an entrance.
         * @param {QI.Mesh} mesh - mesh on which to build
         */
        ExpandEntrance.buildNucleus = function (mesh) {
            var startingState = "NUCLEUS";
            var nElements = mesh._originalPositions.length;
            var computedGroup = mesh.makeComputedGroup();
            var nucleus = new Float32Array(nElements);
            for (var i = 0; i < nElements; i += 3) {
                nucleus[i] = 0;
                nucleus[i + 1] = 0;
                nucleus[i + 2] = 0;
            }
            computedGroup._addShapeKey(startingState, nucleus);
            return startingState;
        };
        return ExpandEntrance;
    }());
    QI.ExpandEntrance = ExpandEntrance;
})(QI || (QI = {}));
var TOWER_OF_BABEL;
(function (TOWER_OF_BABEL) {
    /**
     * class to retrieve Meshes from Mesh factories.  Push instances of <factoryModule> to MODULES.
     */
    var MeshFactory = (function () {
        function MeshFactory() {
        }
        /**
         * static method to retrieve instances of Meshes from the <factoryModule> loaded.
         * @param {string} moduleName - the identifier of the module to retrieve from
         * @param {string} meshName - the identifier of the Mesh to instance or clone
         * @param {boolean} cloneSkeleton - clone the skeleton as well
         * @return {BABYLON.Mesh} - when moduleName not loaded returns typeof 'undefined',
         *                          when meshName   not member of a module returns null
         */
        MeshFactory.instance = function (moduleName, meshName, cloneSkeleton) {
            var ret;
            for (var i = 0, len = MeshFactory.MODULES.length; i < len; i++) {
                if (moduleName === MeshFactory.MODULES[i].getModuleName()) {
                    ret = MeshFactory.MODULES[i].instance(meshName, cloneSkeleton);
                    break;
                }
            }
            if (!ret)
                BABYLON.Tools.Error('MeshFactory.instance:  module (' + moduleName + ') not loaded');
            return ret;
        };
        MeshFactory.MODULES = new Array();
        return MeshFactory;
    }());
    TOWER_OF_BABEL.MeshFactory = MeshFactory;
})(TOWER_OF_BABEL || (TOWER_OF_BABEL = {}));
