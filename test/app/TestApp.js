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

    var surface = this._surface = new GLKit.ParametricSurface(50,8);
        surface.setFunctions('u','Math.sin(u*2+t*5)*Math.cos(v*2+t*10)*0.5','v',[-1,1],[-1,1]);


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
        rotX = time*0.25;

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
    gl.drawMode(gl.LINE_LOOP);

    gl.pushMatrix();
    gl.translate(light0.position);
    GLKit.GLUtil.octahedron(gl,0.075);
    gl.popMatrix();

    gl.pushMatrix();
    gl.translate(light1.position);
    GLKit.GLUtil.octahedron(gl,0.075);
    gl.popMatrix();


    gl.useLighting(true);

    gl.light(light0);
    gl.light(light1);

    gl.useMaterial(true);

    material.setDiffuse3f(0.1,0.1,0.1);
    material.setAmbient3f(0.3,0.3,0.3);
    material.setSpecular3f(0,0,0);
    material.shininess = 200.0;

    gl.material(material);

    gl.color3f(1,1,1);
    gl.drawMode(gl.TRIANGLES);
    gl.cube(8);

    material.setDiffuse3f(0.7,0.7,0.7);
    material.setAmbient3f(0.7,0.7,0.7);
    material.setSpecular3f(1,1,1);
    material.shininess = 20.0;

    gl.material(material);

    gl.pushMatrix();
    gl.translate3f(0,0.5,0);
    gl.rotate3f(time,time,time);
    gl.cube(0.5);
    gl.popMatrix();

    var surface = this._surface;


    surface.applyFunctionsWithTime(time);
    surface.updateVertexNormals();

    material.setDiffuse3f(0.01,0.01,0.01);
    material.setAmbient3f(0.01,0.01,0.01);
    material.setSpecular3f(0.1,0.1,0.1);
    material.shininess = 200.0;



    gl.pushMatrix();
    gl.translate3f(0,-0.5,0);
    gl.useMaterial(false);
    //gl.color3f(0.45,0.45,0.45);
    gl.fillColorBuffer(gl.getColorBuffer(),surface.colors);
    gl.drawMode(gl.LINES);
    gl.drawGeometry(surface);
    gl.useMaterial(true);
    gl.material(material);
    gl.translate3f(0,-3,0);
    gl.drawMode(gl.TRIANGLES);
    gl.drawGeometry(surface);

    gl.useMaterial(false);

    //gl.drawMode(gl.LINE_LOOP);
    //gl.drawGeometry(surface);
    gl.popMatrix();

    material.setDiffuse3f(0.0,0.0,0.0);
    material.setAmbient3f(0.0,0.0,0.0);
    material.setSpecular3f(0,0,0);


    gl.useLighting(false);





};

