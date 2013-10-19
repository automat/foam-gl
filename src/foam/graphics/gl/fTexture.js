var fError = require('../../system/common/fError');

function Texture(image)
{
    if(!image)
        throw new Error(fError.TEXTURE_IMAGE_DATA_NULL);

    var width  = this._width  = image.width,
        height = this._height = image.height;

    if((width & (width-1) != 0))
        throw new Error(fError.TEXTURE_WIDTH_NOT_P2);
    else if((height & (height-1) != 0))
        throw new Error(fError.TEXTURE_HEIGHT_NOT_P2);

    this._image    = image;
    this._texture  = null;

    this._mipmap     = null;
    this._flipY      = false;
    this._mag_filter = 9729;
    this._min_filter = 9987;
    this._wrap       = 33071;

}

Texture.prototype.getWidth  = function(){return this._width;};
Texture.prototype.getHeight = function(){return this._height;};

Texture.prototype.setMipmap    = function(bool){this._mipmap = bool;};
Texture.prototype.setFlipY     = function(bool){this._flipY = bool;};
Texture.prototype.setMagFilter = function(value){this._mag_filter = value;};
Texture.prototype.setMinFilter = function(value){this._min_filter = value;};
Texture.prototype.setWrap      = function(value){this._wrap = value;};

module.exports = Texture;
