(function()
{
    /*---------------------------------------------------------------------------------------------------------*/

    function App(element)
    {
        GLKit.Application.apply(this,arguments);

        this._zoom = 1;

        var light0 = this._light0 = new GLKit.Light(this.gl.LIGHT_0);
            light0.setAmbient3f(0,0,0);
            light0.setDiffuse3f(0.8,0.8,0.8);
            light0.setSpecular3f(1,1,1);
            light0.setPosition3f(1,1,1);

        var material = this._material0 = new GLKit.Material();
            material.setDiffuse3f(0.7,0.1,0.2);
            material.setAmbient3f(0.7,0.1,0.7);
            material.setSpecular3f(1,1,1);
            material.shininess = 100.0;


        var splineNumPoints = 100;
        var splinePoints = new Array(splineNumPoints * 3);
        var i = -1,n;
        while(++i < splineNumPoints)
        {
            n = i / (splineNumPoints - 1);
            splinePoints[i * 3    ] = Math.cos(Math.PI * n * 10);//(-0.5 +n) * 4;//Math.cos(Math.PI * n * 10);
            splinePoints[i * 3 + 1] = (-0.5 + n) * 4;//0;//(-0.5 + n) * 4;
            splinePoints[i * 3 + 2] = Math.sin(Math.PI * n * 10);//0;//Math.sin(Math.PI * n * 10);
        }
        var spline = this._spline = new GLKit.Spline();
            spline.setDetail(4);
            spline.setPoints(splinePoints);
            spline.update();

        var numBufferPoints = 32;
        var lineBuffer = this._lineBuffer0 = new GLKit.LineBuffer3d(new Array(numBufferPoints * 3),16,0.35,null,true);

        this.setSize(window.innerWidth,window.innerHeight);
        this.setTargetFPS(60);


    }

    App.prototype = Object.create(GLKit.Application.prototype);

    App.prototype.onWindowResize = function(){this.setSize(window.innerWidth,window.innerHeight);};

    App.prototype.update = function()
    {
        var gl        = this.gl,
            cam       = this.camera,
            time      = this.getSecondsElapsed(),
            timeDelta = this.getTimeDelta();

        var light0 = this._light0;

        var zoom = this._zoom = GLKit.Math.lerp(this._zoom, 1 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


        gl.clear3f(0.1,0.1,0.1);
        gl.loadIdentity();

        gl.drawMode(gl.LINES);

        var camRotX,camRotY;

        if(this.isMouseDown())
        {
            camRotX = ( -1 + this.mouse.getX() / this.glWindow.getWidth() * 2.0 ) * Math.PI;
            camRotY = ( -1 + this.mouse.getY() / this.glWindow.getHeight() * 2.0) * Math.PI * 0.5;

            GLKit.Vec3.lerp3f(cam.position,
                              Math.cos(camRotX) * zoom,
                              Math.sin(camRotY) * zoom,
                              Math.sin(camRotX) * zoom,
                              timeDelta * 0.25);
        }
        else
        {

            cam.setPosition3f(4 * zoom,
                              0,
                              0);

        }

        cam.setTarget3f(0,0,0);
        cam.updateMatrices();

        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/


        var spline          = this._spline,
            splineNumPoints = spline.getNumPoints(),
            splinePoints    = spline.points;



        gl.color1f(1);
        gl.drawMode(gl.LINE_STRIP);
        gl.pointSize(1);

        gl.linev(spline.vertices);
        gl.color3f(1,1,1);
        gl.drawMode(gl.LINE_STRIP);
        gl.pointSize(3);
        gl.drawMode(gl.POINTS);
        //gl.points(spline.vertices);
        gl.color3f(1,0,1);
        gl.pointSize(10);


        var r;

        var i = -1,n;








        gl.useLighting(true);
        gl.useMaterial(true);

        gl.light(light0);
        gl.material(this._material0);

        var lineBuffer0 = this._lineBuffer0,
            lineBuffer1 = this._lineBuffer1;
        var len        = lineBuffer0.getNumPoints();

        var intrpl;
        var vec = GLKit.Vec3.make();
        var intrplBase,
            intrplScaled;

        var scale = 0.75;

        i = -1;
        while (++i < len)
        {
            n = i / (len - 1);

            scale = 0.75;
            intrplBase   = 0.5;//(0.5 + GLKit.Math.saw(time * 0.15) * 0.5);
            intrplScaled = intrplBase * (1 + scale) - scale;
            intrpl = Math.max(0, Math.min(n * scale + intrplScaled, 1));
            lineBuffer0.setPoint(i, spline.getVec3OnSpline(intrpl, vec));



        }

        lineBuffer0.update();
        lineBuffer0.updateVertexNormals();

        gl.drawGeometry(lineBuffer0);
        //gl.drawGeometry(lineBuffer1);

        gl.useMaterial(false);
        gl.useLighting(false);

        gl.drawMode(gl.POINTS);
        gl.color3f(1,0,1);
        gl.pointSize(2);
        gl.points(lineBuffer0.vertices);

        gl.drawMode(gl.LINES);
       // gl.linev(lineBuffer.vertices);
        gl.drawGeometry(lineBuffer0);








        /*---------------------------------------------------------------------------------------------------------*/
    };

    /*---------------------------------------------------------------------------------------------------------*/

    App.prototype.drawSystem = function()
    {
        var gl = this.gl;

        gl.color1f(0.15);
        GLKit.GLUtil.drawGridCube(gl,8,1);

        gl.color1f(0.25);
        gl.pushMatrix();
        {
            gl.translate3f(0,-0.01,0);
           //GLKit.GLUtil.drawGrid(gl,8,1);
        }
        gl.popMatrix();

        //GLKit.GLUtil.drawAxes(gl,4);

        gl.color1f(1);

        gl.pushMatrix();
        {
            gl.translate(this._light0.position);
            GLKit.GLUtil.octahedron(gl,0.075);
        }
        gl.popMatrix();
    };

    /*---------------------------------------------------------------------------------------------------------*/

    window.addEventListener('load',function()
    {
        var app = new App(document.getElementById('canvasGLContainer'));
    });

    /*---------------------------------------------------------------------------------------------------------*/
})();