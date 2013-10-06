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


module.exports =  SystemImplWeb;