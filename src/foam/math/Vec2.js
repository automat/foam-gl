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

Vec2.prototype.copy = function(v){
    return (v || new Vec2()).setf(this.x,this.y);
};

Vec2.prototype.add = function(v){
    this.x += v.x;
    this.y += v.y;
    return this;
};

Vec2.prototype.addf = function(x,y){
    this.x += x;
    this.y += y;
    return this;
};

Vec2.prototype.sub = function(v){
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

Vec2.prototype.subf = function(x,y){
    this.x -= x;
    this.y -= y;
    return this;
};

Vec2.prototype.scale = function(n){
    this.x *= n;
    this.y *= n;
    return this;
};

Vec2.prototype.mult = function(v){
    this.x *= v.x;
    this.y *= v.y;
    return this;
};

Vec2.prototype.multf = function(x,y){
    this.x *= x;
    this.y *= y;
    return this;
};

Vec2.prototype.dot =  function (v) {
    return this.x * v.x + this.y * v.y;
};

Vec2.prototype.length = function(){
    var x = this.x,
        y = this.y;
    return Math.sqrt(x * x + y * y);
};

Vec2.prototype.lengthSq = function(){
    var x = this.x,
        y = this.y;
    return x * x + y * y;
};

Vec2.prototype.normalize = function(){
    var x = this.x,
        y = this.y;
    var l = Math.sqrt(x * x + y * y);

    if(l){
        l = 1.0 / l;
        this.x *= l;
        this.y *= l;
    }
    return this;
};

Vec2.prototype.distance = function(v){
    var dx = v.x - this.x,
        dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Vec2.prototype.distanceSq = function(v){
    var dx = v.x - this.x,
        dy = v.y - this.y;
    return dx * dx + dy * dy;
};

Vec2.prototype.distancef = function(x,y){
    var dx = x - this.x,
        dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Vec2.prototype.distanceSqf = function(x,y,z){
    var dx = x - this.x,
        dy = y - this.y;
    return dx * dx + dy * dy;
};

Vec2.prototype.limit = function(n){
    var x = this.x,
        y = this.y;

    var dsq = x * x + y * y,
        lsq = n * n;

    if(lsq > 0 && dsq > lsq){
        var nd = n / Math.sqrt(dsq);
        this.x *= nd;
        this.y *= nd;
    }
};

Vec2.prototype.invert = function(){
    this.x *= -1;
    this.y *= -1;
    return this;
};

Vec2.prototype.added = function(v,out){
    return (out || new Vec2()).set(this).add(v);
};

Vec2.prototype.subbed = function(v,out){
    return (out || new Vec2()).set(this).sub(v);
};

Vec2.prototype.scaled = function(n,out){
    return (out || new Vec2()).set(this).scale(n);
};

Vec2.prototype.normalized = function(out){
    return (out || new Vec2()).set(this).normalize();
};

Vec2.prototype.limited = function(n,out){
    return (out || new Vec2()).set(this).limit(n);
};

Vec2.prototype.inverted = function(out){
    return (out || new Vec2()).set(this).invert();
};

Vec2.prototype.toZero = function(){
    this.x = this.y = 0;
    return this;
};

Vec2.prototype.toOne = function(){
    this.x = this.y = 1;
    return this;
};

Vec2.prototype.toMax = function(){
    this.x = this.y = Number.MAX_VALUE;
    return this;
};

Vec2.prototype.toMin = function(){
    this.x = this.y =-Number.MAX_VALUE;
    return this;
};

Vec2.prototype.toFloat32Array = function(arr,offset){
    if(!arr && !offset){
        return new Float32Array([this.x,this.y]);
    }
    offset = offset || 0;
    arr[offset  ] = this.x;
    arr[offset+1] = this.y;
    return arr;
};


Vec2.xAxis = function(){
    return new Vec2(1,0);
};

Vec2.yAxis = function(){
    return new Vec2(0,1);
};

Vec2.zero = function(){
    return new Vec2();
};

Vec2.one = function(){
    return new Vec2(1,1);
};

Vec2.max = function(){
    return new Vec2(Number.MAX_VALUE,Number.MAX_VALUE);
};

Vec2.min = function(){
    return new Vec2(-Number.MAX_VALUE,-Number.MAX_VALUE);
};

Vec2.randomPosition = function(){
    var min, max;
    if(arguments.length == 1){
        min = 0;
        max = arguments[0];
    } else {
        min = arguments[0];
        max = arguments[1];
    }

    return new Vec2(min + ( 1 + max - min ) * Math.random(),
                    min + ( 1 + max - min ) * Math.random());
};

Vec2.randomDirection = function(){
    return Vec2.randomPosition(arguments).normalize();
};

Vec2.prototype.toString = function(){
    return '[' + this.x + ',' + this.y + ']';
};

module.exports = Vec2;