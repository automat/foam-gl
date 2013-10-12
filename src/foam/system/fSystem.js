/*
var fError               = require('./common/fError'),
    Platform             = require('./common/fPlatform'),
    SystemImplWeb        = require('./fSystemImplWeb'),
    SystemImplPlask      = require('./fSystemImplPlask'),
    SystemImplNodeWebkit = require('./fSystemImplNodeWebkit');

function System_Internal()
{
    if(System_Internal.__instance)throw new Error(fError.CLASS_IS_SINGLETON);

    var target = Platform.getTarget();

    this._systemImpl = (target == Platform.WEB)         ? new SystemImplWeb() :
                       (target == Platform.PLASK)       ? new SystemImplPlask() :
                       (target == Platform.NODE_WEBKIT) ? new SystemImplNodeWebkit() :
                       null;
}

System_Internal.__instance = null;
System_Internal.getInstance = function()
{
    if(!System_Internal.__instance)
        System_Internal.__instance = new System_Internal();

    return System_Internal.__instance;
};

var System = {};

System.loadFile              = function(file,callback){return System_Internal.getInstance().loadFile(file,callback);};
System.saveFile              = function(file,callback){return System_Internal.getInstance().saveFile(file,callback);};
System.getContext3dImageData = function()             {return System_Internal.getInstance().getContext3dImageData();};

*/

var __internal = null;

var SystemInternal =
{
    readFile      : function(filepath,callback)     {return __internal.readFile(filepath,callback);},
    readFileSync  : function(filepath)              {return __internal.readFileSync(filepath);},
    writeFile     : function(filepath,data,callback){return __internal.writeFile(filepath,data,callback);},
    writeFileSync : function(filepath,data)         {return __internal.writeFileSync(filepath,data);},

    getFilePath   : function(file)    {return __internal.getFilePath(file);},
    makeFilePath  : function(filepath){return __internal.makeFilePath(filepath);},
    getDirectory  : function(file)    {return __internal.getDirectory(file);},



    getContext3dImageData : function(){return __internal.getContext3dImageData();},

    __set      : function(system){__internal = system;}
};


module.exports.__SystemInternal = null;
module.exports = SystemInternal;








