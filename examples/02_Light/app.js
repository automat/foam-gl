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

    var material = this._material0 = new Foam.Material();
        material.setDiffuse3f(0.7,0.7,0.7);
        material.setAmbient3f(0.7,0.7,0.7);
        material.setSpecular3f(1,1,1);
        material.shininess = 20.0;


};

App.prototype.update = function()
{
    var kgl = this.fgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        zoom = 3 + Math.sin(time) * 0.25;

    kgl.clear3f(0.1,0.1,0.1);
    kgl.loadIdentity();

    cam.setPosition3f(Math.cos(time)*Math.PI*zoom,zoom,Math.sin(time)*Math.PI*zoom);
    cam.updateMatrices();

    kgl.drawMode(kgl.LINE_LOOP);
    this.drawSystem();

    var glMath = Foam.Math;

    var material = this._material0;


    var light0 = this._light0,
        light1 = this._light1;


    //Foam.GLUtil.drawVector(gl,light0.position,Foam.Vec3.added(light0.position,light0TargetPos));
    var lightTargetPos = Foam.Vec3.make(Math.sin(time*0.25)*8 + 0.5,Math.sin(time*0.05),0.5);
    light0.setPosition(lightTargetPos);


    lightTargetPos[0] = Math.cos(time*0.75)*8;
    lightTargetPos[1] = 1;
    lightTargetPos[2] = Math.sin(time*0.75)*8;

    light1.setPosition(lightTargetPos);
    light1.constantAttentuation = Math.abs(Math.sin(time*10));

    kgl.useLighting(true);
    kgl.light(light0);
    kgl.light(light1);

    kgl.useMaterial(true);
    kgl.drawMode(kgl.TRIANGLES);


    var len = 100;
    var i = -1,j;

    var il,jl;

    var d;

    while(++i <= len)
    {
        j = -1;
        while(++j <=  len)
        {
            il = i / len;
            jl = j / len;

            material.setAmbient3f(il,0,jl);
            material.setDiffuse3f(il,0,jl);
            kgl.material(material);
            kgl.drawMode(kgl.TRIANGLES);

            il -= 0.5;
            jl -= 0.5;

            kgl.pushMatrix();
            kgl.translate3f(jl * len,0,il * len);

            kgl.cube(0.9);
            kgl.popMatrix();
        }
    }




    kgl.useMaterial(false);
    kgl.useLighting(false);

    kgl.drawMode(kgl.LINES);
    kgl.color1f(1.0);

    len = 100;
    i = -1;

    var temp0,temp1;
    var x0,y0,x1,y1;

    while(++i < len)
    {

        temp0 = time * 0.75 - Math.PI*0.75 / len - i/len * Math.PI * 0.75;

        x0 = Math.cos(temp0) * 8;
        y0 = Math.sin(temp0) * 8;

        temp1 = temp0 + 0.01;//+ Math.PI * 0.5 / len;

        x1 = Math.cos(temp1) * 8;
        y1 = Math.sin(temp1) * 8;

        kgl.linef(x0,light1.position[1],y0,x1,light1.position[1],y1);

    }
};

App.prototype.drawSystem =  function()
{
    var kgl = this.fgl;

    kgl.color1f(0.25);
    Foam.fGLUtil.drawGrid(kgl,8,1);
    Foam.fGLUtil.drawGridCube(kgl,8,1);
    Foam.fGLUtil.drawAxes(kgl,4);

    //fgl.drawMode(fgl.TRIANGLES);
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
};

var app = new App();
