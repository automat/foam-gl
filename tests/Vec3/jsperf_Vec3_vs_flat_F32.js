/*-------------------------------------*/
//  Flat Float32Array
/*-------------------------------------*/

var Float32Vec3 = {
    create: function (x, y, z) {
        return new Float32Array([ x || 0, y || 0, z || 0]);
    },

    set: function (v0, v1) {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];

        return v0;
    },

    set3f: function (v, x, y, z) {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    copy: function (v) {
        return new Float32Array(v);
    },

    add: function (v0, v1) {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];

        return v0;
    },

    sub: function (v0, v1) {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];

        return v0;
    },

    scale: function (v, n) {
        v[0] *= n;
        v[1] *= n;
        v[2] *= n;

        return v;
    },

    dot: function (v0, v1) {
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    },

    cross: function (v0, v1, vo) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        vo = vo || this.create();

        vo[0] = y0 * z1 - y1 * z0;
        vo[1] = z0 * x1 - z1 * x0;
        vo[2] = x0 * y1 - x1 * y0;


        return vo;
    },

    length: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    normalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var l = Math.sqrt(x * x + y * y + z * z);

        if(l){
            l = 1.0 / l;
            v[0] *= l;
            v[1] *= l;
            v[2] *= l;
        }

        return v;
    },

    invert: function (v) {
        v[0] *= -1;
        v[1] *= -1;
        v[2] *= -1;

        return v;
    }
};

/*-------------------------------------*/
//  Vec3
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

var vec3f32 = Float32Vec3.create(0,0,0);
var vec3f32_other = Float32Vec3.create(0,0,0);

var vec3 = new Vec3(0,0,0);
var vec3_other = new Vec3(0,0,0);

var l = 100000;

function flat_float32vec3_calc(){
    Float32Vec3.set3f(vec3f32,0.1,0.2,0.3);
    Float32Vec3.set3f(vec3f32_other,0.1,0.2,0.3);
    /*
     var i = -1;
     while(++i < l){
     */
    Float32Vec3.add(vec3f32,vec3f32_other);
    Float32Vec3.sub(vec3f32,vec3f32_other);
    Float32Vec3.scale(vec3f32,1.125);
    Float32Vec3.invert(vec3f32);
    Float32Vec3.normalize(vec3f32);
    Float32Vec3.cross(vec3f32_other,vec3f32);
    Float32Vec3.normalize(vec3f32);
    /*
     }
     */
}

function vec3_obj_calc(){
    vec3.set3f(0.1,0.2,0.3);
    vec3_other.set3f(0.1,0.2,0.3);
    /*
     var i = -1;
     while(++i < l){
     */
    vec3.add(vec3_other);
    vec3.sub(vec3_other);
    vec3.scale(1.125);
    vec3.invert();
    vec3.normalize();
    vec3.cross(vec3_other,vec3);
    vec3.normalize();
    /*
     }
     */
}

