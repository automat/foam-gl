var _gl = require('./gl');

function Program(vertexShader, fragmentShader) {
    var gl = this._gl = _gl.get();

    var prefixVertexShader = '',
        prefixFragmentShader = '';

    if(!fragmentShader){
        prefixVertexShader = '#define VERTEX_SHADER\n';
        prefixFragmentShader = '#define FRAGMENT_SHADER\n';
        fragmentShader = vertexShader;
    }

    var program    = this._program = gl.createProgram(),
        vertShader = gl.createShader(gl.VERTEX_SHADER),
        fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, prefixVertexShader + vertexShader);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        throw 'VERTEX: ' + gl.getShaderInfoLog(vertShader);
    }

    gl.shaderSource(fragShader, prefixFragmentShader + fragmentShader);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        throw 'FRAGMENT: ' + gl.getShaderInfoLog(fragShader);
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    var i, paramName;

    var numUniforms = this._numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    i = -1;
    while (++i < numUniforms) {
        paramName = gl.getActiveUniform(program, i).name;
        this[paramName] = gl.getUniformLocation(program, paramName);
    }

    var attributesNum = this._numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    var attributes = this._attributes = new Array(attributesNum);
    i = -1;
    while (++i < attributesNum) {
        paramName = gl.getActiveAttrib(program, i).name;
        attributes[i] = this[paramName] = gl.getAttribLocation(program, paramName);
    }
}


Program.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';
Program.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

Program.ATTRIB_VERTEX_POSITION = 'aVertexPosition';
Program.ATTRIB_VERTEX_NORMAL   = 'aVertexNormal';
Program.ATTRIB_VERTEX_COLOR    = 'aVertexColor';
Program.ATTRIB_TEXCOORD        = 'aTexcoord';

Program.prototype.delete = function(){
   this._gl.deleteProgram(this._program);
};

Program.prototype.getNumUniforms = function () {
    return this._numUniforms;
};

Program.prototype.getNumAttributes = function () {
    return this._numAttributes;
};



Program.prototype.bind = function () {
    var gl = this._gl;
    gl.useProgram(this._program);
    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;
    while (++i < n) {
        gl.enableVertexAttribArray(a[i]);
    }
};

Program.prototype.unbind = function () {
    var gl = this._gl;

    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;

    while (++i < n) {
        gl.disableVertexAttribArray(a[i]);
    }
    gl.useProgram(null);
};

Program.prototype.uniform1f = function(location,x) {
    this._gl.uniform1f(location,x);
};

Program.prototype.uniform1fv = function(location,v) {
    this._gl.uniform1fv(location,v);
};

Program.prototype.uniform1i = function(location,x) {
    this._gl.uniform1i(location,x);
};

Program.prototype.uniform1iv = function(location,v) {
    this._gl.uniform1iv(location,v)
};

Program.prototype.uniform2f = function(location,x,y) {
    this._gl.uniform2f(location,x,y);
};

Program.prototype.uniform2fv = function(location,v) {
    this._gl.uniform2fv(location,v);
};

Program.prototype.uniform2i = function(location,x,y) {
    this._gl.uniform2i(location,x,y);
};

Program.prototype.uniform2iv = function(location,v) {
    this._gl.uniform2iv(location,v);
};

Program.prototype.uniform3f = function(location,x,y,z) {
    this._gl.uniform3f(location,x,y,z);
};

Program.prototype.uniform3fv = function(location,v) {
    this._gl.uniform3fv(location,v);
};

Program.prototype.uniform3i = function(location,x,y,z) {
    this._gl.uniform3i(location,x,y,z);
};

Program.prototype.uniform3iv = function(location,v) {
    this._gl.uniform3iv(location,v);
};

Program.prototype.uniform4f = function(location,x,y,z,w) {
    this._gl.uniform4f(location,x,y,z,w);
};

Program.prototype.uniform4fv = function(location,v) {
    this._gl.uniform4fv(location,v);
};

Program.prototype.uniform4i = function(location,x,y,z,w) {
    this._gl.uniform4i(location,x,y,z,w);
};

Program.prototype.uniform4iv = function(location,v) {
    this._gl.uniform4iv(location,v);
};

Program.prototype.uniformMatrix2fv = function(location,transpose,value) {
    this._gl.uniformMatrix2fv(location,transpose,value);
};

Program.prototype.uniformMatrix3fv = function(location,transpose,value) {
    this._gl.uniformMatrix3fv(location,transpose,value);
};

Program.prototype.uniformMatrix4fv = function(location,transpose,value) {
    this._gl.uniformMatrix4fv(location,transpose,value);
};

module.exports = Program;
