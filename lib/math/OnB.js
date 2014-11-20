var Vec3 = require('./Vec3'),
    Matrix44 = require('./Matrix44');

/**
 * Representation of an orthogonal basis.
 * @param {Vec3} u - u
 * @param {Vec3} v - v
 * @param {Vec3} w - w
 * @constructor
 */

function OnB(u,v,w){
    this.u = Vec3.zAxis();
    this.v = Vec3.yAxis();
    this.w = Vec3.xAxis();
}

/**
 * Set onb from another onb.
 * @param {Onb} onb - Another onb
 */

OnB.prototype.set = function(onb){
    this.u.set(onb.u);
    this.v.set(onb.v);
    this.w.set(onb.w);
};

/**
 * Returns a transformation matrix from the onb.
 * @param {Matrix44} [mat] - Out matrix
 * @returns {Matrix44}
 */

OnB.prototype.getMatrix = function(mat){
    if(mat){
        mat.identity();
        return Matrix44.createRotationOnB(this.u,this.v,this.w,mat);
    }
    return Matrix44.createRotationOnB(this.u,this.v,this.w);
};

module.exports = OnB;
