var Foam        	 = require('foam-gl'),
	Vec3        	 = Foam.Vec3,
	CameraPersp 	 = Foam.CameraPersp,
	Program          = Foam.Program,
	VboMeshPrimitive = Foam.VboMeshPrimitive,
	Light 			 = Foam.Light,
	Material 		 = Foam.Material;

Foam.App.newOnLoadWithResource({
		path: PATH_TO_SHADER
	}, {
		setup: function (resource) {
			this.setWindowSize(800,600);
			this.setFPS(60);

			this._program = new Program(resource);
			this._program.bind();

			this._camera = new CameraPersp(60.0, this.getWindowAspectRatio(), 0.01, 20.0);
			this._camera.setEye(Vec3.one().scale(3));
			this._camera.updateMatrices();

			this._light = new Light(0);
			this._light.ambient.setf(1,1,1);

			this._material = new Material();

			this._mesh = new VboMeshPrimitive.Cube();

			this._program.uniform1f(Program.UNIFORM_POINT_SIZE,3.0);

			var gl = this._gl;
			gl.enable(gl.DEPTH_TEST);
			gl.viewport(0, 0, this.getWindowWidth(), this.getWindowHeight());
		},

		update: function () {
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

			var light = this._light;

			light.position.set3f(Math.cos(t),Math.sin(t),Math.sin(t)*0.65);

			program.uniform1f('uUseLighting',0.0);
			glDraw.drawPivot();
			light.debugDraw();
			program.uniform1f('uUseLighting',1.0);

			light.draw();

			this._material.ambient.setf(0.5 + Math.sin(t * 10) * 0.5,0,1);
			this._material.apply();
			this._mesh.draw();
		}
	}
);