# TextureCanvas summary documentation

## Index
[TextureCanvas constructor](#texturecanvas-constructor)

[TextureCanvas methods](#texturecanvas-methods)

[TextureCanvasDrawContext properties](#texturecanvasdrawcontext-properties)

[TextureCanvasDrawContext methods](#texturecanvasdrawcontext-methods)

[UVector class](#uvector-class)

[Rectangle class](#rectangle-class)

[PivotPoint class](#pivotpoint-class)

[Vector3Matrix class](#vector3matrix-class)

## TextureCanvas constructor
```typescript
size: number | { width: number, height: number }
scene: Nullable<Scene>
onReady?: Function
options: { generateMipMaps?: boolean, samplingMode?: number }
```
The samplingMode can be one of the following:

* Texture.NEAREST_SAMPLINGMODE
* Texture.BILINEAR_SAMPLINGMODE (default)
* Texture.TRILINEAR_SAMPLINGMODE

## TextureCanvas methods
```typescript
    /**
     * Is the texture ready to be used ? (rendered at least once)
     *
     * @returns true if ready, otherwise, false.
     */
    isReady(): boolean;
```
```typescript
    /**
     * Draws the diffuse texture, if set.
     *
     * @param ctx The texture draw options.
     */
    draw(ctx?: TextureCanvasDrawContext): void;
```
```typescript
    /**
     * Draws a texture.
     *
     * @param diffuseTexture The texture to draw.
     * @param ctx The texture draw context.
     */
    drawTexture(diffuseTexture: Texture, ctx?: TextureCanvasDrawContext): void;
```
```typescript
    /**
     * Clears this texture using clearColor from the provided context.
     */
    clear(ctx?: TextureCanvasDrawContext): void;
```
```typescript
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
```
```typescript
    /**
     * Creates a new draw context. Does NOT invalidate other contexts created.
     */
    createContext(): TextureCanvasDrawContext;
```
```typescript
    /**
    * Clone the texture.
    * @returns the cloned texture
    */
    clone(): TextureCanvas;
```
```typescript
    /**
     * Dispose the texture and release its asoociated resources.
     */
    dispose(): void;
```
## TextureCanvasDrawContext properties
```typescript
    /** The texture to draw. */
    diffuseTexture: Texture;
```
```typescript
    /** The area of the diffuse texture to draw. */
    diffuseSamplingRect: Rectangle;
```
```typescript
    /** The area to draw to. */
    drawRect: Rectangle;
```
```typescript
    /** The rotation in radians to rotate the diffuse textures by. */
    rotation: Vector3Matrix;
```
```typescript
    /** The rotation pivot point. */
    pivotPoint: PivotPoint;
```
```typescript
    /** The amount of skewing/shearing. */
    skewing: UVector;
```
```typescript
    /** The texture to get the alpha values from. */
    opacityTexture: Texture;
```
```typescript
    /** How much the opacity texture should be contributing to the difuse's alpha values, ranging from 0.0 to 1.0 */
    opacityTextureIntensity: number;
```
```typescript
    /** The u-coordinate of the opacity texture from which to draw it. */
    opacitySamplingRect: Rectangle;
```
```typescript
    /** The color to clear the canvas with. */
    clearColor: Color4;
```
## TextureCanvasDrawContext methods
```typescript
    /**
     * Resets the draw options to their default values.
     */
    reset(): void;
```
```typescript
    /**
     * Sets which area of the diffuse texture to draw.
     *
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    setDiffuseSamplingRect(u?: number, v?: number, width?: number, height?: number): void;
```
```typescript
    /**
     * Sets which area of the opacity texture to draw.
     *
     * @param u The u-coordinate from which to draw.
     * @param v The v-coordinate from which to draw.
     * @param width The width of the area to be drawn, ranging from 0.0 to 1.0
     * @param height The height of the area to be drawn, ranging from 0.0 to 1.0
     */
    setOpacitySamplingRect(u?: number, v?: number, width?: number, height?: number): void;
```
```typescript
    /**
     * Sets which area of this texture to draw to — this area may be tranformed by rotating/skewing.
     *
     * @param u The u-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param v The v-coordinate of this texture at which to draw the diffuse texture, with the origin being the bottom-left corner.
     * @param width The width to draw the texture at, ranging from 0.0 to 1.0
     * @param height The height to draw the texture at, ranging from 0.0 to 1.0
     */
    setDrawRect(u?: number, v?: number, width?: number, height?: number): void;
```
```typescript
    /**
     * Sets the rotation in radians to rotate the diffuse texture by.
     *
     * @param rotation The rotation in radians to rotate the diffuse textures by.
     */
    setRotation(rotation?: Vector3Matrix): void;
```
```typescript
    /**
     * Sets the point around which to rotate the texture.
     *
     * @param pu The u-coordinate of the rotation pivot point.
     * @param pv The v-coordinate of the rotation pivot point.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of this texture).
     */
    setPivotPoint(pu?: number, pv?: number, isLocalSpace?: any): void;
```
```typescript
    /**
     * Sets how the texture should be skewed (shear transform).
     *
     * @param u The horizontal skewing factor.
     * @param v The vertical skewing factor.
     */
    setSkewing(u?: number, v?: number): void;
```
```typescript
    /**
     * Draws the diffuse texture, if set.
     */
    draw(): void;
```
```typescript
    /**
     * Draws a texture.
     *
     * @param diffuseTexture The texture to draw.
     */
    drawTexture(diffuseTexture: Texture): void;
```
```typescript
    /**
     * Clears the canvas using the set clearColor.
     */
    clear(): void;
```
```typescript
    /**
     * Returns a clone of this context.
     *
     * @param cloneDrawOptions Wether to clone the member objects.
     * @param cloneTextures Wether to clone the diffuse and opacity texture.
     * @param ref The context to clone into.
     */
    clone(cloneDrawOptions?: boolean, cloneTextures?: boolean, ref?: TextureCanvasDrawContext): TextureCanvasDrawContext;
```
## UVector class
```typescript
class UVector {
    u: number;
    v: number;
    constructor(u: number, v: number);
    /**
     * Returns a clone of this UVector.
     */
    clone(): UVector;
}
```
## Rectangle class
```typescript
class Rectangle {
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
```
## PivotPoint class
```typescript
class PivotPoint extends UVector {
    u: number;
    v: number;
    isLocalSpace: any;
    /**
     * A rotation origin.
     *
     * @param u The u-coordinate.
     * @param v The v-coordinate.
     * @param isLocalSpace Whether the pivot coordinates are in local space (of the diffuse textures) or in world space (of the canvas).
     */
    constructor(u: number, v: number, isLocalSpace: any);
    /**
     * Returns a clone of this pivot point.
     */
    clone(): PivotPoint;
}
```
## Vector3Matrix class
This class is used as a rotation, with the matrix being computed using
```typescript
Matrix.RotationYawPitchRollToRef(y, x, z, _matrix);
```
```typescript
class Vector3Matrix extends Vector3 {
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
```
