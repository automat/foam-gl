var System = {
    loadFile : function(file,callback){
        var request = new XMLHttpRequest();
        request.open('GET', file);
        request.onreadystatechange = function() {
            if(request.readyState == 4){
                if(request.status == 200){
                    callback(request.responseText);
                }
            }
        };
        request.send();
    },

    loadImage : function(file, callback){
        var image = new Image();
        image.addEventListener('load',callback(image));
        image.src = file;
    }
};

module.exports = System;








