/*
var Application = require('../app/fApplication');

var SystemImplWeb = {};

SystemImplWeb.loadImage = function(imageSrc,callback)
{
    var image = new Image();
        image.addEventListener('load',callback);
        image.src = imageSrc;
};

SystemImplWeb.getContext3dData = function()
{
   return Application.getInstance().getWindow().toDataURL();
};

SystemImplWeb.loadFile = function(file,callback)
{

};

*/

var SystemImplWeb =
{
    readFile : function(filepath,callback){},
    readFileSync : function(filepath,callback){},
    writeFile : function(filepath,data,callback){},
    writeFileSync : function(filepath,data,callback){},
    getDirectory : function(file){},
    getFilePath : function(file){},
    makeFilePath : function(filepath){}


};

module.exports =  SystemImplWeb;