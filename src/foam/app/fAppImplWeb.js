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

