var Foam        = require('foam-gl'),
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    Texture     = Foam.Texture,
    Ease        = Foam.Ease;

Foam.App.newOnLoadWithResource({ // bundle.js relative
    shader: {
        path: '../examples/resources/basic3dTexture.glsl'
    },

    image0: {
        path: '../examples/02_Texture/texture.jpg',
        type: 'image'
    },

    image1: {
        path: '../examples/02_Texture/texture.png',
        type: 'image'
    }
},{
    setup : function(resources){
        this.setFPS(60);
        this.setWindowSize(800, 600);

        var gl = this._gl;

        gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

        this._program = new Program(resources.shader);
        this._program.bind();

        this._camera = new CameraPersp();
        this._camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 20.0);
        this._camera.lookAt(Vec3.one(), Vec3.zero());
        this._camera.updateMatrices();

        this._texture0 = Texture.createFromImage(resources.image0);
        this._texture0.bind(0);
        this._texture1 = Texture.createFromImage(resources.image1);
        this._texture1.bind(1);

        gl.enable(gl.DEPTH_TEST);
        this._program.uniform1f('uPointSize',4.0);
    },

    update : function(){
        var gl = this._gl,
            glDraw = this._glDraw,
            glTrans = this._glTrans;

        var program = this._program,
            camera = this._camera;

        var t = this.getSecondsElapsed();

        gl.clearColor(0.1,0.1,0.1,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
        camera.updateMatrices();
        glTrans.setMatricesCamera(camera);

        glDraw.drawPivot();

        program.uniform1i('uTexture',Math.sin(t) < 0 ? 0 : 1); //switch texture
        program.uniform1f('uUseTexture',Ease.stepSmooth(Math.sin(t * 4) * 0.5 + 0.5));
        glDraw.colorf(1,0,0.25);
        glTrans.pushMatrix();
        glTrans.translate3f(-0.5,-0.5,0);
        glDraw.drawRect();
        glTrans.popMatrix();
        program.uniform1f('uUseTexture',0);
    }
});