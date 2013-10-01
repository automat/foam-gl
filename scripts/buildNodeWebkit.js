if(process.argv.length < 3)
{
    console.log('arg missing. Need pathToSrcFolder pathToBuildFolder pathToNodeWebKitExec(optional)');
    process.exit(1);
}

var fs         = require('fs'),
    spawn      = require('child_process').spawn;

var appFile        = 'app.js';
var pathSrc        = process.argv[2],
    pathBuild      = process.argv[3],
    pathNodeWebKit = process.argv[4],
    pathBin        = pathBuild + '/app.nw';

if(fs.readdirSync(pathSrc).indexOf(appFile) == -1){console.log('app.js is missing!');process.exit(1);}

var pathTemp = pathBuild + '/temp';

spawn('mkdir',
      ['temp'],
      {
          cwd:pathBuild
      }
      ).on('close',
      function()
      {
          spawn('browserify',
                [(pathSrc + '/' + appFile),
                '-i','plask',
                '-d','-o',(pathTemp + '/bundle.js')]).on('close',
                function()
                {
                    fs.writeFileSync((pathTemp + '/index.html'),
                                     "<!DOCTYPE html>" +
                                         "<html>" +
                                            "<head>" +
                                                "<title></title>" +
                                                 "<script src='bundle.js'></script>" +
                                                 "<style>html,body{margin: 0;padding: 0;}canvas{vertical-align: bottom;}</style>" +
                                            "</head>" +
                                            "<body></body>" +
                                            "</html>",{encoding:'utf8'});

                    //fix this
                    fs.writeFileSync((pathTemp + '/package.json'),
                                     JSON.stringify(
                                         {
                                             "main"        : "index.html",
                                             "name"        : "-",
                                             "description" : "-",
                                             "window" :
                                             {
                                                 "position"   : "center",
                                                 "toolbar"    : false,
                                                 "frame"      : false,
                                                 "min_width"  : 800,
                                                 "min_height" : 600
                                             }
                                         }));

                    spawn('zip',['-r',pathBin,'.'],{cwd:pathTemp}).on('close',
                          function()
                          {
                              spawn('rm',['-rf',pathTemp]).on('close',
                              function()
                              {
                                  if(!pathNodeWebKit){console.log('done.');return;}
                                  spawn('open',['-a',pathNodeWebKit,pathBin]).on('close',
                                  function(){console.log('done.')});
                              });
                          });
                });
      });
