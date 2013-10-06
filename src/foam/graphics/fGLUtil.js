var Vec3  = require('../math/fVec3'),
    Color = require('../util/fColor');

var fGLUtil = {};

fGLUtil.__bVertexGrid    = [];
fGLUtil.__bVertexGridF32 = null;
fGLUtil.__bColorGridLast = Color.BLACK();
fGLUtil.__bColorGridF32  = null;
fGLUtil.__gridSizeLast   = -1;
fGLUtil.__gridUnitLast   = -1;

fGLUtil.__bVertexGridCube    = [];
fGLUtil.__bVertexGridCubeF32 = null;
fGLUtil.__bColorGridCubeLast = Color.BLACK;
fGLUtil.__bColorGridCubeF32  = null;
fGLUtil.__gridCubeSizeLast   = -1;
fGLUtil.__gridCubeUnitLast   = -1;

fGLUtil.__bVertexAxesF32 = new Float32Array([0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1]);
fGLUtil.__bColorAxesF32  = new Float32Array([1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,0,1,1]);
fGLUtil.__axesUnitLast = -1;


fGLUtil.drawGrid = function(fgl,size,unit)
{
    unit = unit || 1;

    if(unit != this.__gridUnitLast)
    {
        var bVertexGrid = this.__bVertexGrid;

        if(size != this.__gridSizeLast)
        {
            this.__genGridVertices(bVertexGrid,'__bVertexGridF32','__bColorGridF32',size);
            this.__gridSizeLast = size;
        }

        this.__scaleGridVertices(bVertexGrid,this.__bVertexGridF32,unit);
    }

    var bColorGrid32 = this.__bColorGridF32;
    var colorLast    = this.__bColorGridLast,
        colorfGL     = fgl.getColorBuffer();

    fgl.drawArrays(this.__bVertexGridF32,
                   null,
                   Color.equals(colorfGL,colorLast) ?
                   bColorGrid32 :
                   fgl.bufferColors(colorfGL,bColorGrid32),
                   null,
                   fgl.LINES);

    this.__gridSizeLast = size;
    this.__gridUnitLast = unit;

    Color.set(colorLast,colorfGL);
};

fGLUtil.__genGridVertices = function(verticesArr,verticesArrF32String,colorsArrF32String,size)
{
    var l = verticesArr.length = (size + 1) * 12;

    var i  = 0,
        sh = size * 0.5,
        ui;

    while(i < l)
    {
        ui = i / 12;

        verticesArr[i   ] = verticesArr[i+8 ] = -sh;
        verticesArr[i+1 ] = verticesArr[i+4 ] = verticesArr[i+7 ] = verticesArr[i+10] = 0;
        verticesArr[i+2 ] = verticesArr[i+5 ] = verticesArr[i+6 ] = verticesArr[i+9 ] =-sh + ui;
        verticesArr[i+3 ] = verticesArr[i+11] = sh;

        i += 12;
    }

    this[verticesArrF32String] = new Float32Array(verticesArr);
    this[colorsArrF32String]   = new Float32Array(l / 3 * 4);
};

fGLUtil.__scaleGridVertices = function(verticesArr,verticesArrF32,unit)
{
    var i = -1;
    var l = verticesArr.length;

    while(++i < l)verticesArrF32[i] = verticesArr[i] * unit;
};

fGLUtil.drawAxes = function(fgl,unit)
{
    unit = unit || 1;

    var bVerticesAxes = this.__bVertexAxesF32;
    var drawModeLast  = fgl.getDrawMode();

    if(unit != this.__axesUnitLast){bVerticesAxes[3 ] = bVerticesAxes[10] = bVerticesAxes[17] = unit;}

    fgl.drawMode(drawModeLast);
    fgl.drawArrays(bVerticesAxes,null,this.__bColorAxesF32,null,fgl.LINES);

    this.__axesUnitLast = unit;
    fgl.drawMode(drawModeLast);
};

fGLUtil.drawGridCube = function(fgl,size,unit)
{
    unit = unit || 1;

    if(unit != this.__gridCubeUnitLast)
    {
        var bVertexGrid = this.__bVertexGridCube;

        if(size != this.__gridCubeSizeLast)
        {
            this.__genGridVertices(bVertexGrid,'__bVertexGridCubeF32','__bColorGridCubeF32',size);
            this.__gridCubeSizeLast = size;
        }

        this.__scaleGridVertices(bVertexGrid,this.__bVertexGridCubeF32,unit);
    }

    var bColorGrid32 = this.__bColorGridCubeF32;
    var colorLast    = this.__bColorGridCubeLast,
        colorfGL     = fgl.getColorBuffer();

    var bVertexGridCubeF32 = this.__bVertexGridCubeF32,
        color              = Color.equals(colorfGL,colorLast) ?
                             bColorGrid32 :
                             fgl.bufferColors(colorfGL,bColorGrid32);


    var sh  = size * 0.5 * unit,
        pih = Math.PI * 0.5;

    //TODO: merge

    fgl.pushMatrix();
    fgl.translate3f(0,-sh,0);
    fgl.drawArrays(bVertexGridCubeF32,null,color,null,fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,sh,0);
    fgl.rotate3f(0,pih,0);
    fgl.drawArrays(bVertexGridCubeF32,null,color,null,fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,0,-sh);
    fgl.rotate3f(pih,0,0);
    fgl.drawArrays(bVertexGridCubeF32,null,color,null,fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,0,sh);
    fgl.rotate3f(pih,0,0);
    fgl.drawArrays(bVertexGridCubeF32,null,color,null,fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(sh,0,0);
    fgl.rotate3f(pih,0,pih);
    fgl.drawArrays(bVertexGridCubeF32,null,color,null,fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(-sh,0,0);
    fgl.rotate3f(pih,0,pih);
    fgl.drawArrays(bVertexGridCubeF32,null,color,null,fgl.LINES);
    fgl.popMatrix();

    this.__gridCubeSizeLast = size;
    this.__gridCubeUnitLast = unit;

    Color.set(colorLast,colorfGL);
};


fGLUtil.pyramid = function(kgl,size)
{
    kgl.pushMatrix();
    kgl.scale3f(size,size,size);
    kgl.drawElements(this.__bVertexPyramid,this.__bNormalPyramid,kgl.bufferColors(kgl._bColor,this.__bColorPyramid),null,this.__bIndexPyramid,kgl._drawMode);
    kgl.popMatrix();
};



fGLUtil.octahedron = function(kgl,size)
{
    kgl.pushMatrix();
    kgl.scale3f(size,size,size);
    kgl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron,kgl.bufferColors(kgl._bColor, this.__bColorOctahedron),null, this.__bIndexOctahedron,kgl._drawMode);
    kgl.popMatrix();
};

fGLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
fGLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
fGLUtil.__bColorOctahedron  = new Float32Array(fGLUtil.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
fGLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);
fGLUtil.__bVertexPyramid    = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
fGLUtil.__bNormalPyramid    = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
fGLUtil.__bColorPyramid     = new Float32Array(fGLUtil.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
fGLUtil.__bIndexPyramid     = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);

module.exports = fGLUtil;