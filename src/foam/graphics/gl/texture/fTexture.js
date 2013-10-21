var fError          = require('../../../system/common/fError'),
    AbstractTexture = require('./fAbstractTexture');

function Texture(image)
{
    AbstractTexture.call(this);

    if(!image)
        throw new Error(fError.TEXTURE_IMAGE_DATA_NULL);

    var width  = this._width  = image.width,
        height = this._height = image.height;

    if((width & (width-1) != 0))
        throw new Error(fError.TEXTURE_WIDTH_NOT_P2);
    else if((height & (height-1) != 0))
        throw new Error(fError.TEXTURE_HEIGHT_NOT_P2);

    this._data = image;
}

Texture.prototype = Object.create(AbstractTexture.prototype);

module.exports = Texture;
