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
    var fgl = this.fgl;

    var light0 = this._light0 = new Foam.Light(fgl.LIGHT_0);
    light0.setAmbient3f(0,0,0);
    light0.setDiffuse3f(0.25,0.8,0.25);
    light0.setSpecular3f(1,1,1);
    light0.setPosition3f(1,1,1);

    var light1 = this._light1 = new Foam.Light(fgl.LIGHT_1);
    light1.setAmbient3f(0,0,0);
    light1.setDiffuse3f(0.25,0.25,0.8);
    light1.setSpecular3f(1,1,1);
    light1.setPosition3f(1,1,1);

    var light2 = this._light2 = new Foam.Light(fgl.LIGHT_2);
    light2.setAmbient3f(0,0,0);
    light2.setDiffuse3f(0.8,0.25,0.25);
    light2.setSpecular3f(1,1,1);
    light2.setPosition3f(1,1,1);

    var material = this._material0 = new Foam.Material();
    material.setDiffuse3f(0.25,0.25,0.25);
    material.setAmbient3f(0.8,0.8,0.8);
    material.setSpecular3f(1,1,1);
    material.shininess = 200.0;

    var size = this._cubeNumAxis = 14;
    var i, j,k;
    var ni,nj,nk;
    var s = 40;

    fgl.sphereDetail(13);
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
                fgl.translate3f(ni,nj,nk);
                fgl.scale1f(0.5);
                fgl.color3f(ni,nj,nk);
                //fgl.cube();
                fgl.sphere() ;
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
        timeDelta = this.getTimeDelta(),
        zoom = 10 + Math.sin(time) * 0.25;

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
        camRotX = time * 0.25;

        cam.setPosition3f(Math.cos(camRotX) * zoom,
            zoom,
            Math.sin(camRotX) * zoom);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    light0.setPosition3f(6*Math.cos(time), 0, 6*Math.sin(time));
    light1.setPosition3f(2*Math.cos(time*Math.PI), Math.sin(time), 2*Math.sin(time+Math.PI));
    light2.setPosition3f(12*Math.cos(time*Math.PI*0.25), Math.cos(time), 12*Math.sin(time+Math.PI*0.25));

    var material = this._material0;

    this.drawSystem();

    fgl.useLighting(true);
    fgl.light(light0);
    fgl.light(light1);
    fgl.light(light2);

    fgl.useMaterial(true);

    fgl.drawMode(fgl.TRIANGLES);
    fgl.material(material);
    fgl.pushMatrix();
   // fgl.rotate3f(time,time,time)
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
