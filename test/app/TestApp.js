function TestApp(div)
{
    GLKit.Application.apply(this,arguments);

    this.setSize(window.innerWidth,window.innerHeight);
    this.setTargetFPS(60);


}

TestApp.prototype = Object.create(GLKit.Application.prototype);

TestApp.prototype.onWindowResize = function(){this.setSize(window.innerWidth,window.innerHeight);};

TestApp.prototype.update = function()
{

    var gl   = this.gl,
        cam  = this.camera;
    var time = this.getSecondsElapsed();

    gl.clear3f(0.1,0.1,0.1);
    gl.loadIdentity();

    gl.setDrawMode(gl.LINES);

    var zoom = 3 + this.getMouseWheelDelta() * 0.1;

    //console.log(45 + Math.abs(Math.sin(time * Math.PI))*45);



    cam.setPosition3f(Math.cos(time) * zoom,zoom ,Math.sin(time) * zoom);
    cam.setTarget3f(0,0,0);

    cam.updateMatrices();



    gl.color3f(0.25,0.25,0.25);
    gl.pushMatrix();
    gl.translate3f(0,-0.01,0);
    GLKit.GLUtil.drawGrid(gl,10);
    gl.popMatrix();

    gl.color3f(0.2,0.2,0.2);

    GLKit.GLUtil.drawGridCube(gl,4,2.5);

    GLKit.GLUtil.drawAxes(gl,5);




    gl.color4f(1,1,1,1);
    gl.setDrawMode(gl.LINE_LOOP);
    gl.trianglef(0,0,0,1,0,0,0.5,0,1);









};

