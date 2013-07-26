GLKit.Program = function(gl,vertShader,fragShader)
{
    this.gl = gl;
    this.vertShader = vertShader;
    this.fragShader = fragShader;
};

GLKit.Program.prototype.load = function()
{
    var gl = this.gl,
        program = gl.createProgram();

    gl.attachShader(program,this.vertShader);
    gl.attachShader(program,this.fragShader);
    gl.linkProgram(program);




};


