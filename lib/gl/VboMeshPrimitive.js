var VboMesh = require('./VboMesh'),
	PrimitiveScheme = require('./PrimitiveScheme'),
	ObjectUtil = require('../util/ObjectUtil'),
	_gl = require('./gl');

function Plane(numH,numV,format,usage){
	var data = PrimitiveScheme.Plane.create(numH,numV);
	usage = ObjectUtil.isUndefined(usage) ?
			(data.indices ? _gl.get().TRIANGLES : _gl.get().TRIANGLE_STRIP) :
			usage;
	VboMesh.apply(this,[usage, format]);

	this.setVertices(data.vertices);
	this.setNormals(data.normals);
	this.setColors(data.colors);
	this.setTexcoords(data.texcoords);

	if(data.indices){
		this.setIndices(data.indices);
	}
}

Plane.prototype = Object.create(VboMesh.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.setSubDivisions = function(numH,numV){
	var data = PrimitiveScheme.Plane.create(numH,numV);
	this.setVertices(data.vertices);
	this.setNormals(data.normals);
	this.setColors(data.colors);
	this.setTexcoords(data.texcoords);

	if(data.indices){
		this.setIndices(data.indices);
	}
};

function Cube(usage){
	var scheme = PrimitiveScheme.Cube;
	VboMesh.apply(this,[usage,new VboMesh.Format(), scheme.vertices.length / 3]);
	this.setVertices(scheme.vertices);
	this.setNormals(scheme.normals);
	this.setTexcoords(scheme.texcoords);
	this.setColors(scheme.colors);
	this.setIndices(scheme.indices);
}

Cube.prototype = Object.create(VboMesh.prototype);
Cube.prototype.constructor = Cube;

var VboMeshPrimitive = {
	Plane : Plane,
	Cube : Cube
};

module.exports = VboMeshPrimitive;
