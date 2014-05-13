var Foam        = require('../../src/foam/foam.js'),
    gl          = Foam.gl,
    glMatrix    = Foam.glMatrix,

    CameraPersp = Foam.CameraPersp,
    Vec3        = Foam.Vec3,
    Program      = Foam.Program;



var shaderSource = '';

function App() {
    Foam.Application.apply(this, arguments);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(800, 600);

    var  gl = this.gl;

    gl.viewport(0,0,this.getWindowWidth,this.getWindowHeight());

    this._camera = new CameraPersp();
    this._camera.setPerspective(65, this.getWindowAspectRatio(), -1, 10);
    this._camera.lookAt(Vec3.ONE(), Vec3.ZERO());

    this._program = new Program(shaderSource);
    this._vbo = gl.createBuffer();

    var size_2 = 0.5;
    this._vertices = new Float32Array(
        [-size_2,-size_2,-size_2,
          size_2,-size_2,-size_2,
          size_2,-size_2,-size_2,
          size_2,-size_2, size_2]);

    this._colors = new Float32Array(
        [1,1,1,1,
         1,1,1,1,
         1,1,1,1,
         1,1,1,1]);

};

App.prototype.update = function () {

    var camera = this._camera;
    var program = this._program;
    var vbo = this._vbo;

    gl.clearColor(1,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.updateMatrices();
    glMatrix.setMatricesCamera(camera);

    program.bind();

    var vertices = this._vertices,
        colors   = this._colors;

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER,vertices.byteLength + colors.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);

    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(program.aVertexColor,    4, gl.FLOAT, false, 0, vertices.byteLength);

    program.uniformMatrix4fv(program.uModelViewMatrix, false,  glMatrix.getModelViewMatrix());
    program.uniformMatrix4fv(program.uProjectionMatrix,false,  glMatrix.getProjectionMatrix()) ;

    gl.drawArrays(gl.POINTS, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    program.unbind();









};

var app;

window.addEventListener('load',function(){
    FileUtil.load('../examples/00_Basic_Application/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
