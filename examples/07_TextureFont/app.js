var Foam     = require('../../src/foam/Foam.js'),
    glTrans  = Foam.glTrans,
    glDraw   = Foam.glDraw,
    System   = Foam.System,
    Program  = Foam.Program,
    TextureFont = Foam.TextureFont;

var gl;
var dir = '../examples/07_TextureFont/',
    resources = {},
    app = {};

resources.shader = {
    path : dir + 'program.glsl',
    type : 'text'
};

resources.fontData = {
    path : dir + 'Roboto-Black.ttf',
    type : 'arraybuffer'
};


app.setup = function(resources){
    this.setFPS(60.0);
    this.setWindowSize(800, 600);

    gl = Foam.gl.get();

    glDraw = glDraw.get();
    gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

    var program = this._program = new Program(resources.shader);
    program.bind();

    var textureFont = this._textureFont = new TextureFont(resources.fontData);
    textureFont.setFontSize(32);
};

app.update = function(){
    var program = this._program;
    var t = this.getSecondsElapsed();

    var font = this._textureFont;

    gl.clearColor(0,0,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    glTrans.setWindowMatrices(this.getWindowWidth(), this.getWindowHeight(), true);

    gl.bindTexture(gl.TEXTURE_2D,font.getGlyphTableGLTexture());

    gl.uniform1f(program['uUseTexture'],1.0);
    gl.uniform1i(program['uTexture'],0);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    font.drawString('THIS IS A String. Its not well kerned yet. ' + t);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    gl.uniform1f(program['uUseTexture'],0.0);
    gl.bindTexture(gl.TEXTURE_2D,null);
};

Foam.App.newOnLoadWithResource(resources,app);

