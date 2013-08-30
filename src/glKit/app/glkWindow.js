GLKit.Window = function(parentDomElement)
{
    this._parent   = parentDomElement;

    this._canvas3d = document.createElement('canvas');
    this._canvas3d.setAttribute('tabindex','0');
    this._canvas3d.focus();
    this.context3d = this._canvas3d.getContext('webkit-3d') ||
                     this._canvas3d.getContext("webgl") ||
                     this._canvas3d.getContext("experimental-webgl");

    this._canvas2d = document.createElement('canvas');
    this.context2d = this._canvas2d.getContext('2d');



    this._width  = 0;
    this._height = 0;

    this._parent.appendChild(this._canvas3d);
};

/*---------------------------------------------------------------------------------*/

GLKit.Window.prototype.getParent = function(){return this._parent;};
GLKit.Window.prototype.getCanvas3d = function(){return this._canvas3d;};

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
    var glCanvas = this._canvas3d,
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