var Foam    = require('foam-gl'),
	Program = Foam.Program;

Foam.App.newOnLoadWithResource({
		path : PATH_TO_SHADER
	},{
		setup: function(resource){
			this.setWindowSize(800,600);
			this.setFPS(60);

			this._program = new Program(resource);
			this._program.bind();

			var windowWidth  = this.getWindowWidth(),
				windowHeight = this.getWindowHeight();

			this._gl.viewport(0,0,windowWidth,windowHeight);
			this._glTrans.setWindowMatrices(windowWidth,windowHeight,true);
		},
		update : function(){
			var gl      = this._gl,
				glTrans = this._glTrans,
				glDraw  = this._glDraw;

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0.25,0.25,0.25,1.0);

			glTrans.pushMatrix();
			glTrans.translate3f(this.getWindowWidth() * 0.5 - 50, this.getWindowHeight() * 0.5 - 50,0);
			glTrans.scale3f(100,100,0);
			glDraw.drawRect();
			glTrans.popMatrix();
		}
});