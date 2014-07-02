var _Error = require('../system/common/Error'),
    EventDispatcher = require('../system/EventDispatcher'),
    Event = require('../system/Event');

function Keyboard(){
    if (Keyboard.__instance){
        throw new Error(_Error.CLASS_IS_SINGLETON);
    }

    EventDispatcher.call(this);

    this._down = false;
    this._up   = false;

    this._keycode = null;
    this._keycodePrev = null;

    this._keystr = null;
    this._keystrPrev = null;

    this._altKey = false;
    this._ctrlKey = false;
    this._shiftKey = false;

    this._timestamp = null;
    this._timestampLast = null;

    Keyboard.__instance = this;
}

Keyboard.prototype = Object.create(EventDispatcher.prototype);

Keyboard.prototype.isKeyDown = function(){
    return this._down;
};

Keyboard.prototype.isKeyUp = function(){
    return this._up;
};

Keyboard.prototype.getKeyCode = function(){
    return this._keycode;
};

Keyboard.prototype.getKeyStr = function(){
    return this._keyStr;
};

Keyboard.prototype.getKeyCodePrev = function(){
    return this._keycodePrev;
}

Keyboard.prototype.getKeyStrPrev = function(){
    return this._keystrPrev;
}

Keyboard.prototype.isKeyAlt = function(){
    return this._altKey;
};

Keyboard.prototype.isKeyCtrl = function(){
    return this._ctrKey;
};

Keyboard.prototype.isKeyShift = function(){
    return this._shiftKey;
};

Keyboard.getInstance = function() {
    return Keyboard.__instance;
}

Keyboard.__instance = null;
module.exports = Keyboard;