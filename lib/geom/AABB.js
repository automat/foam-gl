var Vec3            = require('../math/Vec3'),
    glTrans         = require('../gl/glTrans'),
    glDraw, _glDraw = require('../gl/glDraw');

/**
 * Representation of an axis aligned bounding box,
 * @constructor
 */

function AABB() {
    /**
     * The minimal point.
     * @type {Vec3}
     */
    var min  = this.min = Vec3.max(),
    /**
     * The maximal point
     * @type {Vec3}
    */
        max  = this.max = Vec3.min();

    /**
     * The center of the box.
     * @type {Vec3}
     */
    this.center = new Vec3();
    /**
     * The size of the box. (max - min)
     * @type {Vec3}
     */
    this.size = new Vec3();

    /**
     * The 8 defining points of the box.
     * @type {Array}
     */
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
/**
 * Sets box from another box
 * @param {AABB} aabb - Another box
 * @returns {AABB}
 */

AABB.prototype.set = function(aabb){
    this.min.set(aabb.min);
    this.max.set(aabb.max);
    this.size.set(aabb.size);
    return this;
};

/**
 * Adjusts the box size to include anoterh box.
 * @param {AABB} aabb - Another box
 * @returns {AABB}
 */

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
    return this;
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

/**
 * Returns an axis aligned bounding box from a set of points.
 * @param {Vec3[]} points - N points
 * @returns {AABB}
 */

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

        min.x = Math.min(min.x,px);
        max.x = Math.max(max.x,px);
        min.y = Math.min(min.y,py);
        max.y = Math.max(max.y,py);
        min.z = Math.min(min.z,pz);
        max.z = Math.max(max.z,pz);
    }

    this._update();
    return this;
};

/**
 * Returns an axis aligned bounding box from a set of points.
 * @param {Number[]} points - N points
 * @returns {AABB}
 */

AABB.prototype.setFromPointsf = function(points){
    var min = this.min.toMax(),
        max = this.max.toMin();
    var i = 0, l = points.length;
    var px,py,pz;

    while(i < l){
        px = points[i  ];
        py = points[i+1];
        pz = points[i+2];

        min.x = Math.min(min.x,px);
        max.x = Math.max(max.x,px);
        min.y = Math.min(min.y,py);
        max.y = Math.max(max.y,py);
        min.z = Math.min(min.z,pz);
        max.z = Math.max(max.z,pz);

        i+=3;
    }



    this._update();
    return this;
};

//http://cgvr.cs.uni-bremen.de/teaching/cg2_08/folien/05_culling_1up_2.pdf
// http://jesper.kalliope.org/blog/library/vfcullbox.pdf
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

AABB.fromPoints = function(points,aabb){
    return (aabb || new AABB()).setFromPoints(points);
};

AABB.fromPointsf = function(points,aabb){
    return (aabb || new AABB()).setFromPointsf(points);
};

module.exports = AABB;