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
            this._unitScaleZ = arguments[3]
            break;
        default :
            this._vertSizeX = this._vertSizeZ = 3;
            break;
    }

    this._cellSizeX = this._vertSizeX - 1;
    this._cellSizeZ = this._vertSizeZ - 1;



    this._verts = new Float32Array(this._vertSizeX * this._vertSizeZ * 4);
    this._cells = new Array(this._cellSizeX * this._cellSizeZ);

    this._genSurface();


};

GLKit.ISOBand.prototype = Object.create(GLKit.Geom3d.prototype);

GLKit.ISOBand.prototype._genSurface = function()
{
    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var scaleX = this._unitScaleX,
        scaleZ = this._unitScaleZ;

    var verts = this._verts,
        vertsIndex;

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
        }
    }

};

GLKit.ISOBand.prototype._draw = function(gl)
{
    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var verts = this._verts,
        vertsIndex;

    var i,j;

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

            //gl.pushMatrix();
            //gl.translate3f(verts[vertsIndex],verts[vertsIndex+1],verts[vertsIndex+2]);
            //gl.point3f(verts[vertsIndex],verts[vertsIndex+1],verts[vertsIndex+2])
            //gl.cube(0.0125);
            //gl.popMatrix();

        }
    }


    var _gl = gl.gl;

    gl.disableDefaultNormalAttribArray();
    gl.disableDefaultTexCoordsAttribArray();

    var glArrayBuffer = _gl.ARRAY_BUFFER,
        glFloat       = _gl.FLOAT;

    var colors   = new Float32Array(this._verts.length);

    var vblen = vertices.byteLength,
        cblen = colors.byteLength;

    var offsetV = 0,
        offsetC = offsetV + vblen;

    _gl.bufferData(_gl.ARRAY_BUFFER,vblen + cblen, _gl.DYNAMIC_DRAW);

    _gl.bufferSubData(glArrayBuffer, offsetV,  vertices);
    _gl.bufferSubData(glArrayBuffer, offsetC,  colors);

    _gl.vertexAttribPointer(gl.getDefaultVertexAttrib(), 3, glFloat, false, 0, offsetV);
    _gl.vertexAttribPointer(gl.getDefaultColorAttrib(),  4, glFloat, false, 0, offsetC);

    gl.setMatricesUniform();
    _gl.drawArrays(_gl.POINTS,0,vertices.length);

    gl.enableDefaultNormalAttribArray();
    gl.enableDefaultTexCoordsAttribArray();
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

