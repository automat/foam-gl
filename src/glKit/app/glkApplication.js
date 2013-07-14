GLKit.Application = function(parentDomElement)
{
    var glWindow = this.glWindow = new GLKit.Window(parentDomElement);
    var gl       = this.gl       = new GLKit.GL(glWindow.getGL());
    var camera   = this.camera   = new GLKit.CameraBasic();

    /*---------------------------------------------------------------------------------*/

    gl.setCamera(camera);


    /*---------------------------------------------------------------------------------*/

    this._keyDown         = false;
    this._mouseDown       = false;
    this._mouseWheelDelta = 0.0;

    this.mouse = new GLKit.Mouse();

    this._update          = true;

    this._targetFPS = 60;
    this._frames    = 0;

    this._time;
    this._timeStart    = Date.now();
    this._timeNext     = Date.now();
    this._timeInterval = 1000/this._targetFPS;
    this._timeElapsed;



    /*---------------------------------------------------------------------------------*/

    this._initListeners();

    if(GLKit.Application._instance)throw 'fdfdf';
       GLKit.Application._instance = this;
};

GLKit.Application.prototype.setSize = function(width, height)
{
    var glWindow = this.glWindow;
        glWindow.setSize(width,height);

    this.camera.setPerspective(45.0,glWindow.getAspectRatio(),0.1,100.0);

    this._updateGLViewport();
    this._updateLoop();
};

GLKit.Application.prototype.setCamera = function(camera)
{
    this.camera = camera;
    this.gl.setCamera(camera);
};

/*---------------------------------------------------------------------------------*/


GLKit.Application.prototype._onWindowResize = function()
{
    this.onWindowResize();
    this.camera.setAspectRatio(this.glWindow.getAspectRatio());
    this.camera.updateProjectionMatrix();
    this._updateGLViewport();
};

GLKit.Application.prototype.onWindowResize = function(){};


GLKit.Application.prototype._updateGLViewport = function()
{
    var glWindow = this.glWindow,
        gl       = this.gl;
        gl.viewport(0,0,glWindow.getWidth(),glWindow.getHeight());
        gl.clearColor(gl.getClearBuffer());
};

/*---------------------------------------------------------------------------------*/

GLKit.Application.prototype.setUpdate = function(bool){this._update = bool;};

GLKit.Application.prototype._updateLoop = function()
{
    if(!this._update)return;
    webkitRequestAnimationFrame(this._updateLoop.bind(this),null);

    var time         = this._time      = Date.now(),
        timeDelta    = time - this._timeNext,
        timeInterval = this._timeInterval;

    var timeNext;

    if(timeDelta > timeInterval)
    {
        timeNext = this._timeNext = time - (timeDelta % timeInterval);

        this.update();

        this._timeElapsed = (timeNext - this._timeStart) / 1000.0;
        this._frames++;

    }
};



GLKit.Application.prototype.update = function(){};

GLKit.Application.prototype.getFramesElapsed  = function(){return this._frames;};
GLKit.Application.prototype.getSecondsElapsed = function(){return this._timeElapsed;};
GLKit.Application.prototype.getTime           = function(){return this._time;};
GLKit.Application.prototype.getTimeStart      = function(){return this._timeStart;};
GLKit.Application.prototype.getTimeNext       = function(){return this._timeNext;}


GLKit.Application.prototype.setTargetFPS = function(fps){this._targetFPS = fps;this._timeInterval = 1000/this._targetFPS;};
GLKit.Application.prototype.getTargetFPS = function(){return this._targetFPS;};

/*---------------------------------------------------------------------------------*/

GLKit.Application.prototype._initListeners = function()
{
    var glCanvas = this.glWindow.getCanvas();
        glCanvas.addEventListener('mousedown', this._onGLCanvasMouseDown.bind(this));
        glCanvas.addEventListener('mouseup',   this._onGLCanvasMouseUp.bind(this));
        glCanvas.addEventListener('mousemove', this._onGLCanvasMouseMove.bind(this));
        glCanvas.addEventListener('keydown',   this._onGLCanvasKeyDown.bind(this));
        glCanvas.addEventListener('keyup',     this._onGLCanvasKeyUp.bind(this));
        glCanvas.addEventListener('mousewheel',this._onGLCanvasMouseWheel.bind(this));

    window.addEventListener('resize',this._onWindowResize.bind(this));
};


GLKit.Application.prototype._onGLCanvasKeyDown    = function(e){this._keyDown = true;this.onKeyDown(e)};
GLKit.Application.prototype._onGLCanvasKeyUp      = function(e){this._keyDown = false;this.onKeyUp(e)};
GLKit.Application.prototype._onGLCanvasMouseUp    = function(e){this._mouseDown = false;this.onMouseUp(e);};
GLKit.Application.prototype._onGLCanvasMouseDown  = function(e){this._mouseDown = true;this.onMouseDown(e);};
GLKit.Application.prototype._onGLCanvasMouseMove  = function(e){this.onMouseMove(e);};
GLKit.Application.prototype._onGLCanvasMouseWheel = function(e){this._mouseWheelDelta += Math.max(-1,Math.min(1, e.wheelDelta)) * -1;this.onMouseWheel(e);};
GLKit.Application.prototype.onKeyDown             = function(e){};
GLKit.Application.prototype.onKeyUp               = function(e){};
GLKit.Application.prototype.onMouseUp             = function(e){};
GLKit.Application.prototype.onMouseDown           = function(e){};
GLKit.Application.prototype.onMouseWheel          = function(e){};
GLKit.Application.prototype.onMouseMove           = function(e){};



GLKit.Application.prototype.isKeyDown          = function(){return this._keyDown;};
GLKit.Application.prototype.isMouseDown        = function(){return this._mouseDown;};
GLKit.Application.prototype.isMouseMove        = function(){};
GLKit.Application.prototype.getMouseWheelDelta = function(){return this._mouseWheelDelta;}

/*---------------------------------------------------------------------------------*/

GLKit.Application.prototype.getAspectRatioWindow = function(){return this.glWindow.getAspectRatio();};

/*---------------------------------------------------------------------------------*/

GLKit.Application.getInstance = function(){return GLKit.Application._instance;};






