var fMath = require('./fMath'),
    Mat33 = require('./fMat33');

//for node debug
var Mat44 =
{
    make : function()
    {
        return new Float32Array([ 1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0, 0, 0, 1 ]);
    },

    set : function(m0,m1)
    {
        m0[ 0] = m1[ 0];
        m0[ 1] = m1[ 1];
        m0[ 2] = m1[ 2];
        m0[ 3] = m1[ 3];

        m0[ 4] = m1[ 4];
        m0[ 5] = m1[ 5];
        m0[ 6] = m1[ 6];
        m0[ 7] = m1[ 7];

        m0[ 8] = m1[ 8];
        m0[ 9] = m1[ 9];
        m0[10] = m1[10];
        m0[11] = m1[11];

        m0[12] = m1[12];
        m0[13] = m1[13];
        m0[14] = m1[14];
        m0[15] = m1[15];



        return m0;
    },

    identity : function(m)
    {
        m[ 0] = 1; m[ 1] = m[ 2] = m[ 3] = 0;
        m[ 5] = 1; m[ 4] = m[ 6] = m[ 7] = 0;
        m[10] = 1; m[ 8] = m[ 9] = m[11] = 0;
        m[15] = 1; m[12] = m[13] = m[14] = 0;

        return m;
    },

    copy : function(m)
    {
        return new Float32Array(m);
    },

    makeScale : function(sx,sy,sz,m)
    {
        m = m || this.make();

        m[0]  = sx;
        m[5]  = sy;
        m[10] = sz;

        return m;
    },

    makeTranslate : function(tx,ty,tz,m)
    {
        m = m || this.make();

        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        return m;
    },

    makeRotationX : function(a,m)
    {
        m = m || this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[5]  = cos;
        m[6]  = -sin;
        m[9]  = sin;
        m[10] = cos;

        return m;
    },

    makeRotationY : function(a,m)
    {
        m = m || this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[2] = sin;
        m[8] = -sin;
        m[10]= cos;

        return m;
    },

    makeRotationZ : function(a,m)
    {
        m = m || this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[1] = sin;
        m[4] = -sin;
        m[5] = cos;

        return m;
    },

    makeRotationXYZ : function(ax,ay,az,m)
    {
        m = m || this.make();

        var cosx = Math.cos(ax),
            sinx = Math.sin(ax),
            cosy = Math.cos(ay),
            siny = Math.sin(ay),
            cosz = Math.cos(az),
            sinz = Math.sin(az);

        m[ 0] =  cosy*cosz;
        m[ 1] = -cosx*sinz+sinx*siny*cosz;
        m[ 2] =  sinx*sinz+cosx*siny*cosz;

        m[ 4] =  cosy*sinz;
        m[ 5] =  cosx*cosz+sinx*siny*sinz;
        m[ 6] = -sinx*cosz+cosx*siny*sinz;

        m[ 8] = -siny;
        m[ 9] =  sinx*cosy;
        m[10] =  cosx*cosy;


        return m;
    },

    //temp from glMatrix
    makeRotationOnAxis : function(rot,x,y,z,out)
    {
        var len = Math.sqrt(x * x + y * y + z * z);

        if(Math.sqrt(x * x + y * y + z * z) < fMath.EPSILON) { return null; }

        var s, c, t,
            a00, a01, a02, a03,
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

        out = out || Mat44.make();

        a00 = 1; a01 = 0; a02 = 0; a03 = 0;
        a10 = 0; a11 = 1; a12 = 0; a13 = 0;
        a20 = 0; a21 = 0; a22 = 1; a23 = 0;

        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        out[0 ] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1 ] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2 ] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3 ] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4 ] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5 ] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6 ] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7 ] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8 ] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9 ] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return out;
},

    multPre : function(m0,m1,m)
    {
        m = m || this.make();

        var m000 = m0[ 0],m001 = m0[ 1],m002 = m0[ 2],m003 = m0[ 3],
            m004 = m0[ 4],m005 = m0[ 5],m006 = m0[ 6],m007 = m0[ 7],
            m008 = m0[ 8],m009 = m0[ 9],m010 = m0[10],m011 = m0[11],
            m012 = m0[12],m013 = m0[13],m014 = m0[14],m015 = m0[15];

        var m100 = m1[ 0],m101 = m1[ 1],m102 = m1[ 2],m103 = m1[ 3],
            m104 = m1[ 4],m105 = m1[ 5],m106 = m1[ 6],m107 = m1[ 7],
            m108 = m1[ 8],m109 = m1[ 9],m110 = m1[10],m111 = m1[11],
            m112 = m1[12],m113 = m1[13],m114 = m1[14],m115 = m1[15];

        m[ 0] = m000*m100 + m001*m104 + m002*m108 + m003*m112;
        m[ 1] = m000*m101 + m001*m105 + m002*m109 + m003*m113;
        m[ 2] = m000*m102 + m001*m106 + m002*m110 + m003*m114;
        m[ 3] = m000*m103 + m001*m107 + m002*m111 + m003*m115;

        m[ 4] = m004*m100 + m005*m104 + m006*m108 + m007*m112;
        m[ 5] = m004*m101 + m005*m105 + m006*m109 + m007*m113;
        m[ 6] = m004*m102 + m005*m106 + m006*m110 + m007*m114;
        m[ 7] = m004*m103 + m005*m107 + m006*m111 + m007*m115;

        m[ 8] = m008*m100 + m009*m104 + m010*m108 + m011*m112;
        m[ 9] = m008*m101 + m009*m105 + m010*m109 + m011*m113;
        m[10] = m008*m102 + m009*m106 + m010*m110 + m011*m114;
        m[11] = m008*m103 + m009*m107 + m010*m111 + m011*m115;

        m[12] = m012*m100 + m013*m104 + m014*m108 + m015*m112;
        m[13] = m012*m101 + m013*m105 + m014*m109 + m015*m113;
        m[14] = m012*m102 + m013*m106 + m014*m110 + m015*m114;
        m[15] = m012*m103 + m013*m107 + m014*m111 + m015*m115;




        return m;
    },

    mult : function(m0,m1,m)
    {
        return this.multPre(m0,m1,m);
    },

    multPost : function(m0,m1,m)
    {
        return this.multPre(m1,m0,m);
    },

    invert : function(m,o)
    {
        o = o || m;

        var det;

        var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
            m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
            m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
            m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

        //TODO: add caching

        o[ 0] = m05 * m10 * m15 -
            m05 * m11 * m14 -
            m09 * m06 * m15 +
            m09 * m07 * m14 +
            m13 * m06 * m11 -
            m13 * m07 * m10;

        o[ 4] = -m04 * m10 * m15 +
            m04 * m11 * m14 +
            m08 * m06 * m15 -
            m08 * m07 * m14 -
            m12 * m06 * m11 +
            m12 * m07 * m10;

        o[ 8] = m04 * m09 * m15 -
            m04 * m11 * m13 -
            m08 * m05 * m15 +
            m08 * m07 * m13 +
            m12 * m05 * m11 -
            m12 * m07 * m09;

        o[12] = -m04 * m09 * m14 +
            m04 * m10 * m13 +
            m08 * m05 * m14 -
            m08 * m06 * m13 -
            m12 * m05 * m10 +
            m12 * m06 * m09;

        o[ 1] = -m01 * m10 * m15 +
            m01 * m11 * m14 +
            m09 * m02 * m15 -
            m09 * m03 * m14 -
            m13 * m02 * m11 +
            m13 * m03 * m10;

        o[ 5] = m00 * m10 * m15 -
            m00 * m11 * m14 -
            m08 * m02 * m15 +
            m08 * m03 * m14 +
            m12 * m02 * m11 -
            m12 * m03 * m10;

        o[ 9] = -m00 * m09 * m15 +
            m00 * m11 * m13 +
            m08 * m01 * m15 -
            m08 * m03 * m13 -
            m12 * m01 * m11 +
            m12 * m03 * m09;

        o[13] = m00 * m09 * m14 -
            m00 * m10 * m13 -
            m08 * m01 * m14 +
            m08 * m02 * m13 +
            m12 * m01 * m10 -
            m12 * m02 * m09;

        o[ 2] = m01 * m06 * m15 -
            m01 * m07 * m14 -
            m05 * m02 * m15 +
            m05 * m03 * m14 +
            m13 * m02 * m07 -
            m13 * m03 * m06;

        o[ 6] = -m00 * m06 * m15 +
            m00 * m07 * m14 +
            m04 * m02 * m15 -
            m04 * m03 * m14 -
            m12 * m02 * m07 +
            m12 * m03 * m06;

        o[10] = m00 * m05 * m15 -
            m00 * m07 * m13 -
            m04 * m01 * m15 +
            m04 * m03 * m13 +
            m12 * m01 * m07 -
            m12 * m03 * m05;

        o[14] = -m00 * m05 * m14 +
            m00 * m06 * m13 +
            m04 * m01 * m14 -
            m04 * m02 * m13 -
            m12 * m01 * m06 +
            m12 * m02 * m05;

        o[ 3] = -m01 * m06 * m11 +
            m01 * m07 * m10 +
            m05 * m02 * m11 -
            m05 * m03 * m10 -
            m09 * m02 * m07 +
            m09 * m03 * m06;

        o[ 7] = m00 * m06 * m11 -
            m00 * m07 * m10 -
            m04 * m02 * m11 +
            m04 * m03 * m10 +
            m08 * m02 * m07 -
            m08 * m03 * m06;

        o[11] = -m00 * m05 * m11 +
            m00 * m07 * m09 +
            m04 * m01 * m11 -
            m04 * m03 * m09 -
            m08 * m01 * m07 +
            m08 * m03 * m05;

        o[15] = m00 * m05 * m10 -
            m00 * m06 * m09 -
            m04 * m01 * m10 +
            m04 * m02 * m09 +
            m08 * m01 * m06 -
            m08 * m02 * m05;

        det = m00 * o[0] + m01 * o[4] + m02 * o[8] + m03 * o[12];

        if (det == 0) return null;

        det = 1.0 / det;

        o[ 0] *= det;
        o[ 1] *= det;
        o[ 2] *= det;
        o[ 3] *= det;
        o[ 4] *= det;
        o[ 5] *= det;
        o[ 6] *= det;
        o[ 7] *= det;
        o[ 8] *= det;
        o[ 9] *= det;
        o[10] *= det;
        o[11] *= det;
        o[12] *= det;
        o[13] *= det;
        o[14] *= det;
        o[15] *= det;

        return o;
    },


    inverted : function(m)
    {
        /*
        var inv = this.make();
        var det;

        var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
            m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
            m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
            m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

        inv[ 0] =  m05  * m10  * m15 -
                   m05  * m11  * m14 -
                   m09  * m06  * m15 +
                   m09  * m07  * m14 +
                   m13  * m06  * m11 -
                   m13  * m07  * m10;

        inv[ 4] = -m04  * m10  * m15 +
                   m04  * m11  * m14 +
                   m08  * m06  * m15 -
                   m08  * m07  * m14 -
                   m12  * m06  * m11 +
                   m12  * m07  * m10;

        inv[ 8] =  m04  * m09  * m15 -
                   m04  * m11  * m13 -
                   m08  * m05  * m15 +
                   m08  * m07  * m13 +
                   m12  * m05  * m11 -
                   m12  * m07  * m09;

        inv[12] = -m04  * m09  * m14 +
                   m04  * m10  * m13 +
                   m08  * m05  * m14 -
                   m08  * m06  * m13 -
                   m12  * m05  * m10 +
                   m12  * m06  * m09;

        inv[ 1] = -m01  * m10  * m15 +
                   m01  * m11  * m14 +
                   m09  * m02  * m15 -
                   m09  * m03  * m14 -
                   m13  * m02  * m11 +
                   m13  * m03  * m10;

        inv[ 5] =  m00  * m10  * m15 -
                   m00  * m11  * m14 -
                   m08  * m02  * m15 +
                   m08  * m03  * m14 +
                   m12  * m02  * m11 -
                   m12  * m03  * m10;

        inv[ 9] = -m00  * m09  * m15 +
                   m00  * m11  * m13 +
                   m08  * m01  * m15 -
                   m08  * m03  * m13 -
                   m12  * m01  * m11 +
                   m12  * m03  * m09;

        inv[13] =  m00  * m09  * m14 -
                   m00  * m10  * m13 -
                   m08  * m01  * m14 +
                   m08  * m02  * m13 +
                   m12  * m01  * m10 -
                   m12  * m02  * m09;

        inv[ 2] =  m01  * m06  * m15 -
                   m01  * m07  * m14 -
                   m05  * m02  * m15 +
                   m05  * m03  * m14 +
                   m13  * m02  * m07 -
                   m13  * m03  * m06;

        inv[ 6] = -m00  * m06  * m15 +
                   m00  * m07  * m14 +
                   m04  * m02  * m15 -
                   m04  * m03  * m14 -
                   m12  * m02  * m07 +
                   m12  * m03  * m06;

        inv[10] =  m00  * m05  * m15 -
                   m00  * m07  * m13 -
                   m04  * m01  * m15 +
                   m04  * m03  * m13 +
                   m12  * m01  * m07 -
                   m12  * m03  * m05;

        inv[14] = -m00  * m05  * m14 +
                   m00  * m06  * m13 +
                   m04  * m01  * m14 -
                   m04  * m02  * m13 -
                   m12  * m01  * m06 +
                   m12  * m02  * m05;

        inv[ 3] = -m01  * m06  * m11 +
                   m01  * m07  * m10 +
                   m05  * m02  * m11 -
                   m05  * m03  * m10 -
                   m09  * m02  * m07 +
                   m09  * m03  * m06;

        inv[ 7] =  m00  * m06  * m11 -
                   m00  * m07  * m10 -
                   m04  * m02  * m11 +
                   m04  * m03  * m10 +
                   m08  * m02  * m07 -
                   m08  * m03  * m06;

        inv[11] = -m00  * m05  * m11 +
                   m00  * m07  * m09 +
                   m04  * m01  * m11 -
                   m04  * m03  * m09 -
                   m08  * m01  * m07 +
                   m08  * m03  * m05;

        inv[15] =  m00  * m05  * m10 -
                   m00  * m06  * m09 -
                   m04  * m01  * m10 +
                   m04  * m02  * m09 +
                   m08  * m01  * m06 -
                   m08  * m02  * m05;

        det = m00 * inv[0] + m01 * inv[4] + m02 * inv[8] + m03 * inv[12];

        if(det == 0) return null;

        det = 1.0 / det;

        inv[ 0]*=det;
        inv[ 1]*=det;
        inv[ 2]*=det;
        inv[ 3]*=det;
        inv[ 4]*=det;
        inv[ 5]*=det;
        inv[ 6]*=det;
        inv[ 7]*=det;
        inv[ 8]*=det;
        inv[ 9]*=det;
        inv[10]*=det;
        inv[11]*=det;
        inv[12]*=det;
        inv[13]*=det;
        inv[14]*=det;
        inv[15]*=det;


        return inv;

        */

        return this.invert(this.copy(m));


    },

    transposed : function(m)
    {
        var mo = this.make();

        mo[0 ] = m[0 ];
        mo[1 ] = m[4 ];
        mo[2 ] = m[8 ];
        mo[3 ] = m[12];

        mo[4 ] = m[1 ];
        mo[5 ] = m[5 ];
        mo[6 ] = m[9 ];
        mo[7 ] = m[13];

        mo[8 ] = m[2 ];
        mo[9 ] = m[6 ];
        mo[10] = m[10];
        mo[11] = m[14];

        mo[12] = m[3 ];
        mo[13] = m[7 ];
        mo[14] = m[11];
        mo[15] = m[15];

        return mo;
    },

    toMat33Inversed : function(mat44,mat33)
    {
        var a00 = mat44[0], a01 = mat44[1], a02 = mat44[2];
        var a10 = mat44[4], a11 = mat44[5], a12 = mat44[6];
        var a20 = mat44[8], a21 = mat44[9], a22 = mat44[10];

        var b01 = a22*a11-a12*a21;
        var b11 = -a22*a10+a12*a20;
        var b21 = a21*a10-a11*a20;

        var d = a00*b01 + a01*b11 + a02*b21;
        if (!d) { return null; }
        var id = 1/d;


        if(!mat33) { mat33 = Mat33.make(); }

        mat33[0] = b01*id;
        mat33[1] = (-a22*a01 + a02*a21)*id;
        mat33[2] = (a12*a01 - a02*a11)*id;
        mat33[3] = b11*id;
        mat33[4] = (a22*a00 - a02*a20)*id;
        mat33[5] = (-a12*a00 + a02*a10)*id;
        mat33[6] = b21*id;
        mat33[7] = (-a21*a00 + a01*a20)*id;
        mat33[8] = (a11*a00 - a01*a10)*id;

        return mat33;


    },

    multVec3 : function(m,v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

        return v;
    },

    mutlVec3A : function(m,a,i)
    {
        i *= 3;

        var x = a[i  ],
            y = a[i+1],
            z = a[i+2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec3AI : function(m,a,i)
    {
        var x = a[i  ],
            y = a[i+1],
            z = a[i+2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec4 : function(m,v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        v[3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

        return v;


    },

    multVec4A : function(m,a,i)
    {
        i *= 3;

        var x = a[i  ],
            y = a[i+1],
            z = a[i+2],
            w = a[i+3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i+3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    multVec4AI : function(m,a,i)
    {
        var x = a[i  ],
            y = a[i+1],
            z = a[i+2],
            w = a[i+3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i+3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    isFloatEqual : function(m0,m1)
    {
        var i = -1;
        while(++i<16)
        {
            if(!fMath.isFloatEqual(m0[i],m1[i]))return false;
        }
        return true;

    },

    toString : function(m)
    {
        return '[' + m[ 0] + ', ' + m[ 1] + ', ' + m[ 2] + ', ' + m[ 3] + ',\n' +
            ' ' + m[ 4] + ', ' + m[ 5] + ', ' + m[ 6] + ', ' + m[ 7] + ',\n' +
            ' ' + m[ 8] + ', ' + m[ 9] + ', ' + m[10] + ', ' + m[11] + ',\n' +
            ' ' + m[12] + ', ' + m[13] + ', ' + m[14] + ', ' + m[15] + ']';
    }
};

module.exports = Mat44;