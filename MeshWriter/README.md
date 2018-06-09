# BabylonType

Generate letters in BABYLON meshes.

### Basic-Usage

	Type  = BABYLONTYPE(scene, scale, "HirukoPro-Book");
	text  = new Type( 
	            "ABC",
	            {
	                "anchor": "center",
	                "letter-height": 50,
	                "color": "#1C3870",
	                "font-family": "HelveticaNeue-Medium",
	                "position": {
	                    "z": 20
	                }
	            }
	       );

&#9679; See playground example:
https://www.babylonjs-playground.com/#XWVXN9#7

### Superconstructor - BABYLONTYPE()

After this module is loaded, BABYLONTYPE is defined as a global function.  It is called with one to three parameters.
- **Scene** &nbsp; required
- **Scale** &nbsp; optional, default 1
- **Default font** &nbsp; optional, default HelveticaNeue Medium

A call to BABYLONTYPE() returns a constructor.  Call it "**Type**".

### Constructor - new Type()

new Type() is called with a string and an (optional) options parameter.&nbsp; The options conform roughly to normal BabylonJS structures and terminology.

	      FIELD                 DEFAULT
	    font-family             default-font
	    anchor                  left
	    letter-height           100
	    letter-thickness        1
	    color                   #808080              # hits emissive, the only one i use
	    alpha                   1
	    position
	        x                   0
	        y                   0
	        z                   0
	    colors
	        diffuse             #F0F0F0
	        specular            #000000
	        ambient             #F0F0F0
	        emissive            color                # from option field 'color' above


**new Type()** builds a mesh with material that is inserted into the scene.&nbsp; This is a multi-step process with interim meshes and holes per letter.&nbsp;  These meshes are sucked into an SPS and then disposed.&nbsp; At the end, one mesh, one material and one SPS have been added to the scene.

**new Type()** also returns a type instance with useful methods.&nbsp; See below.

### Instance

Each Type instance has methods to allow one to retrieve the BabylonJS objects or to get/set attributes of the SPS.

	   getSPS
	   getMesh
	   getMaterial
	   getLetterCenter         # called with a number, the index of the letter in question
	                           # returns a Vector2, the letter center from the origin in 2 dimensions
	   color                   # sets or gets color but no change to material
	   alpha                   # sets or gets alpha but no change to material
	   setColor                # set emissive color and change color value
	   setAlpha                # change value and material
	   overrideOpac            # change material but not value
	   resetOpac               # sets material to current value
	   dispose                 # not implemented yet



I probably don't do colors or orientation the way you want but there are easy methods to get the mesh and material and change them as you see fit.

Only a few symbols are supported in two fonts.  If your string contains an unsupported symbol, NOTHING will render.
