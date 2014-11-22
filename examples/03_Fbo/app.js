var Foam        = require('foam-gl'),
    glTrans     = Foam.glTrans,
    glDraw      = Foam.glDraw,
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    Ease        = Foam.Ease,
    Fbo         = Foam.Fbo;

Foam.App.newOnLoadWithResource({
    path : '../resources/basic3dTexture.glsl' // bundle.js relative
},{
    setup : function(resource){
        this.setFPS(60);
        this.setWindowSize(800, 600);

        this._program = new Program(resource);
        this._program .bind();

        this._camera = new CameraPersp();
        this._camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 20.0);
        this._camera.lookAt(new Vec3(5,5,5), Vec3.zero());
        this._camera.updateMatrices();


        var fboScale = this._fboScale = 2;
        this._fbo = new Fbo(this.getWindowWidth() * fboScale, this.getWindowHeight() * fboScale);

        var gl = this._gl;

        gl.enable(gl.DEPTH_TEST);
        this._program .uniform1f('uPointSize',4.0);
},
    update : function(){
        var gl = this._gl,
            glDraw = this._glDraw,
            glTrans = this._glTrans;

        var t = this.getSecondsElapsed();

        var fboScale = this._fboScale;
        var windowWidth = this.getWindowWidth();
        var windowHeight = this.getWindowHeight();

        var fbo = this._fbo;
        var program = this._program;

        fbo.bind();
        gl.viewport(0,0,windowWidth * fboScale, windowHeight * fboScale);
        gl.clearColor(1,0,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var camera = this._camera;
        camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
        camera.updateMatrices();
        glTrans.setMatricesCamera(camera);

        glDraw.drawPivot();


        var num = 5;
        var step = 1 / (num-1);
        var i, j, k;
        i = -1;
        while(++i < num){
            j = -1;
            while(++j < num){
                k = -1;
                while(++k < num){
                    glTrans.pushMatrix();
                    glTrans.translate3f(-0.5 + i * step, -0.5 + j * step, -0.5 + k * step);
                    glTrans.scale1f(0.105);
                    glDraw.drawCubeColored();
                    glTrans.popMatrix();
                }
            }
        }

        fbo.unbind();

        gl.viewport(0,0,windowWidth,windowHeight);

        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        glTrans.setWindowMatrices(windowWidth, windowHeight, false);

        glDraw.colorf(1,1,1);
        fbo.bindTexture();
        program.uniform1f('uUseTexture',1.0);
        glDraw.drawRect(windowWidth,windowHeight);
        program.uniform1f('uUseTexture',0.0);
        fbo.unbindTexture();
    },

    drawGeom : function(){
        glDraw.drawCubeColored();
        glDraw.drawCubePoints();
    }
});