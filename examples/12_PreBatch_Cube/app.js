var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);


    this.setTargetFPS(60);
    this.setSize(1024,768);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function()
{
    var fgl = this.fgl;

    var light0 = this._light0 = new Foam.Light(fgl.LIGHT_0);
    light0.setAmbient3f(0.8,0.8,0.8);
    light0.setDiffuse3f(0.8,0.8,0.8);
    light0.setSpecular3f(1,1,1);
    light0.setPosition3f(1,1,1);

    var light1 = this._light1 = new Foam.Light(fgl.LIGHT_1);
    light1.setAmbient3f(0.8,0.8,0.8);
    light1.setDiffuse3f(0.8,0.8,0.8);
    light1.setSpecular3f(1,1,1);
    light1.setPosition3f(1,1,1);

    var light2 = this._light2 = new Foam.Light(fgl.LIGHT_2);
    light2.setAmbient3f(0.8,0.8,0.8);
    light2.setDiffuse3f(0.8,0.8,0.8);
    light2.setSpecular3f(1,1,1);
    light2.setPosition3f(1,1,1);

    var material = this._material0 = new Foam.Material();
    material.setDiffuse3f(0.75,0.75,0.75);
    material.setAmbient3f(0.75,0.75,0.75);
    material.setSpecular3f(1,1,1);
    material.shininess = 200.0;

    this._zoom = 8;

    var size = 35;
    var i, j,k;
    var ni,nj,nk;
    var s = 40;


    fgl.beginDrawElementArrayBatch();

    i=-1;
    while(++i < size)
    {
        ni = (-0.5 + i / (size-1)) * s;

        j = -1;
        while(++j < size)
        {
            nj =  (-0.5 + j / (size-1)) * s;
            k = -1;
            while(++k < size)
            {
                nk = (-0.5 + k / (size-1)) * s;

                fgl.pushMatrix();
                fgl.translate3f(ni+Foam.Math.randomFloat(-1,1)*0.5,
                                nj+Foam.Math.randomFloat(-1,1)*0.5,
                                nk+Foam.Math.randomFloat(-1,1)*0.5);
                fgl.rotate3f(Foam.Math.randomFloat(-1,1)*Math.PI,
                             Foam.Math.randomFloat(-1,1)*Math.PI,
                             Foam.Math.randomFloat(-1,1)*Math.PI);

                fgl.scale1f(Foam.Math.randomFloat(0.15,0.3));
                fgl.color3f(ni,nj,nk);
                fgl.cube();
                fgl.popMatrix();

            }
        }
    }


    fgl.endDrawElementArrayBatch();

};

App.prototype.update = function()
{
    var fgl = this.fgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta();
    var zoom = this._zoom = Foam.Math.lerp(this._zoom, 8 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);

    var light0 = this._light0,
        light1 = this._light1,
        light2 = this._light2;

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
        camRotX = 0;

        zoom = Math.abs(Math.sin(time*0.125)*40);

        cam.setPosition3f(Math.cos(camRotX) * zoom,
                         zoom,
                         Math.sin(camRotX) * zoom);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();


    light0.setPosition3f(0,0,0);
    light1.setPosition3f(30*Math.cos(time*Math.PI), 30*Math.sin(time), 30*Math.sin(time+Math.PI));
    light2.setPosition3f(12*Math.cos(time*Math.PI*0.25), Math.cos(time), 12*Math.sin(time+Math.PI*0.25));

    var material = this._material0;
    /*
    light0.constantAttentuation = Math.abs(Math.sin(time*50));
    light1.constantAttentuation = Math.abs(Math.sin(time*50+Math.PI*0.5));
    light2.constantAttentuation = Math.abs(Math.sin(time*50+Math.PI*0.75));
    */
    //this.drawSystem();

    fgl.useLighting(true);
    fgl.light(light0);
    fgl.light(light1);
    fgl.light(light2);

    fgl.useMaterial(true);

    material.setDiffuse3f(0.75,0.75,0.75);
    material.setAmbient3f(0.75,0.75,0.75);
    material.setSpecular3f(1,1,1);


    fgl.drawMode(fgl.TRIANGLES);
    fgl.material(material);
    fgl.pushMatrix();
    fgl.cube(80);
    fgl.rotate3f(0,time*0.125,0);

    var r = 0.75 + Math.abs(Math.sin(time)*Math.PI) * 0.25,
        g = 0.25,
        b = 0.25;

    material.setDiffuse3f(r,g,b);
    material.setAmbient3f(r,g,b);
    material.setSpecular3f(1,1,1);

    fgl.material(material);

    fgl.drawElementArrayBatch();
    fgl.popMatrix();

    fgl.useLighting(false);
    fgl.useMaterial(false);
};

App.prototype.drawSystem =  function()
{
    var fgl = this.fgl;

    fgl.color1f(0.25);
    Foam.fGLUtil.drawGrid(fgl,48,1);
    fgl.color1f(0.15);
    Foam.fGLUtil.drawGridCube(fgl,48,1);
    Foam.fGLUtil.drawAxes(fgl,12);
};

var app = new App();
