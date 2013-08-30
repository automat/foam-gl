attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;

varying vec3 vVertexUV;

void main()
{
    gl_Position = vec4(aVertexPosition,1.0);
    vVertexUV   = aVertexUV;
}