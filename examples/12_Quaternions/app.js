var Foam        = require('foam-gl'),
	Program     = Foam.Program,
	CameraPersp = Foam.CameraPersp;

var Quat = Foam.Quat,
	Vec3 = Foam.Vec3;

Foam.App.newOnLoadWithResource({
		path : "../resources/basic3d.glsl"
	},{
		setup : function(resource){
			this.setWindowSize(800, 600);
			this.setFPS(60);

			this._program = new Program(resource);
			this._program.bind();

			this._camera = new CameraPersp();
			this._camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 40.0);
			this._camera.setEye3f(0,5,5);
			this._camera.updateMatrices();

			var gl = this._gl;
			gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());
			gl.enable(gl.DEPTH_TEST);
	},
		update : function(){
			var gl      = this._gl,
				glDraw  = this._glDraw,
				glTrans = this._glTrans;

			var program = this._program;

			var t = this.getSecondsElapsed(),
				t_= t * 0.125;
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.clearColor(0.25,0.25,0.25,1.0);

			this._camera.setEye3f(Math.cos(t_)*5,2 + (0.5 + Math.sin(t * 0.125) * 0.5) * 3,Math.sin(t_)*5);
			this._camera.updateViewMatrix();

			glTrans.setMatricesCamera(this._camera);
			glDraw.colorf(0.15,0.15,0.15);
			glDraw.drawGrid(Vec3.one().scale(45),45);
			glDraw.drawPivot(0.5);
			glDraw.colorf(0,0,0.15);
			glDraw.drawCubeStroked();

			program.uniform1f('uPointSize',4.0);

			function drawQuat(q,length){
				glTrans.pushMatrix();
				glTrans.rotateQuat(q);
				glDraw.colorf(1,1,1);
				glDraw.drawCubeStroked(0.05);
				glDraw.drawPivot(length || 0.35,0.125,0.025);
				glTrans.popMatrix();
			}

			function drawQuatLookAt(from,to,length){
				glDraw.colorf(1,1,1);
				glDraw.drawPoint(from);
				glDraw.drawPoint(to);
				glTrans.pushMatrix();
				glTrans.translate(from);
				glDraw.colorf(0,0,0.15);
				glDraw.drawVector(to.subbed(from));
				drawQuat(Quat.fromLookAt(from,to),length);
				glTrans.popMatrix();
			}

			function drawAxisf(x,y,z,length){
				length = length !== undefined ? length : 0.5;
				var len = 1.0 / Math.sqrt(x * x + y * y + z * z);
				x *= len;y *= len;z *= len;
				glDraw.drawVectorf(0,0,0,x*length,y*length,z*length,0.0635,0.0375);
			}


			glTrans.pushMatrix();
				glTrans.translate3f(0,0,-2);
				drawQuat(Quat.fromAxisAnglef(1,0,0,t));
				drawAxisf(1,0,0);
				glTrans.translate3f(0,1,0);
				drawQuat(Quat.fromAxisAnglef(0,1,0,t * 3));
				drawAxisf(0,1,0);
				glTrans.translate3f(0,1,0);
				drawQuat(Quat.fromAxisAnglef(0,0,1,t));
				drawAxisf(0,0,1);
				glTrans.translate3f(1,-1,0);
				drawQuat(Quat.fromAxisAngle(new Vec3(1,1,1),t));
				drawAxisf(1,1,1);
			glTrans.popMatrix();

			var q0,q1,q2,v;

			glTrans.pushMatrix();
				glTrans.translate3f(0,1,0);
				drawQuatLookAt(new Vec3(0,0,0),new Vec3(Math.cos(t),Math.sin(t*2),Math.sin(t)));
				for(var i = 0, l = 50, s = 1.0 / l,s_,a; i < l; ++i){
					s_= s * i;
					a = t - s_ * Math.PI;
					program.uniform1f('uPointSize',(1.0 - s_) * 6);
					glDraw.colorf(1,0,s_);
					glDraw.drawPointf(Math.cos(a),Math.sin(t * 2 - s_ * Math.PI * 2),Math.sin(a));
				}
				glTrans.translate3f(0,-1,0);
				drawQuatLookAt(new Vec3(Math.cos(-t)*0.5,Math.sin(t*0.5),Math.sin(-t)*0.25),new Vec3(0,0,0));
			glTrans.popMatrix();

			program.uniform1f('uPointSize',4);

			glTrans.pushMatrix();
				glTrans.translate3f(0,0,2);
				glDraw.colorf(1,1,1);
				glDraw.drawPoint();
				q0 = Quat.fromDirection(Vec3.xAxis());
				drawQuat(q0);
				drawAxisf(1,0,0);
				q1 = Quat.fromDirection(new Vec3(-1,1,1).normalize());
				drawQuat(q1);
				drawAxisf(1,1,1);
				q2 = Quat.fromInterpolationTo(q0,q1,0.5 + Math.sin(t) * 0.5);
				drawQuat(q2,0.75);
				glTrans.pushMatrix();
					glTrans.rotateQuat(q2);
					glDraw.drawCubeColored(0.125);
				glTrans.popMatrix();
			glTrans.popMatrix();

			glTrans.pushMatrix();
				glTrans.translate3f(-2,0,0);
				v  = new Vec3(1,Math.sin(t),1);
				q0 = Quat.fromDirection(v.normalize());
				q0.mult(Quat.fromAxisAnglef(0,1,0,t));
				q0.mult(Quat.fromAxisAnglef(0,0,1,(0.5 + Math.sin(t) * 0.5) * Math.PI * 0.5));
				drawQuat(q0,1.15);
				drawAxisf(v.x, v.y, v.z,1.15);
				glTrans.rotateQuat(q0);
				glTrans.pushMatrix();
					glTrans.translate3f(0.5,0,0);
					glTrans.scale3f(1.0,0.25,0.25);
					glDraw.drawCubeColored();
				glTrans.popMatrix();
				glTrans.pushMatrix();
					glTrans.translate3f(1,0,0);
					q0 = Quat.fromAxisAngle(Vec3.zAxis(),(0.5 + Math.sin(t) * 0.5) * Math.PI * 0.5);
					q1 = Quat.fromAxisAngle(Vec3.xAxis(),(0.5 + Math.sin(t * 2) * 0.5) * Math.PI * 0.15);
					q0.mult(q1);
					drawQuat(q0,1.15);
					glTrans.pushMatrix();
						glTrans.rotateQuat(q0);
						glTrans.translate3f(0.5,0,0);
						glTrans.scale3f(1.0,0.25,0.25);
						glDraw.drawCubeColored();
					glTrans.popMatrix();
				glTrans.popMatrix();
			glTrans.popMatrix();
		}
	}
);