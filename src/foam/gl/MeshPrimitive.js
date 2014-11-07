var Mesh = require('./Mesh'),
	PrimitiveScheme = require('./PrimitiveScheme');

function Cube(){
	Mesh.apply(this,[new Mesh.Format(),24]);
	var scheme = PrimitiveScheme.Cube;
	this.setVertices(scheme.vertices);
	this.setNormals(scheme.normals);
	this.setTexcoords(scheme.texcoords);
	this.setColors(scheme.colors);

	this.indices = new Uint16Array(scheme.indices);
}

Cube.prototype = Object.create(Mesh.prototype);
Cube.prototype.constructor = Cube;


var MeshPrimitive = {
	Cube : Cube
};

module.exports = MeshPrimitive;