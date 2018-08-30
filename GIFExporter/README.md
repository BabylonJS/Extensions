# Babylon.js Animated GIF Exporter

Babylon.js Animated GIF Exporter is a simple library that enables exporting of animated GIFs from any BabylonJS Engine.

---

To capture and create an animated GIF from your Babylon Engine:

1.  Download package

    `npm i babylonjs-gifexporter`

2.  Import GIFExporter into your project

    ```javascript
    import GIFExporter from 'babylonjs-gifexporter';
    ```

3.  Ensure the engine is created with `preserveDrawingBuffer` set to `true`. **There are multiple ways of setting this flag,** I will show a simple example here.

    ```javascript
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });
    ```

4.  Create an instance of the GIF Exporter using the `engine` and an `options` object:

    - `options` is an object that consist of `delay: number` and `duration: number`
      ```javascript
      options:{delay: number, duration: number}
      ```

    Basic creation:

    ```javascript
    const gifExporter = new GIFExporter(engine, { delay: 20, duration: 1000 });
    ```

    The above 🔼🔼example🔼🔼 will capture a frame every 20 miliseconds to create a 1 second long animated GIF.

5.  Call `download('nameOf.gif')` method with the name you want of your GIF file + `.gif`
    ```javascript
    gifExporter.download(myAnimation.gif);
    ```
