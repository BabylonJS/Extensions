**A Babylon.js extension to enable manipulation of scene Nodes**

![Radix Manipulator](http://i.imgur.com/duSsfRV.png)

## Features
 - A simple class: SimpleInteractionHelper that takes care of scene node selection and manipulation. The camera should also work as well as long as you don't initiate a move with the mouse cursor on the top of a Scene Node.
 - The ManipulatorInteractionHelper controls the manipulation of a single Scene Node, right now only AbstractMesh are supported.
 - The Radix class takes care of the Manipulation Radix display and user interaction.

## To get (quickly) started
Just create an instance of the SimpleInteractionHelper class if you want to use it with the default behave this class offers.

```javascript
  var sih = new SimpleInteractionHelper(this.scene);
```

### More about the classes and their behavior

#### Radix
 - This class create the visual geometry to display a manipulation radix in a viewport.
 - It also implements the logic to handler intersection, hover on feature and highlighting of a given feature (axis, rotationCylinder, plane selection).

#### ManipulatorInteractionHelper
This class is used to manipulated a single node.
Right now only node of type AbstractMesh is support.
In the future, manipulation on multiple selection could be possible.

A manipulation start when left clicking and moving the mouse. It can be cancelled if the right mouse button is clicked before releasing the left one (this feature is only possible if noPreventContextMenu is false).

Per default translation is peformed when manipulating the arrow (axis or cone) or the plane anchor. If you press the shift key it will switch to rotation manipulation. The Shift key can be toggle while manipulating, the current manipulation is accept and a new one starts.

You can set the rotation/translationStep (in radian) to enable snapping.

The current implementation of this class creates a radix with all the features selected.

![Radix features](http://i.imgur.com/e6lovSX.png)

#### SimpleInteractionHelper
The purpose of this class is to allow the camera manipulation, single node selection and manipulation.

You can use it as an example to create your more complexe/different interaction helper
