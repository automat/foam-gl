var ObjectUtil = require('../util/ObjectUtil'),
    Vec3 = require('./Vec3'),
    Vec4 = require('./Vec4'),
    Matrix33 = require('./Matrix33'),
    Matrix44 = require('./Matrix44'),
    Math_ = require('./Math');

var glu = require('../gl/glu');

var xAxis = Vec3.xAxis(),
    yAxis = Vec3.yAxis();
var vec3Temp = new Vec3();

/**
 * Quaternion representation
 * @param {Number} [w]
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @constructor
 */

function Quat(w,x,y,z){
    this.w = ObjectUtil.isUndefined(w) ? 1.0 : w;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

/**
 * Returns a quaternion set from Vec4 wxyz components
 * @param {Vec4}v
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromVec4 = function(v,out){
    return (out || new Quat())(v.w, v.x, v.y, v.z);
};

/**
 * Set quaternion from other quaternion.
 * @param {Quat} q
 * @returns {Quat}
 */

Quat.prototype.set = function(q){
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
};

/**
 * Set quaternion from components.
 * @param {Number} w
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {Quat}
 */

Quat.prototype.setf = function(w,x,y,z){
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};

/**
 * Set quaternion from w and Vec3 xyz components.
 * @param {Number} w
 * @param {Vec3} v
 * @returns {Quat}
 */

Quat.prototype.setVec3 = function(w,v){
    this.w = w;
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

/**
 * Returns a quaternion set from w and Vec3 xyz components.
 * @param {Number} w
 * @param {Vec3} v
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromVec3 = function(w,v,out){
    return (out || new Quat()).setf(w, v.x, v.y, v.z);
};

/**
 * Sets the quaternion from an orthonormal basis.
 * @param {Vec3} u - tangent
 * @param {Vec3} v - up
 * @param {Vec3} w -
 * @returns {Quat}
 */
//TODO: Remove matrix
Quat.prototype.setFromOnBAxes = function(u,v,w){
    return this.setFromMatrix33(new Matrix33().setAxes(u,v,w));
};

/**
 * Returns a quaternion from an orthonormal basis.
 * @param {Vec3} u - tangent
 * @param {Vec3} v - up
 * @param {Vec3} w - cotangent
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromOnBAxes = function(u,v,w,out){
    return (out || new Quat()).setFromOnBAxes(u,v,w);
};

/**
 * Sets the quaternion from an orthonormal basis.
 * @param {OnB}onb
 * @returns {Quat}
 */

Quat.prototype.setFromOnB = function(onb){
    return this.setFromOnBAxes(onb.u,onb.v,onb.w);
};

/**
 * Returns a quaternion from on orthogonal basis.
 * @param {OnB}onb
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromOnBAxes = function(onb,out){
    return (out || new Quat()).setFromOnB(onb);
};

/**
 * Returns a copy of the quaternion.
 * @returns {Quat}
 */

Quat.prototype.copy = function(out){
    return (out || new Quat()).setf(this.w,this.x,this.y,this.z);
};

/**
 * Sets the quaternion to the unit quaternion.
 * @returns {Quat}
 */

Quat.prototype.identity = function(){
    this.w = 1.0;
    this.x = this.y = this.z = 0.0;
    return this;
};

/**
 * Multiplies the quaternion with another quaternion.
 * @param q
 * @returns {Quat}
 */

Quat.prototype.mult = function(q){
    var w = this.w, x = this.x, y = this.y, z = this.z;
    var qw = q.w, qx = q.x, qy = q.y, qz = q.z;
    this.w = w * qw - x * qx - y * qy - z * qz;
    this.x = w * qx + x * qw + y * qz - z * qy;
    this.y = w * qy + y * qw + z * qx - x * qz;
    this.z = w * qz + z * qw + x * qy - y * qx;
    return this;
};

/**
 * Returns a multiplied copy of the quaternion.
 * @param q
 * @param {Quat} [out] - Optional out
 * @returns {Quat}
 */

Quat.prototype.multiplied = function(q,out){
    return this.copy(out).mult(q);
};

/**
 * Returns the dot product with another quaternion.
 * @param q
 * @returns {number}
 */

Quat.prototype.dot = function(q){
    return (this.x * q.x) + (this.y * q.y) + (this.z * q.z) + (this.w * q.w);
};

Quat.prototype.length = function(){
    var w = this.w, x = this.x, y = this.y, z = this.z;
    return Math.sqrt(x * x + y * y + z * z + w * w);
};

/**
 * Normalizes the quaternion.
 * @returns {Quat}
 */

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

/**
 * Returns a normalized copy of the quaternion.
 * @param out
 * @returns {Quat}
 */

Quat.prototype.normalized = function(out){
    return this.copy(out).normalize();
};

Quat.prototype.scale = function(x){
    this.w *= x;
    this.x *= x;
    this.y *= x;
    this.z *= x;
    return this;
};

Quat.prototype.scaled = function(x,out){
    return this.copy(out).scale(x);
};

Quat.prototype.negate = function(){
    return this.scale(-1);
};

Quat.prototype.negated = function(out){
    return this.copy(out).negate();
};

/**
 * Sets the quaternion as a rotation from axis angle representation.
 * @param {Vec3}axis
 * @param {Number}angle
 * @returns {Quat}
 */

Quat.prototype.setFromAxisAngle = function(axis,angle){
    return this.setFromAxisAnglef(axis.x,axis.y,axis.z,angle);
};

/**
 * Returns a quaternion from an axis angle representation.
 * @param {Vec3}axis
 * @param {Number}angle
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromAxisAngle = function(axis,angle,out){
    return (out || new Quat()).setFromAxisAngle(axis,angle);
};

/**
 * Sets the quaternion as a rotation from an axis angle representation.
 * @param {Number}x - Axis x
 * @param {Number}y - Axis y
 * @param {Number}z - Axis z
 * @param {Number}angle
 * @returns {Quat}
 */

Quat.prototype.setFromAxisAnglef = function(x,y,z,angle){
    var angle_2 = angle * 0.5;
    var sin_2 = Math.sin(angle_2);
    this.w = Math.cos(angle_2);
    this.x = x * sin_2;
    this.y = y * sin_2;
    this.z = z * sin_2;
    return this.normalize();
};

/**
 * Returns a quaternion from an axis angle representation.
 * @param {Number}x - Axis x
 * @param {Number}y - Axis y
 * @param {Number}z - Axis z
 * @param {Number}angle
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */


Quat.fromAxisAnglef = function(x,y,z,angle,out){
    return (out || new Quat()).setFromAxisAnglef(x,y,z,angle);
};

/**
 * Interpolates the quaternion towards a given target.
 * @param {Quat}target
 * @param {Number}x
 * @returns {Quat}
 */

Quat.prototype.interpolateTo = function(target,x){
    var scale,scale_;
    var dot = this.dot(target);
    var theta = Math.acos(dot),
        sinTheta = Math.sin(theta);

    if (sinTheta > 0.001) {
        scale = Math.sin(theta * (1.0 - x)) / sinTheta;
        scale_ = Math.sin(theta * x) / sinTheta;
    } else {
        //Linear if close enough
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

/**
 * Returns an interpolated copy towards a given target.
 * @param {Quat}target
 * @param {Number}x
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.prototype.interpolatedTo = function(target,x,out){
    return this.copy(out).interpolateTo(target,x);
};

/**
 * Sets a look at rotation from a given point towards a given target.
 * @param {Vec3}from
 * @param {Vec3}to
 */

Quat.prototype.lookAt = function(from,to,up){
    up = up || Vec3.yAxis();
    var lookAt = to.subbed(from).normalize();
    var right  = lookAt.crossed(up).normalize();
    var _up    = lookAt.crossed(right).normalize();

    var matrix = new Matrix44();
    glu.lookAt(matrix.m,from.x,from.y,from.z,to.x,to.y,to.z,up.x,up.y,up.z);

    return this.setFromMatrix44(matrix);

    //var a = lookAt,
    //    b = _up,
    //    c = right;
    //
    //this._setFromMatrix(
    //    a.x, b.x, c.x,
    //    a.y, b.y, c.y,
    //    a.z, b.z, c.z
    //);
    //
    //
    //return this.normalize();

    //var ahead = new Vec3(1,0,0);
    //var forward = to.subbed(from).normalize();
    //var dot = ahead.dot(forward);
    //if(Math.abs(dot - -1.0) < 0.000001){
    //    return this.setVec3(Math.PI,Vec3.yAxis());
    //}
    //if(Math.abs(dot - 1.0)  < 0.000001){
    //    return this.identity();
    //}
    //var angle = Math.acos(dot);
    //var axis  = for;
    //
    //return this.setFromAxisAngle(axis,angle).normalize();

    //up = up || Vec3.yAxis();
    //var dir = to.subbed(from).normalize();
    //var x = dir;
    //var z = up.cross(dir).normalize();
    //var y = up.cross(z).normalize();
    //
    //return this._setFromMatrix(
    //    x.x, x.y, x.z,
    //    y.x, y.y, y.z,
    //    z.x, z.y, z.z
    //);

    //return this.setFromMatrix44
};

/**
 * Returns a
 * @param from
 * @param to
 * @param out
 * @returns {*}
 */

Quat.fromLookAt = function(from,to,out){
    return (out || new Quat()).lookAt(from,to);
};

//http://lolengine.net/blog/2013/09/18/beautiful-maths-quaternion-from-vectors

Quat.prototype.lookAtf = function(x0,y0,z0,x1,y1,z1){
    var dot00 = x0 * x0 + y0 * y0 + z0 * z0,
        dot11 = x1 * x1 + y1 * y1 + z1 * z1,
        dot01 = x0 * x1 + y0 * y1 + z0 * z1;

    var normUnormV = Math.sqrt(dot00 * dot11),
        realPart   = normUnormV + dot01;

    var wx,wy,wz;
    if(realPart < (0.000001 * normUnormV)){
        realPart = 0.0;
        if(Math.abs(x0) > Math.abs(z0)){
            wx = -y0;
            wy =  x0;
            wz =  0;
        } else {
            wx =  0;
            wy = -z0;
            wz =  y0;
        }
    } else {
        wx = y0 * z1 - y1 * z0;
        wy = z0 * x1 - z1 * x0;
        wz = x0 * y1 - x1 * y0;
    }
    console.log(y0 * z1 - y1 * z0);
    return this.setf(realPart,wx,wy,wz).normalize();
};

Quat.fromLookAtf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,out){
    return (out || new Quat()).lookAtf(x0,y0,z0,x1,y1,z1,x2,y2,z2);
};


/**
 * Sets the quaternion from euler rotation angles.
 * @param {Number}pitch
 * @param {Number}yaw
 * @param {Number}roll
 * @returns {Quat}
 */

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

/**
 * Returns the axis angle representation.
 * @returns {Vec4}
 */

Quat.prototype.getAxisAngle = function(out){
    return (out || new Vec4()).setVec3(this.getAxis(),this.getAngle());
};

/**
 * Returns a 4x4 rotation matrix from the normalized quaternion.
 * @param {Matrix44}[out] - Optional out
 * @returns {Matrix44}
 */

Quat.prototype.toMatrix44 = function(out){
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

    return (out || new Matrix44()).setf(
        1 - (yy + zz), xy + wz, xz - wy, 0,
        xy - wz, 1 - (xx + zz), yz + wx, 0,
        xz + wy, yz - wx, 1 - (xx + yy), 0,
        0, 0, 0, 1
    );
};

Quat.prototype.toMatrix44Inverted = function(out){
    return this.toMatrix44(out).invert();
};

Quat.prototype._setFromMatrix = function(m00,m01,m02,
                                         m10,m11,m12,
                                         m20,m21,m22){
    var trace = m00 + m11 + m22,
        s,_s;

    var w, x, y, z;

    if (trace > 0) {
        s = Math.sqrt(trace + 1.0) * 2;
        this.setf(
            0.25 * s,
            (m21 - m12) / s,
            (m02 - m20) / s,
            (m10 - m01) / s
        )
    } else if ((m00 > m11) && (m00 > m22)) {
        s = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
        this.setf(
            (m21 - m12) / s,
            0.25 * s,
            (m01 + m10) / s,
            (m02 + m20) / s
        )
    } else if (m11 > m22) {
        s = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
        this.setf(
            (m02 - m20) / s,
            (m01 + m10) / s,
            0.25 * s,
            (m12 + m21) / s
        );
    } else {
        s = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
        this.setf(
            (m10 - m01) / s,
            (m02 + m20) / s,
            (m12 + m21) / s,
            0.25 * s
        )
    }

    //function copySign(a, b) {
    //    return b < 0 ? -Math.abs(a) : Math.abs(a);
    //}
    //var absQ = Math.pow(m.determinant(), 1.0 / 3.0);
    //this.w = Math.sqrt( Math.max( 0, absQ + m.n11 + m.n22 + m.n33 ) ) / 2;
    //this.x = Math.sqrt( Math.max( 0, absQ + m.n11 - m.n22 - m.n33 ) ) / 2;
    //this.y = Math.sqrt( Math.max( 0, absQ - m.n11 + m.n22 - m.n33 ) ) / 2;
    //this.z = Math.sqrt( Math.max( 0, absQ - m.n11 - m.n22 + m.n33 ) ) / 2;
    //this.x = copySign( this.x, ( m.n32 - m.n23 ) );
    //this.y = copySign( this.y, ( m.n13 - m.n31 ) );
    //this.z = copySign( this.z, ( m.n21 - m.n12 ) );
    return this;
};

/**
 * Sets the quaternion from a 4x4 rotation matrix.
 * @param matrix
 * @returns {Quat}
 */

Quat.prototype.setFromMatrix44 = function(matrix){
    var m = matrix.m;
    //var m00 = m[0], m01 = m[4], m02 = m[8],
    //    m10 = m[1], m11 = m[5], m12 = m[9],
    //    m20 = m[2], m21 = m[6], m22 = m[10];
    //var t = m00 + m11 + m22,
    //    s;
    //
    //if (t > 0) {
    //    s = Math.sqrt(t + 1.0) * 2;
    //    this.setf(
    //        0.25 * s,
    //        (m21 - m12) / s,
    //        (m02 - m20) / s,
    //        (m10 - m01) / s
    //    )
    //} else if ((m00 > m11) && (m00 > m22)) {
    //    s = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
    //    this.setf(
    //        (m21 - m12) / s,
    //        0.25 * s,
    //        (m01 + m10) / s,
    //        (m02 + m20) / s
    //    )
    //} else if (m11 > m22) {
    //    s = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
    //    this.setf(
    //        (m02 - m20) / s,
    //        (m01 + m10) / s,
    //        0.25 * s,
    //        (m12 + m21) / s
    //    );
    //} else {
    //    s = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
    //    this.setf(
    //        (m10 - m01) / s,
    //        (m02 + m20) / s,
    //        (m12 + m21) / s,
    //        0.25 * s
    //    )
    //}
    //return this;
    //
    return this._setFromMatrix(m[0],m[4],m[8],
                               m[1],m[5],m[9],
                               m[2],m[6],m[10]);
};

/**
 * Returns a quaternion from a rotation 4x4 rotation matrix.
 * @param {Matrix44} matrix
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromMatrix44 = function(matrix,out){
    return (out || new Quat()).setFromMatrix44(matrix);
};

/**
 * Returns a 3x3 rotation matrix from the normalized quaternion.
 * @param {Matrix33}[out] - Optional out
 * @returns {Matrix33}
 */

Quat.prototype.toMatrix33 = function(out){
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

    return (out || new Matrix33()).setf(
        1 - (yy + zz), xy + wz, xz - wy,
        xy - wz, 1 - (xx + zz), yz + wx,
        xz + wy, yz - wx, 1 - (xx + yy)
    );
};

/**
 * Sets the quaternion from a 3x3 rotation matrix.
 * @param matrix
 * @returns {Quat}
 */


Quat.prototype.setFromMatrix33 = function(matrix){
    var m = matrix.m;
    return this._setFromMatrix(m[0],m[3],m[6],
                               m[1],m[4],m[7],
                               m[2],m[5],m[8]);
};

/**
 * Returns a quaternion from a 3x3 rotation matrix.
 * @param {Matrix33} matrix
 * @param {Quat}[out] - Optional out
 * @returns {Quat}
 */

Quat.fromMatrix33 = function(matrix,out){

};

/**
 * Returns a string representation of the quaternion.
 * @returns {string}
 */

Quat.prototype.toString = function(){
    return '[' + this.w + ',' + this.x + ',' + this.y + ',' + this.z + ']';
};

module.exports = Quat;