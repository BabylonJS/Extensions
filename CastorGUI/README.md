# CastorGUI V2.0 (ECEMAScript 6)

Library to display a GUI game as a layer on top of the canvas HTML/CSS.

* [Demo online of this extension](http://www.babylon.actifgames.com/demoCastorGUI/)
* [Documentation](https://bitbucket.org/JSbabylon/castorgui/src/3f588b5473f34f58fe1b8d3a095d0ba78a278d99/doc/?at=master)

## Features:

Select or create themes.

Create GUI (element html5 and css3):
* texture
* text
* textLink
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
* systeme of database (localStorage and sessionStorage)

## Quick overview of use GUI

We must create a GUIManager that allows to recover the origin of the canvas and provides other basic thing.
A GUIManager can have a CSS that Formatted anything you want to customize your GUI.
You can also options to add a theme in the third parameter.

```javascript
let canvas = document.getElementById("game");
let css = "button {cursor:pointer;}";
let options = {themeRoot: "../style/", themeGUI: "default", pixel: false};
let guisystem = new GUIManager(canvas, css, options);
```
Then we create interfaces items. eg textures and dialog with text:

```javascript
let myFunction = function() { alert("Yes, this work!"); };
let guiTexture = new GUITexture("life", "data/image.png", {w:50,h:50,x:10,y:0}, guisystem, myFunction);

let optionsDialog = {w: (guisystem.getCanvasSize().width - 20), h: 100, x: 8, y: (guisystem.getCanvasSize().height - 110)};
let dialog = new GUIDialog("dialog", optionsDialog, guisystem);
dialog.setVisible(true);

let text = new GUIText("textDialog", {size:15, text:"Display text here"}, guisystem, false);
dialog.add(text);
```
That's it. Everything works the same way with the same simplicity.

Demo in the playground : http://www.babylonjs-playground.com/#S34THY#4

## For use Database

```javascript
let db = new DataBase(false); // true if use sessionStorage else use localStorage (stockage temporary)
db.addTable("user");// create table
db.createField("user", "member", {"pseudo":"dad72"});// create field

db.selectItem("user", "member", "pseudo");// return dad72
db.updateItem("user", "member", "pseudo", "Romeo"); // update pseudo
db.selectItem("user", "member", "pseudo");// return Romeo

//if delete table:
db.deleteTable("member");
// if delete database:
db.deleteDataBase();
```

Demo in the playground :  http://www.babylonjs-playground.com/#12NLGN#53
