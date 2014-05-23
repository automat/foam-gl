var Vec3 = require('../math/Vec3'),
    Matrix44 = require('../math/Matrix44'),
    ObjectUtil = require('../util/ObjectUtil');



function CameraAbstract() {
    this._eye = new Vec3();
    this._target = new Vec3();
    this._up = Vec3.yAxis();

    this._fov = 0;
    this._near = 0;
    this._far = 0;

    this._direction = new Vec3();


    this._frustumLeft = this._frustumRight = this._frustumBottom = this._frustumTop = 0;

    this._modelViewMatrixUpdated = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = new Matrix44();
    this.modelViewMatrix = new Matrix44();
}


CameraAbstract.prototype.setTarget = function (v) {
    Vec3.set(this._target, v);
    this._updateDirection();
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setTarget3f = function (x, y, z) {
    Vec3.set3f(this._target, x, y, z);
    this._updateDirection();
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.getTarget = function(v){
    return this._target.copy(v);
};

CameraAbstract.prototype.setEye = function (v) {
    this._eye.set(v);
    this._updateDirection();
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setEye3f = function (x, y, z) {
    this._eye.set3f(x,y,z);
    this._updateDirection();
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.getEye = function(v){
    return this._eye.copy(v);
};

CameraAbstract.prototype.lookAt = function(eye,target){
    this._eye.set(eye);
    this._target.set(target);
    this._updateDirection();
    this._modelViewMatrixUpdated = false;
};

CameraAbstract.prototype.setUp = function (v) {
    this._up.set(v);
    this._modelViewMatrixUpdated = false;
};
CameraAbstract.prototype.setUp3f = function (x, y, z) {
    this._up.set3f(x,y,z);
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

CameraAbstract.prototype.getFrustum = function(frustum){
    frustum = frustum || new Array(6);

    frustum[0] = this._frustumLeft;
    frustum[1] = this._frustumTop;
    frustum[2] = this._frustumRight;
    frustum[3] = this._frustumBottom;
    frustum[4] = this._near;
    frustum[5] = this._far;
};

CameraAbstract.prototype._updateDirection = function(){
    this._target.subbed(this._eye, this._direction).normalize();
};

CameraAbstract.prototype.getDirection = function(v){
    return this._direction.copy(v);
};


module.exports = CameraAbstract;
