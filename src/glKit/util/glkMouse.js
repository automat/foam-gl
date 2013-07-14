GLKit.Mouse = function()
{
    this._position = GLKit.Vec2.make();
    document.addEventListener('mousemove',this._onMouseMove.bind(this));

    if(GLKit.Mouse._instance)throw 'fdsf';
    GLKit.Mouse._instance = this;

};

GLKit.Mouse.prototype._onMouseMove = function(e)
{
    this._position[0] = e.pageX;
    this._position[1] = e.pageY;
};

GLKit.Mouse.prototype.getPosition = function(){return this._position;};
GLKit.Mouse.prototype.getX        = function(){return this._position[0];};
GLKit.Mouse.prototype.getY        = function(){return this._position[1];};

GLKit.Mouse.getInstance = function(){return GLKit.Mouse._instance;};