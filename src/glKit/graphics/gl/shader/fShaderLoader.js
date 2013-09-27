module.exports =
{
    PrefixShaderWeb : 'precision mediump float;',

    loadShaderFromString : function(gl,sourceString,type)
    {
        var shader = gl.createShader(type);

        gl.shaderSource(shader,sourceString);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
        {
            throw gl.getShaderInfoLog(shader);
        }

        return shader;
    }


};