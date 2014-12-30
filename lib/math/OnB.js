var Vec3 = require('./Vec3'),
    Matrix44 = require('./Matrix44');

/**
 * Representation of an orthonormal basis.
 * @param {Vec3} [u] - tangent
 * @param {Vec3} [v] - up
 * @param {Vec3} [w] - cotangent
 * @constructor
 */

function OnB(u,v,w){
    this.u = u || Vec3.zAxis();
    this.v = v || Vec3.yAxis();
    this.w = w || Vec3.xAxis();
}

/**
 * Set onb from another onb.
 * @param {OnB} onb - Another onb
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
        return Matrix44.fromOnBAxes(this.u,this.v,this.w,mat);
    }
    return Matrix44.fromOnBAxes(this.u,this.v,this.w);
};

module.exports = OnB;
