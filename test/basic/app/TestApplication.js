/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function TestApplication(parentDomElementId)
{
    GLKApplication.apply(this,arguments);

    this.setWindowSize(window.innerWidth,window.innerHeight);
    this.setFPS(60.0);

    this.camera.setPerspective(45.0,this.getAspectRatioWindow(),0.1,100.0);


}

TestApplication.prototype = Object.create(GLKApplication.prototype);


TestApplication.prototype.draw = function()
{
    var gl = this.gl;

    gl.clear3f(1,1,1);
    gl.loadIdentity();


    var camera = this.camera;

    var t = this.getSecondsElapsed();

    var pf = sin(t);

    camera.setPosition3f(1,1,1);
    camera.setTarget3f(0,0,0);
    camera.updateMatrices();

    gl._modelViewMatrix  = camera._modelViewMatrix;
    gl._projectionMatrix = camera._projectionMatrix;


    document.getElementById('output1').value=glkMat44.isFloatEqual(gl._modelViewMatrix,camera._modelViewMatrix);
    document.getElementById('output2').value=glkMat44.toString(gl._modelViewMatrix);

    gl.color4f(0,0,0,1);

    var s = 0.5;

    gl.pushMatrix();
    gl.rotateY(t);
    //gl.rotateXYZ(0,0,);
    gl.setMaterial(gl.MATERIAL_WIREFRAME);
    gl.setRectMode(gl.CENTER);

    /*
    gl.setMaterial(gl.MATERIAL_WIREFRAME);
    gl.drawArrays(new Float32Array([-s,0,-s,
                                     s,0,-s,
                                     s,0, s,
                                    -s,0, s]),
                  null,
                  new Float32Array([0,0,0,1,
                                    0,0,0,1,
                                    0,0,0,1,
                                    0,0,0,1]),
                  null,gl.LINE_LOOP,0,4);
                  */
    gl.popMatrix();






};

TestApplication.prototype.onWindowResize = function()
{
    this.camera.setPerspective(45.0,this.getAspectRatioWindow(),0.1,100.0);
};
