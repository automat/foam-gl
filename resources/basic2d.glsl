#ifdef VERTEX_SHADER
precision highp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aTexcoord;

varying   vec4 vVertexColor;
varying   vec2 vTexcoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

uniform float uPointSize;

void main(){
    vVertexColor = aVertexColor;
    vTexcoord    = aTexcoord;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
    gl_PointSize = uPointSize;
}
#endif


#ifdef FRAGMENT_SHADER
precision highp float;

uniform sampler2D uTexture;

varying vec4  vVertexColor;
varying vec2  vTexcoord;

uniform float uUseTexture;

uniform vec4  uColor;
uniform float uUseUniformColor;

void main(){
    gl_FragColor = (vVertexColor * (1.0 - uUseUniformColor) + uColor * uUseUniformColor) * (1.0 - uUseTexture) + texture2D(uTexture,vTexcoord) * uUseTexture;
}
#endif