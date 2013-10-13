var Platform     = require('../../system/common/fPlatform'),
    ShaderLoader = require('./shader/fShaderLoader'),
    System       = require('../../System/fSystem');

var __i = false;

function Program(fgl,vertexShader,fragmentShader)
{
    var platform = Platform.getTarget();

    var gl = fgl.gl;
    var program    = this.program    = gl.createProgram(),
        vertShader = this.vertShader = gl.createShader(gl.VERTEX_SHADER),
        fragShader = this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader,vertexShader);
    gl.compileShader(vertShader);

    if(!__i)gl.bindAttribLocation(program,0,'aVertexPosition');

    if(!gl.getShaderParameter(vertShader,gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(vertShader);

    gl.shaderSource(fragShader, ((platform == Platform.WEB || platform == Platform.NODE_WEBKIT) ?
                                  ShaderLoader.PrefixShaderWeb : '') + fragmentShader);
    gl.compileShader(fragShader);

    if(!gl.getShaderParameter(fragShader,gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(fragShader);

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram( program);

    var i, paramName;

    //plask
    var uniformsNum   = this._uniformsNum   = gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);
    i = -1;while(++i < uniformsNum)
    {
        paramName = gl.getActiveUniform(program,i).name;
        this[paramName] = gl.getUniformLocation(program,paramName);
    }

    var attributesNum = this._attributesNum = gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);
    var attributes    = this._attributes    = new Array(attributesNum);
    i = -1;while(++i < attributesNum)
    {
        paramName = gl.getActiveAttrib(program,i).name;
        attributes[i] = this[paramName] = gl.getAttribLocation(program,paramName);
    }
}

Program.prototype.getUniformsNum   = function(){return this._uniformsNum;};
Program.prototype.getAttributesNum = function(){return this._attributesNum;};

Program.prototype.enableVertexAttribArrays = function(fgl)
{
    var i = -1,a = this._attributes,n = this._attributesNum, gl = fgl.gl;
    while(++i < n){gl.enableVertexAttribArray(a[i]);}
};



module.exports = Program;


