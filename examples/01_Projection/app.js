var Foam        = require('../../src/foam/Foam.js'),
    glTrans     = Foam.glTrans,
    glDraw      = Foam.glDraw,
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Matrix44    = Foam.Matrix44,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    CameraOrtho = Foam.CameraOrtho,
    Ease        = Foam.Ease;

var gl;

var shaderSource = '';

function App() {
    Foam.App.apply(this, arguments);
}

App.prototype = Object.create(Foam.App.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(800, 600);

    gl      = Foam.gl.get();
    glDraw  = Foam.glDraw.get();

    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

    var program = new Program(shaderSource);
    program.bind();

    var windowAspectRatio = this.getWindowAspectRatio();

    this._camera0 = new CameraPersp();
    this._camera0.setPerspective(45.0,windowAspectRatio,0.00125, 20.0);
    this._camera0.lookAt(Vec3.one(), Vec3.zero());
    this._camera0.updateMatrices();

    this._camera1 = new CameraPersp();
    this._camera1.setPerspective(45.0,windowAspectRatio,0.00125, 20.0);

    var zoom = 2;

    this._camera2 = new CameraOrtho();
    this._camera2.setOrtho(-windowAspectRatio * zoom,windowAspectRatio * zoom,-zoom,zoom,-2,20);
    this._camera2.lookAt(Vec3.one(),Vec3.zero());
    this._camera2.updateMatrices();

    this._camera3 = new CameraOrtho();
    this._camera3.setOrtho(-windowAspectRatio * zoom,windowAspectRatio * zoom,-zoom,zoom,-20,20);
    this._camera3.lookAt(Vec3.one(),Vec3.zero());
    this._camera3.updateMatrices();

    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],4.0);
};

App.prototype.update = function () {

    var t = this.getSecondsElapsed();

    var windowWidth    = this.getWindowWidth();
    var windowWidth_2  = windowWidth * 0.5;
    var windowHeight   = this.getWindowHeight();
    var windowHeight_2 = windowHeight * 0.5;

    var gridSize = 10;
    var gridSubDivs = 20;



    //  tl

    gl.scissor( 0,windowHeight_2, windowWidth_2, windowHeight_2);
    gl.viewport(0,windowHeight_2, windowWidth_2, windowHeight_2);


    gl.clearColor(0.1,0.1,0.1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var camera = this._camera0;
    camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawGrid(gridSize,gridSubDivs);
    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.translate3f(Math.cos(-t) * 0.5, 0.5, Math.sin(-t) * 0.5);
    glTrans.rotate3f(Math.sin(t) * Math.PI ,0,Math.sin(t));
    glDraw.drawPivot();
    glTrans.scale1f(0.75);
    this.drawGeom();
    glTrans.popMatrix();


    //  tr

    gl.scissor( windowWidth_2,windowHeight_2,windowWidth,windowHeight_2);
    gl.viewport(windowWidth_2,windowHeight_2,windowWidth_2,windowHeight_2);

    gl.clearColor(0.15,0.15,0.15,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera = this._camera1;

    camera.setEye3f(Math.cos(t)*3,Math.sin(t)*Math.PI,Math.sin(t)*3);
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawGrid(gridSize,gridSubDivs);
    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.rotate3f(t,0,0);
    glDraw.drawPivot(1.5);
    glTrans.scale3f(2,0.05,2);
    this.drawGeom();
    glTrans.popMatrix();


    //  bl

    gl.scissor( 0,0,windowWidth_2,windowHeight_2);
    gl.viewport(0,0,windowWidth_2,windowHeight_2);

    gl.clearColor(0.15,0.15,0.15,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera = this._camera2;
    glTrans.setMatricesCamera(camera);

    glDraw.drawGrid(gridSize,gridSubDivs);
    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.translate3f(Math.sin(t),0,0);
    glTrans.rotate3f(Ease.stepSmoothInvSquared(0.5 + Math.sin(t) * 0.5) * Math.PI * 2,0,0);
    glDraw.drawGrid(2,gridSubDivs);
    glDraw.drawPivot(1.5);

    var scaleY  = Ease.stepInvCubed(0.5 + Math.sin(t * 4) * 0.5) * 1.75 + 0.25;
    var scaleXZ = Ease.stepCubed(0.5 + Math.sin(t * 4)) * 0.125 + 0.15;

    glTrans.scale3f(scaleXZ, scaleY, scaleXZ);
    this.drawGeom();
    glTrans.popMatrix();


    //  br

    gl.scissor( windowWidth_2,0,windowWidth,windowHeight_2);
    gl.viewport(windowWidth_2,0,windowWidth_2,windowHeight_2);
    glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

    gl.clearColor(0.1,0.1,0.1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    camera = this._camera3;
    camera.setZoom(2 + Ease.stepSmoothInvSquared(0.5 + Math.sin(t) * 0.5) * 8);
    camera.setEye3f(Math.cos(t),1,Math.sin(t));
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawGrid(30,gridSubDivs);
    glDraw.drawPivot(2.0);

    glTrans.pushMatrix();
    glTrans.translate3f(0,0.5,0);
    this.drawGeom();
    glTrans.popMatrix();

};

App.prototype.drawGeom = function(){
    glDraw.drawCubeColored();
    glDraw.drawCubePoints();
};

var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/01_Projection/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
