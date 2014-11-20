var ObjectUtil = require('../util/ObjectUtil');

function Vec4(x,y,z,w){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ObjectUtil.isUndefined(w) ? 1.0 : w;
}

Vec4.fromVec3 = function(v,w){
    return new Vec4(v.x, v.y, v.z, w);
}

Vec4.zero = function(){
    return new Vec4();
}



module.exports = Vec4;

