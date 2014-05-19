var _gl = require('./gl'),
    _Math = require('../math/Math'),
    ObjectUtil = require('../util/ObjectUtil'),
    Texture = require('./Texture');

function Fbo(width,height,format){
    format = format || new Fbo.Format();
    this._width = width;
    this._height = height;

    var gl = this._gl = _gl.get();

    var pot = _Math.isPOT(width) && _Math.isPOT(height);

    if(!pot && (format.wrapS == gl.REPEAT || format.wrapT == gl.REPEAT)){
        throw new Error('TEXTURE: Texture size must be power of 2 if wrapmode REPEAT is used.');
    }

    if(pot && format.mipmapping){
        throw new Error('TEXTURE: Texture size must be power of 2 when generating mipmap.');
    }

    var prevTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
    var prevRbo = gl.getParameter(gl.RENDERBUFFER_BINDING);
    var prevFbo = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    var renderBuffer = this._renderBuffer = gl.createRenderbuffer();
    //var colorBuffers = this._colorBuffers = [];
    var texture = this._texture = gl.createTexture();
    this._frameBuffer = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER,this._frameBuffer);

    //
    //  texture
    //
    /*
    var colorBuffer;
    var i = -1;
    while(++i < format.numColorBuffers){
        colorBuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, colorBuffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, format.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, format.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, format.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, format.wrapT);
        if(format.mipmapping){
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT_0_WEBGL + i, gl.TEXTURE_2D, colorBuffer, 0);
        colorBuffers.push(colorBuffer);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    */


    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, format.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, format.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, format.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, format.wrapT);
    if(format.mipmapping){
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,0, format.dataFormat, format.dataType, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);


    //
    //  renderbuffer
    //

    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);


    gl.bindTexture(gl.TEXTURE_2D, prevTex);
    gl.bindRenderbuffer(gl.RENDERBUFFER, prevRbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER,prevFbo);
}


Fbo.Format = function(){
    Texture.Format.call(this);
    this.dataFormat = _gl.get().RGBA;
    this.depthBuffer = false;
    this.stencilBuffer = false;
    this.numColorBuffers = 1;
};

Fbo.prototype.getWidth = function(){
    return this._width;
};

Fbo.prototype.getHeight = function(){
    return this._height;
};

Fbo.prototype.getSize = function(){
    return [this._width,this._height];
};

Fbo.prototype.bind = function(){
    var gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
};

Fbo.prototype.unbind = function(){
    var gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/*
Fbo.prototype.bindAttachment = function(attachment){
    var gl = this._gl;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + attachment, gl.TEXTURE_2D, this._colorBuffers[attachment], 0);
};*/

/*
Fbo.prototype.bindTexture = function(attachment, unit){
    var gl = this._gl;
    attachment = ObjectUtil.isUndefined(attachment) ? 0 : attachment;
    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, this._colorBuffers[attachment]);
};*/

Fbo.prototype.bindTexture = function(unit){
    var gl = this._gl;
    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
};

Fbo.prototype.unbindTexture = function(unit){
    var gl = this._gl;
    if(!ObjectUtil.isUndefined(unit)){
        gl.activeTexture(gl.TEXTURE0 + unit);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
};

/*
Fbo.prototype.delete = function(){
    var gl = this._gl;
    var format = this._format;
    var colorBuffers = this._colorBuffers;

    var i = -1;
    while(++i < format.numColorBuffers){
        gl.deleteTexture(colorBuffers[i]);
    }
    gl.deleteFramebuffer(this._frameBuffer);
    gl.deleteRenderbuffer(this._renderBuffer);
};*/

Fbo.prototype.delete = function(){
    var gl = this._gl;
    gl.deleteTexture(this._texture);
    gl.deleteFramebuffer(this._frameBuffer);
    gl.deleteRenderbuffer(this._renderBuffer);
};


module.exports = Fbo;