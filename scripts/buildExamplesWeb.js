//temp
var fs    = require('fs'),
    spawn = require('child_process').spawn;

var dirExamples = '../examples';
var dirNames = fs.readdirSync(dirExamples);
    dirNames.splice(dirNames.indexOf('template'),1);
    dirNames.splice('.DS_Store',1);

var src,dir,tar;

var i = -1;while(++i < dirNames.length)
{
    dir = dirExamples + '/' + dirNames[i];
    src = dir + '/app.js';
    tar = dir + '/bundle.js';

    console.log(src);
    spawn('browserify',[src,'-i','plask','-d','-o',tar]);
}
