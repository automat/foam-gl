GLKit.Texture = function()
{
    this._tex = null;
    this._width = null;
    this._height = null;

};

GLKit.Texture.prototype.setTexSource = function(texSrc)
{
    var tex = this._tex = texSrc;
    this._width  = tex.image.width;
    this._height = tex.image.height;
};

GLKit.Texture.prototype.getWidth  = function(){return this._width;};
GLKit.Texture.prototype.getHeight = function(){return this._height;};