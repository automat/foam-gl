var FileWatcher = require('foam-gl').FileWatcher;

function resourcePathLocal(path){
    return '../examples/13_FileWatcher/' + path;
}

window.addEventListener('load',function(){
    var watcher;

    function onFileAdded(e){
        console.log('File added.\n','File content:', e.data);
    }

    function onFileChanged(e){
        console.log('File changed\n','File content:', e.data);
    }

    watcher = new FileWatcher();
    watcher.addFile(resourcePathLocal('file0.txt'),onFileChanged,onFileAdded);
    watcher.addFile(resourcePathLocal('file1.txt'),onFileChanged,onFileAdded);
    watcher.addFile(resourcePathLocal('file2.txt'),onFileChanged,onFileAdded);
});