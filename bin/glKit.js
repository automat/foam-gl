/**
 *
 * glKit.js - A WebGL toolbox
 *
 * glKit.js is available under the terms of the MIT license.  The full text of the
 * MIT license is included below.
 *
 * MIT License
 * ===========
 *
 * Copyright (c) 2012 Henryk Wollik. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var GLKit = GLKit || {};


GLKit.Math =
{
    PI          : Math.PI,
    HALF_PI     : Math.PI * 0.5,
    QUARTER_PI  : Math.PI * 0.25,
    TWO_PI      : Math.PI * 2,
    EPSILON     : 0.0001,

    lerp        : function(a,b,v){return (a*(1-v))+(b*v);},

    randomFloat : function()
    {
        var r;

        switch (arguments.length)
        {
            case 0: r = Math.random();break;
            case 1: r = Math.random() * arguments[0];break;
            case 2: r = arguments[0] + (arguments[1]-arguments[0]) * Math.random();break;
        }

        return r;
    },

    randomInteger : function()
    {
        var r;

        switch (arguments.length)
        {
            case 0: r = 0.5 + Math.random();break;
            case 1: r = 0.5 + Math.random()*arguments[0];break;
            case 2: r = arguments[0] + ( 1 + arguments[1] - arguments[0]) * Math.random();break;
        }

        return Math.floor(r);
    },

    constrain : function()
    {
        var r;

        switch (arguments.length)
        {
            case 2: arguments[0] = (arguments[0] > arguments[1]) ? arguments[1] : arguments[0];break;
            case 3: arguments[0] = (arguments[0] > arguments[2]) ? arguments[2] : (arguments[0] < arguments[1]) ? arguments[1] :arguments[0];break;
        }

        return arguments[0];
    },

    normalize             : function(value,start,end){return (value - start) / (end - start);},
    map                   : function(value,inStart,inEnd,outStart,outEnd){return outStart + (outEnd - outStart) * normalize(value,inStart,inEnd);},
    sin                   : function(value){return Math.sin(value);},
    cos                   : function(value){return Math.cos(value);},
    clamp                 : function(value,min,max){return Math.max(min,Math.min(max,value));},
    saw                   : function(n){return 2 * (n  - Math.floor(0.5 + n ));},
    tri                   : function(n){return 1-4*Math.abs(0.5-this.frac(0.5*n+0.25));},
    rect                  : function(n){var a = Math.abs(n);return (a > 0.5) ? 0 : (a == 0.5) ? 0.5 : (a < 0.5) ? 1 : -1;},
    frac                  : function(n){return n - Math.floor(n);},
    sgn                   : function(n){return n/Math.abs(n);},
    abs                   : function(n){return Math.abs(n);},
    min                   : function(n){return Math.min(n);},
    max                   : function(n){return Math.max(n);},
    atan                  : function(n){return Math.atan(n);},
    atan2                 : function(y,x){return Math.atan2(y,x);},
    round                 : function(n){return Math.round(n);},
    floor                 : function(n){return Math.floor(n);},
    tan                   : function(n){return Math.tan(n);},
    rad2deg               : function(radians){return radians * (180 / Math.PI);},
    deg2rad               : function(degree){return degree * (Math.PI / 180); },
    sqrt                  : function(value){return Math.sqrt(value);},
    GreatestCommonDivisor : function(a,b){return (b == 0) ? a : this.GreatestCommonDivisor(b, a % b);},
    isFloatEqual          : function(a,b){return (Math.abs(a-b)<this.EPSILON);},
    isPowerOfTwo          : function(a){return (a&(a-1))==0;},
    swap                  : function(a,b){var t = a;a = b; b = a;},
    pow                   : function(x,y){return Math.pow(x,y);},
    log                   : function(n){return Math.log(n);},
    cosh                  : function(n){return (Math.pow(Math.E,n) + Math.pow(Math.E,-n))*0.5;},
    exp                   : function(n){return Math.exp(n);},
    stepSmooth            : function(n){return n*n*(3-2*n);},
    stepSmoothSquared     : function(n){return this.stepSmooth(n) * this.stepSmooth(n);},
    stepSmoothInvSquared  : function(n){return 1-(1-this.stepSmooth(n))*(1-this.stepSmooth(n));},
    stepSmoothCubed       : function(n){return this.stepSmooth(n)*this.stepSmooth(n)*this.stepSmooth(n)*this.stepSmooth(n);},
    stepSmoothInvCubed    : function(n){return 1-(1-this.stepSmooth(n))*(1-this.stepSmooth(n))*(1-this.stepSmooth(n))*(1-this.stepSmooth(n));},
    stepSquared           : function(n){return n*n;},
    stepInvSquared        : function(n){return 1-(1-n)*(1-n);},
    stepCubed             : function(n){return n*n*n*n;},
    stepInvCubed          : function(n){return 1-(1-n)*(1-n)*(1-n)*(1-n);},
    catmullrom            : function(v,p0,p1,p2,p3){return 0.5 * ((2 * p1) + (-p0 + p2) * v + (2 * p0 - 5 * p1 + 4 * p2 - p3) * v * v + (-p0 + 3 * p1 - 3 * p2 + p3) * v * v *v);}
};

GLKit.Quaternion =
{
    make     : function(n,v){return new Float32Array([n, v[0],v[1],v[2]]);},
    make4f   : function(n,x,y,z){return new Float32Array([n,x,y,z]);},
    zero     : function(){return new Float32Array([0,0,0,0]);},
    set      : function(q0,q1)
    {
        q0[0] = q1[0];
        q0[1] = q1[1];
        q0[2] = q1[2];
        q0[3] = q1[3];
    },

    set4f    : function(q,n,x,y,z)
    {
        q[0] = n;
        q[1] = x;
        q[2] = y;
        q[3] = z;

    },

    copy     : function(q){return new Float32Array(q);},

    length   : function(q){var n = q[0],x = q[1],y = q[2],z = q[3]; return Math.sqrt(n*n+x*x+y*y+z*z);},
    vector   : function(q){return new Float32Array(q[1],q[2],q[3]);},
    scalar   : function(q){return q[0];},



    add : function(q0,q1)
    {
        q0[0] = q0[0] + q1[0];
        q0[1] = q0[1] + q1[1];
        q0[2] = q0[2] + q1[2];
        q0[3] = q0[3] + q1[3];
    },

    sub : function(q0,q1)
    {
        q0[0] = q0[0] - q1[0];
        q0[1] = q0[1] - q1[1];
        q0[2] = q0[2] - q1[2];
        q0[3] = q0[3] - q1[3];
    },

    scale : function(q,n)
    {
        q[0] *= n;
        q[1] *= n;
        q[2] *= n;
        q[3] *= n;
    },

    conjugate : function(q)
    {
        q[1]*=-1;
        q[2]*=-1;
        q[3]*=-1;
    },

    mult : function(q0,q1)
    {
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

    multVec : function(q,v)
    {
        var qn = q[0],
            qx = q[1],
            qy = q[2],
            qz = q[3];

        var x = v[0],
            y = v[1],
            z = v[2];

        q[0] = -(qx*x + qy*y + qz*z);
        q[1] = qn * x + qy * z - qz * y;
        q[2] = qn * y + qz * x - qx * z;
        q[3] = qn * z + qx * y - qy * x;
    },

    angle : function(q)
    {
        return 2 * acos(q[0]);
    },

    axis : function(q)
    {
        var x = q[0],
            y = q[1],
            z = q[2];

        var l = Math.sqrt(x*x + y*y + z*z);

        return l != 0 ? new Float32Array([x/l,y/l,z/l]) : new Float32Array([0,0,0]);
    },

    //TODO: INLINE ALL!!

    rotate : function(q0,q1)
    {
        this.set(q0,this.mult(this.mult(this.copy(q0),q1),
                    this.conjugate(this.copy(q0))));
    },

    rotateVec : function(q,v)
    {
        var t = this.zero();
        this.set(t,this.multVec(this.multVec(this.copy(q),v),this.conjugate(this.copy(q))));
    },

    fromAngles : function(ax,ay,az)
    {
        var q = this.zero();

        var cyaw,cpitch,croll,syaw,spitch,sroll;
        var cyawcpitch,syawspitch,cyawspitch,syawcpitch;

        cyaw   = Math.cos(az * 0.5);
        cpitch = Math.cos(ay * 0.5);
        croll  = Math.cos(ax * 0.5);
        syaw   = Math.sin(az * 0.5);
        spitch = Math.sin(ay * 0.5);
        sroll  = Math.sin(ax * 0.5);

        cyawcpitch = cyaw * cpitch;
        syawspitch = syaw * spitch;
        cyawspitch = cyaw * spitch;
        syawcpitch = syaw * cpitch;

        return new Float32Array([ cyawcpitch * croll + syawspitch * sroll,
                                  cyawcpitch * sroll - syawspitch * croll,
                                  cyawspitch * croll + syawcpitch * sroll,
                                  syawcpitch * croll - cyawspitch * sroll ]);

    },

    anglesFrom : function(q)
    {
        var qn = q[0],
            qx = q[1],
            qy = q[2],
            qz = q[3];

        var r11,r21,r31,r32,r33,r12,r13;
        var q00,q11,q22,q33;
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
        if(temp > 0.999999)
        {
            r12 = 2 * (qx * qy - qn * qz);
            r13 = 2 * (qx * qz - qn * qy);

            v[0] = 0.0;
            v[1] = (-(Math.PI * 0.5) *  r32 / temp);
            v[2] = Math.atan2(-r12,-r31*r13);
            return v;
        }

        v[0] = Math.atan2(r32,r33);
        v[1] = Math.asin(-31);
        v[2] = Math.atan2(r21,r11);
        return v;
   }
};
GLKit.Vec2 =
{
    SIZE : 2,

    make : function()
    {
        return new Float32Array([0,0]);
    }
};


GLKit.Vec3 =
{
    SIZE   : 3,
    ZERO   : function(){return new Float32Array([0,0,0])},
    AXIS_X : function(){return new Float32Array([1,0,0])},
    AXIS_Y : function(){return new Float32Array([0,1,0])},
    AXIS_Z : function(){return new Float32Array([0,0,1])},

    make : function(x,y,z)
    {
        return new Float32Array([ x || 0.0,
            y || 0.0,
            z || 0.0]);
    },

    set : function(v0,v1)
    {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];

        return v0;
    },

    set3f :  function(v,x,y,z)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    copy :  function(v)
    {
        return new Float32Array(v);
    },

    add : function(v0,v1)
    {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];

        return v0;
    },

    sub : function(v0,v1)
    {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];

        return v0;
    },

    scale : function(v,n)
    {
        v[0]*=n;
        v[1]*=n;
        v[2]*=n;

        return v;
    },

    dot : function(v0,v1)
    {
        return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
    },

    cross: function(v0,v1)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        return new Float32Array([y0 * z1 - y1 * z0,
                                 z0 * x1 - z1 * x0,
                                 x0 * y1 - x1 * y0]);
    },

    lerp : function(v0,v1,f)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2];

        v0[0] = x0 * (1.0 - f) + v1[0] * f;
        v0[1] = y0 * (1.0 - f) + v1[1] * f;
        v0[2] = z0 * (1.0 - f) + v1[2] * f;
    },

    lerp3f : function(v,x,y,z,f)
    {
        var vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = vx * (1.0 - f) + x * f;
        v[1] = vy * (1.0 - f) + y * f;
        v[2] = vz * (1.0 - f) + z * f;
    },


    length : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    lengthSq :  function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        return x*x+y*y+z*z;
    },

    normalize : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var l  = 1/Math.sqrt(x*x+y*y+z*z);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    distance : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    distance3f : function(v,x,y,z)
    {
        return Math.sqrt(v[0] * x + v[1] * y + v[2] * z);
    },

    distanceSq : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x*x+y*y+z*z;
    },

    distanceSq3f : function(v,x,y,z)
    {
        return v[0] * x + v[1] * y + v[2] * z;
    },

    limit : function(v,n)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x*x + y*y + z*z,
            lsq = n * n;

        if((dsq > lsq) && lsq > 0)
        {
            var nd = n/Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert : function(v)
    {
        v[0]*=-1;
        v[1]*=-1;
        v[2]*=-1;

        return v;
    },

    added  : function(v0,v1)
    {
        return this.add(this.copy(v0),v1);
    },

    subbed : function(v0,v1)
    {
        return this.sub(this.copy(v0),v1);
    },

    scaled : function(v,n)
    {
        return this.scale(this.copy(v),n);
    },

    normalized : function(v)
    {
        return this.normalize(this.copy(v));
    },

    toString : function(v)
    {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    }

};





//TODO:FINISH
GLKit.Vec4 =
{
    SIZE : 4,
    ZERO : new Float32Array([0,0,0,1.0]),

    make : function(x,y,z,w)
    {
        return new Float32Array([ x || 0.0,
            y || 0.0,
            z || 0.0,
            w || 1.0]);
    },

    fromVec3 : function(v)
    {
        return new Float32Array([ v[0], v[1], v[2] , 1.0]);
    },

    set : function(v0,v1)
    {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];
        v0[3] = v1[3];

        return v0;
    },

    set3f :  function(v,x,y,z)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    set4f : function(v,x,y,z,w)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;
        v[3] = w;

        return v;

    },

    copy :  function(v)
    {
        return new Float32Array(v);
    },

    add : function(v0,v1)
    {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];
        v0[3] += v1[3];

        return v0;
    },

    sub : function(v0,v1)
    {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];
        v0[3] -= v1[3];

        return v0;
    },

    scale : function(v,n)
    {
        v[0]*=n;
        v[1]*=n;
        v[2]*=n;
        v[3]*=n;

        return v;
    },

    dot : function(v0,v1)
    {
        return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
    },

    cross: function(v0,v1)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        return new Float32Array([y0*z1-y1*z0,z0*x1-z1*x0,x0*y1-x1*y0]);
    },

    slerp : function(v0,v1,f)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        var d = Math.max(-1.0,Math.min((x0*x1 + y0*y1 + z0*z1),1.0)),
            t = Math.acos(d) * f;

        var x = x0 - (x1 * d),
            y = y0 - (y1 * d),
            z = z0 - (z1 * d);

        var l = 1/Math.sqrt(x*x+y*y+z*z);

        x*=l;
        y*=l;
        z*=l;

        var ct = Math.cos(t),
            st = Math.sin(t);

        var xo = x0 * ct + x * st,
            yo = y0 * ct + y * st,
            zo = z0 * ct + z * st;

        return new Float32Array([xo,yo,zo]);
    },

    length : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        return Math.sqrt(x*x+y*y+z*z+w*w);
    },

    lengthSq :  function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        return x*x+y*y+z*z+w*w;
    },

    normalize : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        var l  = 1/Math.sqrt(x*x+y*y+z*z+w*w);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;
        v[3] *= l;

        return v;
    },

    distance : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    distanceSq : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x*x+y*y+z*z;
    },

    limit : function(v,n)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x*x + y*y + z*z,
            lsq = n * n;

        if((dsq > lsq) && lsq > 0)
        {
            var nd = n/Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert : function(v)
    {
        v[0]*=-1;
        v[1]*=-1;
        v[2]*=-1;

        return v;
    },

    added  : function(v0,v1)
    {
        return this.add(this.copy(v0),v1);
    },

    subbed : function(v0,v1)
    {
        return this.sub(this.copy(v0),v1);
    },

    scaled : function(v,n)
    {
        return this.scale(this.copy(v),n);
    },

    normalized : function(v)
    {
        return this.normalize(this.copy(v));
    },

    toString : function(v)
    {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    }

};
GLKit.Mat33 =
{
    make : function()
    {
        return new Float32Array([1,0,0,
                                 0,1,0,
                                 0,0,1]);
    },

    transpose : function(out,a)
    {

        if (out === a) {
            var a01 = a[1], a02 = a[2], a12 = a[5];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a01;
            out[5] = a[7];
            out[6] = a02;
            out[7] = a12;
        } else {
            out[0] = a[0];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a[1];
            out[4] = a[4];
            out[5] = a[7];
            out[6] = a[2];
            out[7] = a[5];
            out[8] = a[8];
        }

        return out;
    }

};
GLKit.Mat44 =
{
    make : function()
    {
        return new Float32Array([ 1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0, 0, 0, 1 ]);
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

    makeScale : function(sx,sy,sz)
    {
        var m = this.make();

        m[0]  = sx;
        m[5]  = sy;
        m[10] = sz;

        return m;
    },

    makeTranslate : function(tx,ty,tz)
    {
        var m = this.make();

        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        return m;
    },

    makeRotationX : function(a)
    {
        var m = this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[5]  = cos;
        m[6]  = -sin;
        m[9]  = sin;
        m[10] = cos;

        return m;
    },

    makeRotationY : function(a)
    {
        var m = this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[2] = sin;
        m[8] = -sin;
        m[10]= cos;

        return m;
    },

    makeRotationZ : function(a)
    {
        var m = this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[1] = sin;
        m[4] = -sin;
        m[5] = cos;

        return m;
    },

    makeRotationXYZ : function(ax,ay,az)
    {
        var m = this.make();

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
    makeRotationOnAxis : function(rot,x,y,z)
    {
        var len = Math.sqrt(x * x + y * y + z * z);

        if(Math.sqrt(x * x + y * y + z * z) < GLKit.Math.EPSILON) { return null; }

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

        var a   = GLKit.Mat44.make();
        var out = GLKit.Mat44.make();

        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];


        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return out;
},

    multPre : function(m0,m1)
    {
        var m = this.make();

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

    mult : function(m0,m1)
    {
        return this.multPre(m0,m1);
    },

    multPost : function(m0,m1)
    {
        return this.multPre(m1,m0);
    },

    inverted : function(m)
    {
        var inv = this.make();
        inv[0] =   m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15]
            + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        inv[4] =  -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] +
            m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        inv[8] =   m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15]
            + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] +
            m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        inv[1] =  -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] +
            m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        inv[5] =  m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15]
            + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15]
            - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14]
            + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15]
            + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15]
            - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15]
            + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14]
            - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11]
            - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11]
            + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11]
            - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10]
            + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
        var det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
        if( det == 0 )
        {
            return null;
        }
        det = 1.0 / det;
        var mo = this.make();
        for( var i=0; i<16; ++i )
        {
            mo[i] = inv[i] * det;
        }
        return mo;
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


        if(!mat33) { mat33 = GLKit.Mat33.make(); }

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

    multVec : function(m,v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

        return v;
    },

    isFloatEqual : function(m0,m1)
    {
        var i = -1;
        while(++i<16)
        {
            if(!isFloatEqual(m0[i],m1[i]))return false;
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
GLKit.Color =
{
    SIZE  : 4,

    BLACK : function(){return new Float32Array([0,0,0,1])},
    WHITE : function(){return new Float32Array([1,1,1,1])},
    RED   : function(){return new Float32Array([1,0,0,1])},
    GREEN : function(){return new Float32Array([0,1,0,1])},
    BLUE  : function(){return new Float32Array([0,0,1,1])},

    make : function(r,g,b,a){return new Float32Array([ r,g,b,a]);},
    copy : function(c){return this.make(c[0],c[1],c[2],c[3]);},

    set : function(c0,c1)
    {
        c0[0] = c1[0];
        c0[1] = c1[1];
        c0[2] = c1[2];
        c0[3] = c1[3];

        return c0;
    },

    set4f : function(c,r,g,b,a)
    {
        c[0] = r;
        c[1] = g;
        c[2] = b;
        c[3] = a;

        return c;
    },

    set3f : function(c,r,g,b)
    {
        c[0] = r;
        c[1] = g;
        c[2] = b;
        c[3] = 1.0;

        return c;
    },

    set2f : function(c,k,a)
    {
        c[0] = c[1] = c[2] = k;
        c[3] = a;

        return c;
    },

    set1f : function(c,k)
    {
        c[0] = c[1] = c[2] = k;
        c[3] = 1.0;

        return c;
    },

    set4i    : function(c,r,g,b,a){return this.set4f(c,r/255.0,g/255.0,b/255.0,a);},
    set3i    : function(c,r,g,b)  {return this.set3f(c,r/255.0,g/255.0,b/255.0);},
    set2i    : function(c,k,a)    {return this.set2f(c,k/255.0,a);},
    set1i    : function(c,k)      {return this.set1f(c,k/255.0);},
    toArray  : function(c)        {return c.toArray();},
    toString : function(c)        {return '['+c[0]+','+c[1]+','+c[2]+','+c[3]+']';},

    interpolated : function(c0,c1,f)
    {
        var c  = new Float32Array(4),
            fi = 1.0 - f;

        c[0] = c0[0] * fi + c1[0] * f;
        c[1] = c0[1] * fi + c1[1] * f;
        c[2] = c0[2] * fi + c1[2] * f;
        c[3] = c0[3] * fi + c1[3] * f;

        return c;
    }

};
GLKit.Util =
{
    toArray : function(float32Array){return Array.prototype.slice.call(float32Array);}
};
GLKit.ProgLoader =
{
    loadProgram : function(gl,vertexShader,fragmentShader)
    {
        var program = gl.createProgram();

        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program,gl.LINK_STATUS))
        {
            console.log("Could not link program.");
            gl.deleteProgram(program);
            program = null;
        }

        return program;
    }
};
GLKit.ShaderLoader =
{
    loadShaderFromString : function(gl,sourceString,type)
    {
        var shader = gl.createShader(type);

        gl.shaderSource(shader,sourceString);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
        {
            console.log("Could not compile shader of type: " + (type == gl.VERTEX_SHADER ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER') +'.');
            gl.deleteShader(shader);
            shader = null;
        }

        return shader;
    }
};
GLKit.ProgFragShader="precision mediump float;" + 

"varying vec4 vColor;" + 

"varying vec2 vVertexUV;" + 
"varying vec4 vVertexPosition;" + 
"varying vec4 vVertexColor;" + 
"varying vec3 vVertexNormal;" + 

"const int   MAX_LIGHTS = 8;" + 

"uniform float uUseLighting;" + 
"uniform float uUseMaterial;" + 

"uniform vec3     uAmbient;" + 

"struct Light" + 
"{" + 
"    vec3  position;" + 
"    vec3  ambient;" + 
"    vec3  diffuse;" + 
"    vec3  specular;" + 

"    vec4  halfVector;" + 
"    vec3  spotDirection;" + 
"    float spotExponent;" + 
"    float spotCutoff;" + 
"    float spotCosCutoff;" + 
"    float constantAttenuation;" + 
"    float linearAttenuation;" + 
"    float quadraticAttenuation;" + 
"};" + 

"struct Material" + 
"{" + 
"    vec4 emission;" + 
"    vec4 ambient;" + 
"    vec4 diffuse;" + 
"    vec4 specular;" + 

"    float shininess;" + 

"};" + 

"struct ColorComponent" + 
"{" + 
"    vec4 ambient;" + 
"    vec4 diffuse;" + 
"    vec4 specular;" + 
"    float shininess;" + 
"};" + 

"vec4 phongModel(vec4 position, vec3 normal, ColorComponent color, Light light)" + 
"{" + 
"   vec3  diff    = light.position - position.xyz;" + 

"   vec3 s        = normalize(diff);" + 
"   vec3 v        = normalize(-position.xyz);" + 
"   vec3 r        = reflect(-s, normal);" + 

"   float sDotN   = max(dot(s, normal), 0.0);" + 

"   float dist    = length(diff.xyz);" + 

"   float att     = 1.0 / (light.constantAttenuation +" + 
"                          light.linearAttenuation * dist +" + 
"                          light.quadraticAttenuation * dist * dist);" + 

"   vec3 ambient  = uAmbient * light.ambient * color.ambient.rgb;" + 
"   vec3 diffuse  = light.diffuse * color.diffuse.rgb * sDotN ;" + 
"   vec3 specular = ((sDotN > 0.0) ? light.specular * pow(max(dot(r, v), 0.0), color.shininess) : vec3(0.0));" + 


"   return vec4(ambient*att+ diffuse*att + specular*att,color.ambient.a);" + 
"}" + 


"uniform Light    uLights[8];" + 
"uniform Material uMaterial;" + 

"uniform mat3 uNormalMatrix;" + 

"void main()" + 
"{" + 
"    vec3 tVertexNormal     = (gl_FrontFacing ? -1.0 : 1.0) * normalize(uNormalMatrix * vVertexNormal);" + 

"    vec4 vertexColor = vVertexColor * (1.0-uUseMaterial);" + 

"    ColorComponent color  = ColorComponent(uMaterial.ambient   * uUseMaterial + vertexColor," + 
"                                           uMaterial.diffuse   * uUseMaterial + vertexColor," + 
"                                           uMaterial.specular  * uUseMaterial + vertexColor," + 
"                                           uMaterial.shininess * uUseMaterial + (1.0 - uUseMaterial));" + 

"    vec4 lightingColor = vec4(0,0,0,0);" + 

"    for(int i = 0;i < MAX_LIGHTS;i++)" + 
"    {" + 
"        lightingColor+=phongModel(vVertexPosition,tVertexNormal,color,uLights[i]);" + 
"    }" + 

"    gl_FragColor = uUseLighting * lightingColor + (1.0-uUseLighting) * vVertexColor;" + 
"}";
GLKit.ProgVertexShader=
"attribute vec3 aVertexPosition;" + 
"attribute vec3 aVertexNormal;" + 
"attribute vec4 aVertexColor;" + 
"attribute vec2 aVertexUV;" + 

"varying vec4 vVertexPosition;" + 
"varying vec3 vVertexNormal;" + 
"varying vec4 vVertexColor;" + 
"varying vec2 vVertexUV;" + 

"varying vec4 vColor;" + 

"uniform mat4 uModelViewMatrix;" + 
"uniform mat4 uProjectionMatrix;" + 

"uniform float uPointSize;" + 


"void main()" + 
"{" + 
"    vVertexPosition  = uModelViewMatrix * vec4(aVertexPosition,1.0);" + 
"    vVertexNormal    = aVertexNormal;" + 
"    vVertexColor     = aVertexColor;" + 
"    vVertexUV        = aVertexUV;" + 

"    gl_Position  = uProjectionMatrix * vVertexPosition;" + 
"    gl_PointSize = uPointSize;" + 
"}";
GLKit.MatGL =
{
    perspective : function(m,fov,aspect,near,far)
    {
        var f  = 1.0 / Math.tan(fov*0.5),
            nf = 1.0 / (near-far);

        m[0] = f / aspect;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = f;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (2 * far * near) * nf;
        m[15] = 0;

        return m;

    },

    frustum : function(m,left,right,bottom,top,near,far)
    {
        var rl = 1 / (right - left),
            tb = 1 / (top - bottom),
            nf = 1 / (near - far);


        m[ 0] = (near * 2) * rl;
        m[ 1] = 0;
        m[ 2] = 0;
        m[ 3] = 0;
        m[ 4] = 0;
        m[ 5] = (near * 2) * tb;
        m[ 6] = 0;
        m[ 7] = 0;
        m[ 8] = (right + left) * rl;
        m[ 9] = (top + bottom) * tb;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (far * near * 2) * nf;
        m[15] = 0;

        return m;
    },

    lookAt : function(m,eye,target,up)
    {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            targetx = target[0],
            tartety = target[1],
            targetz = target[2];

        if (Math.abs(eyex - targetx) < 0.000001 &&
            Math.abs(eyey - tartety) < 0.000001 &&
            Math.abs(eyez - targetz) < 0.000001) {
            return GLKit.Mat44.identity(m);
        }

        z0 = eyex - targetx;
        z1 = eyey - tartety;
        z2 = eyez - targetz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        m[ 0] = x0;
        m[ 1] = y0;
        m[ 2] = z0;
        m[ 3] = 0;
        m[ 4] = x1;
        m[ 5] = y1;
        m[ 6] = z1;
        m[ 7] = 0;
        m[ 8] = x2;
        m[ 9] = y2;
        m[10] = z2;
        m[11] = 0;
        m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        m[15] = 1;

        return m;
    }
};
GLKit.Material = function(ambient,diffuse,specular,shininess,emission)
{
    ambient   = ambient   || GLKit.Color.make(1.0,0.5,0.5,1.0);
    diffuse   = diffuse   || GLKit.Color.BLACK();
    specular  = specular  || GLKit.Color.BLACK();
    shininess = shininess || 10.0;
    emission  = emission  || GLKit.Color.BLACK;

    this.emission  = emission;
    this.ambient   = ambient;
    this.diffuse   = diffuse;
    this.specular  = specular;
    this.shininess = shininess;
};

GLKit.Material.prototype.setEmission   = function(color)  {this.emission = color;};
GLKit.Material.prototype.setEmission3f = function(r,g,b)  {this.emission[0] = r;this.emission[1] = g;this.emission[2] = b;};
GLKit.Material.prototype.setEmission4f = function(r,g,b,a){this.emission[0] = r;this.emission[1] = g;this.emission[2] = b;this.emission[3] = a;};

GLKit.Material.prototype.setAmbient   = function(color)  {this.ambient = color;};
GLKit.Material.prototype.setAmbient3f = function(r,g,b)  {this.ambient[0] = r;this.ambient[1] = g;this.ambient[2] = b;};
GLKit.Material.prototype.setAmbient4f = function(r,g,b,a){this.ambient[0] = r;this.ambient[1] = g;this.ambient[2] = b;this.ambient[3] = a;};

GLKit.Material.prototype.setDiffuse   = function(color)  {this.diffuse = color;};
GLKit.Material.prototype.setDiffuse3f = function(r,g,b)  {this.diffuse[0] = r;this.diffuse[1] = g;this.diffuse[2] = b;};
GLKit.Material.prototype.setDiffuse4f = function(r,g,b,a){this.diffuse[0] = r;this.diffuse[1] = g;this.diffuse[2] = b;this.diffuse[3] = a;};

GLKit.Material.prototype.setSpecular   = function(color)  {this.specular = color;};
GLKit.Material.prototype.setSpecular3f = function(r,g,b)  {this.specular[0] = r;this.specular[1] = g;this.specular[2] = b;};
GLKit.Material.prototype.setSpecular4f = function(r,g,b,a){this.specular[0] = r;this.specular[1] = g;this.specular[2] = b;this.specular[3] = a;};


GLKit.Material.prototype.getEmission  = function(){return GLKit.Color.copy(this.emission);};
GLKit.Material.prototype.getAmbient   = function(){return GLKit.Color.copy(this.ambient);};
GLKit.Material.prototype.getDiffuse   = function(){return GLKit.Color.copy(this.diffuse);};
GLKit.Material.prototype.getSpecular  = function(){return GLKit.Color.copy(this.specular);};
GLKit.Material.prototype.getShininess = function(){return this.shininess;};

GLKit.Light = function(id)
{
    this._id   = id;

    this.ambient  = new Float32Array([1,1,1]);
    this.diffuse  = new Float32Array([1,1,1]);
    this.specular = new Float32Array([1,1,1]);

    this.position             = GLKit.Vec3.ZERO();
    this.direction            = null;
    this.spotExponent         = null;
    this.spotCutOff           = null;

    this.constantAttentuation = 1.0;
    this.linearAttentuation   = 0;
    this.quadricAttentuation  = 0.01;
};


GLKit.Light.prototype.setAmbient     = function(color)  {this.ambient[0] = color[0];this.ambient[1] = color[1];this.ambient[2] = color[2];};
GLKit.Light.prototype.setAmbient3f   = function(r,g,b)  {this.ambient[0] = r;this.ambient[1] = g;this.ambient[2] = b;};

GLKit.Light.prototype.setDiffuse     = function(color)  {this.diffuse[0] = color[0];this.diffuse[1] = color[1];this.diffuse[2] = color[2];};
GLKit.Light.prototype.setDiffuse3f   = function(r,g,b)  {this.diffuse[0] = r;this.diffuse[1] = g;this.diffuse[2] = b;};

GLKit.Light.prototype.setSpecular    = function(color)  {this.specular[0] = color[0];this.specular[1] = color[1];this.specular[2] = color[2];};
GLKit.Light.prototype.setSpecular3f  = function(r,g,b)  {this.specular[0] = r;this.specular[1] = g;this.specular[2] = b;};

GLKit.Light.prototype.setPosition    = function(v)    {GLKit.Vec3.set(this.position,v);};
GLKit.Light.prototype.setPosition3f  = function(x,y,z){GLKit.Vec3.set3f(this.position,x,y,z);};

GLKit.Light.prototype.setDirection   = function(v)    {GLKit.Vec3.set(this.direction,v);};
GLKit.Light.prototype.setDirection3f = function(x,y,z){GLKit.Vec3.set3f(this.direction,x,y,z);};

GLKit.Light.prototype.lookAt         = function(position,target)
{
    this.setPosition(position);
    this.setDirection(GLKit.Vec3.normalize(GLKit.subbed(target,position)));
};

GLKit.Light.prototype.getId = function(){return this._id;};

//TODO: Add
/*---------------------------------------------------------------------------------------------------------*/

GLKit.PointLight =  function(id)
{
    GLKit.Light.call(this,arguments);
};

GLKit.PointLight.prototype = Object.create(GLKit.Light.prototype);

/*---------------------------------------------------------------------------------------------------------*/

GLKit.DirectionalLight =  function(id)
{
    GLKit.Light.call(this,arguments);
};

GLKit.DirectionalLight.prototype = Object.create(GLKit.Light.prototype);
GLKit.GL = function(gl)
{
    /*---------------------------------------------------------------------------------------------------------*/

    var _gl = this._gl = gl;

    this._progVertexShader = GLKit.ShaderLoader.loadShaderFromString(_gl,GLKit.ProgVertexShader,_gl.VERTEX_SHADER);
    this._progFragShader   = GLKit.ShaderLoader.loadShaderFromString(_gl,GLKit.ProgFragShader,  _gl.FRAGMENT_SHADER);

    var program = this._program = GLKit.ProgLoader.loadProgram(_gl,this._progVertexShader,this._progFragShader);

    _gl.useProgram(program);

    /*---------------------------------------------------------------------------------------------------------*/
    // Bind & enable shader attributes & uniforms
    /*---------------------------------------------------------------------------------------------------------*/

    this._aVertexPosition   = gl.getAttribLocation(program,'aVertexPosition');
    this._aVertexNormal     = gl.getAttribLocation(program,'aVertexNormal');
    this._aVertexColor      = gl.getAttribLocation(program,'aVertexColor');
    this._aVertexUV         = gl.getAttribLocation(program,'aVertexUV');

    this._uModelViewMatrix   = gl.getUniformLocation(program,'uModelViewMatrix');
    this._uProjectionMatrix  = gl.getUniformLocation(program,'uProjectionMatrix');
    this._uNormalMatrix      = gl.getUniformLocation(program,'uNormalMatrix');

    this._uPointSize         = gl.getUniformLocation(program,'uPointSize');


    this.LIGHT_0    = 0;
    this.LIGHT_1    = 1;
    this.LIGHT_2    = 2;
    this.LIGHT_3    = 3;
    this.LIGHT_4    = 4;
    this.LIGHT_5    = 5;
    this.LIGHT_6    = 6;
    this.LIGHT_7    = 7;
    this.MAX_LIGHTS = 8;

    this.MODEL_PHONG       = 0;
    this.MODEL_ANTISOPTRIC = 1;
    this.MODEL_FRESNEL     = 2;
    this.MODEL_BLINN       = 3;
    this.MODEL_FLAT        = 4;

    this._uUseLighting = gl.getUniformLocation(program,'uUseLighting');
    this._uUseMaterial = gl.getUniformLocation(program,'uUseMaterial');

    this._uAmbient     = gl.getUniformLocation(program,'uAmbient');

    var l = this.MAX_LIGHTS;

    //temp for debug

    var uLightPosition             = this._uLightPosition             = new Array(l),
        uLightAmbient              = this._uLightAmbient              = new Array(l),
        uLightDiffuse              = this._uLightDiffuse              = new Array(l),
        uLightSpecular             = this._uLightSpecular             = new Array(l),
        uLightAttenuationConstant  = this._uLightAttenuationConstant  = new Array(l),
        uLightAttenuationLinear    = this._uLightAttenuationLinear    = new Array(l),
        uLightAttenuationQuadratic = this._uLightAttenuationQuadratic = new Array(l);

    var light;

    var i = -1;
    while(++i < l)
    {
        light = 'uLights['+i+'].';


        uLightPosition[i]             = gl.getUniformLocation(program,light + 'position');
        uLightAmbient[i]              = gl.getUniformLocation(program,light + 'ambient');
        uLightDiffuse[i]              = gl.getUniformLocation(program,light + 'diffuse');
        uLightSpecular[i]             = gl.getUniformLocation(program,light + 'specular');

        uLightAttenuationConstant[i]  = gl.getUniformLocation(program,light + 'constantAttenuation');
        uLightAttenuationLinear[i]    = gl.getUniformLocation(program,light + 'linearAttenuation');
        uLightAttenuationQuadratic[i] = gl.getUniformLocation(program,light + 'quadraticAttenuation');

        _gl.uniform3fv(uLightPosition[i], new Float32Array([0,0,0]));
        _gl.uniform3fv(uLightAmbient[i],  new Float32Array([0,0,0]));
        _gl.uniform3fv(uLightDiffuse[i],  new Float32Array([0,0,0]));

        _gl.uniform1f(uLightAttenuationConstant[i], 1.0);
        _gl.uniform1f(uLightAttenuationLinear[i],   0.0);
        _gl.uniform1f(uLightAttenuationQuadratic[i],0.0);
   }

    this._uMaterialEmission  = _gl.getUniformLocation(program,'uMaterial.emission');
    this._uMaterialAmbient   = _gl.getUniformLocation(program,'uMaterial.ambient');
    this._uMaterialDiffuse   = _gl.getUniformLocation(program,'uMaterial.diffuse');
    this._uMaterialSpecular  = _gl.getUniformLocation(program,'uMaterial.specular');
    this._uMaterialShininess = _gl.getUniformLocation(program,'uMaterial.shininess');

    _gl.uniform4f(this._uMaterialEmission, 0.0,0.0,0.0,1.0);
    _gl.uniform4f(this._uMaterialAmbient,  1.0,0.5,0.5,1.0);
    _gl.uniform4f(this._uMaterialDiffuse,  0.0,0.0,0.0,1.0);
    _gl.uniform4f(this._uMaterialSpecular, 0.0,0.0,0.0,1.0);
    _gl.uniform1f(this._uMaterialShininess,10.0);

    _gl.uniform1f(this._uUseMaterial, 0.0);
    _gl.uniform1f(this._uUseLighting, 0.0);

    this._lightingMode = 0;

    _gl.uniform1f(this._uPointSize, 1.0);

    /*---------------------------------------------------------------------------------------------------------*/
    // Pre Bind ARRAY_BUFFER & ELEMENT_ARRAY_BUFFER
    /*---------------------------------------------------------------------------------------------------------*/

    this._abo  = _gl.createBuffer();
    this._eabo = _gl.createBuffer();

    _gl.bindBuffer(_gl.ARRAY_BUFFER,         this._abo);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this._eabo);

    _gl.enableVertexAttribArray(this._aVertexPosition);
    _gl.enableVertexAttribArray(this._aVertexNormal);
    _gl.enableVertexAttribArray(this._aVertexColor);
    _gl.enableVertexAttribArray(this._aVertexUV);

    /*---------------------------------------------------------------------------------------------------------*/
    // Bind constants
    /*---------------------------------------------------------------------------------------------------------*/



    this.DEPTH_TEST               = _gl.DEPTH_TEST;

    this.SAMPLE_COVERAGE_VALUE    = _gl.SAMPLE_COVERAGE_VALUE;
    this.SAMPLE_COVERAGE_INVERT   = _gl.SAMPLE_COVERAGE_INVERT;
    this.SAMPLE_BUFFERS           = _gl.SAMPLE_BUFFERS;

    this.POINTS                   = _gl.POINTS;
    this.LINES                    = _gl.LINES;
    this.LINE_LOOP                = _gl.LINE_LOOP;
    this.LINE_STRIP               = _gl.LINE_STRIP;
    this.TRIANGLES                = _gl.TRIANGLES;
    this.TRIANGLE_FAN             = _gl.TRIANGLE_FAN;
    this.TRIANGLE_STRIP           = _gl.TRIANGLE_STRIP;

    this.BLEND                    = _gl.BLEND;
    this.ZERO                     = _gl.ZERO;
    this.ONE                      = _gl.ONE;
    this.SRC_COLOR                = _gl.SRC_COLOR;
    this.DST_COLOR                = _gl.DST_COLOR;
    this.SRC_ALPHA                = _gl.SRC_ALPHA;
    this.DST_ALPHA                = _gl.DST_ALPHA;
    this.CONSTANT_ALPHA           = _gl.CONSTANT_ALPHA;
    this.ONE_MINUS_SRC_ALPHA      = _gl.ONE_MINUS_SRC_ALPHA;
    this.ONE_MINUS_DST_ALPHA      = _gl.ONE_MINUS_DST_ALPHA;
    this.ONE_MINUS_SRC_COLOR      = _gl.ONE_MINUS_SRC_COLOR;
    this.ONE_MINUS_DST_COLOR      = _gl.ONE_MINUS_DST_COLOR;
    this.ONE_MINUS_CONSTANT_COLOR = _gl.ONE_MINUS_CONSTANT_COLOR;
    this.ONE_MINUS_CONSTANT_ALPHA = _gl.ONE_MINUS_CONSTANT_ALPHA;
    this.FUNC_ADD                 = _gl.FUNC_ADD;
    this.FUNC_SUBTRACT            = _gl.FUNC_SUBTRACT;
    this.FUNC_REVERSVE_SUBTRACT   = _gl.FUNC_REVERSE_SUBTRACT;

    var SIZE_OF_VERTEX  = GLKit.Vec3.SIZE,
        SIZE_OF_COLOR   = GLKit.Color.SIZE,
        SIZE_OF_UV      = GLKit.Vec2.SIZE;

    this.SIZE_OF_VERTEX = SIZE_OF_VERTEX;
    this.SIZE_OF_NORMAL = SIZE_OF_VERTEX;
    this.SIZE_OF_COLOR  = SIZE_OF_COLOR;
    this.SIZE_OF_UV     = SIZE_OF_UV;

    var SIZE_OF_FACE    = this.SIZE_OF_FACE   = SIZE_OF_VERTEX;

    var SIZE_OF_QUAD     = this.SIZE_OF_QUAD     = SIZE_OF_VERTEX * 4,
        SIZE_OF_TRIANGLE = this.SIZE_OF_TRIANGLE = SIZE_OF_VERTEX * 3,
        SIZE_OF_LINE     = this.SIZE_OF_LINE     = SIZE_OF_VERTEX * 2,
        SIZE_OF_POINT    = this.SIZE_OF_POINT    = SIZE_OF_VERTEX;

    var ELLIPSE_DETAIL_MAX = this.ELLIPSE_DETAIL_MAX = 30;

    /*---------------------------------------------------------------------------------------------------------*/
    // Bind methods
    /*---------------------------------------------------------------------------------------------------------*/

    this.sampleCoverage        = _gl.sampleCoverage.bind(_gl);

    this.blendFunc             = _gl.blendFunc.bind(_gl);
    this.blendFuncSeparate     = _gl.blendFuncSeparate.bind(_gl);
    this.blendEquation         = _gl.blendEquation.bind(_gl);
    this.blendEquationSeparate = _gl.blendEquationSeparate.bind(_gl);
    this.blendColor            = _gl.blendColor.bind(_gl);

    this.viewport              = _gl.viewport.bind(_gl);
    this.enable                = _gl.enable.bind(_gl);
    this.disable               = _gl.disable.bind(_gl);
    this.lineWidth             = _gl.lineWidth.bind(_gl);
    this.flush                 = _gl.flush.bind(_gl);
    this.finish                = _gl.finish.bind(_gl);
    this.scissor               = _gl.scissor.bind(_gl);

    this.uniform1f  = gl.uniform1f.bind(gl);
    this.uniform1fv = gl.uniform1fv.bind(gl);
    this.uniform1i  = gl.uniform1i.bind(gl);
    this.uniform1iv = gl.uniform1iv.bind(gl);


    /*---------------------------------------------------------------------------------------------------------*/
    // Init Buffers
    /*---------------------------------------------------------------------------------------------------------*/




    this._bColor4f   = GLKit.Color.copy(GLKit.Color.WHITE);
    this._bColorBg4f = GLKit.Color.copy(GLKit.Color.BLACK);

    this._bVertex   = null;
    this._bNormal   = null;
    this._bColor    = null;
    this._bTexCoord = null;
    this._bIndex    = null;

    this._bVertexPoint = new Float32Array(SIZE_OF_POINT);
    this._bColorPoint  = new Float32Array(SIZE_OF_COLOR);

    this._bVertexLine  = new Float32Array(SIZE_OF_LINE);
    this._bColorLine   = new Float32Array(2 * SIZE_OF_COLOR);

    this._bVertexTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bNormalTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bColorTriangle           = new Float32Array(3 * SIZE_OF_COLOR);
    this._bIndexTriangle           = new Uint16Array([0,1,2]);
    this._bTexCoordTriangleDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0]);
    this._bTexCoordTriangle        = new Float32Array(this._bTexCoordTriangleDefault.length);

    this._bVertexQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bNormalQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bColorQuad           = new Float32Array(4 * SIZE_OF_COLOR);
    this._bIndexQuad           = new Uint16Array([0,1,2,1,2,3]);
    this._bTexCoordQuadDefault = new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);
    this._bTexCoordQuad        = new Float32Array(this._bTexCoordQuadDefault.length);

    this._bVertexRect          = new Float32Array(SIZE_OF_QUAD);
    this._bNormalRect          = new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]);
    this._bColorRect           = new Float32Array(4 * SIZE_OF_COLOR);

    this._bVertexEllipse   = new Float32Array(SIZE_OF_VERTEX * ELLIPSE_DETAIL_MAX);
    this._bNormalEllipse   = new Float32Array(this._bVertexEllipse.length);
    this._bColorEllipse    = new Float32Array(SIZE_OF_COLOR  * ELLIPSE_DETAIL_MAX);
    this._bIndexEllipse    = new Uint16Array((this._bVertexEllipse.length * 0.5 - 2) * SIZE_OF_FACE);
    this._bTexCoordEllipse = new Float32Array(SIZE_OF_UV * ELLIPSE_DETAIL_MAX);


    this._bVertexCube = new Float32Array([-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5]);
    this._bColorCube  = new Float32Array(this._bVertexCube.length / SIZE_OF_VERTEX * SIZE_OF_COLOR);
    this._bNormalCube = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] );

    this._bIndexCube  = new Uint16Array([  0, 1, 2, 0, 2, 3,
                                           4, 5, 6, 4, 6, 7,
                                           8, 9,10, 8,10,11,
                                          12,13,14,12,14,15,
                                          16,17,18,16,18,19,
                                          20,21,22,20,22,23]);
    this._bTexCoordCube = null;

    this._sphereDetailLast = 10.0;

    this._bVertexSphere    = null;
    this._bNormalSphere    = null;
    this._bColorSphere     = null;
    this._bIndexSphere     = null;
    this._bTexCoordsSphere = null;




    this._bVertexCylinder    = null;
    this._bNormalCylinder    = null;
    this._bColorCylinder     = null;
    this._bIndexCylinder     = null;
    this._bTexCoordsCylinder = null;


    this._bScreenCoords = [0,0];
    this._bPoint0       = [0,0,0];
    this._bPoint1       = [0,0,0];

    this._axisX = GLKit.Vec3.AXIS_X();
    this._axisY = GLKit.Vec3.AXIS_Y();
    this._axisZ = GLKit.Vec3.AXIS_Z();

    this._lineBoxWidth  = 1;
    this._lineBoxHeight = 1;
    this._lineCylinderRadius = 0.5;

    this._genSphere(this._sphereDetailLast);

    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/


    this._bLighting = false;



    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/

    this._camera = null;

    this._mModelView   = GLKit.Mat44.make();
    this._mNormal      = GLKit.Mat33.make();
    this._mStack       = [];

    this._drawMode = this.LINES;

    /*---------------------------------------------------------------------------------------------------------*/
    // Init presets
    /*---------------------------------------------------------------------------------------------------------*/

    _gl.enable(_gl.BLEND);
    _gl.enable(_gl.DEPTH_TEST);

    this.ambient(GLKit.Color.BLACK());


};
/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.material = function(material)
{
    var gl = this._gl;

    //gl.uniform4fv(this._uMaterialEmission,  material.emission);
    gl.uniform4fv(this._uMaterialAmbient,   material.ambient);
    gl.uniform4fv(this._uMaterialDiffuse,   material.diffuse);
    gl.uniform4fv(this._uMaterialSpecular,  material.specular);
    gl.uniform1f( this._uMaterialShininess, material.shininess);
};

GLKit.GL.prototype.light = function(light)
{
    var id = light.getId(),
        gl = this._gl;

    var lightPosEyeSpace = GLKit.Mat44.multVec(this._camera.modelViewMatrix,GLKit.Vec3.copy(light.position));

    gl.uniform3fv(this._uLightPosition[id], lightPosEyeSpace);
    gl.uniform3fv(this._uLightAmbient[id],  light.ambient);
    gl.uniform3fv(this._uLightDiffuse[id],  light.diffuse);
    gl.uniform3fv(this._uLightSpecular[id], light.specular);

    gl.uniform1f(this._uLightAttenuationConstant[id],   light.constantAttentuation);
    gl.uniform1f(this._uLightAttenuationLinear[id],     light.linearAttentuation);
    gl.uniform1f(this._uLightAttenuationQuadratic[id],  light.quadricAttentuation);
};

GLKit.GL.prototype.lightingMode = function(mode){this._lightingMode = mode;};

GLKit.GL.prototype.useTexture  = function(bool){};
GLKit.GL.prototype.useMaterial = function(bool){this._gl.uniform1f(this._uUseMaterial,bool ? 1.0 : 0.0);};
GLKit.GL.prototype.useLighting = function(bool){this._gl.uniform1f(this._uUseLighting,bool ? 1.0 : 0.0);this._bLighting = bool;};
GLKit.GL.prototype.getLighting = function(){return this._bLighting;}

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.loadIdentity = function(){this._mModelView = GLKit.Mat44.identity(this._camera.modelViewMatrix);};
GLKit.GL.prototype.pushMatrix   = function(){this._mStack.push(GLKit.Mat44.copy(this._mModelView));};
GLKit.GL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw ('Invalid pop!');
    this._mModelView = stack.pop();

    return this._mModelView;
};

GLKit.GL.prototype._setMatricesUniform = function()
{
    var gl = this._gl;
    var camera = this._camera;

    gl.uniformMatrix4fv(this._uModelViewMatrix, false,this._mModelView);
    gl.uniformMatrix4fv(this._uProjectionMatrix,false,camera.projectionMatrix);


    if(!this._bLighting)return;

    GLKit.Mat44.toMat33Inversed(this._mModelView,this._mNormal);
    GLKit.Mat33.transpose(this._mNormal,this._mNormal);

    gl.uniformMatrix3fv(this._uNormalMatrix,false,this._mNormal);
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.translate     = function(v)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(v[0],v[1],v[2]));};
GLKit.GL.prototype.translate3f   = function(x,y,z)      {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(x,y,z));};
GLKit.GL.prototype.translateX    = function(x)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(x,0,0));};
GLKit.GL.prototype.translateY    = function(y)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(0,y,0));};
GLKit.GL.prototype.translateZ    = function(z)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeTranslate(0,0,z));};
GLKit.GL.prototype.scale         = function(v)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(v[0],v[1],v[2]));};
GLKit.GL.prototype.scale3f       = function(x,y,z)      {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(x,y,z));};
GLKit.GL.prototype.scaleX        = function(x)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(x,1,1));};
GLKit.GL.prototype.scaleY        = function(y)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(1,y,1));};
GLKit.GL.prototype.scaleZ        = function(z)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeScale(1,1,z));};
GLKit.GL.prototype.rotate        = function(v)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationXYZ(v[0],v[1],v[2]));};
GLKit.GL.prototype.rotate3f      = function(x,y,z)      {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationXYZ(x,y,z));};
GLKit.GL.prototype.rotateX       = function(x)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationX(x));};
GLKit.GL.prototype.rotateY       = function(y)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationY(y));};
GLKit.GL.prototype.rotateZ       = function(z)          {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationZ(z));};
GLKit.GL.prototype.rotateAxis    = function(angle,v)    {this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationOnAxis(angle,v[0],v[1],v[2]));};
GLKit.GL.prototype.rotateAxis3f  = function(angle,x,y,z){this._mModelView = GLKit.Mat44.multPost(this._mModelView,GLKit.Mat44.makeRotationOnAxis(angle,x,y,z));};

/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexUInt16Array,mode)
{
    mode = mode || this.TRIANGLES;
    this.fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this._setMatricesUniform();

    var gl = this._gl;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexUInt16Array,gl.DYNAMIC_DRAW);
    gl.drawElements(mode,indexUInt16Array.length,gl.UNSIGNED_SHORT,0);
};

GLKit.GL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{

    this.fillArrayBuffer(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this._setMatricesUniform();
    this._gl.drawArrays(mode,first,count);
};

GLKit.GL.prototype.drawGeometry = function(geom)
{
    this.drawElements(geom.vertices,geom.normals,geom.colors,geom.texCoords,geom.indices,this._drawMode);
};


/*---------------------------------------------------------------------------------------------------------*/


GLKit.GL.prototype.fillArrayBuffer = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array)
{

    var na  = normalFloat32Array ? true : false,
        uva = uvFloat32Array     ? true : false;

    var gl            = this._gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    var vblen   = vertexFloat32Array.byteLength,
        nblen   = na  ? normalFloat32Array.byteLength : 0,
        cblen   = colorFloat32Array.byteLength,
        uvablen = uva ? uvFloat32Array.byteLength : 0;

    var offsetV  = 0,
        offsetN  = offsetV + vblen,
        offsetC  = offsetN + nblen,
        offsetUV = offsetC + cblen;

    gl.bufferData(glArrayBuffer, vblen + nblen + cblen + uvablen, gl.DYNAMIC_DRAW);

    gl.bufferSubData(glArrayBuffer, offsetV,  vertexFloat32Array);
    gl.bufferSubData(glArrayBuffer, offsetN,  normalFloat32Array);
    gl.bufferSubData(glArrayBuffer, offsetC,  colorFloat32Array);
    gl.bufferSubData(glArrayBuffer, offsetUV, uvFloat32Array);

    var aVertexNormal = this._aVertexNormal,
        aVertexUV     = this._aVertexUV;

    if(!na) gl.disableVertexAttribArray(aVertexNormal); else gl.enableVertexAttribArray(aVertexNormal);
    if(!uva)gl.disableVertexAttribArray(aVertexUV);     else gl.enableVertexAttribArray(aVertexUV);

    gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);
    gl.vertexAttribPointer(aVertexNormal,         this.SIZE_OF_NORMAL, glFloat, false, 0, offsetN);
    gl.vertexAttribPointer(this._aVertexColor,    this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);
    gl.vertexAttribPointer(aVertexUV,             this.SIZE_OF_UV,     glFloat, false, 0, offsetUV);
};


GLKit.GL.prototype.fillColorBuffer = function(color,buffer)
{
    var i = 0;

    if(color.length == 4)
    {
        while(i < buffer.length)
        {
            buffer[i]  =color[0];
            buffer[i+1]=color[1];
            buffer[i+2]=color[2];
            buffer[i+3]=color[3];
            i+=4;
        }
    }
    else
    {
        if(color.length != buffer.length)
        {
            throw ("Color array length not equal to number of vertices.");
        }

        while(i < buffer.length)
        {
            buffer[i]   = color[i];
            buffer[i+1] = color[i+1];
            buffer[i+2] = color[i+2];
            buffer[i+3] = color[i+3];
            i+=4;
        }
    }

    return buffer;
};

GLKit.GL.prototype.fillVertexBuffer = function(vertices,buffer)
{
    if(vertices.length != buffer.length)throw ('Verices array has wrong length. Should be ' + buffer.length + '.');
    var i = -1;while(++i < buffer.length)buffer[i] = vertices[i];
    return buffer;
};



/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.ambient   = function(color){this._gl.uniform3f(this._uAmbient,color[0],color[1],color[2]);};
GLKit.GL.prototype.ambient3f = function(r,g,b){this._gl.uniform3f(this._uAmbient,r,g,b);};
GLKit.GL.prototype.ambient1f = function(k)    {this._gl.uniform1f(this._uAmbient,k);};

GLKit.GL.prototype.color   = function(color)  {this._bColor = GLKit.Color.set(this._bColor4f,color);};
GLKit.GL.prototype.color4f = function(r,g,b,a){this._bColor = GLKit.Color.set4f(this._bColor4f,r,g,b,a);};
GLKit.GL.prototype.color3f = function(r,g,b)  {this._bColor = GLKit.Color.set3f(this._bColor4f,r,g,b);};
GLKit.GL.prototype.color2f = function(k,a)    {this._bColor = GLKit.Color.set2f(this._bColor4f,k,a);};
GLKit.GL.prototype.color1f = function(k)      {this._bColor = GLKit.Color.set1f(this._bColor4f,k);};
GLKit.GL.prototype.colorfv = function(array)  {this._bColor = array;};

GLKit.GL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
GLKit.GL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
GLKit.GL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
GLKit.GL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
GLKit.GL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
GLKit.GL.prototype.clear4f   = function(r,g,b,a)
{
    var c  = GLKit.Color.set4f(this._bColorBg4f,r,g,b,a);
    var gl = this._gl;
    gl.clearColor(c[0],c[1],c[2],c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


GLKit.GL.prototype.getColorBuffer = function(){return this._bColor;};
GLKit.GL.prototype.getClearBuffer = function(){return this._bColorBg4f;};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.drawMode = function(mode){this._drawMode = mode;};
GLKit.GL.prototype.getDrawMode = function(){return this._drawMode;};

GLKit.GL.prototype.sphereDetail = function(detail)
{
    if(detail != this._sphereDetailLast)
    {
        this._genSphere(detail);
        this._sphereDetailLast = detail;
    }
};

GLKit.GL.prototype.pointSize = function(value){this._gl.uniform1f(this._uPointSize,value);};

//Temp
GLKit.GL.prototype.lineSize   = function(width,height){this._lineBoxWidth  = width;this._lineBoxHeight = height;};
GLKit.GL.prototype.lineRadius = function(radius){this._lineCylinderRadius = radius;};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype.point   = function(vector){this.drawArrays(vector,null,this.fillColorBuffer(this._bColor,this._bColorPoint),null,this.POINTS,0,1);};
GLKit.GL.prototype.point3f = function(x,y,z) {this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = z;this.point(this._bVertexPoint);};
GLKit.GL.prototype.point2f = function(x,y){this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;his._bVertexPoint[2] = 0;this.point(this._bVertexPoint);};
GLKit.GL.prototype.pointv  = function(arr){this._bVertexPoint[0] = arr[0];this._bVertexPoint[1] = arr[1];this._bVertexPoint[2] = arr[2];this.point(this._bVertexPoint);};


GLKit.GL.prototype.line  = function(vertices){this.drawArrays(this.fillVertexBuffer(vertices,this._bVertexLine),null,this.fillColorBuffer(this._bColor,this._bColorLine),null,this._drawMode,0, 2);};
GLKit.GL.prototype.linev = function(vertices)
{
    var v = new Float32Array(vertices),
        l = vertices.length / this.SIZE_OF_VERTEX;
    this.drawArrays(v,null,this.fillColorBuffer(this._bColor, new Float32Array(l*this.SIZE_OF_COLOR)),null,this._drawMode,0, l);
};

GLKit.GL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bVertexLine;

    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorLine),null,this._drawMode,0,2);
};

GLKit.GL.prototype.line2v = function(v0,v1)
{
    this.linef(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);
}

GLKit.GL.prototype.quadf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3)
{
    var v = this._bVertexQuad;

    v[ 0] = x0;v[ 1] = y0;v[ 2] = z0;
    v[ 3] = x1;v[ 4] = y1;v[ 5] = z1;
    v[ 6] = x2;v[ 7] = y2;v[ 8] = z2;
    v[ 9] = x3;v[10] = y3;v[11] = z3;

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorQuad),null,this._drawMode,0,4);
};

GLKit.GL.prototype.quad = function(vertices,normals,texCoords){this.drawArrays(this.fillVertexBuffer(vertices,this._bVertexQuad),normals,this.fillColorBuffer(this._bColor,this._bColorQuad),texCoords,this._drawMode,0,4);};

GLKit.GL.prototype.rect = function(width,height)
{
    var v = this._bVertexRect;

    v[0] = v[1] = v[2] = v[4] = v[5] = v[7] = v[9] = v[10] = 0;
    v[3] = v[6] = width; v[8] = v[11] = height;

    this.drawArrays(v,this._bNormalRect,this.fillColorBuffer(this._bColor,this._bColorRect),null,this._drawMode,0,4);
};

GLKit.GL.prototype.triangle = function(v0,v1,v2)
{
    var v = this._bVertexTriangle;
    v[0] = v0[0];v[1] = v0[1];v[2] = v0[2];
    v[3] = v1[0];v[4] = v1[1];v[5] = v1[2];
    v[6] = v2[0];v[7] = v2[1];v[8] = v2[2];

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);
};

GLKit.GL.prototype.trianglef = function(v0,v1,v2,v3,v4,v5,v6,v7,v8)
{
    var v = this._bVertexTriangle;
    v[0] = v0;v[1] = v0;v[2] = v2;
    v[3] = v3;v[4] = v4;v[5] = v5;
    v[6] = v6;v[7] = v7;v[8] = v8;

    this.drawArrays(v,null,this.fillColorBuffer(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);
};

GLKit.GL.prototype.trianglev = function(vertices,normals,texCoords){this.drawArrays(this.fillVertexBuffer(vertices,this._bVertexTriangle),normals,this.fillColorBuffer(this._bColor,this._bColorTriangle),texCoords,this._drawMode,0,3);}

GLKit.GL.prototype.box = function(width,height,depth)
{
    this.pushMatrix();
    this.scale3f(width,height,depth);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.fillColorBuffer(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();
};

GLKit.GL.prototype.cube = function(size)
{
    this.pushMatrix();
    this.scale3f(size,size,size);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.fillColorBuffer(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();
};

GLKit.GL.prototype.sphere = function()
{
    this.drawElements(this._bVertexSphere,this._bNormalSphere,this.fillColorBuffer(this._bColor,this._bColorSphere),this._bTexCoordsSphere,this._bIndexSphere,this._drawMode);
};





//Temp, change when math done!
GLKit.GL.prototype.lineBox = function(v0,v1){this.lineBoxf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

GLKit.GL.prototype.lineBoxf = function(x0,y0,z0,x1,y1,z1)
{
    var vec3 = GLKit.Vec3;

    var p0 = this._bPoint0,
        p1 = this._bPoint1,
        up = this._axisY;

    vec3.set3f(p0,x0,y0,z0);
    vec3.set3f(p1,x1,y1,z1);

    var len = vec3.distance(p0,p1),
        mid = vec3.scale(vec3.added(p0,p1),0.5),
        dir = vec3.normalize(vec3.subbed(p1,p0)),
        c   = vec3.dot(dir,up);

    var angle = Math.acos(c),
        axis  = vec3.normalize(vec3.cross(up,dir));

    this.pushMatrix();
    this.translate(mid);
    this.rotateAxis(angle,axis);
    this.box(this._lineBoxWidth,len,this._lineBoxHeight);
    this.popMatrix();
};


GLKit.GL.prototype.lineCylinder = function(v0,v1)
{

};





/*---------------------------------------------------------------------------------------------------------*/

GLKit.GL.prototype._genSphere = function(segments)
{
    var vertices  = [],
        normals   = [],
        texCoords = [],
        indices   = [];

    var theta,thetaSin,thetaCos;
    var phi,phiSin,phiCos;

    var x,y,z;
    var u,v;

    var i = -1,j;

    var index,
        indexVertices,
        indexNormals,
        indexTexCoords;

    while(++i <= segments)
    {
        theta = i * Math.PI / segments;
        thetaSin = Math.sin(theta);
        thetaCos = Math.cos(theta);

        j = -1;
        while(++j <= segments)
        {
            phi    = j * 2 * Math.PI / segments;
            phiSin = Math.sin(phi);
            phiCos = Math.cos(phi);

            x = phiCos * thetaSin;
            y = thetaCos;
            z = phiSin * thetaSin;

            index          = j + segments * i;
            indexVertices  = indexNormals = index * 3;
            indexTexCoords = index * 2;

            normals.push(x,y,z);
            vertices.push(x,y,z);

            u = 1 - j / segments;
            v = 1 - i / segments;

            texCoords.push(u,v);

        }


    }

    var index0,index1,index2;

    i = -1;
    while(++i < segments)
    {
        j = -1;
        while(++j < segments)
        {
            index0 = j + i * (segments + 1);
            index1 = index0 + segments + 1;
            index2 = index0 + 1;

            indices.push(index0,index1,index2);

            index2 = index0 + 1;
            index0 = index1;
            index1 = index0 + 1;

            indices.push(index0,index1,index2);
        }
    }

    this._bVertexSphere    = new Float32Array(vertices);
    this._bNormalSphere    = new Float32Array(normals);
    this._bColorSphere     = new Float32Array(segments * segments * 4);
    this._bTexCoordsSphere = new Float32Array(indices);
    this._bIndexSphere     = new Uint16Array(indices);
};

/*---------------------------------------------------------------------------------------------------------*/

//TODO: Fix me
GLKit.GL.prototype.getScreenCoord3f = function(x,y,z)
{
    var mpm = GLKit.Mat44.mult(this._camera.projectionMatrix,this._mModelView);
    var p3d = GLKit.Mat44.multVec(mpm,GLKit.Vec3.make(x,y,z));

    var bsc = this._bScreenCoords;
        bsc[0] = (((p3d[0] + 1) * 0.5) * window.innerWidth);
        bsc[1] = (((1 - p3d[1]) * 0.5) * window.innerHeight);

    return bsc;
};

GLKit.GL.prototype.getScreenCoord = function(v)
{
    return this.getScreenCoord3f(v[0],v[1],v[1]);
};


GLKit.GL.prototype.getGL     = function(){return this._gl;};

GLKit.GL.prototype.getModelViewMatrix  = function(){return this._mModelView;};
GLKit.GL.prototype.getProjectionMatrix = function(){return this._camera.projectionMatrix;};


GLKit.CameraBasic = function()
{
    this.position = GLKit.Vec3.make();
    this._target   = GLKit.Vec3.make();
    this._up       = GLKit.Vec3.AXIS_Y();

    this._fov  = 0;
    this._near = 0;
    this._far  = 0;

    this._aspectRatioLast = 0;

    this._modelViewMatrixUpdated  = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = GLKit.Mat44.make();
    this.modelViewMatrix  = GLKit.Mat44.make();
};

GLKit.CameraBasic.prototype.setPerspective = function(fov,windowAspectRatio,near,far)
{
    this._fov  = fov;
    this._near = near;
    this._far  = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};



GLKit.CameraBasic.prototype.setTarget         = function(v)    {GLKit.Vec3.set(this._target,v);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setTarget3f       = function(x,y,z){GLKit.Vec3.set3f(this._target,x,y,z);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setPosition       = function(v)    {GLKit.Vec3.set(this.position,v);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setPosition3f     = function(x,y,z){GLKit.Vec3.set3f(this.position,x,y,z);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setUp             = function(v)    {GLKit.Vec3.set(this._up,v);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setUp3f           = function(x,y,z){GLKit.Vec3.set3f(this._up,x,y,z);this._modelViewMatrixUpdated = false;};

GLKit.CameraBasic.prototype.setNear           = function(near)       {this._near = near;this._projectionMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setFar            = function(far)        {this._far  = far;this._projectionMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setFov            = function(fov)        {this._fov  = fov;this._projectionMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setAspectRatio    = function(aspectRatio){this._aspectRatioLast = aspectRatio;this._projectionMatrixUpdated = false;};

GLKit.CameraBasic.prototype.updateModelViewMatrix   = function(){if(this._modelViewMatrixUpdated)return; GLKit.MatGL.lookAt(this.modelViewMatrix,this.position,this._target,this._up); this._modelViewMatrixUpdated = true;};
GLKit.CameraBasic.prototype.updateProjectionMatrix = function(){if(this._projectionMatrixUpdated)return;GLKit.MatGL.perspective(this.projectionMatrix,this._fov,this._aspectRatioLast,this._near,this._far);this._projectionMatrixUpdated = true;};

GLKit.CameraBasic.prototype.updateMatrices = function(){this.updateModelViewMatrix();this.updateProjectionMatrix();};

GLKit.CameraBasic.prototype.toString = function(){return '{position= ' + GLKit.Vec3.toString(this.position) +
                                                          ', target= ' + GLKit.Vec3.toString(this._target) +
                                                          ', up= '     + GLKit.Vec3.toString(this._up) + '}'};



GLKit.GLUtil =
{

    drawGrid : function(gl,size,unit)
    {
        unit = unit || 1;

        var i  = -1,
            sh = size * 0.5 * unit;

        var ui;

        while(++i < size + 1)
        {
            ui = unit * i;

            gl.linef(-sh,0,-sh + ui,sh,0,-sh+ui);
            gl.linef(-sh+ui,0,-sh,-sh+ui,0,sh);
        }

    },

    drawGridCube : function(gl,size,unit)
    {
        unit = unit || 1;

        var sh  = size * 0.5 * unit,
            pih = Math.PI * 0.5;

        gl.pushMatrix();
        gl.translate3f(0,-sh,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,sh,0);
        gl.rotate3f(0,pih,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,-sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(-sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

    },


    drawAxes : function(gl,unit)
    {
        var b = gl.getLighting();

        gl.useLighting(false);

        gl.color3f(1,0,0);
        gl.linef(0,0,0,unit,0,0);
        gl.color3f(0,1,0);
        gl.linef(0,0,0,0,unit,0);
        gl.color3f(0,0,1);
        gl.linef(0,0,0,0,0,unit);

        gl.useLighting(b);
    },


    //temp
    drawVectorf : function(gl,x0,y0,z0,x1,y1,z1)
    {
        var vec3 = GLKit.Vec3;

        var p0 = gl._bPoint0,
            p1 = gl._bPoint1,
            up = gl._axisY;

        vec3.set3f(p0,x0,y0,z0);
        vec3.set3f(p1,x1,y1,z1);

        var pw = gl._lineBoxWidth,
            ph = gl._lineBoxHeight,
            pd = gl._drawMode;

        var len = vec3.distance(p0,p1),
            mid = vec3.scale(vec3.added(p0,p1),0.5),
            dir = vec3.normalize(vec3.subbed(p1,p0)),
            c   = vec3.dot(dir,up);

        var angle = Math.acos(c),
            axis  = vec3.normalize(vec3.cross(up,dir));


        gl.drawMode(gl.LINES);

        gl.linef(x0,y0,z0,x1,y1,z1);

        gl.drawMode(gl.TRIANGLES);
        gl.pushMatrix();
        gl.translate(p1);
        gl.rotateAxis(angle,axis);
        this.pyramid(gl,0.025);
        gl.popMatrix();

        gl.lineSize(pw,ph);
        gl.drawMode(pd);
    },

    drawVector : function(gl,v0,v1)
    {
       this.drawVectorf(gl,v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);
    },

    pyramid : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexPyramid,this.__bNormalPyramid,gl.fillColorBuffer(gl._bColor,this.__bColorPyramid),null,this.__bIndexPyramid,gl._drawMode);
        gl.popMatrix();
    },



    octahedron : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron,gl.fillColorBuffer(gl._bColor, this.__bColorOctahedron),null, this.__bIndexOctahedron,gl._drawMode);
        gl.popMatrix();
    }


};

GLKit.GLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
GLKit.GLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
GLKit.GLUtil.__bColorOctahedron  = new Float32Array(GLKit.GLUtil.__bVertexOctahedron.length / GLKit.Vec3.SIZE * GLKit.Color.SIZE);
GLKit.GLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);

GLKit.GLUtil.__bVertexPyramid = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
GLKit.GLUtil.__bNormalPyramid = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
GLKit.GLUtil.__bColorPyramid  = new Float32Array(GLKit.GLUtil.__bVertexPyramid.length / GLKit.Vec3.SIZE * GLKit.Color.SIZE);
GLKit.GLUtil.__bIndexPyramid  = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);

GLKit.Geom3d = function()
{
    this.vertices  = null;
    this.normals   = null;
    this.colors    = null;
    this.indices   = null;
    this.texCoords = null;
};

//TODO merge
GLKit.Geom3d.prototype.updateVertexNormals = function()
{
    var indices  = this.indices,
        vertices = this.vertices,
        normals  = this.normals;

    var i;
    var a, b, c;
    var e2x, e2y, e2z,
        e1x, e1y, e1z;

    var nx, ny, nz,
        vbx, vby, vbz,
        a0, a1, a2,
        b0, b1, b2,
        c0, c1, c2;

    i = 0;
    while( i < normals.length )
    {
        normals[i] = normals[i+1] = normals[i+2] = 0.0;
        i+=3;
    }

    i = 0;
    while( i < indices.length )
    {
        a = indices[i  ]*3;
        b = indices[i+1]*3;
        c = indices[i+2]*3;

        a0 = a;
        a1 = a+1;
        a2 = a+2;

        b0 = b;
        b1 = b+1;
        b2 = b+2;

        c0 = c;
        c1 = c+1;
        c2 = c+2;

        vbx = vertices[b0];
        vby = vertices[b1];
        vbz = vertices[b2];

        e1x = vertices[a0]-vbx;
        e1y = vertices[a1]-vby;
        e1z = vertices[a2]-vbz;

        e2x = vertices[c0]-vbx;
        e2y = vertices[c1]-vby;
        e2z = vertices[c2]-vbz;

        nx = e1y * e2z - e1z * e2y;
        ny = e1z * e2x - e1x * e2z;
        nz = e1x * e2y - e1y * e2x;

        normals[a0] += nx;
        normals[a1] += ny;
        normals[a2] += nz;

        normals[b0] += nx;
        normals[b1] += ny;
        normals[b2] += nz;

        normals[c0] += nx;
        normals[c1] += ny;
        normals[c2] += nz;

        i+=3;
    }

    var x, y, z, l, il;

    i = 0;
    while(i < normals.length)
    {

        x = normals[i  ];
        y = normals[i+1];
        z = normals[i+2];

        l = Math.sqrt(x*x+y*y+z*z);

        il = 1 / (l != 0 ? l : 1);

        normals[i  ] *= il;
        normals[i+1] *= il;
        normals[i+2] *= il;

        i+=3;
    }

};
GLKit.ParametricSurface = function(size)
{
    GLKit.Geom3d.apply(this,null);

    this.funcX = function(u,v,t){return u;};
    this.funcY = function(u,v,t){return 0;};
    this.funcZ = function(u,v,t){return v;};
    this.ur    = [-1,1];
    this.vr    = [-1,1];
    this.size  = null;

    this.setSize(size);

};

GLKit.ParametricSurface.prototype = Object.create(GLKit.Geom3d.prototype);

GLKit.ParametricSurface.prototype.setSize = function(size,unit)
{
    unit = unit || 1;

    this.size = size;

    var length  = size * size;

    this.vertices  = new Float32Array(length * GLKit.Vec3.SIZE);
    this.normals   = new Float32Array(length * GLKit.Vec3.SIZE);
    this.colors    = new Float32Array(length * GLKit.Color.SIZE);
    this.texCoords = new Float32Array(length * GLKit.Vec2.SIZE);

    var indices = [];

    var a, b, c, d;
    var i,j;

    i = -1;
    while(++i < size - 1)
    {
        j = -1;
        while(++j < size - 1)
        {
            a = j     + size * i;
            b = (j+1) + size * i;
            c = j     + size * (i+1);
            d = (j+1) + size * (i+1);

            indices.push(a,b,c);
            indices.push(b,d,c);
        }
    }

    this.indices = new Uint16Array(indices);

    this.updateVertexNormals();
};

GLKit.ParametricSurface.prototype.setFunctions = function(funcX,funcY,funcZ,vr,ur)
{
    this.funcX = funcX;
    this.funcY = funcY;
    this.funcZ = funcZ;
    this.vr   = vr;
    this.ur   = ur;
};

GLKit.ParametricSurface.prototype.applyFunctions = function()
{
    this.applyFunctionsWithTime(0);
};

//Override
GLKit.ParametricSurface.prototype.applyFunctionsWithTime = function(t)
{
    var size  = this.size;

    var funcX = this.funcX,
        funcY = this.funcY,
        funcZ = this.funcZ;

    var urLower = this.ur[0],
        urUpper = this.ur[1],
        vrLower = this.vr[0],
        vrUpper = this.vr[1];

    var i, j, u, v;

    var vertices = this.vertices;

    var index,indexVertices;

    var temp0 = urUpper - urLower,
        temp1 = vrUpper - vrLower,
        temp2 = size - 1;

    i = -1;
    while(++i < size)
    {
        j = -1;
        while(++j < size)
        {
            index = (j + size * i);
            indexVertices = index * 3;

            u = (urLower + temp0 * (j / temp2));
            v = (vrLower + temp1 * (i / temp2));

            vertices[indexVertices    ] = funcX(u,v,t);
            vertices[indexVertices + 1] = funcY(u,v,t);
            vertices[indexVertices + 2] = funcZ(u,v,t);
        }
    }
};

GLKit.ParametricSurface.prototype.pointOnSurface = function(u,v)
{
    return this.pointOnSurfaceWithTime(u,v,0);
}

GLKit.ParametricSurface.prototype.pointOnSurfaceWithTime = function(u,v,t)
{
    return GLKit.Vec3.make(this.funcX(u,v,t),
                           this.funcY(u,v,t),
                           this.funcZ(u,v,t));
};


GLKit.Mouse = function()
{
    this._position = GLKit.Vec2.make();
    document.addEventListener('mousemove',this._onMouseMove.bind(this));

    if(GLKit.Mouse._instance)throw 'fdsf';
    GLKit.Mouse._instance = this;

};

GLKit.Mouse.prototype._onMouseMove = function(e)
{
    this._position[0] = e.pageX;
    this._position[1] = e.pageY;
};

GLKit.Mouse.prototype.getPosition = function(){return this._position;};
GLKit.Mouse.prototype.getX        = function(){return this._position[0];};
GLKit.Mouse.prototype.getY        = function(){return this._position[1];};

GLKit.Mouse.getInstance = function(){return GLKit.Mouse._instance;};
GLKit.Window = function(parentDomElement)
{
    this._parent   = parentDomElement;

    this._glCanvas = document.createElement('canvas');
    this._glCanvas.setAttribute('tabindex','0');
    this._glCanvas.focus();
    this._gl       = this._glCanvas.getContext('webkit-3d');

    this._width  = 0;
    this._height = 0;

    this._parent.appendChild(this._glCanvas);
};

/*---------------------------------------------------------------------------------*/

GLKit.Window.prototype.getParent = function(){return this._parent;};
GLKit.Window.prototype.getCanvas = function(){return this._glCanvas;};
GLKit.Window.prototype.getGL     = function(){return this._gl};

/*---------------------------------------------------------------------------------*/

GLKit.Window.prototype.getAspectRatio = function(){return this._width/this._height;};

/*---------------------------------------------------------------------------------*/

GLKit.Window.prototype.setSize = function(width,height)
{
    this._width  = width;
    this._height = height;

    this._updateSize();
};

GLKit.Window.prototype._updateSize = function()
{
    var glCanvas = this._glCanvas,
        width    = this._width,
        height   = this._height;

        glCanvas.style.width  = width  + 'px';
        glCanvas.style.height = height + 'px';
        glCanvas.width        = width;
        glCanvas.height       = height;
};

GLKit.Window.prototype.setWidth  = function(width) {this._width = width;  this._updateSize();};
GLKit.Window.prototype.setHeight = function(height){this._height = height;this._updateSize();};

GLKit.Window.prototype.getHeight = function(){return this._height;};
GLKit.Window.prototype.getWidth  = function(){return this._width;};

GLKit.Window.prototype.isFullWindowFrame = function(){return this._width == window.innerWidth && this._height == window.innerHeight;};
GLKit.Window.prototype.isFullscreen      = function(){return false;};

/*---------------------------------------------------------------------------------*/
GLKit.Application = function(parentDomElement)
{
    var glWindow = this.glWindow = new GLKit.Window(parentDomElement);
    var gl       = this.gl       = new GLKit.GL(glWindow.getGL());
    var camera   = this.camera   = new GLKit.CameraBasic();

    /*---------------------------------------------------------------------------------*/

    gl.setCamera(camera);


    /*---------------------------------------------------------------------------------*/

    this._keyDown         = false;
    this._keyCode         = '';
    this._mouseDown       = false;
    this._mouseWheelDelta = 0.0;

    this.mouse = new GLKit.Mouse();

    this._update          = true;

    this._targetFPS = 60;
    this._frames    = 0;

    this._time;
    this._timeStart    = Date.now();
    this._timeNext     = Date.now();
    this._timeInterval = 1000/this._targetFPS;
    this._timeElapsed;
    this._timeDelta;



    /*---------------------------------------------------------------------------------*/

    this._initListeners();

    if(GLKit.Application._instance)throw 'fdfdf';
       GLKit.Application._instance = this;
};

GLKit.Application.prototype.setSize = function(width, height)
{
    var glWindow = this.glWindow;
        glWindow.setSize(width,height);

    this.camera.setPerspective(45.0,glWindow.getAspectRatio(),0.1,100.0);

    this._updateGLViewport();
    this._updateLoop();
};

GLKit.Application.prototype.setCamera = function(camera)
{
    this.camera = camera;
    this.gl.setCamera(camera);
};

/*---------------------------------------------------------------------------------*/


GLKit.Application.prototype._onWindowResize = function()
{
    this.onWindowResize();
    this.camera.setAspectRatio(this.glWindow.getAspectRatio());
    this.camera.updateProjectionMatrix();
    this._updateGLViewport();
};

GLKit.Application.prototype.onWindowResize = function(){};


GLKit.Application.prototype._updateGLViewport = function()
{
    var glWindow = this.glWindow,
        gl       = this.gl;
        gl.viewport(0,0,glWindow.getWidth(),glWindow.getHeight());
        gl.clearColor(gl.getClearBuffer());
};

/*---------------------------------------------------------------------------------*/

GLKit.Application.prototype.setUpdate = function(bool){this._update = bool;};

GLKit.Application.prototype._updateLoop = function()
{
    if(!this._update)return;
    webkitRequestAnimationFrame(this._updateLoop.bind(this),null);

    var time         = this._time      = Date.now(),
        timeDelta    = time - this._timeNext,
        timeInterval = this._timeInterval;

    this._timeDelta = timeDelta / timeInterval;

    var timeNext;

    if(timeDelta > timeInterval)
    {
        timeNext = this._timeNext = time - (timeDelta % timeInterval);

        this.update();

        this._timeElapsed = (timeNext - this._timeStart) / 1000.0;
        this._frames++;

    }
};



GLKit.Application.prototype.update = function(){};

GLKit.Application.prototype.getFramesElapsed  = function(){return this._frames;};
GLKit.Application.prototype.getSecondsElapsed = function(){return this._timeElapsed;};
GLKit.Application.prototype.getTime           = function(){return this._time;};
GLKit.Application.prototype.getTimeStart      = function(){return this._timeStart;};
GLKit.Application.prototype.getTimeNext       = function(){return this._timeNext;};
GLKit.Application.prototype.getTimeDelta      = function(){return this._timeDelta;};


GLKit.Application.prototype.setTargetFPS = function(fps){this._targetFPS = fps;this._timeInterval = 1000/this._targetFPS;};
GLKit.Application.prototype.getTargetFPS = function(){return this._targetFPS;};

/*---------------------------------------------------------------------------------*/

GLKit.Application.prototype._initListeners = function()
{
    var glCanvas = this.glWindow.getCanvas();
        glCanvas.addEventListener('mousedown', this._onGLCanvasMouseDown.bind(this));
        glCanvas.addEventListener('mouseup',   this._onGLCanvasMouseUp.bind(this));
        glCanvas.addEventListener('mousemove', this._onGLCanvasMouseMove.bind(this));
        glCanvas.addEventListener('keydown',   this._onGLCanvasKeyDown.bind(this));
        glCanvas.addEventListener('keyup',     this._onGLCanvasKeyUp.bind(this));
        glCanvas.addEventListener('mousewheel',this._onGLCanvasMouseWheel.bind(this));

    window.addEventListener('resize',this._onWindowResize.bind(this));
};


GLKit.Application.prototype._onGLCanvasKeyDown    = function(e){this._keyDown = true;this._keyCode = e.keyCode;this.onKeyDown(e)};
GLKit.Application.prototype._onGLCanvasKeyUp      = function(e){this._keyDown = false;this.onKeyUp(e)};
GLKit.Application.prototype._onGLCanvasMouseUp    = function(e){this._mouseDown = false;this.onMouseUp(e);};
GLKit.Application.prototype._onGLCanvasMouseDown  = function(e){this._mouseDown = true;this.onMouseDown(e);};
GLKit.Application.prototype._onGLCanvasMouseMove  = function(e){this.onMouseMove(e);};
GLKit.Application.prototype._onGLCanvasMouseWheel = function(e){this._mouseWheelDelta += Math.max(-1,Math.min(1, e.wheelDelta)) * -1;this.onMouseWheel(e);};
GLKit.Application.prototype.onKeyDown             = function(e){};
GLKit.Application.prototype.onKeyUp               = function(e){};
GLKit.Application.prototype.onMouseUp             = function(e){};
GLKit.Application.prototype.onMouseDown           = function(e){};
GLKit.Application.prototype.onMouseWheel          = function(e){};
GLKit.Application.prototype.onMouseMove           = function(e){};



GLKit.Application.prototype.isKeyDown          = function(){return this._keyDown;};
GLKit.Application.prototype.isMouseDown        = function(){return this._mouseDown;};
GLKit.Application.prototype.isMouseMove        = function(){};
GLKit.Application.prototype.getKeyCode         = function(){return this._keyCode;};
GLKit.Application.prototype.getMouseWheelDelta = function(){return this._mouseWheelDelta;}

/*---------------------------------------------------------------------------------*/

GLKit.Application.prototype.getAspectRatioWindow = function(){return this.glWindow.getAspectRatio();};

/*---------------------------------------------------------------------------------*/

GLKit.Application.getInstance = function(){return GLKit.Application._instance;};






