var Matrix44 = require("../math/Matrix44");
var _Error   = require('../system/common/Error');
var glu      = require('./glu');
var gl       = require('./gl');
var ObjectUtil = require('../util/ObjectUtil');

var glTrans = {};


glTrans.UNIFORM_MODELVIEW_MATRIX  = 'uModelViewMatrix';
glTrans.UNIFORM_PROJECTION_MATRIX = 'uProjectionMatrix';

glTrans.ATTRIB_VERTEX_POSITION = 'aVertexPosition';
glTrans.ATTRIB_VERTEX_NORMAL   = 'aVertexNormal';
glTrans.ATTRIB_VERTEX_COLOR    = 'aVertexColor';
glTrans.ATTRIB_TEXCOORD        = 'aTexcoord';

glTrans.MODELVIEW  = 0x1A0A;
glTrans.PROJECTION = 0x1A0B;

//
//
//

glTrans._camera = null;

//
//  matrix stack
//

glTrans._matrixMode = glTrans.MODELVIEW;
glTrans._matrixStackModelView = [];
glTrans._matrixStackProjection = [];
glTrans._matrixTemp0 = Matrix44.create();
glTrans._matrixTemp1 = Matrix44.create();
glTrans._matrixModelView = Matrix44.create();
glTrans._matrixProjection = Matrix44.create();


glTrans._viewportRectArr = new Array(4);

/*---------------------------------------------------------------------------------------------------------*/
// Modelview / projection matrix
/*---------------------------------------------------------------------------------------------------------*/

glTrans.setWindowMatrices = function(windowWidth,windowHeight,topleft){
    if(ObjectUtil.isUndefined(topleft) || topleft){
        this._matrixProjection = glu.ortho(this._matrixProjection,0,windowWidth,windowHeight,0,-1,1);
    } else {
        this._matrixProjection = glu.ortho(this._matrixProjection,0,windowWidth,0,windowHeight,-1,1);
    }
};

//
//  set / get
//

glTrans.setMatricesCamera = function(camera){
    this._matrixModelView  = camera.modelViewMatrix;
    this._matrixProjection = camera.projectionMatrix;
};

glTrans.setMatrixMode = function(mode){
    this._matrixMode = mode;
};

glTrans.getModelViewMatrix = function(matrix){
    return matrix ? Matrix44.set(matrix, this._matrixModelView) : this._matrixModelView;
};

glTrans.getProjectionMatrix = function(matrix){
    return matrix ? Matrix44.set(matrix, this._matrixProjection) : this._matrixProjection;
};

glTrans.getMatrix = function(matrix){
    return this._matrixMode == this.MODELVIEW ? this.getModelViewMatrix(matrix) : this.getProjectionMatrix(matrix);
};

glTrans.getNormalMatrix = function(){

};

glTrans.loadIdentity = function(){
    Matrix44.identity(this._matrixMode == this.MODELVIEW ? this._matrixModelView : this._matrixProjection);
};


//
//  stack
//

glTrans.pushMatrix = function(){
    if(this._matrixMode == glTrans.MODELVIEW){
        this._matrixStackModelView.push(Matrix44.copy(this._matrixModelView));
    } else {
        this._matrixStackProjection.push(Matrix44.copy(this._matrixProjection));
    }
};

glTrans.popMatrix = function(){
    if(this._matrixMode = glTrans.MODELVIEW){
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

glTrans.pushMatrices = function(){
    this._matrixStackModelView.push(Matrix44.copy(this._matrixModelView));
    this._matrixStackProjection.push(Matrix44.copy(this._matrixProjection));
};

glTrans.popMatrices = function(){
    if(this._matrixStackModelView.length == 0 || this._matrixStackProjection.length == 0){
        throw new Error(_Error.MATRIX_STACK_POP_ERROR);
    }
    this._matrixModelView  = this._matrixStackModelView.pop();
    this._matrixProjection = this._matrixStackProjection.pop();
};


//
//  mod
//

glTrans.multMatrix = function(matrix){
    var _matrix = this._matrixMode == glTrans.MODELVIEW ? this._matrixModelView : this._matrixProjection;
    Matrix44.multPost(_matrix, matrix, _matrix);
};

glTrans.translate = function (v) {
    this._mModelView = Matrix44.multPost(this._mModelView, Matrix44.createTranslation(v[0], v[1], v[2], Matrix44.identity(this._matrixTemp0), Matrix44.identity(this._matrixTemp1)));
};

glTrans.translate3f = function (x, y, z) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createTranslation(x,y,z,this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0, this._matrixModelView);
};

glTrans.scale = function (v) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createScale(v[0],v[1],v[2],this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0, this._matrixModelView);
};

glTrans.scale1f = function (x) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createScale(x,x,x,this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0, this._matrixModelView);
};

glTrans.scale3f = function (x, y, z) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createScale(x,y,z,this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0, this._matrixModelView);
};

glTrans.rotate = function (v) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createRotation(v[0],v[1],v[2], this._matrixTemp0);
    Matrix44.multPost(this._mModelView, this._matrixTemp0, this._matrixModelView);
};

glTrans.rotate3f = function (x, y, z) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createRotation(x,y,z,this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0, this._matrixModelView);
};


glTrans.rotateAxis = function (angle, v) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createRotationOnAxis(angle, v[0], v[1], v[2], this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0);
};

glTrans.rotateAxis3f = function (angle, x, y, z) {
    Matrix44.identity(this._matrixTemp0);
    Matrix44.createRotationOnAxis(angle, x, y, z, this._matrixTemp0);
    Matrix44.multPost(this._matrixModelView, this._matrixTemp0);
};


module.exports = glTrans;
