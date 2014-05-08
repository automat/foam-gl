function WebGL(gl){
    this._gl = gl;
}

WebGL.prototype.getContextAttributes = function() {
    return this._gl.getContextAttributes();
};
/**
 @return {boolean}
 */
WebGL.prototype.isContextLost = function() {
    return this._gl.isContextLost();
};
/**
 @return {Array[String}
 */
WebGL.prototype.getSupportedExtensions = function() {
    return this._gl.getSupportedExtensions();
};
/**
 @param {string} name
 @return {*}
 */
WebGL.prototype.getExtension = function(name) {
    return this._gl.getExtension(name);
};
/**
 @param {Number} texture
 @return {void}
 */
WebGL.prototype.activeTexture = function(texture) {
    this._gl.activeTexture(texture);
};
/**
 @param {WebGLProgram} program
 @param {WebGLShader} shader
 @return {void}
 */
WebGL.prototype.attachShader = function(program,shader) {
    this._gl.attachShader(program,shader);
};
/**
 @param {WebGLProgram} program
 @param {Number} index
 @param {string} name
 @return {void}
 */
WebGL.prototype.bindAttribLocation = function(program,index,name) {
    this._gl.bindAttribLocation(program,index,name);
};
/**
 @param {Number} target
 @param {WebGLBuffer} buffer
 @return {void}
 */
WebGL.prototype.bindBuffer = function(target,buffer) {
    this._gl.bindBuffer(target,buffer);
};
/**
 @param {Number} target
 @param {WebGLFramebuffer} framebuffer
 @return {void}
 */
WebGL.prototype.bindFramebuffer = function(target,framebuffer) {
    this._gl.bindFramebuffer(target,framebuffer);
};
/**
 @param {Number} target
 @param {WebGLRenderbuffer} renderbuffer
 @return {void}
 */
WebGL.prototype.bindRenderbuffer = function(target,renderbuffer) {
    this._gl.bindRenderbuffer(target,renderbuffer);
};
/**
 @param {Number} target
 @param {WebGLTexture} texture
 @return {void}
 */
WebGL.prototype.bindTexture = function(target,texture) {
    this._gl.bindTexture(target,texture);
};
/**
 @param {Number} red
 @param {Number} green
 @param {Number} blue
 @param {Number} alpha
 @return {void}
 */
WebGL.prototype.blendColor = function(red,green,blue,alpha) {
    this._gl.blendColor(red,green,blue,alpha);
};
/**
 @param {Number} mode
 @return {void}
 */
WebGL.prototype.blendEquation = function(mode) {
    this._gl.blendEquation(mode);
};
/**
 @param {Number} modeRGB
 @param {Number} modeAlpha
 */
WebGL.prototype.blendEquationSeparate = function(modeRGB,modeAlpha) {
    this._gl.blendEquationSeparate(modeRGB,modeAlpha);
};
/**
 @param {Number} sfactor
 @param {Number} dfactor
 */
WebGL.prototype.blendFunc = function(sfactor,dfactor) {
    this._gl.blendFunc(sfactor,dfactor);
};
/**
 @param {Number} srcRGB
 @param {Number} dstRGB
 @param {Number} srcAlpha
 @param {Number} dstAlpha
 @return {void}
 */
WebGL.prototype.blendFuncSeparate = function(srcRGB,dstRGB,srcAlpha,dstAlpha) {
    this._gl.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);
};
/**
 @param {Number} target
 @param {Number} size
 @param {Number} usage
 */
WebGL.prototype.bufferData = function(target,size,usage) {
    this._gl.bufferData(target,size,usage);
};
/**
 @param {Number} target
 @param {ArrayBufferView} data
 @param {Number} usage
 */
WebGL.prototype.bufferData = function(target,data,usage) {
    this._gl.bufferData(target,data,usage);
};
/**
 @param {Number} target
 @param {ArrayBuffer} data
 @param {Number} usage
 */
WebGL.prototype.bufferData = function(target,data,usage) {
    this._gl.bufferData(taget,data,usage);
};
/**
 @param {Number} target
 @param {Number} offset
 @param {ArrayBufferView} data
 */
WebGL.prototype.bufferSubData = function(target,offset,data) {
    this._gl.bufferSubData(target,offset,data);
};
/**
 @param {Number} target
 @param {Number} offset
 @param {ArrayBuffer} data
 */
WebGL.prototype.bufferSubData = function(target,offset,data) {
    this._gl.bufferSubData(target,offset,data);
};
/**
 @param {Number} target
 @return {Number}
 */
WebGL.prototype.checkFramebufferStatus = function(target) {
    return this._gl.checkFramebufferStatus(target);
};
/**
 @param {GLbitfield} mask
 @return {void}
 */
WebGL.prototype.clear = function(mask) {
    this._gl.clear(mask);
};
/**
 @param {Number} red
 @param {Number} green
 @param {Number} blue
 @param {Number} alpha
 @return {void}
 */
WebGL.prototype.clearColor = function(red,green,blue,alpha) {
    this._gl.clearColor(red,green,blue,alpha);
};
/**
 @param {Number} depth
 @return {void}
 */
WebGL.prototype.clearDepth = function(depth) {
    this._gl.clearDepth(depth);
};
/**
 @param {Number} s
 @return {void}
 */
WebGL.prototype.clearStencil = function(s) {
    this._gl.clearStencil(s);
};
/**
 @param {boolean} red
 @param {boolean} green
 @param {boolean} blue
 @param {boolean} alpha
 @return {void}
 */
WebGL.prototype.colorMask = function(red,green,blue,alpha) {
    this._gl.colorMask(red,green,blue,alpha);
};
/**
 @param {WebGLShader} [shader]
 @return {void}
 */
WebGL.prototype.compileShader = function(shader) {
    this._gl.compileShader(shader);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} internalformat
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @param {Number} border
 @return {void}
 */
WebGL.prototype.copyTexImage2D = function(target,level,internalformat,x,y,width,height,border) {
    this._gl.copyTexImage2D(target,level,internalformat,x,y,width,height,border);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} xoffset
 @param {Number} yoffset
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @return {void}
 */
WebGL.prototype.copyTexSubImage2D = function(target,level,xoffset,yoffset,x,y,width,height) {
    this._gl.copyTexSubImage2D(target,level,xoffset,yoffset,x,y,width,height);
};
/**
 @return {WebGLBuffer}
 */
WebGL.prototype.createBuffer = function() {
    return this._gl.createBuffer();
};
/**
 @return {WebGLFramebuffer}
 */
WebGL.prototype.createFramebuffer = function() {
    return this._gl.createFramebuffer();
};
/**
 @return {WebGLProgram}
 */
WebGL.prototype.createProgram = function() {
    return this._gl.createProgram();
};
/**
 @return {WebGLRenderbuffer}
 */
WebGL.prototype.createRenderbuffer = function() {
    return this._gl.createRenderbuffer();
};
/**
 @param {Number} type
 @return {WebGLShader}
 */
WebGL.prototype.createShader = function(type) {
    return this._gl.createShader(type);
};
/**
 @return {WebGLTexture}
 */
WebGL.prototype.createTexture = function() {
    return this._gl.createTexture();
};
/**
 @param {Number} mode
 @return {void}
 */
WebGL.prototype.cullFace = function(mode) {
    this._gl.cullFace(mode);
};
/**
 @param {WebGLBuffer} buffer
 @return {void}
 */
WebGL.prototype.deleteBuffer = function(buffer) {
    this._gl.deleteBuffer(buffer);
};
/**
 @param {WebGLRenderbuffer} framebuffer
 @return {void}
 */
WebGL.prototype.deleteFramebuffer = function(framebuffer) {
    this._gl.deleteFramebuffer(framebuffer);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.deleteProgram = function(program) {
    this._gl.deleteFramebuffer(program);
};
/**
 @param {WebGLRenderbuffer} renderbuffer
 @return {void}
 */
WebGL.prototype.deleteRenderbuffer = function(renderbuffer) {
    this._gl.deleteRenderbuffer(renderbuffer);
};
/**
 @param {WebGLShader} shader
 @return {void}
 */
WebGL.prototype.deleteShader = function(shader) {
    this._gl.deleteShader(shader);
};
/**
 @param {WebGLTexture} texture
 @return {void}
 */
WebGL.prototype.deleteTexture = function(texture) {
    this._gl.deleteTexture(texture);
};
/**
 @param {Number} func
 @return {void}
 */
WebGL.prototype.depthFunc = function(func) {
    this._gl.depthFunc(func);
};
/**
 @param {boolean} flag
 @return {void}
 */
WebGL.prototype.depthMask = function(flag) {
    this._gl.depthMask(flag);
};
/**
 @param {Number} zNear
 @param {Number} zFar
 */
WebGL.prototype.depthRange = function(zNear,zFar) {
    this._gl.depthRange(zNear,zFar);
};
/**
 @param {WebGLProgram} program
 @param {WebGLShader} shader
 */
WebGL.prototype.detachShader = function(program,shader) {
    this._gl.detachShader(program,shader);
};
/**
 @param {Number} cap
 @return {void}
 */
WebGL.prototype.disable = function(cap) {
    this._gl.disable(cap);
};
/**
 @param {Number} index
 @return {void}
 */
WebGL.prototype.disableVertexAttribArray = function(index) {
    this._gl.disableVertexAttribArray(index);
};
/**
 @param {Number} mode
 @param {Number} first
 @param {Number} count
 */
WebGL.prototype.drawArrays = function(mode,first,count) {
    this._gl.drawArrays(mode,first,count);
};
/**
 @param {Number} mode
 @param {Number} count
 @param {Number} type
 @param {Number} offset
 @return {void}
 */
WebGL.prototype.drawElements = function(mode,count,type,offset) {
    this._gl.drawElements(mode,count,type,offset);
};
/**
 @param {Number} cap
 @return {void}
 */
WebGL.prototype.enable = function(cap) {
    this._gl.enable(cap);
};
/**
 @param {Number} index
 @return {void}
 */
WebGL.prototype.enableVertexAttribArray = function(index) {
    this._gl.enableVertexAttribArray(index);
};
/**
 @return {void}
 */
WebGL.prototype.finish = function() {
    this._gl.finish();
};
/**
 @return {void}
 */
WebGL.prototype.flush = function() {
    this._gl.flush();
};
/**
 @param {Number} target
 @param {Number} attachment
 @param {Number} renderbuffertarget
 @param {WebGLRenderbuffer} renderbuffer
 @return {void}
 */
WebGL.prototype.framebufferRenderbuffer = function(target,attachment,renderbuffertarget,renderbuffer) {
    return this._gl.framebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer);
};
/**
 @param {Number} target
 @param {Number} attachment
 @param {Number} textarget
 @param {WebGLTexture} texture
 @param {Number} level
 @return {void}
 */
WebGL.prototype.framebufferTexture2D = function(target,attachment,textarget,texture,level) {
    return this._gl.framebufferTexture2D(target,attachment,textarget,texture,level);
};
/**
 @param {Number} mode
 @return {void}
 */
WebGL.prototype.frontFace = function(mode) {
    return this._gl.frontFace(mode);
};
/**
 @param {Number} target
 @return {void}
 */
WebGL.prototype.generateMipmap = function(target) {
    return this._gl.generateMipmap(target);
};
/**
 @param {WebGLProgram} program
 @param {Number} index
 */
WebGL.prototype.getActiveAttrib = function(program,index) {
    return this._gl.getActiveAttrib(program,index);
};
/**
 @param {WebGLProgram} program
 @param {Number} index
 */
WebGL.prototype.getActiveUniform = function(program,index) {
    return this._gl.getActiveUniform(program,index);
};
/**
 @param {WebGLProgram} program
 @param {string} name
 */
WebGL.prototype.getAttribLocation = function(program,name) {
    return this._gl.getAttribLocation(program,name)
};
/**
 @param {Number} pname
 @return {*}
 */
WebGL.prototype.getParameter = function(pname) {
    return this._gl.getParameter(pname);
};
/**
 @param {Number} target
 @param {Number} pname
 */
WebGL.prototype.getBufferParameter = function(target,pname) {
    return this._gl.getBufferParameter(target,pname);
};
/**
 @return {Number}
 */
WebGL.prototype.getError = function() {
    return this._gl.getError();
};
/**
 @param {Number} target
 @param {Number} attachment
 @param {Number} pname
 */
WebGL.prototype.getFramebufferAttachmentParameter = function(target,attachment,pname) {
    return this._gl.getFramebufferAttachmentParameter(target,attachment,pname);
};
/**
 @param {WebGLProgram} program
 @param {Number} pname
 */
WebGL.prototype.getProgramParameter = function(program,pname) {
    return this._gl.getProgramParameter(program,pname);
};
/**
 @param {WebGLProgram} program
 @return {string}
 */
WebGL.prototype.getProgramInfoLog = function(program) {
    return this._gl.getProgramInfoLog(program);
};
/**
 @param {Number} target
 @param {Number} pname
 */
WebGL.prototype.getRenderbufferParameter = function(target,pname) {
    return this._gl.getRenderbufferParameter(target,pname);
};
/**
 @param {WebGLShader} shader
 @param {Number} pname
 */
WebGL.prototype.getShaderParameter = function(shader,pname) {
    return this._gl.getShaderParameter(shader,pname);
};
/**
 @param {WebGLShader} shader
 @return {string}
 */
WebGL.prototype.getShaderInfoLog = function(shader) {
    return this._gl.getShaderInfoLog(shader);
};
/**
 @param {WebGLShader} shader
 @return {string}
 */
WebGL.prototype.getShaderSource = function(shader) {
    return this._gl.getShaderSource(shader);
};
/**
 @param {Number} target
 @param {Number} pname
 */
WebGL.prototype.getTexParameter = function(target,pname) {
    return this._gl.getTexParameter(target,pname);
};
/**
 @param {WebGLProgram} program
 @param {WebGLUniformLocation} location
 */
WebGL.prototype.getUniform = function(program,location) {
    return this._gl.getUniform(program,location);
};
/**
 @param {WebGLProgram} program
 @param {string} name
 */
WebGL.prototype.getUniformLocation = function(program,name) {
    return this._gl.getUniformLocation(program,name);
};
/**
 @param {Number} index
 @param {Number} pname
 */
WebGL.prototype.getVertexAttrib = function(index,pname) {
    return this._gl.getVertexAttrib(index,pname);
};
/**
 @param {Number} index
 @param {Number} pname
 */
WebGL.prototype.getVertexAttribOffset = function(index,pname) {
    return this._gl.getVertexAttribOffset(index,pname);
};
/**
 @param {Number} target
 @param {Number} mode
 */
WebGL.prototype.hint = function(target,mode) {
    this._gl.hint(target,mode);
};
/**
 @param {WebGLBuffer} buffer
 @return {boolean}
 */
WebGL.prototype.isBuffer = function(buffer) {
    return this._gl.isBuffer(buffer);
};
/**
 @param {Number} cap
 @return {boolean}
 */
WebGL.prototype.isEnabled = function(cap) {
    return this._gl.isEnabled(cap);
};
/**
 @param {WebGLFramebuffer} framebuffer
 @return {boolean}
 */
WebGL.prototype.isFramebuffer = function(framebuffer) {
    return this._gl.isFramebuffer(framebuffer);
};
/**
 @param {WebGLProgram} program
 @return {boolean}
 */
WebGL.prototype.isProgram = function(program) {
    return this._gl.isProgram(program);
};
/**
 @param {WebGLRenderbuffer} renderbuffer
 @return {boolean}
 */
WebGL.prototype.isRenderbuffer = function(renderbuffer) {
    return this._gl.isRenderbuffer(renderbuffer);
};
/**
 @param {WebGLShader} shader
 @return {boolean}
 */
WebGL.prototype.isShader = function(shader) {
    return this._gl.isShader(shader);
};
/**
 @param {WebGLTexture} texture
 @return {boolean}
 */
WebGL.prototype.isTexture = function(texture) {
    return this._gl.isTexture(texture);
};
/**
 @param {Number} width
 @return {void}
 */
WebGL.prototype.lineWidth = function(width) {
    this._gl.lineWidth(width);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.linkProgram = function(program) {
    this._gl.linkProgram(program);
};
/**
 @param {Number} pname
 @param {Number} param
 */
WebGL.prototype.pixelStorei = function(pname,param) {
    this._gl.pixelStorei(pname,param);
};
/**
 @param {Number} factor
 @param {Number} units
 */
WebGL.prototype.polygonOffset = function(factor,units) {
    this._gl.polygonOffset(factor,units);
};
/**
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @param {Number} format
 @param {Number} type
 @param {ArrayBufferView} pixels
 */
WebGL.prototype.readPixels = function(x,y,width,height,format,type,pixels) {
    this._gl.readPixels(x,y,width,height,format,type,pixels);
};
/**
 @param {Number} target
 @param {Number} internalformat
 @param {Number} width
 @param {Number} height
 */
WebGL.prototype.renderbufferStorage = function(target,internalformat,width,height) {
    this._gl.renderbufferStorage(target,internalformat,width,height);
};
/**
 @param {Number} [value]
 @param {boolean} invert
 */
WebGL.prototype.sampleCoverage = function(value,invert) {
    this._gl.sampleCoverage(value,invert);
};
/**
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 */
WebGL.prototype.scissor = function(x,y,width,height) {
    this._gl.scissor(x,y,width,height);
};
/**
 @param {WebGLShader} shader
 @param {string} source
 */
WebGL.prototype.shaderSource = function(shader,source) {
    this._gl.shaderSource(shader,source);
};
/**
 @param {Number} func
 @param {Number} ref
 @param {Number} mask
 */
WebGL.prototype.stencilFunc = function(func,ref,mask) {
    this._gl.stencilFunc(func,ref,mask);
};
/**
 @param {Number} face
 @param {Number} func
 @param {Number} ref
 @param {Number} mask
 */
WebGL.prototype.stencilFuncSeparate = function(face,func,ref,mask) {
    this._gl.stencilFuncSeparate(face,func,ref,mask);
};
/**
 @param {Number} mask
 @return {void}
 */
WebGL.prototype.stencilMask = function(mask) {
    this._gl.stencilMask(mask);
};
/**
 @param {Number} face
 @param {Number} mask
 */
WebGL.prototype.stencilMaskSeparate = function(face,mask) {
    this._gl.stencilMaskSeparate(face,mask);
};
/**
 @param {Number} fail
 @param {Number} zfail
 @param {Number} zpass
 */
WebGL.prototype.stencilOp = function(fail,zfail,zpass) {
    this._gl.stencilOp(fail,zfail,zpass);
};
/**
 @param {Number} face
 @param {Number} fail
 @param {Number} zfail
 @param {Number} zpass
 */
WebGL.prototype.stencilOpSeparate = function(face,fail,zfail,zpass) {
    this._gl.stencilOpSeparate(face,fail,zfail,zpass);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} internalformat
 @param {Number} width
 @param {Number} height
 @param {Number} border
 @param {Number} format
 @param {Number} type
 @param {ArrayBufferView} pixels
 */
WebGL.prototype.texImage2D = function(target,level,internalformat,width,height,border,format,type,pixels) {
    this._gl.texImage2D(target,level,internalformat,width,height,border,format,type,pixels);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} internalformat
 @param {Number} format
 @param {Number} type
 @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} pixelsImageCanvasOrVideo
 */
WebGL.prototype.texImage2D = function(target,level,internalformat,format,type,pixelsImageCanvasOrVideo) {
    this._gl.texImage2D(target,level,internalformat,format,type,pixelsImageCanvasOrVideo);
};
/**
 @param {Number} target
 @param {Number} pname
 @param {Number} param
 */
WebGL.prototype.texParameterf = function(target,pname,param) {
    this._gl.texParameterf(target,pname,param);
};
/**
 @param {Number} target
 @param {Number} pname
 @param {Number} param
 */
WebGL.prototype.texParameteri = function(target,pname,param) {
    this._gl.texParameteri(target,pname,param);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} xoffset
 @param {Number} yoffset
 @param {Number} width
 @param {Number} height
 @param {Number} format
 @param {Number} type
 @param {ArrayBufferView} pixels
 */
WebGL.prototype.texSubImage2D = function(target,level,xoffset,yoffset,width,height,format,type,pixels) {
    this._gl.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels);
};
/**
 @param {Number} target
 @param {Number} level
 @param {Number} xoffset
 @param {Number} yoffset
 @param {Number} format
 @param {Number} type
 @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} pixelsImageCanvasOrVideo
 */
WebGL.prototype.texSubImage2D = function(target,level,xoffset,yoffset,format,type,pixelsImageCanvasOrVideo) {
    this._gl.texSubImage2D(target,level,xoffset,yoffset,format,type,pixelsImageCanvasOrVideo);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 */
WebGL.prototype.uniform1f = function(location,x) {
    this._gl.uniform1f(location,x);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform1fv = function(location,v) {
    this._gl.uniform1fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} [v]
 */
WebGL.prototype.uniform1fv = function(location,v) {
    this._gl.uniform1fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 */
WebGL.prototype.uniform1i = function(location,x) {
    this._gl.uniform1i(location,x);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform1iv = function(location,v) {
    this._gl.uniform1iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} [v]
 */
WebGL.prototype.uniform1iv = function(location,v) {
    this._gl.uniform1iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 */
WebGL.prototype.uniform2f = function(location,x,y) {
    this._gl.uniform2f(location,x,y);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform2fv = function(location,v) {
    this._gl.uniform2fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} [v]
 */
WebGL.prototype.uniform2fv = function(location,v) {
    this._gl.uniform2fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 */
WebGL.prototype.uniform2i = function(location,x,y) {
    this._gl.uniform2i(location,x,y);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform2iv = function(location,v) {
    this._gl.uniform2iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform2iv = function(location,v) {
    this._gl.uniform2iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 */
WebGL.prototype.uniform3f = function(location,x,y,z) {
    this._gl.uniform3f(location,x,y,z);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform3fv = function(location,v) {
    this._gl.uniform3fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform3fv = function(location,v) {
    this._gl.uniform3fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 */
WebGL.prototype.uniform3i = function(location,x,y,z) {
    this._gl.uniform3i(location,x,y,z);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform3iv = function(location,v) {
    this._gl.uniform3iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform3iv = function(location,v) {
    this._gl.uniform3iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 @param {Number} w
 */
WebGL.prototype.uniform4f = function(location,x,y,z,w) {
    this._gl.uniform4f(location,x,y,z,w);
};
/**
 @param {WebGLUniformLocation} location
 @param {Float32Array} v
 */
WebGL.prototype.uniform4fv = function(location,v) {
    this._gl.uniform4fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform4fv = function(location,v) {
    this._gl.uniform4fv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Number} x
 @param {Number} y
 @param {Number} z
 @param {Number} w
 */
WebGL.prototype.uniform4i = function(location,x,y,z,w) {
    this._gl.uniform4f(location,x,y,z,w);
};
/**
 @param {WebGLUniformLocation} location
 @param {Int32Array} v
 */
WebGL.prototype.uniform4iv = function(location,v) {
    this._gl.uniform4iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {Array[Number} v
 */
WebGL.prototype.uniform4iv = function(location,v) {
    this._gl.uniform4iv(location,v);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Float32Array} value
 */
WebGL.prototype.uniformMatrix2fv = function(location,transpose,value) {
    this._gl.uniformMatrix2fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Array[Number} value
 */
WebGL.prototype.uniformMatrix2fv = function(location,transpose,value) {
    this._gl.uniformMatrix2fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Float32Array} value
 */
WebGL.prototype.uniformMatrix3fv = function(location,transpose,value) {
    this._gl.uniformMatrix3fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Array[Number} value
 */
WebGL.prototype.uniformMatrix3fv = function(location,transpose,value) {
    this._gl.uniformMatrix3fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Float32Array} value
 */
WebGL.prototype.uniformMatrix4fv = function(location,transpose,value) {
    this._gl.uniformMatrix4fv(location,transpose,value);
};
/**
 @param {WebGLUniformLocation} location
 @param {boolean} transpose
 @param {Array[Number} value
 */
WebGL.prototype.uniformMatrix4fv = function(location,transpose,value) {
    this._gl.uniformMatrix4fv(location,transpose,value);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.useProgram = function(program) {
    this._gl.useProgram(program);
};
/**
 @param {WebGLProgram} program
 @return {void}
 */
WebGL.prototype.validateProgram = function(program) {
    this._gl.validateProgram(program);
};
/**
 @param {Number} indx
 @param {Number} x
 */
WebGL.prototype.vertexAttrib1f = function(indx,x) {
    this._gl.vertexAttrib1f(indx,x);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib1fv = function(indx,values) {
    this._gl.vertexAttrib1fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib1fv = function(indx,values) {
    this._gl.vertexAttrib1fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} x
 @param {Number} y
 */
WebGL.prototype.vertexAttrib2f = function(indx,x,y) {
    this._gl.vertexAttrib2f(indx,x,y);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib2fv = function(indx,values) {
    this._gl.vertexAttrib2fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib2fv = function(indx,values) {
    this._gl.vertexAttrib2fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} x
 @param {Number} y
 @param {Number} z
 */
WebGL.prototype.vertexAttrib3f = function(indx,x,y,z) {
    this._gl.vertexAttrib3f(indx,x,y,z);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib3fv = function(indx,values) {
    this._gl.vertexAttrib3fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib3fv = function(indx,values) {
    this._gl.vertexAttrib3fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} x
 @param {Number} y
 @param {Number} z
 @param {Number} w
 */
WebGL.prototype.vertexAttrib4f = function(indx,x,y,z,w) {
    this._gl.vertexAttrib4f(indx,x,y,z,w);
};
/**
 @param {Number} indx
 @param {Float32Array} values
 */
WebGL.prototype.vertexAttrib4fv = function(indx,values) {
    this._gl.vertexAttrib4fv(indx,values);
};
/**
 @param {Number} indx
 @param {Array[Number} values
 */
WebGL.prototype.vertexAttrib4fv = function(indx,values) {
    this._gl.vertexAttrib4fv(indx,values);
};
/**
 @param {Number} indx
 @param {Number} size
 @param {Number} type
 @param {boolean} normalized
 @param {Number} stride
 @param {Number} offset
 */
WebGL.prototype.vertexAttribPointer = function(indx,size,type,normalized,stride,offset) {
    this._gl.vertexAttribPointer(indx,size,type,normalized,stride,offset);
};
/**
 @param {Number} x
 @param {Number} y
 @param {Number} width
 @param {Number} height
 @return {void}
 */
WebGL.prototype.viewport = function(x,y,width,height) {
    this._gl.viewport(x,y,width,height);
};

module.exports = WebGL;