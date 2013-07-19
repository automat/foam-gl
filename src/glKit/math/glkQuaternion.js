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