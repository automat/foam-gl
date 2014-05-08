var Vec3 = require('../math/Vec3'),
    Matrix44 = require('../math/Matrix44'),
    MatGL = require('./gl/fMatGL');


function Camera() {
    this.position = Vec3.create();
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

Camera.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};


Camera.prototype.setTarget = function (v) {
    Vec3.set(this._target, v);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setTarget3f = function (x, y, z) {
    Vec3.set3f(this._target, x, y, z);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setPosition = function (v) {
    Vec3.set(this.position, v);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setPosition3f = function (x, y, z) {
    Vec3.set3f(this.position, x, y, z);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setUp = function (v) {
    Vec3.set(this._up, v);
    this._modelViewMatrixUpdated = false;
};
Camera.prototype.setUp3f = function (x, y, z) {
    Vec3.set3f(this._up, x, y, z);
    this._modelViewMatrixUpdated = false;
};

Camera.prototype.setNear = function (near) {
    this._near = near;
    this._projectionMatrixUpdated = false;
};
Camera.prototype.setFar = function (far) {
    this._far = far;
    this._projectionMatrixUpdated = false;
};
Camera.prototype.setFov = function (fov) {
    this._fov = fov;
    this._projectionMatrixUpdated = false;
};
Camera.prototype.setAspectRatio = function (aspectRatio) {
    this._aspectRatioLast = aspectRatio;
    this._projectionMatrixUpdated = false;
};

Camera.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated)return;
    MatGL.lookAt(this.modelViewMatrix, this.position, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};
Camera.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated)return;
    MatGL.perspective(this.projectionMatrix, this._fov, this._aspectRatioLast, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

Camera.prototype.updateMatrices = function () {
    this.updateModelViewMatrix();
    this.updateProjectionMatrix();
};

Camera.prototype.toString = function () {
    return '{position= ' + Vec3.toString(this.position) +
        ', target= ' + Vec3.toString(this._target) +
        ', up= ' + Vec3.toString(this._up) + '}'
};

module.exports = Camera;


