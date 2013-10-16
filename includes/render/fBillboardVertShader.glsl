attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

attribute vec2 aVertexTexCoord;
attribute vec2 aQuadCornerScale;

varying vec4 vVertexColor;
varying vec2 vVertexTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void)
{
    vVertexTexCoord = aVertexTexCoord;
    vVertexColor    = aVertexColor;

    vec3 vecRight = uModelViewMatrix[0].xyz;
    vec3 vecUp    = uModelViewMatrix[1].xyz;

    vec3 vecQuad  = vecRight * aQuadCornerScale.x +
                    vecUp    * aQuadCornerScale.y;


    /*
    gl_Position = uProjectionMatrix *
                  (vec4(aVertexPosition,1.0) + vec4(uModelViewMatrix[3].xyz,0.0));
                  */

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
}