var fs = require('fs');

var inPath  = '../includes/';
    outPath = '../src/glKit/graphics/gl/shader/';


function shader2String(shaderSource,dist)
{
    var string = fs.readFileSync(shaderSource,'utf-8');
        string = string.replace(/(\r\n|\n|\r)/gm,"");
        string = string.replace(/ +(?= )/g,'');

    fs.writeFileSync(dist,'module.exports ="' + string + '";','utf-8');
}


shader2String(inPath + 'fProgFragShader.glsl',outPath + 'fProgFragShader.js');
shader2String(inPath + 'fProgVertexShader.glsl',outPath + 'fProgVertexShader.js');

/*
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


shader2String(inPath + '_glkProgFragShader.glsl',      'Foam.ProgFragShader',     outPath + 'fProgFragShader.js');
shader2String(inPath + '_glkProgVertexShader.glsl',    'Foam.ProgVertexShader',   outPath + 'fProgVertexShader.js');
shader2String(inPath + '_glkProgFragImgShader.glsl',   'Foam.ProgFragImgShader',  outPath + '_glkProgFragImgShader.js');
shader2String(inPath + '_glkProgVertexImgShader.glsl', 'Foam.ProgVertexImgShader',outPath + '_glkProgVertexImgShader.js');
    */


