#ifdef VERTEX_SHADER
precision highp float;

attribute vec3 aVertexPosition;

attribute vec2 aTexcoord;
varying   vec2 vTexcoord;

uniform   mat4 uProjectionMatrix;
uniform   mat4 uModelViewMatrix;

void main(){
    vTexcoord = aTexcoord;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
    gl_PointSize = 3.0;
}
#endif


#ifdef FRAGMENT_SHADER
precision highp float;
uniform vec4 uColor;

varying vec2 vTexcoord;
uniform sampler2D uTexture;
uniform float uUseTexture;

void main(){
    gl_FragColor = texture2D(uTexture, vTexcoord) * uUseTexture + uColor * (1.0 - uUseTexture);
}
#endif