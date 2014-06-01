/**
 *
 *
 *  F | O | A | M
 *
 *
 * Foam - A WebGL toolkit
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

    Math :     require('./math/Math'),
    Vec2 :     require('./math/Vec2'),
    Vec3 :     require('./math/Vec3'),
    Vec4 :     require('./math/Vec4'),
    Matrix44 : require('./math/Matrix44'),
    Ease :     require('./math/Ease'),
    Random :   require('./math/Random'),

    Color : require('./util/Color'),
    AABB :  require('./geom/AABB'),
    Plane : require('./geom/Plane'),
    Rect :  require('./geom/Rect'),
    Application : require('./app/App'),

    gl :      require('./gl/gl'),
    glTrans : require('./gl/glTrans'),
    glDraw :  require('./gl/glDraw'),
    glu :     require('./gl/glu'),


    Program : require('./gl/Program'),
    CameraPersp :   require('./gl/CameraPersp'),
    CameraOrtho :   require('./gl/CameraOrtho'),
    Arcball : require('./gl/Arcball'),
    FrustumOrtho : require('./gl/FrustumOrtho'),
    FrustumPersp : require('./gl/FrustumPersp'),

    Texture: require('./gl/Texture'),
    Fbo: require('./gl/Fbo'),

    System :      require('./system/System'),
    FileWatcher : require('./system/FileWatcher'),
    EventDispatcher : require('./system/EventDispatcher'),
    Event :           require('./system/Event'),
    Mouse :      require('./input/Mouse'),
    MouseEvent : require('./input/MouseEvent'),

//
//    Light            : require('./gl/gl/light/fLight'),
//    PointLight       : require('./gl/gl/light/fPointLight'),
//    DirectionalLight : require('./gl/gl/light/fDirectionalLight'),
//    SpotLight        : require('./gl/gl/light/fSpotLight'),
//
//    Material      : require('./gl/gl/fMaterial'),

    ObjectUtil :  require('./util/ObjectUtil'),
    ArrayUtil :   require('./util/ArrayUtil'),
    ElementArrayUtil : require('./util/ElementArrayUtil')



};

