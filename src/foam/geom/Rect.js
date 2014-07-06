var Vec2 = require('../math/Vec2'),
    Vec3 = require('../math/Vec3');

var glTrans = require('../gl/glTrans'),
    glDraw,_glDraw = require('../gl/glDraw');

function Rect() {
    this.min = new Vec2();
    this.max = new Vec2();

    switch (arguments.length){
        case 1:
            this.setSize(arguments[0]);
            break;
        case 2:
            this.setSizef(arguments[0],arguments[1]);
            break;
        case 4:
            this.setf(arguments[0],arguments[1],arguments[2],arguments[3]);
            break;
    }

    glDraw = glDraw || _glDraw.get();
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

Rect.prototype.include = function(rect){
    var min = this.min,
        max = this.max,
        rmin = rect.min,
        rmax = rect.max;

    if(min.x > rmin.x) {
        min.x = rmin.x;
    }
    if(max.x < rmax.x) {
        max.x = rmax.x;
    }
    if(min.y > rmin.y) {
        min.y = rmin.y;
    }
    if(max.y < rmax.y) {
        max.y = rmax.y;
    }
    return this;
}

Rect.prototype.includePoint = function(point){
    var min = this.min,
        max = this.max;

    var x = point.x,
        y = point.y;

    if(min.x > x) {
        min.x = x;
    }
    if(max.x < x) {
        max.x = x;
    }
    if(min.y > y) {
        min.y = y;
    }
    if(max.y < y) {
        max.y = y;
    }

    return this;
}

Rect.prototype.includePoints = function(points){
    var min = this.min,
        max = this.max;

    var p,x,y;
    var i = -1, l = points.length;

    while(++i < l){
        p = points[i];
        x = p.x;
        y = p.y;

        if(min.x > x) {
            min.x = x;
        }
        if(max.x < x) {
            max.x = x;
        }
        if(min.y > y) {
            min.y = y;
        }
        if(max.y < y) {
            max.y = y;
        }
    }

    return this;
}

Rect.prototype.scale = function(n){
    this.min.scale(n);
    this.max.scale(n);
    return this;
}

Rect.prototype.isZero = function(){
    return this.min.x == 0 && this.min.y == 0 &&
           this.max.x == 0 && this.max.y == 0;
}

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
    return (v || new Vec2()).setf(this.getWidth(),this.getHeight());
};

Rect.prototype.getCenter = function(v){
    return (v || new Vec2()).setf((this.min.x + this.max.x) * 0.5,(this.min.y + this.max.y) * 0.5);
};

Rect.prototype.getTL = function(){
    return this.min.copy();
};

Rect.prototype.getTR = function(){
    return new Vec2(this.max.x, this.min.y);
};

Rect.prototype.getBL = function(){
    return new Vec2(this.min.x, this.max.y);
};

Rect.prototype.getBR = function(){
    return this.max.copy();
}

Rect.prototype.getAspectRatio = function(){
    return this.getWidth() / this.getHeight();
};

Rect.prototype.draw = function(){
    glTrans.pushMatrix();
    glTrans.translate3f(this.min.x,this.min.y,0);
    glDraw.drawRectStroked(this.getWidth(),this.getHeight());
    glTrans.popMatrix();
}


module.exports = Rect;