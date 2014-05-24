var Foam         = require('../../src/foam/foam.js'),
    glTrans      = Foam.glTrans,
    glDraw       = Foam.glDraw,
    System       = Foam.System,
    Vec3         = Foam.Vec3,
    Program      = Foam.Program,
    CameraPersp  = Foam.CameraPersp,
    CameraOrtho  = Foam.CameraOrtho,
    Ease         = Foam.Ease,
    Texture      = Foam.Texture;

var Fbo = Foam.Fbo;
var FrustumOrtho = Foam.FrustumOrtho;

var gl;
var shaderSource;
var textureSource;

function App() {
    Foam.Application.apply(this, arguments);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(window.innerWidth, window.innerHeight);

    gl      = Foam.gl.get();
    glDraw  = Foam.glDraw.get();

    var program = this._program = new Program(shaderSource);
    program.bind();

    var camera;
    camera = this._cameraPersp = new CameraPersp();
    camera.lookAt(Vec3.one(), Vec3.zero());
    camera.updateMatrices();

    camera = this._cameraOrtho = new CameraOrtho();
    camera.lookAt(new Vec3(-1,1,1),Vec3.zero());
    camera.updateMatrices();

    camera = this._camera = new CameraOrtho();
    camera.lookAt(Vec3.one(),Vec3.zero());
    camera.updateMatrices();

    this._frustumOrtho = new FrustumOrtho();

    this.updateView();

    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],4.0);
};

App.prototype.update = function () {
    var t = this.getSecondsElapsed();

    gl.clearColor(0.1,0.1,0.1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var camera = this._camera;

    glTrans.setMatricesCamera(camera);

    camera = this._cameraPersp;
    camera.setEye3f(Math.cos(t * 0.5) * 2, Math.sin(t * 0.5), Math.sin(t * 0.5) * 2);
    camera.updateMatrices();
    camera.debugDraw();

    var windowAspectRatio = this.getWindowAspectRatio();
    var zoom = 0.5 + (0.5 + Math.sin(t) * 0.5) * 0.5;

    camera = this._cameraOrtho;
    camera.setOrtho(-windowAspectRatio * zoom, windowAspectRatio * zoom, -zoom, zoom,-1,3);
    camera.setEye3f(Math.cos(t) * 2, Math.sin(t), Math.sin(t) * 2);
    camera.updateMatrices();

    this._frustumOrtho.set(camera);
    //glTrans.setMatricesCamera(camera);
    this.drawScene();

};

App.prototype.drawScene = function(){
    glDraw.drawGrid(20,20);
    glDraw.drawPivot(3);
    glDraw.drawCubeColored(0.25);
    this._frustumOrtho.draw();
    this._cameraOrtho.debugDraw();
};

App.prototype.updateView = function(){
    var windowAspectRatio = this.getWindowAspectRatio();
    var zoom = 3;
    this._camera.setOrtho(-windowAspectRatio * zoom,windowAspectRatio * zoom,-zoom,zoom,-3,10);
    this._cameraPersp.setPerspective(45.0,windowAspectRatio,0.00125, 20.0);
    this.setWindowSize(window.innerWidth,window.innerHeight);
    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());
};

App.prototype.onWindowResize = function(){
    this.updateView();
};

var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/04_Frustum/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
