function AbstractTexture()
{
    this._width  = -1;
    this._height = -1;

    this._image    = null;
    this._texture  = null;

    this._mipmap     = false;
    this._mag_filter = 9729;
    this._min_filter = 9729;
    this._wrap       = 33071;
}

AbstractTexture.prototype.getWidth  = function(){return this._width;};
AbstractTexture.prototype.getHeight = function(){return this._height;};

AbstractTexture.prototype.setMipmap    = function(bool) {this._mipmap = bool;};
AbstractTexture.prototype.setMagFilter = function(value){this._mag_filter = value;};
AbstractTexture.prototype.setMinFilter = function(value){this._min_filter = value;};
AbstractTexture.prototype.setWrap      = function(value){this._wrap = value;};

module.exports = AbstractTexture;