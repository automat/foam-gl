var ObjectUtil = require('../util/ObjectUtil'),
    Vec3 = require('./Vec3'),
    Vec4 = require('./Vec4'),
    Matrix44 = require('./Matrix44'),
    Math_ = require('./Math');

var xAxis = Vec3.xAxis(),
    yAxis = Vec3.yAxis();
var vec3Temp = new Vec3();

function Quat(w,x,y,z){
    this.w = ObjectUtil.isUndefined(w) ? 1.0 : w;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Quat.fromVec3 = function(w,v){
    return new Quat(w, v.x, v.y, v.z);
};

Quat.fromVec4 = function(v){
    return new Quat(v.w, v.x, v.y, v.z);
};

Quat.fromEuler = function(pitch,yaw,roll){
    return new Quat().setFromEuler(pitch,yaw,roll);
};

Quat.prototype.set = function(q){
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
};

Quat.prototype.setVec3 = function(w,v){
    this.w = w;
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

Quat.prototype.setf = function(w,x,y,z){
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};

Quat.prototype.copy = function(){
    return new Quat(this.w,this.x,this.y,this.z);
};

Quat.prototype.identity = function(){
    this.w = 1.0;
    this.x = this.y = this.z = 0.0;
    return this;
};

Quat.prototype.mult = function(q){
    var w = this.w, x = this.x, y = this.y, z = this.z;
    var qw = q.w, qx = q.x, qy = q.y, qz = q.z;
    this.w = w * qw - x * qx - y * qy - z * qz;
    this.x = w * qx + x * qw + y * qz - z * qy;
    this.y = w * qy + y * qw + z * qx - x * qz;
    this.z = w * qz + z * qw + x * qy - y * qx;
    return this;
};

Quat.prototype.dot = function(q){
    return (this.x * q.x) + (this.y * q.y) + (this.z * q.z) + (this.w * q.w);
}

Quat.prototype.interpolateTo = function(target,x){
    var scale,scale_;
    var dot = this.dot(target);
    var theta = Math.acos(dot),
        sinTheta = Math.sin(theta);

    if (sinTheta > 0.001) {
        scale = Math.sin(theta * (1.0 - x)) / sinTheta;
        scale_ = Math.sin(theta * x) / sinTheta;
    } else {
        scale = 1 - x;
        scale_ = x;
    }

    var mult = dot < 0 ? -1 : 1;
    return this.setf(
        this.w * scale + target.w * scale_ * mult,
        this.x * scale + target.x * scale_ * mult,
        this.y * scale + target.y * scale_ * mult,
        this.z * scale + target.z * scale_ * mult
    ).normalize();
};

Quat.prototype.interpolatedTo = function(target,t){
    return this.copy().interpolateTo(target,t);
};

Quat.prototype.multiplied = function(q){
    return this.copy().mult(q);
};

Quat.prototype.length = function(){
    var w = this.w, x = this.x, y = this.y, z = this.z;
    return Math.sqrt(x * x + y * y + z * z + w * w);
};

Quat.prototype.normalize = function(){
    var len = this.length();
    if(len > Math_.EPSILON){
        len = 1.0 / len;
        this.w *= len;
        this.x *= len;
        this.y *= len;
        this.z *= len;
    }
    return this;
};

Quat.prototype.normalized = function(){
    return this.copy().normalize();
};

Quat.prototype.scale = function(x){
    this.w *= x;
    this.x *= x;
    this.y *= x;
    this.z *= x;
    return this;
};

Quat.prototype.scaled = function(x){
    return this.copy().scale(x);
};

Quat.prototype.setFromEuler = function(pitch,yaw,roll){
    pitch *= 0.5;
    yaw   *= 0.5;
    roll  *= 0.5;

    var c1 = Math.cos(yaw),
        s1 = Math.sin(yaw),
        c2 = Math.cos(pitch),
        s2 = Math.sin(pitch),
        c3 = Math.cos(roll),
        s3 = Math.sin(roll);

    var c1c2 = c1*c2,
        s1s2 = s1*s2;

    this.w = c1c2*c3 - s1s2*s3;
    this.x = c1c2*s3 + s1s2*c3;
    this.y = s1*c2*c3 + c1*s2*s3;
    this.z = c1*s2*c3 - s1*c2*s3;
    return this;
};

Quat.prototype.getAxis = function(){
    var w = this.w;
    var s = Math.sqrt(1.0 - w * w);
        s = s < Math_.EPSILON ? 1 : 1 / s;
    return new Vec3(this.x * s,this.y * s,this.z * s);
};

Quat.prototype.getAngle = function(){
    return Math.acos(this.w) * 2.0;
};

Quat.prototype.getAxisAngle = function(){
    return Vec4.fromVec3(this.getAxis(),this.getAngle());
};

Quat.prototype.toMatrix44 = function(matrix){
    matrix = matrix || new Matrix44;
    var w = this.w,
        x = this.x,
        y = this.y,
        z = this.z;

    var x2 = x + x,
        y2 = y + y,
        z2 = z + z;

    var xx = x * x2,
        xy = x * y2,
        xz = x * z2;

    var yy = y * y2,
        yz = y * z2,
        zz = z * z2;

    var wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    return matrix.setf(
        1 - (yy + zz), xy + wz, xz - wy, 0,
        xy - wz, 1 - (xx + zz), yz + wx, 0,
        xz + wy, yz - wx, 1 - (xx + yy), 0,
        0, 0, 0, 1
    );
};

Quat.prototype.toString = function(){
    return '[' + this.w + ',' + this.x + ',' + this.y + ',' + this.z + ']';
};

module.exports = Quat;