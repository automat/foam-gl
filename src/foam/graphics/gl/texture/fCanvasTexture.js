var System          = require('../../../system/fSystem'),
    AbstractTexture = require('./fAbstractTexture'),
//temp plask
    plask = require('plask');

//initial test version
function CanvasTexture(width,height)
{
    AbstractTexture.call(this);

    this._windowWidth  = width;
    this._windowHeight = height;

    var canvas = this._data    = plask.SkCanvas.create(width,height);
        canvas.drawColor(255,255,255,0);

    var paintFont = new plask.SkPaint;
        paintFont.setColor(255,255,255);
        paintFont.setTextSize(11);
        paintFont.setFontFamily('Menlo');

    var paintBg = new plask.SkPaint;
        paintBg.setColor(0,0,0,0.5 * 255);

        canvas.drawRoundRect(paintBg, 0,0, width, height, 2, 2);

        canvas.drawText(paintFont,'HELLO',10,20);


    this._isDirty = false;
}

CanvasTexture.prototype = Object.create(AbstractTexture.prototype);

CanvasTexture.prototype.isDirty = function(){return this._isDirty;};

module.exports = CanvasTexture;