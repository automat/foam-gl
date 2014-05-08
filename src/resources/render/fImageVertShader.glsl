attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoord;

uniform vec2 uWindowSize;

varying vec2 vVertexTexCoord;

void main(void)
{
    vVertexTexCoord = aVertexTexCoord;

    gl_Position = vec4(aVertexPosition.x / uWindowSize.x * 2 - 1,
                       (aVertexPosition.z / uWindowSize.y * 2 - 1) * -1,
                       0,
                       1.0);
}