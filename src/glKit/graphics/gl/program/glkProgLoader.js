GLKit.ProgLoader =
{
    loadProgram : function(gl,vertexShader,fragmentShader)
    {
        var program = gl.createProgram();

        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program,gl.LINK_STATUS))
        {
            console.log("Could not link program.");
            gl.deleteProgram(program);
            program = null;
        }

        return program;
    }
};