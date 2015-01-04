var Foam        = require('foam-gl'),
    System      = Foam.System,
    Program     = Foam.Program,
    TextureFont = Foam.TextureFont,
    Random      = Foam.Random,
    Color       = Foam.Color,
    Vec2        = Foam.Vec2,
    Rect        = Foam.Rect,
    Texture     = Foam.Texture;


var dir = '../examples/07_TextureFont/'; // bundle.js relative

Foam.App.newOnLoadWithResource({
    shader : {
        path : '../resources/basic3dTexture.glsl',
        type : 'text'
    },
    fontData : {
        path : dir + 'Roboto-Black.ttf',
        type : 'arraybuffer'
    }

},{
    setup : function(resources){
        this.setFPS(60.0);
        this.setWindowSize(800, 600);

        var windowWidth = this.getWindowWidth(),
            windowHeight = this.getWindowHeight();

        var gl = this._gl;
        gl.viewport(0,0,windowWidth,windowHeight);

        this._program = new Program(resources.shader);
        this._program.bind();

        this._textureFont24 = new TextureFont(resources.fontData);
        this._textureFont24.setFontSize(24);
        this._textureFont24.setLineHeight(1.25);

        this._textureFont96 = new TextureFont(resources.fontData);
        this._textureFont96.setFontSize(96);

        this._texture = Texture.fromRandom(windowWidth,windowHeight,null,null,0,0,255);
        this._texture.bind();

        this._string = "Drop it, Mr. Data and attack the Romulans.\n Well, that's certainly good to know. How long can two people talk about nothing? Congratulations - you just destroyed the Enterprise. Flair is what marks the difference between artistry and mere competence. When has justice ever been as simple as a rule book?";

        gl.disable(gl.DEPTH_TEST);
        this._program.uniform1f('uTexture',0);
    },

    update : function(){
        var gl = this._gl,
            glDraw = this._glDraw,
            glTrans = this._glTrans;

        var program = this._program;
        var t = this.getSecondsElapsed();

        var windowSize    = this.getWindowSize(),
            windowWidth_2 = windowSize.x * 0.5;

        var font24 = this._textureFont24,
            font96 = this._textureFont96;
        var string = this._string;

        var intrpl = 0.5 + Math.sin(t) * 0.5;
        var size  = new Vec2(200 + intrpl * (windowWidth_2 - 200),250 + (1 - intrpl) * (windowSize.y - 250));


        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        glTrans.setWindowMatrices(this.getWindowWidth(), this.getWindowHeight(), true);

        program.uniform1f('uUseTexture',1.0);

        glTrans.pushMatrix();
        glDraw.colorf(1,1,1,1);
        glDraw.drawRect(this.getWindowWidth(),this.getWindowHeight());
        glTrans.popMatrix();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        glTrans.pushMatrix();
        font24.drawTextBox(string, size);
        glTrans.translate3f(windowWidth_2,0,0);
        font96.setLineHeight(1 + intrpl * 0.25);
        font96.drawTextBox(string, size, new Color(intrpl,intrpl,1));
        glTrans.popMatrix();

        gl.disable(gl.BLEND);

        program.uniform1f('uUseTexture',0);

        glTrans.pushMatrix();
        glDraw.colorf(0,0,1,1);
        glDraw.drawRectStroked(size.x,size.y);
        glTrans.translate3f(windowWidth_2,0,0);
        glDraw.drawRectStroked(size.x,size.y);
        glTrans.popMatrix();
    }
});
