GLKit.Application = function(parentDomElement)
{
    this._window = new GLKit.Window(parentDomElement);
    this._gl     = null;
    this._camera = null;

    this._keyDown   = false;
    this._mouseDown = false;
    this._loop      = true;



    if(GLKit.Application._instance)throw 'fdfdf';
       GLKit.Application._instance = this;
};

GLKit.Application.prototype.getWindow = function(){return this._window;};
GLKit.Application.prototype.getGL     = function(){return this._gl;};

GLKit.Application.prototype.setWindowSize = function(width, height)
{
    var glWindow = this._window;
        glWindow.setSize(width,height);

    var camera = this._camera;

    var gl     = this._gl = new GLKit.GL(glWindow.getGL());
        //gl.setProjectionMatrix(null);
        //gl.setModelViewMatrix(null);

    var glCanvas = gl.getCanvas();
        glCanvas.addEventListener('mousedown', this._onGLCanvasMouseDown.bind(this));
        glCanvas.addEventListener('mouseup',   this._onGLCanvasMouseUp.bind(this));
        glCanvas.addEventListener('mousemove', this._onGLCanvasMouseMove.bind(this));
        glCanvas.addEventListener('keydown',   this._onGLCanvasKeyDown.bind(this));
        glCanvas.addEventListener('keyup',     this._onGLCanvasKeyUp.bind(this));
        glCanvas.addEventListener('mousewheel',this._onGLCanvasMouseWheel.bind(this));


    window.addEventListener('resize',this._onWindowResize.bind(this));


    this._updateLoop();
};

GLKit.Application.prototype._onGLCanvasKeyDown    = function(){};
GLKit.Application.prototype._onGLCanvasKeyUp      = function(){};
GLKit.Application.prototype._onGLCanvasMouseUp    = function(){};
GLKit.Application.prototype._onGLCanvasMouseDown  = function(){};
GLKit.Application.prototype._onGLCanvasMouseMove  = function(){};
GLKit.Application.prototype._onGLCanvasMouseWheel = function(){};


GLKit.Application.prototype._updateLoop = function()
{
    if(!this._loop)return;
    webkitRequestAnimationFrame(this._updateLoop.bind(this));
    this.update();
};

GLKit.Application.prototype.update = function(){};

GLKit.Application.prototype._updateGLViewport = function()
{
    var window = this._window,
        gl     = this._gl;



};






