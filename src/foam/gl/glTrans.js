var Matrix44 = require("../math/Matrix44"),
    Matrix33 = require('../math/Matrix33');
var _Error   = require('../system/common/Error');
var glu      = require('./glu');
var gl       = require('./gl');
var ObjectUtil = require('../util/ObjectUtil');

var glTrans = {};


glTrans.MODELVIEW  = 0x1A0A;
glTrans.PROJECTION = 0x1A0B;

var matrixMode = glTrans.MODELVIEW;
var matrixStackModelView = [];
var matrixStackProjection = [];
var matrixTemp0 = new Matrix44();
var matrixTemp1 = new Matrix44();
var matrixModelView = new Matrix44();
var matrixProjection = new Matrix44();
var matrixNormal = new Matrix44();


var matrixF32Temp0 = new Float32Array(16);
var matrixF32Temp1 = new Float32Array(16);
var matrixF32Temp2 = new Float32Array(16);

var viewportRectArr = new Array(4);

var matrixNormalDirty = true;

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
    matrixProjection.identity();
    matrixModelView.identity();
    if(ObjectUtil.isUndefined(topleft) || topleft){
        glu.ortho(matrixProjection.m,0,windowWidth,windowHeight,0,-1,1);
    } else {
        glu.ortho(matrixProjection.m,0,windowWidth,0,windowHeight,-1,1);
    }
};


/**
 * Set the current camera modelview and projection matrix
 * @param {Camera} camera - The Camera
 */

glTrans.setMatricesCamera = function(camera){
    matrixModelView.set(camera.modelViewMatrix);
    matrixProjection.set(camera.projectionMatrix);
};

/**
 * Set the matrix to be used.
 * @param mode - glTrans.MODELVIEW or glTrans.PROJECTION
 */

glTrans.setMatrixMode = function(mode){
    matrixMode = mode;
};

/**
 * Get the current modelview matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getModelViewMatrixF32 = function(matrix){
    return matrixModelView.toFloat32Array(matrix || matrixF32Temp0);
};

/**
 * Get the current projection matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getProjectionMatrixF32 = function(matrix){
    return matrixProjection.toFloat32Array(matrix || matrixF32Temp0);
};

/**
 * Get the current normal matrix as Float32Array
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getNormalMatrixF32 = function(matrix){
    return this.getNormalMatrix().toFloat32Array(matrix || matrixF32Temp0);
}

/**
 * Get the current modelview or projection matrix as Float32Array
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getMatrixF32 = function(matrix){
    return matrixMode == this.MODELVIEW ? this.getModelViewMatrixF32(matrix) : this.getProjectionMatrixF32(matrix);
};


glTrans.getNormalMatrix = function(){
    if(!matrixNormalDirty){
        return matrixNormal;
    }
    var matrixModelView_ = matrixModelView.m;
    var matrixNormal_ = matrixNormal.m;
    var mv00 = matrixModelView_[0], mv01 = matrixModelView_[1], mv02 = matrixModelView_[2],
        mv10 = matrixModelView_[4], mv11 = matrixModelView_[5], mv12 = matrixModelView_[6],
        mv20 = matrixModelView_[8], mv21 = matrixModelView_[9], mv22 = matrixModelView_[10];

    var b01 =  mv22*mv11-mv12*mv21;
    var b11 = -mv22*mv10+mv12*mv20;
    var b21 =  mv21*mv10-mv11*mv20;

    var d = mv00*b01 + mv01*b11 + mv02*b21;
    var id = 1 /(d || 1);

    var m0,m1,m2,m3,m4,m5,m6,m7,m8;

    m0 = b01*id;
    m1 = (-mv22*mv01 + mv02*mv21)*id;
    m2 = (mv12*mv01 - mv02*mv11)*id;
    m3 = b11*id;
    m4 = (mv22*mv00 - mv02*mv20)*id;
    m5 = (-mv12*mv00 + mv02*mv10)*id;
    m6 = b21*id;
    m7 = (-mv21*mv00 + mv01*mv20)*id;
    m8 = (mv11*mv00 - mv01*mv10)*id;

    matrixNormal_[15] = 1;
    matrixNormal_[14] = 0;
    matrixNormal_[13] = 0;
    matrixNormal_[12] = 0;

    matrixNormal_[11] = 0;
    matrixNormal_[10] = m8;
    matrixNormal_[9]  = m7;
    matrixNormal_[8]  = m6;

    matrixNormal_[7] = 0;
    matrixNormal_[6] = m5;
    matrixNormal_[5] = m4;
    matrixNormal_[4] = m3;

    matrixNormal_[3] = 0;
    matrixNormal_[2] = m2;
    matrixNormal_[1] = m1;
    matrixNormal_[0] = m0;

    matrixNormal.transpose();

    matrixNormalDirty = false;

    return matrixNormal;
};


/**
 * Resets the current matrix to its identity.
 */

glTrans.loadIdentity = function(){
    (matrixMode == this.MODELVIEW ? matrixModelView : matrixProjection).identity();
};


/**
 * Push the current matrix onto the matrix stack.
 */

glTrans.pushMatrix = function(){
    if(matrixMode == glTrans.MODELVIEW){
        matrixStackModelView.push(matrixModelView.copy());
    } else {
        matrixStackProjection.push(matrixProjection.copy());
    }
};

/**
 * Remove the current matrix from the matrix stack.
 * @returns {Matrix44}
 */

glTrans.popMatrix = function(){
    if(matrixMode = glTrans.MODELVIEW){
        if(matrixStackModelView.length == 0){
            throw new Error(_Error.MATRIX_STACK_POP_ERROR);
        }
        matrixModelView = matrixStackModelView.pop();
        return matrixModelView;
    } else {
        if(matrixStackProjection.length == 0){
            throw new Error(_Error.MATRIX_STACK_POP_ERROR);
        }
        matrixProjection = matrixStackProjection.pop();
        return matrixProjection;
    }
};

/**
 * Push the current transformation and projection matrix onto their matrix stacks.
 */

glTrans.pushMatrices = function(){
    matrixStackModelView.push(matrixModelView.copy());
    matrixStackProjection.push(matrixProjection.copy());
};

/**
 * Remove the current transformation and projection matrix from their matrix stacks.
 */

glTrans.popMatrices = function(){
    if(matrixStackModelView.length == 0 || matrixStackProjection.length == 0){
        throw new Error(_Error.MATRIX_STACK_POP_ERROR);
    }
    matrixModelView  = matrixStackModelView.pop();
    matrixProjection = matrixStackProjection.pop();
};

/**
 * Multiply the current matrix.
 * @param {Matrix} matrix - The matrix
 */

glTrans.multMatrix = function(matrix){
    (matrixMode == glTrans.MODELVIEW ? matrixModelView : matrixProjection).mult(matrix);
    matrixNormalDirty = true;
};

/**
 * Translate the current transformation matrix.
 * @param {Vec3} v - The position
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
    var temp = matrixTemp0.identity();
    Matrix44.createTranslation(x,y,z,temp);
    matrixModelView.mult(matrixTemp0);
    matrixNormalDirty = true;
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
    matrixModelView.mult(Matrix44.createScale(x,y,z,matrixTemp0.identity()));
    matrixNormalDirty = true;
};

/**
 * Rotate the current transformation matrix.
 * @param {Vec3} v
 */

glTrans.rotate = function (v) {
    matrixModelView.mult(Matrix44.createRotation(v.x, v.y, v.z, matrixTemp0.identity()));
    matrixNormalDirty = true;
};

/**
 * Rotate the current transformation matrix.
 * @param {Vec3} x
 * @param {Vec3} y
 * @param {Vec3} z
 */

glTrans.rotate3f = function (x, y, z) {
    matrixModelView.mult(Matrix44.createRotation(x,y,z,matrixTemp0.identity()));
    matrixNormalDirty = true;
};

glTrans.rotateAxis = function (angle, v) {
    matrixTemp0.identity();
    Matrix44.createRotationOnAxis(angle, v.x, v.y, v.z, matrixTemp0);
    matrixModelView = matrixTemp0.mult(matrixModelView);
    matrixNormalDirty = true;
};

glTrans.rotateAxis3f = function (angle, x, y, z) {
    matrixTemp0.identity();
    Matrix44.createRotationOnAxis(angle, x, y, z, matrixTemp0);
    matrixModelView = matrixTemp0.mult(matrixModelView);
    matrixNormalDirty = true;
};


module.exports = glTrans;
