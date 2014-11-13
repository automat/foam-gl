var ObjectUtil  = require('../util/ObjectUtil'),
	glObject    = require('./glObject'),
	Program     = require('./Program'),
	Vec3        = require('../math/Vec3'),
	Vec4        = require('../math/Vec4'),
	glValueType = require('./glValueType'),
	Color		= require('../util/Color');

function Light(id) {
	glObject.apply(this);
	this._id = id || 0;

	this._enabled = true;

	this.ambient  = Color.white();
	this.diffuse  = Color.white();
	this.specular = Color.white();

	this._tempF32_3 = new Float32Array(3);
	this._tempF32_4 = new Float32Array(4);

	this.position = new Vec3();
	this.direction = null;
	this.spotExponent = null;
	this.spotCutOff = null;

	this.constantAttenuation = 1.0;
	this.linearAttenuation   = 1.0;
	this.quadricAttenuation  = 1.0;

	var prefix = this._uniformPrefix = Program.UNIFORM_LIGHT + '[' + this._id + ']';

	//Fix this

	this._uniformLocationPositionKey   = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_POSITION_SUFFIX;
	this._uniformLocationAmbientKey    = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_AMBIENT_SUFFIX;
	this._uniformLocationDiffuseKey    = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_DIFFUSE_SUFFIX;
	this._uniformLocationSpecularKey   = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_SPECULAR_SUFFIX;
	this._uniformLocationConstAttKey   = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_CONSTANT_ATT;
	this._uniformLocationLinearAttKey  = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_LINEAR_ATT;
	this._uniformLocationQuadricAttKey = prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_QUADRIC_ATT;

	this._uniformLocationPosition =
		this._uniformLocationAmbient =
			this._uniformLocationDiffuse =
				this._uniformLocationSpecular =
					this._uniformLocationConstAtt =
						this._uniformLocationLinearAtt =
							this._uniformLocationQuadricAtt = null;

	this._customUniforms = {};

	this._programIdLast = null;
}

Light.prototype = Object.create(glObject.prototype);
Light.prototype.constructor = Light;


Light.prototype._addCustomUniform = function(attrib,type,value){
	this._customUniforms[this._uniformPrefix + '.' + attrib] = {
		location : null
		type : type,
		value : value
	};
};

Light.prototype.addCustomUniform1f = function(attrib,x){
	this._addCustomUniform(attrib, glValueType.ATTRIB_1f, x);
};

Light.prototype.addCustomUniform2f = function(attrib,x,y){
	this._addCustomUniform(attrib, glValueType.ATTRIB_2f, [x,y]);
};

Light.prototype.addCustomUniform3f = function(attrib,x,y,z){
	this._addCustomUniform(attrib, glValueType.ATTRIB_3f, [x,y,z]);
};

Light.prototype.addCustomUniform4f = function(attrib,x,y,z,w){
	this._addCustomUniform(attrib, glValueType.ATTRIB_4f, [x,y,z,w]);
};

Light.prototype.addCustomUniform1i = function(attrib,x){
	this._addCustomUniform(attrib, glValueType.ATTRIB_1i, x);
};

Light.prototype.addCustomUniform2i = function(attrib,x,y){
	this._addCustomUniform(attrib, glValueType.ATTRIB_2i, [x,y]);
};

Light.prototype.addCustomUniform3i = function(attrib,x,y,z){
	this._addCustomUniform(attrib, glValueType.ATTRIB_3i, [x,y,z]);
};

Light.prototype.addCustomUniform4fi = function(attrib,x,y,z,w){
	this._addCustomUniform(attrib, glValueType.ATTRIB_4i, [x,y,z,w]);
};

Light.prototype.addCustomUniform1fv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_1fv, value);
};

Light.prototype.addCustomUniform2fv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_2fv, value);
};

Light.prototype.addCustomUniform3fv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_3fv, value);
};

Light.prototype.addCustomUniform4fv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_4fv, value);
};

Light.prototype.addCustomUniform1iv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_1iv, value);
};

Light.prototype.addCustomUniform2iv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_2iv, value);
};

Light.prototype.addCustomUniform3iv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_3iv, value);
};

Light.prototype.addCustomUniform4iv = function(attrib,value){
	this._addCustomUniform(attrib, glValueType.ATTRIB_4iv, value);
};

Light.prototype.setCustomUniform1 = function(attrib,x){
	this._customUniforms[this._uniformPrefix + '.' + attrib].value = x;
};

Light.prototype.setCustomUniform2 = function(attrib,x,y){
	attrib = this._customUniforms[this._uniformPrefix + '.' + attrib].value;
	attrib[0] = x;
	attrib[1] = y;
};

Light.prototype.setCustomUniform3 = function(attrib,x,y,z){
	attrib = this._customUniforms[this._uniformPrefix + '.' + attrib].value;
	attrib[0] = x;
	attrib[1] = y;
	attrib[2] = z;
};

Light.prototype.setCustomUniform4 = function(attrib,x,y,z,w){
	attrib = this._customUniforms[this._uniformPrefix + '.' + attrib].value;
	attrib[0] = x;
	attrib[1] = y;
	attrib[2] = z;
	attrib[3] = z;
};

Light.prototype.enable = function(){
	this._enabled = true;
};

Light.prototype.disable = function(){
	this._enabled = false;
};

Light.prototype.setPosition = function(vec){
	this.position.x = vec.x;
	this.position.y = vec.y;
	this.position.z = vec.z;
};

Light.prototype.setPosition3f = function(x,y,z){
	this.position.x = x;
	this.position.y = y;
	this.position.z = z;
};

Light.prototype.setEye = function (v) {
	this._position.set(v);
};

Light.prototype.setEye3f = function (x, y, z) {
	this._position.set3f(x,y,z);
};


Light.prototype._updateUniformLocations = function(){
	if(Program.getCurrent().getId() == this._programIdLast){
		return;
	}

	var gl = this._gl;
	var program   = Program.getCurrent(),
		programGl = program.getObjGL();

	this._uniformLocationPosition = gl.getUniformLocation(program, this._uniformLocationPositionKey);
	this._uniformLocationAmbient = gl.getUniformLocation(programGl, this._uniformLocationAmbientKey);
	this._uniformLocationDiffuse = gl.getUniformLocation(programGl, this._uniformLocationDiffuseKey);
	this._uniformLocationSpecular = gl.getUniformLocation(programGl, this._uniformLocationSpecularKey);
	this._uniformLocationConstAtt = gl.getUniformLocation(programGl, this._uniformLocationConstAttKey);
	this._uniformLocationLinearAtt = gl.getUniformLocation(programGl, this._uniformLocationLinearAtt);
	this._uniformLocationQuadricAtt = gl.getUniformLocation(programGl, this._uniformLocationQuadricAtt);

	var uniform;

	for(var a in uniforms){
		uniform = uniforms[a];
		uniform.location = gl.getUniformLocation(programGl,a);
	}

	this._programIdLast = program.getId();
}


var colorEmpty = new Float32Array([0,0,0]);

Light.prototype._applyColors = function(){
	var gl = this._gl;

	if(this._enabled){
		var tempF32 = this._tempF32_3;
		var ambient = this.ambient, diffuse = this.diffuse, specular = this.specular;

		tempF32[0] = ambient.r;
		tempF32[1] = ambient.g;
		tempF32[2] = ambient.b;

		gl.uniform3fv(this._uniformLocationAmbient,false,tempF32);

		tempF32[0] = diffuse.r;
		tempF32[1] = diffuse.g;
		tempF32[2] = diffuse.b;

		gl.uniform3fv(this._uniformLocationDiffuse,false,tempF32);

		tempF32[0] = specular.r;
		tempF32[1] = specular.g;
		tempF32[2] = specular.b;

		gl.uniform3fv(this._uniformLocationSpecular,false,tempF32);
		return;
	}

	gl.uniform3fv(this._uniformLocationAmbient,false,colorEmpty);
	gl.uniform3fv(this._uniformLocationDiffuse,false,colorEmpty);
	gl.uniform3fv(this._uniformLocationSpecular,false,colorEmpty);
};



Light.prototype._applyAttenuation = function(){
	if(!this._enabled){
		return;
	}
	var gl = this._gl;
	gl.uniform1f(this._uniformLocationConstAtt,this.constantAttenuation);
	gl.uniform1f(this._uniformLocationLinearAtt,this.linearAttenuation);
	gl.uniform1f(this._uniformLocationQuadricAtt,this.quadricAttenuation);
};


Light.prototype._applyCustomAttributes = function(){
	var gl = this._gl;
	var uniforms = this._customUniforms,
		uniform,
		uniformVal,
		uniformValLen;
	var func;

	for(var a in uniforms){
		uniform = uniforms[a];
		uniformVal = uniform.value;
		uniformValLen = uniformVal.length;

		func = gl['uniform' + uniform.type];

		if(uniformValLen &&uniformValLen > 1){
			if(uniformValLen == 2){
				func(uniform.location, uniformVal[0],uniformVal[1]);
			} else if(uniformValLen == 3){
				func(uniform.location, uniformVal[0],uniformVal[1],uniformVal[2]);
			} else {
				func(uniform.location, uniformVal[0],uniformVal[1],uniformVal[2],uniformVal[3]);
			}
		} else {
			func(uniform.location, uniformVal);
		}
	}
};

Light.prototype._applyPosition = function(idFlag){
	var gl = this._gl;

	var position = this.position;
	var tempF32 = this._tempF32_4;

	tempF32[0] = position.x;
	tempF32[1] = position.y;
	tempF32[2] = position.z;
	tempF32[3] = idFlag;

	gl.uniformMatrix4fv(this._uniformLocationPositionKey,false,this.position);
}

Light.prototype.apply = function(){
	this._applyColors();
	this._applyAttenuation();
	this._applyCustomAttributes();
	this._applyPosition(0);
};

Light.prototype._debugDrawPosition = function(){
	var glDraw  = this._glDraw,
		glTrans = this._glTrans;
	var prevColor = glDraw.getColor();

	if(this._enabled){
		glDraw.colorf(1,1,1);
	} else {
		glDraw.colorf(1,0,0);
	}

	glTrans.pushMatrix();
	glTrans.translate(this.position)
	glTrans.scale1f(0.125);
	glDraw.drawCubeStroked();
	glTrans.popMatrix();

	glDraw.color(prevColor);
};

Light.prototype.debugDraw = function(){
	this._debugDrawPosition();
};

Light.prototype.getId = function () {
	return this._id;
};

module.exports = Light;