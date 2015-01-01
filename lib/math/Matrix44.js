var Matrix33 = require('./Matrix33');

/**
 *
 *  xx yx zx
 *
 *  ----------------------------------------
 *
 *  xx  yx  zx  0
 *  xy  yy  zy  0
 *  xz  yz  zz  0
 *  tx  zy  tz  1
 *
 *  ----------------------------------------
 *
 *  i,j entry
 *  i-th row and j-th column
 *
 *  m00 m01 m02 m03
 *  m10 m11 m12 m13
 *  m20 m21 m22 m23
 *  m30 m31 m32 m33
 *
 *  0,0  0,1  0,2  0,3
 *  1,0  1,1  1,2  1,3
 *  2,0  2,1  2,2  2,3
 *  3,0  3,1  3,2  3,3
 *
 */

/**
 *  4x4 Matrix representation.
 * @constructor
 */

function Matrix44() {
    /**
     * @member {Array} m - The underlying array
     */
    this.m = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1 ];
}

/**
 * Copies another matrix into the matrix.
 * @param matrix
 * @returns {Matrix44}
 */

Matrix44.prototype.set = function(matrix){
    var m = matrix.m;

    //     //1st           2nd             3rd             4th
    ///*0*/m[ 0] = m_[ 0]; m[ 1] = m_[ 1]; m[ 2] = m_[ 2]; m[ 3] = m_[ 3];
    ///*1*/m[ 4] = m_[ 4]; m[ 5] = m_[ 5]; m[ 6] = m_[ 6]; m[ 7] = m_[ 7];
    ///*2*/m[ 8] = m_[ 8]; m[ 9] = m_[ 9]; m[10] = m_[10]; m[11] = m_[11];
    ///*3*/m[12] = m_[12]; m[13] = m_[13]; m[14] = m_[14]; m[15] = m_[15];



    return this.setf(m[ 0],m[ 1],m[ 2],m[ 3],
                     m[ 4],m[ 5],m[ 6],m[ 7],
                     m[ 8],m[ 9],m[10],m[11],
                     m[12],m[13],m[14],m[15]);
};

/**
 * Sets the matrix from 16 components – row major
 * @param m00 - 1st row column 0
 * @param m01 - 1st row column 1
 * @param m02 - 1st row column 2
 * @param m03 - 1st row column 3
 * -------------------------
 * @param m10 - 2nd row column 0
 * @param m11 - 2nd row column 1
 * @param m12 - 2nd row column 2
 * @param m13 - 2nd row column 3
 * -------------------------
 * @param m20 - 3rd row column 0
 * @param m21 - 3rd row column 1
 * @param m22 - 3rd row column 2
 * @param m23 - 3rd row column 3
 * -------------------------
 * @param m30 - 4th row column 0
 * @param m31 - 4th row column 1
 * @param m32 - 4th row column 2
 * @param m33 - 4th row column 3
 * -------------------------
 * @returns {Matrix44}
 */

Matrix44.prototype.setf = function(m00,m01,m02,m03,
                                   m10,m11,m12,m13,
                                   m20,m21,m22,m23,
                                   m30,m31,m32,m33){
    var m = this.m;

    //          1st col      2nd col      3rd col      4th col
    /*1st row*/ m[ 0] = m00; m[ 1] = m01; m[ 2] = m02; m[ 3] = m03;
    /*2nd row*/ m[ 4] = m10; m[ 5] = m11; m[ 6] = m12; m[ 7] = m13;
    /*3rd row*/ m[ 8] = m20; m[ 9] = m21; m[10] = m22; m[11] = m23;
    /*4th row*/ m[12] = m30; m[13] = m31; m[14] = m32; m[15] = m33;
    return this;
};

Object.defineProperties(Matrix44.prototype,{
    //1st column
    /**
     * @member {Number} m00 - Convenience getter setter column 0 0
     */
    'm00' : { set : function(value){this.m[ 0] = value;}, get : function(){return this.m[ 0];}},
    /**
     * @member {Number} m01 - Convenience getter setter column 0 1
     */
    'm01' : { set : function(value){this.m[ 1] = value;}, get : function(){return this.m[ 1];}},
    /**
     * @member {Number} m02 - Convenience getter setter column 0 2
     */
    'm02' : { set : function(value){this.m[ 2] = value;}, get : function(){return this.m[ 2];}},
    /**
     * @member {Number} m03 - Convenience getter setter column 0 3
     */
    'm03' : { set : function(value){this.m[ 3] = value;}, get : function(){return this.m[ 3];}},

    //2nd column
    /**
     * @member {Number} m10 - Convenience getter setter column 1 0
     */
    'm10' : { set : function(value){this.m[ 4] = value;}, get : function(){return this.m[ 4];}},
    /**
     * @member {Number} m11 - Convenience getter setter column 1 1
     */
    'm11' : { set : function(value){this.m[ 5] = value;}, get : function(){return this.m[ 5];}},
    /**
     * @member {Number} m12 - Convenience getter setter column 1 2
     */
    'm12' : { set : function(value){this.m[ 6] = value;}, get : function(){return this.m[ 6];}},
    /**
     * @member {Number} m13 - Convenience getter setter column 1 3
     */
    'm13' : { set : function(value){this.m[ 7] = value;}, get : function(){return this.m[ 7];}},

    //3rd column
    /**
     * @member {Number} m20 - Convenience getter setter column 2 0
     */
    'm20' : { set : function(value){this.m[ 8] = value;}, get : function(){return this.m[ 8];}},
    /**
     * @member {Number} m21 - Convenience getter setter column 2 1
     */
    'm21' : { set : function(value){this.m[ 9] = value;}, get : function(){return this.m[ 9];}},
    /**
     * @member {Number} m22 - Convenience getter setter column 2 2
     */
    'm22' : { set : function(value){this.m[10] = value;}, get : function(){return this.m[10];}},
    /**
     * @member {Number} m23 - Convenience getter setter column 2 3
     */
    'm23' : { set : function(value){this.m[11] = value;}, get : function(){return this.m[11];}},

    //4th column
    /**
     * @member {Number} m30 - Convenience getter setter column 3 0
     */
    'm30' : { set : function(value){this.m[12] = value;}, get : function(){return this.m[12];}},
    /**
     * @member {Number} m00 - Convenience getter setter column 3 1
     */
    'm31' : { set : function(value){this.m[13] = value;}, get : function(){return this.m[13];}},
    /**
     * @member {Number} m00 - Convenience getter setter column 3 2
     */
    'm32' : { set : function(value){this.m[14] = value;}, get : function(){return this.m[14];}},
    /**
     * @member {Number} m00 - Convenience getter setter column 3 3
     */
    'm33' : { set : function(value){this.m[15] = value;}, get : function(){return this.m[15];}}
});


/**
 * Convenience method. Sets column data.
 * @param {Number} col
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w
 * @returns {Matrix44}
 */

Matrix44.prototype.setColumn = function(col,x,y,z,w){
    col *= 4;
    var m = this.m;

    m[col  ] = x;
    m[col+4] = y;
    m[col+8] = z;
    m[col+3] = w;
    return this;
};

/**
 * Convenience method. Sets row data.
 * @param {Number} row
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w
 * @returns {Matrix44}
 */

Matrix44.prototype.setRow = function(row,x,y,z,w){
    var m = this.m;
    m[row  ] = x;
    m[row+1] = y;
    m[row+2] = z;
    m[row+3] = w;
    return this;
};

/**
 * Convenience method. Sets data at index.
 * @param {Number} index
 * @param {Number} x
 * @returns {Matrix44}
 */

Matrix44.prototype.setIndex = function(index,x){
    this.m[index] = x;
    return this;
};

/**
 * Convenience method. Sets data at column and row.
 * @param {Number} col
 * @param {Number} row
 * @param {Number} x
 * @returns {Matrix44}
 */

Matrix44.prototype.setValue = function(col,row,x){
    this.m[this.getIndex(col,row)] = x;
    return this;
};



/**
 * Returns the data index of the specified column and row.
 * @param {Number} col
 * @param {Number} row
 * @returns {Number}
 */

Matrix44.prototype.getIndex = function(col,row){
    return col + row * 4;
};

/**
 * Returns an array of column data.
 * @param col
 * @param out
 * @returns {Array}
 */
Matrix44.prototype.getColumn = function(col,out){
    out = out || new Array(4);
    var m = this.m;

    out[0] = m[col   ];
    out[1] = m[col+ 4];
    out[2] = m[col+ 8];
    out[3] = m[col+12];

    return out;
};

/**
 * Returns a  copy of the matrix.
 * @returns {Matrix44}
 */

Matrix44.prototype.copy = function(out){
    return (out || new Matrix44()).set(this);
};


/**
 * Sets the matrix to identity matrix.
 * @returns {Matrix44}
 */

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

/**
 * Sets the axes scale values. Replaces previous values.
 * @param sx
 * @param sy
 * @param sz
 * @returns {Matrix44}
 */

Matrix44.prototype.scale = function(sx,sy,sz){
    var m = this.m;

    m[ 0] = sx;
    m[ 5] = sy;
    m[10] = sz;

    return this;
};

/**
 * Sets the axes translation values. Replaces previous values.
 * @param tx
 * @param ty
 * @param tz
 * @returns {Matrix44}
 */

Matrix44.prototype.translate = function(tx,ty,tz){
    var m = this.m;

    m[12] = tx;
    m[13] = ty;
    m[14] = tz;

    return this;
};

/**
 * Sets the x axes rotation. Replaces previous values.
 * @param a
 * @returns {Matrix44}
 */

Matrix44.prototype.rotateX = function(a){
    var m = this.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    // row 2
    m[5] = cos;
    m[6] = -sin;
    // row 3
    m[9] = sin;
    m[10] = cos;

    return this;
};

/**
 * Sets the y axes rotation. Replaces previous values.
 * @param a
 * @returns {Matrix44}
 */

Matrix44.prototype.rotateY = function(a){
    var m = this.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    // row 1
    m[0] = cos;
    m[2] = sin;
    // row 3
    m[8] = -sin;
    m[10] = cos;

    return this;
};

/**
 * Sets the z axes rotation. Replaces previous values.
 * @param a
 * @returns {Matrix44}
 */

Matrix44.prototype.rotateZ = function(a){
    var m = this.m;

    var sin = Math.sin(a),
        cos = Math.cos(a);

    // row 1
    m[0] = cos;
    m[1] = sin;
    // row 3
    m[4] = -sin;
    m[5] = cos;

    return this;
};

/**
 * Sets a rotation from axes rotations. Replaces previous values.
 * @param ax
 * @param ay
 * @param az
 * @returns {Matrix44}
 */

Matrix44.prototype.rotate = function(ax,ay,az){
    var m = this.m;

    var cosx = Math.cos(ax),
        sinx = Math.sin(ax),
        cosy = Math.cos(ay),
        siny = Math.sin(ay),
        cosz = Math.cos(az),
        sinz = Math.sin(az);

    // row 1
    m[ 0] = cosy * cosz;
    m[ 1] = -cosx * sinz + sinx * siny * cosz;
    m[ 2] = sinx * sinz + cosx * siny * cosz;

    // row 2
    m[ 4] = cosy * sinz;
    m[ 5] = cosx * cosz + sinx * siny * sinz;
    m[ 6] = -sinx * cosz + cosx * siny * sinz;

    // row3
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

/**
 * Returns a rotation matrix from an orthonormal basis
 * @param u
 * @param v
 * @param w
 * @param {Matrix44}[out] - Optional out
 * @returns {*}
 */

Matrix44.fromOnBAxes = function(u,v,w,out){
    out = out ? out.identity() : new Matrix44();
    var m = out.m;

    m[ 0] = u.x; m[ 1] = u.y; m[ 2] = u.z;
    m[ 4] = v.x; m[ 5] = v.y; m[ 6] = v.z;
    m[ 8] = w.x; m[ 9] = w.y; m[10] = w.z;

    return out;
};

/**
 * Returns a rotation matrix from an orthonormal bais
 * @param {OnB}onb
 * @param {Matrix44}[out] - Optional out
 * @returns {Matrix44}
 */

Matrix44.fromOnB = function(onb,out){
    return Matrix44.fromOnBAxes(onb.u,onb.v,onb.w,out);
};

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
    var m00 = m[ 0], m10 = m[ 1], m20 = m[ 2], m30 = m[ 3],
        m01 = m[ 4], m11 = m[ 5], m21 = m[ 6], m31 = m[ 7],
        m02 = m[ 8], m12 = m[ 9], m22 = m[10], m32 = m[11],
        m03 = m[12], m13 = m[13], m23 = m[14], m33 = m[15];

    //TODO: add caching

    m[ 0] = m11 * m22 * m33 -
        m11 * m32 * m23 -
        m12 * m21 * m33 +
        m12 * m31 * m23 +
        m13 * m21 * m32 -
        m13 * m31 * m22;

    m[ 4] = -m01 * m22 * m33 +
        m01 * m32 * m23 +
        m02 * m21 * m33 -
        m02 * m31 * m23 -
        m03 * m21 * m32 +
        m03 * m31 * m22;

    m[ 8] = m01 * m12 * m33 -
        m01 * m32 * m13 -
        m02 * m11 * m33 +
        m02 * m31 * m13 +
        m03 * m11 * m32 -
        m03 * m31 * m12;

    m[12] = -m01 * m12 * m23 +
        m01 * m22 * m13 +
        m02 * m11 * m23 -
        m02 * m21 * m13 -
        m03 * m11 * m22 +
        m03 * m21 * m12;

    m[ 1] = -m10 * m22 * m33 +
        m10 * m32 * m23 +
        m12 * m20 * m33 -
        m12 * m30 * m23 -
        m13 * m20 * m32 +
        m13 * m30 * m22;

    m[ 5] = m00 * m22 * m33 -
        m00 * m32 * m23 -
        m02 * m20 * m33 +
        m02 * m30 * m23 +
        m03 * m20 * m32 -
        m03 * m30 * m22;

    m[ 9] = -m00 * m12 * m33 +
        m00 * m32 * m13 +
        m02 * m10 * m33 -
        m02 * m30 * m13 -
        m03 * m10 * m32 +
        m03 * m30 * m12;

    m[13] = m00 * m12 * m23 -
        m00 * m22 * m13 -
        m02 * m10 * m23 +
        m02 * m20 * m13 +
        m03 * m10 * m22 -
        m03 * m20 * m12;

    m[ 2] = m10 * m21 * m33 -
        m10 * m31 * m23 -
        m11 * m20 * m33 +
        m11 * m30 * m23 +
        m13 * m20 * m31 -
        m13 * m30 * m21;

    m[ 6] = -m00 * m21 * m33 +
        m00 * m31 * m23 +
        m01 * m20 * m33 -
        m01 * m30 * m23 -
        m03 * m20 * m31 +
        m03 * m30 * m21;

    m[10] = m00 * m11 * m33 -
        m00 * m31 * m13 -
        m01 * m10 * m33 +
        m01 * m30 * m13 +
        m03 * m10 * m31 -
        m03 * m30 * m11;

    m[14] = -m00 * m11 * m23 +
        m00 * m21 * m13 +
        m01 * m10 * m23 -
        m01 * m20 * m13 -
        m03 * m10 * m21 +
        m03 * m20 * m11;

    m[ 3] = -m10 * m21 * m32 +
        m10 * m31 * m22 +
        m11 * m20 * m32 -
        m11 * m30 * m22 -
        m12 * m20 * m31 +
        m12 * m30 * m21;

    m[ 7] = m00 * m21 * m32 -
        m00 * m31 * m22 -
        m01 * m20 * m32 +
        m01 * m30 * m22 +
        m02 * m20 * m31 -
        m02 * m30 * m21;

    m[11] = -m00 * m11 * m32 +
        m00 * m31 * m12 +
        m01 * m10 * m32 -
        m01 * m30 * m12 -
        m02 * m10 * m31 +
        m02 * m30 * m11;

    m[15] = m00 * m11 * m22 -
        m00 * m21 * m12 -
        m01 * m10 * m22 +
        m01 * m20 * m12 +
        m02 * m10 * m21 -
        m02 * m20 * m11;

    det = m00 * m[0] + m10 * m[4] + m20 * m[8] + m30 * m[12];

    if (det == 0){
        return null;
    }

    det = 1.0 / det;

    m[ 0] *= det; m[ 1] *= det; m[ 2] *= det; m[ 3] *= det;
    m[ 4] *= det; m[ 5] *= det; m[ 6] *= det; m[ 7] *= det;
    m[ 8] *= det; m[ 9] *= det; m[10] *= det; m[11] *= det;
    m[12] *= det; m[13] *= det; m[14] *= det; m[15] *= det;

    return this;
};

Matrix44.prototype.transpose = function () {
    var m = this.m;
    var m10 = m[ 1], m20 = m[ 2], m30 = m[ 3],
        m01 = m[ 4], m21 = m[ 6], m31 = m[ 7],
        m02 = m[ 8], m12 = m[ 9], m32 = m[11],
        m03 = m[12], m13 = m[13], m23 = m[14];

    //1st row - keeping m00
    m[ 1] = m01; m[ 2] = m02; m[ 3] = m03;
    //2nd row - keeping m11
    m[ 4] = m10; m[ 6] = m12; m[ 7] = m13;
    //3rd row - keeping m22
    m[ 8] = m20; m[ 9] = m21; m[11] = m23;
    //4th row - keeping m33
    m[12] = m30; m[13] = m31; m[14] = m32;

    return this;
};

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

/**
 * Returns a multiplied copy of the matrix.
 * @param {Matrix44} matrix
 * @param {Matrix44} [out] - Optional out
 * @returns {Matrix44}
 */

Matrix44.prototype.multiplied = function(matrix,out){
    return (out || new Matrix44()).set(matrix).mult(this);
};

/**
 * Returns an inverted copy of the matrix.
 * @param {Matrix44} [out] - Optional out
 * @returns {Matrix44}
 */

Matrix44.prototype.inverted = function(out){
    return (out || new Matrix44()).set(this).invert();
};

/**
 * Returns a transposed copy of the matrix.
 * @param {Matrix44} [out] - Optional out
 * @returns {Matrix44}
 */

Matrix44.prototype.transposed = function(out){
    return (out || new Matrix44()).set(this).transpose();
};


/**
 * Returns the upper left 3x3 matrix of the matrix.
 * @param {Matrix33} [out] - Optional out
 * @returns {Matrix33}
 */

Matrix44.prototype.toMatrix33 = function(out){
    out = out || new Matrix33();
    var m = out.m,
        m_= this.m;
    m[0]=m_[0]; m[1]=m_[1]; m[2]=m_[2];
    m[3]=m_[4]; m[4]=m_[5]; m[5]=m_[6];
    m[6]=m_[8]; m[7]=m_[9]; m[8]=m_[10];
    return out;
};

/**
 * Returns a Float32array copy of the matrix.
 * @param {Float32Array} [out] - Optional out
 * @returns {Float32Array}
 */

Matrix44.prototype.toFloat32Array = function(out){
    out = out || new Float32Array(16);
    out.set(this.m);
    return out;
};

/**
 * Returns a new matrix from flat float32array data.
 * @param arr
 * @returns {Matrix44}
 */

Matrix44.fromFloat32Array = function(arr){
    var m = new Matrix44();
    m.m = arr;
    return m;
};

Matrix44.prototype.columnToString = function(col){
    var m = this.m;
    return m[col   ] + '\n' +
           m[col+ 4] + '\n' +
           m[col+ 8] + '\n' +
           m[col+14] + '\n';
};

Matrix44.prototype.rowToString = function(row){
    var m = this.m;
    return m[row] + ', ' + m[row+1] + ', ' + m[row+2] + ', ' + m[row+3];
};

/**
 * Returns a string representation of the matrix.
 * @returns {string}
 */

Matrix44.prototype.toString = function(){
    var m = this.m;
    return m[ 0] + ', ' + m[ 1] + ', ' + m[ 2] + ', ' + m[ 3] + '\n' +
           m[ 4] + ', ' + m[ 5] + ', ' + m[ 6] + ', ' + m[ 7] + '\n' +
           m[ 8] + ', ' + m[ 9] + ', ' + m[10] + ', ' + m[11] + '\n' +
           m[12] + ', ' + m[13] + ', ' + m[14] + ', ' + m[15];

};

module.exports = Matrix44;