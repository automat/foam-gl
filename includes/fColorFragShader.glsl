varying vec4 vVertexColor;
varying vec2 vVertexTexCoord;

uniform float uUseTexture;
uniform sampler2D uTexImage;

void main(void)
{
    float useTextureInv = 1.0 - uUseTexture;

    gl_FragColor = vVertexColor * (1.0 - uUseTexture) +
                   texture2D(uTexImage,vVertexTexCoord) * uUseTexture;
}
