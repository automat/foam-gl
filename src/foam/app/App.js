var fError     = require('../system/common/Error'),
    ObjectUtil = require('../util/ObjectUtil'),
    Event      = require('../system/Event'),
    Vec2       = require('../math/Vec2'),
    Rect       = require('../geom/Rect'),
    Mouse      = require('../input/Mouse'),
    MouseEvent = require('../input/MouseEvent'),
    gl         = require('../gl/gl'),
    glDraw     = require('../gl/glDraw');


function App() {
    if(!window.WebGLRenderingContext){
        this.onWebGLContextNotAvailable();
        return this;
    }

    if (App.__instance) {
        throw new Error(Error.CLASS_IS_SINGLETON);
    }

    //
    //  Context & Window
    //
    this._windowBounds = new Rect();
    this._windowRatio = 0;
    this._windowScale = 1.0;

    //
    //  input
    //
    this._keyDown = false;
    this._keyStr = '';
    this._keyCode = '';

    this._hideCursor = false;

    this._mouseTimer = null;
    this._mouse = new Mouse();
    this._mousePosTemp = new Vec2();
    this._mousePosLastTemp = new Vec2();
    this._mousePosition = {position:new Vec2(),positionLast:new Vec2()};

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

    this.setFPS(60.0);

    //
    //  canvas & context
    //
    var canvas = this._canvas = document.createElement('canvas');
        canvas.setAttribute('tabindex','0');
        canvas.focus();

    var _gl =  canvas.getContext('webkit-3d') ||
               canvas.getContext("webgl") ||
               canvas.getContext("experimental-webgl");

    if(!_gl){
        this.onWebGLContextNotAvailable();
        return this;
    }
    _gl.activeTexture(_gl.TEXTURE0);
    gl.set(_gl);
    glDraw.init();

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame;

    App.__instance = this;
    window.addEventListener('resize',this.onWindowResize.bind(this));

    document.body.appendChild(canvas);

    var mouse = this._mouse;
    var self = this;

    function onMouseStopped(){
        mouse._positionLast.x = mouse._position.x;
        mouse._positionLast.y = mouse._position.y;
        mouse._move = false;

        if(mouse.hasEventListener(MouseEvent.MOUSE_STOP)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_STOP));
        }
    }

    canvas.addEventListener('mousemove',function(e){
        mouse._move = true;
        mouse._positionLast.x = mouse._position.x;
        mouse._positionLast.y = mouse._position.y;
        mouse._position.x = e.offsetX;
        mouse._position.y = e.offsetY;

        if(mouse._down){
            if(mouse.hasEventListener(MouseEvent.MOUSE_DRAG)){
                mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_DRAG));
            }
        }

        clearTimeout(self._mouseTimer);
        self._mouseTimer = setTimeout(onMouseStopped,100);

        if(mouse.hasEventListener(MouseEvent.MOUSE_MOVE)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_MOVE));
        }
    });

    canvas.addEventListener('mousedown',function(){
        mouse._down = true;
        if(mouse.hasEventListener(MouseEvent.MOUSE_DOWN)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_DOWN));
        }
    });

    canvas.addEventListener('mouseup',function(){
        mouse._down = false;
        if(mouse.hasEventListener(MouseEvent.MOUSE_DOWN)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_DOWN));
        }
    });

    canvas.addEventListener('mouseout',function(){
        mouse._leave = true;
        if(mouse.hasEventListener(MouseEvent.MOUSE_OUT)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_OUT));
        }
    });

    canvas.addEventListener('mouseenter',function(){
        mouse._enter = true;
        if(mouse.hasEventListener(MouseEvent.MOUSE_ENTER)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_ENTER));
        }
    });

    //
    //
    //

    this.setup();

    if(this._loop){
        var time, timeDelta;
        var timeInterval = this._timeInterval;
        var timeNext;

        function update_Internal() {
            requestAnimationFrame(update_Internal, null);

            time = self._time = Date.now();
            timeDelta = time - self._timeNext;

            self._timeDelta = Math.min(timeDelta / timeInterval, 1);

            if (timeDelta > timeInterval) {
                timeNext = self._timeNext = time - (timeDelta % timeInterval);

                self.update();

                self._timeElapsed = (timeNext - self._timeStart) / 1000.0;
                self._framenum++;
            }

            mouse._downLast = mouse._down;
            mouse._enter = false;
            mouse._leave = false;
        }
        update_Internal();
    } else {
        this.update();
    }
}

App.getInstance = function () {
    return App.__instance;
};

// override
App.prototype.setup = function () {
    throw new Error(Error.APP_NO_SETUP);
};

// override
App.prototype.update = function () {
    throw new Error(Error.APP_NO_UPDATE);
};

// override
App.prototype.onWebGLContextNotAvailable = function(){
    console.log('FOAM: WebGLContext not available.');
};

/*--------------------------------------------------------------------------------------------*/
//  window
/*--------------------------------------------------------------------------------------------*/

App.prototype.setWindowSize = function (width, height, scale) {
    var windowScale  = this._windowScale = scale || this._windowScale,
        windowBounds = this._windowBounds;

    width  *= windowScale;
    height *= windowScale;

    if (width  == windowBounds.x1 && height == windowBounds.y1){
        return;
    }

    windowBounds.x1 = width;
    windowBounds.y1 = height;
    this._windowRatio = width / height;

    this._updateCanvasSize();
};

App.prototype._updateCanvasSize = function(){
    var windowWidth = this._windowBounds.x1,
        windowHeight = this._windowBounds.y1,
        windowScale = this._windowScale;

    var canvas = this._canvas;
        canvas.style.width = windowWidth / windowScale + 'px';
        canvas.style.height = windowHeight / windowScale + 'px';
        canvas.width = windowWidth;
        canvas.height = windowHeight;
};

App.prototype.getWindowBounds = function(rect){
    return (rect || new Rect()).set(this._windowBounds);
}

App.prototype.getWindowSize = function (v) {
    return (v || new Vec2()).setf(this._windowBounds.x1,this._windowBounds.y1);
};

App.prototype.getWindowWidth = function () {
    return this._windowBounds.x1;
};

App.prototype.getWindowHeight = function () {
    return this._windowBounds.y1;
};

App.prototype.getWindowAspectRatio = function () {
    return this._windowRatio;
};

App.prototype.getWindowScale = function(){
    return this._windowScale;
};

//override
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
};


/*--------------------------------------------------------------------------------------------*/
//  input
/*--------------------------------------------------------------------------------------------*/


App.prototype.isKeyDown = function () {
    return this._keyDown;
};
App.prototype.getKeyCode = function () {
    return this._keyCode;
};
App.prototype.getKeyStr = function () {
    return this._keyStr;
};


App.prototype.onKeyDown = function () {};
App.prototype.onKeyUp = function () {};

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
