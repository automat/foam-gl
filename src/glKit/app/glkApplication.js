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
    this._ngl   = null;
    this.gl     = null;

    this._elapsedFrames    = 0;
    this._lastFrameTime    = Date.now();
    this._currFrameTime    = 0;
    this._elapsedFrameTime = 0;
}

GLKApplication.prototype =
{
    setWindowSize : function(width,height)
    {
        this.window.setSize(width,height);
        this.gl = new GLKGL(this.window.getGL());

        this._loop();
    },




    //override
    draw : function(){},

    _loop : function()
    {
        requestAnimationFrame(GLKApplication.prototype._loop.bind(this));

        this._elapsedFrames++;
        this._currFrameTime = Date.now();
        this._elapsedFrameTime = this._currFrameTime - this._lastFrameTime;

        this.draw();

        this._lastFrameTime = this._currFrameTime;
    },


    getSecondsElapsed :  function()
    {
        return this._elapsedFrameTime;
    },

    getFramesElapsed : function()
    {
        return this._elapsedFrames;
    }






};

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