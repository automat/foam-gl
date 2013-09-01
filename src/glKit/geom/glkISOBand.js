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


    this._verts       = new Float32Array(this._vertSizeX * this._vertSizeZ * 4);
    this._cells       = new Array(this._cellSizeX * this._cellSizeZ);
    this._cachedEdges = new Float32Array(this._cells.length * 4 * 3);

    this._tempCellVertices     = new Float32Array(4 * 3);
    this._tempCellVerticesVals = new Float32Array(4);
    this._tempCellConVertices  = new Float32Array(6);

    this._indices = [];

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

    this._indices = [];

    this.applyFunction(time);

    var cells = this._cells;

    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var cellSizeX = this._cellSizeX,
        cellSizeZ = this._cellSizeZ;

    var verts = this._verts,
        vertsIndex;

    var indices = this._indices;

    var i,j;

    var cachedEdges = this._cachedEdges,
        cachedEdgesIndex;

    //reset cached edges flags;
    /*
    i = -1;
    while(++i < cells.length)
    {
        cachedEdgesIndex = i * 4 * 4;
        cachedEdges[cachedEdgesIndex + 3 ] =    //flag of upper  edge
        cachedEdges[cachedEdgesIndex + 7 ] =    //flag of right  edge
        cachedEdges[cachedEdgesIndex + 11] =    //flag of bottom edge
        cachedEdges[cachedEdgesIndex + 15] = -1;//flag of left   edge
    }
    */


    var vertices = new Float32Array(verts.length / 4 * 3);

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

    gl.drawMode(gl.POINTS);
    //gl.points(vertices);

    i = -1;
    var k;



    var cellIndex,
        cell,
        cellState;

    var cellVertices = this._tempCellVertices;

    //Cell vertex indices in global vertices
    var v0Index,  // 0 1
        v1Index,  // 3 2
        v2Index,
        v3Index;

    //Cell vertex values ...,x,y,z,VALUE,...
    var vVals = this._tempCellVerticesVals,
        v0Val,v1Val,v2Val,v3Val;

    //Topologic entry / lookup
    var entryTopLu,
        ISOBAND_TOP_LU = GLKit.ISOBand.TOP_TABLE;

    var entryTopLu0,
        entryTopLu1,
        entryTopLu2,
        entryTopLu3;

    //value interpolated vertices of cell
    var conVertices = this._tempCellConVertices;

    gl.drawMode(gl.LINE_LOOP);

    var tt = GLKit.Math.saw(time*0.75);

    i = Math.floor(Math.abs(tt) * cellSizeZ);
    j = 1;
    cellIndex = cellSizeX * i + j;//Math.floor(Math.abs(tt) * cells.length);
    cell = cells[cellIndex];


    if(cell)
    {


        v0Index = cell[0];
        v1Index = cell[1];
        v2Index = cell[2];
        v3Index = cell[3];

        cellVertices[ 0] = verts[v0Index    ];
        cellVertices[ 1] = verts[v0Index + 1];
        cellVertices[ 2] = verts[v0Index + 2];

        cellVertices[ 3] = verts[v1Index    ];
        cellVertices[ 4] = verts[v1Index + 1];
        cellVertices[ 5] = verts[v1Index + 2];

        cellVertices[ 6] = verts[v2Index    ];
        cellVertices[ 7] = verts[v2Index + 1];
        cellVertices[ 8] = verts[v2Index + 2];

        cellVertices[ 9] = verts[v3Index    ];
        cellVertices[10] = verts[v3Index + 1];
        cellVertices[11] = verts[v3Index + 2];

        gl.color3f(1,1,1);
        gl.quadf(cellVertices[0],cellVertices[1],cellVertices[2],
            cellVertices[3],cellVertices[4],cellVertices[5],
            cellVertices[6],cellVertices[7],cellVertices[8],
            cellVertices[9],cellVertices[10],cellVertices[11]);

        if(tt > 0 )
        {
            if(j!=0 )
            {
                cell      = cells[cellIndex - 1];

                v0Index = cell[0];
                v1Index = cell[1];
                v2Index = cell[2];
                v3Index = cell[3];

                cellVertices[ 0] = verts[v0Index    ];
                cellVertices[ 1] = verts[v0Index + 1];
                cellVertices[ 2] = verts[v0Index + 2];

                cellVertices[ 3] = verts[v1Index    ];
                cellVertices[ 4] = verts[v1Index + 1];
                cellVertices[ 5] = verts[v1Index + 2];

                cellVertices[ 6] = verts[v2Index    ];
                cellVertices[ 7] = verts[v2Index + 1];
                cellVertices[ 8] = verts[v2Index + 2];

                cellVertices[ 9] = verts[v3Index    ];
                cellVertices[10] = verts[v3Index + 1];
                cellVertices[11] = verts[v3Index + 2];

                gl.color3f(1,0,0);
                gl.quadf(cellVertices[0],cellVertices[1],cellVertices[2],
                    cellVertices[3],cellVertices[4],cellVertices[5],
                    cellVertices[6],cellVertices[7],cellVertices[8],
                    cellVertices[9],cellVertices[10],cellVertices[11]);

            }



            if( i != 0 )
            {
                cellIndex = cellIndex - cellSizeX;
                cell      = cells[cellIndex];

                v0Index = cell[0];
                v1Index = cell[1];
                v2Index = cell[2];
                v3Index = cell[3];

                cellVertices[ 0] = verts[v0Index    ];
                cellVertices[ 1] = verts[v0Index + 1];
                cellVertices[ 2] = verts[v0Index + 2];

                cellVertices[ 3] = verts[v1Index    ];
                cellVertices[ 4] = verts[v1Index + 1];
                cellVertices[ 5] = verts[v1Index + 2];

                cellVertices[ 6] = verts[v2Index    ];
                cellVertices[ 7] = verts[v2Index + 1];
                cellVertices[ 8] = verts[v2Index + 2];

                cellVertices[ 9] = verts[v3Index    ];
                cellVertices[10] = verts[v3Index + 1];
                cellVertices[11] = verts[v3Index + 2];

                gl.color3f(0,1,0);
                gl.quadf(cellVertices[0],cellVertices[1],cellVertices[2],
                    cellVertices[3],cellVertices[4],cellVertices[5],
                    cellVertices[6],cellVertices[7],cellVertices[8],
                    cellVertices[9],cellVertices[10],cellVertices[11]);


            }




        }

    }


    var cachedEdgesIndexLeft,
        cachedEdgesIndexTop;


    //
    gl.pointSize(6);
    i = -1;
    while(++i < cellSizeZ)
    {
        j = -1;
        while(++j < cellSizeX)
        {
            cellIndex        = cellSizeX * i + j;
            cell             = cells[cellIndex];

            v0Index = cell[0];
            v1Index = cell[1];
            v2Index = cell[2];
            v3Index = cell[3];

            v0Val = vVals[0] = verts[v0Index + 3];
            v1Val = vVals[1] = verts[v1Index + 3];
            v2Val = vVals[2] = verts[v2Index + 3];
            v3Val = vVals[3] = verts[v3Index + 3];

            cellState = (v0Val > 0) << 3 |
                        (v1Val > 0) << 2 |
                        (v2Val > 0) << 1 |
                        (v3Val > 0);

            if(cellState == 0)continue;

            cellVertices[ 0] = verts[v0Index    ];
            cellVertices[ 1] = verts[v0Index + 1];
            cellVertices[ 2] = verts[v0Index + 2];

            cellVertices[ 3] = verts[v1Index    ];
            cellVertices[ 4] = verts[v1Index + 1];
            cellVertices[ 5] = verts[v1Index + 2];

            cellVertices[ 6] = verts[v2Index    ];
            cellVertices[ 7] = verts[v2Index + 1];
            cellVertices[ 8] = verts[v2Index + 2];

            cellVertices[ 9] = verts[v3Index    ];
            cellVertices[10] = verts[v3Index + 1];
            cellVertices[11] = verts[v3Index + 2];



            cachedEdgesIndex     = cellIndex * 4 * 3;


            entryTopLu = ISOBAND_TOP_LU[cellState];

            gl.drawMode(gl.LINES);
            gl.color3f(0,0,1);

            k = 0;

            //cell upper left
            if(i == 0 && j == 0)
            {
                gl.color3f(1,1,1);

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    this._intrpl(cell[entryTopLu0],cell[entryTopLu1],conVertices,0);
                    this._intrpl(cell[entryTopLu2],cell[entryTopLu3],conVertices,3);

                    entryTopLu0 *= 3;
                    entryTopLu2 *= 3;


                    cachedEdges[cachedEdgesIndex + entryTopLu0    ] = conVertices[0];
                    cachedEdges[cachedEdgesIndex + entryTopLu0 + 1] = conVertices[1];
                    cachedEdges[cachedEdgesIndex + entryTopLu0 + 2] = conVertices[2];


                    cachedEdges[cachedEdgesIndex + entryTopLu2    ] = conVertices[3];
                    cachedEdges[cachedEdgesIndex + entryTopLu2 + 1] = conVertices[4];
                    cachedEdges[cachedEdgesIndex + entryTopLu2 + 2] = conVertices[5];

                    indices.push(cachedEdgesIndex + entryTopLu0);
                    indices.push(cachedEdgesIndex + entryTopLu2);


                    //gl.drawMode(gl.POINTS);
                    //gl.points(conVertices);

                    //gl.drawMode(gl.LINES);
                    gl.line(conVertices);


                    k += 4;
                }

            }

            //cells first row after upper left
            if(i == 0 && j > 0)
            {
                cachedEdgesIndexLeft = (cellIndex - 1) * 4 * 3;

                gl.color3f(0,1,0);

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on left edge
                    if(entryTopLu0 == 3)
                    {
                        //assign previous calculated edge vertex from previous cell



                        conVertices[0] = cachedEdges[cachedEdgesIndexLeft + 3];
                        conVertices[1] = cachedEdges[cachedEdgesIndexLeft + 4];
                        conVertices[2] = cachedEdges[cachedEdgesIndexLeft + 5];

                        indices.push(cachedEdgesIndexLeft + 3);

                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],conVertices,0);

                        entryTopLu0 *= 3;

                        //assign to cached edges
                        cachedEdges[cachedEdgesIndex + entryTopLu0    ] = conVertices[0];
                        cachedEdges[cachedEdgesIndex + entryTopLu0 + 1] = conVertices[1];
                        cachedEdges[cachedEdgesIndex + entryTopLu0 + 2] = conVertices[2];

                        indices.push(cachedEdgesIndex + entryTopLu0);
                    }

                    //check second vertex is on left edge
                    if(entryTopLu2 == 3)
                    {
                        conVertices[3] = cachedEdges[cachedEdgesIndexLeft + 3];
                        conVertices[4] = cachedEdges[cachedEdgesIndexLeft + 4];
                        conVertices[5] = cachedEdges[cachedEdgesIndexLeft + 5];

                        indices.push(cachedEdgesIndexLeft + 3);
                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],conVertices,3);

                        entryTopLu2 *= 3;

                        //assign to cached edges
                        cachedEdges[cachedEdgesIndex + entryTopLu2    ] = conVertices[3];
                        cachedEdges[cachedEdgesIndex + entryTopLu2 + 1] = conVertices[4];
                        cachedEdges[cachedEdgesIndex + entryTopLu2 + 2] = conVertices[5];

                        indices.push(cachedEdgesIndex + entryTopLu2);
                    }

                    //gl.drawMode(gl.POINTS);
                    //gl.points(conVertices);

                    //gl.drawMode(gl.LINES);
                    gl.line(conVertices);


                    k += 4;
                }
            }

            //cells first column after upper left

            if(i != 0 && j == 0)
            {
                cachedEdgesIndexTop  = (cellIndex - cellSizeX) * 4 * 3;

                gl.color3f(1,0,0);

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on top edge
                    if(entryTopLu0 == 0)
                    {
                        //assign previous calculated bottom edge vertex from previous cell
                        conVertices[0] = cachedEdges[cachedEdgesIndexTop + 6 ];
                        conVertices[1] = cachedEdges[cachedEdgesIndexTop + 7 ];
                        conVertices[2] = cachedEdges[cachedEdgesIndexTop + 8];

                        indices.push(cachedEdgesIndexTop + 6);

                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],conVertices,0);

                        entryTopLu0 *= 3;

                        //assign to cached edges
                        //cachedEdges[cachedEdgesIndex + entryTopLu0 + 3] = 1;
                        cachedEdges[cachedEdgesIndex + entryTopLu0    ] = conVertices[0];
                        cachedEdges[cachedEdgesIndex + entryTopLu0 + 1] = conVertices[1];
                        cachedEdges[cachedEdgesIndex + entryTopLu0 + 2] = conVertices[2];

                        indices.push(cachedEdgesIndex + entryTopLu0);

                    }

                    //check first vertex is on top edge
                    if(entryTopLu2 == 0)
                    {
                        //assign previous calculated bottom edge vertex from previous cell
                        conVertices[3] = cachedEdges[cachedEdgesIndexTop + 6];
                        conVertices[4] = cachedEdges[cachedEdgesIndexTop + 7];
                        conVertices[5] = cachedEdges[cachedEdgesIndexTop + 8];

                        indices.push(cachedEdgesIndexTop + 6);

                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],conVertices,3);

                        entryTopLu2 *= 3;

                        //assign to cached edges
                        cachedEdges[cachedEdgesIndex + entryTopLu2    ] = conVertices[3];
                        cachedEdges[cachedEdgesIndex + entryTopLu2 + 1] = conVertices[4];
                        cachedEdges[cachedEdgesIndex + entryTopLu2 + 2] = conVertices[5];

                        indices.push(cachedEdgesIndex + entryTopLu2);
                    }

                    //gl.drawMode(gl.POINTS);
                    //gl.points(conVertices);

                    //gl.drawMode(gl.LINES);
                    gl.line(conVertices);

                    k += 4;
                }

            }

            //check all other cells

            if(i != 0 && j != 0)
            {
                cachedEdgesIndexLeft = (cellIndex - 1) * 4 * 3;
                cachedEdgesIndexTop  = (cellIndex - cellSizeX) * 4 * 3;

                gl.color3f(0,0,1);

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on left edge
                    if(entryTopLu0 == 3)
                    {
                        //assign previous calculated edge vertex from previous cell
                        conVertices[0] = cachedEdges[cachedEdgesIndexLeft + 3];
                        conVertices[1] = cachedEdges[cachedEdgesIndexLeft + 4];
                        conVertices[2] = cachedEdges[cachedEdgesIndexLeft + 5];

                        indices.push(cachedEdgesIndexLeft + 3);
                    }
                    else if(entryTopLu0 == 0)
                    {
                        //assign previous calculated bottom edge vertex from previous cell
                        conVertices[0] = cachedEdges[cachedEdgesIndexTop + 6 ];
                        conVertices[1] = cachedEdges[cachedEdgesIndexTop + 7 ];
                        conVertices[2] = cachedEdges[cachedEdgesIndexTop + 8];

                        indices.push(cachedEdgesIndexTop + 6);

                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],conVertices,0);

                        entryTopLu0 *= 3;

                        //assign to cached edges
                        //cachedEdges[cachedEdgesIndex + entryTopLu0 + 3] = 1;
                        cachedEdges[cachedEdgesIndex + entryTopLu0    ] = conVertices[0];
                        cachedEdges[cachedEdgesIndex + entryTopLu0 + 1] = conVertices[1];
                        cachedEdges[cachedEdgesIndex + entryTopLu0 + 2] = conVertices[2];

                        indices.push(cachedEdgesIndex + entryTopLu0);
                    }

                    //check second vertex is on left edge
                    if(entryTopLu2 == 3)
                    {
                        conVertices[3] = cachedEdges[cachedEdgesIndexLeft + 3];
                        conVertices[4] = cachedEdges[cachedEdgesIndexLeft + 4];
                        conVertices[5] = cachedEdges[cachedEdgesIndexLeft + 5];

                        indices.push(cachedEdgesIndexLeft + 3);
                    }
                    else if(entryTopLu2 == 0)
                    {
                        //assign previous calculated bottom edge vertex from previous cell
                        conVertices[3] = cachedEdges[cachedEdgesIndexTop +  6];
                        conVertices[4] = cachedEdges[cachedEdgesIndexTop +  7];
                        conVertices[5] = cachedEdges[cachedEdgesIndexTop +  8];

                        indices.push(cachedEdgesIndexTop + 6);
                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],conVertices,3);

                        entryTopLu2 *= 3;

                        //assign to cached edges
                        cachedEdges[cachedEdgesIndex + entryTopLu2    ] = conVertices[3];
                        cachedEdges[cachedEdgesIndex + entryTopLu2 + 1] = conVertices[4];
                        cachedEdges[cachedEdgesIndex + entryTopLu2 + 2] = conVertices[5];

                        indices.push(cachedEdgesIndex + entryTopLu2);

                    }


                    //gl.drawMode(gl.POINTS);
                    //gl.points(conVertices);

                    //gl.drawMode(gl.LINES);
                    gl.line(conVertices);

                    k += 4;
                }

            }

        }
    }

    gl.pointSize(1);

    i = 0;
    gl.drawMode(gl.POINTS);
    gl.color1f(1);
    gl.pointSize(1);


    while(i < verts.length)
    {
        if(verts[i+3]>0)gl.point3f(verts[i],verts[i+1],verts[i+2]);
        i+=4;
    }

    gl.pointSize(3);
    i = -1;
    while(++i < indices.length)
    {
        gl.point3f(cachedEdges[indices[i]+0],cachedEdges[indices[i]+1],cachedEdges[indices[i]+2])

    }





};

GLKit.ISOBand.prototype._intrpl = function(index0,index1,out,offset)
{
    var verts = this._verts;

    var v0x = verts[index0  ],
        v0z = verts[index0+2],
        v0v = verts[index0+3];

    var v1x = verts[index1  ],
        v1z = verts[index1+2],
        v1v = verts[index1+3];

    if(v0v == 0 || v1v == 0)
    {
        out[offset+0] = v0x;
        out[offset+1] = 0;
        out[offset+2] = v0z;

        return;
    }

    var v10v = v1v - v0v;

    out[offset+0] = -v0v * (v1x - v0x) / v10v + v0x;
    out[offset+1] = 0;
    out[offset+2] = -v0v * (v1z - v0z) / v10v + v0z;
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

