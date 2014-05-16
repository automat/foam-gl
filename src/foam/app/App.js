var fError = require('../system/common/Error'),
    ObjectUtil = require('../util/ObjectUtil'),
    Platform = require('../system/common/Platform'),
    Mouse = require('../util/Mouse');

var gl     = require('../gl/gl'),
    glDraw = require('../gl/glDraw');

var Default     = require('../system/common/Default');

function App() {
    if (App.__instance) {
        throw new Error(Error.CLASS_IS_SINGLETON);
    }

    var target = Platform.getTarget();
    if (ObjectUtil.isUndefined(target)) {
        throw new Error(Error.WRONG_PLATFORM);
    }

    //
    //  Context & Window
    //
    this._windowTitle = null;
    this._fullWindow = false;
    this._fullscreen = false;
    this._windowSize = [0,0];
    this._windowRatio = 0;

    //
    //  input
    //
    this._keyDown = false;
    this._keyStr = '';
    this._keyCode = '';

    this._mouseDown = false;
    this._mouseMove = false;
    this._mouseWheelDelta = 0.0;
    this._mouseMove = false;
    this._mouseBounds = true;
    this._hideCursor = false;

    this.mouse = new Mouse();

    //
    //  time
    //
    this._framenum = 0;
    this._time = 0;
    this._timeStart = Date.now();
    this._timeNext = 0;
    this._targetFPS = -1;
    this._timeInterval = -1;
    this._timeDelta = 0;
    this._timeElapsed = 0;
    this._loop = true;

    this.setFPS(30.0);

    //
    //  canvas & context
    //
    var canvas = this._canvas = document.createElement('canvas');
        canvas.setAttribute('tabindex','0');
        canvas.focus();

    gl.set(canvas.getContext('webkit-3d') ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"));

    glDraw.set(gl.get());

    document.body.appendChild(canvas);

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame;




     App.__instance = this;

    //
    //
    //

    this.setup();

    if(this._loop){
        var time, timeDelta;
        var timeInterval = this._timeInterval;
        var timeNext;
        var self = this;

        function update() {

            requestAnimationFrame(update, null);

            time = self._time = Date.now();
            timeDelta = time - self._timeNext;

            self._timeDelta = Math.min(timeDelta / timeInterval, 1);


            if (timeDelta > timeInterval) {
                timeNext = self._timeNext = time - (timeDelta % timeInterval);

                self.update();

                self._timeElapsed = (timeNext - self._timeStart) / 1000.0;
                self._framenum++;
            }


        }

        update();
    } else {
        this.update();
    }

}

App.getInstance = function () {
    return App.__instance;
};

App.prototype.setup = function () {
    throw new Error(Error.APP_NO_SETUP);
};

App.prototype.update = function () {
    throw new Error(Error.APP_NO_UPDATE);
};

/*--------------------------------------------------------------------------------------------*/
//  window
/*--------------------------------------------------------------------------------------------*/

App.prototype.setWindowSize = function (width, height) {
    if(this._fullWindow){
        width  = window.innerWidth;
        height = window.innerHeight;
    }

    if (width  == this._windowSize[0] && height == this._windowSize[1]){
        return;
    }

    this._windowSize[0] = width;
    this._windowSize[1] = height;
    this._windowRatio   = width / height;

    this._updateCanvasSize();
};

App.prototype.setFullscreen = function(bool){
    this._fullscreen = bool;
};

App.prototype.setFullWindow = function(bool){
    this._fullWindow = bool;
}

App.prototype._updateCanvasSize = function(){
    var canvas = this._canvas,
        width  = this._windowSize[0],
        height = this._windowSize[1];

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
};

App.prototype.getWindowSize = function () {
    return this._windowSize.slice();
};

App.prototype.getWindowWidth = function () {
    return this._windowSize[0];
};

App.prototype.getWindowHeight = function () {
    return this._windowSize[1];
};

App.prototype.getWindowAspectRatio = function () {
    return this._windowRatio;
};

App.prototype.onWindowResize = function (e) {};


/*--------------------------------------------------------------------------------------------*/
//  framerate / time
/*--------------------------------------------------------------------------------------------*/

App.prototype.setFPS = function (fps) {
    this._targetFPS = fps;
    this._timeInterval = this._targetFPS / 1000.0;
};

App.prototype.getFPS = function () {
    return this._targetFPS;
};

App.prototype.getFramesElapsed = function () {
    return this._framenum;
};
App.prototype.getSecondsElapsed = function () {
    return this._timeElapsed;
};
App.prototype.getTime = function () {
    return this._time
};

App.prototype.getTimeStart = function () {
    return this._timeStart;
};

App.prototype.getTimeDelta = function () {
    return this._timeDelta;
};

App.prototype.loop = function(loop){
    this._loop = loop;
}


/*--------------------------------------------------------------------------------------------*/
//  input
/*--------------------------------------------------------------------------------------------*/


App.prototype.isKeyDown = function () {
    return this._keyDown;
};
App.prototype.isMouseDown = function () {
    return this._mouseDown;
};
App.prototype.isMouseMove = function () {
    return this._mouseMove;
};
App.prototype.getKeyCode = function () {
    return this._keyCode;
};
App.prototype.getKeyStr = function () {
    return this._keyStr;
};
App.prototype.getMouseWheelDelta = function () {
    return this._mouseWheelDelta;
};


App.prototype.onKeyDown = function (e) {};
App.prototype.onKeyUp = function (e) {};
App.prototype.onMouseUp = function (e) {};
App.prototype.onMouseDown = function (e) {};
App.prototype.onMouseWheel = function (e) {};
App.prototype.onMouseMove = function (e) {};


/*
 App.prototype.getWindowWidth  = function(){return this._appImpl.getWindowWidth();};
 App.prototype.getWindowHeight = function(){return this._appImpl.getWindowHeight();};

 App.prototype.setUpdate = function(bool){this._appImpl.setUpdate(bool);};



 App.prototype.setWindowTitle       = function(title){this._appImpl.setWindowTitle(title);};
 App.prototype.restrictMouseToFrame = function(bool) {this._appImpl.restrictMouseToFrame(bool);};
 App.prototype.hideMouseCursor      = function(bool) {this._appImpl.hideMouseCursor(bool);};

 App.prototype.setFullWindowFrame  = function(bool){return this._appImpl.setFullWindowFrame(bool);};
 App.prototype.setFullscreen       = function(bool){return this._appImpl.setFullscreen(true);};
 App.prototype.isFullscreen        = function()    {return this._appImpl.isFullscreen();};
 App.prototype.setBorderless       = function(bool){return this._appImpl.setBorderless(bool);};
 App.prototype.isBorderless        = function()    {return this._appImpl.isBorderless();};
 App.prototype.setDisplay          = function(num) {return this._appImpl.setDisplay(num);};
 App.prototype.getDisplay          = function()    {return this._appImpl.getDisplay();};

 App.prototype.setFPS = function(fps){this._appImpl.setFPS(fps);};


 App.prototype.isKeyDown          = function(){return this._appImpl.isKeyDown();};
 App.prototype.isMouseDown        = function(){return this._appImpl.isMouseDown();};
 App.prototype.isMouseMove        = function(){return this._appImpl.isMouseMove();};
 App.prototype.getKeyStr          = function(){return this._appImpl.getKeyStr();};
 App.prototype.getKeyCode         = function(){return this._appImpl.getKeyCode();};
 App.prototype.getMouseWheelDelta = function(){return this._appImpl.getMouseWheelDelta();};


 App.prototype.onKeyDown    = function(e){};
 App.prototype.onKeyUp      = function(e){};
 App.prototype.onMouseUp    = function(e){};
 App.prototype.onMouseDown  = function(e){};
 App.prototype.onMouseWheel = function(e){};
 App.prototype.onMouseMove  = function(e){};

 App.prototype.onWindowResize = function(e){};

 App.prototype.getFramesElapsed  = function(){return this._appImpl.getFramesElapsed();};
 App.prototype.getSecondsElapsed = function(){return this._appImpl.getSecondsElapsed();};
 App.prototype.getTime           = function(){return this._appImpl.getTime();};
 App.prototype.getTimeStart      = function(){return this._appImpl.getTimeStart();};
 App.prototype.getTimeNext       = function(){return this._appImpl.getTimeNext();};
 App.prototype.getTimeDelta      = function(){return this._appImpl.getTimeDelta();};

 App.prototype.getWindow = function(){return this._appImpl.getWindow();};

 App.prototype.getWindowAspectRatio = function(){return this._appImpl.getWindowAspectRatio();};

 App.__instance   = null;
 App.getInstance = function(){return App.__instance;};
 */
module.exports = App;
