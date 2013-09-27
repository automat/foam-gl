var Foam = require('../../src/Foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(1024,768);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function()
{
    var kgl = this.kgl;

    this._zoom = 6;

    var isoBand = this._isoBand = new Foam.ISOBand(100,100,4,4);
        isoBand.setFunction(function(x,y,t){return Math.sin(x*y*100+t*10);});
        isoBand.applyFunction();
};

App.prototype.update = function()
{
    var kgl       = this.kgl,
        cam       = this.camera,
        time      = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta();

    var zoom = this._zoom = Foam.Math.lerp(this._zoom, 6 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    kgl.drawMode(kgl.LINES);

    var camRotX,camRotY;

    if(this.isMouseDown())
    {
        camRotX = ( -1 + this.mouse.getX() / this.getWidth() * 2.0 ) * Math.PI;
        camRotY = ( -1 + this.mouse.getY() / this.getHeight() * 2.0) * Math.PI * 0.5;

        Foam.Vec3.lerp3f(cam.position,
                          Math.cos(camRotX) * zoom,
                          Math.sin(camRotY) * zoom,
                          Math.sin(camRotX) * zoom,
                          timeDelta * 0.25);
    }
    else
    {
        cam.setPosition3f(0,zoom,0.0001);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    kgl.drawMode(kgl.LINE_LOOP);

    this.drawSystem();

    /*---------------------------------------------------------------------------------------------------------*/

    var isoBand = this._isoBand;
        isoBand.applyFunction(time);

    kgl.drawMode(kgl.LINES);
    kgl.color3f(1,0,1);
    kgl.drawGeometry(isoBand);
};

App.prototype.drawSystem =  function()
{
    var kgl = this.kgl;

    kgl.color1f(0.10);
    Foam.fGLUtil.drawGridCube(kgl,70,1);

    kgl.color1f(0.075);
    kgl.pushMatrix();
    {
        kgl.translate3f(0,-0.01,0);
        Foam.fGLUtil.drawGrid(kgl,70,1);
    }
    kgl.popMatrix();
};

var app = new App();
