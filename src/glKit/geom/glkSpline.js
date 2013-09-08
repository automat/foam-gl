
//Basic naive catmull rom spline
//TODO: Add close, smooth in out intrpl, tightness
GLKit.Spline = function()
{
    this._detail    = 20;
    this._numPoints = null;
    this.points     = null;
    this.vertices   = null;

    this._tempOut   = GLKit.Vec3.make();
};


GLKit.Spline.prototype.setPoints =  function(arr)
{
    var num = arr.length / 3;
    this._numPoints = num;
    this.points     = new Float32Array(arr);
    this.vertices   = new Float32Array(((num - 1) * this._detail) * 3);
};

GLKit.Spline.prototype.update = function()
{
    var detail    = this._detail,
        points    = this.points,
        numPoints = this._numPoints,
        vertices  = this.vertices;

    var catmullrom = GLKit.Math.catmullrom;

    var i, j, t;
    var len = numPoints - 1;

    var index,index_1,index1,index2,
        vertIndex;

    var x, y, z;

    i = -1;
    while(++i < len)
    {
        index    = i;

        index1   = Math.min((index + 1),len) * 3;
        index2   = Math.min((index + 2),len) * 3;
        index_1  = Math.max(0,(index - 1))   * 3;
        index   *= 3;

        j = -1;
        while(++j < detail)
        {
            t = j / (detail - 1);

            x = catmullrom(points[index_1],
                           points[index  ],
                           points[index1 ],
                           points[index2 ],
                           t);

            y = catmullrom(points[index_1 + 1],
                           points[index   + 1],
                           points[index1  + 1],
                           points[index2  + 1],
                           t);

            z = catmullrom(points[index_1 + 2],
                           points[index   + 2],
                           points[index1  + 2],
                           points[index2  + 2],
                           t);

            vertIndex = (i * detail + j) * 3;

            vertices[vertIndex  ] = x;
            vertices[vertIndex+1] = y;
            vertices[vertIndex+2] = z;
        }
    }
};

GLKit.Spline.prototype.setDetail = function(detail){this._detail = detail;};
GLKit.Spline.prototype.getNumPoints = function(){return this._numPoints;};

GLKit.Spline.prototype.getVec3OnSpline = function(val,out)
{
    out = out || this._tempOut;



    var vertices = this.vertices;
    var numVerts = vertices.length / 3;
    var index = Math.floor(numVerts * val);

    var localIntrplUnit = 1 / numVerts;

    console.log((val % localIntrplUnit) * numVerts);


    index *= 3;
    out[0] = vertices[index  ];
    out[1] = vertices[index+1];
    out[2] = vertices[index+2];



    return out;
};
