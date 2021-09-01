import { Engine } from '@babylonjs/core/Engines/engine';
import { Effect } from '@babylonjs/core/Materials/effect';
import { Material } from '@babylonjs/core/Materials/material';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color4, Matrix, Vector3 } from '@babylonjs/core/Maths/math';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { Scene } from '@babylonjs/core/scene';
import { Nullable } from '@babylonjs/core/types';

Effect.ShadersStore["textureCanvasVertexShader"] = `
// Attributes
attribute vec2 position;

// Output
varying vec2 vPosition;
varying vec2 vLocalUV;
varying vec2 vWorldUV;

// Uniforms
uniform mat4 rotationMatrix;
uniform vec2 pivotPoint;
uniform vec2 translation;
uniform vec2 scaling;
uniform vec2 skewing;

const vec2 madd = vec2(0.5, 0.5);

void main(void) {
    vec2 skewed = vec2(position.x + skewing.x * position.y, position.y + skewing.y * position.x);
    vec2 transformed = (vec4(skewed * scaling + translation - pivotPoint, 0.0, 0.0) * rotationMatrix).xy + pivotPoint;

    gl_Position = vec4(transformed, 0.0, 1.0);
    
    vPosition = position;
	vLocalUV = position * madd + madd;
    vWorldUV = gl_Position.xy * madd + madd;
}
`;

Effect.ShadersStore["textureCanvasFragmentShader"] = `
precision highp float;

varying vec2 vLocalUV;
varying vec2 vWorldUV;

uniform sampler2D diffuseSampler;
uniform sampler2D opacitySampler;
uniform sampler2D backgroundSampler;

uniform vec4 diffuseSamplingRect;
uniform vec4 opacitySamplingRect;
uniform float opacityTextureIntensity;

void main(void) {
    vec4 backgroundPixel = texture2D(backgroundSampler, vWorldUV);
    vec4 diffusePixel = texture2D(diffuseSampler, vLocalUV * diffuseSamplingRect.zw + diffuseSamplingRect.xy);
    vec4 opacityPixel = texture2D(opacitySampler, vLocalUV * opacitySamplingRect.zw + opacitySamplingRect.xy);
    gl_FragColor = mix(backgroundPixel, diffusePixel, opacityPixel.a * opacityTextureIntensity + (1.0 - opacityTextureIntensity) * diffusePixel.a);
}
`;

export class UVector {
    constructor(public u: number, public v: number) {

    }

    /**
     * Returns a clone of this UVector.
     */
    clone(): UVector {
        return new UVector(this.u, this.v);
    }
}

export class Rectangle {
    /**
     * A rectangle in uv-space.
     * 
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param width The width.
     * @param height The height.
     */
    constructor(public u: number, public v: number, public width: number, public height: number) {

    }

    /**
     * Returns a clone of this rectangle.
     */
    clone(): Rectangle {
        return new Rectangle(this.u, this.v, this.width, this.height);
    }
}

export class PivotPoint extends UVector {
    /**
     * A rotation origin.
     * 
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of the canvas).
     */
    constructor(public u: number, public v: number, public isLocalSpace: boolean) {
        super(u, v);
    }

    /**
     * Returns a clone of this pivot point.
     */
    clone(): PivotPoint {
        return new PivotPoint(this.u, this.v, this.isLocalSpace);
    }
}

export class Vector3Matrix extends Vector3 {
    protected _matrixId: Vector3 = Vector3.Zero();
    protected _matrix: Matrix = Matrix.Identity();

    constructor(x?: number, y?: number, z?: number) {
        super(x, y, z);
        this.getMatrix();
    }

    /**
     * Overwrites the computed rotation matrix for the current xyz values.
     * 
     * @param matrix The matrix to set.
     */
    setMatrix(matrix: Matrix) {
        this._matrix = matrix;
        this._matrixId.copyFrom(this);
        return matrix;
    }

    /**
     * Gets the computed rotation matrix for the current xyz values.
     */
    getMatrix() {
        if (!this.equals(this._matrixId)) {
            Matrix.RotationYawPitchRollToRef(this.y, this.x, this.z, this._matrix);
            this._matrixId.copyFrom(this);
        }
        return this._matrix;
    }

    /**
     * Returns a clone of this Vector3Matrix.
     * @param cloneMatrix Wether to clone the matrix (true by default).
     */
    clone(cloneMatrix = true): Vector3Matrix {
        let vec = new Vector3Matrix(this.x, this.y, this.z);
        vec._matrixId = this._matrixId;
        vec._matrix = cloneMatrix ? this._matrix.clone() : this._matrix;
        return
    }
}

export class TextureCanvasDrawContext {
    protected static readonly DEFAULT_TEXTURE_DRAW_OPTIONS: TextureCanvasDrawContext = new TextureCanvasDrawContext();

    protected _defaultTextureDrawOptions = TextureCanvasDrawContext.DEFAULT_TEXTURE_DRAW_OPTIONS;

    /** The texture to draw. */
    public diffuseTexture: Texture;

    /** The area of the diffuse texture to draw. */
    public diffuseSamplingRect: Rectangle = new Rectangle(0, 0, 1, 1);

    /** The area to draw to. */
    public drawRect: Rectangle = new Rectangle(0, 0, 1, 1);

    /** The rotation axes in radians to rotate the diffuse textures by (z is 2D rotation). */
    public rotation: Vector3Matrix = new Vector3Matrix(0, 0, 0);

    /** The rotation pivot point. */
    public pivotPoint: PivotPoint = new PivotPoint(0.5, 0.5, true);

    /** The amount of skewing/shearing. */
    public skewing: UVector = new UVector(0, 0);

    /** The texture to get the alpha values from. */
    public opacityTexture: Texture;

    /** How much the opacity texture should be contributing to the difuse's alpha values, ranging from 0.0 to 1.0 */
    public opacityTextureIntensity: number = 1;

    /** The area of the opacity texture to use. */
    public opacitySamplingRect: Rectangle = new Rectangle(0, 0, 1, 1);

    /** The color to clear the canvas with. */
    public clearColor: Color4 = new Color4(0.0, 0.0, 0.0, 0.0);

    constructor(public textureCanvas?: TextureCanvas) {
    }

    /**
     * Resets the draw options to their default values.
     */
    reset(): void {
        this._defaultTextureDrawOptions.clone(true, false, this);
    }

    /**
     * Sets which area of the diffuse texture to draw.
     * 
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    setDiffuseSamplingRect(u = this._defaultTextureDrawOptions.diffuseSamplingRect.u, v = this._defaultTextureDrawOptions.diffuseSamplingRect.v, width = this._defaultTextureDrawOptions.diffuseSamplingRect.width, height = this._defaultTextureDrawOptions.diffuseSamplingRect.height): void {
        this.diffuseSamplingRect.u = u;
        this.diffuseSamplingRect.v = v;
        this.diffuseSamplingRect.width = width;
        this.diffuseSamplingRect.height = height;
    }

    /**
     * Sets which area of the opacity texture to draw.
     * 
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    setOpacitySamplingRect(u = this._defaultTextureDrawOptions.opacitySamplingRect.u, v = this._defaultTextureDrawOptions.opacitySamplingRect.v, width = this._defaultTextureDrawOptions.opacitySamplingRect.width, height = this._defaultTextureDrawOptions.opacitySamplingRect.height): void {
        this.opacitySamplingRect.u = u;
        this.opacitySamplingRect.v = v;
        this.opacitySamplingRect.width = width;
        this.opacitySamplingRect.height = height;
    }

    /**
     * Sets which area of this texture to draw to — this area may be tranformed by rotating/skewing.
     * 
     * @param u The u-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param v The v-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param width The width to draw the texture at, ranging from 0.0 to 1.0
     * @param height The height to draw the texture at, ranging from 0.0 to 1.0
     */
    setDrawRect(u = this._defaultTextureDrawOptions.drawRect.u, v = this._defaultTextureDrawOptions.drawRect.v, width = this._defaultTextureDrawOptions.drawRect.width, height = this._defaultTextureDrawOptions.drawRect.height): void {
        this.drawRect.u = u;
        this.drawRect.v = v;
        this.drawRect.width = width;
        this.drawRect.height = height;
    }

    /**
     * Sets the rotation axes in radians rotate the diffuse texture by.
     * 
     * @param x 3D rotation in radians along the u-axis.
     * @param y 3D rotation in radians along the v-axis.
     * @param z 2D rotation in radians.
     */
    setRotation(x = this._defaultTextureDrawOptions.rotation.x, y = this._defaultTextureDrawOptions.rotation.y, z = this._defaultTextureDrawOptions.rotation.z,): void {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }

    /**
     * Sets the point around which to rotate the texture.
     * 
     * @param pu The u-coordinate of the rotation pivot point.
     * @param pv The v-coordinate of the rotation pivot point.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of this texture).
     */
    setPivotPoint(pu = this._defaultTextureDrawOptions.pivotPoint.u, pv = this._defaultTextureDrawOptions.pivotPoint.v, isLocalSpace = this._defaultTextureDrawOptions.pivotPoint.isLocalSpace): void {
        this.pivotPoint.u = pu;
        this.pivotPoint.v = pv;
        this.pivotPoint.isLocalSpace = isLocalSpace;
    }

    /**
     * Sets how the texture should be skewed (shear transform).
     * 
     * @param u The horizontal skewing factor.
     * @param v The vertical skewing factor.
     */
    setSkewing(u = this._defaultTextureDrawOptions.skewing.u, v = this._defaultTextureDrawOptions.skewing.v): void {
        this.skewing.u = u;
        this.skewing.v = v;
    }

    /**
     * Draws the diffuse texture, if set.
     */
    draw(): void {
        this.textureCanvas.draw(this);
    }

    /**
     * Draws a texture.
     * 
     * @param diffuseTexture The texture to draw.
     */
    drawTexture(diffuseTexture: Texture) {
        this.textureCanvas.drawTexture(diffuseTexture, this);
    }

    /**
     * Clears the canvas using the set clearColor.
     */
    clear(): void {
        this.textureCanvas.clear(this);
    }

    /**
     * Returns a clone of this context.
     * 
     * @param cloneDrawOptions Wether to clone the member objects.
     * @param cloneTextures Wether to clone the diffuse and opacity texture.
     * @param ref The context to clone into.
     */
    clone(cloneDrawOptions = false, cloneTextures = false, ref?: TextureCanvasDrawContext): TextureCanvasDrawContext {
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
        } else {
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
        } else {
            ref.diffuseTexture = this.diffuseTexture;
            ref.opacityTexture = this.opacityTexture;
        }
        ref.rotation = this.rotation;

        return ref;
    }
}

export class TextureCanvas extends Texture {
    private _size: number | { width: number, height: number };
    private _vertexBuffers: { [key: string]: Nullable<VertexBuffer> } = {};
    private _indexBuffer: Nullable<WebGLBuffer>;
    private _effect: Effect;
    private _generateMipMaps: boolean;
    private _backBuffer: Texture;
    private _engine: Engine;

    private _defaultDrawContext = new TextureCanvasDrawContext(this);

    constructor(size: number | { width: number, height: number }, scene: Nullable<Scene>, initTexture?: Texture, onReady?: Function, options: { generateMipMaps?: boolean, samplingMode?: number } = {}, name?: string) {
        super(null, scene, !options.generateMipMaps, false, options.samplingMode);
        this._engine = scene.getEngine();
        let shaders = { vertex: 'textureCanvas', fragment: 'textureCanvas' };
        this._effect = this._engine.createEffect(shaders, [VertexBuffer.PositionKind], ['rotationMatrix', 'pivotPoint', 'translation', 'scaling', 'skewing', 'diffuseSamplingRect', 'opacitySamplingRect', 'opacityTextureIntensity'], ['diffuseSampler', 'opacitySampler', 'backgroundSampler']);
        this._size = size;
        this._texture = this._engine.createRenderTargetTexture(size, false);
        this._backBuffer = new Texture(null, scene, !options.generateMipMaps, false, options.samplingMode);
        this._backBuffer._texture = this._engine.createRenderTargetTexture(size, false);
        if (name) {
            this.name = name;
            this._backBuffer.name = name + 'BackBuffer';
        }

        // VBO
        let vertices = [];
        let v = 1.0;
        vertices.push(v, v);
        vertices.push(-v, v);
        vertices.push(-v, -v);
        vertices.push(v, -v);

        this._vertexBuffers[VertexBuffer.PositionKind] = new VertexBuffer(this._engine, vertices, VertexBuffer.PositionKind, false, false, 2);

        this._createIndexBuffer();

        this.wrapU = 0;
        this.wrapV = 0;

        this._generateMipMaps = options.generateMipMaps;

        this.clear();

        this._effect.executeWhenCompiled(() => {
            if (initTexture) {
                if (initTexture.isReady()) {
                    this.drawTexture(initTexture);
                } else {
                    initTexture.onLoadObservable.addOnce(() => {
                        this.drawTexture(initTexture);
                    });
                }
            }
            if (onReady) {
                onReady(this);
            }
        });
    }

    /**
     * Is the texture ready to be used ? (rendered at least once)
     * 
     * @returns true if ready, otherwise, false.
     */
    isReady(): boolean {
        if (!this._effect.isReady()) {
            return false;
        }
        return super.isReady();
    }

    /**
     * Draws the diffuse texture, if set.
     * 
     * @param ctx The texture draw options.
     */
    draw(ctx: TextureCanvasDrawContext = this._defaultDrawContext) {
        if (ctx.diffuseTexture) {
            this.drawTexture(ctx.diffuseTexture, ctx);
        }
    }

    /**
     * Draws a texture.
     * 
     * @param diffuseTexture The texture to draw.
     * @param ctx The texture draw context.
     */
    drawTexture(diffuseTexture: Texture, ctx: TextureCanvasDrawContext = this._defaultDrawContext): void {
        let isReady = this.isReady();
        if (isReady) {
            let engine = this._engine;
            let effect = this._effect;
            let gl = engine._gl;

            let pivotU: number;
            let pivotV: number;

            let translationX = ctx.drawRect.width - 1 + ctx.drawRect.u * 2;
            let translationY = ctx.drawRect.height - 1 + ctx.drawRect.v * 2;

            if (ctx.pivotPoint.isLocalSpace) {
                let _pu = (ctx.pivotPoint.u * 2 - 1) * ctx.drawRect.width;
                let _pv = (ctx.pivotPoint.v * 2 - 1) * ctx.drawRect.height;
                pivotU = _pu + _pv * ctx.skewing.u + translationX;
                pivotV = _pv + _pu * ctx.skewing.v + translationY;
            } else {
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
            } else {
                effect.setTexture('opacitySampler', diffuseTexture);
                effect.setFloat4('opacitySamplingRect', 0, 0, 1, 1);
                effect.setFloat('opacityTextureIntensity', 0);
            }

            // Render to backbuffer
            engine.drawElementsType(Material.TriangleFillMode, 0, 6);

            // Render to self
            engine._bindTextureDirectly(gl.TEXTURE_2D, this._texture, true);
            gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this._texture.width, this._texture.height, 0);

            engine.unBindFramebuffer(this._backBuffer._texture, !this._generateMipMaps);
        }
    }

    /**
     * Clears this texture using clearColor from the provided context.
     */
    clear(ctx: TextureCanvasDrawContext = this._defaultDrawContext): void {
        // Backbuffer
        this._engine.bindFramebuffer(this._backBuffer._texture);
        this._engine.clear(ctx.clearColor, true, false, false);
        this._engine.unBindFramebuffer(this._backBuffer._texture, !this._generateMipMaps);

        // Self
        this._engine.bindFramebuffer(this._texture);
        this._engine.clear(ctx.clearColor, true, false, false);
        this._engine.unBindFramebuffer(this._texture, !this._generateMipMaps);
    }

    /**
    * Resize the texture to new value.
    * 
    * @param size Define the new size the texture should have
    * @param generateMipMaps Define whether the new texture should create mip maps
    */
    public resize(size: number | { width: number, height: number }, generateMipMaps: boolean): void {
        this.releaseInternalTexture();
        this._texture = this._engine.createRenderTargetTexture(size, generateMipMaps);
        this._backBuffer._texture = this._engine.createRenderTargetTexture(size, generateMipMaps);

        // Update properties
        this._size = size;
        this._generateMipMaps = generateMipMaps;
    }

    /**
     * Creates a new draw context. Does NOT invalidate other contexts created.
     */
    public createContext() {
        return new TextureCanvasDrawContext(this);
    }

    private _createIndexBuffer(): void {
        let engine = this._engine;

        // Indices
        let indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);

        indices.push(0);
        indices.push(2);
        indices.push(3);

        this._indexBuffer = engine.createIndexBuffer(indices);
    }

    /**
    * Clone the texture.
    * @returns the cloned texture
    */
    public clone(): TextureCanvas {
        return new TextureCanvas(this._size, this.getScene(), this, undefined, { generateMipMaps: this._generateMipMaps, samplingMode: this.samplingMode });
    }

    /**
     * Dispose the texture and release its asoociated resources.
     */
    public dispose(): void {
        let scene = this.getScene();

        if (!scene) {
            return;
        }

        var vertexBuffer = this._vertexBuffers[VertexBuffer.PositionKind];
        if (vertexBuffer) {
            vertexBuffer.dispose();
            this._vertexBuffers[VertexBuffer.PositionKind] = null;
        }

        if (this._indexBuffer && this._engine._releaseBuffer(this._indexBuffer)) {
            this._indexBuffer = null;
        }

        this._backBuffer.dispose();
        super.dispose();
    }
}