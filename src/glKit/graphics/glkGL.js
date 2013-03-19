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

    _gl.useProgram(program);

    this._abo  = _gl.createBuffer();
    this._eabo = _gl.createBuffer();

    _gl.bindBuffer(_gl.ARRAY_BUFFER,         this._abo);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this._eabo);

    //TODO:Transform to proper english & finish bindings
    /*---------------------------------------------------------------------------------------------------------*/
    // Bindings
    //
    // All necessary  webgl methods are bound, and following a naming convention.
    // Where feasible webgl methods are replaced by more convenient methods.
    // (e.g drawElements, which now includes automatic setting of buffer data,
    //  matrices....)
    //
    // The 'original' methods can still be accessed via the returned gl object from getGL()
    //
    /*---------------------------------------------------------------------------------------------------------*/

    /*---------------------------------------------------------------------------------------------------------*/
    // Mode Depth Test
    /*---------------------------------------------------------------------------------------------------------*/

    this.DEPTH_TEST     = _gl.DEPTH_TEST;

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

    /*---------------------------------------------------------------------------------------------------------*/
    // Params
    /*---------------------------------------------------------------------------------------------------------*/

    var SIZE_OF_VERTEX  = glkVec3.SIZE;

    this.SIZE_OF_VERTEX = SIZE_OF_VERTEX;
    this.SIZE_OF_NORMAL = SIZE_OF_VERTEX;
    this.SIZE_OF_COLOR  = glkColor.SIZE;
    this.SIZE_OF_UV     = glkVec2.SIZE;
    this.SIZE_OF_FACE   = SIZE_OF_VERTEX;

    this.SIZE_OF_QUAD     = SIZE_OF_VERTEX * 4;
    this.SIZE_OF_TRIANGLE = SIZE_OF_VERTEX * 3;
    this.SIZE_OF_LINE     = SIZE_OF_VERTEX * 4;
    this.SIZE_OF_POINT    = SIZE_OF_VERTEX;

    this.ELLIPSE_DETAIL_MAX = 30;

    /*---------------------------------------------------------------------------------------------------------*/
    // buffers
    /*---------------------------------------------------------------------------------------------------------*/

    this._bColor4f   = glkColor.make();
    this._bColor     = null;
    this._bColorBg4f = glkColor.make();

    this._bVertexQuad     = new Float32Array(this.SIZE_OF_QUAD);
    this._bNormalQuad     = new Float32Array(this.SIZE_OF_QUAD);
    this._bColorQuad      = new Float32Array(this.SIZE_OF_COLOR * 4);
    this._bUVQuad         = new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);
    this._bUVQuadDefault  = new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);
    this._bIndicesQuad    = new Uint16Array( [0,1,3,1,2,3]);

    this._bNormalsRect    = new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]);

    this._bVerticesTriangle  = new Float32Array(this.SIZE_OF_TRIANGLE);
    this._bVerticesLine      = new Float32Array(this.SIZE_OF_LINE);
    this._bVerticesPoint     = new Float32Array(this.SIZE_OF_POINT);
    this._bVerticesEllipse   = new Float32Array(this.ELLIPSE_DETAIL_MAX * SIZE_OF_VERTEX);
    this._bVerticesRoundRect = new Float32Array(this.ELLIPSE_DETAIL_MAX * SIZE_OF_VERTEX + this.SIZE_OF_QUAD);

    this._bIndicesRoundRect  = new Uint16Array( (this._bVerticesRoundRect.length / SIZE_OF_VERTEX - 2) * this.SIZE_OF_FACE);


    this._bTexCoordsTriangleDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0]);
    this._bTexCoordsTriangle        = new Float32Array(this._bTexCoordsTriangleDefault.length);
    this._bTexCoordsEllipse         = new Float32Array(this._bVerticesEllipse.length);

    var SIZE_OF_COLOR =  this.SIZE_OF_COLOR;

    this._bColorVertex    = new Float32Array(SIZE_OF_COLOR);

    this._bColorTriangle  = new Float32Array(SIZE_OF_COLOR * 3);
    this._bColorLine      = new Float32Array(SIZE_OF_COLOR * 2);
    this._bColorPoint     = new Float32Array(SIZE_OF_COLOR);
    this._bColorEllipse   = new Float32Array(SIZE_OF_COLOR * this.ELLIPSE_DETAIL_MAX);
    this._bColorRoundRect = new Float32Array(this._bVerticesRoundRect.length / SIZE_OF_VERTEX * SIZE_OF_COLOR);

    this._iTriangle = [0,1,2];
    this._iQuad     = [0,1,2,1,2,3];

    this._bScreenCoords = new Float32Array([0,0]);



    /*---------------------------------------------------------------------------------------------------------*/
    // Uniform & Attrib Locations
    /*---------------------------------------------------------------------------------------------------------*/


    this._aVertexPosition    = gl.getAttribLocation(  program, 'VertexPosition' );
    this._aVertexNormal      = gl.getAttribLocation(  program, 'VertexNormal' );
    this._aVertexColor       = gl.getAttribLocation(  program, 'VertexColor' );
    this._aVertexUV          = gl.getAttribLocation(  program, 'VertexUV' );
    this._uUseLighting       = gl.getUniformLocation( program, 'UseLighting' );

    this._uModelViewMatrix   = gl.getUniformLocation( program, 'ModelViewMatrix' );
    this._uPerspectiveMatrix = gl.getUniformLocation( program, 'ProjectionMatrix' );
    this._uNormalMatrix      = gl.getUniformLocation( program, 'NormalMatrix' );

    this._uPointSize         = gl.getUniformLocation( program, 'PointSize' );

    _gl.enableVertexAttribArray(this._aVertexPosition);
    _gl.enableVertexAttribArray(this._aVertexNormal);
    _gl.enableVertexAttribArray(this._aVertexColor);
    _gl.enableVertexAttribArray(this._aVertexUV);

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
        light.uPosition      = gl.getUniformLocation(program,'Lights.position');
        light.uColorAmbient  = gl.getUniformLocation(program,'Lights.colorAmbient');
        light.uColorDiffuse  = gl.getUniformLocation(program,'Lights.colorDiffuse');
        light.uColorSpecular = gl.getUniformLocation(program,'Lights.colorSpecular');
        light.uShininess     = gl.getUniformLocation(program,'Lights.shininess');

        /*
         lights.uPosition      = _gl.getUniformLocation(program,'Lights['+i+].position');
         lights.uColorAmbient  = _gl.getUniformLocation(program,'Lights['+i+'].colorAmbient');
         lights.uColorDiffuse  = _gl.getUniformLocation(program,'Lights['+i+'].colorDiffuse');
         lights.uColorSpecular = _gl.getUniformLocation(program,'Lights['+i+'].colorSpecular');
         lights.uShininess     = _gl.getUniformLocation(program,'Lights['+i+'].shininess');
         */
    }

    this._lighting = true;



    this.MATERIAL_WIREFRAME = 0;
    this.MATERIAL_COLOR     = 1;
    this.MATERIAL_TEXTURE   = 2;
    this.CENTER = 0;
    this.CORNER = 1;

    this._modeRectangle = 0;
    this._modeEllipse   = 0;
    this._modeMaterial  = 1;

    this._autoUpdateNormals = true;

    /*---------------------------------------------------------------------------------------------------------*/
    // Matrices Init
    /*---------------------------------------------------------------------------------------------------------*/


    this._modelViewMatrix  = null;
    this._projectionMatrix = null;
    this._normalMatrix     = glkMat44.make();

    this._matrixStack = [];
    this._matrixTemp  = glkMat44.make();

    /*---------------------------------------------------------------------------------------------------------*/
    // Init
    /*---------------------------------------------------------------------------------------------------------*/

    this.enableBlend(true);
    this.enableDepthTest(true);
}




GLKGL.prototype =
{
    setModelViewMatrix  : function(matrix){this._modelViewMatrix  = matrix;},
    setProjectionMatrix : function(matrix){this._projectionMatrix = matrix;},

    setMatrices : function(camera)
    {
        this._modelViewMatrix  = camera.getModelViewMatrix();
        this._projectionMatrix = camera.getProjectionMatrix();
    },

    getModelViewMatrix  : function(){return this._modelViewMatrix;},
    getProjectionMatrix : function(){return this._projectionMatrix;},

    setMatricesUniform : function()
    {
        var gl = this._gl;



        this._gl.uniformMatrix4fv(this._uModelViewMatrix,   false,this._modelViewMatrix);
        this._gl.uniformMatrix4fv(this._uPerspectiveMatrix, false,this._projectionMatrix);

        if(!this._lighting)return;
    },

    bindLight : function(light,lightID){light.bind(this._lights[lightID]);},

    setMaterial    : function(mode){this._modeMaterial  = mode;},
    setRectMode    : function(mode){this._modeRectangle = mode;},
    setEllipseMode : function(mode){this._modeEllipse   = mode;},

    enableAutoUpdateNormals : function(bool){this._autoUpdateNormals = bool;},

    /*---------------------------------------------------------------------------------------------------------*/
    // Matrix stack methods
    /*---------------------------------------------------------------------------------------------------------*/

    loadIdentity : function()
    {
        this._modelViewMatrix = glkMat44.identity(this._modelViewMatrix);
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

    translate : function(vec)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeTranslate(vec[0],vec[1],vec[2]));
    },

    translateXYZ : function(x,y,z)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeTranslate(x,y,z));
    },

    scale : function(x,y,z)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeScale(x,y,z));
    },

    rotateX : function(a)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeRotationX(a));
    },

    rotateY : function(a)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeRotationY(a));
    },

    rotateZ : function(a)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeRotationZ(a));
    },

    rotateXYZ : function(ax,ay,az)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeRotationXYZ(ax,ay,az));
    },

    rotateVec3 : function(vec)
    {
        this._modelViewMatrix = glkMat44.multPost(this._modelViewMatrix,glkMat44.makeRotationXYZ(vec[0],vec[1],vec[2]));
    },

    /*---------------------------------------------------------------------------------------------------------*/
    // Lighting
    /*---------------------------------------------------------------------------------------------------------*/

    enableLighting : function()
    {
        this._lighting = true;

    },

    disableLighting : function()
    {
        this._lighting = false;

    },

    /*---------------------------------------------------------------------------------------------------------*/
    // Draw Array Data
    /*---------------------------------------------------------------------------------------------------------*/

    drawElements : function(vertexFloat32Array,
                            normalFloat32Array,
                            colorFloat32Array,
                            uvFloat32Array,
                            indexUInt16Array,mode)
    {

        mode = mode || this.TRIANGLES;
        this._fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
        this.setMatricesUniform();

        var gl = this._gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexUInt16Array,gl.DYNAMIC_DRAW);
        gl.drawElements(mode,indexUInt16Array.length,gl.UNSIGNED_SHORT,0);
    },

    drawArrays : function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
    {
        this._fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
        this.setMatricesUniform();
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
            uvablen = uva ? uvFloat32Array.byteLength : 0,
            tblen   = vblen + nblen + cblen + uvablen;

        var offsetV  = 0,
            offsetN  = offsetV + vblen,
            offsetC  = offsetN + nblen,
            offsetUV = offsetC + cblen;


        gl.bufferData(glArrayBuffer, tblen, gl.DYNAMIC_DRAW);

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

    _fillArrayBufferVertsCols : function(vertexFloat32Array,colorFloat32Array)
    {
        var gl  = this.gl;
        var glArrayBuffer = gl.ARRAY_BUFFER,
            glDynamicDraw = gl.DYNAMIC_DRAW,
            glFloat       = gl.FLOAT;

        var vblen = vertexFloat32Array.byteLength,
            cblen = colorFloat32Array.byteLength,
            tblen = vblen + cblen;

        gl.bufferData(glArrayBuffer,tblen,glDynamicDraw);
        gl.bufferSubData(glArrayBuffer,0,vertexFloat32Array);
        gl.bufferSubData(glArrayBuffer,vblen,colorFloat32Array);
        gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX,glFloat,false,0,0);
        gl.vertexAttribPointer(this._aVertexColor   , this.SIZE_OF_COLOR, glFloat,false,0,vblen);

    },


    _applyColorToColorBuffer : function(srcColor,dstBuffer)
    {
        var i = 0;

        if(srcColor.length == this.SIZE_OF_COLOR)
        {
            while(i < dstBuffer.length)
            {
                dstBuffer[i  ] = srcColor[0];
                dstBuffer[i+1] = srcColor[1];
                dstBuffer[i+2] = srcColor[2];
                dstBuffer[i+3] = srcColor[3];
                i+=4;
            }
        }
        else
        {
            if(srcColor.length != dstBuffer.length)
            {
                throw ("Color array length not equal to number of vertices.");
            }

            while(i < dstBuffer.length)
            {
                dstBuffer[i  ] = srcColor[i  ];
                dstBuffer[i+1] = srcColor[i+1];
                dstBuffer[i+2] = srcColor[i+2];
                dstBuffer[i+3] = srcColor[i+3];
                i+=4;
            }
        }
        return dstBuffer;

    },


    /*---------------------------------------------------------------------------------------------------------*/
    // Shader & program loading
    /*---------------------------------------------------------------------------------------------------------*/

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

    color   : function(color)  {this._bColor = glkColor.set(this._bColor4f,color);},
    color4f : function(r,g,b,a){this._bColor = glkColor.set4f(this._bColor4f,r,g,b,a);},
    color3f : function(r,g,b)  {this._bColor = glkColor.set3f(this._bColor4f,r,g,b);},
    color2f : function(k,a)    {this._bColor = glkColor.set2f(this._bColor4f,k,a);},
    color1f : function(k)      {this._bColor = glkColor.set1f(this._bColor4f,k);},
    colorfv : function(array)  {this._bColor = array;},

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
        var c = glkColor.set4f(this._bColorBg4f,r,g,b,a);

        var gl = this._gl;
        gl.clearColor(c[0],c[1],c[2],c[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },

    getClearColor : function()
    {
        return this._bColorBg4f;
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

    point : function(v0)
    {
        var v = this._bVerticesPoint,
            c = this._applyColorToColorBuffer(this._bColor4f,this._bColorPoint);

        v[0] = v0[0];
        v[1] = v0[1];
        v[2] = v0[2];

        this.setMatricesUniform();
        this._fillArrayBuffer(v,null,c,null);
        this._gl.drawArrays(this.POINTS,0,1);
    },

    _quadf : function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,normals)
    {
        var gl = this._gl,
            v  = this._bVertexQuad;

        this.setMatricesUniform();

        v[ 0] = x0;
        v[ 1] = y0;
        v[ 2] = z0;
        v[ 3] = x1;
        v[ 4] = y1;
        v[ 5] = z1;
        v[ 6] = x2;
        v[ 7] = y2;
        v[ 8] = z2;
        v[ 9] = x3;
        v[10] = y3;
        v[11] = z3;

        var materialMode = this._modeMaterial;
        var c = this._applyColorToColorBuffer(this._bColor,this._bColorQuad);

        if(materialMode == this.MATERIAL_WIREFRAME)
        {
            this._fillArrayBufferVertsCols(v,c);
            gl.drawArrays(this.LINE_LOOP,0,4);
        }
        else if(materialMode == this.MATERIAL_COLOR)
        {
            if(normals)
            {
                if(this._autoUpdateNormals)
                {
                    this._setVertexNormals(this._bNormalQuad,v,this._bIndicesQuad);
                }
                else
                {
                    this._fillArrayBuffer(v,normals,c,null);
                }

            }
            else
            {
                this._fillArrayBufferVertsCols(v,c);
            }
            gl.drawArrays(this.TRIANGLE_STRIP,0,4);
        }
        else if(materialMode == this.MATERIAL_TEXTURE)
        {

        }

    },

    quad : function(v0,v1,v2,v3)
    {
        this._quadf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2],v2[0],v2[1],v2[2],v3[0],v3[1],v3[2]);
    },



    rectf : function(x,y,z,width,height)
    {
        var cm = this._modeRectangle == this.CENTER,
            rx,ry = y,rz,rw,rh;

        var autoUpdateNormals = this._autoUpdateNormals;
        this.enableAutoUpdateNormals(false);

        if(cm)
        {
            var w2 = width  * 0.5,
                h2 = height * 0.5;

            rx = x - w2;
            rz = z - h2;
            rw = x + w2;
            rh = z + h2;
        }
        else
        {
            rx = x;
            rz = z;
            rw = x+width;
            rh = z+height;
        }

        this._quadf(rx,ry,rz,
                    rw,ry,rh,
                    rw,ry,rh,
                    rx,ry,rh, this._bNormalsRect);

        this.enableAutoUpdateNormals(autoUpdateNormals);


    },

    rect : function(v,width,height)
    {
        this.rectf(v[0],v[1],v[3],width,height);
    },


    line : function(v0,v1)
    {
        this.linef(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);
    },

    linef : function(x0,y0,z0,x1,y1,z1)
    {
        var v = this._bVerticesLine,
            c = this._applyColorToColorBuffer(this._bColor,this._bColorLine);

        v[0] = x0;
        v[1] = y0;
        v[2] = z0;
        v[3] = x1;
        v[4] = y1;
        v[5] = z1;

        this._fillArrayBufferVertsCols(v,c);
        this._gl.drawArrays(this.LINES,0,2);
    },

    linefv : function(array)
    {
        if(array.length == 6)
        {
            this.linef(array[0],array[1],array[2],array[3],array[4],array[5]);
            return;
        }

        this._polyline(array);
    },

    _polyline : function(array)
    {

    },

    draw : function(geom3d)
    {

    },

    _setVertexNormals : function(normals,vertices,indices)
    {
        var i;
        var a, b, c, d;
        var e2x, e2y, e2z,
            e1x, e1y, e1z;

        var nx, ny, nz,
            vbx, vby, vbz,
            a0, a1, a2,
            b0, b1, b2,
            c0, c1, c2;

        var n;

        i = 0;
        while( i < normals.length )
        {
            normals[i] = normals[i+1] = normals[i+2] = 0.0;
            i+=3;
        }

        i = 0;
        while( i < indices.length )
        {
            a = indices[i  ]*3;
            b = indices[i+1]*3;
            c = indices[i+2]*3;

            a0 = a;
            a1 = a+1;
            a2 = a+2;

            b0 = b;
            b1 = b+1;
            b2 = b+2;

            c0 = c;
            c1 = c+1;
            c2 = c+2;

            vbx = vertices[b0];
            vby = vertices[b1];
            vbz = vertices[b2];

            e1x = vertices[a0]-vbx;
            e1y = vertices[a1]-vby;
            e1z = vertices[a2]-vbz;

            e2x = vertices[c0]-vbx;
            e2y = vertices[c1]-vby;
            e2z = vertices[c2]-vbz;

            nx = e1y * e2z - e1z * e2y;
            ny = e1z * e2x - e1x * e2z;
            nz = e1x * e2y - e1y * e2x;

            normals[a0] += nx;
            normals[a1] += ny;
            normals[a2] += nz;

            normals[b0] += nx;
            normals[b1] += ny;
            normals[b2] += nz;

            normals[c0] += nx;
            normals[c1] += ny;
            normals[c2] += nz;

            i+=3;
        }

    },

















    /*---------------------------------------------------------------------------------------------------------*/
    // GL Webgl
    /*---------------------------------------------------------------------------------------------------------*/


    getGL : function()
    {
        return this._gl;
    }


};