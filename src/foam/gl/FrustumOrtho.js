var ArrayUtil = require('../util/ArrayUtil'),
    Vec3 = require('../math/Vec3'),
    Quaternion = require('../math/Quaternion'),
    _gl = require('./gl');

function FrustumOrtho(){
    this._gl = _gl.get();

    this._mPlaneNormals = ArrayUtil.createFactObjArray(6,Vec3.create);
    this._mPlanePoints  = ArrayUtil.createFactObjArray(6,Vec3.create);;
    this._mPlaneDists   = ArrayUtil.createFactObjArray(6,Vec3.create);

    this._eye = Vec3.create();
    this._near = ArrayUtil.createFactObjArray(4,Vec3.create);
    this._far  = ArrayUtil.createFactObjArray(4,Vec3.create);
}

FrustumOrtho.prototype._calcPlane = function(index,v0,v1,v2){
    var aux0 = Vec3.subbed(v0,v1);
    var aux1 = Vec3.subbed(v2,v1);

    var normal = this._mPlaneNormals[index] = Vec3.safeNormalized(Vec3.cross(aux1,aux0));
    var point  = this._mPlanePoints[index] = Vec3.copy(v1);
    this._mPlaneDists[index] = Vec3.scaled(Vec3.dot(normal,point), -1);
};

FrustumOrtho.prototype.set = function(camera){

};

FrustumOrtho.prototype.contains = function(points){

};

FrustumOrtho.prototype.getNearPlane = function(){

};

FrustumOrtho.prototype.getFarPlane =function(){

};

FrustumOrtho.prototype.draw = function(){

}