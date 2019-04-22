import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color4, Matrix, Vector3 } from '@babylonjs/core/Maths/math';
import { Scene } from '@babylonjs/core/scene';
import { Nullable } from '@babylonjs/core/types';
export declare class UVector {
    u: number;
    v: number;
    constructor(u: number, v: number);
    /**
     * Returns a clone of this UVector.
     */
    clone(): UVector;
}
export declare class Rectangle {
    u: number;
    v: number;
    width: number;
    height: number;
    /**
     * A rectangle in uv-space.
     *
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param width The width.
     * @param height The height.
     */
    constructor(u: number, v: number, width: number, height: number);
    /**
     * Returns a clone of this rectangle.
     */
    clone(): Rectangle;
}
export declare class PivotPoint extends UVector {
    u: number;
    v: number;
    isLocalSpace: boolean;
    /**
     * A rotation origin.
     *
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of the canvas).
     */
    constructor(u: number, v: number, isLocalSpace: boolean);
    /**
     * Returns a clone of this pivot point.
     */
    clone(): PivotPoint;
}
export declare class Vector3Matrix extends Vector3 {
    protected _matrixId: Vector3;
    protected _matrix: Matrix;
    constructor(x?: number, y?: number, z?: number);
    /**
     * Overwrites the computed rotation matrix for the current xyz values.
     *
     * @param matrix The matrix to set.
     */
    setMatrix(matrix: Matrix): Matrix;
    /**
     * Gets the computed rotation matrix for the current xyz values.
     */
    getMatrix(): Matrix;
    /**
     * Returns a clone of this Vector3Matrix.
     * @param cloneMatrix Wether to clone the matrix (true by default).
     */
    clone(cloneMatrix?: boolean): Vector3Matrix;
}
export declare class TextureCanvasDrawContext {
    textureCanvas?: TextureCanvas;
    protected static readonly DEFAULT_TEXTURE_DRAW_OPTIONS: TextureCanvasDrawContext;
    protected _defaultTextureDrawOptions: TextureCanvasDrawContext;
    /** The texture to draw. */
    diffuseTexture: Texture;
    /** The area of the diffuse texture to draw. */
    diffuseSamplingRect: Rectangle;
    /** The area to draw to. */
    drawRect: Rectangle;
    /** The rotation axes in radians to rotate the diffuse textures by (z is 2D rotation). */
    rotation: Vector3Matrix;
    /** The rotation pivot point. */
    pivotPoint: PivotPoint;
    /** The amount of skewing/shearing. */
    skewing: UVector;
    /** The texture to get the alpha values from. */
    opacityTexture: Texture;
    /** How much the opacity texture should be contributing to the difuse's alpha values, ranging from 0.0 to 1.0 */
    opacityTextureIntensity: number;
    /** The area of the opacity texture to use. */
    opacitySamplingRect: Rectangle;
    /** The color to clear the canvas with. */
    clearColor: Color4;
    constructor(textureCanvas?: TextureCanvas);
    /**
     * Resets the draw options to their default values.
     */
    reset(): void;
    /**
     * Sets which area of the diffuse texture to draw.
     *
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    setDiffuseSamplingRect(u?: number, v?: number, width?: number, height?: number): void;
    /**
     * Sets which area of the opacity texture to draw.
     *
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    setOpacitySamplingRect(u?: number, v?: number, width?: number, height?: number): void;
    /**
     * Sets which area of this texture to draw to — this area may be tranformed by rotating/skewing.
     *
     * @param u The u-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param v The v-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param width The width to draw the texture at, ranging from 0.0 to 1.0
     * @param height The height to draw the texture at, ranging from 0.0 to 1.0
     */
    setDrawRect(u?: number, v?: number, width?: number, height?: number): void;
    /**
     * Sets the rotation axes in radians rotate the diffuse texture by.
     *
     * @param x 3D rotation in radians along the u-axis.
     * @param y 3D rotation in radians along the v-axis.
     * @param z 2D rotation in radians.
     */
    setRotation(x?: number, y?: number, z?: number): void;
    /**
     * Sets the point around which to rotate the texture.
     *
     * @param pu The u-coordinate of the rotation pivot point.
     * @param pv The v-coordinate of the rotation pivot point.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of this texture).
     */
    setPivotPoint(pu?: number, pv?: number, isLocalSpace?: boolean): void;
    /**
     * Sets how the texture should be skewed (shear transform).
     *
     * @param u The horizontal skewing factor.
     * @param v The vertical skewing factor.
     */
    setSkewing(u?: number, v?: number): void;
    /**
     * Draws the diffuse texture, if set.
     */
    draw(): void;
    /**
     * Draws a texture.
     *
     * @param diffuseTexture The texture to draw.
     */
    drawTexture(diffuseTexture: Texture): void;
    /**
     * Clears the canvas using the set clearColor.
     */
    clear(): void;
    /**
     * Returns a clone of this context.
     *
     * @param cloneDrawOptions Wether to clone the member objects.
     * @param cloneTextures Wether to clone the diffuse and opacity texture.
     * @param ref The context to clone into.
     */
    clone(cloneDrawOptions?: boolean, cloneTextures?: boolean, ref?: TextureCanvasDrawContext): TextureCanvasDrawContext;
}
export declare class TextureCanvas extends Texture {
    private _size;
    private _vertexBuffers;
    private _indexBuffer;
    private _effect;
    private _generateMipMaps;
    private _backBuffer;
    private _engine;
    private _defaultDrawContext;
    constructor(size: number | {
        width: number;
        height: number;
    }, scene: Nullable<Scene>, initTexture?: Texture, onReady?: Function, options?: {
        generateMipMaps?: boolean;
        samplingMode?: number;
    });
    /**
     * Is the texture ready to be used ? (rendered at least once)
     *
     * @returns true if ready, otherwise, false.
     */
    isReady(): boolean;
    /**
     * Draws the diffuse texture, if set.
     *
     * @param ctx The texture draw options.
     */
    draw(ctx?: TextureCanvasDrawContext): void;
    /**
     * Draws a texture.
     *
     * @param diffuseTexture The texture to draw.
     * @param ctx The texture draw context.
     */
    drawTexture(diffuseTexture: Texture, ctx?: TextureCanvasDrawContext): void;
    /**
     * Clears this texture using clearColor from the provided context.
     */
    clear(ctx?: TextureCanvasDrawContext): void;
    /**
    * Resize the texture to new value.
    *
    * @param size Define the new size the texture should have
    * @param generateMipMaps Define whether the new texture should create mip maps
    */
    resize(size: number | {
        width: number;
        height: number;
    }, generateMipMaps: boolean): void;
    /**
     * Creates a new draw context. Does NOT invalidate other contexts created.
     */
    createContext(): TextureCanvasDrawContext;
    private _createIndexBuffer;
    /**
    * Clone the texture.
    * @returns the cloned texture
    */
    clone(): TextureCanvas;
    /**
     * Dispose the texture and release its asoociated resources.
     */
    dispose(): void;
}
