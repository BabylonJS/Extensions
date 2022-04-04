

Playground: https://playground.babylonjs.com/#74ZMUP

You attach it on a camera like so:

```
      const topNode = new TransformNode('compass_transform_node', scene)
      topNode.parent = camera
      topNode.position = new Vector3(0, 23, 0)
      const compass = new Compass(50, 72, 0, topNode, scene, camera)
```
![image|690x49](upload://f22M90Nr8XztgwqCqLP5Ssac25h.png)

There is both a TypeScript and vanilla JavaScript version this component. Note that in the playground example the necessary types/classes are unpacked from the window.BABYLON object, while in the actual files Compass.ts and Compass.js they are imported; this setup presumes you are using npm + node to build your project.