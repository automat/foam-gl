var Matrix44 = require("../math/Matrix44");
var _Error   = require('../system/common/Error');
var glu      = require('./glu');
var gl       = require('./gl');
var ObjectUtil = require('../util/ObjectUtil');

var glTrans = {};


glTrans.MODELVIEW  = 0x1A0A;
glTrans.PROJECTION = 0x1A0B;

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

/**
 * Sets the current projection matrix to fit to match screen-space.
 * @param {Number} windowWidth - The width
 * @param {Number} windowHeight - The height
 * @param {Boolean} [topleft=true] - Sets the origin to the topleft
 */

glTrans.setWindowMatrices = function(windowWidth,windowHeight,topleft){
    this._matrixProjection.identity();
    this._matrixModelView.identity();
    if(ObjectUtil.isUndefined(topleft) || topleft){
        glu.ortho(this._matrixProjection.m,0,windowWidth,windowHeight,0,-1,1);
    } else {
        glu.ortho(this._matrixProjection.m,0,windowWidth,0,windowHeight,-1,1);
    }
};


/**
 * Set the current camera modelview and projection matrix
 * @param {Camera} camera - The Camera
 */

glTrans.setMatricesCamera = function(camera){
    this._matrixModelView.set(camera.modelViewMatrix);
    this._matrixProjection.set(camera.projectionMatrix);
};

/**
 * Set the matrix to be used.
 * @param mode - glTrans.MODELVIEW or glTrans.PROJECTION
 */

glTrans.setMatrixMode = function(mode){
    this._matrixMode = mode;
};

/**
 * Get the current modelview matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getModelViewMatrixF32 = function(matrix){
    return this._matrixModelView.toFloat32Array(matrix || this._matrixF32Temp0);
};

/**
 * Get the current projection matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getProjectionMatrixF32 = function(matrix){
    return this._matrixProjection.toFloat32Array(matrix || this._matrixF32Temp0);
};

/**
 * Get the current modelview or projection matrix as Float32Array
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getMatrixF32 = function(matrix){
    return this._matrixMode == this.MODELVIEW ? this.getModelViewMatrixF32(matrix) : this.getProjectionMatrixF32(matrix);
};

glTrans.getNormalMatrix = function(){

};

/**
 * Resets the current matrix to its identity.
 */

glTrans.loadIdentity = function(){
    (this._matrixMode == this.MODELVIEW ? this._matrixModelView : this._matrixProjection).identity();
};


/**
 * Push the current matrix onto the matrix stack.
 */

glTrans.pushMatrix = function(){
    if(this._matrixMode == glTrans.MODELVIEW){
        this._matrixStackModelView.push(this._matrixModelView.copy());
    } else {
        this._matrixStackProjection.push(this._matrixProjection.copy());
    }
};

/**
 * Remove the current matrix from the matrix stack.
 * @returns {Matrix44}
 */

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

/**
 * Push the current transformation and projection matrix onto their matrix stacks.
 */

glTrans.pushMatrices = function(){
    this._matrixStackModelView.push(this._matrixModelView.copy());
    this._matrixStackProjection.push(this._matrixProjection.copy());
};

/**
 * Remove the current transformation and projection matrix from their matrix stacks.
 */

glTrans.popMatrices = function(){
    if(this._matrixStackModelView.length == 0 || this._matrixStackProjection.length == 0){
        throw new Error(_Error.MATRIX_STACK_POP_ERROR);
    }
    this._matrixModelView  = this._matrixStackModelView.pop();
    this._matrixProjection = this._matrixStackProjection.pop();
};

/**
 * Multiply the current matrix.
 * @param {Matrix} matrix - The matrix
 */

glTrans.multMatrix = function(matrix){
    (this._matrixMode == glTrans.MODELVIEW ? this._matrixModelView : this._matrixProjection).mult(matrix);
};

/**
 * Translate the current transformation matrix.
 * @param {Vector} v - The position
 */

glTrans.translate = function (v) {
    this.translate3f(v.x, v.y, v.z);
};

/**
 * Translate the current transformation matrix.
 * @param {Number} x - The position x
 * @param {Number} y - The position y
 * @param {Number} z - The position z
 */

glTrans.translate3f = function (x, y, z) {
    var temp = this._matrixTemp0.identity();
    Matrix44.createTranslation(x,y,z,temp);
    this._matrixModelView.mult(this._matrixTemp0);
};

/**
 * Scale the current transformation matrix.
 * @param {Vec3} v - The scale xyz
 */

glTrans.scale = function (v) {
    this.scale3f(v.x, v.y, v.z);
};

/**
 * Scale the current transformation matrix.
 * @param {Number} x - The scale
 */

glTrans.scale1f = function (x) {
    this.scale3f(x,x,x);
};

/**
 * Scale the current transformation matrix.
 * @param {Number} x - The scale x
 * @param {Number} y - The scale y
 * @param {Number} z - The scale z
 */

glTrans.scale3f = function (x, y, z) {
    this._matrixModelView.mult(Matrix44.createScale(x,y,z,this._matrixTemp0.identity()));
};

/**
 * Rotate the current transformation matrix.
 * @param {Vec3} v
 */

glTrans.rotate = function (v) {
    this._matrixModelView.mult(Matrix44.createRotation(v.x, v.y, v.z, this._matrixTemp0.identity()));
};

/**
 * Rotate the current transformation matrix.
 * @param {Vec3} x
 * @param {Vec3} y
 * @param {Vec3} z
 */

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
