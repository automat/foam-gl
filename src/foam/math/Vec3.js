var Vec2 = require('./Vec2');

var Vec3 = {
    SIZE: 3,
    ZERO: function () {
        return new Float32Array([0, 0, 0])
    },
    ONE: function () {
        return new Float32Array([1, 1, 1]);
    },

    AXIS_X: function () {
        return new Float32Array([1, 0, 0])
    },
    AXIS_Y: function () {
        return new Float32Array([0, 1, 0])
    },
    AXIS_Z: function () {
        return new Float32Array([0, 0, 1])
    },

    create: function (x, y, z) {
        return new Float32Array([
                typeof x !== 'undefined' ? x : 0.0,
                typeof y !== 'undefined' ? y : 0.0,
                typeof z !== 'undefined' ? z : 0.0  ]);
    },

    set: function (v0, v1) {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];

        return v0;
    },

    set3f: function (v, x, y, z) {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    copy: function (v) {
        return new Float32Array(v);
    },

    add: function (v0, v1) {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];

        return v0;
    },

    sub: function (v0, v1) {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];

        return v0;
    },

    scale: function (v, n) {
        v[0] *= n;
        v[1] *= n;
        v[2] *= n;

        return v;
    },

    dot: function (v0, v1) {
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    },

    cross: function (v0, v1, vo) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        vo = vo || this.create();

        vo[0] = y0 * z1 - y1 * z0;
        vo[1] = z0 * x1 - z1 * x0;
        vo[2] = x0 * y1 - x1 * y0;


        return vo;
    },

    lerp: function (v0, v1, f) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2];

        v0[0] = x0 * (1.0 - f) + v1[0] * f;
        v0[1] = y0 * (1.0 - f) + v1[1] * f;
        v0[2] = z0 * (1.0 - f) + v1[2] * f;

        return v0;
    },

    lerped: function (v0, v1, f, vo) {
        vo = vo || vo.create();

        vo[0] = v0[0];
        vo[1] = v0[1];
        vo[2] = v0[2];

        return this.lerp(vo, v1, f);
    },


    lerp3f: function (v, x, y, z, f) {
        var vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = vx * (1.0 - f) + x * f;
        v[1] = vy * (1.0 - f) + y * f;
        v[2] = vz * (1.0 - f) + z * f;
    },

    lerped3f: function (v, x, y, z, f, vo) {
        vo = vo || this.create();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.lerp3f(vo, x, y, z, f);
    },


    length: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    lengthSq: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return x * x + y * y + z * z;
    },

    safeNormalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var d = Math.sqrt(x * x + y * y + z * z);
        d = d || 1;

        var l = 1 / d;

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    normalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var l = 1 / Math.sqrt(x * x + y * y + z * z);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    distance: function (v0, v1) {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    distance3f: function (v, x, y, z) {
        return Math.sqrt(v[0] * x + v[1] * y + v[2] * z);
    },

    distanceSq: function (v0, v1) {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x * x + y * y + z * z;
    },

    distanceSq3f: function (v, x, y, z) {
        return v[0] * x + v[1] * y + v[2] * z;
    },

    limit: function (v, n) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x * x + y * y + z * z,
            lsq = n * n;

        if ((dsq > lsq) && lsq > 0) {
            var nd = n / Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert: function (v) {
        v[0] *= -1;
        v[1] *= -1;
        v[2] *= -1;

        return v;
    },

    added: function (v0, v1, vo) {
        vo = vo || this.create();

        vo[0] = v0[0] + v1[0];
        vo[1] = v0[1] + v1[1];
        vo[2] = v0[2] + v1[2];

        return vo;
    },

    subbed: function (v0, v1, vo) {
        vo = vo || this.create();

        vo[0] = v0[0] - v1[0];
        vo[1] = v0[1] - v1[1];
        vo[2] = v0[2] - v1[2];

        return vo;
    },

    scaled: function (v, n, vo) {
        vo = vo || this.create();

        vo[0] = v[0] * n;
        vo[1] = v[1] * n;
        vo[2] = v[2] * n;

        return vo;
    },

    normalized: function (v, vo) {
        vo = vo || this.create();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.normalize(vo);
    },

    safeNormalized: function (v, vo) {
        vo = vo || this.create();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.safeNormalize(vo);
    },

    random: function (unitX, unitY, unitZ) {
        unitX = typeof unitX !== 'undefined' ? unitX : 1.0;
        unitY = typeof unitY !== 'undefined' ? unitY : 1.0;
        unitZ = typeof unitZ !== 'undefined' ? unitZ : 1.0;

        return this.create((-0.5 + Math.random()) * 2 * unitX,
                (-0.5 + Math.random()) * 2 * unitY,
                (-0.5 + Math.random()) * 2 * unitZ);
    },

    toString: function (v) {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    },

    xy: function (v) {
        return Vec2.create(v[0], v[1]);
    },

    xz: function (v) {
        return Vec2.create(v[0], v[2]);
    }

};

module.exports = Vec3;



