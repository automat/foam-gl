var fError     = require('../system/common/Error'),
    Vec2       = require('../math/Vec2');

function Mouse()
{
    if(Mouse.__instance)throw new Error(Error.CLASS_IS_SINGLETON);

    this._position     = Vec2.create();
    this._positionLast = Vec2.create();
    this._state        = null;
    this._stateLast    = null;
    this._wheelDelta   = 0;

    Mouse.__instance = this;
}

Mouse.prototype.getPosition     = function(){return this._position;};
Mouse.prototype.getPositionLast = function(){return this._positionLast;};
Mouse.prototype.getX            = function(){return this._position[0];};
Mouse.prototype.getY            = function(){return this._position[1];};
Mouse.prototype.getXLast        = function(){return this._positionLast[0];};
Mouse.prototype.getYLast        = function(){return this._positionLast[1];};
Mouse.prototype.getState        = function(){return this._state;};
Mouse.prototype.getStateLast    = function(){return this._stateLast;};
Mouse.prototype.getWheelDelta   = function(){return this._wheelDelta;};

Mouse.__instance = null;
Mouse.getInstance = function(){return Mouse.__instance;};

module.exports = Mouse;