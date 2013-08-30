GLKit.ProgFragImgShader=
"precision mediump float;" + 

"varying vVertexUV;" + 
"uniform sampler2D uScreenImg;" + 

"void main()" + 
"{" + 
"    gl_FragColor = texture2D(uScreenImg,vVertexUV);" + 
"}";