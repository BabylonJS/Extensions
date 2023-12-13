import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Behavior } from "@babylonjs/core/Behaviors/behavior";
import { Scene } from "@babylonjs/core/scene";
import { requestCapture, requestRelease, releaseCurrent, getCapturingId } from "./pointer-events-capture.ts";

// Module level variable used to track the current picked mesh
let _currentPickedMeshId: number | null = null;

// Module level variable for holding the canvas location and dimensions on the screen
let _canvasRect: DOMRect | null = null;

// Module level variable for holding the current scene
let _scene: Scene | null = null;

// Module level variable to hold the count of behavior instances that are currently capturing pointer events
// on entry.  This is used to determine if we need to start or stop observing pointer movement.
let captureOnEnterCount = 0;

// Map used to store instance of the PointerEventsCaptureBehavior for a mesh
// We do this because this gets checked on pointer move and we don't want to 
// use getBehaviorByName() because that is a linear search
const meshToBehaviorMap = new WeakMap<AbstractMesh, PointerEventsCaptureBehavior>();

const startCaptureOnEnter = (scene: Scene) => {
    if (captureOnEnterCount === 0) {
        document.addEventListener('pointermove', onPointerMove);
        _scene = _scene ?? scene;
        _canvasRect = _canvasRect ?? _scene.getEngine().getRenderingCanvasClientRect();
    }
    captureOnEnterCount++;
}

const stopCaptureOnEnter = () => {
    captureOnEnterCount--;
    if (captureOnEnterCount < 0) {
        captureOnEnterCount = 0;
    }
    if (captureOnEnterCount === 0) {
        document.removeEventListener('pointermove', onPointerMove);
        _scene = null;
        _canvasRect = null;
    }
}

// Module level function used to determine if an entered mesh should capture pointer events
const onPointerMove = (evt: PointerEvent) => {
    // If the observed event is pointer movement with no buttons held
    if (evt.buttons === 0) {
        if (!_canvasRect || !_scene) {
            return;
        }

        const pointerScreenX = evt.clientX - _canvasRect.left;
        const pointerScreenY = evt.clientY - _canvasRect.top;

        const pickResult = _scene.pick(pointerScreenX, pointerScreenY);

        let pickedMesh: AbstractMesh | null;
        if (pickResult.hit) {
            pickedMesh = pickResult.pickedMesh;
        } else {
            pickedMesh = null;
        }

        if (!pickedMesh || 
            pickedMesh.uniqueId === _currentPickedMeshId ||
            pickedMesh.uniqueId === parseInt(getCapturingId() || '')) {
            return;
        }

        let pointerCaptureBehavior: PointerEventsCaptureBehavior | undefined;
        if (pickedMesh && 
            (pointerCaptureBehavior = meshToBehaviorMap.get(pickedMesh)) && // Assign and test so we can eliminate the need for a separate line to get the behavior
            pickedMesh.uniqueId !== parseInt(getCapturingId() || '')) {
            console.log("In PointerCaptureBehavior.onPointerMove - releasing pointer events for", getCapturingId())
            releaseCurrent(); // Request release of current pointer events owner
            console.log("In PointerCaptureBehavior.onPointerMove - capturing pointer events for", pickedMesh.id)
            pointerCaptureBehavior.capturePointerEvents();
        } else if (pickedMesh) {
            console.log("In PointerCaptureBehavior.onPointerMove - releasing pointer events for", getCapturingId())
            releaseCurrent(); // Request release of current pointer events owner
        }

        _currentPickedMeshId = pickedMesh.uniqueId;
    }    
};


// Behavior for any content that can capture pointer events, i.e. bypass the Babylon pointer event handling
// and receive pointer events directly.  It will register the capture triggers and negotiate the capture and 
// release of pointer events.  Curerntly this applies only to HtmlMesh
export class PointerEventsCaptureBehavior implements Behavior<AbstractMesh> {
    name = "PointerEventsCaptureBehavior";
    
    attachedMesh: AbstractMesh | null;
    _captureOnPointerEnter: boolean;
	
    constructor(private captureCallback: () => void, 
                private releaseCallback: () => void,
                { captureOnPointerEnter = true } = {}) {
        this.attachedMesh = null;
        this._captureOnPointerEnter = captureOnPointerEnter;
	}

    set captureOnPointerEnter(captureOnPointerEnter: boolean) {
        if (this._captureOnPointerEnter === captureOnPointerEnter) {
            return;
        }
        this._captureOnPointerEnter = captureOnPointerEnter;
        if (this.attachedMesh) {
            if (this._captureOnPointerEnter) {
                startCaptureOnEnter(this.attachedMesh.getScene()!);
            } else {
                stopCaptureOnEnter();
            }
        }
    }

	init() {}

	attach(mesh: AbstractMesh) {
        // Add a reference to this behavior on the mesh.  We do this so we can get a 
        // reference to the behavior in the onPointerMove function without relying on 
        // getBehaviorByName(), which does a linear search of the behaviors array.
        this.attachedMesh = mesh;
        meshToBehaviorMap.set(mesh, this);
        if (this.captureOnPointerEnter) {
            startCaptureOnEnter(mesh.getScene()!);
        }
	}

	detach() {
        if (!this.attachedMesh) {
            return;
        }
        // Remove the reference to this behavior from the mesh
        meshToBehaviorMap.delete(this.attachedMesh);
        if (this.captureOnPointerEnter) {
            stopCaptureOnEnter();
        }
        this.attachedMesh = null;
	}

	// Release pointer events
	releasePointerEvents() {
        if (!this.attachedMesh) {
            return;
        }
        requestRelease(this.attachedMesh.uniqueId.toString());
	}

	// Capture pointer events
	capturePointerEvents() {
		if (!this.attachedMesh) {
            return;
        }
        requestCapture(this.attachedMesh.uniqueId.toString(), 
                       this.captureCallback,
                       this.releaseCallback);
	}
} 