var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(1025,768);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function()
{
    // Put object inits here
};

App.prototype.update = function()
{
    var fgl = this.fgl;
    var cam = this.camera;

    var time      = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta(),
        zoom      = 10 + Math.sin(time) * 0.25;

    fgl.clear3f(0.1,0.1,0.1);
    fgl.loadIdentity();

    var camRotX, camRotY;

    if(this.isMouseDown())
    {
        camRotX = (-1 + this.mouse.getX() / this.getWidth()  * 2.0) * Math.PI;
        camRotY = (-1 + this.mouse.getY() / this.getHeight() * 2.0) * Math.PI ;

        Foam.Vec3.lerp3f(cam.position,
                         Math.cos(camRotX) * zoom,
                         Math.sin(camRotY) * zoom,
                         Math.sin(camRotX) * zoom,
                         timeDelta * 0.25);
    }
    else
    {
        camRotX = time * 0.25;

        cam.setPosition3f(Math.cos(camRotX) * zoom,
                          zoom,
                          Math.sin(camRotX) * zoom);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    this.drawSystem();
};

App.prototype.drawSystem =  function()
{
    var fgl = this.fgl;

    fgl.color1f(0.15);
    Foam.fGLUtil.drawGrid(fgl,48,1);
    Foam.fGLUtil.drawGridCube(fgl,48,1);
    Foam.fGLUtil.drawAxes(fgl,12);
};

var app = new App();
