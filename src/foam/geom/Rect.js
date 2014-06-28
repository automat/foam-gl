var Vec2 = require('../math/Vec2'),
    Vec3 = require('../math/Vec3');

function Rect() {
    this.min = new Vec2();
    this.max = new Vec2();

    switch (arguments.length){
        case 2:
            this.setSizef(arguments[0],arguments[1]);
            break;
        case 4:
            this.setf(arguments[0],arguments[1],arguments[2],arguments[3]);
            break;
    }
}

Rect.fromPoints = function(points,rect){
    return (rect || new Rect()).setFromPoints(points);
}

Rect.prototype.set = function(rect){
    this.min.set(rect.min);
    this.max.set(rect.max);
    return this;
};

Rect.prototype.setf = function(x0,y0,x1,y1){
    this.min.setf(x0,y0);
    this.max.setf(x1,y1);
    return this;
};

Rect.prototype.setFromPoints = function(points){
    var min = this.min.toMax(),
        max = this.max.toMin();
    var i = -1, l = points.length;
    var point;
    var px,py;

    while(++i < l){
        point = points[i];
        px = point.x;
        py = point.y;

        min.x = Math.min(min.x,px);
        max.x = Math.max(max.x,px);
        min.y = Math.min(min.y,py);
        max.y = Math.max(max.y,py);
    }
    return this;
};

Rect.prototype.setPosition = function(v){
    var width = this.getWidth(),
        height = this.getHeight();
    this.min.set(v);
    this.max.set(this.min).addf(width,height);
    return this;
};

Rect.prototype.setPositionf = function(x,y){
    var width = this.getWidth(),
        height = this.getHeight();
    this.min.setf(x,y);
    this.max.set(this.min).addf(width,height);
    return this;
};

Rect.prototype.getPosition = function(v){
    return (v || new Vec2()).set(this.min);
};

Rect.prototype.setSize = function(v){
    this.max.set(this.min).add(v);
    return this;
};

Rect.prototype.setSizef = function(width,height){
    this.max.set(this.min).addf(width,height);
    return this;
};

Rect.prototype.setWidth = function(width){
    this.max.x = this.min.x + width;
    return this;
};

Rect.prototype.setHeight = function(height){
    this.max.y = this.min.y + height;
    return this;
};

Rect.prototype.getWidth = function(){
    return this.max.x - this.min.x;
};

Rect.prototype.getHeight = function(){
    return this.max.y - this.min.y;
};

Rect.prototype.getSize = function(v){
    return (v || new Vec2()).set(this.getWidth(),this.getHeight());
};

Rect.prototype.getCenter = function(v){
    return (v || new Vec2()).setf((this.min.x + this.max.x) * 0.5,(this.min.y + this.max.y) * 0.5);
};

Rect.prototype.getAspectRatio = function(){
    return this.getWidth() / this.getHeight();
};

module.exports = Rect;