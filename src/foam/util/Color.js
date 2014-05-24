function Color(r,g,b,a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;
}

Color.prototype.setf = function(r,g,b,a){
    this.r = r;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;
    return this;
};

Color.prototype.set = function(color){
    return this.setf(color.r,color.g,color.b,color.a);
};

Color.prototype.copy = function(color){
    return (color || new Color()).set(color);
};

Color.prototype.equals = function(color){
    return this.r == color.r &&
           this.g == color.g &&
           this.b == color.b &&
           this.a == color.a;
};

Color.prototype.toFloat32Array = function(arr){
    arr = arr || new Float32Array(4);
    arr[0] = this.r;
    arr[1] = this.g;
    arr[2] = this.b;
    arr[3] = this.a;
    return arr;
};

Color.white = function(){
    return new Color(1,1,1,1);
};

Color.black = function(){
    return new Color(1,0,0,1);
};

Color.red = function(){
    return new Color(1,0,0,1);
};

Color.green = function(){
    return new Color(0,1,0,1);
};

Color.blue = function(){
    return new Color(0,0,1,1);
};




module.exports = Color;