GLKit.Mouse = function()
{
    this._position     = GLKit.Vec2.make();
    this._positionLast = GLKit.Vec2.make();

    if(GLKit.Mouse._instance)throw 'Mouse is singleton. Get Mouse via getInstance().';
    GLKit.Mouse._instance = this;
};


GLKit.Mouse.prototype.getPosition     = function(){return this._position;};
GLKit.Mouse.prototype.getPositionLast = function(){return this._positionLast;};
GLKit.Mouse.prototype.getX            = function(){return this._position[0];};
GLKit.Mouse.prototype.getY            = function(){return this._position[1];};
GLKit.Mouse.prototype.getXLast        = function(){return this._positionLast[0];};
GLKit.Mouse.prototype.getYLast        = function(){return this._positionLast[1];};

GLKit.Mouse.getInstance = function(){return GLKit.Mouse._instance;};