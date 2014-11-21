var Foam = require('foam-gl');
var Mouse       = Foam.Mouse,
    FileWatcher = Foam.FileWatcher,
    Program     = Foam.Program;

var root         = '../examples/08_Raymarching/'; // bundle.js relative
var pathVertGlsl = root + 'vert.glsl',
    pathFragGlsl = root + 'frag.glsl';



Foam.App.newOnLoadWithResource({
        vertShader: {
            path: pathVertGlsl,
            type: 'text'
        },
        fragShader: {
            path: pathFragGlsl,
            type: 'text'
        }
    },{
        setup : function(resources){
            var gl = this._gl,
                glTrans = this._glTrans;

            var windowSize, program, fileWatcher;

            windowSize = this._windowSize = this.getWindowSize();
            program = this._program = new Program(resources.vertShader,resources.fragShader);
            program.bind();


            gl.viewport(0,0,windowSize.x, windowSize.y);
            glTrans.setWindowMatrices(windowSize.x, windowSize.y, true);

            fileWatcher = this._fileWatcher = new FileWatcher();

            var self = this;
            fileWatcher.addFile(pathFragGlsl, function (e) {
                console.log('File :' + e.sender.path + ' did change.');
                program.load(resources.vertShader, e.data);
                program.bind();

                program.uniform2fv('uScreenSize',  windowSize.toFloat32Array());
                program.uniform1f('uScreenRatio', self.getWindowAspectRatio());
            });

        },

        update : function(){
            var gl = this._gl,
                glDraw = this._glDraw;

            gl.clearColor(0.1,0.1,0.1,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var program = this._program,
                windowSize = this._windowSize,
                mouse = Mouse.getInstance();

            program.uniform2f('uMousePosition', mouse.getXNormalized(), mouse.getYNormalized());
            program.uniform1f('uTime',this.getSecondsElapsed());
            glDraw.drawRect(windowSize.x,windowSize.y);
        }
    }
);