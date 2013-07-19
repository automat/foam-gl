GLKit.ParametricSurface = function(size)
{
    GLKit.Geom3d.apply(this,null);

    this.funcX = null;
    this.funcY = null;
    this.funcZ = null;
    this.ur    = null;
    this.vr    = null;
    this.size  = null;

    this.setSize(size);
    this.setFunctions('u','0','v',[-1,1],[-1,1]);
};

GLKit.ParametricSurface.prototype = Object.create(GLKit.Geom3d.prototype);

GLKit.ParametricSurface.prototype.setSize = function(size,unit)
{
    unit = unit || 1;

    this.size = size;

    var length  = size * size;

    this.vertices  = new Float32Array(length * GLKit.Vec3.SIZE);
    this.normals   = new Float32Array(length * GLKit.Vec3.SIZE);
    this.colors    = new Float32Array(length * GLKit.Color.SIZE);
    this.texCoords = new Float32Array(length * GLKit.Vec2.SIZE);

    var indices = [];

    var a, b, c, d;
    var i,j;

    i = -1;
    while(++i < size - 1)
    {
        j = -1;
        while(++j < size - 1)
        {
            a = j     + size * i;
            b = (j+1) + size * i;
            c = j     + size * (i+1);
            d = (j+1) + size * (i+1);

            indices.push(a,b,c);
            indices.push(b,d,c);
        }
    }

    this.indices = new Uint16Array(indices);

    this.updateVertexNormals();
};

//Override

GLKit.ParametricSurface.prototype.setFunctions = function(stringFuncX,stringFuncY,stringFuncZ,vr,ur)
{
    this.setFunctionXString(stringFuncX);
    this.setFunctionYString(stringFuncY);
    this.setFunctionZString(stringFuncZ);
    this.vr   = vr;
    this.ur   = ur;
};

GLKit.ParametricSurface.prototype.applyFunctions = function()
{
    this.applyFunctionsWithTime(0);

};

GLKit.ParametricSurface.prototype.applyFunctionsWithTime = function(t)
{
    var size  = this.size;

    var funcX = this.funcX,
        funcY = this.funcY,
        funcZ = this.funcZ;

    var urLower = this.ur[0],
        urUpper = this.ur[1],
        vrLower = this.vr[0],
        vrUpper = this.vr[1];

    var i, j, u, v;

    var vertices = this.vertices;

    var index,indexVertices;

    var temp0 = urUpper - urLower,
        temp1 = vrUpper - vrLower,
        temp2 = size - 1;

    i = -1;
    while(++i < size)
    {
        j = -1;
        while(++j < size)
        {
            index = (j + size * i);
            indexVertices = index * 3;

            u = (urLower + temp0 * (j / temp2));
            v = (vrLower + temp1 * (i / temp2));

            vertices[indexVertices    ] = funcX(u,v,t);
            vertices[indexVertices + 1] = funcY(u,v,t);
            vertices[indexVertices + 2] = funcZ(u,v,t);
        }
    }
};

GLKit.ParametricSurface.prototype.pointOnSurface = function(u,v)
{
    return GLKit.Vec3.make(this.funcX(u,v,0),
                           this.funcY(u,v,0),
                           this.funcZ(u,v,0));
};

GLKit.ParametricSurface.prototype.setFunctionXString = function(string)
{
    try{this.funcX = new Function('u','v','t','return ' + string +';');}catch(e){}
};

GLKit.ParametricSurface.prototype.setFunctionYString = function(string)
{
    try{this.funcY = new Function('u','v','t','return ' + string +';');}catch(e){}
};

GLKit.ParametricSurface.prototype.setFunctionZString = function(string)
{
    try{this.funcZ = new Function('u','v','t','return ' + string +';');}catch(e){}
}