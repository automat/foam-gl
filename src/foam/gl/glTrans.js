var Matrix44 = require("../math/Matrix44");
var _Error   = require('../system/common/Error');
var glu      = require('./glu');
var gl       = require('./gl');
var ObjectUtil = require('../util/ObjectUtil');

var glTrans = {};


glTrans.MODELVIEW  = 0x1A0A;
glTrans.PROJECTION = 0x1A0B;

//
//  matrix stack
//

glTrans._matrixMode = glTrans.MODELVIEW;
glTrans._matrixStackModelView = [];
glTrans._matrixStackProjection = [];
glTrans._matrixTemp0 = new Matrix44();
glTrans._matrixTemp1 = new Matrix44();
glTrans._matrixModelView = new Matrix44();
glTrans._matrixProjection = new Matrix44();

glTrans._matrixF32Temp0 = new Float32Array(16);
glTrans._matrixF32Temp1 = new Float32Array(16);


glTrans._viewportRectArr = new Array(4);

/*---------------------------------------------------------------------------------------------------------*/
// Modelview / projection matrix
/*---------------------------------------------------------------------------------------------------------*/

glTrans.setWindowMatrices = function(windowWidth,windowHeight,topleft){
    this._matrixProjection.identity();
    this._matrixModelView.identity();
    if(ObjectUtil.isUndefined(topleft) || topleft){
        glu.ortho(this._matrixProjection.m,0,windowWidth,windowHeight,0,-1,1);
    } else {
        glu.ortho(this._matrixProjection.m,0,windowWidth,0,windowHeight,-1,1);
    }
};

//
//  set / get
//

glTrans.setMatricesCamera = function(camera){
    this._matrixModelView.set(camera.modelViewMatrix);
    this._matrixProjection.set(camera.projectionMatrix);
};

glTrans.setMatrixMode = function(mode){
    this._matrixMode = mode;
};

glTrans.getModelViewMatrixF32 = function(matrix){
    return this._matrixModelView.toFloat32Array(matrix || this._matrixF32Temp0);
};

glTrans.getProjectionMatrixF32 = function(matrix){
    return this._matrixProjection.toFloat32Array(matrix || this._matrixF32Temp0);
};

glTrans.getMatrixF32 = function(matrix){
    return this._matrixMode == this.MODELVIEW ? this.getModelViewMatrixF32(matrix) : this.getProjectionMatrixF32(matrix);
};

glTrans.getNormalMatrix = function(){

};

glTrans.loadIdentity = function(){
    (this._matrixMode == this.MODELVIEW ? this._matrixModelView : this._matrixProjection).identity();
};


//
//  stack
//

glTrans.pushMatrix = function(){
    if(this._matrixMode == glTrans.MODELVIEW){
        this._matrixStackModelView.push(this._matrixModelView.copy());
    } else {
        this._matrixStackProjection.push(this._matrixProjection.copy());
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
    this._matrixStackModelView.push(this._matrixModelView.copy());
    this._matrixStackProjection.push(this._matrixProjection.copy());
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
    (this._matrixMode == glTrans.MODELVIEW ? this._matrixModelView : this._matrixProjection).mult(matrix);
};

glTrans.translate = function (v) {
    this.translate3f(v.x, v.y, v.z);
};

glTrans.translate3f = function (x, y, z) {
    var temp = this._matrixTemp0.identity();
    Matrix44.createTranslation(x,y,z,temp);
    this._matrixModelView.mult(this._matrixTemp0);
};

glTrans.scale = function (v) {
    this.scale3f(v.x, v.y, v.z);
};

glTrans.scale1f = function (x) {
    this.scale3f(x,x,x);
};

glTrans.scale3f = function (x, y, z) {
    this._matrixModelView.mult(Matrix44.createScale(x,y,z,this._matrixTemp0.identity()));
};

glTrans.rotate = function (v) {
    this._matrixModelView.mult(Matrix44.createRotation(v.x, v.y, v.z, this._matrixTemp0.identity()));
};

glTrans.rotate3f = function (x, y, z) {
    this._matrixModelView.mult(Matrix44.createRotation(x,y,z,this._matrixTemp0.identity()));
};

glTrans.rotateAxis = function (angle, v) {
    this._matrixTemp0.identity();
    Matrix44.createRotationOnAxis(angle, v.x, v.y, v.z, this._matrixTemp0);
    this._matrixModelView = this._matrixTemp0.mult(this._matrixModelView);
};

glTrans.rotateAxis3f = function (angle, x, y, z) {
    this._matrixTemp0.identity();
    Matrix44.createRotationOnAxis(angle, x, y, z, this._matrixTemp0);
    this._matrixModelView = this._matrixTemp0.mult(this._matrixModelView);
};


module.exports = glTrans;
