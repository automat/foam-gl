var ObjectUtil = require('../util/ObjectUtil'),
    Vec3 = require('./Vec3'),
    Matrix44 = require('./Matrix44');

var xAxis = Vec3.xAxis(),
    yAxis = Vec3.yAxis();

function Quat(x,y,z,w){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ObjectUtil.isUndefined(w) ? 1.0 : w;
}

Quat.prototype.set = function(q){
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
};

Quat.prototype.setf = function(x,y,z,w){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ObjectUtil.isUndefined(w) ? 1 : w;
    return this;
};

Quat.prototype.setFromTo = function(v0,v1){
    var x,y,z;
    var v0x = v0.x,
        v0y = v0.y,
        v0z = v0.z;
    var v1x = v1.x,
        v1y = v1.y,
        v1z = v1.z;

    var w = v0.dot(v1) + 1;
    if(w < 0.000001){
        w = 0;
        if(Math.abs(v0x) > Math.abs(v0z)){
            x = -v0y;
            y = v0x;
            z = 0;
        } else {
            x = 0;
            y = -v0z;
            z = v0y;
        }
    } else {
        x = v0y * v1z - v1y * v0z;
        y = v0z * v1x - v1z * v0x;
        z = v0x * v1y - v1x * v0y;
    }

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.normalize();

    return this;
};

Quat.prototype.setFromAxisAngle = function(axis,angle){
    axis.normalize();
    angle *= 0.5;
    var sinAngle = Math.sin(angle);
    this.x = axis.x * sinAngle;
    this.y = axis.y * sinAngle;
    this.z = axis.z * sinAngle;
    this.w = Math.cos(angle);
    return this;
}

Quat.prototype.copy = function(q){
    return (q || new Quat()).set(this);
};

Quat.prototype.identity = function(){
    this.x = this.y = this.z = 0;
    this.w = 1.0;
    return this;
}

Quat.prototype.length = function(){
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
}

Quat.prototype.lengthSq = function(){
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return x * x + y * y + z * z + w * w;
}

Quat.prototype.normalize = function(){
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    var length = x * x + y * y + z * z + w * w;
    if(length){
        length = 1.0 / length;
        this.x *= length;
        this.y *= length;
        this.z *= length;
        this.w *= length;
    }
    return this;
}

Quat.prototype.conjugate = function(){
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
}

Quat.prototype.add = function(q){
    this.x += q.x;
    this.y += q.y;
    this.z += q.z;
    this.w += q.w;
    return this;
}

Quat.prototype.addf = function(x,y,z,w){
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    this.w += ObjectUtil.isUndefined(w) ? 1.0 : w;
    return this;
}

Quat.prototype.sub = function(q){
    this.x -= q.x;
    this.y -= q.y;
    this.z -= q.z;
    this.w -= q.w;
    return this;
}

Quat.prototype.subf = function(x,y,z,w){
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    this.w -= ObjectUtil.isUndefined(w) ? 1.0 : w;
    return this;
}

Quat.prototype.mult = function(q){
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    var qx = q.x,
        qy = q.y,
        qz = q.z,
        qw = q.w;

    this.x = x * qw + w * qx + y * qz - z * qy;
    this.y = y * qw + w * qy + z * qx - x * qz;
    this.z = z * qw + w * qz + x * qy - y * qx;
    this.w = w * qw - x * qx - y * qy - z * qz;
    return this;
}

Quat.prototype.scale = function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    this.w *= n;
    return this;
}

Quat.prototype.dot = function(q){
    return this.x * q.x + this.y * q.y +  this.z * q.z + this.w * q.w;
}

Quat.prototype.invert = function(){
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    var length = x * x + y * y + z * z;

    if(length){
        length = 1.0 / length;
    }

    this.x = x * length * -1;
    this.y = y * length * -1;
    this.z = z * length * -1;
    this.w = w * length;
    return this;
}

Quat.prototype.getVec3 = function(v){
    return (v || new Vec3()).set3f(this.x,this.y,this.z);
}

Quat.prototype.getAngle = function(){
    return 2 * Math.acos(this.w);
};

Quat.prototype.multVec3 = function(v) {
    var vx = v.x,
        vy = v.y,
        vz = v.z;

    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;

    var ix =  w * vx + y * vz - z * vy,
        iy =  w * vy + z * vx - x * vz,
        iz =  w * vz + x * vy - y * vx,
        iw = -x * vx - y * vy - z * vz;

    v.x = ix * w + iw * -x + iy * -z - iz * -y;
    v.y = iy * w + iw * -y + iz * -x - ix * -z;
    v.z = iz * w + iw * -z + ix * -y - iy * -x;

    return v;
}

Quat.prototype.toMatrix44 = function(m){
    m = m ? m.identity() : new Matrix44();
    var m_m = m.m;

    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    var x2 = x * 2,
        y2 = y * 2,
        z2 = z * 2;

    var xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    m_m[ 0] = 1 - yy - zz;
    m_m[ 1] = yx + wz;
    m_m[ 2] = zx - wy;

    m_m[ 4] = yx - wz;
    m_m[ 5] = 1 - xx - zz;
    m_m[ 6] = zy + wx;

    m_m[ 8] = zx + wy;
    m_m[ 9] = zy - wx;
    m_m[10] = 1 - xx - yy;

    return m;
}

module.exports = Quat;