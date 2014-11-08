var ObjectUtil = require('../util/ObjectUtil');

var _gl = require('./gl');

var Mesh = require('./Mesh'),
	Vbo  = require('./Vbo');
var Program = require('./Program');

var Vec4 = require('../math/Vec4'),
	Vec3 = require('../math/Vec3'),
	Vec2 = require('../math/Vec2');

function VboMesh(usage,format,size){
	var obj = this._obj = new Mesh(format,size);//prevent super.prototype.call, slow...

	var gl = this._gl = obj._gl;
	this._glDraw  	  = obj._glDraw;
	this._glTrans 	  = obj._glTrans;

	this._usage = usage || gl.TRIANGLES;

	this._vbo = new Vbo(gl.ARRAY_BUFFER);
	this._ibo = null;

	this._vboUsage = gl.DYNAMIC_DRAW;
	this._iboUsage = gl.STATIC_DRAW;

	this._verticesDirty  = true;
	this._normalsDirty   = true;
	this._colorsDirty    = true;
	this._texcoordsDirty = true;
	this._indicesDirty   = false;

	this._offsetVertices = 0;
	this._offsetColors   = 0;
	this._offsetNormals  = 0;
	this._offsetTexcoords= 0;
}

VboMesh.Format = Mesh.Format;

VboMesh.prototype.setUsage = function(usage){
	this._usage = usage;
};


VboMesh.prototype.setDataUsage = function(usage){
	this._vboUsage = usage;
};

VboMesh.prototype.setIndexUsage = function(usage){
	this._iboUsage = usage;
};

VboMesh.prototype.updateVertexBuffer = function(){
	this._verticesDirty = true;
};

VboMesh.prototype.updateNormalBuffer = function(){
	this._normalsDirty = true;
};

VboMesh.prototype.updateColorBuffer = function(){
	this._colorsDirty = true;
};

VboMesh.prototype.updateTexcoordBuffer = function(){
	this._texcoordsDirty = true;
};

VboMesh.prototype.updateIndexBuffer = function(){
	this._indicesDirty = true;
};

//friend class glDraw

VboMesh.prototype.draw = function(length){
	this._glDraw.drawVboMesh(this,length);
};

VboMesh.prototype._updateVboSize = function(){
	var obj = this._obj,
		len = obj.vertices.byteLength + obj.normals.byteLength + obj.colors.byteLength + obj.texcoords.byteLength,
		vbo = this._vbo;

	if(len <= vbo.getSize()){
		return;
	}

	var gl = this._gl;
	var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
	var vboDiffers = !vbo.equalsGLObject(prevVbo);
	if(vboDiffers){
		vbo.bind();
	}

	vbo.bufferData(len,this._vboUsage);
	this._verticesDirty =
		this._normalsDirty =
			this._colorsDirty =
				this._texcoordsDirty = true;

	if(vboDiffers){
		gl.bindBuffer(gl.ARRAY_BUFFER,prevVbo);
	}
};

VboMesh.prototype._updateIboSize = function(){
	var obj = this._obj,
		len = obj.indices.byteLength,
		ibo = this._ibo;


	if(len <= ibo.getSize()){
		return;
	}

	var gl = this._gl;
	var prevIbo = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
	var iboDiffers = !ibo.equalsGLObject(prevIbo);
	if(iboDiffers){
		ibo.bind();
	}

	ibo.bufferData(len,this._iboUsage);
	this._indicesDirty = true;

	if(iboDiffers){
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,prevIbo);
	}
};


VboMesh.prototype.reserveSize = function(size){
	var obj = this._obj;

	obj.reserveSize(size);
	this._ibo = this._ibo || new Vbo(this._gl.ELEMENT_ARRAY_BUFFER);

	this._updateVboSize();
	this._updateIboSize();
};


VboMesh.prototype.setVertices = function(vertices){
	this._obj.setVertices(vertices);
	this._updateVboSize();
};

VboMesh.prototype.setVertex = function(index,vec){
	this._obj.setVertex(index,vec);
	this._verticesDirty = true;
};

VboMesh.prototype.setVertex3 = function(index,vec){
	this._obj.setVertex3(index,vec);
	this._verticesDirty = true;
};

VboMesh.prototype.setVertex3f = function(index,x,y,z){
	this._obj.setVertex3f(index,x,y,z);
	this._verticesDirty = true;
};

VboMesh.prototype.setVertex2 = function(index,vec){
	this._obj.setVertex2(index,vec);
	this._verticesDirty = true;
};

VboMesh.prototype.setVertex2f = function(index,x,y){
	this._obj.setVertex2f(index,x,y);
	this._verticesDirty = true;
};

VboMesh.prototype.setNormals = function(normals){
	this._obj.setNormals(normals);
	this._updateVboSize();
};

VboMesh.prototype.setNormal = function(index,normal){
	this._obj.setNormal(index,normal);
	this._normalsDirty = true;
};

VboMesh.prototype.setNormal3f = function(index,x,y,z){
	this._obj.setNormal3f(index,x,y,z);
	this._normalsDirty = true;
};

VboMesh.prototype.setColors = function(colors){
	this._obj.setColors(colors);
	this._updateVboSize();
};

VboMesh.prototype.setColor4f = function(index,r,g,b,a){
	this._obj.setColor4f(index,r,g,b,a);
	this._colorsDirty = true;
};

VboMesh.prototype.setColor3f = function(index,r,g,b){
	this._obj.setColor3f(index,r,g,b);
	this._colorsDirty = true;
};

VboMesh.prototype.setColor2f = function(index,k,a){
	this._obj.setColor2f(index,k,a);
	this._colorsDirty = true;
};

VboMesh.prototype.setColor1f = function(index,k){
	this._obj.setColor1f(index,k);
	this._colorsDirty = true;
};

VboMesh.prototype.setTexcoords = function(texcoords){
	this._obj.setTexcoords(texcoords);
	this._updateVboSize();
};

VboMesh.prototype.setIndices = function(indices){
	this._obj.indices = ObjectUtil.safeUint16Array(indices);
	this._ibo = this._ibo || new Vbo(this._gl.ELEMENT_ARRAY_BUFFER);
	this._updateIboSize();
};

VboMesh.prototype.reserveIndices = function(size){
	this._obj.reserveIndices(size);
	this._ibo = this._ibo || new Vbo(this._gl.ELEMENT_ARRAY_BUFFER);
	this._updateIboSize();
};

VboMesh.prototype.clear = function(){
	this._obj.clear();
	this._verticesDirty = this._colorsDirty = this._normalsDirty = this._texcoordsDirty = this._indicesDirty = true;
};

VboMesh.prototype.getBoundingBox = function(){
	return this._obj.getBoundingBox();
};

VboMesh.prototype.calculateNormals = function(){
	this._obj.caculateNormals();
	this._normalsDirty = true;
};

VboMesh.prototype.isDirty = function(){
	return this._verticesDirty ||
		this._normalsDirty ||
		this._colorsDirty ||
		this._texcoordsDirty ||
		this._indicesDirty;
};

VboMesh.prototype.getFormat = function(){
	return this._obj.getFormat();
};

VboMesh.prototype.hasVertices = function(){
	return this._obj.hasVertices();
};

VboMesh.prototype.hasColors = function(){
	return this._obj.hasColors();
};

VboMesh.prototype.hasTexcoords = function(){
	return this._obj.hasTexcoords();
};

VboMesh.prototype.hasIndices = function(){
	return this._obj.hasIndices();
};

VboMesh.prototype.getId = function(){
	return this._obj.getId();
};




module.exports = VboMesh;