# CastorGUI V1.5

**A Babylon.js extension to create a GUI**

* [Demo online of this extension](http://www.babylon.actifgames.com/demoCastorGUI/)
* [Tutorial](https://github.com/dad72/CastorGUI/wiki)
* [Documentation](https://github.com/dad72/CastorGUI/tree/master/doc)

## Features:

Select or create themes.

Create GUI (element html5 and css3):
* texture
* text
* label
* window draggable (with title & button close)
* dialog (with button close)
* panel (simple dialog without button close)
* button
* slider
* progress
* meter (jauge de measure)
* select color (with compatitility IE and Edge)
* spinner
* radio button
* checkbox
* textfield
* textarea
* fieldset
* select with options

## Quick overview of use

We must create a GUIManager that allows to recover the origin of the canvas and provides other basic thing.
A GUIManager can have a CSS that Formatted anything you want to customize your GUI.
You can also options to add a theme in the third parameter.

```javascript
var canvas = document.getElementById("game");
var css = "button {cursor:pointer;}";
var options = {themeRoot: "../style/", themeGUI: "default"};
var guisystem = new CASTORGUI.GUIManager(canvas, css, options);
```
Then we create interfaces items. eg textures and dialog with text:

```javascript
var myFunction = function() { alert("Yes, this work!"); };
var guiTexture = new CASTORGUI.GUITexture("life", "data/image.png", {w:50,h:50,x:10,y:0}, guisystem, myFunction);

var optionsDialog = {w: (guisystem.getCanvasWidth().width - 20), h: 100, x: 8, y: (guisystem.getCanvasWidth().height - 110)};
var dialog = new CASTORGUI.GUIDialog("dialog", optionsDialog, guisystem);
dialog.setVisible(true);

var text = new CASTORGUI.GUIText("textDialog", {size:15, text:"Display text here"}, guisystem, false);
dialog.add(text);
```
That's it. Everything works the same way with the same simplicity.
