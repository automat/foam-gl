var Foam = require('../../src/foam/foam.js');

function App() {
    Foam.Application.apply(this, arguments);

    this.setFPS(60);
    this.setWindowSize(800, 600);


    var gl = this.gl;

    //console.log(gl.viewport);
    gl.viewport(0,0,this.getWindowWidth,this.getWindowHeight());

}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    console.log('setup');
};

App.prototype.update = function () {
    var gl = this.gl;

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);


};


window.addEventListener('load',function(){
    var app = new App();
});
