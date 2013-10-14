//temp
var fs = require('fs');

var inPath  = '../includes/';
    outPath = '../src/foam/graphics/gl/shader/';


function shader2String(shaderSource,dist)
{
    var string = fs.readFileSync(shaderSource,'utf-8');
        string = string.replace(/(\r\n|\n|\r)/gm,"");
        string = string.replace(/ +(?= )/g,'');

    fs.writeFileSync(dist,'module.exports ="' + string + '";','utf-8');
}

shader2String(inPath + '/temp/fProgFragShader.glsl',outPath + 'fProgFragShader.js');
shader2String(inPath + '/temp/fProgVertShader.glsl',outPath + 'fProgVertShader.js');
shader2String(inPath + '/temp/fRenderVertShader.glsl',outPath + 'fRenderVertShader.js');
shader2String(inPath + '/temp/fRenderFragShader.glsl',outPath + 'fRenderFragShader.js');

shader2String(inPath + 'fColorFragShader.glsl', outPath + 'fColorFragShader.js');
shader2String(inPath + 'fColorVertShader.glsl', outPath + 'fColorVertShader.js');
shader2String(inPath + 'fNormalFragShader.glsl',outPath + 'fNormalFragShader.js');
shader2String(inPath + 'fNormalVertShader.glsl',outPath + 'fNormalVertShader.js');
