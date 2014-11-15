var _gl = require('./gl'),
    Id  = require('../system/Id');

/**
 * GLSL shader program wrapper.
 * @param {String} [vertexShader] - The vertex shader or mixed vertex/fragment shader string
 * @param {String} [fragmentShader] - The fragment shader string
 * @constructor
 */

function Program(vertexShader, fragmentShader) {
    var gl = this._gl = _gl.get();
    this._obj = null;
    this._id  = null;
    this.load(vertexShader,fragmentShader);
}

/**
 * The default shader projection matrix uniform. (reassignable)
 * @type {string}
 * @static
 */

Program.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

/**
 * The default shader view matrix uniform. (reassignable)
 * @type {string}
 * @static
 */

Program.UNIFORM_VIEW_MATRIX = 'uViewMatrix';

/**
 * The default shader modelview matrix uniform. (reassignable)
 * @type {string}
 * @static
 */

Program.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';

/**
 * The default shader normal matrix uniform. (reassignable)
 * @type {string}
 * @static
 */

Program.UNIFORM_NORMAL_MATRIX = 'uNormalMatrix';

/**
 * The default shader vertex position attribute. (reassignable)
 * @type {string}
 * @static
 */

Program.ATTRIB_VERTEX_POSITION = 'aVertexPosition';

/**
 * The default shader vertex position offset attribute (reassignable)
 * @type {string}
 * @static
 */

Program.ATTRIB_VERTEX_OFFSET = 'aVertexOffset';

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

/**
 * The default shader light uniform. Lights are structs. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT = 'uLights';

/**
 * The default shader light trigger uniform. (reassignable)
 * @type {string}
 */

Program.UNIFORM_USE_LIGHTING = 'uUseLighting';

/**
 * The default shader light struct position property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_POSITION_SUFFIX = 'position';

/**
 * The default shader light struct ambient property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_AMBIENT_SUFFIX = 'ambient';


/**
 * The default shader light struct diffuse property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_DIFFUSE_SUFFIX = 'diffuse';

/**
 * The default shader light struct specular property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_SPECULAR_SUFFIX = 'specular';

/**
 * The default shader light struct constant attentuation property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_CONSTANT_ATT = 'constantAttenuation';

/**
 * The default shader light struct linear attentuation property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_LINEAR_ATT = 'linearAttenuation';

/**
 * The default shader light struct quadric attentuation property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_LIGHT_STRUCT_QUADRIC_ATT = 'quadraticAttenuation';

/**
 * The default shader light uniform. Materials are structs. (reassignable)
 * @type {string}
 */

Program.UNIFORM_MATERIAL_STRUCT = 'uMaterial';

/**
 * The default shader material struct emission property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_MATERIAL_STRUCT_EMISSION = 'emission';

/**
 * The default shader material struct ambient property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_MATERIAL_STRUCT_AMBIENT = 'ambient';

/**
 * The default shader material struct diffuse property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_MATERIAL_STRUCT_DIFFUSE = 'diffuse';

/**
 * The default shader material struct specular property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_MATERIAL_STRUCT_SPECULAR = 'specular';

/**
 * The default shader material struct shininess property. (reassignable)
 * @type {string}
 */

Program.UNIFORM_MATERIAL_STRUCT_SHININESS = 'shininess';

Program._currentProgram = null;

/**
 * Return the currently bound program.
 * @returns {null|Progam}
 */

Program.getCurrent = function(){
    return Program._currentProgram;
}

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

    var program    = this._obj = gl.createProgram(),
        vertShader = gl.createShader(gl.VERTEX_SHADER),
        fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.bindAttribLocation(this._obj, 0, Program.ATTRIB_VERTEX_POSITION);

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

    this._id = Id.get();
}

/**
 * Delete the program.
 */

Program.prototype.delete = function(){
    if(!this._obj){
        return;
    }
    this._gl.deleteProgram(this._obj);
    this._obj = null;
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
    gl.useProgram(this._obj);

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


Program.prototype.enableVertexAttribArray = function(name){
    this._gl.enableVertexAttribArray(this[name]);
};

Program.prototype.disableVertexAttribArray = function(name){
    this._gl.disableVertexAttribArray(this[name]);
};

Program.prototype.getId = function(){
    return this._id;
};

Program.prototype.getObjGL = function(){
    return this._obj;
};

module.exports = Program;
