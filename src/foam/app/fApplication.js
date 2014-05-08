var fError = require('../system/common/fError'),
    ObjectUtil = require('../util/fObjectUtil'),
    Platform = require('../system/common/fPlatform'),
    Shared = require('../system/fShared'),
    AppImplWeb = require('./fAppImplWeb'),
    Mouse = require('../util/fMouse');


function Application() {
    if (Application.__instance) {
        throw new Error(fError.CLASS_IS_SINGLETON);
    }

    var target = Platform.getTarget();
    if (ObjectUtil.isUndefined(target)) {
        throw new Error(fError.WRONG_PLATFORM);
    }

    this.mouse = new Mouse();
    this.fgl = null;
    this.camera = null;

    /*
     this._appImpl = target == Platform.WEB         ? new AppImplWeb(arguments) :
     target == Platform.NODE_WEBKIT ? new AppImplNodeWebkit(arguments) :
     target == Platform.PLASK       ? new AppImplPlask(arguments) :
     null;
     */

    this._appImpl = new AppImplWeb(arguments);

    Application.__instance = this;
}

Application.__instance = null;
Application.getInstance = function () {
    return Application.__instance;
};


Application.prototype.setup = function () {
    throw new Error(fError.APP_NO_SETUP);
};
Application.prototype.update = function () {
    throw new Error(fError.APP_NO_UPDATE);
};

/*--------------------------------------------------------------------------------------------*/
//  window
/*--------------------------------------------------------------------------------------------*/

Application.prototype.setWindowSize = function (width, height) {
    var appImpl = this._appImpl;
    appImpl.setWindowSize(width, height);

    Shared.__windowSize[0] = width;
    Shared.__windowSize[1] = height;

    if (!appImpl.isInitialized())appImpl.init(this);
};

Application.prototype.getWindowSize = function () {
    return this._appImpl.getWindowSize();
};

Application.prototype.getWindowWidth = function () {
    return this._appImpl.getWindowWidth();
};

Application.prototype.getWindowHeight = function () {
    return this._appImpl.getWindowHeight();
};

Application.prototype.getWindowAspectRatio = function () {
    return this._appImpl.getWindowAspectRatio();
};


Application.prototype.onWindowResize = function (e) {
};


/*--------------------------------------------------------------------------------------------*/
//  framerate / time
/*--------------------------------------------------------------------------------------------*/

Application.prototype.setFPS = function (fps) {
    return this._appImpl.setFPS(fps);
};

Application.prototype.getFPS = function () {
    return this._appImpl.getFPS();
};

Application.prototype.getFramesElapsed = function () {
    return this._appImpl.getFramesElapsed();
};

Application.prototype.getSecondsElapsed = function () {
    return this._appImpl.getSecondsElapsed();
};

Application.prototype.getTime = function () {
    return this._appImpl.getTime();
};

Application.prototype.getTimeStart = function () {
    return this._appImpl.getTimeStart();
};

Application.prototype.getTimeDelta = function () {
    return this._appImpl.getTimeDelta();
};

/*--------------------------------------------------------------------------------------------*/
//  input
/*--------------------------------------------------------------------------------------------*/


Application.prototype.isKeyDown = function () {
    return this._appImpl.isKeyDown();
};
Application.prototype.isMouseDown = function () {
    return this._appImpl.isMouseDown();
};
Application.prototype.isMouseMove = function () {
    return this._appImpl.isMouseMove();
};
Application.prototype.getKeyStr = function () {
    return this._appImpl.getKeyStr();
};
Application.prototype.getKeyCode = function () {
    return this._appImpl.getKeyCode();
};
Application.prototype.getMouseWheelDelta = function () {
    return this._appImpl.getMouseWheelDelta();
};


Application.prototype.onKeyDown = function (e) {};
Application.prototype.onKeyUp = function (e) {};
Application.prototype.onMouseUp = function (e) {};
Application.prototype.onMouseDown = function (e) {};
Application.prototype.onMouseWheel = function (e) {};
Application.prototype.onMouseMove = function (e) {};


/*
 Application.prototype.getWindowWidth  = function(){return this._appImpl.getWindowWidth();};
 Application.prototype.getWindowHeight = function(){return this._appImpl.getWindowHeight();};

 Application.prototype.setUpdate = function(bool){this._appImpl.setUpdate(bool);};



 Application.prototype.setWindowTitle       = function(title){this._appImpl.setWindowTitle(title);};
 Application.prototype.restrictMouseToFrame = function(bool) {this._appImpl.restrictMouseToFrame(bool);};
 Application.prototype.hideMouseCursor      = function(bool) {this._appImpl.hideMouseCursor(bool);};

 Application.prototype.setFullWindowFrame  = function(bool){return this._appImpl.setFullWindowFrame(bool);};
 Application.prototype.setFullscreen       = function(bool){return this._appImpl.setFullscreen(true);};
 Application.prototype.isFullscreen        = function()    {return this._appImpl.isFullscreen();};
 Application.prototype.setBorderless       = function(bool){return this._appImpl.setBorderless(bool);};
 Application.prototype.isBorderless        = function()    {return this._appImpl.isBorderless();};
 Application.prototype.setDisplay          = function(num) {return this._appImpl.setDisplay(num);};
 Application.prototype.getDisplay          = function()    {return this._appImpl.getDisplay();};

 Application.prototype.setFPS = function(fps){this._appImpl.setFPS(fps);};


 Application.prototype.isKeyDown          = function(){return this._appImpl.isKeyDown();};
 Application.prototype.isMouseDown        = function(){return this._appImpl.isMouseDown();};
 Application.prototype.isMouseMove        = function(){return this._appImpl.isMouseMove();};
 Application.prototype.getKeyStr          = function(){return this._appImpl.getKeyStr();};
 Application.prototype.getKeyCode         = function(){return this._appImpl.getKeyCode();};
 Application.prototype.getMouseWheelDelta = function(){return this._appImpl.getMouseWheelDelta();};


 Application.prototype.onKeyDown    = function(e){};
 Application.prototype.onKeyUp      = function(e){};
 Application.prototype.onMouseUp    = function(e){};
 Application.prototype.onMouseDown  = function(e){};
 Application.prototype.onMouseWheel = function(e){};
 Application.prototype.onMouseMove  = function(e){};

 Application.prototype.onWindowResize = function(e){};

 Application.prototype.getFramesElapsed  = function(){return this._appImpl.getFramesElapsed();};
 Application.prototype.getSecondsElapsed = function(){return this._appImpl.getSecondsElapsed();};
 Application.prototype.getTime           = function(){return this._appImpl.getTime();};
 Application.prototype.getTimeStart      = function(){return this._appImpl.getTimeStart();};
 Application.prototype.getTimeNext       = function(){return this._appImpl.getTimeNext();};
 Application.prototype.getTimeDelta      = function(){return this._appImpl.getTimeDelta();};

 Application.prototype.getWindow = function(){return this._appImpl.getWindow();};

 Application.prototype.getWindowAspectRatio = function(){return this._appImpl.getWindowAspectRatio();};

 Application.__instance   = null;
 Application.getInstance = function(){return Application.__instance;};
 */
module.exports = Application;





