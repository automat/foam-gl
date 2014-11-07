var ObjectUtil = require('../util/ObjectUtil'),
	_gl 	   = require('./gl');

/**
 * Buffer object representation
 * @param {Number} [target=gl.ARRAY_BUFFER] - Target buffer, gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER
 * @param {Number|ArrayBufferView} [sizeOrData=null] - Size or data
 * @param {Number} [usage=gl.STATIC_DRAW] - gl.STREAM_DRAW, gl.STATIC_DRAW, gl.DYNAMIC_DRAW
 * @constructor
 */

function Vbo(target,sizeOrData,usage){
	var gl = this._gl = _gl.get();

	this._obj    = gl.createBuffer();
	this._target = target || gl.ARRAY_BUFFER;

	if(!ObjectUtil.isUndefined(sizeOrData)){
		gl.bufferData(target,sizeOrData,usage || gl.STATIC_DRAW);
	}
}

/**
 * Binds the buffer.
 * @returns {Vbo}
 */

Vbo.prototype.bind = function(){
	this._gl.bindBuffer(this._target,this._obj);
	return this;
};

/**
 * Unbinds the buffer.
 */

Vbo.prototype.unbind = function(){
	this._gl.bindBuffer(this._target,null);
};

/**
 * Deletes the buffer.
 */

Vbo.prototype.delete = function(){
	this._gl.deleteBuffer(this._obj);
	this._obj = null;
};


/**
 * Modifies or sets some of the buffers data.
 * @param {Number} offset - Data offset bytelength
 * @param {ArrayBufferView} data - Data to be set.
 * @returns {Vbo}
 */

Vbo.prototype.bufferSubData = function(offset,data){
	this._gl.bufferSubData(this._target,offset,data);
	return this;
};

/**
 * Initializes the buffer.
 * @param {Number|ArrayBufferView} sizeOrData - Size or data
 * @param {Number} usage - gl.STREAM_DRAW, gl.STATIC_DRAW, gl.DYNAMIC_DRAW
 * @returns {Vbo}
 */

Vbo.prototype.bufferData = function(sizeOrData,usage){
	this._gl.bufferData(this._target,sizeOrData,usage);
	return this;
};

/**
 * Returns true if the underlying gl buffer object equals the specified gl buffer object.
 * @param {WebGLBuffer} buffer - The buffer
 * @returns {boolean}
 */

Vbo.prototype.equalsGLObject = function(buffer){
	return this._obj == buffer;
};

module.exports = Vbo;