var Vec3 = require('../math/Vec3');
var glDraw, _glDraw = require('./glDraw');

function Frustum(){
    this._vec3Temp = new Vec3();
    this._frustumCamera = new Array(6);
    var frustumTemp = this._frustumTemp = new Array(6);

    var planeNormals = this._planeNormals = new Array(6),
        planePoints = this._planePoints = new Array(6),
        planeDists  = this._planeDists = new Array(6);

    var i = -1, l = 6;
    while(++i < l){
        planeNormals[i] = new Vec3();
        planePoints[i] = new Vec3();
        planeDists[i] = 0.0;
        frustumTemp[i] = new Vec3();
    }


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

Frustum.prototype.draw = function(){
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


Frustum.prototype.getNearPlane = function(){
    return this._near;
};

Frustum.prototype.getFarPlane =function(){
    return this._far;
};

Frustum.prototype._calcPlane = function(index,v0,v1,v2){
    var aux0 = v0.subbed(v1),
        aux1 = v2.subbed(v1);

    var normal = this._planeNormals[index].set(aux1.cross(aux0).normalize()),
        point = this._planePoints[index].set(v1);

    this._planeDists[index] = normal.dot(point) * -1;
};

Frustum.prototype.containsPoint = function(point){
    return this.containsPoint3f(point.x,point.y,point.z);
};

Frustum.prototype.containsPoint3f = function(x,y,z){
    var planeNormal;
    var planeDists = this._planeDists,
        planeNormals = this._planeNormals;
    var i = -1;
    while(++i < 6){
        planeNormal = planeNormals[i];
        if(planeDists[i] + (planeNormal.x * x + planeNormal.y * y +planeNormal.z * z) < 0){
            return false;
        }
    }
    return true;
};

module.exports = Frustum;