GLKit.LineBuffer3d = function(points,numSegments,diameter,sliceSegmentFunc)
{
    GLKit.Geom3d.apply(this,arguments);

    numSegments = numSegments || 10;
    diameter    = diameter    || 0.25;

    var numPoints = points.length / 3;
    var len = numPoints * numSegments * 3 * 2;

    this._numPoints    = numPoints;
    this._numSegments  = numSegments;
    this._verticesNorm = new Float32Array(len);

    this.points    = new Float32Array(points);
    this.vertices  = new Float32Array(len);
    this.normals   = new Float32Array(len);
    this.colors    = new Float32Array(len / 3 * 4);
    this.indices   = [];
    this.texCoords = null;

    this._sliceSegFunc = sliceSegmentFunc || function(i,j,numPoints,numSegments)
                         {
                             var step = Math.PI * 2 / numSegments;
                             return [Math.cos(step * j),Math.sin(step * j)];
                         };

    this._initDiameter = diameter;

    this.setNumSegments(numSegments);

    this._tempVec0 = GLKit.Vec3.make();
    this._bPoint0  = GLKit.Vec3.make();
    this._bPoint1  = GLKit.Vec3.make();
    this._bPoint01 = GLKit.Vec3.make();
    this._axisY    = GLKit.Vec3.AXIS_Y();

    /*---------------------------------------------------------------------------------------------------------*/
};

GLKit.LineBuffer3d.prototype = Object.create(GLKit.Geom3d.prototype);

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer3d.prototype.setPoints = function(arr)
{
    if(arr.length == this.vertices.length)
    {

    }
    else
    {

    }

    var numPoints   = arr.length / 3;
    var numSegments = this._numSegments;
    var len = numPoints * numSegments * 3 * 2;

    this._numPoints    = numPoints;
    this._numSegments  = numSegments;
    this._verticesNorm = new Float32Array(len);

    this.points    = new Float32Array(arr);
    this.vertices  = new Float32Array(len);
    this.normals   = new Float32Array(len);
    this.colors    = new Float32Array(len / 3 * 4);
    this.indices   = [];


}


/*---------------------------------------------------------------------------------------------------------*/


GLKit.LineBuffer3d.prototype.applySliceSegmentFunc = function(func,baseDiameter)
{
    this._sliceSegFunc = func;

    baseDiameter = baseDiameter || 1.0;

    var numPoints    = this._numPoints,
        numSegments  = this._numSegments,
        verticesNorm = this._verticesNorm;

    var funcRes;

    var index;
    var i, j, k;

    i = -1;
    while(++i < numPoints)
    {
        j = -1;
        index = i * numSegments;

        while(++j < numSegments)
        {
            k    = (index + j) * 3 * 2;

            funcRes = func(i,j,numPoints,numSegments);

            verticesNorm[k+0] = funcRes[0];
            verticesNorm[k+2] = funcRes[1];

            verticesNorm[k+3] = verticesNorm[k+0] * baseDiameter;
            verticesNorm[k+5] = verticesNorm[k+2] * baseDiameter;
        }
    }
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer3d.prototype.setPoint3f = function(index,x,y,z)
{
    index *= 3;

    var points = this.points;

    points[index  ] = x;
    points[index+1] = y;
    points[index+2] = z;
};

GLKit.LineBuffer3d.prototype.setPoint = function(index,v)
{
    index *= 3;

    var points = this.points;

    points[index  ] = v[0];
    points[index+1] = v[1];
    points[index+2] = v[2];
};

GLKit.LineBuffer3d.prototype.getPoint = function(index,out)
{
    out    = out || this._tempVec0;
    index *= 3;

    var points = this.points;

    out[0] = points[index  ];
    out[1] = points[index+1];
    out[2] = points[index+2];

    return out;
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer3d.prototype.setUnitDiameter = function(value)
{

};

//Should seperate this
GLKit.LineBuffer3d.prototype.setDiameter = function(index,value)
{
    var numSegments  = this._numSegments,
        verticesNorm = this._verticesNorm;

    var offset = numSegments * 3 * 2;
    var i,l;
    var val;

    if(arguments.length == 2)
    {
        var indx = index;
            val  = value;

        i = indx * offset;
        l = i + offset;

        while(i < l)
        {
            verticesNorm[i+3] = verticesNorm[i+0] * val;
            verticesNorm[i+5] = verticesNorm[i+2] * val;
            i+=6;
        }

        return;
    }

    if(arguments.length == 1)
    {
        i   = 0;
        l   = this._numPoints * offset;
        val = arguments[0];

        while(i < l)
        {
            verticesNorm[i+3] = verticesNorm[i+0] * val;
            verticesNorm[i+5] = verticesNorm[i+2] * val;
            i+=6;
        }
    }
};

//TODO: Cleanup / unroll ...
GLKit.LineBuffer3d.prototype.setNumSegments = function(numSegments)
{
    numSegments = numSegments < 2 ? 2 : numSegments;

    var numPoints = this._numPoints;
    var indices   = this.indices = [];
    var texCoords;

    var i,j;
    var v0,v1,v2,v3;
    var nh,nv;
    var index, indexSeg, indexTex;
    var len;

    indices.length = 0;

    if(numSegments > 2)
    {
        len = numSegments - 1;

        //close front
        i = -1;
        while(++i < len)indices.push(0,i,i+1);

        i = -1;
        while (++i < numPoints - 1)
        {

            index = i * numSegments;
            j = -1;
            while (++j < len)
            {
                indexSeg = index + j;

                v0 = indexSeg;
                v1 = indexSeg + 1;
                v2 = indexSeg + numSegments + 1;
                v3 = indexSeg + numSegments;

                indices.push(v0,v1,v3,
                    v1,v2,v3);
            }

            v0 = index + len;
            v1 = index;
            v2 = index + len + 1;
            v3 = index + numSegments + len;

            indices.push(v0,v1,v3,
                v1,v2,v3);
        }

        //close back
        index = i = (numPoints - 1) * numSegments;
        j     = i + numSegments;
        while (++i < j - 1)indices.push(index, i, i + 1);
    }
    else
    {
        len = numPoints * numSegments * 3 * 2;

        i = -1;
        while(++i < numPoints - 1)
        {
            index = i * 2;
            indices.push(index,
                index + 1,
                index + 2,
                index + 1,
                index + 3,
                index + 2);

        }

        texCoords = this.texCoords = new Float32Array(len / 3 * 2);

        i = -1;
        while(++i < numPoints)
        {
            index = i * numSegments;
            nh    = i / (numPoints - 1);

            j = -1;
            while(++j < numSegments)
            {
                indexTex = (index + j) * 2;
                nv       = 1 - j / (numSegments - 1);

                texCoords[indexTex]   = nh;
                texCoords[indexTex+1] = nv;
            }
        }


    }

    this.indices = new Uint16Array(indices);
    this.applySliceSegmentFunc(this._sliceSegFunc,this._initDiameter);
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer3d.prototype.update = function()
{
    var numPoints   = this._numPoints,
        numSegments = this._numSegments;

    var points       = this.points,
        vertices     = this.vertices,
        verticesNorm = this._verticesNorm;

    var Vec3  = GLKit.Vec3,
        Mat44 = GLKit.Mat44;

    var tempVec = this._tempVec0;

    var p0  = this._bPoint0,
        p1  = this._bPoint1,
        p01 = this._bPoint01,
        up  = this._axisY;

    var mat    = Mat44.make(),
        matRot = Mat44.make();

    var index,index3,index6;

    //direction from current point -> next point, prev point -> current point
    var dir01,dir_10;
    var angle,axis;

    //BEGIN - calculate first point
    Vec3.set3f(p0,points[0],points[1],points[2]);
    Vec3.set3f(p1,points[3],points[4],points[5]);

    dir01 = Vec3.safeNormalize(Vec3.subbed(p1,p0));
    angle = Math.acos(Vec3.dot(dir01,up));
    axis  = Vec3.safeNormalize(Vec3.cross(up,dir01));

    Mat44.identity(mat);
    mat[12] = p0[0];
    mat[13] = p0[1];
    mat[14] = p0[2];

    Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2],matRot);
    mat = Mat44.multPost(mat,matRot);

    j = -1;
    while(++j < numSegments)
    {
        index3 = j * 3;
        index6 = j * 6;

        tempVec[0] = verticesNorm[index6+3];
        tempVec[1] = verticesNorm[index6+4];
        tempVec[2] = verticesNorm[index6+5];

        Mat44.multVec3(mat,tempVec);

        vertices[index3  ] = tempVec[0];
        vertices[index3+1] = tempVec[1];
        vertices[index3+2] = tempVec[2];
    }
    //END - calculate first point


    //calc first prev dir
    Vec3.set3f(p0, points[3],points[4],points[5]);
    Vec3.set3f(p01,points[0],points[1],points[2]);
    dir_10 = Vec3.safeNormalize(Vec3.subbed(p0,p01));

    var i3;
    var i = 0;
    var j;
    while(++i < numPoints - 1)
    {
        //set current point
        i3 = i * 3;
        p0[0] = points[i3  ];
        p0[1] = points[i3+1];
        p0[2] = points[i3+2];

        //set next point
        i3 = (i + 1) * 3;
        p1[0] = points[i3  ];
        p1[1] = points[i3+1];
        p1[2] = points[i3+2];

        //calculate direction
        dir01  = Vec3.safeNormalize(Vec3.subbed(p1,p0));

        //interpolate with previous direction
        dir01[0] = dir01[0] * 0.5 + dir_10[0] * 0.5;
        dir01[1] = dir01[1] * 0.5 + dir_10[1] * 0.5;
        dir01[2] = dir01[2] * 0.5 + dir_10[2] * 0.5;

        //get dir angle + axis
        angle = Math.acos(Vec3.dot(dir01,up));
        axis  = Vec3.safeNormalize(Vec3.cross(up,dir01));

        //reset transformation matrix
        Mat44.identity(mat);

        //set translation
        mat[12] = p0[0];
        mat[13] = p0[1];
        mat[14] = p0[2];

        //set rotation
        Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2],matRot);

        //multiply matrices
        mat = Mat44.multPost(mat,matRot);

        j = -1;
        while(++j < numSegments)
        {
            index  = (i * numSegments + j);
            index3 = index * 3;
            index6 = index * 6;

            //lookup vertex
            tempVec[0] = verticesNorm[index6+3];
            tempVec[1] = verticesNorm[index6+4];
            tempVec[2] = verticesNorm[index6+5];

            //transform vertex copy by matrix
            Mat44.multVec3(mat,tempVec);

            //reassign transformed vertex
            vertices[index3  ] = tempVec[0];
            vertices[index3+1] = tempVec[1];
            vertices[index3+2] = tempVec[2];
        }

        //assign current direction to prev
        dir_10[0] = dir01[0];
        dir_10[1] = dir01[1];
        dir_10[2] = dir01[2];
    }

    var len = points.length;

    //BEGIN - calculate last point
    Vec3.set3f(p0,points[len - 6],points[len - 5],points[len - 4]);
    Vec3.set3f(p1,points[len - 3],points[len - 2],points[len - 1]);

    dir01 = Vec3.safeNormalize(Vec3.subbed(p1,p0));
    angle = Math.acos(Vec3.dot(dir01,up));
    axis  = Vec3.safeNormalize(Vec3.cross(up,dir01));

    Mat44.identity(mat);
    mat[12] = p1[0];
    mat[13] = p1[1];
    mat[14] = p1[2];

    Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2],matRot);
    mat = Mat44.multPost(mat,matRot);

    i  = (i * numSegments);

    j = -1;
    while(++j < numSegments)
    {
        index  = i + j;
        index3 = index * 3;
        index6 = index * 6;

        tempVec[0] = verticesNorm[index6+3];
        tempVec[1] = verticesNorm[index6+4];
        tempVec[2] = verticesNorm[index6+5];

        Mat44.multVec3(mat,tempVec);

        vertices[index3  ] = tempVec[0];
        vertices[index3+1] = tempVec[1];
        vertices[index3+2] = tempVec[2];
    }
    //END - calculate last point
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer3d.prototype.setSegVTexCoordMapping = function(scale,offset){this.setSegTexCoordMapping(1,0,scale,offset || 0);};
GLKit.LineBuffer3d.prototype.setSegHTexCoordMapping = function(scale,offset){this.setSegTexCoordMapping(scale,offset || 0,1,0);};

GLKit.LineBuffer3d.prototype.setSegTexCoordMapping = function(scaleH,offsetH,scaleV,offsetV)
{
    var numPoints     = this._numPoints,
        numSegments   = this._numSegments,
        numSegments_1 = numSegments - 1;

    var texCoords = this.texCoords;
    var i, j, index, indexTex;
    var nh,nv;

    if(numSegments > 2)
    {

    }
    else
    {
        i = -1;
        while(++i < numPoints)
        {
            index = i * numSegments;
            nh    = (i / (numPoints - 1)) * scaleH - offsetH;

            j = -1;
            while(++j < numSegments)
            {
                indexTex = (index + j) * 2;
                nv       = (1 - j / numSegments_1) * scaleV - offsetV;

                texCoords[indexTex  ] = nh;
                texCoords[indexTex+1] = nv;
            }
        }

    }

};

/*---------------------------------------------------------------------------------------------------------*/


GLKit.LineBuffer3d.prototype.getNumSegments = function(){return this._numSegments;};
GLKit.LineBuffer3d.prototype.getNumPoints   = function(){return this._numPoints;};


GLKit.LineBuffer3d.prototype._draw = function(gl,count,offset)
{
    var indices = this.indices;
    gl.drawElements(this.vertices,this.normals,gl.fillColorBuffer(gl.getColorBuffer(),this.colors),this.texCoords,indices,gl.getDrawMode(),count || indices.length, offset || 0 );
};
