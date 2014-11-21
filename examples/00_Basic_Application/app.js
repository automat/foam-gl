var Foam     = require('foam-gl'),
    Ease     = Foam.Ease,
    System   = Foam.System,
    Matrix44 = Foam.Matrix44,
    Program  = Foam.Program;



Foam.App.newOnLoadWithResource(
    {
        path : '../examples/resources/basic2d.glsl' // bundle.js relative
    },
    {
        setup : function(resource){
            var gl = this._gl;
            gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

            this._program = new Program(resource);
            this._program.bind();

            this._vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
                [0,0,0,100,0,0,0,100,0,100,100,0]),
                gl.STATIC_DRAW);

            this._program.vertexAttribPointer('aVertexPosition',3,gl.FLOAT,false,0,0);
            gl.enable(gl.SCISSOR_TEST);
        },

        update : function(){
            var gl = this._gl,
                glTrans = this._glTrans;

            var program = this._program;

            var t = this.getSecondsElapsed();

            var windowWidth    = this.getWindowWidth();
            var windowWidth_2  = windowWidth * 0.5;
            var windowWidth_4  = windowWidth * 0.25;
            var windowHeight   = this.getWindowHeight();
            var windowHeight_2 = windowHeight * 0.5;
            var windowHeight_4 = windowHeight * 0.25;

            program.uniform4f('uColor',1,1,1,1);

            //  tl

            gl.scissor( 0,windowHeight_2, windowWidth_2, windowHeight_2);
            gl.viewport(0,windowHeight_2, windowWidth_2, windowHeight_2);
            glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

            gl.clearColor(1,0,0,1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            glTrans.pushMatrix();
            glTrans.translate3f(windowWidth_4, windowHeight_4, 0.0);
            glTrans.rotate3f(0,0,t);
            glTrans.scale1f(Math.sin(t));
            this.drawGeom();
            glTrans.popMatrix();

            //  tr

            gl.scissor( windowWidth_2,windowHeight_2,windowWidth,windowHeight_2);
            gl.viewport(windowWidth_2,windowHeight_2,windowWidth_2,windowHeight_2);
            glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

            gl.clearColor(1,0,1,1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            glTrans.pushMatrix();
            glTrans.translate3f(0,(0.5 + Math.sin(t) * 0.5) * windowHeight_2,0);
            glTrans.rotate3f(0,0,(0.5 + Math.sin(t) * 0.5) * Math.PI * 0.5);
            this.drawGeom();
            glTrans.popMatrix();

            //  bl

            gl.scissor( 0,0,windowWidth_2,windowHeight_2);
            gl.viewport(0,0,windowWidth_2,windowHeight_2);
            glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

            gl.clearColor(0,0,1,1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            glTrans.pushMatrix();
            glTrans.multMatrix(Matrix44.createTranslation(windowWidth_4,windowHeight_4,0));
            glTrans.scale1f(Math.sin(t));
            this.drawGeom();
            glTrans.popMatrix();


            //  br

            gl.scissor( windowWidth_2,0,windowWidth,windowHeight_2);
            gl.viewport(windowWidth_2,0,windowWidth_2,windowHeight_2);
            glTrans.setWindowMatrices(windowWidth_2, windowHeight_2, true);

            gl.clearColor(1,1,0,1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            var offset = Ease.stepCubed(Math.sin(t * 2)) * Math.round(Math.sin(t*2));

            glTrans.pushMatrix();
            glTrans.translate3f(windowWidth_4 - 50,windowHeight_4,0);
            glTrans.scale3f(1,offset / 100 * windowHeight_2,1);
            program.uniform4f('uColor',10,1,1,1);
            this.drawGeom();
            glTrans.popMatrix();
        },

        drawGeom : function(){
            var gl = this._gl, glTrans = this._glTrans;
            var program = this._program;
            program.uniformMatrix4fv('uProjectionMatrix', false, glTrans.getProjectionMatrixF32());
            program.uniformMatrix4fv('uModelViewMatrix' , false, glTrans.getModelViewMatrixF32());
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
);

