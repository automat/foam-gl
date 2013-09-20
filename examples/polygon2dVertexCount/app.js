(function()
{


    /*---------------------------------------------------------------------------------------------------------*/

    function App(element)
    {
        GLKit.Application.apply(this,arguments);

        this._zoom = 3;


        this.setSize(window.innerWidth,window.innerHeight);
        this.setTargetFPS(60);

        var Polygon2dUtil = GLKit.Polygon2DUtil;
        var temp;


        var len = 50;
        var i   = -1;
        var polygon2d = new Array(len * 2);
        while(++i < len)
        {
            polygon2d[i*2  ] = Math.cos(Math.PI * 2 * i / len);
            polygon2d[i*2+1] = Math.sin(Math.PI * 2 * i / len);
        }

        //var polygon2d = [0,0.15,0.5,0.5,-0.9,0.5,-0.5,0];
        this._polygon2d   = Polygon2dUtil.makePolygon3dFloat32(polygon2d);

        temp = Polygon2dUtil.makeVertexCountIncreased(polygon2d,10);
        this._polygon2dCountIncreased = Polygon2dUtil.makePolygon3dFloat32(temp);

        temp = Polygon2dUtil.makeVertexCountFitted(polygon2d,20);
        this._polygon2dCountFitted0 = Polygon2dUtil.makePolygon3dFloat32(temp);

        polygon2d = [0,0.15,0.5,0.5,-0.9,0.5,-0.5,0];
        temp = Polygon2dUtil.makeVertexCountFitted(polygon2d,20);
        this._polygon2dCountFitted1 = Polygon2dUtil.makePolygon3dFloat32(temp);






    }

    App.prototype = Object.create(GLKit.Application.prototype);

    App.prototype.onWindowResize = function(){this.setSize(window.innerWidth,window.innerHeight);};

    App.prototype.update = function()
    {
        var gl        = this.gl,
            cam       = this.camera,
            time      = this.getSecondsElapsed(),
            timeDelta = this.getTimeDelta();

        var zoom = this._zoom = GLKit.Math.lerp(this._zoom, 3 + this.getMouseWheelDelta() * 0.25, timeDelta * 0.0025);


        gl.clear3f(0.1,0.1,0.1);
        gl.loadIdentity();

        gl.drawMode(gl.LINES);

        var camRotX,camRotY;

        if(this.isMouseDown())
        {
            camRotX = ( -1 + this.mouse.getX() / this.glWindow.getWidth() * 2.0 ) * Math.PI;
            camRotY = ( -1 + this.mouse.getY() / this.glWindow.getHeight() * 2.0) * Math.PI * 0.5;

            GLKit.Vec3.lerp3f(cam.position,
                              Math.cos(camRotX) * zoom,
                              Math.sin(camRotY) * zoom,
                              Math.sin(camRotX) * zoom,
                              timeDelta * 0.25);
        }
        else
        {


            cam.setPosition3f(0.0,
                              zoom,
                              0.001);

        }

        cam.setTarget3f(0,0,0);
        cam.updateMatrices();

        gl.drawMode(gl.LINE_LOOP);

        this.drawSystem();

        /*---------------------------------------------------------------------------------------------------------*/

        gl.color1f(0.25);
        //this.drawPolygon(this._polygon2d);

        gl.color1f(1);
        //this.drawPolygon(this._polygon2dCountIncreased);

        gl.color1f(1);
        this.drawPolygon(this._polygon2dCountFitted0);
        this.drawPolygon(this._polygon2dCountFitted1);



        /*---------------------------------------------------------------------------------------------------------*/
    };

    App.prototype.drawPolygon = function(polygon)
    {
        var gl = this.gl;
        gl.drawMode(gl.LINE_LOOP);
        gl.linev(polygon);
        gl.pointSize(5);
        gl.drawMode(gl.POINTS);
        gl.points(polygon);

        gl.pointSize(1);


    }

    /*---------------------------------------------------------------------------------------------------------*/

    App.prototype.drawSystem = function()
    {
        var gl = this.gl;

        gl.color1f(0.15);
        GLKit.GLUtil.drawGridCube(gl,8,1);

        gl.color1f(0.25);
        gl.pushMatrix();
        {
            gl.translate3f(0,-0.01,0);
            GLKit.GLUtil.drawGrid(gl,8,1);
        }
        gl.popMatrix();

        GLKit.GLUtil.drawAxes(gl,4);


    };

    /*---------------------------------------------------------------------------------------------------------*/

    window.addEventListener('load',function()
    {
        var app = new App(document.getElementById('canvasGLContainer'));
    });

    /*---------------------------------------------------------------------------------------------------------*/
})();