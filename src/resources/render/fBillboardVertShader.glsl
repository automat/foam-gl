attribute vec3 aPosition;
attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexScale;

attribute vec2 aVertexTexCoord;

varying vec4 vVertexColor;
varying vec2 vVertexTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void)
{
    vVertexTexCoord = aVertexTexCoord;
    vVertexColor    = aVertexColor;

    vec3 vecDim = vec3(aPosition.x + aVertexPosition.x * aVertexScale.x,
                       aPosition.y,
                       aPosition.z + aVertexPosition.y * aVertexScale.y);

    vec3 vecRight = vec3(uModelViewMatrix[0].x,
                         uModelViewMatrix[1].x,
                         uModelViewMatrix[2].x);

    vec3 vecUp    = vec3(uModelViewMatrix[0].y,
                         uModelViewMatrix[1].y,
                         uModelViewMatrix[2].y);

    vec3 vecCor = vecRight * vecDim.x + vecUp * vecDim.z;


    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vecCor,1.0);
}