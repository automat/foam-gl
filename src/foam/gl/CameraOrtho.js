var CameraAbstract = require('./CameraAbstract'),
    glu = require('./glu');

function CameraOrtho() {
    CameraAbstract.call(this);

    this._left = this._leftInit = null;
    this._right = this._rightInit = null;
    this._top = this._topInit = null;
    this._bottom = this._bottomInit = null;
}

CameraOrtho.prototype = Object.create(CameraAbstract.prototype);

CameraOrtho.prototype.setOrtho = function (left, right, bottom, top, near, far) {
    this._left = this._leftInit = left;
    this._right = this._rightInit = right;
    this._bottom = this._bottomInit = bottom;
    this._top = this._topInit = top;
    this._near = near;
    this._far = far;
    this._projectionMatrixUpdated = false;
    this.updateProjectionMatrix();
};

CameraOrtho.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated) {
        return;
    }
    glu.lookAt(this.modelViewMatrix, this._eye, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};

CameraOrtho.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated) {
        return;
    }
    glu.ortho(this.projectionMatrix, this._left, this._right, this._bottom, this._top, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

CameraOrtho.prototype.setZoom = function (zoom) {
    this._left = this._leftInit * zoom;
    this._right = this._rightInit * zoom;
    this._bottom = this._bottomInit * zoom;
    this._top = this._topInit * zoom;
    this._projectionMatrixUpdated = false;
    this.updateProjectionMatrix();
};

module.exports = CameraOrtho;
