/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKGL(gl)
{
    this._gl      = gl;

    this._renderVertexShader   = this.loadShader(glkProgShader.vertexShader,  gl.VERTEX_SHADER);
    this._renderFragmentShader = this.loadShader(glkProgShader.fragmentShader,gl.FRAGMENT_SHADER);

    var program = this._renderProgram = this.loadProgram(this._renderVertexShader,this._renderFragmentShader);

    this._aVertexPosition    = gl.getAttribLocation(  program, 'VertexPosition' );
    this._aVertexNormal      = gl.getAttribLocation(  program, 'VertexNormal' );
    this._aVertexColor       = gl.getAttribLocation(  program, 'VertexColor' );
    this._aVertexUV          = gl.getAttribLocation(  program, 'VertexUV' );

    this._uUseLighting       = gl.getUniformLocation( program, 'UseLighting' );

    this._uModelViewMatrix   = gl.getUniformLocation( program, 'ModelViewMatrix' );
    this._uPerspectiveMatrix = gl.getUniformLocation( program, 'ProjectionMatrix' );
    this._uNormalMatrix      = gl.getUniformLocation( program, 'NormalMatrix' );

    this._uPointSize         = gl.getUniformLocation( program, 'PointSize' );

    //TODO:FIX Multiple Lights init

    var lights = this._lights = new Array(1);
    var i = -1,light;

    while(++i < lights.length)
    {
        light = lights[i] = new GLKLight_Internal(i);
        light.uPosition      = gl.getUniformLocation(program,'Lights.position');
        light.uColorAmbient  = gl.getUniformLocation(program,'Lights.colorAmbient');
        light.uColorDiffuse  = gl.getUniformLocation(program,'Lights.colorDiffuse');
        light.uColorSpecular = gl.getUniformLocation(program,'Lights.colorSpecular');
        light.uShininess     = gl.getUniformLocation(program,'Lights.shininess');

        /*
        lights.uPosition      = gl.getUniformLocation(program,'Lights['+i+].position');
        lights.uColorAmbient  = gl.getUniformLocation(program,'Lights['+i+'].colorAmbient');
        lights.uColorDiffuse  = gl.getUniformLocation(program,'Lights['+i+'].colorDiffuse');
        lights.uColorSpecular = gl.getUniformLocation(program,'Lights['+i+'].colorSpecular');
        lights.uShininess     = gl.getUniformLocation(program,'Lights['+i+'].shininess');
        */
    }







    this._modelViewMatrix  = null;
    this._projectionMatrix = null;
    this._normalMatrix     = glkMat44.make();

    this._matrixStack = [];
    this._matrixTemp  = glkMat44.make();




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


    this.enable  = _gl.enable;
    this.disable = _gl.disable;
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

    loadShader : function(source,type)
    {
        var gl = this._gl;
        var shader = gl.createShader(type);

        gl.shaderSource(shader,source);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
        {
            console.log("Could not compile shader.");
            gl.deleteShader(shader);
            shader = null;
        }

        return shader;
    },

    loadProgram : function(vertexShader,fragmentShader)
    {
        var gl = this._gl;
        var program = gl.createProgram();
        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS))
        {
            console.log("Could not link program.");
            gl.deleteProgram(program);
            program = null;
        }

        return program;
    },















    getGL : function()
    {
        return this._gl;
    },


    setShaderLocations : function(program)
    {
        var gl = this._gl;

        this._aVertexPosition    = gl.getAttribLocation(  program, "VertexPosition");
        this._aVertexNormal      = gl.getAttribLocation(  program, "VertexNormal");
        this._aVertexColor       = gl.getAttribLocation(  program, "VertexColor");
        this._aVertexUV          = gl.getAttribLocation(  program, "VertexUV");

        this._uUseLighting       = gl.getUniformLocation( program, "UseLighting");

        this._uModelViewMatrix   = gl.getUniformLocation(program, "ModelViewMatrix");
        this._uPerspectiveMatrix = gl.getUniformLocation(program, "ProjectionMatrix");
        this._uNormalMatrix      = gl.getUniformLocation(program, "NormalMatrix");

        this._uPointSize         = gl.getUniformLocation(program, "PointSize");
    },

    //TODO:FIX
    setLightShaderLocation : function(light)
    {


    }

};