var _gl     = require('./gl'),
    Color   = require('../util/Color'),
    Program = require('./Program');

function Material(ambient, diffuse, specular, shininess, emission) {
    ambient   = ambient || new Color(1.0, 0.5, 0.5, 1.0);
    diffuse   = diffuse   || Color.black();
    specular  = specular || Color.black();
    shininess = shininess || 10.0;
    emission  = emission || Color.black();

    this._gl = _gl.get();

    this._enabled = true;

    this.emission = emission;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;

    this._tempF32 = new Float32Array(4);

    //Fix this

    this._uniformLocationEmissionKey  = Program.UNIFORM_MATERIAL_STRUCT + '.' + Program.UNIFORM_MATERIAL_STRUCT_EMISSION;
    this._uniformLocationAmbientKey   = Program.UNIFORM_MATERIAL_STRUCT + '.' + Program.UNIFORM_MATERIAL_STRUCT_AMBIENT;
    this._uniformLocationDiffuseKey   = Program.UNIFORM_MATERIAL_STRUCT + '.' + Program.UNIFORM_MATERIAL_STRUCT_DIFFUSE;
    this._uniformLocationSpecularKey  = Program.UNIFORM_MATERIAL_STRUCT + '.' + Program.UNIFORM_MATERIAL_STRUCT_SPECULAR;
    this._uniformLocationShininessKey = Program.UNIFORM_MATERIAL_STRUCT + '.' + Program.UNIFORM_MATERIAL_STRUCT_SHININESS;

    this._uniformLocationEmission =
        this._uniformLocationAmbient =
            this._uniformLocationDiffuse =
                this._uniformLocationSpecular =
                    this._uniformLocationShininess = null;

    this._programIdLast = null;
}

Material.prototype.enable = function(){
    this._enabled = true;
};

Material.prototype.disable = function(){
    this._enabled = false;
};

Material.prototype.apply = function(){
    if(!this._enabled){
        return;
    }
    var gl = this._gl;

    if(Program.getCurrent().getId() != this._programIdLast){
        var program   = Program.getCurrent(),
            programGl = program.getObjGL();
        this._uniformLocationEmission = gl.getUniformLocation(programGl,this._uniformLocationEmissionKey);
        this._uniformLocationAmbient  = gl.getUniformLocation(programGl,this._uniformLocationAmbientKey);
        this._uniformLocationDiffuse  = gl.getUniformLocation(programGl,this._uniformLocationDiffuseKey);
        this._uniformLocationSpecular = gl.getUniformLocation(programGl,this._uniformLocationSpecularKey);
        this._uniformLocationShininess= gl.getUniformLocation(programGl,this._uniformLocationShininessKey);
        this._programIdLast = program.getId();
    }

    var emission = this.emission,
        ambient = this.ambient,
        diffuse = this.diffuse,
        specular = this.specular;

    var tempF32 = this._tempF32;

    tempF32[0] = emission.r;
    tempF32[1] = emission.g;
    tempF32[2] = emission.b;
    tempF32[3] = emission.a;

    gl.uniform4fv(this._uniformLocationEmission, tempF32);

    tempF32[0] = ambient.r;
    tempF32[1] = ambient.g;
    tempF32[2] = ambient.b;
    tempF32[3] = ambient.a;

    gl.uniform4fv(this._uniformLocationAmbient, tempF32);

    tempF32[0] = diffuse.r;
    tempF32[1] = diffuse.g;
    tempF32[2] = diffuse.b;
    tempF32[3] = diffuse.a;

    gl.uniform4fv(this._uniformLocationDiffuse, tempF32);

    tempF32[0] = specular.r;
    tempF32[1] = specular.g;
    tempF32[2] = specular.b;
    tempF32[3] = specular.a;

    gl.uniform4fv(this._uniformLocationSpecular, tempF32);

    gl.uniform1f(this._uniformLocationShininess, this.shininess);
}

module.exports = Material;
