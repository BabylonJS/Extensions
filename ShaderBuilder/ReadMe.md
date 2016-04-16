 <h1 >Shader Builder Requirement</h1>
  1. BabylonJs all version 
  2. Eash.min.js
  3. Know About how work Shader 
  
  // You Can Be Perfesional in Eash if You Know :</div>
  4. Mathematicals  
    a. Basic
    b. Vector 2D,3D and Matrix System <a   href="https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)">learn now</a>
    c. Mathematicals functions, special <a   href="https://en.wikipedia.org/wiki/Trigonometric_functions">Trigonometric functions</a> 
  5. WebGl <a  href="http://mew.cx/glsl_quickref.pdf">reference</a> 

  <h1 >About Shader Builder </h1> 
  
  Eash Is collection of javascript functions ( and classes) for make easily webgl vertex shader and fragment shader. 
  
      
      
  Benefits. 
  
                    a. do not work directly with text. 
                    
                    b. can used your custom text anywhere you want.
                    
                    c. don't need make shader language structer.
                    
                    d. don't need make shader material in framework.
                    
                    e. can have your output shader anytime you want.
                    
                    f. can make all standard material with this .
                    
                    g. some useful function let you mix the materials .
                    
                    h. can make your custom function and use it always .
                    
                    i. work with shader like javascript language.
                    
                    j. short and undrastandable structure.
                    
                  

 anything in here is a solution for make easy way to solve a problem.
  so when we look shader parts (fragment and vertex) we see Low-level programming language and that is hard to programming in this language with other high-level language (javascript in this case).
  
                        why : shader is Low-level programming language. 
                     
                        what: define some structure and function to make easy and understandable .
                        
                        who : all babylonjs users . 
                        
                        when : anytime we need a matrial or postprocess we can use that.
                        
                        where : in Browsers can be support WebGl. 
                        
 <h1>Usage And Documantation</h1>
 

  
 1. <h5  >BABYLON.ShaderBuilder.InitializeEngine();</h5> 

 
 2. <h5>new BABYLON.ShaderBuilder()</h5>
 
 sample :
 
 mesh.material =    new BABYLON.ShaderBuilder() 
  <a href="#Solid"> Solid Color <a><br/>           
  .Solid()       
  <a href="#BuildMaterial"> Build shader Material <a><br/>  
 	.BuildMaterial(scene);                  
 
 <a href="http://www.babylonjs-playground.com/#13MIIE#8" >demo</a>
 
 3. solid color
 <h4 id="Solid">Solid({ r: [0..1] , g:[0..1], b:[0..1] , a:[0..1]} )</h4> 

 4. string material  ( vec4 string material mode )
 <h4 id="StringMaterial">StringMaterial</h4> 
 in Shader Builder struct we have global variable 'result'
this define in begining vertex material and fragment material
when we talk about string material in all shader builder around we use this variable for last setup too  

 <a href="http://www.babylonjs-playground.com/#13MIIE#11" >demo</a>
 
 
 4. transparent material (alpha enable mode)
 <h4 id="Transparency">Transparency()</h4> 
 <a href="http://www.babylonjs-playground.com/#13MIIE#9" >demo</a>
 
 4. wired material (wire enable mode)
 <h4 id="Wired">Wired()</h4> 
 <a href="http://www.babylonjs-playground.com/#13MIIE#10" >demo</a>
  
 4. back material (back side)
 <h4 id="Back">Back(mat : <a href="#StringMaterial">string</a>)</h4> 
 <a href="http://www.babylonjs-playground.com/#13MIIE#11" >demo</a>
 
 4. front material (front side)
 <h4 id="Front">Front(mat : <a href="#StringMaterial">string</a>)</h4> 
by defauly all your line material used in Front side witout back material 
but you can manage too with this method like this sample we discard front face and watch only back face
 <a href="http://www.babylonjs-playground.com/#13MIIE#11" >demo</a>
 
<h4 id="Light"> 4. light()</h4>
 Light({ <br/>
        direction: string,  'vec3(1.) or camera  or ...'<br/>
        color: IColor, {r,g,b,a }<br/>

        darkColorMode: boolean, light do not set dark colors you can set darks with this <br/> 
        
        specular: any, 'float value' you can manage that for make specular map <br/>
        specularPower: number, control power of specular <br/>
        specularLevel: number, control area of specular <br/>
        
        phonge: any, 'float value' you can manage that for make phonge map <br/>
        phongePower: number,  control power of phonge <br/>
        phongeLevel: number, control area of phonge <br/>
      
        normal: string,  'vec3(1.) or nrm  or ...  normalMap() ' or  BABYLON.Normals <br/>
 
        supplement: boolean,<br/>
        
        parallel: boolean, make phonge like parallel rays ( sun simulation)<br/>

})  
 <a href="http://www.babylonjs-playground.com/#13MIIE#12" >demo light</a><br>
 <a href="http://www.babylonjs-playground.com/#13MIIE#13" >demo dark</a><br>
 <a href="http://www.babylonjs-playground.com/#13MIIE#14" >demo fresnel</a><br>
 <a href="http://www.babylonjs-playground.com/#13MIIE#15" >demo specularMap</a><br>
 
in Progress ...
 

 
