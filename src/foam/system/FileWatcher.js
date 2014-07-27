var ObjectUtil = require('../util/ObjectUtil'),
    EventDispatcher = require('./EventDispatcher'),
    Event = require('./Event'),
    FileEvent = require('./FileEvent');

function File(path) {
    EventDispatcher.call(this);
    this.timeModifiedNew = -1;
    this.timeModifiedOld = -1;
    this.path = path;
}

File.prototype = Object.create(EventDispatcher.prototype);

/**
 * A basic filewatcher.
 * @constructor
 */

function FileWatcher() {
    this._files = [];
    this._timer = null;
    this._delay = 500;
    this._request = new XMLHttpRequest();
}

//  This is not optimal, but sufficient as a basic watcher

FileWatcher.prototype._watch = function(){
    var files = this._files;
    var i = -1;;
    var file, time;
    var request = this._request;
    while(++i < files.length){
        file = files[i];

        // sync
        request.open('HEAD',file.path,false);
        request.send();
        if(request.status == 200){
            time = new Date(request.getResponseHeader('Last-Modified'));
            if(time == file.timeModifiedNew){
                return;
            } else if(time > file.timeModifiedNew){
                file.timeModifiedOld = file.timeModifiedNew;
                file.timeModifiedNew = time;
                var _file = file;
                var _request = new XMLHttpRequest();
                //async
                _request.open('GET',_file.path,true);
                _request.onreadystatechange = function(){
                    if(_request.readyState == 4){
                        if(_request.status == 200){
                            _file.dispatchEvent(new Event(_file,FileEvent.FILE_MODIFIED,_request.responseText));
                        } else if(_request.status == 404){
                            _file.dispatchEvent(new Event(_file,FileEvent.FILE_REMOVED));
                        }
                    }
                }
                _request.send();
            } else if(time.toString() == 'Invalid Date'){
                _file.dispatchEvent(new Event(_file,FileEvent.FILE_NOT_VALID));
            } else {
                //hm
            }
        } else if(request.status == 404){
            file.dispatchEvent(new Event(file,FileEvent.FILE_REMOVED));
            files.splice(i,1);
        }
    }
    this._timer = setTimeout(this._watch.bind(this),this._delay);
}

/**
 * Add a file to watch.
 * @param {String} path - The filepath
 * @param {Function} callbackModfied - Callback if watched file is modified
 * @param {Function} [callbackAdded] - Callback
 * @param {Function} [callbackRemoved] - Callback if watched file has been removed
 * @param {Function} [callbackNotValid] - Callback if path isnt valid
 */

FileWatcher.prototype.addFile = function(path,callbackModfied,
                                              callbackAdded,
                                              callbackRemoved,
                                              callbackNotValid){
    if(this.hasFile(path)){
        return;
    }
    var self = this;
    var files = this._files;
    var file;
    var request = new XMLHttpRequest();

    request.open('HEAD', path, false);
    request.send();
    if(request.status == 200){
        file = new File(path);
        if(callbackNotValid){
            file.addEventListener(FileEvent.FILE_NOT_VALID,callbackNotValid);
        }

        var time = new Date(request.getResponseHeader('Last-Modified'));
        if(time.toString() == 'Invalid Date'){
            if(file.hasEventListener(FileEvent.FILE_NOT_VALID)){
                file.dispatchEvent(new Event(file,FileEvent.FILE_NOT_VALID));
                return;
            }
            console.log('Invalid Date. File: ' + path);

        } else {
            file.timeModifiedNew = time;
            if (callbackAdded) {
                file.addEventListener(FileEvent.FILE_ADDED, callbackAdded);
            } else if (callbackModfied) {
                file.addEventListener(FileEvent.FILE_ADDED, callbackModfied);
            }
            if (callbackModfied) {
                file.addEventListener(FileEvent.FILE_MODIFIED, callbackModfied);
            }
            if (callbackRemoved) {
                file.addEventListener(FileEvent.FILE_REMOVED, callbackRemoved);
            }
        }

        request.open('GET',path,false);
        request.send();
        if(request.status == 200){
            files.push(file);
            file.dispatchEvent(new Event(file,FileEvent.FILE_ADDED,request.responseText));
            clearTimeout(self._timer);
            self._watch();
        } else if(request.status == 404){
            if(file.hasEventListener(FileEvent.FILE_NOT_VALID)){
                file.dispatchEvent(new Event(file,File.FILE_NOT_VALID));
                return;
            }
            console.log('File does not exist. File: ' + path);
        }

    } else if(request.status == 404){
        if(file.hasEventListener(FileEvent.FILE_NOT_VALID)){
            file.dispatchEvent(new Event(file,FileEvent.FILE_NOT_VALID));
            return;
        }
        console.log('File does not exist. File: ' + path);
    }
};

/**
 * Remove a file from the watcher.
 * @param {String} path - The file path
 */

FileWatcher.prototype.removeFile = function(path){
    if(!this.hasFile(path)){
        console.log('File not added to watcher. File: ' + path);
        return;
    }
    var files = this._files;
    var i = -1, l = files.length;
    while(++i < l){
        if(files[i].path == path){
            files.splice(i,1);
            return;
        }
    }
}

/**
 * Return if the watcher is currentky watching this file.
 * @param {String} path = The file path
 * @returns {Boolean}
 */

FileWatcher.prototype.hasFile = function(path){
    var files = this._files;
    var i = -1, l = files.length;
    while(++i < l){
        if(files[i].path == path){
            return true;
        }
    }
    return false;
}

/**
 * Restart the watcher if stopped.
 */

FileWatcher.prototype.restart = function(){
    if(this._files.length == 0){
        return;
    }
    this._watch();
}

/**
 * Stop the watcher.
 */

FileWatcher.prototype.stop = function(){
    clearTimeout(this._timer);
}

module.exports = FileWatcher;