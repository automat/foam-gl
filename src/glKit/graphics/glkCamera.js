/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function GLKCameraBasic()
{
    this._position = glkVec3.make();
    this._target   = glkVec3.make();
    this._up       = glkVec3.AXIS_Y;

    this._fov      = 0;
    this._near     = 0;
    this._far      = 0;

    this._aspectRatioLast = 0;

    this._projectionMatrix = glkMat44.make();
    this._modelViewMatrix  = glkMat44.make();
}

GLKCameraBasic.prototype =
{
    setPerspective : function(fov,windowAspectRatio,near,far)
    {
        this._fov  = fov;
        this._near = near;
        this._far  = far;

        this._aspectRatioLast = windowAspectRatio;

        this.updatePerspective();
    },

    setOrtho : function()
    {

    },

    setTarget     : function(target)  {glkVec3.set(  this._target,target);},
    setTarget3f   : function(x,y,z)   {glkVec3.set3f(this._target,x,y,z);},

    setPosition   : function(position){glkVec3.set(  this._position,position);},
    setPosition3f : function(x,y,z)   {glkVec3.set3f(this._position,x,y,z);},

    setUp         : function(up)      {glkVec3.set(  this._up,up);},
    setUp3f       : function(x,y,z)   {glkVec3.set3f(this._up,x,y,z);},

    setNear        : function(near){this._near = near;},
    setFar         : function(far) {this._far = far;},
    setFov         : function(fov) {this._fov = fov;},
    setAspectRatio : function(aspectRatio){this._aspectRatioLast = aspectRatio;},


    updateMatrices : function()
    {
        glkMatGL.lookAt(this._modelViewMatrix,this._position,this._target,this._up);
    },

    updatePerspective : function()
    {
        glkMatGL.perspective(this._projectionMatrix,
                             this._fov,
                             this._aspectRatioLast,
                             this._near,
                             this._far);
    },





    getProjectionMatrix : function(){return this._projectionMatrix;},
    getModelViewMatrix  : function(){return this._modelViewMatrix;},

    toString : function()
    {
        return '{position= ' + glkVec3.toString(this._position) +
                ', target= ' + glkVec3.toString(this._target) +
                ', up= '     + glkVec3.toString(this._up) + '}';
    }


};