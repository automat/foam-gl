GLKit.LineBuffer = function(gl)
{
    this._gl                   = gl;
    this._vbo                  = null;
    this._vertices             = null;
    this._colors               = null;
    this._resetToDefaultBuffer = true;
    this._safeAllocate         = false;

    this._vertIndex = 0;
    this._colIndex  = 0;
};

GLKit.LineBuffer.prototype.getVertexArray = function(){return this._vertices;};
GLKit.LineBuffer.prototype.getColorsArray = function(){return this._colors;};

GLKit.LineBuffer.prototype.bind   = function(){this._gl.getGL().bindBuffer(this._gl.ARRAY_BUFFER,this._vbo);};
GLKit.LineBuffer.prototype.unbind = function(){this._gl.bindDefaultVBO();};

GLKit.LineBuffer.prototype.pushVertex3f = function(x,y,z)
{
    var vertices = this._vertices;

    if(this._safeAllocate && this._vertIndex > vertices.length - 3)this.allocate(vertices.length * 1.1);

    vertices[this._vertIndex++] = x;
    vertices[this._vertIndex++] = y;
    vertices[this._vertIndex++] = z;
};

GLKit.LineBuffer.prototype.pushColor4f = function(r,g,b,a)
{
    var colors = this._colors;

    colors[this._colIndex++] = r;
    colors[this._colIndex++] = g;
    colors[this._colIndex++] = b;
    colors[this._colIndex++] = a;
};


GLKit.LineBuffer.prototype.setVertex3f = function(x,y,z,index3)
{
    index3*=3;

    var vertices = this._vertices;

    vertices[index3  ] = x;
    vertices[index3+1] = y;
    vertices[index3+2] = z;
};


GLKit.LineBuffer.prototype.setColor4f = function(r,g,b,a,index4)
{
    index4*=4;

    var colors = this._colors;

    colors[index4  ] = r;
    colors[index4+1] = g;
    colors[index4+2] = b;
    colors[index4+3] = a;
};

GLKit.LineBuffer.prototype.pushVertex    = function(v){this.pushVertex3f(v[0],v[1],v[2]);};
GLKit.LineBuffer.prototype.pushColor     = function(c){this.pushColor4f(c[0],c[1],c[2],c[3]);};
GLKit.LineBuffer.prototype.setVertex     = function(v,index){this.setVertex3f(v[0],v[1],v[2],index);};
GLKit.LineBuffer.prototype.setColor      = function(c,index){this.setColor4f(c[0],c[1],c[2],c[3],index);};
GLKit.LineBuffer.prototype.setVertexComp = function(x,index){this._vertices[index] = x;};
GLKit.LineBuffer.prototype.setColorComp  = function(x,index){this._colors[index] = x;}

GLKit.LineBuffer.prototype.buffer = function()
{
    var gl  = this._gl,
        _gl = gl.getGL();

    var glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    var vblen = this._vertices.byteLength,
        cblen = this._colors.byteLength;

    var offsetV = 0,
        offsetC = offsetV + vblen;

    _gl.bufferData(glArrayBuffer,vblen + cblen, _gl.DYNAMIC_DRAW);

    _gl.bufferSubData(glArrayBuffer,offsetV,this._vertices);
    _gl.bufferSubData(glArrayBuffer,offsetC,this._colors);

    _gl.vertexAttribPointer(gl.getDefaultVertexAttrib(),gl.SIZE_OF_VERTEX,glFloat,false,0,offsetV);
    _gl.vertexAttribPointer(gl.getDefaultColorAttrib(), gl.SIZE_OF_COLOR, glFloat,false,0,offsetC);
};

GLKit.LineBuffer.prototype.draw = function(first,count)
{
    var gl  = this._gl,_gl = gl.getGL();
   _gl.drawArrays(gl.getDrawMode(),first,count);
};


GLKit.LineBuffer.prototype.dispose  = function()
{
    this._gl.getGL().deleteBuffer(this._vbo);
    this._vertices = null;
    this._colors   = null;
    this._reset();
};

GLKit.LineBuffer.prototype.reset = function()
{
    this._vertIndex = 0;
    this._colIndex  = 0;
};

GLKit.LineBuffer.prototype.allocate = function(size)
{
    this._vbo      = this._vbo      || this._gl.getGL().createBuffer();
    this._vertices = this._vertices || new Float32Array(0);
    this._colors   = this._colors   || new Float32Array(0);

    var vertLen = this._vertices.length,
        colsLen = this._colors.length;


    if(vertLen < size)
    {
        var temp = new Float32Array(size);
        temp.set(this._vertices);
        temp.set(new Float32Array(temp.length - vertLen),this._vertices.length);
        this._vertices = temp;

        temp = new Float32Array(size / 3 * 4);
        temp.set(this._colors);
        temp.set(new Float32Array(temp.length - colsLen),colsLen);
        this._colors = temp;

    }
};

GLKit.LineBuffer.prototype.safeAllocate = function(bool){this._safeAllocate = bool;};


GLKit.LineBuffer.prototype.getSizeAllocated = function(){return this._vertices.length;};
GLKit.LineBuffer.prototype.getSizePushed    = function(){return this._vertIndex;};

GLKit.LineBuffer.prototype.resetToDefaultBuffer = function(bool){this._resetToDefaultBuffer = bool;}

