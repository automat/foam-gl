GLKit.WorkerLink = function(func)
{
    Worker.apply(this,func.toString());

};

GLKit.WorkerLink.prototype = Object.create(Worker.prototype);
