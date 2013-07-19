function TestApp(div)
{
    GLKit.Application.apply(this,arguments);

    this.setSize(window.innerWidth,window.innerHeight);
    this.setTargetFPS(40);

    this._zoom = 3;

    var light0 = this._light0 = new GLKit.Light(this.gl.LIGHT_0);
        light0.setAmbient3f(0,0,0);
        light0.setDiffuse3f(0.8,0.8,0.8);
        light0.setSpecular3f(1,1,1);


    var light1 = this._light1 = new GLKit.Light(this.gl.LIGHT_1);
        light1.setAmbient3f(0,0,0);
        light1.setDiffuse3f(0.8,0.8,0.8);
        light1.setSpecular3f(1,1,1);

    this._material = new GLKit.Material();

    var surface = this._surface = new GLKit.ParametricSurface(50);
        surface.setFunctions('Math.cos(u)*Math.cos(v)*Math.sin(v*t)','Math.sin(u)','Math.cos(u)*Math.sin(v)*Math.sin(v*t)',[-Math.PI,Math.PI],[0,2*Math.PI]);
    console.log(surface.funcX);

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

    var timeDelta = this.getTimeDelta();

    var zoom = this._zoom = GLKit.Math.lerp(this._zoom,3 + this.getMouseWheelDelta() * 0.25,timeDelta * 0.025);

    gl.clear3f(0.1,0.1,0.1);
    gl.loadIdentity();

    gl.drawMode(gl.LINES);


    var rotX;

    if(this.isMouseDown())
    {
        rotX = (-1 + this.mouse.getX() / this.glWindow.getWidth() * 2) * PI;
        var rotY = (-1 + this.mouse.getY() / this.glWindow.getHeight()* 2) * PI * 0.5;

        GLKit.Vec3.lerp(cam.position,
                        GLKit.Vec3.make(Math.cos(rotX) * zoom,
                                        Math.sin(rotY) * zoom,
                                        Math.sin(rotX) * zoom),
                                        timeDelta*0.025);
    }
    else
    {
        rotX = time;

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



    gl.useLighting(true);



    gl.light(light0);
    gl.light(light1);


    var surface = this._surface;

    gl.drawMode(gl.TRIANGLES);
    gl.fillColorBuffer(gl.getColorBuffer(),surface.colors);
    surface.applyFunctionsWithTime(time);
    surface.updateVertexNormals();
    gl.drawGeometry(surface);

    gl.useLighting(false);

    gl.drawMode(gl.LINE_STRIP);
    gl.fillColorBuffer(gl.getColorBuffer(),surface.colors);
    //gl.drawGeometry(surface);

    gl.useLighting(true);
    gl.drawMode(gl.TRIANGLES);
    var a = 300;
    var length = Math.PI / a;

    var temp0,temp1,temp2;

    var i = -1;
    while(++i < a)
    {
        gl.color3f(1.0,1.0,1.0-i/a);

        temp0 = time - i * length * PI;
        temp1 = temp0 - length;
        temp2 = Math.abs(Math.sin(time*i*0.25))*2;

        gl.pushMatrix();
        gl.translate3f(Math.cos(temp0*3*Math.sin(time*0.025))*(2+temp2),Math.sin(temp0*2),Math.sin(temp0*3*Math.sin(time*0.025))*(2+temp2));
        gl.box(Math.abs(Math.sin(temp0*2)*0.1),Math.abs(GLKit.Math.sgn(Math.sin(temp0*10)))*0.25,Math.abs(Math.sin(temp0*2)*0.1));
        gl.popMatrix();

        /*
        gl.linef(Math.cos(temp0)*2 + Math.cos(temp2)*0.25, Math.sin(temp0*2) + Math.sin(temp2)*0.25, Math.sin(temp0)*2,
                 Math.cos(temp1)*2 + Math.cos(time*PI)*0.25, Math.sin(temp1*2) + Math.sin(time*PI)*0.25, Math.sin(temp1)*2);
                 */
    }


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


    gl.useLighting(false);

    /*
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
    */




};

