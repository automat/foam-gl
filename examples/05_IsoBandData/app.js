var GLKit = require('../../src/glKit/foam.js');

function App()
{
    GLKit.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(2024,1200);
}

App.prototype = Object.create(GLKit.Application.prototype);

App.prototype.setup = function()
{
    this._zoom = 6;

    this._sampleData = [1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,
        0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1];

    var isoBand = this._isoBand = new GLKit.ISOBand(32,32,4,4);
        isoBand.setData(this._sampleData,32,32);
        isoBand.setFunction(function(x,y,time){return Math.sin(x*x*10+time*10)+Math.sin(y*y*10+time*10);});

};

App.prototype.update = function()
{
    var gl        = this.kgl,
        cam       = this.camera,
        time      = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta();

    var zoom = this._zoom = GLKit.Math.lerp(this._zoom, 6 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


    gl.clear3f(0.1,0.1,0.1);
    gl.loadIdentity();

    gl.drawMode(gl.LINES);

    var camRotX,camRotY;

    if(this.isMouseDown())
    {
        camRotX = ( -1 + this.mouse.getX() / this.getWidth() * 2.0 ) * Math.PI;
        camRotY = ( -1 + this.mouse.getY() / this.getHeight() * 2.0) * Math.PI * 0.5;

        GLKit.Vec3.lerp3f(cam.position,
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

    gl.drawMode(gl.LINE_LOOP);

    this.drawSystem();

    /*---------------------------------------------------------------------------------------------------------*/

    var isoBand           = this._isoBand,
        isoBandVertices   = isoBand.getVertices();

    isoBand.setData(this._sampleData,32,32);
    isoBand.applyFunctionMult(time);
    isoBand.march();

    gl.drawMode(gl.POINTS);
    gl.pointSize(4);
    gl.color1f(1);

    var i = 0;
    while(i < isoBandVertices.length)
    {
        if(isoBandVertices[i+3]>0){gl.pointSize(3);gl.color1f(1);}
        else {gl.pointSize(1);gl.color3f(0,0,1);}

        gl.point3f(isoBandVertices[i+0],
            isoBandVertices[i+1],
            isoBandVertices[i+2]);


        i+=4;
    }


    gl.drawMode(gl.LINES);
    gl.color3f(1,0,1);

    gl.drawGeometry(isoBand);
};

App.prototype.drawSystem =  function()
{
    var kgl = this.kgl;

    kgl.color1f(0.10);
    GLKit.fGLUtil.drawGridCube(kgl,70,1);

    kgl.color1f(0.075);
    kgl.pushMatrix();
    {
        kgl.translate3f(0,-0.01,0);
        GLKit.fGLUtil.drawGrid(kgl,70,1);
    }
    kgl.popMatrix();
};

var app = new App();
