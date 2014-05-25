var CameraAbstract = require('./CameraAbstract'),
    Vec3 = require('../math/Vec3'),
    glu = require('./glu');


function CameraPersp() {
    CameraAbstract.call(this);

    this._aspectRatio = 0;
}

CameraPersp.prototype = Object.create(CameraAbstract.prototype);

CameraPersp.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatio = windowAspectRatio;

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

    this._updateOnB();
    this._modelViewMatrixUpdated = true;
};


CameraPersp.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated){
        return;
    }
    var aspectRatio = this._aspectRatio,
        fov = this._fov,
        near = this._near,
        far = this._far;

    var fov_2 = Math.tan(fov * Math.PI / 180 * 0.5);

    var frustumTop = this._frustumTop = near * fov_2,
        frustumRight = this._frustumRight = frustumTop * aspectRatio;
    this._frustumBottom = frustumTop * -1;
    this._frustumLeft = frustumRight * -1;

    var f = 1.0 / fov_2,
        nf = 1.0 / (near - far);

    var m = this.projectionMatrix.m;

    m[ 1] = m[ 2] = m[ 3] = m[ 4] = m[ 6] = m[ 7] = m[ 8] = m[ 9] = m[12] = m[13] = m[15] = 0;

    m[ 0] = f / aspectRatio;
    m[ 5] = f;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[14] = (2 * far * near) * nf;

    this._projectionMatrixUpdated = true;
};

CameraPersp.prototype.setAspectRatio = function (aspectRatio) {
    this._aspectRatio = aspectRatio;
    this._projectionMatrixUpdated = false;
};

module.exports = CameraPersp;


