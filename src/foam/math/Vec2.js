function Vec2(x,y){
    this.x = x || 0;
    this.y = y || 0;
}

Vec2.prototype.set = function(v){
    this.x = v.x;
    this.y = v.y;
    return this;
};

Vec2.prototype.setf = function(x,y){
    this.x = x;
    this.y = y;
    return this;
};

module.exports = Vec2;