var Vec3 = require('./Vec3');

var l = 10000;
var other = new Vec3(1,1,1);

// set vector from component with func
function write_set3f(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.set3f(1,1,1);
    }
}

// set vector from vector with func
function write_set(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.set(other);
    }
}

// set vector from component with func and offset
function write_set3f_012(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.set3f_012(1, 1, 1);
    }
}

// set vector from component with setter
function write_xyz(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.x = 1;
        vec3.y = 1;
        vec3.z = 1;
    }
}

// set vector from component with setter and offset
function write_xyz_012(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.x_012 = 1;
        vec3.y_012 = 1;
        vec3.z_012 = 1;
    }
}

// set vector from component with 'normal' components
function write_abc(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.a = 1;
        vec3.b = 1;
        vec3.c = 1;
    }
}

// set vector from component with direct array assignment
function write_arr(){
    var vec3 = new Vec3();
    var arr = vec3.array;
    var i = -1;
    while (++i < l) {
        arr[0] = 1;
        arr[1] = 1;
        arr[2] = 1;
    }
}

// set vector from component with direct array assignment and offset
function write_arr_012(){
    var vec3 = new Vec3();
    var arr = vec3.array;
    var _0 = vec3._0,_1 = vec3._1, _2 = vec3._2;
    var i = -1;
    while (++i < l) {
        arr[_0] = 1;
        arr[_1] = 1;
        arr[_2] = 1;
    }
}
