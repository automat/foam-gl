GLKit.Material = function(ambient,diffuse,specular,shininess)
{
    ambient   = ambient || GLKit.Color.make(1.0,0.5,0.5,1.0);
    diffuse   = diffuse || GLKit.Color.BLACK();
    specular  = specular || GLKit.Color.BLACK();
    shininess = shininess || 1.0;

    this._ambient   = ambient;
    this._diffuse   = diffuse;
    this._specular  = specular;
    this._shininess = shininess;
};

GLKit.Material.prototype.setAmbient   = function(color)  {this._ambient = color;};
GLKit.Material.prototype.setAmbient3f = function(r,g,b)  {this._ambient[0] = r;this._ambient[1] = g;this._ambient[2] = b;};
GLKit.Material.prototype.setAmbient4f = function(r,g,b,a){this._ambient[0] = r;this._ambient[1] = g;this._ambient[2] = b;this._ambient[3] = a;};

GLKit.Material.prototype.setDiffuse   = function(color)  {this._diffuse = color;};
GLKit.Material.prototype.setDiffuse3f = function(r,g,b)  {this._diffuse[0] = r;this._diffuse[1] = g;this._diffuse[2] = b;};
GLKit.Material.prototype.setDiffuse4f = function(r,g,b,a){this._diffuse[0] = r;this._diffuse[1] = g;this._diffuse[2] = b;this._diffuse[3] = a;};

GLKit.Material.prototype.setSpecular   = function(color)  {this._specular = color;};
GLKit.Material.prototype.setSpecular3f = function(r,g,b)  {this._specular[0] = r;this._specular[1] = g;this._specular[2] = b;};
GLKit.Material.prototype.setSpecular4f = function(r,g,b,a){this._specular[0] = r;this._specular[1] = g;this._specular[2] = b;this._specular[3] = a;};

GLKit.Material.prototype.setShininess  = function(shininess){this._shininess = shininess};

GLKit.Material.prototype.getAmbient   = function(){return GLKit.Color.copy(this._ambient);};
GLKit.Material.prototype.getDiffuse   = function(){return GLKit.Color.copy(this._diffuse);};
GLKit.Material.prototype.getSpecular  = function(){return GLKit.Color.copy(this._specular);};
GLKit.Material.prototype.getShininess = function(){return this._shininess;};
