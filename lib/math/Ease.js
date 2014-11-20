var Ease = {
    stepSmooth: function (n) {
        return n * n * (3 - 2 * n);
    },
    stepSmoothSquared: function (n) {
        return this.stepSmooth(n) * this.stepSmooth(n);
    },
    stepSmoothInvSquared: function (n) {
        return 1 - (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n));
    },
    stepSmoothCubed: function (n) {
        return this.stepSmooth(n) * this.stepSmooth(n) * this.stepSmooth(n) * this.stepSmooth(n);
    },
    stepSmoothInvCubed: function (n) {
        return 1 - (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n));
    },
    stepSquared: function (n) {
        return n * n;
    },
    stepInvSquared: function (n) {
        return 1 - (1 - n) * (1 - n);
    },
    stepCubed: function (n) {
        return n * n * n * n;
    },
    stepInvCubed: function (n) {
        return 1 - (1 - n) * (1 - n) * (1 - n) * (1 - n);
    }
};

module.exports = Ease;