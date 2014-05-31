var ObjectUtil = require('../util/ObjectUtil');

var System = {
    loadFile : function(path,callback){
        var request = new XMLHttpRequest();
        request.open('GET', path);
        request.onreadystatechange = function() {
            if(request.readyState == 4){
                if(request.status == 200){
                    callback(request.responseText);
                } else if(request.status == 404){
                    console.log('File not found. File: ' + path);
                }
            }
        };
        request.send();
    },

    loadFileBundle : function(bundle,callback){
        var bundle_ = {};
        var numFiles = ObjectUtil.getNumKeys(bundle);
        var numFilesLoaded = 0;

        function onFileProcessed(){
            if(numFilesLoaded == numFiles){
                callback(bundle_);
            }
        }

        function loadFile(key){
            var obj = bundle[key];
            var request;
            if(ObjectUtil.isObject(obj)){
                if(obj.hasOwnProperty('path') && obj.hasOwnProperty('type')){
                    var type = obj.type;
                    if( type != 'arraybuffer' ||
                        type != 'blob' ||
                        type != 'document' ||
                        type != 'json' ||
                        type != 'text'){
                        console.log('Invalid return type: ' + type);
                        numFiles--;
                    } else {
                        request = new XMLHttpRequest();
                        request.open('GET',obj.path,true);
                        request.responseType = obj.type;
                        request.onreadystatechange = function(){
                            if(request.readyState == 4){
                                if(request.status == 200){
                                    bundle_[key] = request.responseText;
                                    numFilesLoaded++;
                                } else if(request == 404){
                                    console.log('File not found. File: ' + obj);
                                    numFiles--;
                                }
                                onFileProcessed();
                            }
                        }
                        request.send();
                    }

                } else {
                    console.log("Invalid resource object: " + obj);
                    numFiles--;
                }
            } else if(ObjectUtil.isString(obj)){
                request = new XMLHttpRequest();
                request.open('GET',obj,true);
                request.onreadystatechange = function(){
                    if(request.readyState == 4){
                        if(request.status == 200){
                            bundle_[key] = request.responseText;
                            numFilesLoaded++;
                        } else if(request == 404){
                            console.log('File not found. File: ' + obj);
                            numFiles--;
                        }
                        onFileProcessed();
                    }
                }
                request.send();
            }
        }

        for(var key in bundle){
            if(bundle.hasOwnProperty(key)){
                if(!ObjectUtil.isString(bundle[key])){
                    console.log('Bundle file path: ' + key + ' is not of type string.');
                    numFiles--;
                    onFileProcessed();
                } else {
                    loadFile(key);
                }
            }
        }
    },

    loadImage : function(file, callback){
        var image = new Image();
        image.addEventListener('load',callback(image));
        image.src = file;
    }
};

module.exports = System;








