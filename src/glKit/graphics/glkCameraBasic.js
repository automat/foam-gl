GLKit.CameraBasic = function()
{
    this.position = GLKit.Vec3.make();
    this._target   = GLKit.Vec3.make();
    this._up       = GLKit.Vec3.AXIS_Y();

    this._fov  = 0;
    this._near = 0;
    this._far  = 0;

    this._aspectRatioLast = 0;

    this._modelViewMatrixUpdated  = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = GLKit.Mat44.make();
    this.modelViewMatrix  = GLKit.Mat44.make();
};

GLKit.CameraBasic.prototype.setPerspective = function(fov,windowAspectRatio,near,far)
{
    this._fov  = fov;
    this._near = near;
    this._far  = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};

GLKit.CameraBasic.prototype.setTarget         = function(v)    {GLKit.Vec3.set(this._target,v);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setTarget3f       = function(x,y,z){GLKit.Vec3.set3f(this._target,x,y,z);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setPosition       = function(v)    {GLKit.Vec3.set(this.position,v);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setPosition3f     = function(x,y,z){GLKit.Vec3.set3f(this.position,x,y,z);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setUp             = function(v)    {GLKit.Vec3.set(this._up,v);this._modelViewMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setUp3f           = function(x,y,z){GLKit.Vec3.set3f(this._up,x,y,z);this._modelViewMatrixUpdated = false;};

GLKit.CameraBasic.prototype.setNear           = function(near)       {this._near = near;this._projectionMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setFar            = function(far)        {this._far  = far;this._projectionMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setFov            = function(fov)        {this._fov  = fov;this._projectionMatrixUpdated = false;};
GLKit.CameraBasic.prototype.setAspectRatio    = function(aspectRatio){this._aspectRatioLast = aspectRatio;this._projectionMatrixUpdated = false;};

GLKit.CameraBasic.prototype.getScreenCoord3f  = function(x,y,z){};
GLKit.CameraBasic.prototype.getScreenCoord    = function(v){return this.getScreenCoord3f(v[0],v[1],v[2]);};

GLKit.CameraBasic.prototype.updateModelViewMatrix   = function(){if(this._modelViewMatrixUpdated)return; GLKit.MatGL.lookAt(this.modelViewMatrix,this.position,this._target,this._up); this._modelViewMatrixUpdated = true;};
GLKit.CameraBasic.prototype.updateProjectionMatrix = function(){if(this._projectionMatrixUpdated)return;GLKit.MatGL.perspective(this.projectionMatrix,this._fov,this._aspectRatioLast,this._near,this._far);this._projectionMatrixUpdated = true;};

GLKit.CameraBasic.prototype.updateMatrices = function(){this.updateModelViewMatrix();this.updateProjectionMatrix();};

GLKit.CameraBasic.prototype.toString = function(){return '{position= ' + GLKit.Vec3.toString(this.position) +
                                                          ', target= ' + GLKit.Vec3.toString(this._target) +
                                                          ', up= '     + GLKit.Vec3.toString(this._up) + '}'};


