GLKit.GL = function(gl)
{
    var _gl = this._gl = gl;

    this._progVertexShader = GLKit.ShaderLoader.loadShaderFromString(_gl,GLKit.ProgVertexShader,_gl.VERTEX_SHADER);
    this._progFragShader   = GLKit.ShaderLoader.loadShaderFromString(_gl,GLKit.ProgFragShader,  _gl.FRAGMENT_SHADER);

    var program = this._program = GLKit.ProgLoader.loadProgram(_gl,this._progVertexShader,this._progFragShader);

    _gl.useProgram(program);

    this._abo  = _gl.createBuffer();
    this._eabo = _gl.createBuffer();

    _gl.bindBuffer(_gl.ARRAY_BUFFER,         this._abo);
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this._eabo);


    





};

GLKit.GL.prototype.getGL = function(){return this._gl;};


GLKit.GL.prototype.setModelViewMatrix  = function(matrix){this._modelViewMatrix  = matrix;};
GLKit.GL.prototype.setProjectionMatrix = function(matrix){this._projectionMatrix = matrix;};
GLKit.GL.prototype.getModelViewMatrix  = function(){return this._modelViewMatrix;};
GLKit.GL.prototype.getProjectionMatrix = function(){return this._projectionMatrix;};