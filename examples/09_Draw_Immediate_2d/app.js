var Foam     = require('Foam'),
    Ease     = Foam.Ease,
    System   = Foam.System,
    Matrix44 = Foam.Matrix44,
    Program  = Foam.Program,
    Random   = Foam.Random,
    Vec3     = Foam.Vec3,
    Vec2     = Foam.Vec2;

// This will be slow, its supposed to, 'immediate' mode is just for quick visualizations

Foam.App.newOnLoadWithResource({
        path : '../examples/resources/basic2d.glsl' // bundle.js relative
    }, {
        setup : function(resource){
            this.setWindowSize(window.innerWidth,window.innerHeight);
            var windowSize = this.getWindowSize();

            var gl = this._gl,
                glTrans = this._glTrans;

            gl.viewport(0,0,windowSize.x, windowSize.y);
            glTrans.setWindowMatrices(windowSize.x, windowSize.y);

            this._program = new Program(resource);
            this._program.bind();

            var l = 1000;
            var positions = this._positions = new Array(l),
                velocities= this._velocities= new Array(l),
                radii     = this._radii     = new Array(l),
                speeds    = this._speeds    = new Array(l);
            var i = -1;
            while(++i < l){
                positions[i] = new Vec3(Random.randomFloat() * windowSize.x,
                                        Random.randomFloat() * windowSize.y,
                                        0);
                radii[i] = Random.randomFloat(4,8);
                velocities[i] =  Vec2.randomPosition(radii[i]*0.05,radii[i]*0.05);
                speeds[i] = Random.randomFloat(1,10);
            }
        },

        update : function(){
            var gl = this._gl,
                glDraw = this._glDraw;

            var windowSize = this.getWindowSize();

            gl.clearColor(0.15,0.15,0.85,1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            glDraw.colorf(0,0,1,1);

            var positions = this._positions,
                velocities = this._velocities,
                radii = this._radii,
                speeds = this._speeds;
            var position, radius, velocity, speed;

            var i = -1, l = positions.length, j;

            while(++i < l){
                position = positions[i];
                velocity = velocities[i];

                if(Random.randomFloat() < 0.001){
                    velocity = velocities[i] = Vec2.randomPosition(0,1);
                }
                speed = speeds[i];
                position.addf(velocity.x * speed,
                              velocity.y * speed,
                              0);

                radius = radii[i];

                if(position.x > windowSize.x + radius){
                    position.x = -radius;
                }
                if(position.x < -radius){
                    position.x = windowSize.x + radius;
                }
                if(position.y > windowSize.y + radius){
                    position.y = -radius;
                }
                if(position.y < -radius){
                    position.y = windowSize.y + radius;
                }

                j = -1;
                var c = 0;
                while(++j < l){
                    if(position.distance(positions[j]) < 40){
                        glDraw.drawLine(position,positions[j]);
                        c++;
                    }
                }

            }
            glDraw.drawCircles(positions,3);
        },

        onWindowResize : function(){
            var gl = this._gl,
                glTrans = this._glTrans;

            this.setWindowSize(window.innerWidth,window.innerHeight);
            var windowSize = this.getWindowSize();

            gl.viewport(0,0,windowSize.x, windowSize.y);
            glTrans.setWindowMatrices(windowSize.x, windowSize.y);
        }
    }
);

