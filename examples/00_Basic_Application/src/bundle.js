;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Default = require('../system/glkDefault'),
    glkError  = require('../system/glkError');

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
    this._timeNext      = -1;
    this._timeInterval  = this._targetFPS / 1000.0;
    this._timeDelta     = 0;

    this._width  = -1;
    this._height = -1;
    this._ratio  = -1;

    this._isInitialized = false;
}

AppImpl.prototype.isInitialized = function()    {return this._isInitialized;};

AppImpl.prototype.setUpdate     = function(bool){this._bUpdate = bool;};

AppImpl.prototype.init    = function(appObj)      {throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.setSize = function(width,height){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};

AppImpl.prototype.setFullWindowFrame = function(bool){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
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

AppImpl.prototype.getFramesElapsed  = function(){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getSecondsElapsed = function(){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTime           = function(){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTimeStart      = function(){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTimeNext       = function(){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};
AppImpl.prototype.getTimeDelta      = function(){throw new Error(glkError.METHOD_NOT_IMPLEMENTED);};

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
},{"../system/glkDefault":27,"../system/glkError":28}],2:[function(require,module,exports){
var Default     = require('../system/glkDefault'),
    kError      = require('../system/glkError'),
    kGL         = require('../graphics/glkGL'),
    AppImpl     = require('./glkAppImpl'),
    CameraBasic = require('../graphics/glkCameraBasic'),
    plask       = require('plask');

function AppImplPlask()
{
    AppImpl.apply(this,arguments);
}

AppImplPlask.prototype = Object.create(AppImpl.prototype);

AppImplPlask.prototype.setSize = function(width,height)
{
    if(this._isInitialized)throw new Error(kError.PLASK_WINDOW_SIZE_SET);

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
        time;

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
            appObj.kgl    = new kGL(this.gl,null);
            appObj.camera = new CameraBasic();
            appObj.kgl.setCamera(appObj.camera);
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
                    appObj.mouse._positionLast[0] = appObj.mouse._position[0];
                    appObj.mouse._positionLast[1] = appObj.mouse._position[1];

                    if(self._mouseBounds)
                    {
                        appObj.mouse._position[0] = Math.max(0,Math.min(e.x,self._width));
                        appObj.mouse._position[1] = Math.max(0,Math.min(e.y,self._height));
                    }
                    else
                    {
                        appObj.mouse._position[0] = e.x;
                        appObj.mouse._position[1] = e.y;
                    }

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
            appObj.update();
            self._timeDelta = time - prevTime;
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




},{"../graphics/glkCameraBasic":17,"../graphics/glkGL":18,"../system/glkDefault":27,"../system/glkError":28,"./glkAppImpl":1,"plask":34}],3:[function(require,module,exports){
var Default     = require('../system/glkDefault'),
    AppImpl     = require('./glkAppImpl'),
    kGL         = require('../graphics/glkGL'),
    CameraBasic = require('../graphics/glkCameraBasic');

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


    appObj.kgl = new kGL(this._context3d,this._context2d);
    appObj.kgl.gl.viewport(0,0,this._width,this._height);

    appObj.camera = new CameraBasic();
    appObj.kgl.setCamera(appObj.camera);
    appObj.camera.setPerspective(Default.CAMERA_FOV,
                                 self._ratio,
                                 Default.CAMERA_NEAR,
                                 Default.CAMERA_FAR);
    appObj.camera.setTarget3f(0,0,0);
    appObj.camera.updateMatrices();

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
        gl = appObj.kgl;
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

AppImplWeb.prototype.setMouseListenerTarget = function(obj){this._mouseEventTarget = obj;};
AppImplWeb.prototype.setKeyListenerTarget   = function(obj){this._keyEventTarget = obj;};
AppImplWeb.prototype.setFullWindowFrame     = function(bool){this._isFullWindowFrame = bool;return true;};


module.exports = AppImplWeb;


},{"../graphics/glkCameraBasic":17,"../graphics/glkGL":18,"../system/glkDefault":27,"./glkAppImpl":1}],4:[function(require,module,exports){
var kError       = require('../system/glkError'),
    Platform     = require('../system/glkPlatform'),
    AppImplWeb   = require('./glkAppImplWeb'),
    AppImplPlask = require('./glkAppImplPlask'),
    Mouse        = require('../util/glkMouse'),
    CameraBasic  = require('../graphics/glkCameraBasic');


function Application()
{
    if(Application.__instance)throw new Error(kError.CLASS_IS_SINGLETON);

    var target  = Platform.getTarget();
    if(typeof target === 'undefined' )throw new Error(kError.WRONG_PLATFORM);

    this._appImpl = target == Platform.WEB   ? new AppImplWeb(arguments) :
                    target == Platform.PLASK ? new AppImplPlask(arguments) :
                    null;

    this.mouse  = new Mouse();
    this.kgl    = null;
    this.camera = null;

    Application.__instance = this;
}

Application.prototype.setup  = function(){throw new Error(kError.APP_NO_SETUP);};
Application.prototype.update = function(){throw new Error(kError.APP_NO_UPDATE);};

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






},{"../graphics/glkCameraBasic":17,"../system/glkError":28,"../system/glkPlatform":29,"../util/glkMouse":31,"./glkAppImplPlask":2,"./glkAppImplWeb":3}],5:[function(require,module,exports){
/**
 *
 * foam.js - A WebGL toolbox
 *
 * foam.js is available under the terms of the MIT license.  The full text of the
 * MIT license is included below.
 *
 * MIT License
 * ===========
 *
 * Copyright (c) 2012 Henryk Wollik. All rights reserved.
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
    Math        : require('./math/glkMath'),
    Vec2        : require('./math/glkVec2'),
    Vec3        : require('./math/glkVec3'),
    Vec4        : require('./math/glkVec4'),
    Mat33       : require('./math/glkMat33'),
    Mat44       : require('./math/glkMat44'),
    Quaternion  : require('./math/glkQuaternion'),


    MatGL        : require('./graphics/gl/glkMatGL'),
    ProgLoader   : require('./graphics/gl/shader/glkProgLoader'),
    ShaderLoader : require('./graphics/gl/shader/glkShaderLoader'),
    CameraBasic  : require('./graphics/glkCameraBasic'),

    Light            : require('./graphics/gl/glkLight'),
    PointLight       : require('./graphics/gl/glkPointLight'),
    DirectionalLight : require('./graphics/gl/glkDirectionalLight'),
    SpotLight        : require('./graphics/gl/glkSpotLight'),

    Material    : require('./graphics/gl/glkMaterial'),
    Texture     : require('./graphics/gl/glkTexture'),

    fGLUtil     : require('./graphics/util/glkGLUtil'),
    kGL         : require('./graphics/glkGL'),

    Mouse       : require('./util/glkMouse'),
    Color       : require('./util/glkColor'),
    Util        : require('./util/glkUtil'),

    Platform    : require('./system/glkPlatform'),
    Application : require('./app/glkApplication')

};


},{"./app/glkApplication":4,"./graphics/gl/glkDirectionalLight":6,"./graphics/gl/glkLight":7,"./graphics/gl/glkMatGL":8,"./graphics/gl/glkMaterial":9,"./graphics/gl/glkPointLight":10,"./graphics/gl/glkSpotLight":11,"./graphics/gl/glkTexture":12,"./graphics/gl/shader/glkProgLoader":14,"./graphics/gl/shader/glkShaderLoader":16,"./graphics/glkCameraBasic":17,"./graphics/glkGL":18,"./graphics/util/glkGLUtil":19,"./math/glkMat33":20,"./math/glkMat44":21,"./math/glkMath":22,"./math/glkQuaternion":23,"./math/glkVec2":24,"./math/glkVec3":25,"./math/glkVec4":26,"./system/glkPlatform":29,"./util/glkColor":30,"./util/glkMouse":31,"./util/glkUtil":32}],6:[function(require,module,exports){
var Vec3  = require('../../math/glkVec3'),
    Light = require('./glkLight');

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
},{"../../math/glkVec3":25,"./glkLight":7}],7:[function(require,module,exports){
var Vec3 = require('../../math/glkVec3'),
    Vec4 = require('../../math/glkVec4');

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
},{"../../math/glkVec3":25,"../../math/glkVec4":26}],8:[function(require,module,exports){
var Mat44 = require('../../math/glkMat44');

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
},{"../../math/glkMat44":21}],9:[function(require,module,exports){
var Color = require('../../util/glkColor');

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

},{"../../util/glkColor":30}],10:[function(require,module,exports){
var Light = require('./glkLight');

function PointLight(id)
{
    Light.apply(this,arguments);
}

PointLight.prototype = Object.create(Light.prototype);

module.exports = PointLight;
},{"./glkLight":7}],11:[function(require,module,exports){
var DirectionalLight = require('./glkDirectionalLight');

function SpotLight(id)
{
    DirectionalLight.apply(this,arguments);
}

SpotLight.prototype = Object.create(DirectionalLight.prototype);

SpotLight.prototype.setExponent = function(){};
SpotLight.prototype.setCutOff   = function(){};

module.exports = SpotLight;
},{"./glkDirectionalLight":6}],12:[function(require,module,exports){

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
},{}],13:[function(require,module,exports){
module.exports =

    "varying vec4 vVertexColor;" +

        "void main(void)" +
        "{" +
        "    gl_FragColor = vVertexColor;" +
        "}";
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
module.exports =
    "attribute vec3 aVertexPosition;" +
        "attribute vec4 aVertexColor;" +

        "varying vec4 vVertexColor;" +

        "uniform mat4 uMVMatrix;" +
        "uniform mat4 uPMatrix;" +

        "void main(void)" +
        "{" +
        "    vVertexColor = aVertexColor;" +
        "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
        "}";
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
var Vec3  = require('../math/glkVec3'),
    Mat44 = require('../math/glkMat44'),
    MatGL = require('./gl/glkMatGL');

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



},{"../math/glkMat44":21,"../math/glkVec3":25,"./gl/glkMatGL":8}],18:[function(require,module,exports){
var ProgVertexShader = require('./gl/shader/glkProgVertexShader'),
    ProgFragShader   = require('./gl/shader/glkProgFragShader'),
    ProgLoader       = require('./gl/shader/glkProgLoader'),
    ShaderLoader     = require('./gl/shader/glkShaderLoader'),
    Platform         = require('../system/glkPlatform'),
    Color            = require('../util/glkColor'),
    Mat44            = require('../math/glkMat44');



function kGL(context3d,context2d)
{
    var gl = this.gl = context3d;

    var progVertexShader = ShaderLoader.loadShaderFromString(gl, ProgVertexShader, gl.VERTEX_SHADER),
        progFragShader   = ShaderLoader.loadShaderFromString(gl, ((Platform.getTarget() == Platform.WEB) ?
                                                                 ShaderLoader.PrefixShaderWeb : '') +
                                                                 ProgFragShader, gl.FRAGMENT_SHADER);

    var program =  ProgLoader.loadProgram(gl,progVertexShader,progFragShader);
    gl.useProgram(program);

    /*---------------------------------------------------------------------------------------------------------*/

    //bind shader stuff

    this._aVertexPosition   = gl.getAttribLocation(program,'aVertexPosition');
    this._aVertexColor      = gl.getAttribLocation(program,'aVertexColor');
    this._uModelViewMatrix  = gl.getUniformLocation(program,'uMVMatrix');
    this._uProjectionMatrix = gl.getUniformLocation(program,'uPMatrix');

    gl.enableVertexAttribArray(this._aVertexPosition);
    gl.enableVertexAttribArray(this._aVertexColor);


    //create shared buffer

    this._abo = gl.createBuffer();
    this._eabo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,        this._abo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this._eabo);
    /*---------------------------------------------------------------------------------------------------------*/

    //setup matrices and stack

    this._camera    = null;
    this._mModeView = Mat44.make();

    this._mStack = [];

    /*---------------------------------------------------------------------------------------------------------*/

    //temp
    this._bLineVertices = new Float32Array(2 * 3);
    this._bLineColors   = new Float32Array(2 * 4);
    this._bRectVertices = new Float32Array(4 * 3);
    this._bRectColors   = new Float32Array(4 * 4);

    this._bColor     = new Float32Array([1,1,1,1]);
    this._bColor4f   = new Float32Array([1,1,1,1]);
    this._bColorBg4f = new Float32Array([0.1,0.1,0.1,1.0]);

}

kGL.prototype.setCamera = function(camera)
{
    this._camera = camera;
};

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.loadIdentity = function(){this._mModelView = Mat44.identity(this._camera.modelViewMatrix);};
kGL.prototype.pushMatrix   = function(){this._mStack.push(Mat44.copy(this._mModelView));};
kGL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw ('Invalid pop!');
    this._mModelView = stack.pop();

    return this._mModelView;
};

kGL.prototype.setMatricesUniform = function()
{
    var gl = this.gl;

    gl.uniformMatrix4fv(this._uModelViewMatrix,false,this._mModelView);
    gl.uniformMatrix4fv(this._uProjectionMatrix,false,this._camera.projectionMatrix);
};

//check
kGL.prototype.translate     = function(v)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(v[0],v[1],v[2]));};
kGL.prototype.translate3f   = function(x,y,z)      {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,y,z));};
kGL.prototype.translateX    = function(x)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,0,0));};
kGL.prototype.translateY    = function(y)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,y,0));};
kGL.prototype.translateZ    = function(z)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,0,z));};
kGL.prototype.scale         = function(v)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(v[0],v[1],v[2]));};
kGL.prototype.scale1f       = function(n)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(n,n,n));};
kGL.prototype.scale3f       = function(x,y,z)      {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(x,y,z));};
kGL.prototype.scaleX        = function(x)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(x,1,1));};
kGL.prototype.scaleY        = function(y)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(1,y,1));};
kGL.prototype.scaleZ        = function(z)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(1,1,z));};
kGL.prototype.rotate        = function(v)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(v[0],v[1],v[2]));};
kGL.prototype.rotate3f      = function(x,y,z)      {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(x,y,z));};
kGL.prototype.rotateX       = function(x)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationX(x));};
kGL.prototype.rotateY       = function(y)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationY(y));};
kGL.prototype.rotateZ       = function(z)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationZ(z));};
kGL.prototype.rotateAxis    = function(angle,v)    {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,v[0],v[1],v[2]));};
kGL.prototype.rotateAxis3f  = function(angle,x,y,z){this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,x,y,z));};

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.color   = function(color)  {this._bColor = Color.set(this._bColor4f,color);};
kGL.prototype.color4f = function(r,g,b,a){this._bColor = Color.set4f(this._bColor4f,r,g,b,a);};
kGL.prototype.color3f = function(r,g,b)  {this._bColor = Color.set3f(this._bColor4f,r,g,b);};
kGL.prototype.color2f = function(k,a)    {this._bColor = Color.set2f(this._bColor4f,k,a);};
kGL.prototype.color1f = function(k)      {this._bColor = Color.set1f(this._bColor4f,k);};
kGL.prototype.colorfv = function(array)  {this._bColor = array;};

kGL.prototype.getColorBuffer = function(){return this._bColor;};

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
kGL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
kGL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
kGL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
kGL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
kGL.prototype.clear4f    = function(r,g,b,a)
{
    var bColor = this._bColorBg4f;
    bColor[0] = r;
    bColor[1] = g;
    bColor[2] = b;
    bColor[3] = a;

    var gl = this.gl;
    gl.clearColor(bColor[0],bColor[1],bColor[2],bColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/*---------------------------------------------------------------------------------------------------------*/

//just vertices and colors for now
kGL.prototype.fillArrayBuffer = function(vertexFloat32Array,colorFloat32Array,glDrawMode)
{
    var gl            = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    glDrawMode = glDrawMode || gl.DYNAMIC_DRAW;

    var vblen  = vertexFloat32Array.byteLength,
        cblen  = colorFloat32Array.byteLength;

    var offsetV  = 0,
        offsetC  = vblen;

    gl.bufferData(glArrayBuffer, vblen + cblen , glDrawMode);

    gl.bufferSubData(glArrayBuffer, offsetV, vertexFloat32Array);
    gl.bufferSubData(glArrayBuffer, offsetC, colorFloat32Array);
    gl.vertexAttribPointer(this._aVertexPosition, 3, glFloat, false, 0, offsetV);
    gl.vertexAttribPointer(this._aVertexColor, 4, glFloat, false, 0, offsetC);
};

//fills vertices color data with current color set
kGL.prototype.fillColorBuffer = function(color,buffer)
{
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
            throw ("Color array length not equal to number of vertices.");
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


kGL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bLineVertices;
    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    this.fillArrayBuffer(v,this.fillColorBuffer(this._bColor,this._bLineColors));
    this.setMatricesUniform();
    this.gl.drawArrays(this.gl.LINES,0,2);
};

kGL.prototype.getColorBuffer = function(){return this._bColor;};
kGL.prototype.getClearBuffer = function(){return this._bColorBg4f;};



module.exports = kGL;
},{"../math/glkMat44":21,"../system/glkPlatform":29,"../util/glkColor":30,"./gl/shader/glkProgFragShader":13,"./gl/shader/glkProgLoader":14,"./gl/shader/glkProgVertexShader":15,"./gl/shader/glkShaderLoader":16}],19:[function(require,module,exports){
var Vec3  = require('../../math/glkVec3'),
    Color = require('../../util/glkColor');

var kGLUtil = {};

kGLUtil.__gridSizeLast = -1;
kGLUtil.__gridUnitLast = -1;



kGLUtil.drawGrid = function(kgl,size,unit)
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

kGLUtil.drawAxes = function(kgl,unit)
{
    kgl.color3f(1,0,0);
    kgl.linef(0,0,0,unit,0,0);
    kgl.color3f(0,1,0);
    kgl.linef(0,0,0,0,unit,0);
    kgl.color3f(0,0,1);
    kgl.linef(0,0,0,0,0,unit);
};

kGLUtil.drawGridCube = function(kgl,size,unit)
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

kGLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
kGLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
kGLUtil.__bColorOctahedron  = new Float32Array(kGLUtil.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
kGLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);
kGLUtil.__bVertexPyramid    = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
kGLUtil.__bNormalPyramid    = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
kGLUtil.__bColorPyramid     = new Float32Array(kGLUtil.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
kGLUtil.__bIndexPyramid     = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);

module.exports = kGLUtil;
},{"../../math/glkVec3":25,"../../util/glkColor":30}],20:[function(require,module,exports){
module.exports =
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
},{}],21:[function(require,module,exports){
var kMath = require('./glkMath'),
    Mat33 = require('./glkMat44'),
    Mat44 = require('./glkMat44');

module.exports =
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

    makeScale : function(sx,sy,sz)
    {
        var m = this.make();

        m[0]  = sx;
        m[5]  = sy;
        m[10] = sz;

        return m;
    },

    makeTranslate : function(tx,ty,tz)
    {
        var m = this.make();

        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        return m;
    },

    makeRotationX : function(a)
    {
        var m = this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[5]  = cos;
        m[6]  = -sin;
        m[9]  = sin;
        m[10] = cos;

        return m;
    },

    makeRotationY : function(a)
    {
        var m = this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[2] = sin;
        m[8] = -sin;
        m[10]= cos;

        return m;
    },

    makeRotationZ : function(a)
    {
        var m = this.make();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[1] = sin;
        m[4] = -sin;
        m[5] = cos;

        return m;
    },

    makeRotationXYZ : function(ax,ay,az)
    {
        var m = this.make();

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

        if(Math.sqrt(x * x + y * y + z * z) < kMath.EPSILON) { return null; }

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

    multPre : function(m0,m1)
    {
        var m = this.make();

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

    mult : function(m0,m1)
    {
        return this.multPre(m0,m1);
    },

    multPost : function(m0,m1)
    {
        return this.multPre(m1,m0);
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

    isFloatEqual : function(m0,m1)
    {
        var i = -1;
        while(++i<16)
        {
            if(!kMath.isFloatEqual(m0[i],m1[i]))return false;
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
},{"./glkMat44":21,"./glkMath":22}],22:[function(require,module,exports){
module.exports =
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

},{}],23:[function(require,module,exports){
module.exports =
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
},{}],24:[function(require,module,exports){
var Vec2 =
{
    SIZE : 2,

    make : function()
    {
        return new Float32Array([0,0]);
    }
};

module.exports = Vec2;
},{}],25:[function(require,module,exports){
module.exports =
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




},{}],26:[function(require,module,exports){

//TODO:FINISH
module.exports =
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
module.exports =
{
    METHOD_NOT_IMPLEMENTED:'Method not implemented in target platform.',
    CLASS_IS_SINGLETON:    'Application is singleton. Get via getInstance().',
    APP_NO_SETUP:          'No setup method added to app.',
    APP_NO_UPDATE :        'No update method added to app.',
    PLASK_WINDOW_SIZE_SET: 'Plask window size can only be set on startup.',
    WRONG_PLATFORM:        'Wrong Platform.'
};
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
var Vec2   = require('../math/glkVec2'),
    kError = require('../system/glkError');

function Mouse()
{
    if(Mouse.__instance)throw new Error(kError.CLASS_IS_SINGLETON);

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
},{"../math/glkVec2":24,"../system/glkError":28}],32:[function(require,module,exports){
module.exports =
{
    toArray : function(float32Array){return Array.prototype.slice.call(float32Array);}
};
},{}],33:[function(require,module,exports){
var GLKit = require('../../../src/glKit/foam.js');

function App()
{
    GLKit.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(800,600);
}

App.prototype = Object.create(GLKit.Application.prototype);

App.prototype.setup = function(){};

App.prototype.update = function()
{
    var kgl = this.kgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 1 + Math.sin(time) * 0.25;

    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    cam.setPosition3f(Math.cos(time)*Math.PI*zoom,zoom,Math.sin(time)*Math.PI*zoom);
    cam.updateMatrices();

    this.drawSystem();
};

App.prototype.drawSystem =  function()
{
    var kgl = this.kgl;

    kgl.color1f(0.25);
    GLKit.fGLUtil.drawGrid(kgl,8,1);
    GLKit.fGLUtil.drawGridCube(kgl,8,1);
    GLKit.fGLUtil.drawAxes(kgl,4);
};

var app = new App();

},{"../../../src/glKit/glKit.js":5}],34:[function(require,module,exports){

},{}]},{},[33])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9hcHAvZ2xrQXBwSW1wbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2FwcC9nbGtBcHBJbXBsUGxhc2suanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9hcHAvZ2xrQXBwSW1wbFdlYi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2FwcC9nbGtBcHBsaWNhdGlvbi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dsS2l0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrRGlyZWN0aW9uYWxMaWdodC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa0xpZ2h0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrTWF0R0wuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtNYXRlcmlhbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa1BvaW50TGlnaHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtTcG90TGlnaHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtUZXh0dXJlLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1Byb2dGcmFnU2hhZGVyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1Byb2dMb2FkZXIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9zaGFkZXIvZ2xrUHJvZ1ZlcnRleFNoYWRlci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL3NoYWRlci9nbGtTaGFkZXJMb2FkZXIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbGtDYW1lcmFCYXNpYy5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsa0dMLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvdXRpbC9nbGtHTFV0aWwuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa01hdDMzLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtNYXQ0NC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrTWF0aC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrUXVhdGVybmlvbi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrVmVjMi5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrVmVjMy5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrVmVjNC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L3N5c3RlbS9nbGtEZWZhdWx0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvc3lzdGVtL2dsa0Vycm9yLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvc3lzdGVtL2dsa1BsYXRmb3JtLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvdXRpbC9nbGtDb2xvci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L3V0aWwvZ2xrTW91c2UuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC91dGlsL2dsa1V0aWwuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3Rlc3RzLzAwX0Jhc2ljX0FwcGxpY2F0aW9uL3NyYy9hcHAuanMiLCIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvX2VtcHR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRGVmYXVsdCA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtEZWZhdWx0JyksXG4gICAgZ2xrRXJyb3IgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2dsa0Vycm9yJyk7XG5cbmZ1bmN0aW9uIEFwcEltcGwoKVxue1xuICAgIHRoaXMuX2NvbnRleHQzZCA9IG51bGw7XG4gICAgdGhpcy5fY29udGV4dDJkID0gbnVsbDtcblxuICAgIHRoaXMuX3dpbmRvd1RpdGxlICAgICAgID0gMDtcbiAgICB0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGZhbHNlO1xuICAgIHRoaXMuX2lzRnVsbHNjcmVlbiAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5faXNCb3JkZXJsZXNzICAgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwbGF5SWQgICAgICAgICA9IDA7XG5cbiAgICB0aGlzLl9rZXlEb3duICAgPSBmYWxzZTtcbiAgICB0aGlzLl9rZXlTdHIgICAgPSAnJztcbiAgICB0aGlzLl9rZXlDb2RlICAgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcblxuICAgIHRoaXMuX21vdXNlTW92ZSAgID0gZmFsc2U7XG4gICAgdGhpcy5fbW91c2VCb3VuZHMgPSB0cnVlO1xuXG4gICAgdGhpcy5fdGFyZ2V0RlBTICAgICA9IERlZmF1bHQuQVBQX0ZQUztcbiAgICB0aGlzLl9iVXBkYXRlICAgICAgID0gdHJ1ZTtcblxuICAgIHRoaXMuX2ZyYW1lcyAgICAgICAgPSAwO1xuICAgIHRoaXMuX2ZyYW1ldGltZSAgICAgPSAwO1xuICAgIHRoaXMuX2ZyYW1lbnVtICAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWUgICAgICAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWVTdGFydCAgICAgPSAtMTtcbiAgICB0aGlzLl90aW1lTmV4dCAgICAgID0gLTE7XG4gICAgdGhpcy5fdGltZUludGVydmFsICA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbiAgICB0aGlzLl90aW1lRGVsdGEgICAgID0gMDtcblxuICAgIHRoaXMuX3dpZHRoICA9IC0xO1xuICAgIHRoaXMuX2hlaWdodCA9IC0xO1xuICAgIHRoaXMuX3JhdGlvICA9IC0xO1xuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IGZhbHNlO1xufVxuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0luaXRpYWxpemVkID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2lzSW5pdGlhbGl6ZWQ7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0VXBkYXRlICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2JVcGRhdGUgPSBib29sO307XG5cbkFwcEltcGwucHJvdG90eXBlLmluaXQgICAgPSBmdW5jdGlvbihhcHBPYmopICAgICAge3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodCl7dGhyb3cgbmV3IEVycm9yKGdsa0Vycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO307XG5cbkFwcEltcGwucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uKGJvb2wpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNGdWxsV2luZG93RnJhbWUgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lO307XG5cbkFwcEltcGwucHJvdG90eXBlLnNldEZ1bGxzY3JlZW4gPSBmdW5jdGlvbihib29sKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLmlzRnVsbHNjcmVlbiAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pc0Z1bGxzY3JlZW47fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lzQm9yZGVybGVzczt9XG5cbkFwcEltcGwucHJvdG90eXBlLnNldERpc3BsYXkgPSBmdW5jdGlvbihudW0pe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0RGlzcGxheSA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3BsYXlJZDt9XG5cblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKSAgICAgICAgICAgIHtyZXR1cm4gdGhpcy5fd2lkdGg7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkgICAgICAgICAgICB7cmV0dXJuIHRoaXMuX2hlaWdodDt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0QXNwZWN0UmF0aW9XaW5kb3cgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yYXRpbzt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRUYXJnZXRGUFMgPSBmdW5jdGlvbihmcHMpe3RoaXMuX3RhcmdldEZQUyA9IGZwczt0aGlzLl90aW1lSW50ZXJ2YWwgID0gdGhpcy5fdGFyZ2V0RlBTIC8gMTAwMC4wO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUYXJnZXRGUFMgPSBmdW5jdGlvbigpICAge3JldHVybiB0aGlzLl90YXJnZXRGUFM7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0V2luZG93VGl0bGUgICAgICAgPSBmdW5jdGlvbih0aXRsZSl7dGhpcy5fd2luZG93VGl0bGUgPSB0aXRsZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUucmVzdHJpY3RNb3VzZVRvRnJhbWUgPSBmdW5jdGlvbihib29sKSB7dGhpcy5fbW91c2VCb3VuZHMgPSBib29sO307XG5cbkFwcEltcGwucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWUgICAgICAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVTdGFydCAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVOZXh0ICAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVEZWx0YSAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaXNLZXlEb3duICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa2V5RG93bjt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNNb3VzZURvd24gICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW91c2VEb3duO307XG5BcHBJbXBsLnByb3RvdHlwZS5pc01vdXNlTW92ZSAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tb3VzZU1vdmU7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleUNvZGUgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2tleUNvZGU7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleVN0ciAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2tleVN0cjt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW91c2VXaGVlbERlbHRhO307XG5cblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIGZhbHNlO307XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCAgID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFBhcmVudCAgICAgICAgICAgICAgPSBmdW5jdGlvbigpICAge3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuc2V0UGFyZW50ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIGZhbHNlO307XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbDsiLCJ2YXIgRGVmYXVsdCAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRGVmYXVsdCcpLFxuICAgIGtFcnJvciAgICAgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2dsa0Vycm9yJyksXG4gICAga0dMICAgICAgICAgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtHTCcpLFxuICAgIEFwcEltcGwgICAgID0gcmVxdWlyZSgnLi9nbGtBcHBJbXBsJyksXG4gICAgQ2FtZXJhQmFzaWMgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtDYW1lcmFCYXNpYycpLFxuICAgIHBsYXNrICAgICAgID0gcmVxdWlyZSgncGxhc2snKTtcblxuZnVuY3Rpb24gQXBwSW1wbFBsYXNrKClcbntcbiAgICBBcHBJbXBsLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcbn1cblxuQXBwSW1wbFBsYXNrLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwSW1wbC5wcm90b3R5cGUpO1xuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQpXG57XG4gICAgaWYodGhpcy5faXNJbml0aWFsaXplZCl0aHJvdyBuZXcgRXJyb3Ioa0Vycm9yLlBMQVNLX1dJTkRPV19TSVpFX1NFVCk7XG5cbiAgICB0aGlzLl93aWR0aCAgPSB3aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fcmF0aW8gID0gd2lkdGggLyBoZWlnaHQ7XG59O1xuXG4vL1RPRE86IEZpeCB0aW1lIGRlbHRhLCBkb3VibGUgbWVhc3VyaW5nIG9mIHRpbWUgaW4gZ2VuZXJhbFxuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihhcHBPYmopXG57XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtb3VzZTtcbiAgICB2YXIgcHJldlRpbWUgPSAwLFxuICAgICAgICB0aW1lO1xuXG4gICAgcGxhc2suc2ltcGxlV2luZG93KHtcblxuICAgICAgICBzZXR0aW5nczpcbiAgICAgICAge1xuICAgICAgICAgICAgd2lkdGg6ICAgICAgIHNlbGYuX3dpZHRoICB8fCBEZWZhdWx0LkFQUF9XSURUSCxcbiAgICAgICAgICAgIGhlaWdodDogICAgICBzZWxmLl9oZWlnaHQgfHwgRGVmYXVsdC5BUFBfSEVJR0hULFxuICAgICAgICAgICAgdHlwZTogICAgICAgIERlZmF1bHQuQVBQX1BMQVNLX1RZUEUsXG4gICAgICAgICAgICB2c3luYzogICAgICAgRGVmYXVsdC5BUFBfUExBU0tfVlNZTkMsXG4gICAgICAgICAgICBtdWx0aXNhbXBsZTogRGVmYXVsdC5BUFBfUExBU0tfTVVMVElTQU1QTEUsXG4gICAgICAgICAgICBib3JkZXJsZXNzOiAgc2VsZi5faXNCb3JkZXJsZXNzLFxuICAgICAgICAgICAgZnVsbHNjcmVlbjogIHNlbGYuX2lzRnVsbHNjcmVlbixcbiAgICAgICAgICAgIHRpdGxlOiAgICAgICBzZWxmLl93aW5kb3dUaXRsZSB8fCBEZWZhdWx0LkFQUF9QTEFTS19XSU5ET1dfVElUTEVcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OmZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgYXBwT2JqLmtnbCAgICA9IG5ldyBrR0wodGhpcy5nbCxudWxsKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICAgICAgICAgIGFwcE9iai5rZ2wuc2V0Q2FtZXJhKGFwcE9iai5jYW1lcmEpO1xuICAgICAgICAgICAgYXBwT2JqLmNhbWVyYS5zZXRQZXJzcGVjdGl2ZShEZWZhdWx0LkNBTUVSQV9GT1YsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9ORUFSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9GQVIpO1xuXG4gICAgICAgICAgICBhcHBPYmouY2FtZXJhLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEudXBkYXRlTWF0cmljZXMoKTtcblxuICAgICAgICAgICAgaWYoc2VsZi5fYlVwZGF0ZSl0aGlzLmZyYW1lcmF0ZShzZWxmLl90YXJnZXRGUFMpO1xuICAgICAgICAgICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX3RpbWVTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBzZWxmLl90aW1lTmV4dCAgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdtb3VzZU1vdmVkJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBhcHBPYmoubW91c2UuX3Bvc2l0aW9uWzBdO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoubW91c2UuX3Bvc2l0aW9uTGFzdFsxXSA9IGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5fbW91c2VCb3VuZHMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMF0gPSBNYXRoLm1heCgwLE1hdGgubWluKGUueCxzZWxmLl93aWR0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvblsxXSA9IE1hdGgubWF4KDAsTWF0aC5taW4oZS55LHNlbGYuX2hlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvblswXSA9IGUueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV0gPSBlLnk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2xlZnRNb3VzZURvd24nLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZURvd24oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5vbignbGVmdE1vdXNlVXAnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VVcChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdzY3JvbGxXaGVlbCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX21vdXNlV2hlZWxEZWx0YSArPSBNYXRoLm1heCgtMSxNYXRoLm1pbigxLGUuZHkpKSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZVdoZWVsKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2tleVVwJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlTdHIgID0gZS5zdHI7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2tleUNvZGUgPSBlLmtleUNvZGU7XG4gICAgICAgICAgICAgICAgICAgIGFwcE9iai5vbktleVVwKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2tleURvd24nLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IGUuc3RyO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25LZXlEb3duKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHNlbGYuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYXc6ZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9mcmFtZW51bSAgPSB0aGlzLmZyYW1lbnVtO1xuICAgICAgICAgICAgdGltZSAgICAgICAgICAgID0gc2VsZi5fZnJhbWV0aW1lID0gdGhpcy5mcmFtZXRpbWU7XG5cbiAgICAgICAgICAgIG1vdXNlICAgICAgICAgICA9IGFwcE9iai5tb3VzZTtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlTW92ZSA9IG1vdXNlLl9wb3NpdGlvblswXSAhPSBtb3VzZS5fcG9zaXRpb25MYXN0WzBdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25bMV0gIT0gbW91c2UuX3Bvc2l0aW9uTGFzdFsxXTtcbiAgICAgICAgICAgIGFwcE9iai51cGRhdGUoKTtcbiAgICAgICAgICAgIHNlbGYuX3RpbWVEZWx0YSA9IHRpbWUgLSBwcmV2VGltZTtcbiAgICAgICAgICAgIHByZXZUaW1lID0gdGltZTtcblxuICAgICAgICB9fSk7XG59O1xuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZnJhbWV0aW1lO307XG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZnJhbWVudW07fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lRGVsdGE7fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lU3RhcnQ7fTtcblxuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5zZXRGdWxsV2luZG93RnJhbWUgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGJvb2w7cmV0dXJuIHRydWU7fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuc2V0RnVsbHNjcmVlbiAgICAgID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5faXNGdWxsc2NyZWVuID0gYm9vbDtyZXR1cm4gdHJ1ZTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzICAgICAgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0JvcmRlcmxlc3MgPSBib29sO3JldHVybiB0cnVlO307XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBJbXBsUGxhc2s7XG5cblxuXG4iLCJ2YXIgRGVmYXVsdCAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRGVmYXVsdCcpLFxuICAgIEFwcEltcGwgICAgID0gcmVxdWlyZSgnLi9nbGtBcHBJbXBsJyksXG4gICAga0dMICAgICAgICAgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtHTCcpLFxuICAgIENhbWVyYUJhc2ljID0gcmVxdWlyZSgnLi4vZ3JhcGhpY3MvZ2xrQ2FtZXJhQmFzaWMnKTtcblxuZnVuY3Rpb24gQXBwSW1wbFdlYigpXG57XG4gICAgQXBwSW1wbC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgY2FudmFzM2QgPSB0aGlzLl9jYW52YXMzZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjYW52YXMzZC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnMCcpO1xuICAgICAgICBjYW52YXMzZC5mb2N1cygpO1xuXG4gICAgdGhpcy5fY29udGV4dDNkID0gY2FudmFzM2QuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuXG4gICAgdmFyIGNhbnZhczJkID0gdGhpcy5fY2FudmFzMmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIHRoaXMuX3BhcmVudCAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX21vdXNlRXZlbnRUYXJnZXQgPSBjYW52YXMzZDtcbiAgICB0aGlzLl9rZXlFdmVudFRhcmdldCAgID0gY2FudmFzM2Q7XG5cbiAgICB0aGlzLl9jb250ZXh0MmQgPSBjYW52YXMyZC5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG59XG5cbkFwcEltcGxXZWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBJbXBsLnByb3RvdHlwZSk7XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uKCkgICB7cmV0dXJuIHRoaXMuX2NvbnRleHQzZC5wYXJlbnROb2RlO307XG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihvYmope3RoaXMuX3BhcmVudCA9IG9iajt9O1xuXG5cbkFwcEltcGxXZWIucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQpXG57XG4gICAgaWYodGhpcy5faXNGdWxsV2luZG93RnJhbWUpe3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDt9XG4gICAgaWYod2lkdGggPT0gdGhpcy5fd2lkdGggJiYgaGVpZ2h0ID09IHRoaXMuX2hlaWdodClyZXR1cm47XG5cbiAgICB0aGlzLl93aWR0aCAgPSB3aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fcmF0aW8gID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKGFwcE9iailcbntcbiAgICB2YXIgc2VsZiAgID0gdGhpcztcbiAgICB2YXIgbW91c2UgID0gYXBwT2JqLm1vdXNlO1xuICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMzZDtcblxuICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5fd2luZG93VGl0bGUgfHwgZG9jdW1lbnQudGl0bGU7XG5cbiAgICBpZighdGhpcy5fcGFyZW50KWRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBlbHNlIHRoaXMuX3BhcmVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG5cbiAgICB2YXIgbW91c2VFdmVudFRhcmdldCA9IHRoaXMuX21vdXNlRXZlbnRUYXJnZXQsXG4gICAgICAgIGtleUV2ZW50VGFyZ2V0ICAgPSB0aGlzLl9rZXlFdmVudFRhcmdldDtcblxuXG4gICAgYXBwT2JqLmtnbCA9IG5ldyBrR0wodGhpcy5fY29udGV4dDNkLHRoaXMuX2NvbnRleHQyZCk7XG4gICAgYXBwT2JqLmtnbC5nbC52aWV3cG9ydCgwLDAsdGhpcy5fd2lkdGgsdGhpcy5faGVpZ2h0KTtcblxuICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICBhcHBPYmoua2dsLnNldENhbWVyYShhcHBPYmouY2FtZXJhKTtcbiAgICBhcHBPYmouY2FtZXJhLnNldFBlcnNwZWN0aXZlKERlZmF1bHQuQ0FNRVJBX0ZPVixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdC5DQU1FUkFfTkVBUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERlZmF1bHQuQ0FNRVJBX0ZBUik7XG4gICAgYXBwT2JqLmNhbWVyYS5zZXRUYXJnZXQzZigwLDAsMCk7XG4gICAgYXBwT2JqLmNhbWVyYS51cGRhdGVNYXRyaWNlcygpO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25MYXN0WzBdID0gbW91c2UuX3Bvc2l0aW9uWzBdO1xuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uTGFzdFsxXSA9IG1vdXNlLl9wb3NpdGlvblsxXTtcblxuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzBdID0gZS5wYWdlWDtcbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvblsxXSA9IGUucGFnZVk7XG5cbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlTW92ZShlKTtcblxuICAgICAgICB9KTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlRG93bihlKTtcblxuICAgICAgICB9KTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VVcChlKTtcblxuICAgICAgICB9KTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlV2hlZWxEZWx0YSArPSBNYXRoLm1heCgtMSxNYXRoLm1pbigxLCBlLndoZWVsRGVsdGEpKSAqIC0xO1xuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VXaGVlbChlKTtcbiAgICAgICAgfSk7XG5cblxuICAgIGtleUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9rZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuX2tleUNvZGUgPSBlLmtleUNvZGU7XG4gICAgICAgICAgICBzZWxmLl9rZXlTdHIgID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpOy8vbm90IHJlbGlhYmxlO1xuICAgICAgICAgICAgYXBwT2JqLm9uS2V5RG93bihlKTtcblxuICAgICAgICB9KTtcblxuICAgIGtleUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5fa2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgIHNlbGYuX2tleVN0ciAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSk7XG4gICAgICAgICAgICBhcHBPYmoub25LZXlVcChlKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgdmFyIGZ1bGxXaW5kb3dGcmFtZSA9IHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lO1xuICAgIHZhciBjYW1lcmE7XG4gICAgdmFyIGdsO1xuXG4gICAgdmFyIHdpbmRvd1dpZHRoLFxuICAgICAgICB3aW5kb3dIZWlnaHQ7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDYW1lcmFSYXRpbygpXG4gICAge1xuICAgICAgICBjYW1lcmEgPSBhcHBPYmouY2FtZXJhO1xuICAgICAgICBjYW1lcmEuc2V0QXNwZWN0UmF0aW8oc2VsZi5fcmF0aW8pO1xuICAgICAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZXdwb3J0R0woKVxuICAgIHtcbiAgICAgICAgZ2wgPSBhcHBPYmoua2dsO1xuICAgICAgICBnbC5nbC52aWV3cG9ydCgwLDAsc2VsZi5fd2lkdGgsc2VsZi5faGVpZ2h0KTtcbiAgICAgICAgZ2wuY2xlYXJDb2xvcihnbC5nZXRDbGVhckJ1ZmZlcigpKTtcbiAgICB9XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICB3aW5kb3dXaWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICAgICAgaWYoZnVsbFdpbmRvd0ZyYW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlbGYuc2V0U2l6ZSh3aW5kb3dXaWR0aCx3aW5kb3dIZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgdXBkYXRlQ2FtZXJhUmF0aW8oKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVWaWV3cG9ydEdMKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFwcE9iai5vbldpbmRvd1Jlc2l6ZShlKTtcblxuICAgICAgICAgICAgaWYoIWZ1bGxXaW5kb3dGcmFtZSAmJiAoc2VsZi5fd2lkdGggPT0gd2luZG93V2lkdGggJiYgc2VsZi5faGVpZ2h0ID09IHdpbmRvd0hlaWdodCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXBkYXRlQ2FtZXJhUmF0aW8oKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVWaWV3cG9ydEdMKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgaWYodGhpcy5fYlVwZGF0ZSlcbiAgICB7XG4gICAgICAgIHZhciB0aW1lLCB0aW1lRGVsdGE7XG4gICAgICAgIHZhciB0aW1lSW50ZXJ2YWwgPSB0aGlzLl90aW1lSW50ZXJ2YWw7XG4gICAgICAgIHZhciB0aW1lTmV4dDtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlLG51bGwpO1xuXG4gICAgICAgICAgICB0aW1lICAgICAgPSBzZWxmLl90aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRpbWVEZWx0YSA9IHRpbWUgLSBzZWxmLl90aW1lTmV4dDtcblxuICAgICAgICAgICAgc2VsZi5fdGltZURlbHRhID0gTWF0aC5taW4odGltZURlbHRhIC8gdGltZUludGVydmFsLCAxKTtcblxuICAgICAgICAgICAgaWYodGltZURlbHRhID4gdGltZUludGVydmFsKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpbWVOZXh0ID0gc2VsZi5fdGltZU5leHQgPSB0aW1lIC0gKHRpbWVEZWx0YSAlIHRpbWVJbnRlcnZhbCk7XG5cbiAgICAgICAgICAgICAgICBhcHBPYmoudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLl90aW1lRWxhcHNlZCA9ICh0aW1lTmV4dCAtIHNlbGYuX3RpbWVTdGFydCkgLyAxMDAwLjA7XG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVudW0rKztcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgfVxuICAgIGVsc2UgYXBwT2JqLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcblxufTtcblxuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oYXBwT2JqKVxue1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsZnVuY3Rpb24oKXtzZWxmLl9pbml0KGFwcE9iaik7fSk7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5fdXBkYXRlQ2FudmFzM2RTaXplID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMzZCxcbiAgICAgICAgd2lkdGggID0gdGhpcy5fd2lkdGgsXG4gICAgICAgIGhlaWdodCA9IHRoaXMuX2hlaWdodDtcblxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggID0gd2lkdGggICsgJ3B4JztcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgICAgIGNhbnZhcy53aWR0aCAgICAgICAgPSB3aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCAgICAgICA9IGhlaWdodDtcbn07XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdGltZUVsYXBzZWQ7fTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uKG9iail7dGhpcy5fbW91c2VFdmVudFRhcmdldCA9IG9iajt9O1xuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0S2V5TGlzdGVuZXJUYXJnZXQgICA9IGZ1bmN0aW9uKG9iail7dGhpcy5fa2V5RXZlbnRUYXJnZXQgPSBvYmo7fTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSAgICAgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGJvb2w7cmV0dXJuIHRydWU7fTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEltcGxXZWI7XG5cbiIsInZhciBrRXJyb3IgICAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRXJyb3InKSxcbiAgICBQbGF0Zm9ybSAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrUGxhdGZvcm0nKSxcbiAgICBBcHBJbXBsV2ViICAgPSByZXF1aXJlKCcuL2dsa0FwcEltcGxXZWInKSxcbiAgICBBcHBJbXBsUGxhc2sgPSByZXF1aXJlKCcuL2dsa0FwcEltcGxQbGFzaycpLFxuICAgIE1vdXNlICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZ2xrTW91c2UnKSxcbiAgICBDYW1lcmFCYXNpYyAgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtDYW1lcmFCYXNpYycpO1xuXG5cbmZ1bmN0aW9uIEFwcGxpY2F0aW9uKClcbntcbiAgICBpZihBcHBsaWNhdGlvbi5fX2luc3RhbmNlKXRocm93IG5ldyBFcnJvcihrRXJyb3IuQ0xBU1NfSVNfU0lOR0xFVE9OKTtcblxuICAgIHZhciB0YXJnZXQgID0gUGxhdGZvcm0uZ2V0VGFyZ2V0KCk7XG4gICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgKXRocm93IG5ldyBFcnJvcihrRXJyb3IuV1JPTkdfUExBVEZPUk0pO1xuXG4gICAgdGhpcy5fYXBwSW1wbCA9IHRhcmdldCA9PSBQbGF0Zm9ybS5XRUIgICA/IG5ldyBBcHBJbXBsV2ViKGFyZ3VtZW50cykgOlxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPT0gUGxhdGZvcm0uUExBU0sgPyBuZXcgQXBwSW1wbFBsYXNrKGFyZ3VtZW50cykgOlxuICAgICAgICAgICAgICAgICAgICBudWxsO1xuXG4gICAgdGhpcy5tb3VzZSAgPSBuZXcgTW91c2UoKTtcbiAgICB0aGlzLmtnbCAgICA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuXG4gICAgQXBwbGljYXRpb24uX19pbnN0YW5jZSA9IHRoaXM7XG59XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXR1cCAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihrRXJyb3IuQVBQX05PX1NFVFVQKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKGtFcnJvci5BUFBfTk9fVVBEQVRFKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodClcbntcbiAgICB2YXIgYXBwSW1wbCA9IHRoaXMuX2FwcEltcGw7XG4gICAgICAgIGFwcEltcGwuc2V0U2l6ZSh3aWR0aCxoZWlnaHQpO1xuXG4gICAgaWYoIWFwcEltcGwuaXNJbml0aWFsaXplZCgpKWFwcEltcGwuaW5pdCh0aGlzKTtcbn07XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRXaWR0aCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRIZWlnaHQoKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0VXBkYXRlID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5fYXBwSW1wbC5zZXRVcGRhdGUoYm9vbCk7fTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldFdpbmRvd1RpdGxlICAgICAgID0gZnVuY3Rpb24odGl0bGUpe3RoaXMuX2FwcEltcGwuc2V0V2luZG93VGl0bGUodGl0bGUpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUucmVzdHJpY3RNb3VzZVRvRnJhbWUgPSBmdW5jdGlvbihib29sKSB7dGhpcy5fYXBwSW1wbC5yZXN0cmljdE1vdXNlVG9GcmFtZShib29sKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEZ1bGxXaW5kb3dGcmFtZShib29sKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldEZ1bGxzY3JlZW4gICAgICAgPSBmdW5jdGlvbihib29sKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXRGdWxsc2NyZWVuKHRydWUpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNGdWxsc2NyZWVuICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzRnVsbHNjcmVlbigpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyAgICAgICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEJvcmRlcmxlc3MoYm9vbCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc0JvcmRlcmxlc3MgICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNCb3JkZXJsZXNzKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24obnVtKSB7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RGlzcGxheShudW0pO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RGlzcGxheSAgICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmdldERpc3BsYXkoKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0VGFyZ2V0RlBTID0gZnVuY3Rpb24oZnBzKXt0aGlzLl9hcHBJbXBsLnNldFRhcmdldEZQUyhmcHMpO307XG5cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzS2V5RG93biAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNLZXlEb3duKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc01vdXNlRG93biAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VEb3duKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc01vdXNlTW92ZSAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VNb3ZlKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRLZXlTdHIgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleVN0cigpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0S2V5Q29kZSAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRLZXlDb2RlKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRNb3VzZVdoZWVsRGVsdGEgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldE1vdXNlV2hlZWxEZWx0YSgpO307XG5cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uS2V5RG93biAgICA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25LZXlVcCAgICAgID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlVXAgICAgPSBmdW5jdGlvbihlKXt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uTW91c2VEb3duICA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZVdoZWVsID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlTW92ZSAgPSBmdW5jdGlvbihlKXt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbihlKXt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEZyYW1lc0VsYXBzZWQoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRTZWNvbmRzRWxhcHNlZCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZSAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWUoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWVTdGFydCAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lU3RhcnQoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWVOZXh0ICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lTmV4dCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVEZWx0YSgpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRBc3BlY3RSYXRpb1dpbmRvdyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0QXNwZWN0UmF0aW8oKTt9O1xuXG5BcHBsaWNhdGlvbi5fX2luc3RhbmNlID0gbnVsbDtcbkFwcGxpY2F0aW9uLmdldEluc3RhbmNlID0gZnVuY3Rpb24oKXtyZXR1cm4gQXBwbGljYXRpb24uX19pbnN0YW5jZTt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uO1xuXG5cblxuXG5cbiIsIi8qKlxuICpcbiAqIGdsS2l0LmpzIC0gQSBXZWJHTCB0b29sYm94XG4gKlxuICogZ2xLaXQuanMgaXMgYXZhaWxhYmxlIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuICBUaGUgZnVsbCB0ZXh0IG9mIHRoZVxuICogTUlUIGxpY2Vuc2UgaXMgaW5jbHVkZWQgYmVsb3cuXG4gKlxuICogTUlUIExpY2Vuc2VcbiAqID09PT09PT09PT09XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyIEhlbnJ5ayBXb2xsaWsuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIE1hdGggICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa01hdGgnKSxcbiAgICBWZWMyICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtWZWMyJyksXG4gICAgVmVjMyAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZ2xrVmVjMycpLFxuICAgIFZlYzQgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa1ZlYzQnKSxcbiAgICBNYXQzMyAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtNYXQzMycpLFxuICAgIE1hdDQ0ICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa01hdDQ0JyksXG4gICAgUXVhdGVybmlvbiAgOiByZXF1aXJlKCcuL21hdGgvZ2xrUXVhdGVybmlvbicpLFxuXG5cbiAgICBNYXRHTCAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa01hdEdMJyksXG4gICAgUHJvZ0xvYWRlciAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9zaGFkZXIvZ2xrUHJvZ0xvYWRlcicpLFxuICAgIFNoYWRlckxvYWRlciA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1NoYWRlckxvYWRlcicpLFxuICAgIENhbWVyYUJhc2ljICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2xrQ2FtZXJhQmFzaWMnKSxcblxuICAgIExpZ2h0ICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa0xpZ2h0JyksXG4gICAgUG9pbnRMaWdodCAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZ2xrUG9pbnRMaWdodCcpLFxuICAgIERpcmVjdGlvbmFsTGlnaHQgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa0RpcmVjdGlvbmFsTGlnaHQnKSxcbiAgICBTcG90TGlnaHQgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtTcG90TGlnaHQnKSxcblxuICAgIE1hdGVyaWFsICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtNYXRlcmlhbCcpLFxuICAgIFRleHR1cmUgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtUZXh0dXJlJyksXG5cbiAgICBrR0xVdGlsICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvdXRpbC9nbGtHTFV0aWwnKSxcbiAgICBrR0wgICAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2xrR0wnKSxcblxuICAgIE1vdXNlICAgICAgIDogcmVxdWlyZSgnLi91dGlsL2dsa01vdXNlJyksXG4gICAgQ29sb3IgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZ2xrQ29sb3InKSxcbiAgICBVdGlsICAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9nbGtVdGlsJyksXG5cbiAgICBQbGF0Zm9ybSAgICA6IHJlcXVpcmUoJy4vc3lzdGVtL2dsa1BsYXRmb3JtJyksXG4gICAgQXBwbGljYXRpb24gOiByZXF1aXJlKCcuL2FwcC9nbGtBcHBsaWNhdGlvbicpXG5cbn07XG5cbiIsInZhciBWZWMzICA9IHJlcXVpcmUoJy4uLy4uL21hdGgvZ2xrVmVjMycpLFxuICAgIExpZ2h0ID0gcmVxdWlyZSgnLi9nbGtMaWdodCcpO1xuXG5mdW5jdGlvbiBEaXJlY3Rpb25hbExpZ2h0KGlkKVxue1xuICAgIExpZ2h0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcbn1cblxuRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExpZ2h0LnByb3RvdHlwZSk7XG5cbkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlLnNldERpcmVjdGlvbiAgID0gZnVuY3Rpb24odikgICAge1ZlYzMuc2V0KHRoaXMuZGlyZWN0aW9uLHYpO307XG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5zZXREaXJlY3Rpb24zZiA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMuZGlyZWN0aW9uLHgseSx6KTt9O1xuXG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5sb29rQXQgICAgICAgICA9IGZ1bmN0aW9uKHBvc2l0aW9uLHRhcmdldClcbntcbiAgICB0aGlzLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB0aGlzLnNldERpcmVjdGlvbihWZWMzLm5vcm1hbGl6ZShWZWMzLnN1YmJlZCh0YXJnZXQscG9zaXRpb24pKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGlvbmFsTGlnaHQ7IiwidmFyIFZlYzMgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBWZWM0ID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9nbGtWZWM0Jyk7XG5cbmZ1bmN0aW9uIExpZ2h0KGlkKVxue1xuICAgIHRoaXMuX2lkICAgPSBpZDtcblxuICAgIHRoaXMuYW1iaWVudCAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuICAgIHRoaXMuZGlmZnVzZSAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuICAgIHRoaXMuc3BlY3VsYXIgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuXG4gICAgdGhpcy5wb3NpdGlvbiAgICAgICAgICAgICA9IFZlYzQuWkVSTygpO1xuICAgIHRoaXMuZGlyZWN0aW9uICAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuc3BvdEV4cG9uZW50ICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuc3BvdEN1dE9mZiAgICAgICAgICAgPSBudWxsO1xuXG4gICAgdGhpcy5jb25zdGFudEF0dGVudHVhdGlvbiA9IDEuMDtcbiAgICB0aGlzLmxpbmVhckF0dGVudHVhdGlvbiAgID0gMDtcbiAgICB0aGlzLnF1YWRyaWNBdHRlbnR1YXRpb24gID0gMC4wMTtcbn1cblxuXG5MaWdodC5wcm90b3R5cGUuc2V0QW1iaWVudCAgICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLmFtYmllbnRbMF0gPSBjb2xvclswXTt0aGlzLmFtYmllbnRbMV0gPSBjb2xvclsxXTt0aGlzLmFtYmllbnRbMl0gPSBjb2xvclsyXTt9O1xuTGlnaHQucHJvdG90eXBlLnNldEFtYmllbnQzZiAgID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5hbWJpZW50WzBdID0gcjt0aGlzLmFtYmllbnRbMV0gPSBnO3RoaXMuYW1iaWVudFsyXSA9IGI7fTtcblxuTGlnaHQucHJvdG90eXBlLnNldERpZmZ1c2UgICAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5kaWZmdXNlWzBdID0gY29sb3JbMF07dGhpcy5kaWZmdXNlWzFdID0gY29sb3JbMV07dGhpcy5kaWZmdXNlWzJdID0gY29sb3JbMl07fTtcbkxpZ2h0LnByb3RvdHlwZS5zZXREaWZmdXNlM2YgICA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuZGlmZnVzZVswXSA9IHI7dGhpcy5kaWZmdXNlWzFdID0gZzt0aGlzLmRpZmZ1c2VbMl0gPSBiO307XG5cbkxpZ2h0LnByb3RvdHlwZS5zZXRTcGVjdWxhciAgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuc3BlY3VsYXJbMF0gPSBjb2xvclswXTt0aGlzLnNwZWN1bGFyWzFdID0gY29sb3JbMV07dGhpcy5zcGVjdWxhclsyXSA9IGNvbG9yWzJdO307XG5MaWdodC5wcm90b3R5cGUuc2V0U3BlY3VsYXIzZiAgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLnNwZWN1bGFyWzBdID0gcjt0aGlzLnNwZWN1bGFyWzFdID0gZzt0aGlzLnNwZWN1bGFyWzJdID0gYjt9O1xuXG5MaWdodC5wcm90b3R5cGUuc2V0UG9zaXRpb24gICAgPSBmdW5jdGlvbih2KSAgICB7VmVjNC5zZXQzZih0aGlzLnBvc2l0aW9uLHZbMF0sdlsxXSx2WzJdKTt9O1xuTGlnaHQucHJvdG90eXBlLnNldFBvc2l0aW9uM2YgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5wb3NpdGlvbix4LHkseik7fTtcblxuTGlnaHQucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faWQ7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodDsiLCJ2YXIgTWF0NDQgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2dsa01hdDQ0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBwZXJzcGVjdGl2ZSA6IGZ1bmN0aW9uKG0sZm92LGFzcGVjdCxuZWFyLGZhcilcbiAgICB7XG4gICAgICAgIHZhciBmICA9IDEuMCAvIE1hdGgudGFuKGZvdiowLjUpLFxuICAgICAgICAgICAgbmYgPSAxLjAgLyAobmVhci1mYXIpO1xuXG4gICAgICAgIG1bMF0gPSBmIC8gYXNwZWN0O1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IGY7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgICBtWzExXSA9IC0xO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAoMiAqIGZhciAqIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMDtcblxuICAgICAgICByZXR1cm4gbTtcblxuICAgIH0sXG5cbiAgICBmcnVzdHVtIDogZnVuY3Rpb24obSxsZWZ0LHJpZ2h0LGJvdHRvbSx0b3AsbmVhcixmYXIpXG4gICAge1xuICAgICAgICB2YXIgcmwgPSAxIC8gKHJpZ2h0IC0gbGVmdCksXG4gICAgICAgICAgICB0YiA9IDEgLyAodG9wIC0gYm90dG9tKSxcbiAgICAgICAgICAgIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcblxuXG4gICAgICAgIG1bIDBdID0gKG5lYXIgKiAyKSAqIHJsO1xuICAgICAgICBtWyAxXSA9IDA7XG4gICAgICAgIG1bIDJdID0gMDtcbiAgICAgICAgbVsgM10gPSAwO1xuICAgICAgICBtWyA0XSA9IDA7XG4gICAgICAgIG1bIDVdID0gKG5lYXIgKiAyKSAqIHRiO1xuICAgICAgICBtWyA2XSA9IDA7XG4gICAgICAgIG1bIDddID0gMDtcbiAgICAgICAgbVsgOF0gPSAocmlnaHQgKyBsZWZ0KSAqIHJsO1xuICAgICAgICBtWyA5XSA9ICh0b3AgKyBib3R0b20pICogdGI7XG4gICAgICAgIG1bMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTFdID0gLTE7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IChmYXIgKiBuZWFyICogMikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAwO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBsb29rQXQgOiBmdW5jdGlvbihtLGV5ZSx0YXJnZXQsdXApXG4gICAge1xuICAgICAgICB2YXIgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbGVuLFxuICAgICAgICAgICAgZXlleCA9IGV5ZVswXSxcbiAgICAgICAgICAgIGV5ZXkgPSBleWVbMV0sXG4gICAgICAgICAgICBleWV6ID0gZXllWzJdLFxuICAgICAgICAgICAgdXB4ID0gdXBbMF0sXG4gICAgICAgICAgICB1cHkgPSB1cFsxXSxcbiAgICAgICAgICAgIHVweiA9IHVwWzJdLFxuICAgICAgICAgICAgdGFyZ2V0eCA9IHRhcmdldFswXSxcbiAgICAgICAgICAgIHRhcnRldHkgPSB0YXJnZXRbMV0sXG4gICAgICAgICAgICB0YXJnZXR6ID0gdGFyZ2V0WzJdO1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhleWV4IC0gdGFyZ2V0eCkgPCAwLjAwMDAwMSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoZXlleSAtIHRhcnRldHkpIDwgMC4wMDAwMDEgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGV5ZXogLSB0YXJnZXR6KSA8IDAuMDAwMDAxKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0NDQuaWRlbnRpdHkobSk7XG4gICAgICAgIH1cblxuICAgICAgICB6MCA9IGV5ZXggLSB0YXJnZXR4O1xuICAgICAgICB6MSA9IGV5ZXkgLSB0YXJ0ZXR5O1xuICAgICAgICB6MiA9IGV5ZXogLSB0YXJnZXR6O1xuXG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICAgICAgejAgKj0gbGVuO1xuICAgICAgICB6MSAqPSBsZW47XG4gICAgICAgIHoyICo9IGxlbjtcblxuICAgICAgICB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XG4gICAgICAgIHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICAgICAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcbiAgICAgICAgaWYgKCFsZW4pIHtcbiAgICAgICAgICAgIHgwID0gMDtcbiAgICAgICAgICAgIHgxID0gMDtcbiAgICAgICAgICAgIHgyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgICAgICB4MCAqPSBsZW47XG4gICAgICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgICAgICB4MiAqPSBsZW47XG4gICAgICAgIH1cblxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuICAgICAgICBpZiAoIWxlbikge1xuICAgICAgICAgICAgeTAgPSAwO1xuICAgICAgICAgICAgeTEgPSAwO1xuICAgICAgICAgICAgeTIgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgICAgIHkwICo9IGxlbjtcbiAgICAgICAgICAgIHkxICo9IGxlbjtcbiAgICAgICAgICAgIHkyICo9IGxlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1bIDBdID0geDA7XG4gICAgICAgIG1bIDFdID0geTA7XG4gICAgICAgIG1bIDJdID0gejA7XG4gICAgICAgIG1bIDNdID0gMDtcbiAgICAgICAgbVsgNF0gPSB4MTtcbiAgICAgICAgbVsgNV0gPSB5MTtcbiAgICAgICAgbVsgNl0gPSB6MTtcbiAgICAgICAgbVsgN10gPSAwO1xuICAgICAgICBtWyA4XSA9IHgyO1xuICAgICAgICBtWyA5XSA9IHkyO1xuICAgICAgICBtWzEwXSA9IHoyO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gLSh4MCAqIGV5ZXggKyB4MSAqIGV5ZXkgKyB4MiAqIGV5ZXopO1xuICAgICAgICBtWzEzXSA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcbiAgICAgICAgbVsxNF0gPSAtKHowICogZXlleCArIHoxICogZXlleSArIHoyICogZXlleik7XG4gICAgICAgIG1bMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG59OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4uLy4uL3V0aWwvZ2xrQ29sb3InKTtcblxuZnVuY3Rpb24gTWF0ZXJpYWwoYW1iaWVudCxkaWZmdXNlLHNwZWN1bGFyLHNoaW5pbmVzcyxlbWlzc2lvbilcbntcbiAgICBhbWJpZW50ICAgPSBhbWJpZW50ICAgfHwgQ29sb3IubWFrZSgxLjAsMC41LDAuNSwxLjApO1xuICAgIGRpZmZ1c2UgICA9IGRpZmZ1c2UgICB8fCBDb2xvci5CTEFDSygpO1xuICAgIHNwZWN1bGFyICA9IHNwZWN1bGFyICB8fCBDb2xvci5CTEFDSygpO1xuICAgIHNoaW5pbmVzcyA9IHNoaW5pbmVzcyB8fCAxMC4wO1xuICAgIGVtaXNzaW9uICA9IGVtaXNzaW9uICB8fCBDb2xvci5CTEFDSztcblxuICAgIHRoaXMuZW1pc3Npb24gID0gZW1pc3Npb247XG4gICAgdGhpcy5hbWJpZW50ICAgPSBhbWJpZW50O1xuICAgIHRoaXMuZGlmZnVzZSAgID0gZGlmZnVzZTtcbiAgICB0aGlzLnNwZWN1bGFyICA9IHNwZWN1bGFyO1xuICAgIHRoaXMuc2hpbmluZXNzID0gc2hpbmluZXNzO1xufVxuXG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RW1pc3Npb24gICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuZW1pc3Npb24gPSBjb2xvcjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEVtaXNzaW9uM2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLmVtaXNzaW9uWzBdID0gcjt0aGlzLmVtaXNzaW9uWzFdID0gZzt0aGlzLmVtaXNzaW9uWzJdID0gYjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEVtaXNzaW9uNGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLmVtaXNzaW9uWzBdID0gcjt0aGlzLmVtaXNzaW9uWzFdID0gZzt0aGlzLmVtaXNzaW9uWzJdID0gYjt0aGlzLmVtaXNzaW9uWzNdID0gYTt9O1xuXG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0QW1iaWVudCAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5hbWJpZW50ID0gY29sb3I7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRBbWJpZW50M2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLmFtYmllbnRbMF0gPSByO3RoaXMuYW1iaWVudFsxXSA9IGc7dGhpcy5hbWJpZW50WzJdID0gYjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEFtYmllbnQ0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuYW1iaWVudFswXSA9IHI7dGhpcy5hbWJpZW50WzFdID0gZzt0aGlzLmFtYmllbnRbMl0gPSBiO3RoaXMuYW1iaWVudFszXSA9IGE7fTtcblxuTWF0ZXJpYWwucHJvdG90eXBlLnNldERpZmZ1c2UgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuZGlmZnVzZSA9IGNvbG9yO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RGlmZnVzZTNmID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5kaWZmdXNlWzBdID0gcjt0aGlzLmRpZmZ1c2VbMV0gPSBnO3RoaXMuZGlmZnVzZVsyXSA9IGI7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXREaWZmdXNlNGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLmRpZmZ1c2VbMF0gPSByO3RoaXMuZGlmZnVzZVsxXSA9IGc7dGhpcy5kaWZmdXNlWzJdID0gYjt0aGlzLmRpZmZ1c2VbM10gPSBhO307XG5cbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRTcGVjdWxhciAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5zcGVjdWxhciA9IGNvbG9yO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0U3BlY3VsYXIzZiA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuc3BlY3VsYXJbMF0gPSByO3RoaXMuc3BlY3VsYXJbMV0gPSBnO3RoaXMuc3BlY3VsYXJbMl0gPSBiO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0U3BlY3VsYXI0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuc3BlY3VsYXJbMF0gPSByO3RoaXMuc3BlY3VsYXJbMV0gPSBnO3RoaXMuc3BlY3VsYXJbMl0gPSBiO3RoaXMuc3BlY3VsYXJbM10gPSBhO307XG5cblxuTWF0ZXJpYWwucHJvdG90eXBlLmdldEVtaXNzaW9uICA9IGZ1bmN0aW9uKCl7cmV0dXJuIENvbG9yLmNvcHkodGhpcy5lbWlzc2lvbik7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXRBbWJpZW50ICAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuYW1iaWVudCk7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXREaWZmdXNlICAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuZGlmZnVzZSk7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXRTcGVjdWxhciAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuc3BlY3VsYXIpO307XG5NYXRlcmlhbC5wcm90b3R5cGUuZ2V0U2hpbmluZXNzID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zaGluaW5lc3M7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDtcbiIsInZhciBMaWdodCA9IHJlcXVpcmUoJy4vZ2xrTGlnaHQnKTtcblxuZnVuY3Rpb24gUG9pbnRMaWdodChpZClcbntcbiAgICBMaWdodC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG59XG5cblBvaW50TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMaWdodC5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50TGlnaHQ7IiwidmFyIERpcmVjdGlvbmFsTGlnaHQgPSByZXF1aXJlKCcuL2dsa0RpcmVjdGlvbmFsTGlnaHQnKTtcblxuZnVuY3Rpb24gU3BvdExpZ2h0KGlkKVxue1xuICAgIERpcmVjdGlvbmFsTGlnaHQuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xufVxuXG5TcG90TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZSk7XG5cblNwb3RMaWdodC5wcm90b3R5cGUuc2V0RXhwb25lbnQgPSBmdW5jdGlvbigpe307XG5TcG90TGlnaHQucHJvdG90eXBlLnNldEN1dE9mZiAgID0gZnVuY3Rpb24oKXt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwb3RMaWdodDsiLCJcbmZ1bmN0aW9uIFRleHR1cmUoKVxue1xuICAgIHRoaXMuX3RleCA9IG51bGw7XG4gICAgdGhpcy5fd2lkdGggPSBudWxsO1xuICAgIHRoaXMuX2hlaWdodCA9IG51bGw7XG5cbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpdGhpcy5zZXRUZXhTb3VyY2UoYXJndW1lbnRzWzBdKTtcbn1cblxuVGV4dHVyZS5wcm90b3R5cGUuc2V0VGV4U291cmNlID0gZnVuY3Rpb24oZ2xUZXgpXG57XG4gICAgdmFyIHRleCA9IHRoaXMuX3RleCA9IGdsVGV4O1xuICAgIHRoaXMuX3dpZHRoICA9IHRleC5pbWFnZS53aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSB0ZXguaW1hZ2UuaGVpZ2h0O1xufTtcblxuVGV4dHVyZS5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd2lkdGg7fTtcblRleHR1cmUucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2hlaWdodDt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7IiwibW9kdWxlLmV4cG9ydHMgPVxuXG4gICAgXCJ2YXJ5aW5nIHZlYzQgdlZlcnRleENvbG9yO1wiICtcblxuICAgICAgICBcInZvaWQgbWFpbih2b2lkKVwiICtcbiAgICAgICAgXCJ7XCIgK1xuICAgICAgICBcIiAgICBnbF9GcmFnQ29sb3IgPSB2VmVydGV4Q29sb3I7XCIgK1xuICAgICAgICBcIn1cIjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgbG9hZFByb2dyYW0gOiBmdW5jdGlvbihnbCx2ZXJ0ZXhTaGFkZXIsZnJhZ21lbnRTaGFkZXIpXG4gICAge1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSx2ZXJ0ZXhTaGFkZXIpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSxmcmFnbWVudFNoYWRlcik7XG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sZ2wuTElOS19TVEFUVVMpKVxuICAgICAgICB7XG4gICAgICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvZ3JhbTtcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID1cbiAgICBcImF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcIiArXG4gICAgICAgIFwiYXR0cmlidXRlIHZlYzQgYVZlcnRleENvbG9yO1wiICtcblxuICAgICAgICBcInZhcnlpbmcgdmVjNCB2VmVydGV4Q29sb3I7XCIgK1xuXG4gICAgICAgIFwidW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcIiArXG4gICAgICAgIFwidW5pZm9ybSBtYXQ0IHVQTWF0cml4O1wiICtcblxuICAgICAgICBcInZvaWQgbWFpbih2b2lkKVwiICtcbiAgICAgICAgXCJ7XCIgK1xuICAgICAgICBcIiAgICB2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3I7XCIgK1xuICAgICAgICBcIiAgICBnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7XCIgK1xuICAgICAgICBcIn1cIjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgUHJlZml4U2hhZGVyV2ViIDogJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycsXG5cbiAgICBsb2FkU2hhZGVyRnJvbVN0cmluZyA6IGZ1bmN0aW9uKGdsLHNvdXJjZVN0cmluZyx0eXBlKVxuICAgIHtcbiAgICAgICAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcblxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLHNvdXJjZVN0cmluZyk7XG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAgICAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlcixnbC5DT01QSUxFX1NUQVRVUykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaGFkZXI7XG4gICAgfVxuXG5cbn07IiwidmFyIFZlYzMgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgTWF0NDQgPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdDQ0JyksXG4gICAgTWF0R0wgPSByZXF1aXJlKCcuL2dsL2dsa01hdEdMJyk7XG5cbmZ1bmN0aW9uIENhbWVyYUJhc2ljKClcbntcbiAgICB0aGlzLnBvc2l0aW9uID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdGFyZ2V0ICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX3VwICAgICAgPSBWZWMzLkFYSVNfWSgpO1xuXG4gICAgdGhpcy5fZm92ICA9IDA7XG4gICAgdGhpcy5fbmVhciA9IDA7XG4gICAgdGhpcy5fZmFyICA9IDA7XG5cbiAgICB0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSAwO1xuXG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCAgPSBmYWxzZTtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4ID0gTWF0NDQubWFrZSgpO1xuICAgIHRoaXMubW9kZWxWaWV3TWF0cml4ICA9IE1hdDQ0Lm1ha2UoKTtcbn1cblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24oZm92LHdpbmRvd0FzcGVjdFJhdGlvLG5lYXIsZmFyKVxue1xuICAgIHRoaXMuX2ZvdiAgPSBmb3Y7XG4gICAgdGhpcy5fbmVhciA9IG5lYXI7XG4gICAgdGhpcy5fZmFyICA9IGZhcjtcblxuICAgIHRoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IHdpbmRvd0FzcGVjdFJhdGlvO1xuXG4gICAgdGhpcy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG59O1xuXG5cblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFRhcmdldCAgICAgICAgID0gZnVuY3Rpb24odikgICAge1ZlYzMuc2V0KHRoaXMuX3RhcmdldCx2KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRUYXJnZXQzZiAgICAgICA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMuX3RhcmdldCx4LHkseik7dGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0UG9zaXRpb24gICAgICAgPSBmdW5jdGlvbih2KSAgICB7VmVjMy5zZXQodGhpcy5wb3NpdGlvbix2KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRQb3NpdGlvbjNmICAgICA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMucG9zaXRpb24seCx5LHopO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFVwICAgICAgICAgICAgID0gZnVuY3Rpb24odikgICAge1ZlYzMuc2V0KHRoaXMuX3VwLHYpO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFVwM2YgICAgICAgICAgID0gZnVuY3Rpb24oeCx5LHopeyBWZWMzLnNldDNmKHRoaXMuX3VwLHgseSx6KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldE5lYXIgICAgICAgICAgID0gZnVuY3Rpb24obmVhcikgICAgICAge3RoaXMuX25lYXIgPSBuZWFyO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRGYXIgICAgICAgICAgICA9IGZ1bmN0aW9uKGZhcikgICAgICAgIHt0aGlzLl9mYXIgID0gZmFyO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRGb3YgICAgICAgICAgICA9IGZ1bmN0aW9uKGZvdikgICAgICAgIHt0aGlzLl9mb3YgID0gZm92O3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRBc3BlY3RSYXRpbyAgICA9IGZ1bmN0aW9uKGFzcGVjdFJhdGlvKXt0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSBhc3BlY3RSYXRpbzt0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5cbkNhbWVyYUJhc2ljLnByb3RvdHlwZS51cGRhdGVNb2RlbFZpZXdNYXRyaXggICA9IGZ1bmN0aW9uKCl7aWYodGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZClyZXR1cm47TWF0R0wubG9va0F0KHRoaXMubW9kZWxWaWV3TWF0cml4LHRoaXMucG9zaXRpb24sdGhpcy5fdGFyZ2V0LHRoaXMuX3VwKTsgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IHRydWU7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS51cGRhdGVQcm9qZWN0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtpZih0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZClyZXR1cm47TWF0R0wucGVyc3BlY3RpdmUodGhpcy5wcm9qZWN0aW9uTWF0cml4LHRoaXMuX2Zvdix0aGlzLl9hc3BlY3RSYXRpb0xhc3QsdGhpcy5fbmVhcix0aGlzLl9mYXIpO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gdHJ1ZTt9O1xuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUudXBkYXRlTWF0cmljZXMgPSBmdW5jdGlvbigpe3RoaXMudXBkYXRlTW9kZWxWaWV3TWF0cml4KCk7dGhpcy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7fTtcblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKXtyZXR1cm4gJ3twb3NpdGlvbj0gJyArIFZlYzMudG9TdHJpbmcodGhpcy5wb3NpdGlvbikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLCB0YXJnZXQ9ICcgKyBWZWMzLnRvU3RyaW5nKHRoaXMuX3RhcmdldCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLCB1cD0gJyAgICAgKyBWZWMzLnRvU3RyaW5nKHRoaXMuX3VwKSArICd9J307XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhQmFzaWM7XG5cblxuIiwidmFyIFByb2dWZXJ0ZXhTaGFkZXIgPSByZXF1aXJlKCcuL2dsL3NoYWRlci9nbGtQcm9nVmVydGV4U2hhZGVyJyksXG4gICAgUHJvZ0ZyYWdTaGFkZXIgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2dsa1Byb2dGcmFnU2hhZGVyJyksXG4gICAgUHJvZ0xvYWRlciAgICAgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2dsa1Byb2dMb2FkZXInKSxcbiAgICBTaGFkZXJMb2FkZXIgICAgID0gcmVxdWlyZSgnLi9nbC9zaGFkZXIvZ2xrU2hhZGVyTG9hZGVyJyksXG4gICAgUGxhdGZvcm0gICAgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtQbGF0Zm9ybScpLFxuICAgIENvbG9yICAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2dsa0NvbG9yJyksXG4gICAgTWF0NDQgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrTWF0NDQnKTtcblxuXG5cbmZ1bmN0aW9uIGtHTChjb250ZXh0M2QsY29udGV4dDJkKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2wgPSBjb250ZXh0M2Q7XG5cbiAgICB2YXIgcHJvZ1ZlcnRleFNoYWRlciA9IFNoYWRlckxvYWRlci5sb2FkU2hhZGVyRnJvbVN0cmluZyhnbCwgUHJvZ1ZlcnRleFNoYWRlciwgZ2wuVkVSVEVYX1NIQURFUiksXG4gICAgICAgIHByb2dGcmFnU2hhZGVyICAgPSBTaGFkZXJMb2FkZXIubG9hZFNoYWRlckZyb21TdHJpbmcoZ2wsICgoUGxhdGZvcm0uZ2V0VGFyZ2V0KCkgPT0gUGxhdGZvcm0uV0VCKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNoYWRlckxvYWRlci5QcmVmaXhTaGFkZXJXZWIgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9nRnJhZ1NoYWRlciwgZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIHZhciBwcm9ncmFtID0gIFByb2dMb2FkZXIubG9hZFByb2dyYW0oZ2wscHJvZ1ZlcnRleFNoYWRlcixwcm9nRnJhZ1NoYWRlcik7XG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vYmluZCBzaGFkZXIgc3R1ZmZcblxuICAgIHRoaXMuX2FWZXJ0ZXhQb3NpdGlvbiAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwnYVZlcnRleFBvc2l0aW9uJyk7XG4gICAgdGhpcy5fYVZlcnRleENvbG9yICAgICAgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCdhVmVydGV4Q29sb3InKTtcbiAgICB0aGlzLl91TW9kZWxWaWV3TWF0cml4ICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCd1TVZNYXRyaXgnKTtcbiAgICB0aGlzLl91UHJvamVjdGlvbk1hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtLCd1UE1hdHJpeCcpO1xuXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFBvc2l0aW9uKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Q29sb3IpO1xuXG5cbiAgICAvL2NyZWF0ZSBzaGFyZWQgYnVmZmVyXG5cbiAgICB0aGlzLl9hYm8gPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLl9lYWJvID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgICAgICAgIHRoaXMuX2Fibyk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUix0aGlzLl9lYWJvKTtcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvL3NldHVwIG1hdHJpY2VzIGFuZCBzdGFja1xuXG4gICAgdGhpcy5fY2FtZXJhICAgID0gbnVsbDtcbiAgICB0aGlzLl9tTW9kZVZpZXcgPSBNYXQ0NC5tYWtlKCk7XG5cbiAgICB0aGlzLl9tU3RhY2sgPSBbXTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vdGVtcFxuICAgIHRoaXMuX2JMaW5lVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiAzKTtcbiAgICB0aGlzLl9iTGluZUNvbG9ycyAgID0gbmV3IEZsb2F0MzJBcnJheSgyICogNCk7XG4gICAgdGhpcy5fYlJlY3RWZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoNCAqIDMpO1xuICAgIHRoaXMuX2JSZWN0Q29sb3JzICAgPSBuZXcgRmxvYXQzMkFycmF5KDQgKiA0KTtcblxuICAgIHRoaXMuX2JDb2xvciAgICAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMSwxXSk7XG4gICAgdGhpcy5fYkNvbG9yNGYgICA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsMSwxLDFdKTtcbiAgICB0aGlzLl9iQ29sb3I0ZkJnID0gbmV3IEZsb2F0MzJBcnJheShbMC4xLDAuMSwwLjEsMS4wXSk7XG5cbn1cblxua0dMLnByb3RvdHlwZS5zZXRDYW1lcmEgPSBmdW5jdGlvbihjYW1lcmEpXG57XG4gICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLmxvYWRJZGVudGl0eSA9IGZ1bmN0aW9uKCl7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0LmlkZW50aXR5KHRoaXMuX2NhbWVyYS5tb2RlbFZpZXdNYXRyaXgpO307XG5rR0wucHJvdG90eXBlLnB1c2hNYXRyaXggICA9IGZ1bmN0aW9uKCl7dGhpcy5fbVN0YWNrLnB1c2goTWF0NDQuY29weSh0aGlzLl9tTW9kZWxWaWV3KSk7fTtcbmtHTC5wcm90b3R5cGUucG9wTWF0cml4ICAgID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBzdGFjayA9IHRoaXMuX21TdGFjaztcblxuICAgIGlmKHN0YWNrLmxlbmd0aCA9PSAwKXRocm93ICgnSW52YWxpZCBwb3AhJyk7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IHN0YWNrLnBvcCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuX21Nb2RlbFZpZXc7XG59O1xuXG5rR0wucHJvdG90eXBlLnNldE1hdHJpY2VzVW5pZm9ybSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuXG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLl91TW9kZWxWaWV3TWF0cml4LGZhbHNlLHRoaXMuX21Nb2RlbFZpZXcpO1xuICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy5fdVByb2plY3Rpb25NYXRyaXgsZmFsc2UsdGhpcy5fY2FtZXJhLnByb2plY3Rpb25NYXRyaXgpO1xufTtcblxuLy9jaGVja1xua0dMLnByb3RvdHlwZS50cmFuc2xhdGUgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUodlswXSx2WzFdLHZbMl0pKTt9O1xua0dMLnByb3RvdHlwZS50cmFuc2xhdGUzZiAgID0gZnVuY3Rpb24oeCx5LHopICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoeCx5LHopKTt9O1xua0dMLnByb3RvdHlwZS50cmFuc2xhdGVYICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoeCwwLDApKTt9O1xua0dMLnByb3RvdHlwZS50cmFuc2xhdGVZICAgID0gZnVuY3Rpb24oeSkgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoMCx5LDApKTt9O1xua0dMLnByb3RvdHlwZS50cmFuc2xhdGVaICAgID0gZnVuY3Rpb24oeikgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoMCwwLHopKTt9O1xua0dMLnByb3RvdHlwZS5zY2FsZSAgICAgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZSh2WzBdLHZbMV0sdlsyXSkpO307XG5rR0wucHJvdG90eXBlLnNjYWxlMWYgICAgICAgPSBmdW5jdGlvbihuKSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKG4sbixuKSk7fTtcbmtHTC5wcm90b3R5cGUuc2NhbGUzZiAgICAgICA9IGZ1bmN0aW9uKHgseSx6KSAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoeCx5LHopKTt9O1xua0dMLnByb3RvdHlwZS5zY2FsZVggICAgICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZSh4LDEsMSkpO307XG5rR0wucHJvdG90eXBlLnNjYWxlWSAgICAgICAgPSBmdW5jdGlvbih5KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKDEseSwxKSk7fTtcbmtHTC5wcm90b3R5cGUuc2NhbGVaICAgICAgICA9IGZ1bmN0aW9uKHopICAgICAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoMSwxLHopKTt9O1xua0dMLnByb3RvdHlwZS5yb3RhdGUgICAgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblhZWih2WzBdLHZbMV0sdlsyXSkpO307XG5rR0wucHJvdG90eXBlLnJvdGF0ZTNmICAgICAgPSBmdW5jdGlvbih4LHkseikgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWFlaKHgseSx6KSk7fTtcbmtHTC5wcm90b3R5cGUucm90YXRlWCAgICAgICA9IGZ1bmN0aW9uKHgpICAgICAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25YKHgpKTt9O1xua0dMLnByb3RvdHlwZS5yb3RhdGVZICAgICAgID0gZnVuY3Rpb24oeSkgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblkoeSkpO307XG5rR0wucHJvdG90eXBlLnJvdGF0ZVogICAgICAgPSBmdW5jdGlvbih6KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWih6KSk7fTtcbmtHTC5wcm90b3R5cGUucm90YXRlQXhpcyAgICA9IGZ1bmN0aW9uKGFuZ2xlLHYpICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUsdlswXSx2WzFdLHZbMl0pKTt9O1xua0dMLnByb3RvdHlwZS5yb3RhdGVBeGlzM2YgID0gZnVuY3Rpb24oYW5nbGUseCx5LHope3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvbk9uQXhpcyhhbmdsZSx4LHkseikpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxua0dMLnByb3RvdHlwZS5jb2xvciAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5fYkNvbG9yID0gQ29sb3Iuc2V0KHRoaXMuX2JDb2xvcjRmLGNvbG9yKTt9O1xua0dMLnByb3RvdHlwZS5jb2xvcjRmID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5fYkNvbG9yID0gQ29sb3Iuc2V0NGYodGhpcy5fYkNvbG9yNGYscixnLGIsYSk7fTtcbmtHTC5wcm90b3R5cGUuY29sb3IzZiA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDNmKHRoaXMuX2JDb2xvcjRmLHIsZyxiKTt9O1xua0dMLnByb3RvdHlwZS5jb2xvcjJmID0gZnVuY3Rpb24oayxhKSAgICB7dGhpcy5fYkNvbG9yID0gQ29sb3Iuc2V0MmYodGhpcy5fYkNvbG9yNGYsayxhKTt9O1xua0dMLnByb3RvdHlwZS5jb2xvcjFmID0gZnVuY3Rpb24oaykgICAgICB7dGhpcy5fYkNvbG9yID0gQ29sb3Iuc2V0MWYodGhpcy5fYkNvbG9yNGYsayk7fTtcbmtHTC5wcm90b3R5cGUuY29sb3JmdiA9IGZ1bmN0aW9uKGFycmF5KSAge3RoaXMuX2JDb2xvciA9IGFycmF5O307XG5cbmtHTC5wcm90b3R5cGUuZ2V0Q29sb3JCdWZmZXIgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9iQ29sb3I7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLmNsZWFyQ29sb3IgPSBmdW5jdGlvbihjb2xvcil7dGhpcy5jbGVhcjRmKGNvbG9yWzBdLGNvbG9yWzFdLGNvbG9yWzJdLGNvbG9yWzNdKTt9O1xua0dMLnByb3RvdHlwZS5jbGVhciAgICAgID0gZnVuY3Rpb24oKSAgICAge3RoaXMuY2xlYXI0ZigwLDAsMCwxKTt9O1xua0dMLnByb3RvdHlwZS5jbGVhcjNmICAgID0gZnVuY3Rpb24ocixnLGIpe3RoaXMuY2xlYXI0ZihyLGcsYiwxKTt9O1xua0dMLnByb3RvdHlwZS5jbGVhcjJmICAgID0gZnVuY3Rpb24oayxhKSAge3RoaXMuY2xlYXI0ZihrLGssayxhKTt9O1xua0dMLnByb3RvdHlwZS5jbGVhcjFmICAgID0gZnVuY3Rpb24oaykgICAge3RoaXMuY2xlYXI0ZihrLGssaywxLjApO307XG5rR0wucHJvdG90eXBlLmNsZWFyNGYgICAgPSBmdW5jdGlvbihyLGcsYixhKVxue1xuICAgIHZhciBiQ29sb3IgPSB0aGlzLl9iQ29sb3I0ZkJnO1xuICAgIGJDb2xvclswXSA9IHI7XG4gICAgYkNvbG9yWzFdID0gZztcbiAgICBiQ29sb3JbMl0gPSBiO1xuICAgIGJDb2xvclszXSA9IGE7XG5cbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgIGdsLmNsZWFyQ29sb3IoYkNvbG9yWzBdLGJDb2xvclsxXSxiQ29sb3JbMl0sYkNvbG9yWzNdKTtcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vanVzdCB2ZXJ0aWNlcyBhbmQgY29sb3JzIGZvciBub3dcbmtHTC5wcm90b3R5cGUuZmlsbEFycmF5QnVmZmVyID0gZnVuY3Rpb24odmVydGV4RmxvYXQzMkFycmF5LGNvbG9yRmxvYXQzMkFycmF5LGdsRHJhd01vZGUpXG57XG4gICAgdmFyIGdsICAgICAgICAgICAgPSB0aGlzLmdsLFxuICAgICAgICBnbEFycmF5QnVmZmVyID0gZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICBnbEZsb2F0ICAgICAgID0gZ2wuRkxPQVQ7XG5cbiAgICBnbERyYXdNb2RlID0gZ2xEcmF3TW9kZSB8fCBnbC5EWU5BTUlDX0RSQVc7XG5cbiAgICB2YXIgdmJsZW4gID0gdmVydGV4RmxvYXQzMkFycmF5LmJ5dGVMZW5ndGgsXG4gICAgICAgIGNibGVuICA9IGNvbG9yRmxvYXQzMkFycmF5LmJ5dGVMZW5ndGg7XG5cbiAgICB2YXIgb2Zmc2V0ViAgPSAwLFxuICAgICAgICBvZmZzZXRDICA9IHZibGVuO1xuXG4gICAgZ2wuYnVmZmVyRGF0YShnbEFycmF5QnVmZmVyLCB2YmxlbiArIGNibGVuICwgZ2xEcmF3TW9kZSk7XG5cbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsIG9mZnNldFYsIHZlcnRleEZsb2F0MzJBcnJheSk7XG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRDLCBjb2xvckZsb2F0MzJBcnJheSk7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4UG9zaXRpb24sIDMsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRWKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX2FWZXJ0ZXhDb2xvciwgNCwgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xufTtcblxuLy9maWxscyB2ZXJ0aWNlcyBjb2xvciBkYXRhIHdpdGggY3VycmVudCBjb2xvciBzZXRcbmtHTC5wcm90b3R5cGUuZmlsbENvbG9yQnVmZmVyID0gZnVuY3Rpb24oY29sb3IsYnVmZmVyKVxue1xuICAgIHZhciBpID0gMDtcblxuICAgIGlmKGNvbG9yLmxlbmd0aCA9PSA0KVxuICAgIHtcbiAgICAgICAgd2hpbGUoaSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJ1ZmZlcltpXSAgPWNvbG9yWzBdO1xuICAgICAgICAgICAgYnVmZmVyW2krMV09Y29sb3JbMV07XG4gICAgICAgICAgICBidWZmZXJbaSsyXT1jb2xvclsyXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzNdPWNvbG9yWzNdO1xuICAgICAgICAgICAgaSs9NDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpZihjb2xvci5sZW5ndGggIT0gYnVmZmVyLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgKFwiQ29sb3IgYXJyYXkgbGVuZ3RoIG5vdCBlcXVhbCB0byBudW1iZXIgb2YgdmVydGljZXMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUoaSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJ1ZmZlcltpXSAgID0gY29sb3JbaV07XG4gICAgICAgICAgICBidWZmZXJbaSsxXSA9IGNvbG9yW2krMV07XG4gICAgICAgICAgICBidWZmZXJbaSsyXSA9IGNvbG9yW2krMl07XG4gICAgICAgICAgICBidWZmZXJbaSszXSA9IGNvbG9yW2krM107XG4gICAgICAgICAgICBpKz00O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cblxua0dMLnByb3RvdHlwZS5saW5lZiA9IGZ1bmN0aW9uKHgwLHkwLHowLHgxLHkxLHoxKVxue1xuICAgIHZhciB2ID0gdGhpcy5fYkxpbmVWZXJ0aWNlcztcbiAgICB2WzBdID0geDA7dlsxXSA9IHkwO3ZbMl0gPSB6MDtcbiAgICB2WzNdID0geDE7dls0XSA9IHkxO3ZbNV0gPSB6MTtcblxuICAgIHRoaXMuZmlsbEFycmF5QnVmZmVyKHYsdGhpcy5maWxsQ29sb3JCdWZmZXIodGhpcy5fYkNvbG9yLHRoaXMuX2JMaW5lQ29sb3JzKSk7XG4gICAgdGhpcy5zZXRNYXRyaWNlc1VuaWZvcm0oKTtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5MSU5FUywwLDIpO1xufTtcblxua0dMLnByb3RvdHlwZS5nZXRDb2xvckJ1ZmZlciA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JDb2xvcjt9O1xua0dMLnByb3RvdHlwZS5nZXRDbGVhckJ1ZmZlciA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JDb2xvcjRmQmc7fTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0ga0dMOyIsInZhciBWZWMzICA9IHJlcXVpcmUoJy4uLy4uL21hdGgvZ2xrVmVjMycpLFxuICAgIENvbG9yID0gcmVxdWlyZSgnLi4vLi4vdXRpbC9nbGtDb2xvcicpO1xuXG52YXIga0dMVXRpbCA9IHt9O1xuXG5rR0xVdGlsLl9fZ3JpZFNpemVMYXN0ID0gLTE7XG5rR0xVdGlsLl9fZ3JpZFVuaXRMYXN0ID0gLTE7XG5cblxuXG5rR0xVdGlsLmRyYXdHcmlkID0gZnVuY3Rpb24oa2dsLHNpemUsdW5pdClcbntcbiAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgdmFyIGkgID0gLTEsXG4gICAgICAgIHNoID0gc2l6ZSAqIDAuNSAqIHVuaXQ7XG5cbiAgICB2YXIgdWk7XG5cbiAgICB3aGlsZSgrK2kgPCBzaXplICsgMSlcbiAgICB7XG4gICAgICAgIHVpID0gdW5pdCAqIGk7XG5cbiAgICAgICAga2dsLmxpbmVmKC1zaCwwLC1zaCArIHVpLHNoLDAsLXNoK3VpKTtcbiAgICAgICAga2dsLmxpbmVmKC1zaCt1aSwwLC1zaCwtc2grdWksMCxzaCk7XG4gICAgfVxufTtcblxua0dMVXRpbC5kcmF3QXhlcyA9IGZ1bmN0aW9uKGtnbCx1bml0KVxue1xuICAgIGtnbC5jb2xvcjNmKDEsMCwwKTtcbiAgICBrZ2wubGluZWYoMCwwLDAsdW5pdCwwLDApO1xuICAgIGtnbC5jb2xvcjNmKDAsMSwwKTtcbiAgICBrZ2wubGluZWYoMCwwLDAsMCx1bml0LDApO1xuICAgIGtnbC5jb2xvcjNmKDAsMCwxKTtcbiAgICBrZ2wubGluZWYoMCwwLDAsMCwwLHVuaXQpO1xufTtcblxua0dMVXRpbC5kcmF3R3JpZEN1YmUgPSBmdW5jdGlvbihrZ2wsc2l6ZSx1bml0KVxue1xuICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICB2YXIgc2ggID0gc2l6ZSAqIDAuNSAqIHVuaXQsXG4gICAgICAgIHBpaCA9IE1hdGguUEkgKiAwLjU7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZigwLC1zaCwwKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKDAsc2gsMCk7XG4gICAga2dsLnJvdGF0ZTNmKDAscGloLDApO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2YoMCwwLC1zaCk7XG4gICAga2dsLnJvdGF0ZTNmKHBpaCwwLDApO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2YoMCwwLHNoKTtcbiAgICBrZ2wucm90YXRlM2YocGloLDAsMCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZihzaCwwLDApO1xuICAgIGtnbC5yb3RhdGUzZihwaWgsMCxwaWgpO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2YoLXNoLDAsMCk7XG4gICAga2dsLnJvdGF0ZTNmKHBpaCwwLHBpaCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbn07XG5cbi8qXG52YXIga0dMVXRpbCA9XG57XG5cbiAgICBkcmF3R3JpZCA6IGZ1bmN0aW9uKGdsLHNpemUsdW5pdClcbiAgICB7XG4gICAgICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICAgICAgdmFyIGkgID0gLTEsXG4gICAgICAgICAgICBzaCA9IHNpemUgKiAwLjUgKiB1bml0O1xuXG4gICAgICAgIHZhciB1aTtcblxuICAgICAgICB3aGlsZSgrK2kgPCBzaXplICsgMSlcbiAgICAgICAge1xuICAgICAgICAgICAgdWkgPSB1bml0ICogaTtcblxuICAgICAgICAgICAgZ2wubGluZWYoLXNoLDAsLXNoICsgdWksc2gsMCwtc2grdWkpO1xuICAgICAgICAgICAgZ2wubGluZWYoLXNoK3VpLDAsLXNoLC1zaCt1aSwwLHNoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGRyYXdHcmlkQ3ViZSA6IGZ1bmN0aW9uKGdsLHNpemUsdW5pdClcbiAgICB7XG4gICAgICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICAgICAgdmFyIHNoICA9IHNpemUgKiAwLjUgKiB1bml0LFxuICAgICAgICAgICAgcGloID0gTWF0aC5QSSAqIDAuNTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKDAsLXNoLDApO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoMCxzaCwwKTtcbiAgICAgICAgZ2wucm90YXRlM2YoMCxwaWgsMCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZigwLDAsLXNoKTtcbiAgICAgICAgZ2wucm90YXRlM2YocGloLDAsMCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZigwLDAsc2gpO1xuICAgICAgICBnbC5yb3RhdGUzZihwaWgsMCwwKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKHNoLDAsMCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKHBpaCwwLHBpaCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZigtc2gsMCwwKTtcbiAgICAgICAgZ2wucm90YXRlM2YocGloLDAscGloKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgIH0sXG5cblxuICAgIGRyYXdBeGVzIDogZnVuY3Rpb24oZ2wsdW5pdClcbiAgICB7XG4gICAgICAgIGdsLmNvbG9yM2YoMSwwLDApO1xuICAgICAgICBnbC5saW5lZigwLDAsMCx1bml0LDAsMCk7XG4gICAgICAgIGdsLmNvbG9yM2YoMCwxLDApO1xuICAgICAgICBnbC5saW5lZigwLDAsMCwwLHVuaXQsMCk7XG4gICAgICAgIGdsLmNvbG9yM2YoMCwwLDEpO1xuICAgICAgICBnbC5saW5lZigwLDAsMCwwLDAsdW5pdCk7XG4gICAgfSxcblxuXG4gICAgLy90ZW1wXG4gICAgZHJhd1ZlY3RvcmYgOiBmdW5jdGlvbihnbCx4MCx5MCx6MCx4MSx5MSx6MSlcbiAgICB7XG4gICAgICAgXG5cbiAgICAgICAgdmFyIHAwID0gZ2wuX2JQb2ludDAsXG4gICAgICAgICAgICBwMSA9IGdsLl9iUG9pbnQxLFxuICAgICAgICAgICAgdXAgPSBnbC5fYXhpc1k7XG5cbiAgICAgICAgVmVjMy5zZXQzZihwMCx4MCx5MCx6MCk7XG4gICAgICAgIFZlYzMuc2V0M2YocDEseDEseTEsejEpO1xuXG4gICAgICAgIHZhciBwdyA9IGdsLl9saW5lQm94V2lkdGgsXG4gICAgICAgICAgICBwaCA9IGdsLl9saW5lQm94SGVpZ2h0LFxuICAgICAgICAgICAgcGQgPSBnbC5fZHJhd01vZGU7XG5cbiAgICAgICAgdmFyIGxlbiA9IFZlYzMuZGlzdGFuY2UocDAscDEpLFxuICAgICAgICAgICAgbWlkID0gVmVjMy5zY2FsZShWZWMzLmFkZGVkKHAwLHAxKSwwLjUpLFxuICAgICAgICAgICAgZGlyID0gVmVjMy5ub3JtYWxpemUoVmVjMy5zdWJiZWQocDEscDApKSxcbiAgICAgICAgICAgIGMgICA9IFZlYzMuZG90KGRpcix1cCk7XG5cbiAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hY29zKGMpLFxuICAgICAgICAgICAgYXhpcyAgPSBWZWMzLm5vcm1hbGl6ZShWZWMzLmNyb3NzKHVwLGRpcikpO1xuXG5cbiAgICAgICAgZ2wuZHJhd01vZGUoZ2wuTElORVMpO1xuXG4gICAgICAgIGdsLmxpbmVmKHgwLHkwLHowLHgxLHkxLHoxKTtcblxuICAgICAgICBnbC5kcmF3TW9kZShnbC5UUklBTkdMRVMpO1xuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZShwMSk7XG4gICAgICAgIGdsLnJvdGF0ZUF4aXMoYW5nbGUsYXhpcyk7XG4gICAgICAgIHRoaXMucHlyYW1pZChnbCwwLjAyNSk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLmxpbmVTaXplKHB3LHBoKTtcbiAgICAgICAgZ2wuZHJhd01vZGUocGQpO1xuICAgIH0sXG5cbiAgICBkcmF3VmVjdG9yIDogZnVuY3Rpb24oZ2wsdjAsdjEpXG4gICAge1xuICAgICAgIHRoaXMuZHJhd1ZlY3RvcmYoZ2wsdjBbMF0sdjBbMV0sdjBbMl0sdjFbMF0sdjFbMV0sdjFbMl0pO1xuICAgIH0sXG5cbiAgICBweXJhbWlkIDogZnVuY3Rpb24oZ2wsc2l6ZSlcbiAgICB7XG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wuc2NhbGUzZihzaXplLHNpemUsc2l6ZSk7XG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyh0aGlzLl9fYlZlcnRleFB5cmFtaWQsdGhpcy5fX2JOb3JtYWxQeXJhbWlkLGdsLmZpbGxDb2xvckJ1ZmZlcihnbC5fYkNvbG9yLHRoaXMuX19iQ29sb3JQeXJhbWlkKSxudWxsLHRoaXMuX19iSW5kZXhQeXJhbWlkLGdsLl9kcmF3TW9kZSk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuICAgIH0sXG5cblxuXG4gICAgb2N0YWhlZHJvbiA6IGZ1bmN0aW9uKGdsLHNpemUpXG4gICAge1xuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnNjYWxlM2Yoc2l6ZSxzaXplLHNpemUpO1xuICAgICAgICBnbC5kcmF3RWxlbWVudHModGhpcy5fX2JWZXJ0ZXhPY3RhaGVkcm9uLCB0aGlzLl9fYk5vcm1hbE9jdGFoZWRyb24sZ2wuZmlsbENvbG9yQnVmZmVyKGdsLl9iQ29sb3IsIHRoaXMuX19iQ29sb3JPY3RhaGVkcm9uKSxudWxsLCB0aGlzLl9fYkluZGV4T2N0YWhlZHJvbixnbC5fZHJhd01vZGUpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcbiAgICB9XG59O1xuKi9cblxua0dMVXRpbC5fX2JWZXJ0ZXhPY3RhaGVkcm9uID0gbmV3IEZsb2F0MzJBcnJheShbLTAuNzA3LDAsMCwgMCwwLjcwNywwLCAwLDAsLTAuNzA3LCAwLDAsMC43MDcsIDAsLTAuNzA3LDAsIDAuNzA3LDAsMF0pO1xua0dMVXRpbC5fX2JOb3JtYWxPY3RhaGVkcm9uID0gbmV3IEZsb2F0MzJBcnJheShbMSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIDEsIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLjQxOTQ5NjA3NjIzODE0N2UtOV0pO1xua0dMVXRpbC5fX2JDb2xvck9jdGFoZWRyb24gID0gbmV3IEZsb2F0MzJBcnJheShrR0xVdGlsLl9fYlZlcnRleE9jdGFoZWRyb24ubGVuZ3RoIC8gVmVjMy5TSVpFICogQ29sb3IuU0laRSk7XG5rR0xVdGlsLl9fYkluZGV4T2N0YWhlZHJvbiAgPSBuZXcgVWludDE2QXJyYXkoWzMsNCw1LDMsNSwxLDMsMSwwLDMsMCw0LDQsMCwyLDQsMiw1LDIsMCwxLDUsMiwxXSk7XG5rR0xVdGlsLl9fYlZlcnRleFB5cmFtaWQgICAgPSBuZXcgRmxvYXQzMkFycmF5KFsgMC4wLDEuMCwwLjAsLTEuMCwtMS4wLDEuMCwxLjAsLTEuMCwxLjAsMC4wLDEuMCwwLjAsMS4wLC0xLjAsMS4wLDEuMCwtMS4wLC0xLjAsMC4wLDEuMCwwLjAsMS4wLC0xLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwwLjAsMS4wLDAuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLC0xLjAsMS4wLC0xLjAsLTEuMCwxLjAsMS4wLC0xLjAsMS4wLDEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLC0xLjBdKTtcbmtHTFV0aWwuX19iTm9ybWFsUHlyYW1pZCAgICA9IG5ldyBGbG9hdDMyQXJyYXkoWzAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAuODk0NDI3MTgwMjkwMjIyMiwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLjg5NDQyNzE4MDI5MDIyMjIsIDAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAsIDAsIDAsIDAsIC0xLCAwLCAwLCAwLCAwLCAwLCAxLCAwXSk7XG5rR0xVdGlsLl9fYkNvbG9yUHlyYW1pZCAgICAgPSBuZXcgRmxvYXQzMkFycmF5KGtHTFV0aWwuX19iVmVydGV4UHlyYW1pZC5sZW5ndGggLyBWZWMzLlNJWkUgKiBDb2xvci5TSVpFKTtcbmtHTFV0aWwuX19iSW5kZXhQeXJhbWlkICAgICA9IG5ldyBVaW50MTZBcnJheShbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLDEyLDEzLDE0LDEyLDE1LDE0XSk7XG5cbm1vZHVsZS5leHBvcnRzID0ga0dMVXRpbDsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsMSwwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwLDFdKTtcbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlIDogZnVuY3Rpb24ob3V0LGEpXG4gICAge1xuXG4gICAgICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgICAgIHZhciBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTIgPSBhWzVdO1xuICAgICAgICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgICAgICBvdXRbM10gPSBhMDE7XG4gICAgICAgICAgICBvdXRbNV0gPSBhWzddO1xuICAgICAgICAgICAgb3V0WzZdID0gYTAyO1xuICAgICAgICAgICAgb3V0WzddID0gYTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgICAgICBvdXRbMl0gPSBhWzZdO1xuICAgICAgICAgICAgb3V0WzNdID0gYVsxXTtcbiAgICAgICAgICAgIG91dFs0XSA9IGFbNF07XG4gICAgICAgICAgICBvdXRbNV0gPSBhWzddO1xuICAgICAgICAgICAgb3V0WzZdID0gYVsyXTtcbiAgICAgICAgICAgIG91dFs3XSA9IGFbNV07XG4gICAgICAgICAgICBvdXRbOF0gPSBhWzhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbn07IiwidmFyIGtNYXRoID0gcmVxdWlyZSgnLi9nbGtNYXRoJyksXG4gICAgTWF0MzMgPSByZXF1aXJlKCcuL2dsa01hdDQ0JyksXG4gICAgTWF0NDQgPSByZXF1aXJlKCcuL2dsa01hdDQ0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBtYWtlIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyAxLCAwLCAwLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxIF0pO1xuICAgIH0sXG5cbiAgICBpZGVudGl0eSA6IGZ1bmN0aW9uKG0pXG4gICAge1xuICAgICAgICBtWyAwXSA9IDE7IG1bIDFdID0gbVsgMl0gPSBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDVdID0gMTsgbVsgNF0gPSBtWyA2XSA9IG1bIDddID0gMDtcbiAgICAgICAgbVsxMF0gPSAxOyBtWyA4XSA9IG1bIDldID0gbVsxMV0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7IG1bMTJdID0gbVsxM10gPSBtWzE0XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIGNvcHkgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkobSk7XG4gICAgfSxcblxuICAgIG1ha2VTY2FsZSA6IGZ1bmN0aW9uKHN4LHN5LHN6KVxuICAgIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICBtWzBdICA9IHN4O1xuICAgICAgICBtWzVdICA9IHN5O1xuICAgICAgICBtWzEwXSA9IHN6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlVHJhbnNsYXRlIDogZnVuY3Rpb24odHgsdHksdHopXG4gICAge1xuICAgICAgICB2YXIgbSA9IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIG1bMTJdID0gdHg7XG4gICAgICAgIG1bMTNdID0gdHk7XG4gICAgICAgIG1bMTRdID0gdHo7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG1ha2VSb3RhdGlvblggOiBmdW5jdGlvbihhKVxuICAgIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYSksXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhKTtcblxuICAgICAgICBtWzVdICA9IGNvcztcbiAgICAgICAgbVs2XSAgPSAtc2luO1xuICAgICAgICBtWzldICA9IHNpbjtcbiAgICAgICAgbVsxMF0gPSBjb3M7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG1ha2VSb3RhdGlvblkgOiBmdW5jdGlvbihhKVxuICAgIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYSksXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhKTtcblxuICAgICAgICBtWzBdID0gY29zO1xuICAgICAgICBtWzJdID0gc2luO1xuICAgICAgICBtWzhdID0gLXNpbjtcbiAgICAgICAgbVsxMF09IGNvcztcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbWFrZVJvdGF0aW9uWiA6IGZ1bmN0aW9uKGEpXG4gICAge1xuICAgICAgICB2YXIgbSA9IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihhKSxcbiAgICAgICAgICAgIGNvcyA9IE1hdGguY29zKGEpO1xuXG4gICAgICAgIG1bMF0gPSBjb3M7XG4gICAgICAgIG1bMV0gPSBzaW47XG4gICAgICAgIG1bNF0gPSAtc2luO1xuICAgICAgICBtWzVdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlUm90YXRpb25YWVogOiBmdW5jdGlvbihheCxheSxheilcbiAgICB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIGNvc3ggPSBNYXRoLmNvcyhheCksXG4gICAgICAgICAgICBzaW54ID0gTWF0aC5zaW4oYXgpLFxuICAgICAgICAgICAgY29zeSA9IE1hdGguY29zKGF5KSxcbiAgICAgICAgICAgIHNpbnkgPSBNYXRoLnNpbihheSksXG4gICAgICAgICAgICBjb3N6ID0gTWF0aC5jb3MoYXopLFxuICAgICAgICAgICAgc2lueiA9IE1hdGguc2luKGF6KTtcblxuICAgICAgICBtWyAwXSA9ICBjb3N5KmNvc3o7XG4gICAgICAgIG1bIDFdID0gLWNvc3gqc2lueitzaW54KnNpbnkqY29zejtcbiAgICAgICAgbVsgMl0gPSAgc2lueCpzaW56K2Nvc3gqc2lueSpjb3N6O1xuXG4gICAgICAgIG1bIDRdID0gIGNvc3kqc2luejtcbiAgICAgICAgbVsgNV0gPSAgY29zeCpjb3N6K3Npbngqc2lueSpzaW56O1xuICAgICAgICBtWyA2XSA9IC1zaW54KmNvc3orY29zeCpzaW55KnNpbno7XG5cbiAgICAgICAgbVsgOF0gPSAtc2lueTtcbiAgICAgICAgbVsgOV0gPSAgc2lueCpjb3N5O1xuICAgICAgICBtWzEwXSA9ICBjb3N4KmNvc3k7XG5cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgLy90ZW1wIGZyb20gZ2xNYXRyaXhcbiAgICBtYWtlUm90YXRpb25PbkF4aXMgOiBmdW5jdGlvbihyb3QseCx5LHosb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuXG4gICAgICAgIGlmKE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopIDwga01hdGguRVBTSUxPTikgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIHZhciBzLCBjLCB0LFxuICAgICAgICAgICAgYTAwLCBhMDEsIGEwMiwgYTAzLFxuICAgICAgICAgICAgYTEwLCBhMTEsIGExMiwgYTEzLFxuICAgICAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzLFxuICAgICAgICAgICAgYjAwLCBiMDEsIGIwMixcbiAgICAgICAgICAgIGIxMCwgYjExLCBiMTIsXG4gICAgICAgICAgICBiMjAsIGIyMSwgYjIyO1xuXG5cbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeCAqPSBsZW47XG4gICAgICAgIHkgKj0gbGVuO1xuICAgICAgICB6ICo9IGxlbjtcblxuICAgICAgICBzID0gTWF0aC5zaW4ocm90KTtcbiAgICAgICAgYyA9IE1hdGguY29zKHJvdCk7XG4gICAgICAgIHQgPSAxIC0gYztcblxuICAgICAgICBvdXQgPSBvdXQgfHwgTWF0NDQubWFrZSgpO1xuXG4gICAgICAgIGEwMCA9IDE7IGEwMSA9IDA7IGEwMiA9IDA7IGEwMyA9IDA7XG4gICAgICAgIGExMCA9IDA7IGExMSA9IDE7IGExMiA9IDA7IGExMyA9IDA7XG4gICAgICAgIGEyMCA9IDA7IGEyMSA9IDA7IGEyMiA9IDE7IGEyMyA9IDA7XG5cbiAgICAgICAgYjAwID0geCAqIHggKiB0ICsgYzsgYjAxID0geSAqIHggKiB0ICsgeiAqIHM7IGIwMiA9IHogKiB4ICogdCAtIHkgKiBzO1xuICAgICAgICBiMTAgPSB4ICogeSAqIHQgLSB6ICogczsgYjExID0geSAqIHkgKiB0ICsgYzsgYjEyID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgICAgIGIyMCA9IHggKiB6ICogdCArIHkgKiBzOyBiMjEgPSB5ICogeiAqIHQgLSB4ICogczsgYjIyID0geiAqIHogKiB0ICsgYztcblxuICAgICAgICBvdXRbMCBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyO1xuICAgICAgICBvdXRbMSBdID0gYTAxICogYjAwICsgYTExICogYjAxICsgYTIxICogYjAyO1xuICAgICAgICBvdXRbMiBdID0gYTAyICogYjAwICsgYTEyICogYjAxICsgYTIyICogYjAyO1xuICAgICAgICBvdXRbMyBdID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyO1xuICAgICAgICBvdXRbNCBdID0gYTAwICogYjEwICsgYTEwICogYjExICsgYTIwICogYjEyO1xuICAgICAgICBvdXRbNSBdID0gYTAxICogYjEwICsgYTExICogYjExICsgYTIxICogYjEyO1xuICAgICAgICBvdXRbNiBdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyO1xuICAgICAgICBvdXRbNyBdID0gYTAzICogYjEwICsgYTEzICogYjExICsgYTIzICogYjEyO1xuICAgICAgICBvdXRbOCBdID0gYTAwICogYjIwICsgYTEwICogYjIxICsgYTIwICogYjIyO1xuICAgICAgICBvdXRbOSBdID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyO1xuICAgICAgICBvdXRbMTBdID0gYTAyICogYjIwICsgYTEyICogYjIxICsgYTIyICogYjIyO1xuICAgICAgICBvdXRbMTFdID0gYTAzICogYjIwICsgYTEzICogYjIxICsgYTIzICogYjIyO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG59LFxuXG4gICAgbXVsdFByZSA6IGZ1bmN0aW9uKG0wLG0xKVxuICAgIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgbTAwMCA9IG0wWyAwXSxtMDAxID0gbTBbIDFdLG0wMDIgPSBtMFsgMl0sbTAwMyA9IG0wWyAzXSxcbiAgICAgICAgICAgIG0wMDQgPSBtMFsgNF0sbTAwNSA9IG0wWyA1XSxtMDA2ID0gbTBbIDZdLG0wMDcgPSBtMFsgN10sXG4gICAgICAgICAgICBtMDA4ID0gbTBbIDhdLG0wMDkgPSBtMFsgOV0sbTAxMCA9IG0wWzEwXSxtMDExID0gbTBbMTFdLFxuICAgICAgICAgICAgbTAxMiA9IG0wWzEyXSxtMDEzID0gbTBbMTNdLG0wMTQgPSBtMFsxNF0sbTAxNSA9IG0wWzE1XTtcblxuICAgICAgICB2YXIgbTEwMCA9IG0xWyAwXSxtMTAxID0gbTFbIDFdLG0xMDIgPSBtMVsgMl0sbTEwMyA9IG0xWyAzXSxcbiAgICAgICAgICAgIG0xMDQgPSBtMVsgNF0sbTEwNSA9IG0xWyA1XSxtMTA2ID0gbTFbIDZdLG0xMDcgPSBtMVsgN10sXG4gICAgICAgICAgICBtMTA4ID0gbTFbIDhdLG0xMDkgPSBtMVsgOV0sbTExMCA9IG0xWzEwXSxtMTExID0gbTFbMTFdLFxuICAgICAgICAgICAgbTExMiA9IG0xWzEyXSxtMTEzID0gbTFbMTNdLG0xMTQgPSBtMVsxNF0sbTExNSA9IG0xWzE1XTtcblxuICAgICAgICBtWyAwXSA9IG0wMDAqbTEwMCArIG0wMDEqbTEwNCArIG0wMDIqbTEwOCArIG0wMDMqbTExMjtcbiAgICAgICAgbVsgMV0gPSBtMDAwKm0xMDEgKyBtMDAxKm0xMDUgKyBtMDAyKm0xMDkgKyBtMDAzKm0xMTM7XG4gICAgICAgIG1bIDJdID0gbTAwMCptMTAyICsgbTAwMSptMTA2ICsgbTAwMiptMTEwICsgbTAwMyptMTE0O1xuICAgICAgICBtWyAzXSA9IG0wMDAqbTEwMyArIG0wMDEqbTEwNyArIG0wMDIqbTExMSArIG0wMDMqbTExNTtcblxuICAgICAgICBtWyA0XSA9IG0wMDQqbTEwMCArIG0wMDUqbTEwNCArIG0wMDYqbTEwOCArIG0wMDcqbTExMjtcbiAgICAgICAgbVsgNV0gPSBtMDA0Km0xMDEgKyBtMDA1Km0xMDUgKyBtMDA2Km0xMDkgKyBtMDA3Km0xMTM7XG4gICAgICAgIG1bIDZdID0gbTAwNCptMTAyICsgbTAwNSptMTA2ICsgbTAwNiptMTEwICsgbTAwNyptMTE0O1xuICAgICAgICBtWyA3XSA9IG0wMDQqbTEwMyArIG0wMDUqbTEwNyArIG0wMDYqbTExMSArIG0wMDcqbTExNTtcblxuICAgICAgICBtWyA4XSA9IG0wMDgqbTEwMCArIG0wMDkqbTEwNCArIG0wMTAqbTEwOCArIG0wMTEqbTExMjtcbiAgICAgICAgbVsgOV0gPSBtMDA4Km0xMDEgKyBtMDA5Km0xMDUgKyBtMDEwKm0xMDkgKyBtMDExKm0xMTM7XG4gICAgICAgIG1bMTBdID0gbTAwOCptMTAyICsgbTAwOSptMTA2ICsgbTAxMCptMTEwICsgbTAxMSptMTE0O1xuICAgICAgICBtWzExXSA9IG0wMDgqbTEwMyArIG0wMDkqbTEwNyArIG0wMTAqbTExMSArIG0wMTEqbTExNTtcblxuICAgICAgICBtWzEyXSA9IG0wMTIqbTEwMCArIG0wMTMqbTEwNCArIG0wMTQqbTEwOCArIG0wMTUqbTExMjtcbiAgICAgICAgbVsxM10gPSBtMDEyKm0xMDEgKyBtMDEzKm0xMDUgKyBtMDE0Km0xMDkgKyBtMDE1Km0xMTM7XG4gICAgICAgIG1bMTRdID0gbTAxMiptMTAyICsgbTAxMyptMTA2ICsgbTAxNCptMTEwICsgbTAxNSptMTE0O1xuICAgICAgICBtWzE1XSA9IG0wMTIqbTEwMyArIG0wMTMqbTEwNyArIG0wMTQqbTExMSArIG0wMTUqbTExNTtcblxuXG5cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbXVsdCA6IGZ1bmN0aW9uKG0wLG0xKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdFByZShtMCxtMSk7XG4gICAgfSxcblxuICAgIG11bHRQb3N0IDogZnVuY3Rpb24obTAsbTEpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0UHJlKG0xLG0wKTtcbiAgICB9LFxuXG4gICAgaW52ZXJ0ZWQgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgdmFyIGludiA9IHRoaXMubWFrZSgpO1xuICAgICAgICBpbnZbMF0gPSAgIG1bNV0gKiBtWzEwXSAqIG1bMTVdIC0gbVs1XSAqIG1bMTFdICogbVsxNF0gLSBtWzldICogbVs2XSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bOV0gKiBtWzddICogbVsxNF0gKyBtWzEzXSAqIG1bNl0gKiBtWzExXSAtIG1bMTNdICogbVs3XSAqIG1bMTBdO1xuICAgICAgICBpbnZbNF0gPSAgLW1bNF0gKiBtWzEwXSAqIG1bMTVdICsgbVs0XSAqIG1bMTFdICogbVsxNF0gKyBtWzhdICogbVs2XSAqIG1bMTVdICtcbiAgICAgICAgICAgIG1bOF0gKiBtWzddICogbVsxNF0gLSBtWzEyXSAqIG1bNl0gKiBtWzExXSArIG1bMTJdICogbVs3XSAqIG1bMTBdO1xuICAgICAgICBpbnZbOF0gPSAgIG1bNF0gKiBtWzldICogbVsxNV0gLSBtWzRdICogbVsxMV0gKiBtWzEzXSAtIG1bOF0gKiBtWzVdICogbVsxNV1cbiAgICAgICAgICAgICsgbVs4XSAqIG1bN10gKiBtWzEzXSArIG1bMTJdICogbVs1XSAqIG1bMTFdIC0gbVsxMl0gKiBtWzddICogbVs5XTtcbiAgICAgICAgaW52WzEyXSA9IC1tWzRdICogbVs5XSAqIG1bMTRdICsgbVs0XSAqIG1bMTBdICogbVsxM10gKyBtWzhdICogbVs1XSAqIG1bMTRdICtcbiAgICAgICAgICAgIG1bOF0gKiBtWzZdICogbVsxM10gLSBtWzEyXSAqIG1bNV0gKiBtWzEwXSArIG1bMTJdICogbVs2XSAqIG1bOV07XG4gICAgICAgIGludlsxXSA9ICAtbVsxXSAqIG1bMTBdICogbVsxNV0gKyBtWzFdICogbVsxMV0gKiBtWzE0XSArIG1bOV0gKiBtWzJdICogbVsxNV0gK1xuICAgICAgICAgICAgbVs5XSAqIG1bM10gKiBtWzE0XSAtIG1bMTNdICogbVsyXSAqIG1bMTFdICsgbVsxM10gKiBtWzNdICogbVsxMF07XG4gICAgICAgIGludls1XSA9ICBtWzBdICogbVsxMF0gKiBtWzE1XSAtIG1bMF0gKiBtWzExXSAqIG1bMTRdIC0gbVs4XSAqIG1bMl0gKiBtWzE1XVxuICAgICAgICAgICAgKyBtWzhdICogbVszXSAqIG1bMTRdICsgbVsxMl0gKiBtWzJdICogbVsxMV0gLSBtWzEyXSAqIG1bM10gKiBtWzEwXTtcbiAgICAgICAgaW52WzldID0gLW1bMF0gKiBtWzldICogbVsxNV0gKyBtWzBdICogbVsxMV0gKiBtWzEzXSArIG1bOF0gKiBtWzFdICogbVsxNV1cbiAgICAgICAgICAgIC0gbVs4XSAqIG1bM10gKiBtWzEzXSAtIG1bMTJdICogbVsxXSAqIG1bMTFdICsgbVsxMl0gKiBtWzNdICogbVs5XTtcbiAgICAgICAgaW52WzEzXSA9IG1bMF0gKiBtWzldICogbVsxNF0gLSBtWzBdICogbVsxMF0gKiBtWzEzXSAtIG1bOF0gKiBtWzFdICogbVsxNF1cbiAgICAgICAgICAgICsgbVs4XSAqIG1bMl0gKiBtWzEzXSArIG1bMTJdICogbVsxXSAqIG1bMTBdIC0gbVsxMl0gKiBtWzJdICogbVs5XTtcbiAgICAgICAgaW52WzJdID0gbVsxXSAqIG1bNl0gKiBtWzE1XSAtIG1bMV0gKiBtWzddICogbVsxNF0gLSBtWzVdICogbVsyXSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bNV0gKiBtWzNdICogbVsxNF0gKyBtWzEzXSAqIG1bMl0gKiBtWzddIC0gbVsxM10gKiBtWzNdICogbVs2XTtcbiAgICAgICAgaW52WzZdID0gLW1bMF0gKiBtWzZdICogbVsxNV0gKyBtWzBdICogbVs3XSAqIG1bMTRdICsgbVs0XSAqIG1bMl0gKiBtWzE1XVxuICAgICAgICAgICAgLSBtWzRdICogbVszXSAqIG1bMTRdIC0gbVsxMl0gKiBtWzJdICogbVs3XSArIG1bMTJdICogbVszXSAqIG1bNl07XG4gICAgICAgIGludlsxMF0gPSBtWzBdICogbVs1XSAqIG1bMTVdIC0gbVswXSAqIG1bN10gKiBtWzEzXSAtIG1bNF0gKiBtWzFdICogbVsxNV1cbiAgICAgICAgICAgICsgbVs0XSAqIG1bM10gKiBtWzEzXSArIG1bMTJdICogbVsxXSAqIG1bN10gLSBtWzEyXSAqIG1bM10gKiBtWzVdO1xuICAgICAgICBpbnZbMTRdID0gLW1bMF0gKiBtWzVdICogbVsxNF0gKyBtWzBdICogbVs2XSAqIG1bMTNdICsgbVs0XSAqIG1bMV0gKiBtWzE0XVxuICAgICAgICAgICAgLSBtWzRdICogbVsyXSAqIG1bMTNdIC0gbVsxMl0gKiBtWzFdICogbVs2XSArIG1bMTJdICogbVsyXSAqIG1bNV07XG4gICAgICAgIGludlszXSA9IC1tWzFdICogbVs2XSAqIG1bMTFdICsgbVsxXSAqIG1bN10gKiBtWzEwXSArIG1bNV0gKiBtWzJdICogbVsxMV1cbiAgICAgICAgICAgIC0gbVs1XSAqIG1bM10gKiBtWzEwXSAtIG1bOV0gKiBtWzJdICogbVs3XSArIG1bOV0gKiBtWzNdICogbVs2XTtcbiAgICAgICAgaW52WzddID0gbVswXSAqIG1bNl0gKiBtWzExXSAtIG1bMF0gKiBtWzddICogbVsxMF0gLSBtWzRdICogbVsyXSAqIG1bMTFdXG4gICAgICAgICAgICArIG1bNF0gKiBtWzNdICogbVsxMF0gKyBtWzhdICogbVsyXSAqIG1bN10gLSBtWzhdICogbVszXSAqIG1bNl07XG4gICAgICAgIGludlsxMV0gPSAtbVswXSAqIG1bNV0gKiBtWzExXSArIG1bMF0gKiBtWzddICogbVs5XSArIG1bNF0gKiBtWzFdICogbVsxMV1cbiAgICAgICAgICAgIC0gbVs0XSAqIG1bM10gKiBtWzldIC0gbVs4XSAqIG1bMV0gKiBtWzddICsgbVs4XSAqIG1bM10gKiBtWzVdO1xuICAgICAgICBpbnZbMTVdID0gbVswXSAqIG1bNV0gKiBtWzEwXSAtIG1bMF0gKiBtWzZdICogbVs5XSAtIG1bNF0gKiBtWzFdICogbVsxMF1cbiAgICAgICAgICAgICsgbVs0XSAqIG1bMl0gKiBtWzldICsgbVs4XSAqIG1bMV0gKiBtWzZdIC0gbVs4XSAqIG1bMl0gKiBtWzVdO1xuICAgICAgICB2YXIgZGV0ID0gbVswXSppbnZbMF0gKyBtWzFdKmludls0XSArIG1bMl0qaW52WzhdICsgbVszXSppbnZbMTJdO1xuICAgICAgICBpZiggZGV0ID09IDAgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG4gICAgICAgIHZhciBtbyA9IHRoaXMubWFrZSgpO1xuICAgICAgICBmb3IoIHZhciBpPTA7IGk8MTY7ICsraSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vW2ldID0gaW52W2ldICogZGV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtbztcbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlZCA6IGZ1bmN0aW9uKG0pXG4gICAge1xuICAgICAgICB2YXIgbW8gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICBtb1swIF0gPSBtWzAgXTtcbiAgICAgICAgbW9bMSBdID0gbVs0IF07XG4gICAgICAgIG1vWzIgXSA9IG1bOCBdO1xuICAgICAgICBtb1szIF0gPSBtWzEyXTtcblxuICAgICAgICBtb1s0IF0gPSBtWzEgXTtcbiAgICAgICAgbW9bNSBdID0gbVs1IF07XG4gICAgICAgIG1vWzYgXSA9IG1bOSBdO1xuICAgICAgICBtb1s3IF0gPSBtWzEzXTtcblxuICAgICAgICBtb1s4IF0gPSBtWzIgXTtcbiAgICAgICAgbW9bOSBdID0gbVs2IF07XG4gICAgICAgIG1vWzEwXSA9IG1bMTBdO1xuICAgICAgICBtb1sxMV0gPSBtWzE0XTtcblxuICAgICAgICBtb1sxMl0gPSBtWzMgXTtcbiAgICAgICAgbW9bMTNdID0gbVs3IF07XG4gICAgICAgIG1vWzE0XSA9IG1bMTFdO1xuICAgICAgICBtb1sxNV0gPSBtWzE1XTtcblxuICAgICAgICByZXR1cm4gbW87XG4gICAgfSxcblxuICAgIHRvTWF0MzNJbnZlcnNlZCA6IGZ1bmN0aW9uKG1hdDQ0LG1hdDMzKVxuICAgIHtcbiAgICAgICAgdmFyIGEwMCA9IG1hdDQ0WzBdLCBhMDEgPSBtYXQ0NFsxXSwgYTAyID0gbWF0NDRbMl07XG4gICAgICAgIHZhciBhMTAgPSBtYXQ0NFs0XSwgYTExID0gbWF0NDRbNV0sIGExMiA9IG1hdDQ0WzZdO1xuICAgICAgICB2YXIgYTIwID0gbWF0NDRbOF0sIGEyMSA9IG1hdDQ0WzldLCBhMjIgPSBtYXQ0NFsxMF07XG5cbiAgICAgICAgdmFyIGIwMSA9IGEyMiphMTEtYTEyKmEyMTtcbiAgICAgICAgdmFyIGIxMSA9IC1hMjIqYTEwK2ExMiphMjA7XG4gICAgICAgIHZhciBiMjEgPSBhMjEqYTEwLWExMSphMjA7XG5cbiAgICAgICAgdmFyIGQgPSBhMDAqYjAxICsgYTAxKmIxMSArIGEwMipiMjE7XG4gICAgICAgIGlmICghZCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgICB2YXIgaWQgPSAxL2Q7XG5cblxuICAgICAgICBpZighbWF0MzMpIHsgbWF0MzMgPSBNYXQzMy5tYWtlKCk7IH1cblxuICAgICAgICBtYXQzM1swXSA9IGIwMSppZDtcbiAgICAgICAgbWF0MzNbMV0gPSAoLWEyMiphMDEgKyBhMDIqYTIxKSppZDtcbiAgICAgICAgbWF0MzNbMl0gPSAoYTEyKmEwMSAtIGEwMiphMTEpKmlkO1xuICAgICAgICBtYXQzM1szXSA9IGIxMSppZDtcbiAgICAgICAgbWF0MzNbNF0gPSAoYTIyKmEwMCAtIGEwMiphMjApKmlkO1xuICAgICAgICBtYXQzM1s1XSA9ICgtYTEyKmEwMCArIGEwMiphMTApKmlkO1xuICAgICAgICBtYXQzM1s2XSA9IGIyMSppZDtcbiAgICAgICAgbWF0MzNbN10gPSAoLWEyMSphMDAgKyBhMDEqYTIwKSppZDtcbiAgICAgICAgbWF0MzNbOF0gPSAoYTExKmEwMCAtIGEwMSphMTApKmlkO1xuXG4gICAgICAgIHJldHVybiBtYXQzMztcblxuXG4gICAgfSxcblxuICAgIG11bHRWZWMzIDogZnVuY3Rpb24obSx2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICB2WzBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XG4gICAgICAgIHZbMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcbiAgICAgICAgdlsyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBtdWx0VmVjNCA6IGZ1bmN0aW9uKG0sdilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICB2WzBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgICAgICB2WzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM10gKiB3O1xuICAgICAgICB2WzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICB2WzNdID0gbVsgM10gKiB4ICsgbVsgN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuXG4gICAgICAgIHJldHVybiB2O1xuXG5cbiAgICB9LFxuXG4gICAgaXNGbG9hdEVxdWFsIDogZnVuY3Rpb24obTAsbTEpXG4gICAge1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2k8MTYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKCFrTWF0aC5pc0Zsb2F0RXF1YWwobTBbaV0sbTFbaV0pKXJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKG0pXG4gICAge1xuICAgICAgICByZXR1cm4gJ1snICsgbVsgMF0gKyAnLCAnICsgbVsgMV0gKyAnLCAnICsgbVsgMl0gKyAnLCAnICsgbVsgM10gKyAnLFxcbicgK1xuICAgICAgICAgICAgJyAnICsgbVsgNF0gKyAnLCAnICsgbVsgNV0gKyAnLCAnICsgbVsgNl0gKyAnLCAnICsgbVsgN10gKyAnLFxcbicgK1xuICAgICAgICAgICAgJyAnICsgbVsgOF0gKyAnLCAnICsgbVsgOV0gKyAnLCAnICsgbVsxMF0gKyAnLCAnICsgbVsxMV0gKyAnLFxcbicgK1xuICAgICAgICAgICAgJyAnICsgbVsxMl0gKyAnLCAnICsgbVsxM10gKyAnLCAnICsgbVsxNF0gKyAnLCAnICsgbVsxNV0gKyAnXSc7XG4gICAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgUEkgICAgICAgICAgOiBNYXRoLlBJLFxuICAgIEhBTEZfUEkgICAgIDogTWF0aC5QSSAqIDAuNSxcbiAgICBRVUFSVEVSX1BJICA6IE1hdGguUEkgKiAwLjI1LFxuICAgIFRXT19QSSAgICAgIDogTWF0aC5QSSAqIDIsXG4gICAgRVBTSUxPTiAgICAgOiAwLjAwMDEsXG5cbiAgICBsZXJwICAgICAgICA6IGZ1bmN0aW9uKGEsYix2KXtyZXR1cm4gKGEqKDEtdikpKyhiKnYpO30sXG4gICAgY29zSW50cnBsICAgOiBmdW5jdGlvbihhLGIsdil7diA9ICgxIC0gTWF0aC5jb3ModiAqIE1hdGguUEkpKSAqIDAuNTtyZXR1cm4gKGEgKiAoMS12KSArIGIgKiB2KTt9LFxuICAgIGN1YmljSW50cnBsIDogZnVuY3Rpb24oYSxiLGMsZCx2KVxuICAgIHtcbiAgICAgICAgdmFyIGEwLGIwLGMwLGQwLHZ2O1xuXG4gICAgICAgIHZ2ID0gdiAqIHY7XG4gICAgICAgIGEwID0gZCAtIGMgLSBhICsgYjtcbiAgICAgICAgYjAgPSBhIC0gYiAtIGEwO1xuICAgICAgICBjMCA9IGMgLSBhO1xuICAgICAgICBkMCA9IGI7XG5cbiAgICAgICAgcmV0dXJuIGEwKnYqdnYrYjAqdnYrYzAqditkMDtcbiAgICB9LFxuXG4gICAgaGVybWl0ZUludHJwbCA6IGZ1bmN0aW9uKGEsYixjLGQsdix0ZW5zaW9uLGJpYXMpXG4gICAge1xuICAgICAgICB2YXIgdjAsIHYxLCB2MiwgdjMsXG4gICAgICAgICAgICBhMCwgYjAsIGMwLCBkMDtcblxuICAgICAgICB0ZW5zaW9uID0gKDEuMCAtIHRlbnNpb24pICogMC41O1xuXG4gICAgICAgIHZhciBiaWFzcCA9IDEgKyBiaWFzLFxuICAgICAgICAgICAgYmlhc24gPSAxIC0gYmlhcztcblxuICAgICAgICB2MiAgPSB2ICogdjtcbiAgICAgICAgdjMgID0gdjIgKiB2O1xuXG4gICAgICAgIHYwICA9IChiIC0gYSkgKiBiaWFzcCAqIHRlbnNpb247XG4gICAgICAgIHYwICs9IChjIC0gYikgKiBiaWFzbiAqIHRlbnNpb247XG4gICAgICAgIHYxICA9IChjIC0gYikgKiBiaWFzcCAqIHRlbnNpb247XG4gICAgICAgIHYxICs9IChkIC0gYykgKiBiaWFzbiAqIHRlbnNpb247XG5cbiAgICAgICAgYTAgID0gMiAqIHYzIC0gMyAqIHYyICsgMTtcbiAgICAgICAgYjAgID0gdjMgLSAyICogdjIgKyB2O1xuICAgICAgICBjMCAgPSB2MyAtIHYyO1xuICAgICAgICBkMCAgPSAtMiAqIHYzICsgMyAqIHYyO1xuXG4gICAgICAgIHJldHVybiBhMCAqIGIgKyBiMCAqIHYwICsgYzAgKiB2MSArIGQwICogYztcbiAgICB9LFxuXG4gICAgcmFuZG9tRmxvYXQgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgcjtcblxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMDogciA9IE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IHIgPSBNYXRoLnJhbmRvbSgpICogYXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiByID0gYXJndW1lbnRzWzBdICsgKGFyZ3VtZW50c1sxXS1hcmd1bWVudHNbMF0pICogTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG5cbiAgICByYW5kb21JbnRlZ2VyIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDA6IHIgPSAwLjUgKyBNYXRoLnJhbmRvbSgpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiByID0gMC41ICsgTWF0aC5yYW5kb20oKSphcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IHIgPSBhcmd1bWVudHNbMF0gKyAoIDEgKyBhcmd1bWVudHNbMV0gLSBhcmd1bWVudHNbMF0pICogTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHIpO1xuICAgIH0sXG5cbiAgICBjb25zdHJhaW4gOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgcjtcblxuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMjogYXJndW1lbnRzWzBdID0gKGFyZ3VtZW50c1swXSA+IGFyZ3VtZW50c1sxXSkgPyBhcmd1bWVudHNbMV0gOiBhcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6IGFyZ3VtZW50c1swXSA9IChhcmd1bWVudHNbMF0gPiBhcmd1bWVudHNbMl0pID8gYXJndW1lbnRzWzJdIDogKGFyZ3VtZW50c1swXSA8IGFyZ3VtZW50c1sxXSkgPyBhcmd1bWVudHNbMV0gOmFyZ3VtZW50c1swXTticmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZSAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlLHN0YXJ0LGVuZCl7cmV0dXJuICh2YWx1ZSAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCk7fSxcbiAgICBtYXAgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSxpblN0YXJ0LGluRW5kLG91dFN0YXJ0LG91dEVuZCl7cmV0dXJuIG91dFN0YXJ0ICsgKG91dEVuZCAtIG91dFN0YXJ0KSAqIG5vcm1hbGl6ZSh2YWx1ZSxpblN0YXJ0LGluRW5kKTt9LFxuICAgIHNpbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gTWF0aC5zaW4odmFsdWUpO30sXG4gICAgY29zICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUpe3JldHVybiBNYXRoLmNvcyh2YWx1ZSk7fSxcbiAgICBjbGFtcCAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSxtaW4sbWF4KXtyZXR1cm4gTWF0aC5tYXgobWluLE1hdGgubWluKG1heCx2YWx1ZSkpO30sXG4gICAgc2F3ICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDIgKiAobiAgLSBNYXRoLmZsb29yKDAuNSArIG4gKSk7fSxcbiAgICB0cmkgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS00Kk1hdGguYWJzKDAuNS10aGlzLmZyYWMoMC41Km4rMC4yNSkpO30sXG4gICAgcmVjdCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7dmFyIGEgPSBNYXRoLmFicyhuKTtyZXR1cm4gKGEgPiAwLjUpID8gMCA6IChhID09IDAuNSkgPyAwLjUgOiAoYSA8IDAuNSkgPyAxIDogLTE7fSxcbiAgICBmcmFjICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbiAtIE1hdGguZmxvb3Iobik7fSxcbiAgICBzZ24gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbi9NYXRoLmFicyhuKTt9LFxuICAgIGFicyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmFicyhuKTt9LFxuICAgIG1pbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLm1pbihuKTt9LFxuICAgIG1heCAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLm1heChuKTt9LFxuICAgIGF0YW4gICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmF0YW4obik7fSxcbiAgICBhdGFuMiAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih5LHgpe3JldHVybiBNYXRoLmF0YW4yKHkseCk7fSxcbiAgICByb3VuZCAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5yb3VuZChuKTt9LFxuICAgIGZsb29yICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmZsb29yKG4pO30sXG4gICAgdGFuICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgudGFuKG4pO30sXG4gICAgcmFkMmRlZyAgICAgICAgICAgICAgIDogZnVuY3Rpb24ocmFkaWFucyl7cmV0dXJuIHJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSk7fSxcbiAgICBkZWcycmFkICAgICAgICAgICAgICAgOiBmdW5jdGlvbihkZWdyZWUpe3JldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7IH0sXG4gICAgc3FydCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUpe3JldHVybiBNYXRoLnNxcnQodmFsdWUpO30sXG4gICAgR3JlYXRlc3RDb21tb25EaXZpc29yIDogZnVuY3Rpb24oYSxiKXtyZXR1cm4gKGIgPT0gMCkgPyBhIDogdGhpcy5HcmVhdGVzdENvbW1vbkRpdmlzb3IoYiwgYSAlIGIpO30sXG4gICAgaXNGbG9hdEVxdWFsICAgICAgICAgIDogZnVuY3Rpb24oYSxiKXtyZXR1cm4gKE1hdGguYWJzKGEtYik8dGhpcy5FUFNJTE9OKTt9LFxuICAgIGlzUG93ZXJPZlR3byAgICAgICAgICA6IGZ1bmN0aW9uKGEpe3JldHVybiAoYSYoYS0xKSk9PTA7fSxcbiAgICBzd2FwICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihhLGIpe3ZhciB0ID0gYTthID0gYjsgYiA9IGE7fSxcbiAgICBwb3cgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih4LHkpe3JldHVybiBNYXRoLnBvdyh4LHkpO30sXG4gICAgbG9nICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgubG9nKG4pO30sXG4gICAgY29zaCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIChNYXRoLnBvdyhNYXRoLkUsbikgKyBNYXRoLnBvdyhNYXRoLkUsLW4pKSowLjU7fSxcbiAgICBleHAgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5leHAobik7fSxcbiAgICBzdGVwU21vb3RoICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbipuKigzLTIqbik7fSxcbiAgICBzdGVwU21vb3RoU3F1YXJlZCAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5zdGVwU21vb3RoKG4pICogdGhpcy5zdGVwU21vb3RoKG4pO30sXG4gICAgc3RlcFNtb290aEludlNxdWFyZWQgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpO30sXG4gICAgc3RlcFNtb290aEN1YmVkICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuc3RlcFNtb290aChuKSp0aGlzLnN0ZXBTbW9vdGgobikqdGhpcy5zdGVwU21vb3RoKG4pKnRoaXMuc3RlcFNtb290aChuKTt9LFxuICAgIHN0ZXBTbW9vdGhJbnZDdWJlZCAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpKigxLXRoaXMuc3RlcFNtb290aChuKSk7fSxcbiAgICBzdGVwU3F1YXJlZCAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbipuO30sXG4gICAgc3RlcEludlNxdWFyZWQgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtKDEtbikqKDEtbik7fSxcbiAgICBzdGVwQ3ViZWQgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gbipuKm4qbjt9LFxuICAgIHN0ZXBJbnZDdWJlZCAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLW4pKigxLW4pKigxLW4pKigxLW4pO30sXG4gICAgY2F0bXVsbHJvbSAgICAgICAgICAgIDogZnVuY3Rpb24oYSxiLGMsZCxpKXsgcmV0dXJuIGEgKiAoKC1pICsgMikgKiBpIC0gMSkgKiBpICogMC41ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiAqICgoKDMgKiBpIC0gNSkgKiBpKSAqIGkgKyAyKSAqIDAuNSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgKiAoKC0zICogaSArIDQpICogaSArIDEpICogaSAqIDAuNSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQgKiAoKGkgLSAxKSAqIGkgKiBpKSAqIDAuNTt9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIG1ha2UgICAgIDogZnVuY3Rpb24obix2KXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbbiwgdlswXSx2WzFdLHZbMl1dKTt9LFxuICAgIG1ha2U0ZiAgIDogZnVuY3Rpb24obix4LHkseil7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW24seCx5LHpdKTt9LFxuICAgIHplcm8gICAgIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMF0pO30sXG4gICAgc2V0ICAgICAgOiBmdW5jdGlvbihxMCxxMSlcbiAgICB7XG4gICAgICAgIHEwWzBdID0gcTFbMF07XG4gICAgICAgIHEwWzFdID0gcTFbMV07XG4gICAgICAgIHEwWzJdID0gcTFbMl07XG4gICAgICAgIHEwWzNdID0gcTFbM107XG4gICAgfSxcblxuICAgIHNldDRmICAgIDogZnVuY3Rpb24ocSxuLHgseSx6KVxuICAgIHtcbiAgICAgICAgcVswXSA9IG47XG4gICAgICAgIHFbMV0gPSB4O1xuICAgICAgICBxWzJdID0geTtcbiAgICAgICAgcVszXSA9IHo7XG5cbiAgICB9LFxuXG4gICAgY29weSAgICAgOiBmdW5jdGlvbihxKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShxKTt9LFxuXG4gICAgbGVuZ3RoICAgOiBmdW5jdGlvbihxKXt2YXIgbiA9IHFbMF0seCA9IHFbMV0seSA9IHFbMl0seiA9IHFbM107IHJldHVybiBNYXRoLnNxcnQobipuK3gqeCt5Knkreip6KTt9LFxuICAgIHZlY3RvciAgIDogZnVuY3Rpb24ocSl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkocVsxXSxxWzJdLHFbM10pO30sXG4gICAgc2NhbGFyICAgOiBmdW5jdGlvbihxKXtyZXR1cm4gcVswXTt9LFxuXG5cblxuICAgIGFkZCA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgcTBbMF0gPSBxMFswXSArIHExWzBdO1xuICAgICAgICBxMFsxXSA9IHEwWzFdICsgcTFbMV07XG4gICAgICAgIHEwWzJdID0gcTBbMl0gKyBxMVsyXTtcbiAgICAgICAgcTBbM10gPSBxMFszXSArIHExWzNdO1xuICAgIH0sXG5cbiAgICBzdWIgOiBmdW5jdGlvbihxMCxxMSlcbiAgICB7XG4gICAgICAgIHEwWzBdID0gcTBbMF0gLSBxMVswXTtcbiAgICAgICAgcTBbMV0gPSBxMFsxXSAtIHExWzFdO1xuICAgICAgICBxMFsyXSA9IHEwWzJdIC0gcTFbMl07XG4gICAgICAgIHEwWzNdID0gcTBbM10gLSBxMVszXTtcbiAgICB9LFxuXG4gICAgc2NhbGUgOiBmdW5jdGlvbihxLG4pXG4gICAge1xuICAgICAgICBxWzBdICo9IG47XG4gICAgICAgIHFbMV0gKj0gbjtcbiAgICAgICAgcVsyXSAqPSBuO1xuICAgICAgICBxWzNdICo9IG47XG4gICAgfSxcblxuICAgIGNvbmp1Z2F0ZSA6IGZ1bmN0aW9uKHEpXG4gICAge1xuICAgICAgICBxWzFdKj0tMTtcbiAgICAgICAgcVsyXSo9LTE7XG4gICAgICAgIHFbM10qPS0xO1xuICAgIH0sXG5cbiAgICBtdWx0IDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICB2YXIgbjAgPSBxMFswXSxcbiAgICAgICAgICAgIHgwID0gcTBbMV0sXG4gICAgICAgICAgICB5MCA9IHEwWzJdLFxuICAgICAgICAgICAgejAgPSBxMFszXSxcbiAgICAgICAgICAgIG4xID0gcTFbMF0sXG4gICAgICAgICAgICB4MSA9IHExWzFdLFxuICAgICAgICAgICAgeTEgPSBxMVsyXSxcbiAgICAgICAgICAgIHoxID0gcTFbM107XG5cbiAgICAgICAgcTBbMF0gPSBuMCAqIG4xIC0geDAgKiB4MSAtIHkwICogeTEgLSB6MCAqIHoxO1xuICAgICAgICBxMFsxXSA9IG4wICogeDEgLSB4MCAqIG4xIC0geTAgKiB6MSAtIHowICogeTE7XG4gICAgICAgIHEwWzJdID0gbjAgKiB5MSAtIHkwICogbjEgLSB6MCAqIHgxIC0geDAgKiB6MTtcbiAgICAgICAgcTBbM10gPSBuMCAqIHoxIC0gejAgKiBuMSAtIHgwICogeTEgLSB5MCAqIHoxO1xuICAgIH0sXG5cbiAgICBtdWx0VmVjIDogZnVuY3Rpb24ocSx2KVxuICAgIHtcbiAgICAgICAgdmFyIHFuID0gcVswXSxcbiAgICAgICAgICAgIHF4ID0gcVsxXSxcbiAgICAgICAgICAgIHF5ID0gcVsyXSxcbiAgICAgICAgICAgIHF6ID0gcVszXTtcblxuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHFbMF0gPSAtKHF4KnggKyBxeSp5ICsgcXoqeik7XG4gICAgICAgIHFbMV0gPSBxbiAqIHggKyBxeSAqIHogLSBxeiAqIHk7XG4gICAgICAgIHFbMl0gPSBxbiAqIHkgKyBxeiAqIHggLSBxeCAqIHo7XG4gICAgICAgIHFbM10gPSBxbiAqIHogKyBxeCAqIHkgLSBxeSAqIHg7XG4gICAgfSxcblxuICAgIGFuZ2xlIDogZnVuY3Rpb24ocSlcbiAgICB7XG4gICAgICAgIHJldHVybiAyICogYWNvcyhxWzBdKTtcbiAgICB9LFxuXG4gICAgYXhpcyA6IGZ1bmN0aW9uKHEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHFbMF0sXG4gICAgICAgICAgICB5ID0gcVsxXSxcbiAgICAgICAgICAgIHogPSBxWzJdO1xuXG4gICAgICAgIHZhciBsID0gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeik7XG5cbiAgICAgICAgcmV0dXJuIGwgIT0gMCA/IG5ldyBGbG9hdDMyQXJyYXkoW3gvbCx5L2wsei9sXSkgOiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMF0pO1xuICAgIH0sXG5cbiAgICAvL1RPRE86IElOTElORSBBTEwhIVxuXG4gICAgcm90YXRlIDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICB0aGlzLnNldChxMCx0aGlzLm11bHQodGhpcy5tdWx0KHRoaXMuY29weShxMCkscTEpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmp1Z2F0ZSh0aGlzLmNvcHkocTApKSkpO1xuICAgIH0sXG5cbiAgICByb3RhdGVWZWMgOiBmdW5jdGlvbihxLHYpXG4gICAge1xuICAgICAgICB2YXIgdCA9IHRoaXMuemVybygpO1xuICAgICAgICB0aGlzLnNldCh0LHRoaXMubXVsdFZlYzModGhpcy5tdWx0VmVjMyh0aGlzLmNvcHkocSksdiksdGhpcy5jb25qdWdhdGUodGhpcy5jb3B5KHEpKSkpO1xuICAgIH0sXG5cbiAgICBmcm9tQW5nbGVzIDogZnVuY3Rpb24oYXgsYXksYXopXG4gICAge1xuICAgICAgICB2YXIgcSA9IHRoaXMuemVybygpO1xuXG4gICAgICAgIHZhciBjeWF3LGNwaXRjaCxjcm9sbCxzeWF3LHNwaXRjaCxzcm9sbDtcbiAgICAgICAgdmFyIGN5YXdjcGl0Y2gsc3lhd3NwaXRjaCxjeWF3c3BpdGNoLHN5YXdjcGl0Y2g7XG5cbiAgICAgICAgY3lhdyAgID0gTWF0aC5jb3MoYXogKiAwLjUpO1xuICAgICAgICBjcGl0Y2ggPSBNYXRoLmNvcyhheSAqIDAuNSk7XG4gICAgICAgIGNyb2xsICA9IE1hdGguY29zKGF4ICogMC41KTtcbiAgICAgICAgc3lhdyAgID0gTWF0aC5zaW4oYXogKiAwLjUpO1xuICAgICAgICBzcGl0Y2ggPSBNYXRoLnNpbihheSAqIDAuNSk7XG4gICAgICAgIHNyb2xsICA9IE1hdGguc2luKGF4ICogMC41KTtcblxuICAgICAgICBjeWF3Y3BpdGNoID0gY3lhdyAqIGNwaXRjaDtcbiAgICAgICAgc3lhd3NwaXRjaCA9IHN5YXcgKiBzcGl0Y2g7XG4gICAgICAgIGN5YXdzcGl0Y2ggPSBjeWF3ICogc3BpdGNoO1xuICAgICAgICBzeWF3Y3BpdGNoID0gc3lhdyAqIGNwaXRjaDtcblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIGN5YXdjcGl0Y2ggKiBjcm9sbCArIHN5YXdzcGl0Y2ggKiBzcm9sbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjeWF3Y3BpdGNoICogc3JvbGwgLSBzeWF3c3BpdGNoICogY3JvbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3lhd3NwaXRjaCAqIGNyb2xsICsgc3lhd2NwaXRjaCAqIHNyb2xsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5YXdjcGl0Y2ggKiBjcm9sbCAtIGN5YXdzcGl0Y2ggKiBzcm9sbCBdKTtcblxuICAgIH0sXG5cbiAgICBhbmdsZXNGcm9tIDogZnVuY3Rpb24ocSlcbiAgICB7XG4gICAgICAgIHZhciBxbiA9IHFbMF0sXG4gICAgICAgICAgICBxeCA9IHFbMV0sXG4gICAgICAgICAgICBxeSA9IHFbMl0sXG4gICAgICAgICAgICBxeiA9IHFbM107XG5cbiAgICAgICAgdmFyIHIxMSxyMjEscjMxLHIzMixyMzMscjEyLHIxMztcbiAgICAgICAgdmFyIHEwMCxxMTEscTIyLHEzMztcbiAgICAgICAgdmFyIHRlbXA7XG4gICAgICAgIHZhciB2ID0gbmV3IEZsb2F0MzJBcnJheSgzKTtcblxuICAgICAgICBxMDAgPSBxbiAqIHFuO1xuICAgICAgICBxMTEgPSBxeCAqIHF4O1xuICAgICAgICBxMjIgPSBxeSAqIHF5O1xuICAgICAgICBxMzMgPSBxeiAqIHF6O1xuXG4gICAgICAgIHIxMSA9IHEwMCArIHExMSAtIHEyMiAtIHEzMztcbiAgICAgICAgcjIxID0gMiAqICggcXggKyBxeSArIHFuICogcXopO1xuICAgICAgICByMzEgPSAyICogKCBxeCAqIHF6IC0gcW4gKiBxeSk7XG4gICAgICAgIHIzMiA9IDIgKiAoIHF5ICogcXogKyBxbiAqIHF4KTtcbiAgICAgICAgcjMzID0gcTAwIC0gcTExIC0gcTIyICsgcTMzO1xuXG4gICAgICAgIHRlbXAgPSBNYXRoLmFicyhyMzEpO1xuICAgICAgICBpZih0ZW1wID4gMC45OTk5OTkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHIxMiA9IDIgKiAocXggKiBxeSAtIHFuICogcXopO1xuICAgICAgICAgICAgcjEzID0gMiAqIChxeCAqIHF6IC0gcW4gKiBxeSk7XG5cbiAgICAgICAgICAgIHZbMF0gPSAwLjA7XG4gICAgICAgICAgICB2WzFdID0gKC0oTWF0aC5QSSAqIDAuNSkgKiAgcjMyIC8gdGVtcCk7XG4gICAgICAgICAgICB2WzJdID0gTWF0aC5hdGFuMigtcjEyLC1yMzEqcjEzKTtcbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9XG5cbiAgICAgICAgdlswXSA9IE1hdGguYXRhbjIocjMyLHIzMyk7XG4gICAgICAgIHZbMV0gPSBNYXRoLmFzaW4oLTMxKTtcbiAgICAgICAgdlsyXSA9IE1hdGguYXRhbjIocjIxLHIxMSk7XG4gICAgICAgIHJldHVybiB2O1xuICAgfVxufTsiLCJ2YXIgVmVjMiA9XG57XG4gICAgU0laRSA6IDIsXG5cbiAgICBtYWtlIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMF0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgU0laRSAgIDogMyxcbiAgICBaRVJPICAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMF0pfSxcbiAgICBBWElTX1ggOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMF0pfSxcbiAgICBBWElTX1kgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDEsMF0pfSxcbiAgICBBWElTX1ogOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMV0pfSxcblxuICAgIG1ha2UgOiBmdW5jdGlvbih4LHkseilcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgeCB8fCAwLjAsXG4gICAgICAgICAgICB5IHx8IDAuMCxcbiAgICAgICAgICAgIHogfHwgMC4wXSk7XG4gICAgfSxcblxuICAgIHNldCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gPSB2MVswXTtcbiAgICAgICAgdjBbMV0gPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNldDNmIDogIGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBjb3B5IDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcbiAgICB9LFxuXG4gICAgYWRkIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSArPSB2MVswXTtcbiAgICAgICAgdjBbMV0gKz0gdjFbMV07XG4gICAgICAgIHYwWzJdICs9IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc3ViIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSAtPSB2MVswXTtcbiAgICAgICAgdjBbMV0gLT0gdjFbMV07XG4gICAgICAgIHYwWzJdIC09IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc2NhbGUgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2WzBdKj1uO1xuICAgICAgICB2WzFdKj1uO1xuICAgICAgICB2WzJdKj1uO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkb3QgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB2MFswXSp2MVswXSArIHYwWzFdKnYxWzFdICsgdjBbMl0qdjFbMl07XG4gICAgfSxcblxuICAgIGNyb3NzOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3kwICogejEgLSB5MSAqIHowLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgejAgKiB4MSAtIHoxICogeDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MCAqIHkxIC0geDEgKiB5MF0pO1xuICAgIH0sXG5cbiAgICBsZXJwIDogZnVuY3Rpb24odjAsdjEsZilcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl07XG5cbiAgICAgICAgdjBbMF0gPSB4MCAqICgxLjAgLSBmKSArIHYxWzBdICogZjtcbiAgICAgICAgdjBbMV0gPSB5MCAqICgxLjAgLSBmKSArIHYxWzFdICogZjtcbiAgICAgICAgdjBbMl0gPSB6MCAqICgxLjAgLSBmKSArIHYxWzJdICogZjtcblxuXG4gICAgfSxcblxuICAgIGxlcnBlZCA6IGZ1bmN0aW9uKHYwLHYxLGYpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5sZXJwKHRoaXMuY29weSh2MCksdjEsZik7XG4gICAgfSxcblxuXG5cbiAgICBsZXJwM2YgOiBmdW5jdGlvbih2LHgseSx6LGYpXG4gICAge1xuICAgICAgICB2YXIgdnggPSB2WzBdLFxuICAgICAgICAgICAgdnkgPSB2WzFdLFxuICAgICAgICAgICAgdnogPSB2WzJdO1xuXG4gICAgICAgIHZbMF0gPSB2eCAqICgxLjAgLSBmKSArIHggKiBmO1xuICAgICAgICB2WzFdID0gdnkgKiAoMS4wIC0gZikgKyB5ICogZjtcbiAgICAgICAgdlsyXSA9IHZ6ICogKDEuMCAtIGYpICsgeiAqIGY7XG4gICAgfSxcblxuXG4gICAgbGVuZ3RoIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4KngreSp5K3oqeik7XG4gICAgfSxcblxuICAgIGxlbmd0aFNxIDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHJldHVybiB4KngreSp5K3oqejtcbiAgICB9LFxuXG4gICAgc2FmZU5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICAgICAgZCA9IGQgfHwgMTtcblxuICAgICAgICB2YXIgbCAgPSAxL2Q7XG5cbiAgICAgICAgdlswXSAqPSBsO1xuICAgICAgICB2WzFdICo9IGw7XG4gICAgICAgIHZbMl0gKj0gbDtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGwgID0gMS9NYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuXG4gICAgICAgIHZbMF0gKj0gbDtcbiAgICAgICAgdlsxXSAqPSBsO1xuICAgICAgICB2WzJdICo9IGw7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZTNmIDogZnVuY3Rpb24odix4LHkseilcbiAgICB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHggKyB2WzFdICogeSArIHZbMl0gKiB6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2VTcSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Kno7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EzZiA6IGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICByZXR1cm4gdlswXSAqIHggKyB2WzFdICogeSArIHZbMl0gKiB6O1xuICAgIH0sXG5cbiAgICBsaW1pdCA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGRzcSA9IHgqeCArIHkqeSArIHoqeixcbiAgICAgICAgICAgIGxzcSA9IG4gKiBuO1xuXG4gICAgICAgIGlmKChkc3EgPiBsc3EpICYmIGxzcSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBuZCA9IG4vTWF0aC5zcXJ0KGRzcSk7XG5cbiAgICAgICAgICAgIHZbMF0gKj0gbmQ7XG4gICAgICAgICAgICB2WzFdICo9IG5kO1xuICAgICAgICAgICAgdlsyXSAqPSBuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBpbnZlcnQgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdlswXSo9LTE7XG4gICAgICAgIHZbMV0qPS0xO1xuICAgICAgICB2WzJdKj0tMTtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgYWRkZWQgIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQodGhpcy5jb3B5KHYwKSx2MSk7XG4gICAgfSxcblxuICAgIHN1YmJlZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzY2FsZWQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZSh0aGlzLmNvcHkodiksbik7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWQgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKHRoaXMuY29weSh2KSk7XG4gICAgfSxcblxuICAgIHRvU3RyaW5nIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiAnWycgKyB2WzBdICsgJywnICsgdlsxXSArICcsJyArIHZbMl0gKyAnXSc7XG4gICAgfVxuXG59O1xuXG5cblxuIiwiXG4vL1RPRE86RklOSVNIXG5tb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgU0laRSA6IDQsXG4gICAgWkVSTyA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDEuMF0pfSxcblxuICAgIG1ha2UgOiBmdW5jdGlvbih4LHkseix3KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyB4IHx8IDAuMCxcbiAgICAgICAgICAgIHkgfHwgMC4wLFxuICAgICAgICAgICAgeiB8fCAwLjAsXG4gICAgICAgICAgICB3IHx8IDEuMF0pO1xuICAgIH0sXG5cbiAgICBmcm9tVmVjMyA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHZbMF0sIHZbMV0sIHZbMl0gLCAxLjBdKTtcbiAgICB9LFxuXG4gICAgc2V0IDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSA9IHYxWzBdO1xuICAgICAgICB2MFsxXSA9IHYxWzFdO1xuICAgICAgICB2MFsyXSA9IHYxWzJdO1xuICAgICAgICB2MFszXSA9IHYxWzNdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc2V0M2YgOiAgZnVuY3Rpb24odix4LHkseilcbiAgICB7XG4gICAgICAgIHZbMF0gPSB4O1xuICAgICAgICB2WzFdID0geTtcbiAgICAgICAgdlsyXSA9IHo7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIHNldDRmIDogZnVuY3Rpb24odix4LHkseix3KVxuICAgIHtcbiAgICAgICAgdlswXSA9IHg7XG4gICAgICAgIHZbMV0gPSB5O1xuICAgICAgICB2WzJdID0gejtcbiAgICAgICAgdlszXSA9IHc7XG5cbiAgICAgICAgcmV0dXJuIHY7XG5cbiAgICB9LFxuXG4gICAgY29weSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XG4gICAgfSxcblxuICAgIGFkZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gKz0gdjFbMF07XG4gICAgICAgIHYwWzFdICs9IHYxWzFdO1xuICAgICAgICB2MFsyXSArPSB2MVsyXTtcbiAgICAgICAgdjBbM10gKz0gdjFbM107XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzdWIgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdIC09IHYxWzBdO1xuICAgICAgICB2MFsxXSAtPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gLT0gdjFbMl07XG4gICAgICAgIHYwWzNdIC09IHYxWzNdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc2NhbGUgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2WzBdKj1uO1xuICAgICAgICB2WzFdKj1uO1xuICAgICAgICB2WzJdKj1uO1xuICAgICAgICB2WzNdKj1uO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkb3QgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB2MFswXSp2MVswXSArIHYwWzFdKnYxWzFdICsgdjBbMl0qdjFbMl07XG4gICAgfSxcblxuICAgIGNyb3NzOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3kwKnoxLXkxKnowLHowKngxLXoxKngwLHgwKnkxLXgxKnkwXSk7XG4gICAgfSxcblxuICAgIHNsZXJwIDogZnVuY3Rpb24odjAsdjEsZilcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgdmFyIGQgPSBNYXRoLm1heCgtMS4wLE1hdGgubWluKCh4MCp4MSArIHkwKnkxICsgejAqejEpLDEuMCkpLFxuICAgICAgICAgICAgdCA9IE1hdGguYWNvcyhkKSAqIGY7XG5cbiAgICAgICAgdmFyIHggPSB4MCAtICh4MSAqIGQpLFxuICAgICAgICAgICAgeSA9IHkwIC0gKHkxICogZCksXG4gICAgICAgICAgICB6ID0gejAgLSAoejEgKiBkKTtcblxuICAgICAgICB2YXIgbCA9IDEvTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcblxuICAgICAgICB4Kj1sO1xuICAgICAgICB5Kj1sO1xuICAgICAgICB6Kj1sO1xuXG4gICAgICAgIHZhciBjdCA9IE1hdGguY29zKHQpLFxuICAgICAgICAgICAgc3QgPSBNYXRoLnNpbih0KTtcblxuICAgICAgICB2YXIgeG8gPSB4MCAqIGN0ICsgeCAqIHN0LFxuICAgICAgICAgICAgeW8gPSB5MCAqIGN0ICsgeSAqIHN0LFxuICAgICAgICAgICAgem8gPSB6MCAqIGN0ICsgeiAqIHN0O1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt4byx5byx6b10pO1xuICAgIH0sXG5cbiAgICBsZW5ndGggOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6Knordyp3KTtcbiAgICB9LFxuXG4gICAgbGVuZ3RoU3EgOiAgZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Knordyp3O1xuICAgIH0sXG5cbiAgICBub3JtYWxpemUgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHZhciBsICA9IDEvTWF0aC5zcXJ0KHgqeCt5Knkreip6K3cqdyk7XG5cbiAgICAgICAgdlswXSAqPSBsO1xuICAgICAgICB2WzFdICo9IGw7XG4gICAgICAgIHZbMl0gKj0gbDtcbiAgICAgICAgdlszXSAqPSBsO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2VTcSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Kno7XG4gICAgfSxcblxuICAgIGxpbWl0IDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICB2YXIgZHNxID0geCp4ICsgeSp5ICsgeip6LFxuICAgICAgICAgICAgbHNxID0gbiAqIG47XG5cbiAgICAgICAgaWYoKGRzcSA+IGxzcSkgJiYgbHNxID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG5kID0gbi9NYXRoLnNxcnQoZHNxKTtcblxuICAgICAgICAgICAgdlswXSAqPSBuZDtcbiAgICAgICAgICAgIHZbMV0gKj0gbmQ7XG4gICAgICAgICAgICB2WzJdICo9IG5kO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGludmVydCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2WzBdKj0tMTtcbiAgICAgICAgdlsxXSo9LTE7XG4gICAgICAgIHZbMl0qPS0xO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBhZGRlZCAgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZCh0aGlzLmNvcHkodjApLHYxKTtcbiAgICB9LFxuXG4gICAgc3ViYmVkIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWIodGhpcy5jb3B5KHYwKSx2MSk7XG4gICAgfSxcblxuICAgIHNjYWxlZCA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlKHRoaXMuY29weSh2KSxuKTtcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplZCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUodGhpcy5jb3B5KHYpKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuICdbJyArIHZbMF0gKyAnLCcgKyB2WzFdICsgJywnICsgdlsyXSArICddJztcbiAgICB9XG5cbn07IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIEFQUF9XSURUSCAgOiA4MDAsXG4gICAgQVBQX0hFSUdIVCA6IDYwMCxcblxuICAgIEFQUF9GUFMgOiAzMCxcblxuICAgIEFQUF9QTEFTS19XSU5ET1dfVElUTEUgOiAnJyxcbiAgICBBUFBfUExBU0tfVFlQRSAgOiAnM2QnLFxuICAgIEFQUF9QTEFTS19WU1lOQyA6ICdmYWxzZScsXG4gICAgQVBQX1BMQVNLX01VTFRJU0FNUExFIDogdHJ1ZSxcblxuICAgIENBTUVSQV9GT1YgOiA0NSxcbiAgICBDQU1FUkFfTkVBUiA6IDAuMSxcbiAgICBDQU1FUkFfRkFSICA6IDEwMFxuXG59OyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBNRVRIT0RfTk9UX0lNUExFTUVOVEVEOidNZXRob2Qgbm90IGltcGxlbWVudGVkIGluIHRhcmdldCBwbGF0Zm9ybS4nLFxuICAgIENMQVNTX0lTX1NJTkdMRVRPTjogICAgJ0FwcGxpY2F0aW9uIGlzIHNpbmdsZXRvbi4gR2V0IHZpYSBnZXRJbnN0YW5jZSgpLicsXG4gICAgQVBQX05PX1NFVFVQOiAgICAgICAgICAnTm8gc2V0dXAgbWV0aG9kIGFkZGVkIHRvIGFwcC4nLFxuICAgIEFQUF9OT19VUERBVEUgOiAgICAgICAgJ05vIHVwZGF0ZSBtZXRob2QgYWRkZWQgdG8gYXBwLicsXG4gICAgUExBU0tfV0lORE9XX1NJWkVfU0VUOiAnUGxhc2sgd2luZG93IHNpemUgY2FuIG9ubHkgYmUgc2V0IG9uIHN0YXJ0dXAuJyxcbiAgICBXUk9OR19QTEFURk9STTogICAgICAgICdXcm9uZyBQbGF0Zm9ybS4nXG59OyIsInZhciBQbGF0Zm9ybSA9IHtXRUI6MCxQTEFTSzoxfTtcbiAgICBQbGF0Zm9ybS5fdGFyZ2V0ID0gbnVsbDtcblxuUGxhdGZvcm0uZ2V0VGFyZ2V0ICA9IGZ1bmN0aW9uKClcbntcbiAgICBpZighdGhpcy5fdGFyZ2V0KXRoaXMuX3RhcmdldCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSA/IHRoaXMuV0VCIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZSkgPyB0aGlzLlBMQVNLIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsO1xuICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXRmb3JtOyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBTSVpFICA6IDQsXG5cbiAgICBCTEFDSyA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDFdKX0sXG4gICAgV0hJVEUgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMSwxXSl9LFxuICAgIFJFRCAgIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsMV0pfSxcbiAgICBHUkVFTiA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMSwwLDFdKX0sXG4gICAgQkxVRSAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMSwxXSl9LFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKHIsZyxiLGEpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgcixnLGIsYV0pO30sXG4gICAgY29weSA6IGZ1bmN0aW9uKGMpe3JldHVybiB0aGlzLm1ha2UoY1swXSxjWzFdLGNbMl0sY1szXSk7fSxcblxuICAgIHNldCA6IGZ1bmN0aW9uKGMwLGMxKVxuICAgIHtcbiAgICAgICAgYzBbMF0gPSBjMVswXTtcbiAgICAgICAgYzBbMV0gPSBjMVsxXTtcbiAgICAgICAgYzBbMl0gPSBjMVsyXTtcbiAgICAgICAgYzBbM10gPSBjMVszXTtcblxuICAgICAgICByZXR1cm4gYzA7XG4gICAgfSxcblxuICAgIHNldDRmIDogZnVuY3Rpb24oYyxyLGcsYixhKVxuICAgIHtcbiAgICAgICAgY1swXSA9IHI7XG4gICAgICAgIGNbMV0gPSBnO1xuICAgICAgICBjWzJdID0gYjtcbiAgICAgICAgY1szXSA9IGE7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDNmIDogZnVuY3Rpb24oYyxyLGcsYilcbiAgICB7XG4gICAgICAgIGNbMF0gPSByO1xuICAgICAgICBjWzFdID0gZztcbiAgICAgICAgY1syXSA9IGI7XG4gICAgICAgIGNbM10gPSAxLjA7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDJmIDogZnVuY3Rpb24oYyxrLGEpXG4gICAge1xuICAgICAgICBjWzBdID0gY1sxXSA9IGNbMl0gPSBrO1xuICAgICAgICBjWzNdID0gYTtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuXG4gICAgc2V0MWYgOiBmdW5jdGlvbihjLGspXG4gICAge1xuICAgICAgICBjWzBdID0gY1sxXSA9IGNbMl0gPSBrO1xuICAgICAgICBjWzNdID0gMS4wO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBzZXQ0aSAgICA6IGZ1bmN0aW9uKGMscixnLGIsYSl7cmV0dXJuIHRoaXMuc2V0NGYoYyxyLzI1NS4wLGcvMjU1LjAsYi8yNTUuMCxhKTt9LFxuICAgIHNldDNpICAgIDogZnVuY3Rpb24oYyxyLGcsYikgIHtyZXR1cm4gdGhpcy5zZXQzZihjLHIvMjU1LjAsZy8yNTUuMCxiLzI1NS4wKTt9LFxuICAgIHNldDJpICAgIDogZnVuY3Rpb24oYyxrLGEpICAgIHtyZXR1cm4gdGhpcy5zZXQyZihjLGsvMjU1LjAsYSk7fSxcbiAgICBzZXQxaSAgICA6IGZ1bmN0aW9uKGMsaykgICAgICB7cmV0dXJuIHRoaXMuc2V0MWYoYyxrLzI1NS4wKTt9LFxuICAgIHRvQXJyYXkgIDogZnVuY3Rpb24oYykgICAgICAgIHtyZXR1cm4gYy50b0FycmF5KCk7fSxcbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKGMpICAgICAgICB7cmV0dXJuICdbJytjWzBdKycsJytjWzFdKycsJytjWzJdKycsJytjWzNdKyddJzt9LFxuXG4gICAgaW50ZXJwb2xhdGVkIDogZnVuY3Rpb24oYzAsYzEsZilcbiAgICB7XG4gICAgICAgIHZhciBjICA9IG5ldyBGbG9hdDMyQXJyYXkoNCksXG4gICAgICAgICAgICBmaSA9IDEuMCAtIGY7XG5cbiAgICAgICAgY1swXSA9IGMwWzBdICogZmkgKyBjMVswXSAqIGY7XG4gICAgICAgIGNbMV0gPSBjMFsxXSAqIGZpICsgYzFbMV0gKiBmO1xuICAgICAgICBjWzJdID0gYzBbMl0gKiBmaSArIGMxWzJdICogZjtcbiAgICAgICAgY1szXSA9IGMwWzNdICogZmkgKyBjMVszXSAqIGY7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG59OyIsInZhciBWZWMyICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzInKSxcbiAgICBrRXJyb3IgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRXJyb3InKTtcblxuZnVuY3Rpb24gTW91c2UoKVxue1xuICAgIGlmKE1vdXNlLl9faW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKGtFcnJvci5DTEFTU19JU19TSU5HTEVUT04pO1xuXG4gICAgdGhpcy5fcG9zaXRpb24gICAgID0gVmVjMi5tYWtlKCk7XG4gICAgdGhpcy5fcG9zaXRpb25MYXN0ID0gVmVjMi5tYWtlKCk7XG5cbiAgICBNb3VzZS5fX2luc3RhbmNlID0gdGhpcztcbn1cblxuTW91c2UucHJvdG90eXBlLmdldFBvc2l0aW9uICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0UG9zaXRpb25MYXN0ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0O307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WCAgICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25bMF07fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRZICAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvblsxXTt9O1xuTW91c2UucHJvdG90eXBlLmdldFhMYXN0ICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uTGFzdFswXTt9O1xuTW91c2UucHJvdG90eXBlLmdldFlMYXN0ICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uTGFzdFsxXTt9O1xuXG5Nb3VzZS5fX2luc3RhbmNlID0gbnVsbDtcbk1vdXNlLmdldEluc3RhbmNlID0gZnVuY3Rpb24oKXtyZXR1cm4gTW91c2UuX2luc3RhbmNlO307XG5cbm1vZHVsZS5leHBvcnRzID0gTW91c2U7IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIHRvQXJyYXkgOiBmdW5jdGlvbihmbG9hdDMyQXJyYXkpe3JldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmbG9hdDMyQXJyYXkpO31cbn07IiwidmFyIEdMS2l0ID0gcmVxdWlyZSgnLi4vLi4vLi4vc3JjL2dsS2l0L2dsS2l0LmpzJyk7XG5cbmZ1bmN0aW9uIEFwcCgpXG57XG4gICAgR0xLaXQuQXBwbGljYXRpb24uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zZXRGdWxsV2luZG93RnJhbWUodHJ1ZSk7XG5cbiAgICB0aGlzLnNldFRhcmdldEZQUyg2MCk7XG4gICAgdGhpcy5zZXRTaXplKDgwMCw2MDApO1xufVxuXG5BcHAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHTEtpdC5BcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xuXG5BcHAucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24oKXt9O1xuXG5BcHAucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIga2dsID0gdGhpcy5rZ2w7XG4gICAgdmFyIGNhbSA9IHRoaXMuY2FtZXJhO1xuXG4gICAgdmFyIHRpbWUgPSB0aGlzLmdldFNlY29uZHNFbGFwc2VkKCksXG4gICAgICAgIHpvb20gPSAxICsgTWF0aC5zaW4odGltZSkgKiAwLjI1O1xuXG4gICAga2dsLmNsZWFyM2YoMC4xLDAuMSwwLjEpO1xuICAgIGtnbC5sb2FkSWRlbnRpdHkoKTtcblxuICAgIGNhbS5zZXRQb3NpdGlvbjNmKE1hdGguY29zKHRpbWUpKk1hdGguUEkqem9vbSx6b29tLE1hdGguc2luKHRpbWUpKk1hdGguUEkqem9vbSk7XG4gICAgY2FtLnVwZGF0ZU1hdHJpY2VzKCk7XG5cbiAgICB0aGlzLmRyYXdTeXN0ZW0oKTtcbn07XG5cbkFwcC5wcm90b3R5cGUuZHJhd1N5c3RlbSA9ICBmdW5jdGlvbigpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMua2dsO1xuXG4gICAga2dsLmNvbG9yMWYoMC4yNSk7XG4gICAgR0xLaXQua0dMVXRpbC5kcmF3R3JpZChrZ2wsOCwxKTtcbiAgICBHTEtpdC5rR0xVdGlsLmRyYXdHcmlkQ3ViZShrZ2wsOCwxKTtcbiAgICBHTEtpdC5rR0xVdGlsLmRyYXdBeGVzKGtnbCw0KTtcbn07XG5cbnZhciBhcHAgPSBuZXcgQXBwKCk7XG4iLG51bGxdfQ==
;