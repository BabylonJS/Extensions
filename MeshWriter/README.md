# Mesh Writer

Generate letters in BABYLON meshes.

## Javascript Calls And Parameters

### Basic Usage

	Writer = BABYLON.MeshWriter(scene, {scale:scale});
	text1  = new Writer( 
	                "ABC",
	                {
	                    "anchor": "center",
	                    "letter-height": 50,
	                    "color": "#1C3870",
	                    "position": {
	                        "z": 20
	                    }
	                }
	            );

&#9679; See playground example:
https://www.babylonjs-playground.com/#PL752W#22

### Superconstructor - BABYLON.MeshWriter()

After this module is loaded, BABYLON.MeshWriter is defined.  It is called with one or two parameters.
- **scene** &nbsp; required
- **preferences** &nbsp; optional &nbsp; The preferences object may specify up to three values

	      FIELD                 DEFAULT
	    default-font           Helvetica
	    scale                      1
	    letter-origin         "letter-center"

The call to BABYLON.MeshWriter returns a constructor.  Call it "**Writer**".

### Constructor - new Writer()

new Writer() is called with a string and an (optional) options parameter.&nbsp; The options object conforms to normal BabylonJS structures and terminology.

	      FIELD                 DEFAULT
	    font-family             default-font
	    anchor                  left
	    letter-height           100
	    letter-thickness        1
	    color                   #808080              # hits emissive only
	    alpha                   1
	    position
	        x                   0
	        y                   0
	        z                   0
	    colors                                       # if you need to control more than just emissive
	        diffuse             #F0F0F0
	        specular            #000000
	        ambient             #F0F0F0
	        emissive            color                # from option field 'color' above


**new Writer()** builds a mesh with material that is inserted into the scene.&nbsp; This is a multi-step process with interim meshes and holes per letter.&nbsp;  These meshes are sucked into an SPS and then disposed.&nbsp; At the end, one mesh, one material and one SPS have been added to the scene.

**new Writer()** also returns a **writer** instance with useful methods.&nbsp; See below.

### Instance

Each **writer** instance has methods to allow one to retrieve the BabylonJS objects or to get/set attributes of the SPS.

	   getSPS
	   getMesh
	   getMaterial
	   color                   # sets or gets color but no change to material
	   alpha                   # sets or gets alpha but no change to material
	   setColor                # set emissive color and change color value
	   setAlpha                # change value and material
	   overrideOpac            # change material but not value
	   resetOpac               # sets material to current value
	   dispose                 

### Usage Hints

If you wish to do extensive things with position, rotation or animation, retrieve the meshes and materials from the instance using the methods shown above.&nbsp; The output from **new Writer()** is an SPS with one particle for each character.

Colors:&nbsp; With most lighting, it is enough just to use the "color" field to specify the letter coloring.&nbsp; However, programmers may specify all four color types by putting a "colors" object in the options object.


### Fonts

There are four font families available, 'Helvetica', 'HirukoPro-Book', 'Jura', 'Comic' and 'WebGL-Dings.&nbsp;
The default font, Helvetica, is probably the one you want.&nbsp;
If it is, no font family need be specified.&nbsp;
Also, Helvetica, has the most extensive characters and the fewest faces; it will be the most efficient if you have a lot of text.&nbsp;
Jura was added because the author likes it for numbers.

**Important:** Comic and Web-Dings are really just placeholders as of this writing, with only a few glyphs.

**And:** Unless you are a font master, Helvetica and Arial are synonymous.


## Loading MeshWriter

Both meshwriter.js and meshwriter.min.js are all-inclusive and should be loadable in any of the normal ways (e.g. AMD).&nbsp;
BABYLON should be loaded first.&nbsp;
If BABYLON is already loaded, then MeshWriter will attach itself to BABYLON, allowing this call.

	Writer = BABYLON.MeshWriter(scene, {scale:scale});

Otherwise MeshWriter will attach to window.

