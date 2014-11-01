var Foam = require('Foam');
var Mouse       = Foam.Mouse,
    FileWatcher = Foam.FileWatcher,
    Program     = Foam.Program,
    glTrans     = Foam.glTrans,
    glDraw;

var root         = '../examples/08_Raymarching/'; // bundle.js relative
var pathVertGlsl = root + 'vert.glsl',
    pathFragGlsl = root + 'frag.glsl';

var gl;

Foam.App.newOnLoadWithResource(
    {
        vertShader: {
            path: pathVertGlsl,
            type: 'text'
        },
        fragShader: {
            path: pathFragGlsl,
            type: 'text'
        }
    },
    {
        setup : function(resources){
            gl = Foam.gl.get();

            var windowSize, program, fileWatcher;

            windowSize = this._windowSize = this.getWindowSize();
            program = this._program = new Program(resources.vertShader,resources.fragShader);
            program.bind();


            glDraw = Foam.glDraw.get();
            gl.viewport(0,0,windowSize.x, windowSize.y);
            glTrans.setWindowMatrices(windowSize.x, windowSize.y, true);

            fileWatcher = this._fileWatcher = new FileWatcher();

            var self = this;
            fileWatcher.addFile(pathFragGlsl, function (e) {
                console.log('File :' + e.sender.path + ' did change.');
                program.load(resources.vertShader, e.data);
                program.bind();

                gl.uniform2fv(program['uScreenSize'],  windowSize.toFloat32Array());
                gl.uniform1f( program['uScreenRatio'], self.getWindowAspectRatio());
            });

        },

        update : function(){
            gl.clearColor(0.1,0.1,0.1,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var program = this._program,
                windowSize = this._windowSize,
                mouse = Mouse.getInstance();

            gl.uniform2f(program['uMousePosition'], mouse.getXNormalized(), mouse.getYNormalized());
            gl.uniform1f(program['uTime'],this.getSecondsElapsed());
            glDraw.drawRect(windowSize.x,windowSize.y);
        }
    }
);