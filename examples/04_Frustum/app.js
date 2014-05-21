var Foam        = require('../../src/foam/foam.js'),
    glTrans     = Foam.glTrans,
    glDraw      = Foam.glDraw,
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    Ease        = Foam.Ease,
    Texture     = Foam.Texture;

var gl;
var shaderSource;
var textureSource;

function App() {
    Foam.Application.apply(this, arguments);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(800, 600);

    gl      = Foam.gl.get();
    glDraw  = Foam.glDraw.get();

    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

    var program = this._program = new Program(shaderSource);
    program.bind();

    var camera = this._camera0 = new CameraPersp();
    camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 20.0);
    camera.lookAt(Vec3.ONE(), Vec3.ZERO());
    camera.updateMatrices();

    camera = this._camera1 = new CameraPersp();
    camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 20.0);
    camera.lookAt(Vec3.create(3,6,3), Vec3.ZERO());
    camera.updateMatrices();


    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],4.0);
};

App.prototype.update = function () {
    var t = this.getSecondsElapsed();

    gl.clearColor(0.1,0.1,0.1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var camera = this._camera0;
    camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
    camera.updateMatrices();

    camera = this._camera1;
    glTrans.setMatricesCamera(camera);

    camera = this._camera0;

    glTrans.pushMatrix();
    glTrans.translate(camera.getEye());
    glDraw.drawCubeStroked(0.125);
    glTrans.rotate(camera.getDirection());

    glTrans.popMatrix();

    glDraw.drawPivot();

    var program = this._program;

    gl.uniform1f(program['uUseTexture'],0.5 + Math.sin(t*4) * 0.5);
    glDraw.color3f(1,0,0.25);
    glTrans.pushMatrix();
    glTrans.translate3f(-0.5,-0.5,0);
    glDraw.drawRect();
    glTrans.popMatrix();
    gl.uniform1f(program['uUseTexture'],0.0);
};

var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/04_Frustum/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
