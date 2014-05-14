#ifdef VERTEX_SHADER
precision highp float;
attribute vec3 aVertexPosition;
uniform   mat4 uProjectionMatrix;
uniform   mat4 uModelViewMatrix;


void main(){
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
    gl_PointSize = 3.0;
}
#endif


#ifdef FRAGMENT_SHADER
precision highp float;
uniform vec4 uColor;
void main(){
    gl_FragColor = uColor;
}
#endif