var fError          = require('../../../system/common/Error'),
    AbstractTexture = require('./fAbstractTexture');

function Texture(image)
{
    AbstractTexture.call(this);

    if(!image)
        throw new Error(Error.TEXTURE_IMAGE_DATA_NULL);

    var width  = this._windowWidth  = image.width,
        height = this._windowHeight = image.height;

    if((width & (width-1) != 0))
        throw new Error(Error.TEXTURE_WIDTH_NOT_P2);
    else if((height & (height-1) != 0))
        throw new Error(Error.TEXTURE_HEIGHT_NOT_P2);

    this._data = image;
}

Texture.prototype = Object.create(AbstractTexture.prototype);

module.exports = Texture;
