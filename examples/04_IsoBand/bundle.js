;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GLKit = require('.././foam.js');

function App()
{
    GLKit.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(1024,768);
}

App.prototype = Object.create(GLKit.Application.prototype);

App.prototype.setup = function()
{
    var kgl = this.kgl;

    this._zoom = 6;

    var isoBand = this._isoBand = new GLKit.ISOBand(100,100,4,4);
        isoBand.setFunction(function(x,y,t){return Math.sin(x*y*100+t*10);});
        isoBand.applyFunction();
};

App.prototype.update = function()
{
    var kgl       = this.kgl,
        cam       = this.camera,
        time      = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta();

    var zoom = this._zoom = GLKit.Math.lerp(this._zoom, 6 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    kgl.drawMode(kgl.LINES);

    var camRotX,camRotY;

    if(this.isMouseDown())
    {
        camRotX = ( -1 + this.mouse.getX() / this.getWidth() * 2.0 ) * Math.PI;
        camRotY = ( -1 + this.mouse.getY() / this.getHeight() * 2.0) * Math.PI * 0.5;

        GLKit.Vec3.lerp3f(cam.position,
                          Math.cos(camRotX) * zoom,
                          Math.sin(camRotY) * zoom,
                          Math.sin(camRotX) * zoom,
                          timeDelta * 0.25);
    }
    else
    {
        cam.setPosition3f(0,zoom,0.0001);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    kgl.drawMode(kgl.LINE_LOOP);

    this.drawSystem();

    /*---------------------------------------------------------------------------------------------------------*/

    var isoBand = this._isoBand;
        isoBand.applyFunction(time);

    kgl.drawMode(kgl.LINES);
    kgl.color3f(1,0,1);
    kgl.drawGeometry(isoBand);
};

App.prototype.drawSystem =  function()
{
    var kgl = this.kgl;

    kgl.color1f(0.10);
    GLKit.fGLUtil.drawGridCube(kgl,70,1);

    kgl.color1f(0.075);
    kgl.pushMatrix();
    {
        kgl.translate3f(0,-0.01,0);
        GLKit.fGLUtil.drawGrid(kgl,70,1);
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
AppImplWeb.prototype.getTimeDelta      = function(){return this._timeDelta;};

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
    gl.drawElements(this.vertices,this.normals,gl.bufferColors(gl.getColorBuffer(),this.colors),this.texCoords,indices,gl.getDrawMode(),count || indices.length, offset || 0 );
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
    Color            = require('../util/glkColor'),
    Texture          = require('./gl/glkTexture');


function KGL(context3d,context2d)
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

    this._mTemp = Mat44.make();

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

KGL.prototype.useLighting  = function(bool){this.gl.uniform1f(this._uUseLighting,bool ? 1.0 : 0.0);this._bUseLighting = bool;};
KGL.prototype.getLighting  = function()    {return this._bUseLighting;};

KGL.prototype.light = function(light)
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
KGL.prototype.disableLight = function(light)
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

KGL.prototype.useTexture  = function(bool){this.gl.uniform1f(this._uUseTexture, bool ? 1.0 : 0.0);this._bUseTexture = bool;};

KGL.prototype.loadTextureWithImage = function(img)
{
    var gl = this.gl,
        glTex = gl.createTexture();
    glTex.image = img;

    var tex = new Texture(glTex);
    this._bindTexImage(tex._tex);

    return tex;

};

KGL.prototype.loadTexture = function(src,texture,callback)
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

KGL.prototype._bindTexImage = function(glTex)
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

KGL.prototype.texture = function(texture)
{
    var gl = this.gl;

    this._tex = texture._tex;
    gl.bindTexture(gl.TEXTURE_2D,this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._texMode );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._texMode );
    gl.uniform1i(this._uTexImage,0);
};

KGL.prototype.disableTextures = function()
{
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D,this._texEmpty);
    gl.vertexAttribPointer(this._aVertexTexCoord,Vec2.SIZE,gl.FLOAT,false,0,0);
    gl.uniform1f(this._uUseTexture,0.0);
};

/*---------------------------------------------------------------------------------------------------------*/
// Material
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.useMaterial = function(bool){this.gl.uniform1f(this._uUseMaterial,bool ? 1.0 : 0.0);this._bUseMaterial = bool;};

KGL.prototype.material = function(material)
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

KGL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.loadIdentity = function(){this._mModelView = Mat44.identity(this._camera.modelViewMatrix);};
KGL.prototype.pushMatrix   = function(){this._mStack.push(Mat44.copy(this._mModelView));};
KGL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw ('Invalid pop!');
    this._mModelView = stack.pop();

    return this._mModelView;
};

KGL.prototype.setMatricesUniform = function()
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

KGL.prototype.translate     = function(v)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(v[0],v[1],v[2],Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.translate3f   = function(x,y,z)      {Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,y,z,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.translateX    = function(x)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,0,0,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.translateY    = function(y)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,y,0,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.translateZ    = function(z)          {Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,0,z,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.scale         = function(v)          {Mat44.multPost(this._mModelView,Mat44.makeScale(v[0],v[1],v[2],Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.scale1f       = function(n)          {Mat44.multPost(this._mModelView,Mat44.makeScale(n,n,n,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.scale3f       = function(x,y,z)      {Mat44.multPost(this._mModelView,Mat44.makeScale(x,y,z,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.scaleX        = function(x)          {Mat44.multPost(this._mModelView,Mat44.makeScale(x,1,1,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.scaleY        = function(y)          {Mat44.multPost(this._mModelView,Mat44.makeScale(1,y,1,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.scaleZ        = function(z)          {Mat44.multPost(this._mModelView,Mat44.makeScale(1,1,z,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.rotate        = function(v)          {Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(v[0],v[1],v[2],Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.rotate3f      = function(x,y,z)      {Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(x,y,z,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.rotateX       = function(x)          {Mat44.multPost(this._mModelView,Mat44.makeRotationX(x,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.rotateY       = function(y)          {Mat44.multPost(this._mModelView,Mat44.makeRotationY(y,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.rotateZ       = function(z)          {Mat44.multPost(this._mModelView,Mat44.makeRotationZ(z,Mat44.identity(this._mTemp)),this._mModelView);};
KGL.prototype.rotateAxis    = function(angle,v)    {Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,v[0],v[1],v[2]),this._mModelView);};
KGL.prototype.rotateAxis3f  = function(angle,x,y,z){Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,x,y,z),this._mModelView);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/


KGL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexArray,mode,count,offset,type,drawType)
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


KGL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{

    this.bufferArrays(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    this.gl.drawArrays(mode  || this._drawMode,
                       first || 0,
                       count || vertexFloat32Array.length / this.SIZE_OF_VERTEX);
};

KGL.prototype.drawGeometry = function(geom,count,offset) {geom._draw(this,count,offset);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience filling default vbo
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.bufferArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordFloat32Array,glDrawMode)
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


KGL.prototype.bufferColors = function(color,buffer)
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

KGL.prototype.bufferVertices = function(vertices,buffer)
{
    if(vertices.length != buffer.length)throw (kError.VERTICES_IN_WRONG_SIZE + buffer.length + '.');
    var i = -1;while(++i < buffer.length)buffer[i] = vertices[i];
    return buffer;
};

/*---------------------------------------------------------------------------------------------------------*/
// Helpers
/*---------------------------------------------------------------------------------------------------------*/


KGL.prototype._scaleVertices = function(vert0,scale,vert1)
{
    if(!scale)return vert0;
    var i = -1, l = vert0.length;while(++i < l)vert1[i] = vert0[i] * scale;return vert1;
};


/*---------------------------------------------------------------------------------------------------------*/
// Batch
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype._putComp = function(orig,target)
{

};

KGL.prototype.beginDrawArrayBatch = function()
{
    this._bUseDrawArrayBatch = true;


};

KGL.prototype.endDrawArrayBatch = function()
{
    this._bUseDrawArrayBatch = false;

};

KGL.prototype.drawArrayBatch = function()
{

};

KGL.prototype.beginDrawElementArrayBatch = function()
{
    this._bUseDrawElementArrayBatch = true;

    this._bBatchVertices.length = 0;

};

KGL.prototype.endDrawElementArrayBatch = function()
{
    this._bUseDrawElementArrayBatch = false;


};

KGL.prototype._pushElementArrayBatch = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordsFloat32Array,indexUint16Array)
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

KGL.prototype.drawElementArrayBatch = function(batch)
{
    if(!batch){}

    this.drawElements(new Float32Array(this._bBatchVertices),
                      new Float32Array(this._bBatchNormals),
                      new Float32Array(this._bBatchColors),
                      new Float32Array(this._bBatchTexCoords),
                      new Uint16Array( this._bBatchIndices),
                      this.getDrawMode());
};

KGL.prototype._putBatch = function(batchArray,dataArray)
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

KGL.prototype.ambient   = function(color){this.gl.uniform3f(this._uAmbient,color[0],color[1],color[2]);};
KGL.prototype.ambient3f = function(r,g,b){this.gl.uniform3f(this._uAmbient,r,g,b);};
KGL.prototype.ambient1f = function(k)    {this.gl.uniform1f(this._uAmbient,k);};

KGL.prototype.color   = function(color)  {this._bColor = Color.set(this._bColor4f,color);};
KGL.prototype.color4f = function(r,g,b,a){this._bColor = Color.set4f(this._bColor4f,r,g,b,a);};
KGL.prototype.color3f = function(r,g,b)  {this._bColor = Color.set3f(this._bColor4f,r,g,b);};
KGL.prototype.color2f = function(k,a)    {this._bColor = Color.set2f(this._bColor4f,k,a);};
KGL.prototype.color1f = function(k)      {this._bColor = Color.set1f(this._bColor4f,k);};
KGL.prototype.colorfv = function(array)  {this._bColor = array;};

KGL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
KGL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
KGL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
KGL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
KGL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
KGL.prototype.clear4f   = function(r,g,b,a)
{
    var c  = Color.set4f(this._bColorBg4f,r,g,b,a);
    var gl = this.gl;
    gl.clearColor(c[0],c[1],c[2],c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


KGL.prototype.getColorBuffer = function(){return this._bColor;};
KGL.prototype.getClearBuffer = function(){return this._bColorBg4f;};

/*---------------------------------------------------------------------------------------------------------*/
// Methods draw properties
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.drawMode = function(mode){this._drawMode = mode;};
KGL.prototype.getDrawMode = function(){return this._drawMode;};

KGL.prototype.sphereDetail = function(detail)
{
    if(detail == this._sphereDetailLast)return;
    this._sphereDetailLast = detail;
    this._genSphere();
};

KGL.prototype.circleDetail = function(detail)
{
    if(detail == this._circleDetailLast )return;
    this._circleDetailLast  = Math.max(this.ELLIPSE_DETAIL_MIN,Math.min(detail,this.ELLIPSE_DETAIL_MAX));
    this._cirlceVertexCount = this._circleDetailLast * 3;
    this._genCircle();
};

KGL.prototype.lineWidth = function(size){this.gl.lineWidth(size);};

KGL.prototype.useBillboard = function(bool){this._bUseBillboarding = bool;};
KGL.prototype.pointSize = function(value){this.gl.uniform1f(this._uPointSize,value);};


/*---------------------------------------------------------------------------------------------------------*/
// Methods draw primitives
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.point = function(vector)
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

KGL.prototype.points = function(vertices,colors)
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

KGL.prototype.point3f = function(x,y,z){this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = z;this.point(this._bVertexPoint);};
KGL.prototype.point2f = function(x,y)  {this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = 0;this.point(this._bVertexPoint);};
KGL.prototype.pointv  = function(arr)  {this._bVertexPoint[0] = arr[0];this._bVertexPoint[1] = arr[1];this._bVertexPoint[2] = arr[2];this.point(this._bVertexPoint);};

/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bVertexLine;
    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorLine),null,this._drawMode);

    this._drawFuncLast = this.linef;
};

KGL.prototype.line  = function(vertices)
{
    if(vertices.length == 0)return;
    this.drawArrays(this.bufferArrays(vertices,this._bVertexLine),null,this.bufferColors(this._bColor,this._bColorLine),null,this._drawMode,0, 2);

    this._drawFuncLast = this.line;
};

KGL.prototype.linev = function(vertices)
{
    if(vertices.length == 0)return;
    var v = new Float32Array(vertices),
        l = vertices.length / this.SIZE_OF_VERTEX;
    this.drawArrays(v,null,this.bufferColors(this._bColor, new Float32Array(l*this.SIZE_OF_COLOR)),null,this._drawMode,0, l);

    this._drawFuncLast = this.linev;
};

KGL.prototype.line2fv = function(v0,v1){this.linef(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.quadf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3)
{
    var v = this._bVertexQuad;

    v[ 0] = x0;v[ 1] = y0;v[ 2] = z0;
    v[ 3] = x1;v[ 4] = y1;v[ 5] = z1;
    v[ 6] = x2;v[ 7] = y2;v[ 8] = z2;
    v[ 9] = x3;v[10] = y3;v[11] = z3;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorQuad),null,this._drawMode,0,4);

    this._drawFuncLast = this.quadf;
};

KGL.prototype.quadv = function(v0,v1,v2,v3)
{
    this.quadf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2],v2[0],v2[1],v2[2],v3[0],v3[1],v3[2]);
};

KGL.prototype.quad = function(vertices,normals,texCoords)
{
    this.drawArrays(this.bufferArrays(vertices,this._bVertexQuad),normals,this.bufferColors(this._bColor,this._bColorQuad),texCoords,this._drawMode,0,4);

    this._drawFuncLast = this.quad;
};

/*---------------------------------------------------------------------------------------------------------*/

//TODO:cleanup
KGL.prototype.rect = function(width,height)
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

KGL.prototype.triangle = function(v0,v1,v2)
{
    var v = this._bVertexTriangle;
    v[0] = v0[0];v[1] = v0[1];v[2] = v0[2];
    v[3] = v1[0];v[4] = v1[1];v[5] = v1[2];
    v[6] = v2[0];v[7] = v2[1];v[8] = v2[2];

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);

    this._drawFuncLast = this.triangle;
};

KGL.prototype.trianglef = function(v0,v1,v2,v3,v4,v5,v6,v7,v8)
{
    var v = this._bVertexTriangle;
    v[0] = v0;v[1] = v1;v[2] = v2;
    v[3] = v3;v[4] = v4;v[5] = v5;
    v[6] = v6;v[7] = v7;v[8] = v8;

    this.drawArrays(v,null,this.bufferColors(this._bColor,this._bColorTriangle),null,this._drawMode,0,3);

    this._drawFuncLast = this.trianglef;
};

KGL.prototype.trianglev = function(vertices,normals,texCoords)
{
    this.drawArrays(this.bufferArrays(vertices,this._bVertexTriangle),normals,this.bufferColors(this._bColor,this._bColorTriangle),texCoords,this._drawMode,0,3);
    this._drawFuncLast = this.trianglev;
};

/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype.circle3f = function(x,y,z,radius)
{
    radius = radius || 0.5;

    this.pushMatrix();
    this.translate3f(x,y,z);
    this.scale1f(radius);
    this.drawArrays(this._bVertexCircle,this._bNormalCircle,this.bufferColors(this._bColor,this._bColorCircle),this._bTexCoordCircle,this.getDrawMode(),0,this._circleDetailLast);
    this.popMatrix();

    this._drawFuncLast = this.linef;
};

KGL.prototype.cirlce2f = function(x,y,radius){this.circle3f(x,0,y,radius);};
KGL.prototype.circle = function(radius){this.circle3f(0,0,0,radius)};
KGL.prototype.circlev = function(v,radius){this.circle3f(v[0],v[1],v[2],radius);};
KGL.prototype.circles = function(centers,radii){};

/*---------------------------------------------------------------------------------------------------------*/
// Geometry gen
/*---------------------------------------------------------------------------------------------------------*/

KGL.prototype._genSphere = function()
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

KGL.prototype._genCircle = function()
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

KGL.prototype.getDefaultVBO  = function(){return this._defaultVBO;};
KGL.prototype.getDefaultIBO  = function(){return this._defaultIBO;};
KGL.prototype.bindDefaultVBO = function(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._defaultVBO);};
KGL.prototype.bindDefaultIBO = function(){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._defaultIBO);};

KGL.prototype.getDefaultVertexAttrib   = function(){return this._aVertexPosition;};
KGL.prototype.getDefaultNormalAttrib   = function(){return this._aVertexNormal;};
KGL.prototype.getDefaultColorAttrib    = function(){return this._aVertexColor;};
KGL.prototype.getDefaultTexCoordAttrib = function(){return this._aVertexTexCoord;};

KGL.prototype.enableDefaultVertexAttribArray     = function(){this.gl.enableVertexAttribArray(this._aVertexPosition);};
KGL.prototype.enableDefaultNormalAttribArray     = function(){this.gl.enableVertexAttribArray(this._aVertexNormal);};
KGL.prototype.enableDefaultColorAttribArray      = function(){this.gl.enableVertexAttribArray(this._aVertexColor);};
KGL.prototype.enableDefaultTexCoordsAttribArray  = function(){this.gl.enableVertexAttribArray(this._aVertexTexCoord);};

KGL.prototype.disableDefaultVertexAttribArray    = function(){this.gl.disableVertexAttribArray(this._aVertexPosition);};
KGL.prototype.disableDefaultNormalAttribArray    = function(){this.gl.disableVertexAttribArray(this._aVertexNormal);};
KGL.prototype.disableDefaultColorAttribArray     = function(){this.gl.disableVertexAttribArray(this._aVertexColor);};
KGL.prototype.disableDefaultTexCoordsAttribArray = function(){this.gl.disableVertexAttribArray(this._aVertexTexCoord);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/

//TODO:remove

KGL.prototype.box = function(width,height,depth)
{
    this.pushMatrix();
    this.scale3f(width,height,depth);
    this.drawElements(this._bVertexCube,this._bNormalCube,this.bufferColors(this._bColor,this._bColorCube),this._bTexCoordCube,this._bIndexCube,this._drawMode);
    this.popMatrix();

    this._drawFuncLast = this.box;
};

KGL.prototype.cube = function(size)
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

KGL.prototype.sphere = function(size)
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

KGL.prototype.lineBox = function(v0,v1){this.lineBoxf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

KGL.prototype.lineBoxf = function(x0,y0,z0,x1,y1,z1)
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

KGL.prototype.enable                = function(id){this.gl.enable(id);};
KGL.prototype.disable               = function(id){this.gl.disable(id);};

KGL.prototype.blendColor            = function(r,g,b,a){this.gl.blendColor(r,g,b,a);};
KGL.prototype.blendEquation         = function(mode){this.gl.blendEquation(mode);};
KGL.prototype.blendEquationSeparate = function(sfactor,dfactor){this.gl.blendEquationSeparate(sfactor,dfactor);};
KGL.prototype.blendFunc             = function(sfactor,dfactor){this.gl.blendFunc(sfactor,dfactor);};
KGL.prototype.blendFuncSeparate     = function(srcRGB,dstRGB,srcAlpha,dstAlpha){this.gl.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);};
KGL.prototype.depthFunc             = function(func){this.gl.depthFunc(func);};
KGL.prototype.sampleCoverage        = function(value,invert){this.gl.sampleCoverage(value,invert);};
KGL.prototype.stencilFunc           = function(func,ref,mask){this.gl.stencilFunc(func,ref,mask);};
KGL.prototype.stencilFuncSeparate   = function(face,func,ref,mask){this.gl.stencilFuncSeparate(face,func,ref,mask);};
KGL.prototype.stencilOp             = function(fail,zfail,zpass){this.gl.stencilOp(fail,zfail,zpass);};
KGL.prototype.stencilOpSeparate     = function(face,fail,zfail,zpass){this.gl.stencilOpSeparate(face,fail,zfail,zpass);};

/*---------------------------------------------------------------------------------------------------------*/
// World -> Screen
/*---------------------------------------------------------------------------------------------------------*/

//TODO: Fix me
KGL.prototype.getScreenCoord3f = function(x,y,z)
{
    var mpm = Mat44.mult(this._camera.projectionMatrix,this._mModelView);
    var p3d = Mat44.multVec3(mpm,Vec3.make(x,y,z));

    var bsc = this._bScreenCoords;
    bsc[0] = (((p3d[0] + 1) * 0.5) * window.innerWidth);
    bsc[1] = (((1 - p3d[1]) * 0.5) * window.innerHeight);

    return bsc;
};

KGL.prototype.getScreenCoord = function(v)
{
    return this.getScreenCoord3f(v[0],v[1],v[1]);
};




KGL.prototype.getModelViewMatrix  = function(){return this._mModelView;};
KGL.prototype.getProjectionMatrix = function(){return this._camera.projectionMatrix;};







module.exports = KGL;
},{"../math/glkMat33":30,"../math/glkMat44":31,"../math/glkVec2":34,"../math/glkVec3":35,"../math/glkVec4":36,"../system/glkError":38,"../system/glkPlatform":39,"../util/glkColor":40,"./gl/glkTexture":22,"./gl/shader/glkProgFragShader":23,"./gl/shader/glkProgLoader":24,"./gl/shader/glkProgVertexShader":25,"./gl/shader/glkShaderLoader":26}],29:[function(require,module,exports){
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
var kMath = require('./glkMath'),
    Mat33 = require('./glkMat33');

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

module.exports = Mat44;
},{"./glkMat33":30,"./glkMath":32}],32:[function(require,module,exports){
var kMath =
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


module.exports = kMath;
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL2V4YW1wbGVzLzA0X0lzb0JhbmQvYXBwLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvYXBwL2dsa0FwcEltcGwuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9hcHAvZ2xrQXBwSW1wbFBsYXNrLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvYXBwL2dsa0FwcEltcGxXZWIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9hcHAvZ2xrQXBwbGljYXRpb24uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nZW9tL2dsa0dlb20zZC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrSVNPQmFuZC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrSVNPU3VyZmFjZS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrTGluZTJkVXRpbC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dlb20vZ2xrTGluZUJ1ZmZlcjJkLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ2VvbS9nbGtMaW5lQnVmZmVyM2QuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nZW9tL2dsa1BhcmFtZXRyaWNTdXJmYWNlLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ2VvbS9nbGtQb2x5Z29uMmRVdGlsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ2VvbS9nbGtTcGxpbmUuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9nbEtpdC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa0RpcmVjdGlvbmFsTGlnaHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtMaWdodC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL2dsa01hdEdMLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrTWF0ZXJpYWwuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9nbGtQb2ludExpZ2h0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrU3BvdExpZ2h0LmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvZ2xrVGV4dHVyZS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL3NoYWRlci9nbGtQcm9nRnJhZ1NoYWRlci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL2dsL3NoYWRlci9nbGtQcm9nTG9hZGVyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1Byb2dWZXJ0ZXhTaGFkZXIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbC9zaGFkZXIvZ2xrU2hhZGVyTG9hZGVyLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvZ3JhcGhpY3MvZ2xrQ2FtZXJhQmFzaWMuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9ncmFwaGljcy9nbGtHTC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L2dyYXBoaWNzL3V0aWwvZ2xrR0xVdGlsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvbWF0aC9nbGtNYXQzMy5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L21hdGgvZ2xrTWF0NDQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa01hdGguanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa1F1YXRlcm5pb24uanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa1ZlYzIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa1ZlYzMuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9tYXRoL2dsa1ZlYzQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC9zeXN0ZW0vZ2xrRGVmYXVsdC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L3N5c3RlbS9nbGtFcnJvci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L3N5c3RlbS9nbGtQbGF0Zm9ybS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvZ2xrUGxhc2suanMvc3JjL2dsS2l0L3V0aWwvZ2xrQ29sb3IuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL2dsa1BsYXNrLmpzL3NyYy9nbEtpdC91dGlsL2dsa01vdXNlLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9nbGtQbGFzay5qcy9zcmMvZ2xLaXQvdXRpbC9nbGtVdGlsLmpzIiwiL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L19lbXB0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Q1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2MEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxOENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEdMS2l0ID0gcmVxdWlyZSgnLi4vLi4vc3JjL2dsS2l0L2dsS2l0LmpzJyk7XG5cbmZ1bmN0aW9uIEFwcCgpXG57XG4gICAgR0xLaXQuQXBwbGljYXRpb24uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zZXRGdWxsV2luZG93RnJhbWUodHJ1ZSk7XG5cbiAgICB0aGlzLnNldFRhcmdldEZQUyg2MCk7XG4gICAgdGhpcy5zZXRTaXplKDEwMjQsNzY4KTtcbn1cblxuQXBwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR0xLaXQuQXBwbGljYXRpb24ucHJvdG90eXBlKTtcblxuQXBwLnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIga2dsID0gdGhpcy5rZ2w7XG5cbiAgICB0aGlzLl96b29tID0gNjtcblxuICAgIHZhciBpc29CYW5kID0gdGhpcy5faXNvQmFuZCA9IG5ldyBHTEtpdC5JU09CYW5kKDEwMCwxMDAsNCw0KTtcbiAgICAgICAgaXNvQmFuZC5zZXRGdW5jdGlvbihmdW5jdGlvbih4LHksdCl7cmV0dXJuIE1hdGguc2luKHgqeSoxMDArdCoxMCk7fSk7XG4gICAgICAgIGlzb0JhbmQuYXBwbHlGdW5jdGlvbigpO1xufTtcblxuQXBwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGtnbCAgICAgICA9IHRoaXMua2dsLFxuICAgICAgICBjYW0gICAgICAgPSB0aGlzLmNhbWVyYSxcbiAgICAgICAgdGltZSAgICAgID0gdGhpcy5nZXRTZWNvbmRzRWxhcHNlZCgpLFxuICAgICAgICB0aW1lRGVsdGEgPSB0aGlzLmdldFRpbWVEZWx0YSgpO1xuXG4gICAgdmFyIHpvb20gPSB0aGlzLl96b29tID0gR0xLaXQuTWF0aC5sZXJwKHRoaXMuX3pvb20sIDYgKyB0aGlzLmdldE1vdXNlV2hlZWxEZWx0YSgpICogMC4yNSwgdGltZURlbHRhICogMC4wMDI1KTtcblxuXG4gICAga2dsLmNsZWFyM2YoMC4xLDAuMSwwLjEpO1xuICAgIGtnbC5sb2FkSWRlbnRpdHkoKTtcblxuICAgIGtnbC5kcmF3TW9kZShrZ2wuTElORVMpO1xuXG4gICAgdmFyIGNhbVJvdFgsY2FtUm90WTtcblxuICAgIGlmKHRoaXMuaXNNb3VzZURvd24oKSlcbiAgICB7XG4gICAgICAgIGNhbVJvdFggPSAoIC0xICsgdGhpcy5tb3VzZS5nZXRYKCkgLyB0aGlzLmdldFdpZHRoKCkgKiAyLjAgKSAqIE1hdGguUEk7XG4gICAgICAgIGNhbVJvdFkgPSAoIC0xICsgdGhpcy5tb3VzZS5nZXRZKCkgLyB0aGlzLmdldEhlaWdodCgpICogMi4wKSAqIE1hdGguUEkgKiAwLjU7XG5cbiAgICAgICAgR0xLaXQuVmVjMy5sZXJwM2YoY2FtLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmNvcyhjYW1Sb3RYKSAqIHpvb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luKGNhbVJvdFkpICogem9vbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oY2FtUm90WCkgKiB6b29tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lRGVsdGEgKiAwLjI1KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgY2FtLnNldFBvc2l0aW9uM2YoMCx6b29tLDAuMDAwMSk7XG4gICAgfVxuXG4gICAgY2FtLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICBjYW0udXBkYXRlTWF0cmljZXMoKTtcblxuICAgIGtnbC5kcmF3TW9kZShrZ2wuTElORV9MT09QKTtcblxuICAgIHRoaXMuZHJhd1N5c3RlbSgpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdmFyIGlzb0JhbmQgPSB0aGlzLl9pc29CYW5kO1xuICAgICAgICBpc29CYW5kLmFwcGx5RnVuY3Rpb24odGltZSk7XG5cbiAgICBrZ2wuZHJhd01vZGUoa2dsLkxJTkVTKTtcbiAgICBrZ2wuY29sb3IzZigxLDAsMSk7XG4gICAga2dsLmRyYXdHZW9tZXRyeShpc29CYW5kKTtcbn07XG5cbkFwcC5wcm90b3R5cGUuZHJhd1N5c3RlbSA9ICBmdW5jdGlvbigpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMua2dsO1xuXG4gICAga2dsLmNvbG9yMWYoMC4xMCk7XG4gICAgR0xLaXQua0dMVXRpbC5kcmF3R3JpZEN1YmUoa2dsLDcwLDEpO1xuXG4gICAga2dsLmNvbG9yMWYoMC4wNzUpO1xuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAge1xuICAgICAgICBrZ2wudHJhbnNsYXRlM2YoMCwtMC4wMSwwKTtcbiAgICAgICAgR0xLaXQua0dMVXRpbC5kcmF3R3JpZChrZ2wsNzAsMSk7XG4gICAgfVxuICAgIGtnbC5wb3BNYXRyaXgoKTtcbn07XG5cbnZhciBhcHAgPSBuZXcgQXBwKCk7XG4iLCJ2YXIgRGVmYXVsdCA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtEZWZhdWx0JyksXG4gICAgZ2xrRXJyb3IgID0gcmVxdWlyZSgnLi4vc3lzdGVtL2dsa0Vycm9yJyk7XG5cbmZ1bmN0aW9uIEFwcEltcGwoKVxue1xuICAgIHRoaXMuX2NvbnRleHQzZCA9IG51bGw7XG4gICAgdGhpcy5fY29udGV4dDJkID0gbnVsbDtcblxuICAgIHRoaXMuX3dpbmRvd1RpdGxlICAgICAgID0gMDtcbiAgICB0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSA9IGZhbHNlO1xuICAgIHRoaXMuX2lzRnVsbHNjcmVlbiAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5faXNCb3JkZXJsZXNzICAgICAgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwbGF5SWQgICAgICAgICA9IDA7XG5cbiAgICB0aGlzLl9rZXlEb3duICAgPSBmYWxzZTtcbiAgICB0aGlzLl9rZXlTdHIgICAgPSAnJztcbiAgICB0aGlzLl9rZXlDb2RlICAgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcblxuICAgIHRoaXMuX21vdXNlTW92ZSAgID0gZmFsc2U7XG4gICAgdGhpcy5fbW91c2VCb3VuZHMgPSB0cnVlO1xuXG4gICAgdGhpcy5fdGFyZ2V0RlBTICAgICA9IERlZmF1bHQuQVBQX0ZQUztcbiAgICB0aGlzLl9iVXBkYXRlICAgICAgID0gdHJ1ZTtcblxuICAgIHRoaXMuX2ZyYW1lcyAgICAgICAgPSAwO1xuICAgIHRoaXMuX2ZyYW1ldGltZSAgICAgPSAwO1xuICAgIHRoaXMuX2ZyYW1lbnVtICAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWUgICAgICAgICAgPSAwO1xuICAgIHRoaXMuX3RpbWVTdGFydCAgICAgPSAtMTtcbiAgICB0aGlzLl90aW1lTmV4dCAgICAgID0gMDtcbiAgICB0aGlzLl90aW1lSW50ZXJ2YWwgID0gdGhpcy5fdGFyZ2V0RlBTIC8gMTAwMC4wO1xuICAgIHRoaXMuX3RpbWVEZWx0YSAgICAgPSAwO1xuXG4gICAgdGhpcy5fd2lkdGggID0gLTE7XG4gICAgdGhpcy5faGVpZ2h0ID0gLTE7XG4gICAgdGhpcy5fcmF0aW8gID0gLTE7XG5cbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gZmFsc2U7XG59XG5cbkFwcEltcGwucHJvdG90eXBlLmlzSW5pdGlhbGl6ZWQgPSBmdW5jdGlvbigpICAgIHtyZXR1cm4gdGhpcy5faXNJbml0aWFsaXplZDt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRVcGRhdGUgICAgID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5fYlVwZGF0ZSA9IGJvb2w7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuaW5pdCAgICA9IGZ1bmN0aW9uKGFwcE9iaikgICAgICB7dGhyb3cgbmV3IEVycm9yKGdsa0Vycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO307XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24od2lkdGgsaGVpZ2h0KXt0aHJvdyBuZXcgRXJyb3IoZ2xrRXJyb3IuTUVUSE9EX05PVF9JTVBMRU1FTlRFRCk7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lID0gZnVuY3Rpb24oYm9vbCl7dGhyb3cgbmV3IEVycm9yKGdsa0Vycm9yLk1FVEhPRF9OT1RfSU1QTEVNRU5URUQpO307XG5BcHBJbXBsLnByb3RvdHlwZS5pc0Z1bGxXaW5kb3dGcmFtZSAgPSBmdW5jdGlvbigpICAgIHtyZXR1cm4gdGhpcy5faXNGdWxsV2luZG93RnJhbWU7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuaXNGdWxsc2NyZWVuICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lzRnVsbHNjcmVlbjt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIGZhbHNlO307XG5BcHBJbXBsLnByb3RvdHlwZS5pc0JvcmRlcmxlc3MgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faXNCb3JkZXJsZXNzO31cblxuQXBwSW1wbC5wcm90b3R5cGUuc2V0RGlzcGxheSA9IGZ1bmN0aW9uKG51bSl7cmV0dXJuIGZhbHNlO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXREaXNwbGF5ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlzcGxheUlkO31cblxuXG5BcHBJbXBsLnByb3RvdHlwZS5nZXRXaWR0aCAgPSBmdW5jdGlvbigpICAgICAgICAgICAge3JldHVybiB0aGlzLl93aWR0aDt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSAgICAgICAgICAgIHtyZXR1cm4gdGhpcy5faGVpZ2h0O307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRBc3BlY3RSYXRpb1dpbmRvdyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JhdGlvO307XG5cbkFwcEltcGwucHJvdG90eXBlLnNldFRhcmdldEZQUyA9IGZ1bmN0aW9uKGZwcyl7dGhpcy5fdGFyZ2V0RlBTID0gZnBzO3RoaXMuX3RpbWVJbnRlcnZhbCAgPSB0aGlzLl90YXJnZXRGUFMgLyAxMDAwLjA7fTtcbkFwcEltcGwucHJvdG90eXBlLmdldFRhcmdldEZQUyA9IGZ1bmN0aW9uKCkgICB7cmV0dXJuIHRoaXMuX3RhcmdldEZQUzt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRXaW5kb3dUaXRsZSAgICAgICA9IGZ1bmN0aW9uKHRpdGxlKXt0aGlzLl93aW5kb3dUaXRsZSA9IHRpdGxlO307XG5BcHBJbXBsLnByb3RvdHlwZS5yZXN0cmljdE1vdXNlVG9GcmFtZSA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9tb3VzZUJvdW5kcyA9IGJvb2w7fTtcblxuQXBwSW1wbC5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZSAgICAgICAgICAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ICAgICAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZU5leHQgICAgICAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihnbGtFcnJvci5NRVRIT0RfTk9UX0lNUExFTUVOVEVEKTt9O1xuXG5BcHBJbXBsLnByb3RvdHlwZS5pc0tleURvd24gICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9rZXlEb3duO307XG5BcHBJbXBsLnByb3RvdHlwZS5pc01vdXNlRG93biAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tb3VzZURvd247fTtcbkFwcEltcGwucHJvdG90eXBlLmlzTW91c2VNb3ZlICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX21vdXNlTW92ZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0S2V5Q29kZSAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa2V5Q29kZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0S2V5U3RyICAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa2V5U3RyO307XG5BcHBJbXBsLnByb3RvdHlwZS5nZXRNb3VzZVdoZWVsRGVsdGEgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tb3VzZVdoZWVsRGVsdGE7fTtcblxuXG5BcHBJbXBsLnByb3RvdHlwZS5zZXRNb3VzZUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gZmFsc2U7fTtcbkFwcEltcGwucHJvdG90eXBlLnNldEtleUxpc3RlbmVyVGFyZ2V0ICAgPSBmdW5jdGlvbihvYmope3JldHVybiBmYWxzZTt9O1xuQXBwSW1wbC5wcm90b3R5cGUuZ2V0UGFyZW50ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKCkgICB7cmV0dXJuIGZhbHNlO307XG5BcHBJbXBsLnByb3RvdHlwZS5zZXRQYXJlbnQgICAgICAgICAgICAgID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gZmFsc2U7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBJbXBsOyIsInZhciBEZWZhdWx0ICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtEZWZhdWx0JyksXG4gICAga0Vycm9yICAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRXJyb3InKSxcbiAgICBrR0wgICAgICAgICA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dsa0dMJyksXG4gICAgQXBwSW1wbCAgICAgPSByZXF1aXJlKCcuL2dsa0FwcEltcGwnKSxcbiAgICBDYW1lcmFCYXNpYyA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dsa0NhbWVyYUJhc2ljJyksXG4gICAgcGxhc2sgICAgICAgPSByZXF1aXJlKCdwbGFzaycpO1xuXG5mdW5jdGlvbiBBcHBJbXBsUGxhc2soKVxue1xuICAgIEFwcEltcGwuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xufVxuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBcHBJbXBsLnByb3RvdHlwZSk7XG5cbkFwcEltcGxQbGFzay5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodClcbntcbiAgICBpZih0aGlzLl9pc0luaXRpYWxpemVkKXRocm93IG5ldyBFcnJvcihrRXJyb3IuUExBU0tfV0lORE9XX1NJWkVfU0VUKTtcblxuICAgIHRoaXMuX3dpZHRoICA9IHdpZHRoO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLl9yYXRpbyAgPSB3aWR0aCAvIGhlaWdodDtcbn07XG5cbi8vVE9ETzogRml4IHRpbWUgZGVsdGEsIGRvdWJsZSBtZWFzdXJpbmcgb2YgdGltZSBpbiBnZW5lcmFsXG5cbkFwcEltcGxQbGFzay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGFwcE9iailcbntcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1vdXNlO1xuICAgIHZhciBwcmV2VGltZSA9IDAsXG4gICAgICAgIHRpbWVEZWx0YSxcbiAgICAgICAgdGltZTtcblxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTW91c2UoeCx5KVxuICAgIHtcbiAgICAgICAgYXBwT2JqLm1vdXNlLl9wb3NpdGlvbkxhc3RbMF0gPSBhcHBPYmoubW91c2UuX3Bvc2l0aW9uWzBdO1xuICAgICAgICBhcHBPYmoubW91c2UuX3Bvc2l0aW9uTGFzdFsxXSA9IGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV07XG5cbiAgICAgICAgaWYoc2VsZi5fbW91c2VCb3VuZHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMF0gPSBNYXRoLm1heCgwLE1hdGgubWluKHgsc2VsZi5fd2lkdGgpKTtcbiAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV0gPSBNYXRoLm1heCgwLE1hdGgubWluKHksc2VsZi5faGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBhcHBPYmoubW91c2UuX3Bvc2l0aW9uWzBdID0geDtcbiAgICAgICAgICAgIGFwcE9iai5tb3VzZS5fcG9zaXRpb25bMV0gPSB5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxhc2suc2ltcGxlV2luZG93KHtcblxuICAgICAgICBzZXR0aW5nczpcbiAgICAgICAge1xuICAgICAgICAgICAgd2lkdGg6ICAgICAgIHNlbGYuX3dpZHRoICB8fCBEZWZhdWx0LkFQUF9XSURUSCxcbiAgICAgICAgICAgIGhlaWdodDogICAgICBzZWxmLl9oZWlnaHQgfHwgRGVmYXVsdC5BUFBfSEVJR0hULFxuICAgICAgICAgICAgdHlwZTogICAgICAgIERlZmF1bHQuQVBQX1BMQVNLX1RZUEUsXG4gICAgICAgICAgICB2c3luYzogICAgICAgRGVmYXVsdC5BUFBfUExBU0tfVlNZTkMsXG4gICAgICAgICAgICBtdWx0aXNhbXBsZTogRGVmYXVsdC5BUFBfUExBU0tfTVVMVElTQU1QTEUsXG4gICAgICAgICAgICBib3JkZXJsZXNzOiAgc2VsZi5faXNCb3JkZXJsZXNzLFxuICAgICAgICAgICAgZnVsbHNjcmVlbjogIHNlbGYuX2lzRnVsbHNjcmVlbixcbiAgICAgICAgICAgIHRpdGxlOiAgICAgICBzZWxmLl93aW5kb3dUaXRsZSB8fCBEZWZhdWx0LkFQUF9QTEFTS19XSU5ET1dfVElUTEVcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OmZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgYXBwT2JqLmtnbCAgICA9IG5ldyBrR0wodGhpcy5nbCxudWxsKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEgPSBuZXcgQ2FtZXJhQmFzaWMoKTtcbiAgICAgICAgICAgIGFwcE9iai5rZ2wuc2V0Q2FtZXJhKGFwcE9iai5jYW1lcmEpO1xuICAgICAgICAgICAgYXBwT2JqLmNhbWVyYS5zZXRQZXJzcGVjdGl2ZShEZWZhdWx0LkNBTUVSQV9GT1YsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGlvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9ORUFSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9GQVIpO1xuXG4gICAgICAgICAgICBhcHBPYmouY2FtZXJhLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICAgICAgICAgIGFwcE9iai5jYW1lcmEudXBkYXRlTWF0cmljZXMoKTtcblxuICAgICAgICAgICAgaWYoc2VsZi5fYlVwZGF0ZSl0aGlzLmZyYW1lcmF0ZShzZWxmLl90YXJnZXRGUFMpO1xuICAgICAgICAgICAgYXBwT2JqLnNldHVwKCk7XG5cbiAgICAgICAgICAgIHNlbGYuX3RpbWVTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBzZWxmLl90aW1lTmV4dCAgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdtb3VzZU1vdmVkJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlTW91c2UoZS54LCBlLnkpO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2xlZnRNb3VzZURyYWdnZWQnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNb3VzZShlLngsIGUueSk7XG4gICAgICAgICAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlTW92ZShlKTtcblxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdsZWZ0TW91c2VEb3duJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VEb3duKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub24oJ2xlZnRNb3VzZVVwJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlVXAoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5vbignc2Nyb2xsV2hlZWwnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9tb3VzZVdoZWVsRGVsdGEgKz0gTWF0aC5tYXgoLTEsTWF0aC5taW4oMSxlLmR5KSkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uTW91c2VXaGVlbChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdrZXlVcCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IGUuc3RyO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgICAgICAgICBhcHBPYmoub25LZXlVcChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLm9uKCdrZXlEb3duJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2tleVN0ciAgPSBlLnN0cjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fa2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgICAgICAgICAgICAgYXBwT2JqLm9uS2V5RG93bihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBzZWxmLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkcmF3OmZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fZnJhbWVudW0gID0gdGhpcy5mcmFtZW51bTtcbiAgICAgICAgICAgIHRpbWUgICAgICAgICAgICA9IHNlbGYuX2ZyYW1ldGltZSA9IHRoaXMuZnJhbWV0aW1lO1xuXG4gICAgICAgICAgICBtb3VzZSAgICAgICAgICAgPSBhcHBPYmoubW91c2U7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZU1vdmUgPSBtb3VzZS5fcG9zaXRpb25bMF0gIT0gbW91c2UuX3Bvc2l0aW9uTGFzdFswXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uWzFdICE9IG1vdXNlLl9wb3NpdGlvbkxhc3RbMV07XG5cblxuICAgICAgICAgICAgLy9laCBqbywgVE9ETzogY2hlY2tcbiAgICAgICAgICAgIHNlbGYuX3RpbWVEZWx0YSA9IE1hdGgubWluKCh0aW1lIC0gcHJldlRpbWUpKjEwLDEpO1xuICAgICAgICAgICAgYXBwT2JqLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcHJldlRpbWUgPSB0aW1lO1xuXG4gICAgICAgIH19KTtcbn07XG5cbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0U2Vjb25kc0VsYXBzZWQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mcmFtZXRpbWU7fTtcbkFwcEltcGxQbGFzay5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9mcmFtZW51bTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVEZWx0YTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5nZXRUaW1lU3RhcnQgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVTdGFydDt9O1xuXG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLnNldEZ1bGxXaW5kb3dGcmFtZSA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lID0gYm9vbDtyZXR1cm4gdHJ1ZTt9O1xuQXBwSW1wbFBsYXNrLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuICAgICAgPSBmdW5jdGlvbihib29sKXt0aGlzLl9pc0Z1bGxzY3JlZW4gPSBib29sO3JldHVybiB0cnVlO307XG5BcHBJbXBsUGxhc2sucHJvdG90eXBlLnNldEJvcmRlcmxlc3MgICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2lzQm9yZGVybGVzcyA9IGJvb2w7cmV0dXJuIHRydWU7fTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEltcGxQbGFzaztcblxuXG5cbiIsInZhciBEZWZhdWx0ICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtEZWZhdWx0JyksXG4gICAgQXBwSW1wbCAgICAgPSByZXF1aXJlKCcuL2dsa0FwcEltcGwnKSxcbiAgICBrR0wgICAgICAgICA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dsa0dMJyksXG4gICAgQ2FtZXJhQmFzaWMgPSByZXF1aXJlKCcuLi9ncmFwaGljcy9nbGtDYW1lcmFCYXNpYycpO1xuXG5mdW5jdGlvbiBBcHBJbXBsV2ViKClcbntcbiAgICBBcHBJbXBsLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcblxuICAgIHZhciBjYW52YXMzZCA9IHRoaXMuX2NhbnZhczNkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhczNkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCcwJyk7XG4gICAgICAgIGNhbnZhczNkLmZvY3VzKCk7XG5cbiAgICB0aGlzLl9jb250ZXh0M2QgPSBjYW52YXMzZC5nZXRDb250ZXh0KCd3ZWJraXQtM2QnKSB8fFxuICAgICAgICAgICAgICAgICAgICAgIGNhbnZhczNkLmdldENvbnRleHQoXCJ3ZWJnbFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICAgIGNhbnZhczNkLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIik7XG5cbiAgICB2YXIgY2FudmFzMmQgPSB0aGlzLl9jYW52YXMyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgdGhpcy5fcGFyZW50ICAgICAgICAgICA9IG51bGw7XG4gICAgdGhpcy5fbW91c2VFdmVudFRhcmdldCA9IGNhbnZhczNkO1xuICAgIHRoaXMuX2tleUV2ZW50VGFyZ2V0ICAgPSBjYW52YXMzZDtcblxuICAgIHRoaXMuX2NvbnRleHQyZCA9IGNhbnZhczJkLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbn1cblxuQXBwSW1wbFdlYi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFwcEltcGwucHJvdG90eXBlKTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24oKSAgIHtyZXR1cm4gdGhpcy5fY29udGV4dDNkLnBhcmVudE5vZGU7fTtcbkFwcEltcGxXZWIucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKG9iail7dGhpcy5fcGFyZW50ID0gb2JqO307XG5cblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLGhlaWdodClcbntcbiAgICBpZih0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZSl7d2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDsgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O31cbiAgICBpZih3aWR0aCA9PSB0aGlzLl93aWR0aCAmJiBoZWlnaHQgPT0gdGhpcy5faGVpZ2h0KXJldHVybjtcblxuICAgIHRoaXMuX3dpZHRoICA9IHdpZHRoO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLl9yYXRpbyAgPSB3aWR0aCAvIGhlaWdodDtcblxuICAgIGlmKCF0aGlzLl9pc0luaXRpYWxpemVkKSByZXR1cm47XG5cbiAgICB0aGlzLl91cGRhdGVDYW52YXMzZFNpemUoKTtcbn07XG5cbkFwcEltcGxXZWIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oYXBwT2JqKVxue1xuICAgIHZhciBzZWxmICAgPSB0aGlzO1xuICAgIHZhciBtb3VzZSAgPSBhcHBPYmoubW91c2U7XG4gICAgdmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhczNkO1xuXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLl93aW5kb3dUaXRsZSB8fCBkb2N1bWVudC50aXRsZTtcblxuICAgIGlmKCF0aGlzLl9wYXJlbnQpZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGVsc2UgdGhpcy5fcGFyZW50LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgICB0aGlzLl91cGRhdGVDYW52YXMzZFNpemUoKTtcblxuICAgIHZhciBtb3VzZUV2ZW50VGFyZ2V0ID0gdGhpcy5fbW91c2VFdmVudFRhcmdldCxcbiAgICAgICAga2V5RXZlbnRUYXJnZXQgICA9IHRoaXMuX2tleUV2ZW50VGFyZ2V0O1xuXG5cbiAgICBhcHBPYmoua2dsID0gbmV3IGtHTCh0aGlzLl9jb250ZXh0M2QsdGhpcy5fY29udGV4dDJkKTtcbiAgICBhcHBPYmoua2dsLmdsLnZpZXdwb3J0KDAsMCx0aGlzLl93aWR0aCx0aGlzLl9oZWlnaHQpO1xuXG4gICAgYXBwT2JqLmNhbWVyYSA9IG5ldyBDYW1lcmFCYXNpYygpO1xuICAgIGFwcE9iai5rZ2wuc2V0Q2FtZXJhKGFwcE9iai5jYW1lcmEpO1xuICAgIGFwcE9iai5jYW1lcmEuc2V0UGVyc3BlY3RpdmUoRGVmYXVsdC5DQU1FUkFfRk9WLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcmF0aW8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0LkNBTUVSQV9ORUFSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdC5DQU1FUkFfRkFSKTtcbiAgICBhcHBPYmouY2FtZXJhLnNldFRhcmdldDNmKDAsMCwwKTtcbiAgICBhcHBPYmouY2FtZXJhLnVwZGF0ZU1hdHJpY2VzKCk7XG5cbiAgICBhcHBPYmouc2V0dXAoKTtcblxuICAgIG1vdXNlRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgbW91c2UuX3Bvc2l0aW9uTGFzdFswXSA9IG1vdXNlLl9wb3NpdGlvblswXTtcbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvbkxhc3RbMV0gPSBtb3VzZS5fcG9zaXRpb25bMV07XG5cbiAgICAgICAgICAgIG1vdXNlLl9wb3NpdGlvblswXSA9IGUucGFnZVg7XG4gICAgICAgICAgICBtb3VzZS5fcG9zaXRpb25bMV0gPSBlLnBhZ2VZO1xuXG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZU1vdmUoZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuX21vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgICBhcHBPYmoub25Nb3VzZURvd24oZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlVXAoZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBtb3VzZUV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLFxuICAgICAgICBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLl9tb3VzZVdoZWVsRGVsdGEgKz0gTWF0aC5tYXgoLTEsTWF0aC5taW4oMSwgZS53aGVlbERlbHRhKSkgKiAtMTtcbiAgICAgICAgICAgIGFwcE9iai5vbk1vdXNlV2hlZWwoZSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICBrZXlFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5fa2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9rZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICAgICAgc2VsZi5fa2V5U3RyICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTsvL25vdCByZWxpYWJsZTtcbiAgICAgICAgICAgIGFwcE9iai5vbktleURvd24oZSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICBrZXlFdmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsXG4gICAgICAgIGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuX2tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuX2tleUNvZGUgPSBlLmtleUNvZGU7XG4gICAgICAgICAgICBzZWxmLl9rZXlTdHIgID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpO1xuICAgICAgICAgICAgYXBwT2JqLm9uS2V5VXAoZSk7XG5cbiAgICAgICAgfSk7XG5cblxuICAgIHZhciBmdWxsV2luZG93RnJhbWUgPSB0aGlzLl9pc0Z1bGxXaW5kb3dGcmFtZTtcbiAgICB2YXIgY2FtZXJhO1xuICAgIHZhciBnbDtcblxuICAgIHZhciB3aW5kb3dXaWR0aCxcbiAgICAgICAgd2luZG93SGVpZ2h0O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2FtZXJhUmF0aW8oKVxuICAgIHtcbiAgICAgICAgY2FtZXJhID0gYXBwT2JqLmNhbWVyYTtcbiAgICAgICAgY2FtZXJhLnNldEFzcGVjdFJhdGlvKHNlbGYuX3JhdGlvKTtcbiAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVWaWV3cG9ydEdMKClcbiAgICB7XG4gICAgICAgIGdsID0gYXBwT2JqLmtnbDtcbiAgICAgICAgZ2wuZ2wudmlld3BvcnQoMCwwLHNlbGYuX3dpZHRoLHNlbGYuX2hlaWdodCk7XG4gICAgICAgIGdsLmNsZWFyQ29sb3IoZ2wuZ2V0Q2xlYXJCdWZmZXIoKSk7XG4gICAgfVxuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJyxcbiAgICAgICAgZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgd2luZG93V2lkdGggID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmKGZ1bGxXaW5kb3dGcmFtZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNldFNpemUod2luZG93V2lkdGgsd2luZG93SGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgIHVwZGF0ZUNhbWVyYVJhdGlvKCk7XG4gICAgICAgICAgICAgICAgdXBkYXRlVmlld3BvcnRHTCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcHBPYmoub25XaW5kb3dSZXNpemUoZSk7XG5cbiAgICAgICAgICAgIGlmKCFmdWxsV2luZG93RnJhbWUgJiYgKHNlbGYuX3dpZHRoID09IHdpbmRvd1dpZHRoICYmIHNlbGYuX2hlaWdodCA9PSB3aW5kb3dIZWlnaHQpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUNhbWVyYVJhdGlvKCk7XG4gICAgICAgICAgICAgICAgdXBkYXRlVmlld3BvcnRHTCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIGlmKHRoaXMuX2JVcGRhdGUpXG4gICAge1xuICAgICAgICB2YXIgdGltZSwgdGltZURlbHRhO1xuICAgICAgICB2YXIgdGltZUludGVydmFsID0gdGhpcy5fdGltZUludGVydmFsO1xuICAgICAgICB2YXIgdGltZU5leHQ7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSxudWxsKTtcblxuICAgICAgICAgICAgdGltZSAgICAgID0gc2VsZi5fdGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aW1lRGVsdGEgPSB0aW1lIC0gc2VsZi5fdGltZU5leHQ7XG5cbiAgICAgICAgICAgIHNlbGYuX3RpbWVEZWx0YSA9IE1hdGgubWluKHRpbWVEZWx0YSAvIHRpbWVJbnRlcnZhbCwgMSk7XG5cbiAgICAgICAgICAgIGlmKHRpbWVEZWx0YSA+IHRpbWVJbnRlcnZhbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aW1lTmV4dCA9IHNlbGYuX3RpbWVOZXh0ID0gdGltZSAtICh0aW1lRGVsdGEgJSB0aW1lSW50ZXJ2YWwpO1xuXG4gICAgICAgICAgICAgICAgYXBwT2JqLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5fdGltZUVsYXBzZWQgPSAodGltZU5leHQgLSBzZWxmLl90aW1lU3RhcnQpIC8gMTAwMC4wO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZyYW1lbnVtKys7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoKTtcblxuICAgIH1cbiAgICBlbHNlIGFwcE9iai51cGRhdGUoKTtcblxuICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG5cbn07XG5cblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGFwcE9iailcbntcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLGZ1bmN0aW9uKCl7c2VsZi5faW5pdChhcHBPYmopO30pO1xufTtcblxuQXBwSW1wbFdlYi5wcm90b3R5cGUuX3VwZGF0ZUNhbnZhczNkU2l6ZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzM2QsXG4gICAgICAgIHdpZHRoICA9IHRoaXMuX3dpZHRoLFxuICAgICAgICBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG5cbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoICA9IHdpZHRoICArICdweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgICAgICBjYW52YXMud2lkdGggICAgICAgID0gd2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgICAgICAgPSBoZWlnaHQ7XG59O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVFbGFwc2VkO307XG5BcHBJbXBsV2ViLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVEZWx0YTt9O1xuXG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRNb3VzZUxpc3RlbmVyVGFyZ2V0ID0gZnVuY3Rpb24ob2JqKXt0aGlzLl9tb3VzZUV2ZW50VGFyZ2V0ID0gb2JqO307XG5BcHBJbXBsV2ViLnByb3RvdHlwZS5zZXRLZXlMaXN0ZW5lclRhcmdldCAgID0gZnVuY3Rpb24ob2JqKXt0aGlzLl9rZXlFdmVudFRhcmdldCA9IG9iajt9O1xuQXBwSW1wbFdlYi5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lICAgICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuX2lzRnVsbFdpbmRvd0ZyYW1lID0gYm9vbDtyZXR1cm4gdHJ1ZTt9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwSW1wbFdlYjtcblxuIiwidmFyIGtFcnJvciAgICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtFcnJvcicpLFxuICAgIFBsYXRmb3JtICAgICA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtQbGF0Zm9ybScpLFxuICAgIEFwcEltcGxXZWIgICA9IHJlcXVpcmUoJy4vZ2xrQXBwSW1wbFdlYicpLFxuICAgIEFwcEltcGxQbGFzayA9IHJlcXVpcmUoJy4vZ2xrQXBwSW1wbFBsYXNrJyksXG4gICAgTW91c2UgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9nbGtNb3VzZScpLFxuICAgIENhbWVyYUJhc2ljICA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dsa0NhbWVyYUJhc2ljJyk7XG5cblxuZnVuY3Rpb24gQXBwbGljYXRpb24oKVxue1xuICAgIGlmKEFwcGxpY2F0aW9uLl9faW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKGtFcnJvci5DTEFTU19JU19TSU5HTEVUT04pO1xuXG4gICAgdmFyIHRhcmdldCAgPSBQbGF0Zm9ybS5nZXRUYXJnZXQoKTtcbiAgICBpZih0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyApdGhyb3cgbmV3IEVycm9yKGtFcnJvci5XUk9OR19QTEFURk9STSk7XG5cbiAgICB0aGlzLl9hcHBJbXBsID0gdGFyZ2V0ID09IFBsYXRmb3JtLldFQiAgID8gbmV3IEFwcEltcGxXZWIoYXJndW1lbnRzKSA6XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9PSBQbGF0Zm9ybS5QTEFTSyA/IG5ldyBBcHBJbXBsUGxhc2soYXJndW1lbnRzKSA6XG4gICAgICAgICAgICAgICAgICAgIG51bGw7XG5cbiAgICB0aGlzLm1vdXNlICA9IG5ldyBNb3VzZSgpO1xuICAgIHRoaXMua2dsICAgID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG5cbiAgICBBcHBsaWNhdGlvbi5fX2luc3RhbmNlID0gdGhpcztcbn1cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldHVwICA9IGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKGtFcnJvci5BUFBfTk9fU0VUVVApO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3Ioa0Vycm9yLkFQUF9OT19VUERBVEUpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24od2lkdGgsaGVpZ2h0KVxue1xuICAgIHZhciBhcHBJbXBsID0gdGhpcy5fYXBwSW1wbDtcbiAgICAgICAgYXBwSW1wbC5zZXRTaXplKHdpZHRoLGhlaWdodCk7XG5cbiAgICBpZighYXBwSW1wbC5pc0luaXRpYWxpemVkKCkpYXBwSW1wbC5pbml0KHRoaXMpO1xufTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRXaWR0aCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpZHRoKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEhlaWdodCgpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXRVcGRhdGUgPSBmdW5jdGlvbihib29sKXt0aGlzLl9hcHBJbXBsLnNldFVwZGF0ZShib29sKTt9O1xuXG5cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldFdpbmRvd1RpdGxlICAgICAgID0gZnVuY3Rpb24odGl0bGUpe3RoaXMuX2FwcEltcGwuc2V0V2luZG93VGl0bGUodGl0bGUpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUucmVzdHJpY3RNb3VzZVRvRnJhbWUgPSBmdW5jdGlvbihib29sKSB7dGhpcy5fYXBwSW1wbC5yZXN0cmljdE1vdXNlVG9GcmFtZShib29sKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0RnVsbFdpbmRvd0ZyYW1lICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEZ1bGxXaW5kb3dGcmFtZShib29sKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLnNldEZ1bGxzY3JlZW4gICAgICAgPSBmdW5jdGlvbihib29sKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5zZXRGdWxsc2NyZWVuKHRydWUpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuaXNGdWxsc2NyZWVuICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzRnVsbHNjcmVlbigpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0Qm9yZGVybGVzcyAgICAgICA9IGZ1bmN0aW9uKGJvb2wpe3JldHVybiB0aGlzLl9hcHBJbXBsLnNldEJvcmRlcmxlc3MoYm9vbCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc0JvcmRlcmxlc3MgICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNCb3JkZXJsZXNzKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24obnVtKSB7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RGlzcGxheShudW0pO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RGlzcGxheSAgICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmdldERpc3BsYXkoKTt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2V0VGFyZ2V0RlBTID0gZnVuY3Rpb24oZnBzKXt0aGlzLl9hcHBJbXBsLnNldFRhcmdldEZQUyhmcHMpO307XG5cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLmlzS2V5RG93biAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNLZXlEb3duKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc01vdXNlRG93biAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VEb3duKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pc01vdXNlTW92ZSAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmlzTW91c2VNb3ZlKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRLZXlTdHIgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleVN0cigpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0S2V5Q29kZSAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRLZXlDb2RlKCk7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRNb3VzZVdoZWVsRGVsdGEgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldE1vdXNlV2hlZWxEZWx0YSgpO307XG5cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uS2V5RG93biAgICA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25LZXlVcCAgICAgID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlVXAgICAgPSBmdW5jdGlvbihlKXt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLm9uTW91c2VEb3duICA9IGZ1bmN0aW9uKGUpe307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25Nb3VzZVdoZWVsID0gZnVuY3Rpb24oZSl7fTtcbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5vbk1vdXNlTW92ZSAgPSBmdW5jdGlvbihlKXt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUub25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbihlKXt9O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEZyYW1lc0VsYXBzZWQoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFNlY29uZHNFbGFwc2VkID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRTZWNvbmRzRWxhcHNlZCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZSAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWUoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWVTdGFydCAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lU3RhcnQoKTt9O1xuQXBwbGljYXRpb24ucHJvdG90eXBlLmdldFRpbWVOZXh0ICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRUaW1lTmV4dCgpO307XG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVEZWx0YSgpO307XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5nZXRBc3BlY3RSYXRpb1dpbmRvdyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0QXNwZWN0UmF0aW8oKTt9O1xuXG5BcHBsaWNhdGlvbi5fX2luc3RhbmNlID0gbnVsbDtcbkFwcGxpY2F0aW9uLmdldEluc3RhbmNlID0gZnVuY3Rpb24oKXtyZXR1cm4gQXBwbGljYXRpb24uX19pbnN0YW5jZTt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uO1xuXG5cblxuXG5cbiIsImZ1bmN0aW9uIEdlb20zZCgpXG57XG4gICAgdGhpcy52ZXJ0aWNlcyAgPSBudWxsO1xuICAgIHRoaXMubm9ybWFscyAgID0gbnVsbDtcbiAgICB0aGlzLmNvbG9ycyAgICA9IG51bGw7XG4gICAgdGhpcy5pbmRpY2VzICAgPSBudWxsO1xuICAgIHRoaXMudGV4Q29vcmRzID0gbnVsbDtcbn1cblxuLy9UT0RPIG1lcmdlXG5HZW9tM2QucHJvdG90eXBlLnVwZGF0ZVZlcnRleE5vcm1hbHMgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGluZGljZXMgID0gdGhpcy5pbmRpY2VzLFxuICAgICAgICB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXMsXG4gICAgICAgIG5vcm1hbHMgID0gdGhpcy5ub3JtYWxzO1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIGEsIGIsIGM7XG4gICAgdmFyIGUyeCwgZTJ5LCBlMnosXG4gICAgICAgIGUxeCwgZTF5LCBlMXo7XG5cbiAgICB2YXIgbngsIG55LCBueixcbiAgICAgICAgdmJ4LCB2YnksIHZieixcbiAgICAgICAgYTAsIGExLCBhMixcbiAgICAgICAgYjAsIGIxLCBiMixcbiAgICAgICAgYzAsIGMxLCBjMjtcblxuICAgIGkgPSAwO1xuICAgIHdoaWxlKCBpIDwgbm9ybWFscy5sZW5ndGggKVxuICAgIHtcbiAgICAgICAgbm9ybWFsc1tpXSA9IG5vcm1hbHNbaSsxXSA9IG5vcm1hbHNbaSsyXSA9IDAuMDtcbiAgICAgICAgaSs9MztcbiAgICB9XG5cbiAgICBpID0gMDtcbiAgICB3aGlsZSggaSA8IGluZGljZXMubGVuZ3RoIClcbiAgICB7XG4gICAgICAgIGEgPSBpbmRpY2VzW2kgIF0qMztcbiAgICAgICAgYiA9IGluZGljZXNbaSsxXSozO1xuICAgICAgICBjID0gaW5kaWNlc1tpKzJdKjM7XG5cbiAgICAgICAgYTAgPSBhO1xuICAgICAgICBhMSA9IGErMTtcbiAgICAgICAgYTIgPSBhKzI7XG5cbiAgICAgICAgYjAgPSBiO1xuICAgICAgICBiMSA9IGIrMTtcbiAgICAgICAgYjIgPSBiKzI7XG5cbiAgICAgICAgYzAgPSBjO1xuICAgICAgICBjMSA9IGMrMTtcbiAgICAgICAgYzIgPSBjKzI7XG5cbiAgICAgICAgdmJ4ID0gdmVydGljZXNbYjBdO1xuICAgICAgICB2YnkgPSB2ZXJ0aWNlc1tiMV07XG4gICAgICAgIHZieiA9IHZlcnRpY2VzW2IyXTtcblxuICAgICAgICBlMXggPSB2ZXJ0aWNlc1thMF0tdmJ4O1xuICAgICAgICBlMXkgPSB2ZXJ0aWNlc1thMV0tdmJ5O1xuICAgICAgICBlMXogPSB2ZXJ0aWNlc1thMl0tdmJ6O1xuXG4gICAgICAgIGUyeCA9IHZlcnRpY2VzW2MwXS12Yng7XG4gICAgICAgIGUyeSA9IHZlcnRpY2VzW2MxXS12Ynk7XG4gICAgICAgIGUyeiA9IHZlcnRpY2VzW2MyXS12Yno7XG5cbiAgICAgICAgbnggPSBlMXkgKiBlMnogLSBlMXogKiBlMnk7XG4gICAgICAgIG55ID0gZTF6ICogZTJ4IC0gZTF4ICogZTJ6O1xuICAgICAgICBueiA9IGUxeCAqIGUyeSAtIGUxeSAqIGUyeDtcblxuICAgICAgICBub3JtYWxzW2EwXSArPSBueDtcbiAgICAgICAgbm9ybWFsc1thMV0gKz0gbnk7XG4gICAgICAgIG5vcm1hbHNbYTJdICs9IG56O1xuXG4gICAgICAgIG5vcm1hbHNbYjBdICs9IG54O1xuICAgICAgICBub3JtYWxzW2IxXSArPSBueTtcbiAgICAgICAgbm9ybWFsc1tiMl0gKz0gbno7XG5cbiAgICAgICAgbm9ybWFsc1tjMF0gKz0gbng7XG4gICAgICAgIG5vcm1hbHNbYzFdICs9IG55O1xuICAgICAgICBub3JtYWxzW2MyXSArPSBuejtcblxuICAgICAgICBpKz0zO1xuICAgIH1cblxuICAgIHZhciB4LCB5LCB6LCBsO1xuXG4gICAgaSA9IDA7XG4gICAgd2hpbGUoaSA8IG5vcm1hbHMubGVuZ3RoKVxuICAgIHtcblxuICAgICAgICB4ID0gbm9ybWFsc1tpICBdO1xuICAgICAgICB5ID0gbm9ybWFsc1tpKzFdO1xuICAgICAgICB6ID0gbm9ybWFsc1tpKzJdO1xuXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgICAgICBsID0gMSAvIChsIHx8IDEpO1xuXG4gICAgICAgIG5vcm1hbHNbaSAgXSAqPSBsO1xuICAgICAgICBub3JtYWxzW2krMV0gKj0gbDtcbiAgICAgICAgbm9ybWFsc1tpKzJdICo9IGw7XG5cbiAgICAgICAgaSs9MztcbiAgICB9XG5cbn07XG5cblxuR2VvbTNkLnByb3RvdHlwZS5zZXRWZXJ0ZXggPSBmdW5jdGlvbihpbmRleCx2KVxue1xuICAgIGluZGV4ICo9IDM7XG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcbiAgICB2ZXJ0aWNlc1tpbmRleCAgXSA9IHZbMF07XG4gICAgdmVydGljZXNbaW5kZXgrMV0gPSB2WzFdO1xuICAgIHZlcnRpY2VzW2luZGV4KzJdID0gdlsyXTtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0VmVydGV4M2YgPSBmdW5jdGlvbihpbmRleCx4LHkseilcbntcbiAgICBpbmRleCo9MztcbiAgICB2YXIgdmVydGljZXMgPSB0aGlzLnZlcnRpY2VzO1xuICAgIHZlcnRpY2VzW2luZGV4ICBdID0geDtcbiAgICB2ZXJ0aWNlc1tpbmRleCsxXSA9IHk7XG4gICAgdmVydGljZXNbaW5kZXgrMl0gPSB6O1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRDb2xvcjRmID0gZnVuY3Rpb24oaW5kZXgscixnLGIsYSlcbntcbiAgICBpbmRleCAqPSA0O1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgICBjb2xvcnNbaW5kZXggIF0gPSByO1xuICAgIGNvbG9yc1tpbmRleCsxXSA9IGc7XG4gICAgY29sb3JzW2luZGV4KzJdID0gYjtcbiAgICBjb2xvcnNbaW5kZXgrM10gPSBhO1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRDb2xvcjNmID0gZnVuY3Rpb24oaW5kZXgscixnLGIpXG57XG4gICAgaW5kZXggKj0gNDtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgY29sb3JzW2luZGV4ICBdID0gcjtcbiAgICBjb2xvcnNbaW5kZXgrMV0gPSBnO1xuICAgIGNvbG9yc1tpbmRleCsyXSA9IGI7XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldENvbG9yMmYgPSBmdW5jdGlvbihpbmRleCxrLGEpXG57XG4gICAgaW5kZXggKj0gNDtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgY29sb3JzW2luZGV4ICBdID0gaztcbiAgICBjb2xvcnNbaW5kZXgrMV0gPSBrO1xuICAgIGNvbG9yc1tpbmRleCsyXSA9IGs7XG4gICAgY29sb3JzW2luZGV4KzNdID0gYTtcbn07XG5cbkdlb20zZC5wcm90b3R5cGUuc2V0Q29sb3IxZiA9IGZ1bmN0aW9uKGluZGV4LGspXG57XG4gICAgaW5kZXggKj0gNDtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG4gICAgY29sb3JzW2luZGV4ICBdID0gaztcbiAgICBjb2xvcnNbaW5kZXgrMV0gPSBrO1xuICAgIGNvbG9yc1tpbmRleCsyXSA9IGs7XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldENvbG9yID0gZnVuY3Rpb24oaW5kZXgsY29sb3IpXG57XG4gICAgaW5kZXgqPTQ7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuICAgIGNvbG9yc1tpbmRleCAgXSA9IGNvbG9yWzBdO1xuICAgIGNvbG9yc1tpbmRleCsxXSA9IGNvbG9yWzFdO1xuICAgIGNvbG9yc1tpbmRleCsyXSA9IGNvbG9yWzJdO1xuICAgIGNvbG9yc1tpbmRleCszXSA9IGNvbG9yWzNdO1xufTtcblxuR2VvbTNkLnByb3RvdHlwZS5zZXRUZXhDb29yZDJmID0gZnVuY3Rpb24oaW5kZXgsdSx2KVxue1xuICAgIGluZGV4Kj0yO1xuICAgIHZhciB0ZXhDb29yZHMgPSB0aGlzLnRleENvb3JkcztcbiAgICB0ZXhDb29yZHNbaW5kZXggIF0gPSB1O1xuICAgIHRleENvb3Jkc1tpbmRleCsxXSA9IHY7XG59O1xuXG5HZW9tM2QucHJvdG90eXBlLnNldFRleENvb3JkID0gZnVuY3Rpb24oaW5kZXgsdilcbntcbiAgICBpbmRleCo9MjtcbiAgICB2YXIgdGV4Q29vcmRzID0gdGhpcy50ZXhDb29yZHM7XG4gICAgdGV4Q29vcmRzW2luZGV4ICBdID0gdlswXTtcbiAgICB0ZXhDb29yZHNbaW5kZXgrMV0gPSB2WzFdO1xufTtcblxuXG5HZW9tM2QucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oZ2wpXG57XG4gICAgZ2wuZHJhd0VsZW1lbnRzKHRoaXMudmVydGljZXMsdGhpcy5ub3JtYWxzLHRoaXMuY29sb3JzLHRoaXMudGV4Q29vcmRzLHRoaXMuaW5kaWNlcyxnbC5fZHJhd01vZGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW9tM2Q7IiwidmFyIEdlb20zZCA9IHJlcXVpcmUoJy4vZ2xrR2VvbTNkJyk7XG5cbmZ1bmN0aW9uIElTT0JhbmQoc2l6ZVgsc2l6ZVosdW5pdFNjYWxlWCx1bml0U2NhbGVaKVxue1xuICAgIHRoaXMuX3ZlcnRTaXplWCAgPSBudWxsO1xuICAgIHRoaXMuX3ZlcnRTaXplWiAgPSBudWxsO1xuICAgIHRoaXMuX3VuaXRTY2FsZVggPSAxO1xuICAgIHRoaXMuX3VuaXRTY2FsZVogPSAxO1xuXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpXG4gICAge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVogPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVYID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5fdmVydFNpemVaID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWiA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIHRoaXMuX3VuaXRTY2FsZVggPSB0aGlzLl91bml0U2NhbGVaID0gYXJndW1lbnRzWzJdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCAgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVogID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgdGhpcy5fdW5pdFNjYWxlWCA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgICAgIHRoaXMuX3VuaXRTY2FsZVogPSBhcmd1bWVudHNbM107XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVogPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICB0aGlzLl9jZWxsU2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVggLSAxO1xuICAgIHRoaXMuX2NlbGxTaXplWiA9IHRoaXMuX3ZlcnRTaXplWiAtIDE7XG5cbiAgICB0aGlzLl9mdW5jICAgICA9IGZ1bmN0aW9uKHgseSxhcmcwLGFyZzEsYXJnMil7cmV0dXJuIDA7fTtcbiAgICB0aGlzLl9mdW5jQXJnMCA9IDA7XG4gICAgdGhpcy5fZnVuY0FyZzEgPSAwO1xuICAgIHRoaXMuX2Z1bmNBcmcyID0gMDtcbiAgICB0aGlzLl9pc29MZXZlbCA9IDA7XG5cbiAgICB0aGlzLl9pbnRlcnBvbGF0ZVZhbHVlcyA9IHRydWU7XG5cbiAgICB0aGlzLl9udW1UcmlhbmdsZXMgPSAwO1xuXG4gICAgLy9UT0RPIENIRUNLIE1BWCBFTEVNRU5UIEVYQ0VFRFxuICAgIHRoaXMuX3ZlcnRzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl92ZXJ0U2l6ZVggKiB0aGlzLl92ZXJ0U2l6ZVogKiA0KTsgLy8gZ3JpZCBjYWxjdWxhdGVkIG5vcm0gdmFsdWVzICsgZnVuY3Rpb24gcmVzdWx0IHZhbHVlIC4uLix4LHkseix2LC4uLlxuICAgIHRoaXMuX2NlbGxzID0gbmV3IEFycmF5KHRoaXMuX2NlbGxTaXplWCAqIHRoaXMuX2NlbGxTaXplWik7XG5cbiAgICB0aGlzLl9lZGdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoKHRoaXMuX2NlbGxTaXplWiAqIHRoaXMuX2NlbGxTaXplWCAqIDIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2VsbFNpemVaICsgdGhpcy5fY2VsbFNpemVYKSAqIDMpO1xuXG5cbiAgICB0aGlzLl90ZW1wQ2VsbFZlcnRpY2VzVmFscyA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG5cbiAgICB0aGlzLl9pbmRpY2VzID0gW107XG5cbiAgICAvKlxuICAgIC8vdGVtcCBUT0RPIHJlbW92ZVxuICAgIHRoaXMuX19hcHBVaW50VHlwZUVuYWJsZWQgPSBHTEtpdC5BcHBsaWNhdGlvbi5nZXRJbnN0YW5jZSgpLmdsLmlzVUludEVsZW1lbnRUeXBlQXZhaWxhYmxlKCk7XG4gICAgKi9cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIHRoaXMuX2dlblN1cmZhY2UoKTtcbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09CYW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VvbTNkLnByb3RvdHlwZSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4vL2RvbnQgbmVlZCB0aGlzXG5JU09CYW5kLnByb3RvdHlwZS5zZXRGdW5jdGlvbiA9IGZ1bmN0aW9uKGZ1bmMsaXNvTGV2ZWwpXG57XG4gICAgdmFyIGZ1bmNBcmdzTGVuZ3RoID0gZnVuYy5sZW5ndGg7XG5cbiAgICBpZihmdW5jQXJnc0xlbmd0aCA8IDIpdGhyb3cgJ0Z1bmN0aW9uIHNob3VsZCBzYXRpc2Z5IGZ1bmN0aW9uKHgseSl7fSc7XG4gICAgaWYoZnVuY0FyZ3NMZW5ndGggPiA1KXRocm93ICdGdW5jdGlvbiBoYXMgdG8gbWFueSBhcmd1bWVudHMuIEFyZ3VtZW50cyBsZW5ndGggc2hvdWxkIG5vdCBleGNlZWQgNS4gRS5nIGZ1bmN0aW9uKHgseSxhcmcwLGFyZzEsYXJnMikuJztcblxuICAgIHZhciBmdW5jU3RyaW5nID0gZnVuYy50b1N0cmluZygpLFxuICAgICAgICBmdW5jQXJncyAgID0gZnVuY1N0cmluZy5zbGljZShmdW5jU3RyaW5nLmluZGV4T2YoJygnKSArIDEsIGZ1bmNTdHJpbmcuaW5kZXhPZignKScpKS5zcGxpdCgnLCcpLFxuICAgICAgICBmdW5jQm9keSAgID0gZnVuY1N0cmluZy5zbGljZShmdW5jU3RyaW5nLmluZGV4T2YoJ3snKSArIDEsIGZ1bmNTdHJpbmcubGFzdEluZGV4T2YoJ30nKSk7XG5cbiAgICB0aGlzLl9mdW5jICAgICA9IG5ldyBGdW5jdGlvbihmdW5jQXJnc1swXSwgZnVuY0FyZ3NbMV0sXG4gICAgICAgIGZ1bmNBcmdzWzJdIHx8ICdhcmcwJywgZnVuY0FyZ3NbM10gfHwgJ2FyZzEnLCBmdW5jQXJnc1s0XSB8fCAnYXJnMicsXG4gICAgICAgIGZ1bmNCb2R5KTtcbiAgICB0aGlzLl9pc29MZXZlbCA9IGlzb0xldmVsIHx8IDA7XG5cblxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gU2V0dXAgcG9pbnRzXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT0JhbmQucHJvdG90eXBlLl9nZW5TdXJmYWNlID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciB2ZXJ0U2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVgsXG4gICAgICAgIHZlcnRTaXplWiA9IHRoaXMuX3ZlcnRTaXplWjtcblxuICAgIHZhciBjZWxsU2l6ZVggPSB0aGlzLl9jZWxsU2l6ZVgsXG4gICAgICAgIGNlbGxTaXplWiA9IHRoaXMuX2NlbGxTaXplWjtcblxuICAgIHZhciBzY2FsZVggPSB0aGlzLl91bml0U2NhbGVYLFxuICAgICAgICBzY2FsZVogPSB0aGlzLl91bml0U2NhbGVaO1xuXG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHMsXG4gICAgICAgIHZlcnRzSW5kZXgsXG4gICAgICAgIHZlcnRzSW5kZXhSb3dOZXh0LFxuICAgICAgICBjZWxscyA9IHRoaXMuX2NlbGxzLFxuICAgICAgICBjZWxsc0luZGV4O1xuXG4gICAgdmFyIGksajtcblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSgrK2kgPCB2ZXJ0U2l6ZVopXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHZlcnRTaXplWClcbiAgICAgICAge1xuICAgICAgICAgICAgdmVydHNJbmRleCAgICAgICAgICA9ICh2ZXJ0U2l6ZVggKiBpICsgaikqNDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXggIF0gPSAoLTAuNSArIChqLyh2ZXJ0U2l6ZVggLSAxKSkpICogc2NhbGVYO1xuICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleCsxXSA9IDA7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4KzJdID0gKC0wLjUgKyAoaS8odmVydFNpemVaIC0gMSkpKSAqIHNjYWxlWjtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXgrM10gPSAtMTtcblxuICAgICAgICAgICAgaWYoaSA8IGNlbGxTaXplWiAmJiBqIDwgY2VsbFNpemVYKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZlcnRzSW5kZXhSb3dOZXh0ID0gKHZlcnRTaXplWCAqIGkgKyBqICsgdmVydFNpemVYKSAqIDQ7XG5cbiAgICAgICAgICAgICAgICBjZWxsc0luZGV4ICAgICAgICA9IGNlbGxTaXplWCAqIGkgKyBqO1xuICAgICAgICAgICAgICAgIGNlbGxzW2NlbGxzSW5kZXhdID0gW3ZlcnRzSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIDQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleFJvd05leHQgKyA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXhSb3dOZXh0IF07XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGFwcGx5IGZ1bmN0aW9uIHRvIGRhdGEgcG9pbnRzXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbklTT0JhbmQucHJvdG90eXBlLmFwcGx5RnVuY3Rpb24gPSBmdW5jdGlvbihhcmcwLGFyZzEsYXJnMilcbntcbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cyxcbiAgICAgICAgdmVydHNJbmRleDtcblxuICAgIHZhciB2ZXJ0U2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVgsXG4gICAgICAgIHZlcnRTaXplWiA9IHRoaXMuX3ZlcnRTaXplWjtcblxuICAgIHZhciBpLCBqO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHZlcnRTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgdmVydFNpemVYKVxuICAgICAgICB7XG4gICAgICAgICAgICB2ZXJ0c0luZGV4ID0gKHZlcnRTaXplWCAqIGkgKyBqKSAqIDQ7XG4gICAgICAgICAgICB2ZXJ0c1t2ZXJ0c0luZGV4ICsgM10gPSB0aGlzLl9mdW5jKHZlcnRzW3ZlcnRzSW5kZXhdLHZlcnRzW3ZlcnRzSW5kZXgrMl0sYXJnMCxhcmcxLGFyZzIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tYXJjaCgpO1xufTtcblxuSVNPQmFuZC5wcm90b3R5cGUuYXBwbHlGdW5jdGlvbk11bHQgPSBmdW5jdGlvbihhcmcwLGFyZzEsYXJnMilcbntcbiAgICB2YXIgdmVydHMgPSB0aGlzLl92ZXJ0cyxcbiAgICAgICAgdmVydHNJbmRleDtcblxuICAgIHZhciB2ZXJ0c1NpemVYID0gdGhpcy5fdmVydFNpemVYLFxuICAgICAgICB2ZXJ0c1NpemVaID0gdGhpcy5fdmVydFNpemVaO1xuXG4gICAgdmFyIGksIGo7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgdmVydHNTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgdmVydHNTaXplWClcbiAgICAgICAge1xuICAgICAgICAgICAgdmVydHNJbmRleCA9ICh2ZXJ0c1NpemVYICogaSArIGopICogNDtcbiAgICAgICAgICAgIHZlcnRzW3ZlcnRzSW5kZXggKyAzXSAqPSB0aGlzLl9mdW5jKHZlcnRzW3ZlcnRzSW5kZXhdLHZlcnRzW3ZlcnRzSW5kZXgrMl0sYXJnMCxhcmcxLGFyZzIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tYXJjaCgpO1xufTtcblxuSVNPQmFuZC5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGRhdGEsd2lkdGgsaGVpZ2h0KVxue1xuXG4gICAgdmFyIHZlcnRzU2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVgsXG4gICAgICAgIHZlcnRzU2l6ZVogPSB0aGlzLl92ZXJ0U2l6ZVo7XG5cbiAgICBpZih3aWR0aCA+IHZlcnRzU2l6ZVogfHwgaGVpZ2h0ID4gdmVydHNTaXplWClcbiAgICAgICAgdGhyb3cgJ0RhdGEgZXhjZWVkcyBidWZmZXIgc2l6ZS4gU2hvdWxkIG5vdCBleGNlZWQgJyArIHZlcnRzU2l6ZVogKyAnIGluIHdpZHRoIGFuZCAnICsgdmVydHNTaXplWCArICcgaW4gaGVpZ2h0JztcblxuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzO1xuXG4gICAgdmFyIGkgLGo7XG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHdpZHRoKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBoZWlnaHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZlcnRzWyhoZWlnaHQgKiBpICsgaikgKiA0ICsgM10gPSBkYXRhW2hlaWdodCAqIGkgKyBqXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBtYXJjaFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09CYW5kLnByb3RvdHlwZS5tYXJjaCA9IGZ1bmN0aW9uKClcbntcbiAgICAvL3Jlc2V0IGluZGljZXNcbiAgICB2YXIgaW5kaWNlcyA9IHRoaXMuX2luZGljZXMgPSBbXTtcblxuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzO1xuXG4gICAgdmFyIGksIGosIGs7XG5cbiAgICB2YXIgY2VsbHMgICAgPSB0aGlzLl9jZWxscyxcbiAgICAgICAgaW5kaWNlcyAgPSB0aGlzLl9pbmRpY2VzO1xuXG4gICAgdmFyIGNlbGxTaXplWCA9IHRoaXMuX2NlbGxTaXplWCxcbiAgICAgICAgY2VsbFNpemVaID0gdGhpcy5fY2VsbFNpemVaO1xuXG4gICAgdmFyIGNlbGxJbmRleCxcbiAgICAgICAgY2VsbCxcbiAgICAgICAgY2VsbFN0YXRlO1xuXG4gICAgLy9DZWxsIHZlcnRleCBpbmRpY2VzIGluIGdsb2JhbCB2ZXJ0aWNlc1xuICAgIHZhciB2MEluZGV4LCAgLy8gMCAxXG4gICAgICAgIHYxSW5kZXgsICAvLyAzIDJcbiAgICAgICAgdjJJbmRleCxcbiAgICAgICAgdjNJbmRleDtcblxuICAgIC8vQ2VsbCB2ZXJ0ZXggdmFsdWVzIC4uLix4LHkseixWQUxVRSwuLi5cbiAgICB2YXIgdlZhbHMgPSB0aGlzLl90ZW1wQ2VsbFZlcnRpY2VzVmFscyxcbiAgICAgICAgdjBWYWwsdjFWYWwsdjJWYWwsdjNWYWw7XG5cbiAgICAvL1RvcG9sb2dpYyBlbnRyeSAvIGxvb2t1cFxuICAgIHZhciBlbnRyeVRvcEx1LFxuICAgICAgICBJU09CQU5EX1RPUF9MVSAgICAgPSBJU09CYW5kLlRPUF9UQUJMRTtcblxuICAgIHZhciBlbnRyeVRvcEx1MCxcbiAgICAgICAgZW50cnlUb3BMdTEsXG4gICAgICAgIGVudHJ5VG9wTHUyLFxuICAgICAgICBlbnRyeVRvcEx1MztcblxuICAgIHZhciBlZGdlSW5kZXhUb3AsXG4gICAgICAgIGVkZ2VJbmRleFJpZ2h0LFxuICAgICAgICBlZGdlSW5kZXhCb3R0b20sXG4gICAgICAgIGVkZ2VJbmRleExlZnQsXG4gICAgICAgIGVkZ2VJbmRleFRlbXA7XG5cbiAgICB2YXIgZWRnZXMgPSB0aGlzLl9lZGdlcztcblxuXG4gICAgLy9cbiAgICAvLyAgMCAtLS0tLS0tIDFcbiAgICAvLyAgfCAgICAwICAgIHxcbiAgICAvLyAgfCAxICAgICAgIHwgMlxuICAgIC8vICB8ICAgICAgICAgfFxuICAgIC8vICAzIC0tLS0tLS0gMlxuICAgIC8vICAgICAgIDNcblxuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IGNlbGxTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgY2VsbFNpemVYKVxuICAgICAgICB7XG4gICAgICAgICAgICBjZWxsSW5kZXggICAgICAgID0gY2VsbFNpemVYICogaSArIGo7XG4gICAgICAgICAgICBjZWxsICAgICAgICAgICAgID0gY2VsbHNbY2VsbEluZGV4XTtcblxuICAgICAgICAgICAgdjBJbmRleCA9IGNlbGxbMF07XG4gICAgICAgICAgICB2MUluZGV4ID0gY2VsbFsxXTtcbiAgICAgICAgICAgIHYySW5kZXggPSBjZWxsWzJdO1xuICAgICAgICAgICAgdjNJbmRleCA9IGNlbGxbM107XG5cbiAgICAgICAgICAgIHYwVmFsID0gdlZhbHNbMF0gPSB2ZXJ0c1t2MEluZGV4ICsgM107XG4gICAgICAgICAgICB2MVZhbCA9IHZWYWxzWzFdID0gdmVydHNbdjFJbmRleCArIDNdO1xuICAgICAgICAgICAgdjJWYWwgPSB2VmFsc1syXSA9IHZlcnRzW3YySW5kZXggKyAzXTtcbiAgICAgICAgICAgIHYzVmFsID0gdlZhbHNbM10gPSB2ZXJ0c1t2M0luZGV4ICsgM107XG5cbiAgICAgICAgICAgIGNlbGxTdGF0ZSA9ICh2MFZhbCA+IDApIDw8IDMgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKHYxVmFsID4gMCkgPDwgMiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAodjJWYWwgPiAwKSA8PCAxIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICh2M1ZhbCA+IDApO1xuXG4gICAgICAgICAgICBpZihjZWxsU3RhdGUgPT0gMCljb250aW51ZTtcblxuICAgICAgICAgICAgZWRnZUluZGV4VG9wICAgID0gY2VsbEluZGV4ICsgKGNlbGxTaXplWCArIDEpICogaTtcbiAgICAgICAgICAgIGVkZ2VJbmRleFJpZ2h0ICA9IGVkZ2VJbmRleFRvcCAgICsgY2VsbFNpemVYICsgMTtcbiAgICAgICAgICAgIGVkZ2VJbmRleEJvdHRvbSA9IGVkZ2VJbmRleFJpZ2h0ICsgY2VsbFNpemVYO1xuICAgICAgICAgICAgZWRnZUluZGV4TGVmdCAgID0gZWRnZUluZGV4UmlnaHQgLSAxO1xuXG4gICAgICAgICAgICBlbnRyeVRvcEx1ID0gSVNPQkFORF9UT1BfTFVbY2VsbFN0YXRlXTtcblxuICAgICAgICAgICAgLy9jZWxsIHVwcGVyIGxlZnRcbiAgICAgICAgICAgIGsgPSAwO1xuICAgICAgICAgICAgaWYoaSA9PSAwICYmIGogPT0gMClcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGsgPCBlbnRyeVRvcEx1Lmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUwID0gZW50cnlUb3BMdVtrICBdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MSA9IGVudHJ5VG9wTHVbaysxXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPSBlbnRyeVRvcEx1W2srMl07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUzID0gZW50cnlUb3BMdVtrKzNdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vZ2V0IGVkZ2UgdmVydGV4IDAgYWNjb3JkaW5nIHRvIHRvcG9sb2dpY2FsIGVudHJ5XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETyBjb2xsYXBzZVxuICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTAgPT0gMCA/IGVkZ2VJbmRleFRvcCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9PSAxID8gZWRnZUluZGV4UmlnaHQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPT0gMiA/IGVkZ2VJbmRleEJvdHRvbSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhMZWZ0O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUwXSxjZWxsW2VudHJ5VG9wTHUxXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKTtcblxuICAgICAgICAgICAgICAgICAgICAvL2dldCBlZGdlIHZlcnRleCAxIGFjY29yZGluZyB0byB0b3BvbG9naWNhbCBlbnRyeVxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gY29sbGFwc2VcbiAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUyID09IDAgPyBlZGdlSW5kZXhUb3AgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTIgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID09IDIgPyBlZGdlSW5kZXhCb3R0b20gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4TGVmdDtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1Ml0sY2VsbFtlbnRyeVRvcEx1M10sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgayArPSA0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jZWxscyBmaXJzdCByb3cgYWZ0ZXIgdXBwZXIgbGVmdFxuICAgICAgICAgICAgLy9UT0RPIGNvbGxhcHNlXG4gICAgICAgICAgICBpZihpID09IDAgJiYgaiA+IDApXG4gICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShrIDwgZW50cnlUb3BMdS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9IGVudHJ5VG9wTHVbayAgXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTEgPSBlbnRyeVRvcEx1W2srMV07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID0gZW50cnlUb3BMdVtrKzJdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MyA9IGVudHJ5VG9wTHVbayszXTtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIGVkZ2UgaXMgb24gYWRqYWNlbnQgbGVmdCBzaWRlLCBhbmQgcHVzaCBpbmRleCBvZiBlZGdlLFxuICAgICAgICAgICAgICAgICAgICAvL2lmIG5vdCwgY2FsY3VsYXRlIGVkZ2UsIHB1c2ggaW5kZXggb2YgbmV3IGVkZ2VcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgZmlyc3QgdmVydGV4IGlzIG9uIGxlZnQgZWRnZVxuICAgICAgICAgICAgICAgICAgICBpZihlbnRyeVRvcEx1MCA9PSAzKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2Fzc2lnbiBwcmV2aW91cyBjYWxjdWxhdGVkIGVkZ2UgdmVydGV4IGZyb20gcHJldmlvdXMgY2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleExlZnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSAvL2NhbGN1bGF0ZSBlZGdlIHZlcnRleFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTAgPT0gMCA/IGVkZ2VJbmRleFRvcCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhCb3R0b207XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUwXSxjZWxsW2VudHJ5VG9wTHUxXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIHNlY29uZCB2ZXJ0ZXggaXMgb24gbGVmdCBlZGdlXG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZW50cnlUb3BMdTIgPT0gMylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleExlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgLy9jYWxjdWxhdGUgZWRnZSB2ZXJ0ZXhcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUyID09IDAgPyBlZGdlSW5kZXhUb3AgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID09IDEgPyBlZGdlSW5kZXhSaWdodCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4Qm90dG9tO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1Ml0sY2VsbFtlbnRyeVRvcEx1M10sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBrICs9IDQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NlbGxzIGZpcnN0IGNvbHVtbiBhZnRlciB1cHBlciBsZWZ0XG4gICAgICAgICAgICAvL1RPRE8gY29sbGFwc2VcbiAgICAgICAgICAgIGlmKGkgIT0gMCAmJiBqID09IDApXG4gICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShrIDwgZW50cnlUb3BMdS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgZWRnZSBpcyBvbiBhZGphY2VudCB0b3Agc2lkZSwgYW5kIHB1c2ggaW5kZXggb2YgZWRnZSxcbiAgICAgICAgICAgICAgICAgICAgLy9pZiBub3QsIGNhbGN1bGF0ZSBlZGdlLCBwdXNoIGluZGV4IG9mIG5ldyBlZGdlXG5cbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTAgPSBlbnRyeVRvcEx1W2sgIF07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUxID0gZW50cnlUb3BMdVtrKzFdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MiA9IGVudHJ5VG9wTHVbaysyXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTMgPSBlbnRyeVRvcEx1W2srM107XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jaGVjayBmaXJzdCB2ZXJ0ZXggaXMgb24gdG9wIGVkZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYoZW50cnlUb3BMdTAgPT0gMClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhUZW1wID0gZW50cnlUb3BMdTAgPT0gMSA/IGVkZ2VJbmRleFJpZ2h0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9PSAyID8gZWRnZUluZGV4Qm90dG9tIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGdlSW5kZXhMZWZ0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwoY2VsbFtlbnRyeVRvcEx1MF0sY2VsbFtlbnRyeVRvcEx1MV0sZWRnZXMsZWRnZUluZGV4VGVtcCAqIDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleFRlbXApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZpcnN0IHZlcnRleCBpcyBvbiB0b3AgZWRnZVxuICAgICAgICAgICAgICAgICAgICBpZihlbnRyeVRvcEx1MiA9PSAwKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleFRlbXAgPSBlbnRyeVRvcEx1MiA9PSAxID8gZWRnZUluZGV4UmlnaHQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID09IDIgPyBlZGdlSW5kZXhCb3R0b20gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VJbmRleExlZnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbChjZWxsW2VudHJ5VG9wTHUyXSxjZWxsW2VudHJ5VG9wTHUzXSxlZGdlcyxlZGdlSW5kZXhUZW1wICogMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZWRnZUluZGV4VGVtcClcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGsgKz0gNDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jaGVjayBhbGwgb3RoZXIgY2VsbHNcbiAgICAgICAgICAgIC8vVE9ETyBjb2xsYXBzZVxuICAgICAgICAgICAgaWYoaSAhPSAwICYmIGogIT0gMClcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgZWRnZSBpcyBvbiBhZGphY2VudCBsZWZ0IHNpZGUsIGFuZCBwdXNoIGluZGV4IG9mIGVkZ2UsXG4gICAgICAgICAgICAgICAgLy9pZiBub3QsIGNhbGN1bGF0ZSBlZGdlLCBwdXNoIGluZGV4IG9mIG5ldyBlZGdlXG5cbiAgICAgICAgICAgICAgICB3aGlsZShrIDwgZW50cnlUb3BMdS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MCA9IGVudHJ5VG9wTHVbayAgXTtcbiAgICAgICAgICAgICAgICAgICAgZW50cnlUb3BMdTEgPSBlbnRyeVRvcEx1W2srMV07XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5VG9wTHUyID0gZW50cnlUb3BMdVtrKzJdO1xuICAgICAgICAgICAgICAgICAgICBlbnRyeVRvcEx1MyA9IGVudHJ5VG9wTHVbayszXTtcblxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGZpcnN0IHZlcnRleCBpcyBvbiBsZWZ0IGVkZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYoZW50cnlUb3BMdTAgPT0gMylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleExlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZW50cnlUb3BMdTAgPT0gMCkvL21heWJlIHVwcGVyIGNlbGw/XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgLy9jYWxjdWxhdGUgZWRnZSB2ZXJ0ZXhcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUwID09IDEgPyBlZGdlSW5kZXhSaWdodCA6IGVkZ2VJbmRleEJvdHRvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTBdLGNlbGxbZW50cnlUb3BMdTFdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgc2Vjb25kIHZlcnRleCBpcyBvbiBsZWZ0IGVkZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYoZW50cnlUb3BMdTIgPT0gMylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGVkZ2VJbmRleExlZnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZW50cnlUb3BMdTIgPT0gMCkvL21heWJlIHVwcGVyIGNlbGw/XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgLy9jYWxjdWxhdGUgZWRnZSB2ZXJ0ZXhcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUluZGV4VGVtcCA9IGVudHJ5VG9wTHUyID09IDEgPyBlZGdlSW5kZXhSaWdodCA6IGVkZ2VJbmRleEJvdHRvbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKGNlbGxbZW50cnlUb3BMdTJdLGNlbGxbZW50cnlUb3BMdTNdLGVkZ2VzLGVkZ2VJbmRleFRlbXAgKiAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChlZGdlSW5kZXhUZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgayArPSA0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vdGVtcFxuICAgIHRoaXMuX2luZGljZXMgPSB0aGlzLl9fYXBwVWludFR5cGVFbmFibGVkID8gIG5ldyBVaW50MzJBcnJheShpbmRpY2VzKSA6ICBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyk7XG59O1xuXG4vL3Zpc3VhbCBkZWJ1ZyBuZWVkIGlzb2xpbmUvaXNvYmFuZCBzd2l0Y2hcbklTT0JhbmQucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oZ2wpXG57XG4gICAgdmFyIGVkZ2VzICAgPSB0aGlzLl9lZGdlcyxcbiAgICAgICAgY29sb3JzICA9IGdsLmJ1ZmZlckNvbG9ycyhnbC5nZXRDb2xvckJ1ZmZlcigpLG5ldyBGbG9hdDMyQXJyYXkoZWRnZXMubGVuZ3RoLzMqNCkpLFxuICAgICAgICBpbmRpY2VzID0gIHRoaXMuX2luZGljZXM7XG5cbiAgICAgZ2wuZHJhd0VsZW1lbnRzKGVkZ2VzLG51bGwsY29sb3JzLG51bGwsaW5kaWNlcyxnbC5nZXREcmF3TW9kZSgpLGluZGljZXMubGVuZ3RoLDAsZ2wuVU5TSUdORURfU0hPUlQpO1xufTtcblxuXG5JU09CYW5kLnByb3RvdHlwZS5faW50cnBsID0gZnVuY3Rpb24oaW5kZXgwLGluZGV4MSxvdXQsb2Zmc2V0KVxue1xuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzO1xuXG4gICAgdmFyIHYweCA9IHZlcnRzW2luZGV4MCAgXSxcbiAgICAgICAgdjB5ID0gdmVydHNbaW5kZXgwKzFdLFxuICAgICAgICB2MHogPSB2ZXJ0c1tpbmRleDArMl0sXG4gICAgICAgIHYwdiA9IHZlcnRzW2luZGV4MCszXTtcblxuICAgIHZhciB2MXggPSB2ZXJ0c1tpbmRleDEgIF0sXG4gICAgICAgIHYxeSA9IHZlcnRzW2luZGV4MSsxXSxcbiAgICAgICAgdjF6ID0gdmVydHNbaW5kZXgxKzJdLFxuICAgICAgICB2MXYgPSB2ZXJ0c1tpbmRleDErM107XG5cblxuICAgIGlmKHYwdiA9PSAwKVxuICAgIHtcbiAgICAgICAgb3V0W29mZnNldCswXSA9IHYxeDtcbiAgICAgICAgb3V0W29mZnNldCsxXSA9IHYxeTtcbiAgICAgICAgb3V0W29mZnNldCsyXSA9IHYxejtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2UgaWYodjF2ID09IDApXG4gICAge1xuICAgICAgICBvdXRbb2Zmc2V0KzBdID0gdjB4O1xuICAgICAgICBvdXRbb2Zmc2V0KzFdID0gdjB5O1xuICAgICAgICBvdXRbb2Zmc2V0KzJdID0gdjB6O1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIGlmKHRoaXMuX2ludGVycG9sYXRlVmFsdWVzKVxuICAgIHtcbiAgICAgICAgdmFyIHYxMHYgPSB2MXYgLSB2MHY7XG5cbiAgICAgICAgb3V0W29mZnNldCswXSA9IC12MHYgKiAodjF4IC0gdjB4KSAvIHYxMHYgKyB2MHg7XG4gICAgICAgIG91dFtvZmZzZXQrMV0gPSAtdjB2ICogKHYxeSAtIHYweSkgLyB2MTB2ICsgdjB5O1xuICAgICAgICBvdXRbb2Zmc2V0KzJdID0gLXYwdiAqICh2MXogLSB2MHopIC8gdjEwdiArIHYwejtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgb3V0W29mZnNldCswXSA9ICAodjF4IC0gdjB4KSAqIDAuNSArIHYweDtcbiAgICAgICAgb3V0W29mZnNldCsxXSA9ICAodjF5IC0gdjB5KSAqIDAuNSArIHYweTtcbiAgICAgICAgb3V0W29mZnNldCsyXSA9ICAodjF6IC0gdjB6KSAqIDAuNSArIHYwejtcbiAgICB9XG59O1xuXG5cbklTT0JhbmQucHJvdG90eXBlLmdldFZlcnRpY2VzICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZXJ0czt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0VmVydGljZXNTaXplWCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZlcnRTaXplWDt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0VmVydGljZXNTaXplWiA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3ZlcnRTaXplWjt9O1xuSVNPQmFuZC5wcm90b3R5cGUuZ2V0Q2VsbHMgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NlbGxzO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRDZWxsc1NpemVYICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2VsbFNpemVYO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRDZWxsc1NpemVaICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2VsbFNpemVaO307XG5JU09CYW5kLnByb3RvdHlwZS5nZXRFZGdlcyAgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZWRnZXM7fTtcbklTT0JhbmQucHJvdG90eXBlLmdldEluZGljZXMgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbmRpY2VzO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIFRPUE9MT0dJQ0FMXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vVE9ETyBtZXJnZVxuSVNPQmFuZC5UT1BfVEFCTEUgPVxuICAgIFtcbiAgICAgICAgW10sXG4gICAgICAgIFsgMiwgMywgMywgMF0sXG4gICAgICAgIFsgMSwgMiwgMiwgM10sXG4gICAgICAgIFsgMSwgMiwgMywgMF0sXG4gICAgICAgIFsgMCwgMSwgMSwgMl0sXG4gICAgICAgIFsgMCwgMSwgMSwgMiwgMiwgMywgMywgMF0sXG4gICAgICAgIFsgMCwgMSwgMiwgM10sXG4gICAgICAgIFsgMCwgMSwgMywgMF0sXG4gICAgICAgIFsgMCwgMSwgMywgMF0sXG4gICAgICAgIFsgMCwgMSwgMiwgM10sXG4gICAgICAgIFsgMCwgMSwgMSwgMiwgMiwgMywgMywgMF0sXG4gICAgICAgIFsgMCwgMSwgMSwgMl0sXG4gICAgICAgIFsgMSwgMiwgMywgMF0sXG4gICAgICAgIFsgMSwgMiwgMiwgM10sXG4gICAgICAgIFsgMiwgMywgMywgMF0sXG4gICAgICAgIFtdXG4gICAgXTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gVFJJQU5HRVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE8gbWVyZ2VcbklTT0JhbmQuVFJJX1RBQkxFID1cbiAgICBbXG4gICAgICAgIFtdLFxuICAgICAgICBbIDEsIDAsIDAsIDMsIDEsIDFdLFxuICAgICAgICBbIDEsIDAsIDAsIDIsIDEsIDFdLFxuICAgICAgICBbIDEsIDAsIDAsIDIsIDAsIDMsIDAsIDMsIDEsIDEgLDEgLDAgXSxcbiAgICAgICAgWyAxLCAwLCAwLCAxLCAxLCAxXSxcbiAgICAgICAgWyAxLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAzLCAxLCAyLCAwLCAzLCAxLCAzLCAxLCAzLCAxLCAwLCAxLCAxXSxcbiAgICAgICAgWyAxLCAwLCAwLCAxLCAxLCAxLCAwLCAxLCAwLCAyLCAxLCAxXSxcbiAgICAgICAgWyAxLCAwLCAwLCAxLCAwLCAyLCAwLCAyLCAxLCAxLCAxLCAwLCAwLCAyLCAwLCAzLCAxLCAxIF0sXG4gICAgICAgIFsgMCwgMCwgMSwgMCwgMSwgMV0sXG4gICAgICAgIFsgMCwgMCwgMSwgMCwgMCwgMywgMSwgMCwgMSwgMSwgMCwgM10sXG4gICAgICAgIFsgMCwgMCwgMSwgMCwgMSwgMywgMSwgMCwgMSwgMSwgMSwgMywgMSwgMSwgMCwgMiwgMSwgMiwgMSwgMiwgMSwgMywgMSwgMSBdLFxuICAgICAgICBbIDAsIDAsIDEsIDAsIDAsIDMsIDEsIDAsIDEsIDEsIDAsIDMsIDEsIDEsIDAsIDIsIDAsIDNdLFxuICAgICAgICBbIDAsIDAsIDAsIDEsIDEsIDEsIDAsIDEsIDEsIDAsIDEsIDFdLFxuICAgICAgICBbIDAsIDAsIDAsIDEsIDEsIDAsIDEsIDAsIDEsIDEsIDAsIDAsIDEsIDEsIDAsIDMsIDAsIDBdLFxuICAgICAgICBbIDAsIDAsIDAsIDEsIDEsIDEsIDAsIDEsIDAsIDIsIDEsIDAsIDEsIDAsIDEsIDEsIDAsIDFdLFxuICAgICAgICBbIDAsIDAsIDAsIDEsIDAsIDMsIDAsIDEsIDAsIDIsIDAsIDNdXG4gICAgXTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IElTT0JhbmQ7XG4iLCJ2YXIgVmVjMyAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgVmVjNCAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWM0JyksXG4gICAgR2VvbTNkID0gcmVxdWlyZSgnLi9nbGtHZW9tM2QnKTtcblxuXG4vL1RoaXMgaXMganVzdCBhbiBpbml0aWFsIHZlcnNpb25cbmZ1bmN0aW9uIElTT1N1cmZhY2Uoc2l6ZVgsc2l6ZVksc2l6ZVopXG57XG4gICAgdGhpcy5fdmVydFNpemVYID0gbnVsbDtcbiAgICB0aGlzLl92ZXJ0U2l6ZVkgPSBudWxsO1xuICAgIHRoaXMuX3ZlcnRTaXplWiA9IG51bGw7XG5cbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aClcbiAgICB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplWCA9IHRoaXMuX3ZlcnRTaXplWSA9IHRoaXMuX3ZlcnRTaXplWiA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVkgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVogPSBhcmd1bWVudHNbMl07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICB0aGlzLl92ZXJ0U2l6ZVggPSB0aGlzLl92ZXJ0U2l6ZVkgPSB0aGlzLl92ZXJ0U2l6ZVogPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5fY3ViZVNpemVYID0gdGhpcy5fdmVydFNpemVYIC0gMTtcbiAgICB0aGlzLl9jdWJlU2l6ZVkgPSB0aGlzLl92ZXJ0U2l6ZVkgLSAxO1xuICAgIHRoaXMuX2N1YmVTaXplWiA9IHRoaXMuX3ZlcnRTaXplWiAtIDE7XG5cbiAgICB0aGlzLl9kZWxheWVkQ2xlYXIgPSBmYWxzZTtcblxuICAgIC8vVE9ETzpGSVghIVxuICAgIHRoaXMuX2Z1bmMgICAgICA9IGZ1bmN0aW9uKHgseSx6LGFyZzAsYXJnMSxhcmcyKXtyZXR1cm4gMDt9O1xuICAgIHRoaXMuX2Z1bmNBcmcwICA9IDA7XG4gICAgdGhpcy5fZnVuY0FyZzEgID0gMDtcbiAgICB0aGlzLl9mdW5jQXJnMiAgPSAwO1xuICAgIHRoaXMuX2lzb0xldmVsICA9IDA7XG5cbiAgICAvL1RPRE86IHVucm9sbFxuICAgIHRoaXMuX3ZlcnRzID0gbmV3IEFycmF5KHRoaXMuX3ZlcnRTaXplWCp0aGlzLl92ZXJ0U2l6ZVkqdGhpcy5fdmVydFNpemVaKTtcbiAgICB0aGlzLl9jdWJlcyA9IG5ldyBBcnJheSh0aGlzLl9jdWJlU2l6ZVgqdGhpcy5fY3ViZVNpemVZKnRoaXMuX2N1YmVTaXplWik7XG5cbiAgICB0aGlzLl9udW1UcmlhbmdsZXMgPSAwO1xuXG4gICAgdmFyIFNJWkVfT0ZfVFJJQU5HTEUgICA9IDMsXG4gICAgICAgIFNJWkVfT0ZfQ1VCRV9FREdFUyA9IDEyO1xuICAgIHZhciBNQVhfQlVGRkVSX0xFTiAgICAgPSB0aGlzLl9jdWJlcy5sZW5ndGggKiA0O1xuXG4gICAgdGhpcy5fYlZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSgoTUFYX0JVRkZFUl9MRU4pKlNJWkVfT0ZfVFJJQU5HTEUqVmVjMy5TSVpFKTtcbiAgICB0aGlzLl9iTm9ybWFscyAgPSBuZXcgRmxvYXQzMkFycmF5KChNQVhfQlVGRkVSX0xFTikqU0laRV9PRl9UUklBTkdMRSpWZWMzLlNJWkUpO1xuICAgIHRoaXMuX2JDb2xvcnMgICA9IG5ldyBGbG9hdDMyQXJyYXkoKE1BWF9CVUZGRVJfTEVOKSpTSVpFX09GX1RSSUFOR0xFKlZlYzQuU0laRSk7XG5cbiAgICB0aGlzLl90ZW1wVmVydGljZXMgPSBuZXcgQXJyYXkoU0laRV9PRl9DVUJFX0VER0VTKlZlYzMuU0laRSk7XG4gICAgdGhpcy5fdGVtcE5vcm1hbHMgID0gbmV3IEFycmF5KFNJWkVfT0ZfQ1VCRV9FREdFUyk7XG5cbiAgICB0aGlzLl9zY2FsZVhZWiA9IFsxLDEsMV07XG5cbiAgICB0aGlzLl9nZW5TdXJmYWNlKCk7XG5cbn1cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlb20zZC5wcm90b3R5cGUpO1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vXG4vL1xuLy8gICAgICAgICAgIDIgLS0tLS0tLSAzICAgIFZlcnRleCBvcmRlclxuLy8gICAgICAgICAgL3wgICAgICAgIC98XG4vLyAgICAgICAgIC8gfCAgICAgICAvIHxcbi8vICAgICAgICA2IC0tLS0tLS0gNyAgfFxuLy8gICAgICAgIHwgIDAgLS0tLS18LSAxXG4vLyAgICAgICAgfCAvICAgICAgIHwgL1xuLy8gICAgICAgIHwvICAgICAgICB8L1xuLy8gICAgICAgIDQgLS0tLS0tLSA1XG4vL1xuLy9cbi8vICAgICAgICAgICAyIC0tLS0tLT4gMyAgICBNYXJjaCBvcmRlclxuLy8gICAgICAgICAgICAgIFxcXG4vLyAgICAgICAgICAgICAgICBcXFxuLy8gICAgICAgIDYgLS0tLS0tPiA3XG4vLyAgICAgICAgICAgMCAtLS0tLS0+IDFcbi8vICAgICAgICAgICAgIFxcXG4vLyAgICAgICAgICAgICAgIFxcXG4vLyAgICAgICAgNCAtLS0tLS0+IDVcbi8vXG4vL1xuXG5cbklTT1N1cmZhY2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIHZhciB2ZXJ0cyA9IHRoaXMuX3ZlcnRzO1xuXG4gICAgdmFyIGN1YmVTaXplWCAgPSB0aGlzLl9jdWJlU2l6ZVgsXG4gICAgICAgIGN1YmVTaXplWSAgPSB0aGlzLl9jdWJlU2l6ZVksXG4gICAgICAgIGN1YmVTaXplWiAgPSB0aGlzLl9jdWJlU2l6ZVosXG4gICAgICAgIGN1YmVTaXplWlkgPSBjdWJlU2l6ZVogKiBjdWJlU2l6ZVk7XG5cbiAgICB2YXIgY3ViZXMgPSB0aGlzLl9jdWJlcyxcbiAgICAgICAgY3ViZTtcblxuICAgIHZhciBtYXJjaEluZGV4O1xuXG4gICAgdmFyIEVER0VfVEFCTEUgPSBJU09TdXJmYWNlLkVER0VfVEFCTEUsXG4gICAgICAgIFRSSV9UQUJMRSAgPSBJU09TdXJmYWNlLlRSSV9UQUJMRTtcblxuICAgIHZhciB2MCx2MSx2Mix2Myx2NCx2NSx2Nix2NztcbiAgICB2YXIgdmFsMCx2YWwxLHZhbDIsdmFsMyx2YWw0LHZhbDUsdmFsNix2YWw3O1xuXG4gICAgdmFyIGN1YmVJbmRleDtcbiAgICB2YXIgaXNvTGV2ZWwgPSB0aGlzLl9pc29MZXZlbDtcbiAgICB2YXIgYml0cztcblxuICAgIHZhciBiVmVydGljZXMgICA9IHRoaXMuX2JWZXJ0aWNlcyxcbiAgICAgICAgYk5vcm1hbHMgICAgPSB0aGlzLl9iTm9ybWFscyxcbiAgICAgICAgYk5vcm1hbHNMZW4gPSBiTm9ybWFscy5sZW5ndGgsXG4gICAgICAgIGJWZXJ0SW5kZXg7XG5cbiAgICB2YXIgdmVydEluZGV4MCwgdmVydEluZGV4MSwgdmVydEluZGV4MixcbiAgICAgICAgdmVydEluZGV4MywgdmVydEluZGV4NCwgdmVydEluZGV4NSxcbiAgICAgICAgdmVydEluZGV4NiwgdmVydEluZGV4NywgdmVydEluZGV4ODtcblxuICAgIHZhciB2MHgsdjB5LHYweixcbiAgICAgICAgdjF4LHYxeSx2MXosXG4gICAgICAgIHYyeCx2MnksdjJ6O1xuXG4gICAgdmFyIGUyeCwgZTJ5LCBlMnosXG4gICAgICAgIGUxeCwgZTF5LCBlMXo7XG5cbiAgICB2YXIgdjBJbmRleCxcbiAgICAgICAgdjFJbmRleCxcbiAgICAgICAgdjJJbmRleDtcblxuICAgIHZhciBueCwgbnksIG56LFxuICAgICAgICB2YngsIHZieSwgdmJ6O1xuXG5cbiAgICB2YXIgaSwgaiwgaztcblxuICAgIHRoaXMuX251bVRyaWFuZ2xlcyA9IDA7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpPGJOb3JtYWxzTGVuKWJOb3JtYWxzW2ldPTAuMDtcblxuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IGN1YmVTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgY3ViZVNpemVZKVxuICAgICAgICB7XG4gICAgICAgICAgICBrID0gLTE7XG4gICAgICAgICAgICB3aGlsZSgrK2sgPCBjdWJlU2l6ZVgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgbWFyY2hJbmRleCA9IGkgKiBjdWJlU2l6ZVpZICsgaiAqIGN1YmVTaXplWiArIGs7XG4gICAgICAgICAgICAgICAgY3ViZSAgICAgICA9IGN1YmVzW21hcmNoSW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgLy9hY2Nlc3MgdmVydGljZXMgb2YgY3ViZVxuICAgICAgICAgICAgICAgIHYwID0gdmVydHNbY3ViZVswXV07XG4gICAgICAgICAgICAgICAgdjEgPSB2ZXJ0c1tjdWJlWzFdXTtcbiAgICAgICAgICAgICAgICB2MiA9IHZlcnRzW2N1YmVbMl1dO1xuICAgICAgICAgICAgICAgIHYzID0gdmVydHNbY3ViZVszXV07XG4gICAgICAgICAgICAgICAgdjQgPSB2ZXJ0c1tjdWJlWzRdXTtcbiAgICAgICAgICAgICAgICB2NSA9IHZlcnRzW2N1YmVbNV1dO1xuICAgICAgICAgICAgICAgIHY2ID0gdmVydHNbY3ViZVs2XV07XG4gICAgICAgICAgICAgICAgdjcgPSB2ZXJ0c1tjdWJlWzddXTtcblxuICAgICAgICAgICAgICAgIHZhbDAgPSB2MFszXTtcbiAgICAgICAgICAgICAgICB2YWwxID0gdjFbM107XG4gICAgICAgICAgICAgICAgdmFsMiA9IHYyWzNdO1xuICAgICAgICAgICAgICAgIHZhbDMgPSB2M1szXTtcbiAgICAgICAgICAgICAgICB2YWw0ID0gdjRbM107XG4gICAgICAgICAgICAgICAgdmFsNSA9IHY1WzNdO1xuICAgICAgICAgICAgICAgIHZhbDYgPSB2NlszXTtcbiAgICAgICAgICAgICAgICB2YWw3ID0gdjdbM107XG5cbiAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICBjdWJlSW5kZXggPSAwO1xuXG4gICAgICAgICAgICAgICAgaWYodmFsMDxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDE7XG4gICAgICAgICAgICAgICAgaWYodmFsMTxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDI7XG4gICAgICAgICAgICAgICAgaWYodmFsMjxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDg7XG4gICAgICAgICAgICAgICAgaWYodmFsMzxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDQ7XG4gICAgICAgICAgICAgICAgaWYodmFsNDxpc29MZXZlbCkgY3ViZUluZGV4IHw9IDE2O1xuICAgICAgICAgICAgICAgIGlmKHZhbDU8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSAzMjtcbiAgICAgICAgICAgICAgICBpZih2YWw2PGlzb0xldmVsKSBjdWJlSW5kZXggfD0gMTI4O1xuICAgICAgICAgICAgICAgIGlmKHZhbDc8aXNvTGV2ZWwpIGN1YmVJbmRleCB8PSA2NDtcblxuICAgICAgICAgICAgICAgIGJpdHMgPSBFREdFX1RBQkxFW2N1YmVJbmRleF07XG5cbiAgICAgICAgICAgICAgICBpZihiaXRzID09PSAwKWNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBWZXJ0aWNlcyA9IHRoaXMuX3RlbXBWZXJ0aWNlcyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcE5vcm1hbHMgID0gdGhpcy5fdGVtcE5vcm1hbHM7XG5cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDEpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjAsIHYxLCB0ZW1wVmVydGljZXMsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDAsdGVtcE5vcm1hbHMsMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MSwgdjMsIHRlbXBWZXJ0aWNlcywgMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsMSx0ZW1wTm9ybWFscywxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiA0KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYyLCB2MywgdGVtcFZlcnRpY2VzLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcywyLHRlbXBOb3JtYWxzLDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjAsIHYyLCB0ZW1wVmVydGljZXMsIDMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDMsdGVtcE5vcm1hbHMsMyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAxNilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2NCwgdjUsIHRlbXBWZXJ0aWNlcywgNCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsNCx0ZW1wTm9ybWFscyw0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAzMilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2NSwgdjcsIHRlbXBWZXJ0aWNlcywgNSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsNSx0ZW1wTm9ybWFscyw1KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiA2NClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2NiwgdjcsIHRlbXBWZXJ0aWNlcywgNik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbCh0ZW1wVmVydGljZXMsNix0ZW1wTm9ybWFscyw2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAxMjgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjQsIHY2LCB0ZW1wVmVydGljZXMsIDcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDcsdGVtcE5vcm1hbHMsNyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpdHMgJiAyNTYpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjAsIHY0LCB0ZW1wVmVydGljZXMsIDgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDgsdGVtcE5vcm1hbHMsOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgNTEyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW50cnBsKHYxLCB2NSwgdGVtcFZlcnRpY2VzLCA5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcyw5LHRlbXBOb3JtYWxzLDkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYml0cyAmIDEwMjQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnRycGwodjMsIHY3LCB0ZW1wVmVydGljZXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsKHRlbXBWZXJ0aWNlcywxMCx0ZW1wTm9ybWFscywxMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiaXRzICYgMjA0OClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ludHJwbCh2MiwgdjYsIHRlbXBWZXJ0aWNlcywgMTEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWwodGVtcFZlcnRpY2VzLDExLHRlbXBOb3JtYWxzLDExKTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgIHZhciBsID0gMDtcbiAgICAgICAgICAgICAgICBjdWJlSW5kZXggPDw9IDQ7XG5cblxuICAgICAgICAgICAgICAgIHdoaWxlKFRSSV9UQUJMRVtjdWJlSW5kZXggKyBsXSAhPSAtMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgICAgICAgICAvL2dldCBpbmRpY2VzIG9mIHRyaWFuZ2xlIHZlcnRpY2VzXG4gICAgICAgICAgICAgICAgICAgIHYwSW5kZXggPSBUUklfVEFCTEVbY3ViZUluZGV4ICsgbCAgICBdICogMztcbiAgICAgICAgICAgICAgICAgICAgdjFJbmRleCA9IFRSSV9UQUJMRVtjdWJlSW5kZXggKyBsICsgMV0gKiAzO1xuICAgICAgICAgICAgICAgICAgICB2MkluZGV4ID0gVFJJX1RBQkxFW2N1YmVJbmRleCArIGwgKyAyXSAqIDM7XG5cbiAgICAgICAgICAgICAgICAgICAgYlZlcnRJbmRleCA9IHRoaXMuX251bVRyaWFuZ2xlcyAqIDk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmVydEluZGV4MCA9IGJWZXJ0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDEgPSBiVmVydEluZGV4KzE7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDIgPSBiVmVydEluZGV4KzI7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDMgPSBiVmVydEluZGV4KzM7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDQgPSBiVmVydEluZGV4KzQ7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDUgPSBiVmVydEluZGV4KzU7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDYgPSBiVmVydEluZGV4KzY7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDcgPSBiVmVydEluZGV4Kzc7XG4gICAgICAgICAgICAgICAgICAgIHZlcnRJbmRleDggPSBiVmVydEluZGV4Kzg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9zdG9yZSB0cmlhbmdsZSB2ZXJ0aWNlcyBpbiAnZ2xvYmFsJyB2ZXJ0ZXggYnVmZmVyICsgbG9jYWwgY2FjaGluZ1xuICAgICAgICAgICAgICAgICAgICB2MHggPSBiVmVydGljZXNbdmVydEluZGV4MF0gPSB0ZW1wVmVydGljZXNbdjBJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHYweSA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXgxXSA9IHRlbXBWZXJ0aWNlc1t2MEluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICB2MHogPSBiVmVydGljZXNbdmVydEluZGV4Ml0gPSB0ZW1wVmVydGljZXNbdjBJbmRleCsyXTtcblxuICAgICAgICAgICAgICAgICAgICB2MXggPSBiVmVydGljZXNbdmVydEluZGV4M10gPSB0ZW1wVmVydGljZXNbdjFJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHYxeSA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXg0XSA9IHRlbXBWZXJ0aWNlc1t2MUluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICB2MXogPSBiVmVydGljZXNbdmVydEluZGV4NV0gPSB0ZW1wVmVydGljZXNbdjFJbmRleCsyXTtcblxuICAgICAgICAgICAgICAgICAgICB2MnggPSBiVmVydGljZXNbdmVydEluZGV4Nl0gPSB0ZW1wVmVydGljZXNbdjJJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHYyeSA9IGJWZXJ0aWNlc1t2ZXJ0SW5kZXg3XSA9IHRlbXBWZXJ0aWNlc1t2MkluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICB2MnogPSBiVmVydGljZXNbdmVydEluZGV4OF0gPSB0ZW1wVmVydGljZXNbdjJJbmRleCsyXTtcblxuICAgICAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICAgICAgLy9jYWxjIGZhY2Ugbm9ybWFscyAtIHBlciBmYWNlIC0gbmFpdmUgVE9ETzpGSVhNRSFcbiAgICAgICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgdmJ4ID0gdjF4O1xuICAgICAgICAgICAgICAgICAgICB2YnkgPSB2MXk7XG4gICAgICAgICAgICAgICAgICAgIHZieiA9IHYxejtcblxuICAgICAgICAgICAgICAgICAgICBlMXggPSB2MHgtdmJ4O1xuICAgICAgICAgICAgICAgICAgICBlMXkgPSB2MHktdmJ5O1xuICAgICAgICAgICAgICAgICAgICBlMXogPSB2MHotdmJ6O1xuXG4gICAgICAgICAgICAgICAgICAgIGUyeCA9IHYyeC12Yng7XG4gICAgICAgICAgICAgICAgICAgIGUyeSA9IHYyeS12Ynk7XG4gICAgICAgICAgICAgICAgICAgIGUyeiA9IHYyei12Yno7XG5cbiAgICAgICAgICAgICAgICAgICAgbnggPSBlMXkgKiBlMnogLSBlMXogKiBlMnk7XG4gICAgICAgICAgICAgICAgICAgIG55ID0gZTF6ICogZTJ4IC0gZTF4ICogZTJ6O1xuICAgICAgICAgICAgICAgICAgICBueiA9IGUxeCAqIGUyeSAtIGUxeSAqIGUyeDtcblxuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgwXSArPSBueDtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4MV0gKz0gbnk7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDJdICs9IG56O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgzXSArPSBueDtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4NF0gKz0gbnk7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDVdICs9IG56O1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg2XSArPSBueDtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4N10gKz0gbnk7XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDhdICs9IG56O1xuXG4gICAgICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4MF0gPSB0ZW1wTm9ybWFsc1t2MEluZGV4ICBdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXgxXSA9IHRlbXBOb3JtYWxzW3YwSW5kZXgrMV07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDJdID0gdGVtcE5vcm1hbHNbdjBJbmRleCsyXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4M10gPSB0ZW1wTm9ybWFsc1t2MUluZGV4ICBdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg0XSA9IHRlbXBOb3JtYWxzW3YxSW5kZXgrMV07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDVdID0gdGVtcE5vcm1hbHNbdjFJbmRleCsyXTtcbiAgICAgICAgICAgICAgICAgICAgYk5vcm1hbHNbdmVydEluZGV4Nl0gPSB0ZW1wTm9ybWFsc1t2MkluZGV4ICBdO1xuICAgICAgICAgICAgICAgICAgICBiTm9ybWFsc1t2ZXJ0SW5kZXg3XSA9IHRlbXBOb3JtYWxzW3YySW5kZXgrMV07XG4gICAgICAgICAgICAgICAgICAgIGJOb3JtYWxzW3ZlcnRJbmRleDhdID0gdGVtcE5vcm1hbHNbdjJJbmRleCsyXTtcblxuICAgICAgICAgICAgICAgICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgICAgICAgICAgbCs9MztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbnVtVHJpYW5nbGVzKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5faW50cnBsID0gZnVuY3Rpb24odjAsdjEsdmVydExpc3QsaW5kZXgpXG57XG4gICAgaW5kZXggKj0gMztcblxuICAgIHZhciB2MHYgPSB2MFszXSxcbiAgICAgICAgdjF2ID0gdjFbM107XG5cbiAgICB2YXIgaXNvTGV2ZWwgPSB0aGlzLl9pc29MZXZlbDtcblxuICAgIGlmKE1hdGguYWJzKGlzb0xldmVsIC0gdjB2KSA8IDAuMDAwMDEpXG4gICAge1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCAgICBdID0gdjBbMF07XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICsgMV0gPSB2MFsxXTtcbiAgICAgICAgdmVydExpc3RbaW5kZXggKyAyXSA9IHYwWzJdO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoTWF0aC5hYnMoaXNvTGV2ZWwgLSB2MXYpIDwgMC4wMDAwMSlcbiAgICB7XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICAgIF0gPSB2MVswXTtcbiAgICAgICAgdmVydExpc3RbaW5kZXggKyAxXSA9IHYxWzFdO1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCArIDJdID0gdjFbMl07XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihNYXRoLmFicyh2MHYgLSB2MXYpIDwgMC4wMDAwMSlcbiAgICB7XG4gICAgICAgIHZlcnRMaXN0W2luZGV4ICAgIF0gPSB2MVswXTtcbiAgICAgICAgdmVydExpc3RbaW5kZXggKyAxXSA9IHYxWzFdO1xuICAgICAgICB2ZXJ0TGlzdFtpbmRleCArIDJdID0gdjFbMl07XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIHZhciBpbnRycGwgID0gKGlzb0xldmVsIC0gdjB2KSAvICh2MXYgLSB2MHYpO1xuXG4gICAgdmFyIHYweCA9IHYwWzBdLFxuICAgICAgICB2MHkgPSB2MFsxXSxcbiAgICAgICAgdjB6ID0gdjBbMl07XG5cbiAgICB2ZXJ0TGlzdFtpbmRleCAgICBdID0gdjB4ICsgKHYxWzBdIC0gdjB4KSAqIGludHJwbDtcbiAgICB2ZXJ0TGlzdFtpbmRleCArIDFdID0gdjB5ICsgKHYxWzFdIC0gdjB5KSAqIGludHJwbDtcbiAgICB2ZXJ0TGlzdFtpbmRleCArIDJdID0gdjB6ICsgKHYxWzJdIC0gdjB6KSAqIGludHJwbDtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPU3VyZmFjZS5wcm90b3R5cGUuX25vcm1hbCA9IGZ1bmN0aW9uKHZlcnRMaXN0LHZlcnRJbmRleCxub3JtTGlzdCxub3JtSW5kZXgpXG57XG4gICAgdmVydEluZGV4ICo9IDM7XG5cbiAgICB2YXIgeCA9IHZlcnRMaXN0W3ZlcnRJbmRleCAgIF0sXG4gICAgICAgIHkgPSB2ZXJ0TGlzdFt2ZXJ0SW5kZXgrMV0sXG4gICAgICAgIHogPSB2ZXJ0TGlzdFt2ZXJ0SW5kZXgrMl07XG5cbiAgICB2YXIgYXJnMCA9IHRoaXMuX2Z1bmNBcmcwLFxuICAgICAgICBhcmcxID0gdGhpcy5fZnVuY0FyZzEsXG4gICAgICAgIGFyZzIgPSB0aGlzLl9mdW5jQXJnMjtcblxuICAgIHZhciBlcHMgPSAwLjAwMDM7XG5cbiAgICB2YXIgdmFsID0gdGhpcy5fZnVuYyh4LHkseixhcmcwLGFyZzEsYXJnMik7XG5cbiAgICB2YXIgbnggPSB0aGlzLl9mdW5jKHggKyBlcHMseSAsIHosIGFyZzAsIGFyZzEsIGFyZzIpIC0gdmFsLFxuICAgICAgICBueSA9IHRoaXMuX2Z1bmMoeCwgeSArIGVwcywgeiwgYXJnMCwgYXJnMSwgYXJnMikgLSB2YWwsXG4gICAgICAgIG56ID0gdGhpcy5fZnVuYyh4LCB5LCB6ICsgZXBzLCBhcmcwLCBhcmcxLCBhcmcyKSAtIHZhbCxcbiAgICAgICAgZCAgPSAxIC8gTWF0aC5zcXJ0KG54Km54K255Km55K256Km56KTtcblxuXG4gICAgbm9ybUluZGV4ICo9IDM7XG5cbiAgICBub3JtTGlzdFtub3JtSW5kZXhdICAgPSB4KmQqLTE7XG4gICAgbm9ybUxpc3Rbbm9ybUluZGV4KzFdID0geSpkKi0xO1xuICAgIG5vcm1MaXN0W25vcm1JbmRleCsyXSA9IHoqZCotMTtcblxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5zZXRDbG9zZVNpZGVzID0gZnVuY3Rpb24oYm9vbCl7fVxuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5zZXRGdW5jdGlvbiA9IGZ1bmN0aW9uKGZ1bmMsaXNvTGV2ZWwpXG57XG4gICAgdmFyIGZ1bmNBcmdzTGVuZ3RoID0gZnVuYy5sZW5ndGg7XG5cbiAgICBpZihmdW5jQXJnc0xlbmd0aCA8IDMpdGhyb3cgJ0Z1bmN0aW9uIHNob3VsZCBzYXRpc2Z5IGZ1bmN0aW9uKHgseSx6KXt9JztcbiAgICBpZihmdW5jQXJnc0xlbmd0aCA+IDYpdGhyb3cgJ0Z1bmN0aW9uIGhhcyB0byBtYW55IGFyZ3VtZW50cy4gQXJndW1lbnRzIGxlbmd0aCBzaG91bGQgbm90IGV4Y2VlZCA2LiBFLmcgZnVuY3Rpb24oeCx5LHosYXJnMCxhcmcxLGFyZzIpLic7XG5cbiAgICB2YXIgZnVuY1N0cmluZyA9IGZ1bmMudG9TdHJpbmcoKSxcbiAgICAgICAgZnVuY0FyZ3MgICA9IGZ1bmNTdHJpbmcuc2xpY2UoZnVuY1N0cmluZy5pbmRleE9mKCcoJykgKyAxLCBmdW5jU3RyaW5nLmluZGV4T2YoJyknKSkuc3BsaXQoJywnKSxcbiAgICAgICAgZnVuY0JvZHkgICA9IGZ1bmNTdHJpbmcuc2xpY2UoZnVuY1N0cmluZy5pbmRleE9mKCd7JykgKyAxLCBmdW5jU3RyaW5nLmxhc3RJbmRleE9mKCd9JykpO1xuXG4gICAgdGhpcy5fZnVuYyAgICAgPSBuZXcgRnVuY3Rpb24oZnVuY0FyZ3NbMF0sIGZ1bmNBcmdzWzFdLCBmdW5jQXJnc1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jQXJnc1szXSB8fCAnYXJnMCcsIGZ1bmNBcmdzWzRdIHx8ICdhcmcxJywgZnVuY0FyZ3NbNV0gfHwgJ2FyZzInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmNCb2R5KTtcbiAgICB0aGlzLl9pc29MZXZlbCA9IGlzb0xldmVsIHx8IDA7XG59O1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5zZXRGdW5jdGlvblVuc2FmZSA9IGZ1bmN0aW9uKGZ1bmMsaXNvTGV2ZWwpXG57XG4gICAgdGhpcy5fZnVuYyAgICAgPSBmdW5jO1xuICAgIHRoaXMuX2lzb0xldmVsID0gaXNvTGV2ZWwgfHwgMDtcbn07XG5cbklTT1N1cmZhY2UucHJvdG90eXBlLmdldEZ1bmN0aW9uID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZnVuYzt9O1xuSVNPU3VyZmFjZS5wcm90b3R5cGUuc2V0SVNPTGV2ZWwgPSBmdW5jdGlvbihpc29MZXZlbCl7dGhpcy5faXNvTGV2ZWwgPSBpc29MZXZlbDt9O1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uICAgPSBmdW5jdGlvbigpICAgICAgICAge3RoaXMuYXBwbHlGdW5jdGlvbjNmKDAsMCwwKTt9O1xuSVNPU3VyZmFjZS5wcm90b3R5cGUuYXBwbHlGdW5jdGlvbjFmID0gZnVuY3Rpb24oYXJnMCkgICAgIHt0aGlzLmFwcGx5RnVuY3Rpb24zZihhcmcwLDAsMCk7fTtcbklTT1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb24yZiA9IGZ1bmN0aW9uKGFyZzAsYXJnMSl7dGhpcy5hcHBseUZ1bmN0aW9uM2YoYXJnMCxhcmcxLDApO307XG5cbklTT1N1cmZhY2UucHJvdG90eXBlLmFwcGx5RnVuY3Rpb24zZiA9IGZ1bmN0aW9uKGFyZzAsYXJnMSxhcmcyKVxue1xuICAgIHZhciB2ZXJ0U2l6ZVggID0gdGhpcy5fdmVydFNpemVYLFxuICAgICAgICB2ZXJ0U2l6ZVkgID0gdGhpcy5fdmVydFNpemVZLFxuICAgICAgICB2ZXJ0U2l6ZVogID0gdGhpcy5fdmVydFNpemVaLFxuICAgICAgICB2ZXJ0U2l6ZVlYID0gdmVydFNpemVZICogdmVydFNpemVYO1xuXG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHMsXG4gICAgICAgIHZlcnQsIHZlcnRzSW5kZXg7XG5cbiAgICB2YXIgaSwgaiwgaztcblxuICAgIHRoaXMuX2Z1bmNBcmcwID0gYXJnMDtcbiAgICB0aGlzLl9mdW5jQXJnMSA9IGFyZzE7XG4gICAgdGhpcy5fZnVuY0FyZzIgPSBhcmcyO1xuXG4gICAgaSA9IC0xO1xuXG4gICAgd2hpbGUoKytpIDwgdmVydFNpemVaKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCB2ZXJ0U2l6ZVkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGsgPSAtMTtcbiAgICAgICAgICAgIHdoaWxlKCsrayA8IHZlcnRTaXplWClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ID0gaSAqIHZlcnRTaXplWVggKyBqICogdmVydFNpemVYICsgaztcbiAgICAgICAgICAgICAgICB2ZXJ0ICAgICAgID0gdmVydHNbdmVydHNJbmRleF07XG4gICAgICAgICAgICAgICAgdmVydFszXSAgICA9IHRoaXMuX2Z1bmModmVydFswXSx2ZXJ0WzFdLHZlcnRbMl0sYXJnMCxhcmcxLGFyZzIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbklTT1N1cmZhY2UucHJvdG90eXBlLl9nZW5TdXJmYWNlID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciB2ZXJ0U2l6ZVggID0gdGhpcy5fdmVydFNpemVYLFxuICAgICAgICB2ZXJ0U2l6ZVkgID0gdGhpcy5fdmVydFNpemVZLFxuICAgICAgICB2ZXJ0U2l6ZVogID0gdGhpcy5fdmVydFNpemVaLFxuICAgICAgICB2ZXJ0U2l6ZVpZID0gdmVydFNpemVaICogdmVydFNpemVZLFxuICAgICAgICB2ZXJ0U2l6ZVhZID0gdmVydFNpemVYICogdmVydFNpemVZO1xuXG4gICAgdmFyIHZlcnRzID0gdGhpcy5fdmVydHMsXG4gICAgICAgIHZlcnRzSW5kZXg7XG5cbiAgICB2YXIgY3ViZVNpemVYICA9IHRoaXMuX2N1YmVTaXplWCxcbiAgICAgICAgY3ViZVNpemVZICA9IHRoaXMuX2N1YmVTaXplWSxcbiAgICAgICAgY3ViZVNpemVaICA9IHRoaXMuX2N1YmVTaXplWixcbiAgICAgICAgY3ViZVNpemVaWSA9IGN1YmVTaXplWSAqIGN1YmVTaXplWjtcblxuICAgIHZhciBjdWJlcyA9IHRoaXMuX2N1YmVzLFxuICAgICAgICBjZWxsc0luZGV4O1xuXG4gICAgdmFyIHNjYWxlWFlaID0gdGhpcy5fc2NhbGVYWVo7XG5cbiAgICB2YXIgaSwgaiwgaztcblxuICAgIGkgPSAtMTtcblxuICAgIHdoaWxlKCsraSA8IHZlcnRTaXplWilcbiAgICB7XG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgdmVydFNpemVZKVxuICAgICAgICB7XG4gICAgICAgICAgICBrID0gLTE7XG4gICAgICAgICAgICB3aGlsZSgrK2sgPCB2ZXJ0U2l6ZVgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmVydHNJbmRleCAgICAgICAgPSBpICogdmVydFNpemVaWSArIGogKiB2ZXJ0U2l6ZVogKyBrO1xuXG4gICAgICAgICAgICAgICAgdmVydHNbdmVydHNJbmRleF0gPSBbKC0wLjUgKyAoIGsgLyAodmVydFNpemVYIC0gMSkpKSAqIHNjYWxlWFlaWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgtMC41ICsgKCBqIC8gKHZlcnRTaXplWSAtIDEpKSkgKiBzY2FsZVhZWlsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLTAuNSArICggaSAvICh2ZXJ0U2l6ZVogLSAxKSkpICogc2NhbGVYWVpbMl0sXG4gICAgICAgICAgICAgICAgICAgIC0xXTtcblxuXG4gICAgICAgICAgICAgICAgaWYoaSA8IGN1YmVTaXplWCAmJiBqIDwgY3ViZVNpemVZICYmIGsgIDwgY3ViZVNpemVaKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbHNJbmRleCA9IGkgKiBjdWJlU2l6ZVpZICsgaiAqIGN1YmVTaXplWCArIGs7XG5cbiAgICAgICAgICAgICAgICAgICAgY3ViZXNbY2VsbHNJbmRleF0gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgdmVydFNpemVaLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIHZlcnRTaXplWiArIDEsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRzSW5kZXggKyB2ZXJ0U2l6ZVhZLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIHZlcnRTaXplWFkgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydHNJbmRleCArIHZlcnRTaXplWiArIHZlcnRTaXplWFksXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0c0luZGV4ICsgdmVydFNpemVaICsgdmVydFNpemVYWSArIDFcbiAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5JU09TdXJmYWNlLnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uKGdsKVxue1xuICAgIGdsLmRpc2FibGVEZWZhdWx0VGV4Q29vcmRzQXR0cmliQXJyYXkoKTtcbiAgICBnbC5lbmFibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkoKTtcblxuICAgIHZhciBfZ2wgPSBnbC5nbDtcblxuICAgIHZhciBnbEFycmF5QnVmZmVyID0gX2dsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgZ2xGbG9hdCAgICAgICA9IF9nbC5GTE9BVDtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMuX2JWZXJ0aWNlcyxcbiAgICAgICAgbm9ybWFscyAgPSB0aGlzLl9iTm9ybWFscyxcbiAgICAgICAgY29sb3JzICAgPSB0aGlzLl9iQ29sb3JzO1xuXG4gICAgdmFyIHZibGVuID0gdmVydGljZXMuYnl0ZUxlbmd0aCxcbiAgICAgICAgbmJsZW4gPSBub3JtYWxzLmJ5dGVMZW5ndGgsXG4gICAgICAgIGNibGVuID0gY29sb3JzLmJ5dGVMZW5ndGg7XG5cbiAgICB2YXIgb2Zmc2V0ViA9IDAsXG4gICAgICAgIG9mZnNldE4gPSBvZmZzZXRWICsgdmJsZW4sXG4gICAgICAgIG9mZnNldEMgPSBvZmZzZXROICsgbmJsZW47XG5cbiAgICBfZ2wuYnVmZmVyRGF0YShnbEFycmF5QnVmZmVyLCB2YmxlbiArIG5ibGVuICsgY2JsZW4sIF9nbC5EWU5BTUlDX0RSQVcpO1xuXG4gICAgX2dsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0ViwgIHZlcnRpY2VzKTtcbiAgICBfZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXROLCAgbm9ybWFscyk7XG4gICAgX2dsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgIGNvbG9ycyk7XG5cbiAgICBfZ2wudmVydGV4QXR0cmliUG9pbnRlcihnbC5nZXREZWZhdWx0VmVydGV4QXR0cmliKCksIDMsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRWKTtcbiAgICBfZ2wudmVydGV4QXR0cmliUG9pbnRlcihnbC5nZXREZWZhdWx0Tm9ybWFsQXR0cmliKCksIDMsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXROKTtcbiAgICBfZ2wudmVydGV4QXR0cmliUG9pbnRlcihnbC5nZXREZWZhdWx0Q29sb3JBdHRyaWIoKSwgIDQsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRDKTtcblxuICAgIGdsLnNldE1hdHJpY2VzVW5pZm9ybSgpO1xuICAgIF9nbC5kcmF3QXJyYXlzKF9nbC5UUklBTkdMRVMsMCx0aGlzLl9udW1UcmlhbmdsZXMgKiAzKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuSVNPU3VyZmFjZS5FREdFX1RBQkxFID0gbmV3IEludDMyQXJyYXkoXG4gICAgW1xuICAgICAgICAweDAgICwgMHgxMDksIDB4MjAzLCAweDMwYSwgMHg0MDYsIDB4NTBmLCAweDYwNSwgMHg3MGMsXG4gICAgICAgIDB4ODBjLCAweDkwNSwgMHhhMGYsIDB4YjA2LCAweGMwYSwgMHhkMDMsIDB4ZTA5LCAweGYwMCxcbiAgICAgICAgMHgxOTAsIDB4OTkgLCAweDM5MywgMHgyOWEsIDB4NTk2LCAweDQ5ZiwgMHg3OTUsIDB4NjljLFxuICAgICAgICAweDk5YywgMHg4OTUsIDB4YjlmLCAweGE5NiwgMHhkOWEsIDB4YzkzLCAweGY5OSwgMHhlOTAsXG4gICAgICAgIDB4MjMwLCAweDMzOSwgMHgzMyAsIDB4MTNhLCAweDYzNiwgMHg3M2YsIDB4NDM1LCAweDUzYyxcbiAgICAgICAgMHhhM2MsIDB4YjM1LCAweDgzZiwgMHg5MzYsIDB4ZTNhLCAweGYzMywgMHhjMzksIDB4ZDMwLFxuICAgICAgICAweDNhMCwgMHgyYTksIDB4MWEzLCAweGFhICwgMHg3YTYsIDB4NmFmLCAweDVhNSwgMHg0YWMsXG4gICAgICAgIDB4YmFjLCAweGFhNSwgMHg5YWYsIDB4OGE2LCAweGZhYSwgMHhlYTMsIDB4ZGE5LCAweGNhMCxcbiAgICAgICAgMHg0NjAsIDB4NTY5LCAweDY2MywgMHg3NmEsIDB4NjYgLCAweDE2ZiwgMHgyNjUsIDB4MzZjLFxuICAgICAgICAweGM2YywgMHhkNjUsIDB4ZTZmLCAweGY2NiwgMHg4NmEsIDB4OTYzLCAweGE2OSwgMHhiNjAsXG4gICAgICAgIDB4NWYwLCAweDRmOSwgMHg3ZjMsIDB4NmZhLCAweDFmNiwgMHhmZiAsIDB4M2Y1LCAweDJmYyxcbiAgICAgICAgMHhkZmMsIDB4Y2Y1LCAweGZmZiwgMHhlZjYsIDB4OWZhLCAweDhmMywgMHhiZjksIDB4YWYwLFxuICAgICAgICAweDY1MCwgMHg3NTksIDB4NDUzLCAweDU1YSwgMHgyNTYsIDB4MzVmLCAweDU1ICwgMHgxNWMsXG4gICAgICAgIDB4ZTVjLCAweGY1NSwgMHhjNWYsIDB4ZDU2LCAweGE1YSwgMHhiNTMsIDB4ODU5LCAweDk1MCxcbiAgICAgICAgMHg3YzAsIDB4NmM5LCAweDVjMywgMHg0Y2EsIDB4M2M2LCAweDJjZiwgMHgxYzUsIDB4Y2MgLFxuICAgICAgICAweGZjYywgMHhlYzUsIDB4ZGNmLCAweGNjNiwgMHhiY2EsIDB4YWMzLCAweDljOSwgMHg4YzAsXG4gICAgICAgIDB4OGMwLCAweDljOSwgMHhhYzMsIDB4YmNhLCAweGNjNiwgMHhkY2YsIDB4ZWM1LCAweGZjYyxcbiAgICAgICAgMHhjYyAsIDB4MWM1LCAweDJjZiwgMHgzYzYsIDB4NGNhLCAweDVjMywgMHg2YzksIDB4N2MwLFxuICAgICAgICAweDk1MCwgMHg4NTksIDB4YjUzLCAweGE1YSwgMHhkNTYsIDB4YzVmLCAweGY1NSwgMHhlNWMsXG4gICAgICAgIDB4MTVjLCAweDU1ICwgMHgzNWYsIDB4MjU2LCAweDU1YSwgMHg0NTMsIDB4NzU5LCAweDY1MCxcbiAgICAgICAgMHhhZjAsIDB4YmY5LCAweDhmMywgMHg5ZmEsIDB4ZWY2LCAweGZmZiwgMHhjZjUsIDB4ZGZjLFxuICAgICAgICAweDJmYywgMHgzZjUsIDB4ZmYgLCAweDFmNiwgMHg2ZmEsIDB4N2YzLCAweDRmOSwgMHg1ZjAsXG4gICAgICAgIDB4YjYwLCAweGE2OSwgMHg5NjMsIDB4ODZhLCAweGY2NiwgMHhlNmYsIDB4ZDY1LCAweGM2YyxcbiAgICAgICAgMHgzNmMsIDB4MjY1LCAweDE2ZiwgMHg2NiAsIDB4NzZhLCAweDY2MywgMHg1NjksIDB4NDYwLFxuICAgICAgICAweGNhMCwgMHhkYTksIDB4ZWEzLCAweGZhYSwgMHg4YTYsIDB4OWFmLCAweGFhNSwgMHhiYWMsXG4gICAgICAgIDB4NGFjLCAweDVhNSwgMHg2YWYsIDB4N2E2LCAweGFhICwgMHgxYTMsIDB4MmE5LCAweDNhMCxcbiAgICAgICAgMHhkMzAsIDB4YzM5LCAweGYzMywgMHhlM2EsIDB4OTM2LCAweDgzZiwgMHhiMzUsIDB4YTNjLFxuICAgICAgICAweDUzYywgMHg0MzUsIDB4NzNmLCAweDYzNiwgMHgxM2EsIDB4MzMgLCAweDMzOSwgMHgyMzAsXG4gICAgICAgIDB4ZTkwLCAweGY5OSwgMHhjOTMsIDB4ZDlhLCAweGE5NiwgMHhiOWYsIDB4ODk1LCAweDk5YyxcbiAgICAgICAgMHg2OWMsIDB4Nzk1LCAweDQ5ZiwgMHg1OTYsIDB4MjlhLCAweDM5MywgMHg5OSAsIDB4MTkwLFxuICAgICAgICAweGYwMCwgMHhlMDksIDB4ZDAzLCAweGMwYSwgMHhiMDYsIDB4YTBmLCAweDkwNSwgMHg4MGMsXG4gICAgICAgIDB4NzBjLCAweDYwNSwgMHg1MGYsIDB4NDA2LCAweDMwYSwgMHgyMDMsIDB4MTA5LCAweDBcbiAgICBdKTtcblxuSVNPU3VyZmFjZS5UUklfVEFCTEUgPSBuZXcgSW50MzJBcnJheShcbiAgICBbXG4gICAgICAgIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgOSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDgsIDMsIDksIDgsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDMsIDEsIDIsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMiwgMTAsIDAsIDIsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCA4LCAzLCAyLCAxMCwgOCwgMTAsIDksIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxMSwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDExLCAyLCA4LCAxMSwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDksIDAsIDIsIDMsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMTEsIDIsIDEsIDksIDExLCA5LCA4LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDEwLCAxLCAxMSwgMTAsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxMCwgMSwgMCwgOCwgMTAsIDgsIDExLCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDksIDAsIDMsIDExLCA5LCAxMSwgMTAsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA4LCAxMCwgMTAsIDgsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgNywgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDMsIDAsIDcsIDMsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCA5LCA4LCA0LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMSwgOSwgNCwgNywgMSwgNywgMywgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDEwLCA4LCA0LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgNCwgNywgMywgMCwgNCwgMSwgMiwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAyLCAxMCwgOSwgMCwgMiwgOCwgNCwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDEwLCA5LCAyLCA5LCA3LCAyLCA3LCAzLCA3LCA5LCA0LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgNCwgNywgMywgMTEsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgNCwgNywgMTEsIDIsIDQsIDIsIDAsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAwLCAxLCA4LCA0LCA3LCAyLCAzLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDcsIDExLCA5LCA0LCAxMSwgOSwgMTEsIDIsIDksIDIsIDEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCAxMCwgMSwgMywgMTEsIDEwLCA3LCA4LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMTEsIDEwLCAxLCA0LCAxMSwgMSwgMCwgNCwgNywgMTEsIDQsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA3LCA4LCA5LCAwLCAxMSwgOSwgMTEsIDEwLCAxMSwgMCwgMywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDcsIDExLCA0LCAxMSwgOSwgOSwgMTEsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDQsIDAsIDgsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA1LCA0LCAxLCA1LCAwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgNSwgNCwgOCwgMywgNSwgMywgMSwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDEwLCA5LCA1LCA0LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMCwgOCwgMSwgMiwgMTAsIDQsIDksIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAyLCAxMCwgNSwgNCwgMiwgNCwgMCwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDEwLCA1LCAzLCAyLCA1LCAzLCA1LCA0LCAzLCA0LCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNCwgMiwgMywgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxMSwgMiwgMCwgOCwgMTEsIDQsIDksIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA1LCA0LCAwLCAxLCA1LCAyLCAzLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDEsIDUsIDIsIDUsIDgsIDIsIDgsIDExLCA0LCA4LCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDMsIDExLCAxMCwgMSwgMywgOSwgNSwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDksIDUsIDAsIDgsIDEsIDgsIDEwLCAxLCA4LCAxMSwgMTAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCA0LCAwLCA1LCAwLCAxMSwgNSwgMTEsIDEwLCAxMSwgMCwgMywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDQsIDgsIDUsIDgsIDEwLCAxMCwgOCwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA3LCA4LCA1LCA3LCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMywgMCwgOSwgNSwgMywgNSwgNywgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDcsIDgsIDAsIDEsIDcsIDEsIDUsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA1LCAzLCAzLCA1LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNywgOCwgOSwgNSwgNywgMTAsIDEsIDIsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgMSwgMiwgOSwgNSwgMCwgNSwgMywgMCwgNSwgNywgMywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDAsIDIsIDgsIDIsIDUsIDgsIDUsIDcsIDEwLCA1LCAyLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMTAsIDUsIDIsIDUsIDMsIDMsIDUsIDcsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCA5LCA1LCA3LCA4LCA5LCAzLCAxMSwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDcsIDksIDcsIDIsIDksIDIsIDAsIDIsIDcsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgMywgMTEsIDAsIDEsIDgsIDEsIDcsIDgsIDEsIDUsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgMiwgMSwgMTEsIDEsIDcsIDcsIDEsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA4LCA4LCA1LCA3LCAxMCwgMSwgMywgMTAsIDMsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgNywgMCwgNSwgMCwgOSwgNywgMTEsIDAsIDEsIDAsIDEwLCAxMSwgMTAsIDAsIC0xLFxuICAgICAgICAxMSwgMTAsIDAsIDExLCAwLCAzLCAxMCwgNSwgMCwgOCwgMCwgNywgNSwgNywgMCwgLTEsXG4gICAgICAgIDExLCAxMCwgNSwgNywgMTEsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNiwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDMsIDUsIDEwLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMCwgMSwgNSwgMTAsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA4LCAzLCAxLCA5LCA4LCA1LCAxMCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDYsIDUsIDIsIDYsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA2LCA1LCAxLCAyLCA2LCAzLCAwLCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNiwgNSwgOSwgMCwgNiwgMCwgMiwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDksIDgsIDUsIDgsIDIsIDUsIDIsIDYsIDMsIDIsIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAzLCAxMSwgMTAsIDYsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgMCwgOCwgMTEsIDIsIDAsIDEwLCA2LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgOSwgMiwgMywgMTEsIDUsIDEwLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMTAsIDYsIDEsIDksIDIsIDksIDExLCAyLCA5LCA4LCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDMsIDExLCA2LCA1LCAzLCA1LCAxLCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMTEsIDAsIDExLCA1LCAwLCA1LCAxLCA1LCAxMSwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDExLCA2LCAwLCAzLCA2LCAwLCA2LCA1LCAwLCA1LCA5LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgNSwgOSwgNiwgOSwgMTEsIDExLCA5LCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMTAsIDYsIDQsIDcsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCAzLCAwLCA0LCA3LCAzLCA2LCA1LCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDksIDAsIDUsIDEwLCA2LCA4LCA0LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDYsIDUsIDEsIDksIDcsIDEsIDcsIDMsIDcsIDksIDQsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCAxLCAyLCA2LCA1LCAxLCA0LCA3LCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgNSwgNSwgMiwgNiwgMywgMCwgNCwgMywgNCwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDQsIDcsIDksIDAsIDUsIDAsIDYsIDUsIDAsIDIsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCAzLCA5LCA3LCA5LCA0LCAzLCAyLCA5LCA1LCA5LCA2LCAyLCA2LCA5LCAtMSxcbiAgICAgICAgMywgMTEsIDIsIDcsIDgsIDQsIDEwLCA2LCA1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMTAsIDYsIDQsIDcsIDIsIDQsIDIsIDAsIDIsIDcsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgOSwgNCwgNywgOCwgMiwgMywgMTEsIDUsIDEwLCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMiwgMSwgOSwgMTEsIDIsIDksIDQsIDExLCA3LCAxMSwgNCwgNSwgMTAsIDYsIC0xLFxuICAgICAgICA4LCA0LCA3LCAzLCAxMSwgNSwgMywgNSwgMSwgNSwgMTEsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAxLCAxMSwgNSwgMTEsIDYsIDEsIDAsIDExLCA3LCAxMSwgNCwgMCwgNCwgMTEsIC0xLFxuICAgICAgICAwLCA1LCA5LCAwLCA2LCA1LCAwLCAzLCA2LCAxMSwgNiwgMywgOCwgNCwgNywgLTEsXG4gICAgICAgIDYsIDUsIDksIDYsIDksIDExLCA0LCA3LCA5LCA3LCAxMSwgOSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA0LCA5LCA2LCA0LCAxMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDEwLCA2LCA0LCA5LCAxMCwgMCwgOCwgMywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCAwLCAxLCAxMCwgNiwgMCwgNiwgNCwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDMsIDEsIDgsIDEsIDYsIDgsIDYsIDQsIDYsIDEsIDEwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNCwgOSwgMSwgMiwgNCwgMiwgNiwgNCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDAsIDgsIDEsIDIsIDksIDIsIDQsIDksIDIsIDYsIDQsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAyLCA0LCA0LCAyLCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMywgMiwgOCwgMiwgNCwgNCwgMiwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA0LCA5LCAxMCwgNiwgNCwgMTEsIDIsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA4LCAyLCAyLCA4LCAxMSwgNCwgOSwgMTAsIDQsIDEwLCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMTEsIDIsIDAsIDEsIDYsIDAsIDYsIDQsIDYsIDEsIDEwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgNCwgMSwgNiwgMSwgMTAsIDQsIDgsIDEsIDIsIDEsIDExLCA4LCAxMSwgMSwgLTEsXG4gICAgICAgIDksIDYsIDQsIDksIDMsIDYsIDksIDEsIDMsIDExLCA2LCAzLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMTEsIDEsIDgsIDEsIDAsIDExLCA2LCAxLCA5LCAxLCA0LCA2LCA0LCAxLCAtMSxcbiAgICAgICAgMywgMTEsIDYsIDMsIDYsIDAsIDAsIDYsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCA0LCA4LCAxMSwgNiwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDEwLCA2LCA3LCA4LCAxMCwgOCwgOSwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCA3LCAzLCAwLCAxMCwgNywgMCwgOSwgMTAsIDYsIDcsIDEwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDYsIDcsIDEsIDEwLCA3LCAxLCA3LCA4LCAxLCA4LCAwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDYsIDcsIDEwLCA3LCAxLCAxLCA3LCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMiwgNiwgMSwgNiwgOCwgMSwgOCwgOSwgOCwgNiwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDYsIDksIDIsIDksIDEsIDYsIDcsIDksIDAsIDksIDMsIDcsIDMsIDksIC0xLFxuICAgICAgICA3LCA4LCAwLCA3LCAwLCA2LCA2LCAwLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgMywgMiwgNiwgNywgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDMsIDExLCAxMCwgNiwgOCwgMTAsIDgsIDksIDgsIDYsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAwLCA3LCAyLCA3LCAxMSwgMCwgOSwgNywgNiwgNywgMTAsIDksIDEwLCA3LCAtMSxcbiAgICAgICAgMSwgOCwgMCwgMSwgNywgOCwgMSwgMTAsIDcsIDYsIDcsIDEwLCAyLCAzLCAxMSwgLTEsXG4gICAgICAgIDExLCAyLCAxLCAxMSwgMSwgNywgMTAsIDYsIDEsIDYsIDcsIDEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA5LCA2LCA4LCA2LCA3LCA5LCAxLCA2LCAxMSwgNiwgMywgMSwgMywgNiwgLTEsXG4gICAgICAgIDAsIDksIDEsIDExLCA2LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgOCwgMCwgNywgMCwgNiwgMywgMTEsIDAsIDExLCA2LCAwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgMTEsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCA2LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDAsIDgsIDExLCA3LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMSwgOSwgMTEsIDcsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAxLCA5LCA4LCAzLCAxLCAxMSwgNywgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCAxLCAyLCA2LCAxMSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDIsIDEwLCAzLCAwLCA4LCA2LCAxMSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDksIDAsIDIsIDEwLCA5LCA2LCAxMSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDExLCA3LCAyLCAxMCwgMywgMTAsIDgsIDMsIDEwLCA5LCA4LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNywgMiwgMywgNiwgMiwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDAsIDgsIDcsIDYsIDAsIDYsIDIsIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCA3LCA2LCAyLCAzLCA3LCAwLCAxLCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNiwgMiwgMSwgOCwgNiwgMSwgOSwgOCwgOCwgNywgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA3LCA2LCAxMCwgMSwgNywgMSwgMywgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA3LCA2LCAxLCA3LCAxMCwgMSwgOCwgNywgMSwgMCwgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDMsIDcsIDAsIDcsIDEwLCAwLCAxMCwgOSwgNiwgMTAsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA3LCA2LCAxMCwgNywgMTAsIDgsIDgsIDEwLCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgOCwgNCwgMTEsIDgsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCA2LCAxMSwgMywgMCwgNiwgMCwgNCwgNiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDgsIDYsIDExLCA4LCA0LCA2LCA5LCAwLCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNCwgNiwgOSwgNiwgMywgOSwgMywgMSwgMTEsIDMsIDYsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCA4LCA0LCA2LCAxMSwgOCwgMiwgMTAsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMCwgMywgMCwgMTEsIDAsIDYsIDExLCAwLCA0LCA2LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgMTEsIDgsIDQsIDYsIDExLCAwLCAyLCA5LCAyLCAxMCwgOSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEwLCA5LCAzLCAxMCwgMywgMiwgOSwgNCwgMywgMTEsIDMsIDYsIDQsIDYsIDMsIC0xLFxuICAgICAgICA4LCAyLCAzLCA4LCA0LCAyLCA0LCA2LCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgNCwgMiwgNCwgNiwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDksIDAsIDIsIDMsIDQsIDIsIDQsIDYsIDQsIDMsIDgsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA5LCA0LCAxLCA0LCAyLCAyLCA0LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgMSwgMywgOCwgNiwgMSwgOCwgNCwgNiwgNiwgMTAsIDEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgMSwgMCwgMTAsIDAsIDYsIDYsIDAsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA2LCAzLCA0LCAzLCA4LCA2LCAxMCwgMywgMCwgMywgOSwgMTAsIDksIDMsIC0xLFxuICAgICAgICAxMCwgOSwgNCwgNiwgMTAsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA5LCA1LCA3LCA2LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDMsIDQsIDksIDUsIDExLCA3LCA2LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNSwgMCwgMSwgNSwgNCwgMCwgNywgNiwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgNywgNiwgOCwgMywgNCwgMywgNSwgNCwgMywgMSwgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDUsIDQsIDEwLCAxLCAyLCA3LCA2LCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDYsIDExLCA3LCAxLCAyLCAxMCwgMCwgOCwgMywgNCwgOSwgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDYsIDExLCA1LCA0LCAxMCwgNCwgMiwgMTAsIDQsIDAsIDIsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAzLCA0LCA4LCAzLCA1LCA0LCAzLCAyLCA1LCAxMCwgNSwgMiwgMTEsIDcsIDYsIC0xLFxuICAgICAgICA3LCAyLCAzLCA3LCA2LCAyLCA1LCA0LCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNSwgNCwgMCwgOCwgNiwgMCwgNiwgMiwgNiwgOCwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDYsIDIsIDMsIDcsIDYsIDEsIDUsIDAsIDUsIDQsIDAsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA2LCAyLCA4LCA2LCA4LCA3LCAyLCAxLCA4LCA0LCA4LCA1LCAxLCA1LCA4LCAtMSxcbiAgICAgICAgOSwgNSwgNCwgMTAsIDEsIDYsIDEsIDcsIDYsIDEsIDMsIDcsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCA2LCAxMCwgMSwgNywgNiwgMSwgMCwgNywgOCwgNywgMCwgOSwgNSwgNCwgLTEsXG4gICAgICAgIDQsIDAsIDEwLCA0LCAxMCwgNSwgMCwgMywgMTAsIDYsIDEwLCA3LCAzLCA3LCAxMCwgLTEsXG4gICAgICAgIDcsIDYsIDEwLCA3LCAxMCwgOCwgNSwgNCwgMTAsIDQsIDgsIDEwLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgOSwgNSwgNiwgMTEsIDksIDExLCA4LCA5LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgNiwgMTEsIDAsIDYsIDMsIDAsIDUsIDYsIDAsIDksIDUsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxMSwgOCwgMCwgNSwgMTEsIDAsIDEsIDUsIDUsIDYsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNiwgMTEsIDMsIDYsIDMsIDUsIDUsIDMsIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMCwgOSwgNSwgMTEsIDksIDExLCA4LCAxMSwgNSwgNiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDExLCAzLCAwLCA2LCAxMSwgMCwgOSwgNiwgNSwgNiwgOSwgMSwgMiwgMTAsIC0xLFxuICAgICAgICAxMSwgOCwgNSwgMTEsIDUsIDYsIDgsIDAsIDUsIDEwLCA1LCAyLCAwLCAyLCA1LCAtMSxcbiAgICAgICAgNiwgMTEsIDMsIDYsIDMsIDUsIDIsIDEwLCAzLCAxMCwgNSwgMywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDgsIDksIDUsIDIsIDgsIDUsIDYsIDIsIDMsIDgsIDIsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA1LCA2LCA5LCA2LCAwLCAwLCA2LCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgNSwgOCwgMSwgOCwgMCwgNSwgNiwgOCwgMywgOCwgMiwgNiwgMiwgOCwgLTEsXG4gICAgICAgIDEsIDUsIDYsIDIsIDEsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAzLCA2LCAxLCA2LCAxMCwgMywgOCwgNiwgNSwgNiwgOSwgOCwgOSwgNiwgLTEsXG4gICAgICAgIDEwLCAxLCAwLCAxMCwgMCwgNiwgOSwgNSwgMCwgNSwgNiwgMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDMsIDgsIDUsIDYsIDEwLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDUsIDYsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMSwgNSwgMTAsIDcsIDUsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDUsIDEwLCAxMSwgNywgNSwgOCwgMywgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDExLCA3LCA1LCAxMCwgMTEsIDEsIDksIDAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxMCwgNywgNSwgMTAsIDExLCA3LCA5LCA4LCAxLCA4LCAzLCAxLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTEsIDEsIDIsIDExLCA3LCAxLCA3LCA1LCAxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMywgMSwgMiwgNywgMSwgNywgNSwgNywgMiwgMTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCA3LCA1LCA5LCAyLCA3LCA5LCAwLCAyLCAyLCAxMSwgNywgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDcsIDUsIDIsIDcsIDIsIDExLCA1LCA5LCAyLCAzLCAyLCA4LCA5LCA4LCAyLCAtMSxcbiAgICAgICAgMiwgNSwgMTAsIDIsIDMsIDUsIDMsIDcsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCAyLCAwLCA4LCA1LCAyLCA4LCA3LCA1LCAxMCwgMiwgNSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDAsIDEsIDUsIDEwLCAzLCA1LCAzLCA3LCAzLCAxMCwgMiwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDksIDgsIDIsIDksIDIsIDEsIDgsIDcsIDIsIDEwLCAyLCA1LCA3LCA1LCAyLCAtMSxcbiAgICAgICAgMSwgMywgNSwgMywgNywgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDgsIDcsIDAsIDcsIDEsIDEsIDcsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAwLCAzLCA5LCAzLCA1LCA1LCAzLCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgOCwgNywgNSwgOSwgNywgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDUsIDgsIDQsIDUsIDEwLCA4LCAxMCwgMTEsIDgsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAwLCA0LCA1LCAxMSwgMCwgNSwgMTAsIDExLCAxMSwgMywgMCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDEsIDksIDgsIDQsIDEwLCA4LCAxMCwgMTEsIDEwLCA0LCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMTAsIDExLCA0LCAxMCwgNCwgNSwgMTEsIDMsIDQsIDksIDQsIDEsIDMsIDEsIDQsIC0xLFxuICAgICAgICAyLCA1LCAxLCAyLCA4LCA1LCAyLCAxMSwgOCwgNCwgNSwgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDQsIDExLCAwLCAxMSwgMywgNCwgNSwgMTEsIDIsIDExLCAxLCA1LCAxLCAxMSwgLTEsXG4gICAgICAgIDAsIDIsIDUsIDAsIDUsIDksIDIsIDExLCA1LCA0LCA1LCA4LCAxMSwgOCwgNSwgLTEsXG4gICAgICAgIDksIDQsIDUsIDIsIDExLCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMiwgNSwgMTAsIDMsIDUsIDIsIDMsIDQsIDUsIDMsIDgsIDQsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA1LCAxMCwgMiwgNSwgMiwgNCwgNCwgMiwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDEwLCAyLCAzLCA1LCAxMCwgMywgOCwgNSwgNCwgNSwgOCwgMCwgMSwgOSwgLTEsXG4gICAgICAgIDUsIDEwLCAyLCA1LCAyLCA0LCAxLCA5LCAyLCA5LCA0LCAyLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOCwgNCwgNSwgOCwgNSwgMywgMywgNSwgMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDQsIDUsIDEsIDAsIDUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA4LCA0LCA1LCA4LCA1LCAzLCA5LCAwLCA1LCAwLCAzLCA1LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNCwgNSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDExLCA3LCA0LCA5LCAxMSwgOSwgMTAsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgOCwgMywgNCwgOSwgNywgOSwgMTEsIDcsIDksIDEwLCAxMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDEwLCAxMSwgMSwgMTEsIDQsIDEsIDQsIDAsIDcsIDQsIDExLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMSwgNCwgMywgNCwgOCwgMSwgMTAsIDQsIDcsIDQsIDExLCAxMCwgMTEsIDQsIC0xLFxuICAgICAgICA0LCAxMSwgNywgOSwgMTEsIDQsIDksIDIsIDExLCA5LCAxLCAyLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgNywgNCwgOSwgMTEsIDcsIDksIDEsIDExLCAyLCAxMSwgMSwgMCwgOCwgMywgLTEsXG4gICAgICAgIDExLCA3LCA0LCAxMSwgNCwgMiwgMiwgNCwgMCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDExLCA3LCA0LCAxMSwgNCwgMiwgOCwgMywgNCwgMywgMiwgNCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDksIDEwLCAyLCA3LCA5LCAyLCAzLCA3LCA3LCA0LCA5LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMTAsIDcsIDksIDcsIDQsIDEwLCAyLCA3LCA4LCA3LCAwLCAyLCAwLCA3LCAtMSxcbiAgICAgICAgMywgNywgMTAsIDMsIDEwLCAyLCA3LCA0LCAxMCwgMSwgMTAsIDAsIDQsIDAsIDEwLCAtMSxcbiAgICAgICAgMSwgMTAsIDIsIDgsIDcsIDQsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA5LCAxLCA0LCAxLCA3LCA3LCAxLCAzLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgNCwgOSwgMSwgNCwgMSwgNywgMCwgOCwgMSwgOCwgNywgMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDQsIDAsIDMsIDcsIDQsIDMsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA0LCA4LCA3LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgOSwgMTAsIDgsIDEwLCAxMSwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDAsIDksIDMsIDksIDExLCAxMSwgOSwgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAxLCAxMCwgMCwgMTAsIDgsIDgsIDEwLCAxMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDMsIDEsIDEwLCAxMSwgMywgMTAsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAxLCAyLCAxMSwgMSwgMTEsIDksIDksIDExLCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMCwgOSwgMywgOSwgMTEsIDEsIDIsIDksIDIsIDExLCA5LCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMCwgMiwgMTEsIDgsIDAsIDExLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMywgMiwgMTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAyLCAzLCA4LCAyLCA4LCAxMCwgMTAsIDgsIDksIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICA5LCAxMCwgMiwgMCwgOSwgMiwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDIsIDMsIDgsIDIsIDgsIDEwLCAwLCAxLCA4LCAxLCAxMCwgOCwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDEsIDEwLCAyLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgMSwgMywgOCwgOSwgMSwgOCwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsXG4gICAgICAgIDAsIDksIDEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLFxuICAgICAgICAwLCAzLCA4LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSxcbiAgICAgICAgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFcbiAgICBdKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJU09TdXJmYWNlOyIsIlxubW9kdWxlLmV4cG9ydHMgPVxue1xuXG4gICAgLy9UT0RPOiBjbGVhbiB1cFxuXG4gICAgaXNQb2ludExlZnQgOiBmdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5MilcbiAgICB7XG4gICAgICAgIHJldHVybiAoIHgxIC0geDAgKSAqICggeTIgLSB5MCApIC0gKHgyIC0geDApICogKHkxIC0geTApO1xuICAgIH0sXG5cbiAgICAvL2h0dHA6Ly9hbGllbnJ5ZGVyZmxleC5jb20vaW50ZXJzZWN0L1xuICAgIGlzSW50ZXJzZWN0aW9uZiA6IGZ1bmN0aW9uKGF4LGF5LGJ4LGJ5LGN4LGN5LGR4LGR5LG91dClcbiAgICB7XG4gICAgICAgIHZhciBkaXN0QUIsXG4gICAgICAgICAgICBjb3MsXG4gICAgICAgICAgICBzaW4sXG4gICAgICAgICAgICBuZXdYLFxuICAgICAgICAgICAgcG9zYWI7XG5cbiAgICAgICAgaWYgKGF4ID09IGJ4ICYmIGF5ID09IGJ5IHx8XG4gICAgICAgICAgICBjeCA9PSBkeCAmJiBjeSA9PSBkeSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBieCAtPSBheDtcbiAgICAgICAgYnkgLT0gYXk7XG4gICAgICAgIGN4IC09IGF4O1xuICAgICAgICBjeSAtPSBheTtcbiAgICAgICAgZHggLT0gYXg7XG4gICAgICAgIGR5IC09IGF5O1xuXG4gICAgICAgIGRpc3RBQiA9IDEgLyAoTWF0aC5zcXJ0KGJ4KmJ4K2J5KmJ5KSB8fCAxKTtcblxuICAgICAgICBjb3MgID0gYnggKiBkaXN0QUI7XG4gICAgICAgIHNpbiAgPSBieSAqIGRpc3RBQjtcbiAgICAgICAgbmV3WCA9IGN4ICogY29zICsgY3kgKiBzaW47XG4gICAgICAgIGN5ICAgPSBjeSAqIGNvcyAtIGN4ICogc2luO1xuICAgICAgICBjeCAgID0gbmV3WDtcbiAgICAgICAgbmV3WCA9IGR4ICogY29zICsgZHkgKiBzaW47XG4gICAgICAgIGR5ICAgPSBkeSAqIGNvcyAtIGR4ICogc2luO1xuICAgICAgICBkeCAgID0gbmV3WDtcblxuICAgICAgICBpZiAoY3kgPT0gZHkpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBwb3NhYiAgPSBkeCArICggY3ggLSBkeCApICogZHkgLyAoIGR5IC0gY3kgKTtcblxuICAgICAgICBpZihvdXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG91dFswXSA9IGF4ICsgcG9zYWIgKiBjb3M7XG4gICAgICAgICAgICBvdXRbMV0gPSBheSArIHBvc2FiICogc2luO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGlzSW50ZXJzZWN0aW9uIDogZnVuY3Rpb24obDAsbDEsb3V0KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNJbnRlcnNlY3Rpb25mKGwwWzBdLGwwWzFdLGwwWzJdLGwwWzNdLGwxWzBdLGwwWzFdLGwxWzJdLGwxWzNdLG91dCk7XG4gICAgfSAsXG5cbiAgICBpc1NlZ21lbnRJbnRlcnNlY3Rpb25mIDogZnVuY3Rpb24oYXgsYXksYngsYnksY3gsY3ksZHgsZHksb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIGRpc3RhYixcbiAgICAgICAgICAgIGNvcyxcbiAgICAgICAgICAgIHNpbixcbiAgICAgICAgICAgIG5ld1gsXG4gICAgICAgICAgICBwb3NhYjtcblxuICAgICAgICBpZiAoYXggPT0gYnggJiYgYXkgPT0gYnkgfHxcbiAgICAgICAgICAgIGN4ID09IGR4ICYmIGN5ID09IGR5KVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmIChheD09Y3ggJiYgYXk9PWN5IHx8IGJ4PT1jeCAmJiBieT09Y3lcbiAgICAgICAgICAgIHx8ICBheD09ZHggJiYgYXk9PWR5IHx8IGJ4PT1keCAmJiBieT09ZHkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgfVxuXG4gICAgICAgIGJ4IC09IGF4O1xuICAgICAgICBieSAtPSBheTtcbiAgICAgICAgY3ggLT0gYXg7XG4gICAgICAgIGN5IC09IGF5O1xuICAgICAgICBkeCAtPSBheDtcbiAgICAgICAgZHkgLT0gYXk7XG5cbiAgICAgICAgZGlzdGFiPSBNYXRoLnNxcnQoYngqYngrYnkqYnkpO1xuXG4gICAgICAgIGNvcyAgPSBieCAvIGRpc3RhYjtcbiAgICAgICAgc2luICA9IGJ5IC8gZGlzdGFiO1xuICAgICAgICBuZXdYID0gY3ggKiBjb3MgKyBjeSAqIHNpbjtcbiAgICAgICAgY3kgICA9IGN5ICogY29zIC0gY3ggKiBzaW47XG4gICAgICAgIGN4ICAgPSBuZXdYO1xuICAgICAgICBuZXdYID0gZHggKiBjb3MgKyBkeSAqIHNpbjtcbiAgICAgICAgZHkgICA9IGR5ICogY29zIC0gZHggKiBzaW47XG4gICAgICAgIGR4ICAgPSBuZXdYO1xuXG4gICAgICAgIGlmKGN5IDwgMC4wICYmIGR5IDwgMC4wIHx8IGN5ID49IDAuMCAmJiBkeSA+PSAwLjApcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHBvc2FiICA9IGR4ICsgKCBjeCAtIGR4ICkgKiBkeSAvICggZHkgLSBjeSApO1xuXG4gICAgICAgIGlmKHBvc2FiIDwgMC4wIHx8IHBvc2FiID4gZGlzdGFiKXJldHVybiBmYWxzZTtcblxuICAgICAgICBpZihvdXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG91dFswXSA9IGF4ICsgcG9zYWIgKiBjb3M7XG4gICAgICAgICAgICBvdXRbMV0gPSBheSArIHBvc2FiICogc2luO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cbn07IiwiXG5cblxuZnVuY3Rpb24gTGluZUJ1ZmZlcjJkKGtnbCxzaXplKVxue1xuICAgIHRoaXMuX2dsICAgICAgPSBrZ2w7XG5cbiAgICB0aGlzLl92Ym8gICAgID0gbnVsbDtcbiAgICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcbiAgICB0aGlzLmNvbG9ycyAgID0gbnVsbDtcblxuICAgIHRoaXMuX3ZlcnRJbmRleCA9IDA7XG4gICAgdGhpcy5fY29sSW5kZXggID0gMDtcblxuICAgIGlmKHNpemUpdGhpcy5hbGxvY2F0ZShzaXplKTtcbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL3Byb2JhYmx5IHNob3VsZG50IGRvIHRoaXNcbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuYmluZCAgID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLl9nbCxcbiAgICAgICAgZ2wgICAgPSBrZ2wuZ2w7XG5cbiAgICBrZ2wuZGlzYWJsZURlZmF1bHROb3JtYWxBdHRyaWJBcnJheSgpO1xuICAgIGtnbC5kaXNhYmxlRGVmYXVsdFRleENvb3Jkc0F0dHJpYkFycmF5KCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsdGhpcy5fdmJvKTtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBrZ2wgPSB0aGlzLl9nbDtcblxuICAgIGtnbC5lbmFibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkoKTtcbiAgICBrZ2wuZW5hYmxlRGVmYXVsdFRleENvb3Jkc0F0dHJpYkFycmF5KCk7XG4gICAga2dsLmJpbmREZWZhdWx0VkJPKCk7XG59O1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnB1c2hWZXJ0ZXgzZiA9IGZ1bmN0aW9uKHgseSx6KVxue1xuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG5cbiAgICAvL2lmKHRoaXMuX3NhZmVBbGxvY2F0ZSAmJiB0aGlzLl92ZXJ0SW5kZXggPiB2ZXJ0aWNlcy5sZW5ndGggLSAzKXRoaXMuYWxsb2NhdGUodmVydGljZXMubGVuZ3RoICogMS4xKTtcblxuICAgIHZlcnRpY2VzW3RoaXMuX3ZlcnRJbmRleCsrXSA9IHg7XG4gICAgdmVydGljZXNbdGhpcy5fdmVydEluZGV4KytdID0geTtcbiAgICB2ZXJ0aWNlc1t0aGlzLl92ZXJ0SW5kZXgrK10gPSB6O1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5wdXNoQ29sb3I0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpXG57XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMuY29sb3JzO1xuXG4gICAgY29sb3JzW3RoaXMuX2NvbEluZGV4KytdID0gcjtcbiAgICBjb2xvcnNbdGhpcy5fY29sSW5kZXgrK10gPSBnO1xuICAgIGNvbG9yc1t0aGlzLl9jb2xJbmRleCsrXSA9IGI7XG4gICAgY29sb3JzW3RoaXMuX2NvbEluZGV4KytdID0gYTtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuc2V0VmVydGV4M2YgPSBmdW5jdGlvbih4LHkseixpbmRleDMpXG57XG4gICAgaW5kZXgzKj0zO1xuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG5cbiAgICB2ZXJ0aWNlc1tpbmRleDMgIF0gPSB4O1xuICAgIHZlcnRpY2VzW2luZGV4MysxXSA9IHk7XG4gICAgdmVydGljZXNbaW5kZXgzKzJdID0gejtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuc2V0Q29sb3I0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEsaW5kZXg0KVxue1xuICAgIGluZGV4NCo9NDtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5jb2xvcnM7XG5cbiAgICBjb2xvcnNbaW5kZXg0ICBdID0gcjtcbiAgICBjb2xvcnNbaW5kZXg0KzFdID0gZztcbiAgICBjb2xvcnNbaW5kZXg0KzJdID0gYjtcbiAgICBjb2xvcnNbaW5kZXg0KzNdID0gYTtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUucHVzaFZlcnRleCAgICA9IGZ1bmN0aW9uKHYpe3RoaXMucHVzaFZlcnRleDNmKHZbMF0sdlsxXSx2WzJdKTt9O1xuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5wdXNoQ29sb3IgICAgID0gZnVuY3Rpb24oYyl7dGhpcy5wdXNoQ29sb3I0ZihjWzBdLGNbMV0sY1syXSxjWzNdKTt9O1xuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5zZXRWZXJ0ZXggICAgID0gZnVuY3Rpb24odixpbmRleCl7dGhpcy5zZXRWZXJ0ZXgzZih2WzBdLHZbMV0sdlsyXSxpbmRleCk7fTtcbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuc2V0Q29sb3IgICAgICA9IGZ1bmN0aW9uKGMsaW5kZXgpe3RoaXMuc2V0Q29sb3I0ZihjWzBdLGNbMV0sY1syXSxjWzNdLGluZGV4KTt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuYnVmZmVyID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBnbGtsICAgICAgICAgID0gdGhpcy5fZ2wsXG4gICAgICAgIGdsICAgICAgICAgICAgPSBnbGtsLmdsLFxuICAgICAgICBnbEFycmF5QnVmZmVyID0gZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICBnbEZsb2F0ICAgICAgID0gZ2wuRkxPQVQ7XG5cblxuXG4gICAgdmFyIHZibGVuID0gdGhpcy52ZXJ0aWNlcy5ieXRlTGVuZ3RoLFxuICAgICAgICBjYmxlbiA9IHRoaXMuY29sb3JzLmJ5dGVMZW5ndGg7XG5cbiAgICB2YXIgb2Zmc2V0ViA9IDAsXG4gICAgICAgIG9mZnNldEMgPSBvZmZzZXRWICsgdmJsZW47XG5cbiAgICBnbC5idWZmZXJEYXRhKGdsQXJyYXlCdWZmZXIsdmJsZW4gKyBjYmxlbiwgZ2wuRFlOQU1JQ19EUkFXKTtcbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0Vix0aGlzLnZlcnRpY2VzKTtcbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0Qyx0aGlzLmNvbG9ycyk7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihnbGtsLmdldERlZmF1bHRWZXJ0ZXhBdHRyaWIoKSxnbGtsLlNJWkVfT0ZfVkVSVEVYLGdsRmxvYXQsZmFsc2UsMCxvZmZzZXRWKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsa2wuZ2V0RGVmYXVsdENvbG9yQXR0cmliKCksIGdsa2wuU0laRV9PRl9DT0xPUiwgZ2xGbG9hdCxmYWxzZSwwLG9mZnNldEMpO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZmlyc3QsY291bnQpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMuX2dsLFxuICAgICAgICBnbCAgICA9IGtnbC5nbDtcblxuICAga2dsLnNldE1hdHJpY2VzVW5pZm9ybSgpO1xuICAgZ2wuZHJhd0FycmF5cyhrZ2wuZ2V0RHJhd01vZGUoKSxcbiAgICAgICAgICAgICAgICAgZmlyc3QgfHwgMCxcbiAgICAgICAgICAgICAgICAgY291bnQgfHwgdGhpcy52ZXJ0aWNlcy5sZW5ndGggLyBrZ2wuU0laRV9PRl9WRVJURVgpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX3ZlcnRJbmRleCA9IDA7XG4gICAgdGhpcy5fY29sSW5kZXggID0gMDtcbn07XG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuZGlzcG9zZSAgPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fZ2wuZ2wuZGVsZXRlQnVmZmVyKHRoaXMuX3Zibyk7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XG4gICAgdGhpcy5jb2xvcnMgICA9IG51bGw7XG4gICAgdGhpcy5yZXNldCgpO1xufTtcblxuTGluZUJ1ZmZlcjJkLnByb3RvdHlwZS5hbGxvY2F0ZSA9IGZ1bmN0aW9uKHNpemUpXG57XG4gICAgdmFyIGtnbCA9IHRoaXMuX2dsLFxuICAgICAgICBnbCAgICA9IGtnbC5nbDtcblxuICAgIC8vbmVlZCB0byBkZWxldGVCdWZmZXIsIGluc3RlYWQgb2YgcmV1c2luZyBpdCwgb3RoZXJ3aXNlIGVycm9yLCBobVxuICAgIGlmKHRoaXMuX3Zibyl7Z2wuZGVsZXRlQnVmZmVyKHRoaXMuX3Zibyk7fXRoaXMuX3ZibyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIHRoaXMudmVydGljZXMgPSB0aGlzLnZlcnRpY2VzIHx8IG5ldyBGbG9hdDMyQXJyYXkoMCk7XG4gICAgdGhpcy5jb2xvcnMgICA9IHRoaXMuY29sb3JzICAgfHwgbmV3IEZsb2F0MzJBcnJheSgwKTtcblxuICAgIHZhciB2ZXJ0TGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGgsXG4gICAgICAgIGNvbHNMZW4gPSB0aGlzLmNvbG9ycy5sZW5ndGg7XG5cbiAgICBpZih2ZXJ0TGVuIDwgc2l6ZSlcbiAgICB7XG4gICAgICAgIHZhciB0ZW1wO1xuXG4gICAgICAgIHRlbXAgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xuICAgICAgICB0ZW1wLnNldCh0aGlzLnZlcnRpY2VzKTtcbiAgICAgICAgdGVtcC5zZXQobmV3IEZsb2F0MzJBcnJheSh0ZW1wLmxlbmd0aCAtIHZlcnRMZW4pLHZlcnRMZW4pO1xuICAgICAgICB0aGlzLnZlcnRpY2VzID0gdGVtcDtcblxuICAgICAgICB0ZW1wID0gbmV3IEZsb2F0MzJBcnJheShzaXplIC8gMyAqIDQpO1xuICAgICAgICB0ZW1wLnNldCh0aGlzLmNvbG9ycyk7XG4gICAgICAgIHRlbXAuc2V0KG5ldyBGbG9hdDMyQXJyYXkodGVtcC5sZW5ndGggLSBjb2xzTGVuKSxjb2xzTGVuKTtcbiAgICAgICAgdGhpcy5jb2xvcnMgPSB0ZW1wO1xuICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIyZC5wcm90b3R5cGUuZ2V0U2l6ZUFsbG9jYXRlZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmVydGljZXMubGVuZ3RoO307XG5MaW5lQnVmZmVyMmQucHJvdG90eXBlLmdldFNpemVQdXNoZWQgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl92ZXJ0SW5kZXg7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lQnVmZmVyMmQ7XG5cbiIsInZhciBHZW9tM2QgPSByZXF1aXJlKCcuL2dsa0dlb20zZCcpLFxuICAgIE1hdDQ0ICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrTWF0NDQnKSxcbiAgICBWZWMzICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzMnKTtcblxuLy9UT0RPOlxuLy9GaXggc2hhcmVkIG5vcm1hbHMgb24gY2Fwc1xuLy9cblxuXG5MaW5lQnVmZmVyM2QgPSBmdW5jdGlvbihwb2ludHMsbnVtU2VnbWVudHMsZGlhbWV0ZXIsc2xpY2VTZWdtZW50RnVuYyxjbG9zZWQpXG57XG4gICAgR2VvbTNkLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcblxuICAgIG51bVNlZ21lbnRzID0gbnVtU2VnbWVudHMgfHwgMTA7XG4gICAgZGlhbWV0ZXIgICAgPSBkaWFtZXRlciAgICB8fCAwLjI1O1xuXG4gICAgdGhpcy5fY2xvc2VkQ2FwcyAgID0gKHR5cGVvZiBjbG9zZWQgPT09ICd1bmRlZmluZWQnKSA/IHRydWUgOiBjbG9zZWQ7XG4gICAgdGhpcy5fbnVtU2VnbWVudHMgID0gbnVtU2VnbWVudHM7XG5cbiAgICAvL2NhY2hlcyB2ZXJ0aWNlcyB0cmFuc2Zvcm1lZCBieSBzbGljZXNlZ2Z1bmMgZm9yIGRpYW1ldGVyIHNjYWxpbmdcbiAgICAvLy4uLix2bm9ybTB4LHZub3JtMHksdm5vcm0weix2bm9ybTB4U2NhbGVkLCx2bm9ybTB5U2NhbGVkLHZub3JtMHpTY2FsZWQsLi4uXG4gICAgdGhpcy5fdmVydGljZXNOb3JtID0gbnVsbDtcbiAgICB0aGlzLnBvaW50cyAgICAgICAgPSBudWxsO1xuXG4gICAgdGhpcy5fc2xpY2VTZWdGdW5jID0gc2xpY2VTZWdtZW50RnVuYyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKGksaixudW1Qb2ludHMsbnVtU2VnbWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcCAgPSBNYXRoLlBJICogMiAvIG51bVNlZ21lbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5nbGUgPSBzdGVwICogajtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW01hdGguY29zKGFuZ2xlKSxNYXRoLnNpbihhbmdsZSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgdGhpcy5faW5pdERpYW1ldGVyID0gZGlhbWV0ZXI7XG5cbiAgICB0aGlzLl90ZW1wVmVjMCA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JQb2ludDAgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYlBvaW50MSAgPSBWZWMzLm1ha2UoKTtcbiAgICB0aGlzLl9iUG9pbnQwMSA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2F4aXNZICAgID0gVmVjMy5BWElTX1koKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIGlmKHBvaW50cyl0aGlzLnNldFBvaW50cyhwb2ludHMpO1xuXG59O1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW9tM2QucHJvdG90eXBlKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFBvaW50cyA9IGZ1bmN0aW9uKGFycilcbntcbiAgICB0aGlzLnBvaW50cyA9IG5ldyBGbG9hdDMyQXJyYXkoYXJyKTtcblxuICAgIGlmKCEodGhpcy52ZXJ0aWNlcyAmJiB0aGlzLnZlcnRpY2VzLmxlbmd0aCA9PSBhcnIubGVuZ3RoKSlcbiAgICB7XG4gICAgICAgIHZhciBudW1TZWdtZW50cyA9IHRoaXMuX251bVNlZ21lbnRzLFxuICAgICAgICAgICAgbnVtUG9pbnRzICAgPSB0aGlzLl9udW1Qb2ludHMgPSBhcnIubGVuZ3RoIC8gMztcbiAgICAgICAgdmFyIGxlbiAgICAgICAgID0gbnVtUG9pbnRzICogbnVtU2VnbWVudHMgKiAzO1xuXG4gICAgICAgIHRoaXMuX3ZlcnRpY2VzTm9ybSA9IG5ldyBGbG9hdDMyQXJyYXkobGVuICogMik7XG4gICAgICAgIHRoaXMudmVydGljZXMgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkobGVuKTtcbiAgICAgICAgdGhpcy5ub3JtYWxzICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xuICAgICAgICB0aGlzLmNvbG9ycyAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KGxlbiAvIDMgKiA0KTtcblxuICAgICAgICB0aGlzLnNldE51bVNlZ21lbnRzKG51bVNlZ21lbnRzKTtcbiAgICB9XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuYXBwbHlTbGljZVNlZ21lbnRGdW5jID0gZnVuY3Rpb24oZnVuYyxiYXNlRGlhbWV0ZXIpXG57XG4gICAgYmFzZURpYW1ldGVyID0gYmFzZURpYW1ldGVyIHx8IDAuMjU7XG5cbiAgICB2YXIgbnVtUG9pbnRzICAgID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICBudW1TZWdtZW50cyAgPSB0aGlzLl9udW1TZWdtZW50cyxcbiAgICAgICAgdmVydGljZXNOb3JtID0gdGhpcy5fdmVydGljZXNOb3JtO1xuXG4gICAgdmFyIGZ1bmNSZXM7XG5cbiAgICB2YXIgaW5kZXg7XG4gICAgdmFyIGksIGosIGs7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgbnVtUG9pbnRzKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICBpbmRleCA9IGkgKiBudW1TZWdtZW50cztcblxuICAgICAgICB3aGlsZSgrK2ogPCBudW1TZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgayAgICA9IChpbmRleCArIGopICogMyAqIDI7XG5cbiAgICAgICAgICAgIGZ1bmNSZXMgPSBmdW5jKGksaixudW1Qb2ludHMsbnVtU2VnbWVudHMpO1xuXG4gICAgICAgICAgICB2ZXJ0aWNlc05vcm1bayswXSA9IGZ1bmNSZXNbMF07XG4gICAgICAgICAgICB2ZXJ0aWNlc05vcm1baysyXSA9IGZ1bmNSZXNbMV07XG5cbiAgICAgICAgICAgIHZlcnRpY2VzTm9ybVtrKzNdID0gdmVydGljZXNOb3JtW2srMF0gKiBiYXNlRGlhbWV0ZXI7XG4gICAgICAgICAgICB2ZXJ0aWNlc05vcm1bays1XSA9IHZlcnRpY2VzTm9ybVtrKzJdICogYmFzZURpYW1ldGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fc2xpY2VTZWdGdW5jID0gZnVuYztcblxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFBvaW50M2YgPSBmdW5jdGlvbihpbmRleCx4LHkseilcbntcbiAgICBpbmRleCAqPSAzO1xuXG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgcG9pbnRzW2luZGV4ICBdID0geDtcbiAgICBwb2ludHNbaW5kZXgrMV0gPSB5O1xuICAgIHBvaW50c1tpbmRleCsyXSA9IHo7XG59O1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFBvaW50ID0gZnVuY3Rpb24oaW5kZXgsdilcbntcbiAgICBpbmRleCAqPSAzO1xuXG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgcG9pbnRzW2luZGV4ICBdID0gdlswXTtcbiAgICBwb2ludHNbaW5kZXgrMV0gPSB2WzFdO1xuICAgIHBvaW50c1tpbmRleCsyXSA9IHZbMl07XG59O1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLmdldFBvaW50ID0gZnVuY3Rpb24oaW5kZXgsb3V0KVxue1xuICAgIG91dCAgICA9IG91dCB8fCB0aGlzLl90ZW1wVmVjMDtcbiAgICBpbmRleCAqPSAzO1xuXG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgb3V0WzBdID0gcG9pbnRzW2luZGV4ICBdO1xuICAgIG91dFsxXSA9IHBvaW50c1tpbmRleCsxXTtcbiAgICBvdXRbMl0gPSBwb2ludHNbaW5kZXgrMl07XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFVuaXREaWFtZXRlciA9IGZ1bmN0aW9uKHZhbHVlKVxue1xuICAgIHZhciBudW1TZWdtZW50cyAgPSB0aGlzLl9udW1TZWdtZW50cyxcbiAgICAgICAgdmVydGljZXNOb3JtID0gdGhpcy5fdmVydGljZXNOb3JtO1xuXG4gICAgdmFyIG9mZnNldCA9IG51bVNlZ21lbnRzICogMyAqIDI7XG5cbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGwgPSB0aGlzLl9udW1Qb2ludHMgKiBvZmZzZXQ7XG5cbiAgICB3aGlsZShpIDwgbClcbiAgICB7XG4gICAgICAgIHZlcnRpY2VzTm9ybVtpICsgM10gPSB2ZXJ0aWNlc05vcm1baSArIDBdICogdmFsdWU7XG4gICAgICAgIHZlcnRpY2VzTm9ybVtpICsgNV0gPSB2ZXJ0aWNlc05vcm1baSArIDJdICogdmFsdWU7XG4gICAgICAgIGkrPTY7XG4gICAgfVxufTtcblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5zZXREaWFtZXRlciA9IGZ1bmN0aW9uKGluZGV4LHZhbHVlKVxue1xuICAgIHZhciBudW1TZWdtZW50cyAgPSB0aGlzLl9udW1TZWdtZW50cyxcbiAgICAgICAgdmVydGljZXNOb3JtID0gdGhpcy5fdmVydGljZXNOb3JtO1xuXG4gICAgdmFyIG9mZnNldCA9IG51bVNlZ21lbnRzICogMyAqIDI7XG5cbiAgICB2YXIgaSA9IGluZGV4ICogb2Zmc2V0LFxuICAgICAgICBsID0gaSArIG9mZnNldDtcblxuICAgIHdoaWxlIChpIDwgbClcbiAgICB7XG4gICAgICAgIHZlcnRpY2VzTm9ybVtpICsgM10gPSB2ZXJ0aWNlc05vcm1baSArIDBdICogdmFsdWU7XG4gICAgICAgIHZlcnRpY2VzTm9ybVtpICsgNV0gPSB2ZXJ0aWNlc05vcm1baSArIDJdICogdmFsdWU7XG4gICAgICAgIGkgKz0gNjtcbiAgICB9XG59O1xuXG4vL1RPRE86IENsZWFudXAgLyB1bnJvbGwgLi4uXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldE51bVNlZ21lbnRzID0gZnVuY3Rpb24obnVtU2VnbWVudHMpXG57XG4gICAgbnVtU2VnbWVudHMgPSBudW1TZWdtZW50cyA8IDIgPyAyIDogbnVtU2VnbWVudHM7XG5cbiAgICB2YXIgbnVtUG9pbnRzID0gdGhpcy5fbnVtUG9pbnRzO1xuICAgIHZhciBpbmRpY2VzICAgPSB0aGlzLmluZGljZXMgPSBbXTtcbiAgICB2YXIgdGV4Q29vcmRzO1xuXG4gICAgdmFyIGksajtcbiAgICB2YXIgdjAsdjEsdjIsdjM7XG4gICAgdmFyIG5oLG52O1xuICAgIHZhciBpbmRleCwgaW5kZXhTZWcsIGluZGV4VGV4O1xuICAgIHZhciBsZW47XG5cbiAgICBpZihudW1TZWdtZW50cyA+IDIpXG4gICAge1xuXG4gICAgICAgIGxlbiA9IG51bVNlZ21lbnRzIC0gMTtcblxuICAgICAgICBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBudW1Qb2ludHMgLSAxKVxuICAgICAgICB7XG5cbiAgICAgICAgICAgIGluZGV4ID0gaSAqIG51bVNlZ21lbnRzO1xuICAgICAgICAgICAgaiA9IC0xO1xuICAgICAgICAgICAgd2hpbGUgKCsraiA8IGxlbilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbmRleFNlZyA9IGluZGV4ICsgajtcblxuICAgICAgICAgICAgICAgIHYwID0gaW5kZXhTZWc7XG4gICAgICAgICAgICAgICAgdjEgPSBpbmRleFNlZyArIDE7XG4gICAgICAgICAgICAgICAgdjIgPSBpbmRleFNlZyArIG51bVNlZ21lbnRzICsgMTtcbiAgICAgICAgICAgICAgICB2MyA9IGluZGV4U2VnICsgbnVtU2VnbWVudHM7XG5cbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2godjAsdjEsdjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYxLHYyLHYzKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB2MCA9IGluZGV4ICsgbGVuO1xuICAgICAgICAgICAgdjEgPSBpbmRleDtcbiAgICAgICAgICAgIHYyID0gaW5kZXggKyBsZW4gKyAxO1xuICAgICAgICAgICAgdjMgPSBpbmRleCArIG51bVNlZ21lbnRzICsgbGVuO1xuXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2godjAsdjEsdjMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgdjEsdjIsdjMpO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2kgPCBudW1Qb2ludHMgLSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleCA9IGkgKiAyO1xuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGluZGV4LCAgICBpbmRleCArIDEsaW5kZXggKyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICsgMSxpbmRleCArIDMsaW5kZXggKyAyKTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gbnVtUG9pbnRzICogbnVtU2VnbWVudHMgKiAzIDtcblxuICAgIHRleENvb3JkcyA9IHRoaXMudGV4Q29vcmRzID0gbmV3IEZsb2F0MzJBcnJheShsZW4gLyAzICogMik7XG5cbiAgICBpID0gLTE7XG4gICAgd2hpbGUoKytpIDwgbnVtUG9pbnRzKVxuICAgIHtcbiAgICAgICAgaW5kZXggPSBpICogbnVtU2VnbWVudHM7XG4gICAgICAgIG5oICAgID0gaSAvIChudW1Qb2ludHMgLSAxKTtcblxuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IG51bVNlZ21lbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleFRleCA9IChpbmRleCArIGopICogMjtcbiAgICAgICAgICAgIG52ICAgICAgID0gMSAtIGogLyAobnVtU2VnbWVudHMgLSAxKTtcblxuICAgICAgICAgICAgdGV4Q29vcmRzW2luZGV4VGV4XSAgID0gbmg7XG4gICAgICAgICAgICB0ZXhDb29yZHNbaW5kZXhUZXgrMV0gPSBudjtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdGhpcy5zZXRDbG9zZUNhcHModGhpcy5fY2xvc2VkQ2Fwcyk7XG4gICAgdGhpcy5hcHBseVNsaWNlU2VnbWVudEZ1bmModGhpcy5fc2xpY2VTZWdGdW5jLHRoaXMuX2luaXREaWFtZXRlcik7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBudW1Qb2ludHMgICA9IHRoaXMuX251bVBvaW50cyxcbiAgICAgICAgbnVtU2VnbWVudHMgPSB0aGlzLl9udW1TZWdtZW50cztcblxuICAgIHZhciBwb2ludHMgICAgICAgPSB0aGlzLnBvaW50cyxcbiAgICAgICAgdmVydGljZXMgICAgID0gdGhpcy52ZXJ0aWNlcyxcbiAgICAgICAgdmVydGljZXNOb3JtID0gdGhpcy5fdmVydGljZXNOb3JtO1xuXG4gICAgdmFyIHRlbXBWZWMgPSB0aGlzLl90ZW1wVmVjMDtcblxuICAgIHZhciBwMCAgPSB0aGlzLl9iUG9pbnQwLFxuICAgICAgICBwMSAgPSB0aGlzLl9iUG9pbnQxLFxuICAgICAgICBwMDEgPSB0aGlzLl9iUG9pbnQwMSxcbiAgICAgICAgdXAgID0gdGhpcy5fYXhpc1k7XG5cbiAgICB2YXIgbWF0ICAgID0gTWF0NDQubWFrZSgpLFxuICAgICAgICBtYXRSb3QgPSBNYXQ0NC5tYWtlKCk7XG5cbiAgICB2YXIgaW5kZXgsaW5kZXgzLGluZGV4NjtcblxuICAgIC8vZGlyZWN0aW9uIGZyb20gY3VycmVudCBwb2ludCAtPiBuZXh0IHBvaW50LCBwcmV2IHBvaW50IC0+IGN1cnJlbnQgcG9pbnRcbiAgICB2YXIgZGlyMDEsZGlyXzEwO1xuICAgIHZhciBhbmdsZSxheGlzO1xuXG4gICAgLy9CRUdJTiAtIGNhbGN1bGF0ZSBmaXJzdCBwb2ludFxuICAgIFZlYzMuc2V0M2YocDAscG9pbnRzWzBdLHBvaW50c1sxXSxwb2ludHNbMl0pO1xuICAgIFZlYzMuc2V0M2YocDEscG9pbnRzWzNdLHBvaW50c1s0XSxwb2ludHNbNV0pO1xuXG4gICAgZGlyMDEgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5zdWJiZWQocDEscDApKTtcbiAgICBhbmdsZSA9IE1hdGguYWNvcyhWZWMzLmRvdChkaXIwMSx1cCkpO1xuICAgIGF4aXMgID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuY3Jvc3ModXAsZGlyMDEpKTtcblxuICAgIE1hdDQ0LmlkZW50aXR5KG1hdCk7XG4gICAgbWF0WzEyXSA9IHAwWzBdO1xuICAgIG1hdFsxM10gPSBwMFsxXTtcbiAgICBtYXRbMTRdID0gcDBbMl07XG5cbiAgICBNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUsYXhpc1swXSxheGlzWzFdLGF4aXNbMl0sbWF0Um90KTtcbiAgICBtYXQgPSBNYXQ0NC5tdWx0UG9zdChtYXQsbWF0Um90KTtcblxuICAgIGogPSAtMTtcbiAgICB3aGlsZSgrK2ogPCBudW1TZWdtZW50cylcbiAgICB7XG4gICAgICAgIGluZGV4MyA9IGogKiAzO1xuICAgICAgICBpbmRleDYgPSBqICogNjtcblxuICAgICAgICB0ZW1wVmVjWzBdID0gdmVydGljZXNOb3JtW2luZGV4NiszXTtcbiAgICAgICAgdGVtcFZlY1sxXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrNF07XG4gICAgICAgIHRlbXBWZWNbMl0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzVdO1xuXG4gICAgICAgIE1hdDQ0Lm11bHRWZWMzKG1hdCx0ZW1wVmVjKTtcblxuICAgICAgICB2ZXJ0aWNlc1tpbmRleDMgIF0gPSB0ZW1wVmVjWzBdO1xuICAgICAgICB2ZXJ0aWNlc1tpbmRleDMrMV0gPSB0ZW1wVmVjWzFdO1xuICAgICAgICB2ZXJ0aWNlc1tpbmRleDMrMl0gPSB0ZW1wVmVjWzJdO1xuICAgIH1cbiAgICAvL0VORCAtIGNhbGN1bGF0ZSBmaXJzdCBwb2ludFxuXG5cbiAgICAvL2NhbGMgZmlyc3QgcHJldiBkaXJcbiAgICBWZWMzLnNldDNmKHAwLCBwb2ludHNbM10scG9pbnRzWzRdLHBvaW50c1s1XSk7XG4gICAgVmVjMy5zZXQzZihwMDEscG9pbnRzWzBdLHBvaW50c1sxXSxwb2ludHNbMl0pO1xuICAgIGRpcl8xMCA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLnN1YmJlZChwMCxwMDEpKTtcblxuICAgIHZhciBpMztcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGo7XG4gICAgd2hpbGUoKytpIDwgbnVtUG9pbnRzIC0gMSlcbiAgICB7XG4gICAgICAgIC8vc2V0IGN1cnJlbnQgcG9pbnRcbiAgICAgICAgaTMgPSBpICogMztcbiAgICAgICAgcDBbMF0gPSBwb2ludHNbaTMgIF07XG4gICAgICAgIHAwWzFdID0gcG9pbnRzW2kzKzFdO1xuICAgICAgICBwMFsyXSA9IHBvaW50c1tpMysyXTtcblxuICAgICAgICAvL3NldCBuZXh0IHBvaW50XG4gICAgICAgIGkzID0gKGkgKyAxKSAqIDM7XG4gICAgICAgIHAxWzBdID0gcG9pbnRzW2kzICBdO1xuICAgICAgICBwMVsxXSA9IHBvaW50c1tpMysxXTtcbiAgICAgICAgcDFbMl0gPSBwb2ludHNbaTMrMl07XG5cbiAgICAgICAgLy9jYWxjdWxhdGUgZGlyZWN0aW9uXG4gICAgICAgIGRpcjAxICA9IFZlYzMuc2FmZU5vcm1hbGl6ZShWZWMzLnN1YmJlZChwMSxwMCkpO1xuXG4gICAgICAgIC8vaW50ZXJwb2xhdGUgd2l0aCBwcmV2aW91cyBkaXJlY3Rpb25cbiAgICAgICAgZGlyMDFbMF0gPSBkaXIwMVswXSAqIDAuNSArIGRpcl8xMFswXSAqIDAuNTtcbiAgICAgICAgZGlyMDFbMV0gPSBkaXIwMVsxXSAqIDAuNSArIGRpcl8xMFsxXSAqIDAuNTtcbiAgICAgICAgZGlyMDFbMl0gPSBkaXIwMVsyXSAqIDAuNSArIGRpcl8xMFsyXSAqIDAuNTtcblxuICAgICAgICAvL2dldCBkaXIgYW5nbGUgKyBheGlzXG4gICAgICAgIGFuZ2xlID0gTWF0aC5hY29zKFZlYzMuZG90KGRpcjAxLHVwKSk7XG4gICAgICAgIGF4aXMgID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuY3Jvc3ModXAsZGlyMDEpKTtcblxuICAgICAgICAvL3Jlc2V0IHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxuICAgICAgICBNYXQ0NC5pZGVudGl0eShtYXQpO1xuXG4gICAgICAgIC8vc2V0IHRyYW5zbGF0aW9uXG4gICAgICAgIG1hdFsxMl0gPSBwMFswXTtcbiAgICAgICAgbWF0WzEzXSA9IHAwWzFdO1xuICAgICAgICBtYXRbMTRdID0gcDBbMl07XG5cbiAgICAgICAgLy9zZXQgcm90YXRpb25cbiAgICAgICAgTWF0NDQubWFrZVJvdGF0aW9uT25BeGlzKGFuZ2xlLGF4aXNbMF0sYXhpc1sxXSxheGlzWzJdLG1hdFJvdCk7XG5cbiAgICAgICAgLy9tdWx0aXBseSBtYXRyaWNlc1xuICAgICAgICBtYXQgPSBNYXQ0NC5tdWx0UG9zdChtYXQsbWF0Um90KTtcblxuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IG51bVNlZ21lbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleCAgPSAoaSAqIG51bVNlZ21lbnRzICsgaik7XG4gICAgICAgICAgICBpbmRleDMgPSBpbmRleCAqIDM7XG4gICAgICAgICAgICBpbmRleDYgPSBpbmRleCAqIDY7XG5cbiAgICAgICAgICAgIC8vbG9va3VwIHZlcnRleFxuICAgICAgICAgICAgdGVtcFZlY1swXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrM107XG4gICAgICAgICAgICB0ZW1wVmVjWzFdID0gdmVydGljZXNOb3JtW2luZGV4Nis0XTtcbiAgICAgICAgICAgIHRlbXBWZWNbMl0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzVdO1xuXG4gICAgICAgICAgICAvL3RyYW5zZm9ybSB2ZXJ0ZXggY29weSBieSBtYXRyaXhcbiAgICAgICAgICAgIE1hdDQ0Lm11bHRWZWMzKG1hdCx0ZW1wVmVjKTtcblxuICAgICAgICAgICAgLy9yZWFzc2lnbiB0cmFuc2Zvcm1lZCB2ZXJ0ZXhcbiAgICAgICAgICAgIHZlcnRpY2VzW2luZGV4MyAgXSA9IHRlbXBWZWNbMF07XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpbmRleDMrMV0gPSB0ZW1wVmVjWzFdO1xuICAgICAgICAgICAgdmVydGljZXNbaW5kZXgzKzJdID0gdGVtcFZlY1syXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vYXNzaWduIGN1cnJlbnQgZGlyZWN0aW9uIHRvIHByZXZcbiAgICAgICAgZGlyXzEwWzBdID0gZGlyMDFbMF07XG4gICAgICAgIGRpcl8xMFsxXSA9IGRpcjAxWzFdO1xuICAgICAgICBkaXJfMTBbMl0gPSBkaXIwMVsyXTtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gcG9pbnRzLmxlbmd0aDtcblxuICAgIC8vQkVHSU4gLSBjYWxjdWxhdGUgbGFzdCBwb2ludFxuICAgIFZlYzMuc2V0M2YocDAscG9pbnRzW2xlbiAtIDZdLHBvaW50c1tsZW4gLSA1XSxwb2ludHNbbGVuIC0gNF0pO1xuICAgIFZlYzMuc2V0M2YocDEscG9pbnRzW2xlbiAtIDNdLHBvaW50c1tsZW4gLSAyXSxwb2ludHNbbGVuIC0gMV0pO1xuXG4gICAgZGlyMDEgPSBWZWMzLnNhZmVOb3JtYWxpemUoVmVjMy5zdWJiZWQocDEscDApKTtcbiAgICBhbmdsZSA9IE1hdGguYWNvcyhWZWMzLmRvdChkaXIwMSx1cCkpO1xuICAgIGF4aXMgID0gVmVjMy5zYWZlTm9ybWFsaXplKFZlYzMuY3Jvc3ModXAsZGlyMDEpKTtcblxuICAgIE1hdDQ0LmlkZW50aXR5KG1hdCk7XG4gICAgbWF0WzEyXSA9IHAxWzBdO1xuICAgIG1hdFsxM10gPSBwMVsxXTtcbiAgICBtYXRbMTRdID0gcDFbMl07XG5cbiAgICBNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUsYXhpc1swXSxheGlzWzFdLGF4aXNbMl0sbWF0Um90KTtcbiAgICBtYXQgPSBNYXQ0NC5tdWx0UG9zdChtYXQsbWF0Um90KTtcblxuICAgIGkgID0gKGkgKiBudW1TZWdtZW50cyk7XG5cbiAgICBqID0gLTE7XG4gICAgd2hpbGUoKytqIDwgbnVtU2VnbWVudHMpXG4gICAge1xuICAgICAgICBpbmRleCAgPSBpICsgajtcbiAgICAgICAgaW5kZXgzID0gaW5kZXggKiAzO1xuICAgICAgICBpbmRleDYgPSBpbmRleCAqIDY7XG5cbiAgICAgICAgdGVtcFZlY1swXSA9IHZlcnRpY2VzTm9ybVtpbmRleDYrM107XG4gICAgICAgIHRlbXBWZWNbMV0gPSB2ZXJ0aWNlc05vcm1baW5kZXg2KzRdO1xuICAgICAgICB0ZW1wVmVjWzJdID0gdmVydGljZXNOb3JtW2luZGV4Nis1XTtcblxuICAgICAgICBNYXQ0NC5tdWx0VmVjMyhtYXQsdGVtcFZlYyk7XG5cbiAgICAgICAgdmVydGljZXNbaW5kZXgzICBdID0gdGVtcFZlY1swXTtcbiAgICAgICAgdmVydGljZXNbaW5kZXgzKzFdID0gdGVtcFZlY1sxXTtcbiAgICAgICAgdmVydGljZXNbaW5kZXgzKzJdID0gdGVtcFZlY1syXTtcbiAgICB9XG4gICAgLy9FTkQgLSBjYWxjdWxhdGUgbGFzdCBwb2ludFxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFNlZ1ZUZXhDb29yZE1hcHBpbmcgPSBmdW5jdGlvbihzY2FsZSxvZmZzZXQpe3RoaXMuc2V0U2VnVGV4Q29vcmRNYXBwaW5nKDEsMCxzY2FsZSxvZmZzZXQgfHwgMCk7fTtcbkxpbmVCdWZmZXIzZC5wcm90b3R5cGUuc2V0U2VnSFRleENvb3JkTWFwcGluZyA9IGZ1bmN0aW9uKHNjYWxlLG9mZnNldCl7dGhpcy5zZXRTZWdUZXhDb29yZE1hcHBpbmcoc2NhbGUsb2Zmc2V0IHx8IDAsMSwwKTt9O1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldFNlZ1RleENvb3JkTWFwcGluZyA9IGZ1bmN0aW9uIChzY2FsZUgsIG9mZnNldEgsIHNjYWxlViwgb2Zmc2V0VilcbntcbiAgICB2YXIgbnVtUG9pbnRzICAgICA9IHRoaXMuX251bVBvaW50cyxcbiAgICAgICAgbnVtU2VnbWVudHMgICA9IHRoaXMuX251bVNlZ21lbnRzLFxuICAgICAgICBudW1TZWdtZW50c18xID0gbnVtU2VnbWVudHMgLSAxO1xuXG4gICAgdmFyIHRleENvb3JkcyA9IHRoaXMudGV4Q29vcmRzO1xuICAgIHZhciBpLCBqLCBpbmRleCwgaW5kZXhUZXg7XG4gICAgdmFyIG5oLCBudjtcblxuICAgIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbnVtUG9pbnRzKVxuICAgIHtcbiAgICAgICAgaW5kZXggPSBpICogbnVtU2VnbWVudHM7XG4gICAgICAgIG5oID0gKGkgLyAobnVtUG9pbnRzIC0gMSkpICogc2NhbGVIIC0gb2Zmc2V0SDtcblxuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2ogPCBudW1TZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXhUZXggPSAoaW5kZXggKyBqKSAqIDI7XG4gICAgICAgICAgICBudiA9ICgxIC0gaiAvIG51bVNlZ21lbnRzXzEpICogc2NhbGVWIC0gb2Zmc2V0VjtcblxuICAgICAgICAgICAgdGV4Q29vcmRzW2luZGV4VGV4ICBdID0gbmg7XG4gICAgICAgICAgICB0ZXhDb29yZHNbaW5kZXhUZXggKyAxXSA9IG52O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLnNldENsb3NlQ2FwcyA9IGZ1bmN0aW9uKGJvb2wpXG57XG4gICAgaWYodGhpcy5fbnVtU2VnbWVudHMgPT0gMilyZXR1cm47XG5cbiAgICB2YXIgaW5kaWNlcyA9IHRoaXMuaW5kaWNlcyxcbiAgICAgICAgdGVtcCAgICA9IG5ldyBBcnJheSh0aGlzLmluZGljZXMubGVuZ3RoKTtcblxuICAgIHZhciBpID0gLTE7d2hpbGUoKytpPHRlbXAubGVuZ3RoKXRlbXBbaV0gPSBpbmRpY2VzW2ldO1xuXG4gICAgdmFyIG51bVBvaW50cyAgID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICBudW1TZWdtZW50cyA9IHRoaXMuX251bVNlZ21lbnRzO1xuICAgIHZhciBsZW47XG5cblxuICAgIGlmKGJvb2wpXG4gICAge1xuXG4gICAgICAgIGxlbiA9IG51bVNlZ21lbnRzIC0gMjtcbiAgICAgICAgaSA9IC0xO3doaWxlKCsraSA8IGxlbil0ZW1wLnB1c2goMCxpKzEsaSsyKTtcblxuICAgICAgICB2YXIgajtcbiAgICAgICAgbGVuICs9IChudW1Qb2ludHMgLSAxKSAqIG51bVNlZ21lbnRzICsgMTtcbiAgICAgICAgaSAgID0gaiA9IGxlbiAtIG51bVNlZ21lbnRzICsgMTtcbiAgICAgICAgd2hpbGUoKytpIDwgbGVuKXRlbXAucHVzaChqLGksaSsxKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgdGVtcCA9IHRlbXAuc2xpY2UoMCxpbmRpY2VzLmxlbmd0aCAtIChudW1TZWdtZW50cyAtIDIpICogMiAqIDMpO1xuICAgIH1cblxuICAgIHRoaXMuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheSh0ZW1wKTtcbiAgICB0aGlzLnVwZGF0ZVZlcnRleE5vcm1hbHMoKTtcbiAgICB0aGlzLl9jbG9zZWRDYXBzID0gYm9vbDtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5nZXROdW1TZWdtZW50cyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX251bVNlZ21lbnRzO307XG5MaW5lQnVmZmVyM2QucHJvdG90eXBlLmdldE51bVBvaW50cyAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbnVtUG9pbnRzO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuTGluZUJ1ZmZlcjNkLnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uKGdsLGNvdW50LG9mZnNldClcbntcbiAgICB2YXIgaW5kaWNlcyA9IHRoaXMuaW5kaWNlcztcbiAgICBnbC5kcmF3RWxlbWVudHModGhpcy52ZXJ0aWNlcyx0aGlzLm5vcm1hbHMsZ2wuYnVmZmVyQ29sb3JzKGdsLmdldENvbG9yQnVmZmVyKCksdGhpcy5jb2xvcnMpLHRoaXMudGV4Q29vcmRzLGluZGljZXMsZ2wuZ2V0RHJhd01vZGUoKSxjb3VudCB8fCBpbmRpY2VzLmxlbmd0aCwgb2Zmc2V0IHx8IDAgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZUJ1ZmZlcjNkO1xuIiwidmFyIFZlYzIgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMicpLFxuICAgIFZlYzMgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMycpLFxuICAgIENvbG9yICA9IHJlcXVpcmUoJy4uL3V0aWwvZ2xrQ29sb3InKSxcbiAgICBHZW9tM2QgPSByZXF1aXJlKCcuL2dsa0dlb20zZCcpO1xuXG5QYXJhbWV0cmljU3VyZmFjZSA9IGZ1bmN0aW9uKHNpemUpXG57XG4gICAgR2VvbTNkLmFwcGx5KHRoaXMsbnVsbCk7XG5cbiAgICB0aGlzLmZ1bmNYID0gZnVuY3Rpb24odSx2LHQpe3JldHVybiB1O307XG4gICAgdGhpcy5mdW5jWSA9IGZ1bmN0aW9uKHUsdix0KXtyZXR1cm4gMDt9O1xuICAgIHRoaXMuZnVuY1ogPSBmdW5jdGlvbih1LHYsdCl7cmV0dXJuIHY7fTtcbiAgICB0aGlzLnVyICAgID0gWy0xLDFdO1xuICAgIHRoaXMudnIgICAgPSBbLTEsMV07XG4gICAgdGhpcy5zaXplICA9IG51bGw7XG5cbiAgICB0aGlzLnNldFNpemUoc2l6ZSk7XG5cbn07XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VvbTNkLnByb3RvdHlwZSk7XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24oc2l6ZSx1bml0KVxue1xuICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICB0aGlzLnNpemUgPSBzaXplO1xuXG4gICAgdmFyIGxlbmd0aCAgPSBzaXplICogc2l6ZTtcblxuICAgIHRoaXMudmVydGljZXMgID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBWZWMzLlNJWkUpO1xuICAgIHRoaXMubm9ybWFscyAgID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBWZWMzLlNJWkUpO1xuICAgIHRoaXMuY29sb3JzICAgID0gbmV3IEZsb2F0MzJBcnJheShsZW5ndGggKiBDb2xvci5TSVpFKTtcbiAgICB0aGlzLnRleENvb3JkcyA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoICogVmVjMi5TSVpFKTtcblxuICAgIHZhciBpbmRpY2VzID0gW107XG5cbiAgICB2YXIgYSwgYiwgYywgZDtcbiAgICB2YXIgaSxqO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHNpemUgLSAxKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBzaXplIC0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgYSA9IGogICAgICsgc2l6ZSAqIGk7XG4gICAgICAgICAgICBiID0gKGorMSkgKyBzaXplICogaTtcbiAgICAgICAgICAgIGMgPSBqICAgICArIHNpemUgKiAoaSsxKTtcbiAgICAgICAgICAgIGQgPSAoaisxKSArIHNpemUgKiAoaSsxKTtcblxuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGEsYixjKTtcbiAgICAgICAgICAgIGluZGljZXMucHVzaChiLGQsYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmluZGljZXMgPSBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyk7XG5cbiAgICB0aGlzLnVwZGF0ZVZlcnRleE5vcm1hbHMoKTtcbn07XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5zZXRGdW5jdGlvbnMgPSBmdW5jdGlvbihmdW5jWCxmdW5jWSxmdW5jWix2cix1cilcbntcbiAgICB0aGlzLmZ1bmNYID0gZnVuY1g7XG4gICAgdGhpcy5mdW5jWSA9IGZ1bmNZO1xuICAgIHRoaXMuZnVuY1ogPSBmdW5jWjtcbiAgICB0aGlzLnZyICAgPSB2cjtcbiAgICB0aGlzLnVyICAgPSB1cjtcbn07XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9ucyA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLmFwcGx5RnVuY3Rpb25zV2l0aEFyZygwKTtcbn07XG5cbi8vT3ZlcnJpZGVcblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5hcHBseUZ1bmN0aW9uc1dpdGhBcmcgPSBmdW5jdGlvbihhcmcpXG57XG4gICAgdmFyIHNpemUgID0gdGhpcy5zaXplO1xuXG4gICAgdmFyIGZ1bmNYID0gdGhpcy5mdW5jWCxcbiAgICAgICAgZnVuY1kgPSB0aGlzLmZ1bmNZLFxuICAgICAgICBmdW5jWiA9IHRoaXMuZnVuY1o7XG5cbiAgICB2YXIgdXJMb3dlciA9IHRoaXMudXJbMF0sXG4gICAgICAgIHVyVXBwZXIgPSB0aGlzLnVyWzFdLFxuICAgICAgICB2ckxvd2VyID0gdGhpcy52clswXSxcbiAgICAgICAgdnJVcHBlciA9IHRoaXMudnJbMV07XG5cbiAgICB2YXIgaSwgaiwgdSwgdjtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG5cbiAgICB2YXIgaW5kZXgsaW5kZXhWZXJ0aWNlcztcblxuICAgIHZhciB0ZW1wMCA9IHVyVXBwZXIgLSB1ckxvd2VyLFxuICAgICAgICB0ZW1wMSA9IHZyVXBwZXIgLSB2ckxvd2VyLFxuICAgICAgICB0ZW1wMiA9IHNpemUgLSAxO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHNpemUpXG4gICAge1xuICAgICAgICBqID0gLTE7XG4gICAgICAgIHdoaWxlKCsraiA8IHNpemUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGluZGV4ID0gKGogKyBzaXplICogaSk7XG4gICAgICAgICAgICBpbmRleFZlcnRpY2VzID0gaW5kZXggKiAzO1xuXG4gICAgICAgICAgICB1ID0gKHVyTG93ZXIgKyB0ZW1wMCAqIChqIC8gdGVtcDIpKTtcbiAgICAgICAgICAgIHYgPSAodnJMb3dlciArIHRlbXAxICogKGkgLyB0ZW1wMikpO1xuXG4gICAgICAgICAgICB2ZXJ0aWNlc1tpbmRleFZlcnRpY2VzICAgIF0gPSBmdW5jWCh1LHYsYXJnKTtcbiAgICAgICAgICAgIHZlcnRpY2VzW2luZGV4VmVydGljZXMgKyAxXSA9IGZ1bmNZKHUsdixhcmcpO1xuICAgICAgICAgICAgdmVydGljZXNbaW5kZXhWZXJ0aWNlcyArIDJdID0gZnVuY1oodSx2LGFyZyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5QYXJhbWV0cmljU3VyZmFjZS5wcm90b3R5cGUucG9pbnRPblN1cmZhY2UgPSBmdW5jdGlvbih1LHYpXG57XG4gICAgcmV0dXJuIHRoaXMucG9pbnRPblN1cmZhY2VXaXRoQXJnKHUsdiwwKTtcbn07XG5cblBhcmFtZXRyaWNTdXJmYWNlLnByb3RvdHlwZS5wb2ludE9uU3VyZmFjZVdpdGhBcmcgPSBmdW5jdGlvbih1LHYsYXJnKVxue1xuICAgIHJldHVybiBWZWMzLm1ha2UodGhpcy5mdW5jWCh1LHYsYXJnKSxcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnVuY1kodSx2LGFyZyksXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmNaKHUsdixhcmcpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFyYW1ldHJpY1N1cmZhY2U7XG5cbiIsInZhciBrTWF0aCAgICAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtNYXRoJyksXG4gICAgTGluZTJkVXRpbCA9IHJlcXVpcmUoJy4vZ2xrTGluZTJkVXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgbWFrZVZlcnRleENvdW50Rml0dGVkIDogZnVuY3Rpb24ocG9seWdvbixjb3VudClcbiAgICB7XG4gICAgICAgIHZhciBkaWZmICAgID0gcG9seWdvbi5sZW5ndGggKiAwLjUgLSBjb3VudDtcblxuICAgICAgICByZXR1cm4gZGlmZiA8IDAgPyB0aGlzLm1ha2VWZXJ0ZXhDb3VudEluY3JlYXNlZChwb2x5Z29uLCBNYXRoLmFicyhkaWZmKSkgOlxuICAgICAgICAgICAgICAgZGlmZiA+IDAgPyB0aGlzLm1ha2VWZXJ0ZXhDb3VudERlY3JlYXNlZChwb2x5Z29uLCBkaWZmKSA6XG4gICAgICAgICAgICAgICBwb2x5Z29uO1xuICAgIH0sXG5cblxuICAgIC8vVE9ETzogbW9kdWxvIGxvb3BcbiAgICBtYWtlVmVydGV4Q291bnRJbmNyZWFzZWQgOiBmdW5jdGlvbihwb2x5Z29uLGNvdW50KVxuICAgIHtcbiAgICAgICAgY291bnQgPSAodHlwZW9mIGNvdW50ID09ICd1bmRlZmluZWQnKSA/IDEgOiBjb3VudDtcblxuICAgICAgICB2YXIgb3V0ID0gcG9seWdvbi5zbGljZSgpO1xuICAgICAgICBpZihjb3VudCA8PSAwIClyZXR1cm4gcG9seWdvbjtcblxuICAgICAgICB2YXIgaSA9IC0xLGo7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciBtYXg7XG5cbiAgICAgICAgdmFyIGpjLGpuO1xuXG4gICAgICAgIHZhciB4LCB5LCBteCwgbXk7XG4gICAgICAgIHZhciBkeCxkeSxkO1xuXG4gICAgICAgIHZhciBlZGdlU0luZGV4LFxuICAgICAgICAgICAgZWRnZUVJbmRleDtcblxuICAgICAgICB3aGlsZSgrK2kgPCBjb3VudClcbiAgICAgICAge1xuICAgICAgICAgICAgbWF4ID0gLUluZmluaXR5O1xuICAgICAgICAgICAgbGVuID0gb3V0Lmxlbmd0aCAqIDAuNTtcblxuICAgICAgICAgICAgZWRnZVNJbmRleCA9IGVkZ2VFSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBqID0gLTE7XG4gICAgICAgICAgICB3aGlsZSgrK2ogPCBsZW4gLSAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGpjID0gaiAqIDI7XG4gICAgICAgICAgICAgICAgam4gPSAoaiArIDEpICogMjtcblxuICAgICAgICAgICAgICAgIGR4ID0gb3V0W2puICAgIF0gLSBvdXRbamMgICAgXTtcbiAgICAgICAgICAgICAgICBkeSA9IG91dFtqbiArIDFdIC0gb3V0W2pjICsgMV07XG4gICAgICAgICAgICAgICAgZCAgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblxuICAgICAgICAgICAgICAgIGlmKGQgPiBtYXgpe21heCA9IGQ7ZWRnZVNJbmRleCA9IGo7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBqYyA9IGogKiAyO1xuICAgICAgICAgICAgZHggPSBvdXRbMF0gLSBvdXRbamMgICAgXTtcbiAgICAgICAgICAgIGR5ID0gb3V0WzFdIC0gb3V0W2pjICsgMV07XG4gICAgICAgICAgICBkICA9IGR4ICogZHggKyBkeSAqIGR5O1xuXG4gICAgICAgICAgICBlZGdlU0luZGV4ID0gKGQgPiBtYXgpID8gaiA6IGVkZ2VTSW5kZXg7XG4gICAgICAgICAgICBlZGdlRUluZGV4ID0gZWRnZVNJbmRleCA9PSBsZW4gLSAxID8gMCA6IGVkZ2VTSW5kZXggKyAxO1xuXG4gICAgICAgICAgICBlZGdlU0luZGV4Kj0gMjtcbiAgICAgICAgICAgIGVkZ2VFSW5kZXgqPSAyO1xuXG4gICAgICAgICAgICB4ID0gb3V0W2VkZ2VTSW5kZXggICAgXTtcbiAgICAgICAgICAgIHkgPSBvdXRbZWRnZVNJbmRleCArIDFdO1xuXG4gICAgICAgICAgICBteCA9IHggKyAob3V0W2VkZ2VFSW5kZXggICAgXSAtIHgpICogMC41O1xuICAgICAgICAgICAgbXkgPSB5ICsgKG91dFtlZGdlRUluZGV4ICsgMV0gLSB5KSAqIDAuNTtcblxuICAgICAgICAgICAgb3V0LnNwbGljZShlZGdlRUluZGV4LDAsbXgsbXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcblxuICAgIH0sXG5cblxuICAgIC8vVE9ETzogbW9kdWxvIGxvb3BcbiAgICBtYWtlVmVydGV4Q291bnREZWNyZWFzZWQgOiBmdW5jdGlvbihwb2x5Z29uLGNvdW50KVxuICAgIHtcbiAgICAgICAgY291bnQgPSAodHlwZW9mIGNvdW50ID09ICd1bmRlZmluZWQnKSA/IDEgOiBjb3VudDtcblxuICAgICAgICB2YXIgb3V0ID0gcG9seWdvbi5zbGljZSgpO1xuICAgICAgICBpZigob3V0Lmxlbmd0aCAqIDAuNSAtIGNvdW50KSA8IDMgfHwgY291bnQgPT0gMClyZXR1cm4gb3V0O1xuXG4gICAgICAgIHZhciBpID0gLTEsIGo7XG4gICAgICAgIHZhciBsZW47XG4gICAgICAgIHZhciBtaW47XG5cbiAgICAgICAgdmFyIGpjLGpuO1xuICAgICAgICB2YXIgZHgsZHksZDtcblxuICAgICAgICB2YXIgZWRnZVNJbmRleCxcbiAgICAgICAgICAgIGVkZ2VFSW5kZXg7XG5cbiAgICAgICAgd2hpbGUoKytpIDwgY291bnQpXG4gICAgICAgIHtcblxuICAgICAgICAgICAgbWluID0gSW5maW5pdHk7XG4gICAgICAgICAgICBsZW4gPSBvdXQubGVuZ3RoICogMC41O1xuXG4gICAgICAgICAgICBlZGdlU0luZGV4ID0gZWRnZUVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGogPSAtMTtcbiAgICAgICAgICAgIHdoaWxlKCsraiA8IGxlbiAtIDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgamMgPSBqICogMjtcbiAgICAgICAgICAgICAgICBqbiA9IChqICsgMSkgKiAyO1xuXG4gICAgICAgICAgICAgICAgZHggPSBvdXRbam4gICAgXSAtIG91dFtqYyAgICBdO1xuICAgICAgICAgICAgICAgIGR5ID0gb3V0W2puICsgMV0gLSBvdXRbamMgKyAxXTtcbiAgICAgICAgICAgICAgICBkICA9IGR4ICogZHggKyBkeSAqIGR5O1xuXG4gICAgICAgICAgICAgICAgaWYoZCA8IG1pbil7bWluID0gZDtlZGdlU0luZGV4ID0gajt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGpjID0gaiAqIDI7XG4gICAgICAgICAgICBkeCA9IG91dFswXSAtIG91dFtqYyAgICBdO1xuICAgICAgICAgICAgZHkgPSBvdXRbMV0gLSBvdXRbamMgKyAxXTtcbiAgICAgICAgICAgIGQgID0gZHggKiBkeCArIGR5ICogZHk7XG5cbiAgICAgICAgICAgIGVkZ2VTSW5kZXggPSAoZCA8IG1pbikgPyBqIDogZWRnZVNJbmRleDtcbiAgICAgICAgICAgIGVkZ2VFSW5kZXggPSBlZGdlU0luZGV4ID09IGxlbiAtIDEgPyAwIDogZWRnZVNJbmRleCArIDE7XG5cbiAgICAgICAgICAgIG91dC5zcGxpY2UoZWRnZUVJbmRleCAqIDIsMik7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG5cbiAgICB9LFxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICBtYWtlRWRnZXNTdWJkaXZpZGVkIDogZnVuY3Rpb24ocG9seWdvbixjb3VudCxvdXQpXG4gICAge1xuICAgICAgICBjb3VudCA9IGNvdW50IHx8IDE7XG5cbiAgICAgICAgdmFyIGksIGosIGs7XG4gICAgICAgIHZhciBpMixpNDtcblxuICAgICAgICB2YXIgbGVuO1xuICAgICAgICB2YXIgeCwgeSwgbXgsIG15O1xuXG5cbiAgICAgICAgaWYob3V0KVxuICAgICAgICB7XG4gICAgICAgICAgICBvdXQubGVuZ3RoID0gcG9seWdvbi5sZW5ndGg7XG4gICAgICAgICAgICBpID0gLTE7d2hpbGUoKytpIDwgcG9seWdvbi5sZW5ndGgpe291dFtpXSA9IHBvbHlnb25baV07fVxuICAgICAgICB9XG4gICAgICAgIGVsc2Ugb3V0ID0gcG9seWdvbi5zbGljZSgpO1xuXG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgY291bnQpXG4gICAgICAgIHtcblxuICAgICAgICAgICAgbGVuID0gb3V0Lmxlbmd0aCAqIDAuNSAtMTtcbiAgICAgICAgICAgIGkgPSAtMTtcbiAgICAgICAgICAgIHdoaWxlKCsraSA8IGxlbilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpMiA9IGkgKiAyO1xuICAgICAgICAgICAgICAgIGk0ID0gKGkgKiAyKSAqIDI7XG4gICAgICAgICAgICAgICAgeCAgPSBvdXRbaTRdO1xuICAgICAgICAgICAgICAgIHkgID0gb3V0W2k0ICsgMV07XG5cbiAgICAgICAgICAgICAgICBpMiA9IGkyICsgMTtcbiAgICAgICAgICAgICAgICBpNCA9IGkyICogMjtcbiAgICAgICAgICAgICAgICBteCA9IHggKyAob3V0W2k0ICAgIF0gLSB4KSAqIDAuNTtcbiAgICAgICAgICAgICAgICBteSA9IHkgKyAob3V0W2k0ICsgMV0gLSB5KSAqIDAuNTtcblxuICAgICAgICAgICAgICAgIG91dC5zcGxpY2UoaTQsMCxteCxteSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGkyID0gaSAgICogMjtcbiAgICAgICAgICAgIGk0ID0gaTIgKiAyO1xuXG4gICAgICAgICAgICB4ICA9IG91dFtpNF07XG4gICAgICAgICAgICB5ICA9IG91dFtpNCArIDFdO1xuICAgICAgICAgICAgbXggPSB4ICsgKG91dFswXSAtIHgpICogMC41O1xuICAgICAgICAgICAgbXkgPSB5ICsgKG91dFsxXSAtIHkpICogMC41O1xuXG4gICAgICAgICAgICBvdXQuc3BsaWNlKChpMiArIDEpICogMiwwLG14LG15KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgbWFrZVNtb290aGVkTGluZWFyIDogZnVuY3Rpb24ocG9seWdvbixjb3VudCxvdXQpXG4gICAge1xuICAgICAgICBjb3VudCA9IGNvdW50IHx8IDE7XG5cbiAgICAgICAgdmFyIHB4LHB5LGR4LGR5O1xuXG4gICAgICAgIHZhciBpLCBqLCBrO1xuXG4gICAgICAgIHZhciB0ZW1wICAgID0gcG9seWdvbi5zbGljZSgpLFxuICAgICAgICAgICAgdGVtcExlbiA9IHRlbXAubGVuZ3RoO1xuXG4gICAgICAgIGlmKG91dClvdXQubGVuZ3RoID0gdGVtcExlbiAgKiAyO1xuICAgICAgICBlbHNlIG91dCA9IG5ldyBBcnJheSh0ZW1wTGVuICAqIDIpO1xuXG4gICAgICAgIGogPSAtMTtcbiAgICAgICAgd2hpbGUoKytqIDwgY291bnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBMZW4gICAgPSB0ZW1wLmxlbmd0aDtcbiAgICAgICAgICAgIG91dC5sZW5ndGggPSB0ZW1wTGVuICogMjtcblxuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICB3aGlsZShpIDwgdGVtcExlbilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBweCA9IHRlbXBbaSAgICBdO1xuICAgICAgICAgICAgICAgIHB5ID0gdGVtcFtpICsgMV0gO1xuICAgICAgICAgICAgICAgIGsgID0gKGkgKyAyKSAlIHRlbXBMZW47XG4gICAgICAgICAgICAgICAgZHggPSB0ZW1wW2sgICAgXSAtIHB4O1xuICAgICAgICAgICAgICAgIGR5ID0gdGVtcFtrICsgMV0gLSBweTtcblxuICAgICAgICAgICAgICAgIGsgPSBpICogMjtcbiAgICAgICAgICAgICAgICBvdXRbayAgXSA9IHB4ICsgZHggKiAwLjI1O1xuICAgICAgICAgICAgICAgIG91dFtrKzFdID0gcHkgKyBkeSAqIDAuMjU7XG4gICAgICAgICAgICAgICAgb3V0W2srMl0gPSBweCArIGR4ICogMC43NTtcbiAgICAgICAgICAgICAgICBvdXRbayszXSA9IHB5ICsgZHkgKiAwLjc1O1xuXG4gICAgICAgICAgICAgICAgaSs9MjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB0ZW1wID0gb3V0LnNsaWNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuXG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIG1ha2VPcHRIZWFkaW5nIDogZnVuY3Rpb24ocG9seWdvbix0b2xlcmFuY2UpXG4gICAge1xuICAgICAgICBpZihwb2x5Z29uLmxlbmd0aCA8IDQpcmV0dXJuIHBvbHlnb247XG5cbiAgICAgICAgdG9sZXJhbmNlID0gdG9sZXJhbmNlIHx8IGtNYXRoLkVQU0lMT047XG5cbiAgICAgICAgdmFyIHRlbXAgPSBbXTtcblxuICAgICAgICB2YXIgbGVuID0gcG9seWdvbi5sZW5ndGggLyAyIC0gMTtcblxuICAgICAgICB2YXIgcHggPSBwb2x5Z29uWzBdLFxuICAgICAgICAgICAgcHkgPSBwb2x5Z29uWzFdLFxuICAgICAgICAgICAgeCwgeTtcblxuICAgICAgICB2YXIgcGggPSBNYXRoLmF0YW4yKHBvbHlnb25bM10gLSBweSxwb2x5Z29uWzJdIC0gcHgpLFxuICAgICAgICAgICAgY2g7XG5cbiAgICAgICAgdGVtcC5wdXNoKHB4LHB5KTtcblxuICAgICAgICB2YXIgaSA9IDAsaTI7XG5cbiAgICAgICAgd2hpbGUoKytpIDwgbGVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBpMiA9IGkgKiAyO1xuICAgICAgICAgICAgeCA9IHBvbHlnb25baTIgIF07XG4gICAgICAgICAgICB5ID0gcG9seWdvbltpMisxXTtcblxuICAgICAgICAgICAgaTIgPSAoaSArIDEpICogMjtcbiAgICAgICAgICAgIGNoID0gTWF0aC5hdGFuMihwb2x5Z29uW2kyKzFdIC0geSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uW2kyICBdIC0geCk7XG5cbiAgICAgICAgICAgIGlmKE1hdGguYWJzKHBoIC0gY2gpID4gdG9sZXJhbmNlKXRlbXAucHVzaCh4LHkpO1xuXG4gICAgICAgICAgICBweCA9IHg7XG4gICAgICAgICAgICBweSA9IHk7XG4gICAgICAgICAgICBwaCA9IGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgeCA9IHBvbHlnb25bcG9seWdvbi5sZW5ndGggLSAyXTtcbiAgICAgICAgeSA9IHBvbHlnb25bcG9seWdvbi5sZW5ndGggLSAxXTtcblxuICAgICAgICBjaCA9IE1hdGguYXRhbjIocG9seWdvblsxXSAtIHksIHBvbHlnb25bMF0gLSB4KTtcblxuICAgICAgICBpZihNYXRoLmFicyhwaCAtIGNoKSA+IHRvbGVyYW5jZSl0ZW1wLnB1c2goeCx5KTtcblxuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9LFxuXG5cbiAgICBtYWtlT3B0RWRnZUxlbmd0aCA6IGZ1bmN0aW9uKHBvbHlnb24sZWRnZUxlbmd0aClcbiAgICB7XG4gICAgICAgIHZhciB0ZW1wID0gW107XG4gICAgICAgIHZhciBsZW4gID0gcG9seWdvbi5sZW5ndGggKiAwLjUgLSAxO1xuXG4gICAgICAgIHZhciBkeCxkeTtcbiAgICAgICAgdmFyIHB4LHB5O1xuICAgICAgICB2YXIgeCwgeTtcblxuICAgICAgICB2YXIgaW5kZXg7XG5cbiAgICAgICAgdmFyIGVkZ2VMZW5ndGhTcSA9IGVkZ2VMZW5ndGggKiBlZGdlTGVuZ3RoO1xuXG4gICAgICAgIHB4ID0gcG9seWdvblswXTtcbiAgICAgICAgcHkgPSBwb2x5Z29uWzFdO1xuXG4gICAgICAgIHRlbXAucHVzaChweCxweSk7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUoKytpIDwgbGVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleCA9IGkgKiAyO1xuXG4gICAgICAgICAgICB4ID0gIHBvbHlnb25baW5kZXggIF07XG4gICAgICAgICAgICB5ID0gIHBvbHlnb25baW5kZXgrMV07XG5cbiAgICAgICAgICAgIGR4ID0geCAtIHB4O1xuICAgICAgICAgICAgZHkgPSB5IC0gcHk7XG5cbiAgICAgICAgICAgIGlmKChkeCAqIGR4ICsgZHkgKiBkeSkgPj0gZWRnZUxlbmd0aFNxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHB4ID0geDtcbiAgICAgICAgICAgICAgICBweSA9IHk7XG5cbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2goeCx5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHggPSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoLTJdO1xuICAgICAgICB5ID0gcG9seWdvbltwb2x5Z29uLmxlbmd0aC0xXTtcblxuICAgICAgICBweCA9IHBvbHlnb25bMF07XG4gICAgICAgIHB5ID0gcG9seWdvblsxXTtcblxuICAgICAgICBkeCA9IHggLSBweDtcbiAgICAgICAgZHkgPSB5IC0gcHk7XG5cbiAgICAgICAgaWYoKGR4ICogZHggKyBkeSAqIGR5KSA+PSBlZGdlTGVuZ3RoU3EpdGVtcC5wdXNoKHgseSk7XG5cbiAgICAgICAgcmV0dXJuIHRlbXA7XG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgLy9odHRwOi8vYWxpZW5yeWRlcmZsZXguY29tL3BvbHlnb25fcGVyaW1ldGVyL1xuICAgIG1ha2VQZXJpbWV0ZXIgOiBmdW5jdGlvbihwb2x5Z29uLG91dClcbiAgICB7XG4gICAgICAgIHZhciBUV09fUEkgICA9IE1hdGguUEkgKiAyLFxuICAgICAgICAgICAgUEkgICAgICAgPSBNYXRoLlBJO1xuXG4gICAgICAgIHZhciBjb3JuZXJzICA9IHBvbHlnb24ubGVuZ3RoICogMC41O1xuICAgICAgICB2YXIgTUFYX1NFR1MgPSBjb3JuZXJzICogNDtcblxuICAgICAgICBpZihjb3JuZXJzID4gTUFYX1NFR1MpIHJldHVybiBudWxsO1xuXG4gICAgICAgIG91dC5sZW5ndGggPSAwO1xuXG4gICAgICAgIHZhciBzZWdTID0gbmV3IEFycmF5KE1BWF9TRUdTICogMiksXG4gICAgICAgICAgICBzZWdFID0gbmV3IEFycmF5KE1BWF9TRUdTICogMiksXG4gICAgICAgICAgICBzZWdBbmdsZSAgID0gbmV3IEFycmF5KE1BWF9TRUdTKTtcblxuICAgICAgICB2YXIgaW50ZXJzZWN0cyA9IG5ldyBBcnJheSgyKSxcbiAgICAgICAgICAgIGludGVyc2VjdFgsaW50ZXJzZWN0WTtcblxuICAgICAgICB2YXIgc3RhcnRYICAgID0gcG9seWdvblswXSxcbiAgICAgICAgICAgIHN0YXJ0WSAgICA9IHBvbHlnb25bMV0sXG4gICAgICAgICAgICBsYXN0QW5nbGUgPSBQSTtcblxuICAgICAgICB2YXIgaW5kZXhpLGluZGV4aixcbiAgICAgICAgICAgIGluZGV4U2VnLGluZGV4U2VnaSxpbmRleFNlZ2osXG4gICAgICAgICAgICBwaXgscGl5LHBqeCxwank7XG5cbiAgICAgICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsXG4gICAgICAgICAgICBhbmdsZURpZiwgYmVzdEFuZ2xlRGlmO1xuXG4gICAgICAgIHZhciBpLCBqID0gY29ybmVycyAtIDEsIHNlZ3MgPSAwO1xuXG4gICAgICAgIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpIDwgY29ybmVycylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXhpID0gaSAqIDI7XG4gICAgICAgICAgICBpbmRleGogPSBqICogMjtcblxuICAgICAgICAgICAgcGl4ID0gcG9seWdvbltpbmRleGkgIF07XG4gICAgICAgICAgICBwaXkgPSBwb2x5Z29uW2luZGV4aSsxXTtcbiAgICAgICAgICAgIHBqeCA9IHBvbHlnb25baW5kZXhqICBdO1xuICAgICAgICAgICAgcGp5ID0gcG9seWdvbltpbmRleGorMV07XG5cbiAgICAgICAgICAgIGlmIChwaXggIT0gcGp4IHx8IHBpeSAhPSBwankpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5kZXhTZWcgPSBzZWdzICogMjtcblxuICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWcgIF0gPSBwaXg7XG4gICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZysxXSA9IHBpeTtcbiAgICAgICAgICAgICAgICBzZWdFW2luZGV4U2VnICBdID0gcGp4O1xuICAgICAgICAgICAgICAgIHNlZ0VbaW5kZXhTZWcrMV0gPSBwank7XG5cbiAgICAgICAgICAgICAgICBzZWdzKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGogPSBpO1xuXG4gICAgICAgICAgICBpZiAocGl5ID4gc3RhcnRZIHx8IHBpeSA9PSBzdGFydFkgJiYgcGl4IDwgc3RhcnRYKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXJ0WCA9IHBpeDtcbiAgICAgICAgICAgICAgICBzdGFydFkgPSBwaXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VncyA9PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdmFyIGlzU2VnbWVudEludGVyc2VjdGlvbmYgPSBMaW5lMmRVdGlsLmlzU2VnbWVudEludGVyc2VjdGlvbmY7XG5cbiAgICAgICAgdmFyIHNlZ1N4aSxzZWdTeWksXG4gICAgICAgICAgICBzZWdTeGosc2VnU3lqO1xuXG4gICAgICAgIHZhciBzZWdFeGksc2VnRXlpLFxuICAgICAgICAgICAgc2VnRXhqLHNlZ0V5ajtcblxuICAgICAgICBpID0gLTE7XG4gICAgICAgIHdoaWxlKCsraSA8IHNlZ3MgLSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleFNlZ2kgPSBpICogMjtcblxuICAgICAgICAgICAgc2VnU3hpID0gc2VnU1tpbmRleFNlZ2kgIF07XG4gICAgICAgICAgICBzZWdTeWkgPSBzZWdTW2luZGV4U2VnaSsxXTtcbiAgICAgICAgICAgIHNlZ0V4aSA9IHNlZ0VbaW5kZXhTZWdpICBdO1xuICAgICAgICAgICAgc2VnRXlpID0gc2VnRVtpbmRleFNlZ2krMV07XG5cbiAgICAgICAgICAgIGogPSBpO1xuICAgICAgICAgICAgd2hpbGUoKytqIDwgc2VncylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbmRleFNlZ2ogPSBqICogMjtcblxuICAgICAgICAgICAgICAgIHNlZ1N4aiA9IHNlZ1NbaW5kZXhTZWdqICBdO1xuICAgICAgICAgICAgICAgIHNlZ1N5aiA9IHNlZ1NbaW5kZXhTZWdqKzFdO1xuICAgICAgICAgICAgICAgIHNlZ0V4aiA9IHNlZ0VbaW5kZXhTZWdqICBdO1xuICAgICAgICAgICAgICAgIHNlZ0V5aiA9IHNlZ0VbaW5kZXhTZWdqKzFdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzU2VnbWVudEludGVyc2VjdGlvbmYoXG4gICAgICAgICAgICAgICAgICAgIHNlZ1N4aSxzZWdTeWksc2VnRXhpLHNlZ0V5aSxcbiAgICAgICAgICAgICAgICAgICAgc2VnU3hqLHNlZ1N5aixzZWdFeGosc2VnRXlqLGludGVyc2VjdHMpKVxuICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3RYID0gaW50ZXJzZWN0c1swXTtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0WSA9IGludGVyc2VjdHNbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKChpbnRlcnNlY3RYICE9IHNlZ1N4aSB8fCBpbnRlcnNlY3RZICE9IHNlZ1N5aSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChpbnRlcnNlY3RYICE9IHNlZ0V4aSB8fCBpbnRlcnNlY3RZICE9IHNlZ0V5aSkpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlZ3MgPT0gTUFYX1NFR1MpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhTZWcgPSBzZWdzICogMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VnU1tpbmRleFNlZyAgXSA9IHNlZ1N4aTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWcrMV0gPSBzZWdTeWk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdFW2luZGV4U2VnICBdID0gaW50ZXJzZWN0WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VbaW5kZXhTZWcrMV0gPSBpbnRlcnNlY3RZO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdzKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWdpICBdID0gaW50ZXJzZWN0WDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWdpKzFdID0gaW50ZXJzZWN0WTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICgoaW50ZXJzZWN0WCAhPSBzZWdTeGogfHwgaW50ZXJzZWN0WSAhPSBzZWdTeWopICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoaW50ZXJzZWN0WCAhPSBzZWdFeGogfHwgaW50ZXJzZWN0WSAhPSBzZWdFeWopKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZWdzID09IE1BWF9TRUdTKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4U2VnID0gc2VncyAqIDI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ1NbaW5kZXhTZWcgIF0gPSBzZWdTeGo7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnKzFdID0gc2VnU3lqO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VnRVtpbmRleFNlZyAgXSA9IGludGVyc2VjdFg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdFW2luZGV4U2VnKzFdID0gaW50ZXJzZWN0WTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VncysrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnaiAgXSA9IGludGVyc2VjdFg7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWdTW2luZGV4U2VnaisxXSA9IGludGVyc2VjdFk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHZhciBzZWdEaWZmeCxcbiAgICAgICAgICAgIHNlZ0RpZmZ5LFxuICAgICAgICAgICAgc2VnTGVuO1xuXG4gICAgICAgIGkgPSAtMTtcbiAgICAgICAgd2hpbGUoKytpIDwgc2VncylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXhTZWdpID0gaSAqIDI7XG4gICAgICAgICAgICBzZWdEaWZmeCA9IHNlZ0VbaW5kZXhTZWdpICBdIC0gc2VnU1tpbmRleFNlZ2kgIF07XG4gICAgICAgICAgICBzZWdEaWZmeSA9IHNlZ0VbaW5kZXhTZWdpKzFdIC0gc2VnU1tpbmRleFNlZ2krMV07XG5cbiAgICAgICAgICAgIHNlZ0xlbiAgID0gTWF0aC5zcXJ0KHNlZ0RpZmZ4ICogc2VnRGlmZnggKyBzZWdEaWZmeSAqIHNlZ0RpZmZ5KSB8fCAxO1xuXG4gICAgICAgICAgICBzZWdBbmdsZVtpXSA9IChzZWdEaWZmeSA+PSAwLjApID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguYWNvcyhzZWdEaWZmeC9zZWdMZW4pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKE1hdGguYWNvcygtc2VnRGlmZngvc2VnTGVuKSArIFBJKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgYyA9IHN0YXJ0WDtcbiAgICAgICAgZCA9IHN0YXJ0WTtcbiAgICAgICAgYSA9IGMgLSAxO1xuICAgICAgICBiID0gZDtcbiAgICAgICAgZSA9IDA7XG4gICAgICAgIGYgPSAwO1xuXG4gICAgICAgIGNvcm5lcnMgPSAxO1xuXG4gICAgICAgIG91dC5wdXNoKGMsZCk7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJlc3RBbmdsZURpZiA9IFRXT19QSTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlZ3M7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbmRleFNlZ2kgPSBpICogMjtcblxuICAgICAgICAgICAgICAgIHNlZ1N4aSA9IHNlZ1NbaW5kZXhTZWdpICBdO1xuICAgICAgICAgICAgICAgIHNlZ1N5aSA9IHNlZ1NbaW5kZXhTZWdpKzFdO1xuICAgICAgICAgICAgICAgIHNlZ0V4aSA9IHNlZ0VbaW5kZXhTZWdpICBdO1xuICAgICAgICAgICAgICAgIHNlZ0V5aSA9IHNlZ0VbaW5kZXhTZWdpKzFdO1xuXG5cbiAgICAgICAgICAgICAgICBpZiAoc2VnU3hpID09IGMgJiYgc2VnU3lpID09IGQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHNlZ0V4aSAhPWEgfHwgc2VnRXlpICE9IGIpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVEaWYgPSBsYXN0QW5nbGUgLSBzZWdBbmdsZVtpXTtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYW5nbGVEaWYgPj0gVFdPX1BJKSBhbmdsZURpZiAtPSBUV09fUEk7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChhbmdsZURpZiA8IDAgICAgICApIGFuZ2xlRGlmICs9IFRXT19QSTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGVEaWYgPCBiZXN0QW5nbGVEaWYpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RBbmdsZURpZiA9IGFuZ2xlRGlmO1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IHNlZ0V4aTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBzZWdFeWk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlZ0V4aSA9PSBjICYmIHNlZ0V5aSA9PSBkICYmXG4gICAgICAgICAgICAgICAgICAgIChzZWdTeGkgIT1hIHx8IHNlZ1N5aSAhPSBiKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlRGlmID0gbGFzdEFuZ2xlIC0gc2VnQW5nbGVbaV0gKyBQSTtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoYW5nbGVEaWYgPj0gVFdPX1BJKSBhbmdsZURpZiAtPSBUV09fUEk7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChhbmdsZURpZiA8ICAwICAgICApIGFuZ2xlRGlmICs9IFRXT19QSTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5nbGVEaWYgPCBiZXN0QW5nbGVEaWYpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RBbmdsZURpZiA9IGFuZ2xlRGlmO1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IHNlZ1N4aTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBzZWdTeWk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb3JuZXJzID4gMSAmJlxuICAgICAgICAgICAgICAgIGMgPT0gb3V0WzBdICYmIGQgPT0gb3V0WzFdICYmXG4gICAgICAgICAgICAgICAgZSA9PSBvdXRbMl0gJiYgZiA9PSBvdXRbM10pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29ybmVycy0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYmVzdEFuZ2xlRGlmID09IFRXT19QSSB8fFxuICAgICAgICAgICAgICAgIGNvcm5lcnMgPT0gTUFYX1NFR1MpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3JuZXJzKys7XG4gICAgICAgICAgICBvdXQucHVzaChlLGYpO1xuXG4gICAgICAgICAgICBsYXN0QW5nbGUgLT0gYmVzdEFuZ2xlRGlmICsgUEk7XG5cbiAgICAgICAgICAgIGEgPSBjO1xuICAgICAgICAgICAgYiA9IGQ7XG4gICAgICAgICAgICBjID0gZTtcbiAgICAgICAgICAgIGQgPSBmO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgLy9odHRwOi8vYWxpZW5yeWRlcmZsZXguY29tL3BvbHlnb25faW5zZXQvXG4gICAgbWFrZUluc2V0IDogZnVuY3Rpb24ocG9seWdvbixkaXN0YW5jZSlcbiAgICB7XG4gICAgICAgIGlmKHBvbHlnb24ubGVuZ3RoIDw9IDIpcmV0dXJuIG51bGw7XG5cbiAgICAgICAgdmFyIG51bSA9IHBvbHlnb24ubGVuZ3RoICogMC41IC0gMTtcblxuICAgICAgICB2YXIgc3ggPSBwb2x5Z29uWzBdLFxuICAgICAgICAgICAgc3kgPSBwb2x5Z29uWzFdO1xuXG4gICAgICAgIHZhciBhLCBiLFxuICAgICAgICAgICAgYyA9IHBvbHlnb25bcG9seWdvbi5sZW5ndGggLSAyXSxcbiAgICAgICAgICAgIGQgPSBwb2x5Z29uW3BvbHlnb24ubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICBlID0gc3gsXG4gICAgICAgICAgICBmID0gc3k7XG5cbiAgICAgICAgdmFyIGluZGV4MCxpbmRleDE7XG5cbiAgICAgICAgdmFyIHRlbXAgPSBuZXcgQXJyYXkoMik7XG5cbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG51bSlcbiAgICAgICAge1xuICAgICAgICAgICAgYSA9IGM7XG4gICAgICAgICAgICBiID0gZDtcbiAgICAgICAgICAgIGMgPSBlO1xuICAgICAgICAgICAgZCA9IGY7XG5cbiAgICAgICAgICAgIGluZGV4MCA9IGkgKiAyO1xuICAgICAgICAgICAgaW5kZXgxID0gKGkrMSkqMjtcblxuICAgICAgICAgICAgZSA9IHBvbHlnb25baW5kZXgxICAgIF07XG4gICAgICAgICAgICBmID0gcG9seWdvbltpbmRleDEgKyAxXTtcblxuICAgICAgICAgICAgdGVtcFswXSA9IHBvbHlnb25baW5kZXgwXTtcbiAgICAgICAgICAgIHRlbXBbMV0gPSBwb2x5Z29uW2luZGV4MCArIDFdO1xuXG4gICAgICAgICAgICB0aGlzLm1ha2VJbnNldENvcm5lcihhLCBiLCBjLCBkLCBlLCBmLCBkaXN0YW5jZSwgdGVtcCk7XG4gICAgICAgICAgICBwb2x5Z29uW2luZGV4MCAgICBdID0gdGVtcFswXTtcbiAgICAgICAgICAgIHBvbHlnb25baW5kZXgwICsgMV0gPSB0ZW1wWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXgwID0gaSAqIDI7XG5cbiAgICAgICAgdGVtcFswXSA9IHBvbHlnb25baW5kZXgwICAgIF07XG4gICAgICAgIHRlbXBbMV0gPSBwb2x5Z29uW2luZGV4MCArIDFdO1xuXG4gICAgICAgIHRoaXMubWFrZUluc2V0Q29ybmVyKGMsIGQsIGUsIGYsIHN4LCBzeSwgZGlzdGFuY2UsIHRlbXApO1xuICAgICAgICBwb2x5Z29uW2luZGV4MCAgICBdID0gdGVtcFswXTtcbiAgICAgICAgcG9seWdvbltpbmRleDAgKyAxXSA9IHRlbXBbMV07XG5cbiAgICAgICAgcmV0dXJuIHBvbHlnb247XG4gICAgfSxcblxuICAgIG1ha2VJbnNldENvcm5lciA6IGZ1bmN0aW9uKGEsYixjLGQsZSxmLGRpc3RhbmNlLG91dClcbiAgICB7XG4gICAgICAgIHZhciAgYzEgPSBjLFxuICAgICAgICAgICAgZDEgPSBkLFxuICAgICAgICAgICAgYzIgPSBjLFxuICAgICAgICAgICAgZDIgPSBkLFxuICAgICAgICAgICAgZHgxLCBkeTEsIGRpc3QxLFxuICAgICAgICAgICAgZHgyLCBkeTIsIGRpc3QyLFxuICAgICAgICAgICAgaW5zZXRYLCBpbnNldFkgO1xuXG4gICAgICAgIHZhciBFUFNJTE9OID0gMC4wMDAxO1xuXG4gICAgICAgIGR4MSAgID0gYyAtIGE7XG4gICAgICAgIGR5MSAgID0gZCAtIGI7XG4gICAgICAgIGRpc3QxID0gTWF0aC5zcXJ0KGR4MSpkeDErZHkxKmR5MSk7XG5cbiAgICAgICAgZHgyICAgPSBlIC0gYztcbiAgICAgICAgZHkyICAgPSBmIC0gZDtcbiAgICAgICAgZGlzdDIgPSBNYXRoLnNxcnQoZHgyKmR4MitkeTIqZHkyKTtcblxuICAgICAgICBpZihkaXN0MSA8IEVQU0lMT04gfHwgZGlzdDIgIDwgRVBTSUxPTilyZXR1cm47XG5cbiAgICAgICAgZGlzdDEgPSAxLjAgLyBkaXN0MTtcbiAgICAgICAgZGlzdDIgPSAxLjAgLyBkaXN0MjtcblxuICAgICAgICBpbnNldFggPSBkeTEgKiBkaXN0MSAqIGRpc3RhbmNlO1xuICAgICAgICBhICAgICArPSBpbnNldFg7XG4gICAgICAgIGMxICAgICs9IGluc2V0WDtcblxuICAgICAgICBpbnNldFkgPS1keDEgKiBkaXN0MSAqIGRpc3RhbmNlO1xuICAgICAgICBiICAgICArPSBpbnNldFk7XG4gICAgICAgIGQxICAgICs9IGluc2V0WTtcblxuICAgICAgICBpbnNldFggPSBkeTIgKiBkaXN0MiAqIGRpc3RhbmNlO1xuICAgICAgICBlICAgICArPSBpbnNldFg7XG4gICAgICAgIGMyICAgICs9IGluc2V0WDtcblxuICAgICAgICBpbnNldFkgPS1keDIgKiBkaXN0MiAqIGRpc3RhbmNlO1xuICAgICAgICBmICAgICArPSBpbnNldFk7XG4gICAgICAgIGQyICAgICs9IGluc2V0WTtcblxuICAgICAgICBpZiAoYzEgPT0gYzIgJiYgZDE9PWQyKVxuICAgICAgICB7XG4gICAgICAgICAgICBvdXRbMF0gPSBjMTtcbiAgICAgICAgICAgIG91dFsxXSA9IGQxO1xuICAgICAgICAgICAgcmV0dXJuOyB9XG5cbiAgICAgICAgdmFyIHRlbXAgPSBuZXcgQXJyYXkoMik7XG5cbiAgICAgICAgaWYgKExpbmUyZFV0aWwuaXNJbnRlcnNlY3Rpb25mKGEsYixjMSxkMSxjMixkMixlLGYsdGVtcCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG91dFswXSA9IHRlbXBbMF07XG4gICAgICAgICAgICBvdXRbMV0gPSB0ZW1wWzFdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIGlzUG9pbnRJblBvbHlnb24gOiBmdW5jdGlvbih4LHkscG9pbnRzKVxuICAgIHtcbiAgICAgICAgdmFyIHduID0gMDtcbiAgICAgICAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGggLyAyO1xuXG4gICAgICAgIHZhciBpbmRleDAsXG4gICAgICAgICAgICBpbmRleDE7XG5cblxuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2kgPCBsZW4gLSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleDAgPSBpICogMjtcbiAgICAgICAgICAgIGluZGV4MSA9IChpICsgMSkgKiAyO1xuXG4gICAgICAgICAgICBpZihwb2ludHNbaW5kZXgwKzFdIDw9IHkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYocG9pbnRzW2luZGV4MSsxXSA+IHkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZihMaW5lMmRVdGlsLmlzUG9pbnRMZWZ0KHBvaW50c1tpbmRleDBdLHBvaW50c1tpbmRleDAgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgxXSxwb2ludHNbaW5kZXgxICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCx5KT4wKSsrd247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKHBvaW50c1tpbmRleDErMV0gPD0geSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKExpbmUyZFV0aWwuaXNQb2ludExlZnQocG9pbnRzW2luZGV4MF0scG9pbnRzW2luZGV4MCArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDFdLHBvaW50c1tpbmRleDEgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LHkpPDApLS13bjtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3bjtcblxuICAgIH0sXG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICAgIG1ha2VWZXJ0aWNlc1JldmVyc2VkIDogZnVuY3Rpb24ocG9seWdvbil7IHJldHVybiBwb2x5Z29uLnJldmVyc2UoKTt9LFxuXG5cbiAgICBtYWtlUG9seWdvbjNkRmxvYXQzMiA6IGZ1bmN0aW9uKHBvbHlnb24sc2NhbGUpXG4gICAge1xuICAgICAgICBzY2FsZSA9IHNjYWxlIHx8IDEuMDtcblxuICAgICAgICB2YXIgcG9seUxlbiA9IHBvbHlnb24ubGVuZ3RoICogMC41LFxuICAgICAgICAgICAgb3V0ICAgICA9IG5ldyBGbG9hdDMyQXJyYXkocG9seUxlbiAqIDMpO1xuICAgICAgICB2YXIgaW5kZXgwLGluZGV4MTtcblxuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2kgPCBwb2x5TGVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleDAgPSBpICogMztcbiAgICAgICAgICAgIGluZGV4MSA9IGkgKiAyO1xuXG4gICAgICAgICAgICBvdXRbaW5kZXgwICBdID0gcG9seWdvbltpbmRleDEgIF0gKiBzY2FsZTtcbiAgICAgICAgICAgIG91dFtpbmRleDArMV0gPSAwLjA7XG4gICAgICAgICAgICBvdXRbaW5kZXgwKzJdID0gcG9seWdvbltpbmRleDErMV0gKiBzY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLypcbiAgICAvL1N1dGhlcmxhbmQtSG9kZ21hblxuICAgIG1ha2VDbGlwcGluZ1NIIDogZnVuY3Rpb24ocG9seWdvbixjbGlwcGluZ1BvbHlnb24pXG4gICAge1xuICAgICAgICB2YXIgbGVuMCA9IHBvbHlnb24ubGVuZ3RoICogMC41LFxuICAgICAgICAgICAgbGVuMSA9IGNsaXBwaW5nUG9seWdvbi5sZW5ndGggO1xuXG5cbiAgICAgICAgdmFyIExpbmUyZFV0aWwgPSBHTEtpdC5MaW5lMmRVdGlsO1xuXG4gICAgICAgIHZhciBvdXQgPSBbXTtcblxuICAgICAgICB2YXIgY2xpcEVkZ2VTeCxjbGlwRWRnZVN5LFxuICAgICAgICAgICAgY2xpcEVkZ2VFeCxjbGlwRWRnZUV5O1xuXG4gICAgICAgIHZhciBwb2x5RWRnZVN4LCBwb2x5RWRnZVN5LFxuICAgICAgICAgICAgcG9seUVkZ2VFeCwgcG9seUVkZ2VFeTtcblxuICAgICAgICB2YXIgcG9seVZlcnRJc09uTGVmdDtcblxuICAgICAgICBjb25zb2xlLmxvZyhjbGlwcGluZ1BvbHlnb24pO1xuXG4gICAgICAgIHZhciBpLCBqO1xuXG4gICAgICAgIHZhciBpMiwgajIsIGk0O1xuXG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZShpIDwgbGVuMSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2xpcEVkZ2VTeCA9IGNsaXBwaW5nUG9seWdvbltpICBdO1xuICAgICAgICAgICAgY2xpcEVkZ2VTeSA9IGNsaXBwaW5nUG9seWdvbltpKzFdO1xuXG4gICAgICAgICAgICBpMiA9IChpICsgMikgJSBsZW4xO1xuICAgICAgICAgICAgY2xpcEVkZ2VFeCA9IGNsaXBwaW5nUG9seWdvbltpMl07XG4gICAgICAgICAgICBjbGlwRWRnZUV5ID0gY2xpcHBpbmdQb2x5Z29uW2kyKzFdO1xuXG5cbiAgICAgICAgICAgIGkrPTI7XG4gICAgICAgIH1cbiAgICAgICAvLyB3aGlsZSgrK2kgPClcblxuXG5cbiAgICAgICAgcmV0dXJuIG91dDtcblxuICAgIH0sXG5cbiAgICBtYWtlQ2xpcHBpbmdWIDogZnVuY3Rpb24ocG9seWdvbixjbGlwcGluZ1BvbHlnb24pXG4gICAge1xuXG4gICAgfSxcblxuICAgIG1ha2VTY2FuRmlsbCA6IGZ1bmN0aW9uKHBvbHlnb24pXG4gICAge1xuXG4gICAgfVxuXG4gICAgKi9cblxuXG5cblxufTsiLCJ2YXIga01hdGggPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdGgnKSxcbiAgICBWZWMzICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMycpLFxuICAgIE1hdDQ0ID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtNYXQ0NCcpO1xuXG4vL1RPRE86IEFkZCBjbG9zZSwgc21vb3RoIGluIG91dCBpbnRycGwsIHByZSBwb3N0IHBvaW50c1xuZnVuY3Rpb24gU3BsaW5lKClcbntcbiAgICB0aGlzLnBvaW50cyAgICAgPSBudWxsO1xuICAgIHRoaXMudmVydGljZXMgICA9IG51bGw7XG5cbiAgICB0aGlzLl9kZXRhaWwgICAgPSAyMDtcbiAgICB0aGlzLl90ZW5zaW9uICAgPSAwO1xuICAgIHRoaXMuX2JpYXMgICAgICA9IDA7XG4gICAgdGhpcy5fbnVtUG9pbnRzID0gbnVsbDtcbiAgICB0aGlzLl9udW1WZXJ0cyAgPSBudWxsO1xuXG4gICAgdGhpcy5fdGVtcFZlYzAgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdGVtcFZlYzEgID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdGVtcE1hdDAgID0gTWF0NDQubWFrZSgpO1xuICAgIHRoaXMuX3RlbXBNYXQxICA9IE1hdDQ0Lm1ha2UoKTtcbiAgICB0aGlzLl90ZW1wTWF0MiAgPSBNYXQ0NC5tYWtlKCk7XG5cbiAgICB0aGlzLl9heGlzWSAgICAgPSBWZWMzLkFYSVNfWSgpO1xufTtcblxuU3BsaW5lLnByb3RvdHlwZS5zZXRQb2ludDNmID0gZnVuY3Rpb24oaW5kZXgseCx5LHopXG57XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgaW5kZXgqPTM7XG4gICAgcG9pbnRzW2luZGV4ICBdID0geDtcbiAgICBwb2ludHNbaW5kZXgrMV0gPSB5O1xuICAgIHBvaW50c1tpbmRleCsyXSA9IHo7XG59O1xuXG5TcGxpbmUucHJvdG90eXBlLnNldFBvaW50cyA9ICBmdW5jdGlvbihhcnIpXG57XG4gICAgdmFyIG51bSAgICAgICAgID0gdGhpcy5fbnVtUG9pbnRzID0gYXJyLmxlbmd0aCAvIDMsXG4gICAgICAgIG51bVZlcnRzICAgID0gdGhpcy5fbnVtVmVydHMgID0gKG51bSAtIDEpICogKHRoaXMuX2RldGFpbCAtIDEpICsgMTtcblxuICAgIHRoaXMucG9pbnRzICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoYXJyKTtcbiAgICB0aGlzLnZlcnRpY2VzICAgPSBuZXcgRmxvYXQzMkFycmF5KG51bVZlcnRzICogMyk7XG59O1xuXG5TcGxpbmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgZGV0YWlsICAgID0gdGhpcy5fZGV0YWlsLFxuICAgICAgICBkZXRhaWxfMSAgPSBkZXRhaWwgLSAxLFxuICAgICAgICBwb2ludHMgICAgPSB0aGlzLnBvaW50cyxcbiAgICAgICAgbnVtUG9pbnRzID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICB2ZXJ0aWNlcyAgPSB0aGlzLnZlcnRpY2VzO1xuXG4gICAgdmFyIHRlbnNpb24gICAgICAgPSB0aGlzLl90ZW5zaW9uLFxuICAgICAgICBiaWFzICAgICAgICAgID0gdGhpcy5fYmlhcyxcbiAgICAgICAgaGVybWl0ZUludHJwbCA9IGtNYXRoLmhlcm1pdGVJbnRycGw7XG5cbiAgICB2YXIgaSwgaiwgdDtcbiAgICB2YXIgbGVuID0gbnVtUG9pbnRzIC0gMTtcblxuICAgIHZhciBpbmRleCxpbmRleF8xLGluZGV4MSxpbmRleDIsXG4gICAgICAgIHZlcnRJbmRleDtcblxuICAgIHZhciB4LCB5LCB6O1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IGxlbilcbiAgICB7XG4gICAgICAgIGluZGV4ICAgID0gaTtcblxuICAgICAgICBpbmRleDEgICA9IE1hdGgubWluKChpbmRleCArIDEpLGxlbikgKiAzO1xuICAgICAgICBpbmRleDIgICA9IE1hdGgubWluKChpbmRleCArIDIpLGxlbikgKiAzO1xuICAgICAgICBpbmRleF8xICA9IE1hdGgubWF4KDAsKGluZGV4IC0gMSkpICAgKiAzO1xuICAgICAgICBpbmRleCAgICo9IDM7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBkZXRhaWxfMSlcbiAgICAgICAge1xuICAgICAgICAgICAgdCA9IGogLyBkZXRhaWxfMTtcblxuICAgICAgICAgICAgeCA9IGhlcm1pdGVJbnRycGwocG9pbnRzW2luZGV4XzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4ICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MSBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4MiBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx0ZW5zaW9uLGJpYXMpO1xuXG4gICAgICAgICAgICB5ID0gaGVybWl0ZUludHJwbChwb2ludHNbaW5kZXhfMSArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4ICAgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDEgICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgyICArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx0ZW5zaW9uLGJpYXMpO1xuXG4gICAgICAgICAgICB6ID0gaGVybWl0ZUludHJwbChwb2ludHNbaW5kZXhfMSArIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4ICAgKyAyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleDEgICsgMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaW5kZXgyICArIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdCx0ZW5zaW9uLGJpYXMpO1xuXG4gICAgICAgICAgICB2ZXJ0SW5kZXggPSAoaSAqIGRldGFpbF8xICsgaikgKiAzO1xuXG4gICAgICAgICAgICB2ZXJ0aWNlc1t2ZXJ0SW5kZXggIF0gPSB4O1xuICAgICAgICAgICAgdmVydGljZXNbdmVydEluZGV4KzFdID0geTtcbiAgICAgICAgICAgIHZlcnRpY2VzW3ZlcnRJbmRleCsyXSA9IHo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdmVydExlbiAgID0gdmVydGljZXMubGVuZ3RoLFxuICAgICAgICBwb2ludHNMZW4gPSBwb2ludHMubGVuZ3RoO1xuXG4gICAgdmVydGljZXNbdmVydExlbi0zXSA9IHBvaW50c1twb2ludHNMZW4tM107XG4gICAgdmVydGljZXNbdmVydExlbi0yXSA9IHBvaW50c1twb2ludHNMZW4tMl07XG4gICAgdmVydGljZXNbdmVydExlbi0xXSA9IHBvaW50c1twb2ludHNMZW4tMV07XG5cbn07XG5cblNwbGluZS5wcm90b3R5cGUuc2V0RGV0YWlsICA9IGZ1bmN0aW9uKGRldGFpbCkge3RoaXMuX2RldGFpbCAgPSBkZXRhaWw7fTtcblNwbGluZS5wcm90b3R5cGUuc2V0VGVuc2lvbiA9IGZ1bmN0aW9uKHRlbnNpb24pe3RoaXMuX3RlbnNpb24gPSB0ZW5zaW9uO307XG5TcGxpbmUucHJvdG90eXBlLnNldEJpYXMgICAgPSBmdW5jdGlvbihiaWFzKSAgIHt0aGlzLl9iaWFzICAgID0gYmlhczt9O1xuXG5TcGxpbmUucHJvdG90eXBlLmdldE51bVBvaW50cyAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbnVtUG9pbnRzO307XG5TcGxpbmUucHJvdG90eXBlLmdldE51bVZlcnRpY2VzID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbnVtVmVydHM7fTtcblxuU3BsaW5lLnByb3RvdHlwZS5nZXRWZWMzT25Qb2ludHMgPSBmdW5jdGlvbih2YWwsb3V0KVxue1xuICAgIG91dCA9IG91dCB8fCB0aGlzLl90ZW1wVmVjMDtcblxuICAgIHZhciBwb2ludHMgICAgPSB0aGlzLnBvaW50cyxcbiAgICAgICAgbnVtUG9pbnRzID0gdGhpcy5fbnVtUG9pbnRzLFxuICAgICAgICBsZW4gICAgICAgPSBudW1Qb2ludHMgLSAxO1xuXG4gICAgdmFyIGluZGV4ICA9IE1hdGguZmxvb3IobnVtUG9pbnRzICogdmFsKSxcbiAgICAgICAgaW5kZXgxID0gTWF0aC5taW4oaW5kZXggKyAxLCBsZW4pO1xuXG4gICAgICAgIGluZGV4ICo9IDM7XG4gICAgICAgIGluZGV4MSo9IDM7XG5cbiAgICB2YXIgbG9jYWxJbnRycGwgICAgPSAodmFsICUgKDEgLyBudW1Qb2ludHMpKSAqIG51bVBvaW50cyxcbiAgICAgICAgbG9jYWxJbnRycGxJbnYgPSAxLjAgLSBsb2NhbEludHJwbDtcblxuICAgIG91dFswXSA9IHBvaW50c1tpbmRleCAgXSAqIGxvY2FsSW50cnBsSW52ICsgcG9pbnRzW2luZGV4MSAgXSAqIGxvY2FsSW50cnBsO1xuICAgIG91dFsxXSA9IHBvaW50c1tpbmRleCsxXSAqIGxvY2FsSW50cnBsSW52ICsgcG9pbnRzW2luZGV4MSsxXSAqIGxvY2FsSW50cnBsO1xuICAgIG91dFsyXSA9IHBvaW50c1tpbmRleCsyXSAqIGxvY2FsSW50cnBsSW52ICsgcG9pbnRzW2luZGV4MSsyXSAqIGxvY2FsSW50cnBsO1xuXG4gICAgcmV0dXJuIG91dDtcblxufTtcblxuU3BsaW5lLnByb3RvdHlwZS5nZXRWZWMzT25TcGxpbmUgPSBmdW5jdGlvbih2YWwsb3V0KVxue1xuICAgIG91dCA9IG91dCB8fCB0aGlzLl90ZW1wVmVjMDtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXMsXG4gICAgICAgIG51bVZlcnRzID0gdGhpcy5fbnVtVmVydHMsXG4gICAgICAgIGxlbiAgICAgID0gbnVtVmVydHMgLSAxO1xuXG4gICAgdmFyIGluZGV4ICA9IE1hdGgubWluKE1hdGguZmxvb3IobnVtVmVydHMgKiB2YWwpLGxlbiksXG4gICAgICAgIGluZGV4MSA9IE1hdGgubWluKGluZGV4ICsgMSxsZW4pO1xuXG4gICAgdmFyIGxvY2FsSW50cnBsICAgID0gKHZhbCAlICgxLjAgLyBudW1WZXJ0cykpICogbnVtVmVydHMsXG4gICAgICAgIGxvY2FsSW50cnBsSW52ID0gMS4wIC0gbG9jYWxJbnRycGw7XG5cbiAgICBpbmRleCAgKj0gMztcbiAgICBpbmRleDEgKj0gMztcblxuICAgIG91dFswXSA9IHZlcnRpY2VzW2luZGV4ICBdICogbG9jYWxJbnRycGxJbnYgKyB2ZXJ0aWNlc1tpbmRleDEgIF0gKiBsb2NhbEludHJwbDtcbiAgICBvdXRbMV0gPSB2ZXJ0aWNlc1tpbmRleCsxXSAqIGxvY2FsSW50cnBsSW52ICsgdmVydGljZXNbaW5kZXgxKzFdICogbG9jYWxJbnRycGw7XG4gICAgb3V0WzJdID0gdmVydGljZXNbaW5kZXgrMl0gKiBsb2NhbEludHJwbEludiArIHZlcnRpY2VzW2luZGV4MSsyXSAqIGxvY2FsSW50cnBsO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cblxuXG4vL2htXG5TcGxpbmUucHJvdG90eXBlLmdldFBvaW50c0xpbmVMZW5ndGhTcSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgcG9pbnRzICAgID0gdGhpcy5wb2ludHM7XG5cbiAgICB2YXIgZHggPSAwLFxuICAgICAgICBkeSA9IDAsXG4gICAgICAgIGR6ID0gMDtcblxuICAgIHZhciBpID0gcG9pbnRzLmxlbmd0aDtcbiAgICB3aGlsZShpID4gNilcbiAgICB7XG4gICAgICAgIGR4ICs9IHBvaW50c1tpLTNdIC0gcG9pbnRzW2ktNl07XG4gICAgICAgIGR5ICs9IHBvaW50c1tpLTJdIC0gcG9pbnRzW2ktNV07XG4gICAgICAgIGR6ICs9IHBvaW50c1tpLTFdIC0gcG9pbnRzW2ktNF07XG5cbiAgICAgICAgaS09MztcbiAgICB9XG5cbiAgICByZXR1cm4gZHgqZHgrZHkqZHkrZHoqZHo7XG5cbn07XG5cblNwbGluZS5wcm90b3R5cGUuZ2V0U3BsaW5lTGluZUxlbmd0aFNxID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXM7XG5cbiAgICB2YXIgZHggPSAwLFxuICAgICAgICBkeSA9IDAsXG4gICAgICAgIGR6ID0gMDtcblxuICAgIHZhciBpID0gdmVydGljZXMubGVuZ3RoO1xuICAgIHdoaWxlKGkgPiA2KVxuICAgIHtcbiAgICAgICAgZHggKz0gdmVydGljZXNbaS0zXSAtIHZlcnRpY2VzW2ktNl07XG4gICAgICAgIGR5ICs9IHZlcnRpY2VzW2ktMl0gLSB2ZXJ0aWNlc1tpLTVdO1xuICAgICAgICBkeiArPSB2ZXJ0aWNlc1tpLTFdIC0gdmVydGljZXNbaS00XTtcblxuICAgICAgICBpLT0zO1xuICAgIH1cblxuICAgIHJldHVybiBkeCpkeCtkeSpkeStkeipkejtcbn07XG5cblNwbGluZS5wcm90b3R5cGUuZ2V0UG9pbnRzTGluZUxlbmd0aCA9IGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguc3FydCh0aGlzLmdldFBvaW50c0xpbmVMZW5ndGhTcSgpKTt9O1xuU3BsaW5lLnByb3RvdHlwZS5nZXRTcGxpbmVQb2ludHNMZW5ndGggPSBmdW5jdGlvbigpe3JldHVybiBNYXRoLnNxcnQodGhpcy5nZXRTcGxpbmVMaW5lTGVuZ3RoU3EoKSl9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwbGluZTtcblxuXG4iLCIvKipcbiAqXG4gKiBnbEtpdC5qcyAtIEEgV2ViR0wgdG9vbGJveFxuICpcbiAqIGdsS2l0LmpzIGlzIGF2YWlsYWJsZSB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVCBsaWNlbnNlLiAgVGhlIGZ1bGwgdGV4dCBvZiB0aGVcbiAqIE1JVCBsaWNlbnNlIGlzIGluY2x1ZGVkIGJlbG93LlxuICpcbiAqIE1JVCBMaWNlbnNlXG4gKiA9PT09PT09PT09PVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMiBIZW5yeWsgV29sbGlrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbiAqIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogU09GVFdBUkUuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBNYXRoICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtNYXRoJyksXG4gICAgVmVjMiAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZ2xrVmVjMicpLFxuICAgIFZlYzMgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBWZWM0ICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtWZWM0JyksXG4gICAgTWF0MzMgICAgICAgOiByZXF1aXJlKCcuL21hdGgvZ2xrTWF0MzMnKSxcbiAgICBNYXQ0NCAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9nbGtNYXQ0NCcpLFxuICAgIFF1YXRlcm5pb24gIDogcmVxdWlyZSgnLi9tYXRoL2dsa1F1YXRlcm5pb24nKSxcblxuXG4gICAgTWF0R0wgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtNYXRHTCcpLFxuICAgIFByb2dMb2FkZXIgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvc2hhZGVyL2dsa1Byb2dMb2FkZXInKSxcbiAgICBTaGFkZXJMb2FkZXIgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL3NoYWRlci9nbGtTaGFkZXJMb2FkZXInKSxcbiAgICBDYW1lcmFCYXNpYyAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsa0NhbWVyYUJhc2ljJyksXG5cbiAgICBMaWdodCAgICAgICAgICAgIDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtMaWdodCcpLFxuICAgIFBvaW50TGlnaHQgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsL2dsa1BvaW50TGlnaHQnKSxcbiAgICBEaXJlY3Rpb25hbExpZ2h0IDogcmVxdWlyZSgnLi9ncmFwaGljcy9nbC9nbGtEaXJlY3Rpb25hbExpZ2h0JyksXG4gICAgU3BvdExpZ2h0ICAgICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZ2xrU3BvdExpZ2h0JyksXG5cbiAgICBNYXRlcmlhbCAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZ2xrTWF0ZXJpYWwnKSxcbiAgICBUZXh0dXJlICAgICA6IHJlcXVpcmUoJy4vZ3JhcGhpY3MvZ2wvZ2xrVGV4dHVyZScpLFxuXG4gICAga0dMVXRpbCAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL3V0aWwvZ2xrR0xVdGlsJyksXG4gICAga0dMICAgICAgICAgOiByZXF1aXJlKCcuL2dyYXBoaWNzL2dsa0dMJyksXG5cbiAgICBNb3VzZSAgICAgICA6IHJlcXVpcmUoJy4vdXRpbC9nbGtNb3VzZScpLFxuICAgIENvbG9yICAgICAgIDogcmVxdWlyZSgnLi91dGlsL2dsa0NvbG9yJyksXG4gICAgVXRpbCAgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZ2xrVXRpbCcpLFxuXG4gICAgUGxhdGZvcm0gICAgOiByZXF1aXJlKCcuL3N5c3RlbS9nbGtQbGF0Zm9ybScpLFxuXG4gICAgR2VvbTNkICAgICAgICAgICAgOiByZXF1aXJlKCcuL2dlb20vZ2xrR2VvbTNkJyksXG4gICAgUGFyYW1ldHJpY1N1cmZhY2UgOiByZXF1aXJlKCcuL2dlb20vZ2xrUGFyYW1ldHJpY1N1cmZhY2UnKSxcbiAgICBJU09TdXJmYWNlICAgICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9nbGtJU09TdXJmYWNlJyksXG4gICAgSVNPQmFuZCAgICAgICAgICAgOiByZXF1aXJlKCcuL2dlb20vZ2xrSVNPQmFuZCcpLFxuICAgIExpbmVCdWZmZXIyZCAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2dsa0xpbmVCdWZmZXIyZCcpLFxuICAgIExpbmVCdWZmZXIzZCAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2dsa0xpbmVCdWZmZXIzZCcpLFxuICAgIFNwbGluZSAgICAgICAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2dsa1NwbGluZScpLFxuICAgIExpbmUyZFV0aWwgICAgICAgIDogcmVxdWlyZSgnLi9nZW9tL2dsa0xpbmUyZFV0aWwnKSxcbiAgICBQb2x5Z29uMmRVdGlsICAgICA6IHJlcXVpcmUoJy4vZ2VvbS9nbGtQb2x5Z29uMmRVdGlsJyksXG5cblxuICAgIEFwcGxpY2F0aW9uIDogcmVxdWlyZSgnLi9hcHAvZ2xrQXBwbGljYXRpb24nKVxuXG59O1xuXG4iLCJ2YXIgVmVjMyAgPSByZXF1aXJlKCcuLi8uLi9tYXRoL2dsa1ZlYzMnKSxcbiAgICBMaWdodCA9IHJlcXVpcmUoJy4vZ2xrTGlnaHQnKTtcblxuZnVuY3Rpb24gRGlyZWN0aW9uYWxMaWdodChpZClcbntcbiAgICBMaWdodC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG59XG5cbkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMaWdodC5wcm90b3R5cGUpO1xuXG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5zZXREaXJlY3Rpb24gICA9IGZ1bmN0aW9uKHYpICAgIHtWZWMzLnNldCh0aGlzLmRpcmVjdGlvbix2KTt9O1xuRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUuc2V0RGlyZWN0aW9uM2YgPSBmdW5jdGlvbih4LHkseil7VmVjMy5zZXQzZih0aGlzLmRpcmVjdGlvbix4LHkseik7fTtcblxuRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUubG9va0F0ICAgICAgICAgPSBmdW5jdGlvbihwb3NpdGlvbix0YXJnZXQpXG57XG4gICAgdGhpcy5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy5zZXREaXJlY3Rpb24oVmVjMy5ub3JtYWxpemUoVmVjMy5zdWJiZWQodGFyZ2V0LHBvc2l0aW9uKSkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rpb25hbExpZ2h0OyIsInZhciBWZWMzID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgVmVjNCA9IHJlcXVpcmUoJy4uLy4uL21hdGgvZ2xrVmVjNCcpO1xuXG5mdW5jdGlvbiBMaWdodChpZClcbntcbiAgICB0aGlzLl9pZCAgID0gaWQ7XG5cbiAgICB0aGlzLmFtYmllbnQgID0gbmV3IEZsb2F0MzJBcnJheShbMSwxLDFdKTtcbiAgICB0aGlzLmRpZmZ1c2UgID0gbmV3IEZsb2F0MzJBcnJheShbMSwxLDFdKTtcbiAgICB0aGlzLnNwZWN1bGFyID0gbmV3IEZsb2F0MzJBcnJheShbMSwxLDFdKTtcblxuICAgIHRoaXMucG9zaXRpb24gICAgICAgICAgICAgPSBWZWM0LlpFUk8oKTtcbiAgICB0aGlzLmRpcmVjdGlvbiAgICAgICAgICAgID0gbnVsbDtcbiAgICB0aGlzLnNwb3RFeHBvbmVudCAgICAgICAgID0gbnVsbDtcbiAgICB0aGlzLnNwb3RDdXRPZmYgICAgICAgICAgID0gbnVsbDtcblxuICAgIHRoaXMuY29uc3RhbnRBdHRlbnR1YXRpb24gPSAxLjA7XG4gICAgdGhpcy5saW5lYXJBdHRlbnR1YXRpb24gICA9IDA7XG4gICAgdGhpcy5xdWFkcmljQXR0ZW50dWF0aW9uICA9IDAuMDE7XG59XG5cblxuTGlnaHQucHJvdG90eXBlLnNldEFtYmllbnQgICAgID0gZnVuY3Rpb24oY29sb3IpICB7dGhpcy5hbWJpZW50WzBdID0gY29sb3JbMF07dGhpcy5hbWJpZW50WzFdID0gY29sb3JbMV07dGhpcy5hbWJpZW50WzJdID0gY29sb3JbMl07fTtcbkxpZ2h0LnByb3RvdHlwZS5zZXRBbWJpZW50M2YgICA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuYW1iaWVudFswXSA9IHI7dGhpcy5hbWJpZW50WzFdID0gZzt0aGlzLmFtYmllbnRbMl0gPSBiO307XG5cbkxpZ2h0LnByb3RvdHlwZS5zZXREaWZmdXNlICAgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuZGlmZnVzZVswXSA9IGNvbG9yWzBdO3RoaXMuZGlmZnVzZVsxXSA9IGNvbG9yWzFdO3RoaXMuZGlmZnVzZVsyXSA9IGNvbG9yWzJdO307XG5MaWdodC5wcm90b3R5cGUuc2V0RGlmZnVzZTNmICAgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLmRpZmZ1c2VbMF0gPSByO3RoaXMuZGlmZnVzZVsxXSA9IGc7dGhpcy5kaWZmdXNlWzJdID0gYjt9O1xuXG5MaWdodC5wcm90b3R5cGUuc2V0U3BlY3VsYXIgICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLnNwZWN1bGFyWzBdID0gY29sb3JbMF07dGhpcy5zcGVjdWxhclsxXSA9IGNvbG9yWzFdO3RoaXMuc3BlY3VsYXJbMl0gPSBjb2xvclsyXTt9O1xuTGlnaHQucHJvdG90eXBlLnNldFNwZWN1bGFyM2YgID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5zcGVjdWxhclswXSA9IHI7dGhpcy5zcGVjdWxhclsxXSA9IGc7dGhpcy5zcGVjdWxhclsyXSA9IGI7fTtcblxuTGlnaHQucHJvdG90eXBlLnNldFBvc2l0aW9uICAgID0gZnVuY3Rpb24odikgICAge1ZlYzQuc2V0M2YodGhpcy5wb3NpdGlvbix2WzBdLHZbMV0sdlsyXSk7fTtcbkxpZ2h0LnByb3RvdHlwZS5zZXRQb3NpdGlvbjNmICA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMucG9zaXRpb24seCx5LHopO307XG5cbkxpZ2h0LnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2lkO307XG5cbm1vZHVsZS5leHBvcnRzID0gTGlnaHQ7IiwidmFyIE1hdDQ0ID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9nbGtNYXQ0NCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgcGVyc3BlY3RpdmUgOiBmdW5jdGlvbihtLGZvdixhc3BlY3QsbmVhcixmYXIpXG4gICAge1xuICAgICAgICB2YXIgZiAgPSAxLjAgLyBNYXRoLnRhbihmb3YqMC41KSxcbiAgICAgICAgICAgIG5mID0gMS4wIC8gKG5lYXItZmFyKTtcblxuICAgICAgICBtWzBdID0gZiAvIGFzcGVjdDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSBmO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAtMTtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gKDIgKiBmYXIgKiBuZWFyKSAqIG5mO1xuICAgICAgICBtWzE1XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG5cbiAgICB9LFxuXG4gICAgZnJ1c3R1bSA6IGZ1bmN0aW9uKG0sbGVmdCxyaWdodCxib3R0b20sdG9wLG5lYXIsZmFyKVxuICAgIHtcbiAgICAgICAgdmFyIHJsID0gMSAvIChyaWdodCAtIGxlZnQpLFxuICAgICAgICAgICAgdGIgPSAxIC8gKHRvcCAtIGJvdHRvbSksXG4gICAgICAgICAgICBuZiA9IDEgLyAobmVhciAtIGZhcik7XG5cblxuICAgICAgICBtWyAwXSA9IChuZWFyICogMikgKiBybDtcbiAgICAgICAgbVsgMV0gPSAwO1xuICAgICAgICBtWyAyXSA9IDA7XG4gICAgICAgIG1bIDNdID0gMDtcbiAgICAgICAgbVsgNF0gPSAwO1xuICAgICAgICBtWyA1XSA9IChuZWFyICogMikgKiB0YjtcbiAgICAgICAgbVsgNl0gPSAwO1xuICAgICAgICBtWyA3XSA9IDA7XG4gICAgICAgIG1bIDhdID0gKHJpZ2h0ICsgbGVmdCkgKiBybDtcbiAgICAgICAgbVsgOV0gPSAodG9wICsgYm90dG9tKSAqIHRiO1xuICAgICAgICBtWzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgICBtWzExXSA9IC0xO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAoZmFyICogbmVhciAqIDIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMDtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbG9va0F0IDogZnVuY3Rpb24obSxleWUsdGFyZ2V0LHVwKVxuICAgIHtcbiAgICAgICAgdmFyIHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGxlbixcbiAgICAgICAgICAgIGV5ZXggPSBleWVbMF0sXG4gICAgICAgICAgICBleWV5ID0gZXllWzFdLFxuICAgICAgICAgICAgZXlleiA9IGV5ZVsyXSxcbiAgICAgICAgICAgIHVweCA9IHVwWzBdLFxuICAgICAgICAgICAgdXB5ID0gdXBbMV0sXG4gICAgICAgICAgICB1cHogPSB1cFsyXSxcbiAgICAgICAgICAgIHRhcmdldHggPSB0YXJnZXRbMF0sXG4gICAgICAgICAgICB0YXJ0ZXR5ID0gdGFyZ2V0WzFdLFxuICAgICAgICAgICAgdGFyZ2V0eiA9IHRhcmdldFsyXTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoZXlleCAtIHRhcmdldHgpIDwgMC4wMDAwMDEgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGV5ZXkgLSB0YXJ0ZXR5KSA8IDAuMDAwMDAxICYmXG4gICAgICAgICAgICBNYXRoLmFicyhleWV6IC0gdGFyZ2V0eikgPCAwLjAwMDAwMSkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdDQ0LmlkZW50aXR5KG0pO1xuICAgICAgICB9XG5cbiAgICAgICAgejAgPSBleWV4IC0gdGFyZ2V0eDtcbiAgICAgICAgejEgPSBleWV5IC0gdGFydGV0eTtcbiAgICAgICAgejIgPSBleWV6IC0gdGFyZ2V0ejtcblxuICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XG4gICAgICAgIHowICo9IGxlbjtcbiAgICAgICAgejEgKj0gbGVuO1xuICAgICAgICB6MiAqPSBsZW47XG5cbiAgICAgICAgeDAgPSB1cHkgKiB6MiAtIHVweiAqIHoxO1xuICAgICAgICB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XG4gICAgICAgIHgyID0gdXB4ICogejEgLSB1cHkgKiB6MDtcbiAgICAgICAgbGVuID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XG4gICAgICAgIGlmICghbGVuKSB7XG4gICAgICAgICAgICB4MCA9IDA7XG4gICAgICAgICAgICB4MSA9IDA7XG4gICAgICAgICAgICB4MiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICAgICAgeDEgKj0gbGVuO1xuICAgICAgICAgICAgeDIgKj0gbGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgeTAgPSB6MSAqIHgyIC0gejIgKiB4MTtcbiAgICAgICAgeTEgPSB6MiAqIHgwIC0gejAgKiB4MjtcbiAgICAgICAgeTIgPSB6MCAqIHgxIC0gejEgKiB4MDtcblxuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeTAgKiB5MCArIHkxICogeTEgKyB5MiAqIHkyKTtcbiAgICAgICAgaWYgKCFsZW4pIHtcbiAgICAgICAgICAgIHkwID0gMDtcbiAgICAgICAgICAgIHkxID0gMDtcbiAgICAgICAgICAgIHkyID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgICAgICB5MCAqPSBsZW47XG4gICAgICAgICAgICB5MSAqPSBsZW47XG4gICAgICAgICAgICB5MiAqPSBsZW47XG4gICAgICAgIH1cblxuICAgICAgICBtWyAwXSA9IHgwO1xuICAgICAgICBtWyAxXSA9IHkwO1xuICAgICAgICBtWyAyXSA9IHowO1xuICAgICAgICBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDRdID0geDE7XG4gICAgICAgIG1bIDVdID0geTE7XG4gICAgICAgIG1bIDZdID0gejE7XG4gICAgICAgIG1bIDddID0gMDtcbiAgICAgICAgbVsgOF0gPSB4MjtcbiAgICAgICAgbVsgOV0gPSB5MjtcbiAgICAgICAgbVsxMF0gPSB6MjtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KTtcbiAgICAgICAgbVsxM10gPSAtKHkwICogZXlleCArIHkxICogZXlleSArIHkyICogZXlleik7XG4gICAgICAgIG1bMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxufTsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2dsa0NvbG9yJyk7XG5cbmZ1bmN0aW9uIE1hdGVyaWFsKGFtYmllbnQsZGlmZnVzZSxzcGVjdWxhcixzaGluaW5lc3MsZW1pc3Npb24pXG57XG4gICAgYW1iaWVudCAgID0gYW1iaWVudCAgIHx8IENvbG9yLm1ha2UoMS4wLDAuNSwwLjUsMS4wKTtcbiAgICBkaWZmdXNlICAgPSBkaWZmdXNlICAgfHwgQ29sb3IuQkxBQ0soKTtcbiAgICBzcGVjdWxhciAgPSBzcGVjdWxhciAgfHwgQ29sb3IuQkxBQ0soKTtcbiAgICBzaGluaW5lc3MgPSBzaGluaW5lc3MgfHwgMTAuMDtcbiAgICBlbWlzc2lvbiAgPSBlbWlzc2lvbiAgfHwgQ29sb3IuQkxBQ0s7XG5cbiAgICB0aGlzLmVtaXNzaW9uICA9IGVtaXNzaW9uO1xuICAgIHRoaXMuYW1iaWVudCAgID0gYW1iaWVudDtcbiAgICB0aGlzLmRpZmZ1c2UgICA9IGRpZmZ1c2U7XG4gICAgdGhpcy5zcGVjdWxhciAgPSBzcGVjdWxhcjtcbiAgICB0aGlzLnNoaW5pbmVzcyA9IHNoaW5pbmVzcztcbn1cblxuTWF0ZXJpYWwucHJvdG90eXBlLnNldEVtaXNzaW9uICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLmVtaXNzaW9uID0gY29sb3I7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRFbWlzc2lvbjNmID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5lbWlzc2lvblswXSA9IHI7dGhpcy5lbWlzc2lvblsxXSA9IGc7dGhpcy5lbWlzc2lvblsyXSA9IGI7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRFbWlzc2lvbjRmID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5lbWlzc2lvblswXSA9IHI7dGhpcy5lbWlzc2lvblsxXSA9IGc7dGhpcy5lbWlzc2lvblsyXSA9IGI7dGhpcy5lbWlzc2lvblszXSA9IGE7fTtcblxuTWF0ZXJpYWwucHJvdG90eXBlLnNldEFtYmllbnQgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuYW1iaWVudCA9IGNvbG9yO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0QW1iaWVudDNmID0gZnVuY3Rpb24ocixnLGIpICB7dGhpcy5hbWJpZW50WzBdID0gcjt0aGlzLmFtYmllbnRbMV0gPSBnO3RoaXMuYW1iaWVudFsyXSA9IGI7fTtcbk1hdGVyaWFsLnByb3RvdHlwZS5zZXRBbWJpZW50NGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLmFtYmllbnRbMF0gPSByO3RoaXMuYW1iaWVudFsxXSA9IGc7dGhpcy5hbWJpZW50WzJdID0gYjt0aGlzLmFtYmllbnRbM10gPSBhO307XG5cbk1hdGVyaWFsLnByb3RvdHlwZS5zZXREaWZmdXNlICAgPSBmdW5jdGlvbihjb2xvcikgIHt0aGlzLmRpZmZ1c2UgPSBjb2xvcjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldERpZmZ1c2UzZiA9IGZ1bmN0aW9uKHIsZyxiKSAge3RoaXMuZGlmZnVzZVswXSA9IHI7dGhpcy5kaWZmdXNlWzFdID0gZzt0aGlzLmRpZmZ1c2VbMl0gPSBiO307XG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0RGlmZnVzZTRmID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5kaWZmdXNlWzBdID0gcjt0aGlzLmRpZmZ1c2VbMV0gPSBnO3RoaXMuZGlmZnVzZVsyXSA9IGI7dGhpcy5kaWZmdXNlWzNdID0gYTt9O1xuXG5NYXRlcmlhbC5wcm90b3R5cGUuc2V0U3BlY3VsYXIgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuc3BlY3VsYXIgPSBjb2xvcjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldFNwZWN1bGFyM2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLnNwZWN1bGFyWzBdID0gcjt0aGlzLnNwZWN1bGFyWzFdID0gZzt0aGlzLnNwZWN1bGFyWzJdID0gYjt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLnNldFNwZWN1bGFyNGYgPSBmdW5jdGlvbihyLGcsYixhKXt0aGlzLnNwZWN1bGFyWzBdID0gcjt0aGlzLnNwZWN1bGFyWzFdID0gZzt0aGlzLnNwZWN1bGFyWzJdID0gYjt0aGlzLnNwZWN1bGFyWzNdID0gYTt9O1xuXG5cbk1hdGVyaWFsLnByb3RvdHlwZS5nZXRFbWlzc2lvbiAgPSBmdW5jdGlvbigpe3JldHVybiBDb2xvci5jb3B5KHRoaXMuZW1pc3Npb24pO307XG5NYXRlcmlhbC5wcm90b3R5cGUuZ2V0QW1iaWVudCAgID0gZnVuY3Rpb24oKXtyZXR1cm4gQ29sb3IuY29weSh0aGlzLmFtYmllbnQpO307XG5NYXRlcmlhbC5wcm90b3R5cGUuZ2V0RGlmZnVzZSAgID0gZnVuY3Rpb24oKXtyZXR1cm4gQ29sb3IuY29weSh0aGlzLmRpZmZ1c2UpO307XG5NYXRlcmlhbC5wcm90b3R5cGUuZ2V0U3BlY3VsYXIgID0gZnVuY3Rpb24oKXtyZXR1cm4gQ29sb3IuY29weSh0aGlzLnNwZWN1bGFyKTt9O1xuTWF0ZXJpYWwucHJvdG90eXBlLmdldFNoaW5pbmVzcyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2hpbmluZXNzO307XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7XG4iLCJ2YXIgTGlnaHQgPSByZXF1aXJlKCcuL2dsa0xpZ2h0Jyk7XG5cbmZ1bmN0aW9uIFBvaW50TGlnaHQoaWQpXG57XG4gICAgTGlnaHQuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xufVxuXG5Qb2ludExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTGlnaHQucHJvdG90eXBlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludExpZ2h0OyIsInZhciBEaXJlY3Rpb25hbExpZ2h0ID0gcmVxdWlyZSgnLi9nbGtEaXJlY3Rpb25hbExpZ2h0Jyk7XG5cbmZ1bmN0aW9uIFNwb3RMaWdodChpZClcbntcbiAgICBEaXJlY3Rpb25hbExpZ2h0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcbn1cblxuU3BvdExpZ2h0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGlyZWN0aW9uYWxMaWdodC5wcm90b3R5cGUpO1xuXG5TcG90TGlnaHQucHJvdG90eXBlLnNldEV4cG9uZW50ID0gZnVuY3Rpb24oKXt9O1xuU3BvdExpZ2h0LnByb3RvdHlwZS5zZXRDdXRPZmYgICA9IGZ1bmN0aW9uKCl7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcG90TGlnaHQ7IiwiXG5mdW5jdGlvbiBUZXh0dXJlKClcbntcbiAgICB0aGlzLl90ZXggPSBudWxsO1xuICAgIHRoaXMuX3dpZHRoID0gbnVsbDtcbiAgICB0aGlzLl9oZWlnaHQgPSBudWxsO1xuXG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAxKXRoaXMuc2V0VGV4U291cmNlKGFyZ3VtZW50c1swXSk7XG59XG5cblRleHR1cmUucHJvdG90eXBlLnNldFRleFNvdXJjZSA9IGZ1bmN0aW9uKGdsVGV4KVxue1xuICAgIHZhciB0ZXggPSB0aGlzLl90ZXggPSBnbFRleDtcbiAgICB0aGlzLl93aWR0aCAgPSB0ZXguaW1hZ2Uud2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gdGV4LmltYWdlLmhlaWdodDtcbn07XG5cblRleHR1cmUucHJvdG90eXBlLmdldFdpZHRoICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dpZHRoO307XG5UZXh0dXJlLnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9oZWlnaHQ7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlOyIsIm1vZHVsZS5leHBvcnRzID1cInZhcnlpbmcgdmVjNCB2VmVydGV4UG9zaXRpb247dmFyeWluZyB2ZWMzIHZWZXJ0ZXhOb3JtYWw7dmFyeWluZyB2ZWM0IHZWZXJ0ZXhDb2xvcjt2YXJ5aW5nIHZlYzIgdlZlcnRleFRleENvb3JkO3VuaWZvcm0gZmxvYXQgdVVzZUxpZ2h0aW5nO3VuaWZvcm0gZmxvYXQgdVVzZU1hdGVyaWFsO3VuaWZvcm0gZmxvYXQgdVVzZVRleHR1cmU7dW5pZm9ybSBtYXQzIHVOb3JtYWxNYXRyaXg7dW5pZm9ybSB2ZWMzIHVBbWJpZW50O3VuaWZvcm0gc2FtcGxlcjJEIHVUZXhJbWFnZTtjb25zdCBpbnQgTUFYX0xJR0hUUyA9IDg7c3RydWN0IExpZ2h0eyB2ZWM0IHBvc2l0aW9uOyB2ZWMzIGFtYmllbnQ7IHZlYzMgZGlmZnVzZTsgdmVjMyBzcGVjdWxhcjsgdmVjNCBoYWxmVmVjdG9yOyB2ZWMzIHNwb3REaXJlY3Rpb247IGZsb2F0IHNwb3RFeHBvbmVudDsgZmxvYXQgc3BvdEN1dG9mZjsgZmxvYXQgc3BvdENvc0N1dG9mZjsgZmxvYXQgY29uc3RhbnRBdHRlbnVhdGlvbjsgZmxvYXQgbGluZWFyQXR0ZW51YXRpb247IGZsb2F0IHF1YWRyYXRpY0F0dGVudWF0aW9uO307c3RydWN0IE1hdGVyaWFseyB2ZWM0IGVtaXNzaW9uOyB2ZWM0IGFtYmllbnQ7IHZlYzQgZGlmZnVzZTsgdmVjNCBzcGVjdWxhcjsgZmxvYXQgc2hpbmluZXNzO307c3RydWN0IENvbG9yQ29tcG9uZW50eyB2ZWM0IGFtYmllbnQ7IHZlYzQgZGlmZnVzZTsgdmVjNCBzcGVjdWxhcjsgZmxvYXQgc2hpbmluZXNzO307dmVjNCBwaG9uZ01vZGVsKHZlYzQgcG9zaXRpb24sIHZlYzMgbm9ybWFsLCBDb2xvckNvbXBvbmVudCBjb2xvciwgTGlnaHQgbGlnaHQpeyB2ZWMzIGRpZmYgPSBsaWdodC5wb3NpdGlvbi54eXogLSBwb3NpdGlvbi54eXo7IHZlYzMgcyA9IG5vcm1hbGl6ZShkaWZmKTsgdmVjMyB2ID0gbm9ybWFsaXplKC1wb3NpdGlvbi54eXopOyB2ZWMzIHIgPSByZWZsZWN0KC1zLCBub3JtYWwpOyBmbG9hdCBzRG90TiA9IG1heChkb3Qocywgbm9ybWFsKSwgMC4wKTsgZmxvYXQgZGlzdCA9IGxlbmd0aChkaWZmLnh5eik7IGZsb2F0IGF0dCA9IDEuMCAvIChsaWdodC5jb25zdGFudEF0dGVudWF0aW9uICsgbGlnaHQubGluZWFyQXR0ZW51YXRpb24gKiBkaXN0ICsgbGlnaHQucXVhZHJhdGljQXR0ZW51YXRpb24gKiBkaXN0ICogZGlzdCk7IHZlYzMgYW1iaWVudCA9IHVBbWJpZW50ICogbGlnaHQuYW1iaWVudCAqIGNvbG9yLmFtYmllbnQucmdiOyB2ZWMzIGRpZmZ1c2UgPSBsaWdodC5kaWZmdXNlICogY29sb3IuZGlmZnVzZS5yZ2IgKiBzRG90TiA7IHZlYzMgc3BlY3VsYXIgPSAoKHNEb3ROID4gMC4wKSA/IGxpZ2h0LnNwZWN1bGFyICogcG93KG1heChkb3QociwgdiksIDAuMCksIGNvbG9yLnNoaW5pbmVzcykgOiB2ZWMzKDAuMCkpOyByZXR1cm4gdmVjNChhbWJpZW50KmF0dCsgZGlmZnVzZSphdHQgKyBzcGVjdWxhciphdHQsY29sb3IuYW1iaWVudC5hKTt9dW5pZm9ybSBMaWdodCB1TGlnaHRzWzhdO3VuaWZvcm0gTWF0ZXJpYWwgdU1hdGVyaWFsO3ZvaWQgbWFpbih2b2lkKXsgZmxvYXQgdXNlTGlnaHRpbmdJbnYgPSAxLjAgLSB1VXNlTGlnaHRpbmc7IGZsb2F0IHVzZU1hdGVyaWFsSW52ID0gMS4wIC0gdVVzZU1hdGVyaWFsOyBmbG9hdCB1c2VUZXh0dXJlSW52ID0gMS4wIC0gdVVzZVRleHR1cmU7IHZlYzMgdFZlcnRleE5vcm1hbCA9IChnbF9Gcm9udEZhY2luZyA/IC0xLjAgOiAxLjApICogbm9ybWFsaXplKHVOb3JtYWxNYXRyaXggKiB2VmVydGV4Tm9ybWFsKTsgdmVjNCB2ZXJ0ZXhDb2xvciA9IHZWZXJ0ZXhDb2xvciAqIHVzZU1hdGVyaWFsSW52OyB2ZWM0IHRleHR1cmVDb2xvciA9IHRleHR1cmUyRCh1VGV4SW1hZ2UsdlZlcnRleFRleENvb3JkKTsgdmVjNCByZXN1bHRDb2xvciA9IHZlcnRleENvbG9yICogdXNlVGV4dHVyZUludiArIHRleHR1cmVDb2xvciAqIHVVc2VUZXh0dXJlOyBDb2xvckNvbXBvbmVudCBjb2xvciA9IENvbG9yQ29tcG9uZW50KHVNYXRlcmlhbC5hbWJpZW50ICogdVVzZU1hdGVyaWFsICsgcmVzdWx0Q29sb3IsIHVNYXRlcmlhbC5kaWZmdXNlICogdVVzZU1hdGVyaWFsICsgcmVzdWx0Q29sb3IsIHVNYXRlcmlhbC5zcGVjdWxhciAqIHVVc2VNYXRlcmlhbCArIHJlc3VsdENvbG9yLCB1TWF0ZXJpYWwuc2hpbmluZXNzICogdVVzZU1hdGVyaWFsICsgdXNlTWF0ZXJpYWxJbnYpOyB2ZWM0IGxpZ2h0aW5nQ29sb3IgPSB2ZWM0KDAsMCwwLDApOyBmb3IoaW50IGkgPSAwO2kgPCBNQVhfTElHSFRTO2krKykgeyBsaWdodGluZ0NvbG9yKz1waG9uZ01vZGVsKHZWZXJ0ZXhQb3NpdGlvbix0VmVydGV4Tm9ybWFsLGNvbG9yLHVMaWdodHNbaV0pOyB9IGdsX0ZyYWdDb2xvciA9IHVVc2VMaWdodGluZyAqIGxpZ2h0aW5nQ29sb3IgKyB1c2VMaWdodGluZ0ludiAqICh2VmVydGV4Q29sb3IgKiB1c2VUZXh0dXJlSW52ICsgdGV4dHVyZUNvbG9yICogdVVzZVRleHR1cmUpO31cIjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgbG9hZFByb2dyYW0gOiBmdW5jdGlvbihnbCx2ZXJ0ZXhTaGFkZXIsZnJhZ21lbnRTaGFkZXIpXG4gICAge1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSx2ZXJ0ZXhTaGFkZXIpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSxmcmFnbWVudFNoYWRlcik7XG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sZ2wuTElOS19TVEFUVVMpKVxuICAgICAgICB7XG4gICAgICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICAgICAgcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvZ3JhbTtcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID1cImF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjthdHRyaWJ1dGUgdmVjMyBhVmVydGV4Tm9ybWFsO2F0dHJpYnV0ZSB2ZWM0IGFWZXJ0ZXhDb2xvcjthdHRyaWJ1dGUgdmVjMiBhVmVydGV4VGV4Q29vcmQ7dmFyeWluZyB2ZWM0IHZWZXJ0ZXhQb3NpdGlvbjt2YXJ5aW5nIHZlYzMgdlZlcnRleE5vcm1hbDt2YXJ5aW5nIHZlYzQgdlZlcnRleENvbG9yO3ZhcnlpbmcgdmVjMiB2VmVydGV4VGV4Q29vcmQ7dW5pZm9ybSBtYXQ0IHVNb2RlbFZpZXdNYXRyaXg7dW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O3VuaWZvcm0gZmxvYXQgdVBvaW50U2l6ZTt2b2lkIG1haW4odm9pZCl7IHZWZXJ0ZXhQb3NpdGlvbiA9IHVNb2RlbFZpZXdNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgdlZlcnRleE5vcm1hbCA9IGFWZXJ0ZXhOb3JtYWw7IHZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvcjsgdlZlcnRleFRleENvb3JkID0gYVZlcnRleFRleENvb3JkOyBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdlZlcnRleFBvc2l0aW9uOyBnbF9Qb2ludFNpemUgPSB1UG9pbnRTaXplO31cIjsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgUHJlZml4U2hhZGVyV2ViIDogJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycsXG5cbiAgICBsb2FkU2hhZGVyRnJvbVN0cmluZyA6IGZ1bmN0aW9uKGdsLHNvdXJjZVN0cmluZyx0eXBlKVxuICAgIHtcbiAgICAgICAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcblxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLHNvdXJjZVN0cmluZyk7XG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAgICAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlcixnbC5DT01QSUxFX1NUQVRVUykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaGFkZXI7XG4gICAgfVxuXG5cbn07IiwidmFyIFZlYzMgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgTWF0NDQgPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdDQ0JyksXG4gICAgTWF0R0wgPSByZXF1aXJlKCcuL2dsL2dsa01hdEdMJyk7XG5cbmZ1bmN0aW9uIENhbWVyYUJhc2ljKClcbntcbiAgICB0aGlzLnBvc2l0aW9uID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fdGFyZ2V0ICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX3VwICAgICAgPSBWZWMzLkFYSVNfWSgpO1xuXG4gICAgdGhpcy5fZm92ICA9IDA7XG4gICAgdGhpcy5fbmVhciA9IDA7XG4gICAgdGhpcy5fZmFyICA9IDA7XG5cbiAgICB0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSAwO1xuXG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCAgPSBmYWxzZTtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4ID0gTWF0NDQubWFrZSgpO1xuICAgIHRoaXMubW9kZWxWaWV3TWF0cml4ICA9IE1hdDQ0Lm1ha2UoKTtcbn1cblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24oZm92LHdpbmRvd0FzcGVjdFJhdGlvLG5lYXIsZmFyKVxue1xuICAgIHRoaXMuX2ZvdiAgPSBmb3Y7XG4gICAgdGhpcy5fbmVhciA9IG5lYXI7XG4gICAgdGhpcy5fZmFyICA9IGZhcjtcblxuICAgIHRoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IHdpbmRvd0FzcGVjdFJhdGlvO1xuXG4gICAgdGhpcy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG59O1xuXG5cblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFRhcmdldCAgICAgICAgID0gZnVuY3Rpb24odikgICAge1ZlYzMuc2V0KHRoaXMuX3RhcmdldCx2KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRUYXJnZXQzZiAgICAgICA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMuX3RhcmdldCx4LHkseik7dGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5DYW1lcmFCYXNpYy5wcm90b3R5cGUuc2V0UG9zaXRpb24gICAgICAgPSBmdW5jdGlvbih2KSAgICB7VmVjMy5zZXQodGhpcy5wb3NpdGlvbix2KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRQb3NpdGlvbjNmICAgICA9IGZ1bmN0aW9uKHgseSx6KXtWZWMzLnNldDNmKHRoaXMucG9zaXRpb24seCx5LHopO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFVwICAgICAgICAgICAgID0gZnVuY3Rpb24odikgICAge1ZlYzMuc2V0KHRoaXMuX3VwLHYpO3RoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTt9O1xuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldFVwM2YgICAgICAgICAgID0gZnVuY3Rpb24oeCx5LHopeyBWZWMzLnNldDNmKHRoaXMuX3VwLHgseSx6KTt0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnNldE5lYXIgICAgICAgICAgID0gZnVuY3Rpb24obmVhcikgICAgICAge3RoaXMuX25lYXIgPSBuZWFyO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRGYXIgICAgICAgICAgICA9IGZ1bmN0aW9uKGZhcikgICAgICAgIHt0aGlzLl9mYXIgID0gZmFyO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRGb3YgICAgICAgICAgICA9IGZ1bmN0aW9uKGZvdikgICAgICAgIHt0aGlzLl9mb3YgID0gZm92O3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS5zZXRBc3BlY3RSYXRpbyAgICA9IGZ1bmN0aW9uKGFzcGVjdFJhdGlvKXt0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSBhc3BlY3RSYXRpbzt0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO307XG5cbkNhbWVyYUJhc2ljLnByb3RvdHlwZS51cGRhdGVNb2RlbFZpZXdNYXRyaXggICA9IGZ1bmN0aW9uKCl7aWYodGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZClyZXR1cm47TWF0R0wubG9va0F0KHRoaXMubW9kZWxWaWV3TWF0cml4LHRoaXMucG9zaXRpb24sdGhpcy5fdGFyZ2V0LHRoaXMuX3VwKTsgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IHRydWU7fTtcbkNhbWVyYUJhc2ljLnByb3RvdHlwZS51cGRhdGVQcm9qZWN0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtpZih0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZClyZXR1cm47TWF0R0wucGVyc3BlY3RpdmUodGhpcy5wcm9qZWN0aW9uTWF0cml4LHRoaXMuX2Zvdix0aGlzLl9hc3BlY3RSYXRpb0xhc3QsdGhpcy5fbmVhcix0aGlzLl9mYXIpO3RoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gdHJ1ZTt9O1xuXG5DYW1lcmFCYXNpYy5wcm90b3R5cGUudXBkYXRlTWF0cmljZXMgPSBmdW5jdGlvbigpe3RoaXMudXBkYXRlTW9kZWxWaWV3TWF0cml4KCk7dGhpcy51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7fTtcblxuQ2FtZXJhQmFzaWMucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKXtyZXR1cm4gJ3twb3NpdGlvbj0gJyArIFZlYzMudG9TdHJpbmcodGhpcy5wb3NpdGlvbikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLCB0YXJnZXQ9ICcgKyBWZWMzLnRvU3RyaW5nKHRoaXMuX3RhcmdldCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLCB1cD0gJyAgICAgKyBWZWMzLnRvU3RyaW5nKHRoaXMuX3VwKSArICd9J307XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhQmFzaWM7XG5cblxuIiwidmFyIGtFcnJvciAgICAgICAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrRXJyb3InKSxcbiAgICBQcm9nVmVydGV4U2hhZGVyID0gcmVxdWlyZSgnLi9nbC9zaGFkZXIvZ2xrUHJvZ1ZlcnRleFNoYWRlcicpLFxuICAgIFByb2dGcmFnU2hhZGVyICAgPSByZXF1aXJlKCcuL2dsL3NoYWRlci9nbGtQcm9nRnJhZ1NoYWRlcicpLFxuICAgIFByb2dMb2FkZXIgICAgICAgPSByZXF1aXJlKCcuL2dsL3NoYWRlci9nbGtQcm9nTG9hZGVyJyksXG4gICAgU2hhZGVyTG9hZGVyICAgICA9IHJlcXVpcmUoJy4vZ2wvc2hhZGVyL2dsa1NoYWRlckxvYWRlcicpLFxuICAgIFBsYXRmb3JtICAgICAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vZ2xrUGxhdGZvcm0nKSxcbiAgICBWZWMyICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtWZWMyJyksXG4gICAgVmVjMyAgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMycpLFxuICAgIFZlYzQgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa1ZlYzQnKSxcbiAgICBNYXQzMyAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vbWF0aC9nbGtNYXQzMycpLFxuICAgIE1hdDQ0ICAgICAgICAgICAgPSByZXF1aXJlKCcuLi9tYXRoL2dsa01hdDQ0JyksXG4gICAgQ29sb3IgICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZ2xrQ29sb3InKSxcbiAgICBUZXh0dXJlICAgICAgICAgID0gcmVxdWlyZSgnLi9nbC9nbGtUZXh0dXJlJyk7XG5cblxuZnVuY3Rpb24gS0dMKGNvbnRleHQzZCxjb250ZXh0MmQpXG57XG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEluaXRcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB2YXIgZ2wgPSB0aGlzLmdsID0gY29udGV4dDNkO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIGNyZWF0ZSBzaGFkZXJzL3Byb2dyYW0gKyBiaW5kXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLypcbiAgICB2YXIgcHJvZ1ZlcnRleFNoYWRlciA9IFNoYWRlckxvYWRlci5sb2FkU2hhZGVyRnJvbVN0cmluZyhnbCwgUHJvZ1ZlcnRleFNoYWRlciwgZ2wuVkVSVEVYX1NIQURFUiksXG4gICAgICAgIHByb2dGcmFnU2hhZGVyICAgPSBTaGFkZXJMb2FkZXIubG9hZFNoYWRlckZyb21TdHJpbmcoZ2wsICgoUGxhdGZvcm0uZ2V0VGFyZ2V0KCkgPT0gUGxhdGZvcm0uV0VCKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaGFkZXJMb2FkZXIuUHJlZml4U2hhZGVyV2ViIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb2dGcmFnU2hhZGVyLCBnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG5cblxuICAgIHZhciBwcm9ncmFtU2NlbmUgPSAgUHJvZ0xvYWRlci5sb2FkUHJvZ3JhbShnbCxwcm9nVmVydGV4U2hhZGVyLHByb2dGcmFnU2hhZGVyKTtcbiAgICAqL1xuXG5cblxuICAgIHZhciBwbGF0Zm9ybSA9IFBsYXRmb3JtLmdldFRhcmdldCgpO1xuXG4gICAgdmFyIHByb2dyYW1TY2VuZSA9IHRoaXMuX3Byb2dyYW1TY2VuZSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgIHZhciBwcm9nVmVydFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKSxcbiAgICAgICAgcHJvZ0ZyYWdTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIGdsLnNoYWRlclNvdXJjZShwcm9nVmVydFNoYWRlciwgUHJvZ1ZlcnRleFNoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihwcm9nVmVydFNoYWRlcik7XG5cbiAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHByb2dWZXJ0U2hhZGVyLGdsLkNPTVBJTEVfU1RBVFVTKSlcbiAgICAgICAgdGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhwcm9nVmVydFNoYWRlcik7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UocHJvZ0ZyYWdTaGFkZXIsICgocGxhdGZvcm0gPT0gUGxhdGZvcm0uV0VCKSA/IFNoYWRlckxvYWRlci5QcmVmaXhTaGFkZXJXZWIgOiAnJykgKyBQcm9nRnJhZ1NoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihwcm9nRnJhZ1NoYWRlcik7XG5cbiAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHByb2dGcmFnU2hhZGVyLGdsLkNPTVBJTEVfU1RBVFVTKSlcbiAgICAgICAgdGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhwcm9nRnJhZ1NoYWRlcik7XG5cbiAgICBnbC5iaW5kQXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLDAsJ2FWZXJ0ZXhQb3NpdGlvbicpO1xuXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1TY2VuZSwgcHJvZ1ZlcnRTaGFkZXIpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtU2NlbmUsIHByb2dGcmFnU2hhZGVyKTtcbiAgICBnbC5saW5rUHJvZ3JhbSggcHJvZ3JhbVNjZW5lKTtcblxuICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW1TY2VuZSxnbC5MSU5LX1NUQVRVUykpXG4gICAgICAgIHRocm93IGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW1TY2VuZSk7XG5cbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW1TY2VuZSk7XG5cblxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEJpbmQgJiBlbmFibGUgc2hhZGVyIGF0dHJpYnV0ZXMgJiB1bmlmb3Jtc1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4gICAgdGhpcy5fYVZlcnRleFBvc2l0aW9uICAgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtU2NlbmUsJ2FWZXJ0ZXhQb3NpdGlvbicpO1xuICAgIHRoaXMuX2FWZXJ0ZXhOb3JtYWwgICAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCdhVmVydGV4Tm9ybWFsJyk7XG4gICAgdGhpcy5fYVZlcnRleENvbG9yICAgICAgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtU2NlbmUsJ2FWZXJ0ZXhDb2xvcicpO1xuICAgIHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCAgID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCdhVmVydGV4VGV4Q29vcmQnKTtcblxuICAgIHRoaXMuX3VNb2RlbFZpZXdNYXRyaXggID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1vZGVsVmlld01hdHJpeCcpO1xuICAgIHRoaXMuX3VQcm9qZWN0aW9uTWF0cml4ID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndVByb2plY3Rpb25NYXRyaXgnKTtcbiAgICB0aGlzLl91Tm9ybWFsTWF0cml4ICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VOb3JtYWxNYXRyaXgnKTtcbiAgICB0aGlzLl91VGV4SW1hZ2UgICAgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VUZXhJbWFnZScpO1xuXG4gICAgdGhpcy5fdVBvaW50U2l6ZSAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1UG9pbnRTaXplJyk7XG5cbiAgICB0aGlzLl91VXNlTGlnaHRpbmcgICAgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VVc2VMaWdodGluZycpO1xuICAgIHRoaXMuX3VVc2VNYXRlcmlhbCAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndVVzZU1hdGVyaWFsJyk7XG4gICAgdGhpcy5fdVVzZVRleHR1cmUgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1VXNlVGV4dHVyZScpO1xuXG4gICAgdGhpcy5fdUFtYmllbnQgICAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1QW1iaWVudCcpO1xuXG5cbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4UG9zaXRpb24pO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhDb2xvcik7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBTZXQgU2hhZGVyIGluaXRpYWwgdmFsdWVzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cbiAgICB0aGlzLkxJR0hUXzAgICAgPSAwO1xuICAgIHRoaXMuTElHSFRfMSAgICA9IDE7XG4gICAgdGhpcy5MSUdIVF8yICAgID0gMjtcbiAgICB0aGlzLkxJR0hUXzMgICAgPSAzO1xuICAgIHRoaXMuTElHSFRfNCAgICA9IDQ7XG4gICAgdGhpcy5MSUdIVF81ICAgID0gNTtcbiAgICB0aGlzLkxJR0hUXzYgICAgPSA2O1xuICAgIHRoaXMuTElHSFRfNyAgICA9IDc7XG4gICAgdGhpcy5NQVhfTElHSFRTID0gODtcblxuICAgIHRoaXMuTU9ERUxfUEhPTkcgICAgICAgPSAwO1xuICAgIHRoaXMuTU9ERUxfQU5USVNPUFRSSUMgPSAxO1xuICAgIHRoaXMuTU9ERUxfRlJFU05FTCAgICAgPSAyO1xuICAgIHRoaXMuTU9ERUxfQkxJTk4gICAgICAgPSAzO1xuICAgIHRoaXMuTU9ERUxfRkxBVCAgICAgICAgPSA0O1xuXG5cblxuXG4gICAgdmFyIGwgPSB0aGlzLk1BWF9MSUdIVFM7XG5cblxuXG4gICAgdmFyIHVMaWdodFBvc2l0aW9uICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0UG9zaXRpb24gICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEFtYmllbnQgICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0QW1iaWVudCAgICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodERpZmZ1c2UgICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0RGlmZnVzZSAgICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodFNwZWN1bGFyICAgICAgICAgICAgID0gdGhpcy5fdUxpZ2h0U3BlY3VsYXIgICAgICAgICAgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uQ29uc3RhbnQgID0gdGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25Db25zdGFudCAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uTGluZWFyICAgID0gdGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXIgICAgPSBuZXcgQXJyYXkobCksXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljID0gdGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWMgPSBuZXcgQXJyYXkobCk7XG5cbiAgICB2YXIgbGlnaHQ7XG5cbiAgICB2YXIgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IGwpXG4gICAge1xuICAgICAgICBsaWdodCA9ICd1TGlnaHRzWycraSsnXS4nO1xuXG5cbiAgICAgICAgdUxpZ2h0UG9zaXRpb25baV0gICAgICAgICAgICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLGxpZ2h0ICsgJ3Bvc2l0aW9uJyk7XG4gICAgICAgIHVMaWdodEFtYmllbnRbaV0gICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdhbWJpZW50Jyk7XG4gICAgICAgIHVMaWdodERpZmZ1c2VbaV0gICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdkaWZmdXNlJyk7XG4gICAgICAgIHVMaWdodFNwZWN1bGFyW2ldICAgICAgICAgICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdzcGVjdWxhcicpO1xuXG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaV0gID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdjb25zdGFudEF0dGVudWF0aW9uJyk7XG4gICAgICAgIHVMaWdodEF0dGVudWF0aW9uTGluZWFyW2ldICAgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSxsaWdodCArICdsaW5lYXJBdHRlbnVhdGlvbicpO1xuICAgICAgICB1TGlnaHRBdHRlbnVhdGlvblF1YWRyYXRpY1tpXSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsbGlnaHQgKyAncXVhZHJhdGljQXR0ZW51YXRpb24nKTtcblxuICAgICAgICBnbC51bmlmb3JtNGZ2KHVMaWdodFBvc2l0aW9uW2ldLCBuZXcgRmxvYXQzMkFycmF5KFswLDAsMCwwXSkpO1xuICAgICAgICBnbC51bmlmb3JtM2Z2KHVMaWdodEFtYmllbnRbaV0sICBuZXcgRmxvYXQzMkFycmF5KFswLDAsMF0pKTtcbiAgICAgICAgZ2wudW5pZm9ybTNmdih1TGlnaHREaWZmdXNlW2ldLCAgbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKSk7XG5cbiAgICAgICAgZ2wudW5pZm9ybTFmKHVMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaV0sIDEuMCk7XG4gICAgICAgIGdsLnVuaWZvcm0xZih1TGlnaHRBdHRlbnVhdGlvbkxpbmVhcltpXSwgICAwLjApO1xuICAgICAgICBnbC51bmlmb3JtMWYodUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWNbaV0sMC4wKTtcbiAgICB9XG5cbiAgICB0aGlzLl91TWF0ZXJpYWxFbWlzc2lvbiAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1TWF0ZXJpYWwuZW1pc3Npb24nKTtcbiAgICB0aGlzLl91TWF0ZXJpYWxBbWJpZW50ICAgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24ocHJvZ3JhbVNjZW5lLCd1TWF0ZXJpYWwuYW1iaWVudCcpO1xuICAgIHRoaXMuX3VNYXRlcmlhbERpZmZ1c2UgICA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtU2NlbmUsJ3VNYXRlcmlhbC5kaWZmdXNlJyk7XG4gICAgdGhpcy5fdU1hdGVyaWFsU3BlY3VsYXIgID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1hdGVyaWFsLnNwZWN1bGFyJyk7XG4gICAgdGhpcy5fdU1hdGVyaWFsU2hpbmluZXNzID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1TY2VuZSwndU1hdGVyaWFsLnNoaW5pbmVzcycpO1xuXG4gICAgZ2wudW5pZm9ybTRmKHRoaXMuX3VNYXRlcmlhbEVtaXNzaW9uLCAwLjAsMC4wLDAuMCwxLjApO1xuICAgIGdsLnVuaWZvcm00Zih0aGlzLl91TWF0ZXJpYWxBbWJpZW50LCAgMS4wLDAuNSwwLjUsMS4wKTtcbiAgICBnbC51bmlmb3JtNGYodGhpcy5fdU1hdGVyaWFsRGlmZnVzZSwgIDAuMCwwLjAsMC4wLDEuMCk7XG4gICAgZ2wudW5pZm9ybTRmKHRoaXMuX3VNYXRlcmlhbFNwZWN1bGFyLCAwLjAsMC4wLDAuMCwxLjApO1xuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91TWF0ZXJpYWxTaGluaW5lc3MsMTAuMCk7XG5cblxuICAgIHRoaXMuX3RlbXBMaWdodFBvcyA9IFZlYzQubWFrZSgpO1xuXG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VNYXRlcmlhbCwgMC4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdVVzZUxpZ2h0aW5nLCAwLjApO1xuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91VXNlTWF0ZXJpYWwsIDAuMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VQb2ludFNpemUsICAgMS4wKTtcblxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEJpbmQgY29uc3RhbnRzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5BQ1RJVkVfQVRUUklCVVRFUz0gMzU3MjE7IHRoaXMuQUNUSVZFX1RFWFRVUkU9IDM0MDE2OyB0aGlzLkFDVElWRV9VTklGT1JNUz0gMzU3MTg7IHRoaXMuQUxJQVNFRF9MSU5FX1dJRFRIX1JBTkdFPSAzMzkwMjsgdGhpcy5BTElBU0VEX1BPSU5UX1NJWkVfUkFOR0U9IDMzOTAxOyB0aGlzLkFMUEhBPSA2NDA2OyB0aGlzLkFMUEhBX0JJVFM9IDM0MTM7IHRoaXMuQUxXQVlTPSA1MTkgOyB0aGlzLkFSUkFZX0JVRkZFUj0gMzQ5NjIgOyB0aGlzLkFSUkFZX0JVRkZFUl9CSU5ESU5HPSAzNDk2NCA7IHRoaXMuQVRUQUNIRURfU0hBREVSUz0gMzU3MTcgOyB0aGlzLkJBQ0s9IDEwMjkgOyB0aGlzLkJMRU5EPSAzMDQyIDsgdGhpcy5CTEVORF9DT0xPUj0gMzI3NzMgOyB0aGlzLkJMRU5EX0RTVF9BTFBIQT0gMzI5NzAgOyB0aGlzLkJMRU5EX0RTVF9SR0I9IDMyOTY4IDsgdGhpcy5CTEVORF9FUVVBVElPTj0gMzI3NzcgOyB0aGlzLkJMRU5EX0VRVUFUSU9OX0FMUEhBPSAzNDg3NyA7IHRoaXMuQkxFTkRfRVFVQVRJT05fUkdCPSAzMjc3NyA7IHRoaXMuQkxFTkRfU1JDX0FMUEhBPSAzMjk3MSA7IHRoaXMuQkxFTkRfU1JDX1JHQj0gMzI5NjkgOyB0aGlzLkJMVUVfQklUUz0gMzQxMiA7IHRoaXMuQk9PTD0gMzU2NzAgOyB0aGlzLkJPT0xfVkVDMj0gMzU2NzEgOyB0aGlzLkJPT0xfVkVDMz0gMzU2NzIgOyB0aGlzLkJPT0xfVkVDND0gMzU2NzMgOyB0aGlzLkJST1dTRVJfREVGQVVMVF9XRUJHTD0gMzc0NDQgOyB0aGlzLkJVRkZFUl9TSVpFPSAzNDY2MCA7IHRoaXMuQlVGRkVSX1VTQUdFPSAzNDY2MSA7IHRoaXMuQllURT0gNTEyMCA7IHRoaXMuQ0NXPSAyMzA1IDsgdGhpcy5DTEFNUF9UT19FREdFPSAzMzA3MSA7IHRoaXMuQ09MT1JfQVRUQUNITUVOVDA9IDM2MDY0IDsgdGhpcy5DT0xPUl9CVUZGRVJfQklUPSAxNjM4NCA7IHRoaXMuQ09MT1JfQ0xFQVJfVkFMVUU9IDMxMDYgOyB0aGlzLkNPTE9SX1dSSVRFTUFTSz0gMzEwNyA7IHRoaXMuQ09NUElMRV9TVEFUVVM9IDM1NzEzIDsgdGhpcy5DT01QUkVTU0VEX1RFWFRVUkVfRk9STUFUUz0gMzQ0NjcgOyB0aGlzLkNPTlNUQU5UX0FMUEhBPSAzMjc3MSA7IHRoaXMuQ09OU1RBTlRfQ09MT1I9IDMyNzY5IDsgdGhpcy5DT05URVhUX0xPU1RfV0VCR0w9IDM3NDQyIDsgdGhpcy5DVUxMX0ZBQ0U9IDI4ODQgOyB0aGlzLkNVTExfRkFDRV9NT0RFPSAyODg1IDsgdGhpcy5DVVJSRU5UX1BST0dSQU09IDM1NzI1IDsgdGhpcy5DVVJSRU5UX1ZFUlRFWF9BVFRSSUI9IDM0MzQyIDsgdGhpcy5DVz0gMjMwNCA7IHRoaXMuREVDUj0gNzY4MyA7IHRoaXMuREVDUl9XUkFQPSAzNDA1NiA7IHRoaXMuREVMRVRFX1NUQVRVUz0gMzU3MTIgOyB0aGlzLkRFUFRIX0FUVEFDSE1FTlQ9IDM2MDk2IDsgdGhpcy5ERVBUSF9CSVRTPSAzNDE0IDsgdGhpcy5ERVBUSF9CVUZGRVJfQklUPSAyNTYgOyB0aGlzLkRFUFRIX0NMRUFSX1ZBTFVFPSAyOTMxIDsgdGhpcy5ERVBUSF9DT01QT05FTlQ9IDY0MDIgOyB0aGlzLkRFUFRIX0NPTVBPTkVOVDE2PSAzMzE4OSA7IHRoaXMuREVQVEhfRlVOQz0gMjkzMiA7IHRoaXMuREVQVEhfUkFOR0U9IDI5MjggOyB0aGlzLkRFUFRIX1NURU5DSUw9IDM0MDQxIDsgdGhpcy5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQ9IDMzMzA2IDsgdGhpcy5ERVBUSF9URVNUPSAyOTI5IDsgdGhpcy5ERVBUSF9XUklURU1BU0s9IDI5MzAgOyB0aGlzLkRJVEhFUj0gMzAyNCA7IHRoaXMuRE9OVF9DQVJFPSA0MzUyIDsgdGhpcy5EU1RfQUxQSEE9IDc3MiA7IHRoaXMuRFNUX0NPTE9SPSA3NzQgOyB0aGlzLkRZTkFNSUNfRFJBVz0gMzUwNDggOyB0aGlzLkVMRU1FTlRfQVJSQVlfQlVGRkVSPSAzNDk2MyA7IHRoaXMuRUxFTUVOVF9BUlJBWV9CVUZGRVJfQklORElORz0gMzQ5NjUgOyB0aGlzLkVRVUFMPSA1MTQgOyB0aGlzLkZBU1RFU1Q9IDQzNTMgOyB0aGlzLkZMT0FUPSA1MTI2IDsgdGhpcy5GTE9BVF9NQVQyPSAzNTY3NCA7IHRoaXMuRkxPQVRfTUFUMz0gMzU2NzUgOyB0aGlzLkZMT0FUX01BVDQ9IDM1Njc2IDsgdGhpcy5GTE9BVF9WRUMyPSAzNTY2NCA7IHRoaXMuRkxPQVRfVkVDMz0gMzU2NjUgOyB0aGlzLkZMT0FUX1ZFQzQ9IDM1NjY2IDsgdGhpcy5GUkFHTUVOVF9TSEFERVI9IDM1NjMyIDsgdGhpcy5GUkFNRUJVRkZFUj0gMzYxNjAgOyB0aGlzLkZSQU1FQlVGRkVSX0FUVEFDSE1FTlRfT0JKRUNUX05BTUU9IDM2MDQ5IDsgdGhpcy5GUkFNRUJVRkZFUl9BVFRBQ0hNRU5UX09CSkVDVF9UWVBFPSAzNjA0OCA7IHRoaXMuRlJBTUVCVUZGRVJfQVRUQUNITUVOVF9URVhUVVJFX0NVQkVfTUFQX0ZBQ0U9IDM2MDUxIDsgdGhpcy5GUkFNRUJVRkZFUl9BVFRBQ0hNRU5UX1RFWFRVUkVfTEVWRUw9IDM2MDUwIDsgdGhpcy5GUkFNRUJVRkZFUl9CSU5ESU5HPSAzNjAwNiA7IHRoaXMuRlJBTUVCVUZGRVJfQ09NUExFVEU9IDM2MDUzIDsgdGhpcy5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0FUVEFDSE1FTlQ9IDM2MDU0IDsgdGhpcy5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0RJTUVOU0lPTlM9IDM2MDU3IDsgdGhpcy5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX01JU1NJTkdfQVRUQUNITUVOVD0gMzYwNTUgOyB0aGlzLkZSQU1FQlVGRkVSX1VOU1VQUE9SVEVEPSAzNjA2MSA7IHRoaXMuRlJPTlQ9IDEwMjggOyB0aGlzLkZST05UX0FORF9CQUNLPSAxMDMyIDsgdGhpcy5GUk9OVF9GQUNFPSAyODg2IDsgdGhpcy5GVU5DX0FERD0gMzI3NzQgOyB0aGlzLkZVTkNfUkVWRVJTRV9TVUJUUkFDVD0gMzI3NzkgOyB0aGlzLkZVTkNfU1VCVFJBQ1Q9IDMyNzc4IDsgdGhpcy5HRU5FUkFURV9NSVBNQVBfSElOVD0gMzMxNzAgOyB0aGlzLkdFUVVBTD0gNTE4IDsgdGhpcy5HUkVBVEVSPSA1MTYgOyB0aGlzLkdSRUVOX0JJVFM9IDM0MTEgOyB0aGlzLkhJR0hfRkxPQVQ9IDM2MzM4IDsgdGhpcy5ISUdIX0lOVD0gMzYzNDEgOyB0aGlzLklOQ1I9IDc2ODIgOyB0aGlzLklOQ1JfV1JBUD0gMzQwNTUgOyB0aGlzLklOVD0gNTEyNCA7IHRoaXMuSU5UX1ZFQzI9IDM1NjY3IDsgdGhpcy5JTlRfVkVDMz0gMzU2NjggOyB0aGlzLklOVF9WRUM0PSAzNTY2OSA7IHRoaXMuSU5WQUxJRF9FTlVNPSAxMjgwIDsgdGhpcy5JTlZBTElEX0ZSQU1FQlVGRkVSX09QRVJBVElPTj0gMTI4NiA7IHRoaXMuSU5WQUxJRF9PUEVSQVRJT049IDEyODIgOyB0aGlzLklOVkFMSURfVkFMVUU9IDEyODEgOyB0aGlzLklOVkVSVD0gNTM4NiA7IHRoaXMuS0VFUD0gNzY4MCA7IHRoaXMuTEVRVUFMPSA1MTUgOyB0aGlzLkxFU1M9IDUxMyA7IHRoaXMuTElORUFSPSA5NzI5IDsgdGhpcy5MSU5FQVJfTUlQTUFQX0xJTkVBUj0gOTk4NyA7IHRoaXMuTElORUFSX01JUE1BUF9ORUFSRVNUPSA5OTg1IDsgdGhpcy5MSU5FUz0gMSA7IHRoaXMuTElORV9MT09QPSAyIDsgdGhpcy5MSU5FX1NUUklQPSAzIDsgdGhpcy5MSU5FX1dJRFRIPSAyODQ5OyB0aGlzLkxJTktfU1RBVFVTPSAzNTcxNDsgdGhpcy5MT1dfRkxPQVQ9IDM2MzM2IDsgdGhpcy5MT1dfSU5UPSAzNjMzOSA7IHRoaXMuTFVNSU5BTkNFPSA2NDA5IDsgdGhpcy5MVU1JTkFOQ0VfQUxQSEE9IDY0MTA7IHRoaXMuTUFYX0NPTUJJTkVEX1RFWFRVUkVfSU1BR0VfVU5JVFM9IDM1NjYxIDsgdGhpcy5NQVhfQ1VCRV9NQVBfVEVYVFVSRV9TSVpFPSAzNDA3NiA7IHRoaXMuTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUz0gMzYzNDkgOyB0aGlzLk1BWF9SRU5ERVJCVUZGRVJfU0laRT0gMzQwMjQgOyB0aGlzLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTPSAzNDkzMCA7IHRoaXMuTUFYX1RFWFRVUkVfU0laRT0gMzM3OSA7IHRoaXMuIE1BWF9WQVJZSU5HX1ZFQ1RPUlM9IDM2MzQ4IDsgdGhpcy5NQVhfVkVSVEVYX0FUVFJJQlM9IDM0OTIxIDsgdGhpcy5NQVhfVkVSVEVYX1RFWFRVUkVfSU1BR0VfVU5JVFM9IDM1NjYwIDsgdGhpcy5NQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUz0gMzYzNDcgOyB0aGlzLk1BWF9WSUVXUE9SVF9ESU1TPSAzMzg2IDsgdGhpcy5NRURJVU1fRkxPQVQ9IDM2MzM3IDsgdGhpcy5NRURJVU1fSU5UPSAzNjM0MCA7IHRoaXMuTUlSUk9SRURfUkVQRUFUPSAzMzY0OCA7IHRoaXMuTkVBUkVTVD0gOTcyOCA7IHRoaXMuTkVBUkVTVF9NSVBNQVBfTElORUFSPSA5OTg2IDsgdGhpcy5ORUFSRVNUX01JUE1BUF9ORUFSRVNUPSA5OTg0IDsgdGhpcy5ORVZFUj0gNTEyIDsgdGhpcy5OSUNFU1Q9IDQzNTQgOyB0aGlzLk5PTkU9IDAgOyB0aGlzLk5PVEVRVUFMPSA1MTcgOyB0aGlzLk5PX0VSUk9SPSAwIDsgdGhpcy5PTkU9IDEgOyB0aGlzLk9ORV9NSU5VU19DT05TVEFOVF9BTFBIQT0gMzI3NzIgOyB0aGlzLk9ORV9NSU5VU19DT05TVEFOVF9DT0xPUj0gMzI3NzAgOyB0aGlzLk9ORV9NSU5VU19EU1RfQUxQSEE9IDc3MyA7IHRoaXMuT05FX01JTlVTX0RTVF9DT0xPUj0gNzc1IDsgdGhpcy5PTkVfTUlOVVNfU1JDX0FMUEhBPSA3NzEgOyB0aGlzLk9ORV9NSU5VU19TUkNfQ09MT1I9IDc2OSA7IHRoaXMuT1VUX09GX01FTU9SWT0gMTI4NSA7IHRoaXMuUEFDS19BTElHTk1FTlQ9IDMzMzMgOyB0aGlzLlBPSU5UUz0gMCA7IHRoaXMuUE9MWUdPTl9PRkZTRVRfRkFDVE9SPSAzMjgyNCA7IHRoaXMuUE9MWUdPTl9PRkZTRVRfRklMTD0gMzI4MjMgOyB0aGlzLlBPTFlHT05fT0ZGU0VUX1VOSVRTPSAxMDc1MiA7IHRoaXMuUkVEX0JJVFM9IDM0MTAgOyB0aGlzLlJFTkRFUkJVRkZFUj0gMzYxNjEgOyB0aGlzLlJFTkRFUkJVRkZFUl9BTFBIQV9TSVpFPSAzNjE3OSA7IHRoaXMuUkVOREVSQlVGRkVSX0JJTkRJTkc9IDM2MDA3IDsgdGhpcy5SRU5ERVJCVUZGRVJfQkxVRV9TSVpFPSAzNjE3OCA7IHRoaXMuUkVOREVSQlVGRkVSX0RFUFRIX1NJWkU9IDM2MTgwIDsgdGhpcy5SRU5ERVJCVUZGRVJfR1JFRU5fU0laRT0gMzYxNzcgOyB0aGlzLlJFTkRFUkJVRkZFUl9IRUlHSFQ9IDM2MTYzIDsgdGhpcy5SRU5ERVJCVUZGRVJfSU5URVJOQUxfRk9STUFUPSAzNjE2NCA7IHRoaXMuUkVOREVSQlVGRkVSX1JFRF9TSVpFPSAzNjE3NiA7IHRoaXMuUkVOREVSQlVGRkVSX1NURU5DSUxfU0laRT0gMzYxODEgOyB0aGlzLlJFTkRFUkJVRkZFUl9XSURUSD0gMzYxNjIgOyB0aGlzLlJFTkRFUkVSPSA3OTM3IDsgdGhpcy5SRVBFQVQ9IDEwNDk3IDsgdGhpcy5SRVBMQUNFPSA3NjgxIDsgdGhpcy5SR0I9IDY0MDcgOyB0aGlzLlJHQjVfQTE9IDMyODU1IDsgdGhpcy5SR0I1NjU9IDM2MTk0IDsgdGhpcy5SR0JBPSA2NDA4IDsgdGhpcy5SR0JBND0gMzI4NTQgOyB0aGlzLlNBTVBMRVJfMkQ9IDM1Njc4IDsgdGhpcy5TQU1QTEVSX0NVQkU9IDM1NjgwIDsgdGhpcy5TQU1QTEVTPSAzMjkzNyA7IHRoaXMuU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFPSAzMjkyNiA7IHRoaXMuU0FNUExFX0JVRkZFUlM9IDMyOTM2IDsgdGhpcy5TQU1QTEVfQ09WRVJBR0U9IDMyOTI4IDsgdGhpcy5TQU1QTEVfQ09WRVJBR0VfSU5WRVJUPSAzMjkzOSA7IHRoaXMuU0FNUExFX0NPVkVSQUdFX1ZBTFVFPSAzMjkzOCA7IHRoaXMuU0NJU1NPUl9CT1g9IDMwODggOyB0aGlzLlNDSVNTT1JfVEVTVD0gMzA4OSA7IHRoaXMuU0hBREVSX1RZUEU9IDM1NjYzIDsgdGhpcy5TSEFESU5HX0xBTkdVQUdFX1ZFUlNJT049IDM1NzI0IDsgdGhpcy5TSE9SVD0gNTEyMiA7IHRoaXMuU1JDX0FMUEhBPSA3NzAgOyB0aGlzLlNSQ19BTFBIQV9TQVRVUkFURT0gNzc2IDsgdGhpcy5TUkNfQ09MT1I9IDc2OCA7IHRoaXMuU1RBVElDX0RSQVc9IDM1MDQ0IDsgdGhpcy5TVEVOQ0lMX0FUVEFDSE1FTlQ9IDM2MTI4IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfRkFJTD0gMzQ4MTcgOyB0aGlzLlNURU5DSUxfQkFDS19GVU5DPSAzNDgxNiA7IHRoaXMuU1RFTkNJTF9CQUNLX1BBU1NfREVQVEhfRkFJTD0gMzQ4MTggOyB0aGlzLlNURU5DSUxfQkFDS19QQVNTX0RFUFRIX1BBU1M9IDM0ODE5IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfUkVGPSAzNjAwMyA7IHRoaXMuU1RFTkNJTF9CQUNLX1ZBTFVFX01BU0s9IDM2MDA0IDsgdGhpcy5TVEVOQ0lMX0JBQ0tfV1JJVEVNQVNLPSAzNjAwNSA7IHRoaXMuU1RFTkNJTF9CSVRTPSAzNDE1IDsgdGhpcy5TVEVOQ0lMX0JVRkZFUl9CSVQ9IDEwMjQgOyB0aGlzLlNURU5DSUxfQ0xFQVJfVkFMVUU9IDI5NjEgOyB0aGlzLlNURU5DSUxfRkFJTD0gMjk2NCA7IHRoaXMuU1RFTkNJTF9GVU5DPSAyOTYyIDsgdGhpcy5TVEVOQ0lMX0lOREVYPSA2NDAxIDsgdGhpcy5TVEVOQ0lMX0lOREVYOD0gMzYxNjggOyB0aGlzLlNURU5DSUxfUEFTU19ERVBUSF9GQUlMPSAyOTY1IDsgdGhpcy5TVEVOQ0lMX1BBU1NfREVQVEhfUEFTUz0gMjk2NiA7IHRoaXMuU1RFTkNJTF9SRUY9IDI5NjcgOyB0aGlzLlNURU5DSUxfVEVTVD0gMjk2MCA7IHRoaXMuU1RFTkNJTF9WQUxVRV9NQVNLPSAyOTYzIDsgdGhpcy5TVEVOQ0lMX1dSSVRFTUFTSz0gMjk2OCA7IHRoaXMuU1RSRUFNX0RSQVc9IDM1MDQwIDsgdGhpcy5TVUJQSVhFTF9CSVRTPSAzNDA4IDsgdGhpcy5URVhUVVJFPSA1ODkwIDsgdGhpcy5URVhUVVJFMD0gMzM5ODQgOyB0aGlzLlRFWFRVUkUxPSAzMzk4NSA7IHRoaXMuVEVYVFVSRTI9IDMzOTg2IDsgdGhpcy5URVhUVVJFMz0gMzM5ODcgOyB0aGlzLlRFWFRVUkU0PSAzMzk4OCA7IHRoaXMuVEVYVFVSRTU9IDMzOTg5IDsgdGhpcy5URVhUVVJFNj0gMzM5OTAgOyB0aGlzLlRFWFRVUkU3PSAzMzk5MSA7IHRoaXMuVEVYVFVSRTg9IDMzOTkyIDsgdGhpcy5URVhUVVJFOT0gMzM5OTMgOyB0aGlzLlRFWFRVUkUxMD0gMzM5OTQgOyB0aGlzLlRFWFRVUkUxMT0gMzM5OTUgOyB0aGlzLlRFWFRVUkUxMj0gMzM5OTYgOyB0aGlzLlRFWFRVUkUxMz0gMzM5OTcgOyB0aGlzLlRFWFRVUkUxND0gMzM5OTggOyB0aGlzLlRFWFRVUkUxNT0gMzM5OTkgOyB0aGlzLlRFWFRVUkUxNj0gMzQwMDAgOyB0aGlzLlRFWFRVUkUxNz0gMzQwMDEgOyB0aGlzLlRFWFRVUkUxOD0gMzQwMDIgOyB0aGlzLlRFWFRVUkUxOT0gMzQwMDMgOyB0aGlzLlRFWFRVUkUyMD0gMzQwMDQgOyB0aGlzLlRFWFRVUkUyMT0gMzQwMDUgOyB0aGlzLlRFWFRVUkUyMj0gMzQwMDYgOyB0aGlzLlRFWFRVUkUyMz0gMzQwMDcgOyB0aGlzLlRFWFRVUkUyND0gMzQwMDggOyB0aGlzLlRFWFRVUkUyNT0gMzQwMDkgOyB0aGlzLlRFWFRVUkUyNj0gMzQwMTAgOyB0aGlzLlRFWFRVUkUyNz0gMzQwMTEgOyB0aGlzLlRFWFRVUkUyOD0gMzQwMTIgOyB0aGlzLlRFWFRVUkUyOT0gMzQwMTMgOyB0aGlzLlRFWFRVUkUzMD0gMzQwMTQgOyB0aGlzLlRFWFRVUkUzMT0gMzQwMTUgOyB0aGlzLlRFWFRVUkVfMkQ9IDM1NTMgOyB0aGlzLlRFWFRVUkVfQklORElOR18yRD0gMzI4NzMgOyB0aGlzLlRFWFRVUkVfQklORElOR19DVUJFX01BUD0gMzQwNjggOyB0aGlzLlRFWFRVUkVfQ1VCRV9NQVA9IDM0MDY3IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1g9IDM0MDcwIDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1k9IDM0MDcyIDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1o9IDM0MDc0IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1g9IDM0MDY5IDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1k9IDM0MDcxIDsgdGhpcy5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1o9IDM0MDczIDsgdGhpcy5URVhUVVJFX01BR19GSUxURVI9IDEwMjQwIDsgdGhpcy5URVhUVVJFX01JTl9GSUxURVI9IDEwMjQxIDsgdGhpcy5URVhUVVJFX1dSQVBfUz0gMTAyNDIgOyB0aGlzLlRFWFRVUkVfV1JBUF9UPSAxMDI0MyA7IHRoaXMuVFJJQU5HTEVTPSA0IDsgdGhpcy5UUklBTkdMRV9GQU49IDYgOyB0aGlzLlRSSUFOR0xFX1NUUklQPSA1IDsgdGhpcy5VTlBBQ0tfQUxJR05NRU5UPSAzMzE3IDsgdGhpcy5VTlBBQ0tfQ09MT1JTUEFDRV9DT05WRVJTSU9OX1dFQkdMPSAzNzQ0MyA7IHRoaXMuVU5QQUNLX0ZMSVBfWV9XRUJHTD0gMzc0NDAgOyB0aGlzLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTD0gMzc0NDEgOyB0aGlzLlVOU0lHTkVEX0JZVEU9IDUxMjEgOyB0aGlzLlVOU0lHTkVEX0lOVD0gNTEyNSA7IHRoaXMuVU5TSUdORURfU0hPUlQ9IDUxMjMgOyB0aGlzLlVOU0lHTkVEX1NIT1JUXzRfNF80XzQ9IDMyODE5IDsgdGhpcy5VTlNJR05FRF9TSE9SVF81XzVfNV8xPSAzMjgyMCA7IHRoaXMuVU5TSUdORURfU0hPUlRfNV82XzU9IDMzNjM1IDsgdGhpcy5WQUxJREFURV9TVEFUVVM9IDM1NzE1IDsgdGhpcy5WRU5ET1I9IDc5MzYgOyB0aGlzLlZFUlNJT049IDc5MzggOyB0aGlzLlZFUlRFWF9BVFRSSUJfQVJSQVlfQlVGRkVSX0JJTkRJTkc9IDM0OTc1IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX0VOQUJMRUQ9IDM0MzM4IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX05PUk1BTElaRUQ9IDM0OTIyIDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1BPSU5URVI9IDM0MzczIDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1NJWkU9IDM0MzM5IDsgdGhpcy5WRVJURVhfQVRUUklCX0FSUkFZX1NUUklERT0gMzQzNDAgOyB0aGlzLlZFUlRFWF9BVFRSSUJfQVJSQVlfVFlQRT0gMzQzNDEgOyB0aGlzLlZFUlRFWF9TSEFERVI9IDM1NjMzIDsgdGhpcy5WSUVXUE9SVD0gMjk3OCA7IHRoaXMuWkVSTyA9IDAgO1xuXG5cbiAgICB2YXIgU0laRV9PRl9WRVJURVggICAgPSBWZWMzLlNJWkUsXG4gICAgICAgIFNJWkVfT0ZfQ09MT1IgICAgID0gQ29sb3IuU0laRSxcbiAgICAgICAgU0laRV9PRl9URVhfQ09PUkQgPSBWZWMyLlNJWkU7XG5cbiAgICB0aGlzLlNJWkVfT0ZfVkVSVEVYICAgID0gU0laRV9PRl9WRVJURVg7XG4gICAgdGhpcy5TSVpFX09GX05PUk1BTCAgICA9IFNJWkVfT0ZfVkVSVEVYO1xuICAgIHRoaXMuU0laRV9PRl9DT0xPUiAgICAgPSBTSVpFX09GX0NPTE9SO1xuICAgIHRoaXMuU0laRV9PRl9URVhfQ09PUkQgPSAgU0laRV9PRl9URVhfQ09PUkQ7XG5cbiAgICB2YXIgU0laRV9PRl9GQUNFICAgID0gdGhpcy5TSVpFX09GX0ZBQ0UgICA9IFNJWkVfT0ZfVkVSVEVYO1xuXG4gICAgdmFyIFNJWkVfT0ZfUVVBRCAgICAgPSB0aGlzLlNJWkVfT0ZfUVVBRCAgICAgPSBTSVpFX09GX1ZFUlRFWCAqIDQsXG4gICAgICAgIFNJWkVfT0ZfVFJJQU5HTEUgPSB0aGlzLlNJWkVfT0ZfVFJJQU5HTEUgPSBTSVpFX09GX1ZFUlRFWCAqIDMsXG4gICAgICAgIFNJWkVfT0ZfTElORSAgICAgPSB0aGlzLlNJWkVfT0ZfTElORSAgICAgPSBTSVpFX09GX1ZFUlRFWCAqIDIsXG4gICAgICAgIFNJWkVfT0ZfUE9JTlQgICAgPSB0aGlzLlNJWkVfT0ZfUE9JTlQgICAgPSBTSVpFX09GX1ZFUlRFWDtcblxuICAgIHZhciBFTExJUFNFX0RFVEFJTF9NQVggPSB0aGlzLkVMTElQU0VfREVUQUlMX01BWCA9IDMwO1xuICAgIHRoaXMuRUxMSVBTRV9ERVRBSUxfTUlOID0gMztcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IHNoYXJlZCBidWZmZXJzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5SRVBFQVQgICAgICAgID0gZ2wuUkVQRUFUO1xuICAgIHRoaXMuQ0xBTVAgICAgICAgICA9IGdsLkNMQU1QO1xuICAgIHRoaXMuQ0xBTVBfVE9fRURHRSA9IGdsLkNMQU1QX1RPX0VER0U7XG5cbiAgICB0aGlzLl90ZXhNb2RlICA9IHRoaXMuUkVQRUFUO1xuICAgIHRoaXMuX3RleFNldCAgID0gZmFsc2U7XG5cbiAgICB0aGlzLl90ZXhFbXB0eSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELHRoaXMuX3RleEVtcHR5KTtcbiAgICBnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCAxLCAxLCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBuZXcgVWludDhBcnJheShbMSwxLDEsMV0pKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdVVzZVRleHR1cmUsMC4wKTtcblxuICAgIHRoaXMuX3RleCAgICAgID0gbnVsbDtcblxuICAgIHRoaXMuX2RlZmF1bHRWQk8gPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLl9kZWZhdWx0SUJPID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgICAgICAgICB0aGlzLl9kZWZhdWx0VkJPKTtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9kZWZhdWx0SUJPKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IGZsYWdzIGFuZCBjYWNoZXNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICB0aGlzLl9iVXNlTGlnaHRpbmcgICAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX2JVc2VNYXRlcmlhbCAgICAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5fYlVzZVRleHR1cmUgICAgICAgICAgPSBmYWxzZTtcblxuICAgIHRoaXMuX2JVc2VCaWxsYm9hcmRpbmcgICAgID0gZmFsc2U7XG5cbiAgICB0aGlzLl9iVXNlRHJhd0FycmF5QmF0Y2ggICAgICAgID0gZmFsc2U7XG4gICAgdGhpcy5fYlVzZURyYXdFbGVtZW50QXJyYXlCYXRjaCA9IGZhbHNlO1xuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IG51bGw7XG5cbiAgICB0aGlzLl9iQmF0Y2hWZXJ0aWNlcyAgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hOb3JtYWxzICAgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hDb2xvcnMgICAgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hUZXhDb29yZHMgPSBbXTtcbiAgICB0aGlzLl9iQmF0Y2hJbmRpY2VzICAgPSBbXTtcblxuICAgIHRoaXMuX2JCYXRjaFZlcnRpY2VzTnVtID0gMDtcblxuXG5cbiAgICB0aGlzLl9iQlZlY1JpZ2h0ID0gVmVjMy5tYWtlKCk7XG4gICAgdGhpcy5fYkJWZWNVcCAgICA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KDQgKiAzKTtcblxuICAgIHRoaXMuX2JCVmVjMCA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMSA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMiA9IFZlYzMubWFrZSgpO1xuICAgIHRoaXMuX2JCVmVjMyA9IFZlYzMubWFrZSgpO1xuXG4gICAgdGhpcy5fcmVjdFdpZHRoTGFzdCAgICA9IDA7XG4gICAgdGhpcy5fcmVjdEhlaWdodExhc3QgICA9IDA7XG5cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IE1hdHJpY2VzXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgdGhpcy5fY2FtZXJhICAgID0gbnVsbDtcblxuICAgIHRoaXMuX21Nb2RlVmlldyA9IE1hdDQ0Lm1ha2UoKTtcbiAgICB0aGlzLl9tTm9ybWFsICAgPSBNYXQzMy5tYWtlKCk7XG5cbiAgICB0aGlzLl9tVGVtcCA9IE1hdDQ0Lm1ha2UoKTtcblxuICAgIHRoaXMuX21TdGFjayA9IFtdO1xuXG4gICAgdGhpcy5fZHJhd01vZGUgPSB0aGlzLkxJTkVTO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAgIC8vIEluaXQgQnVmZmVyc1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIHRoaXMuX2JFbXB0eTNmID0gbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcblxuICAgIHRoaXMuX2JDb2xvcjRmICAgPSBDb2xvci5XSElURSgpO1xuICAgIHRoaXMuX2JDb2xvckJnNGYgPSBDb2xvci5CTEFDSygpO1xuXG4gICAgdGhpcy5fYlZlcnRleCAgID0gbnVsbDtcbiAgICB0aGlzLl9iTm9ybWFsICAgPSBudWxsO1xuICAgIHRoaXMuX2JDb2xvciAgICA9IG51bGw7XG4gICAgdGhpcy5fYlRleENvb3JkID0gbnVsbDtcbiAgICB0aGlzLl9iSW5kZXggICAgPSBudWxsO1xuXG4gICAgdGhpcy5fYlZlcnRleFBvaW50ID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1BPSU5UKTtcbiAgICB0aGlzLl9iQ29sb3JQb2ludCAgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfQ09MT1IpO1xuXG4gICAgdGhpcy5fYlZlcnRleExpbmUgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0xJTkUpO1xuICAgIHRoaXMuX2JDb2xvckxpbmUgICA9IG5ldyBGbG9hdDMyQXJyYXkoMiAqIFNJWkVfT0ZfQ09MT1IpO1xuXG4gICAgdGhpcy5fYlZlcnRleFRyaWFuZ2xlICAgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1RSSUFOR0xFKTtcbiAgICB0aGlzLl9iTm9ybWFsVHJpYW5nbGUgICAgICAgICAgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfVFJJQU5HTEUpO1xuICAgIHRoaXMuX2JDb2xvclRyaWFuZ2xlICAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoMyAqIFNJWkVfT0ZfQ09MT1IpO1xuICAgIHRoaXMuX2JJbmRleFRyaWFuZ2xlICAgICAgICAgICA9IG5ldyBVaW50MTZBcnJheShbMCwxLDJdKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRUcmlhbmdsZURlZmF1bHQgPSBuZXcgRmxvYXQzMkFycmF5KFswLjAsMC4wLDEuMCwwLjAsMS4wLDEuMF0pO1xuICAgIHRoaXMuX2JUZXhDb29yZFRyaWFuZ2xlICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fYlRleENvb3JkVHJpYW5nbGVEZWZhdWx0Lmxlbmd0aCk7XG5cbiAgICB0aGlzLl9iVmVydGV4UXVhZCAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9RVUFEKTtcbiAgICB0aGlzLl9iTm9ybWFsUXVhZCAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9RVUFEKTtcbiAgICB0aGlzLl9iQ29sb3JRdWFkICAgICAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoNCAqIFNJWkVfT0ZfQ09MT1IpO1xuICAgIHRoaXMuX2JJbmRleFF1YWQgICAgICAgICAgID0gbmV3IFVpbnQxNkFycmF5KFswLDEsMiwxLDIsM10pO1xuICAgIHRoaXMuX2JUZXhDb29yZFF1YWREZWZhdWx0ID0gbmV3IEZsb2F0MzJBcnJheShbMC4wLDAuMCwxLjAsMC4wLDEuMCwxLjAsMC4wLDEuMF0pO1xuICAgIHRoaXMuX2JUZXhDb29yZFF1YWQgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iVGV4Q29vcmRRdWFkRGVmYXVsdC5sZW5ndGgpO1xuXG4gICAgdGhpcy5fYlZlcnRleFJlY3QgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfUVVBRCk7XG4gICAgdGhpcy5fYk5vcm1hbFJlY3QgPSBuZXcgRmxvYXQzMkFycmF5KFswLDEsMCwwLDEsMCwwLDEsMCwwLDEsMF0pO1xuICAgIHRoaXMuX2JDb2xvclJlY3QgID0gbmV3IEZsb2F0MzJBcnJheSg0ICogU0laRV9PRl9DT0xPUik7XG5cbiAgICB0aGlzLl9iVmVydGV4RWxsaXBzZSAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1ZFUlRFWCAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYk5vcm1hbEVsbGlwc2UgICA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5fYlZlcnRleEVsbGlwc2UubGVuZ3RoKTtcbiAgICB0aGlzLl9iQ29sb3JFbGxpcHNlICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0NPTE9SICAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYlRleENvb3JkRWxsaXBzZSA9IG5ldyBGbG9hdDMyQXJyYXkoU0laRV9PRl9URVhfQ09PUkQgKiBFTExJUFNFX0RFVEFJTF9NQVgpO1xuXG4gICAgdGhpcy5fYlZlcnRleENpcmNsZSAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX1ZFUlRFWCAqIEVMTElQU0VfREVUQUlMX01BWCk7XG4gICAgdGhpcy5fYk5vcm1hbENpcmNsZSAgID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iVmVydGV4Q2lyY2xlLmxlbmd0aCk7XG4gICAgdGhpcy5fYkNvbG9yQ2lyY2xlICAgID0gbmV3IEZsb2F0MzJBcnJheShTSVpFX09GX0NPTE9SICogRUxMSVBTRV9ERVRBSUxfTUFYKTtcbiAgICB0aGlzLl9iVGV4Q29vcmRDaXJjbGUgPSBuZXcgRmxvYXQzMkFycmF5KFNJWkVfT0ZfVEVYX0NPT1JEICogRUxMSVBTRV9ERVRBSUxfTUFYKTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhDdWJlICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShbLTAuNSwtMC41LCAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLjUsLTAuNSwgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC41LCAwLjUsIDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0wLjUsIDAuNSwgMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuNSwtMC41LC0wLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtMC41LCAwLjUsLTAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMC41LCAwLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwtMC41LCAwLjUsLTAuNSwtMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsLTAuNSwtMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsIDAuNSwtMC41LC0wLjUsIDAuNSwwLjUsLTAuNSwtMC41LCAwLjUsIDAuNSwtMC41LCAwLjUsIDAuNSwgMC41LCAwLjUsLTAuNSwgMC41LC0wLjUsLTAuNSwtMC41LC0wLjUsLTAuNSwgMC41LC0wLjUsIDAuNSwgMC41LC0wLjUsIDAuNSwtMC41XSk7XG4gICAgdGhpcy5fYlZlcnRleEN1YmVTY2FsZWQgPSBuZXcgRmxvYXQzMkFycmF5KG5ldyBBcnJheSh0aGlzLl9iVmVydGV4Q3ViZS5sZW5ndGgpKTtcbiAgICB0aGlzLl9iQ29sb3JDdWJlICAgID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iVmVydGV4Q3ViZS5sZW5ndGggLyBTSVpFX09GX1ZFUlRFWCAqIFNJWkVfT0ZfQ09MT1IpO1xuICAgIHRoaXMuX2JOb3JtYWxDdWJlICAgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIC0xLCAwLCAwLCAtMSwgMCwgMCwgLTEsIDAsIDAsIC0xLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwXSApO1xuICAgIHRoaXMuX2JJbmRleEN1YmUgICAgPSBuZXcgVWludDE2QXJyYXkoWyAgMCwgMSwgMiwgMCwgMiwgMywgNCwgNSwgNiwgNCwgNiwgNywgOCwgOSwxMCwgOCwxMCwxMSwgMTIsMTMsMTQsMTIsMTQsMTUsIDE2LDE3LDE4LDE2LDE4LDE5LCAyMCwyMSwyMiwyMCwyMiwyM10pO1xuICAgIHRoaXMuX2JUZXhDb29yZEN1YmUgPSBudWxsO1xuXG4gICAgdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCA9IDEwLjA7XG4gICAgdGhpcy5fc3BoZXJlRGV0YWlsTGFzdCA9IDEwLjA7XG4gICAgdGhpcy5fc3BoZXJlU2NhbGVMYXN0ICA9IC0xO1xuICAgIHRoaXMuX2N1YmVTY2FsZUxhc3QgICAgPSAtMTtcblxuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmUgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmVTY2FsZWQgPSBudWxsO1xuICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JDb2xvclNwaGVyZSAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JJbmRleFNwaGVyZSAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JUZXhDb29yZHNTcGhlcmUgICAgPSBudWxsO1xuXG4gICAgdGhpcy5fYlNjcmVlbkNvb3JkcyA9IFswLDBdO1xuICAgIHRoaXMuX2JQb2ludDAgICAgICAgPSBbMCwwLDBdO1xuICAgIHRoaXMuX2JQb2ludDEgICAgICAgPSBbMCwwLDBdO1xuXG4gICAgdGhpcy5fYXhpc1ggPSBWZWMzLkFYSVNfWCgpO1xuICAgIHRoaXMuX2F4aXNZID0gVmVjMy5BWElTX1koKTtcbiAgICB0aGlzLl9heGlzWiA9IFZlYzMuQVhJU19aKCk7XG5cbiAgICB0aGlzLl9saW5lQm94V2lkdGggID0gMTtcbiAgICB0aGlzLl9saW5lQm94SGVpZ2h0ID0gMTtcbiAgICB0aGlzLl9saW5lQ3lsaW5kZXJSYWRpdXMgPSAwLjU7XG5cbiAgICB0aGlzLl9nZW5TcGhlcmUoKTtcbiAgICB0aGlzLl9nZW5DaXJjbGUoKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgICAvLyBJbml0IHByZXNldHNcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgIHRoaXMuYW1iaWVudChDb2xvci5CTEFDSygpKTtcblxufVxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBMaWdodFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLnVzZUxpZ2h0aW5nICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VMaWdodGluZyxib29sID8gMS4wIDogMC4wKTt0aGlzLl9iVXNlTGlnaHRpbmcgPSBib29sO307XG5LR0wucHJvdG90eXBlLmdldExpZ2h0aW5nICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9iVXNlTGlnaHRpbmc7fTtcblxuS0dMLnByb3RvdHlwZS5saWdodCA9IGZ1bmN0aW9uKGxpZ2h0KVxue1xuICAgIHZhciBpZCA9IGxpZ2h0LmdldElkKCksXG4gICAgICAgIGdsID0gdGhpcy5nbDtcblxuICAgIHZhciB0ZW1wVmVjNCAgICA9IHRoaXMuX3RlbXBMaWdodFBvcztcbiAgICAgICAgdGVtcFZlYzRbMF0gPSBsaWdodC5wb3NpdGlvblswXTtcbiAgICAgICAgdGVtcFZlYzRbMV0gPSBsaWdodC5wb3NpdGlvblsxXTtcbiAgICAgICAgdGVtcFZlYzRbMl0gPSBsaWdodC5wb3NpdGlvblsyXTtcbiAgICAgICAgdGVtcFZlYzRbM10gPSBsaWdodC5wb3NpdGlvblszXTtcblxuICAgIHZhciBsaWdodFBvc0V5ZVNwYWNlID0gTWF0NDQubXVsdFZlYzQodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCx0ZW1wVmVjNCk7XG5cbiAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VMaWdodFBvc2l0aW9uW2lkXSwgbGlnaHRQb3NFeWVTcGFjZSk7XG4gICAgZ2wudW5pZm9ybTNmdih0aGlzLl91TGlnaHRBbWJpZW50W2lkXSwgIGxpZ2h0LmFtYmllbnQpO1xuICAgIGdsLnVuaWZvcm0zZnYodGhpcy5fdUxpZ2h0RGlmZnVzZVtpZF0sICBsaWdodC5kaWZmdXNlKTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodFNwZWN1bGFyW2lkXSwgbGlnaHQuc3BlY3VsYXIpO1xuXG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VMaWdodEF0dGVudWF0aW9uQ29uc3RhbnRbaWRdLCAgIGxpZ2h0LmNvbnN0YW50QXR0ZW50dWF0aW9uKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaWRdLCAgICAgbGlnaHQubGluZWFyQXR0ZW50dWF0aW9uKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25RdWFkcmF0aWNbaWRdLCAgbGlnaHQucXVhZHJpY0F0dGVudHVhdGlvbik7XG59O1xuXG4vL0ZJWCBNRVxuS0dMLnByb3RvdHlwZS5kaXNhYmxlTGlnaHQgPSBmdW5jdGlvbihsaWdodClcbntcbiAgICB2YXIgaWQgPSBsaWdodC5nZXRJZCgpLFxuICAgICAgICBnbCA9IHRoaXMuZ2w7XG5cbiAgICB2YXIgYkVtcHR5ID0gdGhpcy5fYkVtcHR5M2Y7XG5cbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodEFtYmllbnRbaWRdLCAgYkVtcHR5KTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodERpZmZ1c2VbaWRdLCAgYkVtcHR5KTtcbiAgICBnbC51bmlmb3JtM2Z2KHRoaXMuX3VMaWdodFNwZWN1bGFyW2lkXSwgYkVtcHR5KTtcblxuICAgIGdsLnVuaWZvcm0xZih0aGlzLl91TGlnaHRBdHRlbnVhdGlvbkNvbnN0YW50W2lkXSwgMS4wKTtcbiAgICBnbC51bmlmb3JtMWYodGhpcy5fdUxpZ2h0QXR0ZW51YXRpb25MaW5lYXJbaWRdLCAgIDAuMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VMaWdodEF0dGVudWF0aW9uUXVhZHJhdGljW2lkXSwwLjApO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gVGV4dHVyZVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86IGRvIGl0IHRoZSBwbGFzayB3YXlcblxuS0dMLnByb3RvdHlwZS51c2VUZXh0dXJlICA9IGZ1bmN0aW9uKGJvb2wpe3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VUZXh0dXJlLCBib29sID8gMS4wIDogMC4wKTt0aGlzLl9iVXNlVGV4dHVyZSA9IGJvb2w7fTtcblxuS0dMLnByb3RvdHlwZS5sb2FkVGV4dHVyZVdpdGhJbWFnZSA9IGZ1bmN0aW9uKGltZylcbntcbiAgICB2YXIgZ2wgPSB0aGlzLmdsLFxuICAgICAgICBnbFRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcbiAgICBnbFRleC5pbWFnZSA9IGltZztcblxuICAgIHZhciB0ZXggPSBuZXcgVGV4dHVyZShnbFRleCk7XG4gICAgdGhpcy5fYmluZFRleEltYWdlKHRleC5fdGV4KTtcblxuICAgIHJldHVybiB0ZXg7XG5cbn07XG5cbktHTC5wcm90b3R5cGUubG9hZFRleHR1cmUgPSBmdW5jdGlvbihzcmMsdGV4dHVyZSxjYWxsYmFjaylcbntcbiAgICB2YXIgZ2wgID0gdGhpcy5nbCxcbiAgICAgICAgZ2xUZXggPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG4gICAgZ2xUZXguaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuICAgIGdsVGV4LmltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHRleHR1cmUuc2V0VGV4U291cmNlKHRoaXMuX2JpbmRUZXhJbWFnZShnbFRleCkpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xuXG4gICAgZ2xUZXguaW1hZ2Uuc3JjID0gc3JjO1xufTtcblxuS0dMLnByb3RvdHlwZS5fYmluZFRleEltYWdlID0gZnVuY3Rpb24oZ2xUZXgpXG57XG4gICAgaWYoIWdsVGV4LmltYWdlKXRocm93ICgnVGV4dHVyZSBpbWFnZSBpcyBudWxsLicpO1xuXG4gICAgdmFyIHdpZHRoICA9IGdsVGV4LmltYWdlLndpZHRoLFxuICAgICAgICBoZWlnaHQgPSBnbFRleC5pbWFnZS5oZWlnaHQ7XG5cbiAgICBpZigod2lkdGgmKHdpZHRoLTEpIT0wKSkgICAgICAge3Rocm93ICdUZXh0dXJlIGltYWdlIHdpZHRoIGlzIG5vdCBwb3dlciBvZiAyLic7IH1cbiAgICBlbHNlIGlmKChoZWlnaHQmKGhlaWdodC0xKSkhPTApe3Rocm93ICdUZXh0dXJlIGltYWdlIGhlaWdodCBpcyBub3QgcG93ZXIgb2YgMi4nO31cblxuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELGdsVGV4KTtcbiAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGdsVGV4LmltYWdlKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELG51bGwpO1xuXG5cbiAgICByZXR1cm4gZ2xUZXg7XG59O1xuXG5LR0wucHJvdG90eXBlLnRleHR1cmUgPSBmdW5jdGlvbih0ZXh0dXJlKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICB0aGlzLl90ZXggPSB0ZXh0dXJlLl90ZXg7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCx0aGlzLl90ZXgpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMuX3RleE1vZGUgKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLl90ZXhNb2RlICk7XG4gICAgZ2wudW5pZm9ybTFpKHRoaXMuX3VUZXhJbWFnZSwwKTtcbn07XG5cbktHTC5wcm90b3R5cGUuZGlzYWJsZVRleHR1cmVzID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCx0aGlzLl90ZXhFbXB0eSk7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4VGV4Q29vcmQsVmVjMi5TSVpFLGdsLkZMT0FULGZhbHNlLDAsMCk7XG4gICAgZ2wudW5pZm9ybTFmKHRoaXMuX3VVc2VUZXh0dXJlLDAuMCk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBNYXRlcmlhbFxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLnVzZU1hdGVyaWFsID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5nbC51bmlmb3JtMWYodGhpcy5fdVVzZU1hdGVyaWFsLGJvb2wgPyAxLjAgOiAwLjApO3RoaXMuX2JVc2VNYXRlcmlhbCA9IGJvb2w7fTtcblxuS0dMLnByb3RvdHlwZS5tYXRlcmlhbCA9IGZ1bmN0aW9uKG1hdGVyaWFsKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICAvL2dsLnVuaWZvcm00ZnYodGhpcy5fdU1hdGVyaWFsRW1pc3Npb24sICBtYXRlcmlhbC5lbWlzc2lvbik7XG4gICAgZ2wudW5pZm9ybTRmdih0aGlzLl91TWF0ZXJpYWxBbWJpZW50LCAgIG1hdGVyaWFsLmFtYmllbnQpO1xuICAgIGdsLnVuaWZvcm00ZnYodGhpcy5fdU1hdGVyaWFsRGlmZnVzZSwgICBtYXRlcmlhbC5kaWZmdXNlKTtcbiAgICBnbC51bmlmb3JtNGZ2KHRoaXMuX3VNYXRlcmlhbFNwZWN1bGFyLCAgbWF0ZXJpYWwuc3BlY3VsYXIpO1xuICAgIGdsLnVuaWZvcm0xZiggdGhpcy5fdU1hdGVyaWFsU2hpbmluZXNzLCBtYXRlcmlhbC5zaGluaW5lc3MpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gQ2FtZXJhXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbktHTC5wcm90b3R5cGUuc2V0Q2FtZXJhID0gZnVuY3Rpb24oY2FtZXJhKXt0aGlzLl9jYW1lcmEgPSBjYW1lcmE7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWF0cml4IHN0YWNrXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbktHTC5wcm90b3R5cGUubG9hZElkZW50aXR5ID0gZnVuY3Rpb24oKXt0aGlzLl9tTW9kZWxWaWV3ID0gTWF0NDQuaWRlbnRpdHkodGhpcy5fY2FtZXJhLm1vZGVsVmlld01hdHJpeCk7fTtcbktHTC5wcm90b3R5cGUucHVzaE1hdHJpeCAgID0gZnVuY3Rpb24oKXt0aGlzLl9tU3RhY2sucHVzaChNYXQ0NC5jb3B5KHRoaXMuX21Nb2RlbFZpZXcpKTt9O1xuS0dMLnByb3RvdHlwZS5wb3BNYXRyaXggICAgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIHN0YWNrID0gdGhpcy5fbVN0YWNrO1xuXG4gICAgaWYoc3RhY2subGVuZ3RoID09IDApdGhyb3cgKCdJbnZhbGlkIHBvcCEnKTtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gc3RhY2sucG9wKCk7XG5cbiAgICByZXR1cm4gdGhpcy5fbU1vZGVsVmlldztcbn07XG5cbktHTC5wcm90b3R5cGUuc2V0TWF0cmljZXNVbmlmb3JtID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICBnbC51bmlmb3JtTWF0cml4NGZ2KHRoaXMuX3VNb2RlbFZpZXdNYXRyaXgsZmFsc2UsdGhpcy5fbU1vZGVsVmlldyk7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdih0aGlzLl91UHJvamVjdGlvbk1hdHJpeCxmYWxzZSx0aGlzLl9jYW1lcmEucHJvamVjdGlvbk1hdHJpeCk7XG5cbiAgICBpZighdGhpcy5fYlVzZUxpZ2h0aW5nKXJldHVybjtcblxuICAgIE1hdDQ0LnRvTWF0MzNJbnZlcnNlZCh0aGlzLl9tTW9kZWxWaWV3LHRoaXMuX21Ob3JtYWwpO1xuICAgIE1hdDMzLnRyYW5zcG9zZSh0aGlzLl9tTm9ybWFsLHRoaXMuX21Ob3JtYWwpO1xuXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLl91Tm9ybWFsTWF0cml4LGZhbHNlLHRoaXMuX21Ob3JtYWwpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTWF0cml4IHN0YWNrIHRyYW5zZm9ybWF0aW9uc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLnRyYW5zbGF0ZSAgICAgPSBmdW5jdGlvbih2KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlVHJhbnNsYXRlKHZbMF0sdlsxXSx2WzJdLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbktHTC5wcm90b3R5cGUudHJhbnNsYXRlM2YgICA9IGZ1bmN0aW9uKHgseSx6KSAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoeCx5LHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuS0dMLnByb3RvdHlwZS50cmFuc2xhdGVYICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVRyYW5zbGF0ZSh4LDAsMCxNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5LR0wucHJvdG90eXBlLnRyYW5zbGF0ZVkgICAgPSBmdW5jdGlvbih5KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlVHJhbnNsYXRlKDAseSwwLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbktHTC5wcm90b3R5cGUudHJhbnNsYXRlWiAgICA9IGZ1bmN0aW9uKHopICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VUcmFuc2xhdGUoMCwwLHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuS0dMLnByb3RvdHlwZS5zY2FsZSAgICAgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKHZbMF0sdlsxXSx2WzJdLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbktHTC5wcm90b3R5cGUuc2NhbGUxZiAgICAgICA9IGZ1bmN0aW9uKG4pICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZShuLG4sbixNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5LR0wucHJvdG90eXBlLnNjYWxlM2YgICAgICAgPSBmdW5jdGlvbih4LHkseikgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoeCx5LHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuS0dMLnByb3RvdHlwZS5zY2FsZVggICAgICAgID0gZnVuY3Rpb24oeCkgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVNjYWxlKHgsMSwxLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbktHTC5wcm90b3R5cGUuc2NhbGVZICAgICAgICA9IGZ1bmN0aW9uKHkpICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VTY2FsZSgxLHksMSxNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5LR0wucHJvdG90eXBlLnNjYWxlWiAgICAgICAgPSBmdW5jdGlvbih6KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlU2NhbGUoMSwxLHosTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuS0dMLnByb3RvdHlwZS5yb3RhdGUgICAgICAgID0gZnVuY3Rpb24odikgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWFlaKHZbMF0sdlsxXSx2WzJdLE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbktHTC5wcm90b3R5cGUucm90YXRlM2YgICAgICA9IGZ1bmN0aW9uKHgseSx6KSAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblhZWih4LHkseixNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5LR0wucHJvdG90eXBlLnJvdGF0ZVggICAgICAgPSBmdW5jdGlvbih4KSAgICAgICAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25YKHgsTWF0NDQuaWRlbnRpdHkodGhpcy5fbVRlbXApKSx0aGlzLl9tTW9kZWxWaWV3KTt9O1xuS0dMLnByb3RvdHlwZS5yb3RhdGVZICAgICAgID0gZnVuY3Rpb24oeSkgICAgICAgICAge01hdDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsTWF0NDQubWFrZVJvdGF0aW9uWSh5LE1hdDQ0LmlkZW50aXR5KHRoaXMuX21UZW1wKSksdGhpcy5fbU1vZGVsVmlldyk7fTtcbktHTC5wcm90b3R5cGUucm90YXRlWiAgICAgICA9IGZ1bmN0aW9uKHopICAgICAgICAgIHtNYXQ0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LE1hdDQ0Lm1ha2VSb3RhdGlvblooeixNYXQ0NC5pZGVudGl0eSh0aGlzLl9tVGVtcCkpLHRoaXMuX21Nb2RlbFZpZXcpO307XG5LR0wucHJvdG90eXBlLnJvdGF0ZUF4aXMgICAgPSBmdW5jdGlvbihhbmdsZSx2KSAgICB7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUsdlswXSx2WzFdLHZbMl0pLHRoaXMuX21Nb2RlbFZpZXcpO307XG5LR0wucHJvdG90eXBlLnJvdGF0ZUF4aXMzZiAgPSBmdW5jdGlvbihhbmdsZSx4LHkseil7TWF0NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldyxNYXQ0NC5tYWtlUm90YXRpb25PbkF4aXMoYW5nbGUseCx5LHopLHRoaXMuX21Nb2RlbFZpZXcpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGNvbnZlbmllbmNlIGRyYXdcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5LR0wucHJvdG90eXBlLmRyYXdFbGVtZW50cyA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXksaW5kZXhBcnJheSxtb2RlLGNvdW50LG9mZnNldCx0eXBlLGRyYXdUeXBlKVxue1xuICAgIHZhciBnbCA9IHRoaXMuZ2w7XG5cbiAgICB0aGlzLmJ1ZmZlckFycmF5cyh2ZXJ0ZXhGbG9hdDMyQXJyYXksbm9ybWFsRmxvYXQzMkFycmF5LGNvbG9yRmxvYXQzMkFycmF5LHV2RmxvYXQzMkFycmF5KTtcbiAgICB0aGlzLnNldE1hdHJpY2VzVW5pZm9ybSgpO1xuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsaW5kZXhBcnJheSxkcmF3VHlwZSB8fCBnbC5EWU5BTUlDX0RSQVcpO1xuICAgIGdsLmRyYXdFbGVtZW50cyhtb2RlICB8fCB0aGlzLlRSSUFOR0xFUyxcbiAgICAgICAgICAgICAgICAgICAgY291bnQgfHwgaW5kZXhBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgIHx8IGdsLlVOU0lHTkVEX1NIT1JULFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgfHwgMCk7XG59O1xuXG5cbktHTC5wcm90b3R5cGUuZHJhd0FycmF5cyA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXksbW9kZSxmaXJzdCxjb3VudClcbntcblxuICAgIHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdXZGbG9hdDMyQXJyYXkpO1xuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKG1vZGUgIHx8IHRoaXMuX2RyYXdNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCB8fCAwLFxuICAgICAgICAgICAgICAgICAgICAgICBjb3VudCB8fCB2ZXJ0ZXhGbG9hdDMyQXJyYXkubGVuZ3RoIC8gdGhpcy5TSVpFX09GX1ZFUlRFWCk7XG59O1xuXG5LR0wucHJvdG90eXBlLmRyYXdHZW9tZXRyeSA9IGZ1bmN0aW9uKGdlb20sY291bnQsb2Zmc2V0KSB7Z2VvbS5fZHJhdyh0aGlzLGNvdW50LG9mZnNldCk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gY29udmVuaWVuY2UgZmlsbGluZyBkZWZhdWx0IHZib1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLmJ1ZmZlckFycmF5cyA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdGV4Q29vcmRGbG9hdDMyQXJyYXksZ2xEcmF3TW9kZSlcbntcbiAgICB2YXIgbmEgPSBub3JtYWxGbG9hdDMyQXJyYXkgICA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgY2EgPSBjb2xvckZsb2F0MzJBcnJheSAgICA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgdGEgPSB0ZXhDb29yZEZsb2F0MzJBcnJheSA/IHRydWUgOiBmYWxzZTtcblxuICAgIHZhciBhVmVydGV4Tm9ybWFsICAgPSB0aGlzLl9hVmVydGV4Tm9ybWFsLFxuICAgICAgICBhVmVydGV4Q29sb3IgICAgPSB0aGlzLl9hVmVydGV4Q29sb3IsXG4gICAgICAgIGFWZXJ0ZXhUZXhDb29yZCA9IHRoaXMuX2FWZXJ0ZXhUZXhDb29yZDtcblxuICAgIHZhciBnbCAgICAgICAgICAgID0gdGhpcy5nbCxcbiAgICAgICAgZ2xBcnJheUJ1ZmZlciA9IGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgZ2xGbG9hdCAgICAgICA9IGdsLkZMT0FUO1xuXG4gICAgZ2xEcmF3TW9kZSA9IGdsRHJhd01vZGUgfHwgZ2wuRFlOQU1JQ19EUkFXO1xuXG4gICAgdmFyIHZibGVuID0gICAgICB2ZXJ0ZXhGbG9hdDMyQXJyYXkuYnl0ZUxlbmd0aCxcbiAgICAgICAgbmJsZW4gPSBuYSA/IG5vcm1hbEZsb2F0MzJBcnJheS5ieXRlTGVuZ3RoIDogMCxcbiAgICAgICAgY2JsZW4gPSBjYSA/IGNvbG9yRmxvYXQzMkFycmF5LmJ5dGVMZW5ndGggICA6IDAsXG4gICAgICAgIHRibGVuID0gdGEgPyB0ZXhDb29yZEZsb2F0MzJBcnJheS5ieXRlTGVuZ3RoIDogMDtcblxuICAgIHZhciBvZmZzZXRWID0gMCxcbiAgICAgICAgb2Zmc2V0TiA9IG9mZnNldFYgKyB2YmxlbixcbiAgICAgICAgb2Zmc2V0QyA9IG9mZnNldE4gKyBuYmxlbixcbiAgICAgICAgb2Zmc2V0VCA9IG9mZnNldEMgKyBjYmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlciwgdmJsZW4gKyBuYmxlbiArIGNibGVuICsgdGJsZW4sIGdsRHJhd01vZGUpO1xuXG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRWLCB2ZXJ0ZXhGbG9hdDMyQXJyYXkpO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fYVZlcnRleFBvc2l0aW9uLCB0aGlzLlNJWkVfT0ZfVkVSVEVYLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG5cbiAgICBpZighbmEpeyBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoYVZlcnRleE5vcm1hbCk7fVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhOb3JtYWwpO1xuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0Tixub3JtYWxGbG9hdDMyQXJyYXkpO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFWZXJ0ZXhOb3JtYWwsdGhpcy5TSVpFX09GX05PUk1BTCxnbEZsb2F0LGZhbHNlLDAsb2Zmc2V0Tik7XG4gICAgfVxuXG4gICAgaWYoIWNhKXsgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhDb2xvcik7IH1cbiAgICB7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFWZXJ0ZXhDb2xvcik7XG4gICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgY29sb3JGbG9hdDMyQXJyYXkpO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGFWZXJ0ZXhDb2xvciwgdGhpcy5TSVpFX09GX0NPTE9SLCAgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xuICAgIH1cblxuICAgIGlmKCF0YSl7IGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4VGV4Q29vcmQpO31cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhVmVydGV4VGV4Q29vcmQpO1xuICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsb2Zmc2V0VCx0ZXhDb29yZEZsb2F0MzJBcnJheSk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYVZlcnRleFRleENvb3JkLHRoaXMuU0laRV9PRl9URVhfQ09PUkQsZ2xGbG9hdCxmYWxzZSwwLG9mZnNldFQpO1xuICAgIH1cbn07XG5cblxuS0dMLnByb3RvdHlwZS5idWZmZXJDb2xvcnMgPSBmdW5jdGlvbihjb2xvcixidWZmZXIpXG57XG4gICAgLy9pZih0aGlzLl9iVXNlTWF0ZXJpYWwgfHwgdGhpcy5fYlVzZVRleHR1cmUpcmV0dXJuIG51bGw7XG5cbiAgICAvL2htLCBmaXggbWVcbiAgICBpZih0aGlzLl9iVXNlTWF0ZXJpYWwgfHwgdGhpcy5fYlVzZVRleHR1cmUpcmV0dXJuIGJ1ZmZlcjtcblxuICAgIHZhciBpID0gMDtcblxuICAgIGlmKGNvbG9yLmxlbmd0aCA9PSA0KVxuICAgIHtcbiAgICAgICAgd2hpbGUoaSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJ1ZmZlcltpXSAgPWNvbG9yWzBdO1xuICAgICAgICAgICAgYnVmZmVyW2krMV09Y29sb3JbMV07XG4gICAgICAgICAgICBidWZmZXJbaSsyXT1jb2xvclsyXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzNdPWNvbG9yWzNdO1xuICAgICAgICAgICAgaSs9NDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpZihjb2xvci5sZW5ndGggIT0gYnVmZmVyLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGtFcnJvci5DT0xPUlNfSU5fV1JPTkdfU0laRSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShpIDwgYnVmZmVyLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgYnVmZmVyW2ldICAgPSBjb2xvcltpXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzFdID0gY29sb3JbaSsxXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzJdID0gY29sb3JbaSsyXTtcbiAgICAgICAgICAgIGJ1ZmZlcltpKzNdID0gY29sb3JbaSszXTtcbiAgICAgICAgICAgIGkrPTQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyO1xufTtcblxuS0dMLnByb3RvdHlwZS5idWZmZXJWZXJ0aWNlcyA9IGZ1bmN0aW9uKHZlcnRpY2VzLGJ1ZmZlcilcbntcbiAgICBpZih2ZXJ0aWNlcy5sZW5ndGggIT0gYnVmZmVyLmxlbmd0aCl0aHJvdyAoa0Vycm9yLlZFUlRJQ0VTX0lOX1dST05HX1NJWkUgKyBidWZmZXIubGVuZ3RoICsgJy4nKTtcbiAgICB2YXIgaSA9IC0xO3doaWxlKCsraSA8IGJ1ZmZlci5sZW5ndGgpYnVmZmVyW2ldID0gdmVydGljZXNbaV07XG4gICAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIEhlbHBlcnNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5LR0wucHJvdG90eXBlLl9zY2FsZVZlcnRpY2VzID0gZnVuY3Rpb24odmVydDAsc2NhbGUsdmVydDEpXG57XG4gICAgaWYoIXNjYWxlKXJldHVybiB2ZXJ0MDtcbiAgICB2YXIgaSA9IC0xLCBsID0gdmVydDAubGVuZ3RoO3doaWxlKCsraSA8IGwpdmVydDFbaV0gPSB2ZXJ0MFtpXSAqIHNjYWxlO3JldHVybiB2ZXJ0MTtcbn07XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gQmF0Y2hcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuS0dMLnByb3RvdHlwZS5fcHV0Q29tcCA9IGZ1bmN0aW9uKG9yaWcsdGFyZ2V0KVxue1xuXG59O1xuXG5LR0wucHJvdG90eXBlLmJlZ2luRHJhd0FycmF5QmF0Y2ggPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fYlVzZURyYXdBcnJheUJhdGNoID0gdHJ1ZTtcblxuXG59O1xuXG5LR0wucHJvdG90eXBlLmVuZERyYXdBcnJheUJhdGNoID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX2JVc2VEcmF3QXJyYXlCYXRjaCA9IGZhbHNlO1xuXG59O1xuXG5LR0wucHJvdG90eXBlLmRyYXdBcnJheUJhdGNoID0gZnVuY3Rpb24oKVxue1xuXG59O1xuXG5LR0wucHJvdG90eXBlLmJlZ2luRHJhd0VsZW1lbnRBcnJheUJhdGNoID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX2JVc2VEcmF3RWxlbWVudEFycmF5QmF0Y2ggPSB0cnVlO1xuXG4gICAgdGhpcy5fYkJhdGNoVmVydGljZXMubGVuZ3RoID0gMDtcblxufTtcblxuS0dMLnByb3RvdHlwZS5lbmREcmF3RWxlbWVudEFycmF5QmF0Y2ggPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fYlVzZURyYXdFbGVtZW50QXJyYXlCYXRjaCA9IGZhbHNlO1xuXG5cbn07XG5cbktHTC5wcm90b3R5cGUuX3B1c2hFbGVtZW50QXJyYXlCYXRjaCA9IGZ1bmN0aW9uKHZlcnRleEZsb2F0MzJBcnJheSxub3JtYWxGbG9hdDMyQXJyYXksY29sb3JGbG9hdDMyQXJyYXksdGV4Q29vcmRzRmxvYXQzMkFycmF5LGluZGV4VWludDE2QXJyYXkpXG57XG5cbiAgICB2YXIgdHJhbnNNYXRyaXggPSB0aGlzLl9tTW9kZWxWaWV3O1xuXG4gICAgdmFyIG9mZnNldEluZGV4ID0gdGhpcy5fYkJhdGNoVmVydGljZXMubGVuZ3RoIC8gMztcbiAgICB2YXIgb2Zmc2V0LGxlbmd0aCxpbmRleDtcblxuICAgIHZhciBiYXRjaFZlcnRpY2VzICAgICAgICA9IHRoaXMuX2JCYXRjaFZlcnRpY2VzLFxuICAgICAgICBiYXRjaFZlcnRpY2VzT2Zmc2V0ICA9IGJhdGNoVmVydGljZXMubGVuZ3RoO1xuICAgICAgICBiYXRjaFZlcnRpY2VzLmxlbmd0aCs9IHZlcnRleEZsb2F0MzJBcnJheS5sZW5ndGg7XG5cbiAgICAgICAgb2Zmc2V0ID0gYmF0Y2hWZXJ0aWNlc09mZnNldDtcbiAgICAgICAgbGVuZ3RoID0gYmF0Y2hWZXJ0aWNlcy5sZW5ndGg7XG4gICAgICAgIGluZGV4ICA9IDA7XG5cbiAgICB3aGlsZShvZmZzZXQgPCBsZW5ndGgpXG4gICAge1xuXG4gICAgICAgIGJhdGNoVmVydGljZXNbb2Zmc2V0ICBdID0gdmVydGV4RmxvYXQzMkFycmF5W2luZGV4ICBdO1xuICAgICAgICBiYXRjaFZlcnRpY2VzW29mZnNldCsxXSA9IHZlcnRleEZsb2F0MzJBcnJheVtpbmRleCsxXTtcbiAgICAgICAgYmF0Y2hWZXJ0aWNlc1tvZmZzZXQrMl0gPSB2ZXJ0ZXhGbG9hdDMyQXJyYXlbaW5kZXgrMl07XG5cbiAgICAgICAgTWF0NDQubXVsdFZlYzNBSSh0cmFuc01hdHJpeCxiYXRjaFZlcnRpY2VzLG9mZnNldCk7XG5cbiAgICAgICAgb2Zmc2V0Kz0zO1xuICAgICAgICBpbmRleCArPTM7XG4gICAgfVxuXG5cbiAgICBpZihub3JtYWxGbG9hdDMyQXJyYXkgICApdGhpcy5fcHV0QmF0Y2godGhpcy5fYkJhdGNoTm9ybWFscyxub3JtYWxGbG9hdDMyQXJyYXkpO1xuICAgIGlmKGNvbG9yRmxvYXQzMkFycmF5ICAgICl0aGlzLl9wdXRCYXRjaCh0aGlzLl9iQmF0Y2hDb2xvcnMsY29sb3JGbG9hdDMyQXJyYXkpO1xuICAgIGlmKHRleENvb3Jkc0Zsb2F0MzJBcnJheSl0aGlzLl9wdXRCYXRjaCh0aGlzLl9iQmF0Y2hUZXhDb29yZHMsdGV4Q29vcmRzRmxvYXQzMkFycmF5KTtcblxuXG4gICAgdmFyIGJhdGNoSW5kaWNlcyAgICAgICAgPSB0aGlzLl9iQmF0Y2hJbmRpY2VzLFxuICAgICAgICBiYXRjaEluZGljZXNPZmZzZXQgID0gYmF0Y2hJbmRpY2VzLmxlbmd0aDtcbiAgICAgICAgYmF0Y2hJbmRpY2VzLmxlbmd0aCs9IGluZGV4VWludDE2QXJyYXkubGVuZ3RoO1xuXG4gICAgICAgIG9mZnNldCA9IGJhdGNoSW5kaWNlc09mZnNldDtcbiAgICAgICAgbGVuZ3RoID0gYmF0Y2hJbmRpY2VzLmxlbmd0aDtcbiAgICAgICAgaW5kZXggID0gMDtcblxuICAgIHdoaWxlKG9mZnNldCA8IGxlbmd0aCl7YmF0Y2hJbmRpY2VzW29mZnNldF0gPSBpbmRleFVpbnQxNkFycmF5W2luZGV4XSArIG9mZnNldEluZGV4O29mZnNldCsrO2luZGV4Kys7fVxuXG59O1xuXG5LR0wucHJvdG90eXBlLmRyYXdFbGVtZW50QXJyYXlCYXRjaCA9IGZ1bmN0aW9uKGJhdGNoKVxue1xuICAgIGlmKCFiYXRjaCl7fVxuXG4gICAgdGhpcy5kcmF3RWxlbWVudHMobmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iQmF0Y2hWZXJ0aWNlcyksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iQmF0Y2hOb3JtYWxzKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX2JCYXRjaENvbG9ycyksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9iQmF0Y2hUZXhDb29yZHMpLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBVaW50MTZBcnJheSggdGhpcy5fYkJhdGNoSW5kaWNlcyksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREcmF3TW9kZSgpKTtcbn07XG5cbktHTC5wcm90b3R5cGUuX3B1dEJhdGNoID0gZnVuY3Rpb24oYmF0Y2hBcnJheSxkYXRhQXJyYXkpXG57XG4gICAgdmFyIGJhdGNoT2Zmc2V0ICAgPSBiYXRjaEFycmF5Lmxlbmd0aDtcbiAgICBiYXRjaEFycmF5Lmxlbmd0aCs9IGRhdGFBcnJheS5sZW5ndGg7XG5cbiAgICB2YXIgbGVuID0gYmF0Y2hBcnJheS5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gMDtcblxuICAgIHdoaWxlKGJhdGNoT2Zmc2V0IDwgbGVuKXtiYXRjaEFycmF5W2JhdGNoT2Zmc2V0KytdID0gZGF0YUFycmF5W2luZGV4KytdO31cbn07XG5cblxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIENvbnZlbmllbmNlIE1ldGhvZHMgY29sb3Jcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuS0dMLnByb3RvdHlwZS5hbWJpZW50ICAgPSBmdW5jdGlvbihjb2xvcil7dGhpcy5nbC51bmlmb3JtM2YodGhpcy5fdUFtYmllbnQsY29sb3JbMF0sY29sb3JbMV0sY29sb3JbMl0pO307XG5LR0wucHJvdG90eXBlLmFtYmllbnQzZiA9IGZ1bmN0aW9uKHIsZyxiKXt0aGlzLmdsLnVuaWZvcm0zZih0aGlzLl91QW1iaWVudCxyLGcsYik7fTtcbktHTC5wcm90b3R5cGUuYW1iaWVudDFmID0gZnVuY3Rpb24oaykgICAge3RoaXMuZ2wudW5pZm9ybTFmKHRoaXMuX3VBbWJpZW50LGspO307XG5cbktHTC5wcm90b3R5cGUuY29sb3IgICA9IGZ1bmN0aW9uKGNvbG9yKSAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldCh0aGlzLl9iQ29sb3I0Zixjb2xvcik7fTtcbktHTC5wcm90b3R5cGUuY29sb3I0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDRmKHRoaXMuX2JDb2xvcjRmLHIsZyxiLGEpO307XG5LR0wucHJvdG90eXBlLmNvbG9yM2YgPSBmdW5jdGlvbihyLGcsYikgIHt0aGlzLl9iQ29sb3IgPSBDb2xvci5zZXQzZih0aGlzLl9iQ29sb3I0ZixyLGcsYik7fTtcbktHTC5wcm90b3R5cGUuY29sb3IyZiA9IGZ1bmN0aW9uKGssYSkgICAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDJmKHRoaXMuX2JDb2xvcjRmLGssYSk7fTtcbktHTC5wcm90b3R5cGUuY29sb3IxZiA9IGZ1bmN0aW9uKGspICAgICAge3RoaXMuX2JDb2xvciA9IENvbG9yLnNldDFmKHRoaXMuX2JDb2xvcjRmLGspO307XG5LR0wucHJvdG90eXBlLmNvbG9yZnYgPSBmdW5jdGlvbihhcnJheSkgIHt0aGlzLl9iQ29sb3IgPSBhcnJheTt9O1xuXG5LR0wucHJvdG90eXBlLmNsZWFyQ29sb3IgPSBmdW5jdGlvbihjb2xvcil7dGhpcy5jbGVhcjRmKGNvbG9yWzBdLGNvbG9yWzFdLGNvbG9yWzJdLGNvbG9yWzNdKTt9O1xuS0dMLnByb3RvdHlwZS5jbGVhciAgICAgID0gZnVuY3Rpb24oKSAgICAge3RoaXMuY2xlYXI0ZigwLDAsMCwxKTt9O1xuS0dMLnByb3RvdHlwZS5jbGVhcjNmICAgID0gZnVuY3Rpb24ocixnLGIpe3RoaXMuY2xlYXI0ZihyLGcsYiwxKTt9O1xuS0dMLnByb3RvdHlwZS5jbGVhcjJmICAgID0gZnVuY3Rpb24oayxhKSAge3RoaXMuY2xlYXI0ZihrLGssayxhKTt9O1xuS0dMLnByb3RvdHlwZS5jbGVhcjFmICAgID0gZnVuY3Rpb24oaykgICAge3RoaXMuY2xlYXI0ZihrLGssaywxLjApO307XG5LR0wucHJvdG90eXBlLmNsZWFyNGYgICA9IGZ1bmN0aW9uKHIsZyxiLGEpXG57XG4gICAgdmFyIGMgID0gQ29sb3Iuc2V0NGYodGhpcy5fYkNvbG9yQmc0ZixyLGcsYixhKTtcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgIGdsLmNsZWFyQ29sb3IoY1swXSxjWzFdLGNbMl0sY1szXSk7XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xufTtcblxuXG5LR0wucHJvdG90eXBlLmdldENvbG9yQnVmZmVyID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYkNvbG9yO307XG5LR0wucHJvdG90eXBlLmdldENsZWFyQnVmZmVyID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYkNvbG9yQmc0Zjt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBNZXRob2RzIGRyYXcgcHJvcGVydGllc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLmRyYXdNb2RlID0gZnVuY3Rpb24obW9kZSl7dGhpcy5fZHJhd01vZGUgPSBtb2RlO307XG5LR0wucHJvdG90eXBlLmdldERyYXdNb2RlID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZHJhd01vZGU7fTtcblxuS0dMLnByb3RvdHlwZS5zcGhlcmVEZXRhaWwgPSBmdW5jdGlvbihkZXRhaWwpXG57XG4gICAgaWYoZGV0YWlsID09IHRoaXMuX3NwaGVyZURldGFpbExhc3QpcmV0dXJuO1xuICAgIHRoaXMuX3NwaGVyZURldGFpbExhc3QgPSBkZXRhaWw7XG4gICAgdGhpcy5fZ2VuU3BoZXJlKCk7XG59O1xuXG5LR0wucHJvdG90eXBlLmNpcmNsZURldGFpbCA9IGZ1bmN0aW9uKGRldGFpbClcbntcbiAgICBpZihkZXRhaWwgPT0gdGhpcy5fY2lyY2xlRGV0YWlsTGFzdCApcmV0dXJuO1xuICAgIHRoaXMuX2NpcmNsZURldGFpbExhc3QgID0gTWF0aC5tYXgodGhpcy5FTExJUFNFX0RFVEFJTF9NSU4sTWF0aC5taW4oZGV0YWlsLHRoaXMuRUxMSVBTRV9ERVRBSUxfTUFYKSk7XG4gICAgdGhpcy5fY2lybGNlVmVydGV4Q291bnQgPSB0aGlzLl9jaXJjbGVEZXRhaWxMYXN0ICogMztcbiAgICB0aGlzLl9nZW5DaXJjbGUoKTtcbn07XG5cbktHTC5wcm90b3R5cGUubGluZVdpZHRoID0gZnVuY3Rpb24oc2l6ZSl7dGhpcy5nbC5saW5lV2lkdGgoc2l6ZSk7fTtcblxuS0dMLnByb3RvdHlwZS51c2VCaWxsYm9hcmQgPSBmdW5jdGlvbihib29sKXt0aGlzLl9iVXNlQmlsbGJvYXJkaW5nID0gYm9vbDt9O1xuS0dMLnByb3RvdHlwZS5wb2ludFNpemUgPSBmdW5jdGlvbih2YWx1ZSl7dGhpcy5nbC51bmlmb3JtMWYodGhpcy5fdVBvaW50U2l6ZSx2YWx1ZSk7fTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBNZXRob2RzIGRyYXcgcHJpbWl0aXZlc1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24odmVjdG9yKVxue1xuICAgIGlmKHZlY3Rvci5sZW5ndGggPT0gMClyZXR1cm47XG5cbiAgICB2YXIgYkNvbG9yUG9pbnQgPSB0aGlzLl9iQ29sb3JQb2ludCxcbiAgICAgICAgYkNvbG9yICAgICAgPSB0aGlzLl9iQ29sb3I7XG5cbiAgICBiQ29sb3JQb2ludFswXSA9IGJDb2xvclswXTtcbiAgICBiQ29sb3JQb2ludFsxXSA9IGJDb2xvclsxXTtcbiAgICBiQ29sb3JQb2ludFsyXSA9IGJDb2xvclsyXTtcbiAgICBiQ29sb3JQb2ludFszXSA9IGJDb2xvclszXTtcblxuICAgIHZhciBnbCA9IHRoaXMuZ2wsXG4gICAgICAgIGdsQXJyYXlCdWZmZXIgPSBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBnbC5GTE9BVDtcblxuICAgIHZhciB2YmxlbiA9IHZlY3Rvci5ieXRlTGVuZ3RoLFxuICAgICAgICBjYmxlbiA9IGJDb2xvci5ieXRlTGVuZ3RoO1xuXG4gICAgdmFyIG9mZnNldFYgPSAwLFxuICAgICAgICBvZmZzZXRDID0gdmJsZW47XG5cbiAgICBnbC5idWZmZXJEYXRhKGdsQXJyYXlCdWZmZXIsdmJsZW4gKyBjYmxlbixnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsQXJyYXlCdWZmZXIsIG9mZnNldFYsIHZlY3Rvcik7XG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbEFycmF5QnVmZmVyLCBvZmZzZXRDLCBiQ29sb3IpO1xuXG4gICAgZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4VGV4Q29vcmQpO1xuXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4UG9zaXRpb24sIHRoaXMuU0laRV9PRl9WRVJURVgsIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRWKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX2FWZXJ0ZXhDb2xvciwgICAgdGhpcy5TSVpFX09GX0NPTE9SLCAgZ2xGbG9hdCwgZmFsc2UsIDAsIG9mZnNldEMpO1xuXG4gICAgdGhpcy5zZXRNYXRyaWNlc1VuaWZvcm0oKTtcbiAgICBnbC5kcmF3QXJyYXlzKHRoaXMuX2RyYXdNb2RlLDAsMSk7XG5cbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4VGV4Q29vcmQpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5wb2ludDtcbn07XG5cbktHTC5wcm90b3R5cGUucG9pbnRzID0gZnVuY3Rpb24odmVydGljZXMsY29sb3JzKVxue1xuICAgIGlmKHZlcnRpY2VzLmxlbmd0aCA9PSAwKXJldHVybjtcblxuICAgIGNvbG9ycyA9IGNvbG9ycyB8fCB0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3I0ZixuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzLmxlbmd0aCAvIDMgKiA0KSk7XG5cbiAgICB2YXIgZ2wgICAgICAgICAgICA9IHRoaXMuZ2wsXG4gICAgICAgIGdsQXJyYXlCdWZmZXIgPSBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgIGdsRmxvYXQgICAgICAgPSBnbC5GTE9BVDtcblxuICAgIHZhciB2YmxlbiA9IHZlcnRpY2VzLmJ5dGVMZW5ndGgsXG4gICAgICAgIGNibGVuID0gY29sb3JzLmJ5dGVMZW5ndGg7XG5cbiAgICB2YXIgb2Zmc2V0ViA9IDAsXG4gICAgICAgIG9mZnNldEMgPSB2YmxlbjtcblxuICAgIGdsLmJ1ZmZlckRhdGEoZ2xBcnJheUJ1ZmZlcix2YmxlbiArIGNibGVuLGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0ViwgdmVydGljZXMpO1xuICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ2xBcnJheUJ1ZmZlciwgb2Zmc2V0QywgY29sb3JzKTtcblxuICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4Tm9ybWFsKTtcbiAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTtcblxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fYVZlcnRleFBvc2l0aW9uLCB0aGlzLlNJWkVfT0ZfVkVSVEVYLCBnbEZsb2F0LCBmYWxzZSwgMCwgb2Zmc2V0Vik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl9hVmVydGV4Q29sb3IsICAgIHRoaXMuU0laRV9PRl9DT0xPUiwgIGdsRmxvYXQsIGZhbHNlLCAwLCBvZmZzZXRDKTtcblxuICAgIHRoaXMuc2V0TWF0cmljZXNVbmlmb3JtKCk7XG4gICAgZ2wuZHJhd0FycmF5cyh0aGlzLl9kcmF3TW9kZSwwLHZlcnRpY2VzLmxlbmd0aC8zKTtcblxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnBvaW50cztcbn07XG5cbktHTC5wcm90b3R5cGUucG9pbnQzZiA9IGZ1bmN0aW9uKHgseSx6KXt0aGlzLl9iVmVydGV4UG9pbnRbMF0gPSB4O3RoaXMuX2JWZXJ0ZXhQb2ludFsxXSA9IHk7dGhpcy5fYlZlcnRleFBvaW50WzJdID0gejt0aGlzLnBvaW50KHRoaXMuX2JWZXJ0ZXhQb2ludCk7fTtcbktHTC5wcm90b3R5cGUucG9pbnQyZiA9IGZ1bmN0aW9uKHgseSkgIHt0aGlzLl9iVmVydGV4UG9pbnRbMF0gPSB4O3RoaXMuX2JWZXJ0ZXhQb2ludFsxXSA9IHk7dGhpcy5fYlZlcnRleFBvaW50WzJdID0gMDt0aGlzLnBvaW50KHRoaXMuX2JWZXJ0ZXhQb2ludCk7fTtcbktHTC5wcm90b3R5cGUucG9pbnR2ICA9IGZ1bmN0aW9uKGFycikgIHt0aGlzLl9iVmVydGV4UG9pbnRbMF0gPSBhcnJbMF07dGhpcy5fYlZlcnRleFBvaW50WzFdID0gYXJyWzFdO3RoaXMuX2JWZXJ0ZXhQb2ludFsyXSA9IGFyclsyXTt0aGlzLnBvaW50KHRoaXMuX2JWZXJ0ZXhQb2ludCk7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLmxpbmVmID0gZnVuY3Rpb24oeDAseTAsejAseDEseTEsejEpXG57XG4gICAgdmFyIHYgPSB0aGlzLl9iVmVydGV4TGluZTtcbiAgICB2WzBdID0geDA7dlsxXSA9IHkwO3ZbMl0gPSB6MDtcbiAgICB2WzNdID0geDE7dls0XSA9IHkxO3ZbNV0gPSB6MTtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvckxpbmUpLG51bGwsdGhpcy5fZHJhd01vZGUpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5saW5lZjtcbn07XG5cbktHTC5wcm90b3R5cGUubGluZSAgPSBmdW5jdGlvbih2ZXJ0aWNlcylcbntcbiAgICBpZih2ZXJ0aWNlcy5sZW5ndGggPT0gMClyZXR1cm47XG4gICAgdGhpcy5kcmF3QXJyYXlzKHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRpY2VzLHRoaXMuX2JWZXJ0ZXhMaW5lKSxudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JMaW5lKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsIDIpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5saW5lO1xufTtcblxuS0dMLnByb3RvdHlwZS5saW5ldiA9IGZ1bmN0aW9uKHZlcnRpY2VzKVxue1xuICAgIGlmKHZlcnRpY2VzLmxlbmd0aCA9PSAwKXJldHVybjtcbiAgICB2YXIgdiA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLFxuICAgICAgICBsID0gdmVydGljZXMubGVuZ3RoIC8gdGhpcy5TSVpFX09GX1ZFUlRFWDtcbiAgICB0aGlzLmRyYXdBcnJheXModixudWxsLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvciwgbmV3IEZsb2F0MzJBcnJheShsKnRoaXMuU0laRV9PRl9DT0xPUikpLG51bGwsdGhpcy5fZHJhd01vZGUsMCwgbCk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLmxpbmV2O1xufTtcblxuS0dMLnByb3RvdHlwZS5saW5lMmZ2ID0gZnVuY3Rpb24odjAsdjEpe3RoaXMubGluZWYodjBbMF0sdjBbMV0sdjBbMl0sdjFbMF0sdjFbMV0sdjFbMl0pO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuS0dMLnByb3RvdHlwZS5xdWFkZiA9IGZ1bmN0aW9uKHgwLHkwLHowLHgxLHkxLHoxLHgyLHkyLHoyLHgzLHkzLHozKVxue1xuICAgIHZhciB2ID0gdGhpcy5fYlZlcnRleFF1YWQ7XG5cbiAgICB2WyAwXSA9IHgwO3ZbIDFdID0geTA7dlsgMl0gPSB6MDtcbiAgICB2WyAzXSA9IHgxO3ZbIDRdID0geTE7dlsgNV0gPSB6MTtcbiAgICB2WyA2XSA9IHgyO3ZbIDddID0geTI7dlsgOF0gPSB6MjtcbiAgICB2WyA5XSA9IHgzO3ZbMTBdID0geTM7dlsxMV0gPSB6MztcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclF1YWQpLG51bGwsdGhpcy5fZHJhd01vZGUsMCw0KTtcblxuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IHRoaXMucXVhZGY7XG59O1xuXG5LR0wucHJvdG90eXBlLnF1YWR2ID0gZnVuY3Rpb24odjAsdjEsdjIsdjMpXG57XG4gICAgdGhpcy5xdWFkZih2MFswXSx2MFsxXSx2MFsyXSx2MVswXSx2MVsxXSx2MVsyXSx2MlswXSx2MlsxXSx2MlsyXSx2M1swXSx2M1sxXSx2M1syXSk7XG59O1xuXG5LR0wucHJvdG90eXBlLnF1YWQgPSBmdW5jdGlvbih2ZXJ0aWNlcyxub3JtYWxzLHRleENvb3JkcylcbntcbiAgICB0aGlzLmRyYXdBcnJheXModGhpcy5idWZmZXJBcnJheXModmVydGljZXMsdGhpcy5fYlZlcnRleFF1YWQpLG5vcm1hbHMsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclF1YWQpLHRleENvb3Jkcyx0aGlzLl9kcmF3TW9kZSwwLDQpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5xdWFkO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86Y2xlYW51cFxuS0dMLnByb3RvdHlwZS5yZWN0ID0gZnVuY3Rpb24od2lkdGgsaGVpZ2h0KVxue1xuICAgIGhlaWdodCA9IGhlaWdodCB8fCB3aWR0aDtcblxuICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMuX2JWZXJ0ZXhSZWN0O1xuXG4gICAgaWYodGhpcy5fYlVzZUJpbGxib2FyZGluZylcbiAgICB7XG4gICAgICAgIC8vMjNcbiAgICAgICAgLy8wMVxuXG4gICAgICAgIHZhciBtb2RlbFZpZXdNYXRyaXggPSB0aGlzLl9tTW9kZWxWaWV3O1xuXG4gICAgICAgIHZhciB2ZWNSaWdodFggPSBtb2RlbFZpZXdNYXRyaXhbMF0sXG4gICAgICAgICAgICB2ZWNSaWdodFkgPSBtb2RlbFZpZXdNYXRyaXhbNF0sXG4gICAgICAgICAgICB2ZWNSaWdodFogPSBtb2RlbFZpZXdNYXRyaXhbOF07XG5cbiAgICAgICAgdmFyIHZlY1VwWCA9IG1vZGVsVmlld01hdHJpeFsxXSxcbiAgICAgICAgICAgIHZlY1VwWSA9IG1vZGVsVmlld01hdHJpeFs1XSxcbiAgICAgICAgICAgIHZlY1VwWiA9IG1vZGVsVmlld01hdHJpeFs5XTtcblxuXG4gICAgICAgIHZlcnRpY2VzWyAwXSA9ICgtdmVjUmlnaHRYIC0gdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgMV0gPSAoLXZlY1JpZ2h0WSAtIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDJdID0gKC12ZWNSaWdodFogLSB2ZWNVcFopICogd2lkdGg7XG5cbiAgICAgICAgdmVydGljZXNbIDNdID0gKHZlY1JpZ2h0WCAtIHZlY1VwWCkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDRdID0gKHZlY1JpZ2h0WSAtIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbIDVdID0gKHZlY1JpZ2h0WiAtIHZlY1VwWikgKiB3aWR0aDtcblxuICAgICAgICB2ZXJ0aWNlc1sgNl0gPSAodmVjUmlnaHRYICsgdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgN10gPSAodmVjUmlnaHRZICsgdmVjVXBZKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sgOF0gPSAodmVjUmlnaHRaICsgdmVjVXBaKSAqIHdpZHRoO1xuXG4gICAgICAgIHZlcnRpY2VzWyA5XSA9ICgtdmVjUmlnaHRYICsgdmVjVXBYKSAqIHdpZHRoO1xuICAgICAgICB2ZXJ0aWNlc1sxMF0gPSAoLXZlY1JpZ2h0WSArIHZlY1VwWSkgKiB3aWR0aDtcbiAgICAgICAgdmVydGljZXNbMTFdID0gKC12ZWNSaWdodFogKyB2ZWNVcFopICogd2lkdGg7XG5cbiAgICB9XG4gICAgZWxzZSBpZih3aWR0aCAhPSB0aGlzLl9yZWN0V2lkdGhMYXN0IHx8IGhlaWdodCAhPSB0aGlzLl9yZWN0SGVpZ2h0TGFzdClcbiAgICB7XG4gICAgICAgIHZlcnRpY2VzWzBdID0gdmVydGljZXNbMV0gPSB2ZXJ0aWNlc1syXSA9IHZlcnRpY2VzWzRdID0gdmVydGljZXNbNV0gPSB2ZXJ0aWNlc1s3XSA9IHZlcnRpY2VzWzldID0gdmVydGljZXNbMTBdID0gMDtcbiAgICAgICAgdmVydGljZXNbM10gPSB2ZXJ0aWNlc1s2XSA9IHdpZHRoOyB2ZXJ0aWNlc1s4XSA9IHZlcnRpY2VzWzExXSA9IGhlaWdodDtcblxuICAgICAgICB0aGlzLl9yZWN0V2lkdGhMYXN0ICA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9yZWN0SGVpZ2h0TGFzdCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdBcnJheXModmVydGljZXMsdGhpcy5fYk5vcm1hbFJlY3QsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclJlY3QpLHRoaXMuX2JUZXhDb29yZFF1YWREZWZhdWx0LHRoaXMuX2RyYXdNb2RlLDAsNCk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnJlY3Q7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbktHTC5wcm90b3R5cGUudHJpYW5nbGUgPSBmdW5jdGlvbih2MCx2MSx2MilcbntcbiAgICB2YXIgdiA9IHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZTtcbiAgICB2WzBdID0gdjBbMF07dlsxXSA9IHYwWzFdO3ZbMl0gPSB2MFsyXTtcbiAgICB2WzNdID0gdjFbMF07dls0XSA9IHYxWzFdO3ZbNV0gPSB2MVsyXTtcbiAgICB2WzZdID0gdjJbMF07dls3XSA9IHYyWzFdO3ZbOF0gPSB2MlsyXTtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclRyaWFuZ2xlKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsMyk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnRyaWFuZ2xlO1xufTtcblxuS0dMLnByb3RvdHlwZS50cmlhbmdsZWYgPSBmdW5jdGlvbih2MCx2MSx2Mix2Myx2NCx2NSx2Nix2Nyx2OClcbntcbiAgICB2YXIgdiA9IHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZTtcbiAgICB2WzBdID0gdjA7dlsxXSA9IHYxO3ZbMl0gPSB2MjtcbiAgICB2WzNdID0gdjM7dls0XSA9IHY0O3ZbNV0gPSB2NTtcbiAgICB2WzZdID0gdjY7dls3XSA9IHY3O3ZbOF0gPSB2ODtcblxuICAgIHRoaXMuZHJhd0FycmF5cyh2LG51bGwsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvclRyaWFuZ2xlKSxudWxsLHRoaXMuX2RyYXdNb2RlLDAsMyk7XG5cbiAgICB0aGlzLl9kcmF3RnVuY0xhc3QgPSB0aGlzLnRyaWFuZ2xlZjtcbn07XG5cbktHTC5wcm90b3R5cGUudHJpYW5nbGV2ID0gZnVuY3Rpb24odmVydGljZXMsbm9ybWFscyx0ZXhDb29yZHMpXG57XG4gICAgdGhpcy5kcmF3QXJyYXlzKHRoaXMuYnVmZmVyQXJyYXlzKHZlcnRpY2VzLHRoaXMuX2JWZXJ0ZXhUcmlhbmdsZSksbm9ybWFscyx0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yVHJpYW5nbGUpLHRleENvb3Jkcyx0aGlzLl9kcmF3TW9kZSwwLDMpO1xuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IHRoaXMudHJpYW5nbGV2O1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5LR0wucHJvdG90eXBlLmNpcmNsZTNmID0gZnVuY3Rpb24oeCx5LHoscmFkaXVzKVxue1xuICAgIHJhZGl1cyA9IHJhZGl1cyB8fCAwLjU7XG5cbiAgICB0aGlzLnB1c2hNYXRyaXgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZTNmKHgseSx6KTtcbiAgICB0aGlzLnNjYWxlMWYocmFkaXVzKTtcbiAgICB0aGlzLmRyYXdBcnJheXModGhpcy5fYlZlcnRleENpcmNsZSx0aGlzLl9iTm9ybWFsQ2lyY2xlLHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JDaXJjbGUpLHRoaXMuX2JUZXhDb29yZENpcmNsZSx0aGlzLmdldERyYXdNb2RlKCksMCx0aGlzLl9jaXJjbGVEZXRhaWxMYXN0KTtcbiAgICB0aGlzLnBvcE1hdHJpeCgpO1xuXG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ID0gdGhpcy5saW5lZjtcbn07XG5cbktHTC5wcm90b3R5cGUuY2lybGNlMmYgPSBmdW5jdGlvbih4LHkscmFkaXVzKXt0aGlzLmNpcmNsZTNmKHgsMCx5LHJhZGl1cyk7fTtcbktHTC5wcm90b3R5cGUuY2lyY2xlID0gZnVuY3Rpb24ocmFkaXVzKXt0aGlzLmNpcmNsZTNmKDAsMCwwLHJhZGl1cyl9O1xuS0dMLnByb3RvdHlwZS5jaXJjbGV2ID0gZnVuY3Rpb24odixyYWRpdXMpe3RoaXMuY2lyY2xlM2YodlswXSx2WzFdLHZbMl0scmFkaXVzKTt9O1xuS0dMLnByb3RvdHlwZS5jaXJjbGVzID0gZnVuY3Rpb24oY2VudGVycyxyYWRpaSl7fTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gR2VvbWV0cnkgZ2VuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbktHTC5wcm90b3R5cGUuX2dlblNwaGVyZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLl9zcGhlcmVEZXRhaWxMYXN0O1xuXG4gICAgdmFyIHZlcnRpY2VzICA9IFtdLFxuICAgICAgICBub3JtYWxzICAgPSBbXSxcbiAgICAgICAgdGV4Q29vcmRzID0gW10sXG4gICAgICAgIGluZGljZXMgICA9IFtdO1xuXG4gICAgdmFyIHRoZXRhLHRoZXRhU2luLHRoZXRhQ29zO1xuICAgIHZhciBwaGkscGhpU2luLHBoaUNvcztcblxuICAgIHZhciB4LHksejtcbiAgICB2YXIgdSx2O1xuXG4gICAgdmFyIGkgPSAtMSxqO1xuXG4gICAgdmFyIGluZGV4LFxuICAgICAgICBpbmRleFZlcnRpY2VzLFxuICAgICAgICBpbmRleE5vcm1hbHMsXG4gICAgICAgIGluZGV4VGV4Q29vcmRzO1xuXG4gICAgd2hpbGUoKytpIDw9IHNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgdGhldGEgPSBpICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICB0aGV0YVNpbiA9IE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgdGhldGFDb3MgPSBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPD0gc2VnbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBoaSAgICA9IGogKiAyICogTWF0aC5QSSAvIHNlZ21lbnRzO1xuICAgICAgICAgICAgcGhpU2luID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgICAgICAgIHBoaUNvcyA9IE1hdGguY29zKHBoaSk7XG5cbiAgICAgICAgICAgIHggPSBwaGlDb3MgKiB0aGV0YVNpbjtcbiAgICAgICAgICAgIHkgPSB0aGV0YUNvcztcbiAgICAgICAgICAgIHogPSBwaGlTaW4gKiB0aGV0YVNpbjtcblxuICAgICAgICAgICAgaW5kZXggICAgICAgICAgPSBqICsgc2VnbWVudHMgKiBpO1xuICAgICAgICAgICAgaW5kZXhWZXJ0aWNlcyAgPSBpbmRleE5vcm1hbHMgPSBpbmRleCAqIDM7XG4gICAgICAgICAgICBpbmRleFRleENvb3JkcyA9IGluZGV4ICogMjtcblxuICAgICAgICAgICAgbm9ybWFscy5wdXNoKHgseSx6KTtcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goeCx5LHopO1xuXG4gICAgICAgICAgICB1ID0gMSAtIGogLyBzZWdtZW50cztcbiAgICAgICAgICAgIHYgPSAxIC0gaSAvIHNlZ21lbnRzO1xuXG4gICAgICAgICAgICB0ZXhDb29yZHMucHVzaCh1LHYpO1xuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgdmFyIGluZGV4MCxpbmRleDEsaW5kZXgyO1xuXG4gICAgaSA9IC0xO1xuICAgIHdoaWxlKCsraSA8IHNlZ21lbnRzKVxuICAgIHtcbiAgICAgICAgaiA9IC0xO1xuICAgICAgICB3aGlsZSgrK2ogPCBzZWdtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXgwID0gaiArIGkgKiAoc2VnbWVudHMgKyAxKTtcbiAgICAgICAgICAgIGluZGV4MSA9IGluZGV4MCArIHNlZ21lbnRzICsgMTtcbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4MCArIDE7XG5cbiAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRleDAsaW5kZXgxLGluZGV4Mik7XG5cbiAgICAgICAgICAgIGluZGV4MiA9IGluZGV4MCArIDE7XG4gICAgICAgICAgICBpbmRleDAgPSBpbmRleDE7XG4gICAgICAgICAgICBpbmRleDEgPSBpbmRleDAgKyAxO1xuXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kZXgwLGluZGV4MSxpbmRleDIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fYlZlcnRleFNwaGVyZSAgICAgICA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuICAgIHRoaXMuX2JWZXJ0ZXhTcGhlcmVTY2FsZWQgPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcbiAgICB0aGlzLl9iTm9ybWFsU3BoZXJlICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKTtcbiAgICB0aGlzLl9iQ29sb3JTcGhlcmUgICAgICAgID0gbmV3IEZsb2F0MzJBcnJheShzZWdtZW50cyAqIHNlZ21lbnRzICogNCk7XG4gICAgdGhpcy5fYlRleENvb3Jkc1NwaGVyZSAgICA9IG5ldyBGbG9hdDMyQXJyYXkoaW5kaWNlcyk7XG4gICAgdGhpcy5fYkluZGV4U3BoZXJlICAgICAgICA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzKTtcbn07XG5cbktHTC5wcm90b3R5cGUuX2dlbkNpcmNsZSA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgY3ggPSAwLFxuICAgICAgICBjeSA9IDA7XG5cbiAgICB2YXIgZCA9IHRoaXMuX2NpcmNsZURldGFpbExhc3QsXG4gICAgICAgIHYgPSB0aGlzLl9iVmVydGV4Q2lyY2xlLFxuICAgICAgICBsID0gZCAqIDM7XG5cbiAgICB2YXIgaSA9IDA7XG5cbiAgICB2YXIgdGhldGEgPSAyICogTWF0aC5QSSAvIGQsXG4gICAgICAgIGMgPSBNYXRoLmNvcyh0aGV0YSksXG4gICAgICAgIHMgPSBNYXRoLnNpbih0aGV0YSksXG4gICAgICAgIHQ7XG5cbiAgICB2YXIgb3ggPSAxLFxuICAgICAgICBveSA9IDA7XG5cbiAgICB3aGlsZShpIDwgbClcbiAgICB7XG4gICAgICAgIHZbaSAgXSA9IG94ICsgY3g7XG4gICAgICAgIHZbaSsxXSA9IDA7XG4gICAgICAgIHZbaSsyXSA9IG95ICsgY3k7XG5cbiAgICAgICAgdCAgPSBveDtcbiAgICAgICAgb3ggPSBjICogb3ggLSBzICogb3k7XG4gICAgICAgIG95ID0gcyAqIHQgICsgYyAqIG95O1xuXG4gICAgICAgIGkrPTM7XG4gICAgfVxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gZGVmYXVsdCB2Ym8vaWJvIC8gc2hhZGVyIGF0dHJpYnV0ZXNcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuS0dMLnByb3RvdHlwZS5nZXREZWZhdWx0VkJPICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RlZmF1bHRWQk87fTtcbktHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdElCTyAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kZWZhdWx0SUJPO307XG5LR0wucHJvdG90eXBlLmJpbmREZWZhdWx0VkJPID0gZnVuY3Rpb24oKXt0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsdGhpcy5fZGVmYXVsdFZCTyk7fTtcbktHTC5wcm90b3R5cGUuYmluZERlZmF1bHRJQk8gPSBmdW5jdGlvbigpe3RoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLHRoaXMuX2RlZmF1bHRJQk8pO307XG5cbktHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdFZlcnRleEF0dHJpYiAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYVZlcnRleFBvc2l0aW9uO307XG5LR0wucHJvdG90eXBlLmdldERlZmF1bHROb3JtYWxBdHRyaWIgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FWZXJ0ZXhOb3JtYWw7fTtcbktHTC5wcm90b3R5cGUuZ2V0RGVmYXVsdENvbG9yQXR0cmliICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYVZlcnRleENvbG9yO307XG5LR0wucHJvdG90eXBlLmdldERlZmF1bHRUZXhDb29yZEF0dHJpYiA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FWZXJ0ZXhUZXhDb29yZDt9O1xuXG5LR0wucHJvdG90eXBlLmVuYWJsZURlZmF1bHRWZXJ0ZXhBdHRyaWJBcnJheSAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFBvc2l0aW9uKTt9O1xuS0dMLnByb3RvdHlwZS5lbmFibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkgICAgID0gZnVuY3Rpb24oKXt0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO307XG5LR0wucHJvdG90eXBlLmVuYWJsZURlZmF1bHRDb2xvckF0dHJpYkFycmF5ICAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleENvbG9yKTt9O1xuS0dMLnByb3RvdHlwZS5lbmFibGVEZWZhdWx0VGV4Q29vcmRzQXR0cmliQXJyYXkgID0gZnVuY3Rpb24oKXt0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhUZXhDb29yZCk7fTtcblxuS0dMLnByb3RvdHlwZS5kaXNhYmxlRGVmYXVsdFZlcnRleEF0dHJpYkFycmF5ICAgID0gZnVuY3Rpb24oKXt0aGlzLmdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9hVmVydGV4UG9zaXRpb24pO307XG5LR0wucHJvdG90eXBlLmRpc2FibGVEZWZhdWx0Tm9ybWFsQXR0cmliQXJyYXkgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhOb3JtYWwpO307XG5LR0wucHJvdG90eXBlLmRpc2FibGVEZWZhdWx0Q29sb3JBdHRyaWJBcnJheSAgICAgPSBmdW5jdGlvbigpe3RoaXMuZ2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuX2FWZXJ0ZXhDb2xvcik7fTtcbktHTC5wcm90b3R5cGUuZGlzYWJsZURlZmF1bHRUZXhDb29yZHNBdHRyaWJBcnJheSA9IGZ1bmN0aW9uKCl7dGhpcy5nbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fYVZlcnRleFRleENvb3JkKTt9O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBjb252ZW5pZW5jZSBkcmF3XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8vVE9ETzpyZW1vdmVcblxuS0dMLnByb3RvdHlwZS5ib3ggPSBmdW5jdGlvbih3aWR0aCxoZWlnaHQsZGVwdGgpXG57XG4gICAgdGhpcy5wdXNoTWF0cml4KCk7XG4gICAgdGhpcy5zY2FsZTNmKHdpZHRoLGhlaWdodCxkZXB0aCk7XG4gICAgdGhpcy5kcmF3RWxlbWVudHModGhpcy5fYlZlcnRleEN1YmUsdGhpcy5fYk5vcm1hbEN1YmUsdGhpcy5idWZmZXJDb2xvcnModGhpcy5fYkNvbG9yLHRoaXMuX2JDb2xvckN1YmUpLHRoaXMuX2JUZXhDb29yZEN1YmUsdGhpcy5fYkluZGV4Q3ViZSx0aGlzLl9kcmF3TW9kZSk7XG4gICAgdGhpcy5wb3BNYXRyaXgoKTtcblxuICAgIHRoaXMuX2RyYXdGdW5jTGFzdCA9IHRoaXMuYm94O1xufTtcblxuS0dMLnByb3RvdHlwZS5jdWJlID0gZnVuY3Rpb24oc2l6ZSlcbntcbiAgICBzaXplID0gc2l6ZSB8fCAxO1xuXG4gICAgdmFyIGN1YmVTY2FsZUxhc3QgICAgPSB0aGlzLl9jdWJlU2NhbGVMYXN0LFxuICAgICAgICBjdWJlVmVydGljZXNMYXN0ID0gdGhpcy5fYlZlcnRleEN1YmVTY2FsZWQ7XG5cbiAgICBpZih0aGlzLl9iVXNlRHJhd0VsZW1lbnRBcnJheUJhdGNoKVxuICAgIHtcbiAgICAgICAgdGhpcy5fcHVzaEVsZW1lbnRBcnJheUJhdGNoKChzaXplID09IGN1YmVTY2FsZUxhc3QpID8gY3ViZVZlcnRpY2VzTGFzdCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZVZlcnRpY2VzKHRoaXMuX2JWZXJ0ZXhDdWJlLHNpemUsY3ViZVZlcnRpY2VzTGFzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iTm9ybWFsQ3ViZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JDdWJlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JUZXhDb29yZEN1YmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iSW5kZXhDdWJlKTtcblxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygoc2l6ZSA9PSBjdWJlU2NhbGVMYXN0KSA/IGN1YmVWZXJ0aWNlc0xhc3QgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZVZlcnRpY2VzKHRoaXMuX2JWZXJ0ZXhDdWJlLHNpemUsY3ViZVZlcnRpY2VzTGFzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JOb3JtYWxDdWJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yQ3ViZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JUZXhDb29yZEN1YmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JJbmRleEN1YmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdNb2RlKTtcblxuICAgIH1cblxuXG4gICAgdGhpcy5fY3ViZVNjYWxlTGFzdCA9IHNpemU7XG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ICA9IHRoaXMuY3ViZTtcblxufTtcblxuS0dMLnByb3RvdHlwZS5zcGhlcmUgPSBmdW5jdGlvbihzaXplKVxue1xuICAgIHNpemUgPSBzaXplIHx8IDE7XG5cbiAgICB2YXIgc3BoZXJlU2NhbGVMYXN0ICAgICAgPSB0aGlzLl9zcGhlcmVTY2FsZUxhc3QsXG4gICAgICAgIHNwaGVyZVZlcnRpY2VzU2NhbGVkID0gdGhpcy5fYlZlcnRleFNwaGVyZVNjYWxlZDtcblxuICAgIGlmKHRoaXMuX2JVc2VEcmF3RWxlbWVudEFycmF5QmF0Y2gpXG4gICAge1xuICAgICAgICB0aGlzLl9wdXNoRWxlbWVudEFycmF5QmF0Y2goKHNpemUgPT0gc3BoZXJlU2NhbGVMYXN0KSA/IHNwaGVyZVZlcnRpY2VzU2NhbGVkIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlVmVydGljZXModGhpcy5fYlZlcnRleFNwaGVyZSxzaXplLHNwaGVyZVZlcnRpY2VzU2NhbGVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlckNvbG9ycyh0aGlzLl9iQ29sb3IsdGhpcy5fYkNvbG9yU3BoZXJlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JUZXhDb29yZHNTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iSW5kZXhTcGhlcmUpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50cygoc2l6ZSA9PSBzcGhlcmVTY2FsZUxhc3QpID8gc3BoZXJlVmVydGljZXNTY2FsZWQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2FsZVZlcnRpY2VzKHRoaXMuX2JWZXJ0ZXhTcGhlcmUsc2l6ZSxzcGhlcmVWZXJ0aWNlc1NjYWxlZCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JOb3JtYWxTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyQ29sb3JzKHRoaXMuX2JDb2xvcix0aGlzLl9iQ29sb3JTcGhlcmUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iVGV4Q29vcmRzU3BoZXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iSW5kZXhTcGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdNb2RlKTtcblxuICAgIH1cblxuICAgIHRoaXMuX3NwaGVyZVNjYWxlTGFzdCA9IHNpemU7XG4gICAgdGhpcy5fZHJhd0Z1bmNMYXN0ICAgID0gdGhpcy5zcGhlcmU7XG59O1xuXG4vL1RPRE86IHJlbW92ZSAhISEhISEhISEhISEhISFcblxuS0dMLnByb3RvdHlwZS5saW5lQm94ID0gZnVuY3Rpb24odjAsdjEpe3RoaXMubGluZUJveGYodjBbMF0sdjBbMV0sdjBbMl0sdjFbMF0sdjFbMV0sdjFbMl0pO307XG5cbktHTC5wcm90b3R5cGUubGluZUJveGYgPSBmdW5jdGlvbih4MCx5MCx6MCx4MSx5MSx6MSlcbntcblxuXG4gICAgdmFyIHAwID0gdGhpcy5fYlBvaW50MCxcbiAgICAgICAgcDEgPSB0aGlzLl9iUG9pbnQxLFxuICAgICAgICB1cCA9IHRoaXMuX2F4aXNZO1xuXG4gICAgVmVjMy5zZXQzZihwMCx4MCx5MCx6MCk7XG4gICAgVmVjMy5zZXQzZihwMSx4MSx5MSx6MSk7XG5cbiAgICB2YXIgbGVuID0gVmVjMy5kaXN0YW5jZShwMCxwMSksXG4gICAgICAgIG1pZCA9IFZlYzMuc2NhbGUoVmVjMy5hZGRlZChwMCxwMSksMC41KSxcbiAgICAgICAgZGlyID0gVmVjMy5ub3JtYWxpemUoVmVjMy5zdWJiZWQocDEscDApKSxcbiAgICAgICAgYyAgID0gVmVjMy5kb3QoZGlyLHVwKTtcblxuICAgIHZhciBhbmdsZSA9IE1hdGguYWNvcyhjKSxcbiAgICAgICAgYXhpcyAgPSBWZWMzLm5vcm1hbGl6ZShWZWMzLmNyb3NzKHVwLGRpcikpO1xuXG4gICAgdGhpcy5wdXNoTWF0cml4KCk7XG4gICAgdGhpcy50cmFuc2xhdGUobWlkKTtcbiAgICB0aGlzLnJvdGF0ZUF4aXMoYW5nbGUsYXhpcyk7XG4gICAgdGhpcy5ib3godGhpcy5fbGluZUJveFdpZHRoLGxlbix0aGlzLl9saW5lQm94SGVpZ2h0KTtcbiAgICB0aGlzLnBvcE1hdHJpeCgpO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gY29udmVuaWVuY2UgYmluZGluZ3MgZ2xcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuS0dMLnByb3RvdHlwZS5lbmFibGUgICAgICAgICAgICAgICAgPSBmdW5jdGlvbihpZCl7dGhpcy5nbC5lbmFibGUoaWQpO307XG5LR0wucHJvdG90eXBlLmRpc2FibGUgICAgICAgICAgICAgICA9IGZ1bmN0aW9uKGlkKXt0aGlzLmdsLmRpc2FibGUoaWQpO307XG5cbktHTC5wcm90b3R5cGUuYmxlbmRDb2xvciAgICAgICAgICAgID0gZnVuY3Rpb24ocixnLGIsYSl7dGhpcy5nbC5ibGVuZENvbG9yKHIsZyxiLGEpO307XG5LR0wucHJvdG90eXBlLmJsZW5kRXF1YXRpb24gICAgICAgICA9IGZ1bmN0aW9uKG1vZGUpe3RoaXMuZ2wuYmxlbmRFcXVhdGlvbihtb2RlKTt9O1xuS0dMLnByb3RvdHlwZS5ibGVuZEVxdWF0aW9uU2VwYXJhdGUgPSBmdW5jdGlvbihzZmFjdG9yLGRmYWN0b3Ipe3RoaXMuZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKHNmYWN0b3IsZGZhY3Rvcik7fTtcbktHTC5wcm90b3R5cGUuYmxlbmRGdW5jICAgICAgICAgICAgID0gZnVuY3Rpb24oc2ZhY3RvcixkZmFjdG9yKXt0aGlzLmdsLmJsZW5kRnVuYyhzZmFjdG9yLGRmYWN0b3IpO307XG5LR0wucHJvdG90eXBlLmJsZW5kRnVuY1NlcGFyYXRlICAgICA9IGZ1bmN0aW9uKHNyY1JHQixkc3RSR0Isc3JjQWxwaGEsZHN0QWxwaGEpe3RoaXMuZ2wuYmxlbmRGdW5jU2VwYXJhdGUoc3JjUkdCLGRzdFJHQixzcmNBbHBoYSxkc3RBbHBoYSk7fTtcbktHTC5wcm90b3R5cGUuZGVwdGhGdW5jICAgICAgICAgICAgID0gZnVuY3Rpb24oZnVuYyl7dGhpcy5nbC5kZXB0aEZ1bmMoZnVuYyk7fTtcbktHTC5wcm90b3R5cGUuc2FtcGxlQ292ZXJhZ2UgICAgICAgID0gZnVuY3Rpb24odmFsdWUsaW52ZXJ0KXt0aGlzLmdsLnNhbXBsZUNvdmVyYWdlKHZhbHVlLGludmVydCk7fTtcbktHTC5wcm90b3R5cGUuc3RlbmNpbEZ1bmMgICAgICAgICAgID0gZnVuY3Rpb24oZnVuYyxyZWYsbWFzayl7dGhpcy5nbC5zdGVuY2lsRnVuYyhmdW5jLHJlZixtYXNrKTt9O1xuS0dMLnByb3RvdHlwZS5zdGVuY2lsRnVuY1NlcGFyYXRlICAgPSBmdW5jdGlvbihmYWNlLGZ1bmMscmVmLG1hc2spe3RoaXMuZ2wuc3RlbmNpbEZ1bmNTZXBhcmF0ZShmYWNlLGZ1bmMscmVmLG1hc2spO307XG5LR0wucHJvdG90eXBlLnN0ZW5jaWxPcCAgICAgICAgICAgICA9IGZ1bmN0aW9uKGZhaWwsemZhaWwsenBhc3Mpe3RoaXMuZ2wuc3RlbmNpbE9wKGZhaWwsemZhaWwsenBhc3MpO307XG5LR0wucHJvdG90eXBlLnN0ZW5jaWxPcFNlcGFyYXRlICAgICA9IGZ1bmN0aW9uKGZhY2UsZmFpbCx6ZmFpbCx6cGFzcyl7dGhpcy5nbC5zdGVuY2lsT3BTZXBhcmF0ZShmYWNlLGZhaWwsemZhaWwsenBhc3MpO307XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIFdvcmxkIC0+IFNjcmVlblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vL1RPRE86IEZpeCBtZVxuS0dMLnByb3RvdHlwZS5nZXRTY3JlZW5Db29yZDNmID0gZnVuY3Rpb24oeCx5LHopXG57XG4gICAgdmFyIG1wbSA9IE1hdDQ0Lm11bHQodGhpcy5fY2FtZXJhLnByb2plY3Rpb25NYXRyaXgsdGhpcy5fbU1vZGVsVmlldyk7XG4gICAgdmFyIHAzZCA9IE1hdDQ0Lm11bHRWZWMzKG1wbSxWZWMzLm1ha2UoeCx5LHopKTtcblxuICAgIHZhciBic2MgPSB0aGlzLl9iU2NyZWVuQ29vcmRzO1xuICAgIGJzY1swXSA9ICgoKHAzZFswXSArIDEpICogMC41KSAqIHdpbmRvdy5pbm5lcldpZHRoKTtcbiAgICBic2NbMV0gPSAoKCgxIC0gcDNkWzFdKSAqIDAuNSkgKiB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgcmV0dXJuIGJzYztcbn07XG5cbktHTC5wcm90b3R5cGUuZ2V0U2NyZWVuQ29vcmQgPSBmdW5jdGlvbih2KVxue1xuICAgIHJldHVybiB0aGlzLmdldFNjcmVlbkNvb3JkM2YodlswXSx2WzFdLHZbMV0pO1xufTtcblxuXG5cblxuS0dMLnByb3RvdHlwZS5nZXRNb2RlbFZpZXdNYXRyaXggID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbU1vZGVsVmlldzt9O1xuS0dMLnByb3RvdHlwZS5nZXRQcm9qZWN0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY2FtZXJhLnByb2plY3Rpb25NYXRyaXg7fTtcblxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBLR0w7IiwidmFyIFZlYzMgID0gcmVxdWlyZSgnLi4vLi4vbWF0aC9nbGtWZWMzJyksXG4gICAgQ29sb3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2dsa0NvbG9yJyk7XG5cbnZhciBrR0xVdGlsID0ge307XG5cbmtHTFV0aWwuX19ncmlkU2l6ZUxhc3QgPSAtMTtcbmtHTFV0aWwuX19ncmlkVW5pdExhc3QgPSAtMTtcblxuXG5cbmtHTFV0aWwuZHJhd0dyaWQgPSBmdW5jdGlvbihrZ2wsc2l6ZSx1bml0KVxue1xuICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICB2YXIgaSAgPSAtMSxcbiAgICAgICAgc2ggPSBzaXplICogMC41ICogdW5pdDtcblxuICAgIHZhciB1aTtcblxuICAgIHdoaWxlKCsraSA8IHNpemUgKyAxKVxuICAgIHtcbiAgICAgICAgdWkgPSB1bml0ICogaTtcblxuICAgICAgICBrZ2wubGluZWYoLXNoLDAsLXNoICsgdWksc2gsMCwtc2grdWkpO1xuICAgICAgICBrZ2wubGluZWYoLXNoK3VpLDAsLXNoLC1zaCt1aSwwLHNoKTtcbiAgICB9XG59O1xuXG5rR0xVdGlsLmRyYXdBeGVzID0gZnVuY3Rpb24oa2dsLHVuaXQpXG57XG4gICAga2dsLmNvbG9yM2YoMSwwLDApO1xuICAgIGtnbC5saW5lZigwLDAsMCx1bml0LDAsMCk7XG4gICAga2dsLmNvbG9yM2YoMCwxLDApO1xuICAgIGtnbC5saW5lZigwLDAsMCwwLHVuaXQsMCk7XG4gICAga2dsLmNvbG9yM2YoMCwwLDEpO1xuICAgIGtnbC5saW5lZigwLDAsMCwwLDAsdW5pdCk7XG59O1xuXG5rR0xVdGlsLmRyYXdHcmlkQ3ViZSA9IGZ1bmN0aW9uKGtnbCxzaXplLHVuaXQpXG57XG4gICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgIHZhciBzaCAgPSBzaXplICogMC41ICogdW5pdCxcbiAgICAgICAgcGloID0gTWF0aC5QSSAqIDAuNTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKDAsLXNoLDApO1xuICAgIHRoaXMuZHJhd0dyaWQoa2dsLHNpemUsdW5pdCk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xuXG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wudHJhbnNsYXRlM2YoMCxzaCwwKTtcbiAgICBrZ2wucm90YXRlM2YoMCxwaWgsMCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZigwLDAsLXNoKTtcbiAgICBrZ2wucm90YXRlM2YocGloLDAsMCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZigwLDAsc2gpO1xuICAgIGtnbC5yb3RhdGUzZihwaWgsMCwwKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxuICAgIGtnbC5wdXNoTWF0cml4KCk7XG4gICAga2dsLnRyYW5zbGF0ZTNmKHNoLDAsMCk7XG4gICAga2dsLnJvdGF0ZTNmKHBpaCwwLHBpaCk7XG4gICAgdGhpcy5kcmF3R3JpZChrZ2wsc2l6ZSx1bml0KTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG5cbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC50cmFuc2xhdGUzZigtc2gsMCwwKTtcbiAgICBrZ2wucm90YXRlM2YocGloLDAscGloKTtcbiAgICB0aGlzLmRyYXdHcmlkKGtnbCxzaXplLHVuaXQpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcblxufTtcblxuXG5rR0xVdGlsLnB5cmFtaWQgPSBmdW5jdGlvbihrZ2wsc2l6ZSlcbntcbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC5zY2FsZTNmKHNpemUsc2l6ZSxzaXplKTtcbiAgICBrZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4UHlyYW1pZCx0aGlzLl9fYk5vcm1hbFB5cmFtaWQsa2dsLmJ1ZmZlckNvbG9ycyhrZ2wuX2JDb2xvcix0aGlzLl9fYkNvbG9yUHlyYW1pZCksbnVsbCx0aGlzLl9fYkluZGV4UHlyYW1pZCxrZ2wuX2RyYXdNb2RlKTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG59O1xuXG5cblxua0dMVXRpbC5vY3RhaGVkcm9uID0gZnVuY3Rpb24oa2dsLHNpemUpXG57XG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wuc2NhbGUzZihzaXplLHNpemUsc2l6ZSk7XG4gICAga2dsLmRyYXdFbGVtZW50cyh0aGlzLl9fYlZlcnRleE9jdGFoZWRyb24sIHRoaXMuX19iTm9ybWFsT2N0YWhlZHJvbixrZ2wuYnVmZmVyQ29sb3JzKGtnbC5fYkNvbG9yLCB0aGlzLl9fYkNvbG9yT2N0YWhlZHJvbiksbnVsbCwgdGhpcy5fX2JJbmRleE9jdGFoZWRyb24sa2dsLl9kcmF3TW9kZSk7XG4gICAga2dsLnBvcE1hdHJpeCgpO1xufTtcblxuLypcbnZhciBrR0xVdGlsID1cbntcblxuICAgIGRyYXdHcmlkIDogZnVuY3Rpb24oZ2wsc2l6ZSx1bml0KVxuICAgIHtcbiAgICAgICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgICAgICB2YXIgaSAgPSAtMSxcbiAgICAgICAgICAgIHNoID0gc2l6ZSAqIDAuNSAqIHVuaXQ7XG5cbiAgICAgICAgdmFyIHVpO1xuXG4gICAgICAgIHdoaWxlKCsraSA8IHNpemUgKyAxKVxuICAgICAgICB7XG4gICAgICAgICAgICB1aSA9IHVuaXQgKiBpO1xuXG4gICAgICAgICAgICBnbC5saW5lZigtc2gsMCwtc2ggKyB1aSxzaCwwLC1zaCt1aSk7XG4gICAgICAgICAgICBnbC5saW5lZigtc2grdWksMCwtc2gsLXNoK3VpLDAsc2gpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZHJhd0dyaWRDdWJlIDogZnVuY3Rpb24oZ2wsc2l6ZSx1bml0KVxuICAgIHtcbiAgICAgICAgdW5pdCA9IHVuaXQgfHwgMTtcblxuICAgICAgICB2YXIgc2ggID0gc2l6ZSAqIDAuNSAqIHVuaXQsXG4gICAgICAgICAgICBwaWggPSBNYXRoLlBJICogMC41O1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2YoMCwtc2gsMCk7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoZ2wsc2l6ZSx1bml0KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC50cmFuc2xhdGUzZigwLHNoLDApO1xuICAgICAgICBnbC5yb3RhdGUzZigwLHBpaCwwKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKDAsMCwtc2gpO1xuICAgICAgICBnbC5yb3RhdGUzZihwaWgsMCwwKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKDAsMCxzaCk7XG4gICAgICAgIGdsLnJvdGF0ZTNmKHBpaCwwLDApO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlM2Yoc2gsMCwwKTtcbiAgICAgICAgZ2wucm90YXRlM2YocGloLDAscGloKTtcbiAgICAgICAgdGhpcy5kcmF3R3JpZChnbCxzaXplLHVuaXQpO1xuICAgICAgICBnbC5wb3BNYXRyaXgoKTtcblxuICAgICAgICBnbC5wdXNoTWF0cml4KCk7XG4gICAgICAgIGdsLnRyYW5zbGF0ZTNmKC1zaCwwLDApO1xuICAgICAgICBnbC5yb3RhdGUzZihwaWgsMCxwaWgpO1xuICAgICAgICB0aGlzLmRyYXdHcmlkKGdsLHNpemUsdW5pdCk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuXG4gICAgfSxcblxuXG4gICAgZHJhd0F4ZXMgOiBmdW5jdGlvbihnbCx1bml0KVxuICAgIHtcbiAgICAgICAgZ2wuY29sb3IzZigxLDAsMCk7XG4gICAgICAgIGdsLmxpbmVmKDAsMCwwLHVuaXQsMCwwKTtcbiAgICAgICAgZ2wuY29sb3IzZigwLDEsMCk7XG4gICAgICAgIGdsLmxpbmVmKDAsMCwwLDAsdW5pdCwwKTtcbiAgICAgICAgZ2wuY29sb3IzZigwLDAsMSk7XG4gICAgICAgIGdsLmxpbmVmKDAsMCwwLDAsMCx1bml0KTtcbiAgICB9LFxuXG5cbiAgICAvL3RlbXBcbiAgICBkcmF3VmVjdG9yZiA6IGZ1bmN0aW9uKGdsLHgwLHkwLHowLHgxLHkxLHoxKVxuICAgIHtcbiAgICAgICBcblxuICAgICAgICB2YXIgcDAgPSBnbC5fYlBvaW50MCxcbiAgICAgICAgICAgIHAxID0gZ2wuX2JQb2ludDEsXG4gICAgICAgICAgICB1cCA9IGdsLl9heGlzWTtcblxuICAgICAgICBWZWMzLnNldDNmKHAwLHgwLHkwLHowKTtcbiAgICAgICAgVmVjMy5zZXQzZihwMSx4MSx5MSx6MSk7XG5cbiAgICAgICAgdmFyIHB3ID0gZ2wuX2xpbmVCb3hXaWR0aCxcbiAgICAgICAgICAgIHBoID0gZ2wuX2xpbmVCb3hIZWlnaHQsXG4gICAgICAgICAgICBwZCA9IGdsLl9kcmF3TW9kZTtcblxuICAgICAgICB2YXIgbGVuID0gVmVjMy5kaXN0YW5jZShwMCxwMSksXG4gICAgICAgICAgICBtaWQgPSBWZWMzLnNjYWxlKFZlYzMuYWRkZWQocDAscDEpLDAuNSksXG4gICAgICAgICAgICBkaXIgPSBWZWMzLm5vcm1hbGl6ZShWZWMzLnN1YmJlZChwMSxwMCkpLFxuICAgICAgICAgICAgYyAgID0gVmVjMy5kb3QoZGlyLHVwKTtcblxuICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmFjb3MoYyksXG4gICAgICAgICAgICBheGlzICA9IFZlYzMubm9ybWFsaXplKFZlYzMuY3Jvc3ModXAsZGlyKSk7XG5cblxuICAgICAgICBnbC5kcmF3TW9kZShnbC5MSU5FUyk7XG5cbiAgICAgICAgZ2wubGluZWYoeDAseTAsejAseDEseTEsejEpO1xuXG4gICAgICAgIGdsLmRyYXdNb2RlKGdsLlRSSUFOR0xFUyk7XG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wudHJhbnNsYXRlKHAxKTtcbiAgICAgICAgZ2wucm90YXRlQXhpcyhhbmdsZSxheGlzKTtcbiAgICAgICAgdGhpcy5weXJhbWlkKGdsLDAuMDI1KTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG5cbiAgICAgICAgZ2wubGluZVNpemUocHcscGgpO1xuICAgICAgICBnbC5kcmF3TW9kZShwZCk7XG4gICAgfSxcblxuICAgIGRyYXdWZWN0b3IgOiBmdW5jdGlvbihnbCx2MCx2MSlcbiAgICB7XG4gICAgICAgdGhpcy5kcmF3VmVjdG9yZihnbCx2MFswXSx2MFsxXSx2MFsyXSx2MVswXSx2MVsxXSx2MVsyXSk7XG4gICAgfSxcblxuICAgIHB5cmFtaWQgOiBmdW5jdGlvbihnbCxzaXplKVxuICAgIHtcbiAgICAgICAgZ2wucHVzaE1hdHJpeCgpO1xuICAgICAgICBnbC5zY2FsZTNmKHNpemUsc2l6ZSxzaXplKTtcbiAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4UHlyYW1pZCx0aGlzLl9fYk5vcm1hbFB5cmFtaWQsZ2wuZmlsbENvbG9yQnVmZmVyKGdsLl9iQ29sb3IsdGhpcy5fX2JDb2xvclB5cmFtaWQpLG51bGwsdGhpcy5fX2JJbmRleFB5cmFtaWQsZ2wuX2RyYXdNb2RlKTtcbiAgICAgICAgZ2wucG9wTWF0cml4KCk7XG4gICAgfSxcblxuXG5cbiAgICBvY3RhaGVkcm9uIDogZnVuY3Rpb24oZ2wsc2l6ZSlcbiAgICB7XG4gICAgICAgIGdsLnB1c2hNYXRyaXgoKTtcbiAgICAgICAgZ2wuc2NhbGUzZihzaXplLHNpemUsc2l6ZSk7XG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyh0aGlzLl9fYlZlcnRleE9jdGFoZWRyb24sIHRoaXMuX19iTm9ybWFsT2N0YWhlZHJvbixnbC5maWxsQ29sb3JCdWZmZXIoZ2wuX2JDb2xvciwgdGhpcy5fX2JDb2xvck9jdGFoZWRyb24pLG51bGwsIHRoaXMuX19iSW5kZXhPY3RhaGVkcm9uLGdsLl9kcmF3TW9kZSk7XG4gICAgICAgIGdsLnBvcE1hdHJpeCgpO1xuICAgIH1cbn07XG4qL1xuXG5rR0xVdGlsLl9fYlZlcnRleE9jdGFoZWRyb24gPSBuZXcgRmxvYXQzMkFycmF5KFstMC43MDcsMCwwLCAwLDAuNzA3LDAsIDAsMCwtMC43MDcsIDAsMCwwLjcwNywgMCwtMC43MDcsMCwgMC43MDcsMCwwXSk7XG5rR0xVdGlsLl9fYk5vcm1hbE9jdGFoZWRyb24gPSBuZXcgRmxvYXQzMkFycmF5KFsxLCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIDEsIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIDEuNDE5NDk2MDc2MjM4MTQ3ZS05XSk7XG5rR0xVdGlsLl9fYkNvbG9yT2N0YWhlZHJvbiAgPSBuZXcgRmxvYXQzMkFycmF5KGtHTFV0aWwuX19iVmVydGV4T2N0YWhlZHJvbi5sZW5ndGggLyBWZWMzLlNJWkUgKiBDb2xvci5TSVpFKTtcbmtHTFV0aWwuX19iSW5kZXhPY3RhaGVkcm9uICA9IG5ldyBVaW50MTZBcnJheShbMyw0LDUsMyw1LDEsMywxLDAsMywwLDQsNCwwLDIsNCwyLDUsMiwwLDEsNSwyLDFdKTtcbmtHTFV0aWwuX19iVmVydGV4UHlyYW1pZCAgICA9IG5ldyBGbG9hdDMyQXJyYXkoWyAwLjAsMS4wLDAuMCwtMS4wLC0xLjAsMS4wLDEuMCwtMS4wLDEuMCwwLjAsMS4wLDAuMCwxLjAsLTEuMCwxLjAsMS4wLC0xLjAsLTEuMCwwLjAsMS4wLDAuMCwxLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwtMS4wLDAuMCwxLjAsMC4wLC0xLjAsLTEuMCwtMS4wLC0xLjAsLTEuMCwxLjAsLTEuMCwtMS4wLDEuMCwxLjAsLTEuMCwxLjAsMS4wLC0xLjAsLTEuMCwtMS4wLC0xLjAsLTEuMF0pO1xua0dMVXRpbC5fX2JOb3JtYWxQeXJhbWlkICAgID0gbmV3IEZsb2F0MzJBcnJheShbMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgLTAuODk0NDI3MTgwMjkwMjIyMiwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgLTAuODk0NDI3MTgwMjkwMjIyMiwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgLTAuODk0NDI3MTgwMjkwMjIyMiwgLTAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgLTAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgLTAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAuODk0NDI3MTgwMjkwMjIyMiwgMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgMCwgMCwgMCwgMCwgLTEsIDAsIDAsIDAsIDAsIDAsIDEsIDBdKTtcbmtHTFV0aWwuX19iQ29sb3JQeXJhbWlkICAgICA9IG5ldyBGbG9hdDMyQXJyYXkoa0dMVXRpbC5fX2JWZXJ0ZXhQeXJhbWlkLmxlbmd0aCAvIFZlYzMuU0laRSAqIENvbG9yLlNJWkUpO1xua0dMVXRpbC5fX2JJbmRleFB5cmFtaWQgICAgID0gbmV3IFVpbnQxNkFycmF5KFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsMTIsMTMsMTQsMTIsMTUsMTRdKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrR0xVdGlsOyIsIlxuLy9mb3Igbm9kZSBkZWJ1Z1xudmFyIE1hdDMzID1cbntcbiAgICBtYWtlIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMCwwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwxLDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLDAsMV0pO1xuICAgIH0sXG5cbiAgICB0cmFuc3Bvc2UgOiBmdW5jdGlvbihvdXQsYSlcbiAgICB7XG5cbiAgICAgICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICAgICAgdmFyIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMiA9IGFbNV07XG4gICAgICAgICAgICBvdXRbMV0gPSBhWzNdO1xuICAgICAgICAgICAgb3V0WzJdID0gYVs2XTtcbiAgICAgICAgICAgIG91dFszXSA9IGEwMTtcbiAgICAgICAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICAgICAgICBvdXRbNl0gPSBhMDI7XG4gICAgICAgICAgICBvdXRbN10gPSBhMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgICAgICBvdXRbM10gPSBhWzFdO1xuICAgICAgICAgICAgb3V0WzRdID0gYVs0XTtcbiAgICAgICAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICAgICAgICBvdXRbNl0gPSBhWzJdO1xuICAgICAgICAgICAgb3V0WzddID0gYVs1XTtcbiAgICAgICAgICAgIG91dFs4XSA9IGFbOF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXQzMzsiLCJ2YXIga01hdGggPSByZXF1aXJlKCcuL2dsa01hdGgnKSxcbiAgICBNYXQzMyA9IHJlcXVpcmUoJy4vZ2xrTWF0MzMnKTtcblxuLy9mb3Igbm9kZSBkZWJ1Z1xudmFyIE1hdDQ0ID1cbntcbiAgICBtYWtlIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyAxLCAwLCAwLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDEsIDAsIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxIF0pO1xuICAgIH0sXG5cbiAgICBpZGVudGl0eSA6IGZ1bmN0aW9uKG0pXG4gICAge1xuICAgICAgICBtWyAwXSA9IDE7IG1bIDFdID0gbVsgMl0gPSBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDVdID0gMTsgbVsgNF0gPSBtWyA2XSA9IG1bIDddID0gMDtcbiAgICAgICAgbVsxMF0gPSAxOyBtWyA4XSA9IG1bIDldID0gbVsxMV0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7IG1bMTJdID0gbVsxM10gPSBtWzE0XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIGNvcHkgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkobSk7XG4gICAgfSxcblxuICAgIG1ha2VTY2FsZSA6IGZ1bmN0aW9uKHN4LHN5LHN6LG0pXG4gICAge1xuICAgICAgICBtID0gbSB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICBtWzBdICA9IHN4O1xuICAgICAgICBtWzVdICA9IHN5O1xuICAgICAgICBtWzEwXSA9IHN6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlVHJhbnNsYXRlIDogZnVuY3Rpb24odHgsdHksdHosbSlcbiAgICB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIG1bMTJdID0gdHg7XG4gICAgICAgIG1bMTNdID0gdHk7XG4gICAgICAgIG1bMTRdID0gdHo7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG1ha2VSb3RhdGlvblggOiBmdW5jdGlvbihhLG0pXG4gICAge1xuICAgICAgICBtID0gbSB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYSksXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhKTtcblxuICAgICAgICBtWzVdICA9IGNvcztcbiAgICAgICAgbVs2XSAgPSAtc2luO1xuICAgICAgICBtWzldICA9IHNpbjtcbiAgICAgICAgbVsxMF0gPSBjb3M7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIG1ha2VSb3RhdGlvblkgOiBmdW5jdGlvbihhLG0pXG4gICAge1xuICAgICAgICBtID0gbSB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYSksXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhhKTtcblxuICAgICAgICBtWzBdID0gY29zO1xuICAgICAgICBtWzJdID0gc2luO1xuICAgICAgICBtWzhdID0gLXNpbjtcbiAgICAgICAgbVsxMF09IGNvcztcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbWFrZVJvdGF0aW9uWiA6IGZ1bmN0aW9uKGEsbSlcbiAgICB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihhKSxcbiAgICAgICAgICAgIGNvcyA9IE1hdGguY29zKGEpO1xuXG4gICAgICAgIG1bMF0gPSBjb3M7XG4gICAgICAgIG1bMV0gPSBzaW47XG4gICAgICAgIG1bNF0gPSAtc2luO1xuICAgICAgICBtWzVdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtYWtlUm90YXRpb25YWVogOiBmdW5jdGlvbihheCxheSxheixtKVxuICAgIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdmFyIGNvc3ggPSBNYXRoLmNvcyhheCksXG4gICAgICAgICAgICBzaW54ID0gTWF0aC5zaW4oYXgpLFxuICAgICAgICAgICAgY29zeSA9IE1hdGguY29zKGF5KSxcbiAgICAgICAgICAgIHNpbnkgPSBNYXRoLnNpbihheSksXG4gICAgICAgICAgICBjb3N6ID0gTWF0aC5jb3MoYXopLFxuICAgICAgICAgICAgc2lueiA9IE1hdGguc2luKGF6KTtcblxuICAgICAgICBtWyAwXSA9ICBjb3N5KmNvc3o7XG4gICAgICAgIG1bIDFdID0gLWNvc3gqc2lueitzaW54KnNpbnkqY29zejtcbiAgICAgICAgbVsgMl0gPSAgc2lueCpzaW56K2Nvc3gqc2lueSpjb3N6O1xuXG4gICAgICAgIG1bIDRdID0gIGNvc3kqc2luejtcbiAgICAgICAgbVsgNV0gPSAgY29zeCpjb3N6K3Npbngqc2lueSpzaW56O1xuICAgICAgICBtWyA2XSA9IC1zaW54KmNvc3orY29zeCpzaW55KnNpbno7XG5cbiAgICAgICAgbVsgOF0gPSAtc2lueTtcbiAgICAgICAgbVsgOV0gPSAgc2lueCpjb3N5O1xuICAgICAgICBtWzEwXSA9ICBjb3N4KmNvc3k7XG5cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgLy90ZW1wIGZyb20gZ2xNYXRyaXhcbiAgICBtYWtlUm90YXRpb25PbkF4aXMgOiBmdW5jdGlvbihyb3QseCx5LHosb3V0KVxuICAgIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuXG4gICAgICAgIGlmKE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopIDwga01hdGguRVBTSUxPTikgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIHZhciBzLCBjLCB0LFxuICAgICAgICAgICAgYTAwLCBhMDEsIGEwMiwgYTAzLFxuICAgICAgICAgICAgYTEwLCBhMTEsIGExMiwgYTEzLFxuICAgICAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzLFxuICAgICAgICAgICAgYjAwLCBiMDEsIGIwMixcbiAgICAgICAgICAgIGIxMCwgYjExLCBiMTIsXG4gICAgICAgICAgICBiMjAsIGIyMSwgYjIyO1xuXG5cbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeCAqPSBsZW47XG4gICAgICAgIHkgKj0gbGVuO1xuICAgICAgICB6ICo9IGxlbjtcblxuICAgICAgICBzID0gTWF0aC5zaW4ocm90KTtcbiAgICAgICAgYyA9IE1hdGguY29zKHJvdCk7XG4gICAgICAgIHQgPSAxIC0gYztcblxuICAgICAgICBvdXQgPSBvdXQgfHwgTWF0NDQubWFrZSgpO1xuXG4gICAgICAgIGEwMCA9IDE7IGEwMSA9IDA7IGEwMiA9IDA7IGEwMyA9IDA7XG4gICAgICAgIGExMCA9IDA7IGExMSA9IDE7IGExMiA9IDA7IGExMyA9IDA7XG4gICAgICAgIGEyMCA9IDA7IGEyMSA9IDA7IGEyMiA9IDE7IGEyMyA9IDA7XG5cbiAgICAgICAgYjAwID0geCAqIHggKiB0ICsgYzsgYjAxID0geSAqIHggKiB0ICsgeiAqIHM7IGIwMiA9IHogKiB4ICogdCAtIHkgKiBzO1xuICAgICAgICBiMTAgPSB4ICogeSAqIHQgLSB6ICogczsgYjExID0geSAqIHkgKiB0ICsgYzsgYjEyID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgICAgIGIyMCA9IHggKiB6ICogdCArIHkgKiBzOyBiMjEgPSB5ICogeiAqIHQgLSB4ICogczsgYjIyID0geiAqIHogKiB0ICsgYztcblxuICAgICAgICBvdXRbMCBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyO1xuICAgICAgICBvdXRbMSBdID0gYTAxICogYjAwICsgYTExICogYjAxICsgYTIxICogYjAyO1xuICAgICAgICBvdXRbMiBdID0gYTAyICogYjAwICsgYTEyICogYjAxICsgYTIyICogYjAyO1xuICAgICAgICBvdXRbMyBdID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyO1xuICAgICAgICBvdXRbNCBdID0gYTAwICogYjEwICsgYTEwICogYjExICsgYTIwICogYjEyO1xuICAgICAgICBvdXRbNSBdID0gYTAxICogYjEwICsgYTExICogYjExICsgYTIxICogYjEyO1xuICAgICAgICBvdXRbNiBdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyO1xuICAgICAgICBvdXRbNyBdID0gYTAzICogYjEwICsgYTEzICogYjExICsgYTIzICogYjEyO1xuICAgICAgICBvdXRbOCBdID0gYTAwICogYjIwICsgYTEwICogYjIxICsgYTIwICogYjIyO1xuICAgICAgICBvdXRbOSBdID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyO1xuICAgICAgICBvdXRbMTBdID0gYTAyICogYjIwICsgYTEyICogYjIxICsgYTIyICogYjIyO1xuICAgICAgICBvdXRbMTFdID0gYTAzICogYjIwICsgYTEzICogYjIxICsgYTIzICogYjIyO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG59LFxuXG4gICAgbXVsdFByZSA6IGZ1bmN0aW9uKG0wLG0xLG0pXG4gICAge1xuICAgICAgICBtID0gbSB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2YXIgbTAwMCA9IG0wWyAwXSxtMDAxID0gbTBbIDFdLG0wMDIgPSBtMFsgMl0sbTAwMyA9IG0wWyAzXSxcbiAgICAgICAgICAgIG0wMDQgPSBtMFsgNF0sbTAwNSA9IG0wWyA1XSxtMDA2ID0gbTBbIDZdLG0wMDcgPSBtMFsgN10sXG4gICAgICAgICAgICBtMDA4ID0gbTBbIDhdLG0wMDkgPSBtMFsgOV0sbTAxMCA9IG0wWzEwXSxtMDExID0gbTBbMTFdLFxuICAgICAgICAgICAgbTAxMiA9IG0wWzEyXSxtMDEzID0gbTBbMTNdLG0wMTQgPSBtMFsxNF0sbTAxNSA9IG0wWzE1XTtcblxuICAgICAgICB2YXIgbTEwMCA9IG0xWyAwXSxtMTAxID0gbTFbIDFdLG0xMDIgPSBtMVsgMl0sbTEwMyA9IG0xWyAzXSxcbiAgICAgICAgICAgIG0xMDQgPSBtMVsgNF0sbTEwNSA9IG0xWyA1XSxtMTA2ID0gbTFbIDZdLG0xMDcgPSBtMVsgN10sXG4gICAgICAgICAgICBtMTA4ID0gbTFbIDhdLG0xMDkgPSBtMVsgOV0sbTExMCA9IG0xWzEwXSxtMTExID0gbTFbMTFdLFxuICAgICAgICAgICAgbTExMiA9IG0xWzEyXSxtMTEzID0gbTFbMTNdLG0xMTQgPSBtMVsxNF0sbTExNSA9IG0xWzE1XTtcblxuICAgICAgICBtWyAwXSA9IG0wMDAqbTEwMCArIG0wMDEqbTEwNCArIG0wMDIqbTEwOCArIG0wMDMqbTExMjtcbiAgICAgICAgbVsgMV0gPSBtMDAwKm0xMDEgKyBtMDAxKm0xMDUgKyBtMDAyKm0xMDkgKyBtMDAzKm0xMTM7XG4gICAgICAgIG1bIDJdID0gbTAwMCptMTAyICsgbTAwMSptMTA2ICsgbTAwMiptMTEwICsgbTAwMyptMTE0O1xuICAgICAgICBtWyAzXSA9IG0wMDAqbTEwMyArIG0wMDEqbTEwNyArIG0wMDIqbTExMSArIG0wMDMqbTExNTtcblxuICAgICAgICBtWyA0XSA9IG0wMDQqbTEwMCArIG0wMDUqbTEwNCArIG0wMDYqbTEwOCArIG0wMDcqbTExMjtcbiAgICAgICAgbVsgNV0gPSBtMDA0Km0xMDEgKyBtMDA1Km0xMDUgKyBtMDA2Km0xMDkgKyBtMDA3Km0xMTM7XG4gICAgICAgIG1bIDZdID0gbTAwNCptMTAyICsgbTAwNSptMTA2ICsgbTAwNiptMTEwICsgbTAwNyptMTE0O1xuICAgICAgICBtWyA3XSA9IG0wMDQqbTEwMyArIG0wMDUqbTEwNyArIG0wMDYqbTExMSArIG0wMDcqbTExNTtcblxuICAgICAgICBtWyA4XSA9IG0wMDgqbTEwMCArIG0wMDkqbTEwNCArIG0wMTAqbTEwOCArIG0wMTEqbTExMjtcbiAgICAgICAgbVsgOV0gPSBtMDA4Km0xMDEgKyBtMDA5Km0xMDUgKyBtMDEwKm0xMDkgKyBtMDExKm0xMTM7XG4gICAgICAgIG1bMTBdID0gbTAwOCptMTAyICsgbTAwOSptMTA2ICsgbTAxMCptMTEwICsgbTAxMSptMTE0O1xuICAgICAgICBtWzExXSA9IG0wMDgqbTEwMyArIG0wMDkqbTEwNyArIG0wMTAqbTExMSArIG0wMTEqbTExNTtcblxuICAgICAgICBtWzEyXSA9IG0wMTIqbTEwMCArIG0wMTMqbTEwNCArIG0wMTQqbTEwOCArIG0wMTUqbTExMjtcbiAgICAgICAgbVsxM10gPSBtMDEyKm0xMDEgKyBtMDEzKm0xMDUgKyBtMDE0Km0xMDkgKyBtMDE1Km0xMTM7XG4gICAgICAgIG1bMTRdID0gbTAxMiptMTAyICsgbTAxMyptMTA2ICsgbTAxNCptMTEwICsgbTAxNSptMTE0O1xuICAgICAgICBtWzE1XSA9IG0wMTIqbTEwMyArIG0wMTMqbTEwNyArIG0wMTQqbTExMSArIG0wMTUqbTExNTtcblxuXG5cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgbXVsdCA6IGZ1bmN0aW9uKG0wLG0xLG0pXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0UHJlKG0wLG0xKTtcbiAgICB9LFxuXG4gICAgbXVsdFBvc3QgOiBmdW5jdGlvbihtMCxtMSxtKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdFByZShtMSxtMCxtKTtcbiAgICB9LFxuXG4gICAgaW52ZXJ0ZWQgOiBmdW5jdGlvbihtKVxuICAgIHtcbiAgICAgICAgdmFyIGludiA9IHRoaXMubWFrZSgpO1xuICAgICAgICBpbnZbMF0gPSAgIG1bNV0gKiBtWzEwXSAqIG1bMTVdIC0gbVs1XSAqIG1bMTFdICogbVsxNF0gLSBtWzldICogbVs2XSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bOV0gKiBtWzddICogbVsxNF0gKyBtWzEzXSAqIG1bNl0gKiBtWzExXSAtIG1bMTNdICogbVs3XSAqIG1bMTBdO1xuICAgICAgICBpbnZbNF0gPSAgLW1bNF0gKiBtWzEwXSAqIG1bMTVdICsgbVs0XSAqIG1bMTFdICogbVsxNF0gKyBtWzhdICogbVs2XSAqIG1bMTVdICtcbiAgICAgICAgICAgIG1bOF0gKiBtWzddICogbVsxNF0gLSBtWzEyXSAqIG1bNl0gKiBtWzExXSArIG1bMTJdICogbVs3XSAqIG1bMTBdO1xuICAgICAgICBpbnZbOF0gPSAgIG1bNF0gKiBtWzldICogbVsxNV0gLSBtWzRdICogbVsxMV0gKiBtWzEzXSAtIG1bOF0gKiBtWzVdICogbVsxNV1cbiAgICAgICAgICAgICsgbVs4XSAqIG1bN10gKiBtWzEzXSArIG1bMTJdICogbVs1XSAqIG1bMTFdIC0gbVsxMl0gKiBtWzddICogbVs5XTtcbiAgICAgICAgaW52WzEyXSA9IC1tWzRdICogbVs5XSAqIG1bMTRdICsgbVs0XSAqIG1bMTBdICogbVsxM10gKyBtWzhdICogbVs1XSAqIG1bMTRdICtcbiAgICAgICAgICAgIG1bOF0gKiBtWzZdICogbVsxM10gLSBtWzEyXSAqIG1bNV0gKiBtWzEwXSArIG1bMTJdICogbVs2XSAqIG1bOV07XG4gICAgICAgIGludlsxXSA9ICAtbVsxXSAqIG1bMTBdICogbVsxNV0gKyBtWzFdICogbVsxMV0gKiBtWzE0XSArIG1bOV0gKiBtWzJdICogbVsxNV0gK1xuICAgICAgICAgICAgbVs5XSAqIG1bM10gKiBtWzE0XSAtIG1bMTNdICogbVsyXSAqIG1bMTFdICsgbVsxM10gKiBtWzNdICogbVsxMF07XG4gICAgICAgIGludls1XSA9ICBtWzBdICogbVsxMF0gKiBtWzE1XSAtIG1bMF0gKiBtWzExXSAqIG1bMTRdIC0gbVs4XSAqIG1bMl0gKiBtWzE1XVxuICAgICAgICAgICAgKyBtWzhdICogbVszXSAqIG1bMTRdICsgbVsxMl0gKiBtWzJdICogbVsxMV0gLSBtWzEyXSAqIG1bM10gKiBtWzEwXTtcbiAgICAgICAgaW52WzldID0gLW1bMF0gKiBtWzldICogbVsxNV0gKyBtWzBdICogbVsxMV0gKiBtWzEzXSArIG1bOF0gKiBtWzFdICogbVsxNV1cbiAgICAgICAgICAgIC0gbVs4XSAqIG1bM10gKiBtWzEzXSAtIG1bMTJdICogbVsxXSAqIG1bMTFdICsgbVsxMl0gKiBtWzNdICogbVs5XTtcbiAgICAgICAgaW52WzEzXSA9IG1bMF0gKiBtWzldICogbVsxNF0gLSBtWzBdICogbVsxMF0gKiBtWzEzXSAtIG1bOF0gKiBtWzFdICogbVsxNF1cbiAgICAgICAgICAgICsgbVs4XSAqIG1bMl0gKiBtWzEzXSArIG1bMTJdICogbVsxXSAqIG1bMTBdIC0gbVsxMl0gKiBtWzJdICogbVs5XTtcbiAgICAgICAgaW52WzJdID0gbVsxXSAqIG1bNl0gKiBtWzE1XSAtIG1bMV0gKiBtWzddICogbVsxNF0gLSBtWzVdICogbVsyXSAqIG1bMTVdXG4gICAgICAgICAgICArIG1bNV0gKiBtWzNdICogbVsxNF0gKyBtWzEzXSAqIG1bMl0gKiBtWzddIC0gbVsxM10gKiBtWzNdICogbVs2XTtcbiAgICAgICAgaW52WzZdID0gLW1bMF0gKiBtWzZdICogbVsxNV0gKyBtWzBdICogbVs3XSAqIG1bMTRdICsgbVs0XSAqIG1bMl0gKiBtWzE1XVxuICAgICAgICAgICAgLSBtWzRdICogbVszXSAqIG1bMTRdIC0gbVsxMl0gKiBtWzJdICogbVs3XSArIG1bMTJdICogbVszXSAqIG1bNl07XG4gICAgICAgIGludlsxMF0gPSBtWzBdICogbVs1XSAqIG1bMTVdIC0gbVswXSAqIG1bN10gKiBtWzEzXSAtIG1bNF0gKiBtWzFdICogbVsxNV1cbiAgICAgICAgICAgICsgbVs0XSAqIG1bM10gKiBtWzEzXSArIG1bMTJdICogbVsxXSAqIG1bN10gLSBtWzEyXSAqIG1bM10gKiBtWzVdO1xuICAgICAgICBpbnZbMTRdID0gLW1bMF0gKiBtWzVdICogbVsxNF0gKyBtWzBdICogbVs2XSAqIG1bMTNdICsgbVs0XSAqIG1bMV0gKiBtWzE0XVxuICAgICAgICAgICAgLSBtWzRdICogbVsyXSAqIG1bMTNdIC0gbVsxMl0gKiBtWzFdICogbVs2XSArIG1bMTJdICogbVsyXSAqIG1bNV07XG4gICAgICAgIGludlszXSA9IC1tWzFdICogbVs2XSAqIG1bMTFdICsgbVsxXSAqIG1bN10gKiBtWzEwXSArIG1bNV0gKiBtWzJdICogbVsxMV1cbiAgICAgICAgICAgIC0gbVs1XSAqIG1bM10gKiBtWzEwXSAtIG1bOV0gKiBtWzJdICogbVs3XSArIG1bOV0gKiBtWzNdICogbVs2XTtcbiAgICAgICAgaW52WzddID0gbVswXSAqIG1bNl0gKiBtWzExXSAtIG1bMF0gKiBtWzddICogbVsxMF0gLSBtWzRdICogbVsyXSAqIG1bMTFdXG4gICAgICAgICAgICArIG1bNF0gKiBtWzNdICogbVsxMF0gKyBtWzhdICogbVsyXSAqIG1bN10gLSBtWzhdICogbVszXSAqIG1bNl07XG4gICAgICAgIGludlsxMV0gPSAtbVswXSAqIG1bNV0gKiBtWzExXSArIG1bMF0gKiBtWzddICogbVs5XSArIG1bNF0gKiBtWzFdICogbVsxMV1cbiAgICAgICAgICAgIC0gbVs0XSAqIG1bM10gKiBtWzldIC0gbVs4XSAqIG1bMV0gKiBtWzddICsgbVs4XSAqIG1bM10gKiBtWzVdO1xuICAgICAgICBpbnZbMTVdID0gbVswXSAqIG1bNV0gKiBtWzEwXSAtIG1bMF0gKiBtWzZdICogbVs5XSAtIG1bNF0gKiBtWzFdICogbVsxMF1cbiAgICAgICAgICAgICsgbVs0XSAqIG1bMl0gKiBtWzldICsgbVs4XSAqIG1bMV0gKiBtWzZdIC0gbVs4XSAqIG1bMl0gKiBtWzVdO1xuICAgICAgICB2YXIgZGV0ID0gbVswXSppbnZbMF0gKyBtWzFdKmludls0XSArIG1bMl0qaW52WzhdICsgbVszXSppbnZbMTJdO1xuICAgICAgICBpZiggZGV0ID09IDAgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG4gICAgICAgIHZhciBtbyA9IHRoaXMubWFrZSgpO1xuICAgICAgICBmb3IoIHZhciBpPTA7IGk8MTY7ICsraSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vW2ldID0gaW52W2ldICogZGV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtbztcbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlZCA6IGZ1bmN0aW9uKG0pXG4gICAge1xuICAgICAgICB2YXIgbW8gPSB0aGlzLm1ha2UoKTtcblxuICAgICAgICBtb1swIF0gPSBtWzAgXTtcbiAgICAgICAgbW9bMSBdID0gbVs0IF07XG4gICAgICAgIG1vWzIgXSA9IG1bOCBdO1xuICAgICAgICBtb1szIF0gPSBtWzEyXTtcblxuICAgICAgICBtb1s0IF0gPSBtWzEgXTtcbiAgICAgICAgbW9bNSBdID0gbVs1IF07XG4gICAgICAgIG1vWzYgXSA9IG1bOSBdO1xuICAgICAgICBtb1s3IF0gPSBtWzEzXTtcblxuICAgICAgICBtb1s4IF0gPSBtWzIgXTtcbiAgICAgICAgbW9bOSBdID0gbVs2IF07XG4gICAgICAgIG1vWzEwXSA9IG1bMTBdO1xuICAgICAgICBtb1sxMV0gPSBtWzE0XTtcblxuICAgICAgICBtb1sxMl0gPSBtWzMgXTtcbiAgICAgICAgbW9bMTNdID0gbVs3IF07XG4gICAgICAgIG1vWzE0XSA9IG1bMTFdO1xuICAgICAgICBtb1sxNV0gPSBtWzE1XTtcblxuICAgICAgICByZXR1cm4gbW87XG4gICAgfSxcblxuICAgIHRvTWF0MzNJbnZlcnNlZCA6IGZ1bmN0aW9uKG1hdDQ0LG1hdDMzKVxuICAgIHtcbiAgICAgICAgdmFyIGEwMCA9IG1hdDQ0WzBdLCBhMDEgPSBtYXQ0NFsxXSwgYTAyID0gbWF0NDRbMl07XG4gICAgICAgIHZhciBhMTAgPSBtYXQ0NFs0XSwgYTExID0gbWF0NDRbNV0sIGExMiA9IG1hdDQ0WzZdO1xuICAgICAgICB2YXIgYTIwID0gbWF0NDRbOF0sIGEyMSA9IG1hdDQ0WzldLCBhMjIgPSBtYXQ0NFsxMF07XG5cbiAgICAgICAgdmFyIGIwMSA9IGEyMiphMTEtYTEyKmEyMTtcbiAgICAgICAgdmFyIGIxMSA9IC1hMjIqYTEwK2ExMiphMjA7XG4gICAgICAgIHZhciBiMjEgPSBhMjEqYTEwLWExMSphMjA7XG5cbiAgICAgICAgdmFyIGQgPSBhMDAqYjAxICsgYTAxKmIxMSArIGEwMipiMjE7XG4gICAgICAgIGlmICghZCkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgICB2YXIgaWQgPSAxL2Q7XG5cblxuICAgICAgICBpZighbWF0MzMpIHsgbWF0MzMgPSBNYXQzMy5tYWtlKCk7IH1cblxuICAgICAgICBtYXQzM1swXSA9IGIwMSppZDtcbiAgICAgICAgbWF0MzNbMV0gPSAoLWEyMiphMDEgKyBhMDIqYTIxKSppZDtcbiAgICAgICAgbWF0MzNbMl0gPSAoYTEyKmEwMSAtIGEwMiphMTEpKmlkO1xuICAgICAgICBtYXQzM1szXSA9IGIxMSppZDtcbiAgICAgICAgbWF0MzNbNF0gPSAoYTIyKmEwMCAtIGEwMiphMjApKmlkO1xuICAgICAgICBtYXQzM1s1XSA9ICgtYTEyKmEwMCArIGEwMiphMTApKmlkO1xuICAgICAgICBtYXQzM1s2XSA9IGIyMSppZDtcbiAgICAgICAgbWF0MzNbN10gPSAoLWEyMSphMDAgKyBhMDEqYTIwKSppZDtcbiAgICAgICAgbWF0MzNbOF0gPSAoYTExKmEwMCAtIGEwMSphMTApKmlkO1xuXG4gICAgICAgIHJldHVybiBtYXQzMztcblxuXG4gICAgfSxcblxuICAgIG11bHRWZWMzIDogZnVuY3Rpb24obSx2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICB2WzBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XG4gICAgICAgIHZbMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcbiAgICAgICAgdlsyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBtdXRsVmVjM0EgOiBmdW5jdGlvbihtLGEsaSlcbiAgICB7XG4gICAgICAgIGkgKj0gMztcblxuICAgICAgICB2YXIgeCA9IGFbaSAgXSxcbiAgICAgICAgICAgIHkgPSBhW2krMV0sXG4gICAgICAgICAgICB6ID0gYVtpKzJdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xuICAgICAgICBhW2krMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcbiAgICAgICAgYVtpKzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XG4gICAgfSxcblxuICAgIG11bHRWZWMzQUkgOiBmdW5jdGlvbihtLGEsaSlcbiAgICB7XG4gICAgICAgIHZhciB4ID0gYVtpICBdLFxuICAgICAgICAgICAgeSA9IGFbaSsxXSxcbiAgICAgICAgICAgIHogPSBhW2krMl07XG5cbiAgICAgICAgYVtpICBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl07XG4gICAgICAgIGFbaSsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xuICAgICAgICBhW2krMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcbiAgICB9LFxuXG4gICAgbXVsdFZlYzQgOiBmdW5jdGlvbihtLHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgdlswXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdICogdztcbiAgICAgICAgdlsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdICogdztcbiAgICAgICAgdlsyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICAgICAgdlszXSA9IG1bIDNdICogeCArIG1bIDddICogeSArIG1bMTFdICogeiArIG1bMTVdICogdztcblxuICAgICAgICByZXR1cm4gdjtcblxuXG4gICAgfSxcblxuICAgIG11bHRWZWM0QSA6IGZ1bmN0aW9uKG0sYSxpKVxuICAgIHtcbiAgICAgICAgaSAqPSAzO1xuXG4gICAgICAgIHZhciB4ID0gYVtpICBdLFxuICAgICAgICAgICAgeSA9IGFbaSsxXSxcbiAgICAgICAgICAgIHogPSBhW2krMl0sXG4gICAgICAgICAgICB3ID0gYVtpKzNdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdICogdztcbiAgICAgICAgYVtpKzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM10gKiB3O1xuICAgICAgICBhW2krMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XSAqIHc7XG4gICAgICAgIGFbaSszXSA9IG1bIDNdICogeCArIG1bIDddICogeSArIG1bMTFdICogeiArIG1bMTVdICogdztcblxuICAgIH0sXG5cbiAgICBtdWx0VmVjNEFJIDogZnVuY3Rpb24obSxhLGkpXG4gICAge1xuICAgICAgICB2YXIgeCA9IGFbaSAgXSxcbiAgICAgICAgICAgIHkgPSBhW2krMV0sXG4gICAgICAgICAgICB6ID0gYVtpKzJdLFxuICAgICAgICAgICAgdyA9IGFbaSszXTtcblxuICAgICAgICBhW2kgIF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXSAqIHc7XG4gICAgICAgIGFbaSsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdICogdztcbiAgICAgICAgYVtpKzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICBhW2krM10gPSBtWyAzXSAqIHggKyBtWyA3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XSAqIHc7XG5cbiAgICB9LFxuXG4gICAgaXNGbG9hdEVxdWFsIDogZnVuY3Rpb24obTAsbTEpXG4gICAge1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSgrK2k8MTYpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKCFrTWF0aC5pc0Zsb2F0RXF1YWwobTBbaV0sbTFbaV0pKXJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKG0pXG4gICAge1xuICAgICAgICByZXR1cm4gJ1snICsgbVsgMF0gKyAnLCAnICsgbVsgMV0gKyAnLCAnICsgbVsgMl0gKyAnLCAnICsgbVsgM10gKyAnLFxcbicgK1xuICAgICAgICAgICAgJyAnICsgbVsgNF0gKyAnLCAnICsgbVsgNV0gKyAnLCAnICsgbVsgNl0gKyAnLCAnICsgbVsgN10gKyAnLFxcbicgK1xuICAgICAgICAgICAgJyAnICsgbVsgOF0gKyAnLCAnICsgbVsgOV0gKyAnLCAnICsgbVsxMF0gKyAnLCAnICsgbVsxMV0gKyAnLFxcbicgK1xuICAgICAgICAgICAgJyAnICsgbVsxMl0gKyAnLCAnICsgbVsxM10gKyAnLCAnICsgbVsxNF0gKyAnLCAnICsgbVsxNV0gKyAnXSc7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXQ0NDsiLCJ2YXIga01hdGggPVxue1xuICAgIFBJICAgICAgICAgIDogTWF0aC5QSSxcbiAgICBIQUxGX1BJICAgICA6IE1hdGguUEkgKiAwLjUsXG4gICAgUVVBUlRFUl9QSSAgOiBNYXRoLlBJICogMC4yNSxcbiAgICBUV09fUEkgICAgICA6IE1hdGguUEkgKiAyLFxuICAgIEVQU0lMT04gICAgIDogMC4wMDAxLFxuXG4gICAgbGVycCAgICAgICAgOiBmdW5jdGlvbihhLGIsdil7cmV0dXJuIChhKigxLXYpKSsoYip2KTt9LFxuICAgIGNvc0ludHJwbCAgIDogZnVuY3Rpb24oYSxiLHYpe3YgPSAoMSAtIE1hdGguY29zKHYgKiBNYXRoLlBJKSkgKiAwLjU7cmV0dXJuIChhICogKDEtdikgKyBiICogdik7fSxcbiAgICBjdWJpY0ludHJwbCA6IGZ1bmN0aW9uKGEsYixjLGQsdilcbiAgICB7XG4gICAgICAgIHZhciBhMCxiMCxjMCxkMCx2djtcblxuICAgICAgICB2diA9IHYgKiB2O1xuICAgICAgICBhMCA9IGQgLSBjIC0gYSArIGI7XG4gICAgICAgIGIwID0gYSAtIGIgLSBhMDtcbiAgICAgICAgYzAgPSBjIC0gYTtcbiAgICAgICAgZDAgPSBiO1xuXG4gICAgICAgIHJldHVybiBhMCp2KnZ2K2IwKnZ2K2MwKnYrZDA7XG4gICAgfSxcblxuICAgIGhlcm1pdGVJbnRycGwgOiBmdW5jdGlvbihhLGIsYyxkLHYsdGVuc2lvbixiaWFzKVxuICAgIHtcbiAgICAgICAgdmFyIHYwLCB2MSwgdjIsIHYzLFxuICAgICAgICAgICAgYTAsIGIwLCBjMCwgZDA7XG5cbiAgICAgICAgdGVuc2lvbiA9ICgxLjAgLSB0ZW5zaW9uKSAqIDAuNTtcblxuICAgICAgICB2YXIgYmlhc3AgPSAxICsgYmlhcyxcbiAgICAgICAgICAgIGJpYXNuID0gMSAtIGJpYXM7XG5cbiAgICAgICAgdjIgID0gdiAqIHY7XG4gICAgICAgIHYzICA9IHYyICogdjtcblxuICAgICAgICB2MCAgPSAoYiAtIGEpICogYmlhc3AgKiB0ZW5zaW9uO1xuICAgICAgICB2MCArPSAoYyAtIGIpICogYmlhc24gKiB0ZW5zaW9uO1xuICAgICAgICB2MSAgPSAoYyAtIGIpICogYmlhc3AgKiB0ZW5zaW9uO1xuICAgICAgICB2MSArPSAoZCAtIGMpICogYmlhc24gKiB0ZW5zaW9uO1xuXG4gICAgICAgIGEwICA9IDIgKiB2MyAtIDMgKiB2MiArIDE7XG4gICAgICAgIGIwICA9IHYzIC0gMiAqIHYyICsgdjtcbiAgICAgICAgYzAgID0gdjMgLSB2MjtcbiAgICAgICAgZDAgID0gLTIgKiB2MyArIDMgKiB2MjtcblxuICAgICAgICByZXR1cm4gYTAgKiBiICsgYjAgKiB2MCArIGMwICogdjEgKyBkMCAqIGM7XG4gICAgfSxcblxuICAgIHJhbmRvbUZsb2F0IDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDA6IHIgPSBNYXRoLnJhbmRvbSgpO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiByID0gTWF0aC5yYW5kb20oKSAqIGFyZ3VtZW50c1swXTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogciA9IGFyZ3VtZW50c1swXSArIChhcmd1bWVudHNbMV0tYXJndW1lbnRzWzBdKSAqIE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcjtcbiAgICB9LFxuXG4gICAgcmFuZG9tSW50ZWdlciA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHZhciByO1xuXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAwOiByID0gMC41ICsgTWF0aC5yYW5kb20oKTticmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogciA9IDAuNSArIE1hdGgucmFuZG9tKCkqYXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiByID0gYXJndW1lbnRzWzBdICsgKCAxICsgYXJndW1lbnRzWzFdIC0gYXJndW1lbnRzWzBdKSAqIE1hdGgucmFuZG9tKCk7YnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihyKTtcbiAgICB9LFxuXG4gICAgY29uc3RyYWluIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDI6IGFyZ3VtZW50c1swXSA9IChhcmd1bWVudHNbMF0gPiBhcmd1bWVudHNbMV0pID8gYXJndW1lbnRzWzFdIDogYXJndW1lbnRzWzBdO2JyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBhcmd1bWVudHNbMF0gPSAoYXJndW1lbnRzWzBdID4gYXJndW1lbnRzWzJdKSA/IGFyZ3VtZW50c1syXSA6IChhcmd1bWVudHNbMF0gPCBhcmd1bWVudHNbMV0pID8gYXJndW1lbnRzWzFdIDphcmd1bWVudHNbMF07YnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgIH0sXG5cbiAgICBub3JtYWxpemUgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSxzdGFydCxlbmQpe3JldHVybiAodmFsdWUgLSBzdGFydCkgLyAoZW5kIC0gc3RhcnQpO30sXG4gICAgbWFwICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUsaW5TdGFydCxpbkVuZCxvdXRTdGFydCxvdXRFbmQpe3JldHVybiBvdXRTdGFydCArIChvdXRFbmQgLSBvdXRTdGFydCkgKiBub3JtYWxpemUodmFsdWUsaW5TdGFydCxpbkVuZCk7fSxcbiAgICBzaW4gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbih2YWx1ZSl7cmV0dXJuIE1hdGguc2luKHZhbHVlKTt9LFxuICAgIGNvcyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gTWF0aC5jb3ModmFsdWUpO30sXG4gICAgY2xhbXAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24odmFsdWUsbWluLG1heCl7cmV0dXJuIE1hdGgubWF4KG1pbixNYXRoLm1pbihtYXgsdmFsdWUpKTt9LFxuICAgIHNhdyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAyICogKG4gIC0gTWF0aC5mbG9vcigwLjUgKyBuICkpO30sXG4gICAgdHJpICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIDEtNCpNYXRoLmFicygwLjUtdGhpcy5mcmFjKDAuNSpuKzAuMjUpKTt9LFxuICAgIHJlY3QgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3ZhciBhID0gTWF0aC5hYnMobik7cmV0dXJuIChhID4gMC41KSA/IDAgOiAoYSA9PSAwLjUpID8gMC41IDogKGEgPCAwLjUpID8gMSA6IC0xO30sXG4gICAgZnJhYyAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4gLSBNYXRoLmZsb29yKG4pO30sXG4gICAgc2duICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4vTWF0aC5hYnMobik7fSxcbiAgICBhYnMgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5hYnMobik7fSxcbiAgICBtaW4gICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5taW4obik7fSxcbiAgICBtYXggICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5tYXgobik7fSxcbiAgICBhdGFuICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5hdGFuKG4pO30sXG4gICAgYXRhbjIgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oeSx4KXtyZXR1cm4gTWF0aC5hdGFuMih5LHgpO30sXG4gICAgcm91bmQgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGgucm91bmQobik7fSxcbiAgICBmbG9vciAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5mbG9vcihuKTt9LFxuICAgIHRhbiAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLnRhbihuKTt9LFxuICAgIHJhZDJkZWcgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHJhZGlhbnMpe3JldHVybiByYWRpYW5zICogKDE4MCAvIE1hdGguUEkpO30sXG4gICAgZGVnMnJhZCAgICAgICAgICAgICAgIDogZnVuY3Rpb24oZGVncmVlKXtyZXR1cm4gZGVncmVlICogKE1hdGguUEkgLyAxODApOyB9LFxuICAgIHNxcnQgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gTWF0aC5zcXJ0KHZhbHVlKTt9LFxuICAgIEdyZWF0ZXN0Q29tbW9uRGl2aXNvciA6IGZ1bmN0aW9uKGEsYil7cmV0dXJuIChiID09IDApID8gYSA6IHRoaXMuR3JlYXRlc3RDb21tb25EaXZpc29yKGIsIGEgJSBiKTt9LFxuICAgIGlzRmxvYXRFcXVhbCAgICAgICAgICA6IGZ1bmN0aW9uKGEsYil7cmV0dXJuIChNYXRoLmFicyhhLWIpPHRoaXMuRVBTSUxPTik7fSxcbiAgICBpc1Bvd2VyT2ZUd28gICAgICAgICAgOiBmdW5jdGlvbihhKXtyZXR1cm4gKGEmKGEtMSkpPT0wO30sXG4gICAgc3dhcCAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oYSxiKXt2YXIgdCA9IGE7YSA9IGI7IGIgPSBhO30sXG4gICAgcG93ICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oeCx5KXtyZXR1cm4gTWF0aC5wb3coeCx5KTt9LFxuICAgIGxvZyAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiBNYXRoLmxvZyhuKTt9LFxuICAgIGNvc2ggICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAoTWF0aC5wb3coTWF0aC5FLG4pICsgTWF0aC5wb3coTWF0aC5FLC1uKSkqMC41O30sXG4gICAgZXhwICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIE1hdGguZXhwKG4pO30sXG4gICAgc3RlcFNtb290aCAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4qbiooMy0yKm4pO30sXG4gICAgc3RlcFNtb290aFNxdWFyZWQgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuc3RlcFNtb290aChuKSAqIHRoaXMuc3RlcFNtb290aChuKTt9LFxuICAgIHN0ZXBTbW9vdGhJbnZTcXVhcmVkICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKTt9LFxuICAgIHN0ZXBTbW9vdGhDdWJlZCAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLnN0ZXBTbW9vdGgobikqdGhpcy5zdGVwU21vb3RoKG4pKnRoaXMuc3RlcFNtb290aChuKSp0aGlzLnN0ZXBTbW9vdGgobik7fSxcbiAgICBzdGVwU21vb3RoSW52Q3ViZWQgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS0oMS10aGlzLnN0ZXBTbW9vdGgobikpKigxLXRoaXMuc3RlcFNtb290aChuKSkqKDEtdGhpcy5zdGVwU21vb3RoKG4pKSooMS10aGlzLnN0ZXBTbW9vdGgobikpO30sXG4gICAgc3RlcFNxdWFyZWQgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4qbjt9LFxuICAgIHN0ZXBJbnZTcXVhcmVkICAgICAgICA6IGZ1bmN0aW9uKG4pe3JldHVybiAxLSgxLW4pKigxLW4pO30sXG4gICAgc3RlcEN1YmVkICAgICAgICAgICAgIDogZnVuY3Rpb24obil7cmV0dXJuIG4qbipuKm47fSxcbiAgICBzdGVwSW52Q3ViZWQgICAgICAgICAgOiBmdW5jdGlvbihuKXtyZXR1cm4gMS0oMS1uKSooMS1uKSooMS1uKSooMS1uKTt9LFxuICAgIGNhdG11bGxyb20gICAgICAgICAgICA6IGZ1bmN0aW9uKGEsYixjLGQsaSl7IHJldHVybiBhICogKCgtaSArIDIpICogaSAtIDEpICogaSAqIDAuNSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgKiAoKCgzICogaSAtIDUpICogaSkgKiBpICsgMikgKiAwLjUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjICogKCgtMyAqIGkgKyA0KSAqIGkgKyAxKSAqIGkgKiAwLjUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkICogKChpIC0gMSkgKiBpICogaSkgKiAwLjU7fVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGtNYXRoOyIsInZhciBRdWF0ZXJuaW9uID1cbntcbiAgICBtYWtlICAgICA6IGZ1bmN0aW9uKG4sdil7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW24sIHZbMF0sdlsxXSx2WzJdXSk7fSxcbiAgICBtYWtlNGYgICA6IGZ1bmN0aW9uKG4seCx5LHope3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFtuLHgseSx6XSk7fSxcbiAgICB6ZXJvICAgICA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwLDBdKTt9LFxuICAgIHNldCAgICAgIDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICBxMFswXSA9IHExWzBdO1xuICAgICAgICBxMFsxXSA9IHExWzFdO1xuICAgICAgICBxMFsyXSA9IHExWzJdO1xuICAgICAgICBxMFszXSA9IHExWzNdO1xuICAgIH0sXG5cbiAgICBzZXQ0ZiAgICA6IGZ1bmN0aW9uKHEsbix4LHkseilcbiAgICB7XG4gICAgICAgIHFbMF0gPSBuO1xuICAgICAgICBxWzFdID0geDtcbiAgICAgICAgcVsyXSA9IHk7XG4gICAgICAgIHFbM10gPSB6O1xuXG4gICAgfSxcblxuICAgIGNvcHkgICAgIDogZnVuY3Rpb24ocSl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkocSk7fSxcblxuICAgIGxlbmd0aCAgIDogZnVuY3Rpb24ocSl7dmFyIG4gPSBxWzBdLHggPSBxWzFdLHkgPSBxWzJdLHogPSBxWzNdOyByZXR1cm4gTWF0aC5zcXJ0KG4qbit4KngreSp5K3oqeik7fSxcbiAgICB2ZWN0b3IgICA6IGZ1bmN0aW9uKHEpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KHFbMV0scVsyXSxxWzNdKTt9LFxuICAgIHNjYWxhciAgIDogZnVuY3Rpb24ocSl7cmV0dXJuIHFbMF07fSxcblxuXG5cbiAgICBhZGQgOiBmdW5jdGlvbihxMCxxMSlcbiAgICB7XG4gICAgICAgIHEwWzBdID0gcTBbMF0gKyBxMVswXTtcbiAgICAgICAgcTBbMV0gPSBxMFsxXSArIHExWzFdO1xuICAgICAgICBxMFsyXSA9IHEwWzJdICsgcTFbMl07XG4gICAgICAgIHEwWzNdID0gcTBbM10gKyBxMVszXTtcbiAgICB9LFxuXG4gICAgc3ViIDogZnVuY3Rpb24ocTAscTEpXG4gICAge1xuICAgICAgICBxMFswXSA9IHEwWzBdIC0gcTFbMF07XG4gICAgICAgIHEwWzFdID0gcTBbMV0gLSBxMVsxXTtcbiAgICAgICAgcTBbMl0gPSBxMFsyXSAtIHExWzJdO1xuICAgICAgICBxMFszXSA9IHEwWzNdIC0gcTFbM107XG4gICAgfSxcblxuICAgIHNjYWxlIDogZnVuY3Rpb24ocSxuKVxuICAgIHtcbiAgICAgICAgcVswXSAqPSBuO1xuICAgICAgICBxWzFdICo9IG47XG4gICAgICAgIHFbMl0gKj0gbjtcbiAgICAgICAgcVszXSAqPSBuO1xuICAgIH0sXG5cbiAgICBjb25qdWdhdGUgOiBmdW5jdGlvbihxKVxuICAgIHtcbiAgICAgICAgcVsxXSo9LTE7XG4gICAgICAgIHFbMl0qPS0xO1xuICAgICAgICBxWzNdKj0tMTtcbiAgICB9LFxuXG4gICAgbXVsdCA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgdmFyIG4wID0gcTBbMF0sXG4gICAgICAgICAgICB4MCA9IHEwWzFdLFxuICAgICAgICAgICAgeTAgPSBxMFsyXSxcbiAgICAgICAgICAgIHowID0gcTBbM10sXG4gICAgICAgICAgICBuMSA9IHExWzBdLFxuICAgICAgICAgICAgeDEgPSBxMVsxXSxcbiAgICAgICAgICAgIHkxID0gcTFbMl0sXG4gICAgICAgICAgICB6MSA9IHExWzNdO1xuXG4gICAgICAgIHEwWzBdID0gbjAgKiBuMSAtIHgwICogeDEgLSB5MCAqIHkxIC0gejAgKiB6MTtcbiAgICAgICAgcTBbMV0gPSBuMCAqIHgxIC0geDAgKiBuMSAtIHkwICogejEgLSB6MCAqIHkxO1xuICAgICAgICBxMFsyXSA9IG4wICogeTEgLSB5MCAqIG4xIC0gejAgKiB4MSAtIHgwICogejE7XG4gICAgICAgIHEwWzNdID0gbjAgKiB6MSAtIHowICogbjEgLSB4MCAqIHkxIC0geTAgKiB6MTtcbiAgICB9LFxuXG4gICAgbXVsdFZlYyA6IGZ1bmN0aW9uKHEsdilcbiAgICB7XG4gICAgICAgIHZhciBxbiA9IHFbMF0sXG4gICAgICAgICAgICBxeCA9IHFbMV0sXG4gICAgICAgICAgICBxeSA9IHFbMl0sXG4gICAgICAgICAgICBxeiA9IHFbM107XG5cbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICBxWzBdID0gLShxeCp4ICsgcXkqeSArIHF6KnopO1xuICAgICAgICBxWzFdID0gcW4gKiB4ICsgcXkgKiB6IC0gcXogKiB5O1xuICAgICAgICBxWzJdID0gcW4gKiB5ICsgcXogKiB4IC0gcXggKiB6O1xuICAgICAgICBxWzNdID0gcW4gKiB6ICsgcXggKiB5IC0gcXkgKiB4O1xuICAgIH0sXG5cbiAgICBhbmdsZSA6IGZ1bmN0aW9uKHEpXG4gICAge1xuICAgICAgICByZXR1cm4gMiAqIGFjb3MocVswXSk7XG4gICAgfSxcblxuICAgIGF4aXMgOiBmdW5jdGlvbihxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSBxWzBdLFxuICAgICAgICAgICAgeSA9IHFbMV0sXG4gICAgICAgICAgICB6ID0gcVsyXTtcblxuICAgICAgICB2YXIgbCA9IE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnopO1xuXG4gICAgICAgIHJldHVybiBsICE9IDAgPyBuZXcgRmxvYXQzMkFycmF5KFt4L2wseS9sLHovbF0pIDogbmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcbiAgICB9LFxuXG4gICAgLy9UT0RPOiBJTkxJTkUgQUxMISFcblxuICAgIHJvdGF0ZSA6IGZ1bmN0aW9uKHEwLHExKVxuICAgIHtcbiAgICAgICAgdGhpcy5zZXQocTAsdGhpcy5tdWx0KHRoaXMubXVsdCh0aGlzLmNvcHkocTApLHExKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25qdWdhdGUodGhpcy5jb3B5KHEwKSkpKTtcbiAgICB9LFxuXG4gICAgcm90YXRlVmVjIDogZnVuY3Rpb24ocSx2KVxuICAgIHtcbiAgICAgICAgdmFyIHQgPSB0aGlzLnplcm8oKTtcbiAgICAgICAgdGhpcy5zZXQodCx0aGlzLm11bHRWZWMzKHRoaXMubXVsdFZlYzModGhpcy5jb3B5KHEpLHYpLHRoaXMuY29uanVnYXRlKHRoaXMuY29weShxKSkpKTtcbiAgICB9LFxuXG4gICAgZnJvbUFuZ2xlcyA6IGZ1bmN0aW9uKGF4LGF5LGF6KVxuICAgIHtcbiAgICAgICAgdmFyIHEgPSB0aGlzLnplcm8oKTtcblxuICAgICAgICB2YXIgY3lhdyxjcGl0Y2gsY3JvbGwsc3lhdyxzcGl0Y2gsc3JvbGw7XG4gICAgICAgIHZhciBjeWF3Y3BpdGNoLHN5YXdzcGl0Y2gsY3lhd3NwaXRjaCxzeWF3Y3BpdGNoO1xuXG4gICAgICAgIGN5YXcgICA9IE1hdGguY29zKGF6ICogMC41KTtcbiAgICAgICAgY3BpdGNoID0gTWF0aC5jb3MoYXkgKiAwLjUpO1xuICAgICAgICBjcm9sbCAgPSBNYXRoLmNvcyhheCAqIDAuNSk7XG4gICAgICAgIHN5YXcgICA9IE1hdGguc2luKGF6ICogMC41KTtcbiAgICAgICAgc3BpdGNoID0gTWF0aC5zaW4oYXkgKiAwLjUpO1xuICAgICAgICBzcm9sbCAgPSBNYXRoLnNpbihheCAqIDAuNSk7XG5cbiAgICAgICAgY3lhd2NwaXRjaCA9IGN5YXcgKiBjcGl0Y2g7XG4gICAgICAgIHN5YXdzcGl0Y2ggPSBzeWF3ICogc3BpdGNoO1xuICAgICAgICBjeWF3c3BpdGNoID0gY3lhdyAqIHNwaXRjaDtcbiAgICAgICAgc3lhd2NwaXRjaCA9IHN5YXcgKiBjcGl0Y2g7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyBjeWF3Y3BpdGNoICogY3JvbGwgKyBzeWF3c3BpdGNoICogc3JvbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3lhd2NwaXRjaCAqIHNyb2xsIC0gc3lhd3NwaXRjaCAqIGNyb2xsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN5YXdzcGl0Y2ggKiBjcm9sbCArIHN5YXdjcGl0Y2ggKiBzcm9sbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeWF3Y3BpdGNoICogY3JvbGwgLSBjeWF3c3BpdGNoICogc3JvbGwgXSk7XG5cbiAgICB9LFxuXG4gICAgYW5nbGVzRnJvbSA6IGZ1bmN0aW9uKHEpXG4gICAge1xuICAgICAgICB2YXIgcW4gPSBxWzBdLFxuICAgICAgICAgICAgcXggPSBxWzFdLFxuICAgICAgICAgICAgcXkgPSBxWzJdLFxuICAgICAgICAgICAgcXogPSBxWzNdO1xuXG4gICAgICAgIHZhciByMTEscjIxLHIzMSxyMzIscjMzLHIxMixyMTM7XG4gICAgICAgIHZhciBxMDAscTExLHEyMixxMzM7XG4gICAgICAgIHZhciB0ZW1wO1xuICAgICAgICB2YXIgdiA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG5cbiAgICAgICAgcTAwID0gcW4gKiBxbjtcbiAgICAgICAgcTExID0gcXggKiBxeDtcbiAgICAgICAgcTIyID0gcXkgKiBxeTtcbiAgICAgICAgcTMzID0gcXogKiBxejtcblxuICAgICAgICByMTEgPSBxMDAgKyBxMTEgLSBxMjIgLSBxMzM7XG4gICAgICAgIHIyMSA9IDIgKiAoIHF4ICsgcXkgKyBxbiAqIHF6KTtcbiAgICAgICAgcjMxID0gMiAqICggcXggKiBxeiAtIHFuICogcXkpO1xuICAgICAgICByMzIgPSAyICogKCBxeSAqIHF6ICsgcW4gKiBxeCk7XG4gICAgICAgIHIzMyA9IHEwMCAtIHExMSAtIHEyMiArIHEzMztcblxuICAgICAgICB0ZW1wID0gTWF0aC5hYnMocjMxKTtcbiAgICAgICAgaWYodGVtcCA+IDAuOTk5OTk5KVxuICAgICAgICB7XG4gICAgICAgICAgICByMTIgPSAyICogKHF4ICogcXkgLSBxbiAqIHF6KTtcbiAgICAgICAgICAgIHIxMyA9IDIgKiAocXggKiBxeiAtIHFuICogcXkpO1xuXG4gICAgICAgICAgICB2WzBdID0gMC4wO1xuICAgICAgICAgICAgdlsxXSA9ICgtKE1hdGguUEkgKiAwLjUpICogIHIzMiAvIHRlbXApO1xuICAgICAgICAgICAgdlsyXSA9IE1hdGguYXRhbjIoLXIxMiwtcjMxKnIxMyk7XG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZbMF0gPSBNYXRoLmF0YW4yKHIzMixyMzMpO1xuICAgICAgICB2WzFdID0gTWF0aC5hc2luKC0zMSk7XG4gICAgICAgIHZbMl0gPSBNYXRoLmF0YW4yKHIyMSxyMTEpO1xuICAgICAgICByZXR1cm4gdjtcbiAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVhdGVybmlvbjsiLCJ2YXIgVmVjMiA9XG57XG4gICAgU0laRSA6IDIsXG5cbiAgICBtYWtlIDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMF0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMjsiLCJ2YXIgVmVjMyA9XG57XG4gICAgU0laRSAgIDogMyxcbiAgICBaRVJPICAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMF0pfSxcbiAgICBBWElTX1ggOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMF0pfSxcbiAgICBBWElTX1kgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDEsMF0pfSxcbiAgICBBWElTX1ogOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLDAsMV0pfSxcblxuICAgIG1ha2UgOiBmdW5jdGlvbih4LHkseilcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgeCB8fCAwLjAsXG4gICAgICAgICAgICB5IHx8IDAuMCxcbiAgICAgICAgICAgIHogfHwgMC4wXSk7XG4gICAgfSxcblxuICAgIHNldCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gPSB2MVswXTtcbiAgICAgICAgdjBbMV0gPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNldDNmIDogIGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBjb3B5IDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcbiAgICB9LFxuXG4gICAgYWRkIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSArPSB2MVswXTtcbiAgICAgICAgdjBbMV0gKz0gdjFbMV07XG4gICAgICAgIHYwWzJdICs9IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc3ViIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSAtPSB2MVswXTtcbiAgICAgICAgdjBbMV0gLT0gdjFbMV07XG4gICAgICAgIHYwWzJdIC09IHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB2MDtcbiAgICB9LFxuXG4gICAgc2NhbGUgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2WzBdKj1uO1xuICAgICAgICB2WzFdKj1uO1xuICAgICAgICB2WzJdKj1uO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkb3QgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB2MFswXSp2MVswXSArIHYwWzFdKnYxWzFdICsgdjBbMl0qdjFbMl07XG4gICAgfSxcblxuICAgIGNyb3NzOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3kwICogejEgLSB5MSAqIHowLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgejAgKiB4MSAtIHoxICogeDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MCAqIHkxIC0geDEgKiB5MF0pO1xuICAgIH0sXG5cbiAgICBsZXJwIDogZnVuY3Rpb24odjAsdjEsZilcbiAgICB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl07XG5cbiAgICAgICAgdjBbMF0gPSB4MCAqICgxLjAgLSBmKSArIHYxWzBdICogZjtcbiAgICAgICAgdjBbMV0gPSB5MCAqICgxLjAgLSBmKSArIHYxWzFdICogZjtcbiAgICAgICAgdjBbMl0gPSB6MCAqICgxLjAgLSBmKSArIHYxWzJdICogZjtcblxuXG4gICAgfSxcblxuICAgIGxlcnBlZCA6IGZ1bmN0aW9uKHYwLHYxLGYpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5sZXJwKHRoaXMuY29weSh2MCksdjEsZik7XG4gICAgfSxcblxuXG5cbiAgICBsZXJwM2YgOiBmdW5jdGlvbih2LHgseSx6LGYpXG4gICAge1xuICAgICAgICB2YXIgdnggPSB2WzBdLFxuICAgICAgICAgICAgdnkgPSB2WzFdLFxuICAgICAgICAgICAgdnogPSB2WzJdO1xuXG4gICAgICAgIHZbMF0gPSB2eCAqICgxLjAgLSBmKSArIHggKiBmO1xuICAgICAgICB2WzFdID0gdnkgKiAoMS4wIC0gZikgKyB5ICogZjtcbiAgICAgICAgdlsyXSA9IHZ6ICogKDEuMCAtIGYpICsgeiAqIGY7XG4gICAgfSxcblxuXG4gICAgbGVuZ3RoIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4KngreSp5K3oqeik7XG4gICAgfSxcblxuICAgIGxlbmd0aFNxIDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHJldHVybiB4KngreSp5K3oqejtcbiAgICB9LFxuXG4gICAgc2FmZU5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHgqeCt5Knkreip6KTtcbiAgICAgICAgZCA9IGQgfHwgMTtcblxuICAgICAgICB2YXIgbCAgPSAxL2Q7XG5cbiAgICAgICAgdlswXSAqPSBsO1xuICAgICAgICB2WzFdICo9IGw7XG4gICAgICAgIHZbMl0gKj0gbDtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgbm9ybWFsaXplIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGwgID0gMS9NYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuXG4gICAgICAgIHZbMF0gKj0gbDtcbiAgICAgICAgdlsxXSAqPSBsO1xuICAgICAgICB2WzJdICo9IGw7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZTNmIDogZnVuY3Rpb24odix4LHkseilcbiAgICB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHggKyB2WzFdICogeSArIHZbMl0gKiB6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2VTcSA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4geCp4K3kqeSt6Kno7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EzZiA6IGZ1bmN0aW9uKHYseCx5LHopXG4gICAge1xuICAgICAgICByZXR1cm4gdlswXSAqIHggKyB2WzFdICogeSArIHZbMl0gKiB6O1xuICAgIH0sXG5cbiAgICBsaW1pdCA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGRzcSA9IHgqeCArIHkqeSArIHoqeixcbiAgICAgICAgICAgIGxzcSA9IG4gKiBuO1xuXG4gICAgICAgIGlmKChkc3EgPiBsc3EpICYmIGxzcSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBuZCA9IG4vTWF0aC5zcXJ0KGRzcSk7XG5cbiAgICAgICAgICAgIHZbMF0gKj0gbmQ7XG4gICAgICAgICAgICB2WzFdICo9IG5kO1xuICAgICAgICAgICAgdlsyXSAqPSBuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBpbnZlcnQgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdlswXSo9LTE7XG4gICAgICAgIHZbMV0qPS0xO1xuICAgICAgICB2WzJdKj0tMTtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgYWRkZWQgIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQodGhpcy5jb3B5KHYwKSx2MSk7XG4gICAgfSxcblxuICAgIHN1YmJlZCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzY2FsZWQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZSh0aGlzLmNvcHkodiksbik7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWQgOiBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKHRoaXMuY29weSh2KSk7XG4gICAgfSxcblxuICAgIHRvU3RyaW5nIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiAnWycgKyB2WzBdICsgJywnICsgdlsxXSArICcsJyArIHZbMl0gKyAnXSc7XG4gICAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzM7XG5cblxuXG4iLCJcbi8vVE9ETzpGSU5JU0hcbnZhciBWZWM0ID1cbntcbiAgICBTSVpFIDogNCxcbiAgICBaRVJPIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMS4wXSl9LFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKHgseSx6LHcpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHggfHwgMC4wLFxuICAgICAgICAgICAgeSB8fCAwLjAsXG4gICAgICAgICAgICB6IHx8IDAuMCxcbiAgICAgICAgICAgIHcgfHwgMS4wXSk7XG4gICAgfSxcblxuICAgIGZyb21WZWMzIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgdlswXSwgdlsxXSwgdlsyXSAsIDEuMF0pO1xuICAgIH0sXG5cbiAgICBzZXQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdID0gdjFbMF07XG4gICAgICAgIHYwWzFdID0gdjFbMV07XG4gICAgICAgIHYwWzJdID0gdjFbMl07XG4gICAgICAgIHYwWzNdID0gdjFbM107XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzZXQzZiA6ICBmdW5jdGlvbih2LHgseSx6KVxuICAgIHtcbiAgICAgICAgdlswXSA9IHg7XG4gICAgICAgIHZbMV0gPSB5O1xuICAgICAgICB2WzJdID0gejtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgc2V0NGYgOiBmdW5jdGlvbih2LHgseSx6LHcpXG4gICAge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuICAgICAgICB2WzNdID0gdztcblxuICAgICAgICByZXR1cm4gdjtcblxuICAgIH0sXG5cbiAgICBjb3B5IDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcbiAgICB9LFxuXG4gICAgYWRkIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSArPSB2MVswXTtcbiAgICAgICAgdjBbMV0gKz0gdjFbMV07XG4gICAgICAgIHYwWzJdICs9IHYxWzJdO1xuICAgICAgICB2MFszXSArPSB2MVszXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHN1YiA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gLT0gdjFbMF07XG4gICAgICAgIHYwWzFdIC09IHYxWzFdO1xuICAgICAgICB2MFsyXSAtPSB2MVsyXTtcbiAgICAgICAgdjBbM10gLT0gdjFbM107XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzY2FsZSA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHZbMF0qPW47XG4gICAgICAgIHZbMV0qPW47XG4gICAgICAgIHZbMl0qPW47XG4gICAgICAgIHZbM10qPW47XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGRvdCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHYwWzBdKnYxWzBdICsgdjBbMV0qdjFbMV0gKyB2MFsyXSp2MVsyXTtcbiAgICB9LFxuXG4gICAgY3Jvc3M6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHgwID0gdjBbMF0sXG4gICAgICAgICAgICB5MCA9IHYwWzFdLFxuICAgICAgICAgICAgejAgPSB2MFsyXSxcbiAgICAgICAgICAgIHgxID0gdjFbMF0sXG4gICAgICAgICAgICB5MSA9IHYxWzFdLFxuICAgICAgICAgICAgejEgPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbeTAqejEteTEqejAsejAqeDEtejEqeDAseDAqeTEteDEqeTBdKTtcbiAgICB9LFxuXG4gICAgc2xlcnAgOiBmdW5jdGlvbih2MCx2MSxmKVxuICAgIHtcbiAgICAgICAgdmFyIHgwID0gdjBbMF0sXG4gICAgICAgICAgICB5MCA9IHYwWzFdLFxuICAgICAgICAgICAgejAgPSB2MFsyXSxcbiAgICAgICAgICAgIHgxID0gdjFbMF0sXG4gICAgICAgICAgICB5MSA9IHYxWzFdLFxuICAgICAgICAgICAgejEgPSB2MVsyXTtcblxuICAgICAgICB2YXIgZCA9IE1hdGgubWF4KC0xLjAsTWF0aC5taW4oKHgwKngxICsgeTAqeTEgKyB6MCp6MSksMS4wKSksXG4gICAgICAgICAgICB0ID0gTWF0aC5hY29zKGQpICogZjtcblxuICAgICAgICB2YXIgeCA9IHgwIC0gKHgxICogZCksXG4gICAgICAgICAgICB5ID0geTAgLSAoeTEgKiBkKSxcbiAgICAgICAgICAgIHogPSB6MCAtICh6MSAqIGQpO1xuXG4gICAgICAgIHZhciBsID0gMS9NYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuXG4gICAgICAgIHgqPWw7XG4gICAgICAgIHkqPWw7XG4gICAgICAgIHoqPWw7XG5cbiAgICAgICAgdmFyIGN0ID0gTWF0aC5jb3ModCksXG4gICAgICAgICAgICBzdCA9IE1hdGguc2luKHQpO1xuXG4gICAgICAgIHZhciB4byA9IHgwICogY3QgKyB4ICogc3QsXG4gICAgICAgICAgICB5byA9IHkwICogY3QgKyB5ICogc3QsXG4gICAgICAgICAgICB6byA9IHowICogY3QgKyB6ICogc3Q7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3hvLHlvLHpvXSk7XG4gICAgfSxcblxuICAgIGxlbmd0aCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4KngreSp5K3oqeit3KncpO1xuICAgIH0sXG5cbiAgICBsZW5ndGhTcSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHJldHVybiB4KngreSp5K3oqeit3Knc7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgdmFyIGwgID0gMS9NYXRoLnNxcnQoeCp4K3kqeSt6Knordyp3KTtcblxuICAgICAgICB2WzBdICo9IGw7XG4gICAgICAgIHZbMV0gKj0gbDtcbiAgICAgICAgdlsyXSAqPSBsO1xuICAgICAgICB2WzNdICo9IGw7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZVNxIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB4KngreSp5K3oqejtcbiAgICB9LFxuXG4gICAgbGltaXQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkc3EgPSB4KnggKyB5KnkgKyB6KnosXG4gICAgICAgICAgICBsc3EgPSBuICogbjtcblxuICAgICAgICBpZigoZHNxID4gbHNxKSAmJiBsc3EgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbmQgPSBuL01hdGguc3FydChkc3EpO1xuXG4gICAgICAgICAgICB2WzBdICo9IG5kO1xuICAgICAgICAgICAgdlsxXSAqPSBuZDtcbiAgICAgICAgICAgIHZbMl0gKj0gbmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZbMF0qPS0xO1xuICAgICAgICB2WzFdKj0tMTtcbiAgICAgICAgdlsyXSo9LTE7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGFkZGVkICA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzdWJiZWQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0aGlzLmNvcHkodjApLHYxKTtcbiAgICB9LFxuXG4gICAgc2NhbGVkIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUodGhpcy5jb3B5KHYpLG4pO1xuICAgIH0sXG5cbiAgICBub3JtYWxpemVkIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSh0aGlzLmNvcHkodikpO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gJ1snICsgdlswXSArICcsJyArIHZbMV0gKyAnLCcgKyB2WzJdICsgJ10nO1xuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZWM0OyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBBUFBfV0lEVEggIDogODAwLFxuICAgIEFQUF9IRUlHSFQgOiA2MDAsXG5cbiAgICBBUFBfRlBTIDogMzAsXG5cbiAgICBBUFBfUExBU0tfV0lORE9XX1RJVExFIDogJycsXG4gICAgQVBQX1BMQVNLX1RZUEUgIDogJzNkJyxcbiAgICBBUFBfUExBU0tfVlNZTkMgOiAnZmFsc2UnLFxuICAgIEFQUF9QTEFTS19NVUxUSVNBTVBMRSA6IHRydWUsXG5cbiAgICBDQU1FUkFfRk9WIDogNDUsXG4gICAgQ0FNRVJBX05FQVIgOiAwLjEsXG4gICAgQ0FNRVJBX0ZBUiAgOiAxMDBcblxufTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgTUVUSE9EX05PVF9JTVBMRU1FTlRFRDogJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQgaW4gdGFyZ2V0IHBsYXRmb3JtLicsXG4gICAgQ0xBU1NfSVNfU0lOR0xFVE9OOiAgICAgJ0FwcGxpY2F0aW9uIGlzIHNpbmdsZXRvbi4gR2V0IHZpYSBnZXRJbnN0YW5jZSgpLicsXG4gICAgQVBQX05PX1NFVFVQOiAgICAgICAgICAgJ05vIHNldHVwIG1ldGhvZCBhZGRlZCB0byBhcHAuJyxcbiAgICBBUFBfTk9fVVBEQVRFIDogICAgICAgICAnTm8gdXBkYXRlIG1ldGhvZCBhZGRlZCB0byBhcHAuJyxcbiAgICBQTEFTS19XSU5ET1dfU0laRV9TRVQ6ICAnUGxhc2sgd2luZG93IHNpemUgY2FuIG9ubHkgYmUgc2V0IG9uIHN0YXJ0dXAuJyxcbiAgICBXUk9OR19QTEFURk9STTogICAgICAgICAnV3JvbmcgUGxhdGZvcm0uJyxcbiAgICBWRVJUSUNFU19JTl9XUk9OR19TSVpFOiAnVmVydGljZXMgYXJyYXkgaGFzIHdyb25nIGxlbmd0aC4gU2hvdWxkIGJlICcsXG4gICAgQ09MT1JTX0lOX1dST05HX1NJWkU6ICAgJ0NvbG9yIGFycmF5IGxlbmd0aCBub3QgZXF1YWwgdG8gbnVtYmVyIG9mIHZlcnRpY2VzLidcbn07IiwidmFyIFBsYXRmb3JtID0ge1dFQjowLFBMQVNLOjF9O1xuICAgIFBsYXRmb3JtLl90YXJnZXQgPSBudWxsO1xuXG5QbGF0Zm9ybS5nZXRUYXJnZXQgID0gZnVuY3Rpb24oKVxue1xuICAgIGlmKCF0aGlzLl90YXJnZXQpdGhpcy5fdGFyZ2V0ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpID8gdGhpcy5XRUIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlKSA/IHRoaXMuUExBU0sgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX3RhcmdldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxhdGZvcm07IiwibW9kdWxlLmV4cG9ydHMgPVxue1xuICAgIFNJWkUgIDogNCxcblxuICAgIEJMQUNLIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMV0pfSxcbiAgICBXSElURSA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzEsMSwxLDFdKX0sXG4gICAgUkVEICAgOiBmdW5jdGlvbigpe3JldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCwxXSl9LFxuICAgIEdSRUVOIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwxLDAsMV0pfSxcbiAgICBCTFVFICA6IGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMCwxLDFdKX0sXG5cbiAgICBtYWtlIDogZnVuY3Rpb24ocixnLGIsYSl7cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWyByLGcsYixhXSk7fSxcbiAgICBjb3B5IDogZnVuY3Rpb24oYyl7cmV0dXJuIHRoaXMubWFrZShjWzBdLGNbMV0sY1syXSxjWzNdKTt9LFxuXG4gICAgc2V0IDogZnVuY3Rpb24oYzAsYzEpXG4gICAge1xuICAgICAgICBjMFswXSA9IGMxWzBdO1xuICAgICAgICBjMFsxXSA9IGMxWzFdO1xuICAgICAgICBjMFsyXSA9IGMxWzJdO1xuICAgICAgICBjMFszXSA9IGMxWzNdO1xuXG4gICAgICAgIHJldHVybiBjMDtcbiAgICB9LFxuXG4gICAgc2V0NGYgOiBmdW5jdGlvbihjLHIsZyxiLGEpXG4gICAge1xuICAgICAgICBjWzBdID0gcjtcbiAgICAgICAgY1sxXSA9IGc7XG4gICAgICAgIGNbMl0gPSBiO1xuICAgICAgICBjWzNdID0gYTtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuXG4gICAgc2V0M2YgOiBmdW5jdGlvbihjLHIsZyxiKVxuICAgIHtcbiAgICAgICAgY1swXSA9IHI7XG4gICAgICAgIGNbMV0gPSBnO1xuICAgICAgICBjWzJdID0gYjtcbiAgICAgICAgY1szXSA9IDEuMDtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9LFxuXG4gICAgc2V0MmYgOiBmdW5jdGlvbihjLGssYSlcbiAgICB7XG4gICAgICAgIGNbMF0gPSBjWzFdID0gY1syXSA9IGs7XG4gICAgICAgIGNbM10gPSBhO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBzZXQxZiA6IGZ1bmN0aW9uKGMsaylcbiAgICB7XG4gICAgICAgIGNbMF0gPSBjWzFdID0gY1syXSA9IGs7XG4gICAgICAgIGNbM10gPSAxLjA7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDRpICAgIDogZnVuY3Rpb24oYyxyLGcsYixhKXtyZXR1cm4gdGhpcy5zZXQ0ZihjLHIvMjU1LjAsZy8yNTUuMCxiLzI1NS4wLGEpO30sXG4gICAgc2V0M2kgICAgOiBmdW5jdGlvbihjLHIsZyxiKSAge3JldHVybiB0aGlzLnNldDNmKGMsci8yNTUuMCxnLzI1NS4wLGIvMjU1LjApO30sXG4gICAgc2V0MmkgICAgOiBmdW5jdGlvbihjLGssYSkgICAge3JldHVybiB0aGlzLnNldDJmKGMsay8yNTUuMCxhKTt9LFxuICAgIHNldDFpICAgIDogZnVuY3Rpb24oYyxrKSAgICAgIHtyZXR1cm4gdGhpcy5zZXQxZihjLGsvMjU1LjApO30sXG4gICAgdG9BcnJheSAgOiBmdW5jdGlvbihjKSAgICAgICAge3JldHVybiBjLnRvQXJyYXkoKTt9LFxuICAgIHRvU3RyaW5nIDogZnVuY3Rpb24oYykgICAgICAgIHtyZXR1cm4gJ1snK2NbMF0rJywnK2NbMV0rJywnK2NbMl0rJywnK2NbM10rJ10nO30sXG5cbiAgICBpbnRlcnBvbGF0ZWQgOiBmdW5jdGlvbihjMCxjMSxmKVxuICAgIHtcbiAgICAgICAgdmFyIGMgID0gbmV3IEZsb2F0MzJBcnJheSg0KSxcbiAgICAgICAgICAgIGZpID0gMS4wIC0gZjtcblxuICAgICAgICBjWzBdID0gYzBbMF0gKiBmaSArIGMxWzBdICogZjtcbiAgICAgICAgY1sxXSA9IGMwWzFdICogZmkgKyBjMVsxXSAqIGY7XG4gICAgICAgIGNbMl0gPSBjMFsyXSAqIGZpICsgYzFbMl0gKiBmO1xuICAgICAgICBjWzNdID0gYzBbM10gKiBmaSArIGMxWzNdICogZjtcblxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbn07IiwidmFyIFZlYzIgICA9IHJlcXVpcmUoJy4uL21hdGgvZ2xrVmVjMicpLFxuICAgIGtFcnJvciA9IHJlcXVpcmUoJy4uL3N5c3RlbS9nbGtFcnJvcicpO1xuXG5mdW5jdGlvbiBNb3VzZSgpXG57XG4gICAgaWYoTW91c2UuX19pbnN0YW5jZSl0aHJvdyBuZXcgRXJyb3Ioa0Vycm9yLkNMQVNTX0lTX1NJTkdMRVRPTik7XG5cbiAgICB0aGlzLl9wb3NpdGlvbiAgICAgPSBWZWMyLm1ha2UoKTtcbiAgICB0aGlzLl9wb3NpdGlvbkxhc3QgPSBWZWMyLm1ha2UoKTtcblxuICAgIE1vdXNlLl9faW5zdGFuY2UgPSB0aGlzO1xufVxuXG5Nb3VzZS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb247fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRQb3NpdGlvbkxhc3QgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvbkxhc3Q7fTtcbk1vdXNlLnByb3RvdHlwZS5nZXRYICAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wb3NpdGlvblswXTt9O1xuTW91c2UucHJvdG90eXBlLmdldFkgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3Bvc2l0aW9uWzFdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WExhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzBdO307XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WUxhc3QgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzFdO307XG5cbk1vdXNlLl9faW5zdGFuY2UgPSBudWxsO1xuTW91c2UuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbigpe3JldHVybiBNb3VzZS5faW5zdGFuY2U7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgdG9BcnJheSA6IGZ1bmN0aW9uKGZsb2F0MzJBcnJheSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZsb2F0MzJBcnJheSk7fVxufTsiLG51bGxdfQ==
;