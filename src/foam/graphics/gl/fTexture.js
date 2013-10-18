var fError = require('../../system/common/fError');

function Texture(fgl,image)
{
    if(!image)
        throw new Error(fError.TEXTURE_IMAGE_DATA_NULL);

    this._texture = fgl.glCreateTexture();



    var width  = this._width  = image.width,
        height = this._height = image.height;

    if((width & (width-1) != 0))
        throw new Error(fError.TEXTURE_WIDTH_NOT_P2);
    else if((height & (height-1) != 0))
        throw new Error(fError.TEXTURE_HEIGHT_NOT_P2);

    fgl.glBindTexture(this._texture);

    //
}

Texture.prototype.setImageData = function(image)
{

    //var tex = this._tex = glTex;
    //this._width  = tex.image.width;
    //this._height = tex.image.height;
};

Texture.prototype.getWidth  = function(){return this._width;};
Texture.prototype.getHeight = function(){return this._height;};

module.exports = Texture;