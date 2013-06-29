GLKit.Application = function(parentDomElement)
{
    this._window = new GLKit.Window(parentDomElement);
    this._gl     = null;
    this._camera = null;


    if(GLKit.Application._instance)throw 'fdfdf';
       GLKit.Application._instance = this;
};

GLKit.Application.prototype.getWindow = function(){return this._window;};
GLKit.Application.prototype.getGL     = function(){return this._gl;};

GLKit.Application.prototype.setWindowSize = function(width, height)
{
    var window = this._window;
        window.setSize(width,height);

    var camera = this._camera;

    var gl     = this._gl = new GLKit.GL(window.getGL());
        gl.setProjectionMatrix(null);
        gl.setModelViewMatrix(null);



};

GLKit.Application.prototype._updateGLViewport = function()
{
    var window = this._window,
        gl     = this._gl;



};





