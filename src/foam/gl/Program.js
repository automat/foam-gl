var gl = require('./gl').gl;

function Program(vertexShader, fragmentShader) {
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

Program.prototype.delete = function(){
   gl.deleteProgram(this._program);
};

Program.prototype.getNumUniforms = function () {
    return this._numUniforms;
};

Program.prototype.getNumAttributes = function () {
    return this._numAttributes;
};

Program.prototype.bind = function () {
    gl.useProgram(this._program);
    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;
    while (++i < n) {
        gl.enableVertexAttribArray(a[i]);
    }
};

Program.prototype.unbind = function () {
    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;

    while (++i < n) {
        gl.disableVertexAttribArray(a[i]);
    }
    gl.useProgram(null);
};

Program.prototype.uniform1f = function(location,x) {
    gl.uniform1f(location,x);
};

Program.prototype.uniform1fv = function(location,v) {
    gl.uniform1fv(location,v);
};

Program.prototype.uniform1i = function(location,x) {
    gl.uniform1i(location,x);
};

Program.prototype.uniform1iv = function(location,v) {
    gl.uniform1iv(location,v)
};

Program.prototype.uniform2f = function(location,x,y) {
    gl.uniform2f(location,x,y);
};

Program.prototype.uniform2fv = function(location,v) {
    gl.uniform2fv(location,v);
};

Program.prototype.uniform2i = function(location,x,y) {
    gl.uniform2i(location,x,y);
};

Program.prototype.uniform2iv = function(location,v) {
    gl.uniform2iv(location,v);
};

Program.prototype.uniform3f = function(location,x,y,z) {
    gl.uniform3f(location,x,y,z);
};

Program.prototype.uniform3fv = function(location,v) {
    gl.uniform3fv(location,v);
};

Program.prototype.uniform3fv = function(location,v) {
    gl.uniform3fv(location,v);
};

Program.prototype.uniform3i = function(location,x,y,z) {
    gl.uniform3i(location,x,y,z);
};

Program.prototype.uniform3iv = function(location,v) {
    gl.uniform3iv(location,v);
};

Program.prototype.uniform4f = function(location,x,y,z,w) {
    gl.uniform4f(location,x,y,z,w);
};

Program.prototype.uniform4fv = function(location,v) {
    gl.uniform4fv(location,v);
};

Program.prototype.uniform4i = function(location,x,y,z,w) {
    gl.uniform4i(location,x,y,z,w);
};

Program.prototype.uniform4iv = function(location,v) {
    gl.uniform4iv(location,v);
};

Program.prototype.uniformMatrix2fv = function(location,transpose,value) {
    gl.uniformMatrix2fv(location,transpose,value);
};

Program.prototype.uniformMatrix3fv = function(location,transpose,value) {
    gl.uniformMatrix3fv(location,transpose,value);
};

Program.prototype.uniformMatrix4fv = function(location,transpose,value) {
    gl.uniformMatrix4fv(location,transpose,value);
};

module.exports = Program;
