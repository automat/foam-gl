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
    }

};