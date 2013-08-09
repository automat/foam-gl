//Testing Version
GLKit.ISOSurface = function(sizeX,sizeY,sizeZ)
{
    this._vertSizeX = null;
    this._vertSizeY = null;
    this._vertSizeZ = null;

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

    this._verts = new Array(this._vertSizeTotal * GLKit.Vec3.SIZE);
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
        verts3Index,
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
                verts3Index = vertsIndex * 3;

                verts[verts3Index    ] =  -0.5 + (i / (sizeX - 1));
                verts[verts3Index + 1] =  -0.5 + (j / (sizeY - 1));
                verts[verts3Index + 2] =  -0.5 + (k / (sizeZ - 1));

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


    console.log(cells);




};

//visual debug

GLKit.ISOSurface.prototype.drawGrid = function(gl)
{


    var sizeX = this._vertSizeX,
        sizeY = this._vertSizeY,
        sizeZ = this._vertSizeZ;

    var i, j, k;

    var index,
        vertIndex;
    var verts = this._verts;

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
                vertIndex = index * 3;

                gl.pushMatrix();

                gl.drawMode(gl.TRIANGLES);
                gl.translate3f(verts[vertIndex]*2,verts[vertIndex+1]*2,verts[vertIndex+2]*2);

                gl.cube(0.025);

                gl.popMatrix();
          }
        }
    }

};