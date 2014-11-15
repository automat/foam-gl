var Matrix33 = require('./Matrix33');

function Matrix44() {
    this.m = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1 ];
}

Matrix44.prototype.set = function(mat44){
    var m = this.m,
        m_m = mat44.m;

    m[ 0] = m_m[ 0];
    m[ 1] = m_m[ 1];
    m[ 2] = m_m[ 2];
    m[ 3] = m_m[ 3];

    m[ 4] = m_m[ 4];
    m[ 5] = m_m[ 5];
    m[ 6] = m_m[ 6];
    m[ 7] = m_m[ 7];

    m[ 8] = m_m[ 8];
    m[ 9] = m_m[ 9];
    m[10] = m_m[10];
    m[11] = m_m[11];

    m[12] = m_m[12];
    m[13] = m_m[13];
    m[14] = m_m[14];
    m[15] = m_m[15];

    return this;
};

Matrix44.prototype.copy = function(){
    return (new Matrix44()).set(this);
};

Matrix44.prototype.identity = function(){
    var m = this.m;
    m[ 0] = 1;
    m[ 1] = m[ 2] = m[ 3] = 0;
    m[ 5] = 1;
    m[ 4] = m[ 6] = m[ 7] = 0;
    m[10] = 1;
    m[ 8] = m[ 9] = m[11] = 0;
    m[15] = 1;
    m[12] = m[13] = m[14] = 0;

    return this;
};

Matrix44.prototype.scale = function(sx,sy,sz){
    var m = this.m;

    m[ 0] = sx;
    m[ 5] = sy;
    m[10] = sz;

    return this;
};

Matrix44.prototype.translate = function(tx,ty,tz){
    var m = this.m;

    m[12] = tx;
    m[13] = ty;
    m[14] = tz;

    return this;
};

Matrix44.prototype.rotateX = function(a){
    var m = this.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    m[5] = cos;
    m[6] = -sin;
    m[9] = sin;
    m[10] = cos;

    return this;
};

Matrix44.prototype.rotateY = function(a){
    var m = this.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    m[0] = cos;
    m[2] = sin;
    m[8] = -sin;
    m[10] = cos;

    return this;
};

Matrix44.prototype.rotateZ = function(a){
    var m = this.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    m[0] = cos;
    m[1] = sin;
    m[4] = -sin;
    m[5] = cos;

    return this;
};

Matrix44.prototype.rotate = function(ax,ay,az){
    var m = this.m;

    var cosx = Math.cos(ax),
        sinx = Math.sin(ax),
        cosy = Math.cos(ay),
        siny = Math.sin(ay),
        cosz = Math.cos(az),
        sinz = Math.sin(az);

    m[ 0] = cosy * cosz;
    m[ 1] = -cosx * sinz + sinx * siny * cosz;
    m[ 2] = sinx * sinz + cosx * siny * cosz;

    m[ 4] = cosy * sinz;
    m[ 5] = cosx * cosz + sinx * siny * sinz;
    m[ 6] = -sinx * cosz + cosx * siny * sinz;

    m[ 8] = -siny;
    m[ 9] = sinx * cosy;
    m[10] = cosx * cosy;


    return this;
};

Matrix44.prototype.rotateOnAxis = function(rot,x,y,z){
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.sqrt(x * x + y * y + z * z) < 0.0001) {
        return null;
    }

    var m = this.m;

    var s, c, t;
    var a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;


    len = 1 / len;

    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rot);
    c = Math.cos(rot);
    t = 1 - c;

    a00 = a11 = a22 = 1;
    a01 = a02 = a03 = a10 = a12 = a13 = a20 = a21 = a23 = 0;

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    m[0 ] = a00 * b00 + a10 * b01 + a20 * b02;
    m[1 ] = a01 * b00 + a11 * b01 + a21 * b02;
    m[2 ] = a02 * b00 + a12 * b01 + a22 * b02;
    m[3 ] = a03 * b00 + a13 * b01 + a23 * b02;
    m[4 ] = a00 * b10 + a10 * b11 + a20 * b12;
    m[5 ] = a01 * b10 + a11 * b11 + a21 * b12;
    m[6 ] = a02 * b10 + a12 * b11 + a22 * b12;
    m[7 ] = a03 * b10 + a13 * b11 + a23 * b12;
    m[8 ] = a00 * b20 + a10 * b21 + a20 * b22;
    m[9 ] = a01 * b20 + a11 * b21 + a21 * b22;
    m[10] = a02 * b20 + a12 * b21 + a22 * b22;
    m[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
};

Matrix44.prototype.rotateOnB = function(u,v,w){
    var m = this.m;

    m[ 0] = u.x;
    m[ 1] = u.y;
    m[ 2] = u.z;

    m[ 4] = v.x;
    m[ 5] = v.y;
    m[ 6] = v.z;

    m[ 8] = w.x;
    m[ 9] = w.y;
    m[10] = w.z;

    return this;
};

Matrix44.createScale = function(sx, sy, sz, mat44){
    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    m[ 0] = sx;
    m[ 5] = sy;
    m[10] = sz;

    return mat44;
};

Matrix44.createTranslation = function(tx, ty, tz, mat44){
    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    m[12] = tx;
    m[13] = ty;
    m[14] = tz;

    return mat44;
};

Matrix44.createRotationX = function (a, mat44) {
    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    m[5] = cos;
    m[6] = -sin;
    m[9] = sin;
    m[10] = cos;

    return mat44;
};

Matrix44.createRotationY = function (a, mat44) {
    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    m[0] = cos;
    m[2] = sin;
    m[8] = -sin;
    m[10] = cos;

    return mat44;
};

Matrix44.createRotationZ = function (a, mat44) {
    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    m[0] = cos;
    m[1] = sin;
    m[4] = -sin;
    m[5] = cos;

    return mat44;
};

Matrix44.createRotation = function (ax, ay, az, mat44) {
    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    var cosx = Math.cos(ax),
        sinx = Math.sin(ax),
        cosy = Math.cos(ay),
        siny = Math.sin(ay),
        cosz = Math.cos(az),
        sinz = Math.sin(az);

    m[ 0] = cosy * cosz;
    m[ 1] = -cosx * sinz + sinx * siny * cosz;
    m[ 2] = sinx * sinz + cosx * siny * cosz;

    m[ 4] = cosy * sinz;
    m[ 5] = cosx * cosz + sinx * siny * sinz;
    m[ 6] = -sinx * cosz + cosx * siny * sinz;

    m[ 8] = -siny;
    m[ 9] = sinx * cosy;
    m[10] = cosx * cosy;


    return mat44;
};

Matrix44.createRotationOnAxis = function (rot, x, y, z, mat44) {
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.sqrt(x * x + y * y + z * z) < 0.0001) {
        return null;
    }

    mat44 = mat44 || new Matrix44();
    var m = mat44.m;

    var s, c, t;
    var a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;


    len = 1 / len;

    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rot);
    c = Math.cos(rot);
    t = 1 - c;

    a00 = a11 = a22 = 1;
    a01 = a02 = a03 = a10 = a12 = a13 = a20 = a21 = a23 = 0;

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    m[0 ] = a00 * b00 + a10 * b01 + a20 * b02;
    m[1 ] = a01 * b00 + a11 * b01 + a21 * b02;
    m[2 ] = a02 * b00 + a12 * b01 + a22 * b02;
    m[3 ] = a03 * b00 + a13 * b01 + a23 * b02;
    m[4 ] = a00 * b10 + a10 * b11 + a20 * b12;
    m[5 ] = a01 * b10 + a11 * b11 + a21 * b12;
    m[6 ] = a02 * b10 + a12 * b11 + a22 * b12;
    m[7 ] = a03 * b10 + a13 * b11 + a23 * b12;
    m[8 ] = a00 * b20 + a10 * b21 + a20 * b22;
    m[9 ] = a01 * b20 + a11 * b21 + a21 * b22;
    m[10] = a02 * b20 + a12 * b21 + a22 * b22;
    m[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return mat44;
};

Matrix44.createRotationOnB = function(u,v,w,m){
    if(m){
        m.identity();
    } else {
        m = new Matrix44();
    }

    var m_m = m.m;

    m_m[ 0] = u.x;
    m_m[ 1] = u.y;
    m_m[ 2] = u.z;

    m_m[ 4] = v.x;
    m_m[ 5] = v.y;
    m_m[ 6] = v.z;

    m_m[ 8] = w.x;
    m_m[ 9] = w.y;
    m_m[10] = w.z;

    return m;
};

function mult(m0,m1,m){
    m = m || new Matrix44();
    m0 = m0.m;
    m1 = m1.m;

    var m_m = m.m;

    var m000 = m0[ 0], m001 = m0[ 1], m002 = m0[ 2], m003 = m0[ 3],
        m004 = m0[ 4], m005 = m0[ 5], m006 = m0[ 6], m007 = m0[ 7],
        m008 = m0[ 8], m009 = m0[ 9], m010 = m0[10], m011 = m0[11],
        m012 = m0[12], m013 = m0[13], m014 = m0[14], m015 = m0[15];

    var m100 = m1[ 0], m101 = m1[ 1], m102 = m1[ 2], m103 = m1[ 3],
        m104 = m1[ 4], m105 = m1[ 5], m106 = m1[ 6], m107 = m1[ 7],
        m108 = m1[ 8], m109 = m1[ 9], m110 = m1[10], m111 = m1[11],
        m112 = m1[12], m113 = m1[13], m114 = m1[14], m115 = m1[15];

    m_m[ 0] = m000 * m100 + m001 * m104 + m002 * m108 + m003 * m112;
    m_m[ 1] = m000 * m101 + m001 * m105 + m002 * m109 + m003 * m113;
    m_m[ 2] = m000 * m102 + m001 * m106 + m002 * m110 + m003 * m114;
    m_m[ 3] = m000 * m103 + m001 * m107 + m002 * m111 + m003 * m115;

    m_m[ 4] = m004 * m100 + m005 * m104 + m006 * m108 + m007 * m112;
    m_m[ 5] = m004 * m101 + m005 * m105 + m006 * m109 + m007 * m113;
    m_m[ 6] = m004 * m102 + m005 * m106 + m006 * m110 + m007 * m114;
    m_m[ 7] = m004 * m103 + m005 * m107 + m006 * m111 + m007 * m115;

    m_m[ 8] = m008 * m100 + m009 * m104 + m010 * m108 + m011 * m112;
    m_m[ 9] = m008 * m101 + m009 * m105 + m010 * m109 + m011 * m113;
    m_m[10] = m008 * m102 + m009 * m106 + m010 * m110 + m011 * m114;
    m_m[11] = m008 * m103 + m009 * m107 + m010 * m111 + m011 * m115;

    m_m[12] = m012 * m100 + m013 * m104 + m014 * m108 + m015 * m112;
    m_m[13] = m012 * m101 + m013 * m105 + m014 * m109 + m015 * m113;
    m_m[14] = m012 * m102 + m013 * m106 + m014 * m110 + m015 * m114;
    m_m[15] = m012 * m103 + m013 * m107 + m014 * m111 + m015 * m115;

    return m;
}

Matrix44.prototype.mult = function(mat44) {
    var m0 = mat44;
    var m1 = this;
    m0 = m0.m;
    m1 = m1.m;
    var m = this.m;
    var m000 = m0[ 0], m001 = m0[ 1], m002 = m0[ 2], m003 = m0[ 3],
        m004 = m0[ 4], m005 = m0[ 5], m006 = m0[ 6], m007 = m0[ 7],
        m008 = m0[ 8], m009 = m0[ 9], m010 = m0[10], m011 = m0[11],
        m012 = m0[12], m013 = m0[13], m014 = m0[14], m015 = m0[15];
    var m100 = m1[ 0], m101 = m1[ 1], m102 = m1[ 2], m103 = m1[ 3],
        m104 = m1[ 4], m105 = m1[ 5], m106 = m1[ 6], m107 = m1[ 7],
        m108 = m1[ 8], m109 = m1[ 9], m110 = m1[10], m111 = m1[11],
        m112 = m1[12], m113 = m1[13], m114 = m1[14], m115 = m1[15];
    m[ 0] = m000 * m100 + m001 * m104 + m002 * m108 + m003 * m112;
    m[ 1] = m000 * m101 + m001 * m105 + m002 * m109 + m003 * m113;
    m[ 2] = m000 * m102 + m001 * m106 + m002 * m110 + m003 * m114;
    m[ 3] = m000 * m103 + m001 * m107 + m002 * m111 + m003 * m115;
    m[ 4] = m004 * m100 + m005 * m104 + m006 * m108 + m007 * m112;
    m[ 5] = m004 * m101 + m005 * m105 + m006 * m109 + m007 * m113;
    m[ 6] = m004 * m102 + m005 * m106 + m006 * m110 + m007 * m114;
    m[ 7] = m004 * m103 + m005 * m107 + m006 * m111 + m007 * m115;
    m[ 8] = m008 * m100 + m009 * m104 + m010 * m108 + m011 * m112;
    m[ 9] = m008 * m101 + m009 * m105 + m010 * m109 + m011 * m113;
    m[10] = m008 * m102 + m009 * m106 + m010 * m110 + m011 * m114;
    m[11] = m008 * m103 + m009 * m107 + m010 * m111 + m011 * m115;
    m[12] = m012 * m100 + m013 * m104 + m014 * m108 + m015 * m112;
    m[13] = m012 * m101 + m013 * m105 + m014 * m109 + m015 * m113;
    m[14] = m012 * m102 + m013 * m106 + m014 * m110 + m015 * m114;
    m[15] = m012 * m103 + m013 * m107 + m014 * m111 + m015 * m115;
    return this;
};


Matrix44.prototype.invert = function() {
    var m = this.m;
    var det;
    var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
        m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
        m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

    //TODO: add caching

    m[ 0] = m05 * m10 * m15 -
        m05 * m11 * m14 -
        m09 * m06 * m15 +
        m09 * m07 * m14 +
        m13 * m06 * m11 -
        m13 * m07 * m10;

    m[ 4] = -m04 * m10 * m15 +
        m04 * m11 * m14 +
        m08 * m06 * m15 -
        m08 * m07 * m14 -
        m12 * m06 * m11 +
        m12 * m07 * m10;

    m[ 8] = m04 * m09 * m15 -
        m04 * m11 * m13 -
        m08 * m05 * m15 +
        m08 * m07 * m13 +
        m12 * m05 * m11 -
        m12 * m07 * m09;

    m[12] = -m04 * m09 * m14 +
        m04 * m10 * m13 +
        m08 * m05 * m14 -
        m08 * m06 * m13 -
        m12 * m05 * m10 +
        m12 * m06 * m09;

    m[ 1] = -m01 * m10 * m15 +
        m01 * m11 * m14 +
        m09 * m02 * m15 -
        m09 * m03 * m14 -
        m13 * m02 * m11 +
        m13 * m03 * m10;

    m[ 5] = m00 * m10 * m15 -
        m00 * m11 * m14 -
        m08 * m02 * m15 +
        m08 * m03 * m14 +
        m12 * m02 * m11 -
        m12 * m03 * m10;

    m[ 9] = -m00 * m09 * m15 +
        m00 * m11 * m13 +
        m08 * m01 * m15 -
        m08 * m03 * m13 -
        m12 * m01 * m11 +
        m12 * m03 * m09;

    m[13] = m00 * m09 * m14 -
        m00 * m10 * m13 -
        m08 * m01 * m14 +
        m08 * m02 * m13 +
        m12 * m01 * m10 -
        m12 * m02 * m09;

    m[ 2] = m01 * m06 * m15 -
        m01 * m07 * m14 -
        m05 * m02 * m15 +
        m05 * m03 * m14 +
        m13 * m02 * m07 -
        m13 * m03 * m06;

    m[ 6] = -m00 * m06 * m15 +
        m00 * m07 * m14 +
        m04 * m02 * m15 -
        m04 * m03 * m14 -
        m12 * m02 * m07 +
        m12 * m03 * m06;

    m[10] = m00 * m05 * m15 -
        m00 * m07 * m13 -
        m04 * m01 * m15 +
        m04 * m03 * m13 +
        m12 * m01 * m07 -
        m12 * m03 * m05;

    m[14] = -m00 * m05 * m14 +
        m00 * m06 * m13 +
        m04 * m01 * m14 -
        m04 * m02 * m13 -
        m12 * m01 * m06 +
        m12 * m02 * m05;

    m[ 3] = -m01 * m06 * m11 +
        m01 * m07 * m10 +
        m05 * m02 * m11 -
        m05 * m03 * m10 -
        m09 * m02 * m07 +
        m09 * m03 * m06;

    m[ 7] = m00 * m06 * m11 -
        m00 * m07 * m10 -
        m04 * m02 * m11 +
        m04 * m03 * m10 +
        m08 * m02 * m07 -
        m08 * m03 * m06;

    m[11] = -m00 * m05 * m11 +
        m00 * m07 * m09 +
        m04 * m01 * m11 -
        m04 * m03 * m09 -
        m08 * m01 * m07 +
        m08 * m03 * m05;

    m[15] = m00 * m05 * m10 -
        m00 * m06 * m09 -
        m04 * m01 * m10 +
        m04 * m02 * m09 +
        m08 * m01 * m06 -
        m08 * m02 * m05;

    det = m00 * m[0] + m01 * m[4] + m02 * m[8] + m03 * m[12];

    if (det == 0) return null;

    det = 1.0 / det;

    m[ 0] *= det;
    m[ 1] *= det;
    m[ 2] *= det;
    m[ 3] *= det;
    m[ 4] *= det;
    m[ 5] *= det;
    m[ 6] *= det;
    m[ 7] *= det;
    m[ 8] *= det;
    m[ 9] *= det;
    m[10] *= det;
    m[11] *= det;
    m[12] *= det;
    m[13] *= det;
    m[14] *= det;
    m[15] *= det;

    return this;
};

Matrix44.prototype.transpose = function () {
    var m = this.m;
    var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
        m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
        m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
        m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

    //m[0 ] = m00;
    m[1 ] = m04;
    m[2 ] = m08;
    m[3 ] = m12;

    m[4 ] = m01;
    //m[5 ] = m05;
    m[6 ] = m09;
    m[7 ] = m13;

    m[8 ] = m02;
    m[9 ] = m06;
    //m[10] = m10;
    m[11] = m14;

    m[12] = m03;
    m[13] = m07;
    m[14] = m11;
    //m[15] = m15;

    return this;
};

Matrix44.prototype.toMat33 = function(matrix){
    matrix = matrix || new Matrix33();
    var m = matrix.m,
        m_= this.m;
    m[0]=m_[0];m[1]=m_[1];m[2]=m_[2];
    m[3]=m_[4];m[4]=m_[5];m[5]=m_[6];
    m[6]=m_[8];m[7]=m_[9];m[8]=m_[10];
    return matrix;
}

Matrix44.prototype.multVec3 = function(v) {
    var m = this.m;
    var x = v.x,
        y = v.y,
        z = v.z;

    v.x = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
    v.y = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
    v.z = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

    return v;
};

Matrix44.prototype.multVec3A = function (a, i) {
    var m = this.m;
    i *= 3;

    var x = a[i  ],
        y = a[i + 1],
        z = a[i + 2];

    a[i    ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
    a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
    a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
};

Matrix44.prototype.multVec3AI = function (a, i) {
    var m = this.m;
    var x = a[i    ],
        y = a[i + 1],
        z = a[i + 2];

    a[i  ]   = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
    a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
    a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
};

Matrix44.prototype.multVec3Arr = function(arr,offset){
    offset = offset || 0 - 1;

    var m = this.m;
    var m00 = m[ 0],
        m01 = m[ 1],
        m02 = m[ 2],
        m04 = m[ 4],
        m05 = m[ 5],
        m06 = m[ 6],
        m08 = m[ 8],
        m09 = m[ 9],
        m10 = m[10],
        m12 = m[12],
        m13 = m[13],
        m14 = m[14];

    var vec3, x, y,z;

    var l = arr.length;
    while(++offset < l){
        vec3 = arr[offset];
        x = vec3.x;
        y = vec3.y;
        z = vec3.z;

        vec3.x = m00 * x + m04 * y + m08 * z + m12;
        vec3.y = m01 * x + m05 * y + m09 * z + m13;
        vec3.z = m02 * x + m06 * y + m10 * z + m14;
    }
};

Matrix44.prototype.multVec3AArr = function(arr,offset){
    offset = offset || 0;

    var m = this.m;
    var m00 = m[ 0],
        m01 = m[ 1],
        m02 = m[ 2],
        m04 = m[ 4],
        m05 = m[ 5],
        m06 = m[ 6],
        m08 = m[ 8],
        m09 = m[ 9],
        m10 = m[10],
        m12 = m[12],
        m13 = m[13],
        m14 = m[14];

    var x, y, z;
    var l = arr.length;
    while(offset < l){
        x = arr[offset    ];
        y = arr[offset + 1];
        z = arr[offset + 2];

        arr[offset    ] = m00 * x + m04 * y + m08 * z + m12;
        arr[offset + 1] = m01 * x + m05 * y + m09 * z + m13;
        arr[offset + 2] = m02 * x + m06 * y + m10 * z + m14;

        offset += 3;
    }
};

Matrix44.prototype.multVec4 = function (v) {
    var m = this.m;
    var x = v.x,
        y = v.y,
        z = v.z,
        w = v.w;

    v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
    v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
    v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
    v[3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    return v;
};

Matrix44.prototype.multVec4A = function (a, i) {
    var m = this.m;
    i *= 3;

    var x = a[i  ],
        y = a[i + 1],
        z = a[i + 2],
        w = a[i + 3];

    a[i    ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
    a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
    a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
    a[i + 3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;
};

Matrix44.prototype.multVec4AI = function (a, i) {
    var m = this.m;
    var x = a[i  ],
        y = a[i + 1],
        z = a[i + 2],
        w = a[i + 3];

    a[i    ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
    a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
    a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
    a[i + 3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;
};


Matrix44.prototype.multiplied = function(mat44,matOut){
    matOut = matOut || new Matrix44();
    return matOut.set(mat44).mult(this);
};

Matrix44.prototype.inverted = function(matOut){
    matOut = matOut || new Matrix44();
    return matOut.set(this).invert();
};

Matrix44.prototype.transposed = function(matOut){
    matOut = matOut || new Matrix44();
    return matOut.set(this).transpose();
};

Matrix44.prototype.toFloat32Array = function(arr){
    arr = arr || new Float32Array(16);
    arr.set(this.m);
    return arr;
};


module.exports = Matrix44;