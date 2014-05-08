;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Foam = require('../../src/foam/foam.js');

function App() {
    Foam.Application.apply(this, arguments);

    this.setFPS(60);
    this.setWindowSize(800, 600);


    var gl = this.gl;

    //console.log(gl.viewport);
    gl.viewport(0,0,this.getWindowWidth,this.getWindowHeight());

}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    console.log('setup');
};

App.prototype.update = function () {
    var gl = this.gl;

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);


};


window.addEventListener('load',function(){
    var app = new App();
});

},{"../../src/foam/foam.js":5}],2:[function(require,module,exports){
var fError = require('../system/common/Error'),
    ObjectUtil = require('../util/fObjectUtil'),
    Platform = require('../system/common/fPlatform'),
    Shared = require('../system/fShared'),
    AppImplWeb = require('./fAppImplWeb'),
    Mouse = require('../util/fMouse'),
    GL = require('../graphics/gl');

var Default     = require('../system/common/fDefault');

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

    this._context = canvas.getContext('webkit-3d') ||
                    canvas.getContext("webgl") ||
                    canvas.getContext("experimental-webgl");

    document.body.appendChild(canvas);

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame;

    this.gl = new GL(this._context);

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






},{"../graphics/gl":7,"../system/common/Error":15,"../system/common/fDefault":16,"../system/common/fPlatform":17,"../system/fShared":18,"../util/fMouse":20,"../util/fObjectUtil":21,"./fAppImplWeb":4}],3:[function(require,module,exports){
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
},{"../system/common/Error":15,"../system/common/fDefault":16,"../util/fObjectUtil":21}],4:[function(require,module,exports){
var Default = require('../system/common/fDefault'),
    AppImpl = require('./fAppImpl'),
    GL      = require('../graphics/gl');

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

    this.fgl = new GL(this._context3d);



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
    if (width  == this.getWindowWidth() && height == this.getWindowHeight()){
        return;
    }

    this._windowSize[0] = width;
    this._windowSize[1] = height;
    this._windowRatio   = width / height;

    if (!this._isInitialized){
        return;
    }

    this._updateCanvas3dSize();
};

AppImplWeb.prototype.initialize = function (appObj) {
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


    appObj.gl = new GL(this._context3d);


    /*
     appObj.fgl.gl.viewport(0,0,this._windowWidth,this._windowHeight);

     appObj.camera = new Camera();
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
        gl.viewport(0, 0, self.getWindowWidth(), self.getWindowHeight());
        gl.clearColor(0,0,0,0);
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
        self.initialize(appObj);
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


},{"../graphics/gl":7,"../system/common/fDefault":16,"./fAppImpl":3}],5:[function(require,module,exports){
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
    Matrix44       : require('./math/fMat44'),
    Quaternion  : require('./math/fQuaternion'),

    MatGL        : require('./graphics/gl/fMatGL'),
    Program      : require('./graphics/gl/fProgram'),
    Camera  : require('./graphics/fCameraBasic'),

    Light            : require('./graphics/gl/light/fLight'),
    PointLight       : require('./graphics/gl/light/fPointLight'),
    DirectionalLight : require('./graphics/gl/light/fDirectionalLight'),
    SpotLight        : require('./graphics/gl/light/fSpotLight'),

    Material      : require('./graphics/gl/fMaterial'),
    Texture       : require('./graphics/gl/texture/fTexture'),
    CanvasTexture : require('./graphics/gl/texture/fCanvasTexture'),

    fGLUtil     : require('./graphics/fGLUtil'),
    GL         : require('./graphics/GL'),

    Mouse       : require('./util/fMouse'),
    MouseState  : require('./util/fMouseState'),
    Color       : require('./util/fColor'),
    Util        : require('./util/fUtil'),

    Platform    : require('./system/common/fPlatform'),
    System      : require('./system/fSystem'),

    Flags : require('./system/fFlags'),
    */
    Application : require('./app/App')

};


},{"./app/App":2}],6:[function(require,module,exports){
var Vec3 = require('../math/Vec3'),
    Matrix44 = require('../math/Matrix44'),
    MatGL = require('./gl/fMatGL');


function Camera() {
    this.position = Vec3.create();
    this._target = Vec3.create();
    this._up = Vec3.AXIS_Y();

    this._fov = 0;
    this._near = 0;
    this._far = 0;

    this._aspectRatioLast = 0;

    this._modelViewMatrixUpdated = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = Matrix44.create();
    this.modelViewMatrix = Matrix44.create();
}

Camera.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};


Camera.prototype.setTarget = function (v) {
    Vec3.set(this._target, v);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setTarget3f = function (x, y, z) {
    Vec3.set3f(this._target, x, y, z);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setPosition = function (v) {
    Vec3.set(this.position, v);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setPosition3f = function (x, y, z) {
    Vec3.set3f(this.position, x, y, z);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setUp = function (v) {
    Vec3.set(this._up, v);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setUp3f = function (x, y, z) {
    Vec3.set3f(this._up, x, y, z);
    this._modelViewMatrixUpdated = false;
};

Camera.prototype.setNear = function (near) {
    this._near = near;
    this._projectionMatrixUpdated = false;
};
Camera.prototype.setFar = function (far) {
    this._far = far;
    this._projectionMatrixUpdated = false;
};
Camera.prototype.setFov = function (fov) {
    this._fov = fov;
    this._projectionMatrixUpdated = false;
};
Camera.prototype.setAspectRatio = function (aspectRatio) {
    this._aspectRatioLast = aspectRatio;
    this._projectionMatrixUpdated = false;
};

Camera.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated)return;
    MatGL.lookAt(this.modelViewMatrix, this.position, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};
Camera.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated)return;
    MatGL.perspective(this.projectionMatrix, this._fov, this._aspectRatioLast, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

Camera.prototype.updateMatrices = function () {
    this.updateModelViewMatrix();
    this.updateProjectionMatrix();
};

Camera.prototype.toString = function () {
    return '{position= ' + Vec3.toString(this.position) +
        ', target= ' + Vec3.toString(this._target) +
        ', up= ' + Vec3.toString(this._up) + '}'
};

module.exports = Camera;



},{"../math/Matrix44":11,"../math/Vec3":13,"./gl/fMatGL":8}],7:[function(require,module,exports){
var WebGL    = require("./webgl"),
    Matrix44 = require("../math/Matrix44");
var _Error   = require('../system/common/Error');

var Camera = require('./Camera');

var assert = require('../util/Log').assert;

function GL(gl){
    WebGL.apply(this,arguments);


    this._camera = null;

    //
    //  matrix stack
    //

    this._matrixMode = GL.MODELVIEW;
    this._matrixStackModelView = [];
    this._matrixStackProjection = [];
    this._matrixModelView = Matrix44.create();
    this._matrixProjection = Matrix44.create();

}

GL.prototype = Object.create(WebGL.prototype);

/*---------------------------------------------------------------------------------------------------------*/
// Modelview / projection matrix
/*---------------------------------------------------------------------------------------------------------*/

GL.prototype.setMatricesCamera = function(camera){
    this._camera = camera;
};

GL.prototype.setMatrixMode = function(mode){
    this._matrixMode = mode;
};

GL.prototype.loadIdentity = function(){
    if(this._matrixMode == GL.MODELVIEW){
        this._matrixModelView = Matrix44.identity(this._camera.modelViewMatrix);
    } else {
        this._matrixProjection = Matrix44.identity(this._camera.projectionMatrix);
    }
};

GL.prototype.pushMatrix = function(){
    if(this._matrixMode == GL.MODELVIEW){
        this._matrixStackModelView.push(Matrix44.copy(this._matrixModelView));
    } else {
        this._matrixStackProjection.push(Matrix44.copy(this._matrixProjection));
    }
};

GL.prototype.popMatrix = function(){
    if(this._matrixMode = GL.MODELVIEW){
        if(this._matrixStackModelView.length == 0){
            throw new Error(_Error.MATRIX_STACK_POP_ERROR);
        }
        this._matrixModelView = this._matrixStackModelView.pop();
        return this._matrixModelView;
    } else {
        if(this._matrixStackProjection.length == 0){
            throw new Error(_Error.MATRIX_STACK_POP_ERROR);
        }
        this._matrixProjection = this._matrixStackProjection.pop();
        return this._matrixProjection;
    }
};

GL.prototype.translate3f = function(x,y,z){
    this._matrixModelView = Matrix44.identity()
};

GL.prototype.rotate3f = function(x,y,z){
};


GL.prototype.scale3f = function(x,y,z){};

GL.prototype.multMatrix = function(matrix){
    if(this._matrixMode = GL.MODELVIEW){

    }
};

GL.prototype.getMatrix = function(mat){};
GL.prototype.pushMatrices = function(){};
GL.prototype.popMatrices = function(){};






GL.prototype.getModelViewMatrix = function(mat){};
GL.prototype.getProjectionMatrix = function(mat){};
GL.prototype.setWindowMatrices = function(windowWidth,windowHeight,topleft){};
GL.prototype.setViewport = function(x0,y0,x1,y1){};


GL.prototype.drawLine = function(start, end){};
GL.prototype.drawCube = function(center, size){};
GL.prototype.drawCubeStroked = function(center,size){};
GL.prototype.drawSphere = function(center, radius, numSegs){};
GL.prototype.drawCircle = function(center,radius,numSegs){};
GL.prototype.drawCircleStroked = function(center,radius,numSegs){};
GL.prototype.drawEllipse = function(center,radiusX,radiusY,numSegs){};
GL.prototype.drawEllipseStroked = function(center,radiusX,radiusY,numSegs){};
GL.prototype.drawRect = function(rect){};
GL.prototype.drawRectStroked = function(rect){};
GL.prototype.drawRectRounded = function(rect,radiusCorner,numSegsCorner){};
GL.prototype.drawRectRoundedStroked  =function(rect,radiusCorner,numSegsCorner){};
GL.prototype.drawTriangle = function(v0,v1,v2){};
GL.prototype.drawTriangleStroked = function(v0,v1,v2){};

GL.prototype.draw = function(obj){};
GL.prototype.drawRange = function(obj,begin,count){};

GL.prototype.drawPivot = function(length){};
GL.prototype.drawVector = function(vec){};
GL.prototype.drawFrustum = function(camera){};

GL.prototype.drawArraysSafe = function(){};

GL.prototype.drawString = function(string,pos,align){};


GL.prototype.color4f = function(r,g,b,a){};


GL.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';
GL.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

GL.MODELVIEW  = 0x1A0A;
GL.PROJECTION = 0x1A0B;



module.exports = GL;
},{"../math/Matrix44":11,"../system/common/Error":15,"../util/Log":19,"./Camera":6,"./webgl":9}],8:[function(require,module,exports){
var Mat44 = require('../../math/Matrix44');

module.exports =
{
    perspective : function(m,fov,aspect,near,far)
    {
        var f  = 1.0 / Math.tan(fov*0.5),
            nf = 1.0 / (near-far);

        m[0] = f / aspect;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = f;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (2 * far * near) * nf;
        m[15] = 0;

        return m;

    },

    frustum : function(m,left,right,bottom,top,near,far)
    {
        var rl = 1 / (right - left),
            tb = 1 / (top - bottom),
            nf = 1 / (near - far);


        m[ 0] = (near * 2) * rl;
        m[ 1] = 0;
        m[ 2] = 0;
        m[ 3] = 0;
        m[ 4] = 0;
        m[ 5] = (near * 2) * tb;
        m[ 6] = 0;
        m[ 7] = 0;
        m[ 8] = (right + left) * rl;
        m[ 9] = (top + bottom) * tb;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (far * near * 2) * nf;
        m[15] = 0;

        return m;
    },

    lookAt : function(m,eye,target,up)
    {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            targetx = target[0],
            tartety = target[1],
            targetz = target[2];

        if (Math.abs(eyex - targetx) < 0.000001 &&
            Math.abs(eyey - tartety) < 0.000001 &&
            Math.abs(eyez - targetz) < 0.000001) {
            return Matrix44.identity(m);
        }

        z0 = eyex - targetx;
        z1 = eyey - tartety;
        z2 = eyez - targetz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;

        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        len = !len ? 0 : 1/len;

        x0 *= len;
        x1 *= len;
        x2 *= len;

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        len = !len ? 0 : 1/len;

        y0 *= len;
        y1 *= len;
        y2 *= len;


        m[ 0] = x0;
        m[ 1] = y0;
        m[ 2] = z0;
        m[ 3] = 0;
        m[ 4] = x1;
        m[ 5] = y1;
        m[ 6] = z1;
        m[ 7] = 0;
        m[ 8] = x2;
        m[ 9] = y2;
        m[10] = z2;
        m[11] = 0;
        m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        m[15] = 1;

        return m;
    }
};
},{"../../math/Matrix44":11}],9:[function(require,module,exports){
function WebGL(gl){
    this._gl = gl;
}

WebGL.prototype.getContextAttributes = function() {
    return this._gl.getContextAttributes();
};
/**
 @return {boolean}
 */
WebGL.prototype.isContextLost = function() {
    return this._gl.isContextLost();
};
/**
 @return {Array[String}
 */
WebGL.prototype.getSupportedExtensions = function() {
    return this._gl.getSupportedExtensions();
};
/**
 @param {string} name
 @return {*}
 */
WebGL.prototype.getExtension = function(name) {
    return this._gl.getExtension(name);
};
/**
 @param {Number} texture
 @return {void}
 */
WebGL.prototype.activeTexture = function(texture) {
    this._gl.activeTexture(texture);
};
/**
 @param {WebGLProgram} program
 @param {WebGLShader} shader
 @return {void}
 */
WebGL.prototype.attachShader = function(program,shader) {
    this._gl.attachShader(program,shader);
};
/**
 @param {WebGLProgram} program
 @param {Number} index
 @param {string} name
 @return {void}
 */
WebGL.prototype.bindAttribLocation = function(program,index,name) {
    this._gl.bindAttribLocation(program,index,name);
};
/**
 @param {Number} target
 @param {WebGLBuffer} buffer
 @return {void}
 */
WebGL.prototype.bindBuffer = function(target,buffer) {
    this._gl.bindBuffer(target,buffer);
};
/**
 @param {Number} target
 @param {WebGLFramebuffer} framebuffer
 @return {void}
 */
WebGL.prototype.bindFramebuffer = function(target,framebuffer) {
    this._gl.bindFramebuffer(target,framebuffer);
};
/**
 @param {Number} target
 @param {WebGLRenderbuffer} renderbuffer
 @return {void}
 */
WebGL.prototype.bindRenderbuffer = function(target,renderbuffer) {
    this._gl.bindRenderbuffer(target,renderbuffer);
};
/**
 @param {Number} target
 @param {WebGLTexture} texture
 @return {void}
 */
WebGL.prototype.bindTexture = function(target,texture) {
    this._gl.bindTexture(target,texture);
};
/**
 @param {Number} red
 @param {Number} green
 @param {Number} blue
 @param {Number} alpha
 @return {void}
 */
WebGL.prototype.blendColor = function(red,green,blue,alpha) {
    this._gl.blendColor(red,green,blue,alpha);
};
/**
 @param {Number} mode
 @return {void}
 */
WebGL.prototype.blendEquation = function(mode) {
    this._gl.blendEquation(mode);
};
/**
 @param {Number} modeRGB
 @param {Number} modeAlpha
 */
WebGL.prototype.blendEquationSeparate = function(modeRGB,modeAlpha) {
    this._gl.blendEquationSeparate(modeRGB,modeAlpha);
};
/**
 @param {Number} sfactor
 @param {Number} dfactor
 */
WebGL.prototype.blendFunc = function(sfactor,dfactor) {
    this._gl.blendFunc(sfactor,dfactor);
};
/**
 @param {Number} srcRGB
 @param {Number} dstRGB
 @param {Number} srcAlpha
 @param {Number} dstAlpha
 @return {void}
 */
WebGL.prototype.blendFuncSeparate = function(srcRGB,dstRGB,srcAlpha,dstAlpha) {
    this._gl.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);
};
/**
 @param {Number} target
 @param {Number} size
 @param {Number} usage
 */
WebGL.prototype.bufferData = function(target,size,usage) {
    this._gl.bufferData(target,size,usage);
};
/**
 @param {Number} target
 @param {ArrayBufferView} data
 @param {Number} usage
 */
WebGL.prototype.bufferData = function(target,data,usage) {
    this._gl.bufferData(target,data,usage);
};
/**
 @param {Number} target
 @param {ArrayBuffer} data
 @param {Number} usage
 */
WebGL.prototype.bufferData = function(target,data,usage) {
    this._gl.bufferData(taget,data,usage);
};
/**
 @param {Number} target
 @param {Number} offset
 @param {ArrayBufferView} data
 */
WebGL.prototype.bufferSubData = function(target,offset,data) {
    this._gl.bufferSubData(target,offset,data);
};
/**
 @param {Number} target
 @param {Number} offset
 @param {ArrayBuffer} data
 */
WebGL.prototype.bufferSubData = function(target,offset,data) {
    this._gl.bufferSubData(target,offset,data);
};
/**
 @param {Number} target
 @return {Number}
 */
WebGL.prototype.checkFramebufferStatus = function(target) {
    return this._gl.checkFramebufferStatus(target);
};
/**
 @param {GLbitfield} mask
 @return {void}
 */
WebGL.prototype.clear = function(mask) {
    this._gl.clear(mask);
};
/**
 @param {Number} red
 @param {Number} green
 @param {Number} blue
 @param {Number} alpha
 @return {void}
 */
WebGL.prototype.clearColor = function(red,green,blue,alpha) {
    this._gl.clearColor(red,green,blue,alpha);
};
/**
 @param {Number} depth
 @return {void}
 */
WebGL.prototype.clearDepth = function(depth) {
    this._gl.clearDepth(depth);
};
/**
 @param {Number} s
 @return {void}
 */
WebGL.prototype.clearStencil = function(s) {
    this._gl.clearStencil(s);
};
/**
 @param {boolean} red
 @param {boolean} green
 @param {boolean} blue
 @param {boolean} alpha
 @return {void}
 */
WebGL.prototype.colorMask = function(red,green,blue,alpha) {
    this._gl.colorMask(red,green,blue,alpha);
};
/**
 @param {WebGLShader} [shader]
 @return {void}
 */
WebGL.prototype.compileShader = function(shader) {
    this._gl.compileShader(shader);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} internalformat
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @param {Number} border
 @return {void}
 */
WebGL.prototype.copyTexImage2D = function(target,level,internalformat,x,y,width,height,border) {
    this._gl.copyTexImage2D(target,level,internalformat,x,y,width,height,border);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} xoffset
 @param {Number} yoffset
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @return {void}
 */
WebGL.prototype.copyTexSubImage2D = function(target,level,xoffset,yoffset,x,y,width,height) {
    this._gl.copyTexSubImage2D(target,level,xoffset,yoffset,x,y,width,height);
};
/**
 @return {WebGLBuffer}
 */
WebGL.prototype.createBuffer = function() {
    return this._gl.createBuffer();
};
/**
 @return {WebGLFramebuffer}
 */
WebGL.prototype.createFramebuffer = function() {
    return this._gl.createFramebuffer();
};
/**
 @return {WebGLProgram}
 */
WebGL.prototype.createProgram = function() {
    return this._gl.createProgram();
};
/**
 @return {WebGLRenderbuffer}
 */
WebGL.prototype.createRenderbuffer = function() {
    return this._gl.createRenderbuffer();
};
/**
 @param {Number} type
 @return {WebGLShader}
 */
WebGL.prototype.createShader = function(type) {
    return this._gl.createShader(type);
};
/**
 @return {WebGLTexture}
 */
WebGL.prototype.createTexture = function() {
    return this._gl.createTexture();
};
/**
 @param {Number} mode
 @return {void}
 */
WebGL.prototype.cullFace = function(mode) {
    this._gl.cullFace(mode);
};
/**
 @param {WebGLBuffer} buffer
 @return {void}
 */
WebGL.prototype.deleteBuffer = function(buffer) {
    this._gl.deleteBuffer(buffer);
};
/**
 @param {WebGLRenderbuffer} framebuffer
 @return {void}
 */
WebGL.prototype.deleteFramebuffer = function(framebuffer) {
    this._gl.deleteFramebuffer(framebuffer);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.deleteProgram = function(program) {
    this._gl.deleteFramebuffer(program);
};
/**
 @param {WebGLRenderbuffer} renderbuffer
 @return {void}
 */
WebGL.prototype.deleteRenderbuffer = function(renderbuffer) {
    this._gl.deleteRenderbuffer(renderbuffer);
};
/**
 @param {WebGLShader} shader
 @return {void}
 */
WebGL.prototype.deleteShader = function(shader) {
    this._gl.deleteShader(shader);
};
/**
 @param {WebGLTexture} texture
 @return {void}
 */
WebGL.prototype.deleteTexture = function(texture) {
    this._gl.deleteTexture(texture);
};
/**
 @param {Number} func
 @return {void}
 */
WebGL.prototype.depthFunc = function(func) {
    this._gl.depthFunc(func);
};
/**
 @param {boolean} flag
 @return {void}
 */
WebGL.prototype.depthMask = function(flag) {
    this._gl.depthMask(flag);
};
/**
 @param {Number} zNear
 @param {Number} zFar
 */
WebGL.prototype.depthRange = function(zNear,zFar) {
    this._gl.depthRange(zNear,zFar);
};
/**
 @param {WebGLProgram} program
 @param {WebGLShader} shader
 */
WebGL.prototype.detachShader = function(program,shader) {
    this._gl.detachShader(program,shader);
};
/**
 @param {Number} cap
 @return {void}
 */
WebGL.prototype.disable = function(cap) {
    this._gl.disable(cap);
};
/**
 @param {Number} index
 @return {void}
 */
WebGL.prototype.disableVertexAttribArray = function(index) {
    this._gl.disableVertexAttribArray(index);
};
/**
 @param {Number} mode
 @param {Number} first
 @param {Number} count
 */
WebGL.prototype.drawArrays = function(mode,first,count) {
    this._gl.drawArrays(mode,first,count);
};
/**
 @param {Number} mode
 @param {Number} count
 @param {Number} type
 @param {Number} offset
 @return {void}
 */
WebGL.prototype.drawElements = function(mode,count,type,offset) {
    this._gl.drawElements(mode,count,type,offset);
};
/**
 @param {Number} cap
 @return {void}
 */
WebGL.prototype.enable = function(cap) {
    this._gl.enable(cap);
};
/**
 @param {Number} index
 @return {void}
 */
WebGL.prototype.enableVertexAttribArray = function(index) {
    this._gl.enableVertexAttribArray(index);
};
/**
 @return {void}
 */
WebGL.prototype.finish = function() {
    this._gl.finish();
};
/**
 @return {void}
 */
WebGL.prototype.flush = function() {
    this._gl.flush();
};
/**
 @param {Number} target
 @param {Number} attachment
 @param {Number} renderbuffertarget
 @param {WebGLRenderbuffer} renderbuffer
 @return {void}
 */
WebGL.prototype.framebufferRenderbuffer = function(target,attachment,renderbuffertarget,renderbuffer) {
    return this._gl.framebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer);
};
/**
 @param {Number} target
 @param {Number} attachment
 @param {Number} textarget
 @param {WebGLTexture} texture
 @param {Number} level
 @return {void}
 */
WebGL.prototype.framebufferTexture2D = function(target,attachment,textarget,texture,level) {
    return this._gl.framebufferTexture2D(target,attachment,textarget,texture,level);
};
/**
 @param {Number} mode
 @return {void}
 */
WebGL.prototype.frontFace = function(mode) {
    return this._gl.frontFace(mode);
};
/**
 @param {Number} target
 @return {void}
 */
WebGL.prototype.generateMipmap = function(target) {
    return this._gl.generateMipmap(target);
};
/**
 @param {WebGLProgram} program
 @param {Number} index
 */
WebGL.prototype.getActiveAttrib = function(program,index) {
    return this._gl.getActiveAttrib(program,index);
};
/**
 @param {WebGLProgram} program
 @param {Number} index
 */
WebGL.prototype.getActiveUniform = function(program,index) {
    return this._gl.getActiveUniform(program,index);
};
/**
 @param {WebGLProgram} program
 @param {string} name
 */
WebGL.prototype.getAttribLocation = function(program,name) {
    return this._gl.getAttribLocation(program,name)
};
/**
 @param {Number} pname
 @return {*}
 */
WebGL.prototype.getParameter = function(pname) {
    return this._gl.getParameter(pname);
};
/**
 @param {Number} target
 @param {Number} pname
 */
WebGL.prototype.getBufferParameter = function(target,pname) {
    return this._gl.getBufferParameter(target,pname);
};
/**
 @return {Number}
 */
WebGL.prototype.getError = function() {
    return this._gl.getError();
};
/**
 @param {Number} target
 @param {Number} attachment
 @param {Number} pname
 */
WebGL.prototype.getFramebufferAttachmentParameter = function(target,attachment,pname) {
    return this._gl.getFramebufferAttachmentParameter(target,attachment,pname);
};
/**
 @param {WebGLProgram} program
 @param {Number} pname
 */
WebGL.prototype.getProgramParameter = function(program,pname) {
    return this._gl.getProgramParameter(program,pname);
};
/**
 @param {WebGLProgram} program
 @return {string}
 */
WebGL.prototype.getProgramInfoLog = function(program) {
    return this._gl.getProgramInfoLog(program);
};
/**
 @param {Number} target
 @param {Number} pname
 */
WebGL.prototype.getRenderbufferParameter = function(target,pname) {
    return this._gl.getRenderbufferParameter(target,pname);
};
/**
 @param {WebGLShader} shader
 @param {Number} pname
 */
WebGL.prototype.getShaderParameter = function(shader,pname) {
    return this._gl.getShaderParameter(shader,pname);
};
/**
 @param {WebGLShader} shader
 @return {string}
 */
WebGL.prototype.getShaderInfoLog = function(shader) {
    return this._gl.getShaderInfoLog(shader);
};
/**
 @param {WebGLShader} shader
 @return {string}
 */
WebGL.prototype.getShaderSource = function(shader) {
    return this._gl.getShaderSource(shader);
};
/**
 @param {Number} target
 @param {Number} pname
 */
WebGL.prototype.getTexParameter = function(target,pname) {
    return this._gl.getTexParameter(target,pname);
};
/**
 @param {WebGLProgram} program
 @param {WebGLUniformLocation} location
 */
WebGL.prototype.getUniform = function(program,location) {
    return this._gl.getUniform(program,location);
};
/**
 @param {WebGLProgram} program
 @param {string} name
 */
WebGL.prototype.getUniformLocation = function(program,name) {
    return this._gl.getUniformLocation(program,name);
};
/**
 @param {Number} index
 @param {Number} pname
 */
WebGL.prototype.getVertexAttrib = function(index,pname) {
    return this._gl.getVertexAttrib(index,pname);
};
/**
 @param {Number} index
 @param {Number} pname
 */
WebGL.prototype.getVertexAttribOffset = function(index,pname) {
    return this._gl.getVertexAttribOffset(index,pname);
};
/**
 @param {Number} target
 @param {Number} mode
 */
WebGL.prototype.hint = function(target,mode) {
    this._gl.hint(target,mode);
};
/**
 @param {WebGLBuffer} buffer
 @return {boolean}
 */
WebGL.prototype.isBuffer = function(buffer) {
    return this._gl.isBuffer(buffer);
};
/**
 @param {Number} cap
 @return {boolean}
 */
WebGL.prototype.isEnabled = function(cap) {
    return this._gl.isEnabled(cap);
};
/**
 @param {WebGLFramebuffer} framebuffer
 @return {boolean}
 */
WebGL.prototype.isFramebuffer = function(framebuffer) {
    return this._gl.isFramebuffer(framebuffer);
};
/**
 @param {WebGLProgram} program
 @return {boolean}
 */
WebGL.prototype.isProgram = function(program) {
    return this._gl.isProgram(program);
};
/**
 @param {WebGLRenderbuffer} renderbuffer
 @return {boolean}
 */
WebGL.prototype.isRenderbuffer = function(renderbuffer) {
    return this._gl.isRenderbuffer(renderbuffer);
};
/**
 @param {WebGLShader} shader
 @return {boolean}
 */
WebGL.prototype.isShader = function(shader) {
    return this._gl.isShader(shader);
};
/**
 @param {WebGLTexture} texture
 @return {boolean}
 */
WebGL.prototype.isTexture = function(texture) {
    return this._gl.isTexture(texture);
};
/**
 @param {Number} width
 @return {void}
 */
WebGL.prototype.lineWidth = function(width) {
    this._gl.lineWidth(width);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.linkProgram = function(program) {
    this._gl.linkProgram(program);
};
/**
 @param {Number} pname
 @param {Number} param
 */
WebGL.prototype.pixelStorei = function(pname,param) {
    this._gl.pixelStorei(pname,param);
};
/**
 @param {Number} factor
 @param {Number} units
 */
WebGL.prototype.polygonOffset = function(factor,units) {
    this._gl.polygonOffset(factor,units);
};
/**
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @param {Number} format
 @param {Number} type
 @param {ArrayBufferView} pixels
 */
WebGL.prototype.readPixels = function(x,y,width,height,format,type,pixels) {
    this._gl.readPixels(x,y,width,height,format,type,pixels);
};
/**
 @param {Number} target
 @param {Number} internalformat
 @param {Number} width
 @param {Number} height
 */
WebGL.prototype.renderbufferStorage = function(target,internalformat,width,height) {
    this._gl.renderbufferStorage(target,internalformat,width,height);
};
/**
 @param {Number} [value]
 @param {boolean} invert
 */
WebGL.prototype.sampleCoverage = function(value,invert) {
    this._gl.sampleCoverage(value,invert);
};
/**
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 */
WebGL.prototype.scissor = function(x,y,width,height) {
    this._gl.scissor(x,y,width,height);
};
/**
 @param {WebGLShader} shader
 @param {string} source
 */
WebGL.prototype.shaderSource = function(shader,source) {
    this._gl.shaderSource(shader,source);
};
/**
 @param {Number} func
 @param {Number} ref
 @param {Number} mask
 */
WebGL.prototype.stencilFunc = function(func,ref,mask) {
    this._gl.stencilFunc(func,ref,mask);
};
/**
 @param {Number} face
 @param {Number} func
 @param {Number} ref
 @param {Number} mask
 */
WebGL.prototype.stencilFuncSeparate = function(face,func,ref,mask) {
    this._gl.stencilFuncSeparate(face,func,ref,mask);
};
/**
 @param {Number} mask
 @return {void}
 */
WebGL.prototype.stencilMask = function(mask) {
    this._gl.stencilMask(mask);
};
/**
 @param {Number} face
 @param {Number} mask
 */
WebGL.prototype.stencilMaskSeparate = function(face,mask) {
    this._gl.stencilMaskSeparate(face,mask);
};
/**
 @param {Number} fail
 @param {Number} zfail
 @param {Number} zpass
 */
WebGL.prototype.stencilOp = function(fail,zfail,zpass) {
    this._gl.stencilOp(fail,zfail,zpass);
};
/**
 @param {Number} face
 @param {Number} fail
 @param {Number} zfail
 @param {Number} zpass
 */
WebGL.prototype.stencilOpSeparate = function(face,fail,zfail,zpass) {
    this._gl.stencilOpSeparate(face,fail,zfail,zpass);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} internalformat
 @param {Number} width
 @param {Number} height
 @param {Number} border
 @param {Number} format
 @param {Number} type
 @param {ArrayBufferView} pixels
 */
WebGL.prototype.texImage2D = function(target,level,internalformat,width,height,border,format,type,pixels) {
    this._gl.texImage2D(target,level,internalformat,width,height,border,format,type,pixels);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} internalformat
 @param {Number} format
 @param {Number} type
 @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} pixelsImageCanvasOrVideo
 */
WebGL.prototype.texImage2D = function(target,level,internalformat,format,type,pixelsImageCanvasOrVideo) {
    this._gl.texImage2D(target,level,internalformat,format,type,pixelsImageCanvasOrVideo);
};
/**
 @param {Number} target
 @param {Number} pname
 @param {Number} param
 */
WebGL.prototype.texParameterf = function(target,pname,param) {
    this._gl.texParameterf(target,pname,param);
};
/**
 @param {Number} target
 @param {Number} pname
 @param {Number} param
 */
WebGL.prototype.texParameteri = function(target,pname,param) {
    this._gl.texParameteri(target,pname,param);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} xoffset
 @param {Number} yoffset
 @param {Number} width
 @param {Number} height
 @param {Number} format
 @param {Number} type
 @param {ArrayBufferView} pixels
 */
WebGL.prototype.texSubImage2D = function(target,level,xoffset,yoffset,width,height,format,type,pixels) {
    this._gl.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} xoffset
 @param {Number} yoffset
 @param {Number} format
 @param {Number} type
 @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} pixelsImageCanvasOrVideo
 */
WebGL.prototype.texSubImage2D = function(target,level,xoffset,yoffset,format,type,pixelsImageCanvasOrVideo) {
    this._gl.texSubImage2D(target,level,xoffset,yoffset,format,type,pixelsImageCanvasOrVideo);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 */
WebGL.prototype.uniform1f = function(location,x) {
    this._gl.uniform1f(location,x);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform1fv = function(location,v) {
    this._gl.uniform1fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} [v]
 */
WebGL.prototype.uniform1fv = function(location,v) {
    this._gl.uniform1fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 */
WebGL.prototype.uniform1i = function(location,x) {
    this._gl.uniform1i(location,x);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform1iv = function(location,v) {
    this._gl.uniform1iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} [v]
 */
WebGL.prototype.uniform1iv = function(location,v) {
    this._gl.uniform1iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 */
WebGL.prototype.uniform2f = function(location,x,y) {
    this._gl.uniform2f(location,x,y);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform2fv = function(location,v) {
    this._gl.uniform2fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} [v]
 */
WebGL.prototype.uniform2fv = function(location,v) {
    this._gl.uniform2fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 */
WebGL.prototype.uniform2i = function(location,x,y) {
    this._gl.uniform2i(location,x,y);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform2iv = function(location,v) {
    this._gl.uniform2iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform2iv = function(location,v) {
    this._gl.uniform2iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 */
WebGL.prototype.uniform3f = function(location,x,y,z) {
    this._gl.uniform3f(location,x,y,z);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform3fv = function(location,v) {
    this._gl.uniform3fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform3fv = function(location,v) {
    this._gl.uniform3fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 */
WebGL.prototype.uniform3i = function(location,x,y,z) {
    this._gl.uniform3i(location,x,y,z);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform3iv = function(location,v) {
    this._gl.uniform3iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform3iv = function(location,v) {
    this._gl.uniform3iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 @param {Number} w
 */
WebGL.prototype.uniform4f = function(location,x,y,z,w) {
    this._gl.uniform4f(location,x,y,z,w);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform4fv = function(location,v) {
    this._gl.uniform4fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform4fv = function(location,v) {
    this._gl.uniform4fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 @param {Number} w
 */
WebGL.prototype.uniform4i = function(location,x,y,z,w) {
    this._gl.uniform4f(location,x,y,z,w);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform4iv = function(location,v) {
    this._gl.uniform4iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform4iv = function(location,v) {
    this._gl.uniform4iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Float32Array} value
 */
WebGL.prototype.uniformMatrix2fv = function(location,transpose,value) {
    this._gl.uniformMatrix2fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Array[Number} value
 */
WebGL.prototype.uniformMatrix2fv = function(location,transpose,value) {
    this._gl.uniformMatrix2fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Float32Array} value
 */
WebGL.prototype.uniformMatrix3fv = function(location,transpose,value) {
    this._gl.uniformMatrix3fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Array[Number} value
 */
WebGL.prototype.uniformMatrix3fv = function(location,transpose,value) {
    this._gl.uniformMatrix3fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Float32Array} value
 */
WebGL.prototype.uniformMatrix4fv = function(location,transpose,value) {
    this._gl.uniformMatrix4fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Array[Number} value
 */
WebGL.prototype.uniformMatrix4fv = function(location,transpose,value) {
    this._gl.uniformMatrix4fv(location,transpose,value);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.useProgram = function(program) {
    this._gl.useProgram(program);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.validateProgram = function(program) {
    this._gl.validateProgram(program);
};
/**
 @param {Number} indx
 @param {Number} x
 */
WebGL.prototype.vertexAttrib1f = function(indx,x) {
    this._gl.vertexAttrib1f(indx,x);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib1fv = function(indx,values) {
    this._gl.vertexAttrib1fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib1fv = function(indx,values) {
    this._gl.vertexAttrib1fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} x
 @param {Number} y
 */
WebGL.prototype.vertexAttrib2f = function(indx,x,y) {
    this._gl.vertexAttrib2f(indx,x,y);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib2fv = function(indx,values) {
    this._gl.vertexAttrib2fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib2fv = function(indx,values) {
    this._gl.vertexAttrib2fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} x
 @param {Number} y
 @param {Number} z
 */
WebGL.prototype.vertexAttrib3f = function(indx,x,y,z) {
    this._gl.vertexAttrib3f(indx,x,y,z);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib3fv = function(indx,values) {
    this._gl.vertexAttrib3fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib3fv = function(indx,values) {
    this._gl.vertexAttrib3fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} x
 @param {Number} y
 @param {Number} z
 @param {Number} w
 */
WebGL.prototype.vertexAttrib4f = function(indx,x,y,z,w) {
    this._gl.vertexAttrib4f(indx,x,y,z,w);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib4fv = function(indx,values) {
    this._gl.vertexAttrib4fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib4fv = function(indx,values) {
    this._gl.vertexAttrib4fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} size
 @param {Number} type
 @param {boolean} normalized
 @param {Number} stride
 @param {Number} offset
 */
WebGL.prototype.vertexAttribPointer = function(indx,size,type,normalized,stride,offset) {
    this._gl.vertexAttribPointer(indx,size,type,normalized,stride,offset);
};
/**
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @return {void}
 */
WebGL.prototype.viewport = function(x,y,width,height) {
    this._gl.viewport(x,y,width,height);
};

module.exports = WebGL;
},{}],10:[function(require,module,exports){

//for node debug
var Mat33 =
{
    make : function()
    {
        return new Float32Array([1,0,0,
                                 0,1,0,
                                 0,0,1]);
    },

    transpose : function(out,a)
    {

        if (out === a) {
            var a01 = a[1], a02 = a[2], a12 = a[5];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a01;
            out[5] = a[7];
            out[6] = a02;
            out[7] = a12;
        } else {
            out[0] = a[0];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a[1];
            out[4] = a[4];
            out[5] = a[7];
            out[6] = a[2];
            out[7] = a[5];
            out[8] = a[8];
        }

        return out;
    }

};

module.exports = Mat33;
},{}],11:[function(require,module,exports){
var fMath = require('./fMath'),
    Mat33 = require('./Matrix33');

//for node debug
var Matrix44 = {
    create: function () {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ]);
    },

    set: function (m0, m1) {
        m0[ 0] = m1[ 0];
        m0[ 1] = m1[ 1];
        m0[ 2] = m1[ 2];
        m0[ 3] = m1[ 3];

        m0[ 4] = m1[ 4];
        m0[ 5] = m1[ 5];
        m0[ 6] = m1[ 6];
        m0[ 7] = m1[ 7];

        m0[ 8] = m1[ 8];
        m0[ 9] = m1[ 9];
        m0[10] = m1[10];
        m0[11] = m1[11];

        m0[12] = m1[12];
        m0[13] = m1[13];
        m0[14] = m1[14];
        m0[15] = m1[15];


        return m0;
    },

    identity: function (m) {
        m[ 0] = 1;
        m[ 1] = m[ 2] = m[ 3] = 0;
        m[ 5] = 1;
        m[ 4] = m[ 6] = m[ 7] = 0;
        m[10] = 1;
        m[ 8] = m[ 9] = m[11] = 0;
        m[15] = 1;
        m[12] = m[13] = m[14] = 0;

        return m;
    },

    copy: function (m) {
        return new Float32Array(m);
    },

    createScale: function (sx, sy, sz, m) {
        m = m || this.create();

        m[0] = sx;
        m[5] = sy;
        m[10] = sz;

        return m;
    },

    createTranslation: function (tx, ty, tz, m) {
        m = m || this.create();

        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        return m;
    },

    createRotationX: function (a, m) {
        m = m || this.create();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[5] = cos;
        m[6] = -sin;
        m[9] = sin;
        m[10] = cos;

        return m;
    },

    createRotationY: function (a, m) {
        m = m || this.create();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[2] = sin;
        m[8] = -sin;
        m[10] = cos;

        return m;
    },

    createRotationZ: function (a, m) {
        m = m || this.create();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[1] = sin;
        m[4] = -sin;
        m[5] = cos;

        return m;
    },

    createRotation: function (ax, ay, az, m) {
        m = m || this.create();

        var cosx = Math.cos(ax),
            sinx = Math.sin(ax),
            cosy = Math.cos(ay),
            siny = Math.sin(ay),
            cosz = Math.cos(az),
            sinz = Math.sin(az);

        m[ 0] = cosy * cosz;
        m[ 1] = -cosx * sinz + sinx * siny * cosz;
        m[ 2] = sinx * sinz + cosx * siny * cosz;

        m[ 4] = cosy * sinz;
        m[ 5] = cosx * cosz + sinx * siny * sinz;
        m[ 6] = -sinx * cosz + cosx * siny * sinz;

        m[ 8] = -siny;
        m[ 9] = sinx * cosy;
        m[10] = cosx * cosy;


        return m;
    },

    //temp from glMatrix
    createRotationOnAxis: function (rot, x, y, z, out) {
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.sqrt(x * x + y * y + z * z) < fMath.EPSILON) {
            return null;
        }

        var s, c, t,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;


        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rot);
        c = Math.cos(rot);
        t = 1 - c;

        out = out || Matrix44.create();

        a00 = 1;
        a01 = 0;
        a02 = 0;
        a03 = 0;
        a10 = 0;
        a11 = 1;
        a12 = 0;
        a13 = 0;
        a20 = 0;
        a21 = 0;
        a22 = 1;
        a23 = 0;

        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        out[0 ] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1 ] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2 ] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3 ] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4 ] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5 ] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6 ] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7 ] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8 ] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9 ] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return out;
    },

    multPre: function (m0, m1, m) {
        m = m || this.create();

        var m000 = m0[ 0], m001 = m0[ 1], m002 = m0[ 2], m003 = m0[ 3],
            m004 = m0[ 4], m005 = m0[ 5], m006 = m0[ 6], m007 = m0[ 7],
            m008 = m0[ 8], m009 = m0[ 9], m010 = m0[10], m011 = m0[11],
            m012 = m0[12], m013 = m0[13], m014 = m0[14], m015 = m0[15];

        var m100 = m1[ 0], m101 = m1[ 1], m102 = m1[ 2], m103 = m1[ 3],
            m104 = m1[ 4], m105 = m1[ 5], m106 = m1[ 6], m107 = m1[ 7],
            m108 = m1[ 8], m109 = m1[ 9], m110 = m1[10], m111 = m1[11],
            m112 = m1[12], m113 = m1[13], m114 = m1[14], m115 = m1[15];

        m[ 0] = m000 * m100 + m001 * m104 + m002 * m108 + m003 * m112;
        m[ 1] = m000 * m101 + m001 * m105 + m002 * m109 + m003 * m113;
        m[ 2] = m000 * m102 + m001 * m106 + m002 * m110 + m003 * m114;
        m[ 3] = m000 * m103 + m001 * m107 + m002 * m111 + m003 * m115;

        m[ 4] = m004 * m100 + m005 * m104 + m006 * m108 + m007 * m112;
        m[ 5] = m004 * m101 + m005 * m105 + m006 * m109 + m007 * m113;
        m[ 6] = m004 * m102 + m005 * m106 + m006 * m110 + m007 * m114;
        m[ 7] = m004 * m103 + m005 * m107 + m006 * m111 + m007 * m115;

        m[ 8] = m008 * m100 + m009 * m104 + m010 * m108 + m011 * m112;
        m[ 9] = m008 * m101 + m009 * m105 + m010 * m109 + m011 * m113;
        m[10] = m008 * m102 + m009 * m106 + m010 * m110 + m011 * m114;
        m[11] = m008 * m103 + m009 * m107 + m010 * m111 + m011 * m115;

        m[12] = m012 * m100 + m013 * m104 + m014 * m108 + m015 * m112;
        m[13] = m012 * m101 + m013 * m105 + m014 * m109 + m015 * m113;
        m[14] = m012 * m102 + m013 * m106 + m014 * m110 + m015 * m114;
        m[15] = m012 * m103 + m013 * m107 + m014 * m111 + m015 * m115;


        return m;
    },

    mult: function (m0, m1, m) {
        return this.multPre(m0, m1, m);
    },

    multPost: function (m0, m1, m) {
        return this.multPre(m1, m0, m);
    },

    invert: function (m, o) {
        o = o || m;

        var det;

        var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
            m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
            m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
            m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

        //TODO: add caching

        o[ 0] = m05 * m10 * m15 -
            m05 * m11 * m14 -
            m09 * m06 * m15 +
            m09 * m07 * m14 +
            m13 * m06 * m11 -
            m13 * m07 * m10;

        o[ 4] = -m04 * m10 * m15 +
            m04 * m11 * m14 +
            m08 * m06 * m15 -
            m08 * m07 * m14 -
            m12 * m06 * m11 +
            m12 * m07 * m10;

        o[ 8] = m04 * m09 * m15 -
            m04 * m11 * m13 -
            m08 * m05 * m15 +
            m08 * m07 * m13 +
            m12 * m05 * m11 -
            m12 * m07 * m09;

        o[12] = -m04 * m09 * m14 +
            m04 * m10 * m13 +
            m08 * m05 * m14 -
            m08 * m06 * m13 -
            m12 * m05 * m10 +
            m12 * m06 * m09;

        o[ 1] = -m01 * m10 * m15 +
            m01 * m11 * m14 +
            m09 * m02 * m15 -
            m09 * m03 * m14 -
            m13 * m02 * m11 +
            m13 * m03 * m10;

        o[ 5] = m00 * m10 * m15 -
            m00 * m11 * m14 -
            m08 * m02 * m15 +
            m08 * m03 * m14 +
            m12 * m02 * m11 -
            m12 * m03 * m10;

        o[ 9] = -m00 * m09 * m15 +
            m00 * m11 * m13 +
            m08 * m01 * m15 -
            m08 * m03 * m13 -
            m12 * m01 * m11 +
            m12 * m03 * m09;

        o[13] = m00 * m09 * m14 -
            m00 * m10 * m13 -
            m08 * m01 * m14 +
            m08 * m02 * m13 +
            m12 * m01 * m10 -
            m12 * m02 * m09;

        o[ 2] = m01 * m06 * m15 -
            m01 * m07 * m14 -
            m05 * m02 * m15 +
            m05 * m03 * m14 +
            m13 * m02 * m07 -
            m13 * m03 * m06;

        o[ 6] = -m00 * m06 * m15 +
            m00 * m07 * m14 +
            m04 * m02 * m15 -
            m04 * m03 * m14 -
            m12 * m02 * m07 +
            m12 * m03 * m06;

        o[10] = m00 * m05 * m15 -
            m00 * m07 * m13 -
            m04 * m01 * m15 +
            m04 * m03 * m13 +
            m12 * m01 * m07 -
            m12 * m03 * m05;

        o[14] = -m00 * m05 * m14 +
            m00 * m06 * m13 +
            m04 * m01 * m14 -
            m04 * m02 * m13 -
            m12 * m01 * m06 +
            m12 * m02 * m05;

        o[ 3] = -m01 * m06 * m11 +
            m01 * m07 * m10 +
            m05 * m02 * m11 -
            m05 * m03 * m10 -
            m09 * m02 * m07 +
            m09 * m03 * m06;

        o[ 7] = m00 * m06 * m11 -
            m00 * m07 * m10 -
            m04 * m02 * m11 +
            m04 * m03 * m10 +
            m08 * m02 * m07 -
            m08 * m03 * m06;

        o[11] = -m00 * m05 * m11 +
            m00 * m07 * m09 +
            m04 * m01 * m11 -
            m04 * m03 * m09 -
            m08 * m01 * m07 +
            m08 * m03 * m05;

        o[15] = m00 * m05 * m10 -
            m00 * m06 * m09 -
            m04 * m01 * m10 +
            m04 * m02 * m09 +
            m08 * m01 * m06 -
            m08 * m02 * m05;

        det = m00 * o[0] + m01 * o[4] + m02 * o[8] + m03 * o[12];

        if (det == 0) return null;

        det = 1.0 / det;

        o[ 0] *= det;
        o[ 1] *= det;
        o[ 2] *= det;
        o[ 3] *= det;
        o[ 4] *= det;
        o[ 5] *= det;
        o[ 6] *= det;
        o[ 7] *= det;
        o[ 8] *= det;
        o[ 9] *= det;
        o[10] *= det;
        o[11] *= det;
        o[12] *= det;
        o[13] *= det;
        o[14] *= det;
        o[15] *= det;

        return o;
    },


    inverted: function (m) {
        /*
         var inv = this.create();
         var det;

         var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
         m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
         m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
         m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

         inv[ 0] =  m05  * m10  * m15 -
         m05  * m11  * m14 -
         m09  * m06  * m15 +
         m09  * m07  * m14 +
         m13  * m06  * m11 -
         m13  * m07  * m10;

         inv[ 4] = -m04  * m10  * m15 +
         m04  * m11  * m14 +
         m08  * m06  * m15 -
         m08  * m07  * m14 -
         m12  * m06  * m11 +
         m12  * m07  * m10;

         inv[ 8] =  m04  * m09  * m15 -
         m04  * m11  * m13 -
         m08  * m05  * m15 +
         m08  * m07  * m13 +
         m12  * m05  * m11 -
         m12  * m07  * m09;

         inv[12] = -m04  * m09  * m14 +
         m04  * m10  * m13 +
         m08  * m05  * m14 -
         m08  * m06  * m13 -
         m12  * m05  * m10 +
         m12  * m06  * m09;

         inv[ 1] = -m01  * m10  * m15 +
         m01  * m11  * m14 +
         m09  * m02  * m15 -
         m09  * m03  * m14 -
         m13  * m02  * m11 +
         m13  * m03  * m10;

         inv[ 5] =  m00  * m10  * m15 -
         m00  * m11  * m14 -
         m08  * m02  * m15 +
         m08  * m03  * m14 +
         m12  * m02  * m11 -
         m12  * m03  * m10;

         inv[ 9] = -m00  * m09  * m15 +
         m00  * m11  * m13 +
         m08  * m01  * m15 -
         m08  * m03  * m13 -
         m12  * m01  * m11 +
         m12  * m03  * m09;

         inv[13] =  m00  * m09  * m14 -
         m00  * m10  * m13 -
         m08  * m01  * m14 +
         m08  * m02  * m13 +
         m12  * m01  * m10 -
         m12  * m02  * m09;

         inv[ 2] =  m01  * m06  * m15 -
         m01  * m07  * m14 -
         m05  * m02  * m15 +
         m05  * m03  * m14 +
         m13  * m02  * m07 -
         m13  * m03  * m06;

         inv[ 6] = -m00  * m06  * m15 +
         m00  * m07  * m14 +
         m04  * m02  * m15 -
         m04  * m03  * m14 -
         m12  * m02  * m07 +
         m12  * m03  * m06;

         inv[10] =  m00  * m05  * m15 -
         m00  * m07  * m13 -
         m04  * m01  * m15 +
         m04  * m03  * m13 +
         m12  * m01  * m07 -
         m12  * m03  * m05;

         inv[14] = -m00  * m05  * m14 +
         m00  * m06  * m13 +
         m04  * m01  * m14 -
         m04  * m02  * m13 -
         m12  * m01  * m06 +
         m12  * m02  * m05;

         inv[ 3] = -m01  * m06  * m11 +
         m01  * m07  * m10 +
         m05  * m02  * m11 -
         m05  * m03  * m10 -
         m09  * m02  * m07 +
         m09  * m03  * m06;

         inv[ 7] =  m00  * m06  * m11 -
         m00  * m07  * m10 -
         m04  * m02  * m11 +
         m04  * m03  * m10 +
         m08  * m02  * m07 -
         m08  * m03  * m06;

         inv[11] = -m00  * m05  * m11 +
         m00  * m07  * m09 +
         m04  * m01  * m11 -
         m04  * m03  * m09 -
         m08  * m01  * m07 +
         m08  * m03  * m05;

         inv[15] =  m00  * m05  * m10 -
         m00  * m06  * m09 -
         m04  * m01  * m10 +
         m04  * m02  * m09 +
         m08  * m01  * m06 -
         m08  * m02  * m05;

         det = m00 * inv[0] + m01 * inv[4] + m02 * inv[8] + m03 * inv[12];

         if(det == 0) return null;

         det = 1.0 / det;

         inv[ 0]*=det;
         inv[ 1]*=det;
         inv[ 2]*=det;
         inv[ 3]*=det;
         inv[ 4]*=det;
         inv[ 5]*=det;
         inv[ 6]*=det;
         inv[ 7]*=det;
         inv[ 8]*=det;
         inv[ 9]*=det;
         inv[10]*=det;
         inv[11]*=det;
         inv[12]*=det;
         inv[13]*=det;
         inv[14]*=det;
         inv[15]*=det;


         return inv;

         */

        return this.invert(this.copy(m));


    },

    transposed: function (m) {
        var mo = this.create();

        mo[0 ] = m[0 ];
        mo[1 ] = m[4 ];
        mo[2 ] = m[8 ];
        mo[3 ] = m[12];

        mo[4 ] = m[1 ];
        mo[5 ] = m[5 ];
        mo[6 ] = m[9 ];
        mo[7 ] = m[13];

        mo[8 ] = m[2 ];
        mo[9 ] = m[6 ];
        mo[10] = m[10];
        mo[11] = m[14];

        mo[12] = m[3 ];
        mo[13] = m[7 ];
        mo[14] = m[11];
        mo[15] = m[15];

        return mo;
    },

    toMat33Inversed: function (mat44, mat33) {
        var a00 = mat44[0], a01 = mat44[1], a02 = mat44[2];
        var a10 = mat44[4], a11 = mat44[5], a12 = mat44[6];
        var a20 = mat44[8], a21 = mat44[9], a22 = mat44[10];

        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;

        var d = a00 * b01 + a01 * b11 + a02 * b21;
        if (!d) {
            return null;
        }
        var id = 1 / d;


        if (!mat33) {
            mat33 = Mat33.create();
        }

        mat33[0] = b01 * id;
        mat33[1] = (-a22 * a01 + a02 * a21) * id;
        mat33[2] = (a12 * a01 - a02 * a11) * id;
        mat33[3] = b11 * id;
        mat33[4] = (a22 * a00 - a02 * a20) * id;
        mat33[5] = (-a12 * a00 + a02 * a10) * id;
        mat33[6] = b21 * id;
        mat33[7] = (-a21 * a00 + a01 * a20) * id;
        mat33[8] = (a11 * a00 - a01 * a10) * id;

        return mat33;


    },

    multVec3: function (m, v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

        return v;
    },

    mutlVec3A: function (m, a, i) {
        i *= 3;

        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec3AI: function (m, a, i) {
        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec4: function (m, v) {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        v[3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

        return v;


    },

    multVec4A: function (m, a, i) {
        i *= 3;

        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2],
            w = a[i + 3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i + 3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    multVec4AI: function (m, a, i) {
        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2],
            w = a[i + 3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i + 3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    isFloatEqual: function (m0, m1) {
        var i = -1;
        while (++i < 16) {
            if (!fMath.isFloatEqual(m0[i], m1[i]))return false;
        }
        return true;

    },

    toString: function (m) {
        return '[' + m[ 0] + ', ' + m[ 1] + ', ' + m[ 2] + ', ' + m[ 3] + ',\n' +
            ' ' + m[ 4] + ', ' + m[ 5] + ', ' + m[ 6] + ', ' + m[ 7] + ',\n' +
            ' ' + m[ 8] + ', ' + m[ 9] + ', ' + m[10] + ', ' + m[11] + ',\n' +
            ' ' + m[12] + ', ' + m[13] + ', ' + m[14] + ', ' + m[15] + ']';
    }
};

module.exports = Matrix44;
},{"./Matrix33":10,"./fMath":14}],12:[function(require,module,exports){
var Vec2 =
{
    SIZE : 2,

    create : function(){
        return new Float32Array([0,0]);
    }
};

module.exports = Vec2;
},{}],13:[function(require,module,exports){
var Vec3 =
{
    SIZE: 3,
    ZERO: function () {
        return new Float32Array([0, 0, 0])
    },
    AXIS_X: function () {
        return new Float32Array([1, 0, 0])
    },
    AXIS_Y: function () {
        return new Float32Array([0, 1, 0])
    },
    AXIS_Z: function () {
        return new Float32Array([0, 0, 1])
    },

    create: function (x, y, z) {
        return new Float32Array([
                typeof x !== 'undefined' ? x : 0.0,
                typeof y !== 'undefined' ? y : 0.0,
                typeof z !== 'undefined' ? z : 0.0  ]);
    },

    set: function (v0, v1) {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];

        return v0;
    },

    set3f: function (v, x, y, z) {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    copy: function (v) {
        return new Float32Array(v);
    },

    add: function (v0, v1) {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];

        return v0;
    },

    sub: function (v0, v1) {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];

        return v0;
    },

    scale: function (v, n) {
        v[0] *= n;
        v[1] *= n;
        v[2] *= n;

        return v;
    },

    dot: function (v0, v1) {
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    },

    cross: function (v0, v1, vo) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        vo = vo || this.make();

        vo[0] = y0 * z1 - y1 * z0;
        vo[1] = z0 * x1 - z1 * x0;
        vo[2] = x0 * y1 - x1 * y0;


        return vo;
    },

    lerp: function (v0, v1, f) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2];

        v0[0] = x0 * (1.0 - f) + v1[0] * f;
        v0[1] = y0 * (1.0 - f) + v1[1] * f;
        v0[2] = z0 * (1.0 - f) + v1[2] * f;

        return v0;
    },

    lerped: function (v0, v1, f, vo) {
        vo = vo || vo.create();

        vo[0] = v0[0];
        vo[1] = v0[1];
        vo[2] = v0[2];

        return this.lerp(vo, v1, f);
    },


    lerp3f: function (v, x, y, z, f) {
        var vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = vx * (1.0 - f) + x * f;
        v[1] = vy * (1.0 - f) + y * f;
        v[2] = vz * (1.0 - f) + z * f;
    },

    lerped3f: function (v, x, y, z, f, vo) {
        vo = vo || this.make();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.lerp3f(vo, x, y, z, f);
    },


    length: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    lengthSq: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return x * x + y * y + z * z;
    },

    safeNormalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var d = Math.sqrt(x * x + y * y + z * z);
        d = d || 1;

        var l = 1 / d;

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    normalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var l = 1 / Math.sqrt(x * x + y * y + z * z);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    distance: function (v0, v1) {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    distance3f: function (v, x, y, z) {
        return Math.sqrt(v[0] * x + v[1] * y + v[2] * z);
    },

    distanceSq: function (v0, v1) {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x * x + y * y + z * z;
    },

    distanceSq3f: function (v, x, y, z) {
        return v[0] * x + v[1] * y + v[2] * z;
    },

    limit: function (v, n) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x * x + y * y + z * z,
            lsq = n * n;

        if ((dsq > lsq) && lsq > 0) {
            var nd = n / Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert: function (v) {
        v[0] *= -1;
        v[1] *= -1;
        v[2] *= -1;

        return v;
    },

    added: function (v0, v1, vo) {
        vo = vo || this.make();

        vo[0] = v0[0] + v1[0];
        vo[1] = v0[1] + v1[1];
        vo[2] = v0[2] + v1[2];

        return vo;
    },

    subbed: function (v0, v1, vo) {
        vo = vo || this.make();

        vo[0] = v0[0] - v1[0];
        vo[1] = v0[1] - v1[1];
        vo[2] = v0[2] - v1[2];

        return vo;
    },

    scaled: function (v, n, vo) {
        vo = vo || this.make();

        vo[0] = v[0] * n;
        vo[1] = v[1] * n;
        vo[2] = v[2] * n;

        return vo;
    },

    normalized: function (v, vo) {
        vo = vo || this.make();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.normalize(vo);
    },

    safeNormalized: function (v, vo) {
        vo = vo || this.make();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.safeNormalize(vo);
    },

    random: function (unitX, unitY, unitZ) {
        unitX = typeof unitX !== 'undefined' ? unitX : 1.0;
        unitY = typeof unitY !== 'undefined' ? unitY : 1.0;
        unitZ = typeof unitZ !== 'undefined' ? unitZ : 1.0;

        return this.make((-0.5 + Math.random()) * 2 * unitX,
                (-0.5 + Math.random()) * 2 * unitY,
                (-0.5 + Math.random()) * 2 * unitZ);
    },


    toString: function (v) {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    }

};

module.exports = Vec3;




},{}],14:[function(require,module,exports){
var fMath =
{
    PI          : Math.PI,
    HALF_PI     : Math.PI * 0.5,
    QUARTER_PI  : Math.PI * 0.25,
    TWO_PI      : Math.PI * 2,
    EPSILON     : 0.0001,

    lerp        : function(a,b,v){return (a*(1-v))+(b*v);},
    cosIntrpl   : function(a,b,v){v = (1 - Math.cos(v * Math.PI)) * 0.5;return (a * (1-v) + b * v);},
    cubicIntrpl : function(a,b,c,d,v)
    {
        var a0,b0,c0,d0,vv;

        vv = v * v;
        a0 = d - c - a + b;
        b0 = a - b - a0;
        c0 = c - a;
        d0 = b;

        return a0*v*vv+b0*vv+c0*v+d0;
    },

    hermiteIntrpl : function(a,b,c,d,v,tension,bias)
    {
        var v0, v1, v2, v3,
            a0, b0, c0, d0;

        tension = (1.0 - tension) * 0.5;

        var biasp = 1 + bias,
            biasn = 1 - bias;

        v2  = v * v;
        v3  = v2 * v;

        v0  = (b - a) * biasp * tension;
        v0 += (c - b) * biasn * tension;
        v1  = (c - b) * biasp * tension;
        v1 += (d - c) * biasn * tension;

        a0  = 2 * v3 - 3 * v2 + 1;
        b0  = v3 - 2 * v2 + v;
        c0  = v3 - v2;
        d0  = -2 * v3 + 3 * v2;

        return a0 * b + b0 * v0 + c0 * v1 + d0 * c;
    },

    randomFloat : function()
    {
        var r;

        switch (arguments.length)
        {
            case 0: r = Math.random();break;
            case 1: r = Math.random() * arguments[0];break;
            case 2: r = arguments[0] + (arguments[1]-arguments[0]) * Math.random();break;
        }

        return r;
    },

    randomInteger : function()
    {
        var r;

        switch (arguments.length)
        {
            case 0: r = 0.5 + Math.random();break;
            case 1: r = 0.5 + Math.random()*arguments[0];break;
            case 2: r = arguments[0] + ( 1 + arguments[1] - arguments[0]) * Math.random();break;
        }

        return Math.floor(r);
    },

    constrain : function()
    {
        var r;

        switch (arguments.length)
        {
            case 2: arguments[0] = (arguments[0] > arguments[1]) ? arguments[1] : arguments[0];break;
            case 3: arguments[0] = (arguments[0] > arguments[2]) ? arguments[2] : (arguments[0] < arguments[1]) ? arguments[1] :arguments[0];break;
        }

        return arguments[0];
    },

    normalize             : function(value,start,end){return (value - start) / (end - start);},
    map                   : function(value,inStart,inEnd,outStart,outEnd){return outStart + (outEnd - outStart) * normalize(value,inStart,inEnd);},
    sin                   : function(value){return Math.sin(value);},
    cos                   : function(value){return Math.cos(value);},
    clamp                 : function(value,min,max){return Math.max(min,Math.min(max,value));},
    saw                   : function(n){return 2 * (n  - Math.floor(0.5 + n ));},
    tri                   : function(n){return 1-4*Math.abs(0.5-this.frac(0.5*n+0.25));},
    rect                  : function(n){var a = Math.abs(n);return (a > 0.5) ? 0 : (a == 0.5) ? 0.5 : (a < 0.5) ? 1 : -1;},
    frac                  : function(n){return n - Math.floor(n);},
    sgn                   : function(n){return n/Math.abs(n);},
    abs                   : function(n){return Math.abs(n);},
    min                   : function(n){return Math.min(n);},
    max                   : function(n){return Math.max(n);},
    atan                  : function(n){return Math.atan(n);},
    atan2                 : function(y,x){return Math.atan2(y,x);},
    round                 : function(n){return Math.round(n);},
    floor                 : function(n){return Math.floor(n);},
    tan                   : function(n){return Math.tan(n);},
    rad2deg               : function(radians){return radians * (180 / Math.PI);},
    deg2rad               : function(degree){return degree * (Math.PI / 180); },
    sqrt                  : function(value){return Math.sqrt(value);},
    GreatestCommonDivisor : function(a,b){return (b == 0) ? a : this.GreatestCommonDivisor(b, a % b);},
    isFloatEqual          : function(a,b){return (Math.abs(a-b)<this.EPSILON);},
    isPowerOfTwo          : function(a){return (a&(a-1))==0;},
    swap                  : function(a,b){var t = a;a = b; b = a;},
    pow                   : function(x,y){return Math.pow(x,y);},
    log                   : function(n){return Math.log(n);},
    cosh                  : function(n){return (Math.pow(Math.E,n) + Math.pow(Math.E,-n))*0.5;},
    exp                   : function(n){return Math.exp(n);},
    stepSmooth            : function(n){return n*n*(3-2*n);},
    stepSmoothSquared     : function(n){return this.stepSmooth(n) * this.stepSmooth(n);},
    stepSmoothInvSquared  : function(n){return 1-(1-this.stepSmooth(n))*(1-this.stepSmooth(n));},
    stepSmoothCubed       : function(n){return this.stepSmooth(n)*this.stepSmooth(n)*this.stepSmooth(n)*this.stepSmooth(n);},
    stepSmoothInvCubed    : function(n){return 1-(1-this.stepSmooth(n))*(1-this.stepSmooth(n))*(1-this.stepSmooth(n))*(1-this.stepSmooth(n));},
    stepSquared           : function(n){return n*n;},
    stepInvSquared        : function(n){return 1-(1-n)*(1-n);},
    stepCubed             : function(n){return n*n*n*n;},
    stepInvCubed          : function(n){return 1-(1-n)*(1-n)*(1-n)*(1-n);},
    catmullrom            : function(a,b,c,d,i){ return a * ((-i + 2) * i - 1) * i * 0.5 +
                                                        b * (((3 * i - 5) * i) * i + 2) * 0.5 +
                                                        c * ((-3 * i + 4) * i + 1) * i * 0.5 +
                                                        d * ((i - 1) * i * i) * 0.5;}
};


module.exports = fMath;
},{}],15:[function(require,module,exports){
module.exports =
{
    METHOD_NOT_IMPLEMENTED: 'Method not implemented in target platform.',
    CLASS_IS_SINGLETON:     'App is singleton. Get via getInstance().',
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
//temp
var Shared =
{
    __windowSize : new Float32Array([0,0])
};

module.exports = Shared;
},{}],19:[function(require,module,exports){
var Log = {
    assert : console.assert || function(){}
};

module.exports = Log;


},{}],20:[function(require,module,exports){
var fError     = require('../system/common/Error'),
    Vec2       = require('../math/Vec2');

function Mouse()
{
    if(Mouse.__instance)throw new Error(Error.CLASS_IS_SINGLETON);

    this._position     = Vec2.create();
    this._positionLast = Vec2.create();
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
},{"../math/Vec2":12,"../system/common/Error":15}],21:[function(require,module,exports){
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vZXhhbXBsZXMvMDBfQmFzaWNfQXBwbGljYXRpb24vYXBwLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2FwcC9BcHAuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vYXBwL2ZBcHBJbXBsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2FwcC9mQXBwSW1wbFdlYi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9mb2FtLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL0NhbWVyYS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC9mTWF0R0wuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ3JhcGhpY3Mvd2ViZ2wuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9NYXRyaXgzMy5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9tYXRoL01hdHJpeDQ0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL21hdGgvVmVjMi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9tYXRoL1ZlYzMuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9mTWF0aC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9zeXN0ZW0vY29tbW9uL0Vycm9yLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL3N5c3RlbS9jb21tb24vZkRlZmF1bHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vc3lzdGVtL2NvbW1vbi9mUGxhdGZvcm0uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vc3lzdGVtL2ZTaGFyZWQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9Mb2cuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mTW91c2UuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mT2JqZWN0VXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4cENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3c0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBGb2FtID0gcmVxdWlyZSgnLi4vLi4vc3JjL2ZvYW0vZm9hbS5qcycpO1xuXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgRm9hbS5BcHBsaWNhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zZXRGUFMoNjApO1xuICAgIHRoaXMuc2V0V2luZG93U2l6ZSg4MDAsIDYwMCk7XG5cblxuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICAvL2NvbnNvbGUubG9nKGdsLnZpZXdwb3J0KTtcbiAgICBnbC52aWV3cG9ydCgwLDAsdGhpcy5nZXRXaW5kb3dXaWR0aCx0aGlzLmdldFdpbmRvd0hlaWdodCgpKTtcblxufVxuXG5BcHAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGb2FtLkFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XG5cbkFwcC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ3NldHVwJyk7XG59O1xuXG5BcHAucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuXG4gICAgZ2wuY2xlYXJDb2xvcigwLDAsMCwxKTtcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcblxuXG59O1xuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpe1xuICAgIHZhciBhcHAgPSBuZXcgQXBwKCk7XG59KTtcbiIsInZhciBmRXJyb3IgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL0Vycm9yJyksXG4gICAgT2JqZWN0VXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvZk9iamVjdFV0aWwnKSxcbiAgICBQbGF0Zm9ybSA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vZlBsYXRmb3JtJyksXG4gICAgU2hhcmVkID0gcmVxdWlyZSgnLi4vc3lzdGVtL2ZTaGFyZWQnKSxcbiAgICBBcHBJbXBsV2ViID0gcmVxdWlyZSgnLi9mQXBwSW1wbFdlYicpLFxuICAgIE1vdXNlID0gcmVxdWlyZSgnLi4vdXRpbC9mTW91c2UnKSxcbiAgICBHTCA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dsJyk7XG5cbnZhciBEZWZhdWx0ICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vZkRlZmF1bHQnKTtcblxuZnVuY3Rpb24gQXBwKCkge1xuICAgIGlmIChBcHAuX19pbnN0YW5jZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuQ0xBU1NfSVNfU0lOR0xFVE9OKTtcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0ID0gUGxhdGZvcm0uZ2V0VGFyZ2V0KCk7XG4gICAgaWYgKE9iamVjdFV0aWwuaXNVbmRlZmluZWQodGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuV1JPTkdfUExBVEZPUk0pO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gIENvbnRleHQgJiBXaW5kb3dcbiAgICAvL1xuICAgIHRoaXMuX3dpbmRvd1RpdGxlID0gbnVsbDtcbiAgICB0aGlzLl9mdWxsV2luZG93ID0gZmFsc2U7XG4gICAgdGhpcy5fZnVsbHNjcmVlbiA9IGZhbHNlO1xuICAgIHRoaXMuX3dpbmRvd1NpemUgPSBbMCwwXTtcbiAgICB0aGlzLl93aW5kb3dSYXRpbyA9IDA7XG5cbiAgICAvL1xuICAgIC8vICBpbnB1dFxuICAgIC8vXG4gICAgdGhpcy5fa2V5RG93biA9IGZhbHNlO1xuICAgIHRoaXMuX2tleVN0ciA9ICcnO1xuICAgIHRoaXMuX2tleUNvZGUgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcbiAgICB0aGlzLl9tb3VzZU1vdmUgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZUJvdW5kcyA9IHRydWU7XG4gICAgdGhpcy5faGlkZUN1cnNvciA9IGZhbHNlO1xuXG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSgpO1xuXG4gICAgLy9cbiAgICAvLyAgdGltZVxuICAgIC8vXG4gICAgdGhpcy5fZnJhbWVudW0gPSAwO1xuICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgIHRoaXMuX3RpbWVTdGFydCA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fdGltZU5leHQgPSAwO1xuICAgIHRoaXMuX3RhcmdldEZQUyA9IC0xO1xuICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IC0xO1xuICAgIHRoaXMuX3RpbWVEZWx0YSA9IDA7XG4gICAgdGhpcy5fdGltZUVsYXBzZWQgPSAwO1xuICAgIHRoaXMuX2xvb3AgPSB0cnVlO1xuXG4gICAgdGhpcy5zZXRGUFMoMzAuMCk7XG5cbiAgICAvL1xuICAgIC8vICBjYW52YXMgJiBjb250ZXh0XG4gICAgLy9cbiAgICB2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnMCcpO1xuICAgICAgICBjYW52YXMuZm9jdXMoKTtcblxuICAgIHRoaXMuX2NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICAgIHRoaXMuZ2wgPSBuZXcgR0wodGhpcy5fY29udGV4dCk7XG5cbiAgICBBcHAuX19pbnN0YW5jZSA9IHRoaXM7XG5cbiAgICAvL1xuICAgIC8vXG4gICAgLy9cblxuICAgIHRoaXMuc2V0dXAoKTtcblxuICAgIGlmKHRoaXMuX2xvb3Ape1xuICAgICAgICB2YXIgdGltZSwgdGltZURlbHRhO1xuICAgICAgICB2YXIgdGltZUludGVydmFsID0gdGhpcy5fdGltZUludGVydmFsO1xuICAgICAgICB2YXIgdGltZU5leHQ7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUsIG51bGwpO1xuXG4gICAgICAgICAgICB0aW1lID0gc2VsZi5fdGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aW1lRGVsdGEgPSB0aW1lIC0gc2VsZi5fdGltZU5leHQ7XG5cbiAgICAgICAgICAgIHNlbGYuX3RpbWVEZWx0YSA9IE1hdGgubWluKHRpbWVEZWx0YSAvIHRpbWVJbnRlcnZhbCwgMSk7XG5cblxuICAgICAgICAgICAgaWYgKHRpbWVEZWx0YSA+IHRpbWVJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHRpbWVOZXh0ID0gc2VsZi5fdGltZU5leHQgPSB0aW1lIC0gKHRpbWVEZWx0YSAlIHRpbWVJbnRlcnZhbCk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5fdGltZUVsYXBzZWQgPSAodGltZU5leHQgLSBzZWxmLl90aW1lU3RhcnQpIC8gMTAwMC4wO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZyYW1lbnVtKys7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG5cbn1cblxuQXBwLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBBcHAuX19pbnN0YW5jZTtcbn07XG5cbkFwcC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKEVycm9yLkFQUF9OT19TRVRVUCk7XG59O1xuXG5BcHAucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuQVBQX05PX1VQREFURSk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICB3aW5kb3dcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5BcHAucHJvdG90eXBlLnNldFdpbmRvd1NpemUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCkge1xuICAgIGlmKHRoaXMuX2Z1bGxXaW5kb3cpe1xuICAgICAgICB3aWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGlmICh3aWR0aCAgPT0gdGhpcy5fd2luZG93U2l6ZVswXSAmJiBoZWlnaHQgPT0gdGhpcy5fd2luZG93U2l6ZVsxXSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl93aW5kb3dTaXplWzBdID0gd2lkdGg7XG4gICAgdGhpcy5fd2luZG93U2l6ZVsxXSA9IGhlaWdodDtcbiAgICB0aGlzLl93aW5kb3dSYXRpbyAgID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICB0aGlzLl91cGRhdGVDYW52YXNTaXplKCk7XG59O1xuXG5BcHAucHJvdG90eXBlLnNldEZ1bGxzY3JlZW4gPSBmdW5jdGlvbihib29sKXtcbiAgICB0aGlzLl9mdWxsc2NyZWVuID0gYm9vbDtcbn07XG5cbkFwcC5wcm90b3R5cGUuc2V0RnVsbFdpbmRvdyA9IGZ1bmN0aW9uKGJvb2wpe1xuICAgIHRoaXMuX2Z1bGxXaW5kb3cgPSBib29sO1xufVxuXG5BcHAucHJvdG90eXBlLl91cGRhdGVDYW52YXNTaXplID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzLFxuICAgICAgICB3aWR0aCAgPSB0aGlzLl93aW5kb3dTaXplWzBdLFxuICAgICAgICBoZWlnaHQgPSB0aGlzLl93aW5kb3dTaXplWzFdO1xuXG4gICAgY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG59O1xuXG5BcHAucHJvdG90eXBlLmdldFdpbmRvd1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NpemUuc2xpY2UoKTtcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0V2luZG93V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NpemVbMF07XG59O1xuXG5BcHAucHJvdG90eXBlLmdldFdpbmRvd0hlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2luZG93U2l6ZVsxXTtcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0V2luZG93QXNwZWN0UmF0aW8gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1JhdGlvO1xufTtcblxuQXBwLnByb3RvdHlwZS5vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uIChlKSB7fTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICBmcmFtZXJhdGUgLyB0aW1lXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuQXBwLnByb3RvdHlwZS5zZXRGUFMgPSBmdW5jdGlvbiAoZnBzKSB7XG4gICAgdGhpcy5fdGFyZ2V0RlBTID0gZnBzO1xuICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0RlBTID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl90YXJnZXRGUFM7XG59O1xuXG5BcHAucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lbnVtO1xufTtcbkFwcC5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVFbGFwc2VkO1xufTtcbkFwcC5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGltZVxufTtcblxuQXBwLnByb3RvdHlwZS5nZXRUaW1lU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVTdGFydDtcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0VGltZURlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lRGVsdGE7XG59O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIGlucHV0XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5BcHAucHJvdG90eXBlLmlzS2V5RG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5RG93bjtcbn07XG5BcHAucHJvdG90eXBlLmlzTW91c2VEb3duID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tb3VzZURvd247XG59O1xuQXBwLnByb3RvdHlwZS5pc01vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW91c2VNb3ZlO1xufTtcbkFwcC5wcm90b3R5cGUuZ2V0S2V5Q29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5Q29kZTtcbn07XG5BcHAucHJvdG90eXBlLmdldEtleVN0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5U3RyO1xufTtcbkFwcC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tb3VzZVdoZWVsRGVsdGE7XG59O1xuXG5cbkFwcC5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwLnByb3RvdHlwZS5vbktleVVwID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwLnByb3RvdHlwZS5vbk1vdXNlVXAgPSBmdW5jdGlvbiAoZSkge307XG5BcHAucHJvdG90eXBlLm9uTW91c2VEb3duID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwLnByb3RvdHlwZS5vbk1vdXNlV2hlZWwgPSBmdW5jdGlvbiAoZSkge307XG5BcHAucHJvdG90eXBlLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24gKGUpIHt9O1xuXG5cbi8qXG4gQXBwLnByb3RvdHlwZS5nZXRXaW5kb3dXaWR0aCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvd1dpZHRoKCk7fTtcbiBBcHAucHJvdG90eXBlLmdldFdpbmRvd0hlaWdodCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0V2luZG93SGVpZ2h0KCk7fTtcblxuIEFwcC5wcm90b3R5cGUuc2V0VXBkYXRlID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5fYXBwSW1wbC5zZXRVcGRhdGUoYm9vbCk7fTtcblxuXG5cbiBBcHAucHJvdG90eXBlLnNldFdpbmRvd1RpdGxlICAgICAgID0gZnVuY3Rpb24odGl0bGUpe3RoaXMuX2FwcEltcGwuc2V0V2luZG93VGl0bGUodGl0bGUpO307XG4gQXBwLnByb3RvdHlwZS5yZXN0cmljdE1vdXNlVG9GcmFtZSA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9hcHBJbXBsLnJlc3RyaWN0TW91c2VUb0ZyYW1lKGJvb2wpO307XG4gQXBwLnByb3RvdHlwZS5oaWRlTW91c2VDdXJzb3IgICAgICA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9hcHBJbXBsLmhpZGVNb3VzZUN1cnNvcihib29sKTt9O1xuXG4gQXBwLnByb3RvdHlwZS5zZXRGdWxsV2luZG93RnJhbWUgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbFdpbmRvd0ZyYW1lKGJvb2wpO307XG4gQXBwLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbHNjcmVlbih0cnVlKTt9O1xuIEFwcC5wcm90b3R5cGUuaXNGdWxsc2NyZWVuICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzRnVsbHNjcmVlbigpO307XG4gQXBwLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0Qm9yZGVybGVzcyhib29sKTt9O1xuIEFwcC5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzQm9yZGVybGVzcygpO307XG4gQXBwLnByb3RvdHlwZS5zZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24obnVtKSB7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RGlzcGxheShudW0pO307XG4gQXBwLnByb3RvdHlwZS5nZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RGlzcGxheSgpO307XG5cbiBBcHAucHJvdG90eXBlLnNldEZQUyA9IGZ1bmN0aW9uKGZwcyl7dGhpcy5fYXBwSW1wbC5zZXRGUFMoZnBzKTt9O1xuXG5cbiBBcHAucHJvdG90eXBlLmlzS2V5RG93biAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNLZXlEb3duKCk7fTtcbiBBcHAucHJvdG90eXBlLmlzTW91c2VEb3duICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNNb3VzZURvd24oKTt9O1xuIEFwcC5wcm90b3R5cGUuaXNNb3VzZU1vdmUgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc01vdXNlTW92ZSgpO307XG4gQXBwLnByb3RvdHlwZS5nZXRLZXlTdHIgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleVN0cigpO307XG4gQXBwLnByb3RvdHlwZS5nZXRLZXlDb2RlICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleUNvZGUoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRNb3VzZVdoZWVsRGVsdGEoKTt9O1xuXG5cbiBBcHAucHJvdG90eXBlLm9uS2V5RG93biAgICA9IGZ1bmN0aW9uKGUpe307XG4gQXBwLnByb3RvdHlwZS5vbktleVVwICAgICAgPSBmdW5jdGlvbihlKXt9O1xuIEFwcC5wcm90b3R5cGUub25Nb3VzZVVwICAgID0gZnVuY3Rpb24oZSl7fTtcbiBBcHAucHJvdG90eXBlLm9uTW91c2VEb3duICA9IGZ1bmN0aW9uKGUpe307XG4gQXBwLnByb3RvdHlwZS5vbk1vdXNlV2hlZWwgPSBmdW5jdGlvbihlKXt9O1xuIEFwcC5wcm90b3R5cGUub25Nb3VzZU1vdmUgID0gZnVuY3Rpb24oZSl7fTtcblxuIEFwcC5wcm90b3R5cGUub25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbihlKXt9O1xuXG4gQXBwLnByb3RvdHlwZS5nZXRGcmFtZXNFbGFwc2VkICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RnJhbWVzRWxhcHNlZCgpO307XG4gQXBwLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0U2Vjb25kc0VsYXBzZWQoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0VGltZSAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWUoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVTdGFydCgpO307XG4gQXBwLnByb3RvdHlwZS5nZXRUaW1lTmV4dCAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZU5leHQoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVEZWx0YSgpO307XG5cbiBBcHAucHJvdG90eXBlLmdldFdpbmRvdyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0V2luZG93KCk7fTtcblxuIEFwcC5wcm90b3R5cGUuZ2V0V2luZG93QXNwZWN0UmF0aW8gPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvd0FzcGVjdFJhdGlvKCk7fTtcblxuIEFwcC5fX2luc3RhbmNlICAgPSBudWxsO1xuIEFwcC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKCl7cmV0dXJuIEFwcC5fX2luc3RhbmNlO307XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXBwO1xuXG5cblxuXG5cbiIsInZhciBEZWZhdWx0ICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vZkRlZmF1bHQnKSxcbiAgICBmRXJyb3IgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vRXJyb3InKSxcbiAgICBPYmplY3RVdGlsICA9IHJlcXVpcmUoJy4uL3V0aWwvZk9iamVjdFV0aWwnKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyAgQ29uc3RydWN0b3Jcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5mdW5jdGlvbiBBcHBJbXBsKCkge1xuICAgIHRoaXMuX2NvbnRleHQzZCA9IG51bGw7XG5cbiAgICB0aGlzLl93aW5kb3dUaXRsZSA9IDA7XG4gICAgdGhpcy5faXNGdWxsV2luZG93RnJhbWUgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0Z1bGxzY3JlZW4gPSBmYWxzZTtcbiAgICB0aGlzLl9pc0JvcmRlcmxlc3MgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwbGF5SWQgPSAwO1xuXG4gICAgdGhpcy5fa2V5RG93biA9IGZhbHNlO1xuICAgIHRoaXMuX2tleVN0ciA9ICcnO1xuICAgIHRoaXMuX2tleUNvZGUgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcblxuICAgIHRoaXMuX21vdXNlTW92ZSA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlQm91bmRzID0gdHJ1ZTtcbiAgICB0aGlzLl9oaWRlQ3Vyc29yID0gZmFsc2U7XG5cbiAgICB0aGlzLl90YXJnZXRGUFMgPSBEZWZhdWx0LkFQUF9GUFM7XG4gICAgdGhpcy5fbG9vcCA9IHRydWU7XG5cbiAgICB0aGlzLl9mcmFtZW51bSA9IDA7XG4gICAgdGhpcy5fdGltZSA9IDA7XG4gICAgdGhpcy5fdGltZVN0YXJ0ID0gLTE7XG4gICAgdGhpcy5fdGltZU5leHQgPSAwO1xuICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbiAgICB0aGlzLl90aW1lRGVsdGEgPSAwO1xuICAgIHRoaXMuX3RpbWVFbGFwc2VkID0gMDtcblxuICAgIHRoaXMuX3dpbmRvd1NpemUgICA9IFstMSwtMV07XG4gICAgdGhpcy5fd2luZG93UmF0aW8gID0gLTE7XG5cbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gZmFsc2U7XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIEluaXRcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0luaXRpYWxpemVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0luaXRpYWxpemVkO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChhcHBPYmopIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIGRyYXcgLyB1cGRhdGFcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbkFwcEltcGwucHJvdG90eXBlLmxvb3AgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgIGlmKE9iamVjdFV0aWwuaXNVbmRlZmluZWQoYm9vbCkpe1xuICAgICAgICB0aGlzLl9sb29wID0gdHJ1ZTtcbiAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5fbG9vcCA9IGJvb2w7XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyAgd2luZG93XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKEVycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0V2luZG93V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NpemVbMF07XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRXaW5kb3dIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpbmRvd1NpemVbMV07XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRXaW5kb3dTaXplID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5fd2luZG93U2l6ZS5zbGljZSgpO1xufTtcblxuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRXaW5kb3dBc3BlY3RSYXRpbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2luZG93UmF0aW87XG59O1xuXG4vKlxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZkVycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaXNGdWxsV2luZG93RnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbkFwcEltcGwucHJvdG90eXBlLmlzRnVsbHNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNGdWxsc2NyZWVuO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaXNCb3JkZXJsZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0JvcmRlcmxlc3M7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXREaXNwbGF5ID0gZnVuY3Rpb24gKG51bSkge1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5nZXREaXNwbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5SWQ7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRXaW5kb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTtcbn07XG4qL1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICBmcmFtZXJhdGUgLyB0aW1lXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RlBTID0gZnVuY3Rpb24gKGZwcykge1xuICAgIHRoaXMuX3RhcmdldEZQUyA9IGZwcztcbiAgICB0aGlzLl90aW1lSW50ZXJ2YWwgPSB0aGlzLl90YXJnZXRGUFMgLyAxMDAwLjA7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRGUFMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RhcmdldEZQUztcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZyYW1lbnVtO1xufTtcbkFwcEltcGwucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lRWxhcHNlZDtcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lXG59O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lU3RhcnQ7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVEZWx0YTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gaW5wdXRcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5BcHBJbXBsLnByb3RvdHlwZS5oaWRlTW91c2VDdXJzb3IgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLnNldFdpbmRvd1RpdGxlID0gZnVuY3Rpb24gKHRpdGxlKSB7XG4gICAgdGhpcy5fd2luZG93VGl0bGUgPSB0aXRsZTtcbn07XG5cbkFwcEltcGwucHJvdG90eXBlLnJlc3RyaWN0TW91c2VUb0ZyYW1lID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICB0aGlzLl9tb3VzZUJvdW5kcyA9IGJvb2w7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0tleURvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleURvd247XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNNb3VzZURvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vdXNlRG93bjtcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5pc01vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW91c2VNb3ZlO1xufTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleUNvZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleUNvZGU7XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0S2V5U3RyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlTdHI7XG59O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tb3VzZVdoZWVsRGVsdGE7XG59O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRNb3VzZUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbDsiLCJ2YXIgRGVmYXVsdCA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vZkRlZmF1bHQnKSxcbiAgICBBcHBJbXBsID0gcmVxdWlyZSgnLi9mQXBwSW1wbCcpLFxuICAgIEdMICAgICAgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbCcpO1xuXG5mdW5jdGlvbiBBcHBJbXBsV2ViKCkge1xuICAgIEFwcEltcGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBjYW52YXMzZCA9IHRoaXMuX2NhbnZhczNkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhczNkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICBjYW52YXMzZC5mb2N1cygpO1xuXG4gICAgdGhpcy5fY29udGV4dDNkID0gY2FudmFzM2QuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuXG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0ID0gY2FudmFzM2Q7XG4gICAgdGhpcy5fa2V5RXZlbnRUYXJnZXQgPSBjYW52YXMzZDtcblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICAgIHRoaXMuZmdsID0gbmV3IEdMKHRoaXMuX2NvbnRleHQzZCk7XG5cblxuXG59XG5cbkFwcEltcGxXZWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBJbXBsLnByb3RvdHlwZSk7XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmdldFdpbmRvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dDNkLnBhcmVudE5vZGU7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRXaW5kb3dTaXplID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAodGhpcy5faXNGdWxsV2luZG93RnJhbWUpIHtcbiAgICAgICAgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH1cbiAgICBpZiAod2lkdGggID09IHRoaXMuZ2V0V2luZG93V2lkdGgoKSAmJiBoZWlnaHQgPT0gdGhpcy5nZXRXaW5kb3dIZWlnaHQoKSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl93aW5kb3dTaXplWzBdID0gd2lkdGg7XG4gICAgdGhpcy5fd2luZG93U2l6ZVsxXSA9IGhlaWdodDtcbiAgICB0aGlzLl93aW5kb3dSYXRpbyAgID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICBpZiAoIXRoaXMuX2lzSW5pdGlhbGl6ZWQpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKGFwcE9iaikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbW91c2UgPSBhcHBPYmoubW91c2U7XG4gICAgdmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhczNkO1xuXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLl93aW5kb3dUaXRsZSB8fCBkb2N1bWVudC50aXRsZTtcblxuICAgIGlmICghdGhpcy5fcGFyZW50KXtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BhcmVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUNhbnZhczNkU2l6ZSgpO1xuXG4gICAgdmFyIG1vdXNlRXZlbnRUYXJnZXQgPSB0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0LFxuICAgICAgICBrZXlFdmVudFRhcmdldCA9IHRoaXMuX2tleUV2ZW50VGFyZ2V0O1xuXG5cbiAgICBhcHBPYmouZ2wgPSBuZXcgR0wodGhpcy5fY29udGV4dDNkKTtcblxuXG4gICAgLypcbiAgICAgYXBwT2JqLmZnbC5nbC52aWV3cG9ydCgwLDAsdGhpcy5fd2luZG93V2lkdGgsdGhpcy5fd2luZG93SGVpZ2h0KTtcblxuICAgICBhcHBPYmouY2FtZXJhID0gbmV3IENhbWVyYSgpO1xuICAgICBhcHBPYmouZmdsLnNldENhbWVyYShhcHBPYmouY2FtZXJhKTtcbiAgICAgYXBwT2JqLmNhbWVyYS5zZXRQZXJzcGVjdGl2ZShEZWZhdWx0LkNBTUVSQV9GT1YsXG4gICAgIHNlbGYuX3dpbmRvd1JhdGlvLFxuICAgICBEZWZhdWx0LkNBTUVSQV9ORUFSLFxuICAgICBEZWZhdWx0LkNBTUVSQV9GQVIpO1xuICAgICBhcHBPYmouY2FtZXJhLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICAgYXBwT2JqLmNhbWVyYS51cGRhdGVNYXRyaWNlcygpO1xuXG4gICAgIGFwcE9iai5mZ2wubG9hZElkZW50aXR5KCk7XG4gICAgICovXG5cbiAgICBhcHBPYmouc2V0dXAoKTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyxcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBtb3VzZS5fcG9zaXRpb25bMF07XG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25MYXN0WzFdID0gbW91c2UuX3Bvc2l0aW9uWzFdO1xuXG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25bMF0gPSBlLnBhZ2VYO1xuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzFdID0gZS5wYWdlWTtcblxuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VNb3ZlKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLFxuICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlRG93bihlKTtcblxuICAgICAgICB9KTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsXG4gICAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlVXAoZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLFxuICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VXaGVlbERlbHRhICs9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBlLndoZWVsRGVsdGEpKSAqIC0xO1xuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VXaGVlbChlKTtcbiAgICAgICAgfSk7XG5cblxuICAgIGtleUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgc2VsZi5fa2V5U3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpOy8vbm90IHJlbGlhYmxlO1xuICAgICAgICAgICAgYXBwT2JqLm9uS2V5RG93bihlKTtcblxuICAgICAgICB9KTtcblxuICAgIGtleUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJyxcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuX2tleUNvZGUgPSBlLmtleUNvZGU7XG4gICAgICAgICAgICBzZWxmLl9rZXlTdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSk7XG4gICAgICAgICAgICBhcHBPYmoub25LZXlVcChlKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgdmFyIGZ1bGxXaW5kb3dGcmFtZSA9IHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lO1xuICAgIHZhciBjYW1lcmE7XG4gICAgdmFyIGdsO1xuXG4gICAgdmFyIHdpbmRvd1dpZHRoLFxuICAgICAgICB3aW5kb3dIZWlnaHQ7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDYW1lcmFSYXRpbygpIHtcbiAgICAgICAgY2FtZXJhID0gYXBwT2JqLmNhbWVyYTtcbiAgICAgICAgY2FtZXJhLnNldEFzcGVjdFJhdGlvKHNlbGYuX3dpbmRvd1JhdGlvKTtcbiAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVWaWV3cG9ydEdMKCkge1xuICAgICAgICBnbCA9IGFwcE9iai5mZ2w7XG4gICAgICAgIGdsLnZpZXdwb3J0KDAsIDAsIHNlbGYuZ2V0V2luZG93V2lkdGgoKSwgc2VsZi5nZXRXaW5kb3dIZWlnaHQoKSk7XG4gICAgICAgIGdsLmNsZWFyQ29sb3IoMCwwLDAsMCk7XG4gICAgfVxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJyxcbiAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChmdWxsV2luZG93RnJhbWUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNldFdpbmRvd1NpemUod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCk7XG5cbiAgICAgICAgICAgICAgICB1cGRhdGVDYW1lcmFSYXRpbygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVZpZXdwb3J0R0woKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBwT2JqLm9uV2luZG93UmVzaXplKGUpO1xuXG4gICAgICAgICAgICBpZiAoIWZ1bGxXaW5kb3dGcmFtZSAmJiAoc2VsZi5fd2luZG93V2lkdGggPT0gd2luZG93V2lkdGggJiYgc2VsZi5fd2luZG93SGVpZ2h0ID09IHdpbmRvd0hlaWdodCkpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVDYW1lcmFSYXRpbygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVZpZXdwb3J0R0woKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBpZiAodGhpcy5fbG9vcCkge1xuICAgICAgICB2YXIgdGltZSwgdGltZURlbHRhO1xuICAgICAgICB2YXIgdGltZUludGVydmFsID0gdGhpcy5fdGltZUludGVydmFsO1xuICAgICAgICB2YXIgdGltZU5leHQ7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICAgIHRpbWUgPSBzZWxmLl90aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRpbWVEZWx0YSA9IHRpbWUgLSBzZWxmLl90aW1lTmV4dDtcblxuICAgICAgICAgICAgc2VsZi5fdGltZURlbHRhID0gTWF0aC5taW4odGltZURlbHRhIC8gdGltZUludGVydmFsLCAxKTtcblxuICAgICAgICAgICAgaWYgKHRpbWVEZWx0YSA+IHRpbWVJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHRpbWVOZXh0ID0gc2VsZi5fdGltZU5leHQgPSB0aW1lIC0gKHRpbWVEZWx0YSAlIHRpbWVJbnRlcnZhbCk7XG5cbiAgICAgICAgICAgICAgICBhcHBPYmoudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLl90aW1lRWxhcHNlZCA9ICh0aW1lTmV4dCAtIHNlbGYuX3RpbWVTdGFydCkgLyAxMDAwLjA7XG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVudW0rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIGFwcE9iai51cGRhdGUoKTtcblxuICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG5cbn07XG5cblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChhcHBPYmopIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuaW5pdGlhbGl6ZShhcHBPYmopO1xuICAgIH0pO1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuX3VwZGF0ZUNhbnZhczNkU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzM2QsXG4gICAgICAgIHdpZHRoID0gdGhpcy5fd2luZG93V2lkdGgsXG4gICAgICAgIGhlaWdodCA9IHRoaXMuX3dpbmRvd0hlaWdodDtcblxuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0ID0gb2JqO1xufTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldEtleUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHRoaXMuX2tleUV2ZW50VGFyZ2V0ID0gb2JqO1xufTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgdGhpcy5faXNGdWxsV2luZG93RnJhbWUgPSBib29sO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEltcGxXZWI7XG5cbiIsIi8qKlxuICpcbiAqXG4gKiAgRiB8IE8gfCBBIHwgTVxuICpcbiAqXG4gKiBGb2FtIC0gQSBQbGFzay9XZWIgR0wgdG9vbGtpdFxuICpcbiAqIEZvYW0gaXMgYXZhaWxhYmxlIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuICBUaGUgZnVsbCB0ZXh0IG9mIHRoZVxuICogTUlUIGxpY2Vuc2UgaXMgaW5jbHVkZWQgYmVsb3cuXG4gKlxuICogTUlUIExpY2Vuc2VcbiAqID09PT09PT09PT09XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEzIEhlbnJ5ayBXb2xsaWsuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLypcbiAgICBNYXRoICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9mTWF0aCcpLFxuICAgIFZlYzIgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZWZWMyJyksXG4gICAgVmVjMyAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZlZlYzMnKSxcbiAgICBWZWM0ICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9mVmVjNCcpLFxuICAgIE1hdDMzICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZNYXQzMycpLFxuICAgIE1hdHJpeDQ0ICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZNYXQ0NCcpLFxuICAgIFF1YXRlcm5pb24gIDogcmVxdWlyZSgnLi9tYXRoL2ZRdWF0ZXJuaW9uJyksXG5cbiAgICBNYXRHTCAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2ZNYXRHTCcpLFxuICAgIFByb2dyYW0gICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZlByb2dyYW0nKSxcbiAgICBDYW1lcmEgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9mQ2FtZXJhQmFzaWMnKSxcblxuICAgIExpZ2h0ICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2xpZ2h0L2ZMaWdodCcpLFxuICAgIFBvaW50TGlnaHQgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2xpZ2h0L2ZQb2ludExpZ2h0JyksXG4gICAgRGlyZWN0aW9uYWxMaWdodCA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvbGlnaHQvZkRpcmVjdGlvbmFsTGlnaHQnKSxcbiAgICBTcG90TGlnaHQgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9saWdodC9mU3BvdExpZ2h0JyksXG5cbiAgICBNYXRlcmlhbCAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9mTWF0ZXJpYWwnKSxcbiAgICBUZXh0dXJlICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC90ZXh0dXJlL2ZUZXh0dXJlJyksXG4gICAgQ2FudmFzVGV4dHVyZSA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvdGV4dHVyZS9mQ2FudmFzVGV4dHVyZScpLFxuXG4gICAgZkdMVXRpbCAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2ZHTFV0aWwnKSxcbiAgICBHTCAgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9HTCcpLFxuXG4gICAgTW91c2UgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZk1vdXNlJyksXG4gICAgTW91c2VTdGF0ZSAgOiByZXF1aXJlKCcuL3V0aWwvZk1vdXNlU3RhdGUnKSxcbiAgICBDb2xvciAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9mQ29sb3InKSxcbiAgICBVdGlsICAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9mVXRpbCcpLFxuXG4gICAgUGxhdGZvcm0gICAgOiByZXF1aXJlKCcuL3N5c3RlbS9jb21tb24vZlBsYXRmb3JtJyksXG4gICAgU3lzdGVtICAgICAgOiByZXF1aXJlKCcuL3N5c3RlbS9mU3lzdGVtJyksXG5cbiAgICBGbGFncyA6IHJlcXVpcmUoJy4vc3lzdGVtL2ZGbGFncycpLFxuICAgICovXG4gICAgQXBwbGljYXRpb24gOiByZXF1aXJlKCcuL2FwcC9BcHAnKVxuXG59O1xuXG4iLCJ2YXIgVmVjMyA9IHJlcXVpcmUoJy4uL21hdGgvVmVjMycpLFxuICAgIE1hdHJpeDQ0ID0gcmVxdWlyZSgnLi4vbWF0aC9NYXRyaXg0NCcpLFxuICAgIE1hdEdMID0gcmVxdWlyZSgnLi9nbC9mTWF0R0wnKTtcblxuXG5mdW5jdGlvbiBDYW1lcmEoKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IFZlYzMuY3JlYXRlKCk7XG4gICAgdGhpcy5fdGFyZ2V0ID0gVmVjMy5jcmVhdGUoKTtcbiAgICB0aGlzLl91cCA9IFZlYzMuQVhJU19ZKCk7XG5cbiAgICB0aGlzLl9mb3YgPSAwO1xuICAgIHRoaXMuX25lYXIgPSAwO1xuICAgIHRoaXMuX2ZhciA9IDA7XG5cbiAgICB0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSAwO1xuXG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnByb2plY3Rpb25NYXRyaXggPSBNYXRyaXg0NC5jcmVhdGUoKTtcbiAgICB0aGlzLm1vZGVsVmlld01hdHJpeCA9IE1hdHJpeDQ0LmNyZWF0ZSgpO1xufVxuXG5DYW1lcmEucHJvdG90eXBlLnNldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKGZvdiwgd2luZG93QXNwZWN0UmF0aW8sIG5lYXIsIGZhcikge1xuICAgIHRoaXMuX2ZvdiA9IGZvdjtcbiAgICB0aGlzLl9uZWFyID0gbmVhcjtcbiAgICB0aGlzLl9mYXIgPSBmYXI7XG5cbiAgICB0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSB3aW5kb3dBc3BlY3RSYXRpbztcblxuICAgIHRoaXMudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xufTtcblxuXG5DYW1lcmEucHJvdG90eXBlLnNldFRhcmdldCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgVmVjMy5zZXQodGhpcy5fdGFyZ2V0LCB2KTtcbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuQ2FtZXJhLnByb3RvdHlwZS5zZXRUYXJnZXQzZiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgVmVjMy5zZXQzZih0aGlzLl90YXJnZXQsIHgsIHksIHopO1xuICAgIHRoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTtcbn07XG5DYW1lcmEucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHYpIHtcbiAgICBWZWMzLnNldCh0aGlzLnBvc2l0aW9uLCB2KTtcbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuQ2FtZXJhLnByb3RvdHlwZS5zZXRQb3NpdGlvbjNmID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBWZWMzLnNldDNmKHRoaXMucG9zaXRpb24sIHgsIHksIHopO1xuICAgIHRoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTtcbn07XG5DYW1lcmEucHJvdG90eXBlLnNldFVwID0gZnVuY3Rpb24gKHYpIHtcbiAgICBWZWMzLnNldCh0aGlzLl91cCwgdik7XG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcbkNhbWVyYS5wcm90b3R5cGUuc2V0VXAzZiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgVmVjMy5zZXQzZih0aGlzLl91cCwgeCwgeSwgeik7XG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcblxuQ2FtZXJhLnByb3RvdHlwZS5zZXROZWFyID0gZnVuY3Rpb24gKG5lYXIpIHtcbiAgICB0aGlzLl9uZWFyID0gbmVhcjtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcbkNhbWVyYS5wcm90b3R5cGUuc2V0RmFyID0gZnVuY3Rpb24gKGZhcikge1xuICAgIHRoaXMuX2ZhciA9IGZhcjtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcbkNhbWVyYS5wcm90b3R5cGUuc2V0Rm92ID0gZnVuY3Rpb24gKGZvdikge1xuICAgIHRoaXMuX2ZvdiA9IGZvdjtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcbkNhbWVyYS5wcm90b3R5cGUuc2V0QXNwZWN0UmF0aW8gPSBmdW5jdGlvbiAoYXNwZWN0UmF0aW8pIHtcbiAgICB0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSBhc3BlY3RSYXRpbztcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcblxuQ2FtZXJhLnByb3RvdHlwZS51cGRhdGVNb2RlbFZpZXdNYXRyaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQpcmV0dXJuO1xuICAgIE1hdEdMLmxvb2tBdCh0aGlzLm1vZGVsVmlld01hdHJpeCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5fdGFyZ2V0LCB0aGlzLl91cCk7XG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IHRydWU7XG59O1xuQ2FtZXJhLnByb3RvdHlwZS51cGRhdGVQcm9qZWN0aW9uTWF0cml4ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZClyZXR1cm47XG4gICAgTWF0R0wucGVyc3BlY3RpdmUodGhpcy5wcm9qZWN0aW9uTWF0cml4LCB0aGlzLl9mb3YsIHRoaXMuX2FzcGVjdFJhdGlvTGFzdCwgdGhpcy5fbmVhciwgdGhpcy5fZmFyKTtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IHRydWU7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLnVwZGF0ZU1hdHJpY2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudXBkYXRlTW9kZWxWaWV3TWF0cml4KCk7XG4gICAgdGhpcy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG59O1xuXG5DYW1lcmEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAne3Bvc2l0aW9uPSAnICsgVmVjMy50b1N0cmluZyh0aGlzLnBvc2l0aW9uKSArXG4gICAgICAgICcsIHRhcmdldD0gJyArIFZlYzMudG9TdHJpbmcodGhpcy5fdGFyZ2V0KSArXG4gICAgICAgICcsIHVwPSAnICsgVmVjMy50b1N0cmluZyh0aGlzLl91cCkgKyAnfSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhO1xuXG5cbiIsInZhciBXZWJHTCAgICA9IHJlcXVpcmUoXCIuL3dlYmdsXCIpLFxuICAgIE1hdHJpeDQ0ID0gcmVxdWlyZShcIi4uL21hdGgvTWF0cml4NDRcIik7XG52YXIgX0Vycm9yICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL0Vycm9yJyk7XG5cbnZhciBDYW1lcmEgPSByZXF1aXJlKCcuL0NhbWVyYScpO1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi4vdXRpbC9Mb2cnKS5hc3NlcnQ7XG5cbmZ1bmN0aW9uIEdMKGdsKXtcbiAgICBXZWJHTC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cblxuICAgIHRoaXMuX2NhbWVyYSA9IG51bGw7XG5cbiAgICAvL1xuICAgIC8vICBtYXRyaXggc3RhY2tcbiAgICAvL1xuXG4gICAgdGhpcy5fbWF0cml4TW9kZSA9IEdMLk1PREVMVklFVztcbiAgICB0aGlzLl9tYXRyaXhTdGFja01vZGVsVmlldyA9IFtdO1xuICAgIHRoaXMuX21hdHJpeFN0YWNrUHJvamVjdGlvbiA9IFtdO1xuICAgIHRoaXMuX21hdHJpeE1vZGVsVmlldyA9IE1hdHJpeDQ0LmNyZWF0ZSgpO1xuICAgIHRoaXMuX21hdHJpeFByb2plY3Rpb24gPSBNYXRyaXg0NC5jcmVhdGUoKTtcblxufVxuXG5HTC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFdlYkdMLnByb3RvdHlwZSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIE1vZGVsdmlldyAvIHByb2plY3Rpb24gbWF0cml4XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkdMLnByb3RvdHlwZS5zZXRNYXRyaWNlc0NhbWVyYSA9IGZ1bmN0aW9uKGNhbWVyYSl7XG4gICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xufTtcblxuR0wucHJvdG90eXBlLnNldE1hdHJpeE1vZGUgPSBmdW5jdGlvbihtb2RlKXtcbiAgICB0aGlzLl9tYXRyaXhNb2RlID0gbW9kZTtcbn07XG5cbkdMLnByb3RvdHlwZS5sb2FkSWRlbnRpdHkgPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMuX21hdHJpeE1vZGUgPT0gR0wuTU9ERUxWSUVXKXtcbiAgICAgICAgdGhpcy5fbWF0cml4TW9kZWxWaWV3ID0gTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbWF0cml4UHJvamVjdGlvbiA9IE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX2NhbWVyYS5wcm9qZWN0aW9uTWF0cml4KTtcbiAgICB9XG59O1xuXG5HTC5wcm90b3R5cGUucHVzaE1hdHJpeCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYodGhpcy5fbWF0cml4TW9kZSA9PSBHTC5NT0RFTFZJRVcpe1xuICAgICAgICB0aGlzLl9tYXRyaXhTdGFja01vZGVsVmlldy5wdXNoKE1hdHJpeDQ0LmNvcHkodGhpcy5fbWF0cml4TW9kZWxWaWV3KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbWF0cml4U3RhY2tQcm9qZWN0aW9uLnB1c2goTWF0cml4NDQuY29weSh0aGlzLl9tYXRyaXhQcm9qZWN0aW9uKSk7XG4gICAgfVxufTtcblxuR0wucHJvdG90eXBlLnBvcE1hdHJpeCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYodGhpcy5fbWF0cml4TW9kZSA9IEdMLk1PREVMVklFVyl7XG4gICAgICAgIGlmKHRoaXMuX21hdHJpeFN0YWNrTW9kZWxWaWV3Lmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfRXJyb3IuTUFUUklYX1NUQUNLX1BPUF9FUlJPUik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWF0cml4TW9kZWxWaWV3ID0gdGhpcy5fbWF0cml4U3RhY2tNb2RlbFZpZXcucG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRyaXhNb2RlbFZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fbWF0cml4U3RhY2tQcm9qZWN0aW9uLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfRXJyb3IuTUFUUklYX1NUQUNLX1BPUF9FUlJPUik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWF0cml4UHJvamVjdGlvbiA9IHRoaXMuX21hdHJpeFN0YWNrUHJvamVjdGlvbi5wb3AoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdHJpeFByb2plY3Rpb247XG4gICAgfVxufTtcblxuR0wucHJvdG90eXBlLnRyYW5zbGF0ZTNmID0gZnVuY3Rpb24oeCx5LHope1xuICAgIHRoaXMuX21hdHJpeE1vZGVsVmlldyA9IE1hdHJpeDQ0LmlkZW50aXR5KClcbn07XG5cbkdMLnByb3RvdHlwZS5yb3RhdGUzZiA9IGZ1bmN0aW9uKHgseSx6KXtcbn07XG5cblxuR0wucHJvdG90eXBlLnNjYWxlM2YgPSBmdW5jdGlvbih4LHkseil7fTtcblxuR0wucHJvdG90eXBlLm11bHRNYXRyaXggPSBmdW5jdGlvbihtYXRyaXgpe1xuICAgIGlmKHRoaXMuX21hdHJpeE1vZGUgPSBHTC5NT0RFTFZJRVcpe1xuXG4gICAgfVxufTtcblxuR0wucHJvdG90eXBlLmdldE1hdHJpeCA9IGZ1bmN0aW9uKG1hdCl7fTtcbkdMLnByb3RvdHlwZS5wdXNoTWF0cmljZXMgPSBmdW5jdGlvbigpe307XG5HTC5wcm90b3R5cGUucG9wTWF0cmljZXMgPSBmdW5jdGlvbigpe307XG5cblxuXG5cblxuXG5HTC5wcm90b3R5cGUuZ2V0TW9kZWxWaWV3TWF0cml4ID0gZnVuY3Rpb24obWF0KXt9O1xuR0wucHJvdG90eXBlLmdldFByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbihtYXQpe307XG5HTC5wcm90b3R5cGUuc2V0V2luZG93TWF0cmljZXMgPSBmdW5jdGlvbih3aW5kb3dXaWR0aCx3aW5kb3dIZWlnaHQsdG9wbGVmdCl7fTtcbkdMLnByb3RvdHlwZS5zZXRWaWV3cG9ydCA9IGZ1bmN0aW9uKHgwLHkwLHgxLHkxKXt9O1xuXG5cbkdMLnByb3RvdHlwZS5kcmF3TGluZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpe307XG5HTC5wcm90b3R5cGUuZHJhd0N1YmUgPSBmdW5jdGlvbihjZW50ZXIsIHNpemUpe307XG5HTC5wcm90b3R5cGUuZHJhd0N1YmVTdHJva2VkID0gZnVuY3Rpb24oY2VudGVyLHNpemUpe307XG5HTC5wcm90b3R5cGUuZHJhd1NwaGVyZSA9IGZ1bmN0aW9uKGNlbnRlciwgcmFkaXVzLCBudW1TZWdzKXt9O1xuR0wucHJvdG90eXBlLmRyYXdDaXJjbGUgPSBmdW5jdGlvbihjZW50ZXIscmFkaXVzLG51bVNlZ3Mpe307XG5HTC5wcm90b3R5cGUuZHJhd0NpcmNsZVN0cm9rZWQgPSBmdW5jdGlvbihjZW50ZXIscmFkaXVzLG51bVNlZ3Mpe307XG5HTC5wcm90b3R5cGUuZHJhd0VsbGlwc2UgPSBmdW5jdGlvbihjZW50ZXIscmFkaXVzWCxyYWRpdXNZLG51bVNlZ3Mpe307XG5HTC5wcm90b3R5cGUuZHJhd0VsbGlwc2VTdHJva2VkID0gZnVuY3Rpb24oY2VudGVyLHJhZGl1c1gscmFkaXVzWSxudW1TZWdzKXt9O1xuR0wucHJvdG90eXBlLmRyYXdSZWN0ID0gZnVuY3Rpb24ocmVjdCl7fTtcbkdMLnByb3RvdHlwZS5kcmF3UmVjdFN0cm9rZWQgPSBmdW5jdGlvbihyZWN0KXt9O1xuR0wucHJvdG90eXBlLmRyYXdSZWN0Um91bmRlZCA9IGZ1bmN0aW9uKHJlY3QscmFkaXVzQ29ybmVyLG51bVNlZ3NDb3JuZXIpe307XG5HTC5wcm90b3R5cGUuZHJhd1JlY3RSb3VuZGVkU3Ryb2tlZCAgPWZ1bmN0aW9uKHJlY3QscmFkaXVzQ29ybmVyLG51bVNlZ3NDb3JuZXIpe307XG5HTC5wcm90b3R5cGUuZHJhd1RyaWFuZ2xlID0gZnVuY3Rpb24odjAsdjEsdjIpe307XG5HTC5wcm90b3R5cGUuZHJhd1RyaWFuZ2xlU3Ryb2tlZCA9IGZ1bmN0aW9uKHYwLHYxLHYyKXt9O1xuXG5HTC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKG9iail7fTtcbkdMLnByb3RvdHlwZS5kcmF3UmFuZ2UgPSBmdW5jdGlvbihvYmosYmVnaW4sY291bnQpe307XG5cbkdMLnByb3RvdHlwZS5kcmF3UGl2b3QgPSBmdW5jdGlvbihsZW5ndGgpe307XG5HTC5wcm90b3R5cGUuZHJhd1ZlY3RvciA9IGZ1bmN0aW9uKHZlYyl7fTtcbkdMLnByb3RvdHlwZS5kcmF3RnJ1c3R1bSA9IGZ1bmN0aW9uKGNhbWVyYSl7fTtcblxuR0wucHJvdG90eXBlLmRyYXdBcnJheXNTYWZlID0gZnVuY3Rpb24oKXt9O1xuXG5HTC5wcm90b3R5cGUuZHJhd1N0cmluZyA9IGZ1bmN0aW9uKHN0cmluZyxwb3MsYWxpZ24pe307XG5cblxuR0wucHJvdG90eXBlLmNvbG9yNGYgPSBmdW5jdGlvbihyLGcsYixhKXt9O1xuXG5cbkdMLlVOSUZPUk1fTU9ERUxWSUVXX01BVFJJWCAgPSAndU1vZGVsVmlld01hdHJpeCc7XG5HTC5VTklGT1JNX1BST0pFQ1RJT05fTUFUUklYID0gJ3VQcm9qZWN0aW9uTWF0cml4JztcblxuR0wuTU9ERUxWSUVXICA9IDB4MUEwQTtcbkdMLlBST0pFQ1RJT04gPSAweDFBMEI7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdMOyIsInZhciBNYXQ0NCA9IHJlcXVpcmUoJy4uLy4uL21hdGgvTWF0cml4NDQnKTtcblxubW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIHBlcnNwZWN0aXZlIDogZnVuY3Rpb24obSxmb3YsYXNwZWN0LG5lYXIsZmFyKVxuICAgIHtcbiAgICAgICAgdmFyIGYgID0gMS4wIC8gTWF0aC50YW4oZm92KjAuNSksXG4gICAgICAgICAgICBuZiA9IDEuMCAvIChuZWFyLWZhcik7XG5cbiAgICAgICAgbVswXSA9IGYgLyBhc3BlY3Q7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gZjtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTFdID0gLTE7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9ICgyICogZmFyICogbmVhcikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAwO1xuXG4gICAgICAgIHJldHVybiBtO1xuXG4gICAgfSxcblxuICAgIGZydXN0dW0gOiBmdW5jdGlvbihtLGxlZnQscmlnaHQsYm90dG9tLHRvcCxuZWFyLGZhcilcbiAgICB7XG4gICAgICAgIHZhciBybCA9IDEgLyAocmlnaHQgLSBsZWZ0KSxcbiAgICAgICAgICAgIHRiID0gMSAvICh0b3AgLSBib3R0b20pLFxuICAgICAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuXG5cbiAgICAgICAgbVsgMF0gPSAobmVhciAqIDIpICogcmw7XG4gICAgICAgIG1bIDFdID0gMDtcbiAgICAgICAgbVsgMl0gPSAwO1xuICAgICAgICBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDRdID0gMDtcbiAgICAgICAgbVsgNV0gPSAobmVhciAqIDIpICogdGI7XG4gICAgICAgIG1bIDZdID0gMDtcbiAgICAgICAgbVsgN10gPSAwO1xuICAgICAgICBtWyA4XSA9IChyaWdodCArIGxlZnQpICogcmw7XG4gICAgICAgIG1bIDldID0gKHRvcCArIGJvdHRvbSkgKiB0YjtcbiAgICAgICAgbVsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAtMTtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gKGZhciAqIG5lYXIgKiAyKSAqIG5mO1xuICAgICAgICBtWzE1XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIGxvb2tBdCA6IGZ1bmN0aW9uKG0sZXllLHRhcmdldCx1cClcbiAgICB7XG4gICAgICAgIHZhciB4MCwgeDEsIHgyLCB5MCwgeTEsIHkyLCB6MCwgejEsIHoyLCBsZW4sXG4gICAgICAgICAgICBleWV4ID0gZXllWzBdLFxuICAgICAgICAgICAgZXlleSA9IGV5ZVsxXSxcbiAgICAgICAgICAgIGV5ZXogPSBleWVbMl0sXG4gICAgICAgICAgICB1cHggPSB1cFswXSxcbiAgICAgICAgICAgIHVweSA9IHVwWzFdLFxuICAgICAgICAgICAgdXB6ID0gdXBbMl0sXG4gICAgICAgICAgICB0YXJnZXR4ID0gdGFyZ2V0WzBdLFxuICAgICAgICAgICAgdGFydGV0eSA9IHRhcmdldFsxXSxcbiAgICAgICAgICAgIHRhcmdldHogPSB0YXJnZXRbMl07XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKGV5ZXggLSB0YXJnZXR4KSA8IDAuMDAwMDAxICYmXG4gICAgICAgICAgICBNYXRoLmFicyhleWV5IC0gdGFydGV0eSkgPCAwLjAwMDAwMSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoZXlleiAtIHRhcmdldHopIDwgMC4wMDAwMDEpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRyaXg0NC5pZGVudGl0eShtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHowID0gZXlleCAtIHRhcmdldHg7XG4gICAgICAgIHoxID0gZXlleSAtIHRhcnRldHk7XG4gICAgICAgIHoyID0gZXlleiAtIHRhcmdldHo7XG5cbiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xuICAgICAgICB6MCAqPSBsZW47XG4gICAgICAgIHoxICo9IGxlbjtcbiAgICAgICAgejIgKj0gbGVuO1xuXG4gICAgICAgIHgwID0gdXB5ICogejIgLSB1cHogKiB6MTtcbiAgICAgICAgeDEgPSB1cHogKiB6MCAtIHVweCAqIHoyO1xuICAgICAgICB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG5cbiAgICAgICAgbGVuID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XG4gICAgICAgIGxlbiA9ICFsZW4gPyAwIDogMS9sZW47XG5cbiAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgIHgyICo9IGxlbjtcblxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuICAgICAgICBsZW4gPSAhbGVuID8gMCA6IDEvbGVuO1xuXG4gICAgICAgIHkwICo9IGxlbjtcbiAgICAgICAgeTEgKj0gbGVuO1xuICAgICAgICB5MiAqPSBsZW47XG5cblxuICAgICAgICBtWyAwXSA9IHgwO1xuICAgICAgICBtWyAxXSA9IHkwO1xuICAgICAgICBtWyAyXSA9IHowO1xuICAgICAgICBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDRdID0geDE7XG4gICAgICAgIG1bIDVdID0geTE7XG4gICAgICAgIG1bIDZdID0gejE7XG4gICAgICAgIG1bIDddID0gMDtcbiAgICAgICAgbVsgOF0gPSB4MjtcbiAgICAgICAgbVsgOV0gPSB5MjtcbiAgICAgICAgbVsxMF0gPSB6MjtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KTtcbiAgICAgICAgbVsxM10gPSAtKHkwICogZXlleCArIHkxICogZXlleSArIHkyICogZXlleik7XG4gICAgICAgIG1bMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxufTsiLCJmdW5jdGlvbiBXZWJHTChnbCl7XG4gICAgdGhpcy5fZ2wgPSBnbDtcbn1cblxuV2ViR0wucHJvdG90eXBlLmdldENvbnRleHRBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdldENvbnRleHRBdHRyaWJ1dGVzKCk7XG59O1xuLyoqXG4gQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmlzQ29udGV4dExvc3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuaXNDb250ZXh0TG9zdCgpO1xufTtcbi8qKlxuIEByZXR1cm4ge0FycmF5W1N0cmluZ31cbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldFN1cHBvcnRlZEV4dGVuc2lvbnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0U3VwcG9ydGVkRXh0ZW5zaW9ucygpO1xufTtcbi8qKlxuIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gQHJldHVybiB7Kn1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldEV4dGVuc2lvbiA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0RXh0ZW5zaW9uKG5hbWUpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0ZXh0dXJlXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmFjdGl2ZVRleHR1cmUgPSBmdW5jdGlvbih0ZXh0dXJlKSB7XG4gICAgdGhpcy5fZ2wuYWN0aXZlVGV4dHVyZSh0ZXh0dXJlKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMUHJvZ3JhbX0gcHJvZ3JhbVxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5hdHRhY2hTaGFkZXIgPSBmdW5jdGlvbihwcm9ncmFtLHNoYWRlcikge1xuICAgIHRoaXMuX2dsLmF0dGFjaFNoYWRlcihwcm9ncmFtLHNoYWRlcik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5iaW5kQXR0cmliTG9jYXRpb24gPSBmdW5jdGlvbihwcm9ncmFtLGluZGV4LG5hbWUpIHtcbiAgICB0aGlzLl9nbC5iaW5kQXR0cmliTG9jYXRpb24ocHJvZ3JhbSxpbmRleCxuYW1lKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtXZWJHTEJ1ZmZlcn0gYnVmZmVyXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmJpbmRCdWZmZXIgPSBmdW5jdGlvbih0YXJnZXQsYnVmZmVyKSB7XG4gICAgdGhpcy5fZ2wuYmluZEJ1ZmZlcih0YXJnZXQsYnVmZmVyKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtXZWJHTEZyYW1lYnVmZmVyfSBmcmFtZWJ1ZmZlclxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5iaW5kRnJhbWVidWZmZXIgPSBmdW5jdGlvbih0YXJnZXQsZnJhbWVidWZmZXIpIHtcbiAgICB0aGlzLl9nbC5iaW5kRnJhbWVidWZmZXIodGFyZ2V0LGZyYW1lYnVmZmVyKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtXZWJHTFJlbmRlcmJ1ZmZlcn0gcmVuZGVyYnVmZmVyXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmJpbmRSZW5kZXJidWZmZXIgPSBmdW5jdGlvbih0YXJnZXQscmVuZGVyYnVmZmVyKSB7XG4gICAgdGhpcy5fZ2wuYmluZFJlbmRlcmJ1ZmZlcih0YXJnZXQscmVuZGVyYnVmZmVyKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtXZWJHTFRleHR1cmV9IHRleHR1cmVcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuYmluZFRleHR1cmUgPSBmdW5jdGlvbih0YXJnZXQsdGV4dHVyZSkge1xuICAgIHRoaXMuX2dsLmJpbmRUZXh0dXJlKHRhcmdldCx0ZXh0dXJlKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gcmVkXG4gQHBhcmFtIHtOdW1iZXJ9IGdyZWVuXG4gQHBhcmFtIHtOdW1iZXJ9IGJsdWVcbiBAcGFyYW0ge051bWJlcn0gYWxwaGFcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuYmxlbmRDb2xvciA9IGZ1bmN0aW9uKHJlZCxncmVlbixibHVlLGFscGhhKSB7XG4gICAgdGhpcy5fZ2wuYmxlbmRDb2xvcihyZWQsZ3JlZW4sYmx1ZSxhbHBoYSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IG1vZGVcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuYmxlbmRFcXVhdGlvbiA9IGZ1bmN0aW9uKG1vZGUpIHtcbiAgICB0aGlzLl9nbC5ibGVuZEVxdWF0aW9uKG1vZGUpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBtb2RlUkdCXG4gQHBhcmFtIHtOdW1iZXJ9IG1vZGVBbHBoYVxuICovXG5XZWJHTC5wcm90b3R5cGUuYmxlbmRFcXVhdGlvblNlcGFyYXRlID0gZnVuY3Rpb24obW9kZVJHQixtb2RlQWxwaGEpIHtcbiAgICB0aGlzLl9nbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUobW9kZVJHQixtb2RlQWxwaGEpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBzZmFjdG9yXG4gQHBhcmFtIHtOdW1iZXJ9IGRmYWN0b3JcbiAqL1xuV2ViR0wucHJvdG90eXBlLmJsZW5kRnVuYyA9IGZ1bmN0aW9uKHNmYWN0b3IsZGZhY3Rvcikge1xuICAgIHRoaXMuX2dsLmJsZW5kRnVuYyhzZmFjdG9yLGRmYWN0b3IpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBzcmNSR0JcbiBAcGFyYW0ge051bWJlcn0gZHN0UkdCXG4gQHBhcmFtIHtOdW1iZXJ9IHNyY0FscGhhXG4gQHBhcmFtIHtOdW1iZXJ9IGRzdEFscGhhXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmJsZW5kRnVuY1NlcGFyYXRlID0gZnVuY3Rpb24oc3JjUkdCLGRzdFJHQixzcmNBbHBoYSxkc3RBbHBoYSkge1xuICAgIHRoaXMuX2dsLmJsZW5kRnVuY1NlcGFyYXRlKHNyY1JHQixkc3RSR0Isc3JjQWxwaGEsZHN0QWxwaGEpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gc2l6ZVxuIEBwYXJhbSB7TnVtYmVyfSB1c2FnZVxuICovXG5XZWJHTC5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKHRhcmdldCxzaXplLHVzYWdlKSB7XG4gICAgdGhpcy5fZ2wuYnVmZmVyRGF0YSh0YXJnZXQsc2l6ZSx1c2FnZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHRhcmdldFxuIEBwYXJhbSB7QXJyYXlCdWZmZXJWaWV3fSBkYXRhXG4gQHBhcmFtIHtOdW1iZXJ9IHVzYWdlXG4gKi9cbldlYkdMLnByb3RvdHlwZS5idWZmZXJEYXRhID0gZnVuY3Rpb24odGFyZ2V0LGRhdGEsdXNhZ2UpIHtcbiAgICB0aGlzLl9nbC5idWZmZXJEYXRhKHRhcmdldCxkYXRhLHVzYWdlKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtBcnJheUJ1ZmZlcn0gZGF0YVxuIEBwYXJhbSB7TnVtYmVyfSB1c2FnZVxuICovXG5XZWJHTC5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKHRhcmdldCxkYXRhLHVzYWdlKSB7XG4gICAgdGhpcy5fZ2wuYnVmZmVyRGF0YSh0YWdldCxkYXRhLHVzYWdlKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxuIEBwYXJhbSB7QXJyYXlCdWZmZXJWaWV3fSBkYXRhXG4gKi9cbldlYkdMLnByb3RvdHlwZS5idWZmZXJTdWJEYXRhID0gZnVuY3Rpb24odGFyZ2V0LG9mZnNldCxkYXRhKSB7XG4gICAgdGhpcy5fZ2wuYnVmZmVyU3ViRGF0YSh0YXJnZXQsb2Zmc2V0LGRhdGEpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0XG4gQHBhcmFtIHtBcnJheUJ1ZmZlcn0gZGF0YVxuICovXG5XZWJHTC5wcm90b3R5cGUuYnVmZmVyU3ViRGF0YSA9IGZ1bmN0aW9uKHRhcmdldCxvZmZzZXQsZGF0YSkge1xuICAgIHRoaXMuX2dsLmJ1ZmZlclN1YkRhdGEodGFyZ2V0LG9mZnNldCxkYXRhKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHJldHVybiB7TnVtYmVyfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLl9nbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKHRhcmdldCk7XG59O1xuLyoqXG4gQHBhcmFtIHtHTGJpdGZpZWxkfSBtYXNrXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24obWFzaykge1xuICAgIHRoaXMuX2dsLmNsZWFyKG1hc2spO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSByZWRcbiBAcGFyYW0ge051bWJlcn0gZ3JlZW5cbiBAcGFyYW0ge051bWJlcn0gYmx1ZVxuIEBwYXJhbSB7TnVtYmVyfSBhbHBoYVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5jbGVhckNvbG9yID0gZnVuY3Rpb24ocmVkLGdyZWVuLGJsdWUsYWxwaGEpIHtcbiAgICB0aGlzLl9nbC5jbGVhckNvbG9yKHJlZCxncmVlbixibHVlLGFscGhhKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gZGVwdGhcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY2xlYXJEZXB0aCA9IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgdGhpcy5fZ2wuY2xlYXJEZXB0aChkZXB0aCk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHNcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY2xlYXJTdGVuY2lsID0gZnVuY3Rpb24ocykge1xuICAgIHRoaXMuX2dsLmNsZWFyU3RlbmNpbChzKTtcbn07XG4vKipcbiBAcGFyYW0ge2Jvb2xlYW59IHJlZFxuIEBwYXJhbSB7Ym9vbGVhbn0gZ3JlZW5cbiBAcGFyYW0ge2Jvb2xlYW59IGJsdWVcbiBAcGFyYW0ge2Jvb2xlYW59IGFscGhhXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmNvbG9yTWFzayA9IGZ1bmN0aW9uKHJlZCxncmVlbixibHVlLGFscGhhKSB7XG4gICAgdGhpcy5fZ2wuY29sb3JNYXNrKHJlZCxncmVlbixibHVlLGFscGhhKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBbc2hhZGVyXVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5jb21waWxlU2hhZGVyID0gZnVuY3Rpb24oc2hhZGVyKSB7XG4gICAgdGhpcy5fZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gbGV2ZWxcbiBAcGFyYW0ge051bWJlcn0gaW50ZXJuYWxmb3JtYXRcbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuIEBwYXJhbSB7TnVtYmVyfSBib3JkZXJcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY29weVRleEltYWdlMkQgPSBmdW5jdGlvbih0YXJnZXQsbGV2ZWwsaW50ZXJuYWxmb3JtYXQseCx5LHdpZHRoLGhlaWdodCxib3JkZXIpIHtcbiAgICB0aGlzLl9nbC5jb3B5VGV4SW1hZ2UyRCh0YXJnZXQsbGV2ZWwsaW50ZXJuYWxmb3JtYXQseCx5LHdpZHRoLGhlaWdodCxib3JkZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gbGV2ZWxcbiBAcGFyYW0ge051bWJlcn0geG9mZnNldFxuIEBwYXJhbSB7TnVtYmVyfSB5b2Zmc2V0XG4gQHBhcmFtIHtOdW1iZXJ9IHhcbiBAcGFyYW0ge051bWJlcn0geVxuIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY29weVRleFN1YkltYWdlMkQgPSBmdW5jdGlvbih0YXJnZXQsbGV2ZWwseG9mZnNldCx5b2Zmc2V0LHgseSx3aWR0aCxoZWlnaHQpIHtcbiAgICB0aGlzLl9nbC5jb3B5VGV4U3ViSW1hZ2UyRCh0YXJnZXQsbGV2ZWwseG9mZnNldCx5b2Zmc2V0LHgseSx3aWR0aCxoZWlnaHQpO1xufTtcbi8qKlxuIEByZXR1cm4ge1dlYkdMQnVmZmVyfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY3JlYXRlQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmNyZWF0ZUJ1ZmZlcigpO1xufTtcbi8qKlxuIEByZXR1cm4ge1dlYkdMRnJhbWVidWZmZXJ9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5jcmVhdGVGcmFtZWJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9nbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xufTtcbi8qKlxuIEByZXR1cm4ge1dlYkdMUHJvZ3JhbX1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmNyZWF0ZVByb2dyYW0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuY3JlYXRlUHJvZ3JhbSgpO1xufTtcbi8qKlxuIEByZXR1cm4ge1dlYkdMUmVuZGVyYnVmZmVyfVxuICovXG5XZWJHTC5wcm90b3R5cGUuY3JlYXRlUmVuZGVyYnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gQHJldHVybiB7V2ViR0xTaGFkZXJ9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5jcmVhdGVTaGFkZXIgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbn07XG4vKipcbiBAcmV0dXJuIHtXZWJHTFRleHR1cmV9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5jcmVhdGVUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmNyZWF0ZVRleHR1cmUoKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gbW9kZVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5jdWxsRmFjZSA9IGZ1bmN0aW9uKG1vZGUpIHtcbiAgICB0aGlzLl9nbC5jdWxsRmFjZShtb2RlKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMQnVmZmVyfSBidWZmZXJcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZGVsZXRlQnVmZmVyID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgdGhpcy5fZ2wuZGVsZXRlQnVmZmVyKGJ1ZmZlcik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFJlbmRlcmJ1ZmZlcn0gZnJhbWVidWZmZXJcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZGVsZXRlRnJhbWVidWZmZXIgPSBmdW5jdGlvbihmcmFtZWJ1ZmZlcikge1xuICAgIHRoaXMuX2dsLmRlbGV0ZUZyYW1lYnVmZmVyKGZyYW1lYnVmZmVyKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMUHJvZ3JhbX0gcHJvZ3JhbVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5kZWxldGVQcm9ncmFtID0gZnVuY3Rpb24ocHJvZ3JhbSkge1xuICAgIHRoaXMuX2dsLmRlbGV0ZUZyYW1lYnVmZmVyKHByb2dyYW0pO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xSZW5kZXJidWZmZXJ9IHJlbmRlcmJ1ZmZlclxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5kZWxldGVSZW5kZXJidWZmZXIgPSBmdW5jdGlvbihyZW5kZXJidWZmZXIpIHtcbiAgICB0aGlzLl9nbC5kZWxldGVSZW5kZXJidWZmZXIocmVuZGVyYnVmZmVyKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBzaGFkZXJcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZGVsZXRlU2hhZGVyID0gZnVuY3Rpb24oc2hhZGVyKSB7XG4gICAgdGhpcy5fZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFRleHR1cmV9IHRleHR1cmVcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZGVsZXRlVGV4dHVyZSA9IGZ1bmN0aW9uKHRleHR1cmUpIHtcbiAgICB0aGlzLl9nbC5kZWxldGVUZXh0dXJlKHRleHR1cmUpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBmdW5jXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmRlcHRoRnVuYyA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB0aGlzLl9nbC5kZXB0aEZ1bmMoZnVuYyk7XG59O1xuLyoqXG4gQHBhcmFtIHtib29sZWFufSBmbGFnXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmRlcHRoTWFzayA9IGZ1bmN0aW9uKGZsYWcpIHtcbiAgICB0aGlzLl9nbC5kZXB0aE1hc2soZmxhZyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHpOZWFyXG4gQHBhcmFtIHtOdW1iZXJ9IHpGYXJcbiAqL1xuV2ViR0wucHJvdG90eXBlLmRlcHRoUmFuZ2UgPSBmdW5jdGlvbih6TmVhcix6RmFyKSB7XG4gICAgdGhpcy5fZ2wuZGVwdGhSYW5nZSh6TmVhcix6RmFyKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMUHJvZ3JhbX0gcHJvZ3JhbVxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuICovXG5XZWJHTC5wcm90b3R5cGUuZGV0YWNoU2hhZGVyID0gZnVuY3Rpb24ocHJvZ3JhbSxzaGFkZXIpIHtcbiAgICB0aGlzLl9nbC5kZXRhY2hTaGFkZXIocHJvZ3JhbSxzaGFkZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBjYXBcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKGNhcCkge1xuICAgIHRoaXMuX2dsLmRpc2FibGUoY2FwKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICB0aGlzLl9nbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaW5kZXgpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBtb2RlXG4gQHBhcmFtIHtOdW1iZXJ9IGZpcnN0XG4gQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gKi9cbldlYkdMLnByb3RvdHlwZS5kcmF3QXJyYXlzID0gZnVuY3Rpb24obW9kZSxmaXJzdCxjb3VudCkge1xuICAgIHRoaXMuX2dsLmRyYXdBcnJheXMobW9kZSxmaXJzdCxjb3VudCk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IG1vZGVcbiBAcGFyYW0ge051bWJlcn0gY291bnRcbiBAcGFyYW0ge051bWJlcn0gdHlwZVxuIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZHJhd0VsZW1lbnRzID0gZnVuY3Rpb24obW9kZSxjb3VudCx0eXBlLG9mZnNldCkge1xuICAgIHRoaXMuX2dsLmRyYXdFbGVtZW50cyhtb2RlLGNvdW50LHR5cGUsb2Zmc2V0KTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gY2FwXG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKGNhcCkge1xuICAgIHRoaXMuX2dsLmVuYWJsZShjYXApO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5fZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaW5kZXgpO1xufTtcbi8qKlxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9nbC5maW5pc2goKTtcbn07XG4vKipcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9nbC5mbHVzaCgpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gYXR0YWNobWVudFxuIEBwYXJhbSB7TnVtYmVyfSByZW5kZXJidWZmZXJ0YXJnZXRcbiBAcGFyYW0ge1dlYkdMUmVuZGVyYnVmZmVyfSByZW5kZXJidWZmZXJcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIgPSBmdW5jdGlvbih0YXJnZXQsYXR0YWNobWVudCxyZW5kZXJidWZmZXJ0YXJnZXQscmVuZGVyYnVmZmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKHRhcmdldCxhdHRhY2htZW50LHJlbmRlcmJ1ZmZlcnRhcmdldCxyZW5kZXJidWZmZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gYXR0YWNobWVudFxuIEBwYXJhbSB7TnVtYmVyfSB0ZXh0YXJnZXRcbiBAcGFyYW0ge1dlYkdMVGV4dHVyZX0gdGV4dHVyZVxuIEBwYXJhbSB7TnVtYmVyfSBsZXZlbFxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5mcmFtZWJ1ZmZlclRleHR1cmUyRCA9IGZ1bmN0aW9uKHRhcmdldCxhdHRhY2htZW50LHRleHRhcmdldCx0ZXh0dXJlLGxldmVsKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKHRhcmdldCxhdHRhY2htZW50LHRleHRhcmdldCx0ZXh0dXJlLGxldmVsKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gbW9kZVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5mcm9udEZhY2UgPSBmdW5jdGlvbihtb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmZyb250RmFjZShtb2RlKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHJldHVybiB7dm9pZH1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmdlbmVyYXRlTWlwbWFwID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdlbmVyYXRlTWlwbWFwKHRhcmdldCk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldEFjdGl2ZUF0dHJpYiA9IGZ1bmN0aW9uKHByb2dyYW0saW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0QWN0aXZlQXR0cmliKHByb2dyYW0saW5kZXgpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xQcm9ncmFtfSBwcm9ncmFtXG4gQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKi9cbldlYkdMLnByb3RvdHlwZS5nZXRBY3RpdmVVbmlmb3JtID0gZnVuY3Rpb24ocHJvZ3JhbSxpbmRleCkge1xuICAgIHJldHVybiB0aGlzLl9nbC5nZXRBY3RpdmVVbmlmb3JtKHByb2dyYW0saW5kZXgpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xQcm9ncmFtfSBwcm9ncmFtXG4gQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldEF0dHJpYkxvY2F0aW9uID0gZnVuY3Rpb24ocHJvZ3JhbSxuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sbmFtZSlcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gcG5hbWVcbiBAcmV0dXJuIHsqfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZ2V0UGFyYW1ldGVyID0gZnVuY3Rpb24ocG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0UGFyYW1ldGVyKHBuYW1lKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IHBuYW1lXG4gKi9cbldlYkdMLnByb3RvdHlwZS5nZXRCdWZmZXJQYXJhbWV0ZXIgPSBmdW5jdGlvbih0YXJnZXQscG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0QnVmZmVyUGFyYW1ldGVyKHRhcmdldCxwbmFtZSk7XG59O1xuLyoqXG4gQHJldHVybiB7TnVtYmVyfVxuICovXG5XZWJHTC5wcm90b3R5cGUuZ2V0RXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0RXJyb3IoKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IGF0dGFjaG1lbnRcbiBAcGFyYW0ge051bWJlcn0gcG5hbWVcbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldEZyYW1lYnVmZmVyQXR0YWNobWVudFBhcmFtZXRlciA9IGZ1bmN0aW9uKHRhcmdldCxhdHRhY2htZW50LHBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdldEZyYW1lYnVmZmVyQXR0YWNobWVudFBhcmFtZXRlcih0YXJnZXQsYXR0YWNobWVudCxwbmFtZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcGFyYW0ge051bWJlcn0gcG5hbWVcbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldFByb2dyYW1QYXJhbWV0ZXIgPSBmdW5jdGlvbihwcm9ncmFtLHBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSxwbmFtZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5nZXRQcm9ncmFtSW5mb0xvZyA9IGZ1bmN0aW9uKHByb2dyYW0pIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHRhcmdldFxuIEBwYXJhbSB7TnVtYmVyfSBwbmFtZVxuICovXG5XZWJHTC5wcm90b3R5cGUuZ2V0UmVuZGVyYnVmZmVyUGFyYW1ldGVyID0gZnVuY3Rpb24odGFyZ2V0LHBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdldFJlbmRlcmJ1ZmZlclBhcmFtZXRlcih0YXJnZXQscG5hbWUpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuIEBwYXJhbSB7TnVtYmVyfSBwbmFtZVxuICovXG5XZWJHTC5wcm90b3R5cGUuZ2V0U2hhZGVyUGFyYW1ldGVyID0gZnVuY3Rpb24oc2hhZGVyLHBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIscG5hbWUpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldFNoYWRlckluZm9Mb2cgPSBmdW5jdGlvbihzaGFkZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuV2ViR0wucHJvdG90eXBlLmdldFNoYWRlclNvdXJjZSA9IGZ1bmN0aW9uKHNoYWRlcikge1xuICAgIHJldHVybiB0aGlzLl9nbC5nZXRTaGFkZXJTb3VyY2Uoc2hhZGVyKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IHBuYW1lXG4gKi9cbldlYkdMLnByb3RvdHlwZS5nZXRUZXhQYXJhbWV0ZXIgPSBmdW5jdGlvbih0YXJnZXQscG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0VGV4UGFyYW1ldGVyKHRhcmdldCxwbmFtZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuICovXG5XZWJHTC5wcm90b3R5cGUuZ2V0VW5pZm9ybSA9IGZ1bmN0aW9uKHByb2dyYW0sbG9jYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0VW5pZm9ybShwcm9ncmFtLGxvY2F0aW9uKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMUHJvZ3JhbX0gcHJvZ3JhbVxuIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKi9cbldlYkdMLnByb3RvdHlwZS5nZXRVbmlmb3JtTG9jYXRpb24gPSBmdW5jdGlvbihwcm9ncmFtLG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sbmFtZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gQHBhcmFtIHtOdW1iZXJ9IHBuYW1lXG4gKi9cbldlYkdMLnByb3RvdHlwZS5nZXRWZXJ0ZXhBdHRyaWIgPSBmdW5jdGlvbihpbmRleCxwbmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9nbC5nZXRWZXJ0ZXhBdHRyaWIoaW5kZXgscG5hbWUpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuIEBwYXJhbSB7TnVtYmVyfSBwbmFtZVxuICovXG5XZWJHTC5wcm90b3R5cGUuZ2V0VmVydGV4QXR0cmliT2Zmc2V0ID0gZnVuY3Rpb24oaW5kZXgscG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuZ2V0VmVydGV4QXR0cmliT2Zmc2V0KGluZGV4LHBuYW1lKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IG1vZGVcbiAqL1xuV2ViR0wucHJvdG90eXBlLmhpbnQgPSBmdW5jdGlvbih0YXJnZXQsbW9kZSkge1xuICAgIHRoaXMuX2dsLmhpbnQodGFyZ2V0LG1vZGUpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xCdWZmZXJ9IGJ1ZmZlclxuIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbldlYkdMLnByb3RvdHlwZS5pc0J1ZmZlciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLl9nbC5pc0J1ZmZlcihidWZmZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBjYXBcbiBAcmV0dXJuIHtib29sZWFufVxuICovXG5XZWJHTC5wcm90b3R5cGUuaXNFbmFibGVkID0gZnVuY3Rpb24oY2FwKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmlzRW5hYmxlZChjYXApO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXJcbiBAcmV0dXJuIHtib29sZWFufVxuICovXG5XZWJHTC5wcm90b3R5cGUuaXNGcmFtZWJ1ZmZlciA9IGZ1bmN0aW9uKGZyYW1lYnVmZmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dsLmlzRnJhbWVidWZmZXIoZnJhbWVidWZmZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xQcm9ncmFtfSBwcm9ncmFtXG4gQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmlzUHJvZ3JhbSA9IGZ1bmN0aW9uKHByb2dyYW0pIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuaXNQcm9ncmFtKHByb2dyYW0pO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xSZW5kZXJidWZmZXJ9IHJlbmRlcmJ1ZmZlclxuIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbldlYkdMLnByb3RvdHlwZS5pc1JlbmRlcmJ1ZmZlciA9IGZ1bmN0aW9uKHJlbmRlcmJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLl9nbC5pc1JlbmRlcmJ1ZmZlcihyZW5kZXJidWZmZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbldlYkdMLnByb3RvdHlwZS5pc1NoYWRlciA9IGZ1bmN0aW9uKHNoYWRlcikge1xuICAgIHJldHVybiB0aGlzLl9nbC5pc1NoYWRlcihzaGFkZXIpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlXG4gQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuV2ViR0wucHJvdG90eXBlLmlzVGV4dHVyZSA9IGZ1bmN0aW9uKHRleHR1cmUpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2wuaXNUZXh0dXJlKHRleHR1cmUpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS5saW5lV2lkdGggPSBmdW5jdGlvbih3aWR0aCkge1xuICAgIHRoaXMuX2dsLmxpbmVXaWR0aCh3aWR0aCk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUubGlua1Byb2dyYW0gPSBmdW5jdGlvbihwcm9ncmFtKSB7XG4gICAgdGhpcy5fZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHBuYW1lXG4gQHBhcmFtIHtOdW1iZXJ9IHBhcmFtXG4gKi9cbldlYkdMLnByb3RvdHlwZS5waXhlbFN0b3JlaSA9IGZ1bmN0aW9uKHBuYW1lLHBhcmFtKSB7XG4gICAgdGhpcy5fZ2wucGl4ZWxTdG9yZWkocG5hbWUscGFyYW0pO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBmYWN0b3JcbiBAcGFyYW0ge051bWJlcn0gdW5pdHNcbiAqL1xuV2ViR0wucHJvdG90eXBlLnBvbHlnb25PZmZzZXQgPSBmdW5jdGlvbihmYWN0b3IsdW5pdHMpIHtcbiAgICB0aGlzLl9nbC5wb2x5Z29uT2Zmc2V0KGZhY3Rvcix1bml0cyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHhcbiBAcGFyYW0ge051bWJlcn0geVxuIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiBAcGFyYW0ge051bWJlcn0gZm9ybWF0XG4gQHBhcmFtIHtOdW1iZXJ9IHR5cGVcbiBAcGFyYW0ge0FycmF5QnVmZmVyVmlld30gcGl4ZWxzXG4gKi9cbldlYkdMLnByb3RvdHlwZS5yZWFkUGl4ZWxzID0gZnVuY3Rpb24oeCx5LHdpZHRoLGhlaWdodCxmb3JtYXQsdHlwZSxwaXhlbHMpIHtcbiAgICB0aGlzLl9nbC5yZWFkUGl4ZWxzKHgseSx3aWR0aCxoZWlnaHQsZm9ybWF0LHR5cGUscGl4ZWxzKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IGludGVybmFsZm9ybWF0XG4gQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICovXG5XZWJHTC5wcm90b3R5cGUucmVuZGVyYnVmZmVyU3RvcmFnZSA9IGZ1bmN0aW9uKHRhcmdldCxpbnRlcm5hbGZvcm1hdCx3aWR0aCxoZWlnaHQpIHtcbiAgICB0aGlzLl9nbC5yZW5kZXJidWZmZXJTdG9yYWdlKHRhcmdldCxpbnRlcm5hbGZvcm1hdCx3aWR0aCxoZWlnaHQpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBbdmFsdWVdXG4gQHBhcmFtIHtib29sZWFufSBpbnZlcnRcbiAqL1xuV2ViR0wucHJvdG90eXBlLnNhbXBsZUNvdmVyYWdlID0gZnVuY3Rpb24odmFsdWUsaW52ZXJ0KSB7XG4gICAgdGhpcy5fZ2wuc2FtcGxlQ292ZXJhZ2UodmFsdWUsaW52ZXJ0KTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICovXG5XZWJHTC5wcm90b3R5cGUuc2Npc3NvciA9IGZ1bmN0aW9uKHgseSx3aWR0aCxoZWlnaHQpIHtcbiAgICB0aGlzLl9nbC5zY2lzc29yKHgseSx3aWR0aCxoZWlnaHQpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHNoYWRlclxuIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VcbiAqL1xuV2ViR0wucHJvdG90eXBlLnNoYWRlclNvdXJjZSA9IGZ1bmN0aW9uKHNoYWRlcixzb3VyY2UpIHtcbiAgICB0aGlzLl9nbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLHNvdXJjZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGZ1bmNcbiBAcGFyYW0ge051bWJlcn0gcmVmXG4gQHBhcmFtIHtOdW1iZXJ9IG1hc2tcbiAqL1xuV2ViR0wucHJvdG90eXBlLnN0ZW5jaWxGdW5jID0gZnVuY3Rpb24oZnVuYyxyZWYsbWFzaykge1xuICAgIHRoaXMuX2dsLnN0ZW5jaWxGdW5jKGZ1bmMscmVmLG1hc2spO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBmYWNlXG4gQHBhcmFtIHtOdW1iZXJ9IGZ1bmNcbiBAcGFyYW0ge051bWJlcn0gcmVmXG4gQHBhcmFtIHtOdW1iZXJ9IG1hc2tcbiAqL1xuV2ViR0wucHJvdG90eXBlLnN0ZW5jaWxGdW5jU2VwYXJhdGUgPSBmdW5jdGlvbihmYWNlLGZ1bmMscmVmLG1hc2spIHtcbiAgICB0aGlzLl9nbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGZhY2UsZnVuYyxyZWYsbWFzayk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IG1hc2tcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUuc3RlbmNpbE1hc2sgPSBmdW5jdGlvbihtYXNrKSB7XG4gICAgdGhpcy5fZ2wuc3RlbmNpbE1hc2sobWFzayk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGZhY2VcbiBAcGFyYW0ge051bWJlcn0gbWFza1xuICovXG5XZWJHTC5wcm90b3R5cGUuc3RlbmNpbE1hc2tTZXBhcmF0ZSA9IGZ1bmN0aW9uKGZhY2UsbWFzaykge1xuICAgIHRoaXMuX2dsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZmFjZSxtYXNrKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gZmFpbFxuIEBwYXJhbSB7TnVtYmVyfSB6ZmFpbFxuIEBwYXJhbSB7TnVtYmVyfSB6cGFzc1xuICovXG5XZWJHTC5wcm90b3R5cGUuc3RlbmNpbE9wID0gZnVuY3Rpb24oZmFpbCx6ZmFpbCx6cGFzcykge1xuICAgIHRoaXMuX2dsLnN0ZW5jaWxPcChmYWlsLHpmYWlsLHpwYXNzKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gZmFjZVxuIEBwYXJhbSB7TnVtYmVyfSBmYWlsXG4gQHBhcmFtIHtOdW1iZXJ9IHpmYWlsXG4gQHBhcmFtIHtOdW1iZXJ9IHpwYXNzXG4gKi9cbldlYkdMLnByb3RvdHlwZS5zdGVuY2lsT3BTZXBhcmF0ZSA9IGZ1bmN0aW9uKGZhY2UsZmFpbCx6ZmFpbCx6cGFzcykge1xuICAgIHRoaXMuX2dsLnN0ZW5jaWxPcFNlcGFyYXRlKGZhY2UsZmFpbCx6ZmFpbCx6cGFzcyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHRhcmdldFxuIEBwYXJhbSB7TnVtYmVyfSBsZXZlbFxuIEBwYXJhbSB7TnVtYmVyfSBpbnRlcm5hbGZvcm1hdFxuIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiBAcGFyYW0ge051bWJlcn0gYm9yZGVyXG4gQHBhcmFtIHtOdW1iZXJ9IGZvcm1hdFxuIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gQHBhcmFtIHtBcnJheUJ1ZmZlclZpZXd9IHBpeGVsc1xuICovXG5XZWJHTC5wcm90b3R5cGUudGV4SW1hZ2UyRCA9IGZ1bmN0aW9uKHRhcmdldCxsZXZlbCxpbnRlcm5hbGZvcm1hdCx3aWR0aCxoZWlnaHQsYm9yZGVyLGZvcm1hdCx0eXBlLHBpeGVscykge1xuICAgIHRoaXMuX2dsLnRleEltYWdlMkQodGFyZ2V0LGxldmVsLGludGVybmFsZm9ybWF0LHdpZHRoLGhlaWdodCxib3JkZXIsZm9ybWF0LHR5cGUscGl4ZWxzKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IGxldmVsXG4gQHBhcmFtIHtOdW1iZXJ9IGludGVybmFsZm9ybWF0XG4gQHBhcmFtIHtOdW1iZXJ9IGZvcm1hdFxuIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gQHBhcmFtIHtJbWFnZURhdGF8SFRNTEltYWdlRWxlbWVudHxIVE1MQ2FudmFzRWxlbWVudHxIVE1MVmlkZW9FbGVtZW50fSBwaXhlbHNJbWFnZUNhbnZhc09yVmlkZW9cbiAqL1xuV2ViR0wucHJvdG90eXBlLnRleEltYWdlMkQgPSBmdW5jdGlvbih0YXJnZXQsbGV2ZWwsaW50ZXJuYWxmb3JtYXQsZm9ybWF0LHR5cGUscGl4ZWxzSW1hZ2VDYW52YXNPclZpZGVvKSB7XG4gICAgdGhpcy5fZ2wudGV4SW1hZ2UyRCh0YXJnZXQsbGV2ZWwsaW50ZXJuYWxmb3JtYXQsZm9ybWF0LHR5cGUscGl4ZWxzSW1hZ2VDYW52YXNPclZpZGVvKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IHBuYW1lXG4gQHBhcmFtIHtOdW1iZXJ9IHBhcmFtXG4gKi9cbldlYkdMLnByb3RvdHlwZS50ZXhQYXJhbWV0ZXJmID0gZnVuY3Rpb24odGFyZ2V0LHBuYW1lLHBhcmFtKSB7XG4gICAgdGhpcy5fZ2wudGV4UGFyYW1ldGVyZih0YXJnZXQscG5hbWUscGFyYW0pO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSB0YXJnZXRcbiBAcGFyYW0ge051bWJlcn0gcG5hbWVcbiBAcGFyYW0ge051bWJlcn0gcGFyYW1cbiAqL1xuV2ViR0wucHJvdG90eXBlLnRleFBhcmFtZXRlcmkgPSBmdW5jdGlvbih0YXJnZXQscG5hbWUscGFyYW0pIHtcbiAgICB0aGlzLl9nbC50ZXhQYXJhbWV0ZXJpKHRhcmdldCxwbmFtZSxwYXJhbSk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHRhcmdldFxuIEBwYXJhbSB7TnVtYmVyfSBsZXZlbFxuIEBwYXJhbSB7TnVtYmVyfSB4b2Zmc2V0XG4gQHBhcmFtIHtOdW1iZXJ9IHlvZmZzZXRcbiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gQHBhcmFtIHtOdW1iZXJ9IGZvcm1hdFxuIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gQHBhcmFtIHtBcnJheUJ1ZmZlclZpZXd9IHBpeGVsc1xuICovXG5XZWJHTC5wcm90b3R5cGUudGV4U3ViSW1hZ2UyRCA9IGZ1bmN0aW9uKHRhcmdldCxsZXZlbCx4b2Zmc2V0LHlvZmZzZXQsd2lkdGgsaGVpZ2h0LGZvcm1hdCx0eXBlLHBpeGVscykge1xuICAgIHRoaXMuX2dsLnRleFN1YkltYWdlMkQodGFyZ2V0LGxldmVsLHhvZmZzZXQseW9mZnNldCx3aWR0aCxoZWlnaHQsZm9ybWF0LHR5cGUscGl4ZWxzKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0XG4gQHBhcmFtIHtOdW1iZXJ9IGxldmVsXG4gQHBhcmFtIHtOdW1iZXJ9IHhvZmZzZXRcbiBAcGFyYW0ge051bWJlcn0geW9mZnNldFxuIEBwYXJhbSB7TnVtYmVyfSBmb3JtYXRcbiBAcGFyYW0ge051bWJlcn0gdHlwZVxuIEBwYXJhbSB7SW1hZ2VEYXRhfEhUTUxJbWFnZUVsZW1lbnR8SFRNTENhbnZhc0VsZW1lbnR8SFRNTFZpZGVvRWxlbWVudH0gcGl4ZWxzSW1hZ2VDYW52YXNPclZpZGVvXG4gKi9cbldlYkdMLnByb3RvdHlwZS50ZXhTdWJJbWFnZTJEID0gZnVuY3Rpb24odGFyZ2V0LGxldmVsLHhvZmZzZXQseW9mZnNldCxmb3JtYXQsdHlwZSxwaXhlbHNJbWFnZUNhbnZhc09yVmlkZW8pIHtcbiAgICB0aGlzLl9nbC50ZXhTdWJJbWFnZTJEKHRhcmdldCxsZXZlbCx4b2Zmc2V0LHlvZmZzZXQsZm9ybWF0LHR5cGUscGl4ZWxzSW1hZ2VDYW52YXNPclZpZGVvKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7TnVtYmVyfSB4XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMWYgPSBmdW5jdGlvbihsb2NhdGlvbix4KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTFmKGxvY2F0aW9uLHgpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtGbG9hdDMyQXJyYXl9IHZcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm0xZnYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTFmdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7QXJyYXlbTnVtYmVyfSBbdl1cbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm0xZnYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTFmdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7TnVtYmVyfSB4XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMWkgPSBmdW5jdGlvbihsb2NhdGlvbix4KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTFpKGxvY2F0aW9uLHgpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtJbnQzMkFycmF5fSB2XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMWl2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIHRoaXMuX2dsLnVuaWZvcm0xaXYobG9jYXRpb24sdik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge0FycmF5W051bWJlcn0gW3ZdXG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMWl2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIHRoaXMuX2dsLnVuaWZvcm0xaXYobG9jYXRpb24sdik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMmYgPSBmdW5jdGlvbihsb2NhdGlvbix4LHkpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtMmYobG9jYXRpb24seCx5KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7RmxvYXQzMkFycmF5fSB2XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMmZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIHRoaXMuX2dsLnVuaWZvcm0yZnYobG9jYXRpb24sdik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge0FycmF5W051bWJlcn0gW3ZdXG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMmZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIHRoaXMuX2dsLnVuaWZvcm0yZnYobG9jYXRpb24sdik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtMmkgPSBmdW5jdGlvbihsb2NhdGlvbix4LHkpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtMmkobG9jYXRpb24seCx5KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7SW50MzJBcnJheX0gdlxuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybTJpdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHYpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtMml2KGxvY2F0aW9uLHYpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtBcnJheVtOdW1iZXJ9IHZcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm0yaXYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTJpdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7TnVtYmVyfSB4XG4gQHBhcmFtIHtOdW1iZXJ9IHlcbiBAcGFyYW0ge051bWJlcn0gelxuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybTNmID0gZnVuY3Rpb24obG9jYXRpb24seCx5LHopIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtM2YobG9jYXRpb24seCx5LHopO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtGbG9hdDMyQXJyYXl9IHZcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm0zZnYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTNmdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7QXJyYXlbTnVtYmVyfSB2XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtM2Z2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIHRoaXMuX2dsLnVuaWZvcm0zZnYobG9jYXRpb24sdik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gQHBhcmFtIHtOdW1iZXJ9IHpcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm0zaSA9IGZ1bmN0aW9uKGxvY2F0aW9uLHgseSx6KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTNpKGxvY2F0aW9uLHgseSx6KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7SW50MzJBcnJheX0gdlxuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybTNpdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHYpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtM2l2KGxvY2F0aW9uLHYpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtBcnJheVtOdW1iZXJ9IHZcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm0zaXYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTNpdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7TnVtYmVyfSB4XG4gQHBhcmFtIHtOdW1iZXJ9IHlcbiBAcGFyYW0ge051bWJlcn0gelxuIEBwYXJhbSB7TnVtYmVyfSB3XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtNGYgPSBmdW5jdGlvbihsb2NhdGlvbix4LHkseix3KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTRmKGxvY2F0aW9uLHgseSx6LHcpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtGbG9hdDMyQXJyYXl9IHZcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm00ZnYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTRmdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7QXJyYXlbTnVtYmVyfSB2XG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtNGZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIHRoaXMuX2dsLnVuaWZvcm00ZnYobG9jYXRpb24sdik7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gQHBhcmFtIHtOdW1iZXJ9IHpcbiBAcGFyYW0ge051bWJlcn0gd1xuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybTRpID0gZnVuY3Rpb24obG9jYXRpb24seCx5LHosdykge1xuICAgIHRoaXMuX2dsLnVuaWZvcm00Zihsb2NhdGlvbix4LHkseix3KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7SW50MzJBcnJheX0gdlxuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybTRpdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHYpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtNGl2KGxvY2F0aW9uLHYpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtBcnJheVtOdW1iZXJ9IHZcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm00aXYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybTRpdihsb2NhdGlvbix2KTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7Ym9vbGVhbn0gdHJhbnNwb3NlXG4gQHBhcmFtIHtGbG9hdDMyQXJyYXl9IHZhbHVlXG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtTWF0cml4MmZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdHJhbnNwb3NlLHZhbHVlKSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybU1hdHJpeDJmdihsb2NhdGlvbix0cmFuc3Bvc2UsdmFsdWUpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtib29sZWFufSB0cmFuc3Bvc2VcbiBAcGFyYW0ge0FycmF5W051bWJlcn0gdmFsdWVcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm1NYXRyaXgyZnYgPSBmdW5jdGlvbihsb2NhdGlvbix0cmFuc3Bvc2UsdmFsdWUpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtTWF0cml4MmZ2KGxvY2F0aW9uLHRyYW5zcG9zZSx2YWx1ZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge2Jvb2xlYW59IHRyYW5zcG9zZVxuIEBwYXJhbSB7RmxvYXQzMkFycmF5fSB2YWx1ZVxuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybU1hdHJpeDNmdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHRyYW5zcG9zZSx2YWx1ZSkge1xuICAgIHRoaXMuX2dsLnVuaWZvcm1NYXRyaXgzZnYobG9jYXRpb24sdHJhbnNwb3NlLHZhbHVlKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMVW5pZm9ybUxvY2F0aW9ufSBsb2NhdGlvblxuIEBwYXJhbSB7Ym9vbGVhbn0gdHJhbnNwb3NlXG4gQHBhcmFtIHtBcnJheVtOdW1iZXJ9IHZhbHVlXG4gKi9cbldlYkdMLnByb3RvdHlwZS51bmlmb3JtTWF0cml4M2Z2ID0gZnVuY3Rpb24obG9jYXRpb24sdHJhbnNwb3NlLHZhbHVlKSB7XG4gICAgdGhpcy5fZ2wudW5pZm9ybU1hdHJpeDNmdihsb2NhdGlvbix0cmFuc3Bvc2UsdmFsdWUpO1xufTtcbi8qKlxuIEBwYXJhbSB7V2ViR0xVbmlmb3JtTG9jYXRpb259IGxvY2F0aW9uXG4gQHBhcmFtIHtib29sZWFufSB0cmFuc3Bvc2VcbiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gdmFsdWVcbiAqL1xuV2ViR0wucHJvdG90eXBlLnVuaWZvcm1NYXRyaXg0ZnYgPSBmdW5jdGlvbihsb2NhdGlvbix0cmFuc3Bvc2UsdmFsdWUpIHtcbiAgICB0aGlzLl9nbC51bmlmb3JtTWF0cml4NGZ2KGxvY2F0aW9uLHRyYW5zcG9zZSx2YWx1ZSk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gbG9jYXRpb25cbiBAcGFyYW0ge2Jvb2xlYW59IHRyYW5zcG9zZVxuIEBwYXJhbSB7QXJyYXlbTnVtYmVyfSB2YWx1ZVxuICovXG5XZWJHTC5wcm90b3R5cGUudW5pZm9ybU1hdHJpeDRmdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHRyYW5zcG9zZSx2YWx1ZSkge1xuICAgIHRoaXMuX2dsLnVuaWZvcm1NYXRyaXg0ZnYobG9jYXRpb24sdHJhbnNwb3NlLHZhbHVlKTtcbn07XG4vKipcbiBAcGFyYW0ge1dlYkdMUHJvZ3JhbX0gcHJvZ3JhbVxuIEByZXR1cm4ge3ZvaWR9XG4gKi9cbldlYkdMLnByb3RvdHlwZS51c2VQcm9ncmFtID0gZnVuY3Rpb24ocHJvZ3JhbSkge1xuICAgIHRoaXMuX2dsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG59O1xuLyoqXG4gQHBhcmFtIHtXZWJHTFByb2dyYW19IHByb2dyYW1cbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUudmFsaWRhdGVQcm9ncmFtID0gZnVuY3Rpb24ocHJvZ3JhbSkge1xuICAgIHRoaXMuX2dsLnZhbGlkYXRlUHJvZ3JhbShwcm9ncmFtKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gaW5keFxuIEBwYXJhbSB7TnVtYmVyfSB4XG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWIxZiA9IGZ1bmN0aW9uKGluZHgseCkge1xuICAgIHRoaXMuX2dsLnZlcnRleEF0dHJpYjFmKGluZHgseCk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZHhcbiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gdmFsdWVzXG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWIxZnYgPSBmdW5jdGlvbihpbmR4LHZhbHVlcykge1xuICAgIHRoaXMuX2dsLnZlcnRleEF0dHJpYjFmdihpbmR4LHZhbHVlcyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZHhcbiBAcGFyYW0ge0FycmF5W051bWJlcn0gdmFsdWVzXG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWIxZnYgPSBmdW5jdGlvbihpbmR4LHZhbHVlcykge1xuICAgIHRoaXMuX2dsLnZlcnRleEF0dHJpYjFmdihpbmR4LHZhbHVlcyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZHhcbiBAcGFyYW0ge051bWJlcn0geFxuIEBwYXJhbSB7TnVtYmVyfSB5XG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWIyZiA9IGZ1bmN0aW9uKGluZHgseCx5KSB7XG4gICAgdGhpcy5fZ2wudmVydGV4QXR0cmliMmYoaW5keCx4LHkpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBpbmR4XG4gQHBhcmFtIHtGbG9hdDMyQXJyYXl9IHZhbHVlc1xuICovXG5XZWJHTC5wcm90b3R5cGUudmVydGV4QXR0cmliMmZ2ID0gZnVuY3Rpb24oaW5keCx2YWx1ZXMpIHtcbiAgICB0aGlzLl9nbC52ZXJ0ZXhBdHRyaWIyZnYoaW5keCx2YWx1ZXMpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBpbmR4XG4gQHBhcmFtIHtBcnJheVtOdW1iZXJ9IHZhbHVlc1xuICovXG5XZWJHTC5wcm90b3R5cGUudmVydGV4QXR0cmliMmZ2ID0gZnVuY3Rpb24oaW5keCx2YWx1ZXMpIHtcbiAgICB0aGlzLl9nbC52ZXJ0ZXhBdHRyaWIyZnYoaW5keCx2YWx1ZXMpO1xufTtcbi8qKlxuIEBwYXJhbSB7TnVtYmVyfSBpbmR4XG4gQHBhcmFtIHtOdW1iZXJ9IHhcbiBAcGFyYW0ge051bWJlcn0geVxuIEBwYXJhbSB7TnVtYmVyfSB6XG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWIzZiA9IGZ1bmN0aW9uKGluZHgseCx5LHopIHtcbiAgICB0aGlzLl9nbC52ZXJ0ZXhBdHRyaWIzZihpbmR4LHgseSx6KTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gaW5keFxuIEBwYXJhbSB7RmxvYXQzMkFycmF5fSB2YWx1ZXNcbiAqL1xuV2ViR0wucHJvdG90eXBlLnZlcnRleEF0dHJpYjNmdiA9IGZ1bmN0aW9uKGluZHgsdmFsdWVzKSB7XG4gICAgdGhpcy5fZ2wudmVydGV4QXR0cmliM2Z2KGluZHgsdmFsdWVzKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gaW5keFxuIEBwYXJhbSB7QXJyYXlbTnVtYmVyfSB2YWx1ZXNcbiAqL1xuV2ViR0wucHJvdG90eXBlLnZlcnRleEF0dHJpYjNmdiA9IGZ1bmN0aW9uKGluZHgsdmFsdWVzKSB7XG4gICAgdGhpcy5fZ2wudmVydGV4QXR0cmliM2Z2KGluZHgsdmFsdWVzKTtcbn07XG4vKipcbiBAcGFyYW0ge051bWJlcn0gaW5keFxuIEBwYXJhbSB7TnVtYmVyfSB4XG4gQHBhcmFtIHtOdW1iZXJ9IHlcbiBAcGFyYW0ge051bWJlcn0gelxuIEBwYXJhbSB7TnVtYmVyfSB3XG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWI0ZiA9IGZ1bmN0aW9uKGluZHgseCx5LHosdykge1xuICAgIHRoaXMuX2dsLnZlcnRleEF0dHJpYjRmKGluZHgseCx5LHosdyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZHhcbiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gdmFsdWVzXG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWI0ZnYgPSBmdW5jdGlvbihpbmR4LHZhbHVlcykge1xuICAgIHRoaXMuX2dsLnZlcnRleEF0dHJpYjRmdihpbmR4LHZhbHVlcyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZHhcbiBAcGFyYW0ge0FycmF5W051bWJlcn0gdmFsdWVzXG4gKi9cbldlYkdMLnByb3RvdHlwZS52ZXJ0ZXhBdHRyaWI0ZnYgPSBmdW5jdGlvbihpbmR4LHZhbHVlcykge1xuICAgIHRoaXMuX2dsLnZlcnRleEF0dHJpYjRmdihpbmR4LHZhbHVlcyk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IGluZHhcbiBAcGFyYW0ge051bWJlcn0gc2l6ZVxuIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gQHBhcmFtIHtib29sZWFufSBub3JtYWxpemVkXG4gQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZVxuIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRcbiAqL1xuV2ViR0wucHJvdG90eXBlLnZlcnRleEF0dHJpYlBvaW50ZXIgPSBmdW5jdGlvbihpbmR4LHNpemUsdHlwZSxub3JtYWxpemVkLHN0cmlkZSxvZmZzZXQpIHtcbiAgICB0aGlzLl9nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGluZHgsc2l6ZSx0eXBlLG5vcm1hbGl6ZWQsc3RyaWRlLG9mZnNldCk7XG59O1xuLyoqXG4gQHBhcmFtIHtOdW1iZXJ9IHhcbiBAcGFyYW0ge051bWJlcn0geVxuIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiBAcmV0dXJuIHt2b2lkfVxuICovXG5XZWJHTC5wcm90b3R5cGUudmlld3BvcnQgPSBmdW5jdGlvbih4LHksd2lkdGgsaGVpZ2h0KSB7XG4gICAgdGhpcy5fZ2wudmlld3BvcnQoeCx5LHdpZHRoLGhlaWdodCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYkdMOyIsIlxuLy9mb3Igbm9kZSBkZWJ1Z1xudmFyIE1hdDMzID1cbntcbiAgICBtYWtlIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMCwwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwxLDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAsMV0pO1xuICAgIH0sXG5cbiAgICB0cmFuc3Bvc2UgOiBmdW5jdGlvbihvdXQsYSlcbiAgICB7XG5cbiAgICAgICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICAgICAgdmFyIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMiA9IGFbNV07XG4gICAgICAgICAgICBvdXRbMV0gPSBhWzNdO1xuICAgICAgICAgICAgb3V0WzJdID0gYVs2XTtcbiAgICAgICAgICAgIG91dFszXSA9IGEwMTtcbiAgICAgICAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICAgICAgICBvdXRbNl0gPSBhMDI7XG4gICAgICAgICAgICBvdXRbN10gPSBhMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgICAgICBvdXRbM10gPSBhWzFdO1xuICAgICAgICAgICAgb3V0WzRdID0gYVs0XTtcbiAgICAgICAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICAgICAgICBvdXRbNl0gPSBhWzJdO1xuICAgICAgICAgICAgb3V0WzddID0gYVs1XTtcbiAgICAgICAgICAgIG91dFs4XSA9IGFbOF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXQzMzsiLCJ2YXIgZk1hdGggPSByZXF1aXJlKCcuL2ZNYXRoJyksXG4gICAgTWF0MzMgPSByZXF1aXJlKCcuL01hdHJpeDMzJyk7XG5cbi8vZm9yIG5vZGUgZGVidWdcbnZhciBNYXRyaXg0NCA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgMSwgMCwgMCwgMCxcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbiAobTAsIG0xKSB7XG4gICAgICAgIG0wWyAwXSA9IG0xWyAwXTtcbiAgICAgICAgbTBbIDFdID0gbTFbIDFdO1xuICAgICAgICBtMFsgMl0gPSBtMVsgMl07XG4gICAgICAgIG0wWyAzXSA9IG0xWyAzXTtcblxuICAgICAgICBtMFsgNF0gPSBtMVsgNF07XG4gICAgICAgIG0wWyA1XSA9IG0xWyA1XTtcbiAgICAgICAgbTBbIDZdID0gbTFbIDZdO1xuICAgICAgICBtMFsgN10gPSBtMVsgN107XG5cbiAgICAgICAgbTBbIDhdID0gbTFbIDhdO1xuICAgICAgICBtMFsgOV0gPSBtMVsgOV07XG4gICAgICAgIG0wWzEwXSA9IG0xWzEwXTtcbiAgICAgICAgbTBbMTFdID0gbTFbMTFdO1xuXG4gICAgICAgIG0wWzEyXSA9IG0xWzEyXTtcbiAgICAgICAgbTBbMTNdID0gbTFbMTNdO1xuICAgICAgICBtMFsxNF0gPSBtMVsxNF07XG4gICAgICAgIG0wWzE1XSA9IG0xWzE1XTtcblxuXG4gICAgICAgIHJldHVybiBtMDtcbiAgICB9LFxuXG4gICAgaWRlbnRpdHk6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIG1bIDBdID0gMTtcbiAgICAgICAgbVsgMV0gPSBtWyAyXSA9IG1bIDNdID0gMDtcbiAgICAgICAgbVsgNV0gPSAxO1xuICAgICAgICBtWyA0XSA9IG1bIDZdID0gbVsgN10gPSAwO1xuICAgICAgICBtWzEwXSA9IDE7XG4gICAgICAgIG1bIDhdID0gbVsgOV0gPSBtWzExXSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgbVsxMl0gPSBtWzEzXSA9IG1bMTRdID0gMDtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgY29weTogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkobSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVNjYWxlOiBmdW5jdGlvbiAoc3gsIHN5LCBzeiwgbSkge1xuICAgICAgICBtID0gbSB8fCB0aGlzLmNyZWF0ZSgpO1xuXG4gICAgICAgIG1bMF0gPSBzeDtcbiAgICAgICAgbVs1XSA9IHN5O1xuICAgICAgICBtWzEwXSA9IHN6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVUcmFuc2xhdGlvbjogZnVuY3Rpb24gKHR4LCB0eSwgdHosIG0pIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5jcmVhdGUoKTtcblxuICAgICAgICBtWzEyXSA9IHR4O1xuICAgICAgICBtWzEzXSA9IHR5O1xuICAgICAgICBtWzE0XSA9IHR6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVSb3RhdGlvblg6IGZ1bmN0aW9uIChhLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVs1XSA9IGNvcztcbiAgICAgICAgbVs2XSA9IC1zaW47XG4gICAgICAgIG1bOV0gPSBzaW47XG4gICAgICAgIG1bMTBdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVSb3RhdGlvblk6IGZ1bmN0aW9uIChhLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVswXSA9IGNvcztcbiAgICAgICAgbVsyXSA9IHNpbjtcbiAgICAgICAgbVs4XSA9IC1zaW47XG4gICAgICAgIG1bMTBdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVSb3RhdGlvblo6IGZ1bmN0aW9uIChhLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVswXSA9IGNvcztcbiAgICAgICAgbVsxXSA9IHNpbjtcbiAgICAgICAgbVs0XSA9IC1zaW47XG4gICAgICAgIG1bNV0gPSBjb3M7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIGNyZWF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoYXgsIGF5LCBheiwgbSkge1xuICAgICAgICBtID0gbSB8fCB0aGlzLmNyZWF0ZSgpO1xuXG4gICAgICAgIHZhciBjb3N4ID0gTWF0aC5jb3MoYXgpLFxuICAgICAgICAgICAgc2lueCA9IE1hdGguc2luKGF4KSxcbiAgICAgICAgICAgIGNvc3kgPSBNYXRoLmNvcyhheSksXG4gICAgICAgICAgICBzaW55ID0gTWF0aC5zaW4oYXkpLFxuICAgICAgICAgICAgY29zeiA9IE1hdGguY29zKGF6KSxcbiAgICAgICAgICAgIHNpbnogPSBNYXRoLnNpbihheik7XG5cbiAgICAgICAgbVsgMF0gPSBjb3N5ICogY29zejtcbiAgICAgICAgbVsgMV0gPSAtY29zeCAqIHNpbnogKyBzaW54ICogc2lueSAqIGNvc3o7XG4gICAgICAgIG1bIDJdID0gc2lueCAqIHNpbnogKyBjb3N4ICogc2lueSAqIGNvc3o7XG5cbiAgICAgICAgbVsgNF0gPSBjb3N5ICogc2luejtcbiAgICAgICAgbVsgNV0gPSBjb3N4ICogY29zeiArIHNpbnggKiBzaW55ICogc2luejtcbiAgICAgICAgbVsgNl0gPSAtc2lueCAqIGNvc3ogKyBjb3N4ICogc2lueSAqIHNpbno7XG5cbiAgICAgICAgbVsgOF0gPSAtc2lueTtcbiAgICAgICAgbVsgOV0gPSBzaW54ICogY29zeTtcbiAgICAgICAgbVsxMF0gPSBjb3N4ICogY29zeTtcblxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICAvL3RlbXAgZnJvbSBnbE1hdHJpeFxuICAgIGNyZWF0ZVJvdGF0aW9uT25BeGlzOiBmdW5jdGlvbiAocm90LCB4LCB5LCB6LCBvdXQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuXG4gICAgICAgIGlmIChNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSA8IGZNYXRoLkVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGMsIHQsXG4gICAgICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgICAgICBhMTAsIGExMSwgYTEyLCBhMTMsXG4gICAgICAgICAgICBhMjAsIGEyMSwgYTIyLCBhMjMsXG4gICAgICAgICAgICBiMDAsIGIwMSwgYjAyLFxuICAgICAgICAgICAgYjEwLCBiMTEsIGIxMixcbiAgICAgICAgICAgIGIyMCwgYjIxLCBiMjI7XG5cblxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB4ICo9IGxlbjtcbiAgICAgICAgeSAqPSBsZW47XG4gICAgICAgIHogKj0gbGVuO1xuXG4gICAgICAgIHMgPSBNYXRoLnNpbihyb3QpO1xuICAgICAgICBjID0gTWF0aC5jb3Mocm90KTtcbiAgICAgICAgdCA9IDEgLSBjO1xuXG4gICAgICAgIG91dCA9IG91dCB8fCBNYXRyaXg0NC5jcmVhdGUoKTtcblxuICAgICAgICBhMDAgPSAxO1xuICAgICAgICBhMDEgPSAwO1xuICAgICAgICBhMDIgPSAwO1xuICAgICAgICBhMDMgPSAwO1xuICAgICAgICBhMTAgPSAwO1xuICAgICAgICBhMTEgPSAxO1xuICAgICAgICBhMTIgPSAwO1xuICAgICAgICBhMTMgPSAwO1xuICAgICAgICBhMjAgPSAwO1xuICAgICAgICBhMjEgPSAwO1xuICAgICAgICBhMjIgPSAxO1xuICAgICAgICBhMjMgPSAwO1xuXG4gICAgICAgIGIwMCA9IHggKiB4ICogdCArIGM7XG4gICAgICAgIGIwMSA9IHkgKiB4ICogdCArIHogKiBzO1xuICAgICAgICBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICAgICAgYjEwID0geCAqIHkgKiB0IC0geiAqIHM7XG4gICAgICAgIGIxMSA9IHkgKiB5ICogdCArIGM7XG4gICAgICAgIGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgICAgICBiMjAgPSB4ICogeiAqIHQgKyB5ICogcztcbiAgICAgICAgYjIxID0geSAqIHogKiB0IC0geCAqIHM7XG4gICAgICAgIGIyMiA9IHogKiB6ICogdCArIGM7XG5cbiAgICAgICAgb3V0WzAgXSA9IGEwMCAqIGIwMCArIGExMCAqIGIwMSArIGEyMCAqIGIwMjtcbiAgICAgICAgb3V0WzEgXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICAgICAgb3V0WzIgXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICAgICAgb3V0WzMgXSA9IGEwMyAqIGIwMCArIGExMyAqIGIwMSArIGEyMyAqIGIwMjtcbiAgICAgICAgb3V0WzQgXSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMjtcbiAgICAgICAgb3V0WzUgXSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICAgICAgb3V0WzYgXSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcbiAgICAgICAgb3V0WzcgXSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMjtcbiAgICAgICAgb3V0WzggXSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcbiAgICAgICAgb3V0WzkgXSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcbiAgICAgICAgb3V0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICAgICAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICBtdWx0UHJlOiBmdW5jdGlvbiAobTAsIG0xLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIG0wMDAgPSBtMFsgMF0sIG0wMDEgPSBtMFsgMV0sIG0wMDIgPSBtMFsgMl0sIG0wMDMgPSBtMFsgM10sXG4gICAgICAgICAgICBtMDA0ID0gbTBbIDRdLCBtMDA1ID0gbTBbIDVdLCBtMDA2ID0gbTBbIDZdLCBtMDA3ID0gbTBbIDddLFxuICAgICAgICAgICAgbTAwOCA9IG0wWyA4XSwgbTAwOSA9IG0wWyA5XSwgbTAxMCA9IG0wWzEwXSwgbTAxMSA9IG0wWzExXSxcbiAgICAgICAgICAgIG0wMTIgPSBtMFsxMl0sIG0wMTMgPSBtMFsxM10sIG0wMTQgPSBtMFsxNF0sIG0wMTUgPSBtMFsxNV07XG5cbiAgICAgICAgdmFyIG0xMDAgPSBtMVsgMF0sIG0xMDEgPSBtMVsgMV0sIG0xMDIgPSBtMVsgMl0sIG0xMDMgPSBtMVsgM10sXG4gICAgICAgICAgICBtMTA0ID0gbTFbIDRdLCBtMTA1ID0gbTFbIDVdLCBtMTA2ID0gbTFbIDZdLCBtMTA3ID0gbTFbIDddLFxuICAgICAgICAgICAgbTEwOCA9IG0xWyA4XSwgbTEwOSA9IG0xWyA5XSwgbTExMCA9IG0xWzEwXSwgbTExMSA9IG0xWzExXSxcbiAgICAgICAgICAgIG0xMTIgPSBtMVsxMl0sIG0xMTMgPSBtMVsxM10sIG0xMTQgPSBtMVsxNF0sIG0xMTUgPSBtMVsxNV07XG5cbiAgICAgICAgbVsgMF0gPSBtMDAwICogbTEwMCArIG0wMDEgKiBtMTA0ICsgbTAwMiAqIG0xMDggKyBtMDAzICogbTExMjtcbiAgICAgICAgbVsgMV0gPSBtMDAwICogbTEwMSArIG0wMDEgKiBtMTA1ICsgbTAwMiAqIG0xMDkgKyBtMDAzICogbTExMztcbiAgICAgICAgbVsgMl0gPSBtMDAwICogbTEwMiArIG0wMDEgKiBtMTA2ICsgbTAwMiAqIG0xMTAgKyBtMDAzICogbTExNDtcbiAgICAgICAgbVsgM10gPSBtMDAwICogbTEwMyArIG0wMDEgKiBtMTA3ICsgbTAwMiAqIG0xMTEgKyBtMDAzICogbTExNTtcblxuICAgICAgICBtWyA0XSA9IG0wMDQgKiBtMTAwICsgbTAwNSAqIG0xMDQgKyBtMDA2ICogbTEwOCArIG0wMDcgKiBtMTEyO1xuICAgICAgICBtWyA1XSA9IG0wMDQgKiBtMTAxICsgbTAwNSAqIG0xMDUgKyBtMDA2ICogbTEwOSArIG0wMDcgKiBtMTEzO1xuICAgICAgICBtWyA2XSA9IG0wMDQgKiBtMTAyICsgbTAwNSAqIG0xMDYgKyBtMDA2ICogbTExMCArIG0wMDcgKiBtMTE0O1xuICAgICAgICBtWyA3XSA9IG0wMDQgKiBtMTAzICsgbTAwNSAqIG0xMDcgKyBtMDA2ICogbTExMSArIG0wMDcgKiBtMTE1O1xuXG4gICAgICAgIG1bIDhdID0gbTAwOCAqIG0xMDAgKyBtMDA5ICogbTEwNCArIG0wMTAgKiBtMTA4ICsgbTAxMSAqIG0xMTI7XG4gICAgICAgIG1bIDldID0gbTAwOCAqIG0xMDEgKyBtMDA5ICogbTEwNSArIG0wMTAgKiBtMTA5ICsgbTAxMSAqIG0xMTM7XG4gICAgICAgIG1bMTBdID0gbTAwOCAqIG0xMDIgKyBtMDA5ICogbTEwNiArIG0wMTAgKiBtMTEwICsgbTAxMSAqIG0xMTQ7XG4gICAgICAgIG1bMTFdID0gbTAwOCAqIG0xMDMgKyBtMDA5ICogbTEwNyArIG0wMTAgKiBtMTExICsgbTAxMSAqIG0xMTU7XG5cbiAgICAgICAgbVsxMl0gPSBtMDEyICogbTEwMCArIG0wMTMgKiBtMTA0ICsgbTAxNCAqIG0xMDggKyBtMDE1ICogbTExMjtcbiAgICAgICAgbVsxM10gPSBtMDEyICogbTEwMSArIG0wMTMgKiBtMTA1ICsgbTAxNCAqIG0xMDkgKyBtMDE1ICogbTExMztcbiAgICAgICAgbVsxNF0gPSBtMDEyICogbTEwMiArIG0wMTMgKiBtMTA2ICsgbTAxNCAqIG0xMTAgKyBtMDE1ICogbTExNDtcbiAgICAgICAgbVsxNV0gPSBtMDEyICogbTEwMyArIG0wMTMgKiBtMTA3ICsgbTAxNCAqIG0xMTEgKyBtMDE1ICogbTExNTtcblxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtdWx0OiBmdW5jdGlvbiAobTAsIG0xLCBtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRQcmUobTAsIG0xLCBtKTtcbiAgICB9LFxuXG4gICAgbXVsdFBvc3Q6IGZ1bmN0aW9uIChtMCwgbTEsIG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdFByZShtMSwgbTAsIG0pO1xuICAgIH0sXG5cbiAgICBpbnZlcnQ6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIG8gPSBvIHx8IG07XG5cbiAgICAgICAgdmFyIGRldDtcblxuICAgICAgICB2YXIgbTAwID0gbVsgMF0sIG0wMSA9IG1bIDFdLCBtMDIgPSBtWyAyXSwgbTAzID0gbVsgM10sXG4gICAgICAgICAgICBtMDQgPSBtWyA0XSwgbTA1ID0gbVsgNV0sIG0wNiA9IG1bIDZdLCBtMDcgPSBtWyA3XSxcbiAgICAgICAgICAgIG0wOCA9IG1bIDhdLCBtMDkgPSBtWyA5XSwgbTEwID0gbVsxMF0sIG0xMSA9IG1bMTFdLFxuICAgICAgICAgICAgbTEyID0gbVsxMl0sIG0xMyA9IG1bMTNdLCBtMTQgPSBtWzE0XSwgbTE1ID0gbVsxNV07XG5cbiAgICAgICAgLy9UT0RPOiBhZGQgY2FjaGluZ1xuXG4gICAgICAgIG9bIDBdID0gbTA1ICogbTEwICogbTE1IC1cbiAgICAgICAgICAgIG0wNSAqIG0xMSAqIG0xNCAtXG4gICAgICAgICAgICBtMDkgKiBtMDYgKiBtMTUgK1xuICAgICAgICAgICAgbTA5ICogbTA3ICogbTE0ICtcbiAgICAgICAgICAgIG0xMyAqIG0wNiAqIG0xMSAtXG4gICAgICAgICAgICBtMTMgKiBtMDcgKiBtMTA7XG5cbiAgICAgICAgb1sgNF0gPSAtbTA0ICogbTEwICogbTE1ICtcbiAgICAgICAgICAgIG0wNCAqIG0xMSAqIG0xNCArXG4gICAgICAgICAgICBtMDggKiBtMDYgKiBtMTUgLVxuICAgICAgICAgICAgbTA4ICogbTA3ICogbTE0IC1cbiAgICAgICAgICAgIG0xMiAqIG0wNiAqIG0xMSArXG4gICAgICAgICAgICBtMTIgKiBtMDcgKiBtMTA7XG5cbiAgICAgICAgb1sgOF0gPSBtMDQgKiBtMDkgKiBtMTUgLVxuICAgICAgICAgICAgbTA0ICogbTExICogbTEzIC1cbiAgICAgICAgICAgIG0wOCAqIG0wNSAqIG0xNSArXG4gICAgICAgICAgICBtMDggKiBtMDcgKiBtMTMgK1xuICAgICAgICAgICAgbTEyICogbTA1ICogbTExIC1cbiAgICAgICAgICAgIG0xMiAqIG0wNyAqIG0wOTtcblxuICAgICAgICBvWzEyXSA9IC1tMDQgKiBtMDkgKiBtMTQgK1xuICAgICAgICAgICAgbTA0ICogbTEwICogbTEzICtcbiAgICAgICAgICAgIG0wOCAqIG0wNSAqIG0xNCAtXG4gICAgICAgICAgICBtMDggKiBtMDYgKiBtMTMgLVxuICAgICAgICAgICAgbTEyICogbTA1ICogbTEwICtcbiAgICAgICAgICAgIG0xMiAqIG0wNiAqIG0wOTtcblxuICAgICAgICBvWyAxXSA9IC1tMDEgKiBtMTAgKiBtMTUgK1xuICAgICAgICAgICAgbTAxICogbTExICogbTE0ICtcbiAgICAgICAgICAgIG0wOSAqIG0wMiAqIG0xNSAtXG4gICAgICAgICAgICBtMDkgKiBtMDMgKiBtMTQgLVxuICAgICAgICAgICAgbTEzICogbTAyICogbTExICtcbiAgICAgICAgICAgIG0xMyAqIG0wMyAqIG0xMDtcblxuICAgICAgICBvWyA1XSA9IG0wMCAqIG0xMCAqIG0xNSAtXG4gICAgICAgICAgICBtMDAgKiBtMTEgKiBtMTQgLVxuICAgICAgICAgICAgbTA4ICogbTAyICogbTE1ICtcbiAgICAgICAgICAgIG0wOCAqIG0wMyAqIG0xNCArXG4gICAgICAgICAgICBtMTIgKiBtMDIgKiBtMTEgLVxuICAgICAgICAgICAgbTEyICogbTAzICogbTEwO1xuXG4gICAgICAgIG9bIDldID0gLW0wMCAqIG0wOSAqIG0xNSArXG4gICAgICAgICAgICBtMDAgKiBtMTEgKiBtMTMgK1xuICAgICAgICAgICAgbTA4ICogbTAxICogbTE1IC1cbiAgICAgICAgICAgIG0wOCAqIG0wMyAqIG0xMyAtXG4gICAgICAgICAgICBtMTIgKiBtMDEgKiBtMTEgK1xuICAgICAgICAgICAgbTEyICogbTAzICogbTA5O1xuXG4gICAgICAgIG9bMTNdID0gbTAwICogbTA5ICogbTE0IC1cbiAgICAgICAgICAgIG0wMCAqIG0xMCAqIG0xMyAtXG4gICAgICAgICAgICBtMDggKiBtMDEgKiBtMTQgK1xuICAgICAgICAgICAgbTA4ICogbTAyICogbTEzICtcbiAgICAgICAgICAgIG0xMiAqIG0wMSAqIG0xMCAtXG4gICAgICAgICAgICBtMTIgKiBtMDIgKiBtMDk7XG5cbiAgICAgICAgb1sgMl0gPSBtMDEgKiBtMDYgKiBtMTUgLVxuICAgICAgICAgICAgbTAxICogbTA3ICogbTE0IC1cbiAgICAgICAgICAgIG0wNSAqIG0wMiAqIG0xNSArXG4gICAgICAgICAgICBtMDUgKiBtMDMgKiBtMTQgK1xuICAgICAgICAgICAgbTEzICogbTAyICogbTA3IC1cbiAgICAgICAgICAgIG0xMyAqIG0wMyAqIG0wNjtcblxuICAgICAgICBvWyA2XSA9IC1tMDAgKiBtMDYgKiBtMTUgK1xuICAgICAgICAgICAgbTAwICogbTA3ICogbTE0ICtcbiAgICAgICAgICAgIG0wNCAqIG0wMiAqIG0xNSAtXG4gICAgICAgICAgICBtMDQgKiBtMDMgKiBtMTQgLVxuICAgICAgICAgICAgbTEyICogbTAyICogbTA3ICtcbiAgICAgICAgICAgIG0xMiAqIG0wMyAqIG0wNjtcblxuICAgICAgICBvWzEwXSA9IG0wMCAqIG0wNSAqIG0xNSAtXG4gICAgICAgICAgICBtMDAgKiBtMDcgKiBtMTMgLVxuICAgICAgICAgICAgbTA0ICogbTAxICogbTE1ICtcbiAgICAgICAgICAgIG0wNCAqIG0wMyAqIG0xMyArXG4gICAgICAgICAgICBtMTIgKiBtMDEgKiBtMDcgLVxuICAgICAgICAgICAgbTEyICogbTAzICogbTA1O1xuXG4gICAgICAgIG9bMTRdID0gLW0wMCAqIG0wNSAqIG0xNCArXG4gICAgICAgICAgICBtMDAgKiBtMDYgKiBtMTMgK1xuICAgICAgICAgICAgbTA0ICogbTAxICogbTE0IC1cbiAgICAgICAgICAgIG0wNCAqIG0wMiAqIG0xMyAtXG4gICAgICAgICAgICBtMTIgKiBtMDEgKiBtMDYgK1xuICAgICAgICAgICAgbTEyICogbTAyICogbTA1O1xuXG4gICAgICAgIG9bIDNdID0gLW0wMSAqIG0wNiAqIG0xMSArXG4gICAgICAgICAgICBtMDEgKiBtMDcgKiBtMTAgK1xuICAgICAgICAgICAgbTA1ICogbTAyICogbTExIC1cbiAgICAgICAgICAgIG0wNSAqIG0wMyAqIG0xMCAtXG4gICAgICAgICAgICBtMDkgKiBtMDIgKiBtMDcgK1xuICAgICAgICAgICAgbTA5ICogbTAzICogbTA2O1xuXG4gICAgICAgIG9bIDddID0gbTAwICogbTA2ICogbTExIC1cbiAgICAgICAgICAgIG0wMCAqIG0wNyAqIG0xMCAtXG4gICAgICAgICAgICBtMDQgKiBtMDIgKiBtMTEgK1xuICAgICAgICAgICAgbTA0ICogbTAzICogbTEwICtcbiAgICAgICAgICAgIG0wOCAqIG0wMiAqIG0wNyAtXG4gICAgICAgICAgICBtMDggKiBtMDMgKiBtMDY7XG5cbiAgICAgICAgb1sxMV0gPSAtbTAwICogbTA1ICogbTExICtcbiAgICAgICAgICAgIG0wMCAqIG0wNyAqIG0wOSArXG4gICAgICAgICAgICBtMDQgKiBtMDEgKiBtMTEgLVxuICAgICAgICAgICAgbTA0ICogbTAzICogbTA5IC1cbiAgICAgICAgICAgIG0wOCAqIG0wMSAqIG0wNyArXG4gICAgICAgICAgICBtMDggKiBtMDMgKiBtMDU7XG5cbiAgICAgICAgb1sxNV0gPSBtMDAgKiBtMDUgKiBtMTAgLVxuICAgICAgICAgICAgbTAwICogbTA2ICogbTA5IC1cbiAgICAgICAgICAgIG0wNCAqIG0wMSAqIG0xMCArXG4gICAgICAgICAgICBtMDQgKiBtMDIgKiBtMDkgK1xuICAgICAgICAgICAgbTA4ICogbTAxICogbTA2IC1cbiAgICAgICAgICAgIG0wOCAqIG0wMiAqIG0wNTtcblxuICAgICAgICBkZXQgPSBtMDAgKiBvWzBdICsgbTAxICogb1s0XSArIG0wMiAqIG9bOF0gKyBtMDMgKiBvWzEyXTtcblxuICAgICAgICBpZiAoZGV0ID09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgICAgICBvWyAwXSAqPSBkZXQ7XG4gICAgICAgIG9bIDFdICo9IGRldDtcbiAgICAgICAgb1sgMl0gKj0gZGV0O1xuICAgICAgICBvWyAzXSAqPSBkZXQ7XG4gICAgICAgIG9bIDRdICo9IGRldDtcbiAgICAgICAgb1sgNV0gKj0gZGV0O1xuICAgICAgICBvWyA2XSAqPSBkZXQ7XG4gICAgICAgIG9bIDddICo9IGRldDtcbiAgICAgICAgb1sgOF0gKj0gZGV0O1xuICAgICAgICBvWyA5XSAqPSBkZXQ7XG4gICAgICAgIG9bMTBdICo9IGRldDtcbiAgICAgICAgb1sxMV0gKj0gZGV0O1xuICAgICAgICBvWzEyXSAqPSBkZXQ7XG4gICAgICAgIG9bMTNdICo9IGRldDtcbiAgICAgICAgb1sxNF0gKj0gZGV0O1xuICAgICAgICBvWzE1XSAqPSBkZXQ7XG5cbiAgICAgICAgcmV0dXJuIG87XG4gICAgfSxcblxuXG4gICAgaW52ZXJ0ZWQ6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIC8qXG4gICAgICAgICB2YXIgaW52ID0gdGhpcy5jcmVhdGUoKTtcbiAgICAgICAgIHZhciBkZXQ7XG5cbiAgICAgICAgIHZhciBtMDAgPSBtWyAwXSwgbTAxID0gbVsgMV0sIG0wMiA9IG1bIDJdLCBtMDMgPSBtWyAzXSxcbiAgICAgICAgIG0wNCA9IG1bIDRdLCBtMDUgPSBtWyA1XSwgbTA2ID0gbVsgNl0sIG0wNyA9IG1bIDddLFxuICAgICAgICAgbTA4ID0gbVsgOF0sIG0wOSA9IG1bIDldLCBtMTAgPSBtWzEwXSwgbTExID0gbVsxMV0sXG4gICAgICAgICBtMTIgPSBtWzEyXSwgbTEzID0gbVsxM10sIG0xNCA9IG1bMTRdLCBtMTUgPSBtWzE1XTtcblxuICAgICAgICAgaW52WyAwXSA9ICBtMDUgICogbTEwICAqIG0xNSAtXG4gICAgICAgICBtMDUgICogbTExICAqIG0xNCAtXG4gICAgICAgICBtMDkgICogbTA2ICAqIG0xNSArXG4gICAgICAgICBtMDkgICogbTA3ICAqIG0xNCArXG4gICAgICAgICBtMTMgICogbTA2ICAqIG0xMSAtXG4gICAgICAgICBtMTMgICogbTA3ICAqIG0xMDtcblxuICAgICAgICAgaW52WyA0XSA9IC1tMDQgICogbTEwICAqIG0xNSArXG4gICAgICAgICBtMDQgICogbTExICAqIG0xNCArXG4gICAgICAgICBtMDggICogbTA2ICAqIG0xNSAtXG4gICAgICAgICBtMDggICogbTA3ICAqIG0xNCAtXG4gICAgICAgICBtMTIgICogbTA2ICAqIG0xMSArXG4gICAgICAgICBtMTIgICogbTA3ICAqIG0xMDtcblxuICAgICAgICAgaW52WyA4XSA9ICBtMDQgICogbTA5ICAqIG0xNSAtXG4gICAgICAgICBtMDQgICogbTExICAqIG0xMyAtXG4gICAgICAgICBtMDggICogbTA1ICAqIG0xNSArXG4gICAgICAgICBtMDggICogbTA3ICAqIG0xMyArXG4gICAgICAgICBtMTIgICogbTA1ICAqIG0xMSAtXG4gICAgICAgICBtMTIgICogbTA3ICAqIG0wOTtcblxuICAgICAgICAgaW52WzEyXSA9IC1tMDQgICogbTA5ICAqIG0xNCArXG4gICAgICAgICBtMDQgICogbTEwICAqIG0xMyArXG4gICAgICAgICBtMDggICogbTA1ICAqIG0xNCAtXG4gICAgICAgICBtMDggICogbTA2ICAqIG0xMyAtXG4gICAgICAgICBtMTIgICogbTA1ICAqIG0xMCArXG4gICAgICAgICBtMTIgICogbTA2ICAqIG0wOTtcblxuICAgICAgICAgaW52WyAxXSA9IC1tMDEgICogbTEwICAqIG0xNSArXG4gICAgICAgICBtMDEgICogbTExICAqIG0xNCArXG4gICAgICAgICBtMDkgICogbTAyICAqIG0xNSAtXG4gICAgICAgICBtMDkgICogbTAzICAqIG0xNCAtXG4gICAgICAgICBtMTMgICogbTAyICAqIG0xMSArXG4gICAgICAgICBtMTMgICogbTAzICAqIG0xMDtcblxuICAgICAgICAgaW52WyA1XSA9ICBtMDAgICogbTEwICAqIG0xNSAtXG4gICAgICAgICBtMDAgICogbTExICAqIG0xNCAtXG4gICAgICAgICBtMDggICogbTAyICAqIG0xNSArXG4gICAgICAgICBtMDggICogbTAzICAqIG0xNCArXG4gICAgICAgICBtMTIgICogbTAyICAqIG0xMSAtXG4gICAgICAgICBtMTIgICogbTAzICAqIG0xMDtcblxuICAgICAgICAgaW52WyA5XSA9IC1tMDAgICogbTA5ICAqIG0xNSArXG4gICAgICAgICBtMDAgICogbTExICAqIG0xMyArXG4gICAgICAgICBtMDggICogbTAxICAqIG0xNSAtXG4gICAgICAgICBtMDggICogbTAzICAqIG0xMyAtXG4gICAgICAgICBtMTIgICogbTAxICAqIG0xMSArXG4gICAgICAgICBtMTIgICogbTAzICAqIG0wOTtcblxuICAgICAgICAgaW52WzEzXSA9ICBtMDAgICogbTA5ICAqIG0xNCAtXG4gICAgICAgICBtMDAgICogbTEwICAqIG0xMyAtXG4gICAgICAgICBtMDggICogbTAxICAqIG0xNCArXG4gICAgICAgICBtMDggICogbTAyICAqIG0xMyArXG4gICAgICAgICBtMTIgICogbTAxICAqIG0xMCAtXG4gICAgICAgICBtMTIgICogbTAyICAqIG0wOTtcblxuICAgICAgICAgaW52WyAyXSA9ICBtMDEgICogbTA2ICAqIG0xNSAtXG4gICAgICAgICBtMDEgICogbTA3ICAqIG0xNCAtXG4gICAgICAgICBtMDUgICogbTAyICAqIG0xNSArXG4gICAgICAgICBtMDUgICogbTAzICAqIG0xNCArXG4gICAgICAgICBtMTMgICogbTAyICAqIG0wNyAtXG4gICAgICAgICBtMTMgICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WyA2XSA9IC1tMDAgICogbTA2ICAqIG0xNSArXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0xNCArXG4gICAgICAgICBtMDQgICogbTAyICAqIG0xNSAtXG4gICAgICAgICBtMDQgICogbTAzICAqIG0xNCAtXG4gICAgICAgICBtMTIgICogbTAyICAqIG0wNyArXG4gICAgICAgICBtMTIgICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WzEwXSA9ICBtMDAgICogbTA1ICAqIG0xNSAtXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0xMyAtXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xNSArXG4gICAgICAgICBtMDQgICogbTAzICAqIG0xMyArXG4gICAgICAgICBtMTIgICogbTAxICAqIG0wNyAtXG4gICAgICAgICBtMTIgICogbTAzICAqIG0wNTtcblxuICAgICAgICAgaW52WzE0XSA9IC1tMDAgICogbTA1ICAqIG0xNCArXG4gICAgICAgICBtMDAgICogbTA2ICAqIG0xMyArXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xNCAtXG4gICAgICAgICBtMDQgICogbTAyICAqIG0xMyAtXG4gICAgICAgICBtMTIgICogbTAxICAqIG0wNiArXG4gICAgICAgICBtMTIgICogbTAyICAqIG0wNTtcblxuICAgICAgICAgaW52WyAzXSA9IC1tMDEgICogbTA2ICAqIG0xMSArXG4gICAgICAgICBtMDEgICogbTA3ICAqIG0xMCArXG4gICAgICAgICBtMDUgICogbTAyICAqIG0xMSAtXG4gICAgICAgICBtMDUgICogbTAzICAqIG0xMCAtXG4gICAgICAgICBtMDkgICogbTAyICAqIG0wNyArXG4gICAgICAgICBtMDkgICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WyA3XSA9ICBtMDAgICogbTA2ICAqIG0xMSAtXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0xMCAtXG4gICAgICAgICBtMDQgICogbTAyICAqIG0xMSArXG4gICAgICAgICBtMDQgICogbTAzICAqIG0xMCArXG4gICAgICAgICBtMDggICogbTAyICAqIG0wNyAtXG4gICAgICAgICBtMDggICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WzExXSA9IC1tMDAgICogbTA1ICAqIG0xMSArXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0wOSArXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xMSAtXG4gICAgICAgICBtMDQgICogbTAzICAqIG0wOSAtXG4gICAgICAgICBtMDggICogbTAxICAqIG0wNyArXG4gICAgICAgICBtMDggICogbTAzICAqIG0wNTtcblxuICAgICAgICAgaW52WzE1XSA9ICBtMDAgICogbTA1ICAqIG0xMCAtXG4gICAgICAgICBtMDAgICogbTA2ICAqIG0wOSAtXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xMCArXG4gICAgICAgICBtMDQgICogbTAyICAqIG0wOSArXG4gICAgICAgICBtMDggICogbTAxICAqIG0wNiAtXG4gICAgICAgICBtMDggICogbTAyICAqIG0wNTtcblxuICAgICAgICAgZGV0ID0gbTAwICogaW52WzBdICsgbTAxICogaW52WzRdICsgbTAyICogaW52WzhdICsgbTAzICogaW52WzEyXTtcblxuICAgICAgICAgaWYoZGV0ID09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICAgICAgIGludlsgMF0qPWRldDtcbiAgICAgICAgIGludlsgMV0qPWRldDtcbiAgICAgICAgIGludlsgMl0qPWRldDtcbiAgICAgICAgIGludlsgM10qPWRldDtcbiAgICAgICAgIGludlsgNF0qPWRldDtcbiAgICAgICAgIGludlsgNV0qPWRldDtcbiAgICAgICAgIGludlsgNl0qPWRldDtcbiAgICAgICAgIGludlsgN10qPWRldDtcbiAgICAgICAgIGludlsgOF0qPWRldDtcbiAgICAgICAgIGludlsgOV0qPWRldDtcbiAgICAgICAgIGludlsxMF0qPWRldDtcbiAgICAgICAgIGludlsxMV0qPWRldDtcbiAgICAgICAgIGludlsxMl0qPWRldDtcbiAgICAgICAgIGludlsxM10qPWRldDtcbiAgICAgICAgIGludlsxNF0qPWRldDtcbiAgICAgICAgIGludlsxNV0qPWRldDtcblxuXG4gICAgICAgICByZXR1cm4gaW52O1xuXG4gICAgICAgICAqL1xuXG4gICAgICAgIHJldHVybiB0aGlzLmludmVydCh0aGlzLmNvcHkobSkpO1xuXG5cbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlZDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1vID0gdGhpcy5jcmVhdGUoKTtcblxuICAgICAgICBtb1swIF0gPSBtWzAgXTtcbiAgICAgICAgbW9bMSBdID0gbVs0IF07XG4gICAgICAgIG1vWzIgXSA9IG1bOCBdO1xuICAgICAgICBtb1szIF0gPSBtWzEyXTtcblxuICAgICAgICBtb1s0IF0gPSBtWzEgXTtcbiAgICAgICAgbW9bNSBdID0gbVs1IF07XG4gICAgICAgIG1vWzYgXSA9IG1bOSBdO1xuICAgICAgICBtb1s3IF0gPSBtWzEzXTtcblxuICAgICAgICBtb1s4IF0gPSBtWzIgXTtcbiAgICAgICAgbW9bOSBdID0gbVs2IF07XG4gICAgICAgIG1vWzEwXSA9IG1bMTBdO1xuICAgICAgICBtb1sxMV0gPSBtWzE0XTtcblxuICAgICAgICBtb1sxMl0gPSBtWzMgXTtcbiAgICAgICAgbW9bMTNdID0gbVs3IF07XG4gICAgICAgIG1vWzE0XSA9IG1bMTFdO1xuICAgICAgICBtb1sxNV0gPSBtWzE1XTtcblxuICAgICAgICByZXR1cm4gbW87XG4gICAgfSxcblxuICAgIHRvTWF0MzNJbnZlcnNlZDogZnVuY3Rpb24gKG1hdDQ0LCBtYXQzMykge1xuICAgICAgICB2YXIgYTAwID0gbWF0NDRbMF0sIGEwMSA9IG1hdDQ0WzFdLCBhMDIgPSBtYXQ0NFsyXTtcbiAgICAgICAgdmFyIGExMCA9IG1hdDQ0WzRdLCBhMTEgPSBtYXQ0NFs1XSwgYTEyID0gbWF0NDRbNl07XG4gICAgICAgIHZhciBhMjAgPSBtYXQ0NFs4XSwgYTIxID0gbWF0NDRbOV0sIGEyMiA9IG1hdDQ0WzEwXTtcblxuICAgICAgICB2YXIgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxO1xuICAgICAgICB2YXIgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcbiAgICAgICAgdmFyIGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcblxuICAgICAgICB2YXIgZCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcbiAgICAgICAgaWYgKCFkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWQgPSAxIC8gZDtcblxuXG4gICAgICAgIGlmICghbWF0MzMpIHtcbiAgICAgICAgICAgIG1hdDMzID0gTWF0MzMuY3JlYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXQzM1swXSA9IGIwMSAqIGlkO1xuICAgICAgICBtYXQzM1sxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGlkO1xuICAgICAgICBtYXQzM1syXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogaWQ7XG4gICAgICAgIG1hdDMzWzNdID0gYjExICogaWQ7XG4gICAgICAgIG1hdDMzWzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBpZDtcbiAgICAgICAgbWF0MzNbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBpZDtcbiAgICAgICAgbWF0MzNbNl0gPSBiMjEgKiBpZDtcbiAgICAgICAgbWF0MzNbN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBpZDtcbiAgICAgICAgbWF0MzNbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGlkO1xuXG4gICAgICAgIHJldHVybiBtYXQzMztcblxuXG4gICAgfSxcblxuICAgIG11bHRWZWMzOiBmdW5jdGlvbiAobSwgdikge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZbMF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcbiAgICAgICAgdlsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xuICAgICAgICB2WzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIG11dGxWZWMzQTogZnVuY3Rpb24gKG0sIGEsIGkpIHtcbiAgICAgICAgaSAqPSAzO1xuXG4gICAgICAgIHZhciB4ID0gYVtpICBdLFxuICAgICAgICAgICAgeSA9IGFbaSArIDFdLFxuICAgICAgICAgICAgeiA9IGFbaSArIDJdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xuICAgICAgICBhW2kgKyAxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xuICAgICAgICBhW2kgKyAyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xuICAgIH0sXG5cbiAgICBtdWx0VmVjM0FJOiBmdW5jdGlvbiAobSwgYSwgaSkge1xuICAgICAgICB2YXIgeCA9IGFbaSAgXSxcbiAgICAgICAgICAgIHkgPSBhW2kgKyAxXSxcbiAgICAgICAgICAgIHogPSBhW2kgKyAyXTtcblxuICAgICAgICBhW2kgIF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcbiAgICAgICAgYVtpICsgMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcbiAgICAgICAgYVtpICsgMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcbiAgICB9LFxuXG4gICAgbXVsdFZlYzQ6IGZ1bmN0aW9uIChtLCB2KSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICB2WzBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgICAgICB2WzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM10gKiB3O1xuICAgICAgICB2WzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICB2WzNdID0gbVsgM10gKiB4ICsgbVsgN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuXG4gICAgICAgIHJldHVybiB2O1xuXG5cbiAgICB9LFxuXG4gICAgbXVsdFZlYzRBOiBmdW5jdGlvbiAobSwgYSwgaSkge1xuICAgICAgICBpICo9IDM7XG5cbiAgICAgICAgdmFyIHggPSBhW2kgIF0sXG4gICAgICAgICAgICB5ID0gYVtpICsgMV0sXG4gICAgICAgICAgICB6ID0gYVtpICsgMl0sXG4gICAgICAgICAgICB3ID0gYVtpICsgM107XG5cbiAgICAgICAgYVtpICBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgICAgICBhW2kgKyAxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdICogdztcbiAgICAgICAgYVtpICsgMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XSAqIHc7XG4gICAgICAgIGFbaSArIDNdID0gbVsgM10gKiB4ICsgbVsgN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuXG4gICAgfSxcblxuICAgIG11bHRWZWM0QUk6IGZ1bmN0aW9uIChtLCBhLCBpKSB7XG4gICAgICAgIHZhciB4ID0gYVtpICBdLFxuICAgICAgICAgICAgeSA9IGFbaSArIDFdLFxuICAgICAgICAgICAgeiA9IGFbaSArIDJdLFxuICAgICAgICAgICAgdyA9IGFbaSArIDNdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdICogdztcbiAgICAgICAgYVtpICsgMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgICAgIGFbaSArIDJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICBhW2kgKyAzXSA9IG1bIDNdICogeCArIG1bIDddICogeSArIG1bMTFdICogeiArIG1bMTVdICogdztcblxuICAgIH0sXG5cbiAgICBpc0Zsb2F0RXF1YWw6IGZ1bmN0aW9uIChtMCwgbTEpIHtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IDE2KSB7XG4gICAgICAgICAgICBpZiAoIWZNYXRoLmlzRmxvYXRFcXVhbChtMFtpXSwgbTFbaV0pKXJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuICdbJyArIG1bIDBdICsgJywgJyArIG1bIDFdICsgJywgJyArIG1bIDJdICsgJywgJyArIG1bIDNdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDRdICsgJywgJyArIG1bIDVdICsgJywgJyArIG1bIDZdICsgJywgJyArIG1bIDddICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDhdICsgJywgJyArIG1bIDldICsgJywgJyArIG1bMTBdICsgJywgJyArIG1bMTFdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bMTJdICsgJywgJyArIG1bMTNdICsgJywgJyArIG1bMTRdICsgJywgJyArIG1bMTVdICsgJ10nO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NDQ7IiwidmFyIFZlYzIgPVxue1xuICAgIFNJWkUgOiAyLFxuXG4gICAgY3JlYXRlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMF0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMjsiLCJ2YXIgVmVjMyA9XG57XG4gICAgU0laRTogMyxcbiAgICBaRVJPOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwXSlcbiAgICB9LFxuICAgIEFYSVNfWDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMF0pXG4gICAgfSxcbiAgICBBWElTX1k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsIDEsIDBdKVxuICAgIH0sXG4gICAgQVhJU19aOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAxXSlcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgICAgICAgdHlwZW9mIHggIT09ICd1bmRlZmluZWQnID8geCA6IDAuMCxcbiAgICAgICAgICAgICAgICB0eXBlb2YgeSAhPT0gJ3VuZGVmaW5lZCcgPyB5IDogMC4wLFxuICAgICAgICAgICAgICAgIHR5cGVvZiB6ICE9PSAndW5kZWZpbmVkJyA/IHogOiAwLjAgIF0pO1xuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgdjBbMF0gPSB2MVswXTtcbiAgICAgICAgdjBbMV0gPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNldDNmOiBmdW5jdGlvbiAodiwgeCwgeSwgeikge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBjb3B5OiBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcbiAgICB9LFxuXG4gICAgYWRkOiBmdW5jdGlvbiAodjAsIHYxKSB7XG4gICAgICAgIHYwWzBdICs9IHYxWzBdO1xuICAgICAgICB2MFsxXSArPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gKz0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzdWI6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgdjBbMF0gLT0gdjFbMF07XG4gICAgICAgIHYwWzFdIC09IHYxWzFdO1xuICAgICAgICB2MFsyXSAtPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNjYWxlOiBmdW5jdGlvbiAodiwgbikge1xuICAgICAgICB2WzBdICo9IG47XG4gICAgICAgIHZbMV0gKj0gbjtcbiAgICAgICAgdlsyXSAqPSBuO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkb3Q6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMF0gKyB2MFsxXSAqIHYxWzFdICsgdjBbMl0gKiB2MVsyXTtcbiAgICB9LFxuXG4gICAgY3Jvc3M6IGZ1bmN0aW9uICh2MCwgdjEsIHZvKSB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgdm8gPSB2byB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2b1swXSA9IHkwICogejEgLSB5MSAqIHowO1xuICAgICAgICB2b1sxXSA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgICAgICB2b1syXSA9IHgwICogeTEgLSB4MSAqIHkwO1xuXG5cbiAgICAgICAgcmV0dXJuIHZvO1xuICAgIH0sXG5cbiAgICBsZXJwOiBmdW5jdGlvbiAodjAsIHYxLCBmKSB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl07XG5cbiAgICAgICAgdjBbMF0gPSB4MCAqICgxLjAgLSBmKSArIHYxWzBdICogZjtcbiAgICAgICAgdjBbMV0gPSB5MCAqICgxLjAgLSBmKSArIHYxWzFdICogZjtcbiAgICAgICAgdjBbMl0gPSB6MCAqICgxLjAgLSBmKSArIHYxWzJdICogZjtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIGxlcnBlZDogZnVuY3Rpb24gKHYwLCB2MSwgZiwgdm8pIHtcbiAgICAgICAgdm8gPSB2byB8fCB2by5jcmVhdGUoKTtcblxuICAgICAgICB2b1swXSA9IHYwWzBdO1xuICAgICAgICB2b1sxXSA9IHYwWzFdO1xuICAgICAgICB2b1syXSA9IHYwWzJdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxlcnAodm8sIHYxLCBmKTtcbiAgICB9LFxuXG5cbiAgICBsZXJwM2Y6IGZ1bmN0aW9uICh2LCB4LCB5LCB6LCBmKSB7XG4gICAgICAgIHZhciB2eCA9IHZbMF0sXG4gICAgICAgICAgICB2eSA9IHZbMV0sXG4gICAgICAgICAgICB2eiA9IHZbMl07XG5cbiAgICAgICAgdlswXSA9IHZ4ICogKDEuMCAtIGYpICsgeCAqIGY7XG4gICAgICAgIHZbMV0gPSB2eSAqICgxLjAgLSBmKSArIHkgKiBmO1xuICAgICAgICB2WzJdID0gdnogKiAoMS4wIC0gZikgKyB6ICogZjtcbiAgICB9LFxuXG4gICAgbGVycGVkM2Y6IGZ1bmN0aW9uICh2LCB4LCB5LCB6LCBmLCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZvWzBdID0gdlswXTtcbiAgICAgICAgdm9bMV0gPSB2WzFdO1xuICAgICAgICB2b1syXSA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGVycDNmKHZvLCB4LCB5LCB6LCBmKTtcbiAgICB9LFxuXG5cbiAgICBsZW5ndGg6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICAgIH0sXG5cbiAgICBsZW5ndGhTcTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6O1xuICAgIH0sXG5cbiAgICBzYWZlTm9ybWFsaXplOiBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgICAgIGQgPSBkIHx8IDE7XG5cbiAgICAgICAgdmFyIGwgPSAxIC8gZDtcblxuICAgICAgICB2WzBdICo9IGw7XG4gICAgICAgIHZbMV0gKj0gbDtcbiAgICAgICAgdlsyXSAqPSBsO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGwgPSAxIC8gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG5cbiAgICAgICAgdlswXSAqPSBsO1xuICAgICAgICB2WzFdICo9IGw7XG4gICAgICAgIHZbMl0gKj0gbDtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2U6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlM2Y6IGZ1bmN0aW9uICh2LCB4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHggKyB2WzFdICogeSArIHZbMl0gKiB6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2VTcTogZnVuY3Rpb24gKHYwLCB2MSkge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHo7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EzZjogZnVuY3Rpb24gKHYsIHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuIHZbMF0gKiB4ICsgdlsxXSAqIHkgKyB2WzJdICogejtcbiAgICB9LFxuXG4gICAgbGltaXQ6IGZ1bmN0aW9uICh2LCBuKSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGRzcSA9IHggKiB4ICsgeSAqIHkgKyB6ICogeixcbiAgICAgICAgICAgIGxzcSA9IG4gKiBuO1xuXG4gICAgICAgIGlmICgoZHNxID4gbHNxKSAmJiBsc3EgPiAwKSB7XG4gICAgICAgICAgICB2YXIgbmQgPSBuIC8gTWF0aC5zcXJ0KGRzcSk7XG5cbiAgICAgICAgICAgIHZbMF0gKj0gbmQ7XG4gICAgICAgICAgICB2WzFdICo9IG5kO1xuICAgICAgICAgICAgdlsyXSAqPSBuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBpbnZlcnQ6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZbMF0gKj0gLTE7XG4gICAgICAgIHZbMV0gKj0gLTE7XG4gICAgICAgIHZbMl0gKj0gLTE7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGFkZGVkOiBmdW5jdGlvbiAodjAsIHYxLCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZvWzBdID0gdjBbMF0gKyB2MVswXTtcbiAgICAgICAgdm9bMV0gPSB2MFsxXSArIHYxWzFdO1xuICAgICAgICB2b1syXSA9IHYwWzJdICsgdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHZvO1xuICAgIH0sXG5cbiAgICBzdWJiZWQ6IGZ1bmN0aW9uICh2MCwgdjEsIHZvKSB7XG4gICAgICAgIHZvID0gdm8gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdm9bMF0gPSB2MFswXSAtIHYxWzBdO1xuICAgICAgICB2b1sxXSA9IHYwWzFdIC0gdjFbMV07XG4gICAgICAgIHZvWzJdID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdm87XG4gICAgfSxcblxuICAgIHNjYWxlZDogZnVuY3Rpb24gKHYsIG4sIHZvKSB7XG4gICAgICAgIHZvID0gdm8gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdm9bMF0gPSB2WzBdICogbjtcbiAgICAgICAgdm9bMV0gPSB2WzFdICogbjtcbiAgICAgICAgdm9bMl0gPSB2WzJdICogbjtcblxuICAgICAgICByZXR1cm4gdm87XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWQ6IGZ1bmN0aW9uICh2LCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZvWzBdID0gdlswXTtcbiAgICAgICAgdm9bMV0gPSB2WzFdO1xuICAgICAgICB2b1syXSA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKHZvKTtcbiAgICB9LFxuXG4gICAgc2FmZU5vcm1hbGl6ZWQ6IGZ1bmN0aW9uICh2LCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZvWzBdID0gdlswXTtcbiAgICAgICAgdm9bMV0gPSB2WzFdO1xuICAgICAgICB2b1syXSA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2FmZU5vcm1hbGl6ZSh2byk7XG4gICAgfSxcblxuICAgIHJhbmRvbTogZnVuY3Rpb24gKHVuaXRYLCB1bml0WSwgdW5pdFopIHtcbiAgICAgICAgdW5pdFggPSB0eXBlb2YgdW5pdFggIT09ICd1bmRlZmluZWQnID8gdW5pdFggOiAxLjA7XG4gICAgICAgIHVuaXRZID0gdHlwZW9mIHVuaXRZICE9PSAndW5kZWZpbmVkJyA/IHVuaXRZIDogMS4wO1xuICAgICAgICB1bml0WiA9IHR5cGVvZiB1bml0WiAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0WiA6IDEuMDtcblxuICAgICAgICByZXR1cm4gdGhpcy5tYWtlKCgtMC41ICsgTWF0aC5yYW5kb20oKSkgKiAyICogdW5pdFgsXG4gICAgICAgICAgICAgICAgKC0wLjUgKyBNYXRoLnJhbmRvbSgpKSAqIDIgKiB1bml0WSxcbiAgICAgICAgICAgICAgICAoLTAuNSArIE1hdGgucmFuZG9tKCkpICogMiAqIHVuaXRaKTtcbiAgICB9LFxuXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuICdbJyArIHZbMF0gKyAnLCcgKyB2WzFdICsgJywnICsgdlsyXSArICddJztcbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMztcblxuXG5cbiIsInZhciBmTWF0aCA9XG57XG4gICAgUEkgICAgICAgICAgOiBNYXRoLlBJLFxuICAgIEhBTEZfUEkgICAgIDogTWF0aC5QSSAqIDAuNSxcbiAgICBRVUFSVEVSX1BJICA6IE1hdGguUEkgKiAwLjI1LFxuICAgIFRXT19QSSAgICAgIDogTWF0aC5QSSAqIDIsXG4gICAgRVBTSUxPTiAgICAgOiAwLjAwMDEsXG5cbiAgICBsZXJwICAgICAgICA6IGZ1bmN0aW9uKGEsYix2KXtyZXR1cm4gKGEqKDEtdikpKyhiKnYpO30sXG4gICAgY29zSW50cnBsICAgOiBmdW5jdGlvbihhLGIsdil7diA9ICgxIC0gTWF0aC5jb3ModiAqIE1hdGguUEkpKSAqIDAuNTtyZXR1cm4gKGEgKiAoMS12KSArIGIgKiB2KTt9LFxuICAgIGN1YmljSW50cnBsIDogZnVuY3Rpb24oYSxiLGMsZCx2KVxuICAgIHtcbiAgICAgICAgdmFyIGEwLGIwLGMwLGQwLHZ2O1xuXG4gICAgICAgIHZ2ID0gdiAqIHY7XG4gICAgICAgIGEwID0gZCAtIGMgLSBhICsgYjtcbiAgICAgICAgYjAgPSBhIC0gYiAtIGEwO1xuICAgICAgICBjMCA9IGMgLSBhO1xuICAgICAgICBkMCA9IGI7XG5cbiAgICAgICAgcmV0dXJuIGEwKnYqdnYrYjAqdnYrYzAqditkMDtcbiAgICB9LFxuXG4gICAgaGVybWl0ZUludHJwbCA6IGZ1bmN0aW9uKGEsYixjLGQsdix0ZW5zaW9uLGJpYXMpXG4gICAge1xuICAgICAgICB2YXIgdjAsIHYxLCB2MiwgdjMsXG4gICAgICAgICAgICBhMCwgYjAsIGMwLCBkMDtcblxuICAgICAgICB0ZW5zaW9uID0gKDEuMCAtIHRlbnNpb24pICogMC41O1xuXG4gICAgICAgIHZhciBiaWFzcCA9IDEgKyBiaWFzLFxuICAgICAgICAgICAgYmlhc24gPSAxIC0gYmlhcztcblxuICAgICAgICB2MiAgPSB2ICogdjtcbiAgICAgICAgdjMgID0gdjIgKiB2O1xuXG4gICAgICAgIHYwICA9IChiIC0gYSkgKiBiaWFzcCAqIHRlbnNpb247XG4gICAgICAgIHYwICs9IChjIC0gYikgKiBiaWFzbiAqIHRlbnNpb247XG4gICAgICAgIHYxICA9IChjIC0gYikgKiBiaWFzcCAqIHRlbnNpb247XG4gICAgICAgIHYxICs9IChkIC0gYykgKiBiaWFzbiAqIHRlbnNpb247XG5cbiAgICAgICAgYTAgID0gMiAqIHYzIC0gMyAqIHYyICsgMTtcbiAgICAgICAgYjAgID0gdjMgLSAyICogdjIgKyB2O1xuICAgICAgICBjMCAgPSB2MyAtIHYyO1xuICAgICAgICBkMCAgPSAtMiAqIHYzICsgMyAqIHYyO1xuXG4gICAgICAgIHJldHVybiBhMCAqIGIgKyBiMCAqIHYwICsgYzAgKiB2MSArIGQwICogYztcbiAgICB9LFxuXG4gICAgcmFuZG9tRmxvYXQgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgcjtcblxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMDogciA9IE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IHIgPSBNYXRoLnJhbmRvbSgpICogYXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiByID0gYXJndW1lbnRzWzBdICsgKGFyZ3VtZW50c1sxXS1hcmd1bWVudHNbMF0pICogTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG5cbiAgICByYW5kb21JbnRlZ2VyIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDA6IHIgPSAwLjUgKyBNYXRoLnJhbmRvbSgpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiByID0gMC41ICsgTWF0aC5yYW5kb20oKSphcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IHIgPSBhcmd1bWVudHNbMF0gKyAoIDEgKyBhcmd1bWVudHNbMV0gLSBhcmd1bWVudHNbMF0pICogTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHIpO1xuICAgIH0sXG5cbiAgICBjb25zdHJhaW4gOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgcjtcblxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMjogYXJndW1lbnRzWzBdID0gKGFyZ3VtZW50c1swXSA+IGFyZ3VtZW50c1sxXSkgPyBhcmd1bWVudHNbMV0gOiBhcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6IGFyZ3VtZW50c1swXSA9IChhcmd1bWVudHNbMF0gPiBhcmd1bWVudHNbMl0pID8gYXJndW1lbnRzWzJdIDogKGFyZ3VtZW50c1swXSA8IGFyZ3VtZW50c1sxXSkgPyBhcmd1bWVudHNbMV0gOmFyZ3VtZW50c1swXTticmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZSAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlLHN0YXJ0LGVuZCl7cmV0dXJuICh2YWx1ZSAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCk7fSxcbiAgICBtYXAgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSxpblN0YXJ0LGluRW5kLG91dFN0YXJ0LG91dEVuZCl7cmV0dXJuIG91dFN0YXJ0ICsgKG91dEVuZCAtIG91dFN0YXJ0KSAqIG5vcm1hbGl6ZSh2YWx1ZSxpblN0YXJ0LGluRW5kKTt9LFxuICAgIHNpbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gTWF0aC5zaW4odmFsdWUpO30sXG4gICAgY29zICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUpe3JldHVybiBNYXRoLmNvcyh2YWx1ZSk7fSxcbiAgICBjbGFtcCAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSxtaW4sbWF4KXtyZXR1cm4gTWF0aC5tYXgobWluLE1hdGgubWluKG1heCx2YWx1ZSkpO30sXG4gICAgc2F3ICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDIgKiAobiAgLSBNYXRoLmZsb29yKDAuNSArIG4gKSk7fSxcbiAgICB0cmkgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS00Kk1hdGguYWJzKDAuNS10aGlzLmZyYWMoMC41Km4rMC4yNSkpO30sXG4gICAgcmVjdCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7dmFyIGEgPSBNYXRoLmFicyhuKTtyZXR1cm4gKGEgPiAwLjUpID8gMCA6IChhID09IDAuNSkgPyAwLjUgOiAoYSA8IDAuNSkgPyAxIDogLTE7fSxcbiAgICBmcmFjICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbiAtIE1hdGguZmxvb3Iobik7fSxcbiAgICBzZ24gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbi9NYXRoLmFicyhuKTt9LFxuICAgIGFicyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmFicyhuKTt9LFxuICAgIG1pbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLm1pbihuKTt9LFxuICAgIG1heCAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLm1heChuKTt9LFxuICAgIGF0YW4gICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmF0YW4obik7fSxcbiAgICBhdGFuMiAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih5LHgpe3JldHVybiBNYXRoLmF0YW4yKHkseCk7fSxcbiAgICByb3VuZCAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5yb3VuZChuKTt9LFxuICAgIGZsb29yICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmZsb29yKG4pO30sXG4gICAgdGFuICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgudGFuKG4pO30sXG4gICAgcmFkMmRlZyAgICAgICAgICAgICAgIDogZnVuY3Rpb24ocmFkaWFucyl7cmV0dXJuIHJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSk7fSxcbiAgICBkZWcycmFkICAgICAgICAgICAgICAgOiBmdW5jdGlvbihkZWdyZWUpe3JldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7IH0sXG4gICAgc3FydCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUpe3JldHVybiBNYXRoLnNxcnQodmFsdWUpO30sXG4gICAgR3JlYXRlc3RDb21tb25EaXZpc29yIDogZnVuY3Rpb24oYSxiKXtyZXR1cm4gKGIgPT0gMCkgPyBhIDogdGhpcy5HcmVhdGVzdENvbW1vbkRpdmlzb3IoYiwgYSAlIGIpO30sXG4gICAgaXNGbG9hdEVxdWFsICAgICAgICAgIDogZnVuY3Rpb24oYSxiKXtyZXR1cm4gKE1hdGguYWJzKGEtYik8dGhpcy5FUFNJTE9OKTt9LFxuICAgIGlzUG93ZXJPZlR3byAgICAgICAgICA6IGZ1bmN0aW9uKGEpe3JldHVybiAoYSYoYS0xKSk9PTA7fSxcbiAgICBzd2FwICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihhLGIpe3ZhciB0ID0gYTthID0gYjsgYiA9IGE7fSxcbiAgICBwb3cgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih4LHkpe3JldHVybiBNYXRoLnBvdyh4LHkpO30sXG4gICAgbG9nICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgubG9nKG4pO30sXG4gICAgY29zaCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIChNYXRoLnBvdyhNYXRoLkUsbikgKyBNYXRoLnBvdyhNYXRoLkUsLW4pKSowLjU7fSxcbiAgICBleHAgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5leHAobik7fSxcbiAgICBzdGVwU21vb3RoICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbipuKigzLTIqbik7fSxcbiAgICBzdGVwU21vb3RoU3F1YXJlZCAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5zdGVwU21vb3RoKG4pICogdGhpcy5zdGVwU21vb3RoKG4pO30sXG4gICAgc3RlcFNtb290aEludlNxdWFyZWQgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpO30sXG4gICAgc3RlcFNtb290aEN1YmVkICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuc3RlcFNtb290aChuKSp0aGlzLnN0ZXBTbW9vdGgobikqdGhpcy5zdGVwU21vb3RoKG4pKnRoaXMuc3RlcFNtb290aChuKTt9LFxuICAgIHN0ZXBTbW9vdGhJbnZDdWJlZCAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpKigxLXRoaXMuc3RlcFNtb290aChuKSk7fSxcbiAgICBzdGVwU3F1YXJlZCAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbipuO30sXG4gICAgc3RlcEludlNxdWFyZWQgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtKDEtbikqKDEtbik7fSxcbiAgICBzdGVwQ3ViZWQgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbipuKm4qbjt9LFxuICAgIHN0ZXBJbnZDdWJlZCAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLW4pKigxLW4pKigxLW4pKigxLW4pO30sXG4gICAgY2F0bXVsbHJvbSAgICAgICAgICAgIDogZnVuY3Rpb24oYSxiLGMsZCxpKXsgcmV0dXJuIGEgKiAoKC1pICsgMikgKiBpIC0gMSkgKiBpICogMC41ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiAqICgoKDMgKiBpIC0gNSkgKiBpKSAqIGkgKyAyKSAqIDAuNSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgKiAoKC0zICogaSArIDQpICogaSArIDEpICogaSAqIDAuNSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQgKiAoKGkgLSAxKSAqIGkgKiBpKSAqIDAuNTt9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZk1hdGg7IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIE1FVEhPRF9OT1RfSU1QTEVNRU5URUQ6ICdNZXRob2Qgbm90IGltcGxlbWVudGVkIGluIHRhcmdldCBwbGF0Zm9ybS4nLFxuICAgIENMQVNTX0lTX1NJTkdMRVRPTjogICAgICdBcHAgaXMgc2luZ2xldG9uLiBHZXQgdmlhIGdldEluc3RhbmNlKCkuJyxcbiAgICBBUFBfTk9fU0VUVVA6ICAgICAgICAgICAnTm8gc2V0dXAgbWV0aG9kIGFkZGVkIHRvIGFwcC4nLFxuICAgIEFQUF9OT19VUERBVEUgOiAgICAgICAgICdObyB1cGRhdGUgbWV0aG9kIGFkZGVkIHRvIGFwcC4nLFxuICAgIFBMQVNLX1dJTkRPV19TSVpFX1NFVDogICdQbGFzayB3aW5kb3cgc2l6ZSBjYW4gb25seSBiZSBzZXQgb24gc3RhcnR1cC4nLFxuICAgIFdST05HX1BMQVRGT1JNOiAgICAgICAgICdXcm9uZyBQbGF0Zm9ybS4nLFxuICAgIE1BVFJJWF9TVEFDS19QT1BfRVJST1I6ICdNYXRyaXggc3RhY2sgaW52YWxpZCBwb3AuJyxcbiAgICBWRVJUSUNFU19JTl9XUk9OR19TSVpFOiAnVmVydGljZXMgYXJyYXkgaGFzIHdyb25nIGxlbmd0aC4gU2hvdWxkIGJlICcsXG4gICAgQ09MT1JTX0lOX1dST05HX1NJWkU6ICAgJ0NvbG9yIGFycmF5IGxlbmd0aCBub3QgZXF1YWwgdG8gbnVtYmVyIG9mIHZlcnRpY2VzLicsXG4gICAgRElSRUNUT1JZX0RPRVNOVF9FWElTVDogJ0ZpbGUgdGFyZ2V0IGRpcmVjdG9yeSBkb2VzIG5vdCBleGlzdC4nLFxuICAgIEZJTEVfRE9FU05UX0VYSVNUOiAgICAgICdGaWxlIGRvZXMgbm90IGV4aXN0LicsXG4gICAgVEVYVFVSRV9XSURUSF9OT1RfUDI6ICAgJ1RleHR1cmUgaW1hZ2VEYXRhIGlzIG5vdCBwb3dlciBvZiAyLicsXG4gICAgVEVYVFVSRV9IRUlHSFRfTk9UX1AyOiAgJ1RleHR1cmUgaW1hZ2VEYXRhIGlzIG5vdCBwb3dlciBvZiAyLicsXG4gICAgVEVYVFVSRV9JTUFHRV9EQVRBX05VTEw6J1RleHR1cmUgaW1hZ2VEYXRhIGlzIG51bGwuJ1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgQVBQX1dJRFRIICA6IDgwMCxcbiAgICBBUFBfSEVJR0hUIDogNjAwLFxuXG4gICAgQVBQX0ZQUyA6IDMwLFxuXG4gICAgQVBQX1BMQVNLX1dJTkRPV19USVRMRSA6ICcnLFxuICAgIEFQUF9QTEFTS19UWVBFICA6ICczZCcsXG4gICAgQVBQX1BMQVNLX1ZTWU5DIDogJ2ZhbHNlJyxcbiAgICBBUFBfUExBU0tfTVVMVElTQU1QTEUgOiB0cnVlLFxuXG4gICAgQ0FNRVJBX0ZPViA6IDQ1LFxuICAgIENBTUVSQV9ORUFSIDogMC4xLFxuICAgIENBTUVSQV9GQVIgIDogMTAwXG5cbn07IiwidmFyIFBsYXRmb3JtID0ge1dFQjonV0VCJyxQTEFTSzonUExBU0snLE5PREVfV0VCS0lUOidOT0RFX1dFQktJVCd9O1xuICAgIFBsYXRmb3JtLl9fdGFyZ2V0ID0gbnVsbDtcblxuUGxhdGZvcm0uZ2V0VGFyZ2V0ICA9IGZ1bmN0aW9uKClcbntcblxuICAgIGlmKCF0aGlzLl9fdGFyZ2V0KVxuICAgIHtcbiAgICAgICAgdmFyIGJXaW5kb3cgICAgID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICAgICBiRG9jdW1lbnQgICA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICAgICBiUmVxdWlyZUYgICA9IHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBiUmVxdWlyZSAgICA9ICEhcmVxdWlyZSxcbiAgICAgICAgICAgIGJOb2RlV2Via2l0ID0gZmFsc2U7XG5cbiAgICAgICAgLy9UT0RPIGZpeFxuICAgICAgICAvL2htIHRoaXMgbmVlZHMgdG8gYmUgZml4ZWQgLT4gYnJvd3NlcmlmeSByZXF1aXJlIHZzIG5vZGUtd2Via2l0IHJlcXVpcmVcbiAgICAgICAgLy9mb3Igbm93IHRoaXMgZG9lcyB0aGUgam9iXG4gICAgICAgIGlmKGJEb2N1bWVudCl7XG4gICAgICAgICAgICBiTm9kZVdlYmtpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0lGUkFNRScpLmhhc093blByb3BlcnR5KCdud2Rpc2FibGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX190YXJnZXQgPSAoYldpbmRvdyAmJiBiRG9jdW1lbnQgJiYgIWJOb2RlV2Via2l0KSA/IHRoaXMuV0VCIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIChiV2luZG93ICYmIGJEb2N1bWVudCAmJiAgYk5vZGVXZWJraXQpID8gdGhpcy5OT0RFX1dFQktJVCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAoIWJXaW5kb3cgJiYgIWJEb2N1bWVudCAmJiBiUmVxdWlyZUYgJiYgYlJlcXVpcmUpID8gdGhpcy5QTEFTSyA6XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX190YXJnZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXRmb3JtOyIsIi8vdGVtcFxudmFyIFNoYXJlZCA9XG57XG4gICAgX193aW5kb3dTaXplIDogbmV3IEZsb2F0MzJBcnJheShbMCwwXSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcmVkOyIsInZhciBMb2cgPSB7XG4gICAgYXNzZXJ0IDogY29uc29sZS5hc3NlcnQgfHwgZnVuY3Rpb24oKXt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZztcblxuIiwidmFyIGZFcnJvciAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL0Vycm9yJyksXG4gICAgVmVjMiAgICAgICA9IHJlcXVpcmUoJy4uL21hdGgvVmVjMicpO1xuXG5mdW5jdGlvbiBNb3VzZSgpXG57XG4gICAgaWYoTW91c2UuX19pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3IoRXJyb3IuQ0xBU1NfSVNfU0lOR0xFVE9OKTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uICAgICA9IFZlYzIuY3JlYXRlKCk7XG4gICAgdGhpcy5fcG9zaXRpb25MYXN0ID0gVmVjMi5jcmVhdGUoKTtcbiAgICB0aGlzLl9zdGF0ZSAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX3N0YXRlTGFzdCAgICA9IG51bGw7XG4gICAgdGhpcy5fd2hlZWxEZWx0YSAgID0gMDtcblxuICAgIE1vdXNlLl9faW5zdGFuY2UgPSB0aGlzO1xufVxuXG5Nb3VzZS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb247fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRQb3NpdGlvbkxhc3QgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbkxhc3Q7fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRYICAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvblswXTt9O1xuTW91c2UucHJvdG90eXBlLmdldFkgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uWzFdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WExhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzBdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WUxhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzFdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0U3RhdGUgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fc3RhdGU7fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRTdGF0ZUxhc3QgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zdGF0ZUxhc3Q7fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRXaGVlbERlbHRhICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl93aGVlbERlbHRhO307XG5cbk1vdXNlLl9faW5zdGFuY2UgPSBudWxsO1xuTW91c2UuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpe3JldHVybiBNb3VzZS5fX2luc3RhbmNlO307XG5cbm1vZHVsZS5leHBvcnRzID0gTW91c2U7IiwidmFyIE9iamVjdFV0aWwgPSB7XG5cbiAgICBpc1VuZGVmaW5lZDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCc7XG4gICAgfSxcblxuICAgIGlzRmxvYXQzMkFycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnIgaW5zdGFuY2VvZiAgRmxvYXQzMkFycmF5O1xuICAgIH0sXG5cbiAgICBzYWZlRmxvYXQzMkFycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnIgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgPyBhcnIgOiBuZXcgRmxvYXQzMkFycmF5KGFycik7XG4gICAgfSxcblxuICAgIHNhZmVVaW50MTZBcnJheTogZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyIGluc3RhbmNlb2YgVWludDE2QXJyYXkgPyBhcnIgOiBuZXcgVWludDE2QXJyYXkoYXJyKTtcbiAgICB9LFxuXG4gICAgY29weUZsb2F0MzJBcnJheTogZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShhcnIpO1xuICAgIH0sXG5cbiAgICBhcnJheVJlc2l6ZWQ6IGZ1bmN0aW9uIChhcnIsIGxlbikge1xuICAgICAgICBhcnIubGVuZ3RoID0gbGVuO1xuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH0sXG5cbiAgICBjb3B5QXJyYXk6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGFyci5sZW5ndGgsIG91dCA9IG5ldyBBcnJheShsKTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGwpIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGFycltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICBzZXRBcnJheTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGEubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoKytpIDwgbCkge1xuICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0QXJyYXlPZmZzZXRJbmRleDogZnVuY3Rpb24gKGFyciwgb2Zmc2V0LCBsZW4pIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGxlbiB8fCBhcnIubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoKytpIDwgbCkge1xuICAgICAgICAgICAgYXJyW2ldICs9IG9mZnNldDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL2NoZWNrIGZvciBjb250ZW50IG5vdCBvYmplY3QgZXF1YWxpdHksIG9iamVjdCBpcyBudW1iZXJcbiAgICBlcXVhbEFyckNvbnRlbnQ6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmICghYSB8fCAhYiB8fCAoIWEgJiYgIWIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGEubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYVtpXSAhPSBiW2ldKXJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG5cbiAgICBnZXRGdW5jdGlvbkJvZHk6IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgICAgIHJldHVybiAoZnVuYykudG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25bXntdK1xceyhbXFxzXFxTXSopXFx9JC8pWzFdO1xuICAgIH0sXG5cbiAgICBfX3RvU3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9LFxuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iailcbiAgICB9LFxuXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhvYmopID09ICdbb2JqZWN0IFN0cmluZ10nO1xuICAgIH0sXG5cblxuICAgIGlzRmxvYXQ2NEFycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIH0sXG5cbiAgICBpc1VpbnQ4QXJyYXk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhvYmopID09ICdbb2JqZWN0IFVpbnQ4QXJyYXldJztcbiAgICB9LFxuXG4gICAgaXNVaW50MTZBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgVWludDE2QXJyYXldJ1xuICAgIH0sXG5cbiAgICBpc1VpbnQzMkFycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBVaW50MzJBcnJheV0nXG4gICAgfSxcblxuICAgIGlzVHlwZWRBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1VpbnQ4QXJyYXkob2JqKSB8fFxuICAgICAgICAgICAgdGhpcy5pc1VpbnQxNkFycmF5KG9iaikgfHxcbiAgICAgICAgICAgIHRoaXMuaXNVaW50MzJBcnJheShvYmopIHx8XG4gICAgICAgICAgICB0aGlzLmlzRmxvYXQzMkFycmF5KG9iaikgfHxcbiAgICAgICAgICAgIHRoaXMuaXNGbG9hdDMyQXJyYXkob2JqKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGdW5jdGlvbihvYmopID8gdGhpcy5nZXRGdW5jdGlvblN0cmluZyhvYmopIDpcbiAgICAgICAgICAgIHRoaXMuaXNBcnJheShvYmopID8gdGhpcy5nZXRBcnJheVN0cmluZyhvYmopIDpcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3RyaW5nKG9iaikgPyB0aGlzLmdldFN0cmluZyhvYmopIDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1R5cGVkQXJyYXkob2JqKSA/IHRoaXMuZ2V0VHlwZWRBcnJheVN0cmluZyhvYmopIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPYmplY3Qob2JqKSA/IHRoaXMuZ2V0T2JqZWN0U3RyaW5nKG9iaikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0VHlwZWRBcnJheVN0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNGbG9hdDMyQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IG11c3QgYmUgb2YgdHlwZSBGbG9hdDMyQXJyYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmouYnl0ZUxlbmd0aCA9PSAwKXJldHVybiAnW10nO1xuICAgICAgICB2YXIgb3V0ID0gJ1snO1xuXG4gICAgICAgIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgICAgICAgICBvdXQgKz0gb2JqW3BdICsgJywnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dC5zdWJzdHIoMCwgb3V0Lmxhc3RJbmRleE9mKCcsJykpICsgJ10nO1xuXG4gICAgfSxcblxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gJ1wiJyArIG9iaiArICdcIic7XG4gICAgfSxcblxuICAgIGdldEFycmF5U3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBtdXN0IGJlIG9mIHR5cGUgYXJyYXkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dCA9ICdbJztcbiAgICAgICAgaWYgKG9iai5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dCArICddJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy50b1N0cmluZyhvYmpbaV0pICsgJywnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dC5zdWJzdHIoMCwgb3V0Lmxhc3RJbmRleE9mKCcsJykpICsgJ10nO1xuICAgIH0sXG5cbiAgICBnZXRPYmplY3RTdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBtdXN0IGJlIG9mIHR5cGUgb2JqZWN0LicpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dCA9ICd7JztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvdXQgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICAgICAgb3V0ICs9IHAgKyAnOicgKyB0aGlzLnRvU3RyaW5nKG9ialtwXSkgKyAnLCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0LnN1YnN0cigwLCBvdXQubGFzdEluZGV4T2YoJywnKSkgKyAnfSc7XG4gICAgfSxcblxuICAgIC8vXG4gICAgLy8gIFBhcnNlcyBmdW5jIHRvIHN0cmluZyxcbiAgICAvLyAgbXVzdCBzYXRpc2Z5IChpZiAnY2xhc3MnKTpcbiAgICAvL1xuICAgIC8vICBmdW5jdGlvbiBDbGFzc0IoKXtcbiAgICAvLyAgICAgIENsYXNzQi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7Q2xhc3NCLmNhbGwuLi5cbiAgICAvLyAgfVxuICAgIC8vXG4gICAgLy8gIENsYXNzQi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsYXNzQS5wcm90b3R5cGUpXG4gICAgLy9cbiAgICAvLyAgQ2xhc3NCLnByb3RvdHlwZS5tZXRob2QgPSBmdW5jdGlvbigpe307XG4gICAgLy9cbiAgICAvLyAgQ2xhc3NCLlNUQVRJQyA9IDE7XG4gICAgLy8gIENsYXNzQi5TVEFUSUNfT0JKID0ge307XG4gICAgLy8gIENsYXNzQi5TVEFUSUNfQVJSID0gW107XG4gICAgLy9cblxuICAgIGdldEZ1bmN0aW9uU3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBtdXN0IGJlIG9mIHR5cGUgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0ID0gJyc7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBvYmoubmFtZSxcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gb2JqLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBpbmhlcml0ZWQgPSAxICsgY29uc3RydWN0b3IuaW5kZXhPZignLmNhbGwodGhpcycpIHx8IDEgKyBjb25zdHJ1Y3Rvci5pbmRleE9mKCcuYXBwbHkodGhpcycpO1xuXG4gICAgICAgIG91dCArPSBjb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAoaW5oZXJpdGVkKSB7XG4gICAgICAgICAgICBvdXQgKz0gJ1xcblxcbic7XG4gICAgICAgICAgICBpbmhlcml0ZWQgLT0gMjtcblxuICAgICAgICAgICAgdmFyIGJhc2VDbGFzcyA9ICcnO1xuICAgICAgICAgICAgdmFyIGNoYXIgPSAnJyxcbiAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjaGFyICE9ICcgJykge1xuICAgICAgICAgICAgICAgIGJhc2VDbGFzcyA9IGNoYXIgKyBiYXNlQ2xhc3M7XG4gICAgICAgICAgICAgICAgY2hhciA9IGNvbnN0cnVjdG9yLnN1YnN0cihpbmhlcml0ZWQgLSBpLCAxKTtcbiAgICAgICAgICAgICAgICArK2k7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gbmFtZSArICcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSgnICsgYmFzZUNsYXNzICsgJy5wcm90b3R5cGUpOyc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICAgICAgb3V0ICs9ICdcXG5cXG4nICsgbmFtZSArICcuJyArIHAgKyAnID0gJyArIHRoaXMudG9TdHJpbmcob2JqW3BdKSArICc7JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmoucHJvdG90eXBlO1xuICAgICAgICBmb3IgKHZhciBwIGluIHByb3RvdHlwZSkge1xuICAgICAgICAgICAgaWYgKHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgICAgIG91dCArPSAnXFxuXFxuJyArIG5hbWUgKyAnLnByb3RvdHlwZS4nICsgcCArICcgPSAnICsgdGhpcy50b1N0cmluZyhwcm90b3R5cGVbcF0pICsgJzsnO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0VXRpbDtcbiJdfQ==
;