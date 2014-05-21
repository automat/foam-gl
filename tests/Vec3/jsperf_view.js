var Vec3 = require('Vec3');

function Vec3xyz(){
    this.x = this.y = this.z = 0;
}

var num = 10000;
var buffer = new Float32Array(3 * num);

var arrVec3 = new Array(num);
var arrVec3xyz = new Array(num);

var j = -1;
while(++j < num){
    arrVec3[j] = new Vec3(buffer, j * 3);
    arrVec3xyz[j] = new Vec3xyz();
}

var PI = Math.PI;

function write_vec3_buffer(){
    var i = -1;
    var vec3;
    while(++i < num){
        vec3 = arrVec3[i];
        vec3.x_012 = PI;
        vec3.y_012 = PI;
        vec3.z_012 = PI;
    }
}

function write_vec3_xyz(){
    var i = -1;
    var vec3;
    while(++i < num){
        vec3 = arrVec3xyz[i];
        vec3.x = PI;
        vec3.y = PI;
        vec3.z = PI;
    }
}


function write_vec3_buffer_set(){
    var i = -1;
    var vec3;
    while(++i < num){
        arrVec3[i].set3f(PI,PI,PI);
    }
}

