/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKParametricSurface()
{
    GLKGeom3d.apply(this,arguments);

    this._MIN_RES  = [2,2];

    this._res      = [2,2];
    this._resTotal = this._res[0] * this._res[1];

    this.vertices  = new Float32Array(this._resTotal * glkVec3.SIZE );
    this.normals   = new Float32Array(this._resTotal * glkVec3.SIZE );
    this.indices   = new Float32Array(this._resTotal * glkColor.SIZE);
}

GLKParametricSurface.prototype = Object.create(GLKGeom3d.prototype);

GLKParametricSurface.prototype =
{
    setup : function()
    {

    },

    applyFunction : function(func){}

};

