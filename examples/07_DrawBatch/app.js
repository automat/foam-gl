var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setFPS(60);
    this.setWindowSize(800,600);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function()
{
    var kgl = this.fgl;

    var light0 = this._light0 = new Foam.Light(kgl.LIGHT_0);
        light0.setAmbient3f(0,0,0);
        light0.setDiffuse3f(0.8,0.8,0.8);
        light0.setSpecular3f(1,1,1);
        light0.setPosition3f(1,1,1);

    var light1 = this._light1 = new Foam.Light(kgl.LIGHT_1);
        light1.setAmbient3f(0,0,0);
        light1.setDiffuse3f(0.8,0.8,0.8);
        light1.setSpecular3f(1,1,1);
        light1.setPosition3f(1,1,1);

    var light2 = this._light2 = new Foam.Light(kgl.LIGHT_2);
        light2.setAmbient3f(0,0,0);
        light2.setDiffuse3f(0.8,0.8,0.8);
        light2.setSpecular3f(1,1,1);
        light2.setPosition3f(1,1,1);

    var material = this._material0 = new Foam.Material();
        material.setDiffuse3f(0.7,0.7,0.7);
        material.setAmbient3f(0.7,0.7,0.7);
        material.setSpecular3f(1,1,1);
        material.shininess = 20.0;


};

App.prototype.update = function()
{
    var fgl = this.fgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 3 + Math.sin(time) * 0.25;

    fgl.clear3f(0.1,0.1,0.1);
    fgl.loadIdentity();

    var light0 = this._light0,
        light1 = this._light1,
        light2 = this._light2;


    cam.setPosition3f(light1.position[0] * zoom,light1.position[1] * zoom,light1.position[2] * zoom);

    cam.updateMatrices();

    fgl.drawMode(fgl.LINE_LOOP);
   // this.drawSystem();

    var glMath = Foam.Math;

    var material = this._material0;







    light0.setPosition3f(6*Math.cos(time), 0, 6*Math.sin(time));
    light1.setPosition3f(2*Math.cos(time*Math.PI), Math.sin(time), 2*Math.sin(time+Math.PI));
    light2.setPosition3f(4*Math.cos(time*Math.PI*0.25), Math.cos(time), 4*Math.sin(time+Math.PI*0.25));

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    fgl.drawMode(fgl.LINE_LOOP);

    //this.drawSystem();

    /*---------------------------------------------------------------------------------------------------------*/


    var material = this._material0;

    fgl.useLighting(true);
    fgl.light(light0);
    fgl.light(light1);
    fgl.light(light2);

    fgl.useMaterial(true);

    material.setDiffuse3f(0.6,0.6,0.6);
    material.setAmbient3f(0.6,0.6,0.6);
    material.setSpecular3f(1,1,1);
    material.shininess = 200.0;

    fgl.material(material);

    fgl.drawMode(fgl.TRIANGLES);
    fgl.sphereDetail(20);




    //fgl.cube();


    fgl.material(material);
    fgl.color3f(1,1,1);
    fgl.drawMode(fgl.TRIANGLES);
    fgl.cube(70);

    fgl.sphereDetail(10);

    var iN,jN,kN,
        iP,jP,kP;


    var len      = 10,
        minScale = 2,
        scaleijk,
        scaleijkpos,
        scaleijkobj;

    var pi_3 = Math.PI / 3;


    fgl.drawMode(fgl.TRIANGLES);


    fgl.pushMatrix();
    fgl.translate3f(0,2,0);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,-2,0);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(2,0,0);
    fgl.scale1f(0.25);
    fgl.sphere();
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,0,2);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,0,-2);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(-2,0,0);
    fgl.cube(0.25);
    fgl.popMatrix();



    fgl.beginDrawElementArrayBatch();


    fgl.pushMatrix();
    fgl.translate3f(0,2,0);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,-2,0);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(2,0,0);
    fgl.scale1f(0.25);
    //fgl.cube();
    //fgl.sphereDetail(8);
    fgl.sphere();
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,0,2);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0,0,-2);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(-2,0,0);
    fgl.cube(0.25);
    fgl.popMatrix();

    fgl.endDrawElementArrayBatch();


    material.setDiffuse3f(0.8,0.2,0.2);
    material.setAmbient3f(0.8,0.2,0.2);
    material.setSpecular3f(1,1,1);
    material.shininess = 200.0;
    fgl.material(material);

    var i = -1;
    var n;

    //visually nono

    while(++i < 200)
    {
        n = i / 20;
        fgl.pushMatrix();
        fgl.translate3f(Math.cos(n*Math.PI*5),(-0.5 + n) * 5,Math.sin(n*Math.PI*5));
        fgl.drawElementArrayBatch();
        fgl.popMatrix();

    }


    fgl.useLighting(false);


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


    //Foam.fGLUtil.drawAxes(fgl,20);

    kgl.color1f(1);

    kgl.pushMatrix();
    {
        kgl.translate(this._light0.position);
        Foam.fGLUtil.octahedron(kgl,0.075);
    }
    kgl.popMatrix();

    kgl.pushMatrix();
    {
        kgl.translate(this._light1.position);
        Foam.fGLUtil.octahedron(kgl,0.075);
    }
    kgl.popMatrix();

    kgl.pushMatrix();
    {
        kgl.translate(this._light2.position);
        Foam.fGLUtil.octahedron(kgl,0.075);
    }
    kgl.popMatrix();
};

var app = new App();
