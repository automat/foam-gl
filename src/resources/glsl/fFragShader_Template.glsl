varying vec4 vVertexPosition;
varying vec3 vVertexNormal;
varying vec4 vVertexColor;
varying vec2 vVertexTexCoord;

uniform float uUseLighting;
uniform float uUseMaterial;
uniform float uUseTexture;

uniform mat3 uNormalMatrix;

uniform vec3 uAmbient;
uniform sampler2D uTexImage;

const int   MAX_LIGHTS = 8;

struct Light
{
    vec4  position;
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;

    vec4  halfVector;
    vec3  spotDirection;
    float spotExponent;
    float spotCutoff;
    float spotCosCutoff;
    float constantAttenuation;
    float linearAttenuation;
    float quadraticAttenuation;
};

struct Material
{
    vec4 emission;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;

    float shininess;
};

uniform Light    uLights[8];
uniform Material uMaterial;


vec4 model(vec4 position, vec3 normal,vec4 ambient, vec4 diffuse, vec4 specular, Light light)
{
    return vec4(1);
}



void main(void)
{
    float useLightingInv = 1.0 - uUseLighting;
    float useMaterialInv = 1.0 - uUseMaterial;
    float useTextureInv  = 1.0 - uUseTexture;

    vec3 vertexNormal = (gl_FrontFacing ? -1.0 : 1.0) * normalize(uNormalMatrix * vVertexNormal);

    vec4 vertexColor  = vVertexColor * useMaterialInv;
    vec4 textureColor = texture2D(uTexImage,vVertexTexCoord);
    vec4 resultColor  = vertexColor * useTextureInv + textureColor * uUseTexture;

     vec4 lightingColor = vec4(0,0,0,0);

        for(int i = 0;i < MAX_LIGHTS;i++)
        {
            lightingColor+=phongModel(vVertexPosition,vertexNormal,color,uLights[i]);
        }

}