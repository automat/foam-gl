var WebGL    = require("./webgl"),
    Matrix44 = require("../math/Matrix44");
var _Error   = require('../system/common/Error');

var Camera = require('./Camera');

var assert = require('../util/Log').assert;

function GL(gl){
    WebGL.apply(this,arguments);


    this._camera = null;

    //
    //  matrix stack
    //

    this._matrixMode = GL.MODELVIEW;
    this._matrixStackModelView = [];
    this._matrixStackProjection = [];
    this._matrixModelView = Matrix44.create();
    this._matrixProjection = Matrix44.create();

}

GL.prototype = Object.create(WebGL.prototype);

/*---------------------------------------------------------------------------------------------------------*/
// Modelview / projection matrix
/*---------------------------------------------------------------------------------------------------------*/

GL.prototype.setMatricesCamera = function(camera){
    this._camera = camera;
};

GL.prototype.setMatrixMode = function(mode){
    this._matrixMode = mode;
};

GL.prototype.loadIdentity = function(){
    if(this._matrixMode == GL.MODELVIEW){
        this._matrixModelView = Matrix44.identity(this._camera.modelViewMatrix);
    } else {
        this._matrixProjection = Matrix44.identity(this._camera.projectionMatrix);
    }
};

GL.prototype.pushMatrix = function(){
    if(this._matrixMode == GL.MODELVIEW){
        this._matrixStackModelView.push(Matrix44.copy(this._matrixModelView));
    } else {
        this._matrixStackProjection.push(Matrix44.copy(this._matrixProjection));
    }
};

GL.prototype.popMatrix = function(){
    if(this._matrixMode = GL.MODELVIEW){
        if(this._matrixStackModelView.length == 0){
            throw new Error(_Error.MATRIX_STACK_POP_ERROR);
        }
        this._matrixModelView = this._matrixStackModelView.pop();
        return this._matrixModelView;
    } else {
        if(this._matrixStackProjection.length == 0){
            throw new Error(_Error.MATRIX_STACK_POP_ERROR);
        }
        this._matrixProjection = this._matrixStackProjection.pop();
        return this._matrixProjection;
    }
};

GL.prototype.translate3f = function(x,y,z){
    this._matrixModelView = Matrix44.identity()
};

GL.prototype.rotate3f = function(x,y,z){
};


GL.prototype.scale3f = function(x,y,z){};

GL.prototype.multMatrix = function(matrix){
    if(this._matrixMode = GL.MODELVIEW){

    }
};

GL.prototype.getMatrix = function(mat){};
GL.prototype.pushMatrices = function(){};
GL.prototype.popMatrices = function(){};






GL.prototype.getModelViewMatrix = function(mat){};
GL.prototype.getProjectionMatrix = function(mat){};
GL.prototype.setWindowMatrices = function(windowWidth,windowHeight,topleft){};
GL.prototype.setViewport = function(x0,y0,x1,y1){};


GL.prototype.drawLine = function(start, end){};
GL.prototype.drawCube = function(center, size){};
GL.prototype.drawCubeStroked = function(center,size){};
GL.prototype.drawSphere = function(center, radius, numSegs){};
GL.prototype.drawCircle = function(center,radius,numSegs){};
GL.prototype.drawCircleStroked = function(center,radius,numSegs){};
GL.prototype.drawEllipse = function(center,radiusX,radiusY,numSegs){};
GL.prototype.drawEllipseStroked = function(center,radiusX,radiusY,numSegs){};
GL.prototype.drawRect = function(rect){};
GL.prototype.drawRectStroked = function(rect){};
GL.prototype.drawRectRounded = function(rect,radiusCorner,numSegsCorner){};
GL.prototype.drawRectRoundedStroked  =function(rect,radiusCorner,numSegsCorner){};
GL.prototype.drawTriangle = function(v0,v1,v2){};
GL.prototype.drawTriangleStroked = function(v0,v1,v2){};

GL.prototype.draw = function(obj){};
GL.prototype.drawRange = function(obj,begin,count){};

GL.prototype.drawPivot = function(length){};
GL.prototype.drawVector = function(vec){};
GL.prototype.drawFrustum = function(camera){};

GL.prototype.drawArraysSafe = function(){};

GL.prototype.drawString = function(string,pos,align){};


GL.prototype.color4f = function(r,g,b,a){};


GL.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';
GL.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

GL.MODELVIEW  = 0x1A0A;
GL.PROJECTION = 0x1A0B;



module.exports = GL;