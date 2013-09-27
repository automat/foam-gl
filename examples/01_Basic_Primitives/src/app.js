var GLKit = require('../../../src/glKit/foam.js');

function App()
{
    GLKit.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(800,600);
}

App.prototype = Object.create(GLKit.Application.prototype);

App.prototype.setup = function(){};

App.prototype.update = function()
{
    var kgl = this.kgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 1 + Math.sin(time) * 0.25;

    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    cam.setPosition3f(Math.cos(time)*Math.PI*zoom,zoom,Math.sin(time)*Math.PI*zoom);
    cam.updateMatrices();

    this.drawSystem();

    kgl.drawMode(kgl.TRIANGLES);
    kgl.color1f(1);
   // kgl.linef(0,0,0,1,1,1);

    kgl.cube(1);


    kgl.drawMode(kgl.LINES);
};

App.prototype.drawSystem =  function()
{
    var kgl = this.kgl;

    kgl.color1f(0.25);
    GLKit.fGLUtil.drawGrid(kgl,8,1);
    GLKit.fGLUtil.drawGridCube(kgl,8,1);
    GLKit.fGLUtil.drawAxes(kgl,4);
};

var app = new App();
