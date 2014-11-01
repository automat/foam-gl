var _gl = require('./gl');

function Vbo(target){
	this._gl     = _gl.get();
	this._obj    = this._gl.createBuffer();
	this._target = target;
}

Vbo.prototype.bind = function(){
	this._gl.bindBuffer(this._target,this._obj);
	return this;
};

Vbo.prototype.unbind = function(){
	this._gl.bindBuffer(this._target,null);
};

Vbo.prototype.delete = function(){
	this._gl.deleteBuffer(this._obj);
	this._obj = null;
};

Vbo.prototype.bufferSubData = function(offset,data){
	this._gl.bufferSubData(this._target,offset,data);
	return this;
};

Vbo.prototype.bufferData = function(sizeOrData,usage){
	this._gl.bufferData(this._target,sizeOrData,usage);
	return this;
};


module.exports = Vbo;