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

    this._aVertexPosition   = gl.getAttribLocation(program,"aVertexPosition");
    this._aVertexNormal     = gl.getAttribLocation(program,"aVertexNormal");
    this._aVertexColor      = gl.getAttribLocation(program,"aVertexColor");
    this._aVertexUV         = gl.getAttribLocation(program,"aVertexUV");

    this._uModelViewMatrix   = gl.getUniformLocation(program,"uModelViewMatrix");
    this._uProjectionMatrix  = gl.getUniformLocation(program,"uProjectionMatrix");
    this._uNormalMatrix      = gl.getUniformLocation(program,"uNormalMatrix");

    this._uPointSize         = gl.getUniformLocation(program,"uPointSize");



    this.LIGHT_0    = 0;
    this.LIGHT_1    = 1;
    this.LIGHT_2    = 2;
    this.LIGHT_3    = 3;
    this.LIGHT_4    = 4;
    this.LIGHT_5    = 5;
    this.LIGHT_6    = 6;
    this.LIGHT_7    = 7;
    this.MAX_LIGHTS = 8;

    this._uLighting       = gl.getUniformLocation(program,'uLighting');

    var l = this.MAX_LIGHTS;

    //temp for debug

    var uLightPosition  = this._uLightPosition  = new Array(l),
        uLightAmbient   = this._uLightAmbient   = new Array(l),
        uLightDiffuse   = this._uLightDiffuse   = new Array(l),
        uLightSpecular  = this._uLightSpecular  = new Array(l),
        uLightShininess = this._uLightShininess = new Array(l);

    var i = -1;
    while(++i < l)
    {
        uLightPosition[i]  = gl.getUniformLocation(program,'uLights['+i+'].position');
        uLightAmbient[i]   = gl.getUniformLocation(program,'uLights['+i+'].ambient');
        uLightDiffuse[i]   = gl.getUniformLocation(program,'uLights['+i+'].diffuse');
        uLightSpecular[i]  = gl.getUniformLocation(program,'uLights['+i+'].specular');
        uLightShininess[i] = gl.getUniformLocation(program,'uLights['+i+'].shininess');


        _gl.uniform3fv(uLightPosition[i], new Float32Array([0,0,0]));
        _gl.uniform3fv(uLightAmbient[i],  new Float32Array([0,0,0]));
        _gl.uniform3fv(uLightDiffuse[i],  new Float32Array([0,0,0]));
        _gl.uniform1f(uLightShininess[i], 1.0);
   }








    this._uMaterialEmission  = _gl.getUniformLocation(program,'uMaterial.emission');
    this._uMaterialAmbient   = _gl.getUniformLocation(program,'uMaterial.ambient');
    this._uMaterialDiffuse   = _gl.getUniformLocation(program,'uMaterial.diffuse');
    this._uMaterialSpecular  = _gl.getUniformLocation(program,'uMaterial.specular');
    this._uMaterialShininess = _gl.getUniformLocation(program,'uMaterial.shininess');




    _gl.uniform1f(this._uLighting,  0.0);
    _gl.uniform1f(this._uPointSize, 1.0);

    /*---------------------------------------------------------------------------------------------------------*/
    // Pre Bind ARRAY_BUFFER & ELEMENT_ARRAY_BUFFER
    /*---------------------------------------------------------------------------------------------------------*/

    this._abo  = _gl.createBuffer();
    this._eabo = _gl.createBuffer();

    _gl.bindBuffer(_gl.ARRAY_BUFFER,         this._abo);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this._eabo);

    _gl.enableVertexAttribArray(this._aVertexPosition);
    _gl.enableVertexAttribArray(this._aVertexNormal);
    _gl.enableVertexAttribArray(this._aVertexColor);
    _gl.enableVertexAttribArray(this._aVertexUV);

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

    var SIZE_OF_FACE    = this.SIZE_OF_FACE   = SIZE_OF_VERTEX;

    var SIZE_OF_QUAD     = this.SIZE_OF_QUAD     = SIZE_OF_VERTEX * 4,
        SIZE_OF_TRIANGLE = this.SIZE_OF_TRIANGLE = SIZE_OF_VERTEX * 3,
        SIZE_OF_LINE     = this.SIZE_OF_LINE     = SIZE_OF_VERTEX * 2,
        SIZE_OF_POINT    = this.SIZE_OF_POINT    = SIZE_OF_VERTEX;

    var ELLIPSE_DETAIL_MAX = this.ELLIPSE_DETAIL_MAX = 30;

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
    this._bColorBg4f = GLKit.Color.copy(GLKit.Color.BLACK);

    this._bVertex   = null;
    this._bNormal   = null;
    this._bColor    = null;
    this._bTexCoord = null;
    this._bIndex    = null;

    this._bVertexPoint = new Float32Array(SIZE_OF_POINT);
    this._bColorPoint  = new Float32Array(SIZE_OF_COLOR);

    this._bVertexLine  = new Float32Array(SIZE_OF_LINE);
    this._bColorLine   = new Float32Array(2 * SIZE_OF_COLOR);

    this._bVertexTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bNormalTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bColorTriangle           = new Float32Array(3 * SIZE_OF_COLOR);
    this._bIndexTriangle           = new Uint16Array([0,1,2]);
    this._bTexCoordTriangleDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0]);
    this._bTexCoordTriangle        = new Float32Array(this._bTexCoordTriangleDefault.length);

    this._bVertexQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bNormalQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bColorQuad           = new Float32Array(4 * SIZE_OF_COLOR);
    this._bIndexQuad           = new Uint16Array([0,1,2,1,2,3]);
    this._bTexCoordQuadDefault = new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);
    this._bTexCoordQuad        = new Float32Array(this._bTexCoordQuadDefault.length);

    this._bVertexRect          = new Float32Array(SIZE_OF_QUAD);
    this._bNormalRect          = new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]);
    this._bColorRect           = new Float32Array(4 * SIZE_OF_COLOR);

    this._bVertexEllipse   = new Float32Array(SIZE_OF_VERTEX * ELLIPSE_DETAIL_MAX);
    this._bNormalEllipse   = new Float32Array(this._bVertexEllipse.length);
    this._bColorEllipse    = new Float32Array(SIZE_OF_COLOR  * ELLIPSE_DETAIL_MAX);
    this._bIndexEllipse    = new Uint16Array((this._bVertexEllipse.length * 0.5 - 2) * SIZE_OF_FACE);
    this._bTexCoordEllipse = new Float32Array(SIZE_OF_UV * ELLIPSE_DETAIL_MAX);


    this._bVertexCube = new Float32Array([-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5]);
    this._bColorCube  = new Float32Array(this._bVertexCube.length / SIZE_OF_VERTEX * SIZE_OF_COLOR);
    this._bNormalCube = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] );

    this._bIndexCube  = new Uint16Array([  0, 1, 2, 0, 2, 3,
                                           4, 5, 6, 4, 6, 7,
                                           8, 9,10, 8,10,11,
                                          12,13,14,12,14,15,
                                          16,17,18,16,18,19,
                                          20,21,22,20,22,23]);
    this._bTexCoordCube = null;


    this._bScreenCoords = new Float32Array([0,0]);

    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/


    this._bLighting = false;



    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/

    this._camera = null;

    this._mModelView   = GLKit.Mat44.make();
    this._mNormal      = GLKit.Mat33.make();
    this._mStack       = [];

    this._drawMode = this.LINES;

    /*---------------------------------------------------------------------------------------------------------*/
    // Init presets
    /*---------------------------------------------------------------------------------------------------------*/

    _gl.enable(_gl.BLEND);
    _gl.enable(_gl.DEPTH_TEST);


};

GLKit.GL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.pointSize = function(value){this._gl.uniform1f(this._uPointSize,value);};

GLKit.GL.prototype.material = function(material)
{
    var gl = this._gl;

    gl.uniform4fv(this._uMaterialEmission,  material.emission);
    gl.uniform4fv(this._uMaterialAmbient,   material.ambient);
    gl.uniform4fv(this._uMaterialDiffuse,   material.diffuse);
    gl.uniform4fv(this._uMaterialSpecular,  material.specular);
    gl.uniform1f( this._uMaterialShininess, material.shininess);
}

GLKit.GL.prototype.light = function(light)
{
    //temp for debug
    var id = light.getId(),
        gl = this._gl;

    gl.uniform3fv(this._uLightPosition[id], light.position);
    gl.uniform3fv(this._uLightAmbient[id],  light.ambient);
    gl.uniform3fv(this._uLightDiffuse[id],  light.diffuse);
    gl.uniform3fv(this._uLightSpecular[id], light.specular);
    gl.uniform1f (this._uLightShininess[id],1.0); //temp
};

GLKit.GL.prototype.lighting    = function(bool){this._gl.uniform1f(this._uLighting,bool ? 1.0 : 0.0);this._bLighting = bool;};
GLKit.GL.prototype.getLighting = function(){return this._bLighting;}

GLKit.GL.prototype.loadIdentity = function(){this._mModelView = GLKit.Mat44.identity(this._camera.modelViewMatrix);};
GLKit.GL.prototype.pushMatrix   = function(){this._mStack.push(GLKit.Mat44.copy(this._mModelView));};
GLKit.GL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw ('Invalid pop!');
    this._mModelView = stack.pop();

    return this._mModelView;
};

GLKit.GL.prototype._setMatricesUniform = function()
{
    var gl = this._gl;
    var camera = this._camera;

    gl.uniformMatrix4fv(this._uModelViewMatrix, false,this._mModelView);
    gl.uniformMatrix4fv(this._uProjectionMatrix,false,camera.projectionMatrix);


    if(!this._bLighting)return;

    GLKit.Mat44.toMat33Inversed(this._mModelView,this._mNormal);
    GLKit.Mat33.transpose(this._mNormal,this._mNormal);

    gl.uniformMatrix3fv(this._uNormalMatrix,false,this._mNormal);
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.translate   = function(v)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(v[0],v[1],v[2]));};
GLKit.GL.prototype.translate3f = function(x,y,z){this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(x,y,z));};
GLKit.GL.prototype.translateX  = function(x)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(x,0,0));};
GLKit.GL.prototype.translateY  = function(y)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(0,y,0));};
GLKit.GL.prototype.translateZ  = function(z)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(0,0,z));};
GLKit.GL.prototype.scale       = function(v)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(v[0],v[1],v[2]));};
GLKit.GL.prototype.scale3f     = function(x,y,z){this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(x,y,z));};
GLKit.GL.prototype.scaleX      = function(x)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(x,1,1));};
GLKit.GL.prototype.scaleY      = function(y)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(1,y,1));};
GLKit.GL.prototype.scaleZ      = function(z)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(1,1,z));};
GLKit.GL.prototype.rotate      = function(v)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationXYZ(v[0],v[1],v[2]));};
GLKit.GL.prototype.rotate3f    = function(x,y,z){this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationXYZ(x,y,z));};
GLKit.GL.prototype.rotateX     = function(x)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationX(x));};
GLKit.GL.prototype.rotateY     = function(y)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationY(y));};
GLKit.GL.prototype.rotateZ     = function(z)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationZ(z));};

/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexUInt16Array,mode)
{
    mode = mode || this.TRIANGLES;
    this.fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this._setMatricesUniform();

    var gl = this._gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexUInt16Array,gl.DYNAMIC_DRAW);
    gl.drawElements(mode,indexUInt16Array.length,gl.UNSIGNED_SHORT,0);
};

GLKit.GL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{

    this.fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this._setMatricesUniform();
    this._gl.drawArrays(mode,first,count);
};

GLKit.GL.prototype.drawGeometry = function(geom)
{
    this.drawElements(geom.vertices,geom.normals,geom.colors,geom.texCoords,geom.indices,this._drawMode);
};


/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.fillArrayBuffer = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array)
{

    var na  = normalFloat32Array ? true : false,
        uva = uvFloat32Array     ? true : false;

    var gl            = this._gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    var vblen   = vertexFloat32Array.byteLength,
        nblen   = na  ? normalFloat32Array.byteLength : 0,
        cblen   = colorFloat32Array.byteLength,
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
};


GLKit.GL.prototype.fillColorBuffer = function(color,buffer)
{
    var i = 0;

    if(color.length == 4)
    {
        while(i < buffer.length)
        {
            buffer[i]  =color[0];
            buffer[i+1]=color[1];
            buffer[i+2]=color[2];
            buffer[i+3]=color[3];
            i+=4;
        }
    }
    else
    {
        if(color.length != buffer.length)
        {
            throw ("Color array length not equal to number of vertices.");
        }

        while(i < buffer.length)
        {
            buffer[i]   = color[i];
            buffer[i+1] = color[i+1];
            buffer[i+2] = color[i+2];
            buffer[i+3] = color[i+3];
            i+=4;
        }
    }

    return buffer;
};

GLKit.GL.prototype.fillVertexBuffer = function(vertices,buffer)
{
    if(vertices.length != buffer.length)throw ('Verices array has wrong length. Should be ' + buffer.length + '.');
    var i = -1;while(++i < buffer.length)buffer[i] = vertices[i];
    return buffer;
};



/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.color   = function(color)  {this._bColor = GLKit.Color.set(this._bColor4f,color);};
GLKit.GL.prototype.color4f = function(r,g,b,a){this._bColor = GLKit.Color.set4f(this._bColor4f,r,g,b,a);};
GLKit.GL.prototype.color3f = function(r,g,b)  {this._bColor = GLKit.Color.set3f(this._bColor4f,r,g,b);};
GLKit.GL.prototype.color2f = function(k,a)    {this._bColor = GLKit.Color.set2f(this._bColor4f,k,a);};
GLKit.GL.prototype.color1f = function(k)      {this._bColor = GLKit.Color.set1f(this._bColor4f,k);};
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

GLKit.GL.prototype.drawMode = function(mode){this._drawMode = mode;};
GLKit.GL.prototype.getDrawMode = function(){return this._drawMode;};

GLKit.GL.prototype.point   = function(vector){this.drawArrays(vector,null,this.fillColorBuffer(this._bColor,this._bColorPoint),null,this.POINTS,0,1);};
GLKit.GL.prototype.point3f = function(x,y,z) {this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = z;this.point(this._bVertexPoint);};
GLKit.GL.prototype.point2f = function(x,y){this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;his._bVertexPoint[2] = 0;this.point(this._bVertexPoint);};
GLKit.GL.prototype.pointv  = function(arr){this._bVertexPoint[0] = arr[0];this._bVertexPoint[1] = arr[1];this._bVertexPoint[2] = arr[2];this.point(this._bVertexPoint);};


GLKit.GL.prototype.line  = function(vertices){this.drawArrays(this.fillVertexBuffer(vertices,this._bVertexLine),null,this.fillColorBuffer(this._bColor,this._bColorLine),null,this._drawMode,0, 2);};
GLKit.GL.prototype.linev = function(vertices)
{
    var v = new Float32Array(vertices),
        l = vertices.length / this.SIZE_OF_VERTEX;
    this.drawArrays(v,null,this.fillColorBuffer(this._bColor, new Float32Array(l*this.SIZE_OF_COLOR)),null,this._drawMode,0, l);
};

GLKit.GL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bVertexLine;

    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorLine),null,this._drawMode,0,2);
};

GLKit.GL.prototype.quadf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3)
{
    var v = this._bVertexQuad;

    v[ 0] = x0;v[ 1] = y0;v[ 2] = z0;
    v[ 3] = x1;v[ 4] = y1;v[ 5] = z1;
    v[ 6] = x2;v[ 7] = y2;v[ 8] = z2;
    v[ 9] = x3;v[10] = y3;v[11] = z3;

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorQuad),null,this._drawMode,0,4);
};

GLKit.GL.prototype.quad = function(vertices,normals,texCoords){this.drawArrays(this.fillVertexBuffer(vertices,this._bVertexQuad),normals,this.fillColorBuffer(this._bColor,this._bColorQuad),texCoords,this._drawMode,0,4);};

GLKit.GL.prototype.rect = function(width,height)
{
    var v = this._bVertexRect;

    v[0] = v[1] = v[2] = v[4] = v[5] = v[7] = v[9] = v[10] = 0;
    v[3] = v[6] = width; v[8] = v[11] = height;

    this.drawArrays(v,this._bNormalRect,this.fillColorBuffer(this._bColor,this._bColorRect),null,this._drawMode,0,4);
};

GLKit.GL.prototype.triangle = function(v0,v1,v2)
{
    var v = this._bVertexTriangle;
    v[0] = v0[0];v[1] = v0[1];v[2] = v0[2];
    v[3] = v1[0];v[4] = v1[1];v[5] = v1[2];
    v[6] = v2[0];v[7] = v2[1];v[8] = v2[2];

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);
};

GLKit.GL.prototype.trianglef = function(v0,v1,v2,v3,v4,v5,v6,v7,v8)
{
    var v = this._bVertexTriangle;
    v[0] = v0;v[1] = v0;v[2] = v2;
    v[3] = v3;v[4] = v4;v[5] = v5;
    v[6] = v6;v[7] = v7;v[8] = v8;

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);
};

GLKit.GL.prototype.trianglev = function(vertices,normals,texCoords){this.drawArrays(this.fillVertexBuffer(vertices,this._bVertexTriangle),normals,this.fillColorBuffer(this._bColor,this._bColorTriangle),texCoords,this._drawMode,0,3);}

GLKit.GL.prototype.cube = function(size)
{
    this.pushMatrix();
    this.scale3f(size,size,size);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.fillColorBuffer(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();
};

GLKit.GL.prototype.sphere = function(segments,size)
{




};




/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.getGL     = function(){return this._gl;};

GLKit.GL.prototype.getModelViewMatrix  = function(){return this._camera.modelViewMatrix;};
GLKit.GL.prototype.getProjectionMatrix = function(){return this._camera.projectionMatrix;};

