  new BABYLON.ShaderBuilder()
  
      .Solid({a:0.})
      
      .Reflect({ path: '/images/cube/w.jpg' , bias:0., equirectangular:true },1.)
      
      .Effect({ pr: 'length(vec3(px,py,pz)) ' })
      
      .Effect({ pr: 'pow(pr,3.)*13.' })
      
      .Light({ normal: 'nrm', color: { r: 1., g: 1., b: 1., a: 1. }, supplement: true, direction: 'camera', phonge: '63' })
      
      .Light({ normal: 'nrm', color: { r: 1., g: 1., b: 1., a: 1. } ,  phonge: '1' })
      
      .Light({ normal: 'nrm', color: { r: 0., g: 0., b: 0., a: 1. }, supplement: true, direction: 'camera', darkColorMode: true, phonge: '153' })
      
      .Transparency()
      
      .BuildMaterial(scene); 
 
 
