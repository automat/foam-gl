#ifdef VERTEX_SHADER
precision highp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying   vec4 vVertexColor;

attribute vec2 aTexcoord;
varying   vec2 vTexcoord;

uniform   mat4 uProjectionMatrix;
uniform   mat4 uModelViewMatrix;

void main(){
    vTexcoord    = aTexcoord;
    vVertexColor = aVertexColor;
    gl_Position  = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
    gl_PointSize = 3.0;
}
#endif


#ifdef FRAGMENT_SHADER
precision highp float;
uniform vec4 uColor;

varying vec2 vTexcoord;
varying vec4 vVertexColor;

uniform sampler2D uTexture;
uniform float uUseTexture;

void main(){
    gl_FragColor = texture2D(uTexture, vTexcoord) * vVertexColor * uUseTexture + vVertexColor * (1.0 - uUseTexture);
}
#endif