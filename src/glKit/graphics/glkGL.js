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

    var _gl = this._gl;

    //TODO:Transform to proper english & finish bindings
    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings
    //
    // All necessary  webgl methods are bound, and following a naming convention.
    // Where feasible webgl methods are replaced by more convenient methods.
    // (e.g drawElements, which now includes automatic setting of buffer data,
    //  matrices....)
    //
    /*---------------------------------------------------------------------------------------------------------*/

    /*---------------------------------------------------------------------------------------------------------*/
    // Mode Depth Test
    /*---------------------------------------------------------------------------------------------------------*/

    this.DEPTH_TEST     = _gl.DEPTH_TEST;

    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings Uniform Data & Attibute variables
    /*---------------------------------------------------------------------------------------------------------*/
    this.getUniformLocation       = _gl.getUniformLocation.bind(_gl);
    this.getActiveUniform         = _gl.getActiveUniform.bind(_gl);
    this.getUniform               = _gl.getUniform.bind(_gl);
    this.setUniform1f             = _gl.uniform1f.bind(_gl);
    this.setUniform2f             = _gl.uniform2f.bind(_gl);
    this.setUniform3f             = _gl.uniform3f.bind(_gl);
    this.setUniform4f             = _gl.uniform4f.bind(_gl);
    this.setUniform1fv            = _gl.uniform1fv.bind(_gl);
    this.setUniform2fv            = _gl.uniform2fv.bind(_gl);
    this.setUniform3fv            = _gl.uniform3fv.bind(_gl);
    this.setUniform4fv            = _gl.uniform4fv.bind(_gl);
    this.setUniform1i             = _gl.uniform1i.bind(_gl);
    this.setUniform2i             = _gl.uniform2i.bind(_gl);
    this.setUniform3i             = _gl.uniform3i.bind(_gl);
    this.setUniform4i             = _gl.uniform4i.bind(_gl);
    this.setUniform1iv            = _gl.uniform1iv.bind(_gl);
    this.setUniform2iv            = _gl.uniform2iv.bind(_gl);
    this.setUniform3iv            = _gl.uniform3iv.bind(_gl);
    this.setUniform4iv            = _gl.uniform4iv.bind(_gl);

    this.getAttribLocation        = _gl.getAttribLocation.bind(_gl);
    this.getActiveAttrib          = _gl.getActiveAttrib.bind(_gl);
    this.getVertexAttrib          = _gl.getVertexAttrib.bind(_gl);
    this.setVertexAttribPointer   = _gl.vertexAttribPointer.bind(_gl);
    this.setVertexAttrib1f        = _gl.vertexAttrib1f.bind(_gl);
    this.setVertexAttrib2f        = _gl.vertexAttrib2f.bind(_gl);
    this.setVertexAttrib3f        = _gl.vertexAttrib3f.bind(_gl);
    this.setVertexAttrib4f        = _gl.vertexAttrib4f.bind(_gl);
    this.setVertexAttrib1fv       = _gl.vertexAttrib1fv.bind(_gl);
    this.setVertexAttrib2fv       = _gl.vertexAttrib2fv.bind(_gl);
    this.setVertexAttrib3fv       = _gl.vertexAttrib3fv.bind(_gl);
    this.setVertexAttrib4fv       = _gl.vertexAttrib4fv.bind(_gl);
    this.bindAttribLocation       = _gl.bindAttribLocation.bind(_gl);
    this.enableVertexAttribArray  = _gl.enableVertexAttribArray.bind(_gl);
    this.disableVertexAttribArray = _gl.disableVertexAttribArray.bind(_gl);

    this.VERTEX_ATTRIB_ARRAY_ENABLED        = _gl.VERTEX_ATTRIB_ARRAY_ENABLED;
    this.VERTEX_ATTRIB_ARRAY_SIZE           = _gl.VERTEX_ATTRIB_ARRAY_SIZE;
    this.VERTEX_ATTRIB_ARRAY_STRIDE         = _gl.VERTEX_ATTRIB_ARRAY_STRIDE;
    this.VERTEX_ATTRIB_ARRAY_NORMALIZED     = _gl.VERTEX_ATTRIB_ARRAY_NORMALIZED;
    this.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = _gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING;
    this.CURRENT_VERTEX_ATTRIB              = _gl.CURRENT_VERTEX_ATTRIB;

    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings Multisampling
    /*---------------------------------------------------------------------------------------------------------*/

    this.SAMPLE_COVERAGE_VALUE   = _gl.SAMPLE_COVERAGE_VALUE;
    this.SAMPLE_COVERAGE_INVERT  = _gl.SAMPLE_COVERAGE_INVERT;
    this.SAMPLE_BUFFERS          = _gl.SAMPLE_BUFFERS;
    this.setSampleCoverage       = _gl.sampleCoverage.bind(_gl);

    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings Array Data
    /*---------------------------------------------------------------------------------------------------------*/

    this.POINTS         = _gl.POINTS;
    this.LINES          = _gl.LINES;
    this.LINE_LOOP      = _gl.LINE_LOOP;
    this.LINE_STRIP     = _gl.LINE_STRIP;
    this.TRIANGLES      = _gl.TRIANGLES;
    this.TRIANGLE_FAN   = _gl.TRIANGLE_FAN;
    this.TRIANGLE_STRIP = _gl.TRIANGLE_STRIP;

    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings Blending
    /*---------------------------------------------------------------------------------------------------------*/

    this.BLEND                    = _gl.BLEND;
    this.ZERO                     = _gl.ZERO;
    this.ONE                      = _gl.ONE;
    this.SRC_COLOR                = _gl.SRC_COLOR;
    this.DST_COLOR                = _gl.DST_COLOR;
    this.SRC_ALPHA                = _gl.SRC_ALPHA;
    this.DST_ALPHA                = _gl.DST_ALPHA;
    this.CONSTANT_ALPHA           = _gl.CONSTANT_ALPHA;
    this.ONE_MINUS_SRC_ALPHA      = _gl.ONE_MINUS_SRC_ALPHA;
    this.ONE_MINUS_DST_ALPHA      = _gl.ONE_MINUS_DST_ALPHA;
    this.ONE_MINUS_SRC_COLOR      = _gl.ONE_MINUS_SRC_COLOR;
    this.ONE_MINUS_DST_COLOR      = _gl.ONE_MINUS_DST_COLOR;
    this.ONE_MINUS_CONSTANT_COLOR = _gl.ONE_MINUS_CONSTANT_COLOR;
    this.ONE_MINUS_CONSTANT_ALPHA = _gl.ONE_MINUS_CONSTANT_ALPHA;
    this.FUNC_ADD                 = _gl.FUNC_ADD;
    this.FUNC_SUBTRACT            = _gl.FUNC_SUBTRACT;
    this.FUNC_RESERVE_SUBTRACT    = _gl.FUNC_REVERSE_SUBTRACT;

    this.setBlendFunc             = _gl.blendFunc.bind(_gl);
    this.setBlendFuncSeparate     = _gl.blendFuncSeparate.bind(_gl);
    this.setBlendEquation         = _gl.blendEquation.bind(_gl);
    this.setBlendEquationSeparate = _gl.blendEquationSeparate.bind(_gl);
    this.setBlendColor            = _gl.blendColor.bind(_gl);

    /*---------------------------------------------------------------------------------------------------------*/
    // "Bindings" Light
    /*---------------------------------------------------------------------------------------------------------*/

    this.LIGHT_0 = 0;
    this.LIGHT_1 = 1;
    this.LIGHT_2 = 2;
    this.LIGHT_3 = 3;
    this.LIGHT_4 = 4;
    this.LIGHT_5 = 5;
    this.LIGHT_6 = 6;
    this.LIGHT_7 = 7;
    this.LIGHT_8 = 8;

    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings Misc
    /*---------------------------------------------------------------------------------------------------------*/

    this.viewport     = _gl.viewport.bind(_gl);
    this.enable       = _gl.enable.bind(_gl);
    this.disable      = _gl.disable.bind(_gl);
    this.setLineWidth = _gl.lineWidth.bind(_gl);
    this.flush        = _gl.flush.bind(_gl);
    this.finish       = _gl.finish.bind(_gl);
    this.setScissor   = _gl.scissor.bind(_gl);
    this.getError     = _gl.getError.bind(_gl);
    this.getParameter = _gl.getParameter.bind(_gl);

    this.MAX_VERTEX_UNIFORM_VECTORS   = _gl.MAX_VERTEX_UNIFORM_VECTORS;
    this.MAX_FRAGMENT_UNIFORM_VECTORS = _gl.MAX_FRAGMENT_UNIFORM_VECTORS;
    this.MAX_VERTEX_ATTRIBS           = _gl.MAX_VERTEX_ATTRIBS;

    /*---------------------------------------------------------------------------------------------------------*/
    // Params
    /*---------------------------------------------------------------------------------------------------------*/


    this.SIZE_OF_VERTEX = glkVec3.SIZE;
    this.SIZE_OF_NORMAL = glkVec3.SIZE;
    this.SIZE_OF_COLOR  = glkColor.SIZE;
    this.SIZE_OF_UV     = glkVec2.SIZE;
    this.SIZE_OF_FACE   = glkVec3.SIZE;

    /*---------------------------------------------------------------------------------------------------------*/
    // buffer
    /*---------------------------------------------------------------------------------------------------------*/

    this._bufferColor4f   = glkColor.make();
    this._bufferColorBg4f = glkColor.make();

    /*---------------------------------------------------------------------------------------------------------*/
    // Uniform & Attrib Locations
    /*---------------------------------------------------------------------------------------------------------*/


    this._aVertexPosition    = this.getAttribLocation(  program, 'VertexPosition' );
    this._aVertexNormal      = this.getAttribLocation(  program, 'VertexNormal' );
    this._aVertexColor       = this.getAttribLocation(  program, 'VertexColor' );
    this._aVertexUV          = this.getAttribLocation(  program, 'VertexUV' );
    this._uUseLighting       = this.getUniformLocation( program, 'UseLighting' );
    this._uModelViewMatrix   = this.getUniformLocation( program, 'ModelViewMatrix' );
    this._uPerspectiveMatrix = this.getUniformLocation( program, 'ProjectionMatrix' );
    this._uNormalMatrix      = this.getUniformLocation( program, 'NormalMatrix' );

    this._uPointSize         = this.getUniformLocation( program, 'PointSize' );

    //TODO:FIX Multiple Lights init
    /*---------------------------------------------------------------------------------------------------------*/
    // Lights Init & bindings
    /*---------------------------------------------------------------------------------------------------------*/


    this._lightsNum    = 0;
    this._lightsNumMax = 1;
    var lights = this._lights = new Array(this._lightsNumMax);

    var i = -1,light;

    while(++i < lights.length)
    {
        light = lights[i] = new GLKLight_Internal(i);
        light.uPosition      = this.getUniformLocation(program,'Lights.position');
        light.uColorAmbient  = this.getUniformLocation(program,'Lights.colorAmbient');
        light.uColorDiffuse  = this.getUniformLocation(program,'Lights.colorDiffuse');
        light.uColorSpecular = this.getUniformLocation(program,'Lights.colorSpecular');
        light.uShininess     = this.getUniformLocation(program,'Lights.shininess');

        /*
         lights.uPosition      = _gl.getUniformLocation(program,'Lights['+i+].position');
         lights.uColorAmbient  = _gl.getUniformLocation(program,'Lights['+i+'].colorAmbient');
         lights.uColorDiffuse  = _gl.getUniformLocation(program,'Lights['+i+'].colorDiffuse');
         lights.uColorSpecular = _gl.getUniformLocation(program,'Lights['+i+'].colorSpecular');
         lights.uShininess     = _gl.getUniformLocation(program,'Lights['+i+'].shininess');
         */
    }

    this._lighting = true;

    /*---------------------------------------------------------------------------------------------------------*/
    // Matrices Init
    /*---------------------------------------------------------------------------------------------------------*/


    this._modelViewMatrix  = null;
    this._projectionMatrix = null;
    this._normalMatrix     = glkMat44.make();

    this._matrixStack = [];
    this._matrixTemp  = glkMat44.make();















    this.enableDepthTest(true);



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

        this._gl.uniformMatrix4fv(this._uModelViewMatrix,   false,this._modelViewMatrix);
        this._gl.uniformMatrix4fv(this._uPerspectiveMatrix, false,this._projectionMatrix);

        if(!this._lighting)return;
    },

    bindLight : function(light,lightID)
    {
        light.bind(this._lights[lightID]);
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

    rotateVec3 : function(vec)
    {
        glkMat44.multPost(this._modelViewMatrix,glkMat44.rotateXYZ(vec[0],vec[1],vec[2]));
    },


    enableLighting : function()
    {
        this._lighting = true;

    },

    disableLighting : function()
    {
        this._lighting = false;

    },

    /*---------------------------------------------------------------------------------------------------------*/
    // Draw
    /*---------------------------------------------------------------------------------------------------------*/

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

    /*---------------------------------------------------------------------------------------------------------*/
    // Fill Array Buffer
    /*---------------------------------------------------------------------------------------------------------*/


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

    /*---------------------------------------------------------------------------------------------------------*/
    // Set current color
    /*---------------------------------------------------------------------------------------------------------*/

    color   : function(color)  {glkColor.set(this._bufferColor4f,color);},
    color4f : function(r,g,b,a){glkColor.set4f(this._bufferColor4f,r,g,b,a);},
    color3f : function(r,g,b)  {glkColor.set3f(this._bufferColor4f,r,g,b);},
    color2f : function(k,a)    {glkColor.set2f(this._bufferColor4f,k,a);},
    color1f : function(k)      {glkColor.set1f(this._bufferColor4f,k);},

    /*---------------------------------------------------------------------------------------------------------*/
    // Clear
    /*---------------------------------------------------------------------------------------------------------*/

    clearColor : function(color){this.clear4f(color[0],color[1],color[2],color[3]);},
    clear      : function()     {this.clear4f(0,0,0,1);},
    clear3f    : function(r,g,b){this.clear4f(r,g,b,1);},
    clear2f    : function(k,a)  {this.clear4f(k,k,k,a);},
    clear1f    : function(k)    {this.clear4f(k,k,k,1.0);},

    clear4f : function(r,g,b,a)
    {
        var c = this._bufferColorBg4f;
        glkColor.set4f(c,r,g,b,a);

        var gl = this._gl;
        gl.clearColor(c[0],c[1],c[2],c[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },

    getClearColor : function()
    {
        return this._bufferColorBg4f;
    },

    /*---------------------------------------------------------------------------------------------------------*/
    // Depth Test
    /*---------------------------------------------------------------------------------------------------------*/

    enableDepthTest : function(bool)
    {
        if(bool)this.enable(this.DEPTH_TEST);else this.disable(this.DEPTH_TEST);
    },

    /*---------------------------------------------------------------------------------------------------------*/
    // Blending
    /*---------------------------------------------------------------------------------------------------------*/

    enableBlend : function(bool)
    {
        if(bool)this.enable(this.BLEND);else this.disable(this.BLEND);
    },

    resetBlend : function()
    {
        this._gl.blendFunc(this.SRC_ALPHA,this.ONE_MINUS_SRC_ALPHA);
    },

    /*---------------------------------------------------------------------------------------------------------*/
    // Draw
    /*---------------------------------------------------------------------------------------------------------*/

    line : function(v0,v1)
    {

    },

    draw : function(geom3d)
    {

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