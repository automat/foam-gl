/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */


function TestApplication(parentDomElementId,width,height)
{
    GLKApplication.apply(this,arguments);

    this.setWindowSize(width,height);


}

TestApplication.prototype = Object.create(GLKApplication.prototype);

TestApplication.prototype.draw = function()
{

};