#ifdef VERTEX_SHADER
precision highp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying   vec4 vVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uPointSize;



void main(){
	vVertexColor = aVertexColor;
	gl_Position  = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = uPointSize;
}
#endif

#ifdef FRAGMENT_SHADER
precision highp float;
varying vec4 vVertexColor;

void main(){
	gl_FragColor = vVertexColor;
}
#endif