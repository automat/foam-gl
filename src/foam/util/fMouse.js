var Vec2   = require('../math/fVec2'),
    fError = require('../system/fError');

function Mouse()
{
    if(Mouse.__instance)throw new Error(fError.CLASS_IS_SINGLETON);

    this._position     = Vec2.make();
    this._positionLast = Vec2.make();

    Mouse.__instance = this;
}

Mouse.prototype.getPosition     = function(){return this._position;};
Mouse.prototype.getPositionLast = function(){return this._positionLast;};
Mouse.prototype.getX            = function(){return this._position[0];};
Mouse.prototype.getY            = function(){return this._position[1];};
Mouse.prototype.getXLast        = function(){return this._positionLast[0];};
Mouse.prototype.getYLast        = function(){return this._positionLast[1];};

Mouse.__instance = null;
Mouse.getInstance = function(){return Mouse._instance;};

module.exports = Mouse;