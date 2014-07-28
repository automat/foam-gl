var Foam = require('Foam'),
    Texture = Foam.Texture,
    Program = Foam.Program,
    Random  = Foam.Random;

var gl,
    glDraw,
    glTrans;

Foam.App.newOnLoadWithResource({
        path : '../src/resources/basic2d.glsl' // bundle.js relative
    },
    {
        setup : function(resource){
            gl      = Foam.gl.get();
            glDraw  = Foam.glDraw.get();
            glTrans = Foam.glTrans;

            var windowSize = this.getWindowSize();

            gl.viewport(0,0,windowSize.x,windowSize.y);
            glTrans.setWindowMatrices(windowSize.x,windowSize.y);

            var program = this._program = new Program(resource);
            program.bind();

            var textureSize   = this._textureSize = 256,
                textureSizeSq = textureSize * textureSize;
            var data = new Float32Array(textureSizeSq * 4 /*rgba*/);
            var i = -1;
            while(++i < textureSizeSq){
                data[i * 4    ] = Random.randomFloat();
                data[i * 4 + 1] = Random.randomFloat();
                data[i * 4 + 2] = Random.randomFloat();
                data[i * 4 + 3] = 1.0;
            }

            var format = new Texture.Format();
                format.dataType   = gl.FLOAT;
                format.wrapS = format.wrapT = gl.CLAMP_TO_EDGE;
                format.minFilter = format.magFilter = gl.NEAREST;

            var texture = new Texture(data,textureSize,textureSize,format);
            texture.bind();

            textureSize = 16;
            textureSizeSq = textureSize * textureSize;
            data = new Float32Array(textureSizeSq * 4);
            i = -1;
            while(++i < textureSizeSq){
                data[i * 4    ] = 1;
                data[i * 4 + 1] = 1;
                data[i * 4 + 2] = 1;
                data[i * 4 + 3] = 1.0;
            }

            texture.writeData(data,0,0,textureSize,textureSize);

            gl.uniform1f(program['uUseTexture'],1.0);
            gl.uniform1i(program['uTexture'],0);
            gl.clearColor(0,0,1,1);
        },

        update : function(){
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var textureSize = this._textureSize;
            glDraw.drawRect(textureSize,textureSize);
        }
    }
);