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
    var eye = this._eye,
        target = this._target,
        up = this._up;

    glu.lookAt(this.modelViewMatrix.m, eye.x, eye.y, eye.z, target.x, target.y, target.z, up.x, up.y, up.z);
    this._modelViewMatrixUpdated = true;
};
CameraPersp.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated){
        return;
    }
    glu.perspective(this.projectionMatrix.m, this._fov, this._aspectRatioLast, this._near, this._far);
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


