var _gl     = require('./gl'),
    glTrans = require('./glTrans'),
    Program = require('./Program');

var ArrayUtil        = require('../util/ArrayUtil'),
    ElementArrayUtil = require('../util/ElementArrayUtil');
var ObjectUtil = require('../util/ObjectUtil');

var Vec3     = require('../math/Vec3'),
    Color    = require('../util/Color'),
    Matrix44 = require('../math/Matrix44');


/*--------------------------------------------------------------------------------------------*/
//  Constructor
/*--------------------------------------------------------------------------------------------*/

function glDraw_Internal(){
    var gl = this._gl = _gl.get();

    //
    //  program & attrib / uniform ref
    //

    this._program = null;
    this._attribLocationVertexPos = null;
    this._attribLocationVertexColor = null;
    this._attribLocationVertexNormal = null;
    this._attribLocationTexcoord = null;
    this._uniformLocationModelViewMatrix = null;
    this._uniformLocationProjectionMatrix = null;

    //
    //  temps
    //

    this._matrixTemp0 = Matrix44.create();
    this._matrixTemp1 = Matrix44.create();
    this._matrixTemp2 = Matrix44.create();

    var vertices,colors,indices;
    var numVertices, numColors;
    var vbo, ibo;

    //
    //  Pivot
    //

    vbo = this._pivotVbo = gl.createBuffer();
    ibo = this._pivotIbo = gl.createBuffer();

    this._pivotAxisLength = null;
    this._pivotHeadLength = null;
    this._pivotHeadRadius = null;

    vertices = [
        0,0,0,
        1,0,0,
        0,0,0,
        0,1,0,
        0,0,0,
        0,0,1
    ];

    colors = [
        1,0,0,1,
        1,0,0,1,
        0,1,0,1,
        0,1,0,1,
        0,0,1,1,
        0,0,1,1
    ];

    numVertices = 16;   //  headVertices

    ArrayUtil.appendArray(vertices, ArrayUtil.createArray(numVertices,0,0,0));
    ArrayUtil.appendArray(vertices, ArrayUtil.createArray(numVertices,0,0,0));
    ArrayUtil.appendArray(vertices, ArrayUtil.createArray(numVertices,0,0,0));
    ArrayUtil.appendArray(colors, ArrayUtil.createArray(numVertices, 1,0,0,1));
    ArrayUtil.appendArray(colors, ArrayUtil.createArray(numVertices, 0,1,0,1));
    ArrayUtil.appendArray(colors, ArrayUtil.createArray(numVertices, 0,0,1,1));

    vertices = this._pivotVboVertices = new Float32Array(vertices);
    colors   = new Float32Array(colors);



    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + colors.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);

    this._updatePivotGeom(1.0,0.125,0.075);

    indices = [];
    ArrayUtil.appendArray(indices,ElementArrayUtil.genTriangleFan( 6, 6 + 16));
    ArrayUtil.appendArray(indices,ElementArrayUtil.genTriangleFan(22,22 + 16));
    ArrayUtil.appendArray(indices,ElementArrayUtil.genTriangleFan(38,38 + 16));
    indices = new Uint16Array(indices);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    this._pivotVboOffsetColors = vertices.byteLength;
    this._pivotIboLength       = indices.length;


    //  grid

    this._gridVbo = gl.createBuffer();
    this._gridIbo = gl.createBuffer();

    this._gridSubdivs = null;

    this._gridVboOffsetColors = null;
    this._gridIboLength = null;
    this._gridVboVertexLength = null;


    //  init

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

/*--------------------------------------------------------------------------------------------*/
//  Grid
/*--------------------------------------------------------------------------------------------*/


glDraw_Internal.prototype._updateGridGeom = function(subdivs){
    if(this._gridSubdivs == subdivs){
        return;
    }
    var gl = this._gl;

    var subdivs1 = subdivs + 1,
        num      = subdivs1 * subdivs1;

    var i, j, k;
    var vertices = new Float32Array(num * 3);
    var colors   = new Float32Array(ArrayUtil.createArray(num,1,1,1,1));

    var step = 1.0 / (subdivs1 - 1);

    i = -1;
    while(++i < subdivs1){
        j = -1;
        while(++j < subdivs1){
            k = (i * subdivs1 + j) * 3;
            vertices[k  ] = -0.5 + step * j;
            vertices[k+1] = 0;
            vertices[k+2] = -0.5 + step * i;
        }
    }

    var indices = [];

    i = -1;
    while(++i < subdivs1){
        j = -1;
        while(++j < subdivs1){
            if(j < subdivs){
                k = i * subdivs1 + j;
                indices.push(k);
                indices.push(k+1);
            }
            if(i < subdivs){
                k = i * subdivs1 + j;
                indices.push(k);
                indices.push(k+subdivs1);
            }
        }
    }

    indices = new Uint16Array(indices);

    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + colors.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    this._gridVboOffsetColors = vertices.byteLength;
    this._gridSubdivs = subdivs;

    this._gridIboLength = indices.length;
};


glDraw_Internal.prototype.drawGrid = function(size, subdivs){
    size    = ObjectUtil.isUndefined(size)    ? 1.0 : (size < 0) ? 0.0 : size;
    subdivs = ObjectUtil.isUndefined(subdivs) ? 1.0 : (subdivs < 0) ? 0 : subdivs;

    this._updateProgramLocations();

    var gl = this._gl;
    var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevIbo = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    var vbo = this._gridVbo;
    var ibo = this._gridIbo;

    glTrans.pushMatrix();
    glTrans.scale3f(size,1.0,size);

    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

    this._updateGridGeom(subdivs);

    gl.vertexAttribPointer(this._attribLocationVertexPos , 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(this._attribLocationVertexColor, 4, gl.FLOAT, false, 0, this._gridVboOffsetColors);
    gl.uniformMatrix4fv(   this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrix());
    gl.uniformMatrix4fv(   this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrix());

    gl.drawElements(gl.LINES,this._gridIboLength,gl.UNSIGNED_SHORT,0);

    glTrans.popMatrix();

    gl.bindBuffer(gl.ARRAY_BUFFER,prevVbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,prevIbo);
};


/*--------------------------------------------------------------------------------------------*/
// Pivot
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype._updatePivotGeom = function(axisLength, headLength, headRadius){
    if(this._pivotAxisLength == axisLength &&
       this._pivotHeadLength == headLength &&
       this._pivotHeadRadius == headRadius){
        return;
    }

    var axis_head_length = axisLength - headLength;

    var gl       = this._gl;
    var vertices = this._pivotVboVertices;

    var i,l;

    vertices[3]  = axisLength;
    vertices[10] = axisLength;
    vertices[17] = axisLength;

    var numVertices = 48;

    var offsetHeadX = 18;
    var offsetHeadY = offsetHeadX + numVertices;
    var offsetHeadZ = offsetHeadY + numVertices;

    this._genHead(headLength,headRadius,vertices,offsetHeadX);
    this._genHead(headLength,headRadius,vertices,offsetHeadY);
    this._genHead(headLength,headRadius,vertices,offsetHeadZ);

    var pi_2 = Math.PI * 0.5;

    var matrix0 = this._matrixTemp0;
    var matrix1 = this._matrixTemp1;
    var matrix2 = this._matrixTemp2;

    //  x

    Matrix44.identity(matrix0);
    Matrix44.identity(matrix1);
    Matrix44.identity(matrix2);

    var transX = Matrix44.mult(Matrix44.createRotation(0,-pi_2,0,matrix0),
                               Matrix44.createTranslation(axis_head_length,0,0,matrix1),
                               matrix2);

    i = offsetHeadX;
    l = i + numVertices;
    while(i < l){
        Matrix44.multVec3AI(transX,vertices,i);
        i += 3;
    }

    //  y

    Matrix44.identity(matrix0);
    Matrix44.identity(matrix1);
    Matrix44.identity(matrix2);

    var transY = Matrix44.mult(Matrix44.createRotation( pi_2, 0, 0, matrix0),
        Matrix44.createTranslation(0,axis_head_length,0, matrix1),
        matrix2);

    i = offsetHeadY;
    l = i + numVertices;
    while(i < l){
        Matrix44.multVec3AI(transY,vertices,i);
        i += 3;
    }

    //  z

    Matrix44.identity(matrix0);

    var transZ = Matrix44.createTranslation(0,0,axis_head_length,matrix0);

    i = offsetHeadZ;
    l = i + numVertices;
    while(i < l){
        Matrix44.multVec3AI(transZ,vertices,i);
        i += 3;
    }

    //  push

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

    this._pivotAxisLength = axisLength;
    this._pivotHeadLength = headLength;
    this._pivotHeadRadius = headRadius;
};


glDraw_Internal.prototype.drawPivot = function(axisLength, headLength, headRadius){
    axisLength = ObjectUtil.isUndefined(axisLength) ? 1.0   : axisLength;
    headLength = ObjectUtil.isUndefined(headLength) ? 0.125 : headLength;
    headRadius = ObjectUtil.isUndefined(headRadius) ? 0.075 : headRadius;

    this._updateProgramLocations();

    var gl = this._gl;
    var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevIbo = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    var vbo = this._pivotVbo;
    var ibo = this._pivotIbo;

    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

    this._updatePivotGeom(axisLength,headLength,headRadius);

    gl.vertexAttribPointer(this._attribLocationVertexPos , 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(this._attribLocationVertexColor, 4, gl.FLOAT, false, 0, this._pivotVboOffsetColors);
    gl.uniformMatrix4fv(   this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrix());
    gl.uniformMatrix4fv(   this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrix());

    gl.drawArrays(gl.LINES,0,6);
    gl.drawElements(gl.TRIANGLES,this._pivotIboLength,gl.UNSIGNED_SHORT,0);


    gl.bindBuffer(gl.ARRAY_BUFFER,prevVbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, prevIbo);
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


/*--------------------------------------------------------------------------------------------*/
//  Helper
/*--------------------------------------------------------------------------------------------*/

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

    set : function(gl){
        this._obj = new glDraw_Internal(gl);
    },
    get : function(){
        return this._obj;
    }
};

module.exports = glDraw;