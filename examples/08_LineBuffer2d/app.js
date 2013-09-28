var Foam = require('../../src/foam/foam.js');

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
    this._zoom = 3;

    var light0 = this._light0 = new Foam.Light(this.fgl.LIGHT_0);
    light0.setAmbient3f(0,0,0);
    light0.setDiffuse3f(0.8,0.8,0.8);
    light0.setSpecular3f(1,1,1);
    light0.setPosition3f(1,1,1);

    var material = this._material0 = new Foam.Material();
    material.setDiffuse3f(0.7,0.7,0.7);
    material.setAmbient3f(0.7,0.7,0.7);
    material.setSpecular3f(1,1,1);
    material.shininess = 20.0;

    var buffer = this._buffer = new Foam.LineBuffer2d(this.fgl,1500 * 100 * 3);

};

App.prototype.update = function()
{
    var gl        = this.fgl,
        cam       = this.camera,
        time      = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta();

    var light0 = this._light0;

    var zoom = this._zoom = Foam.Math.lerp(this._zoom, 3 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


    gl.clear3f(0.1,0.1,0.1);
    gl.loadIdentity();

    gl.drawMode(gl.LINES);

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
        camRotX = time * 0.25;

        cam.setPosition3f(Math.cos(camRotX) * zoom,
            zoom,
            Math.sin(camRotX) * zoom);

    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    gl.drawMode(gl.LINE_LOOP);

    this.drawSystem();

    var buffer = this._buffer;

    buffer.bind();
    buffer.buffer();

    buffer.reset();

    var objNum  = 1500,
        objSize = 100;

    var i = -1,
        ni,
        s = Math.PI * 2 / (objSize - 1);

    var j;

    while(++i < objNum)
    {
        j = -1;
        while(++j < objSize)
        {
            ni = i/objNum;

            buffer.pushVertex3f(Math.cos(s*j)*(1+ni*3),(i/objNum)*1.25 + Math.sin(j/(objSize-1)*Math.PI*10 + time * 0.25)*0.25,Math.sin(s*j)*(1+ni*3));
            if(i > 0)buffer.pushColor4f(ni,ni*0.25,1,1);else buffer.pushColor4f(1,1,1,1);
        }
    }

    i = -1;
    while(++i < objNum)
    {
        buffer.draw(i * objSize,objSize)
    }

    buffer.unbind();
};

App.prototype.drawSystem =  function()
{
    var kgl = this.fgl;

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
