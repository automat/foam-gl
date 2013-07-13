GLKit.Light = function(id)
{
    this._id = id;

    this._ambient  = GLKit.Color.WHITE();
    this._diffuse  = GLKit.Color.WHITE();
    this._specular = GLKit.Color.WHITE();

    this._position = GLKit.Vec3.ZERO();
};


GLKit.Light.prototype.setAmbient   = function(color)  {this._ambient = color;};
GLKit.Light.prototype.setAmbient3f = function(r,g,b)  {this._ambient[0] = r;this._ambient[1] = g;this._ambient[2] = b;};
GLKit.Light.prototype.setAmbient4f = function(r,g,b,a){this._ambient[0] = r;this._ambient[1] = g;this._ambient[2] = b;this._ambient[3] = a;};

GLKit.Light.prototype.setDiffuse   = function(color)  {this._diffuse = color;};
GLKit.Light.prototype.setDiffuse3f = function(r,g,b)  {this._diffuse[0] = r;this._diffuse[1] = g;this._diffuse[2] = b;};
GLKit.Light.prototype.setDiffuse4f = function(r,g,b,a){this._diffuse[0] = r;this._diffuse[1] = g;this._diffuse[2] = b;this._diffuse[3] = a;};

GLKit.Light.prototype.setSpecular   = function(color)  {this._specular = color;};
GLKit.Light.prototype.setSpecular3f = function(r,g,b)  {this._specular[0] = r;this._specular[1] = g;this._specular[2] = b;};
GLKit.Light.prototype.setSpecular4f = function(r,g,b,a){this._specular[0] = r;this._specular[1] = g;this._specular[2] = b;this._specular[3] = a;};

GLKit.Light.prototype.getAmbient   = function(){return GLKit.Color.copy(this._ambient);};
GLKit.Light.prototype.getDiffuse   = function(){return GLKit.Color.copy(this._diffuse);};
GLKit.Light.prototype.getSpecular  = function(){return GLKit.Color.copy(this._specular);};

GLKit.Light.prototype.setPosition   = function(v){GLKit.Vec3.set(this._position,v);};
GLKit.Light.prototype.setPosition3f = function(x,y,z){GLKit.Vec3.set3f(this._position,x,y,z);};
GLKit.Light.prototype.getPosition   = function(){return GLKit.Vec3.copy(this._position);};