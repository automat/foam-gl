var Default = require('../system/fDefault'),
    fError  = require('../system/fError');

function AppImpl()
{
    this._context3d = null;
    this._context2d = null;

    this._windowTitle       = 0;
    this._isFullWindowFrame = false;
    this._isFullscreen      = false;
    this._isBorderless      = false;
    this._displayId         = 0;

    this._keyDown   = false;
    this._keyStr    = '';
    this._keyCode   = '';

    this._mouseDown       = false;
    this._mouseMove       = false;
    this._mouseWheelDelta = 0.0;

    this._mouseMove   = false;
    this._mouseBounds = true;

    this._targetFPS     = Default.APP_FPS;
    this._bUpdate       = true;

    this._frames        = 0;
    this._frametime     = 0;
    this._framenum      = 0;
    this._time          = 0;
    this._timeStart     = -1;
    this._timeNext      = 0;
    this._timeInterval  = this._targetFPS / 1000.0;
    this._timeDelta     = 0;

    this._width  = -1;
    this._height = -1;
    this._ratio  = -1;

    this._isInitialized = false;
}

AppImpl.prototype.isInitialized = function()    {return this._isInitialized;};

AppImpl.prototype.setUpdate     = function(bool){this._bUpdate = bool;};

AppImpl.prototype.init    = function(appObj)      {throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.setSize = function(width,height){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};

AppImpl.prototype.setFullWindowFrame = function(bool){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.isFullWindowFrame  = function()    {return this._isFullWindowFrame;};

AppImpl.prototype.setFullscreen = function(bool){return false;};
AppImpl.prototype.isFullscreen  = function(){return this._isFullscreen;};

AppImpl.prototype.setBorderless = function(bool){return false;};
AppImpl.prototype.isBorderless  = function(){return this._isBorderless;}

AppImpl.prototype.setDisplay = function(num){return false;};
AppImpl.prototype.getDisplay = function(){return this._displayId;}


AppImpl.prototype.getWidth  = function()            {return this._width;};
AppImpl.prototype.getHeight = function()            {return this._height;};
AppImpl.prototype.getAspectRatioWindow = function(){return this._ratio;};

AppImpl.prototype.setTargetFPS = function(fps){this._targetFPS = fps;this._timeInterval  = this._targetFPS / 1000.0;};
AppImpl.prototype.getTargetFPS = function()   {return this._targetFPS;};

AppImpl.prototype.setWindowTitle       = function(title){this._windowTitle = title;};
AppImpl.prototype.restrictMouseToFrame = function(bool) {this._mouseBounds = bool;};

AppImpl.prototype.getFramesElapsed  = function(){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getSecondsElapsed = function(){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTime           = function(){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTimeStart      = function(){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTimeNext       = function(){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTimeDelta      = function(){throw new Error(fError.METHOD_NOT_IMPLEMENTED);};

AppImpl.prototype.isKeyDown          = function(){return this._keyDown;};
AppImpl.prototype.isMouseDown        = function(){return this._mouseDown;};
AppImpl.prototype.isMouseMove        = function(){return this._mouseMove;};
AppImpl.prototype.getKeyCode         = function(){return this._keyCode;};
AppImpl.prototype.getKeyStr          = function(){return this._keyStr;};
AppImpl.prototype.getMouseWheelDelta = function(){return this._mouseWheelDelta;};


AppImpl.prototype.setMouseListenerTarget = function(obj){return false;};
AppImpl.prototype.setKeyListenerTarget   = function(obj){return false;};
AppImpl.prototype.getParent              = function()   {return false;};
AppImpl.prototype.setParent              = function(obj){return false;};

module.exports = AppImpl;