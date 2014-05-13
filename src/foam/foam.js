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

