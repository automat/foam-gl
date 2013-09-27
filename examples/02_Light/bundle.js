;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GLKit = require('.././foam.js');

function App()
{
    GLKit.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(800,600);
}

App.prototype = Object.create(GLKit.Application.prototype);

App.prototype.setup = function()
{
    var kgl = this.kgl;

    var light0 = this._light0 = new GLKit.Light(kgl.LIGHT_0);
        light0.setAmbient3f(0,0,0);
        light0.setDiffuse3f(0.8,0.8,0.8);
        light0.setSpecular3f(1,1,1);
        light0.setPosition3f(1,1,1);

    var light1 = this._light1 = new GLKit.Light(kgl.LIGHT_1);
        light1.setAmbient3f(0,0,0);
        light1.setDiffuse3f(0.8,0.8,0.8);
        light1.setSpecular3f(1,1,1);
        light1.setPosition3f(1,1,1);

    var material = this._material0 = new GLKit.Material();
        material.setDiffuse3f(0.7,0.7,0.7);
        material.setAmbient3f(0.7,0.7,0.7);
        material.setSpecular3f(1,1,1);
        material.shininess = 20.0;


};

App.prototype.update = function()
{
    var kgl = this.kgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 3 + Math.sin(time) * 0.25;

    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    cam.setPosition3f(Math.cos(time)*Math.PI*zoom,zoom,Math.sin(time)*Math.PI*zoom);
    cam.updateMatrices();

    kgl.drawMode(kgl.LINE_LOOP);
    this.drawSystem();

    var glMath = GLKit.Math;

    var material = this._material0;


    var light0 = this._light0,
        light1 = this._light1;


    //Foam.GLUtil.drawVector(gl,light0.position,Foam.Vec3.added(light0.position,light0TargetPos));
    var lightTargetPos = GLKit.Vec3.make(Math.sin(time*0.25)*8 + 0.5,Math.sin(time*0.05),0.5);
    light0.setPosition(lightTargetPos);


    lightTargetPos[0] = Math.cos(time*0.75)*8;
    lightTargetPos[1] = 1;
    lightTargetPos[2] = Math.sin(time*0.75)*8;

    light1.setPosition(lightTargetPos);
    light1.constantAttentuation = Math.abs(Math.sin(time*10));

    kgl.useLighting(true);
    kgl.light(light0);
    kgl.light(light1);

    kgl.useMaterial(true);
    kgl.drawMode(kgl.TRIANGLES);


    var len = 100;
    var i = -1,j;

    var il,jl;

    var d;

    while(++i <= len)
    {
        j = -1;
        while(++j <=  len)
        {
            il = i / len;
            jl = j / len;

            material.setAmbient3f(il,0,jl);
            material.setDiffuse3f(il,0,jl);
            kgl.material(material);
            kgl.drawMode(kgl.TRIANGLES);

            il -= 0.5;
            jl -= 0.5;

            kgl.pushMatrix();
            kgl.translate3f(jl * len,0,il * len);

            kgl.cube(0.9);
            kgl.popMatrix();
        }
    }




    kgl.useMaterial(false);
    kgl.useLighting(false);

    kgl.drawMode(kgl.LINES);
    kgl.color1f(1.0);

    len = 100;
    i = -1;

    var temp0,temp1;
    var x0,y0,x1,y1;

    while(++i < len)
    {

        temp0 = time * 0.75 - Math.PI*0.75 / len - i/len * Math.PI * 0.75;

        x0 = Math.cos(temp0) * 8;
        y0 = Math.sin(temp0) * 8;

        temp1 = temp0 + 0.01;//+ Math.PI * 0.5 / len;

        x1 = Math.cos(temp1) * 8;
        y1 = Math.sin(temp1) * 8;

        kgl.linef(x0,light1.position[1],y0,x1,light1.position[1],y1);

    }
};

App.prototype.drawSystem =  function()
{
    var kgl = this.kgl;

    kgl.color1f(0.25);
    GLKit.fGLUtil.drawGrid(kgl,8,1);
    GLKit.fGLUtil.drawGridCube(kgl,8,1);
    GLKit.fGLUtil.drawAxes(kgl,4);

    //kgl.drawMode(kgl.TRIANGLES);
    kgl.color1f(1);
    kgl.pushMatrix();
    {
        kgl.translate(this._light0.position);
        GLKit.fGLUtil.octahedron(kgl,0.075);
    }
    kgl.popMatrix();

    kgl.pushMatrix();
    {
        kgl.translate(this._light1.position);
        GLKit.fGLUtil.octahedron(kgl,0.075);
    }
    kgl.popMatrix();
};

var app = new App();

},{"../../src/glKit/glKit.js":15}],2:[function(require,module,exports){
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
},{"../system/glkDefault":37,"../system/glkError":38}],3:[function(require,module,exports){
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




},{"../graphics/glkCameraBasic":27,"../graphics/glkGL":28,"../system/glkDefault":37,"../system/glkError":38,"./glkAppImpl":2,"plask":43}],4:[function(require,module,exports){
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


},{"../graphics/glkCameraBasic":27,"../graphics/glkGL":28,"../system/glkDefault":37,"./glkAppImpl":2}],5:[function(require,module,exports){
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






},{"../graphics/glkCameraBasic":27,"../system/glkError":38,"../system/glkPlatform":39,"../util/glkMouse":41,"./glkAppImplPlask":3,"./glkAppImplWeb":4}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
var Geom3d = require('./glkGeom3d');

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

},{"./glkGeom3d":6}],8:[function(require,module,exports){
var Vec3   = require('../math/glkVec3'),
    Vec4   = require('../math/glkVec4'),
    Geom3d = require('./glkGeom3d');


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
},{"../math/glkVec3":35,"../math/glkVec4":36,"./glkGeom3d":6}],9:[function(require,module,exports){

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
},{}],10:[function(require,module,exports){



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


},{}],11:[function(require,module,exports){
var Geom3d = require('./glkGeom3d'),
    Mat44  = require('../math/glkMat44'),
    Vec3   = require('../math/glkVec3');

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
    gl.drawElements(this.vertices,this.normals,gl.fillColorBuffer(gl.getColorBuffer(),this.colors),this.texCoords,indices,gl.getDrawMode(),count || indices.length, offset || 0 );
};

module.exports = LineBuffer3d;

},{"../math/glkMat44":31,"../math/glkVec3":35,"./glkGeom3d":6}],12:[function(require,module,exports){
var Vec2   = require('../math/glkVec2'),
    Vec3   = require('../math/glkVec3'),
    Color  = require('../util/glkColor'),
    Geom3d = require('./glkGeom3d');

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


},{"../math/glkVec2":34,"../math/glkVec3":35,"../util/glkColor":40,"./glkGeom3d":6}],13:[function(require,module,exports){
var kMath      = require('../math/glkMath'),
    Line2dUtil = require('./glkLine2dUtil');

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

        tolerance = tolerance || kMath.EPSILON;

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
},{"../math/glkMath":32,"./glkLine2dUtil":9}],14:[function(require,module,exports){
var kMath = require('../math/glkMath'),
    Vec3  = require('../math/glkVec3'),
    Mat44 = require('../math/glkMat44');

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
        hermiteIntrpl = kMath.hermiteIntrpl;

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



},{"../math/glkMat44":31,"../math/glkMath":32,"../math/glkVec3":35}],15:[function(require,module,exports){
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
    fGL         : require('./graphics/glkGL'),

    Mouse       : require('./util/glkMouse'),
    Color       : require('./util/glkColor'),
    Util        : require('./util/glkUtil'),

    Platform    : require('./system/glkPlatform'),

    Geom3d            : require('./geom/glkGeom3d'),
    ParametricSurface : require('./geom/glkParametricSurface'),
    ISOSurface        : require('./geom/glkISOSurface'),
    ISOBand           : require('./geom/glkISOBand'),
    LineBuffer2d      : require('./geom/glkLineBuffer2d'),
    LineBuffer3d      : require('./geom/glkLineBuffer3d'),
    Spline            : require('./geom/glkSpline'),
    Line2dUtil        : require('./geom/glkLine2dUtil'),
    Polygon2dUtil     : require('./geom/glkPolygon2dUtil'),


    Application : require('./app/glkApplication')

};


},{"./app/glkApplication":5,"./geom/glkGeom3d":6,"./geom/glkISOBand":7,"./geom/glkISOSurface":8,"./geom/glkLine2dUtil":9,"./geom/glkLineBuffer2d":10,"./geom/glkLineBuffer3d":11,"./geom/glkParametricSurface":12,"./geom/glkPolygon2dUtil":13,"./geom/glkSpline":14,"./graphics/gl/glkDirectionalLight":16,"./graphics/gl/glkLight":17,"./graphics/gl/glkMatGL":18,"./graphics/gl/glkMaterial":19,"./graphics/gl/glkPointLight":20,"./graphics/gl/glkSpotLight":21,"./graphics/gl/glkTexture":22,"./graphics/gl/shader/glkProgLoader":24,"./graphics/gl/shader/glkShaderLoader":26,"./graphics/glkCameraBasic":27,"./graphics/glkGL":28,"./graphics/util/glkGLUtil":29,"./math/glkMat33":30,"./math/glkMat44":31,"./math/glkMath":32,"./math/glkQuaternion":33,"./math/glkVec2":34,"./math/glkVec3":35,"./math/glkVec4":36,"./system/glkPlatform":39,"./util/glkColor":40,"./util/glkMouse":41,"./util/glkUtil":42}],16:[function(require,module,exports){
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
},{"../../math/glkVec3":35,"./glkLight":17}],17:[function(require,module,exports){
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
},{"../../math/glkVec3":35,"../../math/glkVec4":36}],18:[function(require,module,exports){
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
},{"../../math/glkMat44":31}],19:[function(require,module,exports){
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

},{"../../util/glkColor":40}],20:[function(require,module,exports){
var Light = require('./glkLight');

function PointLight(id)
{
    Light.apply(this,arguments);
}

PointLight.prototype = Object.create(Light.prototype);

module.exports = PointLight;
},{"./glkLight":17}],21:[function(require,module,exports){
var DirectionalLight = require('./glkDirectionalLight');

function SpotLight(id)
{
    DirectionalLight.apply(this,arguments);
}

SpotLight.prototype = Object.create(DirectionalLight.prototype);

SpotLight.prototype.setExponent = function(){};
SpotLight.prototype.setCutOff   = function(){};

module.exports = SpotLight;
},{"./glkDirectionalLight":16}],22:[function(require,module,exports){

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
},{}],23:[function(require,module,exports){
module.exports ="varying vec4 vVertexPosition;varying vec3 vVertexNormal;varying vec4 vVertexColor;varying vec2 vVertexTexCoord;uniform float uUseLighting;uniform float uUseMaterial;uniform float uUseTexture;uniform mat3 uNormalMatrix;uniform vec3 uAmbient;uniform sampler2D uTexImage;const int MAX_LIGHTS = 8;struct Light{ vec4 position; vec3 ambient; vec3 diffuse; vec3 specular; vec4 halfVector; vec3 spotDirection; float spotExponent; float spotCutoff; float spotCosCutoff; float constantAttenuation; float linearAttenuation; float quadraticAttenuation;};struct Material{ vec4 emission; vec4 ambient; vec4 diffuse; vec4 specular; float shininess;};struct ColorComponent{ vec4 ambient; vec4 diffuse; vec4 specular; float shininess;};vec4 phongModel(vec4 position, vec3 normal, ColorComponent color, Light light){ vec3 diff = light.position.xyz - position.xyz; vec3 s = normalize(diff); vec3 v = normalize(-position.xyz); vec3 r = reflect(-s, normal); float sDotN = max(dot(s, normal), 0.0); float dist = length(diff.xyz); float att = 1.0 / (light.constantAttenuation + light.linearAttenuation * dist + light.quadraticAttenuation * dist * dist); vec3 ambient = uAmbient * light.ambient * color.ambient.rgb; vec3 diffuse = light.diffuse * color.diffuse.rgb * sDotN ; vec3 specular = ((sDotN > 0.0) ? light.specular * pow(max(dot(r, v), 0.0), color.shininess) : vec3(0.0)); return vec4(ambient*att+ diffuse*att + specular*att,color.ambient.a);}uniform Light uLights[8];uniform Material uMaterial;void main(void){ float useLightingInv = 1.0 - uUseLighting; float useMaterialInv = 1.0 - uUseMaterial; float useTextureInv = 1.0 - uUseTexture; vec3 tVertexNormal = (gl_FrontFacing ? -1.0 : 1.0) * normalize(uNormalMatrix * vVertexNormal); vec4 vertexColor = vVertexColor * useMaterialInv; vec4 textureColor = texture2D(uTexImage,vVertexTexCoord); vec4 resultColor = vertexColor * useTextureInv + textureColor * uUseTexture; ColorComponent color = ColorComponent(uMaterial.ambient * uUseMaterial + resultColor, uMaterial.diffuse * uUseMaterial + resultColor, uMaterial.specular * uUseMaterial + resultColor, uMaterial.shininess * uUseMaterial + useMaterialInv); vec4 lightingColor = vec4(0,0,0,0); for(int i = 0;i < MAX_LIGHTS;i++) { lightingColor+=phongModel(vVertexPosition,tVertexNormal,color,uLights[i]); } gl_FragColor = uUseLighting * lightingColor + useLightingInv * (vVertexColor * useTextureInv + textureColor * uUseTexture);}";
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
module.exports ="attribute vec3 aVertexPosition;attribute vec3 aVertexNormal;attribute vec4 aVertexColor;attribute vec2 aVertexTexCoord;varying vec4 vVertexPosition;varying vec3 vVertexNormal;varying vec4 vVertexColor;varying vec2 vVertexTexCoord;uniform mat4 uModelViewMatrix;uniform mat4 uProjectionMatrix;uniform float uPointSize;void main(void){ vVertexPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0); vVertexNormal = aVertexNormal; vVertexColor = aVertexColor; vVertexTexCoord = aVertexTexCoord; gl_Position = uProjectionMatrix * vVertexPosition; gl_PointSize = uPointSize;}";
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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



},{"../math/glkMat44":31,"../math/glkVec3":35,"./gl/glkMatGL":18}],28:[function(require,module,exports){
var kError           = require('../system/glkError'),
    ProgVertexShader = require('./gl/shader/glkProgVertexShader'),
    ProgFragShader   = require('./gl/shader/glkProgFragShader'),
    ProgLoader       = require('./gl/shader/glkProgLoader'),
    ShaderLoader     = require('./gl/shader/glkShaderLoader'),
    Platform         = require('../system/glkPlatform'),
    Vec2             = require('../math/glkVec2'),
    Vec3             = require('../math/glkVec3'),
    Vec4             = require('../math/glkVec4'),
    Mat33            = require('../math/glkMat33'),
    Mat44            = require('../math/glkMat44'),
    Color            = require('../util/glkColor');


function kGL(context3d,context2d)
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
    this._bUseBillboarding     = false;
    this._bUseBillboardingLast = false;

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

    this._bVertexCube   = new Float32Array([-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5]);
    this._bColorCube    = new Float32Array(this._bVertexCube.length / SIZE_OF_VERTEX * SIZE_OF_COLOR);
    this._bNormalCube   = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] );
    this._bIndexCube    = new Uint16Array([  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9,10, 8,10,11, 12,13,14,12,14,15, 16,17,18,16,18,19, 20,21,22,20,22,23]);
    this._bTexCoordCube = null;

    this._circleDetailLast = 10.0;
    this._sphereDetailLast = 10.0;

    this._bVertexSphere    = null;
    this._bNormalSphere    = null;
    this._bColorSphere     = null;
    this._bIndexSphere     = null;
    this._bTexCoordsSphere = null;

    this._bVertexCylinder    = null;
    this._bNormalCylinder    = null;
    this._bColorCylinder     = null;
    this._bIndexCylinder     = null;
    this._bTexCoordsCylinder = null;

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

kGL.prototype.useLighting  = function(bool){this.gl.uniform1f(this._uUseLighting,bool ? 1.0 : 0.0);this._bUseLighting = bool;};
kGL.prototype.getLighting  = function()    {return this._bUseLighting;};

kGL.prototype.light = function(light)
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
kGL.prototype.disableLight = function(light)
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

kGL.prototype.useTexture  = function(bool){this.gl.uniform1f(this._uUseTexture, bool ? 1.0 : 0.0);};

kGL.prototype.loadTextureWithImage = function(img)
{
    var gl = this.gl,
        glTex = gl.createTexture();
    glTex.image = img;

    var tex = new GLKit.Texture(glTex);
    this._bindTexImage(tex._tex);

    return tex;

};

kGL.prototype.loadTexture = function(src,texture,callback)
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

kGL.prototype._bindTexImage = function(glTex)
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

kGL.prototype.texture = function(texture)
{
    var gl = this.gl;

    this._tex = texture._tex;
    gl.bindTexture(gl.TEXTURE_2D,this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._texMode );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._texMode );
    gl.uniform1i(this._uTexImage,0);
};

kGL.prototype.disableTextures = function()
{
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D,this._texEmpty);
    gl.vertexAttribPointer(this._aTexCoord,GLKit.Vec2.SIZE,gl.FLOAT,false,0,0);
    gl.uniform1f(this._uUseTexture,0.0);
};

/*---------------------------------------------------------------------------------------------------------*/
// Material
/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.useMaterial = function(bool){this.gl.uniform1f(this._uUseMaterial,bool ? 1.0 : 0.0);};

kGL.prototype.material = function(material)
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

kGL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack
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

    if(!this._bUseLighting)return;

    Mat44.toMat33Inversed(this._mModelView,this._mNormal);
    Mat33.transpose(this._mNormal,this._mNormal);

    gl.uniformMatrix3fv(this._uNormalMatrix,false,this._mNormal);
};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack transformations
/*---------------------------------------------------------------------------------------------------------*/

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
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/


kGL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexArray,mode,count,offset,type,drawType)
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


kGL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{

    this.bufferArrays(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    this.gl.drawArrays(mode  || this._drawMode,
                       first || 0,
                       count || vertexFloat32Array.length / this.SIZE_OF_VERTEX);
};

kGL.prototype.drawGeometry = function(geom,count,offset) {geom._draw(this,count,offset);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience filling default vbo
/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.bufferArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordFloat32Array,glDrawMode)
{
    var na = normalFloat32Array   ? true : false,
        ta = texCoordFloat32Array ? true : false;

    var aVertexNormal   = this._aVertexNormal,
        aVertexTexCoord = this._aVertexTexCoord;

    var gl            = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    glDrawMode = glDrawMode || gl.DYNAMIC_DRAW;

    var vblen =      vertexFloat32Array.byteLength,
        nblen = na ? normalFloat32Array.byteLength : 0,
        cblen =      colorFloat32Array.byteLength,
        tblen = ta ? texCoordFloat32Array.byteLength : 0;

    var offsetV = 0,
        offsetN = offsetV + vblen,
        offsetC = offsetN + nblen,
        offsetT = offsetC + cblen;

    gl.bufferData(glArrayBuffer, vblen + nblen + cblen + tblen, glDrawMode);

    gl.bufferSubData(glArrayBuffer, offsetV, vertexFloat32Array);
    gl.bufferSubData(glArrayBuffer, offsetC, colorFloat32Array);

    if(!na){ gl.disableVertexAttribArray(aVertexNormal);}
    else
    {
        gl.enableVertexAttribArray(aVertexNormal);
        gl.bufferSubData(glArrayBuffer,offsetN,normalFloat32Array);
        gl.vertexAttribPointer(aVertexNormal,this.SIZE_OF_NORMAL,glFloat,false,0,offsetN);
    }

    if(!ta){ gl.disableVertexAttribArray(aVertexTexCoord);}
    else
    {
        gl.enableVertexAttribArray(aVertexTexCoord);
        gl.bufferSubData(glArrayBuffer,offsetN,texCoordFloat32Array);
        gl.vertexAttribPointer(aVertexTexCoord,this.SIZE_OF_TEX_COORD,glFloat,false,0,offsetT);
    }


    gl.vertexAttribPointer(this._aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);
    gl.vertexAttribPointer(this._aVertexColor,    this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);
};


kGL.prototype.bufferColors = function(color,buffer)
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
            throw new Error(kError.COLORS_IN_WRONG_SIZE);
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

kGL.prototype.bufferVertices = function(vertices,buffer)
{
    if(vertices.length != buffer.length)throw (kError.VERTICES_IN_WRONG_SIZE + buffer.length + '.');
    var i = -1;while(++i < buffer.length)buffer[i] = vertices[i];
    return buffer;
};

/*---------------------------------------------------------------------------------------------------------*/
// Convenience Methods color
/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.ambient   = function(color){this.gl.uniform3f(this._uAmbient,color[0],color[1],color[2]);};
kGL.prototype.ambient3f = function(r,g,b){this.gl.uniform3f(this._uAmbient,r,g,b);};
kGL.prototype.ambient1f = function(k)    {this.gl.uniform1f(this._uAmbient,k);};

kGL.prototype.color   = function(color)  {this._bColor = Color.set(this._bColor4f,color);};
kGL.prototype.color4f = function(r,g,b,a){this._bColor = Color.set4f(this._bColor4f,r,g,b,a);};
kGL.prototype.color3f = function(r,g,b)  {this._bColor = Color.set3f(this._bColor4f,r,g,b);};
kGL.prototype.color2f = function(k,a)    {this._bColor = Color.set2f(this._bColor4f,k,a);};
kGL.prototype.color1f = function(k)      {this._bColor = Color.set1f(this._bColor4f,k);};
kGL.prototype.colorfv = function(array)  {this._bColor = array;};

kGL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
kGL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
kGL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
kGL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
kGL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
kGL.prototype.clear4f   = function(r,g,b,a)
{
    var c  = Color.set4f(this._bColorBg4f,r,g,b,a);
    var gl = this.gl;
    gl.clearColor(c[0],c[1],c[2],c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


kGL.prototype.getColorBuffer = function(){return this._bColor;};
kGL.prototype.getClearBuffer = function(){return this._bColorBg4f;};

/*---------------------------------------------------------------------------------------------------------*/
// Methods draw properties
/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.drawMode = function(mode){this._drawMode = mode;};
kGL.prototype.getDrawMode = function(){return this._drawMode;};

kGL.prototype.sphereDetail = function(detail)
{
    if(detail == this._sphereDetailLast)return;
    this._sphereDetailLast = detail;
    this._genSphere();
};

kGL.prototype.circleDetail = function(detail)
{
    if(detail == this._circleDetailLast )return;
    this._circleDetailLast  = Math.max(this.ELLIPSE_DETAIL_MIN,Math.min(detail,this.ELLIPSE_DETAIL_MAX));
    this._cirlceVertexCount = this._circleDetailLast * 3;
    this._genCircle();
};

kGL.prototype.lineWidth = function(size){this.gl.lineWidth(size);};

kGL.prototype.useBillboard = function(bool){this._bUseBillboarding = bool;};
kGL.prototype.pointSize = function(value){this.gl.uniform1f(this._uPointSize,value);};


/*---------------------------------------------------------------------------------------------------------*/
// Methods draw primitives
/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.point = function(vector)
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
};

kGL.prototype.points = function(vertices,colors)
{
    if(vertices.length == 0)return;

    colors = colors || this.fillColorBuffer(this._bColor4f,new Float32Array(vertices.length / 3 * 4));

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
};

kGL.prototype.point3f = function(x,y,z){this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = z;this.point(this._bVertexPoint);};
kGL.prototype.point2f = function(x,y)  {this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = 0;this.point(this._bVertexPoint);};
kGL.prototype.pointv  = function(arr)  {this._bVertexPoint[0] = arr[0];this._bVertexPoint[1] = arr[1];this._bVertexPoint[2] = arr[2];this.point(this._bVertexPoint);};

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bVertexLine;
    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorLine),null,this._drawMode);
};

kGL.prototype.line  = function(vertices)
{
    if(vertices.length == 0)return;
    this.drawArrays(this.bufferArrays(vertices,this._bVertexLine),null,this.bufferColors(this._bColor,this._bColorLine),null,this._drawMode,0, 2);
};

kGL.prototype.linev = function(vertices)
{
    if(vertices.length == 0)return;
    var v = new Float32Array(vertices),
        l = vertices.length / this.SIZE_OF_VERTEX;
    this.drawArrays(v,null,this.bufferColors(this._bColor, new Float32Array(l*this.SIZE_OF_COLOR)),null,this._drawMode,0, l);
};

kGL.prototype.line2fv = function(v0,v1){this.linef(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.quadf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3)
{
    var v = this._bVertexQuad;

    v[ 0] = x0;v[ 1] = y0;v[ 2] = z0;
    v[ 3] = x1;v[ 4] = y1;v[ 5] = z1;
    v[ 6] = x2;v[ 7] = y2;v[ 8] = z2;
    v[ 9] = x3;v[10] = y3;v[11] = z3;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorQuad),null,this._drawMode,0,4);
};

kGL.prototype.quadv = function(v0,v1,v2,v3)
{
    this.quadf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2],v2[0],v2[1],v2[2],v3[0],v3[1],v3[2]);
};

kGL.prototype.quad = function(vertices,normals,texCoords){this.drawArrays(this.bufferArrays(vertices,this._bVertexQuad),normals,this.bufferColors(this._bColor,this._bColorQuad),texCoords,this._drawMode,0,4);};

/*---------------------------------------------------------------------------------------------------------*/

//TODO:cleanup
kGL.prototype.rect = function(width,height)
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
};

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.triangle = function(v0,v1,v2)
{
    var v = this._bVertexTriangle;
    v[0] = v0[0];v[1] = v0[1];v[2] = v0[2];
    v[3] = v1[0];v[4] = v1[1];v[5] = v1[2];
    v[6] = v2[0];v[7] = v2[1];v[8] = v2[2];

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);
};

kGL.prototype.trianglef = function(v0,v1,v2,v3,v4,v5,v6,v7,v8)
{
    var v = this._bVertexTriangle;
    v[0] = v0;v[1] = v1;v[2] = v2;
    v[3] = v3;v[4] = v4;v[5] = v5;
    v[6] = v6;v[7] = v7;v[8] = v8;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);
};

kGL.prototype.trianglev = function(vertices,normals,texCoords){this.drawArrays(this.bufferArrays(vertices,this._bVertexTriangle),normals,this.bufferColors(this._bColor,this._bColorTriangle),texCoords,this._drawMode,0,3);}

/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype.circle3f = function(x,y,z,radius)
{
    radius = radius || 0.5;

    this.pushMatrix();
    this.translate3f(x,y,z);
    this.scale1f(radius);
    this.drawArrays(this._bVertexCircle,this._bNormalCircle,this.bufferColors(this._bColor,this._bColorCircle),this._bTexCoordCircle,this.getDrawMode(),0,this._circleDetailLast);
    this.popMatrix();
};

kGL.prototype.cirlce2f = function(x,y,radius){this.circle3f(x,0,y,radius);};
kGL.prototype.circle = function(radius){this.circle3f(0,0,0,radius)};
kGL.prototype.circlev = function(v,radius){this.circle3f(v[0],v[1],v[2],radius);};
kGL.prototype.circles = function(centers,radii){};

/*---------------------------------------------------------------------------------------------------------*/
// Geometry gen
/*---------------------------------------------------------------------------------------------------------*/

kGL.prototype._genSphere = function()
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

    this._bVertexSphere    = new Float32Array(vertices);
    this._bNormalSphere    = new Float32Array(normals);
    this._bColorSphere     = new Float32Array(segments * segments * 4);
    this._bTexCoordsSphere = new Float32Array(indices);
    this._bIndexSphere     = new Uint16Array(indices);
};

kGL.prototype._genCircle = function()
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

kGL.prototype.getDefaultVBO  = function(){return this._defaultVBO;};
kGL.prototype.getDefaultIBO  = function(){return this._defaultIBO;};
kGL.prototype.bindDefaultVBO = function(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._defaultVBO);};
kGL.prototype.bindDefaultIBO = function(){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._defaultIBO);};

kGL.prototype.getDefaultVertexAttrib   = function(){return this._aVertexPosition;};
kGL.prototype.getDefaultNormalAttrib   = function(){return this._aVertexNormal;};
kGL.prototype.getDefaultColorAttrib    = function(){return this._aVertexColor;};
kGL.prototype.getDefaultTexCoordAttrib = function(){return this._aVertexTexCoord;};

kGL.prototype.enableDefaultVertexAttribArray     = function(){this.gl.enableVertexAttribArray(this._aVertexPosition);};
kGL.prototype.enableDefaultNormalAttribArray     = function(){this.gl.enableVertexAttribArray(this._aVertexNormal);};
kGL.prototype.enableDefaultColorAttribArray      = function(){this.gl.enableVertexAttribArray(this._aVertexColor);};
kGL.prototype.enableDefaultTexCoordsAttribArray  = function(){this.gl.enableVertexAttribArray(this._aVertexTexCoord);};

kGL.prototype.disableDefaultVertexAttribArray    = function(){this.gl.disableVertexAttribArray(this._aVertexPosition);};
kGL.prototype.disableDefaultNormalAttribArray    = function(){this.gl.disableVertexAttribArray(this._aVertexNormal);};
kGL.prototype.disableDefaultColorAttribArray     = function(){this.gl.disableVertexAttribArray(this._aVertexColor);};
kGL.prototype.disableDefaultTexCoordsAttribArray = function(){this.gl.disableVertexAttribArray(this._aVertexTexCoord);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/

//TODO:remove

kGL.prototype.box = function(width,height,depth)
{
    this.pushMatrix();
    this.scale3f(width,height,depth);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.bufferColors(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();
};

kGL.prototype.cube = function(size)
{
    this.pushMatrix();
    this.scale3f(size,size,size);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.bufferColors(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();
};

kGL.prototype.sphere = function()
{
    this.drawElements(this._bVertexSphere,this._bNormalSphere,this.bufferColors(this._bColor,this._bColorSphere),this._bTexCoordsSphere,this._bIndexSphere,this._drawMode);
};

//TODO: remove !!!!!!!!!!!!!!!
kGL.prototype.lineBox = function(v0,v1){this.lineBoxf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

kGL.prototype.lineBoxf = function(x0,y0,z0,x1,y1,z1)
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

kGL.prototype.enable                = function(id){this.gl.enable(id);};
kGL.prototype.disable               = function(id){this.gl.disable(id);};

kGL.prototype.blendColor            = function(r,g,b,a){this.gl.blendColor(r,g,b,a);};
kGL.prototype.blendEquation         = function(mode){this.gl.blendEquation(mode);};
kGL.prototype.blendEquationSeparate = function(sfactor,dfactor){this.gl.blendEquationSeparate(sfactor,dfactor);};
kGL.prototype.blendFunc             = function(sfactor,dfactor){this.gl.blendFunc(sfactor,dfactor);};
kGL.prototype.blendFuncSeparate     = function(srcRGB,dstRGB,srcAlpha,dstAlpha){this.gl.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);};
kGL.prototype.depthFunc             = function(func){this.gl.depthFunc(func);};
kGL.prototype.sampleCoverage        = function(value,invert){this.gl.sampleCoverage(value,invert);};
kGL.prototype.stencilFunc           = function(func,ref,mask){this.gl.stencilFunc(func,ref,mask);};
kGL.prototype.stencilFuncSeparate   = function(face,func,ref,mask){this.gl.stencilFuncSeparate(face,func,ref,mask);};
kGL.prototype.stencilOp             = function(fail,zfail,zpass){this.gl.stencilOp(fail,zfail,zpass);};
kGL.prototype.stencilOpSeparate     = function(face,fail,zfail,zpass){this.gl.stencilOpSeparate(face,fail,zfail,zpass);};

/*---------------------------------------------------------------------------------------------------------*/
// World -> Screen
/*---------------------------------------------------------------------------------------------------------*/

//TODO: Fix me
kGL.prototype.getScreenCoord3f = function(x,y,z)
{
    var mpm = Mat44.mult(this._camera.projectionMatrix,this._mModelView);
    var p3d = Mat44.multVec3(mpm,Vec3.make(x,y,z));

    var bsc = this._bScreenCoords;
    bsc[0] = (((p3d[0] + 1) * 0.5) * window.innerWidth);
    bsc[1] = (((1 - p3d[1]) * 0.5) * window.innerHeight);

    return bsc;
};

kGL.prototype.getScreenCoord = function(v)
{
    return this.getScreenCoord3f(v[0],v[1],v[1]);
};




kGL.prototype.getModelViewMatrix  = function(){return this._mModelView;};
kGL.prototype.getProjectionMatrix = function(){return this._camera.projectionMatrix;};







module.exports = kGL;
},{"../math/glkMat33":30,"../math/glkMat44":31,"../math/glkVec2":34,"../math/glkVec3":35,"../math/glkVec4":36,"../system/glkError":38,"../system/glkPlatform":39,"../util/glkColor":40,"./gl/shader/glkProgFragShader":23,"./gl/shader/glkProgLoader":24,"./gl/shader/glkProgVertexShader":25,"./gl/shader/glkShaderLoader":26}],29:[function(require,module,exports){
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


kGLUtil.pyramid = function(kgl,size)
{
    kgl.pushMatrix();
    kgl.scale3f(size,size,size);
    kgl.drawElements(this.__bVertexPyramid,this.__bNormalPyramid,kgl.bufferColors(kgl._bColor,this.__bColorPyramid),null,this.__bIndexPyramid,kgl._drawMode);
    kgl.popMatrix();
};



kGLUtil.octahedron = function(kgl,size)
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

kGLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
kGLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
kGLUtil.__bColorOctahedron  = new Float32Array(kGLUtil.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
kGLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);
kGLUtil.__bVertexPyramid    = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
kGLUtil.__bNormalPyramid    = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
kGLUtil.__bColorPyramid     = new Float32Array(kGLUtil.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
kGLUtil.__bIndexPyramid     = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);

module.exports = kGLUtil;
},{"../../math/glkVec3":35,"../../util/glkColor":40}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{"./glkMat44":31,"./glkMath":32}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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




},{}],36:[function(require,module,exports){

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
},{"../math/glkVec2":34,"../system/glkError":38}],42:[function(require,module,exports){
module.exports =
{
    toArray : function(float32Array){return Array.prototype.slice.call(float32Array);}
};
},{}],43:[function(require,module,exports){

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL2V4YW1wbGVzLzAyX0xpZ2h0L2FwcC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2FwcC9nbGtBcHBJbXBsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvYXBwL2dsa0FwcEltcGxQbGFzay5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2FwcC9nbGtBcHBJbXBsV2ViLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvYXBwL2dsa0FwcGxpY2F0aW9uLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ2VvbS9nbGtHZW9tM2QuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nZW9tL2dsa0lTT0JhbmQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nZW9tL2dsa0lTT1N1cmZhY2UuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nZW9tL2dsa0xpbmUyZFV0aWwuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nZW9tL2dsa0xpbmVCdWZmZXIyZC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrTGluZUJ1ZmZlcjNkLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ2VvbS9nbGtQYXJhbWV0cmljU3VyZmFjZS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrUG9seWdvbjJkVXRpbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrU3BsaW5lLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ2xLaXQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtEaXJlY3Rpb25hbExpZ2h0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrTGlnaHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtNYXRHTC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa01hdGVyaWFsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrUG9pbnRMaWdodC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa1Nwb3RMaWdodC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa1RleHR1cmUuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9zaGFkZXIvZ2xrUHJvZ0ZyYWdTaGFkZXIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9zaGFkZXIvZ2xrUHJvZ0xvYWRlci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL3NoYWRlci9nbGtQcm9nVmVydGV4U2hhZGVyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1NoYWRlckxvYWRlci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsa0NhbWVyYUJhc2ljLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2xrR0wuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy91dGlsL2dsa0dMVXRpbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrTWF0MzMuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa01hdDQ0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtNYXRoLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtRdWF0ZXJuaW9uLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtWZWMyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtWZWMzLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtWZWM0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvc3lzdGVtL2dsa0RlZmF1bHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9zeXN0ZW0vZ2xrRXJyb3IuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9zeXN0ZW0vZ2xrUGxhdGZvcm0uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC91dGlsL2dsa0NvbG9yLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvdXRpbC9nbGtNb3VzZS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L3V0aWwvZ2xrVXRpbC5qcyIsIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Q1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2MEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEdMS2l0ID0gcmVxdWlyZSgnLi4vLi4vc3JjL2dsS2l0L2dsS2l0LmpzJyk7XG5cbmZ1bmN0aW9uIEFwcCgpXG57XG4gICAgR0xLaXQuQXBwbGljYXRpb24uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zZXRGdWxsV2luZG93RnJhbWUodHJ1ZSk7XG5cbiAgICB0aGlzLnNldFRhcmdldEZQUyg2MCk7XG4gICAgdGhpcy5zZXRTaXplKDgwMCw2MDApO1xufVxuXG5BcHAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHTEtpdC5BcHBsaWNhdGlvbi5wcm90b3R5cGUpO1xuXG5BcHAucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLmtnbDtcblxuICAgIHZhciBsaWdodDAgPSB0aGlzLl9saWdodDAgPSBuZXcgR0xLaXQuTGlnaHQoa2dsLkxJR0hUXzApO1xuICAgICAgICBsaWdodDAuc2V0QW1iaWVudDNmKDAsMCwwKTtcbiAgICAgICAgbGlnaHQwLnNldERpZmZ1c2UzZigwLjgsMC44LDAuOCk7XG4gICAgICAgIGxpZ2h0MC5zZXRTcGVjdWxhcjNmKDEsMSwxKTtcbiAgICAgICAgbGlnaHQwLnNldFBvc2l0aW9uM2YoMSwxLDEpO1xuXG4gICAgdmFyIGxpZ2h0MSA9IHRoaXMuX2xpZ2h0MSA9IG5ldyBHTEtpdC5MaWdodChrZ2wuTElHSFRfMSk7XG4gICAgICAgIGxpZ2h0MS5zZXRBbWJpZW50M2YoMCwwLDApO1xuICAgICAgICBsaWdodDEuc2V0RGlmZnVzZTNmKDAuOCwwLjgsMC44KTtcbiAgICAgICAgbGlnaHQxLnNldFNwZWN1bGFyM2YoMSwxLDEpO1xuICAgICAgICBsaWdodDEuc2V0UG9zaXRpb24zZigxLDEsMSk7XG5cbiAgICB2YXIgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbDAgPSBuZXcgR0xLaXQuTWF0ZXJpYWwoKTtcbiAgICAgICAgbWF0ZXJpYWwuc2V0RGlmZnVzZTNmKDAuNywwLjcsMC43KTtcbiAgICAgICAgbWF0ZXJpYWwuc2V0QW1iaWVudDNmKDAuNywwLjcsMC43KTtcbiAgICAgICAgbWF0ZXJpYWwuc2V0U3BlY3VsYXIzZigxLDEsMSk7XG4gICAgICAgIG1hdGVyaWFsLnNoaW5pbmVzcyA9IDIwLjA7XG5cblxufTtcblxuQXBwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMua2dsO1xuICAgIHZhciBjYW0gPSB0aGlzLmNhbWVyYTtcblxuICAgIHZhciB0aW1lID0gdGhpcy5nZXRTZWNvbmRzRWxhcHNlZCgpLFxuICAgICAgICB6b29tID0gMyArIE1hdGguc2luKHRpbWUpICogMC4yNTtcblxuICAgIGtnbC5jbGVhcjNmKDAuMSwwLjEsMC4xKTtcbiAgICBrZ2wubG9hZElkZW50aXR5KCk7XG5cbiAgICBjYW0uc2V0UG9zaXRpb24zZihNYXRoLmNvcyh0aW1lKSpNYXRoLlBJKnpvb20sem9vbSxNYXRoLnNpbih0aW1lKSpNYXRoLlBJKnpvb20pO1xuICAgIGNhbS51cGRhdGVNYXRyaWNlcygpO1xuXG4gICAga2dsLmRyYXdNb2RlKGtnbC5MSU5FX0xPT1ApO1xuICAgIHRoaXMuZHJhd1N5c3RlbSgpO1xuXG4gICAgdmFyIGdsTWF0aCA9IEdMS2l0Lk1hdGg7XG5cbiAgICB2YXIgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbDA7XG5cblxuICAgIHZhciBsaWdodDAgPSB0aGlzLl9saWdodDAsXG4gICAgICAgIGxpZ2h0MSA9IHRoaXMuX2xpZ2h0MTtcblxuXG4gICAgLy9HTEtpdC5HTFV0aWwuZHJhd1ZlY3RvcihnbCxsaWdodDAucG9zaXRpb24sR0xLaXQuVmVjMy5hZGRlZChsaWdodDAucG9zaXRpb24sbGlnaHQwVGFyZ2V0UG9zKSk7XG4gICAgdmFyIGxpZ2h0VGFyZ2V0UG9zID0gR0xLaXQuVmVjMy5tYWtlKE1hdGguc2luKHRpbWUqMC4yNSkqOCArIDAuNSxNYXRoLnNpbih0aW1lKjAuMDUpLDAuNSk7XG4gICAgbGlnaHQwLnNldFBvc2l0aW9uKGxpZ2h0VGFyZ2V0UG9zKTtcblxuXG4gICAgbGlnaHRUYXJnZXRQb3NbMF0gPSBNYXRoLmNvcyh0aW1lKjAuNzUpKjg7XG4gICAgbGlnaHRUYXJnZXRQb3NbMV0gPSAxO1xuICAgIGxpZ2h0VGFyZ2V0UG9zWzJdID0gTWF0aC5zaW4odGltZSowLjc1KSo4O1xuXG4gICAgbGlnaHQxLnNldFBvc2l0aW9uKGxpZ2h0VGFyZ2V0UG9zKTtcbiAgICBsaWdodDEuY29uc3RhbnRBdHRlbnR1YXRpb24gPSBNYXRoLmFicyhNYXRoLnNpbih0aW1lKjEwKSk7XG5cbiAgICBrZ2wudXNlTGlnaHRpbmcodHJ1ZSk7XG4gICAga2dsLmxpZ2h0KGxpZ2h0MCk7XG4gICAga2dsLmxpZ2h0KGxpZ2h0MSk7XG5cbiAgICBrZ2wudXNlTWF0ZXJpYWwodHJ1ZSk7XG4gICAga2dsLmRyYXdNb2RlKGtnbC5UUklBTkdMRVMpO1xuXG5cbiAgICB2YXIgbGVuID0gMTAwO1xuICAgIHZhciBpID0gLTEsajtcblxuICAgIHZhciBpbCxqbDtcblxuICAgIHZhciBkO1xuXG4gICAgd2hpbGUoKytpIDw9IGxlbilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDw9ICBsZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlsID0gaSAvIGxlbjtcbiAgICAgICAgICAgIGpsID0gaiAvIGxlbjtcblxuICAgICAgICAgICAgbWF0ZXJpYWwuc2V0QW1iaWVudDNmKGlsLDAsamwpO1xuICAgICAgICAgICAgbWF0ZXJpYWwuc2V0RGlmZnVzZTNmKGlsLDAsamwpO1xuICAgICAgICAgICAga2dsLm1hdGVyaWFsKG1hdGVyaWFsKTtcbiAgICAgICAgICAgIGtnbC5kcmF3TW9kZShrZ2wuVFJJQU5HTEVTKTtcblxuICAgICAgICAgICAgaWwgLT0gMC41O1xuICAgICAgICAgICAgamwgLT0gMC41O1xuXG4gICAgICAgICAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICAgICAga2dsLnRyYW5zbGF0ZTNmKGpsICogbGVuLDAsaWwgKiBsZW4pO1xuXG4gICAgICAgICAgICBrZ2wuY3ViZSgwLjkpO1xuICAgICAgICAgICAga2dsLnBvcE1hdHJpeCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG4gICAga2dsLnVzZU1hdGVyaWFsKGZhbHNlKTtcbiAgICBrZ2wudXNlTGlnaHRpbmcoZmFsc2UpO1xuXG4gICAga2dsLmRyYXdNb2RlKGtnbC5MSU5FUyk7XG4gICAga2dsLmNvbG9yMWYoMS4wKTtcblxuICAgIGxlbiA9IDEwMDtcbiAgICBpID0gLTE7XG5cbiAgICB2YXIgdGVtcDAsdGVtcDE7XG4gICAgdmFyIHgwLHkwLHgxLHkxO1xuXG4gICAgd2hpbGUoKytpIDwgbGVuKVxuICAgIHtcblxuICAgICAgICB0ZW1wMCA9IHRpbWUgKiAwLjc1IC0gTWF0aC5QSSowLjc1IC8gbGVuIC0gaS9sZW4gKiBNYXRoLlBJICogMC43NTtcblxuICAgICAgICB4MCA9IE1hdGguY29zKHRlbXAwKSAqIDg7XG4gICAgICAgIHkwID0gTWF0aC5zaW4odGVtcDApICogODtcblxuICAgICAgICB0ZW1wMSA9IHRlbXAwICsgMC4wMTsvLysgTWF0aC5QSSAqIDAuNSAvIGxlbjtcblxuICAgICAgICB4MSA9IE1hdGguY29zKHRlbXAxKSAqIDg7XG4gICAgICAgIHkxID0gTWF0aC5zaW4odGVtcDEpICogODtcblxuICAgICAgICBrZ2wubGluZWYoeDAsbGlnaHQxLnBvc2l0aW9uWzFdLHkwLHgxLGxpZ2h0MS5wb3NpdGlvblsxXSx5MSk7XG5cbiAgICB9XG59O1xuXG5BcHAucHJvdG90eXBlLmRyYXdTeXN0ZW0gPSAgZnVuY3Rpb24oKVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLmtnbDtcblxuICAgIGtnbC5jb2xvcjFmKDAuMjUpO1xuICAgIEdMS2l0LmtHTFV0aWwuZHJhd0dyaWQoa2dsLDgsMSk7XG4gICAgR0xLaXQua0dMVXRpbC5kcmF3R3JpZEN1YmUoa2dsLDgsMSk7XG4gICAgR0xLaXQua0dMVXRpbC5kcmF3QXhlcyhrZ2wsNCk7XG5cbiAgICAvL2tnbC5kcmF3TW9kZShrZ2wuVFJJQU5HTEVTKTtcbiAgICBrZ2wuY29sb3IxZigxKTtcbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIHtcbiAgICAgICAga2dsLnRyYW5zbGF0ZSh0aGlzLl9saWdodDAucG9zaXRpb24pO1xuICAgICAgICBHTEtpdC5rR0xVdGlsLm9jdGFoZWRyb24oa2dsLDAuMDc1KTtcbiAgICB9XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICB7XG4gICAgICAgIGtnbC50cmFuc2xhdGUodGhpcy5fbGlnaHQxLnBvc2l0aW9uKTtcbiAgICAgICAgR0xLaXQua0dMVXRpbC5vY3RhaGVkcm9uKGtnbCwwLjA3NSk7XG4gICAgfVxuICAgIGtnbC5wb3BNYXRyaXgoKTtcbn07XG5cbnZhciBhcHAgPSBuZXcgQXBwKCk7XG4iLCJ2YXIgRGVmYXVsdCA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtEZWZhdWx0JyksXG4gICAgZ2xrRXJyb3IgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2dsa0Vycm9yJyk7XG5cbmZ1bmN0aW9uIEFwcEltcGwoKVxue1xuICAgIHRoaXMuX2NvbnRleHQzZCA9IG51bGw7XG4gICAgdGhpcy5fY29udGV4dDJkID0gbnVsbDtcblxuICAgIHRoaXMuX3dpbmRvd1RpdGxlICAgICAgID0gMDtcbiAgICB0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGZhbHNlO1xuICAgIHRoaXMuX2lzRnVsbHNjcmVlbiAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5faXNCb3JkZXJsZXNzICAgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwbGF5SWQgICAgICAgICA9IDA7XG5cbiAgICB0aGlzLl9rZXlEb3duICAgPSBmYWxzZTtcbiAgICB0aGlzLl9rZXlTdHIgICAgPSAnJztcbiAgICB0aGlzLl9rZXlDb2RlICAgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcblxuICAgIHRoaXMuX21vdXNlTW92ZSAgID0gZmFsc2U7XG4gICAgdGhpcy5fbW91c2VCb3VuZHMgPSB0cnVlO1xuXG4gICAgdGhpcy5fdGFyZ2V0RlBTICAgICA9IERlZmF1bHQuQVBQX0ZQUztcbiAgICB0aGlzLl9iVXBkYXRlICAgICAgID0gdHJ1ZTtcblxuICAgIHRoaXMuX2ZyYW1lcyAgICAgICAgPSAwO1xuICAgIHRoaXMuX2ZyYW1ldGltZSAgICAgPSAwO1xuICAgIHRoaXMuX2ZyYW1lbnVtICAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWUgICAgICAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWVTdGFydCAgICAgPSAtMTtcbiAgICB0aGlzLl90aW1lTmV4dCAgICAgID0gLTE7XG4gICAgdGhpcy5fdGltZUludGVydmFsICA9IHRoaXMuX3RhcmdldEZQUyAvIDEwMDAuMDtcbiAgICB0aGlzLl90aW1lRGVsdGEgICAgID0gMDtcblxuICAgIHRoaXMuX3dpZHRoICA9IC0xO1xuICAgIHRoaXMuX2hlaWdodCA9IC0xO1xuICAgIHRoaXMuX3JhdGlvICA9IC0xO1xuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IGZhbHNlO1xufVxuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0luaXRpYWxpemVkID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2lzSW5pdGlhbGl6ZWQ7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0VXBkYXRlICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2JVcGRhdGUgPSBib29sO307XG5cbkFwcEltcGwucHJvdG90eXBlLmluaXQgICAgPSBmdW5jdGlvbihhcHBPYmopICAgICAge3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodCl7dGhyb3cgbmV3IEVycm9yKGdsa0Vycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO307XG5cbkFwcEltcGwucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uKGJvb2wpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNGdWxsV2luZG93RnJhbWUgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lO307XG5cbkFwcEltcGwucHJvdG90eXBlLnNldEZ1bGxzY3JlZW4gPSBmdW5jdGlvbihib29sKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLmlzRnVsbHNjcmVlbiAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pc0Z1bGxzY3JlZW47fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lzQm9yZGVybGVzczt9XG5cbkFwcEltcGwucHJvdG90eXBlLnNldERpc3BsYXkgPSBmdW5jdGlvbihudW0pe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0RGlzcGxheSA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3BsYXlJZDt9XG5cblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKSAgICAgICAgICAgIHtyZXR1cm4gdGhpcy5fd2lkdGg7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCkgICAgICAgICAgICB7cmV0dXJuIHRoaXMuX2hlaWdodDt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0QXNwZWN0UmF0aW9XaW5kb3cgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yYXRpbzt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRUYXJnZXRGUFMgPSBmdW5jdGlvbihmcHMpe3RoaXMuX3RhcmdldEZQUyA9IGZwczt0aGlzLl90aW1lSW50ZXJ2YWwgID0gdGhpcy5fdGFyZ2V0RlBTIC8gMTAwMC4wO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRUYXJnZXRGUFMgPSBmdW5jdGlvbigpICAge3JldHVybiB0aGlzLl90YXJnZXRGUFM7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0V2luZG93VGl0bGUgICAgICAgPSBmdW5jdGlvbih0aXRsZSl7dGhpcy5fd2luZG93VGl0bGUgPSB0aXRsZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUucmVzdHJpY3RNb3VzZVRvRnJhbWUgPSBmdW5jdGlvbihib29sKSB7dGhpcy5fbW91c2VCb3VuZHMgPSBib29sO307XG5cbkFwcEltcGwucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWUgICAgICAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVTdGFydCAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVOZXh0ICAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRpbWVEZWx0YSAgICAgID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaXNLZXlEb3duICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa2V5RG93bjt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNNb3VzZURvd24gICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW91c2VEb3duO307XG5BcHBJbXBsLnByb3RvdHlwZS5pc01vdXNlTW92ZSAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tb3VzZU1vdmU7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleUNvZGUgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2tleUNvZGU7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldEtleVN0ciAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2tleVN0cjt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbW91c2VXaGVlbERlbHRhO307XG5cblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0TW91c2VMaXN0ZW5lclRhcmdldCA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIGZhbHNlO307XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCAgID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFBhcmVudCAgICAgICAgICAgICAgPSBmdW5jdGlvbigpICAge3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuc2V0UGFyZW50ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIGZhbHNlO307XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbDsiLCJ2YXIgRGVmYXVsdCAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRGVmYXVsdCcpLFxuICAgIGtFcnJvciAgICAgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2dsa0Vycm9yJyksXG4gICAga0dMICAgICAgICAgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtHTCcpLFxuICAgIEFwcEltcGwgICAgID0gcmVxdWlyZSgnLi9nbGtBcHBJbXBsJyksXG4gICAgQ2FtZXJhQmFzaWMgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtDYW1lcmFCYXNpYycpLFxuICAgIHBsYXNrICAgICAgID0gcmVxdWlyZSgncGxhc2snKTtcblxuZnVuY3Rpb24gQXBwSW1wbFBsYXNrKClcbntcbiAgICBBcHBJbXBsLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcbn1cblxuQXBwSW1wbFBsYXNrLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXBwSW1wbC5wcm90b3R5cGUpO1xuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQpXG57XG4gICAgaWYodGhpcy5faXNJbml0aWFsaXplZCl0aHJvdyBuZXcgRXJyb3Ioa0Vycm9yLlBMQVNLX1dJTkRPV19TSVpFX1NFVCk7XG5cbiAgICB0aGlzLl93aWR0aCAgPSB3aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fcmF0aW8gID0gd2lkdGggLyBoZWlnaHQ7XG59O1xuXG4vL1RPRE86IEZpeCB0aW1lIGRlbHRhLCBkb3VibGUgbWVhc3VyaW5nIG9mIHRpbWUgaW4gZ2VuZXJhbFxuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihhcHBPYmopXG57XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtb3VzZTtcbiAgICB2YXIgcHJldlRpbWUgPSAwLFxuICAgICAgICB0aW1lO1xuXG4gICAgcGxhc2suc2ltcGxlV2luZG93KHtcblxuICAgICAgICBzZXR0aW5nczpcbiAgICAgICAge1xuICAgICAgICAgICAgd2lkdGg6ICAgICAgIHNlbGYuX3dpZHRoICB8fCBEZWZhdWx0LkFQUF9XSURUSCxcbiAgICAgICAgICAgIGhlaWdodDogICAgICBzZWxmLl9oZWlnaHQgfHwgRGVmYXVsdC5BUFBfSEVJR0hULFxuICAgICAgICAgICAgdHlwZTogICAgICAgIERlZmF1bHQuQVBQX1BMQVNLX1RZUEUsXG4gICAgICAgICAgICB2c3luYzogICAgICAgRGVmYXVsdC5BUFBfUExBU0tfVlNZTkMsXG4gICAgICAgICAgICBtdWx0aXNhbXBsZTogRGVmYXVsdC5BUFBfUExBU0tfTVVMVElTQU1QTEUsXG4gICAgICAgICAgICBib3JkZXJsZXNzOiAgc2VsZi5faXNCb3JkZXJsZXNzLFxuICAgICAgICAgICAgZnVsbHNjcmVlbjogIHNlbGYuX2lzRnVsbHNjcmVlbixcbiAgICAgICAgICAgIHRpdGxlOiAgICAgICBzZWxmLl93aW5kb3dUaXRsZSB8fCBEZWZhdWx0LkFQUF9QTEFTS19XSU5ET1dfVElUTEVcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OmZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgYXBwT2JqLmtnbCAgICA9IG5ldyBrR0wodGhpcy5nbCxudWxsKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICAgICAgICAgIGFwcE9iai5rZ2wuc2V0Q2FtZXJhKGFwcE9iai5jYW1lcmEpO1xuICAgICAgICAgICAgYXBwT2JqLmNhbWVyYS5zZXRQZXJzcGVjdGl2ZShEZWZhdWx0LkNBTUVSQV9GT1YsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9ORUFSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9GQVIpO1xuXG4gICAgICAgICAgICBhcHBPYmouY2FtZXJhLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEudXBkYXRlTWF0cmljZXMoKTtcblxuICAgICAgICAgICAgaWYoc2VsZi5fYlVwZGF0ZSl0aGlzLmZyYW1lcmF0ZShzZWxmLl90YXJnZXRGUFMpO1xuICAgICAgICAgICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX3RpbWVTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBzZWxmLl90aW1lTmV4dCAgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdtb3VzZU1vdmVkJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBhcHBPYmoubW91c2UuX3Bvc2l0aW9uWzBdO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoubW91c2UuX3Bvc2l0aW9uTGFzdFsxXSA9IGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5fbW91c2VCb3VuZHMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMF0gPSBNYXRoLm1heCgwLE1hdGgubWluKGUueCxzZWxmLl93aWR0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvblsxXSA9IE1hdGgubWF4KDAsTWF0aC5taW4oZS55LHNlbGYuX2hlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvblswXSA9IGUueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV0gPSBlLnk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2xlZnRNb3VzZURvd24nLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZURvd24oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5vbignbGVmdE1vdXNlVXAnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VVcChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdzY3JvbGxXaGVlbCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX21vdXNlV2hlZWxEZWx0YSArPSBNYXRoLm1heCgtMSxNYXRoLm1pbigxLGUuZHkpKSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZVdoZWVsKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2tleVVwJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlTdHIgID0gZS5zdHI7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2tleUNvZGUgPSBlLmtleUNvZGU7XG4gICAgICAgICAgICAgICAgICAgIGFwcE9iai5vbktleVVwKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2tleURvd24nLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IGUuc3RyO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25LZXlEb3duKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHNlbGYuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYXc6ZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9mcmFtZW51bSAgPSB0aGlzLmZyYW1lbnVtO1xuICAgICAgICAgICAgdGltZSAgICAgICAgICAgID0gc2VsZi5fZnJhbWV0aW1lID0gdGhpcy5mcmFtZXRpbWU7XG5cbiAgICAgICAgICAgIG1vdXNlICAgICAgICAgICA9IGFwcE9iai5tb3VzZTtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlTW92ZSA9IG1vdXNlLl9wb3NpdGlvblswXSAhPSBtb3VzZS5fcG9zaXRpb25MYXN0WzBdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25bMV0gIT0gbW91c2UuX3Bvc2l0aW9uTGFzdFsxXTtcbiAgICAgICAgICAgIGFwcE9iai51cGRhdGUoKTtcbiAgICAgICAgICAgIHNlbGYuX3RpbWVEZWx0YSA9IHRpbWUgLSBwcmV2VGltZTtcbiAgICAgICAgICAgIHByZXZUaW1lID0gdGltZTtcblxuICAgICAgICB9fSk7XG59O1xuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZnJhbWV0aW1lO307XG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLmdldEZyYW1lc0VsYXBzZWQgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZnJhbWVudW07fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lRGVsdGE7fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lU3RhcnQ7fTtcblxuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5zZXRGdWxsV2luZG93RnJhbWUgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGJvb2w7cmV0dXJuIHRydWU7fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuc2V0RnVsbHNjcmVlbiAgICAgID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5faXNGdWxsc2NyZWVuID0gYm9vbDtyZXR1cm4gdHJ1ZTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzICAgICAgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0JvcmRlcmxlc3MgPSBib29sO3JldHVybiB0cnVlO307XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBJbXBsUGxhc2s7XG5cblxuXG4iLCJ2YXIgRGVmYXVsdCAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRGVmYXVsdCcpLFxuICAgIEFwcEltcGwgICAgID0gcmVxdWlyZSgnLi9nbGtBcHBJbXBsJyksXG4gICAga0dMICAgICAgICAgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtHTCcpLFxuICAgIENhbWVyYUJhc2ljID0gcmVxdWlyZSgnLi4vZ3JhcGhpY3MvZ2xrQ2FtZXJhQmFzaWMnKTtcblxuZnVuY3Rpb24gQXBwSW1wbFdlYigpXG57XG4gICAgQXBwSW1wbC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgY2FudmFzM2QgPSB0aGlzLl9jYW52YXMzZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjYW52YXMzZC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnMCcpO1xuICAgICAgICBjYW52YXMzZC5mb2N1cygpO1xuXG4gICAgdGhpcy5fY29udGV4dDNkID0gY2FudmFzM2QuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwid2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjYW52YXMzZC5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuXG4gICAgdmFyIGNhbnZhczJkID0gdGhpcy5fY2FudmFzMmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIHRoaXMuX3BhcmVudCAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX21vdXNlRXZlbnRUYXJnZXQgPSBjYW52YXMzZDtcbiAgICB0aGlzLl9rZXlFdmVudFRhcmdldCAgID0gY2FudmFzM2Q7XG5cbiAgICB0aGlzLl9jb250ZXh0MmQgPSBjYW52YXMyZC5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG59XG5cbkFwcEltcGxXZWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBJbXBsLnByb3RvdHlwZSk7XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uKCkgICB7cmV0dXJuIHRoaXMuX2NvbnRleHQzZC5wYXJlbnROb2RlO307XG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihvYmope3RoaXMuX3BhcmVudCA9IG9iajt9O1xuXG5cbkFwcEltcGxXZWIucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQpXG57XG4gICAgaWYodGhpcy5faXNGdWxsV2luZG93RnJhbWUpe3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDt9XG4gICAgaWYod2lkdGggPT0gdGhpcy5fd2lkdGggJiYgaGVpZ2h0ID09IHRoaXMuX2hlaWdodClyZXR1cm47XG5cbiAgICB0aGlzLl93aWR0aCAgPSB3aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fcmF0aW8gID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICBpZighdGhpcy5faXNJbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKGFwcE9iailcbntcbiAgICB2YXIgc2VsZiAgID0gdGhpcztcbiAgICB2YXIgbW91c2UgID0gYXBwT2JqLm1vdXNlO1xuICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMzZDtcblxuICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5fd2luZG93VGl0bGUgfHwgZG9jdW1lbnQudGl0bGU7XG5cbiAgICBpZighdGhpcy5fcGFyZW50KWRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBlbHNlIHRoaXMuX3BhcmVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgdGhpcy5fdXBkYXRlQ2FudmFzM2RTaXplKCk7XG5cbiAgICB2YXIgbW91c2VFdmVudFRhcmdldCA9IHRoaXMuX21vdXNlRXZlbnRUYXJnZXQsXG4gICAgICAgIGtleUV2ZW50VGFyZ2V0ICAgPSB0aGlzLl9rZXlFdmVudFRhcmdldDtcblxuXG4gICAgYXBwT2JqLmtnbCA9IG5ldyBrR0wodGhpcy5fY29udGV4dDNkLHRoaXMuX2NvbnRleHQyZCk7XG4gICAgYXBwT2JqLmtnbC5nbC52aWV3cG9ydCgwLDAsdGhpcy5fd2lkdGgsdGhpcy5faGVpZ2h0KTtcblxuICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICBhcHBPYmoua2dsLnNldENhbWVyYShhcHBPYmouY2FtZXJhKTtcbiAgICBhcHBPYmouY2FtZXJhLnNldFBlcnNwZWN0aXZlKERlZmF1bHQuQ0FNRVJBX0ZPVixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdC5DQU1FUkFfTkVBUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERlZmF1bHQuQ0FNRVJBX0ZBUik7XG4gICAgYXBwT2JqLmNhbWVyYS5zZXRUYXJnZXQzZigwLDAsMCk7XG4gICAgYXBwT2JqLmNhbWVyYS51cGRhdGVNYXRyaWNlcygpO1xuXG4gICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBtb3VzZS5fcG9zaXRpb25bMF07XG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25MYXN0WzFdID0gbW91c2UuX3Bvc2l0aW9uWzFdO1xuXG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25bMF0gPSBlLnBhZ2VYO1xuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzFdID0gZS5wYWdlWTtcblxuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VNb3ZlKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VEb3duKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZVVwKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgbW91c2VFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fbW91c2VXaGVlbERlbHRhICs9IE1hdGgubWF4KC0xLE1hdGgubWluKDEsIGUud2hlZWxEZWx0YSkpICogLTE7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZVdoZWVsKGUpO1xuICAgICAgICB9KTtcblxuXG4gICAga2V5RXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5fa2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgIHNlbGYuX2tleVN0ciAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSk7Ly9ub3QgcmVsaWFibGU7XG4gICAgICAgICAgICBhcHBPYmoub25LZXlEb3duKGUpO1xuXG4gICAgICAgIH0pO1xuXG4gICAga2V5RXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9rZXlEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcbiAgICAgICAgICAgIGFwcE9iai5vbktleVVwKGUpO1xuXG4gICAgICAgIH0pO1xuXG5cbiAgICB2YXIgZnVsbFdpbmRvd0ZyYW1lID0gdGhpcy5faXNGdWxsV2luZG93RnJhbWU7XG4gICAgdmFyIGNhbWVyYTtcbiAgICB2YXIgZ2w7XG5cbiAgICB2YXIgd2luZG93V2lkdGgsXG4gICAgICAgIHdpbmRvd0hlaWdodDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNhbWVyYVJhdGlvKClcbiAgICB7XG4gICAgICAgIGNhbWVyYSA9IGFwcE9iai5jYW1lcmE7XG4gICAgICAgIGNhbWVyYS5zZXRBc3BlY3RSYXRpbyhzZWxmLl9yYXRpbyk7XG4gICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlVmlld3BvcnRHTCgpXG4gICAge1xuICAgICAgICBnbCA9IGFwcE9iai5rZ2w7XG4gICAgICAgIGdsLmdsLnZpZXdwb3J0KDAsMCxzZWxmLl93aWR0aCxzZWxmLl9oZWlnaHQpO1xuICAgICAgICBnbC5jbGVhckNvbG9yKGdsLmdldENsZWFyQnVmZmVyKCkpO1xuICAgIH1cblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgICAgICBpZihmdWxsV2luZG93RnJhbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTaXplKHdpbmRvd1dpZHRoLHdpbmRvd0hlaWdodCk7XG5cbiAgICAgICAgICAgICAgICB1cGRhdGVDYW1lcmFSYXRpbygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVZpZXdwb3J0R0woKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXBwT2JqLm9uV2luZG93UmVzaXplKGUpO1xuXG4gICAgICAgICAgICBpZighZnVsbFdpbmRvd0ZyYW1lICYmIChzZWxmLl93aWR0aCA9PSB3aW5kb3dXaWR0aCAmJiBzZWxmLl9oZWlnaHQgPT0gd2luZG93SGVpZ2h0KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVDYW1lcmFSYXRpbygpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZVZpZXdwb3J0R0woKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICBpZih0aGlzLl9iVXBkYXRlKVxuICAgIHtcbiAgICAgICAgdmFyIHRpbWUsIHRpbWVEZWx0YTtcbiAgICAgICAgdmFyIHRpbWVJbnRlcnZhbCA9IHRoaXMuX3RpbWVJbnRlcnZhbDtcbiAgICAgICAgdmFyIHRpbWVOZXh0O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUsbnVsbCk7XG5cbiAgICAgICAgICAgIHRpbWUgICAgICA9IHNlbGYuX3RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdGltZURlbHRhID0gdGltZSAtIHNlbGYuX3RpbWVOZXh0O1xuXG4gICAgICAgICAgICBzZWxmLl90aW1lRGVsdGEgPSBNYXRoLm1pbih0aW1lRGVsdGEgLyB0aW1lSW50ZXJ2YWwsIDEpO1xuXG4gICAgICAgICAgICBpZih0aW1lRGVsdGEgPiB0aW1lSW50ZXJ2YWwpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGltZU5leHQgPSBzZWxmLl90aW1lTmV4dCA9IHRpbWUgLSAodGltZURlbHRhICUgdGltZUludGVydmFsKTtcblxuICAgICAgICAgICAgICAgIGFwcE9iai51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIHNlbGYuX3RpbWVFbGFwc2VkID0gKHRpbWVOZXh0IC0gc2VsZi5fdGltZVN0YXJ0KSAvIDEwMDAuMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9mcmFtZW51bSsrO1xuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKCk7XG5cbiAgICB9XG4gICAgZWxzZSBhcHBPYmoudXBkYXRlKCk7XG5cbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG59O1xuXG5cbkFwcEltcGxXZWIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihhcHBPYmopXG57XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpe3NlbGYuX2luaXQoYXBwT2JqKTt9KTtcbn07XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLl91cGRhdGVDYW52YXMzZFNpemUgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhczNkLFxuICAgICAgICB3aWR0aCAgPSB0aGlzLl93aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSB3aWR0aCAgKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgY2FudmFzLndpZHRoICAgICAgICA9IHdpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ICAgICAgID0gaGVpZ2h0O1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl90aW1lRWxhcHNlZDt9O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRNb3VzZUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24ob2JqKXt0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0ID0gb2JqO307XG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCAgID0gZnVuY3Rpb24ob2JqKXt0aGlzLl9rZXlFdmVudFRhcmdldCA9IG9iajt9O1xuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lID0gYm9vbDtyZXR1cm4gdHJ1ZTt9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbFdlYjtcblxuIiwidmFyIGtFcnJvciAgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtFcnJvcicpLFxuICAgIFBsYXRmb3JtICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtQbGF0Zm9ybScpLFxuICAgIEFwcEltcGxXZWIgICA9IHJlcXVpcmUoJy4vZ2xrQXBwSW1wbFdlYicpLFxuICAgIEFwcEltcGxQbGFzayA9IHJlcXVpcmUoJy4vZ2xrQXBwSW1wbFBsYXNrJyksXG4gICAgTW91c2UgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9nbGtNb3VzZScpLFxuICAgIENhbWVyYUJhc2ljICA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dsa0NhbWVyYUJhc2ljJyk7XG5cblxuZnVuY3Rpb24gQXBwbGljYXRpb24oKVxue1xuICAgIGlmKEFwcGxpY2F0aW9uLl9faW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKGtFcnJvci5DTEFTU19JU19TSU5HTEVUT04pO1xuXG4gICAgdmFyIHRhcmdldCAgPSBQbGF0Zm9ybS5nZXRUYXJnZXQoKTtcbiAgICBpZih0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyApdGhyb3cgbmV3IEVycm9yKGtFcnJvci5XUk9OR19QTEFURk9STSk7XG5cbiAgICB0aGlzLl9hcHBJbXBsID0gdGFyZ2V0ID09IFBsYXRmb3JtLldFQiAgID8gbmV3IEFwcEltcGxXZWIoYXJndW1lbnRzKSA6XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9PSBQbGF0Zm9ybS5QTEFTSyA/IG5ldyBBcHBJbXBsUGxhc2soYXJndW1lbnRzKSA6XG4gICAgICAgICAgICAgICAgICAgIG51bGw7XG5cbiAgICB0aGlzLm1vdXNlICA9IG5ldyBNb3VzZSgpO1xuICAgIHRoaXMua2dsICAgID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG5cbiAgICBBcHBsaWNhdGlvbi5fX2luc3RhbmNlID0gdGhpcztcbn1cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldHVwICA9IGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKGtFcnJvci5BUFBfTk9fU0VUVVApO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3Ioa0Vycm9yLkFQUF9OT19VUERBVEUpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24od2lkdGgsaGVpZ2h0KVxue1xuICAgIHZhciBhcHBJbXBsID0gdGhpcy5fYXBwSW1wbDtcbiAgICAgICAgYXBwSW1wbC5zZXRTaXplKHdpZHRoLGhlaWdodCk7XG5cbiAgICBpZighYXBwSW1wbC5pc0luaXRpYWxpemVkKCkpYXBwSW1wbC5pbml0KHRoaXMpO1xufTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRXaWR0aCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpZHRoKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEhlaWdodCgpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRVcGRhdGUgPSBmdW5jdGlvbihib29sKXt0aGlzLl9hcHBJbXBsLnNldFVwZGF0ZShib29sKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0V2luZG93VGl0bGUgICAgICAgPSBmdW5jdGlvbih0aXRsZSl7dGhpcy5fYXBwSW1wbC5zZXRXaW5kb3dUaXRsZSh0aXRsZSk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5yZXN0cmljdE1vdXNlVG9GcmFtZSA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9hcHBJbXBsLnJlc3RyaWN0TW91c2VUb0ZyYW1lKGJvb2wpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRGdWxsV2luZG93RnJhbWUgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbFdpbmRvd0ZyYW1lKGJvb2wpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0RnVsbHNjcmVlbiAgICAgICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEZ1bGxzY3JlZW4odHJ1ZSk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc0Z1bGxzY3JlZW4gICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNGdWxsc2NyZWVuKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0Qm9yZGVybGVzcyhib29sKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzQm9yZGVybGVzcyAgICAgICAgPSBmdW5jdGlvbigpICAgIHtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc0JvcmRlcmxlc3MoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldERpc3BsYXkgICAgICAgICAgPSBmdW5jdGlvbihudW0pIHtyZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXREaXNwbGF5KG51bSk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RGlzcGxheSgpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRUYXJnZXRGUFMgPSBmdW5jdGlvbihmcHMpe3RoaXMuX2FwcEltcGwuc2V0VGFyZ2V0RlBTKGZwcyk7fTtcblxuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNLZXlEb3duICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc0tleURvd24oKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzTW91c2VEb3duICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNNb3VzZURvd24oKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzTW91c2VNb3ZlICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNNb3VzZU1vdmUoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldEtleVN0ciAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0S2V5U3RyKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRLZXlDb2RlICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleUNvZGUoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldE1vdXNlV2hlZWxEZWx0YSA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0TW91c2VXaGVlbERlbHRhKCk7fTtcblxuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25LZXlEb3duICAgID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbktleVVwICAgICAgPSBmdW5jdGlvbihlKXt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uTW91c2VVcCAgICA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZURvd24gID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlV2hlZWwgPSBmdW5jdGlvbihlKXt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uTW91c2VNb3ZlICA9IGZ1bmN0aW9uKGUpe307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uKGUpe307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRGcmFtZXNFbGFwc2VkICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RnJhbWVzRWxhcHNlZCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFNlY29uZHNFbGFwc2VkKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZSgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVTdGFydCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZU5leHQgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVOZXh0KCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZURlbHRhKCk7fTtcblxuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldEFzcGVjdFJhdGlvV2luZG93ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRBc3BlY3RSYXRpbygpO307XG5cbkFwcGxpY2F0aW9uLl9faW5zdGFuY2UgPSBudWxsO1xuQXBwbGljYXRpb24uZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpe3JldHVybiBBcHBsaWNhdGlvbi5fX2luc3RhbmNlO307XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb247XG5cblxuXG5cblxuIiwiZnVuY3Rpb24gR2VvbTNkKClcbntcbiAgICB0aGlzLnZlcnRpY2VzICA9IG51bGw7XG4gICAgdGhpcy5ub3JtYWxzICAgPSBudWxsO1xuICAgIHRoaXMuY29sb3JzICAgID0gbnVsbDtcbiAgICB0aGlzLmluZGljZXMgICA9IG51bGw7XG4gICAgdGhpcy50ZXhDb29yZHMgPSBudWxsO1xufVxuXG4vL1RPRE8gbWVyZ2Vcbkdlb20zZC5wcm90b3R5cGUudXBkYXRlVmVydGV4Tm9ybWFscyA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgaW5kaWNlcyAgPSB0aGlzLmluZGljZXMsXG4gICAgICAgIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcyxcbiAgICAgICAgbm9ybWFscyAgPSB0aGlzLm5vcm1hbHM7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgYSwgYiwgYztcbiAgICB2YXIgZTJ4LCBlMnksIGUyeixcbiAgICAgICAgZTF4LCBlMXksIGUxejtcblxuICAgIHZhciBueCwgbnksIG56LFxuICAgICAgICB2YngsIHZieSwgdmJ6LFxuICAgICAgICBhMCwgYTEsIGEyLFxuICAgICAgICBiMCwgYjEsIGIyLFxuICAgICAgICBjMCwgYzEsIGMyO1xuXG4gICAgaSA9IDA7XG4gICAgd2hpbGUoIGkgPCBub3JtYWxzLmxlbmd0aCApXG4gICAge1xuICAgICAgICBub3JtYWxzW2ldID0gbm9ybWFsc1tpKzFdID0gbm9ybWFsc1tpKzJdID0gMC4wO1xuICAgICAgICBpKz0zO1xuICAgIH1cblxuICAgIGkgPSAwO1xuICAgIHdoaWxlKCBpIDwgaW5kaWNlcy5sZW5ndGggKVxuICAgIHtcbiAgICAgICAgYSA9IGluZGljZXNbaSAgXSozO1xuICAgICAgICBiID0gaW5kaWNlc1tpKzFdKjM7XG4gICAgICAgIGMgPSBpbmRpY2VzW2krMl0qMztcblxuICAgICAgICBhMCA9IGE7XG4gICAgICAgIGExID0gYSsxO1xuICAgICAgICBhMiA9IGErMjtcblxuICAgICAgICBiMCA9IGI7XG4gICAgICAgIGIxID0gYisxO1xuICAgICAgICBiMiA9IGIrMjtcblxuICAgICAgICBjMCA9IGM7XG4gICAgICAgIGMxID0gYysxO1xuICAgICAgICBjMiA9IGMrMjtcblxuICAgICAgICB2YnggPSB2ZXJ0aWNlc1tiMF07XG4gICAgICAgIHZieSA9IHZlcnRpY2VzW2IxXTtcbiAgICAgICAgdmJ6ID0gdmVydGljZXNbYjJdO1xuXG4gICAgICAgIGUxeCA9IHZlcnRpY2VzW2EwXS12Yng7XG4gICAgICAgIGUxeSA9IHZlcnRpY2VzW2ExXS12Ynk7XG4gICAgICAgIGUxeiA9IHZlcnRpY2VzW2EyXS12Yno7XG5cbiAgICAgICAgZTJ4ID0gdmVydGljZXNbYzBdLXZieDtcbiAgICAgICAgZTJ5ID0gdmVydGljZXNbYzFdLXZieTtcbiAgICAgICAgZTJ6ID0gdmVydGljZXNbYzJdLXZiejtcblxuICAgICAgICBueCA9IGUxeSAqIGUyeiAtIGUxeiAqIGUyeTtcbiAgICAgICAgbnkgPSBlMXogKiBlMnggLSBlMXggKiBlMno7XG4gICAgICAgIG56ID0gZTF4ICogZTJ5IC0gZTF5ICogZTJ4O1xuXG4gICAgICAgIG5vcm1hbHNbYTBdICs9IG54O1xuICAgICAgICBub3JtYWxzW2ExXSArPSBueTtcbiAgICAgICAgbm9ybWFsc1thMl0gKz0gbno7XG5cbiAgICAgICAgbm9ybWFsc1tiMF0gKz0gbng7XG4gICAgICAgIG5vcm1hbHNbYjFdICs9IG55O1xuICAgICAgICBub3JtYWxzW2IyXSArPSBuejtcblxuICAgICAgICBub3JtYWxzW2MwXSArPSBueDtcbiAgICAgICAgbm9ybWFsc1tjMV0gKz0gbnk7XG4gICAgICAgIG5vcm1hbHNbYzJdICs9IG56O1xuXG4gICAgICAgIGkrPTM7XG4gICAgfVxuXG4gICAgdmFyIHgsIHksIHosIGw7XG5cbiAgICBpID0gMDtcbiAgICB3aGlsZShpIDwgbm9ybWFscy5sZW5ndGgpXG4gICAge1xuXG4gICAgICAgIHggPSBub3JtYWxzW2kgIF07XG4gICAgICAgIHkgPSBub3JtYWxzW2krMV07XG4gICAgICAgIHogPSBub3JtYWxzW2krMl07XG5cbiAgICAgICAgbCA9IE1hdGguc3FydCh4KngreSp5K3oqeik7XG4gICAgICAgIGwgPSAxIC8gKGwgfHwgMSk7XG5cbiAgICAgICAgbm9ybWFsc1tpICBdICo9IGw7XG4gICAgICAgIG5vcm1hbHNbaSsxXSAqPSBsO1xuICAgICAgICBub3JtYWxzW2krMl0gKj0gbDtcblxuICAgICAgICBpKz0zO1xuICAgIH1cblxufTtcblxuXG5HZW9tM2QucHJvdG90eXBlLnNldFZlcnRleCA9IGZ1bmN0aW9uKGluZGV4LHYpXG57XG4gICAgaW5kZXggKj0gMztcbiAgICB2YXIgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xuICAgIHZlcnRpY2VzW2luZGV4ICBdID0gdlswXTtcbiAgICB2ZXJ0aWNlc1tpbmRleCsxXSA9IHZbMV07XG4gICAgdmVydGljZXNbaW5kZXgrMl0gPSB2WzJdO1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRWZXJ0ZXgzZiA9IGZ1bmN0aW9uKGluZGV4LHgseSx6KVxue1xuICAgIGluZGV4Kj0zO1xuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG4gICAgdmVydGljZXNbaW5kZXggIF0gPSB4O1xuICAgIHZlcnRpY2VzW2luZGV4KzFdID0geTtcbiAgICB2ZXJ0aWNlc1tpbmRleCsyXSA9IHo7XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldENvbG9yNGYgPSBmdW5jdGlvbihpbmRleCxyLGcsYixhKVxue1xuICAgIGluZGV4ICo9IDQ7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuICAgIGNvbG9yc1tpbmRleCAgXSA9IHI7XG4gICAgY29sb3JzW2luZGV4KzFdID0gZztcbiAgICBjb2xvcnNbaW5kZXgrMl0gPSBiO1xuICAgIGNvbG9yc1tpbmRleCszXSA9IGE7XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldENvbG9yM2YgPSBmdW5jdGlvbihpbmRleCxyLGcsYilcbntcbiAgICBpbmRleCAqPSA0O1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgICBjb2xvcnNbaW5kZXggIF0gPSByO1xuICAgIGNvbG9yc1tpbmRleCsxXSA9IGc7XG4gICAgY29sb3JzW2luZGV4KzJdID0gYjtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0Q29sb3IyZiA9IGZ1bmN0aW9uKGluZGV4LGssYSlcbntcbiAgICBpbmRleCAqPSA0O1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgICBjb2xvcnNbaW5kZXggIF0gPSBrO1xuICAgIGNvbG9yc1tpbmRleCsxXSA9IGs7XG4gICAgY29sb3JzW2luZGV4KzJdID0gaztcbiAgICBjb2xvcnNbaW5kZXgrM10gPSBhO1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRDb2xvcjFmID0gZnVuY3Rpb24oaW5kZXgsaylcbntcbiAgICBpbmRleCAqPSA0O1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgICBjb2xvcnNbaW5kZXggIF0gPSBrO1xuICAgIGNvbG9yc1tpbmRleCsxXSA9IGs7XG4gICAgY29sb3JzW2luZGV4KzJdID0gaztcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0Q29sb3IgPSBmdW5jdGlvbihpbmRleCxjb2xvcilcbntcbiAgICBpbmRleCo9NDtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgY29sb3JzW2luZGV4ICBdID0gY29sb3JbMF07XG4gICAgY29sb3JzW2luZGV4KzFdID0gY29sb3JbMV07XG4gICAgY29sb3JzW2luZGV4KzJdID0gY29sb3JbMl07XG4gICAgY29sb3JzW2luZGV4KzNdID0gY29sb3JbM107XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldFRleENvb3JkMmYgPSBmdW5jdGlvbihpbmRleCx1LHYpXG57XG4gICAgaW5kZXgqPTI7XG4gICAgdmFyIHRleENvb3JkcyA9IHRoaXMudGV4Q29vcmRzO1xuICAgIHRleENvb3Jkc1tpbmRleCAgXSA9IHU7XG4gICAgdGV4Q29vcmRzW2luZGV4KzFdID0gdjtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0VGV4Q29vcmQgPSBmdW5jdGlvbihpbmRleCx2KVxue1xuICAgIGluZGV4Kj0yO1xuICAgIHZhciB0ZXhDb29yZHMgPSB0aGlzLnRleENvb3JkcztcbiAgICB0ZXhDb29yZHNbaW5kZXggIF0gPSB2WzBdO1xuICAgIHRleENvb3Jkc1tpbmRleCsxXSA9IHZbMV07XG59O1xuXG5cbkdlb20zZC5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbihnbClcbntcbiAgICBnbC5kcmF3RWxlbWVudHModGhpcy52ZXJ0aWNlcyx0aGlzLm5vcm1hbHMsdGhpcy5jb2xvcnMsdGhpcy50ZXhDb29yZHMsdGhpcy5pbmRpY2VzLGdsLl9kcmF3TW9kZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdlb20zZDsiLCJ2YXIgR2VvbTNkID0gcmVxdWlyZSgnLi9nbGtHZW9tM2QnKTtcblxuZnVuY3Rpb24gSVNPQmFuZChzaXplWCxzaXplWix1bml0U2NhbGVYLHVuaXRTY2FsZVopXG57XG4gICAgdGhpcy5fdmVydFNpemVYICA9IG51bGw7XG4gICAgdGhpcy5fdmVydFNpemVaICA9IG51bGw7XG4gICAgdGhpcy5fdW5pdFNjYWxlWCA9IDE7XG4gICAgdGhpcy5fdW5pdFNjYWxlWiA9IDE7XG5cbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aClcbiAgICB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWiA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVogPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVaID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgdGhpcy5fdW5pdFNjYWxlWCA9IHRoaXMuX3VuaXRTY2FsZVogPSBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYICA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWiAgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB0aGlzLl91bml0U2NhbGVYID0gYXJndW1lbnRzWzJdO1xuICAgICAgICAgICAgdGhpcy5fdW5pdFNjYWxlWiA9IGFyZ3VtZW50c1szXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWiA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIHRoaXMuX2NlbGxTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCAtIDE7XG4gICAgdGhpcy5fY2VsbFNpemVaID0gdGhpcy5fdmVydFNpemVaIC0gMTtcblxuICAgIHRoaXMuX2Z1bmMgICAgID0gZnVuY3Rpb24oeCx5LGFyZzAsYXJnMSxhcmcyKXtyZXR1cm4gMDt9O1xuICAgIHRoaXMuX2Z1bmNBcmcwID0gMDtcbiAgICB0aGlzLl9mdW5jQXJnMSA9IDA7XG4gICAgdGhpcy5fZnVuY0FyZzIgPSAwO1xuICAgIHRoaXMuX2lzb0xldmVsID0gMDtcblxuICAgIHRoaXMuX2ludGVycG9sYXRlVmFsdWVzID0gdHJ1ZTtcblxuICAgIHRoaXMuX251bVRyaWFuZ2xlcyA9IDA7XG5cbiAgICAvL1RPRE8gQ0hFQ0sgTUFYIEVMRU1FTlQgRVhDRUVEXG4gICAgdGhpcy5fdmVydHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX3ZlcnRTaXplWCAqIHRoaXMuX3ZlcnRTaXplWiAqIDQpOyAvLyBncmlkIGNhbGN1bGF0ZWQgbm9ybSB2YWx1ZXMgKyBmdW5jdGlvbiByZXN1bHQgdmFsdWUgLi4uLHgseSx6LHYsLi4uXG4gICAgdGhpcy5fY2VsbHMgPSBuZXcgQXJyYXkodGhpcy5fY2VsbFNpemVYICogdGhpcy5fY2VsbFNpemVaKTtcblxuICAgIHRoaXMuX2VkZ2VzID0gbmV3IEZsb2F0MzJBcnJheSgodGhpcy5fY2VsbFNpemVaICogdGhpcy5fY2VsbFNpemVYICogMiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jZWxsU2l6ZVogKyB0aGlzLl9jZWxsU2l6ZVgpICogMyk7XG5cblxuICAgIHRoaXMuX3RlbXBDZWxsVmVydGljZXNWYWxzID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxuICAgIHRoaXMuX2luZGljZXMgPSBbXTtcblxuICAgIC8qXG4gICAgLy90ZW1wIFRPRE8gcmVtb3ZlXG4gICAgdGhpcy5fX2FwcFVpbnRUeXBlRW5hYmxlZCA9IEdMS2l0LkFwcGxpY2F0aW9uLmdldEluc3RhbmNlKCkuZ2wuaXNVSW50RWxlbWVudFR5cGVBdmFpbGFibGUoKTtcbiAgICAqL1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5fZ2VuU3VyZmFjZSgpO1xufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT0JhbmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW9tM2QucHJvdG90eXBlKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbi8vZG9udCBuZWVkIHRoaXNcbklTT0JhbmQucHJvdG90eXBlLnNldEZ1bmN0aW9uID0gZnVuY3Rpb24oZnVuYyxpc29MZXZlbClcbntcbiAgICB2YXIgZnVuY0FyZ3NMZW5ndGggPSBmdW5jLmxlbmd0aDtcblxuICAgIGlmKGZ1bmNBcmdzTGVuZ3RoIDwgMil0aHJvdyAnRnVuY3Rpb24gc2hvdWxkIHNhdGlzZnkgZnVuY3Rpb24oeCx5KXt9JztcbiAgICBpZihmdW5jQXJnc0xlbmd0aCA+IDUpdGhyb3cgJ0Z1bmN0aW9uIGhhcyB0byBtYW55IGFyZ3VtZW50cy4gQXJndW1lbnRzIGxlbmd0aCBzaG91bGQgbm90IGV4Y2VlZCA1LiBFLmcgZnVuY3Rpb24oeCx5LGFyZzAsYXJnMSxhcmcyKS4nO1xuXG4gICAgdmFyIGZ1bmNTdHJpbmcgPSBmdW5jLnRvU3RyaW5nKCksXG4gICAgICAgIGZ1bmNBcmdzICAgPSBmdW5jU3RyaW5nLnNsaWNlKGZ1bmNTdHJpbmcuaW5kZXhPZignKCcpICsgMSwgZnVuY1N0cmluZy5pbmRleE9mKCcpJykpLnNwbGl0KCcsJyksXG4gICAgICAgIGZ1bmNCb2R5ICAgPSBmdW5jU3RyaW5nLnNsaWNlKGZ1bmNTdHJpbmcuaW5kZXhPZigneycpICsgMSwgZnVuY1N0cmluZy5sYXN0SW5kZXhPZignfScpKTtcblxuICAgIHRoaXMuX2Z1bmMgICAgID0gbmV3IEZ1bmN0aW9uKGZ1bmNBcmdzWzBdLCBmdW5jQXJnc1sxXSxcbiAgICAgICAgZnVuY0FyZ3NbMl0gfHwgJ2FyZzAnLCBmdW5jQXJnc1szXSB8fCAnYXJnMScsIGZ1bmNBcmdzWzRdIHx8ICdhcmcyJyxcbiAgICAgICAgZnVuY0JvZHkpO1xuICAgIHRoaXMuX2lzb0xldmVsID0gaXNvTGV2ZWwgfHwgMDtcblxuXG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBTZXR1cCBwb2ludHNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPQmFuZC5wcm90b3R5cGUuX2dlblN1cmZhY2UgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIHZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCxcbiAgICAgICAgdmVydFNpemVaID0gdGhpcy5fdmVydFNpemVaO1xuXG4gICAgdmFyIGNlbGxTaXplWCA9IHRoaXMuX2NlbGxTaXplWCxcbiAgICAgICAgY2VsbFNpemVaID0gdGhpcy5fY2VsbFNpemVaO1xuXG4gICAgdmFyIHNjYWxlWCA9IHRoaXMuX3VuaXRTY2FsZVgsXG4gICAgICAgIHNjYWxlWiA9IHRoaXMuX3VuaXRTY2FsZVo7XG5cbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cyxcbiAgICAgICAgdmVydHNJbmRleCxcbiAgICAgICAgdmVydHNJbmRleFJvd05leHQsXG4gICAgICAgIGNlbGxzID0gdGhpcy5fY2VsbHMsXG4gICAgICAgIGNlbGxzSW5kZXg7XG5cbiAgICB2YXIgaSxqO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHZlcnRTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgdmVydFNpemVYKVxuICAgICAgICB7XG4gICAgICAgICAgICB2ZXJ0c0luZGV4ICAgICAgICAgID0gKHZlcnRTaXplWCAqIGkgKyBqKSo0O1xuICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleCAgXSA9ICgtMC41ICsgKGovKHZlcnRTaXplWCAtIDEpKSkgKiBzY2FsZVg7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4KzFdID0gMDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXgrMl0gPSAoLTAuNSArIChpLyh2ZXJ0U2l6ZVogLSAxKSkpICogc2NhbGVaO1xuICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleCszXSA9IC0xO1xuXG4gICAgICAgICAgICBpZihpIDwgY2VsbFNpemVaICYmIGogPCBjZWxsU2l6ZVgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmVydHNJbmRleFJvd05leHQgPSAodmVydFNpemVYICogaSArIGogKyB2ZXJ0U2l6ZVgpICogNDtcblxuICAgICAgICAgICAgICAgIGNlbGxzSW5kZXggICAgICAgID0gY2VsbFNpemVYICogaSArIGo7XG4gICAgICAgICAgICAgICAgY2VsbHNbY2VsbHNJbmRleF0gPSBbdmVydHNJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4Um93TmV4dCArIDQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleFJvd05leHQgXTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gYXBwbHkgZnVuY3Rpb24gdG8gZGF0YSBwb2ludHNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPQmFuZC5wcm90b3R5cGUuYXBwbHlGdW5jdGlvbiA9IGZ1bmN0aW9uKGFyZzAsYXJnMSxhcmcyKVxue1xuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzLFxuICAgICAgICB2ZXJ0c0luZGV4O1xuXG4gICAgdmFyIHZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCxcbiAgICAgICAgdmVydFNpemVaID0gdGhpcy5fdmVydFNpemVaO1xuXG4gICAgdmFyIGksIGo7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgdmVydFNpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCB2ZXJ0U2l6ZVgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZlcnRzSW5kZXggPSAodmVydFNpemVYICogaSArIGopICogNDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXggKyAzXSA9IHRoaXMuX2Z1bmModmVydHNbdmVydHNJbmRleF0sdmVydHNbdmVydHNJbmRleCsyXSxhcmcwLGFyZzEsYXJnMik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1hcmNoKCk7XG59O1xuXG5JU09CYW5kLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uTXVsdCA9IGZ1bmN0aW9uKGFyZzAsYXJnMSxhcmcyKVxue1xuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzLFxuICAgICAgICB2ZXJ0c0luZGV4O1xuXG4gICAgdmFyIHZlcnRzU2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVgsXG4gICAgICAgIHZlcnRzU2l6ZVogPSB0aGlzLl92ZXJ0U2l6ZVo7XG5cbiAgICB2YXIgaSwgajtcblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCB2ZXJ0c1NpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCB2ZXJ0c1NpemVYKVxuICAgICAgICB7XG4gICAgICAgICAgICB2ZXJ0c0luZGV4ID0gKHZlcnRzU2l6ZVggKiBpICsgaikgKiA0O1xuICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleCArIDNdICo9IHRoaXMuX2Z1bmModmVydHNbdmVydHNJbmRleF0sdmVydHNbdmVydHNJbmRleCsyXSxhcmcwLGFyZzEsYXJnMik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1hcmNoKCk7XG59O1xuXG5JU09CYW5kLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oZGF0YSx3aWR0aCxoZWlnaHQpXG57XG5cbiAgICB2YXIgdmVydHNTaXplWCA9IHRoaXMuX3ZlcnRTaXplWCxcbiAgICAgICAgdmVydHNTaXplWiA9IHRoaXMuX3ZlcnRTaXplWjtcblxuICAgIGlmKHdpZHRoID4gdmVydHNTaXplWiB8fCBoZWlnaHQgPiB2ZXJ0c1NpemVYKVxuICAgICAgICB0aHJvdyAnRGF0YSBleGNlZWRzIGJ1ZmZlciBzaXplLiBTaG91bGQgbm90IGV4Y2VlZCAnICsgdmVydHNTaXplWiArICcgaW4gd2lkdGggYW5kICcgKyB2ZXJ0c1NpemVYICsgJyBpbiBoZWlnaHQnO1xuXG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHM7XG5cbiAgICB2YXIgaSAsajtcbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgd2lkdGgpXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IGhlaWdodClcbiAgICAgICAge1xuICAgICAgICAgICAgdmVydHNbKGhlaWdodCAqIGkgKyBqKSAqIDQgKyAzXSA9IGRhdGFbaGVpZ2h0ICogaSArIGpdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIG1hcmNoXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT0JhbmQucHJvdG90eXBlLm1hcmNoID0gZnVuY3Rpb24oKVxue1xuICAgIC8vcmVzZXQgaW5kaWNlc1xuICAgIHZhciBpbmRpY2VzID0gdGhpcy5faW5kaWNlcyA9IFtdO1xuXG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHM7XG5cbiAgICB2YXIgaSwgaiwgaztcblxuICAgIHZhciBjZWxscyAgICA9IHRoaXMuX2NlbGxzLFxuICAgICAgICBpbmRpY2VzICA9IHRoaXMuX2luZGljZXM7XG5cbiAgICB2YXIgY2VsbFNpemVYID0gdGhpcy5fY2VsbFNpemVYLFxuICAgICAgICBjZWxsU2l6ZVogPSB0aGlzLl9jZWxsU2l6ZVo7XG5cbiAgICB2YXIgY2VsbEluZGV4LFxuICAgICAgICBjZWxsLFxuICAgICAgICBjZWxsU3RhdGU7XG5cbiAgICAvL0NlbGwgdmVydGV4IGluZGljZXMgaW4gZ2xvYmFsIHZlcnRpY2VzXG4gICAgdmFyIHYwSW5kZXgsICAvLyAwIDFcbiAgICAgICAgdjFJbmRleCwgIC8vIDMgMlxuICAgICAgICB2MkluZGV4LFxuICAgICAgICB2M0luZGV4O1xuXG4gICAgLy9DZWxsIHZlcnRleCB2YWx1ZXMgLi4uLHgseSx6LFZBTFVFLC4uLlxuICAgIHZhciB2VmFscyA9IHRoaXMuX3RlbXBDZWxsVmVydGljZXNWYWxzLFxuICAgICAgICB2MFZhbCx2MVZhbCx2MlZhbCx2M1ZhbDtcblxuICAgIC8vVG9wb2xvZ2ljIGVudHJ5IC8gbG9va3VwXG4gICAgdmFyIGVudHJ5VG9wTHUsXG4gICAgICAgIElTT0JBTkRfVE9QX0xVICAgICA9IElTT0JhbmQuVE9QX1RBQkxFO1xuXG4gICAgdmFyIGVudHJ5VG9wTHUwLFxuICAgICAgICBlbnRyeVRvcEx1MSxcbiAgICAgICAgZW50cnlUb3BMdTIsXG4gICAgICAgIGVudHJ5VG9wTHUzO1xuXG4gICAgdmFyIGVkZ2VJbmRleFRvcCxcbiAgICAgICAgZWRnZUluZGV4UmlnaHQsXG4gICAgICAgIGVkZ2VJbmRleEJvdHRvbSxcbiAgICAgICAgZWRnZUluZGV4TGVmdCxcbiAgICAgICAgZWRnZUluZGV4VGVtcDtcblxuICAgIHZhciBlZGdlcyA9IHRoaXMuX2VkZ2VzO1xuXG5cbiAgICAvL1xuICAgIC8vICAwIC0tLS0tLS0gMVxuICAgIC8vICB8ICAgIDAgICAgfFxuICAgIC8vICB8IDEgICAgICAgfCAyXG4gICAgLy8gIHwgICAgICAgICB8XG4gICAgLy8gIDMgLS0tLS0tLSAyXG4gICAgLy8gICAgICAgM1xuXG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgY2VsbFNpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBjZWxsU2l6ZVgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNlbGxJbmRleCAgICAgICAgPSBjZWxsU2l6ZVggKiBpICsgajtcbiAgICAgICAgICAgIGNlbGwgICAgICAgICAgICAgPSBjZWxsc1tjZWxsSW5kZXhdO1xuXG4gICAgICAgICAgICB2MEluZGV4ID0gY2VsbFswXTtcbiAgICAgICAgICAgIHYxSW5kZXggPSBjZWxsWzFdO1xuICAgICAgICAgICAgdjJJbmRleCA9IGNlbGxbMl07XG4gICAgICAgICAgICB2M0luZGV4ID0gY2VsbFszXTtcblxuICAgICAgICAgICAgdjBWYWwgPSB2VmFsc1swXSA9IHZlcnRzW3YwSW5kZXggKyAzXTtcbiAgICAgICAgICAgIHYxVmFsID0gdlZhbHNbMV0gPSB2ZXJ0c1t2MUluZGV4ICsgM107XG4gICAgICAgICAgICB2MlZhbCA9IHZWYWxzWzJdID0gdmVydHNbdjJJbmRleCArIDNdO1xuICAgICAgICAgICAgdjNWYWwgPSB2VmFsc1szXSA9IHZlcnRzW3YzSW5kZXggKyAzXTtcblxuICAgICAgICAgICAgY2VsbFN0YXRlID0gKHYwVmFsID4gMCkgPDwgMyB8XG4gICAgICAgICAgICAgICAgICAgICAgICAodjFWYWwgPiAwKSA8PCAyIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICh2MlZhbCA+IDApIDw8IDEgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKHYzVmFsID4gMCk7XG5cbiAgICAgICAgICAgIGlmKGNlbGxTdGF0ZSA9PSAwKWNvbnRpbnVlO1xuXG4gICAgICAgICAgICBlZGdlSW5kZXhUb3AgICAgPSBjZWxsSW5kZXggKyAoY2VsbFNpemVYICsgMSkgKiBpO1xuICAgICAgICAgICAgZWRnZUluZGV4UmlnaHQgID0gZWRnZUluZGV4VG9wICAgKyBjZWxsU2l6ZVggKyAxO1xuICAgICAgICAgICAgZWRnZUluZGV4Qm90dG9tID0gZWRnZUluZGV4UmlnaHQgKyBjZWxsU2l6ZVg7XG4gICAgICAgICAgICBlZGdlSW5kZXhMZWZ0ICAgPSBlZGdlSW5kZXhSaWdodCAtIDE7XG5cbiAgICAgICAgICAgIGVudHJ5VG9wTHUgPSBJU09CQU5EX1RPUF9MVVtjZWxsU3RhdGVdO1xuXG4gICAgICAgICAgICAvL2NlbGwgdXBwZXIgbGVmdFxuICAgICAgICAgICAgayA9IDA7XG4gICAgICAgICAgICBpZihpID09IDAgJiYgaiA9PSAwKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgd2hpbGUoayA8IGVudHJ5VG9wTHUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPSBlbnRyeVRvcEx1W2sgIF07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUxID0gZW50cnlUb3BMdVtrKzFdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9IGVudHJ5VG9wTHVbaysyXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTMgPSBlbnRyeVRvcEx1W2srM107XG5cbiAgICAgICAgICAgICAgICAgICAgLy9nZXQgZWRnZSB2ZXJ0ZXggMCBhY2NvcmRpbmcgdG8gdG9wb2xvZ2ljYWwgZW50cnlcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIGNvbGxhcHNlXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MCA9PSAwID8gZWRnZUluZGV4VG9wIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID09IDEgPyBlZGdlSW5kZXhSaWdodCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9PSAyID8gZWRnZUluZGV4Qm90dG9tIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleExlZnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTBdLGNlbGxbZW50cnlUb3BMdTFdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vZ2V0IGVkZ2UgdmVydGV4IDEgYWNjb3JkaW5nIHRvIHRvcG9sb2dpY2FsIGVudHJ5XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETyBjb2xsYXBzZVxuICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTIgPT0gMCA/IGVkZ2VJbmRleFRvcCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9PSAxID8gZWRnZUluZGV4UmlnaHQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPT0gMiA/IGVkZ2VJbmRleEJvdHRvbSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhMZWZ0O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUyXSxjZWxsW2VudHJ5VG9wTHUzXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKTtcblxuICAgICAgICAgICAgICAgICAgICBrICs9IDQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NlbGxzIGZpcnN0IHJvdyBhZnRlciB1cHBlciBsZWZ0XG4gICAgICAgICAgICAvL1RPRE8gY29sbGFwc2VcbiAgICAgICAgICAgIGlmKGkgPT0gMCAmJiBqID4gMClcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGsgPCBlbnRyeVRvcEx1Lmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID0gZW50cnlUb3BMdVtrICBdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MSA9IGVudHJ5VG9wTHVbaysxXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPSBlbnRyeVRvcEx1W2srMl07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUzID0gZW50cnlUb3BMdVtrKzNdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgZWRnZSBpcyBvbiBhZGphY2VudCBsZWZ0IHNpZGUsIGFuZCBwdXNoIGluZGV4IG9mIGVkZ2UsXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgbm90LCBjYWxjdWxhdGUgZWRnZSwgcHVzaCBpbmRleCBvZiBuZXcgZWRnZVxuXG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmaXJzdCB2ZXJ0ZXggaXMgb24gbGVmdCBlZGdlXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5VG9wTHUwID09IDMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYXNzaWduIHByZXZpb3VzIGNhbGN1bGF0ZWQgZWRnZSB2ZXJ0ZXggZnJvbSBwcmV2aW91cyBjZWxsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4TGVmdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIC8vY2FsY3VsYXRlIGVkZ2UgdmVydGV4XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MCA9PSAwID8gZWRnZUluZGV4VG9wIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9PSAxID8gZWRnZUluZGV4UmlnaHQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleEJvdHRvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTBdLGNlbGxbZW50cnlUb3BMdTFdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgc2Vjb25kIHZlcnRleCBpcyBvbiBsZWZ0IGVkZ2VcblxuICAgICAgICAgICAgICAgICAgICBpZihlbnRyeVRvcEx1MiA9PSAzKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4TGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSAvL2NhbGN1bGF0ZSBlZGdlIHZlcnRleFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTIgPT0gMCA/IGVkZ2VJbmRleFRvcCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhCb3R0b207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUyXSxjZWxsW2VudHJ5VG9wTHUzXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIGsgKz0gNDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2VsbHMgZmlyc3QgY29sdW1uIGFmdGVyIHVwcGVyIGxlZnRcbiAgICAgICAgICAgIC8vVE9ETyBjb2xsYXBzZVxuICAgICAgICAgICAgaWYoaSAhPSAwICYmIGogPT0gMClcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGsgPCBlbnRyeVRvcEx1Lmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBpZiBlZGdlIGlzIG9uIGFkamFjZW50IHRvcCBzaWRlLCBhbmQgcHVzaCBpbmRleCBvZiBlZGdlLFxuICAgICAgICAgICAgICAgICAgICAvL2lmIG5vdCwgY2FsY3VsYXRlIGVkZ2UsIHB1c2ggaW5kZXggb2YgbmV3IGVkZ2VcblxuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9IGVudHJ5VG9wTHVbayAgXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTEgPSBlbnRyeVRvcEx1W2srMV07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID0gZW50cnlUb3BMdVtrKzJdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MyA9IGVudHJ5VG9wTHVbayszXTtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZpcnN0IHZlcnRleCBpcyBvbiB0b3AgZWRnZVxuICAgICAgICAgICAgICAgICAgICBpZihlbnRyeVRvcEx1MCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MCA9PSAxID8gZWRnZUluZGV4UmlnaHQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID09IDIgPyBlZGdlSW5kZXhCb3R0b20gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleExlZnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUwXSxjZWxsW2VudHJ5VG9wTHUxXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcClcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZmlyc3QgdmVydGV4IGlzIG9uIHRvcCBlZGdlXG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5VG9wTHUyID09IDApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUyID09IDEgPyBlZGdlSW5kZXhSaWdodCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPT0gMiA/IGVkZ2VJbmRleEJvdHRvbSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4TGVmdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTJdLGNlbGxbZW50cnlUb3BMdTNdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgayArPSA0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NoZWNrIGFsbCBvdGhlciBjZWxsc1xuICAgICAgICAgICAgLy9UT0RPIGNvbGxhcHNlXG4gICAgICAgICAgICBpZihpICE9IDAgJiYgaiAhPSAwKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgLy9jaGVjayBpZiBlZGdlIGlzIG9uIGFkamFjZW50IGxlZnQgc2lkZSwgYW5kIHB1c2ggaW5kZXggb2YgZWRnZSxcbiAgICAgICAgICAgICAgICAvL2lmIG5vdCwgY2FsY3VsYXRlIGVkZ2UsIHB1c2ggaW5kZXggb2YgbmV3IGVkZ2VcblxuICAgICAgICAgICAgICAgIHdoaWxlKGsgPCBlbnRyeVRvcEx1Lmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID0gZW50cnlUb3BMdVtrICBdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MSA9IGVudHJ5VG9wTHVbaysxXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPSBlbnRyeVRvcEx1W2srMl07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUzID0gZW50cnlUb3BMdVtrKzNdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZmlyc3QgdmVydGV4IGlzIG9uIGxlZnQgZWRnZVxuICAgICAgICAgICAgICAgICAgICBpZihlbnRyeVRvcEx1MCA9PSAzKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4TGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihlbnRyeVRvcEx1MCA9PSAwKS8vbWF5YmUgdXBwZXIgY2VsbD9cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSAvL2NhbGN1bGF0ZSBlZGdlIHZlcnRleFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTAgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDogZWRnZUluZGV4Qm90dG9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1MF0sY2VsbFtlbnRyeVRvcEx1MV0sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBzZWNvbmQgdmVydGV4IGlzIG9uIGxlZnQgZWRnZVxuICAgICAgICAgICAgICAgICAgICBpZihlbnRyeVRvcEx1MiA9PSAzKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4TGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihlbnRyeVRvcEx1MiA9PSAwKS8vbWF5YmUgdXBwZXIgY2VsbD9cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSAvL2NhbGN1bGF0ZSBlZGdlIHZlcnRleFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTIgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDogZWRnZUluZGV4Qm90dG9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1Ml0sY2VsbFtlbnRyeVRvcEx1M10sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBrICs9IDQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy90ZW1wXG4gICAgdGhpcy5faW5kaWNlcyA9IHRoaXMuX19hcHBVaW50VHlwZUVuYWJsZWQgPyAgbmV3IFVpbnQzMkFycmF5KGluZGljZXMpIDogIG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcbn07XG5cbi8vdmlzdWFsIGRlYnVnIG5lZWQgaXNvbGluZS9pc29iYW5kIHN3aXRjaFxuSVNPQmFuZC5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbihnbClcbntcbiAgICB2YXIgZWRnZXMgICA9IHRoaXMuX2VkZ2VzLFxuICAgICAgICBjb2xvcnMgID0gZ2wuYnVmZmVyQ29sb3JzKGdsLmdldENvbG9yQnVmZmVyKCksbmV3IEZsb2F0MzJBcnJheShlZGdlcy5sZW5ndGgvMyo0KSksXG4gICAgICAgIGluZGljZXMgPSAgdGhpcy5faW5kaWNlcztcblxuICAgICBnbC5kcmF3RWxlbWVudHMoZWRnZXMsbnVsbCxjb2xvcnMsbnVsbCxpbmRpY2VzLGdsLmdldERyYXdNb2RlKCksaW5kaWNlcy5sZW5ndGgsMCxnbC5VTlNJR05FRF9TSE9SVCk7XG59O1xuXG5cbklTT0JhbmQucHJvdG90eXBlLl9pbnRycGwgPSBmdW5jdGlvbihpbmRleDAsaW5kZXgxLG91dCxvZmZzZXQpXG57XG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHM7XG5cbiAgICB2YXIgdjB4ID0gdmVydHNbaW5kZXgwICBdLFxuICAgICAgICB2MHkgPSB2ZXJ0c1tpbmRleDArMV0sXG4gICAgICAgIHYweiA9IHZlcnRzW2luZGV4MCsyXSxcbiAgICAgICAgdjB2ID0gdmVydHNbaW5kZXgwKzNdO1xuXG4gICAgdmFyIHYxeCA9IHZlcnRzW2luZGV4MSAgXSxcbiAgICAgICAgdjF5ID0gdmVydHNbaW5kZXgxKzFdLFxuICAgICAgICB2MXogPSB2ZXJ0c1tpbmRleDErMl0sXG4gICAgICAgIHYxdiA9IHZlcnRzW2luZGV4MSszXTtcblxuXG4gICAgaWYodjB2ID09IDApXG4gICAge1xuICAgICAgICBvdXRbb2Zmc2V0KzBdID0gdjF4O1xuICAgICAgICBvdXRbb2Zmc2V0KzFdID0gdjF5O1xuICAgICAgICBvdXRbb2Zmc2V0KzJdID0gdjF6O1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSBpZih2MXYgPT0gMClcbiAgICB7XG4gICAgICAgIG91dFtvZmZzZXQrMF0gPSB2MHg7XG4gICAgICAgIG91dFtvZmZzZXQrMV0gPSB2MHk7XG4gICAgICAgIG91dFtvZmZzZXQrMl0gPSB2MHo7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgaWYodGhpcy5faW50ZXJwb2xhdGVWYWx1ZXMpXG4gICAge1xuICAgICAgICB2YXIgdjEwdiA9IHYxdiAtIHYwdjtcblxuICAgICAgICBvdXRbb2Zmc2V0KzBdID0gLXYwdiAqICh2MXggLSB2MHgpIC8gdjEwdiArIHYweDtcbiAgICAgICAgb3V0W29mZnNldCsxXSA9IC12MHYgKiAodjF5IC0gdjB5KSAvIHYxMHYgKyB2MHk7XG4gICAgICAgIG91dFtvZmZzZXQrMl0gPSAtdjB2ICogKHYxeiAtIHYweikgLyB2MTB2ICsgdjB6O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBvdXRbb2Zmc2V0KzBdID0gICh2MXggLSB2MHgpICogMC41ICsgdjB4O1xuICAgICAgICBvdXRbb2Zmc2V0KzFdID0gICh2MXkgLSB2MHkpICogMC41ICsgdjB5O1xuICAgICAgICBvdXRbb2Zmc2V0KzJdID0gICh2MXogLSB2MHopICogMC41ICsgdjB6O1xuICAgIH1cbn07XG5cblxuSVNPQmFuZC5wcm90b3R5cGUuZ2V0VmVydGljZXMgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZlcnRzO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRWZXJ0aWNlc1NpemVYID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdmVydFNpemVYO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRWZXJ0aWNlc1NpemVaID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdmVydFNpemVaO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRDZWxscyAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2VsbHM7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldENlbGxzU2l6ZVggICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jZWxsU2l6ZVg7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldENlbGxzU2l6ZVogICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jZWxsU2l6ZVo7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldEVkZ2VzICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9lZGdlczt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0SW5kaWNlcyAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2luZGljZXM7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gVE9QT0xPR0lDQUxcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLy9UT0RPIG1lcmdlXG5JU09CYW5kLlRPUF9UQUJMRSA9XG4gICAgW1xuICAgICAgICBbXSxcbiAgICAgICAgWyAyLCAzLCAzLCAwXSxcbiAgICAgICAgWyAxLCAyLCAyLCAzXSxcbiAgICAgICAgWyAxLCAyLCAzLCAwXSxcbiAgICAgICAgWyAwLCAxLCAxLCAyXSxcbiAgICAgICAgWyAwLCAxLCAxLCAyLCAyLCAzLCAzLCAwXSxcbiAgICAgICAgWyAwLCAxLCAyLCAzXSxcbiAgICAgICAgWyAwLCAxLCAzLCAwXSxcbiAgICAgICAgWyAwLCAxLCAzLCAwXSxcbiAgICAgICAgWyAwLCAxLCAyLCAzXSxcbiAgICAgICAgWyAwLCAxLCAxLCAyLCAyLCAzLCAzLCAwXSxcbiAgICAgICAgWyAwLCAxLCAxLCAyXSxcbiAgICAgICAgWyAxLCAyLCAzLCAwXSxcbiAgICAgICAgWyAxLCAyLCAyLCAzXSxcbiAgICAgICAgWyAyLCAzLCAzLCAwXSxcbiAgICAgICAgW11cbiAgICBdO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBUUklBTkdFXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vVE9ETyBtZXJnZVxuSVNPQmFuZC5UUklfVEFCTEUgPVxuICAgIFtcbiAgICAgICAgW10sXG4gICAgICAgIFsgMSwgMCwgMCwgMywgMSwgMV0sXG4gICAgICAgIFsgMSwgMCwgMCwgMiwgMSwgMV0sXG4gICAgICAgIFsgMSwgMCwgMCwgMiwgMCwgMywgMCwgMywgMSwgMSAsMSAsMCBdLFxuICAgICAgICBbIDEsIDAsIDAsIDEsIDEsIDFdLFxuICAgICAgICBbIDEsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDMsIDEsIDIsIDAsIDMsIDEsIDMsIDEsIDMsIDEsIDAsIDEsIDFdLFxuICAgICAgICBbIDEsIDAsIDAsIDEsIDEsIDEsIDAsIDEsIDAsIDIsIDEsIDFdLFxuICAgICAgICBbIDEsIDAsIDAsIDEsIDAsIDIsIDAsIDIsIDEsIDEsIDEsIDAsIDAsIDIsIDAsIDMsIDEsIDEgXSxcbiAgICAgICAgWyAwLCAwLCAxLCAwLCAxLCAxXSxcbiAgICAgICAgWyAwLCAwLCAxLCAwLCAwLCAzLCAxLCAwLCAxLCAxLCAwLCAzXSxcbiAgICAgICAgWyAwLCAwLCAxLCAwLCAxLCAzLCAxLCAwLCAxLCAxLCAxLCAzLCAxLCAxLCAwLCAyLCAxLCAyLCAxLCAyLCAxLCAzLCAxLCAxIF0sXG4gICAgICAgIFsgMCwgMCwgMSwgMCwgMCwgMywgMSwgMCwgMSwgMSwgMCwgMywgMSwgMSwgMCwgMiwgMCwgM10sXG4gICAgICAgIFsgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMSwgMCwgMSwgMV0sXG4gICAgICAgIFsgMCwgMCwgMCwgMSwgMSwgMCwgMSwgMCwgMSwgMSwgMCwgMCwgMSwgMSwgMCwgMywgMCwgMF0sXG4gICAgICAgIFsgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMSwgMCwgMiwgMSwgMCwgMSwgMCwgMSwgMSwgMCwgMV0sXG4gICAgICAgIFsgMCwgMCwgMCwgMSwgMCwgMywgMCwgMSwgMCwgMiwgMCwgM11cbiAgICBdO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gSVNPQmFuZDtcbiIsInZhciBWZWMzICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBWZWM0ICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzQnKSxcbiAgICBHZW9tM2QgPSByZXF1aXJlKCcuL2dsa0dlb20zZCcpO1xuXG5cbi8vVGhpcyBpcyBqdXN0IGFuIGluaXRpYWwgdmVyc2lvblxuZnVuY3Rpb24gSVNPU3VyZmFjZShzaXplWCxzaXplWSxzaXplWilcbntcbiAgICB0aGlzLl92ZXJ0U2l6ZVggPSBudWxsO1xuICAgIHRoaXMuX3ZlcnRTaXplWSA9IG51bGw7XG4gICAgdGhpcy5fdmVydFNpemVaID0gbnVsbDtcblxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKVxuICAgIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYID0gdGhpcy5fdmVydFNpemVZID0gdGhpcy5fdmVydFNpemVaID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWiA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWSA9IHRoaXMuX3ZlcnRTaXplWiA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLl9jdWJlU2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVggLSAxO1xuICAgIHRoaXMuX2N1YmVTaXplWSA9IHRoaXMuX3ZlcnRTaXplWSAtIDE7XG4gICAgdGhpcy5fY3ViZVNpemVaID0gdGhpcy5fdmVydFNpemVaIC0gMTtcblxuICAgIHRoaXMuX2RlbGF5ZWRDbGVhciA9IGZhbHNlO1xuXG4gICAgLy9UT0RPOkZJWCEhXG4gICAgdGhpcy5fZnVuYyAgICAgID0gZnVuY3Rpb24oeCx5LHosYXJnMCxhcmcxLGFyZzIpe3JldHVybiAwO307XG4gICAgdGhpcy5fZnVuY0FyZzAgID0gMDtcbiAgICB0aGlzLl9mdW5jQXJnMSAgPSAwO1xuICAgIHRoaXMuX2Z1bmNBcmcyICA9IDA7XG4gICAgdGhpcy5faXNvTGV2ZWwgID0gMDtcblxuICAgIC8vVE9ETzogdW5yb2xsXG4gICAgdGhpcy5fdmVydHMgPSBuZXcgQXJyYXkodGhpcy5fdmVydFNpemVYKnRoaXMuX3ZlcnRTaXplWSp0aGlzLl92ZXJ0U2l6ZVopO1xuICAgIHRoaXMuX2N1YmVzID0gbmV3IEFycmF5KHRoaXMuX2N1YmVTaXplWCp0aGlzLl9jdWJlU2l6ZVkqdGhpcy5fY3ViZVNpemVaKTtcblxuICAgIHRoaXMuX251bVRyaWFuZ2xlcyA9IDA7XG5cbiAgICB2YXIgU0laRV9PRl9UUklBTkdMRSAgID0gMyxcbiAgICAgICAgU0laRV9PRl9DVUJFX0VER0VTID0gMTI7XG4gICAgdmFyIE1BWF9CVUZGRVJfTEVOICAgICA9IHRoaXMuX2N1YmVzLmxlbmd0aCAqIDQ7XG5cbiAgICB0aGlzLl9iVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KChNQVhfQlVGRkVSX0xFTikqU0laRV9PRl9UUklBTkdMRSpWZWMzLlNJWkUpO1xuICAgIHRoaXMuX2JOb3JtYWxzICA9IG5ldyBGbG9hdDMyQXJyYXkoKE1BWF9CVUZGRVJfTEVOKSpTSVpFX09GX1RSSUFOR0xFKlZlYzMuU0laRSk7XG4gICAgdGhpcy5fYkNvbG9ycyAgID0gbmV3IEZsb2F0MzJBcnJheSgoTUFYX0JVRkZFUl9MRU4pKlNJWkVfT0ZfVFJJQU5HTEUqVmVjNC5TSVpFKTtcblxuICAgIHRoaXMuX3RlbXBWZXJ0aWNlcyA9IG5ldyBBcnJheShTSVpFX09GX0NVQkVfRURHRVMqVmVjMy5TSVpFKTtcbiAgICB0aGlzLl90ZW1wTm9ybWFscyAgPSBuZXcgQXJyYXkoU0laRV9PRl9DVUJFX0VER0VTKTtcblxuICAgIHRoaXMuX3NjYWxlWFlaID0gWzEsMSwxXTtcblxuICAgIHRoaXMuX2dlblN1cmZhY2UoKTtcblxufVxuXG5JU09TdXJmYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VvbTNkLnByb3RvdHlwZSk7XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy9cbi8vXG4vLyAgICAgICAgICAgMiAtLS0tLS0tIDMgICAgVmVydGV4IG9yZGVyXG4vLyAgICAgICAgICAvfCAgICAgICAgL3xcbi8vICAgICAgICAgLyB8ICAgICAgIC8gfFxuLy8gICAgICAgIDYgLS0tLS0tLSA3ICB8XG4vLyAgICAgICAgfCAgMCAtLS0tLXwtIDFcbi8vICAgICAgICB8IC8gICAgICAgfCAvXG4vLyAgICAgICAgfC8gICAgICAgIHwvXG4vLyAgICAgICAgNCAtLS0tLS0tIDVcbi8vXG4vL1xuLy8gICAgICAgICAgIDIgLS0tLS0tPiAzICAgIE1hcmNoIG9yZGVyXG4vLyAgICAgICAgICAgICAgXFxcbi8vICAgICAgICAgICAgICAgIFxcXG4vLyAgICAgICAgNiAtLS0tLS0+IDdcbi8vICAgICAgICAgICAwIC0tLS0tLT4gMVxuLy8gICAgICAgICAgICAgXFxcbi8vICAgICAgICAgICAgICAgXFxcbi8vICAgICAgICA0IC0tLS0tLT4gNVxuLy9cbi8vXG5cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxue1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHM7XG5cbiAgICB2YXIgY3ViZVNpemVYICA9IHRoaXMuX2N1YmVTaXplWCxcbiAgICAgICAgY3ViZVNpemVZICA9IHRoaXMuX2N1YmVTaXplWSxcbiAgICAgICAgY3ViZVNpemVaICA9IHRoaXMuX2N1YmVTaXplWixcbiAgICAgICAgY3ViZVNpemVaWSA9IGN1YmVTaXplWiAqIGN1YmVTaXplWTtcblxuICAgIHZhciBjdWJlcyA9IHRoaXMuX2N1YmVzLFxuICAgICAgICBjdWJlO1xuXG4gICAgdmFyIG1hcmNoSW5kZXg7XG5cbiAgICB2YXIgRURHRV9UQUJMRSA9IElTT1N1cmZhY2UuRURHRV9UQUJMRSxcbiAgICAgICAgVFJJX1RBQkxFICA9IElTT1N1cmZhY2UuVFJJX1RBQkxFO1xuXG4gICAgdmFyIHYwLHYxLHYyLHYzLHY0LHY1LHY2LHY3O1xuICAgIHZhciB2YWwwLHZhbDEsdmFsMix2YWwzLHZhbDQsdmFsNSx2YWw2LHZhbDc7XG5cbiAgICB2YXIgY3ViZUluZGV4O1xuICAgIHZhciBpc29MZXZlbCA9IHRoaXMuX2lzb0xldmVsO1xuICAgIHZhciBiaXRzO1xuXG4gICAgdmFyIGJWZXJ0aWNlcyAgID0gdGhpcy5fYlZlcnRpY2VzLFxuICAgICAgICBiTm9ybWFscyAgICA9IHRoaXMuX2JOb3JtYWxzLFxuICAgICAgICBiTm9ybWFsc0xlbiA9IGJOb3JtYWxzLmxlbmd0aCxcbiAgICAgICAgYlZlcnRJbmRleDtcblxuICAgIHZhciB2ZXJ0SW5kZXgwLCB2ZXJ0SW5kZXgxLCB2ZXJ0SW5kZXgyLFxuICAgICAgICB2ZXJ0SW5kZXgzLCB2ZXJ0SW5kZXg0LCB2ZXJ0SW5kZXg1LFxuICAgICAgICB2ZXJ0SW5kZXg2LCB2ZXJ0SW5kZXg3LCB2ZXJ0SW5kZXg4O1xuXG4gICAgdmFyIHYweCx2MHksdjB6LFxuICAgICAgICB2MXgsdjF5LHYxeixcbiAgICAgICAgdjJ4LHYyeSx2Mno7XG5cbiAgICB2YXIgZTJ4LCBlMnksIGUyeixcbiAgICAgICAgZTF4LCBlMXksIGUxejtcblxuICAgIHZhciB2MEluZGV4LFxuICAgICAgICB2MUluZGV4LFxuICAgICAgICB2MkluZGV4O1xuXG4gICAgdmFyIG54LCBueSwgbnosXG4gICAgICAgIHZieCwgdmJ5LCB2Yno7XG5cblxuICAgIHZhciBpLCBqLCBrO1xuXG4gICAgdGhpcy5fbnVtVHJpYW5nbGVzID0gMDtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2k8Yk5vcm1hbHNMZW4pYk5vcm1hbHNbaV09MC4wO1xuXG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgY3ViZVNpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBjdWJlU2l6ZVkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGsgPSAtMTtcbiAgICAgICAgICAgIHdoaWxlKCsrayA8IGN1YmVTaXplWClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICBtYXJjaEluZGV4ID0gaSAqIGN1YmVTaXplWlkgKyBqICogY3ViZVNpemVaICsgaztcbiAgICAgICAgICAgICAgICBjdWJlICAgICAgID0gY3ViZXNbbWFyY2hJbmRleF07XG5cbiAgICAgICAgICAgICAgICAvL2FjY2VzcyB2ZXJ0aWNlcyBvZiBjdWJlXG4gICAgICAgICAgICAgICAgdjAgPSB2ZXJ0c1tjdWJlWzBdXTtcbiAgICAgICAgICAgICAgICB2MSA9IHZlcnRzW2N1YmVbMV1dO1xuICAgICAgICAgICAgICAgIHYyID0gdmVydHNbY3ViZVsyXV07XG4gICAgICAgICAgICAgICAgdjMgPSB2ZXJ0c1tjdWJlWzNdXTtcbiAgICAgICAgICAgICAgICB2NCA9IHZlcnRzW2N1YmVbNF1dO1xuICAgICAgICAgICAgICAgIHY1ID0gdmVydHNbY3ViZVs1XV07XG4gICAgICAgICAgICAgICAgdjYgPSB2ZXJ0c1tjdWJlWzZdXTtcbiAgICAgICAgICAgICAgICB2NyA9IHZlcnRzW2N1YmVbN11dO1xuXG4gICAgICAgICAgICAgICAgdmFsMCA9IHYwWzNdO1xuICAgICAgICAgICAgICAgIHZhbDEgPSB2MVszXTtcbiAgICAgICAgICAgICAgICB2YWwyID0gdjJbM107XG4gICAgICAgICAgICAgICAgdmFsMyA9IHYzWzNdO1xuICAgICAgICAgICAgICAgIHZhbDQgPSB2NFszXTtcbiAgICAgICAgICAgICAgICB2YWw1ID0gdjVbM107XG4gICAgICAgICAgICAgICAgdmFsNiA9IHY2WzNdO1xuICAgICAgICAgICAgICAgIHZhbDcgPSB2N1szXTtcblxuICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgIGN1YmVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgICAgICBpZih2YWwwPGlzb0xldmVsKSBjdWJlSW5kZXggfD0gMTtcbiAgICAgICAgICAgICAgICBpZih2YWwxPGlzb0xldmVsKSBjdWJlSW5kZXggfD0gMjtcbiAgICAgICAgICAgICAgICBpZih2YWwyPGlzb0xldmVsKSBjdWJlSW5kZXggfD0gODtcbiAgICAgICAgICAgICAgICBpZih2YWwzPGlzb0xldmVsKSBjdWJlSW5kZXggfD0gNDtcbiAgICAgICAgICAgICAgICBpZih2YWw0PGlzb0xldmVsKSBjdWJlSW5kZXggfD0gMTY7XG4gICAgICAgICAgICAgICAgaWYodmFsNTxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDMyO1xuICAgICAgICAgICAgICAgIGlmKHZhbDY8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSAxMjg7XG4gICAgICAgICAgICAgICAgaWYodmFsNzxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDY0O1xuXG4gICAgICAgICAgICAgICAgYml0cyA9IEVER0VfVEFCTEVbY3ViZUluZGV4XTtcblxuICAgICAgICAgICAgICAgIGlmKGJpdHMgPT09IDApY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICB2YXIgdGVtcFZlcnRpY2VzID0gdGhpcy5fdGVtcFZlcnRpY2VzLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wTm9ybWFscyAgPSB0aGlzLl90ZW1wTm9ybWFscztcblxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MCwgdjEsIHRlbXBWZXJ0aWNlcywgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsMCx0ZW1wTm9ybWFscywwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYxLCB2MywgdGVtcFZlcnRpY2VzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcywxLHRlbXBOb3JtYWxzLDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjIsIHYzLCB0ZW1wVmVydGljZXMsIDIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDIsdGVtcE5vcm1hbHMsMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgOClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MCwgdjIsIHRlbXBWZXJ0aWNlcywgMyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsMyx0ZW1wTm9ybWFscywzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDE2KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHY0LCB2NSwgdGVtcFZlcnRpY2VzLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcyw0LHRlbXBOb3JtYWxzLDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDMyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHY1LCB2NywgdGVtcFZlcnRpY2VzLCA1KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcyw1LHRlbXBOb3JtYWxzLDUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDY0KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHY2LCB2NywgdGVtcFZlcnRpY2VzLCA2KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcyw2LHRlbXBOb3JtYWxzLDYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDEyOClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2NCwgdjYsIHRlbXBWZXJ0aWNlcywgNyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsNyx0ZW1wTm9ybWFscyw3KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDI1NilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MCwgdjQsIHRlbXBWZXJ0aWNlcywgOCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsOCx0ZW1wTm9ybWFscyw4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiA1MTIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjEsIHY1LCB0ZW1wVmVydGljZXMsIDkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDksdGVtcE5vcm1hbHMsOSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMTAyNClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MywgdjcsIHRlbXBWZXJ0aWNlcywgMTApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDEwLHRlbXBOb3JtYWxzLDEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAyMDQ4KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYyLCB2NiwgdGVtcFZlcnRpY2VzLCAxMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsMTEsdGVtcE5vcm1hbHMsMTEpO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgdmFyIGwgPSAwO1xuICAgICAgICAgICAgICAgIGN1YmVJbmRleCA8PD0gNDtcblxuXG4gICAgICAgICAgICAgICAgd2hpbGUoVFJJX1RBQkxFW2N1YmVJbmRleCArIGxdICE9IC0xKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgICAgIC8vZ2V0IGluZGljZXMgb2YgdHJpYW5nbGUgdmVydGljZXNcbiAgICAgICAgICAgICAgICAgICAgdjBJbmRleCA9IFRSSV9UQUJMRVtjdWJlSW5kZXggKyBsICAgIF0gKiAzO1xuICAgICAgICAgICAgICAgICAgICB2MUluZGV4ID0gVFJJX1RBQkxFW2N1YmVJbmRleCArIGwgKyAxXSAqIDM7XG4gICAgICAgICAgICAgICAgICAgIHYySW5kZXggPSBUUklfVEFCTEVbY3ViZUluZGV4ICsgbCArIDJdICogMztcblxuICAgICAgICAgICAgICAgICAgICBiVmVydEluZGV4ID0gdGhpcy5fbnVtVHJpYW5nbGVzICogOTtcblxuICAgICAgICAgICAgICAgICAgICB2ZXJ0SW5kZXgwID0gYlZlcnRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4MSA9IGJWZXJ0SW5kZXgrMTtcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4MiA9IGJWZXJ0SW5kZXgrMjtcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4MyA9IGJWZXJ0SW5kZXgrMztcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4NCA9IGJWZXJ0SW5kZXgrNDtcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4NSA9IGJWZXJ0SW5kZXgrNTtcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4NiA9IGJWZXJ0SW5kZXgrNjtcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4NyA9IGJWZXJ0SW5kZXgrNztcbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4OCA9IGJWZXJ0SW5kZXgrODtcblxuICAgICAgICAgICAgICAgICAgICAvL3N0b3JlIHRyaWFuZ2xlIHZlcnRpY2VzIGluICdnbG9iYWwnIHZlcnRleCBidWZmZXIgKyBsb2NhbCBjYWNoaW5nXG4gICAgICAgICAgICAgICAgICAgIHYweCA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXgwXSA9IHRlbXBWZXJ0aWNlc1t2MEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdjB5ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDFdID0gdGVtcFZlcnRpY2VzW3YwSW5kZXgrMV07XG4gICAgICAgICAgICAgICAgICAgIHYweiA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXgyXSA9IHRlbXBWZXJ0aWNlc1t2MEluZGV4KzJdO1xuXG4gICAgICAgICAgICAgICAgICAgIHYxeCA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXgzXSA9IHRlbXBWZXJ0aWNlc1t2MUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdjF5ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDRdID0gdGVtcFZlcnRpY2VzW3YxSW5kZXgrMV07XG4gICAgICAgICAgICAgICAgICAgIHYxeiA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXg1XSA9IHRlbXBWZXJ0aWNlc1t2MUluZGV4KzJdO1xuXG4gICAgICAgICAgICAgICAgICAgIHYyeCA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXg2XSA9IHRlbXBWZXJ0aWNlc1t2MkluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdjJ5ID0gYlZlcnRpY2VzW3ZlcnRJbmRleDddID0gdGVtcFZlcnRpY2VzW3YySW5kZXgrMV07XG4gICAgICAgICAgICAgICAgICAgIHYyeiA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXg4XSA9IHRlbXBWZXJ0aWNlc1t2MkluZGV4KzJdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgICAgICAvL2NhbGMgZmFjZSBub3JtYWxzIC0gcGVyIGZhY2UgLSBuYWl2ZSBUT0RPOkZJWE1FIVxuICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICB2YnggPSB2MXg7XG4gICAgICAgICAgICAgICAgICAgIHZieSA9IHYxeTtcbiAgICAgICAgICAgICAgICAgICAgdmJ6ID0gdjF6O1xuXG4gICAgICAgICAgICAgICAgICAgIGUxeCA9IHYweC12Yng7XG4gICAgICAgICAgICAgICAgICAgIGUxeSA9IHYweS12Ynk7XG4gICAgICAgICAgICAgICAgICAgIGUxeiA9IHYwei12Yno7XG5cbiAgICAgICAgICAgICAgICAgICAgZTJ4ID0gdjJ4LXZieDtcbiAgICAgICAgICAgICAgICAgICAgZTJ5ID0gdjJ5LXZieTtcbiAgICAgICAgICAgICAgICAgICAgZTJ6ID0gdjJ6LXZiejtcblxuICAgICAgICAgICAgICAgICAgICBueCA9IGUxeSAqIGUyeiAtIGUxeiAqIGUyeTtcbiAgICAgICAgICAgICAgICAgICAgbnkgPSBlMXogKiBlMnggLSBlMXggKiBlMno7XG4gICAgICAgICAgICAgICAgICAgIG56ID0gZTF4ICogZTJ5IC0gZTF5ICogZTJ4O1xuXG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDBdICs9IG54O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgxXSArPSBueTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4Ml0gKz0gbno7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDNdICs9IG54O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg0XSArPSBueTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4NV0gKz0gbno7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDZdICs9IG54O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg3XSArPSBueTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4OF0gKz0gbno7XG5cbiAgICAgICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgwXSA9IHRlbXBOb3JtYWxzW3YwSW5kZXggIF07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDFdID0gdGVtcE5vcm1hbHNbdjBJbmRleCsxXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4Ml0gPSB0ZW1wTm9ybWFsc1t2MEluZGV4KzJdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgzXSA9IHRlbXBOb3JtYWxzW3YxSW5kZXggIF07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDRdID0gdGVtcE5vcm1hbHNbdjFJbmRleCsxXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4NV0gPSB0ZW1wTm9ybWFsc1t2MUluZGV4KzJdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg2XSA9IHRlbXBOb3JtYWxzW3YySW5kZXggIF07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDddID0gdGVtcE5vcm1hbHNbdjJJbmRleCsxXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4OF0gPSB0ZW1wTm9ybWFsc1t2MkluZGV4KzJdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgICAgICBsKz0zO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9udW1UcmlhbmdsZXMrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT1N1cmZhY2UucHJvdG90eXBlLl9pbnRycGwgPSBmdW5jdGlvbih2MCx2MSx2ZXJ0TGlzdCxpbmRleClcbntcbiAgICBpbmRleCAqPSAzO1xuXG4gICAgdmFyIHYwdiA9IHYwWzNdLFxuICAgICAgICB2MXYgPSB2MVszXTtcblxuICAgIHZhciBpc29MZXZlbCA9IHRoaXMuX2lzb0xldmVsO1xuXG4gICAgaWYoTWF0aC5hYnMoaXNvTGV2ZWwgLSB2MHYpIDwgMC4wMDAwMSlcbiAgICB7XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICAgIF0gPSB2MFswXTtcbiAgICAgICAgdmVydExpc3RbaW5kZXggKyAxXSA9IHYwWzFdO1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCArIDJdID0gdjBbMl07XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihNYXRoLmFicyhpc29MZXZlbCAtIHYxdikgPCAwLjAwMDAxKVxuICAgIHtcbiAgICAgICAgdmVydExpc3RbaW5kZXggICAgXSA9IHYxWzBdO1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCArIDFdID0gdjFbMV07XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICsgMl0gPSB2MVsyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKE1hdGguYWJzKHYwdiAtIHYxdikgPCAwLjAwMDAxKVxuICAgIHtcbiAgICAgICAgdmVydExpc3RbaW5kZXggICAgXSA9IHYxWzBdO1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCArIDFdID0gdjFbMV07XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICsgMl0gPSB2MVsyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgdmFyIGludHJwbCAgPSAoaXNvTGV2ZWwgLSB2MHYpIC8gKHYxdiAtIHYwdik7XG5cbiAgICB2YXIgdjB4ID0gdjBbMF0sXG4gICAgICAgIHYweSA9IHYwWzFdLFxuICAgICAgICB2MHogPSB2MFsyXTtcblxuICAgIHZlcnRMaXN0W2luZGV4ICAgIF0gPSB2MHggKyAodjFbMF0gLSB2MHgpICogaW50cnBsO1xuICAgIHZlcnRMaXN0W2luZGV4ICsgMV0gPSB2MHkgKyAodjFbMV0gLSB2MHkpICogaW50cnBsO1xuICAgIHZlcnRMaXN0W2luZGV4ICsgMl0gPSB2MHogKyAodjFbMl0gLSB2MHopICogaW50cnBsO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5fbm9ybWFsID0gZnVuY3Rpb24odmVydExpc3QsdmVydEluZGV4LG5vcm1MaXN0LG5vcm1JbmRleClcbntcbiAgICB2ZXJ0SW5kZXggKj0gMztcblxuICAgIHZhciB4ID0gdmVydExpc3RbdmVydEluZGV4ICAgXSxcbiAgICAgICAgeSA9IHZlcnRMaXN0W3ZlcnRJbmRleCsxXSxcbiAgICAgICAgeiA9IHZlcnRMaXN0W3ZlcnRJbmRleCsyXTtcblxuICAgIHZhciBhcmcwID0gdGhpcy5fZnVuY0FyZzAsXG4gICAgICAgIGFyZzEgPSB0aGlzLl9mdW5jQXJnMSxcbiAgICAgICAgYXJnMiA9IHRoaXMuX2Z1bmNBcmcyO1xuXG4gICAgdmFyIGVwcyA9IDAuMDAwMztcblxuICAgIHZhciB2YWwgPSB0aGlzLl9mdW5jKHgseSx6LGFyZzAsYXJnMSxhcmcyKTtcblxuICAgIHZhciBueCA9IHRoaXMuX2Z1bmMoeCArIGVwcyx5ICwgeiwgYXJnMCwgYXJnMSwgYXJnMikgLSB2YWwsXG4gICAgICAgIG55ID0gdGhpcy5fZnVuYyh4LCB5ICsgZXBzLCB6LCBhcmcwLCBhcmcxLCBhcmcyKSAtIHZhbCxcbiAgICAgICAgbnogPSB0aGlzLl9mdW5jKHgsIHksIHogKyBlcHMsIGFyZzAsIGFyZzEsIGFyZzIpIC0gdmFsLFxuICAgICAgICBkICA9IDEgLyBNYXRoLnNxcnQobngqbngrbnkqbnkrbnoqbnopO1xuXG5cbiAgICBub3JtSW5kZXggKj0gMztcblxuICAgIG5vcm1MaXN0W25vcm1JbmRleF0gICA9IHgqZCotMTtcbiAgICBub3JtTGlzdFtub3JtSW5kZXgrMV0gPSB5KmQqLTE7XG4gICAgbm9ybUxpc3Rbbm9ybUluZGV4KzJdID0geipkKi0xO1xuXG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT1N1cmZhY2UucHJvdG90eXBlLnNldENsb3NlU2lkZXMgPSBmdW5jdGlvbihib29sKXt9XG5cbklTT1N1cmZhY2UucHJvdG90eXBlLnNldEZ1bmN0aW9uID0gZnVuY3Rpb24oZnVuYyxpc29MZXZlbClcbntcbiAgICB2YXIgZnVuY0FyZ3NMZW5ndGggPSBmdW5jLmxlbmd0aDtcblxuICAgIGlmKGZ1bmNBcmdzTGVuZ3RoIDwgMyl0aHJvdyAnRnVuY3Rpb24gc2hvdWxkIHNhdGlzZnkgZnVuY3Rpb24oeCx5LHope30nO1xuICAgIGlmKGZ1bmNBcmdzTGVuZ3RoID4gNil0aHJvdyAnRnVuY3Rpb24gaGFzIHRvIG1hbnkgYXJndW1lbnRzLiBBcmd1bWVudHMgbGVuZ3RoIHNob3VsZCBub3QgZXhjZWVkIDYuIEUuZyBmdW5jdGlvbih4LHkseixhcmcwLGFyZzEsYXJnMikuJztcblxuICAgIHZhciBmdW5jU3RyaW5nID0gZnVuYy50b1N0cmluZygpLFxuICAgICAgICBmdW5jQXJncyAgID0gZnVuY1N0cmluZy5zbGljZShmdW5jU3RyaW5nLmluZGV4T2YoJygnKSArIDEsIGZ1bmNTdHJpbmcuaW5kZXhPZignKScpKS5zcGxpdCgnLCcpLFxuICAgICAgICBmdW5jQm9keSAgID0gZnVuY1N0cmluZy5zbGljZShmdW5jU3RyaW5nLmluZGV4T2YoJ3snKSArIDEsIGZ1bmNTdHJpbmcubGFzdEluZGV4T2YoJ30nKSk7XG5cbiAgICB0aGlzLl9mdW5jICAgICA9IG5ldyBGdW5jdGlvbihmdW5jQXJnc1swXSwgZnVuY0FyZ3NbMV0sIGZ1bmNBcmdzWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmNBcmdzWzNdIHx8ICdhcmcwJywgZnVuY0FyZ3NbNF0gfHwgJ2FyZzEnLCBmdW5jQXJnc1s1XSB8fCAnYXJnMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY0JvZHkpO1xuICAgIHRoaXMuX2lzb0xldmVsID0gaXNvTGV2ZWwgfHwgMDtcbn07XG5cbklTT1N1cmZhY2UucHJvdG90eXBlLnNldEZ1bmN0aW9uVW5zYWZlID0gZnVuY3Rpb24oZnVuYyxpc29MZXZlbClcbntcbiAgICB0aGlzLl9mdW5jICAgICA9IGZ1bmM7XG4gICAgdGhpcy5faXNvTGV2ZWwgPSBpc29MZXZlbCB8fCAwO1xufTtcblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuZ2V0RnVuY3Rpb24gPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mdW5jO307XG5JU09TdXJmYWNlLnByb3RvdHlwZS5zZXRJU09MZXZlbCA9IGZ1bmN0aW9uKGlzb0xldmVsKXt0aGlzLl9pc29MZXZlbCA9IGlzb0xldmVsO307XG5cbklTT1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb24gICA9IGZ1bmN0aW9uKCkgICAgICAgICB7dGhpcy5hcHBseUZ1bmN0aW9uM2YoMCwwLDApO307XG5JU09TdXJmYWNlLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uMWYgPSBmdW5jdGlvbihhcmcwKSAgICAge3RoaXMuYXBwbHlGdW5jdGlvbjNmKGFyZzAsMCwwKTt9O1xuSVNPU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlGdW5jdGlvbjJmID0gZnVuY3Rpb24oYXJnMCxhcmcxKXt0aGlzLmFwcGx5RnVuY3Rpb24zZihhcmcwLGFyZzEsMCk7fTtcblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlGdW5jdGlvbjNmID0gZnVuY3Rpb24oYXJnMCxhcmcxLGFyZzIpXG57XG4gICAgdmFyIHZlcnRTaXplWCAgPSB0aGlzLl92ZXJ0U2l6ZVgsXG4gICAgICAgIHZlcnRTaXplWSAgPSB0aGlzLl92ZXJ0U2l6ZVksXG4gICAgICAgIHZlcnRTaXplWiAgPSB0aGlzLl92ZXJ0U2l6ZVosXG4gICAgICAgIHZlcnRTaXplWVggPSB2ZXJ0U2l6ZVkgKiB2ZXJ0U2l6ZVg7XG5cbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cyxcbiAgICAgICAgdmVydCwgdmVydHNJbmRleDtcblxuICAgIHZhciBpLCBqLCBrO1xuXG4gICAgdGhpcy5fZnVuY0FyZzAgPSBhcmcwO1xuICAgIHRoaXMuX2Z1bmNBcmcxID0gYXJnMTtcbiAgICB0aGlzLl9mdW5jQXJnMiA9IGFyZzI7XG5cbiAgICBpID0gLTE7XG5cbiAgICB3aGlsZSgrK2kgPCB2ZXJ0U2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHZlcnRTaXplWSlcbiAgICAgICAge1xuICAgICAgICAgICAgayA9IC0xO1xuICAgICAgICAgICAgd2hpbGUoKytrIDwgdmVydFNpemVYKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggPSBpICogdmVydFNpemVZWCArIGogKiB2ZXJ0U2l6ZVggKyBrO1xuICAgICAgICAgICAgICAgIHZlcnQgICAgICAgPSB2ZXJ0c1t2ZXJ0c0luZGV4XTtcbiAgICAgICAgICAgICAgICB2ZXJ0WzNdICAgID0gdGhpcy5fZnVuYyh2ZXJ0WzBdLHZlcnRbMV0sdmVydFsyXSxhcmcwLGFyZzEsYXJnMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuX2dlblN1cmZhY2UgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIHZlcnRTaXplWCAgPSB0aGlzLl92ZXJ0U2l6ZVgsXG4gICAgICAgIHZlcnRTaXplWSAgPSB0aGlzLl92ZXJ0U2l6ZVksXG4gICAgICAgIHZlcnRTaXplWiAgPSB0aGlzLl92ZXJ0U2l6ZVosXG4gICAgICAgIHZlcnRTaXplWlkgPSB2ZXJ0U2l6ZVogKiB2ZXJ0U2l6ZVksXG4gICAgICAgIHZlcnRTaXplWFkgPSB2ZXJ0U2l6ZVggKiB2ZXJ0U2l6ZVk7XG5cbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cyxcbiAgICAgICAgdmVydHNJbmRleDtcblxuICAgIHZhciBjdWJlU2l6ZVggID0gdGhpcy5fY3ViZVNpemVYLFxuICAgICAgICBjdWJlU2l6ZVkgID0gdGhpcy5fY3ViZVNpemVZLFxuICAgICAgICBjdWJlU2l6ZVogID0gdGhpcy5fY3ViZVNpemVaLFxuICAgICAgICBjdWJlU2l6ZVpZID0gY3ViZVNpemVZICogY3ViZVNpemVaO1xuXG4gICAgdmFyIGN1YmVzID0gdGhpcy5fY3ViZXMsXG4gICAgICAgIGNlbGxzSW5kZXg7XG5cbiAgICB2YXIgc2NhbGVYWVogPSB0aGlzLl9zY2FsZVhZWjtcblxuICAgIHZhciBpLCBqLCBrO1xuXG4gICAgaSA9IC0xO1xuXG4gICAgd2hpbGUoKytpIDwgdmVydFNpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCB2ZXJ0U2l6ZVkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGsgPSAtMTtcbiAgICAgICAgICAgIHdoaWxlKCsrayA8IHZlcnRTaXplWClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICAgICAgICA9IGkgKiB2ZXJ0U2l6ZVpZICsgaiAqIHZlcnRTaXplWiArIGs7XG5cbiAgICAgICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4XSA9IFsoLTAuNSArICggayAvICh2ZXJ0U2l6ZVggLSAxKSkpICogc2NhbGVYWVpbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC0wLjUgKyAoIGogLyAodmVydFNpemVZIC0gMSkpKSAqIHNjYWxlWFlaWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgtMC41ICsgKCBpIC8gKHZlcnRTaXplWiAtIDEpKSkgKiBzY2FsZVhZWlsyXSxcbiAgICAgICAgICAgICAgICAgICAgLTFdO1xuXG5cbiAgICAgICAgICAgICAgICBpZihpIDwgY3ViZVNpemVYICYmIGogPCBjdWJlU2l6ZVkgJiYgayAgPCBjdWJlU2l6ZVopXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjZWxsc0luZGV4ID0gaSAqIGN1YmVTaXplWlkgKyBqICogY3ViZVNpemVYICsgaztcblxuICAgICAgICAgICAgICAgICAgICBjdWJlc1tjZWxsc0luZGV4XSA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyB2ZXJ0U2l6ZVosXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgdmVydFNpemVaICsgMSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIHZlcnRTaXplWFksXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgdmVydFNpemVYWSArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgdmVydFNpemVaICsgdmVydFNpemVYWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyB2ZXJ0U2l6ZVogKyB2ZXJ0U2l6ZVhZICsgMVxuICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT1N1cmZhY2UucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oZ2wpXG57XG4gICAgZ2wuZGlzYWJsZURlZmF1bHRUZXhDb29yZHNBdHRyaWJBcnJheSgpO1xuICAgIGdsLmVuYWJsZURlZmF1bHROb3JtYWxBdHRyaWJBcnJheSgpO1xuXG4gICAgdmFyIF9nbCA9IGdsLmdsO1xuXG4gICAgdmFyIGdsQXJyYXlCdWZmZXIgPSBfZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICBnbEZsb2F0ICAgICAgID0gX2dsLkZMT0FUO1xuXG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy5fYlZlcnRpY2VzLFxuICAgICAgICBub3JtYWxzICA9IHRoaXMuX2JOb3JtYWxzLFxuICAgICAgICBjb2xvcnMgICA9IHRoaXMuX2JDb2xvcnM7XG5cbiAgICB2YXIgdmJsZW4gPSB2ZXJ0aWNlcy5ieXRlTGVuZ3RoLFxuICAgICAgICBuYmxlbiA9IG5vcm1hbHMuYnl0ZUxlbmd0aCxcbiAgICAgICAgY2JsZW4gPSBjb2xvcnMuYnl0ZUxlbmd0aDtcblxuICAgIHZhciBvZmZzZXRWID0gMCxcbiAgICAgICAgb2Zmc2V0TiA9IG9mZnNldFYgKyB2YmxlbixcbiAgICAgICAgb2Zmc2V0QyA9IG9mZnNldE4gKyBuYmxlbjtcblxuICAgIF9nbC5idWZmZXJEYXRhKGdsQXJyYXlCdWZmZXIsIHZibGVuICsgbmJsZW4gKyBjYmxlbiwgX2dsLkRZTkFNSUNfRFJBVyk7XG5cbiAgICBfZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRWLCAgdmVydGljZXMpO1xuICAgIF9nbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsIG9mZnNldE4sICBub3JtYWxzKTtcbiAgICBfZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRDLCAgY29sb3JzKTtcblxuICAgIF9nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsLmdldERlZmF1bHRWZXJ0ZXhBdHRyaWIoKSwgMywgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldFYpO1xuICAgIF9nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsLmdldERlZmF1bHROb3JtYWxBdHRyaWIoKSwgMywgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldE4pO1xuICAgIF9nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsLmdldERlZmF1bHRDb2xvckF0dHJpYigpLCAgNCwgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xuXG4gICAgZ2wuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgX2dsLmRyYXdBcnJheXMoX2dsLlRSSUFOR0xFUywwLHRoaXMuX251bVRyaWFuZ2xlcyAqIDMpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09TdXJmYWNlLkVER0VfVEFCTEUgPSBuZXcgSW50MzJBcnJheShcbiAgICBbXG4gICAgICAgIDB4MCAgLCAweDEwOSwgMHgyMDMsIDB4MzBhLCAweDQwNiwgMHg1MGYsIDB4NjA1LCAweDcwYyxcbiAgICAgICAgMHg4MGMsIDB4OTA1LCAweGEwZiwgMHhiMDYsIDB4YzBhLCAweGQwMywgMHhlMDksIDB4ZjAwLFxuICAgICAgICAweDE5MCwgMHg5OSAsIDB4MzkzLCAweDI5YSwgMHg1OTYsIDB4NDlmLCAweDc5NSwgMHg2OWMsXG4gICAgICAgIDB4OTljLCAweDg5NSwgMHhiOWYsIDB4YTk2LCAweGQ5YSwgMHhjOTMsIDB4Zjk5LCAweGU5MCxcbiAgICAgICAgMHgyMzAsIDB4MzM5LCAweDMzICwgMHgxM2EsIDB4NjM2LCAweDczZiwgMHg0MzUsIDB4NTNjLFxuICAgICAgICAweGEzYywgMHhiMzUsIDB4ODNmLCAweDkzNiwgMHhlM2EsIDB4ZjMzLCAweGMzOSwgMHhkMzAsXG4gICAgICAgIDB4M2EwLCAweDJhOSwgMHgxYTMsIDB4YWEgLCAweDdhNiwgMHg2YWYsIDB4NWE1LCAweDRhYyxcbiAgICAgICAgMHhiYWMsIDB4YWE1LCAweDlhZiwgMHg4YTYsIDB4ZmFhLCAweGVhMywgMHhkYTksIDB4Y2EwLFxuICAgICAgICAweDQ2MCwgMHg1NjksIDB4NjYzLCAweDc2YSwgMHg2NiAsIDB4MTZmLCAweDI2NSwgMHgzNmMsXG4gICAgICAgIDB4YzZjLCAweGQ2NSwgMHhlNmYsIDB4ZjY2LCAweDg2YSwgMHg5NjMsIDB4YTY5LCAweGI2MCxcbiAgICAgICAgMHg1ZjAsIDB4NGY5LCAweDdmMywgMHg2ZmEsIDB4MWY2LCAweGZmICwgMHgzZjUsIDB4MmZjLFxuICAgICAgICAweGRmYywgMHhjZjUsIDB4ZmZmLCAweGVmNiwgMHg5ZmEsIDB4OGYzLCAweGJmOSwgMHhhZjAsXG4gICAgICAgIDB4NjUwLCAweDc1OSwgMHg0NTMsIDB4NTVhLCAweDI1NiwgMHgzNWYsIDB4NTUgLCAweDE1YyxcbiAgICAgICAgMHhlNWMsIDB4ZjU1LCAweGM1ZiwgMHhkNTYsIDB4YTVhLCAweGI1MywgMHg4NTksIDB4OTUwLFxuICAgICAgICAweDdjMCwgMHg2YzksIDB4NWMzLCAweDRjYSwgMHgzYzYsIDB4MmNmLCAweDFjNSwgMHhjYyAsXG4gICAgICAgIDB4ZmNjLCAweGVjNSwgMHhkY2YsIDB4Y2M2LCAweGJjYSwgMHhhYzMsIDB4OWM5LCAweDhjMCxcbiAgICAgICAgMHg4YzAsIDB4OWM5LCAweGFjMywgMHhiY2EsIDB4Y2M2LCAweGRjZiwgMHhlYzUsIDB4ZmNjLFxuICAgICAgICAweGNjICwgMHgxYzUsIDB4MmNmLCAweDNjNiwgMHg0Y2EsIDB4NWMzLCAweDZjOSwgMHg3YzAsXG4gICAgICAgIDB4OTUwLCAweDg1OSwgMHhiNTMsIDB4YTVhLCAweGQ1NiwgMHhjNWYsIDB4ZjU1LCAweGU1YyxcbiAgICAgICAgMHgxNWMsIDB4NTUgLCAweDM1ZiwgMHgyNTYsIDB4NTVhLCAweDQ1MywgMHg3NTksIDB4NjUwLFxuICAgICAgICAweGFmMCwgMHhiZjksIDB4OGYzLCAweDlmYSwgMHhlZjYsIDB4ZmZmLCAweGNmNSwgMHhkZmMsXG4gICAgICAgIDB4MmZjLCAweDNmNSwgMHhmZiAsIDB4MWY2LCAweDZmYSwgMHg3ZjMsIDB4NGY5LCAweDVmMCxcbiAgICAgICAgMHhiNjAsIDB4YTY5LCAweDk2MywgMHg4NmEsIDB4ZjY2LCAweGU2ZiwgMHhkNjUsIDB4YzZjLFxuICAgICAgICAweDM2YywgMHgyNjUsIDB4MTZmLCAweDY2ICwgMHg3NmEsIDB4NjYzLCAweDU2OSwgMHg0NjAsXG4gICAgICAgIDB4Y2EwLCAweGRhOSwgMHhlYTMsIDB4ZmFhLCAweDhhNiwgMHg5YWYsIDB4YWE1LCAweGJhYyxcbiAgICAgICAgMHg0YWMsIDB4NWE1LCAweDZhZiwgMHg3YTYsIDB4YWEgLCAweDFhMywgMHgyYTksIDB4M2EwLFxuICAgICAgICAweGQzMCwgMHhjMzksIDB4ZjMzLCAweGUzYSwgMHg5MzYsIDB4ODNmLCAweGIzNSwgMHhhM2MsXG4gICAgICAgIDB4NTNjLCAweDQzNSwgMHg3M2YsIDB4NjM2LCAweDEzYSwgMHgzMyAsIDB4MzM5LCAweDIzMCxcbiAgICAgICAgMHhlOTAsIDB4Zjk5LCAweGM5MywgMHhkOWEsIDB4YTk2LCAweGI5ZiwgMHg4OTUsIDB4OTljLFxuICAgICAgICAweDY5YywgMHg3OTUsIDB4NDlmLCAweDU5NiwgMHgyOWEsIDB4MzkzLCAweDk5ICwgMHgxOTAsXG4gICAgICAgIDB4ZjAwLCAweGUwOSwgMHhkMDMsIDB4YzBhLCAweGIwNiwgMHhhMGYsIDB4OTA1LCAweDgwYyxcbiAgICAgICAgMHg3MGMsIDB4NjA1LCAweDUwZiwgMHg0MDYsIDB4MzBhLCAweDIwMywgMHgxMDksIDB4MFxuICAgIF0pO1xuXG5JU09TdXJmYWNlLlRSSV9UQUJMRSA9IG5ldyBJbnQzMkFycmF5KFxuICAgIFtcbiAgICAgICAgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgOCwgMywgOSwgOCwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMywgMSwgMiwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAyLCAxMCwgMCwgMiwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDgsIDMsIDIsIDEwLCA4LCAxMCwgOSwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDExLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMTEsIDIsIDgsIDExLCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgOSwgMCwgMiwgMywgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAxMSwgMiwgMSwgOSwgMTEsIDksIDgsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMTAsIDEsIDExLCAxMCwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEwLCAxLCAwLCA4LCAxMCwgOCwgMTEsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgOSwgMCwgMywgMTEsIDksIDExLCAxMCwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDgsIDEwLCAxMCwgOCwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA3LCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMywgMCwgNywgMywgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDksIDgsIDQsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAxLCA5LCA0LCA3LCAxLCA3LCAzLCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTAsIDgsIDQsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCA0LCA3LCAzLCAwLCA0LCAxLCAyLCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDIsIDEwLCA5LCAwLCAyLCA4LCA0LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMTAsIDksIDIsIDksIDcsIDIsIDcsIDMsIDcsIDksIDQsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA0LCA3LCAzLCAxMSwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCA0LCA3LCAxMSwgMiwgNCwgMiwgMCwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDAsIDEsIDgsIDQsIDcsIDIsIDMsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgNywgMTEsIDksIDQsIDExLCA5LCAxMSwgMiwgOSwgMiwgMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDEwLCAxLCAzLCAxMSwgMTAsIDcsIDgsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAxMSwgMTAsIDEsIDQsIDExLCAxLCAwLCA0LCA3LCAxMSwgNCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDcsIDgsIDksIDAsIDExLCA5LCAxMSwgMTAsIDExLCAwLCAzLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgNywgMTEsIDQsIDExLCA5LCA5LCAxMSwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNCwgMCwgOCwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDUsIDQsIDEsIDUsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA1LCA0LCA4LCAzLCA1LCAzLCAxLCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTAsIDksIDUsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAwLCA4LCAxLCAyLCAxMCwgNCwgOSwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDIsIDEwLCA1LCA0LCAyLCA0LCAwLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMTAsIDUsIDMsIDIsIDUsIDMsIDUsIDQsIDMsIDQsIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA0LCAyLCAzLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDExLCAyLCAwLCA4LCAxMSwgNCwgOSwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDUsIDQsIDAsIDEsIDUsIDIsIDMsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMSwgNSwgMiwgNSwgOCwgMiwgOCwgMTEsIDQsIDgsIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgMywgMTEsIDEwLCAxLCAzLCA5LCA1LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgOSwgNSwgMCwgOCwgMSwgOCwgMTAsIDEsIDgsIDExLCAxMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDQsIDAsIDUsIDAsIDExLCA1LCAxMSwgMTAsIDExLCAwLCAzLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgNCwgOCwgNSwgOCwgMTAsIDEwLCA4LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDcsIDgsIDUsIDcsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAzLCAwLCA5LCA1LCAzLCA1LCA3LCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNywgOCwgMCwgMSwgNywgMSwgNSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDUsIDMsIDMsIDUsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA3LCA4LCA5LCA1LCA3LCAxMCwgMSwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCAxLCAyLCA5LCA1LCAwLCA1LCAzLCAwLCA1LCA3LCAzLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMCwgMiwgOCwgMiwgNSwgOCwgNSwgNywgMTAsIDUsIDIsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAxMCwgNSwgMiwgNSwgMywgMywgNSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDksIDUsIDcsIDgsIDksIDMsIDExLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNywgOSwgNywgMiwgOSwgMiwgMCwgMiwgNywgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAzLCAxMSwgMCwgMSwgOCwgMSwgNywgOCwgMSwgNSwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCAyLCAxLCAxMSwgMSwgNywgNywgMSwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDgsIDgsIDUsIDcsIDEwLCAxLCAzLCAxMCwgMywgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCA3LCAwLCA1LCAwLCA5LCA3LCAxMSwgMCwgMSwgMCwgMTAsIDExLCAxMCwgMCwgLTEsXG4gICAgICAgIDExLCAxMCwgMCwgMTEsIDAsIDMsIDEwLCA1LCAwLCA4LCAwLCA3LCA1LCA3LCAwLCAtMSxcbiAgICAgICAgMTEsIDEwLCA1LCA3LCAxMSwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA2LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMywgNSwgMTAsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAwLCAxLCA1LCAxMCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDgsIDMsIDEsIDksIDgsIDUsIDEwLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNiwgNSwgMiwgNiwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDYsIDUsIDEsIDIsIDYsIDMsIDAsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA2LCA1LCA5LCAwLCA2LCAwLCAyLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgOSwgOCwgNSwgOCwgMiwgNSwgMiwgNiwgMywgMiwgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDMsIDExLCAxMCwgNiwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCAwLCA4LCAxMSwgMiwgMCwgMTAsIDYsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCA5LCAyLCAzLCAxMSwgNSwgMTAsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAxMCwgNiwgMSwgOSwgMiwgOSwgMTEsIDIsIDksIDgsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgMywgMTEsIDYsIDUsIDMsIDUsIDEsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAxMSwgMCwgMTEsIDUsIDAsIDUsIDEsIDUsIDExLCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMTEsIDYsIDAsIDMsIDYsIDAsIDYsIDUsIDAsIDUsIDksIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCA1LCA5LCA2LCA5LCAxMSwgMTEsIDksIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAxMCwgNiwgNCwgNywgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDMsIDAsIDQsIDcsIDMsIDYsIDUsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgOSwgMCwgNSwgMTAsIDYsIDgsIDQsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNiwgNSwgMSwgOSwgNywgMSwgNywgMywgNywgOSwgNCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDEsIDIsIDYsIDUsIDEsIDQsIDcsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCA1LCA1LCAyLCA2LCAzLCAwLCA0LCAzLCA0LCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgNCwgNywgOSwgMCwgNSwgMCwgNiwgNSwgMCwgMiwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDMsIDksIDcsIDksIDQsIDMsIDIsIDksIDUsIDksIDYsIDIsIDYsIDksIC0xLFxuICAgICAgICAzLCAxMSwgMiwgNywgOCwgNCwgMTAsIDYsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAxMCwgNiwgNCwgNywgMiwgNCwgMiwgMCwgMiwgNywgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCA5LCA0LCA3LCA4LCAyLCAzLCAxMSwgNSwgMTAsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAyLCAxLCA5LCAxMSwgMiwgOSwgNCwgMTEsIDcsIDExLCA0LCA1LCAxMCwgNiwgLTEsXG4gICAgICAgIDgsIDQsIDcsIDMsIDExLCA1LCAzLCA1LCAxLCA1LCAxMSwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDEsIDExLCA1LCAxMSwgNiwgMSwgMCwgMTEsIDcsIDExLCA0LCAwLCA0LCAxMSwgLTEsXG4gICAgICAgIDAsIDUsIDksIDAsIDYsIDUsIDAsIDMsIDYsIDExLCA2LCAzLCA4LCA0LCA3LCAtMSxcbiAgICAgICAgNiwgNSwgOSwgNiwgOSwgMTEsIDQsIDcsIDksIDcsIDExLCA5LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDQsIDksIDYsIDQsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMTAsIDYsIDQsIDksIDEwLCAwLCA4LCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDAsIDEsIDEwLCA2LCAwLCA2LCA0LCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMywgMSwgOCwgMSwgNiwgOCwgNiwgNCwgNiwgMSwgMTAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA0LCA5LCAxLCAyLCA0LCAyLCA2LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMCwgOCwgMSwgMiwgOSwgMiwgNCwgOSwgMiwgNiwgNCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDIsIDQsIDQsIDIsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAzLCAyLCA4LCAyLCA0LCA0LCAyLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDQsIDksIDEwLCA2LCA0LCAxMSwgMiwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDIsIDIsIDgsIDExLCA0LCA5LCAxMCwgNCwgMTAsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxMSwgMiwgMCwgMSwgNiwgMCwgNiwgNCwgNiwgMSwgMTAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCA0LCAxLCA2LCAxLCAxMCwgNCwgOCwgMSwgMiwgMSwgMTEsIDgsIDExLCAxLCAtMSxcbiAgICAgICAgOSwgNiwgNCwgOSwgMywgNiwgOSwgMSwgMywgMTEsIDYsIDMsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAxMSwgMSwgOCwgMSwgMCwgMTEsIDYsIDEsIDksIDEsIDQsIDYsIDQsIDEsIC0xLFxuICAgICAgICAzLCAxMSwgNiwgMywgNiwgMCwgMCwgNiwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDQsIDgsIDExLCA2LCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgMTAsIDYsIDcsIDgsIDEwLCA4LCA5LCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDcsIDMsIDAsIDEwLCA3LCAwLCA5LCAxMCwgNiwgNywgMTAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNiwgNywgMSwgMTAsIDcsIDEsIDcsIDgsIDEsIDgsIDAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNiwgNywgMTAsIDcsIDEsIDEsIDcsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCA2LCAxLCA2LCA4LCAxLCA4LCA5LCA4LCA2LCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgNiwgOSwgMiwgOSwgMSwgNiwgNywgOSwgMCwgOSwgMywgNywgMywgOSwgLTEsXG4gICAgICAgIDcsIDgsIDAsIDcsIDAsIDYsIDYsIDAsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCAzLCAyLCA2LCA3LCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMywgMTEsIDEwLCA2LCA4LCAxMCwgOCwgOSwgOCwgNiwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDAsIDcsIDIsIDcsIDExLCAwLCA5LCA3LCA2LCA3LCAxMCwgOSwgMTAsIDcsIC0xLFxuICAgICAgICAxLCA4LCAwLCAxLCA3LCA4LCAxLCAxMCwgNywgNiwgNywgMTAsIDIsIDMsIDExLCAtMSxcbiAgICAgICAgMTEsIDIsIDEsIDExLCAxLCA3LCAxMCwgNiwgMSwgNiwgNywgMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDksIDYsIDgsIDYsIDcsIDksIDEsIDYsIDExLCA2LCAzLCAxLCAzLCA2LCAtMSxcbiAgICAgICAgMCwgOSwgMSwgMTEsIDYsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCA4LCAwLCA3LCAwLCA2LCAzLCAxMSwgMCwgMTEsIDYsIDAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCAxMSwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDYsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMCwgOCwgMTEsIDcsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCA5LCAxMSwgNywgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDEsIDksIDgsIDMsIDEsIDExLCA3LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDEsIDIsIDYsIDExLCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgMTAsIDMsIDAsIDgsIDYsIDExLCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgOSwgMCwgMiwgMTAsIDksIDYsIDExLCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgMTEsIDcsIDIsIDEwLCAzLCAxMCwgOCwgMywgMTAsIDksIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCAyLCAzLCA2LCAyLCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgMCwgOCwgNywgNiwgMCwgNiwgMiwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDcsIDYsIDIsIDMsIDcsIDAsIDEsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA2LCAyLCAxLCA4LCA2LCAxLCA5LCA4LCA4LCA3LCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDcsIDYsIDEwLCAxLCA3LCAxLCAzLCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDcsIDYsIDEsIDcsIDEwLCAxLCA4LCA3LCAxLCAwLCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMywgNywgMCwgNywgMTAsIDAsIDEwLCA5LCA2LCAxMCwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDYsIDEwLCA3LCAxMCwgOCwgOCwgMTAsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCA4LCA0LCAxMSwgOCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDYsIDExLCAzLCAwLCA2LCAwLCA0LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgNiwgMTEsIDgsIDQsIDYsIDksIDAsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA0LCA2LCA5LCA2LCAzLCA5LCAzLCAxLCAxMSwgMywgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDgsIDQsIDYsIDExLCA4LCAyLCAxMCwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDEwLCAzLCAwLCAxMSwgMCwgNiwgMTEsIDAsIDQsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAxMSwgOCwgNCwgNiwgMTEsIDAsIDIsIDksIDIsIDEwLCA5LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDksIDMsIDEwLCAzLCAyLCA5LCA0LCAzLCAxMSwgMywgNiwgNCwgNiwgMywgLTEsXG4gICAgICAgIDgsIDIsIDMsIDgsIDQsIDIsIDQsIDYsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA0LCAyLCA0LCA2LCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgOSwgMCwgMiwgMywgNCwgMiwgNCwgNiwgNCwgMywgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDksIDQsIDEsIDQsIDIsIDIsIDQsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAxLCAzLCA4LCA2LCAxLCA4LCA0LCA2LCA2LCAxMCwgMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCAxLCAwLCAxMCwgMCwgNiwgNiwgMCwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDYsIDMsIDQsIDMsIDgsIDYsIDEwLCAzLCAwLCAzLCA5LCAxMCwgOSwgMywgLTEsXG4gICAgICAgIDEwLCA5LCA0LCA2LCAxMCwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDksIDUsIDcsIDYsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMywgNCwgOSwgNSwgMTEsIDcsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAwLCAxLCA1LCA0LCAwLCA3LCA2LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCA3LCA2LCA4LCAzLCA0LCAzLCA1LCA0LCAzLCAxLCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNCwgMTAsIDEsIDIsIDcsIDYsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgMTEsIDcsIDEsIDIsIDEwLCAwLCA4LCAzLCA0LCA5LCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgNiwgMTEsIDUsIDQsIDEwLCA0LCAyLCAxMCwgNCwgMCwgMiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDQsIDgsIDMsIDUsIDQsIDMsIDIsIDUsIDEwLCA1LCAyLCAxMSwgNywgNiwgLTEsXG4gICAgICAgIDcsIDIsIDMsIDcsIDYsIDIsIDUsIDQsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA0LCAwLCA4LCA2LCAwLCA2LCAyLCA2LCA4LCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgNiwgMiwgMywgNywgNiwgMSwgNSwgMCwgNSwgNCwgMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDIsIDgsIDYsIDgsIDcsIDIsIDEsIDgsIDQsIDgsIDUsIDEsIDUsIDgsIC0xLFxuICAgICAgICA5LCA1LCA0LCAxMCwgMSwgNiwgMSwgNywgNiwgMSwgMywgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDYsIDEwLCAxLCA3LCA2LCAxLCAwLCA3LCA4LCA3LCAwLCA5LCA1LCA0LCAtMSxcbiAgICAgICAgNCwgMCwgMTAsIDQsIDEwLCA1LCAwLCAzLCAxMCwgNiwgMTAsIDcsIDMsIDcsIDEwLCAtMSxcbiAgICAgICAgNywgNiwgMTAsIDcsIDEwLCA4LCA1LCA0LCAxMCwgNCwgOCwgMTAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCA5LCA1LCA2LCAxMSwgOSwgMTEsIDgsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCA2LCAxMSwgMCwgNiwgMywgMCwgNSwgNiwgMCwgOSwgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDExLCA4LCAwLCA1LCAxMSwgMCwgMSwgNSwgNSwgNiwgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCAxMSwgMywgNiwgMywgNSwgNSwgMywgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDEwLCA5LCA1LCAxMSwgOSwgMTEsIDgsIDExLCA1LCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMTEsIDMsIDAsIDYsIDExLCAwLCA5LCA2LCA1LCA2LCA5LCAxLCAyLCAxMCwgLTEsXG4gICAgICAgIDExLCA4LCA1LCAxMSwgNSwgNiwgOCwgMCwgNSwgMTAsIDUsIDIsIDAsIDIsIDUsIC0xLFxuICAgICAgICA2LCAxMSwgMywgNiwgMywgNSwgMiwgMTAsIDMsIDEwLCA1LCAzLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgOCwgOSwgNSwgMiwgOCwgNSwgNiwgMiwgMywgOCwgMiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDYsIDksIDYsIDAsIDAsIDYsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA1LCA4LCAxLCA4LCAwLCA1LCA2LCA4LCAzLCA4LCAyLCA2LCAyLCA4LCAtMSxcbiAgICAgICAgMSwgNSwgNiwgMiwgMSwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDMsIDYsIDEsIDYsIDEwLCAzLCA4LCA2LCA1LCA2LCA5LCA4LCA5LCA2LCAtMSxcbiAgICAgICAgMTAsIDEsIDAsIDEwLCAwLCA2LCA5LCA1LCAwLCA1LCA2LCAwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMywgOCwgNSwgNiwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNSwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCA1LCAxMCwgNywgNSwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgNSwgMTAsIDExLCA3LCA1LCA4LCAzLCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMTEsIDcsIDUsIDEwLCAxMSwgMSwgOSwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA3LCA1LCAxMCwgMTEsIDcsIDksIDgsIDEsIDgsIDMsIDEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgMSwgMiwgMTEsIDcsIDEsIDcsIDUsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAzLCAxLCAyLCA3LCAxLCA3LCA1LCA3LCAyLCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDcsIDUsIDksIDIsIDcsIDksIDAsIDIsIDIsIDExLCA3LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgNSwgMiwgNywgMiwgMTEsIDUsIDksIDIsIDMsIDIsIDgsIDksIDgsIDIsIC0xLFxuICAgICAgICAyLCA1LCAxMCwgMiwgMywgNSwgMywgNywgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDIsIDAsIDgsIDUsIDIsIDgsIDcsIDUsIDEwLCAyLCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMCwgMSwgNSwgMTAsIDMsIDUsIDMsIDcsIDMsIDEwLCAyLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgOCwgMiwgOSwgMiwgMSwgOCwgNywgMiwgMTAsIDIsIDUsIDcsIDUsIDIsIC0xLFxuICAgICAgICAxLCAzLCA1LCAzLCA3LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgNywgMCwgNywgMSwgMSwgNywgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDAsIDMsIDksIDMsIDUsIDUsIDMsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA4LCA3LCA1LCA5LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgOCwgNCwgNSwgMTAsIDgsIDEwLCAxMSwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDAsIDQsIDUsIDExLCAwLCA1LCAxMCwgMTEsIDExLCAzLCAwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgOSwgOCwgNCwgMTAsIDgsIDEwLCAxMSwgMTAsIDQsIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgMTEsIDQsIDEwLCA0LCA1LCAxMSwgMywgNCwgOSwgNCwgMSwgMywgMSwgNCwgLTEsXG4gICAgICAgIDIsIDUsIDEsIDIsIDgsIDUsIDIsIDExLCA4LCA0LCA1LCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNCwgMTEsIDAsIDExLCAzLCA0LCA1LCAxMSwgMiwgMTEsIDEsIDUsIDEsIDExLCAtMSxcbiAgICAgICAgMCwgMiwgNSwgMCwgNSwgOSwgMiwgMTEsIDUsIDQsIDUsIDgsIDExLCA4LCA1LCAtMSxcbiAgICAgICAgOSwgNCwgNSwgMiwgMTEsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCA1LCAxMCwgMywgNSwgMiwgMywgNCwgNSwgMywgOCwgNCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDEwLCAyLCA1LCAyLCA0LCA0LCAyLCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMTAsIDIsIDMsIDUsIDEwLCAzLCA4LCA1LCA0LCA1LCA4LCAwLCAxLCA5LCAtMSxcbiAgICAgICAgNSwgMTAsIDIsIDUsIDIsIDQsIDEsIDksIDIsIDksIDQsIDIsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA0LCA1LCA4LCA1LCAzLCAzLCA1LCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNCwgNSwgMSwgMCwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDQsIDUsIDgsIDUsIDMsIDksIDAsIDUsIDAsIDMsIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA0LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMTEsIDcsIDQsIDksIDExLCA5LCAxMCwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAzLCA0LCA5LCA3LCA5LCAxMSwgNywgOSwgMTAsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMTAsIDExLCAxLCAxMSwgNCwgMSwgNCwgMCwgNywgNCwgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxLCA0LCAzLCA0LCA4LCAxLCAxMCwgNCwgNywgNCwgMTEsIDEwLCAxMSwgNCwgLTEsXG4gICAgICAgIDQsIDExLCA3LCA5LCAxMSwgNCwgOSwgMiwgMTEsIDksIDEsIDIsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA3LCA0LCA5LCAxMSwgNywgOSwgMSwgMTEsIDIsIDExLCAxLCAwLCA4LCAzLCAtMSxcbiAgICAgICAgMTEsIDcsIDQsIDExLCA0LCAyLCAyLCA0LCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDcsIDQsIDExLCA0LCAyLCA4LCAzLCA0LCAzLCAyLCA0LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgOSwgMTAsIDIsIDcsIDksIDIsIDMsIDcsIDcsIDQsIDksIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAxMCwgNywgOSwgNywgNCwgMTAsIDIsIDcsIDgsIDcsIDAsIDIsIDAsIDcsIC0xLFxuICAgICAgICAzLCA3LCAxMCwgMywgMTAsIDIsIDcsIDQsIDEwLCAxLCAxMCwgMCwgNCwgMCwgMTAsIC0xLFxuICAgICAgICAxLCAxMCwgMiwgOCwgNywgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDksIDEsIDQsIDEsIDcsIDcsIDEsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA5LCAxLCA0LCAxLCA3LCAwLCA4LCAxLCA4LCA3LCAxLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMCwgMywgNywgNCwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDgsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAxMCwgOCwgMTAsIDExLCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMCwgOSwgMywgOSwgMTEsIDExLCA5LCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDEwLCAwLCAxMCwgOCwgOCwgMTAsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMSwgMTAsIDExLCAzLCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDExLCAxLCAxMSwgOSwgOSwgMTEsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAwLCA5LCAzLCA5LCAxMSwgMSwgMiwgOSwgMiwgMTEsIDksIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAyLCAxMSwgOCwgMCwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAyLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDMsIDgsIDIsIDgsIDEwLCAxMCwgOCwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDEwLCAyLCAwLCA5LCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMywgOCwgMiwgOCwgMTAsIDAsIDEsIDgsIDEsIDEwLCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMTAsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAzLCA4LCA5LCAxLCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOSwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDMsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMVxuICAgIF0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElTT1N1cmZhY2U7IiwiXG5tb2R1bGUuZXhwb3J0cyA9XG57XG5cbiAgICAvL1RPRE86IGNsZWFuIHVwXG5cbiAgICBpc1BvaW50TGVmdCA6IGZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICggeDEgLSB4MCApICogKCB5MiAtIHkwICkgLSAoeDIgLSB4MCkgKiAoeTEgLSB5MCk7XG4gICAgfSxcblxuICAgIC8vaHR0cDovL2FsaWVucnlkZXJmbGV4LmNvbS9pbnRlcnNlY3QvXG4gICAgaXNJbnRlcnNlY3Rpb25mIDogZnVuY3Rpb24oYXgsYXksYngsYnksY3gsY3ksZHgsZHksb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIGRpc3RBQixcbiAgICAgICAgICAgIGNvcyxcbiAgICAgICAgICAgIHNpbixcbiAgICAgICAgICAgIG5ld1gsXG4gICAgICAgICAgICBwb3NhYjtcblxuICAgICAgICBpZiAoYXggPT0gYnggJiYgYXkgPT0gYnkgfHxcbiAgICAgICAgICAgIGN4ID09IGR4ICYmIGN5ID09IGR5KVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGJ4IC09IGF4O1xuICAgICAgICBieSAtPSBheTtcbiAgICAgICAgY3ggLT0gYXg7XG4gICAgICAgIGN5IC09IGF5O1xuICAgICAgICBkeCAtPSBheDtcbiAgICAgICAgZHkgLT0gYXk7XG5cbiAgICAgICAgZGlzdEFCID0gMSAvIChNYXRoLnNxcnQoYngqYngrYnkqYnkpIHx8IDEpO1xuXG4gICAgICAgIGNvcyAgPSBieCAqIGRpc3RBQjtcbiAgICAgICAgc2luICA9IGJ5ICogZGlzdEFCO1xuICAgICAgICBuZXdYID0gY3ggKiBjb3MgKyBjeSAqIHNpbjtcbiAgICAgICAgY3kgICA9IGN5ICogY29zIC0gY3ggKiBzaW47XG4gICAgICAgIGN4ICAgPSBuZXdYO1xuICAgICAgICBuZXdYID0gZHggKiBjb3MgKyBkeSAqIHNpbjtcbiAgICAgICAgZHkgICA9IGR5ICogY29zIC0gZHggKiBzaW47XG4gICAgICAgIGR4ICAgPSBuZXdYO1xuXG4gICAgICAgIGlmIChjeSA9PSBkeSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHBvc2FiICA9IGR4ICsgKCBjeCAtIGR4ICkgKiBkeSAvICggZHkgLSBjeSApO1xuXG4gICAgICAgIGlmKG91dClcbiAgICAgICAge1xuICAgICAgICAgICAgb3V0WzBdID0gYXggKyBwb3NhYiAqIGNvcztcbiAgICAgICAgICAgIG91dFsxXSA9IGF5ICsgcG9zYWIgKiBzaW47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaXNJbnRlcnNlY3Rpb24gOiBmdW5jdGlvbihsMCxsMSxvdXQpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0ludGVyc2VjdGlvbmYobDBbMF0sbDBbMV0sbDBbMl0sbDBbM10sbDFbMF0sbDBbMV0sbDFbMl0sbDFbM10sb3V0KTtcbiAgICB9ICxcblxuICAgIGlzU2VnbWVudEludGVyc2VjdGlvbmYgOiBmdW5jdGlvbihheCxheSxieCxieSxjeCxjeSxkeCxkeSxvdXQpXG4gICAge1xuICAgICAgICB2YXIgZGlzdGFiLFxuICAgICAgICAgICAgY29zLFxuICAgICAgICAgICAgc2luLFxuICAgICAgICAgICAgbmV3WCxcbiAgICAgICAgICAgIHBvc2FiO1xuXG4gICAgICAgIGlmIChheCA9PSBieCAmJiBheSA9PSBieSB8fFxuICAgICAgICAgICAgY3ggPT0gZHggJiYgY3kgPT0gZHkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYgKGF4PT1jeCAmJiBheT09Y3kgfHwgYng9PWN4ICYmIGJ5PT1jeVxuICAgICAgICAgICAgfHwgIGF4PT1keCAmJiBheT09ZHkgfHwgYng9PWR4ICYmIGJ5PT1keSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgICAgYnggLT0gYXg7XG4gICAgICAgIGJ5IC09IGF5O1xuICAgICAgICBjeCAtPSBheDtcbiAgICAgICAgY3kgLT0gYXk7XG4gICAgICAgIGR4IC09IGF4O1xuICAgICAgICBkeSAtPSBheTtcblxuICAgICAgICBkaXN0YWI9IE1hdGguc3FydChieCpieCtieSpieSk7XG5cbiAgICAgICAgY29zICA9IGJ4IC8gZGlzdGFiO1xuICAgICAgICBzaW4gID0gYnkgLyBkaXN0YWI7XG4gICAgICAgIG5ld1ggPSBjeCAqIGNvcyArIGN5ICogc2luO1xuICAgICAgICBjeSAgID0gY3kgKiBjb3MgLSBjeCAqIHNpbjtcbiAgICAgICAgY3ggICA9IG5ld1g7XG4gICAgICAgIG5ld1ggPSBkeCAqIGNvcyArIGR5ICogc2luO1xuICAgICAgICBkeSAgID0gZHkgKiBjb3MgLSBkeCAqIHNpbjtcbiAgICAgICAgZHggICA9IG5ld1g7XG5cbiAgICAgICAgaWYoY3kgPCAwLjAgJiYgZHkgPCAwLjAgfHwgY3kgPj0gMC4wICYmIGR5ID49IDAuMClyZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgcG9zYWIgID0gZHggKyAoIGN4IC0gZHggKSAqIGR5IC8gKCBkeSAtIGN5ICk7XG5cbiAgICAgICAgaWYocG9zYWIgPCAwLjAgfHwgcG9zYWIgPiBkaXN0YWIpcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKG91dClcbiAgICAgICAge1xuICAgICAgICAgICAgb3V0WzBdID0gYXggKyBwb3NhYiAqIGNvcztcbiAgICAgICAgICAgIG91dFsxXSA9IGF5ICsgcG9zYWIgKiBzaW47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cblxufTsiLCJcblxuXG5mdW5jdGlvbiBMaW5lQnVmZmVyMmQoa2dsLHNpemUpXG57XG4gICAgdGhpcy5fZ2wgICAgICA9IGtnbDtcblxuICAgIHRoaXMuX3ZibyAgICAgPSBudWxsO1xuICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xuICAgIHRoaXMuY29sb3JzICAgPSBudWxsO1xuXG4gICAgdGhpcy5fdmVydEluZGV4ID0gMDtcbiAgICB0aGlzLl9jb2xJbmRleCAgPSAwO1xuXG4gICAgaWYoc2l6ZSl0aGlzLmFsbG9jYXRlKHNpemUpO1xufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vcHJvYmFibHkgc2hvdWxkbnQgZG8gdGhpc1xuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5iaW5kICAgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMuX2dsLFxuICAgICAgICBnbCAgICA9IGtnbC5nbDtcblxuICAgIGtnbC5kaXNhYmxlRGVmYXVsdE5vcm1hbEF0dHJpYkFycmF5KCk7XG4gICAga2dsLmRpc2FibGVEZWZhdWx0VGV4Q29vcmRzQXR0cmliQXJyYXkoKTtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUix0aGlzLl92Ym8pO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMuX2dsO1xuXG4gICAga2dsLmVuYWJsZURlZmF1bHROb3JtYWxBdHRyaWJBcnJheSgpO1xuICAgIGtnbC5lbmFibGVEZWZhdWx0VGV4Q29vcmRzQXR0cmliQXJyYXkoKTtcbiAgICBrZ2wuYmluZERlZmF1bHRWQk8oKTtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUucHVzaFZlcnRleDNmID0gZnVuY3Rpb24oeCx5LHopXG57XG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcblxuICAgIC8vaWYodGhpcy5fc2FmZUFsbG9jYXRlICYmIHRoaXMuX3ZlcnRJbmRleCA+IHZlcnRpY2VzLmxlbmd0aCAtIDMpdGhpcy5hbGxvY2F0ZSh2ZXJ0aWNlcy5sZW5ndGggKiAxLjEpO1xuXG4gICAgdmVydGljZXNbdGhpcy5fdmVydEluZGV4KytdID0geDtcbiAgICB2ZXJ0aWNlc1t0aGlzLl92ZXJ0SW5kZXgrK10gPSB5O1xuICAgIHZlcnRpY2VzW3RoaXMuX3ZlcnRJbmRleCsrXSA9IHo7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnB1c2hDb2xvcjRmID0gZnVuY3Rpb24ocixnLGIsYSlcbntcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG5cbiAgICBjb2xvcnNbdGhpcy5fY29sSW5kZXgrK10gPSByO1xuICAgIGNvbG9yc1t0aGlzLl9jb2xJbmRleCsrXSA9IGc7XG4gICAgY29sb3JzW3RoaXMuX2NvbEluZGV4KytdID0gYjtcbiAgICBjb2xvcnNbdGhpcy5fY29sSW5kZXgrK10gPSBhO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5zZXRWZXJ0ZXgzZiA9IGZ1bmN0aW9uKHgseSx6LGluZGV4MylcbntcbiAgICBpbmRleDMqPTM7XG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcblxuICAgIHZlcnRpY2VzW2luZGV4MyAgXSA9IHg7XG4gICAgdmVydGljZXNbaW5kZXgzKzFdID0geTtcbiAgICB2ZXJ0aWNlc1tpbmRleDMrMl0gPSB6O1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5zZXRDb2xvcjRmID0gZnVuY3Rpb24ocixnLGIsYSxpbmRleDQpXG57XG4gICAgaW5kZXg0Kj00O1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcblxuICAgIGNvbG9yc1tpbmRleDQgIF0gPSByO1xuICAgIGNvbG9yc1tpbmRleDQrMV0gPSBnO1xuICAgIGNvbG9yc1tpbmRleDQrMl0gPSBiO1xuICAgIGNvbG9yc1tpbmRleDQrM10gPSBhO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5wdXNoVmVydGV4ICAgID0gZnVuY3Rpb24odil7dGhpcy5wdXNoVmVydGV4M2YodlswXSx2WzFdLHZbMl0pO307XG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnB1c2hDb2xvciAgICAgPSBmdW5jdGlvbihjKXt0aGlzLnB1c2hDb2xvcjRmKGNbMF0sY1sxXSxjWzJdLGNbM10pO307XG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnNldFZlcnRleCAgICAgPSBmdW5jdGlvbih2LGluZGV4KXt0aGlzLnNldFZlcnRleDNmKHZbMF0sdlsxXSx2WzJdLGluZGV4KTt9O1xuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5zZXRDb2xvciAgICAgID0gZnVuY3Rpb24oYyxpbmRleCl7dGhpcy5zZXRDb2xvcjRmKGNbMF0sY1sxXSxjWzJdLGNbM10saW5kZXgpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5idWZmZXIgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGdsa2wgICAgICAgICAgPSB0aGlzLl9nbCxcbiAgICAgICAgZ2wgICAgICAgICAgICA9IGdsa2wuZ2wsXG4gICAgICAgIGdsQXJyYXlCdWZmZXIgPSBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBnbC5GTE9BVDtcblxuXG5cbiAgICB2YXIgdmJsZW4gPSB0aGlzLnZlcnRpY2VzLmJ5dGVMZW5ndGgsXG4gICAgICAgIGNibGVuID0gdGhpcy5jb2xvcnMuYnl0ZUxlbmd0aDtcblxuICAgIHZhciBvZmZzZXRWID0gMCxcbiAgICAgICAgb2Zmc2V0QyA9IG9mZnNldFYgKyB2YmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlcix2YmxlbiArIGNibGVuLCBnbC5EWU5BTUlDX0RSQVcpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlcixvZmZzZXRWLHRoaXMudmVydGljZXMpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlcixvZmZzZXRDLHRoaXMuY29sb3JzKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsa2wuZ2V0RGVmYXVsdFZlcnRleEF0dHJpYigpLGdsa2wuU0laRV9PRl9WRVJURVgsZ2xGbG9hdCxmYWxzZSwwLG9mZnNldFYpO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2xrbC5nZXREZWZhdWx0Q29sb3JBdHRyaWIoKSwgZ2xrbC5TSVpFX09GX0NPTE9SLCBnbEZsb2F0LGZhbHNlLDAsb2Zmc2V0Qyk7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihmaXJzdCxjb3VudClcbntcbiAgICB2YXIga2dsID0gdGhpcy5fZ2wsXG4gICAgICAgIGdsICAgID0ga2dsLmdsO1xuXG4gICBrZ2wuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICBnbC5kcmF3QXJyYXlzKGtnbC5nZXREcmF3TW9kZSgpLFxuICAgICAgICAgICAgICAgICBmaXJzdCB8fCAwLFxuICAgICAgICAgICAgICAgICBjb3VudCB8fCB0aGlzLnZlcnRpY2VzLmxlbmd0aCAvIGtnbC5TSVpFX09GX1ZFUlRFWCk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fdmVydEluZGV4ID0gMDtcbiAgICB0aGlzLl9jb2xJbmRleCAgPSAwO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5kaXNwb3NlICA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLl9nbC5nbC5kZWxldGVCdWZmZXIodGhpcy5fdmJvKTtcbiAgICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcbiAgICB0aGlzLmNvbG9ycyAgID0gbnVsbDtcbiAgICB0aGlzLnJlc2V0KCk7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmFsbG9jYXRlID0gZnVuY3Rpb24oc2l6ZSlcbntcbiAgICB2YXIga2dsID0gdGhpcy5fZ2wsXG4gICAgICAgIGdsICAgID0ga2dsLmdsO1xuXG4gICAgLy9uZWVkIHRvIGRlbGV0ZUJ1ZmZlciwgaW5zdGVhZCBvZiByZXVzaW5nIGl0LCBvdGhlcndpc2UgZXJyb3IsIGhtXG4gICAgaWYodGhpcy5fdmJvKXtnbC5kZWxldGVCdWZmZXIodGhpcy5fdmJvKTt9dGhpcy5fdmJvID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IHRoaXMudmVydGljZXMgfHwgbmV3IEZsb2F0MzJBcnJheSgwKTtcbiAgICB0aGlzLmNvbG9ycyAgID0gdGhpcy5jb2xvcnMgICB8fCBuZXcgRmxvYXQzMkFycmF5KDApO1xuXG4gICAgdmFyIHZlcnRMZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aCxcbiAgICAgICAgY29sc0xlbiA9IHRoaXMuY29sb3JzLmxlbmd0aDtcblxuICAgIGlmKHZlcnRMZW4gPCBzaXplKVxuICAgIHtcbiAgICAgICAgdmFyIHRlbXA7XG5cbiAgICAgICAgdGVtcCA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XG4gICAgICAgIHRlbXAuc2V0KHRoaXMudmVydGljZXMpO1xuICAgICAgICB0ZW1wLnNldChuZXcgRmxvYXQzMkFycmF5KHRlbXAubGVuZ3RoIC0gdmVydExlbiksdmVydExlbik7XG4gICAgICAgIHRoaXMudmVydGljZXMgPSB0ZW1wO1xuXG4gICAgICAgIHRlbXAgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUgLyAzICogNCk7XG4gICAgICAgIHRlbXAuc2V0KHRoaXMuY29sb3JzKTtcbiAgICAgICAgdGVtcC5zZXQobmV3IEZsb2F0MzJBcnJheSh0ZW1wLmxlbmd0aCAtIGNvbHNMZW4pLGNvbHNMZW4pO1xuICAgICAgICB0aGlzLmNvbG9ycyA9IHRlbXA7XG4gIH1cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5nZXRTaXplQWxsb2NhdGVkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7fTtcbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuZ2V0U2l6ZVB1c2hlZCAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZlcnRJbmRleDt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmVCdWZmZXIyZDtcblxuIiwidmFyIEdlb20zZCA9IHJlcXVpcmUoJy4vZ2xrR2VvbTNkJyksXG4gICAgTWF0NDQgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtNYXQ0NCcpLFxuICAgIFZlYzMgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMycpO1xuXG4vL1RPRE86XG4vL0ZpeCBzaGFyZWQgbm9ybWFscyBvbiBjYXBzXG4vL1xuXG5cbkxpbmVCdWZmZXIzZCA9IGZ1bmN0aW9uKHBvaW50cyxudW1TZWdtZW50cyxkaWFtZXRlcixzbGljZVNlZ21lbnRGdW5jLGNsb3NlZClcbntcbiAgICBHZW9tM2QuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXG4gICAgbnVtU2VnbWVudHMgPSBudW1TZWdtZW50cyB8fCAxMDtcbiAgICBkaWFtZXRlciAgICA9IGRpYW1ldGVyICAgIHx8IDAuMjU7XG5cbiAgICB0aGlzLl9jbG9zZWRDYXBzICAgPSAodHlwZW9mIGNsb3NlZCA9PT0gJ3VuZGVmaW5lZCcpID8gdHJ1ZSA6IGNsb3NlZDtcbiAgICB0aGlzLl9udW1TZWdtZW50cyAgPSBudW1TZWdtZW50cztcblxuICAgIC8vY2FjaGVzIHZlcnRpY2VzIHRyYW5zZm9ybWVkIGJ5IHNsaWNlc2VnZnVuYyBmb3IgZGlhbWV0ZXIgc2NhbGluZ1xuICAgIC8vLi4uLHZub3JtMHgsdm5vcm0weSx2bm9ybTB6LHZub3JtMHhTY2FsZWQsLHZub3JtMHlTY2FsZWQsdm5vcm0welNjYWxlZCwuLi5cbiAgICB0aGlzLl92ZXJ0aWNlc05vcm0gPSBudWxsO1xuICAgIHRoaXMucG9pbnRzICAgICAgICA9IG51bGw7XG5cbiAgICB0aGlzLl9zbGljZVNlZ0Z1bmMgPSBzbGljZVNlZ21lbnRGdW5jIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oaSxqLG51bVBvaW50cyxudW1TZWdtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGVwICA9IE1hdGguUEkgKiAyIC8gbnVtU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IHN0ZXAgKiBqO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbTWF0aC5jb3MoYW5nbGUpLE1hdGguc2luKGFuZ2xlKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICB0aGlzLl9pbml0RGlhbWV0ZXIgPSBkaWFtZXRlcjtcblxuICAgIHRoaXMuX3RlbXBWZWMwID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYlBvaW50MCAgPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl9iUG9pbnQxICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JQb2ludDAxID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYXhpc1kgICAgPSBWZWMzLkFYSVNfWSgpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgaWYocG9pbnRzKXRoaXMuc2V0UG9pbnRzKHBvaW50cyk7XG5cbn07XG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlb20zZC5wcm90b3R5cGUpO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0UG9pbnRzID0gZnVuY3Rpb24oYXJyKVxue1xuICAgIHRoaXMucG9pbnRzID0gbmV3IEZsb2F0MzJBcnJheShhcnIpO1xuXG4gICAgaWYoISh0aGlzLnZlcnRpY2VzICYmIHRoaXMudmVydGljZXMubGVuZ3RoID09IGFyci5sZW5ndGgpKVxuICAgIHtcbiAgICAgICAgdmFyIG51bVNlZ21lbnRzID0gdGhpcy5fbnVtU2VnbWVudHMsXG4gICAgICAgICAgICBudW1Qb2ludHMgICA9IHRoaXMuX251bVBvaW50cyA9IGFyci5sZW5ndGggLyAzO1xuICAgICAgICB2YXIgbGVuICAgICAgICAgPSBudW1Qb2ludHMgKiBudW1TZWdtZW50cyAqIDM7XG5cbiAgICAgICAgdGhpcy5fdmVydGljZXNOb3JtID0gbmV3IEZsb2F0MzJBcnJheShsZW4gKiAyKTtcbiAgICAgICAgdGhpcy52ZXJ0aWNlcyAgICAgID0gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xuICAgICAgICB0aGlzLm5vcm1hbHMgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbik7XG4gICAgICAgIHRoaXMuY29sb3JzICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkobGVuIC8gMyAqIDQpO1xuXG4gICAgICAgIHRoaXMuc2V0TnVtU2VnbWVudHMobnVtU2VnbWVudHMpO1xuICAgIH1cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5hcHBseVNsaWNlU2VnbWVudEZ1bmMgPSBmdW5jdGlvbihmdW5jLGJhc2VEaWFtZXRlcilcbntcbiAgICBiYXNlRGlhbWV0ZXIgPSBiYXNlRGlhbWV0ZXIgfHwgMC4yNTtcblxuICAgIHZhciBudW1Qb2ludHMgICAgPSB0aGlzLl9udW1Qb2ludHMsXG4gICAgICAgIG51bVNlZ21lbnRzICA9IHRoaXMuX251bVNlZ21lbnRzLFxuICAgICAgICB2ZXJ0aWNlc05vcm0gPSB0aGlzLl92ZXJ0aWNlc05vcm07XG5cbiAgICB2YXIgZnVuY1JlcztcblxuICAgIHZhciBpbmRleDtcbiAgICB2YXIgaSwgaiwgaztcblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCBudW1Qb2ludHMpXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIGluZGV4ID0gaSAqIG51bVNlZ21lbnRzO1xuXG4gICAgICAgIHdoaWxlKCsraiA8IG51bVNlZ21lbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBrICAgID0gKGluZGV4ICsgaikgKiAzICogMjtcblxuICAgICAgICAgICAgZnVuY1JlcyA9IGZ1bmMoaSxqLG51bVBvaW50cyxudW1TZWdtZW50cyk7XG5cbiAgICAgICAgICAgIHZlcnRpY2VzTm9ybVtrKzBdID0gZnVuY1Jlc1swXTtcbiAgICAgICAgICAgIHZlcnRpY2VzTm9ybVtrKzJdID0gZnVuY1Jlc1sxXTtcblxuICAgICAgICAgICAgdmVydGljZXNOb3JtW2srM10gPSB2ZXJ0aWNlc05vcm1bayswXSAqIGJhc2VEaWFtZXRlcjtcbiAgICAgICAgICAgIHZlcnRpY2VzTm9ybVtrKzVdID0gdmVydGljZXNOb3JtW2srMl0gKiBiYXNlRGlhbWV0ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9zbGljZVNlZ0Z1bmMgPSBmdW5jO1xuXG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0UG9pbnQzZiA9IGZ1bmN0aW9uKGluZGV4LHgseSx6KVxue1xuICAgIGluZGV4ICo9IDM7XG5cbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG5cbiAgICBwb2ludHNbaW5kZXggIF0gPSB4O1xuICAgIHBvaW50c1tpbmRleCsxXSA9IHk7XG4gICAgcG9pbnRzW2luZGV4KzJdID0gejtcbn07XG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0UG9pbnQgPSBmdW5jdGlvbihpbmRleCx2KVxue1xuICAgIGluZGV4ICo9IDM7XG5cbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG5cbiAgICBwb2ludHNbaW5kZXggIF0gPSB2WzBdO1xuICAgIHBvaW50c1tpbmRleCsxXSA9IHZbMV07XG4gICAgcG9pbnRzW2luZGV4KzJdID0gdlsyXTtcbn07XG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuZ2V0UG9pbnQgPSBmdW5jdGlvbihpbmRleCxvdXQpXG57XG4gICAgb3V0ICAgID0gb3V0IHx8IHRoaXMuX3RlbXBWZWMwO1xuICAgIGluZGV4ICo9IDM7XG5cbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG5cbiAgICBvdXRbMF0gPSBwb2ludHNbaW5kZXggIF07XG4gICAgb3V0WzFdID0gcG9pbnRzW2luZGV4KzFdO1xuICAgIG91dFsyXSA9IHBvaW50c1tpbmRleCsyXTtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0VW5pdERpYW1ldGVyID0gZnVuY3Rpb24odmFsdWUpXG57XG4gICAgdmFyIG51bVNlZ21lbnRzICA9IHRoaXMuX251bVNlZ21lbnRzLFxuICAgICAgICB2ZXJ0aWNlc05vcm0gPSB0aGlzLl92ZXJ0aWNlc05vcm07XG5cbiAgICB2YXIgb2Zmc2V0ID0gbnVtU2VnbWVudHMgKiAzICogMjtcblxuICAgIHZhciBpID0gMCxcbiAgICAgICAgbCA9IHRoaXMuX251bVBvaW50cyAqIG9mZnNldDtcblxuICAgIHdoaWxlKGkgPCBsKVxuICAgIHtcbiAgICAgICAgdmVydGljZXNOb3JtW2kgKyAzXSA9IHZlcnRpY2VzTm9ybVtpICsgMF0gKiB2YWx1ZTtcbiAgICAgICAgdmVydGljZXNOb3JtW2kgKyA1XSA9IHZlcnRpY2VzTm9ybVtpICsgMl0gKiB2YWx1ZTtcbiAgICAgICAgaSs9NjtcbiAgICB9XG59O1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldERpYW1ldGVyID0gZnVuY3Rpb24oaW5kZXgsdmFsdWUpXG57XG4gICAgdmFyIG51bVNlZ21lbnRzICA9IHRoaXMuX251bVNlZ21lbnRzLFxuICAgICAgICB2ZXJ0aWNlc05vcm0gPSB0aGlzLl92ZXJ0aWNlc05vcm07XG5cbiAgICB2YXIgb2Zmc2V0ID0gbnVtU2VnbWVudHMgKiAzICogMjtcblxuICAgIHZhciBpID0gaW5kZXggKiBvZmZzZXQsXG4gICAgICAgIGwgPSBpICsgb2Zmc2V0O1xuXG4gICAgd2hpbGUgKGkgPCBsKVxuICAgIHtcbiAgICAgICAgdmVydGljZXNOb3JtW2kgKyAzXSA9IHZlcnRpY2VzTm9ybVtpICsgMF0gKiB2YWx1ZTtcbiAgICAgICAgdmVydGljZXNOb3JtW2kgKyA1XSA9IHZlcnRpY2VzTm9ybVtpICsgMl0gKiB2YWx1ZTtcbiAgICAgICAgaSArPSA2O1xuICAgIH1cbn07XG5cbi8vVE9ETzogQ2xlYW51cCAvIHVucm9sbCAuLi5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0TnVtU2VnbWVudHMgPSBmdW5jdGlvbihudW1TZWdtZW50cylcbntcbiAgICBudW1TZWdtZW50cyA9IG51bVNlZ21lbnRzIDwgMiA/IDIgOiBudW1TZWdtZW50cztcblxuICAgIHZhciBudW1Qb2ludHMgPSB0aGlzLl9udW1Qb2ludHM7XG4gICAgdmFyIGluZGljZXMgICA9IHRoaXMuaW5kaWNlcyA9IFtdO1xuICAgIHZhciB0ZXhDb29yZHM7XG5cbiAgICB2YXIgaSxqO1xuICAgIHZhciB2MCx2MSx2Mix2MztcbiAgICB2YXIgbmgsbnY7XG4gICAgdmFyIGluZGV4LCBpbmRleFNlZywgaW5kZXhUZXg7XG4gICAgdmFyIGxlbjtcblxuICAgIGlmKG51bVNlZ21lbnRzID4gMilcbiAgICB7XG5cbiAgICAgICAgbGVuID0gbnVtU2VnbWVudHMgLSAxO1xuXG4gICAgICAgIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG51bVBvaW50cyAtIDEpXG4gICAgICAgIHtcblxuICAgICAgICAgICAgaW5kZXggPSBpICogbnVtU2VnbWVudHM7XG4gICAgICAgICAgICBqID0gLTE7XG4gICAgICAgICAgICB3aGlsZSAoKytqIDwgbGVuKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluZGV4U2VnID0gaW5kZXggKyBqO1xuXG4gICAgICAgICAgICAgICAgdjAgPSBpbmRleFNlZztcbiAgICAgICAgICAgICAgICB2MSA9IGluZGV4U2VnICsgMTtcbiAgICAgICAgICAgICAgICB2MiA9IGluZGV4U2VnICsgbnVtU2VnbWVudHMgKyAxO1xuICAgICAgICAgICAgICAgIHYzID0gaW5kZXhTZWcgKyBudW1TZWdtZW50cztcblxuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaCh2MCx2MSx2MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdjEsdjIsdjMpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHYwID0gaW5kZXggKyBsZW47XG4gICAgICAgICAgICB2MSA9IGluZGV4O1xuICAgICAgICAgICAgdjIgPSBpbmRleCArIGxlbiArIDE7XG4gICAgICAgICAgICB2MyA9IGluZGV4ICsgbnVtU2VnbWVudHMgKyBsZW47XG5cbiAgICAgICAgICAgIGluZGljZXMucHVzaCh2MCx2MSx2MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICB2MSx2Mix2Myk7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpID0gLTE7XG4gICAgICAgIHdoaWxlKCsraSA8IG51bVBvaW50cyAtIDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4ID0gaSAqIDI7XG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kZXgsICAgIGluZGV4ICsgMSxpbmRleCArIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggKyAxLGluZGV4ICsgMyxpbmRleCArIDIpO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZW4gPSBudW1Qb2ludHMgKiBudW1TZWdtZW50cyAqIDMgO1xuXG4gICAgdGV4Q29vcmRzID0gdGhpcy50ZXhDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KGxlbiAvIDMgKiAyKTtcblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCBudW1Qb2ludHMpXG4gICAge1xuICAgICAgICBpbmRleCA9IGkgKiBudW1TZWdtZW50cztcbiAgICAgICAgbmggICAgPSBpIC8gKG51bVBvaW50cyAtIDEpO1xuXG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgbnVtU2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4VGV4ID0gKGluZGV4ICsgaikgKiAyO1xuICAgICAgICAgICAgbnYgICAgICAgPSAxIC0gaiAvIChudW1TZWdtZW50cyAtIDEpO1xuXG4gICAgICAgICAgICB0ZXhDb29yZHNbaW5kZXhUZXhdICAgPSBuaDtcbiAgICAgICAgICAgIHRleENvb3Jkc1tpbmRleFRleCsxXSA9IG52O1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB0aGlzLnNldENsb3NlQ2Fwcyh0aGlzLl9jbG9zZWRDYXBzKTtcbiAgICB0aGlzLmFwcGx5U2xpY2VTZWdtZW50RnVuYyh0aGlzLl9zbGljZVNlZ0Z1bmMsdGhpcy5faW5pdERpYW1ldGVyKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIG51bVBvaW50cyAgID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICBudW1TZWdtZW50cyA9IHRoaXMuX251bVNlZ21lbnRzO1xuXG4gICAgdmFyIHBvaW50cyAgICAgICA9IHRoaXMucG9pbnRzLFxuICAgICAgICB2ZXJ0aWNlcyAgICAgPSB0aGlzLnZlcnRpY2VzLFxuICAgICAgICB2ZXJ0aWNlc05vcm0gPSB0aGlzLl92ZXJ0aWNlc05vcm07XG5cbiAgICB2YXIgdGVtcFZlYyA9IHRoaXMuX3RlbXBWZWMwO1xuXG4gICAgdmFyIHAwICA9IHRoaXMuX2JQb2ludDAsXG4gICAgICAgIHAxICA9IHRoaXMuX2JQb2ludDEsXG4gICAgICAgIHAwMSA9IHRoaXMuX2JQb2ludDAxLFxuICAgICAgICB1cCAgPSB0aGlzLl9heGlzWTtcblxuICAgIHZhciBtYXQgICAgPSBNYXQ0NC5tYWtlKCksXG4gICAgICAgIG1hdFJvdCA9IE1hdDQ0Lm1ha2UoKTtcblxuICAgIHZhciBpbmRleCxpbmRleDMsaW5kZXg2O1xuXG4gICAgLy9kaXJlY3Rpb24gZnJvbSBjdXJyZW50IHBvaW50IC0+IG5leHQgcG9pbnQsIHByZXYgcG9pbnQgLT4gY3VycmVudCBwb2ludFxuICAgIHZhciBkaXIwMSxkaXJfMTA7XG4gICAgdmFyIGFuZ2xlLGF4aXM7XG5cbiAgICAvL0JFR0lOIC0gY2FsY3VsYXRlIGZpcnN0IHBvaW50XG4gICAgVmVjMy5zZXQzZihwMCxwb2ludHNbMF0scG9pbnRzWzFdLHBvaW50c1syXSk7XG4gICAgVmVjMy5zZXQzZihwMSxwb2ludHNbM10scG9pbnRzWzRdLHBvaW50c1s1XSk7XG5cbiAgICBkaXIwMSA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLnN1YmJlZChwMSxwMCkpO1xuICAgIGFuZ2xlID0gTWF0aC5hY29zKFZlYzMuZG90KGRpcjAxLHVwKSk7XG4gICAgYXhpcyAgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5jcm9zcyh1cCxkaXIwMSkpO1xuXG4gICAgTWF0NDQuaWRlbnRpdHkobWF0KTtcbiAgICBtYXRbMTJdID0gcDBbMF07XG4gICAgbWF0WzEzXSA9IHAwWzFdO1xuICAgIG1hdFsxNF0gPSBwMFsyXTtcblxuICAgIE1hdDQ0Lm1ha2VSb3RhdGlvbk9uQXhpcyhhbmdsZSxheGlzWzBdLGF4aXNbMV0sYXhpc1syXSxtYXRSb3QpO1xuICAgIG1hdCA9IE1hdDQ0Lm11bHRQb3N0KG1hdCxtYXRSb3QpO1xuXG4gICAgaiA9IC0xO1xuICAgIHdoaWxlKCsraiA8IG51bVNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgaW5kZXgzID0gaiAqIDM7XG4gICAgICAgIGluZGV4NiA9IGogKiA2O1xuXG4gICAgICAgIHRlbXBWZWNbMF0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzNdO1xuICAgICAgICB0ZW1wVmVjWzFdID0gdmVydGljZXNOb3JtW2luZGV4Nis0XTtcbiAgICAgICAgdGVtcFZlY1syXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrNV07XG5cbiAgICAgICAgTWF0NDQubXVsdFZlYzMobWF0LHRlbXBWZWMpO1xuXG4gICAgICAgIHZlcnRpY2VzW2luZGV4MyAgXSA9IHRlbXBWZWNbMF07XG4gICAgICAgIHZlcnRpY2VzW2luZGV4MysxXSA9IHRlbXBWZWNbMV07XG4gICAgICAgIHZlcnRpY2VzW2luZGV4MysyXSA9IHRlbXBWZWNbMl07XG4gICAgfVxuICAgIC8vRU5EIC0gY2FsY3VsYXRlIGZpcnN0IHBvaW50XG5cblxuICAgIC8vY2FsYyBmaXJzdCBwcmV2IGRpclxuICAgIFZlYzMuc2V0M2YocDAsIHBvaW50c1szXSxwb2ludHNbNF0scG9pbnRzWzVdKTtcbiAgICBWZWMzLnNldDNmKHAwMSxwb2ludHNbMF0scG9pbnRzWzFdLHBvaW50c1syXSk7XG4gICAgZGlyXzEwID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuc3ViYmVkKHAwLHAwMSkpO1xuXG4gICAgdmFyIGkzO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgajtcbiAgICB3aGlsZSgrK2kgPCBudW1Qb2ludHMgLSAxKVxuICAgIHtcbiAgICAgICAgLy9zZXQgY3VycmVudCBwb2ludFxuICAgICAgICBpMyA9IGkgKiAzO1xuICAgICAgICBwMFswXSA9IHBvaW50c1tpMyAgXTtcbiAgICAgICAgcDBbMV0gPSBwb2ludHNbaTMrMV07XG4gICAgICAgIHAwWzJdID0gcG9pbnRzW2kzKzJdO1xuXG4gICAgICAgIC8vc2V0IG5leHQgcG9pbnRcbiAgICAgICAgaTMgPSAoaSArIDEpICogMztcbiAgICAgICAgcDFbMF0gPSBwb2ludHNbaTMgIF07XG4gICAgICAgIHAxWzFdID0gcG9pbnRzW2kzKzFdO1xuICAgICAgICBwMVsyXSA9IHBvaW50c1tpMysyXTtcblxuICAgICAgICAvL2NhbGN1bGF0ZSBkaXJlY3Rpb25cbiAgICAgICAgZGlyMDEgID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuc3ViYmVkKHAxLHAwKSk7XG5cbiAgICAgICAgLy9pbnRlcnBvbGF0ZSB3aXRoIHByZXZpb3VzIGRpcmVjdGlvblxuICAgICAgICBkaXIwMVswXSA9IGRpcjAxWzBdICogMC41ICsgZGlyXzEwWzBdICogMC41O1xuICAgICAgICBkaXIwMVsxXSA9IGRpcjAxWzFdICogMC41ICsgZGlyXzEwWzFdICogMC41O1xuICAgICAgICBkaXIwMVsyXSA9IGRpcjAxWzJdICogMC41ICsgZGlyXzEwWzJdICogMC41O1xuXG4gICAgICAgIC8vZ2V0IGRpciBhbmdsZSArIGF4aXNcbiAgICAgICAgYW5nbGUgPSBNYXRoLmFjb3MoVmVjMy5kb3QoZGlyMDEsdXApKTtcbiAgICAgICAgYXhpcyAgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5jcm9zcyh1cCxkaXIwMSkpO1xuXG4gICAgICAgIC8vcmVzZXQgdHJhbnNmb3JtYXRpb24gbWF0cml4XG4gICAgICAgIE1hdDQ0LmlkZW50aXR5KG1hdCk7XG5cbiAgICAgICAgLy9zZXQgdHJhbnNsYXRpb25cbiAgICAgICAgbWF0WzEyXSA9IHAwWzBdO1xuICAgICAgICBtYXRbMTNdID0gcDBbMV07XG4gICAgICAgIG1hdFsxNF0gPSBwMFsyXTtcblxuICAgICAgICAvL3NldCByb3RhdGlvblxuICAgICAgICBNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUsYXhpc1swXSxheGlzWzFdLGF4aXNbMl0sbWF0Um90KTtcblxuICAgICAgICAvL211bHRpcGx5IG1hdHJpY2VzXG4gICAgICAgIG1hdCA9IE1hdDQ0Lm11bHRQb3N0KG1hdCxtYXRSb3QpO1xuXG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgbnVtU2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4ICA9IChpICogbnVtU2VnbWVudHMgKyBqKTtcbiAgICAgICAgICAgIGluZGV4MyA9IGluZGV4ICogMztcbiAgICAgICAgICAgIGluZGV4NiA9IGluZGV4ICogNjtcblxuICAgICAgICAgICAgLy9sb29rdXAgdmVydGV4XG4gICAgICAgICAgICB0ZW1wVmVjWzBdID0gdmVydGljZXNOb3JtW2luZGV4NiszXTtcbiAgICAgICAgICAgIHRlbXBWZWNbMV0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzRdO1xuICAgICAgICAgICAgdGVtcFZlY1syXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrNV07XG5cbiAgICAgICAgICAgIC8vdHJhbnNmb3JtIHZlcnRleCBjb3B5IGJ5IG1hdHJpeFxuICAgICAgICAgICAgTWF0NDQubXVsdFZlYzMobWF0LHRlbXBWZWMpO1xuXG4gICAgICAgICAgICAvL3JlYXNzaWduIHRyYW5zZm9ybWVkIHZlcnRleFxuICAgICAgICAgICAgdmVydGljZXNbaW5kZXgzICBdID0gdGVtcFZlY1swXTtcbiAgICAgICAgICAgIHZlcnRpY2VzW2luZGV4MysxXSA9IHRlbXBWZWNbMV07XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpbmRleDMrMl0gPSB0ZW1wVmVjWzJdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hc3NpZ24gY3VycmVudCBkaXJlY3Rpb24gdG8gcHJldlxuICAgICAgICBkaXJfMTBbMF0gPSBkaXIwMVswXTtcbiAgICAgICAgZGlyXzEwWzFdID0gZGlyMDFbMV07XG4gICAgICAgIGRpcl8xMFsyXSA9IGRpcjAxWzJdO1xuICAgIH1cblxuICAgIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoO1xuXG4gICAgLy9CRUdJTiAtIGNhbGN1bGF0ZSBsYXN0IHBvaW50XG4gICAgVmVjMy5zZXQzZihwMCxwb2ludHNbbGVuIC0gNl0scG9pbnRzW2xlbiAtIDVdLHBvaW50c1tsZW4gLSA0XSk7XG4gICAgVmVjMy5zZXQzZihwMSxwb2ludHNbbGVuIC0gM10scG9pbnRzW2xlbiAtIDJdLHBvaW50c1tsZW4gLSAxXSk7XG5cbiAgICBkaXIwMSA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLnN1YmJlZChwMSxwMCkpO1xuICAgIGFuZ2xlID0gTWF0aC5hY29zKFZlYzMuZG90KGRpcjAxLHVwKSk7XG4gICAgYXhpcyAgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5jcm9zcyh1cCxkaXIwMSkpO1xuXG4gICAgTWF0NDQuaWRlbnRpdHkobWF0KTtcbiAgICBtYXRbMTJdID0gcDFbMF07XG4gICAgbWF0WzEzXSA9IHAxWzFdO1xuICAgIG1hdFsxNF0gPSBwMVsyXTtcblxuICAgIE1hdDQ0Lm1ha2VSb3RhdGlvbk9uQXhpcyhhbmdsZSxheGlzWzBdLGF4aXNbMV0sYXhpc1syXSxtYXRSb3QpO1xuICAgIG1hdCA9IE1hdDQ0Lm11bHRQb3N0KG1hdCxtYXRSb3QpO1xuXG4gICAgaSAgPSAoaSAqIG51bVNlZ21lbnRzKTtcblxuICAgIGogPSAtMTtcbiAgICB3aGlsZSgrK2ogPCBudW1TZWdtZW50cylcbiAgICB7XG4gICAgICAgIGluZGV4ICA9IGkgKyBqO1xuICAgICAgICBpbmRleDMgPSBpbmRleCAqIDM7XG4gICAgICAgIGluZGV4NiA9IGluZGV4ICogNjtcblxuICAgICAgICB0ZW1wVmVjWzBdID0gdmVydGljZXNOb3JtW2luZGV4NiszXTtcbiAgICAgICAgdGVtcFZlY1sxXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrNF07XG4gICAgICAgIHRlbXBWZWNbMl0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzVdO1xuXG4gICAgICAgIE1hdDQ0Lm11bHRWZWMzKG1hdCx0ZW1wVmVjKTtcblxuICAgICAgICB2ZXJ0aWNlc1tpbmRleDMgIF0gPSB0ZW1wVmVjWzBdO1xuICAgICAgICB2ZXJ0aWNlc1tpbmRleDMrMV0gPSB0ZW1wVmVjWzFdO1xuICAgICAgICB2ZXJ0aWNlc1tpbmRleDMrMl0gPSB0ZW1wVmVjWzJdO1xuICAgIH1cbiAgICAvL0VORCAtIGNhbGN1bGF0ZSBsYXN0IHBvaW50XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0U2VnVlRleENvb3JkTWFwcGluZyA9IGZ1bmN0aW9uKHNjYWxlLG9mZnNldCl7dGhpcy5zZXRTZWdUZXhDb29yZE1hcHBpbmcoMSwwLHNjYWxlLG9mZnNldCB8fCAwKTt9O1xuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXRTZWdIVGV4Q29vcmRNYXBwaW5nID0gZnVuY3Rpb24oc2NhbGUsb2Zmc2V0KXt0aGlzLnNldFNlZ1RleENvb3JkTWFwcGluZyhzY2FsZSxvZmZzZXQgfHwgMCwxLDApO307XG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0U2VnVGV4Q29vcmRNYXBwaW5nID0gZnVuY3Rpb24gKHNjYWxlSCwgb2Zmc2V0SCwgc2NhbGVWLCBvZmZzZXRWKVxue1xuICAgIHZhciBudW1Qb2ludHMgICAgID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICBudW1TZWdtZW50cyAgID0gdGhpcy5fbnVtU2VnbWVudHMsXG4gICAgICAgIG51bVNlZ21lbnRzXzEgPSBudW1TZWdtZW50cyAtIDE7XG5cbiAgICB2YXIgdGV4Q29vcmRzID0gdGhpcy50ZXhDb29yZHM7XG4gICAgdmFyIGksIGosIGluZGV4LCBpbmRleFRleDtcbiAgICB2YXIgbmgsIG52O1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlICgrK2kgPCBudW1Qb2ludHMpXG4gICAge1xuICAgICAgICBpbmRleCA9IGkgKiBudW1TZWdtZW50cztcbiAgICAgICAgbmggPSAoaSAvIChudW1Qb2ludHMgLSAxKSkgKiBzY2FsZUggLSBvZmZzZXRIO1xuXG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraiA8IG51bVNlZ21lbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleFRleCA9IChpbmRleCArIGopICogMjtcbiAgICAgICAgICAgIG52ID0gKDEgLSBqIC8gbnVtU2VnbWVudHNfMSkgKiBzY2FsZVYgLSBvZmZzZXRWO1xuXG4gICAgICAgICAgICB0ZXhDb29yZHNbaW5kZXhUZXggIF0gPSBuaDtcbiAgICAgICAgICAgIHRleENvb3Jkc1tpbmRleFRleCArIDFdID0gbnY7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0Q2xvc2VDYXBzID0gZnVuY3Rpb24oYm9vbClcbntcbiAgICBpZih0aGlzLl9udW1TZWdtZW50cyA9PSAyKXJldHVybjtcblxuICAgIHZhciBpbmRpY2VzID0gdGhpcy5pbmRpY2VzLFxuICAgICAgICB0ZW1wICAgID0gbmV3IEFycmF5KHRoaXMuaW5kaWNlcy5sZW5ndGgpO1xuXG4gICAgdmFyIGkgPSAtMTt3aGlsZSgrK2k8dGVtcC5sZW5ndGgpdGVtcFtpXSA9IGluZGljZXNbaV07XG5cbiAgICB2YXIgbnVtUG9pbnRzICAgPSB0aGlzLl9udW1Qb2ludHMsXG4gICAgICAgIG51bVNlZ21lbnRzID0gdGhpcy5fbnVtU2VnbWVudHM7XG4gICAgdmFyIGxlbjtcblxuXG4gICAgaWYoYm9vbClcbiAgICB7XG5cbiAgICAgICAgbGVuID0gbnVtU2VnbWVudHMgLSAyO1xuICAgICAgICBpID0gLTE7d2hpbGUoKytpIDwgbGVuKXRlbXAucHVzaCgwLGkrMSxpKzIpO1xuXG4gICAgICAgIHZhciBqO1xuICAgICAgICBsZW4gKz0gKG51bVBvaW50cyAtIDEpICogbnVtU2VnbWVudHMgKyAxO1xuICAgICAgICBpICAgPSBqID0gbGVuIC0gbnVtU2VnbWVudHMgKyAxO1xuICAgICAgICB3aGlsZSgrK2kgPCBsZW4pdGVtcC5wdXNoKGosaSxpKzEpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0ZW1wID0gdGVtcC5zbGljZSgwLGluZGljZXMubGVuZ3RoIC0gKG51bVNlZ21lbnRzIC0gMikgKiAyICogMyk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRpY2VzID0gbmV3IFVpbnQxNkFycmF5KHRlbXApO1xuICAgIHRoaXMudXBkYXRlVmVydGV4Tm9ybWFscygpO1xuICAgIHRoaXMuX2Nsb3NlZENhcHMgPSBib29sO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLmdldE51bVNlZ21lbnRzID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbnVtU2VnbWVudHM7fTtcbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuZ2V0TnVtUG9pbnRzICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9udW1Qb2ludHM7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oZ2wsY291bnQsb2Zmc2V0KVxue1xuICAgIHZhciBpbmRpY2VzID0gdGhpcy5pbmRpY2VzO1xuICAgIGdsLmRyYXdFbGVtZW50cyh0aGlzLnZlcnRpY2VzLHRoaXMubm9ybWFscyxnbC5maWxsQ29sb3JCdWZmZXIoZ2wuZ2V0Q29sb3JCdWZmZXIoKSx0aGlzLmNvbG9ycyksdGhpcy50ZXhDb29yZHMsaW5kaWNlcyxnbC5nZXREcmF3TW9kZSgpLGNvdW50IHx8IGluZGljZXMubGVuZ3RoLCBvZmZzZXQgfHwgMCApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lQnVmZmVyM2Q7XG4iLCJ2YXIgVmVjMiAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMyJyksXG4gICAgVmVjMyAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgQ29sb3IgID0gcmVxdWlyZSgnLi4vdXRpbC9nbGtDb2xvcicpLFxuICAgIEdlb20zZCA9IHJlcXVpcmUoJy4vZ2xrR2VvbTNkJyk7XG5cblBhcmFtZXRyaWNTdXJmYWNlID0gZnVuY3Rpb24oc2l6ZSlcbntcbiAgICBHZW9tM2QuYXBwbHkodGhpcyxudWxsKTtcblxuICAgIHRoaXMuZnVuY1ggPSBmdW5jdGlvbih1LHYsdCl7cmV0dXJuIHU7fTtcbiAgICB0aGlzLmZ1bmNZID0gZnVuY3Rpb24odSx2LHQpe3JldHVybiAwO307XG4gICAgdGhpcy5mdW5jWiA9IGZ1bmN0aW9uKHUsdix0KXtyZXR1cm4gdjt9O1xuICAgIHRoaXMudXIgICAgPSBbLTEsMV07XG4gICAgdGhpcy52ciAgICA9IFstMSwxXTtcbiAgICB0aGlzLnNpemUgID0gbnVsbDtcblxuICAgIHRoaXMuc2V0U2l6ZShzaXplKTtcblxufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW9tM2QucHJvdG90eXBlKTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihzaXplLHVuaXQpXG57XG4gICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG5cbiAgICB2YXIgbGVuZ3RoICA9IHNpemUgKiBzaXplO1xuXG4gICAgdGhpcy52ZXJ0aWNlcyAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIFZlYzMuU0laRSk7XG4gICAgdGhpcy5ub3JtYWxzICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIFZlYzMuU0laRSk7XG4gICAgdGhpcy5jb2xvcnMgICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbmd0aCAqIENvbG9yLlNJWkUpO1xuICAgIHRoaXMudGV4Q29vcmRzID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBWZWMyLlNJWkUpO1xuXG4gICAgdmFyIGluZGljZXMgPSBbXTtcblxuICAgIHZhciBhLCBiLCBjLCBkO1xuICAgIHZhciBpLGo7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgc2l6ZSAtIDEpXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHNpemUgLSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBhID0gaiAgICAgKyBzaXplICogaTtcbiAgICAgICAgICAgIGIgPSAoaisxKSArIHNpemUgKiBpO1xuICAgICAgICAgICAgYyA9IGogICAgICsgc2l6ZSAqIChpKzEpO1xuICAgICAgICAgICAgZCA9IChqKzEpICsgc2l6ZSAqIChpKzEpO1xuXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goYSxiLGMpO1xuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGIsZCxjKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcblxuICAgIHRoaXMudXBkYXRlVmVydGV4Tm9ybWFscygpO1xufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLnNldEZ1bmN0aW9ucyA9IGZ1bmN0aW9uKGZ1bmNYLGZ1bmNZLGZ1bmNaLHZyLHVyKVxue1xuICAgIHRoaXMuZnVuY1ggPSBmdW5jWDtcbiAgICB0aGlzLmZ1bmNZID0gZnVuY1k7XG4gICAgdGhpcy5mdW5jWiA9IGZ1bmNaO1xuICAgIHRoaXMudnIgICA9IHZyO1xuICAgIHRoaXMudXIgICA9IHVyO1xufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb25zID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuYXBwbHlGdW5jdGlvbnNXaXRoQXJnKDApO1xufTtcblxuLy9PdmVycmlkZVxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb25zV2l0aEFyZyA9IGZ1bmN0aW9uKGFyZylcbntcbiAgICB2YXIgc2l6ZSAgPSB0aGlzLnNpemU7XG5cbiAgICB2YXIgZnVuY1ggPSB0aGlzLmZ1bmNYLFxuICAgICAgICBmdW5jWSA9IHRoaXMuZnVuY1ksXG4gICAgICAgIGZ1bmNaID0gdGhpcy5mdW5jWjtcblxuICAgIHZhciB1ckxvd2VyID0gdGhpcy51clswXSxcbiAgICAgICAgdXJVcHBlciA9IHRoaXMudXJbMV0sXG4gICAgICAgIHZyTG93ZXIgPSB0aGlzLnZyWzBdLFxuICAgICAgICB2clVwcGVyID0gdGhpcy52clsxXTtcblxuICAgIHZhciBpLCBqLCB1LCB2O1xuXG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcblxuICAgIHZhciBpbmRleCxpbmRleFZlcnRpY2VzO1xuXG4gICAgdmFyIHRlbXAwID0gdXJVcHBlciAtIHVyTG93ZXIsXG4gICAgICAgIHRlbXAxID0gdnJVcHBlciAtIHZyTG93ZXIsXG4gICAgICAgIHRlbXAyID0gc2l6ZSAtIDE7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgc2l6ZSlcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgc2l6ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXggPSAoaiArIHNpemUgKiBpKTtcbiAgICAgICAgICAgIGluZGV4VmVydGljZXMgPSBpbmRleCAqIDM7XG5cbiAgICAgICAgICAgIHUgPSAodXJMb3dlciArIHRlbXAwICogKGogLyB0ZW1wMikpO1xuICAgICAgICAgICAgdiA9ICh2ckxvd2VyICsgdGVtcDEgKiAoaSAvIHRlbXAyKSk7XG5cbiAgICAgICAgICAgIHZlcnRpY2VzW2luZGV4VmVydGljZXMgICAgXSA9IGZ1bmNYKHUsdixhcmcpO1xuICAgICAgICAgICAgdmVydGljZXNbaW5kZXhWZXJ0aWNlcyArIDFdID0gZnVuY1kodSx2LGFyZyk7XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpbmRleFZlcnRpY2VzICsgMl0gPSBmdW5jWih1LHYsYXJnKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5wb2ludE9uU3VyZmFjZSA9IGZ1bmN0aW9uKHUsdilcbntcbiAgICByZXR1cm4gdGhpcy5wb2ludE9uU3VyZmFjZVdpdGhBcmcodSx2LDApO1xufTtcblxuUGFyYW1ldHJpY1N1cmZhY2UucHJvdG90eXBlLnBvaW50T25TdXJmYWNlV2l0aEFyZyA9IGZ1bmN0aW9uKHUsdixhcmcpXG57XG4gICAgcmV0dXJuIFZlYzMubWFrZSh0aGlzLmZ1bmNYKHUsdixhcmcpLFxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jWSh1LHYsYXJnKSxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnVuY1oodSx2LGFyZykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJhbWV0cmljU3VyZmFjZTtcblxuIiwidmFyIGtNYXRoICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdGgnKSxcbiAgICBMaW5lMmRVdGlsID0gcmVxdWlyZSgnLi9nbGtMaW5lMmRVdGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID1cbntcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBtYWtlVmVydGV4Q291bnRGaXR0ZWQgOiBmdW5jdGlvbihwb2x5Z29uLGNvdW50KVxuICAgIHtcbiAgICAgICAgdmFyIGRpZmYgICAgPSBwb2x5Z29uLmxlbmd0aCAqIDAuNSAtIGNvdW50O1xuXG4gICAgICAgIHJldHVybiBkaWZmIDwgMCA/IHRoaXMubWFrZVZlcnRleENvdW50SW5jcmVhc2VkKHBvbHlnb24sIE1hdGguYWJzKGRpZmYpKSA6XG4gICAgICAgICAgICAgICBkaWZmID4gMCA/IHRoaXMubWFrZVZlcnRleENvdW50RGVjcmVhc2VkKHBvbHlnb24sIGRpZmYpIDpcbiAgICAgICAgICAgICAgIHBvbHlnb247XG4gICAgfSxcblxuXG4gICAgLy9UT0RPOiBtb2R1bG8gbG9vcFxuICAgIG1ha2VWZXJ0ZXhDb3VudEluY3JlYXNlZCA6IGZ1bmN0aW9uKHBvbHlnb24sY291bnQpXG4gICAge1xuICAgICAgICBjb3VudCA9ICh0eXBlb2YgY291bnQgPT0gJ3VuZGVmaW5lZCcpID8gMSA6IGNvdW50O1xuXG4gICAgICAgIHZhciBvdXQgPSBwb2x5Z29uLnNsaWNlKCk7XG4gICAgICAgIGlmKGNvdW50IDw9IDAgKXJldHVybiBwb2x5Z29uO1xuXG4gICAgICAgIHZhciBpID0gLTEsajtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIG1heDtcblxuICAgICAgICB2YXIgamMsam47XG5cbiAgICAgICAgdmFyIHgsIHksIG14LCBteTtcbiAgICAgICAgdmFyIGR4LGR5LGQ7XG5cbiAgICAgICAgdmFyIGVkZ2VTSW5kZXgsXG4gICAgICAgICAgICBlZGdlRUluZGV4O1xuXG4gICAgICAgIHdoaWxlKCsraSA8IGNvdW50KVxuICAgICAgICB7XG4gICAgICAgICAgICBtYXggPSAtSW5maW5pdHk7XG4gICAgICAgICAgICBsZW4gPSBvdXQubGVuZ3RoICogMC41O1xuXG4gICAgICAgICAgICBlZGdlU0luZGV4ID0gZWRnZUVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGogPSAtMTtcbiAgICAgICAgICAgIHdoaWxlKCsraiA8IGxlbiAtIDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgamMgPSBqICogMjtcbiAgICAgICAgICAgICAgICBqbiA9IChqICsgMSkgKiAyO1xuXG4gICAgICAgICAgICAgICAgZHggPSBvdXRbam4gICAgXSAtIG91dFtqYyAgICBdO1xuICAgICAgICAgICAgICAgIGR5ID0gb3V0W2puICsgMV0gLSBvdXRbamMgKyAxXTtcbiAgICAgICAgICAgICAgICBkICA9IGR4ICogZHggKyBkeSAqIGR5O1xuXG4gICAgICAgICAgICAgICAgaWYoZCA+IG1heCl7bWF4ID0gZDtlZGdlU0luZGV4ID0gajt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGpjID0gaiAqIDI7XG4gICAgICAgICAgICBkeCA9IG91dFswXSAtIG91dFtqYyAgICBdO1xuICAgICAgICAgICAgZHkgPSBvdXRbMV0gLSBvdXRbamMgKyAxXTtcbiAgICAgICAgICAgIGQgID0gZHggKiBkeCArIGR5ICogZHk7XG5cbiAgICAgICAgICAgIGVkZ2VTSW5kZXggPSAoZCA+IG1heCkgPyBqIDogZWRnZVNJbmRleDtcbiAgICAgICAgICAgIGVkZ2VFSW5kZXggPSBlZGdlU0luZGV4ID09IGxlbiAtIDEgPyAwIDogZWRnZVNJbmRleCArIDE7XG5cbiAgICAgICAgICAgIGVkZ2VTSW5kZXgqPSAyO1xuICAgICAgICAgICAgZWRnZUVJbmRleCo9IDI7XG5cbiAgICAgICAgICAgIHggPSBvdXRbZWRnZVNJbmRleCAgICBdO1xuICAgICAgICAgICAgeSA9IG91dFtlZGdlU0luZGV4ICsgMV07XG5cbiAgICAgICAgICAgIG14ID0geCArIChvdXRbZWRnZUVJbmRleCAgICBdIC0geCkgKiAwLjU7XG4gICAgICAgICAgICBteSA9IHkgKyAob3V0W2VkZ2VFSW5kZXggKyAxXSAtIHkpICogMC41O1xuXG4gICAgICAgICAgICBvdXQuc3BsaWNlKGVkZ2VFSW5kZXgsMCxteCxteSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuXG4gICAgfSxcblxuXG4gICAgLy9UT0RPOiBtb2R1bG8gbG9vcFxuICAgIG1ha2VWZXJ0ZXhDb3VudERlY3JlYXNlZCA6IGZ1bmN0aW9uKHBvbHlnb24sY291bnQpXG4gICAge1xuICAgICAgICBjb3VudCA9ICh0eXBlb2YgY291bnQgPT0gJ3VuZGVmaW5lZCcpID8gMSA6IGNvdW50O1xuXG4gICAgICAgIHZhciBvdXQgPSBwb2x5Z29uLnNsaWNlKCk7XG4gICAgICAgIGlmKChvdXQubGVuZ3RoICogMC41IC0gY291bnQpIDwgMyB8fCBjb3VudCA9PSAwKXJldHVybiBvdXQ7XG5cbiAgICAgICAgdmFyIGkgPSAtMSwgajtcbiAgICAgICAgdmFyIGxlbjtcbiAgICAgICAgdmFyIG1pbjtcblxuICAgICAgICB2YXIgamMsam47XG4gICAgICAgIHZhciBkeCxkeSxkO1xuXG4gICAgICAgIHZhciBlZGdlU0luZGV4LFxuICAgICAgICAgICAgZWRnZUVJbmRleDtcblxuICAgICAgICB3aGlsZSgrK2kgPCBjb3VudClcbiAgICAgICAge1xuXG4gICAgICAgICAgICBtaW4gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIGxlbiA9IG91dC5sZW5ndGggKiAwLjU7XG5cbiAgICAgICAgICAgIGVkZ2VTSW5kZXggPSBlZGdlRUluZGV4ID0gMDtcblxuICAgICAgICAgICAgaiA9IC0xO1xuICAgICAgICAgICAgd2hpbGUoKytqIDwgbGVuIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBqYyA9IGogKiAyO1xuICAgICAgICAgICAgICAgIGpuID0gKGogKyAxKSAqIDI7XG5cbiAgICAgICAgICAgICAgICBkeCA9IG91dFtqbiAgICBdIC0gb3V0W2pjICAgIF07XG4gICAgICAgICAgICAgICAgZHkgPSBvdXRbam4gKyAxXSAtIG91dFtqYyArIDFdO1xuICAgICAgICAgICAgICAgIGQgID0gZHggKiBkeCArIGR5ICogZHk7XG5cbiAgICAgICAgICAgICAgICBpZihkIDwgbWluKXttaW4gPSBkO2VkZ2VTSW5kZXggPSBqO31cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgamMgPSBqICogMjtcbiAgICAgICAgICAgIGR4ID0gb3V0WzBdIC0gb3V0W2pjICAgIF07XG4gICAgICAgICAgICBkeSA9IG91dFsxXSAtIG91dFtqYyArIDFdO1xuICAgICAgICAgICAgZCAgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblxuICAgICAgICAgICAgZWRnZVNJbmRleCA9IChkIDwgbWluKSA/IGogOiBlZGdlU0luZGV4O1xuICAgICAgICAgICAgZWRnZUVJbmRleCA9IGVkZ2VTSW5kZXggPT0gbGVuIC0gMSA/IDAgOiBlZGdlU0luZGV4ICsgMTtcblxuICAgICAgICAgICAgb3V0LnNwbGljZShlZGdlRUluZGV4ICogMiwyKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcblxuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIG1ha2VFZGdlc1N1YmRpdmlkZWQgOiBmdW5jdGlvbihwb2x5Z29uLGNvdW50LG91dClcbiAgICB7XG4gICAgICAgIGNvdW50ID0gY291bnQgfHwgMTtcblxuICAgICAgICB2YXIgaSwgaiwgaztcbiAgICAgICAgdmFyIGkyLGk0O1xuXG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciB4LCB5LCBteCwgbXk7XG5cblxuICAgICAgICBpZihvdXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG91dC5sZW5ndGggPSBwb2x5Z29uLmxlbmd0aDtcbiAgICAgICAgICAgIGkgPSAtMTt3aGlsZSgrK2kgPCBwb2x5Z29uLmxlbmd0aCl7b3V0W2ldID0gcG9seWdvbltpXTt9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBvdXQgPSBwb2x5Z29uLnNsaWNlKCk7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBjb3VudClcbiAgICAgICAge1xuXG4gICAgICAgICAgICBsZW4gPSBvdXQubGVuZ3RoICogMC41IC0xO1xuICAgICAgICAgICAgaSA9IC0xO1xuICAgICAgICAgICAgd2hpbGUoKytpIDwgbGVuKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGkyID0gaSAqIDI7XG4gICAgICAgICAgICAgICAgaTQgPSAoaSAqIDIpICogMjtcbiAgICAgICAgICAgICAgICB4ICA9IG91dFtpNF07XG4gICAgICAgICAgICAgICAgeSAgPSBvdXRbaTQgKyAxXTtcblxuICAgICAgICAgICAgICAgIGkyID0gaTIgKyAxO1xuICAgICAgICAgICAgICAgIGk0ID0gaTIgKiAyO1xuICAgICAgICAgICAgICAgIG14ID0geCArIChvdXRbaTQgICAgXSAtIHgpICogMC41O1xuICAgICAgICAgICAgICAgIG15ID0geSArIChvdXRbaTQgKyAxXSAtIHkpICogMC41O1xuXG4gICAgICAgICAgICAgICAgb3V0LnNwbGljZShpNCwwLG14LG15KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaTIgPSBpICAgKiAyO1xuICAgICAgICAgICAgaTQgPSBpMiAqIDI7XG5cbiAgICAgICAgICAgIHggID0gb3V0W2k0XTtcbiAgICAgICAgICAgIHkgID0gb3V0W2k0ICsgMV07XG4gICAgICAgICAgICBteCA9IHggKyAob3V0WzBdIC0geCkgKiAwLjU7XG4gICAgICAgICAgICBteSA9IHkgKyAob3V0WzFdIC0geSkgKiAwLjU7XG5cbiAgICAgICAgICAgIG91dC5zcGxpY2UoKGkyICsgMSkgKiAyLDAsbXgsbXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICBtYWtlU21vb3RoZWRMaW5lYXIgOiBmdW5jdGlvbihwb2x5Z29uLGNvdW50LG91dClcbiAgICB7XG4gICAgICAgIGNvdW50ID0gY291bnQgfHwgMTtcblxuICAgICAgICB2YXIgcHgscHksZHgsZHk7XG5cbiAgICAgICAgdmFyIGksIGosIGs7XG5cbiAgICAgICAgdmFyIHRlbXAgICAgPSBwb2x5Z29uLnNsaWNlKCksXG4gICAgICAgICAgICB0ZW1wTGVuID0gdGVtcC5sZW5ndGg7XG5cbiAgICAgICAgaWYob3V0KW91dC5sZW5ndGggPSB0ZW1wTGVuICAqIDI7XG4gICAgICAgIGVsc2Ugb3V0ID0gbmV3IEFycmF5KHRlbXBMZW4gICogMik7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBjb3VudClcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcExlbiAgICA9IHRlbXAubGVuZ3RoO1xuICAgICAgICAgICAgb3V0Lmxlbmd0aCA9IHRlbXBMZW4gKiAyO1xuXG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIHdoaWxlKGkgPCB0ZW1wTGVuKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHB4ID0gdGVtcFtpICAgIF07XG4gICAgICAgICAgICAgICAgcHkgPSB0ZW1wW2kgKyAxXSA7XG4gICAgICAgICAgICAgICAgayAgPSAoaSArIDIpICUgdGVtcExlbjtcbiAgICAgICAgICAgICAgICBkeCA9IHRlbXBbayAgICBdIC0gcHg7XG4gICAgICAgICAgICAgICAgZHkgPSB0ZW1wW2sgKyAxXSAtIHB5O1xuXG4gICAgICAgICAgICAgICAgayA9IGkgKiAyO1xuICAgICAgICAgICAgICAgIG91dFtrICBdID0gcHggKyBkeCAqIDAuMjU7XG4gICAgICAgICAgICAgICAgb3V0W2srMV0gPSBweSArIGR5ICogMC4yNTtcbiAgICAgICAgICAgICAgICBvdXRbaysyXSA9IHB4ICsgZHggKiAwLjc1O1xuICAgICAgICAgICAgICAgIG91dFtrKzNdID0gcHkgKyBkeSAqIDAuNzU7XG5cbiAgICAgICAgICAgICAgICBpKz0yO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRlbXAgPSBvdXQuc2xpY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG5cbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgbWFrZU9wdEhlYWRpbmcgOiBmdW5jdGlvbihwb2x5Z29uLHRvbGVyYW5jZSlcbiAgICB7XG4gICAgICAgIGlmKHBvbHlnb24ubGVuZ3RoIDwgNClyZXR1cm4gcG9seWdvbjtcblxuICAgICAgICB0b2xlcmFuY2UgPSB0b2xlcmFuY2UgfHwga01hdGguRVBTSUxPTjtcblxuICAgICAgICB2YXIgdGVtcCA9IFtdO1xuXG4gICAgICAgIHZhciBsZW4gPSBwb2x5Z29uLmxlbmd0aCAvIDIgLSAxO1xuXG4gICAgICAgIHZhciBweCA9IHBvbHlnb25bMF0sXG4gICAgICAgICAgICBweSA9IHBvbHlnb25bMV0sXG4gICAgICAgICAgICB4LCB5O1xuXG4gICAgICAgIHZhciBwaCA9IE1hdGguYXRhbjIocG9seWdvblszXSAtIHB5LHBvbHlnb25bMl0gLSBweCksXG4gICAgICAgICAgICBjaDtcblxuICAgICAgICB0ZW1wLnB1c2gocHgscHkpO1xuXG4gICAgICAgIHZhciBpID0gMCxpMjtcblxuICAgICAgICB3aGlsZSgrK2kgPCBsZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGkyID0gaSAqIDI7XG4gICAgICAgICAgICB4ID0gcG9seWdvbltpMiAgXTtcbiAgICAgICAgICAgIHkgPSBwb2x5Z29uW2kyKzFdO1xuXG4gICAgICAgICAgICBpMiA9IChpICsgMSkgKiAyO1xuICAgICAgICAgICAgY2ggPSBNYXRoLmF0YW4yKHBvbHlnb25baTIrMV0gLSB5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25baTIgIF0gLSB4KTtcblxuICAgICAgICAgICAgaWYoTWF0aC5hYnMocGggLSBjaCkgPiB0b2xlcmFuY2UpdGVtcC5wdXNoKHgseSk7XG5cbiAgICAgICAgICAgIHB4ID0geDtcbiAgICAgICAgICAgIHB5ID0geTtcbiAgICAgICAgICAgIHBoID0gY2g7XG4gICAgICAgIH1cblxuICAgICAgICB4ID0gcG9seWdvbltwb2x5Z29uLmxlbmd0aCAtIDJdO1xuICAgICAgICB5ID0gcG9seWdvbltwb2x5Z29uLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGNoID0gTWF0aC5hdGFuMihwb2x5Z29uWzFdIC0geSwgcG9seWdvblswXSAtIHgpO1xuXG4gICAgICAgIGlmKE1hdGguYWJzKHBoIC0gY2gpID4gdG9sZXJhbmNlKXRlbXAucHVzaCh4LHkpO1xuXG4gICAgICAgIHJldHVybiB0ZW1wO1xuICAgIH0sXG5cblxuICAgIG1ha2VPcHRFZGdlTGVuZ3RoIDogZnVuY3Rpb24ocG9seWdvbixlZGdlTGVuZ3RoKVxuICAgIHtcbiAgICAgICAgdmFyIHRlbXAgPSBbXTtcbiAgICAgICAgdmFyIGxlbiAgPSBwb2x5Z29uLmxlbmd0aCAqIDAuNSAtIDE7XG5cbiAgICAgICAgdmFyIGR4LGR5O1xuICAgICAgICB2YXIgcHgscHk7XG4gICAgICAgIHZhciB4LCB5O1xuXG4gICAgICAgIHZhciBpbmRleDtcblxuICAgICAgICB2YXIgZWRnZUxlbmd0aFNxID0gZWRnZUxlbmd0aCAqIGVkZ2VMZW5ndGg7XG5cbiAgICAgICAgcHggPSBwb2x5Z29uWzBdO1xuICAgICAgICBweSA9IHBvbHlnb25bMV07XG5cbiAgICAgICAgdGVtcC5wdXNoKHB4LHB5KTtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSgrK2kgPCBsZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4ID0gaSAqIDI7XG5cbiAgICAgICAgICAgIHggPSAgcG9seWdvbltpbmRleCAgXTtcbiAgICAgICAgICAgIHkgPSAgcG9seWdvbltpbmRleCsxXTtcblxuICAgICAgICAgICAgZHggPSB4IC0gcHg7XG4gICAgICAgICAgICBkeSA9IHkgLSBweTtcblxuICAgICAgICAgICAgaWYoKGR4ICogZHggKyBkeSAqIGR5KSA+PSBlZGdlTGVuZ3RoU3EpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHggPSB4O1xuICAgICAgICAgICAgICAgIHB5ID0geTtcblxuICAgICAgICAgICAgICAgIHRlbXAucHVzaCh4LHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgeCA9IHBvbHlnb25bcG9seWdvbi5sZW5ndGgtMl07XG4gICAgICAgIHkgPSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoLTFdO1xuXG4gICAgICAgIHB4ID0gcG9seWdvblswXTtcbiAgICAgICAgcHkgPSBwb2x5Z29uWzFdO1xuXG4gICAgICAgIGR4ID0geCAtIHB4O1xuICAgICAgICBkeSA9IHkgLSBweTtcblxuICAgICAgICBpZigoZHggKiBkeCArIGR5ICogZHkpID49IGVkZ2VMZW5ndGhTcSl0ZW1wLnB1c2goeCx5KTtcblxuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICAvL2h0dHA6Ly9hbGllbnJ5ZGVyZmxleC5jb20vcG9seWdvbl9wZXJpbWV0ZXIvXG4gICAgbWFrZVBlcmltZXRlciA6IGZ1bmN0aW9uKHBvbHlnb24sb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIFRXT19QSSAgID0gTWF0aC5QSSAqIDIsXG4gICAgICAgICAgICBQSSAgICAgICA9IE1hdGguUEk7XG5cbiAgICAgICAgdmFyIGNvcm5lcnMgID0gcG9seWdvbi5sZW5ndGggKiAwLjU7XG4gICAgICAgIHZhciBNQVhfU0VHUyA9IGNvcm5lcnMgKiA0O1xuXG4gICAgICAgIGlmKGNvcm5lcnMgPiBNQVhfU0VHUykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgb3V0Lmxlbmd0aCA9IDA7XG5cbiAgICAgICAgdmFyIHNlZ1MgPSBuZXcgQXJyYXkoTUFYX1NFR1MgKiAyKSxcbiAgICAgICAgICAgIHNlZ0UgPSBuZXcgQXJyYXkoTUFYX1NFR1MgKiAyKSxcbiAgICAgICAgICAgIHNlZ0FuZ2xlICAgPSBuZXcgQXJyYXkoTUFYX1NFR1MpO1xuXG4gICAgICAgIHZhciBpbnRlcnNlY3RzID0gbmV3IEFycmF5KDIpLFxuICAgICAgICAgICAgaW50ZXJzZWN0WCxpbnRlcnNlY3RZO1xuXG4gICAgICAgIHZhciBzdGFydFggICAgPSBwb2x5Z29uWzBdLFxuICAgICAgICAgICAgc3RhcnRZICAgID0gcG9seWdvblsxXSxcbiAgICAgICAgICAgIGxhc3RBbmdsZSA9IFBJO1xuXG4gICAgICAgIHZhciBpbmRleGksaW5kZXhqLFxuICAgICAgICAgICAgaW5kZXhTZWcsaW5kZXhTZWdpLGluZGV4U2VnaixcbiAgICAgICAgICAgIHBpeCxwaXkscGp4LHBqeTtcblxuICAgICAgICB2YXIgYSwgYiwgYywgZCwgZSwgZixcbiAgICAgICAgICAgIGFuZ2xlRGlmLCBiZXN0QW5nbGVEaWY7XG5cbiAgICAgICAgdmFyIGksIGogPSBjb3JuZXJzIC0gMSwgc2VncyA9IDA7XG5cbiAgICAgICAgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2kgPCBjb3JuZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleGkgPSBpICogMjtcbiAgICAgICAgICAgIGluZGV4aiA9IGogKiAyO1xuXG4gICAgICAgICAgICBwaXggPSBwb2x5Z29uW2luZGV4aSAgXTtcbiAgICAgICAgICAgIHBpeSA9IHBvbHlnb25baW5kZXhpKzFdO1xuICAgICAgICAgICAgcGp4ID0gcG9seWdvbltpbmRleGogIF07XG4gICAgICAgICAgICBwankgPSBwb2x5Z29uW2luZGV4aisxXTtcblxuICAgICAgICAgICAgaWYgKHBpeCAhPSBwanggfHwgcGl5ICE9IHBqeSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbmRleFNlZyA9IHNlZ3MgKiAyO1xuXG4gICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZyAgXSA9IHBpeDtcbiAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnKzFdID0gcGl5O1xuICAgICAgICAgICAgICAgIHNlZ0VbaW5kZXhTZWcgIF0gPSBwang7XG4gICAgICAgICAgICAgICAgc2VnRVtpbmRleFNlZysxXSA9IHBqeTtcblxuICAgICAgICAgICAgICAgIHNlZ3MrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaiA9IGk7XG5cbiAgICAgICAgICAgIGlmIChwaXkgPiBzdGFydFkgfHwgcGl5ID09IHN0YXJ0WSAmJiBwaXggPCBzdGFydFgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhcnRYID0gcGl4O1xuICAgICAgICAgICAgICAgIHN0YXJ0WSA9IHBpeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWdzID09IDApIHJldHVybiBmYWxzZTtcblxuICAgICAgICB2YXIgaXNTZWdtZW50SW50ZXJzZWN0aW9uZiA9IExpbmUyZFV0aWwuaXNTZWdtZW50SW50ZXJzZWN0aW9uZjtcblxuICAgICAgICB2YXIgc2VnU3hpLHNlZ1N5aSxcbiAgICAgICAgICAgIHNlZ1N4aixzZWdTeWo7XG5cbiAgICAgICAgdmFyIHNlZ0V4aSxzZWdFeWksXG4gICAgICAgICAgICBzZWdFeGosc2VnRXlqO1xuXG4gICAgICAgIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpIDwgc2VncyAtIDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4U2VnaSA9IGkgKiAyO1xuXG4gICAgICAgICAgICBzZWdTeGkgPSBzZWdTW2luZGV4U2VnaSAgXTtcbiAgICAgICAgICAgIHNlZ1N5aSA9IHNlZ1NbaW5kZXhTZWdpKzFdO1xuICAgICAgICAgICAgc2VnRXhpID0gc2VnRVtpbmRleFNlZ2kgIF07XG4gICAgICAgICAgICBzZWdFeWkgPSBzZWdFW2luZGV4U2VnaSsxXTtcblxuICAgICAgICAgICAgaiA9IGk7XG4gICAgICAgICAgICB3aGlsZSgrK2ogPCBzZWdzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluZGV4U2VnaiA9IGogKiAyO1xuXG4gICAgICAgICAgICAgICAgc2VnU3hqID0gc2VnU1tpbmRleFNlZ2ogIF07XG4gICAgICAgICAgICAgICAgc2VnU3lqID0gc2VnU1tpbmRleFNlZ2orMV07XG4gICAgICAgICAgICAgICAgc2VnRXhqID0gc2VnRVtpbmRleFNlZ2ogIF07XG4gICAgICAgICAgICAgICAgc2VnRXlqID0gc2VnRVtpbmRleFNlZ2orMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNTZWdtZW50SW50ZXJzZWN0aW9uZihcbiAgICAgICAgICAgICAgICAgICAgc2VnU3hpLHNlZ1N5aSxzZWdFeGksc2VnRXlpLFxuICAgICAgICAgICAgICAgICAgICBzZWdTeGosc2VnU3lqLHNlZ0V4aixzZWdFeWosaW50ZXJzZWN0cykpXG4gICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgIGludGVyc2VjdFggPSBpbnRlcnNlY3RzWzBdO1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RZID0gaW50ZXJzZWN0c1sxXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoKGludGVyc2VjdFggIT0gc2VnU3hpIHx8IGludGVyc2VjdFkgIT0gc2VnU3lpKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGludGVyc2VjdFggIT0gc2VnRXhpIHx8IGludGVyc2VjdFkgIT0gc2VnRXlpKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VncyA9PSBNQVhfU0VHUykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleFNlZyA9IHNlZ3MgKiAyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnICBdID0gc2VnU3hpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZysxXSA9IHNlZ1N5aTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VbaW5kZXhTZWcgIF0gPSBpbnRlcnNlY3RYO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnRVtpbmRleFNlZysxXSA9IGludGVyc2VjdFk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ3MrKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZ2kgIF0gPSBpbnRlcnNlY3RYO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZ2krMV0gPSBpbnRlcnNlY3RZO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnNlY3RYICE9IHNlZ1N4aiB8fCBpbnRlcnNlY3RZICE9IHNlZ1N5aikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnRlcnNlY3RYICE9IHNlZ0V4aiB8fCBpbnRlcnNlY3RZICE9IHNlZ0V5aikpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlZ3MgPT0gTUFYX1NFR1MpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhTZWcgPSBzZWdzICogMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZyAgXSA9IHNlZ1N4ajtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWcrMV0gPSBzZWdTeWo7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdFW2luZGV4U2VnICBdID0gaW50ZXJzZWN0WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VbaW5kZXhTZWcrMV0gPSBpbnRlcnNlY3RZO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdzKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWdqICBdID0gaW50ZXJzZWN0WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWdqKzFdID0gaW50ZXJzZWN0WTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIHNlZ0RpZmZ4LFxuICAgICAgICAgICAgc2VnRGlmZnksXG4gICAgICAgICAgICBzZWdMZW47XG5cbiAgICAgICAgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2kgPCBzZWdzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleFNlZ2kgPSBpICogMjtcbiAgICAgICAgICAgIHNlZ0RpZmZ4ID0gc2VnRVtpbmRleFNlZ2kgIF0gLSBzZWdTW2luZGV4U2VnaSAgXTtcbiAgICAgICAgICAgIHNlZ0RpZmZ5ID0gc2VnRVtpbmRleFNlZ2krMV0gLSBzZWdTW2luZGV4U2VnaSsxXTtcblxuICAgICAgICAgICAgc2VnTGVuICAgPSBNYXRoLnNxcnQoc2VnRGlmZnggKiBzZWdEaWZmeCArIHNlZ0RpZmZ5ICogc2VnRGlmZnkpIHx8IDE7XG5cbiAgICAgICAgICAgIHNlZ0FuZ2xlW2ldID0gKHNlZ0RpZmZ5ID49IDAuMCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5hY29zKHNlZ0RpZmZ4L3NlZ0xlbikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAoTWF0aC5hY29zKC1zZWdEaWZmeC9zZWdMZW4pICsgUEkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjID0gc3RhcnRYO1xuICAgICAgICBkID0gc3RhcnRZO1xuICAgICAgICBhID0gYyAtIDE7XG4gICAgICAgIGIgPSBkO1xuICAgICAgICBlID0gMDtcbiAgICAgICAgZiA9IDA7XG5cbiAgICAgICAgY29ybmVycyA9IDE7XG5cbiAgICAgICAgb3V0LnB1c2goYyxkKTtcblxuICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgYmVzdEFuZ2xlRGlmID0gVFdPX1BJO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VnczsgaSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluZGV4U2VnaSA9IGkgKiAyO1xuXG4gICAgICAgICAgICAgICAgc2VnU3hpID0gc2VnU1tpbmRleFNlZ2kgIF07XG4gICAgICAgICAgICAgICAgc2VnU3lpID0gc2VnU1tpbmRleFNlZ2krMV07XG4gICAgICAgICAgICAgICAgc2VnRXhpID0gc2VnRVtpbmRleFNlZ2kgIF07XG4gICAgICAgICAgICAgICAgc2VnRXlpID0gc2VnRVtpbmRleFNlZ2krMV07XG5cblxuICAgICAgICAgICAgICAgIGlmIChzZWdTeGkgPT0gYyAmJiBzZWdTeWkgPT0gZCAmJlxuICAgICAgICAgICAgICAgICAgICAoc2VnRXhpICE9YSB8fCBzZWdFeWkgIT0gYikpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhbmdsZURpZiA9IGxhc3RBbmdsZSAtIHNlZ0FuZ2xlW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChhbmdsZURpZiA+PSBUV09fUEkpIGFuZ2xlRGlmIC09IFRXT19QSTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGFuZ2xlRGlmIDwgMCAgICAgICkgYW5nbGVEaWYgKz0gVFdPX1BJO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZURpZiA8IGJlc3RBbmdsZURpZilcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdEFuZ2xlRGlmID0gYW5nbGVEaWY7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gc2VnRXhpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHNlZ0V5aTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VnRXhpID09IGMgJiYgc2VnRXlpID09IGQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHNlZ1N4aSAhPWEgfHwgc2VnU3lpICE9IGIpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVEaWYgPSBsYXN0QW5nbGUgLSBzZWdBbmdsZVtpXSArIFBJO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChhbmdsZURpZiA+PSBUV09fUEkpIGFuZ2xlRGlmIC09IFRXT19QSTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGFuZ2xlRGlmIDwgIDAgICAgICkgYW5nbGVEaWYgKz0gVFdPX1BJO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmdsZURpZiA8IGJlc3RBbmdsZURpZilcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdEFuZ2xlRGlmID0gYW5nbGVEaWY7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gc2VnU3hpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHNlZ1N5aTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvcm5lcnMgPiAxICYmXG4gICAgICAgICAgICAgICAgYyA9PSBvdXRbMF0gJiYgZCA9PSBvdXRbMV0gJiZcbiAgICAgICAgICAgICAgICBlID09IG91dFsyXSAmJiBmID09IG91dFszXSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb3JuZXJzLS07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChiZXN0QW5nbGVEaWYgPT0gVFdPX1BJIHx8XG4gICAgICAgICAgICAgICAgY29ybmVycyA9PSBNQVhfU0VHUylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvcm5lcnMrKztcbiAgICAgICAgICAgIG91dC5wdXNoKGUsZik7XG5cbiAgICAgICAgICAgIGxhc3RBbmdsZSAtPSBiZXN0QW5nbGVEaWYgKyBQSTtcblxuICAgICAgICAgICAgYSA9IGM7XG4gICAgICAgICAgICBiID0gZDtcbiAgICAgICAgICAgIGMgPSBlO1xuICAgICAgICAgICAgZCA9IGY7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICAvL2h0dHA6Ly9hbGllbnJ5ZGVyZmxleC5jb20vcG9seWdvbl9pbnNldC9cbiAgICBtYWtlSW5zZXQgOiBmdW5jdGlvbihwb2x5Z29uLGRpc3RhbmNlKVxuICAgIHtcbiAgICAgICAgaWYocG9seWdvbi5sZW5ndGggPD0gMilyZXR1cm4gbnVsbDtcblxuICAgICAgICB2YXIgbnVtID0gcG9seWdvbi5sZW5ndGggKiAwLjUgLSAxO1xuXG4gICAgICAgIHZhciBzeCA9IHBvbHlnb25bMF0sXG4gICAgICAgICAgICBzeSA9IHBvbHlnb25bMV07XG5cbiAgICAgICAgdmFyIGEsIGIsXG4gICAgICAgICAgICBjID0gcG9seWdvbltwb2x5Z29uLmxlbmd0aCAtIDJdLFxuICAgICAgICAgICAgZCA9IHBvbHlnb25bcG9seWdvbi5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgIGUgPSBzeCxcbiAgICAgICAgICAgIGYgPSBzeTtcblxuICAgICAgICB2YXIgaW5kZXgwLGluZGV4MTtcblxuICAgICAgICB2YXIgdGVtcCA9IG5ldyBBcnJheSgyKTtcblxuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbnVtKVxuICAgICAgICB7XG4gICAgICAgICAgICBhID0gYztcbiAgICAgICAgICAgIGIgPSBkO1xuICAgICAgICAgICAgYyA9IGU7XG4gICAgICAgICAgICBkID0gZjtcblxuICAgICAgICAgICAgaW5kZXgwID0gaSAqIDI7XG4gICAgICAgICAgICBpbmRleDEgPSAoaSsxKSoyO1xuXG4gICAgICAgICAgICBlID0gcG9seWdvbltpbmRleDEgICAgXTtcbiAgICAgICAgICAgIGYgPSBwb2x5Z29uW2luZGV4MSArIDFdO1xuXG4gICAgICAgICAgICB0ZW1wWzBdID0gcG9seWdvbltpbmRleDBdO1xuICAgICAgICAgICAgdGVtcFsxXSA9IHBvbHlnb25baW5kZXgwICsgMV07XG5cbiAgICAgICAgICAgIHRoaXMubWFrZUluc2V0Q29ybmVyKGEsIGIsIGMsIGQsIGUsIGYsIGRpc3RhbmNlLCB0ZW1wKTtcbiAgICAgICAgICAgIHBvbHlnb25baW5kZXgwICAgIF0gPSB0ZW1wWzBdO1xuICAgICAgICAgICAgcG9seWdvbltpbmRleDAgKyAxXSA9IHRlbXBbMV07XG4gICAgICAgIH1cblxuICAgICAgICBpbmRleDAgPSBpICogMjtcblxuICAgICAgICB0ZW1wWzBdID0gcG9seWdvbltpbmRleDAgICAgXTtcbiAgICAgICAgdGVtcFsxXSA9IHBvbHlnb25baW5kZXgwICsgMV07XG5cbiAgICAgICAgdGhpcy5tYWtlSW5zZXRDb3JuZXIoYywgZCwgZSwgZiwgc3gsIHN5LCBkaXN0YW5jZSwgdGVtcCk7XG4gICAgICAgIHBvbHlnb25baW5kZXgwICAgIF0gPSB0ZW1wWzBdO1xuICAgICAgICBwb2x5Z29uW2luZGV4MCArIDFdID0gdGVtcFsxXTtcblxuICAgICAgICByZXR1cm4gcG9seWdvbjtcbiAgICB9LFxuXG4gICAgbWFrZUluc2V0Q29ybmVyIDogZnVuY3Rpb24oYSxiLGMsZCxlLGYsZGlzdGFuY2Usb3V0KVxuICAgIHtcbiAgICAgICAgdmFyICBjMSA9IGMsXG4gICAgICAgICAgICBkMSA9IGQsXG4gICAgICAgICAgICBjMiA9IGMsXG4gICAgICAgICAgICBkMiA9IGQsXG4gICAgICAgICAgICBkeDEsIGR5MSwgZGlzdDEsXG4gICAgICAgICAgICBkeDIsIGR5MiwgZGlzdDIsXG4gICAgICAgICAgICBpbnNldFgsIGluc2V0WSA7XG5cbiAgICAgICAgdmFyIEVQU0lMT04gPSAwLjAwMDE7XG5cbiAgICAgICAgZHgxICAgPSBjIC0gYTtcbiAgICAgICAgZHkxICAgPSBkIC0gYjtcbiAgICAgICAgZGlzdDEgPSBNYXRoLnNxcnQoZHgxKmR4MStkeTEqZHkxKTtcblxuICAgICAgICBkeDIgICA9IGUgLSBjO1xuICAgICAgICBkeTIgICA9IGYgLSBkO1xuICAgICAgICBkaXN0MiA9IE1hdGguc3FydChkeDIqZHgyK2R5MipkeTIpO1xuXG4gICAgICAgIGlmKGRpc3QxIDwgRVBTSUxPTiB8fCBkaXN0MiAgPCBFUFNJTE9OKXJldHVybjtcblxuICAgICAgICBkaXN0MSA9IDEuMCAvIGRpc3QxO1xuICAgICAgICBkaXN0MiA9IDEuMCAvIGRpc3QyO1xuXG4gICAgICAgIGluc2V0WCA9IGR5MSAqIGRpc3QxICogZGlzdGFuY2U7XG4gICAgICAgIGEgICAgICs9IGluc2V0WDtcbiAgICAgICAgYzEgICAgKz0gaW5zZXRYO1xuXG4gICAgICAgIGluc2V0WSA9LWR4MSAqIGRpc3QxICogZGlzdGFuY2U7XG4gICAgICAgIGIgICAgICs9IGluc2V0WTtcbiAgICAgICAgZDEgICAgKz0gaW5zZXRZO1xuXG4gICAgICAgIGluc2V0WCA9IGR5MiAqIGRpc3QyICogZGlzdGFuY2U7XG4gICAgICAgIGUgICAgICs9IGluc2V0WDtcbiAgICAgICAgYzIgICAgKz0gaW5zZXRYO1xuXG4gICAgICAgIGluc2V0WSA9LWR4MiAqIGRpc3QyICogZGlzdGFuY2U7XG4gICAgICAgIGYgICAgICs9IGluc2V0WTtcbiAgICAgICAgZDIgICAgKz0gaW5zZXRZO1xuXG4gICAgICAgIGlmIChjMSA9PSBjMiAmJiBkMT09ZDIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG91dFswXSA9IGMxO1xuICAgICAgICAgICAgb3V0WzFdID0gZDE7XG4gICAgICAgICAgICByZXR1cm47IH1cblxuICAgICAgICB2YXIgdGVtcCA9IG5ldyBBcnJheSgyKTtcblxuICAgICAgICBpZiAoTGluZTJkVXRpbC5pc0ludGVyc2VjdGlvbmYoYSxiLGMxLGQxLGMyLGQyLGUsZix0ZW1wKSlcbiAgICAgICAge1xuICAgICAgICAgICAgb3V0WzBdID0gdGVtcFswXTtcbiAgICAgICAgICAgIG91dFsxXSA9IHRlbXBbMV07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgaXNQb2ludEluUG9seWdvbiA6IGZ1bmN0aW9uKHgseSxwb2ludHMpXG4gICAge1xuICAgICAgICB2YXIgd24gPSAwO1xuICAgICAgICB2YXIgbGVuID0gcG9pbnRzLmxlbmd0aCAvIDI7XG5cbiAgICAgICAgdmFyIGluZGV4MCxcbiAgICAgICAgICAgIGluZGV4MTtcblxuXG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlKCsraSA8IGxlbiAtIDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4MCA9IGkgKiAyO1xuICAgICAgICAgICAgaW5kZXgxID0gKGkgKyAxKSAqIDI7XG5cbiAgICAgICAgICAgIGlmKHBvaW50c1tpbmRleDArMV0gPD0geSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZihwb2ludHNbaW5kZXgxKzFdID4geSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKExpbmUyZFV0aWwuaXNQb2ludExlZnQocG9pbnRzW2luZGV4MF0scG9pbnRzW2luZGV4MCArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDFdLHBvaW50c1tpbmRleDEgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LHkpPjApKyt3bjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYocG9pbnRzW2luZGV4MSsxXSA8PSB5KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoTGluZTJkVXRpbC5pc1BvaW50TGVmdChwb2ludHNbaW5kZXgwXSxwb2ludHNbaW5kZXgwICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MV0scG9pbnRzW2luZGV4MSArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgseSk8MCktLXduO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHduO1xuXG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgbWFrZVZlcnRpY2VzUmV2ZXJzZWQgOiBmdW5jdGlvbihwb2x5Z29uKXsgcmV0dXJuIHBvbHlnb24ucmV2ZXJzZSgpO30sXG5cblxuICAgIG1ha2VQb2x5Z29uM2RGbG9hdDMyIDogZnVuY3Rpb24ocG9seWdvbixzY2FsZSlcbiAgICB7XG4gICAgICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xuXG4gICAgICAgIHZhciBwb2x5TGVuID0gcG9seWdvbi5sZW5ndGggKiAwLjUsXG4gICAgICAgICAgICBvdXQgICAgID0gbmV3IEZsb2F0MzJBcnJheShwb2x5TGVuICogMyk7XG4gICAgICAgIHZhciBpbmRleDAsaW5kZXgxO1xuXG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlKCsraSA8IHBvbHlMZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4MCA9IGkgKiAzO1xuICAgICAgICAgICAgaW5kZXgxID0gaSAqIDI7XG5cbiAgICAgICAgICAgIG91dFtpbmRleDAgIF0gPSBwb2x5Z29uW2luZGV4MSAgXSAqIHNjYWxlO1xuICAgICAgICAgICAgb3V0W2luZGV4MCsxXSA9IDAuMDtcbiAgICAgICAgICAgIG91dFtpbmRleDArMl0gPSBwb2x5Z29uW2luZGV4MSsxXSAqIHNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKlxuICAgIC8vU3V0aGVybGFuZC1Ib2RnbWFuXG4gICAgbWFrZUNsaXBwaW5nU0ggOiBmdW5jdGlvbihwb2x5Z29uLGNsaXBwaW5nUG9seWdvbilcbiAgICB7XG4gICAgICAgIHZhciBsZW4wID0gcG9seWdvbi5sZW5ndGggKiAwLjUsXG4gICAgICAgICAgICBsZW4xID0gY2xpcHBpbmdQb2x5Z29uLmxlbmd0aCA7XG5cblxuICAgICAgICB2YXIgTGluZTJkVXRpbCA9IEdMS2l0LkxpbmUyZFV0aWw7XG5cbiAgICAgICAgdmFyIG91dCA9IFtdO1xuXG4gICAgICAgIHZhciBjbGlwRWRnZVN4LGNsaXBFZGdlU3ksXG4gICAgICAgICAgICBjbGlwRWRnZUV4LGNsaXBFZGdlRXk7XG5cbiAgICAgICAgdmFyIHBvbHlFZGdlU3gsIHBvbHlFZGdlU3ksXG4gICAgICAgICAgICBwb2x5RWRnZUV4LCBwb2x5RWRnZUV5O1xuXG4gICAgICAgIHZhciBwb2x5VmVydElzT25MZWZ0O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGNsaXBwaW5nUG9seWdvbik7XG5cbiAgICAgICAgdmFyIGksIGo7XG5cbiAgICAgICAgdmFyIGkyLCBqMiwgaTQ7XG5cbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlKGkgPCBsZW4xKVxuICAgICAgICB7XG4gICAgICAgICAgICBjbGlwRWRnZVN4ID0gY2xpcHBpbmdQb2x5Z29uW2kgIF07XG4gICAgICAgICAgICBjbGlwRWRnZVN5ID0gY2xpcHBpbmdQb2x5Z29uW2krMV07XG5cbiAgICAgICAgICAgIGkyID0gKGkgKyAyKSAlIGxlbjE7XG4gICAgICAgICAgICBjbGlwRWRnZUV4ID0gY2xpcHBpbmdQb2x5Z29uW2kyXTtcbiAgICAgICAgICAgIGNsaXBFZGdlRXkgPSBjbGlwcGluZ1BvbHlnb25baTIrMV07XG5cblxuICAgICAgICAgICAgaSs9MjtcbiAgICAgICAgfVxuICAgICAgIC8vIHdoaWxlKCsraSA8KVxuXG5cblxuICAgICAgICByZXR1cm4gb3V0O1xuXG4gICAgfSxcblxuICAgIG1ha2VDbGlwcGluZ1YgOiBmdW5jdGlvbihwb2x5Z29uLGNsaXBwaW5nUG9seWdvbilcbiAgICB7XG5cbiAgICB9LFxuXG4gICAgbWFrZVNjYW5GaWxsIDogZnVuY3Rpb24ocG9seWdvbilcbiAgICB7XG5cbiAgICB9XG5cbiAgICAqL1xuXG5cblxuXG59OyIsInZhciBrTWF0aCA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrTWF0aCcpLFxuICAgIFZlYzMgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgTWF0NDQgPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdDQ0Jyk7XG5cbi8vVE9ETzogQWRkIGNsb3NlLCBzbW9vdGggaW4gb3V0IGludHJwbCwgcHJlIHBvc3QgcG9pbnRzXG5mdW5jdGlvbiBTcGxpbmUoKVxue1xuICAgIHRoaXMucG9pbnRzICAgICA9IG51bGw7XG4gICAgdGhpcy52ZXJ0aWNlcyAgID0gbnVsbDtcblxuICAgIHRoaXMuX2RldGFpbCAgICA9IDIwO1xuICAgIHRoaXMuX3RlbnNpb24gICA9IDA7XG4gICAgdGhpcy5fYmlhcyAgICAgID0gMDtcbiAgICB0aGlzLl9udW1Qb2ludHMgPSBudWxsO1xuICAgIHRoaXMuX251bVZlcnRzICA9IG51bGw7XG5cbiAgICB0aGlzLl90ZW1wVmVjMCAgPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl90ZW1wVmVjMSAgPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl90ZW1wTWF0MCAgPSBNYXQ0NC5tYWtlKCk7XG4gICAgdGhpcy5fdGVtcE1hdDEgID0gTWF0NDQubWFrZSgpO1xuICAgIHRoaXMuX3RlbXBNYXQyICA9IE1hdDQ0Lm1ha2UoKTtcblxuICAgIHRoaXMuX2F4aXNZICAgICA9IFZlYzMuQVhJU19ZKCk7XG59O1xuXG5TcGxpbmUucHJvdG90eXBlLnNldFBvaW50M2YgPSBmdW5jdGlvbihpbmRleCx4LHkseilcbntcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHM7XG5cbiAgICBpbmRleCo9MztcbiAgICBwb2ludHNbaW5kZXggIF0gPSB4O1xuICAgIHBvaW50c1tpbmRleCsxXSA9IHk7XG4gICAgcG9pbnRzW2luZGV4KzJdID0gejtcbn07XG5cblNwbGluZS5wcm90b3R5cGUuc2V0UG9pbnRzID0gIGZ1bmN0aW9uKGFycilcbntcbiAgICB2YXIgbnVtICAgICAgICAgPSB0aGlzLl9udW1Qb2ludHMgPSBhcnIubGVuZ3RoIC8gMyxcbiAgICAgICAgbnVtVmVydHMgICAgPSB0aGlzLl9udW1WZXJ0cyAgPSAobnVtIC0gMSkgKiAodGhpcy5fZGV0YWlsIC0gMSkgKyAxO1xuXG4gICAgdGhpcy5wb2ludHMgICAgID0gbmV3IEZsb2F0MzJBcnJheShhcnIpO1xuICAgIHRoaXMudmVydGljZXMgICA9IG5ldyBGbG9hdDMyQXJyYXkobnVtVmVydHMgKiAzKTtcbn07XG5cblNwbGluZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBkZXRhaWwgICAgPSB0aGlzLl9kZXRhaWwsXG4gICAgICAgIGRldGFpbF8xICA9IGRldGFpbCAtIDEsXG4gICAgICAgIHBvaW50cyAgICA9IHRoaXMucG9pbnRzLFxuICAgICAgICBudW1Qb2ludHMgPSB0aGlzLl9udW1Qb2ludHMsXG4gICAgICAgIHZlcnRpY2VzICA9IHRoaXMudmVydGljZXM7XG5cbiAgICB2YXIgdGVuc2lvbiAgICAgICA9IHRoaXMuX3RlbnNpb24sXG4gICAgICAgIGJpYXMgICAgICAgICAgPSB0aGlzLl9iaWFzLFxuICAgICAgICBoZXJtaXRlSW50cnBsID0ga01hdGguaGVybWl0ZUludHJwbDtcblxuICAgIHZhciBpLCBqLCB0O1xuICAgIHZhciBsZW4gPSBudW1Qb2ludHMgLSAxO1xuXG4gICAgdmFyIGluZGV4LGluZGV4XzEsaW5kZXgxLGluZGV4MixcbiAgICAgICAgdmVydEluZGV4O1xuXG4gICAgdmFyIHgsIHksIHo7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgbGVuKVxuICAgIHtcbiAgICAgICAgaW5kZXggICAgPSBpO1xuXG4gICAgICAgIGluZGV4MSAgID0gTWF0aC5taW4oKGluZGV4ICsgMSksbGVuKSAqIDM7XG4gICAgICAgIGluZGV4MiAgID0gTWF0aC5taW4oKGluZGV4ICsgMiksbGVuKSAqIDM7XG4gICAgICAgIGluZGV4XzEgID0gTWF0aC5tYXgoMCwoaW5kZXggLSAxKSkgICAqIDM7XG4gICAgICAgIGluZGV4ICAgKj0gMztcblxuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IGRldGFpbF8xKVxuICAgICAgICB7XG4gICAgICAgICAgICB0ID0gaiAvIGRldGFpbF8xO1xuXG4gICAgICAgICAgICB4ID0gaGVybWl0ZUludHJwbChwb2ludHNbaW5kZXhfMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXggIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgxIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgyIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LHRlbnNpb24sYmlhcyk7XG5cbiAgICAgICAgICAgIHkgPSBoZXJtaXRlSW50cnBsKHBvaW50c1tpbmRleF8xICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXggICArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MSAgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDIgICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LHRlbnNpb24sYmlhcyk7XG5cbiAgICAgICAgICAgIHogPSBoZXJtaXRlSW50cnBsKHBvaW50c1tpbmRleF8xICsgMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXggICArIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MSAgKyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDIgICsgMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LHRlbnNpb24sYmlhcyk7XG5cbiAgICAgICAgICAgIHZlcnRJbmRleCA9IChpICogZGV0YWlsXzEgKyBqKSAqIDM7XG5cbiAgICAgICAgICAgIHZlcnRpY2VzW3ZlcnRJbmRleCAgXSA9IHg7XG4gICAgICAgICAgICB2ZXJ0aWNlc1t2ZXJ0SW5kZXgrMV0gPSB5O1xuICAgICAgICAgICAgdmVydGljZXNbdmVydEluZGV4KzJdID0gejtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB2ZXJ0TGVuICAgPSB2ZXJ0aWNlcy5sZW5ndGgsXG4gICAgICAgIHBvaW50c0xlbiA9IHBvaW50cy5sZW5ndGg7XG5cbiAgICB2ZXJ0aWNlc1t2ZXJ0TGVuLTNdID0gcG9pbnRzW3BvaW50c0xlbi0zXTtcbiAgICB2ZXJ0aWNlc1t2ZXJ0TGVuLTJdID0gcG9pbnRzW3BvaW50c0xlbi0yXTtcbiAgICB2ZXJ0aWNlc1t2ZXJ0TGVuLTFdID0gcG9pbnRzW3BvaW50c0xlbi0xXTtcblxufTtcblxuU3BsaW5lLnByb3RvdHlwZS5zZXREZXRhaWwgID0gZnVuY3Rpb24oZGV0YWlsKSB7dGhpcy5fZGV0YWlsICA9IGRldGFpbDt9O1xuU3BsaW5lLnByb3RvdHlwZS5zZXRUZW5zaW9uID0gZnVuY3Rpb24odGVuc2lvbil7dGhpcy5fdGVuc2lvbiA9IHRlbnNpb247fTtcblNwbGluZS5wcm90b3R5cGUuc2V0QmlhcyAgICA9IGZ1bmN0aW9uKGJpYXMpICAge3RoaXMuX2JpYXMgICAgPSBiaWFzO307XG5cblNwbGluZS5wcm90b3R5cGUuZ2V0TnVtUG9pbnRzICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9udW1Qb2ludHM7fTtcblNwbGluZS5wcm90b3R5cGUuZ2V0TnVtVmVydGljZXMgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9udW1WZXJ0czt9O1xuXG5TcGxpbmUucHJvdG90eXBlLmdldFZlYzNPblBvaW50cyA9IGZ1bmN0aW9uKHZhbCxvdXQpXG57XG4gICAgb3V0ID0gb3V0IHx8IHRoaXMuX3RlbXBWZWMwO1xuXG4gICAgdmFyIHBvaW50cyAgICA9IHRoaXMucG9pbnRzLFxuICAgICAgICBudW1Qb2ludHMgPSB0aGlzLl9udW1Qb2ludHMsXG4gICAgICAgIGxlbiAgICAgICA9IG51bVBvaW50cyAtIDE7XG5cbiAgICB2YXIgaW5kZXggID0gTWF0aC5mbG9vcihudW1Qb2ludHMgKiB2YWwpLFxuICAgICAgICBpbmRleDEgPSBNYXRoLm1pbihpbmRleCArIDEsIGxlbik7XG5cbiAgICAgICAgaW5kZXggKj0gMztcbiAgICAgICAgaW5kZXgxKj0gMztcblxuICAgIHZhciBsb2NhbEludHJwbCAgICA9ICh2YWwgJSAoMSAvIG51bVBvaW50cykpICogbnVtUG9pbnRzLFxuICAgICAgICBsb2NhbEludHJwbEludiA9IDEuMCAtIGxvY2FsSW50cnBsO1xuXG4gICAgb3V0WzBdID0gcG9pbnRzW2luZGV4ICBdICogbG9jYWxJbnRycGxJbnYgKyBwb2ludHNbaW5kZXgxICBdICogbG9jYWxJbnRycGw7XG4gICAgb3V0WzFdID0gcG9pbnRzW2luZGV4KzFdICogbG9jYWxJbnRycGxJbnYgKyBwb2ludHNbaW5kZXgxKzFdICogbG9jYWxJbnRycGw7XG4gICAgb3V0WzJdID0gcG9pbnRzW2luZGV4KzJdICogbG9jYWxJbnRycGxJbnYgKyBwb2ludHNbaW5kZXgxKzJdICogbG9jYWxJbnRycGw7XG5cbiAgICByZXR1cm4gb3V0O1xuXG59O1xuXG5TcGxpbmUucHJvdG90eXBlLmdldFZlYzNPblNwbGluZSA9IGZ1bmN0aW9uKHZhbCxvdXQpXG57XG4gICAgb3V0ID0gb3V0IHx8IHRoaXMuX3RlbXBWZWMwO1xuXG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcyxcbiAgICAgICAgbnVtVmVydHMgPSB0aGlzLl9udW1WZXJ0cyxcbiAgICAgICAgbGVuICAgICAgPSBudW1WZXJ0cyAtIDE7XG5cbiAgICB2YXIgaW5kZXggID0gTWF0aC5taW4oTWF0aC5mbG9vcihudW1WZXJ0cyAqIHZhbCksbGVuKSxcbiAgICAgICAgaW5kZXgxID0gTWF0aC5taW4oaW5kZXggKyAxLGxlbik7XG5cbiAgICB2YXIgbG9jYWxJbnRycGwgICAgPSAodmFsICUgKDEuMCAvIG51bVZlcnRzKSkgKiBudW1WZXJ0cyxcbiAgICAgICAgbG9jYWxJbnRycGxJbnYgPSAxLjAgLSBsb2NhbEludHJwbDtcblxuICAgIGluZGV4ICAqPSAzO1xuICAgIGluZGV4MSAqPSAzO1xuXG4gICAgb3V0WzBdID0gdmVydGljZXNbaW5kZXggIF0gKiBsb2NhbEludHJwbEludiArIHZlcnRpY2VzW2luZGV4MSAgXSAqIGxvY2FsSW50cnBsO1xuICAgIG91dFsxXSA9IHZlcnRpY2VzW2luZGV4KzFdICogbG9jYWxJbnRycGxJbnYgKyB2ZXJ0aWNlc1tpbmRleDErMV0gKiBsb2NhbEludHJwbDtcbiAgICBvdXRbMl0gPSB2ZXJ0aWNlc1tpbmRleCsyXSAqIGxvY2FsSW50cnBsSW52ICsgdmVydGljZXNbaW5kZXgxKzJdICogbG9jYWxJbnRycGw7XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuXG5cbi8vaG1cblNwbGluZS5wcm90b3R5cGUuZ2V0UG9pbnRzTGluZUxlbmd0aFNxID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBwb2ludHMgICAgPSB0aGlzLnBvaW50cztcblxuICAgIHZhciBkeCA9IDAsXG4gICAgICAgIGR5ID0gMCxcbiAgICAgICAgZHogPSAwO1xuXG4gICAgdmFyIGkgPSBwb2ludHMubGVuZ3RoO1xuICAgIHdoaWxlKGkgPiA2KVxuICAgIHtcbiAgICAgICAgZHggKz0gcG9pbnRzW2ktM10gLSBwb2ludHNbaS02XTtcbiAgICAgICAgZHkgKz0gcG9pbnRzW2ktMl0gLSBwb2ludHNbaS01XTtcbiAgICAgICAgZHogKz0gcG9pbnRzW2ktMV0gLSBwb2ludHNbaS00XTtcblxuICAgICAgICBpLT0zO1xuICAgIH1cblxuICAgIHJldHVybiBkeCpkeCtkeSpkeStkeipkejtcblxufTtcblxuU3BsaW5lLnByb3RvdHlwZS5nZXRTcGxpbmVMaW5lTGVuZ3RoU3EgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcblxuICAgIHZhciBkeCA9IDAsXG4gICAgICAgIGR5ID0gMCxcbiAgICAgICAgZHogPSAwO1xuXG4gICAgdmFyIGkgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgd2hpbGUoaSA+IDYpXG4gICAge1xuICAgICAgICBkeCArPSB2ZXJ0aWNlc1tpLTNdIC0gdmVydGljZXNbaS02XTtcbiAgICAgICAgZHkgKz0gdmVydGljZXNbaS0yXSAtIHZlcnRpY2VzW2ktNV07XG4gICAgICAgIGR6ICs9IHZlcnRpY2VzW2ktMV0gLSB2ZXJ0aWNlc1tpLTRdO1xuXG4gICAgICAgIGktPTM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGR4KmR4K2R5KmR5K2R6KmR6O1xufTtcblxuU3BsaW5lLnByb3RvdHlwZS5nZXRQb2ludHNMaW5lTGVuZ3RoID0gZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZ2V0UG9pbnRzTGluZUxlbmd0aFNxKCkpO307XG5TcGxpbmUucHJvdG90eXBlLmdldFNwbGluZVBvaW50c0xlbmd0aCA9IGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguc3FydCh0aGlzLmdldFNwbGluZUxpbmVMZW5ndGhTcSgpKX07XG5cbm1vZHVsZS5leHBvcnRzID0gU3BsaW5lO1xuXG5cbiIsIi8qKlxuICpcbiAqIGdsS2l0LmpzIC0gQSBXZWJHTCB0b29sYm94XG4gKlxuICogZ2xLaXQuanMgaXMgYXZhaWxhYmxlIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuICBUaGUgZnVsbCB0ZXh0IG9mIHRoZVxuICogTUlUIGxpY2Vuc2UgaXMgaW5jbHVkZWQgYmVsb3cuXG4gKlxuICogTUlUIExpY2Vuc2VcbiAqID09PT09PT09PT09XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyIEhlbnJ5ayBXb2xsaWsuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIE1hdGggICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa01hdGgnKSxcbiAgICBWZWMyICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtWZWMyJyksXG4gICAgVmVjMyAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZ2xrVmVjMycpLFxuICAgIFZlYzQgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa1ZlYzQnKSxcbiAgICBNYXQzMyAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtNYXQzMycpLFxuICAgIE1hdDQ0ICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa01hdDQ0JyksXG4gICAgUXVhdGVybmlvbiAgOiByZXF1aXJlKCcuL21hdGgvZ2xrUXVhdGVybmlvbicpLFxuXG5cbiAgICBNYXRHTCAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa01hdEdMJyksXG4gICAgUHJvZ0xvYWRlciAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9zaGFkZXIvZ2xrUHJvZ0xvYWRlcicpLFxuICAgIFNoYWRlckxvYWRlciA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1NoYWRlckxvYWRlcicpLFxuICAgIENhbWVyYUJhc2ljICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2xrQ2FtZXJhQmFzaWMnKSxcblxuICAgIExpZ2h0ICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa0xpZ2h0JyksXG4gICAgUG9pbnRMaWdodCAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZ2xrUG9pbnRMaWdodCcpLFxuICAgIERpcmVjdGlvbmFsTGlnaHQgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa0RpcmVjdGlvbmFsTGlnaHQnKSxcbiAgICBTcG90TGlnaHQgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtTcG90TGlnaHQnKSxcblxuICAgIE1hdGVyaWFsICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtNYXRlcmlhbCcpLFxuICAgIFRleHR1cmUgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtUZXh0dXJlJyksXG5cbiAgICBrR0xVdGlsICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvdXRpbC9nbGtHTFV0aWwnKSxcbiAgICBrR0wgICAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2xrR0wnKSxcblxuICAgIE1vdXNlICAgICAgIDogcmVxdWlyZSgnLi91dGlsL2dsa01vdXNlJyksXG4gICAgQ29sb3IgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZ2xrQ29sb3InKSxcbiAgICBVdGlsICAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9nbGtVdGlsJyksXG5cbiAgICBQbGF0Zm9ybSAgICA6IHJlcXVpcmUoJy4vc3lzdGVtL2dsa1BsYXRmb3JtJyksXG5cbiAgICBHZW9tM2QgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9nbGtHZW9tM2QnKSxcbiAgICBQYXJhbWV0cmljU3VyZmFjZSA6IHJlcXVpcmUoJy4vZ2VvbS9nbGtQYXJhbWV0cmljU3VyZmFjZScpLFxuICAgIElTT1N1cmZhY2UgICAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2dsa0lTT1N1cmZhY2UnKSxcbiAgICBJU09CYW5kICAgICAgICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9nbGtJU09CYW5kJyksXG4gICAgTGluZUJ1ZmZlcjJkICAgICAgOiByZXF1aXJlKCcuL2dlb20vZ2xrTGluZUJ1ZmZlcjJkJyksXG4gICAgTGluZUJ1ZmZlcjNkICAgICAgOiByZXF1aXJlKCcuL2dlb20vZ2xrTGluZUJ1ZmZlcjNkJyksXG4gICAgU3BsaW5lICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dlb20vZ2xrU3BsaW5lJyksXG4gICAgTGluZTJkVXRpbCAgICAgICAgOiByZXF1aXJlKCcuL2dlb20vZ2xrTGluZTJkVXRpbCcpLFxuICAgIFBvbHlnb24yZFV0aWwgICAgIDogcmVxdWlyZSgnLi9nZW9tL2dsa1BvbHlnb24yZFV0aWwnKSxcblxuXG4gICAgQXBwbGljYXRpb24gOiByZXF1aXJlKCcuL2FwcC9nbGtBcHBsaWNhdGlvbicpXG5cbn07XG5cbiIsInZhciBWZWMzICA9IHJlcXVpcmUoJy4uLy4uL21hdGgvZ2xrVmVjMycpLFxuICAgIExpZ2h0ID0gcmVxdWlyZSgnLi9nbGtMaWdodCcpO1xuXG5mdW5jdGlvbiBEaXJlY3Rpb25hbExpZ2h0KGlkKVxue1xuICAgIExpZ2h0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcbn1cblxuRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExpZ2h0LnByb3RvdHlwZSk7XG5cbkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlLnNldERpcmVjdGlvbiAgID0gZnVuY3Rpb24odikgICAge1ZlYzMuc2V0KHRoaXMuZGlyZWN0aW9uLHYpO307XG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5zZXREaXJlY3Rpb24zZiA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMuZGlyZWN0aW9uLHgseSx6KTt9O1xuXG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5sb29rQXQgICAgICAgICA9IGZ1bmN0aW9uKHBvc2l0aW9uLHRhcmdldClcbntcbiAgICB0aGlzLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB0aGlzLnNldERpcmVjdGlvbihWZWMzLm5vcm1hbGl6ZShWZWMzLnN1YmJlZCh0YXJnZXQscG9zaXRpb24pKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGlvbmFsTGlnaHQ7IiwidmFyIFZlYzMgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBWZWM0ID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9nbGtWZWM0Jyk7XG5cbmZ1bmN0aW9uIExpZ2h0KGlkKVxue1xuICAgIHRoaXMuX2lkICAgPSBpZDtcblxuICAgIHRoaXMuYW1iaWVudCAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuICAgIHRoaXMuZGlmZnVzZSAgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuICAgIHRoaXMuc3BlY3VsYXIgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDEsMV0pO1xuXG4gICAgdGhpcy5wb3NpdGlvbiAgICAgICAgICAgICA9IFZlYzQuWkVSTygpO1xuICAgIHRoaXMuZGlyZWN0aW9uICAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuc3BvdEV4cG9uZW50ICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuc3BvdEN1dE9mZiAgICAgICAgICAgPSBudWxsO1xuXG4gICAgdGhpcy5jb25zdGFudEF0dGVudHVhdGlvbiA9IDEuMDtcbiAgICB0aGlzLmxpbmVhckF0dGVudHVhdGlvbiAgID0gMDtcbiAgICB0aGlzLnF1YWRyaWNBdHRlbnR1YXRpb24gID0gMC4wMTtcbn1cblxuXG5MaWdodC5wcm90b3R5cGUuc2V0QW1iaWVudCAgICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLmFtYmllbnRbMF0gPSBjb2xvclswXTt0aGlzLmFtYmllbnRbMV0gPSBjb2xvclsxXTt0aGlzLmFtYmllbnRbMl0gPSBjb2xvclsyXTt9O1xuTGlnaHQucHJvdG90eXBlLnNldEFtYmllbnQzZiAgID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5hbWJpZW50WzBdID0gcjt0aGlzLmFtYmllbnRbMV0gPSBnO3RoaXMuYW1iaWVudFsyXSA9IGI7fTtcblxuTGlnaHQucHJvdG90eXBlLnNldERpZmZ1c2UgICAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5kaWZmdXNlWzBdID0gY29sb3JbMF07dGhpcy5kaWZmdXNlWzFdID0gY29sb3JbMV07dGhpcy5kaWZmdXNlWzJdID0gY29sb3JbMl07fTtcbkxpZ2h0LnByb3RvdHlwZS5zZXREaWZmdXNlM2YgICA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuZGlmZnVzZVswXSA9IHI7dGhpcy5kaWZmdXNlWzFdID0gZzt0aGlzLmRpZmZ1c2VbMl0gPSBiO307XG5cbkxpZ2h0LnByb3RvdHlwZS5zZXRTcGVjdWxhciAgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuc3BlY3VsYXJbMF0gPSBjb2xvclswXTt0aGlzLnNwZWN1bGFyWzFdID0gY29sb3JbMV07dGhpcy5zcGVjdWxhclsyXSA9IGNvbG9yWzJdO307XG5MaWdodC5wcm90b3R5cGUuc2V0U3BlY3VsYXIzZiAgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLnNwZWN1bGFyWzBdID0gcjt0aGlzLnNwZWN1bGFyWzFdID0gZzt0aGlzLnNwZWN1bGFyWzJdID0gYjt9O1xuXG5MaWdodC5wcm90b3R5cGUuc2V0UG9zaXRpb24gICAgPSBmdW5jdGlvbih2KSAgICB7VmVjNC5zZXQzZih0aGlzLnBvc2l0aW9uLHZbMF0sdlsxXSx2WzJdKTt9O1xuTGlnaHQucHJvdG90eXBlLnNldFBvc2l0aW9uM2YgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5wb3NpdGlvbix4LHkseik7fTtcblxuTGlnaHQucHJvdG90eXBlLmdldElkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faWQ7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodDsiLCJ2YXIgTWF0NDQgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2dsa01hdDQ0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBwZXJzcGVjdGl2ZSA6IGZ1bmN0aW9uKG0sZm92LGFzcGVjdCxuZWFyLGZhcilcbiAgICB7XG4gICAgICAgIHZhciBmICA9IDEuMCAvIE1hdGgudGFuKGZvdiowLjUpLFxuICAgICAgICAgICAgbmYgPSAxLjAgLyAobmVhci1mYXIpO1xuXG4gICAgICAgIG1bMF0gPSBmIC8gYXNwZWN0O1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IGY7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgICBtWzExXSA9IC0xO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAoMiAqIGZhciAqIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMDtcblxuICAgICAgICByZXR1cm4gbTtcblxuICAgIH0sXG5cbiAgICBmcnVzdHVtIDogZnVuY3Rpb24obSxsZWZ0LHJpZ2h0LGJvdHRvbSx0b3AsbmVhcixmYXIpXG4gICAge1xuICAgICAgICB2YXIgcmwgPSAxIC8gKHJpZ2h0IC0gbGVmdCksXG4gICAgICAgICAgICB0YiA9IDEgLyAodG9wIC0gYm90dG9tKSxcbiAgICAgICAgICAgIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcblxuXG4gICAgICAgIG1bIDBdID0gKG5lYXIgKiAyKSAqIHJsO1xuICAgICAgICBtWyAxXSA9IDA7XG4gICAgICAgIG1bIDJdID0gMDtcbiAgICAgICAgbVsgM10gPSAwO1xuICAgICAgICBtWyA0XSA9IDA7XG4gICAgICAgIG1bIDVdID0gKG5lYXIgKiAyKSAqIHRiO1xuICAgICAgICBtWyA2XSA9IDA7XG4gICAgICAgIG1bIDddID0gMDtcbiAgICAgICAgbVsgOF0gPSAocmlnaHQgKyBsZWZ0KSAqIHJsO1xuICAgICAgICBtWyA5XSA9ICh0b3AgKyBib3R0b20pICogdGI7XG4gICAgICAgIG1bMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTFdID0gLTE7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IChmYXIgKiBuZWFyICogMikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAwO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBsb29rQXQgOiBmdW5jdGlvbihtLGV5ZSx0YXJnZXQsdXApXG4gICAge1xuICAgICAgICB2YXIgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbGVuLFxuICAgICAgICAgICAgZXlleCA9IGV5ZVswXSxcbiAgICAgICAgICAgIGV5ZXkgPSBleWVbMV0sXG4gICAgICAgICAgICBleWV6ID0gZXllWzJdLFxuICAgICAgICAgICAgdXB4ID0gdXBbMF0sXG4gICAgICAgICAgICB1cHkgPSB1cFsxXSxcbiAgICAgICAgICAgIHVweiA9IHVwWzJdLFxuICAgICAgICAgICAgdGFyZ2V0eCA9IHRhcmdldFswXSxcbiAgICAgICAgICAgIHRhcnRldHkgPSB0YXJnZXRbMV0sXG4gICAgICAgICAgICB0YXJnZXR6ID0gdGFyZ2V0WzJdO1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhleWV4IC0gdGFyZ2V0eCkgPCAwLjAwMDAwMSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoZXlleSAtIHRhcnRldHkpIDwgMC4wMDAwMDEgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGV5ZXogLSB0YXJnZXR6KSA8IDAuMDAwMDAxKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0NDQuaWRlbnRpdHkobSk7XG4gICAgICAgIH1cblxuICAgICAgICB6MCA9IGV5ZXggLSB0YXJnZXR4O1xuICAgICAgICB6MSA9IGV5ZXkgLSB0YXJ0ZXR5O1xuICAgICAgICB6MiA9IGV5ZXogLSB0YXJnZXR6O1xuXG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICAgICAgejAgKj0gbGVuO1xuICAgICAgICB6MSAqPSBsZW47XG4gICAgICAgIHoyICo9IGxlbjtcblxuICAgICAgICB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XG4gICAgICAgIHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICAgICAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcbiAgICAgICAgaWYgKCFsZW4pIHtcbiAgICAgICAgICAgIHgwID0gMDtcbiAgICAgICAgICAgIHgxID0gMDtcbiAgICAgICAgICAgIHgyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgICAgICB4MCAqPSBsZW47XG4gICAgICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgICAgICB4MiAqPSBsZW47XG4gICAgICAgIH1cblxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuICAgICAgICBpZiAoIWxlbikge1xuICAgICAgICAgICAgeTAgPSAwO1xuICAgICAgICAgICAgeTEgPSAwO1xuICAgICAgICAgICAgeTIgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgICAgIHkwICo9IGxlbjtcbiAgICAgICAgICAgIHkxICo9IGxlbjtcbiAgICAgICAgICAgIHkyICo9IGxlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1bIDBdID0geDA7XG4gICAgICAgIG1bIDFdID0geTA7XG4gICAgICAgIG1bIDJdID0gejA7XG4gICAgICAgIG1bIDNdID0gMDtcbiAgICAgICAgbVsgNF0gPSB4MTtcbiAgICAgICAgbVsgNV0gPSB5MTtcbiAgICAgICAgbVsgNl0gPSB6MTtcbiAgICAgICAgbVsgN10gPSAwO1xuICAgICAgICBtWyA4XSA9IHgyO1xuICAgICAgICBtWyA5XSA9IHkyO1xuICAgICAgICBtWzEwXSA9IHoyO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gLSh4MCAqIGV5ZXggKyB4MSAqIGV5ZXkgKyB4MiAqIGV5ZXopO1xuICAgICAgICBtWzEzXSA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcbiAgICAgICAgbVsxNF0gPSAtKHowICogZXlleCArIHoxICogZXlleSArIHoyICogZXlleik7XG4gICAgICAgIG1bMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG59OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4uLy4uL3V0aWwvZ2xrQ29sb3InKTtcblxuZnVuY3Rpb24gTWF0ZXJpYWwoYW1iaWVudCxkaWZmdXNlLHNwZWN1bGFyLHNoaW5pbmVzcyxlbWlzc2lvbilcbntcbiAgICBhbWJpZW50ICAgPSBhbWJpZW50ICAgfHwgQ29sb3IubWFrZSgxLjAsMC41LDAuNSwxLjApO1xuICAgIGRpZmZ1c2UgICA9IGRpZmZ1c2UgICB8fCBDb2xvci5CTEFDSygpO1xuICAgIHNwZWN1bGFyICA9IHNwZWN1bGFyICB8fCBDb2xvci5CTEFDSygpO1xuICAgIHNoaW5pbmVzcyA9IHNoaW5pbmVzcyB8fCAxMC4wO1xuICAgIGVtaXNzaW9uICA9IGVtaXNzaW9uICB8fCBDb2xvci5CTEFDSztcblxuICAgIHRoaXMuZW1pc3Npb24gID0gZW1pc3Npb247XG4gICAgdGhpcy5hbWJpZW50ICAgPSBhbWJpZW50O1xuICAgIHRoaXMuZGlmZnVzZSAgID0gZGlmZnVzZTtcbiAgICB0aGlzLnNwZWN1bGFyICA9IHNwZWN1bGFyO1xuICAgIHRoaXMuc2hpbmluZXNzID0gc2hpbmluZXNzO1xufVxuXG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RW1pc3Npb24gICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuZW1pc3Npb24gPSBjb2xvcjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEVtaXNzaW9uM2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLmVtaXNzaW9uWzBdID0gcjt0aGlzLmVtaXNzaW9uWzFdID0gZzt0aGlzLmVtaXNzaW9uWzJdID0gYjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEVtaXNzaW9uNGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLmVtaXNzaW9uWzBdID0gcjt0aGlzLmVtaXNzaW9uWzFdID0gZzt0aGlzLmVtaXNzaW9uWzJdID0gYjt0aGlzLmVtaXNzaW9uWzNdID0gYTt9O1xuXG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0QW1iaWVudCAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5hbWJpZW50ID0gY29sb3I7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRBbWJpZW50M2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLmFtYmllbnRbMF0gPSByO3RoaXMuYW1iaWVudFsxXSA9IGc7dGhpcy5hbWJpZW50WzJdID0gYjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldEFtYmllbnQ0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuYW1iaWVudFswXSA9IHI7dGhpcy5hbWJpZW50WzFdID0gZzt0aGlzLmFtYmllbnRbMl0gPSBiO3RoaXMuYW1iaWVudFszXSA9IGE7fTtcblxuTWF0ZXJpYWwucHJvdG90eXBlLnNldERpZmZ1c2UgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuZGlmZnVzZSA9IGNvbG9yO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RGlmZnVzZTNmID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5kaWZmdXNlWzBdID0gcjt0aGlzLmRpZmZ1c2VbMV0gPSBnO3RoaXMuZGlmZnVzZVsyXSA9IGI7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXREaWZmdXNlNGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLmRpZmZ1c2VbMF0gPSByO3RoaXMuZGlmZnVzZVsxXSA9IGc7dGhpcy5kaWZmdXNlWzJdID0gYjt0aGlzLmRpZmZ1c2VbM10gPSBhO307XG5cbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRTcGVjdWxhciAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5zcGVjdWxhciA9IGNvbG9yO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0U3BlY3VsYXIzZiA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuc3BlY3VsYXJbMF0gPSByO3RoaXMuc3BlY3VsYXJbMV0gPSBnO3RoaXMuc3BlY3VsYXJbMl0gPSBiO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0U3BlY3VsYXI0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuc3BlY3VsYXJbMF0gPSByO3RoaXMuc3BlY3VsYXJbMV0gPSBnO3RoaXMuc3BlY3VsYXJbMl0gPSBiO3RoaXMuc3BlY3VsYXJbM10gPSBhO307XG5cblxuTWF0ZXJpYWwucHJvdG90eXBlLmdldEVtaXNzaW9uICA9IGZ1bmN0aW9uKCl7cmV0dXJuIENvbG9yLmNvcHkodGhpcy5lbWlzc2lvbik7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXRBbWJpZW50ICAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuYW1iaWVudCk7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXREaWZmdXNlICAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuZGlmZnVzZSk7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5nZXRTcGVjdWxhciAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuc3BlY3VsYXIpO307XG5NYXRlcmlhbC5wcm90b3R5cGUuZ2V0U2hpbmluZXNzID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zaGluaW5lc3M7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDtcbiIsInZhciBMaWdodCA9IHJlcXVpcmUoJy4vZ2xrTGlnaHQnKTtcblxuZnVuY3Rpb24gUG9pbnRMaWdodChpZClcbntcbiAgICBMaWdodC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG59XG5cblBvaW50TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMaWdodC5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50TGlnaHQ7IiwidmFyIERpcmVjdGlvbmFsTGlnaHQgPSByZXF1aXJlKCcuL2dsa0RpcmVjdGlvbmFsTGlnaHQnKTtcblxuZnVuY3Rpb24gU3BvdExpZ2h0KGlkKVxue1xuICAgIERpcmVjdGlvbmFsTGlnaHQuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xufVxuXG5TcG90TGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZSk7XG5cblNwb3RMaWdodC5wcm90b3R5cGUuc2V0RXhwb25lbnQgPSBmdW5jdGlvbigpe307XG5TcG90TGlnaHQucHJvdG90eXBlLnNldEN1dE9mZiAgID0gZnVuY3Rpb24oKXt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwb3RMaWdodDsiLCJcbmZ1bmN0aW9uIFRleHR1cmUoKVxue1xuICAgIHRoaXMuX3RleCA9IG51bGw7XG4gICAgdGhpcy5fd2lkdGggPSBudWxsO1xuICAgIHRoaXMuX2hlaWdodCA9IG51bGw7XG5cbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpdGhpcy5zZXRUZXhTb3VyY2UoYXJndW1lbnRzWzBdKTtcbn1cblxuVGV4dHVyZS5wcm90b3R5cGUuc2V0VGV4U291cmNlID0gZnVuY3Rpb24oZ2xUZXgpXG57XG4gICAgdmFyIHRleCA9IHRoaXMuX3RleCA9IGdsVGV4O1xuICAgIHRoaXMuX3dpZHRoICA9IHRleC5pbWFnZS53aWR0aDtcbiAgICB0aGlzLl9oZWlnaHQgPSB0ZXguaW1hZ2UuaGVpZ2h0O1xufTtcblxuVGV4dHVyZS5wcm90b3R5cGUuZ2V0V2lkdGggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd2lkdGg7fTtcblRleHR1cmUucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2hlaWdodDt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7IiwibW9kdWxlLmV4cG9ydHMgPVwidmFyeWluZyB2ZWM0IHZWZXJ0ZXhQb3NpdGlvbjt2YXJ5aW5nIHZlYzMgdlZlcnRleE5vcm1hbDt2YXJ5aW5nIHZlYzQgdlZlcnRleENvbG9yO3ZhcnlpbmcgdmVjMiB2VmVydGV4VGV4Q29vcmQ7dW5pZm9ybSBmbG9hdCB1VXNlTGlnaHRpbmc7dW5pZm9ybSBmbG9hdCB1VXNlTWF0ZXJpYWw7dW5pZm9ybSBmbG9hdCB1VXNlVGV4dHVyZTt1bmlmb3JtIG1hdDMgdU5vcm1hbE1hdHJpeDt1bmlmb3JtIHZlYzMgdUFtYmllbnQ7dW5pZm9ybSBzYW1wbGVyMkQgdVRleEltYWdlO2NvbnN0IGludCBNQVhfTElHSFRTID0gODtzdHJ1Y3QgTGlnaHR7IHZlYzQgcG9zaXRpb247IHZlYzMgYW1iaWVudDsgdmVjMyBkaWZmdXNlOyB2ZWMzIHNwZWN1bGFyOyB2ZWM0IGhhbGZWZWN0b3I7IHZlYzMgc3BvdERpcmVjdGlvbjsgZmxvYXQgc3BvdEV4cG9uZW50OyBmbG9hdCBzcG90Q3V0b2ZmOyBmbG9hdCBzcG90Q29zQ3V0b2ZmOyBmbG9hdCBjb25zdGFudEF0dGVudWF0aW9uOyBmbG9hdCBsaW5lYXJBdHRlbnVhdGlvbjsgZmxvYXQgcXVhZHJhdGljQXR0ZW51YXRpb247fTtzdHJ1Y3QgTWF0ZXJpYWx7IHZlYzQgZW1pc3Npb247IHZlYzQgYW1iaWVudDsgdmVjNCBkaWZmdXNlOyB2ZWM0IHNwZWN1bGFyOyBmbG9hdCBzaGluaW5lc3M7fTtzdHJ1Y3QgQ29sb3JDb21wb25lbnR7IHZlYzQgYW1iaWVudDsgdmVjNCBkaWZmdXNlOyB2ZWM0IHNwZWN1bGFyOyBmbG9hdCBzaGluaW5lc3M7fTt2ZWM0IHBob25nTW9kZWwodmVjNCBwb3NpdGlvbiwgdmVjMyBub3JtYWwsIENvbG9yQ29tcG9uZW50IGNvbG9yLCBMaWdodCBsaWdodCl7IHZlYzMgZGlmZiA9IGxpZ2h0LnBvc2l0aW9uLnh5eiAtIHBvc2l0aW9uLnh5ejsgdmVjMyBzID0gbm9ybWFsaXplKGRpZmYpOyB2ZWMzIHYgPSBub3JtYWxpemUoLXBvc2l0aW9uLnh5eik7IHZlYzMgciA9IHJlZmxlY3QoLXMsIG5vcm1hbCk7IGZsb2F0IHNEb3ROID0gbWF4KGRvdChzLCBub3JtYWwpLCAwLjApOyBmbG9hdCBkaXN0ID0gbGVuZ3RoKGRpZmYueHl6KTsgZmxvYXQgYXR0ID0gMS4wIC8gKGxpZ2h0LmNvbnN0YW50QXR0ZW51YXRpb24gKyBsaWdodC5saW5lYXJBdHRlbnVhdGlvbiAqIGRpc3QgKyBsaWdodC5xdWFkcmF0aWNBdHRlbnVhdGlvbiAqIGRpc3QgKiBkaXN0KTsgdmVjMyBhbWJpZW50ID0gdUFtYmllbnQgKiBsaWdodC5hbWJpZW50ICogY29sb3IuYW1iaWVudC5yZ2I7IHZlYzMgZGlmZnVzZSA9IGxpZ2h0LmRpZmZ1c2UgKiBjb2xvci5kaWZmdXNlLnJnYiAqIHNEb3ROIDsgdmVjMyBzcGVjdWxhciA9ICgoc0RvdE4gPiAwLjApID8gbGlnaHQuc3BlY3VsYXIgKiBwb3cobWF4KGRvdChyLCB2KSwgMC4wKSwgY29sb3Iuc2hpbmluZXNzKSA6IHZlYzMoMC4wKSk7IHJldHVybiB2ZWM0KGFtYmllbnQqYXR0KyBkaWZmdXNlKmF0dCArIHNwZWN1bGFyKmF0dCxjb2xvci5hbWJpZW50LmEpO311bmlmb3JtIExpZ2h0IHVMaWdodHNbOF07dW5pZm9ybSBNYXRlcmlhbCB1TWF0ZXJpYWw7dm9pZCBtYWluKHZvaWQpeyBmbG9hdCB1c2VMaWdodGluZ0ludiA9IDEuMCAtIHVVc2VMaWdodGluZzsgZmxvYXQgdXNlTWF0ZXJpYWxJbnYgPSAxLjAgLSB1VXNlTWF0ZXJpYWw7IGZsb2F0IHVzZVRleHR1cmVJbnYgPSAxLjAgLSB1VXNlVGV4dHVyZTsgdmVjMyB0VmVydGV4Tm9ybWFsID0gKGdsX0Zyb250RmFjaW5nID8gLTEuMCA6IDEuMCkgKiBub3JtYWxpemUodU5vcm1hbE1hdHJpeCAqIHZWZXJ0ZXhOb3JtYWwpOyB2ZWM0IHZlcnRleENvbG9yID0gdlZlcnRleENvbG9yICogdXNlTWF0ZXJpYWxJbnY7IHZlYzQgdGV4dHVyZUNvbG9yID0gdGV4dHVyZTJEKHVUZXhJbWFnZSx2VmVydGV4VGV4Q29vcmQpOyB2ZWM0IHJlc3VsdENvbG9yID0gdmVydGV4Q29sb3IgKiB1c2VUZXh0dXJlSW52ICsgdGV4dHVyZUNvbG9yICogdVVzZVRleHR1cmU7IENvbG9yQ29tcG9uZW50IGNvbG9yID0gQ29sb3JDb21wb25lbnQodU1hdGVyaWFsLmFtYmllbnQgKiB1VXNlTWF0ZXJpYWwgKyByZXN1bHRDb2xvciwgdU1hdGVyaWFsLmRpZmZ1c2UgKiB1VXNlTWF0ZXJpYWwgKyByZXN1bHRDb2xvciwgdU1hdGVyaWFsLnNwZWN1bGFyICogdVVzZU1hdGVyaWFsICsgcmVzdWx0Q29sb3IsIHVNYXRlcmlhbC5zaGluaW5lc3MgKiB1VXNlTWF0ZXJpYWwgKyB1c2VNYXRlcmlhbEludik7IHZlYzQgbGlnaHRpbmdDb2xvciA9IHZlYzQoMCwwLDAsMCk7IGZvcihpbnQgaSA9IDA7aSA8IE1BWF9MSUdIVFM7aSsrKSB7IGxpZ2h0aW5nQ29sb3IrPXBob25nTW9kZWwodlZlcnRleFBvc2l0aW9uLHRWZXJ0ZXhOb3JtYWwsY29sb3IsdUxpZ2h0c1tpXSk7IH0gZ2xfRnJhZ0NvbG9yID0gdVVzZUxpZ2h0aW5nICogbGlnaHRpbmdDb2xvciArIHVzZUxpZ2h0aW5nSW52ICogKHZWZXJ0ZXhDb2xvciAqIHVzZVRleHR1cmVJbnYgKyB0ZXh0dXJlQ29sb3IgKiB1VXNlVGV4dHVyZSk7fVwiOyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBsb2FkUHJvZ3JhbSA6IGZ1bmN0aW9uKGdsLHZlcnRleFNoYWRlcixmcmFnbWVudFNoYWRlcilcbiAgICB7XG4gICAgICAgIHZhciBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLHZlcnRleFNoYWRlcik7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLGZyYWdtZW50U2hhZGVyKTtcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG5cbiAgICAgICAgaWYoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSxnbC5MSU5LX1NUQVRVUykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgICAgICBwcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9ncmFtO1xuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPVwiYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO2F0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhOb3JtYWw7YXR0cmlidXRlIHZlYzQgYVZlcnRleENvbG9yO2F0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhUZXhDb29yZDt2YXJ5aW5nIHZlYzQgdlZlcnRleFBvc2l0aW9uO3ZhcnlpbmcgdmVjMyB2VmVydGV4Tm9ybWFsO3ZhcnlpbmcgdmVjNCB2VmVydGV4Q29sb3I7dmFyeWluZyB2ZWMyIHZWZXJ0ZXhUZXhDb29yZDt1bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDt1bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7dW5pZm9ybSBmbG9hdCB1UG9pbnRTaXplO3ZvaWQgbWFpbih2b2lkKXsgdlZlcnRleFBvc2l0aW9uID0gdU1vZGVsVmlld01hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyB2VmVydGV4Tm9ybWFsID0gYVZlcnRleE5vcm1hbDsgdlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yOyB2VmVydGV4VGV4Q29vcmQgPSBhVmVydGV4VGV4Q29vcmQ7IGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB2VmVydGV4UG9zaXRpb247IGdsX1BvaW50U2l6ZSA9IHVQb2ludFNpemU7fVwiOyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBQcmVmaXhTaGFkZXJXZWIgOiAncHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7JyxcblxuICAgIGxvYWRTaGFkZXJGcm9tU3RyaW5nIDogZnVuY3Rpb24oZ2wsc291cmNlU3RyaW5nLHR5cGUpXG4gICAge1xuICAgICAgICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsc291cmNlU3RyaW5nKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gICAgICAgIGlmKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLGdsLkNPTVBJTEVfU1RBVFVTKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNoYWRlcjtcbiAgICB9XG5cblxufTsiLCJ2YXIgVmVjMyAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBNYXQ0NCA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrTWF0NDQnKSxcbiAgICBNYXRHTCA9IHJlcXVpcmUoJy4vZ2wvZ2xrTWF0R0wnKTtcblxuZnVuY3Rpb24gQ2FtZXJhQmFzaWMoKVxue1xuICAgIHRoaXMucG9zaXRpb24gPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl90YXJnZXQgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdXAgICAgICA9IFZlYzMuQVhJU19ZKCk7XG5cbiAgICB0aGlzLl9mb3YgID0gMDtcbiAgICB0aGlzLl9uZWFyID0gMDtcbiAgICB0aGlzLl9mYXIgID0gMDtcblxuICAgIHRoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IDA7XG5cbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkICA9IGZhbHNlO1xuICAgIHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnByb2plY3Rpb25NYXRyaXggPSBNYXQ0NC5tYWtlKCk7XG4gICAgdGhpcy5tb2RlbFZpZXdNYXRyaXggID0gTWF0NDQubWFrZSgpO1xufVxuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbihmb3Ysd2luZG93QXNwZWN0UmF0aW8sbmVhcixmYXIpXG57XG4gICAgdGhpcy5fZm92ICA9IGZvdjtcbiAgICB0aGlzLl9uZWFyID0gbmVhcjtcbiAgICB0aGlzLl9mYXIgID0gZmFyO1xuXG4gICAgdGhpcy5fYXNwZWN0UmF0aW9MYXN0ID0gd2luZG93QXNwZWN0UmF0aW87XG5cbiAgICB0aGlzLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbn07XG5cblxuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0VGFyZ2V0ICAgICAgICAgPSBmdW5jdGlvbih2KSAgICB7VmVjMy5zZXQodGhpcy5fdGFyZ2V0LHYpO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFRhcmdldDNmICAgICAgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5fdGFyZ2V0LHgseSx6KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRQb3NpdGlvbiAgICAgICA9IGZ1bmN0aW9uKHYpICAgIHtWZWMzLnNldCh0aGlzLnBvc2l0aW9uLHYpO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFBvc2l0aW9uM2YgICAgID0gZnVuY3Rpb24oeCx5LHope1ZlYzMuc2V0M2YodGhpcy5wb3NpdGlvbix4LHkseik7dGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0VXAgICAgICAgICAgICAgPSBmdW5jdGlvbih2KSAgICB7VmVjMy5zZXQodGhpcy5fdXAsdik7dGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0VXAzZiAgICAgICAgICAgPSBmdW5jdGlvbih4LHkseil7IFZlYzMuc2V0M2YodGhpcy5fdXAseCx5LHopO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0TmVhciAgICAgICAgICAgPSBmdW5jdGlvbihuZWFyKSAgICAgICB7dGhpcy5fbmVhciA9IG5lYXI7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldEZhciAgICAgICAgICAgID0gZnVuY3Rpb24oZmFyKSAgICAgICAge3RoaXMuX2ZhciAgPSBmYXI7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldEZvdiAgICAgICAgICAgID0gZnVuY3Rpb24oZm92KSAgICAgICAge3RoaXMuX2ZvdiAgPSBmb3Y7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldEFzcGVjdFJhdGlvICAgID0gZnVuY3Rpb24oYXNwZWN0UmF0aW8pe3RoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IGFzcGVjdFJhdGlvO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnVwZGF0ZU1vZGVsVmlld01hdHJpeCAgID0gZnVuY3Rpb24oKXtpZih0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkKXJldHVybjtNYXRHTC5sb29rQXQodGhpcy5tb2RlbFZpZXdNYXRyaXgsdGhpcy5wb3NpdGlvbix0aGlzLl90YXJnZXQsdGhpcy5fdXApOyB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gdHJ1ZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnVwZGF0ZVByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbigpe2lmKHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkKXJldHVybjtNYXRHTC5wZXJzcGVjdGl2ZSh0aGlzLnByb2plY3Rpb25NYXRyaXgsdGhpcy5fZm92LHRoaXMuX2FzcGVjdFJhdGlvTGFzdCx0aGlzLl9uZWFyLHRoaXMuX2Zhcik7dGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSB0cnVlO307XG5cbkNhbWVyYUJhc2ljLnByb3RvdHlwZS51cGRhdGVNYXRyaWNlcyA9IGZ1bmN0aW9uKCl7dGhpcy51cGRhdGVNb2RlbFZpZXdNYXRyaXgoKTt0aGlzLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTt9O1xuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpe3JldHVybiAne3Bvc2l0aW9uPSAnICsgVmVjMy50b1N0cmluZyh0aGlzLnBvc2l0aW9uKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsIHRhcmdldD0gJyArIFZlYzMudG9TdHJpbmcodGhpcy5fdGFyZ2V0KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsIHVwPSAnICAgICArIFZlYzMudG9TdHJpbmcodGhpcy5fdXApICsgJ30nfTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFCYXNpYztcblxuXG4iLCJ2YXIga0Vycm9yICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtFcnJvcicpLFxuICAgIFByb2dWZXJ0ZXhTaGFkZXIgPSByZXF1aXJlKCcuL2dsL3NoYWRlci9nbGtQcm9nVmVydGV4U2hhZGVyJyksXG4gICAgUHJvZ0ZyYWdTaGFkZXIgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2dsa1Byb2dGcmFnU2hhZGVyJyksXG4gICAgUHJvZ0xvYWRlciAgICAgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2dsa1Byb2dMb2FkZXInKSxcbiAgICBTaGFkZXJMb2FkZXIgICAgID0gcmVxdWlyZSgnLi9nbC9zaGFkZXIvZ2xrU2hhZGVyTG9hZGVyJyksXG4gICAgUGxhdGZvcm0gICAgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtQbGF0Zm9ybScpLFxuICAgIFZlYzIgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzInKSxcbiAgICBWZWMzICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgVmVjNCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjNCcpLFxuICAgIE1hdDMzICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdDMzJyksXG4gICAgTWF0NDQgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrTWF0NDQnKSxcbiAgICBDb2xvciAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9nbGtDb2xvcicpO1xuXG5cbmZ1bmN0aW9uIGtHTChjb250ZXh0M2QsY29udGV4dDJkKVxue1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0XG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdmFyIGdsID0gdGhpcy5nbCA9IGNvbnRleHQzZDtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBjcmVhdGUgc2hhZGVycy9wcm9ncmFtICsgYmluZFxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qXG4gICAgdmFyIHByb2dWZXJ0ZXhTaGFkZXIgPSBTaGFkZXJMb2FkZXIubG9hZFNoYWRlckZyb21TdHJpbmcoZ2wsIFByb2dWZXJ0ZXhTaGFkZXIsIGdsLlZFUlRFWF9TSEFERVIpLFxuICAgICAgICBwcm9nRnJhZ1NoYWRlciAgID0gU2hhZGVyTG9hZGVyLmxvYWRTaGFkZXJGcm9tU3RyaW5nKGdsLCAoKFBsYXRmb3JtLmdldFRhcmdldCgpID09IFBsYXRmb3JtLldFQikgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2hhZGVyTG9hZGVyLlByZWZpeFNoYWRlcldlYiA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9nRnJhZ1NoYWRlciwgZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuXG5cbiAgICB2YXIgcHJvZ3JhbVNjZW5lID0gIFByb2dMb2FkZXIubG9hZFByb2dyYW0oZ2wscHJvZ1ZlcnRleFNoYWRlcixwcm9nRnJhZ1NoYWRlcik7XG4gICAgKi9cblxuXG5cbiAgICB2YXIgcGxhdGZvcm0gPSBQbGF0Zm9ybS5nZXRUYXJnZXQoKTtcblxuICAgIHZhciBwcm9ncmFtU2NlbmUgPSB0aGlzLl9wcm9ncmFtU2NlbmUgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cbiAgICB2YXIgcHJvZ1ZlcnRTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUiksXG4gICAgICAgIHByb2dGcmFnU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UocHJvZ1ZlcnRTaGFkZXIsIFByb2dWZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIocHJvZ1ZlcnRTaGFkZXIpO1xuXG4gICAgaWYoIWdsLmdldFNoYWRlclBhcmFtZXRlcihwcm9nVmVydFNoYWRlcixnbC5DT01QSUxFX1NUQVRVUykpXG4gICAgICAgIHRocm93IGdsLmdldFNoYWRlckluZm9Mb2cocHJvZ1ZlcnRTaGFkZXIpO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKHByb2dGcmFnU2hhZGVyLCAoKHBsYXRmb3JtID09IFBsYXRmb3JtLldFQikgPyBTaGFkZXJMb2FkZXIuUHJlZml4U2hhZGVyV2ViIDogJycpICsgUHJvZ0ZyYWdTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIocHJvZ0ZyYWdTaGFkZXIpO1xuXG4gICAgaWYoIWdsLmdldFNoYWRlclBhcmFtZXRlcihwcm9nRnJhZ1NoYWRlcixnbC5DT01QSUxFX1NUQVRVUykpXG4gICAgICAgIHRocm93IGdsLmdldFNoYWRlckluZm9Mb2cocHJvZ0ZyYWdTaGFkZXIpO1xuXG4gICAgZ2wuYmluZEF0dHJpYkxvY2F0aW9uKHByb2dyYW1TY2VuZSwwLCdhVmVydGV4UG9zaXRpb24nKTtcblxuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtU2NlbmUsIHByb2dWZXJ0U2hhZGVyKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbVNjZW5lLCBwcm9nRnJhZ1NoYWRlcik7XG4gICAgZ2wubGlua1Byb2dyYW0oIHByb2dyYW1TY2VuZSk7XG5cbiAgICBpZighZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtU2NlbmUsZ2wuTElOS19TVEFUVVMpKVxuICAgICAgICB0aHJvdyBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtU2NlbmUpO1xuXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtU2NlbmUpO1xuXG5cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBCaW5kICYgZW5hYmxlIHNoYWRlciBhdHRyaWJ1dGVzICYgdW5pZm9ybXNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIHRoaXMuX2FWZXJ0ZXhQb3NpdGlvbiAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCdhVmVydGV4UG9zaXRpb24nKTtcbiAgICB0aGlzLl9hVmVydGV4Tm9ybWFsICAgICA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW1TY2VuZSwnYVZlcnRleE5vcm1hbCcpO1xuICAgIHRoaXMuX2FWZXJ0ZXhDb2xvciAgICAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCdhVmVydGV4Q29sb3InKTtcbiAgICB0aGlzLl9hVmVydGV4VGV4Q29vcmQgICA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW1TY2VuZSwnYVZlcnRleFRleENvb3JkJyk7XG5cbiAgICB0aGlzLl91TW9kZWxWaWV3TWF0cml4ICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VNb2RlbFZpZXdNYXRyaXgnKTtcbiAgICB0aGlzLl91UHJvamVjdGlvbk1hdHJpeCA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VQcm9qZWN0aW9uTWF0cml4Jyk7XG4gICAgdGhpcy5fdU5vcm1hbE1hdHJpeCAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1Tm9ybWFsTWF0cml4Jyk7XG4gICAgdGhpcy5fdVRleEltYWdlICAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1VGV4SW1hZ2UnKTtcblxuICAgIHRoaXMuX3VQb2ludFNpemUgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndVBvaW50U2l6ZScpO1xuXG4gICAgdGhpcy5fdVVzZUxpZ2h0aW5nICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1VXNlTGlnaHRpbmcnKTtcbiAgICB0aGlzLl91VXNlTWF0ZXJpYWwgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VVc2VNYXRlcmlhbCcpO1xuICAgIHRoaXMuX3VVc2VUZXh0dXJlICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndVVzZVRleHR1cmUnKTtcblxuICAgIHRoaXMuX3VBbWJpZW50ICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndUFtYmllbnQnKTtcblxuXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFBvc2l0aW9uKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Q29sb3IpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gICAgLy8gU2V0IFNoYWRlciBpbml0aWFsIHZhbHVlc1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgdGhpcy5MSUdIVF8wICAgID0gMDtcbiAgICB0aGlzLkxJR0hUXzEgICAgPSAxO1xuICAgIHRoaXMuTElHSFRfMiAgICA9IDI7XG4gICAgdGhpcy5MSUdIVF8zICAgID0gMztcbiAgICB0aGlzLkxJR0hUXzQgICAgPSA0O1xuICAgIHRoaXMuTElHSFRfNSAgICA9IDU7XG4gICAgdGhpcy5MSUdIVF82ICAgID0gNjtcbiAgICB0aGlzLkxJR0hUXzcgICAgPSA3O1xuICAgIHRoaXMuTUFYX0xJR0hUUyA9IDg7XG5cbiAgICB0aGlzLk1PREVMX1BIT05HICAgICAgID0gMDtcbiAgICB0aGlzLk1PREVMX0FOVElTT1BUUklDID0gMTtcbiAgICB0aGlzLk1PREVMX0ZSRVNORUwgICAgID0gMjtcbiAgICB0aGlzLk1PREVMX0JMSU5OICAgICAgID0gMztcbiAgICB0aGlzLk1PREVMX0ZMQVQgICAgICAgID0gNDtcblxuXG5cblxuICAgIHZhciBsID0gdGhpcy5NQVhfTElHSFRTO1xuXG5cblxuICAgIHZhciB1TGlnaHRQb3NpdGlvbiAgICAgICAgICAgICA9IHRoaXMuX3VMaWdodFBvc2l0aW9uICAgICAgICAgICAgID0gbmV3IEFycmF5KGwpLFxuICAgICAgICB1TGlnaHRBbWJpZW50ICAgICAgICAgICAgICA9IHRoaXMuX3VMaWdodEFtYmllbnQgICAgICAgICAgICAgID0gbmV3IEFycmF5KGwpLFxuICAgICAgICB1TGlnaHREaWZmdXNlICAgICAgICAgICAgICA9IHRoaXMuX3VMaWdodERpZmZ1c2UgICAgICAgICAgICAgID0gbmV3IEFycmF5KGwpLFxuICAgICAgICB1TGlnaHRTcGVjdWxhciAgICAgICAgICAgICA9IHRoaXMuX3VMaWdodFNwZWN1bGFyICAgICAgICAgICAgID0gbmV3IEFycmF5KGwpLFxuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvbkNvbnN0YW50ICA9IHRoaXMuX3VMaWdodEF0dGVudWF0aW9uQ29uc3RhbnQgID0gbmV3IEFycmF5KGwpLFxuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvbkxpbmVhciAgICA9IHRoaXMuX3VMaWdodEF0dGVudWF0aW9uTGluZWFyICAgID0gbmV3IEFycmF5KGwpLFxuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvblF1YWRyYXRpYyA9IHRoaXMuX3VMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljID0gbmV3IEFycmF5KGwpO1xuXG4gICAgdmFyIGxpZ2h0O1xuXG4gICAgdmFyIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCBsKVxuICAgIHtcbiAgICAgICAgbGlnaHQgPSAndUxpZ2h0c1snK2krJ10uJztcblxuXG4gICAgICAgIHVMaWdodFBvc2l0aW9uW2ldICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdwb3NpdGlvbicpO1xuICAgICAgICB1TGlnaHRBbWJpZW50W2ldICAgICAgICAgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAnYW1iaWVudCcpO1xuICAgICAgICB1TGlnaHREaWZmdXNlW2ldICAgICAgICAgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAnZGlmZnVzZScpO1xuICAgICAgICB1TGlnaHRTcGVjdWxhcltpXSAgICAgICAgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAnc3BlY3VsYXInKTtcblxuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvbkNvbnN0YW50W2ldICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAnY29uc3RhbnRBdHRlbnVhdGlvbicpO1xuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvbkxpbmVhcltpXSAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAnbGluZWFyQXR0ZW51YXRpb24nKTtcbiAgICAgICAgdUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWNbaV0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLGxpZ2h0ICsgJ3F1YWRyYXRpY0F0dGVudWF0aW9uJyk7XG5cbiAgICAgICAgZ2wudW5pZm9ybTRmdih1TGlnaHRQb3NpdGlvbltpXSwgbmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMF0pKTtcbiAgICAgICAgZ2wudW5pZm9ybTNmdih1TGlnaHRBbWJpZW50W2ldLCAgbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKSk7XG4gICAgICAgIGdsLnVuaWZvcm0zZnYodUxpZ2h0RGlmZnVzZVtpXSwgIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSkpO1xuXG4gICAgICAgIGdsLnVuaWZvcm0xZih1TGlnaHRBdHRlbnVhdGlvbkNvbnN0YW50W2ldLCAxLjApO1xuICAgICAgICBnbC51bmlmb3JtMWYodUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaV0sICAgMC4wKTtcbiAgICAgICAgZ2wudW5pZm9ybTFmKHVMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljW2ldLDAuMCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdU1hdGVyaWFsRW1pc3Npb24gID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1hdGVyaWFsLmVtaXNzaW9uJyk7XG4gICAgdGhpcy5fdU1hdGVyaWFsQW1iaWVudCAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1hdGVyaWFsLmFtYmllbnQnKTtcbiAgICB0aGlzLl91TWF0ZXJpYWxEaWZmdXNlICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1TWF0ZXJpYWwuZGlmZnVzZScpO1xuICAgIHRoaXMuX3VNYXRlcmlhbFNwZWN1bGFyICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VNYXRlcmlhbC5zcGVjdWxhcicpO1xuICAgIHRoaXMuX3VNYXRlcmlhbFNoaW5pbmVzcyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VNYXRlcmlhbC5zaGluaW5lc3MnKTtcblxuICAgIGdsLnVuaWZvcm00Zih0aGlzLl91TWF0ZXJpYWxFbWlzc2lvbiwgMC4wLDAuMCwwLjAsMS4wKTtcbiAgICBnbC51bmlmb3JtNGYodGhpcy5fdU1hdGVyaWFsQW1iaWVudCwgIDEuMCwwLjUsMC41LDEuMCk7XG4gICAgZ2wudW5pZm9ybTRmKHRoaXMuX3VNYXRlcmlhbERpZmZ1c2UsICAwLjAsMC4wLDAuMCwxLjApO1xuICAgIGdsLnVuaWZvcm00Zih0aGlzLl91TWF0ZXJpYWxTcGVjdWxhciwgMC4wLDAuMCwwLjAsMS4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdU1hdGVyaWFsU2hpbmluZXNzLDEwLjApO1xuXG5cbiAgICB0aGlzLl90ZW1wTGlnaHRQb3MgPSBWZWM0Lm1ha2UoKTtcblxuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91VXNlTWF0ZXJpYWwsIDAuMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VMaWdodGluZywgMC4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdVVzZU1hdGVyaWFsLCAwLjApO1xuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91UG9pbnRTaXplLCAgIDEuMCk7XG5cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBCaW5kIGNvbnN0YW50c1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIHRoaXMuQUNUSVZFX0FUVFJJQlVURVM9IDM1NzIxOyB0aGlzLkFDVElWRV9URVhUVVJFPSAzNDAxNjsgdGhpcy5BQ1RJVkVfVU5JRk9STVM9IDM1NzE4OyB0aGlzLkFMSUFTRURfTElORV9XSURUSF9SQU5HRT0gMzM5MDI7IHRoaXMuQUxJQVNFRF9QT0lOVF9TSVpFX1JBTkdFPSAzMzkwMTsgdGhpcy5BTFBIQT0gNjQwNjsgdGhpcy5BTFBIQV9CSVRTPSAzNDEzOyB0aGlzLkFMV0FZUz0gNTE5IDsgdGhpcy5BUlJBWV9CVUZGRVI9IDM0OTYyIDsgdGhpcy5BUlJBWV9CVUZGRVJfQklORElORz0gMzQ5NjQgOyB0aGlzLkFUVEFDSEVEX1NIQURFUlM9IDM1NzE3IDsgdGhpcy5CQUNLPSAxMDI5IDsgdGhpcy5CTEVORD0gMzA0MiA7IHRoaXMuQkxFTkRfQ09MT1I9IDMyNzczIDsgdGhpcy5CTEVORF9EU1RfQUxQSEE9IDMyOTcwIDsgdGhpcy5CTEVORF9EU1RfUkdCPSAzMjk2OCA7IHRoaXMuQkxFTkRfRVFVQVRJT049IDMyNzc3IDsgdGhpcy5CTEVORF9FUVVBVElPTl9BTFBIQT0gMzQ4NzcgOyB0aGlzLkJMRU5EX0VRVUFUSU9OX1JHQj0gMzI3NzcgOyB0aGlzLkJMRU5EX1NSQ19BTFBIQT0gMzI5NzEgOyB0aGlzLkJMRU5EX1NSQ19SR0I9IDMyOTY5IDsgdGhpcy5CTFVFX0JJVFM9IDM0MTIgOyB0aGlzLkJPT0w9IDM1NjcwIDsgdGhpcy5CT09MX1ZFQzI9IDM1NjcxIDsgdGhpcy5CT09MX1ZFQzM9IDM1NjcyIDsgdGhpcy5CT09MX1ZFQzQ9IDM1NjczIDsgdGhpcy5CUk9XU0VSX0RFRkFVTFRfV0VCR0w9IDM3NDQ0IDsgdGhpcy5CVUZGRVJfU0laRT0gMzQ2NjAgOyB0aGlzLkJVRkZFUl9VU0FHRT0gMzQ2NjEgOyB0aGlzLkJZVEU9IDUxMjAgOyB0aGlzLkNDVz0gMjMwNSA7IHRoaXMuQ0xBTVBfVE9fRURHRT0gMzMwNzEgOyB0aGlzLkNPTE9SX0FUVEFDSE1FTlQwPSAzNjA2NCA7IHRoaXMuQ09MT1JfQlVGRkVSX0JJVD0gMTYzODQgOyB0aGlzLkNPTE9SX0NMRUFSX1ZBTFVFPSAzMTA2IDsgdGhpcy5DT0xPUl9XUklURU1BU0s9IDMxMDcgOyB0aGlzLkNPTVBJTEVfU1RBVFVTPSAzNTcxMyA7IHRoaXMuQ09NUFJFU1NFRF9URVhUVVJFX0ZPUk1BVFM9IDM0NDY3IDsgdGhpcy5DT05TVEFOVF9BTFBIQT0gMzI3NzEgOyB0aGlzLkNPTlNUQU5UX0NPTE9SPSAzMjc2OSA7IHRoaXMuQ09OVEVYVF9MT1NUX1dFQkdMPSAzNzQ0MiA7IHRoaXMuQ1VMTF9GQUNFPSAyODg0IDsgdGhpcy5DVUxMX0ZBQ0VfTU9ERT0gMjg4NSA7IHRoaXMuQ1VSUkVOVF9QUk9HUkFNPSAzNTcyNSA7IHRoaXMuQ1VSUkVOVF9WRVJURVhfQVRUUklCPSAzNDM0MiA7IHRoaXMuQ1c9IDIzMDQgOyB0aGlzLkRFQ1I9IDc2ODMgOyB0aGlzLkRFQ1JfV1JBUD0gMzQwNTYgOyB0aGlzLkRFTEVURV9TVEFUVVM9IDM1NzEyIDsgdGhpcy5ERVBUSF9BVFRBQ0hNRU5UPSAzNjA5NiA7IHRoaXMuREVQVEhfQklUUz0gMzQxNCA7IHRoaXMuREVQVEhfQlVGRkVSX0JJVD0gMjU2IDsgdGhpcy5ERVBUSF9DTEVBUl9WQUxVRT0gMjkzMSA7IHRoaXMuREVQVEhfQ09NUE9ORU5UPSA2NDAyIDsgdGhpcy5ERVBUSF9DT01QT05FTlQxNj0gMzMxODkgOyB0aGlzLkRFUFRIX0ZVTkM9IDI5MzIgOyB0aGlzLkRFUFRIX1JBTkdFPSAyOTI4IDsgdGhpcy5ERVBUSF9TVEVOQ0lMPSAzNDA0MSA7IHRoaXMuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UPSAzMzMwNiA7IHRoaXMuREVQVEhfVEVTVD0gMjkyOSA7IHRoaXMuREVQVEhfV1JJVEVNQVNLPSAyOTMwIDsgdGhpcy5ESVRIRVI9IDMwMjQgOyB0aGlzLkRPTlRfQ0FSRT0gNDM1MiA7IHRoaXMuRFNUX0FMUEhBPSA3NzIgOyB0aGlzLkRTVF9DT0xPUj0gNzc0IDsgdGhpcy5EWU5BTUlDX0RSQVc9IDM1MDQ4IDsgdGhpcy5FTEVNRU5UX0FSUkFZX0JVRkZFUj0gMzQ5NjMgOyB0aGlzLkVMRU1FTlRfQVJSQVlfQlVGRkVSX0JJTkRJTkc9IDM0OTY1IDsgdGhpcy5FUVVBTD0gNTE0IDsgdGhpcy5GQVNURVNUPSA0MzUzIDsgdGhpcy5GTE9BVD0gNTEyNiA7IHRoaXMuRkxPQVRfTUFUMj0gMzU2NzQgOyB0aGlzLkZMT0FUX01BVDM9IDM1Njc1IDsgdGhpcy5GTE9BVF9NQVQ0PSAzNTY3NiA7IHRoaXMuRkxPQVRfVkVDMj0gMzU2NjQgOyB0aGlzLkZMT0FUX1ZFQzM9IDM1NjY1IDsgdGhpcy5GTE9BVF9WRUM0PSAzNTY2NiA7IHRoaXMuRlJBR01FTlRfU0hBREVSPSAzNTYzMiA7IHRoaXMuRlJBTUVCVUZGRVI9IDM2MTYwIDsgdGhpcy5GUkFNRUJVRkZFUl9BVFRBQ0hNRU5UX09CSkVDVF9OQU1FPSAzNjA0OSA7IHRoaXMuRlJBTUVCVUZGRVJfQVRUQUNITUVOVF9PQkpFQ1RfVFlQRT0gMzYwNDggOyB0aGlzLkZSQU1FQlVGRkVSX0FUVEFDSE1FTlRfVEVYVFVSRV9DVUJFX01BUF9GQUNFPSAzNjA1MSA7IHRoaXMuRlJBTUVCVUZGRVJfQVRUQUNITUVOVF9URVhUVVJFX0xFVkVMPSAzNjA1MCA7IHRoaXMuRlJBTUVCVUZGRVJfQklORElORz0gMzYwMDYgOyB0aGlzLkZSQU1FQlVGRkVSX0NPTVBMRVRFPSAzNjA1MyA7IHRoaXMuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UPSAzNjA1NCA7IHRoaXMuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9ESU1FTlNJT05TPSAzNjA1NyA7IHRoaXMuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQ9IDM2MDU1IDsgdGhpcy5GUkFNRUJVRkZFUl9VTlNVUFBPUlRFRD0gMzYwNjEgOyB0aGlzLkZST05UPSAxMDI4IDsgdGhpcy5GUk9OVF9BTkRfQkFDSz0gMTAzMiA7IHRoaXMuRlJPTlRfRkFDRT0gMjg4NiA7IHRoaXMuRlVOQ19BREQ9IDMyNzc0IDsgdGhpcy5GVU5DX1JFVkVSU0VfU1VCVFJBQ1Q9IDMyNzc5IDsgdGhpcy5GVU5DX1NVQlRSQUNUPSAzMjc3OCA7IHRoaXMuR0VORVJBVEVfTUlQTUFQX0hJTlQ9IDMzMTcwIDsgdGhpcy5HRVFVQUw9IDUxOCA7IHRoaXMuR1JFQVRFUj0gNTE2IDsgdGhpcy5HUkVFTl9CSVRTPSAzNDExIDsgdGhpcy5ISUdIX0ZMT0FUPSAzNjMzOCA7IHRoaXMuSElHSF9JTlQ9IDM2MzQxIDsgdGhpcy5JTkNSPSA3NjgyIDsgdGhpcy5JTkNSX1dSQVA9IDM0MDU1IDsgdGhpcy5JTlQ9IDUxMjQgOyB0aGlzLklOVF9WRUMyPSAzNTY2NyA7IHRoaXMuSU5UX1ZFQzM9IDM1NjY4IDsgdGhpcy5JTlRfVkVDND0gMzU2NjkgOyB0aGlzLklOVkFMSURfRU5VTT0gMTI4MCA7IHRoaXMuSU5WQUxJRF9GUkFNRUJVRkZFUl9PUEVSQVRJT049IDEyODYgOyB0aGlzLklOVkFMSURfT1BFUkFUSU9OPSAxMjgyIDsgdGhpcy5JTlZBTElEX1ZBTFVFPSAxMjgxIDsgdGhpcy5JTlZFUlQ9IDUzODYgOyB0aGlzLktFRVA9IDc2ODAgOyB0aGlzLkxFUVVBTD0gNTE1IDsgdGhpcy5MRVNTPSA1MTMgOyB0aGlzLkxJTkVBUj0gOTcyOSA7IHRoaXMuTElORUFSX01JUE1BUF9MSU5FQVI9IDk5ODcgOyB0aGlzLkxJTkVBUl9NSVBNQVBfTkVBUkVTVD0gOTk4NSA7IHRoaXMuTElORVM9IDEgOyB0aGlzLkxJTkVfTE9PUD0gMiA7IHRoaXMuTElORV9TVFJJUD0gMyA7IHRoaXMuTElORV9XSURUSD0gMjg0OTsgdGhpcy5MSU5LX1NUQVRVUz0gMzU3MTQ7IHRoaXMuTE9XX0ZMT0FUPSAzNjMzNiA7IHRoaXMuTE9XX0lOVD0gMzYzMzkgOyB0aGlzLkxVTUlOQU5DRT0gNjQwOSA7IHRoaXMuTFVNSU5BTkNFX0FMUEhBPSA2NDEwOyB0aGlzLk1BWF9DT01CSU5FRF9URVhUVVJFX0lNQUdFX1VOSVRTPSAzNTY2MSA7IHRoaXMuTUFYX0NVQkVfTUFQX1RFWFRVUkVfU0laRT0gMzQwNzYgOyB0aGlzLk1BWF9GUkFHTUVOVF9VTklGT1JNX1ZFQ1RPUlM9IDM2MzQ5IDsgdGhpcy5NQVhfUkVOREVSQlVGRkVSX1NJWkU9IDM0MDI0IDsgdGhpcy5NQVhfVEVYVFVSRV9JTUFHRV9VTklUUz0gMzQ5MzAgOyB0aGlzLk1BWF9URVhUVVJFX1NJWkU9IDMzNzkgOyB0aGlzLiBNQVhfVkFSWUlOR19WRUNUT1JTPSAzNjM0OCA7IHRoaXMuTUFYX1ZFUlRFWF9BVFRSSUJTPSAzNDkyMSA7IHRoaXMuTUFYX1ZFUlRFWF9URVhUVVJFX0lNQUdFX1VOSVRTPSAzNTY2MCA7IHRoaXMuTUFYX1ZFUlRFWF9VTklGT1JNX1ZFQ1RPUlM9IDM2MzQ3IDsgdGhpcy5NQVhfVklFV1BPUlRfRElNUz0gMzM4NiA7IHRoaXMuTUVESVVNX0ZMT0FUPSAzNjMzNyA7IHRoaXMuTUVESVVNX0lOVD0gMzYzNDAgOyB0aGlzLk1JUlJPUkVEX1JFUEVBVD0gMzM2NDggOyB0aGlzLk5FQVJFU1Q9IDk3MjggOyB0aGlzLk5FQVJFU1RfTUlQTUFQX0xJTkVBUj0gOTk4NiA7IHRoaXMuTkVBUkVTVF9NSVBNQVBfTkVBUkVTVD0gOTk4NCA7IHRoaXMuTkVWRVI9IDUxMiA7IHRoaXMuTklDRVNUPSA0MzU0IDsgdGhpcy5OT05FPSAwIDsgdGhpcy5OT1RFUVVBTD0gNTE3IDsgdGhpcy5OT19FUlJPUj0gMCA7IHRoaXMuT05FPSAxIDsgdGhpcy5PTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEE9IDMyNzcyIDsgdGhpcy5PTkVfTUlOVVNfQ09OU1RBTlRfQ09MT1I9IDMyNzcwIDsgdGhpcy5PTkVfTUlOVVNfRFNUX0FMUEhBPSA3NzMgOyB0aGlzLk9ORV9NSU5VU19EU1RfQ09MT1I9IDc3NSA7IHRoaXMuT05FX01JTlVTX1NSQ19BTFBIQT0gNzcxIDsgdGhpcy5PTkVfTUlOVVNfU1JDX0NPTE9SPSA3NjkgOyB0aGlzLk9VVF9PRl9NRU1PUlk9IDEyODUgOyB0aGlzLlBBQ0tfQUxJR05NRU5UPSAzMzMzIDsgdGhpcy5QT0lOVFM9IDAgOyB0aGlzLlBPTFlHT05fT0ZGU0VUX0ZBQ1RPUj0gMzI4MjQgOyB0aGlzLlBPTFlHT05fT0ZGU0VUX0ZJTEw9IDMyODIzIDsgdGhpcy5QT0xZR09OX09GRlNFVF9VTklUUz0gMTA3NTIgOyB0aGlzLlJFRF9CSVRTPSAzNDEwIDsgdGhpcy5SRU5ERVJCVUZGRVI9IDM2MTYxIDsgdGhpcy5SRU5ERVJCVUZGRVJfQUxQSEFfU0laRT0gMzYxNzkgOyB0aGlzLlJFTkRFUkJVRkZFUl9CSU5ESU5HPSAzNjAwNyA7IHRoaXMuUkVOREVSQlVGRkVSX0JMVUVfU0laRT0gMzYxNzggOyB0aGlzLlJFTkRFUkJVRkZFUl9ERVBUSF9TSVpFPSAzNjE4MCA7IHRoaXMuUkVOREVSQlVGRkVSX0dSRUVOX1NJWkU9IDM2MTc3IDsgdGhpcy5SRU5ERVJCVUZGRVJfSEVJR0hUPSAzNjE2MyA7IHRoaXMuUkVOREVSQlVGRkVSX0lOVEVSTkFMX0ZPUk1BVD0gMzYxNjQgOyB0aGlzLlJFTkRFUkJVRkZFUl9SRURfU0laRT0gMzYxNzYgOyB0aGlzLlJFTkRFUkJVRkZFUl9TVEVOQ0lMX1NJWkU9IDM2MTgxIDsgdGhpcy5SRU5ERVJCVUZGRVJfV0lEVEg9IDM2MTYyIDsgdGhpcy5SRU5ERVJFUj0gNzkzNyA7IHRoaXMuUkVQRUFUPSAxMDQ5NyA7IHRoaXMuUkVQTEFDRT0gNzY4MSA7IHRoaXMuUkdCPSA2NDA3IDsgdGhpcy5SR0I1X0ExPSAzMjg1NSA7IHRoaXMuUkdCNTY1PSAzNjE5NCA7IHRoaXMuUkdCQT0gNjQwOCA7IHRoaXMuUkdCQTQ9IDMyODU0IDsgdGhpcy5TQU1QTEVSXzJEPSAzNTY3OCA7IHRoaXMuU0FNUExFUl9DVUJFPSAzNTY4MCA7IHRoaXMuU0FNUExFUz0gMzI5MzcgOyB0aGlzLlNBTVBMRV9BTFBIQV9UT19DT1ZFUkFHRT0gMzI5MjYgOyB0aGlzLlNBTVBMRV9CVUZGRVJTPSAzMjkzNiA7IHRoaXMuU0FNUExFX0NPVkVSQUdFPSAzMjkyOCA7IHRoaXMuU0FNUExFX0NPVkVSQUdFX0lOVkVSVD0gMzI5MzkgOyB0aGlzLlNBTVBMRV9DT1ZFUkFHRV9WQUxVRT0gMzI5MzggOyB0aGlzLlNDSVNTT1JfQk9YPSAzMDg4IDsgdGhpcy5TQ0lTU09SX1RFU1Q9IDMwODkgOyB0aGlzLlNIQURFUl9UWVBFPSAzNTY2MyA7IHRoaXMuU0hBRElOR19MQU5HVUFHRV9WRVJTSU9OPSAzNTcyNCA7IHRoaXMuU0hPUlQ9IDUxMjIgOyB0aGlzLlNSQ19BTFBIQT0gNzcwIDsgdGhpcy5TUkNfQUxQSEFfU0FUVVJBVEU9IDc3NiA7IHRoaXMuU1JDX0NPTE9SPSA3NjggOyB0aGlzLlNUQVRJQ19EUkFXPSAzNTA0NCA7IHRoaXMuU1RFTkNJTF9BVFRBQ0hNRU5UPSAzNjEyOCA7IHRoaXMuU1RFTkNJTF9CQUNLX0ZBSUw9IDM0ODE3IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfRlVOQz0gMzQ4MTYgOyB0aGlzLlNURU5DSUxfQkFDS19QQVNTX0RFUFRIX0ZBSUw9IDM0ODE4IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfUEFTU19ERVBUSF9QQVNTPSAzNDgxOSA7IHRoaXMuU1RFTkNJTF9CQUNLX1JFRj0gMzYwMDMgOyB0aGlzLlNURU5DSUxfQkFDS19WQUxVRV9NQVNLPSAzNjAwNCA7IHRoaXMuU1RFTkNJTF9CQUNLX1dSSVRFTUFTSz0gMzYwMDUgOyB0aGlzLlNURU5DSUxfQklUUz0gMzQxNSA7IHRoaXMuU1RFTkNJTF9CVUZGRVJfQklUPSAxMDI0IDsgdGhpcy5TVEVOQ0lMX0NMRUFSX1ZBTFVFPSAyOTYxIDsgdGhpcy5TVEVOQ0lMX0ZBSUw9IDI5NjQgOyB0aGlzLlNURU5DSUxfRlVOQz0gMjk2MiA7IHRoaXMuU1RFTkNJTF9JTkRFWD0gNjQwMSA7IHRoaXMuU1RFTkNJTF9JTkRFWDg9IDM2MTY4IDsgdGhpcy5TVEVOQ0lMX1BBU1NfREVQVEhfRkFJTD0gMjk2NSA7IHRoaXMuU1RFTkNJTF9QQVNTX0RFUFRIX1BBU1M9IDI5NjYgOyB0aGlzLlNURU5DSUxfUkVGPSAyOTY3IDsgdGhpcy5TVEVOQ0lMX1RFU1Q9IDI5NjAgOyB0aGlzLlNURU5DSUxfVkFMVUVfTUFTSz0gMjk2MyA7IHRoaXMuU1RFTkNJTF9XUklURU1BU0s9IDI5NjggOyB0aGlzLlNUUkVBTV9EUkFXPSAzNTA0MCA7IHRoaXMuU1VCUElYRUxfQklUUz0gMzQwOCA7IHRoaXMuVEVYVFVSRT0gNTg5MCA7IHRoaXMuVEVYVFVSRTA9IDMzOTg0IDsgdGhpcy5URVhUVVJFMT0gMzM5ODUgOyB0aGlzLlRFWFRVUkUyPSAzMzk4NiA7IHRoaXMuVEVYVFVSRTM9IDMzOTg3IDsgdGhpcy5URVhUVVJFND0gMzM5ODggOyB0aGlzLlRFWFRVUkU1PSAzMzk4OSA7IHRoaXMuVEVYVFVSRTY9IDMzOTkwIDsgdGhpcy5URVhUVVJFNz0gMzM5OTEgOyB0aGlzLlRFWFRVUkU4PSAzMzk5MiA7IHRoaXMuVEVYVFVSRTk9IDMzOTkzIDsgdGhpcy5URVhUVVJFMTA9IDMzOTk0IDsgdGhpcy5URVhUVVJFMTE9IDMzOTk1IDsgdGhpcy5URVhUVVJFMTI9IDMzOTk2IDsgdGhpcy5URVhUVVJFMTM9IDMzOTk3IDsgdGhpcy5URVhUVVJFMTQ9IDMzOTk4IDsgdGhpcy5URVhUVVJFMTU9IDMzOTk5IDsgdGhpcy5URVhUVVJFMTY9IDM0MDAwIDsgdGhpcy5URVhUVVJFMTc9IDM0MDAxIDsgdGhpcy5URVhUVVJFMTg9IDM0MDAyIDsgdGhpcy5URVhUVVJFMTk9IDM0MDAzIDsgdGhpcy5URVhUVVJFMjA9IDM0MDA0IDsgdGhpcy5URVhUVVJFMjE9IDM0MDA1IDsgdGhpcy5URVhUVVJFMjI9IDM0MDA2IDsgdGhpcy5URVhUVVJFMjM9IDM0MDA3IDsgdGhpcy5URVhUVVJFMjQ9IDM0MDA4IDsgdGhpcy5URVhUVVJFMjU9IDM0MDA5IDsgdGhpcy5URVhUVVJFMjY9IDM0MDEwIDsgdGhpcy5URVhUVVJFMjc9IDM0MDExIDsgdGhpcy5URVhUVVJFMjg9IDM0MDEyIDsgdGhpcy5URVhUVVJFMjk9IDM0MDEzIDsgdGhpcy5URVhUVVJFMzA9IDM0MDE0IDsgdGhpcy5URVhUVVJFMzE9IDM0MDE1IDsgdGhpcy5URVhUVVJFXzJEPSAzNTUzIDsgdGhpcy5URVhUVVJFX0JJTkRJTkdfMkQ9IDMyODczIDsgdGhpcy5URVhUVVJFX0JJTkRJTkdfQ1VCRV9NQVA9IDM0MDY4IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQPSAzNDA2NyA7IHRoaXMuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9YPSAzNDA3MCA7IHRoaXMuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9ZPSAzNDA3MiA7IHRoaXMuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aPSAzNDA3NCA7IHRoaXMuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YPSAzNDA2OSA7IHRoaXMuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZPSAzNDA3MSA7IHRoaXMuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9aPSAzNDA3MyA7IHRoaXMuVEVYVFVSRV9NQUdfRklMVEVSPSAxMDI0MCA7IHRoaXMuVEVYVFVSRV9NSU5fRklMVEVSPSAxMDI0MSA7IHRoaXMuVEVYVFVSRV9XUkFQX1M9IDEwMjQyIDsgdGhpcy5URVhUVVJFX1dSQVBfVD0gMTAyNDMgOyB0aGlzLlRSSUFOR0xFUz0gNCA7IHRoaXMuVFJJQU5HTEVfRkFOPSA2IDsgdGhpcy5UUklBTkdMRV9TVFJJUD0gNSA7IHRoaXMuVU5QQUNLX0FMSUdOTUVOVD0gMzMxNyA7IHRoaXMuVU5QQUNLX0NPTE9SU1BBQ0VfQ09OVkVSU0lPTl9XRUJHTD0gMzc0NDMgOyB0aGlzLlVOUEFDS19GTElQX1lfV0VCR0w9IDM3NDQwIDsgdGhpcy5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0w9IDM3NDQxIDsgdGhpcy5VTlNJR05FRF9CWVRFPSA1MTIxIDsgdGhpcy5VTlNJR05FRF9JTlQ9IDUxMjUgOyB0aGlzLlVOU0lHTkVEX1NIT1JUPSA1MTIzIDsgdGhpcy5VTlNJR05FRF9TSE9SVF80XzRfNF80PSAzMjgxOSA7IHRoaXMuVU5TSUdORURfU0hPUlRfNV81XzVfMT0gMzI4MjAgOyB0aGlzLlVOU0lHTkVEX1NIT1JUXzVfNl81PSAzMzYzNSA7IHRoaXMuVkFMSURBVEVfU1RBVFVTPSAzNTcxNSA7IHRoaXMuVkVORE9SPSA3OTM2IDsgdGhpcy5WRVJTSU9OPSA3OTM4IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX0JVRkZFUl9CSU5ESU5HPSAzNDk3NSA7IHRoaXMuVkVSVEVYX0FUVFJJQl9BUlJBWV9FTkFCTEVEPSAzNDMzOCA7IHRoaXMuVkVSVEVYX0FUVFJJQl9BUlJBWV9OT1JNQUxJWkVEPSAzNDkyMiA7IHRoaXMuVkVSVEVYX0FUVFJJQl9BUlJBWV9QT0lOVEVSPSAzNDM3MyA7IHRoaXMuVkVSVEVYX0FUVFJJQl9BUlJBWV9TSVpFPSAzNDMzOSA7IHRoaXMuVkVSVEVYX0FUVFJJQl9BUlJBWV9TVFJJREU9IDM0MzQwIDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1RZUEU9IDM0MzQxIDsgdGhpcy5WRVJURVhfU0hBREVSPSAzNTYzMyA7IHRoaXMuVklFV1BPUlQ9IDI5NzggOyB0aGlzLlpFUk8gPSAwIDtcblxuXG4gICAgdmFyIFNJWkVfT0ZfVkVSVEVYICAgID0gVmVjMy5TSVpFLFxuICAgICAgICBTSVpFX09GX0NPTE9SICAgICA9IENvbG9yLlNJWkUsXG4gICAgICAgIFNJWkVfT0ZfVEVYX0NPT1JEID0gVmVjMi5TSVpFO1xuXG4gICAgdGhpcy5TSVpFX09GX1ZFUlRFWCAgICA9IFNJWkVfT0ZfVkVSVEVYO1xuICAgIHRoaXMuU0laRV9PRl9OT1JNQUwgICAgPSBTSVpFX09GX1ZFUlRFWDtcbiAgICB0aGlzLlNJWkVfT0ZfQ09MT1IgICAgID0gU0laRV9PRl9DT0xPUjtcbiAgICB0aGlzLlNJWkVfT0ZfVEVYX0NPT1JEID0gIFNJWkVfT0ZfVEVYX0NPT1JEO1xuXG4gICAgdmFyIFNJWkVfT0ZfRkFDRSAgICA9IHRoaXMuU0laRV9PRl9GQUNFICAgPSBTSVpFX09GX1ZFUlRFWDtcblxuICAgIHZhciBTSVpFX09GX1FVQUQgICAgID0gdGhpcy5TSVpFX09GX1FVQUQgICAgID0gU0laRV9PRl9WRVJURVggKiA0LFxuICAgICAgICBTSVpFX09GX1RSSUFOR0xFID0gdGhpcy5TSVpFX09GX1RSSUFOR0xFID0gU0laRV9PRl9WRVJURVggKiAzLFxuICAgICAgICBTSVpFX09GX0xJTkUgICAgID0gdGhpcy5TSVpFX09GX0xJTkUgICAgID0gU0laRV9PRl9WRVJURVggKiAyLFxuICAgICAgICBTSVpFX09GX1BPSU5UICAgID0gdGhpcy5TSVpFX09GX1BPSU5UICAgID0gU0laRV9PRl9WRVJURVg7XG5cbiAgICB2YXIgRUxMSVBTRV9ERVRBSUxfTUFYID0gdGhpcy5FTExJUFNFX0RFVEFJTF9NQVggPSAzMDtcbiAgICB0aGlzLkVMTElQU0VfREVUQUlMX01JTiA9IDM7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gICAgLy8gSW5pdCBzaGFyZWQgYnVmZmVyc1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIHRoaXMuUkVQRUFUICAgICAgICA9IGdsLlJFUEVBVDtcbiAgICB0aGlzLkNMQU1QICAgICAgICAgPSBnbC5DTEFNUDtcbiAgICB0aGlzLkNMQU1QX1RPX0VER0UgPSBnbC5DTEFNUF9UT19FREdFO1xuXG4gICAgdGhpcy5fdGV4TW9kZSAgPSB0aGlzLlJFUEVBVDtcbiAgICB0aGlzLl90ZXhTZXQgICA9IGZhbHNlO1xuXG4gICAgdGhpcy5fdGV4RW1wdHkgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCx0aGlzLl90ZXhFbXB0eSk7XG4gICAgZ2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgMSwgMSwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbmV3IFVpbnQ4QXJyYXkoWzEsMSwxLDFdKSk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VUZXh0dXJlLDAuMCk7XG5cbiAgICB0aGlzLl90ZXggICAgICA9IG51bGw7XG5cbiAgICB0aGlzLl9kZWZhdWx0VkJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5fZGVmYXVsdElCTyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsICAgICAgICAgdGhpcy5fZGVmYXVsdFZCTyk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5fZGVmYXVsdElCTyk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gICAgLy8gSW5pdCBmbGFncyBhbmQgY2FjaGVzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5fYlVzZUxpZ2h0aW5nICAgICAgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9iVXNlQmlsbGJvYXJkaW5nICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX2JVc2VCaWxsYm9hcmRpbmdMYXN0ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9iQlZlY1JpZ2h0ID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYkJWZWNVcCAgICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KDQgKiAzKTtcblxuICAgIHRoaXMuX2JCVmVjMCA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMSA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMiA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMyA9IFZlYzMubWFrZSgpO1xuXG4gICAgdGhpcy5fcmVjdFdpZHRoTGFzdCAgICA9IDA7XG4gICAgdGhpcy5fcmVjdEhlaWdodExhc3QgICA9IDA7XG5cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IE1hdHJpY2VzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5fY2FtZXJhICAgID0gbnVsbDtcblxuICAgIHRoaXMuX21Nb2RlVmlldyA9IE1hdDQ0Lm1ha2UoKTtcbiAgICB0aGlzLl9tTm9ybWFsICAgPSBNYXQzMy5tYWtlKCk7XG5cbiAgICB0aGlzLl9tU3RhY2sgPSBbXTtcblxuICAgIHRoaXMuX2RyYXdNb2RlID0gdGhpcy5MSU5FUztcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IEJ1ZmZlcnNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB0aGlzLl9iRW1wdHkzZiA9IG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XG5cbiAgICB0aGlzLl9iQ29sb3I0ZiAgID0gQ29sb3IuV0hJVEUoKTtcbiAgICB0aGlzLl9iQ29sb3JCZzRmID0gQ29sb3IuQkxBQ0soKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXggICA9IG51bGw7XG4gICAgdGhpcy5fYk5vcm1hbCAgID0gbnVsbDtcbiAgICB0aGlzLl9iQ29sb3IgICAgPSBudWxsO1xuICAgIHRoaXMuX2JUZXhDb29yZCA9IG51bGw7XG4gICAgdGhpcy5fYkluZGV4ICAgID0gbnVsbDtcblxuICAgIHRoaXMuX2JWZXJ0ZXhQb2ludCA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9QT0lOVCk7XG4gICAgdGhpcy5fYkNvbG9yUG9pbnQgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0NPTE9SKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhMaW5lICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9MSU5FKTtcbiAgICB0aGlzLl9iQ29sb3JMaW5lICAgPSBuZXcgRmxvYXQzMkFycmF5KDIgKiBTSVpFX09GX0NPTE9SKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZSAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9UUklBTkdMRSk7XG4gICAgdGhpcy5fYk5vcm1hbFRyaWFuZ2xlICAgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1RSSUFOR0xFKTtcbiAgICB0aGlzLl9iQ29sb3JUcmlhbmdsZSAgICAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KDMgKiBTSVpFX09GX0NPTE9SKTtcbiAgICB0aGlzLl9iSW5kZXhUcmlhbmdsZSAgICAgICAgICAgPSBuZXcgVWludDE2QXJyYXkoWzAsMSwyXSk7XG4gICAgdGhpcy5fYlRleENvb3JkVHJpYW5nbGVEZWZhdWx0ID0gbmV3IEZsb2F0MzJBcnJheShbMC4wLDAuMCwxLjAsMC4wLDEuMCwxLjBdKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRUcmlhbmdsZSAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2JUZXhDb29yZFRyaWFuZ2xlRGVmYXVsdC5sZW5ndGgpO1xuXG4gICAgdGhpcy5fYlZlcnRleFF1YWQgICAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfUVVBRCk7XG4gICAgdGhpcy5fYk5vcm1hbFF1YWQgICAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfUVVBRCk7XG4gICAgdGhpcy5fYkNvbG9yUXVhZCAgICAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KDQgKiBTSVpFX09GX0NPTE9SKTtcbiAgICB0aGlzLl9iSW5kZXhRdWFkICAgICAgICAgICA9IG5ldyBVaW50MTZBcnJheShbMCwxLDIsMSwyLDNdKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRRdWFkRGVmYXVsdCA9IG5ldyBGbG9hdDMyQXJyYXkoWzAuMCwwLjAsMS4wLDAuMCwxLjAsMS4wLDAuMCwxLjBdKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRRdWFkICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fYlRleENvb3JkUXVhZERlZmF1bHQubGVuZ3RoKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhSZWN0ID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1FVQUQpO1xuICAgIHRoaXMuX2JOb3JtYWxSZWN0ID0gbmV3IEZsb2F0MzJBcnJheShbMCwxLDAsMCwxLDAsMCwxLDAsMCwxLDBdKTtcbiAgICB0aGlzLl9iQ29sb3JSZWN0ICA9IG5ldyBGbG9hdDMyQXJyYXkoNCAqIFNJWkVfT0ZfQ09MT1IpO1xuXG4gICAgdGhpcy5fYlZlcnRleEVsbGlwc2UgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9WRVJURVggKiBFTExJUFNFX0RFVEFJTF9NQVgpO1xuICAgIHRoaXMuX2JOb3JtYWxFbGxpcHNlICAgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2JWZXJ0ZXhFbGxpcHNlLmxlbmd0aCk7XG4gICAgdGhpcy5fYkNvbG9yRWxsaXBzZSAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9DT0xPUiAgKiBFTExJUFNFX0RFVEFJTF9NQVgpO1xuICAgIHRoaXMuX2JUZXhDb29yZEVsbGlwc2UgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfVEVYX0NPT1JEICogRUxMSVBTRV9ERVRBSUxfTUFYKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhDaXJjbGUgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9WRVJURVggKiBFTExJUFNFX0RFVEFJTF9NQVgpO1xuICAgIHRoaXMuX2JOb3JtYWxDaXJjbGUgICA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fYlZlcnRleENpcmNsZS5sZW5ndGgpO1xuICAgIHRoaXMuX2JDb2xvckNpcmNsZSAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9DT0xPUiAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYlRleENvb3JkQ2lyY2xlID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1RFWF9DT09SRCAqIEVMTElQU0VfREVUQUlMX01BWCk7XG5cbiAgICB0aGlzLl9iVmVydGV4Q3ViZSAgID0gbmV3IEZsb2F0MzJBcnJheShbLTAuNSwtMC41LCAwLjUsIDAuNSwtMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsLTAuNSwgMC41LCAwLjUsLTAuNSwtMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsIDAuNSwgMC41LC0wLjUsIDAuNSwtMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwgMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsIDAuNSwgMC41LC0wLjUsLTAuNSwtMC41LC0wLjUsIDAuNSwtMC41LC0wLjUsIDAuNSwtMC41LCAwLjUsLTAuNSwtMC41LCAwLjUsMC41LC0wLjUsLTAuNSwgMC41LCAwLjUsLTAuNSwgMC41LCAwLjUsIDAuNSwgMC41LC0wLjUsIDAuNSwtMC41LC0wLjUsLTAuNSwtMC41LC0wLjUsIDAuNSwtMC41LCAwLjUsIDAuNSwtMC41LCAwLjUsLTAuNV0pO1xuICAgIHRoaXMuX2JDb2xvckN1YmUgICAgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2JWZXJ0ZXhDdWJlLmxlbmd0aCAvIFNJWkVfT0ZfVkVSVEVYICogU0laRV9PRl9DT0xPUik7XG4gICAgdGhpcy5fYk5vcm1hbEN1YmUgICA9IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDBdICk7XG4gICAgdGhpcy5fYkluZGV4Q3ViZSAgICA9IG5ldyBVaW50MTZBcnJheShbICAwLCAxLCAyLCAwLCAyLCAzLCA0LCA1LCA2LCA0LCA2LCA3LCA4LCA5LDEwLCA4LDEwLDExLCAxMiwxMywxNCwxMiwxNCwxNSwgMTYsMTcsMTgsMTYsMTgsMTksIDIwLDIxLDIyLDIwLDIyLDIzXSk7XG4gICAgdGhpcy5fYlRleENvb3JkQ3ViZSA9IG51bGw7XG5cbiAgICB0aGlzLl9jaXJjbGVEZXRhaWxMYXN0ID0gMTAuMDtcbiAgICB0aGlzLl9zcGhlcmVEZXRhaWxMYXN0ID0gMTAuMDtcblxuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmUgICAgPSBudWxsO1xuICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUgICAgPSBudWxsO1xuICAgIHRoaXMuX2JDb2xvclNwaGVyZSAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JJbmRleFNwaGVyZSAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JUZXhDb29yZHNTcGhlcmUgPSBudWxsO1xuXG4gICAgdGhpcy5fYlZlcnRleEN5bGluZGVyICAgID0gbnVsbDtcbiAgICB0aGlzLl9iTm9ybWFsQ3lsaW5kZXIgICAgPSBudWxsO1xuICAgIHRoaXMuX2JDb2xvckN5bGluZGVyICAgICA9IG51bGw7XG4gICAgdGhpcy5fYkluZGV4Q3lsaW5kZXIgICAgID0gbnVsbDtcbiAgICB0aGlzLl9iVGV4Q29vcmRzQ3lsaW5kZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fYlNjcmVlbkNvb3JkcyA9IFswLDBdO1xuICAgIHRoaXMuX2JQb2ludDAgICAgICAgPSBbMCwwLDBdO1xuICAgIHRoaXMuX2JQb2ludDEgICAgICAgPSBbMCwwLDBdO1xuXG4gICAgdGhpcy5fYXhpc1ggPSBWZWMzLkFYSVNfWCgpO1xuICAgIHRoaXMuX2F4aXNZID0gVmVjMy5BWElTX1koKTtcbiAgICB0aGlzLl9heGlzWiA9IFZlYzMuQVhJU19aKCk7XG5cbiAgICB0aGlzLl9saW5lQm94V2lkdGggID0gMTtcbiAgICB0aGlzLl9saW5lQm94SGVpZ2h0ID0gMTtcbiAgICB0aGlzLl9saW5lQ3lsaW5kZXJSYWRpdXMgPSAwLjU7XG5cbiAgICB0aGlzLl9nZW5TcGhlcmUoKTtcbiAgICB0aGlzLl9nZW5DaXJjbGUoKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IHByZXNldHNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgIHRoaXMuYW1iaWVudChDb2xvci5CTEFDSygpKTtcblxufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBMaWdodFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLnVzZUxpZ2h0aW5nICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VMaWdodGluZyxib29sID8gMS4wIDogMC4wKTt0aGlzLl9iVXNlTGlnaHRpbmcgPSBib29sO307XG5rR0wucHJvdG90eXBlLmdldExpZ2h0aW5nICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9iVXNlTGlnaHRpbmc7fTtcblxua0dMLnByb3RvdHlwZS5saWdodCA9IGZ1bmN0aW9uKGxpZ2h0KVxue1xuICAgIHZhciBpZCA9IGxpZ2h0LmdldElkKCksXG4gICAgICAgIGdsID0gdGhpcy5nbDtcblxuICAgIHZhciB0ZW1wVmVjNCAgICA9IHRoaXMuX3RlbXBMaWdodFBvcztcbiAgICAgICAgdGVtcFZlYzRbMF0gPSBsaWdodC5wb3NpdGlvblswXTtcbiAgICAgICAgdGVtcFZlYzRbMV0gPSBsaWdodC5wb3NpdGlvblsxXTtcbiAgICAgICAgdGVtcFZlYzRbMl0gPSBsaWdodC5wb3NpdGlvblsyXTtcbiAgICAgICAgdGVtcFZlYzRbM10gPSBsaWdodC5wb3NpdGlvblszXTtcblxuICAgIHZhciBsaWdodFBvc0V5ZVNwYWNlID0gTWF0NDQubXVsdFZlYzQodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCx0ZW1wVmVjNCk7XG5cbiAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VMaWdodFBvc2l0aW9uW2lkXSwgbGlnaHRQb3NFeWVTcGFjZSk7XG4gICAgZ2wudW5pZm9ybTNmdih0aGlzLl91TGlnaHRBbWJpZW50W2lkXSwgIGxpZ2h0LmFtYmllbnQpO1xuICAgIGdsLnVuaWZvcm0zZnYodGhpcy5fdUxpZ2h0RGlmZnVzZVtpZF0sICBsaWdodC5kaWZmdXNlKTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodFNwZWN1bGFyW2lkXSwgbGlnaHQuc3BlY3VsYXIpO1xuXG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaWRdLCAgIGxpZ2h0LmNvbnN0YW50QXR0ZW50dWF0aW9uKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaWRdLCAgICAgbGlnaHQubGluZWFyQXR0ZW50dWF0aW9uKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWNbaWRdLCAgbGlnaHQucXVhZHJpY0F0dGVudHVhdGlvbik7XG59O1xuXG4vL0ZJWCBNRVxua0dMLnByb3RvdHlwZS5kaXNhYmxlTGlnaHQgPSBmdW5jdGlvbihsaWdodClcbntcbiAgICB2YXIgaWQgPSBsaWdodC5nZXRJZCgpLFxuICAgICAgICBnbCA9IHRoaXMuZ2w7XG5cbiAgICB2YXIgYkVtcHR5ID0gdGhpcy5fYkVtcHR5M2Y7XG5cbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodEFtYmllbnRbaWRdLCAgYkVtcHR5KTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodERpZmZ1c2VbaWRdLCAgYkVtcHR5KTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodFNwZWN1bGFyW2lkXSwgYkVtcHR5KTtcblxuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91TGlnaHRBdHRlbnVhdGlvbkNvbnN0YW50W2lkXSwgMS4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaWRdLCAgIDAuMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljW2lkXSwwLjApO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gVGV4dHVyZVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86IGRvIGl0IHRoZSBwbGFzayB3YXlcblxua0dMLnByb3RvdHlwZS51c2VUZXh0dXJlICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VUZXh0dXJlLCBib29sID8gMS4wIDogMC4wKTt9O1xuXG5rR0wucHJvdG90eXBlLmxvYWRUZXh0dXJlV2l0aEltYWdlID0gZnVuY3Rpb24oaW1nKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2wsXG4gICAgICAgIGdsVGV4ID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuICAgIGdsVGV4LmltYWdlID0gaW1nO1xuXG4gICAgdmFyIHRleCA9IG5ldyBHTEtpdC5UZXh0dXJlKGdsVGV4KTtcbiAgICB0aGlzLl9iaW5kVGV4SW1hZ2UodGV4Ll90ZXgpO1xuXG4gICAgcmV0dXJuIHRleDtcblxufTtcblxua0dMLnByb3RvdHlwZS5sb2FkVGV4dHVyZSA9IGZ1bmN0aW9uKHNyYyx0ZXh0dXJlLGNhbGxiYWNrKVxue1xuICAgIHZhciBnbCAgPSB0aGlzLmdsLFxuICAgICAgICBnbFRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICBnbFRleC5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgZ2xUZXguaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdGV4dHVyZS5zZXRUZXhTb3VyY2UodGhpcy5fYmluZFRleEltYWdlKGdsVGV4KSk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG5cbiAgICBnbFRleC5pbWFnZS5zcmMgPSBzcmM7XG59O1xuXG5rR0wucHJvdG90eXBlLl9iaW5kVGV4SW1hZ2UgPSBmdW5jdGlvbihnbFRleClcbntcbiAgICBpZighZ2xUZXguaW1hZ2UpdGhyb3cgKCdUZXh0dXJlIGltYWdlIGlzIG51bGwuJyk7XG5cbiAgICB2YXIgd2lkdGggID0gZ2xUZXguaW1hZ2Uud2lkdGgsXG4gICAgICAgIGhlaWdodCA9IGdsVGV4LmltYWdlLmhlaWdodDtcblxuICAgIGlmKCh3aWR0aCYod2lkdGgtMSkhPTApKSAgICAgICB7dGhyb3cgJ1RleHR1cmUgaW1hZ2Ugd2lkdGggaXMgbm90IHBvd2VyIG9mIDIuJzsgfVxuICAgIGVsc2UgaWYoKGhlaWdodCYoaGVpZ2h0LTEpKSE9MCl7dGhyb3cgJ1RleHR1cmUgaW1hZ2UgaGVpZ2h0IGlzIG5vdCBwb3dlciBvZiAyLic7fVxuXG4gICAgdmFyIGdsID0gdGhpcy5nbDtcblxuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsZ2xUZXgpO1xuICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgZ2xUZXguaW1hZ2UpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsbnVsbCk7XG5cblxuICAgIHJldHVybiBnbFRleDtcbn07XG5cbmtHTC5wcm90b3R5cGUudGV4dHVyZSA9IGZ1bmN0aW9uKHRleHR1cmUpXG57XG4gICAgdmFyIGdsID0gdGhpcy5nbDtcblxuICAgIHRoaXMuX3RleCA9IHRleHR1cmUuX3RleDtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELHRoaXMuX3RleCk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgdGhpcy5fdGV4TW9kZSApO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMuX3RleE1vZGUgKTtcbiAgICBnbC51bmlmb3JtMWkodGhpcy5fdVRleEltYWdlLDApO1xufTtcblxua0dMLnByb3RvdHlwZS5kaXNhYmxlVGV4dHVyZXMgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELHRoaXMuX3RleEVtcHR5KTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX2FUZXhDb29yZCxHTEtpdC5WZWMyLlNJWkUsZ2wuRkxPQVQsZmFsc2UsMCwwKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdVVzZVRleHR1cmUsMC4wKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIE1hdGVyaWFsXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUudXNlTWF0ZXJpYWwgPSBmdW5jdGlvbihib29sKXt0aGlzLmdsLnVuaWZvcm0xZih0aGlzLl91VXNlTWF0ZXJpYWwsYm9vbCA/IDEuMCA6IDAuMCk7fTtcblxua0dMLnByb3RvdHlwZS5tYXRlcmlhbCA9IGZ1bmN0aW9uKG1hdGVyaWFsKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICAvL2dsLnVuaWZvcm00ZnYodGhpcy5fdU1hdGVyaWFsRW1pc3Npb24sICBtYXRlcmlhbC5lbWlzc2lvbik7XG4gICAgZ2wudW5pZm9ybTRmdih0aGlzLl91TWF0ZXJpYWxBbWJpZW50LCAgIG1hdGVyaWFsLmFtYmllbnQpO1xuICAgIGdsLnVuaWZvcm00ZnYodGhpcy5fdU1hdGVyaWFsRGlmZnVzZSwgICBtYXRlcmlhbC5kaWZmdXNlKTtcbiAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VNYXRlcmlhbFNwZWN1bGFyLCAgbWF0ZXJpYWwuc3BlY3VsYXIpO1xuICAgIGdsLnVuaWZvcm0xZiggdGhpcy5fdU1hdGVyaWFsU2hpbmluZXNzLCBtYXRlcmlhbC5zaGluaW5lc3MpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gQ2FtZXJhXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUuc2V0Q2FtZXJhID0gZnVuY3Rpb24oY2FtZXJhKXt0aGlzLl9jYW1lcmEgPSBjYW1lcmE7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWF0cml4IHN0YWNrXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUubG9hZElkZW50aXR5ID0gZnVuY3Rpb24oKXt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQuaWRlbnRpdHkodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCk7fTtcbmtHTC5wcm90b3R5cGUucHVzaE1hdHJpeCAgID0gZnVuY3Rpb24oKXt0aGlzLl9tU3RhY2sucHVzaChNYXQ0NC5jb3B5KHRoaXMuX21Nb2RlbFZpZXcpKTt9O1xua0dMLnByb3RvdHlwZS5wb3BNYXRyaXggICAgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIHN0YWNrID0gdGhpcy5fbVN0YWNrO1xuXG4gICAgaWYoc3RhY2subGVuZ3RoID09IDApdGhyb3cgKCdJbnZhbGlkIHBvcCEnKTtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gc3RhY2sucG9wKCk7XG5cbiAgICByZXR1cm4gdGhpcy5fbU1vZGVsVmlldztcbn07XG5cbmtHTC5wcm90b3R5cGUuc2V0TWF0cmljZXNVbmlmb3JtID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHRoaXMuX3VNb2RlbFZpZXdNYXRyaXgsZmFsc2UsdGhpcy5fbU1vZGVsVmlldyk7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLl91UHJvamVjdGlvbk1hdHJpeCxmYWxzZSx0aGlzLl9jYW1lcmEucHJvamVjdGlvbk1hdHJpeCk7XG5cbiAgICBpZighdGhpcy5fYlVzZUxpZ2h0aW5nKXJldHVybjtcblxuICAgIE1hdDQ0LnRvTWF0MzNJbnZlcnNlZCh0aGlzLl9tTW9kZWxWaWV3LHRoaXMuX21Ob3JtYWwpO1xuICAgIE1hdDMzLnRyYW5zcG9zZSh0aGlzLl9tTm9ybWFsLHRoaXMuX21Ob3JtYWwpO1xuXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLl91Tm9ybWFsTWF0cml4LGZhbHNlLHRoaXMuX21Ob3JtYWwpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWF0cml4IHN0YWNrIHRyYW5zZm9ybWF0aW9uc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLnRyYW5zbGF0ZSAgICAgPSBmdW5jdGlvbih2KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSh2WzBdLHZbMV0sdlsyXSkpO307XG5rR0wucHJvdG90eXBlLnRyYW5zbGF0ZTNmICAgPSBmdW5jdGlvbih4LHkseikgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSh4LHkseikpO307XG5rR0wucHJvdG90eXBlLnRyYW5zbGF0ZVggICAgPSBmdW5jdGlvbih4KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSh4LDAsMCkpO307XG5rR0wucHJvdG90eXBlLnRyYW5zbGF0ZVkgICAgPSBmdW5jdGlvbih5KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSgwLHksMCkpO307XG5rR0wucHJvdG90eXBlLnRyYW5zbGF0ZVogICAgPSBmdW5jdGlvbih6KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSgwLDAseikpO307XG5rR0wucHJvdG90eXBlLnNjYWxlICAgICAgICAgPSBmdW5jdGlvbih2KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKHZbMF0sdlsxXSx2WzJdKSk7fTtcbmtHTC5wcm90b3R5cGUuc2NhbGUxZiAgICAgICA9IGZ1bmN0aW9uKG4pICAgICAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUobixuLG4pKTt9O1xua0dMLnByb3RvdHlwZS5zY2FsZTNmICAgICAgID0gZnVuY3Rpb24oeCx5LHopICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZSh4LHkseikpO307XG5rR0wucHJvdG90eXBlLnNjYWxlWCAgICAgICAgPSBmdW5jdGlvbih4KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKHgsMSwxKSk7fTtcbmtHTC5wcm90b3R5cGUuc2NhbGVZICAgICAgICA9IGZ1bmN0aW9uKHkpICAgICAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoMSx5LDEpKTt9O1xua0dMLnByb3RvdHlwZS5zY2FsZVogICAgICAgID0gZnVuY3Rpb24oeikgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZSgxLDEseikpO307XG5rR0wucHJvdG90eXBlLnJvdGF0ZSAgICAgICAgPSBmdW5jdGlvbih2KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWFlaKHZbMF0sdlsxXSx2WzJdKSk7fTtcbmtHTC5wcm90b3R5cGUucm90YXRlM2YgICAgICA9IGZ1bmN0aW9uKHgseSx6KSAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25YWVooeCx5LHopKTt9O1xua0dMLnByb3RvdHlwZS5yb3RhdGVYICAgICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblgoeCkpO307XG5rR0wucHJvdG90eXBlLnJvdGF0ZVkgICAgICAgPSBmdW5jdGlvbih5KSAgICAgICAgICB7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWSh5KSk7fTtcbmtHTC5wcm90b3R5cGUucm90YXRlWiAgICAgICA9IGZ1bmN0aW9uKHopICAgICAgICAgIHt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25aKHopKTt9O1xua0dMLnByb3RvdHlwZS5yb3RhdGVBeGlzICAgID0gZnVuY3Rpb24oYW5nbGUsdikgICAge3RoaXMuX21Nb2RlbFZpZXcgPSBNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvbk9uQXhpcyhhbmdsZSx2WzBdLHZbMV0sdlsyXSkpO307XG5rR0wucHJvdG90eXBlLnJvdGF0ZUF4aXMzZiAgPSBmdW5jdGlvbihhbmdsZSx4LHkseil7dGhpcy5fbU1vZGVsVmlldyA9IE1hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uT25BeGlzKGFuZ2xlLHgseSx6KSk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gY29udmVuaWVuY2UgZHJhd1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbmtHTC5wcm90b3R5cGUuZHJhd0VsZW1lbnRzID0gZnVuY3Rpb24odmVydGV4RmxvYXQzMkFycmF5LG5vcm1hbEZsb2F0MzJBcnJheSxjb2xvckZsb2F0MzJBcnJheSx1dkZsb2F0MzJBcnJheSxpbmRleEFycmF5LG1vZGUsY291bnQsb2Zmc2V0LHR5cGUsZHJhd1R5cGUpXG57XG4gICAgdmFyIGdsID0gdGhpcy5nbDtcblxuICAgIHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXkpO1xuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUixpbmRleEFycmF5LGRyYXdUeXBlIHx8IGdsLkRZTkFNSUNfRFJBVyk7XG4gICAgZ2wuZHJhd0VsZW1lbnRzKG1vZGUgIHx8IHRoaXMuVFJJQU5HTEVTLFxuICAgICAgICAgICAgICAgICAgICBjb3VudCB8fCBpbmRleEFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgfHwgZ2wuVU5TSUdORURfU0hPUlQsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCB8fCAwKTtcbn07XG5cblxua0dMLnByb3RvdHlwZS5kcmF3QXJyYXlzID0gZnVuY3Rpb24odmVydGV4RmxvYXQzMkFycmF5LG5vcm1hbEZsb2F0MzJBcnJheSxjb2xvckZsb2F0MzJBcnJheSx1dkZsb2F0MzJBcnJheSxtb2RlLGZpcnN0LGNvdW50KVxue1xuXG4gICAgdGhpcy5idWZmZXJBcnJheXModmVydGV4RmxvYXQzMkFycmF5LG5vcm1hbEZsb2F0MzJBcnJheSxjb2xvckZsb2F0MzJBcnJheSx1dkZsb2F0MzJBcnJheSk7XG4gICAgdGhpcy5zZXRNYXRyaWNlc1VuaWZvcm0oKTtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXMobW9kZSAgfHwgdGhpcy5fZHJhd01vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgIGZpcnN0IHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgIGNvdW50IHx8IHZlcnRleEZsb2F0MzJBcnJheS5sZW5ndGggLyB0aGlzLlNJWkVfT0ZfVkVSVEVYKTtcbn07XG5cbmtHTC5wcm90b3R5cGUuZHJhd0dlb21ldHJ5ID0gZnVuY3Rpb24oZ2VvbSxjb3VudCxvZmZzZXQpIHtnZW9tLl9kcmF3KHRoaXMsY291bnQsb2Zmc2V0KTt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBjb252ZW5pZW5jZSBmaWxsaW5nIGRlZmF1bHQgdmJvXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUuYnVmZmVyQXJyYXlzID0gZnVuY3Rpb24odmVydGV4RmxvYXQzMkFycmF5LG5vcm1hbEZsb2F0MzJBcnJheSxjb2xvckZsb2F0MzJBcnJheSx0ZXhDb29yZEZsb2F0MzJBcnJheSxnbERyYXdNb2RlKVxue1xuICAgIHZhciBuYSA9IG5vcm1hbEZsb2F0MzJBcnJheSAgID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICB0YSA9IHRleENvb3JkRmxvYXQzMkFycmF5ID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgdmFyIGFWZXJ0ZXhOb3JtYWwgICA9IHRoaXMuX2FWZXJ0ZXhOb3JtYWwsXG4gICAgICAgIGFWZXJ0ZXhUZXhDb29yZCA9IHRoaXMuX2FWZXJ0ZXhUZXhDb29yZDtcblxuICAgIHZhciBnbCAgICAgICAgICAgID0gdGhpcy5nbCxcbiAgICAgICAgZ2xBcnJheUJ1ZmZlciA9IGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgZ2xGbG9hdCAgICAgICA9IGdsLkZMT0FUO1xuXG4gICAgZ2xEcmF3TW9kZSA9IGdsRHJhd01vZGUgfHwgZ2wuRFlOQU1JQ19EUkFXO1xuXG4gICAgdmFyIHZibGVuID0gICAgICB2ZXJ0ZXhGbG9hdDMyQXJyYXkuYnl0ZUxlbmd0aCxcbiAgICAgICAgbmJsZW4gPSBuYSA/IG5vcm1hbEZsb2F0MzJBcnJheS5ieXRlTGVuZ3RoIDogMCxcbiAgICAgICAgY2JsZW4gPSAgICAgIGNvbG9yRmxvYXQzMkFycmF5LmJ5dGVMZW5ndGgsXG4gICAgICAgIHRibGVuID0gdGEgPyB0ZXhDb29yZEZsb2F0MzJBcnJheS5ieXRlTGVuZ3RoIDogMDtcblxuICAgIHZhciBvZmZzZXRWID0gMCxcbiAgICAgICAgb2Zmc2V0TiA9IG9mZnNldFYgKyB2YmxlbixcbiAgICAgICAgb2Zmc2V0QyA9IG9mZnNldE4gKyBuYmxlbixcbiAgICAgICAgb2Zmc2V0VCA9IG9mZnNldEMgKyBjYmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlciwgdmJsZW4gKyBuYmxlbiArIGNibGVuICsgdGJsZW4sIGdsRHJhd01vZGUpO1xuXG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRWLCB2ZXJ0ZXhGbG9hdDMyQXJyYXkpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgY29sb3JGbG9hdDMyQXJyYXkpO1xuXG4gICAgaWYoIW5hKXsgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhOb3JtYWwpO31cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4Tm9ybWFsKTtcbiAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLG9mZnNldE4sbm9ybWFsRmxvYXQzMkFycmF5KTtcbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihhVmVydGV4Tm9ybWFsLHRoaXMuU0laRV9PRl9OT1JNQUwsZ2xGbG9hdCxmYWxzZSwwLG9mZnNldE4pO1xuICAgIH1cblxuICAgIGlmKCF0YSl7IGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4VGV4Q29vcmQpO31cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4VGV4Q29vcmQpO1xuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0Tix0ZXhDb29yZEZsb2F0MzJBcnJheSk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYVZlcnRleFRleENvb3JkLHRoaXMuU0laRV9PRl9URVhfQ09PUkQsZ2xGbG9hdCxmYWxzZSwwLG9mZnNldFQpO1xuICAgIH1cblxuXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4UG9zaXRpb24sIHRoaXMuU0laRV9PRl9WRVJURVgsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRWKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX2FWZXJ0ZXhDb2xvciwgICAgdGhpcy5TSVpFX09GX0NPTE9SLCAgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xufTtcblxuXG5rR0wucHJvdG90eXBlLmJ1ZmZlckNvbG9ycyA9IGZ1bmN0aW9uKGNvbG9yLGJ1ZmZlcilcbntcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBpZihjb2xvci5sZW5ndGggPT0gNClcbiAgICB7XG4gICAgICAgIHdoaWxlKGkgPCBidWZmZXIubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBidWZmZXJbaV0gID1jb2xvclswXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzFdPWNvbG9yWzFdO1xuICAgICAgICAgICAgYnVmZmVyW2krMl09Y29sb3JbMl07XG4gICAgICAgICAgICBidWZmZXJbaSszXT1jb2xvclszXTtcbiAgICAgICAgICAgIGkrPTQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgaWYoY29sb3IubGVuZ3RoICE9IGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihrRXJyb3IuQ09MT1JTX0lOX1dST05HX1NJWkUpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUoaSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJ1ZmZlcltpXSAgID0gY29sb3JbaV07XG4gICAgICAgICAgICBidWZmZXJbaSsxXSA9IGNvbG9yW2krMV07XG4gICAgICAgICAgICBidWZmZXJbaSsyXSA9IGNvbG9yW2krMl07XG4gICAgICAgICAgICBidWZmZXJbaSszXSA9IGNvbG9yW2krM107XG4gICAgICAgICAgICBpKz00O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbmtHTC5wcm90b3R5cGUuYnVmZmVyVmVydGljZXMgPSBmdW5jdGlvbih2ZXJ0aWNlcyxidWZmZXIpXG57XG4gICAgaWYodmVydGljZXMubGVuZ3RoICE9IGJ1ZmZlci5sZW5ndGgpdGhyb3cgKGtFcnJvci5WRVJUSUNFU19JTl9XUk9OR19TSVpFICsgYnVmZmVyLmxlbmd0aCArICcuJyk7XG4gICAgdmFyIGkgPSAtMTt3aGlsZSgrK2kgPCBidWZmZXIubGVuZ3RoKWJ1ZmZlcltpXSA9IHZlcnRpY2VzW2ldO1xuICAgIHJldHVybiBidWZmZXI7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBDb252ZW5pZW5jZSBNZXRob2RzIGNvbG9yXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUuYW1iaWVudCAgID0gZnVuY3Rpb24oY29sb3Ipe3RoaXMuZ2wudW5pZm9ybTNmKHRoaXMuX3VBbWJpZW50LGNvbG9yWzBdLGNvbG9yWzFdLGNvbG9yWzJdKTt9O1xua0dMLnByb3RvdHlwZS5hbWJpZW50M2YgPSBmdW5jdGlvbihyLGcsYil7dGhpcy5nbC51bmlmb3JtM2YodGhpcy5fdUFtYmllbnQscixnLGIpO307XG5rR0wucHJvdG90eXBlLmFtYmllbnQxZiA9IGZ1bmN0aW9uKGspICAgIHt0aGlzLmdsLnVuaWZvcm0xZih0aGlzLl91QW1iaWVudCxrKTt9O1xuXG5rR0wucHJvdG90eXBlLmNvbG9yICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLl9iQ29sb3IgPSBDb2xvci5zZXQodGhpcy5fYkNvbG9yNGYsY29sb3IpO307XG5rR0wucHJvdG90eXBlLmNvbG9yNGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLl9iQ29sb3IgPSBDb2xvci5zZXQ0Zih0aGlzLl9iQ29sb3I0ZixyLGcsYixhKTt9O1xua0dMLnByb3RvdHlwZS5jb2xvcjNmID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5fYkNvbG9yID0gQ29sb3Iuc2V0M2YodGhpcy5fYkNvbG9yNGYscixnLGIpO307XG5rR0wucHJvdG90eXBlLmNvbG9yMmYgPSBmdW5jdGlvbihrLGEpICAgIHt0aGlzLl9iQ29sb3IgPSBDb2xvci5zZXQyZih0aGlzLl9iQ29sb3I0ZixrLGEpO307XG5rR0wucHJvdG90eXBlLmNvbG9yMWYgPSBmdW5jdGlvbihrKSAgICAgIHt0aGlzLl9iQ29sb3IgPSBDb2xvci5zZXQxZih0aGlzLl9iQ29sb3I0ZixrKTt9O1xua0dMLnByb3RvdHlwZS5jb2xvcmZ2ID0gZnVuY3Rpb24oYXJyYXkpICB7dGhpcy5fYkNvbG9yID0gYXJyYXk7fTtcblxua0dMLnByb3RvdHlwZS5jbGVhckNvbG9yID0gZnVuY3Rpb24oY29sb3Ipe3RoaXMuY2xlYXI0Zihjb2xvclswXSxjb2xvclsxXSxjb2xvclsyXSxjb2xvclszXSk7fTtcbmtHTC5wcm90b3R5cGUuY2xlYXIgICAgICA9IGZ1bmN0aW9uKCkgICAgIHt0aGlzLmNsZWFyNGYoMCwwLDAsMSk7fTtcbmtHTC5wcm90b3R5cGUuY2xlYXIzZiAgICA9IGZ1bmN0aW9uKHIsZyxiKXt0aGlzLmNsZWFyNGYocixnLGIsMSk7fTtcbmtHTC5wcm90b3R5cGUuY2xlYXIyZiAgICA9IGZ1bmN0aW9uKGssYSkgIHt0aGlzLmNsZWFyNGYoayxrLGssYSk7fTtcbmtHTC5wcm90b3R5cGUuY2xlYXIxZiAgICA9IGZ1bmN0aW9uKGspICAgIHt0aGlzLmNsZWFyNGYoayxrLGssMS4wKTt9O1xua0dMLnByb3RvdHlwZS5jbGVhcjRmICAgPSBmdW5jdGlvbihyLGcsYixhKVxue1xuICAgIHZhciBjICA9IENvbG9yLnNldDRmKHRoaXMuX2JDb2xvckJnNGYscixnLGIsYSk7XG4gICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICBnbC5jbGVhckNvbG9yKGNbMF0sY1sxXSxjWzJdLGNbM10pO1xuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcbn07XG5cblxua0dMLnByb3RvdHlwZS5nZXRDb2xvckJ1ZmZlciA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JDb2xvcjt9O1xua0dMLnByb3RvdHlwZS5nZXRDbGVhckJ1ZmZlciA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2JDb2xvckJnNGY7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWV0aG9kcyBkcmF3IHByb3BlcnRpZXNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxua0dMLnByb3RvdHlwZS5kcmF3TW9kZSA9IGZ1bmN0aW9uKG1vZGUpe3RoaXMuX2RyYXdNb2RlID0gbW9kZTt9O1xua0dMLnByb3RvdHlwZS5nZXREcmF3TW9kZSA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RyYXdNb2RlO307XG5cbmtHTC5wcm90b3R5cGUuc3BoZXJlRGV0YWlsID0gZnVuY3Rpb24oZGV0YWlsKVxue1xuICAgIGlmKGRldGFpbCA9PSB0aGlzLl9zcGhlcmVEZXRhaWxMYXN0KXJldHVybjtcbiAgICB0aGlzLl9zcGhlcmVEZXRhaWxMYXN0ID0gZGV0YWlsO1xuICAgIHRoaXMuX2dlblNwaGVyZSgpO1xufTtcblxua0dMLnByb3RvdHlwZS5jaXJjbGVEZXRhaWwgPSBmdW5jdGlvbihkZXRhaWwpXG57XG4gICAgaWYoZGV0YWlsID09IHRoaXMuX2NpcmNsZURldGFpbExhc3QgKXJldHVybjtcbiAgICB0aGlzLl9jaXJjbGVEZXRhaWxMYXN0ICA9IE1hdGgubWF4KHRoaXMuRUxMSVBTRV9ERVRBSUxfTUlOLE1hdGgubWluKGRldGFpbCx0aGlzLkVMTElQU0VfREVUQUlMX01BWCkpO1xuICAgIHRoaXMuX2NpcmxjZVZlcnRleENvdW50ID0gdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCAqIDM7XG4gICAgdGhpcy5fZ2VuQ2lyY2xlKCk7XG59O1xuXG5rR0wucHJvdG90eXBlLmxpbmVXaWR0aCA9IGZ1bmN0aW9uKHNpemUpe3RoaXMuZ2wubGluZVdpZHRoKHNpemUpO307XG5cbmtHTC5wcm90b3R5cGUudXNlQmlsbGJvYXJkID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5fYlVzZUJpbGxib2FyZGluZyA9IGJvb2w7fTtcbmtHTC5wcm90b3R5cGUucG9pbnRTaXplID0gZnVuY3Rpb24odmFsdWUpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VQb2ludFNpemUsdmFsdWUpO307XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWV0aG9kcyBkcmF3IHByaW1pdGl2ZXNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxua0dMLnByb3RvdHlwZS5wb2ludCA9IGZ1bmN0aW9uKHZlY3RvcilcbntcbiAgICBpZih2ZWN0b3IubGVuZ3RoID09IDApcmV0dXJuO1xuXG4gICAgdmFyIGJDb2xvclBvaW50ID0gdGhpcy5fYkNvbG9yUG9pbnQsXG4gICAgICAgIGJDb2xvciAgICAgID0gdGhpcy5fYkNvbG9yO1xuXG4gICAgYkNvbG9yUG9pbnRbMF0gPSBiQ29sb3JbMF07XG4gICAgYkNvbG9yUG9pbnRbMV0gPSBiQ29sb3JbMV07XG4gICAgYkNvbG9yUG9pbnRbMl0gPSBiQ29sb3JbMl07XG4gICAgYkNvbG9yUG9pbnRbM10gPSBiQ29sb3JbM107XG5cbiAgICB2YXIgZ2wgPSB0aGlzLmdsLFxuICAgICAgICBnbEFycmF5QnVmZmVyID0gZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICBnbEZsb2F0ICAgICAgID0gZ2wuRkxPQVQ7XG5cbiAgICB2YXIgdmJsZW4gPSB2ZWN0b3IuYnl0ZUxlbmd0aCxcbiAgICAgICAgY2JsZW4gPSBiQ29sb3IuYnl0ZUxlbmd0aDtcblxuICAgIHZhciBvZmZzZXRWID0gMCxcbiAgICAgICAgb2Zmc2V0QyA9IHZibGVuO1xuXG4gICAgZ2wuYnVmZmVyRGF0YShnbEFycmF5QnVmZmVyLHZibGVuICsgY2JsZW4sZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRWLCB2ZWN0b3IpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgYkNvbG9yKTtcblxuICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcblxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fYVZlcnRleFBvc2l0aW9uLCB0aGlzLlNJWkVfT0ZfVkVSVEVYLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4Q29sb3IsICAgIHRoaXMuU0laRV9PRl9DT0xPUiwgIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRDKTtcblxuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgZ2wuZHJhd0FycmF5cyh0aGlzLl9kcmF3TW9kZSwwLDEpO1xuXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleE5vcm1hbCk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcbn07XG5cbmtHTC5wcm90b3R5cGUucG9pbnRzID0gZnVuY3Rpb24odmVydGljZXMsY29sb3JzKVxue1xuICAgIGlmKHZlcnRpY2VzLmxlbmd0aCA9PSAwKXJldHVybjtcblxuICAgIGNvbG9ycyA9IGNvbG9ycyB8fCB0aGlzLmZpbGxDb2xvckJ1ZmZlcih0aGlzLl9iQ29sb3I0ZixuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzLmxlbmd0aCAvIDMgKiA0KSk7XG5cbiAgICB2YXIgZ2wgICAgICAgICAgICA9IHRoaXMuZ2wsXG4gICAgICAgIGdsQXJyYXlCdWZmZXIgPSBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBnbC5GTE9BVDtcblxuICAgIHZhciB2YmxlbiA9IHZlcnRpY2VzLmJ5dGVMZW5ndGgsXG4gICAgICAgIGNibGVuID0gY29sb3JzLmJ5dGVMZW5ndGg7XG5cbiAgICB2YXIgb2Zmc2V0ViA9IDAsXG4gICAgICAgIG9mZnNldEMgPSB2YmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlcix2YmxlbiArIGNibGVuLGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0ViwgdmVydGljZXMpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgY29sb3JzKTtcblxuICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcblxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fYVZlcnRleFBvc2l0aW9uLCB0aGlzLlNJWkVfT0ZfVkVSVEVYLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4Q29sb3IsICAgIHRoaXMuU0laRV9PRl9DT0xPUiwgIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRDKTtcblxuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgZ2wuZHJhd0FycmF5cyh0aGlzLl9kcmF3TW9kZSwwLHZlcnRpY2VzLmxlbmd0aC8zKTtcblxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCk7XG59O1xuXG5rR0wucHJvdG90eXBlLnBvaW50M2YgPSBmdW5jdGlvbih4LHkseil7dGhpcy5fYlZlcnRleFBvaW50WzBdID0geDt0aGlzLl9iVmVydGV4UG9pbnRbMV0gPSB5O3RoaXMuX2JWZXJ0ZXhQb2ludFsyXSA9IHo7dGhpcy5wb2ludCh0aGlzLl9iVmVydGV4UG9pbnQpO307XG5rR0wucHJvdG90eXBlLnBvaW50MmYgPSBmdW5jdGlvbih4LHkpICB7dGhpcy5fYlZlcnRleFBvaW50WzBdID0geDt0aGlzLl9iVmVydGV4UG9pbnRbMV0gPSB5O3RoaXMuX2JWZXJ0ZXhQb2ludFsyXSA9IDA7dGhpcy5wb2ludCh0aGlzLl9iVmVydGV4UG9pbnQpO307XG5rR0wucHJvdG90eXBlLnBvaW50diAgPSBmdW5jdGlvbihhcnIpICB7dGhpcy5fYlZlcnRleFBvaW50WzBdID0gYXJyWzBdO3RoaXMuX2JWZXJ0ZXhQb2ludFsxXSA9IGFyclsxXTt0aGlzLl9iVmVydGV4UG9pbnRbMl0gPSBhcnJbMl07dGhpcy5wb2ludCh0aGlzLl9iVmVydGV4UG9pbnQpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxua0dMLnByb3RvdHlwZS5saW5lZiA9IGZ1bmN0aW9uKHgwLHkwLHowLHgxLHkxLHoxKVxue1xuICAgIHZhciB2ID0gdGhpcy5fYlZlcnRleExpbmU7XG4gICAgdlswXSA9IHgwO3ZbMV0gPSB5MDt2WzJdID0gejA7XG4gICAgdlszXSA9IHgxO3ZbNF0gPSB5MTt2WzVdID0gejE7XG5cbiAgICB0aGlzLmRyYXdBcnJheXModixudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JMaW5lKSxudWxsLHRoaXMuX2RyYXdNb2RlKTtcbn07XG5cbmtHTC5wcm90b3R5cGUubGluZSAgPSBmdW5jdGlvbih2ZXJ0aWNlcylcbntcbiAgICBpZih2ZXJ0aWNlcy5sZW5ndGggPT0gMClyZXR1cm47XG4gICAgdGhpcy5kcmF3QXJyYXlzKHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRpY2VzLHRoaXMuX2JWZXJ0ZXhMaW5lKSxudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JMaW5lKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsIDIpO1xufTtcblxua0dMLnByb3RvdHlwZS5saW5ldiA9IGZ1bmN0aW9uKHZlcnRpY2VzKVxue1xuICAgIGlmKHZlcnRpY2VzLmxlbmd0aCA9PSAwKXJldHVybjtcbiAgICB2YXIgdiA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLFxuICAgICAgICBsID0gdmVydGljZXMubGVuZ3RoIC8gdGhpcy5TSVpFX09GX1ZFUlRFWDtcbiAgICB0aGlzLmRyYXdBcnJheXModixudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvciwgbmV3IEZsb2F0MzJBcnJheShsKnRoaXMuU0laRV9PRl9DT0xPUikpLG51bGwsdGhpcy5fZHJhd01vZGUsMCwgbCk7XG59O1xuXG5rR0wucHJvdG90eXBlLmxpbmUyZnYgPSBmdW5jdGlvbih2MCx2MSl7dGhpcy5saW5lZih2MFswXSx2MFsxXSx2MFsyXSx2MVswXSx2MVsxXSx2MVsyXSk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLnF1YWRmID0gZnVuY3Rpb24oeDAseTAsejAseDEseTEsejEseDIseTIsejIseDMseTMsejMpXG57XG4gICAgdmFyIHYgPSB0aGlzLl9iVmVydGV4UXVhZDtcblxuICAgIHZbIDBdID0geDA7dlsgMV0gPSB5MDt2WyAyXSA9IHowO1xuICAgIHZbIDNdID0geDE7dlsgNF0gPSB5MTt2WyA1XSA9IHoxO1xuICAgIHZbIDZdID0geDI7dlsgN10gPSB5Mjt2WyA4XSA9IHoyO1xuICAgIHZbIDldID0geDM7dlsxMF0gPSB5Mzt2WzExXSA9IHozO1xuXG4gICAgdGhpcy5kcmF3QXJyYXlzKHYsbnVsbCx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yUXVhZCksbnVsbCx0aGlzLl9kcmF3TW9kZSwwLDQpO1xufTtcblxua0dMLnByb3RvdHlwZS5xdWFkdiA9IGZ1bmN0aW9uKHYwLHYxLHYyLHYzKVxue1xuICAgIHRoaXMucXVhZGYodjBbMF0sdjBbMV0sdjBbMl0sdjFbMF0sdjFbMV0sdjFbMl0sdjJbMF0sdjJbMV0sdjJbMl0sdjNbMF0sdjNbMV0sdjNbMl0pO1xufTtcblxua0dMLnByb3RvdHlwZS5xdWFkID0gZnVuY3Rpb24odmVydGljZXMsbm9ybWFscyx0ZXhDb29yZHMpe3RoaXMuZHJhd0FycmF5cyh0aGlzLmJ1ZmZlckFycmF5cyh2ZXJ0aWNlcyx0aGlzLl9iVmVydGV4UXVhZCksbm9ybWFscyx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yUXVhZCksdGV4Q29vcmRzLHRoaXMuX2RyYXdNb2RlLDAsNCk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86Y2xlYW51cFxua0dMLnByb3RvdHlwZS5yZWN0ID0gZnVuY3Rpb24od2lkdGgsaGVpZ2h0KVxue1xuICAgIGhlaWdodCA9IGhlaWdodCB8fCB3aWR0aDtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMuX2JWZXJ0ZXhSZWN0O1xuXG4gICAgaWYodGhpcy5fYlVzZUJpbGxib2FyZGluZylcbiAgICB7XG4gICAgICAgIC8vMjNcbiAgICAgICAgLy8wMVxuXG4gICAgICAgIHZhciBtb2RlbFZpZXdNYXRyaXggPSB0aGlzLl9tTW9kZWxWaWV3O1xuXG4gICAgICAgIHZhciB2ZWNSaWdodFggPSBtb2RlbFZpZXdNYXRyaXhbMF0sXG4gICAgICAgICAgICB2ZWNSaWdodFkgPSBtb2RlbFZpZXdNYXRyaXhbNF0sXG4gICAgICAgICAgICB2ZWNSaWdodFogPSBtb2RlbFZpZXdNYXRyaXhbOF07XG5cbiAgICAgICAgdmFyIHZlY1VwWCA9IG1vZGVsVmlld01hdHJpeFsxXSxcbiAgICAgICAgICAgIHZlY1VwWSA9IG1vZGVsVmlld01hdHJpeFs1XSxcbiAgICAgICAgICAgIHZlY1VwWiA9IG1vZGVsVmlld01hdHJpeFs5XTtcblxuXG4gICAgICAgIHZlcnRpY2VzWyAwXSA9ICgtdmVjUmlnaHRYIC0gdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgMV0gPSAoLXZlY1JpZ2h0WSAtIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDJdID0gKC12ZWNSaWdodFogLSB2ZWNVcFopICogd2lkdGg7XG5cbiAgICAgICAgdmVydGljZXNbIDNdID0gKHZlY1JpZ2h0WCAtIHZlY1VwWCkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDRdID0gKHZlY1JpZ2h0WSAtIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDVdID0gKHZlY1JpZ2h0WiAtIHZlY1VwWikgKiB3aWR0aDtcblxuICAgICAgICB2ZXJ0aWNlc1sgNl0gPSAodmVjUmlnaHRYICsgdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgN10gPSAodmVjUmlnaHRZICsgdmVjVXBZKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgOF0gPSAodmVjUmlnaHRaICsgdmVjVXBaKSAqIHdpZHRoO1xuXG4gICAgICAgIHZlcnRpY2VzWyA5XSA9ICgtdmVjUmlnaHRYICsgdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sxMF0gPSAoLXZlY1JpZ2h0WSArIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbMTFdID0gKC12ZWNSaWdodFogKyB2ZWNVcFopICogd2lkdGg7XG5cbiAgICB9XG4gICAgZWxzZSBpZih3aWR0aCAhPSB0aGlzLl9yZWN0V2lkdGhMYXN0IHx8IGhlaWdodCAhPSB0aGlzLl9yZWN0SGVpZ2h0TGFzdClcbiAgICB7XG4gICAgICAgIHZlcnRpY2VzWzBdID0gdmVydGljZXNbMV0gPSB2ZXJ0aWNlc1syXSA9IHZlcnRpY2VzWzRdID0gdmVydGljZXNbNV0gPSB2ZXJ0aWNlc1s3XSA9IHZlcnRpY2VzWzldID0gdmVydGljZXNbMTBdID0gMDtcbiAgICAgICAgdmVydGljZXNbM10gPSB2ZXJ0aWNlc1s2XSA9IHdpZHRoOyB2ZXJ0aWNlc1s4XSA9IHZlcnRpY2VzWzExXSA9IGhlaWdodDtcblxuICAgICAgICB0aGlzLl9yZWN0V2lkdGhMYXN0ICA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9yZWN0SGVpZ2h0TGFzdCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdBcnJheXModmVydGljZXMsdGhpcy5fYk5vcm1hbFJlY3QsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclJlY3QpLHRoaXMuX2JUZXhDb29yZFF1YWREZWZhdWx0LHRoaXMuX2RyYXdNb2RlLDAsNCk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUudHJpYW5nbGUgPSBmdW5jdGlvbih2MCx2MSx2MilcbntcbiAgICB2YXIgdiA9IHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZTtcbiAgICB2WzBdID0gdjBbMF07dlsxXSA9IHYwWzFdO3ZbMl0gPSB2MFsyXTtcbiAgICB2WzNdID0gdjFbMF07dls0XSA9IHYxWzFdO3ZbNV0gPSB2MVsyXTtcbiAgICB2WzZdID0gdjJbMF07dls3XSA9IHYyWzFdO3ZbOF0gPSB2MlsyXTtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclRyaWFuZ2xlKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsMyk7XG59O1xuXG5rR0wucHJvdG90eXBlLnRyaWFuZ2xlZiA9IGZ1bmN0aW9uKHYwLHYxLHYyLHYzLHY0LHY1LHY2LHY3LHY4KVxue1xuICAgIHZhciB2ID0gdGhpcy5fYlZlcnRleFRyaWFuZ2xlO1xuICAgIHZbMF0gPSB2MDt2WzFdID0gdjE7dlsyXSA9IHYyO1xuICAgIHZbM10gPSB2Mzt2WzRdID0gdjQ7dls1XSA9IHY1O1xuICAgIHZbNl0gPSB2Njt2WzddID0gdjc7dls4XSA9IHY4O1xuXG4gICAgdGhpcy5kcmF3QXJyYXlzKHYsbnVsbCx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yVHJpYW5nbGUpLG51bGwsdGhpcy5fZHJhd01vZGUsMCwzKTtcbn07XG5cbmtHTC5wcm90b3R5cGUudHJpYW5nbGV2ID0gZnVuY3Rpb24odmVydGljZXMsbm9ybWFscyx0ZXhDb29yZHMpe3RoaXMuZHJhd0FycmF5cyh0aGlzLmJ1ZmZlckFycmF5cyh2ZXJ0aWNlcyx0aGlzLl9iVmVydGV4VHJpYW5nbGUpLG5vcm1hbHMsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclRyaWFuZ2xlKSx0ZXhDb29yZHMsdGhpcy5fZHJhd01vZGUsMCwzKTt9XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxua0dMLnByb3RvdHlwZS5jaXJjbGUzZiA9IGZ1bmN0aW9uKHgseSx6LHJhZGl1cylcbntcbiAgICByYWRpdXMgPSByYWRpdXMgfHwgMC41O1xuXG4gICAgdGhpcy5wdXNoTWF0cml4KCk7XG4gICAgdGhpcy50cmFuc2xhdGUzZih4LHkseik7XG4gICAgdGhpcy5zY2FsZTFmKHJhZGl1cyk7XG4gICAgdGhpcy5kcmF3QXJyYXlzKHRoaXMuX2JWZXJ0ZXhDaXJjbGUsdGhpcy5fYk5vcm1hbENpcmNsZSx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yQ2lyY2xlKSx0aGlzLl9iVGV4Q29vcmRDaXJjbGUsdGhpcy5nZXREcmF3TW9kZSgpLDAsdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCk7XG4gICAgdGhpcy5wb3BNYXRyaXgoKTtcbn07XG5cbmtHTC5wcm90b3R5cGUuY2lybGNlMmYgPSBmdW5jdGlvbih4LHkscmFkaXVzKXt0aGlzLmNpcmNsZTNmKHgsMCx5LHJhZGl1cyk7fTtcbmtHTC5wcm90b3R5cGUuY2lyY2xlID0gZnVuY3Rpb24ocmFkaXVzKXt0aGlzLmNpcmNsZTNmKDAsMCwwLHJhZGl1cyl9O1xua0dMLnByb3RvdHlwZS5jaXJjbGV2ID0gZnVuY3Rpb24odixyYWRpdXMpe3RoaXMuY2lyY2xlM2YodlswXSx2WzFdLHZbMl0scmFkaXVzKTt9O1xua0dMLnByb3RvdHlwZS5jaXJjbGVzID0gZnVuY3Rpb24oY2VudGVycyxyYWRpaSl7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gR2VvbWV0cnkgZ2VuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmtHTC5wcm90b3R5cGUuX2dlblNwaGVyZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLl9zcGhlcmVEZXRhaWxMYXN0O1xuXG4gICAgdmFyIHZlcnRpY2VzICA9IFtdLFxuICAgICAgICBub3JtYWxzICAgPSBbXSxcbiAgICAgICAgdGV4Q29vcmRzID0gW10sXG4gICAgICAgIGluZGljZXMgICA9IFtdO1xuXG4gICAgdmFyIHRoZXRhLHRoZXRhU2luLHRoZXRhQ29zO1xuICAgIHZhciBwaGkscGhpU2luLHBoaUNvcztcblxuICAgIHZhciB4LHksejtcbiAgICB2YXIgdSx2O1xuXG4gICAgdmFyIGkgPSAtMSxqO1xuXG4gICAgdmFyIGluZGV4LFxuICAgICAgICBpbmRleFZlcnRpY2VzLFxuICAgICAgICBpbmRleE5vcm1hbHMsXG4gICAgICAgIGluZGV4VGV4Q29vcmRzO1xuXG4gICAgd2hpbGUoKytpIDw9IHNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgdGhldGEgPSBpICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICB0aGV0YVNpbiA9IE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgdGhldGFDb3MgPSBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPD0gc2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBoaSAgICA9IGogKiAyICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgcGhpU2luID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgICAgICAgIHBoaUNvcyA9IE1hdGguY29zKHBoaSk7XG5cbiAgICAgICAgICAgIHggPSBwaGlDb3MgKiB0aGV0YVNpbjtcbiAgICAgICAgICAgIHkgPSB0aGV0YUNvcztcbiAgICAgICAgICAgIHogPSBwaGlTaW4gKiB0aGV0YVNpbjtcblxuICAgICAgICAgICAgaW5kZXggICAgICAgICAgPSBqICsgc2VnbWVudHMgKiBpO1xuICAgICAgICAgICAgaW5kZXhWZXJ0aWNlcyAgPSBpbmRleE5vcm1hbHMgPSBpbmRleCAqIDM7XG4gICAgICAgICAgICBpbmRleFRleENvb3JkcyA9IGluZGV4ICogMjtcblxuICAgICAgICAgICAgbm9ybWFscy5wdXNoKHgseSx6KTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goeCx5LHopO1xuXG4gICAgICAgICAgICB1ID0gMSAtIGogLyBzZWdtZW50cztcbiAgICAgICAgICAgIHYgPSAxIC0gaSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICB0ZXhDb29yZHMucHVzaCh1LHYpO1xuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgdmFyIGluZGV4MCxpbmRleDEsaW5kZXgyO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBzZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXgwID0gaiArIGkgKiAoc2VnbWVudHMgKyAxKTtcbiAgICAgICAgICAgIGluZGV4MSA9IGluZGV4MCArIHNlZ21lbnRzICsgMTtcbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4MCArIDE7XG5cbiAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRleDAsaW5kZXgxLGluZGV4Mik7XG5cbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4MCArIDE7XG4gICAgICAgICAgICBpbmRleDAgPSBpbmRleDE7XG4gICAgICAgICAgICBpbmRleDEgPSBpbmRleDAgKyAxO1xuXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kZXgwLGluZGV4MSxpbmRleDIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fYlZlcnRleFNwaGVyZSAgICA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUgICAgPSBuZXcgRmxvYXQzMkFycmF5KG5vcm1hbHMpO1xuICAgIHRoaXMuX2JDb2xvclNwaGVyZSAgICAgPSBuZXcgRmxvYXQzMkFycmF5KHNlZ21lbnRzICogc2VnbWVudHMgKiA0KTtcbiAgICB0aGlzLl9iVGV4Q29vcmRzU3BoZXJlID0gbmV3IEZsb2F0MzJBcnJheShpbmRpY2VzKTtcbiAgICB0aGlzLl9iSW5kZXhTcGhlcmUgICAgID0gbmV3IFVpbnQxNkFycmF5KGluZGljZXMpO1xufTtcblxua0dMLnByb3RvdHlwZS5fZ2VuQ2lyY2xlID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBjeCA9IDAsXG4gICAgICAgIGN5ID0gMDtcblxuICAgIHZhciBkID0gdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCxcbiAgICAgICAgdiA9IHRoaXMuX2JWZXJ0ZXhDaXJjbGUsXG4gICAgICAgIGwgPSBkICogMztcblxuICAgIHZhciBpID0gMDtcblxuICAgIHZhciB0aGV0YSA9IDIgKiBNYXRoLlBJIC8gZCxcbiAgICAgICAgYyA9IE1hdGguY29zKHRoZXRhKSxcbiAgICAgICAgcyA9IE1hdGguc2luKHRoZXRhKSxcbiAgICAgICAgdDtcblxuICAgIHZhciBveCA9IDEsXG4gICAgICAgIG95ID0gMDtcblxuICAgIHdoaWxlKGkgPCBsKVxuICAgIHtcbiAgICAgICAgdltpICBdID0gb3ggKyBjeDtcbiAgICAgICAgdltpKzFdID0gMDtcbiAgICAgICAgdltpKzJdID0gb3kgKyBjeTtcblxuICAgICAgICB0ICA9IG94O1xuICAgICAgICBveCA9IGMgKiBveCAtIHMgKiBveTtcbiAgICAgICAgb3kgPSBzICogdCAgKyBjICogb3k7XG5cbiAgICAgICAgaSs9MztcbiAgICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBkZWZhdWx0IHZiby9pYm8gLyBzaGFkZXIgYXR0cmlidXRlc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLmdldERlZmF1bHRWQk8gID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGVmYXVsdFZCTzt9O1xua0dMLnByb3RvdHlwZS5nZXREZWZhdWx0SUJPICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RlZmF1bHRJQk87fTtcbmtHTC5wcm90b3R5cGUuYmluZERlZmF1bHRWQk8gPSBmdW5jdGlvbigpe3RoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUix0aGlzLl9kZWZhdWx0VkJPKTt9O1xua0dMLnByb3RvdHlwZS5iaW5kRGVmYXVsdElCTyA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsdGhpcy5fZGVmYXVsdElCTyk7fTtcblxua0dMLnByb3RvdHlwZS5nZXREZWZhdWx0VmVydGV4QXR0cmliICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hVmVydGV4UG9zaXRpb247fTtcbmtHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdE5vcm1hbEF0dHJpYiAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYVZlcnRleE5vcm1hbDt9O1xua0dMLnByb3RvdHlwZS5nZXREZWZhdWx0Q29sb3JBdHRyaWIgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hVmVydGV4Q29sb3I7fTtcbmtHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdFRleENvb3JkQXR0cmliID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYVZlcnRleFRleENvb3JkO307XG5cbmtHTC5wcm90b3R5cGUuZW5hYmxlRGVmYXVsdFZlcnRleEF0dHJpYkFycmF5ICAgICA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4UG9zaXRpb24pO307XG5rR0wucHJvdG90eXBlLmVuYWJsZURlZmF1bHROb3JtYWxBdHRyaWJBcnJheSAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleE5vcm1hbCk7fTtcbmtHTC5wcm90b3R5cGUuZW5hYmxlRGVmYXVsdENvbG9yQXR0cmliQXJyYXkgICAgICA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Q29sb3IpO307XG5rR0wucHJvdG90eXBlLmVuYWJsZURlZmF1bHRUZXhDb29yZHNBdHRyaWJBcnJheSAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTt9O1xuXG5rR0wucHJvdG90eXBlLmRpc2FibGVEZWZhdWx0VmVydGV4QXR0cmliQXJyYXkgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhQb3NpdGlvbik7fTtcbmtHTC5wcm90b3R5cGUuZGlzYWJsZURlZmF1bHROb3JtYWxBdHRyaWJBcnJheSAgICA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleE5vcm1hbCk7fTtcbmtHTC5wcm90b3R5cGUuZGlzYWJsZURlZmF1bHRDb2xvckF0dHJpYkFycmF5ICAgICA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleENvbG9yKTt9O1xua0dMLnByb3RvdHlwZS5kaXNhYmxlRGVmYXVsdFRleENvb3Jkc0F0dHJpYkFycmF5ID0gZnVuY3Rpb24oKXt0aGlzLmdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4VGV4Q29vcmQpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGNvbnZlbmllbmNlIGRyYXdcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLy9UT0RPOnJlbW92ZVxuXG5rR0wucHJvdG90eXBlLmJveCA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodCxkZXB0aClcbntcbiAgICB0aGlzLnB1c2hNYXRyaXgoKTtcbiAgICB0aGlzLnNjYWxlM2Yod2lkdGgsaGVpZ2h0LGRlcHRoKTtcbiAgICB0aGlzLmRyYXdFbGVtZW50cyh0aGlzLl9iVmVydGV4Q3ViZSx0aGlzLl9iTm9ybWFsQ3ViZSx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yQ3ViZSksdGhpcy5fYlRleENvb3JkQ3ViZSx0aGlzLl9iSW5kZXhDdWJlLHRoaXMuX2RyYXdNb2RlKTtcbiAgICB0aGlzLnBvcE1hdHJpeCgpO1xufTtcblxua0dMLnByb3RvdHlwZS5jdWJlID0gZnVuY3Rpb24oc2l6ZSlcbntcbiAgICB0aGlzLnB1c2hNYXRyaXgoKTtcbiAgICB0aGlzLnNjYWxlM2Yoc2l6ZSxzaXplLHNpemUpO1xuICAgIHRoaXMuZHJhd0VsZW1lbnRzKHRoaXMuX2JWZXJ0ZXhDdWJlLHRoaXMuX2JOb3JtYWxDdWJlLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JDdWJlKSx0aGlzLl9iVGV4Q29vcmRDdWJlLHRoaXMuX2JJbmRleEN1YmUsdGhpcy5fZHJhd01vZGUpO1xuICAgIHRoaXMucG9wTWF0cml4KCk7XG59O1xuXG5rR0wucHJvdG90eXBlLnNwaGVyZSA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLmRyYXdFbGVtZW50cyh0aGlzLl9iVmVydGV4U3BoZXJlLHRoaXMuX2JOb3JtYWxTcGhlcmUsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclNwaGVyZSksdGhpcy5fYlRleENvb3Jkc1NwaGVyZSx0aGlzLl9iSW5kZXhTcGhlcmUsdGhpcy5fZHJhd01vZGUpO1xufTtcblxuLy9UT0RPOiByZW1vdmUgISEhISEhISEhISEhISEhXG5rR0wucHJvdG90eXBlLmxpbmVCb3ggPSBmdW5jdGlvbih2MCx2MSl7dGhpcy5saW5lQm94Zih2MFswXSx2MFsxXSx2MFsyXSx2MVswXSx2MVsxXSx2MVsyXSk7fTtcblxua0dMLnByb3RvdHlwZS5saW5lQm94ZiA9IGZ1bmN0aW9uKHgwLHkwLHowLHgxLHkxLHoxKVxue1xuXG5cbiAgICB2YXIgcDAgPSB0aGlzLl9iUG9pbnQwLFxuICAgICAgICBwMSA9IHRoaXMuX2JQb2ludDEsXG4gICAgICAgIHVwID0gdGhpcy5fYXhpc1k7XG5cbiAgICBWZWMzLnNldDNmKHAwLHgwLHkwLHowKTtcbiAgICBWZWMzLnNldDNmKHAxLHgxLHkxLHoxKTtcblxuICAgIHZhciBsZW4gPSBWZWMzLmRpc3RhbmNlKHAwLHAxKSxcbiAgICAgICAgbWlkID0gVmVjMy5zY2FsZShWZWMzLmFkZGVkKHAwLHAxKSwwLjUpLFxuICAgICAgICBkaXIgPSBWZWMzLm5vcm1hbGl6ZShWZWMzLnN1YmJlZChwMSxwMCkpLFxuICAgICAgICBjICAgPSBWZWMzLmRvdChkaXIsdXApO1xuXG4gICAgdmFyIGFuZ2xlID0gTWF0aC5hY29zKGMpLFxuICAgICAgICBheGlzICA9IFZlYzMubm9ybWFsaXplKFZlYzMuY3Jvc3ModXAsZGlyKSk7XG5cbiAgICB0aGlzLnB1c2hNYXRyaXgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZShtaWQpO1xuICAgIHRoaXMucm90YXRlQXhpcyhhbmdsZSxheGlzKTtcbiAgICB0aGlzLmJveCh0aGlzLl9saW5lQm94V2lkdGgsbGVuLHRoaXMuX2xpbmVCb3hIZWlnaHQpO1xuICAgIHRoaXMucG9wTWF0cml4KCk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBjb252ZW5pZW5jZSBiaW5kaW5ncyBnbFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5rR0wucHJvdG90eXBlLmVuYWJsZSAgICAgICAgICAgICAgICA9IGZ1bmN0aW9uKGlkKXt0aGlzLmdsLmVuYWJsZShpZCk7fTtcbmtHTC5wcm90b3R5cGUuZGlzYWJsZSAgICAgICAgICAgICAgID0gZnVuY3Rpb24oaWQpe3RoaXMuZ2wuZGlzYWJsZShpZCk7fTtcblxua0dMLnByb3RvdHlwZS5ibGVuZENvbG9yICAgICAgICAgICAgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLmdsLmJsZW5kQ29sb3IocixnLGIsYSk7fTtcbmtHTC5wcm90b3R5cGUuYmxlbmRFcXVhdGlvbiAgICAgICAgID0gZnVuY3Rpb24obW9kZSl7dGhpcy5nbC5ibGVuZEVxdWF0aW9uKG1vZGUpO307XG5rR0wucHJvdG90eXBlLmJsZW5kRXF1YXRpb25TZXBhcmF0ZSA9IGZ1bmN0aW9uKHNmYWN0b3IsZGZhY3Rvcil7dGhpcy5nbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoc2ZhY3RvcixkZmFjdG9yKTt9O1xua0dMLnByb3RvdHlwZS5ibGVuZEZ1bmMgICAgICAgICAgICAgPSBmdW5jdGlvbihzZmFjdG9yLGRmYWN0b3Ipe3RoaXMuZ2wuYmxlbmRGdW5jKHNmYWN0b3IsZGZhY3Rvcik7fTtcbmtHTC5wcm90b3R5cGUuYmxlbmRGdW5jU2VwYXJhdGUgICAgID0gZnVuY3Rpb24oc3JjUkdCLGRzdFJHQixzcmNBbHBoYSxkc3RBbHBoYSl7dGhpcy5nbC5ibGVuZEZ1bmNTZXBhcmF0ZShzcmNSR0IsZHN0UkdCLHNyY0FscGhhLGRzdEFscGhhKTt9O1xua0dMLnByb3RvdHlwZS5kZXB0aEZ1bmMgICAgICAgICAgICAgPSBmdW5jdGlvbihmdW5jKXt0aGlzLmdsLmRlcHRoRnVuYyhmdW5jKTt9O1xua0dMLnByb3RvdHlwZS5zYW1wbGVDb3ZlcmFnZSAgICAgICAgPSBmdW5jdGlvbih2YWx1ZSxpbnZlcnQpe3RoaXMuZ2wuc2FtcGxlQ292ZXJhZ2UodmFsdWUsaW52ZXJ0KTt9O1xua0dMLnByb3RvdHlwZS5zdGVuY2lsRnVuYyAgICAgICAgICAgPSBmdW5jdGlvbihmdW5jLHJlZixtYXNrKXt0aGlzLmdsLnN0ZW5jaWxGdW5jKGZ1bmMscmVmLG1hc2spO307XG5rR0wucHJvdG90eXBlLnN0ZW5jaWxGdW5jU2VwYXJhdGUgICA9IGZ1bmN0aW9uKGZhY2UsZnVuYyxyZWYsbWFzayl7dGhpcy5nbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGZhY2UsZnVuYyxyZWYsbWFzayk7fTtcbmtHTC5wcm90b3R5cGUuc3RlbmNpbE9wICAgICAgICAgICAgID0gZnVuY3Rpb24oZmFpbCx6ZmFpbCx6cGFzcyl7dGhpcy5nbC5zdGVuY2lsT3AoZmFpbCx6ZmFpbCx6cGFzcyk7fTtcbmtHTC5wcm90b3R5cGUuc3RlbmNpbE9wU2VwYXJhdGUgICAgID0gZnVuY3Rpb24oZmFjZSxmYWlsLHpmYWlsLHpwYXNzKXt0aGlzLmdsLnN0ZW5jaWxPcFNlcGFyYXRlKGZhY2UsZmFpbCx6ZmFpbCx6cGFzcyk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gV29ybGQgLT4gU2NyZWVuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vVE9ETzogRml4IG1lXG5rR0wucHJvdG90eXBlLmdldFNjcmVlbkNvb3JkM2YgPSBmdW5jdGlvbih4LHkseilcbntcbiAgICB2YXIgbXBtID0gTWF0NDQubXVsdCh0aGlzLl9jYW1lcmEucHJvamVjdGlvbk1hdHJpeCx0aGlzLl9tTW9kZWxWaWV3KTtcbiAgICB2YXIgcDNkID0gTWF0NDQubXVsdFZlYzMobXBtLFZlYzMubWFrZSh4LHkseikpO1xuXG4gICAgdmFyIGJzYyA9IHRoaXMuX2JTY3JlZW5Db29yZHM7XG4gICAgYnNjWzBdID0gKCgocDNkWzBdICsgMSkgKiAwLjUpICogd2luZG93LmlubmVyV2lkdGgpO1xuICAgIGJzY1sxXSA9ICgoKDEgLSBwM2RbMV0pICogMC41KSAqIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICByZXR1cm4gYnNjO1xufTtcblxua0dMLnByb3RvdHlwZS5nZXRTY3JlZW5Db29yZCA9IGZ1bmN0aW9uKHYpXG57XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2NyZWVuQ29vcmQzZih2WzBdLHZbMV0sdlsxXSk7XG59O1xuXG5cblxuXG5rR0wucHJvdG90eXBlLmdldE1vZGVsVmlld01hdHJpeCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tTW9kZWxWaWV3O307XG5rR0wucHJvdG90eXBlLmdldFByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9jYW1lcmEucHJvamVjdGlvbk1hdHJpeDt9O1xuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGtHTDsiLCJ2YXIgVmVjMyAgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBDb2xvciA9IHJlcXVpcmUoJy4uLy4uL3V0aWwvZ2xrQ29sb3InKTtcblxudmFyIGtHTFV0aWwgPSB7fTtcblxua0dMVXRpbC5fX2dyaWRTaXplTGFzdCA9IC0xO1xua0dMVXRpbC5fX2dyaWRVbml0TGFzdCA9IC0xO1xuXG5cblxua0dMVXRpbC5kcmF3R3JpZCA9IGZ1bmN0aW9uKGtnbCxzaXplLHVuaXQpXG57XG4gICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgIHZhciBpICA9IC0xLFxuICAgICAgICBzaCA9IHNpemUgKiAwLjUgKiB1bml0O1xuXG4gICAgdmFyIHVpO1xuXG4gICAgd2hpbGUoKytpIDwgc2l6ZSArIDEpXG4gICAge1xuICAgICAgICB1aSA9IHVuaXQgKiBpO1xuXG4gICAgICAgIGtnbC5saW5lZigtc2gsMCwtc2ggKyB1aSxzaCwwLC1zaCt1aSk7XG4gICAgICAgIGtnbC5saW5lZigtc2grdWksMCwtc2gsLXNoK3VpLDAsc2gpO1xuICAgIH1cbn07XG5cbmtHTFV0aWwuZHJhd0F4ZXMgPSBmdW5jdGlvbihrZ2wsdW5pdClcbntcbiAgICBrZ2wuY29sb3IzZigxLDAsMCk7XG4gICAga2dsLmxpbmVmKDAsMCwwLHVuaXQsMCwwKTtcbiAgICBrZ2wuY29sb3IzZigwLDEsMCk7XG4gICAga2dsLmxpbmVmKDAsMCwwLDAsdW5pdCwwKTtcbiAgICBrZ2wuY29sb3IzZigwLDAsMSk7XG4gICAga2dsLmxpbmVmKDAsMCwwLDAsMCx1bml0KTtcbn07XG5cbmtHTFV0aWwuZHJhd0dyaWRDdWJlID0gZnVuY3Rpb24oa2dsLHNpemUsdW5pdClcbntcbiAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgdmFyIHNoICA9IHNpemUgKiAwLjUgKiB1bml0LFxuICAgICAgICBwaWggPSBNYXRoLlBJICogMC41O1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2YoMCwtc2gsMCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZigwLHNoLDApO1xuICAgIGtnbC5yb3RhdGUzZigwLHBpaCwwKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKDAsMCwtc2gpO1xuICAgIGtnbC5yb3RhdGUzZihwaWgsMCwwKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKDAsMCxzaCk7XG4gICAga2dsLnJvdGF0ZTNmKHBpaCwwLDApO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2Yoc2gsMCwwKTtcbiAgICBrZ2wucm90YXRlM2YocGloLDAscGloKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKC1zaCwwLDApO1xuICAgIGtnbC5yb3RhdGUzZihwaWgsMCxwaWgpO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG59O1xuXG5cbmtHTFV0aWwucHlyYW1pZCA9IGZ1bmN0aW9uKGtnbCxzaXplKVxue1xuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnNjYWxlM2Yoc2l6ZSxzaXplLHNpemUpO1xuICAgIGtnbC5kcmF3RWxlbWVudHModGhpcy5fX2JWZXJ0ZXhQeXJhbWlkLHRoaXMuX19iTm9ybWFsUHlyYW1pZCxrZ2wuYnVmZmVyQ29sb3JzKGtnbC5fYkNvbG9yLHRoaXMuX19iQ29sb3JQeXJhbWlkKSxudWxsLHRoaXMuX19iSW5kZXhQeXJhbWlkLGtnbC5fZHJhd01vZGUpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcbn07XG5cblxuXG5rR0xVdGlsLm9jdGFoZWRyb24gPSBmdW5jdGlvbihrZ2wsc2l6ZSlcbntcbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC5zY2FsZTNmKHNpemUsc2l6ZSxzaXplKTtcbiAgICBrZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4T2N0YWhlZHJvbiwgdGhpcy5fX2JOb3JtYWxPY3RhaGVkcm9uLGtnbC5idWZmZXJDb2xvcnMoa2dsLl9iQ29sb3IsIHRoaXMuX19iQ29sb3JPY3RhaGVkcm9uKSxudWxsLCB0aGlzLl9fYkluZGV4T2N0YWhlZHJvbixrZ2wuX2RyYXdNb2RlKTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG59O1xuXG4vKlxudmFyIGtHTFV0aWwgPVxue1xuXG4gICAgZHJhd0dyaWQgOiBmdW5jdGlvbihnbCxzaXplLHVuaXQpXG4gICAge1xuICAgICAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgICAgIHZhciBpICA9IC0xLFxuICAgICAgICAgICAgc2ggPSBzaXplICogMC41ICogdW5pdDtcblxuICAgICAgICB2YXIgdWk7XG5cbiAgICAgICAgd2hpbGUoKytpIDwgc2l6ZSArIDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVpID0gdW5pdCAqIGk7XG5cbiAgICAgICAgICAgIGdsLmxpbmVmKC1zaCwwLC1zaCArIHVpLHNoLDAsLXNoK3VpKTtcbiAgICAgICAgICAgIGdsLmxpbmVmKC1zaCt1aSwwLC1zaCwtc2grdWksMCxzaCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBkcmF3R3JpZEN1YmUgOiBmdW5jdGlvbihnbCxzaXplLHVuaXQpXG4gICAge1xuICAgICAgICB1bml0ID0gdW5pdCB8fCAxO1xuXG4gICAgICAgIHZhciBzaCAgPSBzaXplICogMC41ICogdW5pdCxcbiAgICAgICAgICAgIHBpaCA9IE1hdGguUEkgKiAwLjU7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZigwLC1zaCwwKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKDAsc2gsMCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKDAscGloLDApO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoMCwwLC1zaCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKHBpaCwwLDApO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoMCwwLHNoKTtcbiAgICAgICAgZ2wucm90YXRlM2YocGloLDAsMCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZihzaCwwLDApO1xuICAgICAgICBnbC5yb3RhdGUzZihwaWgsMCxwaWgpO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoLXNoLDAsMCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKHBpaCwwLHBpaCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICB9LFxuXG5cbiAgICBkcmF3QXhlcyA6IGZ1bmN0aW9uKGdsLHVuaXQpXG4gICAge1xuICAgICAgICBnbC5jb2xvcjNmKDEsMCwwKTtcbiAgICAgICAgZ2wubGluZWYoMCwwLDAsdW5pdCwwLDApO1xuICAgICAgICBnbC5jb2xvcjNmKDAsMSwwKTtcbiAgICAgICAgZ2wubGluZWYoMCwwLDAsMCx1bml0LDApO1xuICAgICAgICBnbC5jb2xvcjNmKDAsMCwxKTtcbiAgICAgICAgZ2wubGluZWYoMCwwLDAsMCwwLHVuaXQpO1xuICAgIH0sXG5cblxuICAgIC8vdGVtcFxuICAgIGRyYXdWZWN0b3JmIDogZnVuY3Rpb24oZ2wseDAseTAsejAseDEseTEsejEpXG4gICAge1xuICAgICAgIFxuXG4gICAgICAgIHZhciBwMCA9IGdsLl9iUG9pbnQwLFxuICAgICAgICAgICAgcDEgPSBnbC5fYlBvaW50MSxcbiAgICAgICAgICAgIHVwID0gZ2wuX2F4aXNZO1xuXG4gICAgICAgIFZlYzMuc2V0M2YocDAseDAseTAsejApO1xuICAgICAgICBWZWMzLnNldDNmKHAxLHgxLHkxLHoxKTtcblxuICAgICAgICB2YXIgcHcgPSBnbC5fbGluZUJveFdpZHRoLFxuICAgICAgICAgICAgcGggPSBnbC5fbGluZUJveEhlaWdodCxcbiAgICAgICAgICAgIHBkID0gZ2wuX2RyYXdNb2RlO1xuXG4gICAgICAgIHZhciBsZW4gPSBWZWMzLmRpc3RhbmNlKHAwLHAxKSxcbiAgICAgICAgICAgIG1pZCA9IFZlYzMuc2NhbGUoVmVjMy5hZGRlZChwMCxwMSksMC41KSxcbiAgICAgICAgICAgIGRpciA9IFZlYzMubm9ybWFsaXplKFZlYzMuc3ViYmVkKHAxLHAwKSksXG4gICAgICAgICAgICBjICAgPSBWZWMzLmRvdChkaXIsdXApO1xuXG4gICAgICAgIHZhciBhbmdsZSA9IE1hdGguYWNvcyhjKSxcbiAgICAgICAgICAgIGF4aXMgID0gVmVjMy5ub3JtYWxpemUoVmVjMy5jcm9zcyh1cCxkaXIpKTtcblxuXG4gICAgICAgIGdsLmRyYXdNb2RlKGdsLkxJTkVTKTtcblxuICAgICAgICBnbC5saW5lZih4MCx5MCx6MCx4MSx5MSx6MSk7XG5cbiAgICAgICAgZ2wuZHJhd01vZGUoZ2wuVFJJQU5HTEVTKTtcbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUocDEpO1xuICAgICAgICBnbC5yb3RhdGVBeGlzKGFuZ2xlLGF4aXMpO1xuICAgICAgICB0aGlzLnB5cmFtaWQoZ2wsMC4wMjUpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5saW5lU2l6ZShwdyxwaCk7XG4gICAgICAgIGdsLmRyYXdNb2RlKHBkKTtcbiAgICB9LFxuXG4gICAgZHJhd1ZlY3RvciA6IGZ1bmN0aW9uKGdsLHYwLHYxKVxuICAgIHtcbiAgICAgICB0aGlzLmRyYXdWZWN0b3JmKGdsLHYwWzBdLHYwWzFdLHYwWzJdLHYxWzBdLHYxWzFdLHYxWzJdKTtcbiAgICB9LFxuXG4gICAgcHlyYW1pZCA6IGZ1bmN0aW9uKGdsLHNpemUpXG4gICAge1xuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnNjYWxlM2Yoc2l6ZSxzaXplLHNpemUpO1xuICAgICAgICBnbC5kcmF3RWxlbWVudHModGhpcy5fX2JWZXJ0ZXhQeXJhbWlkLHRoaXMuX19iTm9ybWFsUHlyYW1pZCxnbC5maWxsQ29sb3JCdWZmZXIoZ2wuX2JDb2xvcix0aGlzLl9fYkNvbG9yUHlyYW1pZCksbnVsbCx0aGlzLl9fYkluZGV4UHlyYW1pZCxnbC5fZHJhd01vZGUpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcbiAgICB9LFxuXG5cblxuICAgIG9jdGFoZWRyb24gOiBmdW5jdGlvbihnbCxzaXplKVxuICAgIHtcbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC5zY2FsZTNmKHNpemUsc2l6ZSxzaXplKTtcbiAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4T2N0YWhlZHJvbiwgdGhpcy5fX2JOb3JtYWxPY3RhaGVkcm9uLGdsLmZpbGxDb2xvckJ1ZmZlcihnbC5fYkNvbG9yLCB0aGlzLl9fYkNvbG9yT2N0YWhlZHJvbiksbnVsbCwgdGhpcy5fX2JJbmRleE9jdGFoZWRyb24sZ2wuX2RyYXdNb2RlKTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG4gICAgfVxufTtcbiovXG5cbmtHTFV0aWwuX19iVmVydGV4T2N0YWhlZHJvbiA9IG5ldyBGbG9hdDMyQXJyYXkoWy0wLjcwNywwLDAsIDAsMC43MDcsMCwgMCwwLC0wLjcwNywgMCwwLDAuNzA3LCAwLC0wLjcwNywwLCAwLjcwNywwLDBdKTtcbmtHTFV0aWwuX19iTm9ybWFsT2N0YWhlZHJvbiA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTldKTtcbmtHTFV0aWwuX19iQ29sb3JPY3RhaGVkcm9uICA9IG5ldyBGbG9hdDMyQXJyYXkoa0dMVXRpbC5fX2JWZXJ0ZXhPY3RhaGVkcm9uLmxlbmd0aCAvIFZlYzMuU0laRSAqIENvbG9yLlNJWkUpO1xua0dMVXRpbC5fX2JJbmRleE9jdGFoZWRyb24gID0gbmV3IFVpbnQxNkFycmF5KFszLDQsNSwzLDUsMSwzLDEsMCwzLDAsNCw0LDAsMiw0LDIsNSwyLDAsMSw1LDIsMV0pO1xua0dMVXRpbC5fX2JWZXJ0ZXhQeXJhbWlkICAgID0gbmV3IEZsb2F0MzJBcnJheShbIDAuMCwxLjAsMC4wLC0xLjAsLTEuMCwxLjAsMS4wLC0xLjAsMS4wLDAuMCwxLjAsMC4wLDEuMCwtMS4wLDEuMCwxLjAsLTEuMCwtMS4wLDAuMCwxLjAsMC4wLDEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLC0xLjAsMC4wLDEuMCwwLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLDEuMCwtMS4wLC0xLjAsMS4wLDEuMCwtMS4wLDEuMCwxLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wXSk7XG5rR0xVdGlsLl9fYk5vcm1hbFB5cmFtaWQgICAgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAtMC40NDcyMTM1OTAxNDUxMTExLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAtMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAuODk0NDI3MTgwMjkwMjIyMiwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMC44OTQ0MjcxODAyOTAyMjIyLCAwLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLCAwLCAwLCAwLCAtMSwgMCwgMCwgMCwgMCwgMCwgMSwgMF0pO1xua0dMVXRpbC5fX2JDb2xvclB5cmFtaWQgICAgID0gbmV3IEZsb2F0MzJBcnJheShrR0xVdGlsLl9fYlZlcnRleFB5cmFtaWQubGVuZ3RoIC8gVmVjMy5TSVpFICogQ29sb3IuU0laRSk7XG5rR0xVdGlsLl9fYkluZGV4UHlyYW1pZCAgICAgPSBuZXcgVWludDE2QXJyYXkoWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwxMiwxMywxNCwxMiwxNSwxNF0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtHTFV0aWw7IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIG1ha2UgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLDEsMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsMCwxXSk7XG4gICAgfSxcblxuICAgIHRyYW5zcG9zZSA6IGZ1bmN0aW9uKG91dCxhKVxuICAgIHtcblxuICAgICAgICBpZiAob3V0ID09PSBhKSB7XG4gICAgICAgICAgICB2YXIgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTEyID0gYVs1XTtcbiAgICAgICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgICAgICBvdXRbMl0gPSBhWzZdO1xuICAgICAgICAgICAgb3V0WzNdID0gYTAxO1xuICAgICAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgICAgIG91dFs2XSA9IGEwMjtcbiAgICAgICAgICAgIG91dFs3XSA9IGExMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFswXSA9IGFbMF07XG4gICAgICAgICAgICBvdXRbMV0gPSBhWzNdO1xuICAgICAgICAgICAgb3V0WzJdID0gYVs2XTtcbiAgICAgICAgICAgIG91dFszXSA9IGFbMV07XG4gICAgICAgICAgICBvdXRbNF0gPSBhWzRdO1xuICAgICAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgICAgIG91dFs2XSA9IGFbMl07XG4gICAgICAgICAgICBvdXRbN10gPSBhWzVdO1xuICAgICAgICAgICAgb3V0WzhdID0gYVs4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG59OyIsInZhciBrTWF0aCA9IHJlcXVpcmUoJy4vZ2xrTWF0aCcpLFxuICAgIE1hdDMzID0gcmVxdWlyZSgnLi9nbGtNYXQ0NCcpLFxuICAgIE1hdDQ0ID0gcmVxdWlyZSgnLi9nbGtNYXQ0NCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgMSwgMCwgMCwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAxLCAwLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcbiAgICB9LFxuXG4gICAgaWRlbnRpdHkgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgbVsgMF0gPSAxOyBtWyAxXSA9IG1bIDJdID0gbVsgM10gPSAwO1xuICAgICAgICBtWyA1XSA9IDE7IG1bIDRdID0gbVsgNl0gPSBtWyA3XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTsgbVsgOF0gPSBtWyA5XSA9IG1bMTFdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxOyBtWzEyXSA9IG1bMTNdID0gbVsxNF0gPSAwO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjb3B5IDogZnVuY3Rpb24obSlcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KG0pO1xuICAgIH0sXG5cbiAgICBtYWtlU2NhbGUgOiBmdW5jdGlvbihzeCxzeSxzeilcbiAgICB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgbVswXSAgPSBzeDtcbiAgICAgICAgbVs1XSAgPSBzeTtcbiAgICAgICAgbVsxMF0gPSBzejtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbWFrZVRyYW5zbGF0ZSA6IGZ1bmN0aW9uKHR4LHR5LHR6KVxuICAgIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICBtWzEyXSA9IHR4O1xuICAgICAgICBtWzEzXSA9IHR5O1xuICAgICAgICBtWzE0XSA9IHR6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlUm90YXRpb25YIDogZnVuY3Rpb24oYSlcbiAgICB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVs1XSAgPSBjb3M7XG4gICAgICAgIG1bNl0gID0gLXNpbjtcbiAgICAgICAgbVs5XSAgPSBzaW47XG4gICAgICAgIG1bMTBdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlUm90YXRpb25ZIDogZnVuY3Rpb24oYSlcbiAgICB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVswXSA9IGNvcztcbiAgICAgICAgbVsyXSA9IHNpbjtcbiAgICAgICAgbVs4XSA9IC1zaW47XG4gICAgICAgIG1bMTBdPSBjb3M7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG1ha2VSb3RhdGlvblogOiBmdW5jdGlvbihhKVxuICAgIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYSksXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhKTtcblxuICAgICAgICBtWzBdID0gY29zO1xuICAgICAgICBtWzFdID0gc2luO1xuICAgICAgICBtWzRdID0gLXNpbjtcbiAgICAgICAgbVs1XSA9IGNvcztcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbWFrZVJvdGF0aW9uWFlaIDogZnVuY3Rpb24oYXgsYXksYXopXG4gICAge1xuICAgICAgICB2YXIgbSA9IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZhciBjb3N4ID0gTWF0aC5jb3MoYXgpLFxuICAgICAgICAgICAgc2lueCA9IE1hdGguc2luKGF4KSxcbiAgICAgICAgICAgIGNvc3kgPSBNYXRoLmNvcyhheSksXG4gICAgICAgICAgICBzaW55ID0gTWF0aC5zaW4oYXkpLFxuICAgICAgICAgICAgY29zeiA9IE1hdGguY29zKGF6KSxcbiAgICAgICAgICAgIHNpbnogPSBNYXRoLnNpbihheik7XG5cbiAgICAgICAgbVsgMF0gPSAgY29zeSpjb3N6O1xuICAgICAgICBtWyAxXSA9IC1jb3N4KnNpbnorc2lueCpzaW55KmNvc3o7XG4gICAgICAgIG1bIDJdID0gIHNpbngqc2lueitjb3N4KnNpbnkqY29zejtcblxuICAgICAgICBtWyA0XSA9ICBjb3N5KnNpbno7XG4gICAgICAgIG1bIDVdID0gIGNvc3gqY29zeitzaW54KnNpbnkqc2luejtcbiAgICAgICAgbVsgNl0gPSAtc2lueCpjb3N6K2Nvc3gqc2lueSpzaW56O1xuXG4gICAgICAgIG1bIDhdID0gLXNpbnk7XG4gICAgICAgIG1bIDldID0gIHNpbngqY29zeTtcbiAgICAgICAgbVsxMF0gPSAgY29zeCpjb3N5O1xuXG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIC8vdGVtcCBmcm9tIGdsTWF0cml4XG4gICAgbWFrZVJvdGF0aW9uT25BeGlzIDogZnVuY3Rpb24ocm90LHgseSx6LG91dClcbiAgICB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcblxuICAgICAgICBpZihNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSA8IGtNYXRoLkVQU0lMT04pIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgICB2YXIgcywgYywgdCxcbiAgICAgICAgICAgIGEwMCwgYTAxLCBhMDIsIGEwMyxcbiAgICAgICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgICAgIGEyMCwgYTIxLCBhMjIsIGEyMyxcbiAgICAgICAgICAgIGIwMCwgYjAxLCBiMDIsXG4gICAgICAgICAgICBiMTAsIGIxMSwgYjEyLFxuICAgICAgICAgICAgYjIwLCBiMjEsIGIyMjtcblxuXG4gICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgIHggKj0gbGVuO1xuICAgICAgICB5ICo9IGxlbjtcbiAgICAgICAgeiAqPSBsZW47XG5cbiAgICAgICAgcyA9IE1hdGguc2luKHJvdCk7XG4gICAgICAgIGMgPSBNYXRoLmNvcyhyb3QpO1xuICAgICAgICB0ID0gMSAtIGM7XG5cbiAgICAgICAgb3V0ID0gb3V0IHx8IE1hdDQ0Lm1ha2UoKTtcblxuICAgICAgICBhMDAgPSAxOyBhMDEgPSAwOyBhMDIgPSAwOyBhMDMgPSAwO1xuICAgICAgICBhMTAgPSAwOyBhMTEgPSAxOyBhMTIgPSAwOyBhMTMgPSAwO1xuICAgICAgICBhMjAgPSAwOyBhMjEgPSAwOyBhMjIgPSAxOyBhMjMgPSAwO1xuXG4gICAgICAgIGIwMCA9IHggKiB4ICogdCArIGM7IGIwMSA9IHkgKiB4ICogdCArIHogKiBzOyBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICAgICAgYjEwID0geCAqIHkgKiB0IC0geiAqIHM7IGIxMSA9IHkgKiB5ICogdCArIGM7IGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgICAgICBiMjAgPSB4ICogeiAqIHQgKyB5ICogczsgYjIxID0geSAqIHogKiB0IC0geCAqIHM7IGIyMiA9IHogKiB6ICogdCArIGM7XG5cbiAgICAgICAgb3V0WzAgXSA9IGEwMCAqIGIwMCArIGExMCAqIGIwMSArIGEyMCAqIGIwMjtcbiAgICAgICAgb3V0WzEgXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICAgICAgb3V0WzIgXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICAgICAgb3V0WzMgXSA9IGEwMyAqIGIwMCArIGExMyAqIGIwMSArIGEyMyAqIGIwMjtcbiAgICAgICAgb3V0WzQgXSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMjtcbiAgICAgICAgb3V0WzUgXSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICAgICAgb3V0WzYgXSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcbiAgICAgICAgb3V0WzcgXSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMjtcbiAgICAgICAgb3V0WzggXSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcbiAgICAgICAgb3V0WzkgXSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcbiAgICAgICAgb3V0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICAgICAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcblxuICAgICAgICByZXR1cm4gb3V0O1xufSxcblxuICAgIG11bHRQcmUgOiBmdW5jdGlvbihtMCxtMSlcbiAgICB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIG0wMDAgPSBtMFsgMF0sbTAwMSA9IG0wWyAxXSxtMDAyID0gbTBbIDJdLG0wMDMgPSBtMFsgM10sXG4gICAgICAgICAgICBtMDA0ID0gbTBbIDRdLG0wMDUgPSBtMFsgNV0sbTAwNiA9IG0wWyA2XSxtMDA3ID0gbTBbIDddLFxuICAgICAgICAgICAgbTAwOCA9IG0wWyA4XSxtMDA5ID0gbTBbIDldLG0wMTAgPSBtMFsxMF0sbTAxMSA9IG0wWzExXSxcbiAgICAgICAgICAgIG0wMTIgPSBtMFsxMl0sbTAxMyA9IG0wWzEzXSxtMDE0ID0gbTBbMTRdLG0wMTUgPSBtMFsxNV07XG5cbiAgICAgICAgdmFyIG0xMDAgPSBtMVsgMF0sbTEwMSA9IG0xWyAxXSxtMTAyID0gbTFbIDJdLG0xMDMgPSBtMVsgM10sXG4gICAgICAgICAgICBtMTA0ID0gbTFbIDRdLG0xMDUgPSBtMVsgNV0sbTEwNiA9IG0xWyA2XSxtMTA3ID0gbTFbIDddLFxuICAgICAgICAgICAgbTEwOCA9IG0xWyA4XSxtMTA5ID0gbTFbIDldLG0xMTAgPSBtMVsxMF0sbTExMSA9IG0xWzExXSxcbiAgICAgICAgICAgIG0xMTIgPSBtMVsxMl0sbTExMyA9IG0xWzEzXSxtMTE0ID0gbTFbMTRdLG0xMTUgPSBtMVsxNV07XG5cbiAgICAgICAgbVsgMF0gPSBtMDAwKm0xMDAgKyBtMDAxKm0xMDQgKyBtMDAyKm0xMDggKyBtMDAzKm0xMTI7XG4gICAgICAgIG1bIDFdID0gbTAwMCptMTAxICsgbTAwMSptMTA1ICsgbTAwMiptMTA5ICsgbTAwMyptMTEzO1xuICAgICAgICBtWyAyXSA9IG0wMDAqbTEwMiArIG0wMDEqbTEwNiArIG0wMDIqbTExMCArIG0wMDMqbTExNDtcbiAgICAgICAgbVsgM10gPSBtMDAwKm0xMDMgKyBtMDAxKm0xMDcgKyBtMDAyKm0xMTEgKyBtMDAzKm0xMTU7XG5cbiAgICAgICAgbVsgNF0gPSBtMDA0Km0xMDAgKyBtMDA1Km0xMDQgKyBtMDA2Km0xMDggKyBtMDA3Km0xMTI7XG4gICAgICAgIG1bIDVdID0gbTAwNCptMTAxICsgbTAwNSptMTA1ICsgbTAwNiptMTA5ICsgbTAwNyptMTEzO1xuICAgICAgICBtWyA2XSA9IG0wMDQqbTEwMiArIG0wMDUqbTEwNiArIG0wMDYqbTExMCArIG0wMDcqbTExNDtcbiAgICAgICAgbVsgN10gPSBtMDA0Km0xMDMgKyBtMDA1Km0xMDcgKyBtMDA2Km0xMTEgKyBtMDA3Km0xMTU7XG5cbiAgICAgICAgbVsgOF0gPSBtMDA4Km0xMDAgKyBtMDA5Km0xMDQgKyBtMDEwKm0xMDggKyBtMDExKm0xMTI7XG4gICAgICAgIG1bIDldID0gbTAwOCptMTAxICsgbTAwOSptMTA1ICsgbTAxMCptMTA5ICsgbTAxMSptMTEzO1xuICAgICAgICBtWzEwXSA9IG0wMDgqbTEwMiArIG0wMDkqbTEwNiArIG0wMTAqbTExMCArIG0wMTEqbTExNDtcbiAgICAgICAgbVsxMV0gPSBtMDA4Km0xMDMgKyBtMDA5Km0xMDcgKyBtMDEwKm0xMTEgKyBtMDExKm0xMTU7XG5cbiAgICAgICAgbVsxMl0gPSBtMDEyKm0xMDAgKyBtMDEzKm0xMDQgKyBtMDE0Km0xMDggKyBtMDE1Km0xMTI7XG4gICAgICAgIG1bMTNdID0gbTAxMiptMTAxICsgbTAxMyptMTA1ICsgbTAxNCptMTA5ICsgbTAxNSptMTEzO1xuICAgICAgICBtWzE0XSA9IG0wMTIqbTEwMiArIG0wMTMqbTEwNiArIG0wMTQqbTExMCArIG0wMTUqbTExNDtcbiAgICAgICAgbVsxNV0gPSBtMDEyKm0xMDMgKyBtMDEzKm0xMDcgKyBtMDE0Km0xMTEgKyBtMDE1Km0xMTU7XG5cblxuXG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG11bHQgOiBmdW5jdGlvbihtMCxtMSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRQcmUobTAsbTEpO1xuICAgIH0sXG5cbiAgICBtdWx0UG9zdCA6IGZ1bmN0aW9uKG0wLG0xKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdFByZShtMSxtMCk7XG4gICAgfSxcblxuICAgIGludmVydGVkIDogZnVuY3Rpb24obSlcbiAgICB7XG4gICAgICAgIHZhciBpbnYgPSB0aGlzLm1ha2UoKTtcbiAgICAgICAgaW52WzBdID0gICBtWzVdICogbVsxMF0gKiBtWzE1XSAtIG1bNV0gKiBtWzExXSAqIG1bMTRdIC0gbVs5XSAqIG1bNl0gKiBtWzE1XVxuICAgICAgICAgICAgKyBtWzldICogbVs3XSAqIG1bMTRdICsgbVsxM10gKiBtWzZdICogbVsxMV0gLSBtWzEzXSAqIG1bN10gKiBtWzEwXTtcbiAgICAgICAgaW52WzRdID0gIC1tWzRdICogbVsxMF0gKiBtWzE1XSArIG1bNF0gKiBtWzExXSAqIG1bMTRdICsgbVs4XSAqIG1bNl0gKiBtWzE1XSArXG4gICAgICAgICAgICBtWzhdICogbVs3XSAqIG1bMTRdIC0gbVsxMl0gKiBtWzZdICogbVsxMV0gKyBtWzEyXSAqIG1bN10gKiBtWzEwXTtcbiAgICAgICAgaW52WzhdID0gICBtWzRdICogbVs5XSAqIG1bMTVdIC0gbVs0XSAqIG1bMTFdICogbVsxM10gLSBtWzhdICogbVs1XSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bOF0gKiBtWzddICogbVsxM10gKyBtWzEyXSAqIG1bNV0gKiBtWzExXSAtIG1bMTJdICogbVs3XSAqIG1bOV07XG4gICAgICAgIGludlsxMl0gPSAtbVs0XSAqIG1bOV0gKiBtWzE0XSArIG1bNF0gKiBtWzEwXSAqIG1bMTNdICsgbVs4XSAqIG1bNV0gKiBtWzE0XSArXG4gICAgICAgICAgICBtWzhdICogbVs2XSAqIG1bMTNdIC0gbVsxMl0gKiBtWzVdICogbVsxMF0gKyBtWzEyXSAqIG1bNl0gKiBtWzldO1xuICAgICAgICBpbnZbMV0gPSAgLW1bMV0gKiBtWzEwXSAqIG1bMTVdICsgbVsxXSAqIG1bMTFdICogbVsxNF0gKyBtWzldICogbVsyXSAqIG1bMTVdICtcbiAgICAgICAgICAgIG1bOV0gKiBtWzNdICogbVsxNF0gLSBtWzEzXSAqIG1bMl0gKiBtWzExXSArIG1bMTNdICogbVszXSAqIG1bMTBdO1xuICAgICAgICBpbnZbNV0gPSAgbVswXSAqIG1bMTBdICogbVsxNV0gLSBtWzBdICogbVsxMV0gKiBtWzE0XSAtIG1bOF0gKiBtWzJdICogbVsxNV1cbiAgICAgICAgICAgICsgbVs4XSAqIG1bM10gKiBtWzE0XSArIG1bMTJdICogbVsyXSAqIG1bMTFdIC0gbVsxMl0gKiBtWzNdICogbVsxMF07XG4gICAgICAgIGludls5XSA9IC1tWzBdICogbVs5XSAqIG1bMTVdICsgbVswXSAqIG1bMTFdICogbVsxM10gKyBtWzhdICogbVsxXSAqIG1bMTVdXG4gICAgICAgICAgICAtIG1bOF0gKiBtWzNdICogbVsxM10gLSBtWzEyXSAqIG1bMV0gKiBtWzExXSArIG1bMTJdICogbVszXSAqIG1bOV07XG4gICAgICAgIGludlsxM10gPSBtWzBdICogbVs5XSAqIG1bMTRdIC0gbVswXSAqIG1bMTBdICogbVsxM10gLSBtWzhdICogbVsxXSAqIG1bMTRdXG4gICAgICAgICAgICArIG1bOF0gKiBtWzJdICogbVsxM10gKyBtWzEyXSAqIG1bMV0gKiBtWzEwXSAtIG1bMTJdICogbVsyXSAqIG1bOV07XG4gICAgICAgIGludlsyXSA9IG1bMV0gKiBtWzZdICogbVsxNV0gLSBtWzFdICogbVs3XSAqIG1bMTRdIC0gbVs1XSAqIG1bMl0gKiBtWzE1XVxuICAgICAgICAgICAgKyBtWzVdICogbVszXSAqIG1bMTRdICsgbVsxM10gKiBtWzJdICogbVs3XSAtIG1bMTNdICogbVszXSAqIG1bNl07XG4gICAgICAgIGludls2XSA9IC1tWzBdICogbVs2XSAqIG1bMTVdICsgbVswXSAqIG1bN10gKiBtWzE0XSArIG1bNF0gKiBtWzJdICogbVsxNV1cbiAgICAgICAgICAgIC0gbVs0XSAqIG1bM10gKiBtWzE0XSAtIG1bMTJdICogbVsyXSAqIG1bN10gKyBtWzEyXSAqIG1bM10gKiBtWzZdO1xuICAgICAgICBpbnZbMTBdID0gbVswXSAqIG1bNV0gKiBtWzE1XSAtIG1bMF0gKiBtWzddICogbVsxM10gLSBtWzRdICogbVsxXSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bNF0gKiBtWzNdICogbVsxM10gKyBtWzEyXSAqIG1bMV0gKiBtWzddIC0gbVsxMl0gKiBtWzNdICogbVs1XTtcbiAgICAgICAgaW52WzE0XSA9IC1tWzBdICogbVs1XSAqIG1bMTRdICsgbVswXSAqIG1bNl0gKiBtWzEzXSArIG1bNF0gKiBtWzFdICogbVsxNF1cbiAgICAgICAgICAgIC0gbVs0XSAqIG1bMl0gKiBtWzEzXSAtIG1bMTJdICogbVsxXSAqIG1bNl0gKyBtWzEyXSAqIG1bMl0gKiBtWzVdO1xuICAgICAgICBpbnZbM10gPSAtbVsxXSAqIG1bNl0gKiBtWzExXSArIG1bMV0gKiBtWzddICogbVsxMF0gKyBtWzVdICogbVsyXSAqIG1bMTFdXG4gICAgICAgICAgICAtIG1bNV0gKiBtWzNdICogbVsxMF0gLSBtWzldICogbVsyXSAqIG1bN10gKyBtWzldICogbVszXSAqIG1bNl07XG4gICAgICAgIGludls3XSA9IG1bMF0gKiBtWzZdICogbVsxMV0gLSBtWzBdICogbVs3XSAqIG1bMTBdIC0gbVs0XSAqIG1bMl0gKiBtWzExXVxuICAgICAgICAgICAgKyBtWzRdICogbVszXSAqIG1bMTBdICsgbVs4XSAqIG1bMl0gKiBtWzddIC0gbVs4XSAqIG1bM10gKiBtWzZdO1xuICAgICAgICBpbnZbMTFdID0gLW1bMF0gKiBtWzVdICogbVsxMV0gKyBtWzBdICogbVs3XSAqIG1bOV0gKyBtWzRdICogbVsxXSAqIG1bMTFdXG4gICAgICAgICAgICAtIG1bNF0gKiBtWzNdICogbVs5XSAtIG1bOF0gKiBtWzFdICogbVs3XSArIG1bOF0gKiBtWzNdICogbVs1XTtcbiAgICAgICAgaW52WzE1XSA9IG1bMF0gKiBtWzVdICogbVsxMF0gLSBtWzBdICogbVs2XSAqIG1bOV0gLSBtWzRdICogbVsxXSAqIG1bMTBdXG4gICAgICAgICAgICArIG1bNF0gKiBtWzJdICogbVs5XSArIG1bOF0gKiBtWzFdICogbVs2XSAtIG1bOF0gKiBtWzJdICogbVs1XTtcbiAgICAgICAgdmFyIGRldCA9IG1bMF0qaW52WzBdICsgbVsxXSppbnZbNF0gKyBtWzJdKmludls4XSArIG1bM10qaW52WzEyXTtcbiAgICAgICAgaWYoIGRldCA9PSAwIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xuICAgICAgICB2YXIgbW8gPSB0aGlzLm1ha2UoKTtcbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpPDE2OyArK2kgKVxuICAgICAgICB7XG4gICAgICAgICAgICBtb1tpXSA9IGludltpXSAqIGRldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW87XG4gICAgfSxcblxuICAgIHRyYW5zcG9zZWQgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgdmFyIG1vID0gdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgbW9bMCBdID0gbVswIF07XG4gICAgICAgIG1vWzEgXSA9IG1bNCBdO1xuICAgICAgICBtb1syIF0gPSBtWzggXTtcbiAgICAgICAgbW9bMyBdID0gbVsxMl07XG5cbiAgICAgICAgbW9bNCBdID0gbVsxIF07XG4gICAgICAgIG1vWzUgXSA9IG1bNSBdO1xuICAgICAgICBtb1s2IF0gPSBtWzkgXTtcbiAgICAgICAgbW9bNyBdID0gbVsxM107XG5cbiAgICAgICAgbW9bOCBdID0gbVsyIF07XG4gICAgICAgIG1vWzkgXSA9IG1bNiBdO1xuICAgICAgICBtb1sxMF0gPSBtWzEwXTtcbiAgICAgICAgbW9bMTFdID0gbVsxNF07XG5cbiAgICAgICAgbW9bMTJdID0gbVszIF07XG4gICAgICAgIG1vWzEzXSA9IG1bNyBdO1xuICAgICAgICBtb1sxNF0gPSBtWzExXTtcbiAgICAgICAgbW9bMTVdID0gbVsxNV07XG5cbiAgICAgICAgcmV0dXJuIG1vO1xuICAgIH0sXG5cbiAgICB0b01hdDMzSW52ZXJzZWQgOiBmdW5jdGlvbihtYXQ0NCxtYXQzMylcbiAgICB7XG4gICAgICAgIHZhciBhMDAgPSBtYXQ0NFswXSwgYTAxID0gbWF0NDRbMV0sIGEwMiA9IG1hdDQ0WzJdO1xuICAgICAgICB2YXIgYTEwID0gbWF0NDRbNF0sIGExMSA9IG1hdDQ0WzVdLCBhMTIgPSBtYXQ0NFs2XTtcbiAgICAgICAgdmFyIGEyMCA9IG1hdDQ0WzhdLCBhMjEgPSBtYXQ0NFs5XSwgYTIyID0gbWF0NDRbMTBdO1xuXG4gICAgICAgIHZhciBiMDEgPSBhMjIqYTExLWExMiphMjE7XG4gICAgICAgIHZhciBiMTEgPSAtYTIyKmExMCthMTIqYTIwO1xuICAgICAgICB2YXIgYjIxID0gYTIxKmExMC1hMTEqYTIwO1xuXG4gICAgICAgIHZhciBkID0gYTAwKmIwMSArIGEwMSpiMTEgKyBhMDIqYjIxO1xuICAgICAgICBpZiAoIWQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgdmFyIGlkID0gMS9kO1xuXG5cbiAgICAgICAgaWYoIW1hdDMzKSB7IG1hdDMzID0gTWF0MzMubWFrZSgpOyB9XG5cbiAgICAgICAgbWF0MzNbMF0gPSBiMDEqaWQ7XG4gICAgICAgIG1hdDMzWzFdID0gKC1hMjIqYTAxICsgYTAyKmEyMSkqaWQ7XG4gICAgICAgIG1hdDMzWzJdID0gKGExMiphMDEgLSBhMDIqYTExKSppZDtcbiAgICAgICAgbWF0MzNbM10gPSBiMTEqaWQ7XG4gICAgICAgIG1hdDMzWzRdID0gKGEyMiphMDAgLSBhMDIqYTIwKSppZDtcbiAgICAgICAgbWF0MzNbNV0gPSAoLWExMiphMDAgKyBhMDIqYTEwKSppZDtcbiAgICAgICAgbWF0MzNbNl0gPSBiMjEqaWQ7XG4gICAgICAgIG1hdDMzWzddID0gKC1hMjEqYTAwICsgYTAxKmEyMCkqaWQ7XG4gICAgICAgIG1hdDMzWzhdID0gKGExMSphMDAgLSBhMDEqYTEwKSppZDtcblxuICAgICAgICByZXR1cm4gbWF0MzM7XG5cblxuICAgIH0sXG5cbiAgICBtdWx0VmVjMyA6IGZ1bmN0aW9uKG0sdilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdlswXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xuICAgICAgICB2WzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM107XG4gICAgICAgIHZbMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgbXVsdFZlYzQgOiBmdW5jdGlvbihtLHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgdlswXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdICogdztcbiAgICAgICAgdlsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdICogdztcbiAgICAgICAgdlsyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICAgICAgdlszXSA9IG1bIDNdICogeCArIG1bIDddICogeSArIG1bMTFdICogeiArIG1bMTVdICogdztcblxuICAgICAgICByZXR1cm4gdjtcblxuXG4gICAgfSxcblxuICAgIGlzRmxvYXRFcXVhbCA6IGZ1bmN0aW9uKG0wLG0xKVxuICAgIHtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpPDE2KVxuICAgICAgICB7XG4gICAgICAgICAgICBpZigha01hdGguaXNGbG9hdEVxdWFsKG0wW2ldLG0xW2ldKSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9LFxuXG4gICAgdG9TdHJpbmcgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICdbJyArIG1bIDBdICsgJywgJyArIG1bIDFdICsgJywgJyArIG1bIDJdICsgJywgJyArIG1bIDNdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDRdICsgJywgJyArIG1bIDVdICsgJywgJyArIG1bIDZdICsgJywgJyArIG1bIDddICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDhdICsgJywgJyArIG1bIDldICsgJywgJyArIG1bMTBdICsgJywgJyArIG1bMTFdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bMTJdICsgJywgJyArIG1bMTNdICsgJywgJyArIG1bMTRdICsgJywgJyArIG1bMTVdICsgJ10nO1xuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIFBJICAgICAgICAgIDogTWF0aC5QSSxcbiAgICBIQUxGX1BJICAgICA6IE1hdGguUEkgKiAwLjUsXG4gICAgUVVBUlRFUl9QSSAgOiBNYXRoLlBJICogMC4yNSxcbiAgICBUV09fUEkgICAgICA6IE1hdGguUEkgKiAyLFxuICAgIEVQU0lMT04gICAgIDogMC4wMDAxLFxuXG4gICAgbGVycCAgICAgICAgOiBmdW5jdGlvbihhLGIsdil7cmV0dXJuIChhKigxLXYpKSsoYip2KTt9LFxuICAgIGNvc0ludHJwbCAgIDogZnVuY3Rpb24oYSxiLHYpe3YgPSAoMSAtIE1hdGguY29zKHYgKiBNYXRoLlBJKSkgKiAwLjU7cmV0dXJuIChhICogKDEtdikgKyBiICogdik7fSxcbiAgICBjdWJpY0ludHJwbCA6IGZ1bmN0aW9uKGEsYixjLGQsdilcbiAgICB7XG4gICAgICAgIHZhciBhMCxiMCxjMCxkMCx2djtcblxuICAgICAgICB2diA9IHYgKiB2O1xuICAgICAgICBhMCA9IGQgLSBjIC0gYSArIGI7XG4gICAgICAgIGIwID0gYSAtIGIgLSBhMDtcbiAgICAgICAgYzAgPSBjIC0gYTtcbiAgICAgICAgZDAgPSBiO1xuXG4gICAgICAgIHJldHVybiBhMCp2KnZ2K2IwKnZ2K2MwKnYrZDA7XG4gICAgfSxcblxuICAgIGhlcm1pdGVJbnRycGwgOiBmdW5jdGlvbihhLGIsYyxkLHYsdGVuc2lvbixiaWFzKVxuICAgIHtcbiAgICAgICAgdmFyIHYwLCB2MSwgdjIsIHYzLFxuICAgICAgICAgICAgYTAsIGIwLCBjMCwgZDA7XG5cbiAgICAgICAgdGVuc2lvbiA9ICgxLjAgLSB0ZW5zaW9uKSAqIDAuNTtcblxuICAgICAgICB2YXIgYmlhc3AgPSAxICsgYmlhcyxcbiAgICAgICAgICAgIGJpYXNuID0gMSAtIGJpYXM7XG5cbiAgICAgICAgdjIgID0gdiAqIHY7XG4gICAgICAgIHYzICA9IHYyICogdjtcblxuICAgICAgICB2MCAgPSAoYiAtIGEpICogYmlhc3AgKiB0ZW5zaW9uO1xuICAgICAgICB2MCArPSAoYyAtIGIpICogYmlhc24gKiB0ZW5zaW9uO1xuICAgICAgICB2MSAgPSAoYyAtIGIpICogYmlhc3AgKiB0ZW5zaW9uO1xuICAgICAgICB2MSArPSAoZCAtIGMpICogYmlhc24gKiB0ZW5zaW9uO1xuXG4gICAgICAgIGEwICA9IDIgKiB2MyAtIDMgKiB2MiArIDE7XG4gICAgICAgIGIwICA9IHYzIC0gMiAqIHYyICsgdjtcbiAgICAgICAgYzAgID0gdjMgLSB2MjtcbiAgICAgICAgZDAgID0gLTIgKiB2MyArIDMgKiB2MjtcblxuICAgICAgICByZXR1cm4gYTAgKiBiICsgYjAgKiB2MCArIGMwICogdjEgKyBkMCAqIGM7XG4gICAgfSxcblxuICAgIHJhbmRvbUZsb2F0IDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDA6IHIgPSBNYXRoLnJhbmRvbSgpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiByID0gTWF0aC5yYW5kb20oKSAqIGFyZ3VtZW50c1swXTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogciA9IGFyZ3VtZW50c1swXSArIChhcmd1bWVudHNbMV0tYXJndW1lbnRzWzBdKSAqIE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcjtcbiAgICB9LFxuXG4gICAgcmFuZG9tSW50ZWdlciA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHZhciByO1xuXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAwOiByID0gMC41ICsgTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogciA9IDAuNSArIE1hdGgucmFuZG9tKCkqYXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiByID0gYXJndW1lbnRzWzBdICsgKCAxICsgYXJndW1lbnRzWzFdIC0gYXJndW1lbnRzWzBdKSAqIE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihyKTtcbiAgICB9LFxuXG4gICAgY29uc3RyYWluIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDI6IGFyZ3VtZW50c1swXSA9IChhcmd1bWVudHNbMF0gPiBhcmd1bWVudHNbMV0pID8gYXJndW1lbnRzWzFdIDogYXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBhcmd1bWVudHNbMF0gPSAoYXJndW1lbnRzWzBdID4gYXJndW1lbnRzWzJdKSA/IGFyZ3VtZW50c1syXSA6IChhcmd1bWVudHNbMF0gPCBhcmd1bWVudHNbMV0pID8gYXJndW1lbnRzWzFdIDphcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgIH0sXG5cbiAgICBub3JtYWxpemUgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSxzdGFydCxlbmQpe3JldHVybiAodmFsdWUgLSBzdGFydCkgLyAoZW5kIC0gc3RhcnQpO30sXG4gICAgbWFwICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUsaW5TdGFydCxpbkVuZCxvdXRTdGFydCxvdXRFbmQpe3JldHVybiBvdXRTdGFydCArIChvdXRFbmQgLSBvdXRTdGFydCkgKiBub3JtYWxpemUodmFsdWUsaW5TdGFydCxpbkVuZCk7fSxcbiAgICBzaW4gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSl7cmV0dXJuIE1hdGguc2luKHZhbHVlKTt9LFxuICAgIGNvcyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gTWF0aC5jb3ModmFsdWUpO30sXG4gICAgY2xhbXAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUsbWluLG1heCl7cmV0dXJuIE1hdGgubWF4KG1pbixNYXRoLm1pbihtYXgsdmFsdWUpKTt9LFxuICAgIHNhdyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAyICogKG4gIC0gTWF0aC5mbG9vcigwLjUgKyBuICkpO30sXG4gICAgdHJpICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtNCpNYXRoLmFicygwLjUtdGhpcy5mcmFjKDAuNSpuKzAuMjUpKTt9LFxuICAgIHJlY3QgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3ZhciBhID0gTWF0aC5hYnMobik7cmV0dXJuIChhID4gMC41KSA/IDAgOiAoYSA9PSAwLjUpID8gMC41IDogKGEgPCAwLjUpID8gMSA6IC0xO30sXG4gICAgZnJhYyAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4gLSBNYXRoLmZsb29yKG4pO30sXG4gICAgc2duICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4vTWF0aC5hYnMobik7fSxcbiAgICBhYnMgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5hYnMobik7fSxcbiAgICBtaW4gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5taW4obik7fSxcbiAgICBtYXggICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5tYXgobik7fSxcbiAgICBhdGFuICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5hdGFuKG4pO30sXG4gICAgYXRhbjIgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oeSx4KXtyZXR1cm4gTWF0aC5hdGFuMih5LHgpO30sXG4gICAgcm91bmQgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgucm91bmQobik7fSxcbiAgICBmbG9vciAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5mbG9vcihuKTt9LFxuICAgIHRhbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLnRhbihuKTt9LFxuICAgIHJhZDJkZWcgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHJhZGlhbnMpe3JldHVybiByYWRpYW5zICogKDE4MCAvIE1hdGguUEkpO30sXG4gICAgZGVnMnJhZCAgICAgICAgICAgICAgIDogZnVuY3Rpb24oZGVncmVlKXtyZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApOyB9LFxuICAgIHNxcnQgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gTWF0aC5zcXJ0KHZhbHVlKTt9LFxuICAgIEdyZWF0ZXN0Q29tbW9uRGl2aXNvciA6IGZ1bmN0aW9uKGEsYil7cmV0dXJuIChiID09IDApID8gYSA6IHRoaXMuR3JlYXRlc3RDb21tb25EaXZpc29yKGIsIGEgJSBiKTt9LFxuICAgIGlzRmxvYXRFcXVhbCAgICAgICAgICA6IGZ1bmN0aW9uKGEsYil7cmV0dXJuIChNYXRoLmFicyhhLWIpPHRoaXMuRVBTSUxPTik7fSxcbiAgICBpc1Bvd2VyT2ZUd28gICAgICAgICAgOiBmdW5jdGlvbihhKXtyZXR1cm4gKGEmKGEtMSkpPT0wO30sXG4gICAgc3dhcCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oYSxiKXt2YXIgdCA9IGE7YSA9IGI7IGIgPSBhO30sXG4gICAgcG93ICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oeCx5KXtyZXR1cm4gTWF0aC5wb3coeCx5KTt9LFxuICAgIGxvZyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmxvZyhuKTt9LFxuICAgIGNvc2ggICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAoTWF0aC5wb3coTWF0aC5FLG4pICsgTWF0aC5wb3coTWF0aC5FLC1uKSkqMC41O30sXG4gICAgZXhwICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGguZXhwKG4pO30sXG4gICAgc3RlcFNtb290aCAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4qbiooMy0yKm4pO30sXG4gICAgc3RlcFNtb290aFNxdWFyZWQgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuc3RlcFNtb290aChuKSAqIHRoaXMuc3RlcFNtb290aChuKTt9LFxuICAgIHN0ZXBTbW9vdGhJbnZTcXVhcmVkICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKTt9LFxuICAgIHN0ZXBTbW9vdGhDdWJlZCAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLnN0ZXBTbW9vdGgobikqdGhpcy5zdGVwU21vb3RoKG4pKnRoaXMuc3RlcFNtb290aChuKSp0aGlzLnN0ZXBTbW9vdGgobik7fSxcbiAgICBzdGVwU21vb3RoSW52Q3ViZWQgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS0oMS10aGlzLnN0ZXBTbW9vdGgobikpKigxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpO30sXG4gICAgc3RlcFNxdWFyZWQgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4qbjt9LFxuICAgIHN0ZXBJbnZTcXVhcmVkICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLW4pKigxLW4pO30sXG4gICAgc3RlcEN1YmVkICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4qbipuKm47fSxcbiAgICBzdGVwSW52Q3ViZWQgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS0oMS1uKSooMS1uKSooMS1uKSooMS1uKTt9LFxuICAgIGNhdG11bGxyb20gICAgICAgICAgICA6IGZ1bmN0aW9uKGEsYixjLGQsaSl7IHJldHVybiBhICogKCgtaSArIDIpICogaSAtIDEpICogaSAqIDAuNSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgKiAoKCgzICogaSAtIDUpICogaSkgKiBpICsgMikgKiAwLjUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjICogKCgtMyAqIGkgKyA0KSAqIGkgKyAxKSAqIGkgKiAwLjUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkICogKChpIC0gMSkgKiBpICogaSkgKiAwLjU7fVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBtYWtlICAgICA6IGZ1bmN0aW9uKG4sdil7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW24sIHZbMF0sdlsxXSx2WzJdXSk7fSxcbiAgICBtYWtlNGYgICA6IGZ1bmN0aW9uKG4seCx5LHope3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFtuLHgseSx6XSk7fSxcbiAgICB6ZXJvICAgICA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDBdKTt9LFxuICAgIHNldCAgICAgIDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICBxMFswXSA9IHExWzBdO1xuICAgICAgICBxMFsxXSA9IHExWzFdO1xuICAgICAgICBxMFsyXSA9IHExWzJdO1xuICAgICAgICBxMFszXSA9IHExWzNdO1xuICAgIH0sXG5cbiAgICBzZXQ0ZiAgICA6IGZ1bmN0aW9uKHEsbix4LHkseilcbiAgICB7XG4gICAgICAgIHFbMF0gPSBuO1xuICAgICAgICBxWzFdID0geDtcbiAgICAgICAgcVsyXSA9IHk7XG4gICAgICAgIHFbM10gPSB6O1xuXG4gICAgfSxcblxuICAgIGNvcHkgICAgIDogZnVuY3Rpb24ocSl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkocSk7fSxcblxuICAgIGxlbmd0aCAgIDogZnVuY3Rpb24ocSl7dmFyIG4gPSBxWzBdLHggPSBxWzFdLHkgPSBxWzJdLHogPSBxWzNdOyByZXR1cm4gTWF0aC5zcXJ0KG4qbit4KngreSp5K3oqeik7fSxcbiAgICB2ZWN0b3IgICA6IGZ1bmN0aW9uKHEpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KHFbMV0scVsyXSxxWzNdKTt9LFxuICAgIHNjYWxhciAgIDogZnVuY3Rpb24ocSl7cmV0dXJuIHFbMF07fSxcblxuXG5cbiAgICBhZGQgOiBmdW5jdGlvbihxMCxxMSlcbiAgICB7XG4gICAgICAgIHEwWzBdID0gcTBbMF0gKyBxMVswXTtcbiAgICAgICAgcTBbMV0gPSBxMFsxXSArIHExWzFdO1xuICAgICAgICBxMFsyXSA9IHEwWzJdICsgcTFbMl07XG4gICAgICAgIHEwWzNdID0gcTBbM10gKyBxMVszXTtcbiAgICB9LFxuXG4gICAgc3ViIDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICBxMFswXSA9IHEwWzBdIC0gcTFbMF07XG4gICAgICAgIHEwWzFdID0gcTBbMV0gLSBxMVsxXTtcbiAgICAgICAgcTBbMl0gPSBxMFsyXSAtIHExWzJdO1xuICAgICAgICBxMFszXSA9IHEwWzNdIC0gcTFbM107XG4gICAgfSxcblxuICAgIHNjYWxlIDogZnVuY3Rpb24ocSxuKVxuICAgIHtcbiAgICAgICAgcVswXSAqPSBuO1xuICAgICAgICBxWzFdICo9IG47XG4gICAgICAgIHFbMl0gKj0gbjtcbiAgICAgICAgcVszXSAqPSBuO1xuICAgIH0sXG5cbiAgICBjb25qdWdhdGUgOiBmdW5jdGlvbihxKVxuICAgIHtcbiAgICAgICAgcVsxXSo9LTE7XG4gICAgICAgIHFbMl0qPS0xO1xuICAgICAgICBxWzNdKj0tMTtcbiAgICB9LFxuXG4gICAgbXVsdCA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgdmFyIG4wID0gcTBbMF0sXG4gICAgICAgICAgICB4MCA9IHEwWzFdLFxuICAgICAgICAgICAgeTAgPSBxMFsyXSxcbiAgICAgICAgICAgIHowID0gcTBbM10sXG4gICAgICAgICAgICBuMSA9IHExWzBdLFxuICAgICAgICAgICAgeDEgPSBxMVsxXSxcbiAgICAgICAgICAgIHkxID0gcTFbMl0sXG4gICAgICAgICAgICB6MSA9IHExWzNdO1xuXG4gICAgICAgIHEwWzBdID0gbjAgKiBuMSAtIHgwICogeDEgLSB5MCAqIHkxIC0gejAgKiB6MTtcbiAgICAgICAgcTBbMV0gPSBuMCAqIHgxIC0geDAgKiBuMSAtIHkwICogejEgLSB6MCAqIHkxO1xuICAgICAgICBxMFsyXSA9IG4wICogeTEgLSB5MCAqIG4xIC0gejAgKiB4MSAtIHgwICogejE7XG4gICAgICAgIHEwWzNdID0gbjAgKiB6MSAtIHowICogbjEgLSB4MCAqIHkxIC0geTAgKiB6MTtcbiAgICB9LFxuXG4gICAgbXVsdFZlYyA6IGZ1bmN0aW9uKHEsdilcbiAgICB7XG4gICAgICAgIHZhciBxbiA9IHFbMF0sXG4gICAgICAgICAgICBxeCA9IHFbMV0sXG4gICAgICAgICAgICBxeSA9IHFbMl0sXG4gICAgICAgICAgICBxeiA9IHFbM107XG5cbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICBxWzBdID0gLShxeCp4ICsgcXkqeSArIHF6KnopO1xuICAgICAgICBxWzFdID0gcW4gKiB4ICsgcXkgKiB6IC0gcXogKiB5O1xuICAgICAgICBxWzJdID0gcW4gKiB5ICsgcXogKiB4IC0gcXggKiB6O1xuICAgICAgICBxWzNdID0gcW4gKiB6ICsgcXggKiB5IC0gcXkgKiB4O1xuICAgIH0sXG5cbiAgICBhbmdsZSA6IGZ1bmN0aW9uKHEpXG4gICAge1xuICAgICAgICByZXR1cm4gMiAqIGFjb3MocVswXSk7XG4gICAgfSxcblxuICAgIGF4aXMgOiBmdW5jdGlvbihxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSBxWzBdLFxuICAgICAgICAgICAgeSA9IHFbMV0sXG4gICAgICAgICAgICB6ID0gcVsyXTtcblxuICAgICAgICB2YXIgbCA9IE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnopO1xuXG4gICAgICAgIHJldHVybiBsICE9IDAgPyBuZXcgRmxvYXQzMkFycmF5KFt4L2wseS9sLHovbF0pIDogbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcbiAgICB9LFxuXG4gICAgLy9UT0RPOiBJTkxJTkUgQUxMISFcblxuICAgIHJvdGF0ZSA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgdGhpcy5zZXQocTAsdGhpcy5tdWx0KHRoaXMubXVsdCh0aGlzLmNvcHkocTApLHExKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25qdWdhdGUodGhpcy5jb3B5KHEwKSkpKTtcbiAgICB9LFxuXG4gICAgcm90YXRlVmVjIDogZnVuY3Rpb24ocSx2KVxuICAgIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLnplcm8oKTtcbiAgICAgICAgdGhpcy5zZXQodCx0aGlzLm11bHRWZWMzKHRoaXMubXVsdFZlYzModGhpcy5jb3B5KHEpLHYpLHRoaXMuY29uanVnYXRlKHRoaXMuY29weShxKSkpKTtcbiAgICB9LFxuXG4gICAgZnJvbUFuZ2xlcyA6IGZ1bmN0aW9uKGF4LGF5LGF6KVxuICAgIHtcbiAgICAgICAgdmFyIHEgPSB0aGlzLnplcm8oKTtcblxuICAgICAgICB2YXIgY3lhdyxjcGl0Y2gsY3JvbGwsc3lhdyxzcGl0Y2gsc3JvbGw7XG4gICAgICAgIHZhciBjeWF3Y3BpdGNoLHN5YXdzcGl0Y2gsY3lhd3NwaXRjaCxzeWF3Y3BpdGNoO1xuXG4gICAgICAgIGN5YXcgICA9IE1hdGguY29zKGF6ICogMC41KTtcbiAgICAgICAgY3BpdGNoID0gTWF0aC5jb3MoYXkgKiAwLjUpO1xuICAgICAgICBjcm9sbCAgPSBNYXRoLmNvcyhheCAqIDAuNSk7XG4gICAgICAgIHN5YXcgICA9IE1hdGguc2luKGF6ICogMC41KTtcbiAgICAgICAgc3BpdGNoID0gTWF0aC5zaW4oYXkgKiAwLjUpO1xuICAgICAgICBzcm9sbCAgPSBNYXRoLnNpbihheCAqIDAuNSk7XG5cbiAgICAgICAgY3lhd2NwaXRjaCA9IGN5YXcgKiBjcGl0Y2g7XG4gICAgICAgIHN5YXdzcGl0Y2ggPSBzeWF3ICogc3BpdGNoO1xuICAgICAgICBjeWF3c3BpdGNoID0gY3lhdyAqIHNwaXRjaDtcbiAgICAgICAgc3lhd2NwaXRjaCA9IHN5YXcgKiBjcGl0Y2g7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyBjeWF3Y3BpdGNoICogY3JvbGwgKyBzeWF3c3BpdGNoICogc3JvbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3lhd2NwaXRjaCAqIHNyb2xsIC0gc3lhd3NwaXRjaCAqIGNyb2xsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN5YXdzcGl0Y2ggKiBjcm9sbCArIHN5YXdjcGl0Y2ggKiBzcm9sbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeWF3Y3BpdGNoICogY3JvbGwgLSBjeWF3c3BpdGNoICogc3JvbGwgXSk7XG5cbiAgICB9LFxuXG4gICAgYW5nbGVzRnJvbSA6IGZ1bmN0aW9uKHEpXG4gICAge1xuICAgICAgICB2YXIgcW4gPSBxWzBdLFxuICAgICAgICAgICAgcXggPSBxWzFdLFxuICAgICAgICAgICAgcXkgPSBxWzJdLFxuICAgICAgICAgICAgcXogPSBxWzNdO1xuXG4gICAgICAgIHZhciByMTEscjIxLHIzMSxyMzIscjMzLHIxMixyMTM7XG4gICAgICAgIHZhciBxMDAscTExLHEyMixxMzM7XG4gICAgICAgIHZhciB0ZW1wO1xuICAgICAgICB2YXIgdiA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG5cbiAgICAgICAgcTAwID0gcW4gKiBxbjtcbiAgICAgICAgcTExID0gcXggKiBxeDtcbiAgICAgICAgcTIyID0gcXkgKiBxeTtcbiAgICAgICAgcTMzID0gcXogKiBxejtcblxuICAgICAgICByMTEgPSBxMDAgKyBxMTEgLSBxMjIgLSBxMzM7XG4gICAgICAgIHIyMSA9IDIgKiAoIHF4ICsgcXkgKyBxbiAqIHF6KTtcbiAgICAgICAgcjMxID0gMiAqICggcXggKiBxeiAtIHFuICogcXkpO1xuICAgICAgICByMzIgPSAyICogKCBxeSAqIHF6ICsgcW4gKiBxeCk7XG4gICAgICAgIHIzMyA9IHEwMCAtIHExMSAtIHEyMiArIHEzMztcblxuICAgICAgICB0ZW1wID0gTWF0aC5hYnMocjMxKTtcbiAgICAgICAgaWYodGVtcCA+IDAuOTk5OTk5KVxuICAgICAgICB7XG4gICAgICAgICAgICByMTIgPSAyICogKHF4ICogcXkgLSBxbiAqIHF6KTtcbiAgICAgICAgICAgIHIxMyA9IDIgKiAocXggKiBxeiAtIHFuICogcXkpO1xuXG4gICAgICAgICAgICB2WzBdID0gMC4wO1xuICAgICAgICAgICAgdlsxXSA9ICgtKE1hdGguUEkgKiAwLjUpICogIHIzMiAvIHRlbXApO1xuICAgICAgICAgICAgdlsyXSA9IE1hdGguYXRhbjIoLXIxMiwtcjMxKnIxMyk7XG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZbMF0gPSBNYXRoLmF0YW4yKHIzMixyMzMpO1xuICAgICAgICB2WzFdID0gTWF0aC5hc2luKC0zMSk7XG4gICAgICAgIHZbMl0gPSBNYXRoLmF0YW4yKHIyMSxyMTEpO1xuICAgICAgICByZXR1cm4gdjtcbiAgIH1cbn07IiwidmFyIFZlYzIgPVxue1xuICAgIFNJWkUgOiAyLFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDBdKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzI7IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIFNJWkUgICA6IDMsXG4gICAgWkVSTyAgIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKX0sXG4gICAgQVhJU19YIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwwLDBdKX0sXG4gICAgQVhJU19ZIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwxLDBdKX0sXG4gICAgQVhJU19aIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDFdKX0sXG5cbiAgICBtYWtlIDogZnVuY3Rpb24oeCx5LHopXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHggfHwgMC4wLFxuICAgICAgICAgICAgeSB8fCAwLjAsXG4gICAgICAgICAgICB6IHx8IDAuMF0pO1xuICAgIH0sXG5cbiAgICBzZXQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdID0gdjFbMF07XG4gICAgICAgIHYwWzFdID0gdjFbMV07XG4gICAgICAgIHYwWzJdID0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzZXQzZiA6ICBmdW5jdGlvbih2LHgseSx6KVxuICAgIHtcbiAgICAgICAgdlswXSA9IHg7XG4gICAgICAgIHZbMV0gPSB5O1xuICAgICAgICB2WzJdID0gejtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgY29weSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodik7XG4gICAgfSxcblxuICAgIGFkZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gKz0gdjFbMF07XG4gICAgICAgIHYwWzFdICs9IHYxWzFdO1xuICAgICAgICB2MFsyXSArPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHN1YiA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gLT0gdjFbMF07XG4gICAgICAgIHYwWzFdIC09IHYxWzFdO1xuICAgICAgICB2MFsyXSAtPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNjYWxlIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgdlswXSo9bjtcbiAgICAgICAgdlsxXSo9bjtcbiAgICAgICAgdlsyXSo9bjtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgZG90IDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdjBbMF0qdjFbMF0gKyB2MFsxXSp2MVsxXSArIHYwWzJdKnYxWzJdO1xuICAgIH0sXG5cbiAgICBjcm9zczogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeDAgPSB2MFswXSxcbiAgICAgICAgICAgIHkwID0gdjBbMV0sXG4gICAgICAgICAgICB6MCA9IHYwWzJdLFxuICAgICAgICAgICAgeDEgPSB2MVswXSxcbiAgICAgICAgICAgIHkxID0gdjFbMV0sXG4gICAgICAgICAgICB6MSA9IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt5MCAqIHoxIC0geTEgKiB6MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHowICogeDEgLSB6MSAqIHgwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDAgKiB5MSAtIHgxICogeTBdKTtcbiAgICB9LFxuXG4gICAgbGVycCA6IGZ1bmN0aW9uKHYwLHYxLGYpXG4gICAge1xuICAgICAgICB2YXIgeDAgPSB2MFswXSxcbiAgICAgICAgICAgIHkwID0gdjBbMV0sXG4gICAgICAgICAgICB6MCA9IHYwWzJdO1xuXG4gICAgICAgIHYwWzBdID0geDAgKiAoMS4wIC0gZikgKyB2MVswXSAqIGY7XG4gICAgICAgIHYwWzFdID0geTAgKiAoMS4wIC0gZikgKyB2MVsxXSAqIGY7XG4gICAgICAgIHYwWzJdID0gejAgKiAoMS4wIC0gZikgKyB2MVsyXSAqIGY7XG5cblxuICAgIH0sXG5cbiAgICBsZXJwZWQgOiBmdW5jdGlvbih2MCx2MSxmKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVycCh0aGlzLmNvcHkodjApLHYxLGYpO1xuICAgIH0sXG5cblxuXG4gICAgbGVycDNmIDogZnVuY3Rpb24odix4LHkseixmKVxuICAgIHtcbiAgICAgICAgdmFyIHZ4ID0gdlswXSxcbiAgICAgICAgICAgIHZ5ID0gdlsxXSxcbiAgICAgICAgICAgIHZ6ID0gdlsyXTtcblxuICAgICAgICB2WzBdID0gdnggKiAoMS4wIC0gZikgKyB4ICogZjtcbiAgICAgICAgdlsxXSA9IHZ5ICogKDEuMCAtIGYpICsgeSAqIGY7XG4gICAgICAgIHZbMl0gPSB2eiAqICgxLjAgLSBmKSArIHogKiBmO1xuICAgIH0sXG5cblxuICAgIGxlbmd0aCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgIH0sXG5cbiAgICBsZW5ndGhTcSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Kno7XG4gICAgfSxcblxuICAgIHNhZmVOb3JtYWxpemUgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICB2YXIgZCA9IE1hdGguc3FydCh4KngreSp5K3oqeik7XG4gICAgICAgIGQgPSBkIHx8IDE7XG5cbiAgICAgICAgdmFyIGwgID0gMS9kO1xuXG4gICAgICAgIHZbMF0gKj0gbDtcbiAgICAgICAgdlsxXSAqPSBsO1xuICAgICAgICB2WzJdICo9IGw7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBsICA9IDEvTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcblxuICAgICAgICB2WzBdICo9IGw7XG4gICAgICAgIHZbMV0gKj0gbDtcbiAgICAgICAgdlsyXSAqPSBsO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2UzZiA6IGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB4ICsgdlsxXSAqIHkgKyB2WzJdICogeik7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdjBbMF0gLSB2MVswXSxcbiAgICAgICAgICAgIHkgPSB2MFsxXSAtIHYxWzFdLFxuICAgICAgICAgICAgeiA9IHYwWzJdIC0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHgqeCt5Knkreip6O1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZVNxM2YgOiBmdW5jdGlvbih2LHgseSx6KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHZbMF0gKiB4ICsgdlsxXSAqIHkgKyB2WzJdICogejtcbiAgICB9LFxuXG4gICAgbGltaXQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkc3EgPSB4KnggKyB5KnkgKyB6KnosXG4gICAgICAgICAgICBsc3EgPSBuICogbjtcblxuICAgICAgICBpZigoZHNxID4gbHNxKSAmJiBsc3EgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbmQgPSBuL01hdGguc3FydChkc3EpO1xuXG4gICAgICAgICAgICB2WzBdICo9IG5kO1xuICAgICAgICAgICAgdlsxXSAqPSBuZDtcbiAgICAgICAgICAgIHZbMl0gKj0gbmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZbMF0qPS0xO1xuICAgICAgICB2WzFdKj0tMTtcbiAgICAgICAgdlsyXSo9LTE7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGFkZGVkICA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzdWJiZWQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0aGlzLmNvcHkodjApLHYxKTtcbiAgICB9LFxuXG4gICAgc2NhbGVkIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUodGhpcy5jb3B5KHYpLG4pO1xuICAgIH0sXG5cbiAgICBub3JtYWxpemVkIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSh0aGlzLmNvcHkodikpO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gJ1snICsgdlswXSArICcsJyArIHZbMV0gKyAnLCcgKyB2WzJdICsgJ10nO1xuICAgIH1cblxufTtcblxuXG5cbiIsIlxuLy9UT0RPOkZJTklTSFxubW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIFNJWkUgOiA0LFxuICAgIFpFUk8gOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMCwxLjBdKX0sXG5cbiAgICBtYWtlIDogZnVuY3Rpb24oeCx5LHosdylcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgeCB8fCAwLjAsXG4gICAgICAgICAgICB5IHx8IDAuMCxcbiAgICAgICAgICAgIHogfHwgMC4wLFxuICAgICAgICAgICAgdyB8fCAxLjBdKTtcbiAgICB9LFxuXG4gICAgZnJvbVZlYzMgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyB2WzBdLCB2WzFdLCB2WzJdICwgMS4wXSk7XG4gICAgfSxcblxuICAgIHNldCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gPSB2MVswXTtcbiAgICAgICAgdjBbMV0gPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gPSB2MVsyXTtcbiAgICAgICAgdjBbM10gPSB2MVszXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNldDNmIDogIGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBzZXQ0ZiA6IGZ1bmN0aW9uKHYseCx5LHosdylcbiAgICB7XG4gICAgICAgIHZbMF0gPSB4O1xuICAgICAgICB2WzFdID0geTtcbiAgICAgICAgdlsyXSA9IHo7XG4gICAgICAgIHZbM10gPSB3O1xuXG4gICAgICAgIHJldHVybiB2O1xuXG4gICAgfSxcblxuICAgIGNvcHkgOiAgZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KHYpO1xuICAgIH0sXG5cbiAgICBhZGQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdICs9IHYxWzBdO1xuICAgICAgICB2MFsxXSArPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gKz0gdjFbMl07XG4gICAgICAgIHYwWzNdICs9IHYxWzNdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc3ViIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSAtPSB2MVswXTtcbiAgICAgICAgdjBbMV0gLT0gdjFbMV07XG4gICAgICAgIHYwWzJdIC09IHYxWzJdO1xuICAgICAgICB2MFszXSAtPSB2MVszXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNjYWxlIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgdlswXSo9bjtcbiAgICAgICAgdlsxXSo9bjtcbiAgICAgICAgdlsyXSo9bjtcbiAgICAgICAgdlszXSo9bjtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgZG90IDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdjBbMF0qdjFbMF0gKyB2MFsxXSp2MVsxXSArIHYwWzJdKnYxWzJdO1xuICAgIH0sXG5cbiAgICBjcm9zczogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeDAgPSB2MFswXSxcbiAgICAgICAgICAgIHkwID0gdjBbMV0sXG4gICAgICAgICAgICB6MCA9IHYwWzJdLFxuICAgICAgICAgICAgeDEgPSB2MVswXSxcbiAgICAgICAgICAgIHkxID0gdjFbMV0sXG4gICAgICAgICAgICB6MSA9IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt5MCp6MS15MSp6MCx6MCp4MS16MSp4MCx4MCp5MS14MSp5MF0pO1xuICAgIH0sXG5cbiAgICBzbGVycCA6IGZ1bmN0aW9uKHYwLHYxLGYpXG4gICAge1xuICAgICAgICB2YXIgeDAgPSB2MFswXSxcbiAgICAgICAgICAgIHkwID0gdjBbMV0sXG4gICAgICAgICAgICB6MCA9IHYwWzJdLFxuICAgICAgICAgICAgeDEgPSB2MVswXSxcbiAgICAgICAgICAgIHkxID0gdjFbMV0sXG4gICAgICAgICAgICB6MSA9IHYxWzJdO1xuXG4gICAgICAgIHZhciBkID0gTWF0aC5tYXgoLTEuMCxNYXRoLm1pbigoeDAqeDEgKyB5MCp5MSArIHowKnoxKSwxLjApKSxcbiAgICAgICAgICAgIHQgPSBNYXRoLmFjb3MoZCkgKiBmO1xuXG4gICAgICAgIHZhciB4ID0geDAgLSAoeDEgKiBkKSxcbiAgICAgICAgICAgIHkgPSB5MCAtICh5MSAqIGQpLFxuICAgICAgICAgICAgeiA9IHowIC0gKHoxICogZCk7XG5cbiAgICAgICAgdmFyIGwgPSAxL01hdGguc3FydCh4KngreSp5K3oqeik7XG5cbiAgICAgICAgeCo9bDtcbiAgICAgICAgeSo9bDtcbiAgICAgICAgeio9bDtcblxuICAgICAgICB2YXIgY3QgPSBNYXRoLmNvcyh0KSxcbiAgICAgICAgICAgIHN0ID0gTWF0aC5zaW4odCk7XG5cbiAgICAgICAgdmFyIHhvID0geDAgKiBjdCArIHggKiBzdCxcbiAgICAgICAgICAgIHlvID0geTAgKiBjdCArIHkgKiBzdCxcbiAgICAgICAgICAgIHpvID0gejAgKiBjdCArIHogKiBzdDtcblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbeG8seW8sem9dKTtcbiAgICB9LFxuXG4gICAgbGVuZ3RoIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCt5Knkreip6K3cqdyk7XG4gICAgfSxcblxuICAgIGxlbmd0aFNxIDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgcmV0dXJuIHgqeCt5Knkreip6K3cqdztcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICB2YXIgbCAgPSAxL01hdGguc3FydCh4KngreSp5K3oqeit3KncpO1xuXG4gICAgICAgIHZbMF0gKj0gbDtcbiAgICAgICAgdlsxXSAqPSBsO1xuICAgICAgICB2WzJdICo9IGw7XG4gICAgICAgIHZbM10gKj0gbDtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2UgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdjBbMF0gLSB2MVswXSxcbiAgICAgICAgICAgIHkgPSB2MFsxXSAtIHYxWzFdLFxuICAgICAgICAgICAgeiA9IHYwWzJdIC0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4KngreSp5K3oqeik7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdjBbMF0gLSB2MVswXSxcbiAgICAgICAgICAgIHkgPSB2MFsxXSAtIHYxWzFdLFxuICAgICAgICAgICAgeiA9IHYwWzJdIC0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHgqeCt5Knkreip6O1xuICAgIH0sXG5cbiAgICBsaW1pdCA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGRzcSA9IHgqeCArIHkqeSArIHoqeixcbiAgICAgICAgICAgIGxzcSA9IG4gKiBuO1xuXG4gICAgICAgIGlmKChkc3EgPiBsc3EpICYmIGxzcSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBuZCA9IG4vTWF0aC5zcXJ0KGRzcSk7XG5cbiAgICAgICAgICAgIHZbMF0gKj0gbmQ7XG4gICAgICAgICAgICB2WzFdICo9IG5kO1xuICAgICAgICAgICAgdlsyXSAqPSBuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBpbnZlcnQgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdlswXSo9LTE7XG4gICAgICAgIHZbMV0qPS0xO1xuICAgICAgICB2WzJdKj0tMTtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgYWRkZWQgIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQodGhpcy5jb3B5KHYwKSx2MSk7XG4gICAgfSxcblxuICAgIHN1YmJlZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzY2FsZWQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZSh0aGlzLmNvcHkodiksbik7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWQgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKHRoaXMuY29weSh2KSk7XG4gICAgfSxcblxuICAgIHRvU3RyaW5nIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiAnWycgKyB2WzBdICsgJywnICsgdlsxXSArICcsJyArIHZbMl0gKyAnXSc7XG4gICAgfVxuXG59OyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBBUFBfV0lEVEggIDogODAwLFxuICAgIEFQUF9IRUlHSFQgOiA2MDAsXG5cbiAgICBBUFBfRlBTIDogMzAsXG5cbiAgICBBUFBfUExBU0tfV0lORE9XX1RJVExFIDogJycsXG4gICAgQVBQX1BMQVNLX1RZUEUgIDogJzNkJyxcbiAgICBBUFBfUExBU0tfVlNZTkMgOiAnZmFsc2UnLFxuICAgIEFQUF9QTEFTS19NVUxUSVNBTVBMRSA6IHRydWUsXG5cbiAgICBDQU1FUkFfRk9WIDogNDUsXG4gICAgQ0FNRVJBX05FQVIgOiAwLjEsXG4gICAgQ0FNRVJBX0ZBUiAgOiAxMDBcblxufTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgTUVUSE9EX05PVF9JTVBMRU1FTlRFRDogJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQgaW4gdGFyZ2V0IHBsYXRmb3JtLicsXG4gICAgQ0xBU1NfSVNfU0lOR0xFVE9OOiAgICAgJ0FwcGxpY2F0aW9uIGlzIHNpbmdsZXRvbi4gR2V0IHZpYSBnZXRJbnN0YW5jZSgpLicsXG4gICAgQVBQX05PX1NFVFVQOiAgICAgICAgICAgJ05vIHNldHVwIG1ldGhvZCBhZGRlZCB0byBhcHAuJyxcbiAgICBBUFBfTk9fVVBEQVRFIDogICAgICAgICAnTm8gdXBkYXRlIG1ldGhvZCBhZGRlZCB0byBhcHAuJyxcbiAgICBQTEFTS19XSU5ET1dfU0laRV9TRVQ6ICAnUGxhc2sgd2luZG93IHNpemUgY2FuIG9ubHkgYmUgc2V0IG9uIHN0YXJ0dXAuJyxcbiAgICBXUk9OR19QTEFURk9STTogICAgICAgICAnV3JvbmcgUGxhdGZvcm0uJyxcbiAgICBWRVJUSUNFU19JTl9XUk9OR19TSVpFOiAnVmVydGljZXMgYXJyYXkgaGFzIHdyb25nIGxlbmd0aC4gU2hvdWxkIGJlICcsXG4gICAgQ09MT1JTX0lOX1dST05HX1NJWkU6ICAgJ0NvbG9yIGFycmF5IGxlbmd0aCBub3QgZXF1YWwgdG8gbnVtYmVyIG9mIHZlcnRpY2VzLidcbn07IiwidmFyIFBsYXRmb3JtID0ge1dFQjowLFBMQVNLOjF9O1xuICAgIFBsYXRmb3JtLl90YXJnZXQgPSBudWxsO1xuXG5QbGF0Zm9ybS5nZXRUYXJnZXQgID0gZnVuY3Rpb24oKVxue1xuICAgIGlmKCF0aGlzLl90YXJnZXQpdGhpcy5fdGFyZ2V0ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpID8gdGhpcy5XRUIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlKSA/IHRoaXMuUExBU0sgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX3RhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxhdGZvcm07IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIFNJWkUgIDogNCxcblxuICAgIEJMQUNLIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMV0pfSxcbiAgICBXSElURSA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMSwxLDFdKX0sXG4gICAgUkVEICAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwxXSl9LFxuICAgIEdSRUVOIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwxLDAsMV0pfSxcbiAgICBCTFVFICA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwxLDFdKX0sXG5cbiAgICBtYWtlIDogZnVuY3Rpb24ocixnLGIsYSl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyByLGcsYixhXSk7fSxcbiAgICBjb3B5IDogZnVuY3Rpb24oYyl7cmV0dXJuIHRoaXMubWFrZShjWzBdLGNbMV0sY1syXSxjWzNdKTt9LFxuXG4gICAgc2V0IDogZnVuY3Rpb24oYzAsYzEpXG4gICAge1xuICAgICAgICBjMFswXSA9IGMxWzBdO1xuICAgICAgICBjMFsxXSA9IGMxWzFdO1xuICAgICAgICBjMFsyXSA9IGMxWzJdO1xuICAgICAgICBjMFszXSA9IGMxWzNdO1xuXG4gICAgICAgIHJldHVybiBjMDtcbiAgICB9LFxuXG4gICAgc2V0NGYgOiBmdW5jdGlvbihjLHIsZyxiLGEpXG4gICAge1xuICAgICAgICBjWzBdID0gcjtcbiAgICAgICAgY1sxXSA9IGc7XG4gICAgICAgIGNbMl0gPSBiO1xuICAgICAgICBjWzNdID0gYTtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuXG4gICAgc2V0M2YgOiBmdW5jdGlvbihjLHIsZyxiKVxuICAgIHtcbiAgICAgICAgY1swXSA9IHI7XG4gICAgICAgIGNbMV0gPSBnO1xuICAgICAgICBjWzJdID0gYjtcbiAgICAgICAgY1szXSA9IDEuMDtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuXG4gICAgc2V0MmYgOiBmdW5jdGlvbihjLGssYSlcbiAgICB7XG4gICAgICAgIGNbMF0gPSBjWzFdID0gY1syXSA9IGs7XG4gICAgICAgIGNbM10gPSBhO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBzZXQxZiA6IGZ1bmN0aW9uKGMsaylcbiAgICB7XG4gICAgICAgIGNbMF0gPSBjWzFdID0gY1syXSA9IGs7XG4gICAgICAgIGNbM10gPSAxLjA7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDRpICAgIDogZnVuY3Rpb24oYyxyLGcsYixhKXtyZXR1cm4gdGhpcy5zZXQ0ZihjLHIvMjU1LjAsZy8yNTUuMCxiLzI1NS4wLGEpO30sXG4gICAgc2V0M2kgICAgOiBmdW5jdGlvbihjLHIsZyxiKSAge3JldHVybiB0aGlzLnNldDNmKGMsci8yNTUuMCxnLzI1NS4wLGIvMjU1LjApO30sXG4gICAgc2V0MmkgICAgOiBmdW5jdGlvbihjLGssYSkgICAge3JldHVybiB0aGlzLnNldDJmKGMsay8yNTUuMCxhKTt9LFxuICAgIHNldDFpICAgIDogZnVuY3Rpb24oYyxrKSAgICAgIHtyZXR1cm4gdGhpcy5zZXQxZihjLGsvMjU1LjApO30sXG4gICAgdG9BcnJheSAgOiBmdW5jdGlvbihjKSAgICAgICAge3JldHVybiBjLnRvQXJyYXkoKTt9LFxuICAgIHRvU3RyaW5nIDogZnVuY3Rpb24oYykgICAgICAgIHtyZXR1cm4gJ1snK2NbMF0rJywnK2NbMV0rJywnK2NbMl0rJywnK2NbM10rJ10nO30sXG5cbiAgICBpbnRlcnBvbGF0ZWQgOiBmdW5jdGlvbihjMCxjMSxmKVxuICAgIHtcbiAgICAgICAgdmFyIGMgID0gbmV3IEZsb2F0MzJBcnJheSg0KSxcbiAgICAgICAgICAgIGZpID0gMS4wIC0gZjtcblxuICAgICAgICBjWzBdID0gYzBbMF0gKiBmaSArIGMxWzBdICogZjtcbiAgICAgICAgY1sxXSA9IGMwWzFdICogZmkgKyBjMVsxXSAqIGY7XG4gICAgICAgIGNbMl0gPSBjMFsyXSAqIGZpICsgYzFbMl0gKiBmO1xuICAgICAgICBjWzNdID0gYzBbM10gKiBmaSArIGMxWzNdICogZjtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbn07IiwidmFyIFZlYzIgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMicpLFxuICAgIGtFcnJvciA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtFcnJvcicpO1xuXG5mdW5jdGlvbiBNb3VzZSgpXG57XG4gICAgaWYoTW91c2UuX19pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3Ioa0Vycm9yLkNMQVNTX0lTX1NJTkdMRVRPTik7XG5cbiAgICB0aGlzLl9wb3NpdGlvbiAgICAgPSBWZWMyLm1ha2UoKTtcbiAgICB0aGlzLl9wb3NpdGlvbkxhc3QgPSBWZWMyLm1ha2UoKTtcblxuICAgIE1vdXNlLl9faW5zdGFuY2UgPSB0aGlzO1xufVxuXG5Nb3VzZS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb247fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRQb3NpdGlvbkxhc3QgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbkxhc3Q7fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRYICAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvblswXTt9O1xuTW91c2UucHJvdG90eXBlLmdldFkgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uWzFdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WExhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzBdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WUxhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzFdO307XG5cbk1vdXNlLl9faW5zdGFuY2UgPSBudWxsO1xuTW91c2UuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpe3JldHVybiBNb3VzZS5faW5zdGFuY2U7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgdG9BcnJheSA6IGZ1bmN0aW9uKGZsb2F0MzJBcnJheSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZsb2F0MzJBcnJheSk7fVxufTsiLG51bGxdfQ==
;