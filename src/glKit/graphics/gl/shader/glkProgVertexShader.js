GLKit.ProgVertexShader=
"attribute vec3 aVertexPosition;" + 
"attribute vec3 aVertexNormal;" + 
"attribute vec4 aVertexColor;" + 
"attribute vec2 aVertexUV;" + 

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
"    vVertexPosition = uModelViewMatrix * vec4(aVertexPosition,1.0);" + 
"    vVertexNormal   = aVertexNormal;" + 
"    vVertexColor    = aVertexColor;" + 
"    vVertexUV       = aVertexUV;" + 

"    gl_Position  = uProjectionMatrix * vVertexPosition;" + 
"    gl_PointSize = uPointSize;" + 
"}";