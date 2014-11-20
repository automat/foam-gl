var Random = {
    /**
     * Generate a random float.
     * @param {Number} [min=0] - min
     * @param {Number} [max=1] - max
     * @returns {Number}
     */
    randomFloat: function () {
        var r;

        switch (arguments.length) {
            case 0:
                r = Math.random();
                break;
            case 1:
                r = Math.random() * arguments[0];
                break;
            case 2:
                r = arguments[0] + (arguments[1] - arguments[0]) * Math.random();
                break;
        }

        return r;
    },

    /**
     * Generate a random Integer
     * @param {Number} [min=0] - min
     * @param {Number} [max=1] - max
     * @returns {Number}
     */

    randomInteger: function () {
        var r;

        switch (arguments.length) {
            case 0:
                r = 0.5 + Math.random();
                break;
            case 1:
                r = 0.5 + Math.random() * arguments[0];
                break;
            case 2:
                r = arguments[0] + ( 1 + arguments[1] - arguments[0]) * Math.random();
                break;
        }

        return Math.floor(r);
    }
};

module.exports = Random;