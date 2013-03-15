/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKWindow(parentDomElementId,width,height)
{
    this.parent    = document.getElementById(parentDomElementId);
    this._glCanvas = document.createElement('canvas');
    this.gl        = null;

    var implNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var i = -1;

    while(++i < implNames.length)
    {
        try
        {
            this.gl = this._glCanvas.getContext(names[i],{ antialias:true});
        }
        catch (e)
        {
            throw ("WebGL context could not be initialized");
        }
        if(this.gl)
        {
            break;
        }
    }

    var gl = this.gl;

    this._width  = width;
    this._height = height;

}

GLKWindow.prototype =
{
    setWidth : function(width)
    {
        this._width = width;
    },

    setHeight : function(height)
    {
        this._height = height;
    },

    getWidth : function()
    {
        return this._width;
    },

    getHeight : function()
    {
        return this._height;
    },

    getAspectRatio : function()
    {
        return this._width / this._height;
    }


};