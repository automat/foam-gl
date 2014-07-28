var Foam        = require('Foam'),
    glTrans     = Foam.glTrans,
    glDraw      = Foam.glDraw,
    System      = Foam.System,
    Vec3        = Foam.Vec3,
    Program     = Foam.Program,
    CameraPersp = Foam.CameraPersp,
    Texture     = Foam.Texture,
    Ease        = Foam.Ease;

var resources = { // bundle.js relative
    shader: {
        path: '../examples/02_Texture/program.glsl'
    },

    image0: {
        path: '../examples/02_Texture/texture.jpg',
        type: 'image'
    },

    image1: {
        path: '../examples/02_Texture/texture.png',
        type: 'image'
    }
};

var app = {}, gl;

app.setup = function(resources){
    this.setFPS(60);
    this.setWindowSize(800, 600);

    gl      = Foam.gl.get();
    glDraw  = Foam.glDraw.get();

    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

    var program = this._program = new Program(resources.shader);
    program.bind();

    var camera = this._camera = new CameraPersp();
    camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 20.0);
    camera.lookAt(Vec3.one(), Vec3.zero());
    camera.updateMatrices();


    var texture = this._texture = Texture.createFromImage(resources.image0);
    texture.bind(0);

    gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(program['uPointSize'],4.0);
};

app.update = function(){
    var t = this.getSecondsElapsed();
    var program = this._program,
        camera = this._camera;

    gl.clearColor(0.1,0.1,0.1,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.setEye3f(Math.cos(t) * 2,1,Math.sin(t) * 2);
    camera.updateMatrices();
    glTrans.setMatricesCamera(camera);

    glDraw.drawPivot();

    gl.uniform1f(program['uUseTexture'],Ease.stepSmooth(Math.sin(t * 4) * 0.5 + 0.5));
    glDraw.colorf(1,0,0.25);
    glTrans.pushMatrix();
    glTrans.translate3f(-0.5,-0.5,0);
    glDraw.drawRect();
    glTrans.popMatrix();
    gl.uniform1f(program['uUseTexture'],0);
};

Foam.App.newOnLoadWithResource(resources,app);