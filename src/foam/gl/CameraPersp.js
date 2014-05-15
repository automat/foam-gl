var CameraAbstract = require('./CameraAbstract'),
    glu = require('./glu');


function CameraPersp() {
    CameraAbstract.call(this);

    this._aspectRatioLast = 0;
}

CameraPersp.prototype = Object.create(CameraAbstract.prototype);

CameraPersp.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};



CameraPersp.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated){
        return;
    }
    glu.lookAt(this.modelViewMatrix, this._eye, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};
CameraPersp.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated){
        return;
    }
    glu.perspective(this.projectionMatrix, this._fov, this._aspectRatioLast, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

CameraPersp.prototype.toString = function () {
    return '{position= ' + Vec3.toString(this.position) +
            ', target= ' + Vec3.toString(this._target) +
        ', up= ' + Vec3.toString(this._up) + '}'
};


CameraPersp.prototype.setAspectRatio = function (aspectRatio) {
    this._aspectRatioLast = aspectRatio;
    this._projectionMatrixUpdated = false;
};

module.exports = CameraPersp;


