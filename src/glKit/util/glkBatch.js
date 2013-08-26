//for testing
GLKit.Batch = function(size)
{

    this._size    = size;
    this.vertices = new Float32Array(size);
    this.colors   = new Float32Array(size / GLKit.Vec3.SIZE * GLKit.Color.SIZE);
    this.normals  = new Float32Array(size);
    this.uvs      = new Float32Array(size / GLKit.Vec3.SIZE * GLKit.Vec2.SIZE);
    this.indices  = [];//new Uint16Array(size*size);


    this._vertIndex  = 0;
    this._normIndex  = 0;
    this._colrIncdex = 0;
    this._indicesNum = 0;

    this._tempMatrix = null;
    this._tempVec    = GLKit.Vec3.make();
};

GLKit.Batch.prototype.begin = function()
{
    this._vertIndex  = 0;
    this._normIndex  = 0;
    this._colrIncdex = 0;
    this._indicesNum = 0;
    this.indices     = [];
};

GLKit.Batch.prototype.setVertex3f = function(x,y,z)
{
    var vertices = this.vertices;

    var tempVec    = this._tempVec;
        tempVec[0] = x;
        tempVec[1] = y;
        tempVec[2] = z;

    if(this._tempMatrix)tempVec = GLKit.Mat44.multVec(this._tempMatrix,this._tempVec);

    vertices[this._vertIndex++] = tempVec[0];
    vertices[this._vertIndex++] = tempVec[1];
    vertices[this._vertIndex++] = tempVec[2];

    //this.indices[this._indicesNum++] = this._indicesNum;
    this.indices.push(this._indicesNum++);
};

///lalal
GLKit.Batch.prototype._safeAllocate = function()
{
    var indices = new Uint16Array(this.indices);
    this.indices = new Uint16Array(indices.length * 1.1);
    this.indices.set(indices);
}


GLKit.Batch.prototype.setColor  = function(r,g,b,a)
{

};

GLKit.Batch.prototype.setNormal = function(x,y,z)
{

};

GLKit.Batch.prototype.setTransformMatrix = function(mat)
{

};

GLKit.Batch.prototype.setTransformMatrixForObjectSize = function(mat,objSize)
{

};

GLKit.Batch.prototype._draw = function(gl)
{
   //console.log(this._indicesNum);
    //console.log(this.indices);

    //indices.set

    gl.drawElements(this.vertices,this.normals,this.colors,this.uvs,new Uint16Array(this.indices),gl.LINE_STRIP,this._indicesNum);


};

GLKit.Batch.prototype.getVerticesNum = function()
{
    return Math.max(this._vertIndex/3,0);
};

GLKit.Batch.prototype.getVerticesNumAllocated = function()
{
    return this._size/3;
};

GLKit.Batch.prototype._allocate = function()
{
    var i = -1;
};