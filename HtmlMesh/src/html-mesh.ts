import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { CreatePlaneVertexData } from '@babylonjs/core/Meshes/Builders/planeBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Matrix } from '@babylonjs/core/Maths/math';
import { PointerEventsCaptureBehavior } from './pointer-events-capture-behavior';
import { Scene } from '@babylonjs/core';

// This class represents HTML content that we want to _render as though it is part of the scene.  The HTML content is actually
// rendered below the canvas, but a depth mask is created by this class that writes to the depth buffer but does not
// write to the color buffer, effectively punching a hole in the canvas.  CSS transforms are used to scale, translate, and rotate
// the HTML content so that it matches the camera and mesh orientation.  The class supports interactions in editable and non-editable mode.
// In non-editable mode (the default), events are passed to the HTML content when the pointer is over the mask (and not occluded by other meshes
// in the scene).  
export class HtmlMesh extends Mesh {
    isHtmlMesh = true;

    _requiresUpdate = true;

    _element?: HTMLElement
    _width?: number;
    _height?: number;

    _inverseScaleMatrix: Matrix | null = null;

	_captureOnPointerEnter: boolean = true;
	_pointerEventCaptureBehavior: PointerEventsCaptureBehavior | null = null;

    constructor(scene: Scene, id: string , { captureOnPointerEnter = true } = {}) {
        super(id, scene);

		// Requires a browser to work.  Bail if we aren't running in a browser
        if (typeof document === 'undefined') {
            console.warn(`Creating an instance of an HtmlMesh with id ${id} outside of a browser.  The mesh will not be visible.`);
			return;
        }
		
        this.createMask();
        this._element = this.createElement();
		
		// Set disabled by default, so this doesn't show up or get picked until there is some content to show
		this.setEnabled(false);

		this._captureOnPointerEnter = captureOnPointerEnter;

		// Create a behavior to capture pointer events
		this._pointerEventCaptureBehavior = new PointerEventsCaptureBehavior(
			this.capturePointerEvents.bind(this),
			this.releasePointerEvents.bind(this),
			{ captureOnPointerEnter: this._captureOnPointerEnter }
		)
		this.addBehavior(this._pointerEventCaptureBehavior);
    }

    get element () {
        return this._element;
    }

    get requiresUpdate() {
        const response = this._requiresUpdate;
        this._requiresUpdate = false;
        return response;
    }

	set captureOnPointerEnter(captureOnPointerEnter: boolean) {
		this._captureOnPointerEnter = captureOnPointerEnter;
		if (this._pointerEventCaptureBehavior) {
			this._pointerEventCaptureBehavior.captureOnPointerEnter = captureOnPointerEnter;
		}
	}

	dispose() {
		super.dispose();
	}

    async ready() {
        return Promise.resolve();
    }
	
	// Sets the content of the element to the specified content adjusting the mesh scale to match and making it visible.  
	// If the the specified content is undefined, then it will make the mesh invisible.  In either case it will clear the
	// element content first.
	setContent(element: HTMLElement, width: number, height: number) {
		if (!this._element) {
			return;
		}
		this._element.innerHTML = "";

		this._width = width;
		this._height = height;
		this._requiresUpdate = true;

		this.scaling.setAll(1);

		if (!element) {
			this.setEnabled(false);
		} else {
			this._element!.appendChild(element);

			this.updateScaleIfNecessary();

			this.setEnabled(true);
		}

        // Capture the content z index
		this.setElementZIndex(this.position.z * -10000);
	}

    // Overides BABYLON.Mesh.setEnabled
    setEnabled(enabled: boolean) {
        if (!this._element) {
			return;
		}
		// If enabled, then revert the content element display
        // otherwise hide it
        this._element!.style.display = enabled ? '' : 'none';
		// Capture the content z index
		this.setElementZIndex(this.position.z * -10000);
        super.setEnabled(enabled);
    }

	/**
	 * Sets the size of the content in CSS pixels (element width and height at 100% zoom).
	 * @param {number} width
	 * @param {number} height
	 */
	 setContentSizePx(width: number, height: number) {
		if (!this._element) {
			return;
		}
		const childElement = this._element!.firstElementChild as HTMLElement;
		if (childElement) {
			childElement.style.width = `${width}px`;
			childElement.style.height = `${height}px`;
		}
	}

	protected updateScaleIfNecessary() {
		// If we have setContent before, the content scale is baked into the mesh.  If we don't reset the vertices to
		// the original size, then we will multiply the scale when we bake the scale below.  By applying the inverse, we back out
		// the scaling that has been done so we are starting from the same point.
		// First reset the scale to 1
		this.scaling.setAll(1);
		// Then back out the original vertices changes to match the content scale
		if (this._inverseScaleMatrix) {
			this.bakeTransformIntoVertices(this._inverseScaleMatrix);
			// Clear out the matrix so it doesn't get applied again unless we scale
			this._inverseScaleMatrix = null;
		}

		// Set scale to match content.  Note we can't just scale the mesh, because that will scale the content as well  
		// What we need to do is compute a scale matrix and then bake that into the mesh vertices.  This will leave the 
		// mesh scale at 1, so our content will stay it's original width and height until we scale the mesh.
		const scaleX = this._width || 1;
		const scaleY = this._height || 1;
		const scaleMatrix = Matrix.Scaling(scaleX, scaleY, 1);
		this.bakeTransformIntoVertices(scaleMatrix);

		// Get an inverse of the scale matrix that we can use to back out the scale changes we have made so
		// we don't multiply the scale.
		this._inverseScaleMatrix = new Matrix();
		scaleMatrix.invertToRef(this._inverseScaleMatrix);
	}
	
    protected createMask() {
		const vertexData = CreatePlaneVertexData({width: 1, height: 1}); // BJS 5
        vertexData.applyToMesh(this);
    
        const scene = this.getScene();
        this.checkCollisions = true;
    
        const depthMask = new StandardMaterial(`${this.id}-mat`, scene);
        depthMask.backFaceCulling = false;
        depthMask.disableColorWrite = true;
        depthMask.disableLighting = true;
    
        this.material = depthMask;

        // Optimization - Freeze material since it never needs to change
		this.material.freeze();
    }

    protected setElementZIndex(zIndex: number) {
		if (this._element) {
			this._element!.style.zIndex = `${zIndex}`;
		}
    }

    capturePointerEvents() {
		if (!this._element) {
			return;
		}

		// Enable dom content to capture pointer events
		this._element.style.pointerEvents = 'auto';

        // Supress events outside of the dom content
        document.getElementsByTagName('body')[0].style.pointerEvents = 'none';
    }

    releasePointerEvents() {
		if (!this._element) {
			return;
		}

		// Enable pointer events on canvas             
        document.getElementsByTagName('body')[0].style.pointerEvents = 'auto';

        // Disable pointer events on dom content
        this._element.style.pointerEvents = 'none';
		
    }
	
    createElement() {
		// Requires a browser to work.  Bail if we aren't running in a browser
        if (typeof document === 'undefined') {
            return;
        }
        const div = document.createElement( 'div' );
        div.id = this.id;
        div.style.backgroundColor = '#000';
        div.style.zIndex = '1';
        div.style.position = 'absolute';
        div.style.pointerEvents = 'auto';
		div.style.backfaceVisibility = 'hidden';
    
        return div;
    }
}