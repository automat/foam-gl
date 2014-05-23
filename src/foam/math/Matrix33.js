function Matrix33(){
    this.m = [1,0,0,
              0,1,0,
              0,0,1];
}

Matrix33.prototype.set = function(mat33){
    var m = this.m,
        m_m = mat33.m;
    m[0] = m_m[0];
    m[1] = m_m[1];
    m[2] = m_m[2];
    m[3] = m_m[3];
    m[4] = m_m[4];
    m[5] = m_m[5];
    m[6] = m_m[6];
    m[7] = m_m[7];
    m[8] = m_m[8];
    return this;
};

Matrix33.prototype.transpose = function(){
    var m = this.m;
    var m1 = m[1], m2 = m[2], m5 = m[5];
    m[1] = m[3];
    m[2] = m[6];
    m[3] = m1;
    m[5] = m[7];
    m[6] = m2;
    m[7] = m5;
    return this;
};

Matrix33.prototype.transposed = function(mat33){
    mat33 = mat33 || new Matrix33();
    return mat33.set(this).transpose();
};

Matrix33.prototype.toFloat32Array = function(arr){
    if(!arr){
        return new Float32Array(this.m);
    }
    arr.set(this.m);
    return arr;
};

module.exports = Matrix33;