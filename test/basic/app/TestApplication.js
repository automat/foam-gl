/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function TestApplication(parentDomElementId)
{
    GLKApplication.apply(this,arguments);

    this.setWindowSize(window.innerWidth,window.innerHeight);
    this.setFPS(60.0);
}

TestApplication.prototype = Object.create(GLKApplication.prototype);


TestApplication.prototype.draw = function()
{
    var gl = this.gl;

    gl.clear();




};

TestApplication.prototype.onMouseMove = function(e)
{


};
