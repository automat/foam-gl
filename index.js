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
 * Copyright (c) 2013 - 2015 Henryk Wollik. All rights reserved.
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
	Math: require('./lib/math/Math'),
	Vec2: require('./lib/math/Vec2'),
	Vec3: require('./lib/math/Vec3'),
	Vec4: require('./lib/math/Vec4'),
	Matrix33: require('./lib/math/Matrix33'),
	Matrix44: require('./lib/math/Matrix44'),
	Quat: require('./lib/math/Quat'),
    OnB : require('./lib/math/OnB'),
	Ease: require('./lib/math/Ease'),
	Random: require('./lib/math/Random'),

	Geom: require('./lib/geom/Geom'),

	Color: require('./lib/util/Color'),
	AABB: require('./lib/geom/AABB'),
	AABR: require('./lib/geom/AABR'),
	Plane: require('./lib/geom/Plane'),
	Rect: require('./lib/geom/Rect'),
	App: require('./lib/app/App'),
	Time: require('./lib/app/Time'),
	Animation : require('./lib/app/Animation'),

	gl: require('./lib/gl/gl'),
	glTrans: require('./lib/gl/glTrans'),
	glDraw: require('./lib/gl/glDraw'),
	glObject : require('./lib/gl/glObject'),
	glu: require('./lib/gl/glu'),
	glExtensions: require('./lib/gl/glExtensions'),

	Vbo: require('./lib/gl/Vbo'),

	TextureFont: require('./lib/gl/TextureFont'),

	Program: require('./lib/gl/Program'),
	ProgramPreset: require('./lib/gl/ProgramPreset'),
	CameraPersp: require('./lib/gl/CameraPersp'),
	CameraOrtho: require('./lib/gl/CameraOrtho'),
	Arcball: require('./lib/gl/Arcball'),
	CameraOrbiter : require('./lib/gl/CameraOrbiter'),
	FrustumOrtho: require('./lib/gl/FrustumOrtho'),
	FrustumPersp: require('./lib/gl/FrustumPersp'),

	Texture: require('./lib/gl/Texture'),
	Fbo: require('./lib/gl/Fbo'),

	System: require('./lib/system/System'),
	Resource: require('./lib/system/Resource'),
	ResourceType : require('./lib/system/ResourceType'),
	FileWatcher :  require('./lib/system/FileWatcher'),
	EventDispatcher : require('./lib/system/EventDispatcher'),
	Event :           require('./lib/system/Event'),

	Mouse :      require('./lib/input/Mouse'),
	MouseEvent : require('./lib/input/MouseEvent'),
	Keyboard :   require('./lib/input/Keyboard'),
	KeyEvent :   require('./lib/input/KeyEvent'),

	Mesh : require('./lib/gl/Mesh'),
	MeshPrimitive : require('./lib/gl/MeshPrimitive'),
	VboMesh : require('./lib/gl/VboMesh'),
	VboMeshPrimitive : require('./lib/gl/VboMeshPrimitive'),

	Light : require('./lib/gl/Light'),
	PointLight : require('./lib/gl/PointLight'),
	DirectionalLight : require('./lib/gl/DirectionalLight'),
	SpotLight : require('./lib/gl/SpotLight'),

	Material : require('./lib/gl/Material'),

	ObjectUtil : require('./lib/util/ObjectUtil'),
	StringUtil : require('./lib/util/StringUtil'),
	ArrayUtil  :   require('./lib/util/ArrayUtil'),
	ElementArrayUtil : require('./lib/util/ElementArrayUtil')
};