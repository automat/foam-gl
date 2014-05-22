/*-------------------------------------*/
//  Flat Float32Array
/*-------------------------------------*/

function Float32Vec3Itr(data,offset){
    this.array = null;
    this._0 = null;
    this._1 = null;
    this._2 = null;
    this.setData(data,offset);
}

Float32Vec3Itr.prototype.setData = function(data,offset){
    this.array = data;
    this.setOffset(offset);
    return this;
};

Float32Vec3Itr.prototype.setOffset = function(offset){
    this._0 = offset = offset || 0;
    this._1 = offset + 1;
    this._2 = offset + 2;
    return this;
};

Float32Vec3Itr.prototype.getIndex = function(){
    return this._0;
};

Object.defineProperties(Float32Vec3Itr.prototype,[
    {
        name : 'x',
        get : function(){return this.array[this._0];},
        set : function(x){this.array[this._0] = x;}
    },
    {
        name : 'y',
        get : function(){return this.array[this._1];},
        set : function(y){this.array[this._1] = y;}
    },
    {
        name : 'z',
        get : function(){return this.array[this._2];},
        set : function(z){this.array[this._2] = z;}
    }]);

Float32Vec3Itr.prototype.set = function(v){
    var array = this.array;
    array[this._0] = v.x;
    array[this._1] = v.y;
    array[this._2] = v.z;
};

Float32Vec3Itr.prototype.set3f = function(x,y,z){
    var array = this.array;
    array[this._0] = x;
    array[this._1] = y;
    array[this._2] = z;
};

Float32Vec3Itr.prototype.add = function(v){
    var array = this.array;
    array[this._0] += v.x;
    array[this._1] += v.y;
    array[this._2] += v.z;
};

Float32Vec3Itr.prototype.sub = function(v){
    var array = this.array;
    array[this._0] -= v.x;
    array[this._1] -= v.y;
    array[this._2] -= v.z;
};

Float32Vec3Itr.prototype.scale = function(n){
    var array = this.array;
    array[this._0] *= n;
    array[this._1] *= n;
    array[this._2] *= n;
};

Float32Vec3Itr.prototype.dot = function(v){
    var array = this.array;
    return array[this._0] * v.x + array[this._1] * v.x + array[this._2] * v.y;
};

Float32Vec3Itr.prototype.cross = function(v,out){
    var array = this.array;
    var x0 = array[this._0],
        y0 = array[this._1],
        z0 = array[this._2],
        x1 = v.x,
        y1 = v.y,
        z1 = v.z;

    out = out || new Vec3();

    out.x = y0 * z1 - y1 * z0;
    out.y = z0 * x1 - z1 * x0;
    out.z = x0 * y1 - x1 * y0;

    return out;
};

Float32Vec3Itr.prototype.length = function(){
    var array = this.array;
    var x = array[this._0],
        y = array[this._1],
        z = array[this._2];

    return Math.sqrt(x * x + y * y + z * z);
};

Float32Vec3Itr.prototype.normalize = function(){
    var array = this.array;
    var x = array[this._0],
        y = array[this._1],
        z = array[this._2];
    var l = Math.sqrt(x * x + y * y + z * z);
    if(l){
        l = 1.0 / l;
        array[this._0] *= l;
        array[this._1] *= l;
        array[this._2] *= l;
    }
};

Float32Vec3Itr.prototype.invert = function(){
    var array = this.array;
    array[this._0] *= -1.0;
    array[this._1] *= -1.0;
    array[this._2] *= -1.0;
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
//  Buffer3
/*-------------------------------------*/

function BufferVec3(size) {
    this._data = new Float32Array(size * 3);
    this._itrIndex = 0;
    this.index = 0;
    this._itr = new Float32Vec3Itr(this._data,this._itrIndex);
}

Object.defineProperty(BufferVec3.prototype,'length',{
    get : function(){return this._data.length;}});

BufferVec3.prototype.getItr = function(){
    return this._itr.setOffset(this._itrIndex);
};

BufferVec3.prototype.incrItr = function(){
    this._itrIndex = (this._itrIndex + 3) % (this._data.length + 3);
    return this._itr.setOffset(this._itrIndex);
};

BufferVec3.prototype.resetItr = function(){
    this._itrIndex = 0;
    return this._itr.setOffset(this._itrIndex);
};

BufferVec3.prototype.end = function(){
    return this._data.length;
};

// non pseudo itr


BufferVec3.prototype.set = function(v){
    var array = this._data;
    var index = this.index;
    array[index  ] = v.x;
    array[index+1] = v.y;
    array[index+2] = v.z;
};

BufferVec3.prototype.set3f = function(x,y,z){
    var array = this._data;
    var index = this.index;
    array[index  ] = x;
    array[index+1] = y;
    array[index+2] = z;
};

BufferVec3.prototype.add = function(v){
    var array = this._data;
    var index = this.index;
    array[index  ] += v.x;
    array[index+1] += v.y;
    array[index+2] += v.z;
};

BufferVec3.prototype.sub = function(v){
    var array = this._data;
    var index = this.index;
    array[index  ] -= v.x;
    array[index+1] -= v.y;
    array[index+2] -= v.z;
};

BufferVec3.prototype.scale = function(n){
    var array = this._data;
    var index = this.index;
    array[index  ] *= n;
    array[index+1] *= n;
    array[index+2] *= n;
};

BufferVec3.prototype.dot = function(v){
    var array = this._data;
    var index = this.index;
    return array[index] * v.x + array[index+1] * v.x + array[index+2] * v.y;
};

BufferVec3.prototype.cross = function(v,out){
    var array = this._data;
    var index = this.index;
    var x0 = array[index  ],
        y0 = array[index+1],
        z0 = array[index+2],
        x1 = v.x,
        y1 = v.y,
        z1 = v.z;

    out = out || new Vec3();

    out.x = y0 * z1 - y1 * z0;
    out.y = z0 * x1 - z1 * x0;
    out.z = x0 * y1 - x1 * y0;

    return out;
};

BufferVec3.prototype.length = function(){
    var array = this._data;
    var index = this.index;
    var x = array[index  ],
        y = array[index+1],
        z = array[index+2];

    return Math.sqrt(x * x + y * y + z * z);
};

BufferVec3.prototype.normalize = function(){
    var array = this._data;
    var index = this.index;
    var x = array[index  ],
        y = array[index+1],
        z = array[index+2];
    var l = Math.sqrt(x * x + y * y + z * z);
    if(l){
        l = 1.0 / l;
        array[index  ] *= l;
        array[index+1] *= l;
        array[index+2] *= l;
    }
};

BufferVec3.prototype.invert = function(){
    var array = this._data;
    var index = this.index;
    array[index  ] *= -1.0;
    array[index+1] *= -1.0;
    array[index+2] *= -1.0;
};


/*-------------------------------------*/
//  test
/*-------------------------------------*/

var buffer = new BufferVec3(10000);
var vec3 = new Vec3(0.1,0.2,0.3);


function itr_calc(){
    var itr = buffer.resetItr();
    while(itr.getIndex() != buffer.end()){
        itr.add(vec3);
        itr.scale(1.125);
        itr.sub(vec3);
        itr.invert();
        itr.normalize();
        itr = buffer.incrItr();
    }
}

function itr_calc_wrapped_access(){
    buffer.index = 0;
    var length = buffer.length;

    while(buffer.index < length){
        buffer.add(vec3);
        buffer.scale(1.125);
        buffer.sub(vec3);
        buffer.invert();
        buffer.normalize();
        buffer.index += 3;
    }
}

function flat_inline_calc() {
    var data = buffer._data,l = data.length;
    var i = 0;
    var x, y, z , _l;
    var vx = vec3.x, vy = vec3.y, vz = vec3.z;
    while(i < l){
        x = data[i];
        y = data[i+1];
        z = data[i+2];

        x += vx;
        y += vy;
        z += vz;

        x *= 1.125;
        y *= 1.125;
        z *= 1.125;

        x -= vx;
        y -= vy;
        z -= vz;

        x *= -1;
        y *= -1;
        z *= -1;

        _l = Math.sqrt(x * x + y * y + z * z);
        if(_l){
            _l = 1.0 / _l;
            x *= _l;
            y *= _l;
            z *= _l;
        }

        data[  i] = x;
        data[i+1] = y;
        data[i+2] = z;

        i += 3;
    }
}

function flat_inline_calc_concatenated() {
    var data = buffer._data,l = data.length;
    var i = 0;
    var x, y, z , _l;
    var vx = vec3.x, vy = vec3.y, vz = vec3.z;
    var _0,_1,_2;
    while(i < l){
        _0 = i;
        _1 = i + 1;
        _2 = i + 2;

        x = ((data[_0] + vx) * 1.125 - vx) * -1;
        y = ((data[_1] + vy) * 1.125 - vy) * -1;
        z = ((data[_2] + vz) * 1.125 - vz) * -1;

        _l = Math.sqrt(x * x + y * y + z * z);
        if(_l){
            _l = 1.0 / _l;
            x *= _l;
            y *= _l;
            z *= _l;
        }

        data[_0] = x;
        data[_1] = y;
        data[_2] = z;

        i += 3;
    }
}



