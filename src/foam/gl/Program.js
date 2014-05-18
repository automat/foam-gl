var _gl = require('./gl');

var bound_0 = false;


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

    if(!bound_0){
        gl.bindAttribLocation(program, 0, Program.ATTRIB_VERTEX_POSITION);
        bound_0 = true;
    }

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

module.exports = Program;
