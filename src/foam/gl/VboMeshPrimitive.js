var VboMesh = require('./VboMesh'),
	PrimitiveScheme = require('./PrimitiveScheme');


function Cube(usage){
	VboMesh.apply(this,[usage,new VboMesh.Format(),24]);
	var scheme = PrimitiveScheme.Cube;
	this.setVertices(scheme.vertices);
	this.setNormals(scheme.normals);
	this.setTexcoords(scheme.texcoords);
	this.setColors(scheme.colors);
	this.setIndices(scheme.indices);
}

Cube.prototype = Object.create(VboMesh.prototype);
Cube.prototype.constructor = Cube;

var VboMeshPrimitive = {
	Cube : Cube
};

module.exports = VboMeshPrimitive;
