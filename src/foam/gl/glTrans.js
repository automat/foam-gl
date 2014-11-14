var Matrix44 = require("../math/Matrix44"),
    Matrix33 = require('../math/Matrix33');
var _Error   = require('../system/common/Error');
var glu      = require('./glu');
var gl       = require('./gl');
var ObjectUtil = require('../util/ObjectUtil');
var glMatrix = require('gl-matrix');

var glTrans = {};

var matrixMode = glTrans.MODELVIEW;
var matrixStackModelView = [];
var matrixStackProjection = [];
var matrixTemp0 = new Matrix44();
var matrixTemp1 = new Matrix44();

var matrixView = new Matrix44();
var matrixModelView = new Matrix44();
var matrixProjection = new Matrix44();
var matrixNormal = new Matrix44();

var matrixF32Temp0 = new Float32Array(16);
var matrixF32Temp1 = new Float32Array(16);
var matrixF32Temp2 = new Float32Array(16);
var matrixF32Temp3 = new Float32Array(16);

var viewportRectArr = new Array(4);

/*---------------------------------------------------------------------------------------------------------*/
// View / modelview / projection matrix
/*---------------------------------------------------------------------------------------------------------*/

/**
 * Sets the current projection matrix to fit to match screen-space.
 * @param {Number} windowWidth - The width
 * @param {Number} windowHeight - The height
 * @param {Boolean} [topleft=true] - Sets the origin to the topleft
 */

glTrans.setWindowMatrices = function(windowWidth,windowHeight,topleft){
    matrixView.identity();
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
    matrixView.set(camera.viewMatrix);
    matrixModelView.set(camera.viewMatrix);
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
 * Returns the current projection matrix.
 * @param {Matrix44} [matrix] - Out Float32Array
 * @returns {Matrix44}
 */

glTrans.getProjectionMatrix = function(matrix){
    return (matrix || matrixTemp0).set(matrixProjection);
};

/**
 * Returns the current view matrix.
 * @param {Matrix44} [matrix] - Out Float32Array
 * @returns {Matrix44}
 */

glTrans.getViewMatrix = function(matrix){
    return (matrix || matrixTemp0).set(matrixView);
}

/**
 * Returns the current modelview matrix.
 * @param {Matrix44} [matrix] - Out Float32Array
 * @returns {Matrix44}
 */

glTrans.getModelViewMatrix = function(matrix){
    return (matrix || matrixTemp0).set(matrixModelView);
};

/**
 * Returns the current projection matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getProjectionMatrixF32 = function(matrix){
    return matrixProjection.toFloat32Array(matrix || matrixF32Temp0);
};

/**
 * Returns the current view matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getViewMatrixF32 = function(matrix){
    return matrixView.toFloat32Array(matrix || matrixF32Temp0);
}

/**
 * Returns the current modelview matrix as Float32Array.
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getModelViewMatrixF32 = function(matrix){
    return matrixModelView.toFloat32Array(matrix || matrixF32Temp0);
};


/**
 * Get the current normal matrix as Float32Array
 * @param {Float32Array} [matrix] - Out Float32Array
 * @returns {Float32Array}
 */

glTrans.getNormalMatrixF32 = function(matrix){
    return this.getNormalMatrix().toFloat32Array(matrix || matrixF32Temp3);
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
    matrixNormal.set(matrixModelView);
    matrixNormal.invert();
    matrixNormal.transpose();
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
