GLKit.ShaderLoader =
{
    loadShaderFromString : function(gl,sourceString,type)
    {
        var shader = gl.createShader(type);

        gl.shaderSource(shader,sourceString);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
        {
            console.log("Could not compile shader.");
            gl.deleteShader(shader);
            shader = null;
        }

        return shader;
    }
};