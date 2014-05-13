//temp
var fs = require('fs');

var inPath  = '../resources/';
    outPath = '../src/foam/gl/gl/shader/';

/*
function shader2String(shaderSource,dist)
{
    var string = fs.readFileSync(shaderSource,'utf-8');
        string = string.replace(/(\r\n|\n|\r)/gm,"");
        string = string.replace(/ +(?= )/g,'');

    fs.writeFileSync(dist,'modules.exports ="' + string + '";','utf-8');
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

    {src: inPath + '/glsl/fColorFragShader.glsl',        dest: outPath + 'fColorFragShader.js'},
    {src: inPath + '/glsl/fColorVertShader.glsl',        dest: outPath + 'fColorVertShader.js'},
    {src: inPath + '/glsl/fColorSolidFragShader.glsl',   dest: outPath + 'fColorSolidFragShader.js'},
    {src: inPath + '/glsl/fColorSolidVertShader.glsl',   dest: outPath + 'fColorSolidVertShader.js'},
    {src: inPath + '/glsl/fNormalFragShader.glsl',       dest: outPath + 'fNormalFragShader.js'},
    {src: inPath + '/glsl/fNormalVertShader.glsl',       dest: outPath + 'fNormalVertShader.js'},

    {src: inPath + '/render/fImageVertShader.glsl',     dest: outPath + 'fImageVertShader.js'},
    {src: inPath + '/render/fImageFragShader.glsl',     dest: outPath + 'fImageFragShader.js'},
    {src: inPath + '/render/fBillboardVertShader.glsl', dest: outPath + 'fBillboardVertShader.js'},
    {src: inPath + '/render/fBillboardFragShader.glsl', dest: outPath + 'fBillboardFragShader.js'}

]);