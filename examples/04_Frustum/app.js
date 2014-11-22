var Foam         = require('foam-gl'),
    System       = Foam.System,
    Vec3         = Foam.Vec3,
    Program      = Foam.Program,
    CameraPersp  = Foam.CameraPersp,
    CameraOrtho  = Foam.CameraOrtho,
    FrustumPersp = Foam.FrustumPersp,
    FrustumOrtho = Foam.FrustumOrtho;


Foam.App.newOnLoadWithResource(
    {
        path : '../resources/basic3d.glsl' // bundle.js relative
    },
    {
        setup : function(resource){
            this.setFPS(60);
            this.setWindowSize(800,600);

            var gl = this._gl;

            gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

            var program = this._program = new Program(resource);
            program.bind();

            //
            //  Camera
            //

            var windowAspectRatio = this.getWindowAspectRatio();
            var camera;

            camera = this._cameraPersp = new CameraPersp();
            camera.setPerspective(35.0,windowAspectRatio,0.0125,4);
            camera.lookAt(Vec3.one(), Vec3.zero());
            camera.updateMatrices();

            camera = this._cameraOrtho = new CameraOrtho();
            camera.lookAt(new Vec3(-1,1,1),Vec3.zero());
            camera.updateMatrices();

            var zoom = 3;

            camera = this._camera = new CameraOrtho();
            camera.setOrtho(-windowAspectRatio * zoom, windowAspectRatio * zoom, -zoom, zoom,-3,6);
            camera.lookAt(Vec3.one(),Vec3.zero());
            camera.updateMatrices();

            this._cameraSelected = camera;
            this._frustumOrtho = new FrustumOrtho();
            this._frustumPersp = new FrustumPersp();

            //
            //  test obj
            //

            var num = 3000;
            this._pointBufferVertex = gl.createBuffer();
            this._pointBufferColor = gl.createBuffer();
            this._pointBufferColorData = new Float32Array(num * 4);

            var vertexData = this._pointBufferVertexData = new Float32Array(num * 3);

            var i = -1, j;
            while(++i < num){
                j = i * 3;
                vertexData[j  ] = ( -1 + Math.random() * 2);
                vertexData[j+1] = ( -1 + Math.random() * 2);
                vertexData[j+2] = ( -1 + Math.random() * 2);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this._pointBufferVertex);
            gl.bufferData(gl.ARRAY_BUFFER, this._pointBufferVertexData, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.enable(gl.DEPTH_TEST);
            program.uniform1f('uPointSize',2.0);

            //

            var selectCamera = document.createElement('select');
                selectCamera.style.width = '150px';
                selectCamera.style.position = 'absolute';
                selectCamera.style.left = '20px';
                selectCamera.style.top = '20px';
                selectCamera.addEventListener('change',this.onCameraSelected.bind(this));

            var options = ['Camera Scene', 'Camera Ortho', 'Camera Persp'];
            i = -1;
            var l = options.length;
            var option;
            while(++i < l){
                option = document.createElement('option');
                option.innerHTML = options[i];
                selectCamera.appendChild(option);
            }

            document.body.appendChild(selectCamera);
        },

        update : function(){
            var gl = this._gl,
                glTrans = this._glTrans,
                glDraw = this._glDraw;

            var t = this.getSecondsElapsed();

            gl.clearColor(0.1,0.1,0.1,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var frustumOrtho = this._frustumOrtho,
                frustumPersp = this._frustumPersp;

            var camera;
            camera = this._cameraPersp;
            camera.lookAt(new Vec3(Math.cos(t) * 2,0,Math.sin(t) * 2), new Vec3(Math.cos(t),Math.cos(t),Math.sin(t)));
            camera.updateMatrices();
            frustumPersp.set(camera);

            var windowAspectRatio = this.getWindowAspectRatio();
            var zoom = 0.5 + (0.5 + Math.sin(t) * 0.5) * 0.5;

            camera = this._cameraOrtho;
            camera.setOrtho(-windowAspectRatio * zoom, windowAspectRatio * zoom, -zoom, zoom,-1,3);
            camera.lookAt(new Vec3(Math.cos(t),Math.sin(t),Math.sin(t)), new Vec3(0,Math.sin(t*0.5),0));
            camera.updateMatrices();
            frustumOrtho.set(camera);

            glTrans.setMatricesCamera(this._cameraSelected);

            var vertexData = this._pointBufferVertexData,
                colorData  = this._pointBufferColorData;

            var x, y, z;

            var i = -1, l = vertexData.length / 3 , j ,k;
            while(i++ < l){
                j = i * 3;
                k = i * 4;

                colorData[k  ] = colorData[k+3] = 1.0;
                colorData[k+1] = colorData[k+2] = 0.0;

                x = vertexData[j  ];
                y = vertexData[j+1];
                z = vertexData[j+2];

                if(frustumOrtho.containsPoint3f(x,y,z)){
                    colorData[k+2] = 1.0;
                }
                if(frustumPersp.containsPoint3f(x,y,z)){
                    colorData[k+1] = 1.0;
                }
            }


            this.drawScene();

        },

        drawScene : function(){
            var gl = this._gl,
                glDraw = this._glDraw,
                glTrans = this._glTrans;

            glDraw.drawPivot(3);
            glDraw.drawCubeColored(0.125);

            var cameraSelected = this._cameraSelected;
            var cameraOrtho = this._cameraOrtho,
                cameraPersp = this._cameraPersp;

            this._frustumOrtho.draw();
            this._frustumPersp.draw();

            if(cameraSelected != cameraOrtho){
                cameraOrtho.draw();
            }
            if(cameraSelected != cameraPersp){
                cameraPersp.draw();
            }

            var program = this._program;

            gl.disableVertexAttribArray(program.getAttribLocation(Program.ATTRIB_TEXCOORD));

            gl.bindBuffer(gl.ARRAY_BUFFER, this._pointBufferVertex);
            gl.vertexAttribPointer(program.getAttribLocation(Program.ATTRIB_VERTEX_POSITION),3,gl.FLOAT,false,0,0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._pointBufferColor);
            gl.bufferData(gl.ARRAY_BUFFER, this._pointBufferColorData, gl.STREAM_DRAW);
            gl.vertexAttribPointer(program.getAttribLocation(Program.ATTRIB_VERTEX_COLOR),4,gl.FLOAT,false,0,0);

            gl.uniformMatrix4fv(program.getUniformLocation(Program.UNIFORM_MODELVIEW_MATRIX) , false, glTrans.getModelViewMatrixF32());
            gl.uniformMatrix4fv(program.getUniformLocation(Program.UNIFORM_PROJECTION_MATRIX) , false, glTrans.getProjectionMatrixF32());

            gl.drawArrays(gl.POINTS,0,this._pointBufferVertexData.length / 3);

            gl.enableVertexAttribArray(program.getAttribLocation(Program.ATTRIB_TEXCOORD));

        },

        onCameraSelected : function(index){
            index = index.srcElement.selectedIndex;
            this._cameraSelected = index == 0 ? this._camera : index == 1 ? this._cameraOrtho : this._cameraPersp;
        }
    }
);