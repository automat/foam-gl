#ifdef VERTEX_SHADER
precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

varying   vec4 vVertexPosition;
varying   vec4 vVertexColor;
varying   vec3 vVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform float uPointSize;

void main(){
	vVertexColor    = aVertexColor;
    vVertexNormal   = normalize(uNormalMatrix * aVertexNormal);
    vVertexPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    
	gl_Position   = uProjectionMatrix * vVertexPosition;
	gl_PointSize  = uPointSize;
}
#endif

#ifdef FRAGMENT_SHADER
precision highp float;

#define NUM_LIGHTS 3

varying vec4 vVertexPosition;
varying vec3 vVertexNormal;
varying vec4 vVertexColor;

// we just use position and ambient color
struct Light{
	vec4 position;
	vec3 ambient;
};

// we just use the ambient color
struct Material{
	vec4 ambient;
};

uniform Light uLights[NUM_LIGHTS];
uniform float uUseLighting;

uniform Material uMaterial;

void main(){
    // insert your favourite light model here
    Light light;
    float intensity;
    vec4 colorSum = vec4(0,0,0,1.0);
    
    for (int i = 0; i < NUM_LIGHTS; ++i) {
    	light = uLights[i];
        intensity = max(dot(vVertexNormal, normalize(light.position.xyz - vVertexPosition.xyz)),0.0);
        colorSum += uMaterial.ambient * vec4(light.ambient * intensity,1.0);
    }
    
    gl_FragColor = (1.0 - uUseLighting) * vVertexColor + uUseLighting * colorSum;
}
#endif