GLKit.LineBuffer3d = function(numPoints,numSegments,diameter)
{
    numSegments = numSegments || 10;
    diameter    = diameter    || 0.25;

    var diameters = this._diameters = new Array(numPoints);

    var i = -1;
    while(++i < numSegments){diameters[i] = diameter;}

    this._numSegments = numSegments;
    this._numPoints   = numPoints;

    this._points      = new Float32Array(numPoints * 3);

    var verticesNorm  = this._verticesNorm = new Float32Array(numPoints * numSegments * 3 * 2);

    this._vertices    = new Float32Array(verticesNorm.length);
    this._colors      = new Float32Array(this._vertices.length / 3 * 4);
    var indices       = this._indices     = [];

    var index;
    //for dev
    var j;
    i = 0;
    while(++i < numPoints - 2)
    {
        j = -1;
        while(++j < numSegments)
        {
            index = i * numSegments + j;

            indices.push(index);
            indices.push(index+numSegments);

        }


        index = i * numSegments;

        indices.push(index);
        indices.push(index+numSegments);
   }



    var stepPI = Math.PI * 2 / numSegments,
        step;

    i = -1;
    var k;
    while(++i < numPoints)
    {
        j = -1;
        while(++j < numSegments)
        {
            k    = (i * numSegments + j) * 3 * 2;
            step = j * stepPI;

            verticesNorm[k+0] = Math.cos(step);
            verticesNorm[k+2] = Math.sin(step);

            verticesNorm[k+3] = verticesNorm[k+0] * diameter;
            verticesNorm[k+5] = verticesNorm[k+2] * diameter;

        }


    }

    this._tempVec  = GLKit.Vec3.make();
    this._bPoint0  = GLKit.Vec3.make();
    this._bPoint1  = GLKit.Vec3.make();
    this._bPoint01 = GLKit.Vec3.make();
    this._axisY    = GLKit.Vec3.AXIS_Y();

};

GLKit.LineBuffer3d.prototype.setPoint3f = function(index,x,y,z)
{
    index *= 3;

    var points = this._points;

    points[index  ] = x;
    points[index+1] = y;
    points[index+2] = z;
};

GLKit.LineBuffer3d.prototype.setPoints = function(array)
{
    var points = this._points;
    var i = -1,i3;

    while(++i<points.length)
    {
        i3 = i * 3;
        points[i  ] = array[i  ];
        points[i+1] = array[i+1];
        points[i+2] = array[i+2];
    }
};

GLKit.LineBuffer3d.prototype.setDiameter = function(index,value)
{
    this._diameters[index] = value;

    var numSegments  = this._numSegments,
        verticesNorm = this._verticesNorm;

    var offset = numSegments * 3 * 2;

    var i = index * offset,
        l   = i + offset;

    while(i < l)
    {
        verticesNorm[i+3] = verticesNorm[i+0] * value;
        verticesNorm[i+5] = verticesNorm[i+2] * value;

        i+=6;
    }
};


//for dev
GLKit.LineBuffer3d.prototype.update = function()
{
    var numPoints   = this._numPoints,
        numSegments = this._numSegments;

    var points       = this._points,
        vertices     = this._vertices,
        verticesNorm = this._verticesNorm;

    var Vec3  = GLKit.Vec3,
        Mat44 = GLKit.Mat44;

    var tempVec = this._tempVec;

    var p0  = this._bPoint0,
        p1  = this._bPoint1,
        p01 = this._bPoint01,
        up  = this._axisY;



    var mat = Mat44.make();

    var index,index3,index6;

    var dir01,dir_10;
    var angle,axis;
    //for dev

    //calc first prev dir
    Vec3.set3f(p0, points[3],points[4],points[5]);
    Vec3.set3f(p01,points[0],points[1],points[2]);
    dir_10 = Vec3.normalize(Vec3.subbed(p0,p01));



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
        dir01  = Vec3.normalize(Vec3.subbed(p1,p0));

        //interpolate with previous direction
        dir01[0] = dir01[0] * 0.5 + dir_10[0] * 0.5;
        dir01[1] = dir01[1] * 0.5 + dir_10[1] * 0.5;
        dir01[2] = dir01[2] * 0.5 + dir_10[2] * 0.5;

        //get dir angle + axis
        angle = Math.acos(Vec3.dot(dir01,up));
        axis  = Vec3.normalize(Vec3.cross(up,dir01));

        //create transformation matrix
        Mat44.identity(mat);
        mat = Mat44.multPost(mat,Mat44.makeTranslate(p0[0],p0[1],p0[2]));
        mat = Mat44.multPost(mat,Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2]));

        //assign current direction to prev
        dir_10[0] = dir01[0];
        dir_10[1] = dir01[1];
        dir_10[2] = dir01[2];

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

            //transform vertex copy py matrix
            Mat44.multVec3(mat,tempVec);

            //reassign transformed vertex
            vertices[index3  ] = tempVec[0];
            vertices[index3+1] = tempVec[1];
            vertices[index3+2] = tempVec[2];

        }


    }




};


GLKit.LineBuffer3d.prototype.getNumPoints = function(){return this._numPoints;};

//for dev
GLKit.LineBuffer3d.prototype.drawBaseLine = function(gl)
{
    gl.linev(this._points);
};

//for dev
GLKit.LineBuffer3d.prototype.drawLineVertices = function(gl)
{
    gl.points(this._vertices);
};

//for dev
GLKit.LineBuffer3d.prototype.draw = function(gl)
{
    gl.drawElements(this._vertices,null,gl.fillColorBuffer(gl.getColorBuffer(),this._colors),null,new Uint16Array(this._indices),gl.TRIANGLE_STRIP);


}




