var Default     = require('../system/fDefault'),
    fError      = require('../system/fError'),
    fGL         = require('../graphics/fGL'),
    AppImpl     = require('./fAppImpl'),
    CameraBasic = require('../graphics/fCameraBasic'),
    plask       = require('plask'),
    sys         = require('sys');

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

    this._plaskWindow = null;
};


AppImplPlask.prototype.init = function(appObj)
{
    var self = this;

    var plaskWindow = this._plaskWindow = new plask.Window(self._width ,
                                                           self._height,
                                                           {
                                                                type: Default.APP_PLASK_TYPE,
                                                                multisample: Default.APP_PLASK_MULTISAMPLE,
                                                                display: 1,
                                                                borderless: appObj._isBorderless || appObj._isFullscreen,
                                                                fullscreen: appObj._isFullscreen
                                                           });



    //TOOD add window position
    plaskWindow.setFrameTopLeftPoint(plaskWindow.screenSize().width  * 0.5 - self._width  * 0.5,
                                     plaskWindow.screenSize().height * 0.5 - self._height * 0.5);


    plaskWindow.setTitle(appObj._windowTitle || Default.APP_PLASK_WINDOW_TITLE);
    if(appObj._hideCursor)plaskWindow.hideCursor();

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

    plaskWindow.on('mouseMoved',
    function(e)
    {
        updateMouse(e.x, e.y);
        appObj.onMouseMove(e);
    });

    plaskWindow.on('leftMouseDragged',
        function(e)
        {
            updateMouse(e.x, e.y);
            appObj.onMouseMove(e);

        });

    plaskWindow.on('leftMouseDown',
        function(e)
        {
            self._mouseDown = true;
            appObj.onMouseDown(e);
        }
    );

    plaskWindow.on('leftMouseUp',
        function(e)
        {
            self._mouseDown = false;
            appObj.onMouseUp(e);
        }
    );

    plaskWindow.on('scrollWheel',
        function(e)
        {
            self._mouseWheelDelta += Math.max(-1,Math.min(1,e.dy)) * -1;
            appObj.onMouseWheel(e);
        }
    );

    plaskWindow.on('keyUp',
        function(e)
        {
            self._keyDown = false;
            self._keyStr  = e.str;
            self._keyCode = e.keyCode;
            appObj.onKeyUp(e);
        }
    );

    plaskWindow.on('keyDown',
        function(e)
        {
            self._keyDown = true;
            self._keyStr  = e.str;
            self._keyCode = e.keyCode;
            appObj.onKeyDown(e);
        }
    );

    var gl = plaskWindow.context;

    appObj.fgl    = new fGL(plaskWindow.context,null);
    appObj.camera = new CameraBasic();
    appObj.fgl.setCamera(appObj.camera);
    appObj.camera.setPerspective(Default.CAMERA_FOV,
        self._ratio,
        Default.CAMERA_NEAR,
        Default.CAMERA_FAR);

    appObj.camera.setTarget3f(0,0,0);
    appObj.camera.updateMatrices();

    appObj.fgl.loadIdentity();

    appObj.setup();


    if(this._bUpdate)
    {
        var time, timeDelta;
        var timeInterval = this._timeInterval;
        var timeNext;

        function redraw()
        {
            gl.makeCurrentContext();

            time      = self._time = Date.now();
            timeDelta = time - self._timeNext;

            self._timeDelta = Math.min(timeDelta / timeInterval, 1);

            if(timeDelta > timeInterval)
            {
                timeNext = self._timeNext = time - (timeDelta % timeInterval);

                try{appObj.update();}
                catch (ex)
                {
                    sys.error('Exception caught in AppImplPlask draw: \n' +
                        ex + '\n' + ex.stack);
                }

                self._timeElapsed = (timeNext - self._timeStart) / 1000.0;
                self._framenum++;
            }
            plaskWindow.blit();
        }

        setInterval(function(){redraw();}, timeInterval);
    }
    else appObj.update();

    this._isInitialized = true;
};

AppImplPlask.prototype._updateLoop = function()
{

}

//TODO: Fix time delta, double measuring of time in general
/*
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

            appObj.fgl.loadIdentity();

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
*/

AppImplPlask.prototype.getSecondsElapsed = function(){return this._timeElapsed;};
AppImplPlask.prototype.getFramesElapsed  = function(){return this._framenum;};
AppImplPlask.prototype.getTimeDelta      = function(){return this._timeDelta;};
AppImplPlask.prototype.getTimeStart      = function(){return this._timeStart;};

AppImplPlask.prototype.setFullWindowFrame = function(bool){this._isFullWindowFrame = bool;return true;};
AppImplPlask.prototype.setFullscreen      = function(bool){this._isFullscreen = bool;return true;};
AppImplPlask.prototype.setBorderless      = function(bool){this._isBorderless = bool;return true;};


module.exports = AppImplPlask;



