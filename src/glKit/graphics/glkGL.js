/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKGL(gl,program)
{
    this._gl      = gl;
    this._program = program;


    this._modelViewMatrix  = null;
    this._projectionMatrix = null;
    this._normalMatrix     = glkMat44.make();

    this._matrixStack = [];
    this._matrixTemp  = glkMat44.make();

    this._aVertexPosition    = null;
    this._aVertexNormal      = null;
    this._aVertexColor       = null;
    this._aVertexUV          = null;

    this._uUseLighting       = null;

    this._uModelViewMatrix   = null;
    this._uPerspectiveMatrix = null;
    this._uNormalMatrix      = null;

    this._uPointSize         = null;

    this._lighting = true;

    var _gl = this.gl;

    this.POINTS         = _gl.POINTS;
    this.LINES          = _gl.LINES;
    this.LINE_LOOP      = _gl.LINE_LOOP;
    this.TRIANGLES      = _gl.TRIANGLES;
    this.TRIANGLE_FAN   = _gl.TRIANGLE_FAN;
    this.TRIANGLE_STRIP = _gl.TRIANGLE_STRIP;

    this.SIZE_OF_VERTEX = glkVec3.SIZE;
    this.SIZE_OF_NORMAL = glkVec3.SIZE;
    this.SIZE_OF_COLOR  = glkColor.SIZE;
    this.SIZE_OF_UV     = glkVec2.SIZE;
    this.SIZE_OF_FACE   = glkVec3.SIZE;
}




GLKGL.prototype =
{
    setModelViewMatrix : function(camera)
    {
        this._modelViewMatrix = camera.getModelViewMatrix();
    },

    setProjectionMatrix : function(camera)
    {
        this._projectionMatrix = camera.getProjectionMatrix();
    },

    _setMatricesUniform : function()
    {
        var gl = this._gl;

        this.gl.uniformMatrix4fv(this._uModelViewMatrix,   false,this._modelViewMatrix);
        this.gl.uniformMatrix4fv(this._uPerspectiveMatrix, false,this._projectionMatrix);

        if(!this._lighting)return;




    },

    loadIdentity : function()
    {
        glkMat44.identity(this._modelViewMatrix);
    },

    pushMatrix : function()
    {
        this._matrixStack.push(glkMat44.copy(this._modelViewMatrix));
    },

    popMatrix : function()
    {
        var stack = this._matrixStack;

        if(stack.length == 0)throw ('Invalid pop!');
        this._modelViewMatrix = stack.pop();

        return this._modelViewMatrix;
    },

    translate : function(x,y,z)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.translate(x,y,z));
    },

    scale : function(x,y,z)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.scale(x,y,z));
    },

    rotateX : function(a)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.rotateX(a));
    },

    rotateY : function(a)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.rotateY(a));
    },

    rotateZ : function(a)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.rotateZ(a));
    },

    rotateXYZ : function(ax,ay,az)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.rotateXYZ(ax,ay,az));
    },

    enable : function(key)
    {
        this._gl.enable(key);
    },

    disable : function(key)
    {
        this._gl.disable(key);
    },

    enableLighting : function()
    {
        this._lighting = true;

    },

    disableLighting : function()
    {
        this._lighting = false;

    },


    drawElements : function(vertexFloat32Array,
                            normalFloat32Array,
                            colorFloat32Array,
                            uvFloat32Array,
                            indexUInt16Array,mode)
    {

        mode = mode || this.TRIANGLES;
        this._fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
        this._setMatricesUniform();

        var gl = this._gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexUInt16Array,gl.DYNAMIC_DRAW);
        gl.drawElements(mode,indexUInt16Array.length,gl.UNSIGNED_SHORT,0);
    },

    drawArrays : function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
    {
        this._fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
        this._setMatricesUniform();
        this._gl.drawArrays(mode,first,count);
    },

    _fillArrayBuffer : function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array)
    {
        var na  = normalFloat32Array ? true : false,
            uva = uvFloat32Array     ? true : false;

        var gl            = this._gl,
            glArrayBuffer = gl.ARRAY_BUFFER,
            glFloat       = gl.FLOAT;

        var vblen   =       vertexFloat32Array.byteLength,
            nblen   = na  ? normalFloat32Array.byteLength : 0,
            cblen   =       colorFloat32Array.byteLength,
            uvablen = uva ? uvFloat32Array.byteLength : 0;

        var offsetV  = 0,
            offsetN  = offsetV + vblen,
            offsetC  = offsetN + nblen,
            offsetUV = offsetC + cblen;

        gl.bufferData(glArrayBuffer, vblen + nblen + cblen + uvablen, gl.DYNAMIC_DRAW);

        gl.bufferSubData(glArrayBuffer, offsetV,  vertexFloat32Array);
        gl.bufferSubData(glArrayBuffer, offsetN,  normalFloat32Array);
        gl.bufferSubData(glArrayBuffer, offsetC,  colorFloat32Array);
        gl.bufferSubData(glArrayBuffer, offsetUV, uvFloat32Array);

        var aVertexNormal = this._aVertexNormal,
            aVertexUV     = this._aVertexUV;

        if(!na) gl.disableVertexAttribArray(aVertexNormal); else gl.enableVertexAttribArray(aVertexNormal);
        if(!uva)gl.disableVertexAttribArray(aVertexUV);     else gl.enableVertexAttribArray(aVertexUV);

        gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);
        gl.vertexAttribPointer(aVertexNormal,         this.SIZE_OF_NORMAL, glFloat, false, 0, offsetN);
        gl.vertexAttribPointer(this._aVertexColor,    this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);
        gl.vertexAttribPointer(aVertexUV,             this.SIZE_OF_UV,     glFloat, false, 0, offsetUV);

    },















    getGL : function()
    {
        return this._gl;
    }

};