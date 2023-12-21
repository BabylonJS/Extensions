import { Scene } from "@babylonjs/core";

const _canvasRectUpdateInterval = 500; // Update the canvas rect every 500ms
let _getCanvasRectGenerator: Generator<DOMRect | null> | null = null;

function* createGetCanvasRectGenerator(
    scene: Scene, updateInterval: number
): Generator<DOMRect | null> {
    let lastCallTime = 0;
    let canvasRect: DOMRect | null = null;

    while (true) {
        const currentTime = Date.now();
        if (currentTime - lastCallTime >= updateInterval) {
            lastCallTime = currentTime;
            // Get the canvas rect here
            canvasRect =
                scene?.getEngine().getRenderingCanvasClientRect() ?? null;
        }
        yield canvasRect;
    }
}

export const getCanvasRect = (scene: Scene) => {
    if (!_getCanvasRectGenerator) {
        _getCanvasRectGenerator = createGetCanvasRectGenerator(scene, _canvasRectUpdateInterval);
    }
    return _getCanvasRectGenerator.next().value;
};