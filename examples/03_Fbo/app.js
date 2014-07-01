var Foam        = require('../../src/foam/Foam.js'),
    glTrans     = Foam.glTrans,
    glDraw      = Foam.glDraw,
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    Ease        = Foam.Ease,
    Fbo         = Foam.Fbo;

var gl;

var shaderSource = '';

function App() {
    Foam.App.apply(this, arguments);
}

App.prototype = Object.create(Foam.App.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(800, 600);

    var windowWidth  = this.getWindowWidth();
    var windowHeight = this.getWindowHeight();

    gl      = Foam.gl.get();
    glDraw  = Foam.glDraw.get();


    var fboScale = this._fboScale = 2;

    var program = this._program = new Program(shaderSource);
    program.bind();

    var windowAspectRatio = this.getWindowAspectRatio();

    this._camera = new CameraPersp();
    this._camera.setPerspective(45.0,windowAspectRatio,0.00125, 20.0);
    this._camera.lookAt(new Vec3(5,5,5), Vec3.zero());
    this._camera.updateMatrices();

    var format = new Fbo.Format();
    this._fbo = new Fbo(windowWidth * fboScale, windowHeight * fboScale);


    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],4.0);
};

App.prototype.update = function () {
    var t = this.getSecondsElapsed();

    var fboScale = this._fboScale;
    var windowWidth = this.getWindowWidth();
    var windowHeight = this.getWindowHeight();

    var fbo = this._fbo;
    var program = this._program;

    fbo.bind();
    gl.viewport(0,0,windowWidth * fboScale, windowHeight * fboScale);
    gl.clearColor(1,0,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var camera = this._camera;
    camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawPivot();


    var num = 5;
    var step = 1 / (num-1);
    var i, j, k;
    i = -1;
    while(++i < num){
        j = -1;
        while(++j < num){
            k = -1;
            while(++k < num){
                glTrans.pushMatrix();
                glTrans.translate3f(-0.5 + i * step, -0.5 + j * step, -0.5 + k * step);
                glTrans.scale1f(0.105);
                glDraw.drawCubeColored();
                glTrans.popMatrix();
            }
        }

    }

    fbo.unbind();

    gl.viewport(0,0,windowWidth,windowHeight);

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glTrans.setWindowMatrices(windowWidth, windowHeight, false);

    glDraw.color3f(1,1,1);
    fbo.bindTexture();
    gl.uniform1f(program['uUseTexture'],1.0);
    glDraw.drawRect(windowWidth,windowHeight);
    gl.uniform1f(program['uUseTexture'],0.0);
    fbo.unbindTexture();


};

App.prototype.drawGeom = function(){
    glDraw.drawCubeColored();
    glDraw.drawCubePoints();
};

var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/03_Fbo/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
