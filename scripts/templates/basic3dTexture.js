var Foam        = require('foam-gl'),
	Program     = Foam.Program,
	CameraPersp = Foam.CameraPersp,
	Texture		= Foam.Texture;

Foam.App.newOnLoadWithResource({
		path : PATH_TO_SHADER
	},{
		setup : function(resource){
			this.setWindowSize(800, 600);
			this.setFPS(60);

			this._program = new Program(resource);
			this._program.bind();

			this._camera = new CameraPersp();
			this._camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 20.0);

			this._program.uniform1f('uPointSize',4.0);

			this._texture = Texture.createRandom(100,100);
			this._texture.bind(0);

			var gl = this._gl;

			gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());
			gl.enable(gl.DEPTH_TEST);

			this._program.uniform1i('uTexture',0);
		},
		update : function(){
			var gl      = this._gl,
				glDraw  = this._glDraw,
				glTrans = this._glTrans;

			var program = this._program;

			var t = this.getSecondsElapsed();

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0.25,0.25,0.25,1.0);

			this._camera.setEye3f(Math.cos(t) * 3, 3, Math.sin(t) * 3);
			this._camera.updateMatrices();

			glTrans.setMatricesCamera(this._camera);

			program.uniform1f('uUseTexture',0.0);
			glDraw.drawPivot();

			program.uniform1f('uUseTexture',1.0);

			glTrans.pushMatrix();
			glTrans.translate3f(-0.5,-0.5,0);
			glDraw.drawRect();
			glTrans.popMatrix();
		}
	}
);