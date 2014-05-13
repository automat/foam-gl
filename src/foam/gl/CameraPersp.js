var Vec3 = require('../math/Vec3'),
    Matrix44 = require('../math/Matrix44'),
    MatGL = require('./glu'),
    ObjectUtil = require('../util/ObjectUtil');


function CameraPersp() {
    this._eye = Vec3.create();
    this._target = Vec3.create();
    this._up = Vec3.AXIS_Y();

    this._fov = 0;
    this._near = 0;
    this._far = 0;

    this._aspectRatioLast = 0;

    this._modelViewMatrixUpdated = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = Matrix44.create();
    this.modelViewMatrix = Matrix44.create();
}

CameraPersp.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};

CameraPersp.prototype.setTarget = function (v) {
    Vec3.set(this._target, v);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setTarget3f = function (x, y, z) {
    Vec3.set3f(this._target, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.getTarget = function(v){
    if(ObjectUtil.isUndefined(v)){
        return Vec3.copy(this._target);
    }
    Vec3.set(v,this._target);
};

CameraPersp.prototype.setEye = function (v) {
    Vec3.set(this._eye, v);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setEye3f = function (x, y, z) {
    Vec3.set3f(this._eye, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.getEye = function(v){
    if(ObjectUtil.isUndefined(v)){
        return Vec3.copy(this._eye);
    }
    Vec3.set(v,this._eye);
};

CameraPersp.prototype.lookAt = function(eye,target){
    Vec3.set(this._eye,eye);
    Vec3.set(this._target,target);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setUp = function (v) {
    Vec3.set(this._up, v);
    this._modelViewMatrixUpdated = false;
};
CameraPersp.prototype.setUp3f = function (x, y, z) {
    Vec3.set3f(this._up, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setNear = function (near) {
    this._near = near;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.setFar = function (far) {
    this._far = far;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.setFov = function (fov) {
    this._fov = fov;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.setAspectRatio = function (aspectRatio) {
    this._aspectRatioLast = aspectRatio;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated){
        return;
    }
    MatGL.lookAt(this.modelViewMatrix, this._eye, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};
CameraPersp.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated){
        return;
    }
    MatGL.perspective(this.projectionMatrix, this._fov, this._aspectRatioLast, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

CameraPersp.prototype.updateMatrices = function () {
    this.updateModelViewMatrix();
    this.updateProjectionMatrix();
};

CameraPersp.prototype.toString = function () {
    return '{position= ' + Vec3.toString(this.position) +
            ', target= ' + Vec3.toString(this._target) +
        ', up= ' + Vec3.toString(this._up) + '}'
};

module.exports = CameraPersp;


