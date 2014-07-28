var _gl = require('./gl');

var bound_0 = false;

/**
 * GLSL shader program wrapper.
 * @param {String} [vertexShader] - The vertex shader or mixed vertex/fragment shader string
 * @param {String} [fragmentShader] - The fragment shader string
 * @constructor
 */

function Program(vertexShader, fragmentShader) {
    var gl = this._gl = _gl.get();
    this.load(vertexShader,fragmentShader);
}

/**
 * The default shader modelview matrix uniform. (reassignable)
 * @type {string}
 * @static
 */

Program.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';

/**
 * The default shader projection matrix uniform. (reassignable)
 * @type {string}
 * @static
 */

Program.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

/**
 * The default shader vertex position attribute. (reassignable)
 * @type {string}
 * @static
 */

Program.ATTRIB_VERTEX_POSITION = 'aVertexPosition';

/**
 * The default shader vertex normal attribute. (reassignable)
 * @type {string}
 * @static
 */

Program.ATTRIB_VERTEX_NORMAL = 'aVertexNormal';

/**
 * The default shader vertex color attribute. (reassignable)
 * @type {string}
 * @static
 */

Program.ATTRIB_VERTEX_COLOR = 'aVertexColor';

/**
 * The default shader texcoord attribute. (reassignable)
 * @type {string}
 */

Program.ATTRIB_TEXCOORD = 'aTexcoord';

/**
 * The default shader color uniform. (reassignable)
 * @type {string}
 */

Program.UNIFORM_COLOR = 'uColor';

/**
 * The default shader sampler2d uniform. (reassignable)
 * @type {string}
 */

Program.UNIFORM_TEXTURE = 'uTexture';

/**
 * The default shader point size uniform. (reassignable)
 * @type {string}
 */

Program.UNIFORM_POINT_SIZE = 'uPointSize';

Program._currentProgram = null;

/**
 * Return the currently bound program.
 * @returns {null|Progam}
 */

Program.getCurrentProgram = function(){
    return Program._currentProgram;
};

/**
 * Reload the program
 * @param {String} vertexShader - The vertex shader or mixed vertex/fragment shader string
 * @param {String} [fragmentShader] - The fragment shader string
 */

Program.prototype.load = function(vertexShader,fragmentShader){
    if(!vertexShader){
        return;
    }

    this.delete();

    var gl = this._gl;

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

/**
 * Delete the program.
 */

Program.prototype.delete = function(){
    if(!this._program){
        return;
    }
    this._gl.deleteProgram(this._program);
    this._program = null;
};

/**
 * Get the number of active uniforms
 * @returns {Number}
 */

Program.prototype.getNumUniforms = function () {
    return this._numUniforms;
};

/**
 * Get the number of active attributes.
 * @returns {Number}
 */

Program.prototype.getNumAttributes = function () {
    return this._numAttributes;
};

/**
 * Activate the program.
 */

Program.prototype.bind = function () {
    var gl = this._gl;
    gl.useProgram(this._program);
    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;
    while (++i < n) {
        gl.enableVertexAttribArray(a[i]);
    }
    Program._currentProgram = this;
};

/**
 * Deactivate the program.
 */

Program.prototype.unbind = function () {
    var gl = this._gl;

    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;

    while (++i < n) {
        gl.disableVertexAttribArray(a[i]);
    }
    gl.useProgram(null);
    Program._currentProgram = null;
};


module.exports = Program;
