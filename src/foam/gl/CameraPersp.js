var CameraAbstract = require('./CameraAbstract'),
    App = require('../app/App.js'),
    Vec3 = require('../math/Vec3'),
    glu = require('./glu');

var DEFAULT_FOV  = 60.0,
    DEFAULT_NEAR = 0.0001,
    DEFAULT_FAR  = 10.0;

function CameraPersp() {
    CameraAbstract.call(this);

    this.setPerspective(DEFAULT_FOV,
                        App.getInstance().getWindowAspectRatio(),
                        DEFAULT_NEAR,
                        DEFAULT_FAR);
    this.setEye(Vec3.one());
    this.updateModelViewMatrix();
}

CameraPersp.prototype = Object.create(CameraAbstract.prototype);
CameraPersp.prototype.constructor = CameraPersp;

CameraPersp.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatio = windowAspectRatio;

    this._projectionMatrixUpdated = false;
    this.updateProjectionMatrix();
};

CameraPersp.prototype.setDistance = function(dist){
    this._eye.set(this._target.subbed(this._eye).normalize().scale(dist));
    this._modelViewMatrixUpdated = false;
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


