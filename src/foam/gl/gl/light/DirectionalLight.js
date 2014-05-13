var Vec3 = require('../../../math/Vec3'),
    Light = require('./Light');

function DirectionalLight(id) {
    Light.apply(this, arguments);
}

DirectionalLight.prototype = Object.create(Light.prototype);

DirectionalLight.prototype.setDirection = function (v) {
    Vec3.set(this.direction, v);
};

DirectionalLight.prototype.setDirection3f = function (x, y, z) {
    Vec3.set3f(this.direction, x, y, z);
};

DirectionalLight.prototype.lookAt = function (position, target) {
    this.setEye(position);
    this.setDirection(Vec3.normalize(Vec3.subbed(target, position)));
};

module.exports = DirectionalLight;