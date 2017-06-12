# 3.0.0:

### Major Updates
 - Added text alignment and word wrap to Text2D ([abow](https://github.com/abow))
 - Support of [Scale9Sprite](http://doc.babylonjs.com/overviews/Canvas2D_Sprite2D#scale9sprite-feature) feature in Sprite2D ([nockawa](https://github.com/nockawa))
 - Support of [AtlasPicture](http://doc.babylonjs.com/overviews/Canvas2D_AtlasPicture) to store many pictures into a bit one, with the possibility to create one/many Sprite2D out of it. ([nockawa](https://github.com/nockawa))
 - Support of BMFont with the BitmaptFontTexture class, Text2D has now a bitmapFontTexture setting in the constructor to display text using a BitmapFontTexture ([nockawa](https://github.com/nockawa))

### Minor Updates
 - WorldSpaceCanvas: TrackNode feature, a WSC can follow a Scene Node with an optional billboarding feature (always facing the camera)[Demo](http://babylonjs-playground.com/#1KYG17#1)
 - WorldSpaceCanvas: new setting unitScaleFactor to generated a bigger canvas than the world space mesh size. If you create a WSC with a size of 200;100 and a uSF of 3, the 3D Plane displaying the canvas will be 200;100 of scene units, the WSC will be 600;300 of pixels units.

### Bug Fixing
 - Fix Rotation issue when the Parent's Primitive hadn't a identity scale. ([nockawa](https://github.com/nockawa))
 - Primitive's position computed from TrackedNode are now hidden when the node is out of the Viewing Frustum ([nockawa](https://github.com/nockawa))
 - WorldSpaceCanvas: sideOrientation is finally working, you can try Mesh.DOUBLESIDE to make you Canvas visible on both sides. ([nockawa](https://github.com/nockawa))
