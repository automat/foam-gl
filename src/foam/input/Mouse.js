var _Error = require('../system/common/Error'),
    EventDispatcher = require('../system/EventDispatcher'),
    Event = require('../system/Event'),
    Vec2 = require('../math/Vec2');

function Mouse() {
    if (Mouse.__instance){
        throw new Error(_Error.CLASS_IS_SINGLETON);
    }

    EventDispatcher.call(this);

    this._position = new Vec2();
    this._positionLast = new Vec2();
    this._down = this._downLast = false;
    this._up = false;
    this._move = this._moveLast = false;
    this._leave = this._enter = false;
    this._wheelDelta = 0;

    Mouse.__instance = this;
}

Mouse.prototype = Object.create(EventDispatcher.prototype);

Mouse.prototype.getPosition = function (v) {
    return (v || new Vec2()).set(this._position);
};

Mouse.prototype.getPositionLast = function (v) {
    return (v || new Vec2()).set(this._positionLast);
};

Mouse.prototype.getX = function () {
    return this._position.x;
};

Mouse.prototype.getY = function () {
    return this._position.y;
};

Mouse.prototype.getXLast = function () {
    return this._positionLast.x;
};

Mouse.prototype.getYLast = function () {
    return this._positionLast.y;
};

Mouse.prototype.getWheelDelta = function () {
    return this._wheelDelta;
};

Mouse.prototype.isDown = function(){
    return this._down;
};

Mouse.prototype.isPressed = function(){
    return this._down && !this._downLast;
}

Mouse.prototype.isDragged = function(){
    return this._down && this._move;
};

Mouse.prototype.didMove = function(){
    return this._move;
};

Mouse.prototype.didEnter = function(){
    return this._enter;
};

Mouse.prototype.didLeave = function(){
    return this._leave;
};


Mouse.__instance = null;
Mouse.getInstance = function () {
    return Mouse.__instance;
};

module.exports = Mouse;