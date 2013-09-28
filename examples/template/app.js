var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(800,600);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function(){};

App.prototype.update = function()
{
    var fgl = this.fgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 1 + Math.sin(time) * 0.25;

    fgl.clear3f(0.1,0.1,0.1);
    fgl.loadIdentity();

    cam.setPosition3f(Math.cos(time)*Math.PI*zoom,zoom,Math.sin(time)*Math.PI*zoom);
    cam.updateMatrices();

    this.drawSystem();
};

App.prototype.drawSystem =  function()
{
    var fgl = this.fgl;

    fgl.color1f(0.25);
    Foam.fGLUtil.drawGrid(fgl,8,1);
    Foam.fGLUtil.drawGridCube(fgl,8,1);
    Foam.fGLUtil.drawAxes(fgl,4);
};

var app = new App();
