var Foam        	 = require('foam-gl'),
	Vec3        	 = Foam.Vec3,
	CameraPersp 	 = Foam.CameraPersp,
	Arcball     	 = Foam.Arcball,
	Program          = Foam.Program,
	VboMeshPrimitive = Foam.VboMeshPrimitive,
	Light 			 = Foam.Light,
	Material 		 = Foam.Material;

Foam.App.newOnLoadWithResource({
		path: '../examples/resources/basic3dLight.glsl' //bundle js relative
	}, {
		setup: function (resource) {
			var gl = this._gl;

			this.setWindowSize(window.innerWidth, window.innerHeight);
			gl.viewport(0, 0, this.getWindowWidth(), this.getWindowHeight());

			this._program = new Program(resource);
			this._program.bind();

			this._camera = new CameraPersp(60.0, this.getWindowAspectRatio(), 0.01, 20.0);
			this._camera.setEye(Vec3.one().scale(3));
			this._camera.updateMatrices();

			this._arcball = new Arcball(this._camera);

			this._light0 = new Light(0);
			this._light1 = new Light(1);
			this._light2 = new Light(2);

			this._light0.ambient.setf(1,1,1);
			this._light1.ambient.setf(1,0,0);
			this._light2.ambient.setf(0,0,1);

			this._material = new Material();
			this._material.ambient.setf(1,0,1);

			this._mesh = new VboMeshPrimitive.Cube();

			this._program.uniform1f(Program.UNIFORM_POINT_SIZE,3.0);
			gl.enable(gl.DEPTH_TEST);
		},

		update: function () {
			var gl = this._gl,
				glTrans = this._glTrans,
				glDraw = this._glDraw;

			var program = this._program;
			var t = this.getSecondsElapsed();

			gl.clearColor(0.125, 0.125, 0.125, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			this._arcball.apply();

			glTrans.setMatricesCamera(this._camera);
			glDraw.drawPivot();
			this._arcball.debugDraw();

			var light = this._light0;
			light.position.set3f(Math.cos(t) * 3,1,Math.sin(t) * 3);

			light.position.set3f(Math.cos(t)*0.85,0.5,Math.sin(t)*0.85);
			light.draw();
			light.debugDraw();

			light = this._light1;
			light.position.set3f(Math.cos(t),Math.sin(t),Math.sin(t)*0.65);
			light.draw();
			light.debugDraw();

			light = this._light2;
			light.position.set3f(0,0.55 + (0.5 + Math.sin(t) * 0.5) * 0.5,0);
			light.draw();
			light.debugDraw();

			this._material.apply();

			program.uniform1f(Program.UNIFORM_USE_LIGHTING, 1.0);
			this._mesh.draw();
			program.uniform1f(Program.UNIFORM_USE_LIGHTING, 0.0);
		},

		onWindowResize: function () {
			this.setWindowSize(window.innerWidth,window.innerHeight);
			this._camera.setAspectRatio(this.getWindowAspectRatio());
			this._camera.updateProjectionMatrix();
			this._gl.viewport(0, 0, this.getWindowWidth(),this.getWindowHeight());
		}
	}
);