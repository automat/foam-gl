/*-------------------------------------*/
//  Float32Vec3
/*-------------------------------------*/

function Float32Vec3(x,y,z) {
    this.array = new Float32Array([x || 0,y || 0, z ||0]);
}

Float32Vec3.prototype.set3f = function(x,y,z){
    var array = this.array;
    array[0] = x;
    array[1] = y;
    array[2] = z;
};

Float32Vec3.prototype.add = function(v){
    var array = this.array,
        varray = v.array;
    array[0] += varray[0];
    array[1] += varray[1];
    array[2] += varray[2];
};

Float32Vec3.prototype.sub = function(v){
    var array = this.array,
        varray = v.array;
    array[0] -= varray[0];
    array[1] -= varray[1];
    array[2] -= varray[2];
};

Float32Vec3.prototype.scale = function(n){
    var array = this.array;
    array[0] *= n;
    array[1] *= n;
    array[2] *= n;
};

Float32Vec3.prototype.dot = function(v){
    var array = this.array,
        varray = v.array;
    return array[0] * varray[0] + array[1] * varray[1] + array[2] * varray[2];
};

Float32Vec3.prototype.cross = function(v,out){
    var array = this.array,
        varray = v.array;

    var x0 = array[0],
        y0 = array[1],
        z0 = array[2],
        x1 = varray[0],
        y1 = varray[1],
        z1 = varray[2];

    out = out || new Float32Vec3();
    var outarray = out.array;

    outarray[0] = y0 * z1 - y1 * z0;
    outarray[1] = z0 * x1 - z1 * x0;
    outarray[2] = x0 * y1 - x1 * y0;

    return out;
};

Float32Vec3.prototype.length = function(){
    var array = this.array;
    var x = array[0],
        y = array[1],
        z = array[2];

    return Math.sqrt(x * x + y * y + z * z);
};

Float32Vec3.prototype.normalize = function(){
    var array = this.array;
    var x = array[0],
        y = array[1],
        z = array[2];
    var l = Math.sqrt(x * x + y * y + z * z);
    if(l){
        l = 1.0 / l;
        array[0] *= l;
        array[1] *= l;
        array[2] *= l;
    }
};

Float32Vec3.prototype.invert = function(){
    var array = this.array;
    array[0] *= -1.0;
    array[1] *= -1.0;
    array[2] *= -1.0;
};

/*-------------------------------------*/
//  Float32Vec3
/*-------------------------------------*/

function Vec3(x,y,z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vec3.prototype.set3f = function(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
};

Vec3.prototype.add = function(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
};

Vec3.prototype.sub = function(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
};

Vec3.prototype.scale = function(n){
    this.x *= n;
    this.y *= n;
    this.z *= n;
};

Vec3.prototype.dot = function(v){
    return this.x * v.x + this.y * v.x + this.y * v.y;
};

Vec3.prototype.cross = function(v,out){
    var x0 = this.x,
        y0 = this.y,
        z0 = this.z,
        x1 = v.x,
        y1 = v.y,
        z1 = v.z;

    out = out || new Vec3();

    out.x = y0 * z1 - y1 * z0;
    out.y = z0 * x1 - z1 * x0;
    out.z = x0 * y1 - x1 * y0;

    return out;
};

Vec3.prototype.length = function(){
    var x = this.x,
        y = this.y,
        z = this.z;

    return Math.sqrt(x * x + y * y + z * z);
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
};

Vec3.prototype.invert = function(){
    this.x *= -1.0;
    this.y *= -1.0;
    this.z *= -1.0;
};

/*-------------------------------------*/
//  Test
/*-------------------------------------*/

var float32vec3_0 = new Float32Vec3();
var float32vec3_1 = new Float32Vec3(0.0125,0.25,0.00125);
var vec3_0 = new Vec3();
var vec3_1 = new Vec3(0.0125,0.25,0.00125);
var l = 100000;

function float32vec3_calc(){
    float32vec3_0.set3f(0.1,0.2,0.3);

    /*
    var i = -1;
    while(++i < l){
    */
        float32vec3_0.add(float32vec3_1);
        float32vec3_0.sub(float32vec3_1);
        float32vec3_0.scale(1.125);
        float32vec3_0.invert();
        float32vec3_0.normalize();
        float32vec3_0.cross(float32vec3_1,float32vec3_0);
        float32vec3_0.normalize();
    /*
    }
    */
}

function vec3_calc(){
    vec3_0.set3f(0.1,0.2,0.3);
/*
    var i = -1;
    while(++i < l){
*/
        vec3_0.add(vec3_1);
        vec3_0.sub(vec3_1);
        vec3_0.scale(1.125);
        vec3_0.invert();
        vec3_0.normalize();
        vec3_0.cross(vec3_1,float32vec3_0);
        vec3_0.normalize();
/*
    }
*/
}

function float32vec3_calc_inline(){
    // for now, just cache the array
    var array_0 = float32vec3_0.array;
    var array_1 = float32vec3_1.array;

    array_0[0] = 0.1;
    array_0[1] = 0.2;
    array_0[2] = 0.3;

    /*
     var i = -1;
     while(++i < l){
     */
    // for now, step by step

    array_0[0] += array_1[0];
    array_0[1] += array_1[1];
    array_0[2] += array_1[2];

    array_0[0] -= array_1[0];
    array_0[1] -= array_1[1];
    array_0[2] -= array_1[2];

    array_0[0] *= 1.125;
    array_0[1] *= 1.125;
    array_0[2] *= 1.125;

    array_0[0] *= -1.0;
    array_0[1] *= -1.0;
    array_0[2] *= -1.0;

    var l = Math.sqrt(array_0[0] * array_0[0] +
        array_0[1] * array_0[1] + array_0[2] * array_0[2]);

    if(l){
        l = 1.0/ l;

        array_0[0] *= l;
        array_0[1] *= l;
        array_0[2] *= l;
    }

    var x0 = array_0[0],
        y0 = array_0[1],
        z0 = array_0[2],
        x1 = array_1[0],
        y1 = array_1[1],
        z1 = array_1[2];


    array_0[0] = y0 * z1 - y1 * z0;
    array_0[1] = z0 * x1 - z1 * x0;
    array_0[2] = x0 * y1 - x1 * y0;


    l = Math.sqrt(array_0[0] * array_0[0] +
        array_0[1] * array_0[1] + array_0[2] * array_0[2]);

    if(l){
        l = 1.0/ l;

        array_0[0] *= l;
        array_0[1] *= l;
        array_0[2] *= l;
    }
    /*
     }
     */
}