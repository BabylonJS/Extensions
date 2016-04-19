#Shader Builder Requirement#
  1. BabylonJs all version 
  2. Eash.min.js
  3. Know About how work Shader 
  4. Mathematicals  
    1. Basic
    2. Vector 2D,3D and Matrix System <a   href="https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)">learn now</a>
    3. Mathematicals functions, special <a   href="https://en.wikipedia.org/wiki/Trigonometric_functions">Trigonometric functions</a> 
  5. WebGl <a  href="http://mew.cx/glsl_quickref.pdf">reference</a> 

#About Shader Builder#
  
  Eash Is collection of javascript functions ( and classes) for make easily webgl vertex shader and fragment shader. 
  
##Benefits. 
  
1. Do not work directly with text. 
                    
2. Can used your custom text anywhere you want.
                    
3. Don't need make shader language structer.
                    
4. Don't need make shader material in framework.
                    
5. Can have your output shader anytime you want.
                    
6. Can make all standard material with this .
                    
7. Some useful function let you mix the materials .
                    
8. Can make your custom function and use it always .
                    
9. Work with shader like javascript language.
                    
10. Short and understandable structure.
                    
                  
Anything in here is a solution for make easy way to solve a problem.
So when we look shader parts (fragment and vertex) we see Low-level programming language and that is hard to programming in this language with other high-level language (javascript in this case).
  
* why : shader is Low-level programming language. 
* what: define some structure and function to make easy and understandable.
* who : all babylonjs users. 
* when : anytime we need a matrial or postprocess we can use that.
* where : in Browsers can be support WebGl. 
                   
Author: https://github.com/NasimiAsl

Usage

1.Make a Shader Material
    
  <h3>[  mesh  ].material = new BABYLONX.ShaderBuilder()<br/>.[ source ]<br/>.BuildMaterial([ scene ]);<h3>
   [ source ] :  Some ShaderBuilder Methods

 sample :<a href='http://www.babylonjs-playground.com/#1TYWYB#1'> shaderMaterial demo </h5> </a>

2. Make PostProcess

   <h3>var postprocess1 = new BABYLONX.ShaderBuilder().[ source ].BuildPostProcess([ camera ],[ scene ],[ scale ],[ option ])<h3>
    [ source ] :  Some ShaderBuilder Methods
    [ scale ] : number between [ 0. .. 1. ] scale Postprocess Layer
    [ option ] : loot interface documentation : IPostProcess

   sample : <a href='http://www.babylonjs-playground.com/#1TYWYB#2'> <h5> postprocess demo </h5> </a>

3.Inner Fragment Shader Result

   <h3> BABYLONX.Helper()<br/>.[ source ]<br/>.Build()<h3>
    [  source   ] :  Some ShaderBuilder Methods

   sample : <a href='http://www.babylonjs-playground.com/#1TYWYB#2'> <h5> Fragment Shader result demo </h5> </a> <br>
   
   description : shader result is vec4 variable you most fill in code with shader language(c) or make it with ShaderBuilder Methods 
   

 

   

