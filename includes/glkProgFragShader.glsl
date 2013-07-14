precision mediump float;

varying vec4 vColor;

varying vec2 vVertexUV;
varying vec4 vVertexPosition;
varying vec4 vVertexColor;
varying vec3 vVertexNormal;

uniform float uLighting;

struct Light
{
    vec3  position;
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;
    float shininess;

    vec4  halfVector;
    vec3  spotDirection;
    float spotExponent;
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

vec4 phongModel(vec4 position, vec3 normal, vec4 color, Light light)
{
    vec3 s        = normalize(light.position - position.xyz);
    vec3 v        = normalize(-position.xyz);
    vec3 r        = reflect(-s, normal);
    float sDotN   = max(dot(s, normal), 0.0);
    vec3 ambient  = light.ambient * color.rgb;
    vec3 diffuse  = light.diffuse * color.rgb * sDotN;
    vec3 specular = (sDotN > 0.0) ? light.specular * pow(max(dot(r, v), 0.0), light.shininess) : vec3(0.0);
    return vec4(ambient + diffuse + specular,color.a);
}

uniform Light    uLights;
uniform Material uMaterial;

uniform mat3 uNormalMatrix;


void main()
{
    vec3 tVertexNormal = (gl_FrontFacing ? -1.0 : 1.0) * normalize(uNormalMatrix * vVertexNormal);
    vec4 lightingColor = phongModel(vVertexPosition,tVertexNormal,vVertexColor,uLights);
    gl_FragColor = uLighting * lightingColor + (1.0-uLighting) * vVertexColor;
}