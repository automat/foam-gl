var Id     = require('../system/Id'),
    Vec2   = require('../math/Vec2'),
    Vec3   = require('../math/Vec3'),
    AABB   = require('../geom/AABB'),
    Color  = require('../util/Color'),
    glDraw = require('./glDraw');

function Mesh(format,size) {
    this._format = format || new Mesh.Format();

    this._size = size || 0;
    this._id   = Id.get();

    this.vertices  = new Float32Array(size * format.vertexSize);
    this.normals   = new Float32Array(size * format.normalSize);
    this.colors    = new Float32Array(size * format.colorSize);
    this.texcoords = new Float32Array(size * format.texcoordSize);
    this.indices   = new Uint16Array(0);

    glDraw = glDraw || glDraw.get();
}

Mesh.prototype.reserveSize = function(size){
    if(this._size >= size){
        return;
    }
    var format = this.format;

    this.vertices  = (new Float32Array(size * format.vertexSize)).set(this.vertices);
    this.normals   = (new Float32Array(size * format.normalSize)).set(this.normals);
    this.colors    = (new Float32Array(size * format.colorSize)).set(this.colors);
    this.texcoords = (new Float32Array(size * format.texcoordSize)).set(this.texcoords);

    this._size = size;
};

Mesh.prototype.setVertex = function(index,vec){
    var vertexSize = this.format.vertexSize;
    if(vertexSize == 0){
        return;
    }
    index = index * vertexSize;
    if(index > this._size - vertexSize){
        return;
    }

    var vertices   = this.vertices;
    vertices[index  ] = vec.x;
    vertices[index+1] = vec.y;
    if(vertexSize > 2){
        vertices[index+2] = vec.z;
    }
};


Mesh.prototype.setVertex2 = function(index,vec){
    var vertices = this.vertices;
    if(vertices.length == 0){
        return;
    }
    index = index * 2;
    vertices[index  ] = vec.x;
    vertices[index+1] = vec.y;
};

Mesh.prototype.setVertex3 = function(index,vec){
    var vertices = this.vertices;
    if(vertices.length == 0){
        return;
    }
    index = index * 3;
    vertices[index  ] = vec.x;
    vertices[index+1] = vec.y;
    vertices[index+2] = vec.z;
};

Mesh.prototype.setVertex3f = function(index,x,y,z){
    var vertices = this.vertices;
    if(vertices.length == 0){
        return;
    }
    index = index * 3;
    vertices[index  ] = x;
    vertices[index+1] = y;
    vertices[index+2] = z;
};

Mesh.prototype.setVertex2f = function(index,x,y){
    var vertices = this.vertices;
    if(vertices.length == 0){
        return;
    }
    index = index * 2;
    vertices[index  ] = x;
    vertices[index+1] = y;
};

Mesh.prototype.setNormal = function(index,normal){
    var normals = this.normals;
    if(normals.length == 0){
        return;
    }
    index = index * 3;
    normals[index  ] = normal.x;
    normals[index+1] = normal.y;
    normals[index+2] = normal.z;
};

Mesh.prototype.setNormal3f = function(index,x,y,z){
    var normals = this.normals;
    if(normals.length == 0){
        return;
    }
    index = index * 3;
    normals[index  ] = x;
    normals[index+1] = y;
    normals[index+2] = z;
};


Mesh.prototype.reserveIndices = function(size){
    if(this.indices.length >= size){
        return;
    }
    this.indices = (new Uint16Array(size)).set(this.indices);
};

Mesh.prototype.clear = function(){
    this.vertices = new Float32Array(0);
    this.normals = new Float32Array(0);
    this.color = new Float32Array(0);
    this.texcoords = new Float32Array(0);
    this.indices = new Uint16Array(0);
};

Mesh.prototype.getBoundingBox = function(){
    return AABB.setFromPointsf(this.vertices);
};

Mesh.prototype.caculateNormals = function(){
    var size = this._size;
    if(size == 0){
        return;
    }

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

    var x, y, z, l;

    i = 0; l = normals.length;
    while( i < l ){
        normals[i] = normals[i+1] = normals[i+2] = 0.0;
        i+=3;
    }

    i = 0; l = indices.length;
    while( i < l ){
        a = indices[i  ] * 3;
        b = indices[i+1] * 3;
        c = indices[i+2] * 3;

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

    i = 0; l = normals.length;
    while(i < l){

        x = normals[i  ];
        y = normals[i+1];
        z = normals[i+2];

        l = Math.sqrt(x*x+y*y+z*z);

        if(l){
            l = 1.0 / l;
            normals[i  ] *= l;
            normals[i+1] *= l;
            normals[i+2] *= l;
        }

        i+=3;
    }
};

Mesh.prototype.getFormat = function(){
    return this._format;
};

Mesh.prototype.getId = function(){
    return this._id;
};

Mesh.prototype.draw = function(){
    glDraw.drawMesh(this);
};

Mesh.Format = function(){
    this.vertexSize   = 3;
    this.normalSize   = 3;
    this.colorSize    = 4;
    this.texcoordSize = 2;
};

module.exports = Mesh;