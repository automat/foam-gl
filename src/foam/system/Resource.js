var ObjectUtil = require('../util/ObjectUtil'),
    ResourceType = require('./ResourceType');

function strLogResourceLoadFail(path,type,index){
    return 'Warning: Failed to load Resource ' + "'" + path + "' of type '" + type + "'" + (index != null ? (' at index ' + index + ' .') : '.') ;
}

function strLogResourceUnsupported(path, type, index) {
    return 'Warning: Resource ' + "'" + path + "' of type '" + type + "'" + (index != null ? (' at index ' + index + ' ') : ' ') + 'is not supported.';
}

function strLogResourceNoPath(type,index) {
    return 'Warning: Resource ' + (type ? ('of type "' + type + '" ') : '') + (index != null ? ( ' at index ' + index )  : '"') + ' has no path.';
}

function Load(resource,index,callbackSuccess,callbackError,strict){
    var path = resource.path;
    if(!path){
        console.log(strLogResourceNoPath(type,index));
        if(callbackError){
            callbackError();
        }
        return;
    }
    var type = resource.type || 'text';

    if(type != ResourceType.IMAGE &&
       type != ResourceType.ARRAY_BUFFER &&
       type != ResourceType.BLOB &&
       type != ResourceType.DOCUMENT &&
       type != ResourceType.JSON &&
       type != ResourceType.TEXT){
        console.log(strLogResourceUnsupported(path,type,index));
        if(callbackError && strict){
            callbackError(path);
        }
        return;
    }

    if(type == 'image'){
        var image = new Image();
        image.addEventListener('load', function () {
            if(callbackSuccess){
                callbackSuccess(image,index);
            }
        });
        image.addEventListener('error',function(){
            console.log(strLogResourceLoadFail(path,type,index));
            if(callbackError && strict){
                callbackError(path);
            }
        });
        image.src = path;
    }else {
        var request = new XMLHttpRequest();
        request.open('GET', path);
        request.responseType = type;
        request.addEventListener('readystatechange', function(){
            if(request.readyState == 4){
                if(request.status == 200){
                    if(callbackSuccess){
                        callbackSuccess(request.response,index);
                    }
                } else if(request.status == 404){
                    console.log(strLogResourceLoadFail(path,type,index));
                    if(callbackError && strict){
                        callbackError(path);
                    }
                }
            }
        });
        request.send();
    }
}

var Resource = {
    load : function(resource, callbackSuccess, callbackError, strict){
        strict = ObjectUtil.isUndefined(strict) ? true : strict;
        var keys = ObjectUtil.getKeys(resource),
            numKeys = keys.length;

        if(numKeys == 0){
            console.log('Warning: Invalid Resource.');
            if(callbackError){
                callbackError();
            }
            return;
        }

        var resource_ = {};

        if(numKeys <= 2 && (keys[0] == 'path' || keys[0] == 'type')){
            Load(resource,null,callbackSuccess, callbackError,strict);
            return;
        } else if(numKeys == 1){
            resource = resource[keys[0]];
            Load(resource,null,function(resource){
                resource_[keys[0]] = resource;
                callbackSuccess(resource_);
            }, callbackError, strict);
            return;
        }

        var numFiles = numKeys,
            numFilesLoaded = 0;

        var error = false;

        function onFileProcessed(){
            if(numFilesLoaded == numFiles){
                if(callbackSuccess){
                    callbackSuccess(resource_);
                }
            }
        }

        function onError(){
            if(!strict){
                numFiles--;
                onFileProcessed();
                return;
            }
            if(callbackError){
                callbackError();
            }
            error = true;
        }


        var index = 0;
        for(var key in resource){
            Load(resource[key],index++,
                 function(resource,index){
                     resource_[keys[index]] = resource;
                     numFilesLoaded++;
                     onFileProcessed();
                 },onError.bind(this));
            if(error){
                return;
            }
        }
    }
}

module.exports = Resource;