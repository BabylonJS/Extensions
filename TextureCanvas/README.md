# TextureCanvas

A Babylon.js texture to draw textures onto.

## Getting it
### As BABYLON.TextureCanvas
Include [textureCanvasNoModule.js](https://poolminer.github.io/BabylonTextureCanvas/dist/textureCanvasNoModule.js)

From an html document:
```html
<script src="https://poolminer.github.io/BabylonTextureCanvas/dist/textureCanvasNoModule.js"></script>
```

From within Babylon.js:
```javascript
BABYLON.Tools.LoadScript('https://poolminer.github.io/BabylonTextureCanvas/dist/textureCanvasNoModule.js', () => {
    //ready
});
```

### As a module import
Import ```TextureCanvas``` from *textureCanvas.ts/js*, using modules from [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core).

## Basic usage examples
Create a 128px by 128px TextureCanvas, initialized with *myTexture*:
```javascript
new TextureCanvas(128, scene, myTexture);
```
Playground demo:

[https://www.babylonjs-playground.com/#9S5YZY#6](https://www.babylonjs-playground.com/#9S5YZY#6)

---

Decide how textures are drawn by using a draw context.
Here, *myTexture* will be drawn in the middle of the canvas, and rotated by 45 degrees:
```javascript
let ctx = myTextureCanvas.createContext();
ctx.setDrawRect(0.25, 0.25, 0.5, 0.5);
ctx.rotation.z = Math.PI / 4;
ctx.drawTexture(myTexture);
```
Playground demo:

[https://www.babylonjs-playground.com/#9S5YZY#27](https://www.babylonjs-playground.com/#9S5YZY#27)

---

You can create multiple contexts and use them interchangeably.

Animating two textures using two contexts:
```javascript
let ctx1 = myTextureCanvas.createContext();
let ctx2 = myTextureCanvas.createContext();

ctx1.diffuseTexture = myTexture; // Set the texture to be drawn
ctx1.setDrawRect(0, 0, 0.12, 0.24);
ctx1.setPivotPoint(1, 1, true); // Top-right corner of the texture to be drawn

ctx2.diffuseTexture = myOtherTexture;
ctx2.setDrawRect(0.25, 0.25, 0.5, 0.5);

scene.registerBeforeRender(() => {
    ctx1.clear(); // Clear the canvas using the clearCoor of this context
    ctx1.rotation.z += 0.01;
    ctx1.draw();

    ctx2.skewing.u = Math.abs(Math.sin(ctx1.rotation.z)); // Skew along the u-axis
    ctx2.draw();
});
```
Playground demo:

[https://www.babylonjs-playground.com/#9S5YZY#28](https://www.babylonjs-playground.com/#9S5YZY#28)

## Summary documentation
[DOCUMENTATION.md](./DOCUMENTATION.md)

## Compiling it yourself
You need [NodeJS](https://nodejs.org/en/download/) to get and resolve the [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core) dependencies.

You need [TypeScript](https://www.npmjs.com/package/typescript) to compile the source code.

You need [Java](https://www.java.com/en/download/) to convert the compiled modular code (*textureCanvas.ts*) to the non-modular code (*textureCanvasNoModule.js*).

1. Clone / download this repository;
2. Run ```npm install``` inside it to install the dependencies;
3. Open the project folder in VSCode;
4. Press ```CTRL``` + ```SHIFT``` + ```B```.
