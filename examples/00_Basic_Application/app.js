var Foam = require('../../src/foam/foam.js');

function App() {
    Foam.Application.apply(this, arguments);

    this.setFPS(60);
    this.setWindowSize(800, 600);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
};

App.prototype.update = function () {
    var time = this.getSecondsElapsed(),
        zoom = 1 + Math.sin(time) * 0.25;


    console.log(time);
};



var app = new App();
