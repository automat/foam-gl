GLKit.DirectionalLight = function(id)
{
    GLKit.Light.apply(this,arguments);
};

GLKit.DirectionalLight.prototype = Object.create(GLKit.DirectionalLight.prototype);

GLKit.DirectionalLight.prototype.setDirection   = function(v)    {GLKit.Vec3.set(this.direction,v);};
GLKit.DirectionalLight.prototype.setDirection3f = function(x,y,z){GLKit.Vec3.set3f(this.direction,x,y,z);};

GLKit.DirectionalLight.prototype.lookAt         = function(position,target)
{
    this.setPosition(position);
    this.setDirection(GLKit.Vec3.normalize(GLKit.subbed(target,position)));
};