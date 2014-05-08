var Vec3   = require('../src/foam/math/fVec3'),
    Vec4   = require('../src/foam/math/fVec4'),
    Flags  = require('../src/foam/system/fFlags'),
    Geom3d = require('./../src/foam/geom/fGeom3d');


//This is just an initial version
function ISOSurface(sizeX,sizeY,sizeZ)
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
            this._vertSizeX = this._vertSizeY = this._vertSizeZ = 3;
            break;
    }

    this._cubeSizeX = this._vertSizeX - 1;
    this._cubeSizeY = this._vertSizeY - 1;
    this._cubeSizeZ = this._vertSizeZ - 1;

    this._delayedClear = false;

    //TODO:FIX!!
    this._func      = function(x,y,z,arg0,arg1,arg2){return 0;};
    this._funcArg0  = 0;
    this._funcArg1  = 0;
    this._funcArg2  = 0;
    this._isoLevel  = 0;

    //TODO: unroll
    this._verts = new Array(this._vertSizeX*this._vertSizeY*this._vertSizeZ);
    this._cubes = new Array(this._cubeSizeX*this._cubeSizeY*this._cubeSizeZ);

    this._numTriangles = 0;

    var SIZE_OF_TRIANGLE   = 3,
        SIZE_OF_CUBE_EDGES = 12;
    var MAX_BUFFER_LEN     = this._cubes.length * 4;

    this._bVertices = new Float32Array((MAX_BUFFER_LEN)*SIZE_OF_TRIANGLE*Vec3.SIZE);
    this._bNormals  = new Float32Array((MAX_BUFFER_LEN)*SIZE_OF_TRIANGLE*Vec3.SIZE);
    this._bColors   = new Float32Array((MAX_BUFFER_LEN)*SIZE_OF_TRIANGLE*Vec4.SIZE);

    this._tempVertices = new Array(SIZE_OF_CUBE_EDGES*Vec3.SIZE);
    this._tempNormals  = new Array(SIZE_OF_CUBE_EDGES);

    this._scaleXYZ = [1,1,1];

    this._genSurface();

}

ISOSurface.prototype = Object.create(Geom3d.prototype);


/*---------------------------------------------------------------------------------------------------------*/
//
//
//           2 ------- 3    Vertex order
//          /|        /|
//         / |       / |
//        6 ------- 7  |
//        |  0 -----|- 1
//        | /       | /
//        |/        |/
//        4 ------- 5
//
//
//           2 ------> 3    March order
//              \
//                \
//        6 ------> 7
//           0 ------> 1
//             \
//               \
//        4 ------> 5
//
//


ISOSurface.prototype.update = function()
{

    /*---------------------------------------------------------------------------------------------------------*/

    var verts = this._verts;

    var cubeSizeX  = this._cubeSizeX,
        cubeSizeY  = this._cubeSizeY,
        cubeSizeZ  = this._cubeSizeZ,
        cubeSizeZY = cubeSizeZ * cubeSizeY;

    var cubes = this._cubes,
        cube;

    var marchIndex;

    var EDGE_TABLE = ISOSurface.EDGE_TABLE,
        TRI_TABLE  = ISOSurface.TRI_TABLE;

    var v0,v1,v2,v3,v4,v5,v6,v7;
    var val0,val1,val2,val3,val4,val5,val6,val7;

    var cubeIndex;
    var isoLevel = this._isoLevel;
    var bits;

    var bVertices   = this._bVertices,
        bNormals    = this._bNormals,
        bNormalsLen = bNormals.length,
        bVertIndex;

    var vertIndex0, vertIndex1, vertIndex2,
        vertIndex3, vertIndex4, vertIndex5,
        vertIndex6, vertIndex7, vertIndex8;

    var v0x,v0y,v0z,
        v1x,v1y,v1z,
        v2x,v2y,v2z;

    var e2x, e2y, e2z,
        e1x, e1y, e1z;

    var v0Index,
        v1Index,
        v2Index;

    var nx, ny, nz,
        vbx, vby, vbz;


    var i, j, k;

    this._numTriangles = 0;

    /*---------------------------------------------------------------------------------------------------------*/

    i = -1;
    while(++i<bNormalsLen)bNormals[i]=0.0;


    i = -1;
    while(++i < cubeSizeZ)
    {
        j = -1;
        while(++j < cubeSizeY)
        {
            k = -1;
            while(++k < cubeSizeX)
            {
                /*---------------------------------------------------------------------------------------------------------*/

                marchIndex = i * cubeSizeZY + j * cubeSizeZ + k;
                cube       = cubes[marchIndex];

                //access vertices of cube
                v0 = verts[cube[0]];
                v1 = verts[cube[1]];
                v2 = verts[cube[2]];
                v3 = verts[cube[3]];
                v4 = verts[cube[4]];
                v5 = verts[cube[5]];
                v6 = verts[cube[6]];
                v7 = verts[cube[7]];

                val0 = v0[3];
                val1 = v1[3];
                val2 = v2[3];
                val3 = v3[3];
                val4 = v4[3];
                val5 = v5[3];
                val6 = v6[3];
                val7 = v7[3];

                /*---------------------------------------------------------------------------------------------------------*/

                cubeIndex = 0;

                if(val0<isoLevel) cubeIndex |= 1;
                if(val1<isoLevel) cubeIndex |= 2;
                if(val2<isoLevel) cubeIndex |= 8;
                if(val3<isoLevel) cubeIndex |= 4;
                if(val4<isoLevel) cubeIndex |= 16;
                if(val5<isoLevel) cubeIndex |= 32;
                if(val6<isoLevel) cubeIndex |= 128;
                if(val7<isoLevel) cubeIndex |= 64;

                bits = EDGE_TABLE[cubeIndex];

                if(bits === 0)continue;

                /*---------------------------------------------------------------------------------------------------------*/

                var tempVertices = this._tempVertices,
                    tempNormals  = this._tempNormals;

                if (bits & 1)
                {
                    this._intrpl(v0, v1, tempVertices, 0);
                    this._normal(tempVertices,0,tempNormals,0);
                }
                if (bits & 2)
                {
                    this._intrpl(v1, v3, tempVertices, 1);
                    this._normal(tempVertices,1,tempNormals,1);
                }
                if (bits & 4)
                {
                    this._intrpl(v2, v3, tempVertices, 2);
                    this._normal(tempVertices,2,tempNormals,2);
                }
                if (bits & 8)
                {
                    this._intrpl(v0, v2, tempVertices, 3);
                    this._normal(tempVertices,3,tempNormals,3);
                }

                if (bits & 16)
                {
                    this._intrpl(v4, v5, tempVertices, 4);
                    this._normal(tempVertices,4,tempNormals,4);
                }
                if (bits & 32)
                {
                    this._intrpl(v5, v7, tempVertices, 5);
                    this._normal(tempVertices,5,tempNormals,5);
                }
                if (bits & 64)
                {
                    this._intrpl(v6, v7, tempVertices, 6);
                    this._normal(tempVertices,6,tempNormals,6);
                }
                if (bits & 128)
                {
                    this._intrpl(v4, v6, tempVertices, 7);
                    this._normal(tempVertices,7,tempNormals,7);
                }

                if (bits & 256)
                {
                    this._intrpl(v0, v4, tempVertices, 8);
                    this._normal(tempVertices,8,tempNormals,8);
                }
                if (bits & 512)
                {
                    this._intrpl(v1, v5, tempVertices, 9);
                    this._normal(tempVertices,9,tempNormals,9);
                }
                if (bits & 1024)
                {
                    this._intrpl(v3, v7, tempVertices, 10);
                    this._normal(tempVertices,10,tempNormals,10);
                }
                if (bits & 2048)
                {
                    this._intrpl(v2, v6, tempVertices, 11);
                    this._normal(tempVertices,11,tempNormals,11);
                }


                /*---------------------------------------------------------------------------------------------------------*/

                var l = 0;
                cubeIndex <<= 4;


                while(TRI_TABLE[cubeIndex + l] != -1)
                {
                    /*---------------------------------------------------------------------------------------------------------*/

                    //get indices of triangle vertices
                    v0Index = TRI_TABLE[cubeIndex + l    ] * 3;
                    v1Index = TRI_TABLE[cubeIndex + l + 1] * 3;
                    v2Index = TRI_TABLE[cubeIndex + l + 2] * 3;

                    bVertIndex = this._numTriangles * 9;

                    vertIndex0 = bVertIndex;
                    vertIndex1 = bVertIndex+1;
                    vertIndex2 = bVertIndex+2;
                    vertIndex3 = bVertIndex+3;
                    vertIndex4 = bVertIndex+4;
                    vertIndex5 = bVertIndex+5;
                    vertIndex6 = bVertIndex+6;
                    vertIndex7 = bVertIndex+7;
                    vertIndex8 = bVertIndex+8;

                    //store triangle vertices in 'global' vertex buffer + local caching
                    v0x = bVertices[vertIndex0] = tempVertices[v0Index];
                    v0y = bVertices[vertIndex1] = tempVertices[v0Index+1];
                    v0z = bVertices[vertIndex2] = tempVertices[v0Index+2];

                    v1x = bVertices[vertIndex3] = tempVertices[v1Index];
                    v1y = bVertices[vertIndex4] = tempVertices[v1Index+1];
                    v1z = bVertices[vertIndex5] = tempVertices[v1Index+2];

                    v2x = bVertices[vertIndex6] = tempVertices[v2Index];
                    v2y = bVertices[vertIndex7] = tempVertices[v2Index+1];
                    v2z = bVertices[vertIndex8] = tempVertices[v2Index+2];

                    /*---------------------------------------------------------------------------------------------------------*/

                    //calc face normals - per face - naive TODO:FIXME!
                    /*
                    vbx = v1x;
                    vby = v1y;
                    vbz = v1z;

                    e1x = v0x-vbx;
                    e1y = v0y-vby;
                    e1z = v0z-vbz;

                    e2x = v2x-vbx;
                    e2y = v2y-vby;
                    e2z = v2z-vbz;

                    nx = e1y * e2z - e1z * e2y;
                    ny = e1z * e2x - e1x * e2z;
                    nz = e1x * e2y - e1y * e2x;

                    bNormals[vertIndex0] += nx;
                    bNormals[vertIndex1] += ny;
                    bNormals[vertIndex2] += nz;
                    bNormals[vertIndex3] += nx;
                    bNormals[vertIndex4] += ny;
                    bNormals[vertIndex5] += nz;
                    bNormals[vertIndex6] += nx;
                    bNormals[vertIndex7] += ny;
                    bNormals[vertIndex8] += nz;

                    */

                    bNormals[vertIndex0] = tempNormals[v0Index  ];
                    bNormals[vertIndex1] = tempNormals[v0Index+1];
                    bNormals[vertIndex2] = tempNormals[v0Index+2];
                    bNormals[vertIndex3] = tempNormals[v1Index  ];
                    bNormals[vertIndex4] = tempNormals[v1Index+1];
                    bNormals[vertIndex5] = tempNormals[v1Index+2];
                    bNormals[vertIndex6] = tempNormals[v2Index  ];
                    bNormals[vertIndex7] = tempNormals[v2Index+1];
                    bNormals[vertIndex8] = tempNormals[v2Index+2];

                    /*---------------------------------------------------------------------------------------------------------*/

                    l+=3;
                    this._numTriangles++;
                }

                /*---------------------------------------------------------------------------------------------------------*/


            }
        }
    }
};


/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype._intrpl = function(v0,v1,vertList,index)
{
    index *= 3;

    var v0v = v0[3],
        v1v = v1[3];

    var isoLevel = this._isoLevel;

    if(Math.abs(isoLevel - v0v) < 0.00001)
    {
        vertList[index    ] = v0[0];
        vertList[index + 1] = v0[1];
        vertList[index + 2] = v0[2];
        return;
    }

    if(Math.abs(isoLevel - v1v) < 0.00001)
    {
        vertList[index    ] = v1[0];
        vertList[index + 1] = v1[1];
        vertList[index + 2] = v1[2];
        return;
    }

    if(Math.abs(v0v - v1v) < 0.00001)
    {
        vertList[index    ] = v1[0];
        vertList[index + 1] = v1[1];
        vertList[index + 2] = v1[2];
        return;
    }


    var intrpl  = (isoLevel - v0v) / (v1v - v0v);

    var v0x = v0[0],
        v0y = v0[1],
        v0z = v0[2];

    vertList[index    ] = v0x + (v1[0] - v0x) * intrpl;
    vertList[index + 1] = v0y + (v1[1] - v0y) * intrpl;
    vertList[index + 2] = v0z + (v1[2] - v0z) * intrpl;
};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype._normal = function(vertList,vertIndex,normList,normIndex)
{
    vertIndex *= 3;

    var x = vertList[vertIndex   ],
        y = vertList[vertIndex+1],
        z = vertList[vertIndex+2];

    var arg0 = this._funcArg0,
        arg1 = this._funcArg1,
        arg2 = this._funcArg2;

    var eps = 0.0003;

    var val = this._func(x,y,z,arg0,arg1,arg2);

    var nx = this._func(x + eps,y , z, arg0, arg1, arg2) - val,
        ny = this._func(x, y + eps, z, arg0, arg1, arg2) - val,
        nz = this._func(x, y, z + eps, arg0, arg1, arg2) - val,
        d  = 1 / Math.sqrt(nx*nx+ny*ny+nz*nz);


    normIndex *= 3;

    normList[normIndex]   = x*d*-1;
    normList[normIndex+1] = y*d*-1;
    normList[normIndex+2] = z*d*-1;

};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype.setCloseSides = function(bool){}

ISOSurface.prototype.setFunction = function(func,isoLevel)
{
    var funcArgsLength = func.length;

    if(funcArgsLength < 3)throw 'Function should satisfy function(x,y,z){}';
    if(funcArgsLength > 6)throw 'Function has to many arguments. Arguments length should not exceed 6. E.g function(x,y,z,arg0,arg1,arg2).';

    var funcString = func.toString(),
        funcArgs   = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).split(','),
        funcBody   = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));

    this._func     = new Function(funcArgs[0], funcArgs[1], funcArgs[2],
                                  funcArgs[3] || 'arg0', funcArgs[4] || 'arg1', funcArgs[5] || 'arg2',
                                  funcBody);
    this._isoLevel = isoLevel || 0;
};

ISOSurface.prototype.setFunctionUnsafe = function(func,isoLevel)
{
    this._func     = func;
    this._isoLevel = isoLevel || 0;
};

ISOSurface.prototype.getFunction = function(){return this._func;};
ISOSurface.prototype.setISOLevel = function(isoLevel){this._isoLevel = isoLevel;};

ISOSurface.prototype.applyFunction   = function()         {this.applyFunction3f(0,0,0);};
ISOSurface.prototype.applyFunction1f = function(arg0)     {this.applyFunction3f(arg0,0,0);};
ISOSurface.prototype.applyFunction2f = function(arg0,arg1){this.applyFunction3f(arg0,arg1,0);};

ISOSurface.prototype.applyFunction3f = function(arg0,arg1,arg2)
{
    var vertSizeX  = this._vertSizeX,
        vertSizeY  = this._vertSizeY,
        vertSizeZ  = this._vertSizeZ,
        vertSizeYX = vertSizeY * vertSizeX;

    var verts = this._verts,
        vert, vertsIndex;

    var i, j, k;

    this._funcArg0 = arg0;
    this._funcArg1 = arg1;
    this._funcArg2 = arg2;

    i = -1;

    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeY)
        {
            k = -1;
            while(++k < vertSizeX)
            {
                vertsIndex = i * vertSizeYX + j * vertSizeX + k;
                vert       = verts[vertsIndex];
                vert[3]    = this._func(vert[0],vert[1],vert[2],arg0,arg1,arg2);
            }
        }
    }
};

/*---------------------------------------------------------------------------------------------------------*/


ISOSurface.prototype._genSurface = function()
{
    var vertSizeX  = this._vertSizeX,
        vertSizeY  = this._vertSizeY,
        vertSizeZ  = this._vertSizeZ,
        vertSizeZY = vertSizeZ * vertSizeY,
        vertSizeXY = vertSizeX * vertSizeY;

    var verts = this._verts,
        vertsIndex;

    var cubeSizeX  = this._cubeSizeX,
        cubeSizeY  = this._cubeSizeY,
        cubeSizeZ  = this._cubeSizeZ,
        cubeSizeZY = cubeSizeY * cubeSizeZ;

    var cubes = this._cubes,
        cellsIndex;

    var scaleXYZ = this._scaleXYZ;

    var i, j, k;

    i = -1;

    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeY)
        {
            k = -1;
            while(++k < vertSizeX)
            {
                vertsIndex        = i * vertSizeZY + j * vertSizeZ + k;

                verts[vertsIndex] = [(-0.5 + ( k / (vertSizeX - 1))) * scaleXYZ[0],
                                     (-0.5 + ( j / (vertSizeY - 1))) * scaleXYZ[1],
                                     (-0.5 + ( i / (vertSizeZ - 1))) * scaleXYZ[2],
                    -1];


                if(i < cubeSizeX && j < cubeSizeY && k  < cubeSizeZ)
                {
                    cellsIndex = i * cubeSizeZY + j * cubeSizeX + k;

                    cubes[cellsIndex] = [
                        vertsIndex,
                        vertsIndex + 1,
                        vertsIndex + vertSizeZ,
                        vertsIndex + vertSizeZ + 1,

                        vertsIndex + vertSizeXY,
                        vertsIndex + vertSizeXY + 1,
                        vertsIndex + vertSizeZ + vertSizeXY,
                        vertsIndex + vertSizeZ + vertSizeXY + 1
                    ];

                }
            }
        }
    }

};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype._draw = function(gl)
{
    gl.disableDefaultTexCoordsAttribArray();
    gl.enableDefaultNormalAttribArray();

    var _gl = gl.gl;

    var glArrayBuffer = _gl.ARRAY_BUFFER,
        glFloat       = _gl.FLOAT;

    var vertices = this._bVertices,
        normals  = this._bNormals,
        colors   = this._bColors;

    var vblen = vertices.byteLength,
        nblen = normals.byteLength,
        cblen = colors.byteLength;

    var offsetV = 0,
        offsetN = offsetV + vblen,
        offsetC = offsetN + nblen;

    _gl.bufferData(glArrayBuffer, vblen + nblen + cblen, _gl.DYNAMIC_DRAW);

    _gl.bufferSubData(glArrayBuffer, offsetV,  vertices);
    _gl.bufferSubData(glArrayBuffer, offsetN,  normals);
    _gl.bufferSubData(glArrayBuffer, offsetC,  colors);

    _gl.vertexAttribPointer(gl.getDefaultVertexAttrib(), 3, glFloat, false, 0, offsetV);
    _gl.vertexAttribPointer(gl.getDefaultNormalAttrib(), 3, glFloat, false, 0, offsetN);
    _gl.vertexAttribPointer(gl.getDefaultColorAttrib(),  4, glFloat, false, 0, offsetC);

    gl.setMatricesUniform();
    _gl.drawArrays(_gl.TRIANGLES,0,this._numTriangles * 3);
};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.EDGE_TABLE = new Int32Array(
    [
        0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
        0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
        0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
        0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
        0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
        0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
        0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
        0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
        0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
        0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
        0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
        0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
        0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
        0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
        0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
        0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
        0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
        0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
        0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
        0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
        0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
        0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
        0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
        0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
        0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
        0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
        0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
        0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
        0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
        0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
        0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
        0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0
    ]);

ISOSurface.TRI_TABLE = new Int32Array(
    [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
        3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
        3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
        3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
        9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
        9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
        2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
        8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
        9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
        4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
        3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
        1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
        4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
        4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
        5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
        2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
        9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
        0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
        2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
        10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
        5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
        5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
        9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
        0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
        1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
        10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
        8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
        2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
        7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
        2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
        11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
        5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
        11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
        11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
        1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
        9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
        5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
        2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
        5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
        6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
        3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
        6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
        5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
        1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
        10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
        6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
        8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
        7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
        3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
        5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
        0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
        9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
        8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
        5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
        0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
        6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
        10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
        10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
        8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
        1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
        0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
        10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
        3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
        6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
        9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
        8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
        3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
        6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
        0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
        10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
        10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
        2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
        7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
        7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
        2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
        1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
        11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
        8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
        0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
        7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
        10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
        2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
        6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
        7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
        2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
        1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
        10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
        10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
        0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
        7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
        6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
        8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
        9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
        6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
        4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
        10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
        8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
        0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
        1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
        8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
        10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
        4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
        10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
        5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
        11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
        9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
        6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
        7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
        3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
        7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
        3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
        6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
        9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
        1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
        4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
        7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
        6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
        3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
        0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
        6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
        0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
        11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
        6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
        5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
        9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
        1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
        1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
        10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
        0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
        5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
        10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
        11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
        9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
        7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
        2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
        8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
        9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
        9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
        1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
        9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
        9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
        5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
        0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
        10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
        2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
        0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
        0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
        9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
        5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
        3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
        5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
        8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
        0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
        9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
        1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
        3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
        4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
        9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
        11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
        11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
        2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
        9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
        3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
        1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
        4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
        3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
        0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
        9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
        1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    ]);

module.exports = ISOSurface;