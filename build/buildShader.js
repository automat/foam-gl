var fs = require('fs');

var inPath  = '../includes/';
    outPath = '../src/glKit/graphics/gl/shader/';

function shader2String(shaderSource,shaderClassName,dist)
{
    var string = fs.readFileSync(shaderSource,'utf-8');
        string = string.replace(/(\r\n|\n|\r)/gm,"");
        string = string.replace(/ +(?= )/g,'');

    fs.writeFileSync(dist,shaderClassName + '="' + string + '";','utf-8');
}

shader2String(inPath + 'glkProgFragShader.glsl',   'GLKit.ProgFragShader',   outPath +'glkProgFragShader.js');
shader2String(inPath + 'glkProgVertexShader.glsl', 'GLKit.ProgVertexShader', outPath +'glkProgVertexShader.js');
