;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Foam = require('../../src/foam/foam.js');

function App() {
    Foam.Application.apply(this, arguments);

    this.setFPS(60);
    this.setWindowSize(800, 600);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
};

App.prototype.update = function () {
    var time = this.getSecondsElapsed(),
        zoom = 1 + Math.sin(time) * 0.25;


    console.log(time);
};



var app = new App();

},{"../../src/foam/foam.js":5}],2:[function(require,module,exports){
var Default     = require('../system/common/fDefault'),
    fError      = require('../system/common/fError'),
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

    this._windowWidth  = -1;
    this._windowHeight = -1;
    this._windowRatio  = -1;

    this._isInitialized = false;
}

/*--------------------------------------------------------------------------------------------*/
//  Init
/*--------------------------------------------------------------------------------------------*/

AppImpl.prototype.isInitialized = function () {
    return this._isInitialized;
};

AppImpl.prototype.init = function (appObj) {
    throw new Error(fError.METHOD_NOT_IMPLEMENTED);
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
    throw new Error(fError.METHOD_NOT_IMPLEMENTED);
};

AppImpl.prototype.getWindowWidth = function () {
    return this._windowWidth;
};

AppImpl.prototype.getWindowHeight = function () {
    return this._windowHeight;
};

AppImpl.prototype.getWindowSize = function(){
    return [this._windowWidth,this._windowHeight];
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
    throw new Error(fError.METHOD_NOT_IMPLEMENTED);
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
},{"../system/common/fDefault":8,"../system/common/fError":9,"../util/fObjectUtil":13}],3:[function(require,module,exports){
var Default = require('../system/common/fDefault'),
    AppImpl = require('./fAppImpl'),
    fGL = require('../graphics/fGL');

function AppImplWeb() {
    AppImpl.apply(this, arguments);

    var canvas3d = this._canvas3d = document.createElement('canvas');
        canvas3d.setAttribute('tabindex', '0');
        canvas3d.focus();

    this._context3d = canvas3d.getContext('webkit-3d') ||
                      canvas3d.getContext("webgl") ||
                      canvas3d.getContext("experimental-webgl");

    this._parent = null;
    this._mouseEventTarget = canvas3d;
    this._keyEventTarget = canvas3d;

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame;

}

AppImplWeb.prototype = Object.create(AppImpl.prototype);

AppImplWeb.prototype.getWindow = function () {
    return this._context3d.parentNode;
};

AppImplWeb.prototype.setWindowSize = function (width, height) {
    if (this._isFullWindowFrame) {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    if (width == this._windowWidth && height == this._windowHeight)return;

    this._windowWidth = width;
    this._windowHeight = height;
    this._windowRatio = width / height;

    if (!this._isInitialized) return;

    this._updateCanvas3dSize();
};

AppImplWeb.prototype._init = function (appObj) {
    var self = this;
    var mouse = appObj.mouse;
    var canvas = this._canvas3d;

    document.title = this._windowTitle || document.title;

    if (!this._parent){
        document.body.appendChild(canvas);
    } else {
        this._parent.appendChild(canvas);
    }
    this._updateCanvas3dSize();

    var mouseEventTarget = this._mouseEventTarget,
        keyEventTarget = this._keyEventTarget;


    appObj.fgl = new fGL(this._context3d);

    /*
     appObj.fgl.gl.viewport(0,0,this._windowWidth,this._windowHeight);

     appObj.camera = new CameraBasic();
     appObj.fgl.setCamera(appObj.camera);
     appObj.camera.setPerspective(Default.CAMERA_FOV,
     self._windowRatio,
     Default.CAMERA_NEAR,
     Default.CAMERA_FAR);
     appObj.camera.setTarget3f(0,0,0);
     appObj.camera.updateMatrices();

     appObj.fgl.loadIdentity();
     */

    appObj.setup();

    mouseEventTarget.addEventListener('mousemove',
        function (e) {
            mouse._positionLast[0] = mouse._position[0];
            mouse._positionLast[1] = mouse._position[1];

            mouse._position[0] = e.pageX;
            mouse._position[1] = e.pageY;

            appObj.onMouseMove(e);

        });

    mouseEventTarget.addEventListener('mousedown',
        function (e) {
            self._mouseDown = true;
            appObj.onMouseDown(e);

        });

    mouseEventTarget.addEventListener('mouseup',
        function (e) {
            self._mouseDown = false;
            appObj.onMouseUp(e);

        });

    mouseEventTarget.addEventListener('mousewheel',
        function (e) {
            self._mouseWheelDelta += Math.max(-1, Math.min(1, e.wheelDelta)) * -1;
            appObj.onMouseWheel(e);
        });


    keyEventTarget.addEventListener('keydown',
        function (e) {
            self._keyDown = true;
            self._keyCode = e.keyCode;
            self._keyStr = String.fromCharCode(e.keyCode);//not reliable;
            appObj.onKeyDown(e);

        });

    keyEventTarget.addEventListener('keyup',
        function (e) {
            self._keyDown = false;
            self._keyCode = e.keyCode;
            self._keyStr = String.fromCharCode(e.keyCode);
            appObj.onKeyUp(e);

        });


    var fullWindowFrame = this._isFullWindowFrame;
    var camera;
    var gl;

    var windowWidth,
        windowHeight;

    function updateCameraRatio() {
        camera = appObj.camera;
        camera.setAspectRatio(self._windowRatio);
        camera.updateProjectionMatrix();
    }

    function updateViewportGL() {
        gl = appObj.fgl;
        gl.gl.viewport(0, 0, self._windowWidth, self._windowHeight);
        gl.clearColor(gl.getClearBuffer());
    }


    window.addEventListener('resize',
        function (e) {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;

            if (fullWindowFrame) {
                self.setWindowSize(windowWidth, windowHeight);

                updateCameraRatio();
                updateViewportGL();
            }

            appObj.onWindowResize(e);

            if (!fullWindowFrame && (self._windowWidth == windowWidth && self._windowHeight == windowHeight)) {
                updateCameraRatio();
                updateViewportGL();
            }
        });

    if (this._loop) {
        var time, timeDelta;
        var timeInterval = this._timeInterval;
        var timeNext;

        function update() {
            requestAnimationFrame(update, null);

            time = self._time = Date.now();
            timeDelta = time - self._timeNext;

            self._timeDelta = Math.min(timeDelta / timeInterval, 1);

            if (timeDelta > timeInterval) {
                timeNext = self._timeNext = time - (timeDelta % timeInterval);

                appObj.update();

                self._timeElapsed = (timeNext - self._timeStart) / 1000.0;
                self._framenum++;
            }
        }

        update();
    }
    else appObj.update();

    this._parent = null;
    this._isInitialized = true;

};


AppImplWeb.prototype.init = function (appObj) {
    var self = this;
    window.addEventListener('load', function () {
        self._init(appObj);
    });
};

AppImplWeb.prototype._updateCanvas3dSize = function () {
    var canvas = this._canvas3d,
        width = this._windowWidth,
        height = this._windowHeight;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
};

AppImplWeb.prototype.setMouseListenerTarget = function (obj) {
    this._mouseEventTarget = obj;
};
AppImplWeb.prototype.setKeyListenerTarget = function (obj) {
    this._keyEventTarget = obj;
};
AppImplWeb.prototype.setFullWindowFrame = function (bool) {
    this._isFullWindowFrame = bool;
    return true;
};


module.exports = AppImplWeb;


},{"../graphics/fGL":6,"../system/common/fDefault":8,"./fAppImpl":2}],4:[function(require,module,exports){
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






},{"../system/common/fError":9,"../system/common/fPlatform":10,"../system/fShared":11,"../util/fMouse":12,"../util/fObjectUtil":13,"./fAppImplWeb":3}],5:[function(require,module,exports){
/**
 *
 *
 *  F | O | A | M
 *
 *
 * Foam - A Plask/Web GL toolkit
 *
 * Foam is available under the terms of the MIT license.  The full text of the
 * MIT license is included below.
 *
 * MIT License
 * ===========
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

module.exports = {
    /*
    Math        : require('./math/fMath'),
    Vec2        : require('./math/fVec2'),
    Vec3        : require('./math/fVec3'),
    Vec4        : require('./math/fVec4'),
    Mat33       : require('./math/fMat33'),
    Mat44       : require('./math/fMat44'),
    Quaternion  : require('./math/fQuaternion'),

    MatGL        : require('./graphics/gl/fMatGL'),
    Program      : require('./graphics/gl/fProgram'),
    CameraBasic  : require('./graphics/fCameraBasic'),

    Light            : require('./graphics/gl/light/fLight'),
    PointLight       : require('./graphics/gl/light/fPointLight'),
    DirectionalLight : require('./graphics/gl/light/fDirectionalLight'),
    SpotLight        : require('./graphics/gl/light/fSpotLight'),

    Material      : require('./graphics/gl/fMaterial'),
    Texture       : require('./graphics/gl/texture/fTexture'),
    CanvasTexture : require('./graphics/gl/texture/fCanvasTexture'),

    fGLUtil     : require('./graphics/fGLUtil'),
    fGL         : require('./graphics/fGL'),

    Mouse       : require('./util/fMouse'),
    MouseState  : require('./util/fMouseState'),
    Color       : require('./util/fColor'),
    Util        : require('./util/fUtil'),

    Platform    : require('./system/common/fPlatform'),
    System      : require('./system/fSystem'),

    Flags : require('./system/fFlags'),
    */
    Application : require('./app/fApplication')

};


},{"./app/fApplication":4}],6:[function(require,module,exports){


function GL(){


     for(var p in WebGLRenderingContext){
         this[p] = WebGLRenderingContext[p];
     }

}




module.exports = GL;
},{}],7:[function(require,module,exports){
var Vec2 =
{
    SIZE : 2,

    make : function()
    {
        return new Float32Array([0,0]);
    }
};

module.exports = Vec2;
},{}],8:[function(require,module,exports){
module.exports =
{
    APP_WIDTH  : 800,
    APP_HEIGHT : 600,

    APP_FPS : 30,

    APP_PLASK_WINDOW_TITLE : '',
    APP_PLASK_TYPE  : '3d',
    APP_PLASK_VSYNC : 'false',
    APP_PLASK_MULTISAMPLE : true,

    CAMERA_FOV : 45,
    CAMERA_NEAR : 0.1,
    CAMERA_FAR  : 100

};
},{}],9:[function(require,module,exports){
module.exports =
{
    METHOD_NOT_IMPLEMENTED: 'Method not implemented in target platform.',
    CLASS_IS_SINGLETON:     'Application is singleton. Get via getInstance().',
    APP_NO_SETUP:           'No setup method added to app.',
    APP_NO_UPDATE :         'No update method added to app.',
    PLASK_WINDOW_SIZE_SET:  'Plask window size can only be set on startup.',
    WRONG_PLATFORM:         'Wrong Platform.',
    MATRIX_STACK_POP_ERROR: 'Matrix stack invalid pop.',
    VERTICES_IN_WRONG_SIZE: 'Vertices array has wrong length. Should be ',
    COLORS_IN_WRONG_SIZE:   'Color array length not equal to number of vertices.',
    DIRECTORY_DOESNT_EXIST: 'File target directory does not exist.',
    FILE_DOESNT_EXIST:      'File does not exist.',
    TEXTURE_WIDTH_NOT_P2:   'Texture imageData is not power of 2.',
    TEXTURE_HEIGHT_NOT_P2:  'Texture imageData is not power of 2.',
    TEXTURE_IMAGE_DATA_NULL:'Texture imageData is null.'
};
},{}],10:[function(require,module,exports){
var Platform = {WEB:'WEB',PLASK:'PLASK',NODE_WEBKIT:'NODE_WEBKIT'};
    Platform.__target = null;

Platform.getTarget  = function()
{

    if(!this.__target)
    {
        var bWindow     = typeof window !== 'undefined',
            bDocument   = typeof document !== 'undefined',
            bRequireF   = typeof require == 'function',
            bRequire    = !!require,
            bNodeWebkit = false;

        //TODO fix
        //hm this needs to be fixed -> browserify require vs node-webkit require
        //for now this does the job
        if(bDocument){
            bNodeWebkit = document.createElement('IFRAME').hasOwnProperty('nwdisable');
        }

        this.__target = (bWindow && bDocument && !bNodeWebkit) ? this.WEB :
                        (bWindow && bDocument &&  bNodeWebkit) ? this.NODE_WEBKIT :
                        (!bWindow && !bDocument && bRequireF && bRequire) ? this.PLASK :
                        null;

    }

    return this.__target;
};

module.exports = Platform;
},{}],11:[function(require,module,exports){
//temp
var Shared =
{
    __windowSize : new Float32Array([0,0])
};

module.exports = Shared;
},{}],12:[function(require,module,exports){
var fError     = require('../system/common/fError'),
    Vec2       = require('../math/fVec2');

function Mouse()
{
    if(Mouse.__instance)throw new Error(fError.CLASS_IS_SINGLETON);

    this._position     = Vec2.make();
    this._positionLast = Vec2.make();
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
},{"../math/fVec2":7,"../system/common/fError":9}],13:[function(require,module,exports){
var ObjectUtil = {

    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },

    isFloat32Array: function (arr) {
        return arr instanceof  Float32Array;
    },

    safeFloat32Array: function (arr) {
        return arr instanceof Float32Array ? arr : new Float32Array(arr);
    },

    safeUint16Array: function (arr) {
        return arr instanceof Uint16Array ? arr : new Uint16Array(arr);
    },

    copyFloat32Array: function (arr) {
        return new Float32Array(arr);
    },

    arrayResized: function (arr, len) {
        arr.length = len;
        return arr;
    },

    copyArray: function (arr) {
        var i = -1, l = arr.length, out = new Array(l);
        while (++i < l) {
            out[i] = arr[i];
        }
        return out;
    },

    setArray: function (a, b) {
        var i = -1, l = a.length;
        while (++i < l) {
            a[i] = b[i];
        }
    },

    setArrayOffsetIndex: function (arr, offset, len) {
        var i = -1, l = len || arr.length;
        while (++i < l) {
            arr[i] += offset;
        }
    },

    //check for content not object equality, object is number
    equalArrContent: function (a, b) {
        if (!a || !b || (!a && !b)) {
            return false;
        } else if (a.length != b.length) {
            return false
        } else {
            var i = -1, l = a.length;
            while (++i < l) {
                if (a[i] != b[i])return false;
            }
        }
        return true;
    },


    getFunctionBody: function (func) {
        return (func).toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
    },

    __toString: function (obj) {
        return Object.prototype.toString.call(obj);
    },

    isArray: function (obj) {
        return this.__toString(obj) == '[object Array]';
    },

    isObject: function (obj) {
        return obj === Object(obj)
    },

    isFunction: function (obj) {
        return this.__toString(obj) == '[object Function]';
    },

    isString: function (obj) {
        return this.__toString(obj) == '[object String]';
    },


    isFloat64Array: function (obj) {
        return this.__toString(obj) == '[object Float64Array]'
    },

    isUint8Array: function (obj) {
        return this.__toString(obj) == '[object Uint8Array]';
    },

    isUint16Array: function (obj) {
        return this.__toString(obj) == '[object Uint16Array]'
    },

    isUint32Array: function (obj) {
        return this.__toString(obj) == '[object Uint32Array]'
    },

    isTypedArray: function (obj) {
        return this.isUint8Array(obj) ||
            this.isUint16Array(obj) ||
            this.isUint32Array(obj) ||
            this.isFloat32Array(obj) ||
            this.isFloat32Array(obj);
    },

    toString: function (obj) {
        return this.isFunction(obj) ? this.getFunctionString(obj) :
            this.isArray(obj) ? this.getArrayString(obj) :
                this.isString(obj) ? this.getString(obj) :
                    this.isTypedArray(obj) ? this.getTypedArrayString(obj) :
                        this.isObject(obj) ? this.getObjectString(obj) :
                            obj;
    },

    getTypedArrayString: function (obj) {
        if (!this.isFloat32Array(obj)) {
            throw new TypeError('Object must be of type Float32Array');
        }

        if (obj.byteLength == 0)return '[]';
        var out = '[';

        for (var p in obj) {
            out += obj[p] + ',';
        }

        return out.substr(0, out.lastIndexOf(',')) + ']';

    },

    getString: function (obj) {
        return '"' + obj + '"';
    },

    getArrayString: function (obj) {
        if (!this.isArray(obj)) {
            throw new TypeError('Object must be of type array.');
        }
        var out = '[';
        if (obj.length == 0) {
            return out + ']';
        }

        var i = -1;
        while (++i < obj.length) {
            out += this.toString(obj[i]) + ',';
        }

        return out.substr(0, out.lastIndexOf(',')) + ']';
    },

    getObjectString: function (obj) {
        if (!this.isObject(obj)) {
            throw new TypeError('Object must be of type object.')
        }
        var out = '{';
        if (Object.keys(obj).length == 0) {
            return out + '}';
        }

        for (var p in obj) {
            out += p + ':' + this.toString(obj[p]) + ',';
        }

        return out.substr(0, out.lastIndexOf(',')) + '}';
    },

    //
    //  Parses func to string,
    //  must satisfy (if 'class'):
    //
    //  function ClassB(){
    //      ClassB.apply(this,arguments);ClassB.call...
    //  }
    //
    //  ClassB.prototype = Object.create(ClassA.prototype)
    //
    //  ClassB.prototype.method = function(){};
    //
    //  ClassB.STATIC = 1;
    //  ClassB.STATIC_OBJ = {};
    //  ClassB.STATIC_ARR = [];
    //

    getFunctionString: function (obj) {
        if (!this.isFunction(obj)) {
            throw new TypeError('Object must be of type function.');
        }

        var out = '';

        var name = obj.name,
            constructor = obj.toString(),
            inherited = 1 + constructor.indexOf('.call(this') || 1 + constructor.indexOf('.apply(this');

        out += constructor;

        if (inherited) {
            out += '\n\n';
            inherited -= 2;

            var baseClass = '';
            var char = '',
                i = 0;
            while (char != ' ') {
                baseClass = char + baseClass;
                char = constructor.substr(inherited - i, 1);
                ++i;
            }
            out += name + '.prototype = Object.create(' + baseClass + '.prototype);';
        }

        for (var p in obj) {
            out += '\n\n' + name + '.' + p + ' = ' + this.toString(obj[p]) + ';';
        }

        var prototype = obj.prototype;
        for (var p in prototype) {
            if (prototype.hasOwnProperty(p)) {
                out += '\n\n' + name + '.prototype.' + p + ' = ' + this.toString(prototype[p]) + ';';

            }
        }

        return out;
    }
};

module.exports = ObjectUtil;

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vZXhhbXBsZXMvMDBfQmFzaWNfQXBwbGljYXRpb24vYXBwLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2FwcC9mQXBwSW1wbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9hcHAvZkFwcEltcGxXZWIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vYXBwL2ZBcHBsaWNhdGlvbi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9mb2FtLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL2ZHTC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9tYXRoL2ZWZWMyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL3N5c3RlbS9jb21tb24vZkRlZmF1bHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vc3lzdGVtL2NvbW1vbi9mRXJyb3IuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vc3lzdGVtL2NvbW1vbi9mUGxhdGZvcm0uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vc3lzdGVtL2ZTaGFyZWQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mTW91c2UuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mT2JqZWN0VXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZvYW0gPSByZXF1aXJlKCcuLi8uLi9zcmMvZm9hbS9mb2FtLmpzJyk7XG5cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICBGb2FtLkFwcGxpY2F0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLnNldEZQUyg2MCk7XG4gICAgdGhpcy5zZXRXaW5kb3dTaXplKDgwMCwgNjAwKTtcbn1cblxuQXBwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRm9hbS5BcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xuXG5BcHAucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24gKCkge1xufTtcblxuQXBwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpbWUgPSB0aGlzLmdldFNlY29uZHNFbGFwc2VkKCksXG4gICAgICAgIHpvb20gPSAxICsgTWF0aC5zaW4odGltZSkgKiAwLjI1O1xuXG5cbiAgICBjb25zb2xlLmxvZyh0aW1lKTtcbn07XG5cblxuXG52YXIgYXBwID0gbmV3IEFwcCgpO1xuIiwidmFyIERlZmF1bHQgICAgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2NvbW1vbi9mRGVmYXVsdCcpLFxuICAgIGZFcnJvciAgICAgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2NvbW1vbi9mRXJyb3InKSxcbiAgICBPYmplY3RVdGlsICA9IHJlcXVpcmUoJy4uL3V0aWwvZk9iamVjdFV0aWwnKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyAgQ29uc3RydWN0b3Jcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5mdW5jdGlvbiBBcHBJbXBsKCkge1xuICAgIHRoaXMuX2NvbnRleHQzZCA9IG51bGw7XG5cbiAgICB0aGlzLl93aW5kb3dUaXRsZSA9IDA7XG4gICAgdGhpcy5faXNGdWxsV2luZG93RnJhbWUgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0Z1bGxzY3JlZW4gPSBmYWxzZTtcbiAgICB0aGlzLl9pc0JvcmRlcmxlc3MgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwbGF5SWQgPSAwO1xuXG4gICAgdGhpcy5fa2V5RG93biA9IGZhbHNlO1xuICAgIHRoaXMuX2tleVN0ciA9ICcnO1xuICAgIHRoaXMuX2tleUNvZGUgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcblxuICAgIHRoaXMuX21vdXNlTW92ZSA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlQm91bmRzID0gdHJ1ZTtcbiAgICB0aGlzLl9oaWRlQ3Vyc29yID0gZmFsc2U7XG5cbiAgICB0aGlzLl90YXJnZXRGUFMgPSBEZWZhdWx0LkFQUF9GUFM7XG4gICAgdGhpcy5fbG9vcCA9IHRydWU7XG5cbiAgICB0aGlzLl9mcmFtZW51bSA9IDA7XG4gICAgdGhpcy5fdGltZSA9IDA7XG4gICAgdGhpcy5fdGltZVN0YXJ0ID0gLTE7XG4gICAgdGhpcy5fdGltZU5leHQgPSAwO1xuICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbiAgICB0aGlzLl90aW1lRGVsdGEgPSAwO1xuICAgIHRoaXMuX3RpbWVFbGFwc2VkID0gMDtcblxuICAgIHRoaXMuX3dpbmRvd1dpZHRoICA9IC0xO1xuICAgIHRoaXMuX3dpbmRvd0hlaWdodCA9IC0xO1xuICAgIHRoaXMuX3dpbmRvd1JhdGlvICA9IC0xO1xuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IGZhbHNlO1xufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICBJbml0XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuQXBwSW1wbC5wcm90b3R5cGUuaXNJbml0aWFsaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNJbml0aWFsaXplZDtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoYXBwT2JqKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTtcbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyAgZHJhdyAvIHVwZGF0YVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuQXBwSW1wbC5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgaWYoT2JqZWN0VXRpbC5pc1VuZGVmaW5lZChib29sKSl7XG4gICAgICAgIHRoaXMuX2xvb3AgPSB0cnVlO1xuICAgIH1lbHNle1xuICAgICAgICB0aGlzLl9sb29wID0gYm9vbDtcbiAgICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICB3aW5kb3dcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRXaW5kb3dTaXplID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZkVycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0V2luZG93V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1dpZHRoO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0V2luZG93SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl93aW5kb3dIZWlnaHQ7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gW3RoaXMuX3dpbmRvd1dpZHRoLHRoaXMuX3dpbmRvd0hlaWdodF07XG59O1xuXG5cbkFwcEltcGwucHJvdG90eXBlLmdldFdpbmRvd0FzcGVjdFJhdGlvID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl93aW5kb3dSYXRpbztcbn07XG5cbi8qXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRGdWxsV2luZG93RnJhbWUgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihmRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0Z1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNGdWxsV2luZG93RnJhbWU7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNGdWxsc2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0Z1bGxzY3JlZW47XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0JvcmRlcmxlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzQm9yZGVybGVzcztcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLnNldERpc3BsYXkgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbkFwcEltcGwucHJvdG90eXBlLmdldERpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc3BsYXlJZDtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLmdldFdpbmRvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZkVycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO1xufTtcbiovXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIGZyYW1lcmF0ZSAvIHRpbWVcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRGUFMgPSBmdW5jdGlvbiAoZnBzKSB7XG4gICAgdGhpcy5fdGFyZ2V0RlBTID0gZnBzO1xuICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLmdldEZQUyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0RlBTO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZnJhbWVudW07XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVFbGFwc2VkO1xufTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUaW1lU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVTdGFydDtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVEZWx0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGltZURlbHRhO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBpbnB1dFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkFwcEltcGwucHJvdG90eXBlLmhpZGVNb3VzZUN1cnNvciA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLnNldFdpbmRvd1RpdGxlID0gZnVuY3Rpb24gKHRpdGxlKSB7XG4gICAgdGhpcy5fd2luZG93VGl0bGUgPSB0aXRsZTtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLnJlc3RyaWN0TW91c2VUb0ZyYW1lID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICB0aGlzLl9tb3VzZUJvdW5kcyA9IGJvb2w7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0tleURvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleURvd247XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNNb3VzZURvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vdXNlRG93bjtcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5pc01vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW91c2VNb3ZlO1xufTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleUNvZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleUNvZGU7XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0S2V5U3RyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlTdHI7XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tb3VzZVdoZWVsRGVsdGE7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRNb3VzZUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbDsiLCJ2YXIgRGVmYXVsdCA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vZkRlZmF1bHQnKSxcbiAgICBBcHBJbXBsID0gcmVxdWlyZSgnLi9mQXBwSW1wbCcpLFxuICAgIGZHTCA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2ZHTCcpO1xuXG5mdW5jdGlvbiBBcHBJbXBsV2ViKCkge1xuICAgIEFwcEltcGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBjYW52YXMzZCA9IHRoaXMuX2NhbnZhczNkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhczNkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBjYW52YXMzZC5mb2N1cygpO1xuXG4gICAgdGhpcy5fY29udGV4dDNkID0gY2FudmFzM2QuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuXG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0ID0gY2FudmFzM2Q7XG4gICAgdGhpcy5fa2V5RXZlbnRUYXJnZXQgPSBjYW52YXMzZDtcblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxufVxuXG5BcHBJbXBsV2ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwSW1wbC5wcm90b3R5cGUpO1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5nZXRXaW5kb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHQzZC5wYXJlbnROb2RlO1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYgKHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lKSB7XG4gICAgICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB9XG4gICAgaWYgKHdpZHRoID09IHRoaXMuX3dpbmRvd1dpZHRoICYmIGhlaWdodCA9PSB0aGlzLl93aW5kb3dIZWlnaHQpcmV0dXJuO1xuXG4gICAgdGhpcy5fd2luZG93V2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLl93aW5kb3dIZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fd2luZG93UmF0aW8gPSB3aWR0aCAvIGhlaWdodDtcblxuICAgIGlmICghdGhpcy5faXNJbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uIChhcHBPYmopIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1vdXNlID0gYXBwT2JqLm1vdXNlO1xuICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMzZDtcblxuICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5fd2luZG93VGl0bGUgfHwgZG9jdW1lbnQudGl0bGU7XG5cbiAgICBpZiAoIXRoaXMuX3BhcmVudCl7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wYXJlbnQuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICB9XG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG5cbiAgICB2YXIgbW91c2VFdmVudFRhcmdldCA9IHRoaXMuX21vdXNlRXZlbnRUYXJnZXQsXG4gICAgICAgIGtleUV2ZW50VGFyZ2V0ID0gdGhpcy5fa2V5RXZlbnRUYXJnZXQ7XG5cblxuICAgIGFwcE9iai5mZ2wgPSBuZXcgZkdMKHRoaXMuX2NvbnRleHQzZCk7XG5cbiAgICAvKlxuICAgICBhcHBPYmouZmdsLmdsLnZpZXdwb3J0KDAsMCx0aGlzLl93aW5kb3dXaWR0aCx0aGlzLl93aW5kb3dIZWlnaHQpO1xuXG4gICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICAgYXBwT2JqLmZnbC5zZXRDYW1lcmEoYXBwT2JqLmNhbWVyYSk7XG4gICAgIGFwcE9iai5jYW1lcmEuc2V0UGVyc3BlY3RpdmUoRGVmYXVsdC5DQU1FUkFfRk9WLFxuICAgICBzZWxmLl93aW5kb3dSYXRpbyxcbiAgICAgRGVmYXVsdC5DQU1FUkFfTkVBUixcbiAgICAgRGVmYXVsdC5DQU1FUkFfRkFSKTtcbiAgICAgYXBwT2JqLmNhbWVyYS5zZXRUYXJnZXQzZigwLDAsMCk7XG4gICAgIGFwcE9iai5jYW1lcmEudXBkYXRlTWF0cmljZXMoKTtcblxuICAgICBhcHBPYmouZmdsLmxvYWRJZGVudGl0eSgpO1xuICAgICAqL1xuXG4gICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsXG4gICAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25MYXN0WzBdID0gbW91c2UuX3Bvc2l0aW9uWzBdO1xuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uTGFzdFsxXSA9IG1vdXNlLl9wb3NpdGlvblsxXTtcblxuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzBdID0gZS5wYWdlWDtcbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvblsxXSA9IGUucGFnZVk7XG5cbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlTW92ZShlKTtcblxuICAgICAgICB9KTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyxcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZURvd24oZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLFxuICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZVVwKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJyxcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlV2hlZWxEZWx0YSArPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZS53aGVlbERlbHRhKSkgKiAtMTtcbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlV2hlZWwoZSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICBrZXlFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5fa2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgIHNlbGYuX2tleVN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTsvL25vdCByZWxpYWJsZTtcbiAgICAgICAgICAgIGFwcE9iai5vbktleURvd24oZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBrZXlFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsXG4gICAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZWxmLl9rZXlEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgc2VsZi5fa2V5U3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpO1xuICAgICAgICAgICAgYXBwT2JqLm9uS2V5VXAoZSk7XG5cbiAgICAgICAgfSk7XG5cblxuICAgIHZhciBmdWxsV2luZG93RnJhbWUgPSB0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZTtcbiAgICB2YXIgY2FtZXJhO1xuICAgIHZhciBnbDtcblxuICAgIHZhciB3aW5kb3dXaWR0aCxcbiAgICAgICAgd2luZG93SGVpZ2h0O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2FtZXJhUmF0aW8oKSB7XG4gICAgICAgIGNhbWVyYSA9IGFwcE9iai5jYW1lcmE7XG4gICAgICAgIGNhbWVyYS5zZXRBc3BlY3RSYXRpbyhzZWxmLl93aW5kb3dSYXRpbyk7XG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlVmlld3BvcnRHTCgpIHtcbiAgICAgICAgZ2wgPSBhcHBPYmouZmdsO1xuICAgICAgICBnbC5nbC52aWV3cG9ydCgwLCAwLCBzZWxmLl93aW5kb3dXaWR0aCwgc2VsZi5fd2luZG93SGVpZ2h0KTtcbiAgICAgICAgZ2wuY2xlYXJDb2xvcihnbC5nZXRDbGVhckJ1ZmZlcigpKTtcbiAgICB9XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLFxuICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGZ1bGxXaW5kb3dGcmFtZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2V0V2luZG93U2l6ZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHVwZGF0ZUNhbWVyYVJhdGlvKCk7XG4gICAgICAgICAgICAgICAgdXBkYXRlVmlld3BvcnRHTCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcHBPYmoub25XaW5kb3dSZXNpemUoZSk7XG5cbiAgICAgICAgICAgIGlmICghZnVsbFdpbmRvd0ZyYW1lICYmIChzZWxmLl93aW5kb3dXaWR0aCA9PSB3aW5kb3dXaWR0aCAmJiBzZWxmLl93aW5kb3dIZWlnaHQgPT0gd2luZG93SGVpZ2h0KSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUNhbWVyYVJhdGlvKCk7XG4gICAgICAgICAgICAgICAgdXBkYXRlVmlld3BvcnRHTCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIGlmICh0aGlzLl9sb29wKSB7XG4gICAgICAgIHZhciB0aW1lLCB0aW1lRGVsdGE7XG4gICAgICAgIHZhciB0aW1lSW50ZXJ2YWwgPSB0aGlzLl90aW1lSW50ZXJ2YWw7XG4gICAgICAgIHZhciB0aW1lTmV4dDtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlLCBudWxsKTtcblxuICAgICAgICAgICAgdGltZSA9IHNlbGYuX3RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGltZURlbHRhID0gdGltZSAtIHNlbGYuX3RpbWVOZXh0O1xuXG4gICAgICAgICAgICBzZWxmLl90aW1lRGVsdGEgPSBNYXRoLm1pbih0aW1lRGVsdGEgLyB0aW1lSW50ZXJ2YWwsIDEpO1xuXG4gICAgICAgICAgICBpZiAodGltZURlbHRhID4gdGltZUludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGltZU5leHQgPSBzZWxmLl90aW1lTmV4dCA9IHRpbWUgLSAodGltZURlbHRhICUgdGltZUludGVydmFsKTtcblxuICAgICAgICAgICAgICAgIGFwcE9iai51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuX3RpbWVFbGFwc2VkID0gKHRpbWVOZXh0IC0gc2VsZi5fdGltZVN0YXJ0KSAvIDEwMDAuMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9mcmFtZW51bSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICAgIGVsc2UgYXBwT2JqLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcblxufTtcblxuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGFwcE9iaikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5faW5pdChhcHBPYmopO1xuICAgIH0pO1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuX3VwZGF0ZUNhbnZhczNkU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzM2QsXG4gICAgICAgIHdpZHRoID0gdGhpcy5fd2luZG93V2lkdGgsXG4gICAgICAgIGhlaWdodCA9IHRoaXMuX3dpbmRvd0hlaWdodDtcblxuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0ID0gb2JqO1xufTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldEtleUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHRoaXMuX2tleUV2ZW50VGFyZ2V0ID0gb2JqO1xufTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgdGhpcy5faXNGdWxsV2luZG93RnJhbWUgPSBib29sO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEltcGxXZWI7XG5cbiIsInZhciBmRXJyb3IgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL2ZFcnJvcicpLFxuICAgIE9iamVjdFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL2ZPYmplY3RVdGlsJyksXG4gICAgUGxhdGZvcm0gPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL2ZQbGF0Zm9ybScpLFxuICAgIFNoYXJlZCA9IHJlcXVpcmUoJy4uL3N5c3RlbS9mU2hhcmVkJyksXG4gICAgQXBwSW1wbFdlYiA9IHJlcXVpcmUoJy4vZkFwcEltcGxXZWInKSxcbiAgICBNb3VzZSA9IHJlcXVpcmUoJy4uL3V0aWwvZk1vdXNlJyk7XG5cblxuZnVuY3Rpb24gQXBwbGljYXRpb24oKSB7XG4gICAgaWYgKEFwcGxpY2F0aW9uLl9faW5zdGFuY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5DTEFTU19JU19TSU5HTEVUT04pO1xuICAgIH1cblxuICAgIHZhciB0YXJnZXQgPSBQbGF0Zm9ybS5nZXRUYXJnZXQoKTtcbiAgICBpZiAoT2JqZWN0VXRpbC5pc1VuZGVmaW5lZCh0YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmRXJyb3IuV1JPTkdfUExBVEZPUk0pO1xuICAgIH1cblxuICAgIHRoaXMubW91c2UgPSBuZXcgTW91c2UoKTtcbiAgICB0aGlzLmZnbCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuXG4gICAgLypcbiAgICAgdGhpcy5fYXBwSW1wbCA9IHRhcmdldCA9PSBQbGF0Zm9ybS5XRUIgICAgICAgICA/IG5ldyBBcHBJbXBsV2ViKGFyZ3VtZW50cykgOlxuICAgICB0YXJnZXQgPT0gUGxhdGZvcm0uTk9ERV9XRUJLSVQgPyBuZXcgQXBwSW1wbE5vZGVXZWJraXQoYXJndW1lbnRzKSA6XG4gICAgIHRhcmdldCA9PSBQbGF0Zm9ybS5QTEFTSyAgICAgICA/IG5ldyBBcHBJbXBsUGxhc2soYXJndW1lbnRzKSA6XG4gICAgIG51bGw7XG4gICAgICovXG5cbiAgICB0aGlzLl9hcHBJbXBsID0gbmV3IEFwcEltcGxXZWIoYXJndW1lbnRzKTtcblxuICAgIEFwcGxpY2F0aW9uLl9faW5zdGFuY2UgPSB0aGlzO1xufVxuXG5BcHBsaWNhdGlvbi5fX2luc3RhbmNlID0gbnVsbDtcbkFwcGxpY2F0aW9uLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBBcHBsaWNhdGlvbi5fX2luc3RhbmNlO1xufTtcblxuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5BUFBfTk9fU0VUVVApO1xufTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5BUFBfTk9fVVBEQVRFKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIHdpbmRvd1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRXaW5kb3dTaXplID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB2YXIgYXBwSW1wbCA9IHRoaXMuX2FwcEltcGw7XG4gICAgYXBwSW1wbC5zZXRXaW5kb3dTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgU2hhcmVkLl9fd2luZG93U2l6ZVswXSA9IHdpZHRoO1xuICAgIFNoYXJlZC5fX3dpbmRvd1NpemVbMV0gPSBoZWlnaHQ7XG5cbiAgICBpZiAoIWFwcEltcGwuaXNJbml0aWFsaXplZCgpKWFwcEltcGwuaW5pdCh0aGlzKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvd1NpemUoKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRXaW5kb3dXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRXaW5kb3dXaWR0aCgpO1xufTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFdpbmRvd0hlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRXaW5kb3dIZWlnaHQoKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRXaW5kb3dBc3BlY3RSYXRpbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRXaW5kb3dBc3BlY3RSYXRpbygpO1xufTtcblxuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiAoZSkge1xufTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICBmcmFtZXJhdGUgLyB0aW1lXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldEZQUyA9IGZ1bmN0aW9uIChmcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXRGUFMoZnBzKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRGUFMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RlBTKCk7XG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRGcmFtZXNFbGFwc2VkKCk7XG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0U2Vjb25kc0VsYXBzZWQoKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWUoKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZVN0YXJ0KCk7XG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZURlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVEZWx0YSgpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyAgaW5wdXRcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc0tleURvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcEltcGwuaXNLZXlEb3duKCk7XG59O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzTW91c2VEb3duID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VEb3duKCk7XG59O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzTW91c2VNb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VNb3ZlKCk7XG59O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldEtleVN0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRLZXlTdHIoKTtcbn07XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0S2V5Q29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRLZXlDb2RlKCk7XG59O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldE1vdXNlV2hlZWxEZWx0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRNb3VzZVdoZWVsRGVsdGEoKTtcbn07XG5cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uS2V5RG93biA9IGZ1bmN0aW9uIChlKSB7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbktleVVwID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uTW91c2VVcCA9IGZ1bmN0aW9uIChlKSB7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChlKSB7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlV2hlZWwgPSBmdW5jdGlvbiAoZSkge307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZU1vdmUgPSBmdW5jdGlvbiAoZSkge307XG5cblxuLypcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0V2luZG93V2lkdGggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRXaW5kb3dXaWR0aCgpO307XG4gQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFdpbmRvd0hlaWdodCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0V2luZG93SGVpZ2h0KCk7fTtcblxuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRVcGRhdGUgPSBmdW5jdGlvbihib29sKXt0aGlzLl9hcHBJbXBsLnNldFVwZGF0ZShib29sKTt9O1xuXG5cblxuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRXaW5kb3dUaXRsZSAgICAgICA9IGZ1bmN0aW9uKHRpdGxlKXt0aGlzLl9hcHBJbXBsLnNldFdpbmRvd1RpdGxlKHRpdGxlKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5yZXN0cmljdE1vdXNlVG9GcmFtZSA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9hcHBJbXBsLnJlc3RyaWN0TW91c2VUb0ZyYW1lKGJvb2wpO307XG4gQXBwbGljYXRpb24ucHJvdG90eXBlLmhpZGVNb3VzZUN1cnNvciAgICAgID0gZnVuY3Rpb24oYm9vbCkge3RoaXMuX2FwcEltcGwuaGlkZU1vdXNlQ3Vyc29yKGJvb2wpO307XG5cbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEZ1bGxXaW5kb3dGcmFtZShib29sKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbHNjcmVlbih0cnVlKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc0Z1bGxzY3JlZW4gICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNGdWxsc2NyZWVuKCk7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyAgICAgICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEJvcmRlcmxlc3MoYm9vbCk7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzQm9yZGVybGVzcygpO307XG4gQXBwbGljYXRpb24ucHJvdG90eXBlLnNldERpc3BsYXkgICAgICAgICAgPSBmdW5jdGlvbihudW0pIHtyZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXREaXNwbGF5KG51bSk7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RGlzcGxheSAgICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmdldERpc3BsYXkoKTt9O1xuXG4gQXBwbGljYXRpb24ucHJvdG90eXBlLnNldEZQUyA9IGZ1bmN0aW9uKGZwcyl7dGhpcy5fYXBwSW1wbC5zZXRGUFMoZnBzKTt9O1xuXG5cbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNLZXlEb3duICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc0tleURvd24oKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc01vdXNlRG93biAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VEb3duKCk7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNNb3VzZU1vdmUgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc01vdXNlTW92ZSgpO307XG4gQXBwbGljYXRpb24ucHJvdG90eXBlLmdldEtleVN0ciAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0S2V5U3RyKCk7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0S2V5Q29kZSAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRLZXlDb2RlKCk7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRNb3VzZVdoZWVsRGVsdGEoKTt9O1xuXG5cbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUub25LZXlEb3duICAgID0gZnVuY3Rpb24oZSl7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUub25LZXlVcCAgICAgID0gZnVuY3Rpb24oZSl7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZVVwICAgID0gZnVuY3Rpb24oZSl7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZURvd24gID0gZnVuY3Rpb24oZSl7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZVdoZWVsID0gZnVuY3Rpb24oZSl7fTtcbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZU1vdmUgID0gZnVuY3Rpb24oZSl7fTtcblxuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKGUpe307XG5cbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEZyYW1lc0VsYXBzZWQoKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0U2Vjb25kc0VsYXBzZWQoKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZSgpO307XG4gQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWVTdGFydCAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lU3RhcnQoKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lTmV4dCAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZU5leHQoKTt9O1xuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZURlbHRhKCk7fTtcblxuIEFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRXaW5kb3cgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvdygpO307XG5cbiBBcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0V2luZG93QXNwZWN0UmF0aW8gPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvd0FzcGVjdFJhdGlvKCk7fTtcblxuIEFwcGxpY2F0aW9uLl9faW5zdGFuY2UgICA9IG51bGw7XG4gQXBwbGljYXRpb24uZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpe3JldHVybiBBcHBsaWNhdGlvbi5fX2luc3RhbmNlO307XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb247XG5cblxuXG5cblxuIiwiLyoqXG4gKlxuICpcbiAqICBGIHwgTyB8IEEgfCBNXG4gKlxuICpcbiAqIEZvYW0gLSBBIFBsYXNrL1dlYiBHTCB0b29sa2l0XG4gKlxuICogRm9hbSBpcyBhdmFpbGFibGUgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS4gIFRoZSBmdWxsIHRleHQgb2YgdGhlXG4gKiBNSVQgbGljZW5zZSBpcyBpbmNsdWRlZCBiZWxvdy5cbiAqXG4gKiBNSVQgTGljZW5zZVxuICogPT09PT09PT09PT1cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgSGVucnlrIFdvbGxpay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqIFNPRlRXQVJFLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvKlxuICAgIE1hdGggICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZNYXRoJyksXG4gICAgVmVjMiAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZlZlYzInKSxcbiAgICBWZWMzICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9mVmVjMycpLFxuICAgIFZlYzQgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZWZWM0JyksXG4gICAgTWF0MzMgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZk1hdDMzJyksXG4gICAgTWF0NDQgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZk1hdDQ0JyksXG4gICAgUXVhdGVybmlvbiAgOiByZXF1aXJlKCcuL21hdGgvZlF1YXRlcm5pb24nKSxcblxuICAgIE1hdEdMICAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZk1hdEdMJyksXG4gICAgUHJvZ3JhbSAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9mUHJvZ3JhbScpLFxuICAgIENhbWVyYUJhc2ljICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZkNhbWVyYUJhc2ljJyksXG5cbiAgICBMaWdodCAgICAgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9saWdodC9mTGlnaHQnKSxcbiAgICBQb2ludExpZ2h0ICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9saWdodC9mUG9pbnRMaWdodCcpLFxuICAgIERpcmVjdGlvbmFsTGlnaHQgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2xpZ2h0L2ZEaXJlY3Rpb25hbExpZ2h0JyksXG4gICAgU3BvdExpZ2h0ICAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvbGlnaHQvZlNwb3RMaWdodCcpLFxuXG4gICAgTWF0ZXJpYWwgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZk1hdGVyaWFsJyksXG4gICAgVGV4dHVyZSAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvdGV4dHVyZS9mVGV4dHVyZScpLFxuICAgIENhbnZhc1RleHR1cmUgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL3RleHR1cmUvZkNhbnZhc1RleHR1cmUnKSxcblxuICAgIGZHTFV0aWwgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9mR0xVdGlsJyksXG4gICAgZkdMICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2ZHTCcpLFxuXG4gICAgTW91c2UgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZk1vdXNlJyksXG4gICAgTW91c2VTdGF0ZSAgOiByZXF1aXJlKCcuL3V0aWwvZk1vdXNlU3RhdGUnKSxcbiAgICBDb2xvciAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9mQ29sb3InKSxcbiAgICBVdGlsICAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9mVXRpbCcpLFxuXG4gICAgUGxhdGZvcm0gICAgOiByZXF1aXJlKCcuL3N5c3RlbS9jb21tb24vZlBsYXRmb3JtJyksXG4gICAgU3lzdGVtICAgICAgOiByZXF1aXJlKCcuL3N5c3RlbS9mU3lzdGVtJyksXG5cbiAgICBGbGFncyA6IHJlcXVpcmUoJy4vc3lzdGVtL2ZGbGFncycpLFxuICAgICovXG4gICAgQXBwbGljYXRpb24gOiByZXF1aXJlKCcuL2FwcC9mQXBwbGljYXRpb24nKVxuXG59O1xuXG4iLCJcblxuZnVuY3Rpb24gR0woKXtcblxuXG4gICAgIGZvcih2YXIgcCBpbiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpe1xuICAgICAgICAgdGhpc1twXSA9IFdlYkdMUmVuZGVyaW5nQ29udGV4dFtwXTtcbiAgICAgfVxuXG59XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gR0w7IiwidmFyIFZlYzIgPVxue1xuICAgIFNJWkUgOiAyLFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDBdKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzI7IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIEFQUF9XSURUSCAgOiA4MDAsXG4gICAgQVBQX0hFSUdIVCA6IDYwMCxcblxuICAgIEFQUF9GUFMgOiAzMCxcblxuICAgIEFQUF9QTEFTS19XSU5ET1dfVElUTEUgOiAnJyxcbiAgICBBUFBfUExBU0tfVFlQRSAgOiAnM2QnLFxuICAgIEFQUF9QTEFTS19WU1lOQyA6ICdmYWxzZScsXG4gICAgQVBQX1BMQVNLX01VTFRJU0FNUExFIDogdHJ1ZSxcblxuICAgIENBTUVSQV9GT1YgOiA0NSxcbiAgICBDQU1FUkFfTkVBUiA6IDAuMSxcbiAgICBDQU1FUkFfRkFSICA6IDEwMFxuXG59OyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBNRVRIT0RfTk9UX0lNUExFTUVOVEVEOiAnTWV0aG9kIG5vdCBpbXBsZW1lbnRlZCBpbiB0YXJnZXQgcGxhdGZvcm0uJyxcbiAgICBDTEFTU19JU19TSU5HTEVUT046ICAgICAnQXBwbGljYXRpb24gaXMgc2luZ2xldG9uLiBHZXQgdmlhIGdldEluc3RhbmNlKCkuJyxcbiAgICBBUFBfTk9fU0VUVVA6ICAgICAgICAgICAnTm8gc2V0dXAgbWV0aG9kIGFkZGVkIHRvIGFwcC4nLFxuICAgIEFQUF9OT19VUERBVEUgOiAgICAgICAgICdObyB1cGRhdGUgbWV0aG9kIGFkZGVkIHRvIGFwcC4nLFxuICAgIFBMQVNLX1dJTkRPV19TSVpFX1NFVDogICdQbGFzayB3aW5kb3cgc2l6ZSBjYW4gb25seSBiZSBzZXQgb24gc3RhcnR1cC4nLFxuICAgIFdST05HX1BMQVRGT1JNOiAgICAgICAgICdXcm9uZyBQbGF0Zm9ybS4nLFxuICAgIE1BVFJJWF9TVEFDS19QT1BfRVJST1I6ICdNYXRyaXggc3RhY2sgaW52YWxpZCBwb3AuJyxcbiAgICBWRVJUSUNFU19JTl9XUk9OR19TSVpFOiAnVmVydGljZXMgYXJyYXkgaGFzIHdyb25nIGxlbmd0aC4gU2hvdWxkIGJlICcsXG4gICAgQ09MT1JTX0lOX1dST05HX1NJWkU6ICAgJ0NvbG9yIGFycmF5IGxlbmd0aCBub3QgZXF1YWwgdG8gbnVtYmVyIG9mIHZlcnRpY2VzLicsXG4gICAgRElSRUNUT1JZX0RPRVNOVF9FWElTVDogJ0ZpbGUgdGFyZ2V0IGRpcmVjdG9yeSBkb2VzIG5vdCBleGlzdC4nLFxuICAgIEZJTEVfRE9FU05UX0VYSVNUOiAgICAgICdGaWxlIGRvZXMgbm90IGV4aXN0LicsXG4gICAgVEVYVFVSRV9XSURUSF9OT1RfUDI6ICAgJ1RleHR1cmUgaW1hZ2VEYXRhIGlzIG5vdCBwb3dlciBvZiAyLicsXG4gICAgVEVYVFVSRV9IRUlHSFRfTk9UX1AyOiAgJ1RleHR1cmUgaW1hZ2VEYXRhIGlzIG5vdCBwb3dlciBvZiAyLicsXG4gICAgVEVYVFVSRV9JTUFHRV9EQVRBX05VTEw6J1RleHR1cmUgaW1hZ2VEYXRhIGlzIG51bGwuJ1xufTsiLCJ2YXIgUGxhdGZvcm0gPSB7V0VCOidXRUInLFBMQVNLOidQTEFTSycsTk9ERV9XRUJLSVQ6J05PREVfV0VCS0lUJ307XG4gICAgUGxhdGZvcm0uX190YXJnZXQgPSBudWxsO1xuXG5QbGF0Zm9ybS5nZXRUYXJnZXQgID0gZnVuY3Rpb24oKVxue1xuXG4gICAgaWYoIXRoaXMuX190YXJnZXQpXG4gICAge1xuICAgICAgICB2YXIgYldpbmRvdyAgICAgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyxcbiAgICAgICAgICAgIGJEb2N1bWVudCAgID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyxcbiAgICAgICAgICAgIGJSZXF1aXJlRiAgID0gdHlwZW9mIHJlcXVpcmUgPT0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgIGJSZXF1aXJlICAgID0gISFyZXF1aXJlLFxuICAgICAgICAgICAgYk5vZGVXZWJraXQgPSBmYWxzZTtcblxuICAgICAgICAvL1RPRE8gZml4XG4gICAgICAgIC8vaG0gdGhpcyBuZWVkcyB0byBiZSBmaXhlZCAtPiBicm93c2VyaWZ5IHJlcXVpcmUgdnMgbm9kZS13ZWJraXQgcmVxdWlyZVxuICAgICAgICAvL2ZvciBub3cgdGhpcyBkb2VzIHRoZSBqb2JcbiAgICAgICAgaWYoYkRvY3VtZW50KXtcbiAgICAgICAgICAgIGJOb2RlV2Via2l0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnSUZSQU1FJykuaGFzT3duUHJvcGVydHkoJ253ZGlzYWJsZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3RhcmdldCA9IChiV2luZG93ICYmIGJEb2N1bWVudCAmJiAhYk5vZGVXZWJraXQpID8gdGhpcy5XRUIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgKGJXaW5kb3cgJiYgYkRvY3VtZW50ICYmICBiTm9kZVdlYmtpdCkgPyB0aGlzLk5PREVfV0VCS0lUIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICghYldpbmRvdyAmJiAhYkRvY3VtZW50ICYmIGJSZXF1aXJlRiAmJiBiUmVxdWlyZSkgPyB0aGlzLlBMQVNLIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fX3RhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxhdGZvcm07IiwiLy90ZW1wXG52YXIgU2hhcmVkID1cbntcbiAgICBfX3dpbmRvd1NpemUgOiBuZXcgRmxvYXQzMkFycmF5KFswLDBdKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZWQ7IiwidmFyIGZFcnJvciAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL2ZFcnJvcicpLFxuICAgIFZlYzIgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMyJyk7XG5cbmZ1bmN0aW9uIE1vdXNlKClcbntcbiAgICBpZihNb3VzZS5fX2luc3RhbmNlKXRocm93IG5ldyBFcnJvcihmRXJyb3IuQ0xBU1NfSVNfU0lOR0xFVE9OKTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uICAgICA9IFZlYzIubWFrZSgpO1xuICAgIHRoaXMuX3Bvc2l0aW9uTGFzdCA9IFZlYzIubWFrZSgpO1xuICAgIHRoaXMuX3N0YXRlICAgICAgICA9IG51bGw7XG4gICAgdGhpcy5fc3RhdGVMYXN0ICAgID0gbnVsbDtcbiAgICB0aGlzLl93aGVlbERlbHRhICAgPSAwO1xuXG4gICAgTW91c2UuX19pbnN0YW5jZSA9IHRoaXM7XG59XG5cbk1vdXNlLnByb3RvdHlwZS5nZXRQb3NpdGlvbiAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbjt9O1xuTW91c2UucHJvdG90eXBlLmdldFBvc2l0aW9uTGFzdCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uTGFzdDt9O1xuTW91c2UucHJvdG90eXBlLmdldFggICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uWzBdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WSAgICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25bMV07fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRYTGFzdCAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbkxhc3RbMF07fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRZTGFzdCAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbkxhc3RbMV07fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRTdGF0ZSAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zdGF0ZTt9O1xuTW91c2UucHJvdG90eXBlLmdldFN0YXRlTGFzdCAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3N0YXRlTGFzdDt9O1xuTW91c2UucHJvdG90eXBlLmdldFdoZWVsRGVsdGEgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3doZWVsRGVsdGE7fTtcblxuTW91c2UuX19pbnN0YW5jZSA9IG51bGw7XG5Nb3VzZS5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKCl7cmV0dXJuIE1vdXNlLl9faW5zdGFuY2U7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZTsiLCJ2YXIgT2JqZWN0VXRpbCA9IHtcblxuICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJztcbiAgICB9LFxuXG4gICAgaXNGbG9hdDMyQXJyYXk6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFyciBpbnN0YW5jZW9mICBGbG9hdDMyQXJyYXk7XG4gICAgfSxcblxuICAgIHNhZmVGbG9hdDMyQXJyYXk6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFyciBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/IGFyciA6IG5ldyBGbG9hdDMyQXJyYXkoYXJyKTtcbiAgICB9LFxuXG4gICAgc2FmZVVpbnQxNkFycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnIgaW5zdGFuY2VvZiBVaW50MTZBcnJheSA/IGFyciA6IG5ldyBVaW50MTZBcnJheShhcnIpO1xuICAgIH0sXG5cbiAgICBjb3B5RmxvYXQzMkFycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGFycik7XG4gICAgfSxcblxuICAgIGFycmF5UmVzaXplZDogZnVuY3Rpb24gKGFyciwgbGVuKSB7XG4gICAgICAgIGFyci5sZW5ndGggPSBsZW47XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfSxcblxuICAgIGNvcHlBcnJheTogZnVuY3Rpb24gKGFycikge1xuICAgICAgICB2YXIgaSA9IC0xLCBsID0gYXJyLmxlbmd0aCwgb3V0ID0gbmV3IEFycmF5KGwpO1xuICAgICAgICB3aGlsZSAoKytpIDwgbCkge1xuICAgICAgICAgICAgb3V0W2ldID0gYXJyW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIHNldEFycmF5OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICB2YXIgaSA9IC0xLCBsID0gYS5sZW5ndGg7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsKSB7XG4gICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRBcnJheU9mZnNldEluZGV4OiBmdW5jdGlvbiAoYXJyLCBvZmZzZXQsIGxlbikge1xuICAgICAgICB2YXIgaSA9IC0xLCBsID0gbGVuIHx8IGFyci5sZW5ndGg7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsKSB7XG4gICAgICAgICAgICBhcnJbaV0gKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vY2hlY2sgZm9yIGNvbnRlbnQgbm90IG9iamVjdCBlcXVhbGl0eSwgb2JqZWN0IGlzIG51bWJlclxuICAgIGVxdWFsQXJyQ29udGVudDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgaWYgKCFhIHx8ICFiIHx8ICghYSAmJiAhYikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xLCBsID0gYS5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbCkge1xuICAgICAgICAgICAgICAgIGlmIChhW2ldICE9IGJbaV0pcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cblxuICAgIGdldEZ1bmN0aW9uQm9keTogZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICAgICAgcmV0dXJuIChmdW5jKS50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvbltee10rXFx7KFtcXHNcXFNdKilcXH0kLylbMV07XG4gICAgfSxcblxuICAgIF9fdG9TdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICAgIH0sXG5cbiAgICBpc0FycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH0sXG5cbiAgICBpc09iamVjdDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKVxuICAgIH0sXG5cbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIH0sXG5cbiAgICBpc1N0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgU3RyaW5nXSc7XG4gICAgfSxcblxuXG4gICAgaXNGbG9hdDY0QXJyYXk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhvYmopID09ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgfSxcblxuICAgIGlzVWludDhBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgVWludDhBcnJheV0nO1xuICAgIH0sXG5cbiAgICBpc1VpbnQxNkFycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBVaW50MTZBcnJheV0nXG4gICAgfSxcblxuICAgIGlzVWludDMyQXJyYXk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhvYmopID09ICdbb2JqZWN0IFVpbnQzMkFycmF5XSdcbiAgICB9LFxuXG4gICAgaXNUeXBlZEFycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVWludDhBcnJheShvYmopIHx8XG4gICAgICAgICAgICB0aGlzLmlzVWludDE2QXJyYXkob2JqKSB8fFxuICAgICAgICAgICAgdGhpcy5pc1VpbnQzMkFycmF5KG9iaikgfHxcbiAgICAgICAgICAgIHRoaXMuaXNGbG9hdDMyQXJyYXkob2JqKSB8fFxuICAgICAgICAgICAgdGhpcy5pc0Zsb2F0MzJBcnJheShvYmopO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Z1bmN0aW9uKG9iaikgPyB0aGlzLmdldEZ1bmN0aW9uU3RyaW5nKG9iaikgOlxuICAgICAgICAgICAgdGhpcy5pc0FycmF5KG9iaikgPyB0aGlzLmdldEFycmF5U3RyaW5nKG9iaikgOlxuICAgICAgICAgICAgICAgIHRoaXMuaXNTdHJpbmcob2JqKSA/IHRoaXMuZ2V0U3RyaW5nKG9iaikgOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVHlwZWRBcnJheShvYmopID8gdGhpcy5nZXRUeXBlZEFycmF5U3RyaW5nKG9iaikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc09iamVjdChvYmopID8gdGhpcy5nZXRPYmplY3RTdHJpbmcob2JqKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqO1xuICAgIH0sXG5cbiAgICBnZXRUeXBlZEFycmF5U3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Zsb2F0MzJBcnJheShvYmopKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgbXVzdCBiZSBvZiB0eXBlIEZsb2F0MzJBcnJheScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iai5ieXRlTGVuZ3RoID09IDApcmV0dXJuICdbXSc7XG4gICAgICAgIHZhciBvdXQgPSAnWyc7XG5cbiAgICAgICAgZm9yICh2YXIgcCBpbiBvYmopIHtcbiAgICAgICAgICAgIG91dCArPSBvYmpbcF0gKyAnLCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0LnN1YnN0cigwLCBvdXQubGFzdEluZGV4T2YoJywnKSkgKyAnXSc7XG5cbiAgICB9LFxuXG4gICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiAnXCInICsgb2JqICsgJ1wiJztcbiAgICB9LFxuXG4gICAgZ2V0QXJyYXlTdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IG11c3QgYmUgb2YgdHlwZSBhcnJheS4nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3V0ID0gJ1snO1xuICAgICAgICBpZiAob2JqLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0ICsgJ10nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIG91dCArPSB0aGlzLnRvU3RyaW5nKG9ialtpXSkgKyAnLCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0LnN1YnN0cigwLCBvdXQubGFzdEluZGV4T2YoJywnKSkgKyAnXSc7XG4gICAgfSxcblxuICAgIGdldE9iamVjdFN0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNPYmplY3Qob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IG11c3QgYmUgb2YgdHlwZSBvYmplY3QuJylcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3V0ID0gJ3snO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dCArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgICAgICAgICBvdXQgKz0gcCArICc6JyArIHRoaXMudG9TdHJpbmcob2JqW3BdKSArICcsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQuc3Vic3RyKDAsIG91dC5sYXN0SW5kZXhPZignLCcpKSArICd9JztcbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyAgUGFyc2VzIGZ1bmMgdG8gc3RyaW5nLFxuICAgIC8vICBtdXN0IHNhdGlzZnkgKGlmICdjbGFzcycpOlxuICAgIC8vXG4gICAgLy8gIGZ1bmN0aW9uIENsYXNzQigpe1xuICAgIC8vICAgICAgQ2xhc3NCLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtDbGFzc0IuY2FsbC4uLlxuICAgIC8vICB9XG4gICAgLy9cbiAgICAvLyAgQ2xhc3NCLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ2xhc3NBLnByb3RvdHlwZSlcbiAgICAvL1xuICAgIC8vICBDbGFzc0IucHJvdG90eXBlLm1ldGhvZCA9IGZ1bmN0aW9uKCl7fTtcbiAgICAvL1xuICAgIC8vICBDbGFzc0IuU1RBVElDID0gMTtcbiAgICAvLyAgQ2xhc3NCLlNUQVRJQ19PQkogPSB7fTtcbiAgICAvLyAgQ2xhc3NCLlNUQVRJQ19BUlIgPSBbXTtcbiAgICAvL1xuXG4gICAgZ2V0RnVuY3Rpb25TdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IG11c3QgYmUgb2YgdHlwZSBmdW5jdGlvbi4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvdXQgPSAnJztcblxuICAgICAgICB2YXIgbmFtZSA9IG9iai5uYW1lLFxuICAgICAgICAgICAgY29uc3RydWN0b3IgPSBvYmoudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIGluaGVyaXRlZCA9IDEgKyBjb25zdHJ1Y3Rvci5pbmRleE9mKCcuY2FsbCh0aGlzJykgfHwgMSArIGNvbnN0cnVjdG9yLmluZGV4T2YoJy5hcHBseSh0aGlzJyk7XG5cbiAgICAgICAgb3V0ICs9IGNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmIChpbmhlcml0ZWQpIHtcbiAgICAgICAgICAgIG91dCArPSAnXFxuXFxuJztcbiAgICAgICAgICAgIGluaGVyaXRlZCAtPSAyO1xuXG4gICAgICAgICAgICB2YXIgYmFzZUNsYXNzID0gJyc7XG4gICAgICAgICAgICB2YXIgY2hhciA9ICcnLFxuICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGNoYXIgIT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgYmFzZUNsYXNzID0gY2hhciArIGJhc2VDbGFzcztcbiAgICAgICAgICAgICAgICBjaGFyID0gY29uc3RydWN0b3Iuc3Vic3RyKGluaGVyaXRlZCAtIGksIDEpO1xuICAgICAgICAgICAgICAgICsraTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSBuYW1lICsgJy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCcgKyBiYXNlQ2xhc3MgKyAnLnByb3RvdHlwZSk7JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgICAgICAgICBvdXQgKz0gJ1xcblxcbicgKyBuYW1lICsgJy4nICsgcCArICcgPSAnICsgdGhpcy50b1N0cmluZyhvYmpbcF0pICsgJzsnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iai5wcm90b3R5cGU7XG4gICAgICAgIGZvciAodmFyIHAgaW4gcHJvdG90eXBlKSB7XG4gICAgICAgICAgICBpZiAocHJvdG90eXBlLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgb3V0ICs9ICdcXG5cXG4nICsgbmFtZSArICcucHJvdG90eXBlLicgKyBwICsgJyA9ICcgKyB0aGlzLnRvU3RyaW5nKHByb3RvdHlwZVtwXSkgKyAnOyc7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3RVdGlsO1xuIl19
;