var ObjectUtil = require('../util/ObjectUtil'),
    Id = require('../system/Id'),
    glObject = require('./glObject'),
    Vec2 = require('../math/Vec2'),
    Vec3 = require('../math/Vec3'),
    AABB = require('../geom/AABB'),
    Color = require('../util/Color'),
    Matrix44 = require('../math/Matrix44');

function Mesh(format,size) {
    glObject.apply(this);
    this._format = format || new Mesh.Format();

    this._size = size || 0;
    this._id   = Id.get();

    this.vertices  = new Float32Array(size * format.vertexSize);
    this.normals   = new Float32Array(size * format.normalSize);
    this.colors    = new Float32Array(size * format.colorSize);
    this.texcoords = new Float32Array(size * format.texcoordSize);
    this.indices   = new Uint16Array(0);

    this._transform = null;
    this._transformTemp = new Matrix44();
}

Mesh.prototype = Object.create(glObject.prototype);
Mesh.prototype.constructor = Mesh;

Mesh.Format = function(){
    this.vertexSize   = 3;
    this.normalSize   = 3;
    this.colorSize    = 4;
    this.texcoordSize = 2;
};

Mesh.prototype.appendMesh = function(mesh){
    var format = this._format,
        formatMesh = mesh._format;

    if(formatMesh.vertexSize != format.vertexSize ||
       formatMesh.normalSize != format.normalSize ||
       formatMesh.colorSize  != format.colorSize  ||
       formatMesh.texcoordSize != formatMesh.texcoordSize){
        throw new Error('appendMesh: Incompatible mesh format.');
    }

    var indices = this.indices,
        meshIndices = mesh.indices;

    if((indices && !meshIndices) || (!indices && meshIndices)){
        throw new Error('appendMesh: Incompatible usage. Indices missing.');
    }

    var meshVertices = mesh.vertices,
        meshNormals = mesh.normals,
        meshColors = mesh.colors,
        meshTexcoords = mesh.texcoords;

    var vertices = this.vertices,
        normals  = this.normals,
        colors   = this.colors,
        texcoords = this.texcoords;


    var i,l;

    this.vertices = new Float32Array(vertices.length + meshVertices.length);
    this.vertices.set(vertices);
    this.vertices.set(meshVertices,vertices.length);

    this.normals = new Float32Array(normals.length + meshNormals.length);
    this.normals.set(normals);
    this.normals.set(meshNormals,normals.length);

    this.colors = new Float32Array(colors.length + meshColors.length);
    this.colors.set(colors);
    this.colors.set(meshColors,colors.length);

    this.texcoords = new Float32Array(texcoords.length + meshTexcoords.length);
    this.texcoords.set(texcoords);
    this.texcoords.set(meshTexcoords,texcoords.length);

    vertices = this.vertices;

    if(indices){
        i = indices.length - 1;

        this.indices = new Uint16Array(indices.length + meshIndices.length);
        this.indices.set(indices);
        this.indices.set(meshIndices,indices.length);

        var verticesOffset = (vertices.length - meshVertices.length) / format.vertexSize;

        indices = this.indices;
        l = indices.length;

        while(++i < l){
            indices[i] += verticesOffset;
        }
    }


    if(mesh._transform){
        var vertexSize = format.vertexSize;
        var transform = mesh._transform;

        i = vertices.length - meshVertices.length;
        l = vertices.length;

        if(vertexSize == 3){
            while(i < l){
                transform.multVec3AI(vertices, i);
                i+= 3;
            }
        } else if (vertexSize == 2){
            while(i < l){
                transform.multVec2AI(vertices, i);
                i+= 2;
            }
        } else if (vertexSize == 4){
            //
        }
        this.caculateNormals();
    }
};

Mesh.prototype.transform = function(matrix){
    this._transform = matrix;
};

Mesh.prototype.clearTransform = function(){
    this._transform = null;
};

Mesh.prototype.translate = function(vec){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createTranslation(vec.x,vec.y,vec.z,this._transformTemp.identity()));
};

Mesh.prototype.translate3f = function(x,y,z){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createTranslation(x,y,z,this._transformTemp.identity()));
};

Mesh.prototype.scale = function(vec){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createScale(vec.x,vec.y,vec.z,this._transformTemp.identity()));
};

Mesh.prototype.scale3f = function(x,y,z){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createScale(x,y,z,this._transformTemp.identity()));
};

Mesh.prototype.scale1f = function(x){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createScale(x,x,x,this._transformTemp.identity()));
};

Mesh.prototype.rotate = function(vec){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createRotation(vec.x,vec.y,vec.z),this._transformTemp.identity());
};

Mesh.prototype.rotate3f = function(x,y,z){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createRotation(x,y,z),this._transformTemp.identity());
};

Mesh.prototype.rotateAxis = function(angle,vec){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createRotationOnAxis(angle,vec.x,vec.y,vec.z,this._transformTemp.identity()));
};

Mesh.prototype.rotateAxis3f = function(angle,x,y,z){
    this._transform = (this._transform || new Matrix44())
        .mult(Matrix44.createRotationOnAxis(angle,x,y,z,this._transformTemp.identity()));
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
    var size  = this.format.vertexSize;
        index*= size;
    if(size == 0 || index > this._size - size ){
        return;
    }

    var vertices   = this.vertices;
    vertices[index  ] = vec.x;
    vertices[index+1] = vec.y;
    if(!ObjectUtil.isUndefined(vec.z) && size > 2){
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

Mesh.prototype.setColor = function(index,color){
    var size   = this.format.colorSize,
        colors = this.colors;
    index *= size;

    colors[index]   = color.r;
    colors[index+1] = color.g;
    colors[index+2] = color.g;

    if(size != 4){
        return;
    }
    colors[index+3] = color.a;
};

Mesh.prototype.setColor4f = function(index,r,g,b,a){
    var size   = this.format.colorSize,
        colors = this.colors;
    index *= size;

    colors[index]   = r;
    colors[index+1] = g;
    colors[index+2] = g;

    if(size != 4){
        return;
    }
    colors[index+3] = a;
};

Mesh.prototype.setColor3f = function(index,r,g,b){
    var colors = this.colors;
    index *= this.format.colorSize;

    colors[index  ] = r;
    colors[index+1] = g;
    colors[index+2] = b;
};

Mesh.prototype.setColor2f = function(index,k,a){
    var colors = this.colors,
        size   = this.format.colorSize;
    index *= size;

    colors[index  ] = k;
    colors[index+1] = k;
    colors[index+2] = k;

    if(size!=4){
        return;
    }
    colors[index+3] = a;
};

Mesh.prototype.setColor1f = function(index,k){
    var colors = this.colors;
    index *= this.format.colorSize;

    colors[index  ] = k;
    colors[index+1] = k;
    colors[index+2] = k;
};

Mesh.prototype.setTexcoords = function(texcoords){
    var texcoords_ = this.texcoords;
    this.texcoords = texcoords.length > texcoords_.length ?
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

Mesh.prototype.getBoundingBox = function(box){
    return AABB.fromPointsf(this.vertices, box);
};

Mesh.prototype.caculateNormals = function(){
    var size = this._size;
    var normals = this.normals;
    if(size == 0 || normals.length == 0){
        return;
    }

    var indices  = this.indices,
        vertices = this.vertices;

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

    i = 0;
    if(indices.length == 0){

    }else{
        l = indices.length;
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
    }


    i = 0; l = normals.length;
    while(i < l){

        x = normals[i  ];
        y = normals[i+1];
        z = normals[i+2];

        l = 1.0 / (Math.sqrt(x*x+y*y+z*z) || 1.0);

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