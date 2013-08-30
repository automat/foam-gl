GLKit.LineBuffer = function(gl,size)
{
    this._gl      = gl;

    this._vbo     = null;
    this.vertices = null;
    this.colors   = null;

    this._vertIndex = 0;
    this._colIndex  = 0;

    if(size)this.allocate(size);
};

/*---------------------------------------------------------------------------------------------------------*/

//probably shouldnt do this
GLKit.LineBuffer.prototype.bind   = function()
{
    var glkgl = this._gl,
        gl    = glkgl.gl;

    glkgl.disableDefaultNormalAttribArray();
    glkgl.disableDefaultTexCoordsAttribArray();
    gl.bindBuffer(gl.ARRAY_BUFFER,this._vbo);
};

GLKit.LineBuffer.prototype.unbind = function()
{
    var glkgl = this._gl;

    glkgl.enableDefaultNormalAttribArray();
    glkgl.enableDefaultTexCoordsAttribArray();
    glkgl.bindDefaultVBO();
};

GLKit.LineBuffer.prototype.pushVertex3f = function(x,y,z)
{
    var vertices = this.vertices;

    //if(this._safeAllocate && this._vertIndex > vertices.length - 3)this.allocate(vertices.length * 1.1);

    vertices[this._vertIndex++] = x;
    vertices[this._vertIndex++] = y;
    vertices[this._vertIndex++] = z;
};

GLKit.LineBuffer.prototype.pushColor4f = function(r,g,b,a)
{
    var colors = this.colors;

    colors[this._colIndex++] = r;
    colors[this._colIndex++] = g;
    colors[this._colIndex++] = b;
    colors[this._colIndex++] = a;
};

GLKit.LineBuffer.prototype.setVertex3f = function(x,y,z,index3)
{
    index3*=3;
    var vertices = this.vertices;

    vertices[index3  ] = x;
    vertices[index3+1] = y;
    vertices[index3+2] = z;
};

GLKit.LineBuffer.prototype.setColor4f = function(r,g,b,a,index4)
{
    index4*=4;
    var colors = this.colors;

    colors[index4  ] = r;
    colors[index4+1] = g;
    colors[index4+2] = b;
    colors[index4+3] = a;
};

GLKit.LineBuffer.prototype.pushVertex    = function(v){this.pushVertex3f(v[0],v[1],v[2]);};
GLKit.LineBuffer.prototype.pushColor     = function(c){this.pushColor4f(c[0],c[1],c[2],c[3]);};
GLKit.LineBuffer.prototype.setVertex     = function(v,index){this.setVertex3f(v[0],v[1],v[2],index);};
GLKit.LineBuffer.prototype.setColor      = function(c,index){this.setColor4f(c[0],c[1],c[2],c[3],index);};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer.prototype.buffer = function()
{
    var glkl          = this._gl,
        gl            = glkl.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;



    var vblen = this.vertices.byteLength,
        cblen = this.colors.byteLength;

    var offsetV = 0,
        offsetC = offsetV + vblen;

    gl.bufferData(glArrayBuffer,vblen + cblen, gl.DYNAMIC_DRAW);
    gl.bufferSubData(glArrayBuffer,offsetV,this.vertices);
    gl.bufferSubData(glArrayBuffer,offsetC,this.colors);
    gl.vertexAttribPointer(glkl.getDefaultVertexAttrib(),glkl.SIZE_OF_VERTEX,glFloat,false,0,offsetV);
    gl.vertexAttribPointer(glkl.getDefaultColorAttrib(), glkl.SIZE_OF_COLOR, glFloat,false,0,offsetC);
};

GLKit.LineBuffer.prototype.draw = function(first,count)
{
    var glkgl = this._gl,
        gl    = glkgl.gl;

   glkgl.setMatricesUniform();
   gl.drawArrays(glkgl.getDrawMode(),
                 first || 0,
                 count || this.vertices.length / glkgl.SIZE_OF_VERTEX);
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer.prototype.reset = function()
{
    this._vertIndex = 0;
    this._colIndex  = 0;
};

GLKit.LineBuffer.prototype.dispose  = function()
{
    this._gl.gl.deleteBuffer(this._vbo);
    this.vertices = null;
    this.colors   = null;
    this.reset();
};

GLKit.LineBuffer.prototype.allocate = function(size)
{
    var glkgl = this._gl,
        gl    = glkgl.gl;

    //need to deleteBuffer, instead of reusing it, otherwise error, hm
    if(this._vbo){gl.deleteBuffer(this._vbo);}this._vbo = gl.createBuffer();
    this.vertices = this.vertices || new Float32Array(0);
    this.colors   = this.colors   || new Float32Array(0);

    var vertLen = this.vertices.length,
        colsLen = this.colors.length;

    if(vertLen < size)
    {
        var temp;

        temp = new Float32Array(size);
        temp.set(this.vertices);
        temp.set(new Float32Array(temp.length - vertLen),vertLen);
        this.vertices = temp;

        temp = new Float32Array(size / 3 * 4);
        temp.set(this.colors);
        temp.set(new Float32Array(temp.length - colsLen),colsLen);
        this.colors = temp;

    }
};

/*---------------------------------------------------------------------------------------------------------*/

GLKit.LineBuffer.prototype.getSizeAllocated = function(){return this.vertices.length;};
GLKit.LineBuffer.prototype.getSizePushed    = function(){return this._vertIndex;};

