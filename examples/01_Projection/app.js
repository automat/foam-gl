var Foam        = require('../../src/foam/foam.js'),
    fMath       = Foam.Math,
    glTrans     = Foam.glTrans,
    glDraw      = Foam.glDraw,
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Matrix44    = Foam.Matrix44,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    CameraOrtho = Foam.CameraOrtho;


var gl;

var shaderSource = '';

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


    var vbo = this._vbo =  gl.createBuffer();
    var ibo = gl.createBuffer();

    var vertices = this._vertices = new Float32Array([
        -0.5,-0.5,-0.5,
        -0.5,-0.5, 0.5,
         0.5,-0.5,-0.5,
         0.5,-0.5, 0.5,

        -0.5, 0.5,-0.5,
        -0.5, 0.5, 0.5,
         0.5, 0.5,-0.5,
         0.5, 0.5, 0.5,

        -0.5, 0.5,-0.5,
        -0.5, 0.5, 0.5,
        -0.5,-0.5,-0.5,
        -0.5,-0.5, 0.5,

        -0.5,-0.5,-0.5,
         0.5,-0.5,-0.5,
        -0.5, 0.5,-0.5,
         0.5, 0.5,-0.5,

        -0.5,-0.5, 0.5,
         0.5,-0.5, 0.5,
        -0.5, 0.5, 0.5,
         0.5, 0.5, 0.5,

         0.5, 0.5,-0.5,
         0.5, 0.5, 0.5,
         0.5,-0.5,-0.5,
         0.5,-0.5, 0.5


    ]);


    var colorTriangles = this._colorTriangles = new Float32Array([
        0, 0.5, 0, 1,
        0, 0.5, 0, 1,
        0, 0.5, 0, 1,
        0, 0.5, 0, 1,

        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,

        0.5, 0, 0, 1,
        0.5, 0, 0, 1,
        0.5, 0, 0, 1,
        0.5, 0, 0, 1,

        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,

        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,

        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 0, 1

    ]);

    var colorPoints = new Float32Array([
        1,1,1,1,
        1,1,1,1,
        1,1,1,1,
        1,1,1,1,

        1,1,1,1,
        1,1,1,1,
        1,1,1,1,
        1,1,1,1
    ]);

    var indicesTriangles = this._indicesTriangles = new Uint16Array([
        0,1,2,1,2,3,
        4,5,6,5,6,7,
        8,9,10,9,10,11,
        12,13,14,13,14,15,
        16,17,18,17,18,19,
        20,21,22,21,22,23
        ]);

    var indicesPoints = this._indicesPoints = new Uint16Array([
       0,1,2,3,4,5,6,7
    ]);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indicesTriangles.byteLength + indicesPoints.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indicesTriangles);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, indicesTriangles.byteLength, indicesPoints);

    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + colorTriangles.byteLength + colorPoints.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colorTriangles);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength + colorTriangles.byteLength, colorPoints);


    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);

    this._offsetColorTriangles = vertices.byteLength;
    this._offsetColorPoints    = vertices.byteLength + colorPoints.byteLength;

    var windowAspectRatio = this.getWindowAspectRatio();

    this._camera0 = new CameraPersp();
    this._camera0.setPerspective(45.0,windowAspectRatio,0.00125, 10.0);
    this._camera0.lookAt(Vec3.ONE(), Vec3.ZERO());
    this._camera0.updateMatrices();

    this._camera1 = new CameraPersp();
    this._camera1.setPerspective(45.0,windowAspectRatio,0.00125, 10.0);
    this._camera1.lookAt(Vec3.create(5,0,5), Vec3.ZERO());
    this._camera1.updateMatrices();

    var zoom = 2;

    this._camera2 = new CameraOrtho();
    this._camera2.setOrtho(-windowAspectRatio * zoom,windowAspectRatio * zoom,-zoom,zoom,-1,10);
    this._camera2.lookAt(Vec3.ONE(),Vec3.ZERO());
    this._camera2.updateMatrices();

    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],10.0);
};

App.prototype.update = function () {

    var t = this.getSecondsElapsed();

    var windowWidth    = this.getWindowWidth();
    var windowWidth_2  = windowWidth * 0.5;
    var windowHeight   = this.getWindowHeight();
    var windowHeight_2 = windowHeight * 0.5;



    //  tl

    gl.scissor( 0,windowHeight_2, windowWidth_2, windowHeight_2);
    gl.viewport(0,windowHeight_2, windowWidth_2, windowHeight_2);


    gl.clearColor(0.15,0.15,0.15,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var camera = this._camera0;
    camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.translate3f(Math.cos(-t) * 0.5, 0, Math.sin(-t) * 0.5);
    glTrans.rotate3f(Math.sin(t),0,Math.sin(t));
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

    camera.setEye3f(Math.cos(t)*3,0,Math.sin(t)*3);
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.rotate3f(t,0,0);
    glDraw.drawPivot();
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

    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.translate3f(Math.sin(t),0,0);
    glTrans.rotate3f(fMath.stepSmoothInvSquared(0.5 + Math.sin(t) * 0.5) * Math.PI * 2,0,0);
    glDraw.drawPivot();

    var scaleY  = fMath.stepInvCubed(0.5 + Math.sin(t * 4) * 0.5) * 1.75 + 0.25;
    var scaleXZ = fMath.stepCubed(0.5 + Math.sin(t * 4)) * 0.125 + 0.15;

    glTrans.scale3f(scaleXZ, scaleY, scaleXZ);
    this.drawGeom();
    glTrans.popMatrix();


    //  br

    gl.scissor( windowWidth_2,0,windowWidth,windowHeight_2);
    gl.viewport(windowWidth_2,0,windowWidth_2,windowHeight_2);
    glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

    gl.clearColor(0.15,0.15,0.15,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    camera = this._camera2;
    glTrans.setMatricesCamera(camera);

    glDraw.drawPivot();

    glTrans.pushMatrix();
    glTrans.translate3f(Math.sin(t),0,0);
    glDraw.drawPivot();
    this.drawGeom();
    glTrans.popMatrix();
};

App.prototype.drawGeom = function(){
   var program = this._program;

    gl.uniformMatrix4fv(program['uProjectionMatrix'], false, glTrans.getProjectionMatrix());
    gl.uniformMatrix4fv(program['uModelViewMatrix'], false, glTrans.getModelViewMatrix());

    gl.vertexAttribPointer(program['aVertexPosition'],3,gl.FLOAT,false,0,0);

    gl.vertexAttribPointer(program['aVertexColor'],   4,gl.FLOAT,false,0, this._vertices.byteLength);
    gl.drawElements(gl.TRIANGLES, this._indicesTriangles.length, gl.UNSIGNED_SHORT, 0);

    gl.vertexAttribPointer(program['aVertexColor'],   4,gl.FLOAT,false,0, this._vertices.byteLength + this._colorTriangles.byteLength);
    gl.drawElements(gl.POINTS, this._indicesPoints.length, gl.UNSIGNED_SHORT, this._indicesTriangles.byteLength);


};




var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/01_Projection/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
