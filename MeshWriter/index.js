/*!
 * Babylon MeshWriter
 * https://github.com/BabylonJS/Babylon.js
 * (c) 2018-2019 Brian Todd Button
 * Released under the MIT license
 */

define(
  ['./fonts/hirukopro-book','./fonts/helveticaneue-medium','./fonts/comicsans-normal'],

  // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
  // This function loads the specific type-faces and returns the superconstructor
  // If BABYLON is loaded, it assigns the superconstructor to BABYLON.MeshWriter
  // Otherwise it assigns it to global variable 'BABYLONTYPE'

  function(HPB,HNM,CSN){

    var scene,FONTS,defaultColor,defaultOpac,naturalLetterHeight,curveSampleSize,Γ=Math.floor;

    FONTS                        = {};
    FONTS["HirukoPro-Book"]      = HPB;
    FONTS["HelveticaNeue-Medium"]= HNM;
    FONTS["Helvetica"]           = HNM;
    FONTS["Arial"]               = HNM;
    FONTS["sans-serif"]          = HNM;
    FONTS["Comic"]               = CSN;
    FONTS["comic"]               = CSN;
    FONTS["ComicSans"]           = CSN;
    defaultColor                 = "#808080";
    defaultOpac                  = 1;
    curveSampleSize              = 6;
    naturalLetterHeight          = 1000; 

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    //  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR 
    // Parameters:
    //   ~ scene
    //   ~ preferences

    var Wrapper                  = function(){

      var proto,defaultFont,scale,meshOrigin,preferences;

      scene                      = arguments[0];
      preferences                = makePreferences(arguments);

      defaultFont                = NNO(FONTS[preferences.defaultFont]) ? preferences.defaultFont : "HelveticaNeue-Medium";
      meshOrigin                 = preferences.meshOrigin==="fontOrigin" ? preferences.meshOrigin : "letterCenter";
      scale                      = tyN(preferences.scale)?preferences.scale:1;

      // Thanks Gijs, wherever you are
      BABYLON.Path2.prototype.addCurveTo = function(redX, redY, blueX, blueY){
        var points               = this.getPoints();
        var lastPoint            = points[points.length - 1];
        var origin               = new BABYLON.Vector3(lastPoint.x, lastPoint.y, 0);
        var control              = new BABYLON.Vector3(redX, redY, 0);
        var destination          = new BABYLON.Vector3(blueX, blueY, 0);
        var nb_of_points         = curveSampleSize;
        var curve                = BABYLON.Curve3.CreateQuadraticBezier(origin, control, destination, nb_of_points);
        var curvePoints          = curve.getPoints();
        for(var i=1; i<curvePoints.length; i++){
          this.addLineTo(curvePoints[i].x, curvePoints[i].y);
        }
      };

      // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
      //  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR
      // Called with 'new'
      // Parameters:
      //   ~ letters
      //   ~ options

      function Type(lttrs,opt){
        var options              = NNO(opt) ? opt : { } ,
            position             = setOption("position", NNO, {}),
            colors               = setOption("colors", NNO, {}),
            fontFamily           = setOption("font-family", supportedFont, defaultFont),
            anchor               = setOption("anchor", supportedAnchor, "left"),
            rawheight            = setOption("letter-height", PN, 100),
            rawThickness         = setOption("letter-thickness", PN, 1),
            basicColor           = setOption("color", NES, defaultColor),
            opac                 = setOption("alpha", Amp, defaultOpac),
            y                    = setPositn("y", tyN, 0),
            x                    = setPositn("x", tyN, 0),
            z                    = setPositn("z", tyN, 0),
            diffuse              = setColor("diffuse", NES, "#F0F0F0"),
            specular             = setColor("specular", NES, "#000000"),
            ambient              = setColor("ambient", NES, "#F0F0F0"),
            emissive             = setColor("emissive", NES, basicColor),
            fontSpec             = FONTS[fontFamily],
            letterScale          = round(scale*rawheight/naturalLetterHeight),
            thickness            = round(scale*rawThickness),
            letters              = NES(lttrs) ? lttrs : "" ,
            material             = makeMaterial(scene, letters, emissive, ambient, specular, diffuse, opac),
            meshesAndBoxes       = constructLetterPolygons(letters, fontSpec, 0, 0, 0, letterScale, thickness, material, meshOrigin),
            offsetX              = anchor==="right" ? (0-meshesAndBoxes.xWidth) : ( anchor==="center" ? (0-meshesAndBoxes.xWidth/2) : 0 ),
            meshes               = meshesAndBoxes[0],

            letterBoxes          = meshes.letterBoxes,
            combo                = makeSPS(scene, meshesAndBoxes, material),
            sps                  = combo[0],
            mesh                 = combo[1];

        mesh.position.x          = scale*x+offsetX;
        mesh.position.y          = scale*y;
        mesh.position.z          = scale*z;

        this.getSPS              = function()  {return sps};
        this.getMesh             = function()  {return mesh};
        this.getMaterial         = function()  {return material};
        this.getOffsetX          = function()  {return offsetX};
        this.getLetterBoxes      = function()  {return letterBoxes};
        this.color               = function(c) {return NES(c)?color=c:color};
        this.alpha               = function(o) {return Amp(o)?opac=o:opac};

        function setOption(field, tst, defalt) { return tst(options[field]) ? options[field] : defalt };
        function setColor(field, tst, defalt)  { return tst(colors[field]) ? colors[field] : defalt };
        function setPositn(field, tst, defalt) { return tst(position[field]) ? position[field] : defalt }
      };

      proto                      = Type.prototype;

      proto.setColor             = function(color){
        var material             = this.getMaterial();
        if(NES(color)){
          material.emissiveColor = rgb2Bcolor3(this.color(color));
        }
      };
      proto.setAlpha             = function(alpha){
        var material             = this.getMaterial();
        if(Amp(alpha)){
          material.alpha         = this.alpha(alpha)
        }
      };
      proto.overrideAlpha        = function(alpha){
        var material             = this.getMaterial();
        if(Amp(alpha)){
          material.alpha         = alpha
        }
      };
      proto.resetAlpha           = function(){
        var material             = this.getMaterial();
        material.alpha           = this.alpha()
      };
      proto.getLetterCenter      = function(ix){
        return new BABYLON.Vector2(0,0)
      }
      proto.dispose              = function(){
        if(NNO(this.getMesh())){this.getMesh().dispose()}
      };

      return Type;

    };
    window.TYPE                  = Wrapper;
    if ( typeof BABYLON === "object" ) { BABYLON.MeshWriter = Wrapper }
    return Wrapper;

    function makeSPS(scene,meshesAndBoxes,material){
      var meshes                 = meshesAndBoxes[0],
          lettersOrigins         = meshesAndBoxes[2],sps,spsMesh;
      if(meshes.length){
        sps                      = new BABYLON.SolidParticleSystem("sps"+"test",scene, { } );
        meshes.forEach(function(mesh,ix){
          sps.addShape(mesh, 1, {positionFunction: makePositionParticle(lettersOrigins[ix])});
          mesh.dispose()
        });
        spsMesh                  = sps.buildMesh();
        spsMesh.material         = material;
        sps.setParticles()
      }
      return [sps,spsMesh];

      function makePositionParticle(letterOrigins){
        return function positionParticle(particle,ix,s){
          particle.position.x    = letterOrigins[0]+letterOrigins[1];
          particle.position.z    = letterOrigins[2]
        }
      }
    };

    function constructLetterPolygons(letters, fontSpec, xOffset, yOffset, zOffset, letterScale, thickness, material, meshOrigin){
      var letterOffsetX          = 0,
          lettersOrigins         = new Array(letters.length),
          lettersBoxes           = new Array(letters.length),
          lettersMeshes          = new Array(letters.length),
          ix                     = 0,letter,letterSpec,i,j,lists,shapesList,holesList,shape,holes,csgShape,letterMesh,letterMeshes,letterBoxes,letterOrigins,meshesAndBoxes;

      for(i=0;i<letters.length;i++){
        letter                   = letters[i];
        letterSpec               = fontSpec[letter];
        if(NNO(letterSpec)){
          lists                  = buildLetterMeshes(letter, i, letterSpec);
          shapesList             = lists[0];
          holesList              = lists[1];
          letterMeshes           = [];
          for(j=0;j<shapesList.length;j++){
            shape                = shapesList[j];
            holes                = holesList[j];
            if(NEA(holes)){
              letterMesh         = punchHolesInShape(shape, holes, letter, i)
            }else{
              letterMesh         = shape
            }
            letterMeshes.push(letterMesh);
          }
          if(letterMeshes.length){
            lettersMeshes[ix]    = merge(letterMeshes);
            lettersOrigins[ix]   = letterOrigins;
            lettersBoxes[ix]     = letterBoxes;
            ix++
          }
        }
      };
      meshesAndBoxes             = [lettersMeshes,lettersBoxes,lettersOrigins];
      meshesAndBoxes.xWidth      = round(letterOffsetX);
      meshesAndBoxes.count       = ix;
      return meshesAndBoxes;

      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      // A letter may have one or more shapes and zero or more holes
      // The shapeCmds is an array of shapes
      // The holeCmds is an array of array of holes (since one shape 'B' may have multiple holes)
      // The arrays must line up so holes have the same index as the shape they subtract from
      // '%' is the best example since it has three shapes and two holes
      // 
      // For mystifying reasons, the holeCmds (provided by the font) must be reversed
      // from the original order and the shapeCmds must *not* be reversed
      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

      function buildLetterMeshes(letter,index,spec){
        var balanced             = meshOrigin === "letterCenter",
            centerX              = (spec.xMin+spec.xMax)/2,
            centerZ              = (spec.yMin+spec.yMax)/2,
            offX                 = xOffset-(balanced?centerX:0),
            offZ                 = zOffset-(balanced?centerZ:0),
            shapeCmdsLists       = tyA(spec.shapeCmds) ? spec.shapeCmds : [],
            holeCmdsListsArray   = tyA(spec.holeCmds) ? spec.holeCmds : [];

        letterBoxes              = [ adjustX(spec.xMin), adjustX(spec.xMax), adjustZ(spec.yMin), adjustZ(spec.yMax) ];
        letterOrigins            = [ round(letterOffsetX), -1*adjustX(0), -1*adjustZ(0) ];
        letterOffsetX            = letterOffsetX+spec.width*letterScale;

        return [shapeCmdsLists.map(meshFromCmdsList),holeCmdsListsArray.map(meshesFromCmdsListArray)];

        function meshesFromCmdsListArray(cmdsListArray){
          return cmdsListArray.map(function(d){return meshFromCmdsList(d,true)})
        };
        function meshFromCmdsList(cmdsList,noReverse){
          var path               = new BABYLON.Path2(adjustX(cmdsList[0][0]), adjustZ(cmdsList[0][1])), cmd, array, meshBuilder, mesh, j;

          for(j=1;j<cmdsList.length;j++){
            cmd                  = cmdsList[j];
            if(cmd.length===2){ path.addLineTo(adjustX(cmd[0]), adjustZ(cmd[1])) }
            if(cmd.length===4){ path.addCurveTo(adjustX(cmd[0]), adjustZ(cmd[1]), adjustX(cmd[2]), adjustZ(cmd[3])) }
          }
          array                  = path.getPoints().map(point2Vector);
          if(noReverse!==true){array.reverse()}
          meshBuilder            = new BABYLON.PolygonMeshBuilder("Type-"+letter+index+"-"+weeid(), array, scene);
          mesh                   = meshBuilder.build(true,thickness);
          return mesh;
        };
        function adjustX(xVal){return round(letterScale*(xVal+offX))};
        function adjustZ(zVal){return round(letterScale*(zVal+offZ))}
      };

      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      function punchHolesInShape(shape,holes,letter,i){
        var csgShape             = BABYLON.CSG.FromMesh(shape);
        for(var k=0; k<holes.length; k++){
          csgShape               = csgShape.subtract(BABYLON.CSG.FromMesh(holes[k]))
        }
        holes.forEach(function(h){h.dispose()});
        shape.dispose();
        return csgShape.toMesh("Net-"+letter+i+"-"+weeid())
      };
    };

    function makeMaterial(scene,letters,emissive,ambient,specular,diffuse,opac){
      var cm0                    = new BABYLON.StandardMaterial("type-material-"+letters+"-"+weeid(),scene);
      cm0.diffuseColor           = rgb2Bcolor3(diffuse);
      cm0.specularColor          = rgb2Bcolor3(specular);
      cm0.ambientColor           = rgb2Bcolor3(ambient);
      cm0.emissiveColor          = rgb2Bcolor3(emissive);
      cm0.alpha                  = opac;
      return cm0
    };

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    // Conversion functions
    function rgb2Bcolor3(rgb){
      rgb                        = rgb.replace("#","");
      return new BABYLON.Color3(convert(rgb.substring(0,2)),convert(rgb.substring(2,4)),convert(rgb.substring(4,6)));
      function convert(x){return Γ(1000*Math.max(0,Math.min((tyN(parseInt(x,16))?parseInt(x,16):0)/255,1)))/1000}
    };
    function point2Vector(point){
      return new BABYLON.Vector2(round(point.x),round(point.y))
    };
    function merge(arrayOfMeshes){
      return arrayOfMeshes.length===1 ? arrayOfMeshes[0] : BABYLON.Mesh.MergeMeshes(arrayOfMeshes, true)
    };
    function makePreferences(args){
      return NNO(args[1]) ? args[1] : { defaultFont: args[2] , scale: args[1] }
    };

    // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
    // Boolean test functions
    function PN(mn)   { return typeof mn === "number" && !isNaN(mn) ? 0 < mn : false } ;
    function tyN(mn)  { return typeof mn === "number" } ;
    function Amp(ma)  { return typeof ma === "number" && !isNaN(ma) ? 0 <= ma && ma <= 1 : false } ;
    function NNO(mo)  { return mo != null && typeof mo === "object" || typeof mo === "function" } ;
    function tyA(ma)  { return ma != null && typeof ma === "object" && ma.constructor === Array } ; 
    function NEA(ma)  { return ma != null && typeof ma === "object" && ma.constructor === Array && 0 < ma.length } ; 
    function NES(ms)  {if(typeof(ms)=="string"){return(ms.length>0)}else{return(false)}} ;
    function supportedFont(ff){ return NNO(FONTS[ff]) } ;
    function supportedAnchor(a){ return a==="left"||a==="right"||a==="center" } ;
    function weeid()  { return Math.floor(Math.random()*1000000) } ;
    function round(n) { return Γ(0.3+n*1000000)/1000000 }
  }
);
