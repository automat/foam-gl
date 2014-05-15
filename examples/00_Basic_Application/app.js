var Foam     = require('../../src/foam/foam.js'),
    fMath    = Foam.Math,
    glTrans  = Foam.glTrans,
    System   = Foam.System,
    Matrix44 = Foam.Matrix44,
    Program  = Foam.Program;


var gl;

var shaderSource = '';

function App() {
    Foam.Application.apply(this, arguments);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(800, 600);

    gl = Foam.gl.get();
    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

    var program = this._program = new Program(shaderSource);
    program.bind();

    this._vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
        [0,0,0,100,0,0,0,100,0,100,100,0]),
        gl.STATIC_DRAW);
    gl.vertexAttribPointer(this._program['aVertexPosition'], 3, gl.FLOAT, false, 0, 0);

    gl.enable(gl.SCISSOR_TEST);

};

App.prototype.update = function () {
    var program = this._program;

    var t = this.getSecondsElapsed();

    var windowWidth    = this.getWindowWidth();
    var windowWidth_2  = windowWidth * 0.5;
    var windowWidth_4  = windowWidth * 0.25;
    var windowHeight   = this.getWindowHeight();
    var windowHeight_2 = windowHeight * 0.5;
    var windowHeight_4 = windowHeight * 0.25;

    gl.uniform4f(program['uColor'], 1,1,1,1);

    //  tl

    gl.scissor( 0,windowHeight_2, windowWidth_2, windowHeight_2);
    gl.viewport(0,windowHeight_2, windowWidth_2, windowHeight_2);
    glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

    gl.clearColor(1,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    glTrans.pushMatrix();
    glTrans.translate3f(windowWidth_4, windowHeight_4, 0.0);
    glTrans.rotate3f(0,0,t);
    glTrans.scale1f(Math.sin(t));
    this.drawGeom();
    glTrans.popMatrix();

    //  tr

    gl.scissor( windowWidth_2,windowHeight_2,windowWidth,windowHeight_2);
    gl.viewport(windowWidth_2,windowHeight_2,windowWidth_2,windowHeight_2);
    glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

    gl.clearColor(1,0,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    glTrans.pushMatrix();
    glTrans.translate3f(0,(0.5 + Math.sin(t) * 0.5) * windowHeight_2,0);
    glTrans.rotate3f(0,0,(0.5 + Math.sin(t) * 0.5) * Math.PI * 0.5);
    this.drawGeom();
    glTrans.popMatrix();

    //  bl

    gl.scissor( 0,0,windowWidth_2,windowHeight_2);
    gl.viewport(0,0,windowWidth_2,windowHeight_2);
    glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

    gl.clearColor(0,0,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    glTrans.pushMatrix();
    glTrans.multMatrix(Matrix44.createTranslation(windowWidth_4,windowHeight_4,0));
    glTrans.scale1f(Math.sin(t));
    this.drawGeom();
    glTrans.popMatrix();


    //  br

    gl.scissor( windowWidth_2,0,windowWidth,windowHeight_2);
    gl.viewport(windowWidth_2,0,windowWidth_2,windowHeight_2);
    glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

    gl.clearColor(1,1,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var offset = fMath.stepCubed(Math.sin(t * 2)) * Math.round(Math.sin(t*2));

    glTrans.pushMatrix();
    glTrans.translate3f(windowWidth_4 - 50,windowHeight_4,0);
    glTrans.scale3f(1,offset / 100 * windowHeight_2,1);
    gl.uniform4f(program['uColor'], 0,1,1,1);
    this.drawGeom();
    glTrans.popMatrix();
};


App.prototype.drawGeom = function(){
    gl.uniformMatrix4fv(this._program['uProjectionMatrix'], false, glTrans.getProjectionMatrix());
    gl.uniformMatrix4fv(this._program['uModelViewMatrix'], false, glTrans.getModelViewMatrix());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

var app;

window.addEventListener('load',function(){
    System.loadFile('../examples/00_Basic_Application/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});
