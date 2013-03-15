/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */



var glkColor =
{
    SIZE  : 4,

    BLACK : function(){this.make(0,0,0,1);},
    WHITE : function(){this.make(1,1,1,1);},
    RED   : function(){this.make(1,0,0,1);},
    GREEN : function(){this.make(0,1,0,1);},
    BLUE  : function(){this.make(0,0,1,1);},


    make : function(r,g,b,a)
    {
        return new Float32Array([ r || 1.0,
                                  g || 1.0,
                                  b || 1.0,
                                  a || 1.0]);
    },

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

        return c;
    },

    set4i : function(c,r,g,b,a)
    {
        return this.set4f(c,r/255.0,g/255.0,b/255.0,a);
    },

    set3i : function(c,r,g,b)
    {
        return this.set3f(c,r/255.0,g/255.0,b/255.0);
    },

    set2i : function(c,k,a)
    {
        return this.set2f(c,k/255.0,a);
    },

    set1i : function(c,k)
    {
        return this.set1f(c,k/255.0);
    },

    toArray : function(c)
    {
        return c.toArray();
    },

    toString : function(c)
    {
        return '['+c[0]+','+c[1]+','+c[2]+','+c[3]+']';
    },

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
