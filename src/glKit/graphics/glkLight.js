/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKLightBasic(gl)
{
    this._gl = gl;

    this._id = null;

    this._position = glkVec3.make();

    this._colorAmbient   = glkColor.make();
    this._colorDiffuse   = glkColor.make();
    this._colorSpecular  = glkColor.make();
    this._shininess      = 1.0;

    this._enabled        = false;

    this._lightInternal = null;



}

GLKLightBasic.prototype =
{
    setPosition : function(v)
    {
        glkVec3.set(this._position,v);
        this._gl.uniform3fv(this._lightInternal.uPosition,  this._position);

        return this;
    },

    setPosition3f : function(x,y,z)
    {
        glkVec3.set3f(this._position,x,y,z);
        this._gl.uniform3fv(this._lightInternal.uPosition,  this._position);

        return this;
    },


    getPosition : function()
    {
        return this._position
    },

    setColors : function(ambient,diffuse,specular)
    {
        var colorAmbient  = this._colorAmbient,
            colorDiffuse  = this._colorDiffuse,
            colorSpecular = this._colorSpecular;

        glkColor.set(colorAmbient, ambient);
        glkColor.set(colorDiffuse, diffuse);
        glkColor.set(colorSpecular,specular);

        var gl = this._gl;

        var li = this._lightInternal;

        gl.uniform3fv(li.uColorAmbient,  colorAmbient);
        gl.uniform3fv(li.uColorDiffuse,  colorDiffuse);
        gl.uniform3fv(li.uColorSpecular, colorSpecular);

        return this;
    },

    setColorAmbient : function(ambient)
    {
        var colorAmbient  = this._colorAmbient;
        this._gl.uniform3fv(this._lightInternal.uColorAmbient,  colorAmbient);

        return this;
    },

    setColorDiffuse : function(diffuse)
    {
        var colorDiffuse  = this._colorDiffuse;
        this._gl.uniform3fv(this._lightInternal.uColorDiffuse,  colorDiffuse);

        return this;
    },

    setColorSpecular : function(specular)
    {
        var colorSpecular  = this._colorSpecular;
        this._gl.uniform3fv(this._lightInternal.uColorSpecular,  colorSpecular);

        return this;
    },

    setShininess : function(n)
    {
        this._shininess = n;
        this._gl.uniform1f (this._lightInternal.uShininess, this._shininess);
    },

    getColorAmbient : function()
    {
        return this._colorAmbient;
    },

    getColorDiffuse : function()
    {
        return this._colorDiffuse;
    },

    getColorSpecular : function()
    {
        return this._colorSpecular;
    },

    getShininess : function()
    {
        return this._shininess;
    },

    //TODO:Implement

    enable : function(){this._gl.uniform1f(this._lightInternal.uEnabled,1.0);},
    disable: function(){this._gl.uniform1f(this._lightInternal.uEnabled,0.0);},

    //TODO:Improve

    bind : function(lightInternal)
    {
        this._lightInternal = lightInternal;
    }


};



