var ObjectUtil = require('./ObjectUtil');

var temp0 = new Array(4);
var _255  = 1.0 / 255.0;

function hex2rgb(hex,out) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if(!result){
        return null;
    }

    out[0] = parseInt(result[1], 16);
    out[1] = parseInt(result[2], 16);
    out[2] = parseInt(result[3], 16);
    out[3] = 1.0;
    return out;
};

/**
 * Represents color information in rgba format.
 * @param {Number} [r=0] - Red value (floating point data)
 * @param {Number} [g=0] - Green value (floating point data)
 * @param {Number} [b=0] - Blue value (floating point data)
 * @param {Number} [a=1] - Alpha value (floating point data)
 * @constructor
 */

function Color(r,g,b,a) {
    /**
     * Red value (floating point data)
     * @type {Number}
     */
    this.r = null;
    /**
     * Green value (floating point data)
     * @type {Number}
     */
    this.g = null;
    /**
     * Blue value (floating point data)
     * @type {Number}
     */
    this.b = null;
    /**
     * Alpha value (floating point data)
     * @type {Number}
     */
    this.a = null;
    this.setf(r,g,b,a);
}

/**
 * Set rgba components.
 * @param {Number} [r=0] - Red value (floating point data)
 * @param {Number} [g=0] - Green value (floating point data)
 * @param {Number} [b=0] - Blue value (floating point data)
 * @param {Number} [a=1] - Alpha value (floating point data)
 * @returns {Color}
 */

Color.prototype.setf = function(r,g,b,a){
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = ObjectUtil.isUndefined(a) ? 1.0 : a;
    return this;
};

/**
 * Set rgba components.
 * @param {Number} [r=0] - Red value (integers)
 * @param {Number} [g=0] - Green value (integers)
 * @param {Number} [b=0] - Blue value (integers)
 * @param {Number} [a=1] - Alpha value (floating point data)
 * @returns {Color}
 */

Color.prototype.seti = function(r,g,b,a){
    this.r = r * _255 || 0
    this.g = g * _255 || 0;
    this.b = b * _255 || 0;
    this.a = ObjectUtil.isUndefined(a) ? 1.0 : a;
    return this;;
}

/**
 * Set rgba components.
 * @param {String} hex - hex value
 * @returns {Color}
 */

Color.prototype.setHex = function(hex){
    var res = hex2rgb(hex,temp0);
    if(!res){
        throw new Error('Color: Can´t parse hex value.');
    }
    this.r = res[0] * _255;
    this.g = res[1] * _255;
    this.b = res[2] * _255;
    this.a = res[3];
    return this;
};

/**
 * Set from another color.
 * @param {Color} color - Another color
 * @returns {Color}
 */

Color.prototype.set = function(color){
    return this.setf(color.r,color.g,color.b,color.a);
};

/**
 * Returns a copy of the color
 * @param {Color} [color] - The out color
 * @returns {Color}
 */

Color.prototype.copy = function(color){
    return (color || new Color()).set(this);
};

/**
 * Check if color equals another color.
 * @param {Color} color - Another color
 * @returns {boolean}
 */

Color.prototype.equals = function(color){
    return this.r == color.r &&
           this.g == color.g &&
           this.b == color.b &&
           this.a == color.a;
};

/**
 * Check if color equals r,g,b,a components.
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 * @returns {boolean}
 */

Color.prototype.equalsf = function(r,g,b,a){
    return this.r == r &&
           this.g == g &&
           this.b == b &&
           this.a == a;
};

/**
 * Returns a Float32Array representation of the color.
 * @param {Float32Array} [arr] - The out Float32Array
 * @returns {Float32Array}
 */

Color.prototype.toFloat32Array = function(arr){
    arr = arr || new Float32Array(4);
    arr[0] = this.r;
    arr[1] = this.g;
    arr[2] = this.b;
    arr[3] = this.a;
    return arr;
};

/**
 * Returns a Float32Array representation of the color´s rgb components;
 * @param {Float32Array} [arr] - The out Float32Array
 * @returns {Float32Array}
 */

Color.prototype.toFloat32ArrayRGB = function(arr){
    arr = arr || new Float32Array(3);
    arr[0] = this.r;
    arr[1] = this.g;
    arr[2] = this.b;
    return arr;
}

/**
 * Create a new color with r=1,g=1,b=1,a=1
 * @returns {Color}
 */

Color.white = function(){
    return new Color(1,1,1,1);
};

/**
 * Create a new color with r=0,g=0,b=0,a=1
 * @returns {Color}
 */

Color.black = function(){
    return new Color(0,0,0,1);
};

/**
 * Create a new color with r=1,g=0,b=0,a=1
 * @returns {Color}
 */

Color.red = function(){
    return new Color(1,0,0,1);
};

/**
 * Create a new color with r=0,g=1,b=0,a=1
 * @returns {Color}
 */

Color.green = function(){
    return new Color(0,1,0,1);
};

/**
 * Create a new color with r=0,g=0,b=1,a=1
 * @returns {Color}
 */

Color.blue = function(){
    return new Color(0,0,1,1);
};

/**
 * Create a new color from integer rbg, float a
 * @param {Integer} [r] - Red value
 * @param {Integer} [g] - Green value
 * @param {Integer} [b] - Blue value
 * @param {Float} [a] - Alpha value
 * @returns {Color}
 */

Color.fromInt = function(r,g,b,a){
    return new Color().seti(r,g,b,a);
}

/**
 * Create a new color from hex
 * @param {String} hex - hex value
 * @returns {Color}
 */

Color.fromHex = function(hex){
    return new Color().setHex(hex);
}

/**
 * Return a string representation of the color.
 * @returns {String}
 */

Color.prototype.toString = function(){
    return '[' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ']';
};

module.exports = Color;