precision lowp float;
attribute vec3 aVertexPos;
varying vec2 vTexcoord;

void main(){
    vec2 pos    = sign(aVertexPos.xy);
    vTexcoord   = pos;

    gl_Position = vec4(pos, 0.0, 1.0) - 0.5;
}