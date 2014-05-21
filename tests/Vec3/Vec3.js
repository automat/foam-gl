function Vec3() {
    //  float32array
    this.array = null;

    //  offset in array, just used when used as view
    this._0 = 0;
    this._1 = 1;
    this._2 = 2;

    switch (arguments.length){
        case 1 : //  copy
            if(arguments[0] instanceof Float32Array){
                this.array = new Float32Array(arguments[0]);
            } else {
                this.array = new Float32Array([arguments[0],arguments[0],arguments[0]]);
            }
            break;
        case 2 : // view with offset
            this.array = arguments[0];
            this._0 = arguments[1];
            this._1 = this._0 + 1;
            this._2 = this._1 + 1;
            break; // x y z
        case 3 :
            this.array = new Float32Array([arguments[0],arguments[1],arguments[2]]);
            break;
        default :
            this.array = new Float32Array([0,0,0]);
            break;
    }

    //  'normal' members
    this.a = this.array[0];
    this.b = this.array[1];
    this.c = this.array[2];
}

// x,y,z getter / setter - defineProperty

Object.defineProperty(Vec3.prototype, 'x', {
    get : function(){return this.array[0];},
    set : function(x){this.array[0] = x;},
    enumerable : true
});

Object.defineProperty(Vec3.prototype, 'y', {
    get : function(){return this.array[1];},
    set : function(y){this.array[1] = y;},
    enumerable : true
});

Object.defineProperty(Vec3.prototype, 'z', {
    get : function(){return this.array[2];},
    set : function(z){this.array[2] = z;},
    enumerable : true
});

// x,y,z getter / setter with offfset - defineProperty

Object.defineProperty(Vec3.prototype, 'x_012', {
    get : function(){return this.array[this._0];},
    set : function(x){this.array[this._0] = x;},
    enumerable : true
});

Object.defineProperty(Vec3.prototype, 'y_012', {
    get : function(){return this.array[this._1];},
    set : function(y){this.array[this._1] = y;},
    enumerable : true
});

Object.defineProperty(Vec3.prototype, 'z_012', {
    get : function(){return this.array[this._2];},
    set : function(z){this.array[this._2] = z;},
    enumerable : true
});

// set

// set array from vector
Vec3.prototype.set = function(v){
    var array = this.array,
        varray = v.array;
    array[0] = varray[0];
    array[1] = varray[1];
    array[2] = varray[2];
};

//  set array from vector - using float32array set
Vec3.prototype.setArr = function(v){
    this.array.set(v);
};

//  set array from vector using offset
Vec3.prototype.set_012 = function(v){
    var array = this.array,
        varray = v.array;

    var _0 = this._0, _1 = this._1, _2 = this._2;
    var v_0 = v._0, v_1 = v._1, v_2 = v._2;

    array[_0] = varray[v_0];
    array[_1] = varray[v_1];
    array[_2] = varray[v_2];
};

//  set array from component
Vec3.prototype.set3f = function(x,y,z){
    var array = this.array;
    array[0] = x;
    array[1] = y;
    array[2] = z;
};

//  set array from component using offset
Vec3.prototype.set3f_012 = function(x,y,z){
    var array = this.array;
    var _0 = this._0, _1 = this._1, _2 = this._2;

    array[_0] = x;
    array[_1] = y;
    array[_2] = z;
};


// add

Vec3.prototype.add3f = function(x,y,z){
    var array = this.array;
    array[0] += x;
    array[1] += x;
    array[2] += x;
};

Vec3.prototype.add = function(v){
    var array = this.array,
        varray = v.array;
    array[0] += varray[0];
    array[1] += varray[1];
    array[2] += varray[2];
};

Vec3.prototype.add3f_012 = function(x,y,z){
    var array = this.array;
    var _0 = this._0, _1 = this._1, _2 = this._2;
    array[_0] += x;
    array[_1] += y;
    array[_2] += z;
};


Vec3.prototype.add_012 = function(v){
    var array = this.array,
        varray = v.array;
    var _0 = this._0, _1 = this._1, _2 = this._2;
    var v_0 = v._0, v_1 = v._1, v_2 = v._2;
    array[_0] += varray[v_0];
    array[_1] += varray[v_1];
    array[_2] += varray[v_2];
};

Vec3.prototype.add3f_abc = function(x,y,z){
    this.a += x;
    this.b += y;
    this.c += z;
};

Vec3.prototype.add_abc = function(v){
    this.a += v.a;
    this.b += v.b;
    this.c += v.c;
};


// scale

Vec3.prototype.scale = function(a){
    var array = this.array;
    array[0] *= a;
    array[1] *= a;
    array[2] *= a;
};

Vec3.prototype.add = function(v){
    var array = this.array,
        varray = v.array;
    array[0] += varray[0];
    array[1] += varray[1];
    array[2] += varray[2];
};

Vec3.prototype.addf = function(x,y,z){
    x = x || 0;
    y = y || 0;
    z = z || 0;
    var array = this.array;
    array[0] += x;
    array[1] += y;
    array[2] += z;
};

Vec3.prototype.sub = function(v){
    var array = this.array,
        varray = v.array;
    array[0] -= varray[0];
    array[1] -= varray[1];
    array[2] -= varray[2];
};

Vec3.prototype.subf = function(x,y,z){
    x = x || 0;
    y = y || 0;
    z = z || 0;
    var array = this.array;
    array[0] -= x;
    array[1] -= y;
    array[2] -= z;
};

Vec3.prototype.move = function(float32Array,offset){
    var array = this.array;
    float32Array[offset++] = array[0];
    float32Array[offset++] = array[1];
    float32Array[offset  ] = array[2];
};

Vec3.prototype.moveset = function(float32Array,offset){
    float32Array.set(this.arra)
};

Vec3.prototype.moveabc = function(float32Array,offset){
    float32Array[offset++] = this.a;
    float32Array[offset++] = this.b;
    float32Array[offset  ] = this.c;
};









module.exports = Vec3;