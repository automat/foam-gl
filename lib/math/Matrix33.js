function Matrix33(){
    this.m = [1,0,0,
              0,1,0,
              0,0,1];
}

Matrix33.prototype.identity = function(){
    var m = this.m;
    m[0] = m[4] = m[8] = 1;
    m[1] = m[2] = m[3] = m[5] = m[6] = m[7] = 0;
};

Matrix33.prototype.set = function(matrix){
    var m = this.m,
        m_ = matrix.m;
    m[0] = m_[0];m[1] = m_[1];m[2] = m_[2];
    m[3] = m_[3];m[4] = m_[4];m[5] = m_[5];
    m[6] = m_[6];m[7] = m_[7];m[8] = m_[8];
    return this;
};

Matrix33.prototype.setf = function(m00,m01,m02,
                                   m10,m11,m12,
                                   m20,m21,m22){
    var m = this.m;
    m[0] = m00;
    m[1] = m01;
    m[2] = m02;

    m[3] = m10;
    m[4] = m11;
    m[5] = m12;

    m[6] = m20;
    m[7] = m21;
    m[8] = m22;

    return this;
};

Matrix33.prototype.setAxesf = function(xx,xy,xz,yx,yy,yz,zx,zy,zz){
    return this.setf(xx,xy,xz,yx,yy,yz,zx,zy,zz);
};

Matrix33.prototype.setAxes = function(x,y,z){
    return this.setf(x.x, x.y, x.z, y.x, y.y, y.z, z.x, z.y, z.z);
};

Matrix33.prototype.invert = function(){
    var m = this.m;
    var m00 = m[0], m01 = m[1], m02 = m[2],
        m10 = m[3], m11 = m[4], m12 = m[5],
        m20 = m[6], m21 = m[7], m22 = m[8];
    var m01_ = m22 * m11 - m12 * m21,
        m11_ = -m22 * m10 + m12 * m20,
        m21_ = m21 * m10 - m11 * m20;

    var det = 1.0 / (m00 * m01_ + m01 * m11_ + m02 * m21_);

    m[0] = m01_ * det;
    m[1] = (-m22 * m01 + m02 * m21) * det;
    m[2] = (m12 * m01 - m02 * m11) * det;
    m[3] = m11_ * det;
    m[4] = (m22 * m00 - m02 * m20) * det;
    m[5] = (-m12 * m00 + m02 * m10) * det;
    m[6] = m21_ * det;
    m[7] = (-m21 * m00 + m01 * m20) * det;
    m[8] = (m11 * m00 - m01 * m10) * det;
    return this;
}

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

Matrix33.prototype.transposed = function(matrix){
    return (matrix || new Matrix33()).set(this).transpose();
};

Matrix33.prototype.toFloat32Array = function(arr){
    arr = arr || new Float32Array(9);
    arr.set(this.m);
    return arr;
};

module.exports = Matrix33;