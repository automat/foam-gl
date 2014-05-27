var Vec3            = require('../math/Vec3'),
    glTrans         = require('../gl/glTrans'),
    glDraw, _glDraw = require('../gl/glDraw');

function AABB() {
    var min  = this.min = Vec3.max(),
        max  = this.max = Vec3.min();
    this.center = new Vec3();
    this.size = new Vec3();
    this.points = new Array(8);

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

    var points = this.points;
    var i = -1,
        l = points.length;
    while(++i < l){
        points[i] = new Vec3();
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

    var points = this.points;

    var p0 = points[0],
        p1 = points[1],
        p2 = points[2],
        p3 = points[3],
        p4 = points[4],
        p5 = points[5],
        p6 = points[6],
        p7 = points[7];


    p0.x = p1.x = p2.x = p3.x = max.x;
    p0.y = p1.y = p2.y = p3.y = max.y;
    p0.z = p1.z = p2.z = p3.z = max.z;

    p0.x -= sizeX; p0.z -= sizeZ;
    p1.z -= sizeZ;
    p2.x -= sizeX;

    p4.x = p5.x = p6.x = p7.x = min.x;
    p4.y = p5.y = p6.y = p7.y = min.y;
    p4.z = p5.z = p6.z = p7.z = min.z;

    p4.x += sizeX;
    p5.z += sizeZ;
    p6.x += sizeX; p6.z += sizeZ;

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

//http://cgvr.cs.uni-bremen.de/teaching/cg2_08/folien/05_culling_1up_2.pdf
AABB.prototype.getNPoint = function(normal,point){
    point = point || new Vec3();
    var min = this.min,
        max = this.max;

    point.x = normal.x >= 0 ? max.x : min.x;
    point.y = normal.y >= 0 ? max.y : min.y;
    point.z = normal.z >= 0 ? max.z : min.z;

    return point;
};

AABB.prototype.getPPoint = function(normal,point){
    point = point || new Vec3();
    var min = this.min,
        max = this.max;

    point.x = normal.x >= 0 ? min.x : max.x;
    point.y = normal.y >= 0 ? min.y : max.y;
    point.z = normal.z >= 0 ? min.z : max.z;

    return point;
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