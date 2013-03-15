/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKCameraBasic(gl)
{
    this._gl = gl;

    this._position = glkVec3.make();
    this._target   = glkVec3.make();
    this._up       = glkVec3.AXIS_Y;

    this._projectionMatrix = glkMat44.make();
    this._modelViewMatrix  = glkMat44.make();

}

GLKCameraBasic.prototype =
{
    setPerspective : function(fov,windowAspectRatio,near,far)
    {
        glkMatGL.perspective(this._projectionMatrix,fov,windowAspectRatio,near,far);
    },

    lookAt : function(target)
    {
        glkVec3.set(this._target,target);
    },

    setPosition : function(position)
    {
        glkVec3.set(this._position,position);
    },

    setUp : function(up)
    {
        glkVec3.set(this._up,up);
    },

    _updateModelViewMatrix : function()
    {
        glkMatGL.lookAt(this._modelViewMatrix,this._position,this._target,this._up);
    },

    getProjectionMatrix : function()
    {
        return this._projectionMatrix;
    },

    getModelViewMatrix : function()
    {
        return this._modelViewMatrix;
    }


};