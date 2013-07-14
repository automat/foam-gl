function TestApp(div)
{
    GLKit.Application.apply(this,arguments);

    this.setSize(window.innerWidth,window.innerHeight);
    this.setTargetFPS(60);

    var light0 = this._light0 = new GLKit.Light(this.gl.LIGHT_0);
        light0.setAmbient3f(0,0,0);
        light0.setDiffuse3f(0.8,0.8,0.8);
        light0.setSpecular3f(1,1,1);



}

TestApp.prototype = Object.create(GLKit.Application.prototype);

TestApp.prototype.onWindowResize = function(){this.setSize(window.innerWidth,window.innerHeight);};

TestApp.prototype.update = function()
{

    var gl     = this.gl,
        cam    = this.camera,
        light0 = this._light0;

    var time   = this.getSecondsElapsed(),
        timePI = time * Math.PI,
        PI     = Math.PI;

    gl.clear3f(0.1,0.1,0.1);
    gl.loadIdentity();

    gl.drawMode(gl.LINES);

    var zoom = 3 + this.getMouseWheelDelta() * 0.1;


    cam.setPosition3f(Math.cos(time) * zoom,zoom ,Math.sin(time) * zoom);
    cam.setTarget3f(0,0,0);

    cam.updateMatrices();

    light0.position[0] = Math.cos(time)*2;
    light0.position[1] = 0.5;
    light0.position[2] = Math.sin(time)*2;


    gl.color1f(1);
    gl.pushMatrix();
    gl.translate3f(0,0.5,0);
    gl.point(light0.position);
    gl.popMatrix();

    gl.color3f(0.2,0.2,0.2);
    GLKit.GLUtil.drawGridCube(gl,8,1);

    gl.color3f(0.25,0.25,0.25);
    gl.pushMatrix();
    gl.translate3f(0,-0.01,0);
    GLKit.GLUtil.drawGrid(gl,8,1);
    gl.popMatrix();

    GLKit.GLUtil.drawAxes(gl,4);

    gl.lighting(true);
    gl.light(light0);
    gl.color3f(0.5,0.5,0.5);
    gl.drawMode(gl.TRIANGLES);
    gl.pushMatrix();
    gl.translate3f(0.5,0.5,0.5);
    gl.rotate3f(time,time,time);
    gl.cube(0.5);
    gl.popMatrix();

    gl.drawMode(gl.TRIANGLE_FAN);
    gl.pushMatrix();
    gl.translate3f(1,0.5,0);
    gl.rect(0.5,0.5);
    gl.pushMatrix();
    gl.rotateX(PI * 0.5);
    gl.rect(0.5,0.5);
    gl.popMatrix();
    gl.popMatrix();


    gl.lighting(false);

    gl.color3f(1,1,1);
    gl.drawMode(gl.TRIANGLES);
    gl.pushMatrix();
    gl.translate3f(-0.5,0.5,-0.5);
    gl.rotate3f(time,time,time);
    gl.cube(0.5);
    gl.popMatrix();

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

