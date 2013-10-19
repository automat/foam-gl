var Platform             = require('./common/fPlatform'),
    SystemImplWeb        = require('./fSystemImplWeb'),
    SystemImplPlask      = require('./fSystemImplPlask'),
    SystemImplNodeWebkit = require('./fSystemImplNodeWebkit');


var __internal = null;

if(!__internal)
{
    var platform = Platform.getTarget();

    __internal = platform == Platform.PLASK       ? SystemImplPlask :
                 platform == Platform.WEB         ? SystemImplWeb :
                 platform == Platform.NODE_WEBKIT ? SystemImplNodeWebkit :
                 null;
}

var SystemInternal =
{
    readFile      : function(filepath,callback)     {return __internal.readFile(filepath,callback);},
    readFileSync  : function(filepath)              {return __internal.readFileSync(filepath);},
    writeFile     : function(filepath,data,callback){return __internal.writeFile(filepath,data,callback);},
    writeFileSync : function(filepath,data)         {return __internal.writeFileSync(filepath,data);},

    getFilePath   : function(file)    {return __internal.getFilePath(file);},
    makeFilePath  : function(filepath){return __internal.makeFilePath(filepath);},
    getDirectory  : function(file)    {return __internal.getDirectory(file);},

    loadImage            : function(filepath,callback)                 {return __internal.loadImage(filepath, callback);},
    bindTextureImageData : function(gl,imageData){return __internal.bindTextureImageData(gl,imageData);}
};

module.exports = SystemInternal;








