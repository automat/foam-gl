var Vec2 = require('../math/Vec2'),
    Vec3 = require('../math/Vec3');

function Rect() {
    this.x0 = 0;
    this.y0 = 0;
    this.x1 = 0;
    this.y1 = 0;
}

Rect.prototype.set = function(rect){
    this.x0 = rect.x0;
    this.y0 = rect.y0;
    this.x1 = rect.x1;
    this.y1 = rect.y1;
    return this;
};

Rect.prototype.setPosition = function(v){
    var width = this.getWidth(),
        height = this.getHeight();
    this.x0 = v.x;
    this.y0 = v.y;
    this.x1 = this.x0 + width;
    this.y1 = this.y0 + height;
    return this;
};

Rect.prototype.setPositionf = function(x,y){
    var width = this.getWidth(),
        height = this.getHeight();
    this.x0 = x;
    this.y0 = y;
    this.x1 = this.x0 + width;
    this.y1 = this.y0 + height;
    return this;
};

Rect.prototype.getPosition = function(v){
    return (v || new Vec2()).set(this.x0,this.y0);
};

Rect.prototype.setSize = function(v){
    this.x1 = this.x0 + v.x;
    this.y1 = this.y0 + v.y;
    return this;
};

Rect.prototype.setSizef = function(width,height){
    this.x1 = this.x0 + width;
    this.y1 = this.y0 + height;
    return this;
};

Rect.prototype.setWidth = function(width){
    this.x1 = this.x0 + width;
    return this;
};

Rect.prototype.setHeight = function(height){
    this.y1 = this.y0 + height;
    return this;
};

Rect.prototype.getWidth = function(){
    return this.x1 - this.x0;
};

Rect.prototype.getHeight = function(){
    return this.y1 - this.y0;
};

Rect.prototype.getSize = function(v){
    return (v || new Vec2()).set(this.getWidth(),this.getHeight());
};

Rect.prototype.getCenter = function(v){
    return (v || new Vec2()).setf((this.x0 + this.x1) * 0.5,(this.y0 + this.y1) * 0.5);
};

module.exports = Rect;