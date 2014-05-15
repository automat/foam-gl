var gl = {
    _obj: null,
    init : function(gl){
        this._obj = gl;
    },
    get: function () {
        return this._obj;
    }
};
module.exports = gl;