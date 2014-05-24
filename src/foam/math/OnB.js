var Vec3 = require('./Vec3'),
    Matrix44 = require('./Matrix44');

function OnB(u,v,w){
    this.u = Vec3.zAxis();
    this.v = Vec3.yAxis();
    this.w = Vec3.xAxis();
}

OnB.prototype.set = function(onb){
    this.u.set(onb.u);
    this.v.set(onb.v);
    this.w.set(onb.w);
};

OnB.prototype.getMatrix = function(mat){
    if(mat){
        mat.identity();
        return Matrix44.createRotationOnB(this.u,this.v,this.w,mat);
    }
    return Matrix44.createRotationOnB(this.u,this.v,this.w);
};

module.exports = OnB;
