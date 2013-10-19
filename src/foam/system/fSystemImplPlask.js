var fs     = require('fs'),
    path   = require('path'),
    plask  = require('plask'),
    fError = require('./common/fError');


var SystemImplPlask =
{
    readFile : function(filepath,callback)
    {
        fs.readFile(filepath,'utf8',function(err,data)
        {
            if(err)throw err;
            callback(data);
        });

        return true;
    },

    readFileSync : function(filepath){return fs.readFileSync(filepath,'utf8');},

    writeFile : function(filepath,data,callback)
    {
        if(!fs.existsSync(this.getDirectory(filepath)))throw Error(fError.DIRECTORY_DOESNT_EXIST);
        fs.writeFile(filepath,data,'utf8',
            function(err)
            {
                if(err)throw err;
                callback();
            });

        return true;
    },

    writeFileSync : function(filepath,data)
    {
        if(!fs.existsSync(this.getDirectory(filepath)))throw Error(fError.DIRECTORY_DOESNT_EXIST);
        fs.writeFileSync(filepath,data,'utf8');
        return true;
    },

    getDirectory : function(file)
    {
        file = file || module.parent.parent.parent.parent.filename;
        return path.dirname(file);
    },

    getFilePath  : function(file)
    {
        var p = path.join(this.getDirectory(),file);
        return fs.existsSync(p) ? p : null;
    },

    makeFilePath : function(filepath){return path.join(this.getDirectory(),filepath)},

    //not sure about simulating web async
    loadImage : function(filepath,callback)
    {
        if(!fs.existsSync(filepath))throw Error(fError.FILE_DOESNT_EXIST);
        callback(plask.SkCanvas.createFromImage(filepath));
    },

    bindTextureImageData : function(gl,texture,activeTexture,imageData)
    {
        gl.texImage2DSkCanvas(texture,activeTexture,imageData);
    }

};

module.exports = SystemImplPlask;