var Foam = require('foam-gl'),
    Texture = Foam.Texture,
    Program = Foam.Program,
    Random  = Foam.Random;

Foam.App.newOnLoadWithResource({
        path : '../examples/resources/basic3dTexture.glsl' // bundle.js relative
    },
    {
        setup : function(resource){
            var gl = this._gl,
                glTrans = this._glTrans;

            var windowSize = this.getWindowSize();

            gl.viewport(0,0,windowSize.x,windowSize.y);
            glTrans.setWindowMatrices(windowSize.x,windowSize.y);

            this._program = new Program(resource);
            this._program.bind();

            var textureSize   = this._textureSize = 256,
                textureSize_1 = textureSize - 1,
                textureSizeSq = textureSize * textureSize;
            var data = new Float32Array(textureSizeSq * 4 /*rgba*/);
            var i = -1, j, _i, i_, j_;
            while(++i < textureSize){
                i_ = i / textureSize_1 * Math.PI;
                j = -1;
                while(++j < textureSize){
                    _i = (j * textureSize + i) * 4;
                    j_ = j / textureSize_1 * Math.PI;
                    data[_i  ] = 0.5 + Math.sin(j_) * 0.5;
                    data[_i+1] = 0.5 + Math.sin(i_) * 0.5;
                    data[_i+2] = 0.5 + Math.sin(i_ * j_) * 0.5;
                    data[_i+3] = 1.0;
                }
            }

            var format = new Texture.Format();
                format.dataType = gl.FLOAT;
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
                data[i * 4 + 1] = 0;
                data[i * 4 + 2] = 1;
                data[i * 4 + 3] = 1;
            }

            texture.writeData(data,0,0,textureSize,textureSize);

            this._program.uniform1f('uUseTexture',1.0);
            this._program.uniform1i('uTexture',0);
            gl.clearColor(0,0,1,1);
        },

        update : function(){
            var gl = this._gl, glDraw = this._glDraw;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var textureSize = this._textureSize;
            glDraw.drawRect(textureSize,textureSize);
        }
    }
);