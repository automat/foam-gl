/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */





function GLKApplication(parentDomElementId)
{
    this.window = new GLKWindow(parentDomElementId);

    this.gl     = null;

    this.camera = null;

    this._fps = 60.0;




    /*---------------------------------------------------------------------------------------------------------*/
    // Timer
    /*---------------------------------------------------------------------------------------------------------*/

    this._framesElapsed    = 0;

    this._appTimeBegin   = new Date();
    this._appTimeCurr    = 0;
    this._appTimeElapsed = 0;

    /*---------------------------------------------------------------------------------------------------------*/
    // Mouse & Keyboard Listener
    /*---------------------------------------------------------------------------------------------------------*/

    this.mouse = glkVec2.make();
    this.mouseDown = false;
    this.mouseMove = false;
    this.mouseOut  = false;
    this.keyDown   = false;

    this._addListener();

    /*---------------------------------------------------------------------------------------------------------*/
    // Instance
    /*---------------------------------------------------------------------------------------------------------*/

    GLKApplication._instance = this;
}


GLKApplication.prototype =
{
    setWindowSize : function(width,height)
    {
        this.window.setSize(  width || glKit.MIN_WIDTH,
                             height || glKit.MIN_HEIGHT);

        this.gl     = new GLKGL(this.window.getGL());

        this.camera = new GLKCameraBasic();
        this.gl.setProjectionMatrix(this.camera._projectionMatrix);
        this.gl.setModelViewMatrix( this.camera._modelViewMatrix);



        this._updateGLViewport();
        this._loop();
    },

    /*------------------------------------------------------------------------------------------------------*/
    // Mouse & Keyboard Listener
    /*------------------------------------------------------------------------------------------------------*/

    _addListener : function()
    {

        var documentOnKeyDown = document.onkeydown || function(e){},
            documentOnKeyUp   = document.onkeyup   || function(e){};

        var canvas            = this.window.getCanvas(),
            canvasOnMouseDown = canvas.onmousedown || function(e){},
            canvasOnMouseUp   = canvas.onmouseup   || function(e){},
            canvasOnMouseOut  = canvas.onmouseout  || function(e){},
            canvasOnMouseMove = canvas.onmousemove || function(e){};

        document.onkeydown = function(e)
                             {
                                 documentOnKeyDown(e);
                                 this.keyDown = true;
                                 this.onKeyDown(e);

                             }.bind(this);

        document.onKeyUp   = function(e)
                             {
                                 documentOnKeyUp(e);
                                 this.keyDown = false;
                                 this.onKeyUp(e);

                             }.bind(this);

        canvas.onmousedown = function(e)
                             {
                                 canvasOnMouseDown(e);
                                 this.mouseDown = true;
                                 this.onMouseDown(e);

                             }.bind(this);

        canvas.onmouseup   = function(e)
                             {
                                 canvasOnMouseUp(e);
                                 this.mouseDown = false;
                                 this.onMouseUp(e);

                             }.bind(this);

        canvas.onmouseout  = function(e)
                             {
                                 canvasOnMouseOut(e);
                                 this.mouseOut = true;
                                 this.onMouseOut(e);

                             }.bind(this);

        canvas.onmousemove = function(e)
                             {
                                 canvasOnMouseMove(e);

                                 this.mouseMove = true;

                                 var mouse = this.mouse;

                                 if(e.pageX || e.pageY)
                                 {
                                     mouse.x = e.pageX;
                                     mouse.y = e.pageY;
                                 }
                                 else
                                 {
                                     mouse.x = e.clientX +
                                               (document.documentElement.scrollLeft ||
                                                document.body.scrollLeft) -
                                               document.documentElement.clientLeft;

                                     mouse.y = e.clientY +
                                               (document.documentElement.scrollTop ||
                                                document.body.scrollTop) -
                                                document.documentElement.clientTop;
                                 }

                                 this.onMouseMove(e);

                             }.bind(this);

        window.addEventListener('resize',this._onWindowResize.bind(this),false);
    },

    onKeyDown      : function(e){},
    onKeyUp        : function(e){},
    onMouseDown    : function(e){},
    onMouseUp      : function(e){},
    onMouseOut     : function(e){},
    onMouseMove    : function(e){},
    onWindowResize : function(){},

    _onWindowResize : function()
    {
        var w = this.window;

        if(!w.isWindowFullscreen())return;

        var width  = window.innerWidth,
            height = window.innerHeight;

        w.setSize(width,height);
        this._updateGLViewport();

        this.onWindowResize();
    },

    _updateGLViewport : function()
    {
        var gl = this.gl,
            w  = this.window;

        gl.viewport(0,0, w.getWidth(), w.getHeight());
        gl.clearColor(gl.getClearColor());

    },




    setFPS : function(value)
    {
        this._fps = value;
    },

    /*------------------------------------------------------------------------------------------------------*/
    // Update Loop
    /*------------------------------------------------------------------------------------------------------*/
    draw : function()
    {
        //basic scene setup

    },

    /*------------------------------------------------------------------------------------------------------*/
    // Intenal Update Loop
    /*------------------------------------------------------------------------------------------------------*/

    _loop : function()
    {
        this._appTimeCurr = new Date();
        this.draw();
        this._appTimeElapsed = (this._appTimeCurr - this._appTimeBegin) / 1000;
        this._framesElapsed++;

        this.mouseMove = false;
        this.mouseOut  = false;

        requestAnimationFrame(GLKApplication.prototype._loop.bind(this));

    },


    /*------------------------------------------------------------------------------------------------------*/
    // Timer
    /*------------------------------------------------------------------------------------------------------*/

    getSecondsElapsed :  function()
    {
        return this._appTimeElapsed;
    },

    getFramesElapsed : function()
    {
        return this._framesElapsed;
    },


    getAspectRatioWindow : function()
    {
        return this.window.getAspectRatio();
    }

};

/*------------------------------------------------------------------------------------------------------*/
// Instance
/*------------------------------------------------------------------------------------------------------*/

GLKApplication._instance = null;
GLKApplication.get = function(){return GLKApplication._instance;};

/*------------------------------------------------------------------------------------------------------*/

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                window.setTimeout( callback, 1000 / 60 );

            };

    } )();

}