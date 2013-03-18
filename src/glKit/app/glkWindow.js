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
    this._gl        = null;

    var implNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var i = -1;

    while(++i < implNames.length)
    {
        try
        {
            this._gl = this._glCanvas.getContext(implNames[i],{ antialias:true});
        }
        catch (e)
        {
            throw ("WebGL context could not be initialized");
        }
        if(this._gl)
        {
            break;
        }
    }

    var gl = this._gl;

    this._width  = 300;
    this._height = 300;

    this._isWindowFullScreen = false;



    this.parent.appendChild(this._glCanvas);

}

GLKWindow.prototype =
{
    setSize : function(width,height)
    {
        this._width  = width;
        this._height = height;

        this._isWindowFullScreen = width == window.innerWidth && window.innerHeight;

        this._updateSize();
    },

    setWidth : function(width)
    {
        this._width = width;
        this._updateSize();
    },

    setHeight : function(height)
    {
        this._height = height;
        this._updateSize();
    },

    _updateSize : function()
    {
        var glc = this._glCanvas;

        var width  = this._width,
            height = this._height;

        glc.style.width  = width  + 'px';
        glc.style.height = height + 'px';
        glc.width        = width;
        glc.height       = height;
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
    },

    getGL : function()
    {
        return this._gl;
    },

    getCanvas : function()
    {
        return this._glCanvas;
    },

    isWindowFullscreen : function()
    {
        return this._isWindowFullScreen;
    }


};