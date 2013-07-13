function TestApp(div)
{
    GLKit.Application.apply(this,arguments);

    this.setSize(window.innerWidth,window.innerHeight);
    this.setTargetFPS(60);

    this._light0 = new GLKit.Light(this.gl.LIGHT_0);


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


    light0.setPosition3f(Math.cos(timePI)*2,0,Math.sin(timePI)*2);
    gl.color1f(1);
    gl.point(light0.position);


    gl.color3f(0.2,0.2,0.2);
    GLKit.GLUtil.drawGridCube(gl,8,1);

    gl.color3f(0.25,0.25,0.25);
    gl.pushMatrix();
    gl.translate3f(0,-0.01,0);
    GLKit.GLUtil.drawGrid(gl,8,1);
    gl.popMatrix();

    GLKit.GLUtil.drawAxes(gl,4);


    gl.drawMode(gl.LINE_STRIP);

    gl.color4f(1,1,1,1);

    gl.pushMatrix();
    gl.translate3f(0.5,0.5,0.5);
    gl.cube(1);

    gl.popMatrix();
    gl.color3f(Math.abs(Math.sin(timePI)),0,0);
    gl.drawMode(gl.LINE_LOOP);
    gl.pushMatrix();
    gl.translate3f(-0.5,0.5,-0.5);
    //gl.cube(1);
    gl.sphere(1,200);
    gl.popMatrix();

};

