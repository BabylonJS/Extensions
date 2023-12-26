import { Scene } from "@babylonjs/core";


// #region canvasRect functions
const _canvasRectUpdateInterval = 500; // Update the canvas rect every 500ms
let _getCanvasRectGenerator: Generator<DOMRect | null> | null = null;
const _maxGetCanvasRectAttempts: number = 10;

function* createGetCanvasRectGenerator(
    scene: Scene,
    updateInterval: number
): Generator<DOMRect | null> {
    let lastCallTime = 0;
    let canvasRect: DOMRect | null = null;

    while (true) {
        const currentTime = Date.now();
        if (currentTime - lastCallTime >= updateInterval) {
            lastCallTime = currentTime;
            // Return the canvas rect, or the last known value
            let newCanvasRect =
                scene?.getEngine().getRenderingCanvasClientRect();
            if (newCanvasRect) {
                canvasRect = newCanvasRect;
            } else {
                if (canvasRect) {
                    console.warn(
                        "Canvas rect became null.  Returning last known value"
                    );
                }
                console.warn("Failed to get canvas rect.");
            }
        }
        yield canvasRect;
    }
}

export const getCanvasRectAsync = (scene: Scene): Promise<DOMRect | null> => {
    if (!_getCanvasRectGenerator) {
        _getCanvasRectGenerator = createGetCanvasRectGenerator(
            scene,
            _canvasRectUpdateInterval
        );
    }

    return new Promise<DOMRect | null>((resolve) => {
        let attempts = 0;
        const intervalId = setInterval(() => {
            const result = _getCanvasRectGenerator!.next();
            if (result.value !== null) {
                clearInterval(intervalId);
                resolve(result.value);
            } else {
                attempts++;
                if (attempts >= _maxGetCanvasRectAttempts) {
                    clearInterval(intervalId);
                    console.warn("Exceeded maximum number of attempts trying to get canvas rect");
                    resolve(null);
                }
            }
        }, _canvasRectUpdateInterval);
    });
};

export const getCanvasRectOrNull = (scene: Scene): DOMRect | null => {
    if (!_getCanvasRectGenerator) {
        _getCanvasRectGenerator = createGetCanvasRectGenerator(
            scene,
            _canvasRectUpdateInterval
        );
    }
    const result = _getCanvasRectGenerator.next();
    return result.value;
};
// #endregion canvasRect functions
