# Cloner System
Babylon JS Cloner System (BCS)
 
<p>
	A Typescript based project for cloning and distributing Babylon meshes 
</p>
Definitions: 
<ul><li>
		Cloners: given one or several meshes, either clones or instances will distributed in a specific manner. If more than one mesh is provided, the meshes are distributed alternatively. Additionally, cloners can be nested, so it is possible to clone cloners. Each cloner can have several Effectors (in particular order) to influence the Scale/Position/Rotation parameter of a clone (or cloner). A sensitivity parameter controls this influence for a cloner. Following Objects are designated:
	</li>
	<li>
		RadialCloner: radial distribution where following parameters are recognized: input-meshlist, count, radius, offset, startangle, endangle, Effector-sensitivity for Position, Scale and Rotation, alignment-flag, orientation.
	</li>
	<li>
		LinearCloner: linear distribution where following parameters are recognized: input-meshlist, count, offset, growth, Effector-sensitivity for Position, Scale and Rotation. An interpolation-mode-flag&nbsp; determines, if the clone -parameters (Scale/Position/Rotation) are interpreted as "step" or "end"-values.
	</li>
	<li>
		MatrixCloner: distribution in 3D space where following parameters are recognized: input-meshlist, mcount, size.
	</li>
	<li>
		ObjectCloner: distribution over faces of a mesh where following parameters are recognized: input-meshlist, reference-mesh.
	</li>
	<li>
		RandomEffector: influences Scale/Position/Rotation of a clone with repeatable random values, controlled with an overall "strength" parameter. Not quite finished, but basically working.
	</li>
</ul><p>  
<h2>
	Demos
</h2>
<p>
	<a href="http://johann.langhofer.net/clonerjs/cbasic.html" rel="external nofollow noopener noreferrer" target="_blank">Cloner Basic Scene.</a>
</p>
<p>
	<a href="http://www.babylonjs-playground.com/#1NYYEQ%235" rel="external nofollow noopener noreferrer" target="_blank">ObjectCloner</a>
	</p>
	<p>
	<a href="http://www.babylonjs-playground.com/#1NYYEQ%236" rel="external nofollow noopener noreferrer" target="_blank">MatrixCloner</a>
	</p>
	<p>
	<a href="http://www.babylonjs-playground.com/#1NYYEQ%237" rel="external nofollow noopener noreferrer" target="_blank">RadialCloner combined with MatrixCloner</a>
	</p>
<h2>
	Getting started (coming soon)
</h2>

</p>


