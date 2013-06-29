GLKit.Window = function(parentDomElement)
{
    this._parent   = parentDomElement;

    this._glCanvas = document.createElement('canvas');
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

/*---------------------------------------------------------------------------------*/