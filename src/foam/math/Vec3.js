var Vec2 = require('./Vec2');

function Vec3(x,y,z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vec3.prototype.set =  function(v){
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

Vec3.prototype.set3f = function(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};

Vec3.prototype.copy = function(v){
    return (v || new Vec3()).set3f(this.x,this.y,this.z);
};

Vec3.prototype.add = function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
};

Vec3.prototype.addf = function(x,y,z){
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
};

Vec3.prototype.sub = function(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
};

Vec3.prototype.subf = function(x,y,z){
    this.x -= x;
    this.y -= y;
    this.z -= z;
    return this;
};

Vec3.prototype.scale = function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
};

Vec3.prototype.dot =  function (v) {
    return this.x * v.x + this.y * v.y +this.z * v.z;
};

Vec3.prototype.cross =function (v) {
    var x = this.x,
        y = this.y,
        z = this.z;
    var vx = v.x,
        vy = v.y,
        vz = v.z;

    this.x = y * vz - vy * z;
    this.y = z * vx - vz * x;
    this.z = x * vy - vx * y;
    return this;
};

Vec3.prototype.crossf = function(x,y,z){
    var vx = v.x,
        vy = v.y,
        vz = v.z;

    this.x = y * vz - vy * z;
    this.y = z * vx - vz * x;
    this.z = x * vy - vx * y;
    return this;
}

Vec3.prototype.length = function(){
    var x = this.x,
        y = this.y,
        z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
};

Vec3.prototype.lengthSq = function(){
    var x = this.x,
        y = this.y,
        z = this.z;
    return x * x + y * y + z * z;
};

Vec3.prototype.normalize = function(){
    var x = this.x,
        y = this.y,
        z = this.z;
    var l = Math.sqrt(x * x + y * y + z * z);

    if(l){
        l = 1.0 / l;
        this.x *= l;
        this.y *= l;
        this.z *= l;
    }
    return this;
};

Vec3.prototype.distance = function(v){
    var dx = v.x - this.x,
        dy = v.y - this.y,
        dz = v.z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

Vec3.prototype.distanceSq = function(v){
    var dx = v.x - this.x,
        dy = v.y - this.y,
        dz = v.z - this.z;
    return dx * dx + dy * dy + dz * dz;
};

Vec3.prototype.distancef = function(x,y,z){
    var dx = x - this.x,
        dy = y - this.y,
        dz = z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

Vec3.prototype.distanceSqf = function(x,y,z){
    var dx = x - this.x,
        dy = y - this.y,
        dz = z - this.z;
    return dx * dx + dy * dy + dz * dz;
};

Vec3.prototype.limit = function(n){
    var x = this.x,
        y = this.y,
        z = this.z;

    var dsq = x * x + y * y + z * z,
        lsq = n * n;


    if(lsq > 0 && dsq > lsq){
        var nd = n / Math.sqrt(dsq);
        this.x *= nd;
        this.y *= nd;
        this.z *= nd;
    }
};

Vec3.prototype.invert = function(){
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
};

Vec3.prototype.added = function(v,out){
    return (out || new Vec3()).set(this).add(v);
};

Vec3.prototype.subbed = function(v,out){
    return (out || new Vec3()).set(this).sub(v);
};

Vec3.prototype.scaled = function(n,out){
    return (out || new Vec3()).set(this).scale(n);
};

Vec3.prototype.crossed = function(v,out){
    return (out || new Vec3()).set(this).cross(v);
};

Vec3.prototype.crossedf = function(x,y,z,out){
    return (out || new Vec3()).set(this).crossf(x,y,z);
}

Vec3.prototype.normalized = function(out){
    return (out || new Vec3()).set(this).normalize();
};

Vec3.prototype.limited = function(n,out){
    return (out || new Vec3()).set(this).limit(n);
};

Vec3.prototype.inverted = function(out){
    return (out || new Vec3()).set(this).invert();
};

Vec3.prototype.xy = function(){
    return new Vec2(this.x,this.y);
};

Vec3.prototype.xz = function(){
    return new Vec2(this.x,this.y);
};

Vec3.prototype.yz = function(){
    return new Vec2(this.y,this.x);
};


Vec3.prototype.toXAxis = function(){
    this.x = 1;
    this.y = this.z = 0;
    return this;
};

Vec3.prototype.toYAxis = function(){
    this.x = this.z = 0;
    this.y = 1;
    return this;
};

Vec3.prototype.toZAxis = function(){
    this.x = this.y = 0;
    this.z = 1;
    return this;
};

Vec3.prototype.toZero = function(){
    this.x = this.y = this.z = 0;
    return this;
};

Vec3.prototype.toOne = function(){
    this.x = this.y = this.z = 1;
    return this;
};

Vec3.prototype.toMax = function(){
    this.x = this.y = this.z = Number.MAX_VALUE;
    return this;
};

Vec3.prototype.toMin = function(){
    this.x = this.y = this.z = -Number.MAX_VALUE;
    return this;
};

Vec3.prototype.toFloat32Array = function(arr,offset){
    if(!arr && !offset){
        return new Float32Array([this.x,this.y,this.z]);
    }
    offset = offset || 0;
    arr[offset  ] = this.x;
    arr[offset+1] = this.y;
    arr[offset+2] = this.z;
    return arr;
};


Vec3.xAxis = function(){
    return new Vec3(1,0,0);
};

Vec3.yAxis = function(){
    return new Vec3(0,1,0);
};

Vec3.zAxis = function(){
    return new Vec3(0,0,1);
};

Vec3.zero = function(){
    return new Vec3();
};

Vec3.one = function(){
    return new Vec3(1,1,1);
};

Vec3.max = function(){
    return new Vec3(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE);
};

Vec3.min = function(){
    return new Vec3(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);
};

Vec3.randomPosition = function(){
    var min, max;
    if(arguments.length == 1){
        min = 0;
        max = arguments[0];
    } else {
        min = arguments[0];
        max = arguments[1];
    }

    return new Vec3(min + ( 1 + max - min ) * Math.random(),
                    min + ( 1 + max - min ) * Math.random(),
                    min + ( 1 + max - min ) * Math.random());
};

Vec3.randomDirection = function(){
    return Vec3.randomPosition(arguments).normalize();
};

Vec3.prototype.toString = function(){
    return '[' + this.x + ',' + this.y + ',' + this.z + ']';
};




module.exports = Vec3;



