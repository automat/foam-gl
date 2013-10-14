attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

varying vec3 vVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uPointSize;

void main(void)
{
    vVertexNormal = aVertexNormal;

    gl_Position  = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    gl_PointSize = uPointSize;
}