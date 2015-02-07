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
}

function hsv2rgb(hue,sat,val,out){
    var maxHue,maxSat,maxVal;
    var minHue,minSat,minVal;

    maxHue = 360.0;
    maxSat = 100.0;
    maxVal = 100.0;

    minHue = 0;
    minSat = 0;
    minVal = 0;

    hue = hue % maxHue;
    val = Math.max(minVal, Math.min(val, maxVal)) / maxVal * 255.0;

    if (sat <= minSat) {
        val    = Math.round(val);
        out[0] = out[1] = out[2] = val;
        out[3] = 1.0;
        return out;
    } else if (sat > maxSat){
        sat = maxSat;
    }

    var hi, f, p, q, t;
    var r, g, b;

    sat = sat / maxSat;

    //http://d.hatena.ne.jp/ja9/20100903/128350434

    hi = Math.floor(hue / 60.0) % 6;
    f  = (hue / 60.0) - hi;
    p  = val * (1 - sat);
    q  = val * (1 - f * sat);
    t  = val * (1 - (1 - f) * sat);

    r = g = b = 0;

    switch (hi) {
        case 0:
            r = val;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = val;
            b = p;
            break;
        case 2:
            r = p;
            g = val;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = val;
            break;
        case 4:
            r = t;
            g = p;
            b = val;
            break;
        case 5:
            r = val;
            g = p;
            b = q;
            break;
        default:
            break;
    }

    out[0] = Math.round(r);
    out[1] = Math.round(g);
    out[2] = Math.round(b);
    out[3] = 1.0;

    return out;
}

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

    Color.prototype.setf.apply(this,arguments);
}

Color.prototype.copy = function(out){
    return (out || new Color()).set(this);
};

/**
 * Set rgba components.
 * @param {Number} [r=0] - Red value (floating point data)
 * @param {Number} [g=0] - Green value (floating point data)
 * @param {Number} [b=0] - Blue value (floating point data)
 * @param {Number} [a=1] - Alpha value (floating point data)
 * @returns {Color}
 */

Color.prototype.setf = function(r,g,b,a){
    var r_,g_,b_,a_ = 1.0;
    switch (arguments.length){
        case 0 :
            r_ = g_ = b_ = 0;
            break;
        case 1 :
            r_ = g_ = b_ = arguments[0];
            break;
        case 2 :
            r_ = g_ = b_ = arguments[0];
            a_ = arguments[1];
            break;
        case 3 :
            r_ = arguments[0];
            g_ = arguments[1];
            b_ = arguments[2];
            break;
        case 4 :
            r_ = arguments[0];
            g_ = arguments[1];
            b_ = arguments[2];
            a_ = arguments[3];
            break;
    }

    this.r = r_;
    this.g = g_;
    this.b = b_;
    this.a = a_;
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
    var r_,g_,b_,a_ = 1.0;
    var _255 = 1.0 / 255.0;
    switch (arguments.length){
        case 0 :
            r_ = g_ = b_ = 0;
            break;
        case 1 :
            r_ = g_ = b_ = arguments[0] * _255;
            break;
        case 2 :
            r_ = g_ = b_ = arguments[0] * _255;
            a_ = arguments[1];
            break;
        case 3 :
            r_ = arguments[0] * _255;
            g_ = arguments[1] * _255;
            b_ = arguments[2] * _255;
            break;
        case 4 :
            r_ = arguments[0] * _255;
            g_ = arguments[1] * _255;
            b_ = arguments[2] * _255;
            a_ = arguments[3];
            break;
    }

    this.r = r_;
    this.g = g_;
    this.b = b_;
    this.a = a_;
    return this;
};

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
 * Sets rgb components from hsv values.
 * @param hue
 * @param saturatiom
 * @param value
 * @returns {Color}
 */

Color.prototype.setHSV = function(hue,saturatiom,value){
    var res = hsv2rgb(hue,saturatiom,value,temp0);
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

Color.prototype.lerp = function(color,a){
    var r, g, b, a_;
    r  = this.r;
    g  = this.g;
    b  = this.b;
    a_ = this.a;

    this.r = r + (color.r - r) * a;
    this.g = g + (color.g - g) * a;
    this.b = b + (color.b - b) * a;
    this.a = a_+ (color.a - a_)* a;

    return this;
};

Color.prototype.lerped = function(color,a,out){
    return this.copy(out).lerp(color,a);
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
};

/**
 * Returns an rgba(r,g,b,a) string representation of the color.
 * @returns {string}
 */

Color.prototype.toRGBAString = function(){
    return 'rgba(' + Math.floor(this.r * 255) + ',' + Math.floor(this.g * 255) + ',' + Math.floor(this.b * 255) + ',' + this.a + ')';
};

/**
 * Returns an rgb(r,g,b) string representation of the color.
 * @returns {string}
 */

Color.prototype.toRGBString = function(){
    return 'rgb(' + Math.floor(this.r * 255) + ',' + Math.floor(this.g * 255) + ',' + Math.floor(this.b * 255) + ')';
};

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