EventDispatcher = function () {
    this._listeners = [];
};

EventDispatcher.prototype.addEventListener = function (type, method) {
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push(method);
};

EventDispatcher.prototype.dispatchEvent = function (event) {
    var type = event.type;
    if (!this.hasEventListener(type)){
        return;
    }
    var methods = this._listeners[type];
    var i = -1, l = methods.length;
    while (++i < l) {
        methods[i](event);
    }
};

EventDispatcher.prototype.removeEventListener = function (type, method) {
    if (!this.hasEventListener(type)){
        return;
    }
    var methods = this._listeners[type];
    var i = methods.length;
    while (--i > -1) {
        if (methods[i] == method) {
            methods.splice(i, 1);
            if (methods.length == 0){
                delete this._listeners[type];
            }
            break;
        }
    }
};

EventDispatcher.prototype.removeAllEventListeners = function () {
    this._listeners = [];
};

EventDispatcher.prototype.hasEventListener = function (type) {
    return this._listeners[type] != undefined && this._listeners[type] != null;
};

module.exports = EventDispatcher;