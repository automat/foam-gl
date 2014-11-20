var Fbo = require('./Fbo');

function PingPongFbo(width, height, format){
    format = format || new Fbo.Format();
    this._fbo = [new Fbo(width,height,format),new Fbo(width,height,format)];
    this._index = 0;
}

PingPongFbo.prototype.bind = function(){
    this._fbo[this._index].bind();
};

PingPongFbo.prototype.unbind = function(){
    this._fbo[this._index].unbind();
};

PingPongFbo.prototype.getTarget = function(){
    return this._fbo[this._index];
};

PingPongFbo.prototype.getSource = function(){
    return this._fbo[1 - this._index];
};

PingPongFbo.prototype.bindTargetTexture = function(unit){
    this.getTarget().bindTexture(unit);
};

PingPongFbo.prototype.bindSourceTexture = function(unit){
    this.getSource().bindTexture(unit);
};
PingPongFbo.prototype.unbindTargetTexture = function(unit){
    this.getTarget().unbindTexture(unit);
};

PingPongFbo.prototype.bindSourceTexture = function(unit){
    this.getSource().unbindTexture(unit);
};

PingPongFbo.prototype.unbindSourceTexture = function(unit){
    this.getSource().unbindTexture(unit);
};

PingPongFbo.prototype.swap = function(){
    this._index = 1 - this._index;
};

PingPongFbo.prototype.getSize = function(){
    return this.getTarget().getSize();
};

PingPongFbo.prototype.delete = function(){
    this._fbo[0].delete();
    this._fbo[1].delete();
};

module.exports = PingPongFbo;