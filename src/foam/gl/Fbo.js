var _gl = require('./gl'),
    _Math = require('../math/Math'),
    ObjectUtil = require('../util/ObjectUtil'),
    Texture = require('./Texture');

function Fbo(width,height,format){
    format = format || new Fbo.Format();
    this._width = width;
    this._height = height;

    var gl = this._gl = _gl.get();

    var prevTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
    var prevRbo = gl.getParameter(gl.RENDERBUFFER_BINDING);
    var prevFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    this._colorBuffer = gl.createTexture();
    this._frameBuffer = gl.createFramebuffer();
    this._renderBuffer = gl.createRenderbuffer();

    var pot = _Math.isPOT(width) && _Math.isPOT(height);

    if(!pot && (format.wrapS == gl.REPEAT || format.wrapT == gl.REPEAT)){
        throw new Error('TEXTURE: Texture size must be power of 2 if wrapmode REPEAT is used.');
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER,this._frameBuffer);

    //
    //  texture
    //

    gl.bindTexture(gl.TEXTURE_2D, this._colorBuffer);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, format.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, format.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, format.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, format.wrapT);

    if(format.mipmapping){
        if(pot){
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            throw new Error('TEXTURE: Texture size must be power of 2 when using mipmapping.');
        }
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    //
    //  renderbuffer
    //

    gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorBuffer, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer);

    gl.bindTexture(gl.TEXTURE_2D, prevTex);
    gl.bindRenderbuffer(gl.RENDERBUFFER, prevRbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER,prevFbo);
}


Fbo.Format = function(){
    Texture.Format.call(this);

    this.depthBuffer = true;
    this.stencilBuffer = false;
    this.numColorBuffers = 1;
};

Fbo.prototype.getWidth = function(){
    return this._width;
};

Fbo.prototype.getHeight = function(){
    return this._height;
};

Fbo.prototype.bind = function(){
    var gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
};

Fbo.prototype.unbind = function(){
    var gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

Fbo.prototype.bindTexture = function(attachment, unit){
    var gl = this._gl;
    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, this._colorBuffer);
};

Fbo.prototype.unbindTexture = function(attachment, unit){
    var gl = this._gl;
    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
};

Fbo.prototype.getTexture = function(unit){

};

Fbo.prototype.delete = function(){

}


module.exports = Fbo;