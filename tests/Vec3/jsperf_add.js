var Vec3 = require('./Vec3');

var l = 10000;
var PI = Math.PI;
var other = new Vec3(PI,PI,PI);

// add vector from component with func
function add_add3f(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.add3f(PI,PI,PI);
    }
}

// add vector from vector
function add_add(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.add(other);
    }
}

// add vector from component with 'normal' components
function add_add3f_abc(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.add3f_abc(PI,PI,PI);
    }
}

// add vector from vector with 'normal' components
function add_add_abc(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.add_abc(other);
    }
}

// add vector from component with func and offset
function add3f_add3f_012(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.add3f_012(PI,PI,PI);
    }
}

// add vector from vector with func and offset
function add3f_add_012(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.add_012(other);
    }
}

// add inline with getter
function add_xyz(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.x += PI;
        vec3.y += PI;
        vec3.z += PI;
    }
}

// add inline with array
function add_xyz_arr(){
    var vec3 = new Vec3();
    var array = vec3.array;
    var i = -1;
    while (++i < l) {
        array[0] += PI;
        array[1] += PI;
        array[2] += PI;
    }
}

// add inline with getter and offset
function add_xyz_012(){
    var vec3 = new Vec3();
    var i = -1;
    while (++i < l) {
        vec3.x_012 += PI;
        vec3.y_012 += PI;
        vec3.z_012 += PI;
    }
}

// add inline with array and offset
function add_xyz_arr_012(){
    var vec3 = new Vec3();
    var array = vec3.array;
    var _0 = vec3._0, _1 = vec3._1, _2 = vec3._2;
    var i = -1;
    while (++i < l) {
        array[_0] += PI;
        array[_1] += PI;
        array[_2] += PI;
    }
}




