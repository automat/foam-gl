attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoord;

varying vec2 vVertexTexCoord;

void main(void)
{
    vVertexTexCoord = aVertexTexCoord;
    gl_Position = vec4(aVertexPosition,1.0);
}