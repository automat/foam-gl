var Vec3 = require('./Vec3'),
    Matrix44 = require('./Matrix44');

var Quaternion = {

    _EPSIOLON : 0.00001,

    _AXIS_X : Vec3.AXIS_X(),
    _AXIS_Y : Vec3.AXIS_Y(),
    _AXIS_Z : Vec3.AXIS_Z(),

    // create

    create : function(){
       return this.identity(new Float32Array(4));
    },

    create4f : function(x,y,z,w){
        return this.set4f(new Float32Array(4),x,y,z,w);
    },

    createv : function(v,w){
        return this.setv(new Float32Array(4),v,w);
    },

    createFromAxis : function(v,angle){
        return this.setFromAxis(new Float32Array(4),v,angle);
    },

    createFromTo : function(v0,v1){
        return this.setFromTo(new Float32Array(4),v0,v1);
    },

    createFromAngles : function(x,y,z){
        return this.setFromAngles(new Float32Array(4),x,y,z);
    },

    createFromMatrix44 : function(m){

    },

    //  set

    identity : function(q){
        q[0] = q[1] = q[2] = 0;
        q[3] = 1;
        return q;
    },

    set4f : function(q,x,y,z,w){
        q[0] = x;
        q[1] = y;
        q[2] = z;
        q[3] = w;
        return q;
    },

    setv : function(q,v,w){
        return this.set4f(q,v[0],v[1],v[2],w);
    },

    /*
    setFromTo : function(q,v0,v1){
        var v0x = v0[0],
            v0y = v0[1],
            v0z = v0[2];
        var v0length =  Math.sqrt(v0x * v0x + v0y * v0y + v0z * v0z);

        if(v0length){
            v0length = 1.0 / v0length;
            v0x *= v0length;
            v0y *= v0length;
            v0z *= v0length;
        }

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2];
        var v1length = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z);

        if(v1length){
            v1length = 1.0 / v1length;
            v1x *= v1length;
            v1y *= v1length;
            v1z *= v1length;
        }


        var ax,ay,az,angle;

        if(v0x == -v1x &&
           v0y == -v1y &&
           v0z == -v1z){
            angle = Math.abs(Vec3.dot(v0,this._AXIS_X));

            var x, y, z;
            if(angle < 1.0){
                x = 1;
                y = 0;
                z = 0;
            } else {
                x = 0;
                y = 1;
                z = 0;
            }


            ax = v0y * z - y * v0z;
            ay = v0z * x - z * v0x;
            az = v0x * y - x * v0y;

            var olength = Math.sqrt(ax * ax + ay * ay + az * az);
            if(olength){
                olength = 1.0 / olength;
                ax *= olength;
                ay *= olength;
                az *= olength;
            }

            return this.setFromAxis3f(q,ax,ay,az,Math.PI)
        }

        var v01x = v0x + v1x,
            v01y = v0y + v1y,
            v01z = v0z + v1z;

        var v01length = Math.sqrt(v01x * v01x + v01y * v01y + v01z * v01z);
        if(v01length){
            v01length = 1.0 / v01length;
            v01x *= v01length;
            v01y *= v01length;
            v01z *= v01length;
        }

        angle = v0x * v01x + v0y * v01y + v0z * v01z;
        ax = v0y * v01z - v01y * v0z;
        ay = v0z * v01x - v01z * v0x;
        az = v0x * v01y - v01x * v0y;

        return this.setFromAxis3f(q,ax,ay,az,angle);
    },

     */

    setFromAxis3f : function(q,x,y,z,angle){
        angle *= 0.5;

        var length = Math.sqrt(x * x + y * y + z * z);

        if(length){
            length = 1.0 / length;
            x *= length;
            y *= length;
            z *= length;
        }

        var sin = Math.sin(angle);
        q[0] = x * sin;
        q[1] = y * sin;
        q[2] = z * sin;
        q[3] = Math.cos(angle);

        return q;
    },

    setFromTo : function(q,v0,v1){
        var w = Vec3.cross(v0,v1);
        var q = Quaternion.create4f(1 + Vec3.dot(v0,v1), w[0], w[1], w[2]);
        this.normalize(q);
        return q;
    },

    setFromAxis : function(q,v,angle){
        this.setFromAxis3f(q,v[0],v[1],v[2],angle);
    },

    setFromAngles : function(q,x,y,z){
        var cyaw, cpitch, croll, syaw, spitch, sroll;
        var cyawcpitch, syawspitch, cyawspitch, syawcpitch;

        cyaw = Math.cos(z * 0.5);
        cpitch = Math.cos(y * 0.5);
        croll = Math.cos(x * 0.5);
        syaw = Math.sin(z * 0.5);
        spitch = Math.sin(y * 0.5);
        sroll = Math.sin(x * 0.5);

        cyawcpitch = cyaw * cpitch;
        syawspitch = syaw * spitch;
        cyawspitch = cyaw * spitch;
        syawcpitch = syaw * cpitch;

        q[0] = cyawcpitch * croll + syawspitch * sroll;
        q[1] = cyawcpitch * sroll - syawspitch * croll;
        q[2] = cyawspitch * croll + syawcpitch * sroll;
        q[3] = syawcpitch * croll - cyawspitch * sroll;

        return q;
    },


    length: function (q) {
        var x = q[0], y = q[1], z = q[2], w = q[3];
        return Math.sqrt(x * x + y * y + z * z + w * w);
    },

    lengthSq : function(q){
        var x = q[0], y = q[1], z = q[2], w = q[3];
        return x * x + y * y + z * z + w * w;
    },

    normalize : function(q){
        var length = this.length(q);
        if(length){
            length = 1.0 / length;
            q[0] *= length;
            q[1] *= length;
            q[2] *= length;
            q[3] *= length;
        }
        return q;
    },

    conjugate : function(q){
        q[0] *= -1;
        q[1] *= -1;
        q[2] *= -1;
    },

    getMatrix : function(q,m){
        m = m || new Float32Array(16);

        var x = q[0], y = q[1], z = q[2], w = q[3];
        var x2 = x * x, y2 = y * y, z2 = z * z;
        var xy = x * y, xz = x * z, yz = y * z;
        var wx = w * x, wy = w * y, wz = w * z;

        m[ 0] = 1.0 - 2.0 * (y2 + z2);
        m[ 1] = 2.0 * (xy - wz);
        m[ 2] = 2.0 * (xz + wy);

        m[ 4] = 2.0 * (xy + wz);
        m[ 5] = 1.0 - 2.0 * (x2 + z2);
        m[ 6] = 2.0 * (yz - wx);

        m[ 8] = 2.0 * (xz - wy);
        m[ 9] = 2.0 * (yz + wx);
        m[10] = 1.0 - 2.0 * (x2 + y2);

        m[ 3] = m[ 7] = m[11] = 0.0;
        m[12] = m[13] = m[14] = 0.0;

        m[15] = 1.0;

        return m;
    }



};

/*
var Quaternion = {
    create: function (n, v) {
        return new Float32Array([n, v[0], v[1], v[2]]);
    },
    create4f: function (n, x, y, z) {
        return new Float32Array([n, x, y, z]);
    },
    zero: function () {
        return new Float32Array([0, 0, 0, 0]);
    },
    set: function (q0, q1) {
        q0[0] = q1[0];
        q0[1] = q1[1];
        q0[2] = q1[2];
        q0[3] = q1[3];
    },

    set4f: function (q, n, x, y, z) {
        q[0] = n;
        q[1] = x;
        q[2] = y;
        q[3] = z;

    },

    copy: function (q) {
        return new Float32Array(q);
    },

    length: function (q) {
        var n = q[0], x = q[1], y = q[2], z = q[3];
        return Math.sqrt(n * n + x * x + y * y + z * z);
    },
    vector: function (q) {
        return new Float32Array(q[1], q[2], q[3]);
    },
    scalar: function (q) {
        return q[0];
    },




    add: function (q0, q1) {
        q0[0] = q0[0] + q1[0];
        q0[1] = q0[1] + q1[1];
        q0[2] = q0[2] + q1[2];
        q0[3] = q0[3] + q1[3];
    },

    sub: function (q0, q1) {
        q0[0] = q0[0] - q1[0];
        q0[1] = q0[1] - q1[1];
        q0[2] = q0[2] - q1[2];
        q0[3] = q0[3] - q1[3];
    },

    scale: function (q, n) {
        q[0] *= n;
        q[1] *= n;
        q[2] *= n;
        q[3] *= n;
    },

    conjugate: function (q) {
        q[1] *= -1;
        q[2] *= -1;
        q[3] *= -1;
    },

    mult: function (q0, q1) {
        var n0 = q0[0],
            x0 = q0[1],
            y0 = q0[2],
            z0 = q0[3],
            n1 = q1[0],
            x1 = q1[1],
            y1 = q1[2],
            z1 = q1[3];

        q0[0] = n0 * n1 - x0 * x1 - y0 * y1 - z0 * z1;
        q0[1] = n0 * x1 - x0 * n1 - y0 * z1 - z0 * y1;
        q0[2] = n0 * y1 - y0 * n1 - z0 * x1 - x0 * z1;
        q0[3] = n0 * z1 - z0 * n1 - x0 * y1 - y0 * z1;
    },

    multVec: function (q, v) {
        var qn = q[0],
            qx = q[1],
            qy = q[2],
            qz = q[3];

        var x = v[0],
            y = v[1],
            z = v[2];

        q[0] = -(qx * x + qy * y + qz * z);
        q[1] = qn * x + qy * z - qz * y;
        q[2] = qn * y + qz * x - qx * z;
        q[3] = qn * z + qx * y - qy * x;
    },

    angle: function (q) {
        return 2 * Math.acos(q[0]);
    },

    axis: function (q) {
        var x = q[0],
            y = q[1],
            z = q[2];

        var l = Math.sqrt(x * x + y * y + z * z);

        return l != 0 ? new Float32Array([x / l, y / l, z / l]) : new Float32Array([0, 0, 0]);
    },

    toMatrix : function(v,m){

    },

    //TODO: INLINE ALL!!

    rotate: function (q0, q1) {
        this.set(q0, this.mult(this.mult(this.copy(q0), q1),
            this.conjugate(this.copy(q0))));
    },

    rotateVec: function (q, v) {
        var t = this.zero();
        this.set(t, this.multVec3(this.multVec3(this.copy(q), v), this.conjugate(this.copy(q))));
    },

    fromAngles: function (ax, ay, az) {
        var q = this.zero();

        var cyaw, cpitch, croll, syaw, spitch, sroll;
        var cyawcpitch, syawspitch, cyawspitch, syawcpitch;

        cyaw = Math.cos(az * 0.5);
        cpitch = Math.cos(ay * 0.5);
        croll = Math.cos(ax * 0.5);
        syaw = Math.sin(az * 0.5);
        spitch = Math.sin(ay * 0.5);
        sroll = Math.sin(ax * 0.5);

        cyawcpitch = cyaw * cpitch;
        syawspitch = syaw * spitch;
        cyawspitch = cyaw * spitch;
        syawcpitch = syaw * cpitch;

        return new Float32Array([ cyawcpitch * croll + syawspitch * sroll,
                cyawcpitch * sroll - syawspitch * croll,
                cyawspitch * croll + syawcpitch * sroll,
                syawcpitch * croll - cyawspitch * sroll ]);

    },

    anglesFrom: function (q) {
        var qn = q[0],
            qx = q[1],
            qy = q[2],
            qz = q[3];

        var r11, r21, r31, r32, r33, r12, r13;
        var q00, q11, q22, q33;
        var temp;
        var v = new Float32Array(3);

        q00 = qn * qn;
        q11 = qx * qx;
        q22 = qy * qy;
        q33 = qz * qz;

        r11 = q00 + q11 - q22 - q33;
        r21 = 2 * ( qx + qy + qn * qz);
        r31 = 2 * ( qx * qz - qn * qy);
        r32 = 2 * ( qy * qz + qn * qx);
        r33 = q00 - q11 - q22 + q33;

        temp = Math.abs(r31);
        if (temp > 0.999999) {
            r12 = 2 * (qx * qy - qn * qz);
            r13 = 2 * (qx * qz - qn * qy);

            v[0] = 0.0;
            v[1] = (-(Math.PI * 0.5) * r32 / temp);
            v[2] = Math.atan2(-r12, -r31 * r13);
            return v;
        }

        v[0] = Math.atan2(r32, r33);
        v[1] = Math.asin(-31);
        v[2] = Math.atan2(r21, r11);
        return v;
    }
};
*/

module.exports = Quaternion;