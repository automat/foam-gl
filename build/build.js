var fs = require('fs');

var rootPath = '../src/glKit/',
    files    = [
        'glKit.js',
        'math/glkMath.js',
        'math/glkQuaternion.js',
        'math/glkVec2.js',
        'math/glkVec3.js',
        'math/glkVec4.js',
        'math/glkMat33.js',
        'math/glkMat44.js',
        'util/glkColor.js',
        'util/glkUtil.js',
        'graphics/gl/program/glkProgLoader.js',
        'graphics/gl/shader/glkShaderLoader.js',
        'graphics/gl/shader/glkProgFragShader.js',
        'graphics/gl/shader/glkProgVertexShader.js',
        'graphics/gl/glkMatGL.js',
        'graphics/gl/glkMaterial.js',
        'graphics/gl/glkLight.js',
        'graphics/gl/glkTexture.js',
        'graphics/glkGL.js',
        'graphics/glkCameraBasic.js',
        'graphics/util/glkGLUtil.js',
        'geom/glkGeom3d.js',
        'geom/glkParametricSurface.js',
        'geom/glkISOSurface.js',
        'geom/glkParametricSurface.js',
        'util/glkMouse.js',
        'app/glkWindow.js',
        'app/glkApplication.js'
    ];


function concat(rootPath, fileList, distPath)
{
    var out = fileList.map(function(filePath){return fs.readFileSync(rootPath + filePath, 'utf-8');}).join('\n') /*+ "\nControlKit.CSS.Style=\"" + fs.readFileSync(rootPath + stylePath,'utf-8').replace(/\s/gm,' ') + "\";" */;
    fs.writeFileSync(distPath, out, 'utf-8');
}

concat(rootPath,files,'../bin/glKit.js');

