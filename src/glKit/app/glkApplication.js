/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */

function GLKApplication()
{
    this.window = null;
    this.gl     = null;
}

GLKApplication.prototype =
{
    setWindow : function(parentDomElementId,width,height)
    {
        this.window = new GLKWindow(parentDomElementId,width,height);
        //this.gl     = new GLKGL(this.window.getGL(),);
    },

    //override
    draw : function(){},


    loadShader : function(source,type)
    {
        var gl = this.gl;
        var shader = gl.createShader(type);

        gl.shaderSource(shader,source);
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