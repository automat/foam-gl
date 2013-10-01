//temp
if(process.argv.length < 4)
{
    console.log('arg missing. Need pathToAppjs pathToTempFolder');
    process.exit(1);
}

var fs    = require('fs'),
    spawn = require('child_process').spawn;

console(process.argv[2]);

/*
spawn('browserify',[])
  */