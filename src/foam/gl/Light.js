var ObjectUtil  = require('../util/ObjectUtil'),
	glObject    = require('./glObject'),
	Program     = require('./Program'),
	Vec3        = require('../math/Vec3'),
	Vec4        = require('../math/Vec4'),
	glValueType = require('./glValueType'),
	Color		= require('../util/Color'),
	Matrix44    = require('../math/Matrix44');

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
	this.linearAttenuation   = 0.22;
	this.quadricAttenuation  = 0.2;

	this._uniformPrefix = Program.UNIFORM_LIGHT + '[' + this._id + ']';

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
		location : null,
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

	var prefix = this._uniformPrefix;

	this._uniformLocationPosition   = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_POSITION_SUFFIX);
	this._uniformLocationAmbient    = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_AMBIENT_SUFFIX);
	this._uniformLocationDiffuse    = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_DIFFUSE_SUFFIX);
	this._uniformLocationSpecular   = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_SPECULAR_SUFFIX);
	this._uniformLocationConstAtt   = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_CONSTANT_ATT);
	this._uniformLocationLinearAtt  = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_LINEAR_ATT);
	this._uniformLocationQuadricAtt = program.getUniformLocation(prefix + '.' + Program.UNIFORM_LIGHT_STRUCT_QUADRIC_ATT);

	var uniforms = this._customUniforms;
	var uniform;

	for(var a in uniforms){
		uniform = uniforms[a];
		uniform.location = program.getUniformLocation(a);
	}
	this._programIdLast = program.getId();
}


var colorEmpty = new Float32Array([0,0,0]);

Light.prototype._applyColors = function(){
	var gl = this._gl;

	var uniformLocationAmbient = this._uniformLocationAmbient,
		uniformLocationDiffsue = this._uniformLocationDiffuse,
		uniformLocationSpecular = this._uniformLocationSpecular;

	if(this._enabled){
		var tempF32 = this._tempF32_3;
		var ambient = this.ambient, diffuse = this.diffuse, specular = this.specular;

		if(uniformLocationAmbient != -1){
			tempF32[0] = ambient.r;
			tempF32[1] = ambient.g;
			tempF32[2] = ambient.b;
			gl.uniform3fv(uniformLocationAmbient,tempF32);
		}

		if(uniformLocationDiffsue != -1){
			tempF32[0] = diffuse.r;
			tempF32[1] = diffuse.g;
			tempF32[2] = diffuse.b;

			gl.uniform3fv(uniformLocationDiffsue,tempF32);
		}

		if(uniformLocationSpecular != -1){
			tempF32[0] = specular.r;
			tempF32[1] = specular.g;
			tempF32[2] = specular.b;

			gl.uniform3fv(this._uniformLocationSpecular,tempF32);
		}
		return;
	}

	if(uniformLocationAmbient != -1){
		gl.uniform3fv(this._uniformLocationAmbient,colorEmpty);
	}
	if(uniformLocationDiffsue != -1) {
		gl.uniform3fv(this._uniformLocationDiffuse, colorEmpty);
	}
	if(uniformLocationSpecular != -1){
		gl.uniform3fv(this._uniformLocationSpecular,colorEmpty);
	}
};

Light.prototype._applyAttenuation = function(){
	if(!this._enabled){
		return;
	}
	var gl = this._gl;


	var uniformLocationConstAtt = this._uniformLocationConstAtt,
		uniformLocationLinearAtt = this._uniformLocationLinearAtt,
		uniformLocationQuadricAtt = this._uniformLocationQuadricAtt;

	if(uniformLocationConstAtt != -1){
		gl.uniform1f(uniformLocationConstAtt,this.constantAttenuation);
	}

	if(uniformLocationLinearAtt != -1){
		gl.uniform1f(uniformLocationLinearAtt,this.linearAttenuation);
	}

	if(uniformLocationQuadricAtt != -1){
		gl.uniform1f(uniformLocationQuadricAtt,this.quadricAttenuation);
	}
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
	var uniformLocationPosition = this._uniformLocationPosition;
	if(uniformLocationPosition == -1){
		return;
	}
	var gl = this._gl;

	var position = this.position,
		tempF32  = this._tempF32_4;

	tempF32[0] = position.x;
	tempF32[1] = position.y;
	tempF32[2] = position.z;
	tempF32[3] = 1.0; // type of light - for later use

	this._glTrans.getModelViewMatrix().multVec3AI(tempF32,0)

	gl.uniform4fv(uniformLocationPosition,tempF32);
}

Light.prototype.draw = function(){
	this._updateUniformLocations();
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