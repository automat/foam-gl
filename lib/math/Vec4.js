var ObjectUtil = require('../util/ObjectUtil');

function Vec4(x,y,z,w){
    this.setf(x,y,z,w);
}

Vec4.fromVec3 = function(v,w){
    return new Vec4(v.x, v.y, v.z, w);
};

Vec4.zero = function(){
    return new Vec4();
};

Vec4.prototype.setf = function(x,y,z,w){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ObjectUtil.isUndefined(w) ? 1.0 : w;
    return this;
};

Vec4.prototype.setVec3 = function(v,w){
    return this.setf(v.x, v.y, v.z, w);
};



module.exports = Vec4;

