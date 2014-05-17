var CameraAbstract = require('./CameraAbstract'),
    glu = require('./glu');


function CameraOrtho() {
    CameraAbstract.call(this);

    this._left = null;
    this._right = null;
    this._top = null;
    this._bottom = null;

}

CameraOrtho.prototype = Object.create(CameraAbstract.prototype);

CameraOrtho.prototype.setOrtho = function(left, right, bottom, top, near, far){
    this._left = left;
    this._right = right;
    this._bottom = bottom;
    this._top = top;
    this._near = near;
    this._far = far;
    this._projectionMatrixUpdated = false;
    this.updateProjectionMatrix();
};


CameraOrtho.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated){
        return;
    }
    glu.lookAt(this.modelViewMatrix, this._eye, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};
CameraOrtho.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated){
        return;
    }
    glu.ortho(this.projectionMatrix,this._left,this._right,this._bottom,this._top,this._near,this._far);
    this._projectionMatrixUpdated = true;
};


module.exports = CameraOrtho;
