(function()
{
    var app;

    var texImagesLen = 3,
        texImagesLoaded = 0;
    var texImage0,
        texImage1,
        texImage2;

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
            material.shininess = 200.0;

        this._texture0 = this.gl.loadTextureWithImage(texImage0);
        this._texture1 = this.gl.loadTextureWithImage(texImage1);
        this._texture2 = this.gl.loadTextureWithImage(texImage2);


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

        cam.setTarget3f(0,0,0);
        cam.updateMatrices();

        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/
        gl.useMaterial(true);
        gl.useTexture(true);
        //gl.useLighting(true);




        var l = 99,
            ni,
            s = Math.PI * 2 / l,
            i = -1,
            sxz;

        gl.drawMode(gl.TRIANGLE_FAN);
       // gl.light(light0);
        gl.material(this._material0);

        var x, y,z;



        //not really smart, but ok for testing / sketching
        //TODO:cleanup

        var _gl = gl.gl;
        _gl.enable(_gl.BLEND);
        _gl.blendFunc(_gl.SRC_COLOR, _gl.ONE);
        _gl.disable(_gl.DEPTH_TEST);
        gl.pushMatrix();
        gl.rotate3f(Math.sin(time)*Math.PI,Math.sin(time*0.25)*Math.PI,Math.sin(time*0.025)*Math.PI);
        gl.useBillboard(true);
        while(++i < l)
        {
            ni = i / (l-1);

            sxz = 1 + Math.abs(Math.sin(time + ni * Math.PI * (3+Math.abs(Math.sin(time*0.025)*9))))*1.1;

            x = Math.cos(time + s * i) * sxz;
            y = Math.sin(time + ni * Math.PI * 8)*0.5;
            z = Math.sin(time + s * i) * sxz;


            gl.texture(i % 3 ? this._texture0 : i % 9 ? this._texture1 : this._texture2);
            gl.pushMatrix();
            gl.translate3f(x,y,z);
            gl.rect(0.0125+Math.abs(Math.sin(time*5 + ni * Math.PI*4))*1.25);
            gl.popMatrix()
        }
        gl.popMatrix();
        _gl.disable(gl.BLEND);

        gl.useBillboard(false);
        gl.useTexture(false);
        gl.useMaterial(false);
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
        texImage0 = new Image();
        texImage0.addEventListener('load',onImageLoad);
        texImage0.src = 'orion_cloud2_black.png';

        texImage1 = new Image();
        texImage1.addEventListener('load',onImageLoad);
        texImage1.src = 'orion_full2_black.png';

        texImage2 = new Image();
        texImage2.addEventListener('load',onImageLoad);
        texImage2.src = 'orion_full_black.png';
    });

    function onImageLoad()
    {
        texImagesLoaded++;
        if(texImagesLoaded == texImagesLen)app = new TestApp(document.getElementById('canvasGLContainer'));
    }

    /*---------------------------------------------------------------------------------------------------------*/
})();