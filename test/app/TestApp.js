function TestApp(div)
{
    GLKit.Application.apply(this,arguments);

    this.setWindowSize(window.innerWidth,window.innerHeight);



}

TestApp.prototype = Object.create(GLKit.Application.prototype);

TestApp.prototype.update = function()
{


};

