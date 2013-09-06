GLKit.LineBuffer3d = function(numPoints,numSegments,diameter)
{
    numSegments = numSegments || 20;
    diameter    = diameter    || 0.25;

    this._diameter    = diameter;
    this._numSegments = numSegments;
    this._numPoints   = numPoints;

    this._points      = new Float32Array(numPoints * 3);
    var verticesNorm  = this._verticesNorm = new Float32Array(numPoints * numSegments * 3);
    this._vertices    = new Float32Array(verticesNorm.length);
    this._colors      = new Float32Array(this._vertices.length / 3 * 4);
    var indices       = this._indices     = [];

    var index;
    //for dev
    var i,j;
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



    var stepPI = Math.PI * 2  / (numSegments ),
        step;

    i = -1;
    var k;
    while(++i < numPoints)
    {
        j = -1;
        while(++j < numSegments)
        {
            k    = (i * numSegments + j) * 3;
            step = j * stepPI;

            verticesNorm[k+0] = Math.cos(step) * diameter;
            verticesNorm[k+2] = Math.sin(step) * diameter;
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
        points[i]   = array[i];
        points[i+1] = array[i+1];
        points[i+2] = array[i+2];
    }
};

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

    var index;


    var dir01,dir_10,c;
    var angle,axis;
    //for dev

    var i3;
    var i = 0;
    var j;
    while(++i < numPoints - 1)
    {
        i3 = i * 3;
        Vec3.set3f(p0,points[i3],points[i3+1],points[i3+2]);

        i3 = (i + 1) * 3;
        Vec3.set3f(p1,points[i3],points[i3+1],points[i3+2]);

        i3 = (i - 1) * 3;
        Vec3.set3f(p01,points[i3],points[i3+1],points[i3+2]);

        dir_10 = Vec3.normalize(Vec3.subbed(p0,p01));
        dir01  = Vec3.normalize(Vec3.subbed(p1,p0));

        Vec3.lerp(dir01,dir_10,0.5)

        c   = Vec3.dot(dir01,up);



        angle = Math.acos(c);
        axis  = Vec3.normalize(Vec3.cross(up,dir01));



        Mat44.identity(mat);
        mat = Mat44.multPost(mat,Mat44.makeTranslate(p0[0],p0[1],p0[2]));
        mat = Mat44.multPost(mat,Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2]));//Mat44.multPost(mat,Mat44.makeRotationOnAxis(angle,axis));



        j = -1;
        while(++j < numSegments)
        {
            index =  (i * numSegments + j) * 3;

            tempVec[0] = vertices[index  ] = verticesNorm[index  ];
            tempVec[1] = vertices[index+1] = verticesNorm[index+1];
            tempVec[2] = vertices[index+2] = verticesNorm[index+2];

            tempVec = Mat44.multVec3(mat,tempVec);

            vertices[index  ] = tempVec[0];
            vertices[index+1] = tempVec[1];
            vertices[index+2] = tempVec[2];


            //Mat44.multVec3(mat,ver)

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




