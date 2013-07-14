GLKit.GLUtil =
{

    drawGrid : function(gl,size,unit)
    {
        unit = unit || 1;

        var i  = -1,
            sh = size * 0.5 * unit;

        var ui;

        while(++i < size + 1)
        {
            ui = unit * i;

            gl.linef(-sh,0,-sh + ui,sh,0,-sh+ui);
            gl.linef(-sh+ui,0,-sh,-sh+ui,0,sh);
        }

    },

    drawGridCube : function(gl,size,unit)
    {
        unit = unit || 1;

        var sh  = size * 0.5 * unit,
            pih = Math.PI * 0.5;

        gl.pushMatrix();
        gl.translate3f(0,-sh,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,sh,0);
        gl.rotate3f(0,pih,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,-sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(0,0,sh);
        gl.rotate3f(pih,0,0);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

        gl.pushMatrix();
        gl.translate3f(-sh,0,0);
        gl.rotate3f(pih,0,pih);
        this.drawGrid(gl,size,unit);
        gl.popMatrix();

    },


    drawAxes : function(gl,unit)
    {
        var b = gl.getLighting();

        gl.lighting(false);

        gl.color3f(1,0,0);
        gl.linef(0,0,0,unit,0,0);
        gl.color3f(0,1,0);
        gl.linef(0,0,0,0,unit,0);
        gl.color3f(0,0,1);
        gl.linef(0,0,0,0,0,unit);

        gl.lighting(b);
    },


    octahedron : function(gl,size)
    {
        gl.pushMatrix();
        gl.scale3f(size,size,size);
        gl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron,gl.fillColorBuffer(gl._bColor, this.__bColorOctahedron),null, this.__bIndexOctahedron,gl._drawMode);
        gl.popMatrix();
    }


};

GLKit.GLUtil.__bVertexOctahedron = new Float32Array([-0.707,0,0, 0,0.707,0, 0,0,-0.707, 0,0,0.707, 0,-0.707,0, 0.707,0,0]);
GLKit.GLUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
GLKit.GLUtil.__bColorOctahedron  = new Float32Array(GLKit.GLUtil.__bVertexOctahedron.length / GLKit.Vec3.SIZE * GLKit.Color.SIZE);
GLKit.GLUtil.__bIndexOctahedron  = new Uint16Array([3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1]);

GLKit.GLUtil.__bVertexPyramid = new Float32Array([ 0.0,1.0,0.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0]);
GLKit.GLUtil.__bNormalPyramid = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
GLKit.GLUtil.__bColorPyramid  = new Float32Array(GLKit.GLUtil.__bVertexPyramid.length / GLKit.Vec3.SIZE * GLKit.Color.SIZE);
GLKit.GLUtil.__bIndexPyramid  = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,12,15,14]);
