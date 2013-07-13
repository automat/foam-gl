GLKit.ProgVertexShader=
"attribute vec3 VertexPosition;" + 
"attribute vec3 VertexNormal;" + 
"attribute vec4 VertexColor;" + 
"attribute vec2 VertexUV;" + 

"varying vec4 vVertexPosition;" + 
"varying vec3 vVertexNormal;" + 
"varying vec4 vVertexColor;" + 
"varying vec2 vVertexUV;" + 

"varying vec4 vColor;" + 

"uniform mat4 uModelViewMatrix;" + 
"uniform mat4 uProjectionMatrix;" + 

"uniform float uPointSize;" + 

"void main()" + 
"{" + 
"    vVertexColor    = VertexColor;" + 
"    vVertexNormal   = VertexNormal;" + 
"    vVertexPosition = uModelViewMatrix * vec4(VertexPosition,1.0);" + 
"    vVertexUV       = VertexUV;" + 

"    gl_Position  = uProjectionMatrix * vVertexPosition;" + 
"    gl_PointSize = uPointSize;" + 
"}";