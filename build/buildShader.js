var fs = require('fs');

var inPath  = '../includes/';
    outPath = '../src/glKit/graphics/gl/shader/';

/*
function shader2String(shaderSource,shaderClassName,dist)
{
    var string = fs.readFileSync(shaderSource,'utf-8');
        string = string.replace(/(\r\n|\n|\r)/gm,"");
        string = string.replace(/ +(?= )/g,'');

    fs.writeFileSync(dist,shaderClassName + '="' + string + '";','utf-8');
}
*/

function shader2String(shaderSource,shaderClassName,dist)
{
    var string = '\n';
    var arr    =  fs.readFileSync(shaderSource,'utf-8').toString().split('\n');
    var i      = -1;
    var l      = arr.length;
    var line;

    console.log(arr);

    while(++i < l)
    {
        line = arr[i];

        string+=line != '' ? ('"'+ line + ((i < l - 1) ? '" + \n' : '"')) : '\n';

    }

    fs.writeFileSync(dist,shaderClassName + '=' + string + ';','utf-8');
}


shader2String(inPath + 'glkProgFragShader.glsl',      'GLKit.ProgFragShader',     outPath + 'glkProgFragShader.js');
shader2String(inPath + 'glkProgVertexShader.glsl',    'GLKit.ProgVertexShader',   outPath + 'glkProgVertexShader.js');
shader2String(inPath + 'glkProgFragImgShader.glsl',   'GLKit.ProgFragImgShader',  outPath + 'glkProgFragImgShader.js');
shader2String(inPath + 'glkProgVertexImgShader.glsl', 'GLKit.ProgVertexImgShader',outPath + 'glkProgVertexImgShader.js');