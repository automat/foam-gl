(function()
{
    /*---------------------------------------------------------------------------------------------------------*/

    function TestApp(element)
    {
        GLKit.Application.apply(this,arguments);

        this.setSize(window.innerWidth,window.innerHeight);
        this.setTargetFPS(60);

        this._zoom = 10;

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
            light1 = this._light1;

        var zoom = this._zoom = GLKit.Math.lerp(this._zoom, 10 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


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
            cam.setPosition(light1.position);
        }
        else
        {
            camRotX = time * 0.25;



            cam.setPosition3f(Math.cos(camRotX) * zoom,
                              zoom,
                              Math.sin(camRotX) * zoom);

        }
        cam.setTarget3f(0,0,0);

        cam.updateMatrices();

        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/

        var glMath = GLKit.Math;

        var material = this._material0;




        //GLKit.GLUtil.drawVector(gl,light0.position,GLKit.Vec3.added(light0.position,light0TargetPos));
        var lightTargetPos = GLKit.Vec3.make(Math.sin(time*0.25)*8 + 0.5,Math.sin(time*0.05),0.5);
        light0.setPosition(lightTargetPos);


        lightTargetPos[0] = Math.cos(time*0.75)*8;
        lightTargetPos[1] = 1;
        lightTargetPos[2] = Math.sin(time*0.75)*8;

        light1.setPosition(lightTargetPos);
        light1.constantAttentuation = Math.abs(Math.sin(time*10));






        gl.useLighting(true);
        gl.light(light0);
        gl.light(light1);

        gl.useMaterial(true);
        gl.drawMode(gl.TRIANGLES);


        var len = 28;
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
                gl.material(material);
                gl.drawMode(gl.TRIANGLES);

                il -= 0.5;
                jl -= 0.5;

                gl.pushMatrix();
                gl.translate3f(jl * len,0,il * len);

                gl.cube(0.9);
                gl.popMatrix();
            }
        }




        gl.useMaterial(false);
        gl.useLighting(false);

        gl.drawMode(gl.LINES);
        gl.color1f(1.0);

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

            gl.linef(x0,light1.position[1],y0,x1,light1.position[1],y1);

        }



        //STUFF goes here



        /*---------------------------------------------------------------------------------------------------------*/
    };

    /*---------------------------------------------------------------------------------------------------------*/

    TestApp.prototype.drawSystem = function()
    {
        var gl = this.gl;

        gl.color1f(0.15);
        GLKit.GLUtil.drawGridCube(gl,26,1);

        gl.color1f(0.25);
        gl.pushMatrix();
        {
            gl.translate3f(0,-0.01,0);
            //GLKit.GLUtil.drawGrid(gl,26,1);
        }
        gl.popMatrix();

        gl.drawMode(gl.TRIANGLES);
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
    };

    /*---------------------------------------------------------------------------------------------------------*/

    window.addEventListener('load',function()
    {
        var app = new TestApp(document.getElementById('canvasGLContainer'));
    });

    /*---------------------------------------------------------------------------------------------------------*/
})();