var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BABYLON;
(function (BABYLON) {
    /**
     * The base class for all implementation of a Primitive Collision Manager
     */
    var PrimitiveCollisionManagerBase = (function () {
        function PrimitiveCollisionManagerBase(owner) {
            this._owner = owner;
        }
        PrimitiveCollisionManagerBase.allocBasicPCM = function (owner, enableBorders) {
            return new BasicPrimitiveCollisionManager(owner, enableBorders);
        };
        return PrimitiveCollisionManagerBase;
    }());
    BABYLON.PrimitiveCollisionManagerBase = PrimitiveCollisionManagerBase;
    /**
     * Base class of an Actor
     */
    var ActorInfoBase = (function () {
        function ActorInfoBase() {
        }
        return ActorInfoBase;
    }());
    BABYLON.ActorInfoBase = ActorInfoBase;
    var ActorInfo = (function (_super) {
        __extends(ActorInfo, _super);
        function ActorInfo(owner, actor, deep) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            _this.prim = actor;
            _this.flags = 0;
            _this.presentInClusters = new BABYLON.StringDictionary();
            _this.intersectWith = new BABYLON.ObservableStringDictionary(false);
            _this.setFlags((deep ? ActorInfo.flagDeep : 0) | ActorInfo.flagDirty);
            var bi = (deep ? actor.boundingInfo : actor.levelBoundingInfo);
            // Dirty Actor if its WorldAABB changed
            bi.worldAABBDirtyObservable.add(function (e, d) {
                _this.owner.actorDirty(_this);
            });
            // Dirty Actor if it's getting enabled/disabled
            actor.propertyChanged.add(function (e, d) {
                if (d.mask === -1) {
                    return;
                }
                _this.setFlagsValue(ActorInfo.flagEnabled, e.newValue === true);
                _this.owner.actorDirty(_this);
            }, BABYLON.Prim2DBase.isVisibleProperty.flagId);
            return _this;
        }
        ActorInfo.prototype.setFlags = function (flags) {
            this.flags |= flags;
        };
        ActorInfo.prototype.clearFlags = function (flags) {
            this.flags &= ~flags;
        };
        ActorInfo.prototype.isAllFlagsSet = function (flags) {
            return (this.flags & flags) === flags;
        };
        ActorInfo.prototype.isSomeFlagsSet = function (flags) {
            return (this.flags & flags) !== 0;
        };
        ActorInfo.prototype.setFlagsValue = function (flags, value) {
            if (value) {
                this.flags |= flags;
            }
            else {
                this.flags &= ~flags;
            }
        };
        Object.defineProperty(ActorInfo.prototype, "worldAABB", {
            get: function () {
                return (this.isSomeFlagsSet(ActorInfo.flagDeep) ? this.prim.boundingInfo : this.prim.levelBoundingInfo).worldAABB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActorInfo.prototype, "isEnabled", {
            get: function () {
                return this.isSomeFlagsSet(ActorInfo.flagEnabled);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActorInfo.prototype, "isDeep", {
            get: function () {
                return this.isSomeFlagsSet(ActorInfo.flagDeep);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActorInfo.prototype, "isDirty", {
            get: function () {
                return this.isSomeFlagsSet(ActorInfo.flagDirty);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActorInfo.prototype, "isRemoved", {
            get: function () {
                return this.isSomeFlagsSet(ActorInfo.flagRemoved);
            },
            enumerable: true,
            configurable: true
        });
        return ActorInfo;
    }(ActorInfoBase));
    ActorInfo.flagDeep = 0x0001; // set if the actor boundingInfo must be used instead of the levelBoundingInfo
    ActorInfo.flagEnabled = 0x0002; // set if the actor is enabled and should be considered for intersection tests
    ActorInfo.flagDirty = 0x0004; // set if the actor's AABB is dirty
    ActorInfo.flagRemoved = 0x0008; // set if the actor was removed from the PCM
    var ClusterInfo = (function () {
        function ClusterInfo() {
            this.actors = new BABYLON.StringDictionary();
        }
        ClusterInfo.prototype.clear = function () {
            this.actors.clear();
        };
        return ClusterInfo;
    }());
    var BasicPrimitiveCollisionManager = (function (_super) {
        __extends(BasicPrimitiveCollisionManager, _super);
        function BasicPrimitiveCollisionManager(owner, enableBorders) {
            var _this = _super.call(this, owner) || this;
            _this._actors = new BABYLON.StringDictionary();
            _this._dirtyActors = new BABYLON.StringDictionary();
            _this._clusters = null;
            _this._maxActorByCluster = 0;
            _this._AABBRenderPrim = null;
            _this._canvasSize = BABYLON.Size.Zero();
            _this._ClusterRenderPrim = null;
            _this._debugTextBackground = null;
            _this._clusterDirty = true;
            _this._clusterSize = new BABYLON.Size(2, 2);
            _this._clusterStep = BABYLON.Vector2.Zero();
            _this._lastClusterResizeCounter = 0;
            _this._freeClusters = new Array();
            _this._enableBorder = enableBorders;
            _this._debugUpdateOpCount = new BABYLON.PerfCounter();
            _this._debugUpdateTime = new BABYLON.PerfCounter();
            _this._intersectedActors = new BABYLON.ObservableStringDictionary(false);
            _this._borderIntersecteddActors = new Array(4);
            for (var j = 0; j < 4; j++) {
                _this._borderIntersecteddActors[j] = new BABYLON.ObservableStringDictionary(false);
            }
            var flagId = BABYLON.Canvas2D.actualSizeProperty.flagId;
            if (!BasicPrimitiveCollisionManager.WAABBCorners) {
                BasicPrimitiveCollisionManager.WAABBCorners = new Array(4);
                for (var i = 0; i < 4; i++) {
                    BasicPrimitiveCollisionManager.WAABBCorners[i] = BABYLON.Vector2.Zero();
                }
                BasicPrimitiveCollisionManager.WAABBCornersCluster = new Array(4);
                for (var i = 0; i < 4; i++) {
                    BasicPrimitiveCollisionManager.WAABBCornersCluster[i] = BABYLON.Vector2.Zero();
                }
            }
            owner.propertyChanged.add(function (e, d) {
                if (d.mask === -1) {
                    return;
                }
                _this._clusterDirty = true;
                console.log("canvas size changed");
            }, flagId);
            _this.debugRenderAABB = false;
            _this.debugRenderClusters = false;
            _this.debugStats = false;
            return _this;
        }
        BasicPrimitiveCollisionManager.prototype._addActor = function (actor, deep) {
            var _this = this;
            return this._actors.getOrAddWithFactory(actor.uid, function () {
                var ai = new ActorInfo(_this, actor, deep);
                _this.actorDirty(ai);
                return ai;
            });
        };
        BasicPrimitiveCollisionManager.prototype._removeActor = function (actor) {
            var ai = this._actors.getAndRemove(actor.uid);
            ai.setFlags(ActorInfo.flagRemoved);
            this.actorDirty(ai);
        };
        BasicPrimitiveCollisionManager.prototype.actorDirty = function (actor) {
            actor.setFlags(ActorInfo.flagDirty);
            this._dirtyActors.add(actor.prim.uid, actor);
        };
        BasicPrimitiveCollisionManager.prototype._update = function () {
            this._canvasSize.copyFrom(this._owner.actualSize);
            // Should we update the WireFrame2D Primitive that displays the WorldAABB ?
            if (this.debugRenderAABB) {
                if (this._dirtyActors.count > 0 || this._debugRenderAABBDirty) {
                    this._updateAABBDisplay();
                }
            }
            if (this._AABBRenderPrim) {
                this._AABBRenderPrim.levelVisible = this.debugRenderAABB;
            }
            var cw = this._clusterSize.width;
            var ch = this._clusterSize.height;
            // Check for Cluster resize
            if (((this._clusterSize.width < 16 && this._clusterSize.height < 16 && this._maxActorByCluster >= 10) ||
                (this._clusterSize.width > 2 && this._clusterSize.height > 2 && this._maxActorByCluster <= 7)) &&
                this._lastClusterResizeCounter > 100) {
                if (this._maxActorByCluster >= 10) {
                    ++cw;
                    ++ch;
                }
                else {
                    --cw;
                    --ch;
                }
                console.log("Change cluster size to " + cw + ":" + ch + ", max actor " + this._maxActorByCluster);
                this._clusterDirty = true;
            }
            // Should we update the WireFrame2D Primitive that displays the clusters
            if (this.debugRenderClusters && this._clusterDirty) {
                this._updateClusterDisplay(cw, ch);
            }
            if (this._ClusterRenderPrim) {
                this._ClusterRenderPrim.levelVisible = this.debugRenderClusters;
            }
            var updateStats = this.debugStats && (this._dirtyActors.count > 0 || this._clusterDirty);
            this._debugUpdateTime.beginMonitoring();
            // If the Cluster Size changed: rebuild it and add all actors. Otherwise add only new (dirty) actors
            if (this._clusterDirty) {
                this._initializeCluster(cw, ch);
                this._rebuildAllActors();
            }
            else {
                this._rebuildDirtyActors();
                ++this._lastClusterResizeCounter;
            }
            // Proceed to the collision detection between primitives
            this._collisionDetection();
            this._debugUpdateTime.endMonitoring();
            if (updateStats) {
                this._updateDebugStats();
            }
            if (this._debugTextBackground) {
                this._debugTextBackground.levelVisible = updateStats;
            }
            // Reset the dirty actor list: everything is processed
            this._dirtyActors.clear();
        };
        Object.defineProperty(BasicPrimitiveCollisionManager.prototype, "debugRenderAABB", {
            /**
             * Renders the World AABB of all Actors
             */
            get: function () {
                return this._debugRenderAABB;
            },
            set: function (val) {
                if (this._debugRenderAABB === val) {
                    return;
                }
                this._debugRenderAABB = val;
                this._debugRenderAABBDirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicPrimitiveCollisionManager.prototype, "intersectedActors", {
            get: function () {
                return this._intersectedActors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicPrimitiveCollisionManager.prototype, "leftBorderIntersectedActors", {
            get: function () {
                return this._borderIntersecteddActors[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicPrimitiveCollisionManager.prototype, "bottomBorderIntersectedActors", {
            get: function () {
                return this._borderIntersecteddActors[1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicPrimitiveCollisionManager.prototype, "rightBorderIntersectedActors", {
            get: function () {
                return this._borderIntersecteddActors[2];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicPrimitiveCollisionManager.prototype, "topBorderIntersectedActors", {
            get: function () {
                return this._borderIntersecteddActors[3];
            },
            enumerable: true,
            configurable: true
        });
        BasicPrimitiveCollisionManager.prototype._initializeCluster = function (countW, countH) {
            // Check for free
            if (this._clusters) {
                for (var w = 0; w < this._clusterSize.height; w++) {
                    for (var h = 0; h < this._clusterSize.width; h++) {
                        this._freeClusterInfo(this._clusters[w][h]);
                    }
                }
            }
            // Allocate
            this._clusterSize.copyFromFloats(countW, countH);
            this._clusters = [];
            for (var w = 0; w < this._clusterSize.height; w++) {
                this._clusters[w] = [];
                for (var h = 0; h < this._clusterSize.width; h++) {
                    var ci = this._allocClusterInfo();
                    this._clusters[w][h] = ci;
                }
            }
            this._clusterStep.copyFromFloats(this._owner.actualWidth / countW, this._owner.actualHeight / countH);
            this._maxActorByCluster = 0;
            this._lastClusterResizeCounter = 0;
            this._clusterDirty = false;
        };
        BasicPrimitiveCollisionManager.prototype._rebuildAllActors = function () {
            var _this = this;
            this._actors.forEach(function (k, ai) {
                _this._processActor(ai);
            });
        };
        BasicPrimitiveCollisionManager.prototype._rebuildDirtyActors = function () {
            var _this = this;
            this._dirtyActors.forEach(function (k, ai) {
                _this._processActor(ai);
            });
        };
        BasicPrimitiveCollisionManager.prototype._processActor = function (actor) {
            var _this = this;
            // Check if the actor is being disabled or removed
            if (!actor.isEnabled || actor.isRemoved) {
                actor.presentInClusters.forEach(function (k, ci) {
                    ci.actors.remove(actor.prim.uid);
                });
                actor.presentInClusters.clear();
                return;
            }
            var wab = actor.worldAABB;
            // Build the worldAABB corners
            var wac = BasicPrimitiveCollisionManager.WAABBCorners;
            wac[0].copyFromFloats(wab.x, wab.y); // Bottom/Left
            wac[1].copyFromFloats(wab.z, wab.y); // Bottom/Right
            wac[2].copyFromFloats(wab.z, wab.w); // Top/Right
            wac[3].copyFromFloats(wab.x, wab.w); // Top/Left
            var cs = this._clusterStep;
            var wacc = BasicPrimitiveCollisionManager.WAABBCornersCluster;
            for (var i = 0; i < 4; i++) {
                var p = wac[i];
                var cx = (p.x - (p.x % cs.x)) / cs.x;
                var cy = (p.y - (p.y % cs.y)) / cs.y;
                wacc[i].copyFromFloats(Math.floor(cx), Math.floor(cy));
            }
            var opCount = 0;
            var totalClusters = 0;
            var newCI = new Array();
            var sx = Math.max(0, wacc[0].x); // Start Cluster X
            var sy = Math.max(0, wacc[0].y); // Start Cluster Y
            var ex = Math.min(this._clusterSize.width - 1, wacc[2].x); // End Cluster X
            var ey = Math.min(this._clusterSize.height - 1, wacc[2].y); // End Cluster Y
            if (this._enableBorder) {
                if (wac[0].x < 0) {
                    this._borderIntersecteddActors[0].add(actor.prim.uid, actor.prim);
                }
                else {
                    this._borderIntersecteddActors[0].remove(actor.prim.uid);
                }
                if (wac[0].y < 0) {
                    this._borderIntersecteddActors[1].add(actor.prim.uid, actor.prim);
                }
                else {
                    this._borderIntersecteddActors[1].remove(actor.prim.uid);
                }
                if (wac[2].x >= this._canvasSize.width) {
                    this._borderIntersecteddActors[2].add(actor.prim.uid, actor.prim);
                }
                else {
                    this._borderIntersecteddActors[2].remove(actor.prim.uid);
                }
                if (wac[2].y >= this._canvasSize.height) {
                    this._borderIntersecteddActors[3].add(actor.prim.uid, actor.prim);
                }
                else {
                    this._borderIntersecteddActors[3].remove(actor.prim.uid);
                }
            }
            for (var y = sy; y <= ey; y++) {
                var _loop_1 = function (x) {
                    var k = x + ":" + y;
                    var cx = x, cy = y;
                    var ci = actor.presentInClusters.getOrAddWithFactory(k, function (k) {
                        var nci = _this._getCluster(cx, cy);
                        nci.actors.add(actor.prim.uid, actor);
                        _this._maxActorByCluster = Math.max(_this._maxActorByCluster, nci.actors.count);
                        ++opCount;
                        ++totalClusters;
                        return nci;
                    });
                    newCI.push(ci);
                };
                for (var x = sx; x <= ex; x++) {
                    _loop_1(x);
                }
            }
            // Check if there were no change
            if (opCount === 0 && actor.presentInClusters.count === totalClusters) {
                return;
            }
            // Build the array of the cluster where the actor is no longer in
            var clusterToRemove = new Array();
            actor.presentInClusters.forEach(function (k, ci) {
                if (newCI.indexOf(ci) === -1) {
                    clusterToRemove.push(k);
                    // remove the primitive from the Cluster Info object
                    ci.actors.remove(actor.prim.uid);
                }
            });
            // Remove these clusters from the actor's dictionary
            for (var _i = 0, clusterToRemove_1 = clusterToRemove; _i < clusterToRemove_1.length; _i++) {
                var key = clusterToRemove_1[_i];
                actor.presentInClusters.remove(key);
            }
        };
        // The algorithm is simple, we have previously partitioned the Actors in the Clusters: each actor has a list of the Cluster(s) it's inside.
        // Then for a given Actor that is dirty we evaluate the intersection with all the other actors present in the same Cluster(s)
        // So it's basically O(n²), BUT only inside a Cluster and only for dirty Actors.
        BasicPrimitiveCollisionManager.prototype._collisionDetection = function () {
            var _this = this;
            var hash = BasicPrimitiveCollisionManager.CandidatesActors;
            var prev = BasicPrimitiveCollisionManager.PreviousIntersections;
            var opCount = 0;
            this._dirtyActors.forEach(function (k1, ai1) {
                ++opCount;
                // Build the list of candidates
                hash.clear();
                ai1.presentInClusters.forEach(function (k, ci) {
                    ++opCount;
                    ci.actors.forEach(function (k, v) { return hash.add(k, v); });
                });
                var wab1 = ai1.worldAABB;
                // Save the previous intersections
                prev.clear();
                prev.copyFrom(ai1.intersectWith);
                ai1.intersectWith.clear();
                // For each candidate
                hash.forEach(function (k2, ai2) {
                    ++opCount;
                    // Check if we're testing against itself
                    if (k1 === k2) {
                        return;
                    }
                    var wab2 = ai2.worldAABB;
                    if (wab2.z >= wab1.x && wab2.x <= wab1.z && wab2.w >= wab1.y && wab2.y <= wab1.w) {
                        if (ai1.prim.intersectOtherPrim(ai2.prim)) {
                            ++opCount;
                            ai1.intersectWith.add(k2, ai2);
                            if (k1 < k2) {
                                _this._intersectedActors.add(k1 + ";" + k2, { a: ai1.prim, b: ai2.prim });
                            }
                            else {
                                _this._intersectedActors.add(k2 + ";" + k1, { a: ai2.prim, b: ai1.prim });
                            }
                        }
                    }
                });
                // Check and remove the associations that no longer exist in the main intersection list
                prev.forEach(function (k, ai) {
                    if (!ai1.intersectWith.contains(k)) {
                        ++opCount;
                        _this._intersectedActors.remove((k < k1 ? k : k1) + ";" + (k < k1 ? k1 : k));
                    }
                });
            });
            this._debugUpdateOpCount.fetchNewFrame();
            this._debugUpdateOpCount.addCount(opCount, true);
        };
        BasicPrimitiveCollisionManager.prototype._getCluster = function (x, y) {
            return this._clusters[x][y];
        };
        BasicPrimitiveCollisionManager.prototype._updateDebugStats = function () {
            var format = function (v) { return (Math.round(v * 100) / 100).toString(); };
            var txt = "Primitive Collision Stats\n" +
                (" - PCM Execution Time: " + format(this._debugUpdateTime.lastSecAverage) + "ms\n") +
                (" - Operation Count: " + format(this._debugUpdateOpCount.current) + ", (avg:" + format(this._debugUpdateOpCount.lastSecAverage) + ", t:" + format(this._debugUpdateOpCount.total) + ")\n") +
                (" - Max Actor per Cluster: " + this._maxActorByCluster + "\n") +
                (" - Intersections count: " + this.intersectedActors.count);
            if (!this._debugTextBackground) {
                this._debugTextBackground = new BABYLON.Rectangle2D({
                    id: "###DEBUG PMC STATS###", parent: this._owner, marginAlignment: "h: left, v: top", fill: "#C0404080", padding: "10", margin: "10", roundRadius: 10, children: [
                        new BABYLON.Text2D(txt, { id: "###DEBUG PMC TEXT###", fontName: "12pt Lucida Console" })
                    ]
                });
            }
            else {
                this._debugTextBackground.levelVisible = true;
                var text2d = this._debugTextBackground.children[0];
                text2d.text = txt;
            }
        };
        BasicPrimitiveCollisionManager.prototype._updateAABBDisplay = function () {
            var g = new BABYLON.WireFrameGroup2D("main", new BABYLON.Color4(0.5, 0.8, 1.0, 1.0));
            var v = BABYLON.Vector2.Zero();
            this._actors.forEach(function (k, ai) {
                if (ai.isEnabled) {
                    var ab = ai.worldAABB;
                    v.x = ab.x;
                    v.y = ab.y;
                    g.startLineStrip(v);
                    v.x = ab.z;
                    g.pushVertex(v);
                    v.y = ab.w;
                    g.pushVertex(v);
                    v.x = ab.x;
                    g.pushVertex(v);
                    v.y = ab.y;
                    g.endLineStrip(v);
                }
            });
            if (!this._AABBRenderPrim) {
                this._AABBRenderPrim = new BABYLON.WireFrame2D([g], { parent: this._owner, alignToPixel: true, id: "###DEBUG PCM AABB###" });
            }
            else {
                this._AABBRenderPrim.wireFrameGroups.set("main", g);
                this._AABBRenderPrim.wireFrameGroupsDirty();
            }
            this._debugRenderAABBDirty = false;
        };
        BasicPrimitiveCollisionManager.prototype._updateClusterDisplay = function (cw, ch) {
            var g = new BABYLON.WireFrameGroup2D("main", new BABYLON.Color4(0.8, 0.1, 0.5, 1.0));
            var v1 = BABYLON.Vector2.Zero();
            var v2 = BABYLON.Vector2.Zero();
            // Vertical lines
            var step = (this._owner.actualWidth - 1) / cw;
            v1.y = 0;
            v2.y = this._owner.actualHeight;
            for (var x = 0; x <= cw; x++) {
                g.pushVertex(v1);
                g.pushVertex(v2);
                v1.x += step;
                v2.x += step;
            }
            // Horizontal lines
            step = (this._owner.actualHeight - 1) / ch;
            v1.x = v1.y = v2.y = 0;
            v2.x = this._owner.actualWidth;
            for (var y = 0; y <= ch; y++) {
                g.pushVertex(v1);
                g.pushVertex(v2);
                v1.y += step;
                v2.y += step;
            }
            if (!this._ClusterRenderPrim) {
                this._ClusterRenderPrim = new BABYLON.WireFrame2D([g], { parent: this._owner, alignToPixel: true, id: "###DEBUG PCM Clusters###" });
            }
            else {
                this._ClusterRenderPrim.wireFrameGroups.set("main", g);
                this._ClusterRenderPrim.wireFrameGroupsDirty();
            }
        };
        // Basically: we don't want to spend our time playing with the GC each time the Cluster Array is rebuilt, so we keep a list of available
        //  ClusterInfo object and we have two method to allocate/free them. This way we always deal with the same objects.
        // The free array never shrink, always grows...For the better...and the worst!
        BasicPrimitiveCollisionManager.prototype._allocClusterInfo = function () {
            if (this._freeClusters.length === 0) {
                for (var i = 0; i < 8; i++) {
                    this._freeClusters.push(new ClusterInfo());
                }
            }
            return this._freeClusters.pop();
        };
        BasicPrimitiveCollisionManager.prototype._freeClusterInfo = function (ci) {
            ci.clear();
            this._freeClusters.push(ci);
        };
        return BasicPrimitiveCollisionManager;
    }(PrimitiveCollisionManagerBase));
    BasicPrimitiveCollisionManager.WAABBCorners = null;
    BasicPrimitiveCollisionManager.WAABBCornersCluster = null;
    BasicPrimitiveCollisionManager.CandidatesActors = new BABYLON.StringDictionary();
    BasicPrimitiveCollisionManager.PreviousIntersections = new BABYLON.StringDictionary();
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.primitiveCollisionManager.js.map
