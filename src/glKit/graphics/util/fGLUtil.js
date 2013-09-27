var Vec3  = require('../../math/fVec3'),
    Color = require('../../util/fColor');

var fGLUtil = {};

fGLUtil.__gridSizeLast = -1;
fGLUtil.__gridUnitLast = -1;



fGLUtil.drawGrid = function(kgl,size,unit)
{
    unit = unit || 1;

    var i  = -1,
        sh = size * 0.5 * unit;

    var ui;

    while(++i < size + 1)
    {
        ui = unit * i;

        kgl.linef(-sh,0,-sh + ui,sh,0,-sh+ui);
        kgl.linef(-sh+ui,0,-sh,-sh+ui,0,sh);
    }
};

fGLUtil.drawAxes = function(kgl,unit)
{
    kgl.color3f(1,0,0);
    kgl.linef(0,0,0,unit,0,0);
    kgl.color3f(0,1,0);
    kgl.linef(0,0,0,0,unit,0);
    kgl.color3f(0,0,1);
    kgl.linef(0,0,0,0,0,unit);
};

fGLUtil.drawGridCube = function(kgl,size,unit)
{
    unit = unit || 1;

    var sh  = size * 0.5 * unit,
        pih = Math.PI * 0.5;

    kgl.pushMatrix();
    kgl.translate3f(0,-sh,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(0,sh,0);
    kgl.rotate3f(0,pih,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(0,0,-sh);
    kgl.rotate3f(pih,0,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(0,0,sh);
    kgl.rotate3f(pih,0,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(sh,0,0);
    kgl.rotate3f(pih,0,pih);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(-sh,0,0);
    kgl.rotate3f(pih,0,pih);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

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

/*
var fGLUtil =
{

    drawGrid : function(gl,size,unit)
    {
        unit = unit || 1;

        var i  = -1,
            sh = size * 0.5 * unit;

        var ui;

        while(++i < size + 1)
        {
            ui = unit * i;

            gl.linef(-sh,0,-sh + ui,sh,0,-sh+ui);
            gl.linef(-sh+ui,0,-sh,-sh+ui,0,sh);
        }

    },

    drawGridCube : function(gl,size,unit)
    {
        unit = unit || 1;

        var sh  = size * 0.5 * unit,
            pih = Math.PI * 0.5;

        gl.pushMatrix();
        gl.translate3f(0,-sh,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,sh,0);
        gl.rotate3f(0,pih,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,-sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(-sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

    },


    drawAxes : function(gl,unit)
    {
        gl.color3f(1,0,0);
        gl.linef(0,0,0,unit,0,0);
        gl.color3f(0,1,0);
        gl.linef(0,0,0,0,unit,0);
        gl.color3f(0,0,1);
        gl.linef(0,0,0,0,0,unit);
    },


    //temp
    drawVectorf : function(gl,x0,y0,z0,x1,y1,z1)
    {
       

        var p0 = gl._bPoint0,
            p1 = gl._bPoint1,
            up = gl._axisY;

        Vec3.set3f(p0,x0,y0,z0);
        Vec3.set3f(p1,x1,y1,z1);

        var pw = gl._lineBoxWidth,
            ph = gl._lineBoxHeight,
            pd = gl._drawMode;

        var len = Vec3.distance(p0,p1),
            mid = Vec3.scale(Vec3.added(p0,p1),0.5),
            dir = Vec3.normalize(Vec3.subbed(p1,p0)),
            c   = Vec3.dot(dir,up);

        var angle = Math.acos(c),
            axis  = Vec3.normalize(Vec3.cross(up,dir));


        gl.drawMode(gl.LINES);

        gl.linef(x0,y0,z0,x1,y1,z1);

        gl.drawMode(gl.TRIANGLES);
        gl.pushMatrix();
        gl.translate(p1);
        gl.rotateAxis(angle,axis);
        this.pyramid(gl,0.025);
        gl.popMatrix();

        gl.lineSize(pw,ph);
        gl.drawMode(pd);
    },

    drawVector : function(gl,v0,v1)
    {
       this.drawVectorf(gl,v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);
    },

    pyramid : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexPyramid,this.__bNormalPyramid,gl.fillColorBuffer(gl._bColor,this.__bColorPyramid),null,this.__bIndexPyramid,gl._drawMode);
        gl.popMatrix();
    },



    octahedron : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron,gl.fillColorBuffer(gl._bColor, this.__bColorOctahedron),null, this.__bIndexOctahedron,gl._drawMode);
        gl.popMatrix();
    }
};
*/

fGLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
fGLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
fGLUtil.__bColorOctahedron  = new Float32Array(fGLUtil.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
fGLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);
fGLUtil.__bVertexPyramid    = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
fGLUtil.__bNormalPyramid    = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
fGLUtil.__bColorPyramid     = new Float32Array(fGLUtil.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
fGLUtil.__bIndexPyramid     = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);

module.exports = fGLUtil;