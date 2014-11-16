var Foam = require('foam'),
	Vec3 = Foam.Vec3,
	CameraPersp = Foam.CameraPersp,
	Program = Foam.Program,
	VboMeshPrimitive = Foam.VboMeshPrimitive,
	Light = Foam.Light,
	Material = Foam.Material;

var gl, glDraw, glTrans;

Foam.App.newOnLoadWithResource({
		path: '../examples/11_Light/program.glsl' //bundle js relative
	},
	{
		setup: function (resource) {
			gl = this._gl;
			glDraw = this._glDraw;
			glTrans = this._glTrans;

			this.setWindowSize(window.innerWidth, window.innerHeight);
			gl.viewport(0, 0, this.getWindowWidth(), this.getWindowHeight());

			var program = this._program = new Program(resource);
			program.bind();

			this._camera = new CameraPersp(60.0, this.getWindowAspectRatio(), 0.01, 20.0);
			this._camera.setEye(Vec3.one().scale(3));
			this._camera.updateMatrices();

			this._light0 = new Light(0);
			this._light1 = new Light(1);
			this._light2 = new Light(2);

			this._light0.ambient.setf(1,1,1);
			this._light1.ambient.setf(1,0,0);
			this._light2.ambient.setf(0,0,1);

			this._material = new Material();
			this._material.ambient.setf(1,0,1);

			this._mesh = new VboMeshPrimitive.Cube();

			program.uniform1f(Program.UNIFORM_POINT_SIZE,3.0);
			gl.enable(gl.DEPTH_TEST);
		},

		update: function () {
			var program = this._program;
			var t = this.getSecondsElapsed();

			gl.clearColor(0.25, 0.25, 0.25, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			var camera = this._camera;

			camera.setEye3f(Math.cos(t*0.5) * 4, 2, Math.sin(t*0.5) * 4);
			camera.updateMatrices();

			glTrans.setMatricesCamera(camera);
			glDraw.drawPivot();

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
			gl.viewport(0, 0, this.getWindowWidth(),this.getWindowHeight());
		}
	}
);