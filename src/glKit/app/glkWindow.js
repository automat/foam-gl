/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKWindow(parentDomElementId)
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
            this.gl = this._glCanvas.getContext(implNames[i],{ antialias:true});
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

    this._width  = 300;
    this._height = 300;

    this.parent.appendChild(this._glCanvas);

}

GLKWindow.prototype =
{
    setSize : function(width,height)
    {
        this._width  = width;
        this._height = height;
    },

    setWidth : function(width)
    {
        this._width = width;
    },

    setHeight : function(height)
    {
        this._height = height;
    },

    _updateSize : function(width,height)
    {
        var glc = this._glCanvas;

        this.width  = width;
        this.height = height;

        glc.style.width  = width  + 'px';
        glc.style.height = height + 'px';
        glc.width        = width;
        glc.height       = height;

        var gl = this._gl;

        gl.viewport(0,0,width,height);
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