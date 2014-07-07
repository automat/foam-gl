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

var OBJ_VERTEX = 'v',
    OBJ_NORMAL = 'vn',
    OBJ_TEX_COORD = 'vt',
    OBJ_FACE = 'f',
    OBJ_COMMENT = '#';

function LoadObj(path,callbackSuccess,callbackError){
    var request = new XMLHttpRequest();
    request.open('GET',path);
    request.responseType = 'text';
    request.addEventListener('readystatechange', function () {
        if(request.readyState == 4){
            if(request.status == 200){
                var data = request.response;
                var vertices  = [],
                    normals   = [],
                    texcoords = [],
                    indices   = [];

                var obj_ = {
                    vertices : [],
                    normals : [],
                    texcoords : [],
                    indices : [],
                    indicesHash : {}
                }

                var faceIndices,
                    indexVertex,
                    indexNormal,
                    indexTexcoord,
                    indexIndex = 0;

                var lines = data.split('\n'), line;
                var l = lines.length;

                if(l == 0){
                    console.log('Warning: Invalid obj file.');
                    callbackError();
                    return;
                }

                var i = -1;
                var tokens, firstToken, numTokens;

                var j;

                while(++i < l){
                    line       = lines[i];
                    tokens     = line.split(' ');
                    firstToken = tokens.shift();
                    numTokens  = tokens.length;

                    switch (firstToken){
                        case OBJ_VERTEX :
                            if(numTokens != 3){
                                console.log('Warining: Invalid vertex length: ' + tokens.length);
                                callbackError();
                                return;
                            }
                            vertices.push(tokens[0],tokens[1],tokens[2]);
                            break;
                        case OBJ_NORMAL :
                            if(numTokens!= 3){
                                console.log('Warining: Invalid normal length: ' + tokens.length);
                                callbackError();
                                return;
                            }
                            normals.push(tokens[0],tokens[1],tokens[2]);
                            break;
                        case OBJ_TEX_COORD :
                            if(numTokens != 2){
                                console.log('Warining: Invalid texcoord length: ' + tokens.length);
                                callbackError();
                                return;
                            }
                            texcoords.push(tokens[0],tokens[1]);
                            break;
                        case OBJ_FACE :
                            if(numTokens == 3){
                                j = -1;
                                while(++j < tokens.length){
                                    faceIndices   = tokens[j].split('/');
                                    indexVertex   = (faceIndices[0] - 1) * 3;
                                    indexNormal   = (faceIndices[1] - 1) * 3;
                                    indexTexcoord = (faceIndices[2] - 1) * 2;

                                    obj_.vertices.push(vertices[indexVertex  ],
                                                       vertices[indexVertex+1],
                                                       vertices[indexVertex+2]);

                                    obj_.texcoords.push(texcoords[indexTexcoord  ],
                                                        texcoords[indexTexcoord+1]);

                                    obj_.normals.push(normals[indexNormal  ],
                                                      normals[indexNormal+1],
                                                      normals[indexNormal+2]);

                                    obj_.indicesHash[tokens[j]] = indexIndex;
                                    obj_.indices.push(indexIndex);
                                    indexIndex++;
                                }
                            } else {
                                console.log('Warning: Quad faces not supported.');
                                callbackError();
                                return;
                            }
                            break;
                        default  :
                            break;
                    }
                }
                obj_.vertices  = new Float32Array(obj_.vertices);
                obj_.normals   = new Float32Array(obj_.normals);
                obj_.texcoords = new Float32Array(obj_.texcoords);
                obj_.indices   = new Uint16Array(obj_.indices);

                callbackSuccess(obj_);
            } else if(request.status == 404){
                callbackError();
            }
        }
    });
    request.send();
};

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
       type != ResourceType.TEXT &&
       type != ResourceType.OBJ){
        console.log(strLogResourceUnsupported(path,type,index));
        if(callbackError && strict){
            callbackError(path);
        }
        return;
    }
    if(type == ResourceType.IMAGE){
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

    } else if (type == ResourceType.OBJ){
        LoadObj(resource.path,
            function(resource){
                if(callbackSuccess){
                    callbackSuccess(resource);
                }
            },
            function(){
                console.log(strLogResourceLoadFail(path,type,index));
                if(callbackError && strict){
                    callbackError(resource.path);
                }
            }
        );

    } else {
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
    load : function(resource, callbackSuccess, callbackError, callbackProcess, strict){
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
                return;
            }
            if(callbackProcess){
                callbackProcess(numFilesLoaded,numFiles);
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