var System = {
    loadFile : function(file,callback){
        var client = new XMLHttpRequest();
        client.open('GET', file);
        client.onreadystatechange = function() {
            switch (client.readyState){
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    callback(client.responseText);
                    break;
            }
        };
        client.send();
    },

    loadImage : function(file, callback){
        var image = new Image();
        image.addEventListener('load',callback(image));
        image.src = file;
    }
};

module.exports = System;








