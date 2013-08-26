GLKit.Batch = function(numVertices)
{
    this.vertices = new Float32Array(numVertices);
    this.colors   = new Float32Array(numVertices / GLKit.Vec3.SIZE * GLKit.Color.SIZE);
    this.normals  = new Float32Array(numVertices);
    this.indices  = [];

    this._vertIndex  = -1;
    this._normIndex  = -1;
    this._colrIncdex = -1;
    this._indicesNum = 0;
};

GLKit.Batch.prototype.beginBatch = function()
{

};

GLKit.Batch.prototype.setVertex = function(x,y,z)
{

};

GLKit.Batch.prototype.setColor  = function(r,g,b,a)
{

};

GLKit.Batch.prototype.setNormal = function(x,y,z)
{

};