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

        var light1 = this._light1 = new GLKit.Light(this.gl.LIGHT_1);
            light1.setAmbient3f(0,0,0);
            light1.setDiffuse3f(0.8,0.8,0.8);
            light1.setSpecular3f(1,1,1);
            light1.setPosition3f(1,1,1);

        var light2 = this._light2 = new GLKit.Light(this.gl.LIGHT_2);
            light2.setAmbient3f(0,0,0);
            light2.setDiffuse3f(0.8,0.8,0.8);
            light2.setSpecular3f(1,1,1);
            light2.setPosition3f(1,1,1);

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

        var light0 = this._light0,
            light1 = this._light1,
            light2 = this._light2;

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
        else if(this.isKeyDown())
        {


            cam.setPosition3f(light1.position[0] * zoom,light1.position[1] * zoom,light1.position[2] * zoom);

        }
        else
        {
            camRotX = time * 0.25;

            cam.setPosition3f(Math.cos(camRotX) * zoom,
                              zoom,
                              Math.sin(camRotX) * zoom);

        }


        light0.setPosition3f(2*Math.cos(time), 0, 2*Math.sin(time));
        light1.setPosition3f(2*Math.cos(time*Math.PI), Math.sin(time), 2*Math.sin(time+Math.PI));
        light2.setPosition3f(4*Math.cos(time*Math.PI*0.25), Math.cos(time), 4*Math.sin(time+Math.PI*0.25));

        cam.setTarget3f(0,0,0);
        cam.updateMatrices();

        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/

        var material = this._material0;

        gl.useLighting(true);
        gl.light(light0);
        gl.light(light1);
        gl.light(light2);

        gl.useMaterial(true);



        material.setDiffuse3f(0.025,0.025,0.025);
        material.setAmbient3f(0.1,0.1,0.1);
        material.setSpecular3f(0,0,0);
        material.shininess = 200.0;

        gl.material(material);

        gl.material(material);
        gl.color3f(1,1,1);
        gl.drawMode(gl.TRIANGLES);
        gl.cube(70);

        gl.sphereDetail(20);

        var iN,jN,kN,
            iP,jP,kP;


        var len      = 9,
            minScale = 2,
            scaleijk,
            scaleijkpos,
            scaleijkobj;

        var pi_3 = Math.PI / 3;

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

                    iP = -0.5 + iN;
                    kP = -0.5 + kN;
                    jP = -0.5 + jN;

                    scaleijk    = minScale + Math.sin((iN * pi_3 + kN * pi_3 + jN * pi_3)*2 + time * 5);
                    scaleijkpos = scaleijk * (1 + Math.abs(Math.sin(time)));
                    scaleijkobj = scaleijk * 0.075;

                    material.setAmbient3f(iN,kN,jN);
                    material.setDiffuse3f(iN,kN,jN);
                    //material.shininess = 20 + iN * kN * jN * 1000;

                    gl.material(material);
                    gl.pushMatrix();
                    gl.translate3f(iP * scaleijkpos, kP * scaleijkpos, jP * scaleijkpos);
                    gl.scale3f(scaleijkobj,scaleijkobj,scaleijkobj);
                    gl.drawMode(gl.TRIANGLES);
                    gl.color4f(1,1,1,1);
                    gl.sphere();
                    gl.popMatrix();
                }
            }
        }

        gl.useLighting(false);


        /*---------------------------------------------------------------------------------------------------------*/
    };

    /*---------------------------------------------------------------------------------------------------------*/

    TestApp.prototype.drawSystem = function()
    {
        var gl = this.gl;

        gl.color1f(0.15);
        GLKit.GLUtil.drawGridCube(gl,70,1);

        gl.color1f(0.075);
        gl.pushMatrix();
        {
            gl.translate3f(0,-0.01,0);
            GLKit.GLUtil.drawGrid(gl,70,1);
        }
        gl.popMatrix();

        GLKit.GLUtil.drawAxes(gl,20);

        gl.color1f(1);

        gl.pushMatrix();
        {
            gl.translate(this._light0.position);
            GLKit.GLUtil.octahedron(gl,0.075);
        }
        gl.popMatrix();

        gl.pushMatrix();
        {
            gl.translate(this._light1.position);
            GLKit.GLUtil.octahedron(gl,0.075);
        }
        gl.popMatrix();

        gl.pushMatrix();
        {
            gl.translate(this._light2.position);
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