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

    /*---------------------------------------------------------------------------------------------------------*/


    this._cellSizeX = this._vertSizeX - 1;
    this._cellSizeZ = this._vertSizeZ - 1;

    this._func     = function(x,y,arg0,arg1,arg2){return 0;};
    this._funcArg0 = 0;
    this._funcArg1 = 0;
    this._funcArg2 = 0;
    this._isoLevel = 0;

    this._numTriangles = 0;

    //TODO CHECK MAX ELEMENT EXCEED
    this._verts = new Float32Array(this._vertSizeX * this._vertSizeZ * 4); // grid calculated norm values + function result value ...,x,y,z,v,...
    this._cells = new Array(this._cellSizeX * this._cellSizeZ);

    //TODO REMOVE ADJACENT EDGE DOUBLES
    //note: no doubles in indices
    // * ----- * ----- *
    // |   0   |   4   |
    // |3     1|7     5|
    // |   2   |   6   |
    // * ----- * ----- *
    // |   8   |   12  |
    // |11    9|15   13|
    // |  10   |   14  |
    // * ----- * ----- *
    //
    this._edges = new Float32Array(this._cells.length * 4 * 3);

    this._tempCellVerticesVals = new Float32Array(4);

    this._indices  = [];


    this._genSurface();


};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.ISOBand.prototype = Object.create(GLKit.Geom3d.prototype);

/*---------------------------------------------------------------------------------------------------------*/


//dont need this
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

/*---------------------------------------------------------------------------------------------------------*/
// Setup points
/*---------------------------------------------------------------------------------------------------------*/

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
            vertsIndex          = (vertSizeX * i + j)*4;
            verts[vertsIndex  ] = (-0.5 + (j/(vertSizeX - 1))) * scaleX;
            verts[vertsIndex+1] = 0;
            verts[vertsIndex+2] = (-0.5 + (i/(vertSizeZ - 1))) * scaleZ;
            verts[vertsIndex+3] = -1;

            if(i < cellSizeZ && j < cellSizeX)
            {
                vertsIndexRowNext = (vertSizeX * i + j + vertSizeX) * 4;

                cellsIndex        = cellSizeX * i + j;
                cells[cellsIndex] = [vertsIndex,
                                     vertsIndex + 4,
                                     vertsIndexRowNext + 4,
                                     vertsIndexRowNext ];

            }
        }
    }
};

/*---------------------------------------------------------------------------------------------------------*/
// apply function to data points
/*---------------------------------------------------------------------------------------------------------*/

GLKit.ISOBand.prototype.applyFunction = function(arg0,arg1,arg2)
{
    var verts = this._verts,
        vertsIndex;

    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var i, j;

    i = -1;
    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeX)
        {
            vertsIndex = (vertSizeX * i + j) * 4;
            verts[vertsIndex + 3] = this._func(verts[vertsIndex],verts[vertsIndex+2],arg0,arg1,arg2);
        }
    }

    this.march();
};

GLKit.ISOBand.prototype.applyFunctionMult = function(arg0,arg1,arg2)
{
    var verts = this._verts,
        vertsIndex;

    var vertsSizeX = this._vertSizeX,
        vertsSizeZ = this._vertSizeZ;

    var i, j;

    i = -1;
    while(++i < vertsSizeZ)
    {
        j = -1;
        while(++j < vertsSizeX)
        {
            vertsIndex = (vertsSizeX * i + j) * 4;
            verts[vertsIndex + 3] *= this._func(verts[vertsIndex],verts[vertsIndex+2],arg0,arg1,arg2);
        }
    }

    this.march();
};

GLKit.ISOBand.prototype.setData = function(data,width,height)
{

    var vertsSizeX = this._vertSizeX,
        vertsSizeZ = this._vertSizeZ;

    if(width > vertsSizeZ || height > vertsSizeX)
        throw 'Data exceeds buffer size. Should not exceed ' + vertsSizeZ + ' in width and ' + vertsSizeX + ' in height';

    var verts = this._verts;

    var i ,j;
    i = -1;
    while(++i < width)
    {
        j = -1;
        while(++j < height)
        {
            verts[(height * i + j) * 4 + 3] = data[height * i + j];
        }
    }
};



/*---------------------------------------------------------------------------------------------------------*/
// march
/*---------------------------------------------------------------------------------------------------------*/

GLKit.ISOBand.prototype.march = function()
{
    //reset indices
    this._indices  = [];

    var verts = this._verts;

    var i, j, k;

    var cells    = this._cells,
        edges    = this._edges,
        indices  = this._indices;

    var cellSizeX = this._cellSizeX,
        cellSizeZ = this._cellSizeZ;

    var cellIndex,
        cell,
        cellState;

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
        ISOBAND_TOP_LU     = GLKit.ISOBand.TOP_TABLE;

    var entryTopLu0,
        entryTopLu1,
        entryTopLu2,
        entryTopLu3;

    var edgeIndex,
        edgeIndexLeft,
        edgeIndexTop,
        edgeIndex3;

    //
    //  0 ------- 1
    //  |    0    |
    //  | 3     1 |
    //  |    2    |
    //  3 ------- 2
    //


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

            edgeIndex  = cellIndex * 4;
            edgeIndex3 = edgeIndex * 3;
            entryTopLu = ISOBAND_TOP_LU[cellState];

            //cell upper left
            k = 0;
            if(i == 0 && j == 0)
            {

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //get edge vertex 0 according to topological entry
                    this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndex3 + entryTopLu0 * 3);
                    indices.push(edgeIndex + entryTopLu0);

                    //get edge vertex 1 according to topological entry
                    this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndex3 + entryTopLu2 * 3);
                    indices.push(edgeIndex + entryTopLu2);

                    k += 4;
                }
            }

            //cells first row after upper left
            if(i == 0 && j > 0)
            {
                edgeIndexLeft  = (cellIndex - 1) * 4;

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check if edge is on adjacent left side, and push index of edge,
                    //if not, calculate edge, push index of new edge


                    //check first vertex is on left edge
                    if(entryTopLu0 == 3)
                    {
                        //assign previous calculated edge vertex from previous cell
                        indices.push(edgeIndexLeft + 1);
                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndex3 + entryTopLu0 * 3);
                        indices.push(edgeIndex + entryTopLu0);
                    }

                    //check second vertex is on left edge

                    if(entryTopLu2 == 3)
                    {
                        indices.push(edgeIndexLeft + 1);
                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndex3 + entryTopLu2 * 3);
                        indices.push(edgeIndex + entryTopLu2);
                    }


                    k += 4;
                }
            }

            //cells first column after upper left
            if(i != 0 && j == 0)
            {
                edgeIndexTop   = (cellIndex - cellSizeX) * 4;

                while(k < entryTopLu.length)
                {

                    //check if edge is on adjacent top side, and push index of edge,
                    //if not, calculate edge, push index of new edge

                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on top edge
                    if(entryTopLu0 == 0)
                    {
                        indices.push(edgeIndexTop + 2);
                    }
                    else
                    {
                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges, edgeIndex3 + entryTopLu0 * 3);
                        indices.push(edgeIndex + entryTopLu0);
                    }

                    //check first vertex is on top edge
                    if(entryTopLu2 == 0)
                    {
                        indices.push(edgeIndexTop + 2);
                    }
                    else
                    {
                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndex3 + entryTopLu2 * 3);
                        indices.push(edgeIndex + entryTopLu2);
                    }

                    k += 4;
                }

            }

            //check all other cells

            if(i != 0 && j != 0)
            {

                //check if edge is on adjacent left side, and push index of edge,
                //if not, calculate edge, push index of new edge

                edgeIndexLeft  = (cellIndex - 1) * 4;
                edgeIndexTop   = (cellIndex - cellSizeX) * 4;

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on left edge
                    if(entryTopLu0 == 3)
                    {
                        indices.push(edgeIndexLeft + 1);
                    }
                    else if(entryTopLu0 == 0)//maybe upper cell?
                    {

                        indices.push(edgeIndexTop + 2);

                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndex3 + entryTopLu0 * 3);
                        indices.push(edgeIndex + entryTopLu0);
                    }

                    //check second vertex is on left edge
                    if(entryTopLu2 == 3)
                    {
                        indices.push(edgeIndexLeft + 1);
                    }
                    else if(entryTopLu2 == 0)//maybe upper cell?
                    {
                        indices.push(edgeIndexTop + 2);
                    }
                    else //calculate edge vertex
                    {
                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndex3 + entryTopLu2 * 3);
                        indices.push(edgeIndex + entryTopLu2);
                    }

                    k += 4;
                }
            }
        }
    }

    this._indices = new Uint16Array(indices);
};

//visual debug need isoline/isoband switch
GLKit.ISOBand.prototype._draw = function(gl)
{
    var edges = this._edges;
    gl.drawElements(edges,null,gl.fillColorBuffer(gl.getColorBuffer(),new Float32Array(edges.length/3*4)),null,this._indices,gl.getDrawMode());
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

    if(v0v == 0)
    {
        out[offset+0] = v1x;
        out[offset+1] = 0;
        out[offset+2] = v1z;

        return;
    }
    else if(v1v == 0)
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


GLKit.ISOBand.prototype.getVertices      = function(){return this._verts;};
GLKit.ISOBand.prototype.getVerticesSizeX = function(){return this._vertSizeX;};
GLKit.ISOBand.prototype.getVerticesSizeZ = function(){return this._vertSizeZ;};
GLKit.ISOBand.prototype.getCells         = function(){return this._cells;};
GLKit.ISOBand.prototype.getCellsSizeX    = function(){return this._cellSizeX;};
GLKit.ISOBand.prototype.getCellsSizeZ    = function(){return this._cellSizeZ;};
GLKit.ISOBand.prototype.getEdges         = function(){return this._edges;};
GLKit.ISOBand.prototype.getIndices       = function(){return this._indices;};

/*---------------------------------------------------------------------------------------------------------*/
// TOPOLOGICAL
/*---------------------------------------------------------------------------------------------------------*/

//TODO merge
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

/*---------------------------------------------------------------------------------------------------------*/
// TRIANGE
/*---------------------------------------------------------------------------------------------------------*/

//TODO merge
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

