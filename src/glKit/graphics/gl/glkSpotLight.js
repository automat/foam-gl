GLKit.SpotLight = function(id)
{
    GLKit.DirectionalLight.apply(this,arguments);
};

GLKit.SpotLight.prototype = Object.create(GLKit.DirectionalLight.prototype);

GLKit.SpotLight.prototype.setExponent = function(){};
GLKit.SpotLight.prototype.setCutOff   = function(){};
