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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BABYLON;
(function (BABYLON) {
    // This class contains data that lifetime is bounding to the Babylon Engine object
    var Canvas2DEngineBoundData = (function () {
        function Canvas2DEngineBoundData() {
            this._modelCache = new BABYLON.StringDictionary();
        }
        Canvas2DEngineBoundData.prototype.GetOrAddModelCache = function (key, factory) {
            return this._modelCache.getOrAddWithFactory(key, factory);
        };
        Canvas2DEngineBoundData.prototype.DisposeModelRenderCache = function (modelRenderCache) {
            if (!modelRenderCache.isDisposed) {
                return false;
            }
            this._modelCache.remove(modelRenderCache.modelKey);
            return true;
        };
        return Canvas2DEngineBoundData;
    }());
    BABYLON.Canvas2DEngineBoundData = Canvas2DEngineBoundData;
    var Canvas2D = Canvas2D_1 = (function (_super) {
        __extends(Canvas2D, _super);
        function Canvas2D(scene, settings) {
            var _this = _super.call(this, settings) || this;
            /**
             * If you set your own WorldSpaceNode to display the Canvas2D you have to provide your own implementation of this method which computes the local position in the Canvas based on the given 3D World one.
             * Beware that you have to take under consideration the origin and unitScaleFactor in your calculations! Good luck!
             */
            _this.worldSpaceToNodeLocal = function (worldPos) {
                var node = _this._worldSpaceNode;
                if (!node) {
                    return;
                }
                var mtx = node.getWorldMatrix().clone();
                mtx.invert();
                var usf = _this.unitScaleFactor;
                var v = BABYLON.Vector3.TransformCoordinates(worldPos, mtx);
                var res = new BABYLON.Vector2(v.x, v.y);
                var size = _this.actualSize;
                res.x += (size.width / usf) * 0.5; // res is centered, make it relative to bottom/left
                res.y += (size.height / usf) * 0.5;
                res.x *= usf; // multiply by the unitScaleFactor, which defines if the canvas is nth time bigger than the original world plane
                res.y *= usf;
                return res;
            };
            /**
             * If you use a custom WorldSpaceCanvasNode you have to override this property to update the UV of your object to reflect the changes due to a resizing of the cached bitmap
             */
            _this.worldSpaceCacheChanged = function () {
                var plane = _this.worldSpaceCanvasNode;
                var vd = BABYLON.VertexData.ExtractFromMesh(plane); //new VertexData();
                vd.uvs = new Float32Array(8);
                var material = plane.material;
                var tex = _this._renderableData._cacheTexture;
                if (material.diffuseTexture !== tex) {
                    material.diffuseTexture = tex;
                    tex.hasAlpha = true;
                }
                var nodeuv = _this._renderableData._cacheNodeUVs;
                for (var i = 0; i < 4; i++) {
                    vd.uvs[i * 2 + 0] = nodeuv[i].x;
                    vd.uvs[i * 2 + 1] = nodeuv[i].y;
                }
                vd.applyToMesh(plane);
            };
            _this._notifDebugMode = false;
            /**
             * Instanced Array will be create if there's at least this number of parts/prim that can fit into it
             */
            _this.minPartCountToUseInstancedArray = 5;
            _this._mapCounter = 0;
            _this._cachedCanvasGroup = null;
            _this._renderingGroupObserver = null;
            _this._beforeRenderObserver = null;
            _this._afterRenderObserver = null;
            _this._profileInfoText = null;
            BABYLON.Prim2DBase._isCanvasInit = false;
            if (!settings) {
                settings = {};
            }
            if (_this._cachingStrategy !== Canvas2D_1.CACHESTRATEGY_TOPLEVELGROUPS) {
                _this._background = new BABYLON.Rectangle2D({ parent: _this, id: "###CANVAS BACKGROUND###", size: settings.size }); //TODO CHECK when size is null
                _this._background.zOrder = 1.0;
                _this._background.isPickable = false;
                _this._background.origin = BABYLON.Vector2.Zero();
                _this._background.levelVisible = false;
                if (settings.backgroundRoundRadius != null) {
                    _this.backgroundRoundRadius = settings.backgroundRoundRadius;
                }
                if (settings.backgroundBorder != null) {
                    if (typeof (settings.backgroundBorder) === "string") {
                        _this.backgroundBorder = Canvas2D_1.GetBrushFromString(settings.backgroundBorder);
                    }
                    else {
                        _this.backgroundBorder = settings.backgroundBorder;
                    }
                }
                if (settings.backgroundBorderThickNess != null) {
                    _this.backgroundBorderThickness = settings.backgroundBorderThickNess;
                }
                if (settings.backgroundFill != null) {
                    if (typeof (settings.backgroundFill) === "string") {
                        _this.backgroundFill = Canvas2D_1.GetBrushFromString(settings.backgroundFill);
                    }
                    else {
                        _this.backgroundFill = settings.backgroundFill;
                    }
                }
                // Put a handler to resize the background whenever the canvas is resizing
                _this.propertyChanged.add(function (e, s) {
                    if (e.propertyName === "size") {
                        _this._background.size = _this.size;
                    }
                }, BABYLON.Group2D.sizeProperty.flagId);
                _this._background._patchHierarchy(_this);
            }
            var engine = scene.getEngine();
            _this.__engineData = engine.getOrAddExternalDataWithFactory("__BJSCANVAS2D__", function (k) { return new Canvas2DEngineBoundData(); });
            _this._primPointerInfo = new BABYLON.PrimitivePointerInfo();
            _this._capturedPointers = new BABYLON.StringDictionary();
            _this._pickStartingPosition = BABYLON.Vector2.Zero();
            _this._hierarchyLevelMaxSiblingCount = 50;
            _this._hierarchyDepth = 0;
            _this._zOrder = 0;
            _this._zMax = 1;
            _this._scene = scene;
            _this._engine = engine;
            _this._renderingSize = new BABYLON.Size(0, 0);
            _this._curHWScale = 0;
            _this._canvasLevelScale = new BABYLON.Vector2(1, 1);
            _this._designSize = settings.designSize || null;
            _this._designUseHorizAxis = settings.designUseHorizAxis === true;
            if (!_this._trackedGroups) {
                _this._trackedGroups = new Array();
            }
            _this._maxAdaptiveWorldSpaceCanvasSize = null;
            _this._groupCacheMaps = new BABYLON.StringDictionary();
            _this._patchHierarchy(_this);
            var enableInteraction = (settings.enableInteraction == null) ? true : settings.enableInteraction;
            _this._fitRenderingDevice = !settings.size;
            if (!settings.size) {
                settings.size = new BABYLON.Size(engine.getRenderWidth(), engine.getRenderHeight());
            }
            // Register scene dispose to also dispose the canvas when it'll happens
            scene.onDisposeObservable.add(function (d, s) {
                _this.dispose();
            });
            if (_this._isScreenSpace) {
                if (settings.renderingPhase) {
                    if (!settings.renderingPhase.camera || settings.renderingPhase.renderingGroupID == null) {
                        throw Error("You have to specify a valid camera and renderingGroup");
                    }
                    _this._renderingGroupObserver = _this._scene.onRenderingGroupObservable.add(function (e, s) {
                        if ((_this._scene.activeCamera === settings.renderingPhase.camera) && (e.renderStage === BABYLON.RenderingGroupInfo.STAGE_POSTTRANSPARENT)) {
                            _this._engine.clear(null, false, true, true);
                            BABYLON.C2DLogging._startFrameRender();
                            _this._render();
                            BABYLON.C2DLogging._endFrameRender();
                        }
                    }, Math.pow(2, settings.renderingPhase.renderingGroupID));
                }
                else {
                    _this._afterRenderObserver = _this._scene.onAfterRenderObservable.add(function (d, s) {
                        _this._engine.clear(null, false, true, true);
                        BABYLON.C2DLogging._startFrameRender();
                        _this._render();
                        BABYLON.C2DLogging._endFrameRender();
                    });
                }
            }
            else {
                _this._beforeRenderObserver = _this._scene.onBeforeRenderObservable.add(function (d, s) {
                    BABYLON.C2DLogging._startFrameRender();
                    _this._render();
                    BABYLON.C2DLogging._endFrameRender();
                });
            }
            _this._supprtInstancedArray = _this._engine.getCaps().instancedArrays !== null;
            //this._supprtInstancedArray = false; // TODO REMOVE!!!
            // Setup the canvas for interaction (or not)
            _this._setupInteraction(enableInteraction);
            // Initialize the Primitive Collision Manager
            if (settings.enableCollisionManager) {
                var enableBorders = settings.collisionManagerUseBorders;
                _this._primitiveCollisionManager = (settings.customCollisionManager == null) ? BABYLON.PrimitiveCollisionManagerBase.allocBasicPCM(_this, enableBorders) : settings.customCollisionManager(_this, enableBorders);
            }
            // Register this instance
            Canvas2D_1._INSTANCES.push(_this);
            return _this;
        }
        Object.defineProperty(Canvas2D.prototype, "drawCallsOpaqueCounter", {
            get: function () {
                if (!this._drawCallsOpaqueCounter) {
                    this._drawCallsOpaqueCounter = new BABYLON.PerfCounter();
                }
                return this._drawCallsOpaqueCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "drawCallsAlphaTestCounter", {
            get: function () {
                if (!this._drawCallsAlphaTestCounter) {
                    this._drawCallsAlphaTestCounter = new BABYLON.PerfCounter();
                }
                return this._drawCallsAlphaTestCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "drawCallsTransparentCounter", {
            get: function () {
                if (!this._drawCallsTransparentCounter) {
                    this._drawCallsTransparentCounter = new BABYLON.PerfCounter();
                }
                return this._drawCallsTransparentCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "groupRenderCounter", {
            get: function () {
                if (!this._groupRenderCounter) {
                    this._groupRenderCounter = new BABYLON.PerfCounter();
                }
                return this._groupRenderCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "updateTransparentDataCounter", {
            get: function () {
                if (!this._updateTransparentDataCounter) {
                    this._updateTransparentDataCounter = new BABYLON.PerfCounter();
                }
                return this._updateTransparentDataCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "updateCachedStateCounter", {
            get: function () {
                if (!this._updateCachedStateCounter) {
                    this._updateCachedStateCounter = new BABYLON.PerfCounter();
                }
                return this._updateCachedStateCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "updateLayoutCounter", {
            get: function () {
                if (!this._updateLayoutCounter) {
                    this._updateLayoutCounter = new BABYLON.PerfCounter();
                }
                return this._updateLayoutCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "updatePositioningCounter", {
            get: function () {
                if (!this._updatePositioningCounter) {
                    this._updatePositioningCounter = new BABYLON.PerfCounter();
                }
                return this._updatePositioningCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "updateLocalTransformCounter", {
            get: function () {
                if (!this._updateLocalTransformCounter) {
                    this._updateLocalTransformCounter = new BABYLON.PerfCounter();
                }
                return this._updateLocalTransformCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "updateGlobalTransformCounter", {
            get: function () {
                if (!this._updateGlobalTransformCounter) {
                    this._updateGlobalTransformCounter = new BABYLON.PerfCounter();
                }
                return this._updateGlobalTransformCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "boundingInfoRecomputeCounter", {
            get: function () {
                if (!this._boundingInfoRecomputeCounter) {
                    this._boundingInfoRecomputeCounter = new BABYLON.PerfCounter();
                }
                return this._boundingInfoRecomputeCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "layoutBoundingInfoUpdateCounter", {
            get: function () {
                if (!this._layoutBoundingInfoUpdateCounter) {
                    this._layoutBoundingInfoUpdateCounter = new BABYLON.PerfCounter();
                }
                return this._layoutBoundingInfoUpdateCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "canvasRenderTimeCounter", {
            get: function () {
                if (!this._canvasRenderTimeCounter) {
                    this._canvasRenderTimeCounter = new BABYLON.PerfCounter();
                }
                return this._canvasRenderTimeCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D, "instances", {
            get: function () {
                return Canvas2D_1._INSTANCES;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "primitiveCollisionManager", {
            get: function () {
                return this._primitiveCollisionManager;
            },
            enumerable: true,
            configurable: true
        });
        Canvas2D.prototype._canvasPreInit = function (settings) {
            var cachingStrategy = (settings.cachingStrategy == null) ? Canvas2D_1.CACHESTRATEGY_DONTCACHE : settings.cachingStrategy;
            this._cachingStrategy = cachingStrategy;
            this._isScreenSpace = (settings.isScreenSpace == null) ? true : settings.isScreenSpace;
            this._hierarchyDepth = 0;
        };
        Canvas2D.prototype._setupInteraction = function (enable) {
            var _this = this;
            // No change detection
            if (enable === this._interactionEnabled) {
                return;
            }
            // Set the new state
            this._interactionEnabled = enable;
            // ScreenSpace mode
            if (this._isScreenSpace) {
                // Disable interaction
                if (!enable) {
                    if (this._scenePrePointerObserver) {
                        this.scene.onPrePointerObservable.remove(this._scenePrePointerObserver);
                        this._scenePrePointerObserver = null;
                    }
                    return;
                }
                // Enable Interaction
                // Register the observable
                this._scenePrePointerObserver = this.scene.onPrePointerObservable.add(function (e, s) {
                    if (_this.isVisible === false) {
                        return;
                    }
                    _this._handlePointerEventForInteraction(e, e.localPosition, s);
                });
            }
            else {
                var scene = this.scene;
                if (enable) {
                    scene.constantlyUpdateMeshUnderPointer = true;
                    this._scenePointerObserver = scene.onPointerObservable.add(function (e, s) {
                        if (_this.isVisible === false) {
                            return;
                        }
                        if (e.pickInfo.hit && e.pickInfo.pickedMesh === _this._worldSpaceNode && _this.worldSpaceToNodeLocal) {
                            var localPos = _this.worldSpaceToNodeLocal(e.pickInfo.pickedPoint);
                            _this._handlePointerEventForInteraction(e, localPos, s);
                        }
                        else if (_this._actualIntersectionList && _this._actualIntersectionList.length > 0) {
                            _this._handlePointerEventForInteraction(e, null, s);
                        }
                    });
                }
                else {
                    if (this._scenePointerObserver) {
                        this.scene.onPointerObservable.remove(this._scenePointerObserver);
                        this._scenePointerObserver = null;
                    }
                }
            }
        };
        /**
         * Internal method, you should use the Prim2DBase version instead
         */
        Canvas2D.prototype._setPointerCapture = function (pointerId, primitive) {
            if (this.isPointerCaptured(pointerId)) {
                return false;
            }
            // Try to capture the pointer on the HTML side
            try {
                this.engine.getRenderingCanvas().setPointerCapture(pointerId);
            }
            catch (e) {
                //Nothing to do with the error. Execution will continue.
            }
            this._primPointerInfo.updateRelatedTarget(primitive, BABYLON.Vector2.Zero());
            this._bubbleNotifyPrimPointerObserver(primitive, BABYLON.PrimitivePointerInfo.PointerGotCapture, null);
            this._capturedPointers.add(pointerId.toString(), primitive);
            return true;
        };
        /**
         * Internal method, you should use the Prim2DBase version instead
         */
        Canvas2D.prototype._releasePointerCapture = function (pointerId, primitive) {
            if (this._capturedPointers.get(pointerId.toString()) !== primitive) {
                return false;
            }
            // Try to release the pointer on the HTML side
            try {
                this.engine.getRenderingCanvas().releasePointerCapture(pointerId);
            }
            catch (e) {
                //Nothing to do with the error. Execution will continue.
            }
            this._primPointerInfo.updateRelatedTarget(primitive, BABYLON.Vector2.Zero());
            this._bubbleNotifyPrimPointerObserver(primitive, BABYLON.PrimitivePointerInfo.PointerLostCapture, null);
            this._capturedPointers.remove(pointerId.toString());
            return true;
        };
        /**
         * Determine if the given pointer is captured or not
         * @param pointerId the Id of the pointer
         * @return true if it's captured, false otherwise
         */
        Canvas2D.prototype.isPointerCaptured = function (pointerId) {
            return this._capturedPointers.contains(pointerId.toString());
        };
        Canvas2D.prototype.getCapturedPrimitive = function (pointerId) {
            // Avoid unnecessary lookup
            if (this._capturedPointers.count === 0) {
                return null;
            }
            return this._capturedPointers.get(pointerId.toString());
        };
        Canvas2D.prototype._handlePointerEventForInteraction = function (eventData, localPosition, eventState) {
            // Dispose check
            if (this.isDisposed) {
                return;
            }
            // Update the this._primPointerInfo structure we'll send to observers using the PointerEvent data
            if (localPosition) {
                if (!this._updatePointerInfo(eventData, localPosition)) {
                    return;
                }
            }
            else {
                this._primPointerInfo.canvasPointerPos = null;
            }
            var capturedPrim = this.getCapturedPrimitive(this._primPointerInfo.pointerId);
            // Make sure the intersection list is up to date, we maintain this list either in response of a mouse event (here) or before rendering the canvas.
            // Why before rendering the canvas? because some primitives may move and get away/under the mouse cursor (which is not moving). So we need to update at both location in order to always have an accurate list, which is needed for the hover state change.
            this._updateIntersectionList(localPosition ? this._primPointerInfo.canvasPointerPos : null, capturedPrim !== null, true);
            // Update the over status, same as above, it's could be done here or during rendering, but will be performed only once per render frame
            this._updateOverStatus(true);
            // Check if we have nothing to raise
            if (!this._actualOverPrimitive && !capturedPrim) {
                return;
            }
            // Update the relatedTarget info with the over primitive or the captured one (if any)
            var targetPrim = capturedPrim || this._actualOverPrimitive.prim;
            var targetPointerPos = capturedPrim ? this._primPointerInfo.canvasPointerPos.subtract(new BABYLON.Vector2(targetPrim.globalTransform.m[4], targetPrim.globalTransform.m[5])) : this._actualOverPrimitive.intersectionLocation;
            this._primPointerInfo.updateRelatedTarget(targetPrim, targetPointerPos);
            // Analyze the pointer event type and fire proper events on the primitive
            var skip = false;
            if (eventData.type === BABYLON.PointerEventTypes.POINTERWHEEL) {
                skip = !this._bubbleNotifyPrimPointerObserver(targetPrim, BABYLON.PrimitivePointerInfo.PointerMouseWheel, eventData);
            }
            else if (eventData.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                skip = !this._bubbleNotifyPrimPointerObserver(targetPrim, BABYLON.PrimitivePointerInfo.PointerMove, eventData);
            }
            else if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                skip = !this._bubbleNotifyPrimPointerObserver(targetPrim, BABYLON.PrimitivePointerInfo.PointerDown, eventData);
            }
            else if (eventData.type === BABYLON.PointerEventTypes.POINTERUP) {
                skip = !this._bubbleNotifyPrimPointerObserver(targetPrim, BABYLON.PrimitivePointerInfo.PointerUp, eventData);
            }
            eventState.skipNextObservers = skip;
        };
        Canvas2D.prototype._updatePointerInfo = function (eventData, localPosition) {
            var s = this._canvasLevelScale.multiplyByFloats(this.scaleX, this.scaleY);
            var pii = this._primPointerInfo;
            pii.cancelBubble = false;
            if (!pii.canvasPointerPos) {
                pii.canvasPointerPos = BABYLON.Vector2.Zero();
            }
            var camera = this._scene.cameraToUseForPointers || this._scene.activeCamera;
            if (!camera || !camera.viewport) {
                return false;
            }
            var engine = this._scene.getEngine();
            if (this._isScreenSpace) {
                var cameraViewport = camera.viewport;
                var renderWidth = engine.getRenderWidth();
                var renderHeight = engine.getRenderHeight();
                //                console.log(`Render Width: ${renderWidth} Height: ${renderHeight}, localX: ${localPosition.x}, localY: ${localPosition.y}`);
                var viewport = cameraViewport.toGlobal(renderWidth, renderHeight);
                // Moving coordinates to local viewport world
                var x = localPosition.x - viewport.x;
                var y = localPosition.y - viewport.y;
                pii.canvasPointerPos.x = (x - this.actualPosition.x) / s.x;
                pii.canvasPointerPos.y = (renderHeight - y - this.actualPosition.y) / s.y;
            }
            else {
                pii.canvasPointerPos.x = localPosition.x / s.x;
                pii.canvasPointerPos.y = localPosition.y / s.x;
            }
            //console.log(`UpdatePointerInfo for ${this.id}, X:${pii.canvasPointerPos.x}, Y:${pii.canvasPointerPos.y}`);
            pii.mouseWheelDelta = 0;
            if (eventData.type === BABYLON.PointerEventTypes.POINTERWHEEL) {
                var event = eventData.event;
                if (event.wheelDelta) {
                    pii.mouseWheelDelta = event.wheelDelta / (BABYLON.PrimitivePointerInfo.MouseWheelPrecision * 40);
                }
                else if (event.detail) {
                    pii.mouseWheelDelta = -event.detail / BABYLON.PrimitivePointerInfo.MouseWheelPrecision;
                }
            }
            else {
                var pe = eventData.event;
                pii.ctrlKey = pe.ctrlKey;
                pii.altKey = pe.altKey;
                pii.shiftKey = pe.shiftKey;
                pii.metaKey = pe.metaKey;
                pii.button = pe.button;
                pii.buttons = pe.buttons;
                pii.pointerId = pe.pointerId;
                pii.width = pe.width;
                pii.height = pe.height;
                pii.presssure = pe.pressure;
                pii.tilt.x = pe.tiltX;
                pii.tilt.y = pe.tiltY;
                pii.isCaptured = this.getCapturedPrimitive(pe.pointerId) !== null;
            }
            return true;
        };
        Canvas2D.prototype._updateIntersectionList = function (mouseLocalPos, isCapture, force) {
            if (!force && (this.scene.getRenderId() === this._intersectionRenderId)) {
                return;
            }
            var ii = Canvas2D_1._interInfo;
            var outCase = mouseLocalPos == null;
            if (!outCase) {
                // A little safe guard, it might happens than the event is triggered before the first render and nothing is computed, this simple check will make sure everything will be fine
                if (!this._globalTransform) {
                    this.updateCachedStates(true);
                }
                ii.pickPosition.x = mouseLocalPos.x;
                ii.pickPosition.y = mouseLocalPos.y;
                ii.findFirstOnly = false;
                // Fast rejection: test if the mouse pointer is outside the canvas's bounding Info
                if (!isCapture && !this.levelBoundingInfo.doesIntersect(ii.pickPosition)) {
                    // Reset intersection info as we don't hit anything
                    ii.intersectedPrimitives = new Array();
                    ii.topMostIntersectedPrimitive = null;
                }
                else {
                    // The pointer is inside the Canvas, do an intersection test
                    this.intersect(ii);
                    // Sort primitives to get them from top to bottom
                    ii.intersectedPrimitives = ii.intersectedPrimitives.sort(function (a, b) { return a.prim.actualZOffset - b.prim.actualZOffset; });
                }
            }
            {
                // Update prev/actual intersection info, fire "overPrim" property change if needed
                this._previousIntersectionList = this._actualIntersectionList;
                this._actualIntersectionList = outCase ? new Array() : ii.intersectedPrimitives;
                this._previousOverPrimitive = this._actualOverPrimitive;
                this._actualOverPrimitive = outCase ? null : ii.topMostIntersectedPrimitive;
                var prev = (this._previousOverPrimitive != null) ? this._previousOverPrimitive.prim : null;
                var actual = (this._actualOverPrimitive != null) ? this._actualOverPrimitive.prim : null;
                if (prev !== actual) {
                    this.onPropertyChanged("overPrim", this._previousOverPrimitive ? this._previousOverPrimitive.prim : null, this._actualOverPrimitive ? this._actualOverPrimitive.prim : null);
                }
            }
            this._intersectionRenderId = this.scene.getRenderId();
        };
        // Based on the previousIntersectionList and the actualInstersectionList we can determined which primitives are being hover state or loosing it
        Canvas2D.prototype._updateOverStatus = function (force) {
            if ((!force && (this.scene.getRenderId() === this._hoverStatusRenderId)) || !this._actualIntersectionList) {
                return;
            }
            if (this._previousIntersectionList == null) {
                this._previousIntersectionList = [];
            }
            // Detect a change of over
            var prevPrim = this._previousOverPrimitive ? this._previousOverPrimitive.prim : null;
            var actualPrim = this._actualOverPrimitive ? this._actualOverPrimitive.prim : null;
            if (prevPrim !== actualPrim) {
                // Detect if the current pointer is captured, only fire event if they belong to the capture primitive
                var capturedPrim = this.getCapturedPrimitive(this._primPointerInfo.pointerId);
                // See the NOTE section of: https://www.w3.org/TR/pointerevents/#setting-pointer-capture
                if (capturedPrim) {
                    if (capturedPrim === prevPrim) {
                        this._primPointerInfo.updateRelatedTarget(prevPrim, this._previousOverPrimitive.intersectionLocation);
                        this._bubbleNotifyPrimPointerObserver(prevPrim, BABYLON.PrimitivePointerInfo.PointerOut, null);
                    }
                    else if (capturedPrim === actualPrim) {
                        this._primPointerInfo.updateRelatedTarget(actualPrim, this._actualOverPrimitive.intersectionLocation);
                        this._bubbleNotifyPrimPointerObserver(actualPrim, BABYLON.PrimitivePointerInfo.PointerOver, null);
                    }
                }
                else {
                    var _loop_1 = function (prev) {
                        if (!BABYLON.Tools.first(this_1._actualIntersectionList, function (pii) { return pii.prim === prev.prim; })) {
                            this_1._primPointerInfo.updateRelatedTarget(prev.prim, prev.intersectionLocation);
                            this_1._bubbleNotifyPrimPointerObserver(prev.prim, BABYLON.PrimitivePointerInfo.PointerOut, null);
                        }
                    };
                    var this_1 = this;
                    // Check for Out & Leave
                    for (var _i = 0, _a = this._previousIntersectionList; _i < _a.length; _i++) {
                        var prev = _a[_i];
                        _loop_1(prev);
                    }
                    var _loop_2 = function (actual) {
                        if (!BABYLON.Tools.first(this_2._previousIntersectionList, function (pii) { return pii.prim === actual.prim; })) {
                            this_2._primPointerInfo.updateRelatedTarget(actual.prim, actual.intersectionLocation);
                            this_2._bubbleNotifyPrimPointerObserver(actual.prim, BABYLON.PrimitivePointerInfo.PointerOver, null);
                        }
                    };
                    var this_2 = this;
                    // Check for Over & Enter
                    for (var _b = 0, _c = this._actualIntersectionList; _b < _c.length; _b++) {
                        var actual = _c[_b];
                        _loop_2(actual);
                    }
                }
            }
            this._hoverStatusRenderId = this.scene.getRenderId();
        };
        Canvas2D.prototype._updatePrimPointerPos = function (prim) {
            if (this._primPointerInfo.isCaptured) {
                this._primPointerInfo.primitivePointerPos = this._primPointerInfo.relatedTargetPointerPos;
            }
            else {
                for (var _i = 0, _a = this._actualIntersectionList; _i < _a.length; _i++) {
                    var pii = _a[_i];
                    if (pii.prim === prim) {
                        this._primPointerInfo.primitivePointerPos = pii.intersectionLocation;
                        return;
                    }
                }
            }
        };
        Canvas2D.prototype._debugExecObserver = function (prim, mask) {
            if (!this._notifDebugMode) {
                return;
            }
            var debug = "";
            for (var i = 0; i < prim.hierarchyDepth; i++) {
                debug += "  ";
            }
            var pii = this._primPointerInfo;
            debug += "[RID:" + this.scene.getRenderId() + "] [" + prim.hierarchyDepth + "] event:" + BABYLON.PrimitivePointerInfo.getEventTypeName(mask) + ", id: " + prim.id + " (" + BABYLON.Tools.getClassName(prim) + "), primPos: " + pii.primitivePointerPos.toString() + ", canvasPos: " + pii.canvasPointerPos.toString() + ", relatedTarget: " + pii.relatedTarget.id;
            console.log(debug);
        };
        Canvas2D.prototype._bubbleNotifyPrimPointerObserver = function (prim, mask, eventData) {
            var ppi = this._primPointerInfo;
            var event = eventData ? eventData.event : null;
            var cur = prim;
            while (cur && !cur.isDisposed) {
                this._updatePrimPointerPos(cur);
                // For the first level we have to fire Enter or Leave for corresponding Over or Out
                if (cur === prim) {
                    // Fire the proper notification
                    if (mask === BABYLON.PrimitivePointerInfo.PointerOver) {
                        this._debugExecObserver(prim, BABYLON.PrimitivePointerInfo.PointerEnter);
                        prim._pointerEventObservable.notifyObservers(ppi, BABYLON.PrimitivePointerInfo.PointerEnter);
                    }
                    else if (mask === BABYLON.PrimitivePointerInfo.PointerOut) {
                        this._debugExecObserver(prim, BABYLON.PrimitivePointerInfo.PointerLeave);
                        prim._pointerEventObservable.notifyObservers(ppi, BABYLON.PrimitivePointerInfo.PointerLeave);
                    }
                }
                // Exec the observers
                this._debugExecObserver(cur, mask);
                if (!cur._pointerEventObservable.notifyObservers(ppi, mask) && eventData instanceof BABYLON.PointerInfoPre) {
                    eventData.skipOnPointerObservable = true;
                    return false;
                }
                this._triggerActionManager(cur, ppi, mask, event);
                // Bubble canceled? If we're not executing PointerOver or PointerOut, quit immediately
                // If it's PointerOver/Out we have to trigger PointerEnter/Leave no matter what
                if (ppi.cancelBubble) {
                    return false;
                }
                // Loop to the parent
                cur = cur.parent;
            }
            return true;
        };
        Canvas2D.prototype._triggerActionManager = function (prim, ppi, mask, eventData) {
            var _this = this;
            // A little safe guard, it might happens than the event is triggered before the first render and nothing is computed, this simple check will make sure everything will be fine
            if (!this._globalTransform) {
                this.updateCachedStates(true);
            }
            // Process Trigger related to PointerDown
            if ((mask & BABYLON.PrimitivePointerInfo.PointerDown) !== 0) {
                // On pointer down, record the current position and time to be able to trick PickTrigger and LongPressTrigger
                this._pickStartingPosition = ppi.primitivePointerPos.clone();
                this._pickStartingTime = new Date().getTime();
                this._pickedDownPrim = null;
                if (prim.actionManager) {
                    this._pickedDownPrim = prim;
                    if (prim.actionManager.hasPickTriggers) {
                        var actionEvent = BABYLON.ActionEvent.CreateNewFromPrimitive(prim, ppi.primitivePointerPos, eventData);
                        switch (eventData.button) {
                            case 0:
                                prim.actionManager.processTrigger(BABYLON.ActionManager.OnLeftPickTrigger, actionEvent);
                                break;
                            case 1:
                                prim.actionManager.processTrigger(BABYLON.ActionManager.OnCenterPickTrigger, actionEvent);
                                break;
                            case 2:
                                prim.actionManager.processTrigger(BABYLON.ActionManager.OnRightPickTrigger, actionEvent);
                                break;
                        }
                        prim.actionManager.processTrigger(BABYLON.ActionManager.OnPickDownTrigger, actionEvent);
                    }
                    if (prim.actionManager.hasSpecificTrigger(BABYLON.ActionManager.OnLongPressTrigger)) {
                        window.setTimeout(function () {
                            var ppi = _this._primPointerInfo;
                            var capturedPrim = _this.getCapturedPrimitive(ppi.pointerId);
                            _this._updateIntersectionList(ppi.canvasPointerPos, capturedPrim !== null, true);
                            _this._updateOverStatus(false);
                            var ii = new BABYLON.IntersectInfo2D();
                            ii.pickPosition = ppi.canvasPointerPos.clone();
                            ii.findFirstOnly = false;
                            _this.intersect(ii);
                            if (ii.isPrimIntersected(prim) !== null) {
                                if (prim.actionManager) {
                                    if (_this._pickStartingTime !== 0 && ((new Date().getTime() - _this._pickStartingTime) > BABYLON.Scene.LongPressDelay) && (Math.abs(_this._pickStartingPosition.x - ii.pickPosition.x) < BABYLON.Scene.DragMovementThreshold && Math.abs(_this._pickStartingPosition.y - ii.pickPosition.y) < BABYLON.Scene.DragMovementThreshold)) {
                                        _this._pickStartingTime = 0;
                                        prim.actionManager.processTrigger(BABYLON.ActionManager.OnLongPressTrigger, BABYLON.ActionEvent.CreateNewFromPrimitive(prim, ppi.primitivePointerPos, eventData));
                                    }
                                }
                            }
                        }, BABYLON.Scene.LongPressDelay);
                    }
                }
            }
            else if ((mask & BABYLON.PrimitivePointerInfo.PointerUp) !== 0) {
                this._pickStartingTime = 0;
                var actionEvent = BABYLON.ActionEvent.CreateNewFromPrimitive(prim, ppi.primitivePointerPos, eventData);
                if (prim.actionManager) {
                    // OnPickUpTrigger
                    prim.actionManager.processTrigger(BABYLON.ActionManager.OnPickUpTrigger, actionEvent);
                    // OnPickTrigger
                    if (Math.abs(this._pickStartingPosition.x - ppi.canvasPointerPos.x) < BABYLON.Scene.DragMovementThreshold && Math.abs(this._pickStartingPosition.y - ppi.canvasPointerPos.y) < BABYLON.Scene.DragMovementThreshold) {
                        prim.actionManager.processTrigger(BABYLON.ActionManager.OnPickTrigger, actionEvent);
                    }
                }
                // OnPickOutTrigger
                if (this._pickedDownPrim && this._pickedDownPrim.actionManager && (this._pickedDownPrim !== prim)) {
                    this._pickedDownPrim.actionManager.processTrigger(BABYLON.ActionManager.OnPickOutTrigger, actionEvent);
                }
            }
            else if ((mask & BABYLON.PrimitivePointerInfo.PointerOver) !== 0) {
                if (prim.actionManager) {
                    var actionEvent = BABYLON.ActionEvent.CreateNewFromPrimitive(prim, ppi.primitivePointerPos, eventData);
                    prim.actionManager.processTrigger(BABYLON.ActionManager.OnPointerOverTrigger, actionEvent);
                }
            }
            else if ((mask & BABYLON.PrimitivePointerInfo.PointerOut) !== 0) {
                if (prim.actionManager) {
                    var actionEvent = BABYLON.ActionEvent.CreateNewFromPrimitive(prim, ppi.primitivePointerPos, eventData);
                    prim.actionManager.processTrigger(BABYLON.ActionManager.OnPointerOutTrigger, actionEvent);
                }
            }
        };
        /**
         * Don't forget to call the dispose method when you're done with the Canvas instance.
         * But don't worry, if you dispose its scene, the canvas will be automatically disposed too.
         */
        Canvas2D.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (this._profilingCanvas) {
                this._profilingCanvas.dispose();
                this._profilingCanvas = null;
            }
            if (this.interactionEnabled) {
                this._setupInteraction(false);
            }
            if (this._renderingGroupObserver) {
                this._scene.onRenderingGroupObservable.remove(this._renderingGroupObserver);
                this._renderingGroupObserver = null;
            }
            if (this._beforeRenderObserver) {
                this._scene.onBeforeRenderObservable.remove(this._beforeRenderObserver);
                this._beforeRenderObserver = null;
            }
            if (this._afterRenderObserver) {
                this._scene.onAfterRenderObservable.remove(this._afterRenderObserver);
                this._afterRenderObserver = null;
            }
            if (this._groupCacheMaps) {
                this._groupCacheMaps.forEach(function (k, m) { return m.forEach(function (e) { return e.dispose(); }); });
                this._groupCacheMaps = null;
            }
            // Unregister this instance
            var index = Canvas2D_1._INSTANCES.indexOf(this);
            if (index > -1) {
                Canvas2D_1._INSTANCES.splice(index, 1);
            }
            return true;
        };
        Object.defineProperty(Canvas2D.prototype, "scene", {
            /**
             * Accessor to the Scene that owns the Canvas
             * @returns The instance of the Scene object
             */
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "engine", {
            /**
             * Accessor to the Engine that drives the Scene used by this Canvas
             * @returns The instance of the Engine object
             */
            get: function () {
                return this._engine;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "renderObservable", {
            /**
             * And observable called during the Canvas rendering process.
             * This observable is called twice per render, each time with a different mask:
             *  - 1: before render is executed
             *  - 2: after render is executed
             */
            get: function () {
                if (!this._renderObservable) {
                    this._renderObservable = new BABYLON.Observable();
                }
                return this._renderObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "cachingStrategy", {
            /**
             * Accessor of the Caching Strategy used by this Canvas.
             * See Canvas2D.CACHESTRATEGY_xxxx static members for more information
             * @returns the value corresponding to the used strategy.
             */
            get: function () {
                return this._cachingStrategy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "isScreenSpace", {
            /**
             * Return true if the Canvas is a Screen Space one, false if it's a World Space one.
             * @returns {}
             */
            get: function () {
                return this._isScreenSpace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "worldSpaceCanvasNode", {
            /**
             * Only valid for World Space Canvas, returns the scene node that displays the canvas
             */
            get: function () {
                return this._worldSpaceNode;
            },
            set: function (val) {
                this._worldSpaceNode = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "supportInstancedArray", {
            /**
             * Check if the WebGL Instanced Array extension is supported or not
             */
            get: function () {
                return this._supprtInstancedArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "backgroundFill", {
            /**
             * Property that defines the fill object used to draw the background of the Canvas.
             * Note that Canvas with a Caching Strategy of
             * @returns If the background is not set, null will be returned, otherwise a valid fill object is returned.
             */
            get: function () {
                if (!this._background || !this._background.isVisible) {
                    return null;
                }
                return this._background.fill;
            },
            set: function (value) {
                this.checkBackgroundAvailability();
                if (value === this._background.fill) {
                    return;
                }
                this._background.fill = value;
                this._background.levelVisible = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "backgroundBorder", {
            /**
             * Property that defines the border object used to draw the background of the Canvas.
             * @returns If the background is not set, null will be returned, otherwise a valid border object is returned.
             */
            get: function () {
                if (!this._background || !this._background.isVisible) {
                    return null;
                }
                return this._background.border;
            },
            set: function (value) {
                this.checkBackgroundAvailability();
                if (value === this._background.border) {
                    return;
                }
                this._background.border = value;
                this._background.levelVisible = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "backgroundBorderThickness", {
            /**
             * Property that defines the thickness of the border object used to draw the background of the Canvas.
             * @returns If the background is not set, null will be returned, otherwise a valid number matching the thickness is returned.
             */
            get: function () {
                if (!this._background || !this._background.isVisible) {
                    return null;
                }
                return this._background.borderThickness;
            },
            set: function (value) {
                this.checkBackgroundAvailability();
                if (value === this._background.borderThickness) {
                    return;
                }
                this._background.borderThickness = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "backgroundRoundRadius", {
            /**
             * You can set the roundRadius of the background
             * @returns The current roundRadius
             */
            get: function () {
                if (!this._background || !this._background.isVisible) {
                    return null;
                }
                return this._background.roundRadius;
            },
            set: function (value) {
                this.checkBackgroundAvailability();
                if (value === this._background.roundRadius) {
                    return;
                }
                this._background.roundRadius = value;
                this._background.levelVisible = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "interactionEnabled", {
            /**
             * Enable/Disable interaction for this Canvas
             * When enabled the Prim2DBase.pointerEventObservable property will notified when appropriate events occur
             */
            get: function () {
                return this._interactionEnabled;
            },
            set: function (enable) {
                this._setupInteraction(enable);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "fitRenderingDevice", {
            get: function () {
                return this._fitRenderingDevice;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "designSize", {
            get: function () {
                return this._designSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "designSizeUseHorizAxis", {
            get: function () {
                return this._designUseHorizAxis;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "designSizeUseHorizeAxis", {
            set: function (value) {
                this._designUseHorizAxis = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "overPrim", {
            /**
             * Return
             */
            get: function () {
                if (this._actualIntersectionList && this._actualIntersectionList.length > 0) {
                    return this._actualIntersectionList[0].prim;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "_engineData", {
            /**
             * Access the babylon.js' engine bound data, do not invoke this method, it's for internal purpose only
             * @returns {}
             */
            get: function () {
                return this.__engineData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas2D.prototype, "unitScaleFactor", {
            get: function () {
                return this._unitScaleFactor;
            },
            enumerable: true,
            configurable: true
        });
        Canvas2D.prototype.createCanvasProfileInfoCanvas = function () {
            if (this._profilingCanvas) {
                return this._profilingCanvas;
            }
            var canvas = new ScreenSpaceCanvas2D(this.scene, {
                id: "ProfileInfoCanvas", cachingStrategy: Canvas2D_1.CACHESTRATEGY_DONTCACHE, children: [
                    new BABYLON.Rectangle2D({
                        id: "ProfileBorder", border: "#FFFFFFFF", borderThickness: 2, roundRadius: 5, fill: "#C04040C0", marginAlignment: "h: left, v: top", margin: "10", padding: "10", children: [
                            new BABYLON.Text2D("Stats", { id: "ProfileInfoText", marginAlignment: "h: left, v: top", fontName: "12pt Lucida Console", fontSignedDistanceField: true })
                        ]
                    })
                ]
            });
            this._profileInfoText = canvas.findById("ProfileInfoText");
            this._profilingCanvas = canvas;
            return canvas;
        };
        Canvas2D.prototype.checkBackgroundAvailability = function () {
            if (this._cachingStrategy === Canvas2D_1.CACHESTRATEGY_TOPLEVELGROUPS) {
                throw Error("Can't use Canvas Background with the caching strategy TOPLEVELGROUPS");
            }
        };
        Canvas2D.prototype._initPerfMetrics = function () {
            this.drawCallsOpaqueCounter.fetchNewFrame();
            this.drawCallsAlphaTestCounter.fetchNewFrame();
            this.drawCallsTransparentCounter.fetchNewFrame();
            this.groupRenderCounter.fetchNewFrame();
            this.updateTransparentDataCounter.fetchNewFrame();
            this.updateCachedStateCounter.fetchNewFrame();
            this.updateLayoutCounter.fetchNewFrame();
            this.updatePositioningCounter.fetchNewFrame();
            this.updateLocalTransformCounter.fetchNewFrame();
            this.updateGlobalTransformCounter.fetchNewFrame();
            this.boundingInfoRecomputeCounter.fetchNewFrame();
            this.layoutBoundingInfoUpdateCounter.fetchNewFrame();
            this.canvasRenderTimeCounter.beginMonitoring();
        };
        Canvas2D.prototype._fetchPerfMetrics = function () {
            this.drawCallsOpaqueCounter.addCount(0, true);
            this.drawCallsAlphaTestCounter.addCount(0, true);
            this.drawCallsTransparentCounter.addCount(0, true);
            this.groupRenderCounter.addCount(0, true);
            this.updateTransparentDataCounter.addCount(0, true);
            this.updateCachedStateCounter.addCount(0, true);
            this.updateLayoutCounter.addCount(0, true);
            this.updatePositioningCounter.addCount(0, true);
            this.updateLocalTransformCounter.addCount(0, true);
            this.updateGlobalTransformCounter.addCount(0, true);
            this.boundingInfoRecomputeCounter.addCount(0, true);
            this.layoutBoundingInfoUpdateCounter.addCount(0, true);
            this.canvasRenderTimeCounter.endMonitoring(true);
        };
        Canvas2D.prototype._updateProfileCanvas = function () {
            if (this._profileInfoText == null) {
                return;
            }
            var format = function (v) { return (Math.round(v * 100) / 100).toString(); };
            var p = "Render Time: avg:" + format(this.canvasRenderTimeCounter.lastSecAverage) + "ms " + format(this.canvasRenderTimeCounter.current) + "ms\n" +
                "Draw Calls:\n" +
                (" - Opaque:      " + format(this.drawCallsOpaqueCounter.current) + ", (avg:" + format(this.drawCallsOpaqueCounter.lastSecAverage) + ", t:" + format(this.drawCallsOpaqueCounter.total) + ")\n") +
                (" - AlphaTest:   " + format(this.drawCallsAlphaTestCounter.current) + ", (avg:" + format(this.drawCallsAlphaTestCounter.lastSecAverage) + ", t:" + format(this.drawCallsAlphaTestCounter.total) + ")\n") +
                (" - Transparent: " + format(this.drawCallsTransparentCounter.current) + ", (avg:" + format(this.drawCallsTransparentCounter.lastSecAverage) + ", t:" + format(this.drawCallsTransparentCounter.total) + ")\n") +
                ("Group Render: " + this.groupRenderCounter.current + ", (avg:" + format(this.groupRenderCounter.lastSecAverage) + ", t:" + format(this.groupRenderCounter.total) + ")\n") +
                ("Update Transparent Data: " + this.updateTransparentDataCounter.current + ", (avg:" + format(this.updateTransparentDataCounter.lastSecAverage) + ", t:" + format(this.updateTransparentDataCounter.total) + ")\n") +
                ("Update Cached States: " + this.updateCachedStateCounter.current + ", (avg:" + format(this.updateCachedStateCounter.lastSecAverage) + ", t:" + format(this.updateCachedStateCounter.total) + ")\n") +
                (" - Update Layout: " + this.updateLayoutCounter.current + ", (avg:" + format(this.updateLayoutCounter.lastSecAverage) + ", t:" + format(this.updateLayoutCounter.total) + ")\n") +
                (" - Update Positioning: " + this.updatePositioningCounter.current + ", (avg:" + format(this.updatePositioningCounter.lastSecAverage) + ", t:" + format(this.updatePositioningCounter.total) + ")\n") +
                (" - Update Local  Trans: " + this.updateLocalTransformCounter.current + ", (avg:" + format(this.updateLocalTransformCounter.lastSecAverage) + ", t:" + format(this.updateLocalTransformCounter.total) + ")\n") +
                (" - Update Global Trans: " + this.updateGlobalTransformCounter.current + ", (avg:" + format(this.updateGlobalTransformCounter.lastSecAverage) + ", t:" + format(this.updateGlobalTransformCounter.total) + ")\n") +
                (" - BoundingInfo Recompute: " + this.boundingInfoRecomputeCounter.current + ", (avg:" + format(this.boundingInfoRecomputeCounter.lastSecAverage) + ", t:" + format(this.boundingInfoRecomputeCounter.total) + ")\n") +
                (" - LayoutBoundingInfo Recompute: " + this.layoutBoundingInfoUpdateCounter.current + ", (avg:" + format(this.layoutBoundingInfoUpdateCounter.lastSecAverage) + ", t:" + format(this.layoutBoundingInfoUpdateCounter.total) + ")");
            this._profileInfoText.text = p;
        };
        Canvas2D.prototype._addDrawCallCount = function (count, renderMode) {
            switch (renderMode) {
                case BABYLON.Render2DContext.RenderModeOpaque:
                    this._drawCallsOpaqueCounter.addCount(count, false);
                    return;
                case BABYLON.Render2DContext.RenderModeAlphaTest:
                    this._drawCallsAlphaTestCounter.addCount(count, false);
                    return;
                case BABYLON.Render2DContext.RenderModeTransparent:
                    this._drawCallsTransparentCounter.addCount(count, false);
                    return;
            }
        };
        Canvas2D.prototype._addGroupRenderCount = function (count) {
            if (this._groupRenderCounter) {
                this._groupRenderCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype._addUpdateTransparentDataCount = function (count) {
            if (this._updateTransparentDataCounter) {
                this._updateTransparentDataCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype.addUpdateCachedStateCounter = function (count) {
            if (this._updateCachedStateCounter) {
                this._updateCachedStateCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype.addUpdateLayoutCounter = function (count) {
            if (this._updateLayoutCounter) {
                this._updateLayoutCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype.addUpdatePositioningCounter = function (count) {
            if (this._updatePositioningCounter) {
                this._updatePositioningCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype.addupdateLocalTransformCounter = function (count) {
            if (this._updateLocalTransformCounter) {
                this._updateLocalTransformCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype.addUpdateGlobalTransformCounter = function (count) {
            if (this._updateGlobalTransformCounter) {
                this._updateGlobalTransformCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype.addLayoutBoundingInfoUpdateCounter = function (count) {
            if (this._layoutBoundingInfoUpdateCounter) {
                this._layoutBoundingInfoUpdateCounter.addCount(count, false);
            }
        };
        Canvas2D.prototype._updateTrackedNodes = function () {
            // Get the used camera
            var cam = this.scene.cameraToUseForPointers || this.scene.activeCamera;
            // Compute some matrix stuff
            cam.getViewMatrix().multiplyToRef(cam.getProjectionMatrix(), Canvas2D_1._m);
            var rh = this.engine.getRenderHeight();
            var v = cam.viewport.toGlobal(this.engine.getRenderWidth(), rh);
            var tmpVec3 = Canvas2D_1._tmpVec3;
            var tmpMtx = Canvas2D_1._tmpMtx;
            // Compute the screen position of each group that track a given scene node
            for (var _i = 0, _a = this._trackedGroups; _i < _a.length; _i++) {
                var group = _a[_i];
                if (group.isDisposed) {
                    continue;
                }
                var node = group.trackedNode;
                var worldMtx = node.getWorldMatrix();
                if (group.trackedNodeOffset) {
                    BABYLON.Vector3.TransformCoordinatesToRef(group.trackedNodeOffset, worldMtx, tmpVec3);
                    tmpMtx.copyFrom(worldMtx);
                    worldMtx = tmpMtx;
                    worldMtx.setTranslation(tmpVec3);
                }
                var proj = BABYLON.Vector3.Project(Canvas2D_1._v, worldMtx, Canvas2D_1._m, v);
                // Set the visibility state accordingly, if the position is outside the frustum (well on the Z planes only...) set the group to hidden
                group.levelVisible = proj.z >= 0 && proj.z < 1.0;
                var s = this.scale;
                group.x = Math.round(proj.x / s);
                group.y = Math.round((rh - proj.y) / s);
            }
            // If it's a WorldSpaceCanvas and it's tracking a node, let's update the WSC transformation data
            if (this._trackNode) {
                var rot = null;
                var scale = null;
                var worldmtx = this._trackNode.getWorldMatrix();
                var pos = worldmtx.getTranslation().add(this._trackNodeOffset);
                var wsc = this;
                var wsn = wsc.worldSpaceCanvasNode;
                if (this._trackNodeBillboard) {
                    var viewMtx = cam.getViewMatrix().clone().invert();
                    viewMtx.decompose(Canvas2D_1.tS, Canvas2D_1.tR, Canvas2D_1.tT);
                    rot = Canvas2D_1.tR.clone();
                }
                worldmtx.decompose(Canvas2D_1.tS, Canvas2D_1.tR, Canvas2D_1.tT);
                var mtx = BABYLON.Matrix.Compose(Canvas2D_1.tS, Canvas2D_1.tR, BABYLON.Vector3.Zero());
                pos = worldmtx.getTranslation().add(BABYLON.Vector3.TransformCoordinates(this._trackNodeOffset, mtx));
                if (Canvas2D_1.tS.lengthSquared() !== 1) {
                    scale = Canvas2D_1.tS.clone();
                }
                if (!this._trackNodeBillboard) {
                    rot = Canvas2D_1.tR.clone();
                }
                if (wsn instanceof BABYLON.AbstractMesh) {
                    wsn.position = pos;
                    wsn.rotationQuaternion = rot;
                    if (scale) {
                        wsn.scaling = scale;
                    }
                }
                else {
                    throw new Error("Can't Track another Scene Node Type than AbstractMesh right now, call me lazy!");
                }
            }
        };
        /**
         * Call this method change you want to have layout related data computed and up to date (layout area, primitive area, local/global transformation matrices)
         */
        Canvas2D.prototype.updateCanvasLayout = function (forceRecompute) {
            this._updateCanvasState(forceRecompute);
        };
        Canvas2D.prototype._updateAdaptiveSizeWorldCanvas = function () {
            if (this._globalTransformStep < 2) {
                return;
            }
            var n = this.worldSpaceCanvasNode;
            var bi = n.getBoundingInfo().boundingBox;
            var v = bi.vectorsWorld;
            var cam = this.scene.cameraToUseForPointers || this.scene.activeCamera;
            cam.getViewMatrix().multiplyToRef(cam.getProjectionMatrix(), Canvas2D_1._m);
            if (Canvas2D_1._m.m[15] < BABYLON.Epsilon && Canvas2D_1._m.m[15] >= 0) {
                Canvas2D_1._m.m[15] = BABYLON.Epsilon;
            }
            else if (Canvas2D_1._m.m[15] > -BABYLON.Epsilon && Canvas2D_1._m.m[15] <= 0) {
                Canvas2D_1._m.m[15] = -BABYLON.Epsilon;
            }
            var vp = cam.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight());
            var projPoints = new Array(4);
            for (var i = 0; i < 4; i++) {
                projPoints[i] = BABYLON.Vector3.Project(v[i], Canvas2D_1._mI, Canvas2D_1._m, vp);
            }
            var left = projPoints[3].subtract(projPoints[0]).length();
            var top = projPoints[3].subtract(projPoints[1]).length();
            var right = projPoints[1].subtract(projPoints[2]).length();
            var bottom = projPoints[2].subtract(projPoints[0]).length();
            var w = Math.round(Math.max(top, bottom));
            var h = Math.round(Math.max(right, left));
            var isW = w > h;
            // Basically if it's under 256 we use 256, otherwise we take the biggest power of 2
            var edge = Math.max(w, h);
            if (edge < 256) {
                edge = 256;
            }
            else {
                edge = Math.pow(2, Math.ceil(Math.log(edge) / Math.log(2)));
            }
            // Clip values if needed
            edge = Math.min(edge, this._maxAdaptiveWorldSpaceCanvasSize - 4); // -4 is to consider the border of 2 pixels, other we couldn't allocate a rect
            var newScale = edge / ((isW) ? this.size.width : this.size.height);
            if (newScale !== this._renderableData._renderingScale) {
                var scale = newScale;
                //console.log(`New adaptive scale for Canvas ${this.id}, w: ${w}, h: ${h}, scale: ${scale}, edge: ${edge}, isW: ${isW}`);
                this._setRenderingScale(scale);
            }
        };
        Canvas2D.prototype._updateCanvasState = function (forceRecompute) {
            // Check if the update has already been made for this render Frame
            if (!forceRecompute && this.scene.getRenderId() === this._updateRenderId) {
                return;
            }
            // Detect a change of HWRendering scale
            var hwsl = this.engine.getHardwareScalingLevel();
            this._curHWScale = hwsl;
            // Detect a change of rendering size
            var renderingSizeChanged = false;
            var newWidth = this.engine.getRenderWidth() * hwsl;
            if (newWidth !== this._renderingSize.width) {
                renderingSizeChanged = true;
            }
            this._renderingSize.width = newWidth;
            var newHeight = this.engine.getRenderHeight() * hwsl;
            if (newHeight !== this._renderingSize.height) {
                renderingSizeChanged = true;
            }
            this._renderingSize.height = newHeight;
            var prevCLS = Canvas2D_1._pCLS;
            prevCLS.copyFrom(this._canvasLevelScale);
            // If there's a design size, update the scale according to the renderingSize
            if (this._designSize) {
                var scale = void 0;
                if (this._designUseHorizAxis) {
                    scale = this._renderingSize.width / (this._designSize.width * hwsl);
                }
                else {
                    scale = this._renderingSize.height / (this._designSize.height * hwsl);
                }
                this.size = this._designSize.clone();
                this._canvasLevelScale.copyFromFloats(scale, scale);
            }
            else {
                var ratio = 1 / this._curHWScale;
                this._canvasLevelScale.copyFromFloats(ratio, ratio);
            }
            if (!prevCLS.equals(this._canvasLevelScale)) {
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child._setFlags(BABYLON.SmartPropertyPrim.flagLocalTransformDirty | BABYLON.SmartPropertyPrim.flagGlobalTransformDirty);
                }
                this._setLayoutDirty();
            }
            // If the canvas fit the rendering size and it changed, update
            if (!this._designSize && renderingSizeChanged && this._fitRenderingDevice) {
                this.size = this._renderingSize.clone();
                if (this._background) {
                    this._background.size = this.size;
                }
                // Dirty the Layout at the Canvas level to recompute as the size changed
                this._setLayoutDirty();
            }
            var context = new BABYLON.PrepareRender2DContext();
            ++this._globalTransformProcessStep;
            this._setFlags(BABYLON.SmartPropertyPrim.flagLocalTransformDirty | BABYLON.SmartPropertyPrim.flagGlobalTransformDirty);
            this.updateCachedStates(false);
            this._prepareGroupRender(context);
            this._updateRenderId = this.scene.getRenderId();
        };
        /**
         * Method that renders the Canvas, you should not invoke
         */
        Canvas2D.prototype._render = function () {
            this._initPerfMetrics();
            if (this._renderObservable && this._renderObservable.hasObservers()) {
                this._renderObservable.notifyObservers(this, Canvas2D_1.RENDEROBSERVABLE_PRE);
            }
            this._updateTrackedNodes();
            this._updateCanvasState(false);
            // Nothing to do is the Canvas is not visible
            if (this.isVisible === false) {
                return;
            }
            if (!this._isScreenSpace) {
                this._updateAdaptiveSizeWorldCanvas();
            }
            this._updateCanvasState(false);
            if (this._primitiveCollisionManager) {
                this._primitiveCollisionManager._update();
            }
            if (this._primPointerInfo.canvasPointerPos) {
                this._updateIntersectionList(this._primPointerInfo.canvasPointerPos, false, false);
                this._updateOverStatus(false);
            }
            this.engine.setState(false, undefined, true);
            this._groupRender();
            if (!this._isScreenSpace) {
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagWorldCacheChanged)) {
                    this.worldSpaceCacheChanged();
                    this._clearFlags(BABYLON.SmartPropertyPrim.flagWorldCacheChanged);
                }
            }
            // If the canvas is cached at canvas level, we must manually render the sprite that will display its content
            if (this._cachingStrategy === Canvas2D_1.CACHESTRATEGY_CANVAS && this._cachedCanvasGroup) {
                this._cachedCanvasGroup._renderCachedCanvas();
            }
            this._fetchPerfMetrics();
            this._updateProfileCanvas();
            if (this._renderObservable && this._renderObservable.hasObservers()) {
                this._renderObservable.notifyObservers(this, Canvas2D_1.RENDEROBSERVABLE_POST);
            }
        };
        /**
         * Internal method that allocate a cache for the given group.
         * Caching is made using a collection of MapTexture where many groups have their bitmap cache stored inside.
         * @param group The group to allocate the cache of.
         * @return custom type with the PackedRect instance giving information about the cache location into the texture and also the MapTexture instance that stores the cache.
         */
        Canvas2D.prototype._allocateGroupCache = function (group, parent, minSize, useMipMap, anisotropicLevel) {
            if (useMipMap === void 0) { useMipMap = false; }
            if (anisotropicLevel === void 0) { anisotropicLevel = 1; }
            var key = (useMipMap ? "MipMap" : "NoMipMap") + "_" + anisotropicLevel;
            var rd = group._renderableData;
            var rs = rd._renderingScale;
            var noResizeScale = rd._noResizeOnScale;
            var isCanvas = parent == null;
            var scale;
            if (noResizeScale) {
                scale = isCanvas ? Canvas2D_1._unS : group.parent.actualScale.multiply(this._canvasLevelScale);
            }
            else {
                scale = group.actualScale.multiply(this._canvasLevelScale);
            }
            scale.x *= rs;
            scale.y *= rs;
            // Determine size
            var size = group.actualSize;
            var scaledSize = new BABYLON.Size(size.width * scale.x, size.height * scale.y);
            var roundedScaledSize = new BABYLON.Size(Math.ceil(scaledSize.width), Math.ceil(scaledSize.height));
            var originalSize = scaledSize.clone();
            if (minSize) {
                roundedScaledSize.width = Math.max(minSize.width, roundedScaledSize.width);
                roundedScaledSize.height = Math.max(minSize.height, roundedScaledSize.height);
            }
            var mapArray = this._groupCacheMaps.getOrAddWithFactory(key, function () { return new Array(); });
            // Try to find a spot in one of the cached texture
            var res = null;
            var map;
            for (var _i = 0, mapArray_1 = mapArray; _i < mapArray_1.length; _i++) {
                var _map = mapArray_1[_i];
                map = _map;
                var node = map.allocateRect(roundedScaledSize);
                if (node) {
                    res = { node: node, texture: map };
                    break;
                }
            }
            // Couldn't find a map that could fit the rect, create a new map for it
            if (!res) {
                var mapSize = new BABYLON.Size(Canvas2D_1._groupTextureCacheSize, Canvas2D_1._groupTextureCacheSize);
                // Check if the predefined size would fit, other create a custom size using the nearest bigger power of 2
                if (roundedScaledSize.width > mapSize.width || roundedScaledSize.height > mapSize.height) {
                    mapSize.width = Math.pow(2, Math.ceil(Math.log(roundedScaledSize.width) / Math.log(2)));
                    mapSize.height = Math.pow(2, Math.ceil(Math.log(roundedScaledSize.height) / Math.log(2)));
                }
                var id = "groupsMapChache" + this._mapCounter++ + "forCanvas" + this.id;
                map = new BABYLON.MapTexture(id, this._scene, mapSize, useMipMap ? BABYLON.Texture.TRILINEAR_SAMPLINGMODE : BABYLON.Texture.BILINEAR_SAMPLINGMODE, useMipMap, 2);
                map.hasAlpha = true;
                map.anisotropicFilteringLevel = 4;
                mapArray.splice(0, 0, map);
                //let debug = false;
                //if (debug) {
                //    let sprite = new Sprite2D(map, { parent: this, x: 10, y: 10, id: "__cachedSpriteOfGroup__Debug", alignToPixel: true });
                //}
                var node = map.allocateRect(roundedScaledSize);
                res = { node: node, texture: map };
            }
            // Check if we have to create a Sprite that will display the content of the Canvas which is cached.
            // Don't do it in case of the group being a worldspace canvas (because its texture is bound to a WorldSpaceCanvas node)
            if (group !== this || this._isScreenSpace) {
                var node = res.node;
                var pos = Canvas2D_1._cv1;
                node.getInnerPosToRef(pos);
                // Special case if the canvas is entirely cached: create a group that will have a single sprite it will be rendered specifically at the very end of the rendering process
                var sprite = void 0;
                if (this._cachingStrategy === Canvas2D_1.CACHESTRATEGY_CANVAS) {
                    if (this._cachedCanvasGroup) {
                        this._cachedCanvasGroup.dispose();
                    }
                    this._cachedCanvasGroup = BABYLON.Group2D._createCachedCanvasGroup(this);
                    sprite = new BABYLON.Sprite2D(map, { parent: this._cachedCanvasGroup, id: "__cachedCanvasSprite__", spriteSize: originalSize, size: size, alignToPixel: true, spriteLocation: pos });
                    sprite.zOrder = 1;
                    sprite.origin = BABYLON.Vector2.Zero();
                }
                else {
                    sprite = new BABYLON.Sprite2D(map, { parent: parent, id: "__cachedSpriteOfGroup__" + group.id, x: group.x, y: group.y, spriteSize: originalSize, size: size, spriteLocation: pos, alignToPixel: true, dontInheritParentScale: true });
                    sprite.origin = group.origin.clone();
                    sprite.addExternalData("__cachedGroup__", group);
                    sprite.pointerEventObservable.add(function (e, s) {
                        if (group.pointerEventObservable !== null) {
                            group.pointerEventObservable.notifyObservers(e, s.mask);
                        }
                    });
                    res.sprite = sprite;
                }
                if (sprite && noResizeScale) {
                    var relScale = isCanvas ? group.actualScale : group.actualScale.divide(group.parent.actualScale);
                    sprite.scaleX = relScale.x;
                    sprite.scaleY = relScale.y;
                }
            }
            return res;
        };
        /**
         * Internal method used to register a Scene Node to track position for the given group
         * Do not invoke this method, for internal purpose only.
         * @param group the group to track its associated Scene Node
         */
        Canvas2D.prototype._registerTrackedNode = function (group) {
            if (group._isFlagSet(BABYLON.SmartPropertyPrim.flagTrackedGroup)) {
                return;
            }
            if (!this._trackedGroups) {
                this._trackedGroups = new Array();
            }
            this._trackedGroups.push(group);
            group._setFlags(BABYLON.SmartPropertyPrim.flagTrackedGroup);
        };
        /**
         * Internal method used to unregister a tracked Scene Node
         * Do not invoke this method, it's for internal purpose only.
         * @param group the group to unregister its tracked Scene Node from.
         */
        Canvas2D.prototype._unregisterTrackedNode = function (group) {
            if (!group._isFlagSet(BABYLON.SmartPropertyPrim.flagTrackedGroup)) {
                return;
            }
            var i = this._trackedGroups.indexOf(group);
            if (i !== -1) {
                this._trackedGroups.splice(i, 1);
            }
            group._clearFlags(BABYLON.SmartPropertyPrim.flagTrackedGroup);
        };
        /**
         * Get a Solid Color Brush instance matching the given color.
         * @param color The color to retrieve
         * @return A shared instance of the SolidColorBrush2D class that use the given color
         */
        Canvas2D.GetSolidColorBrush = function (color) {
            return Canvas2D_1._solidColorBrushes.getOrAddWithFactory(color.toHexString(), function () { return new BABYLON.SolidColorBrush2D(color.clone(), true); });
        };
        /**
         * Get a Solid Color Brush instance matching the given color expressed as a CSS formatted hexadecimal value.
         * @param color The color to retrieve
         * @return A shared instance of the SolidColorBrush2D class that uses the given color
         */
        Canvas2D.GetSolidColorBrushFromHex = function (hexValue) {
            return Canvas2D_1._solidColorBrushes.getOrAddWithFactory(hexValue, function () { return new BABYLON.SolidColorBrush2D(BABYLON.Color4.FromHexString(hexValue), true); });
        };
        /**
         * Get a Gradient Color Brush
         * @param color1 starting color
         * @param color2 engine color
         * @param translation translation vector to apply. default is [0;0]
         * @param rotation rotation in radian to apply to the brush, initial direction is top to bottom. rotation is counter clockwise. default is 0.
         * @param scale scaling factor to apply. default is 1.
         */
        Canvas2D.GetGradientColorBrush = function (color1, color2, translation, rotation, scale) {
            if (translation === void 0) { translation = BABYLON.Vector2.Zero(); }
            if (rotation === void 0) { rotation = 0; }
            if (scale === void 0) { scale = 1; }
            return Canvas2D_1._gradientColorBrushes.getOrAddWithFactory(BABYLON.GradientColorBrush2D.BuildKey(color1, color2, translation, rotation, scale), function () { return new BABYLON.GradientColorBrush2D(color1, color2, translation, rotation, scale, true); });
        };
        /**
         * Create a solid or gradient brush from a string value.
         * @param brushString should be either
         *  - "solid: #RRGGBBAA" or "#RRGGBBAA"
         *  - "gradient: #FF808080, #FFFFFFF[, [10:20], 180, 1]" for color1, color2, translation, rotation (degree), scale. The last three are optionals, but if specified must be is this order. "gradient:" can be omitted.
         */
        Canvas2D.GetBrushFromString = function (brushString) {
            // Note: yes, I hate/don't know RegEx.. Feel free to add your contribution to the cause!
            brushString = brushString.trim();
            var split = brushString.split(",");
            // Solid, formatted as: "[solid:]#FF808080"
            if (split.length === 1) {
                var value = null;
                if (brushString.indexOf("solid:") === 0) {
                    value = brushString.substr(6).trim();
                }
                else if (brushString.indexOf("#") === 0) {
                    value = brushString;
                }
                else {
                    return null;
                }
                return Canvas2D_1.GetSolidColorBrushFromHex(value);
            }
            else {
                if (split[0].indexOf("gradient:") === 0) {
                    split[0] = split[0].substr(9).trim();
                }
                try {
                    var start = BABYLON.Color4.FromHexString(split[0].trim());
                    var end = BABYLON.Color4.FromHexString(split[1].trim());
                    var t = BABYLON.Vector2.Zero();
                    if (split.length > 2) {
                        var v = split[2].trim();
                        if (v.charAt(0) !== "[" || v.charAt(v.length - 1) !== "]") {
                            return null;
                        }
                        var sep = v.indexOf(":");
                        var x = parseFloat(v.substr(1, sep));
                        var y = parseFloat(v.substr(sep + 1, v.length - (sep + 1)));
                        t = new BABYLON.Vector2(x, y);
                    }
                    var r = 0;
                    if (split.length > 3) {
                        r = BABYLON.Tools.ToRadians(parseFloat(split[3].trim()));
                    }
                    var s = 1;
                    if (split.length > 4) {
                        s = parseFloat(split[4].trim());
                    }
                    return Canvas2D_1.GetGradientColorBrush(start, end, t, r, s);
                }
                catch (e) {
                    return null;
                }
            }
        };
        return Canvas2D;
    }(BABYLON.Group2D));
    /**
     * In this strategy only the direct children groups of the Canvas will be cached, their whole content (whatever the sub groups they have) into a single bitmap.
     * This strategy doesn't allow primitives added directly as children of the Canvas.
     * You typically want to use this strategy of a screenSpace fullscreen canvas: you don't want a bitmap cache taking the whole screen resolution but still want the main contents (say UI in the topLeft and rightBottom for instance) to be efficiently cached.
     */
    Canvas2D.CACHESTRATEGY_TOPLEVELGROUPS = 1;
    /**
     * In this strategy each group will have its own cache bitmap (except if a given group explicitly defines the DONTCACHEOVERRIDE or CACHEINPARENTGROUP behaviors).
     * This strategy is typically used if the canvas has some groups that are frequently animated. Unchanged ones will have a steady cache and the others will be refreshed when they change, reducing the redraw operation count to their content only.
     * When using this strategy, group instances can rely on the DONTCACHEOVERRIDE or CACHEINPARENTGROUP behaviors to minimize the amount of cached bitmaps.
     * Note that in this mode the Canvas itself is not cached, it only contains the sprites of its direct children group to render, there's no point to cache the whole canvas, sprites will be rendered pretty efficiently, the memory cost would be too great for the value of it.
     */
    Canvas2D.CACHESTRATEGY_ALLGROUPS = 2;
    /**
     * In this strategy the whole canvas is cached into a single bitmap containing every primitives it owns, at the exception of the ones that are owned by a group having the DONTCACHEOVERRIDE behavior (these primitives will be directly drawn to the viewport at each render for screenSpace Canvas or be part of the Canvas cache bitmap for worldSpace Canvas).
     */
    Canvas2D.CACHESTRATEGY_CANVAS = 3;
    /**
     * This strategy is used to recompose/redraw the canvas entirely at each viewport render.
     * Use this strategy if memory is a concern above rendering performances and/or if the canvas is frequently animated (hence reducing the benefits of caching).
     * Note that you can't use this strategy for WorldSpace Canvas, they need at least a top level group caching.
     */
    Canvas2D.CACHESTRATEGY_DONTCACHE = 4;
    /**
     * Observable Mask to be notified before rendering is made
     */
    Canvas2D.RENDEROBSERVABLE_PRE = 1;
    /**
     * Observable Mask to be notified after rendering is made
     */
    Canvas2D.RENDEROBSERVABLE_POST = 2;
    Canvas2D._INSTANCES = [];
    Canvas2D._zMinDelta = 1 / (Math.pow(2, 24) - 1);
    Canvas2D._interInfo = new BABYLON.IntersectInfo2D();
    Canvas2D._v = BABYLON.Vector3.Zero(); // Must stay zero
    Canvas2D._cv1 = BABYLON.Vector2.Zero(); // Must stay zero
    Canvas2D._m = BABYLON.Matrix.Identity();
    Canvas2D._mI = BABYLON.Matrix.Identity(); // Must stay identity
    Canvas2D.tS = BABYLON.Vector3.Zero();
    Canvas2D.tT = BABYLON.Vector3.Zero();
    Canvas2D.tR = BABYLON.Quaternion.Identity();
    Canvas2D._tmpMtx = BABYLON.Matrix.Identity();
    Canvas2D._tmpVec3 = BABYLON.Vector3.Zero();
    Canvas2D._pCLS = BABYLON.Vector2.Zero();
    /**
     * Define the default size used for both the width and height of a MapTexture to allocate.
     * Note that some MapTexture might be bigger than this size if the first node to allocate is bigger in width or height
     */
    Canvas2D._groupTextureCacheSize = 1024;
    Canvas2D._solidColorBrushes = new BABYLON.StringDictionary();
    Canvas2D._gradientColorBrushes = new BABYLON.StringDictionary();
    __decorate([
        BABYLON.logMethod("==========CANVAS RENDER===============")
    ], Canvas2D.prototype, "_render", null);
    Canvas2D = Canvas2D_1 = __decorate([
        BABYLON.className("Canvas2D", "BABYLON")
        /**
         * The Canvas2D main class.
         * This class is extended in both ScreenSpaceCanvas2D and WorldSpaceCanvas2D which are designed only for semantic use.
         * User creates a Screen or WorldSpace canvas which is a 2D surface area that will draw the primitives that were added as children.
         */
    ], Canvas2D);
    BABYLON.Canvas2D = Canvas2D;
    var WorldSpaceCanvas2D = (function (_super) {
        __extends(WorldSpaceCanvas2D, _super);
        /**
         * Create a new 2D WorldSpace Rendering Canvas, it is a 2D rectangle that has a size (width/height) and a world transformation information to place it in the world space.
         * This kind of canvas can't have its Primitives directly drawn in the Viewport, they need to be cached in a bitmap at some point, as a consequence the DONT_CACHE strategy is unavailable. For now only CACHESTRATEGY_CANVAS is supported, but the remaining strategies will be soon.
         * @param scene the Scene that owns the Canvas
         * @param size the dimension of the Canvas in World Space
         * @param settings a combination of settings, possible ones are
         * - children: an array of direct children primitives
         * - id: a text identifier, for information purpose only, default is null.
         * - unitScaleFactor: if specified the created canvas will be with a width of size.width*unitScaleFactor and a height of size.height.unitScaleFactor. If not specified, the unit of 1 is used. You can use this setting when you're dealing with a 3D world with small coordinates and you need a Canvas having bigger coordinates (typically to display text with better quality).
         * - worldPosition the position of the Canvas in World Space, default is [0,0,0]
         * - worldRotation the rotation of the Canvas in World Space, default is Quaternion.Identity()
         * - trackNode: if you want the WorldSpaceCanvas to track the position/rotation/scale of a given Scene Node, use this setting to specify the Node to track
         * - trackNodeOffset: if you use trackNode you may want to specify a 3D Offset to apply to shift the Canvas
         * - trackNodeBillboard: if true the WorldSpaceCanvas will always face the screen
         * - sideOrientation: Unexpected behavior occur if the value is different from Mesh.DEFAULTSIDE right now, so please use this one, which is the default.
         * - cachingStrategy Must be CACHESTRATEGY_CANVAS for now, which is the default.
         * - enableInteraction: if true the pointer events will be listened and rerouted to the appropriate primitives of the Canvas2D through the Prim2DBase.onPointerEventObservable observable property. Default is false (the opposite of ScreenSpace).
         * - isVisible: true if the canvas must be visible, false for hidden. Default is true.
         * - backgroundRoundRadius: the round radius of the background, either backgroundFill or backgroundBorder must be specified.
         * - backgroundFill: the brush to use to create a background fill for the canvas. can be a string value (see Canvas2D.GetBrushFromString) or a IBrush2D instance.
         * - backgroundBorder: the brush to use to create a background border for the canvas. can be a string value (see Canvas2D.GetBrushFromString) or a IBrush2D instance.
         * - backgroundBorderThickness: if a backgroundBorder is specified, its thickness can be set using this property
         * - customWorldSpaceNode: if specified the Canvas will be rendered in this given Node. But it's the responsibility of the caller to set the "worldSpaceToNodeLocal" property to compute the hit of the mouse ray into the node (in world coordinate system) as well as rendering the cached bitmap in the node itself. The properties cachedRect and cachedTexture of Group2D will give you what you need to do that.
         * - maxAdaptiveCanvasSize: set the max size (width and height) of the bitmap that will contain the cached version of the WorldSpace Canvas. Default is 1024 or less if it's not supported. In any case the value you give will be clipped by the maximum that WebGL supports on the running device. You can set any size, more than 1024 if you want, but testing proved it's a good max value for non "retina" like screens.
         * - paddingTop: top padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - paddingLeft: left padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - paddingRight: right padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - paddingBottom: bottom padding, can be a number (will be pixels) or a string (see PrimitiveThickness.fromString)
         * - padding: top, left, right and bottom padding formatted as a single string (see PrimitiveThickness.fromString)
         */
        function WorldSpaceCanvas2D(scene, size, settings) {
            var _this = this;
            BABYLON.Prim2DBase._isCanvasInit = true;
            var s = settings;
            s.isScreenSpace = false;
            if (settings.unitScaleFactor != null) {
                s.size = size.multiplyByFloats(settings.unitScaleFactor, settings.unitScaleFactor);
            }
            else {
                s.size = size.clone();
            }
            settings.cachingStrategy = (settings.cachingStrategy == null) ? Canvas2D.CACHESTRATEGY_CANVAS : settings.cachingStrategy;
            if (settings.cachingStrategy !== Canvas2D.CACHESTRATEGY_CANVAS) {
                throw new Error("Right now only the CACHESTRATEGY_CANVAS cache Strategy is supported for WorldSpace Canvas. More will come soon!");
            }
            _this = _super.call(this, scene, settings) || this;
            BABYLON.Prim2DBase._isCanvasInit = false;
            _this._unitScaleFactor = (settings.unitScaleFactor != null) ? settings.unitScaleFactor : 1;
            _this._renderableData._useMipMap = true;
            _this._renderableData._anisotropicLevel = 8;
            //if (cachingStrategy === Canvas2D.CACHESTRATEGY_DONTCACHE) {
            //    throw new Error("CACHESTRATEGY_DONTCACHE cache Strategy can't be used for WorldSpace Canvas");
            //}
            _this._trackNode = (settings.trackNode != null) ? settings.trackNode : null;
            _this._trackNodeOffset = (settings.trackNodeOffset != null) ? settings.trackNodeOffset : BABYLON.Vector3.Zero();
            _this._trackNodeBillboard = (settings.trackNodeBillboard != null) ? settings.trackNodeBillboard : true;
            var createWorldSpaceNode = !settings || (settings.customWorldSpaceNode == null);
            _this._customWorldSpaceNode = !createWorldSpaceNode;
            var id = settings ? settings.id || null : null;
            // Set the max size of texture allowed for the adaptive render of the world space canvas cached bitmap
            var capMaxTextSize = _this.engine.getCaps().maxRenderTextureSize;
            var defaultTextSize = (Math.min(capMaxTextSize, 1024)); // Default is 1K if allowed otherwise the max allowed
            if (settings.maxAdaptiveCanvasSize == null) {
                _this._maxAdaptiveWorldSpaceCanvasSize = defaultTextSize;
            }
            else {
                // We still clip the given value with the max allowed, the user may not be aware of these limitations
                _this._maxAdaptiveWorldSpaceCanvasSize = Math.min(settings.maxAdaptiveCanvasSize, capMaxTextSize);
            }
            if (createWorldSpaceNode) {
                var plane = new BABYLON.WorldSpaceCanvas2DNode(id, scene, _this);
                var vertexData = BABYLON.VertexData.CreatePlane({
                    width: size.width,
                    height: size.height,
                    sideOrientation: settings && settings.sideOrientation || BABYLON.Mesh.DEFAULTSIDE
                });
                var mtl = new BABYLON.StandardMaterial(id + "_Material", scene);
                _this.applyCachedTexture(vertexData, mtl);
                vertexData.applyToMesh(plane, true);
                mtl.specularColor = new BABYLON.Color3(0, 0, 0);
                mtl.disableLighting = true;
                mtl.useAlphaFromDiffuseTexture = true;
                if (settings && settings.sideOrientation) {
                    mtl.backFaceCulling = (settings.sideOrientation === BABYLON.Mesh.DEFAULTSIDE || settings.sideOrientation === BABYLON.Mesh.FRONTSIDE);
                }
                plane.position = settings && settings.worldPosition || BABYLON.Vector3.Zero();
                plane.rotationQuaternion = settings && settings.worldRotation || BABYLON.Quaternion.Identity();
                plane.material = mtl;
                _this._worldSpaceNode = plane;
            }
            else {
                _this._worldSpaceNode = settings.customWorldSpaceNode;
                _this.applyCachedTexture(null, null);
            }
            _this.propertyChanged.add(function (e, st) {
                if (e.propertyName !== "isVisible") {
                    return;
                }
                var mesh = _this._worldSpaceNode;
                if (mesh) {
                    mesh.isVisible = e.newValue;
                }
            }, BABYLON.Prim2DBase.isVisibleProperty.flagId);
            return _this;
        }
        WorldSpaceCanvas2D.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (!this._customWorldSpaceNode && this._worldSpaceNode) {
                this._worldSpaceNode.dispose();
                this._worldSpaceNode = null;
            }
        };
        Object.defineProperty(WorldSpaceCanvas2D.prototype, "trackNode", {
            get: function () {
                return this._trackNode;
            },
            set: function (value) {
                if (this._trackNode === value) {
                    return;
                }
                this._trackNode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldSpaceCanvas2D.prototype, "trackNodeOffset", {
            get: function () {
                return this._trackNodeOffset;
            },
            set: function (value) {
                if (!this._trackNodeOffset) {
                    this._trackNodeOffset = value.clone();
                }
                else {
                    this._trackNodeOffset.copyFrom(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldSpaceCanvas2D.prototype, "trackNodeBillboard", {
            get: function () {
                return this._trackNodeBillboard;
            },
            set: function (value) {
                this._trackNodeBillboard = value;
            },
            enumerable: true,
            configurable: true
        });
        return WorldSpaceCanvas2D;
    }(Canvas2D));
    WorldSpaceCanvas2D = __decorate([
        BABYLON.className("WorldSpaceCanvas2D", "BABYLON")
        /**
         * Class to create a WorldSpace Canvas2D.
         */
    ], WorldSpaceCanvas2D);
    BABYLON.WorldSpaceCanvas2D = WorldSpaceCanvas2D;
    var ScreenSpaceCanvas2D = (function (_super) {
        __extends(ScreenSpaceCanvas2D, _super);
        /**
         * Create a new 2D ScreenSpace Rendering Canvas, it is a 2D rectangle that has a size (width/height) and a position relative to the bottom/left corner of the screen.
         * ScreenSpace Canvas will be drawn in the Viewport as a 2D Layer lying to the top of the 3D Scene. Typically used for traditional UI.
         * All caching strategies will be available.
         * PLEASE NOTE: the origin of a Screen Space Canvas is set to [0;0] (bottom/left) which is different than the default origin of a Primitive which is centered [0.5;0.5]
         * @param scene the Scene that owns the Canvas
         * @param settings a combination of settings, possible ones are
         *  - children: an array of direct children primitives
         *  - id: a text identifier, for information purpose only
         *  - x: the position along the x axis (horizontal), relative to the left edge of the viewport. you can alternatively use the position setting.
         *  - y: the position along the y axis (vertically), relative to the bottom edge of the viewport. you can alternatively use the position setting.
         *  - position: the position of the canvas, relative from the bottom/left of the scene's viewport. Alternatively you can set the x and y properties directly. Default value is [0, 0]
         *  - width: the width of the Canvas. you can alternatively use the size setting.
         *  - height: the height of the Canvas. you can alternatively use the size setting.
         *  - size: the Size of the canvas. Alternatively the width and height properties can be set. If null two behaviors depend on the cachingStrategy: if it's CACHESTRATEGY_CACHECANVAS then it will always auto-fit the rendering device, in all the other modes it will fit the content of the Canvas
         *  - renderingPhase: you can specify for which camera and which renderGroup this canvas will render to enable interleaving of 3D/2D content through the use of renderinGroup. As a rendering Group is rendered for each camera, you have to specify in the scope of which camera you want the canvas' render to be made. Default behavior will render the Canvas at the very end of the render loop.
         *  - designSize: if you want to set the canvas content based on fixed coordinates whatever the final canvas dimension would be, set this. For instance a designSize of 360*640 will give you the possibility to specify all the children element in this frame. The Canvas' true size will be the HTMLCanvas' size: for instance it could be 720*1280, then a uniform scale of 2 will be applied on the Canvas to keep the absolute coordinates working as expecting. If the ratios of the designSize and the true Canvas size are not the same, then the scale is computed following the designUseHorizAxis member by using either the size of the horizontal axis or the vertical axis.
         *  - designUseHorizAxis: you can set this member if you use designSize to specify which axis is priority to compute the scale when the ratio of the canvas' size is different from the designSize's one.
         *  - cachingStrategy: either CACHESTRATEGY_TOPLEVELGROUPS, CACHESTRATEGY_ALLGROUPS, CACHESTRATEGY_CANVAS, CACHESTRATEGY_DONTCACHE. Please refer to their respective documentation for more information. Default is Canvas2D.CACHESTRATEGY_DONTCACHE
         *  - enableInteraction: if true the pointer events will be listened and rerouted to the appropriate primitives of the Canvas2D through the Prim2DBase.onPointerEventObservable observable property. Default is true.
         *  - isVisible: true if the canvas must be visible, false for hidden. Default is true.
         * - backgroundRoundRadius: the round radius of the background, either backgroundFill or backgroundBorder must be specified.
         * - backgroundFill: the brush to use to create a background fill for the canvas. can be a string value (see BABYLON.Canvas2D.GetBrushFromString) or a IBrush2D instance.
         * - backgroundBorder: the brush to use to create a background border for the canvas. can be a string value (see BABYLON.Canvas2D.GetBrushFromString) or a IBrush2D instance.
         * - backgroundBorderThickness: if a backgroundBorder is specified, its thickness can be set using this property
         * - customWorldSpaceNode: if specified the Canvas will be rendered in this given Node. But it's the responsibility of the caller to set the "worldSpaceToNodeLocal" property to compute the hit of the mouse ray into the node (in world coordinate system) as well as rendering the cached bitmap in the node itself. The properties cachedRect and cachedTexture of Group2D will give you what you need to do that.
         * - paddingTop: top padding, can be a number (will be pixels) or a string (see BABYLON.PrimitiveThickness.fromString)
         * - paddingLeft: left padding, can be a number (will be pixels) or a string (see BABYLON.PrimitiveThickness.fromString)
         * - paddingRight: right padding, can be a number (will be pixels) or a string (see BABYLON.PrimitiveThickness.fromString)
         * - paddingBottom: bottom padding, can be a number (will be pixels) or a string (see BABYLON.PrimitiveThickness.fromString)
         * - padding: top, left, right and bottom padding formatted as a single string (see BABYLON.PrimitiveThickness.fromString)
         */
        function ScreenSpaceCanvas2D(scene, settings) {
            var _this = this;
            BABYLON.Prim2DBase._isCanvasInit = true;
            _this = _super.call(this, scene, settings) || this;
            return _this;
        }
        return ScreenSpaceCanvas2D;
    }(Canvas2D));
    ScreenSpaceCanvas2D = __decorate([
        BABYLON.className("ScreenSpaceCanvas2D", "BABYLON")
        /**
         * Class to create a ScreenSpace Canvas2D
         */
    ], ScreenSpaceCanvas2D);
    BABYLON.ScreenSpaceCanvas2D = ScreenSpaceCanvas2D;
    var Canvas2D_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.canvas2d.js.map
