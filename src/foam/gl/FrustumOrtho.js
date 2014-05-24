var Vec3 = require('../math/Vec3'),
    Program = require('./Program');

var glDraw, _glDraw = require('./glDraw');
var glTrans = require('./glTrans');

function FrustumOrtho(){
    var planeNormals = this._planeNormals = new Array(6),
        planePoints = this._planePoints  = new Array(6),
        planeDists  = this._planeDists   = new Array(6);

    var i = -1, l = 6;
    while(++i < l){
        planeNormals[i] = new Vec3();
        planePoints[i] = new Vec3();
        planeDists[i] = 0.0;
    }

    this._vec3Temp0 = new Vec3();
    this._vec3Temp1 = new Vec3();
    this._vec3Temp2 = new Vec3();
    this._frustumTemp = new Array(6);

    this._eye = new Vec3();

    var near = this._near = new Array(4),
        far  = this._far = new Array(4);

    i = -1; l = 4;
    while(++i < l){
        near[i] = new Vec3();
        far[i] = new Vec3();
    }

    glDraw = glDraw || _glDraw.get();
}

FrustumOrtho.prototype.draw = function(){
    var n = this._near,
        n0 = n[0],
        n1 = n[1],
        n2 = n[2],
        n3 = n[3];
    var f = this._far,
        f0 = f[0],
        f1 = f[1],
        f2 = f[2],
        f3 = f[3];
    var eye = this._eye;

    var prevColor = glDraw.getColor();

    glDraw.colorf(0,1,0,1);
    glDraw.drawLines(n0,n1,n1,n2,n2,n3,n3,n0,
                     n0,f0,n1,f1,n2,f2,n3,f3,
                     f0,f1,f1,f2,f2,f3,f3,f0);
    glDraw.colorf(1,0,0,1);
    glDraw.drawLines(eye,n0,eye,n1,eye,n2,eye,n3);
    glDraw.color(prevColor);
};


FrustumOrtho.prototype._calcPlane = function(index,v0,v1,v2){
    var aux0 = v0.subbed(v1),
        aux1 = v2.subbed(v1);

    var normal = this._planeNormals[index].set(aux1.cross(aux0).normalize()),
        point = this._planePoints[index].set(v1);

    this._planeDists[index] = normal.dot(point) * -1;
};

FrustumOrtho.prototype.set = function(camera, frustumScale){
    frustumScale = frustumScale || 1.0;

    var eye = camera.getEye(this._eye);
    var frustum = camera.getFrustum(this._frustumTemp);

    //  TODO: Fix left/right switch
    var frustumLeft = frustum[2],
        frustumTop = frustum[1],
        frustumRight = frustum[0],
        frustumBottom = frustum[3],
        frustumNear = frustum[4] * frustumScale,
        frustumFar = frustum[5] * frustumScale;

    var u = camera.getU(this._vec3Temp0).scale(frustumScale),
        v = camera.getV(this._vec3Temp1).scale(frustumScale),
        w = camera.getW(this._vec3Temp2);

    var frustumNearDir = w.scaled(frustumNear),
        frustumFarDir = w.scaled(frustumFar),
        frustumTopV = v.scaled(frustumTop),
        frustumBottomV = v.scaled(frustumBottom),
        frustumLeftU = u.scaled(frustumLeft),
        frustumRightU = u.scaled(frustumRight);

    var n = this._near, f = this._far;
    var fb = eye.added(frustumFarDir),
        nb = eye.added(frustumNearDir);

    var f0 = f[0],
        f1 = f[1],
        f2 = f[2],
        f3 = f[3];
    var n0 = n[0],
        n1 = n[1],
        n2 = n[2],
        n3 = n[3];

    f0.set(fb).add(frustumTopV).add(frustumLeftU);
    f1.set(fb).add(frustumTopV).add(frustumRightU);
    f2.set(fb).add(frustumBottomV).add(frustumRightU);
    f3.set(fb).add(frustumBottomV).add(frustumLeftU);

    n0.set(nb).add(frustumTopV).add(frustumLeftU);
    n1.set(nb).add(frustumTopV).add(frustumRightU);
    n2.set(nb).add(frustumBottomV).add(frustumRightU);
    n3.set(nb).add(frustumBottomV).add(frustumLeftU);

    this._calcPlane(0,n1,n0,f0);
    this._calcPlane(1,n3,n2,f2);
    this._calcPlane(2,n0,n3,f3);
    this._calcPlane(3,f1,f2,n2);
    this._calcPlane(4,n0,n1,n2);
    this._calcPlane(5,f1,f0,f3);
};

FrustumOrtho.prototype.containsArr = function(arr,index){
    index = index || 0;
    return this.contains3f(arr[index],arr[index + 1],arr[index + 2]); //? index : -1;
};

FrustumOrtho.prototype.contains = function(point){
    return this.contains3f(point.x,point.y,point.z);
};

FrustumOrtho.prototype.contains3f = function(x,y,z){
    var tempPoint = this._vec3Temp0.set3f(x,y,z);
    var planeDists = this._planeDists,
        planeNormals = this._planeNormals;
    var i = -1;
    while(++i < 6){
        if(planeDists[i] + planeNormals[i].dot(tempPoint) < 0){
            return false;
        }
    }
    return true;
};

FrustumOrtho.prototype.getNearPlane = function(){
    return this._near;
};

FrustumOrtho.prototype.getFarPlane =function(){
    return this._far;
};



module.exports = FrustumOrtho;