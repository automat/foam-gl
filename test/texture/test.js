(function()
{
    var app;

    var texImagesLen    = 2,
        texImagesLoaded = 0;
    var texImage0,
        texImage1;

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

        var light3 = this._light3 = new GLKit.Light(this.gl.LIGHT_3);
            light3.setAmbient3f(0,0,0);
            light3.setDiffuse3f(0.8,0.8,0.8);
            light3.setSpecular3f(1,1,1);
            light3.setPosition3f(1,1,1);

        var light4 = this._light4 = new GLKit.Light(this.gl.LIGHT_4);
            light4.setAmbient3f(0,0,0);
            light4.setDiffuse3f(0.8,0.8,0.8);
            light4.setSpecular3f(1,1,1);
            light4.setPosition3f(1,1,1);

        var material = this._material0 = new GLKit.Material();
            material.setDiffuse3f(0.1,0.1,0.1);
            material.setAmbient3f(1.0,1.0,1.0);
            material.setSpecular3f(1,1,1);
            material.shininess = 20.0;

        this._texture0 = this.gl.loadTextureWithImage(texImage0);
        this._texture1 = this.gl.loadTextureWithImage(texImage1);

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
            light2 = this._light2,
            light3 = this._light3,
            light4 = this._light4;

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

        cam.setTarget3f(0,0,0);
        cam.updateMatrices();

        light0.setPosition3f(Math.cos(time)*Math.sin(time),0.025 + Math.abs(Math.sin(time*8)*Math.sin(time*3))*0.975,Math.sin(time));
        //light0.constantAttentuation = 1.0 - Math.abs(Math.sin(time*0.025))*0.75;

        var lightPosY = 0.0125 + Math.abs(Math.sin(time*4)*Math.sin(time*8))*0.5;

        light1.setPosition3f(0,lightPosY,-2.5);
        light2.setPosition3f(-2.5,lightPosY,0);
        light3.setPosition3f(2.5,lightPosY,0);
        light4.setPosition3f(0,lightPosY,2.5);


        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/


        gl.useLighting(true);
        gl.light(light0);
        gl.light(light1);
        gl.light(light2);

        gl.drawMode(gl.TRIANGLE_FAN);
        gl.useMaterial(true);
        gl.useTexture(true);
        gl.material(this._material0);
        gl.texture(this._texture0);

        gl.pushMatrix();
        gl.translate3f(-1.5,0,-1.5);
        gl.rect(3,3);
        gl.popMatrix();

        gl.texture(this._texture1);


        gl.pushMatrix();
        gl.translate3f(-0.5,0,-3);
        gl.rect(1,1);
        gl.popMatrix();


        gl.useMaterial(false);


        gl.pushMatrix();
        gl.translate3f(-3,0,-0.5);
        gl.rect(1,1);
        gl.popMatrix();

        gl.useLighting(false);


        gl.pushMatrix();
        gl.translate3f(2,0,-0.5);
        gl.rect(1,1);
        gl.popMatrix();


        gl.useTexture(false);

        gl.pushMatrix();
        gl.translate3f(-0.5,0,2);
        gl.rect(1,1);
        gl.popMatrix();

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

        gl.drawMode(gl.TRIANGLES);
        gl.pushMatrix();
        {
            gl.translate(this._light0.position);
            gl.scale3f(0.025,0.025,0.025);
            gl.sphere();
        }
        gl.popMatrix();

        gl.pushMatrix();
        {
            gl.translate(this._light1.position);
            gl.scale3f(0.025,0.025,0.025);
            gl.sphere();
        }
        gl.popMatrix();

        gl.pushMatrix();
        {
            gl.translate(this._light2.position);
            gl.scale3f(0.025,0.025,0.025);
            gl.sphere();
        }
        gl.popMatrix();

        gl.pushMatrix();
        {
            gl.translate(this._light3.position);
            gl.scale3f(0.025,0.025,0.025);
            gl.sphere();
        }
        gl.popMatrix();

        gl.pushMatrix();
        {
            gl.translate(this._light4.position);
            gl.scale3f(0.025,0.025,0.025);
            gl.sphere();
        }
        gl.popMatrix();

        gl.drawMode(gl.LINES);
    };

    /*---------------------------------------------------------------------------------------------------------*/

    window.addEventListener('load',function()
    {
        texImage0 = new Image();
        texImage0.addEventListener('load',onImageLoad);
        texImage1 = new Image();
        texImage1.addEventListener('load',onImageLoad);
        texImage0.src = 'texture.jpg';
        texImage1.src = 'ash_uvgrid01.jpg';
     });

    function onImageLoad()
    {
        texImagesLoaded++;
        if(texImagesLoaded == texImagesLen)app = new TestApp(document.getElementById('canvasGLContainer'));
    }

    /*---------------------------------------------------------------------------------------------------------*/
})();