var gl = {
    _obj: null,
    set : function(gl){
        this._obj = gl;
    },
    get: function () {
        return this._obj;
    }
};
module.exports = gl;