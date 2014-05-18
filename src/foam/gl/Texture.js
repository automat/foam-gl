var _gl = require('./gl'),
    ObjectUtil = require('../util/ObjectUtil'),
    fMath = require('../math/Math'),
    Program = require('./Program');

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

    if(format.mipMapping){
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
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,format.dataFormat,format.dataType,data);
    } else {
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,format.dataFormat,format.dataType,data);
    }

    gl.bindTexture(gl.TEXTURE_2D, prevObj);
}

Texture.Format = function(){
    var gl = _gl.get();
    this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
    this.minFilter = this.magFilter = gl.LINEAR;
    this.mipMapping = false;
    this.dataFormat = gl.RGBA;
    this.dataType = gl.UNSIGNED_BYTE;
};

Texture.prototype.getFormat = function(){
    return this._format;
};

Texture.prototype.getWidth = function(){
    return this._width;
};

Texture.prototype.getHeight = function(){
    return this._height;
};

Texture.prototype.bind = function(unit){
    var gl = this._gl;
    unit = ObjectUtil.isUndefined(unit) ? gl.getParameter(gl.ACTIVE_TEXTURE) : unit;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this._obj);
};

Texture.prototype.unbind = function(unit){
    var gl = this._gl;
    unit = ObjectUtil.isUndefined(unit) ? gl.getParameter(gl.ACTIVE_TEXTURE) : unit;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, null);
};

Texture.prototype.delete = function(){
    this._gl.deleteTexture(this._obj);
};


Texture.createBlank = function(){
    var format = new Texture.Format();
    format.dataType = _gl.get().UNSIGNED_BYTE;
    return new Texture(new Uint8Array([1,1,1,1]),1,1,format);
};

Texture.createFromImage = function(image){
    return new Texture(image,image.width,image.height);
};

Texture.createFromCanvas = function(canvas){

};


module.exports = Texture;


