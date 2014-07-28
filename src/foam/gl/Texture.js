var _gl = require('./gl'),
    ObjectUtil = require('../util/ObjectUtil'),
    fMath = require('../math/Math');

/**
 * Texture
 * @param {Uint8Array|Float32Array|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} data - The data
 * @param {Number} width - Data width
 * @param {Number} height - Data height
 * @param {Texture.Format} [format] - The format
 * @constructor
 */

function Texture(data,width,height,format){
    if(!data){
        throw new Error('TEXTURE: Data is null');
    }

    format = format || new Texture.Format();
    var gl = this._gl = _gl.get();

    var pot = fMath.isPOT(width) && fMath.isPOT(height);

    if(!pot && (format.wrapS == gl.REPEAT || format.wrapT == gl.REPEAT)){
        throw new Error('TEXTURE: Texture size must be power of 2 if wrapmode REPEAT is used.');
    }
    var prevObj = gl.getParameter(gl.TEXTURE_BINDING_2D);
    var obj = this._obj = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, obj);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    if(format.mipmapping){
        if(pot){
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            throw new Error('TEXTURE: Texture size must be power of 2 when using mipmapping.');
        }
    }


    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, format.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, format.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, format.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, format.wrapT);


    this._width = width;
    this._height = height;
    this._format = format || new Texture.Format();

    if(data instanceof HTMLImageElement||
       data instanceof HTMLCanvasElement||
       data instanceof HTMLVideoElement){
        gl.texImage2D(gl.TEXTURE_2D, 0, format.dataFormatInternal, format.dataFormat, format.dataType, data);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, format.dataFormatInternal, width, height, 0, format.dataFormat, format.dataType, data);
    }

    gl.bindTexture(gl.TEXTURE_2D, prevObj);
}
/**
 * Returns the webgl texture.
 * @returns {WebGLTexture}
 */

Texture.prototype.getGLTexture = function(){
    return this._texture;
};

/**
 * Texture properties
 * @constructor
 */

Texture.Format = function(){
    var gl = _gl.get();
    this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
    this.minFilter = this.magFilter = gl.LINEAR;
    this.mipmapping = false;
    this.dataFormatInternal = gl.RGBA;
    this.dataFormat = gl.RGBA;
    this.dataType = gl.UNSIGNED_BYTE;
};

/**
 * Returns the textures format.
 * @returns {Number}
 */

Texture.prototype.getFormat = function(){
    return this._format;
};

/**
 * Returns the width of the texture.
 * @returns {Number}
 */

Texture.prototype.getWidth = function(){
    return this._width;
};

/**
 * Returns the height of the texture
 * @returns {Number}
 */

Texture.prototype.getHeight = function(){
    return this._height;
};

/**
 * Activates & binds the texture.
 * @param {Number} [unit] - The texture unit
 */

Texture.prototype.bind = function(unit){
    var gl = this._gl;

    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, this._obj);
};

/**
 * Unbind the texture
 * @param unit
 */

Texture.prototype.unbind = function(unit){
    var gl = this._gl;
    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * Writes new data to the texture.
 * @param {Uint8Array|Float32Array} data - The data
 * @param {Number} [offsetX]
 * @param {Number} [offsetY]
 * @param {Number} [width]
 * @param {Number} [height]
 */

Texture.prototype.writeData = function(data,offsetX,offsetY,width,height){
    var gl = this._gl;
    gl.texSubImage2D(gl.TEXTURE_2D, 0, offsetX || 0,
                                       offsetY || 0,
                                       ObjectUtil.isUndefined(width) ? this._width : width,
                                       ObjectUtil.isUndefined(height) ? this._height : height,
                                       this._format.dataFormat, this._format.dataType, data);
};


/**
 * Delete the texture.
 */

Texture.prototype.delete = function(){
    this._gl.deleteTexture(this._obj);
    this._width = 0;
    this._height = 0;
};

/**
 * Returns a new white texture.
 * @returns {Texture}
 */

Texture.createBlank = function(){
    var format = new Texture.Format();
    format.dataType = _gl.get().UNSIGNED_BYTE;
    return new Texture(new Uint8Array([1,1,1,1]),1,1,format);
};

/**
 * Returns a new texture form an image
 * @param {HTMLImageElement} image
 * @param format
 * @returns {Texture}
 */

Texture.createFromImage = function(image,format){
    return new Texture(image,image.width,image.height,format);
};

/*
Texture.createFromCanvas = function(canvas){

};

Texture.createFromGLObj = function(obj){

};
*/


module.exports = Texture;


