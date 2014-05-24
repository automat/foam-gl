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
    this.setWindowSize(800,600);

    gl      = Foam.gl.get();
    glDraw  = Foam.glDraw.get();

    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

    var program = this._program = new Program(shaderSource);
    program.bind();

    var windowAspectRatio = this.getWindowAspectRatio();
    var camera;

    camera = this._cameraPersp = new CameraPersp();
    camera.setPerspective(45.0,windowAspectRatio,0.0125,7);
    camera.lookAt(Vec3.one(), Vec3.zero());
    camera.updateMatrices();

    camera = this._cameraOrtho = new CameraOrtho();
    camera.lookAt(new Vec3(-1,1,1),Vec3.zero());
    camera.updateMatrices();

    var zoom = 3;

    camera = this._camera = new CameraOrtho();
    camera.setOrtho(-windowAspectRatio * zoom, windowAspectRatio * zoom, -zoom, zoom,-3,6);
    camera.lookAt(Vec3.one(),Vec3.zero());
    camera.updateMatrices();

    this._frustumOrtho = new FrustumOrtho();

    //
    //  test obj
    //

    var num = 1000;
    this._pointBufferVertex = gl.createBuffer();
    this._pointBufferColor = gl.createBuffer();
    this._pointBufferColorData = new Float32Array(num * 4);

    var vertexData = this._pointBufferVertexData = new Float32Array(num * 3);

    var i = -1, j;
    while(++i < num){
        j = i * 3;
        vertexData[j  ] = ( -1 + Math.random() * 2) * 2;
        vertexData[j+1] = ( -1 + Math.random() * 2) * 2;
        vertexData[j+2] = ( -1 + Math.random() * 2) * 2;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this._pointBufferVertex);
    gl.bufferData(gl.ARRAY_BUFFER, this._pointBufferVertexData, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],2.0);
};

App.prototype.update = function () {
    var t = this.getSecondsElapsed();

    gl.clearColor(0.1,0.1,0.1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var camera = this._camera;
    var frustumOtho = this._frustumOrtho;

    glTrans.setMatricesCamera(camera);

    camera = this._cameraPersp;
    camera.setEye3f(Math.cos(t * 0.5) * 2, Math.sin(t * 0.5), Math.sin(t * 0.5) * 2);
    camera.updateMatrices();


    var windowAspectRatio = this.getWindowAspectRatio();
    var zoom = 0.5 + (0.5 + Math.sin(t) * 0.5) * 0.5;

    camera = this._cameraOrtho;
    camera.setOrtho(-windowAspectRatio * zoom, windowAspectRatio * zoom, -zoom, zoom,-1,3);
    camera.setEye3f(Math.cos(t),Math.sin(t),Math.sin(t));
    camera.updateMatrices();

    frustumOtho.set(camera);
    //glTrans.setMatricesCamera(camera);

    var vertexData = this._pointBufferVertexData,
        colorData  = this._pointBufferColorData;

    var i = -1, l = vertexData.length / 3 , j;
    while(i++ < l){
        j = i * 4;
        if(frustumOtho.containsArr(vertexData,i * 3)){
            colorData[j] = colorData[j+1] = colorData[j+2] = colorData[j+3] = 1.0;
        } else {
            colorData[j  ] = colorData[j+3] = 1.0;
            colorData[j+1] = colorData[j+2] = 0.0;
        }
    }


    this.drawScene();



};

App.prototype.drawScene = function(){
    glDraw.drawPivot(3);

    this._frustumOrtho.draw();
    this._cameraOrtho.draw();
    this._cameraPersp.draw();

    var program = this._program;

    gl.disableVertexAttribArray(program[Program.ATTRIB_TEXCOORD]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._pointBufferVertex);
    gl.vertexAttribPointer(program[Program.ATTRIB_VERTEX_POSITION],3,gl.FLOAT,false,0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._pointBufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, this._pointBufferColorData, gl.STREAM_DRAW);
    gl.vertexAttribPointer(program[Program.ATTRIB_VERTEX_COLOR],4,gl.FLOAT,false,0,0);

    gl.uniformMatrix4fv(program[Program.UNIFORM_MODELVIEW_MATRIX] , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(program[Program.UNIFORM_PROJECTION_MATRIX] , false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(gl.POINTS,0,this._pointBufferVertexData.length / 3);

    gl.enableVertexAttribArray(program[Program.ATTRIB_TEXCOORD]);
};





var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/04_Frustum/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
