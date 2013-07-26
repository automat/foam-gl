(function()
{
    /*---------------------------------------------------------------------------------------------------------*/

    function TestApp(element)
    {
        GLKit.Application.apply(this,arguments);

        this.setSize(window.innerWidth,window.innerHeight);
        this.setTargetFPS(60);

        this._zoom = 3;

        var light0 = this._light0 = new GLKit.Light(this.gl.LIGHT_0);
            light0.setAmbient3f(0,0,0);
            light0.setDiffuse3f(0.8,0.8,0.8);
            light0.setSpecular3f(1,1,1);
            light0.setPosition3f(1,1,1);

        var material = this._material0 = new GLKit.Material();
            material.setDiffuse3f(0.7,0.7,0.7);
            material.setAmbient3f(0.7,0.7,0.7);
            material.setSpecular3f(1,1,1);
            material.shininess = 20.0;

    }

    TestApp.prototype = Object.create(GLKit.Application.prototype);

    TestApp.prototype.onWindowResize = function(){this.setSize(window.innerWidth,window.innerHeight);};

    TestApp.prototype.update = function()
    {
        var gl        = this.gl,
            cam       = this.camera,
            time      = this.getSecondsElapsed(),
            timeDelta = this.getTimeDelta();

        var light0 = this._light0;

        var zoom = this._zoom = GLKit.Math.lerp(this._zoom, 3 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


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
            camRotX = time * 0.25;

            cam.setPosition3f(Math.cos(camRotX) * zoom,
                              zoom,
                              Math.sin(camRotX) * zoom);

        }

        light0.setPosition3f(2*Math.cos(time), 0, 2*Math.sin(time));

        cam.setTarget3f(0,0,0);
        cam.updateMatrices();

        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/

        var material = this._material0;

        gl.useLighting(true);
        gl.light(this._light0);

        gl.useMaterial(true);
        gl.material(this._material0);

        gl.sphereDetail(20);

        var iN,jN,kN;

        var len    = 9,
            scale  = 2,
            scaleijk;

        var i = -1, j,k;
        while(++i < len)
        {
            j = -1;
            while(++j < len)
            {
                k = -1;
                while(++k < len)
                {

                    iN = i / len;
                    jN = j / len;
                    kN = k / len;

                    scaleijk = scale + Math.sin((iN * Math.PI/3 + kN * Math.PI/3 + jN * Math.PI/3)*2 + time * 5);

                    material.setAmbient3f(iN,kN,jN);
                    material.setDiffuse3f(iN,kN,jN);
                   // material.shininess = 20 + iN * kN * jN * 1000;

                    gl.material(material);
                    gl.pushMatrix();
                    gl.translate3f((-0.5 + iN) * scaleijk, (-0.5 + kN) * scaleijk, (-0.5 + jN) * scaleijk);
                    gl.scale3f(0.075*scaleijk,0.075*scaleijk,0.075*scaleijk);
                    gl.drawMode(gl.TRIANGLES);
                    gl.color4f(1,1,1,1);
                    gl.sphere();
                    gl.popMatrix();

                }


            }
        }

        gl.useLighting(false);


        //STUFF goes here



        /*---------------------------------------------------------------------------------------------------------*/
    };

    /*---------------------------------------------------------------------------------------------------------*/

    TestApp.prototype.drawSystem = function()
    {
        var gl = this.gl;

        gl.color1f(0.15);
        GLKit.GLUtil.drawGridCube(gl,8,1);

        gl.color1f(0.25);
        gl.pushMatrix();
        {
            gl.translate3f(0,-0.01,0);
            GLKit.GLUtil.drawGrid(gl,8,1);
        }
        gl.popMatrix();

        GLKit.GLUtil.drawAxes(gl,4);

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
        var app = new TestApp(document.getElementById('canvasGLContainer'));
    });

    /*---------------------------------------------------------------------------------------------------------*/
})();