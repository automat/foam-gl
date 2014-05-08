function AbstractTexture()
{
    this._windowWidth  = -1;
    this._windowHeight = -1;

    this._data     = null;
    this._texture  = null;

    this._mipmap     = false;
    this._mag_filter = 9729;
    this._min_filter = 9729;
    this._wrap       = 33071;
}

AbstractTexture.prototype.getWindowWidth  = function(){return this._windowWidth;};
AbstractTexture.prototype.getWindowHeight = function(){return this._windowHeight;};

AbstractTexture.prototype.setMipmap    = function(bool) {this._mipmap = bool;};
AbstractTexture.prototype.setMagFilter = function(value){this._mag_filter = value;};
AbstractTexture.prototype.setMinFilter = function(value){this._min_filter = value;};
AbstractTexture.prototype.setWrap      = function(value){this._wrap = value;};

module.exports = AbstractTexture;