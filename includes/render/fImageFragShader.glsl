varying vec2 vVertexTexCoord;
uniform sampler2D uTexImage;

void main(void)
{
    gl_FragColor = texture2D(uTexImage,vVertexTexCoord);
}