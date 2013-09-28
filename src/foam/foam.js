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

module.exports =
{
    Math        : require('./math/fMath'),
    Vec2        : require('./math/fVec2'),
    Vec3        : require('./math/fVec3'),
    Vec4        : require('./math/fVec4'),
    Mat33       : require('./math/fMat33'),
    Mat44       : require('./math/fMat44'),
    Quaternion  : require('./math/fQuaternion'),


    MatGL        : require('./graphics/gl/fMatGL'),
    ProgLoader   : require('./graphics/gl/shader/fProgLoader'),
    ShaderLoader : require('./graphics/gl/shader/fShaderLoader'),
    CameraBasic  : require('./graphics/fCameraBasic'),

    Light            : require('./graphics/gl/fLight'),
    PointLight       : require('./graphics/gl/fPointLight'),
    DirectionalLight : require('./graphics/gl/fDirectionalLight'),
    SpotLight        : require('./graphics/gl/fSpotLight'),

    Material    : require('./graphics/gl/fMaterial'),
    Texture     : require('./graphics/gl/fTexture'),

    fGLUtil     : require('./graphics/util/fGLUtil'),
    fGL         : require('./graphics/fGL'),

    Mouse       : require('./util/fMouse'),
    Color       : require('./util/fColor'),
    Util        : require('./util/fUtil'),

    Platform    : require('./system/fPlatform'),

    Geom3d            : require('./geom/fGeom3d'),
    ParametricSurface : require('./geom/fParametricSurface'),
    ISOSurface        : require('./geom/fISOSurface'),
    ISOBand           : require('./geom/fISOBand'),
    LineBuffer2d      : require('./geom/fLineBuffer2d'),
    LineBuffer3d      : require('./geom/fLineBuffer3d'),
    Spline            : require('./geom/fSpline'),
    Line2dUtil        : require('./geom/fLine2dUtil'),
    Polygon2dUtil     : require('./geom/fPolygon2dUtil'),


    Application : require('./app/fApplication')

};

