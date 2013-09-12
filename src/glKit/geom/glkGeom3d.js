GLKit.Geom3d = function()
{
    this.vertices  = null;
    this.normals   = null;
    this.colors    = null;
    this.indices   = null;
    this.texCoords = null;
};

//TODO merge
GLKit.Geom3d.prototype.updateVertexNormals = function()
{
    var indices  = this.indices,
        vertices = this.vertices,
        normals  = this.normals;

    var i;
    var a, b, c;
    var e2x, e2y, e2z,
        e1x, e1y, e1z;

    var nx, ny, nz,
        vbx, vby, vbz,
        a0, a1, a2,
        b0, b1, b2,
        c0, c1, c2;

    i = 0;
    while( i < normals.length )
    {
        normals[i] = normals[i+1] = normals[i+2] = 0.0;
        i+=3;
    }

    i = 0;
    while( i < indices.length )
    {
        a = indices[i  ]*3;
        b = indices[i+1]*3;
        c = indices[i+2]*3;

        a0 = a;
        a1 = a+1;
        a2 = a+2;

        b0 = b;
        b1 = b+1;
        b2 = b+2;

        c0 = c;
        c1 = c+1;
        c2 = c+2;

        vbx = vertices[b0];
        vby = vertices[b1];
        vbz = vertices[b2];

        e1x = vertices[a0]-vbx;
        e1y = vertices[a1]-vby;
        e1z = vertices[a2]-vbz;

        e2x = vertices[c0]-vbx;
        e2y = vertices[c1]-vby;
        e2z = vertices[c2]-vbz;

        nx = e1y * e2z - e1z * e2y;
        ny = e1z * e2x - e1x * e2z;
        nz = e1x * e2y - e1y * e2x;

        normals[a0] += nx;
        normals[a1] += ny;
        normals[a2] += nz;

        normals[b0] += nx;
        normals[b1] += ny;
        normals[b2] += nz;

        normals[c0] += nx;
        normals[c1] += ny;
        normals[c2] += nz;

        i+=3;
    }

    var x, y, z, l;

    i = 0;
    while(i < normals.length)
    {

        x = normals[i  ];
        y = normals[i+1];
        z = normals[i+2];

        l = Math.sqrt(x*x+y*y+z*z);
        l = 1 / (l || 1);

        normals[i  ] *= l;
        normals[i+1] *= l;
        normals[i+2] *= l;

        i+=3;
    }

};


GLKit.Geom3d.prototype.setVertex = function(index,v)
{
    index *= 3;
    var vertices = this.vertices;
    vertices[index  ] = v[0];
    vertices[index+1] = v[1];
    vertices[index+2] = v[2];
};

GLKit.Geom3d.prototype.setVertex3f = function(index,x,y,z)
{
    index*=3;
    var vertices = this.vertices;
    vertices[index  ] = x;
    vertices[index+1] = y;
    vertices[index+2] = z;
};

GLKit.Geom3d.prototype.setColor4f = function(index,r,g,b,a)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = r;
    colors[index+1] = g;
    colors[index+2] = b;
    colors[index+3] = a;
};

GLKit.Geom3d.prototype.setColor3f = function(index,r,g,b)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = r;
    colors[index+1] = g;
    colors[index+2] = b;
};

GLKit.Geom3d.prototype.setColor2f = function(index,k,a)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = k;
    colors[index+1] = k;
    colors[index+2] = k;
    colors[index+3] = a;
};

GLKit.Geom3d.prototype.setColor1f = function(index,k)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = k;
    colors[index+1] = k;
    colors[index+2] = k;
};

GLKit.Geom3d.prototype.setColor = function(index,color)
{
    index*=4;
    var colors = this.colors;
    colors[index  ] = color[0];
    colors[index+1] = color[1];
    colors[index+2] = color[2];
    colors[index+3] = color[3];
};

GLKit.Geom3d.prototype._draw = function(gl)
{
    gl.drawElements(this.vertices,this.normals,this.colors,this.texCoords,this.indices,gl._drawMode);
};