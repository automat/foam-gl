var ObjectUtil = require('../util/ObjectUtil'),
    Id = require('../system/Id'),
    Vec2 = require('../math/Vec2'),
    Vec3 = require('../math/Vec3'),
    AABB = require('../geom/AABB'),
    Color = require('../util/Color'),
    _glDraw = require('./glDraw');

function Mesh(format,size) {
    this._format = format || new Mesh.Format();

    this._size = size || 0;
    this._id   = Id.get();

    this.vertices  = new Float32Array(size * format.vertexSize);
    this.normals   = new Float32Array(size * format.normalSize);
    this.colors    = new Float32Array(size * format.colorSize);
    this.texcoords = new Float32Array(size * format.texcoordSize);
    this.indices   = new Uint16Array(0);

    this._glDraw = _glDraw.get();
}

Mesh.Format = function(){
    this.vertexSize   = 3;
    this.normalSize   = 3;
    this.colorSize    = 4;
    this.texcoordSize = 2;
};


Mesh.prototype.reserveSize = function(size){
    if(this._size >= size){
        return;
    }
    var format = this.format;

    var vertices  = this.vertices,
        normals   = this.normals,
        colors    = this.colors,
        texcoords = this.texcoords;

    this.vertices  = new Float32Array(size * format.vertexSize);
    this.vertices.set(vertices);

    this.normals  = new Float32Array(size * format.normalSize);
    this.normals.set(normals);

    this.colors  = new Float32Array(size * format.colorSize);
    this.colors.set(colors);

    this.texcoords = new Float32Array(size * format.texcoordSize);
    this.texcoords.set(texcoords);

    this._size = size;
};



Mesh.prototype.setVertices = function(vertices){
    var vertices_ = this.vertices;
    this.vertices = vertices.length > vertices_.length ?
                    new Float32Array(vertices.length) :
                    vertices_;
    this.vertices.set(vertices);
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



Mesh.prototype.setNormals = function(normals){
    var normals_ = this.normals;
    this.normals = normals.length > normals_.length ?
        new Float32Array(normals.length) :
        normals_;
    this.normals.set(normals);
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

Mesh.prototype.setColors = function(colors){
    var colors_ = this.colors;
    this.colors = colors.length > colors_.length ?
        new Float32Array(colors.length) :
        colors_;
    this.colors.set(colors);
};

Mesh.prototype.setTexcoords = function(texcoords){
    var texcoords_ = this.texcoords;
    this.colors = texcoords.length > texcoords_.length ?
        new Float32Array(texcoords.length) :
        texcoords_;
    this.texcoords.set(texcoords);
};




Mesh.prototype.reserveIndices = function(size){
    if(this.indices.length >= size){
        return;
    }
    var indices = new Uint16Array(size);
        indices.set(this.indices);
    this.indices = indices;
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

        l = Math.sqrt(x*x+y*y+z*z) || 1.0;

        normals[i  ] *= l;
        normals[i+1] *= l;
        normals[i+2] *= l;

        i+=3;
    }
};

/**
 * Returns the mesh format.
 * @returns {Mesh.Format}
 */

Mesh.prototype.getFormat = function(){
    return this._format;
};

/**
 * Returns true if vertices have been added.
 * @returns {boolean}
 */

Mesh.prototype.hasVertices = function(){
    return this.vertices.length != 0;
};

/**
 * Returns true if colors have been added.
 * @returns {boolean}
 */

Mesh.prototype.hasColors = function(){
    return this.colors.length != 0;
};

/**
 * Returns true if normals have been added.
 * @returns {boolean}
 */

Mesh.prototype.hasNormals = function(){
    return this.normals.length != 0;
};

/**
 * Returns true if texcoords have been added.
 * @returns {boolean}
 */

Mesh.prototype.hasTexcoords = function(){
    return this.texcoords.length != 0;
};

/**
 * Returns true if indices have been added.
 * @returns {boolean}
 */

Mesh.prototype.hasIndices = function(){
    return this.indices.length != 0;
};

/**
 * Returns a unique id assigned to the mesh.
 * @returns {Number}
 */

Mesh.prototype.getId = function(){
    return this._id;
};

/**
 * Displays the mesh.
 * @param {Number} [usage=gl.TRIANGLES]
 * @param {Number} [length]
 */

Mesh.prototype.draw = function(usage, length){
    this._glDraw.drawMesh(this,length,usage);
};

module.exports = Mesh;