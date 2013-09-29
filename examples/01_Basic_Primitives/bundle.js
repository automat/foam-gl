;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(800,600);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function(){};

App.prototype.update = function()
{
    var kgl = this.fgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 1 + Math.sin(time) * 0.25;

    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    cam.setPosition3f(Math.cos(time)*Math.PI*zoom,zoom,Math.sin(time)*Math.PI*zoom);
    cam.updateMatrices();

    this.drawSystem();

    kgl.drawMode(kgl.TRIANGLES);
    kgl.color1f(1);
   // fgl.linef(0,0,0,1,1,1);

    kgl.cube(1);


    kgl.drawMode(kgl.LINES);
};

App.prototype.drawSystem =  function()
{
    var kgl = this.fgl;

    kgl.color1f(0.25);
    Foam.fGLUtil.drawGrid(kgl,8,1);
    Foam.fGLUtil.drawGridCube(kgl,8,1);
    Foam.fGLUtil.drawAxes(kgl,4);
};

var app = new App();

},{"../../src/foam/foam.js":6}],2:[function(require,module,exports){
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
},{"../system/fDefault":37,"../system/fError":38}],3:[function(require,module,exports){
var Default     = require('../system/fDefault'),
    fError      = require('../system/fError'),
    fGL         = require('../graphics/fGL'),
    AppImpl     = require('./fAppImpl'),
    CameraBasic = require('../graphics/fCameraBasic'),
    plask       = require('plask');

function AppImplPlask()
{
    AppImpl.apply(this,arguments);
}

AppImplPlask.prototype = Object.create(AppImpl.prototype);

AppImplPlask.prototype.setSize = function(width,height)
{
    if(this._isInitialized)throw new Error(fError.PLASK_WINDOW_SIZE_SET);

    this._width  = width;
    this._height = height;
    this._ratio  = width / height;
};

//TODO: Fix time delta, double measuring of time in general

AppImplPlask.prototype.init = function(appObj)
{
    var self = this;
    var mouse;
    var prevTime = 0,
        timeDelta,
        time;


    function updateMouse(x,y)
    {
        appObj.mouse._positionLast[0] = appObj.mouse._position[0];
        appObj.mouse._positionLast[1] = appObj.mouse._position[1];

        if(self._mouseBounds)
        {
            appObj.mouse._position[0] = Math.max(0,Math.min(x,self._width));
            appObj.mouse._position[1] = Math.max(0,Math.min(y,self._height));
        }
        else
        {
            appObj.mouse._position[0] = x;
            appObj.mouse._position[1] = y;
        }
    }

    plask.simpleWindow({

        settings:
        {
            width:       self._width  || Default.APP_WIDTH,
            height:      self._height || Default.APP_HEIGHT,
            type:        Default.APP_PLASK_TYPE,
            vsync:       Default.APP_PLASK_VSYNC,
            multisample: Default.APP_PLASK_MULTISAMPLE,
            borderless:  self._isBorderless,
            fullscreen:  self._isFullscreen,
            title:       self._windowTitle || Default.APP_PLASK_WINDOW_TITLE
        },

        init:function()
        {
            appObj.fgl    = new fGL(this.gl,null);
            appObj.camera = new CameraBasic();
            appObj.fgl.setCamera(appObj.camera);
            appObj.camera.setPerspective(Default.CAMERA_FOV,
                                         self._ratio,
                                         Default.CAMERA_NEAR,
                                         Default.CAMERA_FAR);

            appObj.camera.setTarget3f(0,0,0);
            appObj.camera.updateMatrices();

            if(self._bUpdate)this.framerate(self._targetFPS);
            appObj.setup();

            self._timeStart = Date.now();
            self._timeNext  = Date.now();

            this.on('mouseMoved',
                function(e)
                {
                    updateMouse(e.x, e.y);
                    appObj.onMouseMove(e);
                });

            this.on('leftMouseDragged',
                function(e)
                {
                    updateMouse(e.x, e.y);
                    appObj.onMouseMove(e);

                });

            this.on('leftMouseDown',
                function(e)
                {
                    self._mouseDown = true;
                    appObj.onMouseDown(e);
                }
            );

            this.on('leftMouseUp',
                function(e)
                {
                    self._mouseDown = false;
                    appObj.onMouseUp(e);
                }
            );

            this.on('scrollWheel',
                function(e)
                {
                    self._mouseWheelDelta += Math.max(-1,Math.min(1,e.dy)) * -1;
                    appObj.onMouseWheel(e);
                }
            );

            this.on('keyUp',
                function(e)
                {
                    self._keyDown = false;
                    self._keyStr  = e.str;
                    self._keyCode = e.keyCode;
                    appObj.onKeyUp(e);
                }
            );

            this.on('keyDown',
                function(e)
                {
                    self._keyDown = true;
                    self._keyStr  = e.str;
                    self._keyCode = e.keyCode;
                    appObj.onKeyDown(e);
                }
            );

            self._isInitialized = true;
        },

        draw:function()
        {
            self._framenum  = this.framenum;
            time            = self._frametime = this.frametime;

            mouse           = appObj.mouse;
            self._mouseMove = mouse._position[0] != mouse._positionLast[0] ||
                              mouse._position[1] != mouse._positionLast[1];


            //eh jo, TODO: check
            self._timeDelta = Math.min((time - prevTime)*10,1);
            appObj.update();
            prevTime = time;

        }});
};

AppImplPlask.prototype.getSecondsElapsed = function(){return this._frametime;};
AppImplPlask.prototype.getFramesElapsed  = function(){return this._framenum;};
AppImplPlask.prototype.getTimeDelta      = function(){return this._timeDelta;};
AppImplPlask.prototype.getTimeStart      = function(){return this._timeStart;};

AppImplPlask.prototype.setFullWindowFrame = function(bool){this._isFullWindowFrame = bool;return true;};
AppImplPlask.prototype.setFullscreen      = function(bool){this._isFullscreen = bool;return true;};
AppImplPlask.prototype.setBorderless      = function(bool){this._isBorderless = bool;return true;};


module.exports = AppImplPlask;




},{"../graphics/fCameraBasic":16,"../graphics/fGL":17,"../system/fDefault":37,"../system/fError":38,"./fAppImpl":2,"plask":43}],4:[function(require,module,exports){
var Default     = require('../system/fDefault'),
    AppImpl     = require('./fAppImpl'),
    fGL         = require('../graphics/fGL'),
    CameraBasic = require('../graphics/fCameraBasic');

function AppImplWeb()
{
    AppImpl.apply(this,arguments);

    var canvas3d = this._canvas3d = document.createElement('canvas');
        canvas3d.setAttribute('tabindex','0');
        canvas3d.focus();

    this._context3d = canvas3d.getContext('webkit-3d') ||
                      canvas3d.getContext("webgl") ||
                      canvas3d.getContext("experimental-webgl");

    var canvas2d = this._canvas2d = document.createElement('canvas');

    this._parent           = null;
    this._mouseEventTarget = canvas3d;
    this._keyEventTarget   = canvas3d;

    this._context2d = canvas2d.getContext('2d');

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame;

}

AppImplWeb.prototype = Object.create(AppImpl.prototype);

AppImplWeb.prototype.getParent = function()   {return this._context3d.parentNode;};
AppImplWeb.prototype.setParent = function(obj){this._parent = obj;};


AppImplWeb.prototype.setSize = function(width,height)
{
    if(this._isFullWindowFrame){width = window.innerWidth; height = window.innerHeight;}
    if(width == this._width && height == this._height)return;

    this._width  = width;
    this._height = height;
    this._ratio  = width / height;

    if(!this._isInitialized) return;

    this._updateCanvas3dSize();
};

AppImplWeb.prototype._init = function(appObj)
{
    var self   = this;
    var mouse  = appObj.mouse;
    var canvas = this._canvas3d;

    document.title = this._windowTitle || document.title;

    if(!this._parent)document.body.appendChild(canvas);
    else this._parent.appendChild(canvas);

    this._updateCanvas3dSize();

    var mouseEventTarget = this._mouseEventTarget,
        keyEventTarget   = this._keyEventTarget;


    appObj.fgl = new fGL(this._context3d,this._context2d);
    appObj.fgl.gl.viewport(0,0,this._width,this._height);

    appObj.camera = new CameraBasic();
    appObj.fgl.setCamera(appObj.camera);
    appObj.camera.setPerspective(Default.CAMERA_FOV,
                                 self._ratio,
                                 Default.CAMERA_NEAR,
                                 Default.CAMERA_FAR);
    appObj.camera.setTarget3f(0,0,0);
    appObj.camera.updateMatrices();

    appObj.setup();

    mouseEventTarget.addEventListener('mousemove',
        function(e)
        {
            mouse._positionLast[0] = mouse._position[0];
            mouse._positionLast[1] = mouse._position[1];

            mouse._position[0] = e.pageX;
            mouse._position[1] = e.pageY;

            appObj.onMouseMove(e);

        });

    mouseEventTarget.addEventListener('mousedown',
        function(e)
        {
            self._mouseDown = true;
            appObj.onMouseDown(e);

        });

    mouseEventTarget.addEventListener('mouseup',
        function(e)
        {
            self._mouseDown = false;
            appObj.onMouseUp(e);

        });

    mouseEventTarget.addEventListener('mousewheel',
        function(e)
        {
            self._mouseWheelDelta += Math.max(-1,Math.min(1, e.wheelDelta)) * -1;
            appObj.onMouseWheel(e);
        });


    keyEventTarget.addEventListener('keydown',
        function(e)
        {
            self._keyDown = true;
            self._keyCode = e.keyCode;
            self._keyStr  = String.fromCharCode(e.keyCode);//not reliable;
            appObj.onKeyDown(e);

        });

    keyEventTarget.addEventListener('keyup',
        function(e)
        {
            self._keyDown = false;
            self._keyCode = e.keyCode;
            self._keyStr  = String.fromCharCode(e.keyCode);
            appObj.onKeyUp(e);

        });


    var fullWindowFrame = this._isFullWindowFrame;
    var camera;
    var gl;

    var windowWidth,
        windowHeight;

    function updateCameraRatio()
    {
        camera = appObj.camera;
        camera.setAspectRatio(self._ratio);
        camera.updateProjectionMatrix();
    }

    function updateViewportGL()
    {
        gl = appObj.fgl;
        gl.gl.viewport(0,0,self._width,self._height);
        gl.clearColor(gl.getClearBuffer());
    }


    window.addEventListener('resize',
        function(e)
        {
            windowWidth  = window.innerWidth;
            windowHeight = window.innerHeight;

            if(fullWindowFrame)
            {
                self.setSize(windowWidth,windowHeight);

                updateCameraRatio();
                updateViewportGL();
            }

            appObj.onWindowResize(e);

            if(!fullWindowFrame && (self._width == windowWidth && self._height == windowHeight))
            {
                updateCameraRatio();
                updateViewportGL();
            }
        });

    if(this._bUpdate)
    {
        var time, timeDelta;
        var timeInterval = this._timeInterval;
        var timeNext;

        function update()
        {
            requestAnimationFrame(update,null);

            time      = self._time = Date.now();
            timeDelta = time - self._timeNext;

            self._timeDelta = Math.min(timeDelta / timeInterval, 1);

            if(timeDelta > timeInterval)
            {
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


AppImplWeb.prototype.init = function(appObj)
{
    var self = this;
    window.addEventListener('load',function(){self._init(appObj);});
};

AppImplWeb.prototype._updateCanvas3dSize = function()
{
    var canvas = this._canvas3d,
        width  = this._width,
        height = this._height;

        canvas.style.width  = width  + 'px';
        canvas.style.height = height + 'px';
        canvas.width        = width;
        canvas.height       = height;
};

AppImplWeb.prototype.getSecondsElapsed = function(){return this._timeElapsed;};
AppImplWeb.prototype.getTimeDelta      = function(){return this._timeDelta;};

AppImplWeb.prototype.setMouseListenerTarget = function(obj){this._mouseEventTarget = obj;};
AppImplWeb.prototype.setKeyListenerTarget   = function(obj){this._keyEventTarget = obj;};
AppImplWeb.prototype.setFullWindowFrame     = function(bool){this._isFullWindowFrame = bool;return true;};


module.exports = AppImplWeb;


},{"../graphics/fCameraBasic":16,"../graphics/fGL":17,"../system/fDefault":37,"./fAppImpl":2}],5:[function(require,module,exports){
var fError       = require('../system/fError'),
    Platform     = require('../system/fPlatform'),
    AppImplWeb   = require('./fAppImplWeb'),
    AppImplPlask = require('./fAppImplPlask'),
    Mouse        = require('../util/fMouse'),
    CameraBasic  = require('../graphics/fCameraBasic');


function Application()
{
    if(Application.__instance)throw new Error(fError.CLASS_IS_SINGLETON);

    var target  = Platform.getTarget();
    if(typeof target === 'undefined' )throw new Error(fError.WRONG_PLATFORM);

    this._appImpl = target == Platform.WEB   ? new AppImplWeb(arguments) :
                    target == Platform.PLASK ? new AppImplPlask(arguments) :
                    null;

    this.mouse  = new Mouse();
    this.fgl    = null;
    this.camera = null;

    Application.__instance = this;
}

Application.prototype.setup  = function(){throw new Error(fError.APP_NO_SETUP);};
Application.prototype.update = function(){throw new Error(fError.APP_NO_UPDATE);};

Application.prototype.setSize = function(width,height)
{
    var appImpl = this._appImpl;
        appImpl.setSize(width,height);

    if(!appImpl.isInitialized())appImpl.init(this);
};
Application.prototype.getWidth  = function(){return this._appImpl.getWidth();};
Application.prototype.getHeight = function(){return this._appImpl.getHeight();};

Application.prototype.setUpdate = function(bool){this._appImpl.setUpdate(bool);};



Application.prototype.setWindowTitle       = function(title){this._appImpl.setWindowTitle(title);};
Application.prototype.restrictMouseToFrame = function(bool) {this._appImpl.restrictMouseToFrame(bool);};

Application.prototype.setFullWindowFrame  = function(bool){return this._appImpl.setFullWindowFrame(bool);};
Application.prototype.setFullscreen       = function(bool){return this._appImpl.setFullscreen(true);};
Application.prototype.isFullscreen        = function()    {return this._appImpl.isFullscreen();};
Application.prototype.setBorderless       = function(bool){return this._appImpl.setBorderless(bool);};
Application.prototype.isBorderless        = function()    {return this._appImpl.isBorderless();};
Application.prototype.setDisplay          = function(num) {return this._appImpl.setDisplay(num);};
Application.prototype.getDisplay          = function()    {return this._appImpl.getDisplay();};

Application.prototype.setTargetFPS = function(fps){this._appImpl.setTargetFPS(fps);};


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

Application.prototype.getAspectRatioWindow = function(){return this._appImpl.getAspectRatio();};

Application.__instance = null;
Application.getInstance = function(){return Application.__instance;};

module.exports = Application;






},{"../graphics/fCameraBasic":16,"../system/fError":38,"../system/fPlatform":39,"../util/fMouse":41,"./fAppImplPlask":3,"./fAppImplWeb":4}],6:[function(require,module,exports){
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

module.exports =
{
    Math        : require('./math/fMath'),
    Vec2        : require('./math/fVec2'),
    Vec3        : require('./math/fVec3'),
    Vec4        : require('./math/fVec4'),
    Mat33       : require('./math/fMat33'),
    Mat44       : require('./math/fMat44'),
    Quaternion  : require('./math/fQuaternion'),


    MatGL        : require('./graphics/gl/fMatGL'),
    ProgLoader   : require('./graphics/gl/shader/fProgLoader'),
    ShaderLoader : require('./graphics/gl/shader/fShaderLoader'),
    CameraBasic  : require('./graphics/fCameraBasic'),

    Light            : require('./graphics/gl/fLight'),
    PointLight       : require('./graphics/gl/fPointLight'),
    DirectionalLight : require('./graphics/gl/fDirectionalLight'),
    SpotLight        : require('./graphics/gl/fSpotLight'),

    Material    : require('./graphics/gl/fMaterial'),
    Texture     : require('./graphics/gl/fTexture'),

    fGLUtil     : require('./graphics/util/fGLUtil'),
    fGL         : require('./graphics/fGL'),

    Mouse       : require('./util/fMouse'),
    Color       : require('./util/fColor'),
    Util        : require('./util/fUtil'),

    Platform    : require('./system/fPlatform'),

    Geom3d            : require('./geom/fGeom3d'),
    ParametricSurface : require('./geom/fParametricSurface'),
    ISOSurface        : require('./geom/fISOSurface'),
    ISOBand           : require('./geom/fISOBand'),
    LineBuffer2d      : require('./geom/fLineBuffer2d'),
    LineBuffer3d      : require('./geom/fLineBuffer3d'),
    Spline            : require('./geom/fSpline'),
    Line2dUtil        : require('./geom/fLine2dUtil'),
    Polygon2dUtil     : require('./geom/fPolygon2dUtil'),


    Application : require('./app/fApplication')

};


},{"./app/fApplication":5,"./geom/fGeom3d":7,"./geom/fISOBand":8,"./geom/fISOSurface":9,"./geom/fLine2dUtil":10,"./geom/fLineBuffer2d":11,"./geom/fLineBuffer3d":12,"./geom/fParametricSurface":13,"./geom/fPolygon2dUtil":14,"./geom/fSpline":15,"./graphics/fCameraBasic":16,"./graphics/fGL":17,"./graphics/gl/fDirectionalLight":18,"./graphics/gl/fLight":19,"./graphics/gl/fMatGL":20,"./graphics/gl/fMaterial":21,"./graphics/gl/fPointLight":22,"./graphics/gl/fSpotLight":23,"./graphics/gl/fTexture":24,"./graphics/gl/shader/fProgLoader":26,"./graphics/gl/shader/fShaderLoader":28,"./graphics/util/fGLUtil":29,"./math/fMat33":30,"./math/fMat44":31,"./math/fMath":32,"./math/fQuaternion":33,"./math/fVec2":34,"./math/fVec3":35,"./math/fVec4":36,"./system/fPlatform":39,"./util/fColor":40,"./util/fMouse":41,"./util/fUtil":42}],7:[function(require,module,exports){
function Geom3d()
{
    this.vertices  = null;
    this.normals   = null;
    this.colors    = null;
    this.indices   = null;
    this.texCoords = null;
}

//TODO merge
Geom3d.prototype.updateVertexNormals = function()
{
    var indices  = this.indices,
        vertices = this.vertices,
        normals  = this.normals;

    var i;
    var a, b, c;
    var e2x, e2y, e2z,
        e1x, e1y, e1z;

    var nx, ny, nz,
        vbx, vby, vbz,
        a0, a1, a2,
        b0, b1, b2,
        c0, c1, c2;

    i = 0;
    while( i < normals.length )
    {
        normals[i] = normals[i+1] = normals[i+2] = 0.0;
        i+=3;
    }

    i = 0;
    while( i < indices.length )
    {
        a = indices[i  ]*3;
        b = indices[i+1]*3;
        c = indices[i+2]*3;

        a0 = a;
        a1 = a+1;
        a2 = a+2;

        b0 = b;
        b1 = b+1;
        b2 = b+2;

        c0 = c;
        c1 = c+1;
        c2 = c+2;

        vbx = vertices[b0];
        vby = vertices[b1];
        vbz = vertices[b2];

        e1x = vertices[a0]-vbx;
        e1y = vertices[a1]-vby;
        e1z = vertices[a2]-vbz;

        e2x = vertices[c0]-vbx;
        e2y = vertices[c1]-vby;
        e2z = vertices[c2]-vbz;

        nx = e1y * e2z - e1z * e2y;
        ny = e1z * e2x - e1x * e2z;
        nz = e1x * e2y - e1y * e2x;

        normals[a0] += nx;
        normals[a1] += ny;
        normals[a2] += nz;

        normals[b0] += nx;
        normals[b1] += ny;
        normals[b2] += nz;

        normals[c0] += nx;
        normals[c1] += ny;
        normals[c2] += nz;

        i+=3;
    }

    var x, y, z, l;

    i = 0;
    while(i < normals.length)
    {

        x = normals[i  ];
        y = normals[i+1];
        z = normals[i+2];

        l = Math.sqrt(x*x+y*y+z*z);
        l = 1 / (l || 1);

        normals[i  ] *= l;
        normals[i+1] *= l;
        normals[i+2] *= l;

        i+=3;
    }

};


Geom3d.prototype.setVertex = function(index,v)
{
    index *= 3;
    var vertices = this.vertices;
    vertices[index  ] = v[0];
    vertices[index+1] = v[1];
    vertices[index+2] = v[2];
};

Geom3d.prototype.setVertex3f = function(index,x,y,z)
{
    index*=3;
    var vertices = this.vertices;
    vertices[index  ] = x;
    vertices[index+1] = y;
    vertices[index+2] = z;
};

Geom3d.prototype.setColor4f = function(index,r,g,b,a)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = r;
    colors[index+1] = g;
    colors[index+2] = b;
    colors[index+3] = a;
};

Geom3d.prototype.setColor3f = function(index,r,g,b)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = r;
    colors[index+1] = g;
    colors[index+2] = b;
};

Geom3d.prototype.setColor2f = function(index,k,a)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = k;
    colors[index+1] = k;
    colors[index+2] = k;
    colors[index+3] = a;
};

Geom3d.prototype.setColor1f = function(index,k)
{
    index *= 4;
    var colors = this.colors;
    colors[index  ] = k;
    colors[index+1] = k;
    colors[index+2] = k;
};

Geom3d.prototype.setColor = function(index,color)
{
    index*=4;
    var colors = this.colors;
    colors[index  ] = color[0];
    colors[index+1] = color[1];
    colors[index+2] = color[2];
    colors[index+3] = color[3];
};

Geom3d.prototype.setTexCoord2f = function(index,u,v)
{
    index*=2;
    var texCoords = this.texCoords;
    texCoords[index  ] = u;
    texCoords[index+1] = v;
};

Geom3d.prototype.setTexCoord = function(index,v)
{
    index*=2;
    var texCoords = this.texCoords;
    texCoords[index  ] = v[0];
    texCoords[index+1] = v[1];
};


Geom3d.prototype._draw = function(gl)
{
    gl.drawElements(this.vertices,this.normals,this.colors,this.texCoords,this.indices,gl._drawMode);
};

module.exports = Geom3d;
},{}],8:[function(require,module,exports){
var Geom3d = require('./fGeom3d');

function ISOBand(sizeX,sizeZ,unitScaleX,unitScaleZ)
{
    this._vertSizeX  = null;
    this._vertSizeZ  = null;
    this._unitScaleX = 1;
    this._unitScaleZ = 1;

    switch(arguments.length)
    {
        case 1:
            this._vertSizeX = this._vertSizeZ = arguments[0];
            break;
        case 2:
            this._vertSizeX = arguments[0];
            this._vertSizeZ = arguments[1];
            break;
        case 3:
            this._vertSizeX = arguments[0];
            this._vertSizeZ = arguments[1];
            this._unitScaleX = this._unitScaleZ = arguments[2];
            break;
        case 4:
            this._vertSizeX  = arguments[0];
            this._vertSizeZ  = arguments[1];
            this._unitScaleX = arguments[2];
            this._unitScaleZ = arguments[3];
            break;
        default :
            this._vertSizeX = this._vertSizeZ = 3;
            break;
    }

    /*---------------------------------------------------------------------------------------------------------*/


    this._cellSizeX = this._vertSizeX - 1;
    this._cellSizeZ = this._vertSizeZ - 1;

    this._func     = function(x,y,arg0,arg1,arg2){return 0;};
    this._funcArg0 = 0;
    this._funcArg1 = 0;
    this._funcArg2 = 0;
    this._isoLevel = 0;

    this._interpolateValues = true;

    this._numTriangles = 0;

    //TODO CHECK MAX ELEMENT EXCEED
    this._verts = new Float32Array(this._vertSizeX * this._vertSizeZ * 4); // grid calculated norm values + function result value ...,x,y,z,v,...
    this._cells = new Array(this._cellSizeX * this._cellSizeZ);

    this._edges = new Float32Array((this._cellSizeZ * this._cellSizeX * 2 +
                                    this._cellSizeZ + this._cellSizeX) * 3);


    this._tempCellVerticesVals = new Float32Array(4);

    this._indices = [];

    /*
    //temp TODO remove
    this.__appUintTypeEnabled = Foam.Application.getInstance().gl.isUIntElementTypeAvailable();
    */

    /*---------------------------------------------------------------------------------------------------------*/

    this._genSurface();
}

/*---------------------------------------------------------------------------------------------------------*/

ISOBand.prototype = Object.create(Geom3d.prototype);

/*---------------------------------------------------------------------------------------------------------*/


//dont need this
ISOBand.prototype.setFunction = function(func,isoLevel)
{
    var funcArgsLength = func.length;

    if(funcArgsLength < 2)throw 'Function should satisfy function(x,y){}';
    if(funcArgsLength > 5)throw 'Function has to many arguments. Arguments length should not exceed 5. E.g function(x,y,arg0,arg1,arg2).';

    var funcString = func.toString(),
        funcArgs   = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).split(','),
        funcBody   = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));

    this._func     = new Function(funcArgs[0], funcArgs[1],
        funcArgs[2] || 'arg0', funcArgs[3] || 'arg1', funcArgs[4] || 'arg2',
        funcBody);
    this._isoLevel = isoLevel || 0;


};

/*---------------------------------------------------------------------------------------------------------*/
// Setup points
/*---------------------------------------------------------------------------------------------------------*/

ISOBand.prototype._genSurface = function()
{
    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var cellSizeX = this._cellSizeX,
        cellSizeZ = this._cellSizeZ;

    var scaleX = this._unitScaleX,
        scaleZ = this._unitScaleZ;

    var verts = this._verts,
        vertsIndex,
        vertsIndexRowNext,
        cells = this._cells,
        cellsIndex;

    var i,j;

    i = -1;
    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeX)
        {
            vertsIndex          = (vertSizeX * i + j)*4;
            verts[vertsIndex  ] = (-0.5 + (j/(vertSizeX - 1))) * scaleX;
            verts[vertsIndex+1] = 0;
            verts[vertsIndex+2] = (-0.5 + (i/(vertSizeZ - 1))) * scaleZ;
            verts[vertsIndex+3] = -1;

            if(i < cellSizeZ && j < cellSizeX)
            {
                vertsIndexRowNext = (vertSizeX * i + j + vertSizeX) * 4;

                cellsIndex        = cellSizeX * i + j;
                cells[cellsIndex] = [vertsIndex,
                                     vertsIndex + 4,
                                     vertsIndexRowNext + 4,
                                     vertsIndexRowNext ];

            }
        }
    }
};

/*---------------------------------------------------------------------------------------------------------*/
// apply function to data points
/*---------------------------------------------------------------------------------------------------------*/

ISOBand.prototype.applyFunction = function(arg0,arg1,arg2)
{
    var verts = this._verts,
        vertsIndex;

    var vertSizeX = this._vertSizeX,
        vertSizeZ = this._vertSizeZ;

    var i, j;

    i = -1;
    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeX)
        {
            vertsIndex = (vertSizeX * i + j) * 4;
            verts[vertsIndex + 3] = this._func(verts[vertsIndex],verts[vertsIndex+2],arg0,arg1,arg2);
        }
    }

    this.march();
};

ISOBand.prototype.applyFunctionMult = function(arg0,arg1,arg2)
{
    var verts = this._verts,
        vertsIndex;

    var vertsSizeX = this._vertSizeX,
        vertsSizeZ = this._vertSizeZ;

    var i, j;

    i = -1;
    while(++i < vertsSizeZ)
    {
        j = -1;
        while(++j < vertsSizeX)
        {
            vertsIndex = (vertsSizeX * i + j) * 4;
            verts[vertsIndex + 3] *= this._func(verts[vertsIndex],verts[vertsIndex+2],arg0,arg1,arg2);
        }
    }

    this.march();
};

ISOBand.prototype.setData = function(data,width,height)
{

    var vertsSizeX = this._vertSizeX,
        vertsSizeZ = this._vertSizeZ;

    if(width > vertsSizeZ || height > vertsSizeX)
        throw 'Data exceeds buffer size. Should not exceed ' + vertsSizeZ + ' in width and ' + vertsSizeX + ' in height';

    var verts = this._verts;

    var i ,j;
    i = -1;
    while(++i < width)
    {
        j = -1;
        while(++j < height)
        {
            verts[(height * i + j) * 4 + 3] = data[height * i + j];
        }
    }
};



/*---------------------------------------------------------------------------------------------------------*/
// march
/*---------------------------------------------------------------------------------------------------------*/

ISOBand.prototype.march = function()
{
    //reset indices
    var indices = this._indices = [];

    var verts = this._verts;

    var i, j, k;

    var cells    = this._cells,
        indices  = this._indices;

    var cellSizeX = this._cellSizeX,
        cellSizeZ = this._cellSizeZ;

    var cellIndex,
        cell,
        cellState;

    //Cell vertex indices in global vertices
    var v0Index,  // 0 1
        v1Index,  // 3 2
        v2Index,
        v3Index;

    //Cell vertex values ...,x,y,z,VALUE,...
    var vVals = this._tempCellVerticesVals,
        v0Val,v1Val,v2Val,v3Val;

    //Topologic entry / lookup
    var entryTopLu,
        ISOBAND_TOP_LU     = ISOBand.TOP_TABLE;

    var entryTopLu0,
        entryTopLu1,
        entryTopLu2,
        entryTopLu3;

    var edgeIndexTop,
        edgeIndexRight,
        edgeIndexBottom,
        edgeIndexLeft,
        edgeIndexTemp;

    var edges = this._edges;


    //
    //  0 ------- 1
    //  |    0    |
    //  | 1       | 2
    //  |         |
    //  3 ------- 2
    //       3


    i = -1;
    while(++i < cellSizeZ)
    {
        j = -1;
        while(++j < cellSizeX)
        {
            cellIndex        = cellSizeX * i + j;
            cell             = cells[cellIndex];

            v0Index = cell[0];
            v1Index = cell[1];
            v2Index = cell[2];
            v3Index = cell[3];

            v0Val = vVals[0] = verts[v0Index + 3];
            v1Val = vVals[1] = verts[v1Index + 3];
            v2Val = vVals[2] = verts[v2Index + 3];
            v3Val = vVals[3] = verts[v3Index + 3];

            cellState = (v0Val > 0) << 3 |
                        (v1Val > 0) << 2 |
                        (v2Val > 0) << 1 |
                        (v3Val > 0);

            if(cellState == 0)continue;

            edgeIndexTop    = cellIndex + (cellSizeX + 1) * i;
            edgeIndexRight  = edgeIndexTop   + cellSizeX + 1;
            edgeIndexBottom = edgeIndexRight + cellSizeX;
            edgeIndexLeft   = edgeIndexRight - 1;

            entryTopLu = ISOBAND_TOP_LU[cellState];

            //cell upper left
            k = 0;
            if(i == 0 && j == 0)
            {

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //get edge vertex 0 according to topological entry
                    //TODO collapse
                    edgeIndexTemp = entryTopLu0 == 0 ? edgeIndexTop :
                                    entryTopLu0 == 1 ? edgeIndexRight :
                                    entryTopLu0 == 2 ? edgeIndexBottom :
                                    edgeIndexLeft;

                    this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndexTemp * 3);
                    indices.push(edgeIndexTemp);

                    //get edge vertex 1 according to topological entry
                    //TODO collapse
                    edgeIndexTemp = entryTopLu2 == 0 ? edgeIndexTop :
                                    entryTopLu2 == 1 ? edgeIndexRight :
                                    entryTopLu2 == 2 ? edgeIndexBottom :
                                    edgeIndexLeft;

                    this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndexTemp * 3);
                    indices.push(edgeIndexTemp);

                    k += 4;
                }
            }

            //cells first row after upper left
            //TODO collapse
            if(i == 0 && j > 0)
            {

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check if edge is on adjacent left side, and push index of edge,
                    //if not, calculate edge, push index of new edge


                    //check first vertex is on left edge
                    if(entryTopLu0 == 3)
                    {
                        //assign previous calculated edge vertex from previous cell
                        indices.push(edgeIndexLeft);

                    }
                    else //calculate edge vertex
                    {
                        edgeIndexTemp = entryTopLu0 == 0 ? edgeIndexTop :
                                        entryTopLu0 == 1 ? edgeIndexRight :
                                        edgeIndexBottom;

                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndexTemp * 3);
                        indices.push(edgeIndexTemp);
                    }

                    //check second vertex is on left edge

                    if(entryTopLu2 == 3)
                    {
                        indices.push(edgeIndexLeft);
                    }
                    else //calculate edge vertex
                    {
                        edgeIndexTemp = entryTopLu2 == 0 ? edgeIndexTop :
                                        entryTopLu2 == 1 ? edgeIndexRight :
                                        edgeIndexBottom;

                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndexTemp * 3);
                        indices.push(edgeIndexTemp);
                    }


                    k += 4;
                }
            }

            //cells first column after upper left
            //TODO collapse
            if(i != 0 && j == 0)
            {

                while(k < entryTopLu.length)
                {

                    //check if edge is on adjacent top side, and push index of edge,
                    //if not, calculate edge, push index of new edge

                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on top edge
                    if(entryTopLu0 == 0)
                    {
                        indices.push(edgeIndexTop);
                    }
                    else
                    {
                        edgeIndexTemp = entryTopLu0 == 1 ? edgeIndexRight :
                                        entryTopLu0 == 2 ? edgeIndexBottom :
                                        edgeIndexLeft;

                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndexTemp * 3);
                        indices.push(edgeIndexTemp)
                    }

                    //check first vertex is on top edge
                    if(entryTopLu2 == 0)
                    {
                        indices.push(edgeIndexTop);
                    }
                    else
                    {
                        edgeIndexTemp = entryTopLu2 == 1 ? edgeIndexRight :
                                        entryTopLu2 == 2 ? edgeIndexBottom :
                                        edgeIndexLeft;

                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndexTemp * 3);
                        indices.push(edgeIndexTemp)
                    }

                    k += 4;
                }

            }

            //check all other cells
            //TODO collapse
            if(i != 0 && j != 0)
            {

                //check if edge is on adjacent left side, and push index of edge,
                //if not, calculate edge, push index of new edge

                while(k < entryTopLu.length)
                {
                    entryTopLu0 = entryTopLu[k  ];
                    entryTopLu1 = entryTopLu[k+1];
                    entryTopLu2 = entryTopLu[k+2];
                    entryTopLu3 = entryTopLu[k+3];

                    //check first vertex is on left edge
                    if(entryTopLu0 == 3)
                    {
                        indices.push(edgeIndexLeft);
                    }
                    else if(entryTopLu0 == 0)//maybe upper cell?
                    {
                        indices.push(edgeIndexTop);
                    }
                    else //calculate edge vertex
                    {
                        edgeIndexTemp = entryTopLu0 == 1 ? edgeIndexRight : edgeIndexBottom;

                        this._intrpl(cell[entryTopLu0],cell[entryTopLu1],edges,edgeIndexTemp * 3);
                        indices.push(edgeIndexTemp);
                    }

                    //check second vertex is on left edge
                    if(entryTopLu2 == 3)
                    {
                        indices.push(edgeIndexLeft);
                    }
                    else if(entryTopLu2 == 0)//maybe upper cell?
                    {
                        indices.push(edgeIndexTop);
                    }
                    else //calculate edge vertex
                    {
                        edgeIndexTemp = entryTopLu2 == 1 ? edgeIndexRight : edgeIndexBottom;

                        this._intrpl(cell[entryTopLu2],cell[entryTopLu3],edges,edgeIndexTemp * 3);
                        indices.push(edgeIndexTemp);
                    }


                    k += 4;
                }
            }
        }
    }

    //temp
    this._indices = this.__appUintTypeEnabled ?  new Uint32Array(indices) :  new Uint16Array(indices);
};

//visual debug need isoline/isoband switch
ISOBand.prototype._draw = function(gl)
{
    var edges   = this._edges,
        colors  = gl.bufferColors(gl.getColorBuffer(),new Float32Array(edges.length/3*4)),
        indices =  this._indices;

     gl.drawElements(edges,null,colors,null,indices,gl.getDrawMode(),indices.length,0,gl.UNSIGNED_SHORT);
};


ISOBand.prototype._intrpl = function(index0,index1,out,offset)
{
    var verts = this._verts;

    var v0x = verts[index0  ],
        v0y = verts[index0+1],
        v0z = verts[index0+2],
        v0v = verts[index0+3];

    var v1x = verts[index1  ],
        v1y = verts[index1+1],
        v1z = verts[index1+2],
        v1v = verts[index1+3];


    if(v0v == 0)
    {
        out[offset+0] = v1x;
        out[offset+1] = v1y;
        out[offset+2] = v1z;

        return;
    }
    else if(v1v == 0)
    {
        out[offset+0] = v0x;
        out[offset+1] = v0y;
        out[offset+2] = v0z;

        return;
    }


    if(this._interpolateValues)
    {
        var v10v = v1v - v0v;

        out[offset+0] = -v0v * (v1x - v0x) / v10v + v0x;
        out[offset+1] = -v0v * (v1y - v0y) / v10v + v0y;
        out[offset+2] = -v0v * (v1z - v0z) / v10v + v0z;
    }
    else
    {
        out[offset+0] =  (v1x - v0x) * 0.5 + v0x;
        out[offset+1] =  (v1y - v0y) * 0.5 + v0y;
        out[offset+2] =  (v1z - v0z) * 0.5 + v0z;
    }
};


ISOBand.prototype.getVertices      = function(){return this._verts;};
ISOBand.prototype.getVerticesSizeX = function(){return this._vertSizeX;};
ISOBand.prototype.getVerticesSizeZ = function(){return this._vertSizeZ;};
ISOBand.prototype.getCells         = function(){return this._cells;};
ISOBand.prototype.getCellsSizeX    = function(){return this._cellSizeX;};
ISOBand.prototype.getCellsSizeZ    = function(){return this._cellSizeZ;};
ISOBand.prototype.getEdges         = function(){return this._edges;};
ISOBand.prototype.getIndices       = function(){return this._indices;};

/*---------------------------------------------------------------------------------------------------------*/
// TOPOLOGICAL
/*---------------------------------------------------------------------------------------------------------*/

//TODO merge
ISOBand.TOP_TABLE =
    [
        [],
        [ 2, 3, 3, 0],
        [ 1, 2, 2, 3],
        [ 1, 2, 3, 0],
        [ 0, 1, 1, 2],
        [ 0, 1, 1, 2, 2, 3, 3, 0],
        [ 0, 1, 2, 3],
        [ 0, 1, 3, 0],
        [ 0, 1, 3, 0],
        [ 0, 1, 2, 3],
        [ 0, 1, 1, 2, 2, 3, 3, 0],
        [ 0, 1, 1, 2],
        [ 1, 2, 3, 0],
        [ 1, 2, 2, 3],
        [ 2, 3, 3, 0],
        []
    ];

/*---------------------------------------------------------------------------------------------------------*/
// TRIANGE
/*---------------------------------------------------------------------------------------------------------*/

//TODO merge
ISOBand.TRI_TABLE =
    [
        [],
        [ 1, 0, 0, 3, 1, 1],
        [ 1, 0, 0, 2, 1, 1],
        [ 1, 0, 0, 2, 0, 3, 0, 3, 1, 1 ,1 ,0 ],
        [ 1, 0, 0, 1, 1, 1],
        [ 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1, 2, 0, 3, 1, 3, 1, 3, 1, 0, 1, 1],
        [ 1, 0, 0, 1, 1, 1, 0, 1, 0, 2, 1, 1],
        [ 1, 0, 0, 1, 0, 2, 0, 2, 1, 1, 1, 0, 0, 2, 0, 3, 1, 1 ],
        [ 0, 0, 1, 0, 1, 1],
        [ 0, 0, 1, 0, 0, 3, 1, 0, 1, 1, 0, 3],
        [ 0, 0, 1, 0, 1, 3, 1, 0, 1, 1, 1, 3, 1, 1, 0, 2, 1, 2, 1, 2, 1, 3, 1, 1 ],
        [ 0, 0, 1, 0, 0, 3, 1, 0, 1, 1, 0, 3, 1, 1, 0, 2, 0, 3],
        [ 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
        [ 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 3, 0, 0],
        [ 0, 0, 0, 1, 1, 1, 0, 1, 0, 2, 1, 0, 1, 0, 1, 1, 0, 1],
        [ 0, 0, 0, 1, 0, 3, 0, 1, 0, 2, 0, 3]
    ];


module.exports = ISOBand;

},{"./fGeom3d":7}],9:[function(require,module,exports){
var Vec3   = require('../math/fVec3'),
    Vec4   = require('../math/fVec4'),
    Geom3d = require('./fGeom3d');


//This is just an initial version
function ISOSurface(sizeX,sizeY,sizeZ)
{
    this._vertSizeX = null;
    this._vertSizeY = null;
    this._vertSizeZ = null;

    switch(arguments.length)
    {
        case 1:
            this._vertSizeX = this._vertSizeY = this._vertSizeZ = arguments[0];
            break;
        case 3:
            this._vertSizeX = arguments[0];
            this._vertSizeY = arguments[1];
            this._vertSizeZ = arguments[2];
            break;
        default :
            this._vertSizeX = this._vertSizeY = this._vertSizeZ = 3;
            break;
    }

    this._cubeSizeX = this._vertSizeX - 1;
    this._cubeSizeY = this._vertSizeY - 1;
    this._cubeSizeZ = this._vertSizeZ - 1;

    this._delayedClear = false;

    //TODO:FIX!!
    this._func      = function(x,y,z,arg0,arg1,arg2){return 0;};
    this._funcArg0  = 0;
    this._funcArg1  = 0;
    this._funcArg2  = 0;
    this._isoLevel  = 0;

    //TODO: unroll
    this._verts = new Array(this._vertSizeX*this._vertSizeY*this._vertSizeZ);
    this._cubes = new Array(this._cubeSizeX*this._cubeSizeY*this._cubeSizeZ);

    this._numTriangles = 0;

    var SIZE_OF_TRIANGLE   = 3,
        SIZE_OF_CUBE_EDGES = 12;
    var MAX_BUFFER_LEN     = this._cubes.length * 4;

    this._bVertices = new Float32Array((MAX_BUFFER_LEN)*SIZE_OF_TRIANGLE*Vec3.SIZE);
    this._bNormals  = new Float32Array((MAX_BUFFER_LEN)*SIZE_OF_TRIANGLE*Vec3.SIZE);
    this._bColors   = new Float32Array((MAX_BUFFER_LEN)*SIZE_OF_TRIANGLE*Vec4.SIZE);

    this._tempVertices = new Array(SIZE_OF_CUBE_EDGES*Vec3.SIZE);
    this._tempNormals  = new Array(SIZE_OF_CUBE_EDGES);

    this._scaleXYZ = [1,1,1];

    this._genSurface();

}

ISOSurface.prototype = Object.create(Geom3d.prototype);


/*---------------------------------------------------------------------------------------------------------*/
//
//
//           2 ------- 3    Vertex order
//          /|        /|
//         / |       / |
//        6 ------- 7  |
//        |  0 -----|- 1
//        | /       | /
//        |/        |/
//        4 ------- 5
//
//
//           2 ------> 3    March order
//              \
//                \
//        6 ------> 7
//           0 ------> 1
//             \
//               \
//        4 ------> 5
//
//


ISOSurface.prototype.update = function()
{

    /*---------------------------------------------------------------------------------------------------------*/

    var verts = this._verts;

    var cubeSizeX  = this._cubeSizeX,
        cubeSizeY  = this._cubeSizeY,
        cubeSizeZ  = this._cubeSizeZ,
        cubeSizeZY = cubeSizeZ * cubeSizeY;

    var cubes = this._cubes,
        cube;

    var marchIndex;

    var EDGE_TABLE = ISOSurface.EDGE_TABLE,
        TRI_TABLE  = ISOSurface.TRI_TABLE;

    var v0,v1,v2,v3,v4,v5,v6,v7;
    var val0,val1,val2,val3,val4,val5,val6,val7;

    var cubeIndex;
    var isoLevel = this._isoLevel;
    var bits;

    var bVertices   = this._bVertices,
        bNormals    = this._bNormals,
        bNormalsLen = bNormals.length,
        bVertIndex;

    var vertIndex0, vertIndex1, vertIndex2,
        vertIndex3, vertIndex4, vertIndex5,
        vertIndex6, vertIndex7, vertIndex8;

    var v0x,v0y,v0z,
        v1x,v1y,v1z,
        v2x,v2y,v2z;

    var e2x, e2y, e2z,
        e1x, e1y, e1z;

    var v0Index,
        v1Index,
        v2Index;

    var nx, ny, nz,
        vbx, vby, vbz;


    var i, j, k;

    this._numTriangles = 0;

    /*---------------------------------------------------------------------------------------------------------*/

    i = -1;
    while(++i<bNormalsLen)bNormals[i]=0.0;


    i = -1;
    while(++i < cubeSizeZ)
    {
        j = -1;
        while(++j < cubeSizeY)
        {
            k = -1;
            while(++k < cubeSizeX)
            {
                /*---------------------------------------------------------------------------------------------------------*/

                marchIndex = i * cubeSizeZY + j * cubeSizeZ + k;
                cube       = cubes[marchIndex];

                //access vertices of cube
                v0 = verts[cube[0]];
                v1 = verts[cube[1]];
                v2 = verts[cube[2]];
                v3 = verts[cube[3]];
                v4 = verts[cube[4]];
                v5 = verts[cube[5]];
                v6 = verts[cube[6]];
                v7 = verts[cube[7]];

                val0 = v0[3];
                val1 = v1[3];
                val2 = v2[3];
                val3 = v3[3];
                val4 = v4[3];
                val5 = v5[3];
                val6 = v6[3];
                val7 = v7[3];

                /*---------------------------------------------------------------------------------------------------------*/

                cubeIndex = 0;

                if(val0<isoLevel) cubeIndex |= 1;
                if(val1<isoLevel) cubeIndex |= 2;
                if(val2<isoLevel) cubeIndex |= 8;
                if(val3<isoLevel) cubeIndex |= 4;
                if(val4<isoLevel) cubeIndex |= 16;
                if(val5<isoLevel) cubeIndex |= 32;
                if(val6<isoLevel) cubeIndex |= 128;
                if(val7<isoLevel) cubeIndex |= 64;

                bits = EDGE_TABLE[cubeIndex];

                if(bits === 0)continue;

                /*---------------------------------------------------------------------------------------------------------*/

                var tempVertices = this._tempVertices,
                    tempNormals  = this._tempNormals;

                if (bits & 1)
                {
                    this._intrpl(v0, v1, tempVertices, 0);
                    this._normal(tempVertices,0,tempNormals,0);
                }
                if (bits & 2)
                {
                    this._intrpl(v1, v3, tempVertices, 1);
                    this._normal(tempVertices,1,tempNormals,1);
                }
                if (bits & 4)
                {
                    this._intrpl(v2, v3, tempVertices, 2);
                    this._normal(tempVertices,2,tempNormals,2);
                }
                if (bits & 8)
                {
                    this._intrpl(v0, v2, tempVertices, 3);
                    this._normal(tempVertices,3,tempNormals,3);
                }

                if (bits & 16)
                {
                    this._intrpl(v4, v5, tempVertices, 4);
                    this._normal(tempVertices,4,tempNormals,4);
                }
                if (bits & 32)
                {
                    this._intrpl(v5, v7, tempVertices, 5);
                    this._normal(tempVertices,5,tempNormals,5);
                }
                if (bits & 64)
                {
                    this._intrpl(v6, v7, tempVertices, 6);
                    this._normal(tempVertices,6,tempNormals,6);
                }
                if (bits & 128)
                {
                    this._intrpl(v4, v6, tempVertices, 7);
                    this._normal(tempVertices,7,tempNormals,7);
                }

                if (bits & 256)
                {
                    this._intrpl(v0, v4, tempVertices, 8);
                    this._normal(tempVertices,8,tempNormals,8);
                }
                if (bits & 512)
                {
                    this._intrpl(v1, v5, tempVertices, 9);
                    this._normal(tempVertices,9,tempNormals,9);
                }
                if (bits & 1024)
                {
                    this._intrpl(v3, v7, tempVertices, 10);
                    this._normal(tempVertices,10,tempNormals,10);
                }
                if (bits & 2048)
                {
                    this._intrpl(v2, v6, tempVertices, 11);
                    this._normal(tempVertices,11,tempNormals,11);
                }


                /*---------------------------------------------------------------------------------------------------------*/

                var l = 0;
                cubeIndex <<= 4;


                while(TRI_TABLE[cubeIndex + l] != -1)
                {
                    /*---------------------------------------------------------------------------------------------------------*/

                    //get indices of triangle vertices
                    v0Index = TRI_TABLE[cubeIndex + l    ] * 3;
                    v1Index = TRI_TABLE[cubeIndex + l + 1] * 3;
                    v2Index = TRI_TABLE[cubeIndex + l + 2] * 3;

                    bVertIndex = this._numTriangles * 9;

                    vertIndex0 = bVertIndex;
                    vertIndex1 = bVertIndex+1;
                    vertIndex2 = bVertIndex+2;
                    vertIndex3 = bVertIndex+3;
                    vertIndex4 = bVertIndex+4;
                    vertIndex5 = bVertIndex+5;
                    vertIndex6 = bVertIndex+6;
                    vertIndex7 = bVertIndex+7;
                    vertIndex8 = bVertIndex+8;

                    //store triangle vertices in 'global' vertex buffer + local caching
                    v0x = bVertices[vertIndex0] = tempVertices[v0Index];
                    v0y = bVertices[vertIndex1] = tempVertices[v0Index+1];
                    v0z = bVertices[vertIndex2] = tempVertices[v0Index+2];

                    v1x = bVertices[vertIndex3] = tempVertices[v1Index];
                    v1y = bVertices[vertIndex4] = tempVertices[v1Index+1];
                    v1z = bVertices[vertIndex5] = tempVertices[v1Index+2];

                    v2x = bVertices[vertIndex6] = tempVertices[v2Index];
                    v2y = bVertices[vertIndex7] = tempVertices[v2Index+1];
                    v2z = bVertices[vertIndex8] = tempVertices[v2Index+2];

                    /*---------------------------------------------------------------------------------------------------------*/

                    //calc face normals - per face - naive TODO:FIXME!
                    /*
                    vbx = v1x;
                    vby = v1y;
                    vbz = v1z;

                    e1x = v0x-vbx;
                    e1y = v0y-vby;
                    e1z = v0z-vbz;

                    e2x = v2x-vbx;
                    e2y = v2y-vby;
                    e2z = v2z-vbz;

                    nx = e1y * e2z - e1z * e2y;
                    ny = e1z * e2x - e1x * e2z;
                    nz = e1x * e2y - e1y * e2x;

                    bNormals[vertIndex0] += nx;
                    bNormals[vertIndex1] += ny;
                    bNormals[vertIndex2] += nz;
                    bNormals[vertIndex3] += nx;
                    bNormals[vertIndex4] += ny;
                    bNormals[vertIndex5] += nz;
                    bNormals[vertIndex6] += nx;
                    bNormals[vertIndex7] += ny;
                    bNormals[vertIndex8] += nz;

                    */

                    bNormals[vertIndex0] = tempNormals[v0Index  ];
                    bNormals[vertIndex1] = tempNormals[v0Index+1];
                    bNormals[vertIndex2] = tempNormals[v0Index+2];
                    bNormals[vertIndex3] = tempNormals[v1Index  ];
                    bNormals[vertIndex4] = tempNormals[v1Index+1];
                    bNormals[vertIndex5] = tempNormals[v1Index+2];
                    bNormals[vertIndex6] = tempNormals[v2Index  ];
                    bNormals[vertIndex7] = tempNormals[v2Index+1];
                    bNormals[vertIndex8] = tempNormals[v2Index+2];

                    /*---------------------------------------------------------------------------------------------------------*/

                    l+=3;
                    this._numTriangles++;
                }

                /*---------------------------------------------------------------------------------------------------------*/


            }
        }
    }
};


/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype._intrpl = function(v0,v1,vertList,index)
{
    index *= 3;

    var v0v = v0[3],
        v1v = v1[3];

    var isoLevel = this._isoLevel;

    if(Math.abs(isoLevel - v0v) < 0.00001)
    {
        vertList[index    ] = v0[0];
        vertList[index + 1] = v0[1];
        vertList[index + 2] = v0[2];
        return;
    }

    if(Math.abs(isoLevel - v1v) < 0.00001)
    {
        vertList[index    ] = v1[0];
        vertList[index + 1] = v1[1];
        vertList[index + 2] = v1[2];
        return;
    }

    if(Math.abs(v0v - v1v) < 0.00001)
    {
        vertList[index    ] = v1[0];
        vertList[index + 1] = v1[1];
        vertList[index + 2] = v1[2];
        return;
    }


    var intrpl  = (isoLevel - v0v) / (v1v - v0v);

    var v0x = v0[0],
        v0y = v0[1],
        v0z = v0[2];

    vertList[index    ] = v0x + (v1[0] - v0x) * intrpl;
    vertList[index + 1] = v0y + (v1[1] - v0y) * intrpl;
    vertList[index + 2] = v0z + (v1[2] - v0z) * intrpl;
};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype._normal = function(vertList,vertIndex,normList,normIndex)
{
    vertIndex *= 3;

    var x = vertList[vertIndex   ],
        y = vertList[vertIndex+1],
        z = vertList[vertIndex+2];

    var arg0 = this._funcArg0,
        arg1 = this._funcArg1,
        arg2 = this._funcArg2;

    var eps = 0.0003;

    var val = this._func(x,y,z,arg0,arg1,arg2);

    var nx = this._func(x + eps,y , z, arg0, arg1, arg2) - val,
        ny = this._func(x, y + eps, z, arg0, arg1, arg2) - val,
        nz = this._func(x, y, z + eps, arg0, arg1, arg2) - val,
        d  = 1 / Math.sqrt(nx*nx+ny*ny+nz*nz);


    normIndex *= 3;

    normList[normIndex]   = x*d*-1;
    normList[normIndex+1] = y*d*-1;
    normList[normIndex+2] = z*d*-1;

};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype.setCloseSides = function(bool){}

ISOSurface.prototype.setFunction = function(func,isoLevel)
{
    var funcArgsLength = func.length;

    if(funcArgsLength < 3)throw 'Function should satisfy function(x,y,z){}';
    if(funcArgsLength > 6)throw 'Function has to many arguments. Arguments length should not exceed 6. E.g function(x,y,z,arg0,arg1,arg2).';

    var funcString = func.toString(),
        funcArgs   = funcString.slice(funcString.indexOf('(') + 1, funcString.indexOf(')')).split(','),
        funcBody   = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));

    this._func     = new Function(funcArgs[0], funcArgs[1], funcArgs[2],
                                  funcArgs[3] || 'arg0', funcArgs[4] || 'arg1', funcArgs[5] || 'arg2',
                                  funcBody);
    this._isoLevel = isoLevel || 0;
};

ISOSurface.prototype.setFunctionUnsafe = function(func,isoLevel)
{
    this._func     = func;
    this._isoLevel = isoLevel || 0;
};

ISOSurface.prototype.getFunction = function(){return this._func;};
ISOSurface.prototype.setISOLevel = function(isoLevel){this._isoLevel = isoLevel;};

ISOSurface.prototype.applyFunction   = function()         {this.applyFunction3f(0,0,0);};
ISOSurface.prototype.applyFunction1f = function(arg0)     {this.applyFunction3f(arg0,0,0);};
ISOSurface.prototype.applyFunction2f = function(arg0,arg1){this.applyFunction3f(arg0,arg1,0);};

ISOSurface.prototype.applyFunction3f = function(arg0,arg1,arg2)
{
    var vertSizeX  = this._vertSizeX,
        vertSizeY  = this._vertSizeY,
        vertSizeZ  = this._vertSizeZ,
        vertSizeYX = vertSizeY * vertSizeX;

    var verts = this._verts,
        vert, vertsIndex;

    var i, j, k;

    this._funcArg0 = arg0;
    this._funcArg1 = arg1;
    this._funcArg2 = arg2;

    i = -1;

    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeY)
        {
            k = -1;
            while(++k < vertSizeX)
            {
                vertsIndex = i * vertSizeYX + j * vertSizeX + k;
                vert       = verts[vertsIndex];
                vert[3]    = this._func(vert[0],vert[1],vert[2],arg0,arg1,arg2);
            }
        }
    }
};

/*---------------------------------------------------------------------------------------------------------*/


ISOSurface.prototype._genSurface = function()
{
    var vertSizeX  = this._vertSizeX,
        vertSizeY  = this._vertSizeY,
        vertSizeZ  = this._vertSizeZ,
        vertSizeZY = vertSizeZ * vertSizeY,
        vertSizeXY = vertSizeX * vertSizeY;

    var verts = this._verts,
        vertsIndex;

    var cubeSizeX  = this._cubeSizeX,
        cubeSizeY  = this._cubeSizeY,
        cubeSizeZ  = this._cubeSizeZ,
        cubeSizeZY = cubeSizeY * cubeSizeZ;

    var cubes = this._cubes,
        cellsIndex;

    var scaleXYZ = this._scaleXYZ;

    var i, j, k;

    i = -1;

    while(++i < vertSizeZ)
    {
        j = -1;
        while(++j < vertSizeY)
        {
            k = -1;
            while(++k < vertSizeX)
            {
                vertsIndex        = i * vertSizeZY + j * vertSizeZ + k;

                verts[vertsIndex] = [(-0.5 + ( k / (vertSizeX - 1))) * scaleXYZ[0],
                                     (-0.5 + ( j / (vertSizeY - 1))) * scaleXYZ[1],
                                     (-0.5 + ( i / (vertSizeZ - 1))) * scaleXYZ[2],
                    -1];


                if(i < cubeSizeX && j < cubeSizeY && k  < cubeSizeZ)
                {
                    cellsIndex = i * cubeSizeZY + j * cubeSizeX + k;

                    cubes[cellsIndex] = [
                        vertsIndex,
                        vertsIndex + 1,
                        vertsIndex + vertSizeZ,
                        vertsIndex + vertSizeZ + 1,

                        vertsIndex + vertSizeXY,
                        vertsIndex + vertSizeXY + 1,
                        vertsIndex + vertSizeZ + vertSizeXY,
                        vertsIndex + vertSizeZ + vertSizeXY + 1
                    ];

                }
            }
        }
    }

};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.prototype._draw = function(gl)
{
    gl.disableDefaultTexCoordsAttribArray();
    gl.enableDefaultNormalAttribArray();

    var _gl = gl.gl;

    var glArrayBuffer = _gl.ARRAY_BUFFER,
        glFloat       = _gl.FLOAT;

    var vertices = this._bVertices,
        normals  = this._bNormals,
        colors   = this._bColors;

    var vblen = vertices.byteLength,
        nblen = normals.byteLength,
        cblen = colors.byteLength;

    var offsetV = 0,
        offsetN = offsetV + vblen,
        offsetC = offsetN + nblen;

    _gl.bufferData(glArrayBuffer, vblen + nblen + cblen, _gl.DYNAMIC_DRAW);

    _gl.bufferSubData(glArrayBuffer, offsetV,  vertices);
    _gl.bufferSubData(glArrayBuffer, offsetN,  normals);
    _gl.bufferSubData(glArrayBuffer, offsetC,  colors);

    _gl.vertexAttribPointer(gl.getDefaultVertexAttrib(), 3, glFloat, false, 0, offsetV);
    _gl.vertexAttribPointer(gl.getDefaultNormalAttrib(), 3, glFloat, false, 0, offsetN);
    _gl.vertexAttribPointer(gl.getDefaultColorAttrib(),  4, glFloat, false, 0, offsetC);

    gl.setMatricesUniform();
    _gl.drawArrays(_gl.TRIANGLES,0,this._numTriangles * 3);
};

/*---------------------------------------------------------------------------------------------------------*/

ISOSurface.EDGE_TABLE = new Int32Array(
    [
        0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
        0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
        0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
        0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
        0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
        0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
        0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
        0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
        0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
        0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
        0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
        0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
        0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
        0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
        0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
        0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
        0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
        0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
        0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
        0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
        0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
        0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
        0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
        0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
        0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
        0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
        0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
        0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
        0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
        0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
        0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
        0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0
    ]);

ISOSurface.TRI_TABLE = new Int32Array(
    [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
        3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
        3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
        3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
        9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
        9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
        2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
        8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
        9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
        4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
        3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
        1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
        4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
        4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
        5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
        2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
        9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
        0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
        2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
        10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
        5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
        5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
        9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
        0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
        1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
        10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
        8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
        2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
        7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
        2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
        11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
        5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
        11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
        11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
        1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
        9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
        5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
        2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
        5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
        6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
        3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
        6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
        5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
        1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
        10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
        6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
        8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
        7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
        3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
        5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
        0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
        9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
        8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
        5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
        0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
        6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
        10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
        10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
        8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
        1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
        0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
        10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
        3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
        6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
        9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
        8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
        3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
        6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
        0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
        10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
        10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
        2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
        7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
        7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
        2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
        1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
        11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
        8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
        0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
        7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
        10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
        2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
        6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
        7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
        2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
        1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
        10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
        10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
        0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
        7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
        6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
        8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
        9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
        6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
        4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
        10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
        8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
        0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
        1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
        8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
        10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
        4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
        10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
        5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
        11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
        9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
        6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
        7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
        3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
        7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
        9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
        3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
        6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
        9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
        1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
        4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
        7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
        6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
        3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
        0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
        6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
        0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
        11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
        6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
        5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
        9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
        1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
        1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
        10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
        0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
        5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
        10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
        11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
        9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
        7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
        2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
        8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
        9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
        9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
        1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
        9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
        9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
        5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
        0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
        10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
        2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
        0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
        0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
        9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
        5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
        3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
        5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
        8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
        0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
        9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
        0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
        1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
        3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
        4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
        9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
        11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
        11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
        2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
        9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
        3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
        1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
        4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
        4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
        3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
        3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
        0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
        9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
        1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    ]);

module.exports = ISOSurface;
},{"../math/fVec3":35,"../math/fVec4":36,"./fGeom3d":7}],10:[function(require,module,exports){

module.exports =
{

    //TODO: clean up

    isPointLeft : function(x0,y0,x1,y1,x2,y2)
    {
        return ( x1 - x0 ) * ( y2 - y0 ) - (x2 - x0) * (y1 - y0);
    },

    //http://alienryderflex.com/intersect/
    isIntersectionf : function(ax,ay,bx,by,cx,cy,dx,dy,out)
    {
        var distAB,
            cos,
            sin,
            newX,
            posab;

        if (ax == bx && ay == by ||
            cx == dx && cy == dy)
            return false;

        bx -= ax;
        by -= ay;
        cx -= ax;
        cy -= ay;
        dx -= ax;
        dy -= ay;

        distAB = 1 / (Math.sqrt(bx*bx+by*by) || 1);

        cos  = bx * distAB;
        sin  = by * distAB;
        newX = cx * cos + cy * sin;
        cy   = cy * cos - cx * sin;
        cx   = newX;
        newX = dx * cos + dy * sin;
        dy   = dy * cos - dx * sin;
        dx   = newX;

        if (cy == dy) return false;

        posab  = dx + ( cx - dx ) * dy / ( dy - cy );

        if(out)
        {
            out[0] = ax + posab * cos;
            out[1] = ay + posab * sin;
        }

        return true;
    },

    isIntersection : function(l0,l1,out)
    {
        return this.isIntersectionf(l0[0],l0[1],l0[2],l0[3],l1[0],l0[1],l1[2],l1[3],out);
    } ,

    isSegmentIntersectionf : function(ax,ay,bx,by,cx,cy,dx,dy,out)
    {
        var distab,
            cos,
            sin,
            newX,
            posab;

        if (ax == bx && ay == by ||
            cx == dx && cy == dy)
            return false;

        if (ax==cx && ay==cy || bx==cx && by==cy
            ||  ax==dx && ay==dy || bx==dx && by==dy) {
            return false; }

        bx -= ax;
        by -= ay;
        cx -= ax;
        cy -= ay;
        dx -= ax;
        dy -= ay;

        distab= Math.sqrt(bx*bx+by*by);

        cos  = bx / distab;
        sin  = by / distab;
        newX = cx * cos + cy * sin;
        cy   = cy * cos - cx * sin;
        cx   = newX;
        newX = dx * cos + dy * sin;
        dy   = dy * cos - dx * sin;
        dx   = newX;

        if(cy < 0.0 && dy < 0.0 || cy >= 0.0 && dy >= 0.0)return false;

        posab  = dx + ( cx - dx ) * dy / ( dy - cy );

        if(posab < 0.0 || posab > distab)return false;

        if(out)
        {
            out[0] = ax + posab * cos;
            out[1] = ay + posab * sin;
        }

        return true;
    }


};
},{}],11:[function(require,module,exports){



function LineBuffer2d(kgl,size)
{
    this._gl      = kgl;

    this._vbo     = null;
    this.vertices = null;
    this.colors   = null;

    this._vertIndex = 0;
    this._colIndex  = 0;

    if(size)this.allocate(size);
}

/*---------------------------------------------------------------------------------------------------------*/

//probably shouldnt do this
LineBuffer2d.prototype.bind   = function()
{
    var kgl = this._gl,
        gl    = kgl.gl;

    kgl.disableDefaultNormalAttribArray();
    kgl.disableDefaultTexCoordsAttribArray();
    gl.bindBuffer(gl.ARRAY_BUFFER,this._vbo);
};

LineBuffer2d.prototype.unbind = function()
{
    var kgl = this._gl;

    kgl.enableDefaultNormalAttribArray();
    kgl.enableDefaultTexCoordsAttribArray();
    kgl.bindDefaultVBO();
};

LineBuffer2d.prototype.pushVertex3f = function(x,y,z)
{
    var vertices = this.vertices;

    //if(this._safeAllocate && this._vertIndex > vertices.length - 3)this.allocate(vertices.length * 1.1);

    vertices[this._vertIndex++] = x;
    vertices[this._vertIndex++] = y;
    vertices[this._vertIndex++] = z;
};

LineBuffer2d.prototype.pushColor4f = function(r,g,b,a)
{
    var colors = this.colors;

    colors[this._colIndex++] = r;
    colors[this._colIndex++] = g;
    colors[this._colIndex++] = b;
    colors[this._colIndex++] = a;
};

LineBuffer2d.prototype.setVertex3f = function(x,y,z,index3)
{
    index3*=3;
    var vertices = this.vertices;

    vertices[index3  ] = x;
    vertices[index3+1] = y;
    vertices[index3+2] = z;
};

LineBuffer2d.prototype.setColor4f = function(r,g,b,a,index4)
{
    index4*=4;
    var colors = this.colors;

    colors[index4  ] = r;
    colors[index4+1] = g;
    colors[index4+2] = b;
    colors[index4+3] = a;
};

LineBuffer2d.prototype.pushVertex    = function(v){this.pushVertex3f(v[0],v[1],v[2]);};
LineBuffer2d.prototype.pushColor     = function(c){this.pushColor4f(c[0],c[1],c[2],c[3]);};
LineBuffer2d.prototype.setVertex     = function(v,index){this.setVertex3f(v[0],v[1],v[2],index);};
LineBuffer2d.prototype.setColor      = function(c,index){this.setColor4f(c[0],c[1],c[2],c[3],index);};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer2d.prototype.buffer = function()
{
    var glkl          = this._gl,
        gl            = glkl.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;



    var vblen = this.vertices.byteLength,
        cblen = this.colors.byteLength;

    var offsetV = 0,
        offsetC = offsetV + vblen;

    gl.bufferData(glArrayBuffer,vblen + cblen, gl.DYNAMIC_DRAW);
    gl.bufferSubData(glArrayBuffer,offsetV,this.vertices);
    gl.bufferSubData(glArrayBuffer,offsetC,this.colors);
    gl.vertexAttribPointer(glkl.getDefaultVertexAttrib(),glkl.SIZE_OF_VERTEX,glFloat,false,0,offsetV);
    gl.vertexAttribPointer(glkl.getDefaultColorAttrib(), glkl.SIZE_OF_COLOR, glFloat,false,0,offsetC);
};

LineBuffer2d.prototype.draw = function(first,count)
{
    var kgl = this._gl,
        gl    = kgl.gl;

   kgl.setMatricesUniform();
   gl.drawArrays(kgl.getDrawMode(),
                 first || 0,
                 count || this.vertices.length / kgl.SIZE_OF_VERTEX);
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer2d.prototype.reset = function()
{
    this._vertIndex = 0;
    this._colIndex  = 0;
};

LineBuffer2d.prototype.dispose  = function()
{
    this._gl.gl.deleteBuffer(this._vbo);
    this.vertices = null;
    this.colors   = null;
    this.reset();
};

LineBuffer2d.prototype.allocate = function(size)
{
    var kgl = this._gl,
        gl    = kgl.gl;

    //need to deleteBuffer, instead of reusing it, otherwise error, hm
    if(this._vbo){gl.deleteBuffer(this._vbo);}this._vbo = gl.createBuffer();
    this.vertices = this.vertices || new Float32Array(0);
    this.colors   = this.colors   || new Float32Array(0);

    var vertLen = this.vertices.length,
        colsLen = this.colors.length;

    if(vertLen < size)
    {
        var temp;

        temp = new Float32Array(size);
        temp.set(this.vertices);
        temp.set(new Float32Array(temp.length - vertLen),vertLen);
        this.vertices = temp;

        temp = new Float32Array(size / 3 * 4);
        temp.set(this.colors);
        temp.set(new Float32Array(temp.length - colsLen),colsLen);
        this.colors = temp;
  }
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer2d.prototype.getSizeAllocated = function(){return this.vertices.length;};
LineBuffer2d.prototype.getSizePushed    = function(){return this._vertIndex;};

module.exports = LineBuffer2d;


},{}],12:[function(require,module,exports){
var Geom3d = require('./fGeom3d'),
    Mat44  = require('../math/fMat44'),
    Vec3   = require('../math/fVec3');

//TODO:
//Fix shared normals on caps
//


LineBuffer3d = function(points,numSegments,diameter,sliceSegmentFunc,closed)
{
    Geom3d.apply(this,arguments);

    numSegments = numSegments || 10;
    diameter    = diameter    || 0.25;

    this._closedCaps   = (typeof closed === 'undefined') ? true : closed;
    this._numSegments  = numSegments;

    //caches vertices transformed by slicesegfunc for diameter scaling
    //...,vnorm0x,vnorm0y,vnorm0z,vnorm0xScaled,,vnorm0yScaled,vnorm0zScaled,...
    this._verticesNorm = null;
    this.points        = null;

    this._sliceSegFunc = sliceSegmentFunc ||
                        (function(i,j,numPoints,numSegments)
                         {
                             var step  = Math.PI * 2 / numSegments,
                                 angle = step * j;

                             return [Math.cos(angle),Math.sin(angle)];
                         });

    this._initDiameter = diameter;

    this._tempVec0 = Vec3.make();
    this._bPoint0  = Vec3.make();
    this._bPoint1  = Vec3.make();
    this._bPoint01 = Vec3.make();
    this._axisY    = Vec3.AXIS_Y();

    /*---------------------------------------------------------------------------------------------------------*/

    if(points)this.setPoints(points);

};

LineBuffer3d.prototype = Object.create(Geom3d.prototype);

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.setPoints = function(arr)
{
    this.points = new Float32Array(arr);

    if(!(this.vertices && this.vertices.length == arr.length))
    {
        var numSegments = this._numSegments,
            numPoints   = this._numPoints = arr.length / 3;
        var len         = numPoints * numSegments * 3;

        this._verticesNorm = new Float32Array(len * 2);
        this.vertices      = new Float32Array(len);
        this.normals       = new Float32Array(len);
        this.colors        = new Float32Array(len / 3 * 4);

        this.setNumSegments(numSegments);
    }
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.applySliceSegmentFunc = function(func,baseDiameter)
{
    baseDiameter = baseDiameter || 0.25;

    var numPoints    = this._numPoints,
        numSegments  = this._numSegments,
        verticesNorm = this._verticesNorm;

    var funcRes;

    var index;
    var i, j, k;

    i = -1;
    while(++i < numPoints)
    {
        j = -1;
        index = i * numSegments;

        while(++j < numSegments)
        {
            k    = (index + j) * 3 * 2;

            funcRes = func(i,j,numPoints,numSegments);

            verticesNorm[k+0] = funcRes[0];
            verticesNorm[k+2] = funcRes[1];

            verticesNorm[k+3] = verticesNorm[k+0] * baseDiameter;
            verticesNorm[k+5] = verticesNorm[k+2] * baseDiameter;
        }
    }

    this._sliceSegFunc = func;

};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.setPoint3f = function(index,x,y,z)
{
    index *= 3;

    var points = this.points;

    points[index  ] = x;
    points[index+1] = y;
    points[index+2] = z;
};

LineBuffer3d.prototype.setPoint = function(index,v)
{
    index *= 3;

    var points = this.points;

    points[index  ] = v[0];
    points[index+1] = v[1];
    points[index+2] = v[2];
};

LineBuffer3d.prototype.getPoint = function(index,out)
{
    out    = out || this._tempVec0;
    index *= 3;

    var points = this.points;

    out[0] = points[index  ];
    out[1] = points[index+1];
    out[2] = points[index+2];

    return out;
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.setUnitDiameter = function(value)
{
    var numSegments  = this._numSegments,
        verticesNorm = this._verticesNorm;

    var offset = numSegments * 3 * 2;

    var i = 0,
        l = this._numPoints * offset;

    while(i < l)
    {
        verticesNorm[i + 3] = verticesNorm[i + 0] * value;
        verticesNorm[i + 5] = verticesNorm[i + 2] * value;
        i+=6;
    }
};

LineBuffer3d.prototype.setDiameter = function(index,value)
{
    var numSegments  = this._numSegments,
        verticesNorm = this._verticesNorm;

    var offset = numSegments * 3 * 2;

    var i = index * offset,
        l = i + offset;

    while (i < l)
    {
        verticesNorm[i + 3] = verticesNorm[i + 0] * value;
        verticesNorm[i + 5] = verticesNorm[i + 2] * value;
        i += 6;
    }
};

//TODO: Cleanup / unroll ...
LineBuffer3d.prototype.setNumSegments = function(numSegments)
{
    numSegments = numSegments < 2 ? 2 : numSegments;

    var numPoints = this._numPoints;
    var indices   = this.indices = [];
    var texCoords;

    var i,j;
    var v0,v1,v2,v3;
    var nh,nv;
    var index, indexSeg, indexTex;
    var len;

    if(numSegments > 2)
    {

        len = numSegments - 1;

        i = -1;
        while (++i < numPoints - 1)
        {

            index = i * numSegments;
            j = -1;
            while (++j < len)
            {
                indexSeg = index + j;

                v0 = indexSeg;
                v1 = indexSeg + 1;
                v2 = indexSeg + numSegments + 1;
                v3 = indexSeg + numSegments;

                indices.push(v0,v1,v3,
                             v1,v2,v3);
            }


            v0 = index + len;
            v1 = index;
            v2 = index + len + 1;
            v3 = index + numSegments + len;

            indices.push(v0,v1,v3,
                         v1,v2,v3);

        }
    }
    else
    {
        i = -1;
        while(++i < numPoints - 1)
        {
            index = i * 2;
            indices.push(index,    index + 1,index + 2,
                         index + 1,index + 3,index + 2);

        }
    }

    len = numPoints * numSegments * 3 ;

    texCoords = this.texCoords = new Float32Array(len / 3 * 2);

    i = -1;
    while(++i < numPoints)
    {
        index = i * numSegments;
        nh    = i / (numPoints - 1);

        j = -1;
        while(++j < numSegments)
        {
            indexTex = (index + j) * 2;
            nv       = 1 - j / (numSegments - 1);

            texCoords[indexTex]   = nh;
            texCoords[indexTex+1] = nv;
        }
    }


    this.setCloseCaps(this._closedCaps);
    this.applySliceSegmentFunc(this._sliceSegFunc,this._initDiameter);
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.update = function()
{
    var numPoints   = this._numPoints,
        numSegments = this._numSegments;

    var points       = this.points,
        vertices     = this.vertices,
        verticesNorm = this._verticesNorm;

    var tempVec = this._tempVec0;

    var p0  = this._bPoint0,
        p1  = this._bPoint1,
        p01 = this._bPoint01,
        up  = this._axisY;

    var mat    = Mat44.make(),
        matRot = Mat44.make();

    var index,index3,index6;

    //direction from current point -> next point, prev point -> current point
    var dir01,dir_10;
    var angle,axis;

    //BEGIN - calculate first point
    Vec3.set3f(p0,points[0],points[1],points[2]);
    Vec3.set3f(p1,points[3],points[4],points[5]);

    dir01 = Vec3.safeNormalize(Vec3.subbed(p1,p0));
    angle = Math.acos(Vec3.dot(dir01,up));
    axis  = Vec3.safeNormalize(Vec3.cross(up,dir01));

    Mat44.identity(mat);
    mat[12] = p0[0];
    mat[13] = p0[1];
    mat[14] = p0[2];

    Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2],matRot);
    mat = Mat44.multPost(mat,matRot);

    j = -1;
    while(++j < numSegments)
    {
        index3 = j * 3;
        index6 = j * 6;

        tempVec[0] = verticesNorm[index6+3];
        tempVec[1] = verticesNorm[index6+4];
        tempVec[2] = verticesNorm[index6+5];

        Mat44.multVec3(mat,tempVec);

        vertices[index3  ] = tempVec[0];
        vertices[index3+1] = tempVec[1];
        vertices[index3+2] = tempVec[2];
    }
    //END - calculate first point


    //calc first prev dir
    Vec3.set3f(p0, points[3],points[4],points[5]);
    Vec3.set3f(p01,points[0],points[1],points[2]);
    dir_10 = Vec3.safeNormalize(Vec3.subbed(p0,p01));

    var i3;
    var i = 0;
    var j;
    while(++i < numPoints - 1)
    {
        //set current point
        i3 = i * 3;
        p0[0] = points[i3  ];
        p0[1] = points[i3+1];
        p0[2] = points[i3+2];

        //set next point
        i3 = (i + 1) * 3;
        p1[0] = points[i3  ];
        p1[1] = points[i3+1];
        p1[2] = points[i3+2];

        //calculate direction
        dir01  = Vec3.safeNormalize(Vec3.subbed(p1,p0));

        //interpolate with previous direction
        dir01[0] = dir01[0] * 0.5 + dir_10[0] * 0.5;
        dir01[1] = dir01[1] * 0.5 + dir_10[1] * 0.5;
        dir01[2] = dir01[2] * 0.5 + dir_10[2] * 0.5;

        //get dir angle + axis
        angle = Math.acos(Vec3.dot(dir01,up));
        axis  = Vec3.safeNormalize(Vec3.cross(up,dir01));

        //reset transformation matrix
        Mat44.identity(mat);

        //set translation
        mat[12] = p0[0];
        mat[13] = p0[1];
        mat[14] = p0[2];

        //set rotation
        Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2],matRot);

        //multiply matrices
        mat = Mat44.multPost(mat,matRot);

        j = -1;
        while(++j < numSegments)
        {
            index  = (i * numSegments + j);
            index3 = index * 3;
            index6 = index * 6;

            //lookup vertex
            tempVec[0] = verticesNorm[index6+3];
            tempVec[1] = verticesNorm[index6+4];
            tempVec[2] = verticesNorm[index6+5];

            //transform vertex copy by matrix
            Mat44.multVec3(mat,tempVec);

            //reassign transformed vertex
            vertices[index3  ] = tempVec[0];
            vertices[index3+1] = tempVec[1];
            vertices[index3+2] = tempVec[2];
        }

        //assign current direction to prev
        dir_10[0] = dir01[0];
        dir_10[1] = dir01[1];
        dir_10[2] = dir01[2];
    }

    var len = points.length;

    //BEGIN - calculate last point
    Vec3.set3f(p0,points[len - 6],points[len - 5],points[len - 4]);
    Vec3.set3f(p1,points[len - 3],points[len - 2],points[len - 1]);

    dir01 = Vec3.safeNormalize(Vec3.subbed(p1,p0));
    angle = Math.acos(Vec3.dot(dir01,up));
    axis  = Vec3.safeNormalize(Vec3.cross(up,dir01));

    Mat44.identity(mat);
    mat[12] = p1[0];
    mat[13] = p1[1];
    mat[14] = p1[2];

    Mat44.makeRotationOnAxis(angle,axis[0],axis[1],axis[2],matRot);
    mat = Mat44.multPost(mat,matRot);

    i  = (i * numSegments);

    j = -1;
    while(++j < numSegments)
    {
        index  = i + j;
        index3 = index * 3;
        index6 = index * 6;

        tempVec[0] = verticesNorm[index6+3];
        tempVec[1] = verticesNorm[index6+4];
        tempVec[2] = verticesNorm[index6+5];

        Mat44.multVec3(mat,tempVec);

        vertices[index3  ] = tempVec[0];
        vertices[index3+1] = tempVec[1];
        vertices[index3+2] = tempVec[2];
    }
    //END - calculate last point
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.setSegVTexCoordMapping = function(scale,offset){this.setSegTexCoordMapping(1,0,scale,offset || 0);};
LineBuffer3d.prototype.setSegHTexCoordMapping = function(scale,offset){this.setSegTexCoordMapping(scale,offset || 0,1,0);};

LineBuffer3d.prototype.setSegTexCoordMapping = function (scaleH, offsetH, scaleV, offsetV)
{
    var numPoints     = this._numPoints,
        numSegments   = this._numSegments,
        numSegments_1 = numSegments - 1;

    var texCoords = this.texCoords;
    var i, j, index, indexTex;
    var nh, nv;

    i = -1;
    while (++i < numPoints)
    {
        index = i * numSegments;
        nh = (i / (numPoints - 1)) * scaleH - offsetH;

        j = -1;
        while (++j < numSegments)
        {
            indexTex = (index + j) * 2;
            nv = (1 - j / numSegments_1) * scaleV - offsetV;

            texCoords[indexTex  ] = nh;
            texCoords[indexTex + 1] = nv;
        }
    }
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.setCloseCaps = function(bool)
{
    if(this._numSegments == 2)return;

    var indices = this.indices,
        temp    = new Array(this.indices.length);

    var i = -1;while(++i<temp.length)temp[i] = indices[i];

    var numPoints   = this._numPoints,
        numSegments = this._numSegments;
    var len;


    if(bool)
    {

        len = numSegments - 2;
        i = -1;while(++i < len)temp.push(0,i+1,i+2);

        var j;
        len += (numPoints - 1) * numSegments + 1;
        i   = j = len - numSegments + 1;
        while(++i < len)temp.push(j,i,i+1);
    }
    else
    {
        temp = temp.slice(0,indices.length - (numSegments - 2) * 2 * 3);
    }

    this.indices = new Uint16Array(temp);
    this.updateVertexNormals();
    this._closedCaps = bool;
};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype.getNumSegments = function(){return this._numSegments;};
LineBuffer3d.prototype.getNumPoints   = function(){return this._numPoints;};

/*---------------------------------------------------------------------------------------------------------*/

LineBuffer3d.prototype._draw = function(gl,count,offset)
{
    var indices = this.indices;
    gl.drawElements(this.vertices,this.normals,gl.bufferColors(gl.getColorBuffer(),this.colors),this.texCoords,indices,gl.getDrawMode(),count || indices.length, offset || 0 );
};

module.exports = LineBuffer3d;

},{"../math/fMat44":31,"../math/fVec3":35,"./fGeom3d":7}],13:[function(require,module,exports){
var Vec2   = require('../math/fVec2'),
    Vec3   = require('../math/fVec3'),
    Color  = require('../util/fColor'),
    Geom3d = require('./fGeom3d');

ParametricSurface = function(size)
{
    Geom3d.apply(this,null);

    this.funcX = function(u,v,t){return u;};
    this.funcY = function(u,v,t){return 0;};
    this.funcZ = function(u,v,t){return v;};
    this.ur    = [-1,1];
    this.vr    = [-1,1];
    this.size  = null;

    this.setSize(size);

};

ParametricSurface.prototype = Object.create(Geom3d.prototype);

ParametricSurface.prototype.setSize = function(size,unit)
{
    unit = unit || 1;

    this.size = size;

    var length  = size * size;

    this.vertices  = new Float32Array(length * Vec3.SIZE);
    this.normals   = new Float32Array(length * Vec3.SIZE);
    this.colors    = new Float32Array(length * Color.SIZE);
    this.texCoords = new Float32Array(length * Vec2.SIZE);

    var indices = [];

    var a, b, c, d;
    var i,j;

    i = -1;
    while(++i < size - 1)
    {
        j = -1;
        while(++j < size - 1)
        {
            a = j     + size * i;
            b = (j+1) + size * i;
            c = j     + size * (i+1);
            d = (j+1) + size * (i+1);

            indices.push(a,b,c);
            indices.push(b,d,c);
        }
    }

    this.indices = new Uint16Array(indices);

    this.updateVertexNormals();
};

ParametricSurface.prototype.setFunctions = function(funcX,funcY,funcZ,vr,ur)
{
    this.funcX = funcX;
    this.funcY = funcY;
    this.funcZ = funcZ;
    this.vr   = vr;
    this.ur   = ur;
};

ParametricSurface.prototype.applyFunctions = function()
{
    this.applyFunctionsWithArg(0);
};

//Override
ParametricSurface.prototype.applyFunctionsWithArg = function(arg)
{
    var size  = this.size;

    var funcX = this.funcX,
        funcY = this.funcY,
        funcZ = this.funcZ;

    var urLower = this.ur[0],
        urUpper = this.ur[1],
        vrLower = this.vr[0],
        vrUpper = this.vr[1];

    var i, j, u, v;

    var vertices = this.vertices;

    var index,indexVertices;

    var temp0 = urUpper - urLower,
        temp1 = vrUpper - vrLower,
        temp2 = size - 1;

    i = -1;
    while(++i < size)
    {
        j = -1;
        while(++j < size)
        {
            index = (j + size * i);
            indexVertices = index * 3;

            u = (urLower + temp0 * (j / temp2));
            v = (vrLower + temp1 * (i / temp2));

            vertices[indexVertices    ] = funcX(u,v,arg);
            vertices[indexVertices + 1] = funcY(u,v,arg);
            vertices[indexVertices + 2] = funcZ(u,v,arg);
        }
    }
};

ParametricSurface.prototype.pointOnSurface = function(u,v)
{
    return this.pointOnSurfaceWithArg(u,v,0);
};

ParametricSurface.prototype.pointOnSurfaceWithArg = function(u,v,arg)
{
    return Vec3.make(this.funcX(u,v,arg),
                     this.funcY(u,v,arg),
                     this.funcZ(u,v,arg));
};

module.exports = ParametricSurface;


},{"../math/fVec2":34,"../math/fVec3":35,"../util/fColor":40,"./fGeom3d":7}],14:[function(require,module,exports){
var fMath      = require('../math/fMath'),
    Line2dUtil = require('./fLine2dUtil');

module.exports =
{
    /*---------------------------------------------------------------------------------------------------------*/

    makeVertexCountFitted : function(polygon,count)
    {
        var diff    = polygon.length * 0.5 - count;

        return diff < 0 ? this.makeVertexCountIncreased(polygon, Math.abs(diff)) :
               diff > 0 ? this.makeVertexCountDecreased(polygon, diff) :
               polygon;
    },


    //TODO: modulo loop
    makeVertexCountIncreased : function(polygon,count)
    {
        count = (typeof count == 'undefined') ? 1 : count;

        var out = polygon.slice();
        if(count <= 0 )return polygon;

        var i = -1,j;
        var len;
        var max;

        var jc,jn;

        var x, y, mx, my;
        var dx,dy,d;

        var edgeSIndex,
            edgeEIndex;

        while(++i < count)
        {
            max = -Infinity;
            len = out.length * 0.5;

            edgeSIndex = edgeEIndex = 0;

            j = -1;
            while(++j < len - 1)
            {
                jc = j * 2;
                jn = (j + 1) * 2;

                dx = out[jn    ] - out[jc    ];
                dy = out[jn + 1] - out[jc + 1];
                d  = dx * dx + dy * dy;

                if(d > max){max = d;edgeSIndex = j;}
            }

            jc = j * 2;
            dx = out[0] - out[jc    ];
            dy = out[1] - out[jc + 1];
            d  = dx * dx + dy * dy;

            edgeSIndex = (d > max) ? j : edgeSIndex;
            edgeEIndex = edgeSIndex == len - 1 ? 0 : edgeSIndex + 1;

            edgeSIndex*= 2;
            edgeEIndex*= 2;

            x = out[edgeSIndex    ];
            y = out[edgeSIndex + 1];

            mx = x + (out[edgeEIndex    ] - x) * 0.5;
            my = y + (out[edgeEIndex + 1] - y) * 0.5;

            out.splice(edgeEIndex,0,mx,my);
        }

        return out;

    },


    //TODO: modulo loop
    makeVertexCountDecreased : function(polygon,count)
    {
        count = (typeof count == 'undefined') ? 1 : count;

        var out = polygon.slice();
        if((out.length * 0.5 - count) < 3 || count == 0)return out;

        var i = -1, j;
        var len;
        var min;

        var jc,jn;
        var dx,dy,d;

        var edgeSIndex,
            edgeEIndex;

        while(++i < count)
        {

            min = Infinity;
            len = out.length * 0.5;

            edgeSIndex = edgeEIndex = 0;

            j = -1;
            while(++j < len - 1)
            {
                jc = j * 2;
                jn = (j + 1) * 2;

                dx = out[jn    ] - out[jc    ];
                dy = out[jn + 1] - out[jc + 1];
                d  = dx * dx + dy * dy;

                if(d < min){min = d;edgeSIndex = j;}
            }

            jc = j * 2;
            dx = out[0] - out[jc    ];
            dy = out[1] - out[jc + 1];
            d  = dx * dx + dy * dy;

            edgeSIndex = (d < min) ? j : edgeSIndex;
            edgeEIndex = edgeSIndex == len - 1 ? 0 : edgeSIndex + 1;

            out.splice(edgeEIndex * 2,2);

        }

        return out;

    },

    /*---------------------------------------------------------------------------------------------------------*/


    makeEdgesSubdivided : function(polygon,count,out)
    {
        count = count || 1;

        var i, j, k;
        var i2,i4;

        var len;
        var x, y, mx, my;


        if(out)
        {
            out.length = polygon.length;
            i = -1;while(++i < polygon.length){out[i] = polygon[i];}
        }
        else out = polygon.slice();

        j = -1;
        while(++j < count)
        {

            len = out.length * 0.5 -1;
            i = -1;
            while(++i < len)
            {
                i2 = i * 2;
                i4 = (i * 2) * 2;
                x  = out[i4];
                y  = out[i4 + 1];

                i2 = i2 + 1;
                i4 = i2 * 2;
                mx = x + (out[i4    ] - x) * 0.5;
                my = y + (out[i4 + 1] - y) * 0.5;

                out.splice(i4,0,mx,my);
            }

            i2 = i   * 2;
            i4 = i2 * 2;

            x  = out[i4];
            y  = out[i4 + 1];
            mx = x + (out[0] - x) * 0.5;
            my = y + (out[1] - y) * 0.5;

            out.splice((i2 + 1) * 2,0,mx,my);
        }

        return out;
    },

    /*---------------------------------------------------------------------------------------------------------*/


    makeSmoothedLinear : function(polygon,count,out)
    {
        count = count || 1;

        var px,py,dx,dy;

        var i, j, k;

        var temp    = polygon.slice(),
            tempLen = temp.length;

        if(out)out.length = tempLen  * 2;
        else out = new Array(tempLen  * 2);

        j = -1;
        while(++j < count)
        {
            tempLen    = temp.length;
            out.length = tempLen * 2;

            i = 0;
            while(i < tempLen)
            {
                px = temp[i    ];
                py = temp[i + 1] ;
                k  = (i + 2) % tempLen;
                dx = temp[k    ] - px;
                dy = temp[k + 1] - py;

                k = i * 2;
                out[k  ] = px + dx * 0.25;
                out[k+1] = py + dy * 0.25;
                out[k+2] = px + dx * 0.75;
                out[k+3] = py + dy * 0.75;

                i+=2;
            }


            temp = out.slice();
        }

        return out;

    },

    /*---------------------------------------------------------------------------------------------------------*/

    makeOptHeading : function(polygon,tolerance)
    {
        if(polygon.length < 4)return polygon;

        tolerance = tolerance || fMath.EPSILON;

        var temp = [];

        var len = polygon.length / 2 - 1;

        var px = polygon[0],
            py = polygon[1],
            x, y;

        var ph = Math.atan2(polygon[3] - py,polygon[2] - px),
            ch;

        temp.push(px,py);

        var i = 0,i2;

        while(++i < len)
        {
            i2 = i * 2;
            x = polygon[i2  ];
            y = polygon[i2+1];

            i2 = (i + 1) * 2;
            ch = Math.atan2(polygon[i2+1] - y,
                            polygon[i2  ] - x);

            if(Math.abs(ph - ch) > tolerance)temp.push(x,y);

            px = x;
            py = y;
            ph = ch;
        }

        x = polygon[polygon.length - 2];
        y = polygon[polygon.length - 1];

        ch = Math.atan2(polygon[1] - y, polygon[0] - x);

        if(Math.abs(ph - ch) > tolerance)temp.push(x,y);

        return temp;
    },


    makeOptEdgeLength : function(polygon,edgeLength)
    {
        var temp = [];
        var len  = polygon.length * 0.5 - 1;

        var dx,dy;
        var px,py;
        var x, y;

        var index;

        var edgeLengthSq = edgeLength * edgeLength;

        px = polygon[0];
        py = polygon[1];

        temp.push(px,py);
        var i = 0;
        while(++i < len)
        {
            index = i * 2;

            x =  polygon[index  ];
            y =  polygon[index+1];

            dx = x - px;
            dy = y - py;

            if((dx * dx + dy * dy) >= edgeLengthSq)
            {
                px = x;
                py = y;

                temp.push(x,y);
            }
        }

        x = polygon[polygon.length-2];
        y = polygon[polygon.length-1];

        px = polygon[0];
        py = polygon[1];

        dx = x - px;
        dy = y - py;

        if((dx * dx + dy * dy) >= edgeLengthSq)temp.push(x,y);

        return temp;
    },

    /*---------------------------------------------------------------------------------------------------------*/


    //http://alienryderflex.com/polygon_perimeter/
    makePerimeter : function(polygon,out)
    {
        var TWO_PI   = Math.PI * 2,
            PI       = Math.PI;

        var corners  = polygon.length * 0.5;
        var MAX_SEGS = corners * 4;

        if(corners > MAX_SEGS) return null;

        out.length = 0;

        var segS = new Array(MAX_SEGS * 2),
            segE = new Array(MAX_SEGS * 2),
            segAngle   = new Array(MAX_SEGS);

        var intersects = new Array(2),
            intersectX,intersectY;

        var startX    = polygon[0],
            startY    = polygon[1],
            lastAngle = PI;

        var indexi,indexj,
            indexSeg,indexSegi,indexSegj,
            pix,piy,pjx,pjy;

        var a, b, c, d, e, f,
            angleDif, bestAngleDif;

        var i, j = corners - 1, segs = 0;

        i = -1;
        while(++i < corners)
        {
            indexi = i * 2;
            indexj = j * 2;

            pix = polygon[indexi  ];
            piy = polygon[indexi+1];
            pjx = polygon[indexj  ];
            pjy = polygon[indexj+1];

            if (pix != pjx || piy != pjy)
            {
                indexSeg = segs * 2;

                segS[indexSeg  ] = pix;
                segS[indexSeg+1] = piy;
                segE[indexSeg  ] = pjx;
                segE[indexSeg+1] = pjy;

                segs++;
            }

            j = i;

            if (piy > startY || piy == startY && pix < startX)
            {
                startX = pix;
                startY = piy;
            }
        }

        if (segs == 0) return false;

        var isSegmentIntersectionf = Line2dUtil.isSegmentIntersectionf;

        var segSxi,segSyi,
            segSxj,segSyj;

        var segExi,segEyi,
            segExj,segEyj;

        i = -1;
        while(++i < segs - 1)
        {
            indexSegi = i * 2;

            segSxi = segS[indexSegi  ];
            segSyi = segS[indexSegi+1];
            segExi = segE[indexSegi  ];
            segEyi = segE[indexSegi+1];

            j = i;
            while(++j < segs)
            {
                indexSegj = j * 2;

                segSxj = segS[indexSegj  ];
                segSyj = segS[indexSegj+1];
                segExj = segE[indexSegj  ];
                segEyj = segE[indexSegj+1];

                if (isSegmentIntersectionf(
                    segSxi,segSyi,segExi,segEyi,
                    segSxj,segSyj,segExj,segEyj,intersects))
                {

                    intersectX = intersects[0];
                    intersectY = intersects[1];

                    if ((intersectX != segSxi || intersectY != segSyi) &&
                        (intersectX != segExi || intersectY != segEyi))
                    {
                        if(segs == MAX_SEGS) return false;

                        indexSeg = segs * 2;

                        segS[indexSeg  ] = segSxi;
                        segS[indexSeg+1] = segSyi;
                        segE[indexSeg  ] = intersectX;
                        segE[indexSeg+1] = intersectY;

                        segs++;

                        segS[indexSegi  ] = intersectX;
                        segS[indexSegi+1] = intersectY;
                    }

                    if ((intersectX != segSxj || intersectY != segSyj) &&
                        (intersectX != segExj || intersectY != segEyj))
                    {
                        if(segs == MAX_SEGS) return false;

                        indexSeg = segs * 2;

                        segS[indexSeg  ] = segSxj;
                        segS[indexSeg+1] = segSyj;
                        segE[indexSeg  ] = intersectX;
                        segE[indexSeg+1] = intersectY;

                        segs++;

                        segS[indexSegj  ] = intersectX;
                        segS[indexSegj+1] = intersectY;
                    }
                }
            }
        }


        var segDiffx,
            segDiffy,
            segLen;

        i = -1;
        while(++i < segs)
        {
            indexSegi = i * 2;
            segDiffx = segE[indexSegi  ] - segS[indexSegi  ];
            segDiffy = segE[indexSegi+1] - segS[indexSegi+1];

            segLen   = Math.sqrt(segDiffx * segDiffx + segDiffy * segDiffy) || 1;

            segAngle[i] = (segDiffy >= 0.0) ?
                           Math.acos(segDiffx/segLen) :
                          (Math.acos(-segDiffx/segLen) + PI);

        }

        c = startX;
        d = startY;
        a = c - 1;
        b = d;
        e = 0;
        f = 0;

        corners = 1;

        out.push(c,d);

        while (true)
        {
            bestAngleDif = TWO_PI;

            for (i = 0; i < segs; i++)
            {
                indexSegi = i * 2;

                segSxi = segS[indexSegi  ];
                segSyi = segS[indexSegi+1];
                segExi = segE[indexSegi  ];
                segEyi = segE[indexSegi+1];


                if (segSxi == c && segSyi == d &&
                    (segExi !=a || segEyi != b))
                {
                    angleDif = lastAngle - segAngle[i];

                    while (angleDif >= TWO_PI) angleDif -= TWO_PI;
                    while (angleDif < 0      ) angleDif += TWO_PI;

                    if (angleDif < bestAngleDif)
                    {
                        bestAngleDif = angleDif;
                        e = segExi;
                        f = segEyi;
                    }
                }
                if (segExi == c && segEyi == d &&
                    (segSxi !=a || segSyi != b))
                {
                    angleDif = lastAngle - segAngle[i] + PI;

                    while (angleDif >= TWO_PI) angleDif -= TWO_PI;
                    while (angleDif <  0     ) angleDif += TWO_PI;

                    if (angleDif < bestAngleDif)
                    {
                        bestAngleDif = angleDif;
                        e = segSxi;
                        f = segSyi;
                    }
                }
            }

            if (corners > 1 &&
                c == out[0] && d == out[1] &&
                e == out[2] && f == out[3])
            {
                corners--;
                return true;
            }

            if (bestAngleDif == TWO_PI ||
                corners == MAX_SEGS)
            {
                return false;
            }

            corners++;
            out.push(e,f);

            lastAngle -= bestAngleDif + PI;

            a = c;
            b = d;
            c = e;
            d = f;
        }
    },

    /*---------------------------------------------------------------------------------------------------------*/


    //http://alienryderflex.com/polygon_inset/
    makeInset : function(polygon,distance)
    {
        if(polygon.length <= 2)return null;

        var num = polygon.length * 0.5 - 1;

        var sx = polygon[0],
            sy = polygon[1];

        var a, b,
            c = polygon[polygon.length - 2],
            d = polygon[polygon.length - 1],
            e = sx,
            f = sy;

        var index0,index1;

        var temp = new Array(2);

        var i = -1;
        while (++i < num)
        {
            a = c;
            b = d;
            c = e;
            d = f;

            index0 = i * 2;
            index1 = (i+1)*2;

            e = polygon[index1    ];
            f = polygon[index1 + 1];

            temp[0] = polygon[index0];
            temp[1] = polygon[index0 + 1];

            this.makeInsetCorner(a, b, c, d, e, f, distance, temp);
            polygon[index0    ] = temp[0];
            polygon[index0 + 1] = temp[1];
        }

        index0 = i * 2;

        temp[0] = polygon[index0    ];
        temp[1] = polygon[index0 + 1];

        this.makeInsetCorner(c, d, e, f, sx, sy, distance, temp);
        polygon[index0    ] = temp[0];
        polygon[index0 + 1] = temp[1];

        return polygon;
    },

    makeInsetCorner : function(a,b,c,d,e,f,distance,out)
    {
        var  c1 = c,
            d1 = d,
            c2 = c,
            d2 = d,
            dx1, dy1, dist1,
            dx2, dy2, dist2,
            insetX, insetY ;

        var EPSILON = 0.0001;

        dx1   = c - a;
        dy1   = d - b;
        dist1 = Math.sqrt(dx1*dx1+dy1*dy1);

        dx2   = e - c;
        dy2   = f - d;
        dist2 = Math.sqrt(dx2*dx2+dy2*dy2);

        if(dist1 < EPSILON || dist2  < EPSILON)return;

        dist1 = 1.0 / dist1;
        dist2 = 1.0 / dist2;

        insetX = dy1 * dist1 * distance;
        a     += insetX;
        c1    += insetX;

        insetY =-dx1 * dist1 * distance;
        b     += insetY;
        d1    += insetY;

        insetX = dy2 * dist2 * distance;
        e     += insetX;
        c2    += insetX;

        insetY =-dx2 * dist2 * distance;
        f     += insetY;
        d2    += insetY;

        if (c1 == c2 && d1==d2)
        {
            out[0] = c1;
            out[1] = d1;
            return; }

        var temp = new Array(2);

        if (Line2dUtil.isIntersectionf(a,b,c1,d1,c2,d2,e,f,temp))
        {
            out[0] = temp[0];
            out[1] = temp[1];
        }
    },

    /*---------------------------------------------------------------------------------------------------------*/

    isPointInPolygon : function(x,y,points)
    {
        var wn = 0;
        var len = points.length / 2;

        var index0,
            index1;


        var i = -1;
        while(++i < len - 1)
        {
            index0 = i * 2;
            index1 = (i + 1) * 2;

            if(points[index0+1] <= y)
            {
                if(points[index1+1] > y)
                {
                    if(Line2dUtil.isPointLeft(points[index0],points[index0 + 1],
                                              points[index1],points[index1 + 1],
                                              x,y)>0)++wn;
                }
            }
            else
            {
                if(points[index1+1] <= y)
                {
                    if(Line2dUtil.isPointLeft(points[index0],points[index0 + 1],
                                              points[index1],points[index1 + 1],
                                              x,y)<0)--wn;

                }
            }
        }

        return wn;

    },

    /*---------------------------------------------------------------------------------------------------------*/


    makeVerticesReversed : function(polygon){ return polygon.reverse();},


    makePolygon3dFloat32 : function(polygon,scale)
    {
        scale = scale || 1.0;

        var polyLen = polygon.length * 0.5,
            out     = new Float32Array(polyLen * 3);
        var index0,index1;

        var i = -1;
        while(++i < polyLen)
        {
            index0 = i * 3;
            index1 = i * 2;

            out[index0  ] = polygon[index1  ] * scale;
            out[index0+1] = 0.0;
            out[index0+2] = polygon[index1+1] * scale;
        }

        return out;
    }

    /*---------------------------------------------------------------------------------------------------------*/

    /*
    //Sutherland-Hodgman
    makeClippingSH : function(polygon,clippingPolygon)
    {
        var len0 = polygon.length * 0.5,
            len1 = clippingPolygon.length ;


        var Line2dUtil = Foam.Line2dUtil;

        var out = [];

        var clipEdgeSx,clipEdgeSy,
            clipEdgeEx,clipEdgeEy;

        var polyEdgeSx, polyEdgeSy,
            polyEdgeEx, polyEdgeEy;

        var polyVertIsOnLeft;

        console.log(clippingPolygon);

        var i, j;

        var i2, j2, i4;

        i = 0;
        while(i < len1)
        {
            clipEdgeSx = clippingPolygon[i  ];
            clipEdgeSy = clippingPolygon[i+1];

            i2 = (i + 2) % len1;
            clipEdgeEx = clippingPolygon[i2];
            clipEdgeEy = clippingPolygon[i2+1];


            i+=2;
        }
       // while(++i <)



        return out;

    },

    makeClippingV : function(polygon,clippingPolygon)
    {

    },

    makeScanFill : function(polygon)
    {

    }

    */




};
},{"../math/fMath":32,"./fLine2dUtil":10}],15:[function(require,module,exports){
var fMath = require('../math/fMath'),
    Vec3  = require('../math/fVec3'),
    Mat44 = require('../math/fMat44');

//TODO: Add close, smooth in out intrpl, pre post points
function Spline()
{
    this.points     = null;
    this.vertices   = null;

    this._detail    = 20;
    this._tension   = 0;
    this._bias      = 0;
    this._numPoints = null;
    this._numVerts  = null;

    this._tempVec0  = Vec3.make();
    this._tempVec1  = Vec3.make();
    this._tempMat0  = Mat44.make();
    this._tempMat1  = Mat44.make();
    this._tempMat2  = Mat44.make();

    this._axisY     = Vec3.AXIS_Y();
};

Spline.prototype.setPoint3f = function(index,x,y,z)
{
    var points = this.points;

    index*=3;
    points[index  ] = x;
    points[index+1] = y;
    points[index+2] = z;
};

Spline.prototype.setPoints =  function(arr)
{
    var num         = this._numPoints = arr.length / 3,
        numVerts    = this._numVerts  = (num - 1) * (this._detail - 1) + 1;

    this.points     = new Float32Array(arr);
    this.vertices   = new Float32Array(numVerts * 3);
};

Spline.prototype.update = function()
{
    var detail    = this._detail,
        detail_1  = detail - 1,
        points    = this.points,
        numPoints = this._numPoints,
        vertices  = this.vertices;

    var tension       = this._tension,
        bias          = this._bias,
        hermiteIntrpl = fMath.hermiteIntrpl;

    var i, j, t;
    var len = numPoints - 1;

    var index,index_1,index1,index2,
        vertIndex;

    var x, y, z;

    i = -1;
    while(++i < len)
    {
        index    = i;

        index1   = Math.min((index + 1),len) * 3;
        index2   = Math.min((index + 2),len) * 3;
        index_1  = Math.max(0,(index - 1))   * 3;
        index   *= 3;

        j = -1;
        while(++j < detail_1)
        {
            t = j / detail_1;

            x = hermiteIntrpl(points[index_1],
                              points[index  ],
                              points[index1 ],
                              points[index2 ],
                              t,tension,bias);

            y = hermiteIntrpl(points[index_1 + 1],
                              points[index   + 1],
                              points[index1  + 1],
                              points[index2  + 1],
                              t,tension,bias);

            z = hermiteIntrpl(points[index_1 + 2],
                              points[index   + 2],
                              points[index1  + 2],
                              points[index2  + 2],
                              t,tension,bias);

            vertIndex = (i * detail_1 + j) * 3;

            vertices[vertIndex  ] = x;
            vertices[vertIndex+1] = y;
            vertices[vertIndex+2] = z;
        }
    }

    var vertLen   = vertices.length,
        pointsLen = points.length;

    vertices[vertLen-3] = points[pointsLen-3];
    vertices[vertLen-2] = points[pointsLen-2];
    vertices[vertLen-1] = points[pointsLen-1];

};

Spline.prototype.setDetail  = function(detail) {this._detail  = detail;};
Spline.prototype.setTension = function(tension){this._tension = tension;};
Spline.prototype.setBias    = function(bias)   {this._bias    = bias;};

Spline.prototype.getNumPoints   = function(){return this._numPoints;};
Spline.prototype.getNumVertices = function(){return this._numVerts;};

Spline.prototype.getVec3OnPoints = function(val,out)
{
    out = out || this._tempVec0;

    var points    = this.points,
        numPoints = this._numPoints,
        len       = numPoints - 1;

    var index  = Math.floor(numPoints * val),
        index1 = Math.min(index + 1, len);

        index *= 3;
        index1*= 3;

    var localIntrpl    = (val % (1 / numPoints)) * numPoints,
        localIntrplInv = 1.0 - localIntrpl;

    out[0] = points[index  ] * localIntrplInv + points[index1  ] * localIntrpl;
    out[1] = points[index+1] * localIntrplInv + points[index1+1] * localIntrpl;
    out[2] = points[index+2] * localIntrplInv + points[index1+2] * localIntrpl;

    return out;

};

Spline.prototype.getVec3OnSpline = function(val,out)
{
    out = out || this._tempVec0;

    var vertices = this.vertices,
        numVerts = this._numVerts,
        len      = numVerts - 1;

    var index  = Math.min(Math.floor(numVerts * val),len),
        index1 = Math.min(index + 1,len);

    var localIntrpl    = (val % (1.0 / numVerts)) * numVerts,
        localIntrplInv = 1.0 - localIntrpl;

    index  *= 3;
    index1 *= 3;

    out[0] = vertices[index  ] * localIntrplInv + vertices[index1  ] * localIntrpl;
    out[1] = vertices[index+1] * localIntrplInv + vertices[index1+1] * localIntrpl;
    out[2] = vertices[index+2] * localIntrplInv + vertices[index1+2] * localIntrpl;

    return out;
};



//hm
Spline.prototype.getPointsLineLengthSq = function()
{
    var points    = this.points;

    var dx = 0,
        dy = 0,
        dz = 0;

    var i = points.length;
    while(i > 6)
    {
        dx += points[i-3] - points[i-6];
        dy += points[i-2] - points[i-5];
        dz += points[i-1] - points[i-4];

        i-=3;
    }

    return dx*dx+dy*dy+dz*dz;

};

Spline.prototype.getSplineLineLengthSq = function()
{
    var vertices = this.vertices;

    var dx = 0,
        dy = 0,
        dz = 0;

    var i = vertices.length;
    while(i > 6)
    {
        dx += vertices[i-3] - vertices[i-6];
        dy += vertices[i-2] - vertices[i-5];
        dz += vertices[i-1] - vertices[i-4];

        i-=3;
    }

    return dx*dx+dy*dy+dz*dz;
};

Spline.prototype.getPointsLineLength = function(){return Math.sqrt(this.getPointsLineLengthSq());};
Spline.prototype.getSplinePointsLength = function(){return Math.sqrt(this.getSplineLineLengthSq())};

module.exports = Spline;



},{"../math/fMat44":31,"../math/fMath":32,"../math/fVec3":35}],16:[function(require,module,exports){
var Vec3  = require('../math/fVec3'),
    Mat44 = require('../math/fMat44'),
    MatGL = require('./gl/fMatGL');

function CameraBasic()
{
    this.position = Vec3.make();
    this._target  = Vec3.make();
    this._up      = Vec3.AXIS_Y();

    this._fov  = 0;
    this._near = 0;
    this._far  = 0;

    this._aspectRatioLast = 0;

    this._modelViewMatrixUpdated  = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = Mat44.make();
    this.modelViewMatrix  = Mat44.make();
}

CameraBasic.prototype.setPerspective = function(fov,windowAspectRatio,near,far)
{
    this._fov  = fov;
    this._near = near;
    this._far  = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};



CameraBasic.prototype.setTarget         = function(v)    {Vec3.set(this._target,v);this._modelViewMatrixUpdated = false;};
CameraBasic.prototype.setTarget3f       = function(x,y,z){Vec3.set3f(this._target,x,y,z);this._modelViewMatrixUpdated = false;};
CameraBasic.prototype.setPosition       = function(v)    {Vec3.set(this.position,v);this._modelViewMatrixUpdated = false;};
CameraBasic.prototype.setPosition3f     = function(x,y,z){Vec3.set3f(this.position,x,y,z);this._modelViewMatrixUpdated = false;};
CameraBasic.prototype.setUp             = function(v)    {Vec3.set(this._up,v);this._modelViewMatrixUpdated = false;};
CameraBasic.prototype.setUp3f           = function(x,y,z){ Vec3.set3f(this._up,x,y,z);this._modelViewMatrixUpdated = false;};

CameraBasic.prototype.setNear           = function(near)       {this._near = near;this._projectionMatrixUpdated = false;};
CameraBasic.prototype.setFar            = function(far)        {this._far  = far;this._projectionMatrixUpdated = false;};
CameraBasic.prototype.setFov            = function(fov)        {this._fov  = fov;this._projectionMatrixUpdated = false;};
CameraBasic.prototype.setAspectRatio    = function(aspectRatio){this._aspectRatioLast = aspectRatio;this._projectionMatrixUpdated = false;};

CameraBasic.prototype.updateModelViewMatrix   = function(){if(this._modelViewMatrixUpdated)return;MatGL.lookAt(this.modelViewMatrix,this.position,this._target,this._up); this._modelViewMatrixUpdated = true;};
CameraBasic.prototype.updateProjectionMatrix = function(){if(this._projectionMatrixUpdated)return;MatGL.perspective(this.projectionMatrix,this._fov,this._aspectRatioLast,this._near,this._far);this._projectionMatrixUpdated = true;};

CameraBasic.prototype.updateMatrices = function(){this.updateModelViewMatrix();this.updateProjectionMatrix();};

CameraBasic.prototype.toString = function(){return '{position= ' + Vec3.toString(this.position) +
                                                     ', target= ' + Vec3.toString(this._target) +
                                                     ', up= '     + Vec3.toString(this._up) + '}'};

module.exports = CameraBasic;



},{"../math/fMat44":31,"../math/fVec3":35,"./gl/fMatGL":20}],17:[function(require,module,exports){
var fError           = require('../system/fError'),
    ProgVertexShader = require('./gl/shader/fProgVertexShader'),
    ProgFragShader   = require('./gl/shader/fProgFragShader'),
    ProgLoader       = require('./gl/shader/fProgLoader'),
    ShaderLoader     = require('./gl/shader/fShaderLoader'),
    Platform         = require('../system/fPlatform'),
    Vec2             = require('../math/fVec2'),
    Vec3             = require('../math/fVec3'),
    Vec4             = require('../math/fVec4'),
    Mat33            = require('../math/fMat33'),
    Mat44            = require('../math/fMat44'),
    Color            = require('../util/fColor'),
    Texture          = require('./gl/fTexture');


function FGL(context3d,context2d)
{
    /*---------------------------------------------------------------------------------------------------------*/
    // Init
    /*---------------------------------------------------------------------------------------------------------*/

    var gl = this.gl = context3d;

    /*---------------------------------------------------------------------------------------------------------*/
    // create shaders/program + bind
    /*---------------------------------------------------------------------------------------------------------*/

    /*
    var progVertexShader = ShaderLoader.loadShaderFromString(gl, ProgVertexShader, gl.VERTEX_SHADER),
        progFragShader   = ShaderLoader.loadShaderFromString(gl, ((Platform.getTarget() == Platform.WEB) ?
                                                                  ShaderLoader.PrefixShaderWeb : '') +
                                                                  ProgFragShader, gl.FRAGMENT_SHADER);



    var programScene =  ProgLoader.loadProgram(gl,progVertexShader,progFragShader);
    */



    var platform = Platform.getTarget();

    var programScene = this._programScene = gl.createProgram();

    var progVertShader = gl.createShader(gl.VERTEX_SHADER),
        progFragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(progVertShader, ProgVertexShader);
    gl.compileShader(progVertShader);

    if(!gl.getShaderParameter(progVertShader,gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(progVertShader);

    gl.shaderSource(progFragShader, ((platform == Platform.WEB) ? ShaderLoader.PrefixShaderWeb : '') + ProgFragShader);
    gl.compileShader(progFragShader);

    if(!gl.getShaderParameter(progFragShader,gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(progFragShader);

    gl.bindAttribLocation(programScene,0,'aVertexPosition');

    gl.attachShader(programScene, progVertShader);
    gl.attachShader(programScene, progFragShader);
    gl.linkProgram( programScene);

    if(!gl.getProgramParameter(programScene,gl.LINK_STATUS))
        throw gl.getProgramInfoLog(programScene);

    gl.useProgram(programScene);



    /*---------------------------------------------------------------------------------------------------------*/
    // Bind & enable shader attributes & uniforms
    /*---------------------------------------------------------------------------------------------------------*/


    this._aVertexPosition   = gl.getAttribLocation(programScene,'aVertexPosition');
    this._aVertexNormal     = gl.getAttribLocation(programScene,'aVertexNormal');
    this._aVertexColor      = gl.getAttribLocation(programScene,'aVertexColor');
    this._aVertexTexCoord   = gl.getAttribLocation(programScene,'aVertexTexCoord');

    this._uModelViewMatrix  = gl.getUniformLocation(programScene,'uModelViewMatrix');
    this._uProjectionMatrix = gl.getUniformLocation(programScene,'uProjectionMatrix');
    this._uNormalMatrix     = gl.getUniformLocation(programScene,'uNormalMatrix');
    this._uTexImage         = gl.getUniformLocation(programScene,'uTexImage');

    this._uPointSize        = gl.getUniformLocation(programScene,'uPointSize');

    this._uUseLighting      = gl.getUniformLocation(programScene,'uUseLighting');
    this._uUseMaterial      = gl.getUniformLocation(programScene,'uUseMaterial');
    this._uUseTexture       = gl.getUniformLocation(programScene,'uUseTexture');

    this._uAmbient          = gl.getUniformLocation(programScene,'uAmbient');


    gl.enableVertexAttribArray(this._aVertexPosition);
    gl.enableVertexAttribArray(this._aVertexNormal);
    gl.enableVertexAttribArray(this._aVertexColor);
    gl.enableVertexAttribArray(this._aVertexTexCoord);

    /*---------------------------------------------------------------------------------------------------------*/
    // Set Shader initial values
    /*---------------------------------------------------------------------------------------------------------*/


    this.LIGHT_0    = 0;
    this.LIGHT_1    = 1;
    this.LIGHT_2    = 2;
    this.LIGHT_3    = 3;
    this.LIGHT_4    = 4;
    this.LIGHT_5    = 5;
    this.LIGHT_6    = 6;
    this.LIGHT_7    = 7;
    this.MAX_LIGHTS = 8;

    this.MODEL_PHONG       = 0;
    this.MODEL_ANTISOPTRIC = 1;
    this.MODEL_FRESNEL     = 2;
    this.MODEL_BLINN       = 3;
    this.MODEL_FLAT        = 4;




    var l = this.MAX_LIGHTS;



    var uLightPosition             = this._uLightPosition             = new Array(l),
        uLightAmbient              = this._uLightAmbient              = new Array(l),
        uLightDiffuse              = this._uLightDiffuse              = new Array(l),
        uLightSpecular             = this._uLightSpecular             = new Array(l),
        uLightAttenuationConstant  = this._uLightAttenuationConstant  = new Array(l),
        uLightAttenuationLinear    = this._uLightAttenuationLinear    = new Array(l),
        uLightAttenuationQuadratic = this._uLightAttenuationQuadratic = new Array(l);

    var light;

    var i = -1;
    while(++i < l)
    {
        light = 'uLights['+i+'].';


        uLightPosition[i]             = gl.getUniformLocation(programScene,light + 'position');
        uLightAmbient[i]              = gl.getUniformLocation(programScene,light + 'ambient');
        uLightDiffuse[i]              = gl.getUniformLocation(programScene,light + 'diffuse');
        uLightSpecular[i]             = gl.getUniformLocation(programScene,light + 'specular');

        uLightAttenuationConstant[i]  = gl.getUniformLocation(programScene,light + 'constantAttenuation');
        uLightAttenuationLinear[i]    = gl.getUniformLocation(programScene,light + 'linearAttenuation');
        uLightAttenuationQuadratic[i] = gl.getUniformLocation(programScene,light + 'quadraticAttenuation');

        gl.uniform4fv(uLightPosition[i], new Float32Array([0,0,0,0]));
        gl.uniform3fv(uLightAmbient[i],  new Float32Array([0,0,0]));
        gl.uniform3fv(uLightDiffuse[i],  new Float32Array([0,0,0]));

        gl.uniform1f(uLightAttenuationConstant[i], 1.0);
        gl.uniform1f(uLightAttenuationLinear[i],   0.0);
        gl.uniform1f(uLightAttenuationQuadratic[i],0.0);
    }

    this._uMaterialEmission  = gl.getUniformLocation(programScene,'uMaterial.emission');
    this._uMaterialAmbient   = gl.getUniformLocation(programScene,'uMaterial.ambient');
    this._uMaterialDiffuse   = gl.getUniformLocation(programScene,'uMaterial.diffuse');
    this._uMaterialSpecular  = gl.getUniformLocation(programScene,'uMaterial.specular');
    this._uMaterialShininess = gl.getUniformLocation(programScene,'uMaterial.shininess');

    gl.uniform4f(this._uMaterialEmission, 0.0,0.0,0.0,1.0);
    gl.uniform4f(this._uMaterialAmbient,  1.0,0.5,0.5,1.0);
    gl.uniform4f(this._uMaterialDiffuse,  0.0,0.0,0.0,1.0);
    gl.uniform4f(this._uMaterialSpecular, 0.0,0.0,0.0,1.0);
    gl.uniform1f(this._uMaterialShininess,10.0);


    this._tempLightPos = Vec4.make();

    gl.uniform1f(this._uUseMaterial, 0.0);
    gl.uniform1f(this._uUseLighting, 0.0);
    gl.uniform1f(this._uUseMaterial, 0.0);
    gl.uniform1f(this._uPointSize,   1.0);


    /*---------------------------------------------------------------------------------------------------------*/
    // Bind constants
    /*---------------------------------------------------------------------------------------------------------*/

    this.ACTIVE_ATTRIBUTES= 35721; this.ACTIVE_TEXTURE= 34016; this.ACTIVE_UNIFORMS= 35718; this.ALIASED_LINE_WIDTH_RANGE= 33902; this.ALIASED_POINT_SIZE_RANGE= 33901; this.ALPHA= 6406; this.ALPHA_BITS= 3413; this.ALWAYS= 519 ; this.ARRAY_BUFFER= 34962 ; this.ARRAY_BUFFER_BINDING= 34964 ; this.ATTACHED_SHADERS= 35717 ; this.BACK= 1029 ; this.BLEND= 3042 ; this.BLEND_COLOR= 32773 ; this.BLEND_DST_ALPHA= 32970 ; this.BLEND_DST_RGB= 32968 ; this.BLEND_EQUATION= 32777 ; this.BLEND_EQUATION_ALPHA= 34877 ; this.BLEND_EQUATION_RGB= 32777 ; this.BLEND_SRC_ALPHA= 32971 ; this.BLEND_SRC_RGB= 32969 ; this.BLUE_BITS= 3412 ; this.BOOL= 35670 ; this.BOOL_VEC2= 35671 ; this.BOOL_VEC3= 35672 ; this.BOOL_VEC4= 35673 ; this.BROWSER_DEFAULT_WEBGL= 37444 ; this.BUFFER_SIZE= 34660 ; this.BUFFER_USAGE= 34661 ; this.BYTE= 5120 ; this.CCW= 2305 ; this.CLAMP_TO_EDGE= 33071 ; this.COLOR_ATTACHMENT0= 36064 ; this.COLOR_BUFFER_BIT= 16384 ; this.COLOR_CLEAR_VALUE= 3106 ; this.COLOR_WRITEMASK= 3107 ; this.COMPILE_STATUS= 35713 ; this.COMPRESSED_TEXTURE_FORMATS= 34467 ; this.CONSTANT_ALPHA= 32771 ; this.CONSTANT_COLOR= 32769 ; this.CONTEXT_LOST_WEBGL= 37442 ; this.CULL_FACE= 2884 ; this.CULL_FACE_MODE= 2885 ; this.CURRENT_PROGRAM= 35725 ; this.CURRENT_VERTEX_ATTRIB= 34342 ; this.CW= 2304 ; this.DECR= 7683 ; this.DECR_WRAP= 34056 ; this.DELETE_STATUS= 35712 ; this.DEPTH_ATTACHMENT= 36096 ; this.DEPTH_BITS= 3414 ; this.DEPTH_BUFFER_BIT= 256 ; this.DEPTH_CLEAR_VALUE= 2931 ; this.DEPTH_COMPONENT= 6402 ; this.DEPTH_COMPONENT16= 33189 ; this.DEPTH_FUNC= 2932 ; this.DEPTH_RANGE= 2928 ; this.DEPTH_STENCIL= 34041 ; this.DEPTH_STENCIL_ATTACHMENT= 33306 ; this.DEPTH_TEST= 2929 ; this.DEPTH_WRITEMASK= 2930 ; this.DITHER= 3024 ; this.DONT_CARE= 4352 ; this.DST_ALPHA= 772 ; this.DST_COLOR= 774 ; this.DYNAMIC_DRAW= 35048 ; this.ELEMENT_ARRAY_BUFFER= 34963 ; this.ELEMENT_ARRAY_BUFFER_BINDING= 34965 ; this.EQUAL= 514 ; this.FASTEST= 4353 ; this.FLOAT= 5126 ; this.FLOAT_MAT2= 35674 ; this.FLOAT_MAT3= 35675 ; this.FLOAT_MAT4= 35676 ; this.FLOAT_VEC2= 35664 ; this.FLOAT_VEC3= 35665 ; this.FLOAT_VEC4= 35666 ; this.FRAGMENT_SHADER= 35632 ; this.FRAMEBUFFER= 36160 ; this.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME= 36049 ; this.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE= 36048 ; this.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE= 36051 ; this.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL= 36050 ; this.FRAMEBUFFER_BINDING= 36006 ; this.FRAMEBUFFER_COMPLETE= 36053 ; this.FRAMEBUFFER_INCOMPLETE_ATTACHMENT= 36054 ; this.FRAMEBUFFER_INCOMPLETE_DIMENSIONS= 36057 ; this.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT= 36055 ; this.FRAMEBUFFER_UNSUPPORTED= 36061 ; this.FRONT= 1028 ; this.FRONT_AND_BACK= 1032 ; this.FRONT_FACE= 2886 ; this.FUNC_ADD= 32774 ; this.FUNC_REVERSE_SUBTRACT= 32779 ; this.FUNC_SUBTRACT= 32778 ; this.GENERATE_MIPMAP_HINT= 33170 ; this.GEQUAL= 518 ; this.GREATER= 516 ; this.GREEN_BITS= 3411 ; this.HIGH_FLOAT= 36338 ; this.HIGH_INT= 36341 ; this.INCR= 7682 ; this.INCR_WRAP= 34055 ; this.INT= 5124 ; this.INT_VEC2= 35667 ; this.INT_VEC3= 35668 ; this.INT_VEC4= 35669 ; this.INVALID_ENUM= 1280 ; this.INVALID_FRAMEBUFFER_OPERATION= 1286 ; this.INVALID_OPERATION= 1282 ; this.INVALID_VALUE= 1281 ; this.INVERT= 5386 ; this.KEEP= 7680 ; this.LEQUAL= 515 ; this.LESS= 513 ; this.LINEAR= 9729 ; this.LINEAR_MIPMAP_LINEAR= 9987 ; this.LINEAR_MIPMAP_NEAREST= 9985 ; this.LINES= 1 ; this.LINE_LOOP= 2 ; this.LINE_STRIP= 3 ; this.LINE_WIDTH= 2849; this.LINK_STATUS= 35714; this.LOW_FLOAT= 36336 ; this.LOW_INT= 36339 ; this.LUMINANCE= 6409 ; this.LUMINANCE_ALPHA= 6410; this.MAX_COMBINED_TEXTURE_IMAGE_UNITS= 35661 ; this.MAX_CUBE_MAP_TEXTURE_SIZE= 34076 ; this.MAX_FRAGMENT_UNIFORM_VECTORS= 36349 ; this.MAX_RENDERBUFFER_SIZE= 34024 ; this.MAX_TEXTURE_IMAGE_UNITS= 34930 ; this.MAX_TEXTURE_SIZE= 3379 ; this. MAX_VARYING_VECTORS= 36348 ; this.MAX_VERTEX_ATTRIBS= 34921 ; this.MAX_VERTEX_TEXTURE_IMAGE_UNITS= 35660 ; this.MAX_VERTEX_UNIFORM_VECTORS= 36347 ; this.MAX_VIEWPORT_DIMS= 3386 ; this.MEDIUM_FLOAT= 36337 ; this.MEDIUM_INT= 36340 ; this.MIRRORED_REPEAT= 33648 ; this.NEAREST= 9728 ; this.NEAREST_MIPMAP_LINEAR= 9986 ; this.NEAREST_MIPMAP_NEAREST= 9984 ; this.NEVER= 512 ; this.NICEST= 4354 ; this.NONE= 0 ; this.NOTEQUAL= 517 ; this.NO_ERROR= 0 ; this.ONE= 1 ; this.ONE_MINUS_CONSTANT_ALPHA= 32772 ; this.ONE_MINUS_CONSTANT_COLOR= 32770 ; this.ONE_MINUS_DST_ALPHA= 773 ; this.ONE_MINUS_DST_COLOR= 775 ; this.ONE_MINUS_SRC_ALPHA= 771 ; this.ONE_MINUS_SRC_COLOR= 769 ; this.OUT_OF_MEMORY= 1285 ; this.PACK_ALIGNMENT= 3333 ; this.POINTS= 0 ; this.POLYGON_OFFSET_FACTOR= 32824 ; this.POLYGON_OFFSET_FILL= 32823 ; this.POLYGON_OFFSET_UNITS= 10752 ; this.RED_BITS= 3410 ; this.RENDERBUFFER= 36161 ; this.RENDERBUFFER_ALPHA_SIZE= 36179 ; this.RENDERBUFFER_BINDING= 36007 ; this.RENDERBUFFER_BLUE_SIZE= 36178 ; this.RENDERBUFFER_DEPTH_SIZE= 36180 ; this.RENDERBUFFER_GREEN_SIZE= 36177 ; this.RENDERBUFFER_HEIGHT= 36163 ; this.RENDERBUFFER_INTERNAL_FORMAT= 36164 ; this.RENDERBUFFER_RED_SIZE= 36176 ; this.RENDERBUFFER_STENCIL_SIZE= 36181 ; this.RENDERBUFFER_WIDTH= 36162 ; this.RENDERER= 7937 ; this.REPEAT= 10497 ; this.REPLACE= 7681 ; this.RGB= 6407 ; this.RGB5_A1= 32855 ; this.RGB565= 36194 ; this.RGBA= 6408 ; this.RGBA4= 32854 ; this.SAMPLER_2D= 35678 ; this.SAMPLER_CUBE= 35680 ; this.SAMPLES= 32937 ; this.SAMPLE_ALPHA_TO_COVERAGE= 32926 ; this.SAMPLE_BUFFERS= 32936 ; this.SAMPLE_COVERAGE= 32928 ; this.SAMPLE_COVERAGE_INVERT= 32939 ; this.SAMPLE_COVERAGE_VALUE= 32938 ; this.SCISSOR_BOX= 3088 ; this.SCISSOR_TEST= 3089 ; this.SHADER_TYPE= 35663 ; this.SHADING_LANGUAGE_VERSION= 35724 ; this.SHORT= 5122 ; this.SRC_ALPHA= 770 ; this.SRC_ALPHA_SATURATE= 776 ; this.SRC_COLOR= 768 ; this.STATIC_DRAW= 35044 ; this.STENCIL_ATTACHMENT= 36128 ; this.STENCIL_BACK_FAIL= 34817 ; this.STENCIL_BACK_FUNC= 34816 ; this.STENCIL_BACK_PASS_DEPTH_FAIL= 34818 ; this.STENCIL_BACK_PASS_DEPTH_PASS= 34819 ; this.STENCIL_BACK_REF= 36003 ; this.STENCIL_BACK_VALUE_MASK= 36004 ; this.STENCIL_BACK_WRITEMASK= 36005 ; this.STENCIL_BITS= 3415 ; this.STENCIL_BUFFER_BIT= 1024 ; this.STENCIL_CLEAR_VALUE= 2961 ; this.STENCIL_FAIL= 2964 ; this.STENCIL_FUNC= 2962 ; this.STENCIL_INDEX= 6401 ; this.STENCIL_INDEX8= 36168 ; this.STENCIL_PASS_DEPTH_FAIL= 2965 ; this.STENCIL_PASS_DEPTH_PASS= 2966 ; this.STENCIL_REF= 2967 ; this.STENCIL_TEST= 2960 ; this.STENCIL_VALUE_MASK= 2963 ; this.STENCIL_WRITEMASK= 2968 ; this.STREAM_DRAW= 35040 ; this.SUBPIXEL_BITS= 3408 ; this.TEXTURE= 5890 ; this.TEXTURE0= 33984 ; this.TEXTURE1= 33985 ; this.TEXTURE2= 33986 ; this.TEXTURE3= 33987 ; this.TEXTURE4= 33988 ; this.TEXTURE5= 33989 ; this.TEXTURE6= 33990 ; this.TEXTURE7= 33991 ; this.TEXTURE8= 33992 ; this.TEXTURE9= 33993 ; this.TEXTURE10= 33994 ; this.TEXTURE11= 33995 ; this.TEXTURE12= 33996 ; this.TEXTURE13= 33997 ; this.TEXTURE14= 33998 ; this.TEXTURE15= 33999 ; this.TEXTURE16= 34000 ; this.TEXTURE17= 34001 ; this.TEXTURE18= 34002 ; this.TEXTURE19= 34003 ; this.TEXTURE20= 34004 ; this.TEXTURE21= 34005 ; this.TEXTURE22= 34006 ; this.TEXTURE23= 34007 ; this.TEXTURE24= 34008 ; this.TEXTURE25= 34009 ; this.TEXTURE26= 34010 ; this.TEXTURE27= 34011 ; this.TEXTURE28= 34012 ; this.TEXTURE29= 34013 ; this.TEXTURE30= 34014 ; this.TEXTURE31= 34015 ; this.TEXTURE_2D= 3553 ; this.TEXTURE_BINDING_2D= 32873 ; this.TEXTURE_BINDING_CUBE_MAP= 34068 ; this.TEXTURE_CUBE_MAP= 34067 ; this.TEXTURE_CUBE_MAP_NEGATIVE_X= 34070 ; this.TEXTURE_CUBE_MAP_NEGATIVE_Y= 34072 ; this.TEXTURE_CUBE_MAP_NEGATIVE_Z= 34074 ; this.TEXTURE_CUBE_MAP_POSITIVE_X= 34069 ; this.TEXTURE_CUBE_MAP_POSITIVE_Y= 34071 ; this.TEXTURE_CUBE_MAP_POSITIVE_Z= 34073 ; this.TEXTURE_MAG_FILTER= 10240 ; this.TEXTURE_MIN_FILTER= 10241 ; this.TEXTURE_WRAP_S= 10242 ; this.TEXTURE_WRAP_T= 10243 ; this.TRIANGLES= 4 ; this.TRIANGLE_FAN= 6 ; this.TRIANGLE_STRIP= 5 ; this.UNPACK_ALIGNMENT= 3317 ; this.UNPACK_COLORSPACE_CONVERSION_WEBGL= 37443 ; this.UNPACK_FLIP_Y_WEBGL= 37440 ; this.UNPACK_PREMULTIPLY_ALPHA_WEBGL= 37441 ; this.UNSIGNED_BYTE= 5121 ; this.UNSIGNED_INT= 5125 ; this.UNSIGNED_SHORT= 5123 ; this.UNSIGNED_SHORT_4_4_4_4= 32819 ; this.UNSIGNED_SHORT_5_5_5_1= 32820 ; this.UNSIGNED_SHORT_5_6_5= 33635 ; this.VALIDATE_STATUS= 35715 ; this.VENDOR= 7936 ; this.VERSION= 7938 ; this.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING= 34975 ; this.VERTEX_ATTRIB_ARRAY_ENABLED= 34338 ; this.VERTEX_ATTRIB_ARRAY_NORMALIZED= 34922 ; this.VERTEX_ATTRIB_ARRAY_POINTER= 34373 ; this.VERTEX_ATTRIB_ARRAY_SIZE= 34339 ; this.VERTEX_ATTRIB_ARRAY_STRIDE= 34340 ; this.VERTEX_ATTRIB_ARRAY_TYPE= 34341 ; this.VERTEX_SHADER= 35633 ; this.VIEWPORT= 2978 ; this.ZERO = 0 ;


    var SIZE_OF_VERTEX    = Vec3.SIZE,
        SIZE_OF_COLOR     = Color.SIZE,
        SIZE_OF_TEX_COORD = Vec2.SIZE;

    this.SIZE_OF_VERTEX    = SIZE_OF_VERTEX;
    this.SIZE_OF_NORMAL    = SIZE_OF_VERTEX;
    this.SIZE_OF_COLOR     = SIZE_OF_COLOR;
    this.SIZE_OF_TEX_COORD =  SIZE_OF_TEX_COORD;

    var SIZE_OF_FACE    = this.SIZE_OF_FACE   = SIZE_OF_VERTEX;

    var SIZE_OF_QUAD     = this.SIZE_OF_QUAD     = SIZE_OF_VERTEX * 4,
        SIZE_OF_TRIANGLE = this.SIZE_OF_TRIANGLE = SIZE_OF_VERTEX * 3,
        SIZE_OF_LINE     = this.SIZE_OF_LINE     = SIZE_OF_VERTEX * 2,
        SIZE_OF_POINT    = this.SIZE_OF_POINT    = SIZE_OF_VERTEX;

    var ELLIPSE_DETAIL_MAX = this.ELLIPSE_DETAIL_MAX = 30;
    this.ELLIPSE_DETAIL_MIN = 3;

    /*---------------------------------------------------------------------------------------------------------*/
    // Init shared buffers
    /*---------------------------------------------------------------------------------------------------------*/

    this.REPEAT        = gl.REPEAT;
    this.CLAMP         = gl.CLAMP;
    this.CLAMP_TO_EDGE = gl.CLAMP_TO_EDGE;

    this._texMode  = this.REPEAT;
    this._texSet   = false;

    this._texEmpty = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,this._texEmpty);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1,1,1,1]));
    gl.uniform1f(this._uUseTexture,0.0);

    this._tex      = null;

    this._defaultVBO = gl.createBuffer();
    this._defaultIBO = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,         this._defaultVBO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._defaultIBO);

    /*---------------------------------------------------------------------------------------------------------*/
    // Init flags and caches
    /*---------------------------------------------------------------------------------------------------------*/

    this._bUseLighting         = false;
    this._bUseMaterial         = false;
    this._bUseTexture          = false;

    this._bUseBillboarding     = false;

    this._bUseDrawArrayBatch        = false;
    this._bUseDrawElementArrayBatch = false;
    this._drawFuncLast = null;

    this._bBatchVertices  = [];
    this._bBatchNormals   = [];
    this._bBatchColors    = [];
    this._bBatchTexCoords = [];
    this._bBatchIndices   = [];

    this._bBatchVerticesNum = 0;



    this._bBVecRight = Vec3.make();
    this._bBVecUp    = Vec3.make();
    this._bBVertices = new Float32Array(4 * 3);

    this._bBVec0 = Vec3.make();
    this._bBVec1 = Vec3.make();
    this._bBVec2 = Vec3.make();
    this._bBVec3 = Vec3.make();

    this._rectWidthLast    = 0;
    this._rectHeightLast   = 0;


    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/

    this._camera    = null;

    this._mModeView = Mat44.make();
    this._mNormal   = Mat33.make();

    this._mTemp0 = Mat44.make();

    this._mStack = [];

    this._drawMode = this.LINES;

    /*---------------------------------------------------------------------------------------------------------*/
    // Init Buffers
    /*---------------------------------------------------------------------------------------------------------*/

    this._bEmpty3f = new Float32Array([0,0,0]);

    this._bColor4f   = Color.WHITE();
    this._bColorBg4f = Color.BLACK();

    this._bVertex   = null;
    this._bNormal   = null;
    this._bColor    = null;
    this._bTexCoord = null;
    this._bIndex    = null;

    this._bVertexPoint = new Float32Array(SIZE_OF_POINT);
    this._bColorPoint  = new Float32Array(SIZE_OF_COLOR);

    this._bVertexLine  = new Float32Array(SIZE_OF_LINE);
    this._bColorLine   = new Float32Array(2 * SIZE_OF_COLOR);

    this._bVertexTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bNormalTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bColorTriangle           = new Float32Array(3 * SIZE_OF_COLOR);
    this._bIndexTriangle           = new Uint16Array([0,1,2]);
    this._bTexCoordTriangleDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0]);
    this._bTexCoordTriangle        = new Float32Array(this._bTexCoordTriangleDefault.length);

    this._bVertexQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bNormalQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bColorQuad           = new Float32Array(4 * SIZE_OF_COLOR);
    this._bIndexQuad           = new Uint16Array([0,1,2,1,2,3]);
    this._bTexCoordQuadDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]);
    this._bTexCoordQuad        = new Float32Array(this._bTexCoordQuadDefault.length);

    this._bVertexRect = new Float32Array(SIZE_OF_QUAD);
    this._bNormalRect = new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]);
    this._bColorRect  = new Float32Array(4 * SIZE_OF_COLOR);

    this._bVertexEllipse   = new Float32Array(SIZE_OF_VERTEX * ELLIPSE_DETAIL_MAX);
    this._bNormalEllipse   = new Float32Array(this._bVertexEllipse.length);
    this._bColorEllipse    = new Float32Array(SIZE_OF_COLOR  * ELLIPSE_DETAIL_MAX);
    this._bTexCoordEllipse = new Float32Array(SIZE_OF_TEX_COORD * ELLIPSE_DETAIL_MAX);

    this._bVertexCircle   = new Float32Array(SIZE_OF_VERTEX * ELLIPSE_DETAIL_MAX);
    this._bNormalCircle   = new Float32Array(this._bVertexCircle.length);
    this._bColorCircle    = new Float32Array(SIZE_OF_COLOR * ELLIPSE_DETAIL_MAX);
    this._bTexCoordCircle = new Float32Array(SIZE_OF_TEX_COORD * ELLIPSE_DETAIL_MAX);

    this._bVertexCube       = new Float32Array([-0.5,-0.5, 0.5,
                                                0.5,-0.5, 0.5,
                                                0.5, 0.5, 0.5,
                                                -0.5, 0.5, 0.5,
                                                -0.5,-0.5,-0.5,
                                                -0.5, 0.5,-0.5,
                                                  0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5]);
    this._bVertexCubeScaled = new Float32Array(new Array(this._bVertexCube.length));
    this._bColorCube    = new Float32Array(this._bVertexCube.length / SIZE_OF_VERTEX * SIZE_OF_COLOR);
    this._bNormalCube   = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] );
    this._bIndexCube    = new Uint16Array([  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9,10, 8,10,11, 12,13,14,12,14,15, 16,17,18,16,18,19, 20,21,22,20,22,23]);
    this._bTexCoordCube = null;

    this._circleDetailLast = 10.0;
    this._sphereDetailLast = 10.0;
    this._sphereScaleLast  = -1;
    this._cubeScaleLast    = -1;

    this._bVertexSphere       = null;
    this._bVertexSphereScaled = null;
    this._bNormalSphere       = null;
    this._bColorSphere        = null;
    this._bIndexSphere        = null;
    this._bTexCoordsSphere    = null;

    this._bScreenCoords = [0,0];
    this._bPoint0       = [0,0,0];
    this._bPoint1       = [0,0,0];

    this._axisX = Vec3.AXIS_X();
    this._axisY = Vec3.AXIS_Y();
    this._axisZ = Vec3.AXIS_Z();

    this._lineBoxWidth  = 1;
    this._lineBoxHeight = 1;
    this._lineCylinderRadius = 0.5;

    this._genSphere();
    this._genCircle();

    /*---------------------------------------------------------------------------------------------------------*/
    // Init presets
    /*---------------------------------------------------------------------------------------------------------*/

    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    this.ambient(Color.BLACK());

}

/*---------------------------------------------------------------------------------------------------------*/
// Light
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.useLighting  = function(bool){this.gl.uniform1f(this._uUseLighting,bool ? 1.0 : 0.0);this._bUseLighting = bool;};
FGL.prototype.getLighting  = function()    {return this._bUseLighting;};

FGL.prototype.light = function(light)
{
    var id = light.getId(),
        gl = this.gl;

    var tempVec4    = this._tempLightPos;
        tempVec4[0] = light.position[0];
        tempVec4[1] = light.position[1];
        tempVec4[2] = light.position[2];
        tempVec4[3] = light.position[3];

    var lightPosEyeSpace = Mat44.multVec4(this._camera.modelViewMatrix,tempVec4);

    gl.uniform4fv(this._uLightPosition[id], lightPosEyeSpace);
    gl.uniform3fv(this._uLightAmbient[id],  light.ambient);
    gl.uniform3fv(this._uLightDiffuse[id],  light.diffuse);
    gl.uniform3fv(this._uLightSpecular[id], light.specular);

    gl.uniform1f(this._uLightAttenuationConstant[id],   light.constantAttentuation);
    gl.uniform1f(this._uLightAttenuationLinear[id],     light.linearAttentuation);
    gl.uniform1f(this._uLightAttenuationQuadratic[id],  light.quadricAttentuation);
};

//FIX ME
FGL.prototype.disableLight = function(light)
{
    var id = light.getId(),
        gl = this.gl;

    var bEmpty = this._bEmpty3f;

    gl.uniform3fv(this._uLightAmbient[id],  bEmpty);
    gl.uniform3fv(this._uLightDiffuse[id],  bEmpty);
    gl.uniform3fv(this._uLightSpecular[id], bEmpty);

    gl.uniform1f(this._uLightAttenuationConstant[id], 1.0);
    gl.uniform1f(this._uLightAttenuationLinear[id],   0.0);
    gl.uniform1f(this._uLightAttenuationQuadratic[id],0.0);
};

/*---------------------------------------------------------------------------------------------------------*/
// Texture
/*---------------------------------------------------------------------------------------------------------*/

//TODO: do it the plask way

FGL.prototype.useTexture  = function(bool){this.gl.uniform1f(this._uUseTexture, bool ? 1.0 : 0.0);this._bUseTexture = bool;};

FGL.prototype.loadTextureWithImage = function(img)
{
    var gl = this.gl,
        glTex = gl.createTexture();
    glTex.image = img;

    var tex = new Texture(glTex);
    this._bindTexImage(tex._tex);

    return tex;

};

FGL.prototype.loadTexture = function(src,texture,callback)
{
    var gl  = this.gl,
        glTex = gl.createTexture();
    glTex.image = new Image();

    glTex.image.addEventListener('load',function()
    {
        texture.setTexSource(this._bindTexImage(glTex));
        callback();
    });

    glTex.image.src = src;
};

FGL.prototype._bindTexImage = function(glTex)
{
    if(!glTex.image)throw ('Texture image is null.');

    var width  = glTex.image.width,
        height = glTex.image.height;

    if((width&(width-1)!=0))       {throw 'Texture image width is not power of 2.'; }
    else if((height&(height-1))!=0){throw 'Texture image height is not power of 2.';}

    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D,glTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTex.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D,null);


    return glTex;
};

FGL.prototype.texture = function(texture)
{
    var gl = this.gl;

    this._tex = texture._tex;
    gl.bindTexture(gl.TEXTURE_2D,this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._texMode );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._texMode );
    gl.uniform1i(this._uTexImage,0);
};

FGL.prototype.disableTextures = function()
{
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D,this._texEmpty);
    gl.vertexAttribPointer(this._aVertexTexCoord,Vec2.SIZE,gl.FLOAT,false,0,0);
    gl.uniform1f(this._uUseTexture,0.0);
};

/*---------------------------------------------------------------------------------------------------------*/
// Material
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.useMaterial = function(bool){this.gl.uniform1f(this._uUseMaterial,bool ? 1.0 : 0.0);this._bUseMaterial = bool;};

FGL.prototype.material = function(material)
{
    var gl = this.gl;

    //gl.uniform4fv(this._uMaterialEmission,  material.emission);
    gl.uniform4fv(this._uMaterialAmbient,   material.ambient);
    gl.uniform4fv(this._uMaterialDiffuse,   material.diffuse);
    gl.uniform4fv(this._uMaterialSpecular,  material.specular);
    gl.uniform1f( this._uMaterialShininess, material.shininess);
};

/*---------------------------------------------------------------------------------------------------------*/
// Camera
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.loadIdentity = function(){this._mModelView = Mat44.identity(this._camera.modelViewMatrix);};
FGL.prototype.pushMatrix   = function(){this._mStack.push(Mat44.copy(this._mModelView));};
FGL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw ('Invalid pop!');
    this._mModelView = stack.pop();

    return this._mModelView;
};

FGL.prototype.setMatricesUniform = function()
{
    var gl = this.gl;

    gl.uniformMatrix4fv(this._uModelViewMatrix,false,this._mModelView);
    gl.uniformMatrix4fv(this._uProjectionMatrix,false,this._camera.projectionMatrix);

    if(!this._bUseLighting)return;

    Mat44.toMat33Inversed(this._mModelView,this._mNormal);
    Mat33.transpose(this._mNormal,this._mNormal);

    gl.uniformMatrix3fv(this._uNormalMatrix,false,this._mNormal);
};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack transformations
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.translate     = function(v)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(v[0],v[1],v[2],Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.translate3f   = function(x,y,z)      {Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,y,z,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.translateX    = function(x)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,0,0,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.translateY    = function(y)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,y,0,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.translateZ    = function(z)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,0,z,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.scale         = function(v)          {Mat44.multPost(this._mModelView,Mat44.makeScale(v[0],v[1],v[2],Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.scale1f       = function(n)          {Mat44.multPost(this._mModelView,Mat44.makeScale(n,n,n,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.scale3f       = function(x,y,z)      {Mat44.multPost(this._mModelView,Mat44.makeScale(x,y,z,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.scaleX        = function(x)          {Mat44.multPost(this._mModelView,Mat44.makeScale(x,1,1,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.scaleY        = function(y)          {Mat44.multPost(this._mModelView,Mat44.makeScale(1,y,1,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.scaleZ        = function(z)          {Mat44.multPost(this._mModelView,Mat44.makeScale(1,1,z,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.rotate        = function(v)          {Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(v[0],v[1],v[2],Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.rotate3f      = function(x,y,z)      {Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(x,y,z,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.rotateX       = function(x)          {Mat44.multPost(this._mModelView,Mat44.makeRotationX(x,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.rotateY       = function(y)          {Mat44.multPost(this._mModelView,Mat44.makeRotationY(y,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.rotateZ       = function(z)          {Mat44.multPost(this._mModelView,Mat44.makeRotationZ(z,Mat44.identity(this._mTemp0)),this._mModelView);};
FGL.prototype.rotateAxis    = function(angle,v)    {Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,v[0],v[1],v[2]),this._mModelView);};
FGL.prototype.rotateAxis3f  = function(angle,x,y,z){Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,x,y,z),this._mModelView);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/


FGL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexArray,mode,count,offset,type,drawType)
{
    var gl = this.gl;

    this.bufferArrays(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexArray,drawType || gl.DYNAMIC_DRAW);
    gl.drawElements(mode  || this.TRIANGLES,
                    count || indexArray.length,
                    type  || gl.UNSIGNED_SHORT,
                    offset || 0);
};


FGL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{

    this.bufferArrays(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    this.gl.drawArrays(mode  || this._drawMode,
                       first || 0,
                       count || vertexFloat32Array.length / this.SIZE_OF_VERTEX);
};

FGL.prototype.drawGeometry = function(geom,count,offset) {geom._draw(this,count,offset);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience filling default vbo
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.bufferArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordFloat32Array,glDrawMode)
{
    var na = normalFloat32Array   ? true : false,
        ca = colorFloat32Array    ? true : false,
        ta = texCoordFloat32Array ? true : false;

    var aVertexNormal   = this._aVertexNormal,
        aVertexColor    = this._aVertexColor,
        aVertexTexCoord = this._aVertexTexCoord;

    var gl            = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    glDrawMode = glDrawMode || gl.DYNAMIC_DRAW;

    var vblen =      vertexFloat32Array.byteLength,
        nblen = na ? normalFloat32Array.byteLength : 0,
        cblen = ca ? colorFloat32Array.byteLength   : 0,
        tblen = ta ? texCoordFloat32Array.byteLength : 0;

    var offsetV = 0,
        offsetN = offsetV + vblen,
        offsetC = offsetN + nblen,
        offsetT = offsetC + cblen;

    gl.bufferData(glArrayBuffer, vblen + nblen + cblen + tblen, glDrawMode);

    gl.bufferSubData(glArrayBuffer, offsetV, vertexFloat32Array);
    gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);

    if(!na){ gl.disableVertexAttribArray(aVertexNormal);}
    else
    {
        gl.enableVertexAttribArray(aVertexNormal);
        gl.bufferSubData(glArrayBuffer,offsetN,normalFloat32Array);
        gl.vertexAttribPointer(aVertexNormal,this.SIZE_OF_NORMAL,glFloat,false,0,offsetN);
    }

    if(!ca){ gl.disableVertexAttribArray(aVertexColor); }
    {
        gl.enableVertexAttribArray(aVertexColor);
        gl.bufferSubData(glArrayBuffer, offsetC, colorFloat32Array);
        gl.vertexAttribPointer(aVertexColor, this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);
    }

    if(!ta){ gl.disableVertexAttribArray(aVertexTexCoord);}
    else
    {
        gl.enableVertexAttribArray(aVertexTexCoord);
        gl.bufferSubData(glArrayBuffer,offsetT,texCoordFloat32Array);
        gl.vertexAttribPointer(aVertexTexCoord,this.SIZE_OF_TEX_COORD,glFloat,false,0,offsetT);
    }
};


FGL.prototype.bufferColors = function(color,buffer)
{
    //if(this._bUseMaterial || this._bUseTexture)return null;

    //hm, fix me
    if(this._bUseMaterial || this._bUseTexture)return buffer;

    var i = 0;

    if(color.length == 4)
    {
        while(i < buffer.length)
        {
            buffer[i]  =color[0];
            buffer[i+1]=color[1];
            buffer[i+2]=color[2];
            buffer[i+3]=color[3];
            i+=4;
        }
    }
    else
    {
        if(color.length != buffer.length)
        {
            throw new Error(fError.COLORS_IN_WRONG_SIZE);
        }

        while(i < buffer.length)
        {
            buffer[i]   = color[i];
            buffer[i+1] = color[i+1];
            buffer[i+2] = color[i+2];
            buffer[i+3] = color[i+3];
            i+=4;
        }
    }

    return buffer;
};

FGL.prototype.bufferVertices = function(vertices,buffer)
{
    if(vertices.length != buffer.length)throw (fError.VERTICES_IN_WRONG_SIZE + buffer.length + '.');
    var i = -1;while(++i < buffer.length)buffer[i] = vertices[i];
    return buffer;
};

/*---------------------------------------------------------------------------------------------------------*/
// Helpers
/*---------------------------------------------------------------------------------------------------------*/


FGL.prototype._scaleVertices = function(vert0,scale,vert1)
{
    if(!scale)return vert0;
    var i = -1, l = vert0.length;while(++i < l)vert1[i] = vert0[i] * scale;return vert1;
};


/*---------------------------------------------------------------------------------------------------------*/
// Batch
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype._putComp = function(orig,target)
{

};

FGL.prototype.beginDrawArrayBatch = function()
{
    this._bUseDrawArrayBatch = true;


};

FGL.prototype.endDrawArrayBatch = function()
{
    this._bUseDrawArrayBatch = false;

};

FGL.prototype.drawArrayBatch = function()
{

};

FGL.prototype.beginDrawElementArrayBatch = function()
{
    this._bUseDrawElementArrayBatch = true;

    this._bBatchVertices.length = 0;

};

FGL.prototype.endDrawElementArrayBatch = function()
{
    this._bUseDrawElementArrayBatch = false;


};

FGL.prototype._pushElementArrayBatch = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordsFloat32Array,indexUint16Array)
{

    var transMatrix = this._mModelView;

    var offsetIndex = this._bBatchVertices.length / 3;
    var offset,length,index;

    var batchVertices        = this._bBatchVertices,
        batchVerticesOffset  = batchVertices.length;
        batchVertices.length+= vertexFloat32Array.length;

        offset = batchVerticesOffset;
        length = batchVertices.length;
        index  = 0;

    while(offset < length)
    {

        batchVertices[offset  ] = vertexFloat32Array[index  ];
        batchVertices[offset+1] = vertexFloat32Array[index+1];
        batchVertices[offset+2] = vertexFloat32Array[index+2];

        Mat44.multVec3AI(transMatrix,batchVertices,offset);

        offset+=3;
        index +=3;
    }


    if(normalFloat32Array   )this._putBatch(this._bBatchNormals,normalFloat32Array);
    if(colorFloat32Array    )this._putBatch(this._bBatchColors,colorFloat32Array);
    if(texCoordsFloat32Array)this._putBatch(this._bBatchTexCoords,texCoordsFloat32Array);


    var batchIndices        = this._bBatchIndices,
        batchIndicesOffset  = batchIndices.length;
        batchIndices.length+= indexUint16Array.length;

        offset = batchIndicesOffset;
        length = batchIndices.length;
        index  = 0;

    while(offset < length){batchIndices[offset] = indexUint16Array[index] + offsetIndex;offset++;index++;}

};

FGL.prototype.drawElementArrayBatch = function(batch)
{
    if(!batch){}

    this.drawElements(new Float32Array(this._bBatchVertices),
                      new Float32Array(this._bBatchNormals),
                      new Float32Array(this._bBatchColors),
                      new Float32Array(this._bBatchTexCoords),
                      new Uint16Array( this._bBatchIndices),
                      this.getDrawMode());
};

FGL.prototype._putBatch = function(batchArray,dataArray)
{
    var batchOffset   = batchArray.length;
    batchArray.length+= dataArray.length;

    var len = batchArray.length;
    var index = 0;

    while(batchOffset < len){batchArray[batchOffset++] = dataArray[index++];}
};




/*---------------------------------------------------------------------------------------------------------*/
// Convenience Methods color
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.ambient   = function(color){this.gl.uniform3f(this._uAmbient,color[0],color[1],color[2]);};
FGL.prototype.ambient3f = function(r,g,b){this.gl.uniform3f(this._uAmbient,r,g,b);};
FGL.prototype.ambient1f = function(k)    {this.gl.uniform1f(this._uAmbient,k);};

FGL.prototype.color   = function(color)  {this._bColor = Color.set(this._bColor4f,color);};
FGL.prototype.color4f = function(r,g,b,a){this._bColor = Color.set4f(this._bColor4f,r,g,b,a);};
FGL.prototype.color3f = function(r,g,b)  {this._bColor = Color.set3f(this._bColor4f,r,g,b);};
FGL.prototype.color2f = function(k,a)    {this._bColor = Color.set2f(this._bColor4f,k,a);};
FGL.prototype.color1f = function(k)      {this._bColor = Color.set1f(this._bColor4f,k);};
FGL.prototype.colorfv = function(array)  {this._bColor = array;};

FGL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
FGL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
FGL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
FGL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
FGL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
FGL.prototype.clear4f   = function(r,g,b,a)
{
    var c  = Color.set4f(this._bColorBg4f,r,g,b,a);
    var gl = this.gl;
    gl.clearColor(c[0],c[1],c[2],c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


FGL.prototype.getColorBuffer = function(){return this._bColor;};
FGL.prototype.getClearBuffer = function(){return this._bColorBg4f;};

/*---------------------------------------------------------------------------------------------------------*/
// Methods draw properties
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.drawMode = function(mode){this._drawMode = mode;};
FGL.prototype.getDrawMode = function(){return this._drawMode;};

FGL.prototype.sphereDetail = function(detail)
{
    if(detail == this._sphereDetailLast)return;
    this._sphereDetailLast = detail;
    this._genSphere();
};

FGL.prototype.circleDetail = function(detail)
{
    if(detail == this._circleDetailLast )return;
    this._circleDetailLast  = Math.max(this.ELLIPSE_DETAIL_MIN,Math.min(detail,this.ELLIPSE_DETAIL_MAX));
    this._cirlceVertexCount = this._circleDetailLast * 3;
    this._genCircle();
};

FGL.prototype.lineWidth = function(size){this.gl.lineWidth(size);};

FGL.prototype.useBillboard = function(bool){this._bUseBillboarding = bool;};
FGL.prototype.pointSize = function(value){this.gl.uniform1f(this._uPointSize,value);};


/*---------------------------------------------------------------------------------------------------------*/
// Methods draw primitives
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.point = function(vector)
{
    if(vector.length == 0)return;

    var bColorPoint = this._bColorPoint,
        bColor      = this._bColor;

    bColorPoint[0] = bColor[0];
    bColorPoint[1] = bColor[1];
    bColorPoint[2] = bColor[2];
    bColorPoint[3] = bColor[3];

    var gl = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    var vblen = vector.byteLength,
        cblen = bColor.byteLength;

    var offsetV = 0,
        offsetC = vblen;

    gl.bufferData(glArrayBuffer,vblen + cblen,gl.STATIC_DRAW);

    gl.bufferSubData(glArrayBuffer, offsetV, vector);
    gl.bufferSubData(glArrayBuffer, offsetC, bColor);

    gl.disableVertexAttribArray(this._aVertexNormal);
    gl.disableVertexAttribArray(this._aVertexTexCoord);

    gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);
    gl.vertexAttribPointer(this._aVertexColor,    this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);

    this.setMatricesUniform();
    gl.drawArrays(this._drawMode,0,1);

    gl.enableVertexAttribArray(this._aVertexNormal);
    gl.enableVertexAttribArray(this._aVertexTexCoord);

    this._drawFuncLast = this.point;
};

FGL.prototype.points = function(vertices,colors)
{
    if(vertices.length == 0)return;

    colors = colors || this.bufferColors(this._bColor4f,new Float32Array(vertices.length / 3 * 4));

    var gl            = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    var vblen = vertices.byteLength,
        cblen = colors.byteLength;

    var offsetV = 0,
        offsetC = vblen;

    gl.bufferData(glArrayBuffer,vblen + cblen,gl.STATIC_DRAW);

    gl.bufferSubData(glArrayBuffer, offsetV, vertices);
    gl.bufferSubData(glArrayBuffer, offsetC, colors);

    gl.disableVertexAttribArray(this._aVertexNormal);
    gl.disableVertexAttribArray(this._aVertexTexCoord);

    gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);
    gl.vertexAttribPointer(this._aVertexColor,    this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);

    this.setMatricesUniform();
    gl.drawArrays(this._drawMode,0,vertices.length/3);

    gl.enableVertexAttribArray(this._aVertexNormal);
    gl.enableVertexAttribArray(this._aVertexTexCoord);

    this._drawFuncLast = this.points;
};

FGL.prototype.point3f = function(x,y,z){this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = z;this.point(this._bVertexPoint);};
FGL.prototype.point2f = function(x,y)  {this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = 0;this.point(this._bVertexPoint);};
FGL.prototype.pointv  = function(arr)  {this._bVertexPoint[0] = arr[0];this._bVertexPoint[1] = arr[1];this._bVertexPoint[2] = arr[2];this.point(this._bVertexPoint);};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bVertexLine;
    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorLine),null,this._drawMode);

    this._drawFuncLast = this.linef;
};

FGL.prototype.line  = function(vertices)
{
    if(vertices.length == 0)return;
    this.drawArrays(this.bufferArrays(vertices,this._bVertexLine),null,this.bufferColors(this._bColor,this._bColorLine),null,this._drawMode,0, 2);

    this._drawFuncLast = this.line;
};

FGL.prototype.linev = function(vertices)
{
    if(vertices.length == 0)return;
    var v = new Float32Array(vertices),
        l = vertices.length / this.SIZE_OF_VERTEX;
    this.drawArrays(v,null,this.bufferColors(this._bColor, new Float32Array(l*this.SIZE_OF_COLOR)),null,this._drawMode,0, l);

    this._drawFuncLast = this.linev;
};

FGL.prototype.line2fv = function(v0,v1){this.linef(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.quadf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3)
{
    var v = this._bVertexQuad;

    v[ 0] = x0;v[ 1] = y0;v[ 2] = z0;
    v[ 3] = x1;v[ 4] = y1;v[ 5] = z1;
    v[ 6] = x2;v[ 7] = y2;v[ 8] = z2;
    v[ 9] = x3;v[10] = y3;v[11] = z3;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorQuad),null,this._drawMode,0,4);

    this._drawFuncLast = this.quadf;
};

FGL.prototype.quadv = function(v0,v1,v2,v3)
{
    this.quadf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2],v2[0],v2[1],v2[2],v3[0],v3[1],v3[2]);
};

FGL.prototype.quad = function(vertices,normals,texCoords)
{
    this.drawArrays(this.bufferArrays(vertices,this._bVertexQuad),normals,this.bufferColors(this._bColor,this._bColorQuad),texCoords,this._drawMode,0,4);

    this._drawFuncLast = this.quad;
};

/*---------------------------------------------------------------------------------------------------------*/

//TODO:cleanup
FGL.prototype.rect = function(width,height)
{
    height = height || width;

    var vertices = this._bVertexRect;

    if(this._bUseBillboarding)
    {
        //23
        //01

        var modelViewMatrix = this._mModelView;

        var vecRightX = modelViewMatrix[0],
            vecRightY = modelViewMatrix[4],
            vecRightZ = modelViewMatrix[8];

        var vecUpX = modelViewMatrix[1],
            vecUpY = modelViewMatrix[5],
            vecUpZ = modelViewMatrix[9];


        vertices[ 0] = (-vecRightX - vecUpX) * width;
        vertices[ 1] = (-vecRightY - vecUpY) * width;
        vertices[ 2] = (-vecRightZ - vecUpZ) * width;

        vertices[ 3] = (vecRightX - vecUpX) * width;
        vertices[ 4] = (vecRightY - vecUpY) * width;
        vertices[ 5] = (vecRightZ - vecUpZ) * width;

        vertices[ 6] = (vecRightX + vecUpX) * width;
        vertices[ 7] = (vecRightY + vecUpY) * width;
        vertices[ 8] = (vecRightZ + vecUpZ) * width;

        vertices[ 9] = (-vecRightX + vecUpX) * width;
        vertices[10] = (-vecRightY + vecUpY) * width;
        vertices[11] = (-vecRightZ + vecUpZ) * width;

    }
    else if(width != this._rectWidthLast || height != this._rectHeightLast)
    {
        vertices[0] = vertices[1] = vertices[2] = vertices[4] = vertices[5] = vertices[7] = vertices[9] = vertices[10] = 0;
        vertices[3] = vertices[6] = width; vertices[8] = vertices[11] = height;

        this._rectWidthLast  = width;
        this._rectHeightLast = height;
    }

    this.drawArrays(vertices,this._bNormalRect,this.bufferColors(this._bColor,this._bColorRect),this._bTexCoordQuadDefault,this._drawMode,0,4);

    this._drawFuncLast = this.rect;
};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.triangle = function(v0,v1,v2)
{
    var v = this._bVertexTriangle;
    v[0] = v0[0];v[1] = v0[1];v[2] = v0[2];
    v[3] = v1[0];v[4] = v1[1];v[5] = v1[2];
    v[6] = v2[0];v[7] = v2[1];v[8] = v2[2];

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);

    this._drawFuncLast = this.triangle;
};

FGL.prototype.trianglef = function(v0,v1,v2,v3,v4,v5,v6,v7,v8)
{
    var v = this._bVertexTriangle;
    v[0] = v0;v[1] = v1;v[2] = v2;
    v[3] = v3;v[4] = v4;v[5] = v5;
    v[6] = v6;v[7] = v7;v[8] = v8;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);

    this._drawFuncLast = this.trianglef;
};

FGL.prototype.trianglev = function(vertices,normals,texCoords)
{
    this.drawArrays(this.bufferArrays(vertices,this._bVertexTriangle),normals,this.bufferColors(this._bColor,this._bColorTriangle),texCoords,this._drawMode,0,3);
    this._drawFuncLast = this.trianglev;
};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.circle3f = function(x,y,z,radius)
{
    radius = radius || 0.5;

    this.pushMatrix();
    this.translate3f(x,y,z);
    this.scale1f(radius);
    this.drawArrays(this._bVertexCircle,this._bNormalCircle,this.bufferColors(this._bColor,this._bColorCircle),this._bTexCoordCircle,this.getDrawMode(),0,this._circleDetailLast);
    this.popMatrix();

    this._drawFuncLast = this.linef;
};

FGL.prototype.cirlce2f = function(x,y,radius){this.circle3f(x,0,y,radius);};
FGL.prototype.circle = function(radius){this.circle3f(0,0,0,radius)};
FGL.prototype.circlev = function(v,radius){this.circle3f(v[0],v[1],v[2],radius);};
FGL.prototype.circles = function(centers,radii){};

/*---------------------------------------------------------------------------------------------------------*/
// Geometry gen
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype._genSphere = function()
{
    var segments = this._sphereDetailLast;

    var vertices  = [],
        normals   = [],
        texCoords = [],
        indices   = [];

    var theta,thetaSin,thetaCos;
    var phi,phiSin,phiCos;

    var x,y,z;
    var u,v;

    var i = -1,j;

    var index,
        indexVertices,
        indexNormals,
        indexTexCoords;

    while(++i <= segments)
    {
        theta = i * Math.PI / segments;
        thetaSin = Math.sin(theta);
        thetaCos = Math.cos(theta);

        j = -1;
        while(++j <= segments)
        {
            phi    = j * 2 * Math.PI / segments;
            phiSin = Math.sin(phi);
            phiCos = Math.cos(phi);

            x = phiCos * thetaSin;
            y = thetaCos;
            z = phiSin * thetaSin;

            index          = j + segments * i;
            indexVertices  = indexNormals = index * 3;
            indexTexCoords = index * 2;

            normals.push(x,y,z);
            vertices.push(x,y,z);

            u = 1 - j / segments;
            v = 1 - i / segments;

            texCoords.push(u,v);

        }


    }

    var index0,index1,index2;

    i = -1;
    while(++i < segments)
    {
        j = -1;
        while(++j < segments)
        {
            index0 = j + i * (segments + 1);
            index1 = index0 + segments + 1;
            index2 = index0 + 1;

            indices.push(index0,index1,index2);

            index2 = index0 + 1;
            index0 = index1;
            index1 = index0 + 1;

            indices.push(index0,index1,index2);
        }
    }

    this._bVertexSphere       = new Float32Array(vertices);
    this._bVertexSphereScaled = new Float32Array(vertices);
    this._bNormalSphere       = new Float32Array(normals);
    this._bColorSphere        = new Float32Array(segments * segments * 4);
    this._bTexCoordsSphere    = new Float32Array(indices);
    this._bIndexSphere        = new Uint16Array(indices);
};

FGL.prototype._genCircle = function()
{
    var cx = 0,
        cy = 0;

    var d = this._circleDetailLast,
        v = this._bVertexCircle,
        l = d * 3;

    var i = 0;

    var theta = 2 * Math.PI / d,
        c = Math.cos(theta),
        s = Math.sin(theta),
        t;

    var ox = 1,
        oy = 0;

    while(i < l)
    {
        v[i  ] = ox + cx;
        v[i+1] = 0;
        v[i+2] = oy + cy;

        t  = ox;
        ox = c * ox - s * oy;
        oy = s * t  + c * oy;

        i+=3;
    }
};

/*---------------------------------------------------------------------------------------------------------*/
// default vbo/ibo / shader attributes
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.getDefaultVBO  = function(){return this._defaultVBO;};
FGL.prototype.getDefaultIBO  = function(){return this._defaultIBO;};
FGL.prototype.bindDefaultVBO = function(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._defaultVBO);};
FGL.prototype.bindDefaultIBO = function(){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._defaultIBO);};

FGL.prototype.getDefaultVertexAttrib   = function(){return this._aVertexPosition;};
FGL.prototype.getDefaultNormalAttrib   = function(){return this._aVertexNormal;};
FGL.prototype.getDefaultColorAttrib    = function(){return this._aVertexColor;};
FGL.prototype.getDefaultTexCoordAttrib = function(){return this._aVertexTexCoord;};

FGL.prototype.enableDefaultVertexAttribArray     = function(){this.gl.enableVertexAttribArray(this._aVertexPosition);};
FGL.prototype.enableDefaultNormalAttribArray     = function(){this.gl.enableVertexAttribArray(this._aVertexNormal);};
FGL.prototype.enableDefaultColorAttribArray      = function(){this.gl.enableVertexAttribArray(this._aVertexColor);};
FGL.prototype.enableDefaultTexCoordsAttribArray  = function(){this.gl.enableVertexAttribArray(this._aVertexTexCoord);};

FGL.prototype.disableDefaultVertexAttribArray    = function(){this.gl.disableVertexAttribArray(this._aVertexPosition);};
FGL.prototype.disableDefaultNormalAttribArray    = function(){this.gl.disableVertexAttribArray(this._aVertexNormal);};
FGL.prototype.disableDefaultColorAttribArray     = function(){this.gl.disableVertexAttribArray(this._aVertexColor);};
FGL.prototype.disableDefaultTexCoordsAttribArray = function(){this.gl.disableVertexAttribArray(this._aVertexTexCoord);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/

//TODO:remove

FGL.prototype.box = function(width,height,depth)
{
    this.pushMatrix();
    this.scale3f(width,height,depth);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.bufferColors(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();

    this._drawFuncLast = this.box;
};

FGL.prototype.cube = function(size)
{
    size = size || 1;

    var cubeScaleLast    = this._cubeScaleLast,
        cubeVerticesLast = this._bVertexCubeScaled;

    if(this._bUseDrawElementArrayBatch)
    {
        this._pushElementArrayBatch((size == cubeScaleLast) ? cubeVerticesLast :
                                    this._scaleVertices(this._bVertexCube,size,cubeVerticesLast),
                                    this._bNormalCube,
                                    this.bufferColors(this._bColor,this._bColorCube),
                                    this._bTexCoordCube,
                                    this._bIndexCube);

    }
    else
    {
        this.drawElements((size == cubeScaleLast) ? cubeVerticesLast :
                          this._scaleVertices(this._bVertexCube,size,cubeVerticesLast),
                          this._bNormalCube,
                          this.bufferColors(this._bColor,this._bColorCube),
                          this._bTexCoordCube,
                          this._bIndexCube,
                          this._drawMode);

    }


    this._cubeScaleLast = size;
    this._drawFuncLast  = this.cube;

};

FGL.prototype.sphere = function(size)
{
    size = size || 1;

    var sphereScaleLast      = this._sphereScaleLast,
        sphereVerticesScaled = this._bVertexSphereScaled;

    if(this._bUseDrawElementArrayBatch)
    {
        this._pushElementArrayBatch((size == sphereScaleLast) ? sphereVerticesScaled :
                                    this._scaleVertices(this._bVertexSphere,size,sphereVerticesScaled),
                                    this._bNormalSphere,
                                    this.bufferColors(this._bColor,this._bColorSphere),
                                    this._bTexCoordsSphere,
                                    this._bIndexSphere);
    }
    else
    {
        this.drawElements((size == sphereScaleLast) ? sphereVerticesScaled :
                          this._scaleVertices(this._bVertexSphere,size,sphereVerticesScaled),
                          this._bNormalSphere,
                          this.bufferColors(this._bColor,this._bColorSphere),
                          this._bTexCoordsSphere,
                          this._bIndexSphere,
                          this._drawMode);

    }

    this._sphereScaleLast = size;
    this._drawFuncLast    = this.sphere;
};

//TODO: remove !!!!!!!!!!!!!!!

FGL.prototype.lineBox = function(v0,v1){this.lineBoxf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

FGL.prototype.lineBoxf = function(x0,y0,z0,x1,y1,z1)
{


    var p0 = this._bPoint0,
        p1 = this._bPoint1,
        up = this._axisY;

    Vec3.set3f(p0,x0,y0,z0);
    Vec3.set3f(p1,x1,y1,z1);

    var len = Vec3.distance(p0,p1),
        mid = Vec3.scale(Vec3.added(p0,p1),0.5),
        dir = Vec3.normalize(Vec3.subbed(p1,p0)),
        c   = Vec3.dot(dir,up);

    var angle = Math.acos(c),
        axis  = Vec3.normalize(Vec3.cross(up,dir));

    this.pushMatrix();
    this.translate(mid);
    this.rotateAxis(angle,axis);
    this.box(this._lineBoxWidth,len,this._lineBoxHeight);
    this.popMatrix();
};

/*---------------------------------------------------------------------------------------------------------*/
// convenience bindings gl
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.enable                = function(id){this.gl.enable(id);};
FGL.prototype.disable               = function(id){this.gl.disable(id);};

FGL.prototype.blendColor            = function(r,g,b,a){this.gl.blendColor(r,g,b,a);};
FGL.prototype.blendEquation         = function(mode){this.gl.blendEquation(mode);};
FGL.prototype.blendEquationSeparate = function(sfactor,dfactor){this.gl.blendEquationSeparate(sfactor,dfactor);};
FGL.prototype.blendFunc             = function(sfactor,dfactor){this.gl.blendFunc(sfactor,dfactor);};
FGL.prototype.blendFuncSeparate     = function(srcRGB,dstRGB,srcAlpha,dstAlpha){this.gl.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);};
FGL.prototype.depthFunc             = function(func){this.gl.depthFunc(func);};
FGL.prototype.sampleCoverage        = function(value,invert){this.gl.sampleCoverage(value,invert);};
FGL.prototype.stencilFunc           = function(func,ref,mask){this.gl.stencilFunc(func,ref,mask);};
FGL.prototype.stencilFuncSeparate   = function(face,func,ref,mask){this.gl.stencilFuncSeparate(face,func,ref,mask);};
FGL.prototype.stencilOp             = function(fail,zfail,zpass){this.gl.stencilOp(fail,zfail,zpass);};
FGL.prototype.stencilOpSeparate     = function(face,fail,zfail,zpass){this.gl.stencilOpSeparate(face,fail,zfail,zpass);};

/*---------------------------------------------------------------------------------------------------------*/
// World -> Screen
/*---------------------------------------------------------------------------------------------------------*/

//TODO: Fix me
FGL.prototype.getScreenCoord3f = function(x,y,z)
{
    var mpm = Mat44.mult(this._camera.projectionMatrix,this._mModelView);
    var p3d = Mat44.multVec3(mpm,Vec3.make(x,y,z));

    var bsc = this._bScreenCoords;
    bsc[0] = (((p3d[0] + 1) * 0.5) * window.innerWidth);
    bsc[1] = (((1 - p3d[1]) * 0.5) * window.innerHeight);

    return bsc;
};

FGL.prototype.getScreenCoord = function(v)
{
    return this.getScreenCoord3f(v[0],v[1],v[1]);
};




FGL.prototype.getModelViewMatrix  = function(){return this._mModelView;};
FGL.prototype.getProjectionMatrix = function(){return this._camera.projectionMatrix;};







module.exports = FGL;
},{"../math/fMat33":30,"../math/fMat44":31,"../math/fVec2":34,"../math/fVec3":35,"../math/fVec4":36,"../system/fError":38,"../system/fPlatform":39,"../util/fColor":40,"./gl/fTexture":24,"./gl/shader/fProgFragShader":25,"./gl/shader/fProgLoader":26,"./gl/shader/fProgVertexShader":27,"./gl/shader/fShaderLoader":28}],18:[function(require,module,exports){
var Vec3  = require('../../math/fVec3'),
    Light = require('./fLight');

function DirectionalLight(id)
{
    Light.apply(this,arguments);
}

DirectionalLight.prototype = Object.create(Light.prototype);

DirectionalLight.prototype.setDirection   = function(v)    {Vec3.set(this.direction,v);};
DirectionalLight.prototype.setDirection3f = function(x,y,z){Vec3.set3f(this.direction,x,y,z);};

DirectionalLight.prototype.lookAt         = function(position,target)
{
    this.setPosition(position);
    this.setDirection(Vec3.normalize(Vec3.subbed(target,position)));
};

module.exports = DirectionalLight;
},{"../../math/fVec3":35,"./fLight":19}],19:[function(require,module,exports){
var Vec3 = require('../../math/fVec3'),
    Vec4 = require('../../math/fVec4');

function Light(id)
{
    this._id   = id;

    this.ambient  = new Float32Array([1,1,1]);
    this.diffuse  = new Float32Array([1,1,1]);
    this.specular = new Float32Array([1,1,1]);

    this.position             = Vec4.ZERO();
    this.direction            = null;
    this.spotExponent         = null;
    this.spotCutOff           = null;

    this.constantAttentuation = 1.0;
    this.linearAttentuation   = 0;
    this.quadricAttentuation  = 0.01;
}


Light.prototype.setAmbient     = function(color)  {this.ambient[0] = color[0];this.ambient[1] = color[1];this.ambient[2] = color[2];};
Light.prototype.setAmbient3f   = function(r,g,b)  {this.ambient[0] = r;this.ambient[1] = g;this.ambient[2] = b;};

Light.prototype.setDiffuse     = function(color)  {this.diffuse[0] = color[0];this.diffuse[1] = color[1];this.diffuse[2] = color[2];};
Light.prototype.setDiffuse3f   = function(r,g,b)  {this.diffuse[0] = r;this.diffuse[1] = g;this.diffuse[2] = b;};

Light.prototype.setSpecular    = function(color)  {this.specular[0] = color[0];this.specular[1] = color[1];this.specular[2] = color[2];};
Light.prototype.setSpecular3f  = function(r,g,b)  {this.specular[0] = r;this.specular[1] = g;this.specular[2] = b;};

Light.prototype.setPosition    = function(v)    {Vec4.set3f(this.position,v[0],v[1],v[2]);};
Light.prototype.setPosition3f  = function(x,y,z){Vec3.set3f(this.position,x,y,z);};

Light.prototype.getId = function(){return this._id;};

module.exports = Light;
},{"../../math/fVec3":35,"../../math/fVec4":36}],20:[function(require,module,exports){
var Mat44 = require('../../math/fMat44');

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
            return Mat44.identity(m);
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
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

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
},{"../../math/fMat44":31}],21:[function(require,module,exports){
var Color = require('../../util/fColor');

function Material(ambient,diffuse,specular,shininess,emission)
{
    ambient   = ambient   || Color.make(1.0,0.5,0.5,1.0);
    diffuse   = diffuse   || Color.BLACK();
    specular  = specular  || Color.BLACK();
    shininess = shininess || 10.0;
    emission  = emission  || Color.BLACK;

    this.emission  = emission;
    this.ambient   = ambient;
    this.diffuse   = diffuse;
    this.specular  = specular;
    this.shininess = shininess;
}

Material.prototype.setEmission   = function(color)  {this.emission = color;};
Material.prototype.setEmission3f = function(r,g,b)  {this.emission[0] = r;this.emission[1] = g;this.emission[2] = b;};
Material.prototype.setEmission4f = function(r,g,b,a){this.emission[0] = r;this.emission[1] = g;this.emission[2] = b;this.emission[3] = a;};

Material.prototype.setAmbient   = function(color)  {this.ambient = color;};
Material.prototype.setAmbient3f = function(r,g,b)  {this.ambient[0] = r;this.ambient[1] = g;this.ambient[2] = b;};
Material.prototype.setAmbient4f = function(r,g,b,a){this.ambient[0] = r;this.ambient[1] = g;this.ambient[2] = b;this.ambient[3] = a;};

Material.prototype.setDiffuse   = function(color)  {this.diffuse = color;};
Material.prototype.setDiffuse3f = function(r,g,b)  {this.diffuse[0] = r;this.diffuse[1] = g;this.diffuse[2] = b;};
Material.prototype.setDiffuse4f = function(r,g,b,a){this.diffuse[0] = r;this.diffuse[1] = g;this.diffuse[2] = b;this.diffuse[3] = a;};

Material.prototype.setSpecular   = function(color)  {this.specular = color;};
Material.prototype.setSpecular3f = function(r,g,b)  {this.specular[0] = r;this.specular[1] = g;this.specular[2] = b;};
Material.prototype.setSpecular4f = function(r,g,b,a){this.specular[0] = r;this.specular[1] = g;this.specular[2] = b;this.specular[3] = a;};


Material.prototype.getEmission  = function(){return Color.copy(this.emission);};
Material.prototype.getAmbient   = function(){return Color.copy(this.ambient);};
Material.prototype.getDiffuse   = function(){return Color.copy(this.diffuse);};
Material.prototype.getSpecular  = function(){return Color.copy(this.specular);};
Material.prototype.getShininess = function(){return this.shininess;};

module.exports = Material;

},{"../../util/fColor":40}],22:[function(require,module,exports){
var Light = require('./fLight');

function PointLight(id)
{
    Light.apply(this,arguments);
}

PointLight.prototype = Object.create(Light.prototype);

module.exports = PointLight;
},{"./fLight":19}],23:[function(require,module,exports){
var DirectionalLight = require('./fDirectionalLight');

function SpotLight(id)
{
    DirectionalLight.apply(this,arguments);
}

SpotLight.prototype = Object.create(DirectionalLight.prototype);

SpotLight.prototype.setExponent = function(){};
SpotLight.prototype.setCutOff   = function(){};

module.exports = SpotLight;
},{"./fDirectionalLight":18}],24:[function(require,module,exports){

function Texture()
{
    this._tex = null;
    this._width = null;
    this._height = null;

    if(arguments.length == 1)this.setTexSource(arguments[0]);
}

Texture.prototype.setTexSource = function(glTex)
{
    var tex = this._tex = glTex;
    this._width  = tex.image.width;
    this._height = tex.image.height;
};

Texture.prototype.getWidth  = function(){return this._width;};
Texture.prototype.getHeight = function(){return this._height;};

module.exports = Texture;
},{}],25:[function(require,module,exports){
module.exports ="varying vec4 vVertexPosition;varying vec3 vVertexNormal;varying vec4 vVertexColor;varying vec2 vVertexTexCoord;uniform float uUseLighting;uniform float uUseMaterial;uniform float uUseTexture;uniform mat3 uNormalMatrix;uniform vec3 uAmbient;uniform sampler2D uTexImage;const int MAX_LIGHTS = 8;struct Light{ vec4 position; vec3 ambient; vec3 diffuse; vec3 specular; vec4 halfVector; vec3 spotDirection; float spotExponent; float spotCutoff; float spotCosCutoff; float constantAttenuation; float linearAttenuation; float quadraticAttenuation;};struct Material{ vec4 emission; vec4 ambient; vec4 diffuse; vec4 specular; float shininess;};struct ColorComponent{ vec4 ambient; vec4 diffuse; vec4 specular; float shininess;};vec4 phongModel(vec4 position, vec3 normal, ColorComponent color, Light light){ vec3 diff = light.position.xyz - position.xyz; vec3 s = normalize(diff); vec3 v = normalize(-position.xyz); vec3 r = reflect(-s, normal); float sDotN = max(dot(s, normal), 0.0); float dist = length(diff.xyz); float att = 1.0 / (light.constantAttenuation + light.linearAttenuation * dist + light.quadraticAttenuation * dist * dist); vec3 ambient = uAmbient * light.ambient * color.ambient.rgb; vec3 diffuse = light.diffuse * color.diffuse.rgb * sDotN ; vec3 specular = ((sDotN > 0.0) ? light.specular * pow(max(dot(r, v), 0.0), color.shininess) : vec3(0.0)); return vec4(ambient*att+ diffuse*att + specular*att,color.ambient.a);}uniform Light uLights[8];uniform Material uMaterial;void main(void){ float useLightingInv = 1.0 - uUseLighting; float useMaterialInv = 1.0 - uUseMaterial; float useTextureInv = 1.0 - uUseTexture; vec3 tVertexNormal = (gl_FrontFacing ? -1.0 : 1.0) * normalize(uNormalMatrix * vVertexNormal); vec4 vertexColor = vVertexColor * useMaterialInv; vec4 textureColor = texture2D(uTexImage,vVertexTexCoord); vec4 resultColor = vertexColor * useTextureInv + textureColor * uUseTexture; ColorComponent color = ColorComponent(uMaterial.ambient * uUseMaterial + resultColor, uMaterial.diffuse * uUseMaterial + resultColor, uMaterial.specular * uUseMaterial + resultColor, uMaterial.shininess * uUseMaterial + useMaterialInv); vec4 lightingColor = vec4(0,0,0,0); for(int i = 0;i < MAX_LIGHTS;i++) { lightingColor+=phongModel(vVertexPosition,tVertexNormal,color,uLights[i]); } gl_FragColor = uUseLighting * lightingColor + useLightingInv * (vVertexColor * useTextureInv + textureColor * uUseTexture);}";
},{}],26:[function(require,module,exports){
module.exports =
{
    loadProgram : function(gl,vertexShader,fragmentShader)
    {
        var program = gl.createProgram();

        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program,gl.LINK_STATUS))
        {
            gl.deleteProgram(program);
            program = null;
        }

        return program;
    }
};
},{}],27:[function(require,module,exports){
module.exports ="attribute vec3 aVertexPosition;attribute vec3 aVertexNormal;attribute vec4 aVertexColor;attribute vec2 aVertexTexCoord;varying vec4 vVertexPosition;varying vec3 vVertexNormal;varying vec4 vVertexColor;varying vec2 vVertexTexCoord;uniform mat4 uModelViewMatrix;uniform mat4 uProjectionMatrix;uniform float uPointSize;void main(void){ vVertexPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0); vVertexNormal = aVertexNormal; vVertexColor = aVertexColor; vVertexTexCoord = aVertexTexCoord; gl_Position = uProjectionMatrix * vVertexPosition; gl_PointSize = uPointSize;}";
},{}],28:[function(require,module,exports){
module.exports =
{
    PrefixShaderWeb : 'precision mediump float;',

    loadShaderFromString : function(gl,sourceString,type)
    {
        var shader = gl.createShader(type);

        gl.shaderSource(shader,sourceString);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
        {
            throw gl.getShaderInfoLog(shader);
        }

        return shader;
    }


};
},{}],29:[function(require,module,exports){
var Vec3  = require('../../math/fVec3'),
    Color = require('../../util/fColor');

var fGLUtil = {};

fGLUtil.__gridSizeLast = -1;
fGLUtil.__gridUnitLast = -1;



fGLUtil.drawGrid = function(kgl,size,unit)
{
    unit = unit || 1;

    var i  = -1,
        sh = size * 0.5 * unit;

    var ui;

    while(++i < size + 1)
    {
        ui = unit * i;

        kgl.linef(-sh,0,-sh + ui,sh,0,-sh+ui);
        kgl.linef(-sh+ui,0,-sh,-sh+ui,0,sh);
    }
};

fGLUtil.drawAxes = function(kgl,unit)
{
    kgl.color3f(1,0,0);
    kgl.linef(0,0,0,unit,0,0);
    kgl.color3f(0,1,0);
    kgl.linef(0,0,0,0,unit,0);
    kgl.color3f(0,0,1);
    kgl.linef(0,0,0,0,0,unit);
};

fGLUtil.drawGridCube = function(kgl,size,unit)
{
    unit = unit || 1;

    var sh  = size * 0.5 * unit,
        pih = Math.PI * 0.5;

    kgl.pushMatrix();
    kgl.translate3f(0,-sh,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(0,sh,0);
    kgl.rotate3f(0,pih,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(0,0,-sh);
    kgl.rotate3f(pih,0,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(0,0,sh);
    kgl.rotate3f(pih,0,0);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(sh,0,0);
    kgl.rotate3f(pih,0,pih);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

    kgl.pushMatrix();
    kgl.translate3f(-sh,0,0);
    kgl.rotate3f(pih,0,pih);
    this.drawGrid(kgl,size,unit);
    kgl.popMatrix();

};


fGLUtil.pyramid = function(kgl,size)
{
    kgl.pushMatrix();
    kgl.scale3f(size,size,size);
    kgl.drawElements(this.__bVertexPyramid,this.__bNormalPyramid,kgl.bufferColors(kgl._bColor,this.__bColorPyramid),null,this.__bIndexPyramid,kgl._drawMode);
    kgl.popMatrix();
};



fGLUtil.octahedron = function(kgl,size)
{
    kgl.pushMatrix();
    kgl.scale3f(size,size,size);
    kgl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron,kgl.bufferColors(kgl._bColor, this.__bColorOctahedron),null, this.__bIndexOctahedron,kgl._drawMode);
    kgl.popMatrix();
};

/*
var fGLUtil =
{

    drawGrid : function(gl,size,unit)
    {
        unit = unit || 1;

        var i  = -1,
            sh = size * 0.5 * unit;

        var ui;

        while(++i < size + 1)
        {
            ui = unit * i;

            gl.linef(-sh,0,-sh + ui,sh,0,-sh+ui);
            gl.linef(-sh+ui,0,-sh,-sh+ui,0,sh);
        }

    },

    drawGridCube : function(gl,size,unit)
    {
        unit = unit || 1;

        var sh  = size * 0.5 * unit,
            pih = Math.PI * 0.5;

        gl.pushMatrix();
        gl.translate3f(0,-sh,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,sh,0);
        gl.rotate3f(0,pih,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,-sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(-sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

    },


    drawAxes : function(gl,unit)
    {
        gl.color3f(1,0,0);
        gl.linef(0,0,0,unit,0,0);
        gl.color3f(0,1,0);
        gl.linef(0,0,0,0,unit,0);
        gl.color3f(0,0,1);
        gl.linef(0,0,0,0,0,unit);
    },


    //temp
    drawVectorf : function(gl,x0,y0,z0,x1,y1,z1)
    {
       

        var p0 = gl._bPoint0,
            p1 = gl._bPoint1,
            up = gl._axisY;

        Vec3.set3f(p0,x0,y0,z0);
        Vec3.set3f(p1,x1,y1,z1);

        var pw = gl._lineBoxWidth,
            ph = gl._lineBoxHeight,
            pd = gl._drawMode;

        var len = Vec3.distance(p0,p1),
            mid = Vec3.scale(Vec3.added(p0,p1),0.5),
            dir = Vec3.normalize(Vec3.subbed(p1,p0)),
            c   = Vec3.dot(dir,up);

        var angle = Math.acos(c),
            axis  = Vec3.normalize(Vec3.cross(up,dir));


        gl.drawMode(gl.LINES);

        gl.linef(x0,y0,z0,x1,y1,z1);

        gl.drawMode(gl.TRIANGLES);
        gl.pushMatrix();
        gl.translate(p1);
        gl.rotateAxis(angle,axis);
        this.pyramid(gl,0.025);
        gl.popMatrix();

        gl.lineSize(pw,ph);
        gl.drawMode(pd);
    },

    drawVector : function(gl,v0,v1)
    {
       this.drawVectorf(gl,v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);
    },

    pyramid : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexPyramid,this.__bNormalPyramid,gl.fillColorBuffer(gl._bColor,this.__bColorPyramid),null,this.__bIndexPyramid,gl._drawMode);
        gl.popMatrix();
    },



    octahedron : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron,gl.fillColorBuffer(gl._bColor, this.__bColorOctahedron),null, this.__bIndexOctahedron,gl._drawMode);
        gl.popMatrix();
    }
};
*/

fGLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
fGLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
fGLUtil.__bColorOctahedron  = new Float32Array(fGLUtil.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
fGLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);
fGLUtil.__bVertexPyramid    = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
fGLUtil.__bNormalPyramid    = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
fGLUtil.__bColorPyramid     = new Float32Array(fGLUtil.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
fGLUtil.__bIndexPyramid     = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);

module.exports = fGLUtil;
},{"../../math/fVec3":35,"../../util/fColor":40}],30:[function(require,module,exports){

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
},{}],31:[function(require,module,exports){
var fMath = require('./fMath'),
    Mat33 = require('./fMat33');

//for node debug
var Mat44 =
{
    make : function()
    {
        return new Float32Array([ 1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0, 0, 0, 1 ]);
    },

    identity : function(m)
    {
        m[ 0] = 1; m[ 1] = m[ 2] = m[ 3] = 0;
        m[ 5] = 1; m[ 4] = m[ 6] = m[ 7] = 0;
        m[10] = 1; m[ 8] = m[ 9] = m[11] = 0;
        m[15] = 1; m[12] = m[13] = m[14] = 0;

        return m;
    },

    copy : function(m)
    {
        return new Float32Array(m);
    },

    makeScale : function(sx,sy,sz,m)
    {
        m = m || this.make();

        m[0]  = sx;
        m[5]  = sy;
        m[10] = sz;

        return m;
    },

    makeTranslate : function(tx,ty,tz,m)
    {
        m = m || this.make();

        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        return m;
    },

    makeRotationX : function(a,m)
    {
        m = m || this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[5]  = cos;
        m[6]  = -sin;
        m[9]  = sin;
        m[10] = cos;

        return m;
    },

    makeRotationY : function(a,m)
    {
        m = m || this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[2] = sin;
        m[8] = -sin;
        m[10]= cos;

        return m;
    },

    makeRotationZ : function(a,m)
    {
        m = m || this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[1] = sin;
        m[4] = -sin;
        m[5] = cos;

        return m;
    },

    makeRotationXYZ : function(ax,ay,az,m)
    {
        m = m || this.make();

        var cosx = Math.cos(ax),
            sinx = Math.sin(ax),
            cosy = Math.cos(ay),
            siny = Math.sin(ay),
            cosz = Math.cos(az),
            sinz = Math.sin(az);

        m[ 0] =  cosy*cosz;
        m[ 1] = -cosx*sinz+sinx*siny*cosz;
        m[ 2] =  sinx*sinz+cosx*siny*cosz;

        m[ 4] =  cosy*sinz;
        m[ 5] =  cosx*cosz+sinx*siny*sinz;
        m[ 6] = -sinx*cosz+cosx*siny*sinz;

        m[ 8] = -siny;
        m[ 9] =  sinx*cosy;
        m[10] =  cosx*cosy;


        return m;
    },

    //temp from glMatrix
    makeRotationOnAxis : function(rot,x,y,z,out)
    {
        var len = Math.sqrt(x * x + y * y + z * z);

        if(Math.sqrt(x * x + y * y + z * z) < fMath.EPSILON) { return null; }

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

        out = out || Mat44.make();

        a00 = 1; a01 = 0; a02 = 0; a03 = 0;
        a10 = 0; a11 = 1; a12 = 0; a13 = 0;
        a20 = 0; a21 = 0; a22 = 1; a23 = 0;

        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

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

    multPre : function(m0,m1,m)
    {
        m = m || this.make();

        var m000 = m0[ 0],m001 = m0[ 1],m002 = m0[ 2],m003 = m0[ 3],
            m004 = m0[ 4],m005 = m0[ 5],m006 = m0[ 6],m007 = m0[ 7],
            m008 = m0[ 8],m009 = m0[ 9],m010 = m0[10],m011 = m0[11],
            m012 = m0[12],m013 = m0[13],m014 = m0[14],m015 = m0[15];

        var m100 = m1[ 0],m101 = m1[ 1],m102 = m1[ 2],m103 = m1[ 3],
            m104 = m1[ 4],m105 = m1[ 5],m106 = m1[ 6],m107 = m1[ 7],
            m108 = m1[ 8],m109 = m1[ 9],m110 = m1[10],m111 = m1[11],
            m112 = m1[12],m113 = m1[13],m114 = m1[14],m115 = m1[15];

        m[ 0] = m000*m100 + m001*m104 + m002*m108 + m003*m112;
        m[ 1] = m000*m101 + m001*m105 + m002*m109 + m003*m113;
        m[ 2] = m000*m102 + m001*m106 + m002*m110 + m003*m114;
        m[ 3] = m000*m103 + m001*m107 + m002*m111 + m003*m115;

        m[ 4] = m004*m100 + m005*m104 + m006*m108 + m007*m112;
        m[ 5] = m004*m101 + m005*m105 + m006*m109 + m007*m113;
        m[ 6] = m004*m102 + m005*m106 + m006*m110 + m007*m114;
        m[ 7] = m004*m103 + m005*m107 + m006*m111 + m007*m115;

        m[ 8] = m008*m100 + m009*m104 + m010*m108 + m011*m112;
        m[ 9] = m008*m101 + m009*m105 + m010*m109 + m011*m113;
        m[10] = m008*m102 + m009*m106 + m010*m110 + m011*m114;
        m[11] = m008*m103 + m009*m107 + m010*m111 + m011*m115;

        m[12] = m012*m100 + m013*m104 + m014*m108 + m015*m112;
        m[13] = m012*m101 + m013*m105 + m014*m109 + m015*m113;
        m[14] = m012*m102 + m013*m106 + m014*m110 + m015*m114;
        m[15] = m012*m103 + m013*m107 + m014*m111 + m015*m115;




        return m;
    },

    mult : function(m0,m1,m)
    {
        return this.multPre(m0,m1);
    },

    multPost : function(m0,m1,m)
    {
        return this.multPre(m1,m0,m);
    },

    inverted : function(m)
    {
        var inv = this.make();
        inv[0] =   m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15]
            + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        inv[4] =  -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] +
            m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        inv[8] =   m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15]
            + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] +
            m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        inv[1] =  -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] +
            m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        inv[5] =  m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15]
            + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15]
            - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14]
            + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15]
            + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15]
            - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15]
            + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14]
            - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11]
            - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11]
            + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11]
            - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10]
            + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
        var det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
        if( det == 0 )
        {
            return null;
        }
        det = 1.0 / det;
        var mo = this.make();
        for( var i=0; i<16; ++i )
        {
            mo[i] = inv[i] * det;
        }
        return mo;
    },

    transposed : function(m)
    {
        var mo = this.make();

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

    toMat33Inversed : function(mat44,mat33)
    {
        var a00 = mat44[0], a01 = mat44[1], a02 = mat44[2];
        var a10 = mat44[4], a11 = mat44[5], a12 = mat44[6];
        var a20 = mat44[8], a21 = mat44[9], a22 = mat44[10];

        var b01 = a22*a11-a12*a21;
        var b11 = -a22*a10+a12*a20;
        var b21 = a21*a10-a11*a20;

        var d = a00*b01 + a01*b11 + a02*b21;
        if (!d) { return null; }
        var id = 1/d;


        if(!mat33) { mat33 = Mat33.make(); }

        mat33[0] = b01*id;
        mat33[1] = (-a22*a01 + a02*a21)*id;
        mat33[2] = (a12*a01 - a02*a11)*id;
        mat33[3] = b11*id;
        mat33[4] = (a22*a00 - a02*a20)*id;
        mat33[5] = (-a12*a00 + a02*a10)*id;
        mat33[6] = b21*id;
        mat33[7] = (-a21*a00 + a01*a20)*id;
        mat33[8] = (a11*a00 - a01*a10)*id;

        return mat33;


    },

    multVec3 : function(m,v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

        return v;
    },

    mutlVec3A : function(m,a,i)
    {
        i *= 3;

        var x = a[i  ],
            y = a[i+1],
            z = a[i+2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec3AI : function(m,a,i)
    {
        var x = a[i  ],
            y = a[i+1],
            z = a[i+2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec4 : function(m,v)
    {
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

    multVec4A : function(m,a,i)
    {
        i *= 3;

        var x = a[i  ],
            y = a[i+1],
            z = a[i+2],
            w = a[i+3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i+3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    multVec4AI : function(m,a,i)
    {
        var x = a[i  ],
            y = a[i+1],
            z = a[i+2],
            w = a[i+3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i+1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i+2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i+3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    isFloatEqual : function(m0,m1)
    {
        var i = -1;
        while(++i<16)
        {
            if(!fMath.isFloatEqual(m0[i],m1[i]))return false;
        }
        return true;

    },

    toString : function(m)
    {
        return '[' + m[ 0] + ', ' + m[ 1] + ', ' + m[ 2] + ', ' + m[ 3] + ',\n' +
            ' ' + m[ 4] + ', ' + m[ 5] + ', ' + m[ 6] + ', ' + m[ 7] + ',\n' +
            ' ' + m[ 8] + ', ' + m[ 9] + ', ' + m[10] + ', ' + m[11] + ',\n' +
            ' ' + m[12] + ', ' + m[13] + ', ' + m[14] + ', ' + m[15] + ']';
    }
};

module.exports = Mat44;
},{"./fMat33":30,"./fMath":32}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
var Quaternion =
{
    make     : function(n,v){return new Float32Array([n, v[0],v[1],v[2]]);},
    make4f   : function(n,x,y,z){return new Float32Array([n,x,y,z]);},
    zero     : function(){return new Float32Array([0,0,0,0]);},
    set      : function(q0,q1)
    {
        q0[0] = q1[0];
        q0[1] = q1[1];
        q0[2] = q1[2];
        q0[3] = q1[3];
    },

    set4f    : function(q,n,x,y,z)
    {
        q[0] = n;
        q[1] = x;
        q[2] = y;
        q[3] = z;

    },

    copy     : function(q){return new Float32Array(q);},

    length   : function(q){var n = q[0],x = q[1],y = q[2],z = q[3]; return Math.sqrt(n*n+x*x+y*y+z*z);},
    vector   : function(q){return new Float32Array(q[1],q[2],q[3]);},
    scalar   : function(q){return q[0];},



    add : function(q0,q1)
    {
        q0[0] = q0[0] + q1[0];
        q0[1] = q0[1] + q1[1];
        q0[2] = q0[2] + q1[2];
        q0[3] = q0[3] + q1[3];
    },

    sub : function(q0,q1)
    {
        q0[0] = q0[0] - q1[0];
        q0[1] = q0[1] - q1[1];
        q0[2] = q0[2] - q1[2];
        q0[3] = q0[3] - q1[3];
    },

    scale : function(q,n)
    {
        q[0] *= n;
        q[1] *= n;
        q[2] *= n;
        q[3] *= n;
    },

    conjugate : function(q)
    {
        q[1]*=-1;
        q[2]*=-1;
        q[3]*=-1;
    },

    mult : function(q0,q1)
    {
        var n0 = q0[0],
            x0 = q0[1],
            y0 = q0[2],
            z0 = q0[3],
            n1 = q1[0],
            x1 = q1[1],
            y1 = q1[2],
            z1 = q1[3];

        q0[0] = n0 * n1 - x0 * x1 - y0 * y1 - z0 * z1;
        q0[1] = n0 * x1 - x0 * n1 - y0 * z1 - z0 * y1;
        q0[2] = n0 * y1 - y0 * n1 - z0 * x1 - x0 * z1;
        q0[3] = n0 * z1 - z0 * n1 - x0 * y1 - y0 * z1;
    },

    multVec : function(q,v)
    {
        var qn = q[0],
            qx = q[1],
            qy = q[2],
            qz = q[3];

        var x = v[0],
            y = v[1],
            z = v[2];

        q[0] = -(qx*x + qy*y + qz*z);
        q[1] = qn * x + qy * z - qz * y;
        q[2] = qn * y + qz * x - qx * z;
        q[3] = qn * z + qx * y - qy * x;
    },

    angle : function(q)
    {
        return 2 * acos(q[0]);
    },

    axis : function(q)
    {
        var x = q[0],
            y = q[1],
            z = q[2];

        var l = Math.sqrt(x*x + y*y + z*z);

        return l != 0 ? new Float32Array([x/l,y/l,z/l]) : new Float32Array([0,0,0]);
    },

    //TODO: INLINE ALL!!

    rotate : function(q0,q1)
    {
        this.set(q0,this.mult(this.mult(this.copy(q0),q1),
                    this.conjugate(this.copy(q0))));
    },

    rotateVec : function(q,v)
    {
        var t = this.zero();
        this.set(t,this.multVec3(this.multVec3(this.copy(q),v),this.conjugate(this.copy(q))));
    },

    fromAngles : function(ax,ay,az)
    {
        var q = this.zero();

        var cyaw,cpitch,croll,syaw,spitch,sroll;
        var cyawcpitch,syawspitch,cyawspitch,syawcpitch;

        cyaw   = Math.cos(az * 0.5);
        cpitch = Math.cos(ay * 0.5);
        croll  = Math.cos(ax * 0.5);
        syaw   = Math.sin(az * 0.5);
        spitch = Math.sin(ay * 0.5);
        sroll  = Math.sin(ax * 0.5);

        cyawcpitch = cyaw * cpitch;
        syawspitch = syaw * spitch;
        cyawspitch = cyaw * spitch;
        syawcpitch = syaw * cpitch;

        return new Float32Array([ cyawcpitch * croll + syawspitch * sroll,
                                  cyawcpitch * sroll - syawspitch * croll,
                                  cyawspitch * croll + syawcpitch * sroll,
                                  syawcpitch * croll - cyawspitch * sroll ]);

    },

    anglesFrom : function(q)
    {
        var qn = q[0],
            qx = q[1],
            qy = q[2],
            qz = q[3];

        var r11,r21,r31,r32,r33,r12,r13;
        var q00,q11,q22,q33;
        var temp;
        var v = new Float32Array(3);

        q00 = qn * qn;
        q11 = qx * qx;
        q22 = qy * qy;
        q33 = qz * qz;

        r11 = q00 + q11 - q22 - q33;
        r21 = 2 * ( qx + qy + qn * qz);
        r31 = 2 * ( qx * qz - qn * qy);
        r32 = 2 * ( qy * qz + qn * qx);
        r33 = q00 - q11 - q22 + q33;

        temp = Math.abs(r31);
        if(temp > 0.999999)
        {
            r12 = 2 * (qx * qy - qn * qz);
            r13 = 2 * (qx * qz - qn * qy);

            v[0] = 0.0;
            v[1] = (-(Math.PI * 0.5) *  r32 / temp);
            v[2] = Math.atan2(-r12,-r31*r13);
            return v;
        }

        v[0] = Math.atan2(r32,r33);
        v[1] = Math.asin(-31);
        v[2] = Math.atan2(r21,r11);
        return v;
   }
};

module.exports = Quaternion;
},{}],34:[function(require,module,exports){
var Vec2 =
{
    SIZE : 2,

    make : function()
    {
        return new Float32Array([0,0]);
    }
};

module.exports = Vec2;
},{}],35:[function(require,module,exports){
var Vec3 =
{
    SIZE   : 3,
    ZERO   : function(){return new Float32Array([0,0,0])},
    AXIS_X : function(){return new Float32Array([1,0,0])},
    AXIS_Y : function(){return new Float32Array([0,1,0])},
    AXIS_Z : function(){return new Float32Array([0,0,1])},

    make : function(x,y,z)
    {
        return new Float32Array([ x || 0.0,
            y || 0.0,
            z || 0.0]);
    },

    set : function(v0,v1)
    {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];

        return v0;
    },

    set3f :  function(v,x,y,z)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    copy :  function(v)
    {
        return new Float32Array(v);
    },

    add : function(v0,v1)
    {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];

        return v0;
    },

    sub : function(v0,v1)
    {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];

        return v0;
    },

    scale : function(v,n)
    {
        v[0]*=n;
        v[1]*=n;
        v[2]*=n;

        return v;
    },

    dot : function(v0,v1)
    {
        return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
    },

    cross: function(v0,v1)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        return new Float32Array([y0 * z1 - y1 * z0,
                                 z0 * x1 - z1 * x0,
                                 x0 * y1 - x1 * y0]);
    },

    lerp : function(v0,v1,f)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2];

        v0[0] = x0 * (1.0 - f) + v1[0] * f;
        v0[1] = y0 * (1.0 - f) + v1[1] * f;
        v0[2] = z0 * (1.0 - f) + v1[2] * f;


    },

    lerped : function(v0,v1,f)
    {
        return this.lerp(this.copy(v0),v1,f);
    },



    lerp3f : function(v,x,y,z,f)
    {
        var vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = vx * (1.0 - f) + x * f;
        v[1] = vy * (1.0 - f) + y * f;
        v[2] = vz * (1.0 - f) + z * f;
    },


    length : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    lengthSq :  function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        return x*x+y*y+z*z;
    },

    safeNormalize : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var d = Math.sqrt(x*x+y*y+z*z);
        d = d || 1;

        var l  = 1/d;

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    normalize : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var l  = 1/Math.sqrt(x*x+y*y+z*z);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    distance : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    distance3f : function(v,x,y,z)
    {
        return Math.sqrt(v[0] * x + v[1] * y + v[2] * z);
    },

    distanceSq : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x*x+y*y+z*z;
    },

    distanceSq3f : function(v,x,y,z)
    {
        return v[0] * x + v[1] * y + v[2] * z;
    },

    limit : function(v,n)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x*x + y*y + z*z,
            lsq = n * n;

        if((dsq > lsq) && lsq > 0)
        {
            var nd = n/Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert : function(v)
    {
        v[0]*=-1;
        v[1]*=-1;
        v[2]*=-1;

        return v;
    },

    added  : function(v0,v1)
    {
        return this.add(this.copy(v0),v1);
    },

    subbed : function(v0,v1)
    {
        return this.sub(this.copy(v0),v1);
    },

    scaled : function(v,n)
    {
        return this.scale(this.copy(v),n);
    },

    normalized : function(v)
    {
        return this.normalize(this.copy(v));
    },

    toString : function(v)
    {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    }

};

module.exports = Vec3;




},{}],36:[function(require,module,exports){

//TODO:FINISH
var Vec4 =
{
    SIZE : 4,
    ZERO : function(){return new Float32Array([0,0,0,1.0])},

    make : function(x,y,z,w)
    {
        return new Float32Array([ x || 0.0,
            y || 0.0,
            z || 0.0,
            w || 1.0]);
    },

    fromVec3 : function(v)
    {
        return new Float32Array([ v[0], v[1], v[2] , 1.0]);
    },

    set : function(v0,v1)
    {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];
        v0[3] = v1[3];

        return v0;
    },

    set3f :  function(v,x,y,z)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    set4f : function(v,x,y,z,w)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;
        v[3] = w;

        return v;

    },

    copy :  function(v)
    {
        return new Float32Array(v);
    },

    add : function(v0,v1)
    {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];
        v0[3] += v1[3];

        return v0;
    },

    sub : function(v0,v1)
    {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];
        v0[3] -= v1[3];

        return v0;
    },

    scale : function(v,n)
    {
        v[0]*=n;
        v[1]*=n;
        v[2]*=n;
        v[3]*=n;

        return v;
    },

    dot : function(v0,v1)
    {
        return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
    },

    cross: function(v0,v1)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        return new Float32Array([y0*z1-y1*z0,z0*x1-z1*x0,x0*y1-x1*y0]);
    },

    slerp : function(v0,v1,f)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        var d = Math.max(-1.0,Math.min((x0*x1 + y0*y1 + z0*z1),1.0)),
            t = Math.acos(d) * f;

        var x = x0 - (x1 * d),
            y = y0 - (y1 * d),
            z = z0 - (z1 * d);

        var l = 1/Math.sqrt(x*x+y*y+z*z);

        x*=l;
        y*=l;
        z*=l;

        var ct = Math.cos(t),
            st = Math.sin(t);

        var xo = x0 * ct + x * st,
            yo = y0 * ct + y * st,
            zo = z0 * ct + z * st;

        return new Float32Array([xo,yo,zo]);
    },

    length : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        return Math.sqrt(x*x+y*y+z*z+w*w);
    },

    lengthSq :  function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        return x*x+y*y+z*z+w*w;
    },

    normalize : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        var l  = 1/Math.sqrt(x*x+y*y+z*z+w*w);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;
        v[3] *= l;

        return v;
    },

    distance : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    distanceSq : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x*x+y*y+z*z;
    },

    limit : function(v,n)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x*x + y*y + z*z,
            lsq = n * n;

        if((dsq > lsq) && lsq > 0)
        {
            var nd = n/Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert : function(v)
    {
        v[0]*=-1;
        v[1]*=-1;
        v[2]*=-1;

        return v;
    },

    added  : function(v0,v1)
    {
        return this.add(this.copy(v0),v1);
    },

    subbed : function(v0,v1)
    {
        return this.sub(this.copy(v0),v1);
    },

    scaled : function(v,n)
    {
        return this.scale(this.copy(v),n);
    },

    normalized : function(v)
    {
        return this.normalize(this.copy(v));
    },

    toString : function(v)
    {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    }

};

module.exports = Vec4;
},{}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
module.exports =
{
    METHOD_NOT_IMPLEMENTED: 'Method not implemented in target platform.',
    CLASS_IS_SINGLETON:     'Application is singleton. Get via getInstance().',
    APP_NO_SETUP:           'No setup method added to app.',
    APP_NO_UPDATE :         'No update method added to app.',
    PLASK_WINDOW_SIZE_SET:  'Plask window size can only be set on startup.',
    WRONG_PLATFORM:         'Wrong Platform.',
    VERTICES_IN_WRONG_SIZE: 'Vertices array has wrong length. Should be ',
    COLORS_IN_WRONG_SIZE:   'Color array length not equal to number of vertices.'
};
},{}],39:[function(require,module,exports){
var Platform = {WEB:0,PLASK:1};
    Platform._target = null;

Platform.getTarget  = function()
{
    if(!this._target)this._target = (typeof window !== 'undefined' && typeof document !== 'undefined') ? this.WEB :
                                    (typeof require == "function" && require) ? this.PLASK :
                                     null;
    return this._target;
};

module.exports = Platform;
},{}],40:[function(require,module,exports){
module.exports =
{
    SIZE  : 4,

    BLACK : function(){return new Float32Array([0,0,0,1])},
    WHITE : function(){return new Float32Array([1,1,1,1])},
    RED   : function(){return new Float32Array([1,0,0,1])},
    GREEN : function(){return new Float32Array([0,1,0,1])},
    BLUE  : function(){return new Float32Array([0,0,1,1])},

    make : function(r,g,b,a){return new Float32Array([ r,g,b,a]);},
    copy : function(c){return this.make(c[0],c[1],c[2],c[3]);},

    set : function(c0,c1)
    {
        c0[0] = c1[0];
        c0[1] = c1[1];
        c0[2] = c1[2];
        c0[3] = c1[3];

        return c0;
    },

    set4f : function(c,r,g,b,a)
    {
        c[0] = r;
        c[1] = g;
        c[2] = b;
        c[3] = a;

        return c;
    },

    set3f : function(c,r,g,b)
    {
        c[0] = r;
        c[1] = g;
        c[2] = b;
        c[3] = 1.0;

        return c;
    },

    set2f : function(c,k,a)
    {
        c[0] = c[1] = c[2] = k;
        c[3] = a;

        return c;
    },

    set1f : function(c,k)
    {
        c[0] = c[1] = c[2] = k;
        c[3] = 1.0;

        return c;
    },

    set4i    : function(c,r,g,b,a){return this.set4f(c,r/255.0,g/255.0,b/255.0,a);},
    set3i    : function(c,r,g,b)  {return this.set3f(c,r/255.0,g/255.0,b/255.0);},
    set2i    : function(c,k,a)    {return this.set2f(c,k/255.0,a);},
    set1i    : function(c,k)      {return this.set1f(c,k/255.0);},
    toArray  : function(c)        {return c.toArray();},
    toString : function(c)        {return '['+c[0]+','+c[1]+','+c[2]+','+c[3]+']';},

    interpolated : function(c0,c1,f)
    {
        var c  = new Float32Array(4),
            fi = 1.0 - f;

        c[0] = c0[0] * fi + c1[0] * f;
        c[1] = c0[1] * fi + c1[1] * f;
        c[2] = c0[2] * fi + c1[2] * f;
        c[3] = c0[3] * fi + c1[3] * f;

        return c;
    }

};
},{}],41:[function(require,module,exports){
var Vec2   = require('../math/fVec2'),
    fError = require('../system/fError');

function Mouse()
{
    if(Mouse.__instance)throw new Error(fError.CLASS_IS_SINGLETON);

    this._position     = Vec2.make();
    this._positionLast = Vec2.make();

    Mouse.__instance = this;
}

Mouse.prototype.getPosition     = function(){return this._position;};
Mouse.prototype.getPositionLast = function(){return this._positionLast;};
Mouse.prototype.getX            = function(){return this._position[0];};
Mouse.prototype.getY            = function(){return this._position[1];};
Mouse.prototype.getXLast        = function(){return this._positionLast[0];};
Mouse.prototype.getYLast        = function(){return this._positionLast[1];};

Mouse.__instance = null;
Mouse.getInstance = function(){return Mouse._instance;};

module.exports = Mouse;
},{"../math/fVec2":34,"../system/fError":38}],42:[function(require,module,exports){
module.exports =
{
    toArray : function(float32Array){return Array.prototype.slice.call(float32Array);}
};
},{}],43:[function(require,module,exports){

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vZXhhbXBsZXMvMDFfQmFzaWNfUHJpbWl0aXZlcy9hcHAuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vYXBwL2ZBcHBJbXBsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2FwcC9mQXBwSW1wbFBsYXNrLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2FwcC9mQXBwSW1wbFdlYi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9hcHAvZkFwcGxpY2F0aW9uLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2ZvYW0uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ2VvbS9mR2VvbTNkLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dlb20vZklTT0JhbmQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ2VvbS9mSVNPU3VyZmFjZS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nZW9tL2ZMaW5lMmRVdGlsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dlb20vZkxpbmVCdWZmZXIyZC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nZW9tL2ZMaW5lQnVmZmVyM2QuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ2VvbS9mUGFyYW1ldHJpY1N1cmZhY2UuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ2VvbS9mUG9seWdvbjJkVXRpbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nZW9tL2ZTcGxpbmUuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ3JhcGhpY3MvZkNhbWVyYUJhc2ljLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL2ZHTC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC9mRGlyZWN0aW9uYWxMaWdodC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC9mTGlnaHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ3JhcGhpY3MvZ2wvZk1hdEdMLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL2dsL2ZNYXRlcmlhbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC9mUG9pbnRMaWdodC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC9mU3BvdExpZ2h0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL2dsL2ZUZXh0dXJlLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL2dsL3NoYWRlci9mUHJvZ0ZyYWdTaGFkZXIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZ3JhcGhpY3MvZ2wvc2hhZGVyL2ZQcm9nTG9hZGVyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dyYXBoaWNzL2dsL3NoYWRlci9mUHJvZ1ZlcnRleFNoYWRlci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy9nbC9zaGFkZXIvZlNoYWRlckxvYWRlci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9ncmFwaGljcy91dGlsL2ZHTFV0aWwuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9mTWF0MzMuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9mTWF0NDQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9mTWF0aC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9tYXRoL2ZRdWF0ZXJuaW9uLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL21hdGgvZlZlYzIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9mVmVjMy5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9tYXRoL2ZWZWM0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL3N5c3RlbS9mRGVmYXVsdC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9zeXN0ZW0vZkVycm9yLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL3N5c3RlbS9mUGxhdGZvcm0uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mQ29sb3IuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mTW91c2UuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9mVXRpbC5qcyIsIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L19lbXB0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbG9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0NUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdjBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzE4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEEiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRm9hbSA9IHJlcXVpcmUoJy4uLy4uL3NyYy9mb2FtL2ZvYW0uanMnKTtcblxuZnVuY3Rpb24gQXBwKClcbntcbiAgICBGb2FtLkFwcGxpY2F0aW9uLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcblxuICAgIHRoaXMuc2V0RnVsbFdpbmRvd0ZyYW1lKHRydWUpO1xuXG4gICAgdGhpcy5zZXRUYXJnZXRGUFMoNjApO1xuICAgIHRoaXMuc2V0U2l6ZSg4MDAsNjAwKTtcbn1cblxuQXBwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRm9hbS5BcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xuXG5BcHAucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24oKXt9O1xuXG5BcHAucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIga2dsID0gdGhpcy5mZ2w7XG4gICAgdmFyIGNhbSA9IHRoaXMuY2FtZXJhO1xuXG4gICAgdmFyIHRpbWUgPSB0aGlzLmdldFNlY29uZHNFbGFwc2VkKCksXG4gICAgICAgIHpvb20gPSAxICsgTWF0aC5zaW4odGltZSkgKiAwLjI1O1xuXG4gICAga2dsLmNsZWFyM2YoMC4xLDAuMSwwLjEpO1xuICAgIGtnbC5sb2FkSWRlbnRpdHkoKTtcblxuICAgIGNhbS5zZXRQb3NpdGlvbjNmKE1hdGguY29zKHRpbWUpKk1hdGguUEkqem9vbSx6b29tLE1hdGguc2luKHRpbWUpKk1hdGguUEkqem9vbSk7XG4gICAgY2FtLnVwZGF0ZU1hdHJpY2VzKCk7XG5cbiAgICB0aGlzLmRyYXdTeXN0ZW0oKTtcblxuICAgIGtnbC5kcmF3TW9kZShrZ2wuVFJJQU5HTEVTKTtcbiAgICBrZ2wuY29sb3IxZigxKTtcbiAgIC8vIGZnbC5saW5lZigwLDAsMCwxLDEsMSk7XG5cbiAgICBrZ2wuY3ViZSgxKTtcblxuXG4gICAga2dsLmRyYXdNb2RlKGtnbC5MSU5FUyk7XG59O1xuXG5BcHAucHJvdG90eXBlLmRyYXdTeXN0ZW0gPSAgZnVuY3Rpb24oKVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLmZnbDtcblxuICAgIGtnbC5jb2xvcjFmKDAuMjUpO1xuICAgIEZvYW0uZkdMVXRpbC5kcmF3R3JpZChrZ2wsOCwxKTtcbiAgICBGb2FtLmZHTFV0aWwuZHJhd0dyaWRDdWJlKGtnbCw4LDEpO1xuICAgIEZvYW0uZkdMVXRpbC5kcmF3QXhlcyhrZ2wsNCk7XG59O1xuXG52YXIgYXBwID0gbmV3IEFwcCgpO1xuIiwidmFyIERlZmF1bHQgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZkRlZmF1bHQnKSxcbiAgICBmRXJyb3IgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2ZFcnJvcicpO1xuXG5mdW5jdGlvbiBBcHBJbXBsKClcbntcbiAgICB0aGlzLl9jb250ZXh0M2QgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHQyZCA9IG51bGw7XG5cbiAgICB0aGlzLl93aW5kb3dUaXRsZSAgICAgICA9IDA7XG4gICAgdGhpcy5faXNGdWxsV2luZG93RnJhbWUgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0Z1bGxzY3JlZW4gICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX2lzQm9yZGVybGVzcyAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5fZGlzcGxheUlkICAgICAgICAgPSAwO1xuXG4gICAgdGhpcy5fa2V5RG93biAgID0gZmFsc2U7XG4gICAgdGhpcy5fa2V5U3RyICAgID0gJyc7XG4gICAgdGhpcy5fa2V5Q29kZSAgID0gJyc7XG5cbiAgICB0aGlzLl9tb3VzZURvd24gICAgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZU1vdmUgICAgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZVdoZWVsRGVsdGEgPSAwLjA7XG5cbiAgICB0aGlzLl9tb3VzZU1vdmUgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlQm91bmRzID0gdHJ1ZTtcblxuICAgIHRoaXMuX3RhcmdldEZQUyAgICAgPSBEZWZhdWx0LkFQUF9GUFM7XG4gICAgdGhpcy5fYlVwZGF0ZSAgICAgICA9IHRydWU7XG5cbiAgICB0aGlzLl9mcmFtZXMgICAgICAgID0gMDtcbiAgICB0aGlzLl9mcmFtZXRpbWUgICAgID0gMDtcbiAgICB0aGlzLl9mcmFtZW51bSAgICAgID0gMDtcbiAgICB0aGlzLl90aW1lICAgICAgICAgID0gMDtcbiAgICB0aGlzLl90aW1lU3RhcnQgICAgID0gLTE7XG4gICAgdGhpcy5fdGltZU5leHQgICAgICA9IDA7XG4gICAgdGhpcy5fdGltZUludGVydmFsICA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbiAgICB0aGlzLl90aW1lRGVsdGEgICAgID0gMDtcblxuICAgIHRoaXMuX3dpZHRoICA9IC0xO1xuICAgIHRoaXMuX2hlaWdodCA9IC0xO1xuICAgIHRoaXMuX3JhdGlvICA9IC0xO1xuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IGZhbHNlO1xufVxuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0luaXRpYWxpemVkID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2lzSW5pdGlhbGl6ZWQ7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0VXBkYXRlICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2JVcGRhdGUgPSBib29sO307XG5cbkFwcEltcGwucHJvdG90eXBlLmluaXQgICAgPSBmdW5jdGlvbihhcHBPYmopICAgICAge3Rocm93IG5ldyBFcnJvcihmRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQpe3Rocm93IG5ldyBFcnJvcihmRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lID0gZnVuY3Rpb24oYm9vbCl7dGhyb3cgbmV3IEVycm9yKGZFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNGdWxsV2luZG93RnJhbWUgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lO307XG5cbkFwcEltcGwucHJvdG90eXBlLnNldEZ1bGxzY3JlZW4gPSBmdW5jdGlvbihib29sKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLmlzRnVsbHNjcmVlbiAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pc0Z1bGxzY3JlZW47fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lzQm9yZGVybGVzczt9XG5cbkFwcEltcGwucHJvdG90eXBlLnNldERpc3BsYXkgPSBmdW5jdGlvbihudW0pe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0RGlzcGxheSA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3BsYXlJZDt9XG5cblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKSAgICAgICAgICAgIHtyZXR1cm4gdGhpcy5fd2lkdGg7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkgICAgICAgICAgICB7cmV0dXJuIHRoaXMuX2hlaWdodDt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0QXNwZWN0UmF0aW9XaW5kb3cgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yYXRpbzt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRUYXJnZXRGUFMgPSBmdW5jdGlvbihmcHMpe3RoaXMuX3RhcmdldEZQUyA9IGZwczt0aGlzLl90aW1lSW50ZXJ2YWwgID0gdGhpcy5fdGFyZ2V0RlBTIC8gMTAwMC4wO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUYXJnZXRGUFMgPSBmdW5jdGlvbigpICAge3JldHVybiB0aGlzLl90YXJnZXRGUFM7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0V2luZG93VGl0bGUgICAgICAgPSBmdW5jdGlvbih0aXRsZSl7dGhpcy5fd2luZG93VGl0bGUgPSB0aXRsZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUucmVzdHJpY3RNb3VzZVRvRnJhbWUgPSBmdW5jdGlvbihib29sKSB7dGhpcy5fbW91c2VCb3VuZHMgPSBib29sO307XG5cbkFwcEltcGwucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZkVycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKGZFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZSAgICAgICAgICAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihmRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVTdGFydCAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZkVycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUaW1lTmV4dCAgICAgICA9IGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKGZFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihmRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaXNLZXlEb3duICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa2V5RG93bjt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNNb3VzZURvd24gICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW91c2VEb3duO307XG5BcHBJbXBsLnByb3RvdHlwZS5pc01vdXNlTW92ZSAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tb3VzZU1vdmU7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleUNvZGUgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2tleUNvZGU7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleVN0ciAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2tleVN0cjt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW91c2VXaGVlbERlbHRhO307XG5cblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIGZhbHNlO307XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCAgID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFBhcmVudCAgICAgICAgICAgICAgPSBmdW5jdGlvbigpICAge3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuc2V0UGFyZW50ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIGZhbHNlO307XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbDsiLCJ2YXIgRGVmYXVsdCAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZkRlZmF1bHQnKSxcbiAgICBmRXJyb3IgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9mRXJyb3InKSxcbiAgICBmR0wgICAgICAgICA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2ZHTCcpLFxuICAgIEFwcEltcGwgICAgID0gcmVxdWlyZSgnLi9mQXBwSW1wbCcpLFxuICAgIENhbWVyYUJhc2ljID0gcmVxdWlyZSgnLi4vZ3JhcGhpY3MvZkNhbWVyYUJhc2ljJyksXG4gICAgcGxhc2sgICAgICAgPSByZXF1aXJlKCdwbGFzaycpO1xuXG5mdW5jdGlvbiBBcHBJbXBsUGxhc2soKVxue1xuICAgIEFwcEltcGwuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xufVxuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBJbXBsLnByb3RvdHlwZSk7XG5cbkFwcEltcGxQbGFzay5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodClcbntcbiAgICBpZih0aGlzLl9pc0luaXRpYWxpemVkKXRocm93IG5ldyBFcnJvcihmRXJyb3IuUExBU0tfV0lORE9XX1NJWkVfU0VUKTtcblxuICAgIHRoaXMuX3dpZHRoICA9IHdpZHRoO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLl9yYXRpbyAgPSB3aWR0aCAvIGhlaWdodDtcbn07XG5cbi8vVE9ETzogRml4IHRpbWUgZGVsdGEsIGRvdWJsZSBtZWFzdXJpbmcgb2YgdGltZSBpbiBnZW5lcmFsXG5cbkFwcEltcGxQbGFzay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGFwcE9iailcbntcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1vdXNlO1xuICAgIHZhciBwcmV2VGltZSA9IDAsXG4gICAgICAgIHRpbWVEZWx0YSxcbiAgICAgICAgdGltZTtcblxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTW91c2UoeCx5KVxuICAgIHtcbiAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBhcHBPYmoubW91c2UuX3Bvc2l0aW9uWzBdO1xuICAgICAgICBhcHBPYmoubW91c2UuX3Bvc2l0aW9uTGFzdFsxXSA9IGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV07XG5cbiAgICAgICAgaWYoc2VsZi5fbW91c2VCb3VuZHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMF0gPSBNYXRoLm1heCgwLE1hdGgubWluKHgsc2VsZi5fd2lkdGgpKTtcbiAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV0gPSBNYXRoLm1heCgwLE1hdGgubWluKHksc2VsZi5faGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBhcHBPYmoubW91c2UuX3Bvc2l0aW9uWzBdID0geDtcbiAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV0gPSB5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxhc2suc2ltcGxlV2luZG93KHtcblxuICAgICAgICBzZXR0aW5nczpcbiAgICAgICAge1xuICAgICAgICAgICAgd2lkdGg6ICAgICAgIHNlbGYuX3dpZHRoICB8fCBEZWZhdWx0LkFQUF9XSURUSCxcbiAgICAgICAgICAgIGhlaWdodDogICAgICBzZWxmLl9oZWlnaHQgfHwgRGVmYXVsdC5BUFBfSEVJR0hULFxuICAgICAgICAgICAgdHlwZTogICAgICAgIERlZmF1bHQuQVBQX1BMQVNLX1RZUEUsXG4gICAgICAgICAgICB2c3luYzogICAgICAgRGVmYXVsdC5BUFBfUExBU0tfVlNZTkMsXG4gICAgICAgICAgICBtdWx0aXNhbXBsZTogRGVmYXVsdC5BUFBfUExBU0tfTVVMVElTQU1QTEUsXG4gICAgICAgICAgICBib3JkZXJsZXNzOiAgc2VsZi5faXNCb3JkZXJsZXNzLFxuICAgICAgICAgICAgZnVsbHNjcmVlbjogIHNlbGYuX2lzRnVsbHNjcmVlbixcbiAgICAgICAgICAgIHRpdGxlOiAgICAgICBzZWxmLl93aW5kb3dUaXRsZSB8fCBEZWZhdWx0LkFQUF9QTEFTS19XSU5ET1dfVElUTEVcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OmZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgYXBwT2JqLmZnbCAgICA9IG5ldyBmR0wodGhpcy5nbCxudWxsKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICAgICAgICAgIGFwcE9iai5mZ2wuc2V0Q2FtZXJhKGFwcE9iai5jYW1lcmEpO1xuICAgICAgICAgICAgYXBwT2JqLmNhbWVyYS5zZXRQZXJzcGVjdGl2ZShEZWZhdWx0LkNBTUVSQV9GT1YsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9ORUFSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9GQVIpO1xuXG4gICAgICAgICAgICBhcHBPYmouY2FtZXJhLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEudXBkYXRlTWF0cmljZXMoKTtcblxuICAgICAgICAgICAgaWYoc2VsZi5fYlVwZGF0ZSl0aGlzLmZyYW1lcmF0ZShzZWxmLl90YXJnZXRGUFMpO1xuICAgICAgICAgICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX3RpbWVTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBzZWxmLl90aW1lTmV4dCAgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdtb3VzZU1vdmVkJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTW91c2UoZS54LCBlLnkpO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2xlZnRNb3VzZURyYWdnZWQnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNb3VzZShlLngsIGUueSk7XG4gICAgICAgICAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlTW92ZShlKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdsZWZ0TW91c2VEb3duJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VEb3duKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2xlZnRNb3VzZVVwJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlVXAoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5vbignc2Nyb2xsV2hlZWwnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9tb3VzZVdoZWVsRGVsdGEgKz0gTWF0aC5tYXgoLTEsTWF0aC5taW4oMSxlLmR5KSkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VXaGVlbChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdrZXlVcCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IGUuc3RyO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25LZXlVcChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdrZXlEb3duJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2tleVN0ciAgPSBlLnN0cjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uS2V5RG93bihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBzZWxmLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkcmF3OmZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fZnJhbWVudW0gID0gdGhpcy5mcmFtZW51bTtcbiAgICAgICAgICAgIHRpbWUgICAgICAgICAgICA9IHNlbGYuX2ZyYW1ldGltZSA9IHRoaXMuZnJhbWV0aW1lO1xuXG4gICAgICAgICAgICBtb3VzZSAgICAgICAgICAgPSBhcHBPYmoubW91c2U7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZU1vdmUgPSBtb3VzZS5fcG9zaXRpb25bMF0gIT0gbW91c2UuX3Bvc2l0aW9uTGFzdFswXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzFdICE9IG1vdXNlLl9wb3NpdGlvbkxhc3RbMV07XG5cblxuICAgICAgICAgICAgLy9laCBqbywgVE9ETzogY2hlY2tcbiAgICAgICAgICAgIHNlbGYuX3RpbWVEZWx0YSA9IE1hdGgubWluKCh0aW1lIC0gcHJldlRpbWUpKjEwLDEpO1xuICAgICAgICAgICAgYXBwT2JqLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcHJldlRpbWUgPSB0aW1lO1xuXG4gICAgICAgIH19KTtcbn07XG5cbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mcmFtZXRpbWU7fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mcmFtZW51bTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVEZWx0YTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5nZXRUaW1lU3RhcnQgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVTdGFydDt9O1xuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lID0gYm9vbDtyZXR1cm4gdHJ1ZTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuICAgICAgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0Z1bGxzY3JlZW4gPSBib29sO3JldHVybiB0cnVlO307XG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLnNldEJvcmRlcmxlc3MgICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2lzQm9yZGVybGVzcyA9IGJvb2w7cmV0dXJuIHRydWU7fTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEltcGxQbGFzaztcblxuXG5cbiIsInZhciBEZWZhdWx0ICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9mRGVmYXVsdCcpLFxuICAgIEFwcEltcGwgICAgID0gcmVxdWlyZSgnLi9mQXBwSW1wbCcpLFxuICAgIGZHTCAgICAgICAgID0gcmVxdWlyZSgnLi4vZ3JhcGhpY3MvZkdMJyksXG4gICAgQ2FtZXJhQmFzaWMgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9mQ2FtZXJhQmFzaWMnKTtcblxuZnVuY3Rpb24gQXBwSW1wbFdlYigpXG57XG4gICAgQXBwSW1wbC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgY2FudmFzM2QgPSB0aGlzLl9jYW52YXMzZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjYW52YXMzZC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnMCcpO1xuICAgICAgICBjYW52YXMzZC5mb2N1cygpO1xuXG4gICAgdGhpcy5fY29udGV4dDNkID0gY2FudmFzM2QuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuXG4gICAgdmFyIGNhbnZhczJkID0gdGhpcy5fY2FudmFzMmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIHRoaXMuX3BhcmVudCAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX21vdXNlRXZlbnRUYXJnZXQgPSBjYW52YXMzZDtcbiAgICB0aGlzLl9rZXlFdmVudFRhcmdldCAgID0gY2FudmFzM2Q7XG5cbiAgICB0aGlzLl9jb250ZXh0MmQgPSBjYW52YXMyZC5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG59XG5cbkFwcEltcGxXZWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBJbXBsLnByb3RvdHlwZSk7XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uKCkgICB7cmV0dXJuIHRoaXMuX2NvbnRleHQzZC5wYXJlbnROb2RlO307XG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihvYmope3RoaXMuX3BhcmVudCA9IG9iajt9O1xuXG5cbkFwcEltcGxXZWIucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQpXG57XG4gICAgaWYodGhpcy5faXNGdWxsV2luZG93RnJhbWUpe3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDt9XG4gICAgaWYod2lkdGggPT0gdGhpcy5fd2lkdGggJiYgaGVpZ2h0ID09IHRoaXMuX2hlaWdodClyZXR1cm47XG5cbiAgICB0aGlzLl93aWR0aCAgPSB3aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fcmF0aW8gID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKGFwcE9iailcbntcbiAgICB2YXIgc2VsZiAgID0gdGhpcztcbiAgICB2YXIgbW91c2UgID0gYXBwT2JqLm1vdXNlO1xuICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMzZDtcblxuICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5fd2luZG93VGl0bGUgfHwgZG9jdW1lbnQudGl0bGU7XG5cbiAgICBpZighdGhpcy5fcGFyZW50KWRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBlbHNlIHRoaXMuX3BhcmVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG5cbiAgICB2YXIgbW91c2VFdmVudFRhcmdldCA9IHRoaXMuX21vdXNlRXZlbnRUYXJnZXQsXG4gICAgICAgIGtleUV2ZW50VGFyZ2V0ICAgPSB0aGlzLl9rZXlFdmVudFRhcmdldDtcblxuXG4gICAgYXBwT2JqLmZnbCA9IG5ldyBmR0wodGhpcy5fY29udGV4dDNkLHRoaXMuX2NvbnRleHQyZCk7XG4gICAgYXBwT2JqLmZnbC5nbC52aWV3cG9ydCgwLDAsdGhpcy5fd2lkdGgsdGhpcy5faGVpZ2h0KTtcblxuICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICBhcHBPYmouZmdsLnNldENhbWVyYShhcHBPYmouY2FtZXJhKTtcbiAgICBhcHBPYmouY2FtZXJhLnNldFBlcnNwZWN0aXZlKERlZmF1bHQuQ0FNRVJBX0ZPVixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdC5DQU1FUkFfTkVBUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERlZmF1bHQuQ0FNRVJBX0ZBUik7XG4gICAgYXBwT2JqLmNhbWVyYS5zZXRUYXJnZXQzZigwLDAsMCk7XG4gICAgYXBwT2JqLmNhbWVyYS51cGRhdGVNYXRyaWNlcygpO1xuXG4gICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBtb3VzZS5fcG9zaXRpb25bMF07XG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25MYXN0WzFdID0gbW91c2UuX3Bvc2l0aW9uWzFdO1xuXG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25bMF0gPSBlLnBhZ2VYO1xuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzFdID0gZS5wYWdlWTtcblxuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VNb3ZlKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VEb3duKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZVVwKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VXaGVlbERlbHRhICs9IE1hdGgubWF4KC0xLE1hdGgubWluKDEsIGUud2hlZWxEZWx0YSkpICogLTE7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZVdoZWVsKGUpO1xuICAgICAgICB9KTtcblxuXG4gICAga2V5RXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5fa2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgIHNlbGYuX2tleVN0ciAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSk7Ly9ub3QgcmVsaWFibGU7XG4gICAgICAgICAgICBhcHBPYmoub25LZXlEb3duKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAga2V5RXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9rZXlEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcbiAgICAgICAgICAgIGFwcE9iai5vbktleVVwKGUpO1xuXG4gICAgICAgIH0pO1xuXG5cbiAgICB2YXIgZnVsbFdpbmRvd0ZyYW1lID0gdGhpcy5faXNGdWxsV2luZG93RnJhbWU7XG4gICAgdmFyIGNhbWVyYTtcbiAgICB2YXIgZ2w7XG5cbiAgICB2YXIgd2luZG93V2lkdGgsXG4gICAgICAgIHdpbmRvd0hlaWdodDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNhbWVyYVJhdGlvKClcbiAgICB7XG4gICAgICAgIGNhbWVyYSA9IGFwcE9iai5jYW1lcmE7XG4gICAgICAgIGNhbWVyYS5zZXRBc3BlY3RSYXRpbyhzZWxmLl9yYXRpbyk7XG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlVmlld3BvcnRHTCgpXG4gICAge1xuICAgICAgICBnbCA9IGFwcE9iai5mZ2w7XG4gICAgICAgIGdsLmdsLnZpZXdwb3J0KDAsMCxzZWxmLl93aWR0aCxzZWxmLl9oZWlnaHQpO1xuICAgICAgICBnbC5jbGVhckNvbG9yKGdsLmdldENsZWFyQnVmZmVyKCkpO1xuICAgIH1cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgICAgICBpZihmdWxsV2luZG93RnJhbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTaXplKHdpbmRvd1dpZHRoLHdpbmRvd0hlaWdodCk7XG5cbiAgICAgICAgICAgICAgICB1cGRhdGVDYW1lcmFSYXRpbygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVZpZXdwb3J0R0woKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBwT2JqLm9uV2luZG93UmVzaXplKGUpO1xuXG4gICAgICAgICAgICBpZighZnVsbFdpbmRvd0ZyYW1lICYmIChzZWxmLl93aWR0aCA9PSB3aW5kb3dXaWR0aCAmJiBzZWxmLl9oZWlnaHQgPT0gd2luZG93SGVpZ2h0KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVDYW1lcmFSYXRpbygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVZpZXdwb3J0R0woKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBpZih0aGlzLl9iVXBkYXRlKVxuICAgIHtcbiAgICAgICAgdmFyIHRpbWUsIHRpbWVEZWx0YTtcbiAgICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHRoaXMuX3RpbWVJbnRlcnZhbDtcbiAgICAgICAgdmFyIHRpbWVOZXh0O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUsbnVsbCk7XG5cbiAgICAgICAgICAgIHRpbWUgICAgICA9IHNlbGYuX3RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGltZURlbHRhID0gdGltZSAtIHNlbGYuX3RpbWVOZXh0O1xuXG4gICAgICAgICAgICBzZWxmLl90aW1lRGVsdGEgPSBNYXRoLm1pbih0aW1lRGVsdGEgLyB0aW1lSW50ZXJ2YWwsIDEpO1xuXG4gICAgICAgICAgICBpZih0aW1lRGVsdGEgPiB0aW1lSW50ZXJ2YWwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGltZU5leHQgPSBzZWxmLl90aW1lTmV4dCA9IHRpbWUgLSAodGltZURlbHRhICUgdGltZUludGVydmFsKTtcblxuICAgICAgICAgICAgICAgIGFwcE9iai51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuX3RpbWVFbGFwc2VkID0gKHRpbWVOZXh0IC0gc2VsZi5fdGltZVN0YXJ0KSAvIDEwMDAuMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9mcmFtZW51bSsrO1xuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKCk7XG5cbiAgICB9XG4gICAgZWxzZSBhcHBPYmoudXBkYXRlKCk7XG5cbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG59O1xuXG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihhcHBPYmopXG57XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpe3NlbGYuX2luaXQoYXBwT2JqKTt9KTtcbn07XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLl91cGRhdGVDYW52YXMzZFNpemUgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhczNkLFxuICAgICAgICB3aWR0aCAgPSB0aGlzLl93aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSB3aWR0aCAgKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgY2FudmFzLndpZHRoICAgICAgICA9IHdpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ICAgICAgID0gaGVpZ2h0O1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lRWxhcHNlZDt9O1xuQXBwSW1wbFdlYi5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lRGVsdGE7fTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uKG9iail7dGhpcy5fbW91c2VFdmVudFRhcmdldCA9IG9iajt9O1xuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0S2V5TGlzdGVuZXJUYXJnZXQgICA9IGZ1bmN0aW9uKG9iail7dGhpcy5fa2V5RXZlbnRUYXJnZXQgPSBvYmo7fTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSAgICAgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGJvb2w7cmV0dXJuIHRydWU7fTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEltcGxXZWI7XG5cbiIsInZhciBmRXJyb3IgICAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZkVycm9yJyksXG4gICAgUGxhdGZvcm0gICAgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2ZQbGF0Zm9ybScpLFxuICAgIEFwcEltcGxXZWIgICA9IHJlcXVpcmUoJy4vZkFwcEltcGxXZWInKSxcbiAgICBBcHBJbXBsUGxhc2sgPSByZXF1aXJlKCcuL2ZBcHBJbXBsUGxhc2snKSxcbiAgICBNb3VzZSAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2ZNb3VzZScpLFxuICAgIENhbWVyYUJhc2ljICA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2ZDYW1lcmFCYXNpYycpO1xuXG5cbmZ1bmN0aW9uIEFwcGxpY2F0aW9uKClcbntcbiAgICBpZihBcHBsaWNhdGlvbi5fX2luc3RhbmNlKXRocm93IG5ldyBFcnJvcihmRXJyb3IuQ0xBU1NfSVNfU0lOR0xFVE9OKTtcblxuICAgIHZhciB0YXJnZXQgID0gUGxhdGZvcm0uZ2V0VGFyZ2V0KCk7XG4gICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgKXRocm93IG5ldyBFcnJvcihmRXJyb3IuV1JPTkdfUExBVEZPUk0pO1xuXG4gICAgdGhpcy5fYXBwSW1wbCA9IHRhcmdldCA9PSBQbGF0Zm9ybS5XRUIgICA/IG5ldyBBcHBJbXBsV2ViKGFyZ3VtZW50cykgOlxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPT0gUGxhdGZvcm0uUExBU0sgPyBuZXcgQXBwSW1wbFBsYXNrKGFyZ3VtZW50cykgOlxuICAgICAgICAgICAgICAgICAgICBudWxsO1xuXG4gICAgdGhpcy5tb3VzZSAgPSBuZXcgTW91c2UoKTtcbiAgICB0aGlzLmZnbCAgICA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuXG4gICAgQXBwbGljYXRpb24uX19pbnN0YW5jZSA9IHRoaXM7XG59XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXR1cCAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihmRXJyb3IuQVBQX05PX1NFVFVQKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKGZFcnJvci5BUFBfTk9fVVBEQVRFKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodClcbntcbiAgICB2YXIgYXBwSW1wbCA9IHRoaXMuX2FwcEltcGw7XG4gICAgICAgIGFwcEltcGwuc2V0U2l6ZSh3aWR0aCxoZWlnaHQpO1xuXG4gICAgaWYoIWFwcEltcGwuaXNJbml0aWFsaXplZCgpKWFwcEltcGwuaW5pdCh0aGlzKTtcbn07XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRXaWR0aCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRIZWlnaHQoKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0VXBkYXRlID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5fYXBwSW1wbC5zZXRVcGRhdGUoYm9vbCk7fTtcblxuXG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRXaW5kb3dUaXRsZSAgICAgICA9IGZ1bmN0aW9uKHRpdGxlKXt0aGlzLl9hcHBJbXBsLnNldFdpbmRvd1RpdGxlKHRpdGxlKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnJlc3RyaWN0TW91c2VUb0ZyYW1lID0gZnVuY3Rpb24oYm9vbCkge3RoaXMuX2FwcEltcGwucmVzdHJpY3RNb3VzZVRvRnJhbWUoYm9vbCk7fTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSAgPSBmdW5jdGlvbihib29sKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXRGdWxsV2luZG93RnJhbWUoYm9vbCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbHNjcmVlbih0cnVlKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzRnVsbHNjcmVlbiAgICAgICAgPSBmdW5jdGlvbigpICAgIHtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc0Z1bGxzY3JlZW4oKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldEJvcmRlcmxlc3MgICAgICAgPSBmdW5jdGlvbihib29sKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXRCb3JkZXJsZXNzKGJvb2wpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzQm9yZGVybGVzcygpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0RGlzcGxheSAgICAgICAgICA9IGZ1bmN0aW9uKG51bSkge3JldHVybiB0aGlzLl9hcHBJbXBsLnNldERpc3BsYXkobnVtKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldERpc3BsYXkgICAgICAgICAgPSBmdW5jdGlvbigpICAgIHtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXREaXNwbGF5KCk7fTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldFRhcmdldEZQUyA9IGZ1bmN0aW9uKGZwcyl7dGhpcy5fYXBwSW1wbC5zZXRUYXJnZXRGUFMoZnBzKTt9O1xuXG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc0tleURvd24gICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmlzS2V5RG93bigpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNNb3VzZURvd24gICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc01vdXNlRG93bigpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNNb3VzZU1vdmUgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc01vdXNlTW92ZSgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0S2V5U3RyICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRLZXlTdHIoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldEtleUNvZGUgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0S2V5Q29kZSgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRNb3VzZVdoZWVsRGVsdGEoKTt9O1xuXG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbktleURvd24gICAgPSBmdW5jdGlvbihlKXt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uS2V5VXAgICAgICA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZVVwICAgID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlRG93biAgPSBmdW5jdGlvbihlKXt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uTW91c2VXaGVlbCA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZU1vdmUgID0gZnVuY3Rpb24oZSl7fTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uV2luZG93UmVzaXplID0gZnVuY3Rpb24oZSl7fTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRGcmFtZXNFbGFwc2VkKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0U2Vjb25kc0VsYXBzZWQoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWUgICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lU3RhcnQgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZVN0YXJ0KCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lTmV4dCAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZU5leHQoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWVEZWx0YSAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lRGVsdGEoKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0QXNwZWN0UmF0aW9XaW5kb3cgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEFzcGVjdFJhdGlvKCk7fTtcblxuQXBwbGljYXRpb24uX19pbnN0YW5jZSA9IG51bGw7XG5BcHBsaWNhdGlvbi5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKCl7cmV0dXJuIEFwcGxpY2F0aW9uLl9faW5zdGFuY2U7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBsaWNhdGlvbjtcblxuXG5cblxuXG4iLCIvKipcbiAqXG4gKlxuICogIEYgfCBPIHwgQSB8IE1cbiAqXG4gKlxuICogRm9hbSAtIEEgUGxhc2svV2ViIEdMIHRvb2xraXRcbiAqXG4gKiBGb2FtIGlzIGF2YWlsYWJsZSB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBsaWNlbnNlLiAgVGhlIGZ1bGwgdGV4dCBvZiB0aGVcbiAqIE1JVCBsaWNlbnNlIGlzIGluY2x1ZGVkIGJlbG93LlxuICpcbiAqIE1JVCBMaWNlbnNlXG4gKiA9PT09PT09PT09PVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMyBIZW5yeWsgV29sbGlrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbiAqIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogU09GVFdBUkUuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBNYXRoICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9mTWF0aCcpLFxuICAgIFZlYzIgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZWZWMyJyksXG4gICAgVmVjMyAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZlZlYzMnKSxcbiAgICBWZWM0ICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9mVmVjNCcpLFxuICAgIE1hdDMzICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZNYXQzMycpLFxuICAgIE1hdDQ0ICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZNYXQ0NCcpLFxuICAgIFF1YXRlcm5pb24gIDogcmVxdWlyZSgnLi9tYXRoL2ZRdWF0ZXJuaW9uJyksXG5cblxuICAgIE1hdEdMICAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZk1hdEdMJyksXG4gICAgUHJvZ0xvYWRlciAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9zaGFkZXIvZlByb2dMb2FkZXInKSxcbiAgICBTaGFkZXJMb2FkZXIgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL3NoYWRlci9mU2hhZGVyTG9hZGVyJyksXG4gICAgQ2FtZXJhQmFzaWMgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9mQ2FtZXJhQmFzaWMnKSxcblxuICAgIExpZ2h0ICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2ZMaWdodCcpLFxuICAgIFBvaW50TGlnaHQgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2ZQb2ludExpZ2h0JyksXG4gICAgRGlyZWN0aW9uYWxMaWdodCA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZkRpcmVjdGlvbmFsTGlnaHQnKSxcbiAgICBTcG90TGlnaHQgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9mU3BvdExpZ2h0JyksXG5cbiAgICBNYXRlcmlhbCAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZk1hdGVyaWFsJyksXG4gICAgVGV4dHVyZSAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2ZUZXh0dXJlJyksXG5cbiAgICBmR0xVdGlsICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvdXRpbC9mR0xVdGlsJyksXG4gICAgZkdMICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2ZHTCcpLFxuXG4gICAgTW91c2UgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZk1vdXNlJyksXG4gICAgQ29sb3IgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZkNvbG9yJyksXG4gICAgVXRpbCAgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZlV0aWwnKSxcblxuICAgIFBsYXRmb3JtICAgIDogcmVxdWlyZSgnLi9zeXN0ZW0vZlBsYXRmb3JtJyksXG5cbiAgICBHZW9tM2QgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9mR2VvbTNkJyksXG4gICAgUGFyYW1ldHJpY1N1cmZhY2UgOiByZXF1aXJlKCcuL2dlb20vZlBhcmFtZXRyaWNTdXJmYWNlJyksXG4gICAgSVNPU3VyZmFjZSAgICAgICAgOiByZXF1aXJlKCcuL2dlb20vZklTT1N1cmZhY2UnKSxcbiAgICBJU09CYW5kICAgICAgICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9mSVNPQmFuZCcpLFxuICAgIExpbmVCdWZmZXIyZCAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2ZMaW5lQnVmZmVyMmQnKSxcbiAgICBMaW5lQnVmZmVyM2QgICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9mTGluZUJ1ZmZlcjNkJyksXG4gICAgU3BsaW5lICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dlb20vZlNwbGluZScpLFxuICAgIExpbmUyZFV0aWwgICAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2ZMaW5lMmRVdGlsJyksXG4gICAgUG9seWdvbjJkVXRpbCAgICAgOiByZXF1aXJlKCcuL2dlb20vZlBvbHlnb24yZFV0aWwnKSxcblxuXG4gICAgQXBwbGljYXRpb24gOiByZXF1aXJlKCcuL2FwcC9mQXBwbGljYXRpb24nKVxuXG59O1xuXG4iLCJmdW5jdGlvbiBHZW9tM2QoKVxue1xuICAgIHRoaXMudmVydGljZXMgID0gbnVsbDtcbiAgICB0aGlzLm5vcm1hbHMgICA9IG51bGw7XG4gICAgdGhpcy5jb2xvcnMgICAgPSBudWxsO1xuICAgIHRoaXMuaW5kaWNlcyAgID0gbnVsbDtcbiAgICB0aGlzLnRleENvb3JkcyA9IG51bGw7XG59XG5cbi8vVE9ETyBtZXJnZVxuR2VvbTNkLnByb3RvdHlwZS51cGRhdGVWZXJ0ZXhOb3JtYWxzID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBpbmRpY2VzICA9IHRoaXMuaW5kaWNlcyxcbiAgICAgICAgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzLFxuICAgICAgICBub3JtYWxzICA9IHRoaXMubm9ybWFscztcblxuICAgIHZhciBpO1xuICAgIHZhciBhLCBiLCBjO1xuICAgIHZhciBlMngsIGUyeSwgZTJ6LFxuICAgICAgICBlMXgsIGUxeSwgZTF6O1xuXG4gICAgdmFyIG54LCBueSwgbnosXG4gICAgICAgIHZieCwgdmJ5LCB2YnosXG4gICAgICAgIGEwLCBhMSwgYTIsXG4gICAgICAgIGIwLCBiMSwgYjIsXG4gICAgICAgIGMwLCBjMSwgYzI7XG5cbiAgICBpID0gMDtcbiAgICB3aGlsZSggaSA8IG5vcm1hbHMubGVuZ3RoIClcbiAgICB7XG4gICAgICAgIG5vcm1hbHNbaV0gPSBub3JtYWxzW2krMV0gPSBub3JtYWxzW2krMl0gPSAwLjA7XG4gICAgICAgIGkrPTM7XG4gICAgfVxuXG4gICAgaSA9IDA7XG4gICAgd2hpbGUoIGkgPCBpbmRpY2VzLmxlbmd0aCApXG4gICAge1xuICAgICAgICBhID0gaW5kaWNlc1tpICBdKjM7XG4gICAgICAgIGIgPSBpbmRpY2VzW2krMV0qMztcbiAgICAgICAgYyA9IGluZGljZXNbaSsyXSozO1xuXG4gICAgICAgIGEwID0gYTtcbiAgICAgICAgYTEgPSBhKzE7XG4gICAgICAgIGEyID0gYSsyO1xuXG4gICAgICAgIGIwID0gYjtcbiAgICAgICAgYjEgPSBiKzE7XG4gICAgICAgIGIyID0gYisyO1xuXG4gICAgICAgIGMwID0gYztcbiAgICAgICAgYzEgPSBjKzE7XG4gICAgICAgIGMyID0gYysyO1xuXG4gICAgICAgIHZieCA9IHZlcnRpY2VzW2IwXTtcbiAgICAgICAgdmJ5ID0gdmVydGljZXNbYjFdO1xuICAgICAgICB2YnogPSB2ZXJ0aWNlc1tiMl07XG5cbiAgICAgICAgZTF4ID0gdmVydGljZXNbYTBdLXZieDtcbiAgICAgICAgZTF5ID0gdmVydGljZXNbYTFdLXZieTtcbiAgICAgICAgZTF6ID0gdmVydGljZXNbYTJdLXZiejtcblxuICAgICAgICBlMnggPSB2ZXJ0aWNlc1tjMF0tdmJ4O1xuICAgICAgICBlMnkgPSB2ZXJ0aWNlc1tjMV0tdmJ5O1xuICAgICAgICBlMnogPSB2ZXJ0aWNlc1tjMl0tdmJ6O1xuXG4gICAgICAgIG54ID0gZTF5ICogZTJ6IC0gZTF6ICogZTJ5O1xuICAgICAgICBueSA9IGUxeiAqIGUyeCAtIGUxeCAqIGUyejtcbiAgICAgICAgbnogPSBlMXggKiBlMnkgLSBlMXkgKiBlMng7XG5cbiAgICAgICAgbm9ybWFsc1thMF0gKz0gbng7XG4gICAgICAgIG5vcm1hbHNbYTFdICs9IG55O1xuICAgICAgICBub3JtYWxzW2EyXSArPSBuejtcblxuICAgICAgICBub3JtYWxzW2IwXSArPSBueDtcbiAgICAgICAgbm9ybWFsc1tiMV0gKz0gbnk7XG4gICAgICAgIG5vcm1hbHNbYjJdICs9IG56O1xuXG4gICAgICAgIG5vcm1hbHNbYzBdICs9IG54O1xuICAgICAgICBub3JtYWxzW2MxXSArPSBueTtcbiAgICAgICAgbm9ybWFsc1tjMl0gKz0gbno7XG5cbiAgICAgICAgaSs9MztcbiAgICB9XG5cbiAgICB2YXIgeCwgeSwgeiwgbDtcblxuICAgIGkgPSAwO1xuICAgIHdoaWxlKGkgPCBub3JtYWxzLmxlbmd0aClcbiAgICB7XG5cbiAgICAgICAgeCA9IG5vcm1hbHNbaSAgXTtcbiAgICAgICAgeSA9IG5vcm1hbHNbaSsxXTtcbiAgICAgICAgeiA9IG5vcm1hbHNbaSsyXTtcblxuICAgICAgICBsID0gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICAgICAgbCA9IDEgLyAobCB8fCAxKTtcblxuICAgICAgICBub3JtYWxzW2kgIF0gKj0gbDtcbiAgICAgICAgbm9ybWFsc1tpKzFdICo9IGw7XG4gICAgICAgIG5vcm1hbHNbaSsyXSAqPSBsO1xuXG4gICAgICAgIGkrPTM7XG4gICAgfVxuXG59O1xuXG5cbkdlb20zZC5wcm90b3R5cGUuc2V0VmVydGV4ID0gZnVuY3Rpb24oaW5kZXgsdilcbntcbiAgICBpbmRleCAqPSAzO1xuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG4gICAgdmVydGljZXNbaW5kZXggIF0gPSB2WzBdO1xuICAgIHZlcnRpY2VzW2luZGV4KzFdID0gdlsxXTtcbiAgICB2ZXJ0aWNlc1tpbmRleCsyXSA9IHZbMl07XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldFZlcnRleDNmID0gZnVuY3Rpb24oaW5kZXgseCx5LHopXG57XG4gICAgaW5kZXgqPTM7XG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcbiAgICB2ZXJ0aWNlc1tpbmRleCAgXSA9IHg7XG4gICAgdmVydGljZXNbaW5kZXgrMV0gPSB5O1xuICAgIHZlcnRpY2VzW2luZGV4KzJdID0gejtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0Q29sb3I0ZiA9IGZ1bmN0aW9uKGluZGV4LHIsZyxiLGEpXG57XG4gICAgaW5kZXggKj0gNDtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgY29sb3JzW2luZGV4ICBdID0gcjtcbiAgICBjb2xvcnNbaW5kZXgrMV0gPSBnO1xuICAgIGNvbG9yc1tpbmRleCsyXSA9IGI7XG4gICAgY29sb3JzW2luZGV4KzNdID0gYTtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0Q29sb3IzZiA9IGZ1bmN0aW9uKGluZGV4LHIsZyxiKVxue1xuICAgIGluZGV4ICo9IDQ7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuICAgIGNvbG9yc1tpbmRleCAgXSA9IHI7XG4gICAgY29sb3JzW2luZGV4KzFdID0gZztcbiAgICBjb2xvcnNbaW5kZXgrMl0gPSBiO1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRDb2xvcjJmID0gZnVuY3Rpb24oaW5kZXgsayxhKVxue1xuICAgIGluZGV4ICo9IDQ7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuICAgIGNvbG9yc1tpbmRleCAgXSA9IGs7XG4gICAgY29sb3JzW2luZGV4KzFdID0gaztcbiAgICBjb2xvcnNbaW5kZXgrMl0gPSBrO1xuICAgIGNvbG9yc1tpbmRleCszXSA9IGE7XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldENvbG9yMWYgPSBmdW5jdGlvbihpbmRleCxrKVxue1xuICAgIGluZGV4ICo9IDQ7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuICAgIGNvbG9yc1tpbmRleCAgXSA9IGs7XG4gICAgY29sb3JzW2luZGV4KzFdID0gaztcbiAgICBjb2xvcnNbaW5kZXgrMl0gPSBrO1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRDb2xvciA9IGZ1bmN0aW9uKGluZGV4LGNvbG9yKVxue1xuICAgIGluZGV4Kj00O1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgICBjb2xvcnNbaW5kZXggIF0gPSBjb2xvclswXTtcbiAgICBjb2xvcnNbaW5kZXgrMV0gPSBjb2xvclsxXTtcbiAgICBjb2xvcnNbaW5kZXgrMl0gPSBjb2xvclsyXTtcbiAgICBjb2xvcnNbaW5kZXgrM10gPSBjb2xvclszXTtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0VGV4Q29vcmQyZiA9IGZ1bmN0aW9uKGluZGV4LHUsdilcbntcbiAgICBpbmRleCo9MjtcbiAgICB2YXIgdGV4Q29vcmRzID0gdGhpcy50ZXhDb29yZHM7XG4gICAgdGV4Q29vcmRzW2luZGV4ICBdID0gdTtcbiAgICB0ZXhDb29yZHNbaW5kZXgrMV0gPSB2O1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRUZXhDb29yZCA9IGZ1bmN0aW9uKGluZGV4LHYpXG57XG4gICAgaW5kZXgqPTI7XG4gICAgdmFyIHRleENvb3JkcyA9IHRoaXMudGV4Q29vcmRzO1xuICAgIHRleENvb3Jkc1tpbmRleCAgXSA9IHZbMF07XG4gICAgdGV4Q29vcmRzW2luZGV4KzFdID0gdlsxXTtcbn07XG5cblxuR2VvbTNkLnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uKGdsKVxue1xuICAgIGdsLmRyYXdFbGVtZW50cyh0aGlzLnZlcnRpY2VzLHRoaXMubm9ybWFscyx0aGlzLmNvbG9ycyx0aGlzLnRleENvb3Jkcyx0aGlzLmluZGljZXMsZ2wuX2RyYXdNb2RlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2VvbTNkOyIsInZhciBHZW9tM2QgPSByZXF1aXJlKCcuL2ZHZW9tM2QnKTtcblxuZnVuY3Rpb24gSVNPQmFuZChzaXplWCxzaXplWix1bml0U2NhbGVYLHVuaXRTY2FsZVopXG57XG4gICAgdGhpcy5fdmVydFNpemVYICA9IG51bGw7XG4gICAgdGhpcy5fdmVydFNpemVaICA9IG51bGw7XG4gICAgdGhpcy5fdW5pdFNjYWxlWCA9IDE7XG4gICAgdGhpcy5fdW5pdFNjYWxlWiA9IDE7XG5cbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aClcbiAgICB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWiA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVogPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVaID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgdGhpcy5fdW5pdFNjYWxlWCA9IHRoaXMuX3VuaXRTY2FsZVogPSBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYICA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWiAgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB0aGlzLl91bml0U2NhbGVYID0gYXJndW1lbnRzWzJdO1xuICAgICAgICAgICAgdGhpcy5fdW5pdFNjYWxlWiA9IGFyZ3VtZW50c1szXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWiA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIHRoaXMuX2NlbGxTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCAtIDE7XG4gICAgdGhpcy5fY2VsbFNpemVaID0gdGhpcy5fdmVydFNpemVaIC0gMTtcblxuICAgIHRoaXMuX2Z1bmMgICAgID0gZnVuY3Rpb24oeCx5LGFyZzAsYXJnMSxhcmcyKXtyZXR1cm4gMDt9O1xuICAgIHRoaXMuX2Z1bmNBcmcwID0gMDtcbiAgICB0aGlzLl9mdW5jQXJnMSA9IDA7XG4gICAgdGhpcy5fZnVuY0FyZzIgPSAwO1xuICAgIHRoaXMuX2lzb0xldmVsID0gMDtcblxuICAgIHRoaXMuX2ludGVycG9sYXRlVmFsdWVzID0gdHJ1ZTtcblxuICAgIHRoaXMuX251bVRyaWFuZ2xlcyA9IDA7XG5cbiAgICAvL1RPRE8gQ0hFQ0sgTUFYIEVMRU1FTlQgRVhDRUVEXG4gICAgdGhpcy5fdmVydHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX3ZlcnRTaXplWCAqIHRoaXMuX3ZlcnRTaXplWiAqIDQpOyAvLyBncmlkIGNhbGN1bGF0ZWQgbm9ybSB2YWx1ZXMgKyBmdW5jdGlvbiByZXN1bHQgdmFsdWUgLi4uLHgseSx6LHYsLi4uXG4gICAgdGhpcy5fY2VsbHMgPSBuZXcgQXJyYXkodGhpcy5fY2VsbFNpemVYICogdGhpcy5fY2VsbFNpemVaKTtcblxuICAgIHRoaXMuX2VkZ2VzID0gbmV3IEZsb2F0MzJBcnJheSgodGhpcy5fY2VsbFNpemVaICogdGhpcy5fY2VsbFNpemVYICogMiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jZWxsU2l6ZVogKyB0aGlzLl9jZWxsU2l6ZVgpICogMyk7XG5cblxuICAgIHRoaXMuX3RlbXBDZWxsVmVydGljZXNWYWxzID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxuICAgIHRoaXMuX2luZGljZXMgPSBbXTtcblxuICAgIC8qXG4gICAgLy90ZW1wIFRPRE8gcmVtb3ZlXG4gICAgdGhpcy5fX2FwcFVpbnRUeXBlRW5hYmxlZCA9IEZvYW0uQXBwbGljYXRpb24uZ2V0SW5zdGFuY2UoKS5nbC5pc1VJbnRFbGVtZW50VHlwZUF2YWlsYWJsZSgpO1xuICAgICovXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB0aGlzLl9nZW5TdXJmYWNlKCk7XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPQmFuZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlb20zZC5wcm90b3R5cGUpO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuLy9kb250IG5lZWQgdGhpc1xuSVNPQmFuZC5wcm90b3R5cGUuc2V0RnVuY3Rpb24gPSBmdW5jdGlvbihmdW5jLGlzb0xldmVsKVxue1xuICAgIHZhciBmdW5jQXJnc0xlbmd0aCA9IGZ1bmMubGVuZ3RoO1xuXG4gICAgaWYoZnVuY0FyZ3NMZW5ndGggPCAyKXRocm93ICdGdW5jdGlvbiBzaG91bGQgc2F0aXNmeSBmdW5jdGlvbih4LHkpe30nO1xuICAgIGlmKGZ1bmNBcmdzTGVuZ3RoID4gNSl0aHJvdyAnRnVuY3Rpb24gaGFzIHRvIG1hbnkgYXJndW1lbnRzLiBBcmd1bWVudHMgbGVuZ3RoIHNob3VsZCBub3QgZXhjZWVkIDUuIEUuZyBmdW5jdGlvbih4LHksYXJnMCxhcmcxLGFyZzIpLic7XG5cbiAgICB2YXIgZnVuY1N0cmluZyA9IGZ1bmMudG9TdHJpbmcoKSxcbiAgICAgICAgZnVuY0FyZ3MgICA9IGZ1bmNTdHJpbmcuc2xpY2UoZnVuY1N0cmluZy5pbmRleE9mKCcoJykgKyAxLCBmdW5jU3RyaW5nLmluZGV4T2YoJyknKSkuc3BsaXQoJywnKSxcbiAgICAgICAgZnVuY0JvZHkgICA9IGZ1bmNTdHJpbmcuc2xpY2UoZnVuY1N0cmluZy5pbmRleE9mKCd7JykgKyAxLCBmdW5jU3RyaW5nLmxhc3RJbmRleE9mKCd9JykpO1xuXG4gICAgdGhpcy5fZnVuYyAgICAgPSBuZXcgRnVuY3Rpb24oZnVuY0FyZ3NbMF0sIGZ1bmNBcmdzWzFdLFxuICAgICAgICBmdW5jQXJnc1syXSB8fCAnYXJnMCcsIGZ1bmNBcmdzWzNdIHx8ICdhcmcxJywgZnVuY0FyZ3NbNF0gfHwgJ2FyZzInLFxuICAgICAgICBmdW5jQm9keSk7XG4gICAgdGhpcy5faXNvTGV2ZWwgPSBpc29MZXZlbCB8fCAwO1xuXG5cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIFNldHVwIHBvaW50c1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09CYW5kLnByb3RvdHlwZS5fZ2VuU3VyZmFjZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgdmVydFNpemVYID0gdGhpcy5fdmVydFNpemVYLFxuICAgICAgICB2ZXJ0U2l6ZVogPSB0aGlzLl92ZXJ0U2l6ZVo7XG5cbiAgICB2YXIgY2VsbFNpemVYID0gdGhpcy5fY2VsbFNpemVYLFxuICAgICAgICBjZWxsU2l6ZVogPSB0aGlzLl9jZWxsU2l6ZVo7XG5cbiAgICB2YXIgc2NhbGVYID0gdGhpcy5fdW5pdFNjYWxlWCxcbiAgICAgICAgc2NhbGVaID0gdGhpcy5fdW5pdFNjYWxlWjtcblxuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzLFxuICAgICAgICB2ZXJ0c0luZGV4LFxuICAgICAgICB2ZXJ0c0luZGV4Um93TmV4dCxcbiAgICAgICAgY2VsbHMgPSB0aGlzLl9jZWxscyxcbiAgICAgICAgY2VsbHNJbmRleDtcblxuICAgIHZhciBpLGo7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgdmVydFNpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCB2ZXJ0U2l6ZVgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZlcnRzSW5kZXggICAgICAgICAgPSAodmVydFNpemVYICogaSArIGopKjQ7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4ICBdID0gKC0wLjUgKyAoai8odmVydFNpemVYIC0gMSkpKSAqIHNjYWxlWDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXgrMV0gPSAwO1xuICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleCsyXSA9ICgtMC41ICsgKGkvKHZlcnRTaXplWiAtIDEpKSkgKiBzY2FsZVo7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4KzNdID0gLTE7XG5cbiAgICAgICAgICAgIGlmKGkgPCBjZWxsU2l6ZVogJiYgaiA8IGNlbGxTaXplWClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4Um93TmV4dCA9ICh2ZXJ0U2l6ZVggKiBpICsgaiArIHZlcnRTaXplWCkgKiA0O1xuXG4gICAgICAgICAgICAgICAgY2VsbHNJbmRleCAgICAgICAgPSBjZWxsU2l6ZVggKiBpICsgajtcbiAgICAgICAgICAgICAgICBjZWxsc1tjZWxsc0luZGV4XSA9IFt2ZXJ0c0luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXhSb3dOZXh0ICsgNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4Um93TmV4dCBdO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBhcHBseSBmdW5jdGlvbiB0byBkYXRhIHBvaW50c1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09CYW5kLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uID0gZnVuY3Rpb24oYXJnMCxhcmcxLGFyZzIpXG57XG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHMsXG4gICAgICAgIHZlcnRzSW5kZXg7XG5cbiAgICB2YXIgdmVydFNpemVYID0gdGhpcy5fdmVydFNpemVYLFxuICAgICAgICB2ZXJ0U2l6ZVogPSB0aGlzLl92ZXJ0U2l6ZVo7XG5cbiAgICB2YXIgaSwgajtcblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCB2ZXJ0U2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHZlcnRTaXplWClcbiAgICAgICAge1xuICAgICAgICAgICAgdmVydHNJbmRleCA9ICh2ZXJ0U2l6ZVggKiBpICsgaikgKiA0O1xuICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleCArIDNdID0gdGhpcy5fZnVuYyh2ZXJ0c1t2ZXJ0c0luZGV4XSx2ZXJ0c1t2ZXJ0c0luZGV4KzJdLGFyZzAsYXJnMSxhcmcyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWFyY2goKTtcbn07XG5cbklTT0JhbmQucHJvdG90eXBlLmFwcGx5RnVuY3Rpb25NdWx0ID0gZnVuY3Rpb24oYXJnMCxhcmcxLGFyZzIpXG57XG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHMsXG4gICAgICAgIHZlcnRzSW5kZXg7XG5cbiAgICB2YXIgdmVydHNTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCxcbiAgICAgICAgdmVydHNTaXplWiA9IHRoaXMuX3ZlcnRTaXplWjtcblxuICAgIHZhciBpLCBqO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHZlcnRzU2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHZlcnRzU2l6ZVgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZlcnRzSW5kZXggPSAodmVydHNTaXplWCAqIGkgKyBqKSAqIDQ7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4ICsgM10gKj0gdGhpcy5fZnVuYyh2ZXJ0c1t2ZXJ0c0luZGV4XSx2ZXJ0c1t2ZXJ0c0luZGV4KzJdLGFyZzAsYXJnMSxhcmcyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWFyY2goKTtcbn07XG5cbklTT0JhbmQucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihkYXRhLHdpZHRoLGhlaWdodClcbntcblxuICAgIHZhciB2ZXJ0c1NpemVYID0gdGhpcy5fdmVydFNpemVYLFxuICAgICAgICB2ZXJ0c1NpemVaID0gdGhpcy5fdmVydFNpemVaO1xuXG4gICAgaWYod2lkdGggPiB2ZXJ0c1NpemVaIHx8IGhlaWdodCA+IHZlcnRzU2l6ZVgpXG4gICAgICAgIHRocm93ICdEYXRhIGV4Y2VlZHMgYnVmZmVyIHNpemUuIFNob3VsZCBub3QgZXhjZWVkICcgKyB2ZXJ0c1NpemVaICsgJyBpbiB3aWR0aCBhbmQgJyArIHZlcnRzU2l6ZVggKyAnIGluIGhlaWdodCc7XG5cbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cztcblxuICAgIHZhciBpICxqO1xuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCB3aWR0aClcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgaGVpZ2h0KVxuICAgICAgICB7XG4gICAgICAgICAgICB2ZXJ0c1soaGVpZ2h0ICogaSArIGopICogNCArIDNdID0gZGF0YVtoZWlnaHQgKiBpICsgal07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gbWFyY2hcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPQmFuZC5wcm90b3R5cGUubWFyY2ggPSBmdW5jdGlvbigpXG57XG4gICAgLy9yZXNldCBpbmRpY2VzXG4gICAgdmFyIGluZGljZXMgPSB0aGlzLl9pbmRpY2VzID0gW107XG5cbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cztcblxuICAgIHZhciBpLCBqLCBrO1xuXG4gICAgdmFyIGNlbGxzICAgID0gdGhpcy5fY2VsbHMsXG4gICAgICAgIGluZGljZXMgID0gdGhpcy5faW5kaWNlcztcblxuICAgIHZhciBjZWxsU2l6ZVggPSB0aGlzLl9jZWxsU2l6ZVgsXG4gICAgICAgIGNlbGxTaXplWiA9IHRoaXMuX2NlbGxTaXplWjtcblxuICAgIHZhciBjZWxsSW5kZXgsXG4gICAgICAgIGNlbGwsXG4gICAgICAgIGNlbGxTdGF0ZTtcblxuICAgIC8vQ2VsbCB2ZXJ0ZXggaW5kaWNlcyBpbiBnbG9iYWwgdmVydGljZXNcbiAgICB2YXIgdjBJbmRleCwgIC8vIDAgMVxuICAgICAgICB2MUluZGV4LCAgLy8gMyAyXG4gICAgICAgIHYySW5kZXgsXG4gICAgICAgIHYzSW5kZXg7XG5cbiAgICAvL0NlbGwgdmVydGV4IHZhbHVlcyAuLi4seCx5LHosVkFMVUUsLi4uXG4gICAgdmFyIHZWYWxzID0gdGhpcy5fdGVtcENlbGxWZXJ0aWNlc1ZhbHMsXG4gICAgICAgIHYwVmFsLHYxVmFsLHYyVmFsLHYzVmFsO1xuXG4gICAgLy9Ub3BvbG9naWMgZW50cnkgLyBsb29rdXBcbiAgICB2YXIgZW50cnlUb3BMdSxcbiAgICAgICAgSVNPQkFORF9UT1BfTFUgICAgID0gSVNPQmFuZC5UT1BfVEFCTEU7XG5cbiAgICB2YXIgZW50cnlUb3BMdTAsXG4gICAgICAgIGVudHJ5VG9wTHUxLFxuICAgICAgICBlbnRyeVRvcEx1MixcbiAgICAgICAgZW50cnlUb3BMdTM7XG5cbiAgICB2YXIgZWRnZUluZGV4VG9wLFxuICAgICAgICBlZGdlSW5kZXhSaWdodCxcbiAgICAgICAgZWRnZUluZGV4Qm90dG9tLFxuICAgICAgICBlZGdlSW5kZXhMZWZ0LFxuICAgICAgICBlZGdlSW5kZXhUZW1wO1xuXG4gICAgdmFyIGVkZ2VzID0gdGhpcy5fZWRnZXM7XG5cblxuICAgIC8vXG4gICAgLy8gIDAgLS0tLS0tLSAxXG4gICAgLy8gIHwgICAgMCAgICB8XG4gICAgLy8gIHwgMSAgICAgICB8IDJcbiAgICAvLyAgfCAgICAgICAgIHxcbiAgICAvLyAgMyAtLS0tLS0tIDJcbiAgICAvLyAgICAgICAzXG5cblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCBjZWxsU2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IGNlbGxTaXplWClcbiAgICAgICAge1xuICAgICAgICAgICAgY2VsbEluZGV4ICAgICAgICA9IGNlbGxTaXplWCAqIGkgKyBqO1xuICAgICAgICAgICAgY2VsbCAgICAgICAgICAgICA9IGNlbGxzW2NlbGxJbmRleF07XG5cbiAgICAgICAgICAgIHYwSW5kZXggPSBjZWxsWzBdO1xuICAgICAgICAgICAgdjFJbmRleCA9IGNlbGxbMV07XG4gICAgICAgICAgICB2MkluZGV4ID0gY2VsbFsyXTtcbiAgICAgICAgICAgIHYzSW5kZXggPSBjZWxsWzNdO1xuXG4gICAgICAgICAgICB2MFZhbCA9IHZWYWxzWzBdID0gdmVydHNbdjBJbmRleCArIDNdO1xuICAgICAgICAgICAgdjFWYWwgPSB2VmFsc1sxXSA9IHZlcnRzW3YxSW5kZXggKyAzXTtcbiAgICAgICAgICAgIHYyVmFsID0gdlZhbHNbMl0gPSB2ZXJ0c1t2MkluZGV4ICsgM107XG4gICAgICAgICAgICB2M1ZhbCA9IHZWYWxzWzNdID0gdmVydHNbdjNJbmRleCArIDNdO1xuXG4gICAgICAgICAgICBjZWxsU3RhdGUgPSAodjBWYWwgPiAwKSA8PCAzIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICh2MVZhbCA+IDApIDw8IDIgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKHYyVmFsID4gMCkgPDwgMSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAodjNWYWwgPiAwKTtcblxuICAgICAgICAgICAgaWYoY2VsbFN0YXRlID09IDApY29udGludWU7XG5cbiAgICAgICAgICAgIGVkZ2VJbmRleFRvcCAgICA9IGNlbGxJbmRleCArIChjZWxsU2l6ZVggKyAxKSAqIGk7XG4gICAgICAgICAgICBlZGdlSW5kZXhSaWdodCAgPSBlZGdlSW5kZXhUb3AgICArIGNlbGxTaXplWCArIDE7XG4gICAgICAgICAgICBlZGdlSW5kZXhCb3R0b20gPSBlZGdlSW5kZXhSaWdodCArIGNlbGxTaXplWDtcbiAgICAgICAgICAgIGVkZ2VJbmRleExlZnQgICA9IGVkZ2VJbmRleFJpZ2h0IC0gMTtcblxuICAgICAgICAgICAgZW50cnlUb3BMdSA9IElTT0JBTkRfVE9QX0xVW2NlbGxTdGF0ZV07XG5cbiAgICAgICAgICAgIC8vY2VsbCB1cHBlciBsZWZ0XG4gICAgICAgICAgICBrID0gMDtcbiAgICAgICAgICAgIGlmKGkgPT0gMCAmJiBqID09IDApXG4gICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShrIDwgZW50cnlUb3BMdS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9IGVudHJ5VG9wTHVbayAgXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTEgPSBlbnRyeVRvcEx1W2srMV07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID0gZW50cnlUb3BMdVtrKzJdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MyA9IGVudHJ5VG9wTHVbayszXTtcblxuICAgICAgICAgICAgICAgICAgICAvL2dldCBlZGdlIHZlcnRleCAwIGFjY29yZGluZyB0byB0b3BvbG9naWNhbCBlbnRyeVxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gY29sbGFwc2VcbiAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUwID09IDAgPyBlZGdlSW5kZXhUb3AgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID09IDIgPyBlZGdlSW5kZXhCb3R0b20gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4TGVmdDtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1MF0sY2VsbFtlbnRyeVRvcEx1MV0sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9nZXQgZWRnZSB2ZXJ0ZXggMSBhY2NvcmRpbmcgdG8gdG9wb2xvZ2ljYWwgZW50cnlcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIGNvbGxhcHNlXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MiA9PSAwID8gZWRnZUluZGV4VG9wIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID09IDEgPyBlZGdlSW5kZXhSaWdodCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9PSAyID8gZWRnZUluZGV4Qm90dG9tIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleExlZnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTJdLGNlbGxbZW50cnlUb3BMdTNdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApO1xuXG4gICAgICAgICAgICAgICAgICAgIGsgKz0gNDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2VsbHMgZmlyc3Qgcm93IGFmdGVyIHVwcGVyIGxlZnRcbiAgICAgICAgICAgIC8vVE9ETyBjb2xsYXBzZVxuICAgICAgICAgICAgaWYoaSA9PSAwICYmIGogPiAwKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoayA8IGVudHJ5VG9wTHUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPSBlbnRyeVRvcEx1W2sgIF07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUxID0gZW50cnlUb3BMdVtrKzFdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9IGVudHJ5VG9wTHVbaysyXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTMgPSBlbnRyeVRvcEx1W2srM107XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBpZiBlZGdlIGlzIG9uIGFkamFjZW50IGxlZnQgc2lkZSwgYW5kIHB1c2ggaW5kZXggb2YgZWRnZSxcbiAgICAgICAgICAgICAgICAgICAgLy9pZiBub3QsIGNhbGN1bGF0ZSBlZGdlLCBwdXNoIGluZGV4IG9mIG5ldyBlZGdlXG5cblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZpcnN0IHZlcnRleCBpcyBvbiBsZWZ0IGVkZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYoZW50cnlUb3BMdTAgPT0gMylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9hc3NpZ24gcHJldmlvdXMgY2FsY3VsYXRlZCBlZGdlIHZlcnRleCBmcm9tIHByZXZpb3VzIGNlbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhMZWZ0KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgLy9jYWxjdWxhdGUgZWRnZSB2ZXJ0ZXhcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUwID09IDAgPyBlZGdlSW5kZXhUb3AgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID09IDEgPyBlZGdlSW5kZXhSaWdodCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4Qm90dG9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1MF0sY2VsbFtlbnRyeVRvcEx1MV0sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBzZWNvbmQgdmVydGV4IGlzIG9uIGxlZnQgZWRnZVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5VG9wTHUyID09IDMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIC8vY2FsY3VsYXRlIGVkZ2UgdmVydGV4XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MiA9PSAwID8gZWRnZUluZGV4VG9wIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9PSAxID8gZWRnZUluZGV4UmlnaHQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleEJvdHRvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTJdLGNlbGxbZW50cnlUb3BMdTNdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgayArPSA0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jZWxscyBmaXJzdCBjb2x1bW4gYWZ0ZXIgdXBwZXIgbGVmdFxuICAgICAgICAgICAgLy9UT0RPIGNvbGxhcHNlXG4gICAgICAgICAgICBpZihpICE9IDAgJiYgaiA9PSAwKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoayA8IGVudHJ5VG9wTHUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIGVkZ2UgaXMgb24gYWRqYWNlbnQgdG9wIHNpZGUsIGFuZCBwdXNoIGluZGV4IG9mIGVkZ2UsXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgbm90LCBjYWxjdWxhdGUgZWRnZSwgcHVzaCBpbmRleCBvZiBuZXcgZWRnZVxuXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID0gZW50cnlUb3BMdVtrICBdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MSA9IGVudHJ5VG9wTHVbaysxXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPSBlbnRyeVRvcEx1W2srMl07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUzID0gZW50cnlUb3BMdVtrKzNdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZmlyc3QgdmVydGV4IGlzIG9uIHRvcCBlZGdlXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5VG9wTHUwID09IDApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUwID09IDEgPyBlZGdlSW5kZXhSaWdodCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPT0gMiA/IGVkZ2VJbmRleEJvdHRvbSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4TGVmdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTBdLGNlbGxbZW50cnlUb3BMdTFdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmaXJzdCB2ZXJ0ZXggaXMgb24gdG9wIGVkZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYoZW50cnlUb3BMdTIgPT0gMClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTIgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9PSAyID8gZWRnZUluZGV4Qm90dG9tIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhMZWZ0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1Ml0sY2VsbFtlbnRyeVRvcEx1M10sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBrICs9IDQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2hlY2sgYWxsIG90aGVyIGNlbGxzXG4gICAgICAgICAgICAvL1RPRE8gY29sbGFwc2VcbiAgICAgICAgICAgIGlmKGkgIT0gMCAmJiBqICE9IDApXG4gICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIGVkZ2UgaXMgb24gYWRqYWNlbnQgbGVmdCBzaWRlLCBhbmQgcHVzaCBpbmRleCBvZiBlZGdlLFxuICAgICAgICAgICAgICAgIC8vaWYgbm90LCBjYWxjdWxhdGUgZWRnZSwgcHVzaCBpbmRleCBvZiBuZXcgZWRnZVxuXG4gICAgICAgICAgICAgICAgd2hpbGUoayA8IGVudHJ5VG9wTHUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPSBlbnRyeVRvcEx1W2sgIF07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUxID0gZW50cnlUb3BMdVtrKzFdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9IGVudHJ5VG9wTHVbaysyXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTMgPSBlbnRyeVRvcEx1W2srM107XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmaXJzdCB2ZXJ0ZXggaXMgb24gbGVmdCBlZGdlXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5VG9wTHUwID09IDMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGVudHJ5VG9wTHUwID09IDApLy9tYXliZSB1cHBlciBjZWxsP1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIC8vY2FsY3VsYXRlIGVkZ2UgdmVydGV4XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MCA9PSAxID8gZWRnZUluZGV4UmlnaHQgOiBlZGdlSW5kZXhCb3R0b207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUwXSxjZWxsW2VudHJ5VG9wTHUxXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIHNlY29uZCB2ZXJ0ZXggaXMgb24gbGVmdCBlZGdlXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5VG9wTHUyID09IDMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGVudHJ5VG9wTHUyID09IDApLy9tYXliZSB1cHBlciBjZWxsP1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIC8vY2FsY3VsYXRlIGVkZ2UgdmVydGV4XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MiA9PSAxID8gZWRnZUluZGV4UmlnaHQgOiBlZGdlSW5kZXhCb3R0b207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUyXSxjZWxsW2VudHJ5VG9wTHUzXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIGsgKz0gNDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL3RlbXBcbiAgICB0aGlzLl9pbmRpY2VzID0gdGhpcy5fX2FwcFVpbnRUeXBlRW5hYmxlZCA/ICBuZXcgVWludDMyQXJyYXkoaW5kaWNlcykgOiAgbmV3IFVpbnQxNkFycmF5KGluZGljZXMpO1xufTtcblxuLy92aXN1YWwgZGVidWcgbmVlZCBpc29saW5lL2lzb2JhbmQgc3dpdGNoXG5JU09CYW5kLnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uKGdsKVxue1xuICAgIHZhciBlZGdlcyAgID0gdGhpcy5fZWRnZXMsXG4gICAgICAgIGNvbG9ycyAgPSBnbC5idWZmZXJDb2xvcnMoZ2wuZ2V0Q29sb3JCdWZmZXIoKSxuZXcgRmxvYXQzMkFycmF5KGVkZ2VzLmxlbmd0aC8zKjQpKSxcbiAgICAgICAgaW5kaWNlcyA9ICB0aGlzLl9pbmRpY2VzO1xuXG4gICAgIGdsLmRyYXdFbGVtZW50cyhlZGdlcyxudWxsLGNvbG9ycyxudWxsLGluZGljZXMsZ2wuZ2V0RHJhd01vZGUoKSxpbmRpY2VzLmxlbmd0aCwwLGdsLlVOU0lHTkVEX1NIT1JUKTtcbn07XG5cblxuSVNPQmFuZC5wcm90b3R5cGUuX2ludHJwbCA9IGZ1bmN0aW9uKGluZGV4MCxpbmRleDEsb3V0LG9mZnNldClcbntcbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cztcblxuICAgIHZhciB2MHggPSB2ZXJ0c1tpbmRleDAgIF0sXG4gICAgICAgIHYweSA9IHZlcnRzW2luZGV4MCsxXSxcbiAgICAgICAgdjB6ID0gdmVydHNbaW5kZXgwKzJdLFxuICAgICAgICB2MHYgPSB2ZXJ0c1tpbmRleDArM107XG5cbiAgICB2YXIgdjF4ID0gdmVydHNbaW5kZXgxICBdLFxuICAgICAgICB2MXkgPSB2ZXJ0c1tpbmRleDErMV0sXG4gICAgICAgIHYxeiA9IHZlcnRzW2luZGV4MSsyXSxcbiAgICAgICAgdjF2ID0gdmVydHNbaW5kZXgxKzNdO1xuXG5cbiAgICBpZih2MHYgPT0gMClcbiAgICB7XG4gICAgICAgIG91dFtvZmZzZXQrMF0gPSB2MXg7XG4gICAgICAgIG91dFtvZmZzZXQrMV0gPSB2MXk7XG4gICAgICAgIG91dFtvZmZzZXQrMl0gPSB2MXo7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmKHYxdiA9PSAwKVxuICAgIHtcbiAgICAgICAgb3V0W29mZnNldCswXSA9IHYweDtcbiAgICAgICAgb3V0W29mZnNldCsxXSA9IHYweTtcbiAgICAgICAgb3V0W29mZnNldCsyXSA9IHYwejtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICBpZih0aGlzLl9pbnRlcnBvbGF0ZVZhbHVlcylcbiAgICB7XG4gICAgICAgIHZhciB2MTB2ID0gdjF2IC0gdjB2O1xuXG4gICAgICAgIG91dFtvZmZzZXQrMF0gPSAtdjB2ICogKHYxeCAtIHYweCkgLyB2MTB2ICsgdjB4O1xuICAgICAgICBvdXRbb2Zmc2V0KzFdID0gLXYwdiAqICh2MXkgLSB2MHkpIC8gdjEwdiArIHYweTtcbiAgICAgICAgb3V0W29mZnNldCsyXSA9IC12MHYgKiAodjF6IC0gdjB6KSAvIHYxMHYgKyB2MHo7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIG91dFtvZmZzZXQrMF0gPSAgKHYxeCAtIHYweCkgKiAwLjUgKyB2MHg7XG4gICAgICAgIG91dFtvZmZzZXQrMV0gPSAgKHYxeSAtIHYweSkgKiAwLjUgKyB2MHk7XG4gICAgICAgIG91dFtvZmZzZXQrMl0gPSAgKHYxeiAtIHYweikgKiAwLjUgKyB2MHo7XG4gICAgfVxufTtcblxuXG5JU09CYW5kLnByb3RvdHlwZS5nZXRWZXJ0aWNlcyAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdmVydHM7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldFZlcnRpY2VzU2l6ZVggPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZXJ0U2l6ZVg7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldFZlcnRpY2VzU2l6ZVogPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZXJ0U2l6ZVo7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldENlbGxzICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jZWxsczt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0Q2VsbHNTaXplWCAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NlbGxTaXplWDt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0Q2VsbHNTaXplWiAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NlbGxTaXplWjt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0RWRnZXMgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2VkZ2VzO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRJbmRpY2VzICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW5kaWNlczt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBUT1BPTE9HSUNBTFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE8gbWVyZ2VcbklTT0JhbmQuVE9QX1RBQkxFID1cbiAgICBbXG4gICAgICAgIFtdLFxuICAgICAgICBbIDIsIDMsIDMsIDBdLFxuICAgICAgICBbIDEsIDIsIDIsIDNdLFxuICAgICAgICBbIDEsIDIsIDMsIDBdLFxuICAgICAgICBbIDAsIDEsIDEsIDJdLFxuICAgICAgICBbIDAsIDEsIDEsIDIsIDIsIDMsIDMsIDBdLFxuICAgICAgICBbIDAsIDEsIDIsIDNdLFxuICAgICAgICBbIDAsIDEsIDMsIDBdLFxuICAgICAgICBbIDAsIDEsIDMsIDBdLFxuICAgICAgICBbIDAsIDEsIDIsIDNdLFxuICAgICAgICBbIDAsIDEsIDEsIDIsIDIsIDMsIDMsIDBdLFxuICAgICAgICBbIDAsIDEsIDEsIDJdLFxuICAgICAgICBbIDEsIDIsIDMsIDBdLFxuICAgICAgICBbIDEsIDIsIDIsIDNdLFxuICAgICAgICBbIDIsIDMsIDMsIDBdLFxuICAgICAgICBbXVxuICAgIF07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIFRSSUFOR0Vcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLy9UT0RPIG1lcmdlXG5JU09CYW5kLlRSSV9UQUJMRSA9XG4gICAgW1xuICAgICAgICBbXSxcbiAgICAgICAgWyAxLCAwLCAwLCAzLCAxLCAxXSxcbiAgICAgICAgWyAxLCAwLCAwLCAyLCAxLCAxXSxcbiAgICAgICAgWyAxLCAwLCAwLCAyLCAwLCAzLCAwLCAzLCAxLCAxICwxICwwIF0sXG4gICAgICAgIFsgMSwgMCwgMCwgMSwgMSwgMV0sXG4gICAgICAgIFsgMSwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMywgMSwgMiwgMCwgMywgMSwgMywgMSwgMywgMSwgMCwgMSwgMV0sXG4gICAgICAgIFsgMSwgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMCwgMiwgMSwgMV0sXG4gICAgICAgIFsgMSwgMCwgMCwgMSwgMCwgMiwgMCwgMiwgMSwgMSwgMSwgMCwgMCwgMiwgMCwgMywgMSwgMSBdLFxuICAgICAgICBbIDAsIDAsIDEsIDAsIDEsIDFdLFxuICAgICAgICBbIDAsIDAsIDEsIDAsIDAsIDMsIDEsIDAsIDEsIDEsIDAsIDNdLFxuICAgICAgICBbIDAsIDAsIDEsIDAsIDEsIDMsIDEsIDAsIDEsIDEsIDEsIDMsIDEsIDEsIDAsIDIsIDEsIDIsIDEsIDIsIDEsIDMsIDEsIDEgXSxcbiAgICAgICAgWyAwLCAwLCAxLCAwLCAwLCAzLCAxLCAwLCAxLCAxLCAwLCAzLCAxLCAxLCAwLCAyLCAwLCAzXSxcbiAgICAgICAgWyAwLCAwLCAwLCAxLCAxLCAxLCAwLCAxLCAxLCAwLCAxLCAxXSxcbiAgICAgICAgWyAwLCAwLCAwLCAxLCAxLCAwLCAxLCAwLCAxLCAxLCAwLCAwLCAxLCAxLCAwLCAzLCAwLCAwXSxcbiAgICAgICAgWyAwLCAwLCAwLCAxLCAxLCAxLCAwLCAxLCAwLCAyLCAxLCAwLCAxLCAwLCAxLCAxLCAwLCAxXSxcbiAgICAgICAgWyAwLCAwLCAwLCAxLCAwLCAzLCAwLCAxLCAwLCAyLCAwLCAzXVxuICAgIF07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBJU09CYW5kO1xuIiwidmFyIFZlYzMgICA9IHJlcXVpcmUoJy4uL21hdGgvZlZlYzMnKSxcbiAgICBWZWM0ICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWM0JyksXG4gICAgR2VvbTNkID0gcmVxdWlyZSgnLi9mR2VvbTNkJyk7XG5cblxuLy9UaGlzIGlzIGp1c3QgYW4gaW5pdGlhbCB2ZXJzaW9uXG5mdW5jdGlvbiBJU09TdXJmYWNlKHNpemVYLHNpemVZLHNpemVaKVxue1xuICAgIHRoaXMuX3ZlcnRTaXplWCA9IG51bGw7XG4gICAgdGhpcy5fdmVydFNpemVZID0gbnVsbDtcbiAgICB0aGlzLl92ZXJ0U2l6ZVogPSBudWxsO1xuXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVkgPSB0aGlzLl92ZXJ0U2l6ZVogPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVZID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVaID0gYXJndW1lbnRzWzJdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYID0gdGhpcy5fdmVydFNpemVZID0gdGhpcy5fdmVydFNpemVaID0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuX2N1YmVTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCAtIDE7XG4gICAgdGhpcy5fY3ViZVNpemVZID0gdGhpcy5fdmVydFNpemVZIC0gMTtcbiAgICB0aGlzLl9jdWJlU2l6ZVogPSB0aGlzLl92ZXJ0U2l6ZVogLSAxO1xuXG4gICAgdGhpcy5fZGVsYXllZENsZWFyID0gZmFsc2U7XG5cbiAgICAvL1RPRE86RklYISFcbiAgICB0aGlzLl9mdW5jICAgICAgPSBmdW5jdGlvbih4LHkseixhcmcwLGFyZzEsYXJnMil7cmV0dXJuIDA7fTtcbiAgICB0aGlzLl9mdW5jQXJnMCAgPSAwO1xuICAgIHRoaXMuX2Z1bmNBcmcxICA9IDA7XG4gICAgdGhpcy5fZnVuY0FyZzIgID0gMDtcbiAgICB0aGlzLl9pc29MZXZlbCAgPSAwO1xuXG4gICAgLy9UT0RPOiB1bnJvbGxcbiAgICB0aGlzLl92ZXJ0cyA9IG5ldyBBcnJheSh0aGlzLl92ZXJ0U2l6ZVgqdGhpcy5fdmVydFNpemVZKnRoaXMuX3ZlcnRTaXplWik7XG4gICAgdGhpcy5fY3ViZXMgPSBuZXcgQXJyYXkodGhpcy5fY3ViZVNpemVYKnRoaXMuX2N1YmVTaXplWSp0aGlzLl9jdWJlU2l6ZVopO1xuXG4gICAgdGhpcy5fbnVtVHJpYW5nbGVzID0gMDtcblxuICAgIHZhciBTSVpFX09GX1RSSUFOR0xFICAgPSAzLFxuICAgICAgICBTSVpFX09GX0NVQkVfRURHRVMgPSAxMjtcbiAgICB2YXIgTUFYX0JVRkZFUl9MRU4gICAgID0gdGhpcy5fY3ViZXMubGVuZ3RoICogNDtcblxuICAgIHRoaXMuX2JWZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoKE1BWF9CVUZGRVJfTEVOKSpTSVpFX09GX1RSSUFOR0xFKlZlYzMuU0laRSk7XG4gICAgdGhpcy5fYk5vcm1hbHMgID0gbmV3IEZsb2F0MzJBcnJheSgoTUFYX0JVRkZFUl9MRU4pKlNJWkVfT0ZfVFJJQU5HTEUqVmVjMy5TSVpFKTtcbiAgICB0aGlzLl9iQ29sb3JzICAgPSBuZXcgRmxvYXQzMkFycmF5KChNQVhfQlVGRkVSX0xFTikqU0laRV9PRl9UUklBTkdMRSpWZWM0LlNJWkUpO1xuXG4gICAgdGhpcy5fdGVtcFZlcnRpY2VzID0gbmV3IEFycmF5KFNJWkVfT0ZfQ1VCRV9FREdFUypWZWMzLlNJWkUpO1xuICAgIHRoaXMuX3RlbXBOb3JtYWxzICA9IG5ldyBBcnJheShTSVpFX09GX0NVQkVfRURHRVMpO1xuXG4gICAgdGhpcy5fc2NhbGVYWVogPSBbMSwxLDFdO1xuXG4gICAgdGhpcy5fZ2VuU3VyZmFjZSgpO1xuXG59XG5cbklTT1N1cmZhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW9tM2QucHJvdG90eXBlKTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vL1xuLy9cbi8vICAgICAgICAgICAyIC0tLS0tLS0gMyAgICBWZXJ0ZXggb3JkZXJcbi8vICAgICAgICAgIC98ICAgICAgICAvfFxuLy8gICAgICAgICAvIHwgICAgICAgLyB8XG4vLyAgICAgICAgNiAtLS0tLS0tIDcgIHxcbi8vICAgICAgICB8ICAwIC0tLS0tfC0gMVxuLy8gICAgICAgIHwgLyAgICAgICB8IC9cbi8vICAgICAgICB8LyAgICAgICAgfC9cbi8vICAgICAgICA0IC0tLS0tLS0gNVxuLy9cbi8vXG4vLyAgICAgICAgICAgMiAtLS0tLS0+IDMgICAgTWFyY2ggb3JkZXJcbi8vICAgICAgICAgICAgICBcXFxuLy8gICAgICAgICAgICAgICAgXFxcbi8vICAgICAgICA2IC0tLS0tLT4gN1xuLy8gICAgICAgICAgIDAgLS0tLS0tPiAxXG4vLyAgICAgICAgICAgICBcXFxuLy8gICAgICAgICAgICAgICBcXFxuLy8gICAgICAgIDQgLS0tLS0tPiA1XG4vL1xuLy9cblxuXG5JU09TdXJmYWNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXG57XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cztcblxuICAgIHZhciBjdWJlU2l6ZVggID0gdGhpcy5fY3ViZVNpemVYLFxuICAgICAgICBjdWJlU2l6ZVkgID0gdGhpcy5fY3ViZVNpemVZLFxuICAgICAgICBjdWJlU2l6ZVogID0gdGhpcy5fY3ViZVNpemVaLFxuICAgICAgICBjdWJlU2l6ZVpZID0gY3ViZVNpemVaICogY3ViZVNpemVZO1xuXG4gICAgdmFyIGN1YmVzID0gdGhpcy5fY3ViZXMsXG4gICAgICAgIGN1YmU7XG5cbiAgICB2YXIgbWFyY2hJbmRleDtcblxuICAgIHZhciBFREdFX1RBQkxFID0gSVNPU3VyZmFjZS5FREdFX1RBQkxFLFxuICAgICAgICBUUklfVEFCTEUgID0gSVNPU3VyZmFjZS5UUklfVEFCTEU7XG5cbiAgICB2YXIgdjAsdjEsdjIsdjMsdjQsdjUsdjYsdjc7XG4gICAgdmFyIHZhbDAsdmFsMSx2YWwyLHZhbDMsdmFsNCx2YWw1LHZhbDYsdmFsNztcblxuICAgIHZhciBjdWJlSW5kZXg7XG4gICAgdmFyIGlzb0xldmVsID0gdGhpcy5faXNvTGV2ZWw7XG4gICAgdmFyIGJpdHM7XG5cbiAgICB2YXIgYlZlcnRpY2VzICAgPSB0aGlzLl9iVmVydGljZXMsXG4gICAgICAgIGJOb3JtYWxzICAgID0gdGhpcy5fYk5vcm1hbHMsXG4gICAgICAgIGJOb3JtYWxzTGVuID0gYk5vcm1hbHMubGVuZ3RoLFxuICAgICAgICBiVmVydEluZGV4O1xuXG4gICAgdmFyIHZlcnRJbmRleDAsIHZlcnRJbmRleDEsIHZlcnRJbmRleDIsXG4gICAgICAgIHZlcnRJbmRleDMsIHZlcnRJbmRleDQsIHZlcnRJbmRleDUsXG4gICAgICAgIHZlcnRJbmRleDYsIHZlcnRJbmRleDcsIHZlcnRJbmRleDg7XG5cbiAgICB2YXIgdjB4LHYweSx2MHosXG4gICAgICAgIHYxeCx2MXksdjF6LFxuICAgICAgICB2MngsdjJ5LHYyejtcblxuICAgIHZhciBlMngsIGUyeSwgZTJ6LFxuICAgICAgICBlMXgsIGUxeSwgZTF6O1xuXG4gICAgdmFyIHYwSW5kZXgsXG4gICAgICAgIHYxSW5kZXgsXG4gICAgICAgIHYySW5kZXg7XG5cbiAgICB2YXIgbngsIG55LCBueixcbiAgICAgICAgdmJ4LCB2YnksIHZiejtcblxuXG4gICAgdmFyIGksIGosIGs7XG5cbiAgICB0aGlzLl9udW1UcmlhbmdsZXMgPSAwO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraTxiTm9ybWFsc0xlbiliTm9ybWFsc1tpXT0wLjA7XG5cblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCBjdWJlU2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IGN1YmVTaXplWSlcbiAgICAgICAge1xuICAgICAgICAgICAgayA9IC0xO1xuICAgICAgICAgICAgd2hpbGUoKytrIDwgY3ViZVNpemVYKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgIG1hcmNoSW5kZXggPSBpICogY3ViZVNpemVaWSArIGogKiBjdWJlU2l6ZVogKyBrO1xuICAgICAgICAgICAgICAgIGN1YmUgICAgICAgPSBjdWJlc1ttYXJjaEluZGV4XTtcblxuICAgICAgICAgICAgICAgIC8vYWNjZXNzIHZlcnRpY2VzIG9mIGN1YmVcbiAgICAgICAgICAgICAgICB2MCA9IHZlcnRzW2N1YmVbMF1dO1xuICAgICAgICAgICAgICAgIHYxID0gdmVydHNbY3ViZVsxXV07XG4gICAgICAgICAgICAgICAgdjIgPSB2ZXJ0c1tjdWJlWzJdXTtcbiAgICAgICAgICAgICAgICB2MyA9IHZlcnRzW2N1YmVbM11dO1xuICAgICAgICAgICAgICAgIHY0ID0gdmVydHNbY3ViZVs0XV07XG4gICAgICAgICAgICAgICAgdjUgPSB2ZXJ0c1tjdWJlWzVdXTtcbiAgICAgICAgICAgICAgICB2NiA9IHZlcnRzW2N1YmVbNl1dO1xuICAgICAgICAgICAgICAgIHY3ID0gdmVydHNbY3ViZVs3XV07XG5cbiAgICAgICAgICAgICAgICB2YWwwID0gdjBbM107XG4gICAgICAgICAgICAgICAgdmFsMSA9IHYxWzNdO1xuICAgICAgICAgICAgICAgIHZhbDIgPSB2MlszXTtcbiAgICAgICAgICAgICAgICB2YWwzID0gdjNbM107XG4gICAgICAgICAgICAgICAgdmFsNCA9IHY0WzNdO1xuICAgICAgICAgICAgICAgIHZhbDUgPSB2NVszXTtcbiAgICAgICAgICAgICAgICB2YWw2ID0gdjZbM107XG4gICAgICAgICAgICAgICAgdmFsNyA9IHY3WzNdO1xuXG4gICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgY3ViZUluZGV4ID0gMDtcblxuICAgICAgICAgICAgICAgIGlmKHZhbDA8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSAxO1xuICAgICAgICAgICAgICAgIGlmKHZhbDE8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSAyO1xuICAgICAgICAgICAgICAgIGlmKHZhbDI8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSA4O1xuICAgICAgICAgICAgICAgIGlmKHZhbDM8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSA0O1xuICAgICAgICAgICAgICAgIGlmKHZhbDQ8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSAxNjtcbiAgICAgICAgICAgICAgICBpZih2YWw1PGlzb0xldmVsKSBjdWJlSW5kZXggfD0gMzI7XG4gICAgICAgICAgICAgICAgaWYodmFsNjxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDEyODtcbiAgICAgICAgICAgICAgICBpZih2YWw3PGlzb0xldmVsKSBjdWJlSW5kZXggfD0gNjQ7XG5cbiAgICAgICAgICAgICAgICBiaXRzID0gRURHRV9UQUJMRVtjdWJlSW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgaWYoYml0cyA9PT0gMCljb250aW51ZTtcblxuICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgIHZhciB0ZW1wVmVydGljZXMgPSB0aGlzLl90ZW1wVmVydGljZXMsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBOb3JtYWxzICA9IHRoaXMuX3RlbXBOb3JtYWxzO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAxKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYwLCB2MSwgdGVtcFZlcnRpY2VzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcywwLHRlbXBOb3JtYWxzLDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjEsIHYzLCB0ZW1wVmVydGljZXMsIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDEsdGVtcE5vcm1hbHMsMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgNClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MiwgdjMsIHRlbXBWZXJ0aWNlcywgMik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsMix0ZW1wTm9ybWFscywyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiA4KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYwLCB2MiwgdGVtcFZlcnRpY2VzLCAzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcywzLHRlbXBOb3JtYWxzLDMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMTYpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjQsIHY1LCB0ZW1wVmVydGljZXMsIDQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDQsdGVtcE5vcm1hbHMsNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMzIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjUsIHY3LCB0ZW1wVmVydGljZXMsIDUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDUsdGVtcE5vcm1hbHMsNSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgNjQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjYsIHY3LCB0ZW1wVmVydGljZXMsIDYpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDYsdGVtcE5vcm1hbHMsNik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMTI4KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHY0LCB2NiwgdGVtcFZlcnRpY2VzLCA3KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcyw3LHRlbXBOb3JtYWxzLDcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMjU2KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYwLCB2NCwgdGVtcFZlcnRpY2VzLCA4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcyw4LHRlbXBOb3JtYWxzLDgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDUxMilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MSwgdjUsIHRlbXBWZXJ0aWNlcywgOSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsOSx0ZW1wTm9ybWFscyw5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAxMDI0KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYzLCB2NywgdGVtcFZlcnRpY2VzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsMTAsdGVtcE5vcm1hbHMsMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDIwNDgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjIsIHY2LCB0ZW1wVmVydGljZXMsIDExKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcywxMSx0ZW1wTm9ybWFscywxMSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICB2YXIgbCA9IDA7XG4gICAgICAgICAgICAgICAgY3ViZUluZGV4IDw8PSA0O1xuXG5cbiAgICAgICAgICAgICAgICB3aGlsZShUUklfVEFCTEVbY3ViZUluZGV4ICsgbF0gIT0gLTEpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICAgICAgLy9nZXQgaW5kaWNlcyBvZiB0cmlhbmdsZSB2ZXJ0aWNlc1xuICAgICAgICAgICAgICAgICAgICB2MEluZGV4ID0gVFJJX1RBQkxFW2N1YmVJbmRleCArIGwgICAgXSAqIDM7XG4gICAgICAgICAgICAgICAgICAgIHYxSW5kZXggPSBUUklfVEFCTEVbY3ViZUluZGV4ICsgbCArIDFdICogMztcbiAgICAgICAgICAgICAgICAgICAgdjJJbmRleCA9IFRSSV9UQUJMRVtjdWJlSW5kZXggKyBsICsgMl0gKiAzO1xuXG4gICAgICAgICAgICAgICAgICAgIGJWZXJ0SW5kZXggPSB0aGlzLl9udW1UcmlhbmdsZXMgKiA5O1xuXG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDAgPSBiVmVydEluZGV4O1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXgxID0gYlZlcnRJbmRleCsxO1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXgyID0gYlZlcnRJbmRleCsyO1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXgzID0gYlZlcnRJbmRleCszO1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXg0ID0gYlZlcnRJbmRleCs0O1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXg1ID0gYlZlcnRJbmRleCs1O1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXg2ID0gYlZlcnRJbmRleCs2O1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXg3ID0gYlZlcnRJbmRleCs3O1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXg4ID0gYlZlcnRJbmRleCs4O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc3RvcmUgdHJpYW5nbGUgdmVydGljZXMgaW4gJ2dsb2JhbCcgdmVydGV4IGJ1ZmZlciArIGxvY2FsIGNhY2hpbmdcbiAgICAgICAgICAgICAgICAgICAgdjB4ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDBdID0gdGVtcFZlcnRpY2VzW3YwSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB2MHkgPSBiVmVydGljZXNbdmVydEluZGV4MV0gPSB0ZW1wVmVydGljZXNbdjBJbmRleCsxXTtcbiAgICAgICAgICAgICAgICAgICAgdjB6ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDJdID0gdGVtcFZlcnRpY2VzW3YwSW5kZXgrMl07XG5cbiAgICAgICAgICAgICAgICAgICAgdjF4ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDNdID0gdGVtcFZlcnRpY2VzW3YxSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB2MXkgPSBiVmVydGljZXNbdmVydEluZGV4NF0gPSB0ZW1wVmVydGljZXNbdjFJbmRleCsxXTtcbiAgICAgICAgICAgICAgICAgICAgdjF6ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDVdID0gdGVtcFZlcnRpY2VzW3YxSW5kZXgrMl07XG5cbiAgICAgICAgICAgICAgICAgICAgdjJ4ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDZdID0gdGVtcFZlcnRpY2VzW3YySW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB2MnkgPSBiVmVydGljZXNbdmVydEluZGV4N10gPSB0ZW1wVmVydGljZXNbdjJJbmRleCsxXTtcbiAgICAgICAgICAgICAgICAgICAgdjJ6ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDhdID0gdGVtcFZlcnRpY2VzW3YySW5kZXgrMl07XG5cbiAgICAgICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2FsYyBmYWNlIG5vcm1hbHMgLSBwZXIgZmFjZSAtIG5haXZlIFRPRE86RklYTUUhXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgIHZieCA9IHYxeDtcbiAgICAgICAgICAgICAgICAgICAgdmJ5ID0gdjF5O1xuICAgICAgICAgICAgICAgICAgICB2YnogPSB2MXo7XG5cbiAgICAgICAgICAgICAgICAgICAgZTF4ID0gdjB4LXZieDtcbiAgICAgICAgICAgICAgICAgICAgZTF5ID0gdjB5LXZieTtcbiAgICAgICAgICAgICAgICAgICAgZTF6ID0gdjB6LXZiejtcblxuICAgICAgICAgICAgICAgICAgICBlMnggPSB2MngtdmJ4O1xuICAgICAgICAgICAgICAgICAgICBlMnkgPSB2MnktdmJ5O1xuICAgICAgICAgICAgICAgICAgICBlMnogPSB2MnotdmJ6O1xuXG4gICAgICAgICAgICAgICAgICAgIG54ID0gZTF5ICogZTJ6IC0gZTF6ICogZTJ5O1xuICAgICAgICAgICAgICAgICAgICBueSA9IGUxeiAqIGUyeCAtIGUxeCAqIGUyejtcbiAgICAgICAgICAgICAgICAgICAgbnogPSBlMXggKiBlMnkgLSBlMXkgKiBlMng7XG5cbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4MF0gKz0gbng7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDFdICs9IG55O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgyXSArPSBuejtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4M10gKz0gbng7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDRdICs9IG55O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg1XSArPSBuejtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4Nl0gKz0gbng7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDddICs9IG55O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg4XSArPSBuejtcblxuICAgICAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDBdID0gdGVtcE5vcm1hbHNbdjBJbmRleCAgXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4MV0gPSB0ZW1wTm9ybWFsc1t2MEluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgyXSA9IHRlbXBOb3JtYWxzW3YwSW5kZXgrMl07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDNdID0gdGVtcE5vcm1hbHNbdjFJbmRleCAgXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4NF0gPSB0ZW1wTm9ybWFsc1t2MUluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg1XSA9IHRlbXBOb3JtYWxzW3YxSW5kZXgrMl07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDZdID0gdGVtcE5vcm1hbHNbdjJJbmRleCAgXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4N10gPSB0ZW1wTm9ybWFsc1t2MkluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg4XSA9IHRlbXBOb3JtYWxzW3YySW5kZXgrMl07XG5cbiAgICAgICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgICAgIGwrPTM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX251bVRyaWFuZ2xlcysrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuX2ludHJwbCA9IGZ1bmN0aW9uKHYwLHYxLHZlcnRMaXN0LGluZGV4KVxue1xuICAgIGluZGV4ICo9IDM7XG5cbiAgICB2YXIgdjB2ID0gdjBbM10sXG4gICAgICAgIHYxdiA9IHYxWzNdO1xuXG4gICAgdmFyIGlzb0xldmVsID0gdGhpcy5faXNvTGV2ZWw7XG5cbiAgICBpZihNYXRoLmFicyhpc29MZXZlbCAtIHYwdikgPCAwLjAwMDAxKVxuICAgIHtcbiAgICAgICAgdmVydExpc3RbaW5kZXggICAgXSA9IHYwWzBdO1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCArIDFdID0gdjBbMV07XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICsgMl0gPSB2MFsyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKE1hdGguYWJzKGlzb0xldmVsIC0gdjF2KSA8IDAuMDAwMDEpXG4gICAge1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCAgICBdID0gdjFbMF07XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICsgMV0gPSB2MVsxXTtcbiAgICAgICAgdmVydExpc3RbaW5kZXggKyAyXSA9IHYxWzJdO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoTWF0aC5hYnModjB2IC0gdjF2KSA8IDAuMDAwMDEpXG4gICAge1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCAgICBdID0gdjFbMF07XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICsgMV0gPSB2MVsxXTtcbiAgICAgICAgdmVydExpc3RbaW5kZXggKyAyXSA9IHYxWzJdO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICB2YXIgaW50cnBsICA9IChpc29MZXZlbCAtIHYwdikgLyAodjF2IC0gdjB2KTtcblxuICAgIHZhciB2MHggPSB2MFswXSxcbiAgICAgICAgdjB5ID0gdjBbMV0sXG4gICAgICAgIHYweiA9IHYwWzJdO1xuXG4gICAgdmVydExpc3RbaW5kZXggICAgXSA9IHYweCArICh2MVswXSAtIHYweCkgKiBpbnRycGw7XG4gICAgdmVydExpc3RbaW5kZXggKyAxXSA9IHYweSArICh2MVsxXSAtIHYweSkgKiBpbnRycGw7XG4gICAgdmVydExpc3RbaW5kZXggKyAyXSA9IHYweiArICh2MVsyXSAtIHYweikgKiBpbnRycGw7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT1N1cmZhY2UucHJvdG90eXBlLl9ub3JtYWwgPSBmdW5jdGlvbih2ZXJ0TGlzdCx2ZXJ0SW5kZXgsbm9ybUxpc3Qsbm9ybUluZGV4KVxue1xuICAgIHZlcnRJbmRleCAqPSAzO1xuXG4gICAgdmFyIHggPSB2ZXJ0TGlzdFt2ZXJ0SW5kZXggICBdLFxuICAgICAgICB5ID0gdmVydExpc3RbdmVydEluZGV4KzFdLFxuICAgICAgICB6ID0gdmVydExpc3RbdmVydEluZGV4KzJdO1xuXG4gICAgdmFyIGFyZzAgPSB0aGlzLl9mdW5jQXJnMCxcbiAgICAgICAgYXJnMSA9IHRoaXMuX2Z1bmNBcmcxLFxuICAgICAgICBhcmcyID0gdGhpcy5fZnVuY0FyZzI7XG5cbiAgICB2YXIgZXBzID0gMC4wMDAzO1xuXG4gICAgdmFyIHZhbCA9IHRoaXMuX2Z1bmMoeCx5LHosYXJnMCxhcmcxLGFyZzIpO1xuXG4gICAgdmFyIG54ID0gdGhpcy5fZnVuYyh4ICsgZXBzLHkgLCB6LCBhcmcwLCBhcmcxLCBhcmcyKSAtIHZhbCxcbiAgICAgICAgbnkgPSB0aGlzLl9mdW5jKHgsIHkgKyBlcHMsIHosIGFyZzAsIGFyZzEsIGFyZzIpIC0gdmFsLFxuICAgICAgICBueiA9IHRoaXMuX2Z1bmMoeCwgeSwgeiArIGVwcywgYXJnMCwgYXJnMSwgYXJnMikgLSB2YWwsXG4gICAgICAgIGQgID0gMSAvIE1hdGguc3FydChueCpueCtueSpueStueipueik7XG5cblxuICAgIG5vcm1JbmRleCAqPSAzO1xuXG4gICAgbm9ybUxpc3Rbbm9ybUluZGV4XSAgID0geCpkKi0xO1xuICAgIG5vcm1MaXN0W25vcm1JbmRleCsxXSA9IHkqZCotMTtcbiAgICBub3JtTGlzdFtub3JtSW5kZXgrMl0gPSB6KmQqLTE7XG5cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuc2V0Q2xvc2VTaWRlcyA9IGZ1bmN0aW9uKGJvb2wpe31cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuc2V0RnVuY3Rpb24gPSBmdW5jdGlvbihmdW5jLGlzb0xldmVsKVxue1xuICAgIHZhciBmdW5jQXJnc0xlbmd0aCA9IGZ1bmMubGVuZ3RoO1xuXG4gICAgaWYoZnVuY0FyZ3NMZW5ndGggPCAzKXRocm93ICdGdW5jdGlvbiBzaG91bGQgc2F0aXNmeSBmdW5jdGlvbih4LHkseil7fSc7XG4gICAgaWYoZnVuY0FyZ3NMZW5ndGggPiA2KXRocm93ICdGdW5jdGlvbiBoYXMgdG8gbWFueSBhcmd1bWVudHMuIEFyZ3VtZW50cyBsZW5ndGggc2hvdWxkIG5vdCBleGNlZWQgNi4gRS5nIGZ1bmN0aW9uKHgseSx6LGFyZzAsYXJnMSxhcmcyKS4nO1xuXG4gICAgdmFyIGZ1bmNTdHJpbmcgPSBmdW5jLnRvU3RyaW5nKCksXG4gICAgICAgIGZ1bmNBcmdzICAgPSBmdW5jU3RyaW5nLnNsaWNlKGZ1bmNTdHJpbmcuaW5kZXhPZignKCcpICsgMSwgZnVuY1N0cmluZy5pbmRleE9mKCcpJykpLnNwbGl0KCcsJyksXG4gICAgICAgIGZ1bmNCb2R5ICAgPSBmdW5jU3RyaW5nLnNsaWNlKGZ1bmNTdHJpbmcuaW5kZXhPZigneycpICsgMSwgZnVuY1N0cmluZy5sYXN0SW5kZXhPZignfScpKTtcblxuICAgIHRoaXMuX2Z1bmMgICAgID0gbmV3IEZ1bmN0aW9uKGZ1bmNBcmdzWzBdLCBmdW5jQXJnc1sxXSwgZnVuY0FyZ3NbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY0FyZ3NbM10gfHwgJ2FyZzAnLCBmdW5jQXJnc1s0XSB8fCAnYXJnMScsIGZ1bmNBcmdzWzVdIHx8ICdhcmcyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jQm9keSk7XG4gICAgdGhpcy5faXNvTGV2ZWwgPSBpc29MZXZlbCB8fCAwO1xufTtcblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuc2V0RnVuY3Rpb25VbnNhZmUgPSBmdW5jdGlvbihmdW5jLGlzb0xldmVsKVxue1xuICAgIHRoaXMuX2Z1bmMgICAgID0gZnVuYztcbiAgICB0aGlzLl9pc29MZXZlbCA9IGlzb0xldmVsIHx8IDA7XG59O1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5nZXRGdW5jdGlvbiA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Z1bmM7fTtcbklTT1N1cmZhY2UucHJvdG90eXBlLnNldElTT0xldmVsID0gZnVuY3Rpb24oaXNvTGV2ZWwpe3RoaXMuX2lzb0xldmVsID0gaXNvTGV2ZWw7fTtcblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlGdW5jdGlvbiAgID0gZnVuY3Rpb24oKSAgICAgICAgIHt0aGlzLmFwcGx5RnVuY3Rpb24zZigwLDAsMCk7fTtcbklTT1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb24xZiA9IGZ1bmN0aW9uKGFyZzApICAgICB7dGhpcy5hcHBseUZ1bmN0aW9uM2YoYXJnMCwwLDApO307XG5JU09TdXJmYWNlLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uMmYgPSBmdW5jdGlvbihhcmcwLGFyZzEpe3RoaXMuYXBwbHlGdW5jdGlvbjNmKGFyZzAsYXJnMSwwKTt9O1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uM2YgPSBmdW5jdGlvbihhcmcwLGFyZzEsYXJnMilcbntcbiAgICB2YXIgdmVydFNpemVYICA9IHRoaXMuX3ZlcnRTaXplWCxcbiAgICAgICAgdmVydFNpemVZICA9IHRoaXMuX3ZlcnRTaXplWSxcbiAgICAgICAgdmVydFNpemVaICA9IHRoaXMuX3ZlcnRTaXplWixcbiAgICAgICAgdmVydFNpemVZWCA9IHZlcnRTaXplWSAqIHZlcnRTaXplWDtcblxuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzLFxuICAgICAgICB2ZXJ0LCB2ZXJ0c0luZGV4O1xuXG4gICAgdmFyIGksIGosIGs7XG5cbiAgICB0aGlzLl9mdW5jQXJnMCA9IGFyZzA7XG4gICAgdGhpcy5fZnVuY0FyZzEgPSBhcmcxO1xuICAgIHRoaXMuX2Z1bmNBcmcyID0gYXJnMjtcblxuICAgIGkgPSAtMTtcblxuICAgIHdoaWxlKCsraSA8IHZlcnRTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgdmVydFNpemVZKVxuICAgICAgICB7XG4gICAgICAgICAgICBrID0gLTE7XG4gICAgICAgICAgICB3aGlsZSgrK2sgPCB2ZXJ0U2l6ZVgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmVydHNJbmRleCA9IGkgKiB2ZXJ0U2l6ZVlYICsgaiAqIHZlcnRTaXplWCArIGs7XG4gICAgICAgICAgICAgICAgdmVydCAgICAgICA9IHZlcnRzW3ZlcnRzSW5kZXhdO1xuICAgICAgICAgICAgICAgIHZlcnRbM10gICAgPSB0aGlzLl9mdW5jKHZlcnRbMF0sdmVydFsxXSx2ZXJ0WzJdLGFyZzAsYXJnMSxhcmcyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5fZ2VuU3VyZmFjZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgdmVydFNpemVYICA9IHRoaXMuX3ZlcnRTaXplWCxcbiAgICAgICAgdmVydFNpemVZICA9IHRoaXMuX3ZlcnRTaXplWSxcbiAgICAgICAgdmVydFNpemVaICA9IHRoaXMuX3ZlcnRTaXplWixcbiAgICAgICAgdmVydFNpemVaWSA9IHZlcnRTaXplWiAqIHZlcnRTaXplWSxcbiAgICAgICAgdmVydFNpemVYWSA9IHZlcnRTaXplWCAqIHZlcnRTaXplWTtcblxuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzLFxuICAgICAgICB2ZXJ0c0luZGV4O1xuXG4gICAgdmFyIGN1YmVTaXplWCAgPSB0aGlzLl9jdWJlU2l6ZVgsXG4gICAgICAgIGN1YmVTaXplWSAgPSB0aGlzLl9jdWJlU2l6ZVksXG4gICAgICAgIGN1YmVTaXplWiAgPSB0aGlzLl9jdWJlU2l6ZVosXG4gICAgICAgIGN1YmVTaXplWlkgPSBjdWJlU2l6ZVkgKiBjdWJlU2l6ZVo7XG5cbiAgICB2YXIgY3ViZXMgPSB0aGlzLl9jdWJlcyxcbiAgICAgICAgY2VsbHNJbmRleDtcblxuICAgIHZhciBzY2FsZVhZWiA9IHRoaXMuX3NjYWxlWFlaO1xuXG4gICAgdmFyIGksIGosIGs7XG5cbiAgICBpID0gLTE7XG5cbiAgICB3aGlsZSgrK2kgPCB2ZXJ0U2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHZlcnRTaXplWSlcbiAgICAgICAge1xuICAgICAgICAgICAgayA9IC0xO1xuICAgICAgICAgICAgd2hpbGUoKytrIDwgdmVydFNpemVYKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggICAgICAgID0gaSAqIHZlcnRTaXplWlkgKyBqICogdmVydFNpemVaICsgaztcblxuICAgICAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXhdID0gWygtMC41ICsgKCBrIC8gKHZlcnRTaXplWCAtIDEpKSkgKiBzY2FsZVhZWlswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLTAuNSArICggaiAvICh2ZXJ0U2l6ZVkgLSAxKSkpICogc2NhbGVYWVpbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC0wLjUgKyAoIGkgLyAodmVydFNpemVaIC0gMSkpKSAqIHNjYWxlWFlaWzJdLFxuICAgICAgICAgICAgICAgICAgICAtMV07XG5cblxuICAgICAgICAgICAgICAgIGlmKGkgPCBjdWJlU2l6ZVggJiYgaiA8IGN1YmVTaXplWSAmJiBrICA8IGN1YmVTaXplWilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzSW5kZXggPSBpICogY3ViZVNpemVaWSArIGogKiBjdWJlU2l6ZVggKyBrO1xuXG4gICAgICAgICAgICAgICAgICAgIGN1YmVzW2NlbGxzSW5kZXhdID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIHZlcnRTaXplWixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyB2ZXJ0U2l6ZVogKyAxLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgdmVydFNpemVYWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyB2ZXJ0U2l6ZVhZICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyB2ZXJ0U2l6ZVogKyB2ZXJ0U2l6ZVhZLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIHZlcnRTaXplWiArIHZlcnRTaXplWFkgKyAxXG4gICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbihnbClcbntcbiAgICBnbC5kaXNhYmxlRGVmYXVsdFRleENvb3Jkc0F0dHJpYkFycmF5KCk7XG4gICAgZ2wuZW5hYmxlRGVmYXVsdE5vcm1hbEF0dHJpYkFycmF5KCk7XG5cbiAgICB2YXIgX2dsID0gZ2wuZ2w7XG5cbiAgICB2YXIgZ2xBcnJheUJ1ZmZlciA9IF9nbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBfZ2wuRkxPQVQ7XG5cbiAgICB2YXIgdmVydGljZXMgPSB0aGlzLl9iVmVydGljZXMsXG4gICAgICAgIG5vcm1hbHMgID0gdGhpcy5fYk5vcm1hbHMsXG4gICAgICAgIGNvbG9ycyAgID0gdGhpcy5fYkNvbG9ycztcblxuICAgIHZhciB2YmxlbiA9IHZlcnRpY2VzLmJ5dGVMZW5ndGgsXG4gICAgICAgIG5ibGVuID0gbm9ybWFscy5ieXRlTGVuZ3RoLFxuICAgICAgICBjYmxlbiA9IGNvbG9ycy5ieXRlTGVuZ3RoO1xuXG4gICAgdmFyIG9mZnNldFYgPSAwLFxuICAgICAgICBvZmZzZXROID0gb2Zmc2V0ViArIHZibGVuLFxuICAgICAgICBvZmZzZXRDID0gb2Zmc2V0TiArIG5ibGVuO1xuXG4gICAgX2dsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlciwgdmJsZW4gKyBuYmxlbiArIGNibGVuLCBfZ2wuRFlOQU1JQ19EUkFXKTtcblxuICAgIF9nbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsIG9mZnNldFYsICB2ZXJ0aWNlcyk7XG4gICAgX2dsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0TiwgIG5vcm1hbHMpO1xuICAgIF9nbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsIG9mZnNldEMsICBjb2xvcnMpO1xuXG4gICAgX2dsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2wuZ2V0RGVmYXVsdFZlcnRleEF0dHJpYigpLCAzLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG4gICAgX2dsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2wuZ2V0RGVmYXVsdE5vcm1hbEF0dHJpYigpLCAzLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Tik7XG4gICAgX2dsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2wuZ2V0RGVmYXVsdENvbG9yQXR0cmliKCksICA0LCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Qyk7XG5cbiAgICBnbC5zZXRNYXRyaWNlc1VuaWZvcm0oKTtcbiAgICBfZ2wuZHJhd0FycmF5cyhfZ2wuVFJJQU5HTEVTLDAsdGhpcy5fbnVtVHJpYW5nbGVzICogMyk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT1N1cmZhY2UuRURHRV9UQUJMRSA9IG5ldyBJbnQzMkFycmF5KFxuICAgIFtcbiAgICAgICAgMHgwICAsIDB4MTA5LCAweDIwMywgMHgzMGEsIDB4NDA2LCAweDUwZiwgMHg2MDUsIDB4NzBjLFxuICAgICAgICAweDgwYywgMHg5MDUsIDB4YTBmLCAweGIwNiwgMHhjMGEsIDB4ZDAzLCAweGUwOSwgMHhmMDAsXG4gICAgICAgIDB4MTkwLCAweDk5ICwgMHgzOTMsIDB4MjlhLCAweDU5NiwgMHg0OWYsIDB4Nzk1LCAweDY5YyxcbiAgICAgICAgMHg5OWMsIDB4ODk1LCAweGI5ZiwgMHhhOTYsIDB4ZDlhLCAweGM5MywgMHhmOTksIDB4ZTkwLFxuICAgICAgICAweDIzMCwgMHgzMzksIDB4MzMgLCAweDEzYSwgMHg2MzYsIDB4NzNmLCAweDQzNSwgMHg1M2MsXG4gICAgICAgIDB4YTNjLCAweGIzNSwgMHg4M2YsIDB4OTM2LCAweGUzYSwgMHhmMzMsIDB4YzM5LCAweGQzMCxcbiAgICAgICAgMHgzYTAsIDB4MmE5LCAweDFhMywgMHhhYSAsIDB4N2E2LCAweDZhZiwgMHg1YTUsIDB4NGFjLFxuICAgICAgICAweGJhYywgMHhhYTUsIDB4OWFmLCAweDhhNiwgMHhmYWEsIDB4ZWEzLCAweGRhOSwgMHhjYTAsXG4gICAgICAgIDB4NDYwLCAweDU2OSwgMHg2NjMsIDB4NzZhLCAweDY2ICwgMHgxNmYsIDB4MjY1LCAweDM2YyxcbiAgICAgICAgMHhjNmMsIDB4ZDY1LCAweGU2ZiwgMHhmNjYsIDB4ODZhLCAweDk2MywgMHhhNjksIDB4YjYwLFxuICAgICAgICAweDVmMCwgMHg0ZjksIDB4N2YzLCAweDZmYSwgMHgxZjYsIDB4ZmYgLCAweDNmNSwgMHgyZmMsXG4gICAgICAgIDB4ZGZjLCAweGNmNSwgMHhmZmYsIDB4ZWY2LCAweDlmYSwgMHg4ZjMsIDB4YmY5LCAweGFmMCxcbiAgICAgICAgMHg2NTAsIDB4NzU5LCAweDQ1MywgMHg1NWEsIDB4MjU2LCAweDM1ZiwgMHg1NSAsIDB4MTVjLFxuICAgICAgICAweGU1YywgMHhmNTUsIDB4YzVmLCAweGQ1NiwgMHhhNWEsIDB4YjUzLCAweDg1OSwgMHg5NTAsXG4gICAgICAgIDB4N2MwLCAweDZjOSwgMHg1YzMsIDB4NGNhLCAweDNjNiwgMHgyY2YsIDB4MWM1LCAweGNjICxcbiAgICAgICAgMHhmY2MsIDB4ZWM1LCAweGRjZiwgMHhjYzYsIDB4YmNhLCAweGFjMywgMHg5YzksIDB4OGMwLFxuICAgICAgICAweDhjMCwgMHg5YzksIDB4YWMzLCAweGJjYSwgMHhjYzYsIDB4ZGNmLCAweGVjNSwgMHhmY2MsXG4gICAgICAgIDB4Y2MgLCAweDFjNSwgMHgyY2YsIDB4M2M2LCAweDRjYSwgMHg1YzMsIDB4NmM5LCAweDdjMCxcbiAgICAgICAgMHg5NTAsIDB4ODU5LCAweGI1MywgMHhhNWEsIDB4ZDU2LCAweGM1ZiwgMHhmNTUsIDB4ZTVjLFxuICAgICAgICAweDE1YywgMHg1NSAsIDB4MzVmLCAweDI1NiwgMHg1NWEsIDB4NDUzLCAweDc1OSwgMHg2NTAsXG4gICAgICAgIDB4YWYwLCAweGJmOSwgMHg4ZjMsIDB4OWZhLCAweGVmNiwgMHhmZmYsIDB4Y2Y1LCAweGRmYyxcbiAgICAgICAgMHgyZmMsIDB4M2Y1LCAweGZmICwgMHgxZjYsIDB4NmZhLCAweDdmMywgMHg0ZjksIDB4NWYwLFxuICAgICAgICAweGI2MCwgMHhhNjksIDB4OTYzLCAweDg2YSwgMHhmNjYsIDB4ZTZmLCAweGQ2NSwgMHhjNmMsXG4gICAgICAgIDB4MzZjLCAweDI2NSwgMHgxNmYsIDB4NjYgLCAweDc2YSwgMHg2NjMsIDB4NTY5LCAweDQ2MCxcbiAgICAgICAgMHhjYTAsIDB4ZGE5LCAweGVhMywgMHhmYWEsIDB4OGE2LCAweDlhZiwgMHhhYTUsIDB4YmFjLFxuICAgICAgICAweDRhYywgMHg1YTUsIDB4NmFmLCAweDdhNiwgMHhhYSAsIDB4MWEzLCAweDJhOSwgMHgzYTAsXG4gICAgICAgIDB4ZDMwLCAweGMzOSwgMHhmMzMsIDB4ZTNhLCAweDkzNiwgMHg4M2YsIDB4YjM1LCAweGEzYyxcbiAgICAgICAgMHg1M2MsIDB4NDM1LCAweDczZiwgMHg2MzYsIDB4MTNhLCAweDMzICwgMHgzMzksIDB4MjMwLFxuICAgICAgICAweGU5MCwgMHhmOTksIDB4YzkzLCAweGQ5YSwgMHhhOTYsIDB4YjlmLCAweDg5NSwgMHg5OWMsXG4gICAgICAgIDB4NjljLCAweDc5NSwgMHg0OWYsIDB4NTk2LCAweDI5YSwgMHgzOTMsIDB4OTkgLCAweDE5MCxcbiAgICAgICAgMHhmMDAsIDB4ZTA5LCAweGQwMywgMHhjMGEsIDB4YjA2LCAweGEwZiwgMHg5MDUsIDB4ODBjLFxuICAgICAgICAweDcwYywgMHg2MDUsIDB4NTBmLCAweDQwNiwgMHgzMGEsIDB4MjAzLCAweDEwOSwgMHgwXG4gICAgXSk7XG5cbklTT1N1cmZhY2UuVFJJX1RBQkxFID0gbmV3IEludDMyQXJyYXkoXG4gICAgW1xuICAgICAgICAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA4LCAzLCA5LCA4LCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAzLCAxLCAyLCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDIsIDEwLCAwLCAyLCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgOCwgMywgMiwgMTAsIDgsIDEwLCA5LCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMTEsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxMSwgMiwgOCwgMTEsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA5LCAwLCAyLCAzLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDExLCAyLCAxLCA5LCAxMSwgOSwgOCwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxMCwgMSwgMTEsIDEwLCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMTAsIDEsIDAsIDgsIDEwLCA4LCAxMSwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCA5LCAwLCAzLCAxMSwgOSwgMTEsIDEwLCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgOCwgMTAsIDEwLCA4LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDcsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAzLCAwLCA3LCAzLCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgOSwgOCwgNCwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDEsIDksIDQsIDcsIDEsIDcsIDMsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMCwgOCwgNCwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDQsIDcsIDMsIDAsIDQsIDEsIDIsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMiwgMTAsIDksIDAsIDIsIDgsIDQsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAxMCwgOSwgMiwgOSwgNywgMiwgNywgMywgNywgOSwgNCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDQsIDcsIDMsIDExLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDQsIDcsIDExLCAyLCA0LCAyLCAwLCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMCwgMSwgOCwgNCwgNywgMiwgMywgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA3LCAxMSwgOSwgNCwgMTEsIDksIDExLCAyLCA5LCAyLCAxLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMTAsIDEsIDMsIDExLCAxMCwgNywgOCwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDExLCAxMCwgMSwgNCwgMTEsIDEsIDAsIDQsIDcsIDExLCA0LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgNywgOCwgOSwgMCwgMTEsIDksIDExLCAxMCwgMTEsIDAsIDMsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA3LCAxMSwgNCwgMTEsIDksIDksIDExLCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA0LCAwLCA4LCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNSwgNCwgMSwgNSwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDUsIDQsIDgsIDMsIDUsIDMsIDEsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMCwgOSwgNSwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDAsIDgsIDEsIDIsIDEwLCA0LCA5LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMiwgMTAsIDUsIDQsIDIsIDQsIDAsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAxMCwgNSwgMywgMiwgNSwgMywgNSwgNCwgMywgNCwgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDQsIDIsIDMsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMTEsIDIsIDAsIDgsIDExLCA0LCA5LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNSwgNCwgMCwgMSwgNSwgMiwgMywgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAxLCA1LCAyLCA1LCA4LCAyLCA4LCAxMSwgNCwgOCwgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCAzLCAxMSwgMTAsIDEsIDMsIDksIDUsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA5LCA1LCAwLCA4LCAxLCA4LCAxMCwgMSwgOCwgMTEsIDEwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgNCwgMCwgNSwgMCwgMTEsIDUsIDExLCAxMCwgMTEsIDAsIDMsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCA0LCA4LCA1LCA4LCAxMCwgMTAsIDgsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNywgOCwgNSwgNywgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDMsIDAsIDksIDUsIDMsIDUsIDcsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA3LCA4LCAwLCAxLCA3LCAxLCA1LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNSwgMywgMywgNSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDcsIDgsIDksIDUsIDcsIDEwLCAxLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDEsIDIsIDksIDUsIDAsIDUsIDMsIDAsIDUsIDcsIDMsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAwLCAyLCA4LCAyLCA1LCA4LCA1LCA3LCAxMCwgNSwgMiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDEwLCA1LCAyLCA1LCAzLCAzLCA1LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgOSwgNSwgNywgOCwgOSwgMywgMTEsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA3LCA5LCA3LCAyLCA5LCAyLCAwLCAyLCA3LCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDMsIDExLCAwLCAxLCA4LCAxLCA3LCA4LCAxLCA1LCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDIsIDEsIDExLCAxLCA3LCA3LCAxLCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgOCwgOCwgNSwgNywgMTAsIDEsIDMsIDEwLCAzLCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDcsIDAsIDUsIDAsIDksIDcsIDExLCAwLCAxLCAwLCAxMCwgMTEsIDEwLCAwLCAtMSxcbiAgICAgICAgMTEsIDEwLCAwLCAxMSwgMCwgMywgMTAsIDUsIDAsIDgsIDAsIDcsIDUsIDcsIDAsIC0xLFxuICAgICAgICAxMSwgMTAsIDUsIDcsIDExLCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDYsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAzLCA1LCAxMCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDAsIDEsIDUsIDEwLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgOCwgMywgMSwgOSwgOCwgNSwgMTAsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA2LCA1LCAyLCA2LCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNiwgNSwgMSwgMiwgNiwgMywgMCwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDYsIDUsIDksIDAsIDYsIDAsIDIsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCA5LCA4LCA1LCA4LCAyLCA1LCAyLCA2LCAzLCAyLCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMywgMTEsIDEwLCA2LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDAsIDgsIDExLCAyLCAwLCAxMCwgNiwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDksIDIsIDMsIDExLCA1LCAxMCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDEwLCA2LCAxLCA5LCAyLCA5LCAxMSwgMiwgOSwgOCwgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCAzLCAxMSwgNiwgNSwgMywgNSwgMSwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDExLCAwLCAxMSwgNSwgMCwgNSwgMSwgNSwgMTEsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxMSwgNiwgMCwgMywgNiwgMCwgNiwgNSwgMCwgNSwgOSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDUsIDksIDYsIDksIDExLCAxMSwgOSwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDEwLCA2LCA0LCA3LCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMywgMCwgNCwgNywgMywgNiwgNSwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA5LCAwLCA1LCAxMCwgNiwgOCwgNCwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA2LCA1LCAxLCA5LCA3LCAxLCA3LCAzLCA3LCA5LCA0LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgMSwgMiwgNiwgNSwgMSwgNCwgNywgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDUsIDUsIDIsIDYsIDMsIDAsIDQsIDMsIDQsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA0LCA3LCA5LCAwLCA1LCAwLCA2LCA1LCAwLCAyLCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgMywgOSwgNywgOSwgNCwgMywgMiwgOSwgNSwgOSwgNiwgMiwgNiwgOSwgLTEsXG4gICAgICAgIDMsIDExLCAyLCA3LCA4LCA0LCAxMCwgNiwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDEwLCA2LCA0LCA3LCAyLCA0LCAyLCAwLCAyLCA3LCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDksIDQsIDcsIDgsIDIsIDMsIDExLCA1LCAxMCwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDIsIDEsIDksIDExLCAyLCA5LCA0LCAxMSwgNywgMTEsIDQsIDUsIDEwLCA2LCAtMSxcbiAgICAgICAgOCwgNCwgNywgMywgMTEsIDUsIDMsIDUsIDEsIDUsIDExLCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMSwgMTEsIDUsIDExLCA2LCAxLCAwLCAxMSwgNywgMTEsIDQsIDAsIDQsIDExLCAtMSxcbiAgICAgICAgMCwgNSwgOSwgMCwgNiwgNSwgMCwgMywgNiwgMTEsIDYsIDMsIDgsIDQsIDcsIC0xLFxuICAgICAgICA2LCA1LCA5LCA2LCA5LCAxMSwgNCwgNywgOSwgNywgMTEsIDksIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNCwgOSwgNiwgNCwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAxMCwgNiwgNCwgOSwgMTAsIDAsIDgsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgMCwgMSwgMTAsIDYsIDAsIDYsIDQsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAzLCAxLCA4LCAxLCA2LCA4LCA2LCA0LCA2LCAxLCAxMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDQsIDksIDEsIDIsIDQsIDIsIDYsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAwLCA4LCAxLCAyLCA5LCAyLCA0LCA5LCAyLCA2LCA0LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMiwgNCwgNCwgMiwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDMsIDIsIDgsIDIsIDQsIDQsIDIsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNCwgOSwgMTAsIDYsIDQsIDExLCAyLCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMiwgMiwgOCwgMTEsIDQsIDksIDEwLCA0LCAxMCwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDExLCAyLCAwLCAxLCA2LCAwLCA2LCA0LCA2LCAxLCAxMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDQsIDEsIDYsIDEsIDEwLCA0LCA4LCAxLCAyLCAxLCAxMSwgOCwgMTEsIDEsIC0xLFxuICAgICAgICA5LCA2LCA0LCA5LCAzLCA2LCA5LCAxLCAzLCAxMSwgNiwgMywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDExLCAxLCA4LCAxLCAwLCAxMSwgNiwgMSwgOSwgMSwgNCwgNiwgNCwgMSwgLTEsXG4gICAgICAgIDMsIDExLCA2LCAzLCA2LCAwLCAwLCA2LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgNCwgOCwgMTEsIDYsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCAxMCwgNiwgNywgOCwgMTAsIDgsIDksIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNywgMywgMCwgMTAsIDcsIDAsIDksIDEwLCA2LCA3LCAxMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA2LCA3LCAxLCAxMCwgNywgMSwgNywgOCwgMSwgOCwgMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA2LCA3LCAxMCwgNywgMSwgMSwgNywgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDYsIDEsIDYsIDgsIDEsIDgsIDksIDgsIDYsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCA2LCA5LCAyLCA5LCAxLCA2LCA3LCA5LCAwLCA5LCAzLCA3LCAzLCA5LCAtMSxcbiAgICAgICAgNywgOCwgMCwgNywgMCwgNiwgNiwgMCwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDMsIDIsIDYsIDcsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAzLCAxMSwgMTAsIDYsIDgsIDEwLCA4LCA5LCA4LCA2LCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMCwgNywgMiwgNywgMTEsIDAsIDksIDcsIDYsIDcsIDEwLCA5LCAxMCwgNywgLTEsXG4gICAgICAgIDEsIDgsIDAsIDEsIDcsIDgsIDEsIDEwLCA3LCA2LCA3LCAxMCwgMiwgMywgMTEsIC0xLFxuICAgICAgICAxMSwgMiwgMSwgMTEsIDEsIDcsIDEwLCA2LCAxLCA2LCA3LCAxLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgOSwgNiwgOCwgNiwgNywgOSwgMSwgNiwgMTEsIDYsIDMsIDEsIDMsIDYsIC0xLFxuICAgICAgICAwLCA5LCAxLCAxMSwgNiwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDgsIDAsIDcsIDAsIDYsIDMsIDExLCAwLCAxMSwgNiwgMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDExLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgNiwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAwLCA4LCAxMSwgNywgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDksIDExLCA3LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMSwgOSwgOCwgMywgMSwgMTEsIDcsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgMSwgMiwgNiwgMTEsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMCwgMywgMCwgOCwgNiwgMTEsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCA5LCAwLCAyLCAxMCwgOSwgNiwgMTEsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCAxMSwgNywgMiwgMTAsIDMsIDEwLCA4LCAzLCAxMCwgOSwgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDIsIDMsIDYsIDIsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCAwLCA4LCA3LCA2LCAwLCA2LCAyLCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgNywgNiwgMiwgMywgNywgMCwgMSwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDYsIDIsIDEsIDgsIDYsIDEsIDksIDgsIDgsIDcsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNywgNiwgMTAsIDEsIDcsIDEsIDMsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNywgNiwgMSwgNywgMTAsIDEsIDgsIDcsIDEsIDAsIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAzLCA3LCAwLCA3LCAxMCwgMCwgMTAsIDksIDYsIDEwLCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgNiwgMTAsIDcsIDEwLCA4LCA4LCAxMCwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDgsIDQsIDExLCA4LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgNiwgMTEsIDMsIDAsIDYsIDAsIDQsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA2LCAxMSwgOCwgNCwgNiwgOSwgMCwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDQsIDYsIDksIDYsIDMsIDksIDMsIDEsIDExLCAzLCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgOCwgNCwgNiwgMTEsIDgsIDIsIDEwLCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTAsIDMsIDAsIDExLCAwLCA2LCAxMSwgMCwgNCwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDExLCA4LCA0LCA2LCAxMSwgMCwgMiwgOSwgMiwgMTAsIDksIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgOSwgMywgMTAsIDMsIDIsIDksIDQsIDMsIDExLCAzLCA2LCA0LCA2LCAzLCAtMSxcbiAgICAgICAgOCwgMiwgMywgOCwgNCwgMiwgNCwgNiwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDQsIDIsIDQsIDYsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA5LCAwLCAyLCAzLCA0LCAyLCA0LCA2LCA0LCAzLCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgOSwgNCwgMSwgNCwgMiwgMiwgNCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDEsIDMsIDgsIDYsIDEsIDgsIDQsIDYsIDYsIDEwLCAxLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDEsIDAsIDEwLCAwLCA2LCA2LCAwLCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgNiwgMywgNCwgMywgOCwgNiwgMTAsIDMsIDAsIDMsIDksIDEwLCA5LCAzLCAtMSxcbiAgICAgICAgMTAsIDksIDQsIDYsIDEwLCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgOSwgNSwgNywgNiwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAzLCA0LCA5LCA1LCAxMSwgNywgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDAsIDEsIDUsIDQsIDAsIDcsIDYsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDcsIDYsIDgsIDMsIDQsIDMsIDUsIDQsIDMsIDEsIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA0LCAxMCwgMSwgMiwgNywgNiwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCAxMSwgNywgMSwgMiwgMTAsIDAsIDgsIDMsIDQsIDksIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCA2LCAxMSwgNSwgNCwgMTAsIDQsIDIsIDEwLCA0LCAwLCAyLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgNCwgOCwgMywgNSwgNCwgMywgMiwgNSwgMTAsIDUsIDIsIDExLCA3LCA2LCAtMSxcbiAgICAgICAgNywgMiwgMywgNywgNiwgMiwgNSwgNCwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDQsIDAsIDgsIDYsIDAsIDYsIDIsIDYsIDgsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCA2LCAyLCAzLCA3LCA2LCAxLCA1LCAwLCA1LCA0LCAwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgMiwgOCwgNiwgOCwgNywgMiwgMSwgOCwgNCwgOCwgNSwgMSwgNSwgOCwgLTEsXG4gICAgICAgIDksIDUsIDQsIDEwLCAxLCA2LCAxLCA3LCA2LCAxLCAzLCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNiwgMTAsIDEsIDcsIDYsIDEsIDAsIDcsIDgsIDcsIDAsIDksIDUsIDQsIC0xLFxuICAgICAgICA0LCAwLCAxMCwgNCwgMTAsIDUsIDAsIDMsIDEwLCA2LCAxMCwgNywgMywgNywgMTAsIC0xLFxuICAgICAgICA3LCA2LCAxMCwgNywgMTAsIDgsIDUsIDQsIDEwLCA0LCA4LCAxMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDksIDUsIDYsIDExLCA5LCAxMSwgOCwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDYsIDExLCAwLCA2LCAzLCAwLCA1LCA2LCAwLCA5LCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMTEsIDgsIDAsIDUsIDExLCAwLCAxLCA1LCA1LCA2LCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDExLCAzLCA2LCAzLCA1LCA1LCAzLCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTAsIDksIDUsIDExLCA5LCAxMSwgOCwgMTEsIDUsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxMSwgMywgMCwgNiwgMTEsIDAsIDksIDYsIDUsIDYsIDksIDEsIDIsIDEwLCAtMSxcbiAgICAgICAgMTEsIDgsIDUsIDExLCA1LCA2LCA4LCAwLCA1LCAxMCwgNSwgMiwgMCwgMiwgNSwgLTEsXG4gICAgICAgIDYsIDExLCAzLCA2LCAzLCA1LCAyLCAxMCwgMywgMTAsIDUsIDMsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCA4LCA5LCA1LCAyLCA4LCA1LCA2LCAyLCAzLCA4LCAyLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNiwgOSwgNiwgMCwgMCwgNiwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDUsIDgsIDEsIDgsIDAsIDUsIDYsIDgsIDMsIDgsIDIsIDYsIDIsIDgsIC0xLFxuICAgICAgICAxLCA1LCA2LCAyLCAxLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMywgNiwgMSwgNiwgMTAsIDMsIDgsIDYsIDUsIDYsIDksIDgsIDksIDYsIC0xLFxuICAgICAgICAxMCwgMSwgMCwgMTAsIDAsIDYsIDksIDUsIDAsIDUsIDYsIDAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAzLCA4LCA1LCA2LCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA1LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDUsIDEwLCA3LCA1LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCA1LCAxMCwgMTEsIDcsIDUsIDgsIDMsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAxMSwgNywgNSwgMTAsIDExLCAxLCA5LCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDcsIDUsIDEwLCAxMSwgNywgOSwgOCwgMSwgOCwgMywgMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCAxLCAyLCAxMSwgNywgMSwgNywgNSwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDMsIDEsIDIsIDcsIDEsIDcsIDUsIDcsIDIsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNywgNSwgOSwgMiwgNywgOSwgMCwgMiwgMiwgMTEsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCA1LCAyLCA3LCAyLCAxMSwgNSwgOSwgMiwgMywgMiwgOCwgOSwgOCwgMiwgLTEsXG4gICAgICAgIDIsIDUsIDEwLCAyLCAzLCA1LCAzLCA3LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMiwgMCwgOCwgNSwgMiwgOCwgNywgNSwgMTAsIDIsIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAwLCAxLCA1LCAxMCwgMywgNSwgMywgNywgMywgMTAsIDIsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA4LCAyLCA5LCAyLCAxLCA4LCA3LCAyLCAxMCwgMiwgNSwgNywgNSwgMiwgLTEsXG4gICAgICAgIDEsIDMsIDUsIDMsIDcsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCA3LCAwLCA3LCAxLCAxLCA3LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMCwgMywgOSwgMywgNSwgNSwgMywgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDgsIDcsIDUsIDksIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCA4LCA0LCA1LCAxMCwgOCwgMTAsIDExLCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMCwgNCwgNSwgMTEsIDAsIDUsIDEwLCAxMSwgMTEsIDMsIDAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCA5LCA4LCA0LCAxMCwgOCwgMTAsIDExLCAxMCwgNCwgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCAxMSwgNCwgMTAsIDQsIDUsIDExLCAzLCA0LCA5LCA0LCAxLCAzLCAxLCA0LCAtMSxcbiAgICAgICAgMiwgNSwgMSwgMiwgOCwgNSwgMiwgMTEsIDgsIDQsIDUsIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA0LCAxMSwgMCwgMTEsIDMsIDQsIDUsIDExLCAyLCAxMSwgMSwgNSwgMSwgMTEsIC0xLFxuICAgICAgICAwLCAyLCA1LCAwLCA1LCA5LCAyLCAxMSwgNSwgNCwgNSwgOCwgMTEsIDgsIDUsIC0xLFxuICAgICAgICA5LCA0LCA1LCAyLCAxMSwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDUsIDEwLCAzLCA1LCAyLCAzLCA0LCA1LCAzLCA4LCA0LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMTAsIDIsIDUsIDIsIDQsIDQsIDIsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxMCwgMiwgMywgNSwgMTAsIDMsIDgsIDUsIDQsIDUsIDgsIDAsIDEsIDksIC0xLFxuICAgICAgICA1LCAxMCwgMiwgNSwgMiwgNCwgMSwgOSwgMiwgOSwgNCwgMiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDQsIDUsIDgsIDUsIDMsIDMsIDUsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA0LCA1LCAxLCAwLCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgNCwgNSwgOCwgNSwgMywgOSwgMCwgNSwgMCwgMywgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDQsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAxMSwgNywgNCwgOSwgMTEsIDksIDEwLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDMsIDQsIDksIDcsIDksIDExLCA3LCA5LCAxMCwgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAxMCwgMTEsIDEsIDExLCA0LCAxLCA0LCAwLCA3LCA0LCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDEsIDQsIDMsIDQsIDgsIDEsIDEwLCA0LCA3LCA0LCAxMSwgMTAsIDExLCA0LCAtMSxcbiAgICAgICAgNCwgMTEsIDcsIDksIDExLCA0LCA5LCAyLCAxMSwgOSwgMSwgMiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDcsIDQsIDksIDExLCA3LCA5LCAxLCAxMSwgMiwgMTEsIDEsIDAsIDgsIDMsIC0xLFxuICAgICAgICAxMSwgNywgNCwgMTEsIDQsIDIsIDIsIDQsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgNywgNCwgMTEsIDQsIDIsIDgsIDMsIDQsIDMsIDIsIDQsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCA5LCAxMCwgMiwgNywgOSwgMiwgMywgNywgNywgNCwgOSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDEwLCA3LCA5LCA3LCA0LCAxMCwgMiwgNywgOCwgNywgMCwgMiwgMCwgNywgLTEsXG4gICAgICAgIDMsIDcsIDEwLCAzLCAxMCwgMiwgNywgNCwgMTAsIDEsIDEwLCAwLCA0LCAwLCAxMCwgLTEsXG4gICAgICAgIDEsIDEwLCAyLCA4LCA3LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgOSwgMSwgNCwgMSwgNywgNywgMSwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDksIDEsIDQsIDEsIDcsIDAsIDgsIDEsIDgsIDcsIDEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAwLCAzLCA3LCA0LCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgOCwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDEwLCA4LCAxMCwgMTEsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAwLCA5LCAzLCA5LCAxMSwgMTEsIDksIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgMTAsIDAsIDEwLCA4LCA4LCAxMCwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxLCAxMCwgMTEsIDMsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTEsIDEsIDExLCA5LCA5LCAxMSwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDAsIDksIDMsIDksIDExLCAxLCAyLCA5LCAyLCAxMSwgOSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDIsIDExLCA4LCAwLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDIsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMywgOCwgMiwgOCwgMTAsIDEwLCA4LCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMTAsIDIsIDAsIDksIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAzLCA4LCAyLCA4LCAxMCwgMCwgMSwgOCwgMSwgMTAsIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAxMCwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDMsIDgsIDksIDEsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA5LCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMywgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXG4gICAgXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSVNPU3VyZmFjZTsiLCJcbm1vZHVsZS5leHBvcnRzID1cbntcblxuICAgIC8vVE9ETzogY2xlYW4gdXBcblxuICAgIGlzUG9pbnRMZWZ0IDogZnVuY3Rpb24oeDAseTAseDEseTEseDIseTIpXG4gICAge1xuICAgICAgICByZXR1cm4gKCB4MSAtIHgwICkgKiAoIHkyIC0geTAgKSAtICh4MiAtIHgwKSAqICh5MSAtIHkwKTtcbiAgICB9LFxuXG4gICAgLy9odHRwOi8vYWxpZW5yeWRlcmZsZXguY29tL2ludGVyc2VjdC9cbiAgICBpc0ludGVyc2VjdGlvbmYgOiBmdW5jdGlvbihheCxheSxieCxieSxjeCxjeSxkeCxkeSxvdXQpXG4gICAge1xuICAgICAgICB2YXIgZGlzdEFCLFxuICAgICAgICAgICAgY29zLFxuICAgICAgICAgICAgc2luLFxuICAgICAgICAgICAgbmV3WCxcbiAgICAgICAgICAgIHBvc2FiO1xuXG4gICAgICAgIGlmIChheCA9PSBieCAmJiBheSA9PSBieSB8fFxuICAgICAgICAgICAgY3ggPT0gZHggJiYgY3kgPT0gZHkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgYnggLT0gYXg7XG4gICAgICAgIGJ5IC09IGF5O1xuICAgICAgICBjeCAtPSBheDtcbiAgICAgICAgY3kgLT0gYXk7XG4gICAgICAgIGR4IC09IGF4O1xuICAgICAgICBkeSAtPSBheTtcblxuICAgICAgICBkaXN0QUIgPSAxIC8gKE1hdGguc3FydChieCpieCtieSpieSkgfHwgMSk7XG5cbiAgICAgICAgY29zICA9IGJ4ICogZGlzdEFCO1xuICAgICAgICBzaW4gID0gYnkgKiBkaXN0QUI7XG4gICAgICAgIG5ld1ggPSBjeCAqIGNvcyArIGN5ICogc2luO1xuICAgICAgICBjeSAgID0gY3kgKiBjb3MgLSBjeCAqIHNpbjtcbiAgICAgICAgY3ggICA9IG5ld1g7XG4gICAgICAgIG5ld1ggPSBkeCAqIGNvcyArIGR5ICogc2luO1xuICAgICAgICBkeSAgID0gZHkgKiBjb3MgLSBkeCAqIHNpbjtcbiAgICAgICAgZHggICA9IG5ld1g7XG5cbiAgICAgICAgaWYgKGN5ID09IGR5KSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcG9zYWIgID0gZHggKyAoIGN4IC0gZHggKSAqIGR5IC8gKCBkeSAtIGN5ICk7XG5cbiAgICAgICAgaWYob3V0KVxuICAgICAgICB7XG4gICAgICAgICAgICBvdXRbMF0gPSBheCArIHBvc2FiICogY29zO1xuICAgICAgICAgICAgb3V0WzFdID0gYXkgKyBwb3NhYiAqIHNpbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBpc0ludGVyc2VjdGlvbiA6IGZ1bmN0aW9uKGwwLGwxLG91dClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSW50ZXJzZWN0aW9uZihsMFswXSxsMFsxXSxsMFsyXSxsMFszXSxsMVswXSxsMFsxXSxsMVsyXSxsMVszXSxvdXQpO1xuICAgIH0gLFxuXG4gICAgaXNTZWdtZW50SW50ZXJzZWN0aW9uZiA6IGZ1bmN0aW9uKGF4LGF5LGJ4LGJ5LGN4LGN5LGR4LGR5LG91dClcbiAgICB7XG4gICAgICAgIHZhciBkaXN0YWIsXG4gICAgICAgICAgICBjb3MsXG4gICAgICAgICAgICBzaW4sXG4gICAgICAgICAgICBuZXdYLFxuICAgICAgICAgICAgcG9zYWI7XG5cbiAgICAgICAgaWYgKGF4ID09IGJ4ICYmIGF5ID09IGJ5IHx8XG4gICAgICAgICAgICBjeCA9PSBkeCAmJiBjeSA9PSBkeSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBpZiAoYXg9PWN4ICYmIGF5PT1jeSB8fCBieD09Y3ggJiYgYnk9PWN5XG4gICAgICAgICAgICB8fCAgYXg9PWR4ICYmIGF5PT1keSB8fCBieD09ZHggJiYgYnk9PWR5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgICBieCAtPSBheDtcbiAgICAgICAgYnkgLT0gYXk7XG4gICAgICAgIGN4IC09IGF4O1xuICAgICAgICBjeSAtPSBheTtcbiAgICAgICAgZHggLT0gYXg7XG4gICAgICAgIGR5IC09IGF5O1xuXG4gICAgICAgIGRpc3RhYj0gTWF0aC5zcXJ0KGJ4KmJ4K2J5KmJ5KTtcblxuICAgICAgICBjb3MgID0gYnggLyBkaXN0YWI7XG4gICAgICAgIHNpbiAgPSBieSAvIGRpc3RhYjtcbiAgICAgICAgbmV3WCA9IGN4ICogY29zICsgY3kgKiBzaW47XG4gICAgICAgIGN5ICAgPSBjeSAqIGNvcyAtIGN4ICogc2luO1xuICAgICAgICBjeCAgID0gbmV3WDtcbiAgICAgICAgbmV3WCA9IGR4ICogY29zICsgZHkgKiBzaW47XG4gICAgICAgIGR5ICAgPSBkeSAqIGNvcyAtIGR4ICogc2luO1xuICAgICAgICBkeCAgID0gbmV3WDtcblxuICAgICAgICBpZihjeSA8IDAuMCAmJiBkeSA8IDAuMCB8fCBjeSA+PSAwLjAgJiYgZHkgPj0gMC4wKXJldHVybiBmYWxzZTtcblxuICAgICAgICBwb3NhYiAgPSBkeCArICggY3ggLSBkeCApICogZHkgLyAoIGR5IC0gY3kgKTtcblxuICAgICAgICBpZihwb3NhYiA8IDAuMCB8fCBwb3NhYiA+IGRpc3RhYilyZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYob3V0KVxuICAgICAgICB7XG4gICAgICAgICAgICBvdXRbMF0gPSBheCArIHBvc2FiICogY29zO1xuICAgICAgICAgICAgb3V0WzFdID0gYXkgKyBwb3NhYiAqIHNpbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuXG59OyIsIlxuXG5cbmZ1bmN0aW9uIExpbmVCdWZmZXIyZChrZ2wsc2l6ZSlcbntcbiAgICB0aGlzLl9nbCAgICAgID0ga2dsO1xuXG4gICAgdGhpcy5fdmJvICAgICA9IG51bGw7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XG4gICAgdGhpcy5jb2xvcnMgICA9IG51bGw7XG5cbiAgICB0aGlzLl92ZXJ0SW5kZXggPSAwO1xuICAgIHRoaXMuX2NvbEluZGV4ICA9IDA7XG5cbiAgICBpZihzaXplKXRoaXMuYWxsb2NhdGUoc2l6ZSk7XG59XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLy9wcm9iYWJseSBzaG91bGRudCBkbyB0aGlzXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmJpbmQgICA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIga2dsID0gdGhpcy5fZ2wsXG4gICAgICAgIGdsICAgID0ga2dsLmdsO1xuXG4gICAga2dsLmRpc2FibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkoKTtcbiAgICBrZ2wuZGlzYWJsZURlZmF1bHRUZXhDb29yZHNBdHRyaWJBcnJheSgpO1xuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLHRoaXMuX3Zibyk7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIga2dsID0gdGhpcy5fZ2w7XG5cbiAgICBrZ2wuZW5hYmxlRGVmYXVsdE5vcm1hbEF0dHJpYkFycmF5KCk7XG4gICAga2dsLmVuYWJsZURlZmF1bHRUZXhDb29yZHNBdHRyaWJBcnJheSgpO1xuICAgIGtnbC5iaW5kRGVmYXVsdFZCTygpO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5wdXNoVmVydGV4M2YgPSBmdW5jdGlvbih4LHkseilcbntcbiAgICB2YXIgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xuXG4gICAgLy9pZih0aGlzLl9zYWZlQWxsb2NhdGUgJiYgdGhpcy5fdmVydEluZGV4ID4gdmVydGljZXMubGVuZ3RoIC0gMyl0aGlzLmFsbG9jYXRlKHZlcnRpY2VzLmxlbmd0aCAqIDEuMSk7XG5cbiAgICB2ZXJ0aWNlc1t0aGlzLl92ZXJ0SW5kZXgrK10gPSB4O1xuICAgIHZlcnRpY2VzW3RoaXMuX3ZlcnRJbmRleCsrXSA9IHk7XG4gICAgdmVydGljZXNbdGhpcy5fdmVydEluZGV4KytdID0gejtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUucHVzaENvbG9yNGYgPSBmdW5jdGlvbihyLGcsYixhKVxue1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcblxuICAgIGNvbG9yc1t0aGlzLl9jb2xJbmRleCsrXSA9IHI7XG4gICAgY29sb3JzW3RoaXMuX2NvbEluZGV4KytdID0gZztcbiAgICBjb2xvcnNbdGhpcy5fY29sSW5kZXgrK10gPSBiO1xuICAgIGNvbG9yc1t0aGlzLl9jb2xJbmRleCsrXSA9IGE7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnNldFZlcnRleDNmID0gZnVuY3Rpb24oeCx5LHosaW5kZXgzKVxue1xuICAgIGluZGV4Myo9MztcbiAgICB2YXIgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xuXG4gICAgdmVydGljZXNbaW5kZXgzICBdID0geDtcbiAgICB2ZXJ0aWNlc1tpbmRleDMrMV0gPSB5O1xuICAgIHZlcnRpY2VzW2luZGV4MysyXSA9IHo7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnNldENvbG9yNGYgPSBmdW5jdGlvbihyLGcsYixhLGluZGV4NClcbntcbiAgICBpbmRleDQqPTQ7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuXG4gICAgY29sb3JzW2luZGV4NCAgXSA9IHI7XG4gICAgY29sb3JzW2luZGV4NCsxXSA9IGc7XG4gICAgY29sb3JzW2luZGV4NCsyXSA9IGI7XG4gICAgY29sb3JzW2luZGV4NCszXSA9IGE7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnB1c2hWZXJ0ZXggICAgPSBmdW5jdGlvbih2KXt0aGlzLnB1c2hWZXJ0ZXgzZih2WzBdLHZbMV0sdlsyXSk7fTtcbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUucHVzaENvbG9yICAgICA9IGZ1bmN0aW9uKGMpe3RoaXMucHVzaENvbG9yNGYoY1swXSxjWzFdLGNbMl0sY1szXSk7fTtcbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuc2V0VmVydGV4ICAgICA9IGZ1bmN0aW9uKHYsaW5kZXgpe3RoaXMuc2V0VmVydGV4M2YodlswXSx2WzFdLHZbMl0saW5kZXgpO307XG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnNldENvbG9yICAgICAgPSBmdW5jdGlvbihjLGluZGV4KXt0aGlzLnNldENvbG9yNGYoY1swXSxjWzFdLGNbMl0sY1szXSxpbmRleCk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmJ1ZmZlciA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgZ2xrbCAgICAgICAgICA9IHRoaXMuX2dsLFxuICAgICAgICBnbCAgICAgICAgICAgID0gZ2xrbC5nbCxcbiAgICAgICAgZ2xBcnJheUJ1ZmZlciA9IGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgZ2xGbG9hdCAgICAgICA9IGdsLkZMT0FUO1xuXG5cblxuICAgIHZhciB2YmxlbiA9IHRoaXMudmVydGljZXMuYnl0ZUxlbmd0aCxcbiAgICAgICAgY2JsZW4gPSB0aGlzLmNvbG9ycy5ieXRlTGVuZ3RoO1xuXG4gICAgdmFyIG9mZnNldFYgPSAwLFxuICAgICAgICBvZmZzZXRDID0gb2Zmc2V0ViArIHZibGVuO1xuXG4gICAgZ2wuYnVmZmVyRGF0YShnbEFycmF5QnVmZmVyLHZibGVuICsgY2JsZW4sIGdsLkRZTkFNSUNfRFJBVyk7XG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLG9mZnNldFYsdGhpcy52ZXJ0aWNlcyk7XG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLG9mZnNldEMsdGhpcy5jb2xvcnMpO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2xrbC5nZXREZWZhdWx0VmVydGV4QXR0cmliKCksZ2xrbC5TSVpFX09GX1ZFUlRFWCxnbEZsb2F0LGZhbHNlLDAsb2Zmc2V0Vik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihnbGtsLmdldERlZmF1bHRDb2xvckF0dHJpYigpLCBnbGtsLlNJWkVfT0ZfQ09MT1IsIGdsRmxvYXQsZmFsc2UsMCxvZmZzZXRDKTtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGZpcnN0LGNvdW50KVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLl9nbCxcbiAgICAgICAgZ2wgICAgPSBrZ2wuZ2w7XG5cbiAgIGtnbC5zZXRNYXRyaWNlc1VuaWZvcm0oKTtcbiAgIGdsLmRyYXdBcnJheXMoa2dsLmdldERyYXdNb2RlKCksXG4gICAgICAgICAgICAgICAgIGZpcnN0IHx8IDAsXG4gICAgICAgICAgICAgICAgIGNvdW50IHx8IHRoaXMudmVydGljZXMubGVuZ3RoIC8ga2dsLlNJWkVfT0ZfVkVSVEVYKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLl92ZXJ0SW5kZXggPSAwO1xuICAgIHRoaXMuX2NvbEluZGV4ICA9IDA7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmRpc3Bvc2UgID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX2dsLmdsLmRlbGV0ZUJ1ZmZlcih0aGlzLl92Ym8pO1xuICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xuICAgIHRoaXMuY29sb3JzICAgPSBudWxsO1xuICAgIHRoaXMucmVzZXQoKTtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuYWxsb2NhdGUgPSBmdW5jdGlvbihzaXplKVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLl9nbCxcbiAgICAgICAgZ2wgICAgPSBrZ2wuZ2w7XG5cbiAgICAvL25lZWQgdG8gZGVsZXRlQnVmZmVyLCBpbnN0ZWFkIG9mIHJldXNpbmcgaXQsIG90aGVyd2lzZSBlcnJvciwgaG1cbiAgICBpZih0aGlzLl92Ym8pe2dsLmRlbGV0ZUJ1ZmZlcih0aGlzLl92Ym8pO310aGlzLl92Ym8gPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLnZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcyB8fCBuZXcgRmxvYXQzMkFycmF5KDApO1xuICAgIHRoaXMuY29sb3JzICAgPSB0aGlzLmNvbG9ycyAgIHx8IG5ldyBGbG9hdDMyQXJyYXkoMCk7XG5cbiAgICB2YXIgdmVydExlbiA9IHRoaXMudmVydGljZXMubGVuZ3RoLFxuICAgICAgICBjb2xzTGVuID0gdGhpcy5jb2xvcnMubGVuZ3RoO1xuXG4gICAgaWYodmVydExlbiA8IHNpemUpXG4gICAge1xuICAgICAgICB2YXIgdGVtcDtcblxuICAgICAgICB0ZW1wID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcbiAgICAgICAgdGVtcC5zZXQodGhpcy52ZXJ0aWNlcyk7XG4gICAgICAgIHRlbXAuc2V0KG5ldyBGbG9hdDMyQXJyYXkodGVtcC5sZW5ndGggLSB2ZXJ0TGVuKSx2ZXJ0TGVuKTtcbiAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IHRlbXA7XG5cbiAgICAgICAgdGVtcCA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSAvIDMgKiA0KTtcbiAgICAgICAgdGVtcC5zZXQodGhpcy5jb2xvcnMpO1xuICAgICAgICB0ZW1wLnNldChuZXcgRmxvYXQzMkFycmF5KHRlbXAubGVuZ3RoIC0gY29sc0xlbiksY29sc0xlbik7XG4gICAgICAgIHRoaXMuY29sb3JzID0gdGVtcDtcbiAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmdldFNpemVBbGxvY2F0ZWQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLnZlcnRpY2VzLmxlbmd0aDt9O1xuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5nZXRTaXplUHVzaGVkICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdmVydEluZGV4O307XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZUJ1ZmZlcjJkO1xuXG4iLCJ2YXIgR2VvbTNkID0gcmVxdWlyZSgnLi9mR2VvbTNkJyksXG4gICAgTWF0NDQgID0gcmVxdWlyZSgnLi4vbWF0aC9mTWF0NDQnKSxcbiAgICBWZWMzICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMzJyk7XG5cbi8vVE9ETzpcbi8vRml4IHNoYXJlZCBub3JtYWxzIG9uIGNhcHNcbi8vXG5cblxuTGluZUJ1ZmZlcjNkID0gZnVuY3Rpb24ocG9pbnRzLG51bVNlZ21lbnRzLGRpYW1ldGVyLHNsaWNlU2VnbWVudEZ1bmMsY2xvc2VkKVxue1xuICAgIEdlb20zZC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cbiAgICBudW1TZWdtZW50cyA9IG51bVNlZ21lbnRzIHx8IDEwO1xuICAgIGRpYW1ldGVyICAgID0gZGlhbWV0ZXIgICAgfHwgMC4yNTtcblxuICAgIHRoaXMuX2Nsb3NlZENhcHMgICA9ICh0eXBlb2YgY2xvc2VkID09PSAndW5kZWZpbmVkJykgPyB0cnVlIDogY2xvc2VkO1xuICAgIHRoaXMuX251bVNlZ21lbnRzICA9IG51bVNlZ21lbnRzO1xuXG4gICAgLy9jYWNoZXMgdmVydGljZXMgdHJhbnNmb3JtZWQgYnkgc2xpY2VzZWdmdW5jIGZvciBkaWFtZXRlciBzY2FsaW5nXG4gICAgLy8uLi4sdm5vcm0weCx2bm9ybTB5LHZub3JtMHosdm5vcm0weFNjYWxlZCwsdm5vcm0weVNjYWxlZCx2bm9ybTB6U2NhbGVkLC4uLlxuICAgIHRoaXMuX3ZlcnRpY2VzTm9ybSA9IG51bGw7XG4gICAgdGhpcy5wb2ludHMgICAgICAgID0gbnVsbDtcblxuICAgIHRoaXMuX3NsaWNlU2VnRnVuYyA9IHNsaWNlU2VnbWVudEZ1bmMgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbihpLGosbnVtUG9pbnRzLG51bVNlZ21lbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0ZXAgID0gTWF0aC5QSSAqIDIgLyBudW1TZWdtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ2xlID0gc3RlcCAqIGo7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtNYXRoLmNvcyhhbmdsZSksTWF0aC5zaW4oYW5nbGUpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgIHRoaXMuX2luaXREaWFtZXRlciA9IGRpYW1ldGVyO1xuXG4gICAgdGhpcy5fdGVtcFZlYzAgPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl9iUG9pbnQwICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JQb2ludDEgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYlBvaW50MDEgPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl9heGlzWSAgICA9IFZlYzMuQVhJU19ZKCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBpZihwb2ludHMpdGhpcy5zZXRQb2ludHMocG9pbnRzKTtcblxufTtcblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VvbTNkLnByb3RvdHlwZSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRQb2ludHMgPSBmdW5jdGlvbihhcnIpXG57XG4gICAgdGhpcy5wb2ludHMgPSBuZXcgRmxvYXQzMkFycmF5KGFycik7XG5cbiAgICBpZighKHRoaXMudmVydGljZXMgJiYgdGhpcy52ZXJ0aWNlcy5sZW5ndGggPT0gYXJyLmxlbmd0aCkpXG4gICAge1xuICAgICAgICB2YXIgbnVtU2VnbWVudHMgPSB0aGlzLl9udW1TZWdtZW50cyxcbiAgICAgICAgICAgIG51bVBvaW50cyAgID0gdGhpcy5fbnVtUG9pbnRzID0gYXJyLmxlbmd0aCAvIDM7XG4gICAgICAgIHZhciBsZW4gICAgICAgICA9IG51bVBvaW50cyAqIG51bVNlZ21lbnRzICogMztcblxuICAgICAgICB0aGlzLl92ZXJ0aWNlc05vcm0gPSBuZXcgRmxvYXQzMkFycmF5KGxlbiAqIDIpO1xuICAgICAgICB0aGlzLnZlcnRpY2VzICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbik7XG4gICAgICAgIHRoaXMubm9ybWFscyAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkobGVuKTtcbiAgICAgICAgdGhpcy5jb2xvcnMgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShsZW4gLyAzICogNCk7XG5cbiAgICAgICAgdGhpcy5zZXROdW1TZWdtZW50cyhudW1TZWdtZW50cyk7XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLmFwcGx5U2xpY2VTZWdtZW50RnVuYyA9IGZ1bmN0aW9uKGZ1bmMsYmFzZURpYW1ldGVyKVxue1xuICAgIGJhc2VEaWFtZXRlciA9IGJhc2VEaWFtZXRlciB8fCAwLjI1O1xuXG4gICAgdmFyIG51bVBvaW50cyAgICA9IHRoaXMuX251bVBvaW50cyxcbiAgICAgICAgbnVtU2VnbWVudHMgID0gdGhpcy5fbnVtU2VnbWVudHMsXG4gICAgICAgIHZlcnRpY2VzTm9ybSA9IHRoaXMuX3ZlcnRpY2VzTm9ybTtcblxuICAgIHZhciBmdW5jUmVzO1xuXG4gICAgdmFyIGluZGV4O1xuICAgIHZhciBpLCBqLCBrO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IG51bVBvaW50cylcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgaW5kZXggPSBpICogbnVtU2VnbWVudHM7XG5cbiAgICAgICAgd2hpbGUoKytqIDwgbnVtU2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGsgICAgPSAoaW5kZXggKyBqKSAqIDMgKiAyO1xuXG4gICAgICAgICAgICBmdW5jUmVzID0gZnVuYyhpLGosbnVtUG9pbnRzLG51bVNlZ21lbnRzKTtcblxuICAgICAgICAgICAgdmVydGljZXNOb3JtW2srMF0gPSBmdW5jUmVzWzBdO1xuICAgICAgICAgICAgdmVydGljZXNOb3JtW2srMl0gPSBmdW5jUmVzWzFdO1xuXG4gICAgICAgICAgICB2ZXJ0aWNlc05vcm1bayszXSA9IHZlcnRpY2VzTm9ybVtrKzBdICogYmFzZURpYW1ldGVyO1xuICAgICAgICAgICAgdmVydGljZXNOb3JtW2srNV0gPSB2ZXJ0aWNlc05vcm1baysyXSAqIGJhc2VEaWFtZXRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3NsaWNlU2VnRnVuYyA9IGZ1bmM7XG5cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRQb2ludDNmID0gZnVuY3Rpb24oaW5kZXgseCx5LHopXG57XG4gICAgaW5kZXggKj0gMztcblxuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50cztcblxuICAgIHBvaW50c1tpbmRleCAgXSA9IHg7XG4gICAgcG9pbnRzW2luZGV4KzFdID0geTtcbiAgICBwb2ludHNbaW5kZXgrMl0gPSB6O1xufTtcblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRQb2ludCA9IGZ1bmN0aW9uKGluZGV4LHYpXG57XG4gICAgaW5kZXggKj0gMztcblxuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50cztcblxuICAgIHBvaW50c1tpbmRleCAgXSA9IHZbMF07XG4gICAgcG9pbnRzW2luZGV4KzFdID0gdlsxXTtcbiAgICBwb2ludHNbaW5kZXgrMl0gPSB2WzJdO1xufTtcblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5nZXRQb2ludCA9IGZ1bmN0aW9uKGluZGV4LG91dClcbntcbiAgICBvdXQgICAgPSBvdXQgfHwgdGhpcy5fdGVtcFZlYzA7XG4gICAgaW5kZXggKj0gMztcblxuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50cztcblxuICAgIG91dFswXSA9IHBvaW50c1tpbmRleCAgXTtcbiAgICBvdXRbMV0gPSBwb2ludHNbaW5kZXgrMV07XG4gICAgb3V0WzJdID0gcG9pbnRzW2luZGV4KzJdO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRVbml0RGlhbWV0ZXIgPSBmdW5jdGlvbih2YWx1ZSlcbntcbiAgICB2YXIgbnVtU2VnbWVudHMgID0gdGhpcy5fbnVtU2VnbWVudHMsXG4gICAgICAgIHZlcnRpY2VzTm9ybSA9IHRoaXMuX3ZlcnRpY2VzTm9ybTtcblxuICAgIHZhciBvZmZzZXQgPSBudW1TZWdtZW50cyAqIDMgKiAyO1xuXG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsID0gdGhpcy5fbnVtUG9pbnRzICogb2Zmc2V0O1xuXG4gICAgd2hpbGUoaSA8IGwpXG4gICAge1xuICAgICAgICB2ZXJ0aWNlc05vcm1baSArIDNdID0gdmVydGljZXNOb3JtW2kgKyAwXSAqIHZhbHVlO1xuICAgICAgICB2ZXJ0aWNlc05vcm1baSArIDVdID0gdmVydGljZXNOb3JtW2kgKyAyXSAqIHZhbHVlO1xuICAgICAgICBpKz02O1xuICAgIH1cbn07XG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0RGlhbWV0ZXIgPSBmdW5jdGlvbihpbmRleCx2YWx1ZSlcbntcbiAgICB2YXIgbnVtU2VnbWVudHMgID0gdGhpcy5fbnVtU2VnbWVudHMsXG4gICAgICAgIHZlcnRpY2VzTm9ybSA9IHRoaXMuX3ZlcnRpY2VzTm9ybTtcblxuICAgIHZhciBvZmZzZXQgPSBudW1TZWdtZW50cyAqIDMgKiAyO1xuXG4gICAgdmFyIGkgPSBpbmRleCAqIG9mZnNldCxcbiAgICAgICAgbCA9IGkgKyBvZmZzZXQ7XG5cbiAgICB3aGlsZSAoaSA8IGwpXG4gICAge1xuICAgICAgICB2ZXJ0aWNlc05vcm1baSArIDNdID0gdmVydGljZXNOb3JtW2kgKyAwXSAqIHZhbHVlO1xuICAgICAgICB2ZXJ0aWNlc05vcm1baSArIDVdID0gdmVydGljZXNOb3JtW2kgKyAyXSAqIHZhbHVlO1xuICAgICAgICBpICs9IDY7XG4gICAgfVxufTtcblxuLy9UT0RPOiBDbGVhbnVwIC8gdW5yb2xsIC4uLlxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXROdW1TZWdtZW50cyA9IGZ1bmN0aW9uKG51bVNlZ21lbnRzKVxue1xuICAgIG51bVNlZ21lbnRzID0gbnVtU2VnbWVudHMgPCAyID8gMiA6IG51bVNlZ21lbnRzO1xuXG4gICAgdmFyIG51bVBvaW50cyA9IHRoaXMuX251bVBvaW50cztcbiAgICB2YXIgaW5kaWNlcyAgID0gdGhpcy5pbmRpY2VzID0gW107XG4gICAgdmFyIHRleENvb3JkcztcblxuICAgIHZhciBpLGo7XG4gICAgdmFyIHYwLHYxLHYyLHYzO1xuICAgIHZhciBuaCxudjtcbiAgICB2YXIgaW5kZXgsIGluZGV4U2VnLCBpbmRleFRleDtcbiAgICB2YXIgbGVuO1xuXG4gICAgaWYobnVtU2VnbWVudHMgPiAyKVxuICAgIHtcblxuICAgICAgICBsZW4gPSBudW1TZWdtZW50cyAtIDE7XG5cbiAgICAgICAgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbnVtUG9pbnRzIC0gMSlcbiAgICAgICAge1xuXG4gICAgICAgICAgICBpbmRleCA9IGkgKiBudW1TZWdtZW50cztcbiAgICAgICAgICAgIGogPSAtMTtcbiAgICAgICAgICAgIHdoaWxlICgrK2ogPCBsZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5kZXhTZWcgPSBpbmRleCArIGo7XG5cbiAgICAgICAgICAgICAgICB2MCA9IGluZGV4U2VnO1xuICAgICAgICAgICAgICAgIHYxID0gaW5kZXhTZWcgKyAxO1xuICAgICAgICAgICAgICAgIHYyID0gaW5kZXhTZWcgKyBudW1TZWdtZW50cyArIDE7XG4gICAgICAgICAgICAgICAgdjMgPSBpbmRleFNlZyArIG51bVNlZ21lbnRzO1xuXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKHYwLHYxLHYzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2MSx2Mix2Myk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdjAgPSBpbmRleCArIGxlbjtcbiAgICAgICAgICAgIHYxID0gaW5kZXg7XG4gICAgICAgICAgICB2MiA9IGluZGV4ICsgbGVuICsgMTtcbiAgICAgICAgICAgIHYzID0gaW5kZXggKyBudW1TZWdtZW50cyArIGxlbjtcblxuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKHYwLHYxLHYzLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHYxLHYyLHYzKTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpIDwgbnVtUG9pbnRzIC0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXggPSBpICogMjtcbiAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRleCwgICAgaW5kZXggKyAxLGluZGV4ICsgMixcbiAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArIDEsaW5kZXggKyAzLGluZGV4ICsgMik7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxlbiA9IG51bVBvaW50cyAqIG51bVNlZ21lbnRzICogMyA7XG5cbiAgICB0ZXhDb29yZHMgPSB0aGlzLnRleENvb3JkcyA9IG5ldyBGbG9hdDMyQXJyYXkobGVuIC8gMyAqIDIpO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IG51bVBvaW50cylcbiAgICB7XG4gICAgICAgIGluZGV4ID0gaSAqIG51bVNlZ21lbnRzO1xuICAgICAgICBuaCAgICA9IGkgLyAobnVtUG9pbnRzIC0gMSk7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBudW1TZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXhUZXggPSAoaW5kZXggKyBqKSAqIDI7XG4gICAgICAgICAgICBudiAgICAgICA9IDEgLSBqIC8gKG51bVNlZ21lbnRzIC0gMSk7XG5cbiAgICAgICAgICAgIHRleENvb3Jkc1tpbmRleFRleF0gICA9IG5oO1xuICAgICAgICAgICAgdGV4Q29vcmRzW2luZGV4VGV4KzFdID0gbnY7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHRoaXMuc2V0Q2xvc2VDYXBzKHRoaXMuX2Nsb3NlZENhcHMpO1xuICAgIHRoaXMuYXBwbHlTbGljZVNlZ21lbnRGdW5jKHRoaXMuX3NsaWNlU2VnRnVuYyx0aGlzLl9pbml0RGlhbWV0ZXIpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgbnVtUG9pbnRzICAgPSB0aGlzLl9udW1Qb2ludHMsXG4gICAgICAgIG51bVNlZ21lbnRzID0gdGhpcy5fbnVtU2VnbWVudHM7XG5cbiAgICB2YXIgcG9pbnRzICAgICAgID0gdGhpcy5wb2ludHMsXG4gICAgICAgIHZlcnRpY2VzICAgICA9IHRoaXMudmVydGljZXMsXG4gICAgICAgIHZlcnRpY2VzTm9ybSA9IHRoaXMuX3ZlcnRpY2VzTm9ybTtcblxuICAgIHZhciB0ZW1wVmVjID0gdGhpcy5fdGVtcFZlYzA7XG5cbiAgICB2YXIgcDAgID0gdGhpcy5fYlBvaW50MCxcbiAgICAgICAgcDEgID0gdGhpcy5fYlBvaW50MSxcbiAgICAgICAgcDAxID0gdGhpcy5fYlBvaW50MDEsXG4gICAgICAgIHVwICA9IHRoaXMuX2F4aXNZO1xuXG4gICAgdmFyIG1hdCAgICA9IE1hdDQ0Lm1ha2UoKSxcbiAgICAgICAgbWF0Um90ID0gTWF0NDQubWFrZSgpO1xuXG4gICAgdmFyIGluZGV4LGluZGV4MyxpbmRleDY7XG5cbiAgICAvL2RpcmVjdGlvbiBmcm9tIGN1cnJlbnQgcG9pbnQgLT4gbmV4dCBwb2ludCwgcHJldiBwb2ludCAtPiBjdXJyZW50IHBvaW50XG4gICAgdmFyIGRpcjAxLGRpcl8xMDtcbiAgICB2YXIgYW5nbGUsYXhpcztcblxuICAgIC8vQkVHSU4gLSBjYWxjdWxhdGUgZmlyc3QgcG9pbnRcbiAgICBWZWMzLnNldDNmKHAwLHBvaW50c1swXSxwb2ludHNbMV0scG9pbnRzWzJdKTtcbiAgICBWZWMzLnNldDNmKHAxLHBvaW50c1szXSxwb2ludHNbNF0scG9pbnRzWzVdKTtcblxuICAgIGRpcjAxID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuc3ViYmVkKHAxLHAwKSk7XG4gICAgYW5nbGUgPSBNYXRoLmFjb3MoVmVjMy5kb3QoZGlyMDEsdXApKTtcbiAgICBheGlzICA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLmNyb3NzKHVwLGRpcjAxKSk7XG5cbiAgICBNYXQ0NC5pZGVudGl0eShtYXQpO1xuICAgIG1hdFsxMl0gPSBwMFswXTtcbiAgICBtYXRbMTNdID0gcDBbMV07XG4gICAgbWF0WzE0XSA9IHAwWzJdO1xuXG4gICAgTWF0NDQubWFrZVJvdGF0aW9uT25BeGlzKGFuZ2xlLGF4aXNbMF0sYXhpc1sxXSxheGlzWzJdLG1hdFJvdCk7XG4gICAgbWF0ID0gTWF0NDQubXVsdFBvc3QobWF0LG1hdFJvdCk7XG5cbiAgICBqID0gLTE7XG4gICAgd2hpbGUoKytqIDwgbnVtU2VnbWVudHMpXG4gICAge1xuICAgICAgICBpbmRleDMgPSBqICogMztcbiAgICAgICAgaW5kZXg2ID0gaiAqIDY7XG5cbiAgICAgICAgdGVtcFZlY1swXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrM107XG4gICAgICAgIHRlbXBWZWNbMV0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzRdO1xuICAgICAgICB0ZW1wVmVjWzJdID0gdmVydGljZXNOb3JtW2luZGV4Nis1XTtcblxuICAgICAgICBNYXQ0NC5tdWx0VmVjMyhtYXQsdGVtcFZlYyk7XG5cbiAgICAgICAgdmVydGljZXNbaW5kZXgzICBdID0gdGVtcFZlY1swXTtcbiAgICAgICAgdmVydGljZXNbaW5kZXgzKzFdID0gdGVtcFZlY1sxXTtcbiAgICAgICAgdmVydGljZXNbaW5kZXgzKzJdID0gdGVtcFZlY1syXTtcbiAgICB9XG4gICAgLy9FTkQgLSBjYWxjdWxhdGUgZmlyc3QgcG9pbnRcblxuXG4gICAgLy9jYWxjIGZpcnN0IHByZXYgZGlyXG4gICAgVmVjMy5zZXQzZihwMCwgcG9pbnRzWzNdLHBvaW50c1s0XSxwb2ludHNbNV0pO1xuICAgIFZlYzMuc2V0M2YocDAxLHBvaW50c1swXSxwb2ludHNbMV0scG9pbnRzWzJdKTtcbiAgICBkaXJfMTAgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5zdWJiZWQocDAscDAxKSk7XG5cbiAgICB2YXIgaTM7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBqO1xuICAgIHdoaWxlKCsraSA8IG51bVBvaW50cyAtIDEpXG4gICAge1xuICAgICAgICAvL3NldCBjdXJyZW50IHBvaW50XG4gICAgICAgIGkzID0gaSAqIDM7XG4gICAgICAgIHAwWzBdID0gcG9pbnRzW2kzICBdO1xuICAgICAgICBwMFsxXSA9IHBvaW50c1tpMysxXTtcbiAgICAgICAgcDBbMl0gPSBwb2ludHNbaTMrMl07XG5cbiAgICAgICAgLy9zZXQgbmV4dCBwb2ludFxuICAgICAgICBpMyA9IChpICsgMSkgKiAzO1xuICAgICAgICBwMVswXSA9IHBvaW50c1tpMyAgXTtcbiAgICAgICAgcDFbMV0gPSBwb2ludHNbaTMrMV07XG4gICAgICAgIHAxWzJdID0gcG9pbnRzW2kzKzJdO1xuXG4gICAgICAgIC8vY2FsY3VsYXRlIGRpcmVjdGlvblxuICAgICAgICBkaXIwMSAgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5zdWJiZWQocDEscDApKTtcblxuICAgICAgICAvL2ludGVycG9sYXRlIHdpdGggcHJldmlvdXMgZGlyZWN0aW9uXG4gICAgICAgIGRpcjAxWzBdID0gZGlyMDFbMF0gKiAwLjUgKyBkaXJfMTBbMF0gKiAwLjU7XG4gICAgICAgIGRpcjAxWzFdID0gZGlyMDFbMV0gKiAwLjUgKyBkaXJfMTBbMV0gKiAwLjU7XG4gICAgICAgIGRpcjAxWzJdID0gZGlyMDFbMl0gKiAwLjUgKyBkaXJfMTBbMl0gKiAwLjU7XG5cbiAgICAgICAgLy9nZXQgZGlyIGFuZ2xlICsgYXhpc1xuICAgICAgICBhbmdsZSA9IE1hdGguYWNvcyhWZWMzLmRvdChkaXIwMSx1cCkpO1xuICAgICAgICBheGlzICA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLmNyb3NzKHVwLGRpcjAxKSk7XG5cbiAgICAgICAgLy9yZXNldCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcbiAgICAgICAgTWF0NDQuaWRlbnRpdHkobWF0KTtcblxuICAgICAgICAvL3NldCB0cmFuc2xhdGlvblxuICAgICAgICBtYXRbMTJdID0gcDBbMF07XG4gICAgICAgIG1hdFsxM10gPSBwMFsxXTtcbiAgICAgICAgbWF0WzE0XSA9IHAwWzJdO1xuXG4gICAgICAgIC8vc2V0IHJvdGF0aW9uXG4gICAgICAgIE1hdDQ0Lm1ha2VSb3RhdGlvbk9uQXhpcyhhbmdsZSxheGlzWzBdLGF4aXNbMV0sYXhpc1syXSxtYXRSb3QpO1xuXG4gICAgICAgIC8vbXVsdGlwbHkgbWF0cmljZXNcbiAgICAgICAgbWF0ID0gTWF0NDQubXVsdFBvc3QobWF0LG1hdFJvdCk7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBudW1TZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXggID0gKGkgKiBudW1TZWdtZW50cyArIGopO1xuICAgICAgICAgICAgaW5kZXgzID0gaW5kZXggKiAzO1xuICAgICAgICAgICAgaW5kZXg2ID0gaW5kZXggKiA2O1xuXG4gICAgICAgICAgICAvL2xvb2t1cCB2ZXJ0ZXhcbiAgICAgICAgICAgIHRlbXBWZWNbMF0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzNdO1xuICAgICAgICAgICAgdGVtcFZlY1sxXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrNF07XG4gICAgICAgICAgICB0ZW1wVmVjWzJdID0gdmVydGljZXNOb3JtW2luZGV4Nis1XTtcblxuICAgICAgICAgICAgLy90cmFuc2Zvcm0gdmVydGV4IGNvcHkgYnkgbWF0cml4XG4gICAgICAgICAgICBNYXQ0NC5tdWx0VmVjMyhtYXQsdGVtcFZlYyk7XG5cbiAgICAgICAgICAgIC8vcmVhc3NpZ24gdHJhbnNmb3JtZWQgdmVydGV4XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpbmRleDMgIF0gPSB0ZW1wVmVjWzBdO1xuICAgICAgICAgICAgdmVydGljZXNbaW5kZXgzKzFdID0gdGVtcFZlY1sxXTtcbiAgICAgICAgICAgIHZlcnRpY2VzW2luZGV4MysyXSA9IHRlbXBWZWNbMl07XG4gICAgICAgIH1cblxuICAgICAgICAvL2Fzc2lnbiBjdXJyZW50IGRpcmVjdGlvbiB0byBwcmV2XG4gICAgICAgIGRpcl8xMFswXSA9IGRpcjAxWzBdO1xuICAgICAgICBkaXJfMTBbMV0gPSBkaXIwMVsxXTtcbiAgICAgICAgZGlyXzEwWzJdID0gZGlyMDFbMl07XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGg7XG5cbiAgICAvL0JFR0lOIC0gY2FsY3VsYXRlIGxhc3QgcG9pbnRcbiAgICBWZWMzLnNldDNmKHAwLHBvaW50c1tsZW4gLSA2XSxwb2ludHNbbGVuIC0gNV0scG9pbnRzW2xlbiAtIDRdKTtcbiAgICBWZWMzLnNldDNmKHAxLHBvaW50c1tsZW4gLSAzXSxwb2ludHNbbGVuIC0gMl0scG9pbnRzW2xlbiAtIDFdKTtcblxuICAgIGRpcjAxID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuc3ViYmVkKHAxLHAwKSk7XG4gICAgYW5nbGUgPSBNYXRoLmFjb3MoVmVjMy5kb3QoZGlyMDEsdXApKTtcbiAgICBheGlzICA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLmNyb3NzKHVwLGRpcjAxKSk7XG5cbiAgICBNYXQ0NC5pZGVudGl0eShtYXQpO1xuICAgIG1hdFsxMl0gPSBwMVswXTtcbiAgICBtYXRbMTNdID0gcDFbMV07XG4gICAgbWF0WzE0XSA9IHAxWzJdO1xuXG4gICAgTWF0NDQubWFrZVJvdGF0aW9uT25BeGlzKGFuZ2xlLGF4aXNbMF0sYXhpc1sxXSxheGlzWzJdLG1hdFJvdCk7XG4gICAgbWF0ID0gTWF0NDQubXVsdFBvc3QobWF0LG1hdFJvdCk7XG5cbiAgICBpICA9IChpICogbnVtU2VnbWVudHMpO1xuXG4gICAgaiA9IC0xO1xuICAgIHdoaWxlKCsraiA8IG51bVNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgaW5kZXggID0gaSArIGo7XG4gICAgICAgIGluZGV4MyA9IGluZGV4ICogMztcbiAgICAgICAgaW5kZXg2ID0gaW5kZXggKiA2O1xuXG4gICAgICAgIHRlbXBWZWNbMF0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzNdO1xuICAgICAgICB0ZW1wVmVjWzFdID0gdmVydGljZXNOb3JtW2luZGV4Nis0XTtcbiAgICAgICAgdGVtcFZlY1syXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrNV07XG5cbiAgICAgICAgTWF0NDQubXVsdFZlYzMobWF0LHRlbXBWZWMpO1xuXG4gICAgICAgIHZlcnRpY2VzW2luZGV4MyAgXSA9IHRlbXBWZWNbMF07XG4gICAgICAgIHZlcnRpY2VzW2luZGV4MysxXSA9IHRlbXBWZWNbMV07XG4gICAgICAgIHZlcnRpY2VzW2luZGV4MysyXSA9IHRlbXBWZWNbMl07XG4gICAgfVxuICAgIC8vRU5EIC0gY2FsY3VsYXRlIGxhc3QgcG9pbnRcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRTZWdWVGV4Q29vcmRNYXBwaW5nID0gZnVuY3Rpb24oc2NhbGUsb2Zmc2V0KXt0aGlzLnNldFNlZ1RleENvb3JkTWFwcGluZygxLDAsc2NhbGUsb2Zmc2V0IHx8IDApO307XG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFNlZ0hUZXhDb29yZE1hcHBpbmcgPSBmdW5jdGlvbihzY2FsZSxvZmZzZXQpe3RoaXMuc2V0U2VnVGV4Q29vcmRNYXBwaW5nKHNjYWxlLG9mZnNldCB8fCAwLDEsMCk7fTtcblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRTZWdUZXhDb29yZE1hcHBpbmcgPSBmdW5jdGlvbiAoc2NhbGVILCBvZmZzZXRILCBzY2FsZVYsIG9mZnNldFYpXG57XG4gICAgdmFyIG51bVBvaW50cyAgICAgPSB0aGlzLl9udW1Qb2ludHMsXG4gICAgICAgIG51bVNlZ21lbnRzICAgPSB0aGlzLl9udW1TZWdtZW50cyxcbiAgICAgICAgbnVtU2VnbWVudHNfMSA9IG51bVNlZ21lbnRzIC0gMTtcblxuICAgIHZhciB0ZXhDb29yZHMgPSB0aGlzLnRleENvb3JkcztcbiAgICB2YXIgaSwgaiwgaW5kZXgsIGluZGV4VGV4O1xuICAgIHZhciBuaCwgbnY7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8IG51bVBvaW50cylcbiAgICB7XG4gICAgICAgIGluZGV4ID0gaSAqIG51bVNlZ21lbnRzO1xuICAgICAgICBuaCA9IChpIC8gKG51bVBvaW50cyAtIDEpKSAqIHNjYWxlSCAtIG9mZnNldEg7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSAoKytqIDwgbnVtU2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4VGV4ID0gKGluZGV4ICsgaikgKiAyO1xuICAgICAgICAgICAgbnYgPSAoMSAtIGogLyBudW1TZWdtZW50c18xKSAqIHNjYWxlViAtIG9mZnNldFY7XG5cbiAgICAgICAgICAgIHRleENvb3Jkc1tpbmRleFRleCAgXSA9IG5oO1xuICAgICAgICAgICAgdGV4Q29vcmRzW2luZGV4VGV4ICsgMV0gPSBudjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRDbG9zZUNhcHMgPSBmdW5jdGlvbihib29sKVxue1xuICAgIGlmKHRoaXMuX251bVNlZ21lbnRzID09IDIpcmV0dXJuO1xuXG4gICAgdmFyIGluZGljZXMgPSB0aGlzLmluZGljZXMsXG4gICAgICAgIHRlbXAgICAgPSBuZXcgQXJyYXkodGhpcy5pbmRpY2VzLmxlbmd0aCk7XG5cbiAgICB2YXIgaSA9IC0xO3doaWxlKCsraTx0ZW1wLmxlbmd0aCl0ZW1wW2ldID0gaW5kaWNlc1tpXTtcblxuICAgIHZhciBudW1Qb2ludHMgICA9IHRoaXMuX251bVBvaW50cyxcbiAgICAgICAgbnVtU2VnbWVudHMgPSB0aGlzLl9udW1TZWdtZW50cztcbiAgICB2YXIgbGVuO1xuXG5cbiAgICBpZihib29sKVxuICAgIHtcblxuICAgICAgICBsZW4gPSBudW1TZWdtZW50cyAtIDI7XG4gICAgICAgIGkgPSAtMTt3aGlsZSgrK2kgPCBsZW4pdGVtcC5wdXNoKDAsaSsxLGkrMik7XG5cbiAgICAgICAgdmFyIGo7XG4gICAgICAgIGxlbiArPSAobnVtUG9pbnRzIC0gMSkgKiBudW1TZWdtZW50cyArIDE7XG4gICAgICAgIGkgICA9IGogPSBsZW4gLSBudW1TZWdtZW50cyArIDE7XG4gICAgICAgIHdoaWxlKCsraSA8IGxlbil0ZW1wLnB1c2goaixpLGkrMSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHRlbXAgPSB0ZW1wLnNsaWNlKDAsaW5kaWNlcy5sZW5ndGggLSAobnVtU2VnbWVudHMgLSAyKSAqIDIgKiAzKTtcbiAgICB9XG5cbiAgICB0aGlzLmluZGljZXMgPSBuZXcgVWludDE2QXJyYXkodGVtcCk7XG4gICAgdGhpcy51cGRhdGVWZXJ0ZXhOb3JtYWxzKCk7XG4gICAgdGhpcy5fY2xvc2VkQ2FwcyA9IGJvb2w7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuZ2V0TnVtU2VnbWVudHMgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9udW1TZWdtZW50czt9O1xuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5nZXROdW1Qb2ludHMgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX251bVBvaW50czt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbihnbCxjb3VudCxvZmZzZXQpXG57XG4gICAgdmFyIGluZGljZXMgPSB0aGlzLmluZGljZXM7XG4gICAgZ2wuZHJhd0VsZW1lbnRzKHRoaXMudmVydGljZXMsdGhpcy5ub3JtYWxzLGdsLmJ1ZmZlckNvbG9ycyhnbC5nZXRDb2xvckJ1ZmZlcigpLHRoaXMuY29sb3JzKSx0aGlzLnRleENvb3JkcyxpbmRpY2VzLGdsLmdldERyYXdNb2RlKCksY291bnQgfHwgaW5kaWNlcy5sZW5ndGgsIG9mZnNldCB8fCAwICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmVCdWZmZXIzZDtcbiIsInZhciBWZWMyICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMyJyksXG4gICAgVmVjMyAgID0gcmVxdWlyZSgnLi4vbWF0aC9mVmVjMycpLFxuICAgIENvbG9yICA9IHJlcXVpcmUoJy4uL3V0aWwvZkNvbG9yJyksXG4gICAgR2VvbTNkID0gcmVxdWlyZSgnLi9mR2VvbTNkJyk7XG5cblBhcmFtZXRyaWNTdXJmYWNlID0gZnVuY3Rpb24oc2l6ZSlcbntcbiAgICBHZW9tM2QuYXBwbHkodGhpcyxudWxsKTtcblxuICAgIHRoaXMuZnVuY1ggPSBmdW5jdGlvbih1LHYsdCl7cmV0dXJuIHU7fTtcbiAgICB0aGlzLmZ1bmNZID0gZnVuY3Rpb24odSx2LHQpe3JldHVybiAwO307XG4gICAgdGhpcy5mdW5jWiA9IGZ1bmN0aW9uKHUsdix0KXtyZXR1cm4gdjt9O1xuICAgIHRoaXMudXIgICAgPSBbLTEsMV07XG4gICAgdGhpcy52ciAgICA9IFstMSwxXTtcbiAgICB0aGlzLnNpemUgID0gbnVsbDtcblxuICAgIHRoaXMuc2V0U2l6ZShzaXplKTtcblxufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW9tM2QucHJvdG90eXBlKTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihzaXplLHVuaXQpXG57XG4gICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG5cbiAgICB2YXIgbGVuZ3RoICA9IHNpemUgKiBzaXplO1xuXG4gICAgdGhpcy52ZXJ0aWNlcyAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIFZlYzMuU0laRSk7XG4gICAgdGhpcy5ub3JtYWxzICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIFZlYzMuU0laRSk7XG4gICAgdGhpcy5jb2xvcnMgICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIENvbG9yLlNJWkUpO1xuICAgIHRoaXMudGV4Q29vcmRzID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBWZWMyLlNJWkUpO1xuXG4gICAgdmFyIGluZGljZXMgPSBbXTtcblxuICAgIHZhciBhLCBiLCBjLCBkO1xuICAgIHZhciBpLGo7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgc2l6ZSAtIDEpXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHNpemUgLSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBhID0gaiAgICAgKyBzaXplICogaTtcbiAgICAgICAgICAgIGIgPSAoaisxKSArIHNpemUgKiBpO1xuICAgICAgICAgICAgYyA9IGogICAgICsgc2l6ZSAqIChpKzEpO1xuICAgICAgICAgICAgZCA9IChqKzEpICsgc2l6ZSAqIChpKzEpO1xuXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goYSxiLGMpO1xuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGIsZCxjKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcblxuICAgIHRoaXMudXBkYXRlVmVydGV4Tm9ybWFscygpO1xufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLnNldEZ1bmN0aW9ucyA9IGZ1bmN0aW9uKGZ1bmNYLGZ1bmNZLGZ1bmNaLHZyLHVyKVxue1xuICAgIHRoaXMuZnVuY1ggPSBmdW5jWDtcbiAgICB0aGlzLmZ1bmNZID0gZnVuY1k7XG4gICAgdGhpcy5mdW5jWiA9IGZ1bmNaO1xuICAgIHRoaXMudnIgICA9IHZyO1xuICAgIHRoaXMudXIgICA9IHVyO1xufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb25zID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuYXBwbHlGdW5jdGlvbnNXaXRoQXJnKDApO1xufTtcblxuLy9PdmVycmlkZVxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb25zV2l0aEFyZyA9IGZ1bmN0aW9uKGFyZylcbntcbiAgICB2YXIgc2l6ZSAgPSB0aGlzLnNpemU7XG5cbiAgICB2YXIgZnVuY1ggPSB0aGlzLmZ1bmNYLFxuICAgICAgICBmdW5jWSA9IHRoaXMuZnVuY1ksXG4gICAgICAgIGZ1bmNaID0gdGhpcy5mdW5jWjtcblxuICAgIHZhciB1ckxvd2VyID0gdGhpcy51clswXSxcbiAgICAgICAgdXJVcHBlciA9IHRoaXMudXJbMV0sXG4gICAgICAgIHZyTG93ZXIgPSB0aGlzLnZyWzBdLFxuICAgICAgICB2clVwcGVyID0gdGhpcy52clsxXTtcblxuICAgIHZhciBpLCBqLCB1LCB2O1xuXG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcblxuICAgIHZhciBpbmRleCxpbmRleFZlcnRpY2VzO1xuXG4gICAgdmFyIHRlbXAwID0gdXJVcHBlciAtIHVyTG93ZXIsXG4gICAgICAgIHRlbXAxID0gdnJVcHBlciAtIHZyTG93ZXIsXG4gICAgICAgIHRlbXAyID0gc2l6ZSAtIDE7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgc2l6ZSlcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgc2l6ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXggPSAoaiArIHNpemUgKiBpKTtcbiAgICAgICAgICAgIGluZGV4VmVydGljZXMgPSBpbmRleCAqIDM7XG5cbiAgICAgICAgICAgIHUgPSAodXJMb3dlciArIHRlbXAwICogKGogLyB0ZW1wMikpO1xuICAgICAgICAgICAgdiA9ICh2ckxvd2VyICsgdGVtcDEgKiAoaSAvIHRlbXAyKSk7XG5cbiAgICAgICAgICAgIHZlcnRpY2VzW2luZGV4VmVydGljZXMgICAgXSA9IGZ1bmNYKHUsdixhcmcpO1xuICAgICAgICAgICAgdmVydGljZXNbaW5kZXhWZXJ0aWNlcyArIDFdID0gZnVuY1kodSx2LGFyZyk7XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpbmRleFZlcnRpY2VzICsgMl0gPSBmdW5jWih1LHYsYXJnKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5wb2ludE9uU3VyZmFjZSA9IGZ1bmN0aW9uKHUsdilcbntcbiAgICByZXR1cm4gdGhpcy5wb2ludE9uU3VyZmFjZVdpdGhBcmcodSx2LDApO1xufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLnBvaW50T25TdXJmYWNlV2l0aEFyZyA9IGZ1bmN0aW9uKHUsdixhcmcpXG57XG4gICAgcmV0dXJuIFZlYzMubWFrZSh0aGlzLmZ1bmNYKHUsdixhcmcpLFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jWSh1LHYsYXJnKSxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnVuY1oodSx2LGFyZykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJhbWV0cmljU3VyZmFjZTtcblxuIiwidmFyIGZNYXRoICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZNYXRoJyksXG4gICAgTGluZTJkVXRpbCA9IHJlcXVpcmUoJy4vZkxpbmUyZFV0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIG1ha2VWZXJ0ZXhDb3VudEZpdHRlZCA6IGZ1bmN0aW9uKHBvbHlnb24sY291bnQpXG4gICAge1xuICAgICAgICB2YXIgZGlmZiAgICA9IHBvbHlnb24ubGVuZ3RoICogMC41IC0gY291bnQ7XG5cbiAgICAgICAgcmV0dXJuIGRpZmYgPCAwID8gdGhpcy5tYWtlVmVydGV4Q291bnRJbmNyZWFzZWQocG9seWdvbiwgTWF0aC5hYnMoZGlmZikpIDpcbiAgICAgICAgICAgICAgIGRpZmYgPiAwID8gdGhpcy5tYWtlVmVydGV4Q291bnREZWNyZWFzZWQocG9seWdvbiwgZGlmZikgOlxuICAgICAgICAgICAgICAgcG9seWdvbjtcbiAgICB9LFxuXG5cbiAgICAvL1RPRE86IG1vZHVsbyBsb29wXG4gICAgbWFrZVZlcnRleENvdW50SW5jcmVhc2VkIDogZnVuY3Rpb24ocG9seWdvbixjb3VudClcbiAgICB7XG4gICAgICAgIGNvdW50ID0gKHR5cGVvZiBjb3VudCA9PSAndW5kZWZpbmVkJykgPyAxIDogY291bnQ7XG5cbiAgICAgICAgdmFyIG91dCA9IHBvbHlnb24uc2xpY2UoKTtcbiAgICAgICAgaWYoY291bnQgPD0gMCApcmV0dXJuIHBvbHlnb247XG5cbiAgICAgICAgdmFyIGkgPSAtMSxqO1xuICAgICAgICB2YXIgbGVuO1xuICAgICAgICB2YXIgbWF4O1xuXG4gICAgICAgIHZhciBqYyxqbjtcblxuICAgICAgICB2YXIgeCwgeSwgbXgsIG15O1xuICAgICAgICB2YXIgZHgsZHksZDtcblxuICAgICAgICB2YXIgZWRnZVNJbmRleCxcbiAgICAgICAgICAgIGVkZ2VFSW5kZXg7XG5cbiAgICAgICAgd2hpbGUoKytpIDwgY291bnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1heCA9IC1JbmZpbml0eTtcbiAgICAgICAgICAgIGxlbiA9IG91dC5sZW5ndGggKiAwLjU7XG5cbiAgICAgICAgICAgIGVkZ2VTSW5kZXggPSBlZGdlRUluZGV4ID0gMDtcblxuICAgICAgICAgICAgaiA9IC0xO1xuICAgICAgICAgICAgd2hpbGUoKytqIDwgbGVuIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBqYyA9IGogKiAyO1xuICAgICAgICAgICAgICAgIGpuID0gKGogKyAxKSAqIDI7XG5cbiAgICAgICAgICAgICAgICBkeCA9IG91dFtqbiAgICBdIC0gb3V0W2pjICAgIF07XG4gICAgICAgICAgICAgICAgZHkgPSBvdXRbam4gKyAxXSAtIG91dFtqYyArIDFdO1xuICAgICAgICAgICAgICAgIGQgID0gZHggKiBkeCArIGR5ICogZHk7XG5cbiAgICAgICAgICAgICAgICBpZihkID4gbWF4KXttYXggPSBkO2VkZ2VTSW5kZXggPSBqO31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgamMgPSBqICogMjtcbiAgICAgICAgICAgIGR4ID0gb3V0WzBdIC0gb3V0W2pjICAgIF07XG4gICAgICAgICAgICBkeSA9IG91dFsxXSAtIG91dFtqYyArIDFdO1xuICAgICAgICAgICAgZCAgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblxuICAgICAgICAgICAgZWRnZVNJbmRleCA9IChkID4gbWF4KSA/IGogOiBlZGdlU0luZGV4O1xuICAgICAgICAgICAgZWRnZUVJbmRleCA9IGVkZ2VTSW5kZXggPT0gbGVuIC0gMSA/IDAgOiBlZGdlU0luZGV4ICsgMTtcblxuICAgICAgICAgICAgZWRnZVNJbmRleCo9IDI7XG4gICAgICAgICAgICBlZGdlRUluZGV4Kj0gMjtcblxuICAgICAgICAgICAgeCA9IG91dFtlZGdlU0luZGV4ICAgIF07XG4gICAgICAgICAgICB5ID0gb3V0W2VkZ2VTSW5kZXggKyAxXTtcblxuICAgICAgICAgICAgbXggPSB4ICsgKG91dFtlZGdlRUluZGV4ICAgIF0gLSB4KSAqIDAuNTtcbiAgICAgICAgICAgIG15ID0geSArIChvdXRbZWRnZUVJbmRleCArIDFdIC0geSkgKiAwLjU7XG5cbiAgICAgICAgICAgIG91dC5zcGxpY2UoZWRnZUVJbmRleCwwLG14LG15KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG5cbiAgICB9LFxuXG5cbiAgICAvL1RPRE86IG1vZHVsbyBsb29wXG4gICAgbWFrZVZlcnRleENvdW50RGVjcmVhc2VkIDogZnVuY3Rpb24ocG9seWdvbixjb3VudClcbiAgICB7XG4gICAgICAgIGNvdW50ID0gKHR5cGVvZiBjb3VudCA9PSAndW5kZWZpbmVkJykgPyAxIDogY291bnQ7XG5cbiAgICAgICAgdmFyIG91dCA9IHBvbHlnb24uc2xpY2UoKTtcbiAgICAgICAgaWYoKG91dC5sZW5ndGggKiAwLjUgLSBjb3VudCkgPCAzIHx8IGNvdW50ID09IDApcmV0dXJuIG91dDtcblxuICAgICAgICB2YXIgaSA9IC0xLCBqO1xuICAgICAgICB2YXIgbGVuO1xuICAgICAgICB2YXIgbWluO1xuXG4gICAgICAgIHZhciBqYyxqbjtcbiAgICAgICAgdmFyIGR4LGR5LGQ7XG5cbiAgICAgICAgdmFyIGVkZ2VTSW5kZXgsXG4gICAgICAgICAgICBlZGdlRUluZGV4O1xuXG4gICAgICAgIHdoaWxlKCsraSA8IGNvdW50KVxuICAgICAgICB7XG5cbiAgICAgICAgICAgIG1pbiA9IEluZmluaXR5O1xuICAgICAgICAgICAgbGVuID0gb3V0Lmxlbmd0aCAqIDAuNTtcblxuICAgICAgICAgICAgZWRnZVNJbmRleCA9IGVkZ2VFSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBqID0gLTE7XG4gICAgICAgICAgICB3aGlsZSgrK2ogPCBsZW4gLSAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGpjID0gaiAqIDI7XG4gICAgICAgICAgICAgICAgam4gPSAoaiArIDEpICogMjtcblxuICAgICAgICAgICAgICAgIGR4ID0gb3V0W2puICAgIF0gLSBvdXRbamMgICAgXTtcbiAgICAgICAgICAgICAgICBkeSA9IG91dFtqbiArIDFdIC0gb3V0W2pjICsgMV07XG4gICAgICAgICAgICAgICAgZCAgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblxuICAgICAgICAgICAgICAgIGlmKGQgPCBtaW4pe21pbiA9IGQ7ZWRnZVNJbmRleCA9IGo7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBqYyA9IGogKiAyO1xuICAgICAgICAgICAgZHggPSBvdXRbMF0gLSBvdXRbamMgICAgXTtcbiAgICAgICAgICAgIGR5ID0gb3V0WzFdIC0gb3V0W2pjICsgMV07XG4gICAgICAgICAgICBkICA9IGR4ICogZHggKyBkeSAqIGR5O1xuXG4gICAgICAgICAgICBlZGdlU0luZGV4ID0gKGQgPCBtaW4pID8gaiA6IGVkZ2VTSW5kZXg7XG4gICAgICAgICAgICBlZGdlRUluZGV4ID0gZWRnZVNJbmRleCA9PSBsZW4gLSAxID8gMCA6IGVkZ2VTSW5kZXggKyAxO1xuXG4gICAgICAgICAgICBvdXQuc3BsaWNlKGVkZ2VFSW5kZXggKiAyLDIpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuXG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgbWFrZUVkZ2VzU3ViZGl2aWRlZCA6IGZ1bmN0aW9uKHBvbHlnb24sY291bnQsb3V0KVxuICAgIHtcbiAgICAgICAgY291bnQgPSBjb3VudCB8fCAxO1xuXG4gICAgICAgIHZhciBpLCBqLCBrO1xuICAgICAgICB2YXIgaTIsaTQ7XG5cbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIHgsIHksIG14LCBteTtcblxuXG4gICAgICAgIGlmKG91dClcbiAgICAgICAge1xuICAgICAgICAgICAgb3V0Lmxlbmd0aCA9IHBvbHlnb24ubGVuZ3RoO1xuICAgICAgICAgICAgaSA9IC0xO3doaWxlKCsraSA8IHBvbHlnb24ubGVuZ3RoKXtvdXRbaV0gPSBwb2x5Z29uW2ldO31cbiAgICAgICAgfVxuICAgICAgICBlbHNlIG91dCA9IHBvbHlnb24uc2xpY2UoKTtcblxuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IGNvdW50KVxuICAgICAgICB7XG5cbiAgICAgICAgICAgIGxlbiA9IG91dC5sZW5ndGggKiAwLjUgLTE7XG4gICAgICAgICAgICBpID0gLTE7XG4gICAgICAgICAgICB3aGlsZSgrK2kgPCBsZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaTIgPSBpICogMjtcbiAgICAgICAgICAgICAgICBpNCA9IChpICogMikgKiAyO1xuICAgICAgICAgICAgICAgIHggID0gb3V0W2k0XTtcbiAgICAgICAgICAgICAgICB5ICA9IG91dFtpNCArIDFdO1xuXG4gICAgICAgICAgICAgICAgaTIgPSBpMiArIDE7XG4gICAgICAgICAgICAgICAgaTQgPSBpMiAqIDI7XG4gICAgICAgICAgICAgICAgbXggPSB4ICsgKG91dFtpNCAgICBdIC0geCkgKiAwLjU7XG4gICAgICAgICAgICAgICAgbXkgPSB5ICsgKG91dFtpNCArIDFdIC0geSkgKiAwLjU7XG5cbiAgICAgICAgICAgICAgICBvdXQuc3BsaWNlKGk0LDAsbXgsbXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpMiA9IGkgICAqIDI7XG4gICAgICAgICAgICBpNCA9IGkyICogMjtcblxuICAgICAgICAgICAgeCAgPSBvdXRbaTRdO1xuICAgICAgICAgICAgeSAgPSBvdXRbaTQgKyAxXTtcbiAgICAgICAgICAgIG14ID0geCArIChvdXRbMF0gLSB4KSAqIDAuNTtcbiAgICAgICAgICAgIG15ID0geSArIChvdXRbMV0gLSB5KSAqIDAuNTtcblxuICAgICAgICAgICAgb3V0LnNwbGljZSgoaTIgKyAxKSAqIDIsMCxteCxteSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIG1ha2VTbW9vdGhlZExpbmVhciA6IGZ1bmN0aW9uKHBvbHlnb24sY291bnQsb3V0KVxuICAgIHtcbiAgICAgICAgY291bnQgPSBjb3VudCB8fCAxO1xuXG4gICAgICAgIHZhciBweCxweSxkeCxkeTtcblxuICAgICAgICB2YXIgaSwgaiwgaztcblxuICAgICAgICB2YXIgdGVtcCAgICA9IHBvbHlnb24uc2xpY2UoKSxcbiAgICAgICAgICAgIHRlbXBMZW4gPSB0ZW1wLmxlbmd0aDtcblxuICAgICAgICBpZihvdXQpb3V0Lmxlbmd0aCA9IHRlbXBMZW4gICogMjtcbiAgICAgICAgZWxzZSBvdXQgPSBuZXcgQXJyYXkodGVtcExlbiAgKiAyKTtcblxuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IGNvdW50KVxuICAgICAgICB7XG4gICAgICAgICAgICB0ZW1wTGVuICAgID0gdGVtcC5sZW5ndGg7XG4gICAgICAgICAgICBvdXQubGVuZ3RoID0gdGVtcExlbiAqIDI7XG5cbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgd2hpbGUoaSA8IHRlbXBMZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHggPSB0ZW1wW2kgICAgXTtcbiAgICAgICAgICAgICAgICBweSA9IHRlbXBbaSArIDFdIDtcbiAgICAgICAgICAgICAgICBrICA9IChpICsgMikgJSB0ZW1wTGVuO1xuICAgICAgICAgICAgICAgIGR4ID0gdGVtcFtrICAgIF0gLSBweDtcbiAgICAgICAgICAgICAgICBkeSA9IHRlbXBbayArIDFdIC0gcHk7XG5cbiAgICAgICAgICAgICAgICBrID0gaSAqIDI7XG4gICAgICAgICAgICAgICAgb3V0W2sgIF0gPSBweCArIGR4ICogMC4yNTtcbiAgICAgICAgICAgICAgICBvdXRbaysxXSA9IHB5ICsgZHkgKiAwLjI1O1xuICAgICAgICAgICAgICAgIG91dFtrKzJdID0gcHggKyBkeCAqIDAuNzU7XG4gICAgICAgICAgICAgICAgb3V0W2srM10gPSBweSArIGR5ICogMC43NTtcblxuICAgICAgICAgICAgICAgIGkrPTI7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGVtcCA9IG91dC5zbGljZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcblxuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBtYWtlT3B0SGVhZGluZyA6IGZ1bmN0aW9uKHBvbHlnb24sdG9sZXJhbmNlKVxuICAgIHtcbiAgICAgICAgaWYocG9seWdvbi5sZW5ndGggPCA0KXJldHVybiBwb2x5Z29uO1xuXG4gICAgICAgIHRvbGVyYW5jZSA9IHRvbGVyYW5jZSB8fCBmTWF0aC5FUFNJTE9OO1xuXG4gICAgICAgIHZhciB0ZW1wID0gW107XG5cbiAgICAgICAgdmFyIGxlbiA9IHBvbHlnb24ubGVuZ3RoIC8gMiAtIDE7XG5cbiAgICAgICAgdmFyIHB4ID0gcG9seWdvblswXSxcbiAgICAgICAgICAgIHB5ID0gcG9seWdvblsxXSxcbiAgICAgICAgICAgIHgsIHk7XG5cbiAgICAgICAgdmFyIHBoID0gTWF0aC5hdGFuMihwb2x5Z29uWzNdIC0gcHkscG9seWdvblsyXSAtIHB4KSxcbiAgICAgICAgICAgIGNoO1xuXG4gICAgICAgIHRlbXAucHVzaChweCxweSk7XG5cbiAgICAgICAgdmFyIGkgPSAwLGkyO1xuXG4gICAgICAgIHdoaWxlKCsraSA8IGxlbilcbiAgICAgICAge1xuICAgICAgICAgICAgaTIgPSBpICogMjtcbiAgICAgICAgICAgIHggPSBwb2x5Z29uW2kyICBdO1xuICAgICAgICAgICAgeSA9IHBvbHlnb25baTIrMV07XG5cbiAgICAgICAgICAgIGkyID0gKGkgKyAxKSAqIDI7XG4gICAgICAgICAgICBjaCA9IE1hdGguYXRhbjIocG9seWdvbltpMisxXSAtIHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9seWdvbltpMiAgXSAtIHgpO1xuXG4gICAgICAgICAgICBpZihNYXRoLmFicyhwaCAtIGNoKSA+IHRvbGVyYW5jZSl0ZW1wLnB1c2goeCx5KTtcblxuICAgICAgICAgICAgcHggPSB4O1xuICAgICAgICAgICAgcHkgPSB5O1xuICAgICAgICAgICAgcGggPSBjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHggPSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoIC0gMl07XG4gICAgICAgIHkgPSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgY2ggPSBNYXRoLmF0YW4yKHBvbHlnb25bMV0gLSB5LCBwb2x5Z29uWzBdIC0geCk7XG5cbiAgICAgICAgaWYoTWF0aC5hYnMocGggLSBjaCkgPiB0b2xlcmFuY2UpdGVtcC5wdXNoKHgseSk7XG5cbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfSxcblxuXG4gICAgbWFrZU9wdEVkZ2VMZW5ndGggOiBmdW5jdGlvbihwb2x5Z29uLGVkZ2VMZW5ndGgpXG4gICAge1xuICAgICAgICB2YXIgdGVtcCA9IFtdO1xuICAgICAgICB2YXIgbGVuICA9IHBvbHlnb24ubGVuZ3RoICogMC41IC0gMTtcblxuICAgICAgICB2YXIgZHgsZHk7XG4gICAgICAgIHZhciBweCxweTtcbiAgICAgICAgdmFyIHgsIHk7XG5cbiAgICAgICAgdmFyIGluZGV4O1xuXG4gICAgICAgIHZhciBlZGdlTGVuZ3RoU3EgPSBlZGdlTGVuZ3RoICogZWRnZUxlbmd0aDtcblxuICAgICAgICBweCA9IHBvbHlnb25bMF07XG4gICAgICAgIHB5ID0gcG9seWdvblsxXTtcblxuICAgICAgICB0ZW1wLnB1c2gocHgscHkpO1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHdoaWxlKCsraSA8IGxlbilcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXggPSBpICogMjtcblxuICAgICAgICAgICAgeCA9ICBwb2x5Z29uW2luZGV4ICBdO1xuICAgICAgICAgICAgeSA9ICBwb2x5Z29uW2luZGV4KzFdO1xuXG4gICAgICAgICAgICBkeCA9IHggLSBweDtcbiAgICAgICAgICAgIGR5ID0geSAtIHB5O1xuXG4gICAgICAgICAgICBpZigoZHggKiBkeCArIGR5ICogZHkpID49IGVkZ2VMZW5ndGhTcSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBweCA9IHg7XG4gICAgICAgICAgICAgICAgcHkgPSB5O1xuXG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKHgseSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB4ID0gcG9seWdvbltwb2x5Z29uLmxlbmd0aC0yXTtcbiAgICAgICAgeSA9IHBvbHlnb25bcG9seWdvbi5sZW5ndGgtMV07XG5cbiAgICAgICAgcHggPSBwb2x5Z29uWzBdO1xuICAgICAgICBweSA9IHBvbHlnb25bMV07XG5cbiAgICAgICAgZHggPSB4IC0gcHg7XG4gICAgICAgIGR5ID0geSAtIHB5O1xuXG4gICAgICAgIGlmKChkeCAqIGR4ICsgZHkgKiBkeSkgPj0gZWRnZUxlbmd0aFNxKXRlbXAucHVzaCh4LHkpO1xuXG4gICAgICAgIHJldHVybiB0ZW1wO1xuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIC8vaHR0cDovL2FsaWVucnlkZXJmbGV4LmNvbS9wb2x5Z29uX3BlcmltZXRlci9cbiAgICBtYWtlUGVyaW1ldGVyIDogZnVuY3Rpb24ocG9seWdvbixvdXQpXG4gICAge1xuICAgICAgICB2YXIgVFdPX1BJICAgPSBNYXRoLlBJICogMixcbiAgICAgICAgICAgIFBJICAgICAgID0gTWF0aC5QSTtcblxuICAgICAgICB2YXIgY29ybmVycyAgPSBwb2x5Z29uLmxlbmd0aCAqIDAuNTtcbiAgICAgICAgdmFyIE1BWF9TRUdTID0gY29ybmVycyAqIDQ7XG5cbiAgICAgICAgaWYoY29ybmVycyA+IE1BWF9TRUdTKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBvdXQubGVuZ3RoID0gMDtcblxuICAgICAgICB2YXIgc2VnUyA9IG5ldyBBcnJheShNQVhfU0VHUyAqIDIpLFxuICAgICAgICAgICAgc2VnRSA9IG5ldyBBcnJheShNQVhfU0VHUyAqIDIpLFxuICAgICAgICAgICAgc2VnQW5nbGUgICA9IG5ldyBBcnJheShNQVhfU0VHUyk7XG5cbiAgICAgICAgdmFyIGludGVyc2VjdHMgPSBuZXcgQXJyYXkoMiksXG4gICAgICAgICAgICBpbnRlcnNlY3RYLGludGVyc2VjdFk7XG5cbiAgICAgICAgdmFyIHN0YXJ0WCAgICA9IHBvbHlnb25bMF0sXG4gICAgICAgICAgICBzdGFydFkgICAgPSBwb2x5Z29uWzFdLFxuICAgICAgICAgICAgbGFzdEFuZ2xlID0gUEk7XG5cbiAgICAgICAgdmFyIGluZGV4aSxpbmRleGosXG4gICAgICAgICAgICBpbmRleFNlZyxpbmRleFNlZ2ksaW5kZXhTZWdqLFxuICAgICAgICAgICAgcGl4LHBpeSxwangscGp5O1xuXG4gICAgICAgIHZhciBhLCBiLCBjLCBkLCBlLCBmLFxuICAgICAgICAgICAgYW5nbGVEaWYsIGJlc3RBbmdsZURpZjtcblxuICAgICAgICB2YXIgaSwgaiA9IGNvcm5lcnMgLSAxLCBzZWdzID0gMDtcblxuICAgICAgICBpID0gLTE7XG4gICAgICAgIHdoaWxlKCsraSA8IGNvcm5lcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4aSA9IGkgKiAyO1xuICAgICAgICAgICAgaW5kZXhqID0gaiAqIDI7XG5cbiAgICAgICAgICAgIHBpeCA9IHBvbHlnb25baW5kZXhpICBdO1xuICAgICAgICAgICAgcGl5ID0gcG9seWdvbltpbmRleGkrMV07XG4gICAgICAgICAgICBwanggPSBwb2x5Z29uW2luZGV4aiAgXTtcbiAgICAgICAgICAgIHBqeSA9IHBvbHlnb25baW5kZXhqKzFdO1xuXG4gICAgICAgICAgICBpZiAocGl4ICE9IHBqeCB8fCBwaXkgIT0gcGp5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluZGV4U2VnID0gc2VncyAqIDI7XG5cbiAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnICBdID0gcGl4O1xuICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWcrMV0gPSBwaXk7XG4gICAgICAgICAgICAgICAgc2VnRVtpbmRleFNlZyAgXSA9IHBqeDtcbiAgICAgICAgICAgICAgICBzZWdFW2luZGV4U2VnKzFdID0gcGp5O1xuXG4gICAgICAgICAgICAgICAgc2VncysrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBqID0gaTtcblxuICAgICAgICAgICAgaWYgKHBpeSA+IHN0YXJ0WSB8fCBwaXkgPT0gc3RhcnRZICYmIHBpeCA8IHN0YXJ0WClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFydFggPSBwaXg7XG4gICAgICAgICAgICAgICAgc3RhcnRZID0gcGl5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlZ3MgPT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciBpc1NlZ21lbnRJbnRlcnNlY3Rpb25mID0gTGluZTJkVXRpbC5pc1NlZ21lbnRJbnRlcnNlY3Rpb25mO1xuXG4gICAgICAgIHZhciBzZWdTeGksc2VnU3lpLFxuICAgICAgICAgICAgc2VnU3hqLHNlZ1N5ajtcblxuICAgICAgICB2YXIgc2VnRXhpLHNlZ0V5aSxcbiAgICAgICAgICAgIHNlZ0V4aixzZWdFeWo7XG5cbiAgICAgICAgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2kgPCBzZWdzIC0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXhTZWdpID0gaSAqIDI7XG5cbiAgICAgICAgICAgIHNlZ1N4aSA9IHNlZ1NbaW5kZXhTZWdpICBdO1xuICAgICAgICAgICAgc2VnU3lpID0gc2VnU1tpbmRleFNlZ2krMV07XG4gICAgICAgICAgICBzZWdFeGkgPSBzZWdFW2luZGV4U2VnaSAgXTtcbiAgICAgICAgICAgIHNlZ0V5aSA9IHNlZ0VbaW5kZXhTZWdpKzFdO1xuXG4gICAgICAgICAgICBqID0gaTtcbiAgICAgICAgICAgIHdoaWxlKCsraiA8IHNlZ3MpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5kZXhTZWdqID0gaiAqIDI7XG5cbiAgICAgICAgICAgICAgICBzZWdTeGogPSBzZWdTW2luZGV4U2VnaiAgXTtcbiAgICAgICAgICAgICAgICBzZWdTeWogPSBzZWdTW2luZGV4U2VnaisxXTtcbiAgICAgICAgICAgICAgICBzZWdFeGogPSBzZWdFW2luZGV4U2VnaiAgXTtcbiAgICAgICAgICAgICAgICBzZWdFeWogPSBzZWdFW2luZGV4U2VnaisxXTtcblxuICAgICAgICAgICAgICAgIGlmIChpc1NlZ21lbnRJbnRlcnNlY3Rpb25mKFxuICAgICAgICAgICAgICAgICAgICBzZWdTeGksc2VnU3lpLHNlZ0V4aSxzZWdFeWksXG4gICAgICAgICAgICAgICAgICAgIHNlZ1N4aixzZWdTeWosc2VnRXhqLHNlZ0V5aixpbnRlcnNlY3RzKSlcbiAgICAgICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0WCA9IGludGVyc2VjdHNbMF07XG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFkgPSBpbnRlcnNlY3RzWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJzZWN0WCAhPSBzZWdTeGkgfHwgaW50ZXJzZWN0WSAhPSBzZWdTeWkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoaW50ZXJzZWN0WCAhPSBzZWdFeGkgfHwgaW50ZXJzZWN0WSAhPSBzZWdFeWkpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZWdzID09IE1BWF9TRUdTKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4U2VnID0gc2VncyAqIDI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWcgIF0gPSBzZWdTeGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnKzFdID0gc2VnU3lpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnRVtpbmRleFNlZyAgXSA9IGludGVyc2VjdFg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdFW2luZGV4U2VnKzFdID0gaW50ZXJzZWN0WTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VncysrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnaSAgXSA9IGludGVyc2VjdFg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnaSsxXSA9IGludGVyc2VjdFk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoKGludGVyc2VjdFggIT0gc2VnU3hqIHx8IGludGVyc2VjdFkgIT0gc2VnU3lqKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGludGVyc2VjdFggIT0gc2VnRXhqIHx8IGludGVyc2VjdFkgIT0gc2VnRXlqKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VncyA9PSBNQVhfU0VHUykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleFNlZyA9IHNlZ3MgKiAyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnICBdID0gc2VnU3hqO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZysxXSA9IHNlZ1N5ajtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VbaW5kZXhTZWcgIF0gPSBpbnRlcnNlY3RYO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnRVtpbmRleFNlZysxXSA9IGludGVyc2VjdFk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ3MrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZ2ogIF0gPSBpbnRlcnNlY3RYO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZ2orMV0gPSBpbnRlcnNlY3RZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgc2VnRGlmZngsXG4gICAgICAgICAgICBzZWdEaWZmeSxcbiAgICAgICAgICAgIHNlZ0xlbjtcblxuICAgICAgICBpID0gLTE7XG4gICAgICAgIHdoaWxlKCsraSA8IHNlZ3MpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4U2VnaSA9IGkgKiAyO1xuICAgICAgICAgICAgc2VnRGlmZnggPSBzZWdFW2luZGV4U2VnaSAgXSAtIHNlZ1NbaW5kZXhTZWdpICBdO1xuICAgICAgICAgICAgc2VnRGlmZnkgPSBzZWdFW2luZGV4U2VnaSsxXSAtIHNlZ1NbaW5kZXhTZWdpKzFdO1xuXG4gICAgICAgICAgICBzZWdMZW4gICA9IE1hdGguc3FydChzZWdEaWZmeCAqIHNlZ0RpZmZ4ICsgc2VnRGlmZnkgKiBzZWdEaWZmeSkgfHwgMTtcblxuICAgICAgICAgICAgc2VnQW5nbGVbaV0gPSAoc2VnRGlmZnkgPj0gMC4wKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmFjb3Moc2VnRGlmZngvc2VnTGVuKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChNYXRoLmFjb3MoLXNlZ0RpZmZ4L3NlZ0xlbikgKyBQSSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGMgPSBzdGFydFg7XG4gICAgICAgIGQgPSBzdGFydFk7XG4gICAgICAgIGEgPSBjIC0gMTtcbiAgICAgICAgYiA9IGQ7XG4gICAgICAgIGUgPSAwO1xuICAgICAgICBmID0gMDtcblxuICAgICAgICBjb3JuZXJzID0gMTtcblxuICAgICAgICBvdXQucHVzaChjLGQpO1xuXG4gICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICB7XG4gICAgICAgICAgICBiZXN0QW5nbGVEaWYgPSBUV09fUEk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZWdzOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5kZXhTZWdpID0gaSAqIDI7XG5cbiAgICAgICAgICAgICAgICBzZWdTeGkgPSBzZWdTW2luZGV4U2VnaSAgXTtcbiAgICAgICAgICAgICAgICBzZWdTeWkgPSBzZWdTW2luZGV4U2VnaSsxXTtcbiAgICAgICAgICAgICAgICBzZWdFeGkgPSBzZWdFW2luZGV4U2VnaSAgXTtcbiAgICAgICAgICAgICAgICBzZWdFeWkgPSBzZWdFW2luZGV4U2VnaSsxXTtcblxuXG4gICAgICAgICAgICAgICAgaWYgKHNlZ1N4aSA9PSBjICYmIHNlZ1N5aSA9PSBkICYmXG4gICAgICAgICAgICAgICAgICAgIChzZWdFeGkgIT1hIHx8IHNlZ0V5aSAhPSBiKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlRGlmID0gbGFzdEFuZ2xlIC0gc2VnQW5nbGVbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGFuZ2xlRGlmID49IFRXT19QSSkgYW5nbGVEaWYgLT0gVFdPX1BJO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYW5nbGVEaWYgPCAwICAgICAgKSBhbmdsZURpZiArPSBUV09fUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlRGlmIDwgYmVzdEFuZ2xlRGlmKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0QW5nbGVEaWYgPSBhbmdsZURpZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBzZWdFeGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gc2VnRXlpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWdFeGkgPT0gYyAmJiBzZWdFeWkgPT0gZCAmJlxuICAgICAgICAgICAgICAgICAgICAoc2VnU3hpICE9YSB8fCBzZWdTeWkgIT0gYikpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhbmdsZURpZiA9IGxhc3RBbmdsZSAtIHNlZ0FuZ2xlW2ldICsgUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGFuZ2xlRGlmID49IFRXT19QSSkgYW5nbGVEaWYgLT0gVFdPX1BJO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYW5nbGVEaWYgPCAgMCAgICAgKSBhbmdsZURpZiArPSBUV09fUEk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ2xlRGlmIDwgYmVzdEFuZ2xlRGlmKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0QW5nbGVEaWYgPSBhbmdsZURpZjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBzZWdTeGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gc2VnU3lpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29ybmVycyA+IDEgJiZcbiAgICAgICAgICAgICAgICBjID09IG91dFswXSAmJiBkID09IG91dFsxXSAmJlxuICAgICAgICAgICAgICAgIGUgPT0gb3V0WzJdICYmIGYgPT0gb3V0WzNdKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvcm5lcnMtLTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGJlc3RBbmdsZURpZiA9PSBUV09fUEkgfHxcbiAgICAgICAgICAgICAgICBjb3JuZXJzID09IE1BWF9TRUdTKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29ybmVycysrO1xuICAgICAgICAgICAgb3V0LnB1c2goZSxmKTtcblxuICAgICAgICAgICAgbGFzdEFuZ2xlIC09IGJlc3RBbmdsZURpZiArIFBJO1xuXG4gICAgICAgICAgICBhID0gYztcbiAgICAgICAgICAgIGIgPSBkO1xuICAgICAgICAgICAgYyA9IGU7XG4gICAgICAgICAgICBkID0gZjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIC8vaHR0cDovL2FsaWVucnlkZXJmbGV4LmNvbS9wb2x5Z29uX2luc2V0L1xuICAgIG1ha2VJbnNldCA6IGZ1bmN0aW9uKHBvbHlnb24sZGlzdGFuY2UpXG4gICAge1xuICAgICAgICBpZihwb2x5Z29uLmxlbmd0aCA8PSAyKXJldHVybiBudWxsO1xuXG4gICAgICAgIHZhciBudW0gPSBwb2x5Z29uLmxlbmd0aCAqIDAuNSAtIDE7XG5cbiAgICAgICAgdmFyIHN4ID0gcG9seWdvblswXSxcbiAgICAgICAgICAgIHN5ID0gcG9seWdvblsxXTtcblxuICAgICAgICB2YXIgYSwgYixcbiAgICAgICAgICAgIGMgPSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoIC0gMl0sXG4gICAgICAgICAgICBkID0gcG9seWdvbltwb2x5Z29uLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgZSA9IHN4LFxuICAgICAgICAgICAgZiA9IHN5O1xuXG4gICAgICAgIHZhciBpbmRleDAsaW5kZXgxO1xuXG4gICAgICAgIHZhciB0ZW1wID0gbmV3IEFycmF5KDIpO1xuXG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBudW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGEgPSBjO1xuICAgICAgICAgICAgYiA9IGQ7XG4gICAgICAgICAgICBjID0gZTtcbiAgICAgICAgICAgIGQgPSBmO1xuXG4gICAgICAgICAgICBpbmRleDAgPSBpICogMjtcbiAgICAgICAgICAgIGluZGV4MSA9IChpKzEpKjI7XG5cbiAgICAgICAgICAgIGUgPSBwb2x5Z29uW2luZGV4MSAgICBdO1xuICAgICAgICAgICAgZiA9IHBvbHlnb25baW5kZXgxICsgMV07XG5cbiAgICAgICAgICAgIHRlbXBbMF0gPSBwb2x5Z29uW2luZGV4MF07XG4gICAgICAgICAgICB0ZW1wWzFdID0gcG9seWdvbltpbmRleDAgKyAxXTtcblxuICAgICAgICAgICAgdGhpcy5tYWtlSW5zZXRDb3JuZXIoYSwgYiwgYywgZCwgZSwgZiwgZGlzdGFuY2UsIHRlbXApO1xuICAgICAgICAgICAgcG9seWdvbltpbmRleDAgICAgXSA9IHRlbXBbMF07XG4gICAgICAgICAgICBwb2x5Z29uW2luZGV4MCArIDFdID0gdGVtcFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4MCA9IGkgKiAyO1xuXG4gICAgICAgIHRlbXBbMF0gPSBwb2x5Z29uW2luZGV4MCAgICBdO1xuICAgICAgICB0ZW1wWzFdID0gcG9seWdvbltpbmRleDAgKyAxXTtcblxuICAgICAgICB0aGlzLm1ha2VJbnNldENvcm5lcihjLCBkLCBlLCBmLCBzeCwgc3ksIGRpc3RhbmNlLCB0ZW1wKTtcbiAgICAgICAgcG9seWdvbltpbmRleDAgICAgXSA9IHRlbXBbMF07XG4gICAgICAgIHBvbHlnb25baW5kZXgwICsgMV0gPSB0ZW1wWzFdO1xuXG4gICAgICAgIHJldHVybiBwb2x5Z29uO1xuICAgIH0sXG5cbiAgICBtYWtlSW5zZXRDb3JuZXIgOiBmdW5jdGlvbihhLGIsYyxkLGUsZixkaXN0YW5jZSxvdXQpXG4gICAge1xuICAgICAgICB2YXIgIGMxID0gYyxcbiAgICAgICAgICAgIGQxID0gZCxcbiAgICAgICAgICAgIGMyID0gYyxcbiAgICAgICAgICAgIGQyID0gZCxcbiAgICAgICAgICAgIGR4MSwgZHkxLCBkaXN0MSxcbiAgICAgICAgICAgIGR4MiwgZHkyLCBkaXN0MixcbiAgICAgICAgICAgIGluc2V0WCwgaW5zZXRZIDtcblxuICAgICAgICB2YXIgRVBTSUxPTiA9IDAuMDAwMTtcblxuICAgICAgICBkeDEgICA9IGMgLSBhO1xuICAgICAgICBkeTEgICA9IGQgLSBiO1xuICAgICAgICBkaXN0MSA9IE1hdGguc3FydChkeDEqZHgxK2R5MSpkeTEpO1xuXG4gICAgICAgIGR4MiAgID0gZSAtIGM7XG4gICAgICAgIGR5MiAgID0gZiAtIGQ7XG4gICAgICAgIGRpc3QyID0gTWF0aC5zcXJ0KGR4MipkeDIrZHkyKmR5Mik7XG5cbiAgICAgICAgaWYoZGlzdDEgPCBFUFNJTE9OIHx8IGRpc3QyICA8IEVQU0lMT04pcmV0dXJuO1xuXG4gICAgICAgIGRpc3QxID0gMS4wIC8gZGlzdDE7XG4gICAgICAgIGRpc3QyID0gMS4wIC8gZGlzdDI7XG5cbiAgICAgICAgaW5zZXRYID0gZHkxICogZGlzdDEgKiBkaXN0YW5jZTtcbiAgICAgICAgYSAgICAgKz0gaW5zZXRYO1xuICAgICAgICBjMSAgICArPSBpbnNldFg7XG5cbiAgICAgICAgaW5zZXRZID0tZHgxICogZGlzdDEgKiBkaXN0YW5jZTtcbiAgICAgICAgYiAgICAgKz0gaW5zZXRZO1xuICAgICAgICBkMSAgICArPSBpbnNldFk7XG5cbiAgICAgICAgaW5zZXRYID0gZHkyICogZGlzdDIgKiBkaXN0YW5jZTtcbiAgICAgICAgZSAgICAgKz0gaW5zZXRYO1xuICAgICAgICBjMiAgICArPSBpbnNldFg7XG5cbiAgICAgICAgaW5zZXRZID0tZHgyICogZGlzdDIgKiBkaXN0YW5jZTtcbiAgICAgICAgZiAgICAgKz0gaW5zZXRZO1xuICAgICAgICBkMiAgICArPSBpbnNldFk7XG5cbiAgICAgICAgaWYgKGMxID09IGMyICYmIGQxPT1kMilcbiAgICAgICAge1xuICAgICAgICAgICAgb3V0WzBdID0gYzE7XG4gICAgICAgICAgICBvdXRbMV0gPSBkMTtcbiAgICAgICAgICAgIHJldHVybjsgfVxuXG4gICAgICAgIHZhciB0ZW1wID0gbmV3IEFycmF5KDIpO1xuXG4gICAgICAgIGlmIChMaW5lMmRVdGlsLmlzSW50ZXJzZWN0aW9uZihhLGIsYzEsZDEsYzIsZDIsZSxmLHRlbXApKVxuICAgICAgICB7XG4gICAgICAgICAgICBvdXRbMF0gPSB0ZW1wWzBdO1xuICAgICAgICAgICAgb3V0WzFdID0gdGVtcFsxXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBpc1BvaW50SW5Qb2x5Z29uIDogZnVuY3Rpb24oeCx5LHBvaW50cylcbiAgICB7XG4gICAgICAgIHZhciB3biA9IDA7XG4gICAgICAgIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoIC8gMjtcblxuICAgICAgICB2YXIgaW5kZXgwLFxuICAgICAgICAgICAgaW5kZXgxO1xuXG5cbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpIDwgbGVuIC0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXgwID0gaSAqIDI7XG4gICAgICAgICAgICBpbmRleDEgPSAoaSArIDEpICogMjtcblxuICAgICAgICAgICAgaWYocG9pbnRzW2luZGV4MCsxXSA8PSB5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKHBvaW50c1tpbmRleDErMV0gPiB5KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoTGluZTJkVXRpbC5pc1BvaW50TGVmdChwb2ludHNbaW5kZXgwXSxwb2ludHNbaW5kZXgwICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MV0scG9pbnRzW2luZGV4MSArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgseSk+MCkrK3duO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZihwb2ludHNbaW5kZXgxKzFdIDw9IHkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZihMaW5lMmRVdGlsLmlzUG9pbnRMZWZ0KHBvaW50c1tpbmRleDBdLHBvaW50c1tpbmRleDAgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgxXSxwb2ludHNbaW5kZXgxICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCx5KTwwKS0td247XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd247XG5cbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICBtYWtlVmVydGljZXNSZXZlcnNlZCA6IGZ1bmN0aW9uKHBvbHlnb24peyByZXR1cm4gcG9seWdvbi5yZXZlcnNlKCk7fSxcblxuXG4gICAgbWFrZVBvbHlnb24zZEZsb2F0MzIgOiBmdW5jdGlvbihwb2x5Z29uLHNjYWxlKVxuICAgIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG5cbiAgICAgICAgdmFyIHBvbHlMZW4gPSBwb2x5Z29uLmxlbmd0aCAqIDAuNSxcbiAgICAgICAgICAgIG91dCAgICAgPSBuZXcgRmxvYXQzMkFycmF5KHBvbHlMZW4gKiAzKTtcbiAgICAgICAgdmFyIGluZGV4MCxpbmRleDE7XG5cbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpIDwgcG9seUxlbilcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXgwID0gaSAqIDM7XG4gICAgICAgICAgICBpbmRleDEgPSBpICogMjtcblxuICAgICAgICAgICAgb3V0W2luZGV4MCAgXSA9IHBvbHlnb25baW5kZXgxICBdICogc2NhbGU7XG4gICAgICAgICAgICBvdXRbaW5kZXgwKzFdID0gMC4wO1xuICAgICAgICAgICAgb3V0W2luZGV4MCsyXSA9IHBvbHlnb25baW5kZXgxKzFdICogc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qXG4gICAgLy9TdXRoZXJsYW5kLUhvZGdtYW5cbiAgICBtYWtlQ2xpcHBpbmdTSCA6IGZ1bmN0aW9uKHBvbHlnb24sY2xpcHBpbmdQb2x5Z29uKVxuICAgIHtcbiAgICAgICAgdmFyIGxlbjAgPSBwb2x5Z29uLmxlbmd0aCAqIDAuNSxcbiAgICAgICAgICAgIGxlbjEgPSBjbGlwcGluZ1BvbHlnb24ubGVuZ3RoIDtcblxuXG4gICAgICAgIHZhciBMaW5lMmRVdGlsID0gRm9hbS5MaW5lMmRVdGlsO1xuXG4gICAgICAgIHZhciBvdXQgPSBbXTtcblxuICAgICAgICB2YXIgY2xpcEVkZ2VTeCxjbGlwRWRnZVN5LFxuICAgICAgICAgICAgY2xpcEVkZ2VFeCxjbGlwRWRnZUV5O1xuXG4gICAgICAgIHZhciBwb2x5RWRnZVN4LCBwb2x5RWRnZVN5LFxuICAgICAgICAgICAgcG9seUVkZ2VFeCwgcG9seUVkZ2VFeTtcblxuICAgICAgICB2YXIgcG9seVZlcnRJc09uTGVmdDtcblxuICAgICAgICBjb25zb2xlLmxvZyhjbGlwcGluZ1BvbHlnb24pO1xuXG4gICAgICAgIHZhciBpLCBqO1xuXG4gICAgICAgIHZhciBpMiwgajIsIGk0O1xuXG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZShpIDwgbGVuMSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2xpcEVkZ2VTeCA9IGNsaXBwaW5nUG9seWdvbltpICBdO1xuICAgICAgICAgICAgY2xpcEVkZ2VTeSA9IGNsaXBwaW5nUG9seWdvbltpKzFdO1xuXG4gICAgICAgICAgICBpMiA9IChpICsgMikgJSBsZW4xO1xuICAgICAgICAgICAgY2xpcEVkZ2VFeCA9IGNsaXBwaW5nUG9seWdvbltpMl07XG4gICAgICAgICAgICBjbGlwRWRnZUV5ID0gY2xpcHBpbmdQb2x5Z29uW2kyKzFdO1xuXG5cbiAgICAgICAgICAgIGkrPTI7XG4gICAgICAgIH1cbiAgICAgICAvLyB3aGlsZSgrK2kgPClcblxuXG5cbiAgICAgICAgcmV0dXJuIG91dDtcblxuICAgIH0sXG5cbiAgICBtYWtlQ2xpcHBpbmdWIDogZnVuY3Rpb24ocG9seWdvbixjbGlwcGluZ1BvbHlnb24pXG4gICAge1xuXG4gICAgfSxcblxuICAgIG1ha2VTY2FuRmlsbCA6IGZ1bmN0aW9uKHBvbHlnb24pXG4gICAge1xuXG4gICAgfVxuXG4gICAgKi9cblxuXG5cblxufTsiLCJ2YXIgZk1hdGggPSByZXF1aXJlKCcuLi9tYXRoL2ZNYXRoJyksXG4gICAgVmVjMyAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMzJyksXG4gICAgTWF0NDQgPSByZXF1aXJlKCcuLi9tYXRoL2ZNYXQ0NCcpO1xuXG4vL1RPRE86IEFkZCBjbG9zZSwgc21vb3RoIGluIG91dCBpbnRycGwsIHByZSBwb3N0IHBvaW50c1xuZnVuY3Rpb24gU3BsaW5lKClcbntcbiAgICB0aGlzLnBvaW50cyAgICAgPSBudWxsO1xuICAgIHRoaXMudmVydGljZXMgICA9IG51bGw7XG5cbiAgICB0aGlzLl9kZXRhaWwgICAgPSAyMDtcbiAgICB0aGlzLl90ZW5zaW9uICAgPSAwO1xuICAgIHRoaXMuX2JpYXMgICAgICA9IDA7XG4gICAgdGhpcy5fbnVtUG9pbnRzID0gbnVsbDtcbiAgICB0aGlzLl9udW1WZXJ0cyAgPSBudWxsO1xuXG4gICAgdGhpcy5fdGVtcFZlYzAgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdGVtcFZlYzEgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdGVtcE1hdDAgID0gTWF0NDQubWFrZSgpO1xuICAgIHRoaXMuX3RlbXBNYXQxICA9IE1hdDQ0Lm1ha2UoKTtcbiAgICB0aGlzLl90ZW1wTWF0MiAgPSBNYXQ0NC5tYWtlKCk7XG5cbiAgICB0aGlzLl9heGlzWSAgICAgPSBWZWMzLkFYSVNfWSgpO1xufTtcblxuU3BsaW5lLnByb3RvdHlwZS5zZXRQb2ludDNmID0gZnVuY3Rpb24oaW5kZXgseCx5LHopXG57XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgaW5kZXgqPTM7XG4gICAgcG9pbnRzW2luZGV4ICBdID0geDtcbiAgICBwb2ludHNbaW5kZXgrMV0gPSB5O1xuICAgIHBvaW50c1tpbmRleCsyXSA9IHo7XG59O1xuXG5TcGxpbmUucHJvdG90eXBlLnNldFBvaW50cyA9ICBmdW5jdGlvbihhcnIpXG57XG4gICAgdmFyIG51bSAgICAgICAgID0gdGhpcy5fbnVtUG9pbnRzID0gYXJyLmxlbmd0aCAvIDMsXG4gICAgICAgIG51bVZlcnRzICAgID0gdGhpcy5fbnVtVmVydHMgID0gKG51bSAtIDEpICogKHRoaXMuX2RldGFpbCAtIDEpICsgMTtcblxuICAgIHRoaXMucG9pbnRzICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoYXJyKTtcbiAgICB0aGlzLnZlcnRpY2VzICAgPSBuZXcgRmxvYXQzMkFycmF5KG51bVZlcnRzICogMyk7XG59O1xuXG5TcGxpbmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgZGV0YWlsICAgID0gdGhpcy5fZGV0YWlsLFxuICAgICAgICBkZXRhaWxfMSAgPSBkZXRhaWwgLSAxLFxuICAgICAgICBwb2ludHMgICAgPSB0aGlzLnBvaW50cyxcbiAgICAgICAgbnVtUG9pbnRzID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICB2ZXJ0aWNlcyAgPSB0aGlzLnZlcnRpY2VzO1xuXG4gICAgdmFyIHRlbnNpb24gICAgICAgPSB0aGlzLl90ZW5zaW9uLFxuICAgICAgICBiaWFzICAgICAgICAgID0gdGhpcy5fYmlhcyxcbiAgICAgICAgaGVybWl0ZUludHJwbCA9IGZNYXRoLmhlcm1pdGVJbnRycGw7XG5cbiAgICB2YXIgaSwgaiwgdDtcbiAgICB2YXIgbGVuID0gbnVtUG9pbnRzIC0gMTtcblxuICAgIHZhciBpbmRleCxpbmRleF8xLGluZGV4MSxpbmRleDIsXG4gICAgICAgIHZlcnRJbmRleDtcblxuICAgIHZhciB4LCB5LCB6O1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IGxlbilcbiAgICB7XG4gICAgICAgIGluZGV4ICAgID0gaTtcblxuICAgICAgICBpbmRleDEgICA9IE1hdGgubWluKChpbmRleCArIDEpLGxlbikgKiAzO1xuICAgICAgICBpbmRleDIgICA9IE1hdGgubWluKChpbmRleCArIDIpLGxlbikgKiAzO1xuICAgICAgICBpbmRleF8xICA9IE1hdGgubWF4KDAsKGluZGV4IC0gMSkpICAgKiAzO1xuICAgICAgICBpbmRleCAgICo9IDM7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBkZXRhaWxfMSlcbiAgICAgICAge1xuICAgICAgICAgICAgdCA9IGogLyBkZXRhaWxfMTtcblxuICAgICAgICAgICAgeCA9IGhlcm1pdGVJbnRycGwocG9pbnRzW2luZGV4XzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4ICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MSBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MiBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx0ZW5zaW9uLGJpYXMpO1xuXG4gICAgICAgICAgICB5ID0gaGVybWl0ZUludHJwbChwb2ludHNbaW5kZXhfMSArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4ICAgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDEgICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgyICArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx0ZW5zaW9uLGJpYXMpO1xuXG4gICAgICAgICAgICB6ID0gaGVybWl0ZUludHJwbChwb2ludHNbaW5kZXhfMSArIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4ICAgKyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDEgICsgMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgyICArIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx0ZW5zaW9uLGJpYXMpO1xuXG4gICAgICAgICAgICB2ZXJ0SW5kZXggPSAoaSAqIGRldGFpbF8xICsgaikgKiAzO1xuXG4gICAgICAgICAgICB2ZXJ0aWNlc1t2ZXJ0SW5kZXggIF0gPSB4O1xuICAgICAgICAgICAgdmVydGljZXNbdmVydEluZGV4KzFdID0geTtcbiAgICAgICAgICAgIHZlcnRpY2VzW3ZlcnRJbmRleCsyXSA9IHo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdmVydExlbiAgID0gdmVydGljZXMubGVuZ3RoLFxuICAgICAgICBwb2ludHNMZW4gPSBwb2ludHMubGVuZ3RoO1xuXG4gICAgdmVydGljZXNbdmVydExlbi0zXSA9IHBvaW50c1twb2ludHNMZW4tM107XG4gICAgdmVydGljZXNbdmVydExlbi0yXSA9IHBvaW50c1twb2ludHNMZW4tMl07XG4gICAgdmVydGljZXNbdmVydExlbi0xXSA9IHBvaW50c1twb2ludHNMZW4tMV07XG5cbn07XG5cblNwbGluZS5wcm90b3R5cGUuc2V0RGV0YWlsICA9IGZ1bmN0aW9uKGRldGFpbCkge3RoaXMuX2RldGFpbCAgPSBkZXRhaWw7fTtcblNwbGluZS5wcm90b3R5cGUuc2V0VGVuc2lvbiA9IGZ1bmN0aW9uKHRlbnNpb24pe3RoaXMuX3RlbnNpb24gPSB0ZW5zaW9uO307XG5TcGxpbmUucHJvdG90eXBlLnNldEJpYXMgICAgPSBmdW5jdGlvbihiaWFzKSAgIHt0aGlzLl9iaWFzICAgID0gYmlhczt9O1xuXG5TcGxpbmUucHJvdG90eXBlLmdldE51bVBvaW50cyAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbnVtUG9pbnRzO307XG5TcGxpbmUucHJvdG90eXBlLmdldE51bVZlcnRpY2VzID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbnVtVmVydHM7fTtcblxuU3BsaW5lLnByb3RvdHlwZS5nZXRWZWMzT25Qb2ludHMgPSBmdW5jdGlvbih2YWwsb3V0KVxue1xuICAgIG91dCA9IG91dCB8fCB0aGlzLl90ZW1wVmVjMDtcblxuICAgIHZhciBwb2ludHMgICAgPSB0aGlzLnBvaW50cyxcbiAgICAgICAgbnVtUG9pbnRzID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICBsZW4gICAgICAgPSBudW1Qb2ludHMgLSAxO1xuXG4gICAgdmFyIGluZGV4ICA9IE1hdGguZmxvb3IobnVtUG9pbnRzICogdmFsKSxcbiAgICAgICAgaW5kZXgxID0gTWF0aC5taW4oaW5kZXggKyAxLCBsZW4pO1xuXG4gICAgICAgIGluZGV4ICo9IDM7XG4gICAgICAgIGluZGV4MSo9IDM7XG5cbiAgICB2YXIgbG9jYWxJbnRycGwgICAgPSAodmFsICUgKDEgLyBudW1Qb2ludHMpKSAqIG51bVBvaW50cyxcbiAgICAgICAgbG9jYWxJbnRycGxJbnYgPSAxLjAgLSBsb2NhbEludHJwbDtcblxuICAgIG91dFswXSA9IHBvaW50c1tpbmRleCAgXSAqIGxvY2FsSW50cnBsSW52ICsgcG9pbnRzW2luZGV4MSAgXSAqIGxvY2FsSW50cnBsO1xuICAgIG91dFsxXSA9IHBvaW50c1tpbmRleCsxXSAqIGxvY2FsSW50cnBsSW52ICsgcG9pbnRzW2luZGV4MSsxXSAqIGxvY2FsSW50cnBsO1xuICAgIG91dFsyXSA9IHBvaW50c1tpbmRleCsyXSAqIGxvY2FsSW50cnBsSW52ICsgcG9pbnRzW2luZGV4MSsyXSAqIGxvY2FsSW50cnBsO1xuXG4gICAgcmV0dXJuIG91dDtcblxufTtcblxuU3BsaW5lLnByb3RvdHlwZS5nZXRWZWMzT25TcGxpbmUgPSBmdW5jdGlvbih2YWwsb3V0KVxue1xuICAgIG91dCA9IG91dCB8fCB0aGlzLl90ZW1wVmVjMDtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXMsXG4gICAgICAgIG51bVZlcnRzID0gdGhpcy5fbnVtVmVydHMsXG4gICAgICAgIGxlbiAgICAgID0gbnVtVmVydHMgLSAxO1xuXG4gICAgdmFyIGluZGV4ICA9IE1hdGgubWluKE1hdGguZmxvb3IobnVtVmVydHMgKiB2YWwpLGxlbiksXG4gICAgICAgIGluZGV4MSA9IE1hdGgubWluKGluZGV4ICsgMSxsZW4pO1xuXG4gICAgdmFyIGxvY2FsSW50cnBsICAgID0gKHZhbCAlICgxLjAgLyBudW1WZXJ0cykpICogbnVtVmVydHMsXG4gICAgICAgIGxvY2FsSW50cnBsSW52ID0gMS4wIC0gbG9jYWxJbnRycGw7XG5cbiAgICBpbmRleCAgKj0gMztcbiAgICBpbmRleDEgKj0gMztcblxuICAgIG91dFswXSA9IHZlcnRpY2VzW2luZGV4ICBdICogbG9jYWxJbnRycGxJbnYgKyB2ZXJ0aWNlc1tpbmRleDEgIF0gKiBsb2NhbEludHJwbDtcbiAgICBvdXRbMV0gPSB2ZXJ0aWNlc1tpbmRleCsxXSAqIGxvY2FsSW50cnBsSW52ICsgdmVydGljZXNbaW5kZXgxKzFdICogbG9jYWxJbnRycGw7XG4gICAgb3V0WzJdID0gdmVydGljZXNbaW5kZXgrMl0gKiBsb2NhbEludHJwbEludiArIHZlcnRpY2VzW2luZGV4MSsyXSAqIGxvY2FsSW50cnBsO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cblxuXG4vL2htXG5TcGxpbmUucHJvdG90eXBlLmdldFBvaW50c0xpbmVMZW5ndGhTcSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgcG9pbnRzICAgID0gdGhpcy5wb2ludHM7XG5cbiAgICB2YXIgZHggPSAwLFxuICAgICAgICBkeSA9IDAsXG4gICAgICAgIGR6ID0gMDtcblxuICAgIHZhciBpID0gcG9pbnRzLmxlbmd0aDtcbiAgICB3aGlsZShpID4gNilcbiAgICB7XG4gICAgICAgIGR4ICs9IHBvaW50c1tpLTNdIC0gcG9pbnRzW2ktNl07XG4gICAgICAgIGR5ICs9IHBvaW50c1tpLTJdIC0gcG9pbnRzW2ktNV07XG4gICAgICAgIGR6ICs9IHBvaW50c1tpLTFdIC0gcG9pbnRzW2ktNF07XG5cbiAgICAgICAgaS09MztcbiAgICB9XG5cbiAgICByZXR1cm4gZHgqZHgrZHkqZHkrZHoqZHo7XG5cbn07XG5cblNwbGluZS5wcm90b3R5cGUuZ2V0U3BsaW5lTGluZUxlbmd0aFNxID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG5cbiAgICB2YXIgZHggPSAwLFxuICAgICAgICBkeSA9IDAsXG4gICAgICAgIGR6ID0gMDtcblxuICAgIHZhciBpID0gdmVydGljZXMubGVuZ3RoO1xuICAgIHdoaWxlKGkgPiA2KVxuICAgIHtcbiAgICAgICAgZHggKz0gdmVydGljZXNbaS0zXSAtIHZlcnRpY2VzW2ktNl07XG4gICAgICAgIGR5ICs9IHZlcnRpY2VzW2ktMl0gLSB2ZXJ0aWNlc1tpLTVdO1xuICAgICAgICBkeiArPSB2ZXJ0aWNlc1tpLTFdIC0gdmVydGljZXNbaS00XTtcblxuICAgICAgICBpLT0zO1xuICAgIH1cblxuICAgIHJldHVybiBkeCpkeCtkeSpkeStkeipkejtcbn07XG5cblNwbGluZS5wcm90b3R5cGUuZ2V0UG9pbnRzTGluZUxlbmd0aCA9IGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguc3FydCh0aGlzLmdldFBvaW50c0xpbmVMZW5ndGhTcSgpKTt9O1xuU3BsaW5lLnByb3RvdHlwZS5nZXRTcGxpbmVQb2ludHNMZW5ndGggPSBmdW5jdGlvbigpe3JldHVybiBNYXRoLnNxcnQodGhpcy5nZXRTcGxpbmVMaW5lTGVuZ3RoU3EoKSl9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwbGluZTtcblxuXG4iLCJ2YXIgVmVjMyAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMzJyksXG4gICAgTWF0NDQgPSByZXF1aXJlKCcuLi9tYXRoL2ZNYXQ0NCcpLFxuICAgIE1hdEdMID0gcmVxdWlyZSgnLi9nbC9mTWF0R0wnKTtcblxuZnVuY3Rpb24gQ2FtZXJhQmFzaWMoKVxue1xuICAgIHRoaXMucG9zaXRpb24gPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl90YXJnZXQgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdXAgICAgICA9IFZlYzMuQVhJU19ZKCk7XG5cbiAgICB0aGlzLl9mb3YgID0gMDtcbiAgICB0aGlzLl9uZWFyID0gMDtcbiAgICB0aGlzLl9mYXIgID0gMDtcblxuICAgIHRoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IDA7XG5cbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkICA9IGZhbHNlO1xuICAgIHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnByb2plY3Rpb25NYXRyaXggPSBNYXQ0NC5tYWtlKCk7XG4gICAgdGhpcy5tb2RlbFZpZXdNYXRyaXggID0gTWF0NDQubWFrZSgpO1xufVxuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbihmb3Ysd2luZG93QXNwZWN0UmF0aW8sbmVhcixmYXIpXG57XG4gICAgdGhpcy5fZm92ICA9IGZvdjtcbiAgICB0aGlzLl9uZWFyID0gbmVhcjtcbiAgICB0aGlzLl9mYXIgID0gZmFyO1xuXG4gICAgdGhpcy5fYXNwZWN0UmF0aW9MYXN0ID0gd2luZG93QXNwZWN0UmF0aW87XG5cbiAgICB0aGlzLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbn07XG5cblxuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0VGFyZ2V0ICAgICAgICAgPSBmdW5jdGlvbih2KSAgICB7VmVjMy5zZXQodGhpcy5fdGFyZ2V0LHYpO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFRhcmdldDNmICAgICAgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5fdGFyZ2V0LHgseSx6KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRQb3NpdGlvbiAgICAgICA9IGZ1bmN0aW9uKHYpICAgIHtWZWMzLnNldCh0aGlzLnBvc2l0aW9uLHYpO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFBvc2l0aW9uM2YgICAgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5wb3NpdGlvbix4LHkseik7dGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0VXAgICAgICAgICAgICAgPSBmdW5jdGlvbih2KSAgICB7VmVjMy5zZXQodGhpcy5fdXAsdik7dGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0VXAzZiAgICAgICAgICAgPSBmdW5jdGlvbih4LHkseil7IFZlYzMuc2V0M2YodGhpcy5fdXAseCx5LHopO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0TmVhciAgICAgICAgICAgPSBmdW5jdGlvbihuZWFyKSAgICAgICB7dGhpcy5fbmVhciA9IG5lYXI7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldEZhciAgICAgICAgICAgID0gZnVuY3Rpb24oZmFyKSAgICAgICAge3RoaXMuX2ZhciAgPSBmYXI7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldEZvdiAgICAgICAgICAgID0gZnVuY3Rpb24oZm92KSAgICAgICAge3RoaXMuX2ZvdiAgPSBmb3Y7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldEFzcGVjdFJhdGlvICAgID0gZnVuY3Rpb24oYXNwZWN0UmF0aW8pe3RoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IGFzcGVjdFJhdGlvO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnVwZGF0ZU1vZGVsVmlld01hdHJpeCAgID0gZnVuY3Rpb24oKXtpZih0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkKXJldHVybjtNYXRHTC5sb29rQXQodGhpcy5tb2RlbFZpZXdNYXRyaXgsdGhpcy5wb3NpdGlvbix0aGlzLl90YXJnZXQsdGhpcy5fdXApOyB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gdHJ1ZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnVwZGF0ZVByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbigpe2lmKHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkKXJldHVybjtNYXRHTC5wZXJzcGVjdGl2ZSh0aGlzLnByb2plY3Rpb25NYXRyaXgsdGhpcy5fZm92LHRoaXMuX2FzcGVjdFJhdGlvTGFzdCx0aGlzLl9uZWFyLHRoaXMuX2Zhcik7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSB0cnVlO307XG5cbkNhbWVyYUJhc2ljLnByb3RvdHlwZS51cGRhdGVNYXRyaWNlcyA9IGZ1bmN0aW9uKCl7dGhpcy51cGRhdGVNb2RlbFZpZXdNYXRyaXgoKTt0aGlzLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTt9O1xuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpe3JldHVybiAne3Bvc2l0aW9uPSAnICsgVmVjMy50b1N0cmluZyh0aGlzLnBvc2l0aW9uKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsIHRhcmdldD0gJyArIFZlYzMudG9TdHJpbmcodGhpcy5fdGFyZ2V0KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsIHVwPSAnICAgICArIFZlYzMudG9TdHJpbmcodGhpcy5fdXApICsgJ30nfTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFCYXNpYztcblxuXG4iLCJ2YXIgZkVycm9yICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9mRXJyb3InKSxcbiAgICBQcm9nVmVydGV4U2hhZGVyID0gcmVxdWlyZSgnLi9nbC9zaGFkZXIvZlByb2dWZXJ0ZXhTaGFkZXInKSxcbiAgICBQcm9nRnJhZ1NoYWRlciAgID0gcmVxdWlyZSgnLi9nbC9zaGFkZXIvZlByb2dGcmFnU2hhZGVyJyksXG4gICAgUHJvZ0xvYWRlciAgICAgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2ZQcm9nTG9hZGVyJyksXG4gICAgU2hhZGVyTG9hZGVyICAgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2ZTaGFkZXJMb2FkZXInKSxcbiAgICBQbGF0Zm9ybSAgICAgICAgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2ZQbGF0Zm9ybScpLFxuICAgIFZlYzIgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMyJyksXG4gICAgVmVjMyAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL21hdGgvZlZlYzMnKSxcbiAgICBWZWM0ICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vbWF0aC9mVmVjNCcpLFxuICAgIE1hdDMzICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZNYXQzMycpLFxuICAgIE1hdDQ0ICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZNYXQ0NCcpLFxuICAgIENvbG9yICAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2ZDb2xvcicpLFxuICAgIFRleHR1cmUgICAgICAgICAgPSByZXF1aXJlKCcuL2dsL2ZUZXh0dXJlJyk7XG5cblxuZnVuY3Rpb24gRkdMKGNvbnRleHQzZCxjb250ZXh0MmQpXG57XG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEluaXRcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB2YXIgZ2wgPSB0aGlzLmdsID0gY29udGV4dDNkO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIGNyZWF0ZSBzaGFkZXJzL3Byb2dyYW0gKyBiaW5kXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLypcbiAgICB2YXIgcHJvZ1ZlcnRleFNoYWRlciA9IFNoYWRlckxvYWRlci5sb2FkU2hhZGVyRnJvbVN0cmluZyhnbCwgUHJvZ1ZlcnRleFNoYWRlciwgZ2wuVkVSVEVYX1NIQURFUiksXG4gICAgICAgIHByb2dGcmFnU2hhZGVyICAgPSBTaGFkZXJMb2FkZXIubG9hZFNoYWRlckZyb21TdHJpbmcoZ2wsICgoUGxhdGZvcm0uZ2V0VGFyZ2V0KCkgPT0gUGxhdGZvcm0uV0VCKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaGFkZXJMb2FkZXIuUHJlZml4U2hhZGVyV2ViIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb2dGcmFnU2hhZGVyLCBnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG5cblxuICAgIHZhciBwcm9ncmFtU2NlbmUgPSAgUHJvZ0xvYWRlci5sb2FkUHJvZ3JhbShnbCxwcm9nVmVydGV4U2hhZGVyLHByb2dGcmFnU2hhZGVyKTtcbiAgICAqL1xuXG5cblxuICAgIHZhciBwbGF0Zm9ybSA9IFBsYXRmb3JtLmdldFRhcmdldCgpO1xuXG4gICAgdmFyIHByb2dyYW1TY2VuZSA9IHRoaXMuX3Byb2dyYW1TY2VuZSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHZhciBwcm9nVmVydFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKSxcbiAgICAgICAgcHJvZ0ZyYWdTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIGdsLnNoYWRlclNvdXJjZShwcm9nVmVydFNoYWRlciwgUHJvZ1ZlcnRleFNoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihwcm9nVmVydFNoYWRlcik7XG5cbiAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHByb2dWZXJ0U2hhZGVyLGdsLkNPTVBJTEVfU1RBVFVTKSlcbiAgICAgICAgdGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhwcm9nVmVydFNoYWRlcik7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UocHJvZ0ZyYWdTaGFkZXIsICgocGxhdGZvcm0gPT0gUGxhdGZvcm0uV0VCKSA/IFNoYWRlckxvYWRlci5QcmVmaXhTaGFkZXJXZWIgOiAnJykgKyBQcm9nRnJhZ1NoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihwcm9nRnJhZ1NoYWRlcik7XG5cbiAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHByb2dGcmFnU2hhZGVyLGdsLkNPTVBJTEVfU1RBVFVTKSlcbiAgICAgICAgdGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhwcm9nRnJhZ1NoYWRlcik7XG5cbiAgICBnbC5iaW5kQXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLDAsJ2FWZXJ0ZXhQb3NpdGlvbicpO1xuXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1TY2VuZSwgcHJvZ1ZlcnRTaGFkZXIpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtU2NlbmUsIHByb2dGcmFnU2hhZGVyKTtcbiAgICBnbC5saW5rUHJvZ3JhbSggcHJvZ3JhbVNjZW5lKTtcblxuICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1TY2VuZSxnbC5MSU5LX1NUQVRVUykpXG4gICAgICAgIHRocm93IGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1TY2VuZSk7XG5cbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW1TY2VuZSk7XG5cblxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEJpbmQgJiBlbmFibGUgc2hhZGVyIGF0dHJpYnV0ZXMgJiB1bmlmb3Jtc1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgdGhpcy5fYVZlcnRleFBvc2l0aW9uICAgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtU2NlbmUsJ2FWZXJ0ZXhQb3NpdGlvbicpO1xuICAgIHRoaXMuX2FWZXJ0ZXhOb3JtYWwgICAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCdhVmVydGV4Tm9ybWFsJyk7XG4gICAgdGhpcy5fYVZlcnRleENvbG9yICAgICAgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtU2NlbmUsJ2FWZXJ0ZXhDb2xvcicpO1xuICAgIHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCdhVmVydGV4VGV4Q29vcmQnKTtcblxuICAgIHRoaXMuX3VNb2RlbFZpZXdNYXRyaXggID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1vZGVsVmlld01hdHJpeCcpO1xuICAgIHRoaXMuX3VQcm9qZWN0aW9uTWF0cml4ID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndVByb2plY3Rpb25NYXRyaXgnKTtcbiAgICB0aGlzLl91Tm9ybWFsTWF0cml4ICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VOb3JtYWxNYXRyaXgnKTtcbiAgICB0aGlzLl91VGV4SW1hZ2UgICAgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VUZXhJbWFnZScpO1xuXG4gICAgdGhpcy5fdVBvaW50U2l6ZSAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1UG9pbnRTaXplJyk7XG5cbiAgICB0aGlzLl91VXNlTGlnaHRpbmcgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VVc2VMaWdodGluZycpO1xuICAgIHRoaXMuX3VVc2VNYXRlcmlhbCAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndVVzZU1hdGVyaWFsJyk7XG4gICAgdGhpcy5fdVVzZVRleHR1cmUgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1VXNlVGV4dHVyZScpO1xuXG4gICAgdGhpcy5fdUFtYmllbnQgICAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1QW1iaWVudCcpO1xuXG5cbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4UG9zaXRpb24pO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhDb2xvcik7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBTZXQgU2hhZGVyIGluaXRpYWwgdmFsdWVzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICB0aGlzLkxJR0hUXzAgICAgPSAwO1xuICAgIHRoaXMuTElHSFRfMSAgICA9IDE7XG4gICAgdGhpcy5MSUdIVF8yICAgID0gMjtcbiAgICB0aGlzLkxJR0hUXzMgICAgPSAzO1xuICAgIHRoaXMuTElHSFRfNCAgICA9IDQ7XG4gICAgdGhpcy5MSUdIVF81ICAgID0gNTtcbiAgICB0aGlzLkxJR0hUXzYgICAgPSA2O1xuICAgIHRoaXMuTElHSFRfNyAgICA9IDc7XG4gICAgdGhpcy5NQVhfTElHSFRTID0gODtcblxuICAgIHRoaXMuTU9ERUxfUEhPTkcgICAgICAgPSAwO1xuICAgIHRoaXMuTU9ERUxfQU5USVNPUFRSSUMgPSAxO1xuICAgIHRoaXMuTU9ERUxfRlJFU05FTCAgICAgPSAyO1xuICAgIHRoaXMuTU9ERUxfQkxJTk4gICAgICAgPSAzO1xuICAgIHRoaXMuTU9ERUxfRkxBVCAgICAgICAgPSA0O1xuXG5cblxuXG4gICAgdmFyIGwgPSB0aGlzLk1BWF9MSUdIVFM7XG5cblxuXG4gICAgdmFyIHVMaWdodFBvc2l0aW9uICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0UG9zaXRpb24gICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEFtYmllbnQgICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0QW1iaWVudCAgICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodERpZmZ1c2UgICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0RGlmZnVzZSAgICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodFNwZWN1bGFyICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0U3BlY3VsYXIgICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uQ29uc3RhbnQgID0gdGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25Db25zdGFudCAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uTGluZWFyICAgID0gdGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXIgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljID0gdGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWMgPSBuZXcgQXJyYXkobCk7XG5cbiAgICB2YXIgbGlnaHQ7XG5cbiAgICB2YXIgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IGwpXG4gICAge1xuICAgICAgICBsaWdodCA9ICd1TGlnaHRzWycraSsnXS4nO1xuXG5cbiAgICAgICAgdUxpZ2h0UG9zaXRpb25baV0gICAgICAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLGxpZ2h0ICsgJ3Bvc2l0aW9uJyk7XG4gICAgICAgIHVMaWdodEFtYmllbnRbaV0gICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdhbWJpZW50Jyk7XG4gICAgICAgIHVMaWdodERpZmZ1c2VbaV0gICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdkaWZmdXNlJyk7XG4gICAgICAgIHVMaWdodFNwZWN1bGFyW2ldICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdzcGVjdWxhcicpO1xuXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaV0gID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdjb25zdGFudEF0dGVudWF0aW9uJyk7XG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uTGluZWFyW2ldICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdsaW5lYXJBdHRlbnVhdGlvbicpO1xuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvblF1YWRyYXRpY1tpXSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAncXVhZHJhdGljQXR0ZW51YXRpb24nKTtcblxuICAgICAgICBnbC51bmlmb3JtNGZ2KHVMaWdodFBvc2l0aW9uW2ldLCBuZXcgRmxvYXQzMkFycmF5KFswLDAsMCwwXSkpO1xuICAgICAgICBnbC51bmlmb3JtM2Z2KHVMaWdodEFtYmllbnRbaV0sICBuZXcgRmxvYXQzMkFycmF5KFswLDAsMF0pKTtcbiAgICAgICAgZ2wudW5pZm9ybTNmdih1TGlnaHREaWZmdXNlW2ldLCAgbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKSk7XG5cbiAgICAgICAgZ2wudW5pZm9ybTFmKHVMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaV0sIDEuMCk7XG4gICAgICAgIGdsLnVuaWZvcm0xZih1TGlnaHRBdHRlbnVhdGlvbkxpbmVhcltpXSwgICAwLjApO1xuICAgICAgICBnbC51bmlmb3JtMWYodUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWNbaV0sMC4wKTtcbiAgICB9XG5cbiAgICB0aGlzLl91TWF0ZXJpYWxFbWlzc2lvbiAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1TWF0ZXJpYWwuZW1pc3Npb24nKTtcbiAgICB0aGlzLl91TWF0ZXJpYWxBbWJpZW50ICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1TWF0ZXJpYWwuYW1iaWVudCcpO1xuICAgIHRoaXMuX3VNYXRlcmlhbERpZmZ1c2UgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VNYXRlcmlhbC5kaWZmdXNlJyk7XG4gICAgdGhpcy5fdU1hdGVyaWFsU3BlY3VsYXIgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1hdGVyaWFsLnNwZWN1bGFyJyk7XG4gICAgdGhpcy5fdU1hdGVyaWFsU2hpbmluZXNzID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1hdGVyaWFsLnNoaW5pbmVzcycpO1xuXG4gICAgZ2wudW5pZm9ybTRmKHRoaXMuX3VNYXRlcmlhbEVtaXNzaW9uLCAwLjAsMC4wLDAuMCwxLjApO1xuICAgIGdsLnVuaWZvcm00Zih0aGlzLl91TWF0ZXJpYWxBbWJpZW50LCAgMS4wLDAuNSwwLjUsMS4wKTtcbiAgICBnbC51bmlmb3JtNGYodGhpcy5fdU1hdGVyaWFsRGlmZnVzZSwgIDAuMCwwLjAsMC4wLDEuMCk7XG4gICAgZ2wudW5pZm9ybTRmKHRoaXMuX3VNYXRlcmlhbFNwZWN1bGFyLCAwLjAsMC4wLDAuMCwxLjApO1xuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91TWF0ZXJpYWxTaGluaW5lc3MsMTAuMCk7XG5cblxuICAgIHRoaXMuX3RlbXBMaWdodFBvcyA9IFZlYzQubWFrZSgpO1xuXG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VNYXRlcmlhbCwgMC4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdVVzZUxpZ2h0aW5nLCAwLjApO1xuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91VXNlTWF0ZXJpYWwsIDAuMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VQb2ludFNpemUsICAgMS4wKTtcblxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEJpbmQgY29uc3RhbnRzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5BQ1RJVkVfQVRUUklCVVRFUz0gMzU3MjE7IHRoaXMuQUNUSVZFX1RFWFRVUkU9IDM0MDE2OyB0aGlzLkFDVElWRV9VTklGT1JNUz0gMzU3MTg7IHRoaXMuQUxJQVNFRF9MSU5FX1dJRFRIX1JBTkdFPSAzMzkwMjsgdGhpcy5BTElBU0VEX1BPSU5UX1NJWkVfUkFOR0U9IDMzOTAxOyB0aGlzLkFMUEhBPSA2NDA2OyB0aGlzLkFMUEhBX0JJVFM9IDM0MTM7IHRoaXMuQUxXQVlTPSA1MTkgOyB0aGlzLkFSUkFZX0JVRkZFUj0gMzQ5NjIgOyB0aGlzLkFSUkFZX0JVRkZFUl9CSU5ESU5HPSAzNDk2NCA7IHRoaXMuQVRUQUNIRURfU0hBREVSUz0gMzU3MTcgOyB0aGlzLkJBQ0s9IDEwMjkgOyB0aGlzLkJMRU5EPSAzMDQyIDsgdGhpcy5CTEVORF9DT0xPUj0gMzI3NzMgOyB0aGlzLkJMRU5EX0RTVF9BTFBIQT0gMzI5NzAgOyB0aGlzLkJMRU5EX0RTVF9SR0I9IDMyOTY4IDsgdGhpcy5CTEVORF9FUVVBVElPTj0gMzI3NzcgOyB0aGlzLkJMRU5EX0VRVUFUSU9OX0FMUEhBPSAzNDg3NyA7IHRoaXMuQkxFTkRfRVFVQVRJT05fUkdCPSAzMjc3NyA7IHRoaXMuQkxFTkRfU1JDX0FMUEhBPSAzMjk3MSA7IHRoaXMuQkxFTkRfU1JDX1JHQj0gMzI5NjkgOyB0aGlzLkJMVUVfQklUUz0gMzQxMiA7IHRoaXMuQk9PTD0gMzU2NzAgOyB0aGlzLkJPT0xfVkVDMj0gMzU2NzEgOyB0aGlzLkJPT0xfVkVDMz0gMzU2NzIgOyB0aGlzLkJPT0xfVkVDND0gMzU2NzMgOyB0aGlzLkJST1dTRVJfREVGQVVMVF9XRUJHTD0gMzc0NDQgOyB0aGlzLkJVRkZFUl9TSVpFPSAzNDY2MCA7IHRoaXMuQlVGRkVSX1VTQUdFPSAzNDY2MSA7IHRoaXMuQllURT0gNTEyMCA7IHRoaXMuQ0NXPSAyMzA1IDsgdGhpcy5DTEFNUF9UT19FREdFPSAzMzA3MSA7IHRoaXMuQ09MT1JfQVRUQUNITUVOVDA9IDM2MDY0IDsgdGhpcy5DT0xPUl9CVUZGRVJfQklUPSAxNjM4NCA7IHRoaXMuQ09MT1JfQ0xFQVJfVkFMVUU9IDMxMDYgOyB0aGlzLkNPTE9SX1dSSVRFTUFTSz0gMzEwNyA7IHRoaXMuQ09NUElMRV9TVEFUVVM9IDM1NzEzIDsgdGhpcy5DT01QUkVTU0VEX1RFWFRVUkVfRk9STUFUUz0gMzQ0NjcgOyB0aGlzLkNPTlNUQU5UX0FMUEhBPSAzMjc3MSA7IHRoaXMuQ09OU1RBTlRfQ09MT1I9IDMyNzY5IDsgdGhpcy5DT05URVhUX0xPU1RfV0VCR0w9IDM3NDQyIDsgdGhpcy5DVUxMX0ZBQ0U9IDI4ODQgOyB0aGlzLkNVTExfRkFDRV9NT0RFPSAyODg1IDsgdGhpcy5DVVJSRU5UX1BST0dSQU09IDM1NzI1IDsgdGhpcy5DVVJSRU5UX1ZFUlRFWF9BVFRSSUI9IDM0MzQyIDsgdGhpcy5DVz0gMjMwNCA7IHRoaXMuREVDUj0gNzY4MyA7IHRoaXMuREVDUl9XUkFQPSAzNDA1NiA7IHRoaXMuREVMRVRFX1NUQVRVUz0gMzU3MTIgOyB0aGlzLkRFUFRIX0FUVEFDSE1FTlQ9IDM2MDk2IDsgdGhpcy5ERVBUSF9CSVRTPSAzNDE0IDsgdGhpcy5ERVBUSF9CVUZGRVJfQklUPSAyNTYgOyB0aGlzLkRFUFRIX0NMRUFSX1ZBTFVFPSAyOTMxIDsgdGhpcy5ERVBUSF9DT01QT05FTlQ9IDY0MDIgOyB0aGlzLkRFUFRIX0NPTVBPTkVOVDE2PSAzMzE4OSA7IHRoaXMuREVQVEhfRlVOQz0gMjkzMiA7IHRoaXMuREVQVEhfUkFOR0U9IDI5MjggOyB0aGlzLkRFUFRIX1NURU5DSUw9IDM0MDQxIDsgdGhpcy5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQ9IDMzMzA2IDsgdGhpcy5ERVBUSF9URVNUPSAyOTI5IDsgdGhpcy5ERVBUSF9XUklURU1BU0s9IDI5MzAgOyB0aGlzLkRJVEhFUj0gMzAyNCA7IHRoaXMuRE9OVF9DQVJFPSA0MzUyIDsgdGhpcy5EU1RfQUxQSEE9IDc3MiA7IHRoaXMuRFNUX0NPTE9SPSA3NzQgOyB0aGlzLkRZTkFNSUNfRFJBVz0gMzUwNDggOyB0aGlzLkVMRU1FTlRfQVJSQVlfQlVGRkVSPSAzNDk2MyA7IHRoaXMuRUxFTUVOVF9BUlJBWV9CVUZGRVJfQklORElORz0gMzQ5NjUgOyB0aGlzLkVRVUFMPSA1MTQgOyB0aGlzLkZBU1RFU1Q9IDQzNTMgOyB0aGlzLkZMT0FUPSA1MTI2IDsgdGhpcy5GTE9BVF9NQVQyPSAzNTY3NCA7IHRoaXMuRkxPQVRfTUFUMz0gMzU2NzUgOyB0aGlzLkZMT0FUX01BVDQ9IDM1Njc2IDsgdGhpcy5GTE9BVF9WRUMyPSAzNTY2NCA7IHRoaXMuRkxPQVRfVkVDMz0gMzU2NjUgOyB0aGlzLkZMT0FUX1ZFQzQ9IDM1NjY2IDsgdGhpcy5GUkFHTUVOVF9TSEFERVI9IDM1NjMyIDsgdGhpcy5GUkFNRUJVRkZFUj0gMzYxNjAgOyB0aGlzLkZSQU1FQlVGRkVSX0FUVEFDSE1FTlRfT0JKRUNUX05BTUU9IDM2MDQ5IDsgdGhpcy5GUkFNRUJVRkZFUl9BVFRBQ0hNRU5UX09CSkVDVF9UWVBFPSAzNjA0OCA7IHRoaXMuRlJBTUVCVUZGRVJfQVRUQUNITUVOVF9URVhUVVJFX0NVQkVfTUFQX0ZBQ0U9IDM2MDUxIDsgdGhpcy5GUkFNRUJVRkZFUl9BVFRBQ0hNRU5UX1RFWFRVUkVfTEVWRUw9IDM2MDUwIDsgdGhpcy5GUkFNRUJVRkZFUl9CSU5ESU5HPSAzNjAwNiA7IHRoaXMuRlJBTUVCVUZGRVJfQ09NUExFVEU9IDM2MDUzIDsgdGhpcy5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0FUVEFDSE1FTlQ9IDM2MDU0IDsgdGhpcy5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0RJTUVOU0lPTlM9IDM2MDU3IDsgdGhpcy5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX01JU1NJTkdfQVRUQUNITUVOVD0gMzYwNTUgOyB0aGlzLkZSQU1FQlVGRkVSX1VOU1VQUE9SVEVEPSAzNjA2MSA7IHRoaXMuRlJPTlQ9IDEwMjggOyB0aGlzLkZST05UX0FORF9CQUNLPSAxMDMyIDsgdGhpcy5GUk9OVF9GQUNFPSAyODg2IDsgdGhpcy5GVU5DX0FERD0gMzI3NzQgOyB0aGlzLkZVTkNfUkVWRVJTRV9TVUJUUkFDVD0gMzI3NzkgOyB0aGlzLkZVTkNfU1VCVFJBQ1Q9IDMyNzc4IDsgdGhpcy5HRU5FUkFURV9NSVBNQVBfSElOVD0gMzMxNzAgOyB0aGlzLkdFUVVBTD0gNTE4IDsgdGhpcy5HUkVBVEVSPSA1MTYgOyB0aGlzLkdSRUVOX0JJVFM9IDM0MTEgOyB0aGlzLkhJR0hfRkxPQVQ9IDM2MzM4IDsgdGhpcy5ISUdIX0lOVD0gMzYzNDEgOyB0aGlzLklOQ1I9IDc2ODIgOyB0aGlzLklOQ1JfV1JBUD0gMzQwNTUgOyB0aGlzLklOVD0gNTEyNCA7IHRoaXMuSU5UX1ZFQzI9IDM1NjY3IDsgdGhpcy5JTlRfVkVDMz0gMzU2NjggOyB0aGlzLklOVF9WRUM0PSAzNTY2OSA7IHRoaXMuSU5WQUxJRF9FTlVNPSAxMjgwIDsgdGhpcy5JTlZBTElEX0ZSQU1FQlVGRkVSX09QRVJBVElPTj0gMTI4NiA7IHRoaXMuSU5WQUxJRF9PUEVSQVRJT049IDEyODIgOyB0aGlzLklOVkFMSURfVkFMVUU9IDEyODEgOyB0aGlzLklOVkVSVD0gNTM4NiA7IHRoaXMuS0VFUD0gNzY4MCA7IHRoaXMuTEVRVUFMPSA1MTUgOyB0aGlzLkxFU1M9IDUxMyA7IHRoaXMuTElORUFSPSA5NzI5IDsgdGhpcy5MSU5FQVJfTUlQTUFQX0xJTkVBUj0gOTk4NyA7IHRoaXMuTElORUFSX01JUE1BUF9ORUFSRVNUPSA5OTg1IDsgdGhpcy5MSU5FUz0gMSA7IHRoaXMuTElORV9MT09QPSAyIDsgdGhpcy5MSU5FX1NUUklQPSAzIDsgdGhpcy5MSU5FX1dJRFRIPSAyODQ5OyB0aGlzLkxJTktfU1RBVFVTPSAzNTcxNDsgdGhpcy5MT1dfRkxPQVQ9IDM2MzM2IDsgdGhpcy5MT1dfSU5UPSAzNjMzOSA7IHRoaXMuTFVNSU5BTkNFPSA2NDA5IDsgdGhpcy5MVU1JTkFOQ0VfQUxQSEE9IDY0MTA7IHRoaXMuTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFM9IDM1NjYxIDsgdGhpcy5NQVhfQ1VCRV9NQVBfVEVYVFVSRV9TSVpFPSAzNDA3NiA7IHRoaXMuTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUz0gMzYzNDkgOyB0aGlzLk1BWF9SRU5ERVJCVUZGRVJfU0laRT0gMzQwMjQgOyB0aGlzLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTPSAzNDkzMCA7IHRoaXMuTUFYX1RFWFRVUkVfU0laRT0gMzM3OSA7IHRoaXMuIE1BWF9WQVJZSU5HX1ZFQ1RPUlM9IDM2MzQ4IDsgdGhpcy5NQVhfVkVSVEVYX0FUVFJJQlM9IDM0OTIxIDsgdGhpcy5NQVhfVkVSVEVYX1RFWFRVUkVfSU1BR0VfVU5JVFM9IDM1NjYwIDsgdGhpcy5NQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUz0gMzYzNDcgOyB0aGlzLk1BWF9WSUVXUE9SVF9ESU1TPSAzMzg2IDsgdGhpcy5NRURJVU1fRkxPQVQ9IDM2MzM3IDsgdGhpcy5NRURJVU1fSU5UPSAzNjM0MCA7IHRoaXMuTUlSUk9SRURfUkVQRUFUPSAzMzY0OCA7IHRoaXMuTkVBUkVTVD0gOTcyOCA7IHRoaXMuTkVBUkVTVF9NSVBNQVBfTElORUFSPSA5OTg2IDsgdGhpcy5ORUFSRVNUX01JUE1BUF9ORUFSRVNUPSA5OTg0IDsgdGhpcy5ORVZFUj0gNTEyIDsgdGhpcy5OSUNFU1Q9IDQzNTQgOyB0aGlzLk5PTkU9IDAgOyB0aGlzLk5PVEVRVUFMPSA1MTcgOyB0aGlzLk5PX0VSUk9SPSAwIDsgdGhpcy5PTkU9IDEgOyB0aGlzLk9ORV9NSU5VU19DT05TVEFOVF9BTFBIQT0gMzI3NzIgOyB0aGlzLk9ORV9NSU5VU19DT05TVEFOVF9DT0xPUj0gMzI3NzAgOyB0aGlzLk9ORV9NSU5VU19EU1RfQUxQSEE9IDc3MyA7IHRoaXMuT05FX01JTlVTX0RTVF9DT0xPUj0gNzc1IDsgdGhpcy5PTkVfTUlOVVNfU1JDX0FMUEhBPSA3NzEgOyB0aGlzLk9ORV9NSU5VU19TUkNfQ09MT1I9IDc2OSA7IHRoaXMuT1VUX09GX01FTU9SWT0gMTI4NSA7IHRoaXMuUEFDS19BTElHTk1FTlQ9IDMzMzMgOyB0aGlzLlBPSU5UUz0gMCA7IHRoaXMuUE9MWUdPTl9PRkZTRVRfRkFDVE9SPSAzMjgyNCA7IHRoaXMuUE9MWUdPTl9PRkZTRVRfRklMTD0gMzI4MjMgOyB0aGlzLlBPTFlHT05fT0ZGU0VUX1VOSVRTPSAxMDc1MiA7IHRoaXMuUkVEX0JJVFM9IDM0MTAgOyB0aGlzLlJFTkRFUkJVRkZFUj0gMzYxNjEgOyB0aGlzLlJFTkRFUkJVRkZFUl9BTFBIQV9TSVpFPSAzNjE3OSA7IHRoaXMuUkVOREVSQlVGRkVSX0JJTkRJTkc9IDM2MDA3IDsgdGhpcy5SRU5ERVJCVUZGRVJfQkxVRV9TSVpFPSAzNjE3OCA7IHRoaXMuUkVOREVSQlVGRkVSX0RFUFRIX1NJWkU9IDM2MTgwIDsgdGhpcy5SRU5ERVJCVUZGRVJfR1JFRU5fU0laRT0gMzYxNzcgOyB0aGlzLlJFTkRFUkJVRkZFUl9IRUlHSFQ9IDM2MTYzIDsgdGhpcy5SRU5ERVJCVUZGRVJfSU5URVJOQUxfRk9STUFUPSAzNjE2NCA7IHRoaXMuUkVOREVSQlVGRkVSX1JFRF9TSVpFPSAzNjE3NiA7IHRoaXMuUkVOREVSQlVGRkVSX1NURU5DSUxfU0laRT0gMzYxODEgOyB0aGlzLlJFTkRFUkJVRkZFUl9XSURUSD0gMzYxNjIgOyB0aGlzLlJFTkRFUkVSPSA3OTM3IDsgdGhpcy5SRVBFQVQ9IDEwNDk3IDsgdGhpcy5SRVBMQUNFPSA3NjgxIDsgdGhpcy5SR0I9IDY0MDcgOyB0aGlzLlJHQjVfQTE9IDMyODU1IDsgdGhpcy5SR0I1NjU9IDM2MTk0IDsgdGhpcy5SR0JBPSA2NDA4IDsgdGhpcy5SR0JBND0gMzI4NTQgOyB0aGlzLlNBTVBMRVJfMkQ9IDM1Njc4IDsgdGhpcy5TQU1QTEVSX0NVQkU9IDM1NjgwIDsgdGhpcy5TQU1QTEVTPSAzMjkzNyA7IHRoaXMuU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFPSAzMjkyNiA7IHRoaXMuU0FNUExFX0JVRkZFUlM9IDMyOTM2IDsgdGhpcy5TQU1QTEVfQ09WRVJBR0U9IDMyOTI4IDsgdGhpcy5TQU1QTEVfQ09WRVJBR0VfSU5WRVJUPSAzMjkzOSA7IHRoaXMuU0FNUExFX0NPVkVSQUdFX1ZBTFVFPSAzMjkzOCA7IHRoaXMuU0NJU1NPUl9CT1g9IDMwODggOyB0aGlzLlNDSVNTT1JfVEVTVD0gMzA4OSA7IHRoaXMuU0hBREVSX1RZUEU9IDM1NjYzIDsgdGhpcy5TSEFESU5HX0xBTkdVQUdFX1ZFUlNJT049IDM1NzI0IDsgdGhpcy5TSE9SVD0gNTEyMiA7IHRoaXMuU1JDX0FMUEhBPSA3NzAgOyB0aGlzLlNSQ19BTFBIQV9TQVRVUkFURT0gNzc2IDsgdGhpcy5TUkNfQ09MT1I9IDc2OCA7IHRoaXMuU1RBVElDX0RSQVc9IDM1MDQ0IDsgdGhpcy5TVEVOQ0lMX0FUVEFDSE1FTlQ9IDM2MTI4IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfRkFJTD0gMzQ4MTcgOyB0aGlzLlNURU5DSUxfQkFDS19GVU5DPSAzNDgxNiA7IHRoaXMuU1RFTkNJTF9CQUNLX1BBU1NfREVQVEhfRkFJTD0gMzQ4MTggOyB0aGlzLlNURU5DSUxfQkFDS19QQVNTX0RFUFRIX1BBU1M9IDM0ODE5IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfUkVGPSAzNjAwMyA7IHRoaXMuU1RFTkNJTF9CQUNLX1ZBTFVFX01BU0s9IDM2MDA0IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfV1JJVEVNQVNLPSAzNjAwNSA7IHRoaXMuU1RFTkNJTF9CSVRTPSAzNDE1IDsgdGhpcy5TVEVOQ0lMX0JVRkZFUl9CSVQ9IDEwMjQgOyB0aGlzLlNURU5DSUxfQ0xFQVJfVkFMVUU9IDI5NjEgOyB0aGlzLlNURU5DSUxfRkFJTD0gMjk2NCA7IHRoaXMuU1RFTkNJTF9GVU5DPSAyOTYyIDsgdGhpcy5TVEVOQ0lMX0lOREVYPSA2NDAxIDsgdGhpcy5TVEVOQ0lMX0lOREVYOD0gMzYxNjggOyB0aGlzLlNURU5DSUxfUEFTU19ERVBUSF9GQUlMPSAyOTY1IDsgdGhpcy5TVEVOQ0lMX1BBU1NfREVQVEhfUEFTUz0gMjk2NiA7IHRoaXMuU1RFTkNJTF9SRUY9IDI5NjcgOyB0aGlzLlNURU5DSUxfVEVTVD0gMjk2MCA7IHRoaXMuU1RFTkNJTF9WQUxVRV9NQVNLPSAyOTYzIDsgdGhpcy5TVEVOQ0lMX1dSSVRFTUFTSz0gMjk2OCA7IHRoaXMuU1RSRUFNX0RSQVc9IDM1MDQwIDsgdGhpcy5TVUJQSVhFTF9CSVRTPSAzNDA4IDsgdGhpcy5URVhUVVJFPSA1ODkwIDsgdGhpcy5URVhUVVJFMD0gMzM5ODQgOyB0aGlzLlRFWFRVUkUxPSAzMzk4NSA7IHRoaXMuVEVYVFVSRTI9IDMzOTg2IDsgdGhpcy5URVhUVVJFMz0gMzM5ODcgOyB0aGlzLlRFWFRVUkU0PSAzMzk4OCA7IHRoaXMuVEVYVFVSRTU9IDMzOTg5IDsgdGhpcy5URVhUVVJFNj0gMzM5OTAgOyB0aGlzLlRFWFRVUkU3PSAzMzk5MSA7IHRoaXMuVEVYVFVSRTg9IDMzOTkyIDsgdGhpcy5URVhUVVJFOT0gMzM5OTMgOyB0aGlzLlRFWFRVUkUxMD0gMzM5OTQgOyB0aGlzLlRFWFRVUkUxMT0gMzM5OTUgOyB0aGlzLlRFWFRVUkUxMj0gMzM5OTYgOyB0aGlzLlRFWFRVUkUxMz0gMzM5OTcgOyB0aGlzLlRFWFRVUkUxND0gMzM5OTggOyB0aGlzLlRFWFRVUkUxNT0gMzM5OTkgOyB0aGlzLlRFWFRVUkUxNj0gMzQwMDAgOyB0aGlzLlRFWFRVUkUxNz0gMzQwMDEgOyB0aGlzLlRFWFRVUkUxOD0gMzQwMDIgOyB0aGlzLlRFWFRVUkUxOT0gMzQwMDMgOyB0aGlzLlRFWFRVUkUyMD0gMzQwMDQgOyB0aGlzLlRFWFRVUkUyMT0gMzQwMDUgOyB0aGlzLlRFWFRVUkUyMj0gMzQwMDYgOyB0aGlzLlRFWFRVUkUyMz0gMzQwMDcgOyB0aGlzLlRFWFRVUkUyND0gMzQwMDggOyB0aGlzLlRFWFRVUkUyNT0gMzQwMDkgOyB0aGlzLlRFWFRVUkUyNj0gMzQwMTAgOyB0aGlzLlRFWFRVUkUyNz0gMzQwMTEgOyB0aGlzLlRFWFRVUkUyOD0gMzQwMTIgOyB0aGlzLlRFWFRVUkUyOT0gMzQwMTMgOyB0aGlzLlRFWFRVUkUzMD0gMzQwMTQgOyB0aGlzLlRFWFRVUkUzMT0gMzQwMTUgOyB0aGlzLlRFWFRVUkVfMkQ9IDM1NTMgOyB0aGlzLlRFWFRVUkVfQklORElOR18yRD0gMzI4NzMgOyB0aGlzLlRFWFRVUkVfQklORElOR19DVUJFX01BUD0gMzQwNjggOyB0aGlzLlRFWFRVUkVfQ1VCRV9NQVA9IDM0MDY3IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1g9IDM0MDcwIDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1k9IDM0MDcyIDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1o9IDM0MDc0IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1g9IDM0MDY5IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1k9IDM0MDcxIDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1o9IDM0MDczIDsgdGhpcy5URVhUVVJFX01BR19GSUxURVI9IDEwMjQwIDsgdGhpcy5URVhUVVJFX01JTl9GSUxURVI9IDEwMjQxIDsgdGhpcy5URVhUVVJFX1dSQVBfUz0gMTAyNDIgOyB0aGlzLlRFWFRVUkVfV1JBUF9UPSAxMDI0MyA7IHRoaXMuVFJJQU5HTEVTPSA0IDsgdGhpcy5UUklBTkdMRV9GQU49IDYgOyB0aGlzLlRSSUFOR0xFX1NUUklQPSA1IDsgdGhpcy5VTlBBQ0tfQUxJR05NRU5UPSAzMzE3IDsgdGhpcy5VTlBBQ0tfQ09MT1JTUEFDRV9DT05WRVJTSU9OX1dFQkdMPSAzNzQ0MyA7IHRoaXMuVU5QQUNLX0ZMSVBfWV9XRUJHTD0gMzc0NDAgOyB0aGlzLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTD0gMzc0NDEgOyB0aGlzLlVOU0lHTkVEX0JZVEU9IDUxMjEgOyB0aGlzLlVOU0lHTkVEX0lOVD0gNTEyNSA7IHRoaXMuVU5TSUdORURfU0hPUlQ9IDUxMjMgOyB0aGlzLlVOU0lHTkVEX1NIT1JUXzRfNF80XzQ9IDMyODE5IDsgdGhpcy5VTlNJR05FRF9TSE9SVF81XzVfNV8xPSAzMjgyMCA7IHRoaXMuVU5TSUdORURfU0hPUlRfNV82XzU9IDMzNjM1IDsgdGhpcy5WQUxJREFURV9TVEFUVVM9IDM1NzE1IDsgdGhpcy5WRU5ET1I9IDc5MzYgOyB0aGlzLlZFUlNJT049IDc5MzggOyB0aGlzLlZFUlRFWF9BVFRSSUJfQVJSQVlfQlVGRkVSX0JJTkRJTkc9IDM0OTc1IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX0VOQUJMRUQ9IDM0MzM4IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX05PUk1BTElaRUQ9IDM0OTIyIDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1BPSU5URVI9IDM0MzczIDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1NJWkU9IDM0MzM5IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1NUUklERT0gMzQzNDAgOyB0aGlzLlZFUlRFWF9BVFRSSUJfQVJSQVlfVFlQRT0gMzQzNDEgOyB0aGlzLlZFUlRFWF9TSEFERVI9IDM1NjMzIDsgdGhpcy5WSUVXUE9SVD0gMjk3OCA7IHRoaXMuWkVSTyA9IDAgO1xuXG5cbiAgICB2YXIgU0laRV9PRl9WRVJURVggICAgPSBWZWMzLlNJWkUsXG4gICAgICAgIFNJWkVfT0ZfQ09MT1IgICAgID0gQ29sb3IuU0laRSxcbiAgICAgICAgU0laRV9PRl9URVhfQ09PUkQgPSBWZWMyLlNJWkU7XG5cbiAgICB0aGlzLlNJWkVfT0ZfVkVSVEVYICAgID0gU0laRV9PRl9WRVJURVg7XG4gICAgdGhpcy5TSVpFX09GX05PUk1BTCAgICA9IFNJWkVfT0ZfVkVSVEVYO1xuICAgIHRoaXMuU0laRV9PRl9DT0xPUiAgICAgPSBTSVpFX09GX0NPTE9SO1xuICAgIHRoaXMuU0laRV9PRl9URVhfQ09PUkQgPSAgU0laRV9PRl9URVhfQ09PUkQ7XG5cbiAgICB2YXIgU0laRV9PRl9GQUNFICAgID0gdGhpcy5TSVpFX09GX0ZBQ0UgICA9IFNJWkVfT0ZfVkVSVEVYO1xuXG4gICAgdmFyIFNJWkVfT0ZfUVVBRCAgICAgPSB0aGlzLlNJWkVfT0ZfUVVBRCAgICAgPSBTSVpFX09GX1ZFUlRFWCAqIDQsXG4gICAgICAgIFNJWkVfT0ZfVFJJQU5HTEUgPSB0aGlzLlNJWkVfT0ZfVFJJQU5HTEUgPSBTSVpFX09GX1ZFUlRFWCAqIDMsXG4gICAgICAgIFNJWkVfT0ZfTElORSAgICAgPSB0aGlzLlNJWkVfT0ZfTElORSAgICAgPSBTSVpFX09GX1ZFUlRFWCAqIDIsXG4gICAgICAgIFNJWkVfT0ZfUE9JTlQgICAgPSB0aGlzLlNJWkVfT0ZfUE9JTlQgICAgPSBTSVpFX09GX1ZFUlRFWDtcblxuICAgIHZhciBFTExJUFNFX0RFVEFJTF9NQVggPSB0aGlzLkVMTElQU0VfREVUQUlMX01BWCA9IDMwO1xuICAgIHRoaXMuRUxMSVBTRV9ERVRBSUxfTUlOID0gMztcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IHNoYXJlZCBidWZmZXJzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5SRVBFQVQgICAgICAgID0gZ2wuUkVQRUFUO1xuICAgIHRoaXMuQ0xBTVAgICAgICAgICA9IGdsLkNMQU1QO1xuICAgIHRoaXMuQ0xBTVBfVE9fRURHRSA9IGdsLkNMQU1QX1RPX0VER0U7XG5cbiAgICB0aGlzLl90ZXhNb2RlICA9IHRoaXMuUkVQRUFUO1xuICAgIHRoaXMuX3RleFNldCAgID0gZmFsc2U7XG5cbiAgICB0aGlzLl90ZXhFbXB0eSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELHRoaXMuX3RleEVtcHR5KTtcbiAgICBnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCAxLCAxLCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBuZXcgVWludDhBcnJheShbMSwxLDEsMV0pKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdVVzZVRleHR1cmUsMC4wKTtcblxuICAgIHRoaXMuX3RleCAgICAgID0gbnVsbDtcblxuICAgIHRoaXMuX2RlZmF1bHRWQk8gPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLl9kZWZhdWx0SUJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgICAgICAgICB0aGlzLl9kZWZhdWx0VkJPKTtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9kZWZhdWx0SUJPKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IGZsYWdzIGFuZCBjYWNoZXNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB0aGlzLl9iVXNlTGlnaHRpbmcgICAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX2JVc2VNYXRlcmlhbCAgICAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5fYlVzZVRleHR1cmUgICAgICAgICAgPSBmYWxzZTtcblxuICAgIHRoaXMuX2JVc2VCaWxsYm9hcmRpbmcgICAgID0gZmFsc2U7XG5cbiAgICB0aGlzLl9iVXNlRHJhd0FycmF5QmF0Y2ggICAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5fYlVzZURyYXdFbGVtZW50QXJyYXlCYXRjaCA9IGZhbHNlO1xuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IG51bGw7XG5cbiAgICB0aGlzLl9iQmF0Y2hWZXJ0aWNlcyAgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hOb3JtYWxzICAgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hDb2xvcnMgICAgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hUZXhDb29yZHMgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hJbmRpY2VzICAgPSBbXTtcblxuICAgIHRoaXMuX2JCYXRjaFZlcnRpY2VzTnVtID0gMDtcblxuXG5cbiAgICB0aGlzLl9iQlZlY1JpZ2h0ID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYkJWZWNVcCAgICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KDQgKiAzKTtcblxuICAgIHRoaXMuX2JCVmVjMCA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMSA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMiA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMyA9IFZlYzMubWFrZSgpO1xuXG4gICAgdGhpcy5fcmVjdFdpZHRoTGFzdCAgICA9IDA7XG4gICAgdGhpcy5fcmVjdEhlaWdodExhc3QgICA9IDA7XG5cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IE1hdHJpY2VzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5fY2FtZXJhICAgID0gbnVsbDtcblxuICAgIHRoaXMuX21Nb2RlVmlldyA9IE1hdDQ0Lm1ha2UoKTtcbiAgICB0aGlzLl9tTm9ybWFsICAgPSBNYXQzMy5tYWtlKCk7XG5cbiAgICB0aGlzLl9tVGVtcCA9IE1hdDQ0Lm1ha2UoKTtcblxuICAgIHRoaXMuX21TdGFjayA9IFtdO1xuXG4gICAgdGhpcy5fZHJhd01vZGUgPSB0aGlzLkxJTkVTO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEluaXQgQnVmZmVyc1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIHRoaXMuX2JFbXB0eTNmID0gbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcblxuICAgIHRoaXMuX2JDb2xvcjRmICAgPSBDb2xvci5XSElURSgpO1xuICAgIHRoaXMuX2JDb2xvckJnNGYgPSBDb2xvci5CTEFDSygpO1xuXG4gICAgdGhpcy5fYlZlcnRleCAgID0gbnVsbDtcbiAgICB0aGlzLl9iTm9ybWFsICAgPSBudWxsO1xuICAgIHRoaXMuX2JDb2xvciAgICA9IG51bGw7XG4gICAgdGhpcy5fYlRleENvb3JkID0gbnVsbDtcbiAgICB0aGlzLl9iSW5kZXggICAgPSBudWxsO1xuXG4gICAgdGhpcy5fYlZlcnRleFBvaW50ID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1BPSU5UKTtcbiAgICB0aGlzLl9iQ29sb3JQb2ludCAgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfQ09MT1IpO1xuXG4gICAgdGhpcy5fYlZlcnRleExpbmUgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0xJTkUpO1xuICAgIHRoaXMuX2JDb2xvckxpbmUgICA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIFNJWkVfT0ZfQ09MT1IpO1xuXG4gICAgdGhpcy5fYlZlcnRleFRyaWFuZ2xlICAgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1RSSUFOR0xFKTtcbiAgICB0aGlzLl9iTm9ybWFsVHJpYW5nbGUgICAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfVFJJQU5HTEUpO1xuICAgIHRoaXMuX2JDb2xvclRyaWFuZ2xlICAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoMyAqIFNJWkVfT0ZfQ09MT1IpO1xuICAgIHRoaXMuX2JJbmRleFRyaWFuZ2xlICAgICAgICAgICA9IG5ldyBVaW50MTZBcnJheShbMCwxLDJdKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRUcmlhbmdsZURlZmF1bHQgPSBuZXcgRmxvYXQzMkFycmF5KFswLjAsMC4wLDEuMCwwLjAsMS4wLDEuMF0pO1xuICAgIHRoaXMuX2JUZXhDb29yZFRyaWFuZ2xlICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fYlRleENvb3JkVHJpYW5nbGVEZWZhdWx0Lmxlbmd0aCk7XG5cbiAgICB0aGlzLl9iVmVydGV4UXVhZCAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9RVUFEKTtcbiAgICB0aGlzLl9iTm9ybWFsUXVhZCAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9RVUFEKTtcbiAgICB0aGlzLl9iQ29sb3JRdWFkICAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoNCAqIFNJWkVfT0ZfQ09MT1IpO1xuICAgIHRoaXMuX2JJbmRleFF1YWQgICAgICAgICAgID0gbmV3IFVpbnQxNkFycmF5KFswLDEsMiwxLDIsM10pO1xuICAgIHRoaXMuX2JUZXhDb29yZFF1YWREZWZhdWx0ID0gbmV3IEZsb2F0MzJBcnJheShbMC4wLDAuMCwxLjAsMC4wLDEuMCwxLjAsMC4wLDEuMF0pO1xuICAgIHRoaXMuX2JUZXhDb29yZFF1YWQgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iVGV4Q29vcmRRdWFkRGVmYXVsdC5sZW5ndGgpO1xuXG4gICAgdGhpcy5fYlZlcnRleFJlY3QgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfUVVBRCk7XG4gICAgdGhpcy5fYk5vcm1hbFJlY3QgPSBuZXcgRmxvYXQzMkFycmF5KFswLDEsMCwwLDEsMCwwLDEsMCwwLDEsMF0pO1xuICAgIHRoaXMuX2JDb2xvclJlY3QgID0gbmV3IEZsb2F0MzJBcnJheSg0ICogU0laRV9PRl9DT0xPUik7XG5cbiAgICB0aGlzLl9iVmVydGV4RWxsaXBzZSAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1ZFUlRFWCAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYk5vcm1hbEVsbGlwc2UgICA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fYlZlcnRleEVsbGlwc2UubGVuZ3RoKTtcbiAgICB0aGlzLl9iQ29sb3JFbGxpcHNlICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0NPTE9SICAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYlRleENvb3JkRWxsaXBzZSA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9URVhfQ09PUkQgKiBFTExJUFNFX0RFVEFJTF9NQVgpO1xuXG4gICAgdGhpcy5fYlZlcnRleENpcmNsZSAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1ZFUlRFWCAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYk5vcm1hbENpcmNsZSAgID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iVmVydGV4Q2lyY2xlLmxlbmd0aCk7XG4gICAgdGhpcy5fYkNvbG9yQ2lyY2xlICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0NPTE9SICogRUxMSVBTRV9ERVRBSUxfTUFYKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRDaXJjbGUgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfVEVYX0NPT1JEICogRUxMSVBTRV9ERVRBSUxfTUFYKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhDdWJlICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShbLTAuNSwtMC41LCAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjUsLTAuNSwgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC41LCAwLjUsIDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0wLjUsIDAuNSwgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuNSwtMC41LC0wLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtMC41LCAwLjUsLTAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC41LCAwLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwtMC41LCAwLjUsLTAuNSwtMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsLTAuNSwtMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsIDAuNSwtMC41LC0wLjUsIDAuNSwwLjUsLTAuNSwtMC41LCAwLjUsIDAuNSwtMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwtMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsIDAuNSwgMC41LC0wLjUsIDAuNSwtMC41XSk7XG4gICAgdGhpcy5fYlZlcnRleEN1YmVTY2FsZWQgPSBuZXcgRmxvYXQzMkFycmF5KG5ldyBBcnJheSh0aGlzLl9iVmVydGV4Q3ViZS5sZW5ndGgpKTtcbiAgICB0aGlzLl9iQ29sb3JDdWJlICAgID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iVmVydGV4Q3ViZS5sZW5ndGggLyBTSVpFX09GX1ZFUlRFWCAqIFNJWkVfT0ZfQ09MT1IpO1xuICAgIHRoaXMuX2JOb3JtYWxDdWJlICAgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwXSApO1xuICAgIHRoaXMuX2JJbmRleEN1YmUgICAgPSBuZXcgVWludDE2QXJyYXkoWyAgMCwgMSwgMiwgMCwgMiwgMywgNCwgNSwgNiwgNCwgNiwgNywgOCwgOSwxMCwgOCwxMCwxMSwgMTIsMTMsMTQsMTIsMTQsMTUsIDE2LDE3LDE4LDE2LDE4LDE5LCAyMCwyMSwyMiwyMCwyMiwyM10pO1xuICAgIHRoaXMuX2JUZXhDb29yZEN1YmUgPSBudWxsO1xuXG4gICAgdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCA9IDEwLjA7XG4gICAgdGhpcy5fc3BoZXJlRGV0YWlsTGFzdCA9IDEwLjA7XG4gICAgdGhpcy5fc3BoZXJlU2NhbGVMYXN0ICA9IC0xO1xuICAgIHRoaXMuX2N1YmVTY2FsZUxhc3QgICAgPSAtMTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmUgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmVTY2FsZWQgPSBudWxsO1xuICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JDb2xvclNwaGVyZSAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JJbmRleFNwaGVyZSAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JUZXhDb29yZHNTcGhlcmUgICAgPSBudWxsO1xuXG4gICAgdGhpcy5fYlNjcmVlbkNvb3JkcyA9IFswLDBdO1xuICAgIHRoaXMuX2JQb2ludDAgICAgICAgPSBbMCwwLDBdO1xuICAgIHRoaXMuX2JQb2ludDEgICAgICAgPSBbMCwwLDBdO1xuXG4gICAgdGhpcy5fYXhpc1ggPSBWZWMzLkFYSVNfWCgpO1xuICAgIHRoaXMuX2F4aXNZID0gVmVjMy5BWElTX1koKTtcbiAgICB0aGlzLl9heGlzWiA9IFZlYzMuQVhJU19aKCk7XG5cbiAgICB0aGlzLl9saW5lQm94V2lkdGggID0gMTtcbiAgICB0aGlzLl9saW5lQm94SGVpZ2h0ID0gMTtcbiAgICB0aGlzLl9saW5lQ3lsaW5kZXJSYWRpdXMgPSAwLjU7XG5cbiAgICB0aGlzLl9nZW5TcGhlcmUoKTtcbiAgICB0aGlzLl9nZW5DaXJjbGUoKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IHByZXNldHNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgIHRoaXMuYW1iaWVudChDb2xvci5CTEFDSygpKTtcblxufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBMaWdodFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLnVzZUxpZ2h0aW5nICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VMaWdodGluZyxib29sID8gMS4wIDogMC4wKTt0aGlzLl9iVXNlTGlnaHRpbmcgPSBib29sO307XG5GR0wucHJvdG90eXBlLmdldExpZ2h0aW5nICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9iVXNlTGlnaHRpbmc7fTtcblxuRkdMLnByb3RvdHlwZS5saWdodCA9IGZ1bmN0aW9uKGxpZ2h0KVxue1xuICAgIHZhciBpZCA9IGxpZ2h0LmdldElkKCksXG4gICAgICAgIGdsID0gdGhpcy5nbDtcblxuICAgIHZhciB0ZW1wVmVjNCAgICA9IHRoaXMuX3RlbXBMaWdodFBvcztcbiAgICAgICAgdGVtcFZlYzRbMF0gPSBsaWdodC5wb3NpdGlvblswXTtcbiAgICAgICAgdGVtcFZlYzRbMV0gPSBsaWdodC5wb3NpdGlvblsxXTtcbiAgICAgICAgdGVtcFZlYzRbMl0gPSBsaWdodC5wb3NpdGlvblsyXTtcbiAgICAgICAgdGVtcFZlYzRbM10gPSBsaWdodC5wb3NpdGlvblszXTtcblxuICAgIHZhciBsaWdodFBvc0V5ZVNwYWNlID0gTWF0NDQubXVsdFZlYzQodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCx0ZW1wVmVjNCk7XG5cbiAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VMaWdodFBvc2l0aW9uW2lkXSwgbGlnaHRQb3NFeWVTcGFjZSk7XG4gICAgZ2wudW5pZm9ybTNmdih0aGlzLl91TGlnaHRBbWJpZW50W2lkXSwgIGxpZ2h0LmFtYmllbnQpO1xuICAgIGdsLnVuaWZvcm0zZnYodGhpcy5fdUxpZ2h0RGlmZnVzZVtpZF0sICBsaWdodC5kaWZmdXNlKTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodFNwZWN1bGFyW2lkXSwgbGlnaHQuc3BlY3VsYXIpO1xuXG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaWRdLCAgIGxpZ2h0LmNvbnN0YW50QXR0ZW50dWF0aW9uKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaWRdLCAgICAgbGlnaHQubGluZWFyQXR0ZW50dWF0aW9uKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWNbaWRdLCAgbGlnaHQucXVhZHJpY0F0dGVudHVhdGlvbik7XG59O1xuXG4vL0ZJWCBNRVxuRkdMLnByb3RvdHlwZS5kaXNhYmxlTGlnaHQgPSBmdW5jdGlvbihsaWdodClcbntcbiAgICB2YXIgaWQgPSBsaWdodC5nZXRJZCgpLFxuICAgICAgICBnbCA9IHRoaXMuZ2w7XG5cbiAgICB2YXIgYkVtcHR5ID0gdGhpcy5fYkVtcHR5M2Y7XG5cbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodEFtYmllbnRbaWRdLCAgYkVtcHR5KTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodERpZmZ1c2VbaWRdLCAgYkVtcHR5KTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodFNwZWN1bGFyW2lkXSwgYkVtcHR5KTtcblxuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91TGlnaHRBdHRlbnVhdGlvbkNvbnN0YW50W2lkXSwgMS4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaWRdLCAgIDAuMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljW2lkXSwwLjApO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gVGV4dHVyZVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86IGRvIGl0IHRoZSBwbGFzayB3YXlcblxuRkdMLnByb3RvdHlwZS51c2VUZXh0dXJlICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VUZXh0dXJlLCBib29sID8gMS4wIDogMC4wKTt0aGlzLl9iVXNlVGV4dHVyZSA9IGJvb2w7fTtcblxuRkdMLnByb3RvdHlwZS5sb2FkVGV4dHVyZVdpdGhJbWFnZSA9IGZ1bmN0aW9uKGltZylcbntcbiAgICB2YXIgZ2wgPSB0aGlzLmdsLFxuICAgICAgICBnbFRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICBnbFRleC5pbWFnZSA9IGltZztcblxuICAgIHZhciB0ZXggPSBuZXcgVGV4dHVyZShnbFRleCk7XG4gICAgdGhpcy5fYmluZFRleEltYWdlKHRleC5fdGV4KTtcblxuICAgIHJldHVybiB0ZXg7XG5cbn07XG5cbkZHTC5wcm90b3R5cGUubG9hZFRleHR1cmUgPSBmdW5jdGlvbihzcmMsdGV4dHVyZSxjYWxsYmFjaylcbntcbiAgICB2YXIgZ2wgID0gdGhpcy5nbCxcbiAgICAgICAgZ2xUZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgZ2xUZXguaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICAgIGdsVGV4LmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHRleHR1cmUuc2V0VGV4U291cmNlKHRoaXMuX2JpbmRUZXhJbWFnZShnbFRleCkpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuXG4gICAgZ2xUZXguaW1hZ2Uuc3JjID0gc3JjO1xufTtcblxuRkdMLnByb3RvdHlwZS5fYmluZFRleEltYWdlID0gZnVuY3Rpb24oZ2xUZXgpXG57XG4gICAgaWYoIWdsVGV4LmltYWdlKXRocm93ICgnVGV4dHVyZSBpbWFnZSBpcyBudWxsLicpO1xuXG4gICAgdmFyIHdpZHRoICA9IGdsVGV4LmltYWdlLndpZHRoLFxuICAgICAgICBoZWlnaHQgPSBnbFRleC5pbWFnZS5oZWlnaHQ7XG5cbiAgICBpZigod2lkdGgmKHdpZHRoLTEpIT0wKSkgICAgICAge3Rocm93ICdUZXh0dXJlIGltYWdlIHdpZHRoIGlzIG5vdCBwb3dlciBvZiAyLic7IH1cbiAgICBlbHNlIGlmKChoZWlnaHQmKGhlaWdodC0xKSkhPTApe3Rocm93ICdUZXh0dXJlIGltYWdlIGhlaWdodCBpcyBub3QgcG93ZXIgb2YgMi4nO31cblxuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELGdsVGV4KTtcbiAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGdsVGV4LmltYWdlKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELG51bGwpO1xuXG5cbiAgICByZXR1cm4gZ2xUZXg7XG59O1xuXG5GR0wucHJvdG90eXBlLnRleHR1cmUgPSBmdW5jdGlvbih0ZXh0dXJlKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICB0aGlzLl90ZXggPSB0ZXh0dXJlLl90ZXg7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCx0aGlzLl90ZXgpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuX3RleE1vZGUgKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLl90ZXhNb2RlICk7XG4gICAgZ2wudW5pZm9ybTFpKHRoaXMuX3VUZXhJbWFnZSwwKTtcbn07XG5cbkZHTC5wcm90b3R5cGUuZGlzYWJsZVRleHR1cmVzID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCx0aGlzLl90ZXhFbXB0eSk7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4VGV4Q29vcmQsVmVjMi5TSVpFLGdsLkZMT0FULGZhbHNlLDAsMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VUZXh0dXJlLDAuMCk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBNYXRlcmlhbFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLnVzZU1hdGVyaWFsID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5nbC51bmlmb3JtMWYodGhpcy5fdVVzZU1hdGVyaWFsLGJvb2wgPyAxLjAgOiAwLjApO3RoaXMuX2JVc2VNYXRlcmlhbCA9IGJvb2w7fTtcblxuRkdMLnByb3RvdHlwZS5tYXRlcmlhbCA9IGZ1bmN0aW9uKG1hdGVyaWFsKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICAvL2dsLnVuaWZvcm00ZnYodGhpcy5fdU1hdGVyaWFsRW1pc3Npb24sICBtYXRlcmlhbC5lbWlzc2lvbik7XG4gICAgZ2wudW5pZm9ybTRmdih0aGlzLl91TWF0ZXJpYWxBbWJpZW50LCAgIG1hdGVyaWFsLmFtYmllbnQpO1xuICAgIGdsLnVuaWZvcm00ZnYodGhpcy5fdU1hdGVyaWFsRGlmZnVzZSwgICBtYXRlcmlhbC5kaWZmdXNlKTtcbiAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VNYXRlcmlhbFNwZWN1bGFyLCAgbWF0ZXJpYWwuc3BlY3VsYXIpO1xuICAgIGdsLnVuaWZvcm0xZiggdGhpcy5fdU1hdGVyaWFsU2hpbmluZXNzLCBtYXRlcmlhbC5zaGluaW5lc3MpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gQ2FtZXJhXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkZHTC5wcm90b3R5cGUuc2V0Q2FtZXJhID0gZnVuY3Rpb24oY2FtZXJhKXt0aGlzLl9jYW1lcmEgPSBjYW1lcmE7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWF0cml4IHN0YWNrXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkZHTC5wcm90b3R5cGUubG9hZElkZW50aXR5ID0gZnVuY3Rpb24oKXt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQuaWRlbnRpdHkodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCk7fTtcbkZHTC5wcm90b3R5cGUucHVzaE1hdHJpeCAgID0gZnVuY3Rpb24oKXt0aGlzLl9tU3RhY2sucHVzaChNYXQ0NC5jb3B5KHRoaXMuX21Nb2RlbFZpZXcpKTt9O1xuRkdMLnByb3RvdHlwZS5wb3BNYXRyaXggICAgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIHN0YWNrID0gdGhpcy5fbVN0YWNrO1xuXG4gICAgaWYoc3RhY2subGVuZ3RoID09IDApdGhyb3cgKCdJbnZhbGlkIHBvcCEnKTtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gc3RhY2sucG9wKCk7XG5cbiAgICByZXR1cm4gdGhpcy5fbU1vZGVsVmlldztcbn07XG5cbkZHTC5wcm90b3R5cGUuc2V0TWF0cmljZXNVbmlmb3JtID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHRoaXMuX3VNb2RlbFZpZXdNYXRyaXgsZmFsc2UsdGhpcy5fbU1vZGVsVmlldyk7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLl91UHJvamVjdGlvbk1hdHJpeCxmYWxzZSx0aGlzLl9jYW1lcmEucHJvamVjdGlvbk1hdHJpeCk7XG5cbiAgICBpZighdGhpcy5fYlVzZUxpZ2h0aW5nKXJldHVybjtcblxuICAgIE1hdDQ0LnRvTWF0MzNJbnZlcnNlZCh0aGlzLl9tTW9kZWxWaWV3LHRoaXMuX21Ob3JtYWwpO1xuICAgIE1hdDMzLnRyYW5zcG9zZSh0aGlzLl9tTm9ybWFsLHRoaXMuX21Ob3JtYWwpO1xuXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLl91Tm9ybWFsTWF0cml4LGZhbHNlLHRoaXMuX21Ob3JtYWwpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWF0cml4IHN0YWNrIHRyYW5zZm9ybWF0aW9uc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLnRyYW5zbGF0ZSAgICAgPSBmdW5jdGlvbih2KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlVHJhbnNsYXRlKHZbMF0sdlsxXSx2WzJdLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbkZHTC5wcm90b3R5cGUudHJhbnNsYXRlM2YgICA9IGZ1bmN0aW9uKHgseSx6KSAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoeCx5LHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuRkdMLnByb3RvdHlwZS50cmFuc2xhdGVYICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSh4LDAsMCxNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5GR0wucHJvdG90eXBlLnRyYW5zbGF0ZVkgICAgPSBmdW5jdGlvbih5KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlVHJhbnNsYXRlKDAseSwwLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbkZHTC5wcm90b3R5cGUudHJhbnNsYXRlWiAgICA9IGZ1bmN0aW9uKHopICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoMCwwLHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuRkdMLnByb3RvdHlwZS5zY2FsZSAgICAgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKHZbMF0sdlsxXSx2WzJdLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbkZHTC5wcm90b3R5cGUuc2NhbGUxZiAgICAgICA9IGZ1bmN0aW9uKG4pICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZShuLG4sbixNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5GR0wucHJvdG90eXBlLnNjYWxlM2YgICAgICAgPSBmdW5jdGlvbih4LHkseikgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoeCx5LHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuRkdMLnByb3RvdHlwZS5zY2FsZVggICAgICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKHgsMSwxLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbkZHTC5wcm90b3R5cGUuc2NhbGVZICAgICAgICA9IGZ1bmN0aW9uKHkpICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZSgxLHksMSxNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5GR0wucHJvdG90eXBlLnNjYWxlWiAgICAgICAgPSBmdW5jdGlvbih6KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoMSwxLHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuRkdMLnByb3RvdHlwZS5yb3RhdGUgICAgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWFlaKHZbMF0sdlsxXSx2WzJdLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbkZHTC5wcm90b3R5cGUucm90YXRlM2YgICAgICA9IGZ1bmN0aW9uKHgseSx6KSAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblhZWih4LHkseixNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5GR0wucHJvdG90eXBlLnJvdGF0ZVggICAgICAgPSBmdW5jdGlvbih4KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25YKHgsTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuRkdMLnByb3RvdHlwZS5yb3RhdGVZICAgICAgID0gZnVuY3Rpb24oeSkgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWSh5LE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbkZHTC5wcm90b3R5cGUucm90YXRlWiAgICAgICA9IGZ1bmN0aW9uKHopICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblooeixNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5GR0wucHJvdG90eXBlLnJvdGF0ZUF4aXMgICAgPSBmdW5jdGlvbihhbmdsZSx2KSAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUsdlswXSx2WzFdLHZbMl0pLHRoaXMuX21Nb2RlbFZpZXcpO307XG5GR0wucHJvdG90eXBlLnJvdGF0ZUF4aXMzZiAgPSBmdW5jdGlvbihhbmdsZSx4LHkseil7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUseCx5LHopLHRoaXMuX21Nb2RlbFZpZXcpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGNvbnZlbmllbmNlIGRyYXdcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5GR0wucHJvdG90eXBlLmRyYXdFbGVtZW50cyA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXksaW5kZXhBcnJheSxtb2RlLGNvdW50LG9mZnNldCx0eXBlLGRyYXdUeXBlKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICB0aGlzLmJ1ZmZlckFycmF5cyh2ZXJ0ZXhGbG9hdDMyQXJyYXksbm9ybWFsRmxvYXQzMkFycmF5LGNvbG9yRmxvYXQzMkFycmF5LHV2RmxvYXQzMkFycmF5KTtcbiAgICB0aGlzLnNldE1hdHJpY2VzVW5pZm9ybSgpO1xuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsaW5kZXhBcnJheSxkcmF3VHlwZSB8fCBnbC5EWU5BTUlDX0RSQVcpO1xuICAgIGdsLmRyYXdFbGVtZW50cyhtb2RlICB8fCB0aGlzLlRSSUFOR0xFUyxcbiAgICAgICAgICAgICAgICAgICAgY291bnQgfHwgaW5kZXhBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgIHx8IGdsLlVOU0lHTkVEX1NIT1JULFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgfHwgMCk7XG59O1xuXG5cbkZHTC5wcm90b3R5cGUuZHJhd0FycmF5cyA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXksbW9kZSxmaXJzdCxjb3VudClcbntcblxuICAgIHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXkpO1xuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKG1vZGUgIHx8IHRoaXMuX2RyYXdNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICAgICBjb3VudCB8fCB2ZXJ0ZXhGbG9hdDMyQXJyYXkubGVuZ3RoIC8gdGhpcy5TSVpFX09GX1ZFUlRFWCk7XG59O1xuXG5GR0wucHJvdG90eXBlLmRyYXdHZW9tZXRyeSA9IGZ1bmN0aW9uKGdlb20sY291bnQsb2Zmc2V0KSB7Z2VvbS5fZHJhdyh0aGlzLGNvdW50LG9mZnNldCk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gY29udmVuaWVuY2UgZmlsbGluZyBkZWZhdWx0IHZib1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLmJ1ZmZlckFycmF5cyA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdGV4Q29vcmRGbG9hdDMyQXJyYXksZ2xEcmF3TW9kZSlcbntcbiAgICB2YXIgbmEgPSBub3JtYWxGbG9hdDMyQXJyYXkgICA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgY2EgPSBjb2xvckZsb2F0MzJBcnJheSAgICA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgdGEgPSB0ZXhDb29yZEZsb2F0MzJBcnJheSA/IHRydWUgOiBmYWxzZTtcblxuICAgIHZhciBhVmVydGV4Tm9ybWFsICAgPSB0aGlzLl9hVmVydGV4Tm9ybWFsLFxuICAgICAgICBhVmVydGV4Q29sb3IgICAgPSB0aGlzLl9hVmVydGV4Q29sb3IsXG4gICAgICAgIGFWZXJ0ZXhUZXhDb29yZCA9IHRoaXMuX2FWZXJ0ZXhUZXhDb29yZDtcblxuICAgIHZhciBnbCAgICAgICAgICAgID0gdGhpcy5nbCxcbiAgICAgICAgZ2xBcnJheUJ1ZmZlciA9IGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgZ2xGbG9hdCAgICAgICA9IGdsLkZMT0FUO1xuXG4gICAgZ2xEcmF3TW9kZSA9IGdsRHJhd01vZGUgfHwgZ2wuRFlOQU1JQ19EUkFXO1xuXG4gICAgdmFyIHZibGVuID0gICAgICB2ZXJ0ZXhGbG9hdDMyQXJyYXkuYnl0ZUxlbmd0aCxcbiAgICAgICAgbmJsZW4gPSBuYSA/IG5vcm1hbEZsb2F0MzJBcnJheS5ieXRlTGVuZ3RoIDogMCxcbiAgICAgICAgY2JsZW4gPSBjYSA/IGNvbG9yRmxvYXQzMkFycmF5LmJ5dGVMZW5ndGggICA6IDAsXG4gICAgICAgIHRibGVuID0gdGEgPyB0ZXhDb29yZEZsb2F0MzJBcnJheS5ieXRlTGVuZ3RoIDogMDtcblxuICAgIHZhciBvZmZzZXRWID0gMCxcbiAgICAgICAgb2Zmc2V0TiA9IG9mZnNldFYgKyB2YmxlbixcbiAgICAgICAgb2Zmc2V0QyA9IG9mZnNldE4gKyBuYmxlbixcbiAgICAgICAgb2Zmc2V0VCA9IG9mZnNldEMgKyBjYmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlciwgdmJsZW4gKyBuYmxlbiArIGNibGVuICsgdGJsZW4sIGdsRHJhd01vZGUpO1xuXG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRWLCB2ZXJ0ZXhGbG9hdDMyQXJyYXkpO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fYVZlcnRleFBvc2l0aW9uLCB0aGlzLlNJWkVfT0ZfVkVSVEVYLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG5cbiAgICBpZighbmEpeyBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoYVZlcnRleE5vcm1hbCk7fVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhOb3JtYWwpO1xuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0Tixub3JtYWxGbG9hdDMyQXJyYXkpO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFWZXJ0ZXhOb3JtYWwsdGhpcy5TSVpFX09GX05PUk1BTCxnbEZsb2F0LGZhbHNlLDAsb2Zmc2V0Tik7XG4gICAgfVxuXG4gICAgaWYoIWNhKXsgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhDb2xvcik7IH1cbiAgICB7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhDb2xvcik7XG4gICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgY29sb3JGbG9hdDMyQXJyYXkpO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFWZXJ0ZXhDb2xvciwgdGhpcy5TSVpFX09GX0NPTE9SLCAgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xuICAgIH1cblxuICAgIGlmKCF0YSl7IGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4VGV4Q29vcmQpO31cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4VGV4Q29vcmQpO1xuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0VCx0ZXhDb29yZEZsb2F0MzJBcnJheSk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYVZlcnRleFRleENvb3JkLHRoaXMuU0laRV9PRl9URVhfQ09PUkQsZ2xGbG9hdCxmYWxzZSwwLG9mZnNldFQpO1xuICAgIH1cbn07XG5cblxuRkdMLnByb3RvdHlwZS5idWZmZXJDb2xvcnMgPSBmdW5jdGlvbihjb2xvcixidWZmZXIpXG57XG4gICAgLy9pZih0aGlzLl9iVXNlTWF0ZXJpYWwgfHwgdGhpcy5fYlVzZVRleHR1cmUpcmV0dXJuIG51bGw7XG5cbiAgICAvL2htLCBmaXggbWVcbiAgICBpZih0aGlzLl9iVXNlTWF0ZXJpYWwgfHwgdGhpcy5fYlVzZVRleHR1cmUpcmV0dXJuIGJ1ZmZlcjtcblxuICAgIHZhciBpID0gMDtcblxuICAgIGlmKGNvbG9yLmxlbmd0aCA9PSA0KVxuICAgIHtcbiAgICAgICAgd2hpbGUoaSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJ1ZmZlcltpXSAgPWNvbG9yWzBdO1xuICAgICAgICAgICAgYnVmZmVyW2krMV09Y29sb3JbMV07XG4gICAgICAgICAgICBidWZmZXJbaSsyXT1jb2xvclsyXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzNdPWNvbG9yWzNdO1xuICAgICAgICAgICAgaSs9NDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpZihjb2xvci5sZW5ndGggIT0gYnVmZmVyLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZFcnJvci5DT0xPUlNfSU5fV1JPTkdfU0laRSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShpIDwgYnVmZmVyLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgYnVmZmVyW2ldICAgPSBjb2xvcltpXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzFdID0gY29sb3JbaSsxXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzJdID0gY29sb3JbaSsyXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzNdID0gY29sb3JbaSszXTtcbiAgICAgICAgICAgIGkrPTQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyO1xufTtcblxuRkdMLnByb3RvdHlwZS5idWZmZXJWZXJ0aWNlcyA9IGZ1bmN0aW9uKHZlcnRpY2VzLGJ1ZmZlcilcbntcbiAgICBpZih2ZXJ0aWNlcy5sZW5ndGggIT0gYnVmZmVyLmxlbmd0aCl0aHJvdyAoZkVycm9yLlZFUlRJQ0VTX0lOX1dST05HX1NJWkUgKyBidWZmZXIubGVuZ3RoICsgJy4nKTtcbiAgICB2YXIgaSA9IC0xO3doaWxlKCsraSA8IGJ1ZmZlci5sZW5ndGgpYnVmZmVyW2ldID0gdmVydGljZXNbaV07XG4gICAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIEhlbHBlcnNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5GR0wucHJvdG90eXBlLl9zY2FsZVZlcnRpY2VzID0gZnVuY3Rpb24odmVydDAsc2NhbGUsdmVydDEpXG57XG4gICAgaWYoIXNjYWxlKXJldHVybiB2ZXJ0MDtcbiAgICB2YXIgaSA9IC0xLCBsID0gdmVydDAubGVuZ3RoO3doaWxlKCsraSA8IGwpdmVydDFbaV0gPSB2ZXJ0MFtpXSAqIHNjYWxlO3JldHVybiB2ZXJ0MTtcbn07XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gQmF0Y2hcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuRkdMLnByb3RvdHlwZS5fcHV0Q29tcCA9IGZ1bmN0aW9uKG9yaWcsdGFyZ2V0KVxue1xuXG59O1xuXG5GR0wucHJvdG90eXBlLmJlZ2luRHJhd0FycmF5QmF0Y2ggPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fYlVzZURyYXdBcnJheUJhdGNoID0gdHJ1ZTtcblxuXG59O1xuXG5GR0wucHJvdG90eXBlLmVuZERyYXdBcnJheUJhdGNoID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX2JVc2VEcmF3QXJyYXlCYXRjaCA9IGZhbHNlO1xuXG59O1xuXG5GR0wucHJvdG90eXBlLmRyYXdBcnJheUJhdGNoID0gZnVuY3Rpb24oKVxue1xuXG59O1xuXG5GR0wucHJvdG90eXBlLmJlZ2luRHJhd0VsZW1lbnRBcnJheUJhdGNoID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX2JVc2VEcmF3RWxlbWVudEFycmF5QmF0Y2ggPSB0cnVlO1xuXG4gICAgdGhpcy5fYkJhdGNoVmVydGljZXMubGVuZ3RoID0gMDtcblxufTtcblxuRkdMLnByb3RvdHlwZS5lbmREcmF3RWxlbWVudEFycmF5QmF0Y2ggPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fYlVzZURyYXdFbGVtZW50QXJyYXlCYXRjaCA9IGZhbHNlO1xuXG5cbn07XG5cbkZHTC5wcm90b3R5cGUuX3B1c2hFbGVtZW50QXJyYXlCYXRjaCA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdGV4Q29vcmRzRmxvYXQzMkFycmF5LGluZGV4VWludDE2QXJyYXkpXG57XG5cbiAgICB2YXIgdHJhbnNNYXRyaXggPSB0aGlzLl9tTW9kZWxWaWV3O1xuXG4gICAgdmFyIG9mZnNldEluZGV4ID0gdGhpcy5fYkJhdGNoVmVydGljZXMubGVuZ3RoIC8gMztcbiAgICB2YXIgb2Zmc2V0LGxlbmd0aCxpbmRleDtcblxuICAgIHZhciBiYXRjaFZlcnRpY2VzICAgICAgICA9IHRoaXMuX2JCYXRjaFZlcnRpY2VzLFxuICAgICAgICBiYXRjaFZlcnRpY2VzT2Zmc2V0ICA9IGJhdGNoVmVydGljZXMubGVuZ3RoO1xuICAgICAgICBiYXRjaFZlcnRpY2VzLmxlbmd0aCs9IHZlcnRleEZsb2F0MzJBcnJheS5sZW5ndGg7XG5cbiAgICAgICAgb2Zmc2V0ID0gYmF0Y2hWZXJ0aWNlc09mZnNldDtcbiAgICAgICAgbGVuZ3RoID0gYmF0Y2hWZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgIGluZGV4ICA9IDA7XG5cbiAgICB3aGlsZShvZmZzZXQgPCBsZW5ndGgpXG4gICAge1xuXG4gICAgICAgIGJhdGNoVmVydGljZXNbb2Zmc2V0ICBdID0gdmVydGV4RmxvYXQzMkFycmF5W2luZGV4ICBdO1xuICAgICAgICBiYXRjaFZlcnRpY2VzW29mZnNldCsxXSA9IHZlcnRleEZsb2F0MzJBcnJheVtpbmRleCsxXTtcbiAgICAgICAgYmF0Y2hWZXJ0aWNlc1tvZmZzZXQrMl0gPSB2ZXJ0ZXhGbG9hdDMyQXJyYXlbaW5kZXgrMl07XG5cbiAgICAgICAgTWF0NDQubXVsdFZlYzNBSSh0cmFuc01hdHJpeCxiYXRjaFZlcnRpY2VzLG9mZnNldCk7XG5cbiAgICAgICAgb2Zmc2V0Kz0zO1xuICAgICAgICBpbmRleCArPTM7XG4gICAgfVxuXG5cbiAgICBpZihub3JtYWxGbG9hdDMyQXJyYXkgICApdGhpcy5fcHV0QmF0Y2godGhpcy5fYkJhdGNoTm9ybWFscyxub3JtYWxGbG9hdDMyQXJyYXkpO1xuICAgIGlmKGNvbG9yRmxvYXQzMkFycmF5ICAgICl0aGlzLl9wdXRCYXRjaCh0aGlzLl9iQmF0Y2hDb2xvcnMsY29sb3JGbG9hdDMyQXJyYXkpO1xuICAgIGlmKHRleENvb3Jkc0Zsb2F0MzJBcnJheSl0aGlzLl9wdXRCYXRjaCh0aGlzLl9iQmF0Y2hUZXhDb29yZHMsdGV4Q29vcmRzRmxvYXQzMkFycmF5KTtcblxuXG4gICAgdmFyIGJhdGNoSW5kaWNlcyAgICAgICAgPSB0aGlzLl9iQmF0Y2hJbmRpY2VzLFxuICAgICAgICBiYXRjaEluZGljZXNPZmZzZXQgID0gYmF0Y2hJbmRpY2VzLmxlbmd0aDtcbiAgICAgICAgYmF0Y2hJbmRpY2VzLmxlbmd0aCs9IGluZGV4VWludDE2QXJyYXkubGVuZ3RoO1xuXG4gICAgICAgIG9mZnNldCA9IGJhdGNoSW5kaWNlc09mZnNldDtcbiAgICAgICAgbGVuZ3RoID0gYmF0Y2hJbmRpY2VzLmxlbmd0aDtcbiAgICAgICAgaW5kZXggID0gMDtcblxuICAgIHdoaWxlKG9mZnNldCA8IGxlbmd0aCl7YmF0Y2hJbmRpY2VzW29mZnNldF0gPSBpbmRleFVpbnQxNkFycmF5W2luZGV4XSArIG9mZnNldEluZGV4O29mZnNldCsrO2luZGV4Kys7fVxuXG59O1xuXG5GR0wucHJvdG90eXBlLmRyYXdFbGVtZW50QXJyYXlCYXRjaCA9IGZ1bmN0aW9uKGJhdGNoKVxue1xuICAgIGlmKCFiYXRjaCl7fVxuXG4gICAgdGhpcy5kcmF3RWxlbWVudHMobmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iQmF0Y2hWZXJ0aWNlcyksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iQmF0Y2hOb3JtYWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2JCYXRjaENvbG9ycyksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iQmF0Y2hUZXhDb29yZHMpLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBVaW50MTZBcnJheSggdGhpcy5fYkJhdGNoSW5kaWNlcyksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREcmF3TW9kZSgpKTtcbn07XG5cbkZHTC5wcm90b3R5cGUuX3B1dEJhdGNoID0gZnVuY3Rpb24oYmF0Y2hBcnJheSxkYXRhQXJyYXkpXG57XG4gICAgdmFyIGJhdGNoT2Zmc2V0ICAgPSBiYXRjaEFycmF5Lmxlbmd0aDtcbiAgICBiYXRjaEFycmF5Lmxlbmd0aCs9IGRhdGFBcnJheS5sZW5ndGg7XG5cbiAgICB2YXIgbGVuID0gYmF0Y2hBcnJheS5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gMDtcblxuICAgIHdoaWxlKGJhdGNoT2Zmc2V0IDwgbGVuKXtiYXRjaEFycmF5W2JhdGNoT2Zmc2V0KytdID0gZGF0YUFycmF5W2luZGV4KytdO31cbn07XG5cblxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIENvbnZlbmllbmNlIE1ldGhvZHMgY29sb3Jcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuRkdMLnByb3RvdHlwZS5hbWJpZW50ICAgPSBmdW5jdGlvbihjb2xvcil7dGhpcy5nbC51bmlmb3JtM2YodGhpcy5fdUFtYmllbnQsY29sb3JbMF0sY29sb3JbMV0sY29sb3JbMl0pO307XG5GR0wucHJvdG90eXBlLmFtYmllbnQzZiA9IGZ1bmN0aW9uKHIsZyxiKXt0aGlzLmdsLnVuaWZvcm0zZih0aGlzLl91QW1iaWVudCxyLGcsYik7fTtcbkZHTC5wcm90b3R5cGUuYW1iaWVudDFmID0gZnVuY3Rpb24oaykgICAge3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VBbWJpZW50LGspO307XG5cbkZHTC5wcm90b3R5cGUuY29sb3IgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldCh0aGlzLl9iQ29sb3I0Zixjb2xvcik7fTtcbkZHTC5wcm90b3R5cGUuY29sb3I0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDRmKHRoaXMuX2JDb2xvcjRmLHIsZyxiLGEpO307XG5GR0wucHJvdG90eXBlLmNvbG9yM2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLl9iQ29sb3IgPSBDb2xvci5zZXQzZih0aGlzLl9iQ29sb3I0ZixyLGcsYik7fTtcbkZHTC5wcm90b3R5cGUuY29sb3IyZiA9IGZ1bmN0aW9uKGssYSkgICAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDJmKHRoaXMuX2JDb2xvcjRmLGssYSk7fTtcbkZHTC5wcm90b3R5cGUuY29sb3IxZiA9IGZ1bmN0aW9uKGspICAgICAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDFmKHRoaXMuX2JDb2xvcjRmLGspO307XG5GR0wucHJvdG90eXBlLmNvbG9yZnYgPSBmdW5jdGlvbihhcnJheSkgIHt0aGlzLl9iQ29sb3IgPSBhcnJheTt9O1xuXG5GR0wucHJvdG90eXBlLmNsZWFyQ29sb3IgPSBmdW5jdGlvbihjb2xvcil7dGhpcy5jbGVhcjRmKGNvbG9yWzBdLGNvbG9yWzFdLGNvbG9yWzJdLGNvbG9yWzNdKTt9O1xuRkdMLnByb3RvdHlwZS5jbGVhciAgICAgID0gZnVuY3Rpb24oKSAgICAge3RoaXMuY2xlYXI0ZigwLDAsMCwxKTt9O1xuRkdMLnByb3RvdHlwZS5jbGVhcjNmICAgID0gZnVuY3Rpb24ocixnLGIpe3RoaXMuY2xlYXI0ZihyLGcsYiwxKTt9O1xuRkdMLnByb3RvdHlwZS5jbGVhcjJmICAgID0gZnVuY3Rpb24oayxhKSAge3RoaXMuY2xlYXI0ZihrLGssayxhKTt9O1xuRkdMLnByb3RvdHlwZS5jbGVhcjFmICAgID0gZnVuY3Rpb24oaykgICAge3RoaXMuY2xlYXI0ZihrLGssaywxLjApO307XG5GR0wucHJvdG90eXBlLmNsZWFyNGYgICA9IGZ1bmN0aW9uKHIsZyxiLGEpXG57XG4gICAgdmFyIGMgID0gQ29sb3Iuc2V0NGYodGhpcy5fYkNvbG9yQmc0ZixyLGcsYixhKTtcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgIGdsLmNsZWFyQ29sb3IoY1swXSxjWzFdLGNbMl0sY1szXSk7XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xufTtcblxuXG5GR0wucHJvdG90eXBlLmdldENvbG9yQnVmZmVyID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYkNvbG9yO307XG5GR0wucHJvdG90eXBlLmdldENsZWFyQnVmZmVyID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYkNvbG9yQmc0Zjt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBNZXRob2RzIGRyYXcgcHJvcGVydGllc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLmRyYXdNb2RlID0gZnVuY3Rpb24obW9kZSl7dGhpcy5fZHJhd01vZGUgPSBtb2RlO307XG5GR0wucHJvdG90eXBlLmdldERyYXdNb2RlID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZHJhd01vZGU7fTtcblxuRkdMLnByb3RvdHlwZS5zcGhlcmVEZXRhaWwgPSBmdW5jdGlvbihkZXRhaWwpXG57XG4gICAgaWYoZGV0YWlsID09IHRoaXMuX3NwaGVyZURldGFpbExhc3QpcmV0dXJuO1xuICAgIHRoaXMuX3NwaGVyZURldGFpbExhc3QgPSBkZXRhaWw7XG4gICAgdGhpcy5fZ2VuU3BoZXJlKCk7XG59O1xuXG5GR0wucHJvdG90eXBlLmNpcmNsZURldGFpbCA9IGZ1bmN0aW9uKGRldGFpbClcbntcbiAgICBpZihkZXRhaWwgPT0gdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCApcmV0dXJuO1xuICAgIHRoaXMuX2NpcmNsZURldGFpbExhc3QgID0gTWF0aC5tYXgodGhpcy5FTExJUFNFX0RFVEFJTF9NSU4sTWF0aC5taW4oZGV0YWlsLHRoaXMuRUxMSVBTRV9ERVRBSUxfTUFYKSk7XG4gICAgdGhpcy5fY2lybGNlVmVydGV4Q291bnQgPSB0aGlzLl9jaXJjbGVEZXRhaWxMYXN0ICogMztcbiAgICB0aGlzLl9nZW5DaXJjbGUoKTtcbn07XG5cbkZHTC5wcm90b3R5cGUubGluZVdpZHRoID0gZnVuY3Rpb24oc2l6ZSl7dGhpcy5nbC5saW5lV2lkdGgoc2l6ZSk7fTtcblxuRkdMLnByb3RvdHlwZS51c2VCaWxsYm9hcmQgPSBmdW5jdGlvbihib29sKXt0aGlzLl9iVXNlQmlsbGJvYXJkaW5nID0gYm9vbDt9O1xuRkdMLnByb3RvdHlwZS5wb2ludFNpemUgPSBmdW5jdGlvbih2YWx1ZSl7dGhpcy5nbC51bmlmb3JtMWYodGhpcy5fdVBvaW50U2l6ZSx2YWx1ZSk7fTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBNZXRob2RzIGRyYXcgcHJpbWl0aXZlc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24odmVjdG9yKVxue1xuICAgIGlmKHZlY3Rvci5sZW5ndGggPT0gMClyZXR1cm47XG5cbiAgICB2YXIgYkNvbG9yUG9pbnQgPSB0aGlzLl9iQ29sb3JQb2ludCxcbiAgICAgICAgYkNvbG9yICAgICAgPSB0aGlzLl9iQ29sb3I7XG5cbiAgICBiQ29sb3JQb2ludFswXSA9IGJDb2xvclswXTtcbiAgICBiQ29sb3JQb2ludFsxXSA9IGJDb2xvclsxXTtcbiAgICBiQ29sb3JQb2ludFsyXSA9IGJDb2xvclsyXTtcbiAgICBiQ29sb3JQb2ludFszXSA9IGJDb2xvclszXTtcblxuICAgIHZhciBnbCA9IHRoaXMuZ2wsXG4gICAgICAgIGdsQXJyYXlCdWZmZXIgPSBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBnbC5GTE9BVDtcblxuICAgIHZhciB2YmxlbiA9IHZlY3Rvci5ieXRlTGVuZ3RoLFxuICAgICAgICBjYmxlbiA9IGJDb2xvci5ieXRlTGVuZ3RoO1xuXG4gICAgdmFyIG9mZnNldFYgPSAwLFxuICAgICAgICBvZmZzZXRDID0gdmJsZW47XG5cbiAgICBnbC5idWZmZXJEYXRhKGdsQXJyYXlCdWZmZXIsdmJsZW4gKyBjYmxlbixnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsIG9mZnNldFYsIHZlY3Rvcik7XG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRDLCBiQ29sb3IpO1xuXG4gICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4VGV4Q29vcmQpO1xuXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4UG9zaXRpb24sIHRoaXMuU0laRV9PRl9WRVJURVgsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRWKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX2FWZXJ0ZXhDb2xvciwgICAgdGhpcy5TSVpFX09GX0NPTE9SLCAgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xuXG4gICAgdGhpcy5zZXRNYXRyaWNlc1VuaWZvcm0oKTtcbiAgICBnbC5kcmF3QXJyYXlzKHRoaXMuX2RyYXdNb2RlLDAsMSk7XG5cbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4VGV4Q29vcmQpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5wb2ludDtcbn07XG5cbkZHTC5wcm90b3R5cGUucG9pbnRzID0gZnVuY3Rpb24odmVydGljZXMsY29sb3JzKVxue1xuICAgIGlmKHZlcnRpY2VzLmxlbmd0aCA9PSAwKXJldHVybjtcblxuICAgIGNvbG9ycyA9IGNvbG9ycyB8fCB0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3I0ZixuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzLmxlbmd0aCAvIDMgKiA0KSk7XG5cbiAgICB2YXIgZ2wgICAgICAgICAgICA9IHRoaXMuZ2wsXG4gICAgICAgIGdsQXJyYXlCdWZmZXIgPSBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBnbC5GTE9BVDtcblxuICAgIHZhciB2YmxlbiA9IHZlcnRpY2VzLmJ5dGVMZW5ndGgsXG4gICAgICAgIGNibGVuID0gY29sb3JzLmJ5dGVMZW5ndGg7XG5cbiAgICB2YXIgb2Zmc2V0ViA9IDAsXG4gICAgICAgIG9mZnNldEMgPSB2YmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlcix2YmxlbiArIGNibGVuLGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0ViwgdmVydGljZXMpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgY29sb3JzKTtcblxuICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcblxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fYVZlcnRleFBvc2l0aW9uLCB0aGlzLlNJWkVfT0ZfVkVSVEVYLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4Q29sb3IsICAgIHRoaXMuU0laRV9PRl9DT0xPUiwgIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRDKTtcblxuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgZ2wuZHJhd0FycmF5cyh0aGlzLl9kcmF3TW9kZSwwLHZlcnRpY2VzLmxlbmd0aC8zKTtcblxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnBvaW50cztcbn07XG5cbkZHTC5wcm90b3R5cGUucG9pbnQzZiA9IGZ1bmN0aW9uKHgseSx6KXt0aGlzLl9iVmVydGV4UG9pbnRbMF0gPSB4O3RoaXMuX2JWZXJ0ZXhQb2ludFsxXSA9IHk7dGhpcy5fYlZlcnRleFBvaW50WzJdID0gejt0aGlzLnBvaW50KHRoaXMuX2JWZXJ0ZXhQb2ludCk7fTtcbkZHTC5wcm90b3R5cGUucG9pbnQyZiA9IGZ1bmN0aW9uKHgseSkgIHt0aGlzLl9iVmVydGV4UG9pbnRbMF0gPSB4O3RoaXMuX2JWZXJ0ZXhQb2ludFsxXSA9IHk7dGhpcy5fYlZlcnRleFBvaW50WzJdID0gMDt0aGlzLnBvaW50KHRoaXMuX2JWZXJ0ZXhQb2ludCk7fTtcbkZHTC5wcm90b3R5cGUucG9pbnR2ICA9IGZ1bmN0aW9uKGFycikgIHt0aGlzLl9iVmVydGV4UG9pbnRbMF0gPSBhcnJbMF07dGhpcy5fYlZlcnRleFBvaW50WzFdID0gYXJyWzFdO3RoaXMuX2JWZXJ0ZXhQb2ludFsyXSA9IGFyclsyXTt0aGlzLnBvaW50KHRoaXMuX2JWZXJ0ZXhQb2ludCk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLmxpbmVmID0gZnVuY3Rpb24oeDAseTAsejAseDEseTEsejEpXG57XG4gICAgdmFyIHYgPSB0aGlzLl9iVmVydGV4TGluZTtcbiAgICB2WzBdID0geDA7dlsxXSA9IHkwO3ZbMl0gPSB6MDtcbiAgICB2WzNdID0geDE7dls0XSA9IHkxO3ZbNV0gPSB6MTtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvckxpbmUpLG51bGwsdGhpcy5fZHJhd01vZGUpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5saW5lZjtcbn07XG5cbkZHTC5wcm90b3R5cGUubGluZSAgPSBmdW5jdGlvbih2ZXJ0aWNlcylcbntcbiAgICBpZih2ZXJ0aWNlcy5sZW5ndGggPT0gMClyZXR1cm47XG4gICAgdGhpcy5kcmF3QXJyYXlzKHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRpY2VzLHRoaXMuX2JWZXJ0ZXhMaW5lKSxudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JMaW5lKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsIDIpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5saW5lO1xufTtcblxuRkdMLnByb3RvdHlwZS5saW5ldiA9IGZ1bmN0aW9uKHZlcnRpY2VzKVxue1xuICAgIGlmKHZlcnRpY2VzLmxlbmd0aCA9PSAwKXJldHVybjtcbiAgICB2YXIgdiA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLFxuICAgICAgICBsID0gdmVydGljZXMubGVuZ3RoIC8gdGhpcy5TSVpFX09GX1ZFUlRFWDtcbiAgICB0aGlzLmRyYXdBcnJheXModixudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvciwgbmV3IEZsb2F0MzJBcnJheShsKnRoaXMuU0laRV9PRl9DT0xPUikpLG51bGwsdGhpcy5fZHJhd01vZGUsMCwgbCk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLmxpbmV2O1xufTtcblxuRkdMLnByb3RvdHlwZS5saW5lMmZ2ID0gZnVuY3Rpb24odjAsdjEpe3RoaXMubGluZWYodjBbMF0sdjBbMV0sdjBbMl0sdjFbMF0sdjFbMV0sdjFbMl0pO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuRkdMLnByb3RvdHlwZS5xdWFkZiA9IGZ1bmN0aW9uKHgwLHkwLHowLHgxLHkxLHoxLHgyLHkyLHoyLHgzLHkzLHozKVxue1xuICAgIHZhciB2ID0gdGhpcy5fYlZlcnRleFF1YWQ7XG5cbiAgICB2WyAwXSA9IHgwO3ZbIDFdID0geTA7dlsgMl0gPSB6MDtcbiAgICB2WyAzXSA9IHgxO3ZbIDRdID0geTE7dlsgNV0gPSB6MTtcbiAgICB2WyA2XSA9IHgyO3ZbIDddID0geTI7dlsgOF0gPSB6MjtcbiAgICB2WyA5XSA9IHgzO3ZbMTBdID0geTM7dlsxMV0gPSB6MztcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclF1YWQpLG51bGwsdGhpcy5fZHJhd01vZGUsMCw0KTtcblxuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IHRoaXMucXVhZGY7XG59O1xuXG5GR0wucHJvdG90eXBlLnF1YWR2ID0gZnVuY3Rpb24odjAsdjEsdjIsdjMpXG57XG4gICAgdGhpcy5xdWFkZih2MFswXSx2MFsxXSx2MFsyXSx2MVswXSx2MVsxXSx2MVsyXSx2MlswXSx2MlsxXSx2MlsyXSx2M1swXSx2M1sxXSx2M1syXSk7XG59O1xuXG5GR0wucHJvdG90eXBlLnF1YWQgPSBmdW5jdGlvbih2ZXJ0aWNlcyxub3JtYWxzLHRleENvb3JkcylcbntcbiAgICB0aGlzLmRyYXdBcnJheXModGhpcy5idWZmZXJBcnJheXModmVydGljZXMsdGhpcy5fYlZlcnRleFF1YWQpLG5vcm1hbHMsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclF1YWQpLHRleENvb3Jkcyx0aGlzLl9kcmF3TW9kZSwwLDQpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5xdWFkO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86Y2xlYW51cFxuRkdMLnByb3RvdHlwZS5yZWN0ID0gZnVuY3Rpb24od2lkdGgsaGVpZ2h0KVxue1xuICAgIGhlaWdodCA9IGhlaWdodCB8fCB3aWR0aDtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMuX2JWZXJ0ZXhSZWN0O1xuXG4gICAgaWYodGhpcy5fYlVzZUJpbGxib2FyZGluZylcbiAgICB7XG4gICAgICAgIC8vMjNcbiAgICAgICAgLy8wMVxuXG4gICAgICAgIHZhciBtb2RlbFZpZXdNYXRyaXggPSB0aGlzLl9tTW9kZWxWaWV3O1xuXG4gICAgICAgIHZhciB2ZWNSaWdodFggPSBtb2RlbFZpZXdNYXRyaXhbMF0sXG4gICAgICAgICAgICB2ZWNSaWdodFkgPSBtb2RlbFZpZXdNYXRyaXhbNF0sXG4gICAgICAgICAgICB2ZWNSaWdodFogPSBtb2RlbFZpZXdNYXRyaXhbOF07XG5cbiAgICAgICAgdmFyIHZlY1VwWCA9IG1vZGVsVmlld01hdHJpeFsxXSxcbiAgICAgICAgICAgIHZlY1VwWSA9IG1vZGVsVmlld01hdHJpeFs1XSxcbiAgICAgICAgICAgIHZlY1VwWiA9IG1vZGVsVmlld01hdHJpeFs5XTtcblxuXG4gICAgICAgIHZlcnRpY2VzWyAwXSA9ICgtdmVjUmlnaHRYIC0gdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgMV0gPSAoLXZlY1JpZ2h0WSAtIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDJdID0gKC12ZWNSaWdodFogLSB2ZWNVcFopICogd2lkdGg7XG5cbiAgICAgICAgdmVydGljZXNbIDNdID0gKHZlY1JpZ2h0WCAtIHZlY1VwWCkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDRdID0gKHZlY1JpZ2h0WSAtIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDVdID0gKHZlY1JpZ2h0WiAtIHZlY1VwWikgKiB3aWR0aDtcblxuICAgICAgICB2ZXJ0aWNlc1sgNl0gPSAodmVjUmlnaHRYICsgdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgN10gPSAodmVjUmlnaHRZICsgdmVjVXBZKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgOF0gPSAodmVjUmlnaHRaICsgdmVjVXBaKSAqIHdpZHRoO1xuXG4gICAgICAgIHZlcnRpY2VzWyA5XSA9ICgtdmVjUmlnaHRYICsgdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sxMF0gPSAoLXZlY1JpZ2h0WSArIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbMTFdID0gKC12ZWNSaWdodFogKyB2ZWNVcFopICogd2lkdGg7XG5cbiAgICB9XG4gICAgZWxzZSBpZih3aWR0aCAhPSB0aGlzLl9yZWN0V2lkdGhMYXN0IHx8IGhlaWdodCAhPSB0aGlzLl9yZWN0SGVpZ2h0TGFzdClcbiAgICB7XG4gICAgICAgIHZlcnRpY2VzWzBdID0gdmVydGljZXNbMV0gPSB2ZXJ0aWNlc1syXSA9IHZlcnRpY2VzWzRdID0gdmVydGljZXNbNV0gPSB2ZXJ0aWNlc1s3XSA9IHZlcnRpY2VzWzldID0gdmVydGljZXNbMTBdID0gMDtcbiAgICAgICAgdmVydGljZXNbM10gPSB2ZXJ0aWNlc1s2XSA9IHdpZHRoOyB2ZXJ0aWNlc1s4XSA9IHZlcnRpY2VzWzExXSA9IGhlaWdodDtcblxuICAgICAgICB0aGlzLl9yZWN0V2lkdGhMYXN0ICA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9yZWN0SGVpZ2h0TGFzdCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdBcnJheXModmVydGljZXMsdGhpcy5fYk5vcm1hbFJlY3QsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclJlY3QpLHRoaXMuX2JUZXhDb29yZFF1YWREZWZhdWx0LHRoaXMuX2RyYXdNb2RlLDAsNCk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnJlY3Q7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkZHTC5wcm90b3R5cGUudHJpYW5nbGUgPSBmdW5jdGlvbih2MCx2MSx2MilcbntcbiAgICB2YXIgdiA9IHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZTtcbiAgICB2WzBdID0gdjBbMF07dlsxXSA9IHYwWzFdO3ZbMl0gPSB2MFsyXTtcbiAgICB2WzNdID0gdjFbMF07dls0XSA9IHYxWzFdO3ZbNV0gPSB2MVsyXTtcbiAgICB2WzZdID0gdjJbMF07dls3XSA9IHYyWzFdO3ZbOF0gPSB2MlsyXTtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclRyaWFuZ2xlKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsMyk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnRyaWFuZ2xlO1xufTtcblxuRkdMLnByb3RvdHlwZS50cmlhbmdsZWYgPSBmdW5jdGlvbih2MCx2MSx2Mix2Myx2NCx2NSx2Nix2Nyx2OClcbntcbiAgICB2YXIgdiA9IHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZTtcbiAgICB2WzBdID0gdjA7dlsxXSA9IHYxO3ZbMl0gPSB2MjtcbiAgICB2WzNdID0gdjM7dls0XSA9IHY0O3ZbNV0gPSB2NTtcbiAgICB2WzZdID0gdjY7dls3XSA9IHY3O3ZbOF0gPSB2ODtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclRyaWFuZ2xlKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsMyk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnRyaWFuZ2xlZjtcbn07XG5cbkZHTC5wcm90b3R5cGUudHJpYW5nbGV2ID0gZnVuY3Rpb24odmVydGljZXMsbm9ybWFscyx0ZXhDb29yZHMpXG57XG4gICAgdGhpcy5kcmF3QXJyYXlzKHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRpY2VzLHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZSksbm9ybWFscyx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yVHJpYW5nbGUpLHRleENvb3Jkcyx0aGlzLl9kcmF3TW9kZSwwLDMpO1xuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IHRoaXMudHJpYW5nbGV2O1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5GR0wucHJvdG90eXBlLmNpcmNsZTNmID0gZnVuY3Rpb24oeCx5LHoscmFkaXVzKVxue1xuICAgIHJhZGl1cyA9IHJhZGl1cyB8fCAwLjU7XG5cbiAgICB0aGlzLnB1c2hNYXRyaXgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZTNmKHgseSx6KTtcbiAgICB0aGlzLnNjYWxlMWYocmFkaXVzKTtcbiAgICB0aGlzLmRyYXdBcnJheXModGhpcy5fYlZlcnRleENpcmNsZSx0aGlzLl9iTm9ybWFsQ2lyY2xlLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JDaXJjbGUpLHRoaXMuX2JUZXhDb29yZENpcmNsZSx0aGlzLmdldERyYXdNb2RlKCksMCx0aGlzLl9jaXJjbGVEZXRhaWxMYXN0KTtcbiAgICB0aGlzLnBvcE1hdHJpeCgpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5saW5lZjtcbn07XG5cbkZHTC5wcm90b3R5cGUuY2lybGNlMmYgPSBmdW5jdGlvbih4LHkscmFkaXVzKXt0aGlzLmNpcmNsZTNmKHgsMCx5LHJhZGl1cyk7fTtcbkZHTC5wcm90b3R5cGUuY2lyY2xlID0gZnVuY3Rpb24ocmFkaXVzKXt0aGlzLmNpcmNsZTNmKDAsMCwwLHJhZGl1cyl9O1xuRkdMLnByb3RvdHlwZS5jaXJjbGV2ID0gZnVuY3Rpb24odixyYWRpdXMpe3RoaXMuY2lyY2xlM2YodlswXSx2WzFdLHZbMl0scmFkaXVzKTt9O1xuRkdMLnByb3RvdHlwZS5jaXJjbGVzID0gZnVuY3Rpb24oY2VudGVycyxyYWRpaSl7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gR2VvbWV0cnkgZ2VuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkZHTC5wcm90b3R5cGUuX2dlblNwaGVyZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLl9zcGhlcmVEZXRhaWxMYXN0O1xuXG4gICAgdmFyIHZlcnRpY2VzICA9IFtdLFxuICAgICAgICBub3JtYWxzICAgPSBbXSxcbiAgICAgICAgdGV4Q29vcmRzID0gW10sXG4gICAgICAgIGluZGljZXMgICA9IFtdO1xuXG4gICAgdmFyIHRoZXRhLHRoZXRhU2luLHRoZXRhQ29zO1xuICAgIHZhciBwaGkscGhpU2luLHBoaUNvcztcblxuICAgIHZhciB4LHksejtcbiAgICB2YXIgdSx2O1xuXG4gICAgdmFyIGkgPSAtMSxqO1xuXG4gICAgdmFyIGluZGV4LFxuICAgICAgICBpbmRleFZlcnRpY2VzLFxuICAgICAgICBpbmRleE5vcm1hbHMsXG4gICAgICAgIGluZGV4VGV4Q29vcmRzO1xuXG4gICAgd2hpbGUoKytpIDw9IHNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgdGhldGEgPSBpICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICB0aGV0YVNpbiA9IE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgdGhldGFDb3MgPSBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPD0gc2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBoaSAgICA9IGogKiAyICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgcGhpU2luID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgICAgICAgIHBoaUNvcyA9IE1hdGguY29zKHBoaSk7XG5cbiAgICAgICAgICAgIHggPSBwaGlDb3MgKiB0aGV0YVNpbjtcbiAgICAgICAgICAgIHkgPSB0aGV0YUNvcztcbiAgICAgICAgICAgIHogPSBwaGlTaW4gKiB0aGV0YVNpbjtcblxuICAgICAgICAgICAgaW5kZXggICAgICAgICAgPSBqICsgc2VnbWVudHMgKiBpO1xuICAgICAgICAgICAgaW5kZXhWZXJ0aWNlcyAgPSBpbmRleE5vcm1hbHMgPSBpbmRleCAqIDM7XG4gICAgICAgICAgICBpbmRleFRleENvb3JkcyA9IGluZGV4ICogMjtcblxuICAgICAgICAgICAgbm9ybWFscy5wdXNoKHgseSx6KTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goeCx5LHopO1xuXG4gICAgICAgICAgICB1ID0gMSAtIGogLyBzZWdtZW50cztcbiAgICAgICAgICAgIHYgPSAxIC0gaSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICB0ZXhDb29yZHMucHVzaCh1LHYpO1xuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgdmFyIGluZGV4MCxpbmRleDEsaW5kZXgyO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBzZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXgwID0gaiArIGkgKiAoc2VnbWVudHMgKyAxKTtcbiAgICAgICAgICAgIGluZGV4MSA9IGluZGV4MCArIHNlZ21lbnRzICsgMTtcbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4MCArIDE7XG5cbiAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRleDAsaW5kZXgxLGluZGV4Mik7XG5cbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4MCArIDE7XG4gICAgICAgICAgICBpbmRleDAgPSBpbmRleDE7XG4gICAgICAgICAgICBpbmRleDEgPSBpbmRleDAgKyAxO1xuXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kZXgwLGluZGV4MSxpbmRleDIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fYlZlcnRleFNwaGVyZSAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmVTY2FsZWQgPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcbiAgICB0aGlzLl9iTm9ybWFsU3BoZXJlICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKTtcbiAgICB0aGlzLl9iQ29sb3JTcGhlcmUgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShzZWdtZW50cyAqIHNlZ21lbnRzICogNCk7XG4gICAgdGhpcy5fYlRleENvb3Jkc1NwaGVyZSAgICA9IG5ldyBGbG9hdDMyQXJyYXkoaW5kaWNlcyk7XG4gICAgdGhpcy5fYkluZGV4U3BoZXJlICAgICAgICA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcbn07XG5cbkZHTC5wcm90b3R5cGUuX2dlbkNpcmNsZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgY3ggPSAwLFxuICAgICAgICBjeSA9IDA7XG5cbiAgICB2YXIgZCA9IHRoaXMuX2NpcmNsZURldGFpbExhc3QsXG4gICAgICAgIHYgPSB0aGlzLl9iVmVydGV4Q2lyY2xlLFxuICAgICAgICBsID0gZCAqIDM7XG5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICB2YXIgdGhldGEgPSAyICogTWF0aC5QSSAvIGQsXG4gICAgICAgIGMgPSBNYXRoLmNvcyh0aGV0YSksXG4gICAgICAgIHMgPSBNYXRoLnNpbih0aGV0YSksXG4gICAgICAgIHQ7XG5cbiAgICB2YXIgb3ggPSAxLFxuICAgICAgICBveSA9IDA7XG5cbiAgICB3aGlsZShpIDwgbClcbiAgICB7XG4gICAgICAgIHZbaSAgXSA9IG94ICsgY3g7XG4gICAgICAgIHZbaSsxXSA9IDA7XG4gICAgICAgIHZbaSsyXSA9IG95ICsgY3k7XG5cbiAgICAgICAgdCAgPSBveDtcbiAgICAgICAgb3ggPSBjICogb3ggLSBzICogb3k7XG4gICAgICAgIG95ID0gcyAqIHQgICsgYyAqIG95O1xuXG4gICAgICAgIGkrPTM7XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gZGVmYXVsdCB2Ym8vaWJvIC8gc2hhZGVyIGF0dHJpYnV0ZXNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuRkdMLnByb3RvdHlwZS5nZXREZWZhdWx0VkJPICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RlZmF1bHRWQk87fTtcbkZHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdElCTyAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kZWZhdWx0SUJPO307XG5GR0wucHJvdG90eXBlLmJpbmREZWZhdWx0VkJPID0gZnVuY3Rpb24oKXt0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsdGhpcy5fZGVmYXVsdFZCTyk7fTtcbkZHTC5wcm90b3R5cGUuYmluZERlZmF1bHRJQk8gPSBmdW5jdGlvbigpe3RoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuX2RlZmF1bHRJQk8pO307XG5cbkZHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdFZlcnRleEF0dHJpYiAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYVZlcnRleFBvc2l0aW9uO307XG5GR0wucHJvdG90eXBlLmdldERlZmF1bHROb3JtYWxBdHRyaWIgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FWZXJ0ZXhOb3JtYWw7fTtcbkZHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdENvbG9yQXR0cmliICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYVZlcnRleENvbG9yO307XG5GR0wucHJvdG90eXBlLmdldERlZmF1bHRUZXhDb29yZEF0dHJpYiA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FWZXJ0ZXhUZXhDb29yZDt9O1xuXG5GR0wucHJvdG90eXBlLmVuYWJsZURlZmF1bHRWZXJ0ZXhBdHRyaWJBcnJheSAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFBvc2l0aW9uKTt9O1xuRkdMLnByb3RvdHlwZS5lbmFibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkgICAgID0gZnVuY3Rpb24oKXt0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO307XG5GR0wucHJvdG90eXBlLmVuYWJsZURlZmF1bHRDb2xvckF0dHJpYkFycmF5ICAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleENvbG9yKTt9O1xuRkdMLnByb3RvdHlwZS5lbmFibGVEZWZhdWx0VGV4Q29vcmRzQXR0cmliQXJyYXkgID0gZnVuY3Rpb24oKXt0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCk7fTtcblxuRkdMLnByb3RvdHlwZS5kaXNhYmxlRGVmYXVsdFZlcnRleEF0dHJpYkFycmF5ICAgID0gZnVuY3Rpb24oKXt0aGlzLmdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4UG9zaXRpb24pO307XG5GR0wucHJvdG90eXBlLmRpc2FibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO307XG5GR0wucHJvdG90eXBlLmRpc2FibGVEZWZhdWx0Q29sb3JBdHRyaWJBcnJheSAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhDb2xvcik7fTtcbkZHTC5wcm90b3R5cGUuZGlzYWJsZURlZmF1bHRUZXhDb29yZHNBdHRyaWJBcnJheSA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBjb252ZW5pZW5jZSBkcmF3XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vVE9ETzpyZW1vdmVcblxuRkdMLnByb3RvdHlwZS5ib3ggPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQsZGVwdGgpXG57XG4gICAgdGhpcy5wdXNoTWF0cml4KCk7XG4gICAgdGhpcy5zY2FsZTNmKHdpZHRoLGhlaWdodCxkZXB0aCk7XG4gICAgdGhpcy5kcmF3RWxlbWVudHModGhpcy5fYlZlcnRleEN1YmUsdGhpcy5fYk5vcm1hbEN1YmUsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvckN1YmUpLHRoaXMuX2JUZXhDb29yZEN1YmUsdGhpcy5fYkluZGV4Q3ViZSx0aGlzLl9kcmF3TW9kZSk7XG4gICAgdGhpcy5wb3BNYXRyaXgoKTtcblxuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IHRoaXMuYm94O1xufTtcblxuRkdMLnByb3RvdHlwZS5jdWJlID0gZnVuY3Rpb24oc2l6ZSlcbntcbiAgICBzaXplID0gc2l6ZSB8fCAxO1xuXG4gICAgdmFyIGN1YmVTY2FsZUxhc3QgICAgPSB0aGlzLl9jdWJlU2NhbGVMYXN0LFxuICAgICAgICBjdWJlVmVydGljZXNMYXN0ID0gdGhpcy5fYlZlcnRleEN1YmVTY2FsZWQ7XG5cbiAgICBpZih0aGlzLl9iVXNlRHJhd0VsZW1lbnRBcnJheUJhdGNoKVxuICAgIHtcbiAgICAgICAgdGhpcy5fcHVzaEVsZW1lbnRBcnJheUJhdGNoKChzaXplID09IGN1YmVTY2FsZUxhc3QpID8gY3ViZVZlcnRpY2VzTGFzdCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZVZlcnRpY2VzKHRoaXMuX2JWZXJ0ZXhDdWJlLHNpemUsY3ViZVZlcnRpY2VzTGFzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iTm9ybWFsQ3ViZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JDdWJlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JUZXhDb29yZEN1YmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iSW5kZXhDdWJlKTtcblxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygoc2l6ZSA9PSBjdWJlU2NhbGVMYXN0KSA/IGN1YmVWZXJ0aWNlc0xhc3QgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZVZlcnRpY2VzKHRoaXMuX2JWZXJ0ZXhDdWJlLHNpemUsY3ViZVZlcnRpY2VzTGFzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JOb3JtYWxDdWJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yQ3ViZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JUZXhDb29yZEN1YmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JJbmRleEN1YmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdNb2RlKTtcblxuICAgIH1cblxuXG4gICAgdGhpcy5fY3ViZVNjYWxlTGFzdCA9IHNpemU7XG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ICA9IHRoaXMuY3ViZTtcblxufTtcblxuRkdMLnByb3RvdHlwZS5zcGhlcmUgPSBmdW5jdGlvbihzaXplKVxue1xuICAgIHNpemUgPSBzaXplIHx8IDE7XG5cbiAgICB2YXIgc3BoZXJlU2NhbGVMYXN0ICAgICAgPSB0aGlzLl9zcGhlcmVTY2FsZUxhc3QsXG4gICAgICAgIHNwaGVyZVZlcnRpY2VzU2NhbGVkID0gdGhpcy5fYlZlcnRleFNwaGVyZVNjYWxlZDtcblxuICAgIGlmKHRoaXMuX2JVc2VEcmF3RWxlbWVudEFycmF5QmF0Y2gpXG4gICAge1xuICAgICAgICB0aGlzLl9wdXNoRWxlbWVudEFycmF5QmF0Y2goKHNpemUgPT0gc3BoZXJlU2NhbGVMYXN0KSA/IHNwaGVyZVZlcnRpY2VzU2NhbGVkIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlVmVydGljZXModGhpcy5fYlZlcnRleFNwaGVyZSxzaXplLHNwaGVyZVZlcnRpY2VzU2NhbGVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yU3BoZXJlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JUZXhDb29yZHNTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iSW5kZXhTcGhlcmUpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygoc2l6ZSA9PSBzcGhlcmVTY2FsZUxhc3QpID8gc3BoZXJlVmVydGljZXNTY2FsZWQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZVZlcnRpY2VzKHRoaXMuX2JWZXJ0ZXhTcGhlcmUsc2l6ZSxzcGhlcmVWZXJ0aWNlc1NjYWxlZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JTcGhlcmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iVGV4Q29vcmRzU3BoZXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iSW5kZXhTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdNb2RlKTtcblxuICAgIH1cblxuICAgIHRoaXMuX3NwaGVyZVNjYWxlTGFzdCA9IHNpemU7XG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ICAgID0gdGhpcy5zcGhlcmU7XG59O1xuXG4vL1RPRE86IHJlbW92ZSAhISEhISEhISEhISEhISFcblxuRkdMLnByb3RvdHlwZS5saW5lQm94ID0gZnVuY3Rpb24odjAsdjEpe3RoaXMubGluZUJveGYodjBbMF0sdjBbMV0sdjBbMl0sdjFbMF0sdjFbMV0sdjFbMl0pO307XG5cbkZHTC5wcm90b3R5cGUubGluZUJveGYgPSBmdW5jdGlvbih4MCx5MCx6MCx4MSx5MSx6MSlcbntcblxuXG4gICAgdmFyIHAwID0gdGhpcy5fYlBvaW50MCxcbiAgICAgICAgcDEgPSB0aGlzLl9iUG9pbnQxLFxuICAgICAgICB1cCA9IHRoaXMuX2F4aXNZO1xuXG4gICAgVmVjMy5zZXQzZihwMCx4MCx5MCx6MCk7XG4gICAgVmVjMy5zZXQzZihwMSx4MSx5MSx6MSk7XG5cbiAgICB2YXIgbGVuID0gVmVjMy5kaXN0YW5jZShwMCxwMSksXG4gICAgICAgIG1pZCA9IFZlYzMuc2NhbGUoVmVjMy5hZGRlZChwMCxwMSksMC41KSxcbiAgICAgICAgZGlyID0gVmVjMy5ub3JtYWxpemUoVmVjMy5zdWJiZWQocDEscDApKSxcbiAgICAgICAgYyAgID0gVmVjMy5kb3QoZGlyLHVwKTtcblxuICAgIHZhciBhbmdsZSA9IE1hdGguYWNvcyhjKSxcbiAgICAgICAgYXhpcyAgPSBWZWMzLm5vcm1hbGl6ZShWZWMzLmNyb3NzKHVwLGRpcikpO1xuXG4gICAgdGhpcy5wdXNoTWF0cml4KCk7XG4gICAgdGhpcy50cmFuc2xhdGUobWlkKTtcbiAgICB0aGlzLnJvdGF0ZUF4aXMoYW5nbGUsYXhpcyk7XG4gICAgdGhpcy5ib3godGhpcy5fbGluZUJveFdpZHRoLGxlbix0aGlzLl9saW5lQm94SGVpZ2h0KTtcbiAgICB0aGlzLnBvcE1hdHJpeCgpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gY29udmVuaWVuY2UgYmluZGluZ3MgZ2xcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuRkdMLnByb3RvdHlwZS5lbmFibGUgICAgICAgICAgICAgICAgPSBmdW5jdGlvbihpZCl7dGhpcy5nbC5lbmFibGUoaWQpO307XG5GR0wucHJvdG90eXBlLmRpc2FibGUgICAgICAgICAgICAgICA9IGZ1bmN0aW9uKGlkKXt0aGlzLmdsLmRpc2FibGUoaWQpO307XG5cbkZHTC5wcm90b3R5cGUuYmxlbmRDb2xvciAgICAgICAgICAgID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5nbC5ibGVuZENvbG9yKHIsZyxiLGEpO307XG5GR0wucHJvdG90eXBlLmJsZW5kRXF1YXRpb24gICAgICAgICA9IGZ1bmN0aW9uKG1vZGUpe3RoaXMuZ2wuYmxlbmRFcXVhdGlvbihtb2RlKTt9O1xuRkdMLnByb3RvdHlwZS5ibGVuZEVxdWF0aW9uU2VwYXJhdGUgPSBmdW5jdGlvbihzZmFjdG9yLGRmYWN0b3Ipe3RoaXMuZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKHNmYWN0b3IsZGZhY3Rvcik7fTtcbkZHTC5wcm90b3R5cGUuYmxlbmRGdW5jICAgICAgICAgICAgID0gZnVuY3Rpb24oc2ZhY3RvcixkZmFjdG9yKXt0aGlzLmdsLmJsZW5kRnVuYyhzZmFjdG9yLGRmYWN0b3IpO307XG5GR0wucHJvdG90eXBlLmJsZW5kRnVuY1NlcGFyYXRlICAgICA9IGZ1bmN0aW9uKHNyY1JHQixkc3RSR0Isc3JjQWxwaGEsZHN0QWxwaGEpe3RoaXMuZ2wuYmxlbmRGdW5jU2VwYXJhdGUoc3JjUkdCLGRzdFJHQixzcmNBbHBoYSxkc3RBbHBoYSk7fTtcbkZHTC5wcm90b3R5cGUuZGVwdGhGdW5jICAgICAgICAgICAgID0gZnVuY3Rpb24oZnVuYyl7dGhpcy5nbC5kZXB0aEZ1bmMoZnVuYyk7fTtcbkZHTC5wcm90b3R5cGUuc2FtcGxlQ292ZXJhZ2UgICAgICAgID0gZnVuY3Rpb24odmFsdWUsaW52ZXJ0KXt0aGlzLmdsLnNhbXBsZUNvdmVyYWdlKHZhbHVlLGludmVydCk7fTtcbkZHTC5wcm90b3R5cGUuc3RlbmNpbEZ1bmMgICAgICAgICAgID0gZnVuY3Rpb24oZnVuYyxyZWYsbWFzayl7dGhpcy5nbC5zdGVuY2lsRnVuYyhmdW5jLHJlZixtYXNrKTt9O1xuRkdMLnByb3RvdHlwZS5zdGVuY2lsRnVuY1NlcGFyYXRlICAgPSBmdW5jdGlvbihmYWNlLGZ1bmMscmVmLG1hc2spe3RoaXMuZ2wuc3RlbmNpbEZ1bmNTZXBhcmF0ZShmYWNlLGZ1bmMscmVmLG1hc2spO307XG5GR0wucHJvdG90eXBlLnN0ZW5jaWxPcCAgICAgICAgICAgICA9IGZ1bmN0aW9uKGZhaWwsemZhaWwsenBhc3Mpe3RoaXMuZ2wuc3RlbmNpbE9wKGZhaWwsemZhaWwsenBhc3MpO307XG5GR0wucHJvdG90eXBlLnN0ZW5jaWxPcFNlcGFyYXRlICAgICA9IGZ1bmN0aW9uKGZhY2UsZmFpbCx6ZmFpbCx6cGFzcyl7dGhpcy5nbC5zdGVuY2lsT3BTZXBhcmF0ZShmYWNlLGZhaWwsemZhaWwsenBhc3MpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIFdvcmxkIC0+IFNjcmVlblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86IEZpeCBtZVxuRkdMLnByb3RvdHlwZS5nZXRTY3JlZW5Db29yZDNmID0gZnVuY3Rpb24oeCx5LHopXG57XG4gICAgdmFyIG1wbSA9IE1hdDQ0Lm11bHQodGhpcy5fY2FtZXJhLnByb2plY3Rpb25NYXRyaXgsdGhpcy5fbU1vZGVsVmlldyk7XG4gICAgdmFyIHAzZCA9IE1hdDQ0Lm11bHRWZWMzKG1wbSxWZWMzLm1ha2UoeCx5LHopKTtcblxuICAgIHZhciBic2MgPSB0aGlzLl9iU2NyZWVuQ29vcmRzO1xuICAgIGJzY1swXSA9ICgoKHAzZFswXSArIDEpICogMC41KSAqIHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICBic2NbMV0gPSAoKCgxIC0gcDNkWzFdKSAqIDAuNSkgKiB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgcmV0dXJuIGJzYztcbn07XG5cbkZHTC5wcm90b3R5cGUuZ2V0U2NyZWVuQ29vcmQgPSBmdW5jdGlvbih2KVxue1xuICAgIHJldHVybiB0aGlzLmdldFNjcmVlbkNvb3JkM2YodlswXSx2WzFdLHZbMV0pO1xufTtcblxuXG5cblxuRkdMLnByb3RvdHlwZS5nZXRNb2RlbFZpZXdNYXRyaXggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbU1vZGVsVmlldzt9O1xuRkdMLnByb3RvdHlwZS5nZXRQcm9qZWN0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2FtZXJhLnByb2plY3Rpb25NYXRyaXg7fTtcblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGR0w7IiwidmFyIFZlYzMgID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9mVmVjMycpLFxuICAgIExpZ2h0ID0gcmVxdWlyZSgnLi9mTGlnaHQnKTtcblxuZnVuY3Rpb24gRGlyZWN0aW9uYWxMaWdodChpZClcbntcbiAgICBMaWdodC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG59XG5cbkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMaWdodC5wcm90b3R5cGUpO1xuXG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5zZXREaXJlY3Rpb24gICA9IGZ1bmN0aW9uKHYpICAgIHtWZWMzLnNldCh0aGlzLmRpcmVjdGlvbix2KTt9O1xuRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUuc2V0RGlyZWN0aW9uM2YgPSBmdW5jdGlvbih4LHkseil7VmVjMy5zZXQzZih0aGlzLmRpcmVjdGlvbix4LHkseik7fTtcblxuRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUubG9va0F0ICAgICAgICAgPSBmdW5jdGlvbihwb3NpdGlvbix0YXJnZXQpXG57XG4gICAgdGhpcy5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy5zZXREaXJlY3Rpb24oVmVjMy5ub3JtYWxpemUoVmVjMy5zdWJiZWQodGFyZ2V0LHBvc2l0aW9uKSkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rpb25hbExpZ2h0OyIsInZhciBWZWMzID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9mVmVjMycpLFxuICAgIFZlYzQgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2ZWZWM0Jyk7XG5cbmZ1bmN0aW9uIExpZ2h0KGlkKVxue1xuICAgIHRoaXMuX2lkICAgPSBpZDtcblxuICAgIHRoaXMuYW1iaWVudCAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuICAgIHRoaXMuZGlmZnVzZSAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuICAgIHRoaXMuc3BlY3VsYXIgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuXG4gICAgdGhpcy5wb3NpdGlvbiAgICAgICAgICAgICA9IFZlYzQuWkVSTygpO1xuICAgIHRoaXMuZGlyZWN0aW9uICAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuc3BvdEV4cG9uZW50ICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuc3BvdEN1dE9mZiAgICAgICAgICAgPSBudWxsO1xuXG4gICAgdGhpcy5jb25zdGFudEF0dGVudHVhdGlvbiA9IDEuMDtcbiAgICB0aGlzLmxpbmVhckF0dGVudHVhdGlvbiAgID0gMDtcbiAgICB0aGlzLnF1YWRyaWNBdHRlbnR1YXRpb24gID0gMC4wMTtcbn1cblxuXG5MaWdodC5wcm90b3R5cGUuc2V0QW1iaWVudCAgICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLmFtYmllbnRbMF0gPSBjb2xvclswXTt0aGlzLmFtYmllbnRbMV0gPSBjb2xvclsxXTt0aGlzLmFtYmllbnRbMl0gPSBjb2xvclsyXTt9O1xuTGlnaHQucHJvdG90eXBlLnNldEFtYmllbnQzZiAgID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5hbWJpZW50WzBdID0gcjt0aGlzLmFtYmllbnRbMV0gPSBnO3RoaXMuYW1iaWVudFsyXSA9IGI7fTtcblxuTGlnaHQucHJvdG90eXBlLnNldERpZmZ1c2UgICAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5kaWZmdXNlWzBdID0gY29sb3JbMF07dGhpcy5kaWZmdXNlWzFdID0gY29sb3JbMV07dGhpcy5kaWZmdXNlWzJdID0gY29sb3JbMl07fTtcbkxpZ2h0LnByb3RvdHlwZS5zZXREaWZmdXNlM2YgICA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuZGlmZnVzZVswXSA9IHI7dGhpcy5kaWZmdXNlWzFdID0gZzt0aGlzLmRpZmZ1c2VbMl0gPSBiO307XG5cbkxpZ2h0LnByb3RvdHlwZS5zZXRTcGVjdWxhciAgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuc3BlY3VsYXJbMF0gPSBjb2xvclswXTt0aGlzLnNwZWN1bGFyWzFdID0gY29sb3JbMV07dGhpcy5zcGVjdWxhclsyXSA9IGNvbG9yWzJdO307XG5MaWdodC5wcm90b3R5cGUuc2V0U3BlY3VsYXIzZiAgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLnNwZWN1bGFyWzBdID0gcjt0aGlzLnNwZWN1bGFyWzFdID0gZzt0aGlzLnNwZWN1bGFyWzJdID0gYjt9O1xuXG5MaWdodC5wcm90b3R5cGUuc2V0UG9zaXRpb24gICAgPSBmdW5jdGlvbih2KSAgICB7VmVjNC5zZXQzZih0aGlzLnBvc2l0aW9uLHZbMF0sdlsxXSx2WzJdKTt9O1xuTGlnaHQucHJvdG90eXBlLnNldFBvc2l0aW9uM2YgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5wb3NpdGlvbix4LHkseik7fTtcblxuTGlnaHQucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faWQ7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodDsiLCJ2YXIgTWF0NDQgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2ZNYXQ0NCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgcGVyc3BlY3RpdmUgOiBmdW5jdGlvbihtLGZvdixhc3BlY3QsbmVhcixmYXIpXG4gICAge1xuICAgICAgICB2YXIgZiAgPSAxLjAgLyBNYXRoLnRhbihmb3YqMC41KSxcbiAgICAgICAgICAgIG5mID0gMS4wIC8gKG5lYXItZmFyKTtcblxuICAgICAgICBtWzBdID0gZiAvIGFzcGVjdDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSBmO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAtMTtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gKDIgKiBmYXIgKiBuZWFyKSAqIG5mO1xuICAgICAgICBtWzE1XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG5cbiAgICB9LFxuXG4gICAgZnJ1c3R1bSA6IGZ1bmN0aW9uKG0sbGVmdCxyaWdodCxib3R0b20sdG9wLG5lYXIsZmFyKVxuICAgIHtcbiAgICAgICAgdmFyIHJsID0gMSAvIChyaWdodCAtIGxlZnQpLFxuICAgICAgICAgICAgdGIgPSAxIC8gKHRvcCAtIGJvdHRvbSksXG4gICAgICAgICAgICBuZiA9IDEgLyAobmVhciAtIGZhcik7XG5cblxuICAgICAgICBtWyAwXSA9IChuZWFyICogMikgKiBybDtcbiAgICAgICAgbVsgMV0gPSAwO1xuICAgICAgICBtWyAyXSA9IDA7XG4gICAgICAgIG1bIDNdID0gMDtcbiAgICAgICAgbVsgNF0gPSAwO1xuICAgICAgICBtWyA1XSA9IChuZWFyICogMikgKiB0YjtcbiAgICAgICAgbVsgNl0gPSAwO1xuICAgICAgICBtWyA3XSA9IDA7XG4gICAgICAgIG1bIDhdID0gKHJpZ2h0ICsgbGVmdCkgKiBybDtcbiAgICAgICAgbVsgOV0gPSAodG9wICsgYm90dG9tKSAqIHRiO1xuICAgICAgICBtWzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgICBtWzExXSA9IC0xO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAoZmFyICogbmVhciAqIDIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMDtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbG9va0F0IDogZnVuY3Rpb24obSxleWUsdGFyZ2V0LHVwKVxuICAgIHtcbiAgICAgICAgdmFyIHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGxlbixcbiAgICAgICAgICAgIGV5ZXggPSBleWVbMF0sXG4gICAgICAgICAgICBleWV5ID0gZXllWzFdLFxuICAgICAgICAgICAgZXlleiA9IGV5ZVsyXSxcbiAgICAgICAgICAgIHVweCA9IHVwWzBdLFxuICAgICAgICAgICAgdXB5ID0gdXBbMV0sXG4gICAgICAgICAgICB1cHogPSB1cFsyXSxcbiAgICAgICAgICAgIHRhcmdldHggPSB0YXJnZXRbMF0sXG4gICAgICAgICAgICB0YXJ0ZXR5ID0gdGFyZ2V0WzFdLFxuICAgICAgICAgICAgdGFyZ2V0eiA9IHRhcmdldFsyXTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoZXlleCAtIHRhcmdldHgpIDwgMC4wMDAwMDEgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGV5ZXkgLSB0YXJ0ZXR5KSA8IDAuMDAwMDAxICYmXG4gICAgICAgICAgICBNYXRoLmFicyhleWV6IC0gdGFyZ2V0eikgPCAwLjAwMDAwMSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdDQ0LmlkZW50aXR5KG0pO1xuICAgICAgICB9XG5cbiAgICAgICAgejAgPSBleWV4IC0gdGFyZ2V0eDtcbiAgICAgICAgejEgPSBleWV5IC0gdGFydGV0eTtcbiAgICAgICAgejIgPSBleWV6IC0gdGFyZ2V0ejtcblxuICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XG4gICAgICAgIHowICo9IGxlbjtcbiAgICAgICAgejEgKj0gbGVuO1xuICAgICAgICB6MiAqPSBsZW47XG5cbiAgICAgICAgeDAgPSB1cHkgKiB6MiAtIHVweiAqIHoxO1xuICAgICAgICB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XG4gICAgICAgIHgyID0gdXB4ICogejEgLSB1cHkgKiB6MDtcbiAgICAgICAgbGVuID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XG4gICAgICAgIGlmICghbGVuKSB7XG4gICAgICAgICAgICB4MCA9IDA7XG4gICAgICAgICAgICB4MSA9IDA7XG4gICAgICAgICAgICB4MiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICAgICAgeDEgKj0gbGVuO1xuICAgICAgICAgICAgeDIgKj0gbGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgeTAgPSB6MSAqIHgyIC0gejIgKiB4MTtcbiAgICAgICAgeTEgPSB6MiAqIHgwIC0gejAgKiB4MjtcbiAgICAgICAgeTIgPSB6MCAqIHgxIC0gejEgKiB4MDtcblxuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeTAgKiB5MCArIHkxICogeTEgKyB5MiAqIHkyKTtcbiAgICAgICAgaWYgKCFsZW4pIHtcbiAgICAgICAgICAgIHkwID0gMDtcbiAgICAgICAgICAgIHkxID0gMDtcbiAgICAgICAgICAgIHkyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgICAgICB5MCAqPSBsZW47XG4gICAgICAgICAgICB5MSAqPSBsZW47XG4gICAgICAgICAgICB5MiAqPSBsZW47XG4gICAgICAgIH1cblxuICAgICAgICBtWyAwXSA9IHgwO1xuICAgICAgICBtWyAxXSA9IHkwO1xuICAgICAgICBtWyAyXSA9IHowO1xuICAgICAgICBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDRdID0geDE7XG4gICAgICAgIG1bIDVdID0geTE7XG4gICAgICAgIG1bIDZdID0gejE7XG4gICAgICAgIG1bIDddID0gMDtcbiAgICAgICAgbVsgOF0gPSB4MjtcbiAgICAgICAgbVsgOV0gPSB5MjtcbiAgICAgICAgbVsxMF0gPSB6MjtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KTtcbiAgICAgICAgbVsxM10gPSAtKHkwICogZXlleCArIHkxICogZXlleSArIHkyICogZXlleik7XG4gICAgICAgIG1bMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxufTsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2ZDb2xvcicpO1xuXG5mdW5jdGlvbiBNYXRlcmlhbChhbWJpZW50LGRpZmZ1c2Usc3BlY3VsYXIsc2hpbmluZXNzLGVtaXNzaW9uKVxue1xuICAgIGFtYmllbnQgICA9IGFtYmllbnQgICB8fCBDb2xvci5tYWtlKDEuMCwwLjUsMC41LDEuMCk7XG4gICAgZGlmZnVzZSAgID0gZGlmZnVzZSAgIHx8IENvbG9yLkJMQUNLKCk7XG4gICAgc3BlY3VsYXIgID0gc3BlY3VsYXIgIHx8IENvbG9yLkJMQUNLKCk7XG4gICAgc2hpbmluZXNzID0gc2hpbmluZXNzIHx8IDEwLjA7XG4gICAgZW1pc3Npb24gID0gZW1pc3Npb24gIHx8IENvbG9yLkJMQUNLO1xuXG4gICAgdGhpcy5lbWlzc2lvbiAgPSBlbWlzc2lvbjtcbiAgICB0aGlzLmFtYmllbnQgICA9IGFtYmllbnQ7XG4gICAgdGhpcy5kaWZmdXNlICAgPSBkaWZmdXNlO1xuICAgIHRoaXMuc3BlY3VsYXIgID0gc3BlY3VsYXI7XG4gICAgdGhpcy5zaGluaW5lc3MgPSBzaGluaW5lc3M7XG59XG5cbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRFbWlzc2lvbiAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5lbWlzc2lvbiA9IGNvbG9yO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RW1pc3Npb24zZiA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuZW1pc3Npb25bMF0gPSByO3RoaXMuZW1pc3Npb25bMV0gPSBnO3RoaXMuZW1pc3Npb25bMl0gPSBiO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RW1pc3Npb240ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuZW1pc3Npb25bMF0gPSByO3RoaXMuZW1pc3Npb25bMV0gPSBnO3RoaXMuZW1pc3Npb25bMl0gPSBiO3RoaXMuZW1pc3Npb25bM10gPSBhO307XG5cbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRBbWJpZW50ICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLmFtYmllbnQgPSBjb2xvcjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEFtYmllbnQzZiA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuYW1iaWVudFswXSA9IHI7dGhpcy5hbWJpZW50WzFdID0gZzt0aGlzLmFtYmllbnRbMl0gPSBiO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0QW1iaWVudDRmID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5hbWJpZW50WzBdID0gcjt0aGlzLmFtYmllbnRbMV0gPSBnO3RoaXMuYW1iaWVudFsyXSA9IGI7dGhpcy5hbWJpZW50WzNdID0gYTt9O1xuXG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RGlmZnVzZSAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5kaWZmdXNlID0gY29sb3I7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXREaWZmdXNlM2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLmRpZmZ1c2VbMF0gPSByO3RoaXMuZGlmZnVzZVsxXSA9IGc7dGhpcy5kaWZmdXNlWzJdID0gYjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldERpZmZ1c2U0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuZGlmZnVzZVswXSA9IHI7dGhpcy5kaWZmdXNlWzFdID0gZzt0aGlzLmRpZmZ1c2VbMl0gPSBiO3RoaXMuZGlmZnVzZVszXSA9IGE7fTtcblxuTWF0ZXJpYWwucHJvdG90eXBlLnNldFNwZWN1bGFyICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLnNwZWN1bGFyID0gY29sb3I7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRTcGVjdWxhcjNmID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5zcGVjdWxhclswXSA9IHI7dGhpcy5zcGVjdWxhclsxXSA9IGc7dGhpcy5zcGVjdWxhclsyXSA9IGI7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRTcGVjdWxhcjRmID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5zcGVjdWxhclswXSA9IHI7dGhpcy5zcGVjdWxhclsxXSA9IGc7dGhpcy5zcGVjdWxhclsyXSA9IGI7dGhpcy5zcGVjdWxhclszXSA9IGE7fTtcblxuXG5NYXRlcmlhbC5wcm90b3R5cGUuZ2V0RW1pc3Npb24gID0gZnVuY3Rpb24oKXtyZXR1cm4gQ29sb3IuY29weSh0aGlzLmVtaXNzaW9uKTt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLmdldEFtYmllbnQgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIENvbG9yLmNvcHkodGhpcy5hbWJpZW50KTt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLmdldERpZmZ1c2UgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIENvbG9yLmNvcHkodGhpcy5kaWZmdXNlKTt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLmdldFNwZWN1bGFyICA9IGZ1bmN0aW9uKCl7cmV0dXJuIENvbG9yLmNvcHkodGhpcy5zcGVjdWxhcik7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXRTaGluaW5lc3MgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLnNoaW5pbmVzczt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsO1xuIiwidmFyIExpZ2h0ID0gcmVxdWlyZSgnLi9mTGlnaHQnKTtcblxuZnVuY3Rpb24gUG9pbnRMaWdodChpZClcbntcbiAgICBMaWdodC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG59XG5cblBvaW50TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMaWdodC5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50TGlnaHQ7IiwidmFyIERpcmVjdGlvbmFsTGlnaHQgPSByZXF1aXJlKCcuL2ZEaXJlY3Rpb25hbExpZ2h0Jyk7XG5cbmZ1bmN0aW9uIFNwb3RMaWdodChpZClcbntcbiAgICBEaXJlY3Rpb25hbExpZ2h0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcbn1cblxuU3BvdExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUpO1xuXG5TcG90TGlnaHQucHJvdG90eXBlLnNldEV4cG9uZW50ID0gZnVuY3Rpb24oKXt9O1xuU3BvdExpZ2h0LnByb3RvdHlwZS5zZXRDdXRPZmYgICA9IGZ1bmN0aW9uKCl7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcG90TGlnaHQ7IiwiXG5mdW5jdGlvbiBUZXh0dXJlKClcbntcbiAgICB0aGlzLl90ZXggPSBudWxsO1xuICAgIHRoaXMuX3dpZHRoID0gbnVsbDtcbiAgICB0aGlzLl9oZWlnaHQgPSBudWxsO1xuXG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAxKXRoaXMuc2V0VGV4U291cmNlKGFyZ3VtZW50c1swXSk7XG59XG5cblRleHR1cmUucHJvdG90eXBlLnNldFRleFNvdXJjZSA9IGZ1bmN0aW9uKGdsVGV4KVxue1xuICAgIHZhciB0ZXggPSB0aGlzLl90ZXggPSBnbFRleDtcbiAgICB0aGlzLl93aWR0aCAgPSB0ZXguaW1hZ2Uud2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gdGV4LmltYWdlLmhlaWdodDtcbn07XG5cblRleHR1cmUucHJvdG90eXBlLmdldFdpZHRoICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dpZHRoO307XG5UZXh0dXJlLnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9oZWlnaHQ7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlOyIsIm1vZHVsZS5leHBvcnRzID1cInZhcnlpbmcgdmVjNCB2VmVydGV4UG9zaXRpb247dmFyeWluZyB2ZWMzIHZWZXJ0ZXhOb3JtYWw7dmFyeWluZyB2ZWM0IHZWZXJ0ZXhDb2xvcjt2YXJ5aW5nIHZlYzIgdlZlcnRleFRleENvb3JkO3VuaWZvcm0gZmxvYXQgdVVzZUxpZ2h0aW5nO3VuaWZvcm0gZmxvYXQgdVVzZU1hdGVyaWFsO3VuaWZvcm0gZmxvYXQgdVVzZVRleHR1cmU7dW5pZm9ybSBtYXQzIHVOb3JtYWxNYXRyaXg7dW5pZm9ybSB2ZWMzIHVBbWJpZW50O3VuaWZvcm0gc2FtcGxlcjJEIHVUZXhJbWFnZTtjb25zdCBpbnQgTUFYX0xJR0hUUyA9IDg7c3RydWN0IExpZ2h0eyB2ZWM0IHBvc2l0aW9uOyB2ZWMzIGFtYmllbnQ7IHZlYzMgZGlmZnVzZTsgdmVjMyBzcGVjdWxhcjsgdmVjNCBoYWxmVmVjdG9yOyB2ZWMzIHNwb3REaXJlY3Rpb247IGZsb2F0IHNwb3RFeHBvbmVudDsgZmxvYXQgc3BvdEN1dG9mZjsgZmxvYXQgc3BvdENvc0N1dG9mZjsgZmxvYXQgY29uc3RhbnRBdHRlbnVhdGlvbjsgZmxvYXQgbGluZWFyQXR0ZW51YXRpb247IGZsb2F0IHF1YWRyYXRpY0F0dGVudWF0aW9uO307c3RydWN0IE1hdGVyaWFseyB2ZWM0IGVtaXNzaW9uOyB2ZWM0IGFtYmllbnQ7IHZlYzQgZGlmZnVzZTsgdmVjNCBzcGVjdWxhcjsgZmxvYXQgc2hpbmluZXNzO307c3RydWN0IENvbG9yQ29tcG9uZW50eyB2ZWM0IGFtYmllbnQ7IHZlYzQgZGlmZnVzZTsgdmVjNCBzcGVjdWxhcjsgZmxvYXQgc2hpbmluZXNzO307dmVjNCBwaG9uZ01vZGVsKHZlYzQgcG9zaXRpb24sIHZlYzMgbm9ybWFsLCBDb2xvckNvbXBvbmVudCBjb2xvciwgTGlnaHQgbGlnaHQpeyB2ZWMzIGRpZmYgPSBsaWdodC5wb3NpdGlvbi54eXogLSBwb3NpdGlvbi54eXo7IHZlYzMgcyA9IG5vcm1hbGl6ZShkaWZmKTsgdmVjMyB2ID0gbm9ybWFsaXplKC1wb3NpdGlvbi54eXopOyB2ZWMzIHIgPSByZWZsZWN0KC1zLCBub3JtYWwpOyBmbG9hdCBzRG90TiA9IG1heChkb3Qocywgbm9ybWFsKSwgMC4wKTsgZmxvYXQgZGlzdCA9IGxlbmd0aChkaWZmLnh5eik7IGZsb2F0IGF0dCA9IDEuMCAvIChsaWdodC5jb25zdGFudEF0dGVudWF0aW9uICsgbGlnaHQubGluZWFyQXR0ZW51YXRpb24gKiBkaXN0ICsgbGlnaHQucXVhZHJhdGljQXR0ZW51YXRpb24gKiBkaXN0ICogZGlzdCk7IHZlYzMgYW1iaWVudCA9IHVBbWJpZW50ICogbGlnaHQuYW1iaWVudCAqIGNvbG9yLmFtYmllbnQucmdiOyB2ZWMzIGRpZmZ1c2UgPSBsaWdodC5kaWZmdXNlICogY29sb3IuZGlmZnVzZS5yZ2IgKiBzRG90TiA7IHZlYzMgc3BlY3VsYXIgPSAoKHNEb3ROID4gMC4wKSA/IGxpZ2h0LnNwZWN1bGFyICogcG93KG1heChkb3QociwgdiksIDAuMCksIGNvbG9yLnNoaW5pbmVzcykgOiB2ZWMzKDAuMCkpOyByZXR1cm4gdmVjNChhbWJpZW50KmF0dCsgZGlmZnVzZSphdHQgKyBzcGVjdWxhciphdHQsY29sb3IuYW1iaWVudC5hKTt9dW5pZm9ybSBMaWdodCB1TGlnaHRzWzhdO3VuaWZvcm0gTWF0ZXJpYWwgdU1hdGVyaWFsO3ZvaWQgbWFpbih2b2lkKXsgZmxvYXQgdXNlTGlnaHRpbmdJbnYgPSAxLjAgLSB1VXNlTGlnaHRpbmc7IGZsb2F0IHVzZU1hdGVyaWFsSW52ID0gMS4wIC0gdVVzZU1hdGVyaWFsOyBmbG9hdCB1c2VUZXh0dXJlSW52ID0gMS4wIC0gdVVzZVRleHR1cmU7IHZlYzMgdFZlcnRleE5vcm1hbCA9IChnbF9Gcm9udEZhY2luZyA/IC0xLjAgOiAxLjApICogbm9ybWFsaXplKHVOb3JtYWxNYXRyaXggKiB2VmVydGV4Tm9ybWFsKTsgdmVjNCB2ZXJ0ZXhDb2xvciA9IHZWZXJ0ZXhDb2xvciAqIHVzZU1hdGVyaWFsSW52OyB2ZWM0IHRleHR1cmVDb2xvciA9IHRleHR1cmUyRCh1VGV4SW1hZ2UsdlZlcnRleFRleENvb3JkKTsgdmVjNCByZXN1bHRDb2xvciA9IHZlcnRleENvbG9yICogdXNlVGV4dHVyZUludiArIHRleHR1cmVDb2xvciAqIHVVc2VUZXh0dXJlOyBDb2xvckNvbXBvbmVudCBjb2xvciA9IENvbG9yQ29tcG9uZW50KHVNYXRlcmlhbC5hbWJpZW50ICogdVVzZU1hdGVyaWFsICsgcmVzdWx0Q29sb3IsIHVNYXRlcmlhbC5kaWZmdXNlICogdVVzZU1hdGVyaWFsICsgcmVzdWx0Q29sb3IsIHVNYXRlcmlhbC5zcGVjdWxhciAqIHVVc2VNYXRlcmlhbCArIHJlc3VsdENvbG9yLCB1TWF0ZXJpYWwuc2hpbmluZXNzICogdVVzZU1hdGVyaWFsICsgdXNlTWF0ZXJpYWxJbnYpOyB2ZWM0IGxpZ2h0aW5nQ29sb3IgPSB2ZWM0KDAsMCwwLDApOyBmb3IoaW50IGkgPSAwO2kgPCBNQVhfTElHSFRTO2krKykgeyBsaWdodGluZ0NvbG9yKz1waG9uZ01vZGVsKHZWZXJ0ZXhQb3NpdGlvbix0VmVydGV4Tm9ybWFsLGNvbG9yLHVMaWdodHNbaV0pOyB9IGdsX0ZyYWdDb2xvciA9IHVVc2VMaWdodGluZyAqIGxpZ2h0aW5nQ29sb3IgKyB1c2VMaWdodGluZ0ludiAqICh2VmVydGV4Q29sb3IgKiB1c2VUZXh0dXJlSW52ICsgdGV4dHVyZUNvbG9yICogdVVzZVRleHR1cmUpO31cIjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgbG9hZFByb2dyYW0gOiBmdW5jdGlvbihnbCx2ZXJ0ZXhTaGFkZXIsZnJhZ21lbnRTaGFkZXIpXG4gICAge1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSx2ZXJ0ZXhTaGFkZXIpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSxmcmFnbWVudFNoYWRlcik7XG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sZ2wuTElOS19TVEFUVVMpKVxuICAgICAgICB7XG4gICAgICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvZ3JhbTtcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID1cImF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjthdHRyaWJ1dGUgdmVjMyBhVmVydGV4Tm9ybWFsO2F0dHJpYnV0ZSB2ZWM0IGFWZXJ0ZXhDb2xvcjthdHRyaWJ1dGUgdmVjMiBhVmVydGV4VGV4Q29vcmQ7dmFyeWluZyB2ZWM0IHZWZXJ0ZXhQb3NpdGlvbjt2YXJ5aW5nIHZlYzMgdlZlcnRleE5vcm1hbDt2YXJ5aW5nIHZlYzQgdlZlcnRleENvbG9yO3ZhcnlpbmcgdmVjMiB2VmVydGV4VGV4Q29vcmQ7dW5pZm9ybSBtYXQ0IHVNb2RlbFZpZXdNYXRyaXg7dW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O3VuaWZvcm0gZmxvYXQgdVBvaW50U2l6ZTt2b2lkIG1haW4odm9pZCl7IHZWZXJ0ZXhQb3NpdGlvbiA9IHVNb2RlbFZpZXdNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgdlZlcnRleE5vcm1hbCA9IGFWZXJ0ZXhOb3JtYWw7IHZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvcjsgdlZlcnRleFRleENvb3JkID0gYVZlcnRleFRleENvb3JkOyBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdlZlcnRleFBvc2l0aW9uOyBnbF9Qb2ludFNpemUgPSB1UG9pbnRTaXplO31cIjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgUHJlZml4U2hhZGVyV2ViIDogJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycsXG5cbiAgICBsb2FkU2hhZGVyRnJvbVN0cmluZyA6IGZ1bmN0aW9uKGdsLHNvdXJjZVN0cmluZyx0eXBlKVxuICAgIHtcbiAgICAgICAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcblxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLHNvdXJjZVN0cmluZyk7XG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAgICAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlcixnbC5DT01QSUxFX1NUQVRVUykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaGFkZXI7XG4gICAgfVxuXG5cbn07IiwidmFyIFZlYzMgID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9mVmVjMycpLFxuICAgIENvbG9yID0gcmVxdWlyZSgnLi4vLi4vdXRpbC9mQ29sb3InKTtcblxudmFyIGZHTFV0aWwgPSB7fTtcblxuZkdMVXRpbC5fX2dyaWRTaXplTGFzdCA9IC0xO1xuZkdMVXRpbC5fX2dyaWRVbml0TGFzdCA9IC0xO1xuXG5cblxuZkdMVXRpbC5kcmF3R3JpZCA9IGZ1bmN0aW9uKGtnbCxzaXplLHVuaXQpXG57XG4gICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgIHZhciBpICA9IC0xLFxuICAgICAgICBzaCA9IHNpemUgKiAwLjUgKiB1bml0O1xuXG4gICAgdmFyIHVpO1xuXG4gICAgd2hpbGUoKytpIDwgc2l6ZSArIDEpXG4gICAge1xuICAgICAgICB1aSA9IHVuaXQgKiBpO1xuXG4gICAgICAgIGtnbC5saW5lZigtc2gsMCwtc2ggKyB1aSxzaCwwLC1zaCt1aSk7XG4gICAgICAgIGtnbC5saW5lZigtc2grdWksMCwtc2gsLXNoK3VpLDAsc2gpO1xuICAgIH1cbn07XG5cbmZHTFV0aWwuZHJhd0F4ZXMgPSBmdW5jdGlvbihrZ2wsdW5pdClcbntcbiAgICBrZ2wuY29sb3IzZigxLDAsMCk7XG4gICAga2dsLmxpbmVmKDAsMCwwLHVuaXQsMCwwKTtcbiAgICBrZ2wuY29sb3IzZigwLDEsMCk7XG4gICAga2dsLmxpbmVmKDAsMCwwLDAsdW5pdCwwKTtcbiAgICBrZ2wuY29sb3IzZigwLDAsMSk7XG4gICAga2dsLmxpbmVmKDAsMCwwLDAsMCx1bml0KTtcbn07XG5cbmZHTFV0aWwuZHJhd0dyaWRDdWJlID0gZnVuY3Rpb24oa2dsLHNpemUsdW5pdClcbntcbiAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgdmFyIHNoICA9IHNpemUgKiAwLjUgKiB1bml0LFxuICAgICAgICBwaWggPSBNYXRoLlBJICogMC41O1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2YoMCwtc2gsMCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZigwLHNoLDApO1xuICAgIGtnbC5yb3RhdGUzZigwLHBpaCwwKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKDAsMCwtc2gpO1xuICAgIGtnbC5yb3RhdGUzZihwaWgsMCwwKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKDAsMCxzaCk7XG4gICAga2dsLnJvdGF0ZTNmKHBpaCwwLDApO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2Yoc2gsMCwwKTtcbiAgICBrZ2wucm90YXRlM2YocGloLDAscGloKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKC1zaCwwLDApO1xuICAgIGtnbC5yb3RhdGUzZihwaWgsMCxwaWgpO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG59O1xuXG5cbmZHTFV0aWwucHlyYW1pZCA9IGZ1bmN0aW9uKGtnbCxzaXplKVxue1xuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnNjYWxlM2Yoc2l6ZSxzaXplLHNpemUpO1xuICAgIGtnbC5kcmF3RWxlbWVudHModGhpcy5fX2JWZXJ0ZXhQeXJhbWlkLHRoaXMuX19iTm9ybWFsUHlyYW1pZCxrZ2wuYnVmZmVyQ29sb3JzKGtnbC5fYkNvbG9yLHRoaXMuX19iQ29sb3JQeXJhbWlkKSxudWxsLHRoaXMuX19iSW5kZXhQeXJhbWlkLGtnbC5fZHJhd01vZGUpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcbn07XG5cblxuXG5mR0xVdGlsLm9jdGFoZWRyb24gPSBmdW5jdGlvbihrZ2wsc2l6ZSlcbntcbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC5zY2FsZTNmKHNpemUsc2l6ZSxzaXplKTtcbiAgICBrZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4T2N0YWhlZHJvbiwgdGhpcy5fX2JOb3JtYWxPY3RhaGVkcm9uLGtnbC5idWZmZXJDb2xvcnMoa2dsLl9iQ29sb3IsIHRoaXMuX19iQ29sb3JPY3RhaGVkcm9uKSxudWxsLCB0aGlzLl9fYkluZGV4T2N0YWhlZHJvbixrZ2wuX2RyYXdNb2RlKTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG59O1xuXG4vKlxudmFyIGZHTFV0aWwgPVxue1xuXG4gICAgZHJhd0dyaWQgOiBmdW5jdGlvbihnbCxzaXplLHVuaXQpXG4gICAge1xuICAgICAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgICAgIHZhciBpICA9IC0xLFxuICAgICAgICAgICAgc2ggPSBzaXplICogMC41ICogdW5pdDtcblxuICAgICAgICB2YXIgdWk7XG5cbiAgICAgICAgd2hpbGUoKytpIDwgc2l6ZSArIDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVpID0gdW5pdCAqIGk7XG5cbiAgICAgICAgICAgIGdsLmxpbmVmKC1zaCwwLC1zaCArIHVpLHNoLDAsLXNoK3VpKTtcbiAgICAgICAgICAgIGdsLmxpbmVmKC1zaCt1aSwwLC1zaCwtc2grdWksMCxzaCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBkcmF3R3JpZEN1YmUgOiBmdW5jdGlvbihnbCxzaXplLHVuaXQpXG4gICAge1xuICAgICAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgICAgIHZhciBzaCAgPSBzaXplICogMC41ICogdW5pdCxcbiAgICAgICAgICAgIHBpaCA9IE1hdGguUEkgKiAwLjU7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZigwLC1zaCwwKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKDAsc2gsMCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKDAscGloLDApO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoMCwwLC1zaCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKHBpaCwwLDApO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoMCwwLHNoKTtcbiAgICAgICAgZ2wucm90YXRlM2YocGloLDAsMCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZihzaCwwLDApO1xuICAgICAgICBnbC5yb3RhdGUzZihwaWgsMCxwaWgpO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoLXNoLDAsMCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKHBpaCwwLHBpaCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICB9LFxuXG5cbiAgICBkcmF3QXhlcyA6IGZ1bmN0aW9uKGdsLHVuaXQpXG4gICAge1xuICAgICAgICBnbC5jb2xvcjNmKDEsMCwwKTtcbiAgICAgICAgZ2wubGluZWYoMCwwLDAsdW5pdCwwLDApO1xuICAgICAgICBnbC5jb2xvcjNmKDAsMSwwKTtcbiAgICAgICAgZ2wubGluZWYoMCwwLDAsMCx1bml0LDApO1xuICAgICAgICBnbC5jb2xvcjNmKDAsMCwxKTtcbiAgICAgICAgZ2wubGluZWYoMCwwLDAsMCwwLHVuaXQpO1xuICAgIH0sXG5cblxuICAgIC8vdGVtcFxuICAgIGRyYXdWZWN0b3JmIDogZnVuY3Rpb24oZ2wseDAseTAsejAseDEseTEsejEpXG4gICAge1xuICAgICAgIFxuXG4gICAgICAgIHZhciBwMCA9IGdsLl9iUG9pbnQwLFxuICAgICAgICAgICAgcDEgPSBnbC5fYlBvaW50MSxcbiAgICAgICAgICAgIHVwID0gZ2wuX2F4aXNZO1xuXG4gICAgICAgIFZlYzMuc2V0M2YocDAseDAseTAsejApO1xuICAgICAgICBWZWMzLnNldDNmKHAxLHgxLHkxLHoxKTtcblxuICAgICAgICB2YXIgcHcgPSBnbC5fbGluZUJveFdpZHRoLFxuICAgICAgICAgICAgcGggPSBnbC5fbGluZUJveEhlaWdodCxcbiAgICAgICAgICAgIHBkID0gZ2wuX2RyYXdNb2RlO1xuXG4gICAgICAgIHZhciBsZW4gPSBWZWMzLmRpc3RhbmNlKHAwLHAxKSxcbiAgICAgICAgICAgIG1pZCA9IFZlYzMuc2NhbGUoVmVjMy5hZGRlZChwMCxwMSksMC41KSxcbiAgICAgICAgICAgIGRpciA9IFZlYzMubm9ybWFsaXplKFZlYzMuc3ViYmVkKHAxLHAwKSksXG4gICAgICAgICAgICBjICAgPSBWZWMzLmRvdChkaXIsdXApO1xuXG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYWNvcyhjKSxcbiAgICAgICAgICAgIGF4aXMgID0gVmVjMy5ub3JtYWxpemUoVmVjMy5jcm9zcyh1cCxkaXIpKTtcblxuXG4gICAgICAgIGdsLmRyYXdNb2RlKGdsLkxJTkVTKTtcblxuICAgICAgICBnbC5saW5lZih4MCx5MCx6MCx4MSx5MSx6MSk7XG5cbiAgICAgICAgZ2wuZHJhd01vZGUoZ2wuVFJJQU5HTEVTKTtcbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUocDEpO1xuICAgICAgICBnbC5yb3RhdGVBeGlzKGFuZ2xlLGF4aXMpO1xuICAgICAgICB0aGlzLnB5cmFtaWQoZ2wsMC4wMjUpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5saW5lU2l6ZShwdyxwaCk7XG4gICAgICAgIGdsLmRyYXdNb2RlKHBkKTtcbiAgICB9LFxuXG4gICAgZHJhd1ZlY3RvciA6IGZ1bmN0aW9uKGdsLHYwLHYxKVxuICAgIHtcbiAgICAgICB0aGlzLmRyYXdWZWN0b3JmKGdsLHYwWzBdLHYwWzFdLHYwWzJdLHYxWzBdLHYxWzFdLHYxWzJdKTtcbiAgICB9LFxuXG4gICAgcHlyYW1pZCA6IGZ1bmN0aW9uKGdsLHNpemUpXG4gICAge1xuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnNjYWxlM2Yoc2l6ZSxzaXplLHNpemUpO1xuICAgICAgICBnbC5kcmF3RWxlbWVudHModGhpcy5fX2JWZXJ0ZXhQeXJhbWlkLHRoaXMuX19iTm9ybWFsUHlyYW1pZCxnbC5maWxsQ29sb3JCdWZmZXIoZ2wuX2JDb2xvcix0aGlzLl9fYkNvbG9yUHlyYW1pZCksbnVsbCx0aGlzLl9fYkluZGV4UHlyYW1pZCxnbC5fZHJhd01vZGUpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcbiAgICB9LFxuXG5cblxuICAgIG9jdGFoZWRyb24gOiBmdW5jdGlvbihnbCxzaXplKVxuICAgIHtcbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC5zY2FsZTNmKHNpemUsc2l6ZSxzaXplKTtcbiAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4T2N0YWhlZHJvbiwgdGhpcy5fX2JOb3JtYWxPY3RhaGVkcm9uLGdsLmZpbGxDb2xvckJ1ZmZlcihnbC5fYkNvbG9yLCB0aGlzLl9fYkNvbG9yT2N0YWhlZHJvbiksbnVsbCwgdGhpcy5fX2JJbmRleE9jdGFoZWRyb24sZ2wuX2RyYXdNb2RlKTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG4gICAgfVxufTtcbiovXG5cbmZHTFV0aWwuX19iVmVydGV4T2N0YWhlZHJvbiA9IG5ldyBGbG9hdDMyQXJyYXkoWy0wLjcwNywwLDAsIDAsMC43MDcsMCwgMCwwLC0wLjcwNywgMCwwLDAuNzA3LCAwLC0wLjcwNywwLCAwLjcwNywwLDBdKTtcbmZHTFV0aWwuX19iTm9ybWFsT2N0YWhlZHJvbiA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTldKTtcbmZHTFV0aWwuX19iQ29sb3JPY3RhaGVkcm9uICA9IG5ldyBGbG9hdDMyQXJyYXkoZkdMVXRpbC5fX2JWZXJ0ZXhPY3RhaGVkcm9uLmxlbmd0aCAvIFZlYzMuU0laRSAqIENvbG9yLlNJWkUpO1xuZkdMVXRpbC5fX2JJbmRleE9jdGFoZWRyb24gID0gbmV3IFVpbnQxNkFycmF5KFszLDQsNSwzLDUsMSwzLDEsMCwzLDAsNCw0LDAsMiw0LDIsNSwyLDAsMSw1LDIsMV0pO1xuZkdMVXRpbC5fX2JWZXJ0ZXhQeXJhbWlkICAgID0gbmV3IEZsb2F0MzJBcnJheShbIDAuMCwxLjAsMC4wLC0xLjAsLTEuMCwxLjAsMS4wLC0xLjAsMS4wLDAuMCwxLjAsMC4wLDEuMCwtMS4wLDEuMCwxLjAsLTEuMCwtMS4wLDAuMCwxLjAsMC4wLDEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLC0xLjAsMC4wLDEuMCwwLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLDEuMCwtMS4wLC0xLjAsMS4wLDEuMCwtMS4wLDEuMCwxLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wXSk7XG5mR0xVdGlsLl9fYk5vcm1hbFB5cmFtaWQgICAgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAtMC40NDcyMTM1OTAxNDUxMTExLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAuODk0NDI3MTgwMjkwMjIyMiwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMC44OTQ0MjcxODAyOTAyMjIyLCAwLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLCAwLCAwLCAwLCAtMSwgMCwgMCwgMCwgMCwgMCwgMSwgMF0pO1xuZkdMVXRpbC5fX2JDb2xvclB5cmFtaWQgICAgID0gbmV3IEZsb2F0MzJBcnJheShmR0xVdGlsLl9fYlZlcnRleFB5cmFtaWQubGVuZ3RoIC8gVmVjMy5TSVpFICogQ29sb3IuU0laRSk7XG5mR0xVdGlsLl9fYkluZGV4UHlyYW1pZCAgICAgPSBuZXcgVWludDE2QXJyYXkoWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwxMiwxMywxNCwxMiwxNSwxNF0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZHTFV0aWw7IiwiXG4vL2ZvciBub2RlIGRlYnVnXG52YXIgTWF0MzMgPVxue1xuICAgIG1ha2UgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLDEsMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCwxXSk7XG4gICAgfSxcblxuICAgIHRyYW5zcG9zZSA6IGZ1bmN0aW9uKG91dCxhKVxuICAgIHtcblxuICAgICAgICBpZiAob3V0ID09PSBhKSB7XG4gICAgICAgICAgICB2YXIgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEyID0gYVs1XTtcbiAgICAgICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgICAgICBvdXRbMl0gPSBhWzZdO1xuICAgICAgICAgICAgb3V0WzNdID0gYTAxO1xuICAgICAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgICAgIG91dFs2XSA9IGEwMjtcbiAgICAgICAgICAgIG91dFs3XSA9IGExMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFswXSA9IGFbMF07XG4gICAgICAgICAgICBvdXRbMV0gPSBhWzNdO1xuICAgICAgICAgICAgb3V0WzJdID0gYVs2XTtcbiAgICAgICAgICAgIG91dFszXSA9IGFbMV07XG4gICAgICAgICAgICBvdXRbNF0gPSBhWzRdO1xuICAgICAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgICAgIG91dFs2XSA9IGFbMl07XG4gICAgICAgICAgICBvdXRbN10gPSBhWzVdO1xuICAgICAgICAgICAgb3V0WzhdID0gYVs4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdDMzOyIsInZhciBmTWF0aCA9IHJlcXVpcmUoJy4vZk1hdGgnKSxcbiAgICBNYXQzMyA9IHJlcXVpcmUoJy4vZk1hdDMzJyk7XG5cbi8vZm9yIG5vZGUgZGVidWdcbnZhciBNYXQ0NCA9XG57XG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgMSwgMCwgMCwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcbiAgICB9LFxuXG4gICAgaWRlbnRpdHkgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgbVsgMF0gPSAxOyBtWyAxXSA9IG1bIDJdID0gbVsgM10gPSAwO1xuICAgICAgICBtWyA1XSA9IDE7IG1bIDRdID0gbVsgNl0gPSBtWyA3XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTsgbVsgOF0gPSBtWyA5XSA9IG1bMTFdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxOyBtWzEyXSA9IG1bMTNdID0gbVsxNF0gPSAwO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjb3B5IDogZnVuY3Rpb24obSlcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KG0pO1xuICAgIH0sXG5cbiAgICBtYWtlU2NhbGUgOiBmdW5jdGlvbihzeCxzeSxzeixtKVxuICAgIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgbVswXSAgPSBzeDtcbiAgICAgICAgbVs1XSAgPSBzeTtcbiAgICAgICAgbVsxMF0gPSBzejtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbWFrZVRyYW5zbGF0ZSA6IGZ1bmN0aW9uKHR4LHR5LHR6LG0pXG4gICAge1xuICAgICAgICBtID0gbSB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICBtWzEyXSA9IHR4O1xuICAgICAgICBtWzEzXSA9IHR5O1xuICAgICAgICBtWzE0XSA9IHR6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlUm90YXRpb25YIDogZnVuY3Rpb24oYSxtKVxuICAgIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVs1XSAgPSBjb3M7XG4gICAgICAgIG1bNl0gID0gLXNpbjtcbiAgICAgICAgbVs5XSAgPSBzaW47XG4gICAgICAgIG1bMTBdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlUm90YXRpb25ZIDogZnVuY3Rpb24oYSxtKVxuICAgIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVswXSA9IGNvcztcbiAgICAgICAgbVsyXSA9IHNpbjtcbiAgICAgICAgbVs4XSA9IC1zaW47XG4gICAgICAgIG1bMTBdPSBjb3M7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG1ha2VSb3RhdGlvblogOiBmdW5jdGlvbihhLG0pXG4gICAge1xuICAgICAgICBtID0gbSB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYSksXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhKTtcblxuICAgICAgICBtWzBdID0gY29zO1xuICAgICAgICBtWzFdID0gc2luO1xuICAgICAgICBtWzRdID0gLXNpbjtcbiAgICAgICAgbVs1XSA9IGNvcztcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbWFrZVJvdGF0aW9uWFlaIDogZnVuY3Rpb24oYXgsYXksYXosbSlcbiAgICB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZhciBjb3N4ID0gTWF0aC5jb3MoYXgpLFxuICAgICAgICAgICAgc2lueCA9IE1hdGguc2luKGF4KSxcbiAgICAgICAgICAgIGNvc3kgPSBNYXRoLmNvcyhheSksXG4gICAgICAgICAgICBzaW55ID0gTWF0aC5zaW4oYXkpLFxuICAgICAgICAgICAgY29zeiA9IE1hdGguY29zKGF6KSxcbiAgICAgICAgICAgIHNpbnogPSBNYXRoLnNpbihheik7XG5cbiAgICAgICAgbVsgMF0gPSAgY29zeSpjb3N6O1xuICAgICAgICBtWyAxXSA9IC1jb3N4KnNpbnorc2lueCpzaW55KmNvc3o7XG4gICAgICAgIG1bIDJdID0gIHNpbngqc2lueitjb3N4KnNpbnkqY29zejtcblxuICAgICAgICBtWyA0XSA9ICBjb3N5KnNpbno7XG4gICAgICAgIG1bIDVdID0gIGNvc3gqY29zeitzaW54KnNpbnkqc2luejtcbiAgICAgICAgbVsgNl0gPSAtc2lueCpjb3N6K2Nvc3gqc2lueSpzaW56O1xuXG4gICAgICAgIG1bIDhdID0gLXNpbnk7XG4gICAgICAgIG1bIDldID0gIHNpbngqY29zeTtcbiAgICAgICAgbVsxMF0gPSAgY29zeCpjb3N5O1xuXG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIC8vdGVtcCBmcm9tIGdsTWF0cml4XG4gICAgbWFrZVJvdGF0aW9uT25BeGlzIDogZnVuY3Rpb24ocm90LHgseSx6LG91dClcbiAgICB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcblxuICAgICAgICBpZihNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSA8IGZNYXRoLkVQU0lMT04pIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgICB2YXIgcywgYywgdCxcbiAgICAgICAgICAgIGEwMCwgYTAxLCBhMDIsIGEwMyxcbiAgICAgICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgICAgIGEyMCwgYTIxLCBhMjIsIGEyMyxcbiAgICAgICAgICAgIGIwMCwgYjAxLCBiMDIsXG4gICAgICAgICAgICBiMTAsIGIxMSwgYjEyLFxuICAgICAgICAgICAgYjIwLCBiMjEsIGIyMjtcblxuXG4gICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgIHggKj0gbGVuO1xuICAgICAgICB5ICo9IGxlbjtcbiAgICAgICAgeiAqPSBsZW47XG5cbiAgICAgICAgcyA9IE1hdGguc2luKHJvdCk7XG4gICAgICAgIGMgPSBNYXRoLmNvcyhyb3QpO1xuICAgICAgICB0ID0gMSAtIGM7XG5cbiAgICAgICAgb3V0ID0gb3V0IHx8IE1hdDQ0Lm1ha2UoKTtcblxuICAgICAgICBhMDAgPSAxOyBhMDEgPSAwOyBhMDIgPSAwOyBhMDMgPSAwO1xuICAgICAgICBhMTAgPSAwOyBhMTEgPSAxOyBhMTIgPSAwOyBhMTMgPSAwO1xuICAgICAgICBhMjAgPSAwOyBhMjEgPSAwOyBhMjIgPSAxOyBhMjMgPSAwO1xuXG4gICAgICAgIGIwMCA9IHggKiB4ICogdCArIGM7IGIwMSA9IHkgKiB4ICogdCArIHogKiBzOyBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICAgICAgYjEwID0geCAqIHkgKiB0IC0geiAqIHM7IGIxMSA9IHkgKiB5ICogdCArIGM7IGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgICAgICBiMjAgPSB4ICogeiAqIHQgKyB5ICogczsgYjIxID0geSAqIHogKiB0IC0geCAqIHM7IGIyMiA9IHogKiB6ICogdCArIGM7XG5cbiAgICAgICAgb3V0WzAgXSA9IGEwMCAqIGIwMCArIGExMCAqIGIwMSArIGEyMCAqIGIwMjtcbiAgICAgICAgb3V0WzEgXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICAgICAgb3V0WzIgXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICAgICAgb3V0WzMgXSA9IGEwMyAqIGIwMCArIGExMyAqIGIwMSArIGEyMyAqIGIwMjtcbiAgICAgICAgb3V0WzQgXSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMjtcbiAgICAgICAgb3V0WzUgXSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICAgICAgb3V0WzYgXSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcbiAgICAgICAgb3V0WzcgXSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMjtcbiAgICAgICAgb3V0WzggXSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcbiAgICAgICAgb3V0WzkgXSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcbiAgICAgICAgb3V0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICAgICAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcblxuICAgICAgICByZXR1cm4gb3V0O1xufSxcblxuICAgIG11bHRQcmUgOiBmdW5jdGlvbihtMCxtMSxtKVxuICAgIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIG0wMDAgPSBtMFsgMF0sbTAwMSA9IG0wWyAxXSxtMDAyID0gbTBbIDJdLG0wMDMgPSBtMFsgM10sXG4gICAgICAgICAgICBtMDA0ID0gbTBbIDRdLG0wMDUgPSBtMFsgNV0sbTAwNiA9IG0wWyA2XSxtMDA3ID0gbTBbIDddLFxuICAgICAgICAgICAgbTAwOCA9IG0wWyA4XSxtMDA5ID0gbTBbIDldLG0wMTAgPSBtMFsxMF0sbTAxMSA9IG0wWzExXSxcbiAgICAgICAgICAgIG0wMTIgPSBtMFsxMl0sbTAxMyA9IG0wWzEzXSxtMDE0ID0gbTBbMTRdLG0wMTUgPSBtMFsxNV07XG5cbiAgICAgICAgdmFyIG0xMDAgPSBtMVsgMF0sbTEwMSA9IG0xWyAxXSxtMTAyID0gbTFbIDJdLG0xMDMgPSBtMVsgM10sXG4gICAgICAgICAgICBtMTA0ID0gbTFbIDRdLG0xMDUgPSBtMVsgNV0sbTEwNiA9IG0xWyA2XSxtMTA3ID0gbTFbIDddLFxuICAgICAgICAgICAgbTEwOCA9IG0xWyA4XSxtMTA5ID0gbTFbIDldLG0xMTAgPSBtMVsxMF0sbTExMSA9IG0xWzExXSxcbiAgICAgICAgICAgIG0xMTIgPSBtMVsxMl0sbTExMyA9IG0xWzEzXSxtMTE0ID0gbTFbMTRdLG0xMTUgPSBtMVsxNV07XG5cbiAgICAgICAgbVsgMF0gPSBtMDAwKm0xMDAgKyBtMDAxKm0xMDQgKyBtMDAyKm0xMDggKyBtMDAzKm0xMTI7XG4gICAgICAgIG1bIDFdID0gbTAwMCptMTAxICsgbTAwMSptMTA1ICsgbTAwMiptMTA5ICsgbTAwMyptMTEzO1xuICAgICAgICBtWyAyXSA9IG0wMDAqbTEwMiArIG0wMDEqbTEwNiArIG0wMDIqbTExMCArIG0wMDMqbTExNDtcbiAgICAgICAgbVsgM10gPSBtMDAwKm0xMDMgKyBtMDAxKm0xMDcgKyBtMDAyKm0xMTEgKyBtMDAzKm0xMTU7XG5cbiAgICAgICAgbVsgNF0gPSBtMDA0Km0xMDAgKyBtMDA1Km0xMDQgKyBtMDA2Km0xMDggKyBtMDA3Km0xMTI7XG4gICAgICAgIG1bIDVdID0gbTAwNCptMTAxICsgbTAwNSptMTA1ICsgbTAwNiptMTA5ICsgbTAwNyptMTEzO1xuICAgICAgICBtWyA2XSA9IG0wMDQqbTEwMiArIG0wMDUqbTEwNiArIG0wMDYqbTExMCArIG0wMDcqbTExNDtcbiAgICAgICAgbVsgN10gPSBtMDA0Km0xMDMgKyBtMDA1Km0xMDcgKyBtMDA2Km0xMTEgKyBtMDA3Km0xMTU7XG5cbiAgICAgICAgbVsgOF0gPSBtMDA4Km0xMDAgKyBtMDA5Km0xMDQgKyBtMDEwKm0xMDggKyBtMDExKm0xMTI7XG4gICAgICAgIG1bIDldID0gbTAwOCptMTAxICsgbTAwOSptMTA1ICsgbTAxMCptMTA5ICsgbTAxMSptMTEzO1xuICAgICAgICBtWzEwXSA9IG0wMDgqbTEwMiArIG0wMDkqbTEwNiArIG0wMTAqbTExMCArIG0wMTEqbTExNDtcbiAgICAgICAgbVsxMV0gPSBtMDA4Km0xMDMgKyBtMDA5Km0xMDcgKyBtMDEwKm0xMTEgKyBtMDExKm0xMTU7XG5cbiAgICAgICAgbVsxMl0gPSBtMDEyKm0xMDAgKyBtMDEzKm0xMDQgKyBtMDE0Km0xMDggKyBtMDE1Km0xMTI7XG4gICAgICAgIG1bMTNdID0gbTAxMiptMTAxICsgbTAxMyptMTA1ICsgbTAxNCptMTA5ICsgbTAxNSptMTEzO1xuICAgICAgICBtWzE0XSA9IG0wMTIqbTEwMiArIG0wMTMqbTEwNiArIG0wMTQqbTExMCArIG0wMTUqbTExNDtcbiAgICAgICAgbVsxNV0gPSBtMDEyKm0xMDMgKyBtMDEzKm0xMDcgKyBtMDE0Km0xMTEgKyBtMDE1Km0xMTU7XG5cblxuXG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG11bHQgOiBmdW5jdGlvbihtMCxtMSxtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdFByZShtMCxtMSk7XG4gICAgfSxcblxuICAgIG11bHRQb3N0IDogZnVuY3Rpb24obTAsbTEsbSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRQcmUobTEsbTAsbSk7XG4gICAgfSxcblxuICAgIGludmVydGVkIDogZnVuY3Rpb24obSlcbiAgICB7XG4gICAgICAgIHZhciBpbnYgPSB0aGlzLm1ha2UoKTtcbiAgICAgICAgaW52WzBdID0gICBtWzVdICogbVsxMF0gKiBtWzE1XSAtIG1bNV0gKiBtWzExXSAqIG1bMTRdIC0gbVs5XSAqIG1bNl0gKiBtWzE1XVxuICAgICAgICAgICAgKyBtWzldICogbVs3XSAqIG1bMTRdICsgbVsxM10gKiBtWzZdICogbVsxMV0gLSBtWzEzXSAqIG1bN10gKiBtWzEwXTtcbiAgICAgICAgaW52WzRdID0gIC1tWzRdICogbVsxMF0gKiBtWzE1XSArIG1bNF0gKiBtWzExXSAqIG1bMTRdICsgbVs4XSAqIG1bNl0gKiBtWzE1XSArXG4gICAgICAgICAgICBtWzhdICogbVs3XSAqIG1bMTRdIC0gbVsxMl0gKiBtWzZdICogbVsxMV0gKyBtWzEyXSAqIG1bN10gKiBtWzEwXTtcbiAgICAgICAgaW52WzhdID0gICBtWzRdICogbVs5XSAqIG1bMTVdIC0gbVs0XSAqIG1bMTFdICogbVsxM10gLSBtWzhdICogbVs1XSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bOF0gKiBtWzddICogbVsxM10gKyBtWzEyXSAqIG1bNV0gKiBtWzExXSAtIG1bMTJdICogbVs3XSAqIG1bOV07XG4gICAgICAgIGludlsxMl0gPSAtbVs0XSAqIG1bOV0gKiBtWzE0XSArIG1bNF0gKiBtWzEwXSAqIG1bMTNdICsgbVs4XSAqIG1bNV0gKiBtWzE0XSArXG4gICAgICAgICAgICBtWzhdICogbVs2XSAqIG1bMTNdIC0gbVsxMl0gKiBtWzVdICogbVsxMF0gKyBtWzEyXSAqIG1bNl0gKiBtWzldO1xuICAgICAgICBpbnZbMV0gPSAgLW1bMV0gKiBtWzEwXSAqIG1bMTVdICsgbVsxXSAqIG1bMTFdICogbVsxNF0gKyBtWzldICogbVsyXSAqIG1bMTVdICtcbiAgICAgICAgICAgIG1bOV0gKiBtWzNdICogbVsxNF0gLSBtWzEzXSAqIG1bMl0gKiBtWzExXSArIG1bMTNdICogbVszXSAqIG1bMTBdO1xuICAgICAgICBpbnZbNV0gPSAgbVswXSAqIG1bMTBdICogbVsxNV0gLSBtWzBdICogbVsxMV0gKiBtWzE0XSAtIG1bOF0gKiBtWzJdICogbVsxNV1cbiAgICAgICAgICAgICsgbVs4XSAqIG1bM10gKiBtWzE0XSArIG1bMTJdICogbVsyXSAqIG1bMTFdIC0gbVsxMl0gKiBtWzNdICogbVsxMF07XG4gICAgICAgIGludls5XSA9IC1tWzBdICogbVs5XSAqIG1bMTVdICsgbVswXSAqIG1bMTFdICogbVsxM10gKyBtWzhdICogbVsxXSAqIG1bMTVdXG4gICAgICAgICAgICAtIG1bOF0gKiBtWzNdICogbVsxM10gLSBtWzEyXSAqIG1bMV0gKiBtWzExXSArIG1bMTJdICogbVszXSAqIG1bOV07XG4gICAgICAgIGludlsxM10gPSBtWzBdICogbVs5XSAqIG1bMTRdIC0gbVswXSAqIG1bMTBdICogbVsxM10gLSBtWzhdICogbVsxXSAqIG1bMTRdXG4gICAgICAgICAgICArIG1bOF0gKiBtWzJdICogbVsxM10gKyBtWzEyXSAqIG1bMV0gKiBtWzEwXSAtIG1bMTJdICogbVsyXSAqIG1bOV07XG4gICAgICAgIGludlsyXSA9IG1bMV0gKiBtWzZdICogbVsxNV0gLSBtWzFdICogbVs3XSAqIG1bMTRdIC0gbVs1XSAqIG1bMl0gKiBtWzE1XVxuICAgICAgICAgICAgKyBtWzVdICogbVszXSAqIG1bMTRdICsgbVsxM10gKiBtWzJdICogbVs3XSAtIG1bMTNdICogbVszXSAqIG1bNl07XG4gICAgICAgIGludls2XSA9IC1tWzBdICogbVs2XSAqIG1bMTVdICsgbVswXSAqIG1bN10gKiBtWzE0XSArIG1bNF0gKiBtWzJdICogbVsxNV1cbiAgICAgICAgICAgIC0gbVs0XSAqIG1bM10gKiBtWzE0XSAtIG1bMTJdICogbVsyXSAqIG1bN10gKyBtWzEyXSAqIG1bM10gKiBtWzZdO1xuICAgICAgICBpbnZbMTBdID0gbVswXSAqIG1bNV0gKiBtWzE1XSAtIG1bMF0gKiBtWzddICogbVsxM10gLSBtWzRdICogbVsxXSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bNF0gKiBtWzNdICogbVsxM10gKyBtWzEyXSAqIG1bMV0gKiBtWzddIC0gbVsxMl0gKiBtWzNdICogbVs1XTtcbiAgICAgICAgaW52WzE0XSA9IC1tWzBdICogbVs1XSAqIG1bMTRdICsgbVswXSAqIG1bNl0gKiBtWzEzXSArIG1bNF0gKiBtWzFdICogbVsxNF1cbiAgICAgICAgICAgIC0gbVs0XSAqIG1bMl0gKiBtWzEzXSAtIG1bMTJdICogbVsxXSAqIG1bNl0gKyBtWzEyXSAqIG1bMl0gKiBtWzVdO1xuICAgICAgICBpbnZbM10gPSAtbVsxXSAqIG1bNl0gKiBtWzExXSArIG1bMV0gKiBtWzddICogbVsxMF0gKyBtWzVdICogbVsyXSAqIG1bMTFdXG4gICAgICAgICAgICAtIG1bNV0gKiBtWzNdICogbVsxMF0gLSBtWzldICogbVsyXSAqIG1bN10gKyBtWzldICogbVszXSAqIG1bNl07XG4gICAgICAgIGludls3XSA9IG1bMF0gKiBtWzZdICogbVsxMV0gLSBtWzBdICogbVs3XSAqIG1bMTBdIC0gbVs0XSAqIG1bMl0gKiBtWzExXVxuICAgICAgICAgICAgKyBtWzRdICogbVszXSAqIG1bMTBdICsgbVs4XSAqIG1bMl0gKiBtWzddIC0gbVs4XSAqIG1bM10gKiBtWzZdO1xuICAgICAgICBpbnZbMTFdID0gLW1bMF0gKiBtWzVdICogbVsxMV0gKyBtWzBdICogbVs3XSAqIG1bOV0gKyBtWzRdICogbVsxXSAqIG1bMTFdXG4gICAgICAgICAgICAtIG1bNF0gKiBtWzNdICogbVs5XSAtIG1bOF0gKiBtWzFdICogbVs3XSArIG1bOF0gKiBtWzNdICogbVs1XTtcbiAgICAgICAgaW52WzE1XSA9IG1bMF0gKiBtWzVdICogbVsxMF0gLSBtWzBdICogbVs2XSAqIG1bOV0gLSBtWzRdICogbVsxXSAqIG1bMTBdXG4gICAgICAgICAgICArIG1bNF0gKiBtWzJdICogbVs5XSArIG1bOF0gKiBtWzFdICogbVs2XSAtIG1bOF0gKiBtWzJdICogbVs1XTtcbiAgICAgICAgdmFyIGRldCA9IG1bMF0qaW52WzBdICsgbVsxXSppbnZbNF0gKyBtWzJdKmludls4XSArIG1bM10qaW52WzEyXTtcbiAgICAgICAgaWYoIGRldCA9PSAwIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xuICAgICAgICB2YXIgbW8gPSB0aGlzLm1ha2UoKTtcbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpPDE2OyArK2kgKVxuICAgICAgICB7XG4gICAgICAgICAgICBtb1tpXSA9IGludltpXSAqIGRldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW87XG4gICAgfSxcblxuICAgIHRyYW5zcG9zZWQgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgdmFyIG1vID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgbW9bMCBdID0gbVswIF07XG4gICAgICAgIG1vWzEgXSA9IG1bNCBdO1xuICAgICAgICBtb1syIF0gPSBtWzggXTtcbiAgICAgICAgbW9bMyBdID0gbVsxMl07XG5cbiAgICAgICAgbW9bNCBdID0gbVsxIF07XG4gICAgICAgIG1vWzUgXSA9IG1bNSBdO1xuICAgICAgICBtb1s2IF0gPSBtWzkgXTtcbiAgICAgICAgbW9bNyBdID0gbVsxM107XG5cbiAgICAgICAgbW9bOCBdID0gbVsyIF07XG4gICAgICAgIG1vWzkgXSA9IG1bNiBdO1xuICAgICAgICBtb1sxMF0gPSBtWzEwXTtcbiAgICAgICAgbW9bMTFdID0gbVsxNF07XG5cbiAgICAgICAgbW9bMTJdID0gbVszIF07XG4gICAgICAgIG1vWzEzXSA9IG1bNyBdO1xuICAgICAgICBtb1sxNF0gPSBtWzExXTtcbiAgICAgICAgbW9bMTVdID0gbVsxNV07XG5cbiAgICAgICAgcmV0dXJuIG1vO1xuICAgIH0sXG5cbiAgICB0b01hdDMzSW52ZXJzZWQgOiBmdW5jdGlvbihtYXQ0NCxtYXQzMylcbiAgICB7XG4gICAgICAgIHZhciBhMDAgPSBtYXQ0NFswXSwgYTAxID0gbWF0NDRbMV0sIGEwMiA9IG1hdDQ0WzJdO1xuICAgICAgICB2YXIgYTEwID0gbWF0NDRbNF0sIGExMSA9IG1hdDQ0WzVdLCBhMTIgPSBtYXQ0NFs2XTtcbiAgICAgICAgdmFyIGEyMCA9IG1hdDQ0WzhdLCBhMjEgPSBtYXQ0NFs5XSwgYTIyID0gbWF0NDRbMTBdO1xuXG4gICAgICAgIHZhciBiMDEgPSBhMjIqYTExLWExMiphMjE7XG4gICAgICAgIHZhciBiMTEgPSAtYTIyKmExMCthMTIqYTIwO1xuICAgICAgICB2YXIgYjIxID0gYTIxKmExMC1hMTEqYTIwO1xuXG4gICAgICAgIHZhciBkID0gYTAwKmIwMSArIGEwMSpiMTEgKyBhMDIqYjIxO1xuICAgICAgICBpZiAoIWQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgdmFyIGlkID0gMS9kO1xuXG5cbiAgICAgICAgaWYoIW1hdDMzKSB7IG1hdDMzID0gTWF0MzMubWFrZSgpOyB9XG5cbiAgICAgICAgbWF0MzNbMF0gPSBiMDEqaWQ7XG4gICAgICAgIG1hdDMzWzFdID0gKC1hMjIqYTAxICsgYTAyKmEyMSkqaWQ7XG4gICAgICAgIG1hdDMzWzJdID0gKGExMiphMDEgLSBhMDIqYTExKSppZDtcbiAgICAgICAgbWF0MzNbM10gPSBiMTEqaWQ7XG4gICAgICAgIG1hdDMzWzRdID0gKGEyMiphMDAgLSBhMDIqYTIwKSppZDtcbiAgICAgICAgbWF0MzNbNV0gPSAoLWExMiphMDAgKyBhMDIqYTEwKSppZDtcbiAgICAgICAgbWF0MzNbNl0gPSBiMjEqaWQ7XG4gICAgICAgIG1hdDMzWzddID0gKC1hMjEqYTAwICsgYTAxKmEyMCkqaWQ7XG4gICAgICAgIG1hdDMzWzhdID0gKGExMSphMDAgLSBhMDEqYTEwKSppZDtcblxuICAgICAgICByZXR1cm4gbWF0MzM7XG5cblxuICAgIH0sXG5cbiAgICBtdWx0VmVjMyA6IGZ1bmN0aW9uKG0sdilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdlswXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xuICAgICAgICB2WzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XG4gICAgICAgIHZbMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgbXV0bFZlYzNBIDogZnVuY3Rpb24obSxhLGkpXG4gICAge1xuICAgICAgICBpICo9IDM7XG5cbiAgICAgICAgdmFyIHggPSBhW2kgIF0sXG4gICAgICAgICAgICB5ID0gYVtpKzFdLFxuICAgICAgICAgICAgeiA9IGFbaSsyXTtcblxuICAgICAgICBhW2kgIF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcbiAgICAgICAgYVtpKzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XG4gICAgICAgIGFbaSsyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xuICAgIH0sXG5cbiAgICBtdWx0VmVjM0FJIDogZnVuY3Rpb24obSxhLGkpXG4gICAge1xuICAgICAgICB2YXIgeCA9IGFbaSAgXSxcbiAgICAgICAgICAgIHkgPSBhW2krMV0sXG4gICAgICAgICAgICB6ID0gYVtpKzJdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xuICAgICAgICBhW2krMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcbiAgICAgICAgYVtpKzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XG4gICAgfSxcblxuICAgIG11bHRWZWM0IDogZnVuY3Rpb24obSx2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHZbMF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXSAqIHc7XG4gICAgICAgIHZbMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgICAgIHZbMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XSAqIHc7XG4gICAgICAgIHZbM10gPSBtWyAzXSAqIHggKyBtWyA3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XSAqIHc7XG5cbiAgICAgICAgcmV0dXJuIHY7XG5cblxuICAgIH0sXG5cbiAgICBtdWx0VmVjNEEgOiBmdW5jdGlvbihtLGEsaSlcbiAgICB7XG4gICAgICAgIGkgKj0gMztcblxuICAgICAgICB2YXIgeCA9IGFbaSAgXSxcbiAgICAgICAgICAgIHkgPSBhW2krMV0sXG4gICAgICAgICAgICB6ID0gYVtpKzJdLFxuICAgICAgICAgICAgdyA9IGFbaSszXTtcblxuICAgICAgICBhW2kgIF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXSAqIHc7XG4gICAgICAgIGFbaSsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdICogdztcbiAgICAgICAgYVtpKzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICBhW2krM10gPSBtWyAzXSAqIHggKyBtWyA3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XSAqIHc7XG5cbiAgICB9LFxuXG4gICAgbXVsdFZlYzRBSSA6IGZ1bmN0aW9uKG0sYSxpKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSBhW2kgIF0sXG4gICAgICAgICAgICB5ID0gYVtpKzFdLFxuICAgICAgICAgICAgeiA9IGFbaSsyXSxcbiAgICAgICAgICAgIHcgPSBhW2krM107XG5cbiAgICAgICAgYVtpICBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgICAgICBhW2krMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgICAgIGFbaSsyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICAgICAgYVtpKzNdID0gbVsgM10gKiB4ICsgbVsgN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuXG4gICAgfSxcblxuICAgIGlzRmxvYXRFcXVhbCA6IGZ1bmN0aW9uKG0wLG0xKVxuICAgIHtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpPDE2KVxuICAgICAgICB7XG4gICAgICAgICAgICBpZighZk1hdGguaXNGbG9hdEVxdWFsKG0wW2ldLG0xW2ldKSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICdbJyArIG1bIDBdICsgJywgJyArIG1bIDFdICsgJywgJyArIG1bIDJdICsgJywgJyArIG1bIDNdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDRdICsgJywgJyArIG1bIDVdICsgJywgJyArIG1bIDZdICsgJywgJyArIG1bIDddICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDhdICsgJywgJyArIG1bIDldICsgJywgJyArIG1bMTBdICsgJywgJyArIG1bMTFdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bMTJdICsgJywgJyArIG1bMTNdICsgJywgJyArIG1bMTRdICsgJywgJyArIG1bMTVdICsgJ10nO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0NDQ7IiwidmFyIGZNYXRoID1cbntcbiAgICBQSSAgICAgICAgICA6IE1hdGguUEksXG4gICAgSEFMRl9QSSAgICAgOiBNYXRoLlBJICogMC41LFxuICAgIFFVQVJURVJfUEkgIDogTWF0aC5QSSAqIDAuMjUsXG4gICAgVFdPX1BJICAgICAgOiBNYXRoLlBJICogMixcbiAgICBFUFNJTE9OICAgICA6IDAuMDAwMSxcblxuICAgIGxlcnAgICAgICAgIDogZnVuY3Rpb24oYSxiLHYpe3JldHVybiAoYSooMS12KSkrKGIqdik7fSxcbiAgICBjb3NJbnRycGwgICA6IGZ1bmN0aW9uKGEsYix2KXt2ID0gKDEgLSBNYXRoLmNvcyh2ICogTWF0aC5QSSkpICogMC41O3JldHVybiAoYSAqICgxLXYpICsgYiAqIHYpO30sXG4gICAgY3ViaWNJbnRycGwgOiBmdW5jdGlvbihhLGIsYyxkLHYpXG4gICAge1xuICAgICAgICB2YXIgYTAsYjAsYzAsZDAsdnY7XG5cbiAgICAgICAgdnYgPSB2ICogdjtcbiAgICAgICAgYTAgPSBkIC0gYyAtIGEgKyBiO1xuICAgICAgICBiMCA9IGEgLSBiIC0gYTA7XG4gICAgICAgIGMwID0gYyAtIGE7XG4gICAgICAgIGQwID0gYjtcblxuICAgICAgICByZXR1cm4gYTAqdip2ditiMCp2ditjMCp2K2QwO1xuICAgIH0sXG5cbiAgICBoZXJtaXRlSW50cnBsIDogZnVuY3Rpb24oYSxiLGMsZCx2LHRlbnNpb24sYmlhcylcbiAgICB7XG4gICAgICAgIHZhciB2MCwgdjEsIHYyLCB2MyxcbiAgICAgICAgICAgIGEwLCBiMCwgYzAsIGQwO1xuXG4gICAgICAgIHRlbnNpb24gPSAoMS4wIC0gdGVuc2lvbikgKiAwLjU7XG5cbiAgICAgICAgdmFyIGJpYXNwID0gMSArIGJpYXMsXG4gICAgICAgICAgICBiaWFzbiA9IDEgLSBiaWFzO1xuXG4gICAgICAgIHYyICA9IHYgKiB2O1xuICAgICAgICB2MyAgPSB2MiAqIHY7XG5cbiAgICAgICAgdjAgID0gKGIgLSBhKSAqIGJpYXNwICogdGVuc2lvbjtcbiAgICAgICAgdjAgKz0gKGMgLSBiKSAqIGJpYXNuICogdGVuc2lvbjtcbiAgICAgICAgdjEgID0gKGMgLSBiKSAqIGJpYXNwICogdGVuc2lvbjtcbiAgICAgICAgdjEgKz0gKGQgLSBjKSAqIGJpYXNuICogdGVuc2lvbjtcblxuICAgICAgICBhMCAgPSAyICogdjMgLSAzICogdjIgKyAxO1xuICAgICAgICBiMCAgPSB2MyAtIDIgKiB2MiArIHY7XG4gICAgICAgIGMwICA9IHYzIC0gdjI7XG4gICAgICAgIGQwICA9IC0yICogdjMgKyAzICogdjI7XG5cbiAgICAgICAgcmV0dXJuIGEwICogYiArIGIwICogdjAgKyBjMCAqIHYxICsgZDAgKiBjO1xuICAgIH0sXG5cbiAgICByYW5kb21GbG9hdCA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHZhciByO1xuXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAwOiByID0gTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogciA9IE1hdGgucmFuZG9tKCkgKiBhcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IHIgPSBhcmd1bWVudHNbMF0gKyAoYXJndW1lbnRzWzFdLWFyZ3VtZW50c1swXSkgKiBNYXRoLnJhbmRvbSgpO2JyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfSxcblxuICAgIHJhbmRvbUludGVnZXIgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgcjtcblxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMDogciA9IDAuNSArIE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IHIgPSAwLjUgKyBNYXRoLnJhbmRvbSgpKmFyZ3VtZW50c1swXTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogciA9IGFyZ3VtZW50c1swXSArICggMSArIGFyZ3VtZW50c1sxXSAtIGFyZ3VtZW50c1swXSkgKiBNYXRoLnJhbmRvbSgpO2JyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3Iocik7XG4gICAgfSxcblxuICAgIGNvbnN0cmFpbiA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHZhciByO1xuXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAyOiBhcmd1bWVudHNbMF0gPSAoYXJndW1lbnRzWzBdID4gYXJndW1lbnRzWzFdKSA/IGFyZ3VtZW50c1sxXSA6IGFyZ3VtZW50c1swXTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMzogYXJndW1lbnRzWzBdID0gKGFyZ3VtZW50c1swXSA+IGFyZ3VtZW50c1syXSkgPyBhcmd1bWVudHNbMl0gOiAoYXJndW1lbnRzWzBdIDwgYXJndW1lbnRzWzFdKSA/IGFyZ3VtZW50c1sxXSA6YXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUsc3RhcnQsZW5kKXtyZXR1cm4gKHZhbHVlIC0gc3RhcnQpIC8gKGVuZCAtIHN0YXJ0KTt9LFxuICAgIG1hcCAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlLGluU3RhcnQsaW5FbmQsb3V0U3RhcnQsb3V0RW5kKXtyZXR1cm4gb3V0U3RhcnQgKyAob3V0RW5kIC0gb3V0U3RhcnQpICogbm9ybWFsaXplKHZhbHVlLGluU3RhcnQsaW5FbmQpO30sXG4gICAgc2luICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUpe3JldHVybiBNYXRoLnNpbih2YWx1ZSk7fSxcbiAgICBjb3MgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSl7cmV0dXJuIE1hdGguY29zKHZhbHVlKTt9LFxuICAgIGNsYW1wICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlLG1pbixtYXgpe3JldHVybiBNYXRoLm1heChtaW4sTWF0aC5taW4obWF4LHZhbHVlKSk7fSxcbiAgICBzYXcgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMiAqIChuICAtIE1hdGguZmxvb3IoMC41ICsgbiApKTt9LFxuICAgIHRyaSAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLTQqTWF0aC5hYnMoMC41LXRoaXMuZnJhYygwLjUqbiswLjI1KSk7fSxcbiAgICByZWN0ICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXt2YXIgYSA9IE1hdGguYWJzKG4pO3JldHVybiAoYSA+IDAuNSkgPyAwIDogKGEgPT0gMC41KSA/IDAuNSA6IChhIDwgMC41KSA/IDEgOiAtMTt9LFxuICAgIGZyYWMgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBuIC0gTWF0aC5mbG9vcihuKTt9LFxuICAgIHNnbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBuL01hdGguYWJzKG4pO30sXG4gICAgYWJzICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGguYWJzKG4pO30sXG4gICAgbWluICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgubWluKG4pO30sXG4gICAgbWF4ICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgubWF4KG4pO30sXG4gICAgYXRhbiAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGguYXRhbihuKTt9LFxuICAgIGF0YW4yICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHkseCl7cmV0dXJuIE1hdGguYXRhbjIoeSx4KTt9LFxuICAgIHJvdW5kICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLnJvdW5kKG4pO30sXG4gICAgZmxvb3IgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGguZmxvb3Iobik7fSxcbiAgICB0YW4gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC50YW4obik7fSxcbiAgICByYWQyZGVnICAgICAgICAgICAgICAgOiBmdW5jdGlvbihyYWRpYW5zKXtyZXR1cm4gcmFkaWFucyAqICgxODAgLyBNYXRoLlBJKTt9LFxuICAgIGRlZzJyYWQgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKGRlZ3JlZSl7cmV0dXJuIGRlZ3JlZSAqIChNYXRoLlBJIC8gMTgwKTsgfSxcbiAgICBzcXJ0ICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSl7cmV0dXJuIE1hdGguc3FydCh2YWx1ZSk7fSxcbiAgICBHcmVhdGVzdENvbW1vbkRpdmlzb3IgOiBmdW5jdGlvbihhLGIpe3JldHVybiAoYiA9PSAwKSA/IGEgOiB0aGlzLkdyZWF0ZXN0Q29tbW9uRGl2aXNvcihiLCBhICUgYik7fSxcbiAgICBpc0Zsb2F0RXF1YWwgICAgICAgICAgOiBmdW5jdGlvbihhLGIpe3JldHVybiAoTWF0aC5hYnMoYS1iKTx0aGlzLkVQU0lMT04pO30sXG4gICAgaXNQb3dlck9mVHdvICAgICAgICAgIDogZnVuY3Rpb24oYSl7cmV0dXJuIChhJihhLTEpKT09MDt9LFxuICAgIHN3YXAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKGEsYil7dmFyIHQgPSBhO2EgPSBiOyBiID0gYTt9LFxuICAgIHBvdyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHgseSl7cmV0dXJuIE1hdGgucG93KHgseSk7fSxcbiAgICBsb2cgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5sb2cobik7fSxcbiAgICBjb3NoICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gKE1hdGgucG93KE1hdGguRSxuKSArIE1hdGgucG93KE1hdGguRSwtbikpKjAuNTt9LFxuICAgIGV4cCAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmV4cChuKTt9LFxuICAgIHN0ZXBTbW9vdGggICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBuKm4qKDMtMipuKTt9LFxuICAgIHN0ZXBTbW9vdGhTcXVhcmVkICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLnN0ZXBTbW9vdGgobikgKiB0aGlzLnN0ZXBTbW9vdGgobik7fSxcbiAgICBzdGVwU21vb3RoSW52U3F1YXJlZCAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS0oMS10aGlzLnN0ZXBTbW9vdGgobikpKigxLXRoaXMuc3RlcFNtb290aChuKSk7fSxcbiAgICBzdGVwU21vb3RoQ3ViZWQgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5zdGVwU21vb3RoKG4pKnRoaXMuc3RlcFNtb290aChuKSp0aGlzLnN0ZXBTbW9vdGgobikqdGhpcy5zdGVwU21vb3RoKG4pO30sXG4gICAgc3RlcFNtb290aEludkN1YmVkICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpKigxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKTt9LFxuICAgIHN0ZXBTcXVhcmVkICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBuKm47fSxcbiAgICBzdGVwSW52U3F1YXJlZCAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS0oMS1uKSooMS1uKTt9LFxuICAgIHN0ZXBDdWJlZCAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBuKm4qbipuO30sXG4gICAgc3RlcEludkN1YmVkICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtKDEtbikqKDEtbikqKDEtbikqKDEtbik7fSxcbiAgICBjYXRtdWxscm9tICAgICAgICAgICAgOiBmdW5jdGlvbihhLGIsYyxkLGkpeyByZXR1cm4gYSAqICgoLWkgKyAyKSAqIGkgLSAxKSAqIGkgKiAwLjUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiICogKCgoMyAqIGkgLSA1KSAqIGkpICogaSArIDIpICogMC41ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyAqICgoLTMgKiBpICsgNCkgKiBpICsgMSkgKiBpICogMC41ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZCAqICgoaSAtIDEpICogaSAqIGkpICogMC41O31cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmTWF0aDsiLCJ2YXIgUXVhdGVybmlvbiA9XG57XG4gICAgbWFrZSAgICAgOiBmdW5jdGlvbihuLHYpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFtuLCB2WzBdLHZbMV0sdlsyXV0pO30sXG4gICAgbWFrZTRmICAgOiBmdW5jdGlvbihuLHgseSx6KXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbbix4LHksel0pO30sXG4gICAgemVybyAgICAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMCwwXSk7fSxcbiAgICBzZXQgICAgICA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgcTBbMF0gPSBxMVswXTtcbiAgICAgICAgcTBbMV0gPSBxMVsxXTtcbiAgICAgICAgcTBbMl0gPSBxMVsyXTtcbiAgICAgICAgcTBbM10gPSBxMVszXTtcbiAgICB9LFxuXG4gICAgc2V0NGYgICAgOiBmdW5jdGlvbihxLG4seCx5LHopXG4gICAge1xuICAgICAgICBxWzBdID0gbjtcbiAgICAgICAgcVsxXSA9IHg7XG4gICAgICAgIHFbMl0gPSB5O1xuICAgICAgICBxWzNdID0gejtcblxuICAgIH0sXG5cbiAgICBjb3B5ICAgICA6IGZ1bmN0aW9uKHEpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KHEpO30sXG5cbiAgICBsZW5ndGggICA6IGZ1bmN0aW9uKHEpe3ZhciBuID0gcVswXSx4ID0gcVsxXSx5ID0gcVsyXSx6ID0gcVszXTsgcmV0dXJuIE1hdGguc3FydChuKm4reCp4K3kqeSt6KnopO30sXG4gICAgdmVjdG9yICAgOiBmdW5jdGlvbihxKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShxWzFdLHFbMl0scVszXSk7fSxcbiAgICBzY2FsYXIgICA6IGZ1bmN0aW9uKHEpe3JldHVybiBxWzBdO30sXG5cblxuXG4gICAgYWRkIDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICBxMFswXSA9IHEwWzBdICsgcTFbMF07XG4gICAgICAgIHEwWzFdID0gcTBbMV0gKyBxMVsxXTtcbiAgICAgICAgcTBbMl0gPSBxMFsyXSArIHExWzJdO1xuICAgICAgICBxMFszXSA9IHEwWzNdICsgcTFbM107XG4gICAgfSxcblxuICAgIHN1YiA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgcTBbMF0gPSBxMFswXSAtIHExWzBdO1xuICAgICAgICBxMFsxXSA9IHEwWzFdIC0gcTFbMV07XG4gICAgICAgIHEwWzJdID0gcTBbMl0gLSBxMVsyXTtcbiAgICAgICAgcTBbM10gPSBxMFszXSAtIHExWzNdO1xuICAgIH0sXG5cbiAgICBzY2FsZSA6IGZ1bmN0aW9uKHEsbilcbiAgICB7XG4gICAgICAgIHFbMF0gKj0gbjtcbiAgICAgICAgcVsxXSAqPSBuO1xuICAgICAgICBxWzJdICo9IG47XG4gICAgICAgIHFbM10gKj0gbjtcbiAgICB9LFxuXG4gICAgY29uanVnYXRlIDogZnVuY3Rpb24ocSlcbiAgICB7XG4gICAgICAgIHFbMV0qPS0xO1xuICAgICAgICBxWzJdKj0tMTtcbiAgICAgICAgcVszXSo9LTE7XG4gICAgfSxcblxuICAgIG11bHQgOiBmdW5jdGlvbihxMCxxMSlcbiAgICB7XG4gICAgICAgIHZhciBuMCA9IHEwWzBdLFxuICAgICAgICAgICAgeDAgPSBxMFsxXSxcbiAgICAgICAgICAgIHkwID0gcTBbMl0sXG4gICAgICAgICAgICB6MCA9IHEwWzNdLFxuICAgICAgICAgICAgbjEgPSBxMVswXSxcbiAgICAgICAgICAgIHgxID0gcTFbMV0sXG4gICAgICAgICAgICB5MSA9IHExWzJdLFxuICAgICAgICAgICAgejEgPSBxMVszXTtcblxuICAgICAgICBxMFswXSA9IG4wICogbjEgLSB4MCAqIHgxIC0geTAgKiB5MSAtIHowICogejE7XG4gICAgICAgIHEwWzFdID0gbjAgKiB4MSAtIHgwICogbjEgLSB5MCAqIHoxIC0gejAgKiB5MTtcbiAgICAgICAgcTBbMl0gPSBuMCAqIHkxIC0geTAgKiBuMSAtIHowICogeDEgLSB4MCAqIHoxO1xuICAgICAgICBxMFszXSA9IG4wICogejEgLSB6MCAqIG4xIC0geDAgKiB5MSAtIHkwICogejE7XG4gICAgfSxcblxuICAgIG11bHRWZWMgOiBmdW5jdGlvbihxLHYpXG4gICAge1xuICAgICAgICB2YXIgcW4gPSBxWzBdLFxuICAgICAgICAgICAgcXggPSBxWzFdLFxuICAgICAgICAgICAgcXkgPSBxWzJdLFxuICAgICAgICAgICAgcXogPSBxWzNdO1xuXG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgcVswXSA9IC0ocXgqeCArIHF5KnkgKyBxeip6KTtcbiAgICAgICAgcVsxXSA9IHFuICogeCArIHF5ICogeiAtIHF6ICogeTtcbiAgICAgICAgcVsyXSA9IHFuICogeSArIHF6ICogeCAtIHF4ICogejtcbiAgICAgICAgcVszXSA9IHFuICogeiArIHF4ICogeSAtIHF5ICogeDtcbiAgICB9LFxuXG4gICAgYW5nbGUgOiBmdW5jdGlvbihxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIDIgKiBhY29zKHFbMF0pO1xuICAgIH0sXG5cbiAgICBheGlzIDogZnVuY3Rpb24ocSlcbiAgICB7XG4gICAgICAgIHZhciB4ID0gcVswXSxcbiAgICAgICAgICAgIHkgPSBxWzFdLFxuICAgICAgICAgICAgeiA9IHFbMl07XG5cbiAgICAgICAgdmFyIGwgPSBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6KTtcblxuICAgICAgICByZXR1cm4gbCAhPSAwID8gbmV3IEZsb2F0MzJBcnJheShbeC9sLHkvbCx6L2xdKSA6IG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XG4gICAgfSxcblxuICAgIC8vVE9ETzogSU5MSU5FIEFMTCEhXG5cbiAgICByb3RhdGUgOiBmdW5jdGlvbihxMCxxMSlcbiAgICB7XG4gICAgICAgIHRoaXMuc2V0KHEwLHRoaXMubXVsdCh0aGlzLm11bHQodGhpcy5jb3B5KHEwKSxxMSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uanVnYXRlKHRoaXMuY29weShxMCkpKSk7XG4gICAgfSxcblxuICAgIHJvdGF0ZVZlYyA6IGZ1bmN0aW9uKHEsdilcbiAgICB7XG4gICAgICAgIHZhciB0ID0gdGhpcy56ZXJvKCk7XG4gICAgICAgIHRoaXMuc2V0KHQsdGhpcy5tdWx0VmVjMyh0aGlzLm11bHRWZWMzKHRoaXMuY29weShxKSx2KSx0aGlzLmNvbmp1Z2F0ZSh0aGlzLmNvcHkocSkpKSk7XG4gICAgfSxcblxuICAgIGZyb21BbmdsZXMgOiBmdW5jdGlvbihheCxheSxheilcbiAgICB7XG4gICAgICAgIHZhciBxID0gdGhpcy56ZXJvKCk7XG5cbiAgICAgICAgdmFyIGN5YXcsY3BpdGNoLGNyb2xsLHN5YXcsc3BpdGNoLHNyb2xsO1xuICAgICAgICB2YXIgY3lhd2NwaXRjaCxzeWF3c3BpdGNoLGN5YXdzcGl0Y2gsc3lhd2NwaXRjaDtcblxuICAgICAgICBjeWF3ICAgPSBNYXRoLmNvcyhheiAqIDAuNSk7XG4gICAgICAgIGNwaXRjaCA9IE1hdGguY29zKGF5ICogMC41KTtcbiAgICAgICAgY3JvbGwgID0gTWF0aC5jb3MoYXggKiAwLjUpO1xuICAgICAgICBzeWF3ICAgPSBNYXRoLnNpbihheiAqIDAuNSk7XG4gICAgICAgIHNwaXRjaCA9IE1hdGguc2luKGF5ICogMC41KTtcbiAgICAgICAgc3JvbGwgID0gTWF0aC5zaW4oYXggKiAwLjUpO1xuXG4gICAgICAgIGN5YXdjcGl0Y2ggPSBjeWF3ICogY3BpdGNoO1xuICAgICAgICBzeWF3c3BpdGNoID0gc3lhdyAqIHNwaXRjaDtcbiAgICAgICAgY3lhd3NwaXRjaCA9IGN5YXcgKiBzcGl0Y2g7XG4gICAgICAgIHN5YXdjcGl0Y2ggPSBzeWF3ICogY3BpdGNoO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgY3lhd2NwaXRjaCAqIGNyb2xsICsgc3lhd3NwaXRjaCAqIHNyb2xsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN5YXdjcGl0Y2ggKiBzcm9sbCAtIHN5YXdzcGl0Y2ggKiBjcm9sbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjeWF3c3BpdGNoICogY3JvbGwgKyBzeWF3Y3BpdGNoICogc3JvbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3lhd2NwaXRjaCAqIGNyb2xsIC0gY3lhd3NwaXRjaCAqIHNyb2xsIF0pO1xuXG4gICAgfSxcblxuICAgIGFuZ2xlc0Zyb20gOiBmdW5jdGlvbihxKVxuICAgIHtcbiAgICAgICAgdmFyIHFuID0gcVswXSxcbiAgICAgICAgICAgIHF4ID0gcVsxXSxcbiAgICAgICAgICAgIHF5ID0gcVsyXSxcbiAgICAgICAgICAgIHF6ID0gcVszXTtcblxuICAgICAgICB2YXIgcjExLHIyMSxyMzEscjMyLHIzMyxyMTIscjEzO1xuICAgICAgICB2YXIgcTAwLHExMSxxMjIscTMzO1xuICAgICAgICB2YXIgdGVtcDtcbiAgICAgICAgdmFyIHYgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xuXG4gICAgICAgIHEwMCA9IHFuICogcW47XG4gICAgICAgIHExMSA9IHF4ICogcXg7XG4gICAgICAgIHEyMiA9IHF5ICogcXk7XG4gICAgICAgIHEzMyA9IHF6ICogcXo7XG5cbiAgICAgICAgcjExID0gcTAwICsgcTExIC0gcTIyIC0gcTMzO1xuICAgICAgICByMjEgPSAyICogKCBxeCArIHF5ICsgcW4gKiBxeik7XG4gICAgICAgIHIzMSA9IDIgKiAoIHF4ICogcXogLSBxbiAqIHF5KTtcbiAgICAgICAgcjMyID0gMiAqICggcXkgKiBxeiArIHFuICogcXgpO1xuICAgICAgICByMzMgPSBxMDAgLSBxMTEgLSBxMjIgKyBxMzM7XG5cbiAgICAgICAgdGVtcCA9IE1hdGguYWJzKHIzMSk7XG4gICAgICAgIGlmKHRlbXAgPiAwLjk5OTk5OSlcbiAgICAgICAge1xuICAgICAgICAgICAgcjEyID0gMiAqIChxeCAqIHF5IC0gcW4gKiBxeik7XG4gICAgICAgICAgICByMTMgPSAyICogKHF4ICogcXogLSBxbiAqIHF5KTtcblxuICAgICAgICAgICAgdlswXSA9IDAuMDtcbiAgICAgICAgICAgIHZbMV0gPSAoLShNYXRoLlBJICogMC41KSAqICByMzIgLyB0ZW1wKTtcbiAgICAgICAgICAgIHZbMl0gPSBNYXRoLmF0YW4yKC1yMTIsLXIzMSpyMTMpO1xuICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH1cblxuICAgICAgICB2WzBdID0gTWF0aC5hdGFuMihyMzIscjMzKTtcbiAgICAgICAgdlsxXSA9IE1hdGguYXNpbigtMzEpO1xuICAgICAgICB2WzJdID0gTWF0aC5hdGFuMihyMjEscjExKTtcbiAgICAgICAgcmV0dXJuIHY7XG4gICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1YXRlcm5pb247IiwidmFyIFZlYzIgPVxue1xuICAgIFNJWkUgOiAyLFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDBdKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzI7IiwidmFyIFZlYzMgPVxue1xuICAgIFNJWkUgICA6IDMsXG4gICAgWkVSTyAgIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKX0sXG4gICAgQVhJU19YIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDBdKX0sXG4gICAgQVhJU19ZIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwxLDBdKX0sXG4gICAgQVhJU19aIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDFdKX0sXG5cbiAgICBtYWtlIDogZnVuY3Rpb24oeCx5LHopXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHggfHwgMC4wLFxuICAgICAgICAgICAgeSB8fCAwLjAsXG4gICAgICAgICAgICB6IHx8IDAuMF0pO1xuICAgIH0sXG5cbiAgICBzZXQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdID0gdjFbMF07XG4gICAgICAgIHYwWzFdID0gdjFbMV07XG4gICAgICAgIHYwWzJdID0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzZXQzZiA6ICBmdW5jdGlvbih2LHgseSx6KVxuICAgIHtcbiAgICAgICAgdlswXSA9IHg7XG4gICAgICAgIHZbMV0gPSB5O1xuICAgICAgICB2WzJdID0gejtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgY29weSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XG4gICAgfSxcblxuICAgIGFkZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gKz0gdjFbMF07XG4gICAgICAgIHYwWzFdICs9IHYxWzFdO1xuICAgICAgICB2MFsyXSArPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHN1YiA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gLT0gdjFbMF07XG4gICAgICAgIHYwWzFdIC09IHYxWzFdO1xuICAgICAgICB2MFsyXSAtPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNjYWxlIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgdlswXSo9bjtcbiAgICAgICAgdlsxXSo9bjtcbiAgICAgICAgdlsyXSo9bjtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgZG90IDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdjBbMF0qdjFbMF0gKyB2MFsxXSp2MVsxXSArIHYwWzJdKnYxWzJdO1xuICAgIH0sXG5cbiAgICBjcm9zczogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeDAgPSB2MFswXSxcbiAgICAgICAgICAgIHkwID0gdjBbMV0sXG4gICAgICAgICAgICB6MCA9IHYwWzJdLFxuICAgICAgICAgICAgeDEgPSB2MVswXSxcbiAgICAgICAgICAgIHkxID0gdjFbMV0sXG4gICAgICAgICAgICB6MSA9IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt5MCAqIHoxIC0geTEgKiB6MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHowICogeDEgLSB6MSAqIHgwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDAgKiB5MSAtIHgxICogeTBdKTtcbiAgICB9LFxuXG4gICAgbGVycCA6IGZ1bmN0aW9uKHYwLHYxLGYpXG4gICAge1xuICAgICAgICB2YXIgeDAgPSB2MFswXSxcbiAgICAgICAgICAgIHkwID0gdjBbMV0sXG4gICAgICAgICAgICB6MCA9IHYwWzJdO1xuXG4gICAgICAgIHYwWzBdID0geDAgKiAoMS4wIC0gZikgKyB2MVswXSAqIGY7XG4gICAgICAgIHYwWzFdID0geTAgKiAoMS4wIC0gZikgKyB2MVsxXSAqIGY7XG4gICAgICAgIHYwWzJdID0gejAgKiAoMS4wIC0gZikgKyB2MVsyXSAqIGY7XG5cblxuICAgIH0sXG5cbiAgICBsZXJwZWQgOiBmdW5jdGlvbih2MCx2MSxmKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVycCh0aGlzLmNvcHkodjApLHYxLGYpO1xuICAgIH0sXG5cblxuXG4gICAgbGVycDNmIDogZnVuY3Rpb24odix4LHkseixmKVxuICAgIHtcbiAgICAgICAgdmFyIHZ4ID0gdlswXSxcbiAgICAgICAgICAgIHZ5ID0gdlsxXSxcbiAgICAgICAgICAgIHZ6ID0gdlsyXTtcblxuICAgICAgICB2WzBdID0gdnggKiAoMS4wIC0gZikgKyB4ICogZjtcbiAgICAgICAgdlsxXSA9IHZ5ICogKDEuMCAtIGYpICsgeSAqIGY7XG4gICAgICAgIHZbMl0gPSB2eiAqICgxLjAgLSBmKSArIHogKiBmO1xuICAgIH0sXG5cblxuICAgIGxlbmd0aCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgIH0sXG5cbiAgICBsZW5ndGhTcSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Kno7XG4gICAgfSxcblxuICAgIHNhZmVOb3JtYWxpemUgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4KngreSp5K3oqeik7XG4gICAgICAgIGQgPSBkIHx8IDE7XG5cbiAgICAgICAgdmFyIGwgID0gMS9kO1xuXG4gICAgICAgIHZbMF0gKj0gbDtcbiAgICAgICAgdlsxXSAqPSBsO1xuICAgICAgICB2WzJdICo9IGw7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBsICA9IDEvTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcblxuICAgICAgICB2WzBdICo9IGw7XG4gICAgICAgIHZbMV0gKj0gbDtcbiAgICAgICAgdlsyXSAqPSBsO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2UzZiA6IGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB4ICsgdlsxXSAqIHkgKyB2WzJdICogeik7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdjBbMF0gLSB2MVswXSxcbiAgICAgICAgICAgIHkgPSB2MFsxXSAtIHYxWzFdLFxuICAgICAgICAgICAgeiA9IHYwWzJdIC0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHgqeCt5Knkreip6O1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZVNxM2YgOiBmdW5jdGlvbih2LHgseSx6KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHZbMF0gKiB4ICsgdlsxXSAqIHkgKyB2WzJdICogejtcbiAgICB9LFxuXG4gICAgbGltaXQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkc3EgPSB4KnggKyB5KnkgKyB6KnosXG4gICAgICAgICAgICBsc3EgPSBuICogbjtcblxuICAgICAgICBpZigoZHNxID4gbHNxKSAmJiBsc3EgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbmQgPSBuL01hdGguc3FydChkc3EpO1xuXG4gICAgICAgICAgICB2WzBdICo9IG5kO1xuICAgICAgICAgICAgdlsxXSAqPSBuZDtcbiAgICAgICAgICAgIHZbMl0gKj0gbmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZbMF0qPS0xO1xuICAgICAgICB2WzFdKj0tMTtcbiAgICAgICAgdlsyXSo9LTE7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGFkZGVkICA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzdWJiZWQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0aGlzLmNvcHkodjApLHYxKTtcbiAgICB9LFxuXG4gICAgc2NhbGVkIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUodGhpcy5jb3B5KHYpLG4pO1xuICAgIH0sXG5cbiAgICBub3JtYWxpemVkIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSh0aGlzLmNvcHkodikpO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gJ1snICsgdlswXSArICcsJyArIHZbMV0gKyAnLCcgKyB2WzJdICsgJ10nO1xuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZWMzO1xuXG5cblxuIiwiXG4vL1RPRE86RklOSVNIXG52YXIgVmVjNCA9XG57XG4gICAgU0laRSA6IDQsXG4gICAgWkVSTyA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDEuMF0pfSxcblxuICAgIG1ha2UgOiBmdW5jdGlvbih4LHkseix3KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyB4IHx8IDAuMCxcbiAgICAgICAgICAgIHkgfHwgMC4wLFxuICAgICAgICAgICAgeiB8fCAwLjAsXG4gICAgICAgICAgICB3IHx8IDEuMF0pO1xuICAgIH0sXG5cbiAgICBmcm9tVmVjMyA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHZbMF0sIHZbMV0sIHZbMl0gLCAxLjBdKTtcbiAgICB9LFxuXG4gICAgc2V0IDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSA9IHYxWzBdO1xuICAgICAgICB2MFsxXSA9IHYxWzFdO1xuICAgICAgICB2MFsyXSA9IHYxWzJdO1xuICAgICAgICB2MFszXSA9IHYxWzNdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc2V0M2YgOiAgZnVuY3Rpb24odix4LHkseilcbiAgICB7XG4gICAgICAgIHZbMF0gPSB4O1xuICAgICAgICB2WzFdID0geTtcbiAgICAgICAgdlsyXSA9IHo7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIHNldDRmIDogZnVuY3Rpb24odix4LHkseix3KVxuICAgIHtcbiAgICAgICAgdlswXSA9IHg7XG4gICAgICAgIHZbMV0gPSB5O1xuICAgICAgICB2WzJdID0gejtcbiAgICAgICAgdlszXSA9IHc7XG5cbiAgICAgICAgcmV0dXJuIHY7XG5cbiAgICB9LFxuXG4gICAgY29weSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XG4gICAgfSxcblxuICAgIGFkZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gKz0gdjFbMF07XG4gICAgICAgIHYwWzFdICs9IHYxWzFdO1xuICAgICAgICB2MFsyXSArPSB2MVsyXTtcbiAgICAgICAgdjBbM10gKz0gdjFbM107XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzdWIgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdIC09IHYxWzBdO1xuICAgICAgICB2MFsxXSAtPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gLT0gdjFbMl07XG4gICAgICAgIHYwWzNdIC09IHYxWzNdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc2NhbGUgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2WzBdKj1uO1xuICAgICAgICB2WzFdKj1uO1xuICAgICAgICB2WzJdKj1uO1xuICAgICAgICB2WzNdKj1uO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkb3QgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB2MFswXSp2MVswXSArIHYwWzFdKnYxWzFdICsgdjBbMl0qdjFbMl07XG4gICAgfSxcblxuICAgIGNyb3NzOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3kwKnoxLXkxKnowLHowKngxLXoxKngwLHgwKnkxLXgxKnkwXSk7XG4gICAgfSxcblxuICAgIHNsZXJwIDogZnVuY3Rpb24odjAsdjEsZilcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgdmFyIGQgPSBNYXRoLm1heCgtMS4wLE1hdGgubWluKCh4MCp4MSArIHkwKnkxICsgejAqejEpLDEuMCkpLFxuICAgICAgICAgICAgdCA9IE1hdGguYWNvcyhkKSAqIGY7XG5cbiAgICAgICAgdmFyIHggPSB4MCAtICh4MSAqIGQpLFxuICAgICAgICAgICAgeSA9IHkwIC0gKHkxICogZCksXG4gICAgICAgICAgICB6ID0gejAgLSAoejEgKiBkKTtcblxuICAgICAgICB2YXIgbCA9IDEvTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcblxuICAgICAgICB4Kj1sO1xuICAgICAgICB5Kj1sO1xuICAgICAgICB6Kj1sO1xuXG4gICAgICAgIHZhciBjdCA9IE1hdGguY29zKHQpLFxuICAgICAgICAgICAgc3QgPSBNYXRoLnNpbih0KTtcblxuICAgICAgICB2YXIgeG8gPSB4MCAqIGN0ICsgeCAqIHN0LFxuICAgICAgICAgICAgeW8gPSB5MCAqIGN0ICsgeSAqIHN0LFxuICAgICAgICAgICAgem8gPSB6MCAqIGN0ICsgeiAqIHN0O1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt4byx5byx6b10pO1xuICAgIH0sXG5cbiAgICBsZW5ndGggOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6Knordyp3KTtcbiAgICB9LFxuXG4gICAgbGVuZ3RoU3EgOiAgZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Knordyp3O1xuICAgIH0sXG5cbiAgICBub3JtYWxpemUgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHZhciBsICA9IDEvTWF0aC5zcXJ0KHgqeCt5Knkreip6K3cqdyk7XG5cbiAgICAgICAgdlswXSAqPSBsO1xuICAgICAgICB2WzFdICo9IGw7XG4gICAgICAgIHZbMl0gKj0gbDtcbiAgICAgICAgdlszXSAqPSBsO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2VTcSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Kno7XG4gICAgfSxcblxuICAgIGxpbWl0IDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICB2YXIgZHNxID0geCp4ICsgeSp5ICsgeip6LFxuICAgICAgICAgICAgbHNxID0gbiAqIG47XG5cbiAgICAgICAgaWYoKGRzcSA+IGxzcSkgJiYgbHNxID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG5kID0gbi9NYXRoLnNxcnQoZHNxKTtcblxuICAgICAgICAgICAgdlswXSAqPSBuZDtcbiAgICAgICAgICAgIHZbMV0gKj0gbmQ7XG4gICAgICAgICAgICB2WzJdICo9IG5kO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGludmVydCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2WzBdKj0tMTtcbiAgICAgICAgdlsxXSo9LTE7XG4gICAgICAgIHZbMl0qPS0xO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBhZGRlZCAgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCh0aGlzLmNvcHkodjApLHYxKTtcbiAgICB9LFxuXG4gICAgc3ViYmVkIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWIodGhpcy5jb3B5KHYwKSx2MSk7XG4gICAgfSxcblxuICAgIHNjYWxlZCA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlKHRoaXMuY29weSh2KSxuKTtcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplZCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUodGhpcy5jb3B5KHYpKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuICdbJyArIHZbMF0gKyAnLCcgKyB2WzFdICsgJywnICsgdlsyXSArICddJztcbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjNDsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgQVBQX1dJRFRIICA6IDgwMCxcbiAgICBBUFBfSEVJR0hUIDogNjAwLFxuXG4gICAgQVBQX0ZQUyA6IDMwLFxuXG4gICAgQVBQX1BMQVNLX1dJTkRPV19USVRMRSA6ICcnLFxuICAgIEFQUF9QTEFTS19UWVBFICA6ICczZCcsXG4gICAgQVBQX1BMQVNLX1ZTWU5DIDogJ2ZhbHNlJyxcbiAgICBBUFBfUExBU0tfTVVMVElTQU1QTEUgOiB0cnVlLFxuXG4gICAgQ0FNRVJBX0ZPViA6IDQ1LFxuICAgIENBTUVSQV9ORUFSIDogMC4xLFxuICAgIENBTUVSQV9GQVIgIDogMTAwXG5cbn07IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIE1FVEhPRF9OT1RfSU1QTEVNRU5URUQ6ICdNZXRob2Qgbm90IGltcGxlbWVudGVkIGluIHRhcmdldCBwbGF0Zm9ybS4nLFxuICAgIENMQVNTX0lTX1NJTkdMRVRPTjogICAgICdBcHBsaWNhdGlvbiBpcyBzaW5nbGV0b24uIEdldCB2aWEgZ2V0SW5zdGFuY2UoKS4nLFxuICAgIEFQUF9OT19TRVRVUDogICAgICAgICAgICdObyBzZXR1cCBtZXRob2QgYWRkZWQgdG8gYXBwLicsXG4gICAgQVBQX05PX1VQREFURSA6ICAgICAgICAgJ05vIHVwZGF0ZSBtZXRob2QgYWRkZWQgdG8gYXBwLicsXG4gICAgUExBU0tfV0lORE9XX1NJWkVfU0VUOiAgJ1BsYXNrIHdpbmRvdyBzaXplIGNhbiBvbmx5IGJlIHNldCBvbiBzdGFydHVwLicsXG4gICAgV1JPTkdfUExBVEZPUk06ICAgICAgICAgJ1dyb25nIFBsYXRmb3JtLicsXG4gICAgVkVSVElDRVNfSU5fV1JPTkdfU0laRTogJ1ZlcnRpY2VzIGFycmF5IGhhcyB3cm9uZyBsZW5ndGguIFNob3VsZCBiZSAnLFxuICAgIENPTE9SU19JTl9XUk9OR19TSVpFOiAgICdDb2xvciBhcnJheSBsZW5ndGggbm90IGVxdWFsIHRvIG51bWJlciBvZiB2ZXJ0aWNlcy4nXG59OyIsInZhciBQbGF0Zm9ybSA9IHtXRUI6MCxQTEFTSzoxfTtcbiAgICBQbGF0Zm9ybS5fdGFyZ2V0ID0gbnVsbDtcblxuUGxhdGZvcm0uZ2V0VGFyZ2V0ICA9IGZ1bmN0aW9uKClcbntcbiAgICBpZighdGhpcy5fdGFyZ2V0KXRoaXMuX3RhcmdldCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSA/IHRoaXMuV0VCIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZSkgPyB0aGlzLlBMQVNLIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsO1xuICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXRmb3JtOyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBTSVpFICA6IDQsXG5cbiAgICBCTEFDSyA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKX0sXG4gICAgV0hJVEUgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMSwxXSl9LFxuICAgIFJFRCAgIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMV0pfSxcbiAgICBHUkVFTiA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMSwwLDFdKX0sXG4gICAgQkxVRSAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMSwxXSl9LFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKHIsZyxiLGEpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgcixnLGIsYV0pO30sXG4gICAgY29weSA6IGZ1bmN0aW9uKGMpe3JldHVybiB0aGlzLm1ha2UoY1swXSxjWzFdLGNbMl0sY1szXSk7fSxcblxuICAgIHNldCA6IGZ1bmN0aW9uKGMwLGMxKVxuICAgIHtcbiAgICAgICAgYzBbMF0gPSBjMVswXTtcbiAgICAgICAgYzBbMV0gPSBjMVsxXTtcbiAgICAgICAgYzBbMl0gPSBjMVsyXTtcbiAgICAgICAgYzBbM10gPSBjMVszXTtcblxuICAgICAgICByZXR1cm4gYzA7XG4gICAgfSxcblxuICAgIHNldDRmIDogZnVuY3Rpb24oYyxyLGcsYixhKVxuICAgIHtcbiAgICAgICAgY1swXSA9IHI7XG4gICAgICAgIGNbMV0gPSBnO1xuICAgICAgICBjWzJdID0gYjtcbiAgICAgICAgY1szXSA9IGE7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDNmIDogZnVuY3Rpb24oYyxyLGcsYilcbiAgICB7XG4gICAgICAgIGNbMF0gPSByO1xuICAgICAgICBjWzFdID0gZztcbiAgICAgICAgY1syXSA9IGI7XG4gICAgICAgIGNbM10gPSAxLjA7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDJmIDogZnVuY3Rpb24oYyxrLGEpXG4gICAge1xuICAgICAgICBjWzBdID0gY1sxXSA9IGNbMl0gPSBrO1xuICAgICAgICBjWzNdID0gYTtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuXG4gICAgc2V0MWYgOiBmdW5jdGlvbihjLGspXG4gICAge1xuICAgICAgICBjWzBdID0gY1sxXSA9IGNbMl0gPSBrO1xuICAgICAgICBjWzNdID0gMS4wO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBzZXQ0aSAgICA6IGZ1bmN0aW9uKGMscixnLGIsYSl7cmV0dXJuIHRoaXMuc2V0NGYoYyxyLzI1NS4wLGcvMjU1LjAsYi8yNTUuMCxhKTt9LFxuICAgIHNldDNpICAgIDogZnVuY3Rpb24oYyxyLGcsYikgIHtyZXR1cm4gdGhpcy5zZXQzZihjLHIvMjU1LjAsZy8yNTUuMCxiLzI1NS4wKTt9LFxuICAgIHNldDJpICAgIDogZnVuY3Rpb24oYyxrLGEpICAgIHtyZXR1cm4gdGhpcy5zZXQyZihjLGsvMjU1LjAsYSk7fSxcbiAgICBzZXQxaSAgICA6IGZ1bmN0aW9uKGMsaykgICAgICB7cmV0dXJuIHRoaXMuc2V0MWYoYyxrLzI1NS4wKTt9LFxuICAgIHRvQXJyYXkgIDogZnVuY3Rpb24oYykgICAgICAgIHtyZXR1cm4gYy50b0FycmF5KCk7fSxcbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKGMpICAgICAgICB7cmV0dXJuICdbJytjWzBdKycsJytjWzFdKycsJytjWzJdKycsJytjWzNdKyddJzt9LFxuXG4gICAgaW50ZXJwb2xhdGVkIDogZnVuY3Rpb24oYzAsYzEsZilcbiAgICB7XG4gICAgICAgIHZhciBjICA9IG5ldyBGbG9hdDMyQXJyYXkoNCksXG4gICAgICAgICAgICBmaSA9IDEuMCAtIGY7XG5cbiAgICAgICAgY1swXSA9IGMwWzBdICogZmkgKyBjMVswXSAqIGY7XG4gICAgICAgIGNbMV0gPSBjMFsxXSAqIGZpICsgYzFbMV0gKiBmO1xuICAgICAgICBjWzJdID0gYzBbMl0gKiBmaSArIGMxWzJdICogZjtcbiAgICAgICAgY1szXSA9IGMwWzNdICogZmkgKyBjMVszXSAqIGY7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG59OyIsInZhciBWZWMyICAgPSByZXF1aXJlKCcuLi9tYXRoL2ZWZWMyJyksXG4gICAgZkVycm9yID0gcmVxdWlyZSgnLi4vc3lzdGVtL2ZFcnJvcicpO1xuXG5mdW5jdGlvbiBNb3VzZSgpXG57XG4gICAgaWYoTW91c2UuX19pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3IoZkVycm9yLkNMQVNTX0lTX1NJTkdMRVRPTik7XG5cbiAgICB0aGlzLl9wb3NpdGlvbiAgICAgPSBWZWMyLm1ha2UoKTtcbiAgICB0aGlzLl9wb3NpdGlvbkxhc3QgPSBWZWMyLm1ha2UoKTtcblxuICAgIE1vdXNlLl9faW5zdGFuY2UgPSB0aGlzO1xufVxuXG5Nb3VzZS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb247fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRQb3NpdGlvbkxhc3QgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbkxhc3Q7fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRYICAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvblswXTt9O1xuTW91c2UucHJvdG90eXBlLmdldFkgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uWzFdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WExhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzBdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WUxhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzFdO307XG5cbk1vdXNlLl9faW5zdGFuY2UgPSBudWxsO1xuTW91c2UuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpe3JldHVybiBNb3VzZS5faW5zdGFuY2U7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgdG9BcnJheSA6IGZ1bmN0aW9uKGZsb2F0MzJBcnJheSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZsb2F0MzJBcnJheSk7fVxufTsiLG51bGxdfQ==
;