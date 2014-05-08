var Default     = require('../system/common/fDefault'),
    fError      = require('../system/common/Error'),
    ObjectUtil  = require('../util/fObjectUtil');

/*--------------------------------------------------------------------------------------------*/
//  Constructor
/*--------------------------------------------------------------------------------------------*/

function AppImpl() {
    this._context3d = null;

    this._windowTitle = 0;
    this._isFullWindowFrame = false;
    this._isFullscreen = false;
    this._isBorderless = false;
    this._displayId = 0;

    this._keyDown = false;
    this._keyStr = '';
    this._keyCode = '';

    this._mouseDown = false;
    this._mouseMove = false;
    this._mouseWheelDelta = 0.0;

    this._mouseMove = false;
    this._mouseBounds = true;
    this._hideCursor = false;

    this._targetFPS = Default.APP_FPS;
    this._loop = true;

    this._framenum = 0;
    this._time = 0;
    this._timeStart = -1;
    this._timeNext = 0;
    this._timeInterval = this._targetFPS / 1000.0;
    this._timeDelta = 0;
    this._timeElapsed = 0;

    this._windowSize   = [-1,-1];
    this._windowRatio  = -1;

    this._isInitialized = false;
}

/*--------------------------------------------------------------------------------------------*/
//  Init
/*--------------------------------------------------------------------------------------------*/

AppImpl.prototype.isInitialized = function () {
    return this._isInitialized;
};

AppImpl.prototype.initialize = function (appObj) {
    throw new Error(Error.METHOD_NOT_IMPLEMENTED);
}

/*--------------------------------------------------------------------------------------------*/
//  draw / updata
/*--------------------------------------------------------------------------------------------*/


AppImpl.prototype.loop = function (bool) {
    if(ObjectUtil.isUndefined(bool)){
        this._loop = true;
    }else{
        this._loop = bool;
    }
};

/*--------------------------------------------------------------------------------------------*/
//  window
/*--------------------------------------------------------------------------------------------*/

AppImpl.prototype.setWindowSize = function (width, height) {
    throw new Error(Error.METHOD_NOT_IMPLEMENTED);
};

AppImpl.prototype.getWindowWidth = function () {
    return this._windowSize[0];
};

AppImpl.prototype.getWindowHeight = function () {
    return this._windowSize[1];
};

AppImpl.prototype.getWindowSize = function(){
    return this._windowSize.slice();
};


AppImpl.prototype.getWindowAspectRatio = function () {
    return this._windowRatio;
};

/*
AppImpl.prototype.setFullWindowFrame = function (bool) {
    throw new Error(fError.METHOD_NOT_IMPLEMENTED);
};

AppImpl.prototype.isFullWindowFrame = function () {
    return this._isFullWindowFrame;
};

AppImpl.prototype.setFullscreen = function (bool) {
    return false;
};
AppImpl.prototype.isFullscreen = function () {
    return this._isFullscreen;
};

AppImpl.prototype.setBorderless = function (bool) {
    return false;
};

AppImpl.prototype.isBorderless = function () {
    return this._isBorderless;
};

AppImpl.prototype.setDisplay = function (num) {
    return false;
};
AppImpl.prototype.getDisplay = function () {
    return this._displayId;
};

AppImpl.prototype.getWindow = function () {
    throw new Error(fError.METHOD_NOT_IMPLEMENTED);
};
*/

/*--------------------------------------------------------------------------------------------*/
//  framerate / time
/*--------------------------------------------------------------------------------------------*/

AppImpl.prototype.setFPS = function (fps) {
    this._targetFPS = fps;
    this._timeInterval = this._targetFPS / 1000.0;
};

AppImpl.prototype.getFPS = function () {
    return this._targetFPS;
};

AppImpl.prototype.getFramesElapsed = function () {
    return this._framenum;
};
AppImpl.prototype.getSecondsElapsed = function () {
    return this._timeElapsed;
};
AppImpl.prototype.getTime = function () {
    return this._time
};
AppImpl.prototype.getTimeStart = function () {
    return this._timeStart;
};

AppImpl.prototype.getTimeDelta = function () {
    return this._timeDelta;
};

/*--------------------------------------------------------------------------------------------*/
// input
/*--------------------------------------------------------------------------------------------*/

AppImpl.prototype.hideMouseCursor = function (bool) {
    throw new Error(Error.METHOD_NOT_IMPLEMENTED);
};

AppImpl.prototype.setWindowTitle = function (title) {
    this._windowTitle = title;
};

AppImpl.prototype.restrictMouseToFrame = function (bool) {
    this._mouseBounds = bool;
};

AppImpl.prototype.isKeyDown = function () {
    return this._keyDown;
};
AppImpl.prototype.isMouseDown = function () {
    return this._mouseDown;
};
AppImpl.prototype.isMouseMove = function () {
    return this._mouseMove;
};
AppImpl.prototype.getKeyCode = function () {
    return this._keyCode;
};
AppImpl.prototype.getKeyStr = function () {
    return this._keyStr;
};
AppImpl.prototype.getMouseWheelDelta = function () {
    return this._mouseWheelDelta;
};

AppImpl.prototype.setMouseListenerTarget = function (obj) {
    return false;
};
AppImpl.prototype.setKeyListenerTarget = function (obj) {
    return false;
};


module.exports = AppImpl;