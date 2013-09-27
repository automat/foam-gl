var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(4024,1200);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function()
{
    this._zoom = 8;

    var kgl = this.kgl;

    this.camera.setPosition3f(6,6,6);

    var light0 = this._light0 = new Foam.Light(kgl.LIGHT_0);
    light0.setAmbient3f(1,1,1);
    light0.setDiffuse3f(0.25,0,0);
    light0.setSpecular3f(1,1,1);
    light0.setPosition3f(3,3,3);

    var light1 = this._light1 = new Foam.Light(kgl.LIGHT_1);
    light1.setAmbient3f(0,0,0);
    light1.setDiffuse3f(0.8,0.2,0.4);
    light1.setSpecular3f(1,1,1);
    light1.setPosition3f(3,3,3);

    var light2 = this._light2 = new Foam.Light(kgl.LIGHT_2);
    light2.setAmbient3f(1,1,1);
    light2.setDiffuse3f(1,1,1);
    light2.setSpecular3f(1,1,1);
    light2.setPosition3f(0,5,0);

    var light3 = this._light3 = new Foam.Light(kgl.LIGHT_3);
    light3.setAmbient3f(0,0,0);
    light3.setDiffuse3f(0.1,0.1,0.6);
    light3.setSpecular3f(1,1,1);
    light3.setPosition3f(0,5,0);

    var material = this._material0 = new Foam.Material();
    material.setDiffuse3f(0.7,0.7,0.7);
    material.setAmbient3f(0.7,0.7,0.7);
    material.setSpecular3f(1,1,1);
    material.shininess = 20.0;

    var isoSurface = this._isoSurface = new Foam.ISOSurface(80);

    isoSurface.setFunction(function(x,y,z,arg0)
    {
        var s = 0.035 + Math.abs(Math.sin(arg0)) * 0.015;

        //lazy

        var sint    = Math.sin(arg0),
            sint2   = Math.sin(arg0 * 2),
            sint025 = Math.sin(arg0 * 0.25),
            sint05  = Math.sin(arg0) * 0.5,
            sint5   = Math.sin(arg0 * 5);

        var m0  = s / Math.sqrt(Math.pow(x + sint2*0.5,2) + Math.pow(y+sint025*0.5,2) + Math.pow(z,2));

        var m1 = s / Math.sqrt(Math.pow(x + sint * 0.5, 2) + Math.pow(y + sint025 * 0.5, 2) + Math.pow(z + sint * 0.25, 2));

        s = 0.035 + Math.abs(sint2) * 0.015;

        var m2 = s / Math.sqrt(Math.pow(x - sint5 * 0.5, 2) + Math.pow(y - sint025 * 0.5, 2) + Math.pow(z + sint * 0.25, 2));

        s = 0.035 + Math.abs(sint5) * 0.015;

        var m3 = s / Math.sqrt(Math.pow(x - sint025 * 0.25, 2) + Math.pow(y - sint05 * 0.25, 2) + Math.pow(z + sint * 0.25, 2));

        s = 0.035 + Math.abs(sint025) * 0.015;

        var m4 = s / Math.sqrt(Math.pow(x - sint025 * 0.5, 2) + Math.pow(y - Math.sin(arg0 * 0.125) * 0.5, 2) + Math.pow(z + Math.sin(arg0 * 2) * 0.25, 2));
        var m5 = s / Math.sqrt(Math.pow(x - Math.sin(arg0 * 2.4) * 0.5, 2) + Math.pow(y - sint025 * 0.5, 2) + Math.pow(z + sint5 * 0.25, 2));
        var m6 = s / Math.sqrt(Math.pow(x - Math.sin(arg0 * 1.25) * 0.5, 2) + Math.pow(y - Math.sin(arg0 * 0.125) * 0.5, 2) + Math.pow(z + sint025 * 0.25, 2));
        var m7 = s / Math.sqrt(Math.pow(x + sint2 * 0.5, 2) + Math.pow(y + Math.sin(arg0 * 0.525) * 0.25, 2) + Math.pow(z, 2));
        var m8 = s / Math.sqrt(Math.pow(x + sint * 0.5, 2) + Math.pow(y + Math.sin(arg0 * 0.625) * 0.35, 2) + Math.pow(z + sint * 0.25, 2));
        var m9 = s / Math.sqrt(Math.pow(x - sint5 * 0.5, 2) + Math.pow(y - Math.sin(arg0 * 0.225) * 0.5, 2) + Math.pow(z + sint * 0.25, 2));
        var m10 = s / Math.sqrt(Math.pow(x - Math.sin(arg0 * 0.224) * 0.255, 2) + Math.pow(y - sint05 * 0.25, 2) + Math.pow(z + sint * 0.25, 2));
        var m11 = s / Math.sqrt(Math.pow(x - sint025 * 0.15, 2) + Math.pow(y - sint025 * 0.35, 2) + Math.pow(z + Math.sin(arg0 * 2) * 0.25, 2));
        var m12 = s / Math.sqrt(Math.pow(x - Math.sin(arg0 * 2.4) * 0.45, 2) + Math.pow(y - Math.sin(arg0 * 0.2) * 0.15, 2) + Math.pow(z + sint5 * 0.25, 2));
        var m13 = s / Math.sqrt(Math.pow(x - Math.sin(arg0 * 1.25) * 0.35, 2) + Math.pow(y - sint05 * 0.5, 2) + Math.pow(z + sint025 * 0.25, 2));


        return m0 + m1 + m2 + m3 + m4 + m5 + m6 + m7 + m8 + m9 + m10 + m11 + m12 + m13  - 1.5

    },0);
};

App.prototype.update = function()
{
    var gl        = this.kgl,
        cam       = this.camera,
        time      = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta();

    var light0 = this._light0,
        light1 = this._light1,
        light2 = this._light2,
        light3 = this._light3;

    var zoom = this._zoom = Foam.Math.lerp(this._zoom, 8 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


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

    if(!this.isKeyDown())
    {
        this._isoSurface.applyFunction1f(time);
        this._isoSurface.update();
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    light0.setPosition3f(Math.cos(time*3)*6,Math.sin(time)*2,Math.sin(time*3)*6);
    light1.setPosition3f(Math.cos(time*3+Math.PI)*6,Math.sin(time)*2,Math.sin(time*3+Math.PI)*6);
    light2.setPosition3f(0,Math.sin(time)*5,0);
    light3.setPosition3f(Math.cos(time*3)*5,Math.sin(time)*3,0);




    gl.drawMode(gl.LINE_LOOP);
    //this.drawSystem();



    /*---------------------------------------------------------------------------------------------------------*/
    var isoSurface = this._isoSurface;




    gl.drawMode(gl.TRIANGLES);

    gl.useLighting(true);
    gl.useMaterial(true);
    gl.material(this._material0);


    gl.cube(20);

    gl.light(light0);
    gl.light(light1);
    gl.light(light2);
    gl.light(light3);

    gl.pushMatrix();
    gl.scale1f(16);

    gl.drawGeometry(isoSurface);
    gl.popMatrix();

    gl.useMaterial(false);
    gl.useLighting(false);
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
