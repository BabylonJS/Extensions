import { Scene } from '@babylonjs/core/scene';
import { Matrix, Vector3 } from '@babylonjs/core/Maths/math';
import { Viewport } from '@babylonjs/core/Maths/math.viewport';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';

import { HtmlMesh } from './html-mesh';
import { Camera } from '@babylonjs/core/Cameras/camera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { SubMesh } from '@babylonjs/core/Meshes/subMesh';
import { RenderingManager } from '@babylonjs/core/Rendering/renderingManager';
import { RenderingGroup } from '@babylonjs/core/Rendering/renderingGroup';

const fullZoomMinCameraRadius = 1;

// Returns a function that ensures that HtmlMeshes are rendered before all other meshes.
// Note this will only be applied to group 0.  
// If neither mesh is an HtmlMesh, then the default render order is used
// This prevents HtmlMeshes from appearing in front of other meshes when they are behind them
type RenderOrderFunction = (subMeshA: SubMesh, subMeshB: SubMesh) => number;
const renderOrderFunc = (defaultRenderOrder): RenderOrderFunction => {
    return (subMeshA: SubMesh, subMeshB: SubMesh) => {
        const meshA = subMeshA.getMesh();
        const meshB = subMeshB.getMesh();

        // Use property check instead of instanceof since it is less expensive and
        // this will be called many times per frame
        const meshAIsHtmlMesh = meshA['isHtmlMesh'];
        const meshBIsHtmlMesh = meshB['isHtmlMesh'];
        if (meshAIsHtmlMesh) {
            return meshBIsHtmlMesh ?
                meshA.absolutePosition.z <= meshB.absolutePosition.z ? 1 : -1 :
                -1;
        }
        else {
            return meshBIsHtmlMesh ?
            1 :
            defaultRenderOrder(subMeshA, subMeshB);
        }
    }
};

/**
 * An instance of this is required to render HtmlMeshes in the scene.
 * if using HtmlMeshes, you must not set render order for group 0 using 
 * scene.setRenderingOrder.  You must instead pass the compare functions
 * to the HtmlMeshRenderer constructor.  If you do not, then your render
 * order will be overwritten if the HtmlMeshRenderer is created after and 
 * the HtmlMeshes will not render correctly (they will appear in front of
 * meshes that are actually in front of them) if the HtmlMeshRenderer is
 * created before.
 */
export class HtmlMeshRenderer {
    _maskRootNode?: TransformNode;
    _container?: HTMLElement;
    _containerId = 'css-container';
    _domElement?: HTMLElement;
    _cameraElement?: HTMLElement;
    _cache = {
        cameraData: { fov: 0, position: new Vector3(), style: '' },
        htmlMeshData: new WeakMap<object, { baseScaleFactor: number, style: string }>()
    };
    _width = 0;
    _height = 0;
    _widthHalf = 0;
    _heightHalf = 0;

    _cameraViewMatrix?: Matrix;
    _projectionMatrix?: Matrix;
    _cameraWorldMatrix?: Matrix;
    _viewport?: Viewport;

    // Create some refs to avoid creating new objects every frame
    _temp = {
        v0: new Vector3(),
        v1: new Vector3(),
        worldMin: new Vector3(),
        worldMax: new Vector3(),
        objectMatrix: Matrix.Identity(),
        viewportMatrix: Matrix.Identity(),
        maxZoomScreenSpaceTransform: Matrix.Identity(),
        maxZoomClipSpaceTransform: Matrix.Identity(),
        screenSpaceTransform: Matrix.Identity(),
        cameraViewMatrix: Matrix.Identity(),
        cameraWorldMatrix: Matrix.Identity(),
        cameraRotationMatrix: Matrix.Identity(),
        cameraWorldMatrixAsArray: new Array(16),
        vp: new Viewport(0, 0, 0, 0),
    };

    // Keep track of DPR so we can resize if DPR changes
    // Otherwise the DOM content will scale, but the mesh won't
    _lastDevicePixelRatio = window.devicePixelRatio;

    // Keep track of camera matrix changes so we only update the
    // DOM element styles when necessary
    _cameraMatrixUpdated = true;

    constructor(scene: Scene, {
        parentContainerId = null,
        defaultOpaqueRenderOrder = RenderingGroup.PainterSortCompare,
        defaultAlphaTestRenderOrder = RenderingGroup.PainterSortCompare,
        defaultTransparentRenderOrder = RenderingGroup.defaultTransparentSortCompare,
    }: {
        parentContainerId?: string | null,
        defaultOpaqueRenderOrder?: RenderOrderFunction,
        defaultAlphaTestRenderOrder?: RenderOrderFunction,
        defaultTransparentRenderOrder?: RenderOrderFunction,
    } = {}) {
        this.init(scene, parentContainerId, defaultOpaqueRenderOrder, defaultAlphaTestRenderOrder, defaultTransparentRenderOrder);
    }

    protected init(scene: Scene, parentContainerId: string | null, 
                   defaultOpaqueRenderOrder?: RenderOrderFunction, 
                   defaultAlphaTestRenderOrder?: RenderOrderFunction, 
                   defaultTransparentRenderOrder?: RenderOrderFunction): void {
        // Create the DOM containers
        this._container = document.createElement('div');
        this._container.id = this._containerId;
        this._container.style.position = 'absolute';
        this._container.style.width = '100%';
        this._container.style.height = '100%';
        this._container.style.zIndex = '-1';

        let parentContainer = parentContainerId ?
            document.getElementById(parentContainerId) :
            document.body;

        if (!parentContainer) {
            parentContainer = document.body;
        }

        parentContainer.insertBefore(this._container, parentContainer.firstChild);

        this._domElement = document.createElement( 'div' );
        this._domElement.style.overflow = 'hidden';

        this._cameraElement = document.createElement( 'div' );

        this._cameraElement.style.webkitTransformStyle = 'preserve-3d';
        this._cameraElement.style.transformStyle = 'preserve-3d';
        
        this._cameraElement.style.pointerEvents = 'none';

        this._domElement.appendChild(this._cameraElement);
        this._container.appendChild(this._domElement);

        // Set the size and resize behavior
        this.setSize(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight());
        window.addEventListener('resize', e => {
            this.setSize(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight());
        });

        // Setup the maskRoot, the parent of all the masking meshes
        this._maskRootNode = new TransformNode("html-mesh-mask-root", scene);

        const boundCameraMatrixChanged = this.onCameraMatrixChanged.bind(this);
        
        const observeCamera = () => {
            const camera = scene.activeCamera;
            if (camera) {
                camera.onProjectionMatrixChangedObservable.add(boundCameraMatrixChanged);
                camera.onViewMatrixChangedObservable.add(boundCameraMatrixChanged);
            }
        }
        
        if (scene.activeCamera) {
            observeCamera();
        } else {
            scene.onActiveCameraChanged.add(observeCamera);
        };

        // We need to make sure that HtmlMeshes are rendered before all other meshes
        // so that they don't appear in front of meshes that are actually in front of them
        // Updating the render order isn't ideal, but it is the only way to acheive this
        // The implication is that an app using the HtmlMeshRendered must set the scene render order
        // via the HtmlMeshRendered constructor
        const opaqueRenderOrder = renderOrderFunc(defaultOpaqueRenderOrder);
        const alphaTestRenderOrder = renderOrderFunc(defaultAlphaTestRenderOrder);
        const transparentRenderOrder = renderOrderFunc(defaultTransparentRenderOrder);
        scene.setRenderingOrder(0, opaqueRenderOrder, alphaTestRenderOrder, transparentRenderOrder);

        scene.onAfterRenderObservable.add(() => {
            this.render(scene, scene.activeCamera as Camera);
        });

    }

    protected getSize(): { width: number, height: number } {
        return {
            width: this._width,
            height: this._height
        };
    }

    protected setSize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._widthHalf = this._width / 2;
        this._heightHalf = this._height / 2;

        (this._domElement as HTMLElement).style.width = width + 'px';
        (this._domElement as HTMLElement).style.height = height + 'px';

        (this._cameraElement as HTMLElement).style.width = width + 'px';
        (this._cameraElement as HTMLElement).style.height = height + 'px';
    }

    protected getCameraCSSMatrix(matrix: Matrix): string {
        const elements = matrix.m;

        return 'matrix3d(' +
            this.epsilon( elements[ 0 ] ) + ',' +
            this.epsilon( - elements[ 1 ] ) + ',' +
            this.epsilon( elements[ 2 ] ) + ',' +
            this.epsilon( elements[ 3 ] ) + ',' +
            this.epsilon( elements[ 4 ] ) + ',' +
            this.epsilon( - elements[ 5 ] ) + ',' +
            this.epsilon( elements[ 6 ] ) + ',' +
            this.epsilon( elements[ 7 ] ) + ',' +
            this.epsilon( elements[ 8 ] ) + ',' +
            this.epsilon( - elements[ 9 ] ) + ',' +
            this.epsilon( elements[ 10 ] ) + ',' +
            this.epsilon( elements[ 11 ] ) + ',' +
            this.epsilon( elements[ 12 ] ) + ',' +
            this.epsilon( - elements[ 13 ] ) + ',' +
            this.epsilon( elements[ 14 ] ) + ',' +
            this.epsilon( elements[ 15 ] ) +
        ')';
    }   

    protected getHtmlContentCSSMatrix(matrix: Matrix): string{
        const elements = matrix.m;
        const matrix3d = 'matrix3d(' +
            this.epsilon( elements[ 0 ] ) + ',' +
            this.epsilon( elements[ 1 ] ) + ',' +
            this.epsilon( elements[ 2 ] ) + ',' +
            this.epsilon( elements[ 3 ] ) + ',' +
            this.epsilon( - elements[ 4 ] ) + ',' +
            this.epsilon( - elements[ 5 ] ) + ',' +
            this.epsilon( - elements[ 6 ] ) + ',' +
            this.epsilon( - elements[ 7 ] ) + ',' +
            this.epsilon( elements[ 8 ] ) + ',' +
            this.epsilon( elements[ 9 ] ) + ',' +
            this.epsilon( elements[ 10 ] ) + ',' +
            this.epsilon( elements[ 11 ] ) + ',' +
            this.epsilon( elements[ 12 ] ) + ',' +
            this.epsilon( elements[ 13 ] ) + ',' +
            this.epsilon( elements[ 14 ] ) + ',' +
            this.epsilon( elements[ 15 ] ) +
        ')';

        return matrix3d;
    }  
    
    /**
     *
     * @param {HtmlMesh} htmlMesh
     * @param {BABYLON.Matrix} maxZoomTransform Screen space transform matrix when the camera is at max zoom
     * @param {BABYLON.Matrix} currentZoomTransform Screen space transform matrix when the camera is at its current zoom
     */
    protected renderHtmlMesh(htmlMesh: HtmlMesh/*, maxZoomTransform: Matrix, 
                             currentZoomTransform: Matrix*/) {
        if (!htmlMesh.element) {
            // nothing to render, so bail
            return;
        }

        let htmlMeshData = this._cache.htmlMeshData.get(htmlMesh);
        if (!htmlMeshData) {
            htmlMeshData = { baseScaleFactor: 1, style: '' };
            this._cache.htmlMeshData.set(htmlMesh, htmlMeshData);
        } 

        // If the htmlMesh content has changed, update the base scale factor
        if (htmlMesh.requiresUpdate) {   
            this.updateBaseScaleFactor(htmlMesh);
            // this.altUpdateBaseScaleFactor(htmlMesh);
        }  

        // Now transform the element using the scale, the html mesh's world matrix, and the camera's world matrix
        // Make sure the camera world matrix is up to date
        if (!this._cameraWorldMatrix) {
            this._cameraWorldMatrix = htmlMesh.getScene().activeCamera?.getWorldMatrix();
        }
        if (!this._cameraWorldMatrix) {
            return;
        }

		const objectWorldMatrix = htmlMesh.getWorldMatrix();
        const scaledAndTranslatedObjectMatrix = this._temp.objectMatrix;
        scaledAndTranslatedObjectMatrix.copyFrom(objectWorldMatrix);

        scaledAndTranslatedObjectMatrix.multiplyAtIndex(0, 0.01 * htmlMeshData.baseScaleFactor);
        // scaledAndTranslatedObjectMatrix.multiplyAtIndex(0, 0.01);
        scaledAndTranslatedObjectMatrix.multiplyAtIndex(5, 0.01 * htmlMeshData.baseScaleFactor);
        // scaledAndTranslatedObjectMatrix.multiplyAtIndex(5, 0.01);

        // Apply the scale
        // scaledAndTranslatedObjectMatrix.multiplyAtIndex(0, scale);
        // scaledAndTranslatedObjectMatrix.multiplyAtIndex(5, scale);
        
        scaledAndTranslatedObjectMatrix.setRowFromFloats(3, 
                -this._cameraWorldMatrix.m[12] + htmlMesh.position.x,
                -this._cameraWorldMatrix.m[13] + htmlMesh.position.y,
                this._cameraWorldMatrix.m[14] - htmlMesh.position.z,
                this._cameraWorldMatrix.m[15] * 0.00001);

        scaledAndTranslatedObjectMatrix.scaleToRef(100, scaledAndTranslatedObjectMatrix);

        const style = `translate(-50%, -50%) ${this.getHtmlContentCSSMatrix(scaledAndTranslatedObjectMatrix)}`;

        if ( htmlMeshData.style !== style ) {
            htmlMesh.element.style.webkitTransform = style;
            htmlMesh.element.style.transform = style;
        }

        if ( htmlMesh.element.parentNode !== this._cameraElement ) {
            this._cameraElement!.appendChild( htmlMesh.element );
        }
    }  

    /**
     *
     * @param {BABYLON.Scene} scene
     * @param {BABYLON.Camera} camera
     */
    protected render = (scene: Scene, camera: Camera) => {
        let needsUpdate = false;

        // Check for a camera change
        if (this._cameraMatrixUpdated) {
            this._cameraMatrixUpdated = false;
            needsUpdate = true;
        }

        // If the camera position has changed, then we also need to update
        if (camera.position.x !== this._cache.cameraData.position.x ||
            camera.position.y !== this._cache.cameraData.position.y ||
            camera.position.z !== this._cache.cameraData.position.z) {
            this._cache.cameraData.position.copyFrom(camera.position);
            needsUpdate = true;
        }

        // Check for a dpr change
        if (window.devicePixelRatio !== this._lastDevicePixelRatio) {
            this._lastDevicePixelRatio = window.devicePixelRatio;
            needsUpdate = true;
        }

        // Check if any meshes need to be updated
        const meshesNeedingUpdate = scene.meshes.filter(mesh => mesh['isHtmlMesh'] && 
                (needsUpdate || (mesh as HtmlMesh).requiresUpdate));
        needsUpdate = needsUpdate || meshesNeedingUpdate.length > 0;

        if (!needsUpdate) {
            return;
        }

        // Get a projection matrix for the camera
        const projectionMatrix = camera.getProjectionMatrix();
        const fov = projectionMatrix.m[5] * this._heightHalf;

        if (this._cache.cameraData.fov !== fov) {

			if (camera.mode == Camera.PERSPECTIVE_CAMERA ) {
				this._domElement!.style.webkitPerspective = fov + 'px';
				this._domElement!.style.perspective = fov + 'px';
			} else {
				this._domElement!.style.webkitPerspective = '';
				this._domElement!.style.perspective = '';
			}
			this._cache.cameraData.fov = fov;
		}

        // Calculate transformations.  We are going to need to compute the following matrices:
        // 1. A transform matrix from world space to clip space when the camera is at max zoom
        // 2. A transform matrix from world space to clip space when the camera is at its current zoom
        // These will be used to project the bounds of the html mesh into screen space so we can 
        // compute a scale to apply the the CSS content that
        // * avoids odd resizing behavior of the CSS content when the browser aspect ratio changes,
        //   the browser zoom level changes, or the browser dpr changes
        // * makes the content as clear as possible at 100% camera zoom
        // const world = Matrix.IdentityReadOnly;

        // const viewportMatrix = this._temp.viewportMatrix;
        // {
        //     const viewport = this._temp.vp;
        //     camera.viewport.toGlobalToRef(scene.getEngine().getRenderWidth(), 
        //                                   scene.getEngine().getRenderHeight(), viewport);

        //     const cw = viewport.width;
        //     const ch = viewport.height;
        //     const cx = viewport.x;
        //     const cy = viewport.y;

        //     // Compute a transform matrix from normalized device coordinates to screen coordinates
        //     Matrix.FromValuesToRef(
        //         cw / 2.0, 0, 0, 0,
        //         0, -ch / 2.0, 0, 0,
        //         0, 0, 0.5, 0,
        //         cx + cw / 2.0, ch / 2.0 + cy, 0.5, 1,
        //         viewportMatrix
        //     );
        // }

        // // Compute a transform matrix from world space to clip space when the camera is at max zoom
        // // TODO Figure out what this should look like when not using a arc rotate camera
        // //      For now, just use minZ, but that is likely too close
        // const maxZoomScreenSpaceTransform = this._temp.maxZoomScreenSpaceTransform;
        // {
        //     const maxZoomClipSpaceTransform = this._temp.maxZoomClipSpaceTransform;
        //     {
        //         let cameraLowerLimit = camera instanceof ArcRotateCamera && 
        //                 camera.lowerRadiusLimit ? camera.lowerRadiusLimit : camera.minZ;
        //         // Clamp to something reasonable if the camera lower limit is too small
        //         cameraLowerLimit = Math.max(cameraLowerLimit, fullZoomMinCameraRadius);
        //         const viewMatrix = this._temp.cameraViewMatrix;
        //         viewMatrix.copyFrom(camera.getViewMatrix());
        //         viewMatrix.setTranslationFromFloats(0.0, 0.0, cameraLowerLimit);

        //         viewMatrix.multiplyToRef(projectionMatrix, maxZoomClipSpaceTransform);
        //     }

        //     world.multiplyToRef(maxZoomClipSpaceTransform, maxZoomScreenSpaceTransform);
        //     maxZoomScreenSpaceTransform.multiplyToRef(viewportMatrix, maxZoomScreenSpaceTransform);
        // }

        // const screenSpaceTransform = this._temp.screenSpaceTransform;
        // {
        //     world.multiplyToRef(scene.getTransformMatrix(), screenSpaceTransform);
        //     screenSpaceTransform.multiplyToRef(viewportMatrix, screenSpaceTransform);
        // }

        if ( camera.parent === null ) {
            camera.computeWorldMatrix();
        }

        const cameraMatrixWorld = this._temp.cameraWorldMatrix;
        cameraMatrixWorld.copyFrom(camera.getWorldMatrix());
        const cameraRotationMatrix = this._temp.cameraRotationMatrix;
        cameraMatrixWorld.getRotationMatrix().transposeToRef(cameraRotationMatrix);

		const cameraMatrixWorldAsArray = this._temp.cameraWorldMatrixAsArray;
        cameraMatrixWorld.copyToArray(cameraMatrixWorldAsArray);

        cameraMatrixWorldAsArray[1] = cameraRotationMatrix.m[1];
		cameraMatrixWorldAsArray[2] = -cameraRotationMatrix.m[2];
		cameraMatrixWorldAsArray[4] = -cameraRotationMatrix.m[4];
		cameraMatrixWorldAsArray[6] = -cameraRotationMatrix.m[6];
		cameraMatrixWorldAsArray[8] = -cameraRotationMatrix.m[8];
		cameraMatrixWorldAsArray[9] = -cameraRotationMatrix.m[9];

        Matrix.FromArrayToRef(cameraMatrixWorldAsArray, 0, cameraMatrixWorld);

		const cameraCSSMatrix = 'translateZ(' + fov + 'px)' + this.getCameraCSSMatrix(cameraMatrixWorld);
        const style = cameraCSSMatrix + 'translate(' + this._widthHalf + 'px,' + this._heightHalf + 'px)';
        console.log("In render - camera matrix = ", cameraCSSMatrix);
        console.log("In render - camera style, cached camera style = ", style, this._cache.cameraData.style);

		if (this._cache.cameraData.style !== style) {
			this._cameraElement!.style.webkitTransform = style;
			this._cameraElement!.style.transform = style;
			this._cache.cameraData.style = style;
		}

        // _Render objects if necessary
        meshesNeedingUpdate.forEach(mesh => {
            this.renderHtmlMesh(mesh as HtmlMesh/*, maxZoomScreenSpaceTransform, screenSpaceTransform*/);
        });
    }

    /**
     * Computes a a scale factor that is the ration of the screen width in pixels to the projected
     * mesh width in pixels at current zoom
     * @param htmlMesh 
     *                 
     * @param maxZoomTransform 
     * @param currentZoomTransform 
     */
    protected updateBaseScaleFactor(htmlMesh: HtmlMesh/*, maxZoomTransform: Matrix, 
                                    currentZoomTransform: Matrix*/) {
        // Get the scene and camera
        const scene = htmlMesh.getScene();
        const camera = scene.activeCamera!;

        // Get the viewport
        const viewport = this._temp.vp;
        camera.viewport.toGlobalToRef(this._width, this._height, viewport);

        // Get the mesh width in pixels at current zoom
        const boundingInfo = htmlMesh.getBoundingInfo();

        // Get the html mesh's world min and max
        const worldMin = boundingInfo.boundingBox.minimumWorld;
        const worldMax = boundingInfo.boundingBox.maximumWorld;

        const transform = scene.getTransformMatrix();

        const worldMinScreen = this._temp.worldMin;
        const worldMaxScreen = this._temp.worldMax;

        const world = Matrix.IdentityReadOnly;

        // project the world min and max to screen coords
        Vector3.ProjectToRef(worldMin, world, transform, viewport, worldMinScreen);
        Vector3.ProjectToRef(worldMax, world, transform, viewport, worldMaxScreen);
        
        // Get htmlMesh world width and height in pixels
        const htmlMeshWorldWidth = Math.abs(worldMaxScreen.x - worldMinScreen.x);
        const htmlMeshWorldHeight = Math.abs(worldMaxScreen.y - worldMinScreen.y);

        // Get screen width and height
        let screenWidth = this._width;
        let screenHeight = this._height;

        // Calculate aspect ratios
        const htmlMeshAspectRatio = htmlMeshWorldWidth / htmlMeshWorldHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        // Adjust screen dimensions based on aspect ratios
        if (htmlMeshAspectRatio > screenAspectRatio) {
            // If the HTML mesh is wider relative to its height than the screen, adjust the screen width
            screenWidth = screenHeight * htmlMeshAspectRatio;
        } else {
            // If the HTML mesh is taller relative to its width than the screen, adjust the screen height
            screenHeight = screenWidth / htmlMeshAspectRatio;
        }

        // Set content to fill screen so we get max resolution when it is shrunk to fit the mesh
        htmlMesh.setContentSizePx(screenWidth, screenHeight);

        // Calculate scale factor
        let scale = Math.min(htmlMeshWorldWidth / screenWidth, htmlMeshWorldHeight / screenHeight);

        // If the scale factor is very close to 1, set it to 1
        if (Math.abs(scale - 1) < 0.01) {
            scale = 1;
        }

        // we ensured that the html mesh data existed before this function was called
        let htmlMeshData = this._cache.htmlMeshData.get(htmlMesh);
        if (htmlMeshData) {
            htmlMeshData.baseScaleFactor = scale * 3.3;
        }
    }

    protected altUpdateBaseScaleFactor(htmlMesh: HtmlMesh) {
        // Get the scene and camera
        const scene = htmlMesh.getScene();
        const camera = scene.activeCamera!;

        const world = Matrix.IdentityReadOnly;

        // Get the viewport
        const viewport = this._temp.vp;
        camera.viewport.toGlobalToRef(this._width, this._height, viewport);
        const viewportMatrix = this._temp.viewportMatrix;
        
        const cw = viewport.width;
		const ch = viewport.height;
		const cx = viewport.x;
		const cy = viewport.y;

		Matrix.FromValuesToRef(
			cw / 2.0, 0, 0, 0,
			0, -ch / 2.0, 0, 0,
			0, 0, 0.5, 0,
			cx + cw / 2.0, ch / 2.0 + cy, 0.5, 1,
			viewportMatrix
		);

        const maxZoomScreenSpaceTransform = this._temp.maxZoomScreenSpaceTransform;
        const maxZoomClipSpaceTransform = this._temp.maxZoomClipSpaceTransform;
        const screenSpaceTransform = this._temp.screenSpaceTransform;
        const viewMatrix = this._temp.cameraViewMatrix;

        let cameraLowerLimit = camera instanceof ArcRotateCamera && 
                               camera.lowerRadiusLimit ? camera.lowerRadiusLimit : camera.minZ;
        // Clamp to something reasonable if the camera lower limit is too small
        cameraLowerLimit = Math.max(cameraLowerLimit, fullZoomMinCameraRadius);

        // Get the view matrix
        viewMatrix.copyFrom(camera.getViewMatrix());

        // Translate view matrix to min camera radius (max zoom)
        viewMatrix.setTranslationFromFloats(0, 0, cameraLowerLimit)

        // Multiply by projection matrix to get clip space transform at max zoom
        viewMatrix.multiplyToRef(camera.getProjectionMatrix(), maxZoomClipSpaceTransform);

        // multiply by world to screen space transform at max zoom to NDC
        world.multiplyToRef(maxZoomClipSpaceTransform, maxZoomScreenSpaceTransform);

        // Multiply by viewport to get world to screen space transform at maximum zoom in pixels
        maxZoomScreenSpaceTransform.multiplyToRef(viewportMatrix, maxZoomScreenSpaceTransform);

        // Multiply world by current screen space transfrom to get screen space transform to NDC
        world.multiplyToRef(scene.getTransformMatrix(), screenSpaceTransform);

        // Multiply by viewport to get world to screen space transform in pixels
        screenSpaceTransform.multiplyToRef(viewportMatrix, screenSpaceTransform);

        // Get the mesh width in pixels at current zoom
        const boundingInfo = htmlMesh.getBoundingInfo();

        // Get the html mesh's world min and max
        const worldMin = boundingInfo.boundingBox.minimumWorld;
        const worldMax = boundingInfo.boundingBox.maximumWorld;

        const transform = scene.getTransformMatrix();

        const worldMinScreenMaxZoom = this._temp.worldMin;
        const worldMaxScreenMaxZoom = this._temp.worldMax;

        Vector3.TransformCoordinatesToRef(worldMin, maxZoomScreenSpaceTransform, 
                worldMinScreenMaxZoom);
        Vector3.TransformCoordinatesToRef(worldMax, maxZoomScreenSpaceTransform, 
                worldMaxScreenMaxZoom);

        let maxZoomWidth = worldMaxScreenMaxZoom.x - worldMinScreenMaxZoom.x;
        let maxZoomHeight = worldMaxScreenMaxZoom.y - worldMinScreenMaxZoom.y;

        // Position with even numbers to prevent fuzziness with CSS translate(-50%, -50%)
        maxZoomWidth = 2 * Math.round(maxZoomWidth / 2) + 2;
        maxZoomHeight = 2 * Math.round(maxZoomHeight / 2) + 2;

        const worldMinScreen = this._temp.worldMin;
        const worldMaxScreen = this._temp.worldMax;
	    Vector3.TransformCoordinatesToRef(worldMin, screenSpaceTransform, worldMinScreen);
        Vector3.TransformCoordinatesToRef(worldMax, screenSpaceTransform, worldMaxScreen);

        const screenLeft = worldMinScreen.x;
        const screenTop = worldMaxScreen.y;
        const screenWidth = worldMaxScreen.x - worldMinScreen.x;
        const screenHeight = worldMinScreen.y - worldMaxScreen.y;

	    htmlMesh.setContentSizePx(maxZoomWidth, maxZoomHeight);

        let scale = Math.min(screenWidth / maxZoomWidth, screenHeight / maxZoomHeight);
        let screenCenterX = screenLeft + screenWidth / 2;
        let screenCenterY = screenTop + screenHeight / 2;

        // If the scale factor is very close to 1, set it to 1
        if (Math.abs(scale - 1) < 0.01) {
            scale = 1;
        }
        screenCenterX = Math.round(screenCenterX);
        screenCenterY = Math.round(screenCenterY);

        // we ensured that the html mesh data existed before this function was called
        let htmlMeshData = this._cache.htmlMeshData.get(htmlMesh);
        if (htmlMeshData) {
            htmlMeshData.baseScaleFactor = scale;
        }
    }

    protected onCameraMatrixChanged = (camera: Camera) => {
        this._cameraViewMatrix = camera.getViewMatrix();
        this._projectionMatrix = camera.getProjectionMatrix();
        this._cameraWorldMatrix = camera.getWorldMatrix();
        this._viewport = camera.viewport;
        this._cameraMatrixUpdated = true;
    }

    private epsilon(value: number) {
        return Math.abs(value) < 1e-10 ? 0 : value;
    }
}
