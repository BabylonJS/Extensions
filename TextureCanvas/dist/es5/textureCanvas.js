"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var effect_1 = require("@babylonjs/core/Materials/effect");
var material_1 = require("@babylonjs/core/Materials/material");
var texture_1 = require("@babylonjs/core/Materials/Textures/texture");
var math_1 = require("@babylonjs/core/Maths/math");
var buffer_1 = require("@babylonjs/core/Meshes/buffer");
effect_1.Effect.ShadersStore["textureCanvasVertexShader"] = "\n// Attributes\nattribute vec2 position;\n\n// Output\nvarying vec2 vPosition;\nvarying vec2 vLocalUV;\nvarying vec2 vWorldUV;\n\n// Uniforms\nuniform mat4 rotationMatrix;\nuniform vec2 pivotPoint;\nuniform vec2 translation;\nuniform vec2 scaling;\nuniform vec2 skewing;\n\nconst vec2 madd = vec2(0.5, 0.5);\n\nvoid main(void) {\n    vec2 skewed = vec2(position.x + skewing.x * position.y, position.y + skewing.y * position.x);\n    vec2 transformed = (vec4(skewed * scaling + translation - pivotPoint, 0.0, 0.0) * rotationMatrix).xy + pivotPoint;\n\n    gl_Position = vec4(transformed, 0.0, 1.0);\n    \n    vPosition = position;\n\tvLocalUV = position * madd + madd;\n    vWorldUV = gl_Position.xy * madd + madd;\n}\n";
effect_1.Effect.ShadersStore["textureCanvasFragmentShader"] = "\nprecision highp float;\n\nvarying vec2 vLocalUV;\nvarying vec2 vWorldUV;\n\nuniform sampler2D diffuseSampler;\nuniform sampler2D opacitySampler;\nuniform sampler2D backgroundSampler;\n\nuniform vec4 diffuseSamplingRect;\nuniform vec4 opacitySamplingRect;\nuniform float opacityTextureIntensity;\n\nvoid main(void) {\n    vec4 backgroundPixel = texture2D(backgroundSampler, vWorldUV);\n    vec4 diffusePixel = texture2D(diffuseSampler, vLocalUV * diffuseSamplingRect.zw + diffuseSamplingRect.xy);\n    vec4 opacityPixel = texture2D(opacitySampler, vLocalUV * opacitySamplingRect.zw + opacitySamplingRect.xy);\n    gl_FragColor = mix(backgroundPixel, diffusePixel, opacityPixel.a * opacityTextureIntensity + (1.0 - opacityTextureIntensity) * diffusePixel.a);\n}\n";
var UVector = /** @class */ (function () {
    function UVector(u, v) {
        this.u = u;
        this.v = v;
    }
    /**
     * Returns a clone of this UVector.
     */
    UVector.prototype.clone = function () {
        return new UVector(this.u, this.v);
    };
    return UVector;
}());
exports.UVector = UVector;
var Rectangle = /** @class */ (function () {
    /**
     * A rectangle in uv-space.
     *
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param width The width.
     * @param height The height.
     */
    function Rectangle(u, v, width, height) {
        this.u = u;
        this.v = v;
        this.width = width;
        this.height = height;
    }
    /**
     * Returns a clone of this rectangle.
     */
    Rectangle.prototype.clone = function () {
        return new Rectangle(this.u, this.v, this.width, this.height);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
var PivotPoint = /** @class */ (function (_super) {
    __extends(PivotPoint, _super);
    /**
     * A rotation origin.
     *
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of the canvas).
     */
    function PivotPoint(u, v, isLocalSpace) {
        var _this = _super.call(this, u, v) || this;
        _this.u = u;
        _this.v = v;
        _this.isLocalSpace = isLocalSpace;
        return _this;
    }
    /**
     * Returns a clone of this pivot point.
     */
    PivotPoint.prototype.clone = function () {
        return new PivotPoint(this.u, this.v, this.isLocalSpace);
    };
    return PivotPoint;
}(UVector));
exports.PivotPoint = PivotPoint;
var Vector3Matrix = /** @class */ (function (_super) {
    __extends(Vector3Matrix, _super);
    function Vector3Matrix(x, y, z) {
        var _this = _super.call(this, x, y, z) || this;
        _this._matrixId = math_1.Vector3.Zero();
        _this._matrix = math_1.Matrix.Identity();
        _this.getMatrix();
        return _this;
    }
    /**
     * Overwrites the computed rotation matrix for the current xyz values.
     *
     * @param matrix The matrix to set.
     */
    Vector3Matrix.prototype.setMatrix = function (matrix) {
        this._matrix = matrix;
        this._matrixId.copyFrom(this);
        return matrix;
    };
    /**
     * Gets the computed rotation matrix for the current xyz values.
     */
    Vector3Matrix.prototype.getMatrix = function () {
        if (!this.equals(this._matrixId)) {
            math_1.Matrix.RotationYawPitchRollToRef(this.y, this.x, this.z, this._matrix);
            this._matrixId.copyFrom(this);
        }
        return this._matrix;
    };
    /**
     * Returns a clone of this Vector3Matrix.
     * @param cloneMatrix Wether to clone the matrix (true by default).
     */
    Vector3Matrix.prototype.clone = function (cloneMatrix) {
        if (cloneMatrix === void 0) { cloneMatrix = true; }
        var vec = new Vector3Matrix(this.x, this.y, this.z);
        vec._matrixId = this._matrixId;
        vec._matrix = cloneMatrix ? this._matrix.clone() : this._matrix;
        return;
    };
    return Vector3Matrix;
}(math_1.Vector3));
exports.Vector3Matrix = Vector3Matrix;
var TextureCanvasDrawContext = /** @class */ (function () {
    function TextureCanvasDrawContext(textureCanvas) {
        this.textureCanvas = textureCanvas;
        this._defaultTextureDrawOptions = TextureCanvasDrawContext.DEFAULT_TEXTURE_DRAW_OPTIONS;
        /** The area of the diffuse texture to draw. */
        this.diffuseSamplingRect = new Rectangle(0, 0, 1, 1);
        /** The area to draw to. */
        this.drawRect = new Rectangle(0, 0, 1, 1);
        /** The rotation axes in radians to rotate the diffuse textures by (z is 2D rotation). */
        this.rotation = new Vector3Matrix(0, 0, 0);
        /** The rotation pivot point. */
        this.pivotPoint = new PivotPoint(0.5, 0.5, true);
        /** The amount of skewing/shearing. */
        this.skewing = new UVector(0, 0);
        /** How much the opacity texture should be contributing to the difuse's alpha values, ranging from 0.0 to 1.0 */
        this.opacityTextureIntensity = 1;
        /** The area of the opacity texture to use. */
        this.opacitySamplingRect = new Rectangle(0, 0, 1, 1);
        /** The color to clear the canvas with. */
        this.clearColor = new math_1.Color4(0.0, 0.0, 0.0, 0.0);
    }
    /**
     * Resets the draw options to their default values.
     */
    TextureCanvasDrawContext.prototype.reset = function () {
        this._defaultTextureDrawOptions.clone(true, false, this);
    };
    /**
     * Sets which area of the diffuse texture to draw.
     *
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    TextureCanvasDrawContext.prototype.setDiffuseSamplingRect = function (u, v, width, height) {
        if (u === void 0) { u = this._defaultTextureDrawOptions.diffuseSamplingRect.u; }
        if (v === void 0) { v = this._defaultTextureDrawOptions.diffuseSamplingRect.v; }
        if (width === void 0) { width = this._defaultTextureDrawOptions.diffuseSamplingRect.width; }
        if (height === void 0) { height = this._defaultTextureDrawOptions.diffuseSamplingRect.height; }
        this.diffuseSamplingRect.u = u;
        this.diffuseSamplingRect.v = v;
        this.diffuseSamplingRect.width = width;
        this.diffuseSamplingRect.height = height;
    };
    /**
     * Sets which area of the opacity texture to draw.
     *
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    TextureCanvasDrawContext.prototype.setOpacitySamplingRect = function (u, v, width, height) {
        if (u === void 0) { u = this._defaultTextureDrawOptions.opacitySamplingRect.u; }
        if (v === void 0) { v = this._defaultTextureDrawOptions.opacitySamplingRect.v; }
        if (width === void 0) { width = this._defaultTextureDrawOptions.opacitySamplingRect.width; }
        if (height === void 0) { height = this._defaultTextureDrawOptions.opacitySamplingRect.height; }
        this.opacitySamplingRect.u = u;
        this.opacitySamplingRect.v = v;
        this.opacitySamplingRect.width = width;
        this.opacitySamplingRect.height = height;
    };
    /**
     * Sets which area of this texture to draw to — this area may be tranformed by rotating/skewing.
     *
     * @param u The u-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param v The v-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param width The width to draw the texture at, ranging from 0.0 to 1.0
     * @param height The height to draw the texture at, ranging from 0.0 to 1.0
     */
    TextureCanvasDrawContext.prototype.setDrawRect = function (u, v, width, height) {
        if (u === void 0) { u = this._defaultTextureDrawOptions.drawRect.u; }
        if (v === void 0) { v = this._defaultTextureDrawOptions.drawRect.v; }
        if (width === void 0) { width = this._defaultTextureDrawOptions.drawRect.width; }
        if (height === void 0) { height = this._defaultTextureDrawOptions.drawRect.height; }
        this.drawRect.u = u;
        this.drawRect.v = v;
        this.drawRect.width = width;
        this.drawRect.height = height;
    };
    /**
     * Sets the rotation axes in radians rotate the diffuse texture by.
     *
     * @param x 3D rotation in radians along the u-axis.
     * @param y 3D rotation in radians along the v-axis.
     * @param z 2D rotation in radians.
     */
    TextureCanvasDrawContext.prototype.setRotation = function (x, y, z) {
        if (x === void 0) { x = this._defaultTextureDrawOptions.rotation.x; }
        if (y === void 0) { y = this._defaultTextureDrawOptions.rotation.y; }
        if (z === void 0) { z = this._defaultTextureDrawOptions.rotation.z; }
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    };
    /**
     * Sets the point around which to rotate the texture.
     *
     * @param pu The u-coordinate of the rotation pivot point.
     * @param pv The v-coordinate of the rotation pivot point.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of this texture).
     */
    TextureCanvasDrawContext.prototype.setPivotPoint = function (pu, pv, isLocalSpace) {
        if (pu === void 0) { pu = this._defaultTextureDrawOptions.pivotPoint.u; }
        if (pv === void 0) { pv = this._defaultTextureDrawOptions.pivotPoint.v; }
        if (isLocalSpace === void 0) { isLocalSpace = this._defaultTextureDrawOptions.pivotPoint.isLocalSpace; }
        this.pivotPoint.u = pu;
        this.pivotPoint.v = pv;
        this.pivotPoint.isLocalSpace = isLocalSpace;
    };
    /**
     * Sets how the texture should be skewed (shear transform).
     *
     * @param u The horizontal skewing factor.
     * @param v The vertical skewing factor.
     */
    TextureCanvasDrawContext.prototype.setSkewing = function (u, v) {
        if (u === void 0) { u = this._defaultTextureDrawOptions.skewing.u; }
        if (v === void 0) { v = this._defaultTextureDrawOptions.skewing.v; }
        this.skewing.u = u;
        this.skewing.v = v;
    };
    /**
     * Draws the diffuse texture, if set.
     */
    TextureCanvasDrawContext.prototype.draw = function () {
        this.textureCanvas.draw(this);
    };
    /**
     * Draws a texture.
     *
     * @param diffuseTexture The texture to draw.
     */
    TextureCanvasDrawContext.prototype.drawTexture = function (diffuseTexture) {
        this.textureCanvas.drawTexture(diffuseTexture, this);
    };
    /**
     * Clears the canvas using the set clearColor.
     */
    TextureCanvasDrawContext.prototype.clear = function () {
        this.textureCanvas.clear(this);
    };
    /**
     * Returns a clone of this context.
     *
     * @param cloneDrawOptions Wether to clone the member objects.
     * @param cloneTextures Wether to clone the diffuse and opacity texture.
     * @param ref The context to clone into.
     */
    TextureCanvasDrawContext.prototype.clone = function (cloneDrawOptions, cloneTextures, ref) {
        if (cloneDrawOptions === void 0) { cloneDrawOptions = false; }
        if (cloneTextures === void 0) { cloneTextures = false; }
        if (!ref) {
            ref = new TextureCanvasDrawContext(this.textureCanvas);
        }
        if (cloneDrawOptions) {
            ref.drawRect = this.drawRect.clone();
            ref.diffuseSamplingRect = this.diffuseSamplingRect.clone();
            ref.pivotPoint = this.pivotPoint.clone();
            ref.skewing = this.skewing.clone();
            ref.opacitySamplingRect = this.opacitySamplingRect.clone();
            ref.clearColor = this.clearColor.clone();
        }
        else {
            ref.drawRect = this.drawRect;
            ref.diffuseSamplingRect = this.diffuseSamplingRect;
            ref.pivotPoint = this.pivotPoint;
            ref.skewing = this.skewing;
            ref.opacitySamplingRect = this.opacitySamplingRect;
            ref.clearColor = this.clearColor;
        }
        if (cloneTextures) {
            ref.diffuseTexture = this.diffuseTexture ? this.diffuseTexture.clone() : this.diffuseTexture;
            ref.opacityTexture = this.opacityTexture ? this.opacityTexture.clone() : this.opacityTexture;
        }
        else {
            ref.diffuseTexture = this.diffuseTexture;
            ref.opacityTexture = this.opacityTexture;
        }
        ref.rotation = this.rotation;
        return ref;
    };
    TextureCanvasDrawContext.DEFAULT_TEXTURE_DRAW_OPTIONS = new TextureCanvasDrawContext();
    return TextureCanvasDrawContext;
}());
exports.TextureCanvasDrawContext = TextureCanvasDrawContext;
var TextureCanvas = /** @class */ (function (_super) {
    __extends(TextureCanvas, _super);
    function TextureCanvas(size, scene, initTexture, onReady, options, name) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, null, scene, !options.generateMipMaps, false, options.samplingMode) || this;
        _this._vertexBuffers = {};
        _this._defaultDrawContext = new TextureCanvasDrawContext(_this);
        _this._engine = scene.getEngine();
        var shaders = { vertex: 'textureCanvas', fragment: 'textureCanvas' };
        _this._effect = _this._engine.createEffect(shaders, [buffer_1.VertexBuffer.PositionKind], ['rotationMatrix', 'pivotPoint', 'translation', 'scaling', 'skewing', 'diffuseSamplingRect', 'opacitySamplingRect', 'opacityTextureIntensity'], ['diffuseSampler', 'opacitySampler', 'backgroundSampler']);
        _this._size = size;
        _this._texture = _this._engine.createRenderTargetTexture(size, false);
        _this._backBuffer = new texture_1.Texture(null, scene, !options.generateMipMaps, false, options.samplingMode);
        _this._backBuffer._texture = _this._engine.createRenderTargetTexture(size, false);
        if (name) {
            _this.name = name;
            _this._backBuffer.name = name + 'BackBuffer';
        }
        // VBO
        var vertices = [];
        var v = 1.0;
        vertices.push(v, v);
        vertices.push(-v, v);
        vertices.push(-v, -v);
        vertices.push(v, -v);
        _this._vertexBuffers[buffer_1.VertexBuffer.PositionKind] = new buffer_1.VertexBuffer(_this._engine, vertices, buffer_1.VertexBuffer.PositionKind, false, false, 2);
        _this._createIndexBuffer();
        _this.wrapU = 0;
        _this.wrapV = 0;
        _this._generateMipMaps = options.generateMipMaps;
        _this.clear();
        _this._effect.executeWhenCompiled(function () {
            if (initTexture) {
                if (initTexture.isReady()) {
                    _this.drawTexture(initTexture);
                }
                else {
                    initTexture.onLoadObservable.addOnce(function () {
                        _this.drawTexture(initTexture);
                    });
                }
            }
            if (onReady) {
                onReady(_this);
            }
        });
        return _this;
    }
    /**
     * Is the texture ready to be used ? (rendered at least once)
     *
     * @returns true if ready, otherwise, false.
     */
    TextureCanvas.prototype.isReady = function () {
        if (!this._effect.isReady()) {
            return false;
        }
        return _super.prototype.isReady.call(this);
    };
    /**
     * Draws the diffuse texture, if set.
     *
     * @param ctx The texture draw options.
     */
    TextureCanvas.prototype.draw = function (ctx) {
        if (ctx === void 0) { ctx = this._defaultDrawContext; }
        if (ctx.diffuseTexture) {
            this.drawTexture(ctx.diffuseTexture, ctx);
        }
    };
    /**
     * Draws a texture.
     *
     * @param diffuseTexture The texture to draw.
     * @param ctx The texture draw context.
     */
    TextureCanvas.prototype.drawTexture = function (diffuseTexture, ctx) {
        if (ctx === void 0) { ctx = this._defaultDrawContext; }
        var isReady = this.isReady();
        if (isReady) {
            var engine = this._engine;
            var effect = this._effect;
            var gl = engine._gl;
            var pivotU = void 0;
            var pivotV = void 0;
            var translationX = ctx.drawRect.width - 1 + ctx.drawRect.u * 2;
            var translationY = ctx.drawRect.height - 1 + ctx.drawRect.v * 2;
            if (ctx.pivotPoint.isLocalSpace) {
                var _pu = (ctx.pivotPoint.u * 2 - 1) * ctx.drawRect.width;
                var _pv = (ctx.pivotPoint.v * 2 - 1) * ctx.drawRect.height;
                pivotU = _pu + _pv * ctx.skewing.u + translationX;
                pivotV = _pv + _pu * ctx.skewing.v + translationY;
            }
            else {
                pivotU = ctx.pivotPoint.u * 2 - 1;
                pivotV = ctx.pivotPoint.v * 2 - 1;
            }
            engine.enableEffect(this._effect);
            engine.setState(false);
            engine.bindFramebuffer(this._backBuffer._texture, 0, undefined, undefined, true);
            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, this._effect);
            effect.setTexture('diffuseSampler', diffuseTexture);
            effect.setTexture('backgroundSampler', this);
            effect.setMatrix('rotationMatrix', ctx.rotation.getMatrix());
            effect.setFloat2('pivotPoint', pivotU, pivotV);
            effect.setFloat2('translation', translationX, translationY);
            effect.setFloat2('scaling', ctx.drawRect.width, ctx.drawRect.height);
            effect.setFloat2('skewing', ctx.skewing.u, ctx.skewing.v);
            effect.setFloat4('diffuseSamplingRect', ctx.diffuseSamplingRect.u, ctx.diffuseSamplingRect.v, ctx.diffuseSamplingRect.width, ctx.diffuseSamplingRect.height);
            if (ctx.opacityTexture) {
                effect.setTexture('opacitySampler', ctx.opacityTexture);
                effect.setFloat4('opacitySamplingRect', ctx.opacitySamplingRect.u, ctx.opacitySamplingRect.v, ctx.opacitySamplingRect.width, ctx.opacitySamplingRect.height);
                effect.setFloat('opacityTextureIntensity', ctx.opacityTextureIntensity);
            }
            else {
                effect.setTexture('opacitySampler', diffuseTexture);
                effect.setFloat4('opacitySamplingRect', 0, 0, 1, 1);
                effect.setFloat('opacityTextureIntensity', 0);
            }
            // Render to backbuffer
            engine.drawElementsType(material_1.Material.TriangleFillMode, 0, 6);
            // Render to self
            engine._bindTextureDirectly(gl.TEXTURE_2D, this._texture, true);
            gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this._texture.width, this._texture.height, 0);
            engine.unBindFramebuffer(this._backBuffer._texture, !this._generateMipMaps);
        }
    };
    /**
     * Clears this texture using clearColor from the provided context.
     */
    TextureCanvas.prototype.clear = function (ctx) {
        if (ctx === void 0) { ctx = this._defaultDrawContext; }
        // Backbuffer
        this._engine.bindFramebuffer(this._backBuffer._texture);
        this._engine.clear(ctx.clearColor, true, false, false);
        this._engine.unBindFramebuffer(this._backBuffer._texture, !this._generateMipMaps);
        // Self
        this._engine.bindFramebuffer(this._texture);
        this._engine.clear(ctx.clearColor, true, false, false);
        this._engine.unBindFramebuffer(this._texture, !this._generateMipMaps);
    };
    /**
    * Resize the texture to new value.
    *
    * @param size Define the new size the texture should have
    * @param generateMipMaps Define whether the new texture should create mip maps
    */
    TextureCanvas.prototype.resize = function (size, generateMipMaps) {
        this.releaseInternalTexture();
        this._texture = this._engine.createRenderTargetTexture(size, generateMipMaps);
        this._backBuffer._texture = this._engine.createRenderTargetTexture(size, generateMipMaps);
        // Update properties
        this._size = size;
        this._generateMipMaps = generateMipMaps;
    };
    /**
     * Creates a new draw context. Does NOT invalidate other contexts created.
     */
    TextureCanvas.prototype.createContext = function () {
        return new TextureCanvasDrawContext(this);
    };
    TextureCanvas.prototype._createIndexBuffer = function () {
        var engine = this._engine;
        // Indices
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = engine.createIndexBuffer(indices);
    };
    /**
    * Clone the texture.
    * @returns the cloned texture
    */
    TextureCanvas.prototype.clone = function () {
        return new TextureCanvas(this._size, this.getScene(), this, undefined, { generateMipMaps: this._generateMipMaps, samplingMode: this.samplingMode });
    };
    /**
     * Dispose the texture and release its asoociated resources.
     */
    TextureCanvas.prototype.dispose = function () {
        var scene = this.getScene();
        if (!scene) {
            return;
        }
        var vertexBuffer = this._vertexBuffers[buffer_1.VertexBuffer.PositionKind];
        if (vertexBuffer) {
            vertexBuffer.dispose();
            this._vertexBuffers[buffer_1.VertexBuffer.PositionKind] = null;
        }
        if (this._indexBuffer && this._engine._releaseBuffer(this._indexBuffer)) {
            this._indexBuffer = null;
        }
        this._backBuffer.dispose();
        _super.prototype.dispose.call(this);
    };
    return TextureCanvas;
}(texture_1.Texture));
exports.TextureCanvas = TextureCanvas;
