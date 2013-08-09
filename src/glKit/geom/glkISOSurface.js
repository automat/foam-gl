//Testing Version
GLKit.ISOSurface = function(sizeX,sizeY,sizeZ)
{
    this._vertSizeX = null;
    this._vertSizeY = null;
    this._vertSizeZ = null;

    this._func = function(x,y,z,a){return Math.abs(x)+Math.abs(y)+Math.abs(z) - 2.7;};

    switch(arguments.length)
    {
        case 1:
            this._vertSizeX = this._vertSizeY = this._vertSizeZ = arguments[0];
            break;
        case 3:
            this._vertSizeX = arguments[0];
            this._vertSizeY = arguments[1];
            this._vertSizeZ = arguments[2];
            break;
        default :
            this._vertSizeX = this._vertSizeY = this._vertSizeZ = GLKit.ISOSurface.DEFAULT_SIZE;
            break;

    }

    this._cellSizeX = this._vertSizeX - 1;
    this._cellSizeY = this._vertSizeY - 1;
    this._cellSizeZ = this._vertSizeZ - 1;


    this._vertSizeTotal = this._vertSizeX * this._vertSizeY * this._vertSizeZ;
    this._cellSizeTotal = this._cellSizeX * this._cellSizeY * this._cellSizeZ;

    this._verts = new Array(this._vertSizeTotal * GLKit.Vec4.SIZE);
    this._cells = new Array(this._cellSizeTotal * GLKit.ISOSurface.CELL_SIZE * GLKit.Vec3.SIZE);

    this.vertices = new Float32Array(this._vertSizeTotal * GLKit.Vec3.SIZE);
    this.normals  = new Float32Array(this._vertSizeTotal * GLKit.Vec3.SIZE);
    this.colors   = new Float32Array(this._vertSizeTotal * GLKit.Color.SIZE);

    this._genSurface();



};

GLKit.ISOSurface.prototype = Object.create(GLKit.Geom3d.prototype);

GLKit.ISOSurface.DEFAULT_SIZE = 3;
GLKit.ISOSurface.CELL_SIZE    = 8;

GLKit.ISOSurface.prototype._genSurface = function()
{
    var i, j,k;

    var sizeX = this._vertSizeX,
        sizeY = this._vertSizeY,
        sizeZ = this._vertSizeZ;

    var cellSizeX = this._cellSizeX,
        cellSizeY = this._cellSizeY,
        cellSizeZ = this._cellSizeZ;

    var verts = this._verts;

    var vertsIndex,
        verts4Index,
        cellsIndex,
        cells8Index;

    var CELL_SIZE = GLKit.ISOSurface.CELL_SIZE;
    var cells = this._cells;


    var sizeXZ = sizeX * sizeZ;

    i = -1;
    while(++i < sizeX)
    {
        j = -1;
        while(++j < sizeY)
        {
            k = -1;
            while(++k < sizeZ)
            {
                vertsIndex  = i * sizeY * sizeZ + j * sizeZ + k;
                verts4Index = vertsIndex * 4;

                verts[verts4Index    ] =  -0.5 + (i / (sizeX - 1));
                verts[verts4Index + 1] =  -0.5 + (j / (sizeY - 1));
                verts[verts4Index + 2] =  -0.5 + (k / (sizeZ - 1));

                if(i < cellSizeX && j < cellSizeY && k < cellSizeZ)
                {
                    cellsIndex  = i * cellSizeY * cellSizeZ + j * cellSizeZ + k;
                    cells8Index = cellsIndex * CELL_SIZE;

                    cells[cells8Index + 0] = vertsIndex;
                    cells[cells8Index + 1] = vertsIndex + 1;
                    cells[cells8Index + 2] = vertsIndex + sizeXZ;
                    cells[cells8Index + 3] = vertsIndex + sizeXZ + 1;

                    vertsIndex += sizeY;

                    cells[cells8Index + 4] = vertsIndex;
                    cells[cells8Index + 5] = vertsIndex + 1;
                    cells[cells8Index + 6] = vertsIndex + sizeXZ;
                    cells[cells8Index + 7] = vertsIndex + sizeXZ + 1;

                }


            }
        }
    }

};

//visual debug

GLKit.ISOSurface.prototype.drawGrid = function(gl,time)
{


    var sizeX = this._vertSizeX,
        sizeY = this._vertSizeY,
        sizeZ = this._vertSizeZ;

    var i, j, k;

    var index,
        vertIndex;
    var verts = this._verts;

    var scaleUnitX = 1/(sizeX-1),
        scaleUnitY = 1/(sizeY-1),
        scaleUnitZ = 1/(sizeZ-1);
    var scale;

    var threshold1 = Math.abs(Math.sin(time*0.25+Math.PI*0.75)) * -2.1,
        threshold0 = threshold1 - 0.25;

    gl.drawMode(gl.TRIANGLES);

    i = -1;
    while(++i < sizeX)
    {
        j = -1;
        while(++j < sizeY)
        {
            k = -1;
            while(++k < sizeZ)
            {
                index = i * sizeY * sizeZ + j * sizeZ + k;
                vertIndex = index * 4;

                scale = verts[vertIndex+3];



                if(scale > threshold1 || scale < threshold0)continue;



                gl.pushMatrix();
                gl.translate3f(verts[vertIndex],verts[vertIndex+1],verts[vertIndex+2]);
                gl.scale3f(scaleUnitX,scaleUnitY,scaleUnitZ);
                gl.cube(1);

                gl.popMatrix();
          }
        }
    }

    var CELL_SIZE = GLKit.ISOSurface.CELL_SIZE;





};

GLKit.ISOSurface.prototype.applyFunction = function()
{
    this.applyFunctionWithArg(0);
};

GLKit.ISOSurface.prototype.applyFunctionWithArg = function(arg)
{
    var sizeX = this._vertSizeX,
        sizeY = this._vertSizeY,
        sizeZ = this._vertSizeZ;

    var index,
        verts4Index;

    var verts = this._verts;

    var i , j , k;

    i = -1;
    while(++i < sizeX)
    {
        j = -1;
        while(++j < sizeY)
        {
            k = -1;
            while(++k < sizeZ)
            {
                index  = i * sizeY * sizeZ + j * sizeZ + k;
                verts4Index = index * 4;

                verts[verts4Index + 3] = this._func(verts[verts4Index],verts[verts4Index+1],verts[verts4Index+2],arg);

            }
        }
    }

};