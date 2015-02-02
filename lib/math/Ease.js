var Ease = {
    stepSmooth: function (a) {
        return a * a * (3 - 2 * a);
    },
    stepSmoothSquared: function (a) {
        a = this.stepSmooth(a);
        return a * a;
    },
    stepSmoothInvSquared: function (a) {
        a = 1.0 - this.stepSmooth(a);
        return 1 - a * a;
    },
    stepSmoothCubed: function (a) {
        a = this.stepSmooth(a);
        return a * a * a * a;
    },
    stepSmoothInvCubed: function (a) {
        a = 1.0 - this.stepSmooth(a);
        return 1 - a * a * a * a;
    },
    stepSquared: function (a) {
        return a * a;
    },
    stepInvSquared: function (a) {
        a = 1.0 - a;
        return 1 - a * a;
    },
    stepCubed: function (a) {
        return a * a * a * a;
    },
    stepInvCubed: function (a) {
        a = 1.0 - a;
        return 1 - a * a * a * a;
    }
};

module.exports = Ease;