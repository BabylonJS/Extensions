# 2.5.0:

### Updates
 - Performance metrics added ([nockawa](https://github.com/nockawa)) 
 - Text2D super sampling to enhance quality in World Space Canvas ([nockawa](https://github.com/nockawa)) 
 - World Space Canvas is now rendering in an adaptive way for its resolution to fit the on screen projected one to achieve a good rendering quality ([nockawa](https://github.com/nockawa)) 
 - Transparent Primitives are now drawn with Instanced Array when supported ([nockawa](https://github.com/nockawa)) 
 - New property in Canvas2D (instances) that contains all instances of canvas2d [Temechon](https://github.com/Temechon)

### Bug fixes
 - `WorldSpaceCanvas2D`:
	- Intersection/interaction now works on non squared canvas ([nockawa](https://github.com/nockawa)) 
 - Primitive:
	- `ZOrder` fixed in Primitives created inline ([nockawa](https://github.com/nockawa)) 
	- Z-Order is now correctly distributed along the whole canvas object graph ([nockawa](https://github.com/nockawa)) 
 - `Sprite2D`: 
	- texture size is now set by default as expected ([nockawa](https://github.com/nockawa)) 
	- can have no `id` set ([nockawa](https://github.com/nockawa)) 
 - `Text2D`: 
	- Fix bad rendering quality on Chrome ([nockawa](https://github.com/nockawa)) 
	- Rendering above transparent surface is now blending correctly ([nockawa](https://github.com/nockawa)) 

### Breaking changes
  - `WorldSpaceCanvas2D`:
	- WorldSpaceRenderScale is no longer supported (deprecated because of adaptive feature added). ([nockawa](https://github.com/nockawa)) 


