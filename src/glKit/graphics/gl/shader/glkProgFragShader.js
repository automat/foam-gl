GLKit.ProgFragShader="precision mediump float;" + 

"varying vec4 vColor;" + 

"varying vec2 vVertexUV;" + 
"varying vec4 vVertexPosition;" + 
"varying vec4 vVertexColor;" + 
"varying vec3 vVertexNormal;" + 

"const int   MAX_LIGHTS = 8;" + 

"uniform float uUseLighting;" + 
"uniform float uUseMaterial;" + 

"struct Light" + 
"{" + 
"    vec3  position;" + 
"    vec3  ambient;" + 
"    vec3  diffuse;" + 
"    vec3  specular;" + 

"    vec4  halfVector;" + 
"    vec3  spotDirection;" + 
"    float spotExponent;" + 
"    float spotCutoff;" + 
"    float spotCosCutoff;" + 
"    float constantAttenuation;" + 
"    float linearAttenuation;" + 
"    float quadraticAttenuation;" + 
"};" + 

"struct Material" + 
"{" + 
"    vec4 emission;" + 
"    vec4 ambient;" + 
"    vec4 diffuse;" + 
"    vec4 specular;" + 

"    float shininess;" + 

"};" + 

"struct ColorComponent" + 
"{" + 
"    vec4 ambient;" + 
"    vec4 diffuse;" + 
"    vec4 specular;" + 
"    float shininess;" + 
"};" + 

"vec4 phongModel(vec4 position, vec3 normal, ColorComponent color, Light light)" + 
"{" + 
"    vec3 s        = normalize(light.position - position.xyz);" + 
"    vec3 v        = normalize(-position.xyz);" + 
"    vec3 r        = reflect(-s, normal);" + 
"    float sDotN   = max(dot(s, normal), 0.0);" + 
"    vec3 ambient  = light.ambient * color.ambient.rgb;" + 
"    vec3 diffuse  = light.diffuse * color.diffuse.rgb * sDotN;" + 
"    vec3 specular = (sDotN > 0.0) ? light.specular * pow(max(dot(r, v), 0.0), color.shininess) : vec3(0.0);" + 
"    return vec4(ambient + diffuse + specular,color.ambient.a);" + 
"}" + 

"uniform vec4     uAmbient;" + 
"uniform Light    uLights[8];" + 
"uniform Material uMaterial;" + 

"uniform mat3 uNormalMatrix;" + 

"void main()" + 
"{" + 
"    vec3 tVertexNormal     = normalize(uNormalMatrix * vVertexNormal);" + 

"    vec4 vertexColor = vVertexColor * (1.0-uUseMaterial);" + 

"    ColorComponent color  = ColorComponent(uMaterial.ambient   * uUseMaterial + vertexColor," + 
"                                           uMaterial.diffuse   * uUseMaterial + vertexColor," + 
"                                           uMaterial.specular  * uUseMaterial + vertexColor," + 
"                                           uMaterial.shininess * uUseMaterial + (1.0 - uUseMaterial));" + 

"    vec4 lightingColor = vec4(0,0,0,0);" + 

"    for(int i = 0;i < MAX_LIGHTS;i++)" + 
"    {" + 
"        lightingColor+=phongModel(vVertexPosition,tVertexNormal,color,uLights[i]);" + 
"    }" + 

"    gl_FragColor = uUseLighting * lightingColor + (1.0-uUseLighting) * vVertexColor;" + 
"}";