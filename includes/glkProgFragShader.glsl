precision mediump float;

varying vec4 vColor;

varying vec2 vVertexUV;
varying vec4 vVertexPosition;
varying vec4 vVertexColor;
varying vec3 vVertexNormal;

uniform float UseLighting;

struct Light
{
    vec3  position;
    vec3  colorAmbient;
    vec3  colorDiffuse;
    vec3  colorSpecular;
    float shininess;
};

vec4 phongModel(vec4 vP, vec3 vN, vec4 vC, Light aLight) 
{
    vec3 s        = normalize(aLight.position - vP.xyz);
    vec3 v        = normalize(-vP.xyz);
    vec3 r        = reflect(-s, vN);
    float sDotN   = max(dot(s, vN), 0.0);
    vec3 ambient  = aLight.colorAmbient * vC.rgb;
    vec3 diffuse  = aLight.colorDiffuse * vC.rgb * sDotN;
    vec3 specular = (sDotN > 0.0) ? aLight.colorSpecular * pow(max(dot(r, v), 0.0), aLight.shininess) : vec3(0.0);
    return vec4(ambient + diffuse + specular,vC.a);
}

uniform Light Lights;
uniform mat3 NormalMatrix;


void main()
{
    vec3 tVertexNormal = (gl_FrontFacing ? -1.0 : 1.0) * normalize(NormalMatrix * vVertexNormal);
    gl_FragColor = (UseLighting) * phongModel(vVertexPosition,tVertexNormal,vVertexColor,Lights) + (1.0-UseLighting) * vVertexColor;
}