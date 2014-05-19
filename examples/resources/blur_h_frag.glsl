precision highp float;
uniform sampler2D uTexture;
uniform float     uTexelSize;
uniform float     uScale;

varying vec2      vTexcoord;

void main(){
    float offset = uTexelSize * uScale;
    
    vec4 sum = vec4(0.0);
    sum += texture2D(uTexture, vec2(vTexcoord.x - 4.0 * offset, vTexcoord.y)) * 0.05;
    sum += texture2D(uTexture, vec2(vTexcoord.x - 3.0 * offset, vTexcoord.y)) * 0.09;
    sum += texture2D(uTexture, vec2(vTexcoord.x - 2.0 * offset, vTexcoord.y)) * 0.12;
    sum += texture2D(uTexture, vec2(vTexcoord.x - 1.0 * offset, vTexcoord.y)) * 0.15;
    sum += texture2D(uTexture, vec2(vTexcoord.x,                vTexcoord.y)) * 0.16;
    sum += texture2D(uTexture, vec2(vTexcoord.x + 1.0 * offset, vTexcoord.y)) * 0.15;
    sum += texture2D(uTexture, vec2(vTexcoord.x + 2.0 * offset, vTexcoord.y)) * 0.12;
    sum += texture2D(uTexture, vec2(vTexcoord.x + 3.0 * offset, vTexcoord.y)) * 0.09;
    sum += texture2D(uTexture, vec2(vTexcoord.x + 4.0 * offset, vTexcoord.y)) * 0.05;
    
    gl_FragColor = sum;
}