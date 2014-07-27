var gl = require('./gl');

/**
 * Base class for all drawable objects.
 * @constructor
 */

function glObject(){
    /**
     * Reference to WebGLRenderingContext
     * @type {WebGLRenderingContext}
     * @protected
     */
    this._gl = gl.get();
}

module.exports = glObject;

