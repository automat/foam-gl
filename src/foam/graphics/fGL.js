

function GL(){


     for(var p in WebGLRenderingContext){
         this[p] = WebGLRenderingContext[p];
     }

}




module.exports = GL;