var Foam = require('../../src/foam/Foam.js'),
    MouseEvent = Foam.MouseEvent,
    Mouse = Foam.Mouse,
    KeyEvent = Foam.KeyEvent,
    Keyboard = Foam.Keyboard;


var gl;

Foam.App.newOnLoad({
    setup : function(){
        this.setWindowSize(800,600);
        gl = Foam.gl.get();

        Mouse.getInstance().addEventListener(MouseEvent.MOUSE_DOWN,this.onMouseDown.bind(this));
        Keyboard.getInstance().addEventListener(KeyEvent.KEY_DOWN, this.onKeyDown.bind(this));
        Keyboard.getInstance().addEventListener(KeyEvent.KEY_PRESS, this.onKeyPress.bind(this));
    },

    update : function(){

        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        /*
         var mouse = Mouse.getInstance();

         console.log('Mouse down:     ' + mouse.isDown() + '\n' +
         '      pressed:  ' + mouse.isPressed() + '\n' +
         '      moved:    ' + mouse.didMove() + '\n' +
         '      dragged:  ' + mouse.isDragged() + '\n' +
         '      positionLast: ' + 'x: ' + mouse.getXLast() + ', y:' + mouse.getYLast() + '\n' +
         '      position:     ' + 'x: ' + mouse.getX() + ', y: ' + mouse.getY() + '\n' +
         '      didEnter: ' + mouse.didEnter() + '\n' +
         '      didLeave: ' + mouse.didLeave());
         */
    },

    onMouseDown : function(event) {
        console.log(event);
    },

    onKeyDown : function(event){
       console.log(event);
    },

    onKeyUp : function(event){
        console.log(event);
        //console.log(event);
    },

    onKeyPress : function(event){
        console.log(event.type);
    }

});