var glObject = require('./glObject');
var ObjectUtil = require('../util/ObjectUtil');

var App         = require('../app/App'),
    WindowEvent = require('../app/WindowEvent');
var Mouse       = require('../input/Mouse'),
    MouseEvent  = require('../input/MouseEvent');

var Vec2 = require('../math/Vec2'),
    Vec3 = require('../math/Vec3'),
    Quat = require('../math/Quat'),
    Matrix44 = require('../math/Matrix44');

var glu = require('./glu');

var DEFAULT_RADIUS_SCALE = 2.25,
    DEFAULT_SPEED = 0.095,
    DEFAULT_DISTANCE_STEP = 0.25;

//https://www.talisman.org/~erlkonig/misc/shoemake92-arcball.pdf

function Arcball(camera){
    glObject.apply(this);

    camera = this._camera = camera;

    this._center =
    this._radius =
    this._radiusScale =
    this._speed = null;

    this.setRadiusScale(DEFAULT_RADIUS_SCALE);
    this.setSpeed(DEFAULT_SPEED);

    this._distanceStep = DEFAULT_DISTANCE_STEP;
    this._distance = this._distanceTarget = camera.getDistance();
    this._distanceMax = Number.MAX_VALUE;
    this._distanceMin = -Number.MAX_VALUE;

    this._posDown = new Vec3();
    this._posDrag = new Vec3();

    this._orientCurr   = camera.viewMatrix.toQuat();
    this._orientDown   = new Quat();
    this._orientDrag   = new Quat();
    this._orientTarget = this._orientCurr.copy();

    this._matrix = new Matrix44();

    this._interactive = true;
    this._constrainAxis = null;

    var app = App.getInstance(),
        mouse = Mouse.getInstance(),
        self = this;

    function updateWindowRel(){
        self._center = app.getWindowSize().scale(0.5);
        self._updateRadius();
    }
    updateWindowRel();

    mouse.addEventListener(WindowEvent.RESIZE,function(e){
        updateWindowRel();
        self._updateRadius();
    });

    var tempVec2_0 = new Vec2(),
        tempVec2_1 = new Vec2();

    mouse.addEventListener(MouseEvent.MOUSE_DOWN,function(e){
        if(!self._interactive){
            return;
        }
        var pos = e.sender.getPosition();
        self._posDown = self._mapSphere(tempVec2_0.setf(pos.x,app.getWindowHeight() - pos.y));
        self._orientDown.set(self._orientCurr);
        self._orientDrag.identity();
    });

    mouse.addEventListener(MouseEvent.MOUSE_DRAG,function(e){
        if(!self._interactive){
            return;
        }
        var pos = e.sender.getPosition();
        self._posDrag = self._mapSphere(tempVec2_1.setf(pos.x,app.getWindowHeight() - pos.y));
        self._orientDrag.setVec3(self._posDown.dot(self._posDrag),self._posDown.crossed(self._posDrag));
        self._orientTarget = self._orientDrag.multiplied(self._orientDown);
    });

    mouse.addEventListener(MouseEvent.MOUSE_WHEEL,function(e){
        if(!self._interactive){
            return;
        }
        self._distanceTarget += e.sender.getWheelDirection() * -1 * self._distanceStep;
        self._distanceTarget  = Math.max(self._distanceMin,Math.min(self._distanceTarget,self._distanceMax));
    });
}

Arcball.prototype = Object.create(glObject.prototype);
Arcball.prototype.constructor = Arcball;

/**
 * Applies the arcball rotation to the camera.
 */

Arcball.prototype.apply = function(){
    this._distance += (this._distanceTarget - this._distance) * this._speed;

    var viewMatrix = this._camera.viewMatrix.identity();
    glu.lookAt(viewMatrix.m,0,0,this._distance,0,0,0,0,1,0);

    viewMatrix.mult(
        this._orientCurr.interpolateTo(this._orientTarget,this._speed)
            .toMatrix44(this._matrix));

	//var viewMatrix = this._camera.viewMatrix.identity();
	//viewMatrix.m[14] = -this._distance;
	//var matrix = this._orientCurr.interpolateTo(this._orientTarget,this._speed).toMatrix44(this._matrix);
	//
	//viewMatrix.mult(matrix);
};

/**
 * Draws the arcballs rotation gizmo.
 */

Arcball.prototype.debugDraw = function(){
    var glTrans = this._glTrans,
        glDraw  = this._glDraw;
    var prevNum   = glDraw.getCircleSegments(),
        prevColor = glDraw.getColor();

    glDraw.setCircleSegments(60);

    glTrans.pushMatrix();
    glDraw.colorf(0,0,1);
    glDraw.drawCircleStroked();
    glDraw.colorf(0,1,0);
    glTrans.rotate3f(Math.PI * 0.5,0,0);
    glDraw.drawCircleStroked();
    glTrans.rotate3f(0,Math.PI * 0.5,0);
    glDraw.colorf(1,0,0);
    glDraw.drawCircleStroked();
    glTrans.popMatrix();

    glTrans.pushMatrix();
    glTrans.popMatrix();

    glTrans.pushMatrix();
    glTrans.popMatrix();

    glDraw.color(prevColor);
    glDraw.setCircleSegments(prevNum);
};

/**
 * Sets the arcball radius scale
 * @param {number} s
 */

Arcball.prototype.setRadiusScale = function(s){
    this._radiusScale = 1.0 / (ObjectUtil.isUndefined(s) ? DEFAULT_RADIUS_SCALE : s);
    this._updateRadius();
};

/**
 * Sets the arballs view matrix to be used.
 * @param {AbstractCamera} camera
 */

Arcball.prototype.setCamera = function(camera){
    this._camera = camera;
};

/**
 * Sets the rotation speed.
 * @param {Number} s
 */

Arcball.prototype.setSpeed = function(s){
    this._speed = ObjectUtil.isUndefined(s) ? this._speed : s;
};

/**
 * Constrains rotation to a specified axis.
 * @param {Vec3} axis
 */

Arcball.prototype.setConstrainAxis = function(axis){
    this._constrainAxis = axis.normalized();
}

/**
 * Sets the max distance from target.
 * @param {Number} max
 */

Arcball.prototype.setDistanceMax = function(max){
    this._distanceMax = max;
};

/**
 * Sets the max min distance from target.
 * @param {Number} min
 */

Arcball.prototype.setDistanceMin = function(min){
    this._distanceMin = min;
};

/**
 * Sets the distance between eye and target.
 * @param {Number} dist
 */

Arcball.prototype.setDistance = function(dist){
    this._distanceTarget = dist;
}

/**
 * Returns the current distance
 * @returns {Number}
 */

Arcball.prototype.getDistance = function(){
    return this._distance;
}

/**
 * Sets a target camera eye.
 * @param {Vec3} target
 */

Arcball.prototype.setEye = function(target){
    //Fix this
    glu.lookAt(this._matrix,target.x,target.y,target.z,0,0,0,0,this._camera.getU(),0);
    this._matrix.toQuat(this._orientTarget);
}

/**
 * Enables interactivity.
 */

Arcball.prototype.enable = function(){
    this._interactive = true;
};

/**
 * Disables interactivity.
 */

Arcball.prototype.disable = function(){
    this._interactive = false;
}

Arcball.prototype._mapSphere = function(pos){
    var dir = this._distance < 0 ? -1 : 1;
    pos.sub(this._center).scale(1.0 / this._radius);
    pos = new Vec3(pos.x,pos.y * dir,0);
    var len = pos.lengthSq();
    if(len > 1.0){
        pos.normalize();
    } else {
        pos.z = Math.sqrt(1 - len);
    }
    var axis = this._constrainAxis;
    if(axis){
        var proj = pos.subbed(axis.scaled(pos.dot(axis))),
            norm = proj.length();
        if(norm > 0){
            pos = proj.scaled(1.0 / norm * (proj.z < 0 ? -1 : 1));
        } else if(axis.z == 1.0){
            pos.set3f(1,0,0);
        } else {
            pos.set3f(-axis.y,axis.y,0);
        }
    }
    return pos;
};

Arcball.prototype._updateRadius = function(){
    var app = App.getInstance();
    this._radius = Math.min(app.getWindowWidth(),app.getWindowHeight()) * this._radiusScale;
};

module.exports = Arcball;