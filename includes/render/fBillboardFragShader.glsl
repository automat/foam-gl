varying vec4 vVertexColor;
varying vec2 vVertexTexCoord;

uniform sampler2D uTexture;

uniform float uUseTexture;

void main(void)
{

    gl_FragColor = vVertexColor * (1.0 - uUseTexture) + texture2D(uTexture,vVertexTexCoord) * uUseTexture;
    /*gl_FragColor = vVertexColor;*/
}