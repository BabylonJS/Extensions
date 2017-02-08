
The BabylonJS - ASP.NET Static Scene File Module is a static file handler for .babylon scene files. 
It supports serving pre-compressed babylon scene files to reduce network bandwith performance for large
scene files with detailed geometry, large skeletions and lots of animations. 

To install, simply copy 'HttpBabylon.dll' to your ASP.NET (4.5 or Higher) Web Application 'bin' folder.

=======================================================
Note: You must enable manage pipeline for all request
=======================================================

<system.webServer>
  <modules runAllManagedModulesForAllRequests="true" />
</system.webServer>
