var CameraAbstract = require('./CameraAbstract'),
    glu = require('./glu');

function CameraOrtho() {
    CameraAbstract.call(this);

    this._frustumLeft = this._leftInit = null;
    this._frustumRight = this._rightInit = null;
    this._frustumBottom = this._bottomInit = null;
    this._frustumTop = this._topInit = null;
}

CameraOrtho.prototype = Object.create(CameraAbstract.prototype);

CameraOrtho.prototype.setOrtho = function (left, right, bottom, top, near, far) {
    this._frustumLeft = this._leftInit = left;
    this._frustumRight = this._rightInit = right;
    this._frustumBottom = this._bottomInit = bottom;
    this._frustumTop = this._topInit = top;
    this._near = near;
    this._far = far;
    this._projectionMatrixUpdated = false;
    this.updateProjectionMatrix();
};

CameraOrtho.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated) {
        return;
    }
    var eye = this._eye,
        target = this._target,
        up = this._up;

    glu.lookAt(this.modelViewMatrix, eye.x, eye.y, eye.z, target.x, target.y, target.z, up.x, up.y, up.z);
    this._modelViewMatrixUpdated = true;
};

CameraOrtho.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated) {
        return;
    }
    glu.ortho(this.projectionMatrix, this._frustumLeft, this._frustumRight, this._frustumBottom, this._frustumTop, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

CameraOrtho.prototype.setZoom = function (zoom) {
    this._frustumLeft = this._leftInit * zoom;
    this._frustumRight = this._rightInit * zoom;
    this._frustumBottom = this._bottomInit * zoom;
    this._frustumTop = this._topInit * zoom;
    this._projectionMatrixUpdated = false;
    this.updateProjectionMatrix();
};

module.exports = CameraOrtho;
