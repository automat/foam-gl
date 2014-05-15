var Vec3 = require('../math/Vec3'),
    Matrix44 = require('../math/Matrix44'),
    ObjectUtil = require('../util/ObjectUtil');


function CameraAbstract() {
    this._eye = Vec3.create();
    this._target = Vec3.create();
    this._up = Vec3.AXIS_Y();

    this._fov = 0;
    this._near = 0;
    this._far = 0;

    this._modelViewMatrixUpdated = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = Matrix44.create();
    this.modelViewMatrix = Matrix44.create();

}


CameraAbstract.prototype.setTarget = function (v) {
    Vec3.set(this._target, v);
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setTarget3f = function (x, y, z) {
    Vec3.set3f(this._target, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.getTarget = function(v){
    if(ObjectUtil.isUndefined(v)){
        return Vec3.copy(this._target);
    }
    Vec3.set(v,this._target);
};

CameraAbstract.prototype.setEye = function (v) {
    Vec3.set(this._eye, v);
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setEye3f = function (x, y, z) {
    Vec3.set3f(this._eye, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.getEye = function(v){
    if(ObjectUtil.isUndefined(v)){
        return Vec3.copy(this._eye);
    }
    Vec3.set(v,this._eye);
};

CameraAbstract.prototype.lookAt = function(eye,target){
    Vec3.set(this._eye,eye);
    Vec3.set(this._target,target);
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setUp = function (v) {
    Vec3.set(this._up, v);
    this._modelViewMatrixUpdated = false;
};
CameraAbstract.prototype.setUp3f = function (x, y, z) {
    Vec3.set3f(this._up, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setNear = function (near) {
    this._near = near;
    this._projectionMatrixUpdated = false;
};

CameraAbstract.prototype.setFar = function (far) {
    this._far = far;
    this._projectionMatrixUpdated = false;
};

CameraAbstract.prototype.setFov = function (fov) {
    this._fov = fov;
    this._projectionMatrixUpdated = false;
};

CameraAbstract.prototype.updateMatrices = function () {
    this.updateModelViewMatrix();
    this.updateProjectionMatrix();
};


module.exports = CameraAbstract;
