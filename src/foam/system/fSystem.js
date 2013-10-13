
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

    __set      : function(system){__internal = system;}
};

module.exports = SystemInternal;








