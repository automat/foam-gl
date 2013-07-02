GLKit.CameraBasic = function()
{
    this._position = GLKit.Vec3.make();
    this._target   = GLKit.Vec3.make();
    this._up       = GLKit.Vec3.AXIS_Y;

    this._fov  = 0;
    this._near = 0;
    this._far  = 0;

    this._aspectRatioLast = 0;

    this._projectionMatrix = GLKit.Mat44.make();
    this._modelViewMatrix  = GLKit.Mat44.make();
};

GLKit.CameraBasic.prototype.setPerspective = function(foc,windowAspectRatio,near,far)
{
    this._fov  = fov;
    this._near = near;
    this._far  = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updatePerspective();
};

GLKit.CameraBasic.prototype.setTarget         = function(v)    {GLKit.Vec3.set(this._target,v);};
GLKit.CameraBasic.prototype.setTarget3f       = function(x,y,z){GLKit.Vec3.set3f(this._target,x,y,z);};
GLKit.CameraBasic.prototype.setPosition       = function(v)    {GLKit.Vec3.set(this._position,v);};
GLKit.CameraBasic.prototype.setPosition3f     = function(x,y,z){GLKit.Vec3.set3f(this._position,x,y,z);};
GLKit.CameraBasic.prototype.setUp             = function(v)    {GLKit.Vec3.set(this._up,v);};
GLKit.CameraBasic.prototype.setUp3f           = function(x,y,z){GLKit.Vec3.set3f(this._up,x,y,z);};
GLKit.CameraBasic.prototype.setNear           = function(near){this._near = near;};
GLKit.CameraBasic.prototype.setFar            = function(far) {this._far  = far;};
GLKit.CameraBasic.prototype.setFov            = function(fov) {this._fov  = fov;};
GLKit.CameraBasic.prototype.setAspectRatio    = function(aspectRatio){this._aspectRatioLast = aspectRatio;};

GLKit.CameraBasic.prototype.updateMatrices    = function(){GLKit.MatGL.lookAt(this._modelViewMatrix,this._position,this._target,this._up);};
GLKit.CameraBasic.prototype.updatePerspective = function(){GLKit.MatGL.perspective(this._projectionMatrix,this._fov,this._aspectRatioLast,this._near,this._far);};

GLKit.CameraBasic.prototype.getProjectionMatrix = function(){return this._projectionMatrix;};
GLKit.CameraBasic.prototype.getModelViewMatrix  = function(){return this._modelViewMatrix;};

GLKit.CameraBasic.prototype.toString = function(){return '{position= ' + GLKit.Vec3.toString(this._position) +
                                                          ', target= ' + GLKit.Vec3.toString(this._target) +
                                                          ', up= '     + GLKit.Vec3.toString(this._up) + '}'};


