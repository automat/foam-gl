var Foam = require('../../src/foam/Foam.js'),
    MouseEvent = Foam.MouseEvent,
    Mouse = Foam.Mouse;

var gl;

function App() {
    Foam.Application.apply(this, arguments);
}
App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function () {
    this.setWindowSize(800,600);
    gl = Foam.gl.get();

    Mouse.getInstance().addEventListener(MouseEvent.MOUSE_DOWN,this.onMouseDown.bind(this));
};

App.prototype.update = function () {
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mouse = Mouse.getInstance();

    console.log('Mouse down:     ' + mouse.isDown() + '\n' +
                '      pressed:  ' + mouse.isPressed() + '\n' +
                '      moved:    ' + mouse.didMove() + '\n' +
                '      dragged:  ' + mouse.isDragged() + '\n' +
                '      positionLast: ' + 'x: ' + mouse.getXLast() + ', y:' + mouse.getYLast() + '\n' +
                '      position:     ' + 'x: ' + mouse.getX() + ', y: ' + mouse.getY() + '\n' +
                '      didEnter: ' + mouse.didEnter() + '\n' +
                '      didLeave: ' + mouse.didLeave());
};

App.prototype.onMouseDown = function(event){
    console.log(event);
};

var app;

window.addEventListener('load',function(){
    app = new App();
});
