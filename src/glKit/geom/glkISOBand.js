GLKit.ISOBand = function(sizeX,sizeZ,unitScaleX,unitScaleZ)
{
    this._vertSizeX  = null;
    this._vertSizeZ  = null;
    this._unitScaleX = 1;
    this._unitScaleZ = 1;

    switch(arguments.length)
    {
        case 1:
            this._vertSizeX = this._vertSizeZ = arguments[0];
            break;
        case 2:
            this._vertSizeX = arguments[0];
            this._vertSizeZ = arguments[1];
            break;
        case 3:
            this._vertSizeX = arguments[0];
            this._vertSizeZ = arguments[1];
            this._unitScaleX = this._unitScaleZ = arguments[2];
            break;
        case 4:
            this._vertSizeX  = arguments[0];
            this._vertSizeZ  = arguments[1];
            this._unitScaleX = arguments[2];
            this._unitScaleZ = arguments[3];
            break;
        default :
            this._vertSizeX = this._vertSizeZ = 3;
            break;
    }

    this._cellSizeX = this._vertSizeX - 1;
    this._cellSizeZ = this._vertSizeZ - 1;

    this._func     = function(x,y,arg0,arg1,arg2){return 0;};
    this._funcArg0 = 0;
    this._funcArg1 = 0;
    this._funcArg2 = 0;
    this._isoLevel = 0;

    this._numTriangles = 0;


    this._verts = new Float32Array(this._vertSizeX * this._vertSizeZ * 4);
    this._cells = new Array(this._cellSizeX * this._cellSizeZ);

    this._genSurface();


};

GLKit.ISOBand.prototype = Object.create(GLKit.Geom3d.prototype);


GLKit.ISOBand.prototype.setFunction = function(func,isoLevel)
{
    var funcArgsLength = func.length;

    if(funcArgsLength < 2)throw 'Function should satisfy function(x,y){}';
    if(funcArgsLength > 5)throw 'Function has to many arguments. Arguments length should not exceed 5. E.g function(x,y,arg0,arg1,arg2).';

    var funcString = func.toString(),
        funcArgs   = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).split(','),
        funcBody   = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));

    this._func     = new Function(funcArgs[0], funcArgs[1],
        funcArgs[2] || 'arg0', funcArgs[3] || 'arg1', funcArgs[4] || 'arg2',
        funcBody);
    this._isoLevel = isoLevel || 0;
};

GLKit.ISOBand.prototype._genSurface = function()
{
    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var cellSizeX = this._cellSizeX,
        cellSizeZ = this._cellSizeZ;

    var scaleX = this._unitScaleX,
        scaleZ = this._unitScaleZ;

    var verts = this._verts,
        vertsIndex,
        vertsIndexRowNext,
        cells = this._cells,
        cellsIndex;

    var i,j;

    i = -1;
    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeX)
        {
            vertsIndex = (vertSizeX * i + j)*4;
            verts[vertsIndex  ] = (-0.5 + (j/(vertSizeX - 1))) * scaleX;
            verts[vertsIndex+1] = 0;
            verts[vertsIndex+2] = (-0.5 + (i/(vertSizeZ - 1))) * scaleZ;
            verts[vertsIndex+3] = -1;

            if(i < cellSizeZ && j < cellSizeX)
            {
                vertsIndexRowNext = (vertSizeX * i + j + vertSizeX) * 4;

                cellsIndex = cellSizeX * i + j;
                cells[cellsIndex] = [vertsIndex,
                                     vertsIndex + 4,
                                     vertsIndexRowNext + 4,
                                     vertsIndexRowNext ];

            }
        }
    }


};

GLKit.ISOBand.prototype.applyFunction = function(arg)
{
    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;
    var verts = this._verts,
        vertsIndex;

    var i = -1,
        j;

    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeX)
        {
            vertsIndex = (vertSizeX * i + j) * 4;

            verts[vertsIndex + 3] = this._func(verts[vertsIndex],verts[vertsIndex+2],arg);
        }
    }





};

//visual debug
GLKit.ISOBand.prototype._draw = function(gl)
{
    var time = GLKit.Application.getInstance().getSecondsElapsed();

    this._numTriangles;

    this.applyFunction(time);

    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var verts = this._verts,
        vertsIndex;

    var i,j;

    var vertices = new Float32Array(verts.length / 4 * 3);

    var x,y;

    i = -1;
    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeX)
        {
            vertsIndex = (vertSizeX * i + j);

            vertices[vertsIndex*3  ] = verts[vertsIndex*4  ];
            vertices[vertsIndex*3+1] = verts[vertsIndex*4+1];
            vertices[vertsIndex*3+2] = verts[vertsIndex*4+2];


        }
    }

    var val;
    gl.drawMode(gl.POINTS);

    var i = -1;
    while(++i < verts.length)
    {
        //gl.pointSize(1);
        //gl.point3f(verts[i*4],verts[i*4+1],verts[i*4+2]);

        val = verts[i*4+3];

        if(val <= 0)continue;

        gl.pointSize(val*5);
        gl.point3f(verts[i*4],verts[i*4+1],verts[i*4+2]);
    }

    //gl.points(vertices);


    var tick = Math.sin(time*0.125);
    var cellIndex = Math.floor(Math.abs(tick) * this._cells.length);
    var cell = this._cells[cellIndex];

    if(!cell)return;

    //console.log(cell);

    gl.drawMode(gl.LINE_LOOP);
    //gl.quadf(verts[])
    var v0Index = cell[0],
        v1Index = cell[1],
        v2Index = cell[2],
        v3Index = cell[3];

    var cellVertices = new Float32Array(4 * 3);
    var cellVerticesValues = new Float32Array(4);

    cellVertices[ 0] = verts[v0Index    ];
    cellVertices[ 1] = verts[v0Index + 1];
    cellVertices[ 2] = verts[v0Index + 2];
    cellVerticesValues[0] = verts[v0Index + 3];

    cellVertices[ 3] = verts[v1Index    ];
    cellVertices[ 4] = verts[v1Index + 1];
    cellVertices[ 5] = verts[v1Index + 2];
    cellVerticesValues[1] = verts[v1Index + 3];

    cellVertices[ 6] = verts[v2Index    ];
    cellVertices[ 7] = verts[v2Index + 1];
    cellVertices[ 8] = verts[v2Index + 2];
    cellVerticesValues[2] = verts[v2Index + 3];

    cellVertices[ 9] = verts[v3Index    ];
    cellVertices[10] = verts[v3Index + 1];
    cellVertices[11] = verts[v3Index + 2];
    cellVerticesValues[3] = verts[v3Index + 3];

    gl.color1f(0.5);
    gl.quadf(cellVertices[0],cellVertices[1],cellVertices[2],
             cellVertices[3],cellVertices[4],cellVertices[5],
             cellVertices[6],cellVertices[7],cellVertices[8],
             cellVertices[9],cellVertices[10],cellVertices[11]);

    gl.color1f(1);
    gl.drawMode(gl.POINTS);
    gl.color3f(1,0,0);
    gl.pointSize(5);
    gl.points(cellVertices);
    //gl.point3f(Math.sin(time),1,1);
    gl.pointSize(1);

    var cellState  = (cellVerticesValues[0] > 0) << 3 |
                     (cellVerticesValues[1] > 0) << 2 |
                     (cellVerticesValues[2] > 0) << 1 |
                     (cellVerticesValues[3] > 0);

    var top = GLKit.ISOBand.TOP_TABLE[cellState];

    var vi0,vi1,vi2,vi3;

    var v0,v1;
    var vertsIntrpld = new Float32Array(6);

    gl.drawMode(gl.LINES);
    gl.color3f(0,0,1);

    i = 0;
    while(i < top.length)
    {
        vi0 = top[i  ];
        vi1 = top[i+1];
        vi2 = top[i+2];
        vi3 = top[i+3];

        //console.log(cell[vi0]);

        v0 = this._intrpl(verts[cell[vi0]],verts[cell[vi0]+2],verts[cell[vi1]],verts[cell[vi1]+2],cellVerticesValues[vi0],cellVerticesValues[vi1]);
        v1 = this._intrpl(verts[cell[vi2]],verts[cell[vi2]+2],verts[cell[vi3]],verts[cell[vi3]+2],cellVerticesValues[vi2],cellVerticesValues[vi3]);

        //gl.linef(verts[cell[vi0]],verts[cell[vi0]+1],verts[cell[vi0]+2],0,0,0);
        //gl.linef(verts[cell[vi0]],verts[cell[vi0]+1],verts[cell[vi0]+2],0,0,0);

        gl.linef(v0[0],0,v0[1],v1[0],0,v1[1]);

        i += 4;
    }








    if(tick < 0 && cellIndex > this._cellSizeZ) return;







    //gl.linef(verts[v0Index],verts[v0Index+1],verts[v0Index+2],verts[v1Index],verts[v1Index+1],verts[v1Index+2])
    //gl.linef(verts[v2Index],verts[v2Index+1],verts[v2Index+2],verts[v3Index],verts[v3Index+1],verts[v3Index+2])


};

GLKit.ISOBand.prototype._intrpl = function(x0,z0,x1,z1,val0,val1)
{
    //return [GLKit.Math.lerp(x0,x1,0.5),GLKit.Math.lerp(z0,z1,0.5)];
    if(val0 == 0 || val1 == 0)return [x0,z0];

    return [ -val0*(x1-x0)/(val1-val0) + x0,-val0*(z1-z0)/(val1-val0) + z0]

};

GLKit.ISOBand.prototype._march = function(cellIndex)
{

};

GLKit.ISOBand.TOP_TABLE =
[
        [],
        [ 2, 3, 3, 0],
        [ 1, 2, 2, 3],
        [ 1, 2, 3, 0],
        [ 0, 1, 1, 2],
        [ 0, 1, 1, 2, 2, 3, 3, 0],
        [ 0, 1, 2, 3],
        [ 0, 1, 3, 0],
        [ 0, 1, 3, 0],
        [ 0, 1, 2, 3],
        [ 0, 1, 1, 2, 2, 3, 3, 0],
        [ 0, 1, 1, 2],
        [ 1, 2, 3, 0],
        [ 1, 2, 2, 3],
        [ 2, 3, 3, 0],
        []
];

GLKit.ISOBand.TRI_TABLE =
[
    [],
    [ 1, 0, 0, 3, 1, 1],
    [ 1, 0, 0, 2, 1, 1],
    [ 1, 0, 0, 2, 0, 3, 0, 3, 1, 1 ,1 ,0 ],
    [ 1, 0, 0, 1, 1, 1],
    [ 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1, 2, 0, 3, 1, 3, 1, 3, 1, 0, 1, 1],
    [ 1, 0, 0, 1, 1, 1, 0, 1, 0, 2, 1, 1],
    [ 1, 0, 0, 1, 0, 2, 0, 2, 1, 1, 1, 0, 0, 2, 0, 3, 1, 1 ],
    [ 0, 0, 1, 0, 1, 1],
    [ 0, 0, 1, 0, 0, 3, 1, 0, 1, 1, 0, 3],
    [ 0, 0, 1, 0, 1, 3, 1, 0, 1, 1, 1, 3, 1, 1, 0, 2, 1, 2, 1, 2, 1, 3, 1, 1 ],
    [ 0, 0, 1, 0, 0, 3, 1, 0, 1, 1, 0, 3, 1, 1, 0, 2, 0, 3],
    [ 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
    [ 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 3, 0, 0],
    [ 0, 0, 0, 1, 1, 1, 0, 1, 0, 2, 1, 0, 1, 0, 1, 1, 0, 1],
    [ 0, 0, 0, 1, 0, 3, 0, 1, 0, 2, 0, 3]
];

