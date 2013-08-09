GLKit.Texture = function()
{
    this._tex = null;
    this._width = null;
    this._height = null;

    if(arguments.length == 1)this.setTexSource(arguments[0]);
};

GLKit.Texture.prototype.setTexSource = function(glTex)
{
    var tex = this._tex = glTex;
    this._width  = tex.image.width;
    this._height = tex.image.height;
};

GLKit.Texture.prototype.getWidth  = function(){return this._width;};
GLKit.Texture.prototype.getHeight = function(){return this._height;};