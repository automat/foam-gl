var System          = require('../../../system/fSystem'),
    AbstractTexture = require('./fAbstractTexture');

function CanvasTexture(width,height)
{
    AbstractTexture.call(this);

    this._isDirty = false;
}

CanvasTexture.prototype = Object.create(AbstractTexture.prototype);

CanvasTexture.prototype.isDirty = function(){return this._isDirty;};

module.exports = CanvasTexture;