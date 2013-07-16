function TestApp(div)
{
    GLKit.Application.apply(this,arguments);

    this.setSize(window.innerWidth,window.innerHeight);
    this.setTargetFPS(60);

    var light0 = this._light0 = new GLKit.Light(this.gl.LIGHT_0);
        light0.setAmbient3f(0,0,0);
        light0.setDiffuse3f(0.8,0.8,0.8);
        light0.setSpecular3f(1,1,1);


    var light1 = this._light1 = new GLKit.Light(this.gl.LIGHT_1);
        light1.setAmbient3f(0,0,0);
        light1.setDiffuse3f(0.8,0.8,0.8);
        light1.setSpecular3f(1,1,1);

    this._material = new GLKit.Material();

}

TestApp.prototype = Object.create(GLKit.Application.prototype);

TestApp.prototype.onWindowResize = function(){this.setSize(window.innerWidth,window.innerHeight);};

TestApp.prototype.update = function()
{

    var gl     = this.gl,
        cam    = this.camera,
        light0 = this._light0,
        light1 = this._light1;

    var time   = this.getSecondsElapsed(),
        timePI = time * Math.PI,
        PI     = Math.PI;

    gl.clear3f(0.1,0.1,0.1);
    gl.loadIdentity();

    gl.drawMode(gl.LINES);

    var zoom = 3 + this.getMouseWheelDelta() * 0.1;

    var rotX;

    if(this.isMouseDown())
    {
        rotX = (-1 + this.mouse.getX() / this.glWindow.getWidth() * 2) * PI;
        var rotY = (-1 + this.mouse.getY() / this.glWindow.getHeight()* 2) * PI * 0.5;

        cam.setPosition3f(Math.cos(rotX) * zoom,
                          Math.sin(rotY) * zoom,
                          Math.sin(rotX) * zoom);
    }
    else
    {
        rotX = time * 0.25;

        cam.setPosition3f(Math.cos(rotX) * zoom,
                          zoom,
                          Math.sin(rotX) * zoom);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();

    light0.setPosition3f(Math.cos(rotX)*2 ,0.5,Math.sin(rotX)*2);
    light1.setPosition3f(0,Math.sin(time*0.25)*4,0);

    //light1.setAmbient3f(Math.abs(Math.sin(time)),Math.abs(Math.sin(time*0.5)),Math.abs(Math.sin(time*0.25)));

    var material = this._material;

    gl.color3f(0.25,0.25,0.25);
    GLKit.GLUtil.drawGridCube(gl,8,1);

    gl.color3f(0.25,0.25,0.25);
    gl.pushMatrix();
        gl.translate3f(0,-0.01,0);
        GLKit.GLUtil.drawGrid(gl,8,1);
    gl.popMatrix();

    GLKit.GLUtil.drawAxes(gl,4);

    var x,y;

    gl.color3f(1,1,1);

    var a = 100;
    var length = Math.PI / a;

    var i = -1;
    while(++i < a)
    {
        gl.color1f(1.0-i/a);
        gl.linef(Math.cos(time-i*length)*2,Math.sin((time-i*length)*2),Math.sin(time-i*length)*2,
                 Math.cos(time-i*length-length)*2,Math.sin((time-i*length-length)*2),Math.sin(time-i*length-length)*2);
    }


    gl.useLighting(true);



    gl.light(light0);
    gl.light(light1);

    gl.drawMode(gl.TRIANGLE_STRIP);



    gl.pushMatrix();
    gl.translate(light0.position);
    GLKit.GLUtil.octahedron(gl,0.075);
    gl.popMatrix();

    gl.pushMatrix();
    gl.translate(light1.position);
    GLKit.GLUtil.octahedron(gl,0.075);
    gl.popMatrix();





    gl.useMaterial(true);

    material.setDiffuse3f(0.1,0.1,0.1);
    material.setAmbient3f(0.3,0.3,0.3);
    material.setSpecular3f(0,0,0);
    material.shininess = 200.0;

    gl.material(material);

    gl.color3f(1,1,1);
    gl.drawMode(gl.TRIANGLES);
    gl.cube(8);

    material.setDiffuse3f(0.0,0.0,0.0);
    material.setAmbient3f(0.0,0.0,0.0);
    material.setSpecular3f(0,0,0);

    i = -1;
    var j;
    while(++i < 4)
    {
        j = -1;
        while(++j < 4)
        {
            gl.pushMatrix();
            gl.translate3f(0.5 + i,0.5 + Math.sin(time*2 + i*j)*0.25,0.5 + j);
            gl.rotate3f(time*i,time,time*j);
            gl.cube(0.25 + i*j*0.025);
            gl.popMatrix();
        }
    }



    gl.useMaterial(false);



    gl.color3f(1,1,1);
        gl.pushMatrix();
        gl.translate3f(-0.5,0.5,-0.5);
        gl.cube(0.5);
    gl.popMatrix();


    gl.color3f(1,1,1);
    gl.pushMatrix();
    gl.translate3f(Math.cos(time)*2,Math.sin(time * 2),Math.sin(time)*2);
    gl.cube(0.025);
    gl.popMatrix();






    gl.useMaterial(true);

    //gl.color3f(Math.abs(Math.sin(timePI)),Math.abs(Math.cos(timePI)),1);


        material.setDiffuse3f(Math.abs(Math.sin(timePI)),
                              Math.abs(Math.sin(timePI*0.5)),
                              Math.abs(Math.sin(timePI*0.25)));
        material.shininess =  50+ Math.abs(Math.sin(timePI)*150);


    gl.material(this._material);

        gl.pushMatrix();
        gl.translate3f(-1.5,0.5,-1.5);
        gl.cube(1);
    gl.popMatrix();



    gl.useMaterial(false);

    gl.useLighting(false);

    gl.color3f(1,1,1);
    gl.drawMode(gl.LINE_STRIP);
    gl.pushMatrix();
        gl.translate3f(0.5,0.5,-0.5);
        gl.cube(0.5);
    gl.popMatrix();

    gl.color3f(0.05,0.05,0.05);
    gl.drawMode(gl.LINE_STRIP);
    gl.pushMatrix();
        gl.translate3f(-0.5,0.5,0.5);
        gl.rotate3f(time,time,time);
        gl.cube(0.5);
    gl.popMatrix();


};

