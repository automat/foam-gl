;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Foam        = require('../../src/foam/foam.js'),
    gl          = Foam.gl,
    glMatrix    = Foam.glMatrix,

    CameraPersp = Foam.CameraPersp,
    Vec3        = Foam.Vec3,
    Program      = Foam.Program;



var shaderSource = '';

function App() {
    Foam.Application.apply(this, arguments);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    this.setFPS(60);
    this.setWindowSize(800, 600);

    var  gl = this.gl;

    gl.viewport(0,0,this.getWindowWidth,this.getWindowHeight());

    this._camera = new CameraPersp();
    this._camera.setPerspective(65, this.getWindowAspectRatio(), -1, 10);
    this._camera.lookAt(Vec3.ONE(), Vec3.ZERO());

    this._program = new Program(shaderSource);
    this._vbo = gl.createBuffer();

    var size_2 = 0.5;
    this._vertices = new Float32Array(
        [-size_2,-size_2,-size_2,
          size_2,-size_2,-size_2,
          size_2,-size_2,-size_2,
          size_2,-size_2, size_2]);

    this._colors = new Float32Array(
        [1,1,1,1,
         1,1,1,1,
         1,1,1,1,
         1,1,1,1]);

};

App.prototype.update = function () {

    var camera = this._camera;
    var program = this._program;
    var vbo = this._vbo;

    gl.clearColor(1,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.updateMatrices();
    glMatrix.setMatricesCamera(camera);

    program.bind();

    var vertices = this._vertices,
        colors   = this._colors;

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER,vertices.byteLength + colors.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);

    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(program.aVertexColor,    4, gl.FLOAT, false, 0, vertices.byteLength);

    program.uniformMatrix4fv(program.uModelViewMatrix, false,  glMatrix.getModelViewMatrix());
    program.uniformMatrix4fv(program.uProjectionMatrix,false,  glMatrix.getProjectionMatrix()) ;

    gl.drawArrays(gl.POINTS, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    program.unbind();









};

var app;

window.addEventListener('load',function(){
    FileUtil.load('../examples/00_Basic_Application/program.glsl',function(data){
        shaderSource = data;
        app = new App();
    });
});

},{"../../src/foam/foam.js":3}],2:[function(require,module,exports){
var fError = require('../system/common/Error'),
    ObjectUtil = require('../util/ObjectUtil'),
    Platform = require('../system/common/Platform'),
    Mouse = require('../util/Mouse');

var gl     = require('../gl/gl'),
    glDraw = require('../gl/glDraw');

var Default     = require('../system/common/Default');

function App() {
    if (App.__instance) {
        throw new Error(Error.CLASS_IS_SINGLETON);
    }

    var target = Platform.getTarget();
    if (ObjectUtil.isUndefined(target)) {
        throw new Error(Error.WRONG_PLATFORM);
    }

    //
    //  Context & Window
    //
    this._windowTitle = null;
    this._fullWindow = false;
    this._fullscreen = false;
    this._windowSize = [0,0];
    this._windowRatio = 0;

    //
    //  input
    //
    this._keyDown = false;
    this._keyStr = '';
    this._keyCode = '';

    this._mouseDown = false;
    this._mouseMove = false;
    this._mouseWheelDelta = 0.0;
    this._mouseMove = false;
    this._mouseBounds = true;
    this._hideCursor = false;

    this.mouse = new Mouse();

    //
    //  time
    //
    this._framenum = 0;
    this._time = 0;
    this._timeStart = Date.now();
    this._timeNext = 0;
    this._targetFPS = -1;
    this._timeInterval = -1;
    this._timeDelta = 0;
    this._timeElapsed = 0;
    this._loop = true;

    this.setFPS(30.0);

    //
    //  canvas & context
    //
    var canvas = this._canvas = document.createElement('canvas');
        canvas.setAttribute('tabindex','0');
        canvas.focus();

    gl.context = canvas.getContext('webkit-3d') ||
                 canvas.getContext("webgl") ||
                 canvas.getContext("experimental-webgl");

    graphics.matrix = new glMatrix();

    document.body.appendChild(canvas);

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame;




     App.__instance = this;

    //
    //
    //

    this.setup();

    if(this._loop){
        var time, timeDelta;
        var timeInterval = this._timeInterval;
        var timeNext;
        var self = this;

        function update() {

            requestAnimationFrame(update, null);

            time = self._time = Date.now();
            timeDelta = time - self._timeNext;

            self._timeDelta = Math.min(timeDelta / timeInterval, 1);


            if (timeDelta > timeInterval) {
                timeNext = self._timeNext = time - (timeDelta % timeInterval);

                self.update();

                self._timeElapsed = (timeNext - self._timeStart) / 1000.0;
                self._framenum++;
            }


        }

        update();
    } else {
        this.update();
    }

}

App.getInstance = function () {
    return App.__instance;
};

App.prototype.setup = function () {
    throw new Error(Error.APP_NO_SETUP);
};

App.prototype.update = function () {
    throw new Error(Error.APP_NO_UPDATE);
};

/*--------------------------------------------------------------------------------------------*/
//  window
/*--------------------------------------------------------------------------------------------*/

App.prototype.setWindowSize = function (width, height) {
    if(this._fullWindow){
        width  = window.innerWidth;
        height = window.innerHeight;
    }

    if (width  == this._windowSize[0] && height == this._windowSize[1]){
        return;
    }

    this._windowSize[0] = width;
    this._windowSize[1] = height;
    this._windowRatio   = width / height;

    this._updateCanvasSize();
};

App.prototype.setFullscreen = function(bool){
    this._fullscreen = bool;
};

App.prototype.setFullWindow = function(bool){
    this._fullWindow = bool;
}

App.prototype._updateCanvasSize = function(){
    var canvas = this._canvas,
        width  = this._windowSize[0],
        height = this._windowSize[1];

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
};

App.prototype.getWindowSize = function () {
    return this._windowSize.slice();
};

App.prototype.getWindowWidth = function () {
    return this._windowSize[0];
};

App.prototype.getWindowHeight = function () {
    return this._windowSize[1];
};

App.prototype.getWindowAspectRatio = function () {
    return this._windowRatio;
};

App.prototype.onWindowResize = function (e) {};


/*--------------------------------------------------------------------------------------------*/
//  framerate / time
/*--------------------------------------------------------------------------------------------*/

App.prototype.setFPS = function (fps) {
    this._targetFPS = fps;
    this._timeInterval = this._targetFPS / 1000.0;
};

App.prototype.getFPS = function () {
    return this._targetFPS;
};

App.prototype.getFramesElapsed = function () {
    return this._framenum;
};
App.prototype.getSecondsElapsed = function () {
    return this._timeElapsed;
};
App.prototype.getTime = function () {
    return this._time
};

App.prototype.getTimeStart = function () {
    return this._timeStart;
};

App.prototype.getTimeDelta = function () {
    return this._timeDelta;
};

App.prototype.loop = function(loop){
    this._loop = loop;
}


/*--------------------------------------------------------------------------------------------*/
//  input
/*--------------------------------------------------------------------------------------------*/


App.prototype.isKeyDown = function () {
    return this._keyDown;
};
App.prototype.isMouseDown = function () {
    return this._mouseDown;
};
App.prototype.isMouseMove = function () {
    return this._mouseMove;
};
App.prototype.getKeyCode = function () {
    return this._keyCode;
};
App.prototype.getKeyStr = function () {
    return this._keyStr;
};
App.prototype.getMouseWheelDelta = function () {
    return this._mouseWheelDelta;
};


App.prototype.onKeyDown = function (e) {};
App.prototype.onKeyUp = function (e) {};
App.prototype.onMouseUp = function (e) {};
App.prototype.onMouseDown = function (e) {};
App.prototype.onMouseWheel = function (e) {};
App.prototype.onMouseMove = function (e) {};


/*
 App.prototype.getWindowWidth  = function(){return this._appImpl.getWindowWidth();};
 App.prototype.getWindowHeight = function(){return this._appImpl.getWindowHeight();};

 App.prototype.setUpdate = function(bool){this._appImpl.setUpdate(bool);};



 App.prototype.setWindowTitle       = function(title){this._appImpl.setWindowTitle(title);};
 App.prototype.restrictMouseToFrame = function(bool) {this._appImpl.restrictMouseToFrame(bool);};
 App.prototype.hideMouseCursor      = function(bool) {this._appImpl.hideMouseCursor(bool);};

 App.prototype.setFullWindowFrame  = function(bool){return this._appImpl.setFullWindowFrame(bool);};
 App.prototype.setFullscreen       = function(bool){return this._appImpl.setFullscreen(true);};
 App.prototype.isFullscreen        = function()    {return this._appImpl.isFullscreen();};
 App.prototype.setBorderless       = function(bool){return this._appImpl.setBorderless(bool);};
 App.prototype.isBorderless        = function()    {return this._appImpl.isBorderless();};
 App.prototype.setDisplay          = function(num) {return this._appImpl.setDisplay(num);};
 App.prototype.getDisplay          = function()    {return this._appImpl.getDisplay();};

 App.prototype.setFPS = function(fps){this._appImpl.setFPS(fps);};


 App.prototype.isKeyDown          = function(){return this._appImpl.isKeyDown();};
 App.prototype.isMouseDown        = function(){return this._appImpl.isMouseDown();};
 App.prototype.isMouseMove        = function(){return this._appImpl.isMouseMove();};
 App.prototype.getKeyStr          = function(){return this._appImpl.getKeyStr();};
 App.prototype.getKeyCode         = function(){return this._appImpl.getKeyCode();};
 App.prototype.getMouseWheelDelta = function(){return this._appImpl.getMouseWheelDelta();};


 App.prototype.onKeyDown    = function(e){};
 App.prototype.onKeyUp      = function(e){};
 App.prototype.onMouseUp    = function(e){};
 App.prototype.onMouseDown  = function(e){};
 App.prototype.onMouseWheel = function(e){};
 App.prototype.onMouseMove  = function(e){};

 App.prototype.onWindowResize = function(e){};

 App.prototype.getFramesElapsed  = function(){return this._appImpl.getFramesElapsed();};
 App.prototype.getSecondsElapsed = function(){return this._appImpl.getSecondsElapsed();};
 App.prototype.getTime           = function(){return this._appImpl.getTime();};
 App.prototype.getTimeStart      = function(){return this._appImpl.getTimeStart();};
 App.prototype.getTimeNext       = function(){return this._appImpl.getTimeNext();};
 App.prototype.getTimeDelta      = function(){return this._appImpl.getTimeDelta();};

 App.prototype.getWindow = function(){return this._appImpl.getWindow();};

 App.prototype.getWindowAspectRatio = function(){return this._appImpl.getWindowAspectRatio();};

 App.__instance   = null;
 App.getInstance = function(){return App.__instance;};
 */
module.exports = App;

},{"../gl/gl":6,"../gl/glDraw":7,"../system/common/Default":16,"../system/common/Error":17,"../system/common/Platform":18,"../util/Mouse":20,"../util/ObjectUtil":21}],3:[function(require,module,exports){
/**
 *
 *
 *  F | O | A | M
 *
 *
 * Foam - A Plask/Web GL toolkit
 *
 * Foam is available under the terms of the MIT license.  The full text of the
 * MIT license is included below.
 *
 * MIT License
 * ===========
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

module.exports = {

//    Math        : require('./math/_Math'),
//    Vec2        : require('./math/fVec2'),
      Vec3        : require('./math/Vec3'),
      Vec4        : require('./math/Vec4'),
//    Mat33       : require('./math/fMat33'),
      Matrix44    : require('./math/Matrix44'),
//    Quaternion  : require('./math/fQuaternion'),
//
//    MatGL        : require('./gl/gl/fMatGL'),

      Application : require('./app/App'),

      gl       : require('./gl/gl').context,
      glMatrix : require('./gl/glMatrix'),
      glu      : require('./gl/glu'),
      glDraw   : require('./gl/glDraw'),


      Program      : require('./gl/Program'),
      CameraPersp  : require('./gl/CameraPersp'),
//
//    Light            : require('./gl/gl/light/fLight'),
//    PointLight       : require('./gl/gl/light/fPointLight'),
//    DirectionalLight : require('./gl/gl/light/fDirectionalLight'),
//    SpotLight        : require('./gl/gl/light/fSpotLight'),
//
//    Material      : require('./gl/gl/fMaterial'),
//    Texture       : require('./gl/gl/texture/fTexture'),
//    CanvasTexture : require('./gl/gl/texture/fCanvasTexture'),
//
//    glDrawUtil     : require('./gl/glDrawUtil'),
//    glMatrix         : require('./gl/glMatrix'),
//
//    Mouse       : require('./util/fMouse'),
//    MouseState  : require('./util/fMouseState'),
//    Color       : require('./util/fColor'),
//    Util        : require('./util/fUtil'),
//
//    Platform    : require('./system/common/fPlatform'),
//    System      : require('./system/fSystem'),
//
//    Flags : require('./system/fFlags'),

    ObjectUtil : require('./util/ObjectUtil'),



};


},{"./app/App":2,"./gl/CameraPersp":4,"./gl/Program":5,"./gl/gl":6,"./gl/glDraw":7,"./gl/glMatrix":8,"./gl/glu":9,"./math/Matrix44":12,"./math/Vec3":14,"./math/Vec4":15,"./util/ObjectUtil":21}],4:[function(require,module,exports){
var Vec3 = require('../math/Vec3'),
    Matrix44 = require('../math/Matrix44'),
    MatGL = require('./glu'),
    ObjectUtil = require('../util/ObjectUtil');


function CameraPersp() {
    this._eye = Vec3.create();
    this._target = Vec3.create();
    this._up = Vec3.AXIS_Y();

    this._fov = 0;
    this._near = 0;
    this._far = 0;

    this._aspectRatioLast = 0;

    this._modelViewMatrixUpdated = false;
    this._projectionMatrixUpdated = false;

    this.projectionMatrix = Matrix44.create();
    this.modelViewMatrix = Matrix44.create();
}

CameraPersp.prototype.setPerspective = function (fov, windowAspectRatio, near, far) {
    this._fov = fov;
    this._near = near;
    this._far = far;

    this._aspectRatioLast = windowAspectRatio;

    this.updateProjectionMatrix();
};

CameraPersp.prototype.setTarget = function (v) {
    Vec3.set(this._target, v);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setTarget3f = function (x, y, z) {
    Vec3.set3f(this._target, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.getTarget = function(v){
    if(ObjectUtil.isUndefined(v)){
        return Vec3.copy(this._target);
    }
    Vec3.set(v,this._target);
};

CameraPersp.prototype.setEye = function (v) {
    Vec3.set(this._eye, v);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setEye3f = function (x, y, z) {
    Vec3.set3f(this._eye, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.getEye = function(v){
    if(ObjectUtil.isUndefined(v)){
        return Vec3.copy(this._eye);
    }
    Vec3.set(v,this._eye);
};

CameraPersp.prototype.lookAt = function(eye,target){
    Vec3.set(this._eye,eye);
    Vec3.set(this._target,target);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setUp = function (v) {
    Vec3.set(this._up, v);
    this._modelViewMatrixUpdated = false;
};
CameraPersp.prototype.setUp3f = function (x, y, z) {
    Vec3.set3f(this._up, x, y, z);
    this._modelViewMatrixUpdated = false;
};

CameraPersp.prototype.setNear = function (near) {
    this._near = near;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.setFar = function (far) {
    this._far = far;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.setFov = function (fov) {
    this._fov = fov;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.setAspectRatio = function (aspectRatio) {
    this._aspectRatioLast = aspectRatio;
    this._projectionMatrixUpdated = false;
};

CameraPersp.prototype.updateModelViewMatrix = function () {
    if (this._modelViewMatrixUpdated){
        return;
    }
    MatGL.lookAt(this.modelViewMatrix, this._eye, this._target, this._up);
    this._modelViewMatrixUpdated = true;
};
CameraPersp.prototype.updateProjectionMatrix = function () {
    if (this._projectionMatrixUpdated){
        return;
    }
    MatGL.perspective(this.projectionMatrix, this._fov, this._aspectRatioLast, this._near, this._far);
    this._projectionMatrixUpdated = true;
};

CameraPersp.prototype.updateMatrices = function () {
    this.updateModelViewMatrix();
    this.updateProjectionMatrix();
};

CameraPersp.prototype.toString = function () {
    return '{position= ' + Vec3.toString(this.position) +
            ', target= ' + Vec3.toString(this._target) +
        ', up= ' + Vec3.toString(this._up) + '}'
};

module.exports = CameraPersp;



},{"../math/Matrix44":12,"../math/Vec3":14,"../util/ObjectUtil":21,"./glu":9}],5:[function(require,module,exports){
var gl = require('./gl').gl;

function Program(vertexShader, fragmentShader) {
    var prefixVertexShader = '',
        prefixFragmentShader = '';

    if(!fragmentShader){
        prefixVertexShader = '#define VERTEX_SHADER\n';
        prefixFragmentShader = '#define FRAGMENT_SHADER\n';
        fragmentShader = vertexShader;
    }

    var program    = this._program = gl.createProgram(),
        vertShader = gl.createShader(gl.VERTEX_SHADER),
        fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertShader, prefixVertexShader + vertexShader);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        throw 'VERTEX: ' + gl.getShaderInfoLog(vertShader);
    }

    gl.shaderSource(fragShader, prefixFragmentShader + fragmentShader);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        throw 'FRAGMENT: ' + gl.getShaderInfoLog(fragShader);
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    var i, paramName;

    var numUniforms = this._numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    i = -1;
    while (++i < numUniforms) {
        paramName = gl.getActiveUniform(program, i).name;
        this[paramName] = gl.getUniformLocation(program, paramName);
    }

    var attributesNum = this._numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    var attributes = this._attributes = new Array(attributesNum);
    i = -1;
    while (++i < attributesNum) {
        paramName = gl.getActiveAttrib(program, i).name;
        attributes[i] = this[paramName] = gl.getAttribLocation(program, paramName);
    }
}

Program.prototype.delete = function(){
   gl.deleteProgram(this._program);
};

Program.prototype.getNumUniforms = function () {
    return this._numUniforms;
};

Program.prototype.getNumAttributes = function () {
    return this._numAttributes;
};

Program.prototype.bind = function () {
    gl.useProgram(this._program);
    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;
    while (++i < n) {
        gl.enableVertexAttribArray(a[i]);
    }
};

Program.prototype.unbind = function () {
    var i  = -1,
        a  = this._attributes,
        n  = this._numAttributes;

    while (++i < n) {
        gl.disableVertexAttribArray(a[i]);
    }
    gl.useProgram(null);
};

Program.prototype.uniform1f = function(location,x) {
    gl.uniform1f(location,x);
};

Program.prototype.uniform1fv = function(location,v) {
    gl.uniform1fv(location,v);
};

Program.prototype.uniform1i = function(location,x) {
    gl.uniform1i(location,x);
};

Program.prototype.uniform1iv = function(location,v) {
    gl.uniform1iv(location,v)
};

Program.prototype.uniform2f = function(location,x,y) {
    gl.uniform2f(location,x,y);
};

Program.prototype.uniform2fv = function(location,v) {
    gl.uniform2fv(location,v);
};

Program.prototype.uniform2i = function(location,x,y) {
    gl.uniform2i(location,x,y);
};

Program.prototype.uniform2iv = function(location,v) {
    gl.uniform2iv(location,v);
};

Program.prototype.uniform3f = function(location,x,y,z) {
    gl.uniform3f(location,x,y,z);
};

Program.prototype.uniform3fv = function(location,v) {
    gl.uniform3fv(location,v);
};

Program.prototype.uniform3fv = function(location,v) {
    gl.uniform3fv(location,v);
};

Program.prototype.uniform3i = function(location,x,y,z) {
    gl.uniform3i(location,x,y,z);
};

Program.prototype.uniform3iv = function(location,v) {
    gl.uniform3iv(location,v);
};

Program.prototype.uniform4f = function(location,x,y,z,w) {
    gl.uniform4f(location,x,y,z,w);
};

Program.prototype.uniform4fv = function(location,v) {
    gl.uniform4fv(location,v);
};

Program.prototype.uniform4i = function(location,x,y,z,w) {
    gl.uniform4i(location,x,y,z,w);
};

Program.prototype.uniform4iv = function(location,v) {
    gl.uniform4iv(location,v);
};

Program.prototype.uniformMatrix2fv = function(location,transpose,value) {
    gl.uniformMatrix2fv(location,transpose,value);
};

Program.prototype.uniformMatrix3fv = function(location,transpose,value) {
    gl.uniformMatrix3fv(location,transpose,value);
};

Program.prototype.uniformMatrix4fv = function(location,transpose,value) {
    gl.uniformMatrix4fv(location,transpose,value);
};

module.exports = Program;

},{"./gl":6}],6:[function(require,module,exports){
var gl = {context:null};
module.exports = gl;
},{}],7:[function(require,module,exports){
var Vec3 = require('../math/Vec3'),
    Color = require('../util/Color');

var glDrawUtil = {};

glDrawUtil.__bVertexGrid = [];
glDrawUtil.__bVertexGridF32 = null;
glDrawUtil.__bColorGridLast = Color.BLACK();
glDrawUtil.__bColorGridF32 = null;
glDrawUtil.__gridSizeLast = -1;
glDrawUtil.__gridUnitLast = -1;

glDrawUtil.__bVertexGridCube = [];
glDrawUtil.__bVertexGridCubeF32 = null;
glDrawUtil.__bColorGridCubeLast = Color.BLACK;
glDrawUtil.__bColorGridCubeF32 = null;
glDrawUtil.__gridCubeSizeLast = -1;
glDrawUtil.__gridCubeUnitLast = -1;

glDrawUtil.__bVertexAxesF32 = new Float32Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]);
glDrawUtil.__bColorAxesF32 = new Float32Array([1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1]);
glDrawUtil.__axesUnitLast = -1;


glDrawUtil.drawGrid = function (fgl, size, unit) {
    unit = unit || 1;

    if (unit != this.__gridUnitLast) {
        var bVertexGrid = this.__bVertexGrid;

        if (size != this.__gridSizeLast) {
            this.__genGridVertices(bVertexGrid, '__bVertexGridF32', '__bColorGridF32', size);
            this.__gridSizeLast = size;
        }

        this.__scaleGridVertices(bVertexGrid, this.__bVertexGridF32, unit);
    }

    var bColorGrid32 = this.__bColorGridF32;
    var colorLast = this.__bColorGridLast,
        colorfGL = fgl.getColorBuffer();

    fgl.drawArrays(this.__bVertexGridF32,
        null,
        Color.equals(colorfGL, colorLast) ?
            bColorGrid32 :
            fgl.bufferColors(colorfGL, bColorGrid32),
        null,
        fgl.LINES);

    this.__gridSizeLast = size;
    this.__gridUnitLast = unit;

    Color.set(colorLast, colorfGL);
};

glDrawUtil.__genGridVertices = function (verticesArr, verticesArrF32String, colorsArrF32String, size) {
    var l = verticesArr.length = (size + 1) * 12;

    var i = 0,
        sh = size * 0.5,
        ui;

    while (i < l) {
        ui = i / 12;

        verticesArr[i   ] = verticesArr[i + 8 ] = -sh;
        verticesArr[i + 1 ] = verticesArr[i + 4 ] = verticesArr[i + 7 ] = verticesArr[i + 10] = 0;
        verticesArr[i + 2 ] = verticesArr[i + 5 ] = verticesArr[i + 6 ] = verticesArr[i + 9 ] = -sh + ui;
        verticesArr[i + 3 ] = verticesArr[i + 11] = sh;

        i += 12;
    }

    this[verticesArrF32String] = new Float32Array(verticesArr);
    this[colorsArrF32String] = new Float32Array(l / 3 * 4);
};

glDrawUtil.__scaleGridVertices = function (verticesArr, verticesArrF32, unit) {
    var i = -1;
    var l = verticesArr.length;

    while (++i < l)verticesArrF32[i] = verticesArr[i] * unit;
};

glDrawUtil.drawAxes = function (fgl, unit) {
    unit = unit || 1;

    var bVerticesAxes = this.__bVertexAxesF32;
    var drawModeLast = fgl.getDrawMode();

    if (unit != this.__axesUnitLast) {
        bVerticesAxes[3 ] = bVerticesAxes[10] = bVerticesAxes[17] = unit;
    }

    fgl.drawMode(drawModeLast);
    fgl.drawArrays(bVerticesAxes, null, this.__bColorAxesF32, null, fgl.LINES);

    this.__axesUnitLast = unit;
    fgl.drawMode(drawModeLast);
};

glDrawUtil.drawGridCube = function (fgl, size, unit) {
    unit = unit || 1;

    if (unit != this.__gridCubeUnitLast) {
        var bVertexGrid = this.__bVertexGridCube;

        if (size != this.__gridCubeSizeLast) {
            this.__genGridVertices(bVertexGrid, '__bVertexGridCubeF32', '__bColorGridCubeF32', size);
            this.__gridCubeSizeLast = size;
        }

        this.__scaleGridVertices(bVertexGrid, this.__bVertexGridCubeF32, unit);
    }

    var bColorGrid32 = this.__bColorGridCubeF32;
    var colorLast = this.__bColorGridCubeLast,
        colorfGL = fgl.getColorBuffer();

    var bVertexGridCubeF32 = this.__bVertexGridCubeF32,
        color = Color.equals(colorfGL, colorLast) ?
            bColorGrid32 :
            fgl.bufferColors(colorfGL, bColorGrid32);


    var sh = size * 0.5 * unit,
        pih = Math.PI * 0.5;

    //TODO: merge

    fgl.pushMatrix();
    fgl.translate3f(0, -sh, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0, sh, 0);
    fgl.rotate3f(0, pih, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0, 0, -sh);
    fgl.rotate3f(pih, 0, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(0, 0, sh);
    fgl.rotate3f(pih, 0, 0);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(sh, 0, 0);
    fgl.rotate3f(pih, 0, pih);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    fgl.pushMatrix();
    fgl.translate3f(-sh, 0, 0);
    fgl.rotate3f(pih, 0, pih);
    fgl.drawArrays(bVertexGridCubeF32, null, color, null, fgl.LINES);
    fgl.popMatrix();

    this.__gridCubeSizeLast = size;
    this.__gridCubeUnitLast = unit;

    Color.set(colorLast, colorfGL);
};


glDrawUtil.pyramid = function (kgl, size) {
    kgl.pushMatrix();
    kgl.scale3f(size, size, size);
    kgl.drawElements(this.__bVertexPyramid, this.__bNormalPyramid, kgl.bufferColors(kgl._bColor, this.__bColorPyramid), null, this.__bIndexPyramid, kgl._drawMode);
    kgl.popMatrix();
};


glDrawUtil.octahedron = function (kgl, size) {
    kgl.pushMatrix();
    kgl.scale3f(size, size, size);
    kgl.drawElements(this.__bVertexOctahedron, this.__bNormalOctahedron, kgl.bufferColors(kgl._bColor, this.__bColorOctahedron), null, this.__bIndexOctahedron, kgl._drawMode);
    kgl.popMatrix();
};

glDrawUtil.__bVertexOctahedron = new Float32Array([-0.707, 0, 0, 0, 0.707, 0, 0, 0, -0.707, 0, 0, 0.707, 0, -0.707, 0, 0.707, 0, 0]);
glDrawUtil.__bNormalOctahedron = new Float32Array([1, -1.419496076238147e-9, 1.419496076238147e-9, -1.419496076238147e-9, -1, 1.419496076238147e-9, -1.419496076238147e-9, -1.419496076238147e-9, 1, 1.419496076238147e-9, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1, 1.419496076238147e-9, -1, -1.419496076238147e-9, 1.419496076238147e-9]);
glDrawUtil.__bColorOctahedron = new Float32Array(glDrawUtil.__bVertexOctahedron.length / Vec3.SIZE * Color.SIZE);
glDrawUtil.__bIndexOctahedron = new Uint16Array([3, 4, 5, 3, 5, 1, 3, 1, 0, 3, 0, 4, 4, 0, 2, 4, 2, 5, 2, 0, 1, 5, 2, 1]);
glDrawUtil.__bVertexPyramid = new Float32Array([ 0.0, 1.0, 0.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0]);
glDrawUtil.__bNormalPyramid = new Float32Array([0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, 0, -0.4472135901451111, -0.8944271802902222, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, -0.8944271802902222, -0.4472135901451111, 0, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0, -0.4472135901451111, 0.8944271802902222, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0.8944271802902222, -0.4472135901451111, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
glDrawUtil.__bColorPyramid = new Float32Array(glDrawUtil.__bVertexPyramid.length / Vec3.SIZE * Color.SIZE);
glDrawUtil.__bIndexPyramid = new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 12, 15, 14]);

module.exports = glDrawUtil;
},{"../math/Vec3":14,"../util/Color":19}],8:[function(require,module,exports){
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

},{"../math/Matrix44":12,"../system/common/Error":17,"./gl":6}],9:[function(require,module,exports){
var Matrix44 = require('../math/Matrix44');

module.exports = {
    perspective: function (m, fov, aspect, near, far) {
        var f = 1.0 / Math.tan(fov * 0.5),
            nf = 1.0 / (near - far);

        m[0] = f / aspect;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = f;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (2 * far * near) * nf;
        m[15] = 0;

        return m;

    },

    frustum: function (m, left, right, bottom, top, near, far) {
        var rl = 1 / (right - left),
            tb = 1 / (top - bottom),
            nf = 1 / (near - far);


        m[ 0] = (near * 2) * rl;
        m[ 1] = 0;
        m[ 2] = 0;
        m[ 3] = 0;
        m[ 4] = 0;
        m[ 5] = (near * 2) * tb;
        m[ 6] = 0;
        m[ 7] = 0;
        m[ 8] = (right + left) * rl;
        m[ 9] = (top + bottom) * tb;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (far * near * 2) * nf;
        m[15] = 0;

        return m;
    },

    lookAt: function (m, eye, target, up) {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2],
            targetx = target[0],
            tartety = target[1],
            targetz = target[2];

        if (Math.abs(eyex - targetx) < 0.000001 &&
            Math.abs(eyey - tartety) < 0.000001 &&
            Math.abs(eyez - targetz) < 0.000001) {
            return Matrix44.identity(m);
        }

        z0 = eyex - targetx;
        z1 = eyey - tartety;
        z2 = eyez - targetz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;

        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        len = !len ? 0 : 1 / len;

        x0 *= len;
        x1 *= len;
        x2 *= len;

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        len = !len ? 0 : 1 / len;

        y0 *= len;
        y1 *= len;
        y2 *= len;


        m[ 0] = x0;
        m[ 1] = y0;
        m[ 2] = z0;
        m[ 3] = 0;
        m[ 4] = x1;
        m[ 5] = y1;
        m[ 6] = z1;
        m[ 7] = 0;
        m[ 8] = x2;
        m[ 9] = y2;
        m[10] = z2;
        m[11] = 0;
        m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        m[15] = 1;

        return m;
    }
};
},{"../math/Matrix44":12}],10:[function(require,module,exports){
var _Math = {
    PI: Math.PI,
    HALF_PI: Math.PI * 0.5,
    QUARTER_PI: Math.PI * 0.25,
    TWO_PI: Math.PI * 2,
    EPSILON: 0.0001,

    lerp: function (a, b, v) {
        return (a * (1 - v)) + (b * v);
    },
    cosIntrpl: function (a, b, v) {
        v = (1 - Math.cos(v * Math.PI)) * 0.5;
        return (a * (1 - v) + b * v);
    },
    cubicIntrpl: function (a, b, c, d, v) {
        var a0, b0, c0, d0, vv;

        vv = v * v;
        a0 = d - c - a + b;
        b0 = a - b - a0;
        c0 = c - a;
        d0 = b;

        return a0 * v * vv + b0 * vv + c0 * v + d0;
    },

    hermiteIntrpl: function (a, b, c, d, v, tension, bias) {
        var v0, v1, v2, v3,
            a0, b0, c0, d0;

        tension = (1.0 - tension) * 0.5;

        var biasp = 1 + bias,
            biasn = 1 - bias;

        v2 = v * v;
        v3 = v2 * v;

        v0 = (b - a) * biasp * tension;
        v0 += (c - b) * biasn * tension;
        v1 = (c - b) * biasp * tension;
        v1 += (d - c) * biasn * tension;

        a0 = 2 * v3 - 3 * v2 + 1;
        b0 = v3 - 2 * v2 + v;
        c0 = v3 - v2;
        d0 = -2 * v3 + 3 * v2;

        return a0 * b + b0 * v0 + c0 * v1 + d0 * c;
    },

    randomFloat: function () {
        var r;

        switch (arguments.length) {
            case 0:
                r = Math.random();
                break;
            case 1:
                r = Math.random() * arguments[0];
                break;
            case 2:
                r = arguments[0] + (arguments[1] - arguments[0]) * Math.random();
                break;
        }

        return r;
    },

    randomInteger: function () {
        var r;

        switch (arguments.length) {
            case 0:
                r = 0.5 + Math.random();
                break;
            case 1:
                r = 0.5 + Math.random() * arguments[0];
                break;
            case 2:
                r = arguments[0] + ( 1 + arguments[1] - arguments[0]) * Math.random();
                break;
        }

        return Math.floor(r);
    },

    constrain: function () {
        var r;

        switch (arguments.length) {
            case 2:
                arguments[0] = (arguments[0] > arguments[1]) ? arguments[1] : arguments[0];
                break;
            case 3:
                arguments[0] = (arguments[0] > arguments[2]) ? arguments[2] : (arguments[0] < arguments[1]) ? arguments[1] : arguments[0];
                break;
        }

        return arguments[0];
    },

    normalize: function (value, start, end) {
        return (value - start) / (end - start);
    },
    map: function (value, inStart, inEnd, outStart, outEnd) {
        return outStart + (outEnd - outStart) * normalize(value, inStart, inEnd);
    },
    sin: function (value) {
        return Math.sin(value);
    },
    cos: function (value) {
        return Math.cos(value);
    },
    clamp: function (value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    saw: function (n) {
        return 2 * (n - Math.floor(0.5 + n));
    },
    tri: function (n) {
        return 1 - 4 * Math.abs(0.5 - this.frac(0.5 * n + 0.25));
    },
    rect: function (n) {
        var a = Math.abs(n);
        return (a > 0.5) ? 0 : (a == 0.5) ? 0.5 : (a < 0.5) ? 1 : -1;
    },
    frac: function (n) {
        return n - Math.floor(n);
    },
    sgn: function (n) {
        return n / Math.abs(n);
    },
    abs: function (n) {
        return Math.abs(n);
    },
    min: function (n) {
        return Math.min(n);
    },
    max: function (n) {
        return Math.max(n);
    },
    atan: function (n) {
        return Math.atan(n);
    },
    atan2: function (y, x) {
        return Math.atan2(y, x);
    },
    round: function (n) {
        return Math.round(n);
    },
    floor: function (n) {
        return Math.floor(n);
    },
    tan: function (n) {
        return Math.tan(n);
    },
    rad2deg: function (radians) {
        return radians * (180 / Math.PI);
    },
    deg2rad: function (degree) {
        return degree * (Math.PI / 180);
    },
    sqrt: function (value) {
        return Math.sqrt(value);
    },
    GreatestCommonDivisor: function (a, b) {
        return (b == 0) ? a : this.GreatestCommonDivisor(b, a % b);
    },
    isFloatEqual: function (a, b) {
        return (Math.abs(a - b) < this.EPSILON);
    },
    isPowerOfTwo: function (a) {
        return (a & (a - 1)) == 0;
    },
    swap: function (a, b) {
        var t = a;
        a = b;
        b = a;
    },
    pow: function (x, y) {
        return Math.pow(x, y);
    },
    log: function (n) {
        return Math.log(n);
    },
    cosh: function (n) {
        return (Math.pow(Math.E, n) + Math.pow(Math.E, -n)) * 0.5;
    },
    exp: function (n) {
        return Math.exp(n);
    },
    stepSmooth: function (n) {
        return n * n * (3 - 2 * n);
    },
    stepSmoothSquared: function (n) {
        return this.stepSmooth(n) * this.stepSmooth(n);
    },
    stepSmoothInvSquared: function (n) {
        return 1 - (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n));
    },
    stepSmoothCubed: function (n) {
        return this.stepSmooth(n) * this.stepSmooth(n) * this.stepSmooth(n) * this.stepSmooth(n);
    },
    stepSmoothInvCubed: function (n) {
        return 1 - (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n)) * (1 - this.stepSmooth(n));
    },
    stepSquared: function (n) {
        return n * n;
    },
    stepInvSquared: function (n) {
        return 1 - (1 - n) * (1 - n);
    },
    stepCubed: function (n) {
        return n * n * n * n;
    },
    stepInvCubed: function (n) {
        return 1 - (1 - n) * (1 - n) * (1 - n) * (1 - n);
    },
    catmullrom: function (a, b, c, d, i) {
        return a * ((-i + 2) * i - 1) * i * 0.5 +
            b * (((3 * i - 5) * i) * i + 2) * 0.5 +
            c * ((-3 * i + 4) * i + 1) * i * 0.5 +
            d * ((i - 1) * i * i) * 0.5;
    }
};


module.exports = _Math;
},{}],11:[function(require,module,exports){

//for node debug
var Mat33 =
{
    make : function()
    {
        return new Float32Array([1,0,0,
                                 0,1,0,
                                 0,0,1]);
    },

    transpose : function(out,a)
    {

        if (out === a) {
            var a01 = a[1], a02 = a[2], a12 = a[5];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a01;
            out[5] = a[7];
            out[6] = a02;
            out[7] = a12;
        } else {
            out[0] = a[0];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a[1];
            out[4] = a[4];
            out[5] = a[7];
            out[6] = a[2];
            out[7] = a[5];
            out[8] = a[8];
        }

        return out;
    }

};

module.exports = Mat33;
},{}],12:[function(require,module,exports){
var fMath = require('./Math'),
    Mat33 = require('./Matrix33');

//for node debug
var Matrix44 = {
    create: function () {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ]);
    },

    set: function (m0, m1) {
        m0[ 0] = m1[ 0];
        m0[ 1] = m1[ 1];
        m0[ 2] = m1[ 2];
        m0[ 3] = m1[ 3];

        m0[ 4] = m1[ 4];
        m0[ 5] = m1[ 5];
        m0[ 6] = m1[ 6];
        m0[ 7] = m1[ 7];

        m0[ 8] = m1[ 8];
        m0[ 9] = m1[ 9];
        m0[10] = m1[10];
        m0[11] = m1[11];

        m0[12] = m1[12];
        m0[13] = m1[13];
        m0[14] = m1[14];
        m0[15] = m1[15];


        return m0;
    },

    identity: function (m) {
        m[ 0] = 1;
        m[ 1] = m[ 2] = m[ 3] = 0;
        m[ 5] = 1;
        m[ 4] = m[ 6] = m[ 7] = 0;
        m[10] = 1;
        m[ 8] = m[ 9] = m[11] = 0;
        m[15] = 1;
        m[12] = m[13] = m[14] = 0;

        return m;
    },

    copy: function (m) {
        return new Float32Array(m);
    },

    createScale: function (sx, sy, sz, m) {
        m = m || this.create();

        m[0] = sx;
        m[5] = sy;
        m[10] = sz;

        return m;
    },

    createTranslation: function (tx, ty, tz, m) {
        m = m || this.create();

        m[12] = tx;
        m[13] = ty;
        m[14] = tz;

        return m;
    },

    createRotationX: function (a, m) {
        m = m || this.create();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[5] = cos;
        m[6] = -sin;
        m[9] = sin;
        m[10] = cos;

        return m;
    },

    createRotationY: function (a, m) {
        m = m || this.create();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[2] = sin;
        m[8] = -sin;
        m[10] = cos;

        return m;
    },

    createRotationZ: function (a, m) {
        m = m || this.create();

        var sin = Math.sin(a),
            cos = Math.cos(a);

        m[0] = cos;
        m[1] = sin;
        m[4] = -sin;
        m[5] = cos;

        return m;
    },

    createRotation: function (ax, ay, az, m) {
        m = m || this.create();

        var cosx = Math.cos(ax),
            sinx = Math.sin(ax),
            cosy = Math.cos(ay),
            siny = Math.sin(ay),
            cosz = Math.cos(az),
            sinz = Math.sin(az);

        m[ 0] = cosy * cosz;
        m[ 1] = -cosx * sinz + sinx * siny * cosz;
        m[ 2] = sinx * sinz + cosx * siny * cosz;

        m[ 4] = cosy * sinz;
        m[ 5] = cosx * cosz + sinx * siny * sinz;
        m[ 6] = -sinx * cosz + cosx * siny * sinz;

        m[ 8] = -siny;
        m[ 9] = sinx * cosy;
        m[10] = cosx * cosy;


        return m;
    },

    //temp from glMatrix
    createRotationOnAxis: function (rot, x, y, z, out) {
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.sqrt(x * x + y * y + z * z) < _Math.EPSILON) {
            return null;
        }

        var s, c, t,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;


        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rot);
        c = Math.cos(rot);
        t = 1 - c;

        out = out || Matrix44.create();

        a00 = 1;
        a01 = 0;
        a02 = 0;
        a03 = 0;
        a10 = 0;
        a11 = 1;
        a12 = 0;
        a13 = 0;
        a20 = 0;
        a21 = 0;
        a22 = 1;
        a23 = 0;

        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        out[0 ] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1 ] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2 ] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3 ] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4 ] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5 ] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6 ] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7 ] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8 ] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9 ] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return out;
    },

    multPre: function (m0, m1, m) {
        m = m || this.create();

        var m000 = m0[ 0], m001 = m0[ 1], m002 = m0[ 2], m003 = m0[ 3],
            m004 = m0[ 4], m005 = m0[ 5], m006 = m0[ 6], m007 = m0[ 7],
            m008 = m0[ 8], m009 = m0[ 9], m010 = m0[10], m011 = m0[11],
            m012 = m0[12], m013 = m0[13], m014 = m0[14], m015 = m0[15];

        var m100 = m1[ 0], m101 = m1[ 1], m102 = m1[ 2], m103 = m1[ 3],
            m104 = m1[ 4], m105 = m1[ 5], m106 = m1[ 6], m107 = m1[ 7],
            m108 = m1[ 8], m109 = m1[ 9], m110 = m1[10], m111 = m1[11],
            m112 = m1[12], m113 = m1[13], m114 = m1[14], m115 = m1[15];

        m[ 0] = m000 * m100 + m001 * m104 + m002 * m108 + m003 * m112;
        m[ 1] = m000 * m101 + m001 * m105 + m002 * m109 + m003 * m113;
        m[ 2] = m000 * m102 + m001 * m106 + m002 * m110 + m003 * m114;
        m[ 3] = m000 * m103 + m001 * m107 + m002 * m111 + m003 * m115;

        m[ 4] = m004 * m100 + m005 * m104 + m006 * m108 + m007 * m112;
        m[ 5] = m004 * m101 + m005 * m105 + m006 * m109 + m007 * m113;
        m[ 6] = m004 * m102 + m005 * m106 + m006 * m110 + m007 * m114;
        m[ 7] = m004 * m103 + m005 * m107 + m006 * m111 + m007 * m115;

        m[ 8] = m008 * m100 + m009 * m104 + m010 * m108 + m011 * m112;
        m[ 9] = m008 * m101 + m009 * m105 + m010 * m109 + m011 * m113;
        m[10] = m008 * m102 + m009 * m106 + m010 * m110 + m011 * m114;
        m[11] = m008 * m103 + m009 * m107 + m010 * m111 + m011 * m115;

        m[12] = m012 * m100 + m013 * m104 + m014 * m108 + m015 * m112;
        m[13] = m012 * m101 + m013 * m105 + m014 * m109 + m015 * m113;
        m[14] = m012 * m102 + m013 * m106 + m014 * m110 + m015 * m114;
        m[15] = m012 * m103 + m013 * m107 + m014 * m111 + m015 * m115;


        return m;
    },

    mult: function (m0, m1, m) {
        return this.multPre(m0, m1, m);
    },

    multPost: function (m0, m1, m) {
        return this.multPre(m1, m0, m);
    },

    invert: function (m, o) {
        o = o || m;

        var det;

        var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
            m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
            m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
            m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

        //TODO: add caching

        o[ 0] = m05 * m10 * m15 -
            m05 * m11 * m14 -
            m09 * m06 * m15 +
            m09 * m07 * m14 +
            m13 * m06 * m11 -
            m13 * m07 * m10;

        o[ 4] = -m04 * m10 * m15 +
            m04 * m11 * m14 +
            m08 * m06 * m15 -
            m08 * m07 * m14 -
            m12 * m06 * m11 +
            m12 * m07 * m10;

        o[ 8] = m04 * m09 * m15 -
            m04 * m11 * m13 -
            m08 * m05 * m15 +
            m08 * m07 * m13 +
            m12 * m05 * m11 -
            m12 * m07 * m09;

        o[12] = -m04 * m09 * m14 +
            m04 * m10 * m13 +
            m08 * m05 * m14 -
            m08 * m06 * m13 -
            m12 * m05 * m10 +
            m12 * m06 * m09;

        o[ 1] = -m01 * m10 * m15 +
            m01 * m11 * m14 +
            m09 * m02 * m15 -
            m09 * m03 * m14 -
            m13 * m02 * m11 +
            m13 * m03 * m10;

        o[ 5] = m00 * m10 * m15 -
            m00 * m11 * m14 -
            m08 * m02 * m15 +
            m08 * m03 * m14 +
            m12 * m02 * m11 -
            m12 * m03 * m10;

        o[ 9] = -m00 * m09 * m15 +
            m00 * m11 * m13 +
            m08 * m01 * m15 -
            m08 * m03 * m13 -
            m12 * m01 * m11 +
            m12 * m03 * m09;

        o[13] = m00 * m09 * m14 -
            m00 * m10 * m13 -
            m08 * m01 * m14 +
            m08 * m02 * m13 +
            m12 * m01 * m10 -
            m12 * m02 * m09;

        o[ 2] = m01 * m06 * m15 -
            m01 * m07 * m14 -
            m05 * m02 * m15 +
            m05 * m03 * m14 +
            m13 * m02 * m07 -
            m13 * m03 * m06;

        o[ 6] = -m00 * m06 * m15 +
            m00 * m07 * m14 +
            m04 * m02 * m15 -
            m04 * m03 * m14 -
            m12 * m02 * m07 +
            m12 * m03 * m06;

        o[10] = m00 * m05 * m15 -
            m00 * m07 * m13 -
            m04 * m01 * m15 +
            m04 * m03 * m13 +
            m12 * m01 * m07 -
            m12 * m03 * m05;

        o[14] = -m00 * m05 * m14 +
            m00 * m06 * m13 +
            m04 * m01 * m14 -
            m04 * m02 * m13 -
            m12 * m01 * m06 +
            m12 * m02 * m05;

        o[ 3] = -m01 * m06 * m11 +
            m01 * m07 * m10 +
            m05 * m02 * m11 -
            m05 * m03 * m10 -
            m09 * m02 * m07 +
            m09 * m03 * m06;

        o[ 7] = m00 * m06 * m11 -
            m00 * m07 * m10 -
            m04 * m02 * m11 +
            m04 * m03 * m10 +
            m08 * m02 * m07 -
            m08 * m03 * m06;

        o[11] = -m00 * m05 * m11 +
            m00 * m07 * m09 +
            m04 * m01 * m11 -
            m04 * m03 * m09 -
            m08 * m01 * m07 +
            m08 * m03 * m05;

        o[15] = m00 * m05 * m10 -
            m00 * m06 * m09 -
            m04 * m01 * m10 +
            m04 * m02 * m09 +
            m08 * m01 * m06 -
            m08 * m02 * m05;

        det = m00 * o[0] + m01 * o[4] + m02 * o[8] + m03 * o[12];

        if (det == 0) return null;

        det = 1.0 / det;

        o[ 0] *= det;
        o[ 1] *= det;
        o[ 2] *= det;
        o[ 3] *= det;
        o[ 4] *= det;
        o[ 5] *= det;
        o[ 6] *= det;
        o[ 7] *= det;
        o[ 8] *= det;
        o[ 9] *= det;
        o[10] *= det;
        o[11] *= det;
        o[12] *= det;
        o[13] *= det;
        o[14] *= det;
        o[15] *= det;

        return o;
    },


    inverted: function (m) {
        /*
         var inv = this.create();
         var det;

         var m00 = m[ 0], m01 = m[ 1], m02 = m[ 2], m03 = m[ 3],
         m04 = m[ 4], m05 = m[ 5], m06 = m[ 6], m07 = m[ 7],
         m08 = m[ 8], m09 = m[ 9], m10 = m[10], m11 = m[11],
         m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15];

         inv[ 0] =  m05  * m10  * m15 -
         m05  * m11  * m14 -
         m09  * m06  * m15 +
         m09  * m07  * m14 +
         m13  * m06  * m11 -
         m13  * m07  * m10;

         inv[ 4] = -m04  * m10  * m15 +
         m04  * m11  * m14 +
         m08  * m06  * m15 -
         m08  * m07  * m14 -
         m12  * m06  * m11 +
         m12  * m07  * m10;

         inv[ 8] =  m04  * m09  * m15 -
         m04  * m11  * m13 -
         m08  * m05  * m15 +
         m08  * m07  * m13 +
         m12  * m05  * m11 -
         m12  * m07  * m09;

         inv[12] = -m04  * m09  * m14 +
         m04  * m10  * m13 +
         m08  * m05  * m14 -
         m08  * m06  * m13 -
         m12  * m05  * m10 +
         m12  * m06  * m09;

         inv[ 1] = -m01  * m10  * m15 +
         m01  * m11  * m14 +
         m09  * m02  * m15 -
         m09  * m03  * m14 -
         m13  * m02  * m11 +
         m13  * m03  * m10;

         inv[ 5] =  m00  * m10  * m15 -
         m00  * m11  * m14 -
         m08  * m02  * m15 +
         m08  * m03  * m14 +
         m12  * m02  * m11 -
         m12  * m03  * m10;

         inv[ 9] = -m00  * m09  * m15 +
         m00  * m11  * m13 +
         m08  * m01  * m15 -
         m08  * m03  * m13 -
         m12  * m01  * m11 +
         m12  * m03  * m09;

         inv[13] =  m00  * m09  * m14 -
         m00  * m10  * m13 -
         m08  * m01  * m14 +
         m08  * m02  * m13 +
         m12  * m01  * m10 -
         m12  * m02  * m09;

         inv[ 2] =  m01  * m06  * m15 -
         m01  * m07  * m14 -
         m05  * m02  * m15 +
         m05  * m03  * m14 +
         m13  * m02  * m07 -
         m13  * m03  * m06;

         inv[ 6] = -m00  * m06  * m15 +
         m00  * m07  * m14 +
         m04  * m02  * m15 -
         m04  * m03  * m14 -
         m12  * m02  * m07 +
         m12  * m03  * m06;

         inv[10] =  m00  * m05  * m15 -
         m00  * m07  * m13 -
         m04  * m01  * m15 +
         m04  * m03  * m13 +
         m12  * m01  * m07 -
         m12  * m03  * m05;

         inv[14] = -m00  * m05  * m14 +
         m00  * m06  * m13 +
         m04  * m01  * m14 -
         m04  * m02  * m13 -
         m12  * m01  * m06 +
         m12  * m02  * m05;

         inv[ 3] = -m01  * m06  * m11 +
         m01  * m07  * m10 +
         m05  * m02  * m11 -
         m05  * m03  * m10 -
         m09  * m02  * m07 +
         m09  * m03  * m06;

         inv[ 7] =  m00  * m06  * m11 -
         m00  * m07  * m10 -
         m04  * m02  * m11 +
         m04  * m03  * m10 +
         m08  * m02  * m07 -
         m08  * m03  * m06;

         inv[11] = -m00  * m05  * m11 +
         m00  * m07  * m09 +
         m04  * m01  * m11 -
         m04  * m03  * m09 -
         m08  * m01  * m07 +
         m08  * m03  * m05;

         inv[15] =  m00  * m05  * m10 -
         m00  * m06  * m09 -
         m04  * m01  * m10 +
         m04  * m02  * m09 +
         m08  * m01  * m06 -
         m08  * m02  * m05;

         det = m00 * inv[0] + m01 * inv[4] + m02 * inv[8] + m03 * inv[12];

         if(det == 0) return null;

         det = 1.0 / det;

         inv[ 0]*=det;
         inv[ 1]*=det;
         inv[ 2]*=det;
         inv[ 3]*=det;
         inv[ 4]*=det;
         inv[ 5]*=det;
         inv[ 6]*=det;
         inv[ 7]*=det;
         inv[ 8]*=det;
         inv[ 9]*=det;
         inv[10]*=det;
         inv[11]*=det;
         inv[12]*=det;
         inv[13]*=det;
         inv[14]*=det;
         inv[15]*=det;


         return inv;

         */

        return this.invert(this.copy(m));


    },

    transposed: function (m) {
        var mo = this.create();

        mo[0 ] = m[0 ];
        mo[1 ] = m[4 ];
        mo[2 ] = m[8 ];
        mo[3 ] = m[12];

        mo[4 ] = m[1 ];
        mo[5 ] = m[5 ];
        mo[6 ] = m[9 ];
        mo[7 ] = m[13];

        mo[8 ] = m[2 ];
        mo[9 ] = m[6 ];
        mo[10] = m[10];
        mo[11] = m[14];

        mo[12] = m[3 ];
        mo[13] = m[7 ];
        mo[14] = m[11];
        mo[15] = m[15];

        return mo;
    },

    toMat33Inversed: function (mat44, mat33) {
        var a00 = mat44[0], a01 = mat44[1], a02 = mat44[2];
        var a10 = mat44[4], a11 = mat44[5], a12 = mat44[6];
        var a20 = mat44[8], a21 = mat44[9], a22 = mat44[10];

        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;

        var d = a00 * b01 + a01 * b11 + a02 * b21;
        if (!d) {
            return null;
        }
        var id = 1 / d;


        if (!mat33) {
            mat33 = Mat33.create();
        }

        mat33[0] = b01 * id;
        mat33[1] = (-a22 * a01 + a02 * a21) * id;
        mat33[2] = (a12 * a01 - a02 * a11) * id;
        mat33[3] = b11 * id;
        mat33[4] = (a22 * a00 - a02 * a20) * id;
        mat33[5] = (-a12 * a00 + a02 * a10) * id;
        mat33[6] = b21 * id;
        mat33[7] = (-a21 * a00 + a01 * a20) * id;
        mat33[8] = (a11 * a00 - a01 * a10) * id;

        return mat33;


    },

    multVec3: function (m, v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

        return v;
    },

    mutlVec3A: function (m, a, i) {
        i *= 3;

        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec3AI: function (m, a, i) {
        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
    },

    multVec4: function (m, v) {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        v[0] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        v[1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        v[2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        v[3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

        return v;


    },

    multVec4A: function (m, a, i) {
        i *= 3;

        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2],
            w = a[i + 3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i + 3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    multVec4AI: function (m, a, i) {
        var x = a[i  ],
            y = a[i + 1],
            z = a[i + 2],
            w = a[i + 3];

        a[i  ] = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12] * w;
        a[i + 1] = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13] * w;
        a[i + 2] = m[ 2] * x + m[ 6] * y + m[10] * z + m[14] * w;
        a[i + 3] = m[ 3] * x + m[ 7] * y + m[11] * z + m[15] * w;

    },

    isFloatEqual: function (m0, m1) {
        var i = -1;
        while (++i < 16) {
            if (!_Math.isFloatEqual(m0[i], m1[i]))return false;
        }
        return true;

    },

    toString: function (m) {
        return '[' + m[ 0] + ', ' + m[ 1] + ', ' + m[ 2] + ', ' + m[ 3] + ',\n' +
            ' ' + m[ 4] + ', ' + m[ 5] + ', ' + m[ 6] + ', ' + m[ 7] + ',\n' +
            ' ' + m[ 8] + ', ' + m[ 9] + ', ' + m[10] + ', ' + m[11] + ',\n' +
            ' ' + m[12] + ', ' + m[13] + ', ' + m[14] + ', ' + m[15] + ']';
    }
};

module.exports = Matrix44;
},{"./Math":10,"./Matrix33":11}],13:[function(require,module,exports){
var Vec2 =
{
    SIZE : 2,

    create : function(){
        return new Float32Array([0,0]);
    }
};

module.exports = Vec2;
},{}],14:[function(require,module,exports){
var Vec2 = require('./Vec2');

var Vec3 = {
    SIZE: 3,
    ZERO: function () {
        return new Float32Array([0, 0, 0])
    },
    ONE: function () {
        return new Float32Array([1, 1, 1]);
    },

    AXIS_X: function () {
        return new Float32Array([1, 0, 0])
    },
    AXIS_Y: function () {
        return new Float32Array([0, 1, 0])
    },
    AXIS_Z: function () {
        return new Float32Array([0, 0, 1])
    },

    create: function (x, y, z) {
        return new Float32Array([
                typeof x !== 'undefined' ? x : 0.0,
                typeof y !== 'undefined' ? y : 0.0,
                typeof z !== 'undefined' ? z : 0.0  ]);
    },

    set: function (v0, v1) {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];

        return v0;
    },

    set3f: function (v, x, y, z) {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    copy: function (v) {
        return new Float32Array(v);
    },

    add: function (v0, v1) {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];

        return v0;
    },

    sub: function (v0, v1) {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];

        return v0;
    },

    scale: function (v, n) {
        v[0] *= n;
        v[1] *= n;
        v[2] *= n;

        return v;
    },

    dot: function (v0, v1) {
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    },

    cross: function (v0, v1, vo) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        vo = vo || this.make();

        vo[0] = y0 * z1 - y1 * z0;
        vo[1] = z0 * x1 - z1 * x0;
        vo[2] = x0 * y1 - x1 * y0;


        return vo;
    },

    lerp: function (v0, v1, f) {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2];

        v0[0] = x0 * (1.0 - f) + v1[0] * f;
        v0[1] = y0 * (1.0 - f) + v1[1] * f;
        v0[2] = z0 * (1.0 - f) + v1[2] * f;

        return v0;
    },

    lerped: function (v0, v1, f, vo) {
        vo = vo || vo.create();

        vo[0] = v0[0];
        vo[1] = v0[1];
        vo[2] = v0[2];

        return this.lerp(vo, v1, f);
    },


    lerp3f: function (v, x, y, z, f) {
        var vx = v[0],
            vy = v[1],
            vz = v[2];

        v[0] = vx * (1.0 - f) + x * f;
        v[1] = vy * (1.0 - f) + y * f;
        v[2] = vz * (1.0 - f) + z * f;
    },

    lerped3f: function (v, x, y, z, f, vo) {
        vo = vo || this.make();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.lerp3f(vo, x, y, z, f);
    },


    length: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    lengthSq: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        return x * x + y * y + z * z;
    },

    safeNormalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var d = Math.sqrt(x * x + y * y + z * z);
        d = d || 1;

        var l = 1 / d;

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    normalize: function (v) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var l = 1 / Math.sqrt(x * x + y * y + z * z);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;

        return v;
    },

    distance: function (v0, v1) {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x * x + y * y + z * z);
    },

    distance3f: function (v, x, y, z) {
        return Math.sqrt(v[0] * x + v[1] * y + v[2] * z);
    },

    distanceSq: function (v0, v1) {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x * x + y * y + z * z;
    },

    distanceSq3f: function (v, x, y, z) {
        return v[0] * x + v[1] * y + v[2] * z;
    },

    limit: function (v, n) {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x * x + y * y + z * z,
            lsq = n * n;

        if ((dsq > lsq) && lsq > 0) {
            var nd = n / Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert: function (v) {
        v[0] *= -1;
        v[1] *= -1;
        v[2] *= -1;

        return v;
    },

    added: function (v0, v1, vo) {
        vo = vo || this.make();

        vo[0] = v0[0] + v1[0];
        vo[1] = v0[1] + v1[1];
        vo[2] = v0[2] + v1[2];

        return vo;
    },

    subbed: function (v0, v1, vo) {
        vo = vo || this.make();

        vo[0] = v0[0] - v1[0];
        vo[1] = v0[1] - v1[1];
        vo[2] = v0[2] - v1[2];

        return vo;
    },

    scaled: function (v, n, vo) {
        vo = vo || this.make();

        vo[0] = v[0] * n;
        vo[1] = v[1] * n;
        vo[2] = v[2] * n;

        return vo;
    },

    normalized: function (v, vo) {
        vo = vo || this.create();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.normalize(vo);
    },

    safeNormalized: function (v, vo) {
        vo = vo || this.create();

        vo[0] = v[0];
        vo[1] = v[1];
        vo[2] = v[2];

        return this.safeNormalize(vo);
    },

    random: function (unitX, unitY, unitZ) {
        unitX = typeof unitX !== 'undefined' ? unitX : 1.0;
        unitY = typeof unitY !== 'undefined' ? unitY : 1.0;
        unitZ = typeof unitZ !== 'undefined' ? unitZ : 1.0;

        return this.create((-0.5 + Math.random()) * 2 * unitX,
                (-0.5 + Math.random()) * 2 * unitY,
                (-0.5 + Math.random()) * 2 * unitZ);
    },

    toString: function (v) {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    },

    xy: function (v) {
        return Vec2.create(v[0], v[1]);
    },

    xz: function (v) {
        return Vec2.create(v[0], v[2]);
    }

};

module.exports = Vec3;




},{"./Vec2":13}],15:[function(require,module,exports){

//TODO:FINISH
var Vec4 =
{
    SIZE : 4,
    ZERO : function(){return new Float32Array([0,0,0,1.0])},

    make : function(x,y,z,w)
    {
        return new Float32Array([ x || 0.0,
            y || 0.0,
            z || 0.0,
            w || 1.0]);
    },

    fromVec3 : function(v)
    {
        return new Float32Array([ v[0], v[1], v[2] , 1.0]);
    },

    set : function(v0,v1)
    {
        v0[0] = v1[0];
        v0[1] = v1[1];
        v0[2] = v1[2];
        v0[3] = v1[3];

        return v0;
    },

    set3f :  function(v,x,y,z)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;

        return v;
    },

    set4f : function(v,x,y,z,w)
    {
        v[0] = x;
        v[1] = y;
        v[2] = z;
        v[3] = w;

        return v;

    },

    copy :  function(v)
    {
        return new Float32Array(v);
    },

    add : function(v0,v1)
    {
        v0[0] += v1[0];
        v0[1] += v1[1];
        v0[2] += v1[2];
        v0[3] += v1[3];

        return v0;
    },

    sub : function(v0,v1)
    {
        v0[0] -= v1[0];
        v0[1] -= v1[1];
        v0[2] -= v1[2];
        v0[3] -= v1[3];

        return v0;
    },

    scale : function(v,n)
    {
        v[0]*=n;
        v[1]*=n;
        v[2]*=n;
        v[3]*=n;

        return v;
    },

    dot : function(v0,v1)
    {
        return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
    },

    cross: function(v0,v1)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        return new Float32Array([y0*z1-y1*z0,z0*x1-z1*x0,x0*y1-x1*y0]);
    },

    slerp : function(v0,v1,f)
    {
        var x0 = v0[0],
            y0 = v0[1],
            z0 = v0[2],
            x1 = v1[0],
            y1 = v1[1],
            z1 = v1[2];

        var d = Math.max(-1.0,Math.min((x0*x1 + y0*y1 + z0*z1),1.0)),
            t = Math.acos(d) * f;

        var x = x0 - (x1 * d),
            y = y0 - (y1 * d),
            z = z0 - (z1 * d);

        var l = 1/Math.sqrt(x*x+y*y+z*z);

        x*=l;
        y*=l;
        z*=l;

        var ct = Math.cos(t),
            st = Math.sin(t);

        var xo = x0 * ct + x * st,
            yo = y0 * ct + y * st,
            zo = z0 * ct + z * st;

        return new Float32Array([xo,yo,zo]);
    },

    length : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        return Math.sqrt(x*x+y*y+z*z+w*w);
    },

    lengthSq :  function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        return x*x+y*y+z*z+w*w;
    },

    normalize : function(v)
    {
        var x = v[0],
            y = v[1],
            z = v[2],
            w = v[3];

        var l  = 1/Math.sqrt(x*x+y*y+z*z+w*w);

        v[0] *= l;
        v[1] *= l;
        v[2] *= l;
        v[3] *= l;

        return v;
    },

    distance : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return Math.sqrt(x*x+y*y+z*z);
    },

    distanceSq : function(v0,v1)
    {
        var x = v0[0] - v1[0],
            y = v0[1] - v1[1],
            z = v0[2] - v1[2];

        return x*x+y*y+z*z;
    },

    limit : function(v,n)
    {
        var x = v[0],
            y = v[1],
            z = v[2];

        var dsq = x*x + y*y + z*z,
            lsq = n * n;

        if((dsq > lsq) && lsq > 0)
        {
            var nd = n/Math.sqrt(dsq);

            v[0] *= nd;
            v[1] *= nd;
            v[2] *= nd;
        }

        return v;
    },

    invert : function(v)
    {
        v[0]*=-1;
        v[1]*=-1;
        v[2]*=-1;

        return v;
    },

    added  : function(v0,v1)
    {
        return this.add(this.copy(v0),v1);
    },

    subbed : function(v0,v1)
    {
        return this.sub(this.copy(v0),v1);
    },

    scaled : function(v,n)
    {
        return this.scale(this.copy(v),n);
    },

    normalized : function(v)
    {
        return this.normalize(this.copy(v));
    },

    toString : function(v)
    {
        return '[' + v[0] + ',' + v[1] + ',' + v[2] + ']';
    }

};

module.exports = Vec4;
},{}],16:[function(require,module,exports){
module.exports =
{
    APP_WIDTH  : 800,
    APP_HEIGHT : 600,

    APP_FPS : 30,

    APP_PLASK_WINDOW_TITLE : '',
    APP_PLASK_TYPE  : '3d',
    APP_PLASK_VSYNC : 'false',
    APP_PLASK_MULTISAMPLE : true,

    CAMERA_FOV : 45,
    CAMERA_NEAR : 0.1,
    CAMERA_FAR  : 100

};
},{}],17:[function(require,module,exports){
module.exports =
{
    METHOD_NOT_IMPLEMENTED: 'Method not implemented in target platform.',
    CLASS_IS_SINGLETON:     'App is singleton. Get via getInstance().',
    APP_NO_SETUP:           'No setup method added to app.',
    APP_NO_UPDATE :         'No update method added to app.',
    PLASK_WINDOW_SIZE_SET:  'Plask window size can only be set on startup.',
    WRONG_PLATFORM:         'Wrong Platform.',
    MATRIX_STACK_POP_ERROR: 'Matrix stack invalid pop.',
    VERTICES_IN_WRONG_SIZE: 'Vertices array has wrong length. Should be ',
    COLORS_IN_WRONG_SIZE:   'Color array length not equal to number of vertices.',
    DIRECTORY_DOESNT_EXIST: 'File target directory does not exist.',
    FILE_DOESNT_EXIST:      'File does not exist.',
    TEXTURE_WIDTH_NOT_P2:   'Texture imageData is not power of 2.',
    TEXTURE_HEIGHT_NOT_P2:  'Texture imageData is not power of 2.',
    TEXTURE_IMAGE_DATA_NULL:'Texture imageData is null.'
};
},{}],18:[function(require,module,exports){
var Platform = {WEB:'WEB',PLASK:'PLASK',NODE_WEBKIT:'NODE_WEBKIT'};
    Platform.__target = null;

Platform.getTarget  = function()
{

    if(!this.__target)
    {
        var bWindow     = typeof window !== 'undefined',
            bDocument   = typeof document !== 'undefined',
            bRequireF   = typeof require == 'function',
            bRequire    = !!require,
            bNodeWebkit = false;

        //TODO fix
        //hm this needs to be fixed -> browserify require vs node-webkit require
        //for now this does the job
        if(bDocument){
            bNodeWebkit = document.createElement('IFRAME').hasOwnProperty('nwdisable');
        }

        this.__target = (bWindow && bDocument && !bNodeWebkit) ? this.WEB :
                        (bWindow && bDocument &&  bNodeWebkit) ? this.NODE_WEBKIT :
                        (!bWindow && !bDocument && bRequireF && bRequire) ? this.PLASK :
                        null;

    }

    return this.__target;
};

module.exports = Platform;
},{}],19:[function(require,module,exports){
var fMath = require('../math/Math');

module.exports = {
    SIZE: 4,

    BLACK: function () {
        return new Float32Array([0, 0, 0, 1])
    },
    WHITE: function () {
        return new Float32Array([1, 1, 1, 1])
    },
    RED: function () {
        return new Float32Array([1, 0, 0, 1])
    },
    GREEN: function () {
        return new Float32Array([0, 1, 0, 1])
    },
    BLUE: function () {
        return new Float32Array([0, 0, 1, 1])
    },

    create: function (r, g, b, a) {
        return new Float32Array([ r, g, b, a]);
    },
    copy: function (c) {
        return this.create(c[0], c[1], c[2], c[3]);
    },

    set: function (c0, c1) {
        c0[0] = c1[0];
        c0[1] = c1[1];
        c0[2] = c1[2];
        c0[3] = c1[3];

        return c0;
    },

    set4f: function (c, r, g, b, a) {
        c[0] = r;
        c[1] = g;
        c[2] = b;
        c[3] = a;

        return c;
    },

    set3f: function (c, r, g, b) {
        c[0] = r;
        c[1] = g;
        c[2] = b;
        c[3] = 1.0;

        return c;
    },

    set2f: function (c, k, a) {
        c[0] = c[1] = c[2] = k;
        c[3] = a;

        return c;
    },

    set1f: function (c, k) {
        c[0] = c[1] = c[2] = k;
        c[3] = 1.0;

        return c;
    },

    set4i: function (c, r, g, b, a) {
        return this.set4f(c, r / 255.0, g / 255.0, b / 255.0, a);
    },
    set3i: function (c, r, g, b) {
        return this.set3f(c, r / 255.0, g / 255.0, b / 255.0);
    },
    set2i: function (c, k, a) {
        return this.set2f(c, k / 255.0, a);
    },
    set1i: function (c, k) {
        return this.set1f(c, k / 255.0);
    },
    toArray: function (c) {
        return c.toArray();
    },
    toString: function (c) {
        return '[' + c[0] + ',' + c[1] + ',' + c[2] + ',' + c[3] + ']';
    },

    interpolated: function (c0, c1, f) {
        var c = new Float32Array(4),
            fi = 1.0 - f;

        c[0] = c0[0] * fi + c1[0] * f;
        c[1] = c0[1] * fi + c1[1] * f;
        c[2] = c0[2] * fi + c1[2] * f;
        c[3] = c0[3] * fi + c1[3] * f;

        return c;
    },

    equals: function (c0, c1) {
        return _Math.isFloatEqual(c0[0], c1[0]) &&
            _Math.isFloatEqual(c0[1], c1[1]) &&
            _Math.isFloatEqual(c0[2], c1[2]) &&
            _Math.isFloatEqual(c0[3], c1[3]);
    },

    makeColorArrayf: function (r, g, b, a, length) {
        var arr = new Float32Array(length * 4), i = 0;
        while (i < arr.length) {
            arr[i + 0] = r;
            arr[i + 1] = g;
            arr[i + 2] = b;
            arr[i + 3] = a;
            i += 4;
        }
        return arr;
    },

    makeColorArray: function (color, length) {
        return this.makeColorArrayf(color[0], color[1], color[2], color[3], length);
    }
};
},{"../math/Math":10}],20:[function(require,module,exports){
var _Error = require('../system/common/Error'),
    Vec2 = require('../math/Vec2');

function Mouse() {
    if (Mouse.__instance)throw new Error(Error.CLASS_IS_SINGLETON);

    this._position = Vec2.create();
    this._positionLast = Vec2.create();
    this._state = null;
    this._stateLast = null;
    this._wheelDelta = 0;

    Mouse.__instance = this;
}

Mouse.prototype.getPosition = function () {
    return this._position;
};
Mouse.prototype.getPositionLast = function () {
    return this._positionLast;
};
Mouse.prototype.getX = function () {
    return this._position[0];
};
Mouse.prototype.getY = function () {
    return this._position[1];
};
Mouse.prototype.getXLast = function () {
    return this._positionLast[0];
};
Mouse.prototype.getYLast = function () {
    return this._positionLast[1];
};
Mouse.prototype.getState = function () {
    return this._state;
};
Mouse.prototype.getStateLast = function () {
    return this._stateLast;
};
Mouse.prototype.getWheelDelta = function () {
    return this._wheelDelta;
};

Mouse.__instance = null;
Mouse.getInstance = function () {
    return Mouse.__instance;
};

module.exports = Mouse;
},{"../math/Vec2":13,"../system/common/Error":17}],21:[function(require,module,exports){
var ObjectUtil = {

    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },

    isFloat32Array: function (arr) {
        return arr instanceof  Float32Array;
    },

    safeFloat32Array: function (arr) {
        return arr instanceof Float32Array ? arr : new Float32Array(arr);
    },

    safeUint16Array: function (arr) {
        return arr instanceof Uint16Array ? arr : new Uint16Array(arr);
    },

    copyFloat32Array: function (arr) {
        return new Float32Array(arr);
    },

    arrayResized: function (arr, len) {
        arr.length = len;
        return arr;
    },

    copyArray: function (arr) {
        var i = -1, l = arr.length, out = new Array(l);
        while (++i < l) {
            out[i] = arr[i];
        }
        return out;
    },

    setArray: function (a, b) {
        var i = -1, l = a.length;
        while (++i < l) {
            a[i] = b[i];
        }
    },

    setArrayOffsetIndex: function (arr, offset, len) {
        var i = -1, l = len || arr.length;
        while (++i < l) {
            arr[i] += offset;
        }
    },

    //check for content not object equality, object is number
    equalArrContent: function (a, b) {
        if (!a || !b || (!a && !b)) {
            return false;
        } else if (a.length != b.length) {
            return false
        } else {
            var i = -1, l = a.length;
            while (++i < l) {
                if (a[i] != b[i])return false;
            }
        }
        return true;
    },


    getFunctionBody: function (func) {
        return (func).toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
    },

    __toString: function (obj) {
        return Object.prototype.toString.call(obj);
    },

    isArray: function (obj) {
        return this.__toString(obj) == '[object Array]';
    },

    isObject: function (obj) {
        return obj === Object(obj)
    },

    isFunction: function (obj) {
        return this.__toString(obj) == '[object Function]';
    },

    isString: function (obj) {
        return this.__toString(obj) == '[object String]';
    },


    isFloat64Array: function (obj) {
        return this.__toString(obj) == '[object Float64Array]'
    },

    isUint8Array: function (obj) {
        return this.__toString(obj) == '[object Uint8Array]';
    },

    isUint16Array: function (obj) {
        return this.__toString(obj) == '[object Uint16Array]'
    },

    isUint32Array: function (obj) {
        return this.__toString(obj) == '[object Uint32Array]'
    },

    isTypedArray: function (obj) {
        return this.isUint8Array(obj) ||
            this.isUint16Array(obj) ||
            this.isUint32Array(obj) ||
            this.isFloat32Array(obj) ||
            this.isFloat32Array(obj);
    },

    toString: function (obj) {
        return this.isFunction(obj) ? this.getFunctionString(obj) :
            this.isArray(obj) ? this.getArrayString(obj) :
                this.isString(obj) ? this.getString(obj) :
                    this.isTypedArray(obj) ? this.getTypedArrayString(obj) :
                        this.isObject(obj) ? this.getObjectString(obj) :
                            obj;
    },

    getTypedArrayString: function (obj) {
        if (!this.isFloat32Array(obj)) {
            throw new TypeError('Object must be of type Float32Array');
        }

        if (obj.byteLength == 0)return '[]';
        var out = '[';

        for (var p in obj) {
            out += obj[p] + ',';
        }

        return out.substr(0, out.lastIndexOf(',')) + ']';

    },

    getString: function (obj) {
        return '"' + obj + '"';
    },

    getArrayString: function (obj) {
        if (!this.isArray(obj)) {
            throw new TypeError('Object must be of type array.');
        }
        var out = '[';
        if (obj.length == 0) {
            return out + ']';
        }

        var i = -1;
        while (++i < obj.length) {
            out += this.toString(obj[i]) + ',';
        }

        return out.substr(0, out.lastIndexOf(',')) + ']';
    },

    getObjectString: function (obj) {
        if (!this.isObject(obj)) {
            throw new TypeError('Object must be of type object.')
        }
        var out = '{';
        if (Object.keys(obj).length == 0) {
            return out + '}';
        }

        for (var p in obj) {
            out += p + ':' + this.toString(obj[p]) + ',';
        }

        return out.substr(0, out.lastIndexOf(',')) + '}';
    },

    //
    //  Parses func to string,
    //  must satisfy (if 'class'):
    //
    //  function ClassB(){
    //      ClassB.apply(this,arguments);ClassB.call...
    //  }
    //
    //  ClassB.prototype = Object.create(ClassA.prototype)
    //
    //  ClassB.prototype.method = function(){};
    //
    //  ClassB.STATIC = 1;
    //  ClassB.STATIC_OBJ = {};
    //  ClassB.STATIC_ARR = [];
    //

    getFunctionString: function (obj) {
        if (!this.isFunction(obj)) {
            throw new TypeError('Object must be of type function.');
        }

        var out = '';

        var name = obj.name,
            constructor = obj.toString(),
            inherited = 1 + constructor.indexOf('.call(this') || 1 + constructor.indexOf('.apply(this');

        out += constructor;

        if (inherited) {
            out += '\n\n';
            inherited -= 2;

            var baseClass = '';
            var char = '',
                i = 0;
            while (char != ' ') {
                baseClass = char + baseClass;
                char = constructor.substr(inherited - i, 1);
                ++i;
            }
            out += name + '.prototype = Object.create(' + baseClass + '.prototype);';
        }

        for (var p in obj) {
            out += '\n\n' + name + '.' + p + ' = ' + this.toString(obj[p]) + ';';
        }

        var prototype = obj.prototype;
        for (var p in prototype) {
            if (prototype.hasOwnProperty(p)) {
                out += '\n\n' + name + '.prototype.' + p + ' = ' + this.toString(prototype[p]) + ';';

            }
        }

        return out;
    },

    toArray: function (float32Array) {
        return Array.prototype.slice.call(float32Array);
    },

    setVec3Array : function(float32Array, index, vec3){
        index = index * 3;
        float32Array[index  ] = vec3.x;
        float32Array[index+1] = vec3.y;
        float32Array[index+2] = vec3.z;
    }
};

module.exports = ObjectUtil;

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vZXhhbXBsZXMvMDBfQmFzaWNfQXBwbGljYXRpb24vYXBwLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2FwcC9BcHAuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vZm9hbS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nbC9DYW1lcmFQZXJzcC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nbC9Qcm9ncmFtLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dsL2dsLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL2dsL2dsRHJhdy5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nbC9nbE1hdHJpeC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9nbC9nbHUuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9NYXRoLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL21hdGgvTWF0cml4MzMuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9NYXRyaXg0NC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9tYXRoL1ZlYzIuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vbWF0aC9WZWMzLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL21hdGgvVmVjNC5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9zeXN0ZW0vY29tbW9uL0RlZmF1bHQuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vc3lzdGVtL2NvbW1vbi9FcnJvci5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS9zeXN0ZW0vY29tbW9uL1BsYXRmb3JtLmpzIiwiL1VzZXJzL2F1dG9tYXQvV2Vic3Rvcm1Qcm9qZWN0cy9Gb2FtL3NyYy9mb2FtL3V0aWwvQ29sb3IuanMiLCIvVXNlcnMvYXV0b21hdC9XZWJzdG9ybVByb2plY3RzL0ZvYW0vc3JjL2ZvYW0vdXRpbC9Nb3VzZS5qcyIsIi9Vc2Vycy9hdXRvbWF0L1dlYnN0b3JtUHJvamVjdHMvRm9hbS9zcmMvZm9hbS91dGlsL09iamVjdFV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3c0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZvYW0gICAgICAgID0gcmVxdWlyZSgnLi4vLi4vc3JjL2ZvYW0vZm9hbS5qcycpLFxuICAgIGdsICAgICAgICAgID0gRm9hbS5nbCxcbiAgICBnbE1hdHJpeCAgICA9IEZvYW0uZ2xNYXRyaXgsXG5cbiAgICBDYW1lcmFQZXJzcCA9IEZvYW0uQ2FtZXJhUGVyc3AsXG4gICAgVmVjMyAgICAgICAgPSBGb2FtLlZlYzMsXG4gICAgUHJvZ3JhbSAgICAgID0gRm9hbS5Qcm9ncmFtO1xuXG5cblxudmFyIHNoYWRlclNvdXJjZSA9ICcnO1xuXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgRm9hbS5BcHBsaWNhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5BcHAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGb2FtLkFwcGxpY2F0aW9uLnByb3RvdHlwZSk7XG5cbkFwcC5wcm90b3R5cGUuc2V0dXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRGUFMoNjApO1xuICAgIHRoaXMuc2V0V2luZG93U2l6ZSg4MDAsIDYwMCk7XG5cbiAgICB2YXIgIGdsID0gdGhpcy5nbDtcblxuICAgIGdsLnZpZXdwb3J0KDAsMCx0aGlzLmdldFdpbmRvd1dpZHRoLHRoaXMuZ2V0V2luZG93SGVpZ2h0KCkpO1xuXG4gICAgdGhpcy5fY2FtZXJhID0gbmV3IENhbWVyYVBlcnNwKCk7XG4gICAgdGhpcy5fY2FtZXJhLnNldFBlcnNwZWN0aXZlKDY1LCB0aGlzLmdldFdpbmRvd0FzcGVjdFJhdGlvKCksIC0xLCAxMCk7XG4gICAgdGhpcy5fY2FtZXJhLmxvb2tBdChWZWMzLk9ORSgpLCBWZWMzLlpFUk8oKSk7XG5cbiAgICB0aGlzLl9wcm9ncmFtID0gbmV3IFByb2dyYW0oc2hhZGVyU291cmNlKTtcbiAgICB0aGlzLl92Ym8gPSBnbC5jcmVhdGVCdWZmZXIoKTtcblxuICAgIHZhciBzaXplXzIgPSAwLjU7XG4gICAgdGhpcy5fdmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KFxuICAgICAgICBbLXNpemVfMiwtc2l6ZV8yLC1zaXplXzIsXG4gICAgICAgICAgc2l6ZV8yLC1zaXplXzIsLXNpemVfMixcbiAgICAgICAgICBzaXplXzIsLXNpemVfMiwtc2l6ZV8yLFxuICAgICAgICAgIHNpemVfMiwtc2l6ZV8yLCBzaXplXzJdKTtcblxuICAgIHRoaXMuX2NvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkoXG4gICAgICAgIFsxLDEsMSwxLFxuICAgICAgICAgMSwxLDEsMSxcbiAgICAgICAgIDEsMSwxLDEsXG4gICAgICAgICAxLDEsMSwxXSk7XG5cbn07XG5cbkFwcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNhbWVyYSA9IHRoaXMuX2NhbWVyYTtcbiAgICB2YXIgcHJvZ3JhbSA9IHRoaXMuX3Byb2dyYW07XG4gICAgdmFyIHZibyA9IHRoaXMuX3ZibztcblxuICAgIGdsLmNsZWFyQ29sb3IoMSwwLDAsMSk7XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgY2FtZXJhLnVwZGF0ZU1hdHJpY2VzKCk7XG4gICAgZ2xNYXRyaXguc2V0TWF0cmljZXNDYW1lcmEoY2FtZXJhKTtcblxuICAgIHByb2dyYW0uYmluZCgpO1xuXG4gICAgdmFyIHZlcnRpY2VzID0gdGhpcy5fdmVydGljZXMsXG4gICAgICAgIGNvbG9ycyAgID0gdGhpcy5fY29sb3JzO1xuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZibyk7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsdmVydGljZXMuYnl0ZUxlbmd0aCArIGNvbG9ycy5ieXRlTGVuZ3RoLCBnbC5TVEFUSUNfRFJBVyk7XG4gICAgZ2wuYnVmZmVyU3ViRGF0YShnbC5BUlJBWV9CVUZGRVIsIDAsIHZlcnRpY2VzKTtcbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdmVydGljZXMuYnl0ZUxlbmd0aCwgY29sb3JzKTtcblxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocHJvZ3JhbS5hVmVydGV4UG9zaXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwcm9ncmFtLmFWZXJ0ZXhDb2xvciwgICAgNCwgZ2wuRkxPQVQsIGZhbHNlLCAwLCB2ZXJ0aWNlcy5ieXRlTGVuZ3RoKTtcblxuICAgIHByb2dyYW0udW5pZm9ybU1hdHJpeDRmdihwcm9ncmFtLnVNb2RlbFZpZXdNYXRyaXgsIGZhbHNlLCAgZ2xNYXRyaXguZ2V0TW9kZWxWaWV3TWF0cml4KCkpO1xuICAgIHByb2dyYW0udW5pZm9ybU1hdHJpeDRmdihwcm9ncmFtLnVQcm9qZWN0aW9uTWF0cml4LGZhbHNlLCAgZ2xNYXRyaXguZ2V0UHJvamVjdGlvbk1hdHJpeCgpKSA7XG5cbiAgICBnbC5kcmF3QXJyYXlzKGdsLlBPSU5UUywgMCwgNCk7XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG4gICAgcHJvZ3JhbS51bmJpbmQoKTtcblxuXG5cblxuXG5cblxuXG5cbn07XG5cbnZhciBhcHA7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJyxmdW5jdGlvbigpe1xuICAgIEZpbGVVdGlsLmxvYWQoJy4uL2V4YW1wbGVzLzAwX0Jhc2ljX0FwcGxpY2F0aW9uL3Byb2dyYW0uZ2xzbCcsZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIHNoYWRlclNvdXJjZSA9IGRhdGE7XG4gICAgICAgIGFwcCA9IG5ldyBBcHAoKTtcbiAgICB9KTtcbn0pO1xuIiwidmFyIGZFcnJvciA9IHJlcXVpcmUoJy4uL3N5c3RlbS9jb21tb24vRXJyb3InKSxcbiAgICBPYmplY3RVdGlsID0gcmVxdWlyZSgnLi4vdXRpbC9PYmplY3RVdGlsJyksXG4gICAgUGxhdGZvcm0gPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL1BsYXRmb3JtJyksXG4gICAgTW91c2UgPSByZXF1aXJlKCcuLi91dGlsL01vdXNlJyk7XG5cbnZhciBnbCAgICAgPSByZXF1aXJlKCcuLi9nbC9nbCcpLFxuICAgIGdsRHJhdyA9IHJlcXVpcmUoJy4uL2dsL2dsRHJhdycpO1xuXG52YXIgRGVmYXVsdCAgICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL0RlZmF1bHQnKTtcblxuZnVuY3Rpb24gQXBwKCkge1xuICAgIGlmIChBcHAuX19pbnN0YW5jZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuQ0xBU1NfSVNfU0lOR0xFVE9OKTtcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0ID0gUGxhdGZvcm0uZ2V0VGFyZ2V0KCk7XG4gICAgaWYgKE9iamVjdFV0aWwuaXNVbmRlZmluZWQodGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuV1JPTkdfUExBVEZPUk0pO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gIENvbnRleHQgJiBXaW5kb3dcbiAgICAvL1xuICAgIHRoaXMuX3dpbmRvd1RpdGxlID0gbnVsbDtcbiAgICB0aGlzLl9mdWxsV2luZG93ID0gZmFsc2U7XG4gICAgdGhpcy5fZnVsbHNjcmVlbiA9IGZhbHNlO1xuICAgIHRoaXMuX3dpbmRvd1NpemUgPSBbMCwwXTtcbiAgICB0aGlzLl93aW5kb3dSYXRpbyA9IDA7XG5cbiAgICAvL1xuICAgIC8vICBpbnB1dFxuICAgIC8vXG4gICAgdGhpcy5fa2V5RG93biA9IGZhbHNlO1xuICAgIHRoaXMuX2tleVN0ciA9ICcnO1xuICAgIHRoaXMuX2tleUNvZGUgPSAnJztcblxuICAgIHRoaXMuX21vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlTW92ZSA9IGZhbHNlO1xuICAgIHRoaXMuX21vdXNlV2hlZWxEZWx0YSA9IDAuMDtcbiAgICB0aGlzLl9tb3VzZU1vdmUgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZUJvdW5kcyA9IHRydWU7XG4gICAgdGhpcy5faGlkZUN1cnNvciA9IGZhbHNlO1xuXG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZSgpO1xuXG4gICAgLy9cbiAgICAvLyAgdGltZVxuICAgIC8vXG4gICAgdGhpcy5fZnJhbWVudW0gPSAwO1xuICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgIHRoaXMuX3RpbWVTdGFydCA9IERhdGUubm93KCk7XG4gICAgdGhpcy5fdGltZU5leHQgPSAwO1xuICAgIHRoaXMuX3RhcmdldEZQUyA9IC0xO1xuICAgIHRoaXMuX3RpbWVJbnRlcnZhbCA9IC0xO1xuICAgIHRoaXMuX3RpbWVEZWx0YSA9IDA7XG4gICAgdGhpcy5fdGltZUVsYXBzZWQgPSAwO1xuICAgIHRoaXMuX2xvb3AgPSB0cnVlO1xuXG4gICAgdGhpcy5zZXRGUFMoMzAuMCk7XG5cbiAgICAvL1xuICAgIC8vICBjYW52YXMgJiBjb250ZXh0XG4gICAgLy9cbiAgICB2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywnMCcpO1xuICAgICAgICBjYW52YXMuZm9jdXMoKTtcblxuICAgIGdsLmNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2Via2l0LTNkJykgfHxcbiAgICAgICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKSB8fFxuICAgICAgICAgICAgICAgICBjYW52YXMuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiKTtcblxuICAgIGdyYXBoaWNzLm1hdHJpeCA9IG5ldyBnbE1hdHJpeCgpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG5cblxuXG4gICAgIEFwcC5fX2luc3RhbmNlID0gdGhpcztcblxuICAgIC8vXG4gICAgLy9cbiAgICAvL1xuXG4gICAgdGhpcy5zZXR1cCgpO1xuXG4gICAgaWYodGhpcy5fbG9vcCl7XG4gICAgICAgIHZhciB0aW1lLCB0aW1lRGVsdGE7XG4gICAgICAgIHZhciB0aW1lSW50ZXJ2YWwgPSB0aGlzLl90aW1lSW50ZXJ2YWw7XG4gICAgICAgIHZhciB0aW1lTmV4dDtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSwgbnVsbCk7XG5cbiAgICAgICAgICAgIHRpbWUgPSBzZWxmLl90aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRpbWVEZWx0YSA9IHRpbWUgLSBzZWxmLl90aW1lTmV4dDtcblxuICAgICAgICAgICAgc2VsZi5fdGltZURlbHRhID0gTWF0aC5taW4odGltZURlbHRhIC8gdGltZUludGVydmFsLCAxKTtcblxuXG4gICAgICAgICAgICBpZiAodGltZURlbHRhID4gdGltZUludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGltZU5leHQgPSBzZWxmLl90aW1lTmV4dCA9IHRpbWUgLSAodGltZURlbHRhICUgdGltZUludGVydmFsKTtcblxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLl90aW1lRWxhcHNlZCA9ICh0aW1lTmV4dCAtIHNlbGYuX3RpbWVTdGFydCkgLyAxMDAwLjA7XG4gICAgICAgICAgICAgICAgc2VsZi5fZnJhbWVudW0rKztcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cblxufVxuXG5BcHAuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEFwcC5fX2luc3RhbmNlO1xufTtcblxuQXBwLnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoRXJyb3IuQVBQX05PX1NFVFVQKTtcbn07XG5cbkFwcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihFcnJvci5BUFBfTk9fVVBEQVRFKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIHdpbmRvd1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbkFwcC5wcm90b3R5cGUuc2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYodGhpcy5fZnVsbFdpbmRvdyl7XG4gICAgICAgIHdpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKHdpZHRoICA9PSB0aGlzLl93aW5kb3dTaXplWzBdICYmIGhlaWdodCA9PSB0aGlzLl93aW5kb3dTaXplWzFdKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3dpbmRvd1NpemVbMF0gPSB3aWR0aDtcbiAgICB0aGlzLl93aW5kb3dTaXplWzFdID0gaGVpZ2h0O1xuICAgIHRoaXMuX3dpbmRvd1JhdGlvICAgPSB3aWR0aCAvIGhlaWdodDtcblxuICAgIHRoaXMuX3VwZGF0ZUNhbnZhc1NpemUoKTtcbn07XG5cbkFwcC5wcm90b3R5cGUuc2V0RnVsbHNjcmVlbiA9IGZ1bmN0aW9uKGJvb2wpe1xuICAgIHRoaXMuX2Z1bGxzY3JlZW4gPSBib29sO1xufTtcblxuQXBwLnByb3RvdHlwZS5zZXRGdWxsV2luZG93ID0gZnVuY3Rpb24oYm9vbCl7XG4gICAgdGhpcy5fZnVsbFdpbmRvdyA9IGJvb2w7XG59XG5cbkFwcC5wcm90b3R5cGUuX3VwZGF0ZUNhbnZhc1NpemUgPSBmdW5jdGlvbigpe1xuICAgIHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXMsXG4gICAgICAgIHdpZHRoICA9IHRoaXMuX3dpbmRvd1NpemVbMF0sXG4gICAgICAgIGhlaWdodCA9IHRoaXMuX3dpbmRvd1NpemVbMV07XG5cbiAgICBjYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0V2luZG93U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2luZG93U2l6ZS5zbGljZSgpO1xufTtcblxuQXBwLnByb3RvdHlwZS5nZXRXaW5kb3dXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2luZG93U2l6ZVswXTtcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0V2luZG93SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl93aW5kb3dTaXplWzFdO1xufTtcblxuQXBwLnByb3RvdHlwZS5nZXRXaW5kb3dBc3BlY3RSYXRpbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fd2luZG93UmF0aW87XG59O1xuXG5BcHAucHJvdG90eXBlLm9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gKGUpIHt9O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIGZyYW1lcmF0ZSAvIHRpbWVcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5BcHAucHJvdG90eXBlLnNldEZQUyA9IGZ1bmN0aW9uIChmcHMpIHtcbiAgICB0aGlzLl90YXJnZXRGUFMgPSBmcHM7XG4gICAgdGhpcy5fdGltZUludGVydmFsID0gdGhpcy5fdGFyZ2V0RlBTIC8gMTAwMC4wO1xufTtcblxuQXBwLnByb3RvdHlwZS5nZXRGUFMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RhcmdldEZQUztcbn07XG5cbkFwcC5wcm90b3R5cGUuZ2V0RnJhbWVzRWxhcHNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZnJhbWVudW07XG59O1xuQXBwLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGltZUVsYXBzZWQ7XG59O1xuQXBwLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lXG59O1xuXG5BcHAucHJvdG90eXBlLmdldFRpbWVTdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGltZVN0YXJ0O1xufTtcblxuQXBwLnByb3RvdHlwZS5nZXRUaW1lRGVsdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVEZWx0YTtcbn07XG5cbkFwcC5wcm90b3R5cGUubG9vcCA9IGZ1bmN0aW9uKGxvb3Ape1xuICAgIHRoaXMuX2xvb3AgPSBsb29wO1xufVxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gIGlucHV0XG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG5BcHAucHJvdG90eXBlLmlzS2V5RG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5RG93bjtcbn07XG5BcHAucHJvdG90eXBlLmlzTW91c2VEb3duID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tb3VzZURvd247XG59O1xuQXBwLnByb3RvdHlwZS5pc01vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW91c2VNb3ZlO1xufTtcbkFwcC5wcm90b3R5cGUuZ2V0S2V5Q29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5Q29kZTtcbn07XG5BcHAucHJvdG90eXBlLmdldEtleVN0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5U3RyO1xufTtcbkFwcC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tb3VzZVdoZWVsRGVsdGE7XG59O1xuXG5cbkFwcC5wcm90b3R5cGUub25LZXlEb3duID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwLnByb3RvdHlwZS5vbktleVVwID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwLnByb3RvdHlwZS5vbk1vdXNlVXAgPSBmdW5jdGlvbiAoZSkge307XG5BcHAucHJvdG90eXBlLm9uTW91c2VEb3duID0gZnVuY3Rpb24gKGUpIHt9O1xuQXBwLnByb3RvdHlwZS5vbk1vdXNlV2hlZWwgPSBmdW5jdGlvbiAoZSkge307XG5BcHAucHJvdG90eXBlLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24gKGUpIHt9O1xuXG5cbi8qXG4gQXBwLnByb3RvdHlwZS5nZXRXaW5kb3dXaWR0aCAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvd1dpZHRoKCk7fTtcbiBBcHAucHJvdG90eXBlLmdldFdpbmRvd0hlaWdodCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0V2luZG93SGVpZ2h0KCk7fTtcblxuIEFwcC5wcm90b3R5cGUuc2V0VXBkYXRlID0gZnVuY3Rpb24oYm9vbCl7dGhpcy5fYXBwSW1wbC5zZXRVcGRhdGUoYm9vbCk7fTtcblxuXG5cbiBBcHAucHJvdG90eXBlLnNldFdpbmRvd1RpdGxlICAgICAgID0gZnVuY3Rpb24odGl0bGUpe3RoaXMuX2FwcEltcGwuc2V0V2luZG93VGl0bGUodGl0bGUpO307XG4gQXBwLnByb3RvdHlwZS5yZXN0cmljdE1vdXNlVG9GcmFtZSA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9hcHBJbXBsLnJlc3RyaWN0TW91c2VUb0ZyYW1lKGJvb2wpO307XG4gQXBwLnByb3RvdHlwZS5oaWRlTW91c2VDdXJzb3IgICAgICA9IGZ1bmN0aW9uKGJvb2wpIHt0aGlzLl9hcHBJbXBsLmhpZGVNb3VzZUN1cnNvcihib29sKTt9O1xuXG4gQXBwLnByb3RvdHlwZS5zZXRGdWxsV2luZG93RnJhbWUgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbFdpbmRvd0ZyYW1lKGJvb2wpO307XG4gQXBwLnByb3RvdHlwZS5zZXRGdWxsc2NyZWVuICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RnVsbHNjcmVlbih0cnVlKTt9O1xuIEFwcC5wcm90b3R5cGUuaXNGdWxsc2NyZWVuICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzRnVsbHNjcmVlbigpO307XG4gQXBwLnByb3RvdHlwZS5zZXRCb3JkZXJsZXNzICAgICAgID0gZnVuY3Rpb24oYm9vbCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0Qm9yZGVybGVzcyhib29sKTt9O1xuIEFwcC5wcm90b3R5cGUuaXNCb3JkZXJsZXNzICAgICAgICA9IGZ1bmN0aW9uKCkgICAge3JldHVybiB0aGlzLl9hcHBJbXBsLmlzQm9yZGVybGVzcygpO307XG4gQXBwLnByb3RvdHlwZS5zZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24obnVtKSB7cmV0dXJuIHRoaXMuX2FwcEltcGwuc2V0RGlzcGxheShudW0pO307XG4gQXBwLnByb3RvdHlwZS5nZXREaXNwbGF5ICAgICAgICAgID0gZnVuY3Rpb24oKSAgICB7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RGlzcGxheSgpO307XG5cbiBBcHAucHJvdG90eXBlLnNldEZQUyA9IGZ1bmN0aW9uKGZwcyl7dGhpcy5fYXBwSW1wbC5zZXRGUFMoZnBzKTt9O1xuXG5cbiBBcHAucHJvdG90eXBlLmlzS2V5RG93biAgICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNLZXlEb3duKCk7fTtcbiBBcHAucHJvdG90eXBlLmlzTW91c2VEb3duICAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuaXNNb3VzZURvd24oKTt9O1xuIEFwcC5wcm90b3R5cGUuaXNNb3VzZU1vdmUgICAgICAgID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5pc01vdXNlTW92ZSgpO307XG4gQXBwLnByb3RvdHlwZS5nZXRLZXlTdHIgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleVN0cigpO307XG4gQXBwLnByb3RvdHlwZS5nZXRLZXlDb2RlICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldEtleUNvZGUoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0TW91c2VXaGVlbERlbHRhID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYXBwSW1wbC5nZXRNb3VzZVdoZWVsRGVsdGEoKTt9O1xuXG5cbiBBcHAucHJvdG90eXBlLm9uS2V5RG93biAgICA9IGZ1bmN0aW9uKGUpe307XG4gQXBwLnByb3RvdHlwZS5vbktleVVwICAgICAgPSBmdW5jdGlvbihlKXt9O1xuIEFwcC5wcm90b3R5cGUub25Nb3VzZVVwICAgID0gZnVuY3Rpb24oZSl7fTtcbiBBcHAucHJvdG90eXBlLm9uTW91c2VEb3duICA9IGZ1bmN0aW9uKGUpe307XG4gQXBwLnByb3RvdHlwZS5vbk1vdXNlV2hlZWwgPSBmdW5jdGlvbihlKXt9O1xuIEFwcC5wcm90b3R5cGUub25Nb3VzZU1vdmUgID0gZnVuY3Rpb24oZSl7fTtcblxuIEFwcC5wcm90b3R5cGUub25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbihlKXt9O1xuXG4gQXBwLnByb3RvdHlwZS5nZXRGcmFtZXNFbGFwc2VkICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0RnJhbWVzRWxhcHNlZCgpO307XG4gQXBwLnByb3RvdHlwZS5nZXRTZWNvbmRzRWxhcHNlZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0U2Vjb25kc0VsYXBzZWQoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0VGltZSAgICAgICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWUoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0VGltZVN0YXJ0ICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVTdGFydCgpO307XG4gQXBwLnByb3RvdHlwZS5nZXRUaW1lTmV4dCAgICAgICA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0VGltZU5leHQoKTt9O1xuIEFwcC5wcm90b3R5cGUuZ2V0VGltZURlbHRhICAgICAgPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFRpbWVEZWx0YSgpO307XG5cbiBBcHAucHJvdG90eXBlLmdldFdpbmRvdyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2FwcEltcGwuZ2V0V2luZG93KCk7fTtcblxuIEFwcC5wcm90b3R5cGUuZ2V0V2luZG93QXNwZWN0UmF0aW8gPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLl9hcHBJbXBsLmdldFdpbmRvd0FzcGVjdFJhdGlvKCk7fTtcblxuIEFwcC5fX2luc3RhbmNlICAgPSBudWxsO1xuIEFwcC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKCl7cmV0dXJuIEFwcC5fX2luc3RhbmNlO307XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXBwO1xuIiwiLyoqXG4gKlxuICpcbiAqICBGIHwgTyB8IEEgfCBNXG4gKlxuICpcbiAqIEZvYW0gLSBBIFBsYXNrL1dlYiBHTCB0b29sa2l0XG4gKlxuICogRm9hbSBpcyBhdmFpbGFibGUgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgbGljZW5zZS4gIFRoZSBmdWxsIHRleHQgb2YgdGhlXG4gKiBNSVQgbGljZW5zZSBpcyBpbmNsdWRlZCBiZWxvdy5cbiAqXG4gKiBNSVQgTGljZW5zZVxuICogPT09PT09PT09PT1cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgSGVucnlrIFdvbGxpay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAqIFNPRlRXQVJFLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuLy8gICAgTWF0aCAgICAgICAgOiByZXF1aXJlKCcuL21hdGgvX01hdGgnKSxcbi8vICAgIFZlYzIgICAgICAgIDogcmVxdWlyZSgnLi9tYXRoL2ZWZWMyJyksXG4gICAgICBWZWMzICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9WZWMzJyksXG4gICAgICBWZWM0ICAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9WZWM0JyksXG4vLyAgICBNYXQzMyAgICAgICA6IHJlcXVpcmUoJy4vbWF0aC9mTWF0MzMnKSxcbiAgICAgIE1hdHJpeDQ0ICAgIDogcmVxdWlyZSgnLi9tYXRoL01hdHJpeDQ0JyksXG4vLyAgICBRdWF0ZXJuaW9uICA6IHJlcXVpcmUoJy4vbWF0aC9mUXVhdGVybmlvbicpLFxuLy9cbi8vICAgIE1hdEdMICAgICAgICA6IHJlcXVpcmUoJy4vZ2wvZ2wvZk1hdEdMJyksXG5cbiAgICAgIEFwcGxpY2F0aW9uIDogcmVxdWlyZSgnLi9hcHAvQXBwJyksXG5cbiAgICAgIGdsICAgICAgIDogcmVxdWlyZSgnLi9nbC9nbCcpLmNvbnRleHQsXG4gICAgICBnbE1hdHJpeCA6IHJlcXVpcmUoJy4vZ2wvZ2xNYXRyaXgnKSxcbiAgICAgIGdsdSAgICAgIDogcmVxdWlyZSgnLi9nbC9nbHUnKSxcbiAgICAgIGdsRHJhdyAgIDogcmVxdWlyZSgnLi9nbC9nbERyYXcnKSxcblxuXG4gICAgICBQcm9ncmFtICAgICAgOiByZXF1aXJlKCcuL2dsL1Byb2dyYW0nKSxcbiAgICAgIENhbWVyYVBlcnNwICA6IHJlcXVpcmUoJy4vZ2wvQ2FtZXJhUGVyc3AnKSxcbi8vXG4vLyAgICBMaWdodCAgICAgICAgICAgIDogcmVxdWlyZSgnLi9nbC9nbC9saWdodC9mTGlnaHQnKSxcbi8vICAgIFBvaW50TGlnaHQgICAgICAgOiByZXF1aXJlKCcuL2dsL2dsL2xpZ2h0L2ZQb2ludExpZ2h0JyksXG4vLyAgICBEaXJlY3Rpb25hbExpZ2h0IDogcmVxdWlyZSgnLi9nbC9nbC9saWdodC9mRGlyZWN0aW9uYWxMaWdodCcpLFxuLy8gICAgU3BvdExpZ2h0ICAgICAgICA6IHJlcXVpcmUoJy4vZ2wvZ2wvbGlnaHQvZlNwb3RMaWdodCcpLFxuLy9cbi8vICAgIE1hdGVyaWFsICAgICAgOiByZXF1aXJlKCcuL2dsL2dsL2ZNYXRlcmlhbCcpLFxuLy8gICAgVGV4dHVyZSAgICAgICA6IHJlcXVpcmUoJy4vZ2wvZ2wvdGV4dHVyZS9mVGV4dHVyZScpLFxuLy8gICAgQ2FudmFzVGV4dHVyZSA6IHJlcXVpcmUoJy4vZ2wvZ2wvdGV4dHVyZS9mQ2FudmFzVGV4dHVyZScpLFxuLy9cbi8vICAgIGdsRHJhd1V0aWwgICAgIDogcmVxdWlyZSgnLi9nbC9nbERyYXdVdGlsJyksXG4vLyAgICBnbE1hdHJpeCAgICAgICAgIDogcmVxdWlyZSgnLi9nbC9nbE1hdHJpeCcpLFxuLy9cbi8vICAgIE1vdXNlICAgICAgIDogcmVxdWlyZSgnLi91dGlsL2ZNb3VzZScpLFxuLy8gICAgTW91c2VTdGF0ZSAgOiByZXF1aXJlKCcuL3V0aWwvZk1vdXNlU3RhdGUnKSxcbi8vICAgIENvbG9yICAgICAgIDogcmVxdWlyZSgnLi91dGlsL2ZDb2xvcicpLFxuLy8gICAgVXRpbCAgICAgICAgOiByZXF1aXJlKCcuL3V0aWwvZlV0aWwnKSxcbi8vXG4vLyAgICBQbGF0Zm9ybSAgICA6IHJlcXVpcmUoJy4vc3lzdGVtL2NvbW1vbi9mUGxhdGZvcm0nKSxcbi8vICAgIFN5c3RlbSAgICAgIDogcmVxdWlyZSgnLi9zeXN0ZW0vZlN5c3RlbScpLFxuLy9cbi8vICAgIEZsYWdzIDogcmVxdWlyZSgnLi9zeXN0ZW0vZkZsYWdzJyksXG5cbiAgICBPYmplY3RVdGlsIDogcmVxdWlyZSgnLi91dGlsL09iamVjdFV0aWwnKSxcblxuXG5cbn07XG5cbiIsInZhciBWZWMzID0gcmVxdWlyZSgnLi4vbWF0aC9WZWMzJyksXG4gICAgTWF0cml4NDQgPSByZXF1aXJlKCcuLi9tYXRoL01hdHJpeDQ0JyksXG4gICAgTWF0R0wgPSByZXF1aXJlKCcuL2dsdScpLFxuICAgIE9iamVjdFV0aWwgPSByZXF1aXJlKCcuLi91dGlsL09iamVjdFV0aWwnKTtcblxuXG5mdW5jdGlvbiBDYW1lcmFQZXJzcCgpIHtcbiAgICB0aGlzLl9leWUgPSBWZWMzLmNyZWF0ZSgpO1xuICAgIHRoaXMuX3RhcmdldCA9IFZlYzMuY3JlYXRlKCk7XG4gICAgdGhpcy5fdXAgPSBWZWMzLkFYSVNfWSgpO1xuXG4gICAgdGhpcy5fZm92ID0gMDtcbiAgICB0aGlzLl9uZWFyID0gMDtcbiAgICB0aGlzLl9mYXIgPSAwO1xuXG4gICAgdGhpcy5fYXNwZWN0UmF0aW9MYXN0ID0gMDtcblxuICAgIHRoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5wcm9qZWN0aW9uTWF0cml4ID0gTWF0cml4NDQuY3JlYXRlKCk7XG4gICAgdGhpcy5tb2RlbFZpZXdNYXRyaXggPSBNYXRyaXg0NC5jcmVhdGUoKTtcbn1cblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnNldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKGZvdiwgd2luZG93QXNwZWN0UmF0aW8sIG5lYXIsIGZhcikge1xuICAgIHRoaXMuX2ZvdiA9IGZvdjtcbiAgICB0aGlzLl9uZWFyID0gbmVhcjtcbiAgICB0aGlzLl9mYXIgPSBmYXI7XG5cbiAgICB0aGlzLl9hc3BlY3RSYXRpb0xhc3QgPSB3aW5kb3dBc3BlY3RSYXRpbztcblxuICAgIHRoaXMudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xufTtcblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnNldFRhcmdldCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgVmVjMy5zZXQodGhpcy5fdGFyZ2V0LCB2KTtcbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuXG5DYW1lcmFQZXJzcC5wcm90b3R5cGUuc2V0VGFyZ2V0M2YgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIFZlYzMuc2V0M2YodGhpcy5fdGFyZ2V0LCB4LCB5LCB6KTtcbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuXG5DYW1lcmFQZXJzcC5wcm90b3R5cGUuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24odil7XG4gICAgaWYoT2JqZWN0VXRpbC5pc1VuZGVmaW5lZCh2KSl7XG4gICAgICAgIHJldHVybiBWZWMzLmNvcHkodGhpcy5fdGFyZ2V0KTtcbiAgICB9XG4gICAgVmVjMy5zZXQodix0aGlzLl90YXJnZXQpO1xufTtcblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnNldEV5ZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgVmVjMy5zZXQodGhpcy5fZXllLCB2KTtcbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuXG5DYW1lcmFQZXJzcC5wcm90b3R5cGUuc2V0RXllM2YgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIFZlYzMuc2V0M2YodGhpcy5fZXllLCB4LCB5LCB6KTtcbiAgICB0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuXG5DYW1lcmFQZXJzcC5wcm90b3R5cGUuZ2V0RXllID0gZnVuY3Rpb24odil7XG4gICAgaWYoT2JqZWN0VXRpbC5pc1VuZGVmaW5lZCh2KSl7XG4gICAgICAgIHJldHVybiBWZWMzLmNvcHkodGhpcy5fZXllKTtcbiAgICB9XG4gICAgVmVjMy5zZXQodix0aGlzLl9leWUpO1xufTtcblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uKGV5ZSx0YXJnZXQpe1xuICAgIFZlYzMuc2V0KHRoaXMuX2V5ZSxleWUpO1xuICAgIFZlYzMuc2V0KHRoaXMuX3RhcmdldCx0YXJnZXQpO1xuICAgIHRoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTtcbn07XG5cbkNhbWVyYVBlcnNwLnByb3RvdHlwZS5zZXRVcCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgVmVjMy5zZXQodGhpcy5fdXAsIHYpO1xuICAgIHRoaXMuX21vZGVsVmlld01hdHJpeFVwZGF0ZWQgPSBmYWxzZTtcbn07XG5DYW1lcmFQZXJzcC5wcm90b3R5cGUuc2V0VXAzZiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgVmVjMy5zZXQzZih0aGlzLl91cCwgeCwgeSwgeik7XG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnNldE5lYXIgPSBmdW5jdGlvbiAobmVhcikge1xuICAgIHRoaXMuX25lYXIgPSBuZWFyO1xuICAgIHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuXG5DYW1lcmFQZXJzcC5wcm90b3R5cGUuc2V0RmFyID0gZnVuY3Rpb24gKGZhcikge1xuICAgIHRoaXMuX2ZhciA9IGZhcjtcbiAgICB0aGlzLl9wcm9qZWN0aW9uTWF0cml4VXBkYXRlZCA9IGZhbHNlO1xufTtcblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnNldEZvdiA9IGZ1bmN0aW9uIChmb3YpIHtcbiAgICB0aGlzLl9mb3YgPSBmb3Y7XG4gICAgdGhpcy5fcHJvamVjdGlvbk1hdHJpeFVwZGF0ZWQgPSBmYWxzZTtcbn07XG5cbkNhbWVyYVBlcnNwLnByb3RvdHlwZS5zZXRBc3BlY3RSYXRpbyA9IGZ1bmN0aW9uIChhc3BlY3RSYXRpbykge1xuICAgIHRoaXMuX2FzcGVjdFJhdGlvTGFzdCA9IGFzcGVjdFJhdGlvO1xuICAgIHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gZmFsc2U7XG59O1xuXG5DYW1lcmFQZXJzcC5wcm90b3R5cGUudXBkYXRlTW9kZWxWaWV3TWF0cml4ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbFZpZXdNYXRyaXhVcGRhdGVkKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBNYXRHTC5sb29rQXQodGhpcy5tb2RlbFZpZXdNYXRyaXgsIHRoaXMuX2V5ZSwgdGhpcy5fdGFyZ2V0LCB0aGlzLl91cCk7XG4gICAgdGhpcy5fbW9kZWxWaWV3TWF0cml4VXBkYXRlZCA9IHRydWU7XG59O1xuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnVwZGF0ZVByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBNYXRHTC5wZXJzcGVjdGl2ZSh0aGlzLnByb2plY3Rpb25NYXRyaXgsIHRoaXMuX2ZvdiwgdGhpcy5fYXNwZWN0UmF0aW9MYXN0LCB0aGlzLl9uZWFyLCB0aGlzLl9mYXIpO1xuICAgIHRoaXMuX3Byb2plY3Rpb25NYXRyaXhVcGRhdGVkID0gdHJ1ZTtcbn07XG5cbkNhbWVyYVBlcnNwLnByb3RvdHlwZS51cGRhdGVNYXRyaWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnVwZGF0ZU1vZGVsVmlld01hdHJpeCgpO1xuICAgIHRoaXMudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xufTtcblxuQ2FtZXJhUGVyc3AucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAne3Bvc2l0aW9uPSAnICsgVmVjMy50b1N0cmluZyh0aGlzLnBvc2l0aW9uKSArXG4gICAgICAgICAgICAnLCB0YXJnZXQ9ICcgKyBWZWMzLnRvU3RyaW5nKHRoaXMuX3RhcmdldCkgK1xuICAgICAgICAnLCB1cD0gJyArIFZlYzMudG9TdHJpbmcodGhpcy5fdXApICsgJ30nXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYVBlcnNwO1xuXG5cbiIsInZhciBnbCA9IHJlcXVpcmUoJy4vZ2wnKS5nbDtcblxuZnVuY3Rpb24gUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKSB7XG4gICAgdmFyIHByZWZpeFZlcnRleFNoYWRlciA9ICcnLFxuICAgICAgICBwcmVmaXhGcmFnbWVudFNoYWRlciA9ICcnO1xuXG4gICAgaWYoIWZyYWdtZW50U2hhZGVyKXtcbiAgICAgICAgcHJlZml4VmVydGV4U2hhZGVyID0gJyNkZWZpbmUgVkVSVEVYX1NIQURFUlxcbic7XG4gICAgICAgIHByZWZpeEZyYWdtZW50U2hhZGVyID0gJyNkZWZpbmUgRlJBR01FTlRfU0hBREVSXFxuJztcbiAgICAgICAgZnJhZ21lbnRTaGFkZXIgPSB2ZXJ0ZXhTaGFkZXI7XG4gICAgfVxuXG4gICAgdmFyIHByb2dyYW0gICAgPSB0aGlzLl9wcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpLFxuICAgICAgICB2ZXJ0U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpLFxuICAgICAgICBmcmFnU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydFNoYWRlciwgcHJlZml4VmVydGV4U2hhZGVyICsgdmVydGV4U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKHZlcnRTaGFkZXIpO1xuXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIodmVydFNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICAgIHRocm93ICdWRVJURVg6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHZlcnRTaGFkZXIpO1xuICAgIH1cblxuICAgIGdsLnNoYWRlclNvdXJjZShmcmFnU2hhZGVyLCBwcmVmaXhGcmFnbWVudFNoYWRlciArIGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdTaGFkZXIpO1xuXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZnJhZ1NoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICAgIHRocm93ICdGUkFHTUVOVDogJyArIGdsLmdldFNoYWRlckluZm9Mb2coZnJhZ1NoYWRlcik7XG4gICAgfVxuXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRTaGFkZXIpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnU2hhZGVyKTtcbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblxuICAgIHZhciBpLCBwYXJhbU5hbWU7XG5cbiAgICB2YXIgbnVtVW5pZm9ybXMgPSB0aGlzLl9udW1Vbmlmb3JtcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuQUNUSVZFX1VOSUZPUk1TKTtcbiAgICBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8IG51bVVuaWZvcm1zKSB7XG4gICAgICAgIHBhcmFtTmFtZSA9IGdsLmdldEFjdGl2ZVVuaWZvcm0ocHJvZ3JhbSwgaSkubmFtZTtcbiAgICAgICAgdGhpc1twYXJhbU5hbWVdID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW0sIHBhcmFtTmFtZSk7XG4gICAgfVxuXG4gICAgdmFyIGF0dHJpYnV0ZXNOdW0gPSB0aGlzLl9udW1BdHRyaWJ1dGVzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5BQ1RJVkVfQVRUUklCVVRFUyk7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLl9hdHRyaWJ1dGVzID0gbmV3IEFycmF5KGF0dHJpYnV0ZXNOdW0pO1xuICAgIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgYXR0cmlidXRlc051bSkge1xuICAgICAgICBwYXJhbU5hbWUgPSBnbC5nZXRBY3RpdmVBdHRyaWIocHJvZ3JhbSwgaSkubmFtZTtcbiAgICAgICAgYXR0cmlidXRlc1tpXSA9IHRoaXNbcGFyYW1OYW1lXSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIHBhcmFtTmFtZSk7XG4gICAgfVxufVxuXG5Qcm9ncmFtLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbigpe1xuICAgZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLl9wcm9ncmFtKTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLmdldE51bVVuaWZvcm1zID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9udW1Vbmlmb3Jtcztcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLmdldE51bUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX251bUF0dHJpYnV0ZXM7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgIGdsLnVzZVByb2dyYW0odGhpcy5fcHJvZ3JhbSk7XG4gICAgdmFyIGkgID0gLTEsXG4gICAgICAgIGEgID0gdGhpcy5fYXR0cmlidXRlcyxcbiAgICAgICAgbiAgPSB0aGlzLl9udW1BdHRyaWJ1dGVzO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGFbaV0pO1xuICAgIH1cbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSAgPSAtMSxcbiAgICAgICAgYSAgPSB0aGlzLl9hdHRyaWJ1dGVzLFxuICAgICAgICBuICA9IHRoaXMuX251bUF0dHJpYnV0ZXM7XG5cbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoYVtpXSk7XG4gICAgfVxuICAgIGdsLnVzZVByb2dyYW0obnVsbCk7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS51bmlmb3JtMWYgPSBmdW5jdGlvbihsb2NhdGlvbix4KSB7XG4gICAgZ2wudW5pZm9ybTFmKGxvY2F0aW9uLHgpO1xufTtcblxuUHJvZ3JhbS5wcm90b3R5cGUudW5pZm9ybTFmdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHYpIHtcbiAgICBnbC51bmlmb3JtMWZ2KGxvY2F0aW9uLHYpO1xufTtcblxuUHJvZ3JhbS5wcm90b3R5cGUudW5pZm9ybTFpID0gZnVuY3Rpb24obG9jYXRpb24seCkge1xuICAgIGdsLnVuaWZvcm0xaShsb2NhdGlvbix4KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0xaXYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgZ2wudW5pZm9ybTFpdihsb2NhdGlvbix2KVxufTtcblxuUHJvZ3JhbS5wcm90b3R5cGUudW5pZm9ybTJmID0gZnVuY3Rpb24obG9jYXRpb24seCx5KSB7XG4gICAgZ2wudW5pZm9ybTJmKGxvY2F0aW9uLHgseSk7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS51bmlmb3JtMmZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIGdsLnVuaWZvcm0yZnYobG9jYXRpb24sdik7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS51bmlmb3JtMmkgPSBmdW5jdGlvbihsb2NhdGlvbix4LHkpIHtcbiAgICBnbC51bmlmb3JtMmkobG9jYXRpb24seCx5KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0yaXYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgZ2wudW5pZm9ybTJpdihsb2NhdGlvbix2KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0zZiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHgseSx6KSB7XG4gICAgZ2wudW5pZm9ybTNmKGxvY2F0aW9uLHgseSx6KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0zZnYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgZ2wudW5pZm9ybTNmdihsb2NhdGlvbix2KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0zZnYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgZ2wudW5pZm9ybTNmdihsb2NhdGlvbix2KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0zaSA9IGZ1bmN0aW9uKGxvY2F0aW9uLHgseSx6KSB7XG4gICAgZ2wudW5pZm9ybTNpKGxvY2F0aW9uLHgseSx6KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm0zaXYgPSBmdW5jdGlvbihsb2NhdGlvbix2KSB7XG4gICAgZ2wudW5pZm9ybTNpdihsb2NhdGlvbix2KTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm00ZiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHgseSx6LHcpIHtcbiAgICBnbC51bmlmb3JtNGYobG9jYXRpb24seCx5LHosdyk7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS51bmlmb3JtNGZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdikge1xuICAgIGdsLnVuaWZvcm00ZnYobG9jYXRpb24sdik7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS51bmlmb3JtNGkgPSBmdW5jdGlvbihsb2NhdGlvbix4LHkseix3KSB7XG4gICAgZ2wudW5pZm9ybTRpKGxvY2F0aW9uLHgseSx6LHcpO1xufTtcblxuUHJvZ3JhbS5wcm90b3R5cGUudW5pZm9ybTRpdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHYpIHtcbiAgICBnbC51bmlmb3JtNGl2KGxvY2F0aW9uLHYpO1xufTtcblxuUHJvZ3JhbS5wcm90b3R5cGUudW5pZm9ybU1hdHJpeDJmdiA9IGZ1bmN0aW9uKGxvY2F0aW9uLHRyYW5zcG9zZSx2YWx1ZSkge1xuICAgIGdsLnVuaWZvcm1NYXRyaXgyZnYobG9jYXRpb24sdHJhbnNwb3NlLHZhbHVlKTtcbn07XG5cblByb2dyYW0ucHJvdG90eXBlLnVuaWZvcm1NYXRyaXgzZnYgPSBmdW5jdGlvbihsb2NhdGlvbix0cmFuc3Bvc2UsdmFsdWUpIHtcbiAgICBnbC51bmlmb3JtTWF0cml4M2Z2KGxvY2F0aW9uLHRyYW5zcG9zZSx2YWx1ZSk7XG59O1xuXG5Qcm9ncmFtLnByb3RvdHlwZS51bmlmb3JtTWF0cml4NGZ2ID0gZnVuY3Rpb24obG9jYXRpb24sdHJhbnNwb3NlLHZhbHVlKSB7XG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdihsb2NhdGlvbix0cmFuc3Bvc2UsdmFsdWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ncmFtO1xuIiwidmFyIGdsID0ge2NvbnRleHQ6bnVsbH07XG5tb2R1bGUuZXhwb3J0cyA9IGdsOyIsInZhciBWZWMzID0gcmVxdWlyZSgnLi4vbWF0aC9WZWMzJyksXG4gICAgQ29sb3IgPSByZXF1aXJlKCcuLi91dGlsL0NvbG9yJyk7XG5cbnZhciBnbERyYXdVdGlsID0ge307XG5cbmdsRHJhd1V0aWwuX19iVmVydGV4R3JpZCA9IFtdO1xuZ2xEcmF3VXRpbC5fX2JWZXJ0ZXhHcmlkRjMyID0gbnVsbDtcbmdsRHJhd1V0aWwuX19iQ29sb3JHcmlkTGFzdCA9IENvbG9yLkJMQUNLKCk7XG5nbERyYXdVdGlsLl9fYkNvbG9yR3JpZEYzMiA9IG51bGw7XG5nbERyYXdVdGlsLl9fZ3JpZFNpemVMYXN0ID0gLTE7XG5nbERyYXdVdGlsLl9fZ3JpZFVuaXRMYXN0ID0gLTE7XG5cbmdsRHJhd1V0aWwuX19iVmVydGV4R3JpZEN1YmUgPSBbXTtcbmdsRHJhd1V0aWwuX19iVmVydGV4R3JpZEN1YmVGMzIgPSBudWxsO1xuZ2xEcmF3VXRpbC5fX2JDb2xvckdyaWRDdWJlTGFzdCA9IENvbG9yLkJMQUNLO1xuZ2xEcmF3VXRpbC5fX2JDb2xvckdyaWRDdWJlRjMyID0gbnVsbDtcbmdsRHJhd1V0aWwuX19ncmlkQ3ViZVNpemVMYXN0ID0gLTE7XG5nbERyYXdVdGlsLl9fZ3JpZEN1YmVVbml0TGFzdCA9IC0xO1xuXG5nbERyYXdVdGlsLl9fYlZlcnRleEF4ZXNGMzIgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSk7XG5nbERyYXdVdGlsLl9fYkNvbG9yQXhlc0YzMiA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDAsIDEsIDAsIDEsIDAsIDEsIDAsIDEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDFdKTtcbmdsRHJhd1V0aWwuX19heGVzVW5pdExhc3QgPSAtMTtcblxuXG5nbERyYXdVdGlsLmRyYXdHcmlkID0gZnVuY3Rpb24gKGZnbCwgc2l6ZSwgdW5pdCkge1xuICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICBpZiAodW5pdCAhPSB0aGlzLl9fZ3JpZFVuaXRMYXN0KSB7XG4gICAgICAgIHZhciBiVmVydGV4R3JpZCA9IHRoaXMuX19iVmVydGV4R3JpZDtcblxuICAgICAgICBpZiAoc2l6ZSAhPSB0aGlzLl9fZ3JpZFNpemVMYXN0KSB7XG4gICAgICAgICAgICB0aGlzLl9fZ2VuR3JpZFZlcnRpY2VzKGJWZXJ0ZXhHcmlkLCAnX19iVmVydGV4R3JpZEYzMicsICdfX2JDb2xvckdyaWRGMzInLCBzaXplKTtcbiAgICAgICAgICAgIHRoaXMuX19ncmlkU2l6ZUxhc3QgPSBzaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3NjYWxlR3JpZFZlcnRpY2VzKGJWZXJ0ZXhHcmlkLCB0aGlzLl9fYlZlcnRleEdyaWRGMzIsIHVuaXQpO1xuICAgIH1cblxuICAgIHZhciBiQ29sb3JHcmlkMzIgPSB0aGlzLl9fYkNvbG9yR3JpZEYzMjtcbiAgICB2YXIgY29sb3JMYXN0ID0gdGhpcy5fX2JDb2xvckdyaWRMYXN0LFxuICAgICAgICBjb2xvcmZHTCA9IGZnbC5nZXRDb2xvckJ1ZmZlcigpO1xuXG4gICAgZmdsLmRyYXdBcnJheXModGhpcy5fX2JWZXJ0ZXhHcmlkRjMyLFxuICAgICAgICBudWxsLFxuICAgICAgICBDb2xvci5lcXVhbHMoY29sb3JmR0wsIGNvbG9yTGFzdCkgP1xuICAgICAgICAgICAgYkNvbG9yR3JpZDMyIDpcbiAgICAgICAgICAgIGZnbC5idWZmZXJDb2xvcnMoY29sb3JmR0wsIGJDb2xvckdyaWQzMiksXG4gICAgICAgIG51bGwsXG4gICAgICAgIGZnbC5MSU5FUyk7XG5cbiAgICB0aGlzLl9fZ3JpZFNpemVMYXN0ID0gc2l6ZTtcbiAgICB0aGlzLl9fZ3JpZFVuaXRMYXN0ID0gdW5pdDtcblxuICAgIENvbG9yLnNldChjb2xvckxhc3QsIGNvbG9yZkdMKTtcbn07XG5cbmdsRHJhd1V0aWwuX19nZW5HcmlkVmVydGljZXMgPSBmdW5jdGlvbiAodmVydGljZXNBcnIsIHZlcnRpY2VzQXJyRjMyU3RyaW5nLCBjb2xvcnNBcnJGMzJTdHJpbmcsIHNpemUpIHtcbiAgICB2YXIgbCA9IHZlcnRpY2VzQXJyLmxlbmd0aCA9IChzaXplICsgMSkgKiAxMjtcblxuICAgIHZhciBpID0gMCxcbiAgICAgICAgc2ggPSBzaXplICogMC41LFxuICAgICAgICB1aTtcblxuICAgIHdoaWxlIChpIDwgbCkge1xuICAgICAgICB1aSA9IGkgLyAxMjtcblxuICAgICAgICB2ZXJ0aWNlc0FycltpICAgXSA9IHZlcnRpY2VzQXJyW2kgKyA4IF0gPSAtc2g7XG4gICAgICAgIHZlcnRpY2VzQXJyW2kgKyAxIF0gPSB2ZXJ0aWNlc0FycltpICsgNCBdID0gdmVydGljZXNBcnJbaSArIDcgXSA9IHZlcnRpY2VzQXJyW2kgKyAxMF0gPSAwO1xuICAgICAgICB2ZXJ0aWNlc0FycltpICsgMiBdID0gdmVydGljZXNBcnJbaSArIDUgXSA9IHZlcnRpY2VzQXJyW2kgKyA2IF0gPSB2ZXJ0aWNlc0FycltpICsgOSBdID0gLXNoICsgdWk7XG4gICAgICAgIHZlcnRpY2VzQXJyW2kgKyAzIF0gPSB2ZXJ0aWNlc0FycltpICsgMTFdID0gc2g7XG5cbiAgICAgICAgaSArPSAxMjtcbiAgICB9XG5cbiAgICB0aGlzW3ZlcnRpY2VzQXJyRjMyU3RyaW5nXSA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXNBcnIpO1xuICAgIHRoaXNbY29sb3JzQXJyRjMyU3RyaW5nXSA9IG5ldyBGbG9hdDMyQXJyYXkobCAvIDMgKiA0KTtcbn07XG5cbmdsRHJhd1V0aWwuX19zY2FsZUdyaWRWZXJ0aWNlcyA9IGZ1bmN0aW9uICh2ZXJ0aWNlc0FyciwgdmVydGljZXNBcnJGMzIsIHVuaXQpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciBsID0gdmVydGljZXNBcnIubGVuZ3RoO1xuXG4gICAgd2hpbGUgKCsraSA8IGwpdmVydGljZXNBcnJGMzJbaV0gPSB2ZXJ0aWNlc0FycltpXSAqIHVuaXQ7XG59O1xuXG5nbERyYXdVdGlsLmRyYXdBeGVzID0gZnVuY3Rpb24gKGZnbCwgdW5pdCkge1xuICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICB2YXIgYlZlcnRpY2VzQXhlcyA9IHRoaXMuX19iVmVydGV4QXhlc0YzMjtcbiAgICB2YXIgZHJhd01vZGVMYXN0ID0gZmdsLmdldERyYXdNb2RlKCk7XG5cbiAgICBpZiAodW5pdCAhPSB0aGlzLl9fYXhlc1VuaXRMYXN0KSB7XG4gICAgICAgIGJWZXJ0aWNlc0F4ZXNbMyBdID0gYlZlcnRpY2VzQXhlc1sxMF0gPSBiVmVydGljZXNBeGVzWzE3XSA9IHVuaXQ7XG4gICAgfVxuXG4gICAgZmdsLmRyYXdNb2RlKGRyYXdNb2RlTGFzdCk7XG4gICAgZmdsLmRyYXdBcnJheXMoYlZlcnRpY2VzQXhlcywgbnVsbCwgdGhpcy5fX2JDb2xvckF4ZXNGMzIsIG51bGwsIGZnbC5MSU5FUyk7XG5cbiAgICB0aGlzLl9fYXhlc1VuaXRMYXN0ID0gdW5pdDtcbiAgICBmZ2wuZHJhd01vZGUoZHJhd01vZGVMYXN0KTtcbn07XG5cbmdsRHJhd1V0aWwuZHJhd0dyaWRDdWJlID0gZnVuY3Rpb24gKGZnbCwgc2l6ZSwgdW5pdCkge1xuICAgIHVuaXQgPSB1bml0IHx8IDE7XG5cbiAgICBpZiAodW5pdCAhPSB0aGlzLl9fZ3JpZEN1YmVVbml0TGFzdCkge1xuICAgICAgICB2YXIgYlZlcnRleEdyaWQgPSB0aGlzLl9fYlZlcnRleEdyaWRDdWJlO1xuXG4gICAgICAgIGlmIChzaXplICE9IHRoaXMuX19ncmlkQ3ViZVNpemVMYXN0KSB7XG4gICAgICAgICAgICB0aGlzLl9fZ2VuR3JpZFZlcnRpY2VzKGJWZXJ0ZXhHcmlkLCAnX19iVmVydGV4R3JpZEN1YmVGMzInLCAnX19iQ29sb3JHcmlkQ3ViZUYzMicsIHNpemUpO1xuICAgICAgICAgICAgdGhpcy5fX2dyaWRDdWJlU2l6ZUxhc3QgPSBzaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3NjYWxlR3JpZFZlcnRpY2VzKGJWZXJ0ZXhHcmlkLCB0aGlzLl9fYlZlcnRleEdyaWRDdWJlRjMyLCB1bml0KTtcbiAgICB9XG5cbiAgICB2YXIgYkNvbG9yR3JpZDMyID0gdGhpcy5fX2JDb2xvckdyaWRDdWJlRjMyO1xuICAgIHZhciBjb2xvckxhc3QgPSB0aGlzLl9fYkNvbG9yR3JpZEN1YmVMYXN0LFxuICAgICAgICBjb2xvcmZHTCA9IGZnbC5nZXRDb2xvckJ1ZmZlcigpO1xuXG4gICAgdmFyIGJWZXJ0ZXhHcmlkQ3ViZUYzMiA9IHRoaXMuX19iVmVydGV4R3JpZEN1YmVGMzIsXG4gICAgICAgIGNvbG9yID0gQ29sb3IuZXF1YWxzKGNvbG9yZkdMLCBjb2xvckxhc3QpID9cbiAgICAgICAgICAgIGJDb2xvckdyaWQzMiA6XG4gICAgICAgICAgICBmZ2wuYnVmZmVyQ29sb3JzKGNvbG9yZkdMLCBiQ29sb3JHcmlkMzIpO1xuXG5cbiAgICB2YXIgc2ggPSBzaXplICogMC41ICogdW5pdCxcbiAgICAgICAgcGloID0gTWF0aC5QSSAqIDAuNTtcblxuICAgIC8vVE9ETzogbWVyZ2VcblxuICAgIGZnbC5wdXNoTWF0cml4KCk7XG4gICAgZmdsLnRyYW5zbGF0ZTNmKDAsIC1zaCwgMCk7XG4gICAgZmdsLmRyYXdBcnJheXMoYlZlcnRleEdyaWRDdWJlRjMyLCBudWxsLCBjb2xvciwgbnVsbCwgZmdsLkxJTkVTKTtcbiAgICBmZ2wucG9wTWF0cml4KCk7XG5cbiAgICBmZ2wucHVzaE1hdHJpeCgpO1xuICAgIGZnbC50cmFuc2xhdGUzZigwLCBzaCwgMCk7XG4gICAgZmdsLnJvdGF0ZTNmKDAsIHBpaCwgMCk7XG4gICAgZmdsLmRyYXdBcnJheXMoYlZlcnRleEdyaWRDdWJlRjMyLCBudWxsLCBjb2xvciwgbnVsbCwgZmdsLkxJTkVTKTtcbiAgICBmZ2wucG9wTWF0cml4KCk7XG5cbiAgICBmZ2wucHVzaE1hdHJpeCgpO1xuICAgIGZnbC50cmFuc2xhdGUzZigwLCAwLCAtc2gpO1xuICAgIGZnbC5yb3RhdGUzZihwaWgsIDAsIDApO1xuICAgIGZnbC5kcmF3QXJyYXlzKGJWZXJ0ZXhHcmlkQ3ViZUYzMiwgbnVsbCwgY29sb3IsIG51bGwsIGZnbC5MSU5FUyk7XG4gICAgZmdsLnBvcE1hdHJpeCgpO1xuXG4gICAgZmdsLnB1c2hNYXRyaXgoKTtcbiAgICBmZ2wudHJhbnNsYXRlM2YoMCwgMCwgc2gpO1xuICAgIGZnbC5yb3RhdGUzZihwaWgsIDAsIDApO1xuICAgIGZnbC5kcmF3QXJyYXlzKGJWZXJ0ZXhHcmlkQ3ViZUYzMiwgbnVsbCwgY29sb3IsIG51bGwsIGZnbC5MSU5FUyk7XG4gICAgZmdsLnBvcE1hdHJpeCgpO1xuXG4gICAgZmdsLnB1c2hNYXRyaXgoKTtcbiAgICBmZ2wudHJhbnNsYXRlM2Yoc2gsIDAsIDApO1xuICAgIGZnbC5yb3RhdGUzZihwaWgsIDAsIHBpaCk7XG4gICAgZmdsLmRyYXdBcnJheXMoYlZlcnRleEdyaWRDdWJlRjMyLCBudWxsLCBjb2xvciwgbnVsbCwgZmdsLkxJTkVTKTtcbiAgICBmZ2wucG9wTWF0cml4KCk7XG5cbiAgICBmZ2wucHVzaE1hdHJpeCgpO1xuICAgIGZnbC50cmFuc2xhdGUzZigtc2gsIDAsIDApO1xuICAgIGZnbC5yb3RhdGUzZihwaWgsIDAsIHBpaCk7XG4gICAgZmdsLmRyYXdBcnJheXMoYlZlcnRleEdyaWRDdWJlRjMyLCBudWxsLCBjb2xvciwgbnVsbCwgZmdsLkxJTkVTKTtcbiAgICBmZ2wucG9wTWF0cml4KCk7XG5cbiAgICB0aGlzLl9fZ3JpZEN1YmVTaXplTGFzdCA9IHNpemU7XG4gICAgdGhpcy5fX2dyaWRDdWJlVW5pdExhc3QgPSB1bml0O1xuXG4gICAgQ29sb3Iuc2V0KGNvbG9yTGFzdCwgY29sb3JmR0wpO1xufTtcblxuXG5nbERyYXdVdGlsLnB5cmFtaWQgPSBmdW5jdGlvbiAoa2dsLCBzaXplKSB7XG4gICAga2dsLnB1c2hNYXRyaXgoKTtcbiAgICBrZ2wuc2NhbGUzZihzaXplLCBzaXplLCBzaXplKTtcbiAgICBrZ2wuZHJhd0VsZW1lbnRzKHRoaXMuX19iVmVydGV4UHlyYW1pZCwgdGhpcy5fX2JOb3JtYWxQeXJhbWlkLCBrZ2wuYnVmZmVyQ29sb3JzKGtnbC5fYkNvbG9yLCB0aGlzLl9fYkNvbG9yUHlyYW1pZCksIG51bGwsIHRoaXMuX19iSW5kZXhQeXJhbWlkLCBrZ2wuX2RyYXdNb2RlKTtcbiAgICBrZ2wucG9wTWF0cml4KCk7XG59O1xuXG5cbmdsRHJhd1V0aWwub2N0YWhlZHJvbiA9IGZ1bmN0aW9uIChrZ2wsIHNpemUpIHtcbiAgICBrZ2wucHVzaE1hdHJpeCgpO1xuICAgIGtnbC5zY2FsZTNmKHNpemUsIHNpemUsIHNpemUpO1xuICAgIGtnbC5kcmF3RWxlbWVudHModGhpcy5fX2JWZXJ0ZXhPY3RhaGVkcm9uLCB0aGlzLl9fYk5vcm1hbE9jdGFoZWRyb24sIGtnbC5idWZmZXJDb2xvcnMoa2dsLl9iQ29sb3IsIHRoaXMuX19iQ29sb3JPY3RhaGVkcm9uKSwgbnVsbCwgdGhpcy5fX2JJbmRleE9jdGFoZWRyb24sIGtnbC5fZHJhd01vZGUpO1xuICAgIGtnbC5wb3BNYXRyaXgoKTtcbn07XG5cbmdsRHJhd1V0aWwuX19iVmVydGV4T2N0YWhlZHJvbiA9IG5ldyBGbG9hdDMyQXJyYXkoWy0wLjcwNywgMCwgMCwgMCwgMC43MDcsIDAsIDAsIDAsIC0wLjcwNywgMCwgMCwgMC43MDcsIDAsIC0wLjcwNywgMCwgMC43MDcsIDAsIDBdKTtcbmdsRHJhd1V0aWwuX19iTm9ybWFsT2N0YWhlZHJvbiA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMS40MTk0OTYwNzYyMzgxNDdlLTksIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMSwgMS40MTk0OTYwNzYyMzgxNDdlLTksIDEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAtMSwgLTEuNDE5NDk2MDc2MjM4MTQ3ZS05LCAxLCAxLjQxOTQ5NjA3NjIzODE0N2UtOSwgLTEsIC0xLjQxOTQ5NjA3NjIzODE0N2UtOSwgMS40MTk0OTYwNzYyMzgxNDdlLTldKTtcbmdsRHJhd1V0aWwuX19iQ29sb3JPY3RhaGVkcm9uID0gbmV3IEZsb2F0MzJBcnJheShnbERyYXdVdGlsLl9fYlZlcnRleE9jdGFoZWRyb24ubGVuZ3RoIC8gVmVjMy5TSVpFICogQ29sb3IuU0laRSk7XG5nbERyYXdVdGlsLl9fYkluZGV4T2N0YWhlZHJvbiA9IG5ldyBVaW50MTZBcnJheShbMywgNCwgNSwgMywgNSwgMSwgMywgMSwgMCwgMywgMCwgNCwgNCwgMCwgMiwgNCwgMiwgNSwgMiwgMCwgMSwgNSwgMiwgMV0pO1xuZ2xEcmF3VXRpbC5fX2JWZXJ0ZXhQeXJhbWlkID0gbmV3IEZsb2F0MzJBcnJheShbIDAuMCwgMS4wLCAwLjAsIC0xLjAsIC0xLjAsIDEuMCwgMS4wLCAtMS4wLCAxLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIC0xLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgMC4wLCAxLjAsIDAuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgLTEuMCwgMS4wLCAtMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgMS4wLCAxLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjAsIC0xLjBdKTtcbmdsRHJhd1V0aWwuX19iTm9ybWFsUHlyYW1pZCA9IG5ldyBGbG9hdDMyQXJyYXkoWzAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIC0wLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAuODk0NDI3MTgwMjkwMjIyMiwgMCwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMC44OTQ0MjcxODAyOTAyMjIyLCAwLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLjg5NDQyNzE4MDI5MDIyMjIsIDAuODk0NDI3MTgwMjkwMjIyMiwgLTAuNDQ3MjEzNTkwMTQ1MTExMSwgMCwgMC44OTQ0MjcxODAyOTAyMjIyLCAtMC40NDcyMTM1OTAxNDUxMTExLCAwLCAwLjg5NDQyNzE4MDI5MDIyMjIsIC0wLjQ0NzIxMzU5MDE0NTExMTEsIDAsIDAsIDAsIDAsIDAsIC0xLCAwLCAwLCAwLCAwLCAwLCAxLCAwXSk7XG5nbERyYXdVdGlsLl9fYkNvbG9yUHlyYW1pZCA9IG5ldyBGbG9hdDMyQXJyYXkoZ2xEcmF3VXRpbC5fX2JWZXJ0ZXhQeXJhbWlkLmxlbmd0aCAvIFZlYzMuU0laRSAqIENvbG9yLlNJWkUpO1xuZ2xEcmF3VXRpbC5fX2JJbmRleFB5cmFtaWQgPSBuZXcgVWludDE2QXJyYXkoWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTIsIDE1LCAxNF0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsRHJhd1V0aWw7IiwidmFyIE1hdHJpeDQ0ID0gcmVxdWlyZShcIi4uL21hdGgvTWF0cml4NDRcIik7XG52YXIgX0Vycm9yICAgPSByZXF1aXJlKCcuLi9zeXN0ZW0vY29tbW9uL0Vycm9yJyk7XG52YXIgZ2wgICAgICAgPSByZXF1aXJlKCcuL2dsJykuY29udGV4dDtcblxudmFyIGdsTWF0cml4ID0ge307XG5cblxuZ2xNYXRyaXguVU5JRk9STV9NT0RFTFZJRVdfTUFUUklYICA9ICd1TW9kZWxWaWV3TWF0cml4JztcbmdsTWF0cml4LlVOSUZPUk1fUFJPSkVDVElPTl9NQVRSSVggPSAndVByb2plY3Rpb25NYXRyaXgnO1xuXG5nbE1hdHJpeC5BVFRSSUJfVkVSVEVYX1BPU0lUSU9OID0gJ2FWZXJ0ZXhQb3NpdGlvbic7XG5nbE1hdHJpeC5BVFRSSUJfVkVSVEVYX05PUk1BTCAgID0gJ2FWZXJ0ZXhOb3JtYWwnO1xuZ2xNYXRyaXguQVRUUklCX1ZFUlRFWF9DT0xPUiAgICA9ICdhVmVydGV4Q29sb3InO1xuZ2xNYXRyaXguQVRUUklCX1RFWENPT1JEICAgICAgICA9ICdhVGV4Y29vcmQnO1xuXG5nbE1hdHJpeC5NT0RFTFZJRVcgID0gMHgxQTBBO1xuZ2xNYXRyaXguUFJPSkVDVElPTiA9IDB4MUEwQjtcblxuLy9cbi8vXG4vL1xuXG5nbE1hdHJpeC5fY2FtZXJhID0gbnVsbDtcblxuLy9cbi8vICBtYXRyaXggc3RhY2tcbi8vXG5cbmdsTWF0cml4Ll9tYXRyaXhNb2RlID0gZ2xNYXRyaXguTU9ERUxWSUVXO1xuZ2xNYXRyaXguX21hdHJpeFN0YWNrTW9kZWxWaWV3ID0gW107XG5nbE1hdHJpeC5fbWF0cml4U3RhY2tQcm9qZWN0aW9uID0gW107XG5nbE1hdHJpeC5fbWF0cml4VGVtcDAgPSBNYXRyaXg0NC5jcmVhdGUoKTtcbmdsTWF0cml4Ll9tYXRyaXhUZW1wMSA9IE1hdHJpeDQ0LmNyZWF0ZSgpO1xuZ2xNYXRyaXguX21hdHJpeE1vZGVsVmlldyA9IE1hdHJpeDQ0LmNyZWF0ZSgpO1xuZ2xNYXRyaXguX21hdHJpeFByb2plY3Rpb24gPSBNYXRyaXg0NC5jcmVhdGUoKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLy8gTW9kZWx2aWV3IC8gcHJvamVjdGlvbiBtYXRyaXhcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4vL1xuLy8gIHNldCAvIGdldFxuLy9cblxuZ2xNYXRyaXguc2V0TWF0cmljZXNDYW1lcmEgPSBmdW5jdGlvbihjYW1lcmEpe1xuICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcbn07XG5cbmdsTWF0cml4LnNldE1hdHJpeE1vZGUgPSBmdW5jdGlvbihtb2RlKXtcbiAgICB0aGlzLl9tYXRyaXhNb2RlID0gbW9kZTtcbn07XG5cbmdsTWF0cml4LmdldE1hdHJpeCA9IGZ1bmN0aW9uKG1hdHJpeCl7XG4gICAgcmV0dXJuIHRoaXMuX21hdHJpeE1vZGUgPT0gdGhpcy5NT0RFTFZJRVcgPyB0aGlzLmdldE1vZGVsVmlld01hdHJpeChtYXRyaXgpIDogdGhpcy5nZXRQcm9qZWN0aW9uTWF0cml4KG1hdHJpeCk7XG59O1xuXG5nbE1hdHJpeC5nZXRNb2RlbFZpZXdNYXRyaXggPSBmdW5jdGlvbihtYXRyaXgpe1xuICAgIHJldHVybiBtYXRyaXggPyBNYXRyaXg0NC5zZXQobWF0cml4LCB0aGlzLl9tYXRyaXhNb2RlbFZpZXcpIDogdGhpcy5fbWF0cml4TW9kZWxWaWV3O1xufTtcblxuZ2xNYXRyaXguZ2V0UHJvamVjdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKG1hdHJpeCl7XG4gICAgcmV0dXJuIG1hdHJpeCA/IE1hdHJpeDQ0LnNldChtYXRyaXgsIHRoaXMuX21hdHJpeFByb2plY3Rpb24pIDogdGhpcy5fbWF0cml4UHJvamVjdGlvbjtcblxufTtcblxuZ2xNYXRyaXgubG9hZElkZW50aXR5ID0gZnVuY3Rpb24oKXtcbiAgICBpZih0aGlzLl9tYXRyaXhNb2RlID09IGdsTWF0cml4Lk1PREVMVklFVyl7XG4gICAgICAgIHRoaXMuX21hdHJpeE1vZGVsVmlldyA9IE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX2NhbWVyYS5tb2RlbFZpZXdNYXRyaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21hdHJpeFByb2plY3Rpb24gPSBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9jYW1lcmEucHJvamVjdGlvbk1hdHJpeCk7XG4gICAgfVxufTtcblxuXG4vL1xuLy8gIHN0YWNrXG4vL1xuXG5nbE1hdHJpeC5wdXNoTWF0cml4ID0gZnVuY3Rpb24oKXtcbiAgICBpZih0aGlzLl9tYXRyaXhNb2RlID09IGdsTWF0cml4Lk1PREVMVklFVyl7XG4gICAgICAgIHRoaXMuX21hdHJpeFN0YWNrTW9kZWxWaWV3LnB1c2goTWF0cml4NDQuY29weSh0aGlzLl9tYXRyaXhNb2RlbFZpZXcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tYXRyaXhTdGFja1Byb2plY3Rpb24ucHVzaChNYXRyaXg0NC5jb3B5KHRoaXMuX21hdHJpeFByb2plY3Rpb24pKTtcbiAgICB9XG59O1xuXG5nbE1hdHJpeC5wb3BNYXRyaXggPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMuX21hdHJpeE1vZGUgPSBnbE1hdHJpeC5NT0RFTFZJRVcpe1xuICAgICAgICBpZih0aGlzLl9tYXRyaXhTdGFja01vZGVsVmlldy5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX0Vycm9yLk1BVFJJWF9TVEFDS19QT1BfRVJST1IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdHJpeE1vZGVsVmlldyA9IHRoaXMuX21hdHJpeFN0YWNrTW9kZWxWaWV3LnBvcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF0cml4TW9kZWxWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX21hdHJpeFN0YWNrUHJvamVjdGlvbi5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX0Vycm9yLk1BVFJJWF9TVEFDS19QT1BfRVJST1IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdHJpeFByb2plY3Rpb24gPSB0aGlzLl9tYXRyaXhTdGFja1Byb2plY3Rpb24ucG9wKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRyaXhQcm9qZWN0aW9uO1xuICAgIH1cbn07XG5cbmdsTWF0cml4LnB1c2hNYXRyaWNlcyA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5fbWF0cml4U3RhY2tNb2RlbFZpZXcucHVzaChNYXRyaXg0NC5jb3B5KHRoaXMuX21hdHJpeE1vZGVsVmlldykpO1xuICAgIHRoaXMuX21hdHJpeFN0YWNrUHJvamVjdGlvbi5wdXNoKE1hdHJpeDQ0LmNvcHkodGhpcy5fbWF0cml4UHJvamVjdGlvbikpO1xufTtcblxuZ2xNYXRyaXgucG9wTWF0cmljZXMgPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMuX21hdHJpeFN0YWNrTW9kZWxWaWV3Lmxlbmd0aCA9PSAwIHx8IHRoaXMuX21hdHJpeFN0YWNrUHJvamVjdGlvbi5sZW5ndGggPT0gMCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihfRXJyb3IuTUFUUklYX1NUQUNLX1BPUF9FUlJPUik7XG4gICAgfVxuICAgIHRoaXMuX21hdHJpeE1vZGVsVmlldyAgPSB0aGlzLl9tYXRyaXhTdGFja01vZGVsVmlldy5wb3AoKTtcbiAgICB0aGlzLl9tYXRyaXhQcm9qZWN0aW9uID0gdGhpcy5fbWF0cml4U3RhY2tQcm9qZWN0aW9uLnBvcCgpO1xufTtcblxuXG4vL1xuLy8gIG1vZFxuLy9cblxuZ2xNYXRyaXgubXVsdE1hdHJpeCA9IGZ1bmN0aW9uKG1hdHJpeCl7XG4gICAgaWYodGhpcy5fbWF0cml4TW9kZSA9IGdsTWF0cml4Lk1PREVMVklFVyl7XG4gICAgICAgIHRoaXMuX21hdHJpeE1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21hdHJpeE1vZGVsVmlldyxtYXRyaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21hdHJpeFByb2plY3Rpb24gPSBNYXRyaXg0NC5tdWx0UG9zdCgpXG4gICAgfVxufTtcblxuZ2xNYXRyaXgudHJhbnNsYXRlID0gZnVuY3Rpb24gKHYpIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlVHJhbnNsYXRpb24odlswXSwgdlsxXSwgdlsyXSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDApLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMSkpKTtcbn07XG5cbmdsTWF0cml4LnRyYW5zbGF0ZTNmID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlVHJhbnNsYXRpb24oeCwgeSwgeiwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDApLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMSkpKTtcbn07XG5cblxuZ2xNYXRyaXguc2NhbGUgPSBmdW5jdGlvbiAodikge1xuICAgIHRoaXMuX21Nb2RlbFZpZXcgPSBNYXRyaXg0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LCBNYXRyaXg0NC5jcmVhdGVTY2FsZSh2WzBdLCB2WzFdLCB2WzJdLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMCksIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAxKSkpO1xufTtcblxuZ2xNYXRyaXguc2NhbGUxZiA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsIE1hdHJpeDQ0LmNyZWF0ZVNjYWxlKG4sIG4sIG4sIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5zY2FsZTNmID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlU2NhbGUoeCwgeSwgeiwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDApLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMSkpKTtcbn07XG5cbmdsTWF0cml4LnNjYWxlWCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsIE1hdHJpeDQ0LmNyZWF0ZVNjYWxlKHgsIDEsIDEsIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5zY2FsZVkgPSBmdW5jdGlvbiAoeSkge1xuICAgIHRoaXMuX21Nb2RlbFZpZXcgPSBNYXRyaXg0NC5tdWx0UG9zdCh0aGlzLl9tTW9kZWxWaWV3LCBNYXRyaXg0NC5jcmVhdGVTY2FsZSgxLCB5LCAxLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMCksIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAxKSkpO1xufTtcblxuZ2xNYXRyaXguc2NhbGVaID0gZnVuY3Rpb24gKHopIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlU2NhbGUoMSwgMSwgeiwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDApLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMSkpKTtcbn07XG5cbmdsTWF0cml4LnJvdGF0ZSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsIE1hdHJpeDQ0LmNyZWF0ZVJvdGF0aW9uKHZbMF0sIHZbMV0sIHZbMl0sIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5yb3RhdGUzZiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsIE1hdHJpeDQ0LmNyZWF0ZVJvdGF0aW9uKHgsIHksIHosIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5yb3RhdGVYID0gZnVuY3Rpb24gKHgpIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlUm90YXRpb25YKHgsIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5yb3RhdGVZID0gZnVuY3Rpb24gKHkpIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlUm90YXRpb25ZKHksIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5yb3RhdGVaID0gZnVuY3Rpb24gKHopIHtcbiAgICB0aGlzLl9tTW9kZWxWaWV3ID0gTWF0cml4NDQubXVsdFBvc3QodGhpcy5fbU1vZGVsVmlldywgTWF0cml4NDQuY3JlYXRlUm90YXRpb25aKHosIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAwKSwgTWF0cml4NDQuaWRlbnRpdHkodGhpcy5fbWF0cml4VGVtcDEpKSk7XG59O1xuXG5nbE1hdHJpeC5yb3RhdGVBeGlzID0gZnVuY3Rpb24gKGFuZ2xlLCB2KSB7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsIE1hdHJpeDQ0LmNyZWF0ZVJvdGF0aW9uT25BeGlzKGFuZ2xlLCB2WzBdLCB2WzFdLCB2WzJdLCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMCksIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAxKSkpO1xufTtcblxuZ2xNYXRyaXgucm90YXRlQXhpczNmID0gZnVuY3Rpb24gKGFuZ2xlLCB4LCB5LCB6KSB7XG4gICAgdGhpcy5fbU1vZGVsVmlldyA9IE1hdHJpeDQ0Lm11bHRQb3N0KHRoaXMuX21Nb2RlbFZpZXcsIE1hdHJpeDQ0LmNyZWF0ZVJvdGF0aW9uT25BeGlzKGFuZ2xlLCB4LCB5LCB6LCBNYXRyaXg0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXhUZW1wMCksIE1hdHJpeDQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeFRlbXAxKSkpO1xufTtcblxuXG5cblxuXG5cblxuXG5nbE1hdHJpeC5zZXRXaW5kb3dNYXRyaWNlcyA9IGZ1bmN0aW9uKHdpbmRvd1dpZHRoLHdpbmRvd0hlaWdodCx0b3BsZWZ0KXt9O1xuXG5cblxuZ2xNYXRyaXguZHJhd0xpbmUgPSBmdW5jdGlvbihzdGFydCwgZW5kKXtcbiAgICB2YXIgZ2wgPSB0aGlzO1xuICAgIHZhciBnbEFycmF5QnVmZmVyID0gZ2wuQVJSQVlfQlVGRkVSO1xuICAgIHZhciBnbEZsb2F0ID0gZ2wuRkxPQVQ7XG59O1xuXG5cbmdsTWF0cml4LmRyYXdDdWJlID0gZnVuY3Rpb24oY2VudGVyLCBzaXplKXt9O1xuZ2xNYXRyaXguZHJhd0N1YmVTdHJva2VkID0gZnVuY3Rpb24oY2VudGVyLHNpemUpe307XG5nbE1hdHJpeC5kcmF3U3BoZXJlID0gZnVuY3Rpb24oY2VudGVyLCByYWRpdXMsIG51bVNlZ3Mpe307XG5nbE1hdHJpeC5kcmF3Q2lyY2xlID0gZnVuY3Rpb24oY2VudGVyLHJhZGl1cyxudW1TZWdzKXt9O1xuZ2xNYXRyaXguZHJhd0NpcmNsZVN0cm9rZWQgPSBmdW5jdGlvbihjZW50ZXIscmFkaXVzLG51bVNlZ3Mpe307XG5nbE1hdHJpeC5kcmF3RWxsaXBzZSA9IGZ1bmN0aW9uKGNlbnRlcixyYWRpdXNYLHJhZGl1c1ksbnVtU2Vncyl7fTtcbmdsTWF0cml4LmRyYXdFbGxpcHNlU3Ryb2tlZCA9IGZ1bmN0aW9uKGNlbnRlcixyYWRpdXNYLHJhZGl1c1ksbnVtU2Vncyl7fTtcbmdsTWF0cml4LmRyYXdSZWN0ID0gZnVuY3Rpb24ocmVjdCl7fTtcbmdsTWF0cml4LmRyYXdSZWN0U3Ryb2tlZCA9IGZ1bmN0aW9uKHJlY3Qpe307XG5nbE1hdHJpeC5kcmF3UmVjdFJvdW5kZWQgPSBmdW5jdGlvbihyZWN0LHJhZGl1c0Nvcm5lcixudW1TZWdzQ29ybmVyKXt9O1xuZ2xNYXRyaXguZHJhd1JlY3RSb3VuZGVkU3Ryb2tlZCAgPWZ1bmN0aW9uKHJlY3QscmFkaXVzQ29ybmVyLG51bVNlZ3NDb3JuZXIpe307XG5nbE1hdHJpeC5kcmF3VHJpYW5nbGUgPSBmdW5jdGlvbih2MCx2MSx2Mil7fTtcbmdsTWF0cml4LmRyYXdUcmlhbmdsZVN0cm9rZWQgPSBmdW5jdGlvbih2MCx2MSx2Mil7fTtcblxuZ2xNYXRyaXguZHJhdyA9IGZ1bmN0aW9uKG9iail7fTtcbmdsTWF0cml4LmRyYXdSYW5nZSA9IGZ1bmN0aW9uKG9iaixiZWdpbixjb3VudCl7fTtcblxuZ2xNYXRyaXguZHJhd1Bpdm90ID0gZnVuY3Rpb24obGVuZ3RoKXt9O1xuZ2xNYXRyaXguZHJhd1ZlY3RvciA9IGZ1bmN0aW9uKHZlYyl7fTtcbmdsTWF0cml4LmRyYXdGcnVzdHVtID0gZnVuY3Rpb24oY2FtZXJhKXt9O1xuXG5nbE1hdHJpeC5kcmF3QXJyYXlzU2FmZSA9IGZ1bmN0aW9uKCl7fTtcblxuZ2xNYXRyaXguZHJhd1N0cmluZyA9IGZ1bmN0aW9uKHN0cmluZyxwb3MsYWxpZ24pe307XG5cblxuZ2xNYXRyaXguY29sb3I0ZiA9IGZ1bmN0aW9uKHIsZyxiLGEpe307XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xNYXRyaXg7XG4iLCJ2YXIgTWF0cml4NDQgPSByZXF1aXJlKCcuLi9tYXRoL01hdHJpeDQ0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBlcnNwZWN0aXZlOiBmdW5jdGlvbiAobSwgZm92LCBhc3BlY3QsIG5lYXIsIGZhcikge1xuICAgICAgICB2YXIgZiA9IDEuMCAvIE1hdGgudGFuKGZvdiAqIDAuNSksXG4gICAgICAgICAgICBuZiA9IDEuMCAvIChuZWFyIC0gZmFyKTtcblxuICAgICAgICBtWzBdID0gZiAvIGFzcGVjdDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSBmO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAtMTtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gKDIgKiBmYXIgKiBuZWFyKSAqIG5mO1xuICAgICAgICBtWzE1XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG5cbiAgICB9LFxuXG4gICAgZnJ1c3R1bTogZnVuY3Rpb24gKG0sIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gICAgICAgIHZhciBybCA9IDEgLyAocmlnaHQgLSBsZWZ0KSxcbiAgICAgICAgICAgIHRiID0gMSAvICh0b3AgLSBib3R0b20pLFxuICAgICAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuXG5cbiAgICAgICAgbVsgMF0gPSAobmVhciAqIDIpICogcmw7XG4gICAgICAgIG1bIDFdID0gMDtcbiAgICAgICAgbVsgMl0gPSAwO1xuICAgICAgICBtWyAzXSA9IDA7XG4gICAgICAgIG1bIDRdID0gMDtcbiAgICAgICAgbVsgNV0gPSAobmVhciAqIDIpICogdGI7XG4gICAgICAgIG1bIDZdID0gMDtcbiAgICAgICAgbVsgN10gPSAwO1xuICAgICAgICBtWyA4XSA9IChyaWdodCArIGxlZnQpICogcmw7XG4gICAgICAgIG1bIDldID0gKHRvcCArIGJvdHRvbSkgKiB0YjtcbiAgICAgICAgbVsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAtMTtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gKGZhciAqIG5lYXIgKiAyKSAqIG5mO1xuICAgICAgICBtWzE1XSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIGxvb2tBdDogZnVuY3Rpb24gKG0sIGV5ZSwgdGFyZ2V0LCB1cCkge1xuICAgICAgICB2YXIgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbGVuLFxuICAgICAgICAgICAgZXlleCA9IGV5ZVswXSxcbiAgICAgICAgICAgIGV5ZXkgPSBleWVbMV0sXG4gICAgICAgICAgICBleWV6ID0gZXllWzJdLFxuICAgICAgICAgICAgdXB4ID0gdXBbMF0sXG4gICAgICAgICAgICB1cHkgPSB1cFsxXSxcbiAgICAgICAgICAgIHVweiA9IHVwWzJdLFxuICAgICAgICAgICAgdGFyZ2V0eCA9IHRhcmdldFswXSxcbiAgICAgICAgICAgIHRhcnRldHkgPSB0YXJnZXRbMV0sXG4gICAgICAgICAgICB0YXJnZXR6ID0gdGFyZ2V0WzJdO1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhleWV4IC0gdGFyZ2V0eCkgPCAwLjAwMDAwMSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoZXlleSAtIHRhcnRldHkpIDwgMC4wMDAwMDEgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGV5ZXogLSB0YXJnZXR6KSA8IDAuMDAwMDAxKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0cml4NDQuaWRlbnRpdHkobSk7XG4gICAgICAgIH1cblxuICAgICAgICB6MCA9IGV5ZXggLSB0YXJnZXR4O1xuICAgICAgICB6MSA9IGV5ZXkgLSB0YXJ0ZXR5O1xuICAgICAgICB6MiA9IGV5ZXogLSB0YXJnZXR6O1xuXG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICAgICAgejAgKj0gbGVuO1xuICAgICAgICB6MSAqPSBsZW47XG4gICAgICAgIHoyICo9IGxlbjtcblxuICAgICAgICB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XG4gICAgICAgIHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICAgICAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xuXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgICAgICBsZW4gPSAhbGVuID8gMCA6IDEgLyBsZW47XG5cbiAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgIHgyICo9IGxlbjtcblxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuICAgICAgICBsZW4gPSAhbGVuID8gMCA6IDEgLyBsZW47XG5cbiAgICAgICAgeTAgKj0gbGVuO1xuICAgICAgICB5MSAqPSBsZW47XG4gICAgICAgIHkyICo9IGxlbjtcblxuXG4gICAgICAgIG1bIDBdID0geDA7XG4gICAgICAgIG1bIDFdID0geTA7XG4gICAgICAgIG1bIDJdID0gejA7XG4gICAgICAgIG1bIDNdID0gMDtcbiAgICAgICAgbVsgNF0gPSB4MTtcbiAgICAgICAgbVsgNV0gPSB5MTtcbiAgICAgICAgbVsgNl0gPSB6MTtcbiAgICAgICAgbVsgN10gPSAwO1xuICAgICAgICBtWyA4XSA9IHgyO1xuICAgICAgICBtWyA5XSA9IHkyO1xuICAgICAgICBtWzEwXSA9IHoyO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gLSh4MCAqIGV5ZXggKyB4MSAqIGV5ZXkgKyB4MiAqIGV5ZXopO1xuICAgICAgICBtWzEzXSA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcbiAgICAgICAgbVsxNF0gPSAtKHowICogZXlleCArIHoxICogZXlleSArIHoyICogZXlleik7XG4gICAgICAgIG1bMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG59OyIsInZhciBfTWF0aCA9IHtcbiAgICBQSTogTWF0aC5QSSxcbiAgICBIQUxGX1BJOiBNYXRoLlBJICogMC41LFxuICAgIFFVQVJURVJfUEk6IE1hdGguUEkgKiAwLjI1LFxuICAgIFRXT19QSTogTWF0aC5QSSAqIDIsXG4gICAgRVBTSUxPTjogMC4wMDAxLFxuXG4gICAgbGVycDogZnVuY3Rpb24gKGEsIGIsIHYpIHtcbiAgICAgICAgcmV0dXJuIChhICogKDEgLSB2KSkgKyAoYiAqIHYpO1xuICAgIH0sXG4gICAgY29zSW50cnBsOiBmdW5jdGlvbiAoYSwgYiwgdikge1xuICAgICAgICB2ID0gKDEgLSBNYXRoLmNvcyh2ICogTWF0aC5QSSkpICogMC41O1xuICAgICAgICByZXR1cm4gKGEgKiAoMSAtIHYpICsgYiAqIHYpO1xuICAgIH0sXG4gICAgY3ViaWNJbnRycGw6IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB2KSB7XG4gICAgICAgIHZhciBhMCwgYjAsIGMwLCBkMCwgdnY7XG5cbiAgICAgICAgdnYgPSB2ICogdjtcbiAgICAgICAgYTAgPSBkIC0gYyAtIGEgKyBiO1xuICAgICAgICBiMCA9IGEgLSBiIC0gYTA7XG4gICAgICAgIGMwID0gYyAtIGE7XG4gICAgICAgIGQwID0gYjtcblxuICAgICAgICByZXR1cm4gYTAgKiB2ICogdnYgKyBiMCAqIHZ2ICsgYzAgKiB2ICsgZDA7XG4gICAgfSxcblxuICAgIGhlcm1pdGVJbnRycGw6IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB2LCB0ZW5zaW9uLCBiaWFzKSB7XG4gICAgICAgIHZhciB2MCwgdjEsIHYyLCB2MyxcbiAgICAgICAgICAgIGEwLCBiMCwgYzAsIGQwO1xuXG4gICAgICAgIHRlbnNpb24gPSAoMS4wIC0gdGVuc2lvbikgKiAwLjU7XG5cbiAgICAgICAgdmFyIGJpYXNwID0gMSArIGJpYXMsXG4gICAgICAgICAgICBiaWFzbiA9IDEgLSBiaWFzO1xuXG4gICAgICAgIHYyID0gdiAqIHY7XG4gICAgICAgIHYzID0gdjIgKiB2O1xuXG4gICAgICAgIHYwID0gKGIgLSBhKSAqIGJpYXNwICogdGVuc2lvbjtcbiAgICAgICAgdjAgKz0gKGMgLSBiKSAqIGJpYXNuICogdGVuc2lvbjtcbiAgICAgICAgdjEgPSAoYyAtIGIpICogYmlhc3AgKiB0ZW5zaW9uO1xuICAgICAgICB2MSArPSAoZCAtIGMpICogYmlhc24gKiB0ZW5zaW9uO1xuXG4gICAgICAgIGEwID0gMiAqIHYzIC0gMyAqIHYyICsgMTtcbiAgICAgICAgYjAgPSB2MyAtIDIgKiB2MiArIHY7XG4gICAgICAgIGMwID0gdjMgLSB2MjtcbiAgICAgICAgZDAgPSAtMiAqIHYzICsgMyAqIHYyO1xuXG4gICAgICAgIHJldHVybiBhMCAqIGIgKyBiMCAqIHYwICsgYzAgKiB2MSArIGQwICogYztcbiAgICB9LFxuXG4gICAgcmFuZG9tRmxvYXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgciA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgciA9IE1hdGgucmFuZG9tKCkgKiBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgciA9IGFyZ3VtZW50c1swXSArIChhcmd1bWVudHNbMV0gLSBhcmd1bWVudHNbMF0pICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG5cbiAgICByYW5kb21JbnRlZ2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByO1xuXG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHIgPSAwLjUgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHIgPSAwLjUgKyBNYXRoLnJhbmRvbSgpICogYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHIgPSBhcmd1bWVudHNbMF0gKyAoIDEgKyBhcmd1bWVudHNbMV0gLSBhcmd1bWVudHNbMF0pICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHIpO1xuICAgIH0sXG5cbiAgICBjb25zdHJhaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHI7XG5cbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgYXJndW1lbnRzWzBdID0gKGFyZ3VtZW50c1swXSA+IGFyZ3VtZW50c1sxXSkgPyBhcmd1bWVudHNbMV0gOiBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgYXJndW1lbnRzWzBdID0gKGFyZ3VtZW50c1swXSA+IGFyZ3VtZW50c1syXSkgPyBhcmd1bWVudHNbMl0gOiAoYXJndW1lbnRzWzBdIDwgYXJndW1lbnRzWzFdKSA/IGFyZ3VtZW50c1sxXSA6IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZTogZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gICAgICAgIHJldHVybiAodmFsdWUgLSBzdGFydCkgLyAoZW5kIC0gc3RhcnQpO1xuICAgIH0sXG4gICAgbWFwOiBmdW5jdGlvbiAodmFsdWUsIGluU3RhcnQsIGluRW5kLCBvdXRTdGFydCwgb3V0RW5kKSB7XG4gICAgICAgIHJldHVybiBvdXRTdGFydCArIChvdXRFbmQgLSBvdXRTdGFydCkgKiBub3JtYWxpemUodmFsdWUsIGluU3RhcnQsIGluRW5kKTtcbiAgICB9LFxuICAgIHNpbjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNpbih2YWx1ZSk7XG4gICAgfSxcbiAgICBjb3M6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5jb3ModmFsdWUpO1xuICAgIH0sXG4gICAgY2xhbXA6IGZ1bmN0aW9uICh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2YWx1ZSkpO1xuICAgIH0sXG4gICAgc2F3OiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gMiAqIChuIC0gTWF0aC5mbG9vcigwLjUgKyBuKSk7XG4gICAgfSxcbiAgICB0cmk6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiAxIC0gNCAqIE1hdGguYWJzKDAuNSAtIHRoaXMuZnJhYygwLjUgKiBuICsgMC4yNSkpO1xuICAgIH0sXG4gICAgcmVjdDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgdmFyIGEgPSBNYXRoLmFicyhuKTtcbiAgICAgICAgcmV0dXJuIChhID4gMC41KSA/IDAgOiAoYSA9PSAwLjUpID8gMC41IDogKGEgPCAwLjUpID8gMSA6IC0xO1xuICAgIH0sXG4gICAgZnJhYzogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIG4gLSBNYXRoLmZsb29yKG4pO1xuICAgIH0sXG4gICAgc2duOiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gbiAvIE1hdGguYWJzKG4pO1xuICAgIH0sXG4gICAgYWJzOiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XG4gICAgfSxcbiAgICBtaW46IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihuKTtcbiAgICB9LFxuICAgIG1heDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KG4pO1xuICAgIH0sXG4gICAgYXRhbjogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbihuKTtcbiAgICB9LFxuICAgIGF0YW4yOiBmdW5jdGlvbiAoeSwgeCkge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcbiAgICB9LFxuICAgIHJvdW5kOiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChuKTtcbiAgICB9LFxuICAgIGZsb29yOiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihuKTtcbiAgICB9LFxuICAgIHRhbjogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIE1hdGgudGFuKG4pO1xuICAgIH0sXG4gICAgcmFkMmRlZzogZnVuY3Rpb24gKHJhZGlhbnMpIHtcbiAgICAgICAgcmV0dXJuIHJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSk7XG4gICAgfSxcbiAgICBkZWcycmFkOiBmdW5jdGlvbiAoZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgfSxcbiAgICBzcXJ0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2YWx1ZSk7XG4gICAgfSxcbiAgICBHcmVhdGVzdENvbW1vbkRpdmlzb3I6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiAoYiA9PSAwKSA/IGEgOiB0aGlzLkdyZWF0ZXN0Q29tbW9uRGl2aXNvcihiLCBhICUgYik7XG4gICAgfSxcbiAgICBpc0Zsb2F0RXF1YWw6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoYSAtIGIpIDwgdGhpcy5FUFNJTE9OKTtcbiAgICB9LFxuICAgIGlzUG93ZXJPZlR3bzogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIChhICYgKGEgLSAxKSkgPT0gMDtcbiAgICB9LFxuICAgIHN3YXA6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHZhciB0ID0gYTtcbiAgICAgICAgYSA9IGI7XG4gICAgICAgIGIgPSBhO1xuICAgIH0sXG4gICAgcG93OiBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3coeCwgeSk7XG4gICAgfSxcbiAgICBsb2c6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmxvZyhuKTtcbiAgICB9LFxuICAgIGNvc2g6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5wb3coTWF0aC5FLCBuKSArIE1hdGgucG93KE1hdGguRSwgLW4pKSAqIDAuNTtcbiAgICB9LFxuICAgIGV4cDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZXhwKG4pO1xuICAgIH0sXG4gICAgc3RlcFNtb290aDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIG4gKiBuICogKDMgLSAyICogbik7XG4gICAgfSxcbiAgICBzdGVwU21vb3RoU3F1YXJlZDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RlcFNtb290aChuKSAqIHRoaXMuc3RlcFNtb290aChuKTtcbiAgICB9LFxuICAgIHN0ZXBTbW9vdGhJbnZTcXVhcmVkOiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gMSAtICgxIC0gdGhpcy5zdGVwU21vb3RoKG4pKSAqICgxIC0gdGhpcy5zdGVwU21vb3RoKG4pKTtcbiAgICB9LFxuICAgIHN0ZXBTbW9vdGhDdWJlZDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RlcFNtb290aChuKSAqIHRoaXMuc3RlcFNtb290aChuKSAqIHRoaXMuc3RlcFNtb290aChuKSAqIHRoaXMuc3RlcFNtb290aChuKTtcbiAgICB9LFxuICAgIHN0ZXBTbW9vdGhJbnZDdWJlZDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIDEgLSAoMSAtIHRoaXMuc3RlcFNtb290aChuKSkgKiAoMSAtIHRoaXMuc3RlcFNtb290aChuKSkgKiAoMSAtIHRoaXMuc3RlcFNtb290aChuKSkgKiAoMSAtIHRoaXMuc3RlcFNtb290aChuKSk7XG4gICAgfSxcbiAgICBzdGVwU3F1YXJlZDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIG4gKiBuO1xuICAgIH0sXG4gICAgc3RlcEludlNxdWFyZWQ6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiAxIC0gKDEgLSBuKSAqICgxIC0gbik7XG4gICAgfSxcbiAgICBzdGVwQ3ViZWQ6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBuICogbiAqIG4gKiBuO1xuICAgIH0sXG4gICAgc3RlcEludkN1YmVkOiBmdW5jdGlvbiAobikge1xuICAgICAgICByZXR1cm4gMSAtICgxIC0gbikgKiAoMSAtIG4pICogKDEgLSBuKSAqICgxIC0gbik7XG4gICAgfSxcbiAgICBjYXRtdWxscm9tOiBmdW5jdGlvbiAoYSwgYiwgYywgZCwgaSkge1xuICAgICAgICByZXR1cm4gYSAqICgoLWkgKyAyKSAqIGkgLSAxKSAqIGkgKiAwLjUgK1xuICAgICAgICAgICAgYiAqICgoKDMgKiBpIC0gNSkgKiBpKSAqIGkgKyAyKSAqIDAuNSArXG4gICAgICAgICAgICBjICogKCgtMyAqIGkgKyA0KSAqIGkgKyAxKSAqIGkgKiAwLjUgK1xuICAgICAgICAgICAgZCAqICgoaSAtIDEpICogaSAqIGkpICogMC41O1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBfTWF0aDsiLCJcbi8vZm9yIG5vZGUgZGVidWdcbnZhciBNYXQzMyA9XG57XG4gICAgbWFrZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLDAsMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsMSwwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwwLDFdKTtcbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlIDogZnVuY3Rpb24ob3V0LGEpXG4gICAge1xuXG4gICAgICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgICAgIHZhciBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTIgPSBhWzVdO1xuICAgICAgICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgICAgICBvdXRbM10gPSBhMDE7XG4gICAgICAgICAgICBvdXRbNV0gPSBhWzddO1xuICAgICAgICAgICAgb3V0WzZdID0gYTAyO1xuICAgICAgICAgICAgb3V0WzddID0gYTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgICAgICBvdXRbMl0gPSBhWzZdO1xuICAgICAgICAgICAgb3V0WzNdID0gYVsxXTtcbiAgICAgICAgICAgIG91dFs0XSA9IGFbNF07XG4gICAgICAgICAgICBvdXRbNV0gPSBhWzddO1xuICAgICAgICAgICAgb3V0WzZdID0gYVsyXTtcbiAgICAgICAgICAgIG91dFs3XSA9IGFbNV07XG4gICAgICAgICAgICBvdXRbOF0gPSBhWzhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0MzM7IiwidmFyIGZNYXRoID0gcmVxdWlyZSgnLi9NYXRoJyksXG4gICAgTWF0MzMgPSByZXF1aXJlKCcuL01hdHJpeDMzJyk7XG5cbi8vZm9yIG5vZGUgZGVidWdcbnZhciBNYXRyaXg0NCA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgMSwgMCwgMCwgMCxcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxuICAgICAgICAgICAgMCwgMCwgMCwgMSBdKTtcbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbiAobTAsIG0xKSB7XG4gICAgICAgIG0wWyAwXSA9IG0xWyAwXTtcbiAgICAgICAgbTBbIDFdID0gbTFbIDFdO1xuICAgICAgICBtMFsgMl0gPSBtMVsgMl07XG4gICAgICAgIG0wWyAzXSA9IG0xWyAzXTtcblxuICAgICAgICBtMFsgNF0gPSBtMVsgNF07XG4gICAgICAgIG0wWyA1XSA9IG0xWyA1XTtcbiAgICAgICAgbTBbIDZdID0gbTFbIDZdO1xuICAgICAgICBtMFsgN10gPSBtMVsgN107XG5cbiAgICAgICAgbTBbIDhdID0gbTFbIDhdO1xuICAgICAgICBtMFsgOV0gPSBtMVsgOV07XG4gICAgICAgIG0wWzEwXSA9IG0xWzEwXTtcbiAgICAgICAgbTBbMTFdID0gbTFbMTFdO1xuXG4gICAgICAgIG0wWzEyXSA9IG0xWzEyXTtcbiAgICAgICAgbTBbMTNdID0gbTFbMTNdO1xuICAgICAgICBtMFsxNF0gPSBtMVsxNF07XG4gICAgICAgIG0wWzE1XSA9IG0xWzE1XTtcblxuXG4gICAgICAgIHJldHVybiBtMDtcbiAgICB9LFxuXG4gICAgaWRlbnRpdHk6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIG1bIDBdID0gMTtcbiAgICAgICAgbVsgMV0gPSBtWyAyXSA9IG1bIDNdID0gMDtcbiAgICAgICAgbVsgNV0gPSAxO1xuICAgICAgICBtWyA0XSA9IG1bIDZdID0gbVsgN10gPSAwO1xuICAgICAgICBtWzEwXSA9IDE7XG4gICAgICAgIG1bIDhdID0gbVsgOV0gPSBtWzExXSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgbVsxMl0gPSBtWzEzXSA9IG1bMTRdID0gMDtcblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9LFxuXG4gICAgY29weTogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkobSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVNjYWxlOiBmdW5jdGlvbiAoc3gsIHN5LCBzeiwgbSkge1xuICAgICAgICBtID0gbSB8fCB0aGlzLmNyZWF0ZSgpO1xuXG4gICAgICAgIG1bMF0gPSBzeDtcbiAgICAgICAgbVs1XSA9IHN5O1xuICAgICAgICBtWzEwXSA9IHN6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVUcmFuc2xhdGlvbjogZnVuY3Rpb24gKHR4LCB0eSwgdHosIG0pIHtcbiAgICAgICAgbSA9IG0gfHwgdGhpcy5jcmVhdGUoKTtcblxuICAgICAgICBtWzEyXSA9IHR4O1xuICAgICAgICBtWzEzXSA9IHR5O1xuICAgICAgICBtWzE0XSA9IHR6O1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVSb3RhdGlvblg6IGZ1bmN0aW9uIChhLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVs1XSA9IGNvcztcbiAgICAgICAgbVs2XSA9IC1zaW47XG4gICAgICAgIG1bOV0gPSBzaW47XG4gICAgICAgIG1bMTBdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVSb3RhdGlvblk6IGZ1bmN0aW9uIChhLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVswXSA9IGNvcztcbiAgICAgICAgbVsyXSA9IHNpbjtcbiAgICAgICAgbVs4XSA9IC1zaW47XG4gICAgICAgIG1bMTBdID0gY29zO1xuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBjcmVhdGVSb3RhdGlvblo6IGZ1bmN0aW9uIChhLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGEpLFxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MoYSk7XG5cbiAgICAgICAgbVswXSA9IGNvcztcbiAgICAgICAgbVsxXSA9IHNpbjtcbiAgICAgICAgbVs0XSA9IC1zaW47XG4gICAgICAgIG1bNV0gPSBjb3M7XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfSxcblxuICAgIGNyZWF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoYXgsIGF5LCBheiwgbSkge1xuICAgICAgICBtID0gbSB8fCB0aGlzLmNyZWF0ZSgpO1xuXG4gICAgICAgIHZhciBjb3N4ID0gTWF0aC5jb3MoYXgpLFxuICAgICAgICAgICAgc2lueCA9IE1hdGguc2luKGF4KSxcbiAgICAgICAgICAgIGNvc3kgPSBNYXRoLmNvcyhheSksXG4gICAgICAgICAgICBzaW55ID0gTWF0aC5zaW4oYXkpLFxuICAgICAgICAgICAgY29zeiA9IE1hdGguY29zKGF6KSxcbiAgICAgICAgICAgIHNpbnogPSBNYXRoLnNpbihheik7XG5cbiAgICAgICAgbVsgMF0gPSBjb3N5ICogY29zejtcbiAgICAgICAgbVsgMV0gPSAtY29zeCAqIHNpbnogKyBzaW54ICogc2lueSAqIGNvc3o7XG4gICAgICAgIG1bIDJdID0gc2lueCAqIHNpbnogKyBjb3N4ICogc2lueSAqIGNvc3o7XG5cbiAgICAgICAgbVsgNF0gPSBjb3N5ICogc2luejtcbiAgICAgICAgbVsgNV0gPSBjb3N4ICogY29zeiArIHNpbnggKiBzaW55ICogc2luejtcbiAgICAgICAgbVsgNl0gPSAtc2lueCAqIGNvc3ogKyBjb3N4ICogc2lueSAqIHNpbno7XG5cbiAgICAgICAgbVsgOF0gPSAtc2lueTtcbiAgICAgICAgbVsgOV0gPSBzaW54ICogY29zeTtcbiAgICAgICAgbVsxMF0gPSBjb3N4ICogY29zeTtcblxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICAvL3RlbXAgZnJvbSBnbE1hdHJpeFxuICAgIGNyZWF0ZVJvdGF0aW9uT25BeGlzOiBmdW5jdGlvbiAocm90LCB4LCB5LCB6LCBvdXQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuXG4gICAgICAgIGlmIChNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSA8IF9NYXRoLkVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGMsIHQsXG4gICAgICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgICAgICBhMTAsIGExMSwgYTEyLCBhMTMsXG4gICAgICAgICAgICBhMjAsIGEyMSwgYTIyLCBhMjMsXG4gICAgICAgICAgICBiMDAsIGIwMSwgYjAyLFxuICAgICAgICAgICAgYjEwLCBiMTEsIGIxMixcbiAgICAgICAgICAgIGIyMCwgYjIxLCBiMjI7XG5cblxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB4ICo9IGxlbjtcbiAgICAgICAgeSAqPSBsZW47XG4gICAgICAgIHogKj0gbGVuO1xuXG4gICAgICAgIHMgPSBNYXRoLnNpbihyb3QpO1xuICAgICAgICBjID0gTWF0aC5jb3Mocm90KTtcbiAgICAgICAgdCA9IDEgLSBjO1xuXG4gICAgICAgIG91dCA9IG91dCB8fCBNYXRyaXg0NC5jcmVhdGUoKTtcblxuICAgICAgICBhMDAgPSAxO1xuICAgICAgICBhMDEgPSAwO1xuICAgICAgICBhMDIgPSAwO1xuICAgICAgICBhMDMgPSAwO1xuICAgICAgICBhMTAgPSAwO1xuICAgICAgICBhMTEgPSAxO1xuICAgICAgICBhMTIgPSAwO1xuICAgICAgICBhMTMgPSAwO1xuICAgICAgICBhMjAgPSAwO1xuICAgICAgICBhMjEgPSAwO1xuICAgICAgICBhMjIgPSAxO1xuICAgICAgICBhMjMgPSAwO1xuXG4gICAgICAgIGIwMCA9IHggKiB4ICogdCArIGM7XG4gICAgICAgIGIwMSA9IHkgKiB4ICogdCArIHogKiBzO1xuICAgICAgICBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICAgICAgYjEwID0geCAqIHkgKiB0IC0geiAqIHM7XG4gICAgICAgIGIxMSA9IHkgKiB5ICogdCArIGM7XG4gICAgICAgIGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgICAgICBiMjAgPSB4ICogeiAqIHQgKyB5ICogcztcbiAgICAgICAgYjIxID0geSAqIHogKiB0IC0geCAqIHM7XG4gICAgICAgIGIyMiA9IHogKiB6ICogdCArIGM7XG5cbiAgICAgICAgb3V0WzAgXSA9IGEwMCAqIGIwMCArIGExMCAqIGIwMSArIGEyMCAqIGIwMjtcbiAgICAgICAgb3V0WzEgXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICAgICAgb3V0WzIgXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICAgICAgb3V0WzMgXSA9IGEwMyAqIGIwMCArIGExMyAqIGIwMSArIGEyMyAqIGIwMjtcbiAgICAgICAgb3V0WzQgXSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMjtcbiAgICAgICAgb3V0WzUgXSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICAgICAgb3V0WzYgXSA9IGEwMiAqIGIxMCArIGExMiAqIGIxMSArIGEyMiAqIGIxMjtcbiAgICAgICAgb3V0WzcgXSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMjtcbiAgICAgICAgb3V0WzggXSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcbiAgICAgICAgb3V0WzkgXSA9IGEwMSAqIGIyMCArIGExMSAqIGIyMSArIGEyMSAqIGIyMjtcbiAgICAgICAgb3V0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICAgICAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICBtdWx0UHJlOiBmdW5jdGlvbiAobTAsIG0xLCBtKSB7XG4gICAgICAgIG0gPSBtIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdmFyIG0wMDAgPSBtMFsgMF0sIG0wMDEgPSBtMFsgMV0sIG0wMDIgPSBtMFsgMl0sIG0wMDMgPSBtMFsgM10sXG4gICAgICAgICAgICBtMDA0ID0gbTBbIDRdLCBtMDA1ID0gbTBbIDVdLCBtMDA2ID0gbTBbIDZdLCBtMDA3ID0gbTBbIDddLFxuICAgICAgICAgICAgbTAwOCA9IG0wWyA4XSwgbTAwOSA9IG0wWyA5XSwgbTAxMCA9IG0wWzEwXSwgbTAxMSA9IG0wWzExXSxcbiAgICAgICAgICAgIG0wMTIgPSBtMFsxMl0sIG0wMTMgPSBtMFsxM10sIG0wMTQgPSBtMFsxNF0sIG0wMTUgPSBtMFsxNV07XG5cbiAgICAgICAgdmFyIG0xMDAgPSBtMVsgMF0sIG0xMDEgPSBtMVsgMV0sIG0xMDIgPSBtMVsgMl0sIG0xMDMgPSBtMVsgM10sXG4gICAgICAgICAgICBtMTA0ID0gbTFbIDRdLCBtMTA1ID0gbTFbIDVdLCBtMTA2ID0gbTFbIDZdLCBtMTA3ID0gbTFbIDddLFxuICAgICAgICAgICAgbTEwOCA9IG0xWyA4XSwgbTEwOSA9IG0xWyA5XSwgbTExMCA9IG0xWzEwXSwgbTExMSA9IG0xWzExXSxcbiAgICAgICAgICAgIG0xMTIgPSBtMVsxMl0sIG0xMTMgPSBtMVsxM10sIG0xMTQgPSBtMVsxNF0sIG0xMTUgPSBtMVsxNV07XG5cbiAgICAgICAgbVsgMF0gPSBtMDAwICogbTEwMCArIG0wMDEgKiBtMTA0ICsgbTAwMiAqIG0xMDggKyBtMDAzICogbTExMjtcbiAgICAgICAgbVsgMV0gPSBtMDAwICogbTEwMSArIG0wMDEgKiBtMTA1ICsgbTAwMiAqIG0xMDkgKyBtMDAzICogbTExMztcbiAgICAgICAgbVsgMl0gPSBtMDAwICogbTEwMiArIG0wMDEgKiBtMTA2ICsgbTAwMiAqIG0xMTAgKyBtMDAzICogbTExNDtcbiAgICAgICAgbVsgM10gPSBtMDAwICogbTEwMyArIG0wMDEgKiBtMTA3ICsgbTAwMiAqIG0xMTEgKyBtMDAzICogbTExNTtcblxuICAgICAgICBtWyA0XSA9IG0wMDQgKiBtMTAwICsgbTAwNSAqIG0xMDQgKyBtMDA2ICogbTEwOCArIG0wMDcgKiBtMTEyO1xuICAgICAgICBtWyA1XSA9IG0wMDQgKiBtMTAxICsgbTAwNSAqIG0xMDUgKyBtMDA2ICogbTEwOSArIG0wMDcgKiBtMTEzO1xuICAgICAgICBtWyA2XSA9IG0wMDQgKiBtMTAyICsgbTAwNSAqIG0xMDYgKyBtMDA2ICogbTExMCArIG0wMDcgKiBtMTE0O1xuICAgICAgICBtWyA3XSA9IG0wMDQgKiBtMTAzICsgbTAwNSAqIG0xMDcgKyBtMDA2ICogbTExMSArIG0wMDcgKiBtMTE1O1xuXG4gICAgICAgIG1bIDhdID0gbTAwOCAqIG0xMDAgKyBtMDA5ICogbTEwNCArIG0wMTAgKiBtMTA4ICsgbTAxMSAqIG0xMTI7XG4gICAgICAgIG1bIDldID0gbTAwOCAqIG0xMDEgKyBtMDA5ICogbTEwNSArIG0wMTAgKiBtMTA5ICsgbTAxMSAqIG0xMTM7XG4gICAgICAgIG1bMTBdID0gbTAwOCAqIG0xMDIgKyBtMDA5ICogbTEwNiArIG0wMTAgKiBtMTEwICsgbTAxMSAqIG0xMTQ7XG4gICAgICAgIG1bMTFdID0gbTAwOCAqIG0xMDMgKyBtMDA5ICogbTEwNyArIG0wMTAgKiBtMTExICsgbTAxMSAqIG0xMTU7XG5cbiAgICAgICAgbVsxMl0gPSBtMDEyICogbTEwMCArIG0wMTMgKiBtMTA0ICsgbTAxNCAqIG0xMDggKyBtMDE1ICogbTExMjtcbiAgICAgICAgbVsxM10gPSBtMDEyICogbTEwMSArIG0wMTMgKiBtMTA1ICsgbTAxNCAqIG0xMDkgKyBtMDE1ICogbTExMztcbiAgICAgICAgbVsxNF0gPSBtMDEyICogbTEwMiArIG0wMTMgKiBtMTA2ICsgbTAxNCAqIG0xMTAgKyBtMDE1ICogbTExNDtcbiAgICAgICAgbVsxNV0gPSBtMDEyICogbTEwMyArIG0wMTMgKiBtMTA3ICsgbTAxNCAqIG0xMTEgKyBtMDE1ICogbTExNTtcblxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH0sXG5cbiAgICBtdWx0OiBmdW5jdGlvbiAobTAsIG0xLCBtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRQcmUobTAsIG0xLCBtKTtcbiAgICB9LFxuXG4gICAgbXVsdFBvc3Q6IGZ1bmN0aW9uIChtMCwgbTEsIG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdFByZShtMSwgbTAsIG0pO1xuICAgIH0sXG5cbiAgICBpbnZlcnQ6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIG8gPSBvIHx8IG07XG5cbiAgICAgICAgdmFyIGRldDtcblxuICAgICAgICB2YXIgbTAwID0gbVsgMF0sIG0wMSA9IG1bIDFdLCBtMDIgPSBtWyAyXSwgbTAzID0gbVsgM10sXG4gICAgICAgICAgICBtMDQgPSBtWyA0XSwgbTA1ID0gbVsgNV0sIG0wNiA9IG1bIDZdLCBtMDcgPSBtWyA3XSxcbiAgICAgICAgICAgIG0wOCA9IG1bIDhdLCBtMDkgPSBtWyA5XSwgbTEwID0gbVsxMF0sIG0xMSA9IG1bMTFdLFxuICAgICAgICAgICAgbTEyID0gbVsxMl0sIG0xMyA9IG1bMTNdLCBtMTQgPSBtWzE0XSwgbTE1ID0gbVsxNV07XG5cbiAgICAgICAgLy9UT0RPOiBhZGQgY2FjaGluZ1xuXG4gICAgICAgIG9bIDBdID0gbTA1ICogbTEwICogbTE1IC1cbiAgICAgICAgICAgIG0wNSAqIG0xMSAqIG0xNCAtXG4gICAgICAgICAgICBtMDkgKiBtMDYgKiBtMTUgK1xuICAgICAgICAgICAgbTA5ICogbTA3ICogbTE0ICtcbiAgICAgICAgICAgIG0xMyAqIG0wNiAqIG0xMSAtXG4gICAgICAgICAgICBtMTMgKiBtMDcgKiBtMTA7XG5cbiAgICAgICAgb1sgNF0gPSAtbTA0ICogbTEwICogbTE1ICtcbiAgICAgICAgICAgIG0wNCAqIG0xMSAqIG0xNCArXG4gICAgICAgICAgICBtMDggKiBtMDYgKiBtMTUgLVxuICAgICAgICAgICAgbTA4ICogbTA3ICogbTE0IC1cbiAgICAgICAgICAgIG0xMiAqIG0wNiAqIG0xMSArXG4gICAgICAgICAgICBtMTIgKiBtMDcgKiBtMTA7XG5cbiAgICAgICAgb1sgOF0gPSBtMDQgKiBtMDkgKiBtMTUgLVxuICAgICAgICAgICAgbTA0ICogbTExICogbTEzIC1cbiAgICAgICAgICAgIG0wOCAqIG0wNSAqIG0xNSArXG4gICAgICAgICAgICBtMDggKiBtMDcgKiBtMTMgK1xuICAgICAgICAgICAgbTEyICogbTA1ICogbTExIC1cbiAgICAgICAgICAgIG0xMiAqIG0wNyAqIG0wOTtcblxuICAgICAgICBvWzEyXSA9IC1tMDQgKiBtMDkgKiBtMTQgK1xuICAgICAgICAgICAgbTA0ICogbTEwICogbTEzICtcbiAgICAgICAgICAgIG0wOCAqIG0wNSAqIG0xNCAtXG4gICAgICAgICAgICBtMDggKiBtMDYgKiBtMTMgLVxuICAgICAgICAgICAgbTEyICogbTA1ICogbTEwICtcbiAgICAgICAgICAgIG0xMiAqIG0wNiAqIG0wOTtcblxuICAgICAgICBvWyAxXSA9IC1tMDEgKiBtMTAgKiBtMTUgK1xuICAgICAgICAgICAgbTAxICogbTExICogbTE0ICtcbiAgICAgICAgICAgIG0wOSAqIG0wMiAqIG0xNSAtXG4gICAgICAgICAgICBtMDkgKiBtMDMgKiBtMTQgLVxuICAgICAgICAgICAgbTEzICogbTAyICogbTExICtcbiAgICAgICAgICAgIG0xMyAqIG0wMyAqIG0xMDtcblxuICAgICAgICBvWyA1XSA9IG0wMCAqIG0xMCAqIG0xNSAtXG4gICAgICAgICAgICBtMDAgKiBtMTEgKiBtMTQgLVxuICAgICAgICAgICAgbTA4ICogbTAyICogbTE1ICtcbiAgICAgICAgICAgIG0wOCAqIG0wMyAqIG0xNCArXG4gICAgICAgICAgICBtMTIgKiBtMDIgKiBtMTEgLVxuICAgICAgICAgICAgbTEyICogbTAzICogbTEwO1xuXG4gICAgICAgIG9bIDldID0gLW0wMCAqIG0wOSAqIG0xNSArXG4gICAgICAgICAgICBtMDAgKiBtMTEgKiBtMTMgK1xuICAgICAgICAgICAgbTA4ICogbTAxICogbTE1IC1cbiAgICAgICAgICAgIG0wOCAqIG0wMyAqIG0xMyAtXG4gICAgICAgICAgICBtMTIgKiBtMDEgKiBtMTEgK1xuICAgICAgICAgICAgbTEyICogbTAzICogbTA5O1xuXG4gICAgICAgIG9bMTNdID0gbTAwICogbTA5ICogbTE0IC1cbiAgICAgICAgICAgIG0wMCAqIG0xMCAqIG0xMyAtXG4gICAgICAgICAgICBtMDggKiBtMDEgKiBtMTQgK1xuICAgICAgICAgICAgbTA4ICogbTAyICogbTEzICtcbiAgICAgICAgICAgIG0xMiAqIG0wMSAqIG0xMCAtXG4gICAgICAgICAgICBtMTIgKiBtMDIgKiBtMDk7XG5cbiAgICAgICAgb1sgMl0gPSBtMDEgKiBtMDYgKiBtMTUgLVxuICAgICAgICAgICAgbTAxICogbTA3ICogbTE0IC1cbiAgICAgICAgICAgIG0wNSAqIG0wMiAqIG0xNSArXG4gICAgICAgICAgICBtMDUgKiBtMDMgKiBtMTQgK1xuICAgICAgICAgICAgbTEzICogbTAyICogbTA3IC1cbiAgICAgICAgICAgIG0xMyAqIG0wMyAqIG0wNjtcblxuICAgICAgICBvWyA2XSA9IC1tMDAgKiBtMDYgKiBtMTUgK1xuICAgICAgICAgICAgbTAwICogbTA3ICogbTE0ICtcbiAgICAgICAgICAgIG0wNCAqIG0wMiAqIG0xNSAtXG4gICAgICAgICAgICBtMDQgKiBtMDMgKiBtMTQgLVxuICAgICAgICAgICAgbTEyICogbTAyICogbTA3ICtcbiAgICAgICAgICAgIG0xMiAqIG0wMyAqIG0wNjtcblxuICAgICAgICBvWzEwXSA9IG0wMCAqIG0wNSAqIG0xNSAtXG4gICAgICAgICAgICBtMDAgKiBtMDcgKiBtMTMgLVxuICAgICAgICAgICAgbTA0ICogbTAxICogbTE1ICtcbiAgICAgICAgICAgIG0wNCAqIG0wMyAqIG0xMyArXG4gICAgICAgICAgICBtMTIgKiBtMDEgKiBtMDcgLVxuICAgICAgICAgICAgbTEyICogbTAzICogbTA1O1xuXG4gICAgICAgIG9bMTRdID0gLW0wMCAqIG0wNSAqIG0xNCArXG4gICAgICAgICAgICBtMDAgKiBtMDYgKiBtMTMgK1xuICAgICAgICAgICAgbTA0ICogbTAxICogbTE0IC1cbiAgICAgICAgICAgIG0wNCAqIG0wMiAqIG0xMyAtXG4gICAgICAgICAgICBtMTIgKiBtMDEgKiBtMDYgK1xuICAgICAgICAgICAgbTEyICogbTAyICogbTA1O1xuXG4gICAgICAgIG9bIDNdID0gLW0wMSAqIG0wNiAqIG0xMSArXG4gICAgICAgICAgICBtMDEgKiBtMDcgKiBtMTAgK1xuICAgICAgICAgICAgbTA1ICogbTAyICogbTExIC1cbiAgICAgICAgICAgIG0wNSAqIG0wMyAqIG0xMCAtXG4gICAgICAgICAgICBtMDkgKiBtMDIgKiBtMDcgK1xuICAgICAgICAgICAgbTA5ICogbTAzICogbTA2O1xuXG4gICAgICAgIG9bIDddID0gbTAwICogbTA2ICogbTExIC1cbiAgICAgICAgICAgIG0wMCAqIG0wNyAqIG0xMCAtXG4gICAgICAgICAgICBtMDQgKiBtMDIgKiBtMTEgK1xuICAgICAgICAgICAgbTA0ICogbTAzICogbTEwICtcbiAgICAgICAgICAgIG0wOCAqIG0wMiAqIG0wNyAtXG4gICAgICAgICAgICBtMDggKiBtMDMgKiBtMDY7XG5cbiAgICAgICAgb1sxMV0gPSAtbTAwICogbTA1ICogbTExICtcbiAgICAgICAgICAgIG0wMCAqIG0wNyAqIG0wOSArXG4gICAgICAgICAgICBtMDQgKiBtMDEgKiBtMTEgLVxuICAgICAgICAgICAgbTA0ICogbTAzICogbTA5IC1cbiAgICAgICAgICAgIG0wOCAqIG0wMSAqIG0wNyArXG4gICAgICAgICAgICBtMDggKiBtMDMgKiBtMDU7XG5cbiAgICAgICAgb1sxNV0gPSBtMDAgKiBtMDUgKiBtMTAgLVxuICAgICAgICAgICAgbTAwICogbTA2ICogbTA5IC1cbiAgICAgICAgICAgIG0wNCAqIG0wMSAqIG0xMCArXG4gICAgICAgICAgICBtMDQgKiBtMDIgKiBtMDkgK1xuICAgICAgICAgICAgbTA4ICogbTAxICogbTA2IC1cbiAgICAgICAgICAgIG0wOCAqIG0wMiAqIG0wNTtcblxuICAgICAgICBkZXQgPSBtMDAgKiBvWzBdICsgbTAxICogb1s0XSArIG0wMiAqIG9bOF0gKyBtMDMgKiBvWzEyXTtcblxuICAgICAgICBpZiAoZGV0ID09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgICAgICBvWyAwXSAqPSBkZXQ7XG4gICAgICAgIG9bIDFdICo9IGRldDtcbiAgICAgICAgb1sgMl0gKj0gZGV0O1xuICAgICAgICBvWyAzXSAqPSBkZXQ7XG4gICAgICAgIG9bIDRdICo9IGRldDtcbiAgICAgICAgb1sgNV0gKj0gZGV0O1xuICAgICAgICBvWyA2XSAqPSBkZXQ7XG4gICAgICAgIG9bIDddICo9IGRldDtcbiAgICAgICAgb1sgOF0gKj0gZGV0O1xuICAgICAgICBvWyA5XSAqPSBkZXQ7XG4gICAgICAgIG9bMTBdICo9IGRldDtcbiAgICAgICAgb1sxMV0gKj0gZGV0O1xuICAgICAgICBvWzEyXSAqPSBkZXQ7XG4gICAgICAgIG9bMTNdICo9IGRldDtcbiAgICAgICAgb1sxNF0gKj0gZGV0O1xuICAgICAgICBvWzE1XSAqPSBkZXQ7XG5cbiAgICAgICAgcmV0dXJuIG87XG4gICAgfSxcblxuXG4gICAgaW52ZXJ0ZWQ6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIC8qXG4gICAgICAgICB2YXIgaW52ID0gdGhpcy5jcmVhdGUoKTtcbiAgICAgICAgIHZhciBkZXQ7XG5cbiAgICAgICAgIHZhciBtMDAgPSBtWyAwXSwgbTAxID0gbVsgMV0sIG0wMiA9IG1bIDJdLCBtMDMgPSBtWyAzXSxcbiAgICAgICAgIG0wNCA9IG1bIDRdLCBtMDUgPSBtWyA1XSwgbTA2ID0gbVsgNl0sIG0wNyA9IG1bIDddLFxuICAgICAgICAgbTA4ID0gbVsgOF0sIG0wOSA9IG1bIDldLCBtMTAgPSBtWzEwXSwgbTExID0gbVsxMV0sXG4gICAgICAgICBtMTIgPSBtWzEyXSwgbTEzID0gbVsxM10sIG0xNCA9IG1bMTRdLCBtMTUgPSBtWzE1XTtcblxuICAgICAgICAgaW52WyAwXSA9ICBtMDUgICogbTEwICAqIG0xNSAtXG4gICAgICAgICBtMDUgICogbTExICAqIG0xNCAtXG4gICAgICAgICBtMDkgICogbTA2ICAqIG0xNSArXG4gICAgICAgICBtMDkgICogbTA3ICAqIG0xNCArXG4gICAgICAgICBtMTMgICogbTA2ICAqIG0xMSAtXG4gICAgICAgICBtMTMgICogbTA3ICAqIG0xMDtcblxuICAgICAgICAgaW52WyA0XSA9IC1tMDQgICogbTEwICAqIG0xNSArXG4gICAgICAgICBtMDQgICogbTExICAqIG0xNCArXG4gICAgICAgICBtMDggICogbTA2ICAqIG0xNSAtXG4gICAgICAgICBtMDggICogbTA3ICAqIG0xNCAtXG4gICAgICAgICBtMTIgICogbTA2ICAqIG0xMSArXG4gICAgICAgICBtMTIgICogbTA3ICAqIG0xMDtcblxuICAgICAgICAgaW52WyA4XSA9ICBtMDQgICogbTA5ICAqIG0xNSAtXG4gICAgICAgICBtMDQgICogbTExICAqIG0xMyAtXG4gICAgICAgICBtMDggICogbTA1ICAqIG0xNSArXG4gICAgICAgICBtMDggICogbTA3ICAqIG0xMyArXG4gICAgICAgICBtMTIgICogbTA1ICAqIG0xMSAtXG4gICAgICAgICBtMTIgICogbTA3ICAqIG0wOTtcblxuICAgICAgICAgaW52WzEyXSA9IC1tMDQgICogbTA5ICAqIG0xNCArXG4gICAgICAgICBtMDQgICogbTEwICAqIG0xMyArXG4gICAgICAgICBtMDggICogbTA1ICAqIG0xNCAtXG4gICAgICAgICBtMDggICogbTA2ICAqIG0xMyAtXG4gICAgICAgICBtMTIgICogbTA1ICAqIG0xMCArXG4gICAgICAgICBtMTIgICogbTA2ICAqIG0wOTtcblxuICAgICAgICAgaW52WyAxXSA9IC1tMDEgICogbTEwICAqIG0xNSArXG4gICAgICAgICBtMDEgICogbTExICAqIG0xNCArXG4gICAgICAgICBtMDkgICogbTAyICAqIG0xNSAtXG4gICAgICAgICBtMDkgICogbTAzICAqIG0xNCAtXG4gICAgICAgICBtMTMgICogbTAyICAqIG0xMSArXG4gICAgICAgICBtMTMgICogbTAzICAqIG0xMDtcblxuICAgICAgICAgaW52WyA1XSA9ICBtMDAgICogbTEwICAqIG0xNSAtXG4gICAgICAgICBtMDAgICogbTExICAqIG0xNCAtXG4gICAgICAgICBtMDggICogbTAyICAqIG0xNSArXG4gICAgICAgICBtMDggICogbTAzICAqIG0xNCArXG4gICAgICAgICBtMTIgICogbTAyICAqIG0xMSAtXG4gICAgICAgICBtMTIgICogbTAzICAqIG0xMDtcblxuICAgICAgICAgaW52WyA5XSA9IC1tMDAgICogbTA5ICAqIG0xNSArXG4gICAgICAgICBtMDAgICogbTExICAqIG0xMyArXG4gICAgICAgICBtMDggICogbTAxICAqIG0xNSAtXG4gICAgICAgICBtMDggICogbTAzICAqIG0xMyAtXG4gICAgICAgICBtMTIgICogbTAxICAqIG0xMSArXG4gICAgICAgICBtMTIgICogbTAzICAqIG0wOTtcblxuICAgICAgICAgaW52WzEzXSA9ICBtMDAgICogbTA5ICAqIG0xNCAtXG4gICAgICAgICBtMDAgICogbTEwICAqIG0xMyAtXG4gICAgICAgICBtMDggICogbTAxICAqIG0xNCArXG4gICAgICAgICBtMDggICogbTAyICAqIG0xMyArXG4gICAgICAgICBtMTIgICogbTAxICAqIG0xMCAtXG4gICAgICAgICBtMTIgICogbTAyICAqIG0wOTtcblxuICAgICAgICAgaW52WyAyXSA9ICBtMDEgICogbTA2ICAqIG0xNSAtXG4gICAgICAgICBtMDEgICogbTA3ICAqIG0xNCAtXG4gICAgICAgICBtMDUgICogbTAyICAqIG0xNSArXG4gICAgICAgICBtMDUgICogbTAzICAqIG0xNCArXG4gICAgICAgICBtMTMgICogbTAyICAqIG0wNyAtXG4gICAgICAgICBtMTMgICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WyA2XSA9IC1tMDAgICogbTA2ICAqIG0xNSArXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0xNCArXG4gICAgICAgICBtMDQgICogbTAyICAqIG0xNSAtXG4gICAgICAgICBtMDQgICogbTAzICAqIG0xNCAtXG4gICAgICAgICBtMTIgICogbTAyICAqIG0wNyArXG4gICAgICAgICBtMTIgICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WzEwXSA9ICBtMDAgICogbTA1ICAqIG0xNSAtXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0xMyAtXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xNSArXG4gICAgICAgICBtMDQgICogbTAzICAqIG0xMyArXG4gICAgICAgICBtMTIgICogbTAxICAqIG0wNyAtXG4gICAgICAgICBtMTIgICogbTAzICAqIG0wNTtcblxuICAgICAgICAgaW52WzE0XSA9IC1tMDAgICogbTA1ICAqIG0xNCArXG4gICAgICAgICBtMDAgICogbTA2ICAqIG0xMyArXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xNCAtXG4gICAgICAgICBtMDQgICogbTAyICAqIG0xMyAtXG4gICAgICAgICBtMTIgICogbTAxICAqIG0wNiArXG4gICAgICAgICBtMTIgICogbTAyICAqIG0wNTtcblxuICAgICAgICAgaW52WyAzXSA9IC1tMDEgICogbTA2ICAqIG0xMSArXG4gICAgICAgICBtMDEgICogbTA3ICAqIG0xMCArXG4gICAgICAgICBtMDUgICogbTAyICAqIG0xMSAtXG4gICAgICAgICBtMDUgICogbTAzICAqIG0xMCAtXG4gICAgICAgICBtMDkgICogbTAyICAqIG0wNyArXG4gICAgICAgICBtMDkgICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WyA3XSA9ICBtMDAgICogbTA2ICAqIG0xMSAtXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0xMCAtXG4gICAgICAgICBtMDQgICogbTAyICAqIG0xMSArXG4gICAgICAgICBtMDQgICogbTAzICAqIG0xMCArXG4gICAgICAgICBtMDggICogbTAyICAqIG0wNyAtXG4gICAgICAgICBtMDggICogbTAzICAqIG0wNjtcblxuICAgICAgICAgaW52WzExXSA9IC1tMDAgICogbTA1ICAqIG0xMSArXG4gICAgICAgICBtMDAgICogbTA3ICAqIG0wOSArXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xMSAtXG4gICAgICAgICBtMDQgICogbTAzICAqIG0wOSAtXG4gICAgICAgICBtMDggICogbTAxICAqIG0wNyArXG4gICAgICAgICBtMDggICogbTAzICAqIG0wNTtcblxuICAgICAgICAgaW52WzE1XSA9ICBtMDAgICogbTA1ICAqIG0xMCAtXG4gICAgICAgICBtMDAgICogbTA2ICAqIG0wOSAtXG4gICAgICAgICBtMDQgICogbTAxICAqIG0xMCArXG4gICAgICAgICBtMDQgICogbTAyICAqIG0wOSArXG4gICAgICAgICBtMDggICogbTAxICAqIG0wNiAtXG4gICAgICAgICBtMDggICogbTAyICAqIG0wNTtcblxuICAgICAgICAgZGV0ID0gbTAwICogaW52WzBdICsgbTAxICogaW52WzRdICsgbTAyICogaW52WzhdICsgbTAzICogaW52WzEyXTtcblxuICAgICAgICAgaWYoZGV0ID09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICAgICAgIGludlsgMF0qPWRldDtcbiAgICAgICAgIGludlsgMV0qPWRldDtcbiAgICAgICAgIGludlsgMl0qPWRldDtcbiAgICAgICAgIGludlsgM10qPWRldDtcbiAgICAgICAgIGludlsgNF0qPWRldDtcbiAgICAgICAgIGludlsgNV0qPWRldDtcbiAgICAgICAgIGludlsgNl0qPWRldDtcbiAgICAgICAgIGludlsgN10qPWRldDtcbiAgICAgICAgIGludlsgOF0qPWRldDtcbiAgICAgICAgIGludlsgOV0qPWRldDtcbiAgICAgICAgIGludlsxMF0qPWRldDtcbiAgICAgICAgIGludlsxMV0qPWRldDtcbiAgICAgICAgIGludlsxMl0qPWRldDtcbiAgICAgICAgIGludlsxM10qPWRldDtcbiAgICAgICAgIGludlsxNF0qPWRldDtcbiAgICAgICAgIGludlsxNV0qPWRldDtcblxuXG4gICAgICAgICByZXR1cm4gaW52O1xuXG4gICAgICAgICAqL1xuXG4gICAgICAgIHJldHVybiB0aGlzLmludmVydCh0aGlzLmNvcHkobSkpO1xuXG5cbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlZDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1vID0gdGhpcy5jcmVhdGUoKTtcblxuICAgICAgICBtb1swIF0gPSBtWzAgXTtcbiAgICAgICAgbW9bMSBdID0gbVs0IF07XG4gICAgICAgIG1vWzIgXSA9IG1bOCBdO1xuICAgICAgICBtb1szIF0gPSBtWzEyXTtcblxuICAgICAgICBtb1s0IF0gPSBtWzEgXTtcbiAgICAgICAgbW9bNSBdID0gbVs1IF07XG4gICAgICAgIG1vWzYgXSA9IG1bOSBdO1xuICAgICAgICBtb1s3IF0gPSBtWzEzXTtcblxuICAgICAgICBtb1s4IF0gPSBtWzIgXTtcbiAgICAgICAgbW9bOSBdID0gbVs2IF07XG4gICAgICAgIG1vWzEwXSA9IG1bMTBdO1xuICAgICAgICBtb1sxMV0gPSBtWzE0XTtcblxuICAgICAgICBtb1sxMl0gPSBtWzMgXTtcbiAgICAgICAgbW9bMTNdID0gbVs3IF07XG4gICAgICAgIG1vWzE0XSA9IG1bMTFdO1xuICAgICAgICBtb1sxNV0gPSBtWzE1XTtcblxuICAgICAgICByZXR1cm4gbW87XG4gICAgfSxcblxuICAgIHRvTWF0MzNJbnZlcnNlZDogZnVuY3Rpb24gKG1hdDQ0LCBtYXQzMykge1xuICAgICAgICB2YXIgYTAwID0gbWF0NDRbMF0sIGEwMSA9IG1hdDQ0WzFdLCBhMDIgPSBtYXQ0NFsyXTtcbiAgICAgICAgdmFyIGExMCA9IG1hdDQ0WzRdLCBhMTEgPSBtYXQ0NFs1XSwgYTEyID0gbWF0NDRbNl07XG4gICAgICAgIHZhciBhMjAgPSBtYXQ0NFs4XSwgYTIxID0gbWF0NDRbOV0sIGEyMiA9IG1hdDQ0WzEwXTtcblxuICAgICAgICB2YXIgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxO1xuICAgICAgICB2YXIgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcbiAgICAgICAgdmFyIGIyMSA9IGEyMSAqIGExMCAtIGExMSAqIGEyMDtcblxuICAgICAgICB2YXIgZCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcbiAgICAgICAgaWYgKCFkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWQgPSAxIC8gZDtcblxuXG4gICAgICAgIGlmICghbWF0MzMpIHtcbiAgICAgICAgICAgIG1hdDMzID0gTWF0MzMuY3JlYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXQzM1swXSA9IGIwMSAqIGlkO1xuICAgICAgICBtYXQzM1sxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGlkO1xuICAgICAgICBtYXQzM1syXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogaWQ7XG4gICAgICAgIG1hdDMzWzNdID0gYjExICogaWQ7XG4gICAgICAgIG1hdDMzWzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBpZDtcbiAgICAgICAgbWF0MzNbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBpZDtcbiAgICAgICAgbWF0MzNbNl0gPSBiMjEgKiBpZDtcbiAgICAgICAgbWF0MzNbN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBpZDtcbiAgICAgICAgbWF0MzNbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGlkO1xuXG4gICAgICAgIHJldHVybiBtYXQzMztcblxuXG4gICAgfSxcblxuICAgIG11bHRWZWMzOiBmdW5jdGlvbiAobSwgdikge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZbMF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcbiAgICAgICAgdlsxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xuICAgICAgICB2WzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF07XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIG11dGxWZWMzQTogZnVuY3Rpb24gKG0sIGEsIGkpIHtcbiAgICAgICAgaSAqPSAzO1xuXG4gICAgICAgIHZhciB4ID0gYVtpICBdLFxuICAgICAgICAgICAgeSA9IGFbaSArIDFdLFxuICAgICAgICAgICAgeiA9IGFbaSArIDJdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdO1xuICAgICAgICBhW2kgKyAxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdO1xuICAgICAgICBhW2kgKyAyXSA9IG1bIDJdICogeCArIG1bIDZdICogeSArIG1bMTBdICogeiArIG1bMTRdO1xuICAgIH0sXG5cbiAgICBtdWx0VmVjM0FJOiBmdW5jdGlvbiAobSwgYSwgaSkge1xuICAgICAgICB2YXIgeCA9IGFbaSAgXSxcbiAgICAgICAgICAgIHkgPSBhW2kgKyAxXSxcbiAgICAgICAgICAgIHogPSBhW2kgKyAyXTtcblxuICAgICAgICBhW2kgIF0gPSBtWyAwXSAqIHggKyBtWyA0XSAqIHkgKyBtWyA4XSAqIHogKyBtWzEyXTtcbiAgICAgICAgYVtpICsgMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXTtcbiAgICAgICAgYVtpICsgMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcbiAgICB9LFxuXG4gICAgbXVsdFZlYzQ6IGZ1bmN0aW9uIChtLCB2KSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl0sXG4gICAgICAgICAgICB3ID0gdlszXTtcblxuICAgICAgICB2WzBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgICAgICB2WzFdID0gbVsgMV0gKiB4ICsgbVsgNV0gKiB5ICsgbVsgOV0gKiB6ICsgbVsxM10gKiB3O1xuICAgICAgICB2WzJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICB2WzNdID0gbVsgM10gKiB4ICsgbVsgN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuXG4gICAgICAgIHJldHVybiB2O1xuXG5cbiAgICB9LFxuXG4gICAgbXVsdFZlYzRBOiBmdW5jdGlvbiAobSwgYSwgaSkge1xuICAgICAgICBpICo9IDM7XG5cbiAgICAgICAgdmFyIHggPSBhW2kgIF0sXG4gICAgICAgICAgICB5ID0gYVtpICsgMV0sXG4gICAgICAgICAgICB6ID0gYVtpICsgMl0sXG4gICAgICAgICAgICB3ID0gYVtpICsgM107XG5cbiAgICAgICAgYVtpICBdID0gbVsgMF0gKiB4ICsgbVsgNF0gKiB5ICsgbVsgOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgICAgICBhW2kgKyAxXSA9IG1bIDFdICogeCArIG1bIDVdICogeSArIG1bIDldICogeiArIG1bMTNdICogdztcbiAgICAgICAgYVtpICsgMl0gPSBtWyAyXSAqIHggKyBtWyA2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XSAqIHc7XG4gICAgICAgIGFbaSArIDNdID0gbVsgM10gKiB4ICsgbVsgN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuXG4gICAgfSxcblxuICAgIG11bHRWZWM0QUk6IGZ1bmN0aW9uIChtLCBhLCBpKSB7XG4gICAgICAgIHZhciB4ID0gYVtpICBdLFxuICAgICAgICAgICAgeSA9IGFbaSArIDFdLFxuICAgICAgICAgICAgeiA9IGFbaSArIDJdLFxuICAgICAgICAgICAgdyA9IGFbaSArIDNdO1xuXG4gICAgICAgIGFbaSAgXSA9IG1bIDBdICogeCArIG1bIDRdICogeSArIG1bIDhdICogeiArIG1bMTJdICogdztcbiAgICAgICAgYVtpICsgMV0gPSBtWyAxXSAqIHggKyBtWyA1XSAqIHkgKyBtWyA5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgICAgIGFbaSArIDJdID0gbVsgMl0gKiB4ICsgbVsgNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgICAgICBhW2kgKyAzXSA9IG1bIDNdICogeCArIG1bIDddICogeSArIG1bMTFdICogeiArIG1bMTVdICogdztcblxuICAgIH0sXG5cbiAgICBpc0Zsb2F0RXF1YWw6IGZ1bmN0aW9uIChtMCwgbTEpIHtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IDE2KSB7XG4gICAgICAgICAgICBpZiAoIV9NYXRoLmlzRmxvYXRFcXVhbChtMFtpXSwgbTFbaV0pKXJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuICdbJyArIG1bIDBdICsgJywgJyArIG1bIDFdICsgJywgJyArIG1bIDJdICsgJywgJyArIG1bIDNdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDRdICsgJywgJyArIG1bIDVdICsgJywgJyArIG1bIDZdICsgJywgJyArIG1bIDddICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bIDhdICsgJywgJyArIG1bIDldICsgJywgJyArIG1bMTBdICsgJywgJyArIG1bMTFdICsgJyxcXG4nICtcbiAgICAgICAgICAgICcgJyArIG1bMTJdICsgJywgJyArIG1bMTNdICsgJywgJyArIG1bMTRdICsgJywgJyArIG1bMTVdICsgJ10nO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NDQ7IiwidmFyIFZlYzIgPVxue1xuICAgIFNJWkUgOiAyLFxuXG4gICAgY3JlYXRlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsMF0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMjsiLCJ2YXIgVmVjMiA9IHJlcXVpcmUoJy4vVmVjMicpO1xuXG52YXIgVmVjMyA9IHtcbiAgICBTSVpFOiAzLFxuICAgIFpFUk86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsIDAsIDBdKVxuICAgIH0sXG4gICAgT05FOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAxLCAxXSk7XG4gICAgfSxcblxuICAgIEFYSVNfWDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMF0pXG4gICAgfSxcbiAgICBBWElTX1k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoWzAsIDEsIDBdKVxuICAgIH0sXG4gICAgQVhJU19aOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAxXSlcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgICAgICAgdHlwZW9mIHggIT09ICd1bmRlZmluZWQnID8geCA6IDAuMCxcbiAgICAgICAgICAgICAgICB0eXBlb2YgeSAhPT0gJ3VuZGVmaW5lZCcgPyB5IDogMC4wLFxuICAgICAgICAgICAgICAgIHR5cGVvZiB6ICE9PSAndW5kZWZpbmVkJyA/IHogOiAwLjAgIF0pO1xuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgdjBbMF0gPSB2MVswXTtcbiAgICAgICAgdjBbMV0gPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNldDNmOiBmdW5jdGlvbiAodiwgeCwgeSwgeikge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBjb3B5OiBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcbiAgICB9LFxuXG4gICAgYWRkOiBmdW5jdGlvbiAodjAsIHYxKSB7XG4gICAgICAgIHYwWzBdICs9IHYxWzBdO1xuICAgICAgICB2MFsxXSArPSB2MVsxXTtcbiAgICAgICAgdjBbMl0gKz0gdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzdWI6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgdjBbMF0gLT0gdjFbMF07XG4gICAgICAgIHYwWzFdIC09IHYxWzFdO1xuICAgICAgICB2MFsyXSAtPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHNjYWxlOiBmdW5jdGlvbiAodiwgbikge1xuICAgICAgICB2WzBdICo9IG47XG4gICAgICAgIHZbMV0gKj0gbjtcbiAgICAgICAgdlsyXSAqPSBuO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBkb3Q6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMF0gKyB2MFsxXSAqIHYxWzFdICsgdjBbMl0gKiB2MVsyXTtcbiAgICB9LFxuXG4gICAgY3Jvc3M6IGZ1bmN0aW9uICh2MCwgdjEsIHZvKSB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl0sXG4gICAgICAgICAgICB4MSA9IHYxWzBdLFxuICAgICAgICAgICAgeTEgPSB2MVsxXSxcbiAgICAgICAgICAgIHoxID0gdjFbMl07XG5cbiAgICAgICAgdm8gPSB2byB8fCB0aGlzLm1ha2UoKTtcblxuICAgICAgICB2b1swXSA9IHkwICogejEgLSB5MSAqIHowO1xuICAgICAgICB2b1sxXSA9IHowICogeDEgLSB6MSAqIHgwO1xuICAgICAgICB2b1syXSA9IHgwICogeTEgLSB4MSAqIHkwO1xuXG5cbiAgICAgICAgcmV0dXJuIHZvO1xuICAgIH0sXG5cbiAgICBsZXJwOiBmdW5jdGlvbiAodjAsIHYxLCBmKSB7XG4gICAgICAgIHZhciB4MCA9IHYwWzBdLFxuICAgICAgICAgICAgeTAgPSB2MFsxXSxcbiAgICAgICAgICAgIHowID0gdjBbMl07XG5cbiAgICAgICAgdjBbMF0gPSB4MCAqICgxLjAgLSBmKSArIHYxWzBdICogZjtcbiAgICAgICAgdjBbMV0gPSB5MCAqICgxLjAgLSBmKSArIHYxWzFdICogZjtcbiAgICAgICAgdjBbMl0gPSB6MCAqICgxLjAgLSBmKSArIHYxWzJdICogZjtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIGxlcnBlZDogZnVuY3Rpb24gKHYwLCB2MSwgZiwgdm8pIHtcbiAgICAgICAgdm8gPSB2byB8fCB2by5jcmVhdGUoKTtcblxuICAgICAgICB2b1swXSA9IHYwWzBdO1xuICAgICAgICB2b1sxXSA9IHYwWzFdO1xuICAgICAgICB2b1syXSA9IHYwWzJdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxlcnAodm8sIHYxLCBmKTtcbiAgICB9LFxuXG5cbiAgICBsZXJwM2Y6IGZ1bmN0aW9uICh2LCB4LCB5LCB6LCBmKSB7XG4gICAgICAgIHZhciB2eCA9IHZbMF0sXG4gICAgICAgICAgICB2eSA9IHZbMV0sXG4gICAgICAgICAgICB2eiA9IHZbMl07XG5cbiAgICAgICAgdlswXSA9IHZ4ICogKDEuMCAtIGYpICsgeCAqIGY7XG4gICAgICAgIHZbMV0gPSB2eSAqICgxLjAgLSBmKSArIHkgKiBmO1xuICAgICAgICB2WzJdID0gdnogKiAoMS4wIC0gZikgKyB6ICogZjtcbiAgICB9LFxuXG4gICAgbGVycGVkM2Y6IGZ1bmN0aW9uICh2LCB4LCB5LCB6LCBmLCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZvWzBdID0gdlswXTtcbiAgICAgICAgdm9bMV0gPSB2WzFdO1xuICAgICAgICB2b1syXSA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGVycDNmKHZvLCB4LCB5LCB6LCBmKTtcbiAgICB9LFxuXG5cbiAgICBsZW5ndGg6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICAgIH0sXG5cbiAgICBsZW5ndGhTcTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXTtcblxuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6O1xuICAgIH0sXG5cbiAgICBzYWZlTm9ybWFsaXplOiBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgICAgIGQgPSBkIHx8IDE7XG5cbiAgICAgICAgdmFyIGwgPSAxIC8gZDtcblxuICAgICAgICB2WzBdICo9IGw7XG4gICAgICAgIHZbMV0gKj0gbDtcbiAgICAgICAgdlsyXSAqPSBsO1xuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGwgPSAxIC8gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG5cbiAgICAgICAgdlswXSAqPSBsO1xuICAgICAgICB2WzFdICo9IGw7XG4gICAgICAgIHZbMl0gKj0gbDtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2U6IGZ1bmN0aW9uICh2MCwgdjEpIHtcbiAgICAgICAgdmFyIHggPSB2MFswXSAtIHYxWzBdLFxuICAgICAgICAgICAgeSA9IHYwWzFdIC0gdjFbMV0sXG4gICAgICAgICAgICB6ID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlM2Y6IGZ1bmN0aW9uICh2LCB4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHggKyB2WzFdICogeSArIHZbMl0gKiB6KTtcbiAgICB9LFxuXG4gICAgZGlzdGFuY2VTcTogZnVuY3Rpb24gKHYwLCB2MSkge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHo7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlU3EzZjogZnVuY3Rpb24gKHYsIHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuIHZbMF0gKiB4ICsgdlsxXSAqIHkgKyB2WzJdICogejtcbiAgICB9LFxuXG4gICAgbGltaXQ6IGZ1bmN0aW9uICh2LCBuKSB7XG4gICAgICAgIHZhciB4ID0gdlswXSxcbiAgICAgICAgICAgIHkgPSB2WzFdLFxuICAgICAgICAgICAgeiA9IHZbMl07XG5cbiAgICAgICAgdmFyIGRzcSA9IHggKiB4ICsgeSAqIHkgKyB6ICogeixcbiAgICAgICAgICAgIGxzcSA9IG4gKiBuO1xuXG4gICAgICAgIGlmICgoZHNxID4gbHNxKSAmJiBsc3EgPiAwKSB7XG4gICAgICAgICAgICB2YXIgbmQgPSBuIC8gTWF0aC5zcXJ0KGRzcSk7XG5cbiAgICAgICAgICAgIHZbMF0gKj0gbmQ7XG4gICAgICAgICAgICB2WzFdICo9IG5kO1xuICAgICAgICAgICAgdlsyXSAqPSBuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2O1xuICAgIH0sXG5cbiAgICBpbnZlcnQ6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZbMF0gKj0gLTE7XG4gICAgICAgIHZbMV0gKj0gLTE7XG4gICAgICAgIHZbMl0gKj0gLTE7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGFkZGVkOiBmdW5jdGlvbiAodjAsIHYxLCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMubWFrZSgpO1xuXG4gICAgICAgIHZvWzBdID0gdjBbMF0gKyB2MVswXTtcbiAgICAgICAgdm9bMV0gPSB2MFsxXSArIHYxWzFdO1xuICAgICAgICB2b1syXSA9IHYwWzJdICsgdjFbMl07XG5cbiAgICAgICAgcmV0dXJuIHZvO1xuICAgIH0sXG5cbiAgICBzdWJiZWQ6IGZ1bmN0aW9uICh2MCwgdjEsIHZvKSB7XG4gICAgICAgIHZvID0gdm8gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdm9bMF0gPSB2MFswXSAtIHYxWzBdO1xuICAgICAgICB2b1sxXSA9IHYwWzFdIC0gdjFbMV07XG4gICAgICAgIHZvWzJdID0gdjBbMl0gLSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gdm87XG4gICAgfSxcblxuICAgIHNjYWxlZDogZnVuY3Rpb24gKHYsIG4sIHZvKSB7XG4gICAgICAgIHZvID0gdm8gfHwgdGhpcy5tYWtlKCk7XG5cbiAgICAgICAgdm9bMF0gPSB2WzBdICogbjtcbiAgICAgICAgdm9bMV0gPSB2WzFdICogbjtcbiAgICAgICAgdm9bMl0gPSB2WzJdICogbjtcblxuICAgICAgICByZXR1cm4gdm87XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWQ6IGZ1bmN0aW9uICh2LCB2bykge1xuICAgICAgICB2byA9IHZvIHx8IHRoaXMuY3JlYXRlKCk7XG5cbiAgICAgICAgdm9bMF0gPSB2WzBdO1xuICAgICAgICB2b1sxXSA9IHZbMV07XG4gICAgICAgIHZvWzJdID0gdlsyXTtcblxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUodm8pO1xuICAgIH0sXG5cbiAgICBzYWZlTm9ybWFsaXplZDogZnVuY3Rpb24gKHYsIHZvKSB7XG4gICAgICAgIHZvID0gdm8gfHwgdGhpcy5jcmVhdGUoKTtcblxuICAgICAgICB2b1swXSA9IHZbMF07XG4gICAgICAgIHZvWzFdID0gdlsxXTtcbiAgICAgICAgdm9bMl0gPSB2WzJdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNhZmVOb3JtYWxpemUodm8pO1xuICAgIH0sXG5cbiAgICByYW5kb206IGZ1bmN0aW9uICh1bml0WCwgdW5pdFksIHVuaXRaKSB7XG4gICAgICAgIHVuaXRYID0gdHlwZW9mIHVuaXRYICE9PSAndW5kZWZpbmVkJyA/IHVuaXRYIDogMS4wO1xuICAgICAgICB1bml0WSA9IHR5cGVvZiB1bml0WSAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0WSA6IDEuMDtcbiAgICAgICAgdW5pdFogPSB0eXBlb2YgdW5pdFogIT09ICd1bmRlZmluZWQnID8gdW5pdFogOiAxLjA7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCgtMC41ICsgTWF0aC5yYW5kb20oKSkgKiAyICogdW5pdFgsXG4gICAgICAgICAgICAgICAgKC0wLjUgKyBNYXRoLnJhbmRvbSgpKSAqIDIgKiB1bml0WSxcbiAgICAgICAgICAgICAgICAoLTAuNSArIE1hdGgucmFuZG9tKCkpICogMiAqIHVuaXRaKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiAnWycgKyB2WzBdICsgJywnICsgdlsxXSArICcsJyArIHZbMl0gKyAnXSc7XG4gICAgfSxcblxuICAgIHh5OiBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gVmVjMi5jcmVhdGUodlswXSwgdlsxXSk7XG4gICAgfSxcblxuICAgIHh6OiBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gVmVjMi5jcmVhdGUodlswXSwgdlsyXSk7XG4gICAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzM7XG5cblxuXG4iLCJcbi8vVE9ETzpGSU5JU0hcbnZhciBWZWM0ID1cbntcbiAgICBTSVpFIDogNCxcbiAgICBaRVJPIDogZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwwLDAsMS4wXSl9LFxuXG4gICAgbWFrZSA6IGZ1bmN0aW9uKHgseSx6LHcpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHggfHwgMC4wLFxuICAgICAgICAgICAgeSB8fCAwLjAsXG4gICAgICAgICAgICB6IHx8IDAuMCxcbiAgICAgICAgICAgIHcgfHwgMS4wXSk7XG4gICAgfSxcblxuICAgIGZyb21WZWMzIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsgdlswXSwgdlsxXSwgdlsyXSAsIDEuMF0pO1xuICAgIH0sXG5cbiAgICBzZXQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHYwWzBdID0gdjFbMF07XG4gICAgICAgIHYwWzFdID0gdjFbMV07XG4gICAgICAgIHYwWzJdID0gdjFbMl07XG4gICAgICAgIHYwWzNdID0gdjFbM107XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzZXQzZiA6ICBmdW5jdGlvbih2LHgseSx6KVxuICAgIHtcbiAgICAgICAgdlswXSA9IHg7XG4gICAgICAgIHZbMV0gPSB5O1xuICAgICAgICB2WzJdID0gejtcblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgc2V0NGYgOiBmdW5jdGlvbih2LHgseSx6LHcpXG4gICAge1xuICAgICAgICB2WzBdID0geDtcbiAgICAgICAgdlsxXSA9IHk7XG4gICAgICAgIHZbMl0gPSB6O1xuICAgICAgICB2WzNdID0gdztcblxuICAgICAgICByZXR1cm4gdjtcblxuICAgIH0sXG5cbiAgICBjb3B5IDogIGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSh2KTtcbiAgICB9LFxuXG4gICAgYWRkIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2MFswXSArPSB2MVswXTtcbiAgICAgICAgdjBbMV0gKz0gdjFbMV07XG4gICAgICAgIHYwWzJdICs9IHYxWzJdO1xuICAgICAgICB2MFszXSArPSB2MVszXTtcblxuICAgICAgICByZXR1cm4gdjA7XG4gICAgfSxcblxuICAgIHN1YiA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdjBbMF0gLT0gdjFbMF07XG4gICAgICAgIHYwWzFdIC09IHYxWzFdO1xuICAgICAgICB2MFsyXSAtPSB2MVsyXTtcbiAgICAgICAgdjBbM10gLT0gdjFbM107XG5cbiAgICAgICAgcmV0dXJuIHYwO1xuICAgIH0sXG5cbiAgICBzY2FsZSA6IGZ1bmN0aW9uKHYsbilcbiAgICB7XG4gICAgICAgIHZbMF0qPW47XG4gICAgICAgIHZbMV0qPW47XG4gICAgICAgIHZbMl0qPW47XG4gICAgICAgIHZbM10qPW47XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGRvdCA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHYwWzBdKnYxWzBdICsgdjBbMV0qdjFbMV0gKyB2MFsyXSp2MVsyXTtcbiAgICB9LFxuXG4gICAgY3Jvc3M6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgdmFyIHgwID0gdjBbMF0sXG4gICAgICAgICAgICB5MCA9IHYwWzFdLFxuICAgICAgICAgICAgejAgPSB2MFsyXSxcbiAgICAgICAgICAgIHgxID0gdjFbMF0sXG4gICAgICAgICAgICB5MSA9IHYxWzFdLFxuICAgICAgICAgICAgejEgPSB2MVsyXTtcblxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbeTAqejEteTEqejAsejAqeDEtejEqeDAseDAqeTEteDEqeTBdKTtcbiAgICB9LFxuXG4gICAgc2xlcnAgOiBmdW5jdGlvbih2MCx2MSxmKVxuICAgIHtcbiAgICAgICAgdmFyIHgwID0gdjBbMF0sXG4gICAgICAgICAgICB5MCA9IHYwWzFdLFxuICAgICAgICAgICAgejAgPSB2MFsyXSxcbiAgICAgICAgICAgIHgxID0gdjFbMF0sXG4gICAgICAgICAgICB5MSA9IHYxWzFdLFxuICAgICAgICAgICAgejEgPSB2MVsyXTtcblxuICAgICAgICB2YXIgZCA9IE1hdGgubWF4KC0xLjAsTWF0aC5taW4oKHgwKngxICsgeTAqeTEgKyB6MCp6MSksMS4wKSksXG4gICAgICAgICAgICB0ID0gTWF0aC5hY29zKGQpICogZjtcblxuICAgICAgICB2YXIgeCA9IHgwIC0gKHgxICogZCksXG4gICAgICAgICAgICB5ID0geTAgLSAoeTEgKiBkKSxcbiAgICAgICAgICAgIHogPSB6MCAtICh6MSAqIGQpO1xuXG4gICAgICAgIHZhciBsID0gMS9NYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuXG4gICAgICAgIHgqPWw7XG4gICAgICAgIHkqPWw7XG4gICAgICAgIHoqPWw7XG5cbiAgICAgICAgdmFyIGN0ID0gTWF0aC5jb3ModCksXG4gICAgICAgICAgICBzdCA9IE1hdGguc2luKHQpO1xuXG4gICAgICAgIHZhciB4byA9IHgwICogY3QgKyB4ICogc3QsXG4gICAgICAgICAgICB5byA9IHkwICogY3QgKyB5ICogc3QsXG4gICAgICAgICAgICB6byA9IHowICogY3QgKyB6ICogc3Q7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3hvLHlvLHpvXSk7XG4gICAgfSxcblxuICAgIGxlbmd0aCA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4KngreSp5K3oqeit3KncpO1xuICAgIH0sXG5cbiAgICBsZW5ndGhTcSA6ICBmdW5jdGlvbih2KVxuICAgIHtcbiAgICAgICAgdmFyIHggPSB2WzBdLFxuICAgICAgICAgICAgeSA9IHZbMV0sXG4gICAgICAgICAgICB6ID0gdlsyXSxcbiAgICAgICAgICAgIHcgPSB2WzNdO1xuXG4gICAgICAgIHJldHVybiB4KngreSp5K3oqeit3Knc7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdLFxuICAgICAgICAgICAgdyA9IHZbM107XG5cbiAgICAgICAgdmFyIGwgID0gMS9NYXRoLnNxcnQoeCp4K3kqeSt6Knordyp3KTtcblxuICAgICAgICB2WzBdICo9IGw7XG4gICAgICAgIHZbMV0gKj0gbDtcbiAgICAgICAgdlsyXSAqPSBsO1xuICAgICAgICB2WzNdICo9IGw7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGRpc3RhbmNlIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCp4K3kqeSt6KnopO1xuICAgIH0sXG5cbiAgICBkaXN0YW5jZVNxIDogZnVuY3Rpb24odjAsdjEpXG4gICAge1xuICAgICAgICB2YXIgeCA9IHYwWzBdIC0gdjFbMF0sXG4gICAgICAgICAgICB5ID0gdjBbMV0gLSB2MVsxXSxcbiAgICAgICAgICAgIHogPSB2MFsyXSAtIHYxWzJdO1xuXG4gICAgICAgIHJldHVybiB4KngreSp5K3oqejtcbiAgICB9LFxuXG4gICAgbGltaXQgOiBmdW5jdGlvbih2LG4pXG4gICAge1xuICAgICAgICB2YXIgeCA9IHZbMF0sXG4gICAgICAgICAgICB5ID0gdlsxXSxcbiAgICAgICAgICAgIHogPSB2WzJdO1xuXG4gICAgICAgIHZhciBkc3EgPSB4KnggKyB5KnkgKyB6KnosXG4gICAgICAgICAgICBsc3EgPSBuICogbjtcblxuICAgICAgICBpZigoZHNxID4gbHNxKSAmJiBsc3EgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbmQgPSBuL01hdGguc3FydChkc3EpO1xuXG4gICAgICAgICAgICB2WzBdICo9IG5kO1xuICAgICAgICAgICAgdlsxXSAqPSBuZDtcbiAgICAgICAgICAgIHZbMl0gKj0gbmQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdjtcbiAgICB9LFxuXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHZbMF0qPS0xO1xuICAgICAgICB2WzFdKj0tMTtcbiAgICAgICAgdlsyXSo9LTE7XG5cbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSxcblxuICAgIGFkZGVkICA6IGZ1bmN0aW9uKHYwLHYxKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkKHRoaXMuY29weSh2MCksdjEpO1xuICAgIH0sXG5cbiAgICBzdWJiZWQgOiBmdW5jdGlvbih2MCx2MSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1Yih0aGlzLmNvcHkodjApLHYxKTtcbiAgICB9LFxuXG4gICAgc2NhbGVkIDogZnVuY3Rpb24odixuKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUodGhpcy5jb3B5KHYpLG4pO1xuICAgIH0sXG5cbiAgICBub3JtYWxpemVkIDogZnVuY3Rpb24odilcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSh0aGlzLmNvcHkodikpO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZyA6IGZ1bmN0aW9uKHYpXG4gICAge1xuICAgICAgICByZXR1cm4gJ1snICsgdlswXSArICcsJyArIHZbMV0gKyAnLCcgKyB2WzJdICsgJ10nO1xuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZWM0OyIsIm1vZHVsZS5leHBvcnRzID1cbntcbiAgICBBUFBfV0lEVEggIDogODAwLFxuICAgIEFQUF9IRUlHSFQgOiA2MDAsXG5cbiAgICBBUFBfRlBTIDogMzAsXG5cbiAgICBBUFBfUExBU0tfV0lORE9XX1RJVExFIDogJycsXG4gICAgQVBQX1BMQVNLX1RZUEUgIDogJzNkJyxcbiAgICBBUFBfUExBU0tfVlNZTkMgOiAnZmFsc2UnLFxuICAgIEFQUF9QTEFTS19NVUxUSVNBTVBMRSA6IHRydWUsXG5cbiAgICBDQU1FUkFfRk9WIDogNDUsXG4gICAgQ0FNRVJBX05FQVIgOiAwLjEsXG4gICAgQ0FNRVJBX0ZBUiAgOiAxMDBcblxufTsiLCJtb2R1bGUuZXhwb3J0cyA9XG57XG4gICAgTUVUSE9EX05PVF9JTVBMRU1FTlRFRDogJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQgaW4gdGFyZ2V0IHBsYXRmb3JtLicsXG4gICAgQ0xBU1NfSVNfU0lOR0xFVE9OOiAgICAgJ0FwcCBpcyBzaW5nbGV0b24uIEdldCB2aWEgZ2V0SW5zdGFuY2UoKS4nLFxuICAgIEFQUF9OT19TRVRVUDogICAgICAgICAgICdObyBzZXR1cCBtZXRob2QgYWRkZWQgdG8gYXBwLicsXG4gICAgQVBQX05PX1VQREFURSA6ICAgICAgICAgJ05vIHVwZGF0ZSBtZXRob2QgYWRkZWQgdG8gYXBwLicsXG4gICAgUExBU0tfV0lORE9XX1NJWkVfU0VUOiAgJ1BsYXNrIHdpbmRvdyBzaXplIGNhbiBvbmx5IGJlIHNldCBvbiBzdGFydHVwLicsXG4gICAgV1JPTkdfUExBVEZPUk06ICAgICAgICAgJ1dyb25nIFBsYXRmb3JtLicsXG4gICAgTUFUUklYX1NUQUNLX1BPUF9FUlJPUjogJ01hdHJpeCBzdGFjayBpbnZhbGlkIHBvcC4nLFxuICAgIFZFUlRJQ0VTX0lOX1dST05HX1NJWkU6ICdWZXJ0aWNlcyBhcnJheSBoYXMgd3JvbmcgbGVuZ3RoLiBTaG91bGQgYmUgJyxcbiAgICBDT0xPUlNfSU5fV1JPTkdfU0laRTogICAnQ29sb3IgYXJyYXkgbGVuZ3RoIG5vdCBlcXVhbCB0byBudW1iZXIgb2YgdmVydGljZXMuJyxcbiAgICBESVJFQ1RPUllfRE9FU05UX0VYSVNUOiAnRmlsZSB0YXJnZXQgZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0LicsXG4gICAgRklMRV9ET0VTTlRfRVhJU1Q6ICAgICAgJ0ZpbGUgZG9lcyBub3QgZXhpc3QuJyxcbiAgICBURVhUVVJFX1dJRFRIX05PVF9QMjogICAnVGV4dHVyZSBpbWFnZURhdGEgaXMgbm90IHBvd2VyIG9mIDIuJyxcbiAgICBURVhUVVJFX0hFSUdIVF9OT1RfUDI6ICAnVGV4dHVyZSBpbWFnZURhdGEgaXMgbm90IHBvd2VyIG9mIDIuJyxcbiAgICBURVhUVVJFX0lNQUdFX0RBVEFfTlVMTDonVGV4dHVyZSBpbWFnZURhdGEgaXMgbnVsbC4nXG59OyIsInZhciBQbGF0Zm9ybSA9IHtXRUI6J1dFQicsUExBU0s6J1BMQVNLJyxOT0RFX1dFQktJVDonTk9ERV9XRUJLSVQnfTtcbiAgICBQbGF0Zm9ybS5fX3RhcmdldCA9IG51bGw7XG5cblBsYXRmb3JtLmdldFRhcmdldCAgPSBmdW5jdGlvbigpXG57XG5cbiAgICBpZighdGhpcy5fX3RhcmdldClcbiAgICB7XG4gICAgICAgIHZhciBiV2luZG93ICAgICA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnLFxuICAgICAgICAgICAgYkRvY3VtZW50ICAgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnLFxuICAgICAgICAgICAgYlJlcXVpcmVGICAgPSB0eXBlb2YgcmVxdWlyZSA9PSAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgYlJlcXVpcmUgICAgPSAhIXJlcXVpcmUsXG4gICAgICAgICAgICBiTm9kZVdlYmtpdCA9IGZhbHNlO1xuXG4gICAgICAgIC8vVE9ETyBmaXhcbiAgICAgICAgLy9obSB0aGlzIG5lZWRzIHRvIGJlIGZpeGVkIC0+IGJyb3dzZXJpZnkgcmVxdWlyZSB2cyBub2RlLXdlYmtpdCByZXF1aXJlXG4gICAgICAgIC8vZm9yIG5vdyB0aGlzIGRvZXMgdGhlIGpvYlxuICAgICAgICBpZihiRG9jdW1lbnQpe1xuICAgICAgICAgICAgYk5vZGVXZWJraXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJRlJBTUUnKS5oYXNPd25Qcm9wZXJ0eSgnbndkaXNhYmxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fdGFyZ2V0ID0gKGJXaW5kb3cgJiYgYkRvY3VtZW50ICYmICFiTm9kZVdlYmtpdCkgPyB0aGlzLldFQiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAoYldpbmRvdyAmJiBiRG9jdW1lbnQgJiYgIGJOb2RlV2Via2l0KSA/IHRoaXMuTk9ERV9XRUJLSVQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgKCFiV2luZG93ICYmICFiRG9jdW1lbnQgJiYgYlJlcXVpcmVGICYmIGJSZXF1aXJlKSA/IHRoaXMuUExBU0sgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbDtcblxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fdGFyZ2V0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF0Zm9ybTsiLCJ2YXIgZk1hdGggPSByZXF1aXJlKCcuLi9tYXRoL01hdGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgU0laRTogNCxcblxuICAgIEJMQUNLOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxXSlcbiAgICB9LFxuICAgIFdISVRFOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFsxLCAxLCAxLCAxXSlcbiAgICB9LFxuICAgIFJFRDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMSwgMCwgMCwgMV0pXG4gICAgfSxcbiAgICBHUkVFTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbMCwgMSwgMCwgMV0pXG4gICAgfSxcbiAgICBCTFVFOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAxLCAxXSlcbiAgICB9LFxuXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAociwgZywgYiwgYSkge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbIHIsIGcsIGIsIGFdKTtcbiAgICB9LFxuICAgIGNvcHk6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTtcbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbiAoYzAsIGMxKSB7XG4gICAgICAgIGMwWzBdID0gYzFbMF07XG4gICAgICAgIGMwWzFdID0gYzFbMV07XG4gICAgICAgIGMwWzJdID0gYzFbMl07XG4gICAgICAgIGMwWzNdID0gYzFbM107XG5cbiAgICAgICAgcmV0dXJuIGMwO1xuICAgIH0sXG5cbiAgICBzZXQ0ZjogZnVuY3Rpb24gKGMsIHIsIGcsIGIsIGEpIHtcbiAgICAgICAgY1swXSA9IHI7XG4gICAgICAgIGNbMV0gPSBnO1xuICAgICAgICBjWzJdID0gYjtcbiAgICAgICAgY1szXSA9IGE7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDNmOiBmdW5jdGlvbiAoYywgciwgZywgYikge1xuICAgICAgICBjWzBdID0gcjtcbiAgICAgICAgY1sxXSA9IGc7XG4gICAgICAgIGNbMl0gPSBiO1xuICAgICAgICBjWzNdID0gMS4wO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBzZXQyZjogZnVuY3Rpb24gKGMsIGssIGEpIHtcbiAgICAgICAgY1swXSA9IGNbMV0gPSBjWzJdID0gaztcbiAgICAgICAgY1szXSA9IGE7XG5cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIHNldDFmOiBmdW5jdGlvbiAoYywgaykge1xuICAgICAgICBjWzBdID0gY1sxXSA9IGNbMl0gPSBrO1xuICAgICAgICBjWzNdID0gMS4wO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBzZXQ0aTogZnVuY3Rpb24gKGMsIHIsIGcsIGIsIGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0NGYoYywgciAvIDI1NS4wLCBnIC8gMjU1LjAsIGIgLyAyNTUuMCwgYSk7XG4gICAgfSxcbiAgICBzZXQzaTogZnVuY3Rpb24gKGMsIHIsIGcsIGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0M2YoYywgciAvIDI1NS4wLCBnIC8gMjU1LjAsIGIgLyAyNTUuMCk7XG4gICAgfSxcbiAgICBzZXQyaTogZnVuY3Rpb24gKGMsIGssIGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0MmYoYywgayAvIDI1NS4wLCBhKTtcbiAgICB9LFxuICAgIHNldDFpOiBmdW5jdGlvbiAoYywgaykge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQxZihjLCBrIC8gMjU1LjApO1xuICAgIH0sXG4gICAgdG9BcnJheTogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIGMudG9BcnJheSgpO1xuICAgIH0sXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiAnWycgKyBjWzBdICsgJywnICsgY1sxXSArICcsJyArIGNbMl0gKyAnLCcgKyBjWzNdICsgJ10nO1xuICAgIH0sXG5cbiAgICBpbnRlcnBvbGF0ZWQ6IGZ1bmN0aW9uIChjMCwgYzEsIGYpIHtcbiAgICAgICAgdmFyIGMgPSBuZXcgRmxvYXQzMkFycmF5KDQpLFxuICAgICAgICAgICAgZmkgPSAxLjAgLSBmO1xuXG4gICAgICAgIGNbMF0gPSBjMFswXSAqIGZpICsgYzFbMF0gKiBmO1xuICAgICAgICBjWzFdID0gYzBbMV0gKiBmaSArIGMxWzFdICogZjtcbiAgICAgICAgY1syXSA9IGMwWzJdICogZmkgKyBjMVsyXSAqIGY7XG4gICAgICAgIGNbM10gPSBjMFszXSAqIGZpICsgYzFbM10gKiBmO1xuXG4gICAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICBlcXVhbHM6IGZ1bmN0aW9uIChjMCwgYzEpIHtcbiAgICAgICAgcmV0dXJuIF9NYXRoLmlzRmxvYXRFcXVhbChjMFswXSwgYzFbMF0pICYmXG4gICAgICAgICAgICBfTWF0aC5pc0Zsb2F0RXF1YWwoYzBbMV0sIGMxWzFdKSAmJlxuICAgICAgICAgICAgX01hdGguaXNGbG9hdEVxdWFsKGMwWzJdLCBjMVsyXSkgJiZcbiAgICAgICAgICAgIF9NYXRoLmlzRmxvYXRFcXVhbChjMFszXSwgYzFbM10pO1xuICAgIH0sXG5cbiAgICBtYWtlQ29sb3JBcnJheWY6IGZ1bmN0aW9uIChyLCBnLCBiLCBhLCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyciA9IG5ldyBGbG9hdDMyQXJyYXkobGVuZ3RoICogNCksIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFycltpICsgMF0gPSByO1xuICAgICAgICAgICAgYXJyW2kgKyAxXSA9IGc7XG4gICAgICAgICAgICBhcnJbaSArIDJdID0gYjtcbiAgICAgICAgICAgIGFycltpICsgM10gPSBhO1xuICAgICAgICAgICAgaSArPSA0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfSxcblxuICAgIG1ha2VDb2xvckFycmF5OiBmdW5jdGlvbiAoY29sb3IsIGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYWtlQ29sb3JBcnJheWYoY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGxlbmd0aCk7XG4gICAgfVxufTsiLCJ2YXIgX0Vycm9yID0gcmVxdWlyZSgnLi4vc3lzdGVtL2NvbW1vbi9FcnJvcicpLFxuICAgIFZlYzIgPSByZXF1aXJlKCcuLi9tYXRoL1ZlYzInKTtcblxuZnVuY3Rpb24gTW91c2UoKSB7XG4gICAgaWYgKE1vdXNlLl9faW5zdGFuY2UpdGhyb3cgbmV3IEVycm9yKEVycm9yLkNMQVNTX0lTX1NJTkdMRVRPTik7XG5cbiAgICB0aGlzLl9wb3NpdGlvbiA9IFZlYzIuY3JlYXRlKCk7XG4gICAgdGhpcy5fcG9zaXRpb25MYXN0ID0gVmVjMi5jcmVhdGUoKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fc3RhdGVMYXN0ID0gbnVsbDtcbiAgICB0aGlzLl93aGVlbERlbHRhID0gMDtcblxuICAgIE1vdXNlLl9faW5zdGFuY2UgPSB0aGlzO1xufVxuXG5Nb3VzZS5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xufTtcbk1vdXNlLnByb3RvdHlwZS5nZXRQb3NpdGlvbkxhc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uTGFzdDtcbn07XG5Nb3VzZS5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25bMF07XG59O1xuTW91c2UucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uWzFdO1xufTtcbk1vdXNlLnByb3RvdHlwZS5nZXRYTGFzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzBdO1xufTtcbk1vdXNlLnByb3RvdHlwZS5nZXRZTGFzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25MYXN0WzFdO1xufTtcbk1vdXNlLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG59O1xuTW91c2UucHJvdG90eXBlLmdldFN0YXRlTGFzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGVMYXN0O1xufTtcbk1vdXNlLnByb3RvdHlwZS5nZXRXaGVlbERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl93aGVlbERlbHRhO1xufTtcblxuTW91c2UuX19pbnN0YW5jZSA9IG51bGw7XG5Nb3VzZS5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTW91c2UuX19pbnN0YW5jZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW91c2U7IiwidmFyIE9iamVjdFV0aWwgPSB7XG5cbiAgICBpc1VuZGVmaW5lZDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCc7XG4gICAgfSxcblxuICAgIGlzRmxvYXQzMkFycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnIgaW5zdGFuY2VvZiAgRmxvYXQzMkFycmF5O1xuICAgIH0sXG5cbiAgICBzYWZlRmxvYXQzMkFycmF5OiBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnIgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgPyBhcnIgOiBuZXcgRmxvYXQzMkFycmF5KGFycik7XG4gICAgfSxcblxuICAgIHNhZmVVaW50MTZBcnJheTogZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyIGluc3RhbmNlb2YgVWludDE2QXJyYXkgPyBhcnIgOiBuZXcgVWludDE2QXJyYXkoYXJyKTtcbiAgICB9LFxuXG4gICAgY29weUZsb2F0MzJBcnJheTogZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShhcnIpO1xuICAgIH0sXG5cbiAgICBhcnJheVJlc2l6ZWQ6IGZ1bmN0aW9uIChhcnIsIGxlbikge1xuICAgICAgICBhcnIubGVuZ3RoID0gbGVuO1xuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH0sXG5cbiAgICBjb3B5QXJyYXk6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGFyci5sZW5ndGgsIG91dCA9IG5ldyBBcnJheShsKTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGwpIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGFycltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICBzZXRBcnJheTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGEubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoKytpIDwgbCkge1xuICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0QXJyYXlPZmZzZXRJbmRleDogZnVuY3Rpb24gKGFyciwgb2Zmc2V0LCBsZW4pIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGxlbiB8fCBhcnIubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoKytpIDwgbCkge1xuICAgICAgICAgICAgYXJyW2ldICs9IG9mZnNldDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL2NoZWNrIGZvciBjb250ZW50IG5vdCBvYmplY3QgZXF1YWxpdHksIG9iamVjdCBpcyBudW1iZXJcbiAgICBlcXVhbEFyckNvbnRlbnQ6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmICghYSB8fCAhYiB8fCAoIWEgJiYgIWIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGkgPSAtMSwgbCA9IGEubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYVtpXSAhPSBiW2ldKXJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG5cbiAgICBnZXRGdW5jdGlvbkJvZHk6IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgICAgIHJldHVybiAoZnVuYykudG9TdHJpbmcoKS5tYXRjaCgvZnVuY3Rpb25bXntdK1xceyhbXFxzXFxTXSopXFx9JC8pWzFdO1xuICAgIH0sXG5cbiAgICBfX3RvU3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICB9LFxuXG4gICAgaXNBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9LFxuXG4gICAgaXNPYmplY3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iailcbiAgICB9LFxuXG4gICAgaXNGdW5jdGlvbjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9LFxuXG4gICAgaXNTdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhvYmopID09ICdbb2JqZWN0IFN0cmluZ10nO1xuICAgIH0sXG5cblxuICAgIGlzRmxvYXQ2NEFycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIH0sXG5cbiAgICBpc1VpbnQ4QXJyYXk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhvYmopID09ICdbb2JqZWN0IFVpbnQ4QXJyYXldJztcbiAgICB9LFxuXG4gICAgaXNVaW50MTZBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKG9iaikgPT0gJ1tvYmplY3QgVWludDE2QXJyYXldJ1xuICAgIH0sXG5cbiAgICBpc1VpbnQzMkFycmF5OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcob2JqKSA9PSAnW29iamVjdCBVaW50MzJBcnJheV0nXG4gICAgfSxcblxuICAgIGlzVHlwZWRBcnJheTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1VpbnQ4QXJyYXkob2JqKSB8fFxuICAgICAgICAgICAgdGhpcy5pc1VpbnQxNkFycmF5KG9iaikgfHxcbiAgICAgICAgICAgIHRoaXMuaXNVaW50MzJBcnJheShvYmopIHx8XG4gICAgICAgICAgICB0aGlzLmlzRmxvYXQzMkFycmF5KG9iaikgfHxcbiAgICAgICAgICAgIHRoaXMuaXNGbG9hdDMyQXJyYXkob2JqKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGdW5jdGlvbihvYmopID8gdGhpcy5nZXRGdW5jdGlvblN0cmluZyhvYmopIDpcbiAgICAgICAgICAgIHRoaXMuaXNBcnJheShvYmopID8gdGhpcy5nZXRBcnJheVN0cmluZyhvYmopIDpcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3RyaW5nKG9iaikgPyB0aGlzLmdldFN0cmluZyhvYmopIDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1R5cGVkQXJyYXkob2JqKSA/IHRoaXMuZ2V0VHlwZWRBcnJheVN0cmluZyhvYmopIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPYmplY3Qob2JqKSA/IHRoaXMuZ2V0T2JqZWN0U3RyaW5nKG9iaikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iajtcbiAgICB9LFxuXG4gICAgZ2V0VHlwZWRBcnJheVN0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAoIXRoaXMuaXNGbG9hdDMyQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IG11c3QgYmUgb2YgdHlwZSBGbG9hdDMyQXJyYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmouYnl0ZUxlbmd0aCA9PSAwKXJldHVybiAnW10nO1xuICAgICAgICB2YXIgb3V0ID0gJ1snO1xuXG4gICAgICAgIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgICAgICAgICBvdXQgKz0gb2JqW3BdICsgJywnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dC5zdWJzdHIoMCwgb3V0Lmxhc3RJbmRleE9mKCcsJykpICsgJ10nO1xuXG4gICAgfSxcblxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gJ1wiJyArIG9iaiArICdcIic7XG4gICAgfSxcblxuICAgIGdldEFycmF5U3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBtdXN0IGJlIG9mIHR5cGUgYXJyYXkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dCA9ICdbJztcbiAgICAgICAgaWYgKG9iai5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dCArICddJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy50b1N0cmluZyhvYmpbaV0pICsgJywnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dC5zdWJzdHIoMCwgb3V0Lmxhc3RJbmRleE9mKCcsJykpICsgJ10nO1xuICAgIH0sXG5cbiAgICBnZXRPYmplY3RTdHJpbmc6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBtdXN0IGJlIG9mIHR5cGUgb2JqZWN0LicpXG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dCA9ICd7JztcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvdXQgKyAnfSc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICAgICAgb3V0ICs9IHAgKyAnOicgKyB0aGlzLnRvU3RyaW5nKG9ialtwXSkgKyAnLCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0LnN1YnN0cigwLCBvdXQubGFzdEluZGV4T2YoJywnKSkgKyAnfSc7XG4gICAgfSxcblxuICAgIC8vXG4gICAgLy8gIFBhcnNlcyBmdW5jIHRvIHN0cmluZyxcbiAgICAvLyAgbXVzdCBzYXRpc2Z5IChpZiAnY2xhc3MnKTpcbiAgICAvL1xuICAgIC8vICBmdW5jdGlvbiBDbGFzc0IoKXtcbiAgICAvLyAgICAgIENsYXNzQi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7Q2xhc3NCLmNhbGwuLi5cbiAgICAvLyAgfVxuICAgIC8vXG4gICAgLy8gIENsYXNzQi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENsYXNzQS5wcm90b3R5cGUpXG4gICAgLy9cbiAgICAvLyAgQ2xhc3NCLnByb3RvdHlwZS5tZXRob2QgPSBmdW5jdGlvbigpe307XG4gICAgLy9cbiAgICAvLyAgQ2xhc3NCLlNUQVRJQyA9IDE7XG4gICAgLy8gIENsYXNzQi5TVEFUSUNfT0JKID0ge307XG4gICAgLy8gIENsYXNzQi5TVEFUSUNfQVJSID0gW107XG4gICAgLy9cblxuICAgIGdldEZ1bmN0aW9uU3RyaW5nOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBtdXN0IGJlIG9mIHR5cGUgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0ID0gJyc7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBvYmoubmFtZSxcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gb2JqLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBpbmhlcml0ZWQgPSAxICsgY29uc3RydWN0b3IuaW5kZXhPZignLmNhbGwodGhpcycpIHx8IDEgKyBjb25zdHJ1Y3Rvci5pbmRleE9mKCcuYXBwbHkodGhpcycpO1xuXG4gICAgICAgIG91dCArPSBjb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAoaW5oZXJpdGVkKSB7XG4gICAgICAgICAgICBvdXQgKz0gJ1xcblxcbic7XG4gICAgICAgICAgICBpbmhlcml0ZWQgLT0gMjtcblxuICAgICAgICAgICAgdmFyIGJhc2VDbGFzcyA9ICcnO1xuICAgICAgICAgICAgdmFyIGNoYXIgPSAnJyxcbiAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjaGFyICE9ICcgJykge1xuICAgICAgICAgICAgICAgIGJhc2VDbGFzcyA9IGNoYXIgKyBiYXNlQ2xhc3M7XG4gICAgICAgICAgICAgICAgY2hhciA9IGNvbnN0cnVjdG9yLnN1YnN0cihpbmhlcml0ZWQgLSBpLCAxKTtcbiAgICAgICAgICAgICAgICArK2k7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gbmFtZSArICcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSgnICsgYmFzZUNsYXNzICsgJy5wcm90b3R5cGUpOyc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICAgICAgb3V0ICs9ICdcXG5cXG4nICsgbmFtZSArICcuJyArIHAgKyAnID0gJyArIHRoaXMudG9TdHJpbmcob2JqW3BdKSArICc7JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmoucHJvdG90eXBlO1xuICAgICAgICBmb3IgKHZhciBwIGluIHByb3RvdHlwZSkge1xuICAgICAgICAgICAgaWYgKHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgICAgIG91dCArPSAnXFxuXFxuJyArIG5hbWUgKyAnLnByb3RvdHlwZS4nICsgcCArICcgPSAnICsgdGhpcy50b1N0cmluZyhwcm90b3R5cGVbcF0pICsgJzsnO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICB0b0FycmF5OiBmdW5jdGlvbiAoZmxvYXQzMkFycmF5KSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmbG9hdDMyQXJyYXkpO1xuICAgIH0sXG5cbiAgICBzZXRWZWMzQXJyYXkgOiBmdW5jdGlvbihmbG9hdDMyQXJyYXksIGluZGV4LCB2ZWMzKXtcbiAgICAgICAgaW5kZXggPSBpbmRleCAqIDM7XG4gICAgICAgIGZsb2F0MzJBcnJheVtpbmRleCAgXSA9IHZlYzMueDtcbiAgICAgICAgZmxvYXQzMkFycmF5W2luZGV4KzFdID0gdmVjMy55O1xuICAgICAgICBmbG9hdDMyQXJyYXlbaW5kZXgrMl0gPSB2ZWMzLno7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3RVdGlsO1xuIl19
;