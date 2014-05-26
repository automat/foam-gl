var Vec3            = require('../math/Vec3'),
    glTrans         = require('../gl/glTrans'),
    glDraw, _glDraw = require('../gl/glDraw');

function AABB() {
    var min  = this.min = Vec3.max(),
        max  = this.max = Vec3.min();
    this.center = new Vec3();
    this.size = new Vec3();
    this.vertices = new Array(8);

    switch (arguments.length){
        case 1 :
            if(arguments[0] instanceof AABB){
                this.set(arguments[0]);
            } else if(arguments[0] instanceof Vec3) {
                max.set(arguments[0]);
            }
            break;
        case 2 :
            if(arguments[0] instanceof Vec3 &&
               arguments[1] instanceof Vec3){
                min.set(arguments[0]);
                max.set(arguments[1]);
            }
            break;
    }

    var vertices = this.vertices;
    var i = -1,
        l = vertices.length;
    while(++i < l){
        vertices[i] = new Vec3();
    }
    this._update();

    glDraw = glDraw || _glDraw.get();
}

AABB.prototype.set = function(aabb){
    this.min.set(aabb.min);
    this.max.set(aabb.max);
    this.size.set(aabb.size);
};

AABB.prototype.include = function(aabb){
    var min = this.min,
        max = this.max,
        amin = aabb.min,
        amax = aabb.max;

    min.x = Math.min(min.x,amin.x);
    min.y = Math.min(min.y,amin.y);
    min.z = Math.min(min.z,amin.z);
    max.x = Math.max(max.x,amax.x);
    max.y = Math.max(max.y,amax.y);
    max.z = Math.max(max.z,amax.z);

    this._update();
};

AABB.prototype._update = function(){
    var min  = this.min,
        max  = this.max,
        size = this.size.set(max).sub(min);
    var sizeX = size.x,
        sizeZ = size.z;

    var vertices = this.vertices;

    var v0 = vertices[0],
        v1 = vertices[1],
        v2 = vertices[2],
        v3 = vertices[3],
        v4 = vertices[4],
        v5 = vertices[5],
        v6 = vertices[6],
        v7 = vertices[7];


    v0.x = v1.x = v2.x = v3.x = max.x;
    v0.y = v1.y = v2.y = v3.y = max.y;
    v0.z = v1.z = v2.z = v3.z = max.z;

    v0.x -= sizeX; v0.z -= sizeZ;
    v1.z -= sizeZ;
    v2.x -= sizeX;

    v4.x = v5.x = v6.x = v7.x = min.x;
    v4.y = v5.y = v6.y = v7.y = min.y;
    v4.z = v5.z = v6.z = v7.z = min.z;

    v4.x += sizeX;
    v5.z += sizeZ;
    v6.x += sizeX; v6.z += sizeZ;

    var center = this.center;
    center.x = min.x + sizeX * 0.5;
    center.y = min.y + size.y * 0.5;
    center.z = min.z + sizeZ * 0.5;
};

AABB.prototype.setFromPoints = function(points){
    var min = this.min.toMax(),
        max = this.max.toMin();
    var i = -1, l = points.length;
    var point;
    var px,py,pz;

    while(++i < l){
        point = points[i];
        px = point.x;
        py = point.y;
        pz = point.z;

        if( px < min.x ) {
            min.x = px;
        } else if( px > max.x ){
            max.x = px;
        }

        if( py < min.y ) {
            min.y = py;
        } else if( py > max.y ){
            max.y = py;
        }

        if( pz < min.z ) {
            min.z = pz;
        } else if( pz > max.z ){
            max.z = pz;
        }
    }

    this._update();
};

AABB.prototype.setFromPointsf = function(points){
    var min = this.min.toMax(),
        max = this.max.toMin();
    var i = -1, l = points.length;
    var point;
    var px,py,pz;

    while(++i < l){
        point = points[i];
        px = point.x;
        py = point.y;
        pz = point.z;

        if( px < min.x ) {
            min.x = px;
        } else if( px > max.x ){
            max.x = px;
        }

        if( py < min.y ) {
            min.y = py;
        } else if( py > max.y ){
            max.y = py;
        }

        if( pz < min.z ) {
            min.z = pz;
        } else if( pz > max.z ){
            max.z = pz;
        }
    }

    this._update();
};

AABB.prototype.draw = function(center){
    glTrans.pushMatrix();
    glTrans.translate(this.center);
    if(center){
        glDraw.drawPivot();
    }
    glTrans.scale(this.size);
    glDraw.drawCubeStroked();
    glTrans.popMatrix();
};


module.exports = AABB;