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

    this._uPosition     = null;
    this._uColorAmbient = null;
    this._uColorDiffuse = null;
    this._uColorSpecular= null;
    this._uShininess    = null;
}

GLKLightBasic.prototype =
{
    setPosition : function(v)
    {
        glkVec3.set(this._position,v);
        this._gl.uniform3fv(this._uPosition,  this._position);

        return this;
    },

    setPosition3f : function(x,y,z)
    {
        glkVec3.set3f(this._position,x,y,z);
        this._gl.uniform3fv(this._uPosition,  this._position);

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

        gl.uniform3fv(this._uColorAmbient,  colorAmbient);
        gl.uniform3fv(this._uColorDiffuse,  colorDiffuse);
        gl.uniform3fv(this._uColorSpecular, colorSpecular);

        return this;
    },

    setColorAmbient : function(ambient)
    {
        var colorAmbient  = this._colorAmbient;
        this._gl.uniform3fv(this._uColorAmbient,  colorAmbient);

        return this;
    },

    setColorDiffuse : function(diffuse)
    {
        var colorDiffuse  = this._colorDiffuse;
        this._gl.uniform3fv(this._uColorDiffuse,  colorDiffuse);

        return this;
    },

    setColorSpecular : function(specular)
    {
        var colorSpecular  = this._colorSpecular;
        this._gl.uniform3fv(this._uColorSpecular,  colorSpecular);

        return this;
    },

    setShininess : function(n)
    {
        this._shininess = n;
        this._gl.uniform1f (this._uShininess, this._shininess);
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

    enable : function(){},
    disable: function(){}
};



