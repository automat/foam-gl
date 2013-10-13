module.exports =
{
    PrefixShaderWeb : "#ifdef GL_ES\n" +
                      "#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
                      "  precision highp float;\n" +
                      "#else\n" +
                      "  precision mediump float;\n" +
                      "#endif\n" +
                      "#endif\n",

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