/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */

function importGLKit(pathToGLKit)
{
    var string;
    var imports = ['glKit/glKit.js',
                   'glKit/app/glkProgShader.js',
                   'glKit/graphics/glkGL.js',
                   'glKit/app/glkWindow.js',
                   'glKit/app/glkApplication.js'];
    var i = -1;
    while(++i < imports.length)
    {
        string = '"'+ pathToGLKit + imports[i] + '"';
        document.write('<script type="text/javascript" src=' + string + '></script>' );
    }
}

importGLKit('../../../src/');

document.write('<script type="text/javascript" src="TestApplication.js"></script> ');
