GLKit.GL = function(gl)
{
    /*---------------------------------------------------------------------------------------------------------*/

    var _gl = this._gl = gl;

    this._progVertexShader = GLKit.ShaderLoader.loadShaderFromString(_gl,GLKit.ProgVertexShader,_gl.VERTEX_SHADER);
    this._progFragShader   = GLKit.ShaderLoader.loadShaderFromString(_gl,GLKit.ProgFragShader,  _gl.FRAGMENT_SHADER);

    var program = this._program = GLKit.ProgLoader.loadProgram(_gl,this._progVertexShader,this._progFragShader);

    _gl.useProgram(program);

    /*---------------------------------------------------------------------------------------------------------*/
    // Bind & enable shader attributes & uniforms
    /*---------------------------------------------------------------------------------------------------------*/

    this._aVertexPosition    = _gl.getAttribLocation(  program, 'VertexPosition' );
    this._aVertexNormal      = _gl.getAttribLocation(  program, 'VertexNormal' );
    this._aVertexColor       = _gl.getAttribLocation(  program, 'VertexColor' );
    this._aVertexUV          = _gl.getAttribLocation(  program, 'VertexUV' );
    this._uUseLighting       = _gl.getUniformLocation( program, 'UseLighting' );

    this._uModelViewMatrix   = _gl.getUniformLocation( program, 'ModelViewMatrix' );
    this._uPerspectiveMatrix = _gl.getUniformLocation( program, 'ProjectionMatrix' );
    this._uNormalMatrix      = _gl.getUniformLocation( program, 'NormalMatrix' );

    this._uPointSize         = _gl.getUniformLocation( program, 'PointSize' );

    _gl.enableVertexAttribArray(this._aVertexPosition);
    _gl.enableVertexAttribArray(this._aVertexNormal);
    _gl.enableVertexAttribArray(this._aVertexColor);
    _gl.enableVertexAttribArray(this._aVertexUV);

    /*---------------------------------------------------------------------------------------------------------*/
    // Pre Bind ARRAY_BUFFER & ELEMENT_ARRAY_BUFFER
    /*---------------------------------------------------------------------------------------------------------*/

    this._abo  = _gl.createBuffer();
    this._eabo = _gl.createBuffer();

    _gl.bindBuffer(_gl.ARRAY_BUFFER,         this._abo);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this._eabo);

    /*---------------------------------------------------------------------------------------------------------*/
    // Bind constants
    /*---------------------------------------------------------------------------------------------------------*/

    this.DEPTH_TEST               = _gl.DEPTH_TEST;

    this.SAMPLE_COVERAGE_VALUE    = _gl.SAMPLE_COVERAGE_VALUE;
    this.SAMPLE_COVERAGE_INVERT   = _gl.SAMPLE_COVERAGE_INVERT;
    this.SAMPLE_BUFFERS           = _gl.SAMPLE_BUFFERS;

    this.POINTS                   = _gl.POINTS;
    this.LINES                    = _gl.LINES;
    this.LINE_LOOP                = _gl.LINE_LOOP;
    this.LINE_STRIP               = _gl.LINE_STRIP;
    this.TRIANGLES                = _gl.TRIANGLES;
    this.TRIANGLE_FAN             = _gl.TRIANGLE_FAN;
    this.TRIANGLE_STRIP           = _gl.TRIANGLE_STRIP;

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
    this.FUNC_REVERSVE_SUBTRACT   = _gl.FUNC_REVERSE_SUBTRACT;

    var SIZE_OF_VERTEX  = GLKit.Vec3.SIZE,
        SIZE_OF_COLOR   = GLKit.Color.SIZE,
        SIZE_OF_UV      = GLKit.Vec2.SIZE;

    this.SIZE_OF_VERTEX = SIZE_OF_VERTEX;
    this.SIZE_OF_NORMAL = SIZE_OF_VERTEX;
    this.SIZE_OF_COLOR  = SIZE_OF_COLOR;
    this.SIZE_OF_UV     = SIZE_OF_UV;
    this.SIZE_OF_FACE   = SIZE_OF_VERTEX;

    this.SIZE_OF_QUAD     = SIZE_OF_VERTEX * 4;
    this.SIZE_OF_TRIANGLE = SIZE_OF_VERTEX * 3;
    this.SIZE_OF_LINE     = SIZE_OF_VERTEX * 4;
    this.SIZE_OF_POINT    = SIZE_OF_VERTEX;

    /*---------------------------------------------------------------------------------------------------------*/
    // Bind methods
    /*---------------------------------------------------------------------------------------------------------*/

    this.sampleCoverage        = _gl.sampleCoverage.bind(_gl);

    this.blendFunc             = _gl.blendFunc.bind(_gl);
    this.blendFuncSeparate     = _gl.blendFuncSeparate.bind(_gl);
    this.blendEquation         = _gl.blendEquation.bind(_gl);
    this.blendEquationSeparate = _gl.blendEquationSeparate.bind(_gl);
    this.blendColor            = _gl.blendColor.bind(_gl);

    this.viewport              = _gl.viewport.bind(_gl);
    this.enable                = _gl.enable.bind(_gl);
    this.disable               = _gl.disable.bind(_gl);
    this.lineWidth             = _gl.lineWidth.bind(_gl);
    this.flush                 = _gl.flush.bind(_gl);
    this.finish                = _gl.finish.bind(_gl);
    this.scissor               = _gl.scissor.bind(_gl);

    /*---------------------------------------------------------------------------------------------------------*/
    // Init Buffers
    /*---------------------------------------------------------------------------------------------------------*/

    this._bColor4f   = GLKit.Color.copy(GLKit.Color.WHITE);
    this._bColor     = null;
    this._bColorBg4f = GLKit.Color.copy(GLKit.Color.BLACK);

    this._bVertexQuad               = new Float32Array(this.SIZE_OF_QUAD);
    this._bNormalQuad               = new Float32Array(this.SIZE_OF_QUAD);
    this._bColorQuad                = new Float32Array(this.SIZE_OF_COLOR * 4);
    this._bUVQuad                   = new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);
    this._bUVQuadDefault            = new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);
    this._bIndicesQuad              = new Uint16Array( [0,1,3,1,2,3]);

    this._bNormalsRect              = new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]);

    this._bVerticesTriangle         = new Float32Array(this.SIZE_OF_TRIANGLE);
    this._bVerticesLine             = new Float32Array(this.SIZE_OF_LINE);
    this._bVerticesPoint            = new Float32Array(this.SIZE_OF_POINT);
    this._bVerticesEllipse          = new Float32Array(this.ELLIPSE_DETAIL_MAX * SIZE_OF_VERTEX);

    this._bTexCoordsTriangleDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0]);
    this._bTexCoordsTriangle        = new Float32Array(this._bTexCoordsTriangleDefault.length);
    this._bTexCoordsEllipse         = new Float32Array(this._bVerticesEllipse.length);

    this._bColorVertex              = new Float32Array(SIZE_OF_COLOR);

    this._bColorTriangle            = new Float32Array(SIZE_OF_COLOR * 3);
    this._bColorLine                = new Float32Array(SIZE_OF_COLOR * 2);
    this._bColorPoint               = new Float32Array(SIZE_OF_COLOR);
    this._bColorEllipse             = new Float32Array(SIZE_OF_COLOR * this.ELLIPSE_DETAIL_MAX);

    this._iTriangle = [0,1,2];
    this._iQuad     = [0,1,2,1,2,3];

    this._bScreenCoords = new Float32Array([0,0]);

    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/

    this._camera = null;

   // this._mModelView   = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
   // this._mPerspective = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    this._mNormal      = new Float32Array([1,0,0,0,1,0,0,0,1]);
    this._mTemp        = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    this._mArcBall     = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    this._mStack       = [];

    /*---------------------------------------------------------------------------------------------------------*/
    // Init presets
    /*---------------------------------------------------------------------------------------------------------*/

    _gl.enable(_gl.BLEND);
    _gl.enable(_gl.DEPTH_TEST);


};

GLKit.GL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.loadIdentity = function(){this._camera.modelViewMatrix = GLKit.Mat44.identity(this._camera.modelViewMatrix);};
GLKit.GL.prototype.pushMatrix   = function(){this._mStack.push(GLKit.Mat44.copy(this._camera.modelViewMatrix));};
GLKit.GL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw ('Invalid pop!');
    this._mStack = stack.pop();

    return this._mStack;
};

GLKit.GL.prototype._setMatricesUniform = function()
{
    var gl = this._gl;
    var camera = this._camera;

    gl.uniformMatrix4fv(this._uModelViewMatrix,  false,camera.modelViewMatrix);
    gl.uniformMatrix4fv(this._uPerspectiveMatrix,false,camera.perspectiveMatrix);

    if(!this._lighting)return;




}


/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.translate   = function(v)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeTranslate(v[0],v[1],v[1]));};
GLKit.GL.prototype.translate3f = function(x,y,z){this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeTranslate(x,y,z));};
GLKit.GL.prototype.translateX  = function(x)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeTranslate(x,0,0));};
GLKit.GL.prototype.translateY  = function(y)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeTranslate(0,y,0));};
GLKit.GL.prototype.translateZ  = function(z)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeTranslate(0,0,z));};
GLKit.GL.prototype.scale       = function(v)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeScale(v[0],v[1],v[2]));};
GLKit.GL.prototype.scale3f     = function(x,y,z){this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeScale(x,y,z));};
GLKit.GL.prototype.scaleX      = function(x)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeScale(x,1,1));};
GLKit.GL.prototype.scaleY      = function(y)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeScale(1,y,1));};
GLKit.GL.prototype.scaleZ      = function(z)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeScale(1,1,z));};
GLKit.GL.prototype.rotate      = function(v)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeRotationXYZ(v[0],v[1],v[2]));};
GLKit.GL.prototype.rotate3f    = function(x,y,z){this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeRotationXYZ(x,y,z));};
GLKit.GL.prototype.rotateX     = function(x)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeRotationX(x));};
GLKit.GL.prototype.rotateY     = function(y)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeRotationY(y));};
GLKit.GL.prototype.rotateZ     = function(z)    {this._camera.modelViewMatrix = GLKit.Mat44.multPost(this._camera.modelViewMatrix,GLKit.Mat44.makeRotationZ(z));};

/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexUInt16Array,mode)
{
    mode = mode || this.TRIANGLES;
    this._fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();

    var gl = this._gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexUInt16Array,gl.DYNAMIC_DRAW);
    gl.drawElements(mode,indexUInt16Array.length,gl.UNSIGNED_SHORT,0);
};

GLKit.GL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{
    this._fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    this._gl.drawArrays(mode,first,count);
};


/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype._fillArrayBuffer = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array)
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

};

GLKit.GL.prototype._fillArrayBufferVertsCols = function(vertexFloat32Array,colorFloat32Array)
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
};

GLKit.GL.prototype._applyColorToColorBuffer = function(srcColor,distBuffer)
{
    var i = 0;

    if(srcColor.length == this.SIZE_OF_COLOR)
    {
        while(i < dstBuffer.length)
        {
            distBuffer[i  ] = srcColor[0];
            distBuffer[i+1] = srcColor[1];
            distBuffer[i+2] = srcColor[2];
            distBuffer[i+3] = srcColor[3];
            i+=4;
        }
    }
    else
    {
        if(distBuffer.length != distBuffer.length)
        {
            throw ("Color array length not equal to number of vertices.");
        }

        while(i < distBuffer.length)
        {
            distBuffer[i  ] = srcColor[i  ];
            distBuffer[i+1] = srcColor[i+1];
            distBuffer[i+2] = srcColor[i+2];
            distBuffer[i+3] = srcColor[i+3];
            i+=4;
        }
    }
    return distBuffer;
};


/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.color   = function(color)  {this._bColor = glkColor.set(this._bColor4f,color);};
GLKit.GL.prototype.color4f = function(r,g,b,a){this._bColor = glkColor.set4f(this._bColor4f,r,g,b,a);};
GLKit.GL.prototype.color3f = function(r,g,b)  {this._bColor = glkColor.set3f(this._bColor4f,r,g,b);};
GLKit.GL.prototype.color2f = function(k,a)    {this._bColor = glkColor.set2f(this._bColor4f,k,a);};
GLKit.GL.prototype.color1f = function(k)      {this._bColor = glkColor.set1f(this._bColor4f,k);};
GLKit.GL.prototype.colorfv = function(array)  {this._bColor = array;};

GLKit.GL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
GLKit.GL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
GLKit.GL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
GLKit.GL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
GLKit.GL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
GLKit.GL.prototype.clear4f   = function(r,g,b,a)
{
    var c  = GLKit.Color.set4f(this._bColorBg4f,r,g,b,a);
    var gl = this._gl;
    gl.clearColor(c[0],c[1],c[2],c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


GLKit.GL.prototype.getColorBuffer = function(){return this._bColor;};
GLKit.GL.prototype.getClearBuffer = function(){return this._bColorBg4f;};


/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.getGL     = function(){return this._gl;};

/*
GLKit.GL.prototype.setModelViewMatrix  = function(matrix){this._modelViewMatrix  = matrix;};
GLKit.GL.prototype.setProjectionMatrix = function(matrix){this._projectionMatrix = matrix;};
GLKit.GL.prototype.getModelViewMatrix  = function(){return this._modelViewMatrix;};
GLKit.GL.prototype.getProjectionMatrix = function(){return this._projectionMatrix;};
*/