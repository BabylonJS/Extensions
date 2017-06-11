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
    var PrepareRender2DContext = (function () {
        function PrepareRender2DContext() {
            this.forceRefreshPrimitive = false;
        }
        return PrepareRender2DContext;
    }());
    BABYLON.PrepareRender2DContext = PrepareRender2DContext;
    var Render2DContext = (function () {
        function Render2DContext(renderMode) {
            this._renderMode = renderMode;
            this.useInstancing = false;
            this.groupInfoPartData = null;
            this.partDataStartIndex = this.partDataEndIndex = null;
            this.instancedBuffers = null;
        }
        Object.defineProperty(Render2DContext.prototype, "renderMode", {
            /**
             * Define which render Mode should be used to render the primitive: one of Render2DContext.RenderModeXxxx property
             */
            get: function () {
                return this._renderMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Render2DContext, "RenderModeOpaque", {
            /**
             * The set of primitives to render is opaque.
             * This is the first rendering pass. All Opaque primitives are rendered. Depth Compare and Write are both enabled.
             */
            get: function () {
                return Render2DContext._renderModeOpaque;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Render2DContext, "RenderModeAlphaTest", {
            /**
             * The set of primitives to render is using Alpha Test (aka masking).
             * Alpha Blend is enabled, the AlphaMode must be manually set, the render occurs after the RenderModeOpaque and is depth independent (i.e. primitives are not sorted by depth). Depth Compare and Write are both enabled.
             */
            get: function () {
                return Render2DContext._renderModeAlphaTest;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Render2DContext, "RenderModeTransparent", {
            /**
             * The set of primitives to render is transparent.
             * Alpha Blend is enabled, the AlphaMode must be manually set, the render occurs after the RenderModeAlphaTest and is depth dependent (i.e. primitives are stored by depth and rendered back to front). Depth Compare is on, but Depth write is Off.
             */
            get: function () {
                return Render2DContext._renderModeTransparent;
            },
            enumerable: true,
            configurable: true
        });
        return Render2DContext;
    }());
    Render2DContext._renderModeOpaque = 1;
    Render2DContext._renderModeAlphaTest = 2;
    Render2DContext._renderModeTransparent = 3;
    BABYLON.Render2DContext = Render2DContext;
    /**
     * This class store information for the pointerEventObservable Observable.
     * The Observable is divided into many sub events (using the Mask feature of the Observable pattern): PointerOver, PointerEnter, PointerDown, PointerMouseWheel, PointerMove, PointerUp, PointerDown, PointerLeave, PointerGotCapture and PointerLostCapture.
     */
    var PrimitivePointerInfo = (function () {
        function PrimitivePointerInfo() {
            this.primitivePointerPos = BABYLON.Vector2.Zero();
            this.tilt = BABYLON.Vector2.Zero();
            this.cancelBubble = false;
        }
        Object.defineProperty(PrimitivePointerInfo, "PointerOver", {
            // The behavior is based on the HTML specifications of the Pointer Events (https://www.w3.org/TR/pointerevents/#list-of-pointer-events). This is not 100% compliant and not meant to be, but still, it's based on these specs for most use cases to be programmed the same way (as closest as possible) as it would have been in HTML.
            /**
             * This event type is raised when a pointing device is moved into the hit test boundaries of a primitive.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerOver;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerEnter", {
            /**
             * This event type is raised when a pointing device is moved into the hit test boundaries of a primitive or one of its descendants.
             * Bubbles: no
             */
            get: function () {
                return PrimitivePointerInfo._pointerEnter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerDown", {
            /**
             * This event type is raised when a pointer enters the active button state (non-zero value in the buttons property). For mouse it's when the device transitions from no buttons depressed to at least one button depressed. For touch/pen this is when a physical contact is made.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerDown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerMouseWheel", {
            /**
             * This event type is raised when the pointer is a mouse and it's wheel is rolling
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerMouseWheel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerMove", {
            /**
             * This event type is raised when a pointer change coordinates or when a pointer changes button state, pressure, tilt, or contact geometry and the circumstances produce no other pointers events.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerMove;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerUp", {
            /**
             * This event type is raised when the pointer leaves the active buttons states (zero value in the buttons property). For mouse, this is when the device transitions from at least one button depressed to no buttons depressed. For touch/pen, this is when physical contact is removed.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerUp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerOut", {
            /**
             * This event type is raised when a pointing device is moved out of the hit test the boundaries of a primitive.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerOut;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerLeave", {
            /**
             * This event type is raised when a pointing device is moved out of the hit test boundaries of a primitive and all its descendants.
             * Bubbles: no
             */
            get: function () {
                return PrimitivePointerInfo._pointerLeave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerGotCapture", {
            /**
             * This event type is raised when a primitive receives the pointer capture. This event is fired at the element that is receiving pointer capture. Subsequent events for that pointer will be fired at this element.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerGotCapture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "PointerLostCapture", {
            /**
             * This event type is raised after pointer capture is released for a pointer.
             * Bubbles: yes
             */
            get: function () {
                return PrimitivePointerInfo._pointerLostCapture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitivePointerInfo, "MouseWheelPrecision", {
            get: function () {
                return PrimitivePointerInfo._mouseWheelPrecision;
            },
            enumerable: true,
            configurable: true
        });
        PrimitivePointerInfo.prototype.updateRelatedTarget = function (prim, primPointerPos) {
            this.relatedTarget = prim;
            this.relatedTargetPointerPos = primPointerPos;
        };
        PrimitivePointerInfo.getEventTypeName = function (mask) {
            switch (mask) {
                case PrimitivePointerInfo.PointerOver: return "PointerOver";
                case PrimitivePointerInfo.PointerEnter: return "PointerEnter";
                case PrimitivePointerInfo.PointerDown: return "PointerDown";
                case PrimitivePointerInfo.PointerMouseWheel: return "PointerMouseWheel";
                case PrimitivePointerInfo.PointerMove: return "PointerMove";
                case PrimitivePointerInfo.PointerUp: return "PointerUp";
                case PrimitivePointerInfo.PointerOut: return "PointerOut";
                case PrimitivePointerInfo.PointerLeave: return "PointerLeave";
                case PrimitivePointerInfo.PointerGotCapture: return "PointerGotCapture";
                case PrimitivePointerInfo.PointerLostCapture: return "PointerLostCapture";
            }
        };
        return PrimitivePointerInfo;
    }());
    PrimitivePointerInfo._pointerOver = 0x0001;
    PrimitivePointerInfo._pointerEnter = 0x0002;
    PrimitivePointerInfo._pointerDown = 0x0004;
    PrimitivePointerInfo._pointerMouseWheel = 0x0008;
    PrimitivePointerInfo._pointerMove = 0x0010;
    PrimitivePointerInfo._pointerUp = 0x0020;
    PrimitivePointerInfo._pointerOut = 0x0040;
    PrimitivePointerInfo._pointerLeave = 0x0080;
    PrimitivePointerInfo._pointerGotCapture = 0x0100;
    PrimitivePointerInfo._pointerLostCapture = 0x0200;
    PrimitivePointerInfo._mouseWheelPrecision = 3.0;
    BABYLON.PrimitivePointerInfo = PrimitivePointerInfo;
    /**
     * Defines the horizontal and vertical alignment information for a Primitive.
     */
    var PrimitiveAlignment = PrimitiveAlignment_1 = (function () {
        function PrimitiveAlignment(changeCallback) {
            this._changedCallback = changeCallback;
            this._horizontal = PrimitiveAlignment_1.AlignLeft;
            this._vertical = PrimitiveAlignment_1.AlignBottom;
        }
        Object.defineProperty(PrimitiveAlignment, "AlignLeft", {
            /**
             * Alignment is made relative to the left edge of the Primitive. Valid for horizontal alignment only.
             */
            get: function () { return PrimitiveAlignment_1._AlignLeft; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment, "AlignTop", {
            /**
             * Alignment is made relative to the top edge of the Primitive. Valid for vertical alignment only.
             */
            get: function () { return PrimitiveAlignment_1._AlignTop; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment, "AlignRight", {
            /**
             * Alignment is made relative to the right edge of the Primitive. Valid for horizontal alignment only.
             */
            get: function () { return PrimitiveAlignment_1._AlignRight; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment, "AlignBottom", {
            /**
             * Alignment is made relative to the bottom edge of the Primitive. Valid for vertical alignment only.
             */
            get: function () { return PrimitiveAlignment_1._AlignBottom; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment, "AlignCenter", {
            /**
             * Alignment is made to center the content from equal distance to the opposite edges of the Primitive
             */
            get: function () { return PrimitiveAlignment_1._AlignCenter; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment, "AlignStretch", {
            /**
             * The content is stretched toward the opposite edges of the Primitive
             */
            get: function () { return PrimitiveAlignment_1._AlignStretch; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment.prototype, "horizontal", {
            /**
             * Get/set the horizontal alignment. Use one of the AlignXXX static properties of this class
             */
            get: function () {
                return this._horizontal;
            },
            set: function (value) {
                if (this._horizontal === value) {
                    return;
                }
                this._horizontal = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveAlignment.prototype, "vertical", {
            /**
             * Get/set the vertical alignment. Use one of the AlignXXX static properties of this class
             */
            get: function () {
                return this._vertical;
            },
            set: function (value) {
                if (this._vertical === value) {
                    return;
                }
                this._vertical = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        PrimitiveAlignment.prototype.onChangeCallback = function () {
            if (this._changedCallback) {
                this._changedCallback();
            }
        };
        /**
         * Set the horizontal alignment from a string value.
         * @param text can be either: 'left','right','center','stretch'
         */
        PrimitiveAlignment.prototype.setHorizontal = function (text) {
            var v = text.trim().toLocaleLowerCase();
            switch (v) {
                case "left":
                    this.horizontal = PrimitiveAlignment_1.AlignLeft;
                    return;
                case "right":
                    this.horizontal = PrimitiveAlignment_1.AlignRight;
                    return;
                case "center":
                    this.horizontal = PrimitiveAlignment_1.AlignCenter;
                    return;
                case "stretch":
                    this.horizontal = PrimitiveAlignment_1.AlignStretch;
                    return;
            }
        };
        /**
         * Set the vertical alignment from a string value.
         * @param text can be either: 'top','bottom','center','stretch'
         */
        PrimitiveAlignment.prototype.setVertical = function (text) {
            var v = text.trim().toLocaleLowerCase();
            switch (v) {
                case "top":
                    this.vertical = PrimitiveAlignment_1.AlignTop;
                    return;
                case "bottom":
                    this.vertical = PrimitiveAlignment_1.AlignBottom;
                    return;
                case "center":
                    this.vertical = PrimitiveAlignment_1.AlignCenter;
                    return;
                case "stretch":
                    this.vertical = PrimitiveAlignment_1.AlignStretch;
                    return;
            }
        };
        /**
         * Set the horizontal and or vertical alignments from a string value.
         * @param text can be: [<h:|horizontal:><left|right|center|stretch>], [<v:|vertical:><top|bottom|center|stretch>]
         */
        PrimitiveAlignment.prototype.fromString = function (value) {
            var m = value.trim().split(",");
            var hset = false;
            var vset = false;
            for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
                var v = m_1[_i];
                v = v.toLocaleLowerCase().trim();
                // Horizontal
                var i = v.indexOf("h:");
                if (i === -1) {
                    i = v.indexOf("horizontal:");
                }
                if (i !== -1) {
                    v = v.substr(v.indexOf(":") + 1);
                    this.setHorizontal(v);
                    hset = true;
                    continue;
                }
                // Vertical
                i = v.indexOf("v:");
                if (i === -1) {
                    i = v.indexOf("vertical:");
                }
                if (i !== -1) {
                    v = v.substr(v.indexOf(":") + 1);
                    this.setVertical(v);
                    vset = true;
                    continue;
                }
            }
            if (!hset && !vset && m.length === 1) {
                this.setHorizontal(m[0]);
                this.setVertical(m[0]);
            }
        };
        PrimitiveAlignment.prototype.copyFrom = function (pa) {
            this._horizontal = pa._horizontal;
            this._vertical = pa._vertical;
            this.onChangeCallback();
        };
        PrimitiveAlignment.prototype.clone = function () {
            var pa = new PrimitiveAlignment_1();
            pa._horizontal = this._horizontal;
            pa._vertical = this._vertical;
            return pa;
        };
        Object.defineProperty(PrimitiveAlignment.prototype, "isDefault", {
            get: function () {
                return this.horizontal === PrimitiveAlignment_1.AlignLeft && this.vertical === PrimitiveAlignment_1.AlignBottom;
            },
            enumerable: true,
            configurable: true
        });
        return PrimitiveAlignment;
    }());
    PrimitiveAlignment._AlignLeft = 1;
    PrimitiveAlignment._AlignTop = 1; // Same as left
    PrimitiveAlignment._AlignRight = 2;
    PrimitiveAlignment._AlignBottom = 2; // Same as right
    PrimitiveAlignment._AlignCenter = 3;
    PrimitiveAlignment._AlignStretch = 4;
    PrimitiveAlignment = PrimitiveAlignment_1 = __decorate([
        BABYLON.className("PrimitiveAlignment", "BABYLON")
    ], PrimitiveAlignment);
    BABYLON.PrimitiveAlignment = PrimitiveAlignment;
    /**
     * Stores information about a Primitive that was intersected
     */
    var PrimitiveIntersectedInfo = (function () {
        function PrimitiveIntersectedInfo(prim, intersectionLocation) {
            this.prim = prim;
            this.intersectionLocation = intersectionLocation;
        }
        return PrimitiveIntersectedInfo;
    }());
    BABYLON.PrimitiveIntersectedInfo = PrimitiveIntersectedInfo;
    /**
     * Define a thickness toward every edges of a Primitive to allow margin and padding.
     * The thickness can be expressed as pixels, percentages, inherit the value of the parent primitive or be auto.
     */
    var PrimitiveThickness = PrimitiveThickness_1 = (function () {
        function PrimitiveThickness(parentAccess, changedCallback) {
            this._parentAccess = parentAccess;
            this._changedCallback = changedCallback;
            this._pixels = new Array(4);
            this._percentages = new Array(4);
            this._setType(0, PrimitiveThickness_1.Auto);
            this._setType(1, PrimitiveThickness_1.Auto);
            this._setType(2, PrimitiveThickness_1.Auto);
            this._setType(3, PrimitiveThickness_1.Auto);
            this._pixels[0] = 0;
            this._pixels[1] = 0;
            this._pixels[2] = 0;
            this._pixels[3] = 0;
        }
        /**
         * Set the thickness from a string value
         * @param thickness format is "top: <value>, left:<value>, right:<value>, bottom:<value>" or "<value>" (same for all edges) each are optional, auto will be set if it's omitted.
         * Values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
         */
        PrimitiveThickness.prototype.fromString = function (thickness) {
            this._clear();
            var m = thickness.trim().split(",");
            // Special case, one value to apply to all edges
            if (m.length === 1 && thickness.indexOf(":") === -1) {
                this._setStringValue(m[0], 0, false);
                this._setStringValue(m[0], 1, false);
                this._setStringValue(m[0], 2, false);
                this._setStringValue(m[0], 3, false);
                this.onChangeCallback();
                return;
            }
            var res = false;
            for (var _i = 0, m_2 = m; _i < m_2.length; _i++) {
                var cm = m_2[_i];
                res = this._extractString(cm, false) || res;
            }
            if (!res) {
                throw new Error("Can't parse the string to create a PrimitiveMargin object, format must be: 'top: <value>, left:<value>, right:<value>, bottom:<value>");
            }
            // Check the margin that weren't set and set them in auto
            if ((this._flags & 0x000F) === 0)
                this._flags |= PrimitiveThickness_1.Pixel << 0;
            if ((this._flags & 0x00F0) === 0)
                this._flags |= PrimitiveThickness_1.Pixel << 4;
            if ((this._flags & 0x0F00) === 0)
                this._flags |= PrimitiveThickness_1.Pixel << 8;
            if ((this._flags & 0xF000) === 0)
                this._flags |= PrimitiveThickness_1.Pixel << 12;
            this.onChangeCallback();
        };
        /**
         * Set the thickness from multiple string
         * Possible values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
         * @param top the top thickness to set
         * @param left the left thickness to set
         * @param right the right thickness to set
         * @param bottom the bottom thickness to set
         */
        PrimitiveThickness.prototype.fromStrings = function (top, left, right, bottom) {
            this._clear();
            this._setStringValue(top, 0, false);
            this._setStringValue(left, 1, false);
            this._setStringValue(right, 2, false);
            this._setStringValue(bottom, 3, false);
            this.onChangeCallback();
            return this;
        };
        /**
         * Set the thickness from pixel values
         * @param top the top thickness in pixels to set
         * @param left the left thickness in pixels to set
         * @param right the right thickness in pixels to set
         * @param bottom the bottom thickness in pixels to set
         */
        PrimitiveThickness.prototype.fromPixels = function (top, left, right, bottom) {
            this._clear();
            this._pixels[0] = top;
            this._pixels[1] = left;
            this._pixels[2] = right;
            this._pixels[3] = bottom;
            this.onChangeCallback();
            return this;
        };
        /**
         * Apply the same pixel value to all edges
         * @param margin the value to set, in pixels.
         */
        PrimitiveThickness.prototype.fromUniformPixels = function (margin) {
            this._clear();
            this._pixels[0] = margin;
            this._pixels[1] = margin;
            this._pixels[2] = margin;
            this._pixels[3] = margin;
            this.onChangeCallback();
            return this;
        };
        PrimitiveThickness.prototype.copyFrom = function (pt) {
            this._clear();
            for (var i = 0; i < 4; i++) {
                this._pixels[i] = pt._pixels[i];
                this._percentages[i] = pt._percentages[i];
            }
            this._flags = pt._flags;
            this.onChangeCallback();
        };
        /**
         * Set all edges in auto
         */
        PrimitiveThickness.prototype.auto = function () {
            this._clear();
            this._flags = (PrimitiveThickness_1.Auto << 0) | (PrimitiveThickness_1.Auto << 4) | (PrimitiveThickness_1.Auto << 8) | (PrimitiveThickness_1.Auto << 12);
            this._pixels[0] = 0;
            this._pixels[1] = 0;
            this._pixels[2] = 0;
            this._pixels[3] = 0;
            this.onChangeCallback();
            return this;
        };
        PrimitiveThickness.prototype._clear = function () {
            this._flags = 0;
            this._pixels[0] = 0;
            this._pixels[1] = 0;
            this._pixels[2] = 0;
            this._pixels[3] = 0;
            this._percentages[0] = null;
            this._percentages[1] = null;
            this._percentages[2] = null;
            this._percentages[3] = null;
        };
        PrimitiveThickness.prototype._extractString = function (value, emitChanged) {
            var v = value.trim().toLocaleLowerCase();
            if (v.indexOf("top:") === 0) {
                v = v.substr(4).trim();
                return this._setStringValue(v, 0, emitChanged);
            }
            if (v.indexOf("left:") === 0) {
                v = v.substr(5).trim();
                return this._setStringValue(v, 1, emitChanged);
            }
            if (v.indexOf("right:") === 0) {
                v = v.substr(6).trim();
                return this._setStringValue(v, 2, emitChanged);
            }
            if (v.indexOf("bottom:") === 0) {
                v = v.substr(7).trim();
                return this._setStringValue(v, 3, emitChanged);
            }
            return false;
        };
        PrimitiveThickness.prototype._setStringValue = function (value, index, emitChanged) {
            // Check for auto
            var v = value.trim().toLocaleLowerCase();
            if (v === "auto") {
                if (this._isType(index, PrimitiveThickness_1.Auto)) {
                    return true;
                }
                this._setType(index, PrimitiveThickness_1.Auto);
                this._pixels[index] = 0;
                if (emitChanged) {
                    this.onChangeCallback();
                }
            }
            else if (v === "inherit") {
                if (this._isType(index, PrimitiveThickness_1.Inherit)) {
                    return true;
                }
                this._setType(index, PrimitiveThickness_1.Inherit);
                this._pixels[index] = null;
                if (emitChanged) {
                    this.onChangeCallback();
                }
            }
            else {
                var pI = v.indexOf("%");
                // Check for percentage
                if (pI !== -1) {
                    var n_1 = v.substr(0, pI);
                    var number_1 = Math.round(Number(n_1)) / 100; // Normalize the percentage to [0;1] with a 0.01 precision
                    if (this._isType(index, PrimitiveThickness_1.Percentage) && (this._percentages[index] === number_1)) {
                        return true;
                    }
                    this._setType(index, PrimitiveThickness_1.Percentage);
                    if (isNaN(number_1)) {
                        return false;
                    }
                    this._percentages[index] = number_1;
                    if (emitChanged) {
                        this.onChangeCallback();
                    }
                    return true;
                }
                // Check for pixel
                var n = void 0;
                pI = v.indexOf("px");
                if (pI !== -1) {
                    n = v.substr(0, pI).trim();
                }
                else {
                    n = v;
                }
                var number = Number(n);
                if (this._isType(index, PrimitiveThickness_1.Pixel) && (this._pixels[index] === number)) {
                    return true;
                }
                if (isNaN(number)) {
                    return false;
                }
                this._pixels[index] = number;
                this._setType(index, PrimitiveThickness_1.Pixel);
                if (emitChanged) {
                    this.onChangeCallback();
                }
                return true;
            }
        };
        PrimitiveThickness.prototype._setPixels = function (value, index, emitChanged) {
            // Round the value because, well, it's the thing to do! Otherwise we'll have sub-pixel stuff, and the no change comparison just below will almost never work for PrimitiveThickness values inside a hierarchy of Primitives
            value = Math.round(value);
            if (this._isType(index, PrimitiveThickness_1.Pixel) && this._pixels[index] === value) {
                return;
            }
            this._setType(index, PrimitiveThickness_1.Pixel);
            this._pixels[index] = value;
            if (emitChanged) {
                this.onChangeCallback();
            }
        };
        PrimitiveThickness.prototype._setPercentage = function (value, index, emitChanged) {
            // Clip Value to bounds
            value = Math.min(1, value);
            value = Math.max(0, value);
            value = Math.round(value * 100) / 100; // 0.01 precision
            if (this._isType(index, PrimitiveThickness_1.Percentage) && this._percentages[index] === value) {
                return;
            }
            this._setType(index, PrimitiveThickness_1.Percentage);
            this._percentages[index] = value;
            if (emitChanged) {
                this.onChangeCallback();
            }
        };
        PrimitiveThickness.prototype._getStringValue = function (index) {
            var f = (this._flags >> (index * 4)) & 0xF;
            switch (f) {
                case PrimitiveThickness_1.Auto:
                    return "auto";
                case PrimitiveThickness_1.Pixel:
                    return this._pixels[index] + "px";
                case PrimitiveThickness_1.Percentage:
                    return this._percentages[index] * 100 + "%";
                case PrimitiveThickness_1.Inherit:
                    return "inherit";
            }
            return "";
        };
        PrimitiveThickness.prototype._isType = function (index, type) {
            var f = (this._flags >> (index * 4)) & 0xF;
            return f === type;
        };
        PrimitiveThickness.prototype._getType = function (index, processInherit) {
            var t = (this._flags >> (index * 4)) & 0xF;
            if (processInherit && (t === PrimitiveThickness_1.Inherit)) {
                var p = this._parentAccess();
                if (p) {
                    return p._getType(index, true);
                }
                return PrimitiveThickness_1.Auto;
            }
            return t;
        };
        PrimitiveThickness.prototype._setType = function (index, type) {
            this._flags &= ~(0xF << (index * 4));
            this._flags |= type << (index * 4);
        };
        PrimitiveThickness.prototype.setTop = function (value) {
            if (typeof value === "string") {
                this._setStringValue(value, 0, true);
            }
            else {
                this.topPixels = value;
            }
        };
        PrimitiveThickness.prototype.setLeft = function (value) {
            if (typeof value === "string") {
                this._setStringValue(value, 1, true);
            }
            else {
                this.leftPixels = value;
            }
        };
        PrimitiveThickness.prototype.setRight = function (value) {
            if (typeof value === "string") {
                this._setStringValue(value, 2, true);
            }
            else {
                this.rightPixels = value;
            }
        };
        PrimitiveThickness.prototype.setBottom = function (value) {
            if (typeof value === "string") {
                this._setStringValue(value, 3, true);
            }
            else {
                this.bottomPixels = value;
            }
        };
        Object.defineProperty(PrimitiveThickness.prototype, "top", {
            /**
             * Get/set the top thickness. Possible values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
             */
            get: function () {
                return this._getStringValue(0);
            },
            set: function (value) {
                this._setStringValue(value, 0, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "left", {
            /**
             * Get/set the left thickness. Possible values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
             */
            get: function () {
                return this._getStringValue(1);
            },
            set: function (value) {
                this._setStringValue(value, 1, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "right", {
            /**
             * Get/set the right thickness. Possible values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
             */
            get: function () {
                return this._getStringValue(2);
            },
            set: function (value) {
                this._setStringValue(value, 2, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "bottom", {
            /**
             * Get/set the bottom thickness. Possible values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
             */
            get: function () {
                return this._getStringValue(3);
            },
            set: function (value) {
                this._setStringValue(value, 3, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "topPixels", {
            /**
             * Get/set the top thickness in pixel.
             */
            get: function () {
                return this._pixels[0];
            },
            set: function (value) {
                this._setPixels(value, 0, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "leftPixels", {
            /**
             * Get/set the left thickness in pixel.
             */
            get: function () {
                return this._pixels[1];
            },
            set: function (value) {
                this._setPixels(value, 1, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "rightPixels", {
            /**
             * Get/set the right thickness in pixel.
             */
            get: function () {
                return this._pixels[2];
            },
            set: function (value) {
                this._setPixels(value, 2, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "bottomPixels", {
            /**
             * Get/set the bottom thickness in pixel.
             */
            get: function () {
                return this._pixels[3];
            },
            set: function (value) {
                this._setPixels(value, 3, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "topPercentage", {
            /**
             * Get/set the top thickness in percentage.
             * The get will return a valid value only if the edge type is percentage.
             * The Set will change the edge mode if needed
             */
            get: function () {
                return this._percentages[0];
            },
            set: function (value) {
                this._setPercentage(value, 0, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "leftPercentage", {
            /**
             * Get/set the left thickness in percentage.
             * The get will return a valid value only if the edge mode is percentage.
             * The Set will change the edge mode if needed
             */
            get: function () {
                return this._percentages[1];
            },
            set: function (value) {
                this._setPercentage(value, 1, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "rightPercentage", {
            /**
             * Get/set the right thickness in percentage.
             * The get will return a valid value only if the edge mode is percentage.
             * The Set will change the edge mode if needed
             */
            get: function () {
                return this._percentages[2];
            },
            set: function (value) {
                this._setPercentage(value, 2, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "bottomPercentage", {
            /**
             * Get/set the bottom thickness in percentage.
             * The get will return a valid value only if the edge mode is percentage.
             * The Set will change the edge mode if needed
             */
            get: function () {
                return this._percentages[3];
            },
            set: function (value) {
                this._setPercentage(value, 3, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "topMode", {
            /**
             * Get/set the top mode. The setter shouldn't be used, other setters with value should be preferred
             */
            get: function () {
                return this._getType(0, false);
            },
            set: function (mode) {
                this._setType(0, mode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "leftMode", {
            /**
             * Get/set the left mode. The setter shouldn't be used, other setters with value should be preferred
             */
            get: function () {
                return this._getType(1, false);
            },
            set: function (mode) {
                this._setType(1, mode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "rightMode", {
            /**
             * Get/set the right mode. The setter shouldn't be used, other setters with value should be preferred
             */
            get: function () {
                return this._getType(2, false);
            },
            set: function (mode) {
                this._setType(2, mode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "bottomMode", {
            /**
             * Get/set the bottom mode. The setter shouldn't be used, other setters with value should be preferred
             */
            get: function () {
                return this._getType(3, false);
            },
            set: function (mode) {
                this._setType(3, mode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrimitiveThickness.prototype, "isDefault", {
            get: function () {
                return this._flags === 0x1111;
            },
            enumerable: true,
            configurable: true
        });
        PrimitiveThickness.prototype._computePixels = function (index, sourceArea, emitChanged) {
            var type = this._getType(index, false);
            if (type === PrimitiveThickness_1.Inherit) {
                this._parentAccess()._computePixels(index, sourceArea, emitChanged);
                return;
            }
            if (type !== PrimitiveThickness_1.Percentage) {
                return;
            }
            var pixels = ((index === 0 || index === 3) ? sourceArea.height : sourceArea.width) * this._percentages[index];
            this._pixels[index] = pixels;
            if (emitChanged) {
                this.onChangeCallback();
            }
        };
        PrimitiveThickness.prototype.onChangeCallback = function () {
            if (this._changedCallback) {
                this._changedCallback();
            }
        };
        /**
         * Compute the positioning/size of an area considering the thickness of this object and a given alignment
         * @param sourceArea the source area where the content must be sized/positioned
         * @param contentSize the content size to position/resize
         * @param alignment the alignment setting
         * @param dstOffset the position of the content, x, y, z, w are left, bottom, right, top
         * @param dstArea the new size of the content
         */
        PrimitiveThickness.prototype.computeWithAlignment = function (sourceArea, contentSize, alignment, contentScale, dstOffset, dstArea, computeLayoutArea, computeAxis) {
            if (computeLayoutArea === void 0) { computeLayoutArea = false; }
            if (computeAxis === void 0) { computeAxis = PrimitiveThickness_1.ComputeAll; }
            // Fetch some data
            var topType = this._getType(0, true);
            var leftType = this._getType(1, true);
            var rightType = this._getType(2, true);
            var bottomType = this._getType(3, true);
            var hasWidth = contentSize && (contentSize.width != null);
            var hasHeight = contentSize && (contentSize.height != null);
            var sx = contentScale.x;
            var sy = contentScale.y;
            var isx = 1 / sx;
            var isy = 1 / sy;
            var width = hasWidth ? contentSize.width : 0;
            var height = hasHeight ? contentSize.height : 0;
            var isTopAuto = topType === PrimitiveThickness_1.Auto;
            var isLeftAuto = leftType === PrimitiveThickness_1.Auto;
            var isRightAuto = rightType === PrimitiveThickness_1.Auto;
            var isBottomAuto = bottomType === PrimitiveThickness_1.Auto;
            if (computeAxis & PrimitiveThickness_1.ComputeH) {
                switch (alignment.horizontal) {
                    case PrimitiveAlignment.AlignLeft:
                        {
                            var leftPixels = 0;
                            if (!isLeftAuto) {
                                this._computePixels(1, sourceArea, true);
                                leftPixels = this.leftPixels;
                            }
                            dstOffset.x = leftPixels;
                            dstArea.width = width * isx;
                            dstOffset.z = sourceArea.width - (width * sx + leftPixels);
                            if (computeLayoutArea) {
                                var rightPixels = 0;
                                if (!isRightAuto) {
                                    this._computePixels(2, sourceArea, true);
                                    rightPixels = this.rightPixels;
                                }
                                dstArea.width += (leftPixels + rightPixels) * isx;
                            }
                            break;
                        }
                    case PrimitiveAlignment.AlignRight:
                        {
                            var rightPixels = 0;
                            if (!isRightAuto) {
                                this._computePixels(2, sourceArea, true);
                                rightPixels = this.rightPixels;
                            }
                            dstOffset.x = sourceArea.width - (width * sx + rightPixels);
                            dstArea.width = width * isx;
                            dstOffset.z = rightPixels;
                            if (computeLayoutArea) {
                                var leftPixels = 0;
                                if (!isLeftAuto) {
                                    this._computePixels(1, sourceArea, true);
                                    leftPixels = this.leftPixels;
                                }
                                dstArea.width += (leftPixels + rightPixels) * isx;
                            }
                            break;
                        }
                    case PrimitiveAlignment.AlignStretch:
                        {
                            if (isLeftAuto) {
                                dstOffset.x = 0;
                            }
                            else {
                                this._computePixels(1, sourceArea, true);
                                dstOffset.x = this.leftPixels;
                            }
                            var rightPixels = 0;
                            if (!isRightAuto) {
                                this._computePixels(2, sourceArea, true);
                                rightPixels = this.rightPixels;
                            }
                            if (computeLayoutArea) {
                                dstArea.width = sourceArea.width * isx;
                            }
                            else {
                                dstArea.width = (sourceArea.width * isx) - (dstOffset.x + rightPixels) * isx;
                            }
                            dstOffset.z = this.rightPixels;
                            break;
                        }
                    case PrimitiveAlignment.AlignCenter:
                        {
                            var leftPixels = 0;
                            if (!isLeftAuto) {
                                this._computePixels(1, sourceArea, true);
                                leftPixels = this.leftPixels;
                            }
                            var rightPixels = 0;
                            if (!isRightAuto) {
                                this._computePixels(2, sourceArea, true);
                                rightPixels = this.rightPixels;
                            }
                            var center = ((sourceArea.width - (width * sx)) / 2);
                            dstOffset.x = center + (leftPixels - rightPixels);
                            if (computeLayoutArea) {
                                dstArea.width = (width * isx) + (this.leftPixels + this.rightPixels) * isx;
                            }
                            else {
                                dstArea.width = (width * isx);
                            }
                            dstOffset.z = rightPixels + center;
                            break;
                        }
                }
            }
            if (computeAxis & PrimitiveThickness_1.ComputeV) {
                switch (alignment.vertical) {
                    case PrimitiveAlignment.AlignBottom:
                        {
                            var bottomPixels = 0;
                            if (!isBottomAuto) {
                                this._computePixels(3, sourceArea, true);
                                bottomPixels = this.bottomPixels;
                            }
                            dstOffset.y = bottomPixels;
                            dstArea.height = height * isy;
                            dstOffset.w = sourceArea.height - (height * sy + bottomPixels);
                            if (computeLayoutArea) {
                                var topPixels = 0;
                                if (!isTopAuto) {
                                    this._computePixels(0, sourceArea, true);
                                    topPixels = this.topPixels;
                                }
                                dstArea.height += (bottomPixels + topPixels) * isy;
                            }
                            break;
                        }
                    case PrimitiveAlignment.AlignTop:
                        {
                            var topPixels = 0;
                            if (!isTopAuto) {
                                this._computePixels(0, sourceArea, true);
                                topPixels = this.topPixels;
                            }
                            dstOffset.y = sourceArea.height - ((height * sy) + topPixels);
                            dstArea.height = height * isy;
                            dstOffset.w = topPixels;
                            if (computeLayoutArea) {
                                var bottomPixels = 0;
                                if (!isBottomAuto) {
                                    this._computePixels(3, sourceArea, true);
                                    bottomPixels = this.bottomPixels;
                                }
                                dstArea.height += (bottomPixels + topPixels) * isy;
                            }
                            break;
                        }
                    case PrimitiveAlignment.AlignStretch:
                        {
                            var bottom = 0;
                            if (!isBottomAuto) {
                                this._computePixels(3, sourceArea, true);
                                bottom = this.bottomPixels;
                            }
                            dstOffset.y = bottom;
                            var top_1 = 0;
                            if (!isTopAuto) {
                                this._computePixels(0, sourceArea, true);
                                top_1 = this.topPixels;
                            }
                            dstOffset.w = top_1;
                            if (computeLayoutArea) {
                                dstArea.height = sourceArea.height * isy;
                            }
                            else {
                                dstArea.height = (sourceArea.height * isy) - (top_1 + bottom) * isy;
                            }
                            break;
                        }
                    case PrimitiveAlignment.AlignCenter:
                        {
                            var bottomPixels = 0;
                            if (!isBottomAuto) {
                                this._computePixels(3, sourceArea, true);
                                bottomPixels = this.bottomPixels;
                            }
                            var topPixels = 0;
                            if (!isTopAuto) {
                                this._computePixels(0, sourceArea, true);
                                topPixels = this.topPixels;
                            }
                            var center = ((sourceArea.height - (height * sy)) / 2);
                            dstOffset.y = center + (bottomPixels - topPixels);
                            if (computeLayoutArea) {
                                dstArea.height = (height * isy) + (bottomPixels + topPixels) * isy;
                            }
                            else {
                                dstArea.height = (height * isy);
                            }
                            dstOffset.w = topPixels + center;
                            break;
                        }
                }
            }
        };
        /**
         * Compute an area and its position considering this thickness properties based on a given source area
         * @param sourceArea the source area
         * @param dstOffset the position of the resulting area
         * @param dstArea the size of the resulting area
         */
        PrimitiveThickness.prototype.compute = function (sourceArea, dstOffset, dstArea, computeLayoutArea) {
            if (computeLayoutArea === void 0) { computeLayoutArea = false; }
            this._computePixels(0, sourceArea, true);
            this._computePixels(1, sourceArea, true);
            this._computePixels(2, sourceArea, true);
            this._computePixels(3, sourceArea, true);
            dstOffset.x = this.leftPixels;
            if (computeLayoutArea) {
                dstArea.width = (sourceArea.width) + (dstOffset.x + this.rightPixels);
            }
            else {
                dstArea.width = (sourceArea.width) - (dstOffset.x + this.rightPixels);
            }
            dstOffset.y = this.bottomPixels;
            if (computeLayoutArea) {
                dstArea.height = (sourceArea.height) + (dstOffset.y + this.topPixels);
            }
            else {
                dstArea.height = (sourceArea.height) - (dstOffset.y + this.topPixels);
            }
            dstOffset.z = this.rightPixels;
            dstOffset.w = this.topPixels;
        };
        /**
         * Compute an area considering this thickness properties based on a given source area
         * @param sourceArea the source area
         * @param result the resulting area
         */
        PrimitiveThickness.prototype.computeArea = function (sourceArea, sourceScale, result) {
            this._computePixels(0, sourceArea, true);
            this._computePixels(1, sourceArea, true);
            this._computePixels(2, sourceArea, true);
            this._computePixels(3, sourceArea, true);
            result.width = this.leftPixels + (sourceArea.width * sourceScale.x) + this.rightPixels;
            result.height = this.bottomPixels + (sourceArea.height * sourceScale.y) + this.topPixels;
        };
        PrimitiveThickness.prototype.enlarge = function (sourceArea, sourceScale, dstOffset, enlargedArea) {
            this._computePixels(0, sourceArea, true);
            this._computePixels(1, sourceArea, true);
            this._computePixels(2, sourceArea, true);
            this._computePixels(3, sourceArea, true);
            dstOffset.x = this.leftPixels;
            enlargedArea.width = (sourceArea.width * sourceScale.x) + (dstOffset.x + this.rightPixels);
            dstOffset.y = this.bottomPixels;
            enlargedArea.height = (sourceArea.height * sourceScale.y) + (dstOffset.y + this.topPixels);
            dstOffset.z = this.rightPixels;
            dstOffset.w = this.topPixels;
        };
        return PrimitiveThickness;
    }());
    PrimitiveThickness.Auto = 0x1;
    PrimitiveThickness.Inherit = 0x2;
    PrimitiveThickness.Percentage = 0x4;
    PrimitiveThickness.Pixel = 0x8;
    PrimitiveThickness.ComputeH = 0x1;
    PrimitiveThickness.ComputeV = 0x2;
    PrimitiveThickness.ComputeAll = 0x03;
    PrimitiveThickness = PrimitiveThickness_1 = __decorate([
        BABYLON.className("PrimitiveThickness", "BABYLON")
    ], PrimitiveThickness);
    BABYLON.PrimitiveThickness = PrimitiveThickness;
    /**
     * Main class used for the Primitive Intersection API
     */
    var IntersectInfo2D = (function () {
        function IntersectInfo2D() {
            this.findFirstOnly = false;
            this.intersectHidden = false;
            this.pickPosition = BABYLON.Vector2.Zero();
        }
        Object.defineProperty(IntersectInfo2D.prototype, "isIntersected", {
            /**
             * true if at least one primitive intersected during the test
             */
            get: function () {
                return this.intersectedPrimitives && this.intersectedPrimitives.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        IntersectInfo2D.prototype.isPrimIntersected = function (prim) {
            for (var _i = 0, _a = this.intersectedPrimitives; _i < _a.length; _i++) {
                var cur = _a[_i];
                if (cur.prim === prim) {
                    return cur.intersectionLocation;
                }
            }
            return null;
        };
        // Internals, don't use
        IntersectInfo2D.prototype._exit = function (firstLevel) {
            if (firstLevel) {
                this._globalPickPosition = null;
            }
        };
        return IntersectInfo2D;
    }());
    BABYLON.IntersectInfo2D = IntersectInfo2D;
    var Prim2DBase = Prim2DBase_1 = (function (_super) {
        __extends(Prim2DBase, _super);
        function Prim2DBase(settings) {
            var _this = this;
            // Avoid checking every time if the object exists
            if (settings == null) {
                settings = {};
            }
            // BASE CLASS CALL
            _this = _super.call(this) || this;
            // Fetch the owner, parent. There're many ways to do it and we can end up with nothing for both
            var owner;
            var parent;
            if (Prim2DBase_1._isCanvasInit) {
                owner = _this;
                parent = null;
                _this._canvasPreInit(settings);
            }
            else {
                if (settings.parent != null) {
                    parent = settings.parent;
                    owner = settings.parent.owner;
                    if (!owner) {
                        throw new Error("Parent " + parent.id + " of " + settings.id + " doesn't have a valid owner!");
                    }
                    if (!(_this instanceof BABYLON.Group2D) && !(_this instanceof BABYLON.Sprite2D && settings.id != null && settings.id.indexOf("__cachedSpriteOfGroup__") === 0) && (owner.cachingStrategy === BABYLON.Canvas2D.CACHESTRATEGY_TOPLEVELGROUPS) && (parent === owner)) {
                        throw new Error("Can't create a primitive with the canvas as direct parent when the caching strategy is TOPLEVELGROUPS. You need to create a Group below the canvas and use it as the parent for the primitive");
                    }
                }
            }
            // Fields initialization
            _this._layoutEngine = BABYLON.CanvasLayoutEngine.Singleton;
            _this._size = null; //Size.Zero();
            _this._scale = new BABYLON.Vector2(1, 1);
            _this._postScale = new BABYLON.Vector2(1, 1);
            _this._actualSize = null;
            _this._internalSize = BABYLON.Size.Zero();
            _this._layoutArea = null;
            _this._layoutAreaPos = null;
            _this._layoutBoundingInfo = null;
            _this._marginOffset = BABYLON.Vector4.Zero();
            _this._paddingOffset = BABYLON.Vector4.Zero();
            _this._parentPaddingOffset = BABYLON.Vector2.Zero();
            _this._parentContentArea = BABYLON.Size.Zero();
            _this._lastAutoSizeArea = BABYLON.Size.Zero();
            _this._contentArea = BABYLON.Size.Zero();
            _this._pointerEventObservable = new BABYLON.Observable();
            _this._owner = owner;
            _this._parent = null;
            _this._margin = null;
            _this._padding = null;
            _this._marginAlignment = null;
            _this._id = settings.id;
            _this._children = new Array();
            _this._localTransform = new BABYLON.Matrix2D();
            _this._localLayoutTransform = new BABYLON.Matrix2D();
            _this._globalTransform = null;
            _this._invGlobalTransform = null;
            _this._globalTransformProcessStep = 0;
            _this._globalTransformStep = 0;
            _this._prepareProcessStep = 0;
            _this._updateCachesProcessStep = 0;
            _this._renderGroup = null;
            _this._primLinearPosition = 0;
            _this._manualZOrder = null;
            _this._zOrder = 0;
            _this._zMax = 0;
            _this._firstZDirtyIndex = Prim2DBase_1._bigInt;
            _this._actualOpacity = 0;
            _this._actualScale = BABYLON.Vector2.Zero();
            _this._displayDebugAreas = false;
            _this._debugAreaGroup = null;
            _this._primTriArray = null;
            _this._primTriArrayDirty = true;
            if (owner) {
                _this.onSetOwner();
            }
            _this._levelBoundingInfo.worldMatrixAccess = function () { return _this.globalTransform; };
            _this._boundingInfo.worldMatrixAccess = function () { return _this.globalTransform; };
            var isPickable = true;
            var isContainer = true;
            if (settings.isPickable !== undefined) {
                isPickable = settings.isPickable;
            }
            if (settings.isContainer !== undefined) {
                isContainer = settings.isContainer;
            }
            if (settings.dontInheritParentScale) {
                _this._setFlags(BABYLON.SmartPropertyPrim.flagDontInheritParentScale);
            }
            if (settings.alignToPixel) {
                _this.alignToPixel = true;
            }
            _this._setFlags((isPickable ? BABYLON.SmartPropertyPrim.flagIsPickable : 0) | BABYLON.SmartPropertyPrim.flagBoundingInfoDirty | BABYLON.SmartPropertyPrim.flagActualOpacityDirty | (isContainer ? BABYLON.SmartPropertyPrim.flagIsContainer : 0) | BABYLON.SmartPropertyPrim.flagActualScaleDirty | BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty);
            if (settings.opacity != null) {
                _this._opacity = settings.opacity;
            }
            else {
                _this._opacity = 1;
            }
            _this._updateRenderMode();
            if (settings.childrenFlatZOrder) {
                _this._setFlags(BABYLON.SmartPropertyPrim.flagChildrenFlatZOrder);
            }
            // If the parent is given, initialize the hierarchy/owner related data
            if (parent != null) {
                parent.addChild(_this);
                _this._hierarchyDepth = parent._hierarchyDepth + 1;
                _this._patchHierarchy(parent.owner);
            }
            // If it's a group, detect its own states
            if (_this.owner && _this instanceof BABYLON.Group2D) {
                var group = _this;
                group.detectGroupStates();
            }
            // Time to insert children if some are specified
            if (settings.children != null) {
                for (var _i = 0, _a = settings.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    _this.addChild(child);
                    // Good time to patch the hierarchy, it won't go very far if there's no need to
                    if (_this.owner != null && _this._hierarchyDepth != null) {
                        child._patchHierarchy(_this.owner);
                    }
                }
            }
            if (settings.zOrder != null) {
                _this.zOrder = settings.zOrder;
            }
            // Set the model related properties
            if (settings.position != null) {
                _this.position = settings.position;
            }
            else if (settings.x != null || settings.y != null) {
                _this.position = new BABYLON.Vector2(settings.x || 0, settings.y || 0);
            }
            else {
                _this._position = null;
            }
            _this.rotation = (settings.rotation == null) ? 0 : settings.rotation;
            if (settings.scale != null) {
                _this.scale = settings.scale;
            }
            else {
                if (settings.scaleX != null) {
                    _this.scaleX = settings.scaleX;
                }
                if (settings.scaleY != null) {
                    _this.scaleY = settings.scaleY;
                }
            }
            _this.levelVisible = (settings.isVisible == null) ? true : settings.isVisible;
            _this.origin = settings.origin || new BABYLON.Vector2(0.5, 0.5);
            // Layout Engine
            if (settings.layoutEngine != null) {
                if (typeof settings.layoutEngine === "string") {
                    var name_1 = settings.layoutEngine.toLocaleLowerCase().trim();
                    if (name_1 === "canvas" || name_1 === "canvaslayoutengine") {
                        _this.layoutEngine = BABYLON.CanvasLayoutEngine.Singleton;
                    }
                    else if (name_1.indexOf("stackpanel") === 0 || name_1.indexOf("horizontalstackpanel") === 0) {
                        _this.layoutEngine = BABYLON.StackPanelLayoutEngine.Horizontal;
                    }
                    else if (name_1.indexOf("verticalstackpanel") === 0) {
                        _this.layoutEngine = BABYLON.StackPanelLayoutEngine.Vertical;
                    }
                }
                else if (settings.layoutEngine instanceof BABYLON.LayoutEngineBase) {
                    _this.layoutEngine = settings.layoutEngine;
                }
            }
            // Set the layout/margin stuffs
            if (settings.marginTop) {
                _this.margin.setTop(settings.marginTop);
            }
            if (settings.marginLeft) {
                _this.margin.setLeft(settings.marginLeft);
            }
            if (settings.marginRight) {
                _this.margin.setRight(settings.marginRight);
            }
            if (settings.marginBottom) {
                _this.margin.setBottom(settings.marginBottom);
            }
            if (settings.margin) {
                if (typeof settings.margin === "string") {
                    _this.margin.fromString(settings.margin);
                }
                else {
                    _this.margin.fromUniformPixels(settings.margin);
                }
            }
            if (settings.marginHAlignment) {
                _this.marginAlignment.horizontal = settings.marginHAlignment;
            }
            if (settings.marginVAlignment) {
                _this.marginAlignment.vertical = settings.marginVAlignment;
            }
            if (settings.marginAlignment) {
                _this.marginAlignment.fromString(settings.marginAlignment);
            }
            if (settings.paddingTop) {
                _this.padding.setTop(settings.paddingTop);
            }
            if (settings.paddingLeft) {
                _this.padding.setLeft(settings.paddingLeft);
            }
            if (settings.paddingRight) {
                _this.padding.setRight(settings.paddingRight);
            }
            if (settings.paddingBottom) {
                _this.padding.setBottom(settings.paddingBottom);
            }
            if (settings.padding) {
                if (typeof settings.padding === "string") {
                    _this.padding.fromString(settings.padding);
                }
                else {
                    _this.padding.fromUniformPixels(settings.padding);
                }
            }
            if (settings.layoutData) {
                _this.layoutData = settings.layoutData;
            }
            _this._updatePositioningState();
            // Dirty layout and positioning
            _this._parentLayoutDirty();
            _this._positioningDirty();
            // Add in the PCM
            if (settings.levelCollision || settings.deepCollision) {
                _this._actorInfo = _this.owner._primitiveCollisionManager._addActor(_this, settings.deepCollision === true);
                _this._setFlags(BABYLON.SmartPropertyPrim.flagCollisionActor);
            }
            else {
                _this._actorInfo = null;
            }
            return _this;
        }
        Object.defineProperty(Prim2DBase.prototype, "intersectWithObservable", {
            /**
             * Return the ChangedDictionary observable of the StringDictionary containing the primitives intersecting with this one
             */
            get: function () {
                if (!this._actorInfo) {
                    return null;
                }
                return this._actorInfo.intersectWith.dictionaryChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "intersectWith", {
            /**
             * Return the ObservableStringDictionary containing all the primitives intersecting with this one.
             * The key is the primitive uid, the value is the ActorInfo object
             * @returns {}
             */
            get: function () {
                if (!this._actorInfo) {
                    return null;
                }
                return this._actorInfo.intersectWith;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actionManager", {
            get: function () {
                if (!this._actionManager) {
                    this._actionManager = new BABYLON.ActionManager(this.owner.scene);
                }
                return this._actionManager;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * From 'this' primitive, traverse up (from parent to parent) until the given predicate is true
         * @param predicate the predicate to test on each parent
         * @return the first primitive where the predicate was successful
         */
        Prim2DBase.prototype.traverseUp = function (predicate) {
            var p = this;
            while (p != null) {
                if (predicate(p)) {
                    return p;
                }
                p = p._parent;
            }
            return null;
        };
        Object.defineProperty(Prim2DBase.prototype, "owner", {
            /**
             * Retrieve the owner Canvas2D
             */
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "parent", {
            /**
             * Get the parent primitive (can be the Canvas, only the Canvas has no parent)
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "children", {
            /**
             * The array of direct children primitives
             */
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "id", {
            /**
             * The identifier of this primitive, may not be unique, it's for information purpose only
             */
            get: function () {
                return this._id;
            },
            set: function (value) {
                if (this._id === value) {
                    return;
                }
                var oldValue = this._id;
                this.onPropertyChanged("id", oldValue, this._id);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualPosition", {
            get: function () {
                // If we don't use positioning engine the actual position is the position
                if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning)) {
                    return this.position;
                }
                // We use the positioning engine, if the variable is fetched, it's up to date, return it
                if (this._actualPosition != null) {
                    return this._actualPosition;
                }
                this._updatePositioning();
                return this._actualPosition;
            },
            /**
             * DO NOT INVOKE for internal purpose only
             */
            set: function (val) {
                if (!this._actualPosition) {
                    this._actualPosition = val.clone();
                }
                else {
                    this._actualPosition.copyFrom(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualX", {
            /**
             * Shortcut to actualPosition.x
             */
            get: function () {
                return this.actualPosition.x;
            },
            /**
             * DO NOT INVOKE for internal purpose only
             */
            set: function (val) {
                this._actualPosition.x = val;
                this._triggerPropertyChanged(Prim2DBase_1.actualPositionProperty, this._actualPosition);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualY", {
            /**
             * Shortcut to actualPosition.y
             */
            get: function () {
                return this.actualPosition.y;
            },
            /**
            * DO NOT INVOKE for internal purpose only
            */
            set: function (val) {
                this._actualPosition.y = val;
                this._triggerPropertyChanged(Prim2DBase_1.actualPositionProperty, this._actualPosition);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "position", {
            /**
             * Position of the primitive, relative to its parent.
             * BEWARE: if you change only position.x or y it won't trigger a property change and you won't have the expected behavior.
             * Use this property to set a new Vector2 object, otherwise to change only the x/y use Prim2DBase.x or y properties.
             * Setting this property may have no effect is specific alignment are in effect.
             */
            get: function () {
                if (!this._position) {
                    this._position = BABYLON.Vector2.Zero();
                }
                return this._position;
            },
            set: function (value) {
                //if (!this._checkPositionChange()) {
                //    return;
                //}
                if (this._checkUseMargin()) {
                    switch (this.marginAlignment.horizontal) {
                        case PrimitiveAlignment.AlignLeft:
                        case PrimitiveAlignment.AlignStretch:
                        case PrimitiveAlignment.AlignCenter:
                            this.margin.leftPixels = value.x;
                            break;
                        case PrimitiveAlignment.AlignRight:
                            this.margin.rightPixels = value.x;
                            break;
                    }
                    switch (this.marginAlignment.vertical) {
                        case PrimitiveAlignment.AlignBottom:
                        case PrimitiveAlignment.AlignStretch:
                        case PrimitiveAlignment.AlignCenter:
                            this.margin.bottomPixels = value.y;
                            break;
                        case PrimitiveAlignment.AlignTop:
                            this.margin.topPixels = value.y;
                            break;
                    }
                    return;
                }
                else {
                    if (!value) {
                        this._position = null;
                    }
                    else {
                        if (!this._position) {
                            this._position = value.clone();
                        }
                        else {
                            this._position.copyFrom(value);
                        }
                    }
                    this._actualPosition = null;
                    this._triggerPropertyChanged(Prim2DBase_1.actualPositionProperty, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "x", {
            /**
             * Direct access to the position.x value of the primitive
             * Use this property when you only want to change one component of the position property
             */
            get: function () {
                if (!this._position) {
                    return null;
                }
                return this._position.x;
            },
            set: function (value) {
                //if (!this._checkPositionChange()) {
                //    return;
                //}
                if (value == null) {
                    throw new Error("Can't set a null x in primitive " + this.id + ", only the position can be turned to null");
                }
                if (this._checkUseMargin()) {
                    switch (this.marginAlignment.horizontal) {
                        case PrimitiveAlignment.AlignLeft:
                        case PrimitiveAlignment.AlignStretch:
                        case PrimitiveAlignment.AlignCenter:
                            this.margin.leftPixels = value;
                            break;
                        case PrimitiveAlignment.AlignRight:
                            this.margin.rightPixels = value;
                            break;
                    }
                    return;
                }
                else {
                    if (!this._position) {
                        this._position = BABYLON.Vector2.Zero();
                    }
                    if (this._position.x === value) {
                        return;
                    }
                    this._position.x = value;
                    this._actualPosition = null;
                    this._triggerPropertyChanged(Prim2DBase_1.positionProperty, value);
                    this._triggerPropertyChanged(Prim2DBase_1.actualPositionProperty, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "y", {
            /**
             * Direct access to the position.y value of the primitive
             * Use this property when you only want to change one component of the position property
             */
            get: function () {
                if (!this._position) {
                    return null;
                }
                return this._position.y;
            },
            set: function (value) {
                //if (!this._checkPositionChange()) {
                //    return;
                //}
                if (value == null) {
                    throw new Error("Can't set a null y in primitive " + this.id + ", only the position can be turned to null");
                }
                if (this._checkUseMargin()) {
                    switch (this.marginAlignment.vertical) {
                        case PrimitiveAlignment.AlignBottom:
                        case PrimitiveAlignment.AlignStretch:
                        case PrimitiveAlignment.AlignCenter:
                            this.margin.bottomPixels = value;
                            break;
                        case PrimitiveAlignment.AlignTop:
                            this.margin.topPixels = value;
                            break;
                    }
                    return;
                }
                else {
                    if (!this._position) {
                        this._position = BABYLON.Vector2.Zero();
                    }
                    if (this._position.y === value) {
                        return;
                    }
                    this._position.y = value;
                    this._actualPosition = null;
                    this._triggerPropertyChanged(Prim2DBase_1.positionProperty, value);
                    this._triggerPropertyChanged(Prim2DBase_1.actualPositionProperty, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "size", {
            get: function () {
                return this.internalGetSize();
            },
            set: function (value) {
                this.internalSetSize(value);
            },
            enumerable: true,
            configurable: true
        });
        Prim2DBase.prototype.internalGetSize = function () {
            if (!this._size || this._size.width == null || this._size.height == null) {
                var bbr = Prim2DBase_1.boundinbBoxReentrency;
                if (bbr !== -1 && bbr <= (this.hierarchyDepth || 0)) {
                    BABYLON.C2DLogging.setPostMessage(function () { return "re entrancy detected"; });
                    return Prim2DBase_1.nullSize;
                }
                if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty)) {
                    BABYLON.C2DLogging.setPostMessage(function () { return "cache hit"; });
                    return this._internalSize;
                }
                BABYLON.C2DLogging.setPostMessage(function () { return "cache miss"; });
                Prim2DBase_1.boundinbBoxReentrency = this.hierarchyDepth || 0;
                var b = this.boundingInfo;
                Prim2DBase_1.boundinbBoxReentrency = -1;
                Prim2DBase_1._size.copyFrom(this._internalSize);
                b.sizeToRef(this._internalSize);
                if (!this._internalSize.equals(Prim2DBase_1._size)) {
                    this._triggerPropertyChanged(Prim2DBase_1.sizeProperty, this._internalSize);
                    this._positioningDirty();
                }
                return this._internalSize || Prim2DBase_1._nullSize;
            }
            else {
                BABYLON.C2DLogging.setPostMessage(function () { return "user set size"; });
            }
            return this._size || Prim2DBase_1._nullSize;
        };
        Prim2DBase.prototype.internalSetSize = function (value) {
            if (!value) {
                this._size = null;
            }
            else {
                if (!this._size) {
                    this._size = value.clone();
                }
                else {
                    this._size.copyFrom(value);
                }
            }
            this._actualSize = null;
            this._updatePositioningState();
            this._positioningDirty();
        };
        Object.defineProperty(Prim2DBase.prototype, "width", {
            get: function () {
                if (!this.size) {
                    return null;
                }
                return this.size.width;
            },
            set: function (value) {
                if (this.size && this.size.width === value) {
                    return;
                }
                if (!this.size) {
                    this.size = new BABYLON.Size(value, 0);
                }
                else {
                    this.size.width = value;
                }
                this._actualSize = null;
                this._triggerPropertyChanged(Prim2DBase_1.sizeProperty, value);
                this._positioningDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "height", {
            get: function () {
                if (!this.size) {
                    return null;
                }
                return this.size.height;
            },
            set: function (value) {
                if (this.size && this.size.height === value) {
                    return;
                }
                if (!this.size) {
                    this.size = new BABYLON.Size(0, value);
                }
                else {
                    this.size.height = value;
                }
                this._actualSize = null;
                this._triggerPropertyChanged(Prim2DBase_1.sizeProperty, value);
                this._positioningDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
                if (this._hasMargin) {
                    this._positioningDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "scale", {
            get: function () {
                return this._scale.x;
            },
            set: function (value) {
                if (value <= 0) {
                    throw new Error("You can't set the scale to less or equal to 0");
                }
                this._scale.x = this._scale.y = value;
                this._setFlags(BABYLON.SmartPropertyPrim.flagActualScaleDirty);
                this._spreadActualScaleDirty();
                this._positioningDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualSize", {
            get: function () {
                // If we don't use positioning engine the actual size is the size
                if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning)) {
                    return this.size;
                }
                // We use the positioning engine, if the variable is fetched, it's up to date, return it
                if (this._actualSize) {
                    return this._actualSize;
                }
                this._updatePositioning();
                return this._actualSize;
            },
            set: function (value) {
                if (this._actualSize && this._actualSize.equals(value)) {
                    return;
                }
                if (!this._actualSize) {
                    this._actualSize = value.clone();
                }
                else {
                    this._actualSize.copyFrom(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualWidth", {
            get: function () {
                return this.actualSize.width;
            },
            set: function (val) {
                this._actualSize.width = val;
                this._triggerPropertyChanged(Prim2DBase_1.actualSizeProperty, this._actualSize);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualHeight", {
            get: function () {
                return this.actualSize.height;
            },
            set: function (val) {
                this._actualSize.height = val;
                this._triggerPropertyChanged(Prim2DBase_1.actualPositionProperty, this._actualSize);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualZOffset", {
            get: function () {
                if (this._manualZOrder != null) {
                    return this._manualZOrder;
                }
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagZOrderDirty)) {
                    this._updateZOrder();
                }
                return (1 - this._zOrder);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "minSize", {
            /**
             * Get or set the minimal size the Layout Engine should respect when computing the primitive's actualSize.
             * The Primitive's size won't be less than specified.
             * The default value depends of the Primitive type
             */
            get: function () {
                return this._minSize;
            },
            set: function (value) {
                if (this._minSize && value && this._minSize.equals(value)) {
                    return;
                }
                if (!this._minSize) {
                    this._minSize = value.clone();
                }
                else {
                    this._minSize.copyFrom(value);
                }
                this._parentLayoutDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "maxSize", {
            /**
             * Get or set the maximal size the Layout Engine should respect when computing the primitive's actualSize.
             * The Primitive's size won't be more than specified.
             * The default value depends of the Primitive type
             */
            get: function () {
                return this._maxSize;
            },
            set: function (value) {
                if (this._maxSize && value && this._maxSize.equals(value)) {
                    return;
                }
                if (!this._maxSize) {
                    this._maxSize = value.clone();
                }
                else {
                    this._maxSize.copyFrom(value);
                }
                this._parentLayoutDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "origin", {
            /**
             * The origin defines the normalized coordinate of the center of the primitive, from the bottom/left corner.
             * The origin is used only to compute transformation of the primitive, it has no meaning in the primitive local frame of reference
             * For instance:
             * 0,0 means the center is bottom/left. Which is the default for Canvas2D instances
             * 0.5,0.5 means the center is at the center of the primitive, which is default of all types of Primitives
             * 0,1 means the center is top/left
             * @returns The normalized center.
             */
            get: function () {
                return this._origin;
            },
            set: function (value) {
                if (!this._origin) {
                    this._origin = value.clone();
                }
                else {
                    this._origin.copyFrom(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "levelVisible", {
            get: function () {
                return this._isFlagSet(BABYLON.SmartPropertyPrim.flagLevelVisible);
            },
            set: function (value) {
                this._changeFlags(BABYLON.SmartPropertyPrim.flagLevelVisible, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isVisible", {
            get: function () {
                return this._isFlagSet(BABYLON.SmartPropertyPrim.flagIsVisible);
            },
            set: function (value) {
                this._changeFlags(BABYLON.SmartPropertyPrim.flagIsVisible, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "zOrder", {
            get: function () {
                return this._manualZOrder;
            },
            set: function (value) {
                if (this._manualZOrder === value) {
                    return;
                }
                this._manualZOrder = value;
                this.onZOrderChanged();
                if (this._actualZOrderChangedObservable && this._actualZOrderChangedObservable.hasObservers()) {
                    this._actualZOrderChangedObservable.notifyObservers(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isManualZOrder", {
            get: function () {
                return this._manualZOrder != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "margin", {
            get: function () {
                var _this = this;
                if (!this._margin) {
                    this._margin = new PrimitiveThickness(function () {
                        if (!_this.parent) {
                            return null;
                        }
                        return _this.parent.margin;
                    }, function () {
                        _this._positioningDirty();
                        _this._updatePositioningState();
                    });
                    this._updatePositioningState();
                }
                return this._margin;
            },
            set: function (value) {
                if (!value) {
                    this._margin = null;
                }
                else {
                    this.margin.copyFrom(value);
                }
                this._updatePositioningState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Set the margin from a string value
         * @param value is "top: <value>, left:<value>, right:<value>, bottom:<value>" or "<value>" (same for all edges) each are optional, auto will be set if it's omitted.
         * Values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.
         */
        Prim2DBase.prototype.setMargin = function (value) {
            this.margin.fromString(value);
            this._updatePositioningState();
        };
        Object.defineProperty(Prim2DBase.prototype, "_hasMargin", {
            /**
             * Check for both margin and marginAlignment, return true if at least one of them is specified with a non default value
             */
            get: function () {
                return (this._margin !== null && !this._margin.isDefault) || (this._marginAlignment !== null && !this._marginAlignment.isDefault);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "padding", {
            get: function () {
                var _this = this;
                if (!this._padding) {
                    this._padding = new PrimitiveThickness(function () {
                        if (!_this.parent) {
                            return null;
                        }
                        return _this.parent.padding;
                    }, function () { return _this._positioningDirty(); });
                    this._updatePositioningState();
                }
                return this._padding;
            },
            set: function (value) {
                if (!value) {
                    this._padding = null;
                }
                else {
                    this.padding.copyFrom(value);
                }
                this._updatePositioningState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Set the padding from a string value
         * @param value is "top: <value>, left:<value>, right:<value>, bottom:<value>" or "<value>" (same for all edges) each are optional, auto will be set if it's omitted.
         * Values are: 'auto', 'inherit', 'XX%' for percentage, 'XXpx' or 'XX' for pixels.         */
        Prim2DBase.prototype.setPadding = function (value) {
            this.padding.fromString(value);
            this._updatePositioningState();
        };
        Object.defineProperty(Prim2DBase.prototype, "_hasPadding", {
            get: function () {
                return this._padding !== null && !this._padding.isDefault;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "marginAlignment", {
            get: function () {
                var _this = this;
                if (!this._marginAlignment) {
                    this._marginAlignment = new PrimitiveAlignment(function () {
                        _this._positioningDirty();
                        _this._updatePositioningState();
                    });
                    this._updatePositioningState();
                }
                return this._marginAlignment;
            },
            set: function (value) {
                if (!value) {
                    this._marginAlignment = null;
                }
                else {
                    this.marginAlignment.copyFrom(value);
                }
                this._updatePositioningState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Set the margin's horizontal and or vertical alignments from a string value.
         * @param value can be: [<h:|horizontal:><left|right|center|stretch>], [<v:|vertical:><top|bottom|center|stretch>]
         */
        Prim2DBase.prototype.setMarginalignment = function (value) {
            this.marginAlignment.fromString(value);
            this._updatePositioningState();
        };
        Object.defineProperty(Prim2DBase.prototype, "_hasMarginAlignment", {
            /**
             * Check if there a marginAlignment specified (non null and not default)
             */
            get: function () {
                return (this._marginAlignment !== null && !this._marginAlignment.isDefault);
            },
            enumerable: true,
            configurable: true
        });
        Prim2DBase.prototype._updatePositioningState = function () {
            var value = this._hasMargin || this._hasPadding || this.isSizeAuto;
            //            console.log(`${this.id} with parent ${this._parent ? this._parent.id : "[none]"} state: ${value} `);
            this._changeFlags(BABYLON.SmartPropertyPrim.flagUsePositioning, value);
        };
        Object.defineProperty(Prim2DBase.prototype, "opacity", {
            get: function () {
                return this._opacity;
            },
            set: function (value) {
                if (value < 0) {
                    value = 0;
                }
                else if (value > 1) {
                    value = 1;
                }
                if (this._opacity === value) {
                    return;
                }
                this._opacity = value;
                this._setFlags(BABYLON.SmartPropertyPrim.flagActualOpacityDirty);
                this._spreadActualOpacityChanged();
                this._updateRenderMode();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "scaleX", {
            get: function () {
                return this._scale.x;
            },
            set: function (value) {
                if (value <= 0) {
                    throw new Error("You can't set the scaleX to less or equal to 0");
                }
                this._scale.x = value;
                this._setFlags(BABYLON.SmartPropertyPrim.flagActualScaleDirty);
                this._spreadActualScaleDirty();
                this._positioningDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "scaleY", {
            get: function () {
                return this._scale.y;
            },
            set: function (value) {
                if (value <= 0) {
                    throw new Error("You can't set the scaleY to less or equal to 0");
                }
                this._scale.y = value;
                this._setFlags(BABYLON.SmartPropertyPrim.flagActualScaleDirty);
                this._spreadActualScaleDirty();
                this._positioningDirty();
            },
            enumerable: true,
            configurable: true
        });
        Prim2DBase.prototype._spreadActualScaleDirty = function () {
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child._setFlags(BABYLON.SmartPropertyPrim.flagActualScaleDirty);
                child._spreadActualScaleDirty();
            }
        };
        Object.defineProperty(Prim2DBase.prototype, "actualScale", {
            /**
             * Returns the actual scale of this Primitive, the value is computed from the scale property of this primitive, multiplied by the actualScale of its parent one (if any). The Vector2 object returned contains the scale for both X and Y axis
             */
            get: function () {
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagActualScaleDirty)) {
                    var cur = this._isFlagSet(BABYLON.SmartPropertyPrim.flagDontInheritParentScale) ? null : this.parent;
                    var sx = this.scaleX;
                    var sy = this.scaleY;
                    while (cur) {
                        sx *= cur.scaleX;
                        sy *= cur.scaleY;
                        cur = cur._isFlagSet(BABYLON.SmartPropertyPrim.flagDontInheritParentScale) ? null : cur.parent;
                    }
                    this._actualScale.copyFromFloats(sx, sy);
                    this._clearFlags(BABYLON.SmartPropertyPrim.flagActualScaleDirty);
                }
                return this._actualScale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualScaleX", {
            /**
             * Get the actual Scale of the X axis, shortcut for this.actualScale.x
             */
            get: function () {
                return this.actualScale.x;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * This method stores the actual global scale (including DesignMode and DPR related scales) in the given Vector2
         * @param res the object that will receive the actual global scale: this is actualScale * DPRScale * DesignModeScale
         */
        Prim2DBase.prototype.getActualGlobalScaleToRef = function (res) {
            var as = this.actualScale;
            var cls = this.owner._canvasLevelScale || Prim2DBase_1._iv2;
            res.x = as.x * cls.x;
            res.y = as.y * cls.y;
        };
        Object.defineProperty(Prim2DBase.prototype, "actualScaleY", {
            /**
             * Get the actual Scale of the Y axis, shortcut for this.actualScale.y
             */
            get: function () {
                return this.actualScale.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "actualOpacity", {
            /**
             * Get the actual opacity level, this property is computed from the opacity property, multiplied by the actualOpacity of its parent (if any)
             */
            get: function () {
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagActualOpacityDirty)) {
                    var cur = this.parent;
                    var op = this.opacity;
                    while (cur) {
                        op *= cur.opacity;
                        cur = cur.parent;
                    }
                    this._actualOpacity = op;
                    this._clearFlags(BABYLON.SmartPropertyPrim.flagActualOpacityDirty);
                }
                return this._actualOpacity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "layoutEngine", {
            /**
             * Get/set the layout engine to use for this primitive.
             * The default layout engine is the CanvasLayoutEngine.
             */
            get: function () {
                if (!this._layoutEngine) {
                    this._layoutEngine = BABYLON.CanvasLayoutEngine.Singleton;
                }
                return this._layoutEngine;
            },
            set: function (value) {
                if (this._layoutEngine === value) {
                    return;
                }
                this._changeLayoutEngine(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "layoutArea", {
            /**
             * Get/set the layout are of this primitive.
             * The Layout area is the zone allocated by the Layout Engine for this particular primitive. Margins/Alignment will be computed based on this area.
             * The setter should only be called by a Layout Engine class.
             */
            get: function () {
                return this._layoutArea;
            },
            set: function (val) {
                if (this._layoutArea && this._layoutArea.equals(val)) {
                    return;
                }
                this._positioningDirty();
                this._setFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty);
                if (this.parent) {
                    this.parent._setFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty | BABYLON.SmartPropertyPrim.flagGlobalTransformDirty);
                }
                if (!this._layoutArea) {
                    this._layoutArea = val.clone();
                }
                else {
                    this._layoutArea.copyFrom(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "layoutAreaPos", {
            /**
             * Get/set the layout area position (relative to the parent primitive).
             * The setter should only be called by a Layout Engine class.
             */
            get: function () {
                return this._layoutAreaPos;
            },
            set: function (val) {
                if (this._layoutAreaPos && this._layoutAreaPos.equals(val)) {
                    return;
                }
                if (this.parent) {
                    this.parent._setFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty | BABYLON.SmartPropertyPrim.flagGlobalTransformDirty);
                }
                this._positioningDirty();
                if (!this._layoutAreaPos) {
                    this._layoutAreaPos = val.clone();
                }
                else {
                    this._layoutAreaPos.copyFrom(val);
                }
                this._setFlags(BABYLON.SmartPropertyPrim.flagLocalTransformDirty);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isPickable", {
            /**
             * Define if the Primitive can be subject to intersection test or not (default is true)
             */
            get: function () {
                return this._isFlagSet(BABYLON.SmartPropertyPrim.flagIsPickable);
            },
            set: function (value) {
                this._changeFlags(BABYLON.SmartPropertyPrim.flagIsPickable, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isContainer", {
            /**
             * Define if the Primitive acts as a container or not
             * A container will encapsulate its children for interaction event.
             * If it's not a container events will be process down to children if the primitive is not pickable.
             * Default value is true
             */
            get: function () {
                return this._isFlagSet(BABYLON.SmartPropertyPrim.flagIsContainer);
            },
            set: function (value) {
                this._changeFlags(BABYLON.SmartPropertyPrim.flagIsContainer, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "hierarchyDepth", {
            /**
             * Return the depth level of the Primitive into the Canvas' Graph. A Canvas will be 0, its direct children 1, and so on.
             */
            get: function () {
                return this._hierarchyDepth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "renderGroup", {
            /**
             * Retrieve the Group that is responsible to render this primitive
             */
            get: function () {
                return this._renderGroup;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "globalTransform", {
            /**
             * Get the global transformation matrix of the primitive
             */
            get: function () {
                if (!this._globalTransform || (this._globalTransformProcessStep !== this.owner._globalTransformProcessStep)) {
                    this.updateCachedStates(false);
                }
                return this._globalTransform;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * return the global position of the primitive, relative to its canvas
         */
        Prim2DBase.prototype.getGlobalPosition = function () {
            var v = new BABYLON.Vector2(0, 0);
            this.getGlobalPositionByRef(v);
            return v;
        };
        /**
         * return the global position of the primitive, relative to its canvas
         * @param v the valid Vector2 object where the global position will be stored
         */
        Prim2DBase.prototype.getGlobalPositionByRef = function (v) {
            v.x = this.globalTransform.m[4];
            v.y = this.globalTransform.m[5];
        };
        Object.defineProperty(Prim2DBase.prototype, "invGlobalTransform", {
            /**
             * Get invert of the global transformation matrix of the primitive
             */
            get: function () {
                this._updateLocalTransform();
                return this._invGlobalTransform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "localTransform", {
            /**
             * Get the local transformation of the primitive
             */
            get: function () {
                this._updateLocalTransform();
                return this._localTransform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "localLayoutTransform", {
            get: function () {
                this._updateLocalTransform();
                return this._localLayoutTransform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "alignToPixel", {
            /**
             * Get/set if the sprite rendering should be aligned to the target rendering device pixel or not
             */
            get: function () {
                return this._isFlagSet(BABYLON.SmartPropertyPrim.flagAlignPrimitive);
            },
            set: function (value) {
                this._changeFlags(BABYLON.SmartPropertyPrim.flagAlignPrimitive, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "boundingInfo", {
            /**
             * Get the boundingInfo associated to the primitive and its children.
             */
            get: function () {
                // Check if we must update the boundingInfo
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagBoundingInfoDirty)) {
                    if (this.owner) {
                        this.owner.boundingInfoRecomputeCounter.addCount(1, false);
                    }
                    BABYLON.C2DLogging.setPostMessage(function () { return "cache miss"; });
                    var sizedByContent = this.isSizedByContent;
                    if (sizedByContent) {
                        this._boundingInfo.clear();
                    }
                    else {
                        this._boundingInfo.copyFrom(this.levelBoundingInfo);
                    }
                    if (this._children.length > 0) {
                        var contentBI = new BABYLON.BoundingInfo2D();
                        var tps = Prim2DBase_1._tpsBB2;
                        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                            var curChild = _a[_i];
                            if (curChild._isFlagSet(BABYLON.SmartPropertyPrim.flagNoPartOfLayout)) {
                                continue;
                            }
                            var bb = curChild.layoutBoundingInfo;
                            bb.transformToRef(curChild.localLayoutTransform, tps);
                            contentBI.unionToRef(tps, contentBI);
                        }
                        // Apply padding
                        if (this._hasPadding) {
                            var padding = this.padding;
                            var minmax = Prim2DBase_1._bMinMax;
                            contentBI.minMaxToRef(minmax);
                            this._paddingOffset.copyFromFloats(padding.leftPixels, padding.bottomPixels, padding.rightPixels, padding.topPixels);
                            var size = Prim2DBase_1._size2;
                            contentBI.sizeToRef(size);
                            this._getActualSizeFromContentToRef(size, this._paddingOffset, size);
                            minmax.z += this._paddingOffset.z + this._paddingOffset.x;
                            minmax.w += this._paddingOffset.w + this._paddingOffset.y;
                            BABYLON.BoundingInfo2D.CreateFromMinMaxToRef(minmax.x, minmax.z, minmax.y, minmax.w, contentBI);
                        }
                        else {
                            this._paddingOffset.copyFromFloats(0, 0, 0, 0);
                        }
                        this._boundingInfo.unionToRef(contentBI, this._boundingInfo);
                    }
                    if (sizedByContent || !this._isFlagSet(BABYLON.SmartPropertyPrim.flagLevelBoundingInfoDirty)) {
                        this._clearFlags(BABYLON.SmartPropertyPrim.flagBoundingInfoDirty);
                    }
                }
                else {
                    BABYLON.C2DLogging.setPostMessage(function () { return "cache hit"; });
                }
                return this._boundingInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "layoutBoundingInfo", {
            /**
             * Get the boundingInfo of the primitive's content arranged by a layout Engine
             * If a particular child is not arranged by layout, it's boundingInfo is used instead to produce something as accurate as possible
             */
            get: function () {
                var usePositioning = this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning);
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty)) {
                    BABYLON.C2DLogging.setPostMessage(function () { return "cache miss"; });
                    if (this._owner) {
                        this._owner.addLayoutBoundingInfoUpdateCounter(1);
                    }
                    if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutDirty)) {
                        if (this._owner) {
                            this._owner.addUpdateLayoutCounter(1);
                        }
                        this._layoutEngine.updateLayout(this);
                        this._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutDirty);
                    }
                    if (usePositioning) {
                        if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty)) {
                            this._updatePositioning();
                        }
                        // Safety check, code re entrance is a PITA in this part of the code
                        if (!this._layoutBoundingInfo) {
                            BABYLON.C2DLogging.setPostMessage(function () { return "re entrance detected, boundingInfo returned"; });
                            return this.boundingInfo;
                        }
                        if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty)) {
                            BABYLON.C2DLogging.setPostMessage(function () { return "couldn't compute positioning, boundingInfo returned"; });
                            return this.boundingInfo;
                        }
                    }
                    if (!usePositioning) {
                        var bi = this.boundingInfo;
                        if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagBoundingInfoDirty)) {
                            this._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty);
                        }
                        return bi;
                    }
                    this._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty);
                }
                else {
                    BABYLON.C2DLogging.setPostMessage(function () { return "cache hit"; });
                }
                return usePositioning ? this._layoutBoundingInfo : this.boundingInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isSizeAuto", {
            /**
             * Determine if the size is automatically computed or fixed because manually specified.
             * Use the actualSize property to get the final/real size of the primitive
             * @returns true if the size is automatically computed, false if it were manually specified.
             */
            get: function () {
                var size = this._size;
                return size == null || (size.width == null && size.height == null);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isHorizontalSizeAuto", {
            /**
             * Determine if the horizontal size is automatically computed or fixed because manually specified.
             * Use the actualSize property to get the final/real size of the primitive
             * @returns true if the horizontal size is automatically computed, false if it were manually specified.
             */
            get: function () {
                var size = this._size;
                return size == null || size.width == null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isVerticalSizeAuto", {
            /**
             * Determine if the vertical size is automatically computed or fixed because manually specified.
             * Use the actualSize property to get the final/real size of the primitive
             * @returns true if the vertical size is automatically computed, false if it were manually specified.
             */
            get: function () {
                var size = this._size;
                return size == null || size.height == null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isSizedByContent", {
            /**
             * Return true if this prim has an auto size which is set by the children's global bounding box
             */
            get: function () {
                return (this._size == null) && (this._children.length > 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "isPositionAuto", {
            /**
             * Determine if the position is automatically computed or fixed because manually specified.
             * Use the actualPosition property to get the final/real position of the primitive
             * @returns true if the position is automatically computed, false if it were manually specified.
             */
            get: function () {
                return this._position == null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "pointerEventObservable", {
            /**
             * Interaction with the primitive can be create using this Observable. See the PrimitivePointerInfo class for more information
             */
            get: function () {
                return this._pointerEventObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "zActualOrderChangedObservable", {
            get: function () {
                if (!this._actualZOrderChangedObservable) {
                    this._actualZOrderChangedObservable = new BABYLON.Observable();
                }
                return this._actualZOrderChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Prim2DBase.prototype, "displayDebugAreas", {
            get: function () {
                return this._displayDebugAreas;
            },
            set: function (value) {
                if (this._displayDebugAreas === value) {
                    return;
                }
                if (value === false) {
                    this._debugAreaGroup.dispose();
                    this._debugAreaGroup = null;
                }
                else {
                    var layoutFill = "#F0808040"; // Red - Layout area
                    var layoutBorder = "#F08080FF";
                    var marginFill = "#F0F04040"; // Yellow - Margin area
                    var marginBorder = "#F0F040FF";
                    var paddingFill = "#F040F040"; // Magenta - Padding Area
                    var paddingBorder = "#F040F0FF";
                    var contentFill = "#40F0F040"; // Cyan - Content area
                    var contentBorder = "#40F0F0FF";
                    var s = new BABYLON.Size(10, 10);
                    var p = BABYLON.Vector2.Zero();
                    this._debugAreaGroup = new BABYLON.Group2D({
                        parent: (this.parent != null) ? this.parent : this, id: "###DEBUG AREA GROUP###", children: [
                            new BABYLON.Group2D({
                                id: "###Layout Area###", position: p, size: s, children: [
                                    new BABYLON.Rectangle2D({ id: "###Layout Frame###", position: BABYLON.Vector2.Zero(), size: s, fill: null, border: layoutBorder }),
                                    new BABYLON.Rectangle2D({ id: "###Layout Top###", position: BABYLON.Vector2.Zero(), size: s, fill: layoutFill }),
                                    new BABYLON.Rectangle2D({ id: "###Layout Left###", position: BABYLON.Vector2.Zero(), size: s, fill: layoutFill }),
                                    new BABYLON.Rectangle2D({ id: "###Layout Right###", position: BABYLON.Vector2.Zero(), size: s, fill: layoutFill }),
                                    new BABYLON.Rectangle2D({ id: "###Layout Bottom###", position: BABYLON.Vector2.Zero(), size: s, fill: layoutFill })
                                ]
                            }),
                            new BABYLON.Group2D({
                                id: "###Margin Area###", position: p, size: s, children: [
                                    new BABYLON.Rectangle2D({ id: "###Margin Frame###", position: BABYLON.Vector2.Zero(), size: s, fill: null, border: marginBorder }),
                                    new BABYLON.Rectangle2D({ id: "###Margin Top###", position: BABYLON.Vector2.Zero(), size: s, fill: marginFill }),
                                    new BABYLON.Rectangle2D({ id: "###Margin Left###", position: BABYLON.Vector2.Zero(), size: s, fill: marginFill }),
                                    new BABYLON.Rectangle2D({ id: "###Margin Right###", position: BABYLON.Vector2.Zero(), size: s, fill: marginFill }),
                                    new BABYLON.Rectangle2D({ id: "###Margin Bottom###", position: BABYLON.Vector2.Zero(), size: s, fill: marginFill })
                                ]
                            }),
                            new BABYLON.Group2D({
                                id: "###Padding Area###", position: p, size: s, children: [
                                    new BABYLON.Rectangle2D({ id: "###Padding Frame###", position: BABYLON.Vector2.Zero(), size: s, fill: null, border: paddingBorder }),
                                    new BABYLON.Rectangle2D({ id: "###Padding Top###", position: BABYLON.Vector2.Zero(), size: s, fill: paddingFill }),
                                    new BABYLON.Rectangle2D({ id: "###Padding Left###", position: BABYLON.Vector2.Zero(), size: s, fill: paddingFill }),
                                    new BABYLON.Rectangle2D({ id: "###Padding Right###", position: BABYLON.Vector2.Zero(), size: s, fill: paddingFill }),
                                    new BABYLON.Rectangle2D({ id: "###Padding Bottom###", position: BABYLON.Vector2.Zero(), size: s, fill: paddingFill })
                                ]
                            }),
                            new BABYLON.Group2D({
                                id: "###Content Area###", position: p, size: s, children: [
                                    new BABYLON.Rectangle2D({ id: "###Content Frame###", position: BABYLON.Vector2.Zero(), size: s, fill: null, border: contentBorder }),
                                    new BABYLON.Rectangle2D({ id: "###Content Top###", position: BABYLON.Vector2.Zero(), size: s, fill: contentFill }),
                                    new BABYLON.Rectangle2D({ id: "###Content Left###", position: BABYLON.Vector2.Zero(), size: s, fill: contentFill }),
                                    new BABYLON.Rectangle2D({ id: "###Content Right###", position: BABYLON.Vector2.Zero(), size: s, fill: contentFill }),
                                    new BABYLON.Rectangle2D({ id: "###Content Bottom###", position: BABYLON.Vector2.Zero(), size: s, fill: contentFill })
                                ]
                            })
                        ]
                    });
                    this._debugAreaGroup._setFlags(BABYLON.SmartPropertyPrim.flagNoPartOfLayout);
                    this._updateDebugArea();
                }
                this._displayDebugAreas = value;
            },
            enumerable: true,
            configurable: true
        });
        Prim2DBase.prototype._updateDebugArea = function () {
            if (Prim2DBase_1._updatingDebugArea === true) {
                return;
            }
            Prim2DBase_1._updatingDebugArea = true;
            var areaNames = ["Layout", "Margin", "Padding", "Content"];
            var areaZones = ["Area", "Frame", "Top", "Left", "Right", "Bottom"];
            var prims = new Array(4);
            // Get all the primitives used to display the areas
            for (var i = 0; i < 4; i++) {
                prims[i] = new Array(6);
                for (var j = 0; j < 6; j++) {
                    prims[i][j] = this._debugAreaGroup.findById("###" + areaNames[i] + " " + areaZones[j] + "###");
                    if (j > 1) {
                        prims[i][j].levelVisible = false;
                    }
                }
            }
            // Update the visibility status of layout/margin/padding
            var hasLayout = this._layoutAreaPos != null;
            var hasPos = (this.actualPosition.x !== 0) || (this.actualPosition.y !== 0);
            var hasMargin = this._hasMargin;
            var hasPadding = this._hasPadding;
            prims[0][0].levelVisible = hasLayout;
            prims[1][0].levelVisible = hasMargin;
            prims[2][0].levelVisible = hasPadding;
            prims[3][0].levelVisible = true;
            // Current offset
            var curOffset = BABYLON.Vector2.Zero();
            // Store the area info of the layout area
            var curAreaIndex = 0;
            // Store data about each area
            var areaInfo = new Array(4);
            var storeAreaInfo = function (pos, size) {
                var min = pos.clone();
                var max = pos.clone();
                if (size.width > 0) {
                    max.x += size.width;
                }
                if (size.height > 0) {
                    max.y += size.height;
                }
                areaInfo[curAreaIndex++] = { off: pos, size: size, min: min, max: max };
            };
            var isCanvas = this instanceof BABYLON.Canvas2D;
            var marginH = this._marginOffset.x + this._marginOffset.z;
            var marginV = this._marginOffset.y + this._marginOffset.w;
            var actualSize = this.actualSize.multiplyByFloats(isCanvas ? 1 : this.scaleX, isCanvas ? 1 : this.scaleY);
            var w = hasLayout ? (this.layoutAreaPos.x + this.layoutArea.width) : (marginH + actualSize.width);
            var h = hasLayout ? (this.layoutAreaPos.y + this.layoutArea.height) : (marginV + actualSize.height);
            var pos = (!hasLayout && !hasMargin && !hasPadding && hasPos) ? this.actualPosition : BABYLON.Vector2.Zero();
            storeAreaInfo(pos, new BABYLON.Size(w, h));
            // Compute the layout related data
            if (hasLayout) {
                var layoutOffset = this.layoutAreaPos.clone();
                storeAreaInfo(layoutOffset, (hasMargin || hasPadding) ? this.layoutArea.clone() : actualSize.clone());
                curOffset = layoutOffset.clone();
            }
            // Compute margin data
            if (hasMargin) {
                var marginOffset = curOffset.clone();
                marginOffset.x += this._marginOffset.x;
                marginOffset.y += this._marginOffset.y;
                var marginArea = actualSize;
                storeAreaInfo(marginOffset, marginArea);
                curOffset = marginOffset.clone();
            }
            if (hasPadding) {
                var contentOffset = curOffset.clone();
                contentOffset.x += this._paddingOffset.x;
                contentOffset.y += this._paddingOffset.y;
                var contentArea = this.contentArea;
                storeAreaInfo(contentOffset, contentArea);
                curOffset = curOffset.add(contentOffset);
            }
            // Helper function that set the pos and size of a given prim
            var setArea = function (i, j, pos, size) {
                prims[i][j].position = pos;
                prims[i][j].size = size;
            };
            var setFullRect = function (i, pos, size) {
                var plist = prims[i];
                plist[2].levelVisible = true;
                plist[3].levelVisible = false;
                plist[4].levelVisible = false;
                plist[5].levelVisible = false;
                setArea(i, 1, pos, size);
                setArea(i, 2, pos, size);
            };
            var setQuadRect = function (i, areaIndex) {
                var plist = prims[i];
                plist[2].levelVisible = true;
                plist[3].levelVisible = true;
                plist[4].levelVisible = true;
                plist[5].levelVisible = true;
                var ca = areaInfo[areaIndex];
                var na = areaInfo[areaIndex + 1];
                var tp = new BABYLON.Vector2(ca.min.x, na.max.y);
                var ts = new BABYLON.Size(ca.size.width, ca.max.y - tp.y);
                var lp = new BABYLON.Vector2(ca.min.x, na.min.y);
                var ls = new BABYLON.Size(na.min.x - ca.min.x, na.max.y - na.min.y);
                var rp = new BABYLON.Vector2(na.max.x, na.min.y);
                var rs = new BABYLON.Size(ca.max.x - na.max.x, na.max.y - na.min.y);
                var bp = new BABYLON.Vector2(ca.min.x, ca.min.y);
                var bs = new BABYLON.Size(ca.size.width, na.min.y - ca.min.y);
                // Frame
                plist[1].position = ca.off;
                plist[1].size = ca.size;
                // Top rect
                plist[2].position = tp;
                plist[2].size = ts;
                // Left rect
                plist[3].position = lp;
                plist[3].size = ls;
                // Right rect
                plist[4].position = rp;
                plist[4].size = rs;
                // Bottom rect
                plist[5].position = bp;
                plist[5].size = bs;
            };
            var areaCount = curAreaIndex;
            curAreaIndex = 0;
            // Available zones
            var availableZones = [false, hasLayout, hasMargin, hasPadding, true];
            for (var k = 1; k < 5; k++) {
                if (availableZones[k]) {
                    var ai = areaInfo[curAreaIndex];
                    setArea(k - 1, 0, BABYLON.Vector2.Zero(), ai.size);
                    //                    setArea(k-1, 1, Vector2.Zero(), ai.size);
                    if (k === 4) {
                        setFullRect(k - 1, ai.off, ai.size);
                    }
                    else {
                        setQuadRect(k - 1, curAreaIndex);
                    }
                    ++curAreaIndex;
                }
            }
            Prim2DBase_1._updatingDebugArea = false;
        };
        Prim2DBase.prototype.findById = function (id) {
            if (this._id === id) {
                return this;
            }
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                var r = child.findById(id);
                if (r != null) {
                    return r;
                }
            }
        };
        Prim2DBase.prototype.onZOrderChanged = function () {
        };
        Prim2DBase.prototype.levelIntersect = function (intersectInfo) {
            return false;
        };
        /**
         * Capture all the Events of the given PointerId for this primitive.
         * Don't forget to call releasePointerEventsCapture when done.
         * @param pointerId the Id of the pointer to capture the events from.
         */
        Prim2DBase.prototype.setPointerEventCapture = function (pointerId) {
            return this.owner._setPointerCapture(pointerId, this);
        };
        /**
         * Release a captured pointer made with setPointerEventCapture.
         * @param pointerId the Id of the pointer to release the capture from.
         */
        Prim2DBase.prototype.releasePointerEventsCapture = function (pointerId) {
            return this.owner._releasePointerCapture(pointerId, this);
        };
        /**
         * Make an intersection test with the primitive, all inputs/outputs are stored in the IntersectInfo2D class, see its documentation for more information.
         * @param intersectInfo contains the settings of the intersection to perform, to setup before calling this method as well as the result, available after a call to this method.
         */
        Prim2DBase.prototype.intersect = function (intersectInfo) {
            if (!intersectInfo) {
                return false;
            }
            // If this is null it means this method is call for the first level, initialize stuffs
            var firstLevel = !intersectInfo._globalPickPosition;
            if (firstLevel) {
                // Compute the pickPosition in global space and use it to find the local position for each level down, always relative from the world to get the maximum accuracy (and speed). The other way would have been to compute in local every level down relative to its parent's local, which wouldn't be as accurate (even if javascript number is 80bits accurate).
                intersectInfo._globalPickPosition = BABYLON.Vector2.Zero();
                this.globalTransform.transformPointToRef(intersectInfo.pickPosition, intersectInfo._globalPickPosition);
                intersectInfo._localPickPosition = intersectInfo.pickPosition.clone();
                intersectInfo.intersectedPrimitives = new Array();
                intersectInfo.topMostIntersectedPrimitive = null;
            }
            if (!Prim2DBase_1._bypassGroup2DExclusion && this instanceof BABYLON.Group2D && this.isCachedGroup && !this.isRenderableGroup) {
                // Important to call this before each return to allow a good recursion next time this intersectInfo is reused
                intersectInfo._exit(firstLevel);
                return false;
            }
            if (!intersectInfo.intersectHidden && !this.isVisible) {
                // Important to call this before each return to allow a good recursion next time this intersectInfo is reused
                intersectInfo._exit(firstLevel);
                return false;
            }
            var id = this.id;
            if (id != null && id.indexOf("__cachedSpriteOfGroup__") === 0) {
                try {
                    Prim2DBase_1._bypassGroup2DExclusion = true;
                    var ownerGroup = this.getExternalData("__cachedGroup__");
                    if (!ownerGroup) {
                        return false;
                    }
                    return ownerGroup.intersect(intersectInfo);
                }
                finally {
                    Prim2DBase_1._bypassGroup2DExclusion = false;
                }
            }
            // If we're testing a cachedGroup, we must reject pointer outside its levelBoundingInfo because children primitives could be partially clipped outside so we must not accept them as intersected when it's the case (because they're not visually visible).
            var isIntersectionTest = false;
            if (this instanceof BABYLON.Group2D) {
                var g = this;
                isIntersectionTest = g.isCachedGroup;
            }
            if (isIntersectionTest && !this.levelBoundingInfo.doesIntersect(intersectInfo._localPickPosition)) {
                // Important to call this before each return to allow a good recursion next time this intersectInfo is reused
                intersectInfo._exit(firstLevel);
                return false;
            }
            // Fast rejection test with boundingInfo
            var boundingIntersected = true;
            if (this.isPickable && !this.boundingInfo.doesIntersect(intersectInfo._localPickPosition)) {
                if (this.isContainer) {
                    // Important to call this before each return to allow a good recursion next time this intersectInfo is reused
                    intersectInfo._exit(firstLevel);
                    return false;
                }
                boundingIntersected = false;
            }
            // We hit the boundingInfo that bounds this primitive and its children, now we have to test on the primitive of this level
            var levelIntersectRes = false;
            if (this.isPickable) {
                levelIntersectRes = boundingIntersected && this.levelIntersect(intersectInfo);
                if (levelIntersectRes) {
                    var pii = new PrimitiveIntersectedInfo(this, intersectInfo._localPickPosition.clone());
                    intersectInfo.intersectedPrimitives.push(pii);
                    if (!intersectInfo.topMostIntersectedPrimitive || (intersectInfo.topMostIntersectedPrimitive.prim.actualZOffset > pii.prim.actualZOffset)) {
                        intersectInfo.topMostIntersectedPrimitive = pii;
                    }
                    // If we must stop at the first intersection, we're done, quit!
                    if (intersectInfo.findFirstOnly) {
                        intersectInfo._exit(firstLevel);
                        return true;
                    }
                }
            }
            // Recurse to children if needed
            if (!levelIntersectRes || !intersectInfo.findFirstOnly) {
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var curChild = _a[_i];
                    // Don't test primitive not pick able or if it's hidden and we don't test hidden ones
                    if ((!curChild.isPickable && curChild.isContainer) || (!intersectInfo.intersectHidden && !curChild.isVisible)) {
                        continue;
                    }
                    // Must compute the localPickLocation for the children level
                    curChild.invGlobalTransform.transformPointToRef(intersectInfo._globalPickPosition, intersectInfo._localPickPosition);
                    // If we got an intersection with the child and we only need to find the first one, quit!
                    if (curChild.intersect(intersectInfo) && intersectInfo.findFirstOnly) {
                        intersectInfo._exit(firstLevel);
                        return true;
                    }
                }
            }
            intersectInfo._exit(firstLevel);
            return intersectInfo.isIntersected;
        };
        Prim2DBase.prototype.intersectOtherPrim = function (other) {
            var setA = this.triList;
            var setB = other.triList;
            return BABYLON.Tri2DArray.doesIntersect(setA, setB, other.globalTransform.multiply(this.globalTransform.clone().invert()));
        };
        Object.defineProperty(Prim2DBase.prototype, "triList", {
            get: function () {
                if (this._primTriArrayDirty) {
                    this.updateTriArray();
                    this._primTriArrayDirty = false;
                }
                return this._primTriArray;
            },
            enumerable: true,
            configurable: true
        });
        // This is the worst implementation, if the top level primitive doesn't override this method we will just store a quad that defines the bounding rect of the prim
        Prim2DBase.prototype.updateTriArray = function () {
            if (this._primTriArray == null) {
                this._primTriArray = new BABYLON.Tri2DArray(2);
            }
            else {
                this._primTriArray.clear(2);
            }
            var size = this.actualSize;
            var lb = new BABYLON.Vector2(0, 0);
            var rt = new BABYLON.Vector2(size.width, size.height);
            var lt = new BABYLON.Vector2(0, size.height);
            var rb = new BABYLON.Vector2(size.width, 0);
            this._primTriArray.storeTriangle(0, lb, lt, rt);
            this._primTriArray.storeTriangle(1, lb, rt, rb);
        };
        /**
         * Move a child object into a new position regarding its siblings to change its rendering order.
         * You can also use the shortcut methods to move top/bottom: moveChildToTop, moveChildToBottom, moveToTop, moveToBottom.
         * @param child the object to move
         * @param previous the object which will be before "child", if child has to be the first among sibling, set "previous" to null.
         */
        Prim2DBase.prototype.moveChild = function (child, previous) {
            if (child.parent !== this) {
                return false;
            }
            var childIndex = this._children.indexOf(child);
            var prevIndex = previous ? this._children.indexOf(previous) : -1;
            if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagChildrenFlatZOrder)) {
                this._setFlags(BABYLON.SmartPropertyPrim.flagZOrderDirty);
                this._firstZDirtyIndex = Math.min(this._firstZDirtyIndex, prevIndex + 1);
            }
            this._children.splice(prevIndex + 1, 0, this._children.splice(childIndex, 1)[0]);
            return true;
        };
        /**
         * Move the given child so it's displayed on the top of all its siblings
         * @param child the primitive to move to the top
         */
        Prim2DBase.prototype.moveChildToTop = function (child) {
            return this.moveChild(child, this._children[this._children.length - 1]);
        };
        /**
         * Move the given child so it's displayed on the bottom of all its siblings
         * @param child the primitive to move to the top
         */
        Prim2DBase.prototype.moveChildToBottom = function (child) {
            return this.moveChild(child, null);
        };
        /**
         * Move this primitive to be at the top among all its sibling
         */
        Prim2DBase.prototype.moveToTop = function () {
            if (this.parent == null) {
                return false;
            }
            return this.parent.moveChildToTop(this);
        };
        /**
         * Move this primitive to be at the bottom among all its sibling
         */
        Prim2DBase.prototype.moveToBottom = function () {
            if (this.parent == null) {
                return false;
            }
            return this.parent.moveChildToBottom(this);
        };
        Prim2DBase.prototype.addChild = function (child) {
            child._parent = this;
            this._boundingBoxDirty();
            var flat = this._isFlagSet(BABYLON.SmartPropertyPrim.flagChildrenFlatZOrder);
            if (flat) {
                child._setFlags(BABYLON.SmartPropertyPrim.flagChildrenFlatZOrder);
                child._setZOrder(this._zOrder, true);
                child._zMax = this._zOrder;
            }
            else {
                this._setFlags(BABYLON.SmartPropertyPrim.flagZOrderDirty);
            }
            var length = this._children.push(child);
            this._firstZDirtyIndex = Math.min(this._firstZDirtyIndex, length - 1);
            child._setFlags(BABYLON.SmartPropertyPrim.flagActualOpacityDirty);
        };
        /**
         * Dispose the primitive, remove it from its parent.
         */
        Prim2DBase.prototype.dispose = function () {
            if (!_super.prototype.dispose.call(this)) {
                return false;
            }
            if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagCollisionActor)) {
                this.owner._primitiveCollisionManager._removeActor(this);
                this._actorInfo = null;
            }
            if (this._pointerEventObservable) {
                this._pointerEventObservable.clear();
                this._pointerEventObservable = null;
            }
            if (this._actionManager) {
                this._actionManager.dispose();
                this._actionManager = null;
            }
            this.owner.scene.stopAnimation(this);
            // If there's a parent, remove this object from its parent list
            if (this._parent) {
                if (this instanceof BABYLON.Group2D) {
                    var g = this;
                    if (g.isRenderableGroup) {
                        var parentRenderable = this.parent.traverseUp(function (p) { return (p instanceof BABYLON.Group2D && p.isRenderableGroup); });
                        if (parentRenderable != null) {
                            var l = parentRenderable._renderableData._childrenRenderableGroups;
                            var i_1 = l.indexOf(g);
                            if (i_1 !== -1) {
                                l.splice(i_1, 1);
                            }
                        }
                    }
                }
                var i = this._parent._children.indexOf(this);
                if (i !== undefined) {
                    this._parent._children.splice(i, 1);
                }
                this._parent = null;
            }
            // Recurse dispose to children
            if (this._children) {
                while (this._children.length > 0) {
                    this._children[this._children.length - 1].dispose();
                }
            }
            return true;
        };
        Prim2DBase.prototype.onPrimBecomesDirty = function () {
            if (this._renderGroup && !this._isFlagSet(BABYLON.SmartPropertyPrim.flagPrimInDirtyList)) {
                this._renderGroup._addPrimToDirtyList(this);
                this._setFlags(BABYLON.SmartPropertyPrim.flagPrimInDirtyList);
            }
        };
        Prim2DBase.prototype._needPrepare = function () {
            return this._areSomeFlagsSet(BABYLON.SmartPropertyPrim.flagVisibilityChanged | BABYLON.SmartPropertyPrim.flagModelDirty | BABYLON.SmartPropertyPrim.flagModelUpdate | BABYLON.SmartPropertyPrim.flagNeedRefresh) || (this._instanceDirtyFlags !== 0) || (this._globalTransformProcessStep !== this._globalTransformStep);
        };
        Prim2DBase.prototype._prepareRender = function (context) {
            var globalTransformStep = this.owner._globalTransformStep;
            if (this._prepareProcessStep < globalTransformStep) {
                this._prepareRenderPre(context);
                this._prepareRenderPost(context);
                this._prepareProcessStep = globalTransformStep;
            }
        };
        Prim2DBase.prototype._prepareRenderPre = function (context) {
        };
        Prim2DBase.prototype._prepareRenderPost = function (context) {
            // Don't recurse if it's a renderable group, the content will be processed by the group itself
            if (this instanceof BABYLON.Group2D) {
                var self = this;
                if (self.isRenderableGroup) {
                    return;
                }
            }
            // Check if we need to recurse the prepare to children primitives
            //  - must have children
            //  - the global transform of this level have changed, or
            //  - the visible state of primitive has changed
            if (this._children.length > 0 && ((this._globalTransformProcessStep !== this._globalTransformStep) ||
                this.checkPropertiesDirty(Prim2DBase_1.isVisibleProperty.flagId))) {
                this._children.forEach(function (c) {
                    // As usual stop the recursion if we meet a renderable group
                    if (!(c instanceof BABYLON.Group2D && c.isRenderableGroup)) {
                        c._prepareRender(context);
                    }
                });
            }
            // Finally reset the dirty flags as we've processed everything
            this._clearFlags(BABYLON.SmartPropertyPrim.flagModelDirty);
            this._instanceDirtyFlags = 0;
        };
        Prim2DBase.prototype._canvasPreInit = function (settings) {
        };
        Prim2DBase.CheckParent = function (parent) {
            //if (!Prim2DBase._isCanvasInit && !parent) {
            //    throw new Error("A Primitive needs a valid Parent, it can be any kind of Primitives based types, even the Canvas (with the exception that only Group2D can be direct child of a Canvas if the cache strategy used is TOPLEVELGROUPS)");
            //}
        };
        Prim2DBase.prototype.updateCachedStatesOf = function (list, recurse) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var cur = list_1[_i];
                cur.updateCachedStates(recurse);
            }
        };
        Prim2DBase.prototype._parentLayoutDirty = function () {
            if (!this._parent || this._parent.isDisposed) {
                return;
            }
            this._parent._setLayoutDirty();
        };
        Prim2DBase.prototype._setLayoutDirty = function () {
            this.onPrimBecomesDirty();
            this._setFlags(BABYLON.SmartPropertyPrim.flagLayoutDirty);
        };
        //private _checkPositionChange(): boolean {
        //    if (this.parent && this.parent.layoutEngine.isChildPositionAllowed === false) {
        //        console.log(`Can't manually set the position of ${this.id}, the Layout Engine of its parent doesn't allow it`);
        //        return false;
        //    }
        //    if (this._isFlagSet(SmartPropertyPrim.flagUsePositioning)) {
        //        if (<any>this instanceof Group2D && (<Group2D><any>this).trackedNode == null) {
        //            console.log(`You can't set the position/x/y of ${this.id} properties while positioning engine is used (margin, margin alignment and/or padding are set`);
        //            return false;
        //        }
        //    }
        //    return true;
        //}
        Prim2DBase.prototype._checkUseMargin = function () {
            // Special cae: tracked node
            if (this instanceof BABYLON.Group2D && this.trackedNode != null) {
                return false;
            }
            return this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning);
        };
        Prim2DBase.prototype._positioningDirty = function () {
            if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning)) {
                return;
            }
            this.onPrimBecomesDirty();
            this._setFlags(BABYLON.SmartPropertyPrim.flagPositioningDirty);
        };
        Prim2DBase.prototype._spreadActualOpacityChanged = function () {
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child._setFlags(BABYLON.SmartPropertyPrim.flagActualOpacityDirty);
                child._updateRenderMode();
                child.onPrimBecomesDirty();
                child._spreadActualOpacityChanged();
            }
        };
        Prim2DBase.prototype._changeLayoutEngine = function (engine) {
            this._layoutEngine = engine;
        };
        Prim2DBase.prototype._updateLocalTransform = function () {
            var tflags = Prim2DBase_1.actualPositionProperty.flagId | Prim2DBase_1.rotationProperty.flagId | Prim2DBase_1.scaleProperty.flagId | Prim2DBase_1.scaleXProperty.flagId | Prim2DBase_1.scaleYProperty.flagId | Prim2DBase_1.originProperty.flagId;
            if (this.checkPropertiesDirty(tflags) || this._areSomeFlagsSet(BABYLON.SmartPropertyPrim.flagLocalTransformDirty | BABYLON.SmartPropertyPrim.flagPositioningDirty)) {
                if (this.owner) {
                    this.owner.addupdateLocalTransformCounter(1);
                }
                // Check for positioning update
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty)) {
                    this._updatePositioning();
                }
                var rot = this._rotation;
                var local;
                var pos = this._position ? this.position : (this.layoutAreaPos || Prim2DBase_1._v0);
                var postScale = this._postScale;
                var canvasScale = Prim2DBase_1._iv2;
                //let hasCanvasScale = false;
                //if (this._parent instanceof Canvas2D) {
                //    hasCanvasScale = true;
                //    canvasScale = (this._parent as Canvas2D)._canvasLevelScale || Prim2DBase._iv2;
                //}
                var globalScale = this._scale.multiplyByFloats(/*postScale.x**/ canvasScale.x, /*postScale.y**/ canvasScale.y);
                if ((this._origin.x === 0 && this._origin.y === 0) || this._hasMargin) {
                    local = BABYLON.Matrix2D.Compose(globalScale, rot, new BABYLON.Vector2(pos.x + this._marginOffset.x, pos.y + this._marginOffset.y));
                    this._localTransform = local;
                    this._localLayoutTransform = BABYLON.Matrix2D.Compose(globalScale, rot, new BABYLON.Vector2(pos.x, pos.y));
                }
                else {
                    // -Origin offset
                    var t0 = Prim2DBase_1._t0;
                    var t1 = Prim2DBase_1._t1;
                    var t2 = Prim2DBase_1._t2;
                    var as = Prim2DBase_1._ts0;
                    as.copyFrom(this.actualSize);
                    //as.width /= postScale.x;
                    //as.height /= postScale.y;
                    BABYLON.Matrix2D.TranslationToRef((-as.width * this._origin.x), (-as.height * this._origin.y), t0);
                    // -Origin * rotation
                    BABYLON.Matrix2D.RotationToRef(rot, t1);
                    t0.multiplyToRef(t1, t2);
                    BABYLON.Matrix2D.ScalingToRef(this._scale.x, this._scale.y, t0);
                    t2.multiplyToRef(t0, t1);
                    BABYLON.Matrix2D.TranslationToRef((as.width * this._origin.x), (as.height * this._origin.y), t2);
                    t1.multiplyToRef(t2, t0);
                    BABYLON.Matrix2D.ScalingToRef(postScale.x, postScale.y, t1);
                    t0.multiplyToRef(t1, t2);
                    BABYLON.Matrix2D.TranslationToRef(pos.x + this._marginOffset.x, pos.y + this._marginOffset.y, t0);
                    t2.multiplyToRef(t0, this._localTransform);
                    //if (hasCanvasScale) {
                    //    Matrix2D.ScalingToRef(canvasScale.x, canvasScale.y, Prim2DBase._t1);
                    //    this._localTransform.multiplyToRef(Prim2DBase._t1, this._localTransform);
                    //}
                    this._localLayoutTransform = BABYLON.Matrix2D.Compose(globalScale, rot, pos);
                }
                this.clearPropertiesDirty(tflags);
                this._setFlags(BABYLON.SmartPropertyPrim.flagGlobalTransformDirty);
                this._clearFlags(BABYLON.SmartPropertyPrim.flagLocalTransformDirty);
                return true;
            }
            return false;
        };
        Prim2DBase.prototype.updateCachedStates = function (recurse) {
            if (this.isDisposed) {
                BABYLON.C2DLogging.setPostMessage(function () { return "disposed"; });
                return;
            }
            var ownerProcessStep = this.owner._globalTransformProcessStep;
            if (this._updateCachesProcessStep === ownerProcessStep) {
                return;
            }
            this._updateCachesProcessStep = ownerProcessStep;
            this.owner.addUpdateCachedStateCounter(1);
            // Check if the parent is synced
            if (this._parent && ((this._parent._globalTransformProcessStep !== this.owner._globalTransformProcessStep) || this._parent._areSomeFlagsSet(BABYLON.SmartPropertyPrim.flagLayoutDirty | BABYLON.SmartPropertyPrim.flagPositioningDirty | BABYLON.SmartPropertyPrim.flagZOrderDirty))) {
                this._parent.updateCachedStates(false);
            }
            // Update Z-Order if needed
            if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagZOrderDirty)) {
                this._updateZOrder();
            }
            // Update actualSize only if there' not positioning to recompute and the size changed
            // Otherwise positioning will take care of it.
            var sizeDirty = this.checkPropertiesDirty(Prim2DBase_1.sizeProperty.flagId);
            if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutDirty) && !this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty) && sizeDirty) {
                var size = this.size;
                this.onPropertyChanged("actualSize", size, size, Prim2DBase_1.actualSizeProperty.flagId);
                this.clearPropertiesDirty(Prim2DBase_1.sizeProperty.flagId);
            }
            var positioningDirty = this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty);
            var positioningComputed = positioningDirty && !this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty);
            // Check for layout update
            if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutDirty)) {
                this.owner.addUpdateLayoutCounter(1);
                this._layoutEngine.updateLayout(this);
                this._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutDirty);
            }
            var autoContentChanged = false;
            if (this.isSizeAuto) {
                if (!this._lastAutoSizeArea) {
                    autoContentChanged = this.actualSize !== null;
                }
                else {
                    autoContentChanged = (!this._lastAutoSizeArea.equals(this.actualSize));
                }
            }
            // Check for positioning update
            if (!positioningComputed && (autoContentChanged || sizeDirty || this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty) || (this._parent && !this._parent.contentArea.equals(this._parentContentArea)))) {
                this._updatePositioning();
                if (sizeDirty) {
                    this.clearPropertiesDirty(Prim2DBase_1.sizeProperty.flagId);
                }
                positioningComputed = true;
            }
            if (positioningComputed && this._parent) {
                this._parentContentArea.copyFrom(this._parent.contentArea);
            }
            // Check if we must update this prim
            if (!this._globalTransform || (this._globalTransformProcessStep !== this.owner._globalTransformProcessStep) || (this._areSomeFlagsSet(BABYLON.SmartPropertyPrim.flagGlobalTransformDirty))) {
                this.owner.addUpdateGlobalTransformCounter(1);
                var curVisibleState = this.isVisible;
                this.isVisible = (!this._parent || this._parent.isVisible) && this.levelVisible;
                // Detect a change of visibility
                this._changeFlags(BABYLON.SmartPropertyPrim.flagVisibilityChanged, curVisibleState !== this.isVisible);
                // Get/compute the localTransform
                var localDirty = this._updateLocalTransform();
                var parentPaddingChanged = false;
                var parentPaddingOffset = Prim2DBase_1._v0;
                if (this._parent) {
                    parentPaddingOffset = new BABYLON.Vector2(this._parent._paddingOffset.x, this._parent._paddingOffset.y);
                    parentPaddingChanged = !parentPaddingOffset.equals(this._parentPaddingOffset);
                }
                // Check if there are changes in the parent that will force us to update the global matrix
                var parentDirty = (this._parent != null) ? (this._parent._globalTransformStep !== this._parentTransformStep) : false;
                // Check if we have to update the globalTransform
                if (!this._globalTransform || localDirty || parentDirty || parentPaddingChanged || this._areSomeFlagsSet(BABYLON.SmartPropertyPrim.flagGlobalTransformDirty)) {
                    var globalTransform = this._parent ? this._parent._globalTransform : null;
                    var localTransform = void 0;
                    Prim2DBase_1._transMtx.copyFrom(this._localTransform);
                    Prim2DBase_1._transMtx.m[4] += parentPaddingOffset.x;
                    Prim2DBase_1._transMtx.m[5] += parentPaddingOffset.y;
                    localTransform = Prim2DBase_1._transMtx;
                    this._globalTransform = this._parent ? localTransform.multiply(globalTransform) : localTransform.clone();
                    this._invGlobalTransform = BABYLON.Matrix2D.Invert(this._globalTransform);
                    this._levelBoundingInfo.dirtyWorldAABB();
                    this._boundingInfo.dirtyWorldAABB();
                    this._globalTransformStep = this.owner._globalTransformProcessStep + 1;
                    this._parentTransformStep = this._parent ? this._parent._globalTransformStep : 0;
                    this._clearFlags(BABYLON.SmartPropertyPrim.flagGlobalTransformDirty);
                }
                this._globalTransformProcessStep = this.owner._globalTransformProcessStep;
            }
            if (recurse) {
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    // Stop the recursion if we meet a renderable group
                    child.updateCachedStates(!(child instanceof BABYLON.Group2D && child.isRenderableGroup));
                }
            }
        };
        Prim2DBase.prototype._updatePositioning = function () {
            if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning)) {
                BABYLON.C2DLogging.setPostMessage(function () { return "Not using positioning engine"; });
                // Just in case, if may happen and if we don't clear some computation will keep going on forever
                this._clearFlags(BABYLON.SmartPropertyPrim.flagPositioningDirty);
                return;
            }
            var success = true;
            // Check if re-entrance is occurring
            if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagComputingPositioning) /* || (hasMargin && !this._layoutArea)*/) {
                if (!this._actualSize) {
                    this._actualSize = this.size.clone() || BABYLON.Size.Zero();
                    this._contentArea.copyFrom(this._actualSize);
                }
                if (!this._actualPosition) {
                    this._actualPosition = BABYLON.Vector2.Zero();
                }
                BABYLON.C2DLogging.setPostMessage(function () { return "Re entrance detected"; });
                return;
            }
            if (this.owner) {
                this.owner.addUpdatePositioningCounter(1);
            }
            // Set the flag to avoid re-entrance
            this._setFlags(BABYLON.SmartPropertyPrim.flagComputingPositioning);
            try {
                var isSizeAuto = this.isSizeAuto;
                var isVSizeAuto = this.isVerticalSizeAuto;
                var isHSizeAuto = this.isHorizontalSizeAuto;
                var ma = this._marginAlignment ? this._marginAlignment.clone() : new PrimitiveAlignment();
                var levelScale = this._scale;
                var primSize = this.size;
                // If the primitive has no size and is autoSized without margin, then set a Stretch/Stretch margin alignment for the primitive to take all the available space
                if (!this._hasMarginAlignment && (isSizeAuto && (primSize === Prim2DBase_1.nullSize || (primSize === this._internalSize && primSize.width === 0 && primSize.height === 0)))) {
                    if (isSizeAuto || this.actualSize.width == null) {
                        ma.horizontal = PrimitiveAlignment.AlignStretch;
                    }
                    if (isSizeAuto || this.actualSize.height == null) {
                        ma.vertical = PrimitiveAlignment.AlignStretch;
                    }
                }
                var transformedBSize = Prim2DBase_1._size3;
                var bSize = Prim2DBase_1._size4;
                var bi = this.boundingInfo;
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagBoundingInfoDirty)) {
                    success = false;
                }
                var tbi = Prim2DBase_1._tbi;
                bi.transformToRef(BABYLON.Matrix2D.Rotation(this.rotation), tbi);
                tbi.sizeToRef(transformedBSize);
                bi.sizeToRef(bSize);
                bi.extent.subtractToRef(bi.center, Prim2DBase_1._pv1);
                tbi.center.subtractToRef(tbi.extent, Prim2DBase_1._pv2);
                var transbi = Prim2DBase_1._pv2.add(Prim2DBase_1._pv1);
                var setSize = false;
                var hasMargin = (this._margin !== null && !this._margin.isDefault) || (ma !== null && !ma.isDefault);
                var primNewSize = Prim2DBase_1._size;
                var hasH = false;
                var hasV = false;
                //let paddingApplied = false;
                var hasPadding = this._hasPadding;
                // Compute the size
                // The size is the size of the prim or the computed one if there's a marginAlignment of Stretch
                if (hasMargin) {
                    var layoutArea = this.layoutArea;
                    if (layoutArea /*&& layoutArea.width >= size.width */ && ma.horizontal === PrimitiveAlignment.AlignStretch) {
                        this.margin.computeWithAlignment(layoutArea, primSize, ma, levelScale, this._marginOffset, primNewSize, false, PrimitiveThickness.ComputeH);
                        hasH = true;
                        setSize = true;
                    }
                    if (layoutArea /*&& layoutArea.height >= size.height */ && ma.vertical === PrimitiveAlignment.AlignStretch) {
                        this.margin.computeWithAlignment(layoutArea, primSize, ma, levelScale, this._marginOffset, primNewSize, false, PrimitiveThickness.ComputeV);
                        hasV = true;
                        setSize = true;
                    }
                }
                if (!hasH) {
                    // If the Horizontal size is Auto, we have to compute it from its content and padding
                    if (isHSizeAuto) {
                        primNewSize.width = bSize.width;
                        setSize = true;
                    }
                    else {
                        primNewSize.width = primSize.width;
                    }
                }
                if (!hasV) {
                    // If the Vertical size is Auto, we have to compute it from its content and padding
                    if (isVSizeAuto) {
                        primNewSize.height = bSize.height;
                        setSize = true;
                    }
                    else {
                        primNewSize.height = primSize.height;
                    }
                }
                Prim2DBase_1._curContentArea.copyFrom(this._contentArea);
                if (hasPadding) {
                    var area = Prim2DBase_1._icArea;
                    var zone = Prim2DBase_1._icZone;
                    this._getInitialContentAreaToRef(primNewSize, zone, area);
                    area.width = Math.max(0, area.width);
                    area.height = Math.max(0, area.height);
                    this.padding.compute(area, this._paddingOffset, Prim2DBase_1._size2);
                    if (!isHSizeAuto) {
                        this._paddingOffset.x += zone.x;
                        this._paddingOffset.z -= zone.z;
                        this._contentArea.width = Prim2DBase_1._size2.width;
                    }
                    if (!isVSizeAuto) {
                        this._paddingOffset.y += zone.y;
                        this._paddingOffset.w -= zone.w;
                        this._contentArea.height = Prim2DBase_1._size2.height;
                    }
                }
                else {
                    this._contentArea.copyFrom(primNewSize);
                }
                if (!Prim2DBase_1._curContentArea.equals(this._contentArea)) {
                    this._setLayoutDirty();
                }
                // Finally we apply margin to determine the position
                if (hasMargin) {
                    var layoutArea = this.layoutArea;
                    var mo = this._marginOffset;
                    var margin = this.margin;
                    // We compute margin only if the layoutArea is "real": a valid object with dimensions greater than 0
                    //  otherwise sometimes this code would be triggered with and invalid layoutArea, resulting to an invalid positioning
                    // So we make sure with compute alignment only if the layoutArea is good
                    if (layoutArea && layoutArea.width > 0 && layoutArea.height > 0) {
                        margin.computeWithAlignment(layoutArea, transformedBSize, ma, levelScale, mo, Prim2DBase_1._size2);
                    }
                    else {
                        mo.copyFromFloats(0, 0, 0, 0);
                    }
                    var tbi_1 = Prim2DBase_1._tpsBB;
                    tbi_1.copyFrom(bi);
                    var minmax = Prim2DBase_1._bMinMax;
                    tbi_1.minMaxToRef(minmax);
                    minmax.z += margin.leftPixels + margin.rightPixels;
                    minmax.w += margin.topPixels + margin.bottomPixels;
                    BABYLON.BoundingInfo2D.CreateFromMinMaxToRef(minmax.x, minmax.z, minmax.y, minmax.w, tbi_1);
                    // Check if the layoutBoundingInfo changed
                    var changed = false;
                    if (!this._layoutBoundingInfo) {
                        this._layoutBoundingInfo = tbi_1.clone();
                        changed = true;
                    }
                    else if (!this._layoutBoundingInfo.equals(tbi_1)) {
                        this._layoutBoundingInfo.copyFrom(tbi_1);
                        changed = true;
                    }
                    if (changed) {
                        var p = this._parent;
                        while (p) {
                            if (p.isSizedByContent) {
                                p._setFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty);
                                p.onPrimitivePropertyDirty(Prim2DBase_1.actualSizeProperty.flagId);
                            }
                            else {
                                break;
                            }
                            p = p._parent;
                        }
                        this.onPrimitivePropertyDirty(Prim2DBase_1.actualSizeProperty.flagId);
                    }
                    this._marginOffset.x -= transbi.x * levelScale.x;
                    this._marginOffset.y -= transbi.y * levelScale.y;
                }
                var lap = this.layoutAreaPos;
                this.actualPosition = new BABYLON.Vector2(this._marginOffset.x + (lap ? lap.x : 0), this._marginOffset.y + (lap ? lap.y : 0));
                //                if (setSize) {
                this.actualSize = primNewSize.clone();
                //                }
                this._setFlags(BABYLON.SmartPropertyPrim.flagLocalTransformDirty);
                if (isSizeAuto) {
                    this._lastAutoSizeArea = this.actualSize;
                }
                if (this.displayDebugAreas) {
                    this._updateDebugArea();
                }
            }
            finally {
                BABYLON.C2DLogging.setPostMessage(function () { return "Succeeded"; });
                this._clearFlags(BABYLON.SmartPropertyPrim.flagComputingPositioning);
                // Remove dirty flag
                if (success) {
                    this._clearFlags(BABYLON.SmartPropertyPrim.flagPositioningDirty);
                }
            }
        };
        Object.defineProperty(Prim2DBase.prototype, "contentArea", {
            /**
             * Get the content are of this primitive, this area is computed the primitive size and using the padding property.
             * Children of this primitive will be positioned relative to the bottom/left corner of this area.
             */
            get: function () {
                if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagUsePositioning)) {
                    if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagPositioningDirty)) {
                        this._updatePositioning();
                    }
                    return this._contentArea;
                }
                else {
                    return this.size;
                }
            },
            enumerable: true,
            configurable: true
        });
        Prim2DBase.prototype._patchHierarchy = function (owner) {
            if (this._owner == null) {
                this._owner = owner;
                this.onSetOwner();
                this._setFlags(BABYLON.SmartPropertyPrim.flagLayoutBoundingInfoDirty);
            }
            // The only place we initialize the _renderGroup is this method, if it's set, we already been there, no need to execute more
            if (this._renderGroup != null) {
                return;
            }
            if (this instanceof BABYLON.Group2D) {
                var group = this;
                group.detectGroupStates();
                if (group._trackedNode && !group._isFlagSet(BABYLON.SmartPropertyPrim.flagTrackedGroup)) {
                    group.owner._registerTrackedNode(this);
                }
            }
            this._renderGroup = this.traverseUp(function (p) { return p instanceof BABYLON.Group2D && p.isRenderableGroup; });
            if (this._parent) {
                this._parentLayoutDirty();
            }
            // Make sure the prim is in the dirtyList if it should be
            if (this._renderGroup && this.isDirty) {
                var list = this._renderGroup._renderableData._primDirtyList;
                var i = list.indexOf(this);
                if (i === -1) {
                    this._setFlags(BABYLON.SmartPropertyPrim.flagPrimInDirtyList);
                    list.push(this);
                }
            }
            // Recurse
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child._hierarchyDepth = this._hierarchyDepth + 1;
                child._patchHierarchy(owner);
            }
        };
        Prim2DBase.prototype.onSetOwner = function () {
        };
        Prim2DBase.prototype._updateZOrder = function () {
            var prevLinPos = this._primLinearPosition;
            var startI = 0;
            var startZ = this._zOrder;
            // We must start rebuilding Z-Order from the Prim before the first one that changed, because we know its Z-Order is correct, so are its children, but it's better to recompute everything from this point instead of finding the last valid children
            var childrenCount = this._children.length;
            if (this._firstZDirtyIndex > 0) {
                if ((this._firstZDirtyIndex - 1) < childrenCount) {
                    var prevPrim = this._children[this._firstZDirtyIndex - 1];
                    prevLinPos = prevPrim._primLinearPosition;
                    startI = this._firstZDirtyIndex - 1;
                    startZ = prevPrim._zOrder;
                }
            }
            var startPos = prevLinPos;
            // Update the linear position of the primitive from the first one to the last inside this primitive, compute the total number of prim traversed
            Prim2DBase_1._totalCount = 0;
            for (var i = startI; i < childrenCount; i++) {
                var child = this._children[i];
                prevLinPos = child._updatePrimitiveLinearPosition(prevLinPos);
            }
            // Compute the new Z-Order for all the primitives
            // Add 20% to the current total count to reserve space for future insertions, except if we're rebuilding due to a zMinDelta reached
            var zDelta = (this._zMax - startZ) / (Prim2DBase_1._totalCount * (Prim2DBase_1._zRebuildReentrency ? 1 : 1.2));
            // If the computed delta is less than the smallest allowed by the depth buffer, we rebuild the Z-Order from the very beginning of the primitive's children (that is, the first) to redistribute uniformly the Z.
            if (zDelta < BABYLON.Canvas2D._zMinDelta) {
                // Check for re-entrance, if the flag is true we already attempted a rebuild but couldn't get a better zDelta, go up in the hierarchy to rebuilt one level up, hoping to get this time a decent delta, otherwise, recurse until we got it or when no parent is reached, which would mean the canvas would have more than 16 millions of primitives...
                if (Prim2DBase_1._zRebuildReentrency) {
                    var p = this._parent;
                    if (p == null) {
                        // Can't find a good Z delta and we're in the canvas, which mean we're dealing with too many objects (which should never happen, but well...)
                        console.log("Can't compute Z-Order for " + this.id + "'s children, zDelta is too small, Z-Order is now in an unstable state");
                        Prim2DBase_1._zRebuildReentrency = false;
                        return;
                    }
                    p._firstZDirtyIndex = 0;
                    return p._updateZOrder();
                }
                Prim2DBase_1._zRebuildReentrency = true;
                this._firstZDirtyIndex = 0;
                this._updateZOrder();
                Prim2DBase_1._zRebuildReentrency = false;
            }
            for (var i = startI; i < childrenCount; i++) {
                var child = this._children[i];
                child._updatePrimitiveZOrder(startPos, startZ, zDelta);
            }
            // Notify the Observers that we found during the Z change (we do it after to avoid any kind of re-entrance)
            for (var _i = 0, _a = Prim2DBase_1._zOrderChangedNotifList; _i < _a.length; _i++) {
                var p = _a[_i];
                p._actualZOrderChangedObservable.notifyObservers(p.actualZOffset);
            }
            Prim2DBase_1._zOrderChangedNotifList.splice(0);
            this._firstZDirtyIndex = Prim2DBase_1._bigInt;
            this._clearFlags(BABYLON.SmartPropertyPrim.flagZOrderDirty);
        };
        Prim2DBase.prototype._updatePrimitiveLinearPosition = function (prevLinPos) {
            if (this.isManualZOrder) {
                return prevLinPos;
            }
            this._primLinearPosition = ++prevLinPos;
            Prim2DBase_1._totalCount++;
            // Check for the FlatZOrder, which means the children won't have a dedicated Z-Order but will all share the same (unique) one.
            if (!this._isFlagSet(BABYLON.SmartPropertyPrim.flagChildrenFlatZOrder)) {
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    prevLinPos = child._updatePrimitiveLinearPosition(prevLinPos);
                }
            }
            return prevLinPos;
        };
        Prim2DBase.prototype._updatePrimitiveZOrder = function (startPos, startZ, deltaZ) {
            if (this.isManualZOrder) {
                return null;
            }
            var newZ = startZ + ((this._primLinearPosition - startPos) * deltaZ);
            var isFlat = this._isFlagSet(BABYLON.SmartPropertyPrim.flagChildrenFlatZOrder);
            this._setZOrder(newZ, false);
            if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagZOrderDirty)) {
                this._firstZDirtyIndex = Prim2DBase_1._bigInt;
                this._clearFlags(BABYLON.SmartPropertyPrim.flagZOrderDirty);
            }
            var curZ = newZ;
            // Check for the FlatZOrder, which means the children won't have a dedicated Z-Order but will all share the same (unique) one.
            if (isFlat) {
                if (this._children.length > 0) {
                    //let childrenZOrder = startZ + ((this._children[0]._primLinearPosition - startPos) * deltaZ);
                    for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        child._updatePrimitiveFlatZOrder(this._zOrder);
                    }
                }
            }
            else {
                for (var _b = 0, _c = this._children; _b < _c.length; _b++) {
                    var child = _c[_b];
                    var r = child._updatePrimitiveZOrder(startPos, startZ, deltaZ);
                    if (r != null) {
                        curZ = r;
                    }
                }
            }
            this._zMax = isFlat ? newZ : (curZ + deltaZ);
            return curZ;
        };
        Prim2DBase.prototype._updatePrimitiveFlatZOrder = function (newZ) {
            if (this.isManualZOrder) {
                return;
            }
            this._setZOrder(newZ, false);
            this._zMax = newZ;
            if (this._isFlagSet(BABYLON.SmartPropertyPrim.flagZOrderDirty)) {
                this._firstZDirtyIndex = Prim2DBase_1._bigInt;
                this._clearFlags(BABYLON.SmartPropertyPrim.flagZOrderDirty);
            }
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child._updatePrimitiveFlatZOrder(newZ);
            }
        };
        Prim2DBase.prototype._setZOrder = function (newZ, directEmit) {
            if (newZ !== this._zOrder) {
                this._zOrder = newZ;
                this.onPrimBecomesDirty();
                this.onZOrderChanged();
                if (this._actualZOrderChangedObservable && this._actualZOrderChangedObservable.hasObservers()) {
                    if (directEmit) {
                        this._actualZOrderChangedObservable.notifyObservers(newZ);
                    }
                    else {
                        Prim2DBase_1._zOrderChangedNotifList.push(this);
                    }
                }
            }
        };
        Prim2DBase.prototype._updateRenderMode = function () {
        };
        /**
         * This method is used to alter the contentArea of the Primitive before margin is applied.
         * In most of the case you won't need to override this method, but it can prove some usefulness, check the Rectangle2D class for a concrete application.
         * @param primSize the current size of the primitive
         * @param initialContentPosition the position of the initial content area to compute, a valid object is passed, you have to set its properties. PLEASE ROUND the values, we're talking about pixels and fraction of them is not a good thing! x, y, z, w area left, bottom, right, top
         * @param initialContentArea the size of the initial content area to compute, a valid object is passed, you have to set its properties. PLEASE ROUND the values, we're talking about pixels and fraction of them is not a good thing!
         */
        Prim2DBase.prototype._getInitialContentAreaToRef = function (primSize, initialContentPosition, initialContentArea) {
            initialContentArea.copyFrom(primSize);
            initialContentPosition.x = initialContentPosition.y = initialContentPosition.z = initialContentPosition.w = 0;
        };
        /**
         * This method is used to calculate the new size of the primitive based on the content which must stay the same
         * Check the Rectangle2D implementation for a concrete application.
         * @param primSize the current size of the primitive
         * @param newPrimSize the new size of the primitive. PLEASE ROUND THE values, we're talking about pixels and fraction of them are not our friends!
         */
        Prim2DBase.prototype._getActualSizeFromContentToRef = function (primSize, paddingOffset, newPrimSize) {
            newPrimSize.copyFrom(primSize);
        };
        Object.defineProperty(Prim2DBase.prototype, "layoutData", {
            /**
             * Get/set the layout data to use for this primitive.
             */
            get: function () {
                return this._layoutData;
            },
            set: function (value) {
                if (this._layoutData === value) {
                    return;
                }
                this._layoutData = value;
            },
            enumerable: true,
            configurable: true
        });
        return Prim2DBase;
    }(BABYLON.SmartPropertyPrim));
    Prim2DBase.PRIM2DBASE_PROPCOUNT = 25;
    Prim2DBase._bigInt = Math.pow(2, 30);
    Prim2DBase._nullPosition = BABYLON.Vector2.Zero();
    Prim2DBase._nullSize = BABYLON.Size.Zero();
    Prim2DBase.boundinbBoxReentrency = -1;
    Prim2DBase.nullSize = BABYLON.Size.Zero();
    Prim2DBase._bMinMax = BABYLON.Vector4.Zero();
    Prim2DBase._bMax = BABYLON.Vector2.Zero();
    Prim2DBase._bSize = BABYLON.Size.Zero();
    Prim2DBase._tpsBB = new BABYLON.BoundingInfo2D();
    Prim2DBase._tpsBB2 = new BABYLON.BoundingInfo2D();
    Prim2DBase._updatingDebugArea = false;
    Prim2DBase._bypassGroup2DExclusion = false;
    Prim2DBase._isCanvasInit = false;
    Prim2DBase._t0 = new BABYLON.Matrix2D();
    Prim2DBase._t1 = new BABYLON.Matrix2D();
    Prim2DBase._t2 = new BABYLON.Matrix2D();
    Prim2DBase._v0 = BABYLON.Vector2.Zero(); // Must stay with the value 0,0
    Prim2DBase._v30 = BABYLON.Vector3.Zero(); // Must stay with the value 0,0,0
    Prim2DBase._iv2 = new BABYLON.Vector2(1, 1); // Must stay identity vector
    Prim2DBase._ts0 = BABYLON.Size.Zero();
    Prim2DBase._transMtx = BABYLON.Matrix2D.Zero();
    Prim2DBase._icPos = BABYLON.Vector2.Zero();
    Prim2DBase._icZone = BABYLON.Vector4.Zero();
    Prim2DBase._icArea = BABYLON.Size.Zero();
    Prim2DBase._size = BABYLON.Size.Zero();
    Prim2DBase._size2 = BABYLON.Size.Zero();
    Prim2DBase._size3 = BABYLON.Size.Zero();
    Prim2DBase._size4 = BABYLON.Size.Zero();
    Prim2DBase._pv0 = BABYLON.Vector2.Zero();
    Prim2DBase._curContentArea = BABYLON.Size.Zero();
    Prim2DBase._piv = new BABYLON.Vector2(1, 1);
    Prim2DBase._tbi = new BABYLON.BoundingInfo2D();
    Prim2DBase._pv1 = BABYLON.Vector2.Zero();
    Prim2DBase._pv2 = BABYLON.Vector2.Zero();
    Prim2DBase._zOrderChangedNotifList = new Array();
    Prim2DBase._zRebuildReentrency = false;
    Prim2DBase._totalCount = 0;
    __decorate([
        BABYLON.logProp(null, false, false, false),
        BABYLON.instanceLevelProperty(1, function (pi) { return Prim2DBase_1.actualPositionProperty = pi; }, false, false, true)
        /**
         * Return the position where the primitive is rendered in the Canvas, this position may be different than the one returned by the position property due to layout/alignment/margin/padding computing.
         * BEWARE: don't change this value, it's read-only!
         */
    ], Prim2DBase.prototype, "actualPosition", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 1, function (pi) { return Prim2DBase_1.actualXProperty = pi; }, false, false, true)
    ], Prim2DBase.prototype, "actualX", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 2, function (pi) { return Prim2DBase_1.actualYProperty = pi; }, false, false, true)
    ], Prim2DBase.prototype, "actualY", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 3, function (pi) { return Prim2DBase_1.positionProperty = pi; }, false, false, true)
    ], Prim2DBase.prototype, "position", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 4, function (pi) { return Prim2DBase_1.xProperty = pi; }, false, false, true)
    ], Prim2DBase.prototype, "x", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 5, function (pi) { return Prim2DBase_1.yProperty = pi; }, false, false, true)
    ], Prim2DBase.prototype, "y", null);
    __decorate([
        BABYLON.logProp(),
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 6, function (pi) { return Prim2DBase_1.sizeProperty = pi; }, false, true)
        /**
         * Size of the primitive or its bounding area
         * BEWARE: if you change only size.width or height it won't trigger a property change and you won't have the expected behavior.
         * Use this property to set a new Size object, otherwise to change only the width/height use Prim2DBase.width or height properties.
         */
    ], Prim2DBase.prototype, "size", null);
    __decorate([
        BABYLON.logMethod()
    ], Prim2DBase.prototype, "internalGetSize", null);
    __decorate([
        BABYLON.logMethod()
    ], Prim2DBase.prototype, "internalSetSize", null);
    __decorate([
        BABYLON.logProp(),
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 7, function (pi) { return Prim2DBase_1.widthProperty = pi; }, false, true)
        /**
         * Direct access to the size.width value of the primitive
         * Use this property when you only want to change one component of the size property
         */
    ], Prim2DBase.prototype, "width", null);
    __decorate([
        BABYLON.logProp(),
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 8, function (pi) { return Prim2DBase_1.heightProperty = pi; }, false, true)
        /**
         * Direct access to the size.height value of the primitive
         * Use this property when you only want to change one component of the size property
         */
    ], Prim2DBase.prototype, "height", null);
    __decorate([
        BABYLON.logProp(),
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 9, function (pi) { return Prim2DBase_1.rotationProperty = pi; }, false, true)
        /**
         * Rotation of the primitive, in radian, along the Z axis
         */
    ], Prim2DBase.prototype, "rotation", null);
    __decorate([
        BABYLON.logProp(),
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 10, function (pi) { return Prim2DBase_1.scaleProperty = pi; }, false, true)
        /**
         * Uniform scale applied on the primitive. If a non-uniform scale is applied through scaleX/scaleY property the getter of this property will return scaleX.
         */
    ], Prim2DBase.prototype, "scale", null);
    __decorate([
        BABYLON.logProp(),
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 11, function (pi) { return Prim2DBase_1.actualSizeProperty = pi; }, false, true)
        /**
         * Return the size of the primitive as it's being rendered into the target.
         * This value may be different of the size property when layout/alignment is used or specific primitive types can implement a custom logic through this property.
         * BEWARE: don't use the setter, it's for internal purpose only
         * Note to implementers: you have to override this property and declare if necessary a @xxxxInstanceLevel decorator
         */
    ], Prim2DBase.prototype, "actualSize", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 12, function (pi) { return Prim2DBase_1.actualWidthProperty = pi; }, false, true)
        /**
         * Shortcut to actualSize.width
         */
    ], Prim2DBase.prototype, "actualWidth", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 13, function (pi) { return Prim2DBase_1.actualHeightProperty = pi; }, false, true)
        /**
         * Shortcut to actualPosition.height
         */
    ], Prim2DBase.prototype, "actualHeight", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 14, function (pi) { return Prim2DBase_1.originProperty = pi; }, false, true)
    ], Prim2DBase.prototype, "origin", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 15, function (pi) { return Prim2DBase_1.levelVisibleProperty = pi; })
        /**
         * Let the user defines if the Primitive is hidden or not at its level. As Primitives inherit the hidden status from their parent, only the isVisible property give properly the real visible state.
         * Default is true, setting to false will hide this primitive and its children.
         */
    ], Prim2DBase.prototype, "levelVisible", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 16, function (pi) { return Prim2DBase_1.isVisibleProperty = pi; })
        /**
         * Use ONLY THE GETTER to determine if the primitive is visible or not.
         * The Setter is for internal purpose only!
         */
    ], Prim2DBase.prototype, "isVisible", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 17, function (pi) { return Prim2DBase_1.zOrderProperty = pi; })
        /**
         * You can override the default Z Order through this property, but most of the time the default behavior is acceptable
         */
    ], Prim2DBase.prototype, "zOrder", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 18, function (pi) { return Prim2DBase_1.marginProperty = pi; })
        /**
         * You can get/set a margin on the primitive through this property
         * @returns the margin object, if there was none, a default one is created and returned
         */
    ], Prim2DBase.prototype, "margin", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 19, function (pi) { return Prim2DBase_1.paddingProperty = pi; })
        /**
         * You can get/set a margin on the primitive through this property
         * @returns the margin object, if there was none, a default one is created and returned
         */
    ], Prim2DBase.prototype, "padding", null);
    __decorate([
        BABYLON.dynamicLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 20, function (pi) { return Prim2DBase_1.marginAlignmentProperty = pi; })
        /**
         * You can get/set the margin alignment through this property
         */
    ], Prim2DBase.prototype, "marginAlignment", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 21, function (pi) { return Prim2DBase_1.opacityProperty = pi; })
        /**
         * Get/set the opacity of the whole primitive
         */
    ], Prim2DBase.prototype, "opacity", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 22, function (pi) { return Prim2DBase_1.scaleXProperty = pi; }, false, true)
        /**
         * Scale applied on the X axis of the primitive
         */
    ], Prim2DBase.prototype, "scaleX", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 23, function (pi) { return Prim2DBase_1.scaleYProperty = pi; }, false, true)
        /**
         * Scale applied on the Y axis of the primitive
         */
    ], Prim2DBase.prototype, "scaleY", null);
    __decorate([
        BABYLON.instanceLevelProperty(BABYLON.SmartPropertyPrim.SMARTPROPERTYPRIM_PROPCOUNT + 24, function (pi) { return Prim2DBase_1.actualScaleProperty = pi; }, false, true)
    ], Prim2DBase.prototype, "actualScale", null);
    __decorate([
        BABYLON.logProp("", true)
    ], Prim2DBase.prototype, "boundingInfo", null);
    __decorate([
        BABYLON.logProp("", true)
    ], Prim2DBase.prototype, "layoutBoundingInfo", null);
    __decorate([
        BABYLON.logMethod("", true)
    ], Prim2DBase.prototype, "_setLayoutDirty", null);
    __decorate([
        BABYLON.logMethod("", true)
    ], Prim2DBase.prototype, "_positioningDirty", null);
    __decorate([
        BABYLON.logMethod()
    ], Prim2DBase.prototype, "updateCachedStates", null);
    __decorate([
        BABYLON.logMethod()
    ], Prim2DBase.prototype, "_updatePositioning", null);
    Prim2DBase = Prim2DBase_1 = __decorate([
        BABYLON.className("Prim2DBase", "BABYLON")
        /**
         * Base class for a Primitive of the Canvas2D feature
         */
    ], Prim2DBase);
    BABYLON.Prim2DBase = Prim2DBase;
    var PrimitiveAlignment_1, PrimitiveThickness_1, Prim2DBase_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.prim2dBase.js.map
