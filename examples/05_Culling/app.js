var Foam         = require('../../src/foam/Foam.js'),
    glTrans      = Foam.glTrans,
    glDraw       = Foam.glDraw,
    System       = Foam.System,
    Vec3         = Foam.Vec3,
    Program      = Foam.Program,
    CameraPersp  = Foam.CameraPersp,
    CameraOrtho  = Foam.CameraOrtho,
    AABB         = Foam.AABB,
    Matrix44     = Foam.Matrix44,
    Random       = Foam.Random,
    Color        = Foam.Color,
    FrustumPersp = Foam.FrustumPersp;

var gl;

function Cluster(){
    this.points = null;
    this.aabb = null;
    this.color = null;
    this.inFrustum = false;
}

Cluster.prototype.updateAABB = function(){
    this.aabb.setFromPoints(this.points);
};

Foam.App.newOnLoadWithResource(
    {
        path :  '../.tests/Culling/program.glsl'
    },
    {
        setup : function (resource) {
            this.setFPS(60);
            this.setWindowSize(800, 600);

            gl      = Foam.gl.get();
            glDraw  = Foam.glDraw.get();

            gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());

            var program = this._program = new Program(resource);
            program.bind();

            var camera = this._cameraPersp = new CameraPersp();
            camera.setPerspective(45.0,this.getWindowAspectRatio(),0.00125, 10.0);
            camera.lookAt(Vec3.one(), Vec3.zero());
            camera.updateMatrices();

            this._frustumPersp = new FrustumPersp();

            var windowAspectRatio = this.getWindowAspectRatio();
            var zoom = 10;

            camera = this._camera = new CameraOrtho();
            camera.setOrtho(-windowAspectRatio * zoom, windowAspectRatio * zoom, -zoom, zoom,-20,20);
            camera.lookAt(Vec3.one(),Vec3.zero());
            camera.updateMatrices();

            var numClusters = Random.randomInteger(100,300);//50,100);
            var clusters = this._clusters = new Array(numClusters);
            var box = this._box = new AABB();
            this._boxIsWithinFrustum = false;
            var i = -1, j, l, scale, cluster, center;
            while(++i < numClusters){
                center  = Vec3.randomPosition(-10,10);
                scale   = Random.randomFloat(0.125,0.5);
                cluster = clusters[i] = new Cluster();
                cluster.points = new Array(Random.randomInteger(100,300));
                cluster.aabb   = new AABB();
                cluster.color  = new Color(Math.random(),0,Math.random());

                j = -1;
                while(++j < cluster.points.length){
                    cluster.points[j] = new Vec3(Random.randomFloat(-1,1) * scale,
                            Random.randomFloat(-1,1) * scale * Random.randomFloat(1,4),
                            Random.randomFloat(-1,1) * scale * Random.randomFloat(1,4)).add(center);
                }
                cluster.updateAABB();

                box.include(cluster.aabb);
            }

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);
            gl.uniform1f(program['uPointSize'],3.0);
            
        },

        update : function () {
            var t = this.getSecondsElapsed();

            var camera = this._camera;
            var cameraPersp = this._cameraPersp;
            var frustumPersp = this._frustumPersp;
            var dist = 3 + (0.5 + Math.sin(t) * 0.5) * 7;

            cameraPersp.setEye3f(Math.cos(t * 0.25) * dist, Math.sin(t), Math.sin(t * 0.25) * dist);
            cameraPersp.updateMatrices();

            this.updateScene();

            var windowWidth = this.getWindowWidth(),
                windowHeight = this.getWindowHeight();
            var windowWidth_3 = windowWidth / 3,
                windowHeight_3 = windowHeight / 3,
                margin = 10;


            gl.scissor(0,0,windowWidth,windowHeight);
            gl.viewport(0,0,windowWidth,windowHeight);
            gl.clearColor(0.1,0.1,0.1,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            camera.lookAt(Vec3.one(),Vec3.zero());
            camera.updateMatrices();
            glTrans.setMatricesCamera(camera);
            this.drawScene();
            frustumPersp.draw();


            gl.scissor( margin, windowHeight - windowHeight_3 * 2 - margin * 2,windowWidth_3, windowHeight_3);
            gl.viewport(margin, windowHeight - windowHeight_3 * 2 - margin * 2,windowWidth_3, windowHeight_3 );
            gl.clearColor(0.01,0.01,0.01,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            camera.lookAt(new Vec3(0.0001,1,0),Vec3.zero());
            camera.updateMatrices();
            glTrans.setMatricesCamera(camera);
            this.drawScene();
            frustumPersp.draw();

            gl.scissor( margin, windowHeight - windowHeight_3 - margin,windowWidth_3, windowHeight_3);
            gl.viewport(margin, windowHeight - windowHeight_3 - margin,windowWidth_3, windowHeight_3 );
            gl.clearColor(0.01,0.01,0.01,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            glTrans.setMatricesCamera(cameraPersp);
            this.drawScene();
        },

        drawScene : function(){
            var clusters = this._clusters;
            var cluster;
            var i = -1 , l = clusters.length;
            while(++i < l){
                cluster = clusters[i];
                if(cluster.inFrustum){
                    glDraw.color(cluster.color);
                    glDraw.drawPoints(cluster.points);
                    cluster.aabb.draw(true);
                } else {
                    glDraw.colorf(0,0,0.75);
                    glDraw.drawPoints(cluster.aabb.points);
                    cluster.aabb.draw(false);
                }

            }
            if(this._boxIsWithinFrustum){
                glDraw.colorf(1,1,1,1);
            } else {
                glDraw.colorf(1,0,0,1);
            }
            this._box.draw();
            glDraw.drawPivot();
        },

        updateScene : function(){

            var t = this.getSecondsElapsed();

            var frustum = this._frustumPersp;
            frustum.set(this._cameraPersp);
            var clusters = this._clusters;
            var cluster;
            var i = -1 , l = clusters.length;
            while(++i < l){
                cluster = clusters[i];
                cluster.inFrustum = frustum.containsAABB(cluster.aabb);
            }

            this._boxIsWithinFrustum = frustum.containsAABB(this._box);
        }
        
    }
);
