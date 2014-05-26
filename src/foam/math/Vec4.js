var ObjectUtil = require('../util/ObjectUtil');

function Vec4(x,y,z,w){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ObjectUtil.isUndefined(w) ? 1.0 : w;
}

module.exports = Vec4;

