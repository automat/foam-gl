var _gl     = require('./gl'),
    glTrans = require('./glTrans'),
    Program = require('./Program');

var ArrayUtil  = require('../util/ArrayUtil');
var ObjectUtil = require('../util/ObjectUtil');

var Vec3     = require('../math/Vec3'),
    Color    = require('../util/Color'),
    Matrix44 = require('../math/Matrix44');

function glDraw_Internal(){
    var gl = this._gl = _gl.get();

    this._program = null;
    this._attribLocationVertexPos = null;
    this._attribLocationVertexColor = null;
    this._attribLocationVertexNormal = null;
    this._attribLocationTexcoord = null;
    this._uniformLocationModelViewMatrix = null;
    this._uniformLocationProjectionMatrix = null;

    var i;

    var vertices,colors,indices;
    var vbo;

    this._pivotAxisLength = null;
    this._pivotHeadLength = null;
    this._pivotHeadRadius = null;

    // Pivot

    vbo = this._pivotVbo = gl.createBuffer();

    this._pivotVertices = null;
    this._pivotColors   = null;

}

glDraw_Internal.prototype._updateProgramLocations = function(){
    var gl = this._gl;
    var program = gl.getParameter(gl.CURRENT_PROGRAM);

    if(this._program == program){
        return;
    }

    this._attribLocationVertexPos         = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_POSITION);
    this._attribLocationVertexColor       = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_COLOR);
    this._attribLocationVertexNormal      = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_NORMAL);
    this._attribLocationTexcoord          = gl.getAttribLocation(program,Program.ATTRIB_TEXCOORD);
    this._uniformLocationModelViewMatrix  = gl.getUniformLocation(program,Program.UNIFORM_MODELVIEW_MATRIX);
    this._uniformLocationProjectionMatrix = gl.getUniformLocation(program,Program.UNIFORM_PROJECTION_MATRIX);

    this._program = program;
};



glDraw_Internal.prototype.drawPivot = function(axisLength, headLength, headRadius){
    axisLength = ObjectUtil.isUndefined(axisLength) ? 1.0   : axisLength;
    headLength = ObjectUtil.isUndefined(headLength) ? 0.125 : headLength;
    headRadius = ObjectUtil.isUndefined(headRadius) ? 0.075 : headRadius;

    this._updateProgramLocations();

    var gl = this._gl;
    var prevbuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var buffer = this._pivotVbo;

    this._updatePivotVbo(axisLength,headLength,headRadius);

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);

    gl.vertexAttribPointer(this._attribLocationVertexPos , 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(this._attribLocationVertexColor, 4, gl.FLOAT, false, 0, this._pivotVertices.byteLength);
    gl.uniformMatrix4fv(   this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrix());
    gl.uniformMatrix4fv(   this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrix());


    gl.drawArrays(gl.LINES,0,6);
    gl.drawArrays(gl.TRIANGLE_FAN,6,16);


    gl.bindBuffer(gl.ARRAY_BUFFER,prevbuffer);
};

glDraw_Internal.prototype._updatePivotVbo = function(axisLength, headLength, headRadius){
    if(this._pivotAxisLength == axisLength &&
       this._pivotHeadLength == headLength &&
       this._pivotHeadRadius == headRadius){
        return;
    }

    this._pivotAxisLength = axisLength;
    this._pivotHeadLength = headLength;
    this._pivotHeadRadius = headRadius;

    var gl       = this._gl;
    var vbo      = this._pivotVbo;

    var vertices = [
        0,0,0,
        1,0,0,
        0,0,0,
        0,1,0,
        0,0,0,
        0,0,1];

    var colors = [
        1,0,0,1,
        1,0,0,1,
        0,1,0,1,
        0,1,0,1,
        0,0,1,1,
        0,0,1,1
    ];


    var headVertices = new Array(16);
    var headColors;

    var axis_head_length = axisLength - headLength;



    this._genHead(headLength,headRadius,headVertices,0);
    headColors = ArrayUtil.createArray(headVertices.length / 3 * 4, 1,1,1,1);

    var trans = Matrix44.createTranslation(0,0,axis_head_length);
    var i = 0;
    while(i < headVertices.length){
        Matrix44.multVec3AI(trans,headVertices,i);
        i+=3;
    }




    ArrayUtil.appendArray(vertices,headVertices);
    ArrayUtil.appendArray(colors,headColors);


    vertices = this._pivotVertices = new Float32Array(vertices);
    colors   = this._colorsPivot   = new Float32Array(colors);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + colors.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);
};

glDraw_Internal.prototype._genHead = function(length, radius, arr, offset){
    offset = !offset ? 0 : offset;

    var numSteps = 15;
    var step = (Math.PI * 2) / (numSteps - 1);
    var angle;

    arr[offset++] = 0;
    arr[offset++] = 0;
    arr[offset++] = length;

    numSteps *= 3;
    numSteps  = offset + numSteps;
    var i = offset;
    var j = 0;
    while(i < numSteps){
        angle = step * j++;

        arr[i  ] = Math.cos(angle) * radius;
        arr[i+1] = Math.sin(angle) * radius;
        arr[i+2] = 0;

        i += 3;
    }
};




/*

glDraw.drawLine = function(start, end){
};


glDraw.drawCube = function(center, size){};
glDraw.drawCubeStroked = function(center,size){};
glDraw.drawSphere = function(center, radius, numSegs){};
glDraw.drawCircle = function(center,radius,numSegs){};
glDraw.drawCircleStroked = function(center,radius,numSegs){};
glDraw.drawEllipse = function(center,radiusX,radiusY,numSegs){};
glDraw.drawEllipseStroked = function(center,radiusX,radiusY,numSegs){};
glDraw.drawRect = function(rect){};
glDraw.drawRectStroked = function(rect){};
glDraw.drawRectRounded = function(rect,radiusCorner,numSegsCorner){};
glDraw.drawRectRoundedStroked  =function(rect,radiusCorner,numSegsCorner){};
glDraw.drawTriangle = function(v0,v1,v2){};
glDraw.drawTriangleStroked = function(v0,v1,v2){};

glDraw.draw = function(obj){};



glDraw.drawRange = function(obj,begin,count){};


glDraw.drawPivot = function(length){};



glDraw.drawVector = function(vec){};
glDraw.drawFrustum = function(camera){};

glDraw.drawArraysSafe = function(){};

glDraw.drawString = function(string,pos,align){};


glDraw.color4f = function(r,g,b,a){};

glDraw.__bVertexGrid = [];
glDraw.__bVertexGridF32 = null;
glDraw.__bColorGridLast = Color.BLACK();
glDraw.__bColorGridF32 = null;
glDraw.__gridSizeLast = -1;
glDraw.__gridUnitLast = -1;

glDraw.__bVertexGridCube = [];
glDraw.__bVertexGridCubeF32 = null;
glDraw.__bColorGridCubeLast = Color.BLACK;
glDraw.__bColorGridCubeF32 = null;
glDraw.__gridCubeSizeLast = -1;
glDraw.__gridCubeUnitLast = -1;

glDraw.__bVertexAxesF32 = new Float32Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]);
glDraw.__bColorAxesF32 = new Float32Array([1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1]);
glDraw.__axesUnitLast = -1;


glDraw.drawGrid = function (fgl, size, unit) {
    unit = unit || 1;

    if (unit != this.__gridUnitLast) {
        var bVertexGrid = this.__bVertexGrid;

        if (size != this.__gridSizeLast) {
            this.__genGridVertices(bVertexGrid, '__bVertexGridF32', '__bColorGridF32', size);
            this.__gridSizeLast = size;
        }

        this.__scaleGridVertices(bVertexGrid, this.__bVertexGridF32, unit);
    }

    var bColorGrid32 = this.__bColorGridF32;
    var colorLast = this.__bColorGridLast,
        colorfGL = fgl.getColorBuffer();

    fgl.drawArrays(this.__bVertexGridF32,
        null,
        Color.equals(colorfGL, colorLast) ?
            bColorGrid32 :
            fgl.bufferColors(colorfGL, bColorGrid32),
        null,
        fgl.LINES);

    this.__gridSizeLast = size;
    this.__gridUnitLast = unit;

    Color.set(colorLast, colorfGL);
};

glDraw.__genGridVertices = function (verticesArr, verticesArrF32String, colorsArrF32String, size) {
    var l = verticesArr.length = (size + 1) * 12;

    var i = 0,
        sh = size * 0.5,
        ui;

    while (i < l) {
        ui = i / 12;

        verticesArr[i   ] = verticesArr[i + 8 ] = -sh;
        verticesArr[i + 1 ] = verticesArr[i + 4 ] = verticesArr[i + 7 ] = verticesArr[i + 10] = 0;
        verticesArr[i + 2 ] = verticesArr[i + 5 ] = verticesArr[i + 6 ] = verticesArr[i + 9 ] = -sh + ui;
        verticesArr[i + 3 ] = verticesArr[i + 11] = sh;

        i += 12;
    }

    this[verticesArrF32String] = new Float32Array(verticesArr);
    this[colorsArrF32String] = new Float32Array(l / 3 * 4);
};

glDraw.__scaleGridVertices = function (verticesArr, verticesArrF32, unit) {
    var i = -1;
    var l = verticesArr.length;

    while (++i < l)verticesArrF32[i] = verticesArr[i] * unit;
};

glDraw.drawAxes = function (fgl, unit) {
    unit = unit || 1;

    var bVerticesAxes = this.__bVertexAxesF32;
    var drawModeLast = fgl.getDrawMode();

    if (unit != this.__axesUnitLast) {
        bVerticesAxes[3 ] = bVerticesAxes[10] = bVerticesAxes[17] = unit;
    }

    fgl.drawMode(drawModeLast);
    fgl.drawArrays(bVerticesAxes, null, this.__bColorAxesF32, null, fgl.LINES);

    this.__axesUnitLast = unit;
    fgl.drawMode(drawModeLast);
};

glDraw.drawGridCube = function (fgl, size, unit) {
    unit = unit || 1;

    if (unit != this.__gridCubeUnitLast) {
        var bVertexGrid = this.__bVertexGridCube;

        if (size != this.__gridCubeSizeLast) {
            this.__genGridVertices(bVertexGrid, '__bVertexGridCubeF32', '__bColorGridCubeF32', size);
            this.__gridCubeSizeLast = size;
        }

        this.__scaleGridVertices(bVertexGrid, this.__bVertexGridCubeF32, unit);
    }

    var bColorGrid32 = this.__bColorGridCubeF32;
    var colorLast = this.__bColorGridCubeLast,
        colorfGL = fgl.getColorBuffer();

    var bVertexGridCubeF32 = this.__bVertexGridCubeF32,
        color = Color.equals(colorfGL, colorLast) ?
            bColorGrid32 :
            fgl.bufferColors(colorfGL, bColorGrid32);


    var sh = size * 0.5 * unit,
        pih = Math.PI * 0.5;

    //TODO: merge

    fgl.pushMatrix();
    fgl.translate3f(0, -sh, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0, sh, 0);
    fgl.rotate3f(0, pih, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0, 0, -sh);
    fgl.rotate3f(pih, 0, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0, 0, sh);
    fgl.rotate3f(pih, 0, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(sh, 0, 0);
    fgl.rotate3f(pih, 0, pih);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(-sh, 0, 0);
    fgl.rotate3f(pih, 0, pih);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    this.__gridCubeSizeLast = size;
    this.__gridCubeUnitLast = unit;

    Color.set(colorLast, colorfGL);
};


glDraw.pyramid = function (kgl, size) {
    kgl.pushMatrix();
    kgl.scale3f(size, size, size);
    kgl.drawElements(this.__bVertexPyramid, this.__bNormalPyramid, kgl.bufferColors(kgl._bColor, this.__bColorPyramid), null, this.__bIndexPyramid, kgl._drawMode);
    kgl.popMatrix();
};


glDraw.octahedron = function (kgl, size) {
    kgl.pushMatrix();
    kgl.scale3f(size, size, size);
    kgl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron, kgl.bufferColors(kgl._bColor, this.__bColorOctahedron), null, this.__bIndexOctahedron, kgl._drawMode);
    kgl.popMatrix();
};

glDraw.__bVertexOctahedron = new Float32Array([-0.707, 0, 0, 0, 0.707, 0, 0, 0, -0.707, 0, 0, 0.707, 0, -0.707, 0, 0.707, 0, 0]);
glDraw.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
glDraw.__bColorOctahedron = new Float32Array(glDraw.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
glDraw.__bIndexOctahedron = new Uint16Array([3, 4, 5, 3, 5, 1, 3, 1, 0, 3, 0, 4, 4, 0, 2, 4, 2, 5, 2, 0, 1, 5, 2, 1]);
glDraw.__bVertexPyramid = new Float32Array([ 0.0, 1.0, 0.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0]);
glDraw.__bNormalPyramid = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
glDraw.__bColorPyramid = new Float32Array(glDraw.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
glDraw.__bIndexPyramid = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 12, 15, 14]);

*/

var glDraw = {
    _obj : null,

    init : function(gl){
        this._obj = new glDraw_Internal(gl);
    },
    get : function(){
        return this._obj;
    }
};

module.exports = glDraw;