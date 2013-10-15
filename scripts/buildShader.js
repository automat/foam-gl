//temp
var fs = require('fs');

var inPath  = '../includes/';
    outPath = '../src/foam/graphics/gl/shader/';

/*
function shader2String(shaderSource,dist)
{
    var string = fs.readFileSync(shaderSource,'utf-8');
        string = string.replace(/(\r\n|\n|\r)/gm,"");
        string = string.replace(/ +(?= )/g,'');

    fs.writeFileSync(dist,'module.exports ="' + string + '";','utf-8');
}
*/

function shader2String(files)
{
    var i = -1, l = files.length, obj,str;
    while(++i < l)
    {
        obj = files[i];
        if(!obj.src)throw  'file src missing.';
        if(!obj.dest)throw 'file dest missing.';

        str = fs.readFileSync(obj.src,'utf-8');
        str = str.replace(/(\r\n|\n|\r)/gm,"");
        str = str.replace(/ +(?= )/g,'');

        fs.writeFile(obj.dest,'module.exports ="'+str+'";','utf-8');
    }

}

shader2String([

    {src: inPath + '/temp/fProgFragShader.glsl',   dest: outPath + 'fProgFragShader.js'},
    {src: inPath + '/temp/fProgVertShader.glsl',   dest: outPath + 'fProgVertShader.js'},
    {src: inPath + '/temp/fRenderVertShader.glsl', dest: outPath + 'fRenderVertShader.js'},
    {src: inPath + '/temp/fRenderFragShader.glsl', dest: outPath + 'fRenderFragShader.js'},

    {src: inPath + '/material/fColorFragShader.glsl',        dest: outPath + 'fColorFragShader.js'},
    {src: inPath + '/material/fColorVertShader.glsl',        dest: outPath + 'fColorVertShader.js'},
    {src: inPath + '/material/fColorSolidFragShader.glsl',   dest: outPath + 'fColorSolidFragShader.js'},
    {src: inPath + '/material/fColorSolidVertShader.glsl',   dest: outPath + 'fColorSolidVertShader.js'},
    {src: inPath + '/material/fNormalFragShader.glsl',       dest: outPath + 'fNormalFragShader.js'},
    {src: inPath + '/material/fNormalVertShader.glsl',       dest: outPath + 'fNormalVertShader.js'},

]);