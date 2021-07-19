# MeshWriter

Generate letters in BABYLON meshes.

## Javascript Calls And Parameters

### Usage Summary

	Writer    = BABYLON.MeshWriter(scene, {scale:scale});       // Returns re-usable constructor
	text1     = new Writer(                                     // Inserts text into scene, per options
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
	textMesh  = text1.getMesh()                                 // Returns a regular BABYLON mesh, which can
	                                                            // be manipulated using standard methods

&#9679; Helvetica Neue playground example:&nbsp;  https://www.babylonjs-playground.com/#PL752W#384  
&#9679; Comic playground example:&nbsp;  https://www.babylonjs-playground.com/#PL752W#385  

### Superconstructor - BABYLON.MeshWriter()

After MeshWriter is loaded (see below), BABYLON.MeshWriter is defined.  It is called with one or two parameters.  
&#9679; **scene** &nbsp; required  
&#9679; **preferences** &nbsp; optional &nbsp; The preferences object may specify up to four values

	      FIELD                 DEFAULT
	    default-font           Helvetica
	    scale                      1
	    letter-origin         "letter-center"
	    methods           (See section at bottom)

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


### Font Families and Supported Glyphs

There are four font families available, 'Helvetica', 'HirukoPro-Book', 'Jura' and 'Comic'.&nbsp;
The default font, Helvetica, is probably the one you want.&nbsp;
If it is, no font family need be specified.&nbsp;
Also, Helvetica, has the most extensive characters and the fewest faces; it will be the most efficient if you have a lot of text.&nbsp;

	Helvetica
	"0","1","2","3","4","5","6","7","8","9",
	"a","á","à","ä","â","å","æ","b","c","ç","č","d","e","é","è","ë","ê","f","g",
	"h","i","ı","í","ì","ï","î","j","k","l","m","n","ñ","ń","o","ô","ò","ó","ö",
	"p","q","r","s","t","u","ú","ù","ü","û","v","w","x","y","ÿ","z",
	"A","Á","À","Ã","Â","Ä","Å","Æ","B","C","D","E","É","È","Ê","Ë","F","G","H","I","J","K","L","M",
	"N","Ñ","O","Ó","Ò","Ô","Ö","Õ","P","Q","R","S","T","U","Ú","Ù","Û","Ü","V","W","X","Y","Z",
	"¡","!","|",'"',"'","#","$","%","&","{","}","(",")","*","+",",","-",".",
	"/",":",";","<","=",">","¿","?","@","[","]","^","_"," "

	Comic
	"0","1","2","3","4","5","6","7","8","9",
	"a","á","à","ä","â","å","æ","b","c","ç","d","e","é","è","ë","ê","f","g",
	"h","i","ı","í","ì","ï","î","j","k","l","m","n","ñ","o","ô","ò","ó","ö",
	"p","q","r","s","t","u","ú","ù","ü","û","v","w","x","y","z",
	"A","Á","À","Ä","Â","Å","Æ","B","C","Ç","D","E","É","È","Ê","Ë","F","G","H","I",
	"J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"¡","!","|",'"',"'","#","$","%","&","(",")","*","+",",","-",".",
	"/",":",";","<","=",">","¿","?","@","[","]","{","}","^","_"," "

	Jura
	"0","1","2","3","4","5","6","7","8","9",
	"a","b","c","d","e","f","g","h","i","j","k","l","m",
	"n","o","p","q","r","s","t","u","v","w","x","y","z",
	"A","B","C","D","E","F","G","H","I","J","K","L","M",
	"N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"!","|",'"',"'","#","$","%","&","(",")","*","+",",",
	"-",".","/",":",";","<","=",">","?","@","[","]","^","_"," "

	HirukoPro
	"0","1","2","3","4","5","6","7","8","9",
	"A","B","C","D","E","F","G","H","I","J","K","L","M",
	"N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"a","b","c","d","e","f","g","h","i","j","k","l","m",
	"n","o","p","q","r","s","t","u","v","w","x","y","z",
	"%","#","$","&","?","!","|","(",")","-","_","=","+",",","."," "

As of last viewing, the total "meshwriter.min.js" file was under 120K.

**And:** Unless you are a font master, Helvetica and Arial are synonymous.


## Loading MeshWriter

Both meshwriter.js and meshwriter.min.js are all-inclusive and should be loadable in any of the normal ways (e.g. AMD); see below for some examples.&nbsp;
BABYLON should be loaded first.&nbsp;
In Node, MeshWriter will become a global variable.&nbsp;
In a browser, MeshWriter will become a global variable 'TYPE'.&nbsp;
(Inherited naming convention, sorry.)&nbsp;
If BABYLON is already loaded, then MeshWriter will also attach itself to BABYLON, allowing this call.&nbsp;

	Writer = BABYLON.MeshWriter(scene, {scale:scale});

### Loading The File In BABYLON Playground

Use jQuery

	const typeURL   = "https://host/path/meshwriter.min.js";  

	// These lines load the module, if not already loaded, and then call write
	if ( typeof TYPE === "undefined" ) {
		jQuery.getScript(typeURL).then(write)
	} else {
		write()
	}
	# use BABYLON.MeshWriter

### In Production

HTML tag

	<script type="text/javascript" src="path/meshwriter.min.js"></script>
	<!-- use BABYLON.MeshWriter or window.TYPE or window.MeshWriter -->

### In NodeJS

	Wrapper   = require("meshwriter");
	Writer    = Wrapper.MeshWriter(scene, {scale:scale});

### Earcut

Earcut is a simple, stable and small utility that is needed by BABYLON.PolygonMeshBuilder, which MeshWriter calls.&nbsp;
As of version **1.2.0** (December 2019) Earcut is included in meshwriter.min.js.&nbsp;
There is no need to load Earcut for MeshWriter.

## Custom font packages

MeshWriter comes with only a few fonts.&nbsp;
Industrious folk with specific requirements can create a MeshWriter package with their own fonts.&nbsp;
Think of this as two steps.

1) Converting standard font files (.ttf or .otf) to MeshWriter font files, and
2) Creating your own minified build of MeshWriter with your chosen fonts.

MeshWriter-Font (https://github.com/briantbutton/meshwriter-font) addresses the first step.&nbsp;
It will convert most common font files into MeshWriter compatible font files.&nbsp;

For the second step, refer to the README in this repo in the 'fonts' directory.&nbsp;
It will help you create a build with your custom fonts (i.e. a new meshwriter.min.js).

## Methods &mdash; optimizing memory

Until August 2021, MeshWriter required &apos;BABYLON&apos; to be in the global address space.&nbsp;
MeshWriter would reference this object to retrieve methods like &apos;Color3&apos; and &apos;StandardMaterial&apos;.&nbsp;

In 1.3.0, the optional parameter &apos;methods&apos; was added.&nbsp; 
If present, MeshWriter will refer to it for these methods, and will not look for &apos;BABYLON&apos;.&nbsp; 
This will be handy for systems that wish to load BABYLON functions modularly.&nbsp;
All the methods listed below must be present on the &apos;methods&apos; object or MeshWriter will complain vigorously.

	Methods
	"Vector2", "Vector3", "Path2", "Curve3", "Color3",
	"SolidParticleSystem", "PolygonMeshBuilder", "CSG",
	"StandardMaterial", "Mesh"

This playground puts BABYLON in the &apos;methods&apos; parameter to show you the syntax.&nbsp;
https://www.babylonjs-playground.com/#PL752W#384