var fError     = require('../system/common/Error'),
    ObjectUtil = require('../util/ObjectUtil'),
    Event      = require('../system/Event'),
    System     = require('../system/System'),
    Resource   = require('../system/Resource'),
    Vec2       = require('../math/Vec2'),
    Rect       = require('../geom/Rect'),
    Mouse      = require('../input/Mouse'),
    MouseEvent = require('../input/MouseEvent'),
    Keyboard   = require('../input/Keyboard'),
    KeyEvent   = require('../input/KeyEvent'),
    gl         = require('../gl/gl'),
    glDraw     = require('../gl/glDraw');

var DEFAULT_WINDOW_WIDTH = 800,
    DEFAULT_WINDOW_HEIGHT = 600;
var DEFAULT_FPS = 60.0;

var KEY_PRESS_THRESHOLD = 100;

/**
 * Base class for all Foam applications.
 * @param {HTMLCanvasElement} [canvas] - Target canvas
 * @returns {App}
 * @constructor
 */

function App(canvas) {
    if (App.__instance) {
        throw new Error(Error.CLASS_IS_SINGLETON);
    }

    if(!window.WebGLRenderingContext){
        this.onWebGLContextNotAvailable();
        return this;
    }

    //
    //  Context & Window
    //
    this.__windowBounds = new Rect();
    this.__windowRatio = 0;
    this.__windowScale = 1.0;

    //
    //  input
    //
    this.__keyDown = false;
    this.__keyStr = '';
    this.__keyCode = '';

    this.__hideCursor = false;

    this.__mouseTimer = null;
    this.__mouse = new Mouse();
    this.__mousePosTemp = new Vec2();
    this.__mousePosLastTemp = new Vec2();
    this.__mousePosition = {position:new Vec2(),positionLast:new Vec2()};

    this._keyboard = new Keyboard();

    //
    //  time
    //
    this.__framenum = 0;
    this.__time = 0;
    this.__timeStart = Date.now();
    this.__timeNext = 0;
    this.__targetFPS = -1;
    this.__timeInterval = -1;
    this.__timeDelta = 0;
    this.__timeElapsed = 0;
    this.__loop = true;

    this.setFPS(DEFAULT_FPS);

    //
    //  canvas & context
    //

    var canvas_ = canvas;

    canvas = this._canvas = canvas_ ? canvas_ : document.createElement('canvas');
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    /**
     * Reference to WebGLRenderingContext
     * @type {CanvasRenderingContext2D}
     * @protected
     */

    var _gl = this._gl = canvas.getContext('webkit-3d') ||
                         canvas.getContext("webgl") ||
                         canvas.getContext("experimental-webgl");

    if(!_gl){
        this.onWebGLContextNotAvailable();
        return this;
    }

    if(canvas_){
        this.setWindowSize(canvas_.width, canvas_.height);
    } else {
        this.setWindowSize(DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT);
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

    var mouse    = this.__mouse,
        keyboard = this._keyboard;
    var self = this;



    function onMouseStopped(){
        mouse._positionLast.x = mouse._position.x;
        mouse._positionLast.y = mouse._position.y;
        mouse._positionLastNormalized.x = mouse._positionNormalized.x;
        mouse._positionLastNormalized.y = mouse._positionNormalized.y;
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
        mouse._positionLastNormalized.x = mouse._positionNormalized.x;
        mouse._positionLastNormalized.y = mouse._positionNormalized.y;
        mouse._positionNormalized.x = mouse._position.x / self.__windowBounds.getWidth();
        mouse._positionNormalized.y = mouse._position.y / self.__windowBounds.getHeight();

        if(mouse._down){
            if(mouse.hasEventListener(MouseEvent.MOUSE_DRAG)){
                mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_DRAG));
            }
        }

        clearTimeout(self.__mouseTimer);
        self.__mouseTimer = setTimeout(onMouseStopped,100);

        if(mouse.hasEventListener(MouseEvent.MOUSE_MOVE)){
            mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_MOVE));
        }
    });

    canvas.addEventListener('mousedown',function(){
        mouse._downLast = mouse._down;
        mouse._down = true;

        if(mouse._down && !mouse._downLast){
            if(mouse.hasEventListener(MouseEvent.MOUSE_PRESSED)){
                mouse.dispatchEvent(new Event(mouse,MouseEvent.MOUSE_PRESSED));
            }
        }

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

    canvas.addEventListener('keydown',function(e){
        keyboard._up   = false;
        keyboard._down = true;
        keyboard._altKey = e.altKey;
        keyboard._ctrlKey = e.ctrlKey;
        keyboard._shiftKey = e.shiftKey;

        keyboard._keyCodePrev = keyboard._keyCode;
        keyboard._keyCode = e.keyCode;

        keyboard._timestampLast = keyboard._timestamp;
        keyboard._timestamp = e.timeStamp;

        if(keyboard._timestamp - keyboard._timestampLast < KEY_PRESS_THRESHOLD) {
            if(keyboard.hasEventListener(KeyEvent.KEY_PRESS)) {
                keyboard.dispatchEvent(new Event(keyboard, KeyEvent.KEY_PRESS));
            }
            return;
        }

        if(keyboard.hasEventListener(KeyEvent.KEY_DOWN)){
            keyboard.dispatchEvent(new Event(keyboard,KeyEvent.KEY_DOWN));
        }
    });

    canvas.addEventListener('keyup',function(e){
        keyboard._down = false;
        keyboard._up   = true;
        keyboard._altKey = keyboard._ctrKey = keyboard._shiftKey = false;

        if(keyboard.hasEventListener(KeyEvent.KEY_DOWN)){
            keyboard.dispatchEvent(new Event(keyboard,KeyEvent.KEY_UP));
        }
    });

    //
    //
    //

    this.setup();

    if(this.__loop){
        var time, timeDelta;
        var timeInterval = this.__timeInterval;
        var timeNext;

        function update_Internal() {
            requestAnimationFrame(update_Internal, null);

            time = self.__time = Date.now();
            timeDelta = time - self.__timeNext;

            self.__timeDelta = Math.min(timeDelta / timeInterval, 1);


            if (timeDelta > timeInterval) {
                timeNext = self.__timeNext = time - (timeDelta % timeInterval);

                self.update();

                self.__timeElapsed = (timeNext - self.__timeStart) / 1000.0;
                self.__framenum++;
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

/**
 * Get an instance of the current program.
 * @returns {App}
 */
App.getInstance = function () {
    return App.__instance;
};

/**
 * Setup
 * @virtual
 */
App.prototype.setup = function () {
    throw new Error(Error.APP_NO_SETUP);
};

/**
 * Update
 * @virtual
 */
App.prototype.update = function () {
    throw new Error(Error.APP_NO_UPDATE);
};

/**
 * Callback if webgl is not available.
 * @virtual
 */
App.prototype.onWebGLContextNotAvailable = function(){
    console.log('FOAM: WebGLContext not available.');
};

/*--------------------------------------------------------------------------------------------*/
//  window
/*--------------------------------------------------------------------------------------------*/

/**
 * Set the window size.
 * @param {Number} width - The width
 * @param {Number} height - The height
 * @param {Number} [scale] - The ratio of pixels per window pixel (default: 1:1)
 */

App.prototype.setWindowSize = function (width, height, scale) {
    var windowScale  = this.__windowScale = scale || this.__windowScale,
        windowBounds = this.__windowBounds;

    width  *= windowScale;
    height *= windowScale;

    if (width  == windowBounds.getWidth() && height == windowBounds.getHeight()){
        return;
    }

    windowBounds.setWidth(width);
    windowBounds.setHeight(height);

    this.__windowRatio = windowBounds.getAspectRatio();
    this._updateCanvasSize();
};

App.prototype._updateCanvasSize = function(){
    var windowWidth = this.__windowBounds.getWidth(),
        windowHeight = this.__windowBounds.getHeight(),
        windowScale = this.__windowScale;

    var canvas = this._canvas;
        canvas.style.width = windowWidth / windowScale + 'px';
        canvas.style.height = windowHeight / windowScale + 'px';
        canvas.width = windowWidth;
        canvas.height = windowHeight;
};

/**
 * Return the current window's bounds.
 * @param {Rect} rect - Out rect
 * @returns {Rect}
 */

App.prototype.getWindowBounds = function(rect){
    return (rect || new Rect()).set(this.__windowBounds);
}

/**
 * Return the window´s current size.
 * @param {Vec2} [v] - Out size
 * @returns {Vec2}
 */

App.prototype.getWindowSize = function (v) {
    return (v || new Vec2()).setf(this.__windowBounds.getWidth(),this.__windowBounds.getHeight());
};

/**
 * Return the window´s current width.
 * @returns {Number}
 */

App.prototype.getWindowWidth = function () {
    return this.__windowBounds.getWidth();
};

/**
 * Return the window´s current height.
 * @returns {Number}
 */

App.prototype.getWindowHeight = function () {
    return this.__windowBounds.getHeight();
};

/**
 * Return the current window aspect ratio.
 * @returns {number}
 */

App.prototype.getWindowAspectRatio = function () {
    return this.__windowRatio;
};

/**
 * Return the current window scale.
 * @returns {number}
 */

App.prototype.getWindowScale = function(){
    return this.__windowScale;
};

/**
 * Callback on window resize.
 */

App.prototype.onWindowResize = function () {};


/*--------------------------------------------------------------------------------------------*/
//  framerate / time
/*--------------------------------------------------------------------------------------------*/

/**
 * Set the target framerate.
 * @param {Number} fps - The framerate
 */

App.prototype.setFPS = function (fps) {
    this.__targetFPS = fps;
    this.__timeInterval = this.__targetFPS / 1000.0;
};

/**
 * Return the current target framerate
 * @returns {Number}
 */

App.prototype.getFPS = function () {
    return this.__targetFPS;
};

/**
 * Return the number of frames elapsed since the program started.
 * @returns {Number}
 */

App.prototype.getFramesElapsed = function () {
    return this.__framenum;
};

/**
 * Return the number of seconds elapsed since the program started.
 * @returns {Number}
 */

App.prototype.getSecondsElapsed = function () {
    return this.__timeElapsed;
};

/**
 * Return the current time.
 * @returns {Number}
 */

App.prototype.getTime = function () {
    return this.__time
};

/**
 * Return the time at program start.
 * @returns {Number}
 */

App.prototype.getTimeStart = function () {
    return this.__timeStart;
};

/**
 * Return the time the between now and the last update call.
 * @returns {Number}
 */

App.prototype.getTimeDelta = function () {
    return this.__timeDelta;
};

/**
 * Set if the program should continously call update.
 * @param {Boolean} loop
 */

App.prototype.loop = function(loop){
    this.__loop = loop;
};

/*--------------------------------------------------------------------------------------------*/
//  lazy init
/*--------------------------------------------------------------------------------------------*/


App._newObj = function(obj,resource){
    if(resource){
        var setup = obj.setup;
        obj.setup = function(){
            setup.call(this,resource);
        }
    }
    function App_(){
        App.call(this);
    }
    App_.prototype = Object.create(App.prototype);
    for( var p in obj ){
        if(obj.hasOwnProperty(p)){
            App_.prototype[p] = obj[p];
        }
    }
    return new App_();
}

/**
 * Factory method. Inititates a program. Called on window load.
 * @param {Object} obj - A program object {setup,update}
 */

App.newOnLoad = function(obj){
    window.addEventListener('load',function(){
        App._newObj(obj);
    });
}

/**
 * Factory method. Initiates a program providing loaded resources.
 * @param {Object|Object[]} resource - The resource / resource-bundle {path, type} to be loaded
 * @param {Object} obj - A program object {setup,update}
 * @param {Function} [callbackError] - Callback if an error occured
 * @param {Function) [callbackProcess] - Callback on load
 * @param {bool} [strict=true] - Abort if at least one resource could not be loaded
 */

App.newOnResource = function(resource, obj, callbackError, callbackProcess, strict){
    Resource.load(resource,function(resource){
        App._newObj(obj,resource);
    }, callbackError, callbackProcess, strict);
}

/**
 * Factory method. Initiates a program providing loaded resources. Called on window load.
 * @param {Object|Object[]} resource - The resource / resource-bundle {path, type} to be loaded
 * @param {Object} obj - A program object {setup,update}
 * @param {Function} [callbackError] - Callback if an error occured
 * @param {Function) [callbackProcess] - Callback on load
 * @param {bool} [strict=true] - Abort if at least one resource could not be loaded
 */

App.newOnLoadWithResource = function(resource, obj, callbackError, callbackProcess, strict){
    window.addEventListener('load',function(){
        Resource.load(resource, function(resource){
            App._newObj(obj,resource);
        }, callbackError, callbackProcess, strict);
    });
}


/**
 * Factory method. Inititates a program.
 * @param {Object|Object[]} resource - The resource / resource-bundle {path, type} to be loaded
 * @param {Object} obj - A program object {setup,update}
 */

App.new = function(resource, obj){
    return App._newObj(obj,resource);
}

module.exports = App;
