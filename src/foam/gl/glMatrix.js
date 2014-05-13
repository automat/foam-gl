var Matrix44 = require("../math/Matrix44");
var _Error   = require('../system/common/Error');
var gl       = require('./gl').context;

var glMatrix = {};


glMatrix.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';
glMatrix.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

glMatrix.ATTRIB_VERTEX_POSITION = 'aVertexPosition';
glMatrix.ATTRIB_VERTEX_NORMAL   = 'aVertexNormal';
glMatrix.ATTRIB_VERTEX_COLOR    = 'aVertexColor';
glMatrix.ATTRIB_TEXCOORD        = 'aTexcoord';

glMatrix.MODELVIEW  = 0x1A0A;
glMatrix.PROJECTION = 0x1A0B;

//
//
//

glMatrix._camera = null;

//
//  matrix stack
//

glMatrix._matrixMode = glMatrix.MODELVIEW;
glMatrix._matrixStackModelView = [];
glMatrix._matrixStackProjection = [];
glMatrix._matrixTemp0 = Matrix44.create();
glMatrix._matrixTemp1 = Matrix44.create();
glMatrix._matrixModelView = Matrix44.create();
glMatrix._matrixProjection = Matrix44.create();

/*---------------------------------------------------------------------------------------------------------*/
// Modelview / projection matrix
/*---------------------------------------------------------------------------------------------------------*/


//
//  set / get
//

glMatrix.setMatricesCamera = function(camera){
    this._camera = camera;
};

glMatrix.setMatrixMode = function(mode){
    this._matrixMode = mode;
};

glMatrix.getMatrix = function(matrix){
    return this._matrixMode == this.MODELVIEW ? this.getModelViewMatrix(matrix) : this.getProjectionMatrix(matrix);
};

glMatrix.getModelViewMatrix = function(matrix){
    return matrix ? Matrix44.set(matrix, this._matrixModelView) : this._matrixModelView;
};

glMatrix.getProjectionMatrix = function(matrix){
    return matrix ? Matrix44.set(matrix, this._matrixProjection) : this._matrixProjection;

};

glMatrix.loadIdentity = function(){
    if(this._matrixMode == glMatrix.MODELVIEW){
        this._matrixModelView = Matrix44.identity(this._camera.modelViewMatrix);
    } else {
        this._matrixProjection = Matrix44.identity(this._camera.projectionMatrix);
    }
};


//
//  stack
//

glMatrix.pushMatrix = function(){
    if(this._matrixMode == glMatrix.MODELVIEW){
        this._matrixStackModelView.push(Matrix44.copy(this._matrixModelView));
    } else {
        this._matrixStackProjection.push(Matrix44.copy(this._matrixProjection));
    }
};

glMatrix.popMatrix = function(){
    if(this._matrixMode = glMatrix.MODELVIEW){
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

glMatrix.pushMatrices = function(){
    this._matrixStackModelView.push(Matrix44.copy(this._matrixModelView));
    this._matrixStackProjection.push(Matrix44.copy(this._matrixProjection));
};

glMatrix.popMatrices = function(){
    if(this._matrixStackModelView.length == 0 || this._matrixStackProjection.length == 0){
        throw new Error(_Error.MATRIX_STACK_POP_ERROR);
    }
    this._matrixModelView  = this._matrixStackModelView.pop();
    this._matrixProjection = this._matrixStackProjection.pop();
};


//
//  mod
//

glMatrix.multMatrix = function(matrix){
    if(this._matrixMode = glMatrix.MODELVIEW){
        this._matrixModelView = Matrix44.multPost(this._matrixModelView,matrix);
    } else {
        this._matrixProjection = Matrix44.multPost()
    }
};

glMatrix.translate = function (v) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createTranslation(v[0], v[1], v[2], Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.translate3f = function (x, y, z) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createTranslation(x, y, z, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};


glMatrix.scale = function (v) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createScale(v[0], v[1], v[2], Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.scale1f = function (n) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createScale(n, n, n, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.scale3f = function (x, y, z) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createScale(x, y, z, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.scaleX = function (x) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createScale(x, 1, 1, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.scaleY = function (y) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createScale(1, y, 1, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.scaleZ = function (z) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createScale(1, 1, z, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotate = function (v) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotation(v[0], v[1], v[2], Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotate3f = function (x, y, z) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotation(x, y, z, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotateX = function (x) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotationX(x, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotateY = function (y) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotationY(y, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotateZ = function (z) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotationZ(z, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotateAxis = function (angle, v) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotationOnAxis(angle, v[0], v[1], v[2], Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glMatrix.rotateAxis3f = function (angle, x, y, z) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createRotationOnAxis(angle, x, y, z, Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};








glMatrix.setWindowMatrices = function(windowWidth,windowHeight,topleft){};



glMatrix.drawLine = function(start, end){
    var gl = this;
    var glArrayBuffer = gl.ARRAY_BUFFER;
    var glFloat = gl.FLOAT;
};


glMatrix.drawCube = function(center, size){};
glMatrix.drawCubeStroked = function(center,size){};
glMatrix.drawSphere = function(center, radius, numSegs){};
glMatrix.drawCircle = function(center,radius,numSegs){};
glMatrix.drawCircleStroked = function(center,radius,numSegs){};
glMatrix.drawEllipse = function(center,radiusX,radiusY,numSegs){};
glMatrix.drawEllipseStroked = function(center,radiusX,radiusY,numSegs){};
glMatrix.drawRect = function(rect){};
glMatrix.drawRectStroked = function(rect){};
glMatrix.drawRectRounded = function(rect,radiusCorner,numSegsCorner){};
glMatrix.drawRectRoundedStroked  =function(rect,radiusCorner,numSegsCorner){};
glMatrix.drawTriangle = function(v0,v1,v2){};
glMatrix.drawTriangleStroked = function(v0,v1,v2){};

glMatrix.draw = function(obj){};
glMatrix.drawRange = function(obj,begin,count){};

glMatrix.drawPivot = function(length){};
glMatrix.drawVector = function(vec){};
glMatrix.drawFrustum = function(camera){};

glMatrix.drawArraysSafe = function(){};

glMatrix.drawString = function(string,pos,align){};


glMatrix.color4f = function(r,g,b,a){};

module.exports = glMatrix;
