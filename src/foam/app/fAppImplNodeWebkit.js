var AppImplWeb = require('./fAppImplWeb');

function AppImplNodeWebkit(){
    AppImplWeb.apply(this,arguments);
}

AppImplNodeWebkit.prototype = Object.create(AppImplWeb.prototype);

module.exports = AppImplNodeWebkit;
